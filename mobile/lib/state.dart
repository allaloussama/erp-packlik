import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'api.dart';
import 'models.dart';

final apiProvider = Provider<Api>((ref) => Api());

/// Catalogue du site, rechargé en tirant l'écran vers le bas (ref.invalidate).
final catalogProvider = FutureProvider<Catalog>((ref) => ref.watch(apiProvider).catalog());

/// Communes par wilaya (fichier tiré du site : mobile/assets/communes.json).
final communesProvider = FutureProvider<Map<int, List<(String, String)>>>((ref) async {
  final raw = jsonDecode(await rootBundle.loadString('assets/communes.json')) as Map<String, dynamic>;
  return raw.map((k, v) => MapEntry(int.parse(k), ((v as Map)['c'] as List).map((c) => ('${(c as List)[0]}', '${c[1]}')).toList()));
});

/// Préférences du téléphone, chargées avant le démarrage (voir main.dart).
final prefsProvider = Provider<SharedPreferences>((ref) => throw UnimplementedError('prefsProvider'));

/// Langue de l'application (fr / ar), gardée sur le téléphone.
class LangNotifier extends Notifier<String> {
  @override
  String build() => ref.read(prefsProvider).getString('lang') ?? 'ar'; // arabe par défaut (comme le site)

  void set(String l) {
    state = l;
    ref.read(prefsProvider).setString('lang', l);
  }
}

final langProvider = NotifierProvider<LangNotifier, String>(LangNotifier.new);

/// Panier : les mêmes lignes que sur le site, gardées sur le téléphone. Jamais modifié sur place.
class CartNotifier extends Notifier<List<CartLine>> {
  @override
  List<CartLine> build() {
    final raw = ref.read(prefsProvider).getString('cart');
    if (raw == null) return const [];
    try {
      return List.unmodifiable((jsonDecode(raw) as List).map((e) => CartLine.fromJson((e as Map).cast<String, dynamic>())).where((l) => l.q > 0));
    } catch (_) {
      return const []; // panier illisible : on repart à zéro
    }
  }

  void _save(List<CartLine> lines) {
    state = List.unmodifiable(lines);
    ref.read(prefsProvider).setString('cart', jsonEncode(lines.map((l) => l.toJson()).toList()));
  }

  void add(CartLine line) {
    final i = state.indexWhere((l) => l.same(line));
    _save(i < 0 ? [...state, line] : [for (var k = 0; k < state.length; k++) k == i ? state[k].copyWith(q: state[k].q + line.q) : state[k]]);
  }

  void setQty(CartLine line, int q, {int min = 1}) =>
      _save([for (final l in state) l.same(line) ? l.copyWith(q: q < min ? min : q) : l]);

  void remove(CartLine line) => _save(state.where((l) => !l.same(line)).toList());

  void clear() => _save(const []);
}

final cartProvider = NotifierProvider<CartNotifier, List<CartLine>>(CartNotifier.new);
