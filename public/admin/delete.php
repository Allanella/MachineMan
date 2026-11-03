<?php
require __DIR__ . '/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['ok' => false, 'error' => 'Method not allowed.'], 405);
}
require_admin_json();

if (!csrf_ok($_POST['csrf'] ?? null)) {
    json_out(['ok' => false, 'error' => 'Security check failed. Reload the page and try again.'], 419);
}

$id = (int)($_POST['id'] ?? 0);
if ($id <= 0) {
    json_out(['ok' => false, 'error' => 'Invalid item.'], 422);
}

$stmt = $pdo->prepare('SELECT file_url FROM media_uploads WHERE id = ?');
$stmt->execute([$id]);
$row = $stmt->fetch();
if (!$row) {
    json_out(['ok' => false, 'error' => 'That item no longer exists.'], 404);
}

// Remove the file from disk (only inside the uploads folder)
$path = UPLOAD_DIR . '/' . basename((string)$row['file_url']);
if (is_file($path) && basename($path) !== '.htaccess') {
    @unlink($path);
}

$pdo->prepare('DELETE FROM media_uploads WHERE id = ?')->execute([$id]);

json_out(['ok' => true]);