<?php
/** Serveur de développement : php -S localhost:8080 router.php — reproduit les interdictions du .htaccess. */
$p = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#^/(data|tests|\.git)(/|$)|^/(config\.php|router\.php|.*\.(sqlite|md|sql))$|^/api/(lib|carriers|carriers_catalog)\.php$|^/uploads/.*\.php#i', $p)) {
	http_response_code(403);
	exit('Interdit');
}
return false;
