<?php
/**
 * Copier ce fichier en config.php pour utiliser MySQL / MariaDB (conseillé en production).
 * Sans config.php, PackLik utilise une base SQLite dans data/app.sqlite : rien à installer.
 * Les tables sont créées automatiquement au premier appel.
 */
return [
	'dsn' => 'mysql:host=localhost;dbname=packlik;charset=utf8mb4',
	'user' => 'packlik',
	'pass' => 'CHANGER-CE-MOT-DE-PASSE',
];
