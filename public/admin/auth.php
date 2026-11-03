<?php
// Shared helpers for the admin panel: session, login check, CSRF, settings.
// Needs admin/db.php (which defines $pdo and $adminPassword).

$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/admin/',
    'secure'   => $secure,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

require_once __DIR__ . '/db.php';   // defines $pdo and $adminPassword

// ---------- Settings ----------
const UPLOAD_DIR = __DIR__ . '/../uploads';   // = public_html/uploads
const UPLOAD_URL = '/uploads/';
const MAX_BYTES  = 100 * 1024 * 1024;         // 100 MB per file (server limits may be lower)

const CATEGORIES = [
    'Power Equipment',
    'Agricultural Equipment',
    'Industrial Equipment',
    'Generators',
    'Welding Machines',
    'Hand Tools',
    'Compressors',
    'Water Pumps',
    'Farm Machinery & Equipment',
    'Heavy Construction Machinery',
];

const ALLOWED_TYPES = [
    'image/jpeg'      => ['jpg',  'image'],
    'image/png'       => ['png',  'image'],
    'image/gif'       => ['gif',  'image'],
    'image/webp'      => ['webp', 'image'],
    'video/mp4'       => ['mp4',  'video'],
    'video/quicktime' => ['mov',  'video'],
    'video/webm'      => ['webm', 'video'],
];

// ---------- Helpers ----------
function is_admin(): bool
{
    return !empty($_SESSION['admin']);
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf'];
}

function csrf_ok($token): bool
{
    return is_string($token) && !empty($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], $token);
}

function password_ok(string $input): bool
{
    global $adminPassword;
    $p = (string)($adminPassword ?? '');
    if ($p === '') {
        return false;
    }
    // Supports a plain password or a bcrypt hash ($2y$...)
    if (strpos($p, '$2y$') === 0) {
        return password_verify($input, $p);
    }
    return hash_equals($p, $input);
}

function json_out(array $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store');
    echo json_encode($data);
    exit;
}

function require_admin_json(): void
{
    if (!is_admin()) {
        json_out(['ok' => false, 'error' => 'Your session ended. Please log in again.'], 401);
    }
}

function fetch_items(): array
{
    global $pdo;
    $stmt = $pdo->query(
        'SELECT id, title, category, file_url, file_type, created_at
         FROM media_uploads
         ORDER BY created_at DESC, id DESC'
    );
    return $stmt->fetchAll();
}