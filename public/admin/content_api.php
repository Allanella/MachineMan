<?php
require __DIR__ . '/auth.php';
require_admin_json();

// Report the real problem instead of an empty page
set_exception_handler(function (Throwable $e) {
    json_out(['ok' => false, 'error' => 'Server error: ' . $e->getMessage()
        . ' — if it mentions a missing table, run stage2.sql and stage3-projects.sql in phpMyAdmin.'], 500);
});
$defs = json_decode(<<<'JSON'
[
 {
  "key": "phone",
  "group": "Business details (used everywhere)",
  "label": "Phone number",
  "type": "text",
  "default": "+256 707 849 453"
 },
 {
  "key": "whatsapp",
  "group": "Business details (used everywhere)",
  "label": "WhatsApp link (https://wa.me/2567…)",
  "type": "text",
  "default": "https://wa.me/256707849453"
 },
 {
  "key": "email",
  "group": "Business details (used everywhere)",
  "label": "Email address",
  "type": "text",
  "default": "mugenyihussein2001@gmail.com"
 },
 {
  "key": "address",
  "group": "Business details (used everywhere)",
  "label": "Address",
  "type": "text",
  "default": "Kampala, Nabugabo Road, Uganda"
 },
 {
  "key": "hours_line1",
  "group": "Business details (used everywhere)",
  "label": "Opening hours – line 1",
  "type": "text",
  "default": "Monday – Saturday: 8:00 AM – 6:00 PM EAT"
 },
 {
  "key": "hours_line2",
  "group": "Business details (used everywhere)",
  "label": "Opening hours – line 2",
  "type": "text",
  "default": "Sunday: Closed"
 },
 {
  "key": "tiktok_url",
  "group": "Business details (used everywhere)",
  "label": "TikTok link",
  "type": "text",
  "default": "https://www.tiktok.com/@machineman488?is_from_webapp=1&sender_device=pc"
 },
 {
  "key": "tiktok_label",
  "group": "Business details (used everywhere)",
  "label": "TikTok button text",
  "type": "text",
  "default": "TikTok @machineman488"
 },
 {
  "key": "maps_embed_url",
  "group": "Business details (used everywhere)",
  "label": "Google Maps embed link",
  "type": "textarea",
  "default": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.758423819046!2d32.5725057749646!3d0.3139513996829661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbd7fe9a36717%3A0xcf6f68a319d5cb78!2sMachineman!5e0!3m2!1sen!2srw!4v1791355176506!5m2!1sen!2srw"
 },
 {
  "key": "hero_badge",
  "group": "Home page",
  "label": "Small badge above the heading",
  "type": "text",
  "default": "MACHINEMAN HARDWARE · KAMPALA, UGANDA"
 },
 {
  "key": "hero_line1",
  "group": "Home page",
  "label": "Heading – first line",
  "type": "text",
  "default": "QUALITY MACHINES."
 },
 {
  "key": "hero_line2",
  "group": "Home page",
  "label": "Heading – second line (gold)",
  "type": "text",
  "default": "BUILT FOR THE JOB."
 },
 {
  "key": "hero_text",
  "group": "Home page",
  "label": "Intro paragraph",
  "type": "textarea",
  "default": "Your reliable partner for industrial, power, and agricultural equipment in Kampala, Uganda. We connect contractors, farmers, and businesses with dependable machinery."
 },
 {
  "key": "home_about_title",
  "group": "Home page",
  "label": "About section – title",
  "type": "text",
  "default": "Your Machinery Partner in Kampala"
 },
 {
  "key": "home_about_text",
  "group": "Home page",
  "label": "About section – text",
  "type": "textarea",
  "default": "Machineman Hardware is situated on Nabugabo Road, Kampala. We specialize in supplying reliable power equipment, tillers, and industrial hardware."
 },
 {
  "key": "home_p1_title",
  "group": "Home page",
  "label": "About point 1 – title",
  "type": "text",
  "default": "Practical Equipment:"
 },
 {
  "key": "home_p1_text",
  "group": "Home page",
  "label": "About point 1 – text",
  "type": "text",
  "default": "Handpicked machinery tested for regional working conditions."
 },
 {
  "key": "home_p2_title",
  "group": "Home page",
  "label": "About point 2 – title",
  "type": "text",
  "default": "Direct Consultation:"
 },
 {
  "key": "home_p2_text",
  "group": "Home page",
  "label": "About point 2 – text",
  "type": "text",
  "default": "We help you choose the right capacity and engine type before buying."
 },
 {
  "key": "home_p3_title",
  "group": "Home page",
  "label": "About point 3 – title",
  "type": "text",
  "default": "Sourcing Assistance:"
 },
 {
  "key": "home_p3_text",
  "group": "Home page",
  "label": "About point 3 – text",
  "type": "text",
  "default": "Need specialized hardware? We leverage our network to source for you."
 },
 {
  "key": "about_title",
  "group": "About page",
  "label": "Heading",
  "type": "text",
  "default": "A practical partner for better work."
 },
 {
  "key": "about_intro",
  "group": "About page",
  "label": "Intro paragraph",
  "type": "textarea",
  "default": "Machineman Hardware is a Kampala-based machinery and hardware business located along Nabugabo Road. We deal in quality machines and equipment for businesses, contractors, professionals and individuals."
 },
 {
  "key": "about_b1_title",
  "group": "About page",
  "label": "Block 1 – title",
  "type": "text",
  "default": "Our Story"
 },
 {
  "key": "about_b1_text",
  "group": "About page",
  "label": "Block 1 – text",
  "type": "text",
  "default": "Built around a simple promise: help customers find quality machines for the job."
 },
 {
  "key": "about_b2_title",
  "group": "About page",
  "label": "Block 2 – title",
  "type": "text",
  "default": "Our Approach"
 },
 {
  "key": "about_b2_text",
  "group": "About page",
  "label": "Block 2 – text",
  "type": "text",
  "default": "Clear conversations, practical product guidance and direct contact."
 },
 {
  "key": "about_b3_title",
  "group": "About page",
  "label": "Block 3 – title",
  "type": "text",
  "default": "Quality & Reliability"
 },
 {
  "key": "about_b3_text",
  "group": "About page",
  "label": "Block 3 – text",
  "type": "text",
  "default": "We focus on equipment that is ready for real working environments."
 },
 {
  "key": "about_b4_title",
  "group": "About page",
  "label": "Block 4 – title",
  "type": "text",
  "default": "Why choose us"
 },
 {
  "key": "about_b4_text",
  "group": "About page",
  "label": "Block 4 – text",
  "type": "text",
  "default": "A convenient Kampala location and a customer-focused experience."
 },
 {
  "key": "about_image",
  "group": "About page",
  "label": "Picture (leave as is to keep the current one)",
  "type": "image",
  "default": ""
 },
 {
  "key": "machines_title",
  "group": "Machines page",
  "label": "Machines page – title",
  "type": "text",
  "default": "Our Machines"
 },
 {
  "key": "machines_intro",
  "group": "Machines page",
  "label": "Machines page – intro",
  "type": "textarea",
  "default": "Explore quality generators, tillers and industrial equipment available from Machine Man in Kampala. Can't see what you need? We'll source it for you."
 },
 {
  "key": "services_title",
  "group": "Services page",
  "label": "Services page – title",
  "type": "text",
  "default": "Services"
 },
 {
  "key": "services_intro",
  "group": "Services page",
  "label": "Services page – intro",
  "type": "text",
  "default": "Practical support from first inquiry through equipment selection and supply."
 },
 {
  "key": "projects_title",
  "group": "Projects page",
  "label": "Projects page – title",
  "type": "text",
  "default": "Projects & Deliveries"
 },
 {
  "key": "projects_intro",
  "group": "Projects page",
  "label": "Projects page – intro",
  "type": "textarea",
  "default": "A showcase for machines supplied to customers, installations and equipment deliveries."
 },
 {
  "key": "contact_title",
  "group": "Contact page",
  "label": "Contact page – title",
  "type": "text",
  "default": "Let's talk machines."
 },
 {
  "key": "contact_intro",
  "group": "Contact page",
  "label": "Contact page – intro",
  "type": "textarea",
  "default": "Visit our showroom along Nabugabo Road or reach out directly through WhatsApp, TikTok, or phone for quick responses."
 }
]
JSON
, true);

$action = $_GET['action'] ?? $_POST['action'] ?? '';
const AS_ARR = PDO::FETCH_ASSOC;

function slugify_c(string $s): string {
    $s = strtolower(trim(preg_replace('/[^A-Za-z0-9]+/', '-', $s), '-'));
    return $s !== '' ? $s : 'item-' . time();
}

/** Saves an uploaded picture and returns its URL, or null when no file was sent. */
function save_image(?array $file): ?string {
    if (!$file || $file['error'] === UPLOAD_ERR_NO_FILE) return null;
    if ($file['error'] !== UPLOAD_ERR_OK || $file['size'] > MAX_BYTES) {
        json_out(['ok' => false, 'error' => 'The picture could not be uploaded (too big or failed).'], 413);
    }
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    if (!isset(ALLOWED_TYPES[$mime]) || ALLOWED_TYPES[$mime][1] !== 'image') {
        json_out(['ok' => false, 'error' => 'Pictures must be JPG, PNG, GIF or WebP.'], 415);
    }
    if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
    $name = time() . '_' . bin2hex(random_bytes(4)) . '.' . ALLOWED_TYPES[$mime][0];
    if (!move_uploaded_file($file['tmp_name'], UPLOAD_DIR . '/' . $name)) {
        json_out(['ok' => false, 'error' => 'Could not save the picture.'], 500);
    }
    return UPLOAD_URL . $name;
}

function all_content(PDO $pdo, array $defs): array {
    $saved = [];
    foreach ($pdo->query('SELECT k, v FROM site_settings')->fetchAll(AS_ARR) as $r) $saved[$r['k']] = $r['v'];
    $values = [];
    foreach ($defs as $d) {
        $v = $saved[$d['key']] ?? '';
        $values[$d['key']] = ($v !== '' && $v !== null) ? $v : $d['default'];
    }
    $projects = [];
    try { $projects = $pdo->query('SELECT id, tag, title, body AS text, image_url FROM projects ORDER BY sort_order, id')->fetchAll(AS_ARR); } catch (Throwable $e) {}
    return [
        'ok'         => true,
        'projects'   => $projects,
        'defs'       => array_map(fn($d) => ['key' => $d['key'], 'group' => $d['group'], 'label' => $d['label'], 'type' => $d['type']], $defs),
        'values'     => $values,
        'services'   => $pdo->query('SELECT id, title, body AS text FROM services ORDER BY sort_order, id')->fetchAll(AS_ARR),
        'categories' => $pdo->query('SELECT id, slug, name, description, image_url, is_featured FROM categories ORDER BY sort_order, id')->fetchAll(AS_ARR),
    ];
}

if ($action === 'list') {
    json_out(all_content($pdo, $defs));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['ok' => false, 'error' => 'Method not allowed.'], 405);
if (!csrf_ok($_POST['csrf'] ?? null)) json_out(['ok' => false, 'error' => 'Security check failed. Reload the page.'], 419);

/** Moves a row up or down inside its table. */
function move_row(PDO $pdo, string $table, int $id, string $dir): void {
    if (!in_array($table, ['services', 'categories', 'projects'], true)) return;
    $ids = $pdo->query("SELECT id FROM $table ORDER BY sort_order, id")->fetchAll(PDO::FETCH_COLUMN);
    $i = array_search($id, array_map('intval', $ids), true);
    if ($i === false) return;
    $j = $dir === 'up' ? $i - 1 : $i + 1;
    if ($j < 0 || $j >= count($ids)) return;
    [$ids[$i], $ids[$j]] = [$ids[$j], $ids[$i]];
    $upd = $pdo->prepare("UPDATE $table SET sort_order = ? WHERE id = ?");
    foreach ($ids as $n => $rid) $upd->execute([$n + 1, $rid]);
}

switch ($action) {
    case 'save_settings':
        $post = $_POST['s'] ?? [];
        $up = $pdo->prepare('INSERT INTO site_settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)');
        foreach ($defs as $d) {
            $k = $d['key'];
            if ($d['type'] === 'image') {
                $url = save_image($_FILES['file_' . $k] ?? null);
                if ($url !== null) $up->execute([$k, $url]);
                continue;
            }
            if (isset($post[$k])) $up->execute([$k, mb_substr(trim((string)$post[$k]), 0, 5000)]);
        }
        json_out(all_content($pdo, $defs));

    case 'reset_setting':
        $k = (string)($_POST['key'] ?? '');
        $pdo->prepare('DELETE FROM site_settings WHERE k = ?')->execute([$k]);
        json_out(all_content($pdo, $defs));

    case 'service_save':
        $id = (int)($_POST['id'] ?? 0);
        $title = trim((string)($_POST['title'] ?? ''));
        $text = trim((string)($_POST['text'] ?? ''));
        if ($title === '' || mb_strlen($title) > 190) json_out(['ok' => false, 'error' => 'Please enter a service title.'], 422);
        if (mb_strlen($text) > 500) json_out(['ok' => false, 'error' => 'The description is limited to 500 characters.'], 422);
        if ($id > 0) {
            $pdo->prepare('UPDATE services SET title = ?, body = ? WHERE id = ?')->execute([$title, $text, $id]);
        } else {
            $n = (int)$pdo->query('SELECT COALESCE(MAX(sort_order),0) FROM services')->fetchColumn() + 1;
            $pdo->prepare('INSERT INTO services (title, body, sort_order) VALUES (?,?,?)')->execute([$title, $text, $n]);
        }
        json_out(all_content($pdo, $defs));

    case 'service_delete':
        $pdo->prepare('DELETE FROM services WHERE id = ?')->execute([(int)($_POST['id'] ?? 0)]);
        json_out(all_content($pdo, $defs));

    case 'service_move':
        move_row($pdo, 'services', (int)($_POST['id'] ?? 0), ($_POST['dir'] ?? '') === 'up' ? 'up' : 'down');
        json_out(all_content($pdo, $defs));

    case 'cat_save':
        $id = (int)($_POST['id'] ?? 0);
        $name = trim((string)($_POST['name'] ?? ''));
        $desc = trim((string)($_POST['description'] ?? ''));
        $feat = !empty($_POST['is_featured']) ? 1 : 0;
        if ($name === '' || mb_strlen($name) > 190) json_out(['ok' => false, 'error' => 'Please enter the category name.'], 422);
        if (mb_strlen($desc) > 500) json_out(['ok' => false, 'error' => 'The description is limited to 500 characters.'], 422);
        $img = trim((string)($_POST['image_url'] ?? ''));
        $new = save_image($_FILES['image'] ?? null);
        if ($new !== null) $img = $new;

        if ($id > 0) {
            $old = $pdo->prepare('SELECT name FROM categories WHERE id = ?');
            $old->execute([$id]);
            $oldName = $old->fetchColumn();
            $pdo->prepare('UPDATE categories SET name=?, description=?, image_url=?, is_featured=? WHERE id=?')
                ->execute([$name, $desc, $img, $feat, $id]);
            if ($oldName && $oldName !== $name) {
                // keep the machines in this category attached to it
                $pdo->prepare('UPDATE machines SET category = ? WHERE category = ?')->execute([$name, $oldName]);
            }
        } else {
            $slug = slugify_c($name); $base = $slug; $n = 2;
            $chk = $pdo->prepare('SELECT COUNT(*) FROM categories WHERE slug = ?');
            while (true) { $chk->execute([$slug]); if (!(int)$chk->fetchColumn()) break; $slug = $base . '-' . $n++; }
            $order = (int)$pdo->query('SELECT COALESCE(MAX(sort_order),0) FROM categories')->fetchColumn() + 1;
            $pdo->prepare('INSERT INTO categories (slug,name,description,image_url,is_featured,sort_order) VALUES (?,?,?,?,?,?)')
                ->execute([$slug, $name, $desc, $img, $feat, $order]);
        }
        json_out(all_content($pdo, $defs));

    case 'project_save':
        $id = (int)($_POST['id'] ?? 0);
        $title = trim((string)($_POST['title'] ?? ''));
        $tag = trim((string)($_POST['tag'] ?? ''));
        $text = trim((string)($_POST['text'] ?? ''));
        if ($title === '' || mb_strlen($title) > 190) json_out(['ok' => false, 'error' => 'Please enter a project title.'], 422);
        if (mb_strlen($tag) > 120) json_out(['ok' => false, 'error' => 'The label is limited to 120 characters.'], 422);
        if (mb_strlen($text) > 1000) json_out(['ok' => false, 'error' => 'The description is limited to 1000 characters.'], 422);
        $img = trim((string)($_POST['image_url'] ?? ''));
        $new = save_image($_FILES['image'] ?? null);
        if ($new !== null) $img = $new;
        if ($id > 0) {
            $pdo->prepare('UPDATE projects SET tag=?, title=?, body=?, image_url=? WHERE id=?')->execute([$tag, $title, $text, $img, $id]);
        } else {
            $n = (int)$pdo->query('SELECT COALESCE(MAX(sort_order),0) FROM projects')->fetchColumn() + 1;
            $pdo->prepare('INSERT INTO projects (tag,title,body,image_url,sort_order) VALUES (?,?,?,?,?)')->execute([$tag, $title, $text, $img, $n]);
        }
        json_out(all_content($pdo, $defs));

    case 'project_delete':
        $pdo->prepare('DELETE FROM projects WHERE id = ?')->execute([(int)($_POST['id'] ?? 0)]);
        json_out(all_content($pdo, $defs));

    case 'project_move':
        move_row($pdo, 'projects', (int)($_POST['id'] ?? 0), ($_POST['dir'] ?? '') === 'up' ? 'up' : 'down');
        json_out(all_content($pdo, $defs));

    case 'cat_delete':
        $pdo->prepare('DELETE FROM categories WHERE id = ?')->execute([(int)($_POST['id'] ?? 0)]);
        json_out(all_content($pdo, $defs));

    case 'cat_move':
        move_row($pdo, 'categories', (int)($_POST['id'] ?? 0), ($_POST['dir'] ?? '') === 'up' ? 'up' : 'down');
        json_out(all_content($pdo, $defs));
}

json_out(['ok' => false, 'error' => 'Unknown action.'], 400);
