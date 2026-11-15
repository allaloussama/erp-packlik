import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

import '../config.dart';
import '../theme.dart';
import 'admin_pages.dart';
import 'net.dart';
import 'rules.dart';
import 'store.dart';
import 'ui.dart';

/// Boutique (shop-plus.js) : slides de l'accueil, formulaire de commande, fiche produit, textes, en-tête et pied de page.
/// Tout est rangé dans SETTINGS.site, lu par la boutique du site et par la boutique de l'application.

const _formDef = {'title': 'Commandez maintenant, payez à la livraison', 'sub': 'Remplissez vos informations, nous vous appelons pour confirmer', 'button': 'Commander maintenant', 'addCart': true, 'assure': true, 'color': ''};
const _fieldsDef = <Map<String, dynamic>>[
  {'key': 'name', 'label': 'Nom complet', 'placeholder': 'Nom et prénom', 'type': 'text', 'required': true, 'show': true, 'lock': true},
  {'key': 'phone', 'label': 'Téléphone', 'placeholder': '05 XX XX XX XX', 'type': 'tel', 'required': true, 'show': true, 'lock': true},
  {'key': 'wilaya', 'label': 'Wilaya', 'type': 'select', 'required': true, 'show': true, 'lock': true},
  {'key': 'commune', 'label': 'Commune', 'type': 'select', 'required': true, 'show': true, 'lock': true},
  {'key': 'delivery', 'label': 'Mode de livraison', 'type': 'delivery', 'required': true, 'show': true, 'lock': true, 'full': true},
  {'key': 'address', 'label': 'Adresse (facultatif)', 'placeholder': 'Quartier, rue, repère…', 'type': 'text', 'required': false, 'show': true, 'full': true},
];
const _pdpBlocks = [('badges', 'Badges et catégories'), ('title', 'Nom du produit'), ('price', 'Prix'), ('short', 'Description courte'), ('meta', 'Conditionnement, référence, stock'), ('pack', 'Contenu du pack'), ('form', 'Formulaire de commande'), ('desc', 'Description complète')];
const _fieldTypes = [('text', 'Texte court'), ('textarea', 'Texte long'), ('number', 'Nombre'), ('email', 'E-mail'), ('date', 'Date'), ('select', 'Liste de choix'), ('checkbox', 'Case à cocher')];

extension SiteRules on ErpStore {
  /// site() : SETTINGS.site, avec texts / form / pdp toujours des objets.
  Doc site() {
    if (settings['site'] is! Map) settings['site'] = <String, dynamic>{};
    final x = settings['site'] as Map<String, dynamic>;
    for (final k in ['texts', 'form', 'pdp']) {
      if (x.containsKey(k) && x[k] is! Map) x[k] = <String, dynamic>{};
    }
    return x;
  }

  List<Doc> formFields() {
    final saved = l(m(site()['form'])['fields']);
    if (saved.isEmpty) return _fieldsDef.map((f) => {...f}).toList();
    final out = saved.map(m).map((f) {
      final d = _fieldsDef.where((x) => x['key'] == f['key']).firstOrNull;
      return d != null ? {...d, ...f, 'lock': d['lock'], 'type': d['type'], if (d['lock'] == true) ...{'required': true, 'show': true}} : {...f};
    }).toList();
    for (final d in _fieldsDef) {
      if (!out.any((f) => f['key'] == d['key'])) out.add({...d});
    }
    return out;
  }

  void saveFields(List<Doc> fs) {
    site()['form'] = {...m(site()['form']), 'fields': fs.map((f) => {...f}..remove('lock')).toList()};
    touch();
  }

  ({bool galleryRight, bool related, List<String> order}) pdpLayout() {
    final p = m(site()['pdp']);
    final order = (l(p['order']).isNotEmpty ? l(p['order']).map((e) => '$e') : ['badges', 'title', 'price', 'short', 'meta', 'pack', 'form']).where((k) => _pdpBlocks.any((b) => b.$1 == k)).toList();
    return (galleryRight: p['galleryRight'] == true, related: p['related'] != false, order: order);
  }
}

Future<String?> pickAndUpload(BuildContext context, ErpNet net) async {
  final files = await FilePicker.pickFiles(type: FileType.image);
  if (files.isEmpty) return null;
  final f = files.first;
  try {
    return await net.upload(await f.xFile.readAsBytes(), f.name);
  } on ErpError catch (e) {
    if (context.mounted) toast(context, e.message, bad: true);
    return null;
  }
}

class SitePage extends StatelessWidget {
  const SitePage({super.key, required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) => Tabbed(tabs: [
        ('Slides de l\'accueil', _Slides(store: store)),
        ('Formulaire de commande', _Form(store: store)),
        ('Fiche produit', _Pdp(store: store)),
        ('Textes des pages', _Texts(store: store)),
        ('En-tête et pied de page', _Brand(store: store)),
        ('Pages', const _PagesNote()),
      ]);
}

class _Slides extends StatelessWidget {
  const _Slides({required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, sx = st.site();
    final slides = l(sx['slides']).map(m).toList();
    Doc def(int pid, Map<String, dynamic> x) => {...x, 'img': l(st.pby[pid]?['images']).isNotEmpty ? s(l(st.pby[pid]!['images']).first) : ''};
    final defaults = [
      def(5, {'badge': 'Emballage personnalisé', 'title': 'Prix compétitifs – emballage personnalisé selon votre marque', 'text': 'Boîtes, barquettes, bowls, sacs craft et papier imprimés à votre logo, pour restaurants, fast-foods et pâtisseries.', 'button': 'Contactez-nous', 'link': '#/contact', 'bg': '#FFE7D6', 'color': '#1B232B', 'on': true}),
      def(45, {'badge': 'PACK PROMO', 'title': 'Offres exclusives à ne pas manquer', 'text': 'Des packs complets prêts à l\'emploi pour démarrer votre service à emporter au meilleur prix.', 'button': 'Acheter', 'link': '#/categorie/pack-promo', 'bg': '#182028', 'color': '#FFFFFF', 'on': true}),
    ];
    void save() => st.touch();
    return ListView(padding: const EdgeInsets.all(12), children: [
      const Text('Photo, badge, titre, texte, bouton, lien et couleurs de chaque slide. Les slides défilent toutes les 5 secondes.', style: TextStyle(color: kMuted, fontSize: 12.5)),
      const SizedBox(height: 8),
      Wrap(spacing: 8, runSpacing: 8, children: [
        if (slides.isEmpty) OutlinedButton.icon(onPressed: () {
          sx['slides'] = defaults;
          save();
        }, icon: const Icon(Icons.copy), label: const Text('Partir des slides actuelles')),
        FilledButton.icon(style: FilledButton.styleFrom(minimumSize: const Size(0, 44)), onPressed: () {
          sx['slides'] = [...(slides.isEmpty ? defaults : l(sx['slides'])), {'badge': '', 'title': 'Nouvelle slide', 'text': '', 'button': 'Découvrir', 'link': '#/boutique', 'img': '', 'bg': '#FFE7D6', 'color': '#1B232B', 'on': true}];
          save();
        }, icon: const Icon(Icons.add), label: const Text('Ajouter une slide')),
      ]),
      const SizedBox(height: 10),
      if (slides.isEmpty) const Empty('Les slides par défaut sont affichées. Partez d\'elles ou ajoutez la vôtre.', icon: Icons.view_carousel_outlined),
      for (var i = 0; i < slides.length; i++)
        Card(
          margin: const EdgeInsets.only(bottom: 10),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Container(
              height: 110,
              decoration: BoxDecoration(color: hex(s(slides[i]['bg']).isEmpty ? '#FFE7D6' : s(slides[i]['bg'])), borderRadius: const BorderRadius.vertical(top: Radius.circular(14))),
              padding: const EdgeInsets.all(12),
              child: Row(children: [
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [
                  Text(s(slides[i]['badge']), style: TextStyle(fontSize: 11, color: hex(s(slides[i]['color']).isEmpty ? '#1B232B' : s(slides[i]['color'])))),
                  Text(s(slides[i]['title']), maxLines: 3, overflow: TextOverflow.ellipsis, style: TextStyle(fontWeight: FontWeight.w900, color: hex(s(slides[i]['color']).isEmpty ? '#1B232B' : s(slides[i]['color'])))),
                ])),
                if (s(slides[i]['img']).isNotEmpty) Image.network(absUrl(s(slides[i]['img'])), width: 90, height: 90, fit: BoxFit.contain, errorBuilder: (_, _, _) => const SizedBox(width: 90)),
              ]),
            ),
            for (final f in const [('badge', 'Badge'), ('title', 'Titre'), ('text', 'Texte'), ('button', 'Texte du bouton'), ('link', 'Lien du bouton (#/categorie/burger)'), ('bg', 'Couleur du fond (#RRGGBB)'), ('color', 'Couleur du texte (#RRGGBB)')])
              TextTile(f.$2, s(slides[i][f.$1]), (v) {
                if ((f.$1 == 'bg' || f.$1 == 'color') && !RegExp(r'^#[0-9A-Fa-f]{6}$').hasMatch(v)) {
                  toast(context, 'Couleur au format #RRGGBB', bad: true);
                  return;
                }
                (l(sx['slides'])[i] as Map)[f.$1] = v;
                save();
              }),
            SwitchListTile(dense: true, value: slides[i]['on'] != false, title: const Text('Affichée'), onChanged: (v) {
              (l(sx['slides'])[i] as Map)['on'] = v;
              save();
            }),
            Wrap(spacing: 4, children: [
              TextButton.icon(onPressed: () async {
                final url = await pickAndUpload(context, st.net);
                if (url == null) return;
                (l(sx['slides'])[i] as Map)['img'] = url;
                save();
              }, icon: const Icon(Icons.upload), label: Text(s(slides[i]['img']).isEmpty ? 'Ajouter une photo' : 'Changer la photo')),
              if (s(slides[i]['img']).isNotEmpty) TextButton(onPressed: () {
                (l(sx['slides'])[i] as Map)['img'] = '';
                save();
              }, child: const Text('Retirer la photo')),
              IconButton(onPressed: i == 0 ? null : () {
                final a = l(sx['slides']), t = a[i];
                a[i] = a[i - 1];
                a[i - 1] = t;
                save();
              }, icon: const Icon(Icons.arrow_upward)),
              IconButton(onPressed: i == slides.length - 1 ? null : () {
                final a = l(sx['slides']), t = a[i];
                a[i] = a[i + 1];
                a[i + 1] = t;
                save();
              }, icon: const Icon(Icons.arrow_downward)),
              IconButton(onPressed: () async {
                if (!await confirmDialog(context, 'Supprimer cette slide ?', s(slides[i]['title']), ok: 'Supprimer', danger: true)) return;
                (sx['slides'] as List).removeAt(i);
                save();
              }, icon: const Icon(Icons.delete_outline, color: kRed)),
            ]),
          ]),
        ),
    ]);
  }
}

class _Form extends StatelessWidget {
  const _Form({required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, sx = st.site();
    final f = {..._formDef, ...m(sx['form'])};
    final fs = st.formFields();
    void setF(String k, Object v) {
      sx['form'] = {...m(sx['form']), k: v};
      st.touch();
    }
    return ListView(padding: const EdgeInsets.all(12), children: [
      Card(child: Column(children: [
        TextTile('Titre du formulaire', s(f['title']), (v) => setF('title', v)),
        TextTile('Sous-titre', s(f['sub']), (v) => setF('sub', v)),
        TextTile('Texte du bouton « Commander »', s(f['button']), (v) => setF('button', v)),
        TextTile('Couleur du bouton (#RRGGBB, vide = couleur du site)', s(f['color']), (v) {
          if (v.isNotEmpty && !RegExp(r'^#[0-9A-Fa-f]{6}$').hasMatch(v)) {
            toast(context, 'Couleur au format #RRGGBB', bad: true);
            return;
          }
          setF('color', v);
        }),
        SwitchListTile(dense: true, value: f['addCart'] == true, title: const Text('Afficher le bouton « Ajouter au panier » sous le formulaire'), onChanged: (v) => setF('addCart', v)),
        SwitchListTile(dense: true, value: f['assure'] == true, title: const Text('Afficher les garanties (paiement à la livraison, vérification, 69 wilayas)'), onChanged: (v) => setF('assure', v)),
      ])),
      const SizedBox(height: 10),
      Row(children: [
        const Expanded(child: Text('Champs du formulaire', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15))),
        TextButton(onPressed: () async {
          if (!await confirmDialog(context, 'Revenir aux champs par défaut ?', 'Les champs ajoutés seront retirés.')) return;
          final form = {...m(sx['form'])}..remove('fields');
          sx['form'] = form;
          st.touch();
        }, child: const Text('Par défaut')),
        FilledButton.icon(style: FilledButton.styleFrom(minimumSize: const Size(0, 40)), onPressed: () => st.saveFields([...fs, {'key': 'f${uid()}', 'label': 'Nouveau champ', 'placeholder': '', 'type': 'text', 'required': false, 'show': true, 'full': false}]), icon: const Icon(Icons.add, size: 18), label: const Text('Ajouter')),
      ]),
      const SizedBox(height: 6),
      for (var i = 0; i < fs.length; i++)
        Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: Column(children: [
            TextTile('Nom du champ', s(fs[i]['label']), (v) {
              fs[i]['label'] = v;
              st.saveFields(fs);
            }),
            if (!['wilaya', 'commune', 'delivery'].contains(fs[i]['key']) && !['checkbox', 'select'].contains(fs[i]['type']))
              TextTile('Texte d\'exemple dans le champ', s(fs[i]['placeholder']), (v) {
                fs[i]['placeholder'] = v;
                st.saveFields(fs);
              }),
            if (fs[i]['lock'] != true && !_fieldsDef.any((d) => d['key'] == fs[i]['key']))
              ListTile(dense: true, title: const Text('Type'), trailing: DropdownButton<String>(
                value: _fieldTypes.any((t) => t.$1 == fs[i]['type']) ? s(fs[i]['type']) : 'text',
                items: [for (final t in _fieldTypes) DropdownMenuItem(value: t.$1, child: Text(t.$2))],
                onChanged: (v) {
                  fs[i]['type'] = v;
                  st.saveFields(fs);
                },
              )),
            if (fs[i]['type'] == 'select' && fs[i]['lock'] != true)
              TextTile('Choix séparés par des virgules', l(fs[i]['options']).join(', '), (v) {
                fs[i]['options'] = v.split(',').map((e) => e.trim()).where((e) => e.isNotEmpty).toList();
                st.saveFields(fs);
              }),
            Wrap(spacing: 4, crossAxisAlignment: WrapCrossAlignment.center, children: [
              FilterChip(label: const Text('Affiché'), selected: fs[i]['show'] != false, onSelected: fs[i]['lock'] == true ? null : (v) {
                fs[i]['show'] = v;
                st.saveFields(fs);
              }),
              FilterChip(label: const Text('Obligatoire'), selected: fs[i]['required'] == true, onSelected: fs[i]['lock'] == true ? null : (v) {
                fs[i]['required'] = v;
                st.saveFields(fs);
              }),
              FilterChip(label: const Text('Pleine largeur'), selected: fs[i]['full'] == true, onSelected: (v) {
                fs[i]['full'] = v;
                st.saveFields(fs);
              }),
              IconButton(onPressed: i == 0 ? null : () {
                final t = fs[i];
                fs[i] = fs[i - 1];
                fs[i - 1] = t;
                st.saveFields(fs);
              }, icon: const Icon(Icons.arrow_upward)),
              IconButton(onPressed: i == fs.length - 1 ? null : () {
                final t = fs[i];
                fs[i] = fs[i + 1];
                fs[i + 1] = t;
                st.saveFields(fs);
              }, icon: const Icon(Icons.arrow_downward)),
              if (!_fieldsDef.any((d) => d['key'] == fs[i]['key']))
                IconButton(onPressed: () {
                  fs.removeAt(i);
                  st.saveFields(fs);
                }, icon: const Icon(Icons.delete_outline, color: kRed)),
            ]),
          ]),
        ),
      const Text('Nom, téléphone, wilaya, commune et mode de livraison sont toujours demandés (nécessaires à la livraison) : vous pouvez les renommer et les déplacer. Les champs ajoutés sont joints à la note de la commande.', style: TextStyle(color: kMuted, fontSize: 12)),
    ]);
  }
}

class _Pdp extends StatelessWidget {
  const _Pdp({required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, sx = st.site(), lay = st.pdpLayout();
    void set(String k, Object v) {
      sx['pdp'] = {...m(sx['pdp']), k: v};
      st.touch();
    }
    final rest = _pdpBlocks.where((b) => !lay.order.contains(b.$1)).toList();
    String name(String k) => _pdpBlocks.firstWhere((b) => b.$1 == k, orElse: () => (k, k)).$2;
    return ListView(padding: const EdgeInsets.all(12), children: [
      Section(title: 'Ordre des blocs à côté des photos', children: [
        for (var i = 0; i < lay.order.length; i++)
          ListTile(
            dense: true,
            title: Text(name(lay.order[i])),
            trailing: Row(mainAxisSize: MainAxisSize.min, children: [
              IconButton(onPressed: i == 0 ? null : () {
                final o = lay.order.toList(), t = o[i];
                o[i] = o[i - 1];
                o[i - 1] = t;
                set('order', o);
              }, icon: const Icon(Icons.arrow_upward)),
              IconButton(onPressed: i == lay.order.length - 1 ? null : () {
                final o = lay.order.toList(), t = o[i];
                o[i] = o[i + 1];
                o[i + 1] = t;
                set('order', o);
              }, icon: const Icon(Icons.arrow_downward)),
              IconButton(tooltip: 'Masquer', onPressed: () => set('order', lay.order.where((k) => k != lay.order[i]).toList()), icon: const Icon(Icons.visibility_off_outlined)),
            ]),
          ),
        if (rest.isNotEmpty) const Padding(padding: EdgeInsets.fromLTRB(14, 8, 14, 4), child: Text('Masqués :', style: TextStyle(color: kMuted))),
        for (final b in rest) ListTile(dense: true, title: Text(b.$2), trailing: IconButton(icon: const Icon(Icons.add_circle_outline, color: kOrange), onPressed: () => set('order', [...lay.order, b.$1]))),
        const Padding(padding: EdgeInsets.fromLTRB(14, 4, 14, 4), child: Text('« Description complète » masquée ici reste affichée sous la fiche, sur toute la largeur.', style: TextStyle(color: kMuted, fontSize: 12))),
      ]),
      const SizedBox(height: 10),
      Card(child: Column(children: [
        SwitchListTile(dense: true, value: lay.galleryRight, title: const Text('Photos à droite (au lieu de la gauche)'), onChanged: (v) => set('galleryRight', v)),
        SwitchListTile(dense: true, value: lay.related, title: const Text('Afficher « Produits associés »'), onChanged: (v) => set('related', v)),
      ])),
    ]);
  }
}

class _Texts extends StatefulWidget {
  const _Texts({required this.store});
  final ErpStore store;
  @override
  State<_Texts> createState() => _TextsState();
}

class _TextsState extends State<_Texts> {
  String _lang = 'fr';
  @override
  Widget build(BuildContext context) {
    final st = widget.store, sx = st.site();
    final tx = m(m(sx['texts'])[_lang]);
    void setText(String key, String v) {
      final texts = {...m(sx['texts'])};
      final cur = {...m(texts[_lang])};
      if (v.isEmpty) {
        cur.remove(key);
      } else {
        cur[key] = v;
      }
      texts[_lang] = cur;
      sx['texts'] = texts;
      st.touch();
    }
    final keys = tx.keys.toList()..sort();
    return ListView(padding: const EdgeInsets.all(12), children: [
      SegmentedButton<String>(
        segments: const [ButtonSegment(value: 'fr', label: Text('Français')), ButtonSegment(value: 'ar', label: Text('العربية')), ButtonSegment(value: 'en', label: Text('English'))],
        selected: {_lang},
        onSelectionChanged: (v) => setState(() => _lang = v.first),
      ),
      const SizedBox(height: 8),
      const Text('Textes de la boutique remplacés pour cette langue. Laissez vide pour revenir au texte d\'origine. Un nouveau remplacement s\'ajoute avec le texte d\'origine exact (en français).', style: TextStyle(color: kMuted, fontSize: 12.5)),
      const SizedBox(height: 8),
      OutlinedButton.icon(onPressed: () async {
        final key = await textDialog(context, 'Texte d\'origine (exact)', ok: 'Suivant');
        if (key == null || key.isEmpty || !context.mounted) return;
        final v = await textDialog(context, 'Votre texte', initial: s(tx[key]), lines: 3);
        if (v != null) setText(key, v);
      }, icon: const Icon(Icons.add), label: const Text('Remplacer un texte')),
      const SizedBox(height: 8),
      Card(child: Column(children: [
        for (final k in keys) TextTile(k, s(tx[k]), (v) => setText(k, v), lines: 3),
        if (keys.isEmpty) const Padding(padding: EdgeInsets.all(14), child: Text('Aucun texte remplacé dans cette langue', style: TextStyle(color: kMuted))),
      ])),
    ]);
  }
}

class _Brand extends StatelessWidget {
  const _Brand({required this.store});
  final ErpStore store;
  @override
  Widget build(BuildContext context) {
    final st = store, sx = st.site();
    final b = m(sx['brand']);
    const def = {
      'name': 'PackLik', 'phone1': '0549 59 31 60', 'phone2': '0540 02 19 14', 'whatsapp': '213549593160', 'email': 'support@packlik.com',
      'address': 'Bt 115 cité, Douéra, Alger, Algérie', 'about': 'PackLik, votre partenaire de confiance pour l\'emballage et les solutions alimentaires en Algérie.',
      'payText': 'Vous payez en espèces au livreur à la réception de votre colis, dans les 69 wilayas.', 'copyright': '',
    };
    String v(String k) => b.containsKey(k) ? s(b[k]) : s(def[k]);
    void set(String k, Object val) {
      sx['brand'] = {...m(sx['brand']), k: val};
      st.touch();
    }
    final social = m(b['social']);
    return ListView(padding: const EdgeInsets.all(12), children: [
      Card(child: Column(children: [
        TextTile('Nom de la boutique', v('name'), (x) => set('name', x)),
        ListTile(
          dense: true,
          title: const Text('Logo'),
          subtitle: Text(s(b['logo']).isEmpty ? 'Logo par défaut' : s(b['logo'])),
          trailing: TextButton(onPressed: () async {
            final url = await pickAndUpload(context, st.net);
            if (url != null) set('logo', url);
          }, child: const Text('Changer')),
        ),
        TextTile('Téléphone 1', v('phone1'), (x) => set('phone1', x)),
        TextTile('Téléphone 2', v('phone2'), (x) => set('phone2', x)),
        TextTile('WhatsApp (213…)', v('whatsapp'), (x) => set('whatsapp', x)),
        TextTile('E-mail', v('email'), (x) => set('email', x)),
        TextTile('Adresse', v('address'), (x) => set('address', x)),
        TextTile('À propos (pied de page)', v('about'), (x) => set('about', x), lines: 3),
        TextTile('Texte paiement à la livraison', v('payText'), (x) => set('payText', x), lines: 3),
        TextTile('Copyright', v('copyright'), (x) => set('copyright', x)),
      ])),
      const SizedBox(height: 10),
      Card(child: Column(children: [
        for (final k in const [('showSearch', 'Barre de recherche'), ('showCats', 'Menu des catégories'), ('showWa', 'Bouton WhatsApp flottant'), ('showLogin', 'Bouton Connexion')])
          SwitchListTile(dense: true, value: b[k.$1] != false, title: Text(k.$2), onChanged: (x) => set(k.$1, x)),
      ])),
      const SizedBox(height: 10),
      Section(title: 'Réseaux sociaux', children: [
        for (final k in const ['facebook', 'instagram', 'tiktok', 'youtube'])
          TextTile('${k[0].toUpperCase()}${k.substring(1)} (https://…)', s(social[k]), (x) {
            if (x.isNotEmpty && !RegExp(r'^https?://').hasMatch(x)) {
              toast(context, 'Adresse commençant par https://', bad: true);
              return;
            }
            set('social', {...social, k: x});
          }),
      ]),
      const SizedBox(height: 10),
      Section(title: 'Menu de l\'en-tête', children: [
        for (final (i, x) in l(b['nav']).map(m).indexed)
          ListTile(dense: true, title: Text(s(x['label'])), subtitle: Text(s(x['link'])), trailing: IconButton(icon: const Icon(Icons.delete_outline, color: kRed), onPressed: () {
            final nav = l(b['nav']).toList()..removeAt(i);
            set('nav', nav);
          })),
        Padding(padding: const EdgeInsets.symmetric(horizontal: 10), child: OutlinedButton.icon(onPressed: () async {
          final label = await textDialog(context, 'Libellé du lien', ok: 'Suivant');
          if (label == null || label.isEmpty || !context.mounted) return;
          final link = await textDialog(context, 'Lien (#/boutique, https://…)', initial: '#/');
          if (link == null || link.isEmpty) return;
          final base = l(b['nav']).isEmpty ? [{'label': 'Accueil', 'link': '#/'}, {'label': 'Boutique', 'link': '#/boutique'}, {'label': 'Contact', 'link': '#/contact'}] : l(b['nav']);
          set('nav', [...base, {'label': label, 'link': link}]);
        }, icon: const Icon(Icons.add), label: const Text('Ajouter un lien'))),
      ]),
    ]);
  }
}

class _PagesNote extends StatelessWidget {
  const _PagesNote();
  @override
  Widget build(BuildContext context) => const Padding(
        padding: EdgeInsets.all(24),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          Icon(Icons.design_services_outlined, size: 42, color: kMuted),
          SizedBox(height: 10),
          Text('Éditeur visuel des pages', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
          SizedBox(height: 6),
          Text('Le glisser-déposer des blocs, les polices, animations et marges se règlent sur un grand écran, depuis le site (Boutique › Pages).', textAlign: TextAlign.center, style: TextStyle(color: kMuted)),
        ]),
      );
}
