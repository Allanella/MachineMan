<?php
require __DIR__ . '/auth.php';
if (!is_admin()) { header('Location: /admin/'); exit; }
$csrf = csrf_token();
?><!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Machines · MachineMan Admin</title>
<style>
:root{--ink:#111;--gold:#e6b84d;--line:#e5e3dc;--mut:#707274;--bg:#faf9f6}
*{box-sizing:border-box}body{margin:0;font:14px/1.5 system-ui,sans-serif;background:var(--bg);color:var(--ink)}
header{background:var(--ink);color:#fff;padding:14px 24px;display:flex;gap:20px;align-items:center;flex-wrap:wrap}
header b{font-size:16px}header a{color:#ddd;text-decoration:none;font-weight:600}header a.on{color:var(--gold)}
main{max-width:1100px;margin:0 auto;padding:24px}
.bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}
input,select,textarea{font:inherit;padding:9px 11px;border:1px solid var(--line);background:#fff;width:100%}
.bar input{max-width:320px}.bar select{max-width:220px}
button{font:inherit;font-weight:700;border:0;padding:9px 16px;cursor:pointer;background:var(--ink);color:#fff}
button:hover{background:var(--gold);color:var(--ink)}button.ghost{background:#fff;color:var(--ink);border:1px solid var(--line)}
button.red{background:#b42318}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line)}
th,td{padding:10px 12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:middle}
th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--mut)}
td img{width:56px;height:44px;object-fit:cover;background:#eee;display:block}
.tag{font-size:11px;font-weight:700;padding:2px 8px;background:#e8f5e9;color:#1b5e20}.tag.off{background:#eee;color:#666}
dialog{border:0;padding:0;width:min(680px,94vw);max-height:92vh}dialog::backdrop{background:#0008}
form.f{padding:22px;display:grid;gap:12px;grid-template-columns:1fr 1fr}.f .w{grid-column:1/-1}
label{font-size:12px;font-weight:700;display:block;margin-bottom:4px}
.acts{display:flex;gap:8px;justify-content:flex-end}.err{color:#b42318;font-weight:600;min-height:20px}
#toast{position:fixed;bottom:20px;right:20px;background:var(--ink);color:#fff;padding:12px 18px;display:none}
@media(max-width:640px){form.f{grid-template-columns:1fr}.hide-m{display:none}}
</style></head><body>
<header><b>MachineMan Admin</b><a href="/admin/">Gallery uploads</a><a class="on" href="/admin/machines.php">Machines</a><a href="/" target="_blank">View site ↗</a></header>
<main>
 <div class="bar">
  <input id="q" placeholder="Search machines…"><select id="fc"><option value="">All categories</option><?php foreach (CATEGORIES as $c) echo '<option>'.htmlspecialchars($c).'</option>'; ?></select>
  <button id="add" style="margin-left:auto">+ Add machine</button>
 </div>
 <table><thead><tr><th></th><th>Name</th><th class="hide-m">Category</th><th class="hide-m">Price</th><th>Status</th><th></th></tr></thead><tbody id="rows"></tbody></table>
 <p id="empty" style="display:none;color:var(--mut)">No machines found.</p>
</main>

<dialog id="dlg"><form class="f" id="form">
 <input type="hidden" name="csrf" value="<?= htmlspecialchars($csrf) ?>"><input type="hidden" name="action" value="save">
 <input type="hidden" name="id" id="id"><input type="hidden" name="image_url" id="image_url">
 <div class="w"><label>Name *</label><input name="name" id="name" required maxlength="255"></div>
 <div><label>Category *</label><select name="category" id="category"><?php foreach (CATEGORIES as $c) echo '<option>'.htmlspecialchars($c).'</option>'; ?></select></div>
 <div><label>Price (e.g. UGX 4,500,000)</label><input name="price" id="price" maxlength="100"></div>
 <div><label>Availability</label><select name="availability" id="availability"><option>Available</option><option>Out of stock</option><option>On order</option></select></div>
 <div><label>Picture</label><input type="file" name="image" accept="image/*"></div>
 <div class="w"><img id="prev" alt="" style="max-height:110px;display:none"></div>
 <div class="w"><label>Short description (max 500)</label><textarea name="description" id="description" rows="2" maxlength="500"></textarea></div>
 <div class="w"><label>Full description</label><textarea name="long_description" id="long_description" rows="4"></textarea></div>
 <div class="w"><label>Specs — one per line as “Label: value”</label><textarea name="specs" id="specs" rows="4" placeholder="Brand: Perkins&#10;Output: 25kVA"></textarea></div>
 <div class="w"><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="is_published" id="is_published" value="1" style="width:auto"> Show on the website</label></div>
 <div class="w err" id="err"></div>
 <div class="w acts"><button type="button" class="ghost" id="cancel">Cancel</button><button id="save">Save machine</button></div>
</form></dialog>
<div id="toast"></div>

<script>
const CSRF = <?= json_encode($csrf) ?>;
let items = [];
const $ = s => document.querySelector(s), dlg = $('#dlg');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2500)}
async function post(data){const fd=data instanceof FormData?data:new URLSearchParams(data);if(!(data instanceof FormData))fd.set('csrf',CSRF);
  const r=await fetch('machines_api.php',{method:'POST',body:fd,credentials:'same-origin'});return r.json().catch(()=>({ok:false,error:'Unexpected server reply.'}))}
async function load(){const r=await fetch('machines_api.php?action=list',{credentials:'same-origin'});const j=await r.json();items=j.items||[];render()}
function render(){
  const q=$('#q').value.toLowerCase(), c=$('#fc').value;
  const list=items.filter(m=>(!c||m.category===c)&&(!q||(m.name+m.category).toLowerCase().includes(q)));
  $('#rows').innerHTML=list.map(m=>`<tr>
    <td><img src="${esc(m.image_url)}" alt=""></td><td><b>${esc(m.name)}</b></td>
    <td class="hide-m">${esc(m.category)}</td><td class="hide-m">${esc(m.price)}</td>
    <td><span class="tag ${+m.is_published?'':'off'}">${+m.is_published?'Live':'Hidden'}</span></td>
    <td style="white-space:nowrap"><button class="ghost" data-e="${m.id}">Edit</button>
    <button class="ghost" data-t="${m.id}">${+m.is_published?'Hide':'Show'}</button>
    <button class="red" data-d="${m.id}">Delete</button></td></tr>`).join('');
  $('#empty').style.display=list.length?'none':'block';
}
function openForm(m){
  $('#form').reset(); $('#err').textContent='';
  m=m||{};
  $('#id').value=m.id||''; $('#image_url').value=m.image_url||'';
  $('#name').value=m.name||''; $('#category').value=m.category||$('#category').options[0].value;
  $('#price').value=m.price||''; $('#availability').value=m.availability||'Available';
  $('#description').value=m.description||''; $('#long_description').value=m.long_description||'';
  let s=''; try{const o=JSON.parse(m.specs||'{}');s=Object.entries(o).map(([k,v])=>k+': '+v).join('\n')}catch(e){}
  $('#specs').value=s; $('#is_published').checked=m.id?+m.is_published===1:true;
  const p=$('#prev'); p.style.display=m.image_url?'block':'none'; p.src=m.image_url||'';
  dlg.showModal();
}
$('#add').onclick=()=>openForm(); $('#cancel').onclick=()=>dlg.close();
$('#q').oninput=render; $('#fc').onchange=render;
$('#rows').onclick=async e=>{
  const b=e.target.closest('button'); if(!b) return;
  if(b.dataset.e) openForm(items.find(m=>m.id==b.dataset.e));
  if(b.dataset.t){const j=await post({action:'toggle',id:b.dataset.t});if(j.ok){toast('Updated');load()}else toast(j.error)}
  if(b.dataset.d&&confirm('Delete this machine permanently?')){const j=await post({action:'delete',id:b.dataset.d});if(j.ok){toast('Deleted');load()}else toast(j.error)}
};
$('#form').onsubmit=async e=>{
  e.preventDefault(); $('#save').disabled=true; $('#err').textContent='';
  const j=await post(new FormData(e.target)); $('#save').disabled=false;
  if(!j.ok){$('#err').textContent=j.error||'Could not save.';return}
  dlg.close(); toast('Saved'); load();
};
load();
</script></body></html>