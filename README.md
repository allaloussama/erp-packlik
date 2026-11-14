# PackLik — boutique + ERP (PHP)

Boutique en ligne (paiement à la livraison) et ERP de PackLik : confirmation des commandes, suivi des colis,
produits, stock, achats, fournisseur, finance, équipe. Backend PHP, base SQLite ou MySQL, sans dépendance.

## Installer

Il faut **PHP 8.1 ou plus** avec les extensions `pdo_sqlite` (ou `pdo_mysql`), `curl` et `fileinfo`.

1. Envoyer tous les fichiers dans le dossier du site (hébergement mutualisé : `public_html`).
2. Ouvrir `https://votre-site/#/erp` : créer le compte administrateur.
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
| `assets/kando.js` | Commandes à confirmer et suivi des commandes (pastilles de statut, édition dans la ligne) |
| `assets/tajer.js` | Formulaire de commande sur la fiche produit, fiche produit du back-office |
| `assets/delivery.js` | Module livraison : catalogue de 114 sociétés, clés API, tarifs par wilaya |

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
- **SMS / WhatsApp automatiques** : mentionnés dans l'historique, aucun message n'est réellement envoyé.
