<?php
/**
 * Vérification de bout en bout de l'API, sur une base SQLite jetable.
 * Lancer : php tests/smoke.php
 * Couvre ce qui ne doit jamais casser : prix décidés par le serveur, cloisonnement public / équipe,
 * droits par rôle, conflit d'écriture, anti-doublon.
 */
$root = dirname(__DIR__);
$db = sys_get_temp_dir() . '/packlik-test-' . bin2hex(random_bytes(4)) . '.sqlite';
$port = 8100 + random_int(0, 800);
$proc = proc_open([PHP_BINARY, '-S', "127.0.0.1:$port", 'router.php'], [1 => ['file', PHP_OS_FAMILY === 'Windows' ? 'NUL' : '/dev/null', 'w'], 2 => ['file', PHP_OS_FAMILY === 'Windows' ? 'NUL' : '/dev/null', 'w']], $pipes, $root, ['PACKLIK_DSN' => "sqlite:$db"] + getenv());
register_shutdown_function(function () use ($proc, $db) {
	proc_terminate($proc);
	foreach (glob($db . '*') as $f) {
		@unlink($f);
	}
});
usleep(900000);

/** Appel API. $jar = fichier de cookies (une session par rôle). Retourne [code HTTP, JSON]. */
function call(string $route, ?array $body = null, ?string $jar = null, ?string $csrf = null): array {
	global $port;
	$ch = curl_init("http://127.0.0.1:$port/api/?r=$route");
	$h = ['Content-Type: application/json'];
	if ($csrf) {
		$h[] = "X-CSRF: $csrf";
	}
	curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => $h]);
	if ($jar) {
		curl_setopt_array($ch, [CURLOPT_COOKIEJAR => $jar, CURLOPT_COOKIEFILE => $jar]);
	}
	if ($body !== null) {
		curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => json_encode($body)]);
	}
	$raw = curl_exec($ch);
	$code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
	curl_close($ch);
	return [$code, json_decode((string) $raw, true)];
}
$n = 0;
function check(bool $ok, string $what): void {
	global $n;
	$n++;
	if (!$ok) {
		fwrite(STDERR, "ÉCHEC : $what\n");
		exit(1);
	}
	echo "ok  $what\n";
}

$admin = tempnam(sys_get_temp_dir(), 'pk');
$agent = tempnam(sys_get_temp_dir(), 'pk');
$pass = bin2hex(random_bytes(8));

[$c] = call('sync', ['since' => 0], null);
check($c === 401, 'synchronisation refusée sans connexion');
[$c] = call('setup', ['name' => 'Admin', 'email' => 'admin@test.local', 'password' => $pass], $admin);
check($c === 200, 'installation : compte administrateur créé');
[$c] = call('setup', ['name' => 'X', 'email' => 'x@test.local', 'password' => $pass]);
check($c === 409, 'installation impossible une seconde fois');
$csrf = call('boot', null, $admin)[1]['csrf'];
[$c] = call('sync', ['since' => 0, 'up' => []], $admin);
check($c === 403, 'écriture refusée sans jeton CSRF');

$product = ['id' => 1, 'sku' => 'T-1', 'name' => 'Boîte test', 'price' => 1000, 'cost' => 600, 'stock' => 50, 'status' => 'actif', 'weight' => 500, 'tiers' => [['min' => 3, 'price' => 800]], 'supplierId' => 1, 'priceHistory' => []];
$up = [
	['c' => 'products', 'id' => '1', 'd' => $product, 'base' => 0],
	['c' => 'products', 'id' => '2', 'd' => ['id' => 2, 'name' => 'Brouillon', 'price' => 500, 'cost' => 1, 'stock' => 5, 'status' => 'masqué'], 'base' => 0],
	['c' => 'wilayas', 'id' => '16', 'd' => ['id' => 16, 'code' => '16', 'fr' => 'Alger', 'ar' => '', 'home' => 400, 'desk' => 250, 'dhdHome' => 400, 'dhdDesk' => 250, 'active' => true], 'base' => 0],
	['c' => 'carriers', 'id' => 'dhd', 'd' => ['id' => 'dhd', 'name' => 'DHD', 'connected' => true, 'isDefault' => true, 'creds' => ['token' => 'SECRET'], 'feeFactor' => 1], 'base' => 0],
	['c' => 'kv', 'id' => 'settings', 'd' => ['_key' => 'settings', 'modules' => ['weight' => true], 'discountAgent' => 5], 'base' => 0],
	['c' => 'users', 'id' => '2', 'd' => ['id' => 2, 'name' => 'Agent', 'role' => 'agent', 'email' => 'agent@test.local', 'active' => true], 'base' => 0],
];
[$c, $r] = call('sync', ['since' => 0, 'up' => $up], $admin, $csrf);
check($c === 200 && !$r['rejected'], 'l\'admin enregistre catalogue, wilaya, transporteur, réglages, agent');

$pub = call('boot')[1];
$p = $pub['data']['products'];
check(count($p) === 1 && !isset($p[0][2]['cost']) && !isset($p[0][2]['supplierId']), 'boutique publique : ni prix d\'achat, ni brouillon');
check(!isset($pub['data']['orders']) && !isset($pub['data']['customers']) && !isset($pub['data']['users']), 'boutique publique : ni commandes, ni clients, ni équipe');
check(!isset($pub['data']['carriers'][0][2]['creds']), 'boutique publique : pas de clé API transporteur');

$order = ['name' => 'Client Test', 'phone' => '0555 01 02 03', 'wilaya' => 16, 'commune' => 'Alger Centre', 'delivery' => 'home', 'items' => [['pid' => 1, 'q' => 3, 'price' => 1, 'cost' => 0]]];
[$c, $r] = call('order', $order);
check($c === 200 && $r['order']['items'][0]['price'] === 800, 'commande publique : prix recalculé par le serveur (palier 3+ = 800, pas le « 1 » envoyé)');
check(!isset($r['order']['items'][0]['cost']), 'commande publique : le prix d\'achat ne revient pas au client');
[$c, $r2] = call('order', $order);
[, $boot] = call('boot', null, $admin);
$orders = array_column(array_column($boot['data']['orders'], 2), null, 'id');
check($orders[$r2['id']]['duplicate'] === true && $orders[$r['id']]['duplicate'] === false, 'anti-doublon : la 2e commande identique est signalée');
check(call('order', ['items' => [['pid' => 2, 'q' => 1]]] + $order)[0] === 422, 'un brouillon ne se commande pas');
check(call('order', ['phone' => '123'] + $order)[0] === 422, 'téléphone invalide refusé');
check(call('order', ['website' => 'http://spam'] + $order)[0] === 400, 'champ piège rempli (robot) refusé');
check(call('track&ref=' . $r['ref'] . '&phone=0555010203')[0] === 200 && call('track&ref=' . $r['ref'] . '&phone=0666000000')[0] === 404, 'suivi public : seulement avec le bon téléphone');

check(call('login', ['email' => 'agent@test.local', 'password' => 'x'], $agent)[0] === 401, 'agent sans mot de passe : connexion impossible');
check(call('password', ['uid' => 2, 'password' => $pass], $admin, $csrf)[0] === 200, 'l\'admin définit le mot de passe de l\'agent');
check(call('login', ['email' => 'agent@test.local', 'password' => $pass], $agent)[0] === 200, 'l\'agent se connecte');
$ab = call('boot', null, $agent)[1];
$acsrf = $ab['csrf'];
$rev = fn(string $coll, string $id, array $b) => array_column($b['data'][$coll], 1, 0)[$id];
check(!isset($ab['data']['cashboxes']) && !isset($ab['data']['carriers'][0][2]['creds']), 'agent : ni caisses, ni clés API');
$o = $orders[$r['id']];
$o['status'] = 'unreach';
[$c, $res] = call('sync', ['since' => $ab['rev'], 'up' => [
	['c' => 'orders', 'id' => (string) $o['id'], 'd' => $o, 'base' => $rev('orders', (string) $o['id'], $ab)],
	['c' => 'kv', 'id' => 'settings', 'd' => ['_key' => 'settings', 'discountAgent' => 100], 'base' => $rev('kv', 'settings', $ab)],
	['c' => 'products', 'id' => '1', 'd' => ['price' => 1] + $product, 'base' => $rev('products', '1', $ab)],
	['c' => 'users', 'id' => '2', 'd' => ['id' => 2, 'name' => 'Agent', 'role' => 'admin', 'email' => 'agent@test.local', 'active' => true], 'base' => $rev('users', '2', $ab)],
]], $agent, $acsrf);
$rej = array_map(fn($x) => $x[0], $res['rejected']);
sort($rej);
check($rej === ['kv', 'products'], 'agent : peut traiter sa commande, pas modifier réglages ni produits');
$after = call('boot', null, $admin)[1];
check(array_column(array_column($after['data']['users'], 2), 'role', 'id')[2] === 'agent', 'agent : ne peut pas se donner le rôle admin');
[$c, $res] = call('sync', ['since' => $after['rev'], 'up' => [['c' => 'orders', 'id' => (string) $o['id'], 'd' => ['status' => 'cancelled'] + $o, 'base' => $rev('orders', (string) $o['id'], $ab)]]], $admin, $csrf);
check(count($res['rejected']) === 1, 'conflit : une écriture basée sur une version périmée est refusée');
[$c, $res] = call('sync', ['since' => $after['rev'], 'del' => [['c' => 'orders', 'id' => (string) $o['id']]]], $admin, $csrf);
check(count($res['rejected']) === 1, 'une commande ne se supprime pas');
check(call('logout', [], $agent, $acsrf)[0] === 200 && call('sync', ['since' => 0], $agent, $acsrf)[0] === 401, 'déconnexion : session fermée');

echo "\n$n vérifications réussies.\n";
