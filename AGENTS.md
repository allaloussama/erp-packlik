# Fiche agent — PackLik (boutique + ERP)

À lire avant de modifier le projet. L'historique des changements est dans `MEMOIRE.md`.

## Le projet

Boutique PackLik (emballage alimentaire, paiement à la livraison, Algérie) et son ERP, sur une seule page.
PHP 8.1+ sans dépendance, base SQLite (`data/app.sqlite`) ou MySQL (`config.php`). Interface en JavaScript
pur, sans framework ni étape de compilation. Langues : français (source), arabe (RTL), anglais.

- Boutique : `/#/` — ERP : `/admin` (redirige vers `/#/erp`).
- En local : `php -S localhost:8080 router.php` (config `.claude/launch.json`, nom `packlik`).
- Test : `php tests/smoke.php` (24 vérifications, base jetable).
- Compte de test local : `data/DEV-LOGIN.txt` (jamais versionné).

## Comment le code est construit

Les scripts se chargent dans l'ordre de `index.php` ; chaque fichier **surcharge** des fonctions du précédent
(`const _x = x; x = function(){ … _x() … }`). Toute fonction déclarée par `function` peut être remplacée ainsi.

| Fichier | Rôle |
| --- | --- |
| `assets/app.js` | Socle : données de démo, menus (`MENUS`), rendu (`render`), actions (`A`), changements (`CH`), saisies (`IN`), traductions (`t`, `AR`, `EN`) |
| `assets/backend.js` | Connexion, synchronisation avec l'API (`syncNow`, `queueSync`), `reindex` |
| `assets/kando*.js` | Commandes à confirmer, formulaire de commande, suivi des commandes |
| `assets/tajer.js` | Formulaire COD (`codForm`), fiche produit boutique (`viewProduct`), fiche produit ERP (`peHtml`) |
| `assets/delivery.js` | Module Livraison (onglets Sociétés / Livreurs / Règles / Tarifs) |
| `assets/meta.js` | Coût Meta |
| `assets/erp-plus.js` | Catégories avec photo, produits (corbeille, actions groupées, grammage), éditeur riche, fournisseurs multiples, compta automatique, colonnes Source/Plateforme/Fournisseur |
| `assets/documents.js` | Facture, proforma, bon de livraison, décharge (sur `o.docs`) |
| `assets/shop-plus.js` | Mini-panier, panier + formulaire, slides, réglages formulaire/fiche produit, textes modifiables, page ERP « Boutique » |
| `assets/extra.css` | Styles ajoutés (dont le design des commandes) |

## Règles à respecter

1. **Vue remplacée = la réenregistrer** : `ERP_VIEWS` garde l'ancienne référence. Après `viewX = function…`,
   écrire `ERP_VIEWS.admin.page = ()=>viewX();`.
2. **Réglages** : tout ce que l'admin configure va dans `SETTINGS` (synchronisé, écrit par l'admin seul).
   Ce que la boutique publique doit lire doit être ajouté à la liste blanche de `out_doc()` dans `api/lib.php`
   (aujourd'hui : `cats`, `site`, …). Ne jamais y mettre de données clients.
3. **Données d'une commande** (documents, paiements fournisseur) : sur la commande elle-même, pour garder ses droits.
4. **HTML saisi par l'équipe** (description, documents modifiés) : toujours passer par `rteClean()` avant affichage.
5. **Textes** : écrire en français dans `t('…')`. L'admin peut remplacer n'importe quel texte (`SETTINGS.site.texts`).
   En français, « DHD » est remplacé à l'affichage par « la société de livraison » (l'ERP n'est plus lié à DHD).
6. **Produit déjà vendu** : ne jamais le supprimer de `PRODUCTS` (les commandes s'y réfèrent) → corbeille.
7. Vérifier chaque fichier JS modifié : `node --check assets/<fichier>.js`, puis `php tests/smoke.php`.
8. Envoi de fichiers : `api/?r=upload` — JPG/PNG/WEBP 4 Mo, MP4/WEBM 40 Mo, rangés dans `uploads/` (PHP désactivé).

## Déploiement

- GitHub : `origin` = `github.com/cib3845-sys/erp-packlik`, branche `main`.
- Hostinger : voir la section « Déployer sur Hostinger » de `README.md`.
