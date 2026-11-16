<?php
require __DIR__ . '/auth.php';
if (!is_admin()) { header('Location: /admin/'); exit; }
$csrf = csrf_token();
?><!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Edit website · MachineMan Admin</title>
<style>
:root{--ink:#111;--gold:#e6b84d;--line:#e5e3dc;--mut:#707274;--bg:#faf9f6}
*{box-sizing:border-box}body{margin:0;font:14px/1.5 system-ui,sans-serif;background:var(--bg);color:var(--ink)}
header{background:var(--ink);color:#fff;padding:12px 24px;display:flex;gap:6px 18px;align-items:center;flex-wrap:wrap}
header b{font-size:16px;margin-right:6px}header a{color:#ccc;text-decoration:none;font-weight:600;font-size:13px}header a.on{color:var(--gold)}
main{max-width:980px;margin:0 auto;padding:24px}
h1{margin:0 0 4px;font-size:26px}
input,select,textarea{font:inherit;padding:9px 11px;border:1px solid var(--line);background:#fff;width:100%}
button{font:inherit;font-weight:700;border:0;padding:9px 16px;cursor:pointer;background:var(--ink);color:#fff}
button:hover{background:var(--gold);color:var(--ink)}button.ghost{background:#fff;color:var(--ink);border:1px solid var(--line)}button.red{background:#b42318;color:#fff}
a.btn{display:inline-block;background:var(--ink);color:#fff;text-decoration:none;font-weight:700;padding:9px 16px}a.btn:hover{background:var(--gold);color:var(--ink)}
.card{background:#fff;border:1px solid var(--line);padding:20px;margin-bottom:18px}
.card h2{margin:0 0 14px;font-size:16px}
.fld{margin-bottom:14px}.fld label{font-size:12px;font-weight:700;display:block;margin-bottom:4px}
.fld img{max-height:90px;display:block;margin-bottom:6px}
.list .it{display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
.list .it:last-child{border:0}.list .it img{width:64px;height:48px;object-fit:cover;background:#eee}
.list .grow{flex:1;min-width:0}.list .grow small{color:var(--mut);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tag{font-size:11px;font-weight:700;padding:2px 8px;background:#fdf6e3;color:#8a610f}
.sticky{position:sticky;bottom:0;background:var(--bg);padding:12px 0;display:flex;gap:10px;align-items:center}
dialog{border:0;padding:0;width:min(560px,94vw)}dialog::backdrop{background:#0008}
.f{padding:22px;display:grid;gap:12px}.acts{display:flex;gap:8px;justify-content:flex-end}.err{color:#b42318;font-weight:600;min-height:20px}
#toast{position:fixed;bottom:20px;right:20px;background:var(--ink);color:#fff;padding:12px 18px;display:none;z-index:50}
.help{color:var(--mut);font-size:13px;margin:0 0 16px}
</style></head><body>
<header><b>MachineMan Admin</b>
 <a href="/admin/">Dashboard</a>
 <a href="content.php#home" data-n="home">Home</a>
 <a href="machines.php">Machines</a>
 <a href="content.php#categories" data-n="categories">Categories</a>
 <a href="content.php#services" data-n="services">Services</a>
 <a href="content.php#projects" data-n="projects">Projects</a>
 <a href="/admin/#media">Gallery</a>
 <a href="content.php#about" data-n="about">About</a>
 <a href="content.php#contact" data-n="contact">Contact</a>
 <a href="enquiries.php">Enquiries</a>
 <a href="/" target="_blank">View site ↗</a></header>
<main>
 <h1 id="ptitle"></h1><p class="help" id="psub"></p>
 <div id="view"></div>
</main>

<dialog id="dlg"><form class="f" id="dform"></form></dialog>
<div id="toast"></div>

<script>
const CSRF = <?= json_encode($csrf) ?>;
const PAGES = {
  home:       {title:'Home page',       sub:'The first page visitors see.',                            groups:['Home page']},
  machines:   {title:'Machines page',   sub:'The heading and intro on the Machines page.',             groups:['Machines page'], link:['machines.php','Manage machines & generators →']},
  categories: {title:'Categories',      sub:'Appear in the menu, the footer and the Machines filter.', groups:[], list:'categories'},
  services:   {title:'Services page',   sub:'',                                                        groups:['Services page'], list:'services'},
  projects:   {title:'Projects page',   sub:'',                                                        groups:['Projects page'], list:'projects'},
  about:      {title:'About page',      sub:'',                                                        groups:['About page']},
  contact:    {title:'Contact page',    sub:'Phone, email and address here are used across the whole website.', groups:['Contact page','Business details (used everywhere)']},
};
let D = null, tab = (location.hash||'#home').slice(1);
if(!PAGES[tab]) tab='home';
const $ = s => document.querySelector(s), dlg = $('#dlg');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display='none',2600)}
async function api(fd){
  fd.set('csrf',CSRF);
  const r=await fetch('content_api.php',{method:'POST',body:fd,credentials:'same-origin'});
  return r.json().catch(()=>({ok:false,error:'Unexpected server reply.'}));
}
const form = o => { const fd=new FormData(); for(const k in o) fd.set(k,o[k]); return fd };

async function load(){
  let txt='';
  try{
    const r=await fetch('content_api.php?action=list',{credentials:'same-origin'});
    txt=await r.text(); D=JSON.parse(txt);
  }catch(e){
    D=null;
    $('#view').innerHTML='<div class="card"><h2>The page could not load its data</h2><p class="help">Send this message to your developer:</p><pre style="white-space:pre-wrap;background:#f6f4ee;padding:12px;font-size:12px">'+esc(txt.slice(0,600)||String(e))+'</pre></div>';
    return;
  }
  if(!D.ok){$('#view').innerHTML='<div class="card"><h2>Could not load</h2><p>'+esc(D.error||'Unknown error')+'</p></div>';return}
  render();
}
window.addEventListener('hashchange',()=>{const t=(location.hash||'#home').slice(1);if(PAGES[t]){tab=t;D?render():load()}});

function render(){
  const P=PAGES[tab];
  document.querySelectorAll('header a[data-n]').forEach(a=>a.classList.toggle('on',a.dataset.n===tab));
  $('#ptitle').textContent=P.title; $('#psub').textContent=P.sub;
  let h='';
  if(P.link) h+=`<p><a class="btn" href="${P.link[0]}">${P.link[1]}</a></p>`;
  const groups={}; D.defs.filter(d=>P.groups.includes(d.group)).forEach(d=>(groups[d.group]=groups[d.group]||[]).push(d));
  if(Object.keys(groups).length){
    h+='<form id="sform"><p class="help">Change any text and press <b>Save changes</b>. The website updates straight away. If you empty a box, the original text comes back.</p>';
    P.groups.forEach(g=>{ if(!groups[g]) return;
      h+=`<div class="card"><h2>${esc(g)}</h2>`;
      groups[g].forEach(d=>{
        const v=D.values[d.key]??'';
        h+=`<div class="fld"><label>${esc(d.label)}</label>`;
        if(d.type==='textarea') h+=`<textarea name="s[${d.key}]" rows="3">${esc(v)}</textarea>`;
        else if(d.type==='image') h+=(v?`<img src="${esc(v)}" alt="">`:'')+`<input type="file" name="file_${d.key}" accept="image/*">`;
        else h+=`<input name="s[${d.key}]" value="${esc(v)}">`;
        h+='</div>';
      });
      h+='</div>';
    });
    h+='<div class="sticky"><button id="ssave">Save changes</button></div></form>';
  }
  if(P.list) h+='<div id="listbox"></div>';
  $('#view').innerHTML=h;
  const sf=$('#sform');
  if(sf) sf.onsubmit=async e=>{
    e.preventDefault(); $('#ssave').disabled=true;
    const fd=new FormData(e.target); fd.set('action','save_settings');
    const j=await api(fd); $('#ssave').disabled=false;
    if(!j.ok){toast(j.error||'Could not save.');return}
    D=j; toast('Saved — the website is updated'); render();
  };
  if(P.list==='services') renderServices();
  if(P.list==='projects') renderProjects();
  if(P.list==='categories') renderCats();
}

function listShell(title,addId,addLabel,help,rows){
  return `<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><h2 style="margin:0">${title}</h2><button id="${addId}">${addLabel}</button></div>${help?`<p class="help">${help}</p>`:''}<div class="list">${rows}</div></div>`;
}
function rowBtns(id,i,n){
  return `<button class="ghost" data-m="up" data-id="${id}" ${i===0?'disabled':''}>↑</button>
    <button class="ghost" data-m="down" data-id="${id}" ${i===n-1?'disabled':''}>↓</button>
    <button class="ghost" data-e="${id}">Edit</button><button class="red" data-d="${id}">Delete</button>`;
}
function wireList(items,kind,openForm,confirmText){
  $('#listbox').onclick=async e=>{
    const b=e.target.closest('button'); if(!b||b.disabled) return;
    if(b.dataset.e) openForm(items().find(x=>x.id==b.dataset.e));
    if(b.dataset.m){const j=await api(form({action:kind+'_move',id:b.dataset.id,dir:b.dataset.m}));if(j.ok){D=j;render()}}
    if(b.dataset.d&&confirm(confirmText)){const j=await api(form({action:kind+'_delete',id:b.dataset.d}));if(j.ok){D=j;render();toast('Deleted')}}
  };
}

/* ---------- services ---------- */
function renderServices(){
  const L=D.services;
  $('#listbox').innerHTML=listShell('Services','addsv','+ Add service','',
    L.map((s,i)=>`<div class="it"><div class="grow"><b>${i+1}. ${esc(s.title)}</b><small>${esc(s.text)}</small></div>${rowBtns(s.id,i,L.length)}</div>`).join('')
    ||'<p class="help">No services yet — the website will show its built-in list.</p>');
  $('#addsv').onclick=()=>svForm(); wireList(()=>D.services,'service',svForm,'Delete this service?');
}
function svForm(s){
  s=s||{};
  $('#dform').innerHTML=`<h2 style="margin:0">${s.id?'Edit':'Add'} service</h2>
  <div class="fld"><label>Title</label><input name="title" value="${esc(s.title)}" required maxlength="190"></div>
  <div class="fld"><label>Description (max 500)</label><textarea name="text" rows="3" maxlength="500">${esc(s.text)}</textarea></div>
  <div class="err" id="derr"></div><div class="acts"><button type="button" class="ghost" id="dc">Cancel</button><button>Save</button></div>`;
  $('#dc').onclick=()=>dlg.close();
  $('#dform').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target);fd.set('action','service_save');fd.set('id',s.id||'');
    const j=await api(fd);if(!j.ok){$('#derr').textContent=j.error;return}D=j;dlg.close();render();toast('Saved')};
  dlg.showModal();
}

/* ---------- categories ---------- */
function renderCats(){
  const L=D.categories;
  $('#listbox').innerHTML=listShell('Categories','addc','+ Add category','“Show on home page” puts a category in the big cards on the home page (three fit best). When you add a machine, you choose one of these.',
    L.map((c,i)=>`<div class="it"><img src="${esc(c.image_url)}" alt=""><div class="grow"><b>${esc(c.name)}</b> ${+c.is_featured?'<span class="tag">On home page</span>':''}<small>${esc(c.description)}</small></div>${rowBtns(c.id,i,L.length)}</div>`).join(''));
  $('#addc').onclick=()=>catForm(); wireList(()=>D.categories,'cat',catForm,'Delete this category? Machines in it are kept, but it will no longer have a category page.');
}
function catForm(c){
  c=c||{};
  $('#dform').innerHTML=`<h2 style="margin:0">${c.id?'Edit':'Add'} category</h2>
  <div class="fld"><label>Name</label><input name="name" value="${esc(c.name)}" required maxlength="190"></div>
  <div class="fld"><label>Description (max 500)</label><textarea name="description" rows="3" maxlength="500">${esc(c.description)}</textarea></div>
  <div class="fld"><label>Picture</label>${c.image_url?`<img src="${esc(c.image_url)}" alt="">`:''}<input type="file" name="image" accept="image/*"></div>
  <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" name="is_featured" value="1" style="width:auto" ${+c.is_featured?'checked':''}> Show on home page</label>
  <input type="hidden" name="image_url" value="${esc(c.image_url)}">
  <div class="err" id="derr"></div><div class="acts"><button type="button" class="ghost" id="dc">Cancel</button><button>Save</button></div>`;
  $('#dc').onclick=()=>dlg.close();
  $('#dform').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target);fd.set('action','cat_save');fd.set('id',c.id||'');
    const j=await api(fd);if(!j.ok){$('#derr').textContent=j.error;return}D=j;dlg.close();render();toast('Saved')};
  dlg.showModal();
}

/* ---------- projects ---------- */
function renderProjects(){
  const L=D.projects||[];
  $('#listbox').innerHTML=listShell('Projects &amp; deliveries','addp','+ Add project','Shown on the Projects page, in this order.',
    L.map((p,i)=>`<div class="it"><img src="${esc(p.image_url)}" alt=""><div class="grow"><b>${esc(p.title)}</b> ${p.tag?`<span class="tag">${esc(p.tag)}</span>`:''}<small>${esc(p.text)}</small></div>${rowBtns(p.id,i,L.length)}</div>`).join('')
    ||'<p class="help">No projects yet. Have you run stage3-projects.sql in phpMyAdmin?</p>');
  $('#addp').onclick=()=>projForm(); wireList(()=>D.projects||[],'project',projForm,'Delete this project?');
}
function projForm(p){
  p=p||{};
  $('#dform').innerHTML=`<h2 style="margin:0">${p.id?'Edit':'Add'} project</h2>
  <div class="fld"><label>Small label (e.g. Equipment delivery)</label><input name="tag" value="${esc(p.tag)}" maxlength="120"></div>
  <div class="fld"><label>Title</label><input name="title" value="${esc(p.title)}" required maxlength="190"></div>
  <div class="fld"><label>Description (max 1000)</label><textarea name="text" rows="4" maxlength="1000">${esc(p.text)}</textarea></div>
  <div class="fld"><label>Picture</label>${p.image_url?`<img src="${esc(p.image_url)}" alt="">`:''}<input type="file" name="image" accept="image/*"></div>
  <input type="hidden" name="image_url" value="${esc(p.image_url)}">
  <div class="err" id="derr"></div><div class="acts"><button type="button" class="ghost" id="dc">Cancel</button><button>Save</button></div>`;
  $('#dc').onclick=()=>dlg.close();
  $('#dform').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target);fd.set('action','project_save');fd.set('id',p.id||'');
    const j=await api(fd);if(!j.ok){$('#derr').textContent=j.error;return}D=j;dlg.close();render();toast('Saved')};
  dlg.showModal();
}
load();
</script></body></html>
