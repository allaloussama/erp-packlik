import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../i18n.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/cod_form.dart';
import '../widgets/common.dart';

/// Panier : le formulaire de commande, avec les produits modifiables dedans (comme sur le site).
class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(langProvider);
    final empty = ref.watch(cartProvider).isEmpty;
    return Scaffold(
      appBar: AppBar(title: Text(tr(lang, 'Panier'), style: const TextStyle(fontWeight: FontWeight.w800))),
      body: CatalogGate(builder: (c, lang) => empty
          ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.shopping_bag_outlined, size: 54, color: kMuted),
              const SizedBox(height: 10),
              Text(tr(lang, 'Votre panier est vide'), style: const TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 14),
              SizedBox(width: 240, child: FilledButton(onPressed: () => context.go('/boutique'), child: Text(tr(lang, 'Continuer mes achats')))),
            ]))
          : ListView(padding: const EdgeInsets.all(14), children: [
              CodForm(catalog: c),
              const SizedBox(height: 10),
              TextButton(onPressed: () => context.go('/boutique'), child: Text(tr(lang, 'Continuer mes achats'))),
            ])),
    );
  }
}
