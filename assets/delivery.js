"use strict";
/* ============================================================
   Module Livraison façon thème Tajer : catalogue de 114 sociétés avec leur logo, clés API,
   « Enregistrer et tester la connexion », tarifs par wilaya modifiables.
   Les onglets « Mes livreurs » et « Règles d'attribution » restent ceux de app.js.
   ============================================================ */
let CATALOG = null;
async function loadCatalog(){
  if(CATALOG) return CATALOG;
  try{ CATALOG = (await api('carrier.catalog')).catalog; }catch(e){ CATALOG = []; toast(esc(e.message),'bad'); }
  return CATALOG;
}
const catOf = id => (CATALOG||[]).find(x=>x.id===id);
function carrierState(c){
  if(!c.connected) return ['Désactivée',''];
  if(c.internal) return ['Vos livreurs','green'];
  const cat = catOf(c.id);
  if(cat && cat.api && c.creds && c.creds.token) return c.apiOk===false? ['Clés refusées','red'] : c.apiOk? ['Reliée par API','green'] : ['Clés à tester','amber'];
  return ['Suivi manuel','amber'];
}
function tjCarrierCard(c){
  const cat = catOf(c.id), api = cat && cat.api, [st, cls] = carrierState(c), open = S.ui.liv.open===c.id;
  const num = (k,l,extra)=>`<div class="field"><label>${t(l)}<input class="input" type="number" value="${esc(c[k]??'')}" data-ch="carField" data-id="${c.id}" data-k="${k}" ${extra||''}></label></div>`;
  return `<div class="card dl-card ${c.isDefault?'def':''}">
    <div class="card-h"><div class="row" style="min-width:0">${carrierLogo(c,44)}<div style="min-width:0"><h3>${esc(kCarrierName(c))}</h3><div class="xs muted">${c.internal? t('Vos propres livreurs') : c.desk? t('Domicile + bureau (stop desk)') : t('Domicile uniquement')}${api? ' · API '+esc(cat.family) : ''}</div></div></div>
      <div class="row">${c.isDefault? `<span class="badge kraft">${t('Par défaut')}</span>`:''}<span class="badge ${cls}">${t(st)}</span></div></div>
    <div class="card-b col" style="gap:10px">
      ${c.internal? `<div class="small muted">${t('Pas de clé API : numéro de suivi généré, statut changé à la main. Zones')} : ${(c.wilayas||[]).map(w=>esc(wName(w))).join(', ')||'—'}</div>`
      : api? `<div class="grid2">${cat.fields.map(([k,l])=>`<div class="field"><label>${esc(t(l))}<input class="input" autocomplete="off" spellcheck="false" dir="ltr" value="${esc((c.creds||{})[k]||'')}" data-ch="carCred" data-id="${c.id}" data-k="${k}"></label></div>`).join('')}</div>
        <div class="row wrap"><button class="btn sm primary" data-a="carTest" data-id="${c.id}">${ic('zap','sm')} ${t('Enregistrer et tester la connexion')}</button>${c.lastSync? `<span class="xs muted">${t('Dernier test')} ${fDT(c.lastSync)}</span>`:''}</div>`
      : `<div class="small muted">${t('Pas de liaison API pour cette société : saisissez le numéro de suivi dans « Suivi des commandes » et changez le statut à la main.')}</div>`}
      ${open? `<div class="grid3">${num('baseKg','Poids inclus (kg)','min="0" step="0.5"')}${num('extraPerKg','Prix par kg en plus (DZD)','min="0"')}${num('maxParcelKg','Poids max par colis (kg)','min="1"')}${num('feeFactor','Coefficient tarifaire','step="0.05" min="0"')}</div>
        <div class="row wrap"><label class="check small"><input type="checkbox" ${c.chargeOverweight?'checked':''} data-ch="carBool" data-id="${c.id}" data-k="chargeOverweight"> ${t('Facturer le surpoids au client')}</label>${c.internal?'':`<label class="check small"><input type="checkbox" ${c.desk?'checked':''} data-ch="carBool" data-id="${c.id}" data-k="desk"> ${t('Propose le bureau (stop desk)')}</label>`}</div>`:''}
      <div class="row wrap">
        <button class="btn sm ghost" data-a="carOpen" data-id="${c.id}">${ic('gear','sm')} ${open? t('Masquer poids et tarifs') : t('Poids et tarifs')}</button>
        ${c.connected && !c.internal? (c.isDefault? `<button class="btn sm" data-a="carNoDefault" data-id="${c.id}">${t('Retirer « par défaut »')}</button>` : `<button class="btn sm" data-a="carDefault" data-id="${c.id}">${t('Définir par défaut')}</button>`):''}
        ${c.connected? `<button class="btn sm ghost" data-a="carOff" data-id="${c.id}">${t('Désactiver')}</button>` : `<button class="btn sm primary" data-a="carOn" data-id="${c.id}">${t('Activer')}</button>`}
        ${c.internal? '' : `<button class="btn icon sm ghost" data-a="carRemove" data-id="${c.id}" title="${t('Retirer la société')}" aria-label="${t('Retirer la société')}">${ic('trash','sm')}</button>`}
      </div>
    </div></div>`;
}
const _viewDelivery = viewDelivery;
viewDelivery = function(){
  const u=S.ui.liv;
  if(u.tab==='rules' || u.tab==='couriers'){ const h=_viewDelivery(); return h.replace(/<div class="tabs">[\s\S]*?<\/div>/, livTabs()).replace(t('Sociétés de livraison, vos livreurs et le poids des colis'), t('Sociétés de livraison, règles d\'attribution et tarifs par wilaya')); }
  if(!CATALOG){ loadCatalog().then(()=>{ if(location.hash.startsWith('#/erp/livraison')) render(); }); }
  let inner;
  if(u.tab==='carriers') inner = `<div class="card-b row between wrap"><span class="small muted" style="max-width:640px">${t('Ajoutez votre société, collez ses clés API puis « Enregistrer et tester la connexion ». Le colis est alors créé chez elle à l\'expédition et son suivi relu par « Synchroniser les statuts ». Liaison API disponible pour Yalidine, EcoTrack (dont DHD) et Noest.')}</span><button class="btn primary" data-a="carPick">${ic('plus','sm')} ${t('Ajouter une société')}</button></div>
    <div class="card-b g2" style="padding-top:0">${CARRIERS.map(tjCarrierCard).join('')}</div>`;
  else {
    const q=(u.q||'').toLowerCase(); const list=WILAYAS.filter(w=>!q || w.fr.toLowerCase().includes(q) || w.ar.includes(u.q) || w.code.includes(q));
    const cell=(w,k)=>`<td class="r"><input class="kcell num" type="number" min="0" step="10" style="width:92px;text-align:end" value="${w[k]}" data-ch="wFee" data-id="${w.id}" data-k="${k}" aria-label="${esc(w.fr)}"></td>`;
    inner = `<div class="filters-bar"><input class="input s" placeholder="${t('Rechercher une wilaya…')}" value="${esc(u.q||'')}" data-in="livQ" aria-label="${t('Rechercher')}"><span class="small muted">${WILAYAS.filter(w=>w.active).length} / ${WILAYAS.length} ${t('wilayas desservies')}</span><span class="grow"></span>
        <span class="small">${t('Appliquer à toutes')} :</span><input class="input num" id="wbHome" type="number" placeholder="${t('Domicile')}" style="width:96px;height:34px" aria-label="${t('Prix client domicile')}"><input class="input num" id="wbDesk" type="number" placeholder="${t('Bureau')}" style="width:96px;height:34px" aria-label="${t('Prix client bureau')}"><button class="btn sm" data-a="wBulk">${t('Appliquer')}</button></div>
      <div class="card-b small muted" style="padding-top:8px;padding-bottom:8px">${t('« Prix client » est ce que paie l\'acheteur ; « Coût société » est ce que la société de livraison vous facture. Le coefficient de la société choisie s\'applique par-dessus.')}</div>
      <div class="tbl-wrap" style="max-height:600px"><table class="tbl ktbl"><thead><tr><th>${t('Desservie')}</th><th>${t('Code')}</th><th>${t('Wilaya')}</th><th class="r">${t('Prix client domicile')}</th><th class="r">${t('Prix client bureau')}</th><th class="r">${t('Coût société domicile')}</th><th class="r">${t('Coût société bureau')}</th></tr></thead><tbody>
      ${list.map(w=>`<tr style="${w.active?'':'opacity:.55'}"><td><input type="checkbox" ${w.active?'checked':''} data-ch="wActive" data-id="${w.id}" aria-label="${esc(w.fr)}"></td><td class="num">${w.code}</td><td><b>${esc(w.fr)}</b> <span class="muted" dir="rtl">${esc(w.ar)}</span></td>${cell(w,'home')}${cell(w,'desk')}${cell(w,'dhdHome')}${cell(w,'dhdDesk')}</tr>`).join('') || emptyRow(7,'Aucune wilaya ne correspond','search')}
      </tbody></table></div>`;
  }
  const body = card('', livTabs()+inner);
  return erpShell('livraison', t('Livraison'), t('Sociétés de livraison, règles d\'attribution et tarifs par wilaya'), body);
};
function livTabs(){ const u=S.ui.liv; return `<div class="tabs">${[['carriers','Sociétés de livraison'],['couriers','Livreurs'],['rules','Règles d\'attribution'],['fees','Tarifs par wilaya']].map(([k,l])=>`<button class="${u.tab===k?'on':''}" data-a="livTab" data-v="${k}">${t(l)}</button>`).join('')}</div>`; }
/* menu séparé « Livreurs » : vos propres livreurs, leurs zones, l'argent qu'ils ont en main */
function viewCouriers(){
  const keep=S.ui.liv.tab, es=erpShell; S.ui.liv.tab='couriers';
  erpShell = (page, title, sub, body, actions)=> es('livreurs', t('Livreurs'), t('Vos livreurs, leurs zones et l\'argent qu\'ils ont en main'), body.replace(/<div class="tabs">[\s\S]*?<\/div>/, ''), actions);
  try{ return _viewDelivery(); } finally{ erpShell=es; S.ui.liv.tab=keep; }
}
['admin','gerant'].forEach(r=>{ ERP_VIEWS[r].livraison = ()=>viewDelivery(); ERP_VIEWS[r].livreurs = ()=>{ S.ui.liv.tab='couriers'; return viewDelivery(); }; });
/* « Livreurs » est un onglet du module Livraison ; l'ancien lien y mène */
A.carNoDefault = el=>{ const c=CRB[el.dataset.id]; if(c) c.isDefault=false; render(); };
IN.livQ = (el)=>{ S.ui.liv.q=el.value; render(); };
CH.wActive = (el)=>{ WBY[+el.dataset.id].active=el.checked; render(); };
A.wBulk = ()=>{ const h=val('wbHome'), d=val('wbDesk'); if(h==='' && d===''){ toast(t('Saisissez un prix'),'bad'); return; } WILAYAS.forEach(w=>{ if(h!=='') w.home=+h||0; if(d!=='') w.desk=+d||0; }); toast(t('Prix appliqués aux 69 wilayas'),'ok'); render(); };
A.carOpen = (el)=>{ S.ui.liv.open = S.ui.liv.open===el.dataset.id? null : el.dataset.id; render(); };
CH.carCred = (el)=>{ const c=CRB[el.dataset.id]; c.creds = c.creds||{}; c.creds[el.dataset.k]=el.value.trim(); c.apiOk=null; };
A.carOn = (el)=>{ const c=CRB[el.dataset.id]; c.connected=true; log('Société activée', c.name); render(); };
A.carTest = async(el)=>{
  const c=CRB[el.dataset.id]; if(!(c.creds && c.creds.token)){ toast(t('Collez d\'abord les clés API'),'bad'); return; }
  el.disabled=true; await syncNow(); // les clés doivent être enregistrées avant que le serveur les essaie
  try{ await api('carrier.test', {id:c.id}); c.apiOk=true; c.connected=true; toast(esc(c.name)+' : '+t('connexion réussie'),'ok'); }
  catch(e){ c.apiOk=false; toast(esc(e.message),'bad'); }
  c.lastSync=Date.now(); render(); queueSync();
};
A.testDhd = ()=>A.carTest({dataset:{id:'dhd'}});
A.carSync = A.carTest;
A.carRemove = (el)=>{
  const c=CRB[el.dataset.id]; if(!c) return;
  if(ORDERS.some(o=>o.carrier===c.id && SHIP_ST.includes(o.status) && !['paid','closed'].includes(o.status))){ toast(t('Des colis de cette société sont en cours : désactivez-la plutôt.'),'bad'); return; }
  ORDERS.forEach(o=>{ if(o.carrier===c.id && PRE_ST.includes(o.status)) o.carrier=''; });
  CARRIERS.splice(CARRIERS.indexOf(c),1); delete CRB[c.id]; SETTINGS.carrierRules = (SETTINGS.carrierRules||[]).filter(r=>r.carrier!==c.id);
  toast(esc(c.name)+' : '+t('retirée'),'ok'); render();
};
A.carPick = async()=>{
  const cat = (await loadCatalog()).filter(x=>!CRB[x.id] && x.family!=='internal');
  openModal(modalTpl(t('Ajouter une société de livraison'), `<input class="input" id="carQ" placeholder="${t('Rechercher parmi')} ${cat.length} ${t('sociétés…')}" aria-label="${t('Rechercher')}" style="margin-bottom:12px">
    <div class="dl-grid">${cat.map(x=>`<button class="dl-pick" data-a="carAdd" data-id="${esc(x.id)}" data-n="${esc(x.name.toLowerCase())}">${carrierLogo({logo:x.logo, name:x.name, short:x.name},40)}<span><b>${esc(x.name)}</b><small class="${x.api?'up':'muted'}">${x.api? t('Liaison API') : t('Suivi manuel')}</small></span></button>`).join('')}</div>`, '', true));
};
document.addEventListener('input', e=>{ if(e.target.id!=='carQ') return; const q=e.target.value.toLowerCase().trim(); document.querySelectorAll('.dl-pick').forEach(b=>b.hidden = !!q && !b.dataset.n.includes(q)); });
A.carAdd = (el)=>{
  const x=catOf(el.dataset.id); if(!x || CRB[x.id]) return;
  const c={id:x.id, name:x.name, short:x.name.replace(/[^A-Za-z0-9]/g,'').slice(0,3).toUpperCase(), family:x.family, logo:x.logo, connected:true, isDefault:false, creds:{}, feeFactor:1, baseKg:5, extraPerKg:50, maxParcelKg:20, chargeOverweight:true, desk:true, cod:true, sync:15, color:'#8E6339'};
  if(c.isDefault) CARRIERS.forEach(k=>k.isDefault=false);
  CARRIERS.push(c); CRB[c.id]=c; log('Société ajoutée', c.name); closeModal(); S.ui.liv.tab='carriers'; render();
  toast(esc(c.name)+' : '+t(x.api? 'ajoutée — collez ses clés API' : 'ajoutée (suivi manuel)'),'ok');
};
/* Sauvegarde : export complet de ce que ce poste a le droit de lire. */
A.backup = ()=>{
  const data = {exportedAt:new Date().toISOString(), ...Object.fromEntries(Object.entries(COLLS).map(([k,v])=>[k,v])), settings:SETTINGS, pixel_events:PIXEL_EVENTS};
  const u=URL.createObjectURL(new Blob([JSON.stringify(data)], {type:'application/json'})); const a=document.createElement('a'); a.href=u; a.download='packlik-sauvegarde-'+isoDay(Date.now())+'.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u), 2000);
  toast(t('Sauvegarde téléchargée'),'ok');
};
