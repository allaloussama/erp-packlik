"use strict";
/* ============================================================
   Commandes à confirmer + Suivi des commandes, façon Kando :
   tableau dense, pastilles de statut cliquables, filtres par date, édition dans la ligne.
   Les règles métier restent celles de app.js (resConfirm, resUnreach, setStatus…).
   ============================================================ */
CANCEL_REASONS.includes('Rupture de stock') || CANCEL_REASONS.splice(CANCEL_REASONS.length-1, 0, 'Rupture de stock');
const K_TEAL='#80BCBD', K_ORANGE='#FFA447', K_GREEN='#2FBF4A', K_RED='#E23024', K_PURPLE='#9D76C1', K_NAVY='#0F2B46', K_BLACK='#040D12';
const K_COLOR = {new:K_TEAL, calling:'#6C5CE7', unreach:K_ORANGE, callback:K_PURPLE, cancelled:K_RED,
  toprep:K_TEAL, ready:'#5FA8D3', sent:'#4A90C2', picked:'#4A90C2', transit:'#5B6ABF', outfor:K_ORANGE, failed:'#E8A33D',
  delivered:K_GREEN, returning:'#D9822B', returned:K_RED, paid:'#1F8A3B', closed:K_NAVY};
const K_REASON_COLOR = {'Doublon':K_BLACK, 'Faux numéro':K_NAVY, 'Hors zone':K_NAVY, 'Rupture de stock':K_NAVY};
const K_REASON_LABEL = {'Refus':'Annulée — refus', 'Prix':'Annulée — prix', 'Doublon':'Doublon', 'Faux numéro':'Mauvais numéro', 'Hors zone':'Mauvaise commune / hors zone', 'Rupture de stock':'Rupture de stock', 'Autre':'Annulée — autre'};
const K_SHIP_LABEL = {toprep:'Confirmée — à préparer', ready:'Prête à expédier', sent:'Envoyée', picked:'Ramassée', transit:'En transit', outfor:'En livraison', failed:'Tentative échouée', delivered:'Livrée', returning:'Retour en cours', returned:'Retournée', paid:'Payée', closed:'Clôturée', cancelled:'Annulée'};
function kTextOn(hex){ const h=hex.replace('#',''); const l=(0.299*parseInt(h.slice(0,2),16)+0.587*parseInt(h.slice(2,4),16)+0.114*parseInt(h.slice(4,6),16))/255; return l>0.62? '#0B1220':'#fff'; }
function kLabel(o){
  const s=o.status;
  if(s==='new') return t('En attente'); if(s==='unreach') return t('Échec')+' 0'+(o.unreachN||1); if(s==='callback') return t('Reporté'); if(s==='calling') return t('En appel');
  if(s==='cancelled') return t(K_REASON_LABEL[o.cancelReason]||'Annulée');
  return t(K_SHIP_LABEL[s]||STATUS[s].fr);
}
function kColor(o){ return o.status==='cancelled'? (K_REASON_COLOR[o.cancelReason]||K_RED) : K_COLOR[o.status]; }
function kPillStyle(c){ return `background:${c};color:${kTextOn(c)}`; }
function kPill(o, kind, can){
  const c=kColor(o);
  return can? `<button class="kpill" style="${kPillStyle(c)}" data-a="kMenu" data-id="${o.id}" data-k="${kind}" aria-haspopup="menu">${kLabel(o)} <span aria-hidden="true">▾</span></button>` : `<span class="kpill" style="${kPillStyle(c)}">${kLabel(o)}</span>`;
}
function kCanConf(o){ return S.role==='admin' || S.role==='manager' || (S.role==='agent' && o.agentId===S.agentId); }
function kCanShip(){ return ['admin','gerant'].includes(S.role); }
function kInDate(ts, f){
  const today=dayStart(Date.now());
  if(f==='today') return ts>=today; if(f==='yesterday') return ts>=today-DAY && ts<today; if(f==='week') return ts>=today-6*DAY;
  if(f==='month'){ const m=new Date(); m.setDate(1); m.setHours(0,0,0,0); return ts>=m.getTime(); }
  return true;
}
function kDateChips(cur, act){ return `<div class="seg" role="group" aria-label="${t('Période')}">${[['today','Aujourd\'hui'],['yesterday','Hier'],['week','Semaine'],['month','Mois'],['all','Tous']].map(([k,l])=>`<button class="${cur===k?'on':''}" data-a="${act}" data-v="${k}">${t(l)}</button>`).join('')}</div>`; }
function kPhoneCell(o){
  const c=CBY[o.customerId]; const mine = S.role!=='agent' || o.agentId===S.agentId; if(!mine) return `<span class="masked num" dir="ltr">${maskPhone(c.phone)}</span>`;
  const d=c.phone.replace(/\s/g,'');
  return `<span class="row" style="gap:4px"><span dir="ltr" class="num">${esc(c.phone)}</span><a class="kico" href="tel:${d}" data-a="logCall" data-id="${o.id}" title="${t('Appeler')}" aria-label="${t('Appeler')}">${ic('phone','sm')}</a><a class="kico wa" href="https://wa.me/213${d.slice(1)}" target="_blank" rel="noopener" title="WhatsApp" aria-label="WhatsApp">${ic('wa','sm')}</a></span>`;
}
function kRisk(o){ const cs=custStats(o.customerId); if(!(cs.delivered+cs.returned)) return ''; const cls = cs.black?'red': cs.returned?'amber':'green'; return ` <span class="badge ${cls}" title="${t('Ratio de risque')} : ${cs.delivered} ${t('livrée(s)')} / ${cs.returned} ${t('retour(s)')}">${cs.delivered}/${cs.returned}</span>`; }
function kCarrierName(c){ return c.internal? t('Mes livreurs') : c.name; }

/* ---------- menu de statut ---------- */
let KM = null;
function kMenuItems(o, kind){
  const it = (v, label, color)=>`<button role="menuitem" data-a="kPick" data-v="${v}"><span class="dot" style="background:${color}"></span>${t(label)}</button>`;
  if(kind==='conf'){
    let h = '';
    if(o.status!=='new') h += it('new', o.status==='cancelled'? 'Rouvrir (en attente)':'En attente', K_TEAL);
    if(o.status!=='cancelled'){
      h += it('unreach', 'Échec 0'+Math.min(3,(o.unreachN||0)+1), K_ORANGE) + it('callback','Reporté…',K_PURPLE) + it('toprep','Confirmée',K_GREEN) + '<hr>';
      h += CANCEL_REASONS.map(r=>it('c:'+r, K_REASON_LABEL[r]||r, K_REASON_COLOR[r]||K_RED)).join('');
    }
    return h;
  }
  if(kind==='note') return FAIL_REASONS.map(f=>it('f:'+f.id, f.fr, K_ORANGE)).join('');
  const next = {toprep:['ready'], ready:['sent','toprep'], sent:['picked','transit','outfor','delivered','failed','returning'], picked:['transit','outfor','delivered','failed','returning'], transit:['outfor','delivered','failed','returning'], outfor:['delivered','failed','returning'], failed:['outfor','delivered','returning'], returning:['returned'], delivered: isAdmin()? ['paid']:[], paid: isAdmin()? ['closed']:[]}[o.status] || [];
  const label = st=> st==='sent'? 'Envoyer à la société de livraison' : st==='returned'? 'Réceptionner le retour' : st==='outfor' && o.status==='failed'? 'Nouvelle tentative (en livraison)' : K_SHIP_LABEL[st];
  let h = next.map(st=>it(st, label(st), K_COLOR[st])).join('');
  if(['toprep','ready','sent','picked','transit'].includes(o.status)) h += '<hr>'+it('cancel','Annuler (motif obligatoire)',K_RED);
  return h || `<div class="small muted" style="padding:8px 12px">${t('Aucun changement possible')}</div>`;
}
function drawKMenu(){
  let m = document.getElementById('kmenu'); if(!m){ m=document.createElement('div'); m.id='kmenu'; document.body.appendChild(m); }
  const o = KM && ORDERS.find(x=>x.id===KM.id);
  if(!o){ KM=null; m.innerHTML=''; return; }
  m.innerHTML = `<div class="kmenu" role="menu" style="left:${KM.x}px;top:${KM.y}px">${kMenuItems(o, KM.kind)}</div>`;
  const box = m.firstChild, r = box.getBoundingClientRect();
  if(r.bottom > innerHeight-8) box.style.top = Math.max(8, KM.top - r.height - 4)+'px';
  if(r.right > innerWidth-8) box.style.left = Math.max(8, innerWidth - r.width - 8)+'px';
  const f = box.querySelector('button'); if(f) f.focus();
}
document.addEventListener('click', e=>{ if(KM && !e.target.closest('.kmenu') && !e.target.closest('[data-a=kMenu]')){ KM=null; drawKMenu(); } }, true);
document.addEventListener('keydown', e=>{ if(KM && e.key==='Escape'){ KM=null; drawKMenu(); } });
window.addEventListener('scroll', ()=>{ if(KM){ KM=null; drawKMenu(); } }, true);
A.kMenu = (el)=>{ const r=el.getBoundingClientRect(); const same = KM && KM.id===+el.dataset.id && KM.kind===el.dataset.k; KM = same? null : {id:+el.dataset.id, kind:el.dataset.k, x:r.left, y:r.bottom+4, top:r.top}; drawKMenu(); };
A.kPick = (el)=>{ const o=ORDERS.find(x=>x.id===KM.id), kind=KM.kind, v=el.dataset.v; KM=null; drawKMenu(); if(!o) return; kind==='conf'? kConf(o,v) : kind==='note'? kNote(o, v.slice(2)) : kShip(o,v); };

/* résultat d'appel choisi depuis le tableau : on passe par les mêmes actions que l'écran d'appel */
const _afterResult = afterResult;
afterResult = function(){ if(S.drawer && S.drawer.inline){ S.drawer=null; render(); return; } _afterResult(); };
const _closeModal = closeModal;
closeModal = function(){ _closeModal(); if(S.drawer && S.drawer.inline) S.drawer=null; };
A.closeModal = ()=>closeModal();
function kInline(o, fn){ S.drawer = {id:o.id, tab:'call', page:true, inline:true, addQ:''}; fn(); if(S.drawer && S.drawer.inline && !S.modal) S.drawer=null; }
function kConf(o, v){
  if(!kCanConf(o)){ toast(t('Commande d\'un autre agent'),'bad'); return; }
  if(v==='new'){ o.nextCall=null; o.lockedBy=null; delete o.prevStatus; if(o.status==='cancelled') o.cancelReason=''; setStatus(o,'new','Remise en attente'); render(); }
  else if(v==='unreach') kInline(o, A.resUnreach);
  else if(v==='callback') kInline(o, A.resCallback);
  else if(v==='toprep') kInline(o, A.resConfirm);
  else if(v.startsWith('c:')){ o.cancelReason=v.slice(2); o.lockedBy=null; o.nextCall=null; delete o.prevStatus; setStatus(o,'cancelled','Motif : '+o.cancelReason); toast(o.ref+' '+t('annulée')+' ('+t(o.cancelReason)+')','ok'); render(); }
}
/* tentative échouée saisie à la main, avec son motif (« notes de suivi ») */
function kNote(o, reason){
  const r=FBY[reason], n=o.attempts.length+1;
  o.attempts.push({n, at:Date.now(), reason:r.id, comment:'Saisie manuelle', action:'', agentId:o.agentId, due:Date.now()+r.delay, result:'', resolved:false});
  if(n>=3) o.riskReturn=true;
  if(o.status==='failed') o.status='transit';
  setStatus(o,'failed', r.fr+(n>=3?' — Risque de retour':'')); o.history[o.history.length-1].action='Tentative '+n+' échouée';
  NOTIFS.unshift({at:Date.now(), txt:'Tentative '+n+' échouée sur '+o.ref+' ('+r.fr+')'});
  toast(o.ref+' : '+t('tentative')+' '+n+' '+t('échouée')+' ('+t(r.fr)+')','bad'); render();
}
preSendCheck = function(o){ const e=[]; if(needsSplit(o)) e.push('Poids trop élevé : découper la commande'); if(!carrierOf(o).connected) e.push('Société de livraison désactivée'); if(!validPhone(CBY[o.customerId].phone)) e.push('Téléphone invalide'); if(!o.commune) e.push('Commune manquante'); expand(o.items).forEach(i=>{ if(PBY[i.pid].stock < i.q && !PBY[i.pid].onDemand) e.push('Stock insuffisant'); }); return [...new Set(e)]; };
function kShip(o, st){
  if(!kCanShip()){ toast(t('Action réservée à l\'admin et au gérant'),'bad'); return; }
  if(st==='sent') return shipOrders([o]);
  if(st==='failed'){ KM={id:o.id, kind:'note', x:innerWidth/2-130, y:innerHeight/3, top:innerHeight/3}; drawKMenu(); return; }
  if(st==='returned') return A.receiveReturn({dataset:{id:o.id}});
  if(st==='cancel') return kInline(o, A.cancelConfirmed);
  if(st==='toprep'){ o.status='ready'; setStatus(o,'toprep','Remise en préparation'); render(); return; }
  kInline(o, ()=>A.oSet({dataset:{v:st}}));
}

/* ---------- expédition : colis créé chez le transporteur quand il a une liaison API ---------- */
function carrierHasApi(c){ return ['yalidine','ecotrack','noest'].includes(c.family) && c.creds && c.creds.token; }
async function shipOrders(list){
  let ok=0; const ko=[];
  for(const o of list){
    const chk = preSendCheck(o); if(chk.length){ ko.push(o.ref+' : '+chk.map(t).join(', ')); continue; }
    const cr = carrierOf(o);
    if(carrierHasApi(cr) && !o.tracking){
      try{
        await syncNow(); // l'adresse et le panier corrigés doivent être sur le serveur avant l'envoi
        await api('carrier.send', {orderId:o.id, amount:orderTotal(o), weight:orderWeight(o), products:expand(o.items).map(i=>i.q+'x '+PBY[i.pid].name).join(', ')});
        await syncNow(); // récupère le numéro de suivi inscrit par le serveur
      }catch(e){ ko.push(o.ref+' : '+e.message); continue; }
    }
    setStatus(o,'sent', cr.internal? 'Remis au livreur' : carrierHasApi(cr)? 'Colis créé chez '+cr.name+' par API' : 'Envoi enregistré (suivi saisi à la main)'); ok++;
  }
  S.ui.track2.sel.clear(); render();
  if(ok) toast(ok+' '+t('colis envoyé(s)'),'ok');
  if(ko.length) openModal(modalTpl(t('Envois bloqués'), `<div class="col small">${ko.map(x=>`<div>${esc(x)}</div>`).join('')}</div>`, `<button class="btn primary" data-a="closeModal">${t('Fermer')}</button>`));
}
const _oSet = A.oSet;
A.oSet = (el)=>{ if(el.dataset.v==='sent'){ const o=drawerOrder(); if(o) shipOrders([o]); return; } _oSet(el); };
A.bulkSend = ()=>{ const sel=S.ui.track2.sel; shipOrders(ORDERS.filter(o=>o.status==='ready' && (!sel.size||sel.has(o.id)))); };
/* Synchroniser les statuts : relit chaque colis en cours chez son transporteur (liaison API uniquement). */
const K_ORDER = ['sent','picked','transit','outfor','failed','delivered','returning','returned'];
A.dhdSync = async()=>{
  const list = ORDERS.filter(o=>['sent','picked','transit','outfor','failed'].includes(o.status) && o.tracking && carrierHasApi(carrierOf(o)));
  if(!list.length){ S.lastSync=Date.now(); toast(t('Aucun colis à synchroniser : la lecture automatique demande une société reliée par API.'),'ok'); render(); return; }
  toast(t('Lecture des statuts en cours…')+' ('+list.length+')','ok');
  let moved=0, errs=0;
  for(const o of list){
    try{
      const r = await api('carrier.track', {orderId:o.id}); if(!r.step) continue;
      const last = r.events[0]; const step = r.step==='returned'? 'returning' : r.step; // le retour se réceptionne à la main (contrôle du colis, stock)
      if(step===o.status || (K_ORDER.indexOf(step) < K_ORDER.indexOf(o.status) && step!=='failed')) continue;
      if(step==='failed') kNoteQuiet(o, last.status); else setStatus(o, step, carrierOf(o).name+' : '+last.status+(last.place?' · '+last.place:''));
      moved++;
    }catch(e){ errs++; }
  }
  S.lastSync=Date.now(); toast(t('Statuts mis à jour')+' : '+moved+(errs? ' · '+errs+' '+t('erreur(s)'):''), errs?'bad':'ok'); render(); queueSync();
};
function kNoteQuiet(o, label){ const n=o.attempts.length+1; o.attempts.push({n, at:Date.now(), reason:'unreach', comment:label, action:'', agentId:o.agentId, due:Date.now()+2*HOUR, result:'', resolved:false}); if(n>=3) o.riskReturn=true; setStatus(o,'failed',label); o.history[o.history.length-1].action='Tentative '+n+' échouée'; }

/* ---------- champs modifiables dans la ligne ---------- */
CH.kField = (el)=>{
  const o=ORDERS.find(x=>x.id===+el.dataset.id); if(!o) return; const f=el.dataset.f, v=el.value;
  if(f==='wilaya'){ o.wilaya=+v; o.commune=''; o.parcels=null; o.carrier=autoCarrier(o); hist(o,'Wilaya modifiée', wName(o.wilaya)); }
  else if(f==='commune'){ o.commune=v; }
  else if(f==='delivery'){ o.delivery=v; hist(o,'Type de livraison', v==='home'?'Domicile':'Bureau'); }
  else if(f==='note'){ o.note=v.trim(); }
  else if(f==='tracking'){ o.tracking=v.trim(); hist(o,'Numéro de suivi saisi', o.tracking,'blue'); }
  render();
};
A.kDate = (el)=>{ S.ui.conf.date=el.dataset.v; S.ui.conf.sel.clear(); render(); };
A.kDateT = (el)=>{ S.ui.track2.date=el.dataset.v; S.ui.track2.sel.clear(); render(); };
A.kCopy = (el)=>{ navigator.clipboard && navigator.clipboard.writeText(el.dataset.v).then(()=>toast(t('Copié')+' : '+esc(el.dataset.v),'ok')); };
CH.kCarrierF = (el)=>{ S.ui.track2.carrier=el.value; render(); };

/* ---------- Commandes à confirmer ---------- */
const K_TABS = [['all','Toutes',o=>CONF_ST.includes(o.status)],['new','En attente',o=>o.status==='new'],['u1','Échec 01',o=>o.status==='unreach'&&(o.unreachN||1)===1],['u2','Échec 02',o=>o.status==='unreach'&&o.unreachN===2],['u3','Échec 03',o=>o.status==='unreach'&&o.unreachN>=3],['callback','Reporté',o=>o.status==='callback'],['calling','En appel',o=>o.status==='calling'],['confirmed','Confirmées',o=>CONFIRMED_ST.includes(o.status)],['cancelled','Annulées',o=>o.status==='cancelled']];
const K_TAB_COLOR = {new:K_TEAL, u1:K_ORANGE, u2:K_ORANGE, u3:K_ORANGE, callback:K_PURPLE, calling:'#6C5CE7', confirmed:K_GREEN, cancelled:K_RED};
function kTabs(tabs, cur, act, base, colors){ return `<div class="ktabs" role="tablist">${tabs.map(([k,l,fn])=>`<button role="tab" aria-selected="${cur===k}" class="${cur===k?'on':''}" data-a="${act}" data-v="${k}">${colors[k]?`<span class="dot" style="background:${colors[k]}"></span>`:''}${t(l)} <span class="c">${base.filter(fn).length}</span></button>`).join('')}</div>`; }
viewConfList = function(){
  const u=S.ui.conf; u.date = u.date||'all'; if(!K_TABS.some(x=>x[0]===u.tab)) u.tab='all';
  // les commandes à traiter restent visibles quel que soit le jour ; le filtre de date porte sur l'arrivée
  const base = visibleOrders().filter(o=>kInDate(o.created, u.date));
  let list = base.filter(K_TABS.find(x=>x[0]===u.tab)[2]);
  if(u.q){ const q=u.q.toLowerCase(), qd=q.replace(/\s/g,''); list=list.filter(o=>o.ref.toLowerCase().includes(q)||CBY[o.customerId].name.toLowerCase().includes(q)||CBY[o.customerId].phone.replace(/\s/g,'').includes(qd)); }
  if(u.src) list=list.filter(o=>o.source===u.src);
  if(u.agent) list=list.filter(o=>String(o.agentId)===u.agent || (u.agent==='none'&&!o.agentId));
  const done = u.tab==='confirmed' || u.tab==='cancelled';
  list.sort(done? (a,b)=>b.created-a.created : (a,b)=>(a.nextCall||a.created)-(b.nextCall||b.created));
  const total=list.length; u.page = Math.min(u.page||1, Math.max(1, Math.ceil(total/50))); list = list.slice((u.page-1)*50, u.page*50);
  const canBulk = S.role!=='agent';
  const carriers = CARRIERS.filter(c=>c.connected);
  const row = o=>{
    const edit = kCanConf(o) && CONF_ST.includes(o.status); const cd = o.nextCall && CONF_ST.includes(o.status)? countdown(o.nextCall) : null; const cr=carrierOf(o);
    const sel = (f, opts, cur, lbl)=> edit? `<select class="kcell" data-ch="${f==='carrier'?'rowCarrier':'kField'}" data-f="${f}" data-id="${o.id}" aria-label="${t(lbl)}">${opts}</select>` : `<span>${cur}</span>`;
    return `<tr class="clickable" data-a="openOrder" data-id="${o.id}">
      ${canBulk?`<td data-stop="1"><input type="checkbox" ${u.sel.has(o.id)?'checked':''} data-ch="sel" data-id="${o.id}" aria-label="${o.ref}"></td>`:''}
      <td><b>${o.ref}</b> ${srcBadge(o.source)}${o.fresh?` <span class="badge green">${t('nouveau')}</span>`:''}${o.duplicate?` <span class="badge amber">${t('Doublon probable')}</span>`:''}</td>
      <td class="small">${fDT(o.created)}</td>
      <td><b>${esc(CBY[o.customerId].name)}</b>${kRisk(o)}</td>
      <td data-stop="1">${kPhoneCell(o)}</td>
      <td data-stop="1">${kPill(o,'conf',kCanConf(o) && (CONF_ST.includes(o.status)||o.status==='cancelled'))}${o.status==='calling'&&o.lockedBy?`<div class="xs muted">${ic('lock','sm')} ${esc((UBY[o.lockedBy]||{name:''}).name.split(' ')[0])}</div>`:''}</td>
      <td>${cd? `<span class="countdown ${cd.cls}">${cd.txt}</span>`:'<span class="muted">—</span>'}</td>
      <td>${agentCell(o.agentId)}</td>
      <td data-stop="1">${sel('carrier', carriers.map(c=>`<option value="${c.id}" ${c.id===cr.id?'selected':''}>${esc(kCarrierName(c))}</option>`).join('')+(cr.connected?'':`<option selected value="${cr.id}">${esc(cr.name)}</option>`), esc(kCarrierName(cr)), 'Société de livraison')}</td>
      <td data-stop="1">${sel('delivery', `<option value="home" ${o.delivery==='home'?'selected':''}>${t('Domicile')}</option><option value="desk" ${o.delivery==='desk'?'selected':''}>${t('Bureau')}</option>`, o.delivery==='home'?t('Domicile'):t('Bureau'), 'Type de livraison')}</td>
      <td data-stop="1">${sel('wilaya', WILAYAS.filter(w=>w.active||w.id===o.wilaya).map(w=>`<option value="${w.id}" ${w.id===o.wilaya?'selected':''}>${w.code} - ${esc(wName(w.id))}</option>`).join(''), esc(wName(o.wilaya)), 'Wilaya')}</td>
      <td data-stop="1">${sel('commune', communeOptions(o.wilaya, o.commune), esc(cName(o.commune)||'—'), 'Commune')}</td>
      <td>${itemsSummary(o.items)}</td>
      <td class="r num">${dzd(orderSub(o)-discountAmt(o))}</td><td class="r num">${o.freeShip? `<span class="badge green">${t('Gratuite')}</span>` : dzd(feeOf(o))}</td><td class="r num"><b>${dzd(orderTotal(o))}</b></td>
      <td data-stop="1">${edit? `<input class="kcell" style="min-width:150px" value="${esc(o.note||'')}" data-ch="kField" data-f="note" data-id="${o.id}" placeholder="${t('Remarque…')}" aria-label="${t('Remarques')}">` : `<span class="small">${esc(o.note||'')}</span>`}</td>
    </tr>`;
  };
  const cols = 15 + (canBulk?1:0);
  const body = `${kTabs(K_TABS, u.tab, 'confTab', base, K_TAB_COLOR)}
    <div class="filters-bar">
      ${kDateChips(u.date,'kDate')}
      <input class="input s" placeholder="${t('Rechercher n°, client, téléphone…')}" value="${esc(u.q)}" data-in="confQ" aria-label="${t('Rechercher')}">
      <select class="select" data-ch="confSrc" aria-label="Source"><option value="">${t('Toutes les sources')}</option>${['Site','WhatsApp','Messenger','Instagram','Téléphone'].map(s=>`<option ${u.src===s?'selected':''} value="${s}">${t(s)}</option>`).join('')}</select>
      ${S.role!=='agent'? `<select class="select" data-ch="confAgent" aria-label="Agent"><option value="">${t('Tous les agents')}</option><option value="none" ${u.agent==='none'?'selected':''}>${t('Non assignées')}</option>${AGENTS.map(a=>`<option value="${a.id}" ${u.agent==String(a.id)?'selected':''}>${esc(a.name)}</option>`).join('')}</select>`:''}
      <span class="grow"></span>
      ${canBulk && u.sel.size? `<span class="small"><b>${u.sel.size}</b> ${t('sélectionnée(s)')}</span><select class="select" id="bulkAgent" aria-label="${t('Réassigner à')}"><option value="">${t('Réassigner à…')}</option>${AGENTS.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join('')}</select><button class="btn sm" data-a="bulkReassign">${t('Réassigner')}</button><button class="btn sm" data-a="bulkCancelDup">${t('Annuler les doublons')}</button>`:''}
    </div>
    <div class="tbl-wrap"><table class="tbl ktbl"><thead><tr>${canBulk?`<th><input type="checkbox" class="check" data-ch="selAll" aria-label="${t('Tout sélectionner')}"></th>`:''}<th>${t('N°')}</th><th>${t('Date')}</th><th>${t('Nom complet')}</th><th>${t('Téléphone')}</th><th>${t('Statut')}</th><th>${t('Rappel')}</th><th>${t('Agent')}</th><th>${t('Société de livraison')}</th><th>${t('Type')}</th><th>${t('Wilaya')}</th><th>${t('Commune')}</th><th>${t('Produits')}</th><th class="r">${t('Prix produits')}</th><th class="r">${t('Livraison')}</th><th class="r">${t('Total')}</th><th>${t('Remarques')}</th></tr></thead><tbody>
    ${list.length? list.map(row).join('') : emptyRow(cols+1,'Aucune commande dans cet onglet')}
    </tbody></table></div>${kPager(total, u.page, 'kPage')}`;
  const actions = `<button class="btn" data-a="exportConf">${ic('download','sm')} ${t('Exporter')}</button><button class="btn primary" data-a="kNew">${ic('plus','sm')} ${t('Nouvelle commande')}</button>`;
  return erpShell('confirmer', t('Commandes à confirmer'), t('Cliquez sur la pastille pour changer le statut, sur la ligne pour ouvrir la fiche d\'appel'), card('', body), actions);
};
function kPager(total, page, act){ const n=Math.ceil(total/50); if(n<=1) return ''; return `<div class="row between" style="padding:10px 16px"><span class="small muted">${total} ${t('commande(s)')}</span><div class="row"><button class="btn sm" data-a="${act}" data-v="${page-1}" ${page<=1?'disabled':''}>‹</button><span class="small num">${page} / ${n}</span><button class="btn sm" data-a="${act}" data-v="${page+1}" ${page>=n?'disabled':''}>›</button></div></div>`; }
A.kPage = (el)=>{ S.ui.conf.page=+el.dataset.v; render(); };
A.kPageT = (el)=>{ S.ui.track2.page=+el.dataset.v; render(); };
['admin','manager','agent'].forEach(r=>ERP_VIEWS[r].confirmer = ()=>viewConfList());

/* ---------- Suivi des commandes ---------- */
const K_TTABS = [['all','Toutes',o=>CONFIRMED_ST.includes(o.status)], ...TRACK_TABS.map(([k,l,sts])=>[k, {toprep:'À préparer', ready:'Prête à expédier', sent:'Envoyée', transit:'En transit', failed:'Tentative échouée', delivered:'Livrée', ret:'Retour', paid:'Payée'}[k]||l, o=>sts.includes(o.status)])];
const K_TTAB_COLOR = {toprep:K_TEAL, ready:'#5FA8D3', sent:'#4A90C2', transit:'#5B6ABF', failed:'#E8A33D', delivered:K_GREEN, ret:K_RED, paid:'#1F8A3B'};
viewTracking = function(page){
  const u=S.ui.track2; u.date=u.date||'all'; const vo=visibleOrders().filter(o=>kInDate(o.times.confirmed||o.created, u.date));
  if(!K_TTABS.some(x=>x[0]===u.tab)) u.tab='toprep';
  let list = vo.filter(K_TTABS.find(x=>x[0]===u.tab)[2]);
  if(u.q){ const q=u.q.toLowerCase(), qd=q.replace(/\s/g,''); list=list.filter(o=>o.ref.toLowerCase().includes(q)||CBY[o.customerId].name.toLowerCase().includes(q)||(o.tracking||'').toLowerCase().includes(q)||CBY[o.customerId].phone.replace(/\s/g,'').includes(qd)); }
  if(u.carrier) list=list.filter(o=>carrierOf(o).id===u.carrier);
  list.sort((a,b)=>(b.times.confirmed||b.created)-(a.times.confirmed||a.created));
  const total=list.length; u.page = Math.min(u.page||1, Math.max(1, Math.ceil(total/50))); list=list.slice((u.page-1)*50, u.page*50);
  const ops = kCanShip();
  const bulk = ops && u.sel.size ? `<span class="small"><b>${u.sel.size}</b> ${t('sélectionnée(s)')}</span>${u.tab==='toprep'?`<button class="btn sm green" data-a="bulkReady">${t('Marquer prêtes')}</button><button class="btn sm" data-a="picking">${ic('print','sm')} ${t('Bon de préparation')}</button>`:''}${u.tab==='ready'?`<button class="btn sm primary" data-a="bulkSend">${ic('send','sm')} ${t('Envoyer à la société de livraison')}</button><button class="btn sm" data-a="bordereau">${ic('print','sm')} ${t('Bordereau')}</button>`:''}${u.tab==='delivered' && isAdmin()?`<button class="btn sm green" data-a="reconcile">${ic('cash','sm')} ${t('Rapprocher un versement')}</button>`:''}` : '';
  const row = o=>{
    const cr=carrierOf(o); const blocked = BLOCK_ST.includes(o.status) && Date.now()-o.lastDhdUpdate>48*HOUR; const last=o.attempts[o.attempts.length-1];
    const conf = o.history.find(h=>/^Confirmée/.test(h.action));
    const trackCell = o.tracking? `<span class="row" style="gap:4px"><span class="num small" dir="ltr">${esc(o.tracking)}</span><button class="kico" data-a="kCopy" data-v="${esc(o.tracking)}" title="${t('Copier')}" aria-label="${t('Copier')}">${ic('copy','sm')}</button>${o.trackUrl?`<a class="kico" href="${esc(o.trackUrl)}" target="_blank" rel="noopener" title="${t('Suivi transporteur')}" aria-label="${t('Suivi transporteur')}">${ic('arrowR','sm flip')}</a>`:''}</span>` : (ops && ['ready','sent','picked'].includes(o.status) && !cr.internal? `<input class="kcell num" dir="ltr" style="width:140px" placeholder="${t('N° de suivi…')}" data-ch="kField" data-f="tracking" data-id="${o.id}" aria-label="${t('Numéro de suivi')}">` : '<span class="muted">—</span>');
    return `<tr class="clickable ${o.riskReturn&&o.status==='failed'?'risk':''}" data-a="openOrder" data-id="${o.id}">
      ${ops?`<td data-stop="1"><input type="checkbox" ${u.sel.has(o.id)?'checked':''} data-ch="selT" data-id="${o.id}" aria-label="${o.ref}"></td>`:''}
      <td><b>${o.ref}</b></td>
      <td class="small">${o.times.sent? fDT(o.times.sent) : '<span class="muted">—</span>'}</td>
      <td><b>${esc(CBY[o.customerId].name)}</b>${kRisk(o)}</td>
      <td data-stop="1">${kPhoneCell(o)}</td>
      <td>${esc(wName(o.wilaya))}<div class="xs muted">${esc(cName(o.commune)||'')}</div></td>
      <td>${o.delivery==='home'?t('Domicile'):t('Bureau')}</td>
      <td>${carrierLogo(cr,22)} <span class="small">${esc(kCarrierName(cr))}</span></td>
      <td data-stop="1">${trackCell}</td>
      <td data-stop="1">${kPill(o,'ship',ops && !['returned','closed','cancelled'].includes(o.status))}${blocked?` <span class="badge red">${t('bloqué +48 h')}</span>`:''}</td>
      <td data-stop="1">${last? `<span class="kpill sm" style="${kPillStyle(last.resolved?'#9ca3af':K_ORANGE)}" title="${esc(last.comment||'')}">${last.n}· ${esc(t((FBY[last.reason]||{fr:last.reason}).fr))}</span>` : ''}${ops && ['sent','picked','transit','outfor','failed'].includes(o.status)? ` <button class="kico" data-a="kMenu" data-k="note" data-id="${o.id}" title="${t('Ajouter une note de suivi (tentative échouée)')}" aria-label="${t('Ajouter une note de suivi')}">${ic('plus','sm')}</button>`:''}</td>
      <td class="small">${o.lastDhdUpdate? ago(o.lastDhdUpdate):'—'}</td>
      <td class="r num"><b>${dzd(orderTotal(o))}</b></td>
      <td class="small">${conf? esc(conf.who.split(' ')[0]) : '—'}</td>
      <td data-stop="1"><button class="kico" data-a="printLabel" data-id="${o.id}" title="${t('Étiquette')}" aria-label="${t('Étiquette')}">${ic('print','sm')}</button>${o.label?`<a class="kico" href="${esc(o.label)}" target="_blank" rel="noopener" title="${t('Bordereau du transporteur')}" aria-label="${t('Bordereau du transporteur')}">${ic('download','sm')}</a>`:''}</td>
    </tr>`;
  };
  const used = [...new Set(vo.filter(o=>CONFIRMED_ST.includes(o.status)).map(o=>carrierOf(o).id))];
  const body = card('', `${kTabs(K_TTABS, u.tab, 'trackTab', vo, K_TTAB_COLOR)}
    <div class="filters-bar">${kDateChips(u.date,'kDateT')}<input class="input s" placeholder="${t('Rechercher n°, client, téléphone, suivi…')}" value="${esc(u.q)}" data-in="trackQ" aria-label="${t('Rechercher')}">
      <select class="select" data-ch="kCarrierF" aria-label="${t('Société de livraison')}"><option value="">${t('Toutes les sociétés')}</option>${used.map(id=>`<option value="${id}" ${u.carrier===id?'selected':''}>${esc(kCarrierName(CRB[id]))}</option>`).join('')}</select><span class="grow"></span>${bulk}</div>
    <div class="tbl-wrap"><table class="tbl ktbl"><thead><tr>${ops?`<th><input type="checkbox" data-ch="selAllT" aria-label="${t('Tout sélectionner')}"></th>`:''}<th>${t('N°')}</th><th>${t('Date d\'envoi')}</th><th>${t('Nom complet')}</th><th>${t('Téléphone')}</th><th>${t('Wilaya')}</th><th>${t('Type')}</th><th>${t('Société de livraison')}</th><th>${t('Numéro de suivi')}</th><th>${t('Statut de livraison')}</th><th>${t('Notes de suivi')}</th><th>${t('Dernière mise à jour')}</th><th class="r">${t('Total')}</th><th>${t('Confirmé par')}</th><th></th></tr></thead><tbody>
    ${list.length? list.map(row).join('') : emptyRow(15,'Aucune commande dans cet onglet','box')}
    </tbody></table></div>${kPager(total, u.page, 'kPageT')}`);
  const actions = `${ops?`<button class="btn" data-a="dhdSync">${ic('refresh','sm')} ${t('Synchroniser les statuts')}</button>`:''}<a class="btn kraft" href="#/erp/tentatives">${ic('alert','sm')} ${t('Tentatives de livraison')}</a>${isAdmin()?`<button class="btn" data-a="reconcile">${ic('cash','sm')} ${t('Rapprochement des versements')}</button>`:''}`;
  return erpShell(page||'suivi', t('Suivi des commandes'), S.lastSync? t('Statuts relus à')+' '+fTime(S.lastSync) : t('Cliquez sur la pastille pour changer l\'étape du colis'), body, actions);
};
['admin','gerant'].forEach(r=>ERP_VIEWS[r].suivi = ()=>viewTracking());
function carrierLogo(c, size){ return c.logo? `<img src="assets/carriers/${esc(c.logo)}" alt="" width="${size}" height="${size}" style="border-radius:5px;object-fit:contain;vertical-align:middle;background:#fff">` : `<span class="avatar sm" style="width:${size}px;height:${size}px;font-size:9px;background:${c.color||'var(--kraft-l)'};color:#fff;display:inline-grid;vertical-align:middle">${esc((c.short||c.name).slice(0,3))}</span>`; }

/* ---------- Nouvelle commande (saisie par l'équipe) : créée par le serveur ---------- */
S.ui.knew = null;
function kNewHtml(){
  const n=S.ui.knew; const tmp={wilaya:+n.wilaya, items:n.items.filter(i=>PBY[i.pid]).map(i=>({pid:i.pid, v:i.v, q:i.q, price:unitPrice(PBY[i.pid],i.v,i.q)})), delivery:n.delivery}; tmp.carrier=autoCarrier(tmp);
  const sub=linesTotal(tmp.items), fee=tmp.items.length? feeOf(tmp):0;
  const prods = PRODUCTS.filter(p=>p.price && !['devis','archive'].includes(p.status));
  return modalTpl(t('Nouvelle commande'), `<div class="col" style="gap:12px">
    <div class="grid2">
      <div class="field"><label for="knS">${t('Source')}</label><select class="select" id="knS" data-ch="knF" data-f="source">${['Téléphone','WhatsApp','Messenger','Instagram','Site'].map(s=>`<option ${n.source===s?'selected':''}>${s}</option>`).join('')}</select></div>
      <div class="field"><label for="knP">${t('Téléphone')} *</label><input class="input" id="knP" dir="ltr" inputmode="numeric" maxlength="10" placeholder="05 XX XX XX XX" value="${esc(n.phone)}" data-ch="knF" data-f="phone"></div>
      <div class="field"><label for="knN">${t('Nom complet')} *</label><input class="input" id="knN" value="${esc(n.name)}" data-ch="knF" data-f="name"></div>
      <div class="field"><label for="knW">${t('Wilaya')} *</label><select class="select" id="knW" data-ch="knF" data-f="wilaya">${WILAYAS.filter(w=>w.active).map(w=>`<option value="${w.id}" ${w.id===+n.wilaya?'selected':''}>${w.code} - ${esc(wName(w.id))}</option>`).join('')}</select></div>
      <div class="field"><label for="knC">${t('Commune')} *</label><select class="select" id="knC" data-ch="knF" data-f="commune">${communeOptions(n.wilaya, n.commune)}</select></div>
      <div class="field"><label for="knD">${t('Type de livraison')}</label><select class="select" id="knD" data-ch="knF" data-f="delivery"><option value="home" ${n.delivery==='home'?'selected':''}>${t('Domicile')}</option><option value="desk" ${n.delivery==='desk'?'selected':''}>${t('Bureau')}</option></select></div>
    </div>
    <div class="field"><label for="knA">${t('Adresse')}</label><input class="input" id="knA" value="${esc(n.address)}" data-ch="knF" data-f="address" placeholder="${t('Rue, cité, repère…')}"></div>
    <div class="col" style="gap:6px"><b class="small">${t('Produits')}</b>
      ${n.items.map((it,i)=>{ const p=PBY[it.pid]; return `<div class="row" style="gap:6px"><select class="select grow" data-ch="knItem" data-i="${i}" data-f="pid" aria-label="${t('Produit')}">${prods.map(x=>`<option value="${x.id}" ${x.id===it.pid?'selected':''}>${esc(x.name)} — ${dzd(x.price)}</option>`).join('')}</select>${p&&p.variants? `<select class="select" style="width:110px" data-ch="knItem" data-i="${i}" data-f="v" aria-label="${t('Variante')}">${p.variants.map(v=>`<option value="${esc(v.id)}" ${v.id===it.v?'selected':''}>${esc(v.label)}</option>`).join('')}</select>`:''}<input class="input num" type="number" min="1" style="width:76px" value="${it.q}" data-ch="knItem" data-i="${i}" data-f="q" aria-label="${t('Quantité')}"><button class="btn icon ghost" data-a="knDel" data-i="${i}" aria-label="${t('Retirer')}" ${n.items.length<2?'disabled':''}>${ic('x','sm')}</button></div>`; }).join('')}
      <button class="btn sm" data-a="knAdd" style="align-self:start">${ic('plus','sm')} ${t('Ajouter un produit')}</button></div>
    <div class="field"><label for="knO">${t('Remarque')}</label><textarea class="input" id="knO" data-ch="knF" data-f="note" placeholder="${t('Collez ici le message WhatsApp / Messenger…')}">${esc(n.note)}</textarea></div>
    <div class="sumbox"><div class="ln"><span>${t('Sous-total')}</span><span class="num">${dzd(sub)}</span></div><div class="ln"><span>${t('Livraison')}</span><span class="num">${dzd(fee)}</span></div><div class="ln tot"><span>${t('Total à encaisser')}</span><span class="num">${dzd(sub+fee)}</span></div></div>
  </div>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="knSave">${t('Créer la commande')}</button>`, true);
}
function kNewDraw(){ S.modal={html:kNewHtml(), wide:true}; renderOverlay(); }
A.kNew = ()=>{ const p=PRODUCTS.find(x=>x.price && !['devis','archive'].includes(x.status)); if(!p){ toast(t('Ajoutez d\'abord un produit'),'bad'); return; } S.ui.knew={source:'Téléphone', phone:'', name:'', wilaya:16, commune:'', delivery:'home', address:'', note:'', items:[{pid:p.id, v:p.variants?p.variants[0].id:null, q:1}]}; kNewDraw(); };
A.manualOrder = A.kNew;
CH.knF = (el)=>{ const n=S.ui.knew; n[el.dataset.f]=el.value; if(el.dataset.f==='wilaya') n.commune=''; if(['wilaya','delivery'].includes(el.dataset.f)) kNewDraw(); if(el.dataset.f==='phone'){ const c=CUSTOMERS.find(x=>x.phone.replace(/\s/g,'')===el.value.replace(/\D/g,'')); if(c && !n.name){ Object.assign(n,{name:c.name, wilaya:c.wilaya, commune:c.commune, address:c.address}); kNewDraw(); toast(t('Client connu')+' : '+esc(c.name),'ok'); } } };
CH.knItem = (el)=>{ const it=S.ui.knew.items[+el.dataset.i]; if(el.dataset.f==='pid'){ it.pid=+el.value; const p=PBY[it.pid]; it.v=p.variants?p.variants[0].id:null; } else if(el.dataset.f==='v') it.v=el.value; else it.q=Math.max(1,+el.value||1); kNewDraw(); };
A.knAdd = ()=>{ const n=S.ui.knew; const p=PBY[n.items[n.items.length-1].pid]; n.items.push({pid:p.id, v:p.variants?p.variants[0].id:null, q:1}); kNewDraw(); };
A.knDel = (el)=>{ S.ui.knew.items.splice(+el.dataset.i,1); kNewDraw(); };
A.knSave = async(el)=>{
  const n=S.ui.knew; n.note=val('knO'); n.name=val('knN'); n.phone=val('knP'); n.address=val('knA'); n.commune=val('knC');
  el.disabled=true;
  try{ const r = await api('order', n); closeModal(); await syncNow(); toast(r.ref+' '+t('créée'),'ok'); render(); }
  catch(e){ el.disabled=false; toast(esc(e.message),'bad'); }
};
