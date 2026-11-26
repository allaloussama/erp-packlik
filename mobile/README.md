# PackLik — application mobile (Flutter)

Application Android / iOS **entièrement native** (aucune page web dans l'application) : la boutique et l'ERP de
l'équipe, branchés sur la même API et la même base que le site. Une commande confirmée dans l'application est
confirmée sur le site, et inversement (synchronisation toutes les 10 secondes et à chaque modification).

## Boutique

| Onglet | Contenu |
| --- | --- |
| Accueil | Slides (réglées dans ERP › Boutique), catégories avec photo, nouveautés |
| Boutique | Recherche, catégories, tri (pertinence, récents, prix) |
| Fiche produit | Photos (zoom), variantes, offres par quantité, quantité minimum, livraison gratuite, formulaire de commande sur la page, description riche, produits associés, devis par WhatsApp |
| Panier | Le formulaire de commande avec les produits dedans (quantité +/−, croix pour retirer), comme sur le site |
| Plus | Espace équipe, contact (appel, WhatsApp, e-mail, adresse), langue français / arabe, conditions de vente |

Prix, frais de livraison et numéro de commande sont décidés par le serveur ; l'application affiche une estimation.

## Espace équipe (ERP natif)

Connexion avec le compte du site (même e-mail, même mot de passe). On reste connecté après fermeture de
l'application. Le menu de chaque rôle est celui du site, avec les mêmes compteurs.

| Rôle | Dans l'application |
| --- | --- |
| Admin | Tableau de bord, Produits, Gestion de stock, **Livraison** (sociétés : ajout depuis le catalogue, clés API et test de connexion, poids et tarifs ; livreurs : fiche, zones, service / repos, encaissement de leur caisse, courses ; règles par wilaya ; tarifs des 69 wilayas), **Coût Meta** (comptes Facebook par jeton, synchronisation des campagnes, lien campagne → produit, coût par résultat / confirmation / livraison, devises), **Pixels** (Facebook, TikTok, événements, moment de l'achat), Équipe, **Statistiques** (ventes, centre d'appel, livraison, produits, clients, finance, par période / agent / wilaya), **Fournisseurs** (plusieurs fournisseurs, part par commande, paiement, historique, produits), Clients, **Achats** (bons de commande, réception, suggestion automatique), **Finance** (4 caisses, fiche financière d'une commande, avances pub, mouvements, échéances), **Comptabilité** (journal automatique, dépenses, Meta, compte de résultat, rentabilité, comptes de tiers), Commandes à confirmer, Suivi, **Factures et documents** (facture, proforma, BL, décharge en PDF : imprimer ou partager ; modèle et entreprise), **Boutique** (slides avec photo, formulaire de commande, fiche produit, textes, en-tête et pied de page), **Répartition**, **Modules**, **Paramètres**, Journal |
| Gérant | Tableau de bord, Préparation, Expédition, Suivi, Retours, Livraison, Stock, Achats, Produits |
| Manager | Tableau de bord équipe, File globale, Commandes à confirmer, Cas difficiles, Répartition, **Classement et objectifs**, Clients, Mon équipe, Journal |
| Agent | Ma file, Écran d'appel, Mes rappels, Mes livraisons, Mes performances |
| Livreur | Ma tournée, Mon argent, Historique, Mes performances |
| Fournisseur | Tableau de bord, **Paiements et commandes** (confirmer la réception), **Bons de commande** (confirmer avec la date), **Livraisons**, **Relevé de compte**, Ventes de mes produits (si l'admin l'a activé) |

Fiche d'une commande : statut, client (appeler, WhatsApp, SMS, itinéraire), produits (quantités, retrait, ajout,
domicile / bureau), totaux, statut de confirmation, note, livraison (colis et découpage manuel en plusieurs colis avec les frais de
chacun), tentatives, historique, et pour l'admin les documents. Au bureau (stop desk), la commune n'est pas demandée.

Les règles sont celles du site, portées une à une (verrou pendant l'appel, rappels automatiques, contrôles avant
confirmation, remise à valider, frais figés et suivi à l'envoi, stock, documents numérotés, argent chez le livreur,
répartition dans les 4 caisses à l'encaissement, paiement fournisseur qui clôture la commande…). Le menu de l'admin
suit l'ordre choisi sur le site. Le serveur vérifie les droits de chaque écriture, comme pour le site.

Seule différence : l'éditeur visuel des pages (glisser-déposer, polices, animations) reste sur le site, fait pour un grand écran.

## Construire

Il faut Flutter 3.35 ou plus.

```bash
flutter pub get
flutter test
flutter build apk --release --dart-define=PACKLIK_URL=https://votre-domaine/
```

L'APK est dans `build/app/outputs/flutter-apk/app-release.apk`. Sans `--dart-define`, l'application ouvre
`https://honeydew-jackal-507877.hostingersite.com/` (le site Hostinger) ; à changer quand le vrai domaine sera branché.

**Construire sur GitHub** (sans rien installer) : chaque envoi sur `main` qui touche `mobile/` lance l'action
« Application mobile » (`.github/workflows/mobile-apk.yml`) : analyse, tests, test de bout en bout, puis APK **32 bits** (armeabi-v7a, réglé dans `android/app/build.gradle.kts`).
L'APK se télécharge dans l'onglet **Actions** › l'exécution › **Artifacts** › `packlik-apk`.

Test de bout en bout contre un vrai serveur sur une base jetable (admin → agent → envoi → livreur → caisse → fournisseur) :

```bash
PACKLIK_DSN=sqlite:/tmp/pk-e2e.sqlite php -S 127.0.0.1:8199 router.php
flutter test test/erp_live_test.dart --dart-define=PACKLIK_URL=http://127.0.0.1:8199/
```

Pour le Play Store : créer une clé de signature (`keytool`), la déclarer dans `android/key.properties` et
`android/app/build.gradle.kts` (voir la documentation Flutter « Build and release an Android app »), puis
`flutter build appbundle`. Pour l'App Store : ouvrir `ios/Runner.xcworkspace` sur un Mac.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `lib/config.dart` | Adresse du site, format des prix |
| `lib/models.dart` | Boutique : produits, catégories, wilayas, réglages ; règles de prix identiques au site |
| `lib/api.dart` | Boutique : `api/?r=boot` (catalogue) et `api/?r=order` (commande) |
| `lib/state.dart` | Riverpod : catalogue, communes, panier, langue |
| `lib/router.dart` | GoRouter : 4 onglets, fiche produit, confirmation, espace équipe, CGV |
| `lib/widgets/cod_form.dart` | Formulaire de commande (paiement à la livraison) |
| `lib/erp/net.dart` | ERP : appels à l'API avec la session (cookie gardé) et le jeton CSRF |
| `lib/erp/store.dart` | ERP : données en mémoire et synchronisation (`boot`, `sync`), port de `assets/backend.js` |
| `lib/erp/rules.dart` | ERP : menus, statuts, totaux, frais, stock, confirmation, envoi, livreur — port de `app.js`, `kando.js`, `documents.js`, `livreur.js` |
| `lib/erp/erp_app.dart` | ERP : connexion, menu du rôle, pages |
| `lib/erp/orders.dart` | ERP : listes de commandes et fiche commande |
| `lib/erp/pages.dart` | ERP : tableaux de bord, produits, stock, clients, équipe, journal, livreur |
| `lib/erp/dashboard_admin.dart` | ERP : tableau de bord de l'admin, copie de celui du site (période, chiffres clés, trésorerie, entonnoir, tops, agents, alertes) |
| `lib/theme.dart` › `erpTheme()` et `lib/erp/ui.dart` | Design de l'espace équipe : mêmes couleurs, menu sombre, cartes, badges, onglets et boutons que l'ERP du site (`assets/app.css`) |
| `lib/erp/rules2.dart` | ERP : finance, caisses, fournisseurs, achats, performances, journal comptable, menu réorganisé |
| `lib/erp/admin_pages.dart` | ERP : Livraison, Pixels, Modules, Répartition, Classement, Paramètres, Statistiques |
| `lib/erp/finance_pages.dart` | ERP : Fournisseurs, Achats, Finance, Comptabilité |
| `lib/erp/meta_page.dart` | ERP : Coût Meta (API Marketing de Meta) |
| `lib/erp/docs.dart` | ERP : factures et documents en PDF |
| `lib/erp/site_page.dart` | ERP : réglages de la boutique |
| `lib/erp/supplier_pages.dart` | ERP : portail fournisseur |
| `test/erp_rules_test.dart` | Règles et synchronisation (serveur simulé) |
| `test/erp_screens_test.dart` | Chaque page de chaque rôle s'affiche sans erreur (téléphone 360 px et tablette) |
| `test/erp_live_test.dart` | Parcours complet contre un vrai serveur local |

Si une règle change sur le site (`assets/*.js`), la changer aussi dans `lib/erp/rules.dart`.
