<?php
/**
 * Sociétés de livraison : catalogue (114 sociétés) et liaison API pour les familles Yalidine,
 * EcoTrack (dont DHD) et Noest — envoi du colis, suivi, test des clés.
 * Formats repris du module livraison du thème Tajer. Les autres familles (ZR, Maystro, Procolis…)
 * fonctionnent en saisie manuelle du numéro de suivi.
 * NON TESTÉ avec de vrais comptes : faire un premier envoi d'essai avec chaque société.
 */
declare(strict_types=1);

const CARRIER_API = ['yalidine', 'ecotrack', 'noest'];
const CARRIER_FIELDS = [
	'yalidine' => [['key', 'API ID'], ['token', 'API Token'], ['from', 'Wilaya de départ (numéro)']],
	'ecotrack' => [['token', 'API Token']],
	'noest' => [['token', 'API Token'], ['guid', 'User GUID']],
];

function carrier_catalog(): array {
	static $c;
	return $c ??= require __DIR__ . '/carriers_catalog.php';
}

function carrier_catalog_public(): array {
	$out = [];
	foreach (carrier_catalog() as $slug => [$name, $family, , $logo]) {
		$out[] = ['id' => $slug, 'name' => $name, 'family' => $family, 'logo' => $logo, 'api' => in_array($family, CARRIER_API, true), 'fields' => CARRIER_FIELDS[$family] ?? []];
	}
	return $out;
}

/** [fiche transporteur enregistrée, entrée du catalogue, clés API]. */
function carrier_ctx(string $id): array {
	$car = rec_data('carriers', $id) ?? fail(404, 'Société de livraison introuvable.');
	$cat = carrier_catalog()[$id] ?? null;
	if (!$cat || !in_array($cat[1], CARRIER_API, true)) {
		fail(422, $car['name'] . ' : pas de liaison API. Saisissez le numéro de suivi à la main.');
	}
	$acc = (array) ($car['creds'] ?? []);
	if (empty($acc['token'])) {
		fail(422, 'Clés API manquantes pour ' . $car['name'] . '.');
	}
	return [$car, $cat, $acc];
}

function carrier_base(string $slug, array $cat): string {
	return $cat[2] ?: 'https://' . $slug . '.ecotrack.dz/api/v1';
}

function carrier_http(string $slug, array $cat, array $acc, string $method, string $path, ?array $body = null, bool $form = false): array {
	$h = ['Accept: application/json'];
	if ($cat[1] === 'yalidine') {
		$h[] = 'X-API-ID: ' . ($acc['key'] ?? '');
		$h[] = 'X-API-TOKEN: ' . ($acc['token'] ?? '');
	} elseif ($cat[1] === 'ecotrack') {
		$h[] = 'Authorization: Bearer ' . ($acc['token'] ?? '');
	}
	$ch = curl_init(carrier_base($slug, $cat) . $path);
	curl_setopt_array($ch, [CURLOPT_CUSTOMREQUEST => $method, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 25, CURLOPT_CONNECTTIMEOUT => 10, CURLOPT_FOLLOWLOCATION => false]);
	if ($body !== null) {
		$h[] = 'Content-Type: ' . ($form ? 'application/x-www-form-urlencoded' : 'application/json');
		curl_setopt($ch, CURLOPT_POSTFIELDS, $form ? http_build_query($body) : json_encode($body, JSON_UNESCAPED_UNICODE));
	}
	curl_setopt($ch, CURLOPT_HTTPHEADER, $h);
	$raw = curl_exec($ch);
	$code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
	curl_close($ch);
	if ($raw === false) {
		fail(502, 'Connexion impossible à ' . $cat[0] . '.');
	}
	$json = json_decode((string) $raw, true);
	if ($code >= 400) {
		$msg = is_array($json) ? ($json['message'] ?? $json['error']['message'] ?? (is_string($json['error'] ?? null) ? $json['error'] : '')) : '';
		if (!$msg && is_array($json['errors'] ?? null)) {
			$msg = implode(' ', array_map(fn($e) => is_array($e) ? implode(' ', $e) : (string) $e, $json['errors']));
		}
		fail(502, $cat[0] . ' : ' . ($msg ?: ($code === 401 || $code === 403 ? 'clés API incorrectes' : 'erreur ' . $code)));
	}
	return is_array($json) ? $json : [];
}

/** Liste lente à obtenir (communes, wilayas du transporteur) gardée une semaine sur disque. */
function carrier_cached(string $key, callable $fetch): array {
	$f = ROOT . '/data/cache/' . md5($key) . '.json';
	if (is_file($f) && filemtime($f) > time() - 604800) {
		return (array) json_decode((string) file_get_contents($f), true);
	}
	$v = (array) $fetch();
	if ($v) {
		is_dir(dirname($f)) || mkdir(dirname($f), 0750, true);
		file_put_contents($f, json_encode($v, JSON_UNESCAPED_UNICODE));
	}
	return $v;
}

// ponytail: les transporteurs n'ont pas tous intégré les wilayas 59 à 69 ; on envoie la wilaya d'origine tant que leur liste n'est pas à jour.
function carrier_wilaya_id(int $n): int {
	return [59 => 3, 60 => 5, 61 => 7, 62 => 12, 63 => 13, 64 => 14, 65 => 17, 66 => 17, 67 => 26, 68 => 28, 69 => 32][$n] ?? $n;
}

function unaccent(string $s): string {
	return strtolower(strtr($s, ['é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e', 'à' => 'a', 'â' => 'a', 'ä' => 'a', 'î' => 'i', 'ï' => 'i', 'ô' => 'o', 'ö' => 'o', 'ù' => 'u', 'û' => 'u', 'ü' => 'u', 'ç' => 'c', 'É' => 'e', 'È' => 'e', 'À' => 'a', 'Ç' => 'c', 'Â' => 'a', 'Î' => 'i', 'Ô' => 'o']));
}

/** Rapproche la commune saisie de la liste du transporteur (orthographes différentes). */
function carrier_match_commune(string $name, array $list): string {
	$norm = fn($s) => preg_replace('/[^a-z]/', '', unaccent((string) $s));
	$want = $norm($name);
	$best = '';
	$score = 0;
	foreach ($list as $cand) {
		if ($norm($cand) === $want) {
			return (string) $cand;
		}
		similar_text($want, $norm($cand), $pct);
		if ($pct > $score) {
			$score = $pct;
			$best = (string) $cand;
		}
	}
	return $score >= 70 ? $best : $name;
}

function carrier_communes(string $slug, array $cat, array $acc, int $wid): array {
	return carrier_cached("communes_{$slug}_{$wid}", function () use ($slug, $cat, $acc, $wid) {
		if ($cat[1] === 'yalidine') {
			return array_column((array) (carrier_http($slug, $cat, $acc, 'GET', '/communes/?wilaya_id=' . $wid . '&page_size=1000')['data'] ?? []), 'name');
		}
		if ($cat[1] === 'ecotrack') {
			$r = carrier_http($slug, $cat, $acc, 'GET', '/get/communes');
			$rows = isset($r['data']) ? (array) $r['data'] : $r;
			return array_column(array_filter($rows, fn($c) => is_array($c) && (int) ($c['wilaya_id'] ?? 0) === $wid), 'nom');
		}
		return [];
	});
}

function carrier_test(string $id): array {
	[, $cat, $acc] = carrier_ctx($id);
	$path = match ($cat[1]) {
		'yalidine' => '/wilayas/',
		'noest' => '/get/wilayas?api_token=' . rawurlencode($acc['token']) . '&user_guid=' . rawurlencode($acc['guid'] ?? ''),
		default => '/get/wilayas',
	};
	carrier_http($id, $cat, $acc, 'GET', $path);
	return ['ok' => true];
}

/**
 * Crée le colis chez le transporteur et inscrit le numéro de suivi sur la commande.
 * Le montant à encaisser et le texte des produits viennent de l'écran d'expédition (rôles admin / gérant).
 */
function carrier_send(array $in): array {
	$o = rec_data('orders', (string) ($in['orderId'] ?? '')) ?? fail(404, 'Commande introuvable.');
	if (!empty($o['tracking'])) {
		fail(409, 'Ce colis a déjà un numéro de suivi.');
	}
	$slug = (string) ($o['carrier'] ?? '');
	[$car, $cat, $acc] = carrier_ctx($slug);
	$c = rec_data('customers', (string) $o['customerId']) ?? fail(422, 'Client introuvable.');
	$wid = carrier_wilaya_id((int) $o['wilaya']);
	$desk = ($o['delivery'] ?? 'home') === 'desk';
	$name = (string) $c['name'];
	$phone = digits((string) $c['phone']);
	$address = (string) ($o['address'] ?: $o['commune']);
	$amount = (int) round((float) ($in['amount'] ?? 0));
	$products = mb_substr((string) ($in['products'] ?? ''), 0, 250);
	$note = mb_substr((string) ($o['note'] ?? ''), 0, 250);
	$commune = carrier_match_commune((string) $o['commune'], carrier_communes($slug, $cat, $acc, $wid));
	$base = carrier_base($slug, $cat);

	if ($cat[1] === 'yalidine') {
		$wilayas = carrier_cached("yw_$slug", fn() => array_column((array) (carrier_http($slug, $cat, $acc, 'GET', '/wilayas/')['data'] ?? []), 'name', 'id'));
		$parts = preg_split('/\s+/u', $name, 2);
		$parcel = [
			'order_id' => (string) $o['ref'], 'firstname' => $parts[0], 'familyname' => $parts[1] ?? $parts[0], 'contact_phone' => $phone,
			'address' => $address, 'to_commune_name' => $commune, 'to_wilaya_name' => $wilayas[$wid] ?? '',
			'from_wilaya_name' => $wilayas[(int) ($acc['from'] ?? 16) ?: 16] ?? '',
			'product_list' => $products, 'price' => $amount, 'freeshipping' => true,
			'is_stopdesk' => $desk, 'has_exchange' => false, 'do_insurance' => false, 'declared_value' => $amount,
		];
		if ($desk) { // bureau de la commune si possible, sinon le premier de la wilaya
			$centers = (array) (carrier_http($slug, $cat, $acc, 'GET', '/centers/?wilaya_id=' . $wid)['data'] ?? []);
			$pick = array_values(array_filter($centers, fn($x) => strcasecmp((string) ($x['commune_name'] ?? ''), $commune) === 0))[0] ?? ($centers[0] ?? null);
			if (!$pick) {
				fail(422, $cat[0] . ' : aucun bureau dans cette wilaya, choisissez la livraison à domicile.');
			}
			$parcel['stopdesk_id'] = (int) $pick['center_id'];
		}
		$r = carrier_http($slug, $cat, $acc, 'POST', '/parcels/', [$parcel]);
		$row = $r[(string) $o['ref']] ?? reset($r);
		if (empty($row['success']) || empty($row['tracking'])) {
			fail(422, $cat[0] . ' : ' . ($row['message'] ?? 'colis refusé'));
		}
		$res = ['tracking' => (string) $row['tracking'], 'label' => (string) ($row['label'] ?? ''), 'url' => ''];
	} else {
		$data = ['reference' => (string) $o['ref'], 'telephone' => $phone, 'adresse' => $address, 'commune' => $commune, 'produit' => $products, 'montant' => $amount, 'remarque' => $note, 'stop_desk' => $desk ? 1 : 0];
		if ($cat[1] === 'noest') {
			$data += ['api_token' => $acc['token'], 'user_guid' => $acc['guid'] ?? '', 'client' => $name, 'wilaya_id' => $wid, 'type_id' => 1, 'poids' => max(1, (int) ceil((float) ($in['weight'] ?? 1))), 'can_open' => 1];
			$r = carrier_http($slug, $cat, $acc, 'POST', '/create/order', $data);
		} else {
			$data += ['nom_client' => $name, 'code_wilaya' => $wid, 'type' => 1, 'boutique' => 'PackLik'];
			$r = carrier_http($slug, $cat, $acc, 'POST', '/create/order', $data, true);
		}
		$tracking = (string) ($r['tracking'] ?? $r['data']['tracking'] ?? '');
		if ($tracking === '') {
			fail(422, $cat[0] . ' : ' . ($r['message'] ?? 'aucun numéro de suivi renvoyé'));
		}
		$res = [
			'tracking' => $tracking,
			'label' => $base . '/get/order/label' . ($cat[1] === 'noest' ? '' : '/') . '?api_token=' . rawurlencode($acc['token']) . '&tracking=' . rawurlencode($tracking),
			'url' => $cat[1] === 'ecotrack' ? 'https://suivi.ecotrack.dz/suivi/' . rawurlencode($tracking) : '',
		];
	}
	// le numéro est inscrit tout de suite : si le navigateur plante ici, le colis reste rattaché à la commande
	tx(function (PDO $db) use ($o, $res) {
		$cur = rec_data('orders', (string) $o['id']);
		$cur['tracking'] = $res['tracking'];
		$cur['label'] = $res['label'];
		$cur['trackUrl'] = $res['url'];
		rec_put($db, 'orders', (string) $o['id'], $cur, next_rev($db));
	});
	return $res;
}

/**
 * Annule le colis chez la société de livraison (avant ramassage) et retire le numéro de suivi de la commande.
 * Formats repris des API publiques Yalidine / EcoTrack / Noest, à vérifier avec un vrai compte.
 */
function carrier_cancel(array $in): array {
	$o = rec_data('orders', (string) ($in['orderId'] ?? '')) ?? fail(404, 'Commande introuvable.');
	$tracking = (string) ($o['tracking'] ?? '');
	if ($tracking === '') {
		return ['ok' => true];
	}
	$slug = (string) ($o['carrier'] ?? '');
	[, $cat, $acc] = carrier_ctx($slug);
	if ($cat[1] === 'yalidine') {
		carrier_http($slug, $cat, $acc, 'DELETE', '/parcels/' . rawurlencode($tracking));
	} elseif ($cat[1] === 'noest') {
		carrier_http($slug, $cat, $acc, 'POST', '/delete/order', ['api_token' => $acc['token'], 'user_guid' => $acc['guid'] ?? '', 'tracking' => $tracking]);
	} else {
		carrier_http($slug, $cat, $acc, 'DELETE', '/delete/order?tracking=' . rawurlencode($tracking));
	}
	tx(function (PDO $db) use ($o) {
		$cur = rec_data('orders', (string) $o['id']);
		$cur['tracking'] = '';
		$cur['label'] = '';
		$cur['trackUrl'] = '';
		rec_put($db, 'orders', (string) $o['id'], $cur, next_rev($db));
	});
	return ['ok' => true];
}

/** Étape ERP correspondant au dernier statut du transporteur. */
function carrier_step(string $key, string $label): string {
	$s = unaccent($key . ' ' . $label);
	return match (true) {
		(bool) preg_match('/return_received|retourne au vendeur|retour (recu|receptionne)/', $s) => 'returned',
		(bool) preg_match('/retour|return/', $s) => 'returning',
		(bool) preg_match('/tentative|echec|echoue|attempt|en alerte/', $s) => 'failed',
		(bool) preg_match('/dispatched_to_driver|sorti en livraison|pret pour livreur|en livraison|avec le livreur/', $s) => 'outfor',
		(bool) preg_match('/livred|encaiss|recouvert|payed|livre\b|livree/', $s) => 'delivered',
		(bool) preg_match('/pas encore|order_information|prete?_a_expedier|pret a expedier|en preparation/', $s) => 'sent',
		(bool) preg_match('/picked|ramasse/', $s) => 'picked',
		(bool) preg_match('/accepted_by_carrier|transfert|expedie|centre|wilaya|transit|station/', $s) => 'transit',
		default => 'sent',
	};
}

/** Historique du colis chez le transporteur : étapes (plus récente d'abord) et étape ERP correspondante. */
function carrier_track(array $in): array {
	$o = rec_data('orders', (string) ($in['orderId'] ?? '')) ?? fail(404, 'Commande introuvable.');
	$tracking = (string) ($o['tracking'] ?? '');
	if ($tracking === '') {
		fail(422, 'Cette commande n\'a pas de numéro de suivi.');
	}
	$slug = (string) ($o['carrier'] ?? '');
	[, $cat, $acc] = carrier_ctx($slug);
	$eco = ['order_information_received_by_carrier' => 'En attente d\'envoi', 'prete_a_expedier' => 'Prête à expédier', 'picked' => 'Ramassée par le transporteur', 'accepted_by_carrier' => 'Arrivée à la station régionale', 'dispatched_to_driver' => 'Avec le livreur', 'livred' => 'Livrée', 'attempt_delivery' => 'Tentative de livraison échouée', 'return_asked' => 'Retour demandé', 'return_in_transit' => 'Retour en route', 'Return_received' => 'Retour reçu par le vendeur', 'encaissed' => 'Montant encaissé', 'payed' => 'Payé au vendeur'];
	if ($cat[1] === 'yalidine') {
		$r = carrier_http($slug, $cat, $acc, 'GET', '/histories/?tracking=' . rawurlencode($tracking));
		$rows = array_map(fn($e) => ['date' => (string) ($e['date_status'] ?? ''), 'status' => (string) ($e['status'] ?? ''), 'key' => '', 'place' => trim(($e['commune_name'] ?? '') . ' ' . ($e['wilaya_name'] ?? ''))], (array) ($r['data'] ?? []));
	} elseif ($cat[1] === 'noest') {
		$r = carrier_http($slug, $cat, $acc, 'POST', '/get/trackings/info', ['api_token' => $acc['token'], 'user_guid' => $acc['guid'] ?? '', 'trackings' => [$tracking]]);
		$rows = array_map(fn($e) => ['date' => (string) ($e['date'] ?? $e['date_status'] ?? ''), 'status' => (string) ($e['event'] ?? $e['status'] ?? ''), 'key' => '', 'place' => (string) ($e['causer'] ?? '')], (array) ($r[$tracking]['activity'] ?? $r['data'] ?? []));
	} else {
		$r = carrier_http($slug, $cat, $acc, 'GET', '/get/tracking/info?tracking=' . rawurlencode($tracking));
		$rows = array_map(fn($e) => ['date' => trim(($e['date'] ?? '') . ' ' . ($e['time'] ?? '')), 'status' => $eco[$e['status'] ?? ''] ?? (string) ($e['status'] ?? ''), 'key' => (string) ($e['status'] ?? ''), 'place' => (string) ($e['scanLocation'] ?? '')], (array) ($r['activity'] ?? []));
	}
	usort($rows, fn($a, $b) => strcmp($b['date'], $a['date']));
	return ['step' => $rows ? carrier_step($rows[0]['key'], $rows[0]['status']) : null, 'events' => $rows];
}
