<?php
/** PackLik ERP — API JSON. Appel : api/?r=<route>. */
declare(strict_types=1);
require __DIR__ . '/lib.php';
require __DIR__ . '/carriers.php';

set_exception_handler(function (Throwable $e) {
	error_log('[packlik] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
	fail(500, 'Erreur serveur. Réessayez.');
});
if (function_exists('ob_gzhandler')) {
	ob_start('ob_gzhandler');
}

$route = (string) ($_GET['r'] ?? '');
$post = $_SERVER['REQUEST_METHOD'] === 'POST';
$u = user();
$in = $post && !isset($_FILES['file']) ? input() : [];

// toute écriture d'un utilisateur connecté porte le jeton CSRF de sa session
if ($post && $u && !hash_equals(csrf(), (string) ($_SERVER['HTTP_X_CSRF'] ?? ''))) {
	fail(403, 'Session expirée. Rechargez la page.');
}
$need = function (array $roles) use ($u): array {
	if (!$u || !in_array($u['role'], $roles, true)) {
		fail($u ? 403 : 401, $u ? 'Action non autorisée pour votre rôle.' : 'Connexion requise.');
	}
	return $u;
};

switch ($route) {
	case 'boot':
		out(boot($u));

	case 'setup': // premier lancement : création du compte administrateur
		$post || fail(405, 'POST requis');
		if ((int) db()->query('SELECT COUNT(*) FROM auth')->fetchColumn() > 0) {
			fail(409, 'L\'installation est déjà faite.');
		}
		$name = trim((string) ($in['name'] ?? ''));
		$email = strtolower(trim((string) ($in['email'] ?? '')));
		$pass = (string) ($in['password'] ?? '');
		if (mb_strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 8) {
			fail(422, 'Nom, e-mail valide et mot de passe de 8 caractères minimum requis.');
		}
		tx(function (PDO $db) use ($name, $email, $pass) {
			$id = seq($db, 'user_seq');
			rec_put($db, 'users', (string) $id, ['id' => $id, 'name' => $name, 'role' => 'admin', 'phone' => '', 'email' => $email, 'online' => true, 'active' => true], next_rev($db));
			$db->prepare('INSERT INTO auth (uid, email, pass_hash) VALUES (?,?,?)')->execute([$id, $email, password_hash($pass, PASSWORD_DEFAULT)]);
			$_SESSION['uid'] = $id;
		});
		session_regenerate_id(true);
		out(['ok' => true]);

	case 'login':
		$post || fail(405, 'POST requis');
		throttle('login', 8, 900);
		$st = db()->prepare('SELECT uid, pass_hash FROM auth WHERE email=?');
		$st->execute([strtolower(trim((string) ($in['email'] ?? '')))]);
		$a = $st->fetch();
		$doc = $a ? rec_data('users', (string) $a['uid']) : null;
		// même message dans tous les cas : pas d'énumération des comptes
		if (!$a || $a['pass_hash'] === '' || !password_verify((string) ($in['password'] ?? ''), $a['pass_hash']) || !$doc || empty($doc['active'])) {
			fail(401, 'E-mail ou mot de passe incorrect.');
		}
		session_boot();
		session_regenerate_id(true);
		$_SESSION = ['uid' => (int) $a['uid']];
		out(['ok' => true]);

	case 'logout':
		session_boot();
		$_SESSION = [];
		session_destroy();
		out(['ok' => true]);

	case 'password': // admin : n'importe quel compte ; sinon le sien, avec l'ancien mot de passe
		$post || fail(405, 'POST requis');
		$me = $need(ROLES);
		$uid = (int) ($in['uid'] ?? $me['id']);
		$pass = (string) ($in['password'] ?? '');
		if (strlen($pass) < 8) {
			fail(422, 'Mot de passe : 8 caractères minimum.');
		}
		$st = db()->prepare('SELECT pass_hash FROM auth WHERE uid=?');
		$st->execute([$uid]);
		$hash = $st->fetchColumn();
		if ($hash === false) {
			fail(404, 'Ce compte n\'a pas d\'e-mail de connexion. Renseignez son e-mail d\'abord.');
		}
		if ($me['role'] !== 'admin' || $uid === (int) $me['id']) {
			if ($uid !== (int) $me['id'] || !password_verify((string) ($in['current'] ?? ''), (string) $hash)) {
				fail(403, 'Mot de passe actuel incorrect.');
			}
		}
		db()->prepare('UPDATE auth SET pass_hash=? WHERE uid=?')->execute([password_hash($pass, PASSWORD_DEFAULT), $uid]);
		out(['ok' => true]);

	case 'sync':
		$post || fail(405, 'POST requis');
		out(sync($need(ROLES), $in));

	case 'order':
		$post || fail(405, 'POST requis');
		$res = create_order($u, $in);
		if (!$u || !in_array($u['role'], STAFF, true)) { // achat d'un client de la boutique, pas une saisie de l'équipe
			meta_capi_purchase($res);
		}
		out($res);

	case 'track':
		throttle('track', 30, 600);
		$st = db()->prepare("SELECT data FROM records WHERE coll='orders' AND k=? AND deleted=0");
		$st->execute([strtoupper(trim((string) ($_GET['ref'] ?? '')))]);
		$o = json_decode((string) $st->fetchColumn(), true);
		$c = $o ? rec_data('customers', (string) $o['customerId']) : null;
		$phone = digits((string) ($_GET['phone'] ?? ''));
		if (!$c || $phone === '' || digits((string) $c['phone']) !== $phone) {
			fail(404, 'Aucune commande ne correspond à ce téléphone et ce numéro.');
		}
		out(['order' => public_order($o)]);

	case 'upload':
		$need(['admin', 'gerant']);
		$f = $_FILES['file'] ?? null;
		if (!$f || $f['error'] !== UPLOAD_ERR_OK) {
			fail(422, 'Fichier manquant ou trop lourd pour le serveur.');
		}
		$mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
		$ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'video/mp4' => 'mp4', 'video/webm' => 'webm'][$mime] ?? null;
		if (!$ext) {
			fail(422, 'Format accepté : JPG, PNG, WEBP, MP4 ou WEBM.');
		}
		if ($f['size'] > (str_starts_with($mime, 'video/') ? 40 : 4) * 1024 * 1024) {
			fail(422, 'Fichier trop lourd (photo 4 Mo, vidéo 40 Mo maximum).');
		}
		$name = bin2hex(random_bytes(12)) . '.' . $ext;
		is_dir(ROOT . '/uploads') || mkdir(ROOT . '/uploads', 0755, true);
		move_uploaded_file($f['tmp_name'], ROOT . '/uploads/' . $name) || fail(500, 'Enregistrement impossible.');
		out(['url' => 'uploads/' . $name]);

	case 'carrier.catalog':
		$need(['admin', 'gerant']);
		out(['catalog' => carrier_catalog_public()]);

	case 'carrier.test':
		$post || fail(405, 'POST requis');
		$need(['admin', 'gerant']);
		out(carrier_test((string) ($in['id'] ?? '')));

	case 'carrier.send':
		$post || fail(405, 'POST requis');
		$need(['admin', 'gerant']);
		out(carrier_send($in));

	case 'carrier.cancel':
		$post || fail(405, 'POST requis');
		$need(['admin', 'gerant']);
		out(carrier_cancel($in));

	case 'carrier.track':
		$post || fail(405, 'POST requis');
		$need(STAFF);
		out(carrier_track($in));

	default:
		fail(404, 'Route inconnue.');
}

/* ================================================================== */

/**
 * Synchronisation : applique les écritures du client puis renvoie tout ce qui a changé depuis `since`.
 * Une écriture est refusée (et l'état serveur renvoyé) si le rôle n'a pas le droit ou si le document
 * a été modifié par quelqu'un d'autre entre-temps (`base` ≠ rev serveur).
 */
function sync(array $u, array $in): array {
	$since = (int) ($in['since'] ?? 0);
	$up = is_array($in['up'] ?? null) ? $in['up'] : [];
	$del = is_array($in['del'] ?? null) ? $in['del'] : [];
	$rejected = [];
	if ($up || $del) {
		tx(function (PDO $db) use ($u, $up, $del, &$rejected) {
			$rev = null;
			$reject = function (string $c, string $id) use (&$rejected, $u) {
				$cur = rec_row($c, $id);
				$d = $cur && !$cur['deleted'] && can($u, $c, 0) ? out_doc($c, $cur['data'], $u) : null;
				$rejected[] = [$c, $id, $cur['rev'] ?? 0, $d];
			};
			foreach ($up as $x) {
				$c = (string) ($x['c'] ?? '');
				$id = (string) ($x['id'] ?? '');
				$d = $x['d'] ?? null;
				if (!isset(acl()[$c]) || $id === '' || strlen($id) > 48 || !is_array($d)) {
					continue;
				}
				$cur = rec_row($c, $id);
				$exists = $cur && !$cur['deleted'];
				$ok = can($u, $c, 1)
					&& (!$exists || $cur['rev'] === (int) ($x['base'] ?? 0)) // sinon : modifié ailleurs entre-temps
					&& ($exists || $c !== 'orders' || $u['role'] === 'admin') // une commande naît par la route « order »
					&& !($u['role'] === 'fournisseur' && !$exists);
				if ($ok && $c === 'orders' && $u['role'] === 'livreur') {
					$d = guard_courier($u, $exists ? $cur['data'] : null, $d);
					$ok = $d !== null;
				}
				if ($ok && $c === 'users') {
					$d = guard_user($db, $u, $exists ? $cur['data'] : null, $d);
					$ok = $d !== null;
				}
				if (!$ok) {
					$reject($c, $id);
					continue;
				}
				rec_put($db, $c, $id, $d, $rev ??= next_rev($db));
			}
			foreach ($del as $x) {
				$c = (string) ($x['c'] ?? '');
				$id = (string) ($x['id'] ?? '');
				$cur = isset(acl()[$c]) ? rec_row($c, $id) : null;
				if (!$cur || $cur['deleted']) {
					continue;
				}
				// ni les commandes ni les comptes ne se suppriment : on annule, on désactive
				if (!can($u, $c, 1) || in_array($c, ['orders', 'users'], true) || in_array($u['role'], ['fournisseur', 'livreur'], true)) {
					$reject($c, $id);
					continue;
				}
				rec_put($db, $c, $id, $cur['data'], $rev ??= next_rev($db), true);
			}
		});
	}
	$st = db()->prepare('SELECT coll, id, data, rev, deleted FROM records WHERE rev > ? ORDER BY rev');
	$st->execute([$since]);
	$changes = [];
	$rev = $since;
	foreach ($st as $r) {
		$rev = max($rev, (int) $r['rev']);
		if (!can($u, $r['coll'], 0)) {
			continue;
		}
		$d = $r['deleted'] ? null : out_doc($r['coll'], jdec($r['data']), $u);
		$changes[] = [$r['coll'], $r['id'], (int) $r['rev'], $d];
	}
	return ['rev' => $rev, 'changes' => $changes, 'rejected' => $rejected];
}

/** Qui peut modifier quoi sur une fiche utilisateur. Retourne la fiche à enregistrer, ou null si refusé. */
function guard_user(PDO $db, array $u, ?array $cur, array $d): ?array {
	if ($u['role'] !== 'admin') {
		$self = $cur && (int) $cur['id'] === (int) $u['id'];
		if (!$cur || (!$self && !($u['role'] === 'manager' && $cur['role'] === 'agent'))) {
			return null;
		}
		foreach (['id', 'role', 'active', 'email', 'supplierId', 'courierId'] as $k) { // champs réservés à l'admin
			if (array_key_exists($k, $cur)) {
				$d[$k] = $cur[$k];
			} else {
				unset($d[$k]);
			}
		}
		return $d;
	}
	if (!in_array($d['role'] ?? '', ROLES, true) || !isset($d['id'])) {
		return null;
	}
	if ($cur && (int) $cur['id'] === (int) $u['id']) { // l'admin ne peut pas se retirer ses propres droits
		$d['role'] = 'admin';
		$d['active'] = true;
	}
	$email = strtolower(trim((string) ($d['email'] ?? '')));
	if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
		$st = $db->prepare('SELECT uid FROM auth WHERE email=?');
		$st->execute([$email]);
		$owner = $st->fetchColumn();
		if ($owner !== false && (int) $owner !== (int) $d['id']) {
			return null; // e-mail déjà pris par un autre compte
		}
		$st = $db->prepare('UPDATE auth SET email=? WHERE uid=?');
		$st->execute([$email, (int) $d['id']]);
		if ($owner === false && !$st->rowCount()) {
			$db->prepare("INSERT INTO auth (uid, email, pass_hash) VALUES (?,?,'')")->execute([(int) $d['id'], $email]);
		}
		$d['email'] = $email;
	}
	return $d;
}

/** Prix unitaire appliqué par le serveur : variante, sinon prix de base avec paliers par quantité. */
function unit_price(array $p, ?string $v, int $q): array {
	if ($v !== null && $v !== '') {
		foreach ((array) ($p['variants'] ?? []) as $x) {
			if ((string) $x['id'] === $v) {
				return [(int) round((float) $x['price']), (int) round((float) ($x['cost'] ?? 0))];
			}
		}
		fail(422, 'Variante inconnue pour « ' . $p['name'] . ' ».');
	}
	if (!empty($p['variants'])) {
		fail(422, 'Choisissez une variante pour « ' . $p['name'] . ' ».');
	}
	$price = (float) $p['price'];
	foreach ((array) ($p['tiers'] ?? []) as $t) {
		if ($q >= (int) ($t['min'] ?? 0) && (float) ($t['price'] ?? 0) > 0) {
			$price = min($price, (float) $t['price']);
		}
	}
	return [(int) round($price), (int) round((float) ($p['cost'] ?? 0))];
}

/**
 * Création d'une commande (boutique publique ou saisie manuelle par l'équipe).
 * Le navigateur n'envoie que produit / variante / quantité : prix, coût, client, numéro et
 * transporteur sont décidés ici.
 */
function create_order(?array $u, array $in): array {
	$staff = $u && in_array($u['role'], STAFF, true);
	if (!$staff) {
		if (!empty($in['website'])) { // champ piège rempli = robot
			fail(400, 'Requête invalide.');
		}
		throttle('order', 10, 3600);
	}
	$name = trim((string) ($in['name'] ?? ''));
	$phone = digits((string) ($in['phone'] ?? ''));
	$wid = (int) ($in['wilaya'] ?? 0);
	$commune = trim((string) ($in['commune'] ?? ''));
	$delivery = ($in['delivery'] ?? 'home') === 'desk' ? 'desk' : 'home';
	$lines = is_array($in['items'] ?? null) ? $in['items'] : [];
	$w = rec_data('wilayas', (string) $wid);
	if (mb_strlen($name) < 3 || mb_strlen($name) > 80) {
		fail(422, 'Veuillez saisir votre nom.');
	}
	if (!preg_match('/^0[567]\d{8}$/', $phone)) {
		fail(422, 'Numéro invalide : 05, 06 ou 07 suivi de 8 chiffres.');
	}
	if (!$w || empty($w['active'])) {
		fail(422, 'Wilaya non desservie.');
	}
	if ($delivery === 'desk' && (int) ($w['desk'] ?? 0) <= 0) {
		$delivery = 'home'; // pas de bureau (stop desk) dans cette wilaya : prix bureau à 0
	}
	if ($commune === '' || mb_strlen($commune) > 80) {
		fail(422, 'Veuillez indiquer la commune.');
	}
	if (!$lines || count($lines) > 40) {
		fail(422, 'Le panier est vide.');
	}
	$products = rec_all('products');
	$items = [];
	$free = false;
	foreach ($lines as $l) {
		$p = $products[(string) (int) ($l['pid'] ?? 0)] ?? null;
		$q = (int) ($l['q'] ?? 0);
		$v = isset($l['v']) && $l['v'] !== '' ? (string) $l['v'] : null;
		if (!$p || $q < 1 || $q > 9999) {
			fail(422, 'Produit ou quantité invalide.');
		}
		if (!$staff) {
			// rupture seulement si l'admin l'a choisie (statut « rupture » sans « sur commande ») : le stock compté ne bloque jamais
			$pst = $p['status'] ?? '';
			if (!($pst === 'actif' || ($pst === 'rupture' && !empty($p['onDemand']))) || (float) $p['price'] <= 0) {
				fail(422, '« ' . $p['name'] . ' » n\'est pas disponible à la commande.');
			}
			if ($q < (int) ($p['minQty'] ?? 1)) {
				fail(422, 'Quantité minimale pour « ' . $p['name'] . ' » : ' . (int) $p['minQty'] . '.');
			}
		}
		[$price, $cost] = unit_price($p, $v, $q);
		if ($staff && isset($l['price']) && is_numeric($l['price']) && $l['price'] >= 0) {
			$price = (int) round((float) $l['price']); // l'équipe peut négocier le prix au téléphone
		}
		$items[] = ['pid' => (int) $p['id'], 'v' => $v, 'q' => $q, 'price' => $price, 'cost' => $cost, 'up' => false];
		$free = $free || ((int) ($p['freeShipQty'] ?? 0) > 0 && $q >= (int) $p['freeShipQty']);
	}
	$sources = ['Site', 'WhatsApp', 'Messenger', 'Instagram', 'Téléphone'];
	$source = $staff && in_array($in['source'] ?? '', $sources, true) ? $in['source'] : 'Site';
	$address = mb_substr(trim((string) ($in['address'] ?? '')), 0, 200);
	$note = mb_substr(trim((string) ($in['note'] ?? '')), 0, 500);
	$fmt = substr($phone, 0, 4) . ' ' . substr($phone, 4, 2) . ' ' . substr($phone, 6, 2) . ' ' . substr($phone, 8, 2);
	// plateforme d'acquisition (publicité Facebook, TikTok…) : liste fermée
	$platform = in_array($in['platform'] ?? '', ['facebook', 'instagram', 'tiktok', 'google', 'snapchat', 'whatsapp', 'messenger'], true) ? $in['platform'] : '';
	// champs du formulaire de l'équipe (façon Kando)
	$extra = [];
	if ($staff) {
		$p2 = digits((string) ($in['phone2'] ?? ''));
		if ($p2 !== '' && !preg_match('/^0[567]\d{8}$/', $p2)) {
			fail(422, 'Téléphone 02 invalide : 05, 06 ou 07 suivi de 8 chiffres.');
		}
		$extra['phone2'] = $p2 === '' ? '' : substr($p2, 0, 4) . ' ' . substr($p2, 4, 2) . ' ' . substr($p2, 6, 2) . ' ' . substr($p2, 8, 2);
		$disc = max(0, (float) ($in['discount'] ?? 0));
		$extra['discountType'] = ($in['discountType'] ?? '') === 'amount' ? 'amount' : 'percent';
		$extra['discount'] = $extra['discountType'] === 'percent' ? min(100, $disc) : $disc;
		if (isset($in['fee']) && is_numeric($in['fee']) && $in['fee'] >= 0) {
			$extra['feeFixed'] = (int) round((float) $in['fee']);
		}
		if (isset($in['weight']) && is_numeric($in['weight']) && $in['weight'] > 0) {
			$extra['weightFixed'] = round((float) $in['weight'], 2);
		}
		if (!empty($in['exchange'])) {
			$extra['exchange'] = true;
			$extra['returnedProduct'] = mb_substr(trim((string) ($in['returnedProduct'] ?? '')), 0, 120);
		}
		$car = (string) ($in['carrier'] ?? '');
		if ($car !== '' && rec_data('carriers', $car)) {
			$extra['carrier'] = $car;
		}
	}

	return tx(function (PDO $db) use ($u, $staff, $name, $phone, $fmt, $wid, $commune, $delivery, $items, $free, $source, $address, $note, $in, $platform, $extra) {
		$rev = next_rev($db);
		$now = (int) round(microtime(true) * 1000);
		$st = $db->prepare("SELECT data FROM records WHERE coll='customers' AND k=? AND deleted=0");
		$st->execute([$phone]);
		$c = json_decode((string) $st->fetchColumn(), true);
		if (!$c) {
			$c = ['id' => seq($db, 'customer_seq'), 'name' => $name, 'business' => mb_substr(trim((string) ($in['business'] ?? '')), 0, 80), 'phone' => $fmt, 'phone2' => '', 'wilaya' => $wid, 'commune' => $commune, 'address' => $address, 'pro' => false, 'hist' => ['created' => 0, 'delivered' => 0, 'returned' => 0, 'spent' => 0], 'since' => $now, 'notes' => ''];
			rec_put($db, 'customers', (string) $c['id'], $c, $rev);
		}
		if (!empty($extra['phone2']) && ($c['phone2'] ?? '') !== $extra['phone2']) {
			$c['phone2'] = $extra['phone2'];
			rec_put($db, 'customers', (string) $c['id'], $c, $rev);
		}
		$id = seq($db, 'order_seq');
		// anti-doublon : même client, même panier, moins de 24 h
		$key = fn(array $its) => implode(',', (function ($a) { sort($a); return $a; })(array_map(fn($i) => $i['pid'] . 'x' . $i['q'], $its)));
		$dup = false;
		$st = $db->prepare("SELECT data FROM records WHERE coll='orders' AND k2=? AND deleted=0");
		$st->execute([(string) $c['id']]);
		foreach ($st as $r) {
			$x = json_decode($r['data'], true);
			$dup = $dup || ($now - (int) $x['created'] < 86400000 && $x['status'] !== 'cancelled' && $key($x['items']) === $key($items));
		}
		$who = $staff ? $u['name'] : 'Système';
		$agent = $staff && $u['role'] === 'agent' ? (int) $u['id'] : null;
		$o = [
			'id' => $id, 'ref' => 'PK-' . (1000 + $id), 'created' => $now, 'source' => $source, 'customerId' => (int) $c['id'], 'agentId' => $agent,
			'wilaya' => $wid, 'commune' => $commune, 'address' => $address, 'delivery' => $delivery, 'note' => $note,
			'initial' => $items, 'items' => $items, 'discount' => 0, 'status' => 'new', 'unreachN' => 0, 'calls' => 0, 'nextCall' => null, 'cancelReason' => '', 'tracking' => '',
			'attempts' => [], 'history' => [['at' => $now, 'who' => $who, 'action' => 'Commande créée', 'note' => 'Source : ' . $source, 'color' => '']],
			'lockedBy' => null, 'dhdPaidAt' => null, 'dhdPaymentId' => null, 'lastDhdUpdate' => $now, 'riskReturn' => false, 'duplicate' => $dup, 'firstCallAt' => null,
			'times' => (object) [], 'carrier' => auto_carrier($wid), 'courierId' => null, 'parcels' => null, 'fresh' => true,
		];
		if ($free) {
			$o['freeShip'] = true;
		}
		if ($platform !== '') {
			$o['platform'] = $platform;
		}
		unset($extra['phone2']);
		$o = array_merge($o, $extra);
		// la commande telle qu'elle est arrivée, avant toute modification (colonne « Origine »)
		$o['original'] = ['at' => $now, 'name' => $name, 'phone' => $fmt, 'address' => $address, 'wilaya' => $wid, 'commune' => $commune, 'delivery' => $delivery, 'note' => $note,
			'discount' => $o['discount'], 'discountType' => $o['discountType'] ?? 'percent', 'items' => array_map(fn($i) => ['pid' => $i['pid'], 'v' => $i['v'], 'q' => $i['q'], 'price' => $i['price']], $items)];
		rec_put($db, 'orders', (string) $id, $o, $rev);
		$uid = bin2hex(random_bytes(6));
		rec_put($db, 'activity', 'a' . $uid, ['_id' => 'a' . $uid, 'at' => $now, 'user' => $staff ? $u['name'] : 'Boutique', 'role' => $staff ? $u['role'] : 'site', 'action' => 'Nouvelle commande', 'entity' => $o['ref'], 'details' => 'Source : ' . $source], $rev);
		rec_put($db, 'notifs', 'n' . $uid, ['_id' => 'n' . $uid, 'at' => $now, 'txt' => 'Nouvelle commande ' . $o['ref'] . ' (' . $source . ')'], $rev);
		return ['id' => $id, 'ref' => $o['ref'], 'order' => public_order($o) + ['customer' => ['name' => $c['name'], 'phone' => $c['phone']]]];
	});
}

/** Transporteur choisi automatiquement : règle par wilaya, sinon transporteur par défaut. */
function auto_carrier(int $wid): string {
	$carriers = rec_all('carriers');
	$s = rec_data('kv', 'settings') ?? [];
	foreach ((array) ($s['carrierRules'] ?? []) as $r) {
		if ((int) ($r['wilaya'] ?? 0) === $wid && !empty($carriers[$r['carrier'] ?? '']['connected'])) {
			return (string) $r['carrier'];
		}
	}
	foreach ($carriers as $c) {
		if (!empty($c['isDefault']) && !empty($c['connected'])) {
			return (string) $c['id'];
		}
	}
	return ''; // aucune société par défaut : l'équipe la choisit à la confirmation
}

/**
 * API de conversions Meta : l'achat part aussi du serveur, car le pixel du navigateur est souvent bloqué
 * (bloqueurs, iPhone, navigateur intégré de Facebook). Même event_id que le pixel (« order-PK-… ») : Meta n'en garde qu'un.
 * Données client hachées en SHA-256 comme Meta l'exige. Une erreur ici ne bloque jamais la commande.
 */
function meta_capi_purchase(array $res): void {
	try {
		$s = rec_data('kv', 'settings') ?? [];
		$ev = rec_data('kv', 'pixel_events') ?? [];
		if (($s['purchaseOn'] ?? 'order') !== 'order' || empty($s['modules']['pixels']) || empty($ev['facebook']['Purchase']) || !function_exists('curl_init')) {
			return;
		}
		$pixels = array_filter(rec_all('pixels'), fn($p) => !empty($p['active']) && ($p['platform'] ?? '') === 'facebook'
			&& preg_match('/^\d{6,20}$/', (string) ($p['pixelId'] ?? '')) && trim((string) ($p['token'] ?? '')) !== '');
		if (!$pixels) {
			return; // pas de token « API de conversions » saisi dans ERP › Pixels
		}
		$o = $res['order'];
		$h = fn(string $v): string => hash('sha256', $v);
		$phone = digits((string) ($o['customer']['phone'] ?? ''));
		$names = preg_split('/\s+/u', mb_strtolower(trim((string) ($o['customer']['name'] ?? ''))), -1, PREG_SPLIT_NO_EMPTY);
		$user = ['ph' => [$h('213' . substr($phone, 1))], 'country' => [$h('dz')], 'client_user_agent' => (string) ($_SERVER['HTTP_USER_AGENT'] ?? '')];
		if ($names) {
			$user['fn'] = [$h($names[0])];
			if (count($names) > 1) {
				$user['ln'] = [$h((string) end($names))];
			}
		}
		$ct = mb_strtolower(preg_replace('/\s+/u', '', (string) ($o['commune'] ?? '')));
		if ($ct !== '') {
			$user['ct'] = [$h($ct)];
		}
		$fwd = trim(explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ''))[0]); // derrière le CDN Hostinger
		$user['client_ip_address'] = filter_var($fwd, FILTER_VALIDATE_IP) ? $fwd : client_ip();
		foreach (['_fbp' => 'fbp', '_fbc' => 'fbc'] as $cookie => $k) {
			if (!empty($_COOKIE[$cookie])) {
				$user[$k] = (string) $_COOKIE[$cookie];
			}
		}
		// valeur = même calcul que la boutique (orderTotal) : produits + livraison (prix client de la wilaya × coefficient de la société)
		// shortcut: le supplément de poids n'est pas compté ici, à ajouter si des colis lourds sont fréquents
		$value = array_sum(array_map(fn($i) => $i['price'] * $i['q'], $o['items']));
		if (empty($o['freeShip'])) {
			$w = rec_data('wilayas', (string) $o['wilaya']) ?? [];
			$c = rec_data('carriers', (string) ($o['carrier'] ?? '')) ?? [];
			$value += (int) round((float) ($o['delivery'] === 'desk' ? ($w['desk'] ?? 0) : ($w['home'] ?? 0)) * (float) ($c['feeFactor'] ?? 1) / 10) * 10;
		}
		$event = [
			'event_name' => 'Purchase', 'event_time' => time(), 'event_id' => 'order-' . $o['ref'], 'action_source' => 'website',
			'event_source_url' => (string) ($_SERVER['HTTP_REFERER'] ?? ('https://' . ($_SERVER['HTTP_HOST'] ?? '') . '/')),
			'user_data' => $user,
			'custom_data' => ['currency' => 'DZD', 'value' => $value, 'order_id' => $o['ref'], 'content_type' => 'product',
				'content_ids' => array_map(fn($i) => (string) $i['pid'], $o['items']), 'num_items' => array_sum(array_column($o['items'], 'q'))],
		];
		foreach ($pixels as $p) {
			$body = ['data' => [$event]];
			if (trim((string) ($p['testCode'] ?? '')) !== '') {
				$body['test_event_code'] = trim((string) $p['testCode']); // visible dans Events Manager › Tester les événements
			}
			$ch = curl_init('https://graph.facebook.com/v23.0/' . $p['pixelId'] . '/events?access_token=' . rawurlencode(trim((string) $p['token'])));
			curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => json_encode($body), CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
				CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => 3, CURLOPT_TIMEOUT => 5]);
			$out = curl_exec($ch);
			$code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
			curl_close($ch);
			if ($code !== 200) {
				error_log('[packlik] Meta CAPI ' . $p['pixelId'] . ' : HTTP ' . $code . ' ' . substr((string) $out, 0, 300));
			}
		}
	} catch (Throwable $e) {
		error_log('[packlik] Meta CAPI : ' . $e->getMessage());
	}
}

/** Ce que le client final peut voir de sa commande (page merci, suivi). */
function public_order(array $o): array {
	$o = array_intersect_key($o, array_flip(['id', 'ref', 'created', 'status', 'items', 'discount', 'discountType', 'delivery', 'wilaya', 'commune', 'tracking', 'unreachN', 'carrier', 'parcels', 'freeShip', 'feeFixed', 'history']));
	$o['history'] = array_values(array_map(fn($h) => ['at' => $h['at'], 'action' => $h['action'], 'color' => $h['color'] ?? ''], array_filter((array) ($o['history'] ?? []), fn($h) => !preg_match('/Assign|Réassign|Verrou|Appel|Poids|Remise/u', (string) $h['action']))));
	foreach ($o['items'] as &$i) {
		unset($i['cost']);
	}
	return $o;
}
