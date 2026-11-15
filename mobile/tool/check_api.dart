// Vérifie que l'application lit bien le site : dart run --define=PACKLIK_URL=https://votre-site/ tool/check_api.dart
// ignore_for_file: avoid_print
import 'package:packlik/api.dart';
import 'package:packlik/config.dart';

Future<void> main() async {
  final c = await Api().catalog();
  print('Site : $kBaseUrl');
  print('${c.products.length} produits, ${c.categories.length} catégories, ${c.wilayas.length} wilayas, ${c.slides.length} slides, ${c.fields.length} champs de formulaire réglés');
  final p = c.products.firstWhere((x) => x.canOrder);
  print('Exemple : ${p.name} — ${p.unitPrice(null, p.minQty)} DZD — ${p.images.isEmpty ? 'sans photo' : p.images.first}');
}
