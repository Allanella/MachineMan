<?php
require __DIR__ . '/auth.php';

// ---- JSON actions ----
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_admin_json();
    if (!csrf_ok($_POST['csrf'] ?? null)) json_out(['ok' => false, 'error' => 'Security check failed. Reload the page.'], 419);
    $id = (int)($_POST['id'] ?? 0);
    $a = $_POST['action'] ?? '';
    if ($a === 'read')   $pdo->prepare('UPDATE enquiries SET is_read = 1 WHERE id = ?')->execute([$id]);
    if ($a === 'unread') $pdo->prepare('UPDATE enquiries SET is_read = 0 WHERE id = ?')->execute([$id]);
    if ($a === 'delete') $pdo->prepare('DELETE FROM enquiries WHERE id = ?')->execute([$id]);
    json_out(['ok' => true]);
}
if (!is_admin()) { header('Location: /admin/'); exit; }
if (($_GET['action'] ?? '') === 'list') {
    json_out(['ok' => true, 'items' => $pdo->query('SELECT * FROM enquiries ORDER BY id DESC LIMIT 500')->fetchAll(PDO::FETCH_ASSOC)]);
}
$csrf = csrf_token();
?><!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Enquiries · MachineMan Admin</title>
<style>
:root{--ink:#111;--gold:#e6b84d;--line:#e5e3dc;--mut:#707274;--bg:#faf9f6}
*{box-sizing:border-box}body{margin:0;font:14px/1.5 system-ui,sans-serif;background:var(--bg);color:var(--ink)}
header{background:var(--ink);color:#fff;padding:12px 24px;display:flex;gap:6px 18px;align-items:center;flex-wrap:wrap}
header b{font-size:16px}header a{color:#ddd;text-decoration:none;font-weight:600}header a.on{color:var(--gold)}
main{max-width:900px;margin:0 auto;padding:24px}
button{font:inherit;font-weight:700;border:0;padding:8px 14px;cursor:pointer;background:var(--ink);color:#fff}
button:hover{background:var(--gold);color:var(--ink)}button.ghost{background:#fff;color:var(--ink);border:1px solid var(--line)}button.red{background:#b42318}
.q{background:#fff;border:1px solid var(--line);margin-bottom:12px;padding:16px 18px}
.q.new{border-left:4px solid var(--gold)}.q h3{margin:0 0 2px;font-size:15px}
.meta{color:var(--mut);font-size:12px;margin-bottom:8px}.msg{white-space:pre-wrap;margin:8px 0 12px}
.tag{font-size:11px;font-weight:700;padding:2px 8px;background:#fdf6e3;color:#8a610f;margin-left:6px}
.q a{color:var(--ink)}.acts{display:flex;gap:8px;flex-wrap:wrap}
</style></head><body>
<header><b>MachineMan Admin</b><a href="/admin/">Dashboard</a><a href="content.php#home">Home</a><a href="/admin/machines.php">Machines</a><a href="content.php#categories">Categories</a><a href="content.php#services">Services</a><a href="content.php#projects">Projects</a><a href="/admin/#media">Gallery</a><a href="content.php#about">About</a><a href="content.php#contact">Contact</a><a class="on" href="/admin/enquiries.php">Enquiries</a><a href="/" target="_blank">View site ↗</a></header>
<main><h1 style="margin:0 0 4px">Enquiries</h1><p style="color:var(--mut);margin:0 0 18px">Messages sent from the Contact and Quote forms on your website.</p><div id="list"></div></main>
<script>
const CSRF=<?= json_encode($csrf) ?>;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let items=[];
async function act(action,id){const fd=new FormData();fd.set('action',action);fd.set('id',id);fd.set('csrf',CSRF);
  await fetch('enquiries.php',{method:'POST',body:fd,credentials:'same-origin'});load()}
function render(){
  document.getElementById('list').innerHTML=items.length?items.map(q=>`<div class="q ${+q.is_read?'':'new'}">
   <h3>${esc(q.name)} ${q.type==='quote'?'<span class="tag">Quote request</span>':''} ${+q.is_read?'':'<span class="tag">New</span>'}</h3>
   <div class="meta">${esc(q.created_at)} · ${q.phone?`<a href="tel:${esc(q.phone)}">${esc(q.phone)}</a>`:''} ${q.email?` · <a href="mailto:${esc(q.email)}">${esc(q.email)}</a>`:''}</div>
   ${q.subject?`<div><b>${esc(q.subject)}</b>${q.quantity?' · Qty '+esc(q.quantity):''}</div>`:''}
   <div class="msg">${esc(q.message)}</div>
   <div class="acts">${q.phone?`<a href="https://wa.me/${esc(q.phone.replace(/[^0-9]/g,''))}" target="_blank"><button class="ghost" type="button">WhatsApp</button></a>`:''}
   <button class="ghost" onclick="act('${+q.is_read?'unread':'read'}',${q.id})">${+q.is_read?'Mark as new':'Mark as read'}</button>
   <button class="red" onclick="if(confirm('Delete this enquiry?'))act('delete',${q.id})">Delete</button></div></div>`).join(''):'<p style="color:var(--mut)">No enquiries yet.</p>';
}
async function load(){const r=await fetch('enquiries.php?action=list',{credentials:'same-origin'});const j=await r.json().catch(()=>null);
  if(!j||!j.ok){document.getElementById('list').innerHTML='<p>Could not load. Have you run stage2.sql in phpMyAdmin?</p>';return}items=j.items;render()}
load();
</script></body></html>
