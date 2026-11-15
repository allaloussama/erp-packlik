import 'package:flutter_test/flutter_test.dart';
import 'package:packlik/models.dart';

/// Les règles de prix de l'application doivent être celles du site (le serveur recalcule de toute façon).
void main() {
  final boot = {
    'data': {
      'products': [
        [1, 1, {'id': 1, 'name': 'Boîte burger', 'price': 1000, 'minQty': 2, 'stock': 5, 'status': 'actif', 'images': ['assets/products/a.webp'], 'cats': ['burger'], 'tiers': [{'min': 10, 'price': 800}, {'min': 3, 'price': 900}], 'freeShipQty': 20}],
        [2, 1, {'id': 2, 'name': 'Sac', 'price': 0, 'status': 'actif', 'variants': [{'id': 'a', 'label': '3 KG', 'price': 500, 'stock': 0}, {'id': 'b', 'label': '5 KG', 'price': 700, 'stock': 4}]}],
        [3, 1, {'id': 3, 'name': 'Supprimé', 'price': 10, 'status': 'corbeille'}],
      ],
      'wilayas': [[16, 1, {'id': 16, 'fr': 'Alger', 'home': 400, 'desk': 250, 'active': true}], [1, 1, {'id': 1, 'fr': 'Adrar', 'home': 900, 'desk': 600, 'active': false}]],
      'kv': [['settings', 1, {'_key': 'settings', 'cats': [{'id': 'burger', 'fr': 'Burger', 'img': 'uploads/b.png'}], 'site': {'form': {'title': 'Commandez !', 'fields': [{'key': 'ville', 'label': 'Ville', 'type': 'text', 'required': true}]}, 'brand': {'phone1': '0555 00 00 00'}}}]],
    },
  };
  final c = Catalog.fromBoot(boot);

  test('catalogue lu comme le site : corbeille et wilayas fermées exclues, réglages lus', () {
    expect(c.products.map((p) => p.id), [1, 2]);
    expect(c.wilayas.map((w) => w.id), [16]);
    expect(c.categories.single.img, endsWith('uploads/b.png'));
    expect(c.formTitle, 'Commandez !');
    expect(c.fields.single.isCustom, isTrue);
    expect(c.brand.phone1, '0555 00 00 00');
    expect(c.products.first.images.single, startsWith('http'));
  });

  test('prix par palier de quantité (le meilleur palier atteint), puis variante', () {
    final p = c.byId(1)!;
    expect(p.unitPrice(null, 2), 1000);
    expect(p.unitPrice(null, 3), 900);
    expect(p.unitPrice(null, 12), 800);
    expect(c.byId(2)!.unitPrice('b', 1), 700);
    expect(c.byId(2)!.canOrder, isTrue); // une variante en stock suffit
  });

  test('total du panier et livraison gratuite', () {
    final lines = [const CartLine(pid: 1, q: 10), const CartLine(pid: 2, v: 'a', q: 2)];
    expect(linesTotal(c, lines), 10 * 800 + 2 * 500);
    expect(freeShipping(c, lines), isFalse);
    expect(freeShipping(c, [const CartLine(pid: 1, q: 20)]), isTrue);
  });
}
