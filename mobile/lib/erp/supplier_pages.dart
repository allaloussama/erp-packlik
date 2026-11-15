import 'package:flutter/material.dart';

import '../theme.dart';
import 'finance_pages.dart';
import 'rules.dart';
import 'rules2.dart';
import 'store.dart';
import 'ui.dart';

/// Portail fournisseur (app.js : viewSupplierDash, Payments, POs, Deliveries, Statement, Sales).
/// Le serveur ne lui envoie ni client, ni adresse, ni téléphone (out_doc).

int supShare(ErpStore st, Doc o) => st.linesCost(l(o['items']));
String? supState(Doc o) {
  final x = s(o['status']);
  if (x == 'closed') return 'settled';
  if (x == 'paid') return 'due';
  if (x == 'delivered') return 'dhd';
  if (kShipRoad.contains(x)) return 'road';
  return null;
}

Widget _orderTile(ErpStore st, Doc o) {
  final state = supState(o);
  return ListTile(
    dense: true,
    title: Text('${s(o['ref'])} · ${money(supShare(st, o))}', style: const TextStyle(fontWeight: FontWeight.w700)),
    subtitle: Text('${l(o['items']).map(m).map((i) => '${ni(i['q'])} × ${s(st.pby[ni(i['pid'])]?['name'])} @ ${money(n(i['cost']))}').join('\n')}\nlivrée ${m(o['times'])['delivered'] == null ? '—' : fDate(n(m(o['times'])['delivered']))} · encaissée ${m(o['times'])['paid'] == null ? '—' : fDate(n(m(o['times'])['paid']))}'),
    trailing: state == null ? null : Pill(kSupState[state]!.$1, kSupState[state]!.$2),
  );
}

Widget _paymentTile(BuildContext context, ErpStore st, Doc p) => ListTile(
      dense: true,
      title: Text('${s(p['id'])} · ${money(n(p['amount']))}', style: const TextStyle(fontWeight: FontWeight.w700)),
      subtitle: Text('${fDT(n(p['at']))} · ${s(p['mode'])} · ${l(p['orderIds']).length} commandes'),
      trailing: p['confirmedAt'] != null
          ? Pill('Reçu ${fDate(n(p['confirmedAt']))}', kGreen)
          : TextButton(
              style: TextButton.styleFrom(foregroundColor: kGreen),
              onPressed: () {
                p['confirmedAt'] = now();
                st.touch();
                toast(context, 'Réception confirmée');
              },
              child: const Text('Confirmer'),
            ),
      onTap: () => _paymentDetail(context, st, p),
    );

void _paymentDetail(BuildContext context, ErpStore st, Doc p) => showDialog<void>(
      context: context,
      builder: (c) => AlertDialog(
        title: Text('Paiement ${s(p['id'])}'),
        content: SizedBox(
          width: 420,
          child: ListView(shrinkWrap: true, children: [
            Text('${fDT(n(p['at']))} · ${s(p['mode'])} · ${s(p['by'])}', style: const TextStyle(color: kMuted)),
            const SizedBox(height: 8),
            for (final line in l(p['lines']).map(m)) ...[
              Text(s(line['ref']), style: const TextStyle(fontWeight: FontWeight.w800)),
              for (final it in l(line['items']).map(m)) Text('${ni(it['q'])} × ${s(st.pby[ni(it['pid'])]?['name'])} @ ${money(n(it['cost']))} = ${money(n(it['cost']) * n(it['q']))}', style: const TextStyle(fontSize: 13)),
              Align(alignment: AlignmentDirectional.centerEnd, child: Text('Sous-total ${money(n(line['amount']))}', style: const TextStyle(color: kMuted, fontSize: 12.5))),
              const Divider(),
            ],
            Text('Total payé : ${money(n(p['amount']))}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
          ]),
        ),
        actions: [TextButton(onPressed: () => Navigator.pop(c), child: const Text('Fermer'))],
      ),
    );

class SupplierDashPage extends StatelessWidget {
  const SupplierDashPage({super.key, required this.store, required this.go});
  final ErpStore store;
  final ValueChanged<String> go;
  @override
  Widget build(BuildContext context) {
    final st = store, b = st.supplierBalance(), dues = st.supplierDues();
    final last = st.supPayments.toList()..sort((a, b) => n(b['at']).compareTo(n(a['at'])));
    final toConfirm = st.supPayments.where((p) => p['confirmedAt'] == null).length;
    final due = st.orders.where((o) => o['status'] == 'paid').toList();
    return RefreshIndicator(
      onRefresh: st.syncNow,
      child: ListView(padding: const EdgeInsets.all(12), children: [
        KpiGrid([
          Kpi('Pending — à régler par PackLik', money(b.due), sub: '${due.length} commandes déjà encaissées', accent: true, onTap: () => go('paiements')),
          Kpi('En attente de paiement (société de livraison)', money(b.dhd)),
          Kpi('En cours de livraison', money(b.road)),
          Kpi('Total reçu', money(b.paid), sub: '${st.supPayments.length} paiements'),
          Kpi('Prochaine échéance', dues.isEmpty ? '—' : fDate(dues.first.due)),
        ]),
        if (toConfirm > 0) ...[
          const SizedBox(height: 10),
          Card(color: const Color(0xFFFFF4E5), child: ListTile(leading: const Icon(Icons.notifications_active_outlined, color: kOrange), title: Text('$toConfirm paiement(s) à confirmer'), trailing: const Icon(Icons.chevron_right), onTap: () => go('paiements'))),
        ],
        const SizedBox(height: 10),
        Section(title: 'Derniers paiements reçus', children: [
          for (final p in last.take(5)) _paymentTile(context, st, p),
          if (last.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun paiement', style: TextStyle(color: kMuted))),
        ]),
        const SizedBox(height: 10),
        Section(title: 'Pending — commandes à régler', children: [
          for (final o in due.take(20)) _orderTile(st, o),
          if (due.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucune commande', style: TextStyle(color: kMuted))),
        ]),
        const SizedBox(height: 10),
        const Text('Portail fournisseur : vous ne voyez ni les prix de vente, ni les clients, ni les bénéfices de PackLik.', style: TextStyle(color: kMuted, fontSize: 12.5)),
      ]),
    );
  }
}

class SupplierPaymentsPage extends StatefulWidget {
  const SupplierPaymentsPage({super.key, required this.store});
  final ErpStore store;
  @override
  State<SupplierPaymentsPage> createState() => _SupplierPaymentsPageState();
}

class _SupplierPaymentsPageState extends State<SupplierPaymentsPage> {
  String _tab = 'due';
  @override
  Widget build(BuildContext context) {
    final st = widget.store, b = st.supplierBalance();
    final lists = {
      'due': st.orders.where((o) => o['status'] == 'paid').toList(),
      'dhd': st.orders.where((o) => o['status'] == 'delivered').toList(),
      'road': st.orders.where((o) => supState(o) == 'road').toList(),
      'settled': st.orders.where((o) => o['status'] == 'closed').toList()..sort((a, b) => n(m(b['times'])['closed']).compareTo(n(m(a['times'])['closed']))),
    };
    final tabs = [('due', 'Pending — à régler', money(b.due)), ('dhd', 'Attente société', money(b.dhd)), ('road', 'En livraison', money(b.road)), ('settled', 'Payé', money(b.paid)), ('payments', 'Paiements reçus', '')];
    const notes = {
      'due': 'PackLik a déjà reçu l\'argent pour ces commandes : elles seront validées à votre prochain paiement.',
      'dhd': 'Commandes livrées au client : la société de livraison n\'a pas encore versé l\'argent à PackLik.',
      'road': 'Colis en cours de livraison : montants indicatifs (un colis peut être retourné).',
      'payments': 'Chaque paiement contient le détail complet des commandes réglées.',
      'settled': 'Commandes réglées et validées.',
    };
    final pays = st.supPayments.toList()..sort((a, b) => n(b['at']).compareTo(n(a['at'])));
    return ListView(padding: const EdgeInsets.all(12), children: [
      Wrap(spacing: 6, runSpacing: 6, children: [for (final t in tabs) ChoiceChip(label: Text('${t.$2}${t.$3.isNotEmpty ? ' · ${t.$3}' : ''}'), selected: _tab == t.$1, selectedColor: const Color(0xFFFFE3CF), onSelected: (_) => setState(() => _tab = t.$1))]),
      const SizedBox(height: 8),
      Text(notes[_tab]!, style: const TextStyle(color: kMuted, fontSize: 12.5)),
      const SizedBox(height: 8),
      Card(child: Column(children: [
        if (_tab == 'payments') ...[for (final p in pays) _paymentTile(context, st, p)] else ...[for (final o in lists[_tab]!) _orderTile(st, o)],
        if ((_tab == 'payments' ? pays.length : lists[_tab]!.length) == 0) const Padding(padding: EdgeInsets.all(14), child: Text('Rien pour le moment', style: TextStyle(color: kMuted))),
      ])),
    ]);
  }
}

class SupplierPOsPage extends StatelessWidget {
  const SupplierPOsPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, pos = st.c['purchases']!.reversed.toList();
    return ListView(padding: const EdgeInsets.all(12), children: [
      for (final po in pos)
        Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Row(children: [
                Expanded(child: Text(s(po['id']), style: const TextStyle(fontWeight: FontWeight.w900))),
                Pill(kPoSt[po['status']]?.$1 ?? s(po['status']), kPoSt[po['status']]?.$2 ?? kMuted),
              ]),
              Text('Reçu le ${fDate(n(po['created']))} · livraison prévue ${fDate(n(po['expected']))} · ${money(st.poTotal(po))}', style: const TextStyle(color: kMuted, fontSize: 12.5)),
              const SizedBox(height: 4),
              for (final i in l(po['items']).map(m)) Text('${ni(i['q'])} × ${s(st.pby[ni(i['pid'])]?['name'])}', style: const TextStyle(fontSize: 13)),
              if (po['status'] == 'sent')
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: FilledButton(
                    style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(42)),
                    onPressed: () async {
                      final d = await showDatePicker(context: context, helpText: 'Date de livraison', initialDate: DateTime.fromMillisecondsSinceEpoch(ni(po['expected']) > now() ? ni(po['expected']) : now()), firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 180)));
                      if (d == null) return;
                      po['status'] = 'confirmed';
                      po['expected'] = d.millisecondsSinceEpoch;
                      st.touch();
                      if (context.mounted) toast(context, '${s(po['id'])} confirmé');
                    },
                    child: const Text('Confirmer et donner la date de livraison'),
                  ),
                ),
            ]),
          ),
        ),
      if (pos.isEmpty) const Empty('Aucun bon de commande', icon: Icons.description_outlined),
    ]);
  }
}

class SupplierDeliveriesPage extends StatelessWidget {
  const SupplierDeliveriesPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, rec = st.c['purchases']!.where((p) => p['status'] == 'received').toList();
    return ListView(padding: const EdgeInsets.all(12), children: [
      for (final po in rec)
        Section(title: '${s(po['id'])} · reçu le ${po['receivedAt'] == null ? '—' : fDate(n(po['receivedAt']))}', children: [
          for (final i in l(po['items']).map(m))
            ListTile(dense: true, title: Text(s(st.pby[ni(i['pid'])]?['name'])), subtitle: Text('Commandé ${ni(i['q'])} · reçu ${ni(i['recv'])}'), trailing: ni(i['recv']) < ni(i['q']) ? Pill('−${ni(i['q']) - ni(i['recv'])}', kRed) : const Pill('OK', kGreen)),
        ]),
      if (rec.isEmpty) const Empty('Aucune livraison', icon: Icons.local_shipping_outlined),
    ]);
  }
}

class SupplierStatementPage extends StatelessWidget {
  const SupplierStatementPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store;
    final rows = <({int at, bool due, String ref, int amount, String mode})>[
      for (final o in st.orders.where((o) => ['paid', 'closed'].contains(o['status']))) (at: ni(m(o['times'])['paid']), due: true, ref: s(o['ref']), amount: supShare(st, o), mode: ''),
      for (final p in st.supPayments) (at: ni(p['at']), due: false, ref: s(p['id']), amount: ni(p['amount']), mode: s(p['mode'])),
    ]..sort((a, b) => a.at.compareTo(b.at));
    var run = 0;
    final lines = [
      for (final r in rows) () {
        run += r.due ? r.amount : -r.amount;
        return (r: r, bal: run);
      }(),
    ];
    return ListView(padding: const EdgeInsets.all(12), children: [
      Card(child: Column(children: [
        for (final x in lines.reversed)
          ListTile(
            dense: true,
            title: Text(x.r.due ? 'Commande encaissée par PackLik (part fournisseur)' : 'Paiement reçu (${x.r.mode})'),
            subtitle: Text('${x.r.at == 0 ? '—' : fDate(x.r.at)} · ${x.r.ref}'),
            trailing: Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.end, children: [
              Text(x.r.due ? '+${money(x.r.amount)}' : '−${money(x.r.amount)}', style: TextStyle(fontWeight: FontWeight.w800, color: x.r.due ? kInk : kGreen)),
              Text('Solde ${money(x.bal)}', style: const TextStyle(color: kMuted, fontSize: 11.5)),
            ]),
          ),
        if (lines.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucune opération', style: TextStyle(color: kMuted))),
      ])),
    ]);
  }
}
