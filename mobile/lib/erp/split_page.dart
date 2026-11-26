import 'dart:math';

import 'package:flutter/material.dart';

import '../theme.dart';
import 'rules.dart';
import 'store.dart';
import 'ui.dart';

String _kg(num v) => '${((v * 10).round() / 10).toString().replaceAll('.', ',')} kg';

/// Découper la commande (openSplit du site) : proposition automatique selon le poids max par colis,
/// puis déplacement manuel des articles d'un colis à l'autre, ajout de colis, frais de livraison par colis.
class SplitPage extends StatefulWidget {
  const SplitPage({super.key, required this.store, required this.order});
  final ErpStore store;
  final Doc order;
  @override
  State<SplitPage> createState() => _SplitPageState();
}

class _SplitPageState extends State<SplitPage> {
  ErpStore get st => widget.store;
  Doc get o => widget.order;
  late double _max = n(st.carrierOf(o)['maxParcelKg']).toDouble();
  late final _maxCtl = TextEditingController(text: kgTxt(_max));
  late List<Doc> _p = _start();

  List<Doc> _start() {
    final saved = l(o['parcels']).map(m).toList();
    // un découpage déjà enregistré se reprend tel quel ; sinon proposition automatique
    if (saved.length > 1 && saved.every((p) => l(p['items']).isNotEmpty)) {
      return [for (final p in saved) <String, dynamic>{'n': ni(p['n']), 'items': <Doc>[for (final i in l(p['items'])) <String, dynamic>{'pid': ni(m(i)['pid']), 'q': ni(m(i)['q'])}]}];
    }
    return st.proposeParcels(o, _max);
  }

  @override
  void dispose() {
    _maxCtl.dispose();
    super.dispose();
  }

  List<Doc> _items(Doc p) => (p['items'] as List).cast<Doc>();

  void _recalc() {
    final v = double.tryParse(_maxCtl.text.trim().replaceAll(',', '.'));
    setState(() {
      _max = v == null || v < 1 ? 1 : v;
      _p = st.proposeParcels(o, _max);
    });
  }

  void _addParcel() => setState(() => _p.add({'n': _p.length + 1, 'items': <Doc>[]}));

  /// splitMove du site : déplace [qty] unités ; le colis de départ vidé disparaît, le colis d'arrivée reste.
  void _move(int from, int to, int pid, int qty) {
    setState(() {
      final src = _items(_p[from]).firstWhere((i) => i['pid'] == pid);
      final q = max(1, min(qty, ni(src['q'])));
      src['q'] = ni(src['q']) - q;
      if (ni(src['q']) <= 0) _items(_p[from]).remove(src);
      final dst = _items(_p[to]).where((i) => i['pid'] == pid).firstOrNull;
      if (dst != null) {
        dst['q'] = ni(dst['q']) + q;
      } else {
        _items(_p[to]).add({'pid': pid, 'q': q});
      }
      final target = _p[to];
      _p = [for (final p in _p) if (_items(p).isNotEmpty || identical(p, target)) p];
      for (var i = 0; i < _p.length; i++) {
        _p[i]['n'] = i + 1;
      }
    });
  }

  Future<void> _askMove(int from, Doc it) async {
    final qCtl = TextEditingController(text: '${ni(it['q'])}');
    final to = await showModalBottomSheet<int>(
      context: context,
      builder: (c) => SafeArea(
        child: Padding(
          padding: EdgeInsets.fromLTRB(16, 12, 16, 12 + MediaQuery.of(c).viewInsets.bottom),
          child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Text('Déplacer : ${s(st.pby[ni(it['pid'])]?['name'])}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
            const SizedBox(height: 10),
            TextField(controller: qCtl, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: 'Quantité (max ${ni(it['q'])})', isDense: true)),
            const SizedBox(height: 10),
            Wrap(spacing: 8, runSpacing: 8, children: [
              for (var i = 0; i < _p.length; i++)
                if (i != from) FilledButton.icon(onPressed: () => Navigator.pop(c, i), icon: const Icon(Icons.arrow_forward, size: 18), label: Text('Colis ${ni(_p[i]['n'])}')),
            ]),
          ]),
        ),
      ),
    );
    final qty = int.tryParse(qCtl.text.trim()) ?? 1;
    qCtl.dispose();
    if (to != null && mounted) _move(from, to, ni(it['pid']), qty);
  }

  @override
  Widget build(BuildContext context) {
    final c = st.carrierOf(o);
    final maxKg = n(c['maxParcelKg']);
    final base = st.baseShip(o, c);
    final costOne = st.parcelShip(o, st.orderWeight(o));
    final w = [for (final p in _p) st.parcelWeight(_items(p))];
    final cost = [for (final x in w) st.parcelShip(o, x)];
    final total = cost.fold<int>(0, (t, x) => t + x);
    final hasSplit = l(o['parcels']).length > 1;
    return Scaffold(
      appBar: AppBar(title: Text('Découper ${s(o['ref'])}', style: const TextStyle(fontWeight: FontWeight.w900))),
      body: ListView(padding: const EdgeInsets.fromLTRB(12, 12, 12, 120), children: [
        Text('Poids total : ${_kg(st.orderWeight(o))} · max ${kgTxt(maxKg)} kg par colis (${st.carrierName(c)})', style: const TextStyle(fontWeight: FontWeight.w700)),
        const SizedBox(height: 10),
        Row(children: [
          SizedBox(width: 120, child: TextField(controller: _maxCtl, keyboardType: const TextInputType.numberWithOptions(decimal: true), decoration: const InputDecoration(labelText: 'kg max / colis', isDense: true))),
          const SizedBox(width: 8),
          OutlinedButton(style: OutlinedButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: _recalc, child: const Text('Recalculer')),
          const Spacer(),
          OutlinedButton.icon(style: OutlinedButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: _addParcel, icon: const Icon(Icons.add, size: 18), label: const Text('Colis')),
        ]),
        const SizedBox(height: 12),
        for (var i = 0; i < _p.length; i++) ...[
          Card(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 10, 6, 8),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Expanded(child: Text('Colis ${ni(_p[i]['n'])}/${_p.length}', style: const TextStyle(fontWeight: FontWeight.w900))),
                  Pill(_kg(w[i]), w[i] > maxKg ? kRed : kGreen, selected: true),
                  const SizedBox(width: 8),
                  Text(money(cost[i]), style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12.5)),
                  const SizedBox(width: 6),
                ]),
                for (final it in _items(_p[i]))
                  Row(children: [
                    Expanded(child: Text('${s(st.pby[ni(it['pid'])]?['name'])} × ${ni(it['q'])}', style: const TextStyle(fontSize: 13))),
                    if (_p.length > 1) IconButton(tooltip: 'Déplacer vers un autre colis', onPressed: () => _askMove(i, it), icon: const Icon(Icons.swap_horiz)),
                  ]),
                if (_items(_p[i]).isEmpty) const Padding(padding: EdgeInsets.symmetric(vertical: 6), child: Text('Vide', style: TextStyle(color: kMuted, fontSize: 12.5))),
              ]),
            ),
          ),
          const SizedBox(height: 8),
        ],
        Section(title: 'Frais de livraison', children: [
          Row2('Frais en 1 colis', money(costOne)),
          for (var i = 0; i < _p.length; i++) Row2('Colis ${ni(_p[i]['n'])} · ${_kg(w[i])} · base ${money(base)} + surpoids ${money(cost[i] - base)}', money(cost[i])),
          Row2('Total ${_p.length} colis', money(total), bold: true),
          const Padding(padding: EdgeInsets.fromLTRB(14, 2, 14, 10), child: Text('Chaque colis reçoit son propre numéro de suivi.', style: TextStyle(color: kMuted, fontSize: 12))),
        ]),
      ]),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 8, 12, 8),
          child: Row(children: [
            if (hasSplit) ...[
              Expanded(child: OutlinedButton(style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(48)), onPressed: () {
                st.resetSplit(o);
                Navigator.of(context).maybePop();
              }, child: const Text('Annuler découpage'))),
              const SizedBox(width: 8),
            ],
            Expanded(
              child: FilledButton.icon(
                style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
                onPressed: () {
                  st.saveSplit(o, _p);
                  final k = _p.where((p) => _items(p).isNotEmpty).length;
                  toast(context, '${s(o['ref'])} : $k colis');
                  Navigator.of(context).maybePop();
                },
                icon: const Icon(Icons.layers_outlined, size: 18),
                label: Text('Valider ${_p.where((p) => _items(p).isNotEmpty).length} colis'),
              ),
            ),
          ]),
        ),
      ),
    );
  }
}
