import 'dart:math';

import 'package:flutter/material.dart';

import 'net.dart';
import 'rules2.dart';
import 'store.dart';

/// Règles métier de l'ERP, portées telles quelles depuis le site (assets/app.js, kando.js, documents.js, livreur.js).
/// Toute modification d'une commande passe par ici pour donner exactement le même résultat que sur le web.

const kMin = 60000, kHour = 3600000, kDay = 86400000;
int now() => DateTime.now().millisecondsSinceEpoch;
num n(Object? v) => v is num ? v : num.tryParse('${v ?? ''}') ?? 0;
int ni(Object? v) => n(v).round();
String s(Object? v) => v == null ? '' : '$v';
Doc m(Object? v) => v is Map ? v.cast<String, dynamic>() : <String, dynamic>{};
List<dynamic> l(Object? v) => v is List ? v : const [];

Color hex(String h) {
  final x = h.replaceAll('#', '');
  return Color(int.tryParse(x.length == 6 ? 'FF$x' : x, radix: 16) ?? 0xFF999999);
}

// ---------- statuts ----------
const kStatus = <String, (String, String)>{
  'new': ('Nouvelle', 'blue'), 'calling': ('En appel', 'violet'), 'unreach': ('Injoignable', 'amber'),
  'callback': ('Rappel programmé', 'kraft'), 'cancelled': ('Annulée', 'red'), 'toprep': ('À préparer', 'kraft'),
  'ready': ('Prête', 'green'), 'sent': ('Envoyée à DHD', 'blue'), 'picked': ('Ramassée', 'blue'), 'transit': ('En transit', 'blue'),
  'outfor': ('En livraison', 'blue'), 'failed': ('Tentative échouée', 'red'), 'delivered': ('Livrée', 'green'),
  'returning': ('Retour en cours', 'red'), 'returned': ('Retournée', 'red'), 'paid': ('Payée par DHD', 'green'), 'closed': ('Clôturée', 'dark'),
};
const kStep = <String, (String, String)>{
  'sent': ('Prête à expédier', '#80BCBD'), 'picked': ('Ramassée', '#5FA8D3'), 'transit': ('En transit', '#4A90C2'),
  'outfor': ('En livraison', '#FFA447'), 'failed': ('Tentative échouée', '#E8A33D'), 'delivered': ('Livrée', '#2FBF4A'),
  'returning': ('Retour vers centre', '#D9822B'), 'returned': ('Retournée', '#E23024'), 'paid': ('Encaissée', '#1F8A3B'), 'closed': ('Clôturée', '#0F2B46'),
};
final kShipSt = kStep.keys.toList();
const kPreSt = ['new', 'calling', 'unreach', 'callback', 'cancelled', 'toprep', 'ready'];
const kConfSt = ['new', 'calling', 'unreach', 'callback'];
const kCancelReasons = ['Refus', 'Prix', 'Doublon', 'Faux numéro', 'Hors zone', 'Rupture de stock', 'Autre'];
const kFailReasons = <(String, String)>[
  ('unreach', 'Client injoignable'), ('postponed', 'Client reporté'), ('phoneoff', 'Téléphone éteint / faux'),
  ('address', 'Adresse incorrecte'), ('absent', 'Client absent'), ('refused', 'Refus du colis'), ('damaged', 'Colis endommagé'),
];
String failName(String id) => kFailReasons.firstWhere((f) => f.$1 == id, orElse: () => (id, id)).$2;
const kLvTodo = ['sent', 'picked', 'transit', 'outfor', 'failed'];

const _kc = (teal: '#80BCBD', orange: '#FFA447', green: '#39FF14', red: '#E23024', purple: '#9D76C1', black: '#040D12', navy: '#0F2B46', gray: '#9ca3af');
final kDef = <String, List<Doc>>{
  'conf': [
    {'id': 'pending', 'label': 'En attente', 'color': _kc.teal, 'kind': 'pending'},
    {'id': 'fail01', 'label': 'Échec 01', 'color': _kc.orange, 'kind': 'fail', 'n': 1},
    {'id': 'fail02', 'label': 'Échec 02', 'color': _kc.orange, 'kind': 'fail', 'n': 2},
    {'id': 'fail03', 'label': 'Échec 03', 'color': _kc.orange, 'kind': 'fail', 'n': 3},
    {'id': 'confirmed', 'label': 'Confirmée', 'color': _kc.green, 'kind': 'confirm'},
    {'id': 'cancelled', 'label': 'Annulée', 'color': _kc.red, 'kind': 'cancel'},
    {'id': 'postponed', 'label': 'Reporté', 'color': _kc.purple, 'kind': 'callback'},
    {'id': 'duplicate', 'label': 'Dupliquer', 'color': _kc.black, 'kind': 'cancel', 'reason': 'Doublon'},
    {'id': 'fail04', 'label': 'Échec 04', 'color': _kc.orange, 'kind': 'fail', 'n': 4},
    {'id': 'fail05', 'label': 'Échec 05', 'color': _kc.orange, 'kind': 'fail', 'n': 5},
    {'id': 'wrongNumber', 'label': 'Mauvais numéro', 'color': _kc.navy, 'kind': 'cancel', 'reason': 'Faux numéro'},
    {'id': 'wrongCommune', 'label': 'Mauvaise commune', 'color': _kc.navy, 'kind': 'cancel', 'reason': 'Hors zone'},
    {'id': 'smsSent', 'label': 'SMS envoyé', 'color': _kc.navy, 'kind': 'pending'},
    {'id': 'toConfirmLater', 'label': 'À confirmer plus tard', 'color': _kc.navy, 'kind': 'callback'},
    {'id': 'outOfStock', 'label': 'Rupture de stock', 'color': _kc.navy, 'kind': 'cancel', 'reason': 'Rupture de stock'},
  ],
  'fin': [
    {'id': 'fin_select', 'label': 'Sélectionner statut', 'color': _kc.gray},
    {'id': 'fin_unpaid', 'label': 'Non payé', 'color': _kc.red},
    {'id': 'fin_partial', 'label': 'Acompte', 'color': _kc.orange},
    {'id': 'fin_paid', 'label': 'Payé', 'color': '#2FBF4A'},
    {'id': 'fin_refunded', 'label': 'Remboursé', 'color': _kc.purple},
  ],
};
const kKindLabel = {'pending': 'En attente', 'fail': 'Échec (injoignable)', 'callback': 'Reporté (rappel)', 'confirm': 'Confirmée', 'cancel': 'Annulée'};

// ---------- menus par rôle (MENUS du site, livreur compris) ----------
typedef MenuItem = ({String key, IconData icon, String label, String badge});
MenuItem _i(String k, IconData i, String l, [String b = '']) => (key: k, icon: i, label: l, badge: b);
final kMenus = <String, List<(String, List<MenuItem>)>>{
  'admin': [
    ('', [
      _i('dashboard', Icons.space_dashboard_outlined, 'Tableau de bord'), _i('produits', Icons.inventory_2_outlined, 'Produits'),
      _i('stock', Icons.layers_outlined, 'Gestion de stock', 'low'), _i('livraison', Icons.local_shipping_outlined, 'Livraison'),
      _i('meta', Icons.ads_click, 'Coût Meta'), _i('pixels', Icons.track_changes, 'Pixels Facebook et TikTok'),
      _i('equipe', Icons.badge_outlined, 'Équipe et accès'), _i('stats', Icons.bar_chart, 'Statistiques'),
      _i('fournisseurs', Icons.factory_outlined, 'Fournisseurs'), _i('clients', Icons.people_outline, 'Clients'),
      _i('achats', Icons.description_outlined, 'Achats'), _i('finance', Icons.account_balance_wallet_outlined, 'Finance'),
      _i('compta', Icons.menu_book_outlined, 'Comptabilité'),
    ]),
    ('Commandes', [
      _i('confirmer', Icons.headset_mic_outlined, 'Commandes à confirmer', 'conf'), _i('suivi', Icons.local_shipping_outlined, 'Suivi des commandes'),
      _i('documents', Icons.receipt_long_outlined, 'Factures et documents'),
    ]),
    ('Système', [
      _i('site', Icons.storefront_outlined, 'Boutique : slides, formulaire, pages'), _i('repartition', Icons.shuffle, 'Répartition des agents'),
      _i('modules', Icons.grid_view, 'Modules'), _i('parametres', Icons.settings_outlined, 'Paramètres'), _i('journal', Icons.history, 'Journal d\'activité'),
    ]),
  ],
  'gerant': [
    ('Opérations', [
      _i('dashboard', Icons.space_dashboard_outlined, 'Tableau de bord'), _i('preparation', Icons.inventory_2_outlined, 'Préparation', 'prep'),
      _i('expedition', Icons.local_shipping_outlined, 'Expédition', 'ready'), _i('suivi', Icons.layers_outlined, 'Suivi des commandes'),
      _i('retours', Icons.undo, 'Retours', 'ret'), _i('livraison', Icons.local_shipping_outlined, 'Livraison'),
    ]),
    ('Stock et achats', [
      _i('stock', Icons.layers_outlined, 'Gestion de stock', 'low'), _i('achats', Icons.description_outlined, 'Achats'), _i('produits', Icons.grid_view, 'Produits'),
    ]),
  ],
  'manager': [
    ('Centre d\'appel', [
      _i('dashboard', Icons.space_dashboard_outlined, 'Tableau de bord équipe'), _i('file', Icons.drag_indicator, 'File globale', 'conf'),
      _i('confirmer', Icons.headset_mic_outlined, 'Commandes à confirmer'), _i('cas', Icons.flag_outlined, 'Cas difficiles', 'hard'),
    ]),
    ('Pilotage', [
      _i('repartition', Icons.shuffle, 'Répartition'), _i('classement', Icons.emoji_events_outlined, 'Classement et objectifs'),
      _i('clients', Icons.people_outline, 'Clients'), _i('equipe', Icons.badge_outlined, 'Mon équipe'), _i('journal', Icons.history, 'Journal (mes agents)'),
    ]),
  ],
  'agent': [
    ('Mon espace', [
      _i('mafile', Icons.headset_mic_outlined, 'Ma file', 'mine'), _i('appel', Icons.phone_outlined, 'Écran d\'appel'),
      _i('rappels', Icons.event_outlined, 'Mes rappels', 'cb'), _i('livraisons', Icons.local_shipping_outlined, 'Mes livraisons', 'myfail'),
      _i('perfs', Icons.track_changes, 'Mes performances'),
    ]),
  ],
  'fournisseur': [
    ('Portail fournisseur', [
      _i('dashboard', Icons.space_dashboard_outlined, 'Tableau de bord'), _i('paiements', Icons.payments_outlined, 'Paiements et commandes', 'supdue'),
      _i('bons', Icons.description_outlined, 'Bons de commande', 'po'), _i('receptions', Icons.local_shipping_outlined, 'Livraisons'),
      _i('releve', Icons.menu_book_outlined, 'Relevé de compte'), _i('ventes', Icons.bar_chart, 'Ventes de mes produits'),
    ]),
  ],
  'livreur': [
    ('Mon espace livreur', [
      _i('tournee', Icons.local_shipping_outlined, 'Ma tournée', 'lvt'), _i('argent', Icons.payments_outlined, 'Mon argent', 'lvc'),
      _i('historique', Icons.history, 'Historique'), _i('perf', Icons.track_changes, 'Mes performances'),
    ]),
  ],
};
const kRoleLabel = {'admin': 'Admin', 'gerant': 'Gérant', 'manager': 'Manager', 'agent': 'Agent de confirmation', 'fournisseur': 'Fournisseur', 'livreur': 'Livreur'};
const kRoleHome = {'admin': 'dashboard', 'gerant': 'dashboard', 'manager': 'dashboard', 'agent': 'mafile', 'fournisseur': 'dashboard', 'livreur': 'tournee'};

// ---------- formats ----------
String two(int x) => x.toString().padLeft(2, '0');
String fDate(num ts) {
  final d = DateTime.fromMillisecondsSinceEpoch(ts.toInt());
  return '${two(d.day)}/${two(d.month)}/${d.year}';
}
String fTime(num ts) {
  final d = DateTime.fromMillisecondsSinceEpoch(ts.toInt());
  return '${two(d.hour)}:${two(d.minute)}';
}
String fDT(num ts) => '${fDate(ts)} · ${fTime(ts)}';
String money(num v) {
  final x = v.round().abs().toString().replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (_) => ' ');
  return '${v < 0 ? '− ' : ''}$x DZD';
}
bool validPhone(String p) => RegExp(r'^0[567]\d{8}$').hasMatch(p.replaceAll(RegExp(r'\s'), ''));
String digits(String p) => p.replaceAll(RegExp(r'\D'), '');
String waUrl(String p) {
  final d = digits(p);
  return 'https://wa.me/${d.startsWith('0') ? '213${d.substring(1)}' : d}';
}

/// Règles qui lisent l'état de l'ERP.
extension Rules on ErpStore {
  Doc get modules => m(settings['modules']).isEmpty ? {'weight': true} : m(settings['modules']);

  List<Doc> kList(String k) {
    final x = m(settings['kando'])[k];
    return x is List && x.isNotEmpty ? x.map((e) => m(e)).toList() : kDef[k]!;
  }

  String wName(Object? id) => s(wby[ni(id)]?['fr']).isEmpty ? '—' : s(wby[ni(id)]!['fr']);
  String agentName(Object? id) => s(uby[ni(id)]?['name']);
  Doc customerOf(Doc o) => cby[ni(o['customerId'])] ?? {};
  Doc orderById(int id) => allOrders.firstWhere((o) => ni(o['id']) == id, orElse: () => {});

  // ----- statut affiché (kando.js) -----
  static String kindOf(String st) => st == 'new' ? 'pending' : st == 'unreach' ? 'fail' : st == 'callback' ? 'callback' : st == 'cancelled' ? 'cancel' : st == 'calling' ? 'calling' : 'confirm';

  Doc confDef(Doc o) {
    final list = kList('conf'), k = kindOf(s(o['status']));
    if (k == 'calling') return {'id': '_calling', 'label': 'En appel', 'color': '#6C5CE7', 'kind': 'calling'};
    final unreachN = max(1, ni(o['unreachN']));
    Doc? d = list.cast<Doc?>().firstWhere((x) => x!['id'] == o['confStatus'], orElse: () => null);
    if (d != null && d['kind'] == k && (k != 'fail' || max(1, ni(d['n'])) == unreachN) &&
        (k != 'cancel' || s(d['reason']).ifEmpty(s(d['label'])) == s(o['cancelReason']) || s(o['cancelReason']).isEmpty)) {
      return d;
    }
    Doc? find(bool Function(Doc) f) => list.cast<Doc?>().firstWhere((x) => f(x!), orElse: () => null);
    if (k == 'fail') {
      d = find((x) => x['kind'] == 'fail' && max(1, ni(x['n'])) == unreachN) ?? find((x) => x['kind'] == 'fail');
    } else if (k == 'cancel') {
      d = find((x) => x['kind'] == 'cancel' && s(x['reason']).ifEmpty(s(x['label'])) == s(o['cancelReason'])) ?? find((x) => x['kind'] == 'cancel');
    } else {
      d = find((x) => x['kind'] == k);
    }
    return d ?? {'id': '_$k', 'label': kKindLabel[k] ?? k, 'color': '#999999', 'kind': k};
  }

  String kLabel(Doc o) => kShipSt.contains(o['status']) ? kStep[o['status']]!.$1 : s(confDef(o)['label']);
  Color kColor(Doc o) => hex(kShipSt.contains(o['status']) ? kStep[o['status']]!.$2 : s(confDef(o)['color']));
  Doc finDef(Doc o) => kList('fin').firstWhere((x) => x['id'] == (o['financeStatus'] ?? 'fin_select'), orElse: () => kList('fin').first);

  bool kCanConf(Doc o) => role == 'admin' || role == 'manager' || (role == 'agent' && ni(o['agentId']) == uidMe);
  bool get kCanShip => role == 'admin' || role == 'gerant';

  // ----- livraison, poids, frais (app.js + surcharges de kando.js) -----
  static final noCarrier = <String, dynamic>{'id': '', 'name': '—', 'short': '—', 'connected': false, 'feeFactor': 1, 'baseKg': 5, 'extraPerKg': 0, 'maxParcelKg': 999, 'chargeOverweight': false, 'desk': true, 'cod': true, 'color': '#9ca3af'};
  Doc carrierOf(Doc o) => crb[s(o['carrier'])] ?? noCarrier;
  String carrierName(Doc c) => s(c['id']).isEmpty ? '—' : c['internal'] == true ? 'Mes livreurs' : s(c['name']);
  bool carrierHasApi(Doc c) => ['yalidine', 'ecotrack', 'noest'].contains(c['family']) && s(m(c['creds'])['token']).isNotEmpty;

  List<({int pid, int q, String? v})> expand(List<dynamic> items) {
    final out = <({int pid, int q, String? v})>[];
    for (final x in items) {
      final it = m(x), p = pby[ni(it['pid'])];
      if (p != null && p['packItems'] is List) {
        for (final c in l(p['packItems'])) {
          out.add((pid: ni(m(c)['pid']), q: ni(m(c)['q']) * ni(it['q']), v: null));
        }
      } else {
        out.add((pid: ni(it['pid']), q: ni(it['q']), v: it['v'] == null ? null : s(it['v'])));
      }
    }
    return out;
  }

  double unitWeightKg(int pid) => n(pby[pid]?['weight']) / 1000;
  double orderWeight(Doc o) {
    if (n(o['weightFixed']) > 0) return n(o['weightFixed']).toDouble();
    return (expand(l(o['items'])).fold<double>(0, (t, i) => t + unitWeightKg(i.pid) * i.q) * 100).round() / 100;
  }

  int linesTotal(List<dynamic> items) => items.fold<num>(0, (t, i) => t + n(m(i)['price']) * n(m(i)['q'])).round();
  int orderSub(Doc o) => linesTotal(l(o['items']));
  int discountAmt(Doc o) => o['discountType'] == 'amount' ? min(orderSub(o), max(0, ni(o['discount']))) : (orderSub(o) * n(o['discount']) / 100).round();
  int extraKg(Doc c, double kg) => n(c['extraPerKg']) > 0 ? max(0, (kg - n(c['baseKg'])).ceil()) : 0;
  int _round10(num v) => (v / 10).round() * 10;
  int baseClientFee(Doc o, Doc c) {
    final w = wby[ni(o['wilaya'])];
    if (w == null) return 0;
    return _round10(n(o['delivery'] == 'home' ? w['home'] : w['desk']) * (n(c['feeFactor']) == 0 ? 1 : n(c['feeFactor'])));
  }
  int baseShip(Doc o, Doc c) {
    final w = wby[ni(o['wilaya'])];
    if (w == null) return 0;
    return _round10(n(o['delivery'] == 'home' ? w['dhdHome'] : w['dhdDesk']) * (n(c['feeFactor']) == 0 ? 1 : n(c['feeFactor'])));
  }
  int overweightFee(Doc o) => extraKg(carrierOf(o), orderWeight(o)) * ni(carrierOf(o)['extraPerKg']);
  int feeOf(Doc o) {
    if (o['freeShip'] == true) return 0;
    if (o['feeFixed'] != null) return ni(o['feeFixed']);
    final c = carrierOf(o);
    return baseClientFee(o, c) + (c['chargeOverweight'] == true && modules['weight'] == true ? overweightFee(o) : 0);
  }
  List<Doc> parcelsOf(Doc o) => l(o['parcels']).isNotEmpty ? l(o['parcels']).map(m).toList() : [{'n': 1, 'weight': orderWeight(o)}];
  int dhdFeeOf(Doc o) {
    if (o['dhdFixed'] != null) return ni(o['dhdFixed']);
    final c = carrierOf(o);
    return parcelsOf(o).fold<int>(0, (t, p) => t + baseShip(o, c) + (modules['weight'] == true ? extraKg(c, n(p['weight']).toDouble()) * ni(c['extraPerKg']) : 0));
  }
  bool needsSplit(Doc o) => modules['weight'] == true && !(l(o['parcels']).length > 1) && orderWeight(o) > n(carrierOf(o)['maxParcelKg']);
  int orderTotal(Doc o) => orderSub(o) - discountAmt(o) + feeOf(o);
  int returnLoss(Doc o) => dhdFeeOf(o) * 2 + ni(settings['adCostPerDelivered'] ?? 700);

  // ----- stock -----
  ({int physical, int reserved, int atDhd, int available}) stockInfo(int pid) {
    final p = pby[pid];
    var reserved = 0, atDhd = 0;
    for (final o in orders) {
      final st = s(o['status']);
      final res = st == 'toprep' || st == 'ready', away = ['sent', 'picked', 'transit', 'outfor', 'failed', 'returning'].contains(st);
      if (!res && !away) continue;
      for (final it in expand(l(o['items']))) {
        if (it.pid == pid) res ? reserved += it.q : atDhd += it.q;
      }
    }
    final physical = p == null ? 0 : p['variants'] is List && l(p['variants']).isNotEmpty ? l(p['variants']).fold<int>(0, (t, v) => t + ni(m(v)['stock'])) : ni(p['stock']);
    return (physical: physical, reserved: reserved, atDhd: atDhd, available: physical - reserved);
  }
  List<Doc> lowStock() => products.where((p) => n(p['price']) > 0 && p['status'] != 'devis' && p['status'] != 'corbeille' && stockInfo(ni(p['id'])).available <= ni(p['threshold'])).toList();

  List<String> preSendCheck(Doc o) {
    final e = <String>{};
    final c = carrierOf(o);
    if (s(c['id']).isEmpty) {
      e.add('Choisissez une société de livraison');
    } else if (c['connected'] != true) {
      e.add('Société de livraison désactivée');
    }
    if (needsSplit(o)) e.add('Poids trop élevé : découper la commande');
    if (!validPhone(s(customerOf(o)['phone']))) e.add('Téléphone invalide');
    if (s(o['commune']).isEmpty) e.add('Commune manquante');
    for (final i in expand(l(o['items']))) {
      final p = pby[i.pid];
      if (p != null && ni(p['stock']) < i.q && p['onDemand'] != true) e.add('Stock insuffisant');
    }
    return e.toList();
  }

  // ----- compteurs du menu (counters) -----
  List<Doc> visibleOrders() => role == 'agent' ? orders.where((o) => ni(o['agentId']) == uidMe).toList() : role == 'fournisseur' ? [] : orders;
  List<Doc> hardCases() => orders.where((o) {
        final st = s(o['status']);
        return (o['riskReturn'] == true && (st == 'failed' || st == 'returning')) || (st == 'unreach' && ni(o['unreachN']) >= 3) || o['discountPending'] == true ||
            (st == 'failed' && l(o['attempts']).any((a) => m(a)['reason'] == 'refused' && m(a)['resolved'] != true));
      }).toList();
  int courierIdMe() => ni(me['courierId']);
  List<Doc> lvMine() => orders.where((o) => ni(o['courierId']) != 0 && ni(o['courierId']) == courierIdMe()).toList();

  Map<String, int> counters() {
    final vo = visibleOrders();
    int cnt(Iterable<Doc> l, bool Function(Doc) f) => l.where(f).length;
    return {
      'conf': cnt(vo, (o) => kConfSt.contains(o['status'])),
      'low': lowStock().length,
      'prep': cnt(orders, (o) => o['status'] == 'toprep'),
      'ready': cnt(orders, (o) => o['status'] == 'ready'),
      'ret': cnt(orders, (o) => o['status'] == 'returning'),
      'hard': hardCases().length,
      'mine': cnt(vo, (o) => kConfSt.contains(o['status'])) + cnt(vo, (o) => o['status'] == 'failed'),
      'cb': cnt(vo, (o) => o['nextCall'] != null && kConfSt.contains(o['status'])),
      'myfail': cnt(vo, (o) => o['status'] == 'failed'),
      'po': cnt(c['purchases']!, (p) => p['status'] == 'sent'),
      'supdue': cnt(orders, (o) => o['status'] == 'paid'),
      'lvt': cnt(lvMine(), (o) => kLvTodo.contains(o['status'])),
      'lvc': cnt(lvMine(), (o) => o['cashWithCourier'] == true),
    };
  }

  int deliveryRate([List<Doc>? list]) {
    final os = list ?? orders;
    final d = os.where((o) => ['delivered', 'paid', 'closed'].contains(o['status'])).length, r = os.where((o) => ['returning', 'returned'].contains(o['status'])).length;
    return d + r == 0 ? 0 : (d / (d + r) * 100).round();
  }

  String stName(String st, Doc o) {
    if (st == 'sent' && s(o['carrier']).isNotEmpty && o['carrier'] != 'dhd') {
      final cr = carrierOf(o);
      return cr['internal'] == true ? 'Remise au livreur' : 'Envoyée à ${s(cr['short'])}';
    }
    var name = kStatus[st]?.$1 ?? st;
    if (st == 'unreach') name += ' ${ni(o['unreachN'])}';
    return name;
  }
}

extension on String {
  String ifEmpty(String other) => isEmpty ? other : this;
}

/// Actions qui modifient l'ERP. Chacune finit par store.touch() (envoi au serveur).
extension Actions on ErpStore {
  void hist(Doc o, String action, [String note = '', String color = '']) {
    (o['history'] as List).add({'at': now(), 'who': s(me['name']), 'action': action, 'note': note, 'color': color});
  }

  void log(String action, String entity, [String details = '']) {
    if (role == 'livreur' || role == 'fournisseur') return; // le serveur refuse le journal à ces rôles
    c['activity']!.insert(0, {'at': now(), 'user': s(me['name']), 'role': role, 'action': action, 'entity': entity, 'details': details});
  }

  void stockMove(int pid, String type, int q, String ref, [String motif = '']) {
    c['stock_moves']!.insert(0, {'at': now(), 'pid': pid, 'type': type, 'q': q, 'ref': ref, 'motif': motif, 'who': s(me['name'])});
  }

  String _docNext(String type) {
    const prefix = {'facture': 'FAC', 'proforma': 'PRO', 'bl': 'BL', 'decharge': 'DEC'};
    final y = DateTime.now().year;
    final seq = settings['docSeq'] is Map ? m(settings['docSeq']) : <String, dynamic>{};
    settings['docSeq'] = seq;
    final k = '$type$y';
    seq[k] = ni(seq[k]) + 1;
    return '${prefix[type]}-$y-${ni(seq[k]).toString().padLeft(4, '0')}';
  }

  void docEnsure(Doc o, String type) {
    const label = {'facture': 'Facture', 'proforma': 'Facture proforma', 'bl': 'Bon de livraison', 'decharge': 'Décharge'};
    if (o['docs'] is! Map) o['docs'] = <String, dynamic>{};
    final docs = o['docs'] as Map;
    if (docs[type] == null) {
      docs[type] = {'no': _docNext(type), 'at': now(), 'by': s(me['name'])};
      hist(o, '${label[type]} créée', s(m(docs[type])['no']), 'blue');
    }
  }

  /// setStatus() du site, avec ses effets : frais figés, suivi, livreur, poids, stock, ventes, documents.
  void setStatus(Doc o, String st, [String note = '']) {
    final prev = s(o['status']);
    if (prev == st) return;
    o['status'] = st;
    (o['times'] as Map)[st] = now();
    o['lastDhdUpdate'] = now();
    final c0 = kStatus[st]?.$2 ?? '';
    hist(o, stName(st, o), note, c0 == 'red' ? 'red' : c0 == 'green' ? 'green' : c0 == 'amber' ? 'amber' : 'blue');
    if (st == 'sent') {
      o['feeFixed'] = feeOf(o);
      o['dhdFixed'] = dhdFeeOf(o);
      final cr = carrierOf(o);
      if (s(o['tracking']).isEmpty) o['tracking'] = '${cr['internal'] == true ? 'PKL-' : s(cr['short'])}${10000000 + Random().nextInt(89999999)}';
      if (l(o['parcels']).length > 1) {
        for (final p in l(o['parcels'])) {
          final pp = p as Map;
          if (s(pp['tracking']).isEmpty) pp['tracking'] = '${o['tracking']}-${pp['n']}';
        }
      }
      if (cr['internal'] == true && o['courierId'] == null) {
        final cu = c['couriers']!.cast<Doc?>().firstWhere((x) => x!['active'] == true && x['online'] == true && l(x['zones']).map(ni).contains(ni(o['wilaya'])), orElse: () => null);
        if (cu != null) o['courierId'] = cu['id'];
      }
      final kg = (orderWeight(o) * 10).round() / 10;
      hist(o, 'Poids transmis à ${s(cr['name'])}', '${kg.toString().replaceAll('.', ',')} kg · ${parcelsOf(o).length} colis', 'blue');
      for (final i in expand(l(o['items']))) {
        stockMove(i.pid, 'expédition', -i.q, s(o['ref']), 'Remis à DHD');
        final p = pby[i.pid];
        if (p == null) continue;
        if (p['variants'] is List && i.v != null) {
          final v = l(p['variants']).cast<Map?>().firstWhere((x) => s(x!['id']) == i.v, orElse: () => null);
          if (v != null) v['stock'] = ni(v['stock']) - i.q;
        } else {
          p['stock'] = ni(p['stock']) - i.q;
        }
      }
    }
    if (st == 'returned') {
      for (final i in expand(l(o['items']))) {
        final p = pby[i.pid];
        if (p == null) continue;
        p['stock'] = ni(p['stock']) + i.q;
        stockMove(i.pid, 'retour', i.q, s(o['ref']), 'Retour réintégré');
      }
    }
    if (st == 'delivered') {
      for (final i in expand(l(o['items']))) {
        final p = pby[i.pid];
        if (p == null) continue;
        p['sold30'] = ni(p['sold30']) + i.q;
        p['lastSale'] = now();
      }
      if (carrierOf(o)['internal'] == true) o['cashWithCourier'] = true;
    }
    if (st == 'paid') distribute(o);
    log('Statut ${kStatus[prev]?.$1 ?? prev} → ${kStatus[st]?.$1 ?? st}', s(o['ref']), note);
    final docs = m(settings['docs']);
    if (st == 'sent' && docs['autoBl'] != false) docEnsure(o, 'bl');
    if (st == 'delivered' && docs['autoFacture'] != false) docEnsure(o, 'facture');
  }

  // ----- confirmation (kConfApply, resConfirm, cbSave, cancelSave) -----
  /// Verrouille la commande pendant l'appel (lockOrder) ; unlockOrder la libère si rien n'a été décidé.
  void lockOrder(Doc o) {
    if (['new', 'unreach', 'callback'].contains(o['status']) && ['agent', 'manager', 'admin'].contains(role) && kCanConf(o)) {
      o['prevStatus'] = o['status'];
      o['status'] = 'calling';
      o['lockedBy'] = uidMe;
      hist(o, 'En appel', 'Fiche ouverte — verrouillée pour les autres agents', 'blue');
      o['firstCallAt'] ??= now();
      o['fresh'] = false;
      touch();
    }
  }

  void unlockOrder(Doc o) {
    if (o['status'] == 'calling' && o['prevStatus'] != null) {
      o['status'] = o['prevStatus'];
      o['lockedBy'] = null;
      o.remove('prevStatus');
      touch();
    }
  }

  void logCall(Doc o) {
    o['calls'] = ni(o['calls']) + 1;
    hist(o, 'Appel sortant', '', 'blue');
    touch();
  }

  void _release(Doc o) {
    o['lockedBy'] = null;
    o.remove('prevStatus');
  }

  /// Renvoie un message d'erreur, ou null si c'est fait. [callbackAt] est demandé par l'écran pour un « Reporté ».
  String? confApply(Doc o, String id, {String? note, int? callbackAt, String callbackNote = ''}) {
    final d = kList('conf').cast<Doc?>().firstWhere((x) => x!['id'] == id, orElse: () => null);
    if (d == null) return 'Statut inconnu';
    if (!kCanConf(o)) return 'Commande d\'un autre agent';
    if (note != null) o['statusNote'] = note;
    final k = Rules.kindOf(s(o['status'])), kind = s(d['kind']);
    if (k == kind && kind != 'fail' && kind != 'cancel') {
      o['confStatus'] = d['id'];
      hist(o, s(d['label']), note ?? '');
      touch();
      return null;
    }
    switch (kind) {
      case 'pending':
        o['confStatus'] = d['id'];
        o['nextCall'] = null;
        _release(o);
        o['cancelReason'] = '';
        if (o['status'] == 'new') o['status'] = 'calling';
        setStatus(o, 'new', s(d['label']));
      case 'fail':
        final nn = max(1, min(9, ni(d['n'] ?? 1)));
        int next;
        if (nn <= 2) {
          next = now() + [30 * kMin, 2 * kHour][nn - 1];
        } else {
          final x = DateTime.now().add(const Duration(days: 1));
          next = DateTime(x.year, x.month, x.day, 9, 30).millisecondsSinceEpoch;
        }
        o['confStatus'] = d['id'];
        o['calls'] = ni(o['calls']) + 1;
        o['unreachN'] = nn;
        o['nextCall'] = next;
        _release(o);
        o['status'] = 'calling';
        setStatus(o, 'unreach', '${s(d['label'])} · rappel ${fDT(next)}');
      case 'callback':
        if (callbackAt == null) return 'Date invalide';
        o['confStatus'] = d['id'];
        o['calls'] = ni(o['calls']) + 1;
        o['nextCall'] = callbackAt;
        _release(o);
        o['status'] = 'calling';
        setStatus(o, 'callback', 'Rappel le ${fDT(callbackAt)}${callbackNote.isNotEmpty ? ' — $callbackNote' : ''}');
      case 'confirm':
        final err = <String>[];
        if (!validPhone(s(customerOf(o)['phone']))) err.add('téléphone invalide');
        if (s(o['commune']).isEmpty) err.add('commune manquante');
        for (final i in expand(l(o['items']))) {
          final p = pby[i.pid];
          if (p != null && stockInfo(i.pid).available < i.q && p['onDemand'] != true) err.add('stock insuffisant : ${s(p['name'])}');
        }
        if (err.isNotEmpty) return 'Impossible de confirmer : ${err.join(', ')}';
        final limit = role == 'agent' ? n(settings['discountAgent'] ?? 5) : role == 'manager' ? n(settings['discountManager'] ?? 10) : 100;
        if (n(o['discount']) > limit) {
          o['discountPending'] = true;
          hist(o, 'Remise à valider', '${o['discount']} % > $limit %', 'amber');
        }
        o['confStatus'] = d['id'];
        o['calls'] = max(1, ni(o['calls']));
        _release(o);
        (o['times'] as Map)['confirmed'] = now();
        o['status'] = 'calling';
        final gain = max(0, orderSub(o) - linesTotal(l(o['initial'])));
        setStatus(o, 'toprep', gain > 0 ? 'Confirmée avec upsell +${money(gain)}' : 'Confirmée');
        final h = (o['history'] as List).last as Map;
        h['action'] = 'Confirmée → À préparer';
        h['color'] = 'green';
      case 'cancel':
        o['confStatus'] = d['id'];
        o['cancelReason'] = s(d['reason']).ifEmpty(s(d['label']));
        _release(o);
        o['nextCall'] = null;
        if (o['status'] == 'cancelled') o['status'] = 'calling';
        setStatus(o, 'cancelled', 'Motif : ${o['cancelReason']}');
    }
    touch();
    return null;
  }

  void saveStatusNote(Doc o, String note) {
    o['statusNote'] = note;
    hist(o, 'Note', note);
    touch();
  }

  // ----- modification de la commande sur l'écran d'appel -----
  void setDelivery(Doc o, String v) {
    o['delivery'] = v;
    touch();
  }

  String? lineQty(Doc o, int i, int delta) {
    final it = (o['items'] as List)[i] as Map;
    it['q'] = max(1, ni(it['q']) + delta);
    touch();
    return null;
  }

  String? lineDel(Doc o, int i) {
    if ((o['items'] as List).length == 1) return 'La commande doit contenir au moins un produit';
    (o['items'] as List).removeAt(i);
    touch();
    return null;
  }

  void addLine(Doc o, Doc p) {
    final vs = l(p['variants']);
    final v = vs.isNotEmpty ? m(vs.first) : null;
    final items = o['items'] as List;
    final ex = items.cast<Map>().where((i) => ni(i['pid']) == ni(p['id'])).firstOrNull;
    if (ex != null) {
      ex['q'] = ni(ex['q']) + 1;
    } else {
      items.add({'pid': p['id'], 'v': v?['id'], 'q': 1, 'price': v?['price'] ?? p['price'], 'cost': v?['cost'] ?? p['cost'] ?? 0, 'up': true});
    }
    touch();
  }

  // ----- gérant / admin : préparation, expédition, suivi, retours -----
  void markReady(Doc o) {
    setStatus(o, 'ready', 'Colis emballé et pesé');
    touch();
  }

  /// shipOrders() : création du colis chez la société (API) puis statut « envoyée ». Renvoie les erreurs.
  Future<List<String>> shipOrders(List<Doc> list) async {
    final ko = <String>[];
    for (final o in list) {
      final ref = s(o['ref']);
      if (!['toprep', 'ready'].contains(o['status'])) {
        ko.add('$ref : Confirmez la commande avant l\'envoi');
        continue;
      }
      final chk = preSendCheck(o);
      if (chk.isNotEmpty) {
        ko.add('$ref : ${chk.join(', ')}');
        continue;
      }
      final cr = carrierOf(o);
      if (carrierHasApi(cr) && s(o['tracking']).isEmpty) {
        try {
          await syncNow();
          await net.call('carrier.send', {
            'orderId': o['id'], 'amount': orderTotal(o), 'weight': orderWeight(o),
            'products': expand(l(o['items'])).map((i) => '${i.q}x ${s(pby[i.pid]?['name'])}').join(', '),
          });
          await syncNow();
        } on ErpError catch (e) {
          ko.add('$ref : ${e.message}');
          continue;
        }
      }
      setStatus(o, 'sent', cr['internal'] == true ? 'Remis au livreur' : carrierHasApi(cr) ? 'Colis créé chez ${s(cr['name'])} par API' : 'Envoi enregistré (suivi saisi à la main)');
    }
    touch();
    return ko;
  }

  void setShipStatus(Doc o, String st) {
    setStatus(o, st);
    touch();
  }

  void receiveReturn(Doc o, bool intact) {
    if (intact) {
      setStatus(o, 'returned', 'Colis intact, stock réintégré');
    } else {
      o['status'] = 'returned';
      (o['times'] as Map)['returned'] = now();
      hist(o, 'Retournée', 'Colis abîmé → casse', 'red');
      for (final i in expand(l(o['items']))) {
        stockMove(i.pid, 'casse', 0, s(o['ref']), 'Retour abîmé');
      }
    }
    if (role == 'admin') {
      final loss = returnLoss(o);
      c['cash_moves']!.insert(0, {'at': now(), 'box': 'security', 'amount': -loss, 'type': 'Perte retour (aller-retour DHD + pub)', 'ref': o['ref'], 'note': '', 'who': s(me['name'])});
      final box = c['cashboxes']!.where((b) => b['id'] == 'security').firstOrNull;
      if (box != null) box['balance'] = n(box['balance']) - loss;
    }
    touch();
  }

  // ----- stock -----
  String? adjustStock(Doc p, String type, int q, String motif) {
    if (motif.trim().isEmpty) return 'Motif obligatoire';
    final qq = type == 'casse' ? -q.abs() : q;
    final vs = l(p['variants']);
    if (vs.isNotEmpty) {
      final v = vs.first as Map;
      v['stock'] = ni(v['stock']) + qq;
    } else {
      p['stock'] = ni(p['stock']) + qq;
    }
    stockMove(ni(p['id']), type, qq, 'ADJ', motif.trim());
    log('Stock $type', s(p['sku']), '$qq · ${motif.trim()}');
    touch();
    return null;
  }

  /// Fiche produit (tajer.js) : prix et stock modifiés depuis la fiche.
  void saveProduct(Doc p, {required String name, required int price, required int cost, required int stock, required String status, required int threshold}) {
    final oldPrice = ni(p['price']), oldCost = ni(p['cost']);
    if (price != oldPrice || cost != oldCost) {
      if (p['priceHistory'] is! List) p['priceHistory'] = <dynamic>[];
      (p['priceHistory'] as List).add({'at': now(), 'sale': price, 'cost': cost});
    }
    if (l(p['variants']).isEmpty && stock != ni(p['stock'])) {
      stockMove(ni(p['id']), 'ajustement', stock - ni(p['stock']), 'FICHE', 'Modifié depuis la fiche produit');
      p['stock'] = stock;
    }
    p['name'] = name;
    p['price'] = price;
    p['cost'] = cost;
    p['status'] = status;
    p['threshold'] = threshold;
    log('Produit modifié', s(p['sku']).ifEmpty(name));
    touch();
  }

  // ----- livreur (livreur.js) -----
  void _lvSet(Doc o, String st, String label, String note, String color) {
    o['status'] = st;
    (o['times'] as Map)[st] = now();
    o['lastDhdUpdate'] = now();
    (o['history'] as List).add({'at': now(), 'who': s(me['name']), 'action': label, 'note': note, 'color': color});
    if (st == 'delivered') o['cashWithCourier'] = true;
    touch();
  }

  void lvGo(Doc o) => _lvSet(o, 'outfor', 'En livraison', 'Le livreur part livrer', 'amber');
  void lvDone(Doc o, String note) => _lvSet(o, 'delivered', 'Livrée par ${s(me['name'])} — argent chez le livreur', note, 'green');
  void lvFail(Doc o, String reason, String comment) {
    if (o['attempts'] is! List) o['attempts'] = <dynamic>[];
    final a = o['attempts'] as List;
    a.add({'n': a.length + 1, 'at': now(), 'reason': reason, 'comment': comment, 'action': '', 'agentId': o['agentId'], 'due': now() + 2 * kHour, 'result': '', 'resolved': false, 'byCourier': true});
    _lvSet(o, 'failed', 'Tentative ${a.length} échouée', '${failName(reason)}${comment.isNotEmpty ? ' — $comment' : ''}', 'red');
  }

  void lvNote(Doc o, String note) {
    o['courierNote'] = note;
    (o['history'] as List).add({'at': now(), 'who': s(me['name']), 'action': 'Note du livreur', 'note': note, 'color': ''});
    touch();
  }
}
