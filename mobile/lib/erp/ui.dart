import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../theme.dart';
import 'rules.dart';

/// Petits éléments d'interface partagés par les écrans de l'ERP — reprise des classes de l'ERP du site
/// (assets/app.css : .badge, .kpi, .card, .card-h, .pg-h, .seg, .cashbox, .bars, .funnel, .alert).

Future<void> openUrl(String u) => launchUrl(Uri.parse(u), mode: LaunchMode.externalApplication);
Future<void> callPhone(String p) => openUrl('tel:${digits(p)}');

void toast(BuildContext context, String msg, {bool bad = false}) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text(msg), backgroundColor: bad ? kRed : kErpInk, behavior: SnackBarBehavior.floating));
}

/// Badge du site (.badge) : fond teinté, point et texte de la même couleur, plus foncée.
class Pill extends StatelessWidget {
  const Pill(this.label, this.color, {super.key, this.selected = false, this.onTap});
  final String label;
  final Color color;
  final bool selected;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final ink = Color.lerp(color, Colors.black, .38)!;
    final child = Container(
      constraints: const BoxConstraints(maxWidth: 170), // jamais plus large que ça : le libellé se coupe (…)
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: selected ? .2 : .12),
        border: Border.all(color: selected ? color : Colors.transparent, width: 1.4),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Container(width: 7, height: 7, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 6),
        Flexible(child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 12, fontWeight: selected ? FontWeight.w800 : FontWeight.w700, color: ink))),
      ]),
    );
    return onTap == null ? child : InkWell(borderRadius: BorderRadius.circular(999), onTap: onTap, child: child);
  }
}

/// Carte blanche du site (.card) : bordure fine et ombre douce.
BoxDecoration cardBox({Color color = Colors.white, Color border = kLine}) =>
    BoxDecoration(color: color, borderRadius: BorderRadius.circular(10), border: Border.all(color: border), boxShadow: kErpShadow);

const _tabular = [FontFeature.tabularFigures()];

/// Chiffre clé du site (.kpi) : libellé gris, grande valeur, ligne d'explication ; « accent » = carte encre.
class Kpi extends StatelessWidget {
  const Kpi(this.label, this.value, {super.key, this.sub = '', this.accent = false, this.onTap, this.subColor});
  final String label, value, sub;
  final bool accent;
  final VoidCallback? onTap;
  final Color? subColor;
  @override
  Widget build(BuildContext context) => Material(
        color: Colors.transparent,
        child: Ink(
          decoration: cardBox(color: accent ? kErpInk : Colors.white, border: accent ? kErpInk : kLine),
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(10),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(14, 12, 12, 12),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
                Row(children: [
                  Expanded(child: Text(label, maxLines: 2, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 12, height: 1.3, color: accent ? const Color(0xFFC6CED7) : kErpMuted, fontWeight: FontWeight.w600))),
                  if (onTap != null) Icon(Icons.chevron_right, size: 16, color: accent ? const Color(0xFF8996A5) : const Color(0xFFB4BEC9)),
                ]),
                const SizedBox(height: 4),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: AlignmentDirectional.centerStart,
                  child: Text(value, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, letterSpacing: -.3, color: accent ? Colors.white : kErpInk, fontFeatures: _tabular)),
                ),
                if (sub.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(sub, maxLines: 2, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 11.5, height: 1.3, color: subColor ?? (accent ? const Color(0xFFC6CED7) : kErpMuted))),
                ],
              ]),
            ),
          ),
        ),
      );
}

/// Grille de chiffres clés (.kpis) : 2 colonnes sur téléphone, plus sur tablette.
class KpiGrid extends StatelessWidget {
  const KpiGrid(this.children, {super.key, this.minWidth = 170});
  final List<Widget> children;
  final double minWidth;
  @override
  Widget build(BuildContext context) => LayoutBuilder(builder: (c, box) {
        final cols = (box.maxWidth / minWidth).floor().clamp(2, 5).toInt();
        const gap = 10.0;
        final w = (box.maxWidth - gap * (cols - 1)) / cols;
        return Wrap(spacing: gap, runSpacing: gap, children: [for (final k in children) SizedBox(width: w, child: k)]);
      });
}

/// Carte avec en-tête (.card + .card-h) : titre, action à droite, filet sous l'en-tête.
class Section extends StatelessWidget {
  const Section({super.key, required this.title, required this.children, this.trailing});
  final String title;
  final List<Widget> children;
  final Widget? trailing;
  @override
  Widget build(BuildContext context) => Container(
        decoration: cardBox(),
        clipBehavior: Clip.antiAlias,
        child: Material(
          color: Colors.transparent,
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            if (title.isNotEmpty)
              Container(
                constraints: const BoxConstraints(minHeight: 48),
                padding: const EdgeInsetsDirectional.fromSTEB(16, 8, 8, 8),
                decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: kLine2))),
                child: Row(children: [Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14.5, color: kErpInk))), ?trailing]),
              ),
            ...children,
            const SizedBox(height: 6),
          ]),
        ),
      );
}

/// En-tête de page (.pg-h) : phrase d'explication et action (période, bouton…).
class PageHead extends StatelessWidget {
  const PageHead(this.text, {super.key, this.trailing});
  final String text;
  final Widget? trailing;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(2, 0, 2, 12),
        child: Wrap(spacing: 10, runSpacing: 8, crossAxisAlignment: WrapCrossAlignment.center, alignment: WrapAlignment.spaceBetween, children: [
          Text(text, style: const TextStyle(color: kErpMuted, fontSize: 13)),
          ?trailing,
        ]),
      );
}

/// Contrôle segmenté du site (.seg) : fond gris, segment choisi en blanc.
class Seg<T> extends StatelessWidget {
  const Seg({super.key, required this.items, required this.value, required this.onChanged});
  final List<(T, String)> items;
  final T value;
  final ValueChanged<T> onChanged;
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(3),
        decoration: BoxDecoration(color: kLine2, borderRadius: BorderRadius.circular(9)),
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            for (final (v, label) in items)
              Semantics(
                button: true,
                selected: v == value,
                child: GestureDetector(
                  onTap: () => onChanged(v),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 150),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(color: v == value ? Colors.white : Colors.transparent, borderRadius: BorderRadius.circular(7), boxShadow: v == value ? kErpShadow : null),
                    child: Text(label, style: TextStyle(fontSize: 13, fontWeight: v == value ? FontWeight.w700 : FontWeight.w600, color: v == value ? kErpInk : kInk2)),
                  ),
                ),
              ),
          ]),
        ),
      );
}

/// Caisse du site (.cashbox) : point de couleur, libellé, montant.
class CashBox extends StatelessWidget {
  const CashBox(this.label, this.value, this.color, {super.key, this.sub = ''});
  final String label, value, sub;
  final Color color;
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.fromLTRB(14, 12, 12, 12),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: kLine)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
          Row(children: [
            Container(width: 9, height: 9, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
            const SizedBox(width: 6),
            Expanded(child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: kErpMuted))),
          ]),
          const SizedBox(height: 4),
          FittedBox(fit: BoxFit.scaleDown, alignment: AlignmentDirectional.centerStart, child: Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, fontFeatures: _tabular))),
          if (sub.isNotEmpty) Text(sub, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 11, color: kErpMuted)),
        ]),
      );
}

/// Barres horizontales du site (.bars) : libellé, valeur à droite, barre fine dessous.
class BarsList extends StatelessWidget {
  const BarsList(this.rows, {super.key, this.color = kOrange, this.moneyFmt = false});
  final List<({String label, num value, String extra})> rows;
  final Color color;
  final bool moneyFmt;
  @override
  Widget build(BuildContext context) {
    if (rows.isEmpty) return const Padding(padding: EdgeInsets.all(16), child: Text('Aucune donnée sur la période', style: TextStyle(color: kErpMuted, fontSize: 13)));
    final mx = rows.fold<num>(1, (a, r) => r.value > a ? r.value : a);
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 6),
      child: Column(children: [
        for (final r in rows)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Row(children: [
                Expanded(child: Text(r.label, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12.5, color: kInk2))),
                if (r.extra.isNotEmpty) Padding(padding: const EdgeInsetsDirectional.only(end: 8), child: Text(r.extra, style: const TextStyle(fontSize: 11.5, color: kErpMuted))),
                Text(moneyFmt ? money(r.value) : '${r.value.round()}', style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, fontFeatures: _tabular)),
              ]),
              const SizedBox(height: 4),
              LinearProgressIndicator(value: r.value / mx, minHeight: 7, color: color, backgroundColor: kLine2, borderRadius: BorderRadius.circular(4)),
            ]),
          ),
      ]),
    );
  }
}

/// Entonnoir du site (.funnel) : une barre par étape, pourcentage par rapport à l'étape précédente.
class Funnel extends StatelessWidget {
  const Funnel(this.steps, {super.key});
  final List<(String, int)> steps;
  static const _colors = [kKraftD, kOrange, kBlue, kErpGreen, Color(0xFF1F5C38)];
  @override
  Widget build(BuildContext context) {
    final top = steps.isEmpty || steps.first.$2 == 0 ? 1 : steps.first.$2;
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 6),
      child: Column(children: [
        for (var i = 0; i < steps.length; i++)
          Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Row(children: [
              SizedBox(width: 86, child: Text(steps[i].$1, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: kInk2))),
              Expanded(
                child: Container(
                  height: 28,
                  decoration: BoxDecoration(color: kLine2, borderRadius: BorderRadius.circular(6)),
                  alignment: AlignmentDirectional.centerStart,
                  child: FractionallySizedBox(
                    widthFactor: (steps[i].$2 / top).clamp(.08, 1.0).toDouble(),
                    child: Container(
                      alignment: AlignmentDirectional.centerStart,
                      padding: const EdgeInsetsDirectional.only(start: 10),
                      decoration: BoxDecoration(color: _colors[i % _colors.length], borderRadius: BorderRadius.circular(6)),
                      child: Text('${steps[i].$2}', maxLines: 1, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 12)),
                    ),
                  ),
                ),
              ),
              SizedBox(
                width: 48,
                child: Text(
                  i == 0 ? '100 %' : '${(steps[i - 1].$2 == 0 ? 0 : steps[i].$2 / steps[i - 1].$2 * 100).round()} %',
                  textAlign: TextAlign.end,
                  style: const TextStyle(fontSize: 12, color: kErpMuted, fontWeight: FontWeight.w600),
                ),
              ),
            ]),
          ),
      ]),
    );
  }
}

/// Ligne d'alerte du site (.alert) : icône dans un carré teinté, titre, détail.
class AlertRow extends StatelessWidget {
  const AlertRow(this.icon, this.color, this.title, this.sub, {super.key, this.onTap});
  final IconData icon;
  final Color color;
  final String title, sub;
  final VoidCallback? onTap;
  @override
  Widget build(BuildContext context) => InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.fromLTRB(16, 11, 12, 11),
          decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: kLine2))),
          child: Row(children: [
            Container(width: 32, height: 32, decoration: BoxDecoration(color: color.withValues(alpha: .13), borderRadius: BorderRadius.circular(8)), child: Icon(icon, size: 17, color: color)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
                if (sub.isNotEmpty) Text(sub, style: const TextStyle(fontSize: 12, color: kErpMuted)),
              ]),
            ),
            if (onTap != null) const Icon(Icons.chevron_right, size: 18, color: Color(0xFFB4BEC9)),
          ]),
        ),
      );
}

class Empty extends StatelessWidget {
  const Empty(this.text, {super.key, this.icon = Icons.check_circle_outline});
  final String text;
  final IconData icon;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Container(width: 56, height: 56, decoration: const BoxDecoration(color: kLine2, shape: BoxShape.circle), child: Icon(icon, size: 26, color: kErpMuted)),
          const SizedBox(height: 12),
          Text(text, textAlign: TextAlign.center, style: const TextStyle(color: kErpMuted, fontSize: 13.5)),
        ]),
      );
}

class Row2 extends StatelessWidget {
  const Row2(this.k, this.v, {super.key, this.bold = false, this.ltr = false});
  final String k, v;
  final bool bold, ltr;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(flex: 2, child: Text(k, style: const TextStyle(color: kErpMuted, fontSize: 13))),
          Expanded(
            flex: 3,
            child: Text(v.isEmpty ? '—' : v, textAlign: TextAlign.end, textDirection: ltr ? TextDirection.ltr : null, style: TextStyle(fontWeight: bold ? FontWeight.w800 : FontWeight.w600, fontSize: 13.5, fontFeatures: _tabular)),
          ),
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
        TextButton(style: TextButton.styleFrom(foregroundColor: kInk2), onPressed: () => Navigator.pop(c, false), child: const Text('Annuler')),
        FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44), backgroundColor: danger ? kRed : kErpInk, foregroundColor: Colors.white), onPressed: () => Navigator.pop(c, true), child: Text(ok)),
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
        TextButton(style: TextButton.styleFrom(foregroundColor: kInk2), onPressed: () => Navigator.pop(c), child: const Text('Annuler')),
        FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, t.text.trim()), child: Text(ok)),
      ],
    ),
  );
  t.dispose();
  return r;
}

/// Champ de recherche (.filters-bar .input.s) utilisé par plusieurs écrans.
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
          decoration: InputDecoration(hintText: hint, prefixIcon: const Icon(Icons.search, size: 20), isDense: true),
        ),
      );
}
