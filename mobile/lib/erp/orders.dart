import 'package:flutter/material.dart';

import '../config.dart';
import '../theme.dart';
import 'docs.dart';
import 'rules.dart';
import 'store.dart';
import 'ui.dart';

/// Un onglet de liste de commandes : libellé + filtre.
typedef OrderTab = (String, bool Function(Doc));

/// Liste de commandes (à confirmer, ma file, suivi, préparation, expédition, retours…) : onglets, recherche,
/// carte par commande avec statut, client, produits, total. Un appui ouvre la commande.
class OrderListPage extends StatefulWidget {
  const OrderListPage({super.key, required this.store, required this.base, required this.tabs, this.sort, this.bulkReady = false, this.bulkSend = false});
  final ErpStore store;
  final List<Doc> Function() base;
  final List<OrderTab> tabs;
  final int Function(Doc, Doc)? sort;
  final bool bulkReady, bulkSend;
  @override
  State<OrderListPage> createState() => _OrderListPageState();
}

class _OrderListPageState extends State<OrderListPage> {
  int _tab = 0;
  String _q = '';
  bool _busy = false;

  bool _match(Doc o) {
    if (_q.isEmpty) return true;
    final s0 = widget.store, c = s0.customerOf(o), q = _q.toLowerCase(), qd = digits(_q);
    return s(o['ref']).toLowerCase().contains(q) || s(c['name']).toLowerCase().contains(q) ||
        (qd.isNotEmpty && digits(s(c['phone'])).contains(qd)) || s(o['commune']).toLowerCase().contains(q) ||
        s(o['tracking']).toLowerCase().contains(q) || s0.wName(o['wilaya']).toLowerCase().contains(q);
  }

  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    final all = widget.base();
    final tabs = widget.tabs;
    final tab = _tab.clamp(0, tabs.length - 1);
    final list = all.where(tabs[tab].$2).where(_match).toList()
      ..sort(widget.sort ?? (a, b) => n(b['created']).compareTo(n(a['created'])));
    return Column(children: [
      if (tabs.length > 1)
        SizedBox(
          height: 48,
          child: ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.fromLTRB(12, 8, 12, 0), children: [
            for (var i = 0; i < tabs.length; i++)
              Padding(
                padding: const EdgeInsetsDirectional.only(end: 6),
                child: ChoiceChip(
                  label: Text('${tabs[i].$1}  ${all.where(tabs[i].$2).length}'),
                  selected: i == tab,
                  onSelected: (_) => setState(() => _tab = i),
                  selectedColor: const Color(0xFFFFE3CF),
                  labelStyle: TextStyle(fontWeight: i == tab ? FontWeight.w800 : FontWeight.w600, color: kInk),
                ),
              ),
          ]),
        ),
      SearchField(hint: 'Rechercher : n°, client, téléphone, commune, suivi…', onChanged: (v) => setState(() => _q = v.trim())),
      if ((widget.bulkReady || widget.bulkSend) && list.isNotEmpty)
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 0, 12, 6),
          child: FilledButton.icon(
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(44)),
            icon: _busy ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)) : Icon(widget.bulkReady ? Icons.inventory_2_outlined : Icons.send_outlined),
            label: Text(widget.bulkReady ? 'Marquer prêtes (${list.length})' : 'Envoyer à la société de livraison (${list.length})'),
            onPressed: _busy ? null : () async {
              final ok = await confirmDialog(context, widget.bulkReady ? 'Marquer prêtes' : 'Envoyer en masse',
                  widget.bulkReady ? '${list.length} commande(s) passeront à « Prête » (colis emballé et pesé).' : '${list.length} commande(s) seront envoyées.');
              if (!ok || !context.mounted) return;
              if (widget.bulkReady) {
                for (final o in list) {
                  st.markReady(o);
                }
                toast(context, '${list.length} commande(s) prête(s)');
                return;
              }
              setState(() => _busy = true);
              final ko = await st.shipOrders(list);
              if (!mounted) return;
              setState(() => _busy = false);
              if (!context.mounted) return;
              final sent = list.length - ko.length;
              if (sent > 0) toast(context, '$sent colis envoyé(s)');
              if (ko.isNotEmpty) showErrors(context, 'Envois bloqués', ko);
            },
          ),
        ),
      Expanded(
        child: RefreshIndicator(
          onRefresh: st.syncNow,
          child: list.isEmpty
              ? ListView(children: const [Empty('Aucune commande ici')])
              : ListView.separated(
                  padding: const EdgeInsets.fromLTRB(12, 4, 12, 24),
                  itemCount: list.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 8),
                  itemBuilder: (c, i) => OrderCard(store: st, o: list[i]),
                ),
        ),
      ),
    ]);
  }
}

void showErrors(BuildContext context, String title, List<String> lines) => showDialog<void>(
      context: context,
      builder: (c) => AlertDialog(
        title: Text(title),
        content: SingleChildScrollView(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [for (final x in lines) Padding(padding: const EdgeInsets.only(bottom: 6), child: Text(x))])),
        actions: [FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c), child: const Text('Fermer'))],
      ),
    );

class OrderCard extends StatelessWidget {
  const OrderCard({super.key, required this.store, required this.o});
  final ErpStore store;
  final Doc o;
  @override
  Widget build(BuildContext context) {
    final st = store, c = st.customerOf(o);
    final items = l(o['items']).map((x) => '${ni(m(x)['q'])} × ${s(st.pby[ni(m(x)['pid'])]?['name']).isEmpty ? '?' : s(st.pby[ni(m(x)['pid'])]!['name'])}').join(' · ');
    final next = o['nextCall'] != null && kConfSt.contains(o['status']) ? ' · rappel ${fDT(n(o['nextCall']))}' : '';
    return Card(
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => OrderScreen(store: st, id: ni(o['id'])))),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Text(s(o['ref']), style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15)),
              const SizedBox(width: 8),
              Expanded(child: Align(alignment: AlignmentDirectional.centerStart, child: Pill(st.kLabel(o), st.kColor(o)))),
              const SizedBox(width: 8),
              Text(money(st.orderTotal(o)), style: const TextStyle(fontWeight: FontWeight.w900)),
            ]),
            const SizedBox(height: 8),
            Text(s(c['name']).isEmpty ? '—' : s(c['name']), style: const TextStyle(fontWeight: FontWeight.w700)),
            if (s(c['phone']).isNotEmpty) Text(s(c['phone']), textDirection: TextDirection.ltr, style: const TextStyle(color: kMuted)),
            const SizedBox(height: 4),
            Text([st.wName(o['wilaya']), s(o['commune'])].where((x) => x.isNotEmpty && x != '—').join(' · '), style: const TextStyle(fontSize: 13)),
            if (items.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 4), child: Text(items, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12.5, color: kMuted))),
            const SizedBox(height: 6),
            Text('${fDT(n(o['created']))}${s(o['platform']).isNotEmpty ? ' · ${s(o['platform'])}' : ''}${st.agentName(o['agentId']).isNotEmpty ? ' · ${st.agentName(o['agentId'])}' : ''}$next',
                style: const TextStyle(fontSize: 11.5, color: kMuted)),
          ]),
        ),
      ),
    );
  }
}

/// Fiche d'une commande : client, produits, totaux, livraison, historique, et les actions permises au rôle.
class OrderScreen extends StatefulWidget {
  const OrderScreen({super.key, required this.store, required this.id});
  final ErpStore store;
  final int id;
  @override
  State<OrderScreen> createState() => _OrderScreenState();
}

class _OrderScreenState extends State<OrderScreen> {
  ErpStore get st => widget.store;
  Doc get o => st.orderById(widget.id);
  final _note = TextEditingController();
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    _note.text = s(o['statusNote']);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (o.isNotEmpty) st.lockOrder(o); // comme l'ouverture de la fiche d'appel sur le site
    });
  }

  @override
  void dispose() {
    final x = o;
    // après le démontage de l'écran : libère la commande si aucun résultat n'a été choisi (unlockOrder du site)
    if (x.isNotEmpty && x['lockedBy'] == st.uidMe) Future.microtask(() => st.unlockOrder(x));
    _note.dispose();
    super.dispose();
  }

  Future<void> _conf(Doc d) async {
    final x = o;
    int? at;
    var cbNote = '';
    if (d['kind'] == 'callback') {
      final r = await _pickCallback();
      if (r == null) return;
      (at, cbNote) = r;
    }
    if (!mounted) return;
    if (d['kind'] == 'cancel' && !await confirmDialog(context, 'Annuler la commande', '${s(x['ref'])} : ${s(d['label'])}', ok: 'Confirmer l\'annulation', danger: true)) return;
    final err = st.confApply(x, s(d['id']), note: _note.text.trim().isEmpty ? null : _note.text.trim(), callbackAt: at, callbackNote: cbNote);
    if (!mounted) return;
    if (err != null) {
      toast(context, err, bad: true);
      return;
    }
    toast(context, '${s(x['ref'])} : ${s(d['label'])}');
    if (['confirm', 'cancel', 'callback', 'fail'].contains(d['kind'])) Navigator.of(context).maybePop();
  }

  Future<(int, String)?> _pickCallback() async {
    final now0 = DateTime.now().add(const Duration(hours: 2));
    final date = await showDatePicker(context: context, initialDate: now0, firstDate: DateTime.now().subtract(const Duration(days: 1)), lastDate: DateTime.now().add(const Duration(days: 365)));
    if (date == null || !mounted) return null;
    final time = await showTimePicker(context: context, initialTime: TimeOfDay.fromDateTime(now0));
    if (time == null || !mounted) return null;
    final note = await textDialog(context, 'Note du rappel', hint: 'Ex. : rappeler après 17h, gérant absent', ok: 'Programmer');
    if (note == null) return null;
    return (DateTime(date.year, date.month, date.day, time.hour, time.minute).millisecondsSinceEpoch, note);
  }

  Future<void> _addProduct() async {
    final p = await showModalBottomSheet<Doc>(context: context, isScrollControlled: true, builder: (_) => ProductPicker(store: st));
    if (p == null || !mounted) return;
    st.addLine(o, p);
    toast(context, 'Ajouté : ${s(p['name'])}');
  }

  Future<void> _ship() async {
    setState(() => _busy = true);
    final ko = await st.shipOrders([o]);
    if (!mounted) return;
    setState(() => _busy = false);
    if (ko.isEmpty) {
      toast(context, '${s(o['ref'])} envoyée');
    } else {
      showErrors(context, 'Envoi bloqué', ko);
    }
  }

  Future<void> _shipStatus() async {
    const opts = ['picked', 'transit', 'outfor', 'failed', 'delivered', 'returning', 'returned'];
    final v = await showModalBottomSheet<String>(
      context: context,
      builder: (c) => SafeArea(child: ListView(shrinkWrap: true, children: [
        const ListTile(title: Text('Changer le statut de livraison', style: TextStyle(fontWeight: FontWeight.w800))),
        for (final k in opts) ListTile(leading: Icon(Icons.circle, size: 12, color: hex(kStep[k]!.$2)), title: Text(kStep[k]!.$1), selected: o['status'] == k, onTap: () => Navigator.pop(c, k)),
      ])),
    );
    if (v == null || !mounted) return;
    st.setShipStatus(o, v);
    toast(context, '${s(o['ref'])} → ${st.stName(v, o)}');
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: st,
      builder: (context, _) {
        final x = o;
        if (x.isEmpty) return Scaffold(appBar: AppBar(), body: const Empty('Commande introuvable', icon: Icons.search_off));
        final c = st.customerOf(x), status = s(x['status']);
        final canConf = kPreSt.contains(status) && st.kCanConf(x);
        final editable = kConfSt.contains(status) && st.kCanConf(x);
        final cur = st.confDef(x);
        final cr = st.carrierOf(x);
        final phone = s(c['phone']);
        final isLv = st.role == 'livreur';
        return Scaffold(
          appBar: AppBar(title: Text(s(x['ref']), style: const TextStyle(fontWeight: FontWeight.w900)), actions: [
            if (phone.isNotEmpty && !isLv) IconButton(tooltip: 'WhatsApp', onPressed: () => openUrl(waUrl(phone)), icon: const Icon(Icons.chat_outlined)),
            if (st.role == 'admin')
              PopupMenuButton<String>(
                tooltip: 'Documents',
                icon: const Icon(Icons.receipt_long_outlined),
                onSelected: (t) => openDocument(context, st, x, t),
                itemBuilder: (_) => [for (final e in kDocTypes.entries) PopupMenuItem(value: e.key, child: Text('${e.value.label}${m(x['docs'])[e.key] != null ? ' · ${s(m(m(x['docs'])[e.key])['no'])}' : ''}'))],
              ),
          ]),
          body: ListView(padding: const EdgeInsets.fromLTRB(12, 12, 12, 120), children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [Flexible(child: Pill(st.kLabel(x), st.kColor(x), selected: true)), const SizedBox(width: 10), Text(money(st.orderTotal(x)), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900))]),
                  const SizedBox(height: 8),
                  Text('Créée le ${fDT(n(x['created']))}${s(x['platform']).isNotEmpty ? ' · Source : ${s(x['platform'])}' : ''}${s(x['source']).isNotEmpty ? ' · ${s(x['source'])}' : ''}', style: const TextStyle(color: kMuted, fontSize: 12.5)),
                  if (x['nextCall'] != null && kConfSt.contains(status)) Text('Rappel : ${fDT(n(x['nextCall']))}', style: const TextStyle(color: kOrange, fontWeight: FontWeight.w700, fontSize: 12.5)),
                  if (s(x['cancelReason']).isNotEmpty && status == 'cancelled') Text('Motif : ${s(x['cancelReason'])}', style: const TextStyle(color: kRed, fontSize: 12.5)),
                ]),
              ),
            ),
            const SizedBox(height: 10),
            Section(title: 'Client', children: [
              Row2('Nom complet', s(c['name'])),
              Row2('Téléphone', phone, ltr: true),
              if (s(c['phone2']).isNotEmpty) Row2('Téléphone 2', s(c['phone2']), ltr: true),
              Row2('Adresse', s(x['address'])),
              Row2('Wilaya', st.wName(x['wilaya'])),
              Row2('Commune', s(x['commune'])),
              Row2('Type de livraison', x['delivery'] == 'home' ? 'Domicile' : 'Bureau'),
              if (phone.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.fromLTRB(12, 6, 12, 4),
                  child: Wrap(spacing: 8, runSpacing: 8, children: [
                    FilledButton.icon(
                      style: FilledButton.styleFrom(minimumSize: const Size(0, 42)),
                      onPressed: () {
                        if (!isLv && st.kCanConf(x)) st.logCall(x);
                        callPhone(phone);
                      },
                      icon: const Icon(Icons.phone, size: 18), label: const Text('Appeler'),
                    ),
                    OutlinedButton.icon(style: OutlinedButton.styleFrom(minimumSize: const Size(0, 42)), onPressed: () => openUrl(waUrl(phone)), icon: const Icon(Icons.chat_outlined, size: 18), label: const Text('WhatsApp')),
                    OutlinedButton.icon(style: OutlinedButton.styleFrom(minimumSize: const Size(0, 42)), onPressed: () => openUrl('sms:${digits(phone)}'), icon: const Icon(Icons.sms_outlined, size: 18), label: const Text('SMS')),
                    if (isLv || kShipSt.contains(status))
                      OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(minimumSize: const Size(0, 42)),
                        onPressed: () => openUrl('https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent([s(x['address']), s(x['commune']), st.wName(x['wilaya']), 'Algérie'].where((e) => e.isNotEmpty).join(', '))}'),
                        icon: const Icon(Icons.route_outlined, size: 18), label: const Text('Itinéraire'),
                      ),
                  ]),
                ),
            ]),
            const SizedBox(height: 10),
            Section(
              title: 'Produits',
              trailing: editable ? TextButton.icon(onPressed: _addProduct, icon: const Icon(Icons.add), label: const Text('Ajouter')) : null,
              children: [
                for (var i = 0; i < l(x['items']).length; i++) _line(x, i, editable),
                const Divider(height: 18),
                Row2('Sous-total', money(st.orderSub(x))),
                if (st.discountAmt(x) > 0) Row2('Remise', '− ${money(st.discountAmt(x))}'),
                Row2('Livraison', x['freeShip'] == true ? 'Gratuite' : money(st.feeOf(x))),
                Row2('Poids', '${st.orderWeight(x).toString().replaceAll('.', ',')} kg'),
                Row2('Total', money(st.orderTotal(x)), bold: true),
                if (editable)
                  Padding(
                    padding: const EdgeInsets.fromLTRB(12, 8, 12, 4),
                    child: SegmentedButton<String>(
                      segments: const [ButtonSegment(value: 'home', label: Text('Domicile')), ButtonSegment(value: 'desk', label: Text('Bureau'))],
                      selected: {x['delivery'] == 'home' ? 'home' : 'desk'},
                      onSelectionChanged: (v) => st.setDelivery(x, v.first),
                    ),
                  ),
              ],
            ),
            if (s(x['note']).isNotEmpty) ...[const SizedBox(height: 10), Section(title: 'Remarques', children: [Padding(padding: const EdgeInsets.fromLTRB(14, 4, 14, 6), child: Text(s(x['note'])))])],
            const SizedBox(height: 10),
            if (canConf)
              Section(title: 'Statut de confirmation', children: [
                if (s(x['statusNote']).isNotEmpty) Padding(padding: const EdgeInsets.fromLTRB(14, 0, 14, 6), child: Text(s(x['statusNote']), style: const TextStyle(color: kMuted))),
                Padding(
                  padding: const EdgeInsets.fromLTRB(12, 4, 12, 8),
                  child: Wrap(spacing: 8, runSpacing: 8, children: [
                    for (final d in st.kList('conf')) Pill(s(d['label']), hex(s(d['color'])), selected: d['id'] == cur['id'], onTap: () => _conf(d)),
                  ]),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(12, 0, 12, 4),
                  child: Row(children: [
                    Expanded(child: TextField(controller: _note, decoration: const InputDecoration(hintText: 'Note du statut (facultatif)', isDense: true))),
                    const SizedBox(width: 8),
                    OutlinedButton(style: OutlinedButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () {
                      st.saveStatusNote(x, _note.text.trim());
                      toast(context, 'Note enregistrée');
                    }, child: const Text('Enregistrer')),
                  ]),
                ),
              ]),
            if (!isLv) ...[
              const SizedBox(height: 10),
              Section(title: 'Livraison', children: [
                Row2('Société de livraison', st.carrierName(cr)),
                if (x['courierId'] != null) Row2('Livreur', s(st.cub[ni(x['courierId'])]?['name'])),
                Row2('Numéro de suivi', s(x['tracking']), ltr: true),
                Row2('Finance', s(st.finDef(x)['label'])),
                Row2('Confirmé par', st.agentName(x['agentId'])),
              ]),
            ],
            if (l(x['attempts']).isNotEmpty) ...[
              const SizedBox(height: 10),
              Section(title: 'Tentatives de livraison', children: [
                for (final a in l(x['attempts']).map(m))
                  ListTile(dense: true, leading: const Icon(Icons.error_outline, color: kRed), title: Text('${ni(a['n'])}. ${failName(s(a['reason']))}'), subtitle: Text('${fDT(n(a['at']))}${s(a['comment']).isNotEmpty ? ' — ${s(a['comment'])}' : ''}')),
              ]),
            ],
            const SizedBox(height: 10),
            Section(title: 'Historique', children: [
              for (final h in l(x['history']).reversed.map(m))
                ListTile(
                  dense: true,
                  leading: Icon(Icons.circle, size: 12, color: _histColor(s(h['color']))),
                  title: Text(s(h['action']), style: const TextStyle(fontWeight: FontWeight.w700)),
                  subtitle: Text('${fDT(n(h['at']))} · ${s(h['who'])}${s(h['note']).isNotEmpty ? '\n${s(h['note'])}' : ''}'),
                ),
              if (l(x['history']).isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('—')),
            ]),
          ]),
          bottomNavigationBar: _actions(x, status),
        );
      },
    );
  }

  Widget _line(Doc x, int i, bool editable) {
    final it = m(l(x['items'])[i]), p = st.pby[ni(it['pid'])] ?? {};
    final v = it['v'] != null ? l(p['variants']).map(m).where((y) => s(y['id']) == s(it['v'])).firstOrNull : null;
    final img = l(p['images']).isNotEmpty ? absUrl(s(l(p['images']).first)) : '';
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 12),
      leading: ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: SizedBox(width: 44, height: 44, child: img.isEmpty ? const ColoredBox(color: Color(0xFFFFF1E6), child: Icon(Icons.inventory_2_outlined, color: kOrange)) : Image.network(img, fit: BoxFit.cover, errorBuilder: (_, _, _) => const Icon(Icons.image_not_supported_outlined))),
      ),
      title: Text('${s(p['name']).isEmpty ? '—' : s(p['name'])}${v != null ? ' (${s(v['label'])})' : ''}', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13.5)),
      subtitle: Text('${money(n(it['price']))} × ${ni(it['q'])} = ${money(n(it['price']) * n(it['q']))}${it['up'] == true ? ' · upsell' : ''}'),
      trailing: editable
          ? Row(mainAxisSize: MainAxisSize.min, children: [
              IconButton(visualDensity: VisualDensity.compact, onPressed: () => st.lineQty(x, i, -1), icon: const Icon(Icons.remove_circle_outline)),
              IconButton(visualDensity: VisualDensity.compact, onPressed: () => st.lineQty(x, i, 1), icon: const Icon(Icons.add_circle_outline)),
              IconButton(visualDensity: VisualDensity.compact, onPressed: () {
                final e = st.lineDel(x, i);
                if (e != null) toast(context, e, bad: true);
              }, icon: const Icon(Icons.close, color: kRed)),
            ])
          : null,
    );
  }

  Widget? _actions(Doc x, String status) {
    final btns = <Widget>[];
    Widget btn(String label, IconData icon, VoidCallback? f, {Color? bg, Color? fg}) => Expanded(
          child: FilledButton.icon(
            style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48), backgroundColor: bg, foregroundColor: fg, padding: const EdgeInsets.symmetric(horizontal: 8)),
            onPressed: _busy ? null : f, icon: Icon(icon, size: 18), label: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis),
          ),
        );
    if (st.role == 'livreur') {
      if (kLvTodo.contains(status)) {
        if (status != 'outfor') btns.add(btn('Je pars', Icons.local_shipping_outlined, () => st.lvGo(x), bg: kInk, fg: Colors.white));
        btns.add(btn('Échec', Icons.close, () => lvFailDialog(context, st, x), bg: kRed, fg: Colors.white));
        btns.add(btn('Livrée', Icons.check, () => lvDoneDialog(context, st, x), bg: kGreen, fg: Colors.white));
      }
    } else if (st.kCanShip) {
      if (status == 'toprep') btns.add(btn('Marquer prête', Icons.inventory_2_outlined, () => st.markReady(x), bg: kInk, fg: Colors.white));
      if (status == 'toprep' || status == 'ready') btns.add(btn('Envoyer', Icons.send_outlined, _ship));
      if (['sent', 'picked', 'transit', 'outfor', 'failed', 'delivered', 'returning'].contains(status)) btns.add(btn('Statut de livraison', Icons.local_shipping_outlined, _shipStatus));
      if (status == 'returning') btns.add(btn('Réceptionner', Icons.undo, () => receiveReturnDialog(context, st, x), bg: kInk, fg: Colors.white));
    }
    if (btns.isEmpty) return null;
    return SafeArea(child: Padding(padding: const EdgeInsets.fromLTRB(12, 8, 12, 8), child: Row(children: [for (var i = 0; i < btns.length; i++) ...[if (i > 0) const SizedBox(width: 8), btns[i]]])));
  }
}

Color _histColor(String c) => {'red': const Color(0xFFE23024), 'green': const Color(0xFF2FBF4A), 'amber': const Color(0xFFFFA447), 'blue': const Color(0xFF4A90C2), 'kraft': kOrange}[c] ?? const Color(0xFF80BCBD);

Future<void> receiveReturnDialog(BuildContext context, ErpStore st, Doc o) async {
  final intact = await showDialog<bool>(
    context: context,
    builder: (c) => SimpleDialog(title: Text('Réception du retour ${s(o['ref'])}'), children: [
      SimpleDialogOption(onPressed: () => Navigator.pop(c, true), child: const Padding(padding: EdgeInsets.all(6), child: Text('Intact — réintégrer en stock'))),
      SimpleDialogOption(onPressed: () => Navigator.pop(c, false), child: const Padding(padding: EdgeInsets.all(6), child: Text('Abîmé — passer en casse'))),
    ]),
  );
  if (intact == null) return;
  st.receiveReturn(o, intact);
  if (context.mounted) toast(context, '${s(o['ref'])} : retour réceptionné');
}

Future<void> lvDoneDialog(BuildContext context, ErpStore st, Doc o) async {
  final note = await textDialog(context, 'Livrée · ${s(o['ref'])} — ${money(st.orderTotal(o))} encaissés', hint: 'Remarque (facultatif)', ok: 'Confirmer : livrée et encaissée');
  if (note == null) return;
  st.lvDone(o, note);
  if (context.mounted) toast(context, '${s(o['ref'])} : livrée');
}

Future<void> lvFailDialog(BuildContext context, ErpStore st, Doc o) async {
  var reason = kFailReasons.first.$1;
  final comment = TextEditingController();
  final ok = await showDialog<bool>(
    context: context,
    builder: (c) => StatefulBuilder(builder: (c, set) => AlertDialog(
          title: Text('Livraison impossible · ${s(o['ref'])}'),
          content: Column(mainAxisSize: MainAxisSize.min, children: [
            DropdownButtonFormField<String>(
              initialValue: reason, isExpanded: true, decoration: const InputDecoration(labelText: 'Motif'),
              items: [for (final f in kFailReasons) DropdownMenuItem(value: f.$1, child: Text(f.$2))],
              onChanged: (v) => set(() => reason = v ?? reason),
            ),
            const SizedBox(height: 10),
            TextField(controller: comment, minLines: 2, maxLines: 4, decoration: const InputDecoration(labelText: 'Commentaire', hintText: 'Ex. client absent, rappeler après 17 h')),
          ]),
          actions: [
            TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Annuler')),
            FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44), backgroundColor: kRed, foregroundColor: Colors.white), onPressed: () => Navigator.pop(c, true), child: const Text('Enregistrer l\'échec')),
          ],
        )),
  );
  final text = comment.text.trim();
  comment.dispose();
  if (ok != true) return;
  st.lvFail(o, reason, text);
  if (context.mounted) toast(context, '${s(o['ref'])} : échec enregistré');
}

/// Choix d'un produit à ajouter à une commande (upsell sur l'écran d'appel).
class ProductPicker extends StatefulWidget {
  const ProductPicker({super.key, required this.store});
  final ErpStore store;
  @override
  State<ProductPicker> createState() => _ProductPickerState();
}

class _ProductPickerState extends State<ProductPicker> {
  String _q = '';
  @override
  Widget build(BuildContext context) {
    final list = widget.store.products.where((p) => n(p['price']) > 0 && p['status'] == 'actif' && (_q.isEmpty || s(p['name']).toLowerCase().contains(_q) || s(p['sku']).toLowerCase().contains(_q))).toList();
    return DraggableScrollableSheet(
      expand: false, initialChildSize: .85,
      builder: (c, sc) => Column(children: [
        SearchField(hint: 'Rechercher un produit…', onChanged: (v) => setState(() => _q = v.trim().toLowerCase())),
        Expanded(child: ListView.builder(
          controller: sc, itemCount: list.length,
          itemBuilder: (c, i) {
            final p = list[i], si = widget.store.stockInfo(ni(p['id']));
            return ListTile(title: Text(s(p['name'])), subtitle: Text('${money(n(p['price']))} · dispo ${si.available}'), trailing: const Icon(Icons.add_circle_outline, color: kOrange), onTap: () => Navigator.pop(context, p));
          },
        )),
      ]),
    );
  }
}
