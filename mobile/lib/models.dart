import 'config.dart';

/// Données reçues de l'API PackLik (`api/?r=boot`) : mêmes fiches que le site.
num _n(Object? v) => v is num ? v : num.tryParse('$v') ?? 0;
String _s(Object? v) => v == null ? '' : '$v';
Map<String, dynamic> _m(Object? v) => v is Map ? v.cast<String, dynamic>() : const {};
List<dynamic> _l(Object? v) => v is List ? v : const [];

class Variant {
  const Variant({required this.id, required this.label, required this.price, required this.stock});
  factory Variant.fromJson(Map<String, dynamic> j) =>
      Variant(id: _s(j['id']), label: _s(j['label']), price: _n(j['price']).toInt(), stock: _n(j['stock']).toInt());
  final String id;
  final String label;
  final int price;
  final int stock;
}

class Tier {
  const Tier({required this.min, required this.price, this.badge = ''});
  factory Tier.fromJson(Map<String, dynamic> j) =>
      Tier(min: _n(j['min']).toInt(), price: _n(j['price']).toInt(), badge: _s(j['badge']));
  final int min;
  final int price;
  final String badge;
}

class Product {
  const Product({
    required this.id,
    required this.name,
    this.nameAr = '',
    this.sku = '',
    required this.price,
    this.oldPrice = 0,
    this.images = const [],
    this.cats = const [],
    this.variants = const [],
    this.tiers = const [],
    this.minQty = 1,
    this.stock = 0,
    this.onDemand = false,
    this.status = 'actif',
    this.short = '',
    this.desc = '',
    this.pack = 1,
    this.badge = '',
    this.freeShipQty = 0,
    this.isNew = false,
    this.featured = false,
  });

  factory Product.fromJson(Map<String, dynamic> j) => Product(
        id: _n(j['id']).toInt(),
        name: _s(j['name']),
        nameAr: _s(j['nameAr']),
        sku: _s(j['sku']),
        price: _n(j['price']).toInt(),
        oldPrice: _n(j['oldPrice']).toInt(),
        images: _l(j['images']).map((e) => absUrl(_s(e))).toList(),
        cats: _l(j['cats']).map(_s).toList(),
        variants: _l(j['variants']).map((e) => Variant.fromJson(_m(e))).toList(),
        tiers: _l(j['tiers']).map((e) => Tier.fromJson(_m(e))).toList()..sort((a, b) => a.min.compareTo(b.min)),
        minQty: _n(j['minQty']).toInt().clamp(1, 99999),
        stock: _n(j['stock']).toInt(),
        onDemand: j['onDemand'] == true,
        status: _s(j['status']).isEmpty ? 'actif' : _s(j['status']),
        short: _s(j['short']),
        desc: _s(j['desc']),
        pack: _n(j['pack']).toInt(),
        badge: _s(j['badge']),
        freeShipQty: _n(j['freeShipQty']).toInt(),
        isNew: j['isNew'] == true,
        featured: j['featured'] == true,
      );

  final int id;
  final String name;
  final String nameAr;
  final String sku;
  final int price;
  final int oldPrice;
  final List<String> images;
  final List<String> cats;
  final List<Variant> variants;
  final List<Tier> tiers;
  final int minQty;
  final int stock;
  final bool onDemand;
  final String status;
  final String short;
  final String desc;
  final int pack;
  final String badge;
  final int freeShipQty;
  final bool isNew;
  final bool featured;

  bool get isQuote => status == 'devis' || (price <= 0 && variants.isEmpty);
  int get available => variants.isEmpty ? stock : variants.fold(0, (s, v) => s + v.stock);
  bool get canOrder => !isQuote && status == 'actif' && (available > 0 || onDemand);
  String title(String lang) => lang == 'ar' && nameAr.isNotEmpty ? nameAr : name;

  /// Prix d'une pièce : variante, sinon palier de quantité (le serveur recalcule de toute façon).
  int unitPrice(String? variantId, int q) {
    if (variants.isNotEmpty) {
      final v = variants.where((x) => x.id == variantId);
      return (v.isEmpty ? variants.first : v.first).price;
    }
    var p = price;
    for (final t in tiers) {
      if (q >= t.min && t.price > 0) p = t.price;
    }
    return p;
  }
}

class Category {
  const Category({required this.id, required this.fr, this.ar = '', this.en = '', this.img = '', this.pids = const []});
  factory Category.fromJson(Map<String, dynamic> j) =>
      Category(id: _s(j['id']), fr: _s(j['fr']), ar: _s(j['ar']), en: _s(j['en']), img: _s(j['img']).isEmpty ? '' : absUrl(_s(j['img'])), pids: _l(j['pids']).map((e) => _n(e).toInt()).toList());
  final String id;
  final String fr;
  final String ar;
  final String en;
  final String img;
  final List<int> pids; // ordre des produits choisi dans ERP › Produits › Catégories (catRank du site)
  String name(String lang) => lang == 'ar' && ar.isNotEmpty ? ar : fr;
}

class Wilaya {
  const Wilaya({required this.id, required this.code, required this.fr, this.ar = '', required this.home, required this.desk, this.active = true});
  factory Wilaya.fromJson(Map<String, dynamic> j) => Wilaya(
        id: _n(j['id']).toInt(),
        code: _s(j['code']).isEmpty ? _n(j['id']).toInt().toString().padLeft(2, '0') : _s(j['code']),
        fr: _s(j['fr']),
        ar: _s(j['ar']),
        home: _n(j['home']).toInt(),
        desk: _n(j['desk']).toInt(),
        active: j['active'] != false,
      );
  final int id;
  final String code;
  final String fr;
  final String ar;
  final int home;
  final int desk;
  final bool active;
  String name(String lang) => lang == 'ar' && ar.isNotEmpty ? ar : fr;
}

class Slide {
  const Slide({this.badge = '', this.title = '', this.text = '', this.button = '', this.link = '', this.img = '', this.bg = '#F4F3F0', this.color = '#1B232B', this.banner = '', this.bannerM = '', this.on = true});
  factory Slide.fromJson(Map<String, dynamic> j) {
    String url(String k) => _s(j[k]).isEmpty ? '' : absUrl(_s(j[k]));
    return Slide(
        badge: _s(j['badge']), title: _s(j['title']), text: _s(j['text']), button: _s(j['button']), link: _s(j['link']),
        img: url('img'), bg: _s(j['bg']).isEmpty ? '#F4F3F0' : _s(j['bg']), color: _s(j['color']).isEmpty ? '#1B232B' : _s(j['color']),
        banner: url('banner'), bannerM: url('bannerM'), on: j['on'] != false);
  }
  final String badge, title, text, button, link, img, bg, color;

  /// Bannière plein cadre (ERP › Boutique › Slides) : image ou vidéo ; [bannerM] = version téléphone facultative.
  final String banner, bannerM;

  /// Case « Affichée » de la slide.
  final bool on;

  static bool isVideo(String u) => RegExp(r'\.(mp4|webm)(\?|$)', caseSensitive: false).hasMatch(u);

  /// Image de bannière à montrer dans l'application (version téléphone d'abord). Les vidéos ne sont pas lues ici :
  /// sans image, la slide s'affiche avec son texte.
  String get bannerImage => [bannerM, banner].firstWhere((u) => u.isNotEmpty && !isVideo(u), orElse: () => '');
}

/// Champ du formulaire de commande réglé dans ERP › Boutique › Formulaire.
class OrderField {
  const OrderField({required this.key, required this.label, this.placeholder = '', this.type = 'text', this.required = false, this.show = true, this.options = const []});
  factory OrderField.fromJson(Map<String, dynamic> j) => OrderField(
      key: _s(j['key']), label: _s(j['label']), placeholder: _s(j['placeholder']), type: _s(j['type']).isEmpty ? 'text' : _s(j['type']),
      required: j['required'] == true, show: j['show'] != false, options: _l(j['options']).map(_s).toList());
  final String key, label, placeholder, type;
  final bool required, show;
  final List<String> options;
  static const builtin = {'name', 'phone', 'wilaya', 'commune', 'delivery', 'address'};
  bool get isCustom => !builtin.contains(key);
}

class Brand {
  const Brand({this.name = 'PackLik', this.phone1 = '0549 59 31 60', this.phone2 = '0540 02 19 14', this.whatsapp = '213549593160', this.email = 'support@packlik.com', this.address = 'Bt 115 cité, Douéra, Alger, Algérie', this.about = ''});
  factory Brand.fromJson(Map<String, dynamic> j) {
    const d = Brand();
    String v(String k, String def) => _s(j[k]).isEmpty ? def : _s(j[k]);
    return Brand(name: v('name', d.name), phone1: v('phone1', d.phone1), phone2: v('phone2', d.phone2), whatsapp: v('whatsapp', d.whatsapp), email: v('email', d.email), address: v('address', d.address), about: v('about', d.about));
  }
  final String name, phone1, phone2, whatsapp, email, address, about;
}

class Catalog {
  const Catalog({required this.products, required this.categories, required this.wilayas, this.slides = const [], this.formTitle = '', this.formButton = '', this.fields = const [], this.brand = const Brand()});

  factory Catalog.fromBoot(Map<String, dynamic> boot) {
    final data = _m(boot['data']);
    List<Map<String, dynamic>> docs(String c) => _l(data[c]).map((r) => _m(_l(r).length > 2 ? _l(r)[2] : null)).toList();
    final settings = docs('kv').firstWhere((d) => d['_key'] == 'settings', orElse: () => const {});
    final site = _m(settings['site']);
    final form = _m(site['form']);
    final cats = _l(settings['cats']).map((e) => Category.fromJson(_m(e))).toList();
    final products = docs('products').map(Product.fromJson).where((p) => p.status != 'corbeille').toList()..sort((a, b) => a.id.compareTo(b.id));
    return Catalog(
      products: products,
      categories: cats.isNotEmpty ? cats : defaultCategories,
      wilayas: docs('wilayas').map(Wilaya.fromJson).where((w) => w.active).toList()..sort((a, b) => a.id.compareTo(b.id)),
      slides: _l(site['slides']).map((e) => Slide.fromJson(_m(e))).where((s) => s.on && (s.title.isNotEmpty || s.img.isNotEmpty || s.bannerImage.isNotEmpty)).toList(),
      formTitle: _s(form['title']),
      formButton: _s(form['button']),
      fields: _l(form['fields']).map((e) => OrderField.fromJson(_m(e))).toList(),
      brand: Brand.fromJson(_m(site['brand'])),
    );
  }

  final List<Product> products;
  final List<Category> categories;
  final List<Wilaya> wilayas;
  final List<Slide> slides;
  final String formTitle;
  final String formButton;
  final List<OrderField> fields;
  final Brand brand;

  Product? byId(int id) {
    for (final p in products) {
      if (p.id == id) return p;
    }
    return null;
  }

  int countIn(String cat) => cat == 'tout' ? products.length : products.where((p) => p.cats.contains(cat)).length;
}

/// Une ligne du panier (comme sur le site : produit, variante, quantité).
class CartLine {
  const CartLine({required this.pid, this.v, required this.q});
  factory CartLine.fromJson(Map<String, dynamic> j) => CartLine(pid: _n(j['pid']).toInt(), v: j['v'] == null ? null : _s(j['v']), q: _n(j['q']).toInt());
  final int pid;
  final String? v;
  final int q;
  CartLine copyWith({int? q}) => CartLine(pid: pid, v: v, q: q ?? this.q);
  Map<String, dynamic> toJson() => {'pid': pid, 'v': v, 'q': q};
  bool same(CartLine o) => o.pid == pid && o.v == v;
}

/// Total produits d'un panier, au prix calculé comme sur le site.
int linesTotal(Catalog c, List<CartLine> lines) =>
    lines.fold(0, (s, l) => s + (c.byId(l.pid)?.unitPrice(l.v, l.q) ?? 0) * l.q);

/// Livraison gratuite si une ligne atteint la quantité « livraison gratuite » du produit.
bool freeShipping(Catalog c, List<CartLine> lines) =>
    lines.any((l) { final p = c.byId(l.pid); return p != null && p.freeShipQty > 0 && l.q >= p.freeShipQty; });

const defaultCategories = [
  Category(id: 'tout', fr: 'Tout', ar: 'الكل'), Category(id: 'boites', fr: 'Boites', ar: 'علب'), Category(id: 'box-carton', fr: 'Box Carton', ar: 'علب كرتون'),
  Category(id: 'boite-salade', fr: 'Boite Salade', ar: 'علب السلطة'), Category(id: 'barquettes', fr: 'Barquettes', ar: 'صواني'), Category(id: 'papier-sac', fr: 'Papier & Sac', ar: 'ورق وأكياس'),
  Category(id: 'pok-bowl', fr: 'POK BOWL', ar: 'بوك بول'), Category(id: 'packlik', fr: 'PackLik', ar: 'باكليك'), Category(id: 'burger', fr: 'Burger', ar: 'برغر'),
  Category(id: 'boite-sandwiche', fr: 'Boite Sandwiche', ar: 'علب السندويش'), Category(id: 'pack-promo', fr: 'PACK PROMO', ar: 'باك برومو'), Category(id: 'tiramisu', fr: 'TIRAMISU', ar: 'تيراميسو'),
  Category(id: 'packs-promo', fr: 'Packs promo', ar: 'عروض الباقات'), Category(id: 'boite-suchi', fr: 'Boite Suchi', ar: 'علب السوشي'), Category(id: 'boite-patisseri', fr: 'Boite Patisseri', ar: 'علب الحلويات'),
  Category(id: 'sac-expedition', fr: 'Sac Expedition', ar: 'أكياس الشحن'), Category(id: 'boite-compartiment', fr: 'boîte compartiment', ar: 'علب بخانات'),
];
