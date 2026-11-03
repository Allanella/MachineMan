<?php
require __DIR__ . '/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['ok' => false, 'error' => 'Method not allowed.'], 405);
}
require_admin_json();

// If the file is larger than post_max_size, PHP drops everything silently
if (empty($_POST) && empty($_FILES) && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
    json_out(['ok' => false, 'error' => 'That file is bigger than the server allows (limit ' . ini_get('post_max_size') . ').'], 413);
}

if (!csrf_ok($_POST['csrf'] ?? null)) {
    json_out(['ok' => false, 'error' => 'Security check failed. Reload the page and try again.'], 419);
}

$title    = trim((string)($_POST['title'] ?? ''));
$category = (string)($_POST['category'] ?? '');

if ($title === '' || mb_strlen($title) > 255) {
    json_out(['ok' => false, 'error' => 'Please enter a title (up to 255 characters).'], 422);
}
if (!in_array($category, CATEGORIES, true)) {
    json_out(['ok' => false, 'error' => 'Please choose a category.'], 422);
}

$file = $_FILES['media'] ?? null;
if (!$file || $file['error'] === UPLOAD_ERR_NO_FILE) {
    json_out(['ok' => false, 'error' => 'Please choose an image or video.'], 422);
}
if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE) {
    json_out(['ok' => false, 'error' => 'File is larger than the server allows (limit ' . ini_get('upload_max_filesize') . ').'], 413);
}
if ($file['error'] !== UPLOAD_ERR_OK) {
    json_out(['ok' => false, 'error' => 'Upload failed (code ' . (int)$file['error'] . '). Please try again.'], 500);
}
if ($file['size'] > MAX_BYTES) {
    json_out(['ok' => false, 'error' => 'File is too big (max ' . (MAX_BYTES / 1048576) . ' MB).'], 413);
}

// Check the REAL file type, not just the name
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
if (!isset(ALLOWED_TYPES[$mime])) {
    json_out(['ok' => false, 'error' => 'Only JPG, PNG, GIF, WebP images and MP4, MOV, WebM videos are allowed.'], 415);
}
[$ext, $kind] = ALLOWED_TYPES[$mime];

if (!is_dir(UPLOAD_DIR) && !mkdir(UPLOAD_DIR, 0755, true)) {
    json_out(['ok' => false, 'error' => 'Could not create the uploads folder.'], 500);
}
// Never let scripts run from the uploads folder
$guard = UPLOAD_DIR . '/.htaccess';
if (!file_exists($guard)) {
    file_put_contents($guard, "<FilesMatch \"\\.(php|phtml|phar|pl|py|cgi|sh)$\">\n    Require all denied\n</FilesMatch>\n");
}

$name = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
if (!move_uploaded_file($file['tmp_name'], UPLOAD_DIR . '/' . $name)) {
    json_out(['ok' => false, 'error' => 'Could not save the file (check the uploads folder permissions).'], 500);
}

$stmt = $pdo->prepare(
    'INSERT INTO media_uploads (title, category, file_url, file_type) VALUES (?, ?, ?, ?)'
);
$stmt->execute([$title, $category, UPLOAD_URL . $name, $kind]);

$row = $pdo->prepare('SELECT id, title, category, file_url, file_type, created_at FROM media_uploads WHERE id = ?');
$row->execute([$pdo->lastInsertId()]);

json_out(['ok' => true, 'item' => $row->fetch()]);