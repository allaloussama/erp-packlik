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

  @override
  void didUpdateWidget(ShopScreen old) {
    super.didUpdateWidget(old);
    if (widget.category != null && widget.category != old.category) setState(() => _cat = widget.category!);
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
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
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
          onChanged: (_) => setState(() {}),
          decoration: InputDecoration(
            hintText: tr(lang, 'Rechercher un emballage…'), prefixIcon: const Icon(Icons.search), isDense: true,
            suffixIcon: _q.text.isEmpty ? null : IconButton(icon: const Icon(Icons.close), onPressed: () => setState(_q.clear)),
          ),
        ),
        actions: [
          PopupMenuButton<String>(
            tooltip: tr(lang, 'Trier'), icon: const Icon(Icons.sort), initialValue: _sort, onSelected: (v) => setState(() => _sort = v),
            itemBuilder: (_) => [for (final (k, l) in [('pop', 'Pertinence'), ('new', 'Plus récents'), ('asc', 'Prix croissant'), ('desc', 'Prix décroissant')]) PopupMenuItem(value: k, child: Text(tr(lang, l)))],
          ),
        ],
      ),
      body: CatalogGate(builder: (c, lang) {
        final list = _filter(c);
        return RefreshIndicator(
          color: kOrange,
          onRefresh: () => ref.refresh(catalogProvider.future),
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
                      onSelected: (_) => setState(() => _cat = cat.id),
                    ),
                  ),
              ]),
            ),
            Padding(padding: const EdgeInsets.fromLTRB(16, 8, 16, 10), child: Text('${list.length} ${tr(lang, 'Produits').toLowerCase()}', style: const TextStyle(color: kMuted, fontSize: 12.5))),
            if (list.isEmpty) Padding(padding: const EdgeInsets.all(40), child: Center(child: Text(tr(lang, 'Aucun produit'), style: const TextStyle(color: kMuted)))) else ProductGrid(products: list),
          ]),
        );
      }),
    );
  }
}
