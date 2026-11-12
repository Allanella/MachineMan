<?php
// Public, read-only: the editable text, services and categories for the website.
require __DIR__ . '/../admin/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache');

$out = ['settings' => new stdClass(), 'services' => [], 'categories' => [], 'projects' => []];
try {
    $s = [];
    foreach ($pdo->query('SELECT k, v FROM site_settings')->fetchAll(PDO::FETCH_ASSOC) as $r) {
        if ($r['v'] !== null && $r['v'] !== '') $s[$r['k']] = $r['v'];
    }
    if ($s) $out['settings'] = $s;
    $out['services'] = $pdo->query('SELECT title, body AS text FROM services ORDER BY sort_order, id')->fetchAll(PDO::FETCH_ASSOC);
    $cats = $pdo->query('SELECT slug, name, description, image_url AS image, is_featured FROM categories ORDER BY sort_order, id')->fetchAll(PDO::FETCH_ASSOC);
    foreach ($cats as &$c) $c['featured'] = (bool)$c['is_featured'];
    unset($c);
    $out['categories'] = $cats;
} catch (Throwable $e) { /* tables not created yet: the website uses its built-in content */ }
try {
    $out['projects'] = $pdo->query('SELECT tag, title, body AS text, image_url AS image FROM projects ORDER BY sort_order, id')->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $e) {}

echo json_encode($out, JSON_UNESCAPED_UNICODE);
