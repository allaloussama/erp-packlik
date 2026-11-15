import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../config.dart';
import '../i18n.dart';
import '../models.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/common.dart';

Color hexColor(String h, Color fallback) {
  final v = int.tryParse(h.replaceFirst('#', ''), radix: 16);
  return v == null || h.replaceFirst('#', '').length != 6 ? fallback : Color(0xFF000000 | v);
}

/// Accueil : slides (réglées dans ERP › Boutique), catégories avec photo, nouveautés.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: Image.network(absUrl('assets/brand/logo.png'), height: 30, errorBuilder: (_, _, _) => const Text('PackLik', style: TextStyle(fontWeight: FontWeight.w800))),
        actions: [IconButton(onPressed: () => context.go('/boutique'), icon: const Icon(Icons.search), tooltip: 'Rechercher')],
      ),
      body: CatalogGate(builder: (c, lang) {
        final popular = c.categories.where((x) => x.id != 'tout' && c.countIn(x.id) > 0).take(12).toList();
        final news = [...c.products.where((p) => p.isNew || p.featured), ...c.products.where((p) => !p.isNew && !p.featured)].where((p) => p.status == 'actif').take(12).toList();
        return RefreshIndicator(
          color: kOrange,
          onRefresh: () => ref.refresh(catalogProvider.future),
          child: ListView(padding: const EdgeInsets.only(bottom: 24), children: [
            if (c.slides.isNotEmpty) _Slides(slides: c.slides, lang: lang) else const _Hero(),
            const _Perks(),
            _Head(tr(lang, 'Catégories'), onAll: () => context.go('/boutique')),
            SizedBox(
              height: 116,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 14),
                itemCount: popular.length,
                separatorBuilder: (_, _) => const SizedBox(width: 10),
                itemBuilder: (context, i) {
                  final cat = popular[i];
                  final img = cat.img.isNotEmpty ? cat.img : (c.products.where((p) => p.cats.contains(cat.id) && p.images.isNotEmpty).map((p) => p.images.first).firstOrNull ?? '');
                  return InkWell(
                    key: ValueKey(cat.id),
                    borderRadius: BorderRadius.circular(12),
                    onTap: () => context.go('/boutique?cat=${cat.id}'),
                    child: SizedBox(width: 84, child: Column(children: [
                      ClipRRect(borderRadius: BorderRadius.circular(14), child: SizedBox(width: 76, height: 76, child: ColoredBox(color: Colors.white, child: NetImg(img, fit: BoxFit.cover)))),
                      const SizedBox(height: 6),
                      Text(cat.name(lang), maxLines: 2, textAlign: TextAlign.center, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600)),
                    ])),
                  );
                },
              ),
            ),
            _Head(tr(lang, 'Nouveautés'), onAll: () => context.go('/boutique')),
            ProductGrid(products: news),
          ]),
        );
      }),
    );
  }
}

class ProductGrid extends StatelessWidget {
  const ProductGrid({super.key, required this.products});
  final List<Product> products;

  @override
  Widget build(BuildContext context) => LayoutBuilder(builder: (context, box) {
        final cols = box.maxWidth > 900 ? 4 : box.maxWidth > 560 ? 3 : 2;
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 14),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: cols, crossAxisSpacing: 10, mainAxisSpacing: 10, mainAxisExtent: (box.maxWidth - 28 - (cols - 1) * 10) / cols + 160),
          itemCount: products.length,
          itemBuilder: (_, i) => ProductCard(key: ValueKey(products[i].id), p: products[i]),
        );
      });
}

class _Head extends StatelessWidget {
  const _Head(this.title, {this.onAll});
  final String title;
  final VoidCallback? onAll;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(16, 20, 8, 10),
        child: Row(children: [
          Expanded(child: Text(title, style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w800, letterSpacing: -.2))),
          if (onAll != null) TextButton(onPressed: onAll, child: const Icon(Icons.arrow_forward, size: 20)),
        ]),
      );
}

class _Slides extends StatefulWidget {
  const _Slides({required this.slides, required this.lang});
  final List<Slide> slides;
  final String lang;
  @override
  State<_Slides> createState() => _SlidesState();
}

class _SlidesState extends State<_Slides> {
  final _ctrl = PageController();
  Timer? _timer;
  int _i = 0;

  @override
  void initState() {
    super.initState();
    if (widget.slides.length > 1) {
      _timer = Timer.periodic(const Duration(seconds: 5), (_) {
        if (_ctrl.hasClients) _ctrl.animateToPage((_i + 1) % widget.slides.length, duration: const Duration(milliseconds: 450), curve: Curves.easeOutCubic);
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _ctrl.dispose();
    super.dispose();
  }

  void _open(String link) {
    final m = RegExp(r'^#/(categorie|produit)/([\w-]+)').firstMatch(link);
    if (m == null) return context.go('/boutique');
    m.group(1) == 'produit' ? context.push('/produit/${m.group(2)}') : context.go('/boutique?cat=${m.group(2)}');
  }

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 0),
        child: AspectRatio(
          aspectRatio: 16 / 10,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Stack(children: [
              PageView(controller: _ctrl, onPageChanged: (i) => setState(() => _i = i), children: [
                for (final s in widget.slides)
                  ColoredBox(
                    color: hexColor(s.bg, const Color(0xFFFFE7D6)),
                    child: Row(children: [
                      Expanded(flex: 6, child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [
                          if (s.badge.isNotEmpty) Text(s.badge, style: const TextStyle(color: kOrange, fontWeight: FontWeight.w800, fontSize: 11)),
                          Text(s.title, maxLines: 3, overflow: TextOverflow.ellipsis, style: TextStyle(color: hexColor(s.color, kInk), fontWeight: FontWeight.w800, fontSize: 18, height: 1.15)),
                          if (s.text.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 6), child: Text(s.text, maxLines: 2, overflow: TextOverflow.ellipsis, style: TextStyle(color: hexColor(s.color, kInk).withValues(alpha: .8), fontSize: 12))),
                          if (s.button.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 10), child: FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 36)), onPressed: () => _open(s.link), child: Text(s.button))),
                        ]),
                      )),
                      if (s.img.isNotEmpty) Expanded(flex: 4, child: Padding(padding: const EdgeInsets.all(8), child: NetImg(s.img))),
                    ]),
                  ),
              ]),
              if (widget.slides.length > 1)
                Positioned(bottom: 8, left: 0, right: 0, child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  for (var k = 0; k < widget.slides.length; k++)
                    AnimatedContainer(duration: const Duration(milliseconds: 250), margin: const EdgeInsets.symmetric(horizontal: 3), width: k == _i ? 18 : 7, height: 7, decoration: BoxDecoration(color: k == _i ? kInk : Colors.white70, borderRadius: BorderRadius.circular(4))),
                ])),
            ]),
          ),
        ),
      );
}

class _Hero extends ConsumerWidget {
  const _Hero();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(langProvider);
    return Padding(
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 0),
      child: DecoratedBox(
        decoration: BoxDecoration(color: kInk, borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(tr(lang, 'Commandez maintenant, payez à la livraison'), style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800, height: 1.2)),
            const SizedBox(height: 12),
            FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 40)), onPressed: () => context.go('/boutique'), child: Text(tr(lang, 'Boutique'))),
          ]),
        ),
      ),
    );
  }
}

class _Perks extends ConsumerWidget {
  const _Perks();
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(langProvider);
    Widget perk(IconData i, String t) => Expanded(child: Row(children: [
          Icon(i, color: kOrange, size: 20), const SizedBox(width: 6),
          Flexible(child: Text(tr(lang, t), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600))),
        ]));
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
      child: Row(children: [perk(Icons.payments_outlined, 'Paiement à la livraison'), const SizedBox(width: 10), perk(Icons.local_shipping_outlined, 'Livraison 69 wilayas')]),
    );
  }
}
