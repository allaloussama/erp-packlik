import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:packlik/config.dart';
import 'package:packlik/erp/net.dart';
import 'package:packlik/erp/rules.dart';
import 'package:packlik/erp/rules2.dart';
import 'package:packlik/erp/store.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Parcours complet contre un vrai serveur PackLik sur une base jetable (jamais le site en ligne) :
///   PACKLIK_DSN=sqlite:/tmp/x.sqlite php -S 127.0.0.1:8199 router.php
///   flutter test test/erp_live_test.dart --dart-define=PACKLIK_URL=http://127.0.0.1:8199/
/// Sans cette adresse locale, le test est ignoré.
void main() {
  final local = kBaseUrl.startsWith('http://127.0.0.1');
  final pw = 'test-${DateTime.now().millisecondsSinceEpoch}';

  Future<ErpStore> loginAs(String email) async {
    SharedPreferences.setMockInitialValues({});
    final st = ErpStore(ErpNet(await SharedPreferences.getInstance()));
    final err = await st.login(email, pw);
    expect(err, isNull, reason: 'connexion $email');
    return st;
  }

  test('admin → agent → gérant/admin → livreur : chaque écriture acceptée par le serveur', () async {
    // installation : compte admin
    final setup = await http.post(Uri.parse('${kBaseUrl}api/?r=setup'), headers: {'Content-Type': 'application/json'}, body: jsonEncode({'name': 'Admin Test', 'email': 'admin@test.local', 'password': pw}));
    expect(setup.statusCode, 200, reason: setup.body);

    final admin = await loginAs('admin@test.local');
    expect(admin.role, 'admin');
    final rejected = <String>[];
    admin.messages.listen(rejected.add);
    admin.c['wilayas']!.add({'id': 16, 'code': '16', 'fr': 'Alger', 'ar': 'الجزائر', 'home': 400, 'desk': 250, 'dhdHome': 350, 'dhdDesk': 200, 'active': true});
    admin.c['carriers']!.add({'id': 'own', 'name': 'Mes livreurs', 'short': 'PKL', 'connected': true, 'isDefault': true, 'internal': true, 'feeFactor': 0.8, 'baseKg': 20, 'extraPerKg': 0, 'maxParcelKg': 40, 'chargeOverweight': false, 'desk': false, 'cod': true});
    admin.c['couriers']!.add({'id': 1, 'name': 'Walid', 'phone': '0661 30 44 12', 'active': true, 'online': true, 'zones': [16], 'communes': [], 'perDelivery': 250});
    admin.c['products']!.add({'id': 1, 'name': 'Boîte burger', 'sku': 'BB-1', 'price': 1000, 'cost': 600, 'stock': 20, 'weight': 500, 'status': 'actif', 'threshold': 3});
    admin.users.addAll([
      {'id': 40, 'name': 'Agent Test', 'role': 'agent', 'email': 'agent@test.local', 'active': true, 'online': true},
      {'id': 50, 'name': 'Livreur Test', 'role': 'livreur', 'email': 'livreur@test.local', 'active': true, 'courierId': 1},
    ]);
    admin.settings.addAll({'modules': {'weight': true}, 'discountAgent': 5, 'autoAssign': false, 'boxes': {'security': 20, 'reinvest': 80}});
    for (final b in ['reserve', 'pub', 'security', 'reinvest']) {
      admin.c['cashboxes']!.add({'id': b, 'fr': b, 'balance': 0});
    }
    admin.c['suppliers']!.add({'id': 1, 'name': 'Fournisseur test', 'terms': 7});
    admin.reindex();
    await admin.syncNow();
    expect(rejected, isEmpty);
    for (final id in [40, 50]) {
      await admin.net.call('password', {'uid': id, 'password': pw});
    }

    // commande passée sur la boutique (route publique, comme l'application et le site)
    final order = await http.post(Uri.parse('${kBaseUrl}api/?r=order'), headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'name': 'Karim Client', 'phone': '0555123456', 'wilaya': 16, 'commune': 'Hydra', 'address': 'Rue 1', 'delivery': 'home', 'note': '', 'website': '', 'platform': 'Facebook', 'items': [{'pid': 1, 'v': null, 'q': 3}]}));
    expect(order.statusCode, 200, reason: order.body);
    await admin.syncNow();
    final o = admin.orders.single;
    o['agentId'] = 40;
    admin.touch();
    await admin.syncNow();
    expect(rejected, isEmpty);

    // agent : ouvre la fiche (verrou), confirme
    final agent = await loginAs('agent@test.local');
    final ao = agent.orders.single;
    expect(agent.kCanConf(ao), isTrue);
    agent.lockOrder(ao);
    expect(agent.confApply(ao, 'confirmed'), isNull);
    final agentRejected = <String>[];
    agent.messages.listen(agentRejected.add);
    await agent.syncNow();
    expect(agentRejected, isEmpty);

    // admin : préparation puis envoi au livreur interne
    await admin.syncNow();
    final o2 = admin.orders.single;
    expect(o2['status'], 'toprep');
    admin.markReady(o2);
    expect(await admin.shipOrders([o2]), isEmpty);
    await admin.syncNow();
    expect(rejected, isEmpty);

    // livreur : voit sa commande, part, livre
    final lv = await loginAs('livreur@test.local');
    final lo = lv.lvMine().single;
    expect(lo['status'], 'sent');
    lv.lvGo(lo);
    lv.lvDone(lo, 'RAS');
    final lvRejected = <String>[];
    lv.messages.listen(lvRejected.add);
    await lv.syncNow();
    expect(lvRejected, isEmpty);

    // vérification sur une session neuve : tout est bien sur le serveur
    final check = await loginAs('admin@test.local');
    final f = check.orders.single;
    expect(f['status'], 'delivered');
    expect(f['cashWithCourier'], isTrue);
    expect(f['courierId'], 1);
    expect(s(f['tracking']), startsWith('PKL-'));
    expect(m(m(f['docs'])['bl'])['no'], isNotNull);
    expect(check.pby[1]!['stock'], 17);
    expect(check.c['stock_moves']!.any((x) => x['type'] == 'expédition' && x['q'] == -3), isTrue);
    expect((f['history'] as List).map((h) => m(h)['action']), containsAll(['En appel', 'Confirmée → À préparer', 'Prête', 'Remise au livreur', 'En livraison']));

    // admin : encaisse l'argent du livreur (caisses remplies), puis paie le fournisseur (commande clôturée)
    final checkRejected = <String>[];
    check.messages.listen(checkRejected.add);
    expect(check.collectCourier(check.c['couriers']!.single), check.orderTotal(f));
    expect(f['status'], 'paid');
    expect(check.paySupplier(1, [f], 'Espèces'), isNull);
    await check.syncNow();
    expect(checkRejected, isEmpty);
    final last = await loginAs('admin@test.local');
    final g = last.orders.single;
    expect(g['status'], 'closed');
    expect(last.box('reserve')!['balance'], 0); // + coût d'achat à l'encaissement, − même montant payé au fournisseur
    expect(n(last.box('pub')!['balance']), 700);
    expect(last.supPayments.single['amount'], 1800);
    expect(last.c['cash_moves']!.length, 5);
  }, skip: local ? false : 'serveur local non indiqué (PACKLIK_URL=http://127.0.0.1:…)');
}
