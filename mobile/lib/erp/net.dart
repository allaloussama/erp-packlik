import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../config.dart';

class ErpError implements Exception {
  ErpError(this.message, [this.status = 0]);
  final String message;
  final int status;
  @override
  String toString() => message;
}

/// Appels à l'API du site (`api/?r=…`) avec la session de l'équipe : le cookie de session PHP est gardé sur le
/// téléphone (on reste connecté après fermeture de l'application) et chaque écriture porte le jeton CSRF,
/// exactement comme le navigateur.
class ErpNet {
  ErpNet(this._prefs, [http.Client? client]) : _c = client ?? http.Client();
  final SharedPreferences _prefs;
  final http.Client _c;
  String? csrf;

  static const _cookieKey = 'erp_cookies';
  static const _attrs = {'expires', 'path', 'domain', 'max-age', 'samesite', 'secure', 'httponly'};

  Map<String, String> get _cookies {
    try {
      return (jsonDecode(_prefs.getString(_cookieKey) ?? '{}') as Map).cast<String, String>();
    } catch (_) {
      return {};
    }
  }

  void _keepCookies(String? header) {
    if (header == null || header.isEmpty) return;
    final jar = _cookies;
    // le paquet http joint plusieurs Set-Cookie par des virgules ; les dates « Expires=Thu, 01 Jan… » n'ont pas de « nom= » après la virgule
    for (final m in RegExp(r'(?:^|,)\s*([A-Za-z0-9_\-.]+)=([^;,]*)').allMatches(header)) {
      final name = m.group(1)!, value = m.group(2)!;
      if (_attrs.contains(name.toLowerCase())) continue;
      if (value.isEmpty || value == 'deleted') {
        jar.remove(name);
      } else {
        jar[name] = value;
      }
    }
    _prefs.setString(_cookieKey, jsonEncode(jar));
  }

  void forgetSession() {
    _prefs.remove(_cookieKey);
    csrf = null;
  }

  /// Envoi d'une photo (api/?r=upload, comme uploadFile() du site). Renvoie l'adresse du fichier enregistré.
  Future<String> upload(List<int> bytes, String filename) async {
    final req = http.MultipartRequest('POST', Uri.parse(kBaseUrl).resolve('api/?r=upload'))
      ..headers.addAll({
        'Accept': 'application/json',
        if (_cookies.isNotEmpty) 'Cookie': _cookies.entries.map((e) => '${e.key}=${e.value}').join('; '),
        'X-CSRF': ?csrf,
      })
      ..files.add(http.MultipartFile.fromBytes('file', bytes, filename: filename));
    http.Response r;
    try {
      r = await http.Response.fromStream(await _c.send(req).timeout(const Duration(seconds: 90)));
    } catch (_) {
      throw ErpError('Envoi impossible : vérifiez la connexion');
    }
    dynamic j;
    try {
      j = jsonDecode(utf8.decode(r.bodyBytes));
    } catch (_) {}
    if (r.statusCode >= 400 || j is! Map || j['url'] == null) throw ErpError(j is Map && j['error'] != null ? '${j['error']}' : 'Envoi impossible', r.statusCode);
    return '${j['url']}';
  }

  Future<dynamic> call(String route, [Object? body]) async {
    final uri = Uri.parse(kBaseUrl).resolve('api/?r=$route');
    final jar = _cookies;
    final headers = <String, String>{
      'Accept': 'application/json',
      if (jar.isNotEmpty) 'Cookie': jar.entries.map((e) => '${e.key}=${e.value}').join('; '),
      if (body != null) 'Content-Type': 'application/json',
      if (body != null && csrf != null) 'X-CSRF': csrf!,
    };
    http.Response r;
    try {
      r = await (body == null ? _c.get(uri, headers: headers) : _c.post(uri, headers: headers, body: jsonEncode(body)))
          .timeout(const Duration(seconds: 40));
    } catch (_) {
      throw ErpError('Connexion au serveur impossible');
    }
    _keepCookies(r.headers['set-cookie']);
    dynamic j;
    try {
      j = jsonDecode(utf8.decode(r.bodyBytes));
    } catch (_) {}
    if (r.statusCode >= 400) {
      throw ErpError(j is Map && j['error'] != null ? '${j['error']}' : 'Erreur serveur (${r.statusCode})', r.statusCode);
    }
    return j;
  }
}
