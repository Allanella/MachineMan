<?php
require_once 'db.php';
/** @var PDO $pdo */
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $category = trim($_POST['category'] ?? 'General');
    
    if (empty($title)) {
        header("Location: index.php?error=Title is required");
        exit;
    }
    
    if (isset($_FILES['mediaFile']) && $_FILES['mediaFile']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['mediaFile']['tmp_name'];
        $fileName = $_FILES['mediaFile']['name'];
        $fileSize = $_FILES['mediaFile']['size'];
        $fileType = $_FILES['mediaFile']['type'];
        
        // Ensure uploads directory exists
        $uploadFileDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadFileDir)) {
            mkdir($uploadFileDir, 0755, true);
        }
        
        // Sanitize filename and create unique name
        $newFileName = time() . '_' . preg_replace("/[^a-zA-Z0-9._-]/", "", $fileName);
        $dest_path = $uploadFileDir . $newFileName;
        
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
        if (!in_array($fileExtension, $allowedExtensions)) {
            header("Location: index.php?error=Invalid file type. Allowed: images and videos.");
            exit;
        }
        
        if (move_uploaded_file($fileTmpPath, $dest_path)) {
            $fileUrl = '/uploads/' . $newFileName;
            $typeCategory = str_starts_with($fileType, 'video') ? 'video' : 'image';
            
            // Insert into MySQL database
            $stmt = $pdo->prepare("INSERT INTO media_uploads (title, category, file_url, file_type) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $category, $fileUrl, $typeCategory]);
            
            header("Location: index.php?success=1");
            exit;
        } else {
            header("Location: index.php?error=Error moving uploaded file.");
            exit;
        }
    } else {
        header("Location: index.php?error=Please select a valid file to upload.");
        exit;
    }
} else {
    header("Location: index.php");
    exit;
}
?>