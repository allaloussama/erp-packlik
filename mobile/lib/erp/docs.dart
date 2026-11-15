import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

import '../config.dart';
import '../theme.dart';
import 'admin_pages.dart';
import 'rules.dart';
import 'rules2.dart';
import 'store.dart';
import 'ui.dart';

/// Factures et documents (documents.js) : facture, proforma, bon de livraison, décharge, numérotés à la suite,
/// rangés sur la commande (o.docs), imprimés ou partagés en PDF depuis le téléphone.

const kDocTypes = {
  'facture': (label: 'Facture', title: 'FACTURE', prices: true),
  'proforma': (label: 'Facture proforma', title: 'FACTURE PROFORMA', prices: true),
  'bl': (label: 'Bon de livraison', title: 'BON DE LIVRAISON', prices: false),
  'decharge': (label: 'Décharge', title: 'DÉCHARGE', prices: false),
};

extension DocRules on ErpStore {
  /// docCo() : informations de l'entreprise imprimées sur les documents.
  Doc docCo() => {
        'name': 'PackLik', 'address': 'Bt 115 cité, Douéra, Alger, Algérie', 'phone': '0549 59 31 60 / 0540 02 19 14', 'email': 'support@packlik.com', 'site': 'packlik.shop',
        'nif': '', 'rc': '', 'nis': '', 'ai': '', 'rib': '', 'tva': 0, 'color': '#FD6400', 'footer': 'Merci pour votre confiance.', 'autoBl': true, 'autoFacture': true, 'validity': 15,
        ...m(settings['docs']),
      };
}

String _cap(String x) => x.isEmpty ? x : x[0].toUpperCase() + x.substring(1);
String _kg(double v) => '${((v * 10).round() / 10).toString().replaceAll('.', ',')} kg';

Future<Uint8List> buildDocPdf(ErpStore st, Doc o, String type, PdfPageFormat format) async {
  final D = kDocTypes[type]!, d = m(m(o['docs'])[type]), co = st.docCo(), c = st.customerOf(o);
  pw.ThemeData theme;
  try {
    theme = pw.ThemeData.withFont(base: await PdfGoogleFonts.notoSansRegular(), bold: await PdfGoogleFonts.notoSansBold());
  } catch (_) {
    theme = pw.ThemeData.base(); // hors ligne : police intégrée
  }
  pw.ImageProvider? logo;
  try {
    logo = await networkImage(absUrl('assets/brand/logo.png'));
  } catch (_) {}
  final color = PdfColor.fromHex(s(co['color']).isEmpty ? '#FD6400' : s(co['color']));
  final lines = [
    for (final i in l(o['items']).map(m).where((i) => st.pby[ni(i['pid'])] != null))
      () {
        final p = st.pby[ni(i['pid'])]!;
        final v = i['v'] != null ? s(l(p['variants']).map(m).where((x) => s(x['id']) == s(i['v'])).firstOrNull?['label']) : '';
        return (sku: s(p['sku']), name: '${s(p['name'])}${v.isNotEmpty ? ' ($v)' : ''}', q: ni(i['q']), pu: ni(i['price']), tot: ni(i['price']) * ni(i['q']), kg: n(p['weight']) * ni(i['q']) / 1000);
      }(),
  ];
  final sub = st.orderSub(o), disc = st.discountAmt(o), fee = st.feeOf(o), ttc = st.orderTotal(o), tva = n(co['tva']);
  final ht = (ttc / (1 + tva / 100)).round(), tvaAmt = ttc - ht;
  final legal = [('NIF', co['nif']), ('RC', co['rc']), ('NIS', co['nis']), ('AI', co['ai'])].where((x) => s(x.$2).isNotEmpty).map((x) => '${x.$1} : ${x.$2}').join(' · ');
  final addr = [s(o['address']), s(o['commune']), st.wName(o['wilaya'])].where((x) => x.isNotEmpty && x != '—').join(', ');
  const small = pw.TextStyle(fontSize: 8.5, color: PdfColors.grey700);
  pw.Widget box(String label, String body) => pw.Expanded(
        child: pw.Container(
          padding: const pw.EdgeInsets.all(8),
          decoration: pw.BoxDecoration(border: pw.Border.all(color: PdfColors.grey400), borderRadius: pw.BorderRadius.circular(4)),
          child: pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [pw.Text(label, style: small), pw.SizedBox(height: 3), pw.Text(body, style: const pw.TextStyle(fontSize: 9.5))]),
        ),
      );
  final table = pw.TableHelper.fromTextArray(
    headerDecoration: pw.BoxDecoration(color: color),
    headerStyle: pw.TextStyle(color: PdfColors.white, fontWeight: pw.FontWeight.bold, fontSize: 9),
    cellStyle: const pw.TextStyle(fontSize: 9),
    cellAlignments: {2: pw.Alignment.centerRight, 3: pw.Alignment.centerRight, 4: pw.Alignment.centerRight},
    headers: ['Réf.', 'Désignation', 'Qté', if (D.prices) ...['Prix unitaire', 'Montant'] else 'Poids'],
    data: [
      for (final x in lines) [x.sku, x.name, '${x.q}', if (D.prices) ...[money(x.pu), money(x.tot)] else _kg(x.kg.toDouble())],
      if (D.prices && fee > 0) ['', 'Frais de livraison — ${st.wName(o['wilaya'])}', '1', money(fee), money(fee)],
    ],
  );
  pw.Widget totRow(String a, String b, {bool grand = false}) => pw.Container(
        color: grand ? color : null,
        padding: const pw.EdgeInsets.symmetric(horizontal: 6, vertical: 3),
        child: pw.Row(mainAxisAlignment: pw.MainAxisAlignment.spaceBetween, children: [
          pw.Text(a, style: pw.TextStyle(fontSize: 9.5, color: grand ? PdfColors.white : null, fontWeight: grand ? pw.FontWeight.bold : null)),
          pw.Text(b, style: pw.TextStyle(fontSize: 9.5, color: grand ? PdfColors.white : null, fontWeight: grand ? pw.FontWeight.bold : null)),
        ]),
      );
  final doc = pw.Document(theme: theme, title: '${D.label} ${s(d['no'])}', author: s(co['name']));
  doc.addPage(pw.MultiPage(
    pageFormat: format,
    margin: const pw.EdgeInsets.all(32),
    footer: (ctx) => pw.Center(child: pw.Text('${s(co['footer'])}${s(co['rib']).isNotEmpty ? ' · RIB : ${s(co['rib'])}' : ''}', style: small)),
    build: (ctx) => [
      pw.Row(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
        pw.Expanded(child: pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
          if (logo != null) pw.Image(logo, height: 34) else pw.Text(s(co['name']), style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold, color: color)),
          pw.SizedBox(height: 6),
          pw.Text(s(co['name']), style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10)),
          pw.Text(s(co['address']), style: small),
          pw.Text('${s(co['phone'])}${s(co['email']).isNotEmpty ? ' · ${s(co['email'])}' : ''}${s(co['site']).isNotEmpty ? ' · ${s(co['site'])}' : ''}', style: small),
          if (legal.isNotEmpty) pw.Text(legal, style: small),
        ])),
        pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
          pw.Text(D.title, style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold, color: color)),
          pw.SizedBox(height: 4),
          pw.Text('N° ${s(d['no'])}', style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10)),
          pw.Text('Date ${fDate(n(d['at']) == 0 ? now() : n(d['at']))}', style: const pw.TextStyle(fontSize: 9.5)),
          pw.Text('Commande ${s(o['ref'])}', style: const pw.TextStyle(fontSize: 9.5)),
          if (type == 'proforma') pw.Text('Validité ${co['validity']} jours', style: const pw.TextStyle(fontSize: 9.5)),
          if (s(o['tracking']).isNotEmpty && type != 'proforma') pw.Text('Suivi ${s(o['tracking'])}', style: const pw.TextStyle(fontSize: 9.5)),
        ]),
      ]),
      pw.SizedBox(height: 14),
      pw.Row(children: [
        box(type == 'decharge' ? 'Remis par' : 'Vendeur', '${s(co['name'])}\n${s(co['address'])}'),
        pw.SizedBox(width: 10),
        box(type == 'bl' || type == 'decharge' ? 'Destinataire' : 'Client',
            '${s(c['name']).isEmpty ? '—' : s(c['name'])}\n${s(c['phone'])}${s(c['phone2']).isNotEmpty ? ' / ${s(c['phone2'])}' : ''}\n$addr\n${o['delivery'] == 'desk' ? 'Livraison au bureau (stop desk)' : 'Livraison à domicile'} · ${st.carrierName(st.carrierOf(o))}'),
      ]),
      pw.SizedBox(height: 14),
      if (type == 'decharge') ...[
        pw.Text('Je soussigné(e) ${s(c['name']).isEmpty ? '……………………' : s(c['name'])}, demeurant à ${addr.isEmpty ? '……………………' : addr}, reconnais avoir reçu de ${s(co['name'])} la marchandise désignée ci-dessous, en bon état et conforme à ma commande ${s(o['ref'])}, et avoir réglé la somme de ${money(ttc)} (${frWords(ttc)} dinars algériens).', style: const pw.TextStyle(fontSize: 10, lineSpacing: 2)),
        pw.SizedBox(height: 6),
        pw.Text('Je décharge ${s(co['name'])} de toute responsabilité concernant cette livraison.', style: const pw.TextStyle(fontSize: 10)),
        pw.SizedBox(height: 10),
      ],
      table,
      pw.SizedBox(height: 10),
      if (D.prices && type != 'decharge') ...[
        pw.Align(
          alignment: pw.Alignment.centerRight,
          child: pw.SizedBox(width: 240, child: pw.Column(children: [
            totRow('Sous-total produits', money(sub)),
            if (disc > 0) totRow('Remise', '− ${money(disc)}'),
            totRow('Livraison', o['freeShip'] == true ? 'Gratuite' : money(fee)),
            if (tva > 0) ...[totRow('Total HT', money(ht)), totRow('TVA $tva %', money(tvaAmt))],
            totRow(tva > 0 ? 'Total TTC' : 'Total à payer', money(ttc), grand: true),
          ])),
        ),
        pw.SizedBox(height: 8),
        pw.Text('Arrêté${type == 'facture' ? 'e la présente facture' : ' le présent document'} à la somme de : ${_cap(frWords(ttc))} dinars algériens.', style: const pw.TextStyle(fontSize: 9.5)),
      ] else
        pw.Text('Nombre de colis : ${st.parcelsOf(o).length} · Poids total : ${_kg(st.orderWeight(o))}${type == 'bl' ? ' · Montant à encaisser à la livraison : ${money(ttc)}' : ''}', style: const pw.TextStyle(fontSize: 9.5)),
      pw.SizedBox(height: 30),
      pw.Row(children: [
        pw.Expanded(child: pw.Container(height: 60, padding: const pw.EdgeInsets.all(6), decoration: pw.BoxDecoration(border: pw.Border.all(color: PdfColors.grey400)), child: pw.Text(type == 'bl' || type == 'decharge' ? 'Signature du livreur' : 'Cachet et signature', style: small))),
        pw.SizedBox(width: 10),
        pw.Expanded(child: pw.Container(height: 60, padding: const pw.EdgeInsets.all(6), decoration: pw.BoxDecoration(border: pw.Border.all(color: PdfColors.grey400)), child: pw.Text(type == 'facture' || type == 'proforma' ? 'Signature du client' : 'Signature du destinataire (lu et approuvé)', style: small))),
      ]),
    ],
  ));
  return doc.save();
}

Future<void> openDocument(BuildContext context, ErpStore st, Doc o, String type) async {
  st.docEnsure(o, type);
  st.touch();
  final d = m(m(o['docs'])[type]);
  await Navigator.of(context).push(MaterialPageRoute(builder: (_) => Scaffold(
        appBar: AppBar(title: Text('${kDocTypes[type]!.label} · ${s(d['no'])}')),
        body: Column(children: [
          if (s(d['html']).isNotEmpty)
            const MaterialBanner(content: Text('Ce document a été modifié à la main sur le site : ici, la version remplie automatiquement depuis la commande.'), actions: [SizedBox.shrink()]),
          Expanded(child: PdfPreview(
            build: (f) => buildDocPdf(st, o, type, f),
            initialPageFormat: PdfPageFormat.a4,
            canChangeOrientation: false,
            canDebug: false,
            pdfFileName: '${s(d['no'])}.pdf',
          )),
        ]),
      )));
}

class DocumentsPage extends StatefulWidget {
  const DocumentsPage({super.key, required this.store});
  final ErpStore store;
  @override
  State<DocumentsPage> createState() => _DocumentsPageState();
}

class _DocumentsPageState extends State<DocumentsPage> {
  String _type = 'facture', _q = '';

  @override
  Widget build(BuildContext context) {
    final st = widget.store;
    return Column(children: [
      SizedBox(
        height: 48,
        child: ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.fromLTRB(12, 8, 12, 0), children: [
          for (final e in kDocTypes.entries)
            Padding(padding: const EdgeInsetsDirectional.only(end: 6), child: ChoiceChip(label: Text('${e.value.label}  ${st.orders.where((o) => m(o['docs'])[e.key] != null).length}'), selected: _type == e.key, selectedColor: const Color(0xFFFFE3CF), onSelected: (_) => setState(() => _type = e.key))),
          ChoiceChip(avatar: const Icon(Icons.settings_outlined, size: 16), label: const Text('Modèle et entreprise'), selected: _type == 'model', selectedColor: const Color(0xFFFFE3CF), onSelected: (_) => setState(() => _type = 'model')),
        ]),
      ),
      Expanded(child: _type == 'model' ? _model(st) : _list(st)),
    ]);
  }

  Widget _model(ErpStore st) {
    final co = st.docCo();
    void set(String k, Object v) {
      st.settings['docs'] = {...m(st.settings['docs']), k: v};
      st.touch();
    }
    const fields = [('name', 'Raison sociale'), ('address', 'Adresse'), ('phone', 'Téléphone'), ('email', 'E-mail'), ('site', 'Site web'), ('rib', 'RIB / CCP'), ('nif', 'NIF'), ('rc', 'RC (registre du commerce)'), ('nis', 'NIS'), ('ai', 'Article d\'imposition'), ('footer', 'Pied de page'), ('color', 'Couleur (#RRGGBB)')];
    return ListView(padding: const EdgeInsets.all(12), children: [
      const Text('Ces informations apparaissent sur tous les documents.', style: TextStyle(color: kMuted)),
      const SizedBox(height: 8),
      Card(child: Column(children: [
        for (final f in fields) TextTile(f.$2, s(co[f.$1]), (v) => set(f.$1, v)),
        NumTile('TVA (%)', n(co['tva']), (v) => set('tva', v)),
        NumTile('Validité proforma (jours)', n(co['validity']), (v) => set('validity', v)),
        SwitchListTile(dense: true, value: co['autoBl'] != false, title: const Text('Créer automatiquement le bon de livraison à l\'expédition'), onChanged: (v) => set('autoBl', v)),
        SwitchListTile(dense: true, value: co['autoFacture'] != false, title: const Text('Créer automatiquement la facture à la livraison'), onChanged: (v) => set('autoFacture', v)),
      ])),
    ]);
  }

  Widget _list(ErpStore st) {
    final q = _q.toLowerCase();
    final list = st.orders.where((o) => m(o['docs'])[_type] != null).where((o) => q.isEmpty || s(m(m(o['docs'])[_type])['no']).toLowerCase().contains(q) || s(o['ref']).toLowerCase().contains(q) || s(st.customerOf(o)['name']).toLowerCase().contains(q)).toList()
      ..sort((a, b) => n(m(m(b['docs'])[_type])['at']).compareTo(n(m(m(a['docs'])[_type])['at'])));
    return Column(children: [
      SearchField(hint: 'Rechercher n°, commande, client…', onChanged: (v) => setState(() => _q = v.trim())),
      Padding(
        padding: const EdgeInsets.fromLTRB(12, 0, 12, 6),
        child: FilledButton.icon(
          style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(44)),
          onPressed: () async {
            final cand = st.orders.where((o) => m(o['docs'])[_type] == null && o['status'] != 'cancelled').toList()..sort((a, b) => n(b['created']).compareTo(n(a['created'])));
            final o = await showModalBottomSheet<Doc>(context: context, isScrollControlled: true, builder: (_) => _OrderPicker(store: st, list: cand.take(300).toList()));
            if (o != null && mounted) openDocument(context, st, o, _type);
          },
          icon: const Icon(Icons.add),
          label: Text('Créer : ${kDocTypes[_type]!.label.toLowerCase()}'),
        ),
      ),
      Expanded(
        child: list.isEmpty
            ? const Empty('Aucun document pour l\'instant', icon: Icons.receipt_long_outlined)
            : ListView.builder(
                padding: const EdgeInsets.fromLTRB(12, 0, 12, 24),
                itemCount: list.length,
                itemBuilder: (c, i) {
                  final o = list[i], d = m(m(o['docs'])[_type]);
                  return Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      title: Text('${s(d['no'])} · ${s(o['ref'])}', style: const TextStyle(fontWeight: FontWeight.w800)),
                      subtitle: Text('${fDate(n(d['at']))} · ${s(st.customerOf(o)['name'])} · ${st.wName(o['wilaya'])}\n${st.stName(s(o['status']), o)}${s(d['html']).isNotEmpty ? ' · modifié' : ''}'),
                      isThreeLine: true,
                      trailing: Text(money(st.orderTotal(o)), style: const TextStyle(fontWeight: FontWeight.w800)),
                      onTap: () => openDocument(context, st, o, _type),
                    ),
                  );
                },
              ),
      ),
    ]);
  }
}

class _OrderPicker extends StatefulWidget {
  const _OrderPicker({required this.store, required this.list});
  final ErpStore store;
  final List<Doc> list;
  @override
  State<_OrderPicker> createState() => _OrderPickerState();
}

class _OrderPickerState extends State<_OrderPicker> {
  String _q = '';
  @override
  Widget build(BuildContext context) {
    final st = widget.store, q = _q.toLowerCase();
    final list = widget.list.where((o) => q.isEmpty || s(o['ref']).toLowerCase().contains(q) || s(st.customerOf(o)['name']).toLowerCase().contains(q)).toList();
    return DraggableScrollableSheet(
      expand: false, initialChildSize: .85,
      builder: (c, sc) => Column(children: [
        SearchField(hint: 'Choisir une commande…', onChanged: (v) => setState(() => _q = v.trim())),
        Expanded(child: ListView.builder(controller: sc, itemCount: list.length, itemBuilder: (c, i) => ListTile(
              title: Text('${s(list[i]['ref'])} · ${s(st.customerOf(list[i])['name'])}'),
              subtitle: Text(money(st.orderTotal(list[i]))),
              onTap: () => Navigator.pop(context, list[i]),
            ))),
      ]),
    );
  }
}
