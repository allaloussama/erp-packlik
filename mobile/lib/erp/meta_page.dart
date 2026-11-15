import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../theme.dart';
import 'admin_pages.dart';
import 'rules.dart';
import 'rules2.dart';
import 'store.dart';
import 'ui.dart';

/// Coût Meta (meta.js) : comptes Facebook reliés par jeton, comptes publicitaires, campagnes reliées aux produits,
/// et pour chaque produit coût par résultat, par commande confirmée et par commande livrée.
/// Les campagnes sont lues dans l'API Marketing de Meta ; le jeton reste dans les réglages Meta (admin seul).

const _graph = 'https://graph.facebook.com/v21.0';
const _resultActions = {'purchase', 'onsite_conversion.purchase', 'offsite_conversion.fb_pixel_purchase', 'lead', 'onsite_conversion.lead_grouped'};
const _curSuffix = {'DZD': 'DA', 'USD': '\$', 'EUR': '€'};

Future<Doc> graphGet(String path, Map<String, String> params, String token) async {
  http.Response r;
  try {
    r = await http.get(Uri.parse('$_graph/$path').replace(queryParameters: {...params, 'access_token': token})).timeout(const Duration(seconds: 40));
  } catch (_) {
    throw Exception('Connexion à Meta impossible');
  }
  Doc j = {};
  try {
    j = m(jsonDecode(utf8.decode(r.bodyBytes)));
  } catch (_) {}
  if (r.statusCode >= 400 || j['error'] != null) throw Exception(s(m(j['error'])['message']).isEmpty ? 'Meta API ${r.statusCode}' : s(m(j['error'])['message']));
  return j;
}

num _sumResults(Object? acts) => l(acts).map(m).where((a) => _resultActions.contains(a['action_type'])).fold<num>(0, (t, a) => t + n(a['value']));
String _actId(Object? id) => '$id'.startsWith('act_') ? '$id' : 'act_${'$id'.replaceAll(RegExp(r'\D'), '')}';
String _iso(DateTime d) => '${d.year}-${two(d.month)}-${two(d.day)}';
String _norm(String x) => x.toLowerCase().replaceAll(RegExp('[àâä]'), 'a').replaceAll(RegExp('[éèêë]'), 'e').replaceAll(RegExp('[îï]'), 'i').replaceAll(RegExp('[ôö]'), 'o').replaceAll(RegExp('[ùûü]'), 'u').replaceAll('ç', 'c').replaceAll(RegExp(r'[^a-z0-9؀-ۿ]+'), ' ').trim();

extension MetaRules on ErpStore {
  Doc get meta => kv['meta']!;
  List<Doc> get metaAccounts => l(meta['accounts']).map(m).toList();
  String get dispCur => s(meta['dispCur']).isEmpty ? 'DZD' : s(meta['dispCur']);
  num rateDZD(String c) => c == 'DZD' ? 1 : n(m(meta['dispRates'])[c]);

  /// conv() : montant converti dans la devise affichée, ou null si un taux manque.
  num? conv(num amount, String? from) {
    final f = (from ?? 'DZD').toUpperCase(), to = dispCur;
    if (f == to) return amount;
    final a = rateDZD(f);
    if (a == 0) return null;
    if (to == 'DZD') return amount * a;
    final b = rateDZD(to);
    return b == 0 ? null : amount * a / b;
  }

  String mFmt(num? v) => v == null ? '⚠ taux à saisir' : '${money(v).replaceAll(' DZD', '')} ${_curSuffix[dispCur]}';

  Doc? matchProduct(String name) {
    final nn = _norm(name), nt = nn.split(' ').where((w) => w.length > 1).toSet();
    Doc? best;
    var score = 0.0;
    for (final p in products) {
      final pn = _norm(s(p['name']));
      if (pn.isEmpty) continue;
      if (nn.contains(pn)) return p;
      final pt = pn.split(' ').where((w) => w.length > 1).toList();
      if (pt.isEmpty) continue;
      final sc = pt.where(nt.contains).length / pt.length;
      if (sc > score) {
        score = sc;
        best = p;
      }
    }
    return score >= .6 ? best : null;
  }

  String campaignProductId(String accId, String campaign) {
    final map = m(meta['campaignMap']);
    if (map.containsKey('$accId::$campaign')) return s(map['$accId::$campaign']);
    final p = matchProduct(campaign);
    return p == null ? '' : '${p['id']}';
  }

  List<({Doc p, num? spend, num results, int confirmed, int delivered})> clientRows(Doc acc) {
    final ids = <int>{};
    final ads = l(acc['adAccounts']).map(m).toList();
    for (final ad in ads) {
      for (final c in l(ad['campaigns']).map(m)) {
        final pid = campaignProductId(s(acc['id']), s(c['campaign']));
        if (pid.isNotEmpty) ids.add(int.tryParse(pid) ?? -1);
      }
    }
    final stores = ads.map((ad) => s(ad['store'])).where((x) => x.isNotEmpty).toSet();
    return [
      for (final p in products.where((p) => ids.contains(ni(p['id']))))
        () {
          num? spend = 0;
          num results = 0;
          for (final ad in ads) {
            for (final c in l(ad['campaigns']).map(m)) {
              if (campaignProductId(s(acc['id']), s(c['campaign'])) == '${p['id']}') {
                final v = conv(n(c['spend']), s(ad['currency']));
                spend = spend == null || v == null ? null : spend + v;
                results += n(c['results']);
              }
            }
          }
          final os = orders.where((o) => l(o['items']).any((i) => ni(m(i)['pid']) == ni(p['id'])) && (stores.isEmpty || stores.contains(s(o['store']).isEmpty ? 'PackLik' : s(o['store'])))).toList();
          return (p: p, spend: spend, results: results, confirmed: os.where((o) => kConfirmedSt.contains(o['status'])).length, delivered: os.where((o) => kDeliveredSt.contains(o['status'])).length);
        }(),
    ];
  }

  Future<void> addMetaToken(String tok) async {
    final me0 = await graphGet('me', {'fields': 'id,name'}, tok);
    final ads = await graphGet('me/adaccounts', {'fields': 'name,account_id,currency', 'limit': '100'}, tok);
    final list = l(ads['data']).map(m).map((a) => {'id': a['id'], 'accountId': a['account_id'], 'name': a['name'], 'currency': a['currency']}).toList();
    meta['accounts'] = [
      ...metaAccounts.where((a) => a['id'] != me0['id']),
      {'id': me0['id'], 'name': s(me0['name']).isEmpty ? 'Facebook' : me0['name'], 'token': tok, 'refreshedAt': DateTime.now().toIso8601String(), 'adAccounts': list},
    ];
    touch();
  }

  Future<String> syncAd(Doc acc, Doc ad) async {
    final since = s(ad['from']).isNotEmpty ? s(ad['from']) : _iso(DateTime.now().subtract(const Duration(days: 365 * 3)));
    final until = s(ad['to']).isNotEmpty ? s(ad['to']) : _iso(DateTime.now());
    final range = jsonEncode({'since': since, 'until': until});
    final tok = s(acc['token']);
    final ins = await graphGet('${_actId(ad['id'])}/insights', {'level': 'account', 'fields': 'spend,actions', 'time_range': range, 'time_increment': 'monthly', 'limit': '500'}, tok);
    final camp = await graphGet('${_actId(ad['id'])}/insights', {'level': 'campaign', 'fields': 'campaign_name,spend,impressions,clicks,ctr,cpc,cpm,actions', 'time_range': range, 'limit': '500'}, tok);
    final rows = l(camp['data']).map(m).map((r) => <String, dynamic>{'campaign': s(r['campaign_name']).isEmpty ? '—' : r['campaign_name'], 'spend': s(r['spend']).isEmpty ? '0' : r['spend'], 'results': '${_sumResults(r['actions'])}', 'impressions': r['impressions'] ?? '0', 'clicks': r['clicks'] ?? '0', 'ctr': r['ctr'] ?? '0', 'cpc': r['cpc'] ?? '0', 'cpm': r['cpm'] ?? '0'}).toList();
    Doc list = {};
    try {
      list = await graphGet('${_actId(ad['id'])}/campaigns', {'fields': 'name,effective_status', 'limit': '500'}, tok);
    } catch (_) {}
    final status = {for (final c in l(list['data']).map(m)) s(c['name']): s(c['effective_status'])};
    for (final r in rows) {
      if (status[r['campaign']] != null) r['status'] = status[r['campaign']];
    }
    final seen = rows.map((r) => r['campaign']).toSet();
    for (final c in l(list['data']).map(m)) {
      if (s(c['name']).isNotEmpty && seen.add(c['name'])) rows.add({'campaign': c['name'], 'status': c['effective_status'], 'spend': '0', 'results': '0'});
    }
    rows.sort((a, b) => n(b['spend']).compareTo(n(a['spend'])));
    ad['insights'] = l(ins['data']).map(m).map((r) => {'month': s(r['date_start']).length >= 7 ? s(r['date_start']).substring(0, 7) : '', 'spend': s(r['spend']).isEmpty ? '0' : r['spend'], 'results': '${_sumResults(r['actions'])}'}).toList();
    ad['campaigns'] = rows;
    touch();
    return 'Synchronisé depuis Meta';
  }
}

class MetaPage extends StatefulWidget {
  const MetaPage({super.key, required this.store});
  final ErpStore store;
  @override
  State<MetaPage> createState() => _MetaPageState();
}

class _MetaPageState extends State<MetaPage> {
  final _tok = TextEditingController();
  bool _loading = false;
  String? _err;
  final Map<String, String> _msg = {};
  String? _syncing;

  @override
  void dispose() {
    _tok.dispose();
    super.dispose();
  }

  Future<void> _addToken() async {
    final t = _tok.text.trim();
    if (t.isEmpty) return;
    setState(() {
      _loading = true;
      _err = null;
    });
    final st = widget.store;
    try {
      await st.addMetaToken(t);
      _tok.clear();
      if (mounted) toast(context, 'Compte Facebook ajouté');
      await _syncAccount(st.metaAccounts.last);
    } catch (e) {
      _err = '$e'.replaceFirst('Exception: ', '');
    }
    if (mounted) setState(() => _loading = false);
  }

  Future<void> _syncAccount(Doc acc) async {
    final st = widget.store;
    final real = l(st.meta['accounts']).cast<Map>().firstWhere((a) => a['id'] == acc['id'], orElse: () => {});
    for (final ad in l(real['adAccounts'])) {
      final a = ad as Map<String, dynamic>;
      setState(() => _syncing = s(a['id']));
      try {
        _msg[s(a['id'])] = await st.syncAd(m(real), a);
      } catch (e) {
        _msg[s(a['id'])] = '⚠ ${'$e'.replaceFirst('Exception: ', '')}';
      }
    }
    if (mounted) setState(() => _syncing = null);
  }

  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    final accs = st.metaAccounts;
    num? tSpend = 0;
    num tRes = 0;
    var tConf = 0, tDel = 0;
    for (final a in accs) {
      for (final r in st.clientRows(a)) {
        tSpend = tSpend == null || r.spend == null ? null : tSpend + r.spend!;
        tRes += r.results;
        tConf += r.confirmed;
        tDel += r.delivered;
      }
    }
    final need = <String>{};
    for (final a in accs) {
      for (final ad in l(a['adAccounts']).map(m)) {
        final f = (s(ad['currency']).isEmpty ? 'DZD' : s(ad['currency'])).toUpperCase();
        if (f != st.dispCur && f != 'DZD') need.add(f);
      }
    }
    if (st.dispCur != 'DZD') need.add(st.dispCur);
    return ListView(padding: const EdgeInsets.all(12), children: [
      const Text('Coût final par commande à partir des publicités Meta', style: TextStyle(color: kMuted)),
      const SizedBox(height: 8),
      SegmentedButton<String>(
        segments: const [ButtonSegment(value: 'DZD', label: Text('DZD')), ButtonSegment(value: 'USD', label: Text('USD')), ButtonSegment(value: 'EUR', label: Text('EUR'))],
        selected: {st.dispCur},
        onSelectionChanged: (v) {
          st.meta['dispCur'] = v.first;
          st.touch();
        },
      ),
      for (final c in need)
        NumTile('1 $c = … DA', st.rateDZD(c), (v) {
          st.meta['dispRates'] = {...m(st.meta['dispRates']), c: '$v'};
          st.touch();
        }, decimal: true),
      const SizedBox(height: 10),
      KpiGrid([
        Kpi('Montant dépensé', st.mFmt(tSpend), accent: true),
        Kpi('Résultats', '${tRes.round()}'),
        Kpi('Coût/résultat moyen', tSpend == null ? st.mFmt(null) : st.mFmt(tRes > 0 ? tSpend / tRes : 0)),
        Kpi('Coût confirmation moyen', tSpend == null ? st.mFmt(null) : st.mFmt(tConf > 0 ? tSpend / tConf : 0)),
        Kpi('Coût livré moyen', tSpend == null ? st.mFmt(null) : st.mFmt(tDel > 0 ? tSpend / tDel : 0)),
      ]),
      const SizedBox(height: 10),
      for (final acc in accs) _account(st, acc),
      Section(title: 'Ajouter un compte Facebook', children: [
        const Padding(padding: EdgeInsets.fromLTRB(14, 0, 14, 6), child: Text('Collez un jeton d\'accès Meta (droit ads_read). La connexion par « Se connecter avec Facebook » se fait depuis le site.', style: TextStyle(color: kMuted, fontSize: 12.5))),
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 0, 12, 4),
          child: Row(children: [
            Expanded(child: TextField(controller: _tok, decoration: const InputDecoration(hintText: 'Jeton d\'accès Meta…', isDense: true))),
            const SizedBox(width: 8),
            FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(64, 44)), onPressed: _loading ? null : _addToken, child: Text(_loading ? '…' : 'OK')),
          ]),
        ),
        if (_err != null) Padding(padding: const EdgeInsets.fromLTRB(14, 4, 14, 4), child: Text(_err!, style: const TextStyle(color: kRed, fontSize: 12.5))),
      ]),
    ]);
  }

  Widget _account(ErpStore st, Doc acc) {
    final rows = st.clientRows(acc);
    final ads = l(acc['adAccounts']).map(m).toList();
    num? total = 0;
    for (final ad in ads) {
      final v = st.conv(l(ad['insights']).fold<num>(0, (t, i) => t + n(m(i)['spend'])), s(ad['currency']));
      total = total == null || v == null ? null : total + v;
    }
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Section(
        title: s(acc['name']),
        trailing: Row(mainAxisSize: MainAxisSize.min, children: [
          IconButton(tooltip: 'Synchroniser les campagnes', onPressed: _syncing != null ? null : () => _syncAccount(acc), icon: const Icon(Icons.sync)),
          IconButton(tooltip: 'Supprimer', icon: const Icon(Icons.delete_outline, color: kRed), onPressed: () async {
            if (!await confirmDialog(context, 'Retirer ce compte Facebook ?', s(acc['name']), ok: 'Retirer', danger: true)) return;
            st.meta['accounts'] = st.metaAccounts.where((a) => a['id'] != acc['id']).toList();
            st.touch();
          }),
        ]),
        children: [
          Row2('Montant dépensé', st.mFmt(total), bold: true),
          for (final r in rows)
            ListTile(
              dense: true,
              title: Text(s(r.p['name']), style: const TextStyle(fontWeight: FontWeight.w700)),
              subtitle: Text('Dépensé ${r.spend == null ? st.mFmt(null) : st.mFmt(r.spend)} · ${r.results.round()} résultats · coût/résultat ${r.results > 0 && r.spend != null ? st.mFmt(r.spend! / r.results) : '—'}\nCoût confirmation ${r.confirmed > 0 && r.spend != null ? st.mFmt(r.spend! / r.confirmed) : '—'} · coût livré ${r.delivered > 0 && r.spend != null ? st.mFmt(r.spend! / r.delivered) : '—'}'),
              isThreeLine: true,
            ),
          if (rows.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun produit lié aux campagnes de ce compte.', style: TextStyle(color: kMuted))),
          for (final ad in ads)
            ExpansionTile(
              title: Text(s(ad['name']), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
              subtitle: Text('${s(ad['currency'])} · ${l(ad['campaigns']).length} campagnes${_msg[s(ad['id'])] != null ? ' · ${_msg[s(ad['id'])]}' : ''}${_syncing == s(ad['id']) ? ' · synchronisation…' : ''}'),
              children: [
                for (final c in l(ad['campaigns']).map(m))
                  ListTile(
                    dense: true,
                    title: Text(s(c['campaign'])),
                    subtitle: Text('${st.mFmt(st.conv(n(c['spend']), s(ad['currency'])))} · ${n(c['results']).round()} résultats${s(c['status']).isNotEmpty ? ' · ${s(c['status'])}' : ''}'),
                    trailing: SizedBox(
                      width: 140,
                      child: DropdownButton<String>(
                        isExpanded: true,
                        value: () {
                          final map = m(st.meta['campaignMap']);
                          final key = '${acc['id']}::${c['campaign']}';
                          return map.containsKey(key) ? s(map[key]) : 'auto';
                        }(),
                        items: [
                          DropdownMenuItem(value: 'auto', child: Text('Auto (${s(st.matchProduct(s(c['campaign']))?['name']).isEmpty ? '—' : s(st.matchProduct(s(c['campaign']))!['name'])})', overflow: TextOverflow.ellipsis)),
                          const DropdownMenuItem(value: '', child: Text('Aucun produit')),
                          for (final p in st.products.where((p) => p['status'] != 'corbeille')) DropdownMenuItem(value: '${p['id']}', child: Text(s(p['name']), overflow: TextOverflow.ellipsis)),
                        ],
                        onChanged: (v) {
                          final map = {...m(st.meta['campaignMap'])};
                          final key = '${acc['id']}::${c['campaign']}';
                          if (v == 'auto') {
                            map.remove(key);
                          } else {
                            map[key] = v;
                          }
                          st.meta['campaignMap'] = map;
                          st.touch();
                        },
                      ),
                    ),
                  ),
                if (l(ad['campaigns']).isEmpty) const Padding(padding: EdgeInsets.all(12), child: Text('Synchronisez pour lire les campagnes', style: TextStyle(color: kMuted))),
              ],
            ),
        ],
      ),
    );
  }
}
