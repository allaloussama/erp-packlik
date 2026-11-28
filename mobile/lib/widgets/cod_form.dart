import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../api.dart';
import '../config.dart';
import '../i18n.dart';
import '../models.dart';
import '../state.dart';
import '../theme.dart';
import 'common.dart';

const _defaultFields = [
  OrderField(key: 'name', label: 'Nom complet', placeholder: 'Nom et prénom', required: true),
  OrderField(key: 'phone', label: 'Téléphone', placeholder: '05 XX XX XX XX', type: 'tel', required: true),
  OrderField(key: 'wilaya', label: 'Wilaya', required: true),
  OrderField(key: 'commune', label: 'Commune', required: true),
  OrderField(key: 'delivery', label: 'Mode de livraison', required: true),
  OrderField(key: 'address', label: 'Adresse (facultatif)', placeholder: 'Quartier, rue, repère…'),
];

/// Formulaire « Commandez maintenant, payez à la livraison » : le même que sur le site (champs réglés
/// dans ERP › Boutique › Formulaire). Les produits du panier y figurent et se retirent d'une croix.
class CodForm extends ConsumerStatefulWidget {
  const CodForm({super.key, required this.catalog, this.main});
  final Catalog catalog;

  /// Produit de la fiche ouverte (hors panier), en tête du formulaire.
  final CartLine? main;

  @override
  ConsumerState<CodForm> createState() => _CodFormState();
}

class _CodFormState extends ConsumerState<CodForm> {
  final _form = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _phone = TextEditingController();
  final _address = TextEditingController();
  final _custom = <String, String>{};
  late int _wilaya;
  String? _commune;
  String _delivery = 'home';
  bool _sending = false;

  @override
  void initState() {
    super.initState();
    final ws = widget.catalog.wilayas;
    _wilaya = ws.any((w) => w.id == 16) ? 16 : (ws.isEmpty ? 16 : ws.first.id);
  }

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    _address.dispose();
    super.dispose();
  }

  List<OrderField> get _fields {
    final saved = widget.catalog.fields;
    if (saved.isEmpty) return _defaultFields;
    final out = [for (final f in saved) if (f.show || !f.isCustom && f.key != 'address') f];
    for (final d in _defaultFields) {
      if (!out.any((f) => f.key == d.key) && d.key != 'address') out.add(d);
    }
    return out;
  }

  List<CartLine> _items(List<CartLine> cart) => [
        if (widget.main != null) widget.main!,
        ...cart.where((l) => widget.main == null || !l.same(widget.main!)),
      ];

  Future<void> _submit(List<CartLine> items, int total, String lang) async {
    if (!_form.currentState!.validate()) return;
    final custom = _fields.where((f) => f.isCustom && (_custom[f.key] ?? '').isNotEmpty);
    setState(() => _sending = true);
    try {
      final r = await ref.read(apiProvider).order(
            name: _name.text.trim(), phone: _phone.text.replaceAll(RegExp(r'\D'), ''), wilaya: _wilaya, commune: _delivery == 'desk' ? '' : _commune ?? '',
            address: _address.text.trim(), delivery: _delivery, note: custom.map((f) => '${f.label} : ${_custom[f.key] == 'true' ? 'Oui' : _custom[f.key]}').join(' · '),
            items: items);
      ref.read(cartProvider.notifier).clear();
      if (mounted) context.go('/confirmation?ref=${Uri.encodeComponent(r.ref)}&total=${r.subtotal + (total - linesTotal(widget.catalog, items))}');
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e is ApiException ? e.message : tr(lang, 'Connexion impossible. Vérifiez internet puis réessayez.')), backgroundColor: kRed));
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(langProvider);
    final cart = ref.watch(cartProvider);
    final c = widget.catalog;
    final items = _items(cart);
    final w = c.wilayas.where((x) => x.id == _wilaya).firstOrNull;
    final free = freeShipping(c, items);
    final fee = free || w == null || items.isEmpty ? 0 : (_delivery == 'desk' ? w.desk : w.home);
    final sub = linesTotal(c, items);
    final title = c.formTitle.isEmpty ? 'Commandez maintenant, payez à la livraison' : c.formTitle;
    final button = c.formButton.isEmpty ? 'Commander maintenant' : c.formButton;

    Widget field(OrderField f) {
      final label = '${tr(lang, f.label)}${f.required && f.isCustom ? ' *' : ''}';
      switch (f.key) {
        case 'name':
          return TextFormField(controller: _name, textCapitalization: TextCapitalization.words, autofillHints: const [AutofillHints.name],
              decoration: InputDecoration(labelText: label, hintText: tr(lang, f.placeholder), prefixIcon: const Icon(Icons.person_outline)),
              validator: (v) => (v ?? '').trim().length < 3 ? tr(lang, 'Veuillez saisir votre nom') : null);
        case 'phone':
          return TextFormField(controller: _phone, keyboardType: TextInputType.phone, autofillHints: const [AutofillHints.telephoneNumber], textDirection: TextDirection.ltr,
              decoration: InputDecoration(labelText: label, hintText: f.placeholder, prefixIcon: const Icon(Icons.phone_outlined)),
              validator: (v) => RegExp(r'^0[567]\d{8}$').hasMatch((v ?? '').replaceAll(RegExp(r'\D'), '')) ? null : tr(lang, 'Numéro invalide : 05, 06 ou 07 suivi de 8 chiffres'));
        case 'wilaya':
          return DropdownButtonFormField<int>(
            initialValue: _wilaya, isExpanded: true, decoration: InputDecoration(labelText: label),
            items: [for (final x in c.wilayas) DropdownMenuItem(value: x.id, child: Text('${x.code} - ${x.name(lang)}', overflow: TextOverflow.ellipsis))],
            onChanged: (v) => setState(() {
              _wilaya = v ?? _wilaya;
              _commune = null;
              if ((c.wilayas.where((x) => x.id == _wilaya).firstOrNull?.desk ?? 1) <= 0) _delivery = 'home'; // pas de bureau dans cette wilaya
            }),
          );
        case 'commune':
          final list = ref.watch(communesProvider).value?[_wilaya] ?? const [];
          if (list.isEmpty) {
            return TextFormField(decoration: InputDecoration(labelText: label), onChanged: (v) => _commune = v.trim(), validator: (v) => (v ?? '').trim().isEmpty ? tr(lang, 'Veuillez indiquer la commune') : null);
          }
          return DropdownButtonFormField<String>(
            key: ValueKey('commune$_wilaya'), initialValue: _commune, isExpanded: true, decoration: InputDecoration(labelText: label),
            items: [for (final (fr, ar) in list) DropdownMenuItem(value: fr, child: Text(lang == 'ar' && ar.isNotEmpty ? ar : fr, overflow: TextOverflow.ellipsis))],
            onChanged: (v) => setState(() => _commune = v),
            validator: (v) => v == null ? tr(lang, 'Veuillez indiquer la commune') : null,
          );
        case 'delivery':
          Widget opt(String v, String l, String s, int price) => RadioListTile<String>(
                value: v, contentPadding: const EdgeInsets.symmetric(horizontal: 4),
                title: Text(tr(lang, l), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)), subtitle: Text(tr(lang, s), style: const TextStyle(fontSize: 12)),
                secondary: Text(free ? tr(lang, 'Gratuite') : dzd(price, lang: lang), style: const TextStyle(fontWeight: FontWeight.w800)),
              );
          return InputDecorator(
            decoration: InputDecoration(labelText: label, contentPadding: const EdgeInsets.fromLTRB(8, 12, 8, 4)),
            child: RadioGroup<String>(groupValue: _delivery, onChanged: (v) => setState(() => _delivery = v ?? 'home'), child: Column(children: [
              opt('home', 'À domicile', 'Livré jusqu\'à votre porte', w?.home ?? 0),
              if (w == null || w.desk > 0) opt('desk', 'Bureau de livraison (stop desk)', 'Retrait au bureau le plus proche', w?.desk ?? 0), // prix bureau 0 = pas de bureau
            ])),
          );
        case 'address':
          return TextFormField(controller: _address, decoration: InputDecoration(labelText: label, hintText: tr(lang, f.placeholder), prefixIcon: const Icon(Icons.place_outlined)),
              validator: (v) => f.required && (v ?? '').trim().isEmpty ? tr(lang, 'Champ obligatoire') : null);
      }
      // champs ajoutés dans l'ERP : joints à la note de la commande
      String? req(String? v) => f.required && (v ?? '').trim().isEmpty ? tr(lang, 'Champ obligatoire') : null;
      if (f.type == 'select') {
        return DropdownButtonFormField<String>(isExpanded: true, decoration: InputDecoration(labelText: label),
            items: [for (final o in f.options) DropdownMenuItem(value: o, child: Text(o))], onChanged: (v) => _custom[f.key] = v ?? '', validator: req);
      }
      if (f.type == 'checkbox') {
        return FormField<bool>(
          initialValue: false,
          validator: (v) => f.required && v != true ? tr(lang, 'Champ obligatoire') : null,
          builder: (s) => CheckboxListTile(value: s.value, title: Text(label), subtitle: s.hasError ? Text(s.errorText!, style: const TextStyle(color: kRed)) : null, contentPadding: EdgeInsets.zero, controlAffinity: ListTileControlAffinity.leading,
              onChanged: (v) { s.didChange(v); _custom[f.key] = '${v ?? false}'; }),
        );
      }
      return TextFormField(
        maxLines: f.type == 'textarea' ? 3 : 1,
        keyboardType: f.type == 'number' ? TextInputType.number : f.type == 'email' ? TextInputType.emailAddress : TextInputType.text,
        decoration: InputDecoration(labelText: label, hintText: f.placeholder),
        onChanged: (v) => _custom[f.key] = v.trim(), validator: req,
      );
    }

    return Form(
      key: _form,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Row(children: [
              const CircleAvatar(backgroundColor: kOrange, foregroundColor: kInk, child: Icon(Icons.payments_outlined)),
              const SizedBox(width: 10),
              Expanded(child: Text(tr(lang, title), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16))),
            ]),
            const SizedBox(height: 14),
            for (final f in _fields)
              // stop desk : retrait au bureau, la commune n'est pas demandée (comme sur le site)
              if (!(f.key == 'commune' && _delivery == 'desk')) Padding(padding: const EdgeInsets.only(bottom: 12), child: field(f)),
            _Summary(catalog: c, items: items, mainLine: widget.main, fee: fee, free: free, wilaya: w?.name(lang) ?? '', lang: lang),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: _sending || items.isEmpty ? null : () => _submit(items, sub + fee, lang),
              child: _sending ? Text(tr(lang, 'Envoi en cours…')) : Text(tr(lang, button)),
            ),
            const SizedBox(height: 10),
            Wrap(alignment: WrapAlignment.center, spacing: 14, runSpacing: 6, children: [
              for (final (i, l) in [(Icons.payments_outlined, 'Paiement à la livraison'), (Icons.local_shipping_outlined, 'Livraison 69 wilayas')])
                Row(mainAxisSize: MainAxisSize.min, children: [Icon(i, size: 16, color: kMuted), const SizedBox(width: 4), Flexible(child: Text(tr(lang, l), style: const TextStyle(fontSize: 12, color: kMuted)))]), // Flexible : passe à la ligne au lieu de déborder (petit écran, grande police)
            ]),
          ]),
        ),
      ),
    );
  }
}

/// Récapitulatif : chaque produit avec sa quantité (+ / −) et une croix pour le retirer.
class _Summary extends ConsumerWidget {
  const _Summary({required this.catalog, required this.items, required this.mainLine, required this.fee, required this.free, required this.wilaya, required this.lang});
  final Catalog catalog;
  final List<CartLine> items;
  final CartLine? mainLine;
  final int fee;
  final bool free;
  final String wilaya;
  final String lang;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cart = ref.read(cartProvider.notifier);
    final sub = linesTotal(catalog, items);
    return DecoratedBox(
      decoration: BoxDecoration(color: const Color(0xFFFAFAF8), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFE6E4DE))),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Text(tr(lang, 'Vos produits'), style: const TextStyle(fontWeight: FontWeight.w800)),
          const SizedBox(height: 6),
          if (items.isEmpty) Text(tr(lang, 'Aucun produit'), style: const TextStyle(color: kMuted)),
          for (final l in items)
            Builder(builder: (context) {
              final p = catalog.byId(l.pid);
              if (p == null) return const SizedBox.shrink();
              final isMain = mainLine != null && l.same(mainLine!);
              final v = l.v == null ? '' : p.variants.where((x) => x.id == l.v).map((x) => ' (${x.label})').firstOrNull ?? '';
              final unit = p.unitPrice(l.v, l.q);
              return Padding(
                key: ValueKey('${l.pid}-${l.v}'),
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Row(children: [
                  ClipRRect(borderRadius: BorderRadius.circular(8), child: SizedBox(width: 44, height: 44, child: NetImg(p.images.isEmpty ? '' : p.images.first, fit: BoxFit.cover))),
                  const SizedBox(width: 10),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('${p.title(lang)}$v', maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    const SizedBox(height: 4),
                    if (isMain) Text('${l.q} × ${dzd(unit, lang: lang)}', style: const TextStyle(color: kMuted, fontSize: 12))
                    else QtyStepper(value: l.q, min: p.minQty, onChanged: (q) => cart.setQty(l, q, min: p.minQty)),
                  ])),
                  Text(dzd(unit * l.q, lang: lang), style: const TextStyle(fontWeight: FontWeight.w800)),
                  if (!isMain) IconButton(tooltip: tr(lang, 'Retirer'), onPressed: () => cart.remove(l), icon: const Icon(Icons.close, size: 20, color: kMuted)) else const SizedBox(width: 12),
                ]),
              );
            }),
          const Divider(height: 18),
          _row(tr(lang, 'Sous-total'), dzd(sub, lang: lang)),
          _row('${tr(lang, 'Livraison')} · $wilaya (${tr(lang, 'estimée')})', free ? tr(lang, 'Gratuite') : dzd(fee, lang: lang)),
          const SizedBox(height: 6),
          _row(tr(lang, 'Total à payer à la livraison'), dzd(sub + fee, lang: lang), bold: true),
        ]),
      ),
    );
  }

  Widget _row(String a, String b, {bool bold = false}) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 2),
        child: Row(children: [
          Expanded(child: Text(a, style: TextStyle(fontWeight: bold ? FontWeight.w800 : FontWeight.w400, fontSize: bold ? 15 : 13))),
          Text(b, style: TextStyle(fontWeight: bold ? FontWeight.w800 : FontWeight.w600, fontSize: bold ? 16 : 13)),
        ]),
      );
}
