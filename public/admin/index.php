<?php
session_start();

// Define your secure admin password here (or change it to your preference)
$admin_password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // Default password: MachineMan2026!
// Alternatively, for a simple plain text password check, you can use: 
// $admin_plain_password = "YourSecurePasswordHere";

// Handle Login Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['admin_login'])) {
    $passwordInput = $_POST['password'] ?? '';
    
    // Check password (using password verification)
    if (password_verify($passwordInput, $admin_password_hash)) {
        $_SESSION['admin_logged_in'] = true;
        header("Location: index.php");
        exit;
    } else {
        $login_error = "Invalid password. Please try again.";
    }
}

// Handle Logout
if (isset($_GET['logout'])) {
    unset($_SESSION['admin_logged_in']);
    session_destroy();
    header("Location: index.php");
    exit;
}

// Enforce Authentication: If not logged in, show login form
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true):
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - MachineMan</title>
    <style>
        :root { --primary: #2563eb; --primary-dark: #1d4ed8; --bg: #f8fafc; --card-bg: #ffffff; --text: #1e293b; --border: #e2e8f0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .login-card { width: 100%; max-width: 380px; background: var(--card-bg); padding: 35px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid var(--border); }
        h2 { margin-top: 0; font-size: 22px; color: #0f172a; text-align: center; margin-bottom: 20px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; }
        input[type="password"] { width: 100%; padding: 11px; box-sizing: border-box; border: 1px solid var(--border); border-radius: 6px; font-size: 14px; }
        .btn { width: 100%; background: #111; color: white; border: none; padding: 11px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; transition: background 0.2s; }
        .btn:hover { background: #333; }
        .alert-error { background: #fee2e2; color: #991b1b; padding: 10px; border-radius: 6px; margin-bottom: 16px; font-size: 13px; text-align: center; }
    </style>
</head>
<body>
<div class="login-card">
    <h2>Admin Dashboard Login</h2>
    <?php if (isset($login_error)): ?>
        <div class="alert-error"><?= htmlspecialchars($login_error) ?></div>
    <?php endif; ?>
    <form method="POST">
        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" required autofocus placeholder="Enter admin password">
        </div>
        <button type="submit" name="admin_login" class="btn">Sign In</button>
    </form>
</div>
</body>
</html>
<?php
    exit;
endif;

// --- AUTHENTICATED DASHBOARD CONTENT BELOW ---
require_once 'db.php';
/** @var PDO $pdo */

$stmt = $pdo->query("SELECT * FROM media_uploads ORDER BY created_at DESC");
$mediaList = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MachineMan Admin Panel</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --danger: #dc2626;
            --danger-dark: #b91c1c;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text: #1e293b;
            --border: #e2e8f0;
        }
        body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 20px; }
        .container { max-width: 1000px; background: var(--card-bg); padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin: auto; }
        .header-flex { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
        h1 { margin-top: 0; font-size: 24px; color: #0f172a; }
        p { color: #64748b; }
        
        .upload-section { background: #f1f5f9; padding: 20px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 30px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .form-group { margin-bottom: 15px; }
        .form-group.full { grid-column: span 2; }
        label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; }
        input[type="text"], select, input[type="file"] { width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid var(--border); border-radius: 6px; background: #fff; font-size: 14px; }
        
        .btn { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; transition: background 0.2s; text-decoration: none; display: inline-block; }
        .btn:hover { background: var(--primary-dark); }
        .btn-danger { background: var(--danger); padding: 6px 12px; font-size: 12px; }
        .btn-danger:hover { background: var(--danger-dark); }
        .btn-logout { background: #64748b; padding: 8px 14px; font-size: 13px; }
        .btn-logout:hover { background: #475569; }

        .alert-success { background: #dcfce7; color: #166534; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; }
        .alert-error { background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; }

        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--border); font-size: 14px; }
        th { background: #f8fafc; font-weight: 600; color: #475569; }
        tr:hover { background: #f8fafc; }
        
        .preview-thumb { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border); }
        .badge { display: inline-block; padding: 4px 8px; font-size: 12px; font-weight: 600; border-radius: 4px; background: #e2e8f0; color: #334155; }
        .badge-image { background: #e0f2fe; color: #0369a1; }
        .badge-video { background: #f3e8ff; color: #7e22ce; }

        @media (max-width: 768px) {
            .form-grid { grid-template-columns: 1fr; }
            .form-group.full { grid-column: span 1; }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header-flex">
        <div>
            <h1>MachineMan Admin Dashboard</h1>
            <p>Upload new machines, tools, or gallery files to display on your platform.</p>
        </div>
        <a href="index.php?logout=1" class="btn btn-logout">Logout</a>
    </div>
    
    <?php if (isset($_GET['success'])): ?>
        <div class="alert-success"><?= htmlspecialchars($_GET['success'] === '1' ? 'Media uploaded successfully!' : $_GET['success']) ?></div>
    <?php endif; ?>

    <?php if (isset($_GET['error'])): ?>
        <div class="alert-error"><?= htmlspecialchars($_GET['error']) ?></div>
    <?php endif; ?>

    <div class="upload-section">
        <form action="upload.php" method="POST" enctype="multipart/form-data">
            <div class="form-grid">
                <div class="form-group">
                    <label>Media Title / Machine Name</label>
                    <input type="text" name="title" required placeholder="e.g. Diesel Welding Generator">
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select name="category">
                        <option value="Power Equipment">Power Equipment</option>
                        <option value="Agricultural Equipment">Agricultural Equipment</option>
                        <option value="Industrial Equipment">Industrial Equipment</option>
                        <option value="Welding Machines">Welding Machines</option>
                        <option value="Farm Machinery & Equipment">Farm Machinery & Equipment</option>
                        <option value="Hand Tools">Hand Tools</option>
                        <option value="Compressors">Compressors</option>
                        <option value="Water Pumps">Water Pumps</option>
                        <option value="Generators">Generators</option>
                        <option value="Heavy Construction Machinery">Heavy Construction Machinery</option>
                        <option value="General">General</option>
                    </select>
                </div>
                <div class="form-group full">
                    <label>Select Image or Video File</label>
                    <input type="file" name="mediaFile" accept="image/*,video/*" required>
                </div>
            </div>
            <button type="submit" class="btn">Upload Media File</button>
        </form>
    </div>

    <h2>Uploaded Media Library</h2>
    <table>
        <thead>
            <tr>
                <th>Preview</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($mediaList)): ?>
                <tr>
                    <td colspan="6" style="text-align: center; color: #94a3b8; padding: 30px;">No media uploaded yet.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($mediaList as $item): ?>
                <tr>
                    <td>
                        <?php if ($item['file_type'] === 'image'): ?>
                            <img src="<?= htmlspecialchars($item['file_url']) ?>" class="preview-thumb" alt="">
                        <?php else: ?>
                            <video src="<?= htmlspecialchars($item['file_url']) ?>" class="preview-thumb"></video>
                        <?php endif; ?>
                    </td>
                    <td><strong><?= htmlspecialchars($item['title']) ?></strong></td>
                    <td><?= htmlspecialchars($item['category']) ?></td>
                    <td>
                        <span class="badge badge-<?= $item['file_type'] ?>">
                            <?= ucfirst($item['file_type']) ?>
                        </span>
                    </td>
                    <td><?= htmlspecialchars($item['created_at']) ?></td>
                    <td>
                        <a href="delete.php?id=<?= $item['id'] ?>" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this item?');">Delete</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>
</body>
</html>