"use strict";
/* ============================================================
   Éditeur de pages de la boutique.
   - Chaque élément affiché reçoit un repère stable data-pe (son chemin dans la page d'origine) :
     m.0.2 = 3e enfant du 1er enfant de <main>, h = en-tête, n = menu, c = catégories, f = pied de page.
   - Réglages : SETTINGS.site.pages[portée] = {styles:{id:{prop:valeur}}, anim:{id:{type,dur,delay}}, ops:[déplacements, blocs]}
     portée = 'global' (en-tête, menu, pied de page) ou la page (home, shop, product, cart, contact, cgv, confirm).
   - L'éditeur (ERP › Boutique › Pages) affiche la page dans un cadre ; le cadre envoie l'élément cliqué,
     l'éditeur renvoie les réglages modifiés. Seul l'éditeur enregistre.
   ============================================================ */
const PE_PAGES = [['home','Accueil','#/'],['shop','Boutique (liste des produits)','#/boutique'],['product','Fiche produit','#/produit/'],['cart','Panier et formulaire','#/panier'],['contact','Contact','#/contact'],['cgv','Conditions générales de vente','#/cgv']];
const PE_ROOTS = [['h','header.shop-h'],['n','nav.nav'],['c','.catbar'],['m','#main'],['f','footer.footer']];
const PE_FONTS = ['Inter','Cairo','Tajawal','Poppins','Montserrat','Roboto','Open Sans','Oswald','Playfair Display','Lora','Merriweather','Georgia','Arial'];
const PE_GOOGLE = new Set(['Tajawal','Poppins','Montserrat','Roboto','Open Sans','Oswald','Playfair Display','Lora','Merriweather']);
const PE_ANIMS = [['','Aucune'],['fade','Fondu'],['up','Monte'],['down','Descend'],['left','Arrive de la gauche'],['right','Arrive de la droite'],['zoom','Zoom'],['pop','Rebond']];
const PE_PROPS = ['font-family','font-size','font-weight','font-style','text-transform','text-decoration','line-height','letter-spacing','text-align','color','background-color','background-image','background-size','background-position','border-width','border-style','border-color','border-radius','box-shadow','opacity','margin-top','margin-bottom','padding-top','padding-bottom','padding-left','padding-right','max-width','min-height','display','gap'];
const pePageKey = () => { const p=route().parts[0]||''; return {'':'home', boutique:'shop', categorie:'shop', recherche:'shop', produit:'product', panier:'cart', contact:'contact', cgv:'cgv', confirmation:'confirm'}[p] || p; };
const isObj = o => o && typeof o==='object' && !Array.isArray(o);
const peData = () => { const s=site(); if(!isObj(s.pages)) s.pages={}; return s.pages; };
const peScope = (sc) => { const d=peData(); if(!isObj(d[sc])) d[sc]={}; const v=d[sc]; if(!isObj(v.styles)) v.styles={}; if(!isObj(v.anim)) v.anim={}; if(!Array.isArray(v.ops)) v.ops=[]; return v; };
const peCssVal = v => String(v??'').replace(/[<>{};\\]/g,'').slice(0,160);

/* ---------- repères, déplacements et blocs, appliqués à chaque affichage ---------- */
function peStamp(el, id){ el.setAttribute('data-pe', id); if(el.tagName==='svg') return; const k=el.children; for(let i=0;i<k.length;i++) peStamp(k[i], id+'.'+i); }
function peBlockHtml(b){
  const st = b.type==='spacer'? `style="height:${Math.max(4,Math.min(400,+b.h||40))}px"` : '';
  if(b.type==='heading') return `<h2 class="pe-blk-h">${esc(b.text||'')}</h2>`;
  if(b.type==='text') return `<div class="pe-blk-t">${esc(b.text||'').replace(/\n/g,'<br>')}</div>`;
  if(b.type==='button') return `<div class="pe-blk-b"><a class="btn primary lg" href="${esc(/^(#|https?:|tel:|mailto:)/.test(b.link||'')? b.link : '#/')}">${esc(b.text||'')}</a></div>`;
  if(b.type==='image') return b.src? `<div class="pe-blk-i">${b.link? `<a href="${esc(/^(#|https?:)/.test(b.link)? b.link:'#/')}">`:''}<img src="${esc(b.src)}" alt="${esc(b.alt||'')}" loading="lazy">${b.link?'</a>':''}</div>` : `<div class="pe-blk-i pe-empty">${t('Image')}</div>`;
  if(b.type==='video'){ const em=ytEmbed(b.url||''); return em? `<div class="pe-blk-v"><iframe src="${em}" allowfullscreen loading="lazy"></iframe></div>` : `<div class="pe-blk-i pe-empty">${t('Vidéo YouTube')}</div>`; }
  return `<div class="pe-blk-s" ${st}></div>`;
}
function peApply(){
  const app=document.getElementById('app'); if(!app || route().parts[0]==='erp'){ document.body.removeAttribute('data-pg'); return; }
  const d=(SETTINGS.site||{}).pages||{}, pg=pePageKey();
  document.body.setAttribute('data-pg', pg);
  if(!Object.keys(d).length && !PE.preview){ peCss(); return; }
  PE_ROOTS.forEach(([k,sel])=>{ const r=app.querySelector(sel); if(r) peStamp(r,k); });
  ['global',pg].forEach(sc=>((d[sc]||{}).ops||[]).forEach(op=>{
    const el=app.querySelector(`[data-pe="${op.id||op.after}"]`); if(!el) return;
    if(op.op==='move'){ const sib = op.dir<0? el.previousElementSibling : el.nextElementSibling; if(sib) op.dir<0? sib.before(el) : sib.after(el); }
    if(op.op==='block'){ const w=document.createElement('div'); w.className='pe-blk'; w.innerHTML=peBlockHtml(op); el.after(w); peStamp(w,'b'+op.bid); }
  }));
  peCss(); peAnimate();
}
let peCssCache='';
function peCss(){
  const d=(SETTINGS.site||{}).pages||{}, out=[], anim=[], fonts=new Set();
  Object.entries(d).forEach(([sc,v])=>{
    const pre = sc==='global'? '' : `body[data-pg="${sc}"] `;
    Object.entries(v.styles||{}).forEach(([id,st])=>{
      const sel=pre+`[data-pe="${id}"]`, decl=[], mob=[], desk=[];
      Object.entries(st).forEach(([k,val])=>{
        if(k==='hideMobile'){ if(val) mob.push('display:none!important'); return; } if(k==='hideDesktop'){ if(val) desk.push('display:none!important'); return; }
        if(!PE_PROPS.includes(k) || val==='' || val==null) return;
        if(k==='background-image'){ if(/^uploads\/[\w.-]+$/.test(val)) decl.push(`background-image:url("${val}")!important;background-size:cover;background-position:center`); return; }
        if(k==='font-family'){ fonts.add(val); decl.push(`font-family:"${peCssVal(val)}",Inter,Cairo,sans-serif!important`); return; }
        decl.push(`${k}:${peCssVal(val)}!important`);
      });
      if(decl.length) out.push(`${sel}{${decl.join(';')}}`);
      if(mob.length) out.push(`@media (max-width:760px){${sel}{${mob.join(';')}}}`);
      if(desk.length) out.push(`@media (min-width:761px){${sel}{${desk.join(';')}}}`);
    });
    Object.entries(v.anim||{}).forEach(([id,a])=>{ if(a && a.type) anim.push(`body.pe-anim ${pre}[data-pe="${id}"]{animation:pe-${a.type} ${+a.dur||700}ms cubic-bezier(.16,1,.3,1) ${+a.delay||0}ms both;animation-play-state:paused}body.pe-anim ${pre}[data-pe="${id}"].pe-seen{animation-play-state:running}`); });
  });
  const css = out.join('\n') + (anim.length? `\n@media (prefers-reduced-motion:no-preference){${anim.join('\n')}}` : '');
  if(css!==peCssCache){ peCssCache=css; let el=document.getElementById('pe-css'); if(!el){ el=document.createElement('style'); el.id='pe-css'; document.head.appendChild(el); } el.textContent=css; }
  const g=[...fonts].filter(f=>PE_GOOGLE.has(f)).sort(), href = g.length? 'https://fonts.googleapis.com/css2?'+g.map(f=>'family='+f.replace(/ /g,'+')+':ital,wght@0,300;0,400;0,600;0,700;0,800;1,400').join('&')+'&display=swap' : '';
  let lk=document.getElementById('pe-fonts'); if(href && (!lk || lk.getAttribute('href')!==href)){ if(!lk){ lk=document.createElement('link'); lk.id='pe-fonts'; lk.rel='stylesheet'; document.head.appendChild(lk); } lk.setAttribute('href', href); }
}
/* animations : jouées une fois quand la page change, à l'entrée de chaque élément dans l'écran */
let peLastPath=null, peIO=null;
function peAnimate(force){
  const path=location.hash.split('?')[0];
  if(path===peLastPath && !force){ document.body.classList.remove('pe-anim'); return; }
  peLastPath=path; if(peIO) peIO.disconnect();
  document.body.classList.add('pe-anim');
  if(!('IntersectionObserver' in window)){ document.querySelectorAll('[data-pe]').forEach(e=>e.classList.add('pe-seen')); return; }
  peIO=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('pe-seen'); peIO.unobserve(e.target); } }), {rootMargin:'0px 0px -8% 0px'});
  const d=(SETTINGS.site||{}).pages||{}, pg=pePageKey();
  ['global',pg].forEach(sc=>Object.keys((d[sc]||{}).anim||{}).forEach(id=>document.querySelectorAll(`[data-pe="${id}"]`).forEach(el=>peIO.observe(el))));
}
const _renderPe = render;
render = function(){ _renderPe(); peApply(); if(PE.preview) peMark(); };

/* ============================================================
   CÔTÉ APERÇU (dans le cadre de l'éditeur) : on clique un élément, l'éditeur reçoit sa fiche
   ============================================================ */
const PE = {preview: window.name==='pe-preview' && window.top!==window, sel:null};
if(PE.preview){
  document.documentElement.classList.add('pe-preview');
  syncNow = async()=>{}; queueSync = ()=>{}; // l'aperçu n'enregistre rien : seul l'éditeur enregistre
  document.addEventListener('click', e=>{
    if(e.target.closest('#ov')) return;
    e.preventDefault(); e.stopPropagation();
    const el=e.target.closest('[data-pe]'); if(el) peSelect(el);
  }, true);
  document.addEventListener('submit', e=>e.preventDefault(), true);
  /* passerelle appelée directement par l'éditeur (même site) */
  window.peBridge = {
    site(json){ SETTINGS.site=JSON.parse(json); peCssCache=null; render(); },
    nav(hash){ PE.sel=null; location.hash=hash; },
    parent(){ if(!PE.sel) return; const el=document.querySelector(`[data-pe="${PE.sel}"]`), p=el && el.parentElement && el.parentElement.closest('[data-pe]'); if(p) peSelect(p); },
    replay(){ peLastPath=null; peAnimate(true); }
  };
}
function peLabel(el){ const tag=el.tagName.toLowerCase(), cls=[...el.classList].filter(c=>!c.startsWith('pe-'))[0];
  const names={h1:'Titre principal',h2:'Titre',h3:'Sous-titre',h4:'Petit titre',p:'Paragraphe',a:'Lien',button:'Bouton',img:'Image',section:'Section',header:'En-tête',footer:'Pied de page',nav:'Menu',main:'Contenu',ul:'Liste',li:'Élément de liste',span:'Texte',b:'Texte en gras',strong:'Texte en gras',form:'Formulaire',label:'Libellé',input:'Champ',select:'Liste',article:'Carte',svg:'Icône'};
  return t(names[tag] || (el.classList.contains('pe-blk')? 'Bloc ajouté' : 'Bloc'))+(cls? ' · '+cls : ''); }
function peSelect(el){
  PE.sel=el.dataset.pe; peMark();
  const own=[...el.childNodes].filter(n=>n.nodeType===3 && n.nodeValue.trim()).map(n=>n.nodeValue.trim()).join(' ');
  const txt = own || (el.children.length<=1 && el.textContent.trim().length<300? el.textContent.trim() : '');
  const blk = el.closest('.pe-blk'); const cs=getComputedStyle(el);
  if(window.parent.peOnSelect) window.parent.peOnSelect({id:el.dataset.pe, page:pePageKey(), label:peLabel(el), tag:el.tagName.toLowerCase(), text:txt, key: txt && TSEEN.get(txt) || '', block: blk? blk.dataset.pe.slice(1) : '',
    prev:!!el.previousElementSibling, next:!!el.nextElementSibling, cur:{color:cs.color, bg:cs.backgroundColor, size:cs.fontSize, weight:cs.fontWeight, family:cs.fontFamily.split(',')[0].replace(/"/g,''), align:cs.textAlign}});
}
function peMark(){ document.querySelectorAll('.pe-selected').forEach(x=>x.classList.remove('pe-selected')); if(PE.sel){ const el=document.querySelector(`[data-pe="${PE.sel}"]`); if(el) el.classList.add('pe-selected'); } }

/* ============================================================
   CÔTÉ ÉDITEUR (ERP › Boutique › Pages) : plein écran, en dehors du rendu de l'ERP pour garder l'aperçu chargé
   ============================================================ */
const PED = {page:'home', device:'desk', sel:null, undo:[], redo:[]};
function pedFrame(){ return document.getElementById('pe-frame'); }
function pedPost(m){ const w=pedFrame() && pedFrame().contentWindow, b=w && w.peBridge;  if(!b) return; if(m.pe==='site') b.site(JSON.stringify(SETTINGS.site||{})); else if(m.pe==='nav') b.nav(m.hash); else if(m.pe==='parent') b.parent(); else if(m.pe==='replay') b.replay(); }
function pedSend(){ pedPost({pe:'site', site:JSON.parse(JSON.stringify(SETTINGS.site||{}))}); }
function pedSnap(){ PED.undo.push(JSON.stringify(SETTINGS.site||{})); if(PED.undo.length>60) PED.undo.shift(); PED.redo=[]; }
function pedCommit(){ queueSync(); pedSend(); }
function pedHash(pg){ const p=PE_PAGES.find(x=>x[0]===pg)||PE_PAGES[0]; return p[0]==='product'? p[2]+((PRODUCTS.find(x=>x.status==='actif')||{}).id||1) : p[2]; }
A.peOpen = el=>{
  PED.page=el.dataset.v||'home'; PED.sel=null; PED.undo=[]; PED.redo=[];
  let root=document.getElementById('pe-root'); if(root) root.remove();
  root=document.createElement('div'); root.id='pe-root'; root.setAttribute('role','dialog'); root.setAttribute('aria-label', t('Éditeur de pages'));
  root.innerHTML = `<div class="pe-top"><b class="pe-brand">${ic('edit','sm')} ${t('Éditeur de pages')}</b>
    <select class="pe-pagesel" id="pePage" aria-label="${t('Page')}">${PE_PAGES.map(([k,l])=>`<option value="${k}" ${k===PED.page?'selected':''}>${t(l)}</option>`).join('')}</select>
    <div class="pe-devs" role="group" aria-label="${t('Appareil')}">${[['desk','Ordinateur','dash'],['tab','Tablette','grid'],['mob','Mobile','phone']].map(([k,l,i])=>`<button data-a="peDev" data-v="${k}" class="${PED.device===k?'on':''}" title="${t(l)}" aria-label="${t(l)}">${ic(i,'sm')}</button>`).join('')}</div>
    <span class="grow"></span><button class="pe-tb" data-a="peUndo" title="${t('Annuler')} (Ctrl+Z)">${ic('undo','sm')} ${t('Annuler')}</button><button class="pe-tb" data-a="peRedo" title="${t('Rétablir')} (Ctrl+Y)">${ic('refresh','sm')} ${t('Rétablir')}</button>
    <a class="pe-tb" href="${pedHash(PED.page)}" target="_blank" rel="noopener">${ic('eye','sm')} ${t('Voir')}</a><button class="pe-tb pe-done" data-a="peClose">${ic('check','sm')} ${t('Terminer')}</button></div>
  <div class="pe-body"><div class="pe-stage"><iframe id="pe-frame" name="pe-preview" title="${t('Aperçu de la page')}" class="dev-${PED.device}" src="./${pedHash(PED.page)}"></iframe></div><aside class="pe-panel" id="pe-panel"></aside></div>`;
  document.body.appendChild(root); document.body.classList.add('pe-lock');
  pedFrame().addEventListener('load', pedSend);
  pedPanel();
};
A.peClose = ()=>{ const r=document.getElementById('pe-root'); if(r) r.remove(); document.body.classList.remove('pe-lock'); queueSync(); render(); };
A.peDev = el=>{ PED.device=el.dataset.v; pedFrame().className='dev-'+PED.device; document.querySelectorAll('.pe-devs button').forEach(b=>b.classList.toggle('on', b.dataset.v===PED.device)); };
A.peUndo = ()=>{ if(!PED.undo.length) return; PED.redo.push(JSON.stringify(SETTINGS.site||{})); SETTINGS.site=JSON.parse(PED.undo.pop()); pedCommit(); pedPanel(); };
A.peRedo = ()=>{ if(!PED.redo.length) return; PED.undo.push(JSON.stringify(SETTINGS.site||{})); SETTINGS.site=JSON.parse(PED.redo.pop()); pedCommit(); pedPanel(); };
document.addEventListener('keydown', e=>{ if(!document.getElementById('pe-root') || !(e.ctrlKey||e.metaKey) || /INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||'')) return; if(e.key==='z'){ e.preventDefault(); A.peUndo(); } if(e.key==='y'){ e.preventDefault(); A.peRedo(); } });
document.addEventListener('change', e=>{ if(e.target.id==='pePage'){ PED.page=e.target.value; PED.sel=null; pedPost({pe:'nav', hash:pedHash(PED.page)}); pedPanel(); } });
window.peOnSelect = d=>{ if(!document.getElementById('pe-root')) return; PED.sel=JSON.parse(JSON.stringify(d)); pedPanel(); };

/* portée de l'élément choisi : en-tête, menu, pied de page = toutes les pages ; un bloc ajouté = la portée où il vit */
function pedScopeOf(s){ if(!s) return null; if(s.block){ const d=peData(); return Object.keys(d).find(k=>(d[k].ops||[]).some(o=>o.bid===s.block)) || s.page; } return /^[hncf](\.|$)/.test(s.id)? 'global' : s.page; }
const pedStyle = () => { const s=PED.sel, sc=peScope(pedScopeOf(s)); return sc.styles[s.id]||{}; };
function pedSetStyle(k, v, live){ const s=PED.sel; if(!s) return; if(!live) pedSnap(); const sc=peScope(pedScopeOf(s)); const st=sc.styles[s.id]={...(sc.styles[s.id]||{})}; if(v===''||v==null||v===false) delete st[k]; else st[k]=v; if(!Object.keys(st).length) delete sc.styles[s.id]; pedCommit(); }

function pedPanel(){
  const p=document.getElementById('pe-panel'); if(!p) return; const s=PED.sel;
  if(!s){ p.innerHTML = `<div class="pe-empty-panel">${ic('edit','lg')}<b>${t('Cliquez sur un élément de la page')}</b><span>${t('Texte, titre, bouton, image, section, en-tête ou pied de page : vous pourrez changer son texte, sa police, sa taille, ses couleurs, ses marges, son animation et sa place.')}</span>
    <div class="pe-tips"><div>${ic('arrowU','sm')} ${t('« Parent » pour choisir le bloc qui contient l\'élément')}</div><div>${ic('plus','sm')} ${t('« Ajouter un bloc » : titre, texte, bouton, image, vidéo, espace')}</div><div>${ic('undo','sm')} ${t('Ctrl+Z pour annuler')}</div></div></div>`; return; }
  const st=pedStyle(), sc=pedScopeOf(s), an=(peScope(sc).anim||{})[s.id]||{}, blk = s.block && (peScope(sc).ops||[]).find(o=>o.bid===s.block && o.op==='block');
  const num=(k,label,unit,min,max,step)=>{ const v=parseFloat(st[k]); return `<label class="pe-f"><span>${t(label)}</span><span class="pe-num"><input type="number" data-pes="${k}" data-unit="${unit}" value="${isNaN(v)?'':v}" min="${min}" max="${max}" step="${step||1}" placeholder="—"><i>${unit}</i></span></label>`; };
  const sel=(k,label,opts)=>`<label class="pe-f"><span>${t(label)}</span><select data-pes="${k}">${opts.map(([v,l])=>`<option value="${esc(v)}" ${String(st[k]||'')===String(v)?'selected':''}>${t(l)}</option>`).join('')}</select></label>`;
  const col=(k,label,cur)=>`<label class="pe-f"><span>${t(label)}</span><span class="pe-col"><input type="color" data-pes="${k}" value="${esc(pedHex(st[k]||cur||'#000000'))}"><button data-a="pedClear" data-k="${k}" title="${t('Par défaut')}" aria-label="${t('Par défaut')}" ${st[k]?'':'disabled'}>${ic('x','sm')}</button></span></label>`;
  const seg=(k,opts)=>`<div class="pe-seg">${opts.map(([v,l,i])=>`<button data-a="pedSet" data-k="${k}" data-v="${v}" class="${(st[k]||'')===v?'on':''}" title="${t(l)}" aria-label="${t(l)}">${i?ic(i,'sm'):t(l)}</button>`).join('')}</div>`;
  const grp=(title, body, open)=>`<details class="pe-grp" ${open?'open':''}><summary>${t(title)}</summary><div class="pe-grp-b">${body}</div></details>`;
  const textBox = blk? pedBlockForm(blk) : s.key? `<label class="pe-f col"><span>${t('Texte')} (${S.lang.toUpperCase()})</span><textarea id="pedText" rows="3" ${S.lang==='ar'?'dir="rtl"':''}>${esc(s.text)}</textarea></label><div class="row" style="gap:6px"><button class="btn sm primary" data-a="pedTextSave">${ic('check','sm')} ${t('Enregistrer le texte')}</button>${((site().texts||{})[S.lang]||{})[s.key]? `<button class="btn sm" data-a="pedTextReset">${t('Texte d\'origine')}</button>`:''}</div>`
    : s.text? `<p class="pe-note">${t('Ce texte vient d\'une fiche (produit, catégorie, slide, entreprise) : modifiez-le dans l\'ERP.')}</p>` : '';
  p.innerHTML = `<div class="pe-head"><div><small>${esc(sc==='global'? t('Toutes les pages') : t((PE_PAGES.find(x=>x[0]===sc)||[0,sc])[1]))}</small><b>${esc(s.label)}</b></div>
    <div class="pe-acts"><button data-a="pedParent" title="${t('Sélectionner le bloc parent')}">${ic('arrowU','sm')} ${t('Parent')}</button><button data-a="pedMove" data-v="-1" ${s.prev?'':'disabled'} title="${t('Monter')}" aria-label="${t('Monter')}">${ic('arrowU','sm')}</button><button data-a="pedMove" data-v="1" ${s.next?'':'disabled'} title="${t('Descendre')}" aria-label="${t('Descendre')}">${ic('arrowD','sm')}</button><button data-a="pedHide" class="${st.display==='none'?'on':''}" title="${t('Masquer')}" aria-label="${t('Masquer')}">${ic('eye','sm')}</button>${blk?`<button data-a="pedBlkDel" title="${t('Supprimer le bloc')}" aria-label="${t('Supprimer le bloc')}">${ic('trash','sm')}</button>`:''}<button data-a="pedReset" title="${t('Réinitialiser le style')}" aria-label="${t('Réinitialiser le style')}">${ic('refresh','sm')}</button></div></div>
  <div class="pe-scroll">
    ${textBox? grp('Contenu', textBox, true):''}
    ${grp('Ajouter un bloc après', `<div class="pe-addgrid">${[['heading','Titre','hash'],['text','Texte','file'],['button','Bouton','zap'],['image','Image','upload'],['video','Vidéo','globe'],['spacer','Espace','layers']].map(([k,l,i])=>`<button data-a="pedAdd" data-v="${k}">${ic(i,'sm')}<span>${t(l)}</span></button>`).join('')}</div>`)}
    ${grp('Typographie', `${sel('font-family','Police',[['','Par défaut'],...PE_FONTS.map(f=>[f,f])])}<div class="pe-2">${num('font-size','Taille','px',8,120)}${sel('font-weight','Graisse',[['','—'],['300','Fine'],['400','Normale'],['600','Demi-gras'],['700','Gras'],['800','Très gras'],['900','Noir']])}</div>
      <div class="pe-2">${num('line-height','Interligne','',0.8,3,0.05)}${num('letter-spacing','Espacement','px',-3,20,0.5)}</div>
      ${col('color','Couleur du texte', s.cur.color)}
      <div class="pe-f"><span>${t('Alignement')}</span>${seg('text-align',[['left','Gauche','alignL'],['center','Centre','alignC'],['right','Droite','alignR'],['justify','Justifié','listUl']])}</div>
      <div class="pe-f"><span>${t('Style')}</span>${seg('font-style',[['','Normal'],['italic','Italique']])}${seg('text-transform',[['','Aa'],['uppercase','AA'],['lowercase','aa'],['capitalize','Ab']])}${seg('text-decoration',[['','—'],['underline','Souligné'],['line-through','Barré']])}</div>`, !blk && !!s.key)}
    ${grp('Fond et bordure', `${col('background-color','Couleur de fond', s.cur.bg)}
      <div class="pe-f"><span>${t('Image de fond')}</span><div class="row" style="gap:6px"><button class="btn sm" data-a="pedBg">${ic('upload','sm')} ${t(st['background-image']?'Changer':'Ajouter')}</button>${st['background-image']?`<button class="btn sm ghost" data-a="pedClear" data-k="background-image">${t('Retirer')}</button>`:''}</div></div>
      <div class="pe-2">${num('border-width','Bordure','px',0,20)}${num('border-radius','Arrondi','px',0,200)}</div>
      ${col('border-color','Couleur de bordure','#E3E6EB')}
      ${sel('box-shadow','Ombre',[['','Aucune'],['0 2px 8px rgba(18,25,32,.08)','Légère'],['0 8px 24px rgba(18,25,32,.12)','Moyenne'],['0 18px 48px rgba(18,25,32,.18)','Forte']])}
      ${num('opacity','Opacité','',0,1,0.05)}`)}
    ${grp('Espacements et taille', `<div class="pe-2">${num('margin-top','Marge haut','px',-200,400)}${num('margin-bottom','Marge bas','px',-200,400)}</div><div class="pe-2">${num('padding-top','Intérieur haut','px',0,400)}${num('padding-bottom','Intérieur bas','px',0,400)}</div><div class="pe-2">${num('padding-left','Intérieur gauche','px',0,400)}${num('padding-right','Intérieur droite','px',0,400)}</div><div class="pe-2">${num('max-width','Largeur max','px',0,2400)}${num('min-height','Hauteur min','px',0,1600)}</div>`)}
    ${grp('Animation', `${`<label class="pe-f"><span>${t('Effet à l\'apparition')}</span><select data-pea="type">${PE_ANIMS.map(([v,l])=>`<option value="${v}" ${(an.type||'')===v?'selected':''}>${t(l)}</option>`).join('')}</select></label>`}<div class="pe-2"><label class="pe-f"><span>${t('Durée')}</span><span class="pe-num"><input type="number" data-pea="dur" value="${an.dur||700}" min="100" max="4000" step="50"><i>ms</i></span></label><label class="pe-f"><span>${t('Délai')}</span><span class="pe-num"><input type="number" data-pea="delay" value="${an.delay||0}" min="0" max="4000" step="50"><i>ms</i></span></label></div><button class="btn sm" data-a="pedReplay" ${an.type?'':'disabled'}>${ic('refresh','sm')} ${t('Rejouer')}</button>`)}
    ${grp('Affichage', `<label class="check small"><input type="checkbox" data-pes="hideMobile" ${st.hideMobile?'checked':''}> ${t('Masquer sur téléphone')}</label><label class="check small"><input type="checkbox" data-pes="hideDesktop" ${st.hideDesktop?'checked':''}> ${t('Masquer sur ordinateur')}</label>`)}
  </div>`;
}
function pedHex(c){ const m=String(c).match(/\d+(\.\d+)?/g); if(String(c).startsWith('#')) return c.length===4? '#'+[...c.slice(1)].map(x=>x+x).join('') : c.slice(0,7); if(!m) return '#000000'; return '#'+m.slice(0,3).map(x=>(+x).toString(16).padStart(2,'0')).join(''); }
function pedBlockForm(b){
  const f=(k,l,a)=>`<label class="pe-f col"><span>${t(l)}</span><input data-peb="${k}" value="${esc(b[k]||'')}" ${a||''}></label>`;
  if(b.type==='heading') return `<label class="pe-f col"><span>${t('Titre')}</span><input data-peb="text" value="${esc(b.text||'')}"></label>`;
  if(b.type==='text') return `<label class="pe-f col"><span>${t('Texte')}</span><textarea data-peb="text" rows="5">${esc(b.text||'')}</textarea></label>`;
  if(b.type==='button') return f('text','Texte du bouton')+f('link','Lien','placeholder="#/boutique"');
  if(b.type==='image') return `<button class="btn sm" data-a="pedBlkImg">${ic('upload','sm')} ${t(b.src?'Changer l\'image':'Choisir une image')}</button>`+f('alt','Description de l\'image')+f('link','Lien au clic (facultatif)','placeholder="#/categorie/burger"');
  if(b.type==='video') return f('url','Lien YouTube','placeholder="https://youtu.be/…"');
  return `<label class="pe-f"><span>${t('Hauteur')}</span><span class="pe-num"><input type="number" data-peb="h" value="${b.h||40}" min="4" max="400"><i>px</i></span></label>`;
}
const pedBlk = () => { const s=PED.sel; return s && s.block && (peScope(pedScopeOf(s)).ops||[]).find(o=>o.bid===s.block && o.op==='block'); };
/* saisies du panneau : aperçu en direct pendant la frappe, une étape d'annulation par changement */
document.addEventListener('input', e=>{ const el=e.target; if(!el.closest || !el.closest('#pe-panel')) return;
  if(el.dataset.pes && el.type!=='checkbox' && el.tagName!=='SELECT'){ const v=el.value; PED._live = PED._live || (pedSnap(), true); pedSetStyle(el.dataset.pes, v===''? '' : el.dataset.unit!==undefined && el.dataset.unit!==''? v+el.dataset.unit : v, true); }
  if(el.dataset.peb){ const b=pedBlk(); if(b){ PED._live = PED._live || (pedSnap(), true); b[el.dataset.peb]=el.value; pedCommit(); } }
});
document.addEventListener('change', e=>{ const el=e.target; if(!el.closest || !el.closest('#pe-panel')) return; PED._live=false;
  if(el.dataset.pes && el.type==='checkbox'){ pedSetStyle(el.dataset.pes, el.checked); }
  else if(el.dataset.pes && el.tagName==='SELECT'){ pedSetStyle(el.dataset.pes, el.value); }
  if(el.dataset.pea){ pedSnap(); const sc=peScope(pedScopeOf(PED.sel)); sc.anim=sc.anim||{}; const a=sc.anim[PED.sel.id]={...(sc.anim[PED.sel.id]||{dur:700,delay:0}), [el.dataset.pea]: el.dataset.pea==='type'? el.value : +el.value}; if(!a.type) delete sc.anim[PED.sel.id]; pedCommit(); if(el.dataset.pea==='type'){ pedPanel(); if(a.type) setTimeout(A.pedReplay,150); } }
});
A.pedSet = el=>{ const k=el.dataset.k, v=el.dataset.v; pedSetStyle(k, pedStyle()[k]===v? '' : v); pedPanel(); };
A.pedClear = el=>{ pedSetStyle(el.dataset.k, ''); pedPanel(); };
A.pedHide = ()=>{ pedSetStyle('display', pedStyle().display==='none'? '' : 'none'); pedPanel(); };
A.pedReset = ()=>{ if(!PED.sel) return; pedSnap(); const sc=peScope(pedScopeOf(PED.sel)); delete sc.styles[PED.sel.id]; if(sc.anim) delete sc.anim[PED.sel.id]; pedCommit(); pedPanel(); };
A.pedParent = ()=>pedPost({pe:'parent'});
A.pedReplay = ()=>pedPost({pe:'replay'});
A.pedMove = el=>{ const s=PED.sel; if(!s) return; pedSnap(); const sc=peScope(pedScopeOf(s)); sc.ops.push({op:'move', id:s.id, dir:+el.dataset.v}); pedCommit(); s.prev=s.next=true; pedPanel(); };
A.pedBg = async()=>{ const f=await pickFile('image/jpeg,image/png,image/webp'); if(!f) return; try{ pedSetStyle('background-image', await uploadFile(f)); pedPanel(); }catch(err){ toast(esc(err.message),'bad'); } };
A.pedTextSave = ()=>{ const s=PED.sel; pedSnap(); setText(s.key, val('pedText').trim()); s.text=val('pedText').trim(); pedSend(); toast(t('Texte enregistré'),'ok'); pedPanel(); };
A.pedTextReset = ()=>{ const s=PED.sel; pedSnap(); setText(s.key, null); s.text=s.key; pedSend(); pedPanel(); };
A.pedAdd = el=>{ const s=PED.sel; if(!s) return; pedSnap(); const sc=peScope(pedScopeOf(s)), bid=uid(), type=el.dataset.v;
  const b={op:'block', bid, after:s.id, type, text: type==='heading'? t('Nouveau titre') : type==='text'? t('Votre texte ici.') : type==='button'? t('Découvrir') : '', link: type==='button'? '#/boutique' : '', h:40};
  sc.ops.push(b); pedCommit(); PED.sel={...s, id:'b'+bid, block:bid, label:t('Bloc ajouté'), key:'', text:'', prev:true, next:true}; pedPanel(); };
A.pedBlkDel = ()=>{ const s=PED.sel, sc=peScope(pedScopeOf(s)); pedSnap(); sc.ops=sc.ops.filter(o=>!(o.op==='block' && o.bid===s.block)); delete sc.styles[s.id]; PED.sel=null; pedCommit(); pedPanel(); };
A.pedBlkImg = async()=>{ const f=await pickFile('image/jpeg,image/png,image/webp'); if(!f) return; try{ const url=await uploadFile(f); pedSnap(); pedBlk().src=url; pedCommit(); pedPanel(); }catch(err){ toast(esc(err.message),'bad'); } };

/* ---------- module Boutique : onglet « Pages » ; sur la boutique, « Modifier la page » ouvre l'éditeur ---------- */
const _viewSitePe = viewSite;
viewSite = function(){
  const u=S.ui.site; if(!u._pe){ u._pe=1; u.tab='pages'; }
  const q=route().q; if(q.edit){ history.replaceState(null,'','#/erp/site'); setTimeout(()=>A.peOpen({dataset:{v:q.edit}}), 50); }
  const pagesTab = `<button class="${u.tab==='pages'?'on':''}" data-a="siteTab" data-v="pages">${t('Pages')}</button>`;
  if(u.tab!=='pages') return _viewSitePe().replace('<div class="tabs">', '<div class="tabs">'+pagesTab);
  const d=(SETTINGS.site||{}).pages||{}, n=sc=>{ const v=d[sc]||{}; return Object.keys(v.styles||{}).length + Object.keys(v.anim||{}).length + (v.ops||[]).length; };
  const keep=u.tab; u.tab='slides'; let h=_viewSitePe(); u.tab=keep;
  const list = `<div class="card-b small muted">${t('Choisissez une page puis cliquez sur n\'importe quel élément : texte, police, taille, couleurs, fond, marges, animation, place, blocs ajoutés. Les modifications s\'appliquent à tous les visiteurs.')}</div>
    <div class="card-b pe-pages">${PE_PAGES.map(([k,l])=>`<div class="pe-pcard"><div class="pe-pthumb">${ic(k==='home'?'home':k==='shop'?'grid':k==='product'?'box':k==='cart'?'cart':k==='contact'?'phone':'file','lg')}</div><b>${t(l)}</b><span class="xs muted">${n(k)? n(k)+' '+t('modification(s)') : t('Non modifiée')}</span><button class="btn primary sm" data-a="peOpen" data-v="${k}">${ic('edit','sm')} ${t('Éditer la page')}</button></div>`).join('')}
      <div class="pe-pcard"><div class="pe-pthumb">${ic('layers','lg')}</div><b>${t('En-tête, menu et pied de page')}</b><span class="xs muted">${n('global')? n('global')+' '+t('modification(s)') : t('Communs à toutes les pages')}</span><button class="btn primary sm" data-a="peOpen" data-v="home">${ic('edit','sm')} ${t('Éditer')}</button></div></div>`;
  return h.replace(/(<div class="tabs">[\s\S]*?<\/div>)[\s\S]*<\/section>/, (m,tabs)=>tabs.replace('class="on"','class=""').replace('<div class="tabs">','<div class="tabs">'+pagesTab)+list+'</section>');
};
ERP_VIEWS.admin.site = ()=>viewSite();
editBar = function(){ return S.role==='admin' && !PE.preview? `<div class="edit-bar"><a class="btn sm primary" href="#/erp/site?edit=${pePageKey()}">${ic('edit','sm')} ${t('Modifier la page')}</a></div>` : ''; };
