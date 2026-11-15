import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../i18n.dart';
import '../state.dart';

/// Conditions générales de vente : le même texte que la page #/cgv du site.
class CgvScreen extends ConsumerWidget {
  const CgvScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(langProvider);
    return Scaffold(
      appBar: AppBar(title: Text(tr(lang, 'Conditions générales de vente'))),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(tr(lang, 'Paiement à la livraison (espèces) dans les 69 wilayas via la société de livraison. Les frais de livraison dépendent de la wilaya et du type de livraison (domicile ou bureau).'), style: const TextStyle(height: 1.5)),
              const SizedBox(height: 12),
              Text(tr(lang, 'Chaque commande est confirmée par téléphone par un agent PackLik avant expédition.'), style: const TextStyle(height: 1.5)),
            ]),
          ),
        ),
      ]),
    );
  }
}
