# Fiche mémoire — ce qui a été fait et où

Journal des changements, du plus récent au plus ancien. La fiche agent (`AGENTS.md`) explique comment le code est construit.

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
