"use strict";
/* ============================================================
   ERP PackLik — ajouts : catégories avec photo, actions groupées et corbeille des produits,
   grammage, fournisseurs multiples calculés automatiquement, éditeur de description riche,
   colonnes Source / Plateforme / Fournisseur des commandes.
   ============================================================ */

/* ---------- envoi d'un fichier (photo ou vidéo) ---------- */
async function uploadFile(f){
  const fd=new FormData(); fd.append('file', f);
  const res=await fetch('api/?r=upload', {method:'POST', credentials:'same-origin', headers:{'X-CSRF':NET.csrf}, body:fd});
  const j=await res.json(); if(!res.ok) throw new Error(j.error||'Envoi impossible'); return j.url;
}
function pickFile(accept){ return new Promise(ok=>{ const i=document.createElement('input'); i.type='file'; i.accept=accept; i.onchange=()=>ok(i.files[0]||null); i.click(); }); }

/* ---------- catégories : enregistrées dans les réglages, avec photo ---------- */
function syncCats(){
  if(Array.isArray(SETTINGS.cats) && SETTINGS.cats.length) CATS.splice(0, CATS.length, ...SETTINGS.cats.map(c=>({...c})));
  CATS.sort((a,b)=>(a.order||0)-(b.order||0));
  CATS.forEach(c=>{ c.n = c.id==='tout'? PRODUCTS.filter(p=>p.status==='actif').length : PRODUCTS.filter(p=>p.cats.includes(c.id) && p.status==='actif').length; if(c.en) EN[c.fr]=c.en; if(c.ar) AR[c.fr]=c.ar; });
}
const _reindexPlus = reindex;
reindex = function(){ _reindexPlus(); syncCats(); };
function saveCats(){ CATS.forEach((c,i)=>c.order=i+1); SETTINGS.cats = CATS.map(({n,...c})=>c); syncCats(); queueSync(); }
const slugify = s => String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'cat-'+uid();
function catImg(c, size){ if(c && c.img) return `<img src="${esc(c.img)}" alt="" loading="lazy" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:8px">`; const p=c && PRODUCTS.find(x=>x.cats.includes(c.id)); return p? prodArt(p,size) : ''; }

function catsTab(){
  return `<div class="card-b row between wrap"><span class="small muted">${t('Ajoutez, renommez, réordonnez vos catégories et donnez-leur une photo : elle s\'affiche sur la page d\'accueil.')}</span><button class="btn primary" data-a="catEdit" data-id="">${ic('plus','sm')} ${t('Ajouter une catégorie')}</button></div>
  <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Ordre')}</th><th>${t('Photo')}</th><th>${t('Nom FR')}</th><th>${t('Nom AR')}</th><th>${t('Nom EN')}</th><th class="r">${t('Produits')}</th><th></th></tr></thead><tbody>
  ${CATS.map((c,i)=>`<tr><td><div class="row" style="gap:2px;flex-wrap:nowrap"><button class="btn icon sm ghost" data-a="catMove" data-i="${i}" data-v="-1" ${i?'':'disabled'} aria-label="${t('Monter')}">${ic('arrowU','sm')}</button><button class="btn icon sm ghost" data-a="catMove" data-i="${i}" data-v="1" ${i<CATS.length-1?'':'disabled'} aria-label="${t('Descendre')}">${ic('arrowD','sm')}</button></div></td>
    <td>${catImg(c,40)}</td><td><b>${esc(c.fr)}</b><div class="xs muted">${esc(c.id)}</div></td><td dir="rtl">${esc(c.ar||'')}</td><td>${esc(c.en||'')}</td><td class="r num">${c.n||0}</td>
    <td><div class="row" style="gap:2px;flex-wrap:nowrap"><button class="btn sm" data-a="catProds" data-id="${esc(c.id)}">${ic('box','sm')} ${t('Produits')}</button><button class="btn icon sm ghost" data-a="catEdit" data-id="${esc(c.id)}" aria-label="${t('Modifier')}">${ic('edit','sm')}</button>${c.id==='tout'?'':`<button class="btn icon sm ghost" data-a="catDel" data-id="${esc(c.id)}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button>`}</div></td></tr>`).join('')}
  </tbody></table></div>`;
}
function catModal(){
  const d=S.ui.catE;
  openModal(modalTpl(d.id? t('Modifier la catégorie') : t('Nouvelle catégorie'), `<div class="col" style="gap:12px">
    <div class="row" style="gap:14px"><div class="pk-catimg">${d.img? `<img src="${esc(d.img)}" alt="">` : ic('upload','lg')}</div><div class="col" style="gap:6px"><button class="btn sm" data-a="catImg">${ic('upload','sm')} ${t(d.img?'Changer la photo':'Ajouter une photo')}</button>${d.img? `<button class="btn sm ghost" data-a="catImgDel">${ic('x','sm')} ${t('Retirer la photo')}</button>`:''}<span class="xs muted">JPG / PNG / WEBP · 4 Mo</span></div></div>
    <div class="grid3"><div class="field"><label>${t('Nom FR')} *<input class="input" id="ceFr" value="${esc(d.fr)}"></label></div><div class="field"><label>${t('Nom AR')}<input class="input" id="ceAr" dir="rtl" value="${esc(d.ar)}"></label></div><div class="field"><label>${t('Nom EN')}<input class="input" id="ceEn" value="${esc(d.en)}"></label></div></div>
  </div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="catSave">${t('Enregistrer')}</button>`));
}
const catKeep = ()=>{ const d=S.ui.catE; if(document.getElementById('ceFr')){ d.fr=val('ceFr'); d.ar=val('ceAr'); d.en=val('ceEn'); } };
A.catEdit = el=>{ const c=CATS.find(x=>x.id===el.dataset.id); S.ui.catE = c? {id:c.id, fr:c.fr, ar:c.ar||'', en:c.en||'', img:c.img||''} : {id:'', fr:'', ar:'', en:'', img:''}; catModal(); };
A.catImg = async()=>{ catKeep(); const f=await pickFile('image/jpeg,image/png,image/webp'); if(!f) return; try{ S.ui.catE.img=await uploadFile(f); }catch(e){ toast(esc(e.message),'bad'); } catModal(); };
A.catImgDel = ()=>{ catKeep(); S.ui.catE.img=''; catModal(); };
A.catSave = ()=>{
  catKeep(); const d=S.ui.catE, fr=d.fr.trim(); if(!fr){ toast(t('Nom requis'),'bad'); return; }
  let c = d.id && CATS.find(x=>x.id===d.id);
  if(!c){ let id=slugify(fr); while(CATS.some(x=>x.id===id)) id+='-2'; c={id, order:CATS.length+1}; CATS.push(c); }
  Object.assign(c, {fr, ar:d.ar.trim(), en:d.en.trim(), img:d.img});
  saveCats(); closeModal(); toast(t('Catégorie enregistrée'),'ok'); render();
};
A.catDel = el=>{ const c=CATS.find(x=>x.id===el.dataset.id); if(!c || !confirm(t('Supprimer la catégorie')+' « '+c.fr+' » ? '+t('Les produits restent, sans cette catégorie.'))) return;
  CATS.splice(CATS.indexOf(c),1); PRODUCTS.forEach(p=>{ const i=p.cats.indexOf(c.id); if(i>=0){ p.cats.splice(i,1); if(!p.cats.length) p.cats.push('tout'); } }); saveCats(); render(); };
A.catMove = el=>{ const i=+el.dataset.i, j=i+(+el.dataset.v); if(j<0||j>=CATS.length) return; [CATS[i],CATS[j]]=[CATS[j],CATS[i]]; saveCats(); render(); };

/* ---------- produits d'une catégorie : ajout, retrait, ordre d'affichage (c.pids, lu par la boutique : catRank) ---------- */
Object.assign(AR, {'Produits de la catégorie':'منتجات الفئة', 'L\'ordre ci-dessous est celui de la boutique (tri « Recommandés ») : le premier produit s\'affiche en premier.':'هذا هو ترتيب المنتجات في المتجر (فرز «المقترحة»): المنتج الأول يظهر أولاً.', 'Ajouter un produit à cette catégorie':'إضافة منتج إلى هذه الفئة', 'Ajouter un produit':'إضافة منتج', 'Mettre en premier':'وضعه في الأول', 'Mettre en dernier':'وضعه في الأخير', 'Retirer de la catégorie':'إزالة من الفئة', 'Aucun produit dans cette catégorie':'لا توجد منتجات في هذه الفئة', 'Recommandés':'المقترحة'});
Object.assign(EN, {'Produits de la catégorie':'Category products', 'L\'ordre ci-dessous est celui de la boutique (tri « Recommandés ») : le premier produit s\'affiche en premier.':'This is the shop order (« Recommended » sort): the first product is shown first.', 'Ajouter un produit à cette catégorie':'Add a product to this category', 'Ajouter un produit':'Add a product', 'Mettre en premier':'Move to first', 'Mettre en dernier':'Move to last', 'Retirer de la catégorie':'Remove from category', 'Aucun produit dans cette catégorie':'No product in this category', 'Recommandés':'Recommended'});
const catMembers = c => PRODUCTS.filter(p=>p.status!=='corbeille' && (c.id==='tout' || p.cats.includes(c.id)));
function catOrdered(c){ const r=catRank(c.id); return catMembers(c).sort((a,b)=>r(a)-r(b)); }
function catProdModal(){
  const c=CATS.find(x=>x.id===S.ui.catP); if(!c) return closeModal();
  const list=catOrdered(c), all=c.id==='tout', last=list.length-1;
  const add = PRODUCTS.filter(p=>p.status!=='corbeille' && !p.cats.includes(c.id)).sort((a,b)=>a.name.localeCompare(b.name));
  const btn = (a,v,icon,label,off)=>`<button class="btn icon sm ghost" data-a="${a}" data-id="${v}" ${off?'disabled':''} aria-label="${t(label)}" title="${t(label)}">${icon}</button>`;
  openModal(modalTpl(esc(t('Produits de la catégorie')+' « '+catName(c)+' »'), `<div class="col" style="gap:12px">
    <p class="small muted" style="margin:0">${t('L\'ordre ci-dessous est celui de la boutique (tri « Recommandés ») : le premier produit s\'affiche en premier.')}</p>
    ${all? '' : `<select class="select" data-ch="catPAdd" aria-label="${t('Ajouter un produit')}"><option value="">+ ${t('Ajouter un produit à cette catégorie')}…</option>${add.map(p=>`<option value="${p.id}">${esc(p.name)}${p.sku?' · '+esc(p.sku):''}</option>`).join('')}</select>`}
    <div class="tbl-wrap" style="max-height:52vh;border:1px solid var(--line);border-radius:var(--r)"><table class="tbl"><tbody>
    ${list.map((p,i)=>`<tr><td class="num muted small" style="width:28px">${i+1}</td><td><div class="row">${prodArt(p,32)}<div><b class="small">${esc(p.name)}</b><div class="xs muted">${esc(p.sku||'')} · ${t(p.status)}</div></div></div></td>
      <td class="r"><div class="row" style="gap:0;flex-wrap:nowrap;justify-content:flex-end">${btn('catPFirst',p.id,ic('arrowU','sm')+ic('arrowU','sm'),'Mettre en premier',!i)}${btn('catPUp',p.id,ic('arrowU','sm'),'Monter',!i)}${btn('catPDown',p.id,ic('arrowD','sm'),'Descendre',i===last)}${btn('catPLast',p.id,ic('arrowD','sm')+ic('arrowD','sm'),'Mettre en dernier',i===last)}${all?'':btn('catPDel',p.id,ic('x','sm'),'Retirer de la catégorie')}</div></td></tr>`).join('') || `<tr><td class="muted small" style="padding:20px;text-align:center">${t('Aucun produit dans cette catégorie')}</td></tr>`}
    </tbody></table></div></div>`, `<button class="btn primary" data-a="closeModal">${t('Fermer')}</button>`, true));
}
// range la catégorie : nouvel ordre complet, enregistré dans SETTINGS.cats
function catPSet(ids){ const c=CATS.find(x=>x.id===S.ui.catP); c.pids=ids; saveCats(); catProdModal(); render(); }
function catPMove(el, to){ const ids=catOrdered(CATS.find(x=>x.id===S.ui.catP)).map(p=>p.id), id=+el.dataset.id, i=ids.indexOf(id); ids.splice(i,1); ids.splice(to(i, ids.length),0,id); catPSet(ids); }
A.catProds = el=>{ S.ui.catP=el.dataset.id; catProdModal(); };
A.catPFirst = el=>catPMove(el, ()=>0);
A.catPUp = el=>catPMove(el, i=>Math.max(0,i-1));
A.catPDown = el=>catPMove(el, (i,n)=>Math.min(n,i+1));
A.catPLast = el=>catPMove(el, (i,n)=>n);
A.catPDel = el=>{ const p=PBY[+el.dataset.id], c=S.ui.catP; if(!p) return; p.cats=p.cats.filter(x=>x!==c); if(!p.cats.length) p.cats=['tout']; log('Catégorie retirée', p.sku, c); catPSet(catOrdered(CATS.find(x=>x.id===c)).map(x=>x.id)); };
CH.catPAdd = el=>{ const p=PBY[+el.value], c=S.ui.catP; if(!p) return; if(!p.cats.includes(c)) p.cats.push(c); log('Catégorie ajoutée', p.sku, c); catPSet(catOrdered(CATS.find(x=>x.id===c)).map(x=>x.id)); };

/* ---------- fournisseurs ---------- */
const supOf = pid => (PBY[pid]||{}).supplierId || 1;
const supName = id => (SUPPLIERS.find(s=>s.id===id)||{}).name || '—';
function orderSups(o){ return [...new Set(o.items.map(i=>supOf(i.pid)))]; }

/* ---------- produits : liste avec sélection, actions groupées, corbeille ---------- */
S.ui.prod.sel = new Set();
const _viewProductsBase = viewProducts;
function prodTabs(){ const u=S.ui.prod, trash=PRODUCTS.filter(p=>p.status==='corbeille').length;
  return `<div class="tabs">${[['list',t('Produits')+' ('+PRODUCTS.filter(p=>p.status!=='corbeille').length+')'],['cats',t('Catégories')+' ('+CATS.length+')'],['packs',t('Packs')],['var',t('Variantes')],['trash',t('Corbeille')+(trash?' ('+trash+')':'')]].map(([k,l])=>`<button class="${u.tab===k?'on':''}" data-a="prodTab" data-v="${k}">${esc(l)}</button>`).join('')}</div>`; }
viewProducts = function(){
  const u=S.ui.prod, sc=seesCost(), canEdit=['admin','gerant'].includes(S.role);
  if(u.tab==='packs' || u.tab==='var') return _viewProductsBase().replace(/<div class="tabs">[\s\S]*?<\/div>/, prodTabs());
  let inner;
  if(u.tab==='cats') inner = catsTab();
  else {
    const trash = u.tab==='trash';
    let list = PRODUCTS.filter(p=>trash? p.status==='corbeille' : p.status!=='corbeille');
    if(u.q){ const q=u.q.toLowerCase(); list=list.filter(p=>p.name.toLowerCase().includes(q)||(p.sku||'').toLowerCase().includes(q)); }
    if(u.cat) list=list.filter(p=>p.cats.includes(u.cat)); if(u.st && !trash) list=list.filter(p=>p.status===u.st);
    [...u.sel].forEach(id=>{ if(!list.some(p=>p.id===id)) u.sel.delete(id); });
    const n=u.sel.size, all = list.length && list.every(p=>u.sel.has(p.id));
    const bulk = !canEdit? '' : trash
      ? `<button class="btn sm" data-a="pBulk" data-v="restore" ${n?'':'disabled'}>${ic('undo','sm')} ${t('Restaurer')}</button><button class="btn sm red" data-a="pBulk" data-v="purge" ${n?'':'disabled'}>${ic('trash','sm')} ${t('Supprimer définitivement')}</button>`
      : `<button class="btn sm" data-a="pBulk" data-v="edit" ${n?'':'disabled'}>${ic('edit','sm')} ${t('Modifier')}</button><button class="btn sm" data-a="pBulk" data-v="trash" ${n?'':'disabled'}>${ic('archive','sm')} ${t('Mettre à la corbeille')}</button><button class="btn sm red" data-a="pBulk" data-v="purge" ${n?'':'disabled'}>${ic('trash','sm')} ${t('Supprimer')}</button>`;
    inner = `<div class="filters-bar"><input class="input s" placeholder="${t('Rechercher nom ou SKU…')}" value="${esc(u.q)}" data-in="prodQ" aria-label="${t('Rechercher')}"><select class="select" data-ch="prodCat" aria-label="${t('Catégorie')}"><option value="">${t('Toutes les catégories')}</option>${CATS.map(c=>`<option value="${c.id}" ${u.cat===c.id?'selected':''}>${esc(catName(c))}</option>`).join('')}</select>${trash?'':`<select class="select" data-ch="prodSt" aria-label="${t('Statut')}"><option value="">${t('Tous les statuts')}</option>${['actif','masqué','rupture','devis','archivé'].map(s=>`<option ${u.st===s?'selected':''} value="${s}">${t(s)}</option>`).join('')}</select>`}<span class="grow"></span>${n? `<b class="small">${n} ${t('sélectionné(s)')}</b>`:''}${bulk}</div>
    <div class="tbl-wrap" style="max-height:640px"><table class="tbl"><thead><tr>${canEdit?`<th style="width:34px"><input type="checkbox" ${all?'checked':''} ${list.length?'':'disabled'} data-ch="pAll" aria-label="${t('Tout sélectionner')}"></th>`:''}<th>SKU</th><th>${t('Produit')}</th><th>${t('Catégories')}</th><th>${t('Fournisseur')}</th><th class="r">${t('Grammage')}</th><th class="r">${t('Prix de vente')}</th>${sc?`<th class="r">${t('Prix d\'achat')}</th><th class="r">${t('Marge unitaire')}</th>`:''}<th class="r">${t('Stock dispo')}</th><th>${t('Statut')}</th>${canEdit?'<th></th>':''}</tr></thead><tbody>
    ${list.map(p=>{ const s=stockInfo(p.id); const m=p.price-p.cost; return `<tr class="${u.sel.has(p.id)?'sel':''}">${canEdit?`<td><input type="checkbox" ${u.sel.has(p.id)?'checked':''} data-ch="pSel" data-id="${p.id}" aria-label="${esc(p.name)}"></td>`:''}<td class="small muted">${esc(p.sku||'')}</td><td><div class="row">${prodArt(p,34)}<div><b class="small">${esc(p.name)}</b><div class="xs muted">${p.pack} ${t('pièces')}${p.variants?' · '+p.variants.length+' '+t('variantes'):''}${p.packItems?' · '+t('pack'):''}</div></div></div></td>
      <td class="xs">${p.cats.slice(0,3).map(c=>esc(catName(CATS.find(x=>x.id===c)||{fr:c,ar:c}))).join(', ')}${p.cats.length>3?' +'+(p.cats.length-3):''}</td>
      <td>${canEdit? `<select class="kcell" data-ch="pSup" data-id="${p.id}" aria-label="${t('Fournisseur')}">${SUPPLIERS.map(x=>`<option value="${x.id}" ${x.id===supOf(p.id)?'selected':''}>${esc(x.name)}</option>`).join('')}</select>` : esc(supName(supOf(p.id)))}</td>
      <td class="r">${canEdit? `<input class="kcell num" type="number" min="0" step="0.01" style="width:72px;text-align:end" value="${p.weight? (p.weight/1000).toFixed(2).replace(/\.?0+$/,'') : ''}" data-ch="pWeight" data-id="${p.id}" aria-label="${t('Poids kg')}">` : (p.weight? (p.weight/1000).toFixed(2).replace(/\.?0+$/,'')+' kg' : '—')}</td>
      <td class="r num">${p.price? dzd(p.price): t('sur devis')}</td>${sc?`<td class="r"><input class="kcell num" type="number" min="0" step="10" style="width:88px;text-align:end" value="${p.cost||''}" data-ch="pCost" data-id="${p.id}" aria-label="${t('Prix d\'achat')}"></td><td class="r num">${p.price? `<b class="up">${dzd(m)}</b><div class="xs muted">${fmtPct(pct(m,p.price))}</div>`:'—'}</td>`:''}
      <td class="r num ${s.available<=p.threshold?'down':''}"><b>${s.available}</b></td><td><span class="badge ${p.status==='actif'?'green':p.status==='rupture'||p.status==='corbeille'?'red':p.status==='devis'?'amber':''}">${t(p.status)}</span></td>
      ${canEdit?`<td><div class="row" style="gap:2px;flex-wrap:nowrap">${trash? `<button class="btn icon sm ghost" data-a="pOne" data-v="restore" data-id="${p.id}" aria-label="${t('Restaurer')}">${ic('undo','sm')}</button>` : `<button class="btn icon sm ghost" data-a="prodEdit" data-id="${p.id}" aria-label="${t('Modifier')}">${ic('edit','sm')}</button><button class="btn icon sm ghost" data-a="prodDup" data-id="${p.id}" aria-label="${t('Dupliquer')}">${ic('copy','sm')}</button><button class="btn icon sm ghost" data-a="pOne" data-v="trash" data-id="${p.id}" aria-label="${t('Mettre à la corbeille')}">${ic('archive','sm')}</button>`}<button class="btn icon sm ghost" data-a="pOne" data-v="purge" data-id="${p.id}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button></div></td>`:''}</tr>`; }).join('') || emptyRow(12, trash?'La corbeille est vide':'Aucun produit', trash?'archive':'box')}
    </tbody></table></div>`;
  }
  const actions = canEdit? `<button class="btn" data-a="exportProducts">${ic('download','sm')} ${t('Export Excel')}</button><button class="btn" data-a="importProducts">${ic('upload','sm')} ${t('Import Excel')}</button><button class="btn primary" data-a="prodEdit" data-id="0">${ic('plus','sm')} ${t('Ajouter un produit')}</button>` : '';
  const note = !sc? `<div class="lock-note">${ic('lock','sm')} ${t('Prix d\'achat et marges masqués pour votre rôle.')}</div>`:'';
  return erpShell('produits', t('Produits et catégories'), PRODUCTS.filter(p=>p.status!=='corbeille').length+' '+t('produits')+' · '+CATS.length+' '+t('catégories'), note + card('', prodTabs()+inner), actions);
};
CH.pSel = el=>{ const s=S.ui.prod.sel, id=+el.dataset.id; el.checked? s.add(id) : s.delete(id); render(); };
CH.pAll = el=>{ const s=S.ui.prod.sel; document.querySelectorAll('[data-ch=pSel]').forEach(x=>{ el.checked? s.add(+x.dataset.id) : s.delete(+x.dataset.id); }); render(); };
CH.pSup = el=>{ const p=PBY[+el.dataset.id]; p.supplierId=+el.value; log('Fournisseur du produit', p.sku, supName(p.supplierId)); toast(p.name+' → '+esc(supName(p.supplierId)),'ok'); };
CH.pWeight = el=>{ const p=PBY[+el.dataset.id]; if(!p) return; p.weight=Math.round((+el.value||0)*1000); log('Poids produit', p.sku, el.value+' kg'); toast(p.name+' → '+(p.weight/1000)+' kg','ok'); };
CH.pCost = el=>{ const p=PBY[+el.dataset.id]; if(!p) return; p.cost=Math.round(+el.value||0); log('Prix d\'achat', p.sku, dzd(p.cost)); toast(p.name+' → '+dzd(p.cost),'ok'); };
const _prodTab = A.prodTab; A.prodTab = el=>{ S.ui.prod.sel.clear(); _prodTab(el); };
/* un produit déjà vendu reste nécessaire aux anciennes commandes : il ne peut qu'aller à la corbeille */
const prodUsed = id => ORDERS.concat(TRASHED).some(o=>o.items.some(i=>i.pid===id) || (o.initial||[]).some(i=>i.pid===id)) || PURCHASES.some(po=>po.items.some(i=>i.pid===id)) || PRODUCTS.some(p=>(p.packItems||[]).some(c=>c.pid===id));
function prodApply(ids, v){
  const ps=ids.map(id=>PBY[id]).filter(Boolean);
  if(v==='edit') return prodBulkEdit(ps);
  if(v==='trash'){ ps.forEach(p=>{ p.prevStatus=p.status; p.status='corbeille'; }); toast(ps.length+' '+t('produit(s) mis à la corbeille'),'ok'); }
  if(v==='restore'){ ps.forEach(p=>{ p.status=p.prevStatus && p.prevStatus!=='corbeille'? p.prevStatus : 'masqué'; delete p.prevStatus; }); toast(ps.length+' '+t('produit(s) restauré(s)'),'ok'); }
  if(v==='purge'){
    const used=ps.filter(p=>prodUsed(p.id)), free=ps.filter(p=>!prodUsed(p.id));
    if(!confirm(t('Supprimer définitivement')+' '+ps.length+' '+t('produit(s) ?')+(used.length? '\n'+used.length+' '+t('déjà utilisé(s) dans des commandes iront à la corbeille à la place.') : ''))) return;
    used.forEach(p=>{ if(p.status!=='corbeille'){ p.prevStatus=p.status; p.status='corbeille'; } });
    free.forEach(p=>{ PRODUCTS.splice(PRODUCTS.indexOf(p),1); delete PBY[p.id]; });
    log('Produits supprimés', free.map(p=>p.sku).join(', '), ''); toast(free.length+' '+t('supprimé(s)')+(used.length? ' · '+used.length+' '+t('à la corbeille'):''),'ok');
  }
  ps.forEach(p=>S.ui.prod.sel.delete(p.id)); syncCats(); render();
}
A.pBulk = el=>prodApply([...S.ui.prod.sel], el.dataset.v);
A.pOne = el=>prodApply([+el.dataset.id], el.dataset.v);
function prodBulkEdit(ps){
  S.ui.pbe = ps.map(p=>p.id);
  openModal(modalTpl(t('Modifier')+' '+ps.length+' '+t('produit(s)'), `<p class="small muted" style="margin-top:0">${t('Seuls les champs remplis sont changés.')}</p><div class="grid2">
    <div class="field"><label>${t('Statut')}<select class="select" id="pbSt"><option value="">— ${t('inchangé')} —</option>${['actif','masqué','rupture','devis','archivé'].map(s=>`<option value="${s}">${t(s)}</option>`).join('')}</select></label></div>
    <div class="field"><label>${t('Fournisseur')}<select class="select" id="pbSup"><option value="">— ${t('inchangé')} —</option>${SUPPLIERS.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></label></div>
    <div class="field"><label>${t('Ajouter la catégorie')}<select class="select" id="pbCat"><option value="">—</option>${CATS.map(c=>`<option value="${c.id}">${esc(catName(c))}</option>`).join('')}</select></label></div>
    <div class="field"><label>${t('Retirer la catégorie')}<select class="select" id="pbCatOff"><option value="">—</option>${CATS.map(c=>`<option value="${c.id}">${esc(catName(c))}</option>`).join('')}</select></label></div>
    <div class="field"><label>${t('Prix de vente : variation en %')}<input class="input num" id="pbPct" type="number" placeholder="ex. 10 ou -5"></label></div>
    <div class="field"><label>${t('Poids (kg)')}<input class="input num" id="pbW" type="number" min="0" step="0.01"></label></div>
  </div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="pbSave">${t('Appliquer')}</button>`));
}
A.pbSave = ()=>{
  const st=val('pbSt'), sup=+val('pbSup'), cat=val('pbCat'), off=val('pbCatOff'), pc=val('pbPct'), w=val('pbW');
  S.ui.pbe.map(id=>PBY[id]).filter(Boolean).forEach(p=>{
    if(st) p.status=st; if(sup) p.supplierId=sup;
    if(cat && !p.cats.includes(cat)) p.cats.push(cat);
    if(off){ p.cats=p.cats.filter(c=>c!==off); if(!p.cats.length) p.cats=['tout']; }
    if(pc!=='' && +pc){ const f=1+(+pc)/100; if(p.price){ p.price=Math.round(p.price*f); p.priceHistory=(p.priceHistory||[]).concat({at:Date.now(), sale:p.price, cost:p.cost}); } (p.variants||[]).forEach(v=>v.price=Math.round(v.price*f)); }
    if(w!=='') p.weight=(+w||0)*1000;
  });
  log('Modification groupée', S.ui.pbe.length+' produits', ''); S.ui.prod.sel.clear(); closeModal(); syncCats(); toast(t('Produits modifiés'),'ok'); render();
};

/* ---------- fiche produit : grammage et fournisseur dans « Général », description riche ---------- */
const _peHtml = peHtml;
peHtml = function(){
  const d=S.ui.pe; let h=_peHtml();
  const num='type="number" min="0" inputmode="numeric"';
  if(d._tab==='gen') h = h.replace(`<fieldset class="tj-group"><legend>${t('Catégories')}</legend>`,
    `<div class="grid2"><div class="field"><label>${t('Poids (kg) — poids d\'une unité vendue')}<input class="input" data-pe="weight" value="${+d.weight? (d.weight/1000).toFixed(3).replace(/\.?0+$/,'') : ''}" ${num} step="0.001"></label></div><div class="field"><label>${t('Fournisseur')}<select class="select" data-pe-sup>${SUPPLIERS.map(s=>`<option value="${s.id}" ${s.id===(+d.supplierId||1)?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label></div></div>
    <fieldset class="tj-group"><legend>${t('Catégories')}</legend>`);
  if(d._tab==='price') h = h.replace(/<div class="field"><label>[^<]*<input class="input" data-pe="weight"[^>]*><\/label><\/div>/, '');
  if(d._tab==='desc') h = h.replace(/<div class="field"><label>[^<]*<textarea class="input" data-pe="desc"[\s\S]*?<\/textarea><\/label><\/div>/, `<div class="field"><label>${t('Description complète')}</label>${rteHtml(d.desc)}</div>`);
  return h;
};
document.addEventListener('change', e=>{ const el=e.target.closest('[data-pe-sup]'); if(el && S.ui.pe) S.ui.pe.supplierId=+el.value; });
const _peSave = A.peSave;
A.peSave = el=>{ const d=S.ui.pe; const rte=document.getElementById('rte'); if(rte) d.desc=rteClean(rte.innerHTML); d.weight=(+d.weight||0)*1000; const sup=+d.supplierId||1, id=d.id; const before=PRODUCTS.length; _peSave(el); const p = id? PBY[id] : (PRODUCTS.length>before? PRODUCTS[PRODUCTS.length-1] : null); if(p){ p.supplierId=sup; syncCats(); } };
const _peTab = A.peTab; A.peTab = el=>{ const rte=document.getElementById('rte'); if(rte && S.ui.pe) S.ui.pe.desc=rteClean(rte.innerHTML); _peTab(el); };

/* ---------- éditeur de texte riche (description) : gras, polices, tailles, couleurs, photo, vidéo ---------- */
const RT_TAGS = new Set(['P','BR','B','STRONG','I','EM','U','S','STRIKE','H2','H3','H4','UL','OL','LI','A','IMG','VIDEO','IFRAME','SPAN','DIV','FONT','BLOCKQUOTE','HR','TABLE','THEAD','TBODY','TR','TD','TH','SUB','SUP','FIGURE','FIGCAPTION']);
const RT_ATTR = {A:['href','target'], IMG:['src','alt','width','height'], VIDEO:['src','controls','width','poster'], IFRAME:['src','width','height','allowfullscreen'], FONT:['face','size','color'], TD:['colspan','rowspan'], TH:['colspan','rowspan']};
const okUrl = (u, tag) => tag==='IFRAME'? /^https:\/\/www\.youtube(-nocookie)?\.com\/embed\/[\w-]+(\?[\w=&-]*)?$/.test(u) : /^(https?:|mailto:|tel:|#|uploads\/|assets\/)/i.test(u);
function rteClean(html){
  const doc=new DOMParser().parseFromString('<div>'+String(html||'')+'</div>','text/html'), root=doc.body.firstElementChild;
  (function walk(n){ [...n.children].forEach(el=>{
    if(!RT_TAGS.has(el.tagName)){ if(['SCRIPT','STYLE','OBJECT','EMBED','FORM','INPUT','BUTTON','SVG','MATH','TEMPLATE','LINK','META'].includes(el.tagName)) el.remove(); else { walk(el); el.replaceWith(...el.childNodes); } return; }
    [...el.attributes].forEach(a=>{ const k=a.name.toLowerCase(); const keep = k==='style'? !/url\s*\(|expression|javascript/i.test(a.value) : k==='align'? true : (RT_ATTR[el.tagName]||[]).includes(k) && (!['href','src','poster'].includes(k) || okUrl(a.value.trim(), el.tagName)); if(!keep) el.removeAttribute(a.name); });
    if(el.tagName==='A'){ el.setAttribute('rel','noopener'); } if(el.tagName==='VIDEO') el.setAttribute('controls','');
    if(['IMG','VIDEO','IFRAME'].includes(el.tagName) && !el.getAttribute('src')){ el.remove(); return; }
    walk(el);
  }); })(root);
  return root.innerHTML.trim();
}
/* les anciennes descriptions sont du texte brut : on garde les retours à la ligne */
const isHtml = s => /<(p|br|b|strong|i|em|u|h\d|ul|ol|li|img|video|iframe|div|span|font|a)\b/i.test(s||'');
function richHtml(s){ return isHtml(s)? rteClean(s) : esc(s||'').replace(/\n/g,'<br>'); }
Object.assign(IC, {
  alignL:'<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>', alignC:'<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>', alignR:'<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>',
  listUl:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  listOl:'<path d="M10 6h10M10 12h10M10 18h10M4 4.5h1.5V9M3.5 9h3M3.5 14.5c.5-1 2.8-1 2.8.5 0 1.2-2.8 2-2.8 3.5h3"/>',
  rule:'<path d="M3 12h18"/>', video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>', eraser:'<path d="m7 21-4-4 10-10 7 7-7 7H7zM10 10l7 7M14 21h7"/>'
});
const RTE_FONTS = ['Inter','Cairo','Arial','Georgia','Times New Roman','Courier New','Verdana','Tahoma'];
function rteHtml(v){
  const b=(cmd,icon,label,arg)=>`<button type="button" class="rte-b" data-rte="${cmd}" ${arg?`data-arg="${esc(arg)}"`:''} title="${t(label)}" aria-label="${t(label)}">${icon}</button>`;
  return `<div class="rte"><div class="rte-bar" role="toolbar" aria-label="${t('Mise en forme')}">
    <select class="rte-s" data-rtes="formatBlock" aria-label="${t('Style')}"><option value="p">${t('Paragraphe')}</option><option value="h2">${t('Titre')}</option><option value="h3">${t('Sous-titre')}</option><option value="blockquote">${t('Citation')}</option></select>
    <select class="rte-s" data-rtes="fontName" aria-label="${t('Police')}"><option value="">${t('Police')}</option>${RTE_FONTS.map(f=>`<option value="${f}" style="font-family:${f}">${f}</option>`).join('')}</select>
    <select class="rte-s" data-rtes="fontSize" aria-label="${t('Taille')}"><option value="">${t('Taille')}</option>${[['1','10'],['2','13'],['3','16'],['4','18'],['5','24'],['6','32'],['7','48']].map(([v,px])=>`<option value="${v}">${px} px</option>`).join('')}</select>
    <span class="rte-sep"></span>
    ${b('bold','<b>B</b>','Gras')}${b('italic','<i>I</i>','Italique')}${b('underline','<u>U</u>','Souligné')}${b('strikeThrough','<s>S</s>','Barré')}
    <label class="rte-b rte-color" title="${t('Couleur du texte')}">A<input type="color" data-rtec="foreColor" value="#FD6400" aria-label="${t('Couleur du texte')}"></label>
    <label class="rte-b rte-color" title="${t('Surligner')}" style="background:#FFF3B0">A<input type="color" data-rtec="hiliteColor" value="#FFF3B0" aria-label="${t('Surligner')}"></label>
    <span class="rte-sep"></span>
    ${b('justifyLeft',ic('alignL','sm'),'Aligner à gauche')}${b('justifyCenter',ic('alignC','sm'),'Centrer')}${b('justifyRight',ic('alignR','sm'),'Aligner à droite')}
    ${b('insertUnorderedList',ic('listUl','sm'),'Liste à puces')}${b('insertOrderedList',ic('listOl','sm'),'Liste numérotée')}${b('insertHorizontalRule',ic('rule','sm'),'Ligne de séparation')}
    <span class="rte-sep"></span>
    ${b('link',ic('globe','sm'),'Lien')}${b('image',ic('upload','sm'),'Ajouter une photo')}${b('video',ic('video','sm'),'Ajouter une vidéo')}
    ${b('undo',ic('undo','sm'),'Annuler')}${b('removeFormat',ic('eraser','sm'),'Effacer la mise en forme')}
  </div><div class="rte-area" id="rte" contenteditable="true" role="textbox" aria-multiline="true" aria-label="${t('Description complète')}">${richHtml(v)}</div>
  <div class="xs muted">${t('Photo : JPG / PNG / WEBP, 4 Mo. Vidéo : MP4 / WEBM, 40 Mo, ou un lien YouTube.')}</div></div>`;
}
let rteRange=null;
document.addEventListener('selectionchange', ()=>{ const s=document.getSelection(), a=document.getElementById('rte'); if(a && s.rangeCount && a.contains(s.anchorNode)) rteRange=s.getRangeAt(0).cloneRange(); });
function rteFocus(){ const a=document.getElementById('rte'); if(!a) return null; a.focus(); if(rteRange){ const s=document.getSelection(); s.removeAllRanges(); s.addRange(rteRange); } return a; }
function rteExec(cmd, arg){ if(!rteFocus()) return; document.execCommand('styleWithCSS', false, cmd==='hiliteColor'); document.execCommand(cmd, false, arg); const a=document.getElementById('rte'); if(S.ui.pe) S.ui.pe.desc=rteClean(a.innerHTML); }
function ytEmbed(u){ const m=String(u).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m? 'https://www.youtube-nocookie.com/embed/'+m[1] : null; }
document.addEventListener('mousedown', e=>{ if(e.target.closest('.rte-b')) e.preventDefault(); }); // garder la sélection
document.addEventListener('click', async e=>{
  const b=e.target.closest('[data-rte]'); if(!b) return; e.preventDefault(); const cmd=b.dataset.rte;
  if(cmd==='link'){ const u=prompt(t('Adresse du lien (https://…)'),'https://'); if(u && okUrl(u,'A')) rteExec('createLink', u); return; }
  if(cmd==='image'){ const f=await pickFile('image/jpeg,image/png,image/webp'); if(!f) return; try{ const url=await uploadFile(f); rteExec('insertHTML', `<img src="${esc(url)}" alt="">`); }catch(err){ toast(esc(err.message),'bad'); } return; }
  if(cmd==='video'){
    const u=prompt(t('Lien YouTube — ou laissez vide pour envoyer un fichier vidéo'),'');
    if(u===null) return;
    if(u.trim()){ const em=ytEmbed(u.trim()); if(!em){ toast(t('Lien YouTube non reconnu'),'bad'); return; } rteExec('insertHTML', `<iframe src="${em}" width="560" height="315" allowfullscreen></iframe><p></p>`); return; }
    const f=await pickFile('video/mp4,video/webm'); if(!f) return; toast(t('Envoi de la vidéo…'));
    try{ const url=await uploadFile(f); rteExec('insertHTML', `<video src="${esc(url)}" controls></video><p></p>`); }catch(err){ toast(esc(err.message),'bad'); } return;
  }
  rteExec(cmd, b.dataset.arg);
});
document.addEventListener('change', e=>{ const s=e.target.closest('[data-rtes]'); if(s){ if(s.value) rteExec(s.dataset.rtes, s.value); s.selectedIndex=0; return; } const c=e.target.closest('[data-rtec]'); if(c) rteExec(c.dataset.rtec, c.value); });
document.addEventListener('input', e=>{ if(e.target.id==='rte' && S.ui.pe) S.ui.pe.desc=e.target.innerHTML; });

/* ---------- commandes : Source = d'où vient la commande, Plateforme = site ou manuel, Fournisseur ---------- */
KCOLS.conf.splice(KCOLS.conf.findIndex(c=>c[0]==='product')+1, 0, ['supplier','Fournisseur',1]);
KCOLS.track.splice(KCOLS.track.findIndex(c=>c[0]==='product')+1, 0, ['supplier','Fournisseur',1]);
const supCell = o => { const s=orderSups(o); return s.length? s.map(id=>`<span class="kbadge" style="background:#0F2B4614;color:#0F2B46">${ic('factory','sm')} ${esc(supName(id))}</span>`).join(' ') : '<span class="muted">—</span>'; };
const _kConfCell = kConfCell;
kConfCell = (o,c)=> c.key==='source'? _kConfCell(o,{...c,key:'platform'}) : c.key==='platform'? _kConfCell(o,{...c,key:'source'}) : c.key==='supplier'? supCell(o) : _kConfCell(o,c);
const _kTrackCell = kTrackCell;
kTrackCell = (o,c)=> c.key==='supplier'? supCell(o) : _kTrackCell(o,c);
/* une catégorie supprimée ne doit pas casser l'affichage des produits qui la portaient encore */
const _catNamePlus = catName; catName = c => c? _catNamePlus(c) : '';
['admin','gerant'].forEach(r=>{ ERP_VIEWS[r].produits = ()=>viewProducts(); });

/* ============================================================
   FOURNISSEURS : plusieurs fournisseurs ; chaque produit a son fournisseur, et les commandes de
   chaque fournisseur (sa part = prix d'achat de ses produits) se calculent seules.
   Valable quelle que soit la société de livraison (plus seulement DHD).
   ============================================================ */
S.ui.sup.sid = S.ui.sup.sid || 1;
SUP_STATE.dhd[0] = 'En attente de paiement de la société de livraison';
const SHIP_ROAD = ['sent','picked','transit','outfor','failed'];
const supShareOf = (o, sid) => o.items.filter(i=>supOf(i.pid)===sid).reduce((s,i)=>s+(i.cost||0)*i.q,0);
const supPaidFor = (o, sid) => (o.supPaid||{})[sid] || (o.status==='closed' && !o.supPaid? (o.supplierPaymentId||'—') : null);
function supStateOf(o, sid){ if(supPaidFor(o,sid)) return 'settled'; if(['paid','closed'].includes(o.status)) return 'due'; if(o.status==='delivered') return 'dhd'; if(SHIP_ROAD.includes(o.status)) return 'road'; return null; }
const supOrders = sid => ORDERS.filter(o=>o.items.some(i=>supOf(i.pid)===sid));
function supBalanceOf(sid){
  const os=supOrders(sid), sum=st=>os.filter(o=>supStateOf(o,sid)===st).reduce((s,o)=>s+supShareOf(o,sid),0);
  const paid=SUP_PAYMENTS.filter(p=>(p.supplierId||1)===sid).reduce((s,p)=>s+p.amount,0);
  return {due:sum('due'), dhd:sum('dhd'), road:sum('road'), paid, rest:sum('due')};
}
supplierBalance = function(){ return SUPPLIERS.map(s=>supBalanceOf(s.id)).reduce((a,b)=>({due:a.due+b.due, dhd:a.dhd+b.dhd, road:a.road+b.road, paid:a.paid+b.paid, rest:a.rest+b.rest}), {due:0,dhd:0,road:0,paid:0,rest:0}); };
supplierDues = function(){ return SUPPLIERS.flatMap(s=>supOrders(s.id).filter(o=>supStateOf(o,s.id)==='due').map(o=>({ref:o.ref+(SUPPLIERS.length>1? ' · '+s.name:''), orderId:o.id, rest:supShareOf(o,s.id), due:(o.times.paid||Date.now())+(s.terms||SETTINGS.supplierTerms||7)*DAY}))).sort((a,b)=>a.due-b.due); };

function supRows(list, sid, opts){ opts=opts||{};
  return `<div class="tbl-wrap" style="max-height:${opts.h||520}px"><table class="tbl"><thead><tr>${opts.check?`<th><input type="checkbox" checked data-ch="supAll" aria-label="${t('Tout sélectionner')}"></th>`:''}<th>${t('Commande')}</th><th>${t('Société de livraison')}</th><th>${t('Livrée le')}</th><th>${t('Encaissée le')}</th><th>${t('Produits (quantité × prix fournisseur)')}</th><th class="r">${t('Montant fournisseur')}</th><th>${t('État')}</th></tr></thead><tbody>
  ${list.length? list.map(o=>{ const st=supStateOf(o,sid); return `<tr>${opts.check?`<td><input type="checkbox" class="supChk" value="${o.id}" checked data-ch="supChk" aria-label="${o.ref}"></td>`:''}<td><b>${o.ref}</b></td><td class="small">${esc(kCarrierName(carrierOf(o)))}</td><td class="small">${o.times.delivered?fDate(o.times.delivered):'—'}</td><td class="small">${o.times.paid?fDate(o.times.paid):'—'}</td><td class="small">${o.items.filter(i=>supOf(i.pid)===sid).map(i=>`${i.q} × ${esc((PBY[i.pid]||{name:'?'}).name)} <span class="muted">@ ${dzd(i.cost||0)}</span>`).join('<br>')}</td><td class="r num"><b>${dzd(supShareOf(o,sid))}</b></td><td>${st? `<span class="badge ${SUP_STATE[st][1]}">${t(SUP_STATE[st][0])}</span>`:'—'}${st==='settled' && supPaidFor(o,sid)!=='—'?`<div class="xs muted">${esc(supPaidFor(o,sid))}</div>`:''}</td></tr>`; }).join('') : emptyRow(opts.check?8:7,'Aucune commande','check')}
  </tbody></table></div>`;
}
viewSuppliers = function(){
  if(!seesCost()) return erpShell('fournisseurs', t('Fournisseurs'), '', `<div class="lock-note">${ic('lock','sm')} ${t('Montants visibles par l\'Admin uniquement.')}</div>`);
  const u=S.ui.sup; if(!SUPPLIERS.some(s=>s.id===u.sid)) u.sid=(SUPPLIERS[0]||{}).id;
  const s=SUPPLIERS.find(x=>x.id===u.sid);
  const pills = `<div class="row wrap" style="gap:8px">${SUPPLIERS.map(x=>{ const b=supBalanceOf(x.id); return `<button class="kchip ${x.id===u.sid?'on':''}" data-a="supPick" data-v="${x.id}">${ic('factory','sm')} ${esc(x.name)} ${b.due? `<b>${dzd(b.due)}</b>`:''}</button>`; }).join('')}<button class="btn sm" data-a="supEdit" data-id="">${ic('plus','sm')} ${t('Ajouter un fournisseur')}</button></div>`;
  if(!s) return erpShell('fournisseurs', t('Fournisseurs'), '', card('', `<div class="card-b">${pills}</div>`));
  const os=supOrders(s.id), b=supBalanceOf(s.id), by=st=>os.filter(o=>supStateOf(o,s.id)===st);
  const lists = {due:by('due'), dhd:by('dhd'), road:by('road'), settled:by('settled').sort((a,b)=>(b.times.closed||0)-(a.times.closed||0))};
  const prods = PRODUCTS.filter(p=>supOf(p.id)===s.id && p.status!=='corbeille');
  const dues = supplierDues().filter(d=>lists.due.some(o=>o.id===d.orderId));
  const tabs = [['due','À régler',b.due],['dhd','En attente de paiement de la société de livraison',b.dhd],['road','En cours de livraison',b.road],['settled','Payé (validé)',null],['payments','Historique des paiements',null],['products','Produits ('+prods.length+')',null]];
  const inner = u.tab==='payments'? supPaymentsTable(false).replace(/<tbody>[\s\S]*<\/tbody>/, '<tbody>'+(SUP_PAYMENTS.filter(p=>(p.supplierId||1)===s.id).sort((a,b)=>b.at-a.at).map(p=>`<tr><td><b>${p.id}</b></td><td class="small">${fDT(p.at)}</td><td class="small">${t(p.mode)}</td><td class="r num">${p.orderIds.length}</td><td class="r num"><b>${dzd(p.amount)}</b></td><td>${p.confirmedAt?`<span class="badge green">${ic('check','sm')} ${fDate(p.confirmedAt)}</span>`:`<span class="badge amber">${t('En attente du fournisseur')}</span>`}</td><td><button class="btn sm" data-a="supPayView" data-id="${p.id}">${ic('eye','sm')} ${t('Détail')}</button></td></tr>`).join('') || emptyRow(7,'Aucun paiement'))+'</tbody>')
    : u.tab==='products'? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Produit')}</th><th class="r">${t('Prix d\'achat')}</th><th class="r">${t('Stock dispo')}</th><th class="r">${t('Vendus (livrés)')}</th></tr></thead><tbody>${prods.map(p=>`<tr><td><div class="row">${prodArt(p,30)}<b class="small">${esc(p.name)}</b></div></td><td class="r num">${dzd(p.cost||0)}</td><td class="r num">${stockInfo(p.id).available}</td><td class="r num">${ORDERS.filter(o=>DELIVERED_ST.includes(o.status)).reduce((n,o)=>n+o.items.filter(i=>i.pid===p.id).reduce((a,i)=>a+i.q,0),0)}</td></tr>`).join('') || emptyRow(4,'Aucun produit : choisissez ce fournisseur dans la colonne « Fournisseur » des produits','box')}</tbody></table></div>`
    : supRows(lists[u.tab]||[], s.id);
  const body = `${card('', `<div class="card-b">${pills}</div>`)}
    <div class="kpis">${kpi(t('À régler'), dzd(b.due), lists.due.length+' '+t('commandes encaissées'), 'accent')}${kpi(t('Attente société de livraison'), dzd(b.dhd), lists.dhd.length+' '+t('commandes livrées, argent pas encore reçu'))}${kpi(t('En cours de livraison'), dzd(b.road), lists.road.length+' '+t('colis en route'))}${kpi(t('Total déjà payé'), dzd(b.paid), SUP_PAYMENTS.filter(p=>(p.supplierId||1)===s.id).length+' '+t('paiements'))}${kpi(t('Prochaine échéance'), dues[0]? fDate(dues[0].due):'—', t('délai')+' J+'+(s.terms||SETTINGS.supplierTerms||7))}</div>
    <div class="g12">
      ${card(t('Fiche fournisseur'), `<div class="card-b col" style="gap:8px"><div class="row"><span class="avatar">${ic('factory','sm')}</span><div><b>${esc(s.name)}</b><div class="small muted">${esc(s.contact||'')}</div></div></div>${s.phone?`<div class="small row">${ic('phone','sm')} <span dir="ltr">${esc(s.phone)}</span></div>`:''}${s.email?`<div class="small row">${ic('mail','sm')} ${esc(s.email)}</div>`:''}${s.address?`<div class="small row">${ic('pin','sm')} ${esc(s.address)}</div>`:''}<div class="small"><b>${t('Conditions')} :</b> ${t('payé commande par commande, sous')} ${s.terms||7} ${t('jours après l\'encaissement')}</div><label class="check small"><input type="checkbox" ${SETTINGS.supplierSales?'checked':''} data-ch="supSales"> ${t('Partager « Ventes de mes produits » avec le fournisseur')}</label></div>`, `<button class="btn sm" data-a="supEdit" data-id="${s.id}">${ic('edit','sm')} ${t('Modifier')}</button>`)}
      ${card(t('Calcul automatique'), `<div class="card-b small" style="line-height:1.8">1. ${t('Chaque produit a son fournisseur (colonne « Fournisseur » des produits).')}<br>2. ${t('Commande livrée : la part de ce fournisseur passe « En attente de paiement de la société de livraison ».')}<br>3. ${t('Argent encaissé (société de livraison ou livreur) : la part passe « À régler ».')}<br>4. ${t('Vous payez : la part passe « Payé ». Une commande est clôturée quand tous ses fournisseurs sont payés.')}</div>`, `<button class="btn primary" data-a="payNew" ${lists.due.length?'':'disabled'}>${ic('cash','sm')} ${t('Payer')} ${esc(s.name)}</button>`)}
    </div>
    ${card('', `<div class="tabs">${tabs.map(([k,l,v])=>`<button class="${u.tab===k?'on':''}" data-a="supTab" data-v="${k}">${t(l)}${v!==null?` <span class="c">${dzd(v)}</span>`:''}</button>`).join('')}</div>${inner}`)}`;
  return erpShell('fournisseurs', t('Fournisseurs'), t('Chaque fournisseur est payé commande par commande, après l\'encaissement'), body);
};
ERP_VIEWS.admin.fournisseurs = ()=>viewSuppliers();
A.supPick = el=>{ S.ui.sup.sid=+el.dataset.v; render(); };
A.supEdit = el=>{
  const s=SUPPLIERS.find(x=>x.id===+el.dataset.id) || {id:0, name:'', contact:'', phone:'', email:'', address:'', terms:7};
  const f=(id,l,v,a)=>`<div class="field"><label>${t(l)}<input class="input" id="${id}" value="${esc(v||'')}" ${a||''}></label></div>`;
  openModal(modalTpl(s.id? t('Modifier le fournisseur') : t('Ajouter un fournisseur'), `<div class="grid2">${f('spN','Nom *',s.name)}${f('spC','Contact',s.contact)}${f('spP','Téléphone',s.phone,'dir="ltr"')}${f('spE','E-mail',s.email,'type="email"')}${f('spA','Adresse',s.address)}${f('spT','Délai de paiement (jours)',s.terms,'type="number" min="0"')}</div>`,
    `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="supSave" data-id="${s.id}">${t('Enregistrer')}</button>`));
};
A.supSave = el=>{ const name=val('spN').trim(); if(!name){ toast(t('Nom requis'),'bad'); return; }
  let s=SUPPLIERS.find(x=>x.id===+el.dataset.id); if(!s){ s={id:Math.max(0,...SUPPLIERS.map(x=>x.id))+1, ceiling:null}; SUPPLIERS.push(s); }
  Object.assign(s, {name, contact:val('spC').trim(), phone:val('spP').trim(), email:val('spE').trim(), address:val('spA').trim(), terms:+val('spT')||0});
  S.ui.sup.sid=s.id; closeModal(); log('Fournisseur enregistré', name, ''); toast(t('Fournisseur enregistré'),'ok'); render(); };
A.payNew = ()=>{ const sid=S.ui.sup.sid||1, s=SUPPLIERS.find(x=>x.id===sid)||{name:''}; const list=supOrders(sid).filter(o=>supStateOf(o,sid)==='due').sort((x,y)=>(x.times.paid||0)-(y.times.paid||0)); if(!list.length){ toast(t('Aucune commande à régler'),'bad'); return; }
  openModal(modalTpl(t('Payer le fournisseur')+' — '+esc(s.name), `<p class="small muted" style="margin-top:0">${t('Cochez les commandes que vous réglez. Le fournisseur reçoit le détail de chaque commande.')}</p>${supRows(list, sid, {check:true,h:340})}
    <div class="grid3" style="margin-top:12px"><div class="field"><label>${t('Montant à payer')}</label><div id="supTot" class="num" style="font-size:20px;font-weight:800">${dzd(list.reduce((n,o)=>n+supShareOf(o,sid),0))}</div></div><div class="field"><label for="pyM">${t('Mode')}</label><select class="select" id="pyM"><option value="Espèces">${t('Espèces')}</option><option value="Virement">${t('Virement')}</option><option value="CCP">CCP</option></select></div><div class="field"><label for="pyF">${t('Justificatif')}</label><input class="input" id="pyF" type="file"></div></div>
    <p class="xs muted">${t('Le montant sort de la Réserve fournisseur')} (${dzd(CBX.reserve? CBX.reserve.balance:0)}).</p>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn green" data-a="paySave">${ic('check','sm')} ${t('Valider le paiement')}</button>`, true)); };
CH.supChk = CH.supAll = el=>{ if(el.dataset.ch==='supAll') document.querySelectorAll('.supChk').forEach(x=>x.checked=el.checked); const sid=S.ui.sup.sid||1; const tot=[...document.querySelectorAll('.supChk:checked')].reduce((n,x)=>n+supShareOf(ORDERS.find(o=>o.id===+x.value),sid),0); const e=document.getElementById('supTot'); if(e) e.textContent=dzd(tot); };
A.paySave = ()=>{ const sid=S.ui.sup.sid||1, ids=[...document.querySelectorAll('.supChk:checked')].map(x=>+x.value); if(!ids.length){ toast(t('Cochez au moins une commande'),'bad'); return; }
  const os=ids.map(id=>ORDERS.find(o=>o.id===id)), amount=os.reduce((n,o)=>n+supShareOf(o,sid),0), mode=val('pyM'), f=document.getElementById('pyF').files[0], id='PF-'+String(101+SUP_PAYMENTS.length);
  const lines=os.map(o=>({orderId:o.id, ref:o.ref, deliveredAt:o.times.delivered, dhdPaidAt:o.times.paid, items:o.items.filter(i=>supOf(i.pid)===sid).map(it=>({pid:it.pid,q:it.q,cost:it.cost})), amount:supShareOf(o,sid)}));
  SUP_PAYMENTS.push({id, supplierId:sid, at:Date.now(), orderIds:ids, lines, amount, mode, proof:f?f.name:'justificatif_'+id+'.pdf', by:me().name, confirmedAt:null});
  os.forEach(o=>{ o.supPaid={...(o.supPaid||{}), [sid]:id}; if(o.status==='paid' && orderSups(o).every(x=>o.supPaid[x])){ o.supplierPaymentId=id; setStatus(o,'closed','Fournisseur payé ('+id+') — bénéfice figé'); } else hist(o,'Fournisseur payé', supName(sid)+' · '+id,'green'); });
  if(CBX.reserve) cashMove('reserve', -amount, 'Paiement fournisseur', id, supName(sid)+' · '+ids.length+' commandes');
  log('Paiement fournisseur', id, supName(sid)+' · '+dzd(amount)+' · '+ids.length+' commandes · '+mode);
  closeModal(); toast(t('Paiement validé')+' : '+dzd(amount),'ok'); render(); };

/* ============================================================
   FINANCE ET COMPTABILITÉ AUTOMATIQUES : le journal s'écrit tout seul à partir des événements réels
   (encaissements par société de livraison ou livreur, frais de livraison, retours, paiements
   fournisseurs, pub, dépenses). Aucune saisie : seules les dépenses hors ERP s'ajoutent à la main.
   ============================================================ */
/* l'ERP n'est plus lié à DHD : en français, « DHD » devient la société de livraison */
const _tDhd = t;
t = function(s){ const r=_tDhd(s); return S.lang==='fr' && typeof r==='string' && r.includes('DHD') ? r.replace(/(chez|par|à|de) DHD(?! Livraison)/g,'$1 la société de livraison').replace(/Entrées DHD prévues/g,'Encaissements prévus').replace(/(livreur|bureau|Bureau) DHD(?! Livraison)/g,'$1 de livraison').replace(/\bDHD\b(?! Livraison)/g,'transporteur') : r; };

journalEntries = function(){
  const E=[], day={};
  ORDERS.filter(o=>o.times && o.times.paid).forEach(o=>{ const c=carrierOf(o), k=dayStart(o.times.paid)+'|'+(c.id||'own'); const g=day[k]||(day[k]={at:o.times.paid, c, n:0, brut:0, fee:0, refs:[]}); g.n++; g.brut+=orderTotal(o); g.fee+=c.internal? 0 : dhdFeeOf(o); g.refs.push(o.ref); });
  Object.values(day).forEach(g=>{ const who=kCarrierName(g.c); E.push({at:g.at, cat:'Ventes', label:'Encaissement '+who+' — '+g.n+' colis ('+g.refs.slice(0,6).join(', ')+(g.refs.length>6?'…':'')+')', in:g.brut, out:0, auto:1}); if(g.fee) E.push({at:g.at, cat:'Frais de livraison', label:'Frais retenus par '+who+' — '+g.n+' colis', in:0, out:g.fee, auto:1}); });
  ORDERS.filter(o=>o.status==='returned').forEach(o=>E.push({at:o.times.returned||o.created, cat:'Retours', label:'Retour '+o.ref+' — frais aller-retour', in:0, out:dhdFeeOf(o)*2, auto:1}));
  COURIERS.forEach(cu=>{ const n=ORDERS.filter(o=>o.courierId===cu.id && DELIVERED_ST.includes(o.status) && o.times.delivered && o.times.delivered>dayStart(Date.now())-30*DAY).length; if(n && cu.perDelivery) E.push({at:Date.now(), cat:'Livreurs', label:'Rémunération '+cu.name+' — '+n+' livraisons (30 j)', in:0, out:n*cu.perDelivery, auto:1}); });
  SUP_PAYMENTS.forEach(p=>E.push({at:p.at, cat:'Achats fournisseur', label:'Paiement fournisseur '+p.id+' · '+supName(p.supplierId||1)+' ('+p.orderIds.length+' commandes, '+p.mode+')', in:0, out:p.amount, auto:1}));
  const byWeek={}; AD_SPEND.forEach(a=>{ const k=Math.floor((Date.now()-a.date)/(7*DAY)); byWeek[k]=(byWeek[k]||0)+a.usd; });
  Object.entries(byWeek).forEach(([k,usd])=>E.push({at:Date.now()-k*7*DAY-DAY, cat:'Pub Meta', label:'Meta Ads semaine −'+k+' ('+usd.toFixed(2)+' USD × '+SETTINGS.usdRate+')', in:0, out:Math.round(usd*SETTINGS.usdRate), auto:1}));
  EXPENSES.forEach(e=>E.push({at:e.at, cat:e.cat, label:e.note, in:0, out:e.amount}));
  return E.sort((a,b)=>b.at-a.at);
};
function tiersHtml(){
  const rows = SUPPLIERS.map(s=>[esc(s.name), t('Fournisseur — à payer'), -supBalanceOf(s.id).rest])
    .concat(CARRIERS.filter(c=>!c.internal && c.id).map(c=>[esc(c.name), t('Société de livraison — à recevoir (colis livrés non encaissés)'), ORDERS.filter(o=>o.status==='delivered' && carrierOf(o).id===c.id).reduce((s,o)=>s+orderTotal(o)-dhdFeeOf(o),0)]).filter(r=>r[2]))
    .concat(COURIERS.map(cu=>[esc(cu.name), t('Livreur — argent en main'), courierCash(cu.id)]).filter(r=>r[2]))
    .concat(AGENTS.map(a=>[esc(a.name), t('Agent — commissions du mois'), -agentPerf(a).commission]).filter(r=>r[2]));
  return `<div class="card-b small muted">${t('Soldes calculés automatiquement à partir des commandes, des encaissements et des paiements.')}</div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Tiers')}</th><th>${t('Nature')}</th><th class="r">${t('Solde')}</th></tr></thead><tbody>${rows.map(([n,k,v])=>`<tr><td><b>${n}</b></td><td>${k}</td><td class="r num ${v<0?'down':'up'}"><b>${dzd(Math.abs(v))}</b></td></tr>`).join('') || emptyRow(3,'Aucun solde')}</tbody></table></div>`;
}
const _viewAccounting = viewAccounting;
viewAccounting = function(){
  let h=_viewAccounting();
  if(S.ui.acc.tab==='tiers') h=h.replace(/(<div class="tabs">[\s\S]*?<\/div>)[\s\S]*?<\/section>/, (m,tabs)=>tabs+tiersHtml()+'</section>');
  if(S.ui.acc.tab==='journal') h=h.replace(/<span class="small muted">(\d+) [^<]*<\/span>/, (m,n)=>`<span class="small muted">${n} ${t('écritures')} · <span class="badge green">${ic('zap','sm')} ${t('générées automatiquement')}</span></span>`);
  return h;
};
ERP_VIEWS.admin.compta = ()=>viewAccounting();

/* ============================================================
   MENU DE L'ADMIN RÉORGANISABLE : glisser-déposer (ou flèches) des rubriques et des groupes.
   Ordre enregistré dans SETTINGS.menuOrder : ['g:Nom du groupe', 'dashboard', 'produits', …].
   ============================================================ */
const MENU_BASE = MENUS.admin.map(([g,items])=>[g, items.slice()]);
const menuItemsAll = () => Object.fromEntries(MENU_BASE.flatMap(g=>g[1]).concat(MENUS.admin.flatMap(g=>g[1])).map(i=>[i[0], i]));
function menuFlat(){ return MENUS.admin.flatMap(([g,items],i)=>[ ...(g||i? ['g:'+g] : []), ...items.map(x=>x[0]) ]); }
function applyMenuOrder(){
  const order=SETTINGS.menuOrder; if(!Array.isArray(order) || !order.length) return;
  const all=menuItemsAll(), seen=new Set(), groups=[['',[]]];
  order.forEach(k=>{ if(k.startsWith('g:')) groups.push([k.slice(2),[]]); else if(all[k] && !seen.has(k)){ groups[groups.length-1][1].push(all[k]); seen.add(k); } });
  Object.keys(all).filter(k=>!seen.has(k)).forEach(k=>groups[groups.length-1][1].push(all[k])); // rubriques ajoutées depuis : à la fin
  MENUS.admin.splice(0, MENUS.admin.length, ...groups.filter((g,i)=>g[1].length || g[0]));
}
const _erpShellMenu = erpShell;
erpShell = function(page, title, sub, body, actions){
  if(S.role!=='admin') return _erpShellMenu(page, title, sub, body, actions);
  applyMenuOrder();
  let h=_erpShellMenu(page, title, sub, body, actions);
  const ed=S.ui.menuEdit;
  if(ed){ // mode réorganisation : chaque ligne se déplace, les liens ne naviguent plus
    const all=menuItemsAll(), flat=menuFlat();
    const nav = flat.map((k,i)=>{ const isG=k.startsWith('g:'), it=all[k];
      return `<div class="mn-row ${isG?'mn-g':''}" draggable="true" data-mk="${esc(k)}"><span class="mn-grip" aria-hidden="true">${ic('drag','sm')}</span>${isG? `<input class="mn-gname" value="${esc(k.slice(2))}" data-mg="${i}" aria-label="${t('Nom du groupe')}">` : `${ic(it[1])}<span class="lbl">${t(it[2])}</span>`}<span class="mn-arr"><button data-a="mnMove" data-i="${i}" data-v="-1" aria-label="${t('Monter')}" ${i?'':'disabled'}>${ic('arrowU','sm')}</button><button data-a="mnMove" data-i="${i}" data-v="1" aria-label="${t('Descendre')}" ${i<flat.length-1?'':'disabled'}>${ic('arrowD','sm')}</button>${isG?`<button data-a="mnDelG" data-i="${i}" aria-label="${t('Supprimer le groupe')}">${ic('x','sm')}</button>`:''}</span></div>`; }).join('');
    h=h.replace(/<nav>[\s\S]*?<\/nav>/, ()=>`<nav class="mn-edit"><div class="mn-help">${t('Glissez les rubriques pour changer leur place.')}</div>${nav}<div class="mn-acts"><button class="btn sm" data-a="mnAddG">${ic('plus','sm')} ${t('Groupe')}</button><button class="btn sm" data-a="mnReset">${ic('refresh','sm')} ${t('Par défaut')}</button><button class="btn sm primary" data-a="mnDone">${ic('check','sm')} ${t('Terminer')}</button></div></nav>`);
  }
  return h.replace('<div class="foot">', `<div class="foot">${ed?'':`<button class="mn-start" data-a="mnStart">${ic('drag','sm')}<span class="lbl">${t('Réorganiser le menu')}</span></button>`}`);
};
const mnSave = flat=>{ SETTINGS.menuOrder=flat; render(); };
A.mnStart = ()=>{ S.ui.menuEdit=true; render(); };
A.mnDone = ()=>{ S.ui.menuEdit=false; toast(t('Menu enregistré'),'ok'); render(); };
A.mnReset = ()=>{ if(!confirm(t('Remettre le menu dans l\'ordre par défaut ?'))) return; delete SETTINGS.menuOrder; MENUS.admin.splice(0, MENUS.admin.length, ...MENU_BASE.map(([g,i])=>[g,i.slice()])); render(); };
A.mnMove = el=>{ const f=menuFlat(), i=+el.dataset.i, j=i+(+el.dataset.v); [f[i],f[j]]=[f[j],f[i]]; mnSave(f); };
A.mnAddG = ()=>{ mnSave(menuFlat().concat('g:'+t('Nouveau groupe'))); };
A.mnDelG = el=>{ const f=menuFlat(); f.splice(+el.dataset.i,1); mnSave(f); };
document.addEventListener('change', e=>{ const el=e.target.closest('[data-mg]'); if(!el) return; const f=menuFlat(); f[+el.dataset.mg]='g:'+el.value.trim(); mnSave(f); });
let mnDrag=null;
document.addEventListener('dragstart', e=>{ const r=e.target.closest && e.target.closest('.mn-row'); if(!r) return; mnDrag=r.dataset.mk; e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain', mnDrag); r.classList.add('dragging'); });
document.addEventListener('dragover', e=>{ const r=e.target.closest && e.target.closest('.mn-row'); if(!r || !mnDrag) return; e.preventDefault(); document.querySelectorAll('.mn-row.over-top,.mn-row.over-bot').forEach(x=>x.classList.remove('over-top','over-bot')); const b=r.getBoundingClientRect(); r.classList.add(e.clientY < b.top+b.height/2? 'over-top':'over-bot'); });
document.addEventListener('drop', e=>{ const r=e.target.closest && e.target.closest('.mn-row'); if(!r || !mnDrag) return; e.preventDefault(); const f=menuFlat().filter(k=>k!==mnDrag); let j=f.indexOf(r.dataset.mk); if(j<0) j=f.length; else if(r.classList.contains('over-bot')) j++; f.splice(j,0,mnDrag); mnDrag=null; mnSave(f); });
document.addEventListener('dragend', ()=>{ mnDrag=null; document.querySelectorAll('.mn-row').forEach(x=>x.classList.remove('dragging','over-top','over-bot')); });

/* ============================================================
   COMMANDES : historique visible, raccourci « fiche d'appel », annulation d'envoi complète
   ============================================================ */
KCOLS.conf.splice(KCOLS.conf.findIndex(c=>c[0]==='actions'), 0, ['history','Historique',1]);
KCOLS.track.splice(KCOLS.track.findIndex(c=>c[0]==='actions'), 0, ['history','Historique',1]);
function histCell(o){ const h=o.history[o.history.length-1]; if(!h) return '<span class="muted">—</span>';
  return `<button class="khist" data-a="kTimeline" data-id="${o.id}" title="${t('Voir tout l\'historique')}"><span class="khist-a">${esc(t(h.action))}</span><span class="khist-m">${ago(h.at)} · ${esc(String(t(h.who)).split(' ')[0])} · ${o.history.length} ${t('étapes')}</span></button>`; }
const callBtn = o => `<button class="kico kcall" data-a="kCall" data-id="${o.id}" title="${t('Fiche d\'appel')}" aria-label="${t('Fiche d\'appel')}">${ic('headset','sm')}</button>`;
const _kConfCellH = kConfCell;
kConfCell = (o,c)=> c.key==='history'? histCell(o) : c.key==='actions'? _kConfCellH(o,c).replace('<div class="kacts">', '<div class="kacts">'+callBtn(o)) : _kConfCellH(o,c);
const _kTrackCellH = kTrackCell;
kTrackCell = (o,c)=> c.key==='history'? histCell(o) : _kTrackCellH(o,c);
/* historique complet : chronologie avec auteur, date et note */
A.kTimeline = el=>{
  const o=ORDERS.find(x=>x.id===+el.dataset.id); if(!o) return; const c=CBY[o.customerId]||{};
  openModal(modalTpl(t('Historique de la commande')+' · '+esc(o.ref), `<div class="khead"><b>${esc(c.name||'—')}</b><span class="muted small" dir="ltr">${esc(c.phone||'')}</span><span class="kpill" style="${kPillStyle(kColor(o))}">${esc(kLabel(o))}</span></div>
    ${kHistList(o)}`,
    `<button class="btn" data-a="closeModal">${t('Fermer')}</button>${kCanConf(o) && PRE_ST.includes(o.status)? `<button class="btn primary" data-a="kCall" data-id="${o.id}">${ic('headset','sm')} ${t('Fiche d\'appel')}</button>`:''}`));
};
/* annuler l'envoi : le colis est supprimé chez la société de livraison, la commande revient
   dans « Commandes à confirmer » avec le statut de départ (En attente) */
async function cancelShipment(o){
  if(!kCancellable(o)) return false;
  if(carrierHasApi(carrierOf(o)) && o.tracking){
    try{ await api('carrier.cancel', {orderId:o.id}); await syncNow(); }
    catch(e){ if(!confirm(o.ref+' — '+e.message+'\n\n'+t('Annuler quand même dans l\'ERP ? Le colis restera à supprimer dans l\'espace de la société de livraison.'))) return false; }
  }
  expand(o.items).forEach(i=>{ const p=PBY[i.pid]; if(!p) return; if(p.variants && i.v){ const v=p.variants.find(x=>x.id===i.v); if(v) v.stock+=i.q; } else p.stock+=i.q; stockMove(i.pid,'retour',i.q,o.ref,'Envoi annulé'); });
  const was=kCarrierName(carrierOf(o));
  o.tracking=''; o.label=''; o.trackUrl=''; o.parcels=null; o.courierId=null; o.cashWithCourier=false; delete o.feeFixed; delete o.dhdFixed; ['sent','picked','transit','outfor','failed','toprep','ready','confirmed'].forEach(k=>delete o.times[k]);
  const pend=kList('conf').find(x=>x.kind==='pending'); o.confStatus = pend? pend.id : ''; o.unreachN=0; o.nextCall=null; o.cancelReason=''; o.statusNote=''; o.lockedBy=null; delete o.prevStatus;
  o.status='calling'; setStatus(o,'new', t('Envoi annulé et supprimé chez')+' '+was+' — '+t('retour aux commandes à confirmer'));
  o.history[o.history.length-1].color='red';
  return true;
}
A.kCancelShipGo = async el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); closeModal(); if(await cancelShipment(o)) toast(o.ref+' : '+t('envoi annulé, commande remise « En attente » dans Commandes à confirmer'),'ok'); render(); };
A.kCancelSel = async()=>{ const u=S.ui.kt; let n=0; for(const o of ORDERS.filter(o=>u.sel.has(o.id))){ if(await cancelShipment(o)) n++; } u.sel.clear(); toast(n+' '+t('envoi(s) annulé(s)'), n?'ok':'bad'); render(); };
A.kCancelShip = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); if(!kCanShip()) return; if(!kCancellable(o)){ toast(t('Envoi impossible à annuler à cette étape'),'bad'); return; }
  const api_=carrierHasApi(carrierOf(o)) && o.tracking;
  openModal(modalTpl(t('Annuler l\'envoi')+' · '+esc(o.ref), `<ul class="small" style="margin:0;padding-inline-start:18px;line-height:1.8"><li>${api_? t('Le colis est supprimé chez')+' <b>'+esc(kCarrierName(carrierOf(o)))+'</b>' : t('Le numéro de suivi est retiré de la commande')}</li><li>${t('La commande revient dans « Commandes à confirmer » avec le statut « En attente »')}</li><li>${t('Le stock est réintégré')}</li></ul>`,
    `<button class="btn" data-a="closeModal">${t('Garder l\'envoi')}</button><button class="btn red" data-a="kCancelShipGo" data-id="${o.id}">${ic('undo','sm')} ${t('Annuler l\'envoi')}</button>`)); };
