"use strict";
/* ============================================================
   Formulaire « Ajouter une commande / Modifier » (mise en page Kando) et sélecteur de
   produit présenté comme la fiche produit (photos, prix, variantes, offres, quantité).
   Le sélecteur sert aussi dans la fiche d'appel pour ajouter un produit au panier.
   ============================================================ */
const kCost = (p, v) => v && p.variants? ((p.variants.find(x=>x.id===v)||{}).cost||0) : (p.cost||0);
function kfBlank(){ return {id:null, ref:'', status:'pending', exchange:false, returnedProduct:'', note:'', name:'', phone:'', phone2:'', address:'', carrier:autoCarrier({wilaya:16}), delivery:'home', wilaya:16, commune:'', items:[], weight:'', weightManual:false, fee:'', feeManual:false, discount:'', discountType:'amount', source:'Téléphone'}; }
A.kForm = ()=>{ S.ui.kc.pop=''; S.ui.kf = kfBlank(); S.ui.pk = {target:'form', idx:-1, q:'', cat:'', pid:null}; kFormDraw(); };
A.manualOrder = A.kForm;
A.kEdit = el=>{
  const o=ORDERS.find(x=>x.id===+el.dataset.id); if(!o) return; const c=CBY[o.customerId]||{};
  if(!kCanConf(o) && !kCanShip()){ toast(t('Action non autorisée pour votre rôle.'),'bad'); return; }
  if(SHIP_ST.includes(o.status) && carrierHasApi(carrierOf(o)) && o.tracking){ toast(t('Commande chez le transporteur — non modifiable'),'bad'); return; }
  S.ui.kf = {id:o.id, ref:o.ref, status:confDef(o).id, exchange:!!o.exchange, returnedProduct:o.returnedProduct||'', note:o.note||'', name:c.name||'', phone:c.phone||'', phone2:c.phone2||'', address:o.address||'', carrier:o.carrier||'', delivery:o.delivery, wilaya:o.wilaya, commune:o.commune||'',
    items:o.items.map(i=>({pid:i.pid, v:i.v, q:i.q, price:i.price})), weight:o.weightFixed||'', weightManual:!!o.weightFixed, fee:o.feeFixed!=null? o.feeFixed : '', feeManual:o.feeFixed!=null && !SHIP_ST.includes(o.status), discount:o.discount||'', discountType:o.discountType||'percent', source:o.source};
  S.ui.pk=null; kFormDraw();
};
function kfQuote(d){
  const items=d.items.filter(i=>PBY[i.pid]).map(i=>({pid:i.pid, v:i.v, q:Math.max(1,+i.q||1), price:+i.price||0}));
  const tmp={wilaya:+d.wilaya, delivery:d.delivery, carrier:d.carrier, items};
  const sub=linesTotal(items), fee = d.feeManual? (+d.fee||0) : (items.length? feeOf(tmp) : 0);
  const disc = d.discountType==='amount'? Math.min(sub, +d.discount||0) : Math.round(sub*(+d.discount||0)/100);
  const w = d.weightManual && +d.weight>0? +d.weight : (items.length? _orderWeight({items}) : 0);
  return {sub, fee, disc, total:sub-disc+fee, w};
}
function kFormHtml(){
  const d=S.ui.kf, q=kfQuote(d), req='<span class="req">*</span>';
  const L=(label, inner, cls)=>`<div class="kff ${cls||''}"><label>${t(label)}${label.endsWith('*')?'':''}</label>${inner}</div>`;
  const pid = d.items.map((it,i)=>{ const p=PBY[it.pid]; return `<div class="kfitem">
    <div class="kff kfprod"><label>${t('Produit')}${req}</label><button class="kfpick" data-a="pkForm" data-i="${i}">${p? `${prodArt(p,34)}<span class="trunc">${esc(p.name)}</span>` : `<span class="muted">${t('Choisir un produit')}</span>`} ${ic('chevD','sm')}</button></div>
    <div class="kff"><label>${t('Réf (SKU)')}</label><input class="input" dir="ltr" value="${esc(p?p.sku:'')}" readonly></div>
    <div class="kff"><label>${t('Variantes')}</label>${p && p.variants? `<select class="select ${it.v?'':'warn'}" data-kfi="${i}" data-f="v">${p.variants.map(v=>`<option value="${esc(v.id)}" ${v.id===it.v?'selected':''}>${esc(v.label)} · ${t('Stock')} ${v.stock}</option>`).join('')}</select>` : `<input class="input" value="—" readonly>`}</div>
    <div class="kff"><label>${t('Prix')}${req}</label><input class="input num" type="number" min="0" dir="ltr" value="${esc(it.price)}" data-kfi="${i}" data-f="price"></div>
    <div class="kff kfqty"><label>${t('Quantité')}${req}</label><input class="input num" type="number" min="1" dir="ltr" value="${esc(it.q)}" data-kfi="${i}" data-f="q"></div>
    <div class="kff kfdel">${d.items.length>1? `<button class="kico red" data-a="kfDel" data-i="${i}" aria-label="${t('Retirer')}">${ic('trash','sm')}</button>`:''}</div></div>`; }).join('');
  return modalTpl(d.id? t('Modifier')+' · '+d.ref : t('Ajouter une commande'), `<div class="kform">
    <div class="kfgrid">
      ${L('Commande N°', `<div class="kfic">${ic('tag','sm')}<input class="input" value="${esc(d.ref||t('Automatique'))}" readonly></div>`)}
      ${L('Statut', `<select class="select" data-kf="status">${kList('conf').map(s=>`<option value="${esc(s.id)}" ${s.id===d.status?'selected':''}>${esc(t(s.label))}</option>`).join('')}</select>`)}
      ${L('Échange ?', `<div class="row" style="gap:8px;flex-wrap:nowrap"><input type="checkbox" class="kfchk" ${d.exchange?'checked':''} data-kf="exchange"><input class="input" placeholder="${t('Produit retourné')}" value="${esc(d.returnedProduct)}" data-kf="returnedProduct" ${d.exchange?'':'disabled'}></div>`)}
      ${L('Notes', `<textarea class="input" rows="1" data-kf="note">${esc(d.note)}</textarea>`)}
    </div>
    <div class="kfgrid">
      ${L('Nom complet', `<input class="input" value="${esc(d.name)}" data-kf="name" autocomplete="off">`)}
      ${L('Téléphone', `<div class="kfic">${ic('phone','sm')}<input class="input" dir="ltr" inputmode="numeric" value="${esc(d.phone)}" data-kf="phone"></div>`)}
      ${L('Téléphone 02', `<div class="kfic">${ic('phone','sm')}<input class="input" dir="ltr" inputmode="numeric" value="${esc(d.phone2)}" data-kf="phone2"></div>`)}
      ${L('Adresse', `<div class="kfic">${ic('pin','sm')}<input class="input" value="${esc(d.address)}" data-kf="address"></div>`)}
    </div>
    <div class="kfgrid">
      ${L('Société de livraison', `<select class="select" data-kf="carrier"><option value="">— ${t('Choisir')} —</option>${CARRIERS.filter(c=>c.connected||c.id===d.carrier).map(c=>`<option value="${esc(c.id)}" ${c.id===d.carrier?'selected':''}>${esc(kCarrierName(c))}</option>`).join('')}</select>`)}
      ${L('Type de livraison', `<div class="kftoggle"><button class="${d.delivery==='home'?'on':''}" data-a="kfDel2" data-v="home">${t('Domicile')}</button><button class="${d.delivery==='desk'?'on':''}" data-a="kfDel2" data-v="desk">${t('Bureau')}</button></div>`)}
      ${L('Wilaya', `<select class="select" data-kf="wilaya">${WILAYAS.filter(w=>w.active||w.id===+d.wilaya).map(w=>`<option value="${w.id}" ${w.id===+d.wilaya?'selected':''}>${w.code} - ${esc(wName(w.id))}</option>`).join('')}</select>`)}
      ${L('Commune', `<select class="select" data-kf="commune">${communeOptions(d.wilaya, d.commune)}</select>`)}
    </div>
    <div class="kfitems">${pid || `<p class="small muted" style="margin:0;text-align:center">${t('Aucun produit')}</p>`}<div style="text-align:center"><button class="kfadd" data-a="pkForm" data-i="-1" aria-label="${t('Ajouter un produit')}">${ic('plus','sm')}</button></div></div>
    <div class="kfgrid kftot">
      ${L('Sub total', `<input class="input num" dir="ltr" id="kfSub" value="${dzd(q.sub)}" readonly>`)}
      ${L('Poids (kg)', `<input class="input num" type="number" min="0" step="0.1" dir="ltr" value="${d.weightManual? esc(d.weight) : ''}" placeholder="${(Math.round(q.w*10)/10)}" data-kf="weight">`)}
      ${L('Prix de livraison', `<input class="input num" type="number" min="0" dir="ltr" value="${d.feeManual? esc(d.fee) : ''}" placeholder="${q.fee}" data-kf="fee">`)}
      ${L('Remise', `<div class="row" style="gap:6px;flex-wrap:nowrap"><input class="input num" type="number" min="0" dir="ltr" placeholder="0" value="${esc(d.discount)}" data-kf="discount"><select class="select" style="width:64px" data-kf="discountType"><option value="amount" ${d.discountType==='amount'?'selected':''}>DA</option><option value="percent" ${d.discountType==='percent'?'selected':''}>%</option></select></div>`)}
      ${L('Prix total', `<input class="input num kftotal" dir="ltr" id="kfTot" value="${dzd(q.total)}" readonly>`)}
    </div></div>`,
    `<button class="btn red" data-a="closeModal">${ic('x','sm')} ${t('Annuler')}</button><button class="btn green" data-a="kfSave">${t('Enregistrer')}</button>`, true);
}
function kFormDraw(){
  const html = S.ui.pk && S.ui.pk.target==='form' && S.ui.pk.open? kPickerHtml() : kFormHtml();
  S.modal={html, wide:true}; renderOverlay();
  const q=document.getElementById('pkQ'); if(q && S.ui.pk && S.ui.pk.focusQ){ q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
}
function kfTotals(){ const q=kfQuote(S.ui.kf); const s=document.getElementById('kfSub'), tt=document.getElementById('kfTot'); if(s) s.value=dzd(q.sub); if(tt) tt.value=dzd(q.total); document.querySelectorAll('[data-kf=fee]').forEach(e=>e.placeholder=q.fee); document.querySelectorAll('[data-kf=weight]').forEach(e=>e.placeholder=Math.round(q.w*10)/10); }
document.addEventListener('input', e=>{
  const d=S.ui.kf; if(!d) return;
  const el=e.target.closest('[data-kf],[data-kfi]'); if(!el) return;
  if(el.dataset.kfi!==undefined){ const it=d.items[+el.dataset.kfi]; it[el.dataset.f]=el.value; if(el.dataset.f==='q'){ const p=PBY[it.pid]; if(p && !p.variants && !it.priceManual) it.price=unitPrice(p, null, +el.value||1); } if(el.dataset.f==='price') it.priceManual=true; kfTotals(); return; }
  const f=el.dataset.kf; if(el.type==='checkbox') return;
  d[f]=el.value;
  if(f==='fee') d.feeManual = el.value!=='';
  if(f==='weight') d.weightManual = el.value!=='';
  if(['fee','discount','weight','discountType'].includes(f)) kfTotals();
});
document.addEventListener('change', e=>{
  const d=S.ui.kf; if(!d) return;
  const el=e.target.closest('[data-kf],[data-kfi]'); if(!el) return;
  if(el.dataset.kfi!==undefined){ const it=d.items[+el.dataset.kfi]; if(el.dataset.f==='v'){ it.v=el.value; const p=PBY[it.pid]; it.price=unitPrice(p, it.v, +it.q||1); kFormDraw(); } return; }
  const f=el.dataset.kf;
  if(el.type==='checkbox'){ d[f]=el.checked; kFormDraw(); return; }
  if(['carrier','wilaya','commune','status','discountType'].includes(f)){ d[f]=el.value; if(f==='wilaya'){ d.commune=''; const ac=autoCarrier({wilaya:+el.value}); if(ac) d.carrier=ac; } kFormDraw(); }
});
A.kfDel2 = el=>{ S.ui.kf.delivery=el.dataset.v; kFormDraw(); };
A.kfDel = el=>{ S.ui.kf.items.splice(+el.dataset.i,1); kFormDraw(); };
A.kfSave = async el=>{
  const d=S.ui.kf, items=d.items.filter(i=>PBY[i.pid]);
  if((d.name||'').trim().length<3){ toast(t('Veuillez saisir votre nom'),'bad'); return; }
  if(!validPhone(d.phone||'')){ toast(t('Numéro invalide : 05, 06 ou 07 suivi de 8 chiffres'),'bad'); return; }
  if(d.phone2 && !validPhone(d.phone2)){ toast(t('Téléphone 02')+' : '+t('Numéro invalide : 05, 06 ou 07 suivi de 8 chiffres'),'bad'); return; }
  if(!d.commune){ toast(t('Veuillez indiquer la commune'),'bad'); return; }
  if(!items.length){ toast(t('Ajoutez au moins un produit'),'bad'); return; }
  const q=kfQuote(d);
  if(!d.id){
    el.disabled=true;
    try{
      const r = await api('order', {name:d.name.trim(), phone:d.phone, phone2:d.phone2, wilaya:+d.wilaya, commune:d.commune, address:d.address, delivery:d.delivery, note:d.note, source:d.source, carrier:d.carrier,
        exchange:d.exchange, returnedProduct:d.returnedProduct, discount:+d.discount||0, discountType:d.discountType, fee: d.feeManual? +d.fee||0 : null, weight: d.weightManual? +d.weight||0 : null,
        items:items.map(i=>({pid:i.pid, v:i.v, q:Math.max(1,+i.q||1), price:+i.price||0}))});
      S.ui.kf=null; S.ui.pk=null; closeModal(); await syncNow(); kAfterCreate(r.id, d.status); toast(r.ref+' '+t('créée'),'ok'); render();
    }catch(e){ el.disabled=false; toast(esc(e.message),'bad'); }
    return;
  }
  const o=ORDERS.find(x=>x.id===d.id), c=CBY[o.customerId];
  c.name=d.name.trim(); c.phone=fmtPhone(d.phone); c.phone2 = d.phone2? fmtPhone(d.phone2) : '';
  const sent = SHIP_ST.includes(o.status);
  Object.assign(o, {address:d.address, wilaya:+d.wilaya, commune:d.commune, note:d.note, exchange:d.exchange, returnedProduct:d.returnedProduct, discount:+d.discount||0, discountType:d.discountType});
  if(!sent){ o.delivery=d.delivery; if(o.carrier!==d.carrier){ o.carrier=d.carrier; o.parcels=null; } }
  o.items = items.map(i=>{ const p=PBY[i.pid]; const was=o.initial.find(x=>x.pid===i.pid && x.v===i.v); return {pid:i.pid, v:i.v||null, q:Math.max(1,+i.q||1), price:+i.price||0, cost:kCost(p,i.v), up:!was || (+i.q>was.q)}; });
  if(!sent){ if(d.feeManual) o.feeFixed=+d.fee||0; else delete o.feeFixed; }
  if(d.weightManual && +d.weight>0) o.weightFixed=+d.weight; else delete o.weightFixed;
  hist(o, 'Commande modifiée', '', 'blue');
  S.ui.kf=null; closeModal();
  if(PRE_ST.includes(o.status) && d.status!==confDef(o).id) kConfApply(o, d.status); else render();
  toast(o.ref+' '+t('enregistrée'),'ok');
};

/* ---------- sélecteur de produit, présenté comme la fiche produit ---------- */
A.pkForm = el=>{ S.ui.pk = {target:'form', idx:+el.dataset.i, q:'', cat:'', pid:null, open:true}; const it=S.ui.kf.items[+el.dataset.i]; if(it){ S.ui.pk.pid=it.pid; S.ui.pk.v=it.v; S.ui.pk.qty=+it.q||1; } kFormDraw(); };
A.pkDrawer = ()=>{ S.ui.pk = {target:'drawer', idx:-1, q:'', cat:'', pid:null, open:true}; pkDraw(); };
function pkDraw(){ if(S.ui.pk.target==='form') return kFormDraw(); S.modal={html:kPickerHtml(), wide:true}; renderOverlay(); const q=document.getElementById('pkQ'); if(q && S.ui.pk.focusQ){ q.focus(); q.setSelectionRange(q.value.length,q.value.length); } }
function kPickerHtml(){
  const k=S.ui.pk, back = k.target==='form'? `<button class="btn" data-a="pkBack">${ic('chevL','sm flip')} ${t('Retour au formulaire')}</button>` : `<button class="btn" data-a="closeModal">${t('Fermer')}</button>`;
  if(!k.pid){
    const q=(k.q||'').toLowerCase();
    const list = PRODUCTS.filter(p=>p.price && !['devis','archivé','masqué'].includes(p.status) && (!k.cat || p.cats.includes(k.cat)) && (!q || p.name.toLowerCase().includes(q) || (p.sku||'').toLowerCase().includes(q)));
    return modalTpl(t('Choisir un produit'), `<div class="pkbar"><div class="ksearch">${ic('search','sm')}<input class="input" id="pkQ" placeholder="${t('Rechercher un produit…')}" value="${esc(k.q||'')}" data-pk="q"></div></div>
      <div class="kchips" style="padding:8px 0">${[{id:'',fr:'Tout'}].concat(CATS.filter(c=>c.id!=='tout')).map(c=>`<button class="kchip ${k.cat===c.id?'on':''}" data-a="pkCat" data-v="${c.id}">${esc(c.id? catName(c) : t('Tout'))}</button>`).join('')}</div>
      <div class="pkgrid kscroll">${list.map(p=>{ const s=stockInfo(p.id); return `<button class="pkcard" data-a="pkOpen" data-id="${p.id}"><span class="pkimg">${prodArt(p,130)}</span><span class="pkname">${esc(p.name)}</span><span class="pkprice">${pPrice(p)}</span><span class="badge ${s.available>0?'green':p.onDemand?'amber':'red'}">${s.available>0? t('En stock')+' · '+s.available : p.onDemand? t('Sur commande') : t('Rupture')}</span></button>`; }).join('') || `<p class="kempty">${t('Aucun produit')}</p>`}</div>`, back, true);
  }
  const p=PBY[k.pid], min=p.minQty||1; k.qty=Math.max(min, +k.qty||min); if(p.variants && !p.variants.some(v=>v.id===k.v)) k.v=p.variants[0].id;
  const unit=unitPrice(p, k.v, k.qty), base = k.v && p.variants? p.variants.find(v=>v.id===k.v).price : p.price, old=Math.max(p.oldPrice||0, base);
  const imgs=p.images||[], img=Math.min(k.img||0, Math.max(0,imgs.length-1)), s=stockInfo(p.id);
  const tiers = !p.variants && (p.tiers||[]).length? [{min, price:p.price}, ...p.tiers.slice().sort((a,b)=>a.min-b.min)] : [];
  const cur = tiers.filter(x=>k.qty>=x.min).pop();
  return modalTpl(t('Produit'), `<div class="pkdetail">
    <div class="tj-gal" style="position:static"><div class="gal pkgal">${imgs.length? `<img src="${esc(imgs[img])}" alt="${esc(p.name)}">` : prodArt(p,300)}</div>${imgs.length>1? `<div class="tj-thumbs">${imgs.map((u,i)=>`<button class="${i===img?'on':''}" data-a="pkImg" data-v="${i}" aria-label="${t('Photo')} ${i+1}"><img src="${esc(u)}" alt=""></button>`).join('')}</div>`:''}</div>
    <div class="col" style="gap:12px">
      ${p.badge? `<span class="badge red" style="align-self:flex-start">${esc(p.badge)}</span>`:''}
      <h2 style="font-size:20px;margin:0">${esc(p.name)}</h2>
      <div class="pdp"><div class="price num" style="font-size:24px">${dzd(unit)}${old>unit? ` <s class="tj-old">${dzd(old)}</s>`:''}</div></div>
      ${p.short? `<p class="small muted" style="margin:0">${esc(p.short)}</p>`:''}
      <div class="row wrap small"><span class="badge">${t('Réf.')} ${esc(p.sku)}</span><span class="badge">${t('Conditionnement')} : ${p.pack} ${t('pièces')}</span><span class="badge ${s.available>0?'green':'red'}">${t('Stock')} ${s.available}</span>${seesCost()? `<span class="badge">${t('Prix d\'achat')} ${dzd(kCost(p,k.v))}</span>`:''}</div>
      ${p.variants? `<div><div class="small" style="font-weight:700;margin-bottom:6px">${t('Variante')}</div><div class="row wrap">${p.variants.map(v=>`<button class="var-opt ${k.v===v.id?'on':''}" data-a="pkVar" data-v="${esc(v.id)}">${esc(v.label)} · ${dzd(v.price)} <span class="xs muted">(${v.stock})</span></button>`).join('')}</div></div>`:''}
      ${tiers.length? `<div><div class="small" style="font-weight:700;margin-bottom:6px">${t('Offres par quantité')}</div><div class="tj-offers">${tiers.map(x=>`<button class="tj-offer ${cur===x?'on':''}" data-a="pkTier" data-v="${x.min}"><span class="dot"></span><span class="txt"><strong>${t('À partir de')} ${x.min}</strong>${x.badge?`<em>${esc(x.badge)}</em>`:''}</span><b class="num">${dzd(x.price)}</b></button>`).join('')}</div></div>`:''}
      <div class="row" style="gap:10px"><span class="small" style="font-weight:700">${t('Quantité')}</span><div class="qty"><button data-a="pkQty" data-v="-1" aria-label="${t('moins')}">−</button><input id="pkQty" type="number" min="${min}" value="${k.qty}" data-pk="qty" aria-label="${t('Quantité')}"><button data-a="pkQty" data-v="1" aria-label="${t('plus')}">+</button></div><b class="num">${dzd(unit*k.qty)}</b></div>
    </div></div>`,
    `<button class="btn" data-a="pkList">${t('Autre produit')}</button>${back}<button class="btn green" data-a="pkAdd">${ic('cart','sm')} ${t(k.target==='form'&&k.idx>=0?'Remplacer dans la commande':'Ajouter à la commande')}</button>`, true);
}
document.addEventListener('input', e=>{ const el=e.target.closest('[data-pk]'); if(!el || !S.ui.pk) return; if(el.dataset.pk==='q'){ S.ui.pk.q=el.value; S.ui.pk.focusQ=true; clearTimeout(S.ui.pk.tm); S.ui.pk.tm=setTimeout(pkDraw, 200); } else { S.ui.pk.qty=Math.max(1,+el.value||1); } });
document.addEventListener('change', e=>{ const el=e.target.closest('[data-pk=qty]'); if(el && S.ui.pk){ S.ui.pk.qty=Math.max(1,+el.value||1); pkDraw(); } });
A.pkCat = el=>{ S.ui.pk.cat=el.dataset.v; S.ui.pk.focusQ=false; pkDraw(); };
A.pkOpen = el=>{ Object.assign(S.ui.pk, {pid:+el.dataset.id, v:null, qty:null, img:0, focusQ:false}); pkDraw(); };
A.pkList = ()=>{ S.ui.pk.pid=null; pkDraw(); };
A.pkBack = ()=>{ S.ui.pk.open=false; S.ui.pk.pid=null; kFormDraw(); };
A.pkImg = el=>{ S.ui.pk.img=+el.dataset.v; pkDraw(); };
A.pkVar = el=>{ S.ui.pk.v=el.dataset.v; pkDraw(); };
A.pkTier = el=>{ S.ui.pk.qty=+el.dataset.v; pkDraw(); };
A.pkQty = el=>{ const p=PBY[S.ui.pk.pid]; S.ui.pk.qty=Math.max(p.minQty||1, (+S.ui.pk.qty||1)+(+el.dataset.v)); pkDraw(); };
A.pkAdd = ()=>{
  const k=S.ui.pk, p=PBY[k.pid], q=Math.max(p.minQty||1, +k.qty||1), price=unitPrice(p, k.v, q);
  if(!canOrder(p) && !p.onDemand && stockInfo(p.id).available<=0) toast(t('Attention : produit en rupture'),'bad');
  if(k.target==='form'){
    const d=S.ui.kf, line={pid:p.id, v:k.v||null, q, price};
    if(k.idx>=0) d.items[k.idx]=line; else { const ex=d.items.find(i=>i.pid===p.id && (i.v||null)===(k.v||null)); if(ex){ ex.q=+ex.q+q; ex.price=unitPrice(p, k.v, ex.q); } else d.items.push(line); }
    S.ui.pk.open=false; S.ui.pk.pid=null; kFormDraw(); return;
  }
  const o=drawerOrder(); if(!o) return closeModal();
  const ex=o.items.find(i=>i.pid===p.id && (i.v||null)===(k.v||null));
  if(ex){ ex.q+=q; ex.up=true; ex.price=unitPrice(p, k.v, ex.q); } else o.items.push({pid:p.id, v:k.v||null, q, price, cost:kCost(p,k.v), up:true});
  S.ui.pk=null; closeModal(); toast(t('Ajouté')+' : '+esc(p.name)+' (+'+dzd(price*q)+')','ok'); render();
};

/* ---------- fiche d'appel : statuts de confirmation + ajout de produit par la fiche produit ---------- */
const _callScreenParts = callScreenParts;
callScreenParts = function(o){
  const P=_callScreenParts(o);
  P.center = kStatusBlock(o).replace('class="kstatusblock"','class="kstatusblock card card-b"') + P.center.replace(/<div style="margin-top:10px;position:relative"><input[^>]*data-in="addQ"[^>]*>(?:<div class="card"[\s\S]*?<\/div>)?<\/div>/, `<button class="btn block kfaddline" data-a="pkDrawer">${ic('plus','sm')} ${t('Ajouter un produit')}</button>`);
  return P;
};
