import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:packlik/models.dart';
import 'package:packlik/screens/home_screen.dart';
import 'package:packlik/screens/product_screen.dart';
import 'package:packlik/state.dart';
import 'package:packlik/theme.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Boutique de l'application avec le design du site : slides (bannières), cartes produit, photo en plein écran.
void main() {
  final boot = {
    'data': {
      'products': [
        for (var i = 1; i <= 4; i++)
          [i, 1, {'id': i, 'name': 'Boîte burger kraft avec un nom assez long $i', 'price': 1000 * i, 'status': 'actif', 'stock': 5, 'isNew': i == 1, 'images': ['assets/products/a$i.webp', 'assets/products/b$i.webp', 'assets/products/c$i.webp'], 'cats': ['burger']}],
      ],
      'wilayas': [[16, 1, {'id': 16, 'fr': 'Alger', 'home': 400, 'desk': 250, 'active': true}]],
      'kv': [['settings', 1, {'_key': 'settings', 'cats': [{'id': 'burger', 'fr': 'Burger', 'ar': 'برغر'}], 'site': {'slides': [
        {'title': 'Cachée', 'on': false},
        {'title': 'Bannière', 'banner': 'uploads/pc.jpg', 'bannerM': 'uploads/tel.mp4', 'link': '#/categorie/burger'},
        {'badge': 'Promo', 'title': 'Offres exclusives à ne pas manquer', 'text': 'Des packs complets', 'button': 'Acheter', 'link': '#/boutique', 'img': 'uploads/p.webp', 'bg': '#182028', 'color': '#FFFFFF'},
        {'title': 'Vidéo seule', 'banner': 'uploads/v.mp4'},
      ]}}]],
    },
  };
  final c = Catalog.fromBoot(boot);

  test('slides : « Affichée » respectée, bannière téléphone d\'abord, vidéo non lue', () {
    expect(c.slides.map((s) => s.title), ['Bannière', 'Offres exclusives à ne pas manquer', 'Vidéo seule']);
    expect(c.slides[0].bannerImage, endsWith('uploads/pc.jpg')); // la version téléphone est une vidéo : image ordinateur
    expect(c.slides[1].bannerImage, isEmpty);
    expect(c.slides[2].bannerImage, isEmpty); // vidéo seule : la slide garde son texte
    expect(Slide.isVideo('x/y.MP4?v=2'), isTrue);
  });

  Future<void> pump(WidgetTester tester, Widget home, String lang) async {
    tester.view.physicalSize = const Size(360, 740);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    SharedPreferences.setMockInitialValues({'lang': lang});
    final prefs = await SharedPreferences.getInstance();
    await tester.pumpWidget(ProviderScope(
      overrides: [prefsProvider.overrideWithValue(prefs), catalogProvider.overrideWith((ref) async => c)],
      child: MaterialApp(theme: packlikTheme(), home: home),
    ));
    await tester.pumpAndSettle();
  }

  for (final lang in ['ar', 'fr']) {
    testWidgets('accueil sur téléphone ($lang) : slides, catégories, cartes sans débordement', (tester) async {
      await pump(tester, const HomeScreen(), lang);
      expect(tester.takeException(), isNull);
      await tester.drag(find.byType(Scrollable).first, const Offset(0, -1500));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
      expect(find.byIcon(Icons.bolt), findsWidgets); // « Acheter maintenant » sur chaque carte
    });
  }

  testWidgets('fiche produit : la photo s\'ouvre en plein écran, on glisse, on ferme', (tester) async {
    await pump(tester, const ProductScreen(id: 2), 'fr');
    expect(tester.takeException(), isNull);
    await tester.tap(find.byType(PageView).first);
    await tester.pumpAndSettle();
    expect(find.text('1 / 3'), findsOneWidget);
    await tester.drag(find.byType(PageView).last, const Offset(-300, 0));
    await tester.pumpAndSettle();
    expect(find.text('2 / 3'), findsOneWidget);
    await tester.tap(find.byIcon(Icons.close));
    await tester.pumpAndSettle();
    expect(find.text('2 / 3'), findsNothing);
    expect(tester.takeException(), isNull);
  });
}
