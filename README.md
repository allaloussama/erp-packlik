# PackLik — boutique + ERP (PHP)

Boutique en ligne (paiement à la livraison) et ERP de PackLik : confirmation des commandes, suivi des colis,
produits, stock, achats, fournisseur, finance, équipe. Backend PHP, base SQLite ou MySQL, sans dépendance.

## Installer

Il faut **PHP 8.1 ou plus** avec les extensions `pdo_sqlite` (ou `pdo_mysql`), `curl` et `fileinfo`.

1. Envoyer tous les fichiers dans le dossier du site (hébergement mutualisé : `public_html`).
2. Ouvrir `https://votre-site/admin` : créer le compte administrateur.
3. Choisir **Démarrer avec le vrai catalogue** (91 produits, 69 wilayas, aucune commande) ou
   **Charger la démonstration** (données fictives, pour découvrir).

Sans réglage, les données sont dans `data/app.sqlite`. Pour MySQL / MariaDB : copier `config.sample.php` en
`config.php` et y mettre les accès ; les tables se créent seules au premier appel.

Le site doit être en **HTTPS**. Sur Apache, le `.htaccess` fourni interdit l'accès à `data/`, `config.php` et aux
fichiers internes. Sur Nginx, reproduire ces interdictions (voir `router.php`) et empêcher l'exécution de PHP
dans `uploads/`.

## En local

```bash
php -S localhost:8080 router.php
```

```bash
php tests/smoke.php
```

Le test lance un serveur sur une base jetable et vérifie 24 points : prix décidés par le serveur, cloisonnement
boutique / équipe, droits par rôle, conflit d'écriture, anti-doublon.

## Ce qui est où

| Fichier | Rôle |
| --- | --- |
| `index.php` | Page unique (boutique et ERP) |
| `api/index.php` | Routes : `boot`, `setup`, `login`, `logout`, `password`, `sync`, `order`, `track`, `upload`, `carrier.*` |
| `api/lib.php` | Base de données, session, droits par collection et par rôle |
| `api/carriers.php` | Sociétés de livraison : envoi, suivi, test des clés (Yalidine, EcoTrack dont DHD, Noest) |
| `assets/app.js` | Interface : boutique, tableaux de bord, stock, achats, finance, équipe… |
| `assets/backend.js` | Connexion, chargement des données, synchronisation avec l'API |
| `assets/kando.js` | Commandes à confirmer, copie de Kando : barre d'outils, filtres, pastilles, colonnes réglables, corbeille, statuts modifiables |
| `assets/kando-form.js` | Formulaire « Ajouter / Modifier une commande » et sélecteur de produit présenté comme la fiche produit |
| `assets/kando-track.js` | Suivi des commandes, copie de Kando : onglets Société de livraison / Livreur, notes de suivi, réclamations, annulation d'envoi |
| `assets/meta.js` | Coût Meta (copie de Kando) : comptes Facebook, campagnes reliées aux produits, coût par résultat / confirmation / livraison |
| `assets/tajer.js` | Formulaire de commande sur la fiche produit, fiche produit du back-office |
| `assets/delivery.js` | Module livraison : catalogue de 114 sociétés, clés API, tarifs par wilaya |
| `assets/catalog.js`, `assets/products/` | Catalogue réel repris de packlik.shop : photos, descriptions, prix des 91 produits |
| `assets/brand/` | Logo, icône et favicon PackLik |
| `assets/erp-plus.js` | Catégories avec photo, produits (corbeille, actions groupées, grammage), éditeur de description riche, fournisseurs multiples, compta automatique |
| `assets/documents.js` | Facture, facture proforma, bon de livraison, décharge : remplis depuis la commande, modifiables, imprimables |
| `assets/shop-plus.js` | Mini-panier, panier avec formulaire, slides, réglages du formulaire et de la fiche produit, textes modifiables (ERP › Boutique) |
| `assets/page-editor.js` | Éditeur de pages de la boutique (ERP › Boutique › Pages) |
| `AGENTS.md`, `MEMOIRE.md` | Fiche pour les développeurs / agents, et journal de ce qui a été fait et où |

## Comment ça marche

Chaque enregistrement (commande, produit, client…) est un document JSON versionné dans la table `records`.
Le navigateur charge ce que son rôle a le droit de lire, envoie chaque modification, et reçoit toutes les
10 secondes ce que les autres postes ont changé. Une écriture faite sur une version périmée est refusée et
l'écran reprend la version du serveur.

Une commande de la boutique n'envoie que produit, variante et quantité : prix, palier, client, numéro et
société de livraison sont décidés par le serveur.

## Rôles

| Rôle | Accès |
| --- | --- |
| Admin | Tout |
| Gérant | Préparation, expédition, suivi, stock, achats, produits, livraison |
| Manager | Centre d'appel, répartition, clients, équipe |
| Agent | Ses commandes à confirmer, ses rappels, ses livraisons |
| Fournisseur | Son portail : ventes, bons de commande, paiements — sans nom, téléphone ni adresse des clients |

Les comptes se créent dans **Équipe et accès** (e-mail + mot de passe de 8 caractères minimum).

## Limites connues

- **Sociétés de livraison** : formats repris du thème Tajer, **non testés avec de vrais comptes**. Faire un
  premier envoi d'essai avec chaque société. Les sociétés hors Yalidine / EcoTrack / Noest sont en suivi manuel.
- **Synchronisation des statuts** : déclenchée par le bouton « Synchroniser les statuts », pas par une tâche planifiée.
- **MySQL** : le schéma est écrit pour SQLite et MySQL, mais seul SQLite a été testé.
- **Calculs de l'ERP** (finance, stock, répartition) : faits dans le navigateur du personnel connecté. Les prix
  d'achat sont masqués à l'écran pour gérant, manager et agent, mais présents dans les données qu'ils reçoivent.
- **Volume** : toutes les commandes sont chargées en mémoire. Prévoir un archivage au-delà d'environ 20 000 commandes.
- **Pixels Facebook / TikTok** : l'écran journalise les événements, il n'envoie rien aux plateformes.
- **Coût Meta** : lit les campagnes dans l'API Marketing de Meta. Le plus simple est de coller un jeton
  d'utilisateur système (Business Manager → Utilisateurs système, droit `ads_read`) : il n'expire pas. Un jeton
  personnel expire au bout de quelques heures. La connexion « Ajouter un compte Facebook » demande une
  application Meta dont l'App ID se saisit dans le module.
- **Corbeille** : une commande supprimée est masquée partout et restaurable 30 jours ; elle reste en base
  (marquée), elle n'est pas effacée physiquement. Les commandes livrées ou encaissées ne se suppriment pas.
- **SMS / WhatsApp automatiques** : mentionnés dans l'historique, aucun message n'est réellement envoyé.

## Déployer sur Hostinger

### Automatique (recommandé)

À chaque envoi sur la branche `main`, GitHub vérifie le code (tests) puis copie le site sur Hostinger par FTP
(`.github/workflows/deploy.yml`). La base `data/`, les fichiers envoyés `uploads/` et `config.php` ne sont
jamais touchés. À faire **une seule fois** :

1. hPanel › Fichiers › **Comptes FTP** : noter l'hôte (ex. `ftp.packlik.shop` ou l'IP), l'utilisateur et le
   mot de passe (le réinitialiser si besoin), et le **répertoire** du compte.
2. GitHub › dépôt `erp-packlik` › **Settings › Secrets and variables › Actions › New repository secret** :
   `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`. Si le compte FTP s'ouvre au-dessus de `public_html`,
   ajouter aussi `FTP_DIR` = `public_html/`.
3. GitHub › **Actions › Déployer sur Hostinger › Run workflow** pour le premier envoi (ensuite, c'est automatique).

Suivi : onglet **Actions** du dépôt (vert = en ligne, rouge = tests ou FTP en échec, rien n'est envoyé).

### À la main

Hébergement mutualisé Hostinger (hPanel), PHP 8.1 ou plus :

1. **hPanel › Sites web › Gérer › Avancé › GIT** : dépôt `https://github.com/cib3845-sys/erp-packlik.git`,
   branche `main`, dossier vide (le site sera dans `public_html`). Cliquer **Créer**, puis **Déployer**.
   Pour les mises à jour suivantes : **Déployer** à nouveau (ou activer le déploiement automatique, qui donne
   une URL de webhook à coller dans GitHub › Settings › Webhooks).
   Si le dépôt est privé, ajouter d’abord la clé SSH affichée par hPanel dans GitHub › Settings › Deploy keys
   et utiliser l'adresse `git@github.com:cib3845-sys/erp-packlik.git`.
2. **Sans Git** : hPanel › Gestionnaire de fichiers › `public_html` › envoyer le ZIP du dépôt et l'extraire.
3. Vérifier dans hPanel › Avancé › Configuration PHP : version 8.1+, extensions `pdo_sqlite` (ou `pdo_mysql`),
   `curl`, `fileinfo`. Pour les vidéos, `upload_max_filesize` et `post_max_size` ≥ 40M.
4. Les dossiers `data/` et `uploads/` ne sont pas dans Git : ils se créent au premier lancement et ne sont
   jamais écrasés par un déploiement. Garder une copie de `data/app.sqlite` (ou utiliser MySQL via `config.php`).
5. Ouvrir `https://votre-domaine/admin`.
