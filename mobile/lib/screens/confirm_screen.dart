import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../config.dart';
import '../i18n.dart';
import '../state.dart';
import '../theme.dart';

class ConfirmScreen extends ConsumerWidget {
  const ConfirmScreen({super.key, required this.ref, required this.total});
  final String ref;
  final int total;

  @override
  Widget build(BuildContext context, WidgetRef wref) {
    final lang = wref.watch(langProvider);
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              const CircleAvatar(radius: 36, backgroundColor: Color(0xFFE7F5EA), child: Icon(Icons.check_rounded, color: kGreen, size: 40)),
              const SizedBox(height: 18),
              Text(tr(lang, 'Merci ! Votre commande est enregistrée'), textAlign: TextAlign.center, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
              const SizedBox(height: 12),
              DecoratedBox(
                decoration: BoxDecoration(color: kInk, borderRadius: BorderRadius.circular(8)),
                child: Padding(padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8), child: Text('${tr(lang, 'N° de commande')} : $ref', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700))),
              ),
              if (total > 0) Padding(padding: const EdgeInsets.only(top: 10), child: Text('${tr(lang, 'Total à payer à la livraison')} : ${dzd(total, lang: lang)}', style: const TextStyle(fontWeight: FontWeight.w700))),
              const SizedBox(height: 12),
              Text(tr(lang, 'Un agent PackLik va vous appeler pour confirmer votre commande.'), textAlign: TextAlign.center, style: const TextStyle(color: kMuted)),
              const SizedBox(height: 22),
              SizedBox(width: 260, child: FilledButton(onPressed: () => context.go('/'), child: Text(tr(lang, 'Continuer mes achats')))),
            ]),
          ),
        ),
      ),
    );
  }
}
