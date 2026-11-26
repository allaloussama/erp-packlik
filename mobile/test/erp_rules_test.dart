import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:packlik/erp/net.dart';
import 'package:packlik/erp/rules.dart';
import 'package:packlik/erp/rules2.dart';
import 'package:packlik/erp/store.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Les règles de l'ERP de l'application doivent donner les mêmes résultats que le site (assets/app.js, kando.js…).
void main() {
  late List<Map<String, dynamic>> calls;
  late Map<String, dynamic> Function(Map<String, dynamic>) onSync;

  Future<ErpStore> boot({String role = 'agent'}) async {
    SharedPreferences.setMockInitialValues({});
    calls = [];
    onSync = (_) => {'changes': [], 'rejected': [], 'rev': 2};
    final client = MockClient((req) async {
      final route = req.url.queryParameters['r'];
      if (route == 'boot') {
        return http.Response(jsonEncode({
          'user': {'id': 4, 'name': 'Amina', 'role': role},
          'csrf': 'tok', 'rev': 1, 'needSetup': false, 'empty': false,
          'data': {
            'users': [['4', 1, {'id': 4, 'name': 'Amina', 'role': role, 'courierId': 1}]],
            'wilayas': [['16', 1, {'id': 16, 'fr': 'Alger', 'home': 400, 'desk': 250, 'dhdHome': 350, 'dhdDesk': 200}]],
            'carriers': [['own', 1, {'id': 'own', 'name': 'Mes livreurs', 'short': 'PKL', 'connected': true, 'internal': true, 'feeFactor': 0.8, 'baseKg': 20, 'extraPerKg': 0, 'maxParcelKg': 40, 'chargeOverweight': false}]],
            'couriers': [['1', 1, {'id': 1, 'name': 'Walid', 'active': true, 'online': true, 'zones': [16]}]],
            'products': [
              ['1', 1, {'id': 1, 'name': 'Boîte burger', 'price': 1000, 'cost': 600, 'stock': 10, 'weight': 500, 'status': 'actif', 'threshold': 2}],
              ['2', 1, {'id': 2, 'name': 'Sac kraft', 'price': 50, 'cost': 20, 'stock': 0, 'status': 'actif'}],
            ],
            'customers': [['7', 1, {'id': 7, 'name': 'Karim', 'phone': '0555 12 34 56'}]],
            'orders': [
              ['1', 1, {'id': 1, 'ref': 'PK-1001', 'created': 1, 'status': 'new', 'customerId': 7, 'agentId': 4, 'wilaya': 16, 'commune': 'Hydra', 'delivery': 'home', 'carrier': 'own',
                'items': [{'pid': 1, 'q': 3, 'price': 1000, 'cost': 600}], 'initial': [{'pid': 1, 'q': 2, 'price': 1000, 'cost': 600}], 'history': [], 'attempts': [], 'times': {}, 'discount': 10, 'calls': 0, 'courierId': 1}],
              ['2', 1, {'id': 2, 'ref': 'PK-1002', 'created': 2, 'status': 'new', 'customerId': 7, 'agentId': 9, 'wilaya': 16, 'commune': 'Hydra', 'delivery': 'desk', 'items': [{'pid': 2, 'q': 1, 'price': 50}], 'history': [], 'times': []}],
            ],
            'kv': [['settings', 1, {'_key': 'settings', 'modules': {'weight': true}, 'discountAgent': 5, 'docs': {}}]],
          },
        }), 200, headers: {'set-cookie': 'packlik=abc123; path=/; HttpOnly', 'content-type': 'application/json; charset=utf-8'});
      }
      if (route == 'sync') {
        final body = jsonDecode(req.body) as Map<String, dynamic>;
        expect(req.headers['X-CSRF'], 'tok');
        expect(req.headers['Cookie'], 'packlik=abc123');
        calls.add(body);
        return http.Response(jsonEncode(onSync(body)), 200, headers: {'content-type': 'application/json; charset=utf-8'});
      }
      return http.Response('{}', 404);
    });
    final prefs = await SharedPreferences.getInstance();
    final st = ErpStore(ErpNet(prefs, client));
    await st.boot();
    return st;
  }

  test('boot : documents lus, commandes normalisées, cookie de session gardé', () async {
    final st = await boot();
    expect(st.role, 'agent');
    expect(st.orders.length, 2);
    expect(st.orderById(2)['times'], isA<Map>()); // [] du serveur → {} comme normDoc()
    expect(st.pby[1]!['name'], 'Boîte burger');
  });

  test('totaux : remise %, frais selon wilaya × société arrondis à 10, poids', () async {
    final st = await boot();
    final o = st.orderById(1);
    expect(st.orderSub(o), 3000);
    expect(st.discountAmt(o), 300);
    expect(st.feeOf(o), 320); // 400 × 0,8
    expect(st.orderTotal(o), 3020);
    expect(st.orderWeight(o), 1.5);
    o['discountType'] = 'amount';
    o['discount'] = 5000;
    expect(st.discountAmt(o), 3000); // plafonnée au sous-total
  });

  test('statut affiché : En attente, puis Échec 01 avec rappel dans 30 min', () async {
    final st = await boot();
    final o = st.orderById(1);
    expect(st.kLabel(o), 'En attente');
    st.lockOrder(o);
    expect(o['status'], 'calling');
    expect(st.confApply(o, 'fail01'), isNull);
    expect(o['status'], 'unreach');
    expect(o['unreachN'], 1);
    expect(n(o['nextCall']) - now(), closeTo(30 * kMin, 2000));
    expect(st.kLabel(o), 'Échec 01');
    expect(o['lockedBy'], isNull);
  });

  test('confirmation : refusée si stock insuffisant, sinon À préparer avec upsell et remise à valider', () async {
    final st = await boot();
    final o = st.orderById(1);
    st.pby[1]!['stock'] = 1;
    expect(st.confApply(o, 'confirmed'), contains('stock insuffisant'));
    expect(o['status'], 'new');
    st.pby[1]!['stock'] = 10;
    expect(st.confApply(o, 'confirmed'), isNull);
    expect(o['status'], 'toprep');
    expect(o['discountPending'], isTrue); // 10 % > 5 % permis à l'agent
    expect(s((o['history'] as List).last['action']), 'Confirmée → À préparer');
    expect(s((o['history'] as List).last['note']), contains('upsell'));
  });

  test('agent : une commande d\'un autre agent est refusée', () async {
    final st = await boot();
    expect(st.confApply(st.orderById(2), 'confirmed'), 'Commande d\'un autre agent');
  });

  test('envoi : frais figés, suivi PKL-, stock décrémenté, mouvement, bon de livraison numéroté', () async {
    final st = await boot(role: 'gerant');
    final o = st.orderById(1)..['status'] = 'ready';
    final ko = await st.shipOrders([o]);
    expect(ko, isEmpty);
    expect(o['status'], 'sent');
    expect(o['feeFixed'], 320);
    expect(s(o['tracking']), startsWith('PKL-'));
    expect(st.pby[1]!['stock'], 7);
    expect(st.c['stock_moves']!.first['q'], -3);
    expect(m(m(o['docs'])['bl'])['no'], 'BL-${DateTime.now().year}-0001');
  });

  test('livreur : échec avec motif puis livrée → argent chez le livreur', () async {
    final st = await boot(role: 'livreur');
    final o = st.orderById(1)..['status'] = 'outfor';
    expect(st.lvMine().map((x) => x['id']), [1]);
    st.lvFail(o, 'absent', 'rappeler à 17 h');
    expect(o['status'], 'failed');
    expect(m((o['attempts'] as List).single)['byCourier'], isTrue);
    st.lvDone(o, '');
    expect(o['status'], 'delivered');
    expect(o['cashWithCourier'], isTrue);
    expect(st.counters()['lvc'], 1);
  });

  test('synchronisation : seul le document modifié part, avec sa révision ; le serveur fait foi au retour', () async {
    final st = await boot();
    final o = st.orderById(1);
    onSync = (body) => {
          'changes': [['orders', '1', 5, {...(body['up'] as List).single['d'] as Map, 'serverMark': true}]],
          'rejected': [], 'rev': 5,
        };
    st.logCall(o);
    await st.syncNow();
    final up = calls.single['up'] as List;
    expect(up.length, 1);
    expect(up.single['c'], 'orders');
    expect(up.single['base'], 1);
    expect(calls.single['since'], 1);
    expect(st.orderById(1)['serverMark'], isTrue);
    calls.clear();
    await st.syncNow();
    expect((calls.single['up'] as List), isEmpty); // rien de nouveau à envoyer
  });

  test('synchronisation : modification refusée → version du serveur remise et message', () async {
    final st = await boot();
    final msgs = <String>[];
    st.messages.listen(msgs.add);
    onSync = (_) => {
          'changes': [],
          'rejected': [['orders', '1', 3, {'id': 1, 'ref': 'PK-1001', 'status': 'new', 'items': [], 'history': [], 'times': {}}]],
          'rev': 3,
        };
    st.orderById(1)['note'] = 'test';
    await st.syncNow();
    await Future<void>.delayed(Duration.zero);
    expect(st.orderById(1)['note'], isNull);
    expect(msgs.single, startsWith('Une modification n\'a pas été enregistrée'));
  });

  test('montant en lettres (documents)', () {
    expect(frWords(0), 'zéro');
    expect(frWords(71), 'soixante-et-onze');
    expect(frWords(80), 'quatre-vingts');
    expect(frWords(3020), 'trois-mille-vingt');
    expect(frWords(1200000), 'un-million-deux-cents-mille');
  });

  test('encaissement : fiche financière et répartition dans les 4 caisses', () async {
    final st = await boot(role: 'admin');
    for (final b in ['reserve', 'pub', 'security', 'reinvest']) {
      st.c['cashboxes']!.add({'id': b, 'fr': b, 'balance': 0});
    }
    st.settings.addAll({'commission': 100, 'adCostPerDelivered': 700, 'boxes': {'security': 20, 'reinvest': 80}});
    final o = st.orderById(1)..['status'] = 'delivered';
    final f = st.finOf(o);
    expect(f.total, 3020);
    expect(f.cost, 1800);
    expect(f.dhd, 280); // 350 × 0,8
    expect(f.net, 3020 - 1800 - 280 - 700 - 100);
    st.setStatus(o, 'paid');
    expect(st.box('reserve')!['balance'], 1800);
    expect(st.box('pub')!['balance'], 700);
    expect(st.box('security')!['balance'], (f.net * .2).round());
    expect(st.box('reinvest')!['balance'], f.net - (f.net * .2).round());
  });

  test('fournisseur : part à régler, paiement, commande clôturée et réserve débitée', () async {
    final st = await boot(role: 'admin');
    st.c['cashboxes']!.add({'id': 'reserve', 'fr': 'Réserve', 'balance': 10000});
    st.c['suppliers']!.add({'id': 1, 'name': 'Mitidja', 'terms': 7});
    final o = st.orderById(1)..['status'] = 'paid';
    (o['times'] as Map)['paid'] = now();
    expect(st.supBalanceOf(1).due, 1800);
    expect(st.supplierDues().single.rest, 1800);
    expect(st.paySupplier(1, [o], 'Espèces'), isNull);
    expect(o['status'], 'closed');
    expect(st.supBalanceOf(1).due, 0);
    expect(st.supBalanceOf(1).paid, 1800);
    expect(st.box('reserve')!['balance'], 8200);
    expect(st.journalEntries().any((e) => e.cat == 'Achats fournisseur' && e.out == 1800), isTrue);
  });

  test("menu de l'admin réorganisé sur le site (SETTINGS.menuOrder)", () async {
    final st = await boot(role: 'admin');
    st.settings['menuOrder'] = ['g:Ventes', 'confirmer', 'dashboard', 'g:Reste'];
    final g = st.menusFor('admin');
    expect(g.first.$1, 'Ventes');
    expect(g.first.$2.map((i) => i.key), ['confirmer', 'dashboard']);
    expect(g.last.$2.length, kMenus['admin']!.fold<int>(0, (t, x) => t + x.$2.length) - 2);
  });
  test('découpage des colis : proposition, déplacement manuel, frais par colis, stop desk sans commune', () async {
    final st = await boot(role: 'admin');
    final o = st.orderById(1)..['items'] = [{'pid': 1, 'q': 5, 'price': 1000, 'cost': 600}];
    st.pby[1]!['weight'] = 1000; // 1 kg × 5
    final p = st.proposeParcels(o, 2);
    expect(p.length, 3);
    expect(p.map((x) => x['weight']), [2, 2, 1]);
    expect(st.parcelShip(o, 1), st.baseShip(o, st.carrierOf(o)));
    st.saveSplit(o, [...p, {'n': 4, 'items': <Map<String, dynamic>>[]}]); // colis vide retiré
    expect(st.parcelsOf(o).length, 3);
    expect(st.parcelsOf(o).map((x) => x['n']), [1, 2, 3]);
    expect(st.needsSplit(o), isFalse);
    st.resetSplit(o);
    expect(o['parcels'], isNull);
    st.setProductWeight(st.pby[1]!, 2.5);
    expect(st.pby[1]!['weight'], 2500);
    expect(kgTxt(2.5), '2.5');
    expect(kgTxt(3), '3');
    final d = st.orderById(2)..['commune'] = '';
    expect(st.preSendCheck(d).contains('Commune manquante'), isFalse); // stop desk
    d['delivery'] = 'home';
    expect(st.preSendCheck(d).contains('Commune manquante'), isTrue);
  });
}
