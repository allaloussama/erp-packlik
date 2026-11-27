import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../i18n.dart';
import '../models.dart';
import '../state.dart';
import '../theme.dart';
import '../widgets/common.dart';
import 'home_screen.dart';

/// Boutique : recherche, catégories, tri — comme la page Boutique du site.
class ShopScreen extends ConsumerStatefulWidget {
  const ShopScreen({super.key, this.category, this.query});
  final String? category;
  final String? query;
  @override
  ConsumerState<ShopScreen> createState() => _ShopScreenState();
}

class _ShopScreenState extends ConsumerState<ShopScreen> {
  late final _q = TextEditingController(text: widget.query ?? '');
  late String _cat = widget.category ?? 'tout';
  String _sort = 'pop';
  int _shown = 24; // défilement infini comme le site : 24 produits, puis 24 de plus en bas de la liste

  @override
  void didUpdateWidget(ShopScreen old) {
    super.didUpdateWidget(old);
    if (widget.category != null && widget.category != old.category) setState(() { _cat = widget.category!; _shown = 24; });
  }

  @override
  void dispose() {
    _q.dispose();
    super.dispose();
  }

  static String _norm(String s) => s.toLowerCase().replaceAll(RegExp('[éèêë]'), 'e').replaceAll(RegExp('[àâä]'), 'a').replaceAll(RegExp('[îï]'), 'i').replaceAll(RegExp('[ôö]'), 'o').replaceAll(RegExp('[ûüù]'), 'u');

  List<Product> _filter(Catalog c) {
    final q = _norm(_q.text.trim());
    final list = c.products.where((p) => p.status != 'masqué' && (_cat == 'tout' || p.cats.contains(_cat)) && (q.isEmpty || _norm('${p.name} ${p.nameAr} ${p.sku}').contains(q))).toList();
    switch (_sort) {
      case 'asc':
        list.sort((a, b) => a.unitPrice(null, a.minQty).compareTo(b.unitPrice(null, b.minQty)));
      case 'desc':
        list.sort((a, b) => b.unitPrice(null, b.minQty).compareTo(a.unitPrice(null, a.minQty)));
      case 'new':
        list.sort((a, b) => b.id.compareTo(a.id));
      default: // « Pertinence » = ordre de la catégorie choisi par l'admin, puis produits mis en avant, comme « Recommandés » sur le site
        final pids = c.categories.where((x) => x.id == _cat).firstOrNull?.pids ?? const <int>[];
        int r(Product p) => pids.contains(p.id) ? pids.indexOf(p.id) : 1 << 30;
        list.sort((a, b) => r(a) != r(b) ? r(a).compareTo(r(b)) : a.featured != b.featured ? (b.featured ? 1 : -1) : a.id.compareTo(b.id));
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(langProvider);
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _q,
          textInputAction: TextInputAction.search,
          onChanged: (_) => setState(() => _shown = 24),
          decoration: InputDecoration(
            hintText: tr(lang, 'Rechercher un emballage…'), prefixIcon: const Icon(Icons.search), isDense: true,
            suffixIcon: _q.text.isEmpty ? null : IconButton(icon: const Icon(Icons.close), onPressed: () => setState(() { _q.clear(); _shown = 24; })),
          ),
        ),
        actions: [
          PopupMenuButton<String>(
            tooltip: tr(lang, 'Trier'), icon: const Icon(Icons.sort), initialValue: _sort, onSelected: (v) => setState(() { _sort = v; _shown = 24; }),
            itemBuilder: (_) => [for (final (k, l) in [('pop', 'Pertinence'), ('new', 'Plus récents'), ('asc', 'Prix croissant'), ('desc', 'Prix décroissant')]) PopupMenuItem(value: k, child: Text(tr(lang, l)))],
          ),
        ],
      ),
      body: CatalogGate(builder: (c, lang) {
        final list = _filter(c);
        return RefreshIndicator(
          color: kOrange,
          onRefresh: () => ref.refresh(catalogProvider.future),
          child: NotificationListener<ScrollNotification>(
            onNotification: (sn) {
              if (sn.depth == 0 && sn.metrics.extentAfter < 400 && _shown < list.length) setState(() => _shown += 24);
              return false;
            },
            child: ListView(padding: const EdgeInsets.only(bottom: 24), children: [
            SizedBox(
              height: 52,
              child: ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.fromLTRB(14, 10, 14, 4), children: [
                for (final cat in c.categories)
                  Padding(
                    key: ValueKey(cat.id),
                    padding: const EdgeInsetsDirectional.only(end: 6),
                    child: ChoiceChip(
                      label: Text('${cat.name(lang)} ${c.countIn(cat.id)}'), selected: _cat == cat.id, showCheckmark: false,
                      selectedColor: kInk, labelStyle: TextStyle(color: _cat == cat.id ? Colors.white : kInk, fontSize: 12.5, fontWeight: FontWeight.w600),
                      onSelected: (_) => setState(() { _cat = cat.id; _shown = 24; }),
                    ),
                  ),
              ]),
            ),
            Padding(padding: const EdgeInsets.fromLTRB(16, 8, 16, 10), child: Text('${list.length} ${tr(lang, 'Produits').toLowerCase()}', style: const TextStyle(color: kMuted, fontSize: 12.5))),
            if (list.isEmpty) Padding(padding: const EdgeInsets.all(40), child: Center(child: Text(tr(lang, 'Aucun produit'), style: const TextStyle(color: kMuted)))) else ProductGrid(products: list.take(_shown).toList()),
            if (_shown < list.length) const Padding(padding: EdgeInsets.all(16), child: Center(child: CircularProgressIndicator(color: kOrange))),
            ]),
          ),
        );
      }),
    );
  }
}
