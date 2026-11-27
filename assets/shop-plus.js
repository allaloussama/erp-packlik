"use strict";
/* ============================================================
   Boutique : mini-panier latéral, panier avec le même formulaire que la fiche produit,
   slides, formulaire et fiche produit réglables, textes modifiables sur toutes les pages,
   accès à l'administration par /admin.
   Réglages : SETTINGS.site = {slides, form, pdp, texts:{fr,ar,en}} (module ERP « Boutique »).
   ============================================================ */
/* un réglage vide peut revenir du serveur sous forme de liste [] : on le remet en objet */
const site = () => { const o=x=>x && typeof x==='object' && !Array.isArray(x); if(!o(SETTINGS.site)) SETTINGS.site={}; const s=SETTINGS.site; ['texts','form','pdp'].forEach(k=>{ if(k in s && !o(s[k])) s[k]={}; }); if(o(s.texts)) Object.keys(s.texts).forEach(l=>{ if(!o(s.texts[l])) s.texts[l]={}; }); return s; };

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
/* ---------- en-tête et pied de page : tout se règle (ERP › Boutique › Pages › Infos de l'en-tête et du pied de page) ----------
   SETTINGS.site.brand = {name, logo, mark, phone1, phone2, whatsapp, email, address, about, payText, copyright,
     topText, showSearch, showCats, showWa, showLogin, nav:[{label,link}], links:[{label,link}], social:{facebook,instagram,tiktok,youtube}} */
const BRAND_DEF = () => ({name:'PackLik', logo:'assets/brand/logo.png', mark:'assets/brand/mark.png', phone1:COMPANY.phone1, phone2:COMPANY.phone2, whatsapp:'213549593160', email:COMPANY.email,
  address:COMPANY.address, about:'PackLik, votre partenaire de confiance pour l\'emballage et les solutions alimentaires en Algérie.', payText:'Vous payez en espèces au livreur à la réception de votre colis, dans les 69 wilayas.',
  copyright:'© '+new Date().getFullYear()+' PackLik · packlik.shop', showSearch:true, showCats:true, showWa:true, showLogin:true,
  nav:[{label:'Accueil', link:'#/'},{label:'Boutique', link:'#/boutique'},{label:'Contact', link:'#/contact'}],
  links:[{label:'Boutique', link:'#/boutique'},{label:'Contact', link:'#/contact'},{label:'Conditions générales de vente', link:'#/cgv'}],
  social:{facebook:'', instagram:'', tiktok:'', youtube:''}});
function brand(){ const d=BRAND_DEF(), b=(SETTINGS.site && SETTINGS.site.brand && typeof SETTINGS.site.brand==='object' && !Array.isArray(SETTINGS.site.brand))? SETTINGS.site.brand : {}; const out={...d, ...b, social:{...d.social, ...(b.social||{})}}; ['nav','links'].forEach(k=>{ if(!Array.isArray(out[k])) out[k]=d[k]; }); return out; }
const safeLink = l => /^(#\/|https?:\/\/|tel:|mailto:)/.test(l||'')? l : '#/';
const telOf = p => 'tel:'+String(p||'').replace(/[^\d+]/g,'');
const SOCIAL_IC = {facebook:'<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>', instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>', tiktok:'<path d="M14 3v11a4 4 0 1 1-4-4M14 3c.5 3 2.5 5 6 5"/>', youtube:'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>'};
shopShell = function(content, active){
  const b=brand(), route0=route().parts[0]||'', on=l=> (l==='#/'? !route0 : location.hash.startsWith(l))? 'on':'';
  const staff = S.uid && S.role && S.role!=='public';
  return `${b.topText? `<div class="sh-top">${esc(t(b.topText))}</div>`:''}
  <header class="shop-h"><div class="in">
    <a href="#/" class="logo" aria-label="${esc(b.name)} — ${t('accueil')}"><img src="${esc(b.logo)}" alt="${esc(b.name)}" width="560" height="111"></a>
    ${b.showSearch? `<form class="search" data-sub="shopSearch" role="search"><input id="shopQ" type="search" placeholder="${t('Rechercher un emballage…')}" value="${esc(S.ui.shop.q)}" aria-label="${t('Rechercher')}"><button type="submit" aria-label="${t('Rechercher')}">${ic('search')}</button></form>` : '<span class="grow"></span>'}
    <div class="hicons">
      ${langSwitch()}
      ${b.showLogin? `<a class="sh-login" href="#/erp">${ic('user','sm')}<span class="lbl">${staff? t('Mon espace') : t('Connexion')}</span></a>`:''}
      <a class="cart-pill" href="#/panier" data-a="miniOpen" aria-label="${t('Panier')}">${ic('cart')}<span class="num">${cartCount()}</span><span class="num">${dzd(cartTotal())}</span></a>
    </div>
  </div></header>
  <nav class="nav" aria-label="${t('Menu principal')}"><div class="in"><span class="navlinks">${b.nav.map(n=>`<a href="${esc(safeLink(n.link))}" class="${on(n.link)}">${esc(t(n.label))}</a>`).join('')}</span></div></nav>
  ${b.showCats? `<div class="catbar"><div class="in">${CATS.map(c=>`<a href="#/categorie/${c.id}" class="${S.ui.shop.cat===c.id && active==='shop'?'on':''}">${esc(catName(c))}</a>`).join('')}</div></div>`:''}
  <main id="main">${content}</main>
  <footer class="footer"><div class="in">
    <div><a href="#/" class="logo" style="color:#fff"><span class="mk"><img src="${esc(b.mark)}" alt="" width="26" height="26"></span><span>${esc(b.name)}</span></a><p style="margin:12px 0 0;max-width:320px">${esc(t(b.about))}</p>
      ${Object.entries(b.social).some(([,u])=>u)? `<div class="sh-social">${Object.entries(b.social).filter(([,u])=>/^https?:\/\//.test(u||'')).map(([k,u])=>`<a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${k}"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${SOCIAL_IC[k]}</svg></a>`).join('')}</div>`:''}</div>
    <div><h4>${t('Contact')}</h4>${b.address?`<a>${esc(t(b.address))}</a>`:''}${b.phone1?`<a href="${telOf(b.phone1)}" dir="ltr">${esc(b.phone1)}</a>`:''}${b.phone2?`<a href="${telOf(b.phone2)}" dir="ltr">${esc(b.phone2)}</a>`:''}${b.email?`<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>`:''}</div>
    <div><h4>${t('Liens utiles')}</h4>${b.links.map(n=>`<a href="${esc(safeLink(n.link))}">${esc(t(n.label))}</a>`).join('')}</div>
    <div><h4>${t('Paiement à la livraison')}</h4><p style="margin:0">${esc(t(b.payText))}</p></div>
  </div><div class="bot">${esc(t(b.copyright))}</div></footer>
  ${b.showWa && b.whatsapp? `<a class="wa-float" href="https://wa.me/${esc(String(b.whatsapp).replace(/\D/g,''))}" target="_blank" rel="noopener" aria-label="WhatsApp">${ic('wa','lg')}</a>`:''}`
  // barre du bas sur téléphone (style WoodMart) : mêmes liens et mêmes réglages que l'en-tête
  + `<nav class="mbar" aria-label="Navigation">
    <a href="#/" class="${on('#/')}">${ic('home')}<span>${t('Accueil')}</span></a>
    <a href="#/boutique" class="${route0==='boutique'||route0==='categorie'?'on':''}">${ic('grid')}<span>${t('Boutique')}</span></a>
    <a href="#/panier" data-a="miniOpen" class="mbar-cart ${route0==='panier'?'on':''}">${ic('cart')}<i class="num">${cartCount()}</i><span>${t('Panier')}</span></a>
    ${b.showWa && b.whatsapp? `<a href="https://wa.me/${esc(String(b.whatsapp).replace(/\D/g,''))}" target="_blank" rel="noopener">${ic('wa')}<span>WhatsApp</span></a>`:''}
    ${b.showLogin? `<a href="#/erp">${ic('user')}<span>${staff? t('Mon espace') : t('Connexion')}</span></a>`:''}
  </nav>`
  + miniCart() + editBar();
};

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
    <div class="cart-solo">${codForm(S.cart, {})}<p style="text-align:center"><a href="#/boutique" class="btn">${ic('chevR','sm flip')} ${t('Continuer mes achats')}</a></p></div>
</div>`,'shop');
};

/* ---------- formulaire de commande : champs réglables, produits du panier modifiables dans le formulaire ----------
   SETTINGS.site.form = {title, sub, button, color, assure, addCart, fields:[{key, label, placeholder, type, required, show, full, options}]}
   Nom, téléphone, wilaya, commune et mode de livraison restent obligatoires (le serveur en a besoin) ;
   les champs ajoutés sont joints à la note de la commande. */
const FORM_DEF = {title:'Commandez maintenant, payez à la livraison', sub:'Remplissez vos informations, nous vous appelons pour confirmer', button:'Commander maintenant', addCart:true, assure:true, color:''};
const FIELDS_DEF = [
  {key:'name', label:'Nom complet', placeholder:'Nom et prénom', type:'text', required:true, show:true, lock:true},
  {key:'phone', label:'Téléphone', placeholder:'05 XX XX XX XX', type:'tel', required:true, show:true, lock:true},
  {key:'wilaya', label:'Wilaya', type:'select', required:true, show:true, lock:true},
  {key:'commune', label:'Commune', type:'select', required:true, show:true, lock:true},
  {key:'delivery', label:'Mode de livraison', type:'delivery', required:true, show:true, lock:true, full:true},
  {key:'address', label:'Adresse (facultatif)', placeholder:'Quartier, rue, repère…', type:'text', required:false, show:true, full:true}
];
const formCfg = () => ({...FORM_DEF, ...(site().form||{})});
function formFields(){
  const saved=(site().form||{}).fields;
  if(!Array.isArray(saved) || !saved.length) return FIELDS_DEF.map(f=>({...f}));
  const out=saved.map(f=>{ const d=FIELDS_DEF.find(x=>x.key===f.key); return d? {...d, ...f, lock:d.lock, type:d.type, ...(d.lock?{required:true, show:true}:{})} : {...f}; });
  FIELDS_DEF.forEach(d=>{ if(!out.some(f=>f.key===d.key)) out.push({...d}); });
  return out;
}
codForm = function(items, opts){
  const f=formCfg(), co=S.ui.co; co.cf=co.cf||{};
  if(!WBY[co.wilaya] || !WBY[co.wilaya].active){ const w=WILAYAS.find(x=>x.active); co.wilaya = w? w.id : co.wilaya; }
  const q=codQuote(items, co); if(!q.desk && co.delivery==='desk'){ co.delivery='home'; q.fee=q.feeH; }
  const err=k=>co.err[k]? `<small class="err">${t(co.err[k])}</small>`:'';
  const ph=x=>x.placeholder? `placeholder="${esc(t(x.placeholder))}"`:'';
  const dtype=(v,label,sub,fee,off)=>`<label class="tj-dtype ${off?'off':''}"><input type="radio" name="tjdl" value="${v}" ${co.delivery===v?'checked':''} ${off?'disabled':''} data-ch="codD"><span class="dot"></span><span class="txt"><strong>${t(label)}</strong><small>${t(sub)}</small></span><b class="num">${q.free? t('Gratuite') : dzd(fee)}</b></label>`;
  const fieldHtml = x=>{
    const req = x.required? ' <span class="tj-req">*</span>' : '', cls=`tj-field ${co.err[x.key]?'bad':''} ${x.full?'full':''}`, L=esc(t(x.label));
    switch(x.key){
      case 'name': return `<div class="${cls}"><label for="coName">${L}${req}</label><span class="tj-inp-ic">${ic('user','sm')}<input class="tj-inp" id="coName" data-co="name" value="${esc(co.name)}" autocomplete="name" required ${ph(x)}></span>${err('name')}</div>`;
      case 'phone': return `<div class="${cls}"><label for="coPhone">${L}${req}</label><span class="tj-inp-ic">${ic('phone','sm')}<input class="tj-inp" id="coPhone" data-co="phone" value="${esc(co.phone)}" type="tel" inputmode="numeric" maxlength="14" dir="ltr" autocomplete="tel" required ${ph(x)}></span>${err('phone')}</div>`;
      case 'wilaya': return `<div class="${cls}"><label for="coW">${L}${req}</label><select class="tj-inp" id="coW" data-ch="codW">${WILAYAS.filter(w=>w.active).map(w=>`<option value="${w.id}" ${w.id===+co.wilaya?'selected':''}>${w.code} - ${esc(wName(w.id))}</option>`).join('')}</select></div>`;
      case 'commune': return `<div class="${cls}" ${co.delivery==='desk'?'hidden':''}><label for="coC">${L}${req}</label><select class="tj-inp" id="coC" data-co="commune">${communeOptions(co.wilaya, co.commune)}</select>${err('commune')}</div>`;
      case 'delivery': return `<fieldset class="tj-group full"><legend>${L}</legend><div class="tj-delivery">${dtype('home','À domicile','Livré jusqu\'à votre porte',q.feeH,false)}${dtype('desk','Bureau de livraison (stop desk)','Retrait au bureau le plus proche',q.feeD,!q.desk)}</div></fieldset>`;
      case 'address': return `<div class="${cls}"><label for="coA">${L}${req}</label><span class="tj-inp-ic">${ic('pin','sm')}<input class="tj-inp" id="coA" data-co="address" value="${esc(co.address)}" autocomplete="street-address" ${ph(x)}></span>${err('address')}</div>`;
    }
    const id='cf_'+x.key, v=co.cf[x.key]??'';
    if(x.type==='textarea') return `<div class="${cls}"><label for="${id}">${L}${req}</label><textarea class="tj-inp" id="${id}" data-cf="${esc(x.key)}" rows="3" ${ph(x)}>${esc(v)}</textarea>${err(x.key)}</div>`;
    if(x.type==='select') return `<div class="${cls}"><label for="${id}">${L}${req}</label><select class="tj-inp" id="${id}" data-cf="${esc(x.key)}"><option value="">${t('— Choisir —')}</option>${(x.options||[]).map(o=>`<option ${o===v?'selected':''}>${esc(t(o))}</option>`).join('')}</select>${err(x.key)}</div>`;
    if(x.type==='checkbox') return `<div class="${cls}"><label class="check"><input type="checkbox" data-cf="${esc(x.key)}" ${v?'checked':''}> ${L}${req}</label>${err(x.key)}</div>`;
    return `<div class="${cls}"><label for="${id}">${L}${req}</label><input class="tj-inp" id="${id}" data-cf="${esc(x.key)}" value="${esc(v)}" type="${x.type==='number'?'number':x.type==='date'?'date':x.type==='email'?'email':'text'}" ${ph(x)}>${err(x.key)}</div>`;
  };
  const main = opts.product? items[0] : null;
  const line = (i, idx)=>{ const p=PBY[i.pid]; if(!p) return ''; const v=i.v&&p.variants? ' ('+esc((p.variants.find(x=>x.id===i.v)||{}).label||'')+')':''; const ci=S.cart.indexOf(i);
    return `<div class="tj-line">${prodArt(p,40)}<div class="grow" style="min-width:0"><b class="tj-ln-nm">${esc(p.name)}${v}</b><span class="tj-ln-q">${ci>=0? `<span class="qty sm"><button type="button" data-a="cartQ" data-i="${ci}" data-v="-1" aria-label="${t('moins')}">−</button><input value="${i.q}" readonly aria-label="${t('Quantité')}"><button type="button" data-a="cartQ" data-i="${ci}" data-v="1" aria-label="${t('plus')}">+</button></span>` : `<span class="muted small">${i.q} × ${dzd(i.price)}</span>`}</span></div><b class="num">${dzd(i.price*i.q)}</b>${ci>=0? `<button type="button" class="tj-ln-del" data-a="cartDel" data-i="${ci}" aria-label="${t('Retirer du formulaire')}" title="${t('Retirer')}">${ic('x','sm')}</button>` : '<span class="tj-ln-del"></span>'}</div>`; };
  return `<form class="tj-cod" id="tjCod" data-sub="cod" novalidate aria-label="${t('Formulaire de commande')}">
    <div class="tj-cod-title"><span class="ic" ${f.color?`style="background:${esc(f.color)}"`:''}>${ic('cash','lg')}</span><span><strong>${esc(t(f.title))}</strong><span>${esc(t(f.sub))}</span></span></div>
    <div class="tj-cod-grid">${formFields().filter(x=>x.show!==false).map(fieldHtml).join('')}</div>
    <input class="tj-hp" type="text" id="coHp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="tj-summary" aria-live="polite">
      <p class="tj-sum-title">${t('Vos produits')}</p>
      ${items.length? items.map(line).join('') : `<div class="muted small">${t('Aucun produit')}</div>`}
      <div><span>${t('Livraison')} · ${esc(wName(co.wilaya))}</span><span class="num">${q.free? t('Gratuite') : dzd(q.fee)}</span></div>
      <div class="total"><strong>${t('Total à payer à la livraison')}</strong><strong class="num">${dzd(q.sub+q.fee)}</strong></div>
    </div>
    <button class="tj-submit" type="submit" ${items.length && opts.ok!==false?'':'disabled'} ${f.color?`style="background:${esc(f.color)};border-color:${esc(f.color)}"`:''}>${opts.ok===false? t('Produit indisponible') : esc(t(f.button))}</button>
    ${opts.addCart && f.addCart? `<button class="tj-addcart" type="button" data-a="pdpAdd">${ic('cart','sm')} ${t('Ajouter au panier')}</button>`:''}
    ${f.assure? `<ul class="tj-assure"><li>${ic('cash','sm')} ${t('Paiement à la livraison')}</li><li>${ic('shield','sm')} ${t('Vérification avant paiement')}</li><li>${ic('truck','sm')} ${t('Livraison 69 wilayas')}</li></ul>`:''}
  </form>`;
};
S.ui.co.withCart = true; // les produits ajoutés au panier font partie du formulaire
document.addEventListener('input', e=>{ const el=e.target.closest('[data-cf]'); if(el){ S.ui.co.cf=S.ui.co.cf||{}; S.ui.co.cf[el.dataset.cf]= el.type==='checkbox'? el.checked : el.value; } });
document.addEventListener('change', e=>{ const el=e.target.closest('[data-cf]'); if(el){ S.ui.co.cf=S.ui.co.cf||{}; S.ui.co.cf[el.dataset.cf]= el.type==='checkbox'? el.checked : el.value; } });
const _subCod = SUB.cod;
SUB.cod = async form=>{
  const co=S.ui.co, fs=formFields().filter(x=>x.show!==false); co.cf=co.cf||{};
  const custom=fs.filter(x=>!FIELDS_DEF.some(d=>d.key===x.key)), addr=fs.find(x=>x.key==='address');
  const miss=custom.filter(x=>x.required && !co.cf[x.key]); const addrMiss = addr && addr.required && !val('coA').trim();
  if(miss.length || addrMiss){ co.err={}; miss.forEach(x=>co.err[x.key]='Champ obligatoire'); if(addrMiss) co.err.address='Champ obligatoire'; co.name=val('coName'); co.phone=val('coPhone'); co.commune=val('coC'); co.address=val('coA'); render(); toast(t('Merci de corriger le formulaire'),'bad'); return; }
  co.note = custom.filter(x=>co.cf[x.key]!=null && co.cf[x.key]!=='' && co.cf[x.key]!==false).map(x=>x.label+' : '+(co.cf[x.key]===true? t('Oui') : co.cf[x.key])).join(' · ');
  if(!fs.some(x=>x.key==='address')) co.address='';
  return _subCod(form);
};
/* sur une fiche produit, « Ajouter au panier » d'un autre produit l'ajoute au formulaire de la page */
const _addCartForm = A.addCart;
A.addCart = el=>{ if(route().parts[0]!=='produit') return _addCartForm(el); const p=PBY[+el.dataset.id]; if(!p) return; addToCart(p.id, p.minQty||1, null); fbq('AddToCart',{id:p.id}); render(); document.getElementById('toasts').replaceChildren(); toast(t('Ajouté au formulaire de commande')+' : '+esc(p.name),'ok'); const f=document.querySelector('.tj-summary'); if(f) f.scrollIntoView({behavior:'smooth', block:'center'}); };

/* ---------- fiche produit : ordre des blocs ---------- */
const PDP_BLOCKS = [['badges','Badges et catégories'],['title','Nom du produit'],['price','Prix'],['short','Description courte'],['meta','Conditionnement, référence, stock'],['pack','Contenu du pack'],['form','Formulaire de commande'],['desc','Description complète']];
function pdpLayout(){ const l=site().pdp||{}; const order=(Array.isArray(l.order) && l.order.length? l.order : ['badges','title','price','short','meta','pack','form']).filter(k=>PDP_BLOCKS.some(b=>b[0]===k)); return {galleryRight:!!l.galleryRight, related:l.related!==false, order}; }

/* ---------- slides de l'accueil ---------- */
function defaultSlides(){ const img=id=>PBY[id] && (PBY[id].images||[])[0] || '';
  return [{badge:'Emballage personnalisé', title:'Prix compétitifs – emballage personnalisé selon votre marque', text:'Boîtes, barquettes, bowls, sacs craft et papier imprimés à votre logo, pour restaurants, fast-foods et pâtisseries.', button:'Contactez-nous', link:'#/contact', img:img(5), bg:'#F4F3F0', color:'#1B232B', on:true},
    {badge:'PACK PROMO', title:'Offres exclusives à ne pas manquer', text:'Des packs complets prêts à l\'emploi pour démarrer votre service à emporter au meilleur prix.', button:'Acheter', link:'#/categorie/pack-promo', img:img(45), bg:'#182028', color:'#FFFFFF', on:true}]; }
function heroHtml(){
  const sl=(site().slides||[]).filter(x=>x.on!==false); if(!sl.length) return null;
  if(S.heroIdx>=sl.length) S.heroIdx=0;
  return `<section class="hero" aria-roledescription="carrousel">${sl.map((x,i)=>`<div class="slide ${S.heroIdx===i?'on':''}" style="background:${esc(x.bg||'#F4F3F0')};color:${esc(x.color||'#1B232B')}">
      <div style="position:relative;z-index:1">${x.badge?`<span class="badge kraft">${esc(t(x.badge))}</span>`:''}<h2 style="margin-top:10px;color:inherit">${esc(t(x.title||''))}</h2>${x.text?`<p style="color:inherit;opacity:.85">${esc(t(x.text))}</p>`:''}${x.button?`<a href="${esc(/^(#|https?:)/.test(x.link||'')? x.link : '#/')}" class="btn primary lg">${esc(t(x.button))}</a>`:''}</div>
      <div class="art">${x.img? `<img src="${esc(x.img)}" alt="" style="width:100%;height:100%;object-fit:contain">`:''}</div></div>`).join('')}
    ${sl.length>1? `<div class="dots">${sl.map((_,i)=>`<button class="${S.heroIdx===i?'on':''}" data-a="hero" data-v="${i}" aria-label="Slide ${i+1}"></button>`).join('')}</div>`:''}</section>`;
}
const _viewHomeSite = viewHome;
viewHome = function(){ const h=_viewHomeSite(), hero=heroHtml(); return hero? h.replace(/<section class="hero"[\s\S]*?<\/section>/, ()=>hero) : h; };

/* ---------- modifier les textes directement sur la page (admin) ---------- */
function editBar(){ return ''; } // bouton « Modifier la page » : voir page-editor.js
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
      <div class="sl-prev" style="background:${esc(x.bg||'#F4F3F0')};color:${esc(x.color||'#1B232B')}"><div><small>${esc(x.badge||'')}</small><b>${esc(x.title||t('Titre'))}</b></div>${x.img?`<img src="${esc(x.img)}" alt="">`:''}</div>
      <div class="col grow" style="gap:8px;min-width:0">
        <div class="grid3">${slF(i,'badge','Badge')}${slF(i,'title','Titre')}${slF(i,'button','Texte du bouton')}</div>
        <div class="grid3">${slF(i,'text','Texte')}${slF(i,'link','Lien du bouton')}<div class="row" style="gap:8px;align-items:end"><label class="field" style="flex:1">${t('Fond')}<input class="input" type="color" data-sl="${i}" data-k="bg" value="${esc(x.bg||'#F4F3F0')}" style="height:38px;padding:3px"></label><label class="field" style="flex:1">${t('Texte')}<input class="input" type="color" data-sl="${i}" data-k="color" value="${esc(x.color||'#1B232B')}" style="height:38px;padding:3px"></label></div></div>
        <div class="row wrap" style="gap:6px"><button class="btn sm" data-a="slImg" data-i="${i}">${ic('upload','sm')} ${t(x.img?'Changer la photo':'Ajouter une photo')}</button>${x.img?`<button class="btn sm ghost" data-a="slImgDel" data-i="${i}">${t('Retirer la photo')}</button>`:''}<label class="check small"><input type="checkbox" data-sl="${i}" data-k="on" ${x.on!==false?'checked':''}> ${t('Affichée')}</label><span class="grow"></span><button class="btn icon sm ghost" data-a="slMove" data-i="${i}" data-v="-1" ${i?'':'disabled'} aria-label="${t('Monter')}">${ic('arrowU','sm')}</button><button class="btn icon sm ghost" data-a="slMove" data-i="${i}" data-v="1" ${i<sl.length-1?'':'disabled'} aria-label="${t('Descendre')}">${ic('arrowD','sm')}</button><button class="btn icon sm ghost" data-a="slDel" data-i="${i}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button></div>
      </div></div>`).join('') || `<div class="empty">${ic('grid')}<div>${t('Les slides par défaut sont affichées. Partez d\'elles ou ajoutez la vôtre.')}</div></div>`}</div>`;
  }
  if(u.tab==='form'){ const f=formCfg(), fs=formFields(); const inp=(k,l)=>`<div class="field"><label>${t(l)}<input class="input" data-sf="${k}" value="${esc(f[k])}"></label></div>`; const chk=(k,l)=>`<label class="check"><input type="checkbox" data-sf="${k}" ${f[k]?'checked':''}> ${t(l)}</label>`;
    const TYPES=[['text','Texte court'],['textarea','Texte long'],['number','Nombre'],['email','E-mail'],['date','Date'],['select','Liste de choix'],['checkbox','Case à cocher']];
    const rows = fs.map((x,i)=>`<div class="ff-row ${x.show===false?'off':''}">
      <div class="ff-move"><button class="btn icon sm ghost" data-a="ffMove" data-i="${i}" data-v="-1" ${i?'':'disabled'} aria-label="${t('Monter')}">${ic('arrowU','sm')}</button><button class="btn icon sm ghost" data-a="ffMove" data-i="${i}" data-v="1" ${i<fs.length-1?'':'disabled'} aria-label="${t('Descendre')}">${ic('arrowD','sm')}</button></div>
      <div class="ff-main"><div class="ff-top"><input class="input" data-ff="${i}" data-k="label" value="${esc(x.label)}" aria-label="${t('Nom du champ')}">${x.lock? `<span class="badge">${t('Obligatoire')}</span>` : FIELDS_DEF.some(d=>d.key===x.key)? '' : `<select class="select" data-ff="${i}" data-k="type" aria-label="${t('Type')}">${TYPES.map(([k,l])=>`<option value="${k}" ${x.type===k?'selected':''}>${t(l)}</option>`).join('')}</select>`}</div>
        ${['wilaya','commune','delivery','checkbox','select'].includes(x.key)||['checkbox','select'].includes(x.type)? '' : `<input class="input" data-ff="${i}" data-k="placeholder" value="${esc(x.placeholder||'')}" placeholder="${t('Texte d\'exemple dans le champ')}">`}
        ${x.type==='select' && !x.lock? `<input class="input" data-ff="${i}" data-k="options" value="${esc((x.options||[]).join(', '))}" placeholder="${t('Choix séparés par des virgules')}">`:''}
        <div class="row wrap" style="gap:14px"><label class="check small"><input type="checkbox" data-ff="${i}" data-k="show" ${x.show!==false?'checked':''} ${x.lock?'disabled':''}> ${t('Affiché')}</label><label class="check small"><input type="checkbox" data-ff="${i}" data-k="required" ${x.required?'checked':''} ${x.lock?'disabled':''}> ${t('Obligatoire')}</label><label class="check small"><input type="checkbox" data-ff="${i}" data-k="full" ${x.full?'checked':''}> ${t('Pleine largeur')}</label>${FIELDS_DEF.some(d=>d.key===x.key)? '' : `<button class="btn sm ghost" data-a="ffDel" data-i="${i}">${ic('trash','sm')} ${t('Supprimer')}</button>`}</div></div></div>`).join('');
    inner = `<div class="card-b g2"><div class="col" style="gap:12px">${inp('title','Titre du formulaire')}${inp('sub','Sous-titre')}${inp('button','Texte du bouton « Commander »')}<div class="field"><label>${t('Couleur du bouton')}<input class="input" type="color" data-sf="color" value="${esc(f.color||'#FD6400')}" style="height:40px;padding:3px"></label></div>
      ${chk('addCart','Afficher le bouton « Ajouter au panier » sous le formulaire')}${chk('assure','Afficher les garanties (paiement à la livraison, vérification, 69 wilayas)')}
      <div class="row between"><b>${t('Champs du formulaire')}</b><div class="row"><button class="btn sm" data-a="ffReset">${ic('refresh','sm')} ${t('Par défaut')}</button><button class="btn sm primary" data-a="ffAdd">${ic('plus','sm')} ${t('Ajouter un champ')}</button></div></div>
      <div class="col" style="gap:8px">${rows}</div>
      <p class="xs muted" style="margin:0">${t('Nom, téléphone, wilaya, commune et mode de livraison sont toujours demandés (nécessaires à la livraison) : vous pouvez les renommer et les déplacer. Les champs ajoutés sont joints à la note de la commande.')}</p></div>
      <div><div class="sl-form-prev">${codForm(PRODUCTS.filter(p=>p.status==='actif').slice(0,1).map(p=>({pid:p.id, v:null, q:1, price:p.price})), {})}</div></div></div>`; }
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
A.slAdd = ()=>{ const s=site(); s.slides=(s.slides&&s.slides.length? s.slides : defaultSlides()).concat({badge:'', title:t('Nouvelle slide'), text:'', button:t('Découvrir'), link:'#/boutique', img:'', bg:'#F4F3F0', color:'#1B232B', on:true}); slSave(); };
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

const ffSave = fs=>{ const s=site(); s.form={...(s.form||{}), fields:fs.map(({lock,...x})=>x)}; slSave(); };
document.addEventListener('change', e=>{ const el=e.target.closest('[data-ff]'); if(!el) return; const fs=formFields(), x=fs[+el.dataset.ff], k=el.dataset.k;
  x[k] = el.type==='checkbox'? el.checked : k==='options'? el.value.split(',').map(o=>o.trim()).filter(Boolean) : el.value; ffSave(fs); });
A.ffMove = el=>{ const fs=formFields(), i=+el.dataset.i, j=i+(+el.dataset.v); [fs[i],fs[j]]=[fs[j],fs[i]]; ffSave(fs); };
A.ffAdd = ()=>{ const fs=formFields(); fs.push({key:'f'+uid(), label:t('Nouveau champ'), placeholder:'', type:'text', required:false, show:true, full:false}); ffSave(fs); };
A.ffDel = el=>{ const fs=formFields(); fs.splice(+el.dataset.i,1); ffSave(fs); };
A.ffReset = ()=>{ if(!confirm(t('Revenir aux champs par défaut ?'))) return; const s=site(); if(s.form) delete s.form.fields; slSave(); };

/* ============================================================
   Page de connexion (aussi installation et premier lancement) : deux panneaux, marque à gauche, formulaire à droite
   ============================================================ */
authCard = function(title, sub, fields, btn, formName, extra){
  const b=brand();
  return `<div class="lg-wrap">
    <aside class="lg-side"><a href="#/" class="lg-logo"><span class="lg-mk"><img src="${esc(b.mark)}" alt=""></span><span>${esc(b.name)}</span></a>
      <div class="lg-pitch"><h2>${t('Votre boutique et votre ERP, au même endroit.')}</h2><p>${t('Commandes, confirmation, livraison, stock, fournisseurs et finances : tout se pilote d\'ici.')}</p>
        <ul>${[['headset','Confirmez les commandes en un clic'],['truck','Envoyez aux sociétés de livraison'],['wallet','Suivez l\'argent jusqu\'au dinar']].map(([i,l])=>`<li>${ic(i,'sm')} ${t(l)}</li>`).join('')}</ul></div>
      <small>© ${new Date().getFullYear()} ${esc(b.name)}</small></aside>
    <main class="lg-main"><form class="lg-form" data-sub="${formName}" novalidate>
      <div class="lg-head"><h1>${title}</h1><p>${sub}</p></div>
      ${fields.map(([id,label,type,ac])=>`<div class="lg-field"><label for="${id}">${label}</label><div class="lg-inp">${ic(type==='password'?'lock':type==='email'?'mail':'user','sm')}<input id="${id}" type="${type}" autocomplete="${ac}" required>${type==='password'?`<button type="button" class="lg-eye" data-a="lgEye" data-v="${id}" aria-label="${t('Afficher le mot de passe')}">${ic('eye','sm')}</button>`:''}</div></div>`).join('')}
      <button class="lg-btn" type="submit">${btn} ${ic('arrowR','sm flip')}</button>${extra||''}
      <a class="lg-back" href="#/">${ic('chevR','sm')} ${t('Retour à la boutique')}</a>
    </form></main></div>`;
};
A.lgEye = el=>{ const i=document.getElementById(el.dataset.v); if(i) i.type = i.type==='password'? 'text' : 'password'; };
