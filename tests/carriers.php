<?php
// Choix de la commune stop desk EcoTrack, sans réseau. Lancer : php tests/carriers.php
require __DIR__ . '/../api/carriers.php';

$c = ['Bab Ezzouar' => 0, 'Alger Centre' => 1, 'Kouba' => 1];
assert(ecotrack_desk_commune('Kouba', $c) === 'Kouba', 'commune avec bureau gardée');
assert(ecotrack_desk_commune('Bab Ezzouar', $c) === 'Alger Centre', 'commune sans bureau → bureau de la wilaya');
assert(ecotrack_desk_commune('', $c) === 'Alger Centre', 'commune vide → bureau de la wilaya');
assert(ecotrack_desk_commune('X', ['A' => 0]) === null, 'aucun bureau dans la wilaya');
echo "ok  stop desk EcoTrack (4 vérifications)\n";
