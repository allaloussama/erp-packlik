<?php
/** PackLik — boutique + ERP. Page unique : l'interface est dans assets/, les données viennent de api/. */
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://graph.facebook.com; frame-ancestors 'self'");
$v = fn(string $f): string => $f . '?v=' . filemtime(__DIR__ . '/' . $f);
?>
<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PackLik – Emballage alimentaire en Algérie</title>
<meta name="description" content="PackLik : emballage alimentaire livré partout en Algérie, paiement à la livraison.">
<link rel="icon" type="image/png" href="assets/brand/favicon.png">
<meta name="theme-color" content="#FD6400">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="<?= $v('assets/app.css') ?>">
<link rel="stylesheet" href="<?= $v('assets/extra.css') ?>">
</head>
<body>
<div id="app"><div class="empty" style="padding:120px 20px">Chargement…</div></div>
<div id="ov"></div>
<div id="toasts" aria-live="polite"></div>
<script src="<?= $v('assets/app.js') ?>"></script>
<script src="<?= $v('assets/catalog.js') ?>"></script>
<script src="<?= $v('assets/backend.js') ?>"></script>
<script src="<?= $v('assets/kando.js') ?>"></script>
<script src="<?= $v('assets/kando-form.js') ?>"></script>
<script src="<?= $v('assets/kando-track.js') ?>"></script>
<script src="<?= $v('assets/tajer.js') ?>"></script>
<script src="<?= $v('assets/delivery.js') ?>"></script>
<script src="<?= $v('assets/meta.js') ?>"></script>
<script src="<?= $v('assets/boot.js') ?>"></script>
</body>
</html>
