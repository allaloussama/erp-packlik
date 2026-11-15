import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';

import '../config.dart';
import '../i18n.dart';
import '../models.dart';
import '../state.dart';
import '../theme.dart';

/// « Plus » : espace équipe (ERP, tous les rôles dont livreur), contact, langue, conditions.
class MoreScreen extends ConsumerWidget {
  const MoreScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(langProvider);
    final b = ref.watch(catalogProvider).value?.brand ?? const Brand();
    Future<void> open(String u) => launchUrl(Uri.parse(u), mode: LaunchMode.externalApplication);
    String tel(String p) => 'tel:${p.replaceAll(RegExp(r'[^\d+]'), '')}';
    return Scaffold(
      appBar: AppBar(title: Text(tr(lang, 'Plus'), style: const TextStyle(fontWeight: FontWeight.w800))),
      body: ListView(padding: const EdgeInsets.all(14), children: [
        Card(
          color: kInk,
          child: ListTile(
            contentPadding: const EdgeInsets.fromLTRB(16, 10, 12, 10),
            leading: const CircleAvatar(backgroundColor: kOrange, foregroundColor: kInk, child: Icon(Icons.badge_outlined)),
            title: Text(tr(lang, 'Espace équipe'), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800)),
            subtitle: Text(tr(lang, 'Connexion à l\'administration, confirmation, livraison, livreurs…'), style: const TextStyle(color: Color(0xFFAEB8C3), fontSize: 12.5)),
            trailing: const Icon(Icons.chevron_right, color: Colors.white),
            onTap: () => context.push('/erp'),
          ),
        ),
        const SizedBox(height: 14),
        _Section(title: tr(lang, 'Contact'), children: [
          if (b.phone1.isNotEmpty) _tile(Icons.phone_outlined, tr(lang, 'Appeler'), b.phone1, () => open(tel(b.phone1))),
          if (b.phone2.isNotEmpty) _tile(Icons.phone_outlined, tr(lang, 'Appeler'), b.phone2, () => open(tel(b.phone2))),
          if (b.whatsapp.isNotEmpty) _tile(Icons.chat_outlined, tr(lang, 'WhatsApp'), b.whatsapp, () => open('https://wa.me/${b.whatsapp.replaceAll(RegExp(r'\D'), '')}')),
          if (b.email.isNotEmpty) _tile(Icons.mail_outline, tr(lang, 'E-mail'), b.email, () => open('mailto:${b.email}')),
          if (b.address.isNotEmpty) _tile(Icons.place_outlined, b.address, '', () => open('https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent(b.address)}')),
        ]),
        const SizedBox(height: 14),
        _Section(title: tr(lang, 'Langue'), children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: SegmentedButton<String>(
              segments: const [ButtonSegment(value: 'fr', label: Text('Français')), ButtonSegment(value: 'ar', label: Text('العربية'))],
              selected: {lang},
              onSelectionChanged: (s) => ref.read(langProvider.notifier).set(s.first),
            ),
          ),
        ]),
        const SizedBox(height: 14),
        _Section(title: '', children: [
          _tile(Icons.description_outlined, tr(lang, 'Conditions générales de vente'), '', () => context.push('/cgv')),
          _tile(Icons.public, tr(lang, 'Ouvrir le site'), kBaseUrl, () => open(kBaseUrl)),
        ]),
        const SizedBox(height: 18),
        Center(child: Text('${b.name} · ${tr(lang, 'Version')} 1.0.0', style: const TextStyle(color: kMuted, fontSize: 12))),
      ]),
    );
  }

  Widget _tile(IconData i, String t, String s, VoidCallback onTap) => ListTile(
        leading: Icon(i, color: kOrange), title: Text(t, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: s.isEmpty ? null : Text(s, textDirection: TextDirection.ltr), trailing: const Icon(Icons.chevron_right, color: kMuted), onTap: onTap,
      );
}

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.children});
  final String title;
  final List<Widget> children;
  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        if (title.isNotEmpty) Padding(padding: const EdgeInsets.fromLTRB(4, 0, 4, 8), child: Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15))),
        Card(child: Column(children: children)),
      ]);
}
