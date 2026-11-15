import 'dart:math';

import 'package:flutter/material.dart';

import '../theme.dart';
import 'net.dart';
import 'orders.dart';
import 'pages.dart';
import 'rules.dart';
import 'rules2.dart';
import 'store.dart';
import 'ui.dart';

/// Écrans d'administration natifs : Livraison, Pixels, Modules, Répartition, Classement, Paramètres, Statistiques.

// ---------- petits outils de saisie ----------
Future<num?> numDialog(BuildContext context, String title, num current, {bool decimal = false}) async {
  final t = TextEditingController(text: current == current.roundToDouble() ? '${current.round()}' : '$current');
  final r = await showDialog<String>(
    context: context,
    builder: (c) => AlertDialog(
      title: Text(title),
      content: TextField(controller: t, autofocus: true, keyboardType: TextInputType.numberWithOptions(decimal: decimal, signed: true)),
      actions: [
        TextButton(onPressed: () => Navigator.pop(c), child: const Text('Annuler')),
        FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, t.text.trim().replaceAll(',', '.')), child: const Text('Enregistrer')),
      ],
    ),
  );
  t.dispose();
  if (r == null) return null;
  final v = num.tryParse(r);
  if (v == null && context.mounted) toast(context, 'Nombre invalide', bad: true);
  return v;
}

class NumTile extends StatelessWidget {
  const NumTile(this.label, this.value, this.onSave, {super.key, this.suffix = '', this.decimal = false, this.enabled = true});
  final String label, suffix;
  final num value;
  final ValueChanged<num> onSave;
  final bool decimal, enabled;
  @override
  Widget build(BuildContext context) => ListTile(
        dense: true,
        enabled: enabled,
        title: Text(label),
        trailing: Text('${value == value.roundToDouble() ? value.round() : value}$suffix', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
        onTap: () async {
          final v = await numDialog(context, label, value, decimal: decimal);
          if (v != null) onSave(v);
        },
      );
}

class TextTile extends StatelessWidget {
  const TextTile(this.label, this.value, this.onSave, {super.key, this.lines = 1, this.enabled = true});
  final String label, value;
  final ValueChanged<String> onSave;
  final int lines;
  final bool enabled;
  @override
  Widget build(BuildContext context) => ListTile(
        dense: true,
        enabled: enabled,
        title: Text(label),
        subtitle: Text(value.isEmpty ? '—' : value, maxLines: 3, overflow: TextOverflow.ellipsis),
        trailing: const Icon(Icons.edit_outlined, size: 18),
        onTap: () async {
          final v = await textDialog(context, label, initial: value, lines: lines);
          if (v != null) onSave(v);
        },
      );
}

/// Onglets en haut d'une page de l'ERP.
class Tabbed extends StatelessWidget {
  const Tabbed({super.key, required this.tabs});
  final List<(String, Widget)> tabs;
  @override
  Widget build(BuildContext context) => DefaultTabController(
        length: tabs.length,
        child: Column(children: [
          Material(
            color: Colors.white,
            child: TabBar(isScrollable: true, tabAlignment: TabAlignment.start, labelColor: kInk, indicatorColor: kOrange, labelStyle: const TextStyle(fontWeight: FontWeight.w800), tabs: [for (final t in tabs) Tab(text: t.$1)]),
          ),
          Expanded(child: TabBarView(children: [for (final t in tabs) t.$2])),
        ]),
      );
}

// ============================================================ Livraison

class DeliveryPage extends StatelessWidget {
  const DeliveryPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) => Tabbed(tabs: [
        ('Sociétés de livraison', _Carriers(store: store)),
        ('Livreurs', _Couriers(store: store)),
        ('Règles d\'attribution', _CarrierRules(store: store)),
        ('Tarifs par wilaya', _Fees(store: store)),
      ]);
}

class _Carriers extends StatelessWidget {
  const _Carriers({required this.store});
  final ErpStore store;

  String _state(Doc c, List<Doc> cat) {
    if (c['connected'] != true) return 'Désactivée';
    if (c['internal'] == true) return 'Vos livreurs';
    final x = cat.where((y) => y['id'] == c['id']).firstOrNull;
    if (x != null && x['api'] == true && s(m(c['creds'])['token']).isNotEmpty) return c['apiOk'] == false ? 'Clés refusées' : c['apiOk'] == true ? 'Reliée par API' : 'Clés à tester';
    return 'Suivi manuel';
  }

  @override
  Widget build(BuildContext context) {
    final st = store;
    return FutureBuilder<List<Doc>>(
      future: _catalog(st),
      builder: (context, snap) {
        final cat = snap.data ?? const [];
        return ListView(padding: const EdgeInsets.all(12), children: [
          const Text('Ajoutez votre société, collez ses clés API puis « Enregistrer et tester la connexion ». Le colis est alors créé chez elle à l\'expédition. Liaison API disponible pour Yalidine, EcoTrack (dont DHD) et Noest.', style: TextStyle(color: kMuted, fontSize: 12.5)),
          const SizedBox(height: 8),
          FilledButton.icon(onPressed: cat.isEmpty ? null : () => _pick(context, st, cat), icon: const Icon(Icons.add), label: const Text('Ajouter une société')),
          const SizedBox(height: 10),
          for (final c in st.c['carriers']!) Padding(padding: const EdgeInsets.only(bottom: 10), child: _CarrierCard(store: st, c: c, cat: cat, state: _state(c, cat))),
        ]);
      },
    );
  }

  static List<Doc>? _cache;
  static Future<List<Doc>> _catalog(ErpStore st) async {
    if (_cache != null) return _cache!;
    try {
      final j = await st.net.call('carrier.catalog');
      _cache = l(m(j)['catalog']).map(m).toList();
    } catch (_) {
      _cache = null;
      return [];
    }
    return _cache!;
  }

  Future<void> _pick(BuildContext context, ErpStore st, List<Doc> cat) async {
    final list = cat.where((x) => !st.crb.containsKey(s(x['id'])) && x['family'] != 'internal').toList();
    final x = await showModalBottomSheet<Doc>(context: context, isScrollControlled: true, builder: (_) => _CatalogPicker(list: list));
    if (x == null) return;
    st.c['carriers']!.add({
      'id': x['id'], 'name': x['name'], 'short': s(x['name']).replaceAll(RegExp(r'[^A-Za-z0-9]'), '').padRight(3).substring(0, 3).trim().toUpperCase(), 'family': x['family'], 'logo': x['logo'],
      'connected': true, 'isDefault': false, 'creds': <String, dynamic>{}, 'feeFactor': 1, 'baseKg': 5, 'extraPerKg': 50, 'maxParcelKg': 20, 'chargeOverweight': true, 'desk': true, 'cod': true, 'sync': 15, 'color': '#8E6339',
    });
    st.log('Société ajoutée', s(x['name']));
    st.reindex();
    st.touch();
    if (context.mounted) toast(context, '${s(x['name'])} : ${x['api'] == true ? 'ajoutée — collez ses clés API' : 'ajoutée (suivi manuel)'}');
  }
}

class _CatalogPicker extends StatefulWidget {
  const _CatalogPicker({required this.list});
  final List<Doc> list;
  @override
  State<_CatalogPicker> createState() => _CatalogPickerState();
}

class _CatalogPickerState extends State<_CatalogPicker> {
  String _q = '';
  @override
  Widget build(BuildContext context) {
    final list = widget.list.where((x) => _q.isEmpty || s(x['name']).toLowerCase().contains(_q)).toList();
    return DraggableScrollableSheet(
      expand: false, initialChildSize: .85,
      builder: (c, sc) => Column(children: [
        SearchField(hint: 'Rechercher parmi ${widget.list.length} sociétés…', onChanged: (v) => setState(() => _q = v.trim().toLowerCase())),
        Expanded(child: ListView.builder(controller: sc, itemCount: list.length, itemBuilder: (c, i) => ListTile(
              title: Text(s(list[i]['name'])), subtitle: Text(list[i]['api'] == true ? 'Liaison API' : 'Suivi manuel', style: TextStyle(color: list[i]['api'] == true ? kGreen : kMuted)),
              trailing: const Icon(Icons.add_circle_outline, color: kOrange), onTap: () => Navigator.pop(context, list[i]),
            ))),
      ]),
    );
  }
}

class _CarrierCard extends StatefulWidget {
  const _CarrierCard({required this.store, required this.c, required this.cat, required this.state});
  final ErpStore store;
  final Doc c;
  final List<Doc> cat;
  final String state;
  @override
  State<_CarrierCard> createState() => _CarrierCardState();
}

class _CarrierCardState extends State<_CarrierCard> {
  bool _open = false, _busy = false;
  @override
  Widget build(BuildContext context) {
    final st = widget.store, c = widget.c, id = s(c['id']);
    final x = widget.cat.where((y) => y['id'] == id).firstOrNull;
    final api = x != null && x['api'] == true;
    void set(String k, Object v) {
      c[k] = v;
      st.touch();
    }
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Row(children: [
            Expanded(child: Text(st.carrierName(c), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15))),
            if (c['isDefault'] == true) const Padding(padding: EdgeInsets.only(right: 6), child: Pill('Par défaut', kOrange)),
            Pill(widget.state, widget.state.contains('API') || widget.state == 'Vos livreurs' ? kGreen : widget.state == 'Désactivée' ? kMuted : const Color(0xFFE8A33D)),
          ]),
          const SizedBox(height: 4),
          Text(c['internal'] == true ? 'Vos propres livreurs' : c['desk'] == true ? 'Domicile + bureau (stop desk)' : 'Domicile uniquement', style: const TextStyle(color: kMuted, fontSize: 12)),
          if (api) ...[
            for (final f in l(x['fields']))
              TextTile(s((f as List)[1]), s(m(c['creds'])[s(f[0])]), (v) {
                c['creds'] = {...m(c['creds']), s(f[0]): v.trim()};
                c['apiOk'] = null;
                st.touch();
              }),
            FilledButton.icon(
              style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(42)),
              onPressed: _busy ? null : () async {
                if (s(m(c['creds'])['token']).isEmpty) {
                  toast(context, 'Collez d\'abord les clés API', bad: true);
                  return;
                }
                setState(() => _busy = true);
                await st.syncNow(); // les clés doivent être enregistrées avant que le serveur les essaie
                try {
                  await st.net.call('carrier.test', {'id': id});
                  c['apiOk'] = true;
                  c['connected'] = true;
                  if (context.mounted) toast(context, '${s(c['name'])} : connexion réussie');
                } on ErpError catch (e) {
                  c['apiOk'] = false;
                  if (context.mounted) toast(context, e.message, bad: true);
                }
                c['lastSync'] = now();
                st.touch();
                if (mounted) setState(() => _busy = false);
              },
              icon: const Icon(Icons.bolt), label: const Text('Enregistrer et tester la connexion'),
            ),
          ] else if (c['internal'] != true)
            const Padding(padding: EdgeInsets.symmetric(vertical: 6), child: Text('Pas de liaison API : saisissez le numéro de suivi et changez le statut à la main.', style: TextStyle(color: kMuted, fontSize: 12.5))),
          if (_open) ...[
            NumTile('Poids inclus (kg)', n(c['baseKg']), (v) => set('baseKg', v), decimal: true),
            NumTile('Prix par kg en plus (DZD)', n(c['extraPerKg']), (v) => set('extraPerKg', v)),
            NumTile('Poids max par colis (kg)', n(c['maxParcelKg']), (v) => set('maxParcelKg', v)),
            NumTile('Coefficient tarifaire', n(c['feeFactor']), (v) => set('feeFactor', v), decimal: true),
            SwitchListTile(dense: true, value: c['chargeOverweight'] == true, onChanged: (v) => set('chargeOverweight', v), title: const Text('Facturer le surpoids au client')),
            if (c['internal'] != true) SwitchListTile(dense: true, value: c['desk'] == true, onChanged: (v) => set('desk', v), title: const Text('Propose le bureau (stop desk)')),
          ],
          Wrap(spacing: 6, runSpacing: 6, children: [
            TextButton.icon(onPressed: () => setState(() => _open = !_open), icon: const Icon(Icons.tune, size: 18), label: Text(_open ? 'Masquer poids et tarifs' : 'Poids et tarifs')),
            if (c['connected'] == true && c['internal'] != true)
              TextButton(onPressed: () {
                if (c['isDefault'] == true) {
                  c['isDefault'] = false;
                } else {
                  for (final k in st.c['carriers']!) {
                    k['isDefault'] = k['id'] == id;
                  }
                }
                st.touch();
              }, child: Text(c['isDefault'] == true ? 'Retirer « par défaut »' : 'Définir par défaut')),
            if (c['connected'] == true)
              TextButton(onPressed: () {
                c['connected'] = false;
                c['isDefault'] = false;
                st.touch();
              }, child: const Text('Désactiver'))
            else
              TextButton(onPressed: () {
                c['connected'] = true;
                st.log('Société activée', s(c['name']));
                st.touch();
              }, child: const Text('Activer')),
            if (c['internal'] != true)
              TextButton(style: TextButton.styleFrom(foregroundColor: kRed), onPressed: () async {
                if (st.orders.any((o) => o['carrier'] == id && kShipSt.contains(o['status']) && !['paid', 'closed'].contains(o['status']))) {
                  toast(context, 'Des colis de cette société sont en cours : désactivez-la plutôt.', bad: true);
                  return;
                }
                if (!await confirmDialog(context, 'Retirer la société', s(c['name']), ok: 'Retirer', danger: true)) return;
                for (final o in st.orders.where((o) => o['carrier'] == id && kPreSt.contains(o['status']))) {
                  o['carrier'] = '';
                }
                st.c['carriers']!.remove(c);
                st.settings['carrierRules'] = l(st.settings['carrierRules']).where((r) => m(r)['carrier'] != id).toList();
                st.reindex();
                st.touch();
              }, child: const Text('Retirer')),
          ]),
        ]),
      ),
    );
  }
}

class _Couriers extends StatelessWidget {
  const _Couriers({required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, today = dayStart();
    final jobs = st.orders.where((o) => st.carrierOf(o)['internal'] == true && kShipRoad.contains(o['status'])).toList();
    final canEdit = st.role == 'admin' || st.role == 'gerant';
    return ListView(padding: const EdgeInsets.all(12), children: [
      if (canEdit) FilledButton.icon(onPressed: () => courierEdit(context, st, null), icon: const Icon(Icons.add), label: const Text('Ajouter un livreur')),
      const SizedBox(height: 10),
      for (final cu in st.c['couriers']!)
        Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Row(children: [
                Expanded(child: Text(s(cu['name']), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15))),
                if (canEdit) IconButton(onPressed: () => courierEdit(context, st, cu), icon: const Icon(Icons.edit_outlined)),
              ]),
              Text('${s(cu['phone'])} · ${s(cu['vehicle'])} · ${money(n(cu['perDelivery']))} / livraison', style: const TextStyle(color: kMuted, fontSize: 12.5)),
              Text('Zones : ${l(cu['zones']).map((w) => st.wName(w)).join(', ')}', style: const TextStyle(fontSize: 12.5)),
              const SizedBox(height: 6),
              Row(children: [
                Expanded(child: Text('En cours ${jobs.where((o) => ni(o['courierId']) == ni(cu['id'])).length} · livrées aujourd\'hui ${st.orders.where((o) => ni(o['courierId']) == ni(cu['id']) && n(m(o['times'])['delivered']) >= today).length}\nArgent en main : ${money(st.courierCash(ni(cu['id'])))}', style: const TextStyle(fontSize: 12.5))),
                SegmentedButton<bool>(
                  showSelectedIcon: false,
                  segments: const [ButtonSegment(value: true, label: Text('Service')), ButtonSegment(value: false, label: Text('Repos'))],
                  selected: {cu['online'] == true},
                  onSelectionChanged: canEdit ? (v) {
                    cu['online'] = v.first;
                    st.touch();
                  } : null,
                ),
              ]),
              if (canEdit && st.courierCash(ni(cu['id'])) > 0)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: FilledButton.icon(
                    style: FilledButton.styleFrom(backgroundColor: kGreen, foregroundColor: Colors.white, minimumSize: const Size.fromHeight(42)),
                    onPressed: () async {
                      if (!await confirmDialog(context, 'Encaisser', '${money(st.courierCash(ni(cu['id'])))} remis par ${s(cu['name'])} : les commandes passent « encaissées ».', ok: 'Encaisser')) return;
                      final amt = st.collectCourier(cu);
                      if (context.mounted) toast(context, '${money(amt)} encaissés de ${s(cu['name'])}');
                    },
                    icon: const Icon(Icons.payments_outlined), label: const Text('Encaisser'),
                  ),
                ),
            ]),
          ),
        ),
      const SizedBox(height: 6),
      Section(title: 'Courses en cours (${jobs.length})', children: [
        for (final o in jobs)
          ListTile(
            title: Text('${s(o['ref'])} · ${s(st.customerOf(o)['name'])}'),
            subtitle: Text('${s(o['address'])}, ${s(o['commune'])}\n${money(st.orderTotal(o))} · ${s(st.cub[ni(o['courierId'])]?['name']).isEmpty ? 'sans livreur' : s(st.cub[ni(o['courierId'])]!['name'])}'),
            isThreeLine: true,
            trailing: canEdit ? PopupMenuButton<String>(
              onSelected: (v) async {
                if (v == 'done') {
                  st.setStatus(o, 'delivered', 'Livrée par ${s(st.cub[ni(o['courierId'])]?['name']).isEmpty ? 'livreur' : s(st.cub[ni(o['courierId'])]!['name'])} — argent chez le livreur');
                  st.touch();
                } else if (v == 'fail') {
                  await officeFailDialog(context, st, o);
                } else {
                  final cid = int.tryParse(v);
                  o['courierId'] = cid;
                  st.hist(o, 'Livreur', cid == null ? '—' : s(st.cub[cid]?['name']));
                  st.touch();
                }
              },
              itemBuilder: (_) => [
                const PopupMenuItem(value: 'done', child: Text('Livrée')),
                const PopupMenuItem(value: 'fail', child: Text('Échec')),
                const PopupMenuDivider(),
                for (final x in st.c['couriers']!.where((x) => x['active'] != false)) PopupMenuItem(value: '${x['id']}', child: Text('Confier à ${s(x['name'])}')),
              ],
            ) : null,
            onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => OrderScreen(store: st, id: ni(o['id'])))),
          ),
        if (jobs.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucune course en cours', style: TextStyle(color: kMuted))),
      ]),
    ]);
  }
}

Future<void> officeFailDialog(BuildContext context, ErpStore st, Doc o) async {
  var reason = kFailReasons.first.$1;
  final r = await showDialog<String>(
    context: context,
    builder: (c) => StatefulBuilder(builder: (c, set) => AlertDialog(
          title: Text('Tentative échouée · ${s(o['ref'])}'),
          content: DropdownButtonFormField<String>(
            initialValue: reason, isExpanded: true, decoration: const InputDecoration(labelText: 'Motif'),
            items: [for (final f in kFailReasons) DropdownMenuItem(value: f.$1, child: Text(f.$2))],
            onChanged: (v) => set(() => reason = v ?? reason),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(c), child: const Text('Annuler')),
            FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, reason), child: const Text('Enregistrer')),
          ],
        )),
  );
  if (r != null) st.addFailedAttempt(o, r, '');
}

Future<void> courierEdit(BuildContext context, ErpStore st, Doc? cu) async {
  final name = TextEditingController(text: s(cu?['name'])), phone = TextEditingController(text: s(cu?['phone'])), rate = TextEditingController(text: '${ni(cu?['perDelivery'] ?? 250)}');
  var vehicle = s(cu?['vehicle']).isEmpty ? 'Moto' : s(cu!['vehicle']);
  final zones = l(cu?['zones'] ?? [16]).map(ni).toSet();
  final ws = st.c['wilayas']!.toList()..sort((a, b) => ni(a['id']).compareTo(ni(b['id'])));
  final ok = await showDialog<bool>(
    context: context,
    builder: (c) => StatefulBuilder(builder: (c, set) => AlertDialog(
          title: Text(cu == null ? 'Ajouter un livreur' : 'Modifier le livreur'),
          content: SizedBox(
            width: 420,
            child: ListView(shrinkWrap: true, children: [
              TextField(controller: name, decoration: const InputDecoration(labelText: 'Nom *')),
              const SizedBox(height: 8),
              TextField(controller: phone, keyboardType: TextInputType.phone, decoration: const InputDecoration(labelText: 'Téléphone')),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(initialValue: ['Moto', 'Voiture', 'Utilitaire', 'Vélo'].contains(vehicle) ? vehicle : 'Moto', decoration: const InputDecoration(labelText: 'Véhicule'), items: [for (final v in ['Moto', 'Voiture', 'Utilitaire', 'Vélo']) DropdownMenuItem(value: v, child: Text(v))], onChanged: (v) => vehicle = v ?? vehicle),
              const SizedBox(height: 8),
              TextField(controller: rate, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Rémunération par livraison (DZD)')),
              const Padding(padding: EdgeInsets.fromLTRB(0, 12, 0, 4), child: Text('Zones', style: TextStyle(fontWeight: FontWeight.w800))),
              Wrap(spacing: 4, runSpacing: 4, children: [
                for (final w in ws) FilterChip(label: Text(s(w['fr'])), selected: zones.contains(ni(w['id'])), onSelected: (v) => set(() => v ? zones.add(ni(w['id'])) : zones.remove(ni(w['id'])))),
              ]),
            ]),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Annuler')),
            FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, true), child: const Text('Enregistrer')),
          ],
        )),
  );
  final values = (name: name.text.trim(), phone: phone.text.trim(), rate: int.tryParse(rate.text.trim()) ?? 0);
  name.dispose();
  phone.dispose();
  rate.dispose();
  if (ok != true) return;
  if (values.name.isEmpty) {
    if (context.mounted) toast(context, 'Nom requis', bad: true);
    return;
  }
  var x = cu;
  if (x == null) {
    x = {'id': st.c['couriers']!.length + 1, 'communes': <dynamic>[], 'active': true, 'online': true};
    st.c['couriers']!.add(x);
  }
  x.addAll({'name': values.name, 'phone': values.phone, 'vehicle': vehicle, 'perDelivery': values.rate, 'zones': zones.toList()});
  st.reindex();
  st.touch();
  if (context.mounted) toast(context, 'Livreur enregistré');
}

class _CarrierRules extends StatelessWidget {
  const _CarrierRules({required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store;
    final conn = st.c['carriers']!.where((c) => c['connected'] == true).toList();
    final rules = l(st.settings['carrierRules']).map(m).toList();
    final def = conn.where((c) => c['isDefault'] == true).firstOrNull;
    return ListView(padding: const EdgeInsets.all(12), children: [
      const Text('Choisissez automatiquement la société selon la wilaya. Sinon, la société par défaut est utilisée.', style: TextStyle(color: kMuted)),
      const SizedBox(height: 10),
      if (conn.isNotEmpty)
        DropdownButtonFormField<String>(
          initialValue: def == null ? null : s(def['id']),
          decoration: const InputDecoration(labelText: 'Société par défaut'),
          items: [for (final c in conn) DropdownMenuItem(value: s(c['id']), child: Text(st.carrierName(c)))],
          onChanged: (v) {
            for (final c in st.c['carriers']!) {
              c['isDefault'] = c['id'] == v;
            }
            st.touch();
          },
        ),
      const SizedBox(height: 10),
      for (var i = 0; i < rules.length; i++)
        Card(
          margin: const EdgeInsets.only(bottom: 6),
          child: ListTile(
            title: Text('Wilaya ${st.wName(rules[i]['wilaya'])} → ${st.carrierName(st.crb[s(rules[i]['carrier'])] ?? {'id': rules[i]['carrier'], 'name': rules[i]['carrier']})}'),
            trailing: IconButton(icon: const Icon(Icons.delete_outline, color: kRed), onPressed: () {
              (st.settings['carrierRules'] as List).removeAt(i);
              st.touch();
            }),
          ),
        ),
      OutlinedButton.icon(onPressed: conn.isEmpty ? null : () => _add(context, st, conn), icon: const Icon(Icons.add), label: const Text('Ajouter la règle')),
    ]);
  }

  Future<void> _add(BuildContext context, ErpStore st, List<Doc> conn) async {
    int? w = 16;
    String? carrier = s(conn.first['id']);
    final ws = st.c['wilayas']!.toList()..sort((a, b) => ni(a['id']).compareTo(ni(b['id'])));
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: const Text('Nouvelle règle'),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          DropdownButtonFormField<int>(initialValue: ws.any((x) => ni(x['id']) == 16) ? 16 : (ws.isEmpty ? null : ni(ws.first['id'])), isExpanded: true, decoration: const InputDecoration(labelText: 'Wilaya'), items: [for (final x in ws) DropdownMenuItem(value: ni(x['id']), child: Text('${ni(x['id'])} - ${s(x['fr'])}'))], onChanged: (v) => w = v),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(initialValue: carrier, isExpanded: true, decoration: const InputDecoration(labelText: 'Société'), items: [for (final x in conn) DropdownMenuItem(value: s(x['id']), child: Text(st.carrierName(x)))], onChanged: (v) => carrier = v),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Annuler')),
          FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, true), child: const Text('Ajouter')),
        ],
      ),
    );
    if (ok != true || w == null || carrier == null) return;
    if (st.settings['carrierRules'] is! List) st.settings['carrierRules'] = <dynamic>[];
    (st.settings['carrierRules'] as List).add({'wilaya': w, 'carrier': carrier});
    st.touch();
    if (context.mounted) toast(context, 'Règle ajoutée');
  }
}

class _Fees extends StatefulWidget {
  const _Fees({required this.store});
  final ErpStore store;
  @override
  State<_Fees> createState() => _FeesState();
}

class _FeesState extends State<_Fees> {
  String _q = '';
  @override
  Widget build(BuildContext context) {
    final st = widget.store, canEdit = st.role == 'admin' || st.role == 'gerant';
    final ws = st.c['wilayas']!.where((w) => _q.isEmpty || s(w['fr']).toLowerCase().contains(_q) || s(w['ar']).contains(_q) || s(w['code']).contains(_q) || '${w['id']}' == _q).toList()
      ..sort((a, b) => ni(a['id']).compareTo(ni(b['id'])));
    return Column(children: [
      SearchField(hint: 'Rechercher une wilaya…', onChanged: (v) => setState(() => _q = v.trim().toLowerCase())),
      Padding(
        padding: const EdgeInsets.fromLTRB(12, 0, 12, 6),
        child: Row(children: [
          Expanded(child: Text('${st.c['wilayas']!.where((w) => w['active'] == true).length} / ${st.c['wilayas']!.length} wilayas desservies', style: const TextStyle(color: kMuted, fontSize: 12.5))),
          if (canEdit) TextButton(onPressed: () => _bulk(context, st), child: const Text('Appliquer à toutes')),
        ]),
      ),
      Expanded(
        child: ListView.builder(
          padding: const EdgeInsets.fromLTRB(12, 0, 12, 24),
          itemCount: ws.length,
          itemBuilder: (c, i) {
            final w = ws[i];
            void set(String k, num v) {
              w[k] = v.round();
              st.touch();
            }
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ExpansionTile(
                leading: Switch(value: w['active'] == true, onChanged: canEdit ? (v) {
                  w['active'] = v;
                  st.touch();
                } : null),
                title: Text('${s(w['code']).isEmpty ? ni(w['id']) : s(w['code'])} · ${s(w['fr'])}', style: TextStyle(fontWeight: FontWeight.w700, color: w['active'] == true ? kInk : kMuted)),
                subtitle: Text('Domicile ${money(n(w['home']))} · Bureau ${money(n(w['desk']))}', style: const TextStyle(fontSize: 12)),
                children: [
                  NumTile('Prix client domicile', n(w['home']), (v) => set('home', v), enabled: canEdit),
                  NumTile('Prix client bureau', n(w['desk']), (v) => set('desk', v), enabled: canEdit),
                  NumTile('Coût société domicile', n(w['dhdHome']), (v) => set('dhdHome', v), enabled: canEdit),
                  NumTile('Coût société bureau', n(w['dhdDesk']), (v) => set('dhdDesk', v), enabled: canEdit),
                ],
              ),
            );
          },
        ),
      ),
    ]);
  }

  Future<void> _bulk(BuildContext context, ErpStore st) async {
    final h = TextEditingController(), d = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: const Text('Appliquer à toutes les wilayas'),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          TextField(controller: h, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Prix client domicile (vide = inchangé)')),
          const SizedBox(height: 8),
          TextField(controller: d, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Prix client bureau (vide = inchangé)')),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Annuler')),
          FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, true), child: const Text('Appliquer')),
        ],
      ),
    );
    final hv = h.text.trim(), dv = d.text.trim();
    h.dispose();
    d.dispose();
    if (ok != true) return;
    if (hv.isEmpty && dv.isEmpty) {
      if (context.mounted) toast(context, 'Saisissez un prix', bad: true);
      return;
    }
    for (final w in st.c['wilayas']!) {
      if (hv.isNotEmpty) w['home'] = int.tryParse(hv) ?? 0;
      if (dv.isNotEmpty) w['desk'] = int.tryParse(dv) ?? 0;
    }
    st.touch();
    if (context.mounted) toast(context, 'Prix appliqués aux ${st.c['wilayas']!.length} wilayas');
  }
}

// ============================================================ Pixels

class PixelsPage extends StatelessWidget {
  const PixelsPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store;
    final ev = st.kv['pixel_events']!;
    Widget block(String platform) {
      final list = st.c['pixels']!.where((p) => p['platform'] == platform).toList();
      final events = m(ev[platform]);
      return Section(title: platform == 'facebook' ? 'Facebook / Meta Pixel' : 'TikTok Pixel', children: [
        for (final p in list)
          Card(
            margin: const EdgeInsets.fromLTRB(10, 4, 10, 6),
            color: const Color(0xFFFAFAFB),
            child: Column(children: [
              SwitchListTile(dense: true, value: p['active'] == true, title: Text(s(p['name']), style: const TextStyle(fontWeight: FontWeight.w800)), subtitle: Text(p['active'] == true ? 'Actif' : 'Inactif'), onChanged: (v) {
                p['active'] = v;
                st.touch();
              }),
              TextTile('ID du pixel', s(p['pixelId']), (v) {
                p['pixelId'] = v.trim();
                st.touch();
              }),
              TextTile(platform == 'facebook' ? 'Token API de conversions' : 'Token Events API', s(p['token']), (v) {
                p['token'] = v.trim();
                st.touch();
              }),
              TextTile('Code de test', s(p['testCode']), (v) {
                p['testCode'] = v.trim();
                st.touch();
              }),
              Align(alignment: AlignmentDirectional.centerEnd, child: TextButton.icon(style: TextButton.styleFrom(foregroundColor: kRed), onPressed: () async {
                if (!await confirmDialog(context, 'Supprimer le pixel', s(p['name']), ok: 'Supprimer', danger: true)) return;
                st.c['pixels']!.remove(p);
                st.touch();
              }, icon: const Icon(Icons.delete_outline), label: const Text('Supprimer'))),
            ]),
          ),
        if (list.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun pixel', style: TextStyle(color: kMuted))),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: OutlinedButton.icon(onPressed: () {
            st.c['pixels']!.add({'id': '${platform.substring(0, 2)}${now()}', 'platform': platform, 'name': '${platform == 'facebook' ? 'Pixel Facebook' : 'Pixel TikTok'} ${list.length + 1}', 'pixelId': '', 'token': '', 'testCode': '', 'active': false});
            st.touch();
          }, icon: const Icon(Icons.add), label: const Text('Ajouter un pixel')),
        ),
        const Padding(padding: EdgeInsets.fromLTRB(14, 12, 14, 4), child: Text('Événements envoyés', style: TextStyle(fontWeight: FontWeight.w700))),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Wrap(spacing: 6, runSpacing: 6, children: [
            for (final k in events.keys)
              FilterChip(label: Text(k), selected: events[k] == true, onSelected: (v) {
                ev[platform] = {...events, k: v};
                st.touch();
              }),
          ]),
        ),
      ]);
    }
    return ListView(padding: const EdgeInsets.all(12), children: [
      block('facebook'),
      const SizedBox(height: 10),
      block('tiktok'),
      const SizedBox(height: 10),
      Section(title: 'Quand envoyer l\'achat (Purchase) ?', children: [
        RadioGroup<String>(
          groupValue: s(st.settings['purchaseOn']).isEmpty ? 'order' : s(st.settings['purchaseOn']),
          onChanged: (v) {
            st.settings['purchaseOn'] = v;
            st.touch();
          },
          child: const Column(children: [
            RadioListTile<String>(dense: true, value: 'order', title: Text('À la commande sur le site')),
            RadioListTile<String>(dense: true, value: 'confirmed', title: Text('Quand l\'agent confirme la commande (recommandé en COD)')),
            RadioListTile<String>(dense: true, value: 'delivered', title: Text('Quand la commande est livrée')),
          ]),
        ),
        SwitchListTile(dense: true, value: st.settings['dedup'] == true, title: const Text('Dédoublonnage navigateur + serveur (event_id)'), onChanged: (v) {
          st.settings['dedup'] = v;
          st.touch();
        }),
      ]),
    ]);
  }
}

// ============================================================ Modules

const kModuleList = [
  ('delivery', Icons.local_shipping_outlined, 'Sociétés de livraison', 'DHD, Yalidine, ZR Express, Maystro, Noest, EcoTrack… : envois, étiquettes, suivi et versements.'),
  ('couriers', Icons.person_outline, 'Mes livreurs', 'Vos propres livreurs : courses, encaissement, remise de la caisse.'),
  ('weight', Icons.layers_outlined, 'Poids et découpage des colis', 'Poids calculé par commande, surpoids facturé, découpage automatique en plusieurs colis.'),
  ('pixels', Icons.track_changes, 'Pixels Facebook et TikTok', 'Plusieurs pixels, API de conversions, choix du moment de l\'achat.'),
  ('upsell', Icons.bolt, 'Upsell au téléphone', 'Suggestions par catégorie dans l\'écran d\'appel, gain crédité à l\'agent.'),
  ('assignment', Icons.shuffle, 'Répartition automatique', 'Tour de rôle, charge, performance ou règles.'),
  ('blacklist', Icons.flag_outlined, 'Liste noire et doublons', 'Badge après 1 refus, liste noire après 2 retours, doublons 24 h.'),
  ('whatsapp', Icons.chat_outlined, 'WhatsApp', 'Boutons WhatsApp, messages automatiques (API en v2).'),
];

class ModulesPage extends StatelessWidget {
  const ModulesPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, mods = m(st.settings['modules']);
    return ListView(padding: const EdgeInsets.all(12), children: [
      const Text('Activez ou désactivez chaque module en un clic.', style: TextStyle(color: kMuted)),
      const SizedBox(height: 8),
      for (final x in kModuleList)
        Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: SwitchListTile(
            secondary: Icon(x.$2, color: mods[x.$1] == true ? kOrange : kMuted),
            title: Text(x.$3, style: const TextStyle(fontWeight: FontWeight.w800)),
            subtitle: Text(x.$4, style: const TextStyle(fontSize: 12.5)),
            value: mods[x.$1] == true,
            onChanged: (v) {
              st.settings['modules'] = {...mods, x.$1: v};
              st.log('Module ${v ? 'activé' : 'désactivé'}', x.$1);
              st.touch();
            },
          ),
        ),
    ]);
  }
}

// ============================================================ Répartition

const kModes = [
  ('rr', 'Tour de rôle (round robin)', 'Commande 1 → agent A, commande 2 → agent B…'),
  ('least', 'Charge la plus faible', 'L\'agent qui a le moins de commandes en attente reçoit la suivante'),
  ('weighted', 'Pondéré par performance', 'Les agents au meilleur taux de livraison reçoivent plus'),
  ('rule', 'Par règle', 'Par wilaya, langue, source ou montant'),
  ('manual', 'Manuel', 'Le Manager attribue lui-même'),
];

class AssignPage extends StatelessWidget {
  const AssignPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, can = st.role == 'admin' || st.role == 'manager';
    final auto = st.settings['autoAssign'] != false;
    final rules = l(st.settings['rules']).map(m).toList();
    final today = dayStart();
    void setS(String k, Object v) {
      st.settings[k] = v;
      st.touch();
    }
    return ListView(padding: const EdgeInsets.all(12), children: [
      Card(
        child: SwitchListTile(
          title: Text(auto ? 'Attribution automatique active' : 'Attribution automatique suspendue', style: const TextStyle(fontWeight: FontWeight.w800)),
          subtitle: const Text('Chaque nouvelle commande est attribuée à un agent en ligne.'),
          value: auto,
          onChanged: can ? (v) {
            setS('autoAssign', v);
            st.log('Attribution automatique', v ? 'activée' : 'suspendue');
          } : null,
        ),
      ),
      const SizedBox(height: 10),
      Section(title: 'Mode de répartition', children: [
        RadioGroup<String>(
          groupValue: s(st.settings['assignMode']).isEmpty ? 'weighted' : s(st.settings['assignMode']),
          onChanged: (v) {
            if (!can || v == null) return;
            setS('assignMode', v);
            st.log('Mode de répartition', v);
          },
          child: Column(children: [for (final x in kModes) RadioListTile<String>(dense: true, value: x.$1, enabled: can, title: Text(x.$2, style: const TextStyle(fontWeight: FontWeight.w700)), subtitle: Text(x.$3))]),
        ),
      ]),
      const SizedBox(height: 10),
      Section(title: 'Agents, poids et quotas', children: [
        for (final a in st.agents)
          ExpansionTile(
            title: Text(s(a['name']), style: const TextStyle(fontWeight: FontWeight.w700)),
            subtitle: Text('${a['online'] == true && a['pause'] != true ? 'En ligne' : a['pause'] == true ? 'En pause' : 'Hors ligne'} · en attente ${st.agentLoad(ni(a['id']))} / ${n(a['quota']) == 0 ? st.setting('quota', 20) : n(a['quota'])} · livraison ${fmtPct(st.agentPerf(a).delivRate)} · aujourd\'hui ${st.orders.where((o) => ni(o['agentId']) == ni(a['id']) && n(o['created']) >= today).length}'),
            children: [
              NumTile('Poids %', n(a['weight']), (v) {
                a['weight'] = v.round();
                st.touch();
              }, enabled: can),
              NumTile('Quota max', n(a['quota']), (v) {
                a['quota'] = max(1, v.round());
                st.touch();
              }, enabled: can),
            ],
          ),
        if (st.agents.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun agent', style: TextStyle(color: kMuted))),
      ]),
      const SizedBox(height: 10),
      Section(title: 'Règles (mode « Par règle »)', children: [
        for (var i = 0; i < rules.length; i++)
          ListTile(
            dense: true,
            title: Text('${rules[i]['type']} = ${rules[i]['type'] == 'wilaya' ? st.wName(rules[i]['value']) : rules[i]['type'] == 'montant' ? '≥ ${money(n(rules[i]['value']))}' : s(rules[i]['value'])} → ${st.agentName(rules[i]['agentId'])}'),
            trailing: can ? IconButton(icon: const Icon(Icons.delete_outline, color: kRed), onPressed: () {
              (st.settings['rules'] as List).removeAt(i);
              st.touch();
            }) : null,
          ),
        if (can) Padding(padding: const EdgeInsets.symmetric(horizontal: 10), child: OutlinedButton.icon(onPressed: () => _addRule(context, st), icon: const Icon(Icons.add), label: const Text('Ajouter une règle'))),
        NumTile('Quota par défaut', st.setting('quota', 20), (v) => setS('quota', v == 0 ? 20 : v.round()), enabled: can),
        NumTile('Réattribution après (min)', st.setting('reassignAfter', 30), (v) => setS('reassignAfter', v == 0 ? 30 : v.round()), enabled: can),
      ]),
    ]);
  }

  Future<void> _addRule(BuildContext context, ErpStore st) async {
    if (st.agents.isEmpty) return;
    var type = 'wilaya';
    var agent = ni(st.agents.first['id']);
    final val = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: const Text('Nouvelle règle'),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          DropdownButtonFormField<String>(initialValue: type, decoration: const InputDecoration(labelText: 'Type'), items: const [DropdownMenuItem(value: 'wilaya', child: Text('Wilaya')), DropdownMenuItem(value: 'source', child: Text('Source')), DropdownMenuItem(value: 'montant', child: Text('Montant ≥'))], onChanged: (v) => type = v ?? type),
          const SizedBox(height: 8),
          TextField(controller: val, decoration: const InputDecoration(labelText: 'Valeur', hintText: '16 / WhatsApp / 10000')),
          const SizedBox(height: 8),
          DropdownButtonFormField<int>(initialValue: agent, decoration: const InputDecoration(labelText: 'Agent'), items: [for (final a in st.agents) DropdownMenuItem(value: ni(a['id']), child: Text(s(a['name'])))], onChanged: (v) => agent = v ?? agent),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Annuler')),
          FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () => Navigator.pop(c, true), child: const Text('Ajouter')),
        ],
      ),
    );
    final v = val.text.trim();
    val.dispose();
    if (ok != true) return;
    if (v.isEmpty) {
      if (context.mounted) toast(context, 'Valeur requise', bad: true);
      return;
    }
    if (st.settings['rules'] is! List) st.settings['rules'] = <dynamic>[];
    (st.settings['rules'] as List).add({'type': type, 'value': v, 'agentId': agent});
    st.touch();
    if (context.mounted) toast(context, 'Règle ajoutée');
  }
}

// ============================================================ Classement

class RankingPage extends StatefulWidget {
  const RankingPage({super.key, required this.store});
  final ErpStore store;
  @override
  State<RankingPage> createState() => _RankingPageState();
}

class _RankingPageState extends State<RankingPage> {
  // objectifs de la semaine : comme sur le site, gardés le temps de la session
  static var goals = (conf: 20, up: 60, deliv: 75);
  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    double score(dynamic p) => p.delivRate * .5 + p.confRate * .3 + p.upRate * .2;
    final rows = st.agents.map((a) => (a: a, p: st.agentPerf(a))).toList()..sort((x, y) => score(y.p).compareTo(score(x.p)));
    Widget bar(String label, num v, num g, String unit) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 3),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Row(children: [Expanded(child: Text(label, style: const TextStyle(fontSize: 12.5))), Text('${v.round()}$unit / $g$unit', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12.5))]),
            const SizedBox(height: 3),
            LinearProgressIndicator(value: g == 0 ? 0 : min(1, v / g).toDouble(), color: v >= g ? kGreen : kOrange, backgroundColor: kLine, minHeight: 6, borderRadius: BorderRadius.circular(3)),
          ]),
        );
    return ListView(padding: const EdgeInsets.all(12), children: [
      Section(title: 'Objectifs de la semaine', children: [
        NumTile('Confirmations par agent', goals.conf, (v) => setState(() => goals = (conf: v.round(), up: goals.up, deliv: goals.deliv))),
        NumTile('Taux d\'upsell (%)', goals.up, (v) => setState(() => goals = (conf: goals.conf, up: v.round(), deliv: goals.deliv))),
        NumTile('Taux de livraison (%)', goals.deliv, (v) => setState(() => goals = (conf: goals.conf, up: goals.up, deliv: v.round()))),
      ]),
      const SizedBox(height: 10),
      for (final (i, r) in rows.indexed)
        Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Row(children: [
                CircleAvatar(radius: 14, backgroundColor: i == 0 ? kOrange : const Color(0xFFEDEFF2), foregroundColor: kInk, child: Text('${i + 1}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 12))),
                const SizedBox(width: 8),
                Expanded(child: Text(s(r.a['name']), style: const TextStyle(fontWeight: FontWeight.w800))),
                Text('+${money(r.p.gain)}', style: const TextStyle(color: kGreen, fontWeight: FontWeight.w700, fontSize: 12.5)),
              ]),
              const SizedBox(height: 6),
              Text('Confirmées ${r.p.conf} · confirmation ${fmtPct(r.p.confRate)} · upsell ${fmtPct(r.p.upRate)} · livraison ${fmtPct(r.p.delivRate)}', style: const TextStyle(color: kMuted, fontSize: 12)),
              bar('Confirmations', r.p.conf, goals.conf, ''),
              bar('Upsell', r.p.upRate, goals.up, ' %'),
              bar('Livraison', r.p.delivRate, goals.deliv, ' %'),
            ]),
          ),
        ),
      if (rows.isEmpty) const Empty('Aucun agent'),
    ]);
  }
}

// ============================================================ Paramètres

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store;
    void setS(String k, Object v) {
      st.settings[k] = v;
      st.touch();
    }
    final tpl = m(st.settings['templates']);
    return Tabbed(tabs: [
      ('Paramètres du site', ListView(padding: const EdgeInsets.all(12), children: [
        Card(child: Column(children: [
          SwitchListTile(value: st.settings['maintenance'] == true, title: const Text('Mode maintenance'), subtitle: const Text('La boutique affiche un message de maintenance'), onChanged: (v) => setS('maintenance', v)),
          SwitchListTile(
            value: st.products.any((p) => p['onDemand'] == true),
            title: const Text('Autoriser « commande sur demande » pour les ruptures'),
            onChanged: (v) {
              for (final p in st.products) {
                p['onDemand'] = v;
              }
              st.touch();
            },
          ),
          TextTile('Couleur principale (#RRGGBB)', s(st.settings['primary']).isEmpty ? '#FD6400' : s(st.settings['primary']), (v) {
            if (!RegExp(r'^#[0-9A-Fa-f]{6}$').hasMatch(v)) {
              toast(context, 'Couleur au format #RRGGBB', bad: true);
              return;
            }
            setS('primary', v);
          }),
        ])),
        const SizedBox(height: 8),
        const Text('Nom, logo, téléphones, adresse et réseaux sociaux se règlent dans Boutique › En-tête et pied de page.', style: TextStyle(color: kMuted, fontSize: 12.5)),
      ])),
      ('Paramètres ERP', ListView(padding: const EdgeInsets.all(12), children: [
        Card(child: Column(children: [
          NumTile('Remise max agent (%)', st.setting('discountAgent', 5), (v) => setS('discountAgent', v)),
          NumTile('Remise max manager (%)', st.setting('discountManager', 10), (v) => setS('discountManager', v)),
          NumTile('Délai fournisseur par défaut (jours)', st.setting('supplierTerms', 7), (v) => setS('supplierTerms', v)),
          NumTile('Caisse de sécurité (% du bénéfice)', n(st.boxes['security']), (v) {
            final x = max(0, min(100, v.round()));
            setS('boxes', {...st.boxes, 'security': x, 'reinvest': 100 - x});
          }),
          ListTile(dense: true, title: const Text('Réinvestissement (% du bénéfice)'), trailing: Text('${n(st.boxes['reinvest'])}', style: const TextStyle(fontWeight: FontWeight.w800))),
          NumTile('Plafond d\'avance pub (% de la réserve)', st.setting('advanceCap', 30), (v) => setS('advanceCap', v)),
          NumTile('Taux USD/DZD', st.setting('usdRate', 260), (v) => setS('usdRate', v)),
          NumTile('Commission par commande livrée (DZD)', st.setting('commission', 100), (v) => setS('commission', v)),
          NumTile('Coût pub alloué par commande livrée (DZD)', st.setting('adCostPerDelivered', 700), (v) => setS('adCostPerDelivered', v)),
          NumTile('Marge de sécurité trésorerie (DZD)', st.setting('safetyMargin', 20000), (v) => setS('safetyMargin', v)),
        ])),
      ])),
      ('Modèles de messages', ListView(padding: const EdgeInsets.all(12), children: [
        Card(child: Column(children: [
          for (final k in tpl.keys)
            TextTile(k == 'unreach' ? 'Client injoignable (SMS/WhatsApp)' : k == 'shipped' ? 'Colis expédié' : k, s(tpl[k]), (v) => setS('templates', {...tpl, k: v}), lines: 4),
          if (tpl.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun modèle', style: TextStyle(color: kMuted))),
        ])),
        const SizedBox(height: 8),
        const Text('Variables : {nom} {ref} {tracking} {total}', style: TextStyle(color: kMuted, fontSize: 12.5)),
      ])),
    ]);
  }
}

// ============================================================ Statistiques

class StatsPage extends StatefulWidget {
  const StatsPage({super.key, required this.store});
  final ErpStore store;
  @override
  State<StatsPage> createState() => _StatsPageState();
}

class _StatsPageState extends State<StatsPage> {
  String _period = '30';
  int? _agent, _wilaya;

  (int, int) _range() {
    final today = dayStart();
    switch (_period) {
      case '0':
        return (today, now());
      case '1':
        return (today - kDay, today - 1);
      case '7':
        return (today - 6 * kDay, now());
      case 'm':
        final d = DateTime.now();
        return (DateTime(d.year, d.month).millisecondsSinceEpoch, now());
      default:
        return (today - 29 * kDay, now());
    }
  }

  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    final (from, to) = _range();
    var list = st.orders.where((o) => n(o['created']) >= from && n(o['created']) <= to).toList();
    if (st.role == 'agent') list = list.where((o) => ni(o['agentId']) == st.uidMe).toList();
    if (_agent != null) list = list.where((o) => ni(o['agentId']) == _agent).toList();
    if (_wilaya != null) list = list.where((o) => ni(o['wilaya']) == _wilaya).toList();
    bool isConf(Doc o) => kConfirmedSt.contains(o['status']);
    final conf = list.where(isConf).toList(), canc = list.where((o) => o['status'] == 'cancelled').length;
    final deliv = list.where((o) => kDeliveredSt.contains(o['status'])).toList(), ret = list.where((o) => ['returning', 'returned'].contains(o['status'])).length;
    final paid = list.where((o) => ['paid', 'closed'].contains(o['status'])).length;
    final ca = deliv.fold<int>(0, (t, o) => t + st.orderTotal(o));
    final avg = conf.isEmpty ? 0 : conf.fold<int>(0, (t, o) => t + st.orderTotal(o)) / conf.length;
    final upGain = conf.fold<int>(0, (t, o) => t + st.upsellGain(o));
    final ship = list.where((o) => kShippedSt.contains(o['status'])).length;
    final admin = st.role == 'admin';
    Map<String, int> countBy(Iterable<String> keys) {
      final mm = <String, int>{};
      for (final k in keys) {
        mm[k] = (mm[k] ?? 0) + 1;
      }
      return Map.fromEntries(mm.entries.toList()..sort((a, b) => b.value.compareTo(a.value)));
    }
    Widget bars(Map<String, num> data, {Color color = kOrange, bool moneyFmt = false}) {
      final mx = data.values.fold<num>(1, max);
      return Column(children: [
        for (final e in data.entries.take(10))
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 4, 14, 4),
            child: Row(children: [
              Expanded(flex: 4, child: Text(e.key, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12.5))),
              Expanded(flex: 5, child: LinearProgressIndicator(value: e.value / mx, color: color, backgroundColor: kLine, minHeight: 8, borderRadius: BorderRadius.circular(4))),
              SizedBox(width: 86, child: Text(moneyFmt ? money(e.value) : '${e.value.round()}', textAlign: TextAlign.end, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12))),
            ]),
          ),
        if (data.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('—', style: TextStyle(color: kMuted))),
      ]);
    }
    final days = [for (var i = 29; i >= 0; i--) dayStart() - i * kDay];
    final prodQ = <String, int>{}, upQ = <String, int>{};
    for (final o in conf) {
      for (final i in l(o['items']).map(m)) {
        final name = s(st.pby[ni(i['pid'])]?['name']);
        prodQ[name] = (prodQ[name] ?? 0) + ni(i['q']);
        final was = l(o['initial']).map(m).where((x) => ni(x['pid']) == ni(i['pid'])).firstOrNull;
        final add = was != null ? max(0, ni(i['q']) - ni(was['q'])) : ni(i['q']);
        if (add > 0 && l(o['initial']).isNotEmpty) upQ[name] = (upQ[name] ?? 0) + add;
      }
    }
    final byW = <int, List<Doc>>{};
    for (final o in list) {
      (byW[ni(o['wilaya'])] ??= []).add(o);
    }
    return ListView(padding: const EdgeInsets.all(12), children: [
      Wrap(spacing: 6, runSpacing: 6, children: [
        for (final p in const [('0', 'Aujourd\'hui'), ('1', 'Hier'), ('7', '7 jours'), ('30', '30 jours'), ('m', 'Ce mois')])
          ChoiceChip(label: Text(p.$2), selected: _period == p.$1, selectedColor: const Color(0xFFFFE3CF), onSelected: (_) => setState(() => _period = p.$1)),
      ]),
      const SizedBox(height: 8),
      Row(children: [
        if (st.role != 'agent')
          Expanded(child: DropdownButtonFormField<int?>(
            initialValue: _agent, isExpanded: true, decoration: const InputDecoration(labelText: 'Agent', isDense: true),
            items: [const DropdownMenuItem(value: null, child: Text('Tous les agents')), for (final a in st.agents) DropdownMenuItem(value: ni(a['id']), child: Text(s(a['name'])))],
            onChanged: (v) => setState(() => _agent = v),
          )),
        if (st.role != 'agent') const SizedBox(width: 8),
        Expanded(child: DropdownButtonFormField<int?>(
          initialValue: _wilaya, isExpanded: true, decoration: const InputDecoration(labelText: 'Wilaya', isDense: true),
          items: [const DropdownMenuItem(value: null, child: Text('Toutes les wilayas')), for (final w in (st.orders.map((o) => ni(o['wilaya'])).toSet().toList()..sort())) DropdownMenuItem(value: w, child: Text(st.wName(w)))],
          onChanged: (v) => setState(() => _wilaya = v),
        )),
      ]),
      const SizedBox(height: 12),
      const Text('Ventes', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
      const SizedBox(height: 6),
      KpiGrid([Kpi('Reçues', '${list.length}'), Kpi('Confirmées', '${conf.length}'), Kpi('Livrées', '${deliv.length}'), Kpi('Payées', '$paid'), Kpi('CA livré', money(ca), accent: true), Kpi('Panier moyen', money(avg))]),
      const SizedBox(height: 8),
      Section(title: 'Commandes par jour (30 j)', children: [Padding(padding: const EdgeInsets.fromLTRB(10, 8, 10, 4), child: BarChart(values: [for (final d in days) list.where((o) => n(o['created']) >= d && n(o['created']) < d + kDay).length], labels: [for (final d in days) '${DateTime.fromMillisecondsSinceEpoch(d).day}']))]),
      const SizedBox(height: 8),
      Section(title: 'Par source', children: [bars(countBy(list.map((o) => s(o['platform']).isNotEmpty ? s(o['platform']) : s(o['source']).isEmpty ? '—' : s(o['source']))))]),
      const SizedBox(height: 14),
      const Text('Centre d\'appel', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
      const SizedBox(height: 6),
      KpiGrid([
        Kpi('Taux de confirmation', fmtPct(pct(conf.length, conf.length + canc))),
        Kpi('Appels par commande', (list.fold<int>(0, (t, o) => t + ni(o['calls'])) / max(1, list.length)).toStringAsFixed(1).replaceAll('.', ',')),
        Kpi('Gain d\'upsell', money(upGain)),
        Kpi('Taux d\'upsell', fmtPct(pct(conf.where((o) => st.upsellGain(o) > 0).length, conf.length))),
      ]),
      const SizedBox(height: 8),
      Section(title: 'Par agent', children: [
        for (final a in st.agents)
          Builder(builder: (_) {
            final p = st.agentPerf(a, list);
            return ListTile(dense: true, title: Text(s(a['name'])), subtitle: Text('${p.total} commandes · confirmation ${fmtPct(p.confRate)} · upsell ${fmtPct(p.upRate)} · livraison ${fmtPct(p.delivRate)}'));
          }),
      ]),
      const SizedBox(height: 8),
      Section(title: 'Motifs d\'annulation', children: [bars(countBy(list.where((o) => o['status'] == 'cancelled').map((o) => s(o['cancelReason']).isEmpty ? '—' : s(o['cancelReason']))), color: kRed)]),
      const SizedBox(height: 14),
      const Text('Livraison', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
      const SizedBox(height: 6),
      KpiGrid([
        Kpi('Taux de livraison', fmtPct(pct(deliv.length, deliv.length + ret)), sub: 'objectif > 75 %'),
        Kpi('Taux de retour', fmtPct(pct(ret, deliv.length + ret))),
        Kpi('Tentatives par colis', (list.fold<int>(0, (t, o) => t + l(o['attempts']).length) / max(1, ship)).toStringAsFixed(2).replaceAll('.', ',')),
        Builder(builder: (_) {
          final sh = list.where((o) => n(m(o['times'])['sent']) > 0 && n(m(o['times'])['delivered']) > 0).toList();
          final d1 = sh.isEmpty ? 0 : sh.fold<num>(0, (t, o) => t + n(m(o['times'])['delivered']) - n(m(o['times'])['sent'])) / sh.length / kDay;
          return Kpi('Délai envoi → livraison', '${d1.toStringAsFixed(1).replaceAll('.', ',')} j');
        }),
      ]),
      const SizedBox(height: 8),
      Section(title: 'Par wilaya', children: [
        for (final e in (byW.entries.toList()..sort((a, b) => b.value.length.compareTo(a.value.length))).take(15))
          ListTile(dense: true, title: Text(st.wName(e.key)), subtitle: Text('${e.value.length} commandes · ${e.value.where((o) => kDeliveredSt.contains(o['status'])).length} livrées · ${e.value.where((o) => ['returning', 'returned'].contains(o['status'])).length} retours'), trailing: Text('${st.deliveryRate(e.value)} %', style: TextStyle(fontWeight: FontWeight.w800, color: st.deliveryRate(e.value) >= 75 ? kGreen : kRed))),
      ]),
      const SizedBox(height: 8),
      Section(title: 'Motifs d\'échec', children: [bars(countBy(list.expand((o) => l(o['attempts']).map((a) => failName(s(m(a)['reason']))))), color: kRed)]),
      const SizedBox(height: 14),
      const Text('Produits', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
      const SizedBox(height: 6),
      Section(title: 'Top ventes (unités)', children: [bars(Map.fromEntries(prodQ.entries.toList()..sort((a, b) => b.value.compareTo(a.value))))]),
      const SizedBox(height: 8),
      Section(title: 'Les plus ajoutés en upsell', children: [bars(Map.fromEntries(upQ.entries.toList()..sort((a, b) => b.value.compareTo(a.value))), color: kGreen)]),
      const SizedBox(height: 8),
      Section(title: 'Produits dormants (30 j sans vente)', children: [
        for (final p in st.products.where((p) => n(p['price']) > 0 && p['status'] != 'corbeille' && now() - n(p['lastSale']) > 30 * kDay).take(20)) ListTile(dense: true, title: Text(s(p['name'])), trailing: Text(p['lastSale'] == null ? 'jamais' : fDate(n(p['lastSale'])), style: const TextStyle(color: kMuted))),
      ]),
      if (admin) ...[
        const SizedBox(height: 14),
        const Text('Clients', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
        const SizedBox(height: 6),
        Builder(builder: (_) {
          final rows = st.customers.map(st.custStats).toList();
          return Column(children: [
            KpiGrid([
              Kpi('Clients', '${rows.length}'),
              Kpi('Taux de recommande', fmtPct(pct(rows.where((r) => r.created >= 2).length, rows.length))),
              Kpi('Valeur client moyenne', money(rows.isEmpty ? 0 : rows.fold<int>(0, (t, r) => t + r.spent) / rows.length)),
              Kpi('Liste noire', '${rows.where((r) => r.seg == 'liste noire').length}'),
            ]),
            const SizedBox(height: 8),
            Section(title: 'Segments', children: [bars(countBy(rows.map((r) => r.seg)))]),
          ]);
        }),
        const SizedBox(height: 14),
        const Text('Finance', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
        const SizedBox(height: 6),
        KpiGrid([
          for (final b in st.cashboxes) Kpi(s(b['fr']), money(n(b['balance']))),
          Kpi('Dette fournisseur', money(st.supplierBalance().due)),
          Kpi('Argent chez la société de livraison', money(st.moneyAtDhd())),
        ]),
      ],
    ]);
  }
}
