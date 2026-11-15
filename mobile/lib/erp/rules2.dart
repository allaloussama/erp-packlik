import 'dart:math' show max, min;

import 'rules.dart';
import 'store.dart';

/// Règles de gestion (finance, caisses, fournisseurs, performances, comptabilité), portées depuis
/// assets/app.js et assets/erp-plus.js. Mêmes calculs que le site.

const kDeliveredSt = ['delivered', 'paid', 'closed'];
const kShippedSt = ['sent', 'picked', 'transit', 'outfor', 'failed', 'delivered', 'returning', 'returned', 'paid', 'closed'];
const kConfirmedSt = ['toprep', 'ready', ...kShippedSt];
const kShipRoad = ['sent', 'picked', 'transit', 'outfor', 'failed'];
double pct(num a, num b) => b == 0 ? 0 : a / b * 100;
String fmtPct(num v) => '${v.round()} %';

int dayStart([int? ts]) {
  final d = DateTime.fromMillisecondsSinceEpoch(ts ?? now());
  return DateTime(d.year, d.month, d.day).millisecondsSinceEpoch;
}

extension Gestion on ErpStore {
  Doc get boxes => m(settings['boxes']).isEmpty ? {'security': 20, 'reinvest': 80, 'securityCap': 15} : m(settings['boxes']);
  num setting(String k, num def) => settings[k] == null ? def : n(settings[k]);
  List<Doc> get cashboxes => c['cashboxes']!;
  Doc? box(String id) => cashboxes.where((b) => b['id'] == id).firstOrNull;
  List<Doc> get agents => users.where((u) => u['role'] == 'agent').toList();

  // ----- commande : upsell et fiche financière -----
  int linesCost(List<dynamic> items) => items.fold<num>(0, (t, i) => t + n(m(i)['cost']) * n(m(i)['q'])).round();
  int upsellGain(Doc o) => max(0, orderSub(o) - linesTotal(l(o['initial'])));
  double upsellPct(Doc o) {
    final b = linesTotal(l(o['initial']));
    return b == 0 ? 0 : upsellGain(o) / b * 100;
  }

  ({int products, int fee, int total, int cost, int dhd, int ad, int com, int net, String state, int security, int reinvest}) finOf(Doc o) {
    final products = orderSub(o) - discountAmt(o), fee = feeOf(o), total = products + fee;
    final cost = linesCost(l(o['items'])), dhd = dhdFeeOf(o), ad = setting('adCostPerDelivered', 700).round(), com = setting('commission', 100).round();
    final net = total - cost - dhd - ad - com;
    final st = s(o['status']);
    final state = ['paid', 'closed'].contains(st) ? 'encaissée' : st == 'delivered' ? 'acquise' : 'estimée';
    final security = net > 0 ? (net * n(boxes['security']) / 100).round() : net;
    return (products: products, fee: fee, total: total, cost: cost, dhd: dhd, ad: ad, com: com, net: net, state: state, security: security, reinvest: net > 0 ? net - security : 0);
  }

  // ----- caisses -----
  void cashMove(String id, int amount, String type, String ref, [String note = '']) {
    final b = box(id);
    if (b != null) b['balance'] = n(b['balance']) + amount;
    c['cash_moves']!.insert(0, {'at': now(), 'box': id, 'amount': amount, 'type': type, 'ref': ref, 'note': note, 'who': s(me['name'])});
  }

  /// distribute() : à l'encaissement, la commande remplit les 4 caisses.
  void distribute(Doc o) {
    final f = finOf(o), ref = s(o['ref']);
    cashMove('reserve', f.cost, 'Coût d\'achat', ref, 'Part fournisseur');
    cashMove('pub', f.ad, 'Remboursement pub', ref, 'Coût pub alloué');
    cashMove('security', f.security, 'Bénéfice (${n(boxes['security'])} %)', ref);
    cashMove('reinvest', f.reinvest, 'Bénéfice (${n(boxes['reinvest'])} %)', ref);
  }

  String boxName(String id) => s(box(id)?['fr']).isEmpty ? id : s(box(id)!['fr']);

  String? transfer(String from, String to, int amount, String motif) {
    if (from == to || amount <= 0 || motif.trim().isEmpty) return 'Vérifiez les caisses, le montant et le motif';
    if (from == 'reserve') return 'Utilisez « Avance pub » pour sortir de la Réserve fournisseur';
    if (n(box(from)?['balance']) < amount) return 'Solde insuffisant';
    cashMove(from, -amount, 'Transfert sortant', boxName(to), motif.trim());
    cashMove(to, amount, 'Transfert entrant', boxName(from), motif.trim());
    log('Mouvement de caisse', '${boxName(from)} → ${boxName(to)}', '${money(amount)} · ${motif.trim()}');
    touch();
    return null;
  }

  int moneyAtDhd() => orders.where((o) => o['status'] == 'delivered').fold<int>(0, (t, o) => t + orderTotal(o) - dhdFeeOf(o));
  int moneyOnRoad() => (orders.where((o) => kShipRoad.contains(o['status'])).fold<int>(0, (t, o) => t + orderTotal(o) - dhdFeeOf(o)) * deliveryRate() / 100).round();

  // ----- fournisseurs (erp-plus.js : plusieurs fournisseurs) -----
  List<Doc> get suppliers => c['suppliers']!;
  List<Doc> get supPayments => c['sup_payments']!;
  int supOf(int pid) => ni(pby[pid]?['supplierId']) == 0 ? 1 : ni(pby[pid]!['supplierId']);
  String supName(int id) => s(suppliers.where((x) => ni(x['id']) == id).firstOrNull?['name']).isEmpty ? '—' : s(suppliers.firstWhere((x) => ni(x['id']) == id)['name']);
  List<int> orderSups(Doc o) => l(o['items']).map((i) => supOf(ni(m(i)['pid']))).toSet().toList();
  int supShareOf(Doc o, int sid) => l(o['items']).where((i) => supOf(ni(m(i)['pid'])) == sid).fold<num>(0, (t, i) => t + n(m(i)['cost']) * n(m(i)['q'])).round();
  Object? supPaidFor(Doc o, int sid) {
    final paid = m(o['supPaid'])['$sid'];
    if (paid != null) return paid;
    return o['status'] == 'closed' && o['supPaid'] == null ? (o['supplierPaymentId'] ?? '—') : null;
  }

  String? supStateOf(Doc o, int sid) {
    if (supPaidFor(o, sid) != null) return 'settled';
    final st = s(o['status']);
    if (st == 'paid' || st == 'closed') return 'due';
    if (st == 'delivered') return 'dhd';
    if (kShipRoad.contains(st)) return 'road';
    return null;
  }

  List<Doc> supOrders(int sid) => orders.where((o) => l(o['items']).any((i) => supOf(ni(m(i)['pid'])) == sid)).toList();
  ({int due, int dhd, int road, int paid}) supBalanceOf(int sid) {
    final os = supOrders(sid);
    int sum(String k) => os.where((o) => supStateOf(o, sid) == k).fold<int>(0, (t, o) => t + supShareOf(o, sid));
    return (due: sum('due'), dhd: sum('dhd'), road: sum('road'), paid: supPayments.where((p) => (ni(p['supplierId']) == 0 ? 1 : ni(p['supplierId'])) == sid).fold<int>(0, (t, p) => t + ni(p['amount'])));
  }

  ({int due, int dhd, int road, int paid}) supplierBalance() => suppliers.map((x) => supBalanceOf(ni(x['id']))).fold((due: 0, dhd: 0, road: 0, paid: 0), (a, b) => (due: a.due + b.due, dhd: a.dhd + b.dhd, road: a.road + b.road, paid: a.paid + b.paid));

  List<({String ref, int orderId, int rest, int due})> supplierDues() {
    final out = <({String ref, int orderId, int rest, int due})>[];
    for (final x in suppliers) {
      final sid = ni(x['id']), terms = n(x['terms']) > 0 ? n(x['terms']) : setting('supplierTerms', 7);
      for (final o in supOrders(sid).where((o) => supStateOf(o, sid) == 'due')) {
        out.add((ref: '${s(o['ref'])}${suppliers.length > 1 ? ' · ${s(x['name'])}' : ''}', orderId: ni(o['id']), rest: supShareOf(o, sid), due: (n(m(o['times'])['paid']) == 0 ? now() : ni(m(o['times'])['paid'])) + (terms * kDay).round()));
      }
    }
    return out..sort((a, b) => a.due.compareTo(b.due));
  }

  /// paySave() : paiement d'un fournisseur pour les commandes cochées.
  String? paySupplier(int sid, List<Doc> os, String mode) {
    if (os.isEmpty) return 'Cochez au moins une commande';
    final amount = os.fold<int>(0, (t, o) => t + supShareOf(o, sid));
    final id = 'PF-${101 + supPayments.length}';
    final lines = [
      for (final o in os)
        {
          'orderId': o['id'], 'ref': o['ref'], 'deliveredAt': m(o['times'])['delivered'], 'dhdPaidAt': m(o['times'])['paid'],
          'items': [for (final it in l(o['items']).map(m).where((i) => supOf(ni(i['pid'])) == sid)) {'pid': it['pid'], 'q': it['q'], 'cost': it['cost']}],
          'amount': supShareOf(o, sid),
        },
    ];
    supPayments.add({'id': id, 'supplierId': sid, 'at': now(), 'orderIds': os.map((o) => o['id']).toList(), 'lines': lines, 'amount': amount, 'mode': mode, 'proof': 'justificatif_$id.pdf', 'by': s(me['name']), 'confirmedAt': null});
    for (final o in os) {
      final paid = {...m(o['supPaid']), '$sid': id};
      o['supPaid'] = paid;
      if (o['status'] == 'paid' && orderSups(o).every((x) => paid['$x'] != null)) {
        o['supplierPaymentId'] = id;
        setStatus(o, 'closed', 'Fournisseur payé ($id) — bénéfice figé');
      } else {
        hist(o, 'Fournisseur payé', '${supName(sid)} · $id', 'green');
      }
    }
    if (box('reserve') != null) cashMove('reserve', -amount, 'Paiement fournisseur', id, '${supName(sid)} · ${os.length} commandes');
    log('Paiement fournisseur', id, '${supName(sid)} · ${money(amount)} · ${os.length} commandes · $mode');
    touch();
    return null;
  }

  int advanceable() {
    final dues3 = supplierDues().where((d) => d.due <= now() + 3 * kDay).fold<int>(0, (t, d) => t + d.rest);
    final open = c['advances']!.where((a) => a['repaidAt'] == null).fold<int>(0, (t, a) => t + ni(a['amount']));
    final reserve = n(box('reserve')?['balance']);
    final cap = (reserve * setting('advanceCap', 30) / 100).round() - open;
    return max(0, min(cap, (reserve - dues3 - setting('safetyMargin', 20000)).round()));
  }

  String? newAdvance(int amount, int due, String note) {
    final mx = advanceable();
    if (amount <= 0 || amount > mx) return 'Montant au-delà du montant avançable : avance bloquée';
    final next = supplierDues().firstOrNull;
    if (next != null && due > next.due && n(box('reserve')?['balance']) - amount < next.rest) return 'Bloquée : l\'échéance fournisseur du ${fDate(next.due)} deviendrait impossible à tenir';
    final id = 'AV-0${8 + c['advances']!.length - 2}';
    c['advances']!.insert(0, {'id': id, 'amount': amount, 'at': now(), 'due': due, 'repaidAt': null, 'note': note});
    cashMove('reserve', -amount, 'Avance pub', id, 'Prêt interne');
    cashMove('pub', amount, 'Avance pub reçue', id, 'À rembourser');
    log('Avance pub', id, money(amount));
    touch();
    return null;
  }

  String? repayAdvance(Doc a) {
    final amt = ni(a['amount']);
    final from = n(box('pub')?['balance']) >= amt ? 'pub' : 'reinvest';
    if (n(box(from)?['balance']) < amt) return 'Solde insuffisant pour rembourser';
    cashMove(from, -amt, 'Remboursement avance', s(a['id']));
    cashMove('reserve', amt, 'Remboursement avance', s(a['id']));
    a['repaidAt'] = now();
    touch();
    return null;
  }

  String? addExpense(String cat, int amount, String fromBox, String note) {
    if (amount <= 0) return 'Montant invalide';
    final ex = c['expenses']!;
    ex.add({'id': ex.length + 1, 'cat': cat, 'amount': amount, 'cur': 'DZD', 'at': now(), 'box': fromBox, 'note': note.isEmpty ? cat : note});
    cashMove(fromBox, -amount, 'Dépense $cat', 'EXP', note);
    touch();
    return null;
  }

  // ----- livreurs : caisse, courses -----
  int courierCash(int cid) => orders.where((o) => ni(o['courierId']) == cid && o['cashWithCourier'] == true).fold<int>(0, (t, o) => t + orderTotal(o));

  int collectCourier(Doc cu) {
    final os = orders.where((o) => ni(o['courierId']) == ni(cu['id']) && o['cashWithCourier'] == true).toList();
    final amt = os.fold<int>(0, (t, o) => t + orderTotal(o));
    for (final o in os) {
      o['cashWithCourier'] = false;
      setStatus(o, 'paid', 'Argent remis par le livreur ${s(cu['name'])}');
    }
    log('Caisse livreur encaissée', s(cu['name']), money(amt));
    touch();
    return amt;
  }

  /// Tentative échouée saisie par le bureau (le site la simule avec un motif au hasard ; ici le motif est choisi).
  void addFailedAttempt(Doc o, String reason, String comment) {
    if (o['attempts'] is! List) o['attempts'] = <dynamic>[];
    final a = o['attempts'] as List, nn = a.length + 1;
    a.add({'n': nn, 'at': now(), 'reason': reason, 'comment': comment, 'action': '', 'agentId': o['agentId'], 'due': now() + 2 * kHour, 'result': '', 'resolved': false});
    if (nn >= 3) o['riskReturn'] = true;
    o['status'] = 'transit';
    setStatus(o, 'failed', '${failName(reason)}${nn >= 3 ? ' — Risque de retour' : ''}');
    ((o['history'] as List).last as Map)['action'] = 'Tentative $nn échouée';
    touch();
  }

  // ----- agents -----
  int agentLoad(int aid) => orders.where((o) => ni(o['agentId']) == aid && kConfSt.contains(o['status'])).length;

  ({int total, int treated, int conf, int canc, double confRate, double upRate, double upAvg, int gain, int deliv, int ret, double delivRate, double firstCall, int pending, int commission, int attempts}) agentPerf(Doc a, [List<Doc>? list]) {
    final os = (list ?? orders).where((o) => ni(o['agentId']) == ni(a['id'])).toList();
    final conf = os.where((o) => kConfirmedSt.contains(o['status'])).toList(), canc = os.where((o) => o['status'] == 'cancelled').length;
    final deliv = os.where((o) => kDeliveredSt.contains(o['status'])).length, ret = os.where((o) => ['returning', 'returned'].contains(o['status'])).length;
    final ups = conf.where((o) => upsellGain(o) > 0).length;
    final fc = os.where((o) => o['firstCallAt'] != null).map((o) => (n(o['firstCallAt']) - n(o['created'])) / kMin).toList();
    final gain = conf.fold<int>(0, (t, o) => t + upsellGain(o));
    final commission = deliv * (n(a['perDelivery']) == 0 ? 100 : n(a['perDelivery'])).round() + (gain * (n(a['upsellPct']) == 0 ? 3 : n(a['upsellPct'])) / 100).round();
    return (
      total: os.length, treated: os.where((o) => o['status'] != 'new').length, conf: conf.length, canc: canc,
      confRate: pct(conf.length, conf.length + canc), upRate: pct(ups, conf.length),
      upAvg: conf.isEmpty ? 0 : conf.fold<double>(0, (t, o) => t + upsellPct(o)) / conf.length,
      gain: gain, deliv: deliv, ret: ret, delivRate: pct(deliv, deliv + ret),
      firstCall: fc.isEmpty ? 0 : fc.reduce((x, y) => x + y) / fc.length, pending: agentLoad(ni(a['id'])), commission: commission,
      attempts: os.fold<int>(0, (t, o) => t + l(o['attempts']).length),
    );
  }

  // ----- achats -----
  int poTotal(Doc po) => l(po['items']).fold<num>(0, (t, i) => t + n(m(i)['cost']) * n(m(i)['q'])).round();

  List<({Doc p, int available, int sold14, int need})> purchaseSuggestions() {
    final from = now() - 14 * kDay;
    final recent = orders.where((o) => n(o['created']) > from && kConfirmedSt.contains(o['status'])).toList();
    final out = <({Doc p, int available, int sold14, int need})>[];
    for (final p in products.where((p) => n(p['price']) > 0 && p['packItems'] == null && p['status'] != 'devis' && p['status'] != 'corbeille')) {
      final pid = ni(p['id']), si = stockInfo(pid);
      // le site ajoute ici un faux volume de démonstration ((p.id % 7) === 0) : non repris
      final sold14 = recent.fold<int>(0, (t, o) => t + expand(l(o['items'])).where((i) => i.pid == pid).fold<int>(0, (a, i) => a + i.q));
      final need = max(0, (sold14 / 14 * 21).ceil() + ni(p['threshold']) - si.available);
      if (need > 0 && (si.available <= ni(p['threshold']) * 1.5 || sold14 > 0)) out.add((p: p, available: si.available, sold14: sold14, need: need));
    }
    return out..sort((a, b) => b.need.compareTo(a.need));
  }

  String? createPurchase(List<({int pid, int q})> rows, int expected) {
    final r = rows.where((x) => x.q > 0).toList();
    if (r.isEmpty) return 'Ajoutez au moins une ligne';
    final pu = c['purchases']!;
    final id = 'BC-0${429 + pu.length - 5}';
    pu.add({'id': id, 'created': now(), 'expected': expected, 'status': 'sent', 'items': [for (final x in r) {'pid': x.pid, 'q': x.q, 'cost': n(pby[x.pid]?['cost']), 'recv': 0}]});
    log('Bon de commande créé', id);
    touch();
    return null;
  }

  void receivePurchase(Doc po, List<int> received) {
    final items = l(po['items']);
    for (var k = 0; k < items.length; k++) {
      final it = items[k] as Map, recv = max(0, received[k]), p = pby[ni(it['pid'])];
      it['recv'] = recv;
      if (p != null) {
        final vs = l(p['variants']);
        if (vs.isNotEmpty) {
          (vs.first as Map)['stock'] = ni((vs.first as Map)['stock']) + recv;
        } else {
          p['stock'] = ni(p['stock']) + recv;
        }
        if (p['status'] == 'rupture' && recv > 0) p['status'] = 'actif';
      }
      stockMove(ni(it['pid']), 'achat', recv, s(po['id']), recv < ni(it['q']) ? 'Écart réception : −${ni(it['q']) - recv}' : '');
    }
    po['status'] = 'received';
    po['receivedAt'] = now();
    log('Réception', s(po['id']), money(poTotal(po)));
    touch();
  }

  // ----- comptabilité (journalEntries de erp-plus.js) -----
  List<({int at, String cat, String label, int inn, int out})> journalEntries() {
    final e = <({int at, String cat, String label, int inn, int out})>[];
    final day = <String, ({int at, Doc c, List<String> refs, int brut, int fee})>{};
    for (final o in orders.where((o) => n(m(o['times'])['paid']) > 0)) {
      final cr = carrierOf(o), at = ni(m(o['times'])['paid']), k = '${dayStart(at)}|${s(cr['id']).isEmpty ? 'own' : s(cr['id'])}';
      final g = day[k] ?? (at: at, c: cr, refs: <String>[], brut: 0, fee: 0);
      g.refs.add(s(o['ref']));
      day[k] = (at: g.at, c: g.c, refs: g.refs, brut: g.brut + orderTotal(o), fee: g.fee + (cr['internal'] == true ? 0 : dhdFeeOf(o)));
    }
    for (final g in day.values) {
      final who = carrierName(g.c);
      e.add((at: g.at, cat: 'Ventes', label: 'Encaissement $who — ${g.refs.length} colis (${g.refs.take(6).join(', ')}${g.refs.length > 6 ? '…' : ''})', inn: g.brut, out: 0));
      if (g.fee > 0) e.add((at: g.at, cat: 'Frais de livraison', label: 'Frais retenus par $who — ${g.refs.length} colis', inn: 0, out: g.fee));
    }
    for (final o in orders.where((o) => o['status'] == 'returned')) {
      e.add((at: ni(m(o['times'])['returned'] ?? o['created']), cat: 'Retours', label: 'Retour ${s(o['ref'])} — frais aller-retour', inn: 0, out: dhdFeeOf(o) * 2));
    }
    for (final cu in c['couriers']!) {
      final nn = orders.where((o) => ni(o['courierId']) == ni(cu['id']) && kDeliveredSt.contains(o['status']) && n(m(o['times'])['delivered']) > dayStart() - 30 * kDay).length;
      if (nn > 0 && n(cu['perDelivery']) > 0) e.add((at: now(), cat: 'Livreurs', label: 'Rémunération ${s(cu['name'])} — $nn livraisons (30 j)', inn: 0, out: nn * ni(cu['perDelivery'])));
    }
    for (final p in supPayments) {
      e.add((at: ni(p['at']), cat: 'Achats fournisseur', label: 'Paiement fournisseur ${s(p['id'])} · ${supName(ni(p['supplierId']) == 0 ? 1 : ni(p['supplierId']))} (${l(p['orderIds']).length} commandes, ${s(p['mode'])})', inn: 0, out: ni(p['amount'])));
    }
    final byWeek = <int, double>{};
    for (final a in c['ad_spend']!) {
      final k = ((now() - n(a['date'])) / (7 * kDay)).floor();
      byWeek[k] = (byWeek[k] ?? 0) + n(a['usd']);
    }
    final rate = setting('usdRate', 260);
    byWeek.forEach((k, usd) => e.add((at: now() - k * 7 * kDay - kDay, cat: 'Pub Meta', label: 'Meta Ads semaine −$k (${usd.toStringAsFixed(2)} USD × $rate)', inn: 0, out: (usd * rate).round())));
    for (final x in c['expenses']!) {
      e.add((at: ni(x['at']), cat: s(x['cat']), label: s(x['note']), inn: 0, out: ni(x['amount'])));
    }
    return e..sort((a, b) => b.at.compareTo(a.at));
  }

  // ----- clients -----
  ({int created, int delivered, int returned, int spent, String seg}) custStats(Doc cu) {
    final h = m(cu['hist']), os = orders.where((o) => ni(o['customerId']) == ni(cu['id'])).toList();
    final delivered = ni(h['delivered']) + os.where((o) => kDeliveredSt.contains(o['status'])).length;
    final returned = ni(h['returned']) + os.where((o) => ['returning', 'returned'].contains(o['status'])).length;
    final refused = os.fold<int>(0, (t, o) => t + l(o['attempts']).where((a) => m(a)['reason'] == 'refused').length);
    var seg = 'nouveau';
    if (returned >= 2) {
      seg = 'liste noire';
    } else if (returned >= 1 || refused >= 1) {
      seg = 'à risque';
    } else if (delivered >= 3) {
      seg = cu['pro'] == true ? 'professionnel' : 'fidèle';
    } else if (cu['pro'] == true && delivered >= 1) {
      seg = 'professionnel';
    }
    return (
      created: ni(h['created']) + os.length, delivered: delivered, returned: returned,
      spent: ni(h['spent']) + os.where((o) => kDeliveredSt.contains(o['status'])).fold<int>(0, (t, o) => t + orderTotal(o)), seg: seg,
    );
  }

  /// SETTINGS.menuOrder (menu de l'admin réorganisé sur le site) appliqué au menu de l'application.
  List<(String, List<MenuItem>)> menusFor(String r) {
    final base = kMenus[r]!;
    final order = settings['menuOrder'];
    if (r != 'admin' || order is! List || order.isEmpty) return base;
    final all = {for (final g in base) for (final i in g.$2) i.key: i};
    final seen = <String>{};
    final groups = <(String, List<MenuItem>)>[('', [])];
    for (final k in order.map((e) => '$e')) {
      if (k.startsWith('g:')) {
        groups.add((k.substring(2), []));
      } else if (all[k] != null && seen.add(k)) {
        groups.last.$2.add(all[k]!);
      }
    }
    for (final k in all.keys.where((k) => !seen.contains(k))) {
      groups.last.$2.add(all[k]!);
    }
    return [for (final g in groups) if (g.$2.isNotEmpty) g];
  }
}

// ---------- montant en lettres (documents.js) ----------
String frWords(int n0) {
  var n1 = n0.abs();
  if (n1 == 0) return 'zéro';
  const u = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const d = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
  String below100(int x) {
    if (x < 20) return u[x];
    final dd = x ~/ 10, uu = x % 10;
    if (dd == 7 || dd == 9) return '${d[dd]}${dd == 7 && uu == 1 ? '-et-' : '-'}${u[10 + uu]}';
    return d[dd] + (uu == 1 && dd != 8 ? '-et-un' : uu > 0 ? '-${u[uu]}' : (dd == 8 ? 's' : ''));
  }
  String below1000(int x) {
    final c = x ~/ 100, r = x % 100;
    return (c > 0 ? (c > 1 ? '${u[c]}-cent${r > 0 ? '' : 's'}' : 'cent') + (r > 0 ? '-' : '') : '') + (r > 0 ? below100(r) : '');
  }
  final out = <String>[];
  for (final (v, w) in [(1000000000, 'milliard'), (1000000, 'million'), (1000, 'mille')]) {
    final q = n1 ~/ v;
    if (q > 0) {
      out.add(v == 1000 ? (q > 1 ? '${below1000(q)}-mille' : 'mille') : '${below1000(q)}-$w${q > 1 ? 's' : ''}');
      n1 %= v;
    }
  }
  if (n1 > 0) out.add(below1000(n1));
  return out.join('-');
}
