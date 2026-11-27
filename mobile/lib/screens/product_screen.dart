import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:url_launcher/url_launcher.dart';

import '../config.dart';
import '../i18n.dart';
import '../models.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/cod_form.dart';
import '../widgets/common.dart';
import 'home_screen.dart';

/// Fiche produit : photos, variantes, offres par quantité, formulaire de commande sur la page (comme le site).
class ProductScreen extends ConsumerStatefulWidget {
  const ProductScreen({super.key, required this.id});
  final int id;
  @override
  ConsumerState<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends ConsumerState<ProductScreen> {
  String? _v;
  int? _q;
  int _img = 0;
  final _gal = PageController();

  @override
  void dispose() {
    _gal.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: CatalogGate(builder: (c, lang) {
        final p = c.byId(widget.id);
        if (p == null) return Center(child: Text(tr(lang, 'Aucun produit')));
        final v = _v ?? (p.variants.isEmpty ? null : p.variants.first.id);
        final q = (_q ?? p.minQty).clamp(p.minQty, 99999);
        final unit = p.unitPrice(v, q);
        final tiers = p.variants.isEmpty && p.tiers.isNotEmpty ? [Tier(min: p.minQty, price: p.price), ...p.tiers] : <Tier>[];
        final related = c.products.where((x) => x.id != p.id && x.status == 'actif' && x.cats.any((k) => k != 'tout' && p.cats.contains(k))).take(6).toList();
        return ListView(padding: const EdgeInsets.only(bottom: 30), children: [
          // photos sur fond gris ; un appui ouvre la photo en plein écran (comme le site)
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 10, 14, 0),
            child: AspectRatio(
              aspectRatio: 1,
              child: ClipRRect(borderRadius: BorderRadius.circular(18), child: ColoredBox(color: kWell, child: p.images.isEmpty ? const NetImg('') : PageView.builder(
                controller: _gal,
                itemCount: p.images.length, onPageChanged: (i) => setState(() => _img = i),
                itemBuilder: (_, i) => GestureDetector(
                  onTap: () => openPhotoViewer(context, p.images, i, p.title(lang)),
                  child: Padding(padding: const EdgeInsets.all(18), child: NetImg(p.images[i], blend: true)),
                ),
              ))),
            ),
          ),
          if (p.images.length > 1)
            SizedBox(height: 66, child: ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.fromLTRB(14, 8, 14, 0), children: [
              for (var i = 0; i < p.images.length; i++)
                GestureDetector(
                  key: ValueKey(i),
                  onTap: () => _gal.animateToPage(i, duration: const Duration(milliseconds: 250), curve: Curves.easeOut),
                  child: Container(width: 58, margin: const EdgeInsetsDirectional.only(end: 6), decoration: BoxDecoration(color: kWell, borderRadius: BorderRadius.circular(10), border: Border.all(color: i == _img ? kInk : Colors.transparent, width: 2)), clipBehavior: Clip.antiAlias, child: NetImg(p.images[i], blend: true)),
                ),
            ])),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Wrap(spacing: 6, runSpacing: 6, children: [
                if (p.badge.isNotEmpty) Chip(label: Text(p.badge), backgroundColor: kRed, labelStyle: const TextStyle(color: Colors.white, fontSize: 11), visualDensity: VisualDensity.compact),
                for (final id in p.cats.where((k) => k != 'tout').take(3)) Chip(label: Text(c.categories.where((x) => x.id == id).map((x) => x.name(lang)).firstOrNull ?? id), visualDensity: VisualDensity.compact, labelStyle: const TextStyle(fontSize: 11)),
              ]),
              const SizedBox(height: 8),
              Text(p.title(lang), style: const TextStyle(fontSize: 21, fontWeight: FontWeight.w800, height: 1.2)),
              const SizedBox(height: 6),
              PriceText(p: p, lang: lang, size: 22, unit: p.isQuote ? null : unit),
              if (p.short.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 8), child: Text(p.short, style: const TextStyle(color: kMuted))),
              const SizedBox(height: 10),
              Wrap(spacing: 8, runSpacing: 6, children: [
                _info('${tr(lang, 'Conditionnement')} : ${p.pack} ${tr(lang, 'pièces')}'),
                if (p.sku.isNotEmpty) _info(p.sku),
                if (!p.isQuote) _info(p.status != 'rupture' ? tr(lang, 'En stock') : p.onDemand ? tr(lang, 'Sur commande') : tr(lang, 'Rupture'), color: p.status != 'rupture' ? kGreen : p.onDemand ? kOrange : kRed),
              ]),
              if (p.variants.isNotEmpty) ...[
                const SizedBox(height: 16),
                Text(tr(lang, 'Variante'), style: const TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 6),
                Wrap(spacing: 6, runSpacing: 6, children: [
                  for (final x in p.variants) ChoiceChip(key: ValueKey(x.id), label: Text('${x.label} · ${dzd(x.price, lang: lang)}'), selected: v == x.id, onSelected: (_) => setState(() => _v = x.id), selectedColor: const Color(0xFFFFE3CF)),
                ]),
              ],
              if (tiers.isNotEmpty) ...[
                const SizedBox(height: 16),
                Text(tr(lang, 'Offres par quantité'), style: const TextStyle(fontWeight: FontWeight.w700)),
                const SizedBox(height: 6),
                for (final t in tiers)
                  Card(
                    key: ValueKey(t.min),
                    margin: const EdgeInsets.only(bottom: 6),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10), side: BorderSide(color: q >= t.min && (tiers.where((x) => q >= x.min).lastOrNull == t) ? kOrange : kLine, width: 1.5)),
                    child: ListTile(
                      dense: true, onTap: () => setState(() => _q = t.min),
                      title: Text(t.min <= 1 ? '1 ${tr(lang, 'pièce')}' : '${tr(lang, 'À partir de')} ${t.min}', style: const TextStyle(fontWeight: FontWeight.w700)),
                      subtitle: t.badge.isEmpty ? null : Text(t.badge, style: const TextStyle(color: kOrange)),
                      trailing: Text('${dzd(t.price, lang: lang)} / ${tr(lang, 'pièce')}', style: const TextStyle(fontWeight: FontWeight.w800)),
                    ),
                  ),
              ],
              if (!p.isQuote) ...[
                const SizedBox(height: 14),
                Row(children: [
                  Text('${tr(lang, 'Quantité')}${p.minQty > 1 ? ' (${tr(lang, 'minimum')} ${p.minQty})' : ''}', style: const TextStyle(fontWeight: FontWeight.w700)),
                  const Spacer(),
                  QtyStepper(value: q, min: p.minQty, onChanged: (n) => setState(() => _q = n)),
                ]),
                if (p.freeShipQty > 0) Padding(padding: const EdgeInsets.only(top: 6), child: Text('${tr(lang, 'Livraison')} ${tr(lang, 'Gratuite').toLowerCase()} : ${tr(lang, 'À partir de').toLowerCase()} ${p.freeShipQty} ${tr(lang, 'pièces')}', style: TextStyle(color: q >= p.freeShipQty ? kGreen : kMuted, fontSize: 12.5))),
                const SizedBox(height: 16),
                if (p.canOrder) CodForm(key: ValueKey('form${p.id}'), catalog: c, main: CartLine(pid: p.id, v: v, q: q)) else FilledButton(onPressed: null, child: Text(tr(lang, 'Rupture'))),
                const SizedBox(height: 10),
                if (p.canOrder)
                  OutlinedButton.icon(
                    icon: const Icon(Icons.shopping_bag_outlined),
                    label: Text(tr(lang, 'Ajouter au panier')),
                    onPressed: () { ref.read(cartProvider.notifier).add(CartLine(pid: p.id, v: v, q: q)); showAddedSnack(context, lang); },
                  ),
              ] else ...[
                const SizedBox(height: 16),
                FilledButton.icon(
                  icon: const Icon(Icons.chat_outlined), label: Text(tr(lang, 'Demander un devis')),
                  onPressed: () => launchUrl(Uri.parse('https://wa.me/${c.brand.whatsapp.replaceAll(RegExp(r'\D'), '')}?text=${Uri.encodeComponent('Devis : ${p.name}')}'), mode: LaunchMode.externalApplication),
                ),
              ],
              if (p.desc.isNotEmpty) ...[
                const SizedBox(height: 22),
                Text(tr(lang, 'Description du produit'), style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                HtmlWidget(
                  RegExp(r'<(p|br|b|strong|h\d|ul|ol|li|img|div|span|a|em|i|u)\b', caseSensitive: false).hasMatch(p.desc) ? p.desc : p.desc.replaceAll('<', '&lt;').replaceAll('\n', '<br>'),
                  baseUrl: Uri.parse(kBaseUrl),
                  textStyle: const TextStyle(height: 1.55, fontSize: 14),
                  onTapUrl: (u) => launchUrl(Uri.parse(u), mode: LaunchMode.externalApplication),
                ),
              ],
            ]),
          ),
          if (related.isNotEmpty) ...[
            Padding(padding: const EdgeInsets.fromLTRB(16, 24, 16, 10), child: Text(tr(lang, 'Produits associés'), style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800))),
            ProductGrid(products: related),
          ],
        ]);
      }),
    );
  }

  Widget _info(String t, {Color color = kInk}) => DecoratedBox(
        decoration: BoxDecoration(border: Border.all(color: kLine), borderRadius: BorderRadius.circular(6), color: Colors.white),
        child: Padding(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), child: Text(t, style: TextStyle(fontSize: 12, color: color, fontWeight: FontWeight.w600))),
      );
}
