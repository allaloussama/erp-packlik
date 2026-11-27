# Fiche mémoire — ce qui a été fait et où

Journal des changements, du plus récent au plus ancien. La fiche agent (`AGENTS.md`) explique comment le code est construit.

## 27 novembre 2026 (8) — Changements du site portés dans l'application Android

| Demande (site) | Dans l'application | Où |
| --- | --- | --- |
| Thème moderne de la boutique | Cartes produit sans cadre : photo sur fond gris arrondi (fond blanc de la photo fondu, `BlendMode.multiply`), prix en noir, étiquette blanche, « Ajouter au panier » blanc à bordure + « Acheter maintenant » orange, boutons arrondis ; catégories de l'accueil en tuiles grises avec nombre de produits | `mobile/lib/widgets/common.dart` (`kWell`, `NetImg(blend:)`, `ProductCard`, `PriceText`), `mobile/lib/screens/home_screen.dart` |
| Slides : bannière plein cadre | Une slide avec `banner` / `bannerM` s'affiche en image plein cadre cliquable (version téléphone d'abord). Vidéos non lues dans l'application : la slide garde alors son texte. La case « Affichée » (`on`) est maintenant respectée (avant : ignorée). Photo de slide en carré blanc arrondi | `mobile/lib/models.dart` (`Slide`), `mobile/lib/screens/home_screen.dart` |
| Photo du produit en plein écran | Appui sur la photo : plein écran, glisser entre les photos, pincer pour zoomer, compteur. Les miniatures changent maintenant la photo affichée | `mobile/lib/screens/product_screen.dart`, `openPhotoViewer` dans `common.dart` |
| Arabe par défaut | Déjà fait (`state.dart`) | |
| Construction de l'APK en échec depuis le 27 nov. (12 tests) | Le logo du menu de l'espace équipe (`BrandMark`) débordait de 6,8 px dans le menu de 284 px : texte passé en `Flexible` + « … ». Le rappel « Paiement à la livraison » du formulaire de commande débordait sur petit écran : passe à la ligne. Nouveau test `test/shop_screens_test.dart` (slides, accueil et fiche produit à 360 px en arabe et français, photo plein écran). 34 tests OK | `mobile/lib/erp/erp_app.dart`, `mobile/lib/widgets/cod_form.dart`, `mobile/test/shop_screens_test.dart` |

Non porté : pixel Meta (le pixel ne fonctionne que dans un navigateur ; une application demande le SDK Facebook App Events et son propre réglage chez Meta), vue « une seule page » des commandes à confirmer (l'application suit déjà le schéma liste → fiche), corrections propres au navigateur (rechargement en défilant, panneau noir).

## 27 novembre 2026 (7) — ERP sur téléphone : plus de « rechargement » en défilant ; arabe à chaque visite

| Demande | Ce qui a été fait | Où |
| --- | --- | --- |
| Le problème de rechargement en défilant (produits, commandes) persiste | Vraie cause (vue en direct) : toutes les 30 s, l'ERP redessinait la page entière pour les comptes à rebours, sur **toutes** les pages, même en plein défilement ; la synchro aussi dès qu'une donnée change. Sur téléphone, redessiner pendant un glissement coupe l'élan et fait clignoter les photos. Maintenant : `quietRender()` — aucun rendu en arrière-plan pendant un défilement / toucher (attend 2 s de calme) ni pendant une saisie ; la minuterie de 30 s ne redessine que s'il y a un `.countdown` à l'écran ; `softRender()` passe par `quietRender()` | `assets/app.js` (`quietRender`, minuterie 30 s), `assets/backend.js` (`softRender`) |
| L'arabe n'apparaissait pas par défaut | Le choix de langue était mémorisé pour toujours (un clic sur EN gardait l'anglais). Maintenant chaque nouvelle visite s'ouvre en arabe ; un autre choix ne dure que le temps de l'onglet (`sessionStorage`). Application mobile : arabe par défaut si aucune langue n'a été choisie | `assets/app.js` (`S.lang`, `A.lang`), `mobile/lib/state.dart` |

## 27 novembre 2026 (6) — Pixel Meta réellement relié (PageView, ViewContent, AddToCart, InitiateCheckout, Purchase)

| Demande | Ce qui a été fait | Où |
| --- | --- | --- |
| Relier le site au pixel Meta et suivre achat et ajout au panier | Le module Pixels ne faisait que simuler (journal). Maintenant le script de Meta (`fbevents.js`) est chargé pour chaque pixel Facebook **actif** saisi dans ERP › Pixels, et les événements partent vraiment : PageView (chaque page), ViewContent (une fois par fiche), AddToCart (une fois par clic, avant : deux fois), InitiateCheckout, Purchase (montant en DZD, produits, nombre d'articles, `eventID` = `order-<réf>`). Rien n'est envoyé depuis l'ERP. La fonction interne `fbq` s'appelle maintenant `pxTrack` (« fbq » est le nom du script de Meta). CSP : `connect.facebook.net` et `www.facebook.com` autorisés | `assets/app.js` (`pxTrack`, `metaReady`, `metaSend`), `assets/backend.js`, `assets/shop-plus.js`, `assets/tajer.js`, `index.php` |

À régler dans l'ERP : module Pixels activé, pixel Facebook ajouté avec son ID et « Actif », « Quand envoyer l'achat » = **À la commande sur le site** (les modes « confirmé » / « livré » se déclenchent dans l'ERP, donc rien n'est envoyé à Meta : il faudrait l'API Conversions côté serveur). TikTok : toujours simulé.

## 27 novembre 2026 (5) — L'ERP ne « se recharge » plus en défilant ; arabe par défaut

| Demande | Ce qui a été fait | Où |
| --- | --- | --- |
| En faisant défiler (produits, commandes…), la page se recharge et la recherche est perdue | Deux causes. 1) Toutes les 10 s, la synchronisation redessine la page (`softRender` → `render`) : les listes qui défilent revenaient en haut. `render()` mémorise maintenant la position de chaque zone qui défile (et de la page) et la remet quand on reste sur la même page (`domPath`). 2) Sur téléphone, glisser vers le bas en haut de page déclenchait le « tirer pour actualiser » du navigateur, qui rechargeait tout : désactivé dans l'ERP (`overscroll-behavior-y:contain`), gardé sur la boutique | `assets/app.js` (`render`, `domPath`), `assets/app.css` |
| Langue par défaut : arabe | Premier visiteur en arabe ; le choix de langue est gardé dans le navigateur (`localStorage pk_lang`) ; `<html lang="ar" dir="rtl">` | `assets/app.js` (`S.lang`, `A.lang`), `index.php` |

Non fait : l'application mobile Flutter (`mobile/`) n'est pas modifiée.

## 27 novembre 2026 (4) — ERP masqué par un panneau noir (téléphone et ordinateur)

| Demande | Ce qui a été fait | Où |
| --- | --- | --- |
| Un panneau noir avec « Payées » couvrait le menu et le tableau de bord de l'ERP | Collision de nom : la visionneuse photo de la boutique utilisait la classe `.lb`, déjà prise par les libellés de l'entonnoir du tableau de bord (Reçues… Payées), qui devenaient des calques plein écran. Classes renommées `.pklb` ; `.var-opt` du thème limité à la boutique. Vérifié : aucune page ERP admin plus large qu'un téléphone (390 px), menu ☰ en tiroir | `assets/theme.css`, `assets/tajer.js` (`lbOpen`) |

Règle : dans `theme.css`, toute nouvelle classe doit être unique (chercher le nom dans `assets/*.js` avant) ou préfixée `#app:has(>.shop-h)`.

## 27 novembre 2026 (3) — Bannières de slides, boutons téléphone, photo en plein écran

| Demande | Ce qui a été fait | Où |
| --- | --- | --- |
| Importer un modèle Slider Revolution dans les slides | Impossible tel quel (extension WordPress payante, son moteur ne tourne pas ici). À la place : chaque slide peut devenir une **bannière plein cadre** — image ou vidéo MP4/WEBM envoyée depuis ERP › Boutique › Slides, avec une version téléphone facultative ; le lien du bouton rend la bannière cliquable. Champs `banner` / `bannerM` de la slide | `assets/shop-plus.js` (`bannerMedia`, `heroHtml`, `A.slBanner`, `A.slBannerDel`), `assets/theme.css` |
| Photo de slide qui débordait (ordinateur) | La photo est un carré arrondi de 340 px max, photo entière sur fond blanc | `assets/theme.css` |
| Boutons des cartes produit sur téléphone comme avant | « Ajouter au panier » et « Acheter maintenant » de nouveau en deux boutons pleine largeur avec leur texte (taille du texte adaptée à l'écran) | `assets/theme.css` |
| Photo du produit en plein écran au clic | Visionneuse : flèches, clavier (← → Échap), glisser du doigt, compteur ; revient sur la dernière photo vue. Désactivée dans l'aperçu de l'éditeur de pages | `assets/tajer.js` (`lbOpen`), `assets/theme.css` (`.lb`) |

## 27 novembre 2026 (2) — Boutique optimisée pour téléphone (style WoodMart)

| Demande | Ce qui a été fait | Où |
| --- | --- | --- |
| La boutique n'est pas adaptée au téléphone (page catégorie trop large) | Cause : la colonne de filtres (240 px) du thème s'appliquait aussi au téléphone. Sur téléphone : en-tête compact (logo, compte, panier ; puis recherche et langue), filtres dans un panneau qui glisse (bouton « Filtres », sans JS : case `#fltT`), cartes produit 2 colonnes avec panier en icône + « Acheter maintenant », catégories de l'accueil en carrousel, barre du bas (Accueil, Boutique, Panier, WhatsApp, Connexion — mêmes réglages que l'en-tête ; remplace le bouton WhatsApp flottant), champs en 16 px (pas de zoom iOS), pied de page sur une colonne | `assets/theme.css` (fin), `assets/app.js` (`viewShop`), `assets/shop-plus.js` (`shopShell` : `.mbar`) |

## 27 novembre 2026 — Thème moderne de la boutique

| Demande | Ce qui a été fait | Où |
| --- | --- | --- |
| Les pages où les clients commandent paraissent vieilles ; un thème moderne avec les mêmes options | Nouvelle feuille chargée en dernier, apparence seulement (aucun HTML ni réglage changé) : police Inter (arabe : Cairo), en-tête blanc translucide, recherche arrondie, panier noir, catégories en pastilles grises, slides plus grandes, cartes produit sans cadre sur fond gris (photos fondues), prix en noir, « Acheter maintenant » orange, fiche produit et formulaire de commande épurés, mini-panier et pied de page revus. Les classes partagées avec l’ERP sont limitées à la boutique (`#app:has(>.shop-h)`). Fond par défaut des slides : #F4F3F0 au lieu de la pêche (les slides déjà enregistrées gardent leur couleur) | `assets/theme.css`, `index.php`, `assets/shop-plus.js`, `assets/app.js` (slide par défaut) |

Non fait : l’application mobile (`mobile/`) garde son apparence.

## 26 novembre 2026 (2) — Commandes à confirmer sur une seule page

| Demande | Ce qui a été fait | Où |
| --- | --- | --- |
| Voir la commande, changer le statut et voir l'historique au même endroit | Vue « Une page » (par défaut) : statuts en onglets en haut, liste compacte à gauche (nom, total, produit, wilaya, statut, heure), commande ouverte à droite : client et téléphone, actions (fiche d'appel, modifier, envoyer), boutons de statut + note, produits et total, livraison, historique. Sur téléphone : la liste, puis la commande en plein écran avec « Liste » pour revenir. Bouton « Tableau » pour l'ancienne vue (choix gardé dans le navigateur). Les filtres détaillés se replient derrière « Filtres » | `assets/kando.js` (`kRowItem`, `kPane`, `kHistList`), `assets/extra.css` (fin) |

Non fait : l'application mobile (`mobile/`) garde son écran actuel.

## 26 novembre 2026 — changements du site (20-23 nov.) portés dans l'application, APK 32 bits

| Demande (site) | Dans l'application | Où |
| --- | --- | --- |
| Poids des produits en kg (stockés en grammes) | Fiche produit : champ « Poids (kg) » ; liste Produits : poids affiché | `mobile/lib/erp/pages.dart` |
| Modification rapide poids / prix d'achat dans le tableau Produits | Bouton crayon sur chaque produit : poids (admin, gérant), prix d'achat (admin seul) ; journal « Poids produit » / « Prix d'achat » | `pages.dart` (`_quickEdit`), `rules.dart` (`setProductWeight`, `setProductCost`) |
| Stop desk : pas de commune | Formulaire de commande : commune masquée et non demandée au bureau ; confirmation et contrôle avant envoi ne la demandent plus pour le bureau | `mobile/lib/widgets/cod_form.dart`, `rules.dart` (`confApply`, `preSendCheck`) |
| Alerte commande lourde | Après confirmation, avertissement si la commande dépasse 20 kg | `mobile/lib/erp/orders.dart` (`_conf`) |
| Découpage des colis manuel + frais par colis | Fiche commande › Livraison : nombre de colis, « Découper la commande » / « Modifier le découpage » (admin, gérant). Écran : recalcul selon le kg max, ajout d'un colis, déplacement d'une quantité vers un autre colis, poids et frais (base + surpoids) par colis, total, annulation du découpage | `mobile/lib/erp/split_page.dart`, `rules.dart` (`proposeParcels`, `saveSplit`, `resetSplit`) |
| Boutique en défilement infini | 24 produits, puis 24 de plus en arrivant en bas (remis à 24 au changement de catégorie, tri ou recherche) | `mobile/lib/screens/shop_screen.dart` |
| APK 32 bits | La version release ne garde que `armeabi-v7a` (bibliothèques 64 bits retirées) ; l'action GitHub la construit (artifact `packlik-apk`) | `mobile/android/app/build.gradle.kts` |

Non porté : les poids / prix d'achat de démonstration ajoutés à `assets/app.js` (données de démo du navigateur) ; l'application lit les produits du serveur.

## 15 novembre 2026 (5) — ERP natif dans l'application mobile

| Demande | Ce qui a été fait | Où |
| --- | --- | --- |
| Une vraie application Flutter pour l'ERP, pas une page web | L'espace équipe n'est plus le site dans une WebView : connexion, menus de chaque rôle (admin, gérant, manager, agent, fournisseur, livreur) et pages natives. Données et synchronisation par l'API du site (`boot` / `sync`, même protocole que `assets/backend.js`) ; règles portées depuis `app.js`, `kando.js`, `documents.js`, `livreur.js` | `mobile/lib/erp/` |
| Pages faites | Tableaux de bord, commandes à confirmer, ma file, écran d'appel, rappels, mes livraisons, file globale, cas difficiles, suivi, préparation, expédition (API société ou livreur), retours, fiche commande (statuts de confirmation, rappel daté, produits, upsell, historique), produits, stock, clients, équipe, journal, tournée / argent / historique / performances du livreur, ventes du fournisseur | `mobile/lib/erp/` |
| Tous les modules en natif | Livraison, Coût Meta, Pixels, Statistiques, Fournisseurs, Achats, Finance, Comptabilité, Factures et documents (PDF), Boutique, Répartition, Modules, Paramètres, Classement, portail fournisseur complet. Seul l'éditeur visuel des pages reste sur le site | `mobile/lib/erp/` |
| Construction sur GitHub | Action « Application mobile » : analyse, tests, test de bout en bout (serveur PHP + base jetable), APK téléchargeable dans Actions › Artifacts | `.github/workflows/mobile-apk.yml` |
| Écarts voulus avec le site | Suggestion d'achat sans le faux volume de démonstration du site ; tentative échouée saisie au bureau avec un motif choisi (le site en tire un au hasard) ; pas d'écriture de notifications par le fournisseur (le serveur les refuse) | `mobile/lib/erp/rules2.dart`, `supplier_pages.dart` |
| Vérifications | Règles et synchronisation (serveur simulé), chaque page de chaque rôle en 360 px et tablette, parcours complet contre un vrai serveur local | `mobile/test/` |
| Adresse par défaut | Le site Hostinger `honeydew-jackal-507877.hostingersite.com` | `mobile/lib/config.dart` |

## 15 novembre 2026 (4) — commandes, en-tête, connexion, livreur, application mobile

| Demande | Ce qui a été fait | Où |
| --- | --- | --- |
| Historique des commandes | Colonne « Historique » (dernière action, quand, qui, nombre d'étapes) dans Commandes à confirmer et Suivi ; fenêtre chronologique complète | `assets/erp-plus.js` (fin) |
| Annuler l'envoi | Le colis est supprimé chez la société (API Yalidine / EcoTrack-DHD / Noest, route `carrier.cancel`), la commande revient dans « Commandes à confirmer » au statut « En attente », le stock est réintégré | `api/carriers.php` (`carrier_cancel`), `assets/erp-plus.js` (`cancelShipment`) |
| Raccourci fiche d'appel | Bouton casque en tête des actions de chaque commande | `assets/erp-plus.js` |
| En-tête et pied de page entièrement modifiables | Éditeur › « En-tête et pied de page » : nom, logo, icône, bandeau, recherche, connexion, catégories, menu, téléphones, WhatsApp, e-mail, adresse, textes, liens, réseaux sociaux (`SETTINGS.site.brand`) | `assets/shop-plus.js` (`shopShell`), `assets/page-editor.js` |
| Bouton Connexion + belle page de connexion | Bouton « Connexion » / « Mon espace » dans l'en-tête ; page de connexion en deux panneaux (aussi pour l'installation) | `assets/shop-plus.js` (`authCard`) |
| Rôle Livreur | Compte relié à une fiche livreur (Équipe › Ajouter › Livreur). Ma tournée (appeler, WhatsApp, itinéraire, je pars, livrée, échec avec motif, note), Mon argent, Historique, Performances. Le serveur ne lui envoie que ses commandes et leurs clients et n'accepte que les changements de livraison (`guard_courier`) ; 5 vérifications ajoutées à `tests/smoke.php` | `assets/livreur.js`, `api/lib.php`, `api/index.php` |
| Application mobile | Flutter (Android / iOS) dans `mobile/` : boutique native (accueil, boutique, fiche produit, panier avec formulaire, confirmation, français / arabe) + espace équipe (ERP complet, tous les rôles dont livreur). Voir `mobile/README.md` | `mobile/` |

## 15 novembre 2026 (3) — déploiement

GitHub est relié à Hostinger par le propriétaire (hPanel › GIT) : le déploiement passe par là (webhook ou bouton
« Déployer »). Pas d'action GitHub ni de FTP. Voir « Déployer sur Hostinger » dans `README.md`.

## 15 novembre 2026 (2) — menu, formulaire, chargement, éditeur de pages

| Demande | Ce qui a été fait | Où |
| --- | --- | --- |
| Changer la place des rubriques du menu admin | « Réorganiser le menu » en bas du menu : glisser-déposer ou flèches, groupes renommables, ajout/suppression de groupes, retour par défaut ; enregistré dans `SETTINGS.menuOrder` | `assets/erp-plus.js` (fin) |
| « Ajouter au panier » → dans le formulaire, supprimable | Le formulaire liste les produits (quantité +/−, croix pour retirer) ; sur une fiche produit, « Ajouter au panier » d'un autre produit l'ajoute au formulaire ; la page Panier n'est plus que le formulaire | `assets/shop-plus.js` (`codForm`) |
| Plus d'écran « Chargement » | Les données de départ sont écrites dans la page (`<script type="application/json" id="pk-boot">`) : plus d'appel `boot` à l'ouverture ; compression gzip ajoutée au `.htaccess` | `index.php`, `api/lib.php` (`boot` déplacé), `assets/backend.js`, `.htaccess` |
| Ajouter / modifier les champs du formulaire | ERP › Boutique › Formulaire : renommer, texte d'exemple, déplacer, obligatoire, affiché, pleine largeur ; ajouter des champs (texte, texte long, nombre, e-mail, date, liste de choix, case à cocher) joints à la note de la commande. Nom, téléphone, wilaya, commune, livraison restent obligatoires | `assets/shop-plus.js` |
| Éditeur de pages professionnel | ERP › Boutique › Pages : éditeur plein écran, aperçu ordinateur / tablette / mobile, clic sur un élément → texte, police (dont Google Fonts), taille, graisse, interligne, couleurs, fond (couleur ou image), bordure, arrondi, ombre, opacité, marges, animation à l'apparition (fondu, montée, zoom…), masquer (partout / mobile / ordinateur), monter / descendre, ajouter un bloc (titre, texte, bouton, image, vidéo, espace), annuler / rétablir. Bouton « Modifier la page » sur la boutique | `assets/page-editor.js` |
| Bug trouvé en route | Le serveur transformait les objets vides `{}` en listes `[]` : tout ce qu'on y ajoutait ensuite (réglages de la boutique…) était perdu. Corrigé (`jdec`) | `api/lib.php`, `api/index.php` |

## 15 novembre 2026 — série de demandes du propriétaire

| Demande | Ce qui a été fait | Où |
| --- | --- | --- |
| Ordre du menu | Tableau de bord, Produits, Gestion de stock, Livraison, Coût Meta, Pixels, Équipe et accès, Statistiques, Fournisseurs, Clients, Achats, Finance, Comptabilité, puis « Commandes » (à confirmer, suivi, documents) et « Système » | `assets/app.js` → `MENUS.admin` |
| Un seul module Livraison | Onglets Sociétés de livraison / Livreurs / Règles / Tarifs ; l'ancien lien `#/erp/livreurs` ouvre l'onglet Livreurs | `assets/delivery.js` |
| Retirer « Tentatives de livraison » | Retiré des menus et des vues de tous les rôles ; les alertes mènent au Suivi | `assets/app.js` |
| Design des commandes (pas comme Kando) | Rail vertical des statuts, tableau blanc dense, statuts = point de couleur + texte, onglets soulignés | `assets/extra.css` (fin), `kPillStyle` dans `assets/kando.js` |
| « Nouvelle commande » sans liste | Le bouton ouvre directement le formulaire | `assets/kando.js` |
| Source / Plateforme | Source = Facebook, Instagram, TikTok, WhatsApp… (`o.platform`) ; Plateforme = Boutique (site) ou Manuel (`o.source`). Champ « Source » ajouté au formulaire | `assets/erp-plus.js` (`kConfCell`), `assets/kando-form.js` |
| Bug : la fenêtre produit se ferme/rouvre à chaque étape | La fenêtre redessinée ne rejoue plus l'animation d'ouverture | `assets/kando.js` (`renderOverlay`) |
| Bug : le menu remonte en haut | La position de défilement du menu est gardée à chaque rendu | `assets/app.js` (`render`) |
| Produits : actions groupées | Cases à cocher, Modifier (statut, fournisseur, catégories, prix %, grammage), Mettre à la corbeille, Supprimer ; onglet Corbeille (restaurer / supprimer). Un produit déjà vendu va à la corbeille au lieu d'être supprimé | `assets/erp-plus.js` |
| Grammage | Champ « Grammage (g) » dans l'onglet Général et colonne dans la liste ; colonne « Poids (kg) » affichée dans les commandes, « Poids total (kg) » dans le formulaire | `assets/erp-plus.js`, `assets/kando.js`, `assets/kando-form.js` |
| Catégories avec photo | Ajouter / modifier / supprimer / réordonner, photo affichée sur l'accueil ; enregistrées dans `SETTINGS.cats` | `assets/erp-plus.js`, `assets/app.js` (tuiles) |
| Description complète riche | Éditeur : style, police, taille, gras/italique/souligné/barré, couleurs, alignement, listes, lien, photo, vidéo (fichier ou YouTube) ; HTML nettoyé (`rteClean`) | `assets/erp-plus.js`, `assets/tajer.js`, `api/index.php` (vidéos), `index.php` (CSP YouTube) |
| Fournisseurs sans DHD | Plusieurs fournisseurs ; libellés « société de livraison » ; colonne « Fournisseur » sur les produits et les commandes ; part, états et paiements calculés par fournisseur | `assets/erp-plus.js` |
| Finance et comptabilité automatiques | Journal généré depuis les encaissements (par société/livreur et par jour), frais, retours, livreurs, paiements fournisseurs, pub, dépenses ; comptes de tiers calculés | `assets/erp-plus.js` |
| Facture, proforma, bon de livraison, décharge | Modèle A4 professionnel, numérotation automatique (FAC-2026-0001…), montant en lettres, texte modifiable, impression / PDF ; BL créé à l'expédition et facture à la livraison (réglable) ; aussi dans le menu « Plus » d'une commande | `assets/documents.js` |
| Carte produit | En haut « Ajouter au panier », en bas « Acheter maintenant » (ouvre la fiche produit) | `assets/app.js` (`pcard`) |
| Ajouter au panier → panneau à droite | Mini-panier latéral avec « Voir le panier » et « Commander » | `assets/shop-plus.js` |
| Même formulaire au panier | La page Panier montre les produits et le formulaire COD de la fiche produit | `assets/shop-plus.js` |
| Slides, formulaire, fiche produit réglables | Page ERP « Boutique » : slides (photo, textes, bouton, lien, couleurs, ordre), formulaire (titre, bouton, couleur, champs), fiche produit (ordre des blocs, côté des photos, produits associés), textes | `assets/shop-plus.js` |
| Modifier toutes les pages | Admin connecté : bouton « Modifier la page » sur la boutique, clic sur un texte → nouveau texte, par langue ; liste de tous les textes dans ERP › Boutique | `assets/shop-plus.js` |
| En-tête | Sous-barre supprimée ; Connexion, Favoris, Comparer retirés ; les 3 langues dans l'en-tête | `assets/app.js` (`shopShell`) |
| Retirer « Suivi de commande » (boutique) | Liens retirés, l'adresse renvoie à l'accueil | `assets/app.js`, `assets/shop-plus.js` |
| Entrer dans l'admin par /admin | `/admin` redirige vers l'ERP | `index.php`, `.htaccess`, `router.php` |

### Limites connues

- Les nouveaux textes sont en français ; l'arabe et l'anglais s'ajoutent dans ERP › Boutique › Textes des pages.
- Le portail fournisseur (rôle Fournisseur) garde l'ancien calcul (tous les produits) : à filtrer par fournisseur si plusieurs fournisseurs ont un accès.
- L'édition directe d'un texte sur la page ne marche que pour les textes de l'interface ; noms de produits,
  catégories et slides se modifient dans leur fiche.

## Avant

Voir l'historique git : identité PackLik, catalogue réel, module livraison, Coût Meta, formulaire COD.
