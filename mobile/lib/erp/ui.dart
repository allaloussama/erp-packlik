import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../theme.dart';
import 'rules.dart';

/// Petits éléments d'interface partagés par les écrans de l'ERP.

Future<void> openUrl(String u) => launchUrl(Uri.parse(u), mode: LaunchMode.externalApplication);
Future<void> callPhone(String p) => openUrl('tel:${digits(p)}');

void toast(BuildContext context, String msg, {bool bad = false}) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text(msg), backgroundColor: bad ? kRed : kInk, behavior: SnackBarBehavior.floating));
}

class Pill extends StatelessWidget {
  const Pill(this.label, this.color, {super.key, this.selected = false, this.onTap});
  final String label;
  final Color color;
  final bool selected;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final child = Container(
      constraints: const BoxConstraints(maxWidth: 170), // jamais plus large que ça : le libellé se coupe (…)
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: selected ? color.withValues(alpha: .16) : Colors.white,
        border: Border.all(color: selected ? color : kLine, width: selected ? 1.6 : 1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 6),
        Flexible(child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 12.5, fontWeight: selected ? FontWeight.w800 : FontWeight.w600, color: kInk))),
      ]),
    );
    return onTap == null ? child : InkWell(borderRadius: BorderRadius.circular(20), onTap: onTap, child: child);
  }
}

class Kpi extends StatelessWidget {
  const Kpi(this.label, this.value, {super.key, this.sub = '', this.accent = false, this.onTap});
  final String label, value, sub;
  final bool accent;
  final VoidCallback? onTap;
  @override
  Widget build(BuildContext context) => Card(
        color: accent ? kInk : Colors.white,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
              Text(label, maxLines: 2, style: TextStyle(fontSize: 12.5, color: accent ? const Color(0xFFAEB8C3) : kMuted, fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              FittedBox(fit: BoxFit.scaleDown, alignment: AlignmentDirectional.centerStart, child: Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: accent ? Colors.white : kInk))),
              if (sub.isNotEmpty) ...[const SizedBox(height: 2), Text(sub, style: TextStyle(fontSize: 11.5, color: accent ? const Color(0xFFAEB8C3) : kMuted))],
            ]),
          ),
        ),
      );
}

/// Grille de chiffres clés : 2 colonnes sur téléphone, plus sur tablette.
class KpiGrid extends StatelessWidget {
  const KpiGrid(this.children, {super.key});
  final List<Widget> children;
  @override
  Widget build(BuildContext context) => LayoutBuilder(builder: (c, box) {
        final cols = box.maxWidth > 900 ? 4 : box.maxWidth > 560 ? 3 : 2;
        const gap = 10.0;
        final w = (box.maxWidth - gap * (cols - 1)) / cols;
        return Wrap(spacing: gap, runSpacing: gap, children: [for (final k in children) SizedBox(width: w, child: k)]);
      });
}

class Section extends StatelessWidget {
  const Section({super.key, required this.title, required this.children, this.trailing});
  final String title;
  final List<Widget> children;
  final Widget? trailing;
  @override
  Widget build(BuildContext context) => Card(
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          if (title.isNotEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 12, 10, 4),
              child: Row(children: [Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15))), ?trailing]),
            ),
          ...children,
          const SizedBox(height: 6),
        ]),
      );
}

class Empty extends StatelessWidget {
  const Empty(this.text, {super.key, this.icon = Icons.check_circle_outline});
  final String text;
  final IconData icon;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 20),
        child: Column(children: [Icon(icon, size: 40, color: kMuted), const SizedBox(height: 10), Text(text, textAlign: TextAlign.center, style: const TextStyle(color: kMuted))]),
      );
}

class Row2 extends StatelessWidget {
  const Row2(this.k, this.v, {super.key, this.bold = false, this.ltr = false});
  final String k, v;
  final bool bold, ltr;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(flex: 2, child: Text(k, style: const TextStyle(color: kMuted, fontSize: 13))),
          Expanded(flex: 3, child: Text(v.isEmpty ? '—' : v, textAlign: TextAlign.end, textDirection: ltr ? TextDirection.ltr : null, style: TextStyle(fontWeight: bold ? FontWeight.w800 : FontWeight.w600, fontSize: 13.5))),
        ]),
      );
}

Future<bool> confirmDialog(BuildContext context, String title, String body, {String ok = 'Confirmer', bool danger = false}) async {
  final r = await showDialog<bool>(
    context: context,
    builder: (c) => AlertDialog(
      title: Text(title),
      content: Text(body),
      actions: [
        TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Annuler')),
        FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44), backgroundColor: danger ? kRed : kOrange, foregroundColor: danger ? Colors.white : kInk), onPressed: () => Navigator.pop(c, true), child: Text(ok)),
      ],
    ),
  );
  return r ?? false;
}

Future<String?> textDialog(BuildContext context, String title, {String initial = '', String hint = '', int lines = 1, String ok = 'Enregistrer'}) async {
  final t = TextEditingController(text: initial);
  final r = await showDialog<String>(
    context: context,
    builder: (c) => AlertDialog(
      title: Text(title),
      content: TextField(controller: t, autofocus: true, minLines: lines, maxLines: lines < 2 ? 1 : 6, decoration: InputDecoration(hintText: hint)),
      actions: [
        TextButton(onPressed: () => Navigator.pop(c), child: const Text('Annuler')),
        FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, t.text.trim()), child: Text(ok)),
      ],
    ),
  );
  t.dispose();
  return r;
}

/// Liste de recherche simple (titre + champ) utilisée par plusieurs écrans.
class SearchField extends StatelessWidget {
  const SearchField({super.key, required this.hint, required this.onChanged, this.initial = ''});
  final String hint, initial;
  final ValueChanged<String> onChanged;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(12, 10, 12, 6),
        child: TextFormField(
          initialValue: initial,
          onChanged: onChanged,
          decoration: InputDecoration(hintText: hint, prefixIcon: const Icon(Icons.search), isDense: true),
        ),
      );
}
