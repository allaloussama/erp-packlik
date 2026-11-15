# PackLik — application mobile (Flutter)

Application Android / iOS de la boutique PackLik, branchée sur le même site et la même base que le web.

## Ce qu'elle contient

| Onglet | Contenu |
| --- | --- |
| Accueil | Slides (réglées dans ERP › Boutique), catégories avec photo, nouveautés |
| Boutique | Recherche, catégories, tri (pertinence, récents, prix) |
| Fiche produit | Photos (zoom), variantes, offres par quantité, quantité minimum, livraison gratuite, formulaire de commande sur la page, description riche, produits associés, devis par WhatsApp |
| Panier | Le formulaire de commande avec les produits dedans (quantité +/−, croix pour retirer), comme sur le site |
| Plus | **Espace équipe** (l'ERP complet : admin, gérant, manager, agent, fournisseur, **livreur**), contact (appel, WhatsApp, e-mail, adresse), langue français / arabe, conditions de vente |

- Le formulaire suit les réglages du site (titre, bouton, champs ajoutés, adresse obligatoire ou non). Les champs
  ajoutés vont dans la note de la commande, comme sur le web.
- Prix, frais de livraison et numéro de commande sont décidés par le serveur ; l'application affiche une estimation.
- Panier et langue restent sur le téléphone. L'arabe passe toute l'application de droite à gauche.
- Dans l'espace équipe : les appels, WhatsApp, Google Maps s'ouvrent dans les applications du téléphone, et l'envoi
  de photos (produits, catégories, slides) passe par le sélecteur de fichiers.

## Construire

Il faut Flutter 3.35 ou plus.

```bash
flutter pub get
flutter test
flutter build apk --release --dart-define=PACKLIK_URL=https://votre-domaine/
```

L'APK est dans `build/app/outputs/flutter-apk/app-release.apk`. Sans `--dart-define`, l'adresse est `https://packlik.shop/`.
Vérifier que l'application lit bien un site : `dart run --define=PACKLIK_URL=https://votre-domaine/ tool/check_api.dart`.

Pour le Play Store : créer une clé de signature (`keytool`), la déclarer dans `android/key.properties` et
`android/app/build.gradle.kts` (voir la documentation Flutter « Build and release an Android app »), puis
`flutter build appbundle`. Pour l'App Store : ouvrir `ios/Runner.xcworkspace` sur un Mac.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `lib/config.dart` | Adresse du site, format des prix |
| `lib/models.dart` | Produits, catégories, wilayas, réglages ; règles de prix (variantes, paliers) identiques au site |
| `lib/api.dart` | Appels `api/?r=boot` (catalogue) et `api/?r=order` (commande) |
| `lib/state.dart` | Riverpod : catalogue, communes, panier, langue |
| `lib/router.dart` | GoRouter : 4 onglets, fiche produit, confirmation, pages web |
| `lib/widgets/cod_form.dart` | Formulaire de commande (paiement à la livraison) |
| `lib/screens/web_screen.dart` | Espace équipe (ERP) dans l'application |
| `assets/communes.json` | Communes des 69 wilayas (tirées du site) |
