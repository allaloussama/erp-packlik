"use strict";
/* ============================================================
   Boutique : mini-panier latéral, panier avec le même formulaire que la fiche produit,
   slides, formulaire et fiche produit réglables, textes modifiables sur toutes les pages,
   accès à l'administration par /admin.
   Réglages : SETTINGS.site = {slides, form, pdp, texts:{fr,ar,en}} (module ERP « Boutique »).
   ============================================================ */
const site = () => SETTINGS.site || (SETTINGS.site = {});

/* ---------- textes modifiables : chaque texte affiché peut être remplacé, par langue ---------- */
const TSEEN = new Map(); // texte affiché → texte d'origine, pour l'édition directe
const _tSite = t;
t = function(s){ const tx=(SETTINGS.site||{}).texts, o=tx && tx[S.lang]; const r = o && s!=null && o[s]!=null && o[s]!==''? o[s] : _tSite(s); if(typeof s==='string' && typeof r==='string' && r.length<400) TSEEN.set(r.trim(), s); return r; };


/* ---------- pages retirées de la boutique ---------- */
const _renderShop = render;
render = function(){ const p0=route().parts[0]; if(['suivi','compte','favoris','comparer'].includes(p0)){ location.replace('#/'); return; } if(p0==='commande'){ location.replace('#/panier'); return; } _renderShop(); };

/* ---------- mini-panier latéral (deux boutons : voir le panier / commander) ---------- */
function miniCart(){
  if(!S.ui.mini) return '';
  return `<div class="mc-bg" data-a="miniClose"></div><aside class="mc" role="dialog" aria-modal="true" aria-label="${t('Panier')}">
    <div class="mc-h"><b>${t('Panier')} <span class="muted">(${cartCount()})</span></b><button class="btn icon ghost" data-a="miniClose" aria-label="${t('Fermer')}">${ic('x')}</button></div>
    <div class="mc-b">${S.cart.length? S.cart.map((it,i)=>{ const p=PBY[it.pid]; if(!p) return ''; const v=it.v&&p.variants? (p.variants.find(x=>x.id===it.v)||{}).label:''; return `<div class="mc-it"><a href="#/produit/${p.id}" class="mc-im">${prodArt(p,64)}</a><div class="grow" style="min-width:0"><a href="#/produit/${p.id}" class="mc-nm">${esc(p.name)}</a>${v?`<div class="xs muted">${esc(v)}</div>`:''}<div class="row" style="gap:8px;margin-top:6px"><div class="qty sm"><button data-a="cartQ" data-i="${i}" data-v="-1" aria-label="${t('moins')}">−</button><input value="${it.q}" readonly aria-label="${t('Quantité')}"><button data-a="cartQ" data-i="${i}" data-v="1" aria-label="${t('plus')}">+</button></div><b class="num small">${dzd(it.price*it.q)}</b></div></div><button class="btn icon sm ghost" data-a="cartDel" data-i="${i}" aria-label="${t('Supprimer')}">${ic('x','sm')}</button></div>`; }).join('') : `<div class="empty">${ic('cart')}<div>${t('Votre panier est vide')}</div></div>`}</div>
    ${S.cart.length? `<div class="mc-f"><div class="row between"><span>${t('Sous-total')}</span><b class="num">${dzd(cartTotal())}</b></div>
      <a class="btn block lg mc-view" href="#/panier" data-a="miniClose">${t('Voir le panier')}</a>
      <a class="btn primary block lg" href="#/panier?form=1" data-a="miniGo">${t('Commander')}</a></div>`:''}
  </aside>`;
}
const _shopShell = shopShell;
shopShell = function(content, active){ return _shopShell(content, active) + miniCart() + editBar(); };
const openMini = ()=>{ S.ui.mini=true; render(); document.getElementById('toasts').replaceChildren(); }; // le panneau suffit comme confirmation
A.addCart = el=>{ const p=PBY[+el.dataset.id]; if(!p) return; addToCart(p.id, p.minQty||1, null); fbq('AddToCart',{id:p.id}); openMini(); };
A.pdpAdd = ()=>{ const p=PBY[S.ui.pdp.id]; addToCart(p.id, Math.max(p.minQty||1, +S.ui.pdp.q||1), S.ui.pdp.v); fbq('AddToCart',{id:p.id}); openMini(); };
A.miniOpen = (el, e)=>{ if(e) e.preventDefault(); openMini(); };
A.miniClose = ()=>{ S.ui.mini=false; render(); };
A.miniGo = ()=>{ S.ui.mini=false; };
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && S.ui.mini){ S.ui.mini=false; render(); } });
window.addEventListener('hashchange', ()=>{ if(S.ui.mini && !/^#\/panier/.test(location.hash)) S.ui.mini=false; });

/* ---------- panier : les produits et le même formulaire de commande que la fiche produit ---------- */
viewCart = function(){
  if(!S.cart.length) return shopShell(`<div class="container" style="margin-top:20px"><div class="card empty">${ic('cart')}<div><b>${t('Votre panier est vide')}</b></div><a class="btn kraft" href="#/boutique" style="margin-top:10px">${t('Continuer mes achats')}</a></div></div>`,'shop');
  if(route().q.form) setTimeout(()=>{ const f=document.getElementById('tjCod'); if(f){ f.scrollIntoView({behavior:'smooth'}); const i=document.getElementById('coName'); if(i) i.focus({preventScroll:true}); } history.replaceState(null,'','#/panier'); }, 60);
  return shopShell(`<div class="container" style="margin-top:20px">
    <h1 style="font-size:24px;margin-bottom:14px">${t('Panier')}</h1>
    <div class="cart-cod">
      <div class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Produit')}</th><th>${t('Prix')}</th><th>${t('Quantité')}</th><th class="r">${t('Total')}</th><th></th></tr></thead><tbody>
      ${S.cart.map((it,i)=>{ const p=PBY[it.pid]; if(!p) return ''; const v=it.v&&p.variants? (p.variants.find(x=>x.id===it.v)||{}).label:''; return `<tr><td><div class="row">${prodArt(p,44)}<div><a href="#/produit/${p.id}"><b>${esc(p.name)}</b></a>${v?`<div class="small muted">${t('Variante')} : ${esc(v)}</div>`:''}</div></div></td><td class="num">${dzd(it.price)}</td><td><div class="qty sm"><button data-a="cartQ" data-i="${i}" data-v="-1" aria-label="${t('moins')}">−</button><input value="${it.q}" readonly aria-label="${t('Quantité')}"><button data-a="cartQ" data-i="${i}" data-v="1" aria-label="${t('plus')}">+</button></div></td><td class="r num"><b>${dzd(it.price*it.q)}</b></td><td><button class="btn icon sm ghost" data-a="cartDel" data-i="${i}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button></td></tr>`; }).join('')}
      </tbody></table></div><div class="card-b"><a href="#/boutique" class="btn">${ic('chevR','sm flip')} ${t('Continuer mes achats')}</a></div></div>
      <div>${codForm(S.cart, {})}</div>
    </div></div>`,'shop');
};

/* ---------- formulaire de commande réglable ---------- */
const FORM_DEF = {title:'Commandez maintenant, payez à la livraison', sub:'Remplissez vos informations, nous vous appelons pour confirmer', button:'Commander maintenant', address:true, addCart:true, assure:true, color:''};
const formCfg = () => ({...FORM_DEF, ...(site().form||{})});
const _codForm = codForm;
codForm = function(items, opts){
  const f=formCfg(); let h=_codForm(items, {...opts, addCart: f.addCart? opts.addCart : false});
  const rep=(a,b)=>{ if(a!==b) h=h.split(a).join(b); };
  rep(`<strong>${t(FORM_DEF.title)}</strong>`, `<strong>${esc(t(f.title))}</strong>`);
  rep(`<span>${t(FORM_DEF.sub)}</span>`, `<span>${esc(t(f.sub))}</span>`);
  rep(`>${t(FORM_DEF.button)}</button>`, `>${esc(t(f.button))}</button>`);
  if(!f.address) h=h.replace(/<div class="tj-field [^"]*"><label for="coA">[\s\S]*?<\/div>/, '');
  if(!f.assure) h=h.replace(/<ul class="tj-assure">[\s\S]*?<\/ul>/, '');
  if(f.color) h=h.replace('<button class="tj-submit"', `<button class="tj-submit" style="background:${esc(f.color)};border-color:${esc(f.color)}"`);
  return h;
};

/* ---------- fiche produit : ordre des blocs ---------- */
const PDP_BLOCKS = [['badges','Badges et catégories'],['title','Nom du produit'],['price','Prix'],['short','Description courte'],['meta','Conditionnement, référence, stock'],['pack','Contenu du pack'],['form','Formulaire de commande'],['desc','Description complète']];
function pdpLayout(){ const l=site().pdp||{}; const order=(Array.isArray(l.order) && l.order.length? l.order : ['badges','title','price','short','meta','pack','form']).filter(k=>PDP_BLOCKS.some(b=>b[0]===k)); return {galleryRight:!!l.galleryRight, related:l.related!==false, order}; }

/* ---------- slides de l'accueil ---------- */
function defaultSlides(){ const img=id=>PBY[id] && (PBY[id].images||[])[0] || '';
  return [{badge:'Emballage personnalisé', title:'Prix compétitifs – emballage personnalisé selon votre marque', text:'Boîtes, barquettes, bowls, sacs craft et papier imprimés à votre logo, pour restaurants, fast-foods et pâtisseries.', button:'Contactez-nous', link:'#/contact', img:img(5), bg:'#FFE7D6', color:'#1B232B', on:true},
    {badge:'PACK PROMO', title:'Offres exclusives à ne pas manquer', text:'Des packs complets prêts à l\'emploi pour démarrer votre service à emporter au meilleur prix.', button:'Acheter', link:'#/categorie/pack-promo', img:img(45), bg:'#182028', color:'#FFFFFF', on:true}]; }
function heroHtml(){
  const sl=(site().slides||[]).filter(x=>x.on!==false); if(!sl.length) return null;
  if(S.heroIdx>=sl.length) S.heroIdx=0;
  return `<section class="hero" aria-roledescription="carrousel">${sl.map((x,i)=>`<div class="slide ${S.heroIdx===i?'on':''}" style="background:${esc(x.bg||'#FFE7D6')};color:${esc(x.color||'#1B232B')}">
      <div style="position:relative;z-index:1">${x.badge?`<span class="badge kraft">${esc(t(x.badge))}</span>`:''}<h2 style="margin-top:10px;color:inherit">${esc(t(x.title||''))}</h2>${x.text?`<p style="color:inherit;opacity:.85">${esc(t(x.text))}</p>`:''}${x.button?`<a href="${esc(/^(#|https?:)/.test(x.link||'')? x.link : '#/')}" class="btn primary lg">${esc(t(x.button))}</a>`:''}</div>
      <div class="art">${x.img? `<img src="${esc(x.img)}" alt="" style="width:100%;height:100%;object-fit:contain">`:''}</div></div>`).join('')}
    ${sl.length>1? `<div class="dots">${sl.map((_,i)=>`<button class="${S.heroIdx===i?'on':''}" data-a="hero" data-v="${i}" aria-label="Slide ${i+1}"></button>`).join('')}</div>`:''}</section>`;
}
const _viewHomeSite = viewHome;
viewHome = function(){ const h=_viewHomeSite(), hero=heroHtml(); return hero? h.replace(/<section class="hero"[\s\S]*?<\/section>/, ()=>hero) : h; };

/* ---------- modifier les textes directement sur la page (admin) ---------- */
function editBar(){ if(S.role!=='admin') return ''; return `<div class="edit-bar ${S.ui.edit?'on':''}">${S.ui.edit? `<span>${ic('edit','sm')} ${t('Cliquez sur un texte pour le modifier')}</span><a class="btn sm" href="#/erp/site">${ic('gear','sm')} ${t('Slides, formulaire, fiche produit')}</a><button class="btn sm primary" data-a="editToggle">${ic('check','sm')} ${t('Terminer')}</button>` : `<button class="btn sm primary" data-a="editToggle">${ic('edit','sm')} ${t('Modifier la page')}</button>`}</div>`; }
A.editToggle = ()=>{ S.ui.edit=!S.ui.edit; document.body.classList.toggle('editing-page', !!S.ui.edit); render(); };
function textAt(e){ const r = document.caretRangeFromPoint? document.caretRangeFromPoint(e.clientX, e.clientY) : (document.caretPositionFromPoint && (p=>p&&{startContainer:p.offsetNode})(document.caretPositionFromPoint(e.clientX, e.clientY))); const n=r && r.startContainer; return n && n.nodeType===3? n.nodeValue.trim() : (e.target.childElementCount===0? e.target.textContent.trim() : ''); }
document.addEventListener('click', e=>{
  if(!S.ui.edit || S.role!=='admin' || route().parts[0]==='erp' || e.target.closest('.edit-bar,#ov,.mc,.mc-bg')) return;
  const txt=textAt(e); e.preventDefault(); e.stopPropagation();
  const key = txt && TSEEN.get(txt);
  if(!key){ toast(txt? t('Ce texte vient d\'une fiche (produit, catégorie, slide) : modifiez-le dans l\'ERP.') : t('Cliquez directement sur un texte.'),'bad'); return; }
  S.ui.te={key};
  openModal(modalTpl(t('Modifier le texte'), `<p class="small muted" style="margin-top:0">${t('Texte d\'origine')} : « ${esc(key)} » · ${t('Langue')} : <b>${S.lang.toUpperCase()}</b></p><textarea class="input" id="teV" rows="4" ${S.lang==='ar'?'dir="rtl"':''}>${esc(txt)}</textarea>`,
    `<button class="btn" data-a="teReset">${t('Revenir au texte d\'origine')}</button><button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="teSave">${t('Enregistrer')}</button>`));
}, true);
function setText(key, v, lang){ const s=site(); s.texts=s.texts||{}; const L=lang||S.lang; s.texts[L]={...(s.texts[L]||{})}; if(v==null || v==='') delete s.texts[L][key]; else s.texts[L][key]=v; queueSync(); }
A.teSave = ()=>{ setText(S.ui.te.key, val('teV').trim()); closeModal(); toast(t('Texte enregistré'),'ok'); render(); };
A.teReset = ()=>{ setText(S.ui.te.key, null); closeModal(); render(); };

/* ============================================================
   ERP › Boutique : slides, formulaire de commande, fiche produit, textes des pages
   ============================================================ */
S.ui.site = {tab:'slides', q:''};
function viewSite(){
  const u=S.ui.site, s=site();
  const tabs = `<div class="tabs">${[['slides','Slides de l\'accueil'],['form','Formulaire de commande'],['pdp','Fiche produit'],['texts','Textes des pages']].map(([k,l])=>`<button class="${u.tab===k?'on':''}" data-a="siteTab" data-v="${k}">${t(l)}</button>`).join('')}</div>`;
  let inner;
  if(u.tab==='slides'){
    const sl = s.slides && s.slides.length? s.slides : null;
    inner = `<div class="card-b row between wrap"><span class="small muted">${t('Photo, badge, titre, texte, bouton, lien et couleurs de chaque slide. Les slides défilent toutes les 5 secondes.')}</span><div class="row">${sl?'':`<button class="btn" data-a="slInit">${ic('copy','sm')} ${t('Partir des slides actuelles')}</button>`}<button class="btn primary" data-a="slAdd">${ic('plus','sm')} ${t('Ajouter une slide')}</button></div></div>
    <div class="card-b col" style="gap:14px;padding-top:0">${(sl||[]).map((x,i)=>`<div class="sl-card ${x.on===false?'off':''}">
      <div class="sl-prev" style="background:${esc(x.bg||'#FFE7D6')};color:${esc(x.color||'#1B232B')}"><div><small>${esc(x.badge||'')}</small><b>${esc(x.title||t('Titre'))}</b></div>${x.img?`<img src="${esc(x.img)}" alt="">`:''}</div>
      <div class="col grow" style="gap:8px;min-width:0">
        <div class="grid3">${slF(i,'badge','Badge')}${slF(i,'title','Titre')}${slF(i,'button','Texte du bouton')}</div>
        <div class="grid3">${slF(i,'text','Texte')}${slF(i,'link','Lien du bouton')}<div class="row" style="gap:8px;align-items:end"><label class="field" style="flex:1">${t('Fond')}<input class="input" type="color" data-sl="${i}" data-k="bg" value="${esc(x.bg||'#FFE7D6')}" style="height:38px;padding:3px"></label><label class="field" style="flex:1">${t('Texte')}<input class="input" type="color" data-sl="${i}" data-k="color" value="${esc(x.color||'#1B232B')}" style="height:38px;padding:3px"></label></div></div>
        <div class="row wrap" style="gap:6px"><button class="btn sm" data-a="slImg" data-i="${i}">${ic('upload','sm')} ${t(x.img?'Changer la photo':'Ajouter une photo')}</button>${x.img?`<button class="btn sm ghost" data-a="slImgDel" data-i="${i}">${t('Retirer la photo')}</button>`:''}<label class="check small"><input type="checkbox" data-sl="${i}" data-k="on" ${x.on!==false?'checked':''}> ${t('Affichée')}</label><span class="grow"></span><button class="btn icon sm ghost" data-a="slMove" data-i="${i}" data-v="-1" ${i?'':'disabled'} aria-label="${t('Monter')}">${ic('arrowU','sm')}</button><button class="btn icon sm ghost" data-a="slMove" data-i="${i}" data-v="1" ${i<sl.length-1?'':'disabled'} aria-label="${t('Descendre')}">${ic('arrowD','sm')}</button><button class="btn icon sm ghost" data-a="slDel" data-i="${i}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button></div>
      </div></div>`).join('') || `<div class="empty">${ic('grid')}<div>${t('Les slides par défaut sont affichées. Partez d\'elles ou ajoutez la vôtre.')}</div></div>`}</div>`;
  }
  if(u.tab==='form'){ const f=formCfg(); const inp=(k,l)=>`<div class="field"><label>${t(l)}<input class="input" data-sf="${k}" value="${esc(f[k])}"></label></div>`; const chk=(k,l)=>`<label class="check"><input type="checkbox" data-sf="${k}" ${f[k]?'checked':''}> ${t(l)}</label>`;
    inner = `<div class="card-b g2"><div class="col" style="gap:12px">${inp('title','Titre du formulaire')}${inp('sub','Sous-titre')}${inp('button','Texte du bouton « Commander »')}<div class="field"><label>${t('Couleur du bouton')}<input class="input" type="color" data-sf="color" value="${esc(f.color||'#FD6400')}" style="height:40px;padding:3px"></label></div>
      ${chk('address','Afficher le champ Adresse')}${chk('addCart','Afficher le bouton « Ajouter au panier » sous le formulaire')}${chk('assure','Afficher les garanties (paiement à la livraison, vérification, 69 wilayas)')}
      <p class="xs muted" style="margin:0">${t('Le même formulaire sert sur la fiche produit et dans le panier. Nom, téléphone, wilaya et commune restent obligatoires.')}</p></div>
      <div class="sl-form-prev">${codForm([], {})}</div></div>`; }
  if(u.tab==='pdp'){ const l=pdpLayout(); const rest=PDP_BLOCKS.filter(b=>!l.order.includes(b[0]));
    inner = `<div class="card-b g2"><div class="col" style="gap:10px"><b>${t('Ordre des blocs à côté des photos')}</b>
      ${l.order.map((k,i)=>`<div class="pdp-blk"><span class="grow">${t((PDP_BLOCKS.find(b=>b[0]===k)||[k,k])[1])}</span><button class="btn icon sm ghost" data-a="pdpMove" data-i="${i}" data-v="-1" ${i?'':'disabled'} aria-label="${t('Monter')}">${ic('arrowU','sm')}</button><button class="btn icon sm ghost" data-a="pdpMove" data-i="${i}" data-v="1" ${i<l.order.length-1?'':'disabled'} aria-label="${t('Descendre')}">${ic('arrowD','sm')}</button><button class="btn icon sm ghost" data-a="pdpHide" data-v="${k}" aria-label="${t('Masquer')}">${ic('eye','sm')}</button></div>`).join('')}
      ${rest.length? `<div class="small muted">${t('Masqués')} :</div>${rest.map(b=>`<button class="btn sm" data-a="pdpShow" data-v="${b[0]}" style="align-self:start">${ic('plus','sm')} ${t(b[1])}</button>`).join('')}`:''}
      <p class="xs muted" style="margin:0">${t('« Description complète » masquée ici reste affichée sous la fiche, sur toute la largeur.')}</p></div>
      <div class="col" style="gap:12px"><label class="check"><input type="checkbox" data-pdp="galleryRight" ${l.galleryRight?'checked':''}> ${t('Photos à droite (au lieu de la gauche)')}</label><label class="check"><input type="checkbox" data-pdp="related" ${l.related?'checked':''}> ${t('Afficher « Produits associés »')}</label>
      ${PRODUCTS.find(p=>p.status==='actif')? `<a class="btn" href="#/produit/${PRODUCTS.find(p=>p.status==='actif').id}" target="_blank" rel="noopener">${ic('eye','sm')} ${t('Voir une fiche produit')}</a>`:''}</div></div>`; }
  if(u.tab==='texts'){ const q=u.q.toLowerCase(), tx=(s.texts||{})[S.lang]||{};
    const keys=[...new Set([...TSEEN.values(), ...Object.keys(tx)])].filter(k=>k && /[a-zà-ÿ]/i.test(k) && (!q || k.toLowerCase().includes(q) || String(tx[k]||'').toLowerCase().includes(q))).sort((a,b)=>(tx[b]?1:0)-(tx[a]?1:0) || a.localeCompare(b)).slice(0,200);
    inner = `<div class="filters-bar"><input class="input s" placeholder="${t('Rechercher un texte…')}" value="${esc(u.q)}" data-in="siteQ" aria-label="${t('Rechercher')}"><span class="small muted">${t('Langue modifiée')} : <b>${S.lang.toUpperCase()}</b> (${t('changez la langue en haut pour modifier les autres')})</span><span class="grow"></span><a class="btn" href="#/" >${ic('edit','sm')} ${t('Modifier directement sur la boutique')}</a></div>
      <div class="card-b small muted" style="padding-top:0">${t('Tous les textes de la boutique et de l\'ERP se remplacent ici. Laissez vide pour revenir au texte d\'origine. Sur la boutique, « Modifier la page » permet de cliquer sur un texte.')}</div>
      <div class="tbl-wrap" style="max-height:600px"><table class="tbl"><thead><tr><th style="width:45%">${t('Texte d\'origine')}</th><th>${t('Votre texte')}</th></tr></thead><tbody>${keys.map(k=>`<tr><td class="small">${esc(_tSite(k))}</td><td><input class="input" data-txt="${esc(k)}" value="${esc(tx[k]||'')}" placeholder="${esc(_tSite(k))}" ${S.lang==='ar'?'dir="rtl"':''}></td></tr>`).join('') || emptyRow(2,'Aucun texte : ouvrez d\'abord quelques pages de la boutique','search')}</tbody></table></div>`; }
  return erpShell('site', t('Boutique'), t('Slides, formulaire de commande, fiche produit et textes de toutes les pages'), card('', tabs+inner), `<a class="btn" href="#/" target="_blank" rel="noopener">${ic('store','sm')} ${t('Voir la boutique')}</a>`);
}
const slF = (i,k,l)=>`<div class="field"><label>${t(l)}<input class="input" data-sl="${i}" data-k="${k}" value="${esc((site().slides[i]||{})[k]||'')}" ${k==='link'?'placeholder="#/categorie/burger"':''}></label></div>`;
ERP_VIEWS.admin.site = ()=>viewSite();
A.siteTab = el=>{ S.ui.site.tab=el.dataset.v; render(); };
IN.siteQ = el=>{ S.ui.site.q=el.value; render(); };
const slSave = ()=>{ queueSync(); render(); };
A.slInit = ()=>{ site().slides=defaultSlides(); slSave(); };
A.slAdd = ()=>{ const s=site(); s.slides=(s.slides&&s.slides.length? s.slides : defaultSlides()).concat({badge:'', title:t('Nouvelle slide'), text:'', button:t('Découvrir'), link:'#/boutique', img:'', bg:'#FFE7D6', color:'#1B232B', on:true}); slSave(); };
A.slDel = el=>{ if(!confirm(t('Supprimer cette slide ?'))) return; site().slides.splice(+el.dataset.i,1); slSave(); };
A.slMove = el=>{ const a=site().slides, i=+el.dataset.i, j=i+(+el.dataset.v); [a[i],a[j]]=[a[j],a[i]]; slSave(); };
A.slImg = async el=>{ const f=await pickFile('image/jpeg,image/png,image/webp'); if(!f) return; try{ site().slides[+el.dataset.i].img=await uploadFile(f); slSave(); }catch(e){ toast(esc(e.message),'bad'); } };
A.slImgDel = el=>{ site().slides[+el.dataset.i].img=''; slSave(); };
document.addEventListener('change', e=>{
  const sl=e.target.closest('[data-sl]'); if(sl){ const x=site().slides[+sl.dataset.sl]; x[sl.dataset.k] = sl.type==='checkbox'? sl.checked : sl.value; slSave(); return; }
  const sf=e.target.closest('[data-sf]'); if(sf){ const s=site(); s.form={...(s.form||{}), [sf.dataset.sf]: sf.type==='checkbox'? sf.checked : sf.value}; slSave(); return; }
  const pd=e.target.closest('[data-pdp]'); if(pd){ const s=site(); s.pdp={...(s.pdp||{}), [pd.dataset.pdp]: pd.checked}; slSave(); return; }
  const tx=e.target.closest('[data-txt]'); if(tx){ setText(tx.dataset.txt, tx.value.trim()); toast(t('Texte enregistré'),'ok'); }
});
const pdpSet = order=>{ const s=site(); s.pdp={...(s.pdp||{}), order}; slSave(); };
A.pdpMove = el=>{ const o=pdpLayout().order.slice(), i=+el.dataset.i, j=i+(+el.dataset.v); [o[i],o[j]]=[o[j],o[i]]; pdpSet(o); };
A.pdpHide = el=>pdpSet(pdpLayout().order.filter(k=>k!==el.dataset.v));
A.pdpShow = el=>pdpSet(pdpLayout().order.concat(el.dataset.v));
