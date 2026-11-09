<?php
require __DIR__ . '/auth.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');

// ---- Log out ----
if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: ./');
    exit;
}

// ---- Log in ----
$loginError = '';
$passwordSet = !empty($adminPassword);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    if (!empty($_SESSION['lock_until']) && $_SESSION['lock_until'] > time()) {
        $loginError = 'Too many attempts. Please wait a few minutes and try again.';
    } elseif ($passwordSet && password_ok((string)$_POST['password'])) {
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        $_SESSION['fails'] = 0;
        header('Location: ./');
        exit;
    } else {
        $_SESSION['fails'] = ($_SESSION['fails'] ?? 0) + 1;
        if ($_SESSION['fails'] >= 5) {
            $_SESSION['lock_until'] = time() + 300;
            $_SESSION['fails'] = 0;
        }
        sleep(1);
        $loginError = $passwordSet ? 'Wrong password. Please try again.' : 'The admin password has not been set yet.';
    }
}

// ---- JSON list for live refresh ----
if (is_admin() && ($_GET['action'] ?? '') === 'list') {
    json_out(['ok' => true, 'items' => fetch_items()]);
}

$loggedIn = is_admin();

if ($loggedIn) {
    $boot = [
        'csrf'     => csrf_token(),
        'items'    => fetch_items(),
        'maxBytes' => MAX_BYTES,
        'phpLimit' => ini_get('upload_max_filesize'),
        'postLimit'=> ini_get('post_max_size'),
    ];
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= $loggedIn ? 'Media Manager' : 'Admin Login' ?> · Machine Man</title>
<style>
  :root{
    --ink:#111; --gold:#e6b84d; --gold-d:#b27f19; --bg:#f4f3ef; --card:#fff;
    --line:rgba(0,0,0,.09); --muted:#6f7273; --ok:#1f8f4e; --bad:#c0392b; --r:12px;
  }
  *{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%}
  body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--ink);line-height:1.5}
  a{color:inherit}
  button{font:inherit;cursor:pointer}
  .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}

  /* ---------- Top bar ---------- */
  .top{background:var(--ink);color:#fff;position:sticky;top:0;z-index:20}
  .top-in{max-width:1240px;margin:0 auto;padding:0 20px;height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px}
  .brand{display:flex;align-items:center;gap:12px;text-decoration:none}
  .mark{width:36px;height:36px;background:var(--gold);color:var(--ink);display:grid;place-items:center;font-weight:900;border-radius:8px;letter-spacing:-.04em}
  .brand b{font-size:15px;letter-spacing:.02em}
  .brand small{display:block;font-size:11px;color:rgba(255,255,255,.55);margin-top:-2px;letter-spacing:.14em;text-transform:uppercase}
  .top-actions{display:flex;gap:10px;align-items:center}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:40px;padding:0 16px;border-radius:8px;border:1px solid transparent;font-weight:700;font-size:13px;text-decoration:none;transition:.2s}
  .btn-ghost{background:rgba(255,255,255,.08);color:#fff;border-color:rgba(255,255,255,.16)}
  .btn-ghost:hover{background:#fff;color:var(--ink)}
  .btn-gold{background:var(--gold);color:var(--ink);box-shadow:0 10px 24px -12px rgba(230,184,77,.9)}
  .btn-gold:hover{background:var(--ink);color:#fff}
  .btn-gold[disabled]{opacity:.6;pointer-events:none}
  .btn-danger{background:#fff;color:var(--bad);border-color:rgba(192,57,43,.35)}
  .btn-danger:hover{background:var(--bad);color:#fff}
  .btn-line{background:#fff;border-color:var(--line);color:var(--ink)}
  .btn-line:hover{border-color:var(--ink)}
  .btn svg{width:16px;height:16px}

  /* ---------- Layout ---------- */
  .wrap{max-width:1240px;margin:0 auto;padding:28px 20px 70px}
  .hero{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:22px}
  .eyebrow{display:flex;align-items:center;gap:10px;font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-d)}
  .eyebrow:before{content:"";width:28px;height:3px;background:var(--gold)}
  h1{margin:8px 0 4px;font-size:clamp(28px,4vw,40px);letter-spacing:-.04em;line-height:1.05}
  .sub{margin:0;color:var(--muted);font-size:14px;max-width:560px}

  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
  .stat{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:16px 18px;display:flex;gap:14px;align-items:center}
  .stat i{width:42px;height:42px;border-radius:10px;background:#fdf6e3;color:var(--gold-d);display:grid;place-items:center;flex:none}
  .stat i svg{width:20px;height:20px}
  .stat b{display:block;font-size:26px;letter-spacing:-.03em;line-height:1}
  .stat span{font-size:12px;color:var(--muted)}

  .grid{display:grid;grid-template-columns:380px 1fr;gap:22px;align-items:start}
  .card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);box-shadow:0 12px 30px -22px rgba(0,0,0,.35)}
  .card-h{padding:18px 20px 0}
  .card-h h2{margin:0;font-size:17px;letter-spacing:-.02em}
  .card-h p{margin:4px 0 0;color:var(--muted);font-size:13px}
  .card-b{padding:18px 20px 20px}
  .sticky{position:sticky;top:84px}

  /* ---------- Form ---------- */
  label.f{display:block;margin-bottom:14px}
  label.f>span{display:block;font-size:12px;font-weight:700;margin-bottom:6px;color:#3d3f41}
  .in{width:100%;height:44px;border:1px solid var(--line);border-radius:8px;background:#fafaf8;padding:0 12px;font:inherit;font-size:14px;color:var(--ink);transition:.2s}
  .in:focus{outline:none;border-color:var(--gold-d);background:#fff;box-shadow:0 0 0 3px rgba(230,184,77,.3)}
  select.in{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m1 1 5 5 5-5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px}

  .drop{position:relative;border:2px dashed rgba(0,0,0,.18);border-radius:10px;background:#fafaf8;padding:22px 14px;text-align:center;transition:.2s;cursor:pointer;margin-bottom:14px}
  .drop:hover,.drop.over{border-color:var(--gold-d);background:#fdf8ea}
  .drop svg{width:34px;height:34px;color:var(--gold-d)}
  .drop b{display:block;margin-top:6px;font-size:14px}
  .drop small{color:var(--muted);font-size:12px}
  .drop input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
  .preview{display:none;margin-bottom:14px;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#000}
  .preview.on{display:block}
  .preview img,.preview video{display:block;width:100%;max-height:220px;object-fit:contain;background:#111}
  .preview .meta{display:flex;justify-content:space-between;gap:10px;background:#fff;padding:9px 12px;font-size:12px;color:var(--muted)}
  .preview .meta b{color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .bar{display:none;height:8px;border-radius:99px;background:#eee;overflow:hidden;margin-bottom:14px}
  .bar.on{display:block}
  .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--gold-d),var(--gold));transition:width .15s}
  .hint{margin:10px 0 0;font-size:12px;color:var(--muted)}

  /* ---------- Library ---------- */
  .tools{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:16px 20px;border-bottom:1px solid var(--line)}
  .search{flex:1;min-width:180px;position:relative}
  .search svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:#999}
  .search .in{padding-left:36px;height:40px}
  .chips{display:flex;gap:6px}
  .chip{height:40px;padding:0 14px;border:1px solid var(--line);background:#fff;border-radius:8px;font-weight:700;font-size:13px;color:#3d3f41;transition:.2s}
  .chip:hover{border-color:var(--ink)}
  .chip.on{background:var(--ink);border-color:var(--ink);color:#fff}
  .tools select.in{width:auto;min-width:170px;height:40px}

  .items{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px;padding:20px}
  .item{border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff;display:flex;flex-direction:column;transition:.25s}
  .item:hover{transform:translateY(-3px);box-shadow:0 18px 30px -20px rgba(0,0,0,.45);border-color:rgba(0,0,0,.2)}
  .thumb{position:relative;aspect-ratio:4/3;background:#eceae4;overflow:hidden}
  .thumb img,.thumb video{width:100%;height:100%;object-fit:cover;display:block}
  .badge{position:absolute;left:10px;top:10px;background:rgba(17,17,17,.82);color:#fff;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:4px 8px;border-radius:6px;display:flex;align-items:center;gap:5px}
  .badge.video{background:var(--gold);color:var(--ink)}
  .badge svg{width:10px;height:10px}
  .item-b{padding:12px 14px 14px;display:flex;flex-direction:column;gap:6px;flex:1}
  .item-b h3{margin:0;font-size:14px;line-height:1.3;letter-spacing:-.01em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .pill{align-self:flex-start;font-size:11px;font-weight:700;color:var(--gold-d);background:#fdf6e3;border-radius:99px;padding:3px 10px}
  .date{font-size:11px;color:var(--muted)}
  .item-f{margin-top:auto;padding-top:8px;display:flex;gap:8px}
  .item-f .btn{height:34px;font-size:12px;padding:0 12px;flex:1}
  .empty{padding:60px 20px;text-align:center;color:var(--muted)}
  .empty svg{width:48px;height:48px;color:#c9c6bb}
  .empty b{display:block;margin-top:8px;color:var(--ink);font-size:16px}

  /* ---------- Toasts + modal ---------- */
  .toasts{position:fixed;right:16px;bottom:16px;display:flex;flex-direction:column;gap:10px;z-index:60}
  .toast{background:var(--ink);color:#fff;border-left:4px solid var(--gold);padding:12px 16px;border-radius:8px;font-size:14px;box-shadow:0 18px 40px -16px rgba(0,0,0,.6);animation:in .25s ease;max-width:340px}
  .toast.ok{border-color:#35c27a}
  .toast.err{border-color:#ff6b5b}
  @keyframes in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  dialog{border:0;border-radius:14px;padding:0;max-width:400px;width:calc(100% - 32px);box-shadow:0 40px 80px -30px rgba(0,0,0,.6)}
  dialog::backdrop{background:rgba(0,0,0,.55);backdrop-filter:blur(2px)}
  .dlg{padding:24px}
  .dlg h3{margin:0 0 6px;font-size:18px}
  .dlg p{margin:0 0 18px;color:var(--muted);font-size:14px}
  .dlg .row{display:flex;gap:10px;justify-content:flex-end}

  /* ---------- Login ---------- */
  .login{min-height:100vh;display:grid;place-items:center;padding:20px;background:
    radial-gradient(900px 400px at 85% -10%,rgba(230,184,77,.22),transparent 60%),
    linear-gradient(160deg,#111 0%,#1b1b1b 60%,#111 100%)}
  .login-card{width:100%;max-width:400px;background:#fff;border-radius:16px;padding:32px 28px;box-shadow:0 50px 90px -40px rgba(0,0,0,.8)}
  .login-card .mark{margin-bottom:16px;width:46px;height:46px;font-size:18px;border-radius:10px}
  .login-card h1{font-size:26px;margin:0 0 4px}
  .login-card p{margin:0 0 20px;color:var(--muted);font-size:14px}
  .alert{background:#fdeceb;color:#8f2418;border:1px solid #f3c1bc;border-radius:8px;padding:10px 12px;font-size:13px;margin-bottom:14px}
  .note{background:#fff8e1;color:#6b4e00;border:1px solid #f3dd9a;border-radius:8px;padding:10px 12px;font-size:13px;margin-bottom:14px}
  .note code{background:rgba(0,0,0,.07);padding:1px 5px;border-radius:4px;font-size:12px}
  .back{display:block;text-align:center;margin-top:16px;font-size:13px;color:var(--muted);text-decoration:none}
  .back:hover{color:var(--ink)}

  @media (max-width:1020px){
    .grid{grid-template-columns:1fr}
    .sticky{position:static}
    .stats{grid-template-columns:repeat(2,1fr)}
  }
  @media (max-width:560px){
    .top-in{padding:0 14px}
    .btn-ghost .lbl{display:none}
    .wrap{padding:20px 14px 60px}
    .items{grid-template-columns:repeat(2,1fr);gap:12px;padding:14px}
    .tools{padding:14px}
    .chips{width:100%}
    .chip{flex:1}
    .tools select.in{width:100%}
    .stat{padding:12px}
    .stat b{font-size:22px}
  }
</style>
</head>
<body>

<?php if (!$loggedIn): ?>
<!-- ======================= LOGIN ======================= -->
<main class="login">
  <form class="login-card" method="post" autocomplete="off">
    <div class="mark">MM</div>
    <h1>Admin login</h1>
    <p>Sign in to manage the photos and videos shown on your website.</p>

    <?php if (!$passwordSet): ?>
      <div class="note">The admin password isn't set yet. Add this line to <code>admin/db.php</code> on the server (after the <code>$pass</code> line):<br><code>$adminPassword = 'choose-a-strong-password';</code></div>
    <?php endif; ?>
    <?php if ($loginError): ?><div class="alert"><?= htmlspecialchars($loginError, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>

    <label class="f"><span>Password</span>
      <input class="in" type="password" name="password" required autofocus autocomplete="current-password">
    </label>
    <button class="btn btn-gold" style="width:100%" type="submit">Log in</button>
    <a class="back" href="/">← Back to website</a>
  </form>
</main>

<?php else: ?>
<!-- ======================= DASHBOARD ======================= -->
<header class="top">
  <div class="top-in">
    <a class="brand" href="./">
      <span class="mark">MM</span>
      <span><b>Machine Man</b><small>Admin</small></span>
    </a>
    <div class="top-actions">
      <a class="btn btn-ghost" href="/gallery/" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="m15 3 6 0 0 6"/><path d="M10 14 21 3"/></svg>
        <span class="lbl">View gallery</span>
      </a>
      <a class="btn btn-ghost" href="?logout=1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>
        <span class="lbl">Log out</span>
      </a>
    </div>
  </div>
</header>

<div class="wrap">
  <div class="hero">
    <div>
      <div class="eyebrow">Admin dashboard</div>
      <h1>Media manager</h1>
      <p class="sub">Upload new machines, tools and gallery files. Everything you add appears on the website gallery right away.</p>
    </div>
  </div>

  <div class="stats">
    <div class="stat"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></i><div><b id="s-total">0</b><span>Total items</span></div></div>
    <div class="stat"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg></i><div><b id="s-img">0</b><span>Photos</span></div></div>
    <div class="stat"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg></i><div><b id="s-vid">0</b><span>Videos</span></div></div>
    <div class="stat"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z"/><circle cx="7" cy="7" r="1.2"/></svg></i><div><b id="s-cat">0</b><span>Categories used</span></div></div>
  </div>

  <div class="grid">
    <!-- Upload -->
    <section class="card sticky">
      <div class="card-h"><h2>Upload new media</h2><p>Add a photo or video with a title and category.</p></div>
      <form class="card-b" id="up" novalidate>
        <label class="f"><span>Title / machine name</span>
          <input class="in" type="text" name="title" id="title" maxlength="255" placeholder="e.g. Diesel Welding Generator" required>
        </label>
        <label class="f"><span>Category</span>
          <select class="in" name="category" id="category" required>
            <?php foreach (CATEGORIES as $c): ?>
              <option value="<?= htmlspecialchars($c, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($c, ENT_QUOTES, 'UTF-8') ?></option>
            <?php endforeach; ?>
          </select>
        </label>

        <div class="drop" id="drop">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></svg>
          <b>Drop a file here or click to browse</b>
          <small>JPG, PNG, GIF, WebP · MP4, MOV, WebM</small>
          <input type="file" name="media" id="file" accept="image/*,video/mp4,video/quicktime,video/webm">
        </div>

        <div class="preview" id="preview"></div>
        <div class="bar" id="bar"><i id="barfill"></i></div>

        <button class="btn btn-gold" style="width:100%" type="submit" id="send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></svg>
          <span id="sendlbl">Upload media</span>
        </button>
        <p class="hint">Server limit per file: <b id="lim"></b>.</p>
      </form>
    </section>

    <!-- Library -->
    <section class="card">
      <div class="card-h" style="padding-bottom:16px"><h2>Uploaded media library</h2><p>Everything currently on your website gallery.</p></div>
      <div class="tools">
        <div class="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input class="in" type="search" id="q" placeholder="Search by title" aria-label="Search by title">
        </div>
        <div class="chips" role="tablist" aria-label="Filter by type">
          <button type="button" class="chip on" data-t="all">All</button>
          <button type="button" class="chip" data-t="image">Photos</button>
          <button type="button" class="chip" data-t="video">Videos</button>
        </div>
        <select class="in" id="catf" aria-label="Filter by category"><option value="">All categories</option></select>
      </div>
      <div class="items" id="items"></div>
    </section>
  </div>
</div>

<dialog id="dlg">
  <div class="dlg">
    <h3>Delete this item?</h3>
    <p id="dlgtxt">This removes it from your website gallery and deletes the file. It can't be undone.</p>
    <div class="row">
      <button class="btn btn-line" id="dno" type="button">Cancel</button>
      <button class="btn btn-danger" id="dyes" type="button">Delete</button>
    </div>
  </div>
</dialog>

<div class="toasts" id="toasts" aria-live="polite"></div>

<script>
window.__BOOT__ = <?= json_encode($boot, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
</script>
<script>
(function () {
  var boot = window.__BOOT__;
  var state = { items: boot.items || [], type: 'all', cat: '', q: '' };
  var $ = function (s) { return document.querySelector(s); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmtDate(s) {
    var d = new Date(String(s).replace(' ', 'T'));
    return isNaN(d) ? esc(s) : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function fmtSize(b) {
    return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  }
  function toast(msg, kind) {
    var t = document.createElement('div');
    t.className = 'toast ' + (kind || '');
    t.textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 3800);
    setTimeout(function () { t.remove(); }, 4200);
  }

  $('#lim').textContent = boot.phpLimit + ' (upload) / ' + boot.postLimit + ' (total)';

  /* ---------- Render ---------- */
  function render() {
    var all = state.items;
    $('#s-total').textContent = all.length;
    $('#s-img').textContent = all.filter(function (i) { return i.file_type === 'image'; }).length;
    $('#s-vid').textContent = all.filter(function (i) { return i.file_type === 'video'; }).length;

    var cats = Array.from(new Set(all.map(function (i) { return i.category; }))).sort();
    $('#s-cat').textContent = cats.length;
    var sel = $('#catf'), cur = state.cat;
    sel.innerHTML = '<option value="">All categories</option>' + cats.map(function (c) {
      return '<option value="' + esc(c) + '"' + (c === cur ? ' selected' : '') + '>' + esc(c) + '</option>';
    }).join('');

    var q = state.q.trim().toLowerCase();
    var list = all.filter(function (i) {
      return (state.type === 'all' || i.file_type === state.type) &&
             (!state.cat || i.category === state.cat) &&
             (!q || String(i.title).toLowerCase().indexOf(q) !== -1);
    });

    var box = $('#items');
    if (!list.length) {
      box.style.display = 'block';
      box.innerHTML = '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg><b>' +
        (all.length ? 'Nothing matches your filters' : 'No media yet') + '</b>' +
        (all.length ? 'Try a different search or filter.' : 'Upload your first photo or video on the left.') + '</div>';
      return;
    }
    box.style.display = '';
    box.innerHTML = list.map(function (i) {
      var isVid = i.file_type === 'video';
      var media = isVid
        ? '<video src="' + esc(i.file_url) + '" muted playsinline preload="metadata"></video>'
        : '<img src="' + esc(i.file_url) + '" alt="' + esc(i.title) + '" loading="lazy">';
      var badge = isVid
        ? '<span class="badge video"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg>Video</span>'
        : '<span class="badge">Photo</span>';
      return '<article class="item">' +
        '<div class="thumb">' + media + badge + '</div>' +
        '<div class="item-b"><h3>' + esc(i.title) + '</h3>' +
        '<span class="pill">' + esc(i.category) + '</span>' +
        '<span class="date">' + fmtDate(i.created_at) + '</span>' +
        '<div class="item-f">' +
          '<a class="btn btn-line" href="' + esc(i.file_url) + '" target="_blank" rel="noopener">Open</a>' +
          '<button class="btn btn-danger" data-del="' + esc(i.id) + '" data-title="' + esc(i.title) + '" type="button">Delete</button>' +
        '</div></div></article>';
    }).join('');
  }

  function refresh() {
    return fetch('?action=list', { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d.ok) { state.items = d.items; render(); } });
  }

  /* ---------- Filters ---------- */
  $('#q').addEventListener('input', function (e) { state.q = e.target.value; render(); });
  $('#catf').addEventListener('change', function (e) { state.cat = e.target.value; render(); });
  document.querySelectorAll('.chip').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      state.type = b.getAttribute('data-t');
      render();
    });
  });

  /* ---------- File picking + preview ---------- */
  var fileEl = $('#file'), drop = $('#drop'), prev = $('#preview'), objUrl = null;

  function showPreview() {
    var f = fileEl.files[0];
    if (objUrl) { URL.revokeObjectURL(objUrl); objUrl = null; }
    if (!f) { prev.className = 'preview'; prev.innerHTML = ''; return; }
    objUrl = URL.createObjectURL(f);
    var el = f.type.indexOf('video') === 0
      ? '<video src="' + objUrl + '" controls muted playsinline></video>'
      : '<img src="' + objUrl + '" alt="Preview">';
    prev.innerHTML = el + '<div class="meta"><b>' + esc(f.name) + '</b><span>' + fmtSize(f.size) + '</span></div>';
    prev.className = 'preview on';
    var t = $('#title');
    if (!t.value) { t.value = f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim(); }
  }
  fileEl.addEventListener('change', showPreview);
  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); });
  });
  drop.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files.length) {
      fileEl.files = e.dataTransfer.files;
      showPreview();
    }
  });

  /* ---------- Upload ---------- */
  var form = $('#up'), bar = $('#bar'), fill = $('#barfill'), send = $('#send'), lbl = $('#sendlbl');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = fileEl.files[0];
    if (!$('#title').value.trim()) { toast('Please enter a title.', 'err'); $('#title').focus(); return; }
    if (!f) { toast('Please choose an image or video first.', 'err'); return; }
    if (f.size > boot.maxBytes) { toast('That file is too big (max ' + fmtSize(boot.maxBytes) + ').', 'err'); return; }

    var fd = new FormData(form);
    fd.append('csrf', boot.csrf);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload.php');
    xhr.upload.onprogress = function (ev) {
      if (ev.lengthComputable) {
        var p = Math.round(ev.loaded / ev.total * 100);
        fill.style.width = p + '%';
        lbl.textContent = 'Uploading ' + p + '%';
      }
    };
    xhr.onload = function () {
      var r = null;
      try { r = JSON.parse(xhr.responseText); } catch (x) {}
      bar.classList.remove('on'); send.removeAttribute('disabled'); lbl.textContent = 'Upload media';
      if (r && r.ok) {
        toast('Uploaded successfully.', 'ok');
        form.reset(); fileEl.value = ''; showPreview();
        refresh();
      } else {
        toast((r && r.error) || 'Upload failed. Please try again.', 'err');
        if (xhr.status === 401) { setTimeout(function () { location.reload(); }, 1500); }
      }
    };
    xhr.onerror = function () {
      bar.classList.remove('on'); send.removeAttribute('disabled'); lbl.textContent = 'Upload media';
      toast('Network error. Please check your connection.', 'err');
    };
    fill.style.width = '0'; bar.classList.add('on');
    send.setAttribute('disabled', 'disabled'); lbl.textContent = 'Uploading 0%';
    xhr.send(fd);
  });

  /* ---------- Delete ---------- */
  var dlg = $('#dlg'), pendingId = null;
  $('#items').addEventListener('click', function (e) {
    var b = e.target.closest('[data-del]');
    if (!b) { return; }
    pendingId = b.getAttribute('data-del');
    $('#dlgtxt').textContent = '"' + b.getAttribute('data-title') + '" will be removed from your website gallery and its file deleted. This can\'t be undone.';
    if (dlg.showModal) { dlg.showModal(); } else if (confirm('Delete this item?')) { doDelete(); }
  });
  $('#dno').addEventListener('click', function () { dlg.close(); pendingId = null; });
  $('#dyes').addEventListener('click', function () { dlg.close(); doDelete(); });

  function doDelete() {
    if (!pendingId) { return; }
    var fd = new FormData();
    fd.append('id', pendingId);
    fd.append('csrf', boot.csrf);
    pendingId = null;
    fetch('delete.php', { method: 'POST', body: fd, credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (r.ok) { toast('Deleted.', 'ok'); refresh(); }
        else { toast(r.error || 'Could not delete.', 'err'); }
      })
      .catch(function () { toast('Network error. Please try again.', 'err'); });
  }

  render();
})();
</script>
<?php endif; ?>
</body>
</html>