import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../config.dart';
import '../i18n.dart';
import '../models.dart';
import '../state.dart';
import '../theme.dart';

/// Fond gris clair des photos (thème moderne du site, assets/theme.css : --well).
const kWell = Color(0xFFF4F3F0);

/// Photo du site (ou pictogramme si le produit n'en a pas).
/// [blend] : le fond blanc de la photo se fond dans le gris (comme `mix-blend-mode:multiply` sur le site).
class NetImg extends StatelessWidget {
  const NetImg(this.url, {super.key, this.fit = BoxFit.contain, this.blend = false});
  final String url;
  final BoxFit fit;
  final bool blend;

  @override
  Widget build(BuildContext context) {
    if (url.isEmpty) return const ColoredBox(color: kWell, child: Center(child: Icon(Icons.inventory_2_outlined, color: kMuted, size: 36)));
    return Image.network(url, fit: fit, color: blend ? kWell : null, colorBlendMode: blend ? BlendMode.multiply : null,
        errorBuilder: (_, _, _) => const ColoredBox(color: Color(0xFFF4F5F6), child: Center(child: Icon(Icons.image_not_supported_outlined, color: kMuted))),
        loadingBuilder: (c, child, p) => p == null ? child : const ColoredBox(color: Color(0xFFF4F5F6)));
  }
}

/// Carte produit : « Ajouter au panier » en haut, « Acheter maintenant » (vers la fiche) en bas — comme sur le site.
class ProductCard extends ConsumerWidget {
  const ProductCard({super.key, required this.p, this.onAdded});
  final Product p;
  final VoidCallback? onAdded;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(langProvider);
    final out = !p.isQuote && !p.canOrder;
    final simple = p.variants.isEmpty && !p.isQuote;
    const pill = StadiumBorder();
    const label = TextStyle(fontSize: 12, fontWeight: FontWeight.w600);
    // design du site (assets/theme.css) : pas de cadre, photo sur fond gris arrondi, prix en noir,
    // « Ajouter au panier » blanc à bordure, « Acheter maintenant » orange — deux boutons pleine largeur
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: () => context.push('/produit/${p.id}'),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        AspectRatio(aspectRatio: 1, child: ClipRRect(borderRadius: BorderRadius.circular(16), child: Stack(fit: StackFit.expand, children: [
          ColoredBox(color: kWell, child: Padding(padding: const EdgeInsets.all(14), child: NetImg(p.images.isEmpty ? '' : p.images.first, blend: true))),
          if (out || p.isNew || p.badge.isNotEmpty)
            PositionedDirectional(top: 8, start: 8, child: _Tag(out ? tr(lang, 'Rupture') : p.badge.isNotEmpty ? p.badge : tr(lang, 'Nouveau'), out ? kRed : kInk)),
        ]))),
        const SizedBox(height: 8),
        Text(p.title(lang), maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13, height: 1.3)),
        const SizedBox(height: 4),
        PriceText(p: p, lang: lang, size: 15),
        const Spacer(),
        SizedBox(
          height: 36,
          child: OutlinedButton.icon(
            style: OutlinedButton.styleFrom(minimumSize: Size.zero, padding: const EdgeInsets.symmetric(horizontal: 6), shape: pill, backgroundColor: Colors.white, foregroundColor: kInk, side: const BorderSide(color: kLine), textStyle: label),
            onPressed: out ? null : () {
              if (!simple) {
                context.push('/produit/${p.id}');
                return;
              }
              ref.read(cartProvider.notifier).add(CartLine(pid: p.id, q: p.minQty));
              onAdded?.call();
              showAddedSnack(context, lang);
            },
            icon: const Icon(Icons.shopping_cart_outlined, size: 15),
            label: FittedBox(fit: BoxFit.scaleDown, child: Text(simple ? tr(lang, 'Ajouter au panier') : p.isQuote ? tr(lang, 'Demander un devis') : tr(lang, 'Choisir une option'), maxLines: 1)),
          ),
        ),
        const SizedBox(height: 6),
        SizedBox(
          height: 36,
          child: FilledButton.icon(
            style: FilledButton.styleFrom(backgroundColor: kOrange, foregroundColor: Colors.white, minimumSize: Size.zero, padding: const EdgeInsets.symmetric(horizontal: 6), shape: pill, textStyle: label),
            onPressed: () => context.push('/produit/${p.id}'),
            icon: const Icon(Icons.bolt, size: 15),
            label: FittedBox(fit: BoxFit.scaleDown, child: Text(tr(lang, 'Acheter maintenant'), maxLines: 1)),
          ),
        ),
      ]),
    );
  }
}

void showAddedSnack(BuildContext context, String lang) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(
      content: Text(tr(lang, 'Ajouté au panier')),
      behavior: SnackBarBehavior.floating,
      action: SnackBarAction(label: tr(lang, 'Voir le panier'), textColor: kOrange, onPressed: () => context.go('/panier')),
    ));
}

class _Tag extends StatelessWidget {
  const _Tag(this.text, this.color);
  final String text;
  final Color color;
  @override
  Widget build(BuildContext context) => DecoratedBox(
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(6), boxShadow: const [BoxShadow(color: Color(0x14111418), blurRadius: 2, offset: Offset(0, 1))]),
        child: Padding(padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3), child: Text(text, style: TextStyle(color: color, fontSize: 10.5, fontWeight: FontWeight.w600))),
      );
}

class PriceText extends StatelessWidget {
  const PriceText({super.key, required this.p, required this.lang, this.size = 16, this.unit});
  final Product p;
  final String lang;
  final double size;
  final int? unit;

  @override
  Widget build(BuildContext context) {
    if (p.isQuote) return Text(tr(lang, 'Prix sur devis'), style: TextStyle(fontWeight: FontWeight.w800, fontSize: size, color: kOrange));
    final price = unit ?? (p.variants.isEmpty ? p.price : p.variants.map((v) => v.price).reduce((a, b) => a < b ? a : b));
    return Wrap(crossAxisAlignment: WrapCrossAlignment.end, spacing: 6, children: [
      Text('${p.variants.isNotEmpty && unit == null ? '${tr(lang, 'À partir de')} ' : ''}${dzd(price, lang: lang)}', style: TextStyle(fontWeight: FontWeight.w800, fontSize: size, color: kInk)), // prix en noir, comme le site
      if (p.oldPrice > price) Text(dzd(p.oldPrice, lang: lang), style: TextStyle(fontSize: size - 3, color: kMuted, decoration: TextDecoration.lineThrough)),
    ]);
  }
}

class QtyStepper extends StatelessWidget {
  const QtyStepper({super.key, required this.value, required this.onChanged, this.min = 1});
  final int value;
  final int min;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) => DecoratedBox(
        decoration: BoxDecoration(border: Border.all(color: kLine), borderRadius: BorderRadius.circular(9), color: Colors.white),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          IconButton(visualDensity: VisualDensity.compact, onPressed: value > min ? () => onChanged(value - 1) : null, icon: const Icon(Icons.remove, size: 18), tooltip: '−'),
          SizedBox(width: 34, child: Text('$value', textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.w700))),
          IconButton(visualDensity: VisualDensity.compact, onPressed: () => onChanged(value + 1), icon: const Icon(Icons.add, size: 18), tooltip: '+'),
        ]),
      );
}

/// Chargement / erreur du catalogue avec « Réessayer ».
class CatalogGate extends ConsumerWidget {
  const CatalogGate({super.key, required this.builder});
  final Widget Function(Catalog c, String lang) builder;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(langProvider);
    return ref.watch(catalogProvider).when(
          data: (c) => builder(c, lang),
          loading: () => const Center(child: CircularProgressIndicator(color: kOrange)),
          error: (e, _) => Center(child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.wifi_off_rounded, size: 42, color: kMuted),
              const SizedBox(height: 10),
              Text(tr(lang, '$e'), textAlign: TextAlign.center),
              const SizedBox(height: 14),
              OutlinedButton(onPressed: () => ref.invalidate(catalogProvider), child: Text(tr(lang, 'Réessayer'))),
            ]),
          )),
        );
  }
}

/// Photo du produit en plein écran (comme le site) : glisser pour changer de photo, pincer pour zoomer, compteur, fermer.
void openPhotoViewer(BuildContext context, List<String> images, int start, String title) {
  Navigator.of(context).push(PageRouteBuilder(
    opaque: false,
    barrierColor: const Color(0xF00A0C0E),
    pageBuilder: (_, _, _) => _PhotoViewer(images: images, start: start, title: title),
    transitionsBuilder: (_, a, _, child) => FadeTransition(opacity: a, child: child),
  ));
}

class _PhotoViewer extends StatefulWidget {
  const _PhotoViewer({required this.images, required this.start, required this.title});
  final List<String> images;
  final int start;
  final String title;
  @override
  State<_PhotoViewer> createState() => _PhotoViewerState();
}

class _PhotoViewerState extends State<_PhotoViewer> {
  late final _ctrl = PageController(initialPage: widget.start);
  late int _i = widget.start;

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final n = widget.images.length;
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: Stack(children: [
          PageView.builder(
            controller: _ctrl,
            itemCount: n,
            onPageChanged: (i) => setState(() => _i = i),
            itemBuilder: (_, i) => InteractiveViewer(
              maxScale: 4,
              child: Center(child: Semantics(label: widget.title, image: true, child: ColoredBox(color: Colors.white, child: NetImg(widget.images[i])))),
            ),
          ),
          PositionedDirectional(
            top: 8, end: 8,
            child: IconButton.filledTonal(
              tooltip: MaterialLocalizations.of(context).closeButtonTooltip,
              style: IconButton.styleFrom(backgroundColor: Colors.white24, foregroundColor: Colors.white),
              onPressed: () => Navigator.of(context).pop(),
              icon: const Icon(Icons.close),
            ),
          ),
          if (n > 1)
            Positioned(
              bottom: 18, left: 0, right: 0,
              child: Center(child: DecoratedBox(
                decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(999)),
                child: Padding(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5), child: Text('${_i + 1} / $n', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13))),
              )),
            ),
        ]),
      ),
    );
  }
}
