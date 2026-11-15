import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../config.dart';
import '../i18n.dart';
import '../models.dart';
import '../state.dart';
import '../theme.dart';

/// Photo du site (ou pictogramme si le produit n'en a pas).
class NetImg extends StatelessWidget {
  const NetImg(this.url, {super.key, this.fit = BoxFit.contain});
  final String url;
  final BoxFit fit;

  @override
  Widget build(BuildContext context) {
    if (url.isEmpty) return const ColoredBox(color: Color(0xFFFFF1E6), child: Center(child: Icon(Icons.inventory_2_outlined, color: kOrange, size: 36)));
    return Image.network(url, fit: fit,
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
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => context.push('/produit/${p.id}'),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          AspectRatio(aspectRatio: 1, child: Stack(fit: StackFit.expand, children: [
            ColoredBox(color: Colors.white, child: NetImg(p.images.isEmpty ? '' : p.images.first)),
            if (out || p.isNew || p.badge.isNotEmpty)
              PositionedDirectional(top: 8, start: 8, child: _Tag(out ? tr(lang, 'Rupture') : p.badge.isNotEmpty ? p.badge : tr(lang, 'Nouveau'), out ? kRed : kOrange)),
          ])),
          Padding(
            padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(p.title(lang), maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, height: 1.25)),
              const SizedBox(height: 4),
              PriceText(p: p, lang: lang, size: 14),
              const SizedBox(height: 8),
              SizedBox(
                height: 34,
                child: FilledButton(
                  style: FilledButton.styleFrom(minimumSize: Size.zero, padding: EdgeInsets.zero, textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
                  onPressed: out ? null : () {
                    if (!simple) {
                      context.push('/produit/${p.id}');
                      return;
                    }
                    ref.read(cartProvider.notifier).add(CartLine(pid: p.id, q: p.minQty));
                    onAdded?.call();
                    showAddedSnack(context, lang);
                  },
                  child: Text(simple ? tr(lang, 'Ajouter au panier') : p.isQuote ? tr(lang, 'Demander un devis') : tr(lang, 'Choisir une option'), maxLines: 1),
                ),
              ),
              const SizedBox(height: 6),
              SizedBox(
                height: 34,
                child: FilledButton(
                  style: FilledButton.styleFrom(backgroundColor: kInk, foregroundColor: Colors.white, minimumSize: Size.zero, padding: EdgeInsets.zero, textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
                  onPressed: () => context.push('/produit/${p.id}'),
                  child: Text(tr(lang, 'Acheter maintenant'), maxLines: 1),
                ),
              ),
            ]),
          ),
        ]),
      ),
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
        decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(6)),
        child: Padding(padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3), child: Text(text, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700))),
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
      Text('${p.variants.isNotEmpty && unit == null ? '${tr(lang, 'À partir de')} ' : ''}${dzd(price, lang: lang)}', style: TextStyle(fontWeight: FontWeight.w800, fontSize: size, color: kOrange)),
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
