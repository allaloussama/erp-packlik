"use strict";
/* ============================================================
   Boutique et back-office façon thème Tajer :
   formulaire de commande COD sur la fiche produit, fiche produit complète (photos, prix barré,
   variantes, offres par quantité, livraison gratuite), module livraison (voir delivery.js plus bas).
   ============================================================ */

/* ---------- prix : paliers par quantité, prix barré ---------- */
function repriceCart(){ S.cart.forEach(i=>{ const p=PBY[i.pid]; if(p) i.price = unitPrice(p, i.v, i.q); }); }
const _render2 = render;
render = function(){ repriceCart(); _render2(); };
pPrice = function(p){
  if(p.status==='devis' || !p.price) return t('Prix sur devis');
  if(p.variants) return dzd(Math.min(...p.variants.map(v=>v.price)))+' – '+dzd(Math.max(...p.variants.map(v=>v.price)));
  return dzd(p.price) + (p.oldPrice>p.price? ` <s class="tj-old">${dzd(p.oldPrice)}</s>`:'');
};
const _addToCart = addToCart;
addToCart = function(pid, q, v){ _addToCart(pid, Math.max(q, PBY[pid].minQty||1), v); repriceCart(); };

/* ---------- formulaire COD ---------- */
S.ui.co.withCart = true;
document.addEventListener('input', e=>{ const el=e.target.closest('[data-co]'); if(el) S.ui.co[el.dataset.co]=el.value; });
function codItems(){
  const {parts}=route();
  if(parts[0]!=='produit') return S.cart;
  const d=S.ui.pdp, p=PBY[d.id]; if(!p) return [];
  const main={pid:p.id, v:d.v, q:d.q, price:unitPrice(p,d.v,d.q)};
  return [main, ...(S.ui.co.withCart? S.cart.filter(i=>!(i.pid===p.id && i.v===d.v)) : [])];
}
// Le client voit le prix de la wilaya sans le surpoids ; le surpoids reste dans l'ERP (feeOf) pour l'appel de confirmation.
const shopFeeOf = o=> o.freeShip? 0 : baseClientFee(o, carrierOf(o));
const shopTotal = o=> orderTotal(o) - feeOf(o) + shopFeeOf(o);
function codQuote(items, co){
  const o={wilaya:+co.wilaya, items, delivery:co.delivery}; o.carrier=autoCarrier(o);
  const free = items.some(i=>{ const p=PBY[i.pid]; return p && p.freeShipQty>0 && i.q>=p.freeShipQty; });
  const feeH = free||!items.length? 0 : shopFeeOf({...o, delivery:'home'}), feeD = free||!items.length? 0 : shopFeeOf({...o, delivery:'desk'});
  return {sub:linesTotal(items), feeH, feeD, fee: co.delivery==='home'? feeH : feeD, free, desk: carrierOf(o).desk!==false && !(WBY[o.wilaya] && !(WBY[o.wilaya].desk>0))}; // prix bureau 0 = pas de bureau dans cette wilaya
}
function codForm(items, opts){
  const co=S.ui.co; if(!WBY[co.wilaya] || !WBY[co.wilaya].active){ const w=WILAYAS.find(x=>x.active); co.wilaya = w? w.id : co.wilaya; }
  const q=codQuote(items, co); if(!q.desk && co.delivery==='desk'){ co.delivery='home'; q.fee=q.feeH; }
  const field=(id,key,label,icon,attrs)=>`<div class="tj-field ${co.err[key]?'bad':''}"><label for="${id}">${t(label)}</label><span class="tj-inp-ic">${ic(icon,'sm')}<input class="tj-inp" id="${id}" data-co="${key}" value="${esc(co[key])}" ${attrs}></span>${co.err[key]?`<small class="err">${t(co.err[key])}</small>`:''}</div>`;
  const dtype=(v,label,sub,fee,off)=>`<label class="tj-dtype ${off?'off':''}"><input type="radio" name="tjdl" value="${v}" ${co.delivery===v?'checked':''} ${off?'disabled':''} data-ch="codD"><span class="dot"></span><span class="txt"><strong>${t(label)}</strong><small>${t(sub)}</small></span><b class="num">${q.free? t('Gratuite') : dzd(fee)}</b></label>`;
  const others = opts.product? items.slice(1) : [];
  return `<form class="tj-cod" id="tjCod" data-sub="cod" novalidate aria-label="${t('Formulaire de commande')}">
    <div class="tj-cod-title"><span class="ic">${ic('cash','lg')}</span><span><strong>${t('Commandez maintenant, payez à la livraison')}</strong><span>${t('Remplissez vos informations, nous vous appelons pour confirmer')}</span></span></div>
    <div class="tj-cod-grid">
      ${field('coName','name','Nom complet','user','autocomplete="name" required placeholder="'+t('Nom et prénom')+'"')}
      ${field('coPhone','phone','Téléphone','phone','type="tel" inputmode="numeric" maxlength="14" dir="ltr" autocomplete="tel" required placeholder="05 XX XX XX XX"')}
      <div class="tj-field"><label for="coW">${t('Wilaya')}</label><select class="tj-inp" id="coW" data-ch="codW">${WILAYAS.filter(w=>w.active).map(x=>`<option value="${x.id}" ${x.id===+co.wilaya?'selected':''}>${x.code} - ${esc(wName(x.id))}</option>`).join('')}</select></div>
      <div class="tj-field ${co.err.commune?'bad':''}" ${co.delivery==='desk'?'hidden':''}><label for="coC">${t('Commune')}</label><select class="tj-inp" id="coC" data-co="commune">${communeOptions(co.wilaya, co.commune)}</select>${co.err.commune?`<small class="err">${t(co.err.commune)}</small>`:''}</div>
    </div>
    <fieldset class="tj-group"><legend>${t('Mode de livraison')}</legend><div class="tj-delivery">
      ${dtype('home','À domicile','Livré jusqu\'à votre porte',q.feeH,false)}
      ${dtype('desk','Bureau de livraison (stop desk)','Retrait au bureau le plus proche',q.feeD,!q.desk)}
    </div></fieldset>
    ${field('coA','address','Adresse (facultatif)','pin','autocomplete="street-address" placeholder="'+t('Quartier, rue, repère…')+'"')}
    ${opts.options||''}
    ${others.length || (opts.product && S.cart.some(i=>!(i.pid===items[0].pid && i.v===items[0].v)))? `<div class="tj-cod-cart"><label class="check"><input type="checkbox" ${co.withCart?'checked':''} data-ch="codCart"> <b>${t('Ajouter aussi les produits de mon panier')}</b></label>${others.length? `<ul>${others.map(i=>`<li><span><b>${i.q} × ${esc(PBY[i.pid].name)}</b></span><b class="num">${dzd(i.price*i.q)}</b></li>`).join('')}</ul>`:''}</div>`:''}
    <input class="tj-hp" type="text" id="coHp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="tj-summary" aria-live="polite">
      <p class="tj-sum-title">${t('Récapitulatif')}</p>
      ${items.map(i=>`<div><span>${i.q} × ${esc(PBY[i.pid].name)}${i.v&&PBY[i.pid].variants? ' ('+esc((PBY[i.pid].variants.find(v=>v.id===i.v)||{}).label||'')+')':''}</span><span class="num">${dzd(i.price*i.q)}</span></div>`).join('')}
      <div><span>${t('Livraison')} · ${esc(wName(co.wilaya))}</span><span class="num">${q.free? t('Gratuite') : dzd(q.fee)}</span></div>
      <div class="total"><strong>${t('Total à payer à la livraison')}</strong><strong class="num">${dzd(q.sub+q.fee)}</strong></div>
    </div>
    <button class="tj-submit" type="submit" ${items.length && opts.ok!==false?'':'disabled'}>${opts.ok===false? t('Produit indisponible') : t('Commander maintenant')}</button>
    ${opts.addCart? `<button class="tj-addcart" type="button" data-a="pdpAdd">${ic('cart','sm')} ${t('Ajouter au panier')}</button>`:''}
    <ul class="tj-assure"><li>${ic('cash','sm')} ${t('Paiement à la livraison')}</li><li>${ic('shield','sm')} ${t('Vérification avant paiement')}</li><li>${ic('truck','sm')} ${t('Livraison 69 wilayas')}</li></ul>
  </form>`;
}
CH.codW = (el)=>{ S.ui.co.wilaya=+el.value; S.ui.co.commune=''; render(); };
CH.codD = (el)=>{ S.ui.co.delivery=el.value; render(); };
CH.codCart = (el)=>{ S.ui.co.withCart=el.checked; render(); };
SUB.cod = async(form)=>{
  const co=S.ui.co, items=codItems();
  co.name=val('coName').trim(); co.phone=val('coPhone').trim(); co.commune=val('coC'); co.address=val('coA').trim();
  co.err={};
  if(co.name.length<3) co.err.name='Veuillez saisir votre nom';
  if(!validPhone(co.phone)) co.err.phone='Numéro invalide : 05, 06 ou 07 suivi de 8 chiffres';
  if(co.delivery!=='desk' && !co.commune) co.err.commune='Veuillez indiquer la commune';
  if(Object.keys(co.err).length){ render(); toast(t('Merci de corriger le formulaire'),'bad'); const bad=document.querySelector('.tj-field.bad .tj-inp'); if(bad) bad.focus(); return; }
  const btn=form.querySelector('.tj-submit'); btn.disabled=true; btn.textContent=t('Envoi en cours…'); // pas de double commande au double clic
  try{
    const r = await api('order', {name:co.name, phone:co.phone, wilaya:+co.wilaya, commune:co.commune, address:co.address, delivery:co.delivery, note:co.note||'', website:val('coHp'), platform:AD_PLATFORM, items:items.map(i=>({pid:i.pid, v:i.v, q:i.q}))});
    S.lastOrder = r.order; if(route().parts[0]!=='produit' || co.withCart){ S.cart=[]; saveCart(); }
    if(SETTINGS.purchaseOn==='order'){ const nm=co.name.toLowerCase().split(/\s+/).filter(Boolean), ph=co.phone.replace(/\D/g,'');
      pxTrack('Purchase', {value:shopTotal(r.order), ref:r.ref, ids:r.order.items.map(i=>i.pid), n:r.order.items.reduce((s,i)=>s+i.q,0),
        user:{ph:'213'+ph.slice(1), fn:nm[0]||'', ln:nm.length>1? nm[nm.length-1] : '', ct:(co.commune||'').toLowerCase().replace(/\s+/g,''), country:'dz'}}); }
    location.hash = '#/confirmation/'+r.ref;
  }catch(e){ btn.disabled=false; btn.textContent=t('Commander maintenant'); toast(esc(e.message),'bad'); }
};
placeOrder = ()=>SUB.cod(document.getElementById('tjCod'));
const AD_PLATFORM = (()=>{
  try{
    const q=new URLSearchParams(location.search), u=(q.get('utm_source')||'').toLowerCase();
    const p = q.get('fbclid')? 'facebook' : q.get('ttclid')? 'tiktok' : q.get('gclid')? 'google' : q.get('sccid')? 'snapchat'
      : /fb|facebook/.test(u)? 'facebook' : /ig|insta/.test(u)? 'instagram' : /tiktok/.test(u)? 'tiktok' : /google/.test(u)? 'google' : /snap/.test(u)? 'snapchat' : '';
    if(p) sessionStorage.setItem('pk_plat', p);
    return p || sessionStorage.getItem('pk_plat') || '';
  }catch(e){ return ''; }
})();

/* ---------- fiche produit : galerie, offres par quantité, formulaire sur la page ---------- */
viewProduct = function(id){
  const p = PBY[id]; if(!p) return shopShell(`<div class="container"><div class="card empty" style="margin-top:20px">${t('Produit introuvable')}</div></div>`,'shop');
  const min = p.minQty||1;
  S.ui.pdp = S.ui.pdp && S.ui.pdp.id===p.id ? S.ui.pdp : {id:p.id, q:min, v: p.variants? p.variants[0].id : null, img:0};
  const d=S.ui.pdp; d.q=Math.max(min, d.q);
  const st = stockInfo(p.id), ok = canOrder(p), quote = p.status==='devis' || !p.price;
  const v = p.variants? p.variants.find(x=>x.id===d.v) : null;
  const unit = unitPrice(p, d.v, d.q), base = v? v.price : p.price;
  const imgs = p.images||[];
  const related = PRODUCTS.filter(x=>x.id!==p.id && x.cats.some(c=>p.cats.includes(c) && c!=='tout')).slice(0,5);
  const tiers = !p.variants && (p.tiers||[]).length? [{min, price:p.price, badge:''}, ...p.tiers.slice().sort((a,b)=>a.min-b.min)] : [];
  const cur = tiers.filter(x=>d.q>=x.min).pop();
  const options = quote? '' : `
    ${p.variants? `<div class="tj-group"><legend>${t('Variante')}</legend><div class="row wrap">${p.variants.map(x=>`<button type="button" class="var-opt ${d.v===x.id?'on':''}" data-a="pdpVar" data-v="${esc(x.id)}" aria-pressed="${d.v===x.id}">${esc(x.label)} · ${dzd(x.price)}</button>`).join('')}</div></div>`:''}
    ${tiers.length? `<div class="tj-group"><legend>${t('Offres par quantité')}</legend><div class="tj-offers">${tiers.map(x=>`<button type="button" class="tj-offer ${cur===x?'on':''}" data-a="pdpTier" data-v="${x.min}" aria-pressed="${cur===x}"><span class="dot"></span><span class="txt"><strong>${x.min===min && min===1? t('1 pièce') : t('À partir de')+' '+x.min}</strong>${x.badge?`<em>${esc(x.badge)}</em>`:''}</span><b class="num">${dzd(x.price)}<small> / ${t('pièce')}</small></b></button>`).join('')}</div></div>`:''}
    <div class="tj-field tj-qty"><label for="pdpQ">${t('Quantité')}${min>1? ' ('+t('minimum')+' '+min+')':''}</label><div class="qty"><button type="button" data-a="pdpQ" data-v="-1" aria-label="${t('moins')}">−</button><input id="pdpQ" type="number" min="${min}" value="${d.q}" aria-label="${t('Quantité')}" data-ch="pdpQset"><button type="button" data-a="pdpQ" data-v="1" aria-label="${t('plus')}">+</button></div>${p.freeShipQty>0? `<small class="${d.q>=p.freeShipQty?'up':'muted'}">${ic('truck','sm')} ${t('Livraison gratuite à partir de')} ${p.freeShipQty} ${t('pièces')}</small>`:''}</div>`;
  /* l'ordre des blocs, le côté de la galerie, la description et les produits associés se règlent dans ERP › Boutique */
  const lay = pdpLayout(), B = {
    badges: `<div class="row wrap">${p.badge?`<span class="badge red">${esc(p.badge)}</span>`:''}${p.cats.map(c=>`<a class="badge kraft" href="#/categorie/${c}">${esc(catName(CATS.find(x=>x.id===c)||CATS[0]))}</a>`).join('')}</div>`,
    title: `<h1>${esc(S.lang==='ar' && p.nameAr? p.nameAr : p.name)}</h1>`,
    price: `<div class="price num">${quote? t('Prix sur devis') : dzd(unit)}${!quote && (p.oldPrice>unit || unit<base)? ` <s class="tj-old">${dzd(Math.max(p.oldPrice||0, base))}</s> <span class="badge red">−${Math.round((1-unit/Math.max(p.oldPrice||0, base))*100)} %</span>`:''}</div>`,
    short: `${p.short? `<p class="muted" style="margin:0">${esc(p.short)}</p>`:''}`,
    meta: `<div class="row small wrap"><span class="badge">${t('Conditionnement')} : ${p.pack} ${t('pièces')}</span><span class="badge">${t('Réf.')} ${esc(p.sku)}</span>${quote?'':p.status!=='rupture'? `<span class="badge green">${t('En stock')}</span>` : p.onDemand? `<span class="badge amber">${t('Sur commande')}</span>` : `<span class="badge red">${t('Rupture')}</span>`}</div>`,
    pack: `${p.packItems? `<div class="card card-b small"><b>${t('Contenu du pack')}</b><ul style="margin:6px 0 0;padding-inline-start:18px">${p.packItems.filter(c=>PBY[c.pid]).map(c=>`<li>${c.q} × ${esc(PBY[c.pid].name)}</li>`).join('')}</ul></div>`:''}`,
    form: `${quote? `<div class="lock-note">${ic('phone','sm')} ${t('Ce pack est composé sur mesure : contactez-nous pour un devis.')}</div><a class="btn wa lg" href="https://wa.me/213549593160" target="_blank" rel="noopener">${ic('wa')} ${t('Demander sur WhatsApp')}</a>` : codForm(codItems(), {product:p, options, addCart:ok, ok})}`
  };
  const desc = p.desc? `<section class="tj-desc"><h2>${t('Description du produit')}</h2><div>${richHtml(p.desc)}</div></section>`:'';
  return shopShell(`<div class="container">
    <div class="row small muted" style="margin-top:16px"><a href="#/">${t('Accueil')}</a> ${ic('chevR','sm flip')} <a href="#/categorie/${p.cats[0]}">${esc(catName(CATS.find(c=>c.id===p.cats[0])||CATS[0]))}</a> ${ic('chevR','sm flip')} ${esc(p.name)}</div>
    <div class="pdp ${lay.galleryRight?'gal-right':''}">
      <div class="tj-gal"><div class="gal">${imgs.length? `<img src="${esc(imgs[Math.min(d.img,imgs.length-1)])}" alt="${esc(p.name)}">` : prodArt(p,340)}</div>${imgs.length>1? `<div class="tj-thumbs">${imgs.map((u,i)=>`<button class="${i===d.img?'on':''}" data-a="pdpImg" data-v="${i}" aria-label="${t('Photo')} ${i+1}"><img src="${esc(u)}" alt="" loading="lazy"></button>`).join('')}</div>`:''}</div>
      <div class="col" style="gap:14px">${lay.order.map(k=>k==='desc'? desc : B[k]||'').join('')}</div>
    </div>
    ${lay.order.includes('desc')? '' : desc}
    ${lay.related!==false && related.length? `<div class="sec-t"><h2>${t('Produits associés')}</h2></div><div class="pgrid">${related.map(pcard).join('')}</div>`:''}
  </div>`,'shop');
};
A.pdpImg = (el)=>{ S.ui.pdp.img=+el.dataset.v; render(); };
A.pdpTier = (el)=>{ S.ui.pdp.q=+el.dataset.v; render(); };
A.pdpQ = (el)=>{ const p=PBY[S.ui.pdp.id]; S.ui.pdp.q=Math.max(p.minQty||1, (+val('pdpQ')||1)+(+el.dataset.v)); render(); };
CH.pdpQset = (el)=>{ const p=PBY[S.ui.pdp.id]; S.ui.pdp.q=Math.max(p.minQty||1, +el.value||1); render(); };
A.pdpBuy = ()=>{ const f=document.getElementById('tjCod'); if(f){ f.scrollIntoView({behavior:'smooth', block:'start'}); const i=document.getElementById('coName'); if(i) i.focus({preventScroll:true}); } };

/* ---------- commande depuis le panier : même formulaire ---------- */
viewCheckout = function(){
  if(!S.cart.length) return viewCart();
  return shopShell(`<div class="container" style="margin-top:20px;max-width:720px">
    <div class="steps" aria-hidden="true"><div class="s done"><div class="c">1</div>${t('Panier')}</div><div class="s cur"><div class="c">2</div>${t('Vos informations')}</div><div class="s"><div class="c">3</div>${t('Confirmation')}</div></div>
    ${codForm(S.cart, {})}
    <p style="text-align:center"><a class="small" href="#/panier">${t('Modifier mon panier')}</a></p>
  </div>`,'shop');
};
viewConfirm = function(ref){
  const o = S.lastOrder && S.lastOrder.ref===ref? S.lastOrder : null;
  return shopShell(`<div class="container" style="margin-top:20px;max-width:760px">
    <div class="steps" aria-hidden="true"><div class="s done"><div class="c">1</div>${t('Panier')}</div><div class="s done"><div class="c">2</div>${t('Vos informations')}</div><div class="s done"><div class="c">3</div>${t('Confirmation')}</div></div>
    <div class="card card-b col" style="gap:14px;text-align:center;align-items:center">
      <span style="width:62px;height:62px;border-radius:50%;background:var(--green-l);color:var(--green);display:grid;place-items:center">${ic('check','lg')}</span>
      <h1 style="font-size:24px">${t('Merci ! Votre commande est enregistrée')}</h1>
      <div class="badge dark" style="font-size:14px;padding:6px 14px">${t('N° de commande')} : ${esc(ref||'')}</div>
      <p class="muted" style="margin:0;max-width:460px">${t('Un agent PackLik va vous appeler pour confirmer votre commande. Gardez votre téléphone à portée de main.')}</p>
    </div>
    ${o? `<div class="card card-b" style="margin-top:14px">
      ${o.items.filter(it=>PBY[it.pid]).map(it=>`<div class="row between small" style="padding:4px 0"><span>${it.q} × ${esc(PBY[it.pid].name)}</span><b class="num">${dzd(it.price*it.q)}</b></div>`).join('')}
      <div class="sumbox" style="margin-top:8px"><div class="ln"><span>${t('Livraison')} · ${esc(wName(o.wilaya))} · ${o.delivery==='home'?t('À domicile'):t('Bureau de livraison (stop desk)')}</span><span class="num">${o.freeShip? t('Gratuite') : dzd(shopFeeOf(o))}</span></div><div class="ln tot"><span>${t('Total à payer à la livraison')}</span><span class="num">${dzd(shopTotal(o))}</span></div></div>
      <p class="small muted">${esc(o.customer.name)} · <span dir="ltr">${esc(o.customer.phone)}</span> · ${esc(cName(o.commune))}</p>
    </div>`:''}
    <div class="row wrap" style="margin-top:14px;justify-content:center"><a class="btn kraft" href="#/boutique">${t('Continuer mes achats')}</a></div>
  </div>`,'shop');
};
/* suivi public : le serveur ne répond que si téléphone et numéro de commande correspondent */
viewTrack = function(){
  const r = S.ui.track || {}; const o = r.order;
  return shopShell(`<div class="container" style="margin-top:20px;max-width:760px">
    <h1 style="font-size:24px">${t('Suivi de commande')}</h1>
    <p class="muted">${t('Saisissez votre numéro de téléphone et votre numéro de commande.')}</p>
    <form class="card card-b grid3" data-sub="track" style="align-items:end">
      <div class="field"><label for="trP">${t('Téléphone')}</label><input class="input" id="trP" value="${esc(r.phone||'')}" dir="ltr" inputmode="numeric" placeholder="0550 12 34 56"></div>
      <div class="field"><label for="trR">${t('N° de commande')}</label><input class="input" id="trR" value="${esc(r.ref||'')}" dir="ltr" placeholder="PK-1001"></div>
      <button class="btn primary" type="submit">${ic('search','sm')} ${t('Rechercher')}</button>
    </form>
    ${r.err? `<div class="card empty" style="margin-top:14px">${ic('alert')}<div>${esc(t(r.err))}</div></div>`:''}
    ${o? `<div class="card card-b" style="margin-top:14px"><div class="row between"><b>${esc(o.ref)}</b><span class="kpill" style="${kPillStyle(kColor(o))}">${kLabel(o)}</span></div>${trackSteps(o)}<div class="timeline">${o.history.slice().reverse().map(h=>`<div class="tl ${esc(h.color)}"><span class="d"></span><div class="tx"><b>${esc(t(h.action))}</b> <span class="muted">· ${fDT(h.at)}</span></div></div>`).join('')}</div>${o.tracking?`<p class="small">${t('Numéro de suivi')} : <b dir="ltr">${esc(o.tracking)}</b></p>`:''}</div>`:''}
  </div>`,'track');
};
SUB.track = async()=>{
  const phone=val('trP'), ref=val('trR').trim().toUpperCase();
  try{ const r = await api('track&ref='+encodeURIComponent(ref)+'&phone='+encodeURIComponent(phone.replace(/\D/g,''))); S.ui.track={phone, ref, order:normDoc('orders', r.order), err:''}; }
  catch(e){ S.ui.track={phone, ref, order:null, err:e.message}; }
  render();
};
viewAccount = ()=>viewTrack();

/* ============================================================
   Fiche produit du back-office (onglets, photos, variantes, offres, livraison)
   ============================================================ */
const PE_TABS = [['gen','Général'],['price','Prix et stock'],['opts','Variantes'],['offers','Offres par quantité'],['ship','Livraison'],['desc','Description']];
function peSet(path, v){ const ks=path.split('.'); let o=S.ui.pe; for(let i=0;i<ks.length-1;i++) o=o[ks[i]]; o[ks[ks.length-1]]=v; }
document.addEventListener('input', e=>{ const el=e.target.closest('[data-pe]'); if(!el || !S.ui.pe) return; peSet(el.dataset.pe, el.type==='checkbox'? el.checked : el.type==='number'? (el.value===''? '' : +el.value) : el.value); const m=document.getElementById('peMargin'); if(m) m.textContent=peMargin(); });
function peMargin(){ const d=S.ui.pe; const m=(+d.price||0)-(+d.cost||0); return d.price? dzd(m)+' · '+fmtPct(pct(m, +d.price)) : '—'; }
function peHtml(){
  const d=S.ui.pe, sc=seesCost(), tab=d._tab;
  const inp=(path,label,attrs,val2)=>`<div class="field"><label>${t(label)}<input class="input" data-pe="${path}" value="${esc(val2===undefined? (path.split('.').reduce((o,k)=>o==null?o:o[k], d) ?? '') : val2)}" ${attrs||''}></label></div>`;
  const num='type="number" min="0" inputmode="numeric"';
  let body;
  if(tab==='gen') body = `
    <div class="pe-drop"><label class="pe-add">${ic('upload','lg')}<b>${t('Glissez les photos ici ou cliquez pour les envoyer')}</b><span class="small muted">${t('Jusqu\'à 8 photos · JPG / PNG / WEBP · 4 Mo · la première est la photo principale')}</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple data-ch="peFiles" hidden></label>
      ${d.images.length? `<div class="pe-imgs">${d.images.map((u,i)=>`<div class="pe-img ${i===0?'main':''}"><img src="${esc(u)}" alt="">${i===0?`<span class="badge dark">${t('Principale')}</span>`:`<button type="button" class="kico" data-a="peMain" data-i="${i}" title="${t('Définir comme photo principale')}" aria-label="${t('Définir comme photo principale')}">${ic('star','sm')}</button>`}<button type="button" class="kico x" data-a="peImgDel" data-i="${i}" title="${t('Retirer')}" aria-label="${t('Retirer la photo')}">${ic('x','sm')}</button></div>`).join('')}</div>`:''}</div>
    <div class="grid2">${inp('name','Nom du produit *')}${inp('nameAr','Nom en arabe','dir="rtl"')}${inp('sku','Référence (SKU)')}${inp('pack','Conditionnement (pièces par lot)',num)}</div>
    <fieldset class="tj-group"><legend>${t('Catégories')}</legend><div class="row wrap" style="gap:6px">${CATS.map(c=>`<label class="pe-chip"><input type="checkbox" data-pecat="${c.id}" ${d.cats.includes(c.id)?'checked':''}> ${esc(catName(c))}</label>`).join('')}</div></fieldset>`;
  else if(tab==='price') body = `
    <div class="grid3">${inp('price','Prix de vente (DZD)',num)}${inp('oldPrice','Prix avant remise (barré)',num)}${sc? inp('cost','Prix d\'achat (DZD)',num) : ''}</div>
    ${sc? `<div class="small">${t('Marge unitaire')} : <b id="peMargin" class="num">${peMargin()}</b></div>`:`<div class="lock-note">${ic('lock','sm')} ${t('Prix d\'achat et marges masqués pour votre rôle.')}</div>`}
    <div class="grid3">${inp('badge','Texte de l\'offre (badge)','placeholder="'+t('ex. Promo, Nouveau')+'"')}${inp('minQty','Quantité minimale de commande',num)}${inp('weight','Poids unitaire (kg)',num)}</div>
    <div class="grid3">${inp('stock','Quantité en stock',num)}${inp('threshold','Alerte sous (pièces)',num)}<label class="check" style="align-self:end;min-height:40px"><input type="checkbox" data-pe="onDemand" ${d.onDemand?'checked':''}> ${t('Vendre même sans stock (sur commande)')}</label></div>
    ${d.id? `<div class="small muted">${t('Un changement de stock ici est inscrit comme ajustement dans le journal de stock.')}</div>`:''}`;
  else if(tab==='opts') body = `
    <p class="small muted" style="margin:0">${t('Exemple : 3 KG / 5 KG, ou une couleur. Chaque variante a son prix et son stock ; le prix de base n\'est alors plus utilisé.')}</p>
    ${d.variants.map((v,i)=>`<div class="pe-row">${inp('variants.'+i+'.label','Nom')}${inp('variants.'+i+'.price','Prix',num)}${sc? inp('variants.'+i+'.cost','Prix d\'achat',num):''}${inp('variants.'+i+'.stock','Stock',num)}<button type="button" class="btn icon ghost" data-a="peRowDel" data-k="variants" data-i="${i}" aria-label="${t('Retirer')}">${ic('trash','sm')}</button></div>`).join('')}
    <button type="button" class="btn sm" data-a="peRowAdd" data-k="variants" style="align-self:start">${ic('plus','sm')} ${t('Ajouter une variante')}</button>`;
  else if(tab==='offers') body = `
    <p class="small muted" style="margin:0">${t('Prix dégressifs : affichés comme des cartes à choisir sur la fiche produit. Le prix est celui d\'une pièce à partir de la quantité indiquée.')}</p>
    ${d.variants.length? `<div class="lock-note">${t('Les offres par quantité ne s\'appliquent pas aux produits à variantes.')}</div>`:''}
    ${d.tiers.map((x,i)=>`<div class="pe-row">${inp('tiers.'+i+'.min','À partir de (pièces)',num)}${inp('tiers.'+i+'.price','Prix par pièce',num)}${inp('tiers.'+i+'.badge','Badge','placeholder="'+t('ex. Le plus demandé')+'"')}<button type="button" class="btn icon ghost" data-a="peRowDel" data-k="tiers" data-i="${i}" aria-label="${t('Retirer')}">${ic('trash','sm')}</button></div>`).join('')}
    <button type="button" class="btn sm" data-a="peRowAdd" data-k="tiers" style="align-self:start">${ic('plus','sm')} ${t('Ajouter une offre')}</button>`;
  else if(tab==='ship') body = `
    <div class="grid2">${inp('freeShipQty','Livraison gratuite à partir de (pièces)',num+' placeholder="'+t('vide = jamais')+'"')}</div>
    <p class="small muted" style="margin:0">${t('Les tarifs par wilaya et les sociétés de livraison se règlent dans le module Livraison. Le poids du produit (onglet Prix et stock) sert au calcul du surpoids.')}</p>`;
  else body = `
    <div class="field"><label>${t('Description courte')} <span class="muted">(${(d.short||'').length} / 160)</span><input class="input" data-pe="short" maxlength="160" value="${esc(d.short||'')}"></label></div>
    <div class="field"><label>${t('Description complète')}<textarea class="input" data-pe="desc" rows="9" placeholder="${t('Avantages, dimensions, matière, usage…')}">${esc(d.desc||'')}</textarea></label></div>`;
  return modalTpl(d.id? t('Modifier le produit') : t('Nouveau produit'),
    `<div class="pe-tabs" role="tablist">${PE_TABS.map(([k,l],i)=>`<button role="tab" aria-selected="${tab===k}" class="${tab===k?'on':''}" data-a="peTab" data-v="${k}"><span class="n">${i+1}</span>${t(l)}</button>`).join('')}</div><div class="col" style="gap:14px;min-height:300px">${body}</div>`,
    `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn" data-a="peSave" data-v="masqué">${t('Enregistrer comme brouillon')}</button><button class="btn primary" data-a="peSave" data-v="actif">${t('Enregistrer et publier')}</button>`, true);
}
function peDraw(){ S.modal={html:peHtml(), wide:true}; renderOverlay(); }
A.prodEdit = (el)=>{
  const id=+el.dataset.id; const p = id? PBY[id] : {id:0, sku:'PK-'+String(Math.max(0,...PRODUCTS.map(x=>x.id))+1).padStart(3,'0'), name:'', nameAr:'', price:0, cost:0, cats:[], pack:100, threshold:30, weight:500, status:'actif', stock:0, onDemand:false};
  S.ui.pe = {...clone(p), images:(p.images||[]).slice(), variants:clone(p.variants||[]), tiers:clone(p.tiers||[]), oldPrice:p.oldPrice||'', minQty:p.minQty||1, freeShipQty:p.freeShipQty||'', badge:p.badge||'', short:p.short||'', desc:p.desc||'', _tab:'gen'};
  peDraw();
};
A.peTab = (el)=>{ S.ui.pe._tab=el.dataset.v; peDraw(); };
A.peRowAdd = (el)=>{ const k=el.dataset.k; S.ui.pe[k].push(k==='variants'? {id:uid(), label:'', price:+S.ui.pe.price||0, cost:+S.ui.pe.cost||0, stock:0} : {min:(S.ui.pe.tiers.length? +S.ui.pe.tiers[S.ui.pe.tiers.length-1].min+2 : 3), price:'', badge:''}); peDraw(); };
A.peRowDel = (el)=>{ S.ui.pe[el.dataset.k].splice(+el.dataset.i,1); peDraw(); };
A.peMain = (el)=>{ const a=S.ui.pe.images; a.unshift(a.splice(+el.dataset.i,1)[0]); peDraw(); };
A.peImgDel = (el)=>{ S.ui.pe.images.splice(+el.dataset.i,1); peDraw(); };
document.addEventListener('change', e=>{ const el=e.target.closest('[data-pecat]'); if(!el || !S.ui.pe) return; const c=S.ui.pe.cats, i=c.indexOf(el.dataset.pecat); el.checked? (i<0 && c.push(el.dataset.pecat)) : (i>=0 && c.splice(i,1)); });
async function peUpload(files){
  const d=S.ui.pe;
  for(const f of [...files].slice(0, 8-d.images.length)){
    const fd=new FormData(); fd.append('file', f);
    try{ const res=await fetch('api/?r=upload', {method:'POST', credentials:'same-origin', headers:{'X-CSRF':NET.csrf}, body:fd}); const j=await res.json(); if(!res.ok) throw new Error(j.error||'Envoi impossible'); d.images.push(j.url); }
    catch(e){ toast(esc(f.name+' : '+e.message),'bad'); }
  }
  peDraw();
}
CH.peFiles = (el)=>peUpload(el.files);
document.addEventListener('dragover', e=>{ if(e.target.closest('.pe-drop')) e.preventDefault(); });
document.addEventListener('drop', e=>{ if(e.target.closest('.pe-drop') && S.ui.pe){ e.preventDefault(); peUpload(e.dataTransfer.files); } });
A.peSave = (el)=>{
  const d=S.ui.pe, name=(d.name||'').trim(); if(!name){ d._tab='gen'; peDraw(); toast(t('Nom requis'),'bad'); return; }
  const variants = d.variants.filter(v=>(v.label||'').trim()).map(v=>({id:v.id||uid(), label:v.label.trim(), price:+v.price||0, cost:+v.cost||0, stock:+v.stock||0}));
  const tiers = d.tiers.filter(x=>+x.min>1 && +x.price>0).map(x=>({min:+x.min, price:+x.price, badge:(x.badge||'').trim()})).sort((a,b)=>a.min-b.min);
  let p = d.id? PBY[d.id] : null; const isNew=!p;
  if(!p){ p={id:Math.max(0,...PRODUCTS.map(x=>x.id))+1, supplierId:1, upsells:[], packItems:null, isNew:true, featured:false, priceHistory:[], lastSale:null, sold30:0, stock:0, cost:0, price:0}; PRODUCTS.push(p); PBY[p.id]=p; }
  const price=+d.price||0, cost = seesCost()? (+d.cost||0) : p.cost;
  if(price!==p.price || cost!==p.cost) p.priceHistory.push({at:Date.now(), sale:price, cost});
  const stock=+d.stock||0; if(!isNew && stock!==p.stock) stockMove(p.id,'ajustement', stock-p.stock, 'FICHE', 'Modifié depuis la fiche produit');
  Object.assign(p, {name, nameAr:(d.nameAr||'').trim(), sku:(d.sku||'').trim(), pack:+d.pack||1, price, cost, oldPrice:+d.oldPrice||0, badge:(d.badge||'').trim(), minQty:Math.max(1,+d.minQty||1),
    stock, threshold:+d.threshold||0, onDemand:!!d.onDemand, weight:+d.weight||0, cats:d.cats.length? d.cats.slice() : ['tout'], images:d.images.slice(),
    variants: variants.length? variants : null, tiers, freeShipQty:+d.freeShipQty||0, short:(d.short||'').trim(), desc:(d.desc||'').trim(),
    status: el.dataset.v==='masqué'? 'masqué' : !price && !variants.length? 'devis' : 'actif'});
  log(isNew?'Produit créé':'Produit modifié', p.sku, name); S.ui.pe=null; closeModal();
  toast(p.status==='masqué'? t('Brouillon enregistré (non visible sur la boutique)') : t('Produit enregistré — visible sur la boutique'),'ok'); render();
};

/* accueil : vraie photo du produit mis en avant quand le catalogue en a une */
function heroPhoto(id){ const p=PBY[id]; return p && p.images && p.images.length? `<img src="${esc(p.images[0])}" alt="${esc(p.name)}" style="width:100%;aspect-ratio:1/1;object-fit:contain;background:#fff;border-radius:18px;box-shadow:var(--sh2)">` : ''; }

/* ---------- fiche produit : photo en plein écran (clic ou appui sur la photo) ---------- */
function lbOpen(){
  const p=PBY[S.ui.pdp.id], imgs=(p && p.images)||[]; if(!imgs.length) return;
  let k=Math.min(S.ui.pdp.img||0, imgs.length-1), x0=null;
  const rtl=document.documentElement.dir==='rtl', box=document.createElement('div');
  box.className='pklb'; box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true'); box.setAttribute('aria-label',p.name);
  box.innerHTML=`<img alt="${esc(p.name)}">${imgs.length>1? `<button class="pklb-nav pklb-prev" aria-label="${t('Précédent')}">${ic('chevR')}</button><button class="pklb-nav pklb-next" aria-label="${t('Suivant')}">${ic('chevR')}</button><div class="pklb-n num"></div>`:''}<button class="pklb-x" aria-label="${t('Fermer')}">${ic('x')}</button>`;
  const img=box.querySelector('img'), n=box.querySelector('.pklb-n');
  const show=i=>{ k=(i+imgs.length)%imgs.length; img.src=imgs[k]; if(n) n.textContent=(k+1)+' / '+imgs.length; };
  const close=()=>{ box.remove(); document.removeEventListener('keydown', key, true); document.body.style.overflow=''; S.ui.pdp.img=k; render(); };
  const key=e=>{ e.stopPropagation(); if(e.key==='Escape') close(); if(e.key==='ArrowRight') show(k+(rtl?-1:1)); if(e.key==='ArrowLeft') show(k+(rtl?1:-1)); };
  box.addEventListener('click', e=>{ const b=e.target.closest('button'); if(e.target===box || (b && b.classList.contains('pklb-x'))) return close(); if(b) show(k+(b.classList.contains('pklb-next')?1:-1)); });
  box.addEventListener('touchstart', e=>{ x0=e.touches.length===1? e.touches[0].clientX : null; }, {passive:true});
  box.addEventListener('touchend', e=>{ if(x0==null) return; const dx=e.changedTouches[0].clientX-x0; x0=null; if(Math.abs(dx)>50 && imgs.length>1) show(k+((dx<0)!==rtl?1:-1)); });
  document.addEventListener('keydown', key, true);
  document.body.style.overflow='hidden'; document.body.appendChild(box); show(k); box.querySelector('.pklb-x').focus();
}
// pas dans l'aperçu de l'éditeur de pages
document.addEventListener('click', e=>{ if(e.target.closest('.tj-gal .gal img') && !document.documentElement.classList.contains('pe-preview')) lbOpen(); });
