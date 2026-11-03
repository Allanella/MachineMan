<?php
require_once 'db.php';
/** @var PDO $pdo */
session_start();

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    
    // Fetch file path before deleting record
    $stmt = $pdo->prepare("SELECT file_url FROM media_uploads WHERE id = ?");
    $stmt->execute([$id]);
    $item = $stmt->fetch();
    
    if ($item) {
        // Delete physical file from server if it exists
        $filePath = __DIR__ . '/..' . $item['file_url'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        
        // Delete record from database
        $deleteStmt = $pdo->prepare("DELETE FROM media_uploads WHERE id = ?");
        $deleteStmt->execute([$id]);
        
        header("Location: index.php?success=Deleted successfully");
        exit;
    }
}

header("Location: index.php?error=Item not found");
exit;
?>