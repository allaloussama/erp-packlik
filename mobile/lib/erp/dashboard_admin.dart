import 'package:flutter/material.dart';

import '../theme.dart';
import 'orders.dart';
import 'pages.dart';
import 'rules.dart';
import 'rules2.dart';
import 'store.dart';
import 'ui.dart';

/// Tableau de bord de l'admin, copie de viewDashboard() du site (assets/app.js) : période, chiffres clés,
/// commandes sur 30 jours, trésorerie, entonnoir, top produits, top wilayas, agents, alertes.
class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key, required this.store, required this.go});
  final ErpStore store;
  final ValueChanged<String> go;
  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  String _period = '30';

  (int, int) _range() {
    final today = dayStart();
    switch (_period) {
      case '0':
        return (today, now());
      case '7':
        return (today - 6 * kDay, now());
      case 'm':
        final d = DateTime.now();
        return (DateTime(d.year, d.month).millisecondsSinceEpoch, now());
      default:
        return (today - 29 * kDay, now());
    }
  }

  /// Deux cartes côte à côte sur tablette (.g2 du site), l'une sous l'autre sur téléphone.
  Widget _pair(Widget a, Widget b) => LayoutBuilder(
        builder: (c, box) => box.maxWidth >= 760
            ? Row(crossAxisAlignment: CrossAxisAlignment.start, children: [Expanded(child: a), const SizedBox(width: 12), Expanded(child: b)])
            : Column(children: [a, const SizedBox(height: 12), b]),
      );

  @override
  Widget build(BuildContext context) {
    final st = widget.store, go = widget.go;
    final (from, to) = _range();
    final list = st.orders.where((o) => n(o['created']) >= from && n(o['created']) <= to).toList();
    bool isConf(Doc o) => kConfirmedSt.contains(o['status']);
    bool isDeliv(Doc o) => kDeliveredSt.contains(o['status']);
    bool isRet(Doc o) => ['returning', 'returned'].contains(o['status']);

    // dashStats() du site
    final conf = list.where(isConf).toList(), deliv = list.where(isDeliv).toList(), rets = list.where(isRet).toList();
    final canc = list.where((o) => o['status'] == 'cancelled').length;
    final ship = list.where((o) => kShippedSt.contains(o['status'])).length;
    final paid = list.where((o) => ['paid', 'closed'].contains(o['status'])).length;
    final ca = deliv.fold<int>(0, (t, o) => t + st.orderTotal(o));
    final retLoss = rets.fold<int>(0, (t, o) => t + st.returnLoss(o));
    final net = deliv.fold<int>(0, (t, o) => t + st.finOf(o).net) - retLoss;
    final up = conf.fold<int>(0, (t, o) => t + st.upsellGain(o));
    final upBase = conf.fold<int>(0, (t, o) => t + st.linesTotal(l(o['initial'])));
    final avg = conf.isEmpty ? 0 : conf.fold<int>(0, (t, o) => t + st.orderTotal(o)) / conf.length;
    final confRate = pct(conf.length, conf.length + canc), delivRate = pct(deliv.length, deliv.length + rets.length);

    // séries, tops
    final today = dayStart();
    final days = [for (var i = 29; i >= 0; i--) today - i * kDay];
    final perDay = [for (final d in days) st.orders.where((o) => n(o['created']) >= d && n(o['created']) < d + kDay).length];
    final topP = <int, num>{}, topW = <int, int>{};
    for (final o in conf) {
      for (final i in l(o['items']).map(m)) {
        topP[ni(i['pid'])] = (topP[ni(i['pid'])] ?? 0) + n(i['q']) * n(i['price']);
      }
    }
    for (final o in list) {
      topW[ni(o['wilaya'])] = (topW[ni(o['wilaya'])] ?? 0) + 1;
    }
    final topProducts = (topP.entries.toList()..sort((a, b) => b.value.compareTo(a.value))).take(10);
    final topWilayas = (topW.entries.toList()..sort((a, b) => b.value.compareTo(a.value))).take(8);

    // alertes
    final low = st.lowStock().length, failed = st.orders.where((o) => o['status'] == 'failed').length, hard = st.hardCases().length;
    final noAgent = st.orders.where((o) => kConfSt.contains(o['status']) && o['agentId'] == null).length;
    final toConf = st.orders.where((o) => kConfSt.contains(o['status'])).length;
    final alerts = <Widget>[
      if (low > 0) AlertRow(Icons.inventory_2_outlined, kRed, '$low produit(s) en stock bas', 'Réapprovisionner ou créer un bon de commande', onTap: () => go('stock')),
      if (failed > 0) AlertRow(Icons.local_shipping_outlined, kRed, '$failed livraison(s) en échec', 'À rappeler ou à retourner', onTap: () => go('suivi')),
      if (hard > 0) AlertRow(Icons.flag_outlined, kAmber, '$hard cas difficile(s)', 'Injoignables répétés, remises à valider, refus', onTap: () => go('confirmer')),
      if (noAgent > 0) AlertRow(Icons.shuffle, kBlue, '$noAgent commande(s) sans agent', 'À répartir entre les agents', onTap: () => go('repartition')),
      if (toConf > 0) AlertRow(Icons.headset_mic_outlined, kBlue, '$toConf commande(s) à confirmer', 'En attente d\'appel', onTap: () => go('confirmer')),
    ];

    // trésorerie
    const boxColors = [kKraftD, kBlue, kAmber, kErpGreen];
    final sb = st.supplierBalance();
    final dues = st.supplierDues();

    final agents = st.agents;
    final recent = (st.orders.toList()..sort((a, b) => n(b['created']).compareTo(n(a['created'])))).take(8);

    return RefreshIndicator(
      onRefresh: st.syncNow,
      color: kOrange,
      child: ListView(padding: const EdgeInsets.fromLTRB(12, 14, 12, 24), children: [
        PageHead(
          'Vue globale : ventes, livraisons, trésorerie',
          trailing: Seg<String>(
            items: const [('0', 'Aujourd\'hui'), ('7', '7 jours'), ('30', '30 jours'), ('m', 'Ce mois')],
            value: _period,
            onChanged: (v) => setState(() => _period = v),
          ),
        ),
        KpiGrid([
          Kpi('Commandes reçues', '${list.length}', onTap: () => go('confirmer')),
          Kpi('Confirmées', '${conf.length}', sub: '${fmtPct(confRate)} de confirmation'),
          Kpi('Expédiées', '$ship', onTap: () => go('suivi')),
          Kpi('Livrées', '${deliv.length}', sub: '${fmtPct(delivRate)} · objectif 75 %', subColor: delivRate >= 75 ? kErpGreen : kRed),
          Kpi('Retours', '${rets.length}', sub: retLoss > 0 ? '${money(retLoss)} de pertes' : 'aucune perte', subColor: retLoss > 0 ? kRed : null),
          Kpi('CA livré', money(ca)),
          Kpi('Bénéfice net', money(net), sub: 'après fournisseur, livraison, pub, commissions', accent: true),
          Kpi('Panier moyen', money(avg)),
          Kpi('Gain d\'upsell', money(up), sub: '+${fmtPct(pct(up, upBase))}', subColor: kErpGreen),
          Kpi('Stock bas', '$low', onTap: () => go('stock'), subColor: low > 0 ? kRed : null, sub: low > 0 ? 'à réapprovisionner' : 'tout est en stock'),
        ]),
        const SizedBox(height: 12),
        _pair(
          Section(title: 'Commandes reçues — 30 jours', children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 14, 14, 4),
              child: BarChart(values: perDay, labels: [for (var i = 0; i < days.length; i++) i % 5 == 4 || i == days.length - 1 ? '${DateTime.fromMillisecondsSinceEpoch(days[i]).day}' : '']),
            ),
          ]),
          Section(
            title: 'Trésorerie',
            trailing: TextButton(onPressed: () => go('finance'), child: const Text('Finance')),
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(14, 12, 14, 4),
                child: KpiGrid(minWidth: 140, [for (var i = 0; i < st.cashboxes.length; i++) CashBox(s(st.cashboxes[i]['fr']), money(n(st.cashboxes[i]['balance'])), boxColors[i % boxColors.length])]),
              ),
              Row2('Argent chez la société de livraison', money(st.moneyAtDhd())),
              Row2('Argent en route (× taux de livraison)', money(st.moneyOnRoad())),
              Row2('Dû au fournisseur', money(sb.due), bold: true),
              if (dues.isNotEmpty) Row2('Prochaine échéance', '${money(dues.first.rest)} · ${fDate(dues.first.due)}'),
            ],
          ),
        ),
        const SizedBox(height: 12),
        _pair(
          Section(title: 'Entonnoir', children: [Funnel([('Reçues', list.length), ('Confirmées', conf.length), ('Expédiées', ship), ('Livrées', deliv.length), ('Payées', paid)])]),
          Section(
            title: 'Alertes',
            trailing: Padding(padding: const EdgeInsetsDirectional.only(end: 8), child: Pill('${alerts.length}', alerts.isEmpty ? kErpGreen : kRed)),
            children: alerts.isEmpty ? [const Empty('Aucune alerte')] : alerts,
          ),
        ),
        const SizedBox(height: 12),
        _pair(
          Section(title: 'Top 10 produits', children: [
            BarsList([for (final e in topProducts) (label: s(st.pby[e.key]?['name']).isEmpty ? 'Produit #${e.key}' : s(st.pby[e.key]!['name']), value: e.value, extra: '')], moneyFmt: true),
          ]),
          Section(title: 'Top wilayas', children: [
            BarsList([for (final e in topWilayas) (label: st.wName(e.key), value: e.value, extra: '${fmtPct(st.deliveryRate(st.orders.where((o) => ni(o['wilaya']) == e.key).toList()))} livr.')], color: kBlue),
          ]),
        ),
        const SizedBox(height: 12),
        Section(
          title: 'Performance des agents',
          trailing: TextButton(onPressed: () => go('repartition'), child: const Text('Répartition')),
          children: [
            if (agents.isEmpty) const Empty('Aucun agent', icon: Icons.people_outline),
            for (final a in agents) _AgentRow(a: a, p: st.agentPerf(a, list)),
          ],
        ),
        const SizedBox(height: 12),
        Section(
          title: 'Dernières commandes',
          trailing: TextButton(onPressed: () => go('suivi'), child: const Text('Tout voir')),
          children: [
            for (final o in recent)
              InkWell(
                onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => OrderScreen(store: st, id: ni(o['id'])))),
                child: Container(
                  padding: const EdgeInsets.fromLTRB(16, 10, 12, 10),
                  decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: kLine2))),
                  child: Row(children: [
                    Expanded(
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text('${s(o['ref'])} · ${s(st.customerOf(o)['name'])}', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
                        Text('${fDT(n(o['created']))} · ${st.wName(o['wilaya'])}', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, color: kErpMuted)),
                      ]),
                    ),
                    const SizedBox(width: 8),
                    Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                      Text(money(st.orderTotal(o)), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, fontFeatures: [FontFeature.tabularFigures()])),
                      const SizedBox(height: 3),
                      Pill(st.kLabel(o), st.kColor(o)),
                    ]),
                  ]),
                ),
              ),
          ],
        ),
      ]),
    );
  }
}

/// Une ligne du tableau « Performance des agents » du site, en version téléphone.
class _AgentRow extends StatelessWidget {
  const _AgentRow({required this.a, required this.p});
  final Doc a;
  final ({int total, int treated, int conf, int canc, double confRate, double upRate, double upAvg, int gain, int deliv, int ret, double delivRate, double firstCall, int pending, int commission, int attempts}) p;
  @override
  Widget build(BuildContext context) {
    final online = a['online'] == true && a['pause'] != true, pause = a['pause'] == true;
    Widget stat(String k, String v, [Color? c]) => Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(k, style: const TextStyle(fontSize: 11, color: kErpMuted, fontWeight: FontWeight.w600)),
            Text(v, style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: c ?? kErpInk, fontFeatures: const [FontFeature.tabularFigures()])),
          ]),
        );
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 10),
      decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: kLine2))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Row(children: [
          Expanded(child: Text(s(a['name']), maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5))),
          Pill(online ? 'En ligne' : pause ? 'En pause' : 'Hors ligne', online ? kErpGreen : pause ? kAmber : kErpMuted),
        ]),
        const SizedBox(height: 8),
        Row(children: [
          stat('Traitées', '${p.treated}'),
          stat('Confirmation', fmtPct(p.confRate)),
          stat('Upsell', fmtPct(p.upRate)),
          stat('Livraison', fmtPct(p.delivRate), p.delivRate >= 75 ? kErpGreen : kRed),
        ]),
      ]),
    );
  }
}
