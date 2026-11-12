<?php
// Public, read-only list of uploaded media for the website gallery.
// Place this file at: public_html/api/media.php  (create the "api" folder)
// It reuses the database login from admin/db.php, so no password is stored here.

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');

try {
    require_once __DIR__ . '/../admin/db.php';
    /** @var PDO $pdo */
    $stmt = $pdo->query(
        'SELECT id, title, category, file_url, file_type, created_at
         FROM media_uploads
         ORDER BY created_at DESC'
    );
    echo json_encode($stmt->fetchAll());
} catch (Throwable $e) {
    error_log('media.php failed: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([]);
}
