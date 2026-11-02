<?php
require_once 'db.php';
/** @var PDO $pdo */
session_start();

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
        h1 { margin-top: 0; font-size: 24px; color: #0f172a; }
        p { color: #64748b; }
        
        .upload-section { background: #f1f5f9; padding: 20px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 30px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .form-group { margin-bottom: 15px; }
        .form-group.full { grid-column: span 2; }
        label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; }
        input[type="text"], select, input[type="file"] { width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid var(--border); border-radius: 6px; background: #fff; font-size: 14px; }
        
        .btn { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; transition: background 0.2s; }
        .btn:hover { background: var(--primary-dark); }
        .btn-danger { background: var(--danger); padding: 6px 12px; font-size: 12px; }
        .btn-danger:hover { background: var(--danger-dark); }

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
    <h1>MachineMan Admin Dashboard</h1>
    <p>Upload new machines, tools, or gallery files to display on your platform.</p>
    
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