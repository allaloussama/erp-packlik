import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:packlik/erp/erp_app.dart';
import 'package:packlik/erp/net.dart';
import 'package:packlik/erp/orders.dart';
import 'package:packlik/erp/rules.dart';
import 'package:packlik/erp/store.dart';
import 'package:packlik/theme.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Chaque page du menu de chaque rôle s'ouvre sans erreur d'affichage (téléphone étroit compris),
/// ainsi que la fiche d'une commande.
Map<String, dynamic> _data(String role) => {
      'user': {'id': 4, 'name': 'Amina Test', 'role': role},
      'csrf': 'tok', 'rev': 1,
      'data': {
        'users': [
          ['4', 1, {'id': 4, 'name': 'Amina Test', 'role': role, 'courierId': 1, 'online': true}],
          ['5', 1, {'id': 5, 'name': 'Yacine Agent', 'role': 'agent', 'online': true}],
        ],
        'wilayas': [['16', 1, {'id': 16, 'fr': 'Alger', 'home': 400, 'desk': 250, 'dhdHome': 350, 'dhdDesk': 200}]],
        'carriers': [['own', 1, {'id': 'own', 'name': 'Mes livreurs', 'short': 'PKL', 'connected': true, 'internal': true, 'feeFactor': 0.8}]],
        'couriers': [['1', 1, {'id': 1, 'name': 'Walid', 'active': true, 'online': true, 'zones': [16], 'perDelivery': 250}]],
        'products': [
          ['1', 1, {'id': 1, 'name': 'Boîte burger kraft avec un nom assez long pour tester le retour à la ligne', 'sku': 'BB-1', 'price': 1000, 'cost': 600, 'stock': 2, 'weight': 500, 'status': 'actif', 'threshold': 5, 'images': []}],
          ['2', 1, {'id': 2, 'name': 'Sac', 'price': 0, 'status': 'devis', 'variants': [{'id': 'a', 'label': '3 KG', 'price': 500, 'stock': 3}]}],
        ],
        'customers': [['7', 1, {'id': 7, 'name': 'Karim Benali', 'phone': '0555 12 34 56', 'wilaya': 16}]],
        'stock_moves': [['m1', 1, {'_id': 'm1', 'at': 1700000000000, 'pid': 1, 'type': 'ajustement', 'q': -1, 'ref': 'ADJ', 'motif': 'casse', 'who': 'X'}]],
        'activity': [['a1', 1, {'_id': 'a1', 'at': 1700000000000, 'user': 'X', 'role': 'admin', 'action': 'Statut', 'entity': 'PK-1', 'details': ''}]],
        'orders': [
          for (final (i, st) in ['new', 'unreach', 'callback', 'toprep', 'ready', 'sent', 'outfor', 'failed', 'delivered', 'returning', 'paid', 'cancelled'].indexed)
            ['${i + 1}', 1, {
              'id': i + 1, 'ref': 'PK-${1000 + i}', 'created': DateTime.now().millisecondsSinceEpoch - i * 3600000, 'status': st, 'customerId': 7, 'agentId': 4, 'courierId': 1,
              'wilaya': 16, 'commune': 'Hydra', 'address': 'Cité des 200 logements, bloc B', 'delivery': 'home', 'carrier': 'own', 'platform': 'Facebook', 'source': 'Site',
              'items': [{'pid': 1, 'q': 2, 'price': 1000, 'cost': 600}], 'initial': [], 'attempts': st == 'failed' ? [{'n': 1, 'at': 1, 'reason': 'absent', 'comment': 'rappeler'}] : [],
              'history': [{'at': 1, 'who': 'Système', 'action': 'Commande créée', 'note': '', 'color': ''}],
              'times': {'delivered': st == 'delivered' ? DateTime.now().millisecondsSinceEpoch : null}, 'nextCall': st == 'callback' ? DateTime.now().millisecondsSinceEpoch : null,
              'cashWithCourier': st == 'delivered', 'note': 'Livrer le matin',
            }],
        ],
        'cashboxes': [for (final b in ['reserve', 'pub', 'security', 'reinvest']) [b, 1, {'id': b, 'fr': 'Caisse $b', 'balance': 50000}]],
        'cash_moves': [['c1', 1, {'_id': 'c1', 'at': 1700000000000, 'box': 'pub', 'amount': -1200, 'type': 'Dépense', 'ref': 'EXP', 'who': 'X'}]],
        'suppliers': [['1', 1, {'id': 1, 'name': 'Mitidja Emballage SARL', 'terms': 7, 'phone': '0553 77 66 55'}]],
        'purchases': [['BC-01', 1, {'id': 'BC-01', 'created': 1700000000000, 'expected': 1700300000000, 'status': 'sent', 'items': [{'pid': 1, 'q': 50, 'cost': 600, 'recv': 0}]}], ['BC-02', 1, {'id': 'BC-02', 'created': 1700000000000, 'expected': 1700300000000, 'receivedAt': 1700400000000, 'status': 'received', 'items': [{'pid': 1, 'q': 50, 'cost': 600, 'recv': 45}]}]],
        'sup_payments': [['PF-101', 1, {'id': 'PF-101', 'supplierId': 1, 'at': 1700000000000, 'orderIds': [11], 'lines': [{'ref': 'PK-1010', 'items': [{'pid': 1, 'q': 2, 'cost': 600}], 'amount': 1200}], 'amount': 1200, 'mode': 'Espèces', 'confirmedAt': null}]],
        'advances': [['AV-01', 1, {'id': 'AV-01', 'amount': 8000, 'at': 1700000000000, 'due': 1700500000000, 'repaidAt': null, 'note': 'Boost'}]],
        'expenses': [['1', 1, {'id': 1, 'cat': 'Loyer', 'amount': 30000, 'at': 1700000000000, 'box': 'reinvest', 'note': 'Loyer novembre'}]],
        'ad_spend': [['a1', 1, {'_id': 'a1', 'date': 1700000000000, 'campaign': 'Boîte burger', 'usd': 12.5}]],
        'pixels': [['fb1', 1, {'id': 'fb1', 'platform': 'facebook', 'name': 'Pixel principal', 'pixelId': '123', 'token': '', 'testCode': '', 'active': true}]],
        'kv': [
          ['settings', 1, {'_key': 'settings', 'modules': {'weight': true, 'pixels': true}, 'supplierSales': true, 'carrierRules': [{'wilaya': 16, 'carrier': 'own'}], 'rules': [{'type': 'wilaya', 'value': '16', 'agentId': 5}], 'templates': {'unreach': 'Bonjour {nom}', 'shipped': 'Votre commande {ref}'},
            'site': {'slides': [{'title': 'Promo', 'badge': 'Nouveau', 'bg': '#FFE7D6', 'color': '#1B232B', 'on': true}], 'texts': {'fr': {'Accueil': 'Maison'}}, 'brand': {'nav': [{'label': 'Accueil', 'link': '#/'}]}}}],
          ['pixel_events', 1, {'_key': 'pixel_events', 'facebook': {'PageView': true, 'Purchase': true}, 'tiktok': {'PageView': true}}],
          ['meta', 1, {'_key': 'meta', 'accounts': [{'id': 'fbu1', 'name': 'Compte pub', 'token': 'x', 'adAccounts': [{'id': 'act_1', 'name': 'PackLik Ads', 'currency': 'USD', 'insights': [{'spend': '40'}], 'campaigns': [{'campaign': 'Boîte burger kraft', 'spend': '40', 'results': '8'}]}]}], 'dispRates': {'USD': '245'}}],
        ],
      },
    };

Future<ErpStore> _store(String role) async {
  SharedPreferences.setMockInitialValues({});
  final client = MockClient((req) async {
    final r = req.url.queryParameters['r'];
    final body = r == 'boot' ? _data(role) : {'changes': [], 'rejected': [], 'rev': 1};
    return http.Response(jsonEncode(body), 200, headers: {'content-type': 'application/json; charset=utf-8'});
  });
  final st = ErpStore(ErpNet(await SharedPreferences.getInstance(), client));
  await st.boot();
  return st;
}

void main() {
  for (final size in const [Size(360, 740), Size(1024, 768)]) {
    for (final role in kMenus.keys) {
      testWidgets('$role (${size.width.toInt()} px) : toutes les pages du menu', (tester) async {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1;
        addTearDown(tester.view.reset);
        final st = await tester.runAsync(() => _store(role)) as ErpStore;
        await tester.pumpWidget(MaterialApp(theme: packlikTheme(), home: ErpShell(store: st)));
        await tester.pump();
        for (final g in kMenus[role]!) {
          for (final item in g.$2) {
            await tester.tap(find.byTooltip('Open navigation menu'));
            await tester.pumpAndSettle();
            final entry = find.descendant(of: find.byType(Drawer), matching: find.text(item.label));
            await tester.scrollUntilVisible(entry, 120, scrollable: find.descendant(of: find.byType(Drawer), matching: find.byType(Scrollable)).first);
            await tester.pumpAndSettle();
            await tester.tap(entry);
            await tester.pumpAndSettle();
            // pages à onglets : chaque onglet s'affiche aussi
            final tabs = find.byType(Tab);
            for (var t = 1; t < tabs.evaluate().length; t++) {
              await tester.tap(tabs.at(t));
              await tester.pumpAndSettle();
            }
          }
        }
        st.dispose();
      });
    }
  }

  testWidgets('fiche commande : chaque statut, chaque rôle', (tester) async {
    tester.view.physicalSize = const Size(360, 740);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    for (final role in ['admin', 'agent', 'gerant', 'livreur']) {
      final st = await tester.runAsync(() => _store(role)) as ErpStore;
      for (final o in st.orders) {
        await tester.pumpWidget(MaterialApp(theme: packlikTheme(), home: OrderScreen(store: st, id: ni(o['id']))));
        await tester.pumpAndSettle();
        await tester.drag(find.byType(ListView).first, const Offset(0, -2000));
        await tester.pumpAndSettle();
        await tester.pumpWidget(const SizedBox());
        await tester.pump();
      }
      st.dispose();
    }
  });
}
