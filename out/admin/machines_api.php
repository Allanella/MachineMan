<?php
require __DIR__ . '/auth.php';
require_admin_json();

$action = $_GET['action'] ?? $_POST['action'] ?? '';

if ($action === 'list') {
    $rows = $pdo->query('SELECT * FROM machines ORDER BY id DESC')->fetchAll();
    json_out(['ok' => true, 'items' => $rows]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['ok' => false, 'error' => 'Method not allowed.'], 405);
}
if (!csrf_ok($_POST['csrf'] ?? null)) {
    json_out(['ok' => false, 'error' => 'Security check failed. Reload the page.'], 419);
}

function slugify(string $s): string {
    $s = strtolower(trim(preg_replace('/[^A-Za-z0-9]+/', '-', $s), '-'));
    return $s !== '' ? $s : 'machine-' . time();
}

if ($action === 'delete') {
    $pdo->prepare('DELETE FROM machines WHERE id = ?')->execute([(int)($_POST['id'] ?? 0)]);
    json_out(['ok' => true]);
}

if ($action === 'toggle') {
    $pdo->prepare('UPDATE machines SET is_published = 1 - is_published WHERE id = ?')->execute([(int)($_POST['id'] ?? 0)]);
    json_out(['ok' => true]);
}

if ($action === 'save') {
    $id    = (int)($_POST['id'] ?? 0);
    $name  = trim((string)($_POST['name'] ?? ''));
    $cat   = trim((string)($_POST['category'] ?? ''));
    $desc  = trim((string)($_POST['description'] ?? ''));
    $long  = trim((string)($_POST['long_description'] ?? ''));
    $price = trim((string)($_POST['price'] ?? ''));
    $avail = in_array($_POST['availability'] ?? '', ['Available', 'Out of stock', 'On order'], true) ? $_POST['availability'] : 'Available';
    $pub   = !empty($_POST['is_published']) ? 1 : 0;
    $image = trim((string)($_POST['image_url'] ?? ''));

    if ($name === '' || mb_strlen($name) > 255) json_out(['ok' => false, 'error' => 'Please enter the machine name.'], 422);
    if (!in_array($cat, CATEGORIES, true))       json_out(['ok' => false, 'error' => 'Please choose a category.'], 422);
    if (mb_strlen($desc) > 500)                  json_out(['ok' => false, 'error' => 'Short description is limited to 500 characters.'], 422);

    // Specs come in as lines "Label: value"
    $specs = [];
    foreach (preg_split('/\r?\n/', (string)($_POST['specs'] ?? '')) as $line) {
        if (strpos($line, ':') === false) continue;
        [$k, $v] = array_map('trim', explode(':', $line, 2));
        if ($k !== '' && $v !== '') $specs[$k] = $v;
    }
    $specsJson = json_encode($specs, JSON_UNESCAPED_UNICODE);

    // Optional new picture
    $file = $_FILES['image'] ?? null;
    if ($file && $file['error'] !== UPLOAD_ERR_NO_FILE) {
        if ($file['error'] !== UPLOAD_ERR_OK || $file['size'] > MAX_BYTES) {
            json_out(['ok' => false, 'error' => 'The picture could not be uploaded (too big or failed).'], 413);
        }
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        if (!isset(ALLOWED_TYPES[$mime]) || ALLOWED_TYPES[$mime][1] !== 'image') {
            json_out(['ok' => false, 'error' => 'The picture must be a JPG, PNG, GIF or WebP image.'], 415);
        }
        if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
        $fname = time() . '_' . bin2hex(random_bytes(4)) . '.' . ALLOWED_TYPES[$mime][0];
        if (!move_uploaded_file($file['tmp_name'], UPLOAD_DIR . '/' . $fname)) {
            json_out(['ok' => false, 'error' => 'Could not save the picture.'], 500);
        }
        $image = UPLOAD_URL . $fname;
    }

    if ($id > 0) {
        $pdo->prepare('UPDATE machines SET name=?, category=?, description=?, long_description=?, price=?, availability=?, image_url=?, specs=?, is_published=? WHERE id=?')
            ->execute([$name, $cat, $desc, $long, $price, $avail, $image, $specsJson, $pub, $id]);
    } else {
        $slug = slugify($name);
        $chk  = $pdo->prepare('SELECT COUNT(*) FROM machines WHERE slug = ?');
        $base = $slug; $n = 2;
        while (true) { $chk->execute([$slug]); if (!(int)$chk->fetchColumn()) break; $slug = $base . '-' . $n++; }
        $pdo->prepare('INSERT INTO machines (slug,name,category,description,long_description,price,availability,image_url,specs,is_published) VALUES (?,?,?,?,?,?,?,?,?,?)')
            ->execute([$slug, $name, $cat, $desc, $long, $price, $avail, $image, $specsJson, $pub]);
        $id = (int)$pdo->lastInsertId();
    }
    $row = $pdo->prepare('SELECT * FROM machines WHERE id = ?');
    $row->execute([$id]);
    json_out(['ok' => true, 'item' => $row->fetch()]);
}

json_out(['ok' => false, 'error' => 'Unknown action.'], 400);