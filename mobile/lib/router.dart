import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'i18n.dart';
import 'screens/cart_screen.dart';
import 'screens/confirm_screen.dart';
import 'screens/home_screen.dart';
import 'screens/more_screen.dart';
import 'screens/product_screen.dart';
import 'screens/shop_screen.dart';
import 'screens/web_screen.dart';
import 'state.dart';

/// Quatre onglets (Accueil, Boutique, Panier, Plus) ; fiche produit, confirmation et pages web par-dessus.
final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, shell) => _Shell(shell: shell),
      branches: [
        StatefulShellBranch(routes: [GoRoute(path: '/', builder: (c, s) => const HomeScreen())]),
        StatefulShellBranch(routes: [GoRoute(path: '/boutique', builder: (c, s) => ShopScreen(category: s.uri.queryParameters['cat'], query: s.uri.queryParameters['q']))]),
        StatefulShellBranch(routes: [GoRoute(path: '/panier', builder: (c, s) => const CartScreen())]),
        StatefulShellBranch(routes: [GoRoute(path: '/plus', builder: (c, s) => const MoreScreen())]),
      ],
    ),
    GoRoute(path: '/produit/:id', builder: (c, s) => ProductScreen(id: int.tryParse(s.pathParameters['id'] ?? '') ?? 0)),
    GoRoute(path: '/confirmation', builder: (c, s) => ConfirmScreen(ref: s.uri.queryParameters['ref'] ?? '', total: int.tryParse(s.uri.queryParameters['total'] ?? '') ?? 0)),
    GoRoute(path: '/web', builder: (c, s) => WebScreen(path: s.uri.queryParameters['p'] ?? '#/erp', title: s.uri.queryParameters['t'] ?? '')),
  ],
);

class _Shell extends ConsumerWidget {
  const _Shell({required this.shell});
  final StatefulNavigationShell shell;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(langProvider);
    final n = ref.watch(cartProvider).fold<int>(0, (s, l) => s + l.q);
    // le sens droite-à-gauche de l'arabe vient de la langue de l'application (main.dart)
    return Scaffold(
        body: shell,
        bottomNavigationBar: NavigationBar(
          selectedIndex: shell.currentIndex,
          onDestinationSelected: (i) => shell.goBranch(i, initialLocation: i == shell.currentIndex),
          destinations: [
            NavigationDestination(icon: const Icon(Icons.home_outlined), selectedIcon: const Icon(Icons.home), label: tr(lang, 'Accueil')),
            NavigationDestination(icon: const Icon(Icons.grid_view_outlined), selectedIcon: const Icon(Icons.grid_view_rounded), label: tr(lang, 'Boutique')),
            NavigationDestination(
              icon: Badge(isLabelVisible: n > 0, label: Text('$n'), child: const Icon(Icons.shopping_bag_outlined)),
              selectedIcon: Badge(isLabelVisible: n > 0, label: Text('$n'), child: const Icon(Icons.shopping_bag)),
              label: tr(lang, 'Panier'),
            ),
            NavigationDestination(icon: const Icon(Icons.menu), label: tr(lang, 'Plus')),
          ],
        ),
      );
  }
}
