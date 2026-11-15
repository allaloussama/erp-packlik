<?php
/** PackLik — boutique + ERP. Page unique : l'interface est dans assets/, les données viennent de api/. */
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://graph.facebook.com; frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com; frame-ancestors 'self'");
// /admin : entrée de l'administration (ERP)
$path = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
if (preg_match('#/admin/?$#', $path)) {
	header('Location: ' . preg_replace('#admin/?$#', '', $path) . '#/erp', true, 302);
	exit;
}
// données de départ écrites dans la page : la boutique s'affiche sans attendre un second aller-retour
$boot = null;
try {
	require __DIR__ . '/api/lib.php';
	$boot = boot(user());
	session_write_close(); // libère la session pour les appels suivants
	if ($boot['user']) {
		header('Cache-Control: no-store');
	}
} catch (Throwable $e) {
	error_log('[packlik] boot : ' . $e->getMessage()); // le navigateur le redemandera à l'API
}
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
<div id="app"></div>
<?php if ($boot): ?><script type="application/json" id="pk-boot"><?= json_encode($boot, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?></script><?php endif; ?>
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
<script src="<?= $v('assets/erp-plus.js') ?>"></script>
<script src="<?= $v('assets/documents.js') ?>"></script>
<script src="<?= $v('assets/shop-plus.js') ?>"></script>
<script src="<?= $v('assets/page-editor.js') ?>"></script>
<script src="<?= $v('assets/boot.js') ?>"></script>
</body>
</html>
