<?php
/** PackLik ERP — socle : configuration, base de données, session, droits. */
declare(strict_types=1);
date_default_timezone_set('Africa/Algiers');

const STAFF = ['admin', 'gerant', 'manager', 'agent'];
const ROLES = ['admin', 'gerant', 'manager', 'agent', 'fournisseur', 'livreur'];
const ROOT = __DIR__ . '/..';

function cfg(): array {
	static $c;
	if ($c === null) {
		$c = ['dsn' => 'sqlite:' . ROOT . '/data/app.sqlite', 'user' => null, 'pass' => null];
		if (is_file(ROOT . '/config.php')) {
			$c = array_merge($c, (array) require ROOT . '/config.php');
		}
		if (getenv('PACKLIK_DSN')) { // tests : base jetable
			$c = ['dsn' => getenv('PACKLIK_DSN'), 'user' => null, 'pass' => null];
		}
	}
	return $c;
}

function is_mysql(): bool {
	return str_starts_with(cfg()['dsn'], 'mysql:');
}

function db(): PDO {
	static $pdo;
	if ($pdo) {
		return $pdo;
	}
	$c = cfg();
	if (!is_mysql() && !is_dir($dir = dirname(substr($c['dsn'], 7)))) {
		mkdir($dir, 0750, true);
	}
	$pdo = new PDO($c['dsn'], $c['user'], $c['pass'], [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	]);
	if (!is_mysql()) {
		$pdo->exec('PRAGMA journal_mode=WAL');
		$pdo->exec('PRAGMA busy_timeout=5000');
	}
	try {
		$pdo->query("SELECT v FROM meta WHERE k='rev'")->fetchColumn();
	} catch (PDOException $e) {
		migrate($pdo);
	}
	return $pdo;
}

/**
 * Schéma : un magasin de documents versionnés. Chaque enregistrement de l'ERP (commande, produit,
 * client…) est une ligne `records` dont `rev` augmente à chaque écriture ; les clients se
 * synchronisent en demandant « tout ce qui a changé depuis ma dernière rev ».
 * k / k2 = clés de recherche indexées (clients : téléphone ; commandes : référence, client).
 */
function migrate(PDO $pdo): void {
	$my = is_mysql();
	$text = $my ? 'LONGTEXT' : 'TEXT';
	$end = $my ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4' : '';
	$pdo->exec("CREATE TABLE IF NOT EXISTS records (coll VARCHAR(24) NOT NULL, id VARCHAR(48) NOT NULL, data $text NOT NULL, rev BIGINT NOT NULL, deleted TINYINT NOT NULL DEFAULT 0, k VARCHAR(64) NULL, k2 VARCHAR(64) NULL, PRIMARY KEY (coll, id))$end");
	$pdo->exec("CREATE TABLE IF NOT EXISTS auth (uid BIGINT NOT NULL PRIMARY KEY, email VARCHAR(190) NOT NULL UNIQUE, pass_hash VARCHAR(255) NOT NULL DEFAULT '')$end");
	$pdo->exec("CREATE TABLE IF NOT EXISTS meta (k VARCHAR(32) NOT NULL PRIMARY KEY, v BIGINT NOT NULL)$end");
	$pdo->exec("CREATE TABLE IF NOT EXISTS throttle (ip VARCHAR(64) NOT NULL, bucket VARCHAR(16) NOT NULL, ts BIGINT NOT NULL)$end");
	foreach (['rec_rev' => 'records (rev)', 'rec_k' => 'records (coll, k)', 'rec_k2' => 'records (coll, k2)', 'thr' => 'throttle (ip, bucket, ts)'] as $name => $on) {
		try {
			$pdo->exec("CREATE INDEX $name ON $on");
		} catch (PDOException $e) { /* existe déjà */
		}
	}
	foreach (['rev', 'order_seq', 'customer_seq', 'user_seq'] as $k) {
		$st = $pdo->prepare('SELECT COUNT(*) FROM meta WHERE k=?');
		$st->execute([$k]);
		if (!$st->fetchColumn()) {
			$pdo->prepare('INSERT INTO meta (k, v) VALUES (?, 0)')->execute([$k]);
		}
	}
}

/** Transaction d'écriture. Toute écriture commence par next_rev(), qui verrouille : les rev sont donc validées dans l'ordre. */
function tx(callable $fn) {
	$db = db();
	is_mysql() ? $db->beginTransaction() : $db->exec('BEGIN IMMEDIATE');
	try {
		$r = $fn($db);
		is_mysql() ? $db->commit() : $db->exec('COMMIT');
		return $r;
	} catch (Throwable $e) {
		is_mysql() ? $db->rollBack() : $db->exec('ROLLBACK');
		throw $e;
	}
}

function seq(PDO $db, string $k): int {
	$db->prepare('UPDATE meta SET v=v+1 WHERE k=?')->execute([$k]);
	$st = $db->prepare('SELECT v FROM meta WHERE k=?');
	$st->execute([$k]);
	return (int) $st->fetchColumn();
}

function next_rev(PDO $db): int {
	return seq($db, 'rev');
}

function cur_rev(): int {
	return (int) db()->query("SELECT v FROM meta WHERE k='rev'")->fetchColumn();
}

function digits(string $s): string {
	return preg_replace('/\D+/', '', $s);
}

function rec_row(string $coll, string $id): ?array {
	$st = db()->prepare('SELECT data, rev, deleted FROM records WHERE coll=? AND id=?');
	$st->execute([$coll, $id]);
	$r = $st->fetch();
	return $r ? ['data' => json_decode($r['data'], true), 'rev' => (int) $r['rev'], 'deleted' => (bool) $r['deleted']] : null;
}

function rec_data(string $coll, string $id): ?array {
	$r = rec_row($coll, $id);
	return $r && !$r['deleted'] ? $r['data'] : null;
}

function rec_put(PDO $db, string $coll, string $id, array $data, int $rev, bool $deleted = false): void {
	$k = $coll === 'customers' ? digits((string) ($data['phone'] ?? '')) : ($coll === 'orders' ? (string) ($data['ref'] ?? '') : null);
	$k2 = $coll === 'orders' ? (string) ($data['customerId'] ?? '') : null;
	$json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
	$st = $db->prepare('UPDATE records SET data=?, rev=?, deleted=?, k=?, k2=? WHERE coll=? AND id=?');
	$st->execute([$json, $rev, (int) $deleted, $k, $k2, $coll, $id]);
	if (!$st->rowCount()) {
		$db->prepare('INSERT INTO records (data, rev, deleted, k, k2, coll, id) VALUES (?,?,?,?,?,?,?)')->execute([$json, $rev, (int) $deleted, $k, $k2, $coll, $id]);
	}
	// les compteurs suivent les identifiants importés (données de démonstration)
	$counter = ['orders' => 'order_seq', 'customers' => 'customer_seq', 'users' => 'user_seq'][$coll] ?? null;
	if ($counter && ctype_digit($id)) {
		$db->prepare('UPDATE meta SET v=? WHERE k=? AND v<?')->execute([(int) $id, $counter, (int) $id]);
	}
}

/** Documents (non supprimés) d'une collection, indexés par id. */
function rec_all(string $coll): array {
	$st = db()->prepare('SELECT id, data FROM records WHERE coll=? AND deleted=0');
	$st->execute([$coll]);
	$out = [];
	foreach ($st as $r) {
		$out[$r['id']] = json_decode($r['data'], true);
	}
	return $out;
}

/* ---------- droits par collection : [lecture, écriture] ; '*' = tout utilisateur connecté ---------- */
function acl(): array {
	$ops = ['admin', 'gerant'];
	$adm = ['admin'];
	return [
		'products' => [['*'], $ops],
		'orders' => [['*'], [...STAFF, 'livreur']], // livreur : ses commandes seulement, voir guard_courier()
		'customers' => [[...STAFF, 'livreur'], STAFF],
		'users' => [['*'], ['*']], // affiné par guard_user()
		'teams' => [STAFF, ['admin', 'manager']],
		'suppliers' => [['admin', 'gerant', 'fournisseur'], $adm],
		'purchases' => [['admin', 'gerant', 'fournisseur'], ['admin', 'gerant', 'fournisseur']],
		'sup_payments' => [['admin', 'fournisseur'], ['admin', 'fournisseur']],
		'dhd_payments' => [$adm, $adm],
		'cashboxes' => [$adm, $adm],
		'cash_moves' => [$adm, $adm],
		'advances' => [$adm, $adm],
		'expenses' => [$adm, $adm],
		'ad_spend' => [$adm, $adm],
		'stock_moves' => [['admin', 'gerant', 'fournisseur'], $ops],
		'activity' => [STAFF, STAFF],
		'notifs' => [STAFF, STAFF],
		'carriers' => [['*'], $ops],
		'couriers' => [[...STAFF, 'livreur'], $ops],
		'pixels' => [$adm, $adm],
		'wilayas' => [['*'], $ops],
		'kv' => [['*'], $adm],
	];
}

function can(?array $u, string $coll, int $mode): bool {
	$a = acl()[$coll] ?? null;
	return $u && $a && (in_array('*', $a[$mode], true) || in_array($u['role'], $a[$mode], true));
}

/** Ce qu'un rôle a le droit de recevoir d'un document (null = rien). */
function out_doc(string $coll, array $d, ?array $u): ?array {
	$role = $u['role'] ?? 'public';
	if ($coll === 'carriers' && !in_array($role, ['admin', 'gerant'], true)) {
		unset($d['creds'], $d['apiKey'], $d['apiId']);
	}
	if ($role === 'fournisseur') {
		if ($coll === 'orders') { // ni client, ni adresse, ni téléphone
			$d = array_intersect_key($d, array_flip(['id', 'ref', 'created', 'status', 'items', 'initial', 'discount', 'times', 'carrier', 'delivery', 'wilaya', 'parcels', 'supplierPaymentId', 'dhdPaymentId', 'freeShip', 'feeFixed', 'dhdFixed']));
			$d += ['customerId' => 0, 'agentId' => null, 'attempts' => [], 'history' => [], 'source' => '', 'commune' => '', 'address' => '', 'tracking' => ''];
		}
		if ($coll === 'users' && (int) $d['id'] !== (int) $u['id']) {
			$d = ['id' => $d['id'], 'name' => $d['name'], 'role' => $d['role'], 'active' => $d['active'] ?? true];
		}
		if ($coll === 'kv' && ($d['_key'] ?? '') !== 'settings') {
			return null;
		}
	}
	if ($role === 'livreur') { // ses commandes, leurs clients, son compte ; rien d'autre
		$cid = (int) ($u['courierId'] ?? 0);
		if ($coll === 'orders') {
			return $cid && (int) ($d['courierId'] ?? 0) === $cid ? array_intersect_key($d, array_flip(['id', 'ref', 'created', 'status', 'items', 'customerId', 'courierId', 'carrier', 'wilaya', 'commune', 'address', 'delivery', 'note', 'tracking', 'times', 'history', 'attempts', 'cashWithCourier', 'courierNote', 'discount', 'discountType', 'feeFixed', 'freeShip', 'parcels', 'weightFixed'])) : null;
		}
		if ($coll === 'customers') {
			return in_array((int) $d['id'], courier_customers($cid), true) ? array_intersect_key($d, array_flip(['id', 'name', 'phone', 'phone2'])) : null;
		}
		if (($coll === 'users' && (int) $d['id'] !== (int) $u['id']) || ($coll === 'couriers' && (int) $d['id'] !== $cid)) {
			return null;
		}
		if ($coll === 'kv') {
			return ($d['_key'] ?? '') === 'settings' ? array_intersect_key($d, array_flip(['_key', 'modules', 'carrierRules', 'cats', 'site'])) : null;
		}
		if ($coll === 'products') {
			unset($d['cost'], $d['supplierId'], $d['priceHistory']);
		}
	}
	if ($coll === 'kv' && ($d['_key'] ?? '') === 'meta' && $role !== 'admin') {
		return null; // jetons Meta : admin seulement
	}
	if ($role === 'public') {
		if ($coll === 'products') {
			if (in_array($d['status'] ?? '', ['masqué', 'archivé', 'corbeille'], true)) {
				return null; // brouillons et produits archivés : invisibles sur la boutique
			}
			unset($d['cost'], $d['supplierId'], $d['priceHistory'], $d['sold30'], $d['lastSale']);
			foreach ((array) ($d['variants'] ?? []) as $i => $v) {
				unset($d['variants'][$i]['cost']);
			}
		} elseif ($coll === 'carriers') {
			$d = array_intersect_key($d, array_flip(['id', 'name', 'short', 'connected', 'isDefault', 'internal', 'feeFactor', 'baseKg', 'extraPerKg', 'maxParcelKg', 'chargeOverweight', 'desk', 'wilayas', 'color', 'logo']));
		} elseif ($coll === 'kv') {
			if (($d['_key'] ?? '') === 'settings') {
				$d = array_intersect_key($d, array_flip(['_key', 'modules', 'carrierRules', 'purchaseOn', 'dedup', 'maintenance', 'primary', 'cats', 'site']));
			}
		} elseif ($coll === 'pixels') {
			$d = array_intersect_key($d, array_flip(['id', 'platform', 'name', 'pixelId', 'active']));
		} elseif ($coll !== 'wilayas') {
			return null;
		}
	}
	return $d;
}

/* ---------- session ---------- */
function session_boot(): void {
	if (session_status() === PHP_SESSION_ACTIVE) {
		return;
	}
	session_name('packlik');
	session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', 'path' => '/']);
	session_start();
}

function user(): ?array {
	static $u = false;
	if ($u !== false) {
		return $u;
	}
	session_boot();
	$uid = (int) ($_SESSION['uid'] ?? 0);
	$d = $uid ? rec_data('users', (string) $uid) : null;
	if ($uid && (!$d || empty($d['active']))) {
		$_SESSION = [];
	}
	return $u = ($d && !empty($d['active'])) ? $d : null;
}

function csrf(): string {
	session_boot();
	return $_SESSION['csrf'] ??= bin2hex(random_bytes(16));
}

/* ---------- entrées / sorties ---------- */
function out($data, int $code = 200): never {
	http_response_code($code);
	header('Content-Type: application/json; charset=utf-8');
	header('Cache-Control: no-store');
	echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
	exit;
}

function fail(int $code, string $msg): never {
	out(['error' => $msg], $code);
}

/**
 * JSON décodé en tableaux PHP, sauf les objets vides qui restent des objets : sinon `{}` revient au
 * navigateur sous forme `[]`, et ce qu'on y ajoute ensuite (réglages, styles…) n'est jamais enregistré.
 */
function jdec(string $s) {
	return keep_objects(json_decode($s));
}
function keep_objects($v) {
	if ($v instanceof stdClass) {
		$a = get_object_vars($v);
		return $a ? array_map('keep_objects', $a) : $v;
	}
	return is_array($v) ? array_map('keep_objects', $v) : $v;
}

function input(): array {
	$raw = file_get_contents('php://input');
	$j = $raw !== '' ? jdec($raw) : [];
	return is_array($j) ? $j : [];
}

function client_ip(): string {
	return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/** Limite de fréquence par IP : $max appels par $window secondes, sinon 429. */
function throttle(string $bucket, int $max, int $window): void {
	$db = db();
	$now = time();
	$db->prepare('DELETE FROM throttle WHERE ts < ?')->execute([$now - 86400]);
	$st = $db->prepare('SELECT COUNT(*) FROM throttle WHERE ip=? AND bucket=? AND ts>?');
	$st->execute([client_ip(), $bucket, $now - $window]);
	if ((int) $st->fetchColumn() >= $max) {
		fail(429, 'Trop de tentatives. Réessayez plus tard.');
	}
	$db->prepare('INSERT INTO throttle (ip, bucket, ts) VALUES (?,?,?)')->execute([client_ip(), $bucket, $now]);
}

/** État initial : session, jeton, et tous les documents que le rôle peut lire. */
function boot(?array $u): array {
	$db = db();
	$rev = cur_rev();
	if ($u) {
		$rows = $db->query('SELECT coll, id, data, rev FROM records WHERE deleted=0');
	} else {
		$rows = $db->query("SELECT coll, id, data, rev FROM records WHERE deleted=0 AND coll IN ('products','wilayas','carriers','kv','pixels')");
	}
	$data = [];
	foreach ($rows as $r) {
		if ($u && !can($u, $r['coll'], 0)) {
			continue;
		}
		$d = out_doc($r['coll'], jdec($r['data']), $u);
		if ($d !== null) {
			$data[$r['coll']][] = [$r['id'], (int) $r['rev'], $d];
		}
	}
	return [
		'user' => $u ? ['id' => $u['id'], 'name' => $u['name'], 'role' => $u['role']] : null,
		'csrf' => $u ? csrf() : null,
		'needSetup' => (int) $db->query('SELECT COUNT(*) FROM auth')->fetchColumn() === 0,
		'empty' => (int) $db->query("SELECT COUNT(*) FROM records WHERE coll='products'")->fetchColumn() === 0,
		'rev' => $rev,
		'data' => $data,
	];
}

/** Clients des commandes confiées à un livreur (pour ne lui montrer que ceux-là). */
function courier_customers(int $cid): array {
	static $memo = [];
	if (!$cid) {
		return [];
	}
	if (!isset($memo[$cid])) {
		$memo[$cid] = [];
		foreach (db()->query("SELECT data FROM records WHERE coll='orders' AND deleted=0") as $r) {
			$o = json_decode($r['data'], true);
			if ((int) ($o['courierId'] ?? 0) === $cid) {
				$memo[$cid][] = (int) ($o['customerId'] ?? 0);
			}
		}
	}
	return $memo[$cid];
}

/**
 * Ce qu'un livreur peut changer sur une commande : seulement les siennes, seulement la livraison
 * (statut de livraison, historique, tentatives, argent encaissé, sa note). Le reste reprend la version serveur.
 */
function guard_courier(array $u, ?array $cur, array $d): ?array {
	$cid = (int) ($u['courierId'] ?? 0);
	if (!$cur || !$cid || (int) ($cur['courierId'] ?? 0) !== $cid) {
		return null;
	}
	$st = (string) ($d['status'] ?? $cur['status']);
	if ($st !== $cur['status'] && !in_array($st, ['picked', 'transit', 'outfor', 'delivered', 'failed', 'returning'], true)) {
		return null;
	}
	$out = $cur;
	foreach (['status', 'times', 'history', 'attempts', 'cashWithCourier', 'courierNote', 'lastDhdUpdate'] as $k) {
		if (array_key_exists($k, $d)) {
			$out[$k] = $d[$k];
		}
	}
	if (count((array) ($out['history'] ?? [])) < count((array) ($cur['history'] ?? []))) {
		return null; // l'historique ne fait que s'allonger
	}
	return $out;
}
