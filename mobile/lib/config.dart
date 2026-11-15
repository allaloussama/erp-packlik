/// Adresse du site PackLik. À changer au besoin à la compilation :
/// flutter build apk --dart-define=PACKLIK_URL=https://packlik.shop/
const String kBaseUrl = String.fromEnvironment('PACKLIK_URL', defaultValue: 'https://packlik.shop/');

/// Les images et liens du site sont relatifs (assets/…, uploads/…) : on les complète avec l'adresse du site.
String absUrl(String u) {
  if (u.isEmpty || u.startsWith('http://') || u.startsWith('https://')) return u;
  return Uri.parse(kBaseUrl).resolve(u).toString();
}

String dzd(num n, {String lang = 'fr'}) {
  final s = n.round().abs().toString().replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (_) => ' ');
  return '${n < 0 ? '− ' : ''}$s ${lang == 'ar' ? 'دج' : 'DZD'}';
}
