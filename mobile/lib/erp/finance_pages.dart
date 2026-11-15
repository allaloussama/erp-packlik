import 'dart:math';

import 'package:flutter/material.dart';

import '../theme.dart';
import 'admin_pages.dart';
import 'rules.dart';
import 'rules2.dart';
import 'store.dart';
import 'ui.dart';

/// Fournisseurs, Achats, Finance, Comptabilité (natifs), mêmes calculs que app.js / erp-plus.js.

const kSupState = {'settled': ('Payé (validé)', kGreen), 'due': ('À régler', Color(0xFFE8A33D)), 'dhd': ('Attente société de livraison', Color(0xFF4A90C2)), 'road': ('En cours de livraison', kMuted)};

Widget supOrderTile(ErpStore st, Doc o, int sid, {Widget? leading}) {
  final state = st.supStateOf(o, sid);
  final items = l(o['items']).map(m).where((i) => st.supOf(ni(i['pid'])) == sid);
  return ListTile(
    dense: true,
    leading: leading,
    title: Text('${s(o['ref'])} · ${money(st.supShareOf(o, sid))}', style: const TextStyle(fontWeight: FontWeight.w700)),
    subtitle: Text('${items.map((i) => '${ni(i['q'])} × ${s(st.pby[ni(i['pid'])]?['name'])} @ ${money(n(i['cost']))}').join('\n')}\n${st.carrierName(st.carrierOf(o))} · livrée ${m(o['times'])['delivered'] == null ? '—' : fDate(n(m(o['times'])['delivered']))} · encaissée ${m(o['times'])['paid'] == null ? '—' : fDate(n(m(o['times'])['paid']))}'),
    trailing: state == null ? null : Pill(kSupState[state]!.$1, kSupState[state]!.$2),
  );
}

// ============================================================ Fournisseurs

class SuppliersPage extends StatefulWidget {
  const SuppliersPage({super.key, required this.store});
  final ErpStore store;
  @override
  State<SuppliersPage> createState() => _SuppliersPageState();
}

class _SuppliersPageState extends State<SuppliersPage> {
  int? _sid;
  String _tab = 'due';

  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    if (st.role != 'admin') return const Empty('Montants visibles par l\'Admin uniquement.', icon: Icons.lock_outline);
    final sups = st.suppliers;
    final sp = sups.where((x) => ni(x['id']) == _sid).firstOrNull ?? sups.firstOrNull;
    final chips = Wrap(spacing: 6, runSpacing: 6, children: [
      for (final x in sups)
        ChoiceChip(label: Text('${s(x['name'])}${st.supBalanceOf(ni(x['id'])).due > 0 ? ' · ${money(st.supBalanceOf(ni(x['id'])).due)}' : ''}'), selected: sp != null && ni(x['id']) == ni(sp['id']), selectedColor: const Color(0xFFFFE3CF), onSelected: (_) => setState(() => _sid = ni(x['id']))),
      ActionChip(avatar: const Icon(Icons.add, size: 16), label: const Text('Ajouter un fournisseur'), onPressed: () => _edit(context, st, null)),
    ]);
    if (sp == null) return ListView(padding: const EdgeInsets.all(12), children: [chips]);
    final sid = ni(sp['id']), b = st.supBalanceOf(sid), os = st.supOrders(sid);
    List<Doc> by(String k) => os.where((o) => st.supStateOf(o, sid) == k).toList();
    final dues = st.supplierDues().where((d) => by('due').any((o) => ni(o['id']) == d.orderId)).toList();
    final prods = st.products.where((p) => st.supOf(ni(p['id'])) == sid && p['status'] != 'corbeille').toList();
    final pays = st.supPayments.where((p) => (ni(p['supplierId']) == 0 ? 1 : ni(p['supplierId'])) == sid).toList()..sort((a, b) => n(b['at']).compareTo(n(a['at'])));
    const tabs = [('due', 'À régler'), ('dhd', 'Attente société'), ('road', 'En livraison'), ('settled', 'Payé'), ('payments', 'Paiements'), ('products', 'Produits')];
    Widget content;
    if (_tab == 'payments') {
      content = Column(children: [
        for (final p in pays)
          ListTile(dense: true, title: Text('${s(p['id'])} · ${money(n(p['amount']))}', style: const TextStyle(fontWeight: FontWeight.w700)), subtitle: Text('${fDT(n(p['at']))} · ${s(p['mode'])} · ${l(p['orderIds']).length} commandes'), trailing: Pill(p['confirmedAt'] != null ? 'Reçu ${fDate(n(p['confirmedAt']))}' : 'En attente du fournisseur', p['confirmedAt'] != null ? kGreen : const Color(0xFFE8A33D))),
        if (pays.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun paiement', style: TextStyle(color: kMuted))),
      ]);
    } else if (_tab == 'products') {
      content = Column(children: [
        for (final p in prods)
          ListTile(dense: true, title: Text(s(p['name'])), subtitle: Text('Achat ${money(n(p['cost']))} · dispo ${st.stockInfo(ni(p['id'])).available} · vendus ${st.orders.where((o) => kDeliveredSt.contains(o['status'])).fold<int>(0, (t, o) => t + l(o['items']).map(m).where((i) => ni(i['pid']) == ni(p['id'])).fold<int>(0, (a, i) => a + ni(i['q'])))}')),
        if (prods.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun produit : choisissez ce fournisseur dans la fiche produit (site)', style: TextStyle(color: kMuted))),
      ]);
    } else {
      final list = by(_tab);
      if (_tab == 'settled') list.sort((a, b) => n(m(b['times'])['closed']).compareTo(n(m(a['times'])['closed'])));
      content = Column(children: [
        for (final o in list) supOrderTile(st, o, sid),
        if (list.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucune commande', style: TextStyle(color: kMuted))),
      ]);
    }
    return ListView(padding: const EdgeInsets.all(12), children: [
      chips,
      const SizedBox(height: 10),
      KpiGrid([
        Kpi('À régler', money(b.due), sub: '${by('due').length} commandes encaissées', accent: true),
        Kpi('Attente société de livraison', money(b.dhd), sub: '${by('dhd').length} livrées, argent pas encore reçu'),
        Kpi('En cours de livraison', money(b.road), sub: '${by('road').length} colis en route'),
        Kpi('Total déjà payé', money(b.paid), sub: '${pays.length} paiements'),
        Kpi('Prochaine échéance', dues.isEmpty ? '—' : fDate(dues.first.due), sub: 'délai J+${n(sp['terms']) == 0 ? st.setting('supplierTerms', 7) : n(sp['terms'])}'),
      ]),
      const SizedBox(height: 10),
      Section(title: 'Fiche fournisseur', trailing: IconButton(icon: const Icon(Icons.edit_outlined), onPressed: () => _edit(context, st, sp)), children: [
        Row2('Nom', s(sp['name'])),
        Row2('Contact', s(sp['contact'])),
        Row2('Téléphone', s(sp['phone']), ltr: true),
        Row2('E-mail', s(sp['email'])),
        Row2('Adresse', s(sp['address'])),
        Row2('Conditions', 'payé commande par commande, sous ${n(sp['terms']) == 0 ? 7 : n(sp['terms'])} jours après l\'encaissement'),
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 8, 12, 4),
          child: FilledButton.icon(onPressed: by('due').isEmpty ? null : () => _pay(context, st, sid, by('due')), icon: const Icon(Icons.payments_outlined), label: Text('Payer ${s(sp['name'])}')),
        ),
      ]),
      const SizedBox(height: 10),
      Wrap(spacing: 6, runSpacing: 6, children: [for (final t in tabs) ChoiceChip(label: Text(t.$2), selected: _tab == t.$1, selectedColor: const Color(0xFFFFE3CF), onSelected: (_) => setState(() => _tab = t.$1))]),
      const SizedBox(height: 6),
      Card(child: content),
    ]);
  }

  Future<void> _edit(BuildContext context, ErpStore st, Doc? sp) async {
    final c = {for (final k in ['name', 'contact', 'phone', 'email', 'address']) k: TextEditingController(text: s(sp?[k]))};
    final terms = TextEditingController(text: '${ni(sp?['terms'] ?? 7)}');
    const labels = {'name': 'Nom *', 'contact': 'Contact', 'phone': 'Téléphone', 'email': 'E-mail', 'address': 'Adresse'};
    final ok = await showDialog<bool>(
      context: context,
      builder: (d) => AlertDialog(
        title: Text(sp == null ? 'Ajouter un fournisseur' : 'Modifier le fournisseur'),
        content: SizedBox(width: 420, child: ListView(shrinkWrap: true, children: [
          for (final k in labels.keys) Padding(padding: const EdgeInsets.only(bottom: 8), child: TextField(controller: c[k], decoration: InputDecoration(labelText: labels[k]))),
          TextField(controller: terms, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Délai de paiement (jours)')),
        ])),
        actions: [
          TextButton(onPressed: () => Navigator.pop(d, false), child: const Text('Annuler')),
          FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(d, true), child: const Text('Enregistrer')),
        ],
      ),
    );
    final v = {for (final e in c.entries) e.key: e.value.text.trim()};
    final t = int.tryParse(terms.text.trim()) ?? 0;
    for (final x in c.values) {
      x.dispose();
    }
    terms.dispose();
    if (ok != true) return;
    if (v['name']!.isEmpty) {
      if (context.mounted) toast(context, 'Nom requis', bad: true);
      return;
    }
    var x = sp;
    if (x == null) {
      x = {'id': st.suppliers.fold<int>(0, (a, y) => max(a, ni(y['id']))) + 1, 'ceiling': null};
      st.suppliers.add(x);
    }
    x.addAll({...v, 'terms': t});
    st.log('Fournisseur enregistré', v['name']!);
    st.touch();
    setState(() => _sid = ni(x!['id']));
    if (context.mounted) toast(context, 'Fournisseur enregistré');
  }

  Future<void> _pay(BuildContext context, ErpStore st, int sid, List<Doc> due) async {
    final list = due.toList()..sort((a, b) => n(m(a['times'])['paid']).compareTo(n(m(b['times'])['paid'])));
    final sel = list.map((o) => ni(o['id'])).toSet();
    var mode = 'Espèces';
    final ok = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      builder: (c) => StatefulBuilder(builder: (c, set) {
        final tot = list.where((o) => sel.contains(ni(o['id']))).fold<int>(0, (t, o) => t + st.supShareOf(o, sid));
        return DraggableScrollableSheet(
          expand: false, initialChildSize: .85,
          builder: (c, sc) => Column(children: [
            ListTile(title: Text('Payer ${st.supName(sid)}', style: const TextStyle(fontWeight: FontWeight.w900)), subtitle: const Text('Cochez les commandes que vous réglez.')),
            Expanded(child: ListView(controller: sc, children: [
              for (final o in list) supOrderTile(st, o, sid, leading: Checkbox(value: sel.contains(ni(o['id'])), onChanged: (v) => set(() => v == true ? sel.add(ni(o['id'])) : sel.remove(ni(o['id']))))),
            ])),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(children: [
                Row(children: [
                  Expanded(child: Text('Montant : ${money(tot)}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 17))),
                  DropdownButton<String>(value: mode, items: const [DropdownMenuItem(value: 'Espèces', child: Text('Espèces')), DropdownMenuItem(value: 'Virement', child: Text('Virement')), DropdownMenuItem(value: 'CCP', child: Text('CCP'))], onChanged: (v) => set(() => mode = v ?? mode)),
                ]),
                Text('Le montant sort de la Réserve fournisseur (${money(n(st.box('reserve')?['balance']))}).', style: const TextStyle(color: kMuted, fontSize: 12)),
                const SizedBox(height: 8),
                SafeArea(child: FilledButton.icon(style: FilledButton.styleFrom(backgroundColor: kGreen, foregroundColor: Colors.white), onPressed: () => Navigator.pop(c, true), icon: const Icon(Icons.check), label: const Text('Valider le paiement'))),
              ]),
            ),
          ]),
        );
      }),
    );
    if (ok != true) return;
    final err = st.paySupplier(sid, list.where((o) => sel.contains(ni(o['id']))).toList(), mode);
    if (context.mounted) toast(context, err ?? 'Paiement validé', bad: err != null);
  }
}

// ============================================================ Achats

const kPoSt = {'draft': ('Brouillon', kMuted), 'sent': ('Envoyé au fournisseur', Color(0xFF4A90C2)), 'confirmed': ('Confirmé par le fournisseur', kOrange), 'received': ('Reçu', kGreen)};

class PurchasesPage extends StatelessWidget {
  const PurchasesPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, sc = st.role == 'admin';
    final sug = st.purchaseSuggestions();
    final pos = st.c['purchases']!.reversed.toList();
    return ListView(padding: const EdgeInsets.all(12), children: [
      FilledButton.icon(onPressed: () => poDialog(context, st, const []), icon: const Icon(Icons.add), label: const Text('Nouveau bon de commande')),
      const SizedBox(height: 10),
      Section(title: 'Bons de commande fournisseur', children: [
        for (final po in pos)
          ListTile(
            title: Text(s(po['id']), style: const TextStyle(fontWeight: FontWeight.w800)),
            subtitle: Text('Créé le ${fDate(n(po['created']))} · prévu le ${fDate(n(po['expected']))}\n${l(po['items']).length} produits · ${l(po['items']).fold<int>(0, (t, i) => t + ni(m(i)['q']))} unités${sc ? ' · ${money(st.poTotal(po))}' : ''}'),
            isThreeLine: true,
            trailing: Pill(kPoSt[po['status']]?.$1 ?? s(po['status']), kPoSt[po['status']]?.$2 ?? kMuted),
            onTap: () => po['status'] == 'received' ? _view(context, st, po) : receiveDialog(context, st, po),
          ),
        if (pos.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun bon de commande', style: TextStyle(color: kMuted))),
      ]),
      const SizedBox(height: 10),
      Section(title: 'Suggestion d\'achat automatique', trailing: sug.isEmpty ? null : TextButton(onPressed: () => poDialog(context, st, [for (final x in sug) (pid: ni(x.p['id']), q: x.need)]), child: const Text('Créer le bon')), children: [
        const Padding(padding: EdgeInsets.fromLTRB(14, 0, 14, 4), child: Text('Basée sur les ventes des 14 derniers jours et le seuil d\'alerte.', style: TextStyle(color: kMuted, fontSize: 12))),
        for (final x in sug) ListTile(dense: true, title: Text(s(x.p['name'])), subtitle: Text('Dispo ${x.available} · vendu 14 j ${x.sold14}'), trailing: Text('${x.need}', style: const TextStyle(fontWeight: FontWeight.w900))),
        if (sug.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun besoin pour le moment', style: TextStyle(color: kMuted))),
      ]),
      const SizedBox(height: 10),
      const Text('La marchandise reçue entre en stock. Le fournisseur est payé commande par commande : sa part devient « À régler » dès que l\'argent est encaissé, puis « Payé » quand vous validez le paiement.', style: TextStyle(color: kMuted, fontSize: 12.5)),
    ]);
  }

  void _view(BuildContext context, ErpStore st, Doc po) => showDialog<void>(
        context: context,
        builder: (c) => AlertDialog(
          title: Text(s(po['id'])),
          content: SingleChildScrollView(child: Column(mainAxisSize: MainAxisSize.min, children: [
            for (final i in l(po['items']).map(m)) ListTile(dense: true, title: Text(s(st.pby[ni(i['pid'])]?['name'])), subtitle: Text('Commandé ${ni(i['q'])} · reçu ${ni(i['recv'])}${st.role == 'admin' ? ' · ${money(n(i['cost']))}' : ''}', style: TextStyle(color: ni(i['recv']) < ni(i['q']) ? kRed : kMuted))),
          ])),
          actions: [TextButton(onPressed: () => Navigator.pop(c), child: const Text('Fermer'))],
        ),
      );
}

Future<void> poDialog(BuildContext context, ErpStore st, List<({int pid, int q})> initial) async {
  final prods = st.products.where((p) => n(p['price']) > 0 && p['packItems'] == null && p['status'] != 'corbeille').toList();
  if (prods.isEmpty) return;
  final rows = initial.isEmpty ? [(pid: ni(prods.first['id']), q: 10)] : initial.toList();
  var expected = DateTime.now().add(const Duration(days: 3));
  final ok = await showModalBottomSheet<bool>(
    context: context,
    isScrollControlled: true,
    builder: (c) => StatefulBuilder(builder: (c, set) => DraggableScrollableSheet(
          expand: false, initialChildSize: .85,
          builder: (c, sc) => Column(children: [
            const ListTile(title: Text('Nouveau bon de commande', style: TextStyle(fontWeight: FontWeight.w900))),
            Expanded(child: ListView(controller: sc, padding: const EdgeInsets.symmetric(horizontal: 12), children: [
              for (var i = 0; i < rows.length; i++)
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(children: [
                    Expanded(child: DropdownButtonFormField<int>(
                      initialValue: prods.any((p) => ni(p['id']) == rows[i].pid) ? rows[i].pid : ni(prods.first['id']), isExpanded: true, decoration: const InputDecoration(isDense: true),
                      items: [for (final p in prods) DropdownMenuItem(value: ni(p['id']), child: Text(s(p['name']), overflow: TextOverflow.ellipsis))],
                      onChanged: (v) => set(() => rows[i] = (pid: v ?? rows[i].pid, q: rows[i].q)),
                    )),
                    const SizedBox(width: 8),
                    SizedBox(width: 76, child: TextFormField(initialValue: '${rows[i].q}', keyboardType: TextInputType.number, decoration: const InputDecoration(isDense: true), onChanged: (v) => rows[i] = (pid: rows[i].pid, q: int.tryParse(v) ?? 0))),
                    IconButton(onPressed: () => set(() => rows.removeAt(i)), icon: const Icon(Icons.close, color: kRed)),
                  ]),
                ),
              TextButton.icon(onPressed: () => set(() => rows.add((pid: ni(prods.first['id']), q: 10))), icon: const Icon(Icons.add), label: const Text('Ajouter une ligne')),
              ListTile(title: const Text('Livraison prévue'), trailing: Text(fDate(expected.millisecondsSinceEpoch)), onTap: () async {
                final d = await showDatePicker(context: c, initialDate: expected, firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365)));
                if (d != null) set(() => expected = d);
              }),
            ])),
            SafeArea(child: Padding(padding: const EdgeInsets.all(12), child: FilledButton(onPressed: () => Navigator.pop(c, true), child: const Text('Envoyer au fournisseur')))),
          ]),
        )),
  );
  if (ok != true) return;
  final err = st.createPurchase(rows, expected.millisecondsSinceEpoch);
  if (context.mounted) toast(context, err ?? 'Bon de commande envoyé au fournisseur', bad: err != null);
}

Future<void> receiveDialog(BuildContext context, ErpStore st, Doc po) async {
  final items = l(po['items']).map(m).toList();
  final ctl = [for (final i in items) TextEditingController(text: '${ni(i['q'])}')];
  final ok = await showDialog<bool>(
    context: context,
    builder: (c) => AlertDialog(
      title: Text('Réception — ${s(po['id'])}'),
      content: SizedBox(width: 420, child: ListView(shrinkWrap: true, children: [
        for (var k = 0; k < items.length; k++)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(children: [
              Expanded(child: Text('${s(st.pby[ni(items[k]['pid'])]?['name'])}\ncommandé ${ni(items[k]['q'])}', style: const TextStyle(fontSize: 13))),
              SizedBox(width: 80, child: TextField(controller: ctl[k], keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Reçu', isDense: true))),
            ]),
          ),
        const Text('Entrée en stock immédiate ; les écarts sont notés dans les mouvements.', style: TextStyle(color: kMuted, fontSize: 12)),
      ])),
      actions: [
        TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Annuler')),
        FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, true), child: const Text('Valider la réception')),
      ],
    ),
  );
  final rec = [for (final t in ctl) int.tryParse(t.text.trim()) ?? 0];
  for (final t in ctl) {
    t.dispose();
  }
  if (ok != true) return;
  st.receivePurchase(po, rec);
  if (context.mounted) toast(context, '${s(po['id'])} réceptionné · stock mis à jour');
}

// ============================================================ Finance

class FinancePage extends StatefulWidget {
  const FinancePage({super.key, required this.store});
  final ErpStore store;
  @override
  State<FinancePage> createState() => _FinancePageState();
}

class _FinancePageState extends State<FinancePage> {
  int? _order;
  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    final confirmed = st.orders.where((o) => kConfirmedSt.contains(o['status'])).toList();
    final paid = confirmed.where((o) => o['status'] == 'paid').toList()..sort((a, b) => st.finOf(b).net.compareTo(st.finOf(a).net));
    final sel = confirmed.where((o) => ni(o['id']) == _order).firstOrNull ?? paid.firstOrNull ?? confirmed.firstOrNull;
    final sb = st.supplierBalance(), dues = st.supplierDues(), adv = st.advanceable();
    final advances = st.c['advances']!;
    final rate = st.setting('usdRate', 260);
    final adSpend30 = st.c['ad_spend']!.fold<num>(0, (t, a) => t + n(a['usd'])) * rate;
    final deliv = st.orders.where((o) => kDeliveredSt.contains(o['status'])).toList();
    final profit30 = deliv.fold<int>(0, (t, o) => t + st.finOf(o).net) + deliv.length * st.setting('adCostPerDelivered', 700);
    final selfFund = min(100, pct(profit30, adSpend30));
    const boxDesc = {
      'reserve': '100 % du coût d\'achat ; ne sort que pour payer le fournisseur',
      'pub': 'Remboursement pub de chaque commande + réinvestissement',
      'security': '% du bénéfice net (perte absorbée ici)',
      'reinvest': '% du bénéfice net ; l\'Admin décide',
    };
    return ListView(padding: const EdgeInsets.all(12), children: [
      KpiGrid([for (final b in st.cashboxes) Kpi(s(b['fr']), money(n(b['balance'])), sub: boxDesc[b['id']] ?? '')]),
      const SizedBox(height: 8),
      Text('Argent chez la société de livraison : ${money(st.moneyAtDhd())} · En route : ${money(st.moneyOnRoad())} · Dette fournisseur : ${money(sb.due)}', style: const TextStyle(color: kMuted, fontSize: 12.5)),
      const SizedBox(height: 8),
      OutlinedButton.icon(onPressed: () => _transfer(context, st), icon: const Icon(Icons.swap_horiz), label: const Text('Mouvement entre caisses / retrait')),
      const SizedBox(height: 10),
      if (sel != null) ...[
        DropdownButtonFormField<int>(
          initialValue: ni(sel['id']), isExpanded: true, decoration: const InputDecoration(labelText: 'Fiche financière de la commande'),
          items: [for (final o in confirmed) DropdownMenuItem(value: ni(o['id']), child: Text('${s(o['ref'])} · ${kStatus[o['status']]?.$1 ?? ''} · ${money(st.orderTotal(o))}', overflow: TextOverflow.ellipsis))],
          onChanged: (v) => setState(() => _order = v),
        ),
        const SizedBox(height: 8),
        Builder(builder: (_) {
          final f = st.finOf(sel);
          return Section(title: 'Fiche financière — ${s(sel['ref'])}', trailing: Pill(f.state, f.state == 'encaissée' ? kGreen : f.state == 'acquise' ? const Color(0xFF4A90C2) : const Color(0xFFE8A33D)), children: [
            Row2('Produits', money(f.products)),
            Row2('Frais de livraison facturés', money(f.fee)),
            Row2('Total encaissé', money(f.total), bold: true),
            Row2('Coût d\'achat fournisseur → Réserve', '− ${money(f.cost)}'),
            Row2('Frais de la société de livraison', '− ${money(f.dhd)}'),
            Row2('Coût pub alloué → Budget pub', '− ${money(f.ad)}'),
            Row2('Commission agent', '− ${money(f.com)}'),
            Row2('Bénéfice net', money(f.net), bold: true),
            Row2('→ Caisse de sécurité / Réinvestissement', f.net > 0 ? '${money(f.security)} / ${money(f.reinvest)}' : 'Perte absorbée par la Caisse de sécurité'),
          ]);
        }),
      ],
      const SizedBox(height: 10),
      Section(title: 'Avance pub sur la réserve fournisseur', children: [
        Row2('Montant avançable maintenant', money(adv), bold: true),
        Padding(padding: const EdgeInsets.fromLTRB(14, 0, 14, 6), child: Text('= Réserve ${money(n(st.box('reserve')?['balance']))} − dettes échues sous 3 j − marge de sécurité ${money(st.setting('safetyMargin', 20000))} · plafond ${st.setting('advanceCap', 30)} % de la réserve', style: const TextStyle(color: kMuted, fontSize: 12))),
        for (final a in advances.where((a) => a['repaidAt'] == null))
          ListTile(dense: true, title: Text('${s(a['id'])} · ${money(n(a['amount']))}', style: const TextStyle(color: kRed, fontWeight: FontWeight.w800)), subtitle: Text('${s(a['note'])} · à rembourser le ${fDate(n(a['due']))}'), trailing: TextButton(onPressed: () {
            final e = st.repayAdvance(a);
            toast(context, e ?? '${s(a['id'])} remboursée', bad: e != null);
          }, child: const Text('Rembourser'))),
        for (final a in advances.where((a) => a['repaidAt'] != null)) ListTile(dense: true, title: Text('${s(a['id'])} · ${money(n(a['amount']))} · ${s(a['note'])}'), trailing: Text('Remboursée ${fDate(n(a['repaidAt']))}', style: const TextStyle(color: kGreen, fontSize: 12))),
        Padding(padding: const EdgeInsets.fromLTRB(12, 4, 12, 4), child: FilledButton.icon(onPressed: adv > 0 ? () => _advance(context, st, adv) : null, icon: const Icon(Icons.bolt), label: const Text('Nouvelle avance pub'))),
        if (adv <= 0) const Padding(padding: EdgeInsets.fromLTRB(14, 0, 14, 6), child: Text('Avance bloquée : une échéance fournisseur deviendrait impossible à tenir.', style: TextStyle(color: kRed, fontSize: 12.5))),
      ]),
      const SizedBox(height: 10),
      Section(title: 'Pub autofinancée', children: [Row2('Dépenses Meta (30 j) couvertes par les bénéfices', fmtPct(selfFund), bold: true), Row2('Dépense Meta', money(adSpend30))]),
      const SizedBox(height: 10),
      Section(title: 'Calendrier des échéances fournisseur', children: [
        for (final d in dues)
          ListTile(dense: true, title: Text('${fDate(d.due)} · ${d.ref}'), trailing: Row(mainAxisSize: MainAxisSize.min, children: [
            Text(money(d.rest), style: const TextStyle(fontWeight: FontWeight.w800)),
            const SizedBox(width: 6),
            Pill(d.due < now() ? 'En retard' : 'dans ${((d.due - now()) / kDay).ceil()} j', d.due < now() ? kRed : d.due - now() < 48 * kHour ? const Color(0xFFE8A33D) : const Color(0xFF4A90C2)),
          ])),
        if (dues.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucune échéance', style: TextStyle(color: kMuted))),
      ]),
      const SizedBox(height: 10),
      Section(title: 'Mouvements des caisses', children: [
        for (final x in st.c['cash_moves']!.take(60))
          ListTile(dense: true, title: Text('${st.boxName(s(x['box']))} · ${s(x['type'])}'), subtitle: Text('${fDT(n(x['at']))} · ${s(x['ref'])} · ${s(x['who'])}'), trailing: Text('${n(x['amount']) > 0 ? '+' : ''}${money(n(x['amount']))}', style: TextStyle(fontWeight: FontWeight.w800, color: n(x['amount']) < 0 ? kRed : kGreen))),
        if (st.c['cash_moves']!.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun mouvement', style: TextStyle(color: kMuted))),
      ]),
    ]);
  }

  Future<void> _transfer(BuildContext context, ErpStore st) async {
    if (st.cashboxes.length < 2) return;
    var from = st.box('reinvest') != null ? 'reinvest' : s(st.cashboxes.first['id']);
    var to = st.box('pub') != null ? 'pub' : s(st.cashboxes.last['id']);
    final amt = TextEditingController(text: '10000'), motif = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: const Text('Mouvement entre caisses'),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          DropdownButtonFormField<String>(initialValue: from, decoration: const InputDecoration(labelText: 'De'), items: [for (final b in st.cashboxes) DropdownMenuItem(value: s(b['id']), child: Text('${s(b['fr'])} (${money(n(b['balance']))})'))], onChanged: (v) => from = v ?? from),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(initialValue: to, decoration: const InputDecoration(labelText: 'Vers'), items: [for (final b in st.cashboxes) DropdownMenuItem(value: s(b['id']), child: Text(s(b['fr'])))], onChanged: (v) => to = v ?? to),
          const SizedBox(height: 8),
          TextField(controller: amt, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Montant (DZD)')),
          const SizedBox(height: 8),
          TextField(controller: motif, decoration: const InputDecoration(labelText: 'Motif (obligatoire)', hintText: 'Ex. : augmenter la pub')),
          const SizedBox(height: 8),
          const Text('La Réserve fournisseur ne peut sortir que pour payer le fournisseur (ou via une avance pub contrôlée).', style: TextStyle(color: kMuted, fontSize: 12)),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Annuler')),
          FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, true), child: const Text('Valider')),
        ],
      ),
    );
    final a = int.tryParse(amt.text.trim()) ?? 0, mo = motif.text;
    amt.dispose();
    motif.dispose();
    if (ok != true) return;
    final e = st.transfer(from, to, a, mo);
    if (context.mounted) toast(context, e ?? 'Mouvement enregistré', bad: e != null);
  }

  Future<void> _advance(BuildContext context, ErpStore st, int mx) async {
    final amt = TextEditingController(text: '${min(15000, mx)}'), note = TextEditingController(text: 'Boost campagne');
    var due = DateTime.now().add(const Duration(days: 5));
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => StatefulBuilder(builder: (c, set) => AlertDialog(
            title: const Text('Nouvelle avance pub'),
            content: Column(mainAxisSize: MainAxisSize.min, children: [
              TextField(controller: amt, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: 'Montant (max ${money(mx)})')),
              ListTile(contentPadding: EdgeInsets.zero, title: const Text('Date de remboursement'), trailing: Text(fDate(due.millisecondsSinceEpoch)), onTap: () async {
                final d = await showDatePicker(context: c, initialDate: due, firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 120)));
                if (d != null) set(() => due = d);
              }),
              TextField(controller: note, decoration: const InputDecoration(labelText: 'Objet')),
            ]),
            actions: [
              TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Annuler')),
              FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, true), child: const Text('Accorder')),
            ],
          )),
    );
    final a = int.tryParse(amt.text.trim()) ?? 0, no = note.text.trim();
    amt.dispose();
    note.dispose();
    if (ok != true) return;
    final e = st.newAdvance(a, due.millisecondsSinceEpoch, no);
    if (context.mounted) toast(context, e ?? 'Avance accordée : ${money(a)}', bad: e != null);
  }
}

// ============================================================ Comptabilité

class AccountingPage extends StatelessWidget {
  const AccountingPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store;
    final e = st.journalEntries();
    final delivered = st.orders.where((o) => kDeliveredSt.contains(o['status'])).toList();
    final ca = delivered.fold<int>(0, (t, o) => t + st.orderTotal(o)), cogs = delivered.fold<int>(0, (t, o) => t + st.linesCost(l(o['items'])));
    final dhd = delivered.fold<int>(0, (t, o) => t + st.dhdFeeOf(o)) + st.orders.where((o) => ['returning', 'returned'].contains(o['status'])).fold<int>(0, (t, o) => t + st.dhdFeeOf(o) * 2);
    final rate = st.setting('usdRate', 260);
    final pub = (st.c['ad_spend']!.fold<num>(0, (t, a) => t + n(a['usd'])) * rate).round();
    final sal = (delivered.length * st.setting('commission', 100) + 116000).round(); // forfait salaires du site
    final charges = st.c['expenses']!.where((x) => !RegExp('Salaires').hasMatch(s(x['cat']))).fold<int>(0, (t, x) => t + ni(x['amount']));
    final marg = ca - cogs, net = marg - dhd - pub - sal - charges;
    Widget pl(String l0, int v, [bool b = false]) => Row2(l0, '${money(v)}${ca > 0 ? '  (${(v / ca * 100).round()} %)' : ''}', bold: b);
    Map<String, ({int n, int ca, int net})> by(String Function(Doc) key) {
      final mm = <String, ({int n, int ca, int net})>{};
      for (final o in delivered) {
        final k = key(o), f = st.finOf(o), x = mm[k] ?? (n: 0, ca: 0, net: 0);
        mm[k] = (n: x.n + 1, ca: x.ca + f.total, net: x.net + f.net);
      }
      return Map.fromEntries(mm.entries.toList()..sort((a, b) => b.value.net.compareTo(a.value.net)));
    }
    final prodM = <int, ({int q, int marg})>{};
    for (final o in delivered) {
      for (final i in l(o['items']).map(m)) {
        final x = prodM[ni(i['pid'])] ?? (q: 0, marg: 0);
        prodM[ni(i['pid'])] = (q: x.q + ni(i['q']), marg: x.marg + ((n(i['price']) - n(i['cost'])) * n(i['q'])).round());
      }
    }
    Widget table(Map<String, ({int n, int ca, int net})> data) => Column(children: [
          for (final x in data.entries.take(8)) ListTile(dense: true, title: Text(x.key), subtitle: Text('${x.value.n} cmd · CA ${money(x.value.ca)}'), trailing: Text(money(x.value.net), style: TextStyle(fontWeight: FontWeight.w800, color: x.value.net < 0 ? kRed : kGreen))),
          if (data.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('—', style: TextStyle(color: kMuted))),
        ]);
    final tiers = <(String, String, int)>[
      for (final x in st.suppliers) (s(x['name']), 'Fournisseur — à payer', -st.supBalanceOf(ni(x['id'])).due),
      for (final c in st.c['carriers']!.where((c) => c['internal'] != true && s(c['id']).isNotEmpty)) (s(c['name']), 'Société de livraison — à recevoir', st.orders.where((o) => o['status'] == 'delivered' && st.carrierOf(o)['id'] == c['id']).fold<int>(0, (t, o) => t + st.orderTotal(o) - st.dhdFeeOf(o))),
      for (final cu in st.c['couriers']!) (s(cu['name']), 'Livreur — argent en main', st.courierCash(ni(cu['id']))),
      for (final a in st.agents) (s(a['name']), 'Agent — commissions du mois', -st.agentPerf(a).commission),
    ].where((r) => r.$3 != 0).toList();
    return Tabbed(tabs: [
      ('Journal', ListView(padding: const EdgeInsets.all(12), children: [
        Row(children: [
          Expanded(child: Text('${e.length} écritures · générées automatiquement', style: const TextStyle(color: kMuted))),
          FilledButton.icon(style: FilledButton.styleFrom(minimumSize: const Size(0, 40)), onPressed: () => _expense(context, st), icon: const Icon(Icons.add, size: 18), label: const Text('Dépense')),
        ]),
        const SizedBox(height: 8),
        Card(child: Column(children: [
          for (final x in e.take(300))
            ListTile(dense: true, title: Text(x.label, style: const TextStyle(fontSize: 13)), subtitle: Text('${fDate(x.at)} · ${x.cat}'), trailing: Text(x.inn > 0 ? '+${money(x.inn)}' : '−${money(x.out)}', style: TextStyle(fontWeight: FontWeight.w800, color: x.inn > 0 ? kGreen : kRed))),
          if (e.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucune écriture', style: TextStyle(color: kMuted))),
        ])),
      ])),
      ('Dépenses Meta', ListView(padding: const EdgeInsets.all(12), children: [
        Card(child: NumTile('Taux de change (DZD / USD)', rate, (v) {
          st.settings['usdRate'] = v == 0 ? 260 : v;
          st.touch();
        })),
        const SizedBox(height: 8),
        Card(child: Column(children: [
          for (final a in st.c['ad_spend']!.reversed) ListTile(dense: true, title: Text(s(a['campaign'])), subtitle: Text(fDate(n(a['date']))), trailing: Text('${n(a['usd']).toStringAsFixed(2)} USD · ${money(n(a['usd']) * rate)}')),
          Row2('Total', money(pub), bold: true),
        ])),
      ])),
      ('Compte de résultat', ListView(padding: const EdgeInsets.all(12), children: [
        Card(child: Column(children: [
          pl('CA livré', ca), pl('Coût d\'achat', -cogs), pl('Marge brute', marg, true), pl('Frais de livraison (aller + retours)', -dhd),
          pl('Publicité Meta', -pub), pl('Salaires et commissions', -sal), pl('Charges (loyer, emballage, transport, divers)', -charges), pl('Résultat net', net, true),
        ])),
      ])),
      ('Rentabilité', ListView(padding: const EdgeInsets.all(12), children: [
        Section(title: 'Par produit (marge brute)', children: [
          for (final x in (prodM.entries.toList()..sort((a, b) => b.value.marg.compareTo(a.value.marg))).take(8)) ListTile(dense: true, title: Text(s(st.pby[x.key]?['name'])), subtitle: Text('${x.value.q} unités'), trailing: Text(money(x.value.marg), style: const TextStyle(fontWeight: FontWeight.w800, color: kGreen))),
        ]),
        const SizedBox(height: 8),
        Section(title: 'Par wilaya', children: [table(by((o) => st.wName(o['wilaya'])))]),
        const SizedBox(height: 8),
        Section(title: 'Par agent', children: [table(by((o) => st.agentName(o['agentId']).isEmpty ? '—' : st.agentName(o['agentId'])))]),
      ])),
      ('Comptes de tiers', ListView(padding: const EdgeInsets.all(12), children: [
        const Text('Soldes calculés automatiquement à partir des commandes, des encaissements et des paiements.', style: TextStyle(color: kMuted, fontSize: 12.5)),
        const SizedBox(height: 8),
        Card(child: Column(children: [
          for (final r in tiers) ListTile(dense: true, title: Text(r.$1, style: const TextStyle(fontWeight: FontWeight.w700)), subtitle: Text(r.$2), trailing: Text(money(r.$3.abs()), style: TextStyle(fontWeight: FontWeight.w800, color: r.$3 < 0 ? kRed : kGreen))),
          if (tiers.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun solde', style: TextStyle(color: kMuted))),
        ])),
      ])),
    ]);
  }

  Future<void> _expense(BuildContext context, ErpStore st) async {
    var cat = 'Loyer', from = 'reinvest';
    final amt = TextEditingController(), note = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: const Text('Ajouter une dépense'),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          DropdownButtonFormField<String>(initialValue: cat, decoration: const InputDecoration(labelText: 'Catégorie'), items: [for (final x in ['Loyer', 'Salaires et commissions', 'Emballage', 'Transport', 'Divers']) DropdownMenuItem(value: x, child: Text(x))], onChanged: (v) => cat = v ?? cat),
          const SizedBox(height: 8),
          TextField(controller: amt, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Montant (DZD)')),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(initialValue: st.box(from) != null ? from : (st.cashboxes.isEmpty ? null : s(st.cashboxes.first['id'])), decoration: const InputDecoration(labelText: 'Payé depuis'), items: [for (final b in st.cashboxes.where((b) => b['id'] != 'reserve')) DropdownMenuItem(value: s(b['id']), child: Text(s(b['fr'])))], onChanged: (v) => from = v ?? from),
          const SizedBox(height: 8),
          TextField(controller: note, decoration: const InputDecoration(labelText: 'Libellé')),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Annuler')),
          FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, true), child: const Text('Enregistrer')),
        ],
      ),
    );
    final a = int.tryParse(amt.text.trim()) ?? 0, no = note.text.trim();
    amt.dispose();
    note.dispose();
    if (ok != true) return;
    final err = st.addExpense(cat, a, from, no);
    if (context.mounted) toast(context, err ?? 'Dépense enregistrée', bad: err != null);
  }
}
