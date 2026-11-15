import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/foundation.dart';

import 'net.dart';

typedef Doc = Map<String, dynamic>;

/// Les collections de l'ERP, comme `COLLS` dans assets/backend.js.
const kColls = [
  'products', 'orders', 'customers', 'users', 'teams', 'suppliers', 'purchases', 'sup_payments', 'dhd_payments',
  'cashboxes', 'cash_moves', 'advances', 'expenses', 'ad_spend', 'stock_moves', 'activity', 'notifs', 'carriers',
  'couriers', 'pixels', 'wilayas',
];
const kKv = ['settings', 'pixel_events', 'meta'];

String keyOf(Doc r) => '${r['id'] ?? r['_id']}';
final _rnd = Random();
String uid() => DateTime.now().millisecondsSinceEpoch.toRadixString(36) + _rnd.nextInt(1 << 30).toRadixString(36);

/// Données de l'ERP gardées en mémoire et synchronisées avec le serveur : même protocole que le site
/// (`boot`, puis `sync` avec `since` / `up` / `del`, révision par document, rejet si modifié ailleurs).
/// Les documents restent des Map JSON complètes : aucun champ du site n'est perdu à l'aller-retour.
class ErpStore extends ChangeNotifier {
  ErpStore(this.net);
  final ErpNet net;

  final Map<String, List<Doc>> c = {for (final k in kColls) k: <Doc>[]};
  final Map<String, Doc> kv = {for (final k in kKv) k: <String, dynamic>{'_key': k}};
  final Map<String, Map<String, String>> _snap = {for (final k in [...kColls, 'kv']) k: {}};
  final Map<String, Map<String, int>> _revs = {for (final k in [...kColls, 'kv']) k: {}};
  int _rev = 0;

  bool booted = false;
  bool offline = false;
  String? bootError;
  Doc? user; // {id, name, role}
  String get role => '${user?['role'] ?? 'public'}';
  int get uidMe => (user?['id'] as num?)?.toInt() ?? 0;

  // index (reindex)
  final Map<int, Doc> pby = {}, cby = {}, uby = {}, wby = {}, cub = {};
  final Map<String, Doc> crb = {};

  List<Doc> get products => c['products']!;
  List<Doc> get allOrders => c['orders']!;
  /// commandes hors corbeille (comme ORDERS sur le site ; TRASHED à part)
  List<Doc> get orders => allOrders.where((o) => o['trashedAt'] == null).toList();
  List<Doc> get customers => c['customers']!;
  List<Doc> get users => c['users']!;
  Doc get settings => kv['settings']!;
  Doc get me => uby[uidMe] ?? {'id': uidMe, 'name': user?['name'] ?? '—', 'role': role};

  void reindex() {
    void fill(Map<int, Doc> m, List<Doc> l) {
      m.clear();
      for (final x in l) {
        final id = (x['id'] as num?)?.toInt();
        if (id != null) m[id] = x;
      }
    }
    fill(pby, products);
    fill(cby, customers);
    fill(uby, users);
    fill(wby, c['wilayas']!);
    fill(cub, c['couriers']!);
    crb
      ..clear()
      ..addEntries(c['carriers']!.map((x) => MapEntry('${x['id']}', x)));
    int byId(Doc a, Doc b) => ((a['id'] as num?) ?? 0).compareTo((b['id'] as num?) ?? 0);
    int recent(Doc a, Doc b) => ((b['at'] as num?) ?? 0).compareTo((a['at'] as num?) ?? 0);
    for (final k in ['products', 'orders', 'customers', 'users', 'wilayas']) {
      c[k]!.sort(byId);
    }
    for (final k in ['cash_moves', 'stock_moves', 'activity', 'notifs']) {
      c[k]!.sort(recent);
    }
  }

  static void _normDoc(String coll, Doc d) {
    if (coll == 'orders') {
      if (d['times'] is! Map) d['times'] = <String, dynamic>{};
      for (final k in ['items', 'initial', 'attempts', 'history']) {
        if (d[k] is! List) d[k] = <dynamic>[];
      }
    }
  }

  /// Applique des documents venus du serveur : [collection, id, rev, doc|null] (port de applyDocs()).
  bool _apply(List<dynamic> list, Map<String, String>? sent, bool force) {
    var changed = false;
    final idx = <String, Map<String, Doc>>{};
    for (final row in list) {
      final r = row as List;
      final coll = '${r[0]}', id = '${r[1]}', rev = (r[2] as num?)?.toInt() ?? 0;
      final d = r[3] is Map ? (r[3] as Map).cast<String, dynamic>() : null;
      if (coll == 'kv') {
        final o = kv[id];
        if (o != null && d != null) {
          final j = jsonEncode(d);
          if (jsonEncode(o) != j) {
            o
              ..clear()
              ..addAll(d);
            changed = true;
          }
          _snap['kv']![id] = j;
          _revs['kv']![id] = rev;
        }
        continue;
      }
      final arr = c[coll];
      if (arr == null) continue;
      final m = idx[coll] ??= {for (final x in arr) keyOf(x): x};
      final cur = m[id];
      if (d == null) {
        if (cur != null) {
          arr.remove(cur);
          m.remove(id);
          changed = true;
        }
        _snap[coll]!.remove(id);
        _revs[coll]!.remove(id);
        continue;
      }
      _normDoc(coll, d);
      final j = jsonEncode(d);
      _revs[coll]![id] = rev;
      if (cur != null) {
        final local = jsonEncode(cur);
        final base = sent != null && sent.containsKey('$coll/$id') ? sent['$coll/$id'] : _snap[coll]![id];
        final touched = !force && local != base; // retouché ici pendant l'aller-retour : on garde la version locale
        if (!touched && local != j) {
          cur
            ..clear()
            ..addAll(d);
          changed = true;
        }
      } else {
        arr.add(d);
        m[id] = d;
        changed = true;
      }
      _snap[coll]![id] = j;
    }
    if (changed) reindex();
    return changed;
  }

  void _clear() {
    for (final l in c.values) {
      l.clear();
    }
    for (final k in kKv) {
      kv[k] = {'_key': k};
    }
    for (final m in _snap.values) {
      m.clear();
    }
    for (final m in _revs.values) {
      m.clear();
    }
    _rev = 0;
    user = null;
    reindex();
  }

  Future<void> boot() async {
    bootError = null;
    try {
      final b = (await net.call('boot') as Map).cast<String, dynamic>();
      _clear();
      net.csrf = b['csrf'] as String?;
      _rev = (b['rev'] as num?)?.toInt() ?? 0;
      final list = <List<dynamic>>[];
      ((b['data'] as Map?) ?? {}).forEach((coll, rows) {
        for (final x in (rows as List)) {
          final r = x as List;
          list.add([coll, r[0], r[1], r[2]]);
        }
      });
      _apply(list, null, true);
      reindex();
      user = b['user'] is Map ? (b['user'] as Map).cast<String, dynamic>() : null;
      offline = false;
      _startTimer();
    } on ErpError catch (e) {
      bootError = e.message;
    }
    booted = true;
    notifyListeners();
  }

  Future<String?> login(String email, String password) async {
    try {
      net.forgetSession();
      await net.call('login', {'email': email.trim(), 'password': password});
      await boot();
      if (user == null) return bootError ?? 'Connexion impossible';
      return null;
    } on ErpError catch (e) {
      return e.message;
    }
  }

  Future<void> logout() async {
    await syncNow();
    try {
      await net.call('logout', {});
    } catch (_) {}
    net.forgetSession();
    _timer?.cancel();
    _clear();
    notifyListeners();
  }

  // ---------- synchronisation ----------
  bool _busy = false, _again = false;
  Timer? _debounce, _timer;
  final Set<String> quiet = {};
  final _rejectedCtl = StreamController<String>.broadcast();
  /// Messages à afficher (modification refusée par le serveur, hors ligne, connexion rétablie).
  Stream<String> get messages => _rejectedCtl.stream;

  void _startTimer() {
    _timer?.cancel();
    if (user != null) _timer = Timer.periodic(const Duration(seconds: 10), (_) => syncNow());
  }

  /// À appeler après chaque modification locale : l'écran se redessine et l'envoi part 0,4 s plus tard.
  void touch() {
    notifyListeners();
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), syncNow);
  }

  /// Envoie ce qui a changé ici, reçoit ce qui a changé ailleurs (port de syncNow()).
  Future<void> syncNow() async {
    if (user == null) return;
    if (_busy) {
      _again = true;
      return;
    }
    _busy = true;
    try {
      final up = <Map<String, dynamic>>[], del = <Map<String, dynamic>>[];
      final sent = <String, String>{};
      for (final e in c.entries) {
        final seen = <String>{};
        for (final r in e.value) {
          if (r['id'] == null && r['_id'] == null) r['_id'] = uid();
          final id = keyOf(r), j = jsonEncode(r);
          seen.add(id);
          if (_snap[e.key]![id] != j) {
            up.add({'c': e.key, 'id': id, 'd': r, 'base': _revs[e.key]![id] ?? 0});
            sent['${e.key}/$id'] = j;
          }
        }
        for (final id in _snap[e.key]!.keys) {
          if (!seen.contains(id)) del.add({'c': e.key, 'id': id});
        }
      }
      if (role == 'admin') {
        kv.forEach((id, o) {
          final j = jsonEncode(o);
          if (_snap['kv']![id] != j) {
            up.add({'c': 'kv', 'id': id, 'd': o, 'base': _revs['kv']![id] ?? 0});
            sent['kv/$id'] = j;
          }
        });
      }
      if (del.length > 200) del.clear(); // garde-fou du site : une suppression massive est presque toujours un bug
      var remote = false;
      final rejected = <List<dynamic>>[];
      for (var i = 0; i == 0 || i < up.length; i += 300) {
        final res = (await net.call('sync', {
          'since': _rev,
          'up': up.sublist(i, min(i + 300, up.length)),
          'del': i == 0 ? del : [],
        }) as Map)
            .cast<String, dynamic>();
        remote = _apply((res['changes'] as List?) ?? [], sent, false) || remote;
        final rj = ((res['rejected'] as List?) ?? []).cast<List<dynamic>>();
        if (rj.isNotEmpty) {
          _apply(rj, null, true);
          rejected.addAll(rj);
          remote = true;
        }
        _rev = (res['rev'] as num?)?.toInt() ?? _rev;
      }
      if (rejected.any((r) => !quiet.contains('${r[0]}/${r[1]}'))) {
        _rejectedCtl.add('Une modification n\'a pas été enregistrée : droits insuffisants ou élément modifié par un autre poste.');
      }
      quiet.clear();
      if (offline) {
        offline = false;
        _rejectedCtl.add('Connexion rétablie');
        remote = true;
      }
      if (remote) notifyListeners();
    } on ErpError catch (e) {
      if (e.status == 401 || e.status == 403) {
        // session expirée : retour à l'écran de connexion
        net.forgetSession();
        _timer?.cancel();
        _clear();
        notifyListeners();
      } else if (!offline) {
        offline = true;
        _rejectedCtl.add('Hors ligne : vos modifications seront envoyées au retour de la connexion.');
        notifyListeners();
      }
    } finally {
      _busy = false;
      if (_again) {
        _again = false;
        touch();
      }
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _debounce?.cancel();
    _rejectedCtl.close();
    super.dispose();
  }
}
