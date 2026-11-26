import 'dart:math';

import 'package:flutter/material.dart';

import '../config.dart';
import '../theme.dart';
import 'dashboard_admin.dart';
import 'orders.dart';
import 'rules.dart';
import 'store.dart';
import 'ui.dart';

// ============================================================ tableaux de bord

int _dayStart([int? ts]) {
  final d = DateTime.fromMillisecondsSinceEpoch(ts ?? now());
  return DateTime(d.year, d.month, d.day).millisecondsSinceEpoch;
}

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key, required this.store, required this.go});
  final ErpStore store;
  final ValueChanged<String> go;

  @override
  Widget build(BuildContext context) {
    if (store.role == 'admin') return AdminDashboard(store: store, go: go);
    final st = store, os = st.orders, today = _dayStart(), month = today - 29 * kDay;
    int cnt(List<String> sts) => os.where((o) => sts.contains(o['status'])).length;
    final kpis = <Widget>[];
    switch (st.role) {
      case 'gerant':
        kpis.addAll([
          Kpi('À préparer', '${cnt(['toprep'])}', onTap: () => go('preparation')),
          Kpi('Prêtes', '${cnt(['ready'])}', onTap: () => go('expedition')),
          Kpi('Envoyées aujourd\'hui', '${os.where((o) => n(m(o['times'])['sent']) >= today).length}'),
          Kpi('En transit', '${cnt(['sent', 'picked', 'transit', 'outfor'])}', onTap: () => go('suivi')),
          Kpi('Tentatives échouées', '${cnt(['failed'])}', onTap: () => go('suivi')),
          Kpi('Retours à réceptionner', '${cnt(['returning'])}', onTap: () => go('retours')),
          Kpi('Stock bas', '${st.lowStock().length}', onTap: () => go('stock'), accent: true),
        ]);
      case 'manager':
        final agents = st.users.where((u) => u['role'] == 'agent').toList();
        final mo = os.where((o) => n(o['created']) >= month).toList();
        final conf = mo.where((o) => n(m(o['times'])['confirmed']) > 0).length, canc = mo.where((o) => o['status'] == 'cancelled').length;
        kpis.addAll([
          Kpi('Agents en ligne', '${agents.where((a) => a['online'] == true && a['pause'] != true).length} / ${agents.length}'),
          Kpi('En attente', '${cnt(kConfSt)}', onTap: () => go('file')),
          Kpi('Sans agent', '${os.where((o) => kConfSt.contains(o['status']) && o['agentId'] == null).length}', onTap: () => go('file')),
          Kpi('Cas difficiles', '${st.hardCases().length}', onTap: () => go('cas')),
          Kpi('Taux de confirmation (30 j)', conf + canc == 0 ? '—' : '${(conf / (conf + canc) * 100).round()} %'),
          Kpi('Taux de livraison', '${st.deliveryRate()} %', accent: true),
        ]);
      case 'fournisseur':
        final sh = _supplierBalance(st);
        kpis.addAll([
          Kpi('Pending — à régler par PackLik', money(sh.due), accent: true, onTap: () => go('paiements')),
          Kpi('En attente de paiement DHD', money(sh.dhd)),
          Kpi('En cours de livraison', money(sh.road)),
          Kpi('Total reçu', money(sh.paid)),
        ]);
      default: // admin
        final created = os.where((o) => n(o['created']) >= today).length;
        final deliv = os.where((o) => n(m(o['times'])['delivered']) >= month).toList();
        kpis.addAll([
          Kpi('Commandes aujourd\'hui', '$created'),
          Kpi('À confirmer', '${cnt(kConfSt)}', onTap: () => go('confirmer')),
          Kpi('À préparer / prêtes', '${cnt(['toprep', 'ready'])}', onTap: () => go('suivi')),
          Kpi('En livraison', '${cnt(['sent', 'picked', 'transit', 'outfor', 'failed'])}', onTap: () => go('suivi')),
          Kpi('Livrées (30 j)', '${deliv.length}'),
          Kpi('CA livré (30 j)', money(deliv.fold<int>(0, (t, o) => t + st.orderTotal(o))), accent: true),
          Kpi('Taux de livraison', '${st.deliveryRate()} %'),
          Kpi('Stock bas', '${st.lowStock().length}', onTap: () => go('stock')),
        ]);
    }
    final days = [for (var i = 13; i >= 0; i--) today - i * kDay];
    final perDay = [for (final d in days) os.where((o) => n(o['created']) >= d && n(o['created']) < d + kDay).length];
    return RefreshIndicator(
      onRefresh: st.syncNow,
      child: ListView(padding: const EdgeInsets.all(12), children: [
        KpiGrid(kpis),
        if (st.role != 'fournisseur') ...[
          const SizedBox(height: 12),
          Section(title: 'Commandes reçues (14 jours)', children: [Padding(padding: const EdgeInsets.fromLTRB(12, 8, 12, 4), child: BarChart(values: perDay, labels: [for (final d in days) '${DateTime.fromMillisecondsSinceEpoch(d).day}']))]),
          const SizedBox(height: 12),
          Section(title: 'Dernières commandes', children: [
            for (final o in (os.toList()..sort((a, b) => n(b['created']).compareTo(n(a['created'])))).take(8))
              ListTile(
                dense: true,
                title: Text('${s(o['ref'])} · ${s(st.customerOf(o)['name'])}', maxLines: 1, overflow: TextOverflow.ellipsis),
                subtitle: Text(fDT(n(o['created']))),
                trailing: Pill(st.kLabel(o), st.kColor(o)),
                onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => OrderScreen(store: st, id: ni(o['id'])))),
              ),
          ]),
        ],
      ]),
    );
  }
}

class BarChart extends StatelessWidget {
  const BarChart({super.key, required this.values, required this.labels});
  final List<int> values;
  final List<String> labels;
  @override
  Widget build(BuildContext context) {
    final mx = values.fold<int>(1, max);
    return SizedBox(
      height: 150,
      child: Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
        for (var i = 0; i < values.length; i++)
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 2),
              child: Column(children: [
                SizedBox(height: 12, child: FittedBox(child: Text(values.length > 16 && values[i] != mx ? '' : '${values[i]}', style: const TextStyle(fontSize: 9.5, color: kErpMuted)))),
                const SizedBox(height: 2),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(color: kLine2, borderRadius: BorderRadius.circular(3)),
                    alignment: Alignment.bottomCenter,
                    child: FractionallySizedBox(heightFactor: max(.03, values[i] / mx), widthFactor: 1, child: Container(decoration: BoxDecoration(color: values[i] == mx ? kKraftD : kOrange, borderRadius: BorderRadius.circular(3)))),
                  ),
                ),
                const SizedBox(height: 4),
                SizedBox(height: 12, child: FittedBox(child: Text(labels[i].isEmpty ? ' ' : labels[i], style: const TextStyle(fontSize: 9.5, color: kErpMuted)))),
              ]),
            ),
          ),
      ]),
    );
  }
}

// ============================================================ produits et stock

class ProductsPage extends StatefulWidget {
  const ProductsPage({super.key, required this.store});
  final ErpStore store;
  @override
  State<ProductsPage> createState() => _ProductsPageState();
}

class _ProductsPageState extends State<ProductsPage> {
  String _q = '', _tab = 'actif';
  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    const tabs = [('actif', 'En vente'), ('devis', 'Sur devis'), ('masqué', 'Masqués'), ('corbeille', 'Corbeille'), ('', 'Tous')];
    final list = st.products.where((p) => (_tab.isEmpty ? p['status'] != 'corbeille' : p['status'] == _tab) &&
        (_q.isEmpty || s(p['name']).toLowerCase().contains(_q) || s(p['sku']).toLowerCase().contains(_q))).toList();
    return Column(children: [
      SizedBox(
        height: 48,
        child: ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.fromLTRB(12, 8, 12, 0), children: [
          for (final t in tabs)
            Padding(padding: const EdgeInsetsDirectional.only(end: 6), child: ChoiceChip(label: Text(t.$2), selected: _tab == t.$1, selectedColor: const Color(0xFFFFE3CF), onSelected: (_) => setState(() => _tab = t.$1))),
        ]),
      ),
      SearchField(hint: 'Rechercher : nom, référence…', onChanged: (v) => setState(() => _q = v.trim().toLowerCase())),
      Expanded(
        child: RefreshIndicator(
          onRefresh: st.syncNow,
          child: list.isEmpty
              ? ListView(children: const [Empty('Aucun produit', icon: Icons.inventory_2_outlined)])
              : ListView.separated(
                  padding: const EdgeInsets.fromLTRB(12, 4, 12, 24),
                  itemCount: list.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 8),
                  itemBuilder: (c, i) => ProductTile(
                    store: st, p: list[i],
                    trailing: ['admin', 'gerant'].contains(st.role) && list[i]['status'] != 'corbeille'
                        ? IconButton(tooltip: 'Poids et prix d\'achat', onPressed: () => _quickEdit(list[i]), icon: const Icon(Icons.edit_outlined))
                        : null,
                  ),
                ),
        ),
      ),
    ]);
  }

  /// Modification rapide depuis la liste (comme les cases du tableau Produits du site) :
  /// poids en kg pour l'admin et le gérant, prix d'achat pour l'admin seul.
  Future<void> _quickEdit(Doc p) async {
    final st = widget.store, admin = st.role == 'admin';
    final w = TextEditingController(text: n(p['weight']) > 0 ? kgTxt(n(p['weight']) / 1000) : ''), c = TextEditingController(text: n(p['cost']) > 0 ? '${ni(p['cost'])}' : '');
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(s(p['name']), maxLines: 2, overflow: TextOverflow.ellipsis),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          TextField(controller: w, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: const InputDecoration(labelText: 'Poids (kg)', isDense: true)),
          if (admin) ...[
            const SizedBox(height: 10),
            TextField(controller: c, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Prix d\'achat (DZD)', isDense: true)),
          ],
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Annuler')),
          FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Enregistrer')),
        ],
      ),
    );
    final kg = double.tryParse(w.text.trim().replaceAll(',', '.')), cost = int.tryParse(c.text.trim());
    w.dispose();
    c.dispose();
    if (ok != true || !mounted) return;
    if (kg != null && kg >= 0 && (kg * 1000).round() != ni(p['weight'])) st.setProductWeight(p, kg);
    if (admin && cost != null && cost >= 0 && cost != ni(p['cost'])) st.setProductCost(p, cost);
    toast(context, '${s(p['name'])} : ${kg == null ? '—' : '${kgTxt(kg)} kg'}${admin && cost != null ? ' · ${money(cost)}' : ''}');
  }
}

class ProductTile extends StatelessWidget {
  const ProductTile({super.key, required this.store, required this.p, this.trailing});
  final ErpStore store;
  final Doc p;
  final Widget? trailing;
  @override
  Widget build(BuildContext context) {
    final si = store.stockInfo(ni(p['id']));
    final img = l(p['images']).isNotEmpty ? absUrl(s(l(p['images']).first)) : '';
    final low = si.available <= ni(p['threshold']) && n(p['price']) > 0;
    return Card(
      child: ListTile(
        contentPadding: const EdgeInsets.fromLTRB(10, 6, 10, 6),
        leading: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: SizedBox(width: 52, height: 52, child: img.isEmpty ? const ColoredBox(color: Color(0xFFFFF1E6), child: Icon(Icons.inventory_2_outlined, color: kOrange)) : Image.network(img, fit: BoxFit.cover, errorBuilder: (_, _, _) => const Icon(Icons.image_not_supported_outlined))),
        ),
        title: Text(s(p['name']), maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
        subtitle: Text('${s(p['sku']).isEmpty ? '' : '${s(p['sku'])} · '}${n(p['price']) > 0 ? money(n(p['price'])) : 'Sur devis'}${n(p['weight']) > 0 ? ' · ${kgTxt(n(p['weight']) / 1000)} kg' : ''}\nDispo ${si.available} · réservé ${si.reserved} · chez la société ${si.atDhd}',
            style: TextStyle(color: low ? kRed : kMuted, fontSize: 12.5)),
        isThreeLine: true,
        trailing: trailing ?? const Icon(Icons.chevron_right),
        onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => ProductScreen(store: store, id: ni(p['id'])))),
      ),
    );
  }
}

class ProductScreen extends StatefulWidget {
  const ProductScreen({super.key, required this.store, required this.id});
  final ErpStore store;
  final int id;
  @override
  State<ProductScreen> createState() => _ProductScreenState();
}

class _ProductScreenState extends State<ProductScreen> {
  late final Doc p = widget.store.pby[widget.id] ?? {};
  late final _name = TextEditingController(text: s(p['name']));
  late final _price = TextEditingController(text: '${ni(p['price'])}');
  late final _cost = TextEditingController(text: '${ni(p['cost'])}');
  late final _stock = TextEditingController(text: '${ni(p['stock'])}');
  late final _thr = TextEditingController(text: '${ni(p['threshold'])}');
  late final _weight = TextEditingController(text: n(p['weight']) > 0 ? kgTxt(n(p['weight']) / 1000) : '');
  late String _status = s(p['status']).isEmpty ? 'actif' : s(p['status']);

  @override
  void dispose() {
    for (final c in [_name, _price, _cost, _stock, _thr, _weight]) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    if (p.isEmpty) return Scaffold(appBar: AppBar(), body: const Empty('Produit introuvable'));
    final canEdit = st.role == 'admin' || st.role == 'gerant';
    final hasVariants = l(p['variants']).isNotEmpty;
    final si = st.stockInfo(widget.id);
    final moves = st.c['stock_moves']!.where((x) => ni(x['pid']) == widget.id).take(20).toList();
    InputDecoration dec(String l0) => InputDecoration(labelText: l0, isDense: true);
    const statuses = ['actif', 'devis', 'masqué', 'archivé', 'corbeille'];
    return Scaffold(
      appBar: AppBar(title: Text(s(p['name']), maxLines: 1, overflow: TextOverflow.ellipsis)),
      body: ListView(padding: const EdgeInsets.fromLTRB(12, 12, 12, 100), children: [
        if (l(p['images']).isNotEmpty)
          SizedBox(
            height: 180,
            child: ListView(scrollDirection: Axis.horizontal, children: [
              for (final u in l(p['images'])) Padding(padding: const EdgeInsetsDirectional.only(end: 8), child: ClipRRect(borderRadius: BorderRadius.circular(12), child: Image.network(absUrl(s(u)), width: 180, height: 180, fit: BoxFit.cover, errorBuilder: (_, _, _) => const SizedBox(width: 180, child: Icon(Icons.image_not_supported_outlined))))),
            ]),
          ),
        const SizedBox(height: 10),
        KpiGrid([Kpi('Physique', '${si.physical}'), Kpi('Réservé', '${si.reserved}'), Kpi('Chez la société', '${si.atDhd}'), Kpi('Disponible', '${si.available}', accent: true)]),
        const SizedBox(height: 10),
        Section(title: 'Fiche', children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(children: [
              TextField(controller: _name, enabled: canEdit, decoration: dec('Nom')),
              const SizedBox(height: 10),
              Row(children: [
                Expanded(child: TextField(controller: _price, enabled: canEdit, keyboardType: TextInputType.number, decoration: dec('Prix de vente (DZD)'))),
                const SizedBox(width: 10),
                Expanded(child: TextField(controller: _cost, enabled: canEdit, keyboardType: TextInputType.number, decoration: dec('Prix d\'achat (DZD)'))),
              ]),
              const SizedBox(height: 10),
              Row(children: [
                Expanded(child: TextField(controller: _stock, enabled: canEdit && !hasVariants, keyboardType: TextInputType.number, decoration: dec(hasVariants ? 'Stock (par variante)' : 'Stock'))),
                const SizedBox(width: 10),
                Expanded(child: TextField(controller: _thr, enabled: canEdit, keyboardType: TextInputType.number, decoration: dec('Seuil d\'alerte'))),
              ]),
              const SizedBox(height: 10),
              TextField(controller: _weight, enabled: canEdit, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: dec('Poids (kg) — poids d\'une unité vendue')),
              const SizedBox(height: 10),
              DropdownButtonFormField<String>(
                initialValue: statuses.contains(_status) ? _status : 'actif',
                decoration: dec('Statut'),
                items: [for (final x in statuses) DropdownMenuItem(value: x, child: Text(x))],
                onChanged: canEdit ? (v) => setState(() => _status = v ?? _status) : null,
              ),
            ]),
          ),
          if (hasVariants)
            for (final v in l(p['variants']).map(m)) Row2(s(v['label']), '${money(n(v['price']))} · stock ${ni(v['stock'])}'),
          Row2('Référence (SKU)', s(p['sku'])),
          Row2('Quantité minimum', '${max(1, ni(p['minQty']))}'),
          Row2('Vendus (30 j)', '${ni(p['sold30'])}'),
        ]),
        const SizedBox(height: 10),
        Section(title: 'Mouvements de stock', children: [
          for (final x in moves)
            ListTile(dense: true, title: Text('${s(x['type'])} · ${ni(x['q']) > 0 ? '+' : ''}${ni(x['q'])}'), subtitle: Text('${fDT(n(x['at']))} · ${s(x['ref'])} · ${s(x['who'])}${s(x['motif']).isNotEmpty ? '\n${s(x['motif'])}' : ''}')),
          if (moves.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun mouvement', style: TextStyle(color: kMuted))),
        ]),
      ]),
      bottomNavigationBar: canEdit
          ? SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(12, 8, 12, 8),
                child: Row(children: [
                  Expanded(child: OutlinedButton.icon(onPressed: () => stockAdjustDialog(context, st, p).then((_) => setState(() => _stock.text = '${ni(p['stock'])}')), icon: const Icon(Icons.tune), label: const Text('Ajuster le stock'))),
                  const SizedBox(width: 8),
                  Expanded(
                    child: FilledButton(
                      onPressed: () {
                        final price = int.tryParse(_price.text.trim()), cost = int.tryParse(_cost.text.trim()), stock = int.tryParse(_stock.text.trim()), thr = int.tryParse(_thr.text.trim());
                        final wTxt = _weight.text.trim().replaceAll(',', '.'), kg = wTxt.isEmpty ? 0.0 : double.tryParse(wTxt);
                        if (_name.text.trim().length < 2 || price == null || cost == null || stock == null || thr == null || kg == null || price < 0 || cost < 0 || kg < 0) {
                          toast(context, 'Vérifiez le nom et les nombres saisis', bad: true);
                          return;
                        }
                        st.saveProduct(p, name: _name.text.trim(), price: price, cost: cost, stock: stock, status: _status, threshold: thr, weight: (kg * 1000).round());
                        toast(context, 'Produit enregistré');
                        Navigator.of(context).maybePop();
                      },
                      child: const Text('Enregistrer'),
                    ),
                  ),
                ]),
              ),
            )
          : null,
    );
  }
}

Future<void> stockAdjustDialog(BuildContext context, ErpStore st, Doc p) async {
  var type = 'ajustement';
  final q = TextEditingController(text: '-1'), motif = TextEditingController();
  final ok = await showDialog<bool>(
    context: context,
    builder: (c) => StatefulBuilder(builder: (c, set) => AlertDialog(
          title: Text('Ajuster le stock — ${s(p['name'])}'),
          content: Column(mainAxisSize: MainAxisSize.min, children: [
            DropdownButtonFormField<String>(
              initialValue: type, decoration: const InputDecoration(labelText: 'Type'),
              items: const [DropdownMenuItem(value: 'ajustement', child: Text('Ajustement')), DropdownMenuItem(value: 'casse', child: Text('Casse')), DropdownMenuItem(value: 'achat', child: Text('Entrée achat'))],
              onChanged: (v) => set(() => type = v ?? type),
            ),
            const SizedBox(height: 10),
            TextField(controller: q, keyboardType: const TextInputType.numberWithOptions(signed: true), decoration: const InputDecoration(labelText: 'Quantité (+/−)')),
            const SizedBox(height: 10),
            TextField(controller: motif, decoration: const InputDecoration(labelText: 'Motif (obligatoire)')),
          ]),
          actions: [
            TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Annuler')),
            FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, true), child: const Text('Enregistrer')),
          ],
        )),
  );
  final qty = int.tryParse(q.text.trim()) ?? 0, mo = motif.text;
  q.dispose();
  motif.dispose();
  if (ok != true || !context.mounted) return;
  final err = st.adjustStock(p, type, qty, mo);
  toast(context, err ?? 'Mouvement enregistré', bad: err != null);
}

class StockPage extends StatefulWidget {
  const StockPage({super.key, required this.store});
  final ErpStore store;
  @override
  State<StockPage> createState() => _StockPageState();
}

class _StockPageState extends State<StockPage> {
  bool _lowOnly = true;
  String _q = '';
  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    final low = st.lowStock();
    final list = (_lowOnly ? low : st.products.where((p) => p['status'] != 'corbeille').toList())
        .where((p) => _q.isEmpty || s(p['name']).toLowerCase().contains(_q) || s(p['sku']).toLowerCase().contains(_q)).toList();
    final canEdit = st.role == 'admin' || st.role == 'gerant';
    return Column(children: [
      Padding(
        padding: const EdgeInsets.fromLTRB(12, 10, 12, 0),
        child: SegmentedButton<bool>(
          segments: [ButtonSegment(value: true, label: Text('Stock bas (${low.length})')), const ButtonSegment(value: false, label: Text('Tous les produits'))],
          selected: {_lowOnly},
          onSelectionChanged: (v) => setState(() => _lowOnly = v.first),
        ),
      ),
      SearchField(hint: 'Rechercher un produit…', onChanged: (v) => setState(() => _q = v.trim().toLowerCase())),
      Expanded(
        child: RefreshIndicator(
          onRefresh: st.syncNow,
          child: list.isEmpty
              ? ListView(children: const [Empty('Aucun produit en stock bas')])
              : ListView.separated(
                  padding: const EdgeInsets.fromLTRB(12, 4, 12, 24),
                  itemCount: list.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 8),
                  itemBuilder: (c, i) => ProductTile(
                    store: st, p: list[i],
                    trailing: canEdit ? IconButton(tooltip: 'Ajuster le stock', icon: const Icon(Icons.tune, color: kOrange), onPressed: () => stockAdjustDialog(context, st, list[i])) : null,
                  ),
                ),
        ),
      ),
    ]);
  }
}

// ============================================================ clients

class CustomersPage extends StatefulWidget {
  const CustomersPage({super.key, required this.store});
  final ErpStore store;
  @override
  State<CustomersPage> createState() => _CustomersPageState();
}

class _CustomersPageState extends State<CustomersPage> {
  String _q = '';
  @override
  Widget build(BuildContext context) {
    final st = widget.store, qd = digits(_q);
    final list = st.customers.where((c) => _q.isEmpty || s(c['name']).toLowerCase().contains(_q.toLowerCase()) || (qd.isNotEmpty && digits(s(c['phone'])).contains(qd))).toList()
      ..sort((a, b) => n(b['id']).compareTo(n(a['id'])));
    return Column(children: [
      SearchField(hint: 'Rechercher : nom, téléphone…', onChanged: (v) => setState(() => _q = v.trim())),
      Expanded(
        child: RefreshIndicator(
          onRefresh: st.syncNow,
          child: list.isEmpty
              ? ListView(children: const [Empty('Aucun client', icon: Icons.people_outline)])
              : ListView.builder(
                  padding: const EdgeInsets.fromLTRB(12, 4, 12, 24),
                  itemCount: list.length,
                  itemBuilder: (c, i) {
                    final x = list[i], os = st.orders.where((o) => ni(o['customerId']) == ni(x['id'])).toList();
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        leading: const CircleAvatar(backgroundColor: Color(0xFFFFE3CF), foregroundColor: kInk, child: Icon(Icons.person_outline)),
                        title: Text(s(x['name']).isEmpty ? '—' : s(x['name']), style: const TextStyle(fontWeight: FontWeight.w700)),
                        subtitle: Text('${s(x['phone'])} · ${st.wName(x['wilaya'])} · ${os.length} commande(s)', textDirection: TextDirection.ltr),
                        trailing: const Icon(Icons.chevron_right),
                        onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => CustomerScreen(store: st, id: ni(x['id'])))),
                      ),
                    );
                  },
                ),
        ),
      ),
    ]);
  }
}

class CustomerScreen extends StatelessWidget {
  const CustomerScreen({super.key, required this.store, required this.id});
  final ErpStore store;
  final int id;
  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: store,
      builder: (context, _) {
        final st = store, c = st.cby[id] ?? {};
        final os = st.orders.where((o) => ni(o['customerId']) == id).toList()..sort((a, b) => n(b['created']).compareTo(n(a['created'])));
        final d = os.where((o) => ['delivered', 'paid', 'closed'].contains(o['status'])).length, r = os.where((o) => ['returning', 'returned'].contains(o['status'])).length;
        final phone = s(c['phone']);
        return Scaffold(
          appBar: AppBar(title: Text(s(c['name']).isEmpty ? 'Client' : s(c['name']))),
          body: ListView(padding: const EdgeInsets.all(12), children: [
            KpiGrid([
              Kpi('Commandes', '${os.length}'),
              Kpi('Livrées', '$d'),
              Kpi('Retours', '$r'),
              Kpi('Dépensé', money(os.where((o) => ['delivered', 'paid', 'closed'].contains(o['status'])).fold<int>(0, (t, o) => t + st.orderTotal(o))), accent: true),
            ]),
            const SizedBox(height: 10),
            Section(title: 'Coordonnées', children: [
              Row2('Téléphone', phone, ltr: true),
              if (s(c['phone2']).isNotEmpty) Row2('Téléphone 2', s(c['phone2']), ltr: true),
              Row2('Commerce', s(c['business'])),
              Row2('Wilaya', st.wName(c['wilaya'])),
              Row2('Commune', s(c['commune'])),
              Row2('Adresse', s(c['address'])),
              Row2('Segment', s(c['segment'])),
              if (s(c['notes']).isNotEmpty) Row2('Notes', s(c['notes'])),
              if (phone.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.fromLTRB(12, 6, 12, 4),
                  child: Row(children: [
                    Expanded(child: FilledButton.icon(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => callPhone(phone), icon: const Icon(Icons.phone, size: 18), label: const Text('Appeler'))),
                    const SizedBox(width: 8),
                    Expanded(child: OutlinedButton.icon(onPressed: () => openUrl(waUrl(phone)), icon: const Icon(Icons.chat_outlined, size: 18), label: const Text('WhatsApp'))),
                  ]),
                ),
            ]),
            const SizedBox(height: 10),
            for (final o in os) Padding(padding: const EdgeInsets.only(bottom: 8), child: OrderCard(store: st, o: o)),
          ]),
        );
      },
    );
  }
}

// ============================================================ équipe, journal

class TeamPage extends StatelessWidget {
  const TeamPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store;
    final list = st.users.where((u) => st.role != 'manager' || u['role'] == 'agent').toList();
    return ListView(padding: const EdgeInsets.all(12), children: [
      for (final u in list)
        Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: CircleAvatar(backgroundColor: u['online'] == true ? const Color(0xFFD9F2E1) : const Color(0xFFEDEFF2), foregroundColor: kInk, child: Text(s(u['name']).isEmpty ? '?' : s(u['name'])[0].toUpperCase())),
            title: Text(s(u['name']), style: const TextStyle(fontWeight: FontWeight.w700)),
            subtitle: Text('${kRoleLabel[u['role']] ?? s(u['role'])}${s(u['email']).isNotEmpty ? ' · ${s(u['email'])}' : ''}${u['active'] == false ? ' · désactivé' : ''}'),
            trailing: u['role'] == 'agent'
                ? Text('${st.orders.where((o) => ni(o['agentId']) == ni(u['id']) && kConfSt.contains(o['status'])).length} en file', style: const TextStyle(color: kMuted, fontSize: 12))
                : null,
          ),
        ),
      if (list.isEmpty) const Empty('Aucun membre'),
    ]);
  }
}

class JournalPage extends StatelessWidget {
  const JournalPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final list = store.c['activity']!.take(300).toList();
    return RefreshIndicator(
      onRefresh: store.syncNow,
      child: list.isEmpty
          ? ListView(children: const [Empty('Journal vide', icon: Icons.history)])
          : ListView.separated(
              padding: const EdgeInsets.all(12),
              itemCount: list.length,
              separatorBuilder: (_, _) => const Divider(height: 1),
              itemBuilder: (c, i) {
                final a = list[i];
                return ListTile(dense: true, title: Text('${s(a['action'])} · ${s(a['entity'])}', style: const TextStyle(fontWeight: FontWeight.w700)), subtitle: Text('${fDT(n(a['at']))} · ${s(a['user'])} (${kRoleLabel[a['role']] ?? s(a['role'])})${s(a['details']).isNotEmpty ? '\n${s(a['details'])}' : ''}'));
              },
            ),
    );
  }
}

// ============================================================ agent : performances

class AgentPerfPage extends StatelessWidget {
  const AgentPerfPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, month = _dayStart() - 29 * kDay;
    final mine = st.orders.where((o) => ni(o['agentId']) == st.uidMe && n(o['created']) >= month).toList();
    final treated = mine.where((o) => o['status'] != 'new').length;
    final conf = mine.where((o) => n(m(o['times'])['confirmed']) > 0).length, canc = mine.where((o) => o['status'] == 'cancelled').length;
    return ListView(padding: const EdgeInsets.all(12), children: [
      KpiGrid([
        Kpi('Commandes traitées (30 j)', '$treated'),
        Kpi('Taux de confirmation', conf + canc == 0 ? '—' : '${(conf / (conf + canc) * 100).round()} %'),
        Kpi('Livrées', '${mine.where((o) => ['delivered', 'paid', 'closed'].contains(o['status'])).length}'),
        Kpi('Taux de livraison', '${st.deliveryRate(mine)} %', accent: true),
      ]),
    ]);
  }
}

// ============================================================ livreur

class LvTourPage extends StatefulWidget {
  const LvTourPage({super.key, required this.store});
  final ErpStore store;
  @override
  State<LvTourPage> createState() => _LvTourPageState();
}

class _LvTourPageState extends State<LvTourPage> {
  String _tab = 'todo', _q = '';
  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    final all = st.lvMine().where((o) => kLvTodo.contains(o['status'])).toList();
    final tabs = {
      'todo': ('À livrer', all.where((o) => ['sent', 'picked', 'transit'].contains(o['status'])).toList()),
      'outfor': ('En route', all.where((o) => o['status'] == 'outfor').toList()),
      'failed': ('À reprendre', all.where((o) => o['status'] == 'failed').toList()),
    };
    final qd = digits(_q), q = _q.toLowerCase();
    final list = tabs[_tab]!.$2.where((o) {
      if (_q.isEmpty) return true;
      final c = st.customerOf(o);
      return s(o['ref']).toLowerCase().contains(q) || s(c['name']).toLowerCase().contains(q) || (qd.isNotEmpty && digits(s(c['phone'])).contains(qd)) || s(o['commune']).toLowerCase().contains(q);
    }).toList();
    final cash = st.lvMine().where((o) => o['cashWithCourier'] == true).fold<int>(0, (t, o) => t + st.orderTotal(o));
    return RefreshIndicator(
      onRefresh: st.syncNow,
      child: ListView(padding: const EdgeInsets.all(12), children: [
        KpiGrid([
          Kpi('Colis à livrer', '${all.length}'),
          Kpi('À encaisser', money(all.fold<int>(0, (t, o) => t + st.orderTotal(o)))),
          Kpi('Argent en main', money(cash), accent: true),
        ]),
        const SizedBox(height: 10),
        Wrap(spacing: 6, runSpacing: 6, children: [
          for (final e in tabs.entries)
            ChoiceChip(label: Text('${e.value.$1}  ${e.value.$2.length}'), selected: _tab == e.key, selectedColor: const Color(0xFFFFE3CF), onSelected: (_) => setState(() => _tab = e.key)),
        ]),
        SearchField(hint: 'Rechercher : n°, client, téléphone, commune…', onChanged: (v) => setState(() => _q = v.trim())),
        for (final o in list) Padding(padding: const EdgeInsets.only(bottom: 10), child: LvCard(store: st, o: o)),
        if (list.isEmpty) const Empty('Rien ici pour le moment'),
      ]),
    );
  }
}

class LvCard extends StatelessWidget {
  const LvCard({super.key, required this.store, required this.o});
  final ErpStore store;
  final Doc o;
  @override
  Widget build(BuildContext context) {
    final st = store, c = st.customerOf(o), status = s(o['status']), phone = s(c['phone']);
    final last = l(o['attempts']).isNotEmpty ? m(l(o['attempts']).last) : null;
    final addr = [s(o['address']), s(o['commune']), st.wName(o['wilaya'])].where((x) => x.isNotEmpty && x != '—').join(', ');
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => OrderScreen(store: st, id: ni(o['id'])))),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Text(s(o['ref']), style: const TextStyle(fontWeight: FontWeight.w900)),
              const SizedBox(width: 8),
              Expanded(child: Align(alignment: AlignmentDirectional.centerStart, child: Pill(st.kLabel(o), st.kColor(o)))),
              const SizedBox(width: 8),
              Text(money(st.orderTotal(o)), style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
            ]),
            const SizedBox(height: 8),
            Text(s(c['name']).isEmpty ? '—' : s(c['name']), style: const TextStyle(fontWeight: FontWeight.w700)),
            if (phone.isNotEmpty) Text(phone, textDirection: TextDirection.ltr),
            const SizedBox(height: 4),
            Row(children: [const Icon(Icons.place_outlined, size: 16, color: kMuted), const SizedBox(width: 4), Expanded(child: Text('${addr.isEmpty ? '—' : addr}${o['delivery'] == 'desk' ? ' · bureau' : ''}'))]),
            const SizedBox(height: 4),
            Text(l(o['items']).map((x) => '${ni(m(x)['q'])} × ${s(st.pby[ni(m(x)['pid'])]?['name'])}').join(' · '), style: const TextStyle(color: kMuted, fontSize: 12.5)),
            if (s(o['note']).isNotEmpty) Padding(padding: const EdgeInsets.only(top: 4), child: Text('📝 ${s(o['note'])}', style: const TextStyle(fontSize: 12.5))),
            if (last != null && status == 'failed') Padding(padding: const EdgeInsets.only(top: 4), child: Text('${failName(s(last['reason']))}${s(last['comment']).isNotEmpty ? ' — ${s(last['comment'])}' : ''}', style: const TextStyle(color: kRed, fontSize: 12.5))),
            if (s(o['courierNote']).isNotEmpty) Padding(padding: const EdgeInsets.only(top: 4), child: Text('✎ ${s(o['courierNote'])}', style: const TextStyle(fontSize: 12.5))),
            const SizedBox(height: 8),
            Wrap(spacing: 6, runSpacing: 6, children: [
              if (phone.isNotEmpty) ActionChip(avatar: const Icon(Icons.phone, size: 16), label: const Text('Appeler'), onPressed: () => callPhone(phone)),
              if (phone.isNotEmpty) ActionChip(avatar: const Icon(Icons.chat_outlined, size: 16), label: const Text('WhatsApp'), onPressed: () => openUrl(waUrl(phone))),
              ActionChip(avatar: const Icon(Icons.route_outlined, size: 16), label: const Text('Itinéraire'), onPressed: () => openUrl('https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent('$addr, Algérie')}')),
              ActionChip(avatar: const Icon(Icons.edit_note, size: 16), label: const Text('Note'), onPressed: () async {
                final t = await textDialog(context, 'Note du livreur · ${s(o['ref'])}', initial: s(o['courierNote']), lines: 3);
                if (t != null) st.lvNote(o, t);
              }),
            ]),
            if (kLvTodo.contains(status)) ...[
              const SizedBox(height: 8),
              Row(children: [
                if (status != 'outfor') Expanded(child: OutlinedButton(onPressed: () {
                  st.lvGo(o);
                  toast(context, '${s(o['ref'])} : en route');
                }, child: const Text('Je pars livrer'))),
                if (status != 'outfor') const SizedBox(width: 6),
                Expanded(child: FilledButton(style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(46), backgroundColor: kRed, foregroundColor: Colors.white), onPressed: () => lvFailDialog(context, st, o), child: const Text('Échec'))),
                const SizedBox(width: 6),
                Expanded(child: FilledButton(style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(46), backgroundColor: kGreen, foregroundColor: Colors.white), onPressed: () => lvDoneDialog(context, st, o), child: const Text('Livrée'))),
              ]),
            ],
          ]),
        ),
      ),
    );
  }
}

class LvCashPage extends StatelessWidget {
  const LvCashPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, cash = st.lvMine().where((o) => o['cashWithCourier'] == true).toList();
    final handed = st.lvMine().where((o) => o['cashWithCourier'] != true && ['paid', 'closed'].contains(o['status'])).toList()
      ..sort((a, b) => n(m(b['times'])['paid']).compareTo(n(m(a['times'])['paid'])));
    int sum(List<Doc> x) => x.fold<int>(0, (t, o) => t + st.orderTotal(o));
    return ListView(padding: const EdgeInsets.all(12), children: [
      KpiGrid([Kpi('Argent en main à remettre', money(sum(cash)), accent: true), Kpi('Colis encaissés', '${cash.length}'), Kpi('Déjà remis', money(sum(handed)))]),
      const SizedBox(height: 10),
      Section(title: 'À remettre au bureau', children: [
        for (final o in cash) ListTile(dense: true, title: Text('${s(o['ref'])} · ${s(st.customerOf(o)['name'])}'), subtitle: Text(m(o['times'])['delivered'] != null ? 'Livrée le ${fDT(n(m(o['times'])['delivered']))}' : '—'), trailing: Text(money(st.orderTotal(o)), style: const TextStyle(fontWeight: FontWeight.w800))),
        if (cash.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun argent en main', style: TextStyle(color: kMuted))),
      ]),
      const SizedBox(height: 10),
      Section(title: 'Déjà remis', children: [
        for (final o in handed.take(60)) ListTile(dense: true, title: Text(s(o['ref'])), subtitle: Text(m(o['times'])['paid'] != null ? fDT(n(m(o['times'])['paid'])) : '—'), trailing: Text(money(st.orderTotal(o)))),
        if (handed.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucune remise pour le moment', style: TextStyle(color: kMuted))),
      ]),
    ]);
  }
}

class LvHistoryPage extends StatelessWidget {
  const LvHistoryPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    int last(Doc o) => m(o['times']).values.fold<int>(0, (t, v) => max(t, ni(v)));
    final list = store.lvMine().where((o) => !kLvTodo.contains(o['status'])).toList()..sort((a, b) => last(b).compareTo(last(a)));
    return ListView(padding: const EdgeInsets.all(12), children: [
      for (final o in list) Padding(padding: const EdgeInsets.only(bottom: 8), child: OrderCard(store: store, o: o)),
      if (list.isEmpty) const Empty('Aucune livraison terminée', icon: Icons.history),
    ]);
  }
}

class LvPerfPage extends StatelessWidget {
  const LvPerfPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, mine = st.lvMine(), today = _dayStart(), month = today - 29 * kDay;
    final done = mine.where((o) => n(m(o['times'])['delivered']) >= month).toList();
    final fail = mine.where((o) => l(o['attempts']).any((a) => n(m(a)['at']) >= month && m(a)['byCourier'] == true)).length;
    final ret = mine.where((o) => ['returning', 'returned'].contains(o['status'])).length;
    final rate = done.length + ret == 0 ? 0 : (done.length / (done.length + ret) * 100).round();
    final per = n(st.cub[st.courierIdMe()]?['perDelivery']);
    final days = [for (var i = 13; i >= 0; i--) today - i * kDay];
    return ListView(padding: const EdgeInsets.all(12), children: [
      KpiGrid([
        Kpi('Livrées (30 j)', '${done.length}'),
        Kpi('Échecs signalés (30 j)', '$fail'),
        Kpi('Taux de livraison', '$rate %'),
        Kpi('Rémunération estimée (30 j)', money(per * done.length), sub: per > 0 ? '${money(per)} / livraison' : '', accent: true),
      ]),
      const SizedBox(height: 10),
      Section(title: 'Livraisons par jour (14 j)', children: [
        Padding(padding: const EdgeInsets.fromLTRB(12, 8, 12, 4), child: BarChart(values: [for (final d in days) mine.where((o) => n(m(o['times'])['delivered']) >= d && n(m(o['times'])['delivered']) < d + kDay).length], labels: [for (final d in days) '${DateTime.fromMillisecondsSinceEpoch(d).day}'])),
      ]),
    ]);
  }
}

// ============================================================ fournisseur

({int due, int dhd, int road, int paid}) _supplierBalance(ErpStore st) {
  int share(Doc o) => l(o['items']).fold<num>(0, (t, i) => t + n(m(i)['cost']) * n(m(i)['q'])).round();
  String? state(Doc o) {
    final x = s(o['status']);
    if (x == 'closed') return 'settled';
    if (x == 'paid') return 'due';
    if (x == 'delivered') return 'dhd';
    if (['sent', 'picked', 'transit', 'outfor', 'failed'].contains(x)) return 'road';
    return null;
  }
  int sum(String k) => st.orders.where((o) => state(o) == k).fold<int>(0, (t, o) => t + share(o));
  return (due: sum('due'), dhd: sum('dhd'), road: sum('road'), paid: st.c['sup_payments']!.fold<int>(0, (t, p) => t + ni(p['amount'])));
}

class SupplierSalesPage extends StatelessWidget {
  const SupplierSalesPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, month = _dayStart() - 29 * kDay;
    if (st.settings['supplierSales'] != true) {
      return const Empty('Option non activée par PackLik.\nL\'Admin peut activer ce partage pour vous aider à anticiper le réapprovisionnement.', icon: Icons.lock_outline);
    }
    final q = <int, int>{};
    for (final o in st.orders.where((o) => n(m(o['times'])['delivered']) >= month)) {
      for (final i in st.expand(l(o['items']))) {
        q[i.pid] = (q[i.pid] ?? 0) + i.q;
      }
    }
    final rows = q.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
    return ListView(padding: const EdgeInsets.all(12), children: [
      Section(title: 'Produits livrés (30 jours)', children: [
        for (final e in rows) ListTile(dense: true, title: Text(s(st.pby[e.key]?['name']).isEmpty ? '#${e.key}' : s(st.pby[e.key]!['name'])), trailing: Text('${e.value}', style: const TextStyle(fontWeight: FontWeight.w800))),
        if (rows.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucune vente sur la période', style: TextStyle(color: kMuted))),
      ]),
    ]);
  }
}
