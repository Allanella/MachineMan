<?php
// Public, read-only list of published machines for the website.
require __DIR__ . '/../admin/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');
header('Access-Control-Allow-Origin: *');

$rows = $pdo->query(
  "SELECT slug, name, category, description, long_description, price, availability, image_url, specs
   FROM machines WHERE is_published = 1 ORDER BY id ASC"
)->fetchAll(PDO::FETCH_ASSOC);

foreach ($rows as &$r) {
    $r['specs'] = json_decode($r['specs'] ?: '{}', true) ?: new stdClass();
}
echo json_encode($rows, JSON_UNESCAPED_UNICODE);
