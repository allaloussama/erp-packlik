import 'dart:convert';

import 'package:http/http.dart' as http;

import 'config.dart';
import 'models.dart';

class ApiException implements Exception {
  ApiException(this.message);
  final String message;
  @override
  String toString() => message;
}

/// Appels à l'API publique du site (les mêmes que la boutique web).
class Api {
  Api([http.Client? client]) : _c = client ?? http.Client();
  final http.Client _c;

  Uri _u(String route) => Uri.parse(kBaseUrl).resolve('api/?r=$route');

  Future<Map<String, dynamic>> _json(http.Response r) async {
    final body = utf8.decode(r.bodyBytes);
    final j = body.isEmpty ? <String, dynamic>{} : jsonDecode(body);
    if (r.statusCode >= 400 || j is! Map) {
      throw ApiException(j is Map && j['error'] != null ? '${j['error']}' : 'Erreur ${r.statusCode}');
    }
    return j.cast<String, dynamic>();
  }

  /// Catalogue, wilayas, réglages publics (catégories, slides, formulaire, en-tête).
  Future<Catalog> catalog() async {
    try {
      final r = await _c.get(_u('boot'), headers: {'Accept': 'application/json'}).timeout(const Duration(seconds: 25));
      return Catalog.fromBoot(await _json(r));
    } on ApiException {
      rethrow;
    } catch (_) {
      throw ApiException('Connexion impossible. Vérifiez internet puis réessayez.');
    }
  }

  /// Commande à la livraison : le serveur recalcule prix, frais et numéro.
  Future<OrderResult> order({
    required String name,
    required String phone,
    required int wilaya,
    required String commune,
    required String address,
    required String delivery,
    required String note,
    required List<CartLine> items,
  }) async {
    final r = await _c
        .post(_u('order'),
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: jsonEncode({
              'name': name, 'phone': phone, 'wilaya': wilaya, 'commune': commune, 'address': address,
              'delivery': delivery, 'note': note, 'website': '', 'platform': '',
              'items': items.map((l) => {'pid': l.pid, 'v': l.v, 'q': l.q}).toList(),
            }))
        .timeout(const Duration(seconds: 30));
    final j = await _json(r);
    final o = (j['order'] as Map?)?.cast<String, dynamic>() ?? const {};
    return OrderResult(ref: '${j['ref'] ?? ''}', subtotal: _subtotal(o));
  }

  /// Sous-total décidé par le serveur (prix et paliers vérifiés côté serveur).
  static int _subtotal(Map<String, dynamic> o) {
    final items = (o['items'] as List?) ?? const [];
    return items.fold<num>(0, (s, i) => s + ((i as Map)['price'] as num? ?? 0) * (i['q'] as num? ?? 0)).round();
  }
}

class OrderResult {
  const OrderResult({required this.ref, required this.subtotal});
  final String ref;
  final int subtotal;
}
