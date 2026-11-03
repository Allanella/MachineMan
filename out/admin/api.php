<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';
/** @var PDO $pdo */

$stmt = $pdo->query("SELECT * FROM media_uploads ORDER BY created_at DESC");
$media = $stmt->fetchAll();

echo json_encode($media);
?>