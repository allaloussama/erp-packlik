"use strict";
/* ============================================================
   Suivi des commandes : copie de l'interface Kando (onglets Société de livraison / Livreur,
   barre d'outils, pastilles d'étape, filtres détaillés, notes de suivi, parcours du colis,
   réclamations, annulation d'envoi).
   ============================================================ */
const manKind = st => ({picked:'sent', transit:'sent', paid:'delivered', closed:'delivered'})[st] || st;
function manDef(o){
  const L=kList('man'), k=manKind(o.status);
  const d = o.manStatus && L.find(x=>x.id===o.manStatus);
  if(d && d.kind===k) return d;
  return L.find(x=>x.kind===k) || {id:'_'+k, label:K_STEP[o.status]? K_STEP[o.status][0] : k, color:K_STEP[o.status]? K_STEP[o.status][1] : '#999999', kind:k};
}
function kShipNext(o){
  return ({sent:['picked','transit','outfor','delivered','failed','returning'], picked:['transit','outfor','delivered','failed','returning'], transit:['outfor','delivered','failed','returning'], outfor:['delivered','failed','returning'], failed:['outfor','delivered','returning'], returning:['returned'], delivered: isAdmin()? ['paid']:[], paid: isAdmin()? ['closed']:[]})[o.status] || [];
}
function kShipTo(o, st){
  if(!kCanShip()){ toast(t('Action réservée à l\'admin et au gérant'),'bad'); return; }
  if(st===o.status){ render(); return; }
  if(st==='failed'){ KM={kind:'fail', id:o.id, x:Math.max(8,innerWidth/2-115), y:innerHeight/3, top:innerHeight/3}; drawKMenu(); return; }
  if(st==='returned') return A.receiveReturn({dataset:{id:o.id}});
  if(st==='sent') return shipOrders([o]);
  kRun(o, ()=>A.oSet({dataset:{v:st}}));
}
function kManApply(o, id, note){
  const d=kList('man').find(x=>x.id===id); if(!d) return;
  if(note!==undefined) o.statusNote=note;
  o.manStatus=d.id;
  if(manKind(o.status)===d.kind){ hist(o, d.label, note||'', ''); render(); return; }
  kShipTo(o, d.kind);
}
/* tentative échouée avec son motif */
function kFail(o, reason){
  const r=FBY[reason], n=o.attempts.length+1;
  o.attempts.push({n, at:Date.now(), reason:r.id, comment:'Saisie manuelle', action:'', agentId:o.agentId, due:Date.now()+r.delay, result:'', resolved:false});
  if(n>=3) o.riskReturn=true;
  if(o.status==='failed') o.status='transit';
  setStatus(o,'failed', r.fr+(n>=3?' — Risque de retour':'')); o.history[o.history.length-1].action='Tentative '+n+' échouée';
  NOTIFS.unshift({at:Date.now(), txt:'Tentative '+n+' échouée sur '+o.ref+' ('+r.fr+')'});
  toast(o.ref+' : '+t('tentative')+' '+n+' '+t('échouée')+' ('+t(r.fr)+')','bad'); render();
}
function kFailQuiet(o, label){ const n=o.attempts.length+1; o.attempts.push({n, at:Date.now(), reason:'unreach', comment:label, action:'', agentId:o.agentId, due:Date.now()+2*HOUR, result:'', resolved:false}); if(n>=3) o.riskReturn=true; if(o.status==='failed') o.status='transit'; setStatus(o,'failed',label); o.history[o.history.length-1].action='Tentative '+n+' échouée'; }

/* ---------- annuler l'envoi : la commande revient dans « à confirmer », le stock est réintégré ---------- */
const kCancellable = o => ['sent','picked','transit','outfor','failed'].includes(o.status);
function kCancelShip(o){
  if(!kCancellable(o)) return false;
  expand(o.items).forEach(i=>{ const p=PBY[i.pid]; if(!p) return; if(p.variants && i.v){ const v=p.variants.find(x=>x.id===i.v); if(v) v.stock+=i.q; } else p.stock+=i.q; stockMove(i.pid,'retour',i.q,o.ref,'Envoi annulé'); });
  const api_ = carrierHasApi(carrierOf(o)) && o.tracking;
  o.tracking=''; o.label=''; o.trackUrl=''; delete o.feeFixed; delete o.dhdFixed; delete o.times.sent;
  o.status='ready'; setStatus(o,'toprep', t('Retour aux commandes à confirmer (envoi annulé)')+(api_? ' — '+t('le colis reste à annuler chez la société'):''));
  return true;
}
A.kCancelShip = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); if(!kCanShip()) return; if(!kCancellable(o)){ toast(t('Envoi impossible à annuler à cette étape'),'bad'); return; } openModal(modalTpl(t('Annuler l\'envoi'), `<p class="small" style="margin-top:0">${esc(o.ref)} — ${t('La commande revient dans « Commandes à confirmer » et le stock est réintégré.')}</p>${carrierHasApi(carrierOf(o))&&o.tracking? `<div class="lock-note">${ic('alert','sm')} ${t('Pensez à annuler aussi le colis dans l\'espace de la société de livraison.')}</div>`:''}`, `<button class="btn" data-a="closeModal">${t('Retour')}</button><button class="btn red" data-a="kCancelShipGo" data-id="${o.id}">${t('Annuler l\'envoi')}</button>`)); };
A.kCancelShipGo = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); closeModal(); if(kCancelShip(o)) toast(o.ref+' : '+t('Envoi annulé'),'ok'); render(); };
A.kCancelSel = ()=>{ const u=S.ui.kt; let n=0; ORDERS.filter(o=>u.sel.has(o.id)).forEach(o=>{ if(kCancelShip(o)) n++; }); u.sel.clear(); toast(n+' '+t('envoi(s) annulé(s)'), n?'ok':'bad'); render(); };

/* ---------- fenêtres du suivi ---------- */
A.kStNote = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); openModal(modalTpl(t('Note du statut')+' · '+o.ref, `<textarea class="input" id="kStNoteT" rows="3" placeholder="${t('Écrire une note pour ce statut…')}">${esc(o.statusNote||'')}</textarea>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn green" data-a="kStNoteSave" data-id="${o.id}">${t('Enregistrer')}</button>`)); };
A.kStNoteSave = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); o.statusNote=val('kStNoteT').trim(); hist(o,'Note du statut',o.statusNote); closeModal(); render(); };
A.kJourney = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); S.ui.kj={id:o.id, events:null, err:''}; kJourneyDraw(); };
function kJourneyDraw(){
  const o=ORDERS.find(x=>x.id===S.ui.kj.id), j=S.ui.kj, steps=['sent','picked','transit','outfor','delivered'];
  const reached = st => o.times[st] || steps.indexOf(st) <= steps.indexOf(o.status);
  const api_ = carrierHasApi(carrierOf(o)) && o.tracking;
  openModal(modalTpl(t('Suivi de la commande')+' · '+o.ref, `<div class="kjourney">${steps.map(st=>`<div class="kjstep ${reached(st)?'on':''}" style="--c:${K_STEP[st][1]}"><span class="d"></span><b class="xs">${t(K_STEP[st][0])}</b><span class="xs muted num">${o.times[st]? fDT(o.times[st]) : ''}</span></div>`).join('')}</div>
    ${['failed','returning','returned'].includes(o.status)? `<div class="lock-note" style="margin-top:10px">${ic('alert','sm')} ${t(K_STEP[o.status][0])}</div>`:''}
    <div class="small" style="margin:10px 0 4px">${carrierLogo(carrierOf(o),20)} <b>${esc(kCarrierName(carrierOf(o)))}</b> · <span dir="ltr">${esc(o.tracking||'—')}</span> ${o.trackUrl? `<a href="${esc(o.trackUrl)}" target="_blank" rel="noopener">${t('Voir chez la société')}</a>`:''}</div>
    ${api_? `<button class="btn sm" data-a="kJourneyFetch">${ic('refresh','sm')} ${t('Lire le suivi chez la société')}</button>`:''}
    ${j.err? `<p class="small" style="color:var(--red)">${esc(j.err)}</p>`:''}
    ${j.events? `<ol class="ktl">${j.events.map(e=>`<li><b class="small">${esc(e.status)}</b><p class="xs muted" dir="ltr">${esc(e.date)}${e.place? ' · '+esc(e.place):''}</p></li>`).join('') || `<li class="small muted">${t('Aucune étape')}</li>`}</ol>`:''}
    <ol class="ktl">${o.history.slice().reverse().map(h=>`<li><span class="kpill sm" style="${kPillStyle(kHistColor(h))}">${esc(t(h.action))}</span><p class="xs muted" dir="ltr">${fDT(h.at)} · ${esc(t(h.who))}</p>${h.note? `<p class="knote">${esc(t(h.note))}</p>`:''}</li>`).join('')}</ol>`, ''));
}
A.kJourneyFetch = async()=>{ const j=S.ui.kj; try{ const r=await api('carrier.track', {orderId:j.id}); j.events=r.events; j.err=''; }catch(e){ j.err=e.message; } kJourneyDraw(); };
A.kClaim = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); openModal(modalTpl(t('Réclamation')+' · '+o.ref, `${(o.claims||[]).map(c=>`<div class="knote" style="margin-bottom:6px"><b class="xs">${fDT(c.at)} · ${esc(c.who)}</b><div class="small">${esc(c.text)}</div></div>`).join('')}<textarea class="input" id="kClaimT" rows="3" placeholder="${t('Motif de la réclamation (colis abîmé, montant non versé…)')}"></textarea>`, `<button class="btn" data-a="closeModal">${t('Fermer')}</button><button class="btn" style="background:#C9A800;color:#fff;border-color:#C9A800" data-a="kClaimSave" data-id="${o.id}">${t('Enregistrer')}</button>`)); };
A.kClaimSave = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id), txt=val('kClaimT').trim(); if(!txt) return; o.claims=(o.claims||[]).concat({at:Date.now(), who:me().name, text:txt}); hist(o,'Réclamation',txt,'amber'); closeModal(); toast(t('Réclamation enregistrée'),'ok'); render(); };
A.kAssignMan = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); const list=COURIERS.filter(c=>c.active); openModal(modalTpl(t('Assigner un livreur'), list.length? `<div class="col" style="gap:6px">${list.map(c=>`<button class="kmanpick ${o.courierId===c.id?'on':''}" data-a="kAssignManGo" data-id="${o.id}" data-v="${c.id}">${ic('userR','sm')} <span class="grow">${esc(c.name)} <span class="xs muted">· ${esc(c.phone)}</span></span></button>`).join('')}</div>` : `<p class="small muted">${t('Aucun livreur. Ajoutez-en depuis le menu Livreurs.')}</p>`, '')); };
A.kAssignManGo = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); o.courierId=+el.dataset.v; hist(o,'Livreur', CUB[o.courierId].name); closeModal(); render(); };
A.kPrint = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); if(o.label) window.open(o.label,'_blank','noopener'); else A.printLabel({dataset:{id:o.id}}); };
A.kCopy = el=>{ navigator.clipboard && navigator.clipboard.writeText(el.dataset.v).then(()=>toast(t('Copié')+' : '+esc(el.dataset.v),'ok')); };

/* ---------- lecture des statuts chez les sociétés reliées par API ---------- */
const K_ORDER = ['sent','picked','transit','outfor','failed','delivered','returning','returned'];
A.dhdSync = async()=>{
  const list = ORDERS.filter(o=>kCancellable(o) && o.tracking && carrierHasApi(carrierOf(o)));
  if(!list.length){ S.lastSync=Date.now(); toast(t('Aucun colis à synchroniser : la lecture automatique demande une société reliée par API.'),'ok'); render(); return; }
  S.ui.kt.syncing=true; render(); let moved=0, errs=0;
  for(const o of list){
    try{
      const r = await api('carrier.track', {orderId:o.id}); if(!r.step) continue;
      const last=r.events[0]; o.carrierStatus = last.status; const step = r.step==='returned'? 'returning' : r.step;
      if(step===o.status || (K_ORDER.indexOf(step) < K_ORDER.indexOf(o.status) && step!=='failed')) continue;
      if(step==='failed') kFailQuiet(o, last.status); else setStatus(o, step, carrierOf(o).name+' : '+last.status+(last.place?' · '+last.place:''));
      moved++;
    }catch(e){ errs++; }
  }
  S.ui.kt.syncing=false; S.lastSync=Date.now(); toast(t('Statuts mis à jour')+' : '+moved+(errs? ' · '+errs+' '+t('erreur(s)'):''), errs?'bad':'ok'); render(); queueSync();
};

/* ---------- cellules du suivi ---------- */
function kTrackCell(o, c){
  const key=c.key, ops=kCanShip(), cr=carrierOf(o), api_=carrierHasApi(cr) && !!o.tracking, man=S.ui.kt.tab==='man';
  if(key.startsWith('custom_')) return `<input class="kcell" style="width:7rem" value="${esc((o.custom||{})[key]||'')}" data-ch="kRow" data-f="custom" data-k="${esc(key)}" data-id="${o.id}" aria-label="${esc(kColLabel('track',c))}">`;
  switch(key){
    case 'sentAt': return `<span class="num muted">${o.times.sent? fDT(o.times.sent) : '—'}</span>`;
    case 'dc': return `<span class="row" style="gap:6px;flex-wrap:nowrap">${cr.id? carrierLogo(cr,20):''}<span>${esc(kCarrierName(cr))}</span></span>`;
    case 'deliveryMan': return ops? `<button class="kbtn" data-a="kAssignMan" data-id="${o.id}">${ic('userR','sm')} ${esc((CUB[o.courierId]||{}).name||'—')} ${ic('chevD','sm')}</button>` : esc((CUB[o.courierId]||{}).name||'—');
    case 'tracking': return o.tracking? `<span class="ktrack" dir="ltr"><button class="kico" data-a="kCopy" data-v="${esc(o.tracking)}" title="${t('Copier')}" aria-label="${t('Copier')}">${ic('copy','sm')}</button><button class="klink" data-a="kJourney" data-id="${o.id}" title="${t('Suivi de la commande')}">${esc(o.tracking)}</button><span class="kbr">${o.delivery==='desk'?'BR':'HM'}</span></span>` : ops && !cr.internal && !api_? `<input class="kcell num" dir="ltr" style="width:140px" placeholder="${t('N° de suivi…')}" data-ch="kRow" data-f="tracking" data-id="${o.id}" aria-label="${t('Numéro de suivi')}">` : '<span class="muted">—</span>';
    case 'status': {
      if(man) return kStatusPill(o, 'man', ops);
      const col=kColor(o), lab=kLabel(o);
      const note = o.statusNote? `<span class="kpill sm" style="${kPillStyle(col)};max-width:12rem" title="${esc(o.statusNote)}"><span class="trunc">${esc(o.statusNote)}</span></span>` : '';
      const pill = api_ || !ops? `<button class="kpill" style="${kPillStyle(col)}" data-a="kJourney" data-id="${o.id}" title="${esc(lab+(o.carrierStatus? ' — '+o.carrierStatus : ''))}">${esc(lab)}</button>` : `<button class="kpill" style="${kPillStyle(col)}" data-a="kMenu" data-k="ship" data-id="${o.id}">${esc(lab)} ${ic('chevD','sm')}</button>`;
      return `<span class="kstatus">${note}<span class="row" style="gap:4px;flex-wrap:nowrap">${pill}${ops? `<button class="kmnote" style="${kPillStyle(col)}" data-a="kStNote" data-id="${o.id}" title="${esc(o.statusNote||t('Ajouter une note'))}" aria-label="${t('Ajouter une note')}">${ic('note','sm')}</button>`:''}</span>${o.carrierStatus? `<span class="xs muted trunc" style="max-width:12rem">${esc(o.carrierStatus)}</span>`:''}</span>`;
    }
    case 'finance': { const d=finDef(o); return `<span class="kpill" style="${kPillStyle(d.color)}">${esc(t(d.label))}</span>`; }
    case 'fullName': return `<b>${esc((CBY[o.customerId]||{}).name||'—')}</b>`;
    case 'phone': return kPhone(o);
    case 'verify': return kVerify(o);
    case 'trackNote': { const n=kList('notes').find(x=>x.id===o.trackNote); const can=S.role!=='fournisseur'; return n? `<button class="kpill" style="${kPillStyle(n.color)}" ${can?`data-a="kMenu" data-k="tnote" data-id="${o.id}"`:''}>${esc(t(n.label))}</button>` : can? `<button class="kbtn" data-a="kMenu" data-k="tnote" data-id="${o.id}">${ic('plus','sm')} ${t('Note')}</button>` : '—'; }
    case 'wilaya': return esc(wName(o.wilaya));
    case 'commune': return esc(cName(o.commune)||'—');
    case 'product': return kProduct(o);
    case 'total': return `<b class="num" style="color:var(--kraft-d)">${dzd(orderTotal(o))}</b>`;
    case 'trackedBy': return ['admin','manager'].includes(S.role)? `<select class="kcell" data-ch="kRow" data-f="tracker" data-id="${o.id}" aria-label="${t('Suivi par')}"><option value="">—</option>${USERS.filter(u=>u.active && ['admin','gerant','manager','agent'].includes(u.role)).map(u=>`<option value="${u.id}" ${u.id===o.trackerId?'selected':''}>${esc(u.name)}</option>`).join('')}</select>` : esc(agentName(o.trackerId)||'—');
    case 'confirmedBy': return esc(agentName(o.agentId)||'—');
    case 'orderNo': return `<b class="num">${esc(o.ref)}</b>`;
    case 'address': return `<span class="trunc muted" style="max-width:12rem">${esc(o.address||'—')}</span>`;
    case 'typeL': return t(o.delivery==='home'?'Domicile':'Bureau');
    case 'qty': return `<span class="num">${o.items.reduce((s,i)=>s+i.q,0)}</span>`;
    case 'weight': return `<span class="num">${kg(orderWeight(o))}</span>`;
    case 'deliveryCost': return `<span class="num">${dzd(feeOf(o))}</span>`;
    case 'discount': return `<span class="num">${kDiscount(o)}</span>`;
    case 'remarks': return `<span class="trunc xs muted" style="max-width:10rem">${esc(o.note||'—')}</span>`;
    case 'actions': return `<div class="kacts">
      ${ops? `<button class="kico ${kCancellable(o)?'':'red'}" style="color:var(--red)" data-a="kCancelShip" data-id="${o.id}" title="${t('Annuler l\'envoi')}" aria-label="${t('Annuler l\'envoi')}">${ic('truck','sm')}</button><button class="kico green ${o.courierId?'sent':''}" data-a="kAssignMan" data-id="${o.id}" title="${t('Assigner un livreur')}" aria-label="${t('Assigner un livreur')}">${ic('userR','sm')}</button>`:''}
      <button class="kico" data-a="kDetail" data-id="${o.id}" title="${t('Détail de la commande')}" aria-label="${t('Détail de la commande')}">${ic('eye','sm')}</button>
      <button class="kico green" data-a="kJourney" data-id="${o.id}" title="${t('Suivi de la commande')}" aria-label="${t('Suivi de la commande')}">${ic('route','sm')}</button>
      <button class="kico" data-a="kPrint" data-id="${o.id}" title="${t('Imprimer le bordereau')}" aria-label="${t('Imprimer le bordereau')}">${ic('print','sm')}</button>
      ${api_? `<span class="kico" style="opacity:.45" title="${t('Commande chez le transporteur — non modifiable')}">${ic('lock','sm')}</span>` : ops? `<button class="kico" data-a="kEdit" data-id="${o.id}" title="${t('Modifier')}" aria-label="${t('Modifier')}">${ic('edit','sm')}</button>`:''}
      <button class="kico" data-a="kShare" data-id="${o.id}" title="${t('Partager')}" aria-label="${t('Partager')}">${ic('share','sm')}</button>
      ${ops? `<button class="kico gold" data-a="kClaim" data-id="${o.id}" title="${t('Réclamation')}" aria-label="${t('Réclamation')}">${ic('flag','sm')}${(o.claims||[]).length? `<span class="kdot">${o.claims.length}</span>`:''}</button>`:''}
      ${kCanDelete() && kTrashable(o)? `<button class="kico red" data-a="kDel" data-id="${o.id}" title="${t('Supprimer')}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button>`:''}</div>`;
  }
  return '';
}

/* ---------- Suivi des commandes ---------- */
S.ui.kt = {tab:'company', q:'', date:'all', day:'', page:1, sel:new Set(), st:'', dc:'', fin:'', type:'', agent:'', prod:'', pop:'', sheet:false, exp:new Set()};
function kTrackAll(){ const man=S.ui.kt.tab==='man'; return visibleOrders().filter(o=>SHIP_ST.includes(o.status) && !!carrierOf(o).internal===man); }
function kTrackBase(){
  const u=S.ui.kt; let l=kTrackAll().filter(o=>kInDate(o.times.sent||o.created, u.date, u.day));
  if(u.q){ const q=u.q.toLowerCase(), qd=q.replace(/\s/g,''); l=l.filter(o=>{ const c=CBY[o.customerId]||{}; return o.ref.toLowerCase().includes(q) || (c.name||'').toLowerCase().includes(q) || (c.phone||'').replace(/\s/g,'').includes(qd) || (o.tracking||'').toLowerCase().includes(q); }); }
  if(u.dc) l=l.filter(o=>carrierOf(o).id===u.dc);
  if(u.fin) l=l.filter(o=>finDef(o).id===u.fin);
  if(u.type) l=l.filter(o=>o.delivery===u.type);
  if(u.agent) l=l.filter(o=>String(o.agentId||'')===u.agent);
  if(u.prod) l=l.filter(o=>o.items.some(i=>String(i.pid)===u.prod));
  return l;
}
const kTrackChipId = o => S.ui.kt.tab==='man'? manDef(o).id : o.status;
viewTracking = function(page){
  const u=S.ui.kt, man=u.tab==='man', base=kTrackBase(), cols=kCols('track').map(c=> man && c.key==='deliveryMan'? {...c, visible:true} : c), ops=kCanShip();
  let list = u.st? base.filter(o=>kTrackChipId(o)===u.st) : base;
  list.sort((a,b)=>(b.times.sent||b.created)-(a.times.sent||a.created));
  u._total=list.length; u.page=Math.min(u.page, Math.max(1,Math.ceil(list.length/50))); const rows=list.slice((u.page-1)*50, u.page*50); u._ids=rows.map(o=>o.id);
  const chips = man? kList('man').map(d=>({id:d.id, label:d.label, color:d.color})) : SHIP_ST.map(st=>({id:st, label:K_STEP[st][0], color:K_STEP[st][1]}));
  const counts={}; base.forEach(o=>{ const id=kTrackChipId(o); counts[id]=(counts[id]||0)+1; });
  const opt=(v,cur,l)=>`<option value="${esc(v)}" ${String(cur)===String(v)?'selected':''}>${esc(l)}</option>`;
  const all=kTrackAll(), usedC=[...new Set(all.map(o=>carrierOf(o).id))].filter(Boolean), prods=[...new Set(all.flatMap(o=>o.items.map(i=>i.pid)))].filter(id=>PBY[id]).sort((a,b)=>PBY[a].name.localeCompare(PBY[b].name));
  const selN=u.sel.size, canAssign = ['admin','manager'].includes(S.role);
  const bar = `
    <div class="kseg2"><button class="${!man?'on':''}" data-a="ktTab" data-v="company">${t('Société de livraison')}</button><button class="${man?'on':''}" data-a="ktTab" data-v="man">${t('Livreur')}</button></div>
    <div class="kmbar"><input class="input" placeholder="${t('Rechercher…')}" value="${esc(u.q)}" data-in="ktQ" aria-label="${t('Rechercher')}"><button class="kbig ghost" data-a="kSheet" data-b="track" aria-label="${t('Filtres')}">${ic('sliders')}</button>${ops&&!man? `<button class="kbig" data-a="dhdSync" aria-label="${t('Synchroniser les statuts')}">${ic('refresh')}</button>`:''}</div>
    ${u.sheet? `<div class="ksheet-bg" data-a="kSheet" data-b="track"></div>`:''}
    <div class="ksheet ${u.sheet?'open':''}">
      <div class="ksheet-h"><b>${t('Filtres')}</b><button class="kico" data-a="kSheet" data-b="track" aria-label="${t('Fermer')}">${ic('x')}</button></div>
      <div class="kcmd">
        <div class="ksearch">${ic('search','sm')}<input class="input" placeholder="${t('Rechercher…')}" value="${esc(u.q)}" data-in="ktQ" aria-label="${t('Rechercher')}"></div>
        ${kDateBar(u,'track')}
        <div class="kright">
          ${selN? `<span class="kmulti">${t('Multitâche')} ${selN}</span>`:''}
          ${selN && ops? `<button class="kbtn danger" data-a="kCancelSel">${ic('truck','sm')} ${t('Annuler les envois')} (${selN})</button>`:''}
          ${canAssign? `<div class="kpopwrap"><button class="kbtn" data-a="kPop" data-b="track" data-v="assign">${ic('user','sm')} ${t('Assigner un agent de confirmation')}${selN?` (${selN})`:''}</button>${u.pop==='assign'? kAssignPop('track', selN):''}</div>`:''}
          <button class="kiconbtn" data-a="kReport" data-b="track" title="${t('Exporter (CSV)')}" aria-label="${t('Exporter (CSV)')}">${ic('download','sm')}</button>
          <div class="kpopwrap"><button class="kiconbtn" data-a="kPop" data-b="track" data-v="cols" title="${t('Paramètres de colonnes')}" aria-label="${t('Paramètres de colonnes')}">${ic('sliders','sm')}</button>${u.pop==='cols'? kColPanel('track'):''}</div>
          ${ops && !man? `<button class="kbtn brand" data-a="dhdSync" ${u.syncing?'disabled':''}>${ic('refresh','sm')} ${t(u.syncing?'Lecture en cours…':'Synchroniser les statuts')}</button>`:''}
          <button class="kiconbtn" data-a="ktRefresh" title="${t('Actualiser')}" aria-label="${t('Actualiser')}">${ic('refresh','sm')}</button>
          ${kCanDelete()? `<button class="kiconbtn danger" data-a="kDelSel" data-b="track" ${selN?'':'disabled'} title="${t('Corbeille')}" aria-label="${t('Supprimer la sélection')}">${ic('trash','sm')}</button><button class="kbtn danger" data-a="kDelAll" data-b="track" ${list.length?'':'disabled'}>${ic('trash','sm')} ${t('Tout supprimer')}</button><button class="kiconbtn" data-a="kTrash" title="${t('Corbeille')}" aria-label="${t('Corbeille')}" style="position:relative">${ic('archive','sm')}${kTrashList().length? `<span class="kdot">${kTrashList().length}</span>`:''}</button>`:''}
          ${man && kManage()? `<button class="kiconbtn" data-a="kManage" data-v="man" title="${t('Gérer les statuts')}" aria-label="${t('Gérer les statuts')}">${ic('gear','sm')}</button>`:''}
        </div>
      </div>
      ${!man && S.lastSync? `<p class="xs muted" style="margin:0">${t('Statuts relus à')} ${fTime(S.lastSync)}</p>`:''}
      <div class="kfilters">
        <span class="xs" style="font-weight:700;color:var(--ink2);display:inline-flex;gap:4px;align-items:center">${ic('filter','sm')} ${t('Filtres')} :</span>
        <select class="kfsel" data-ch="ktF" data-f="st">${opt('',u.st,t('Statut')+': '+t('Tous'))}${chips.map(c=>opt(c.id,u.st,t(c.label)+' ('+(counts[c.id]||0)+')')).join('')}</select>
        <select class="kfsel" data-ch="ktF" data-f="dc">${opt('',u.dc,'DC: '+t('Tous'))}${usedC.map(id=>opt(id,u.dc,kCarrierName(CRB[id]||NO_CARRIER))).join('')}</select>
        <select class="kfsel" data-ch="ktF" data-f="fin">${opt('',u.fin,t('Finance')+': '+t('Tous'))}${kList('fin').map(d=>opt(d.id,u.fin,t(d.label))).join('')}</select>
        <select class="kfsel" data-ch="ktF" data-f="type">${opt('',u.type,t('Type de livraison')+': '+t('Tous'))}${opt('home',u.type,t('Domicile'))}${opt('desk',u.type,t('Bureau'))}</select>
        <select class="kfsel" data-ch="ktF" data-f="agent">${opt('',u.agent,t('Confirmé par')+': '+t('Tous'))}${AGENTS.map(a=>opt(a.id,u.agent,a.name)).join('')}</select>
        ${prods.length? `<select class="kfsel" data-ch="ktF" data-f="prod">${opt('',u.prod,t('Produit')+': '+t('Tous'))}${prods.map(id=>opt(id,u.prod,PBY[id].name)).join('')}</select>`:''}
        ${u.st||u.dc||u.fin||u.type||u.agent||u.prod? `<button class="kbtn" data-a="ktReset">${ic('x','sm')} ${t('Réinitialiser')}</button>`:''}
        <span class="kright xs muted">${list.length} ${t('résultats')}</span>
      </div>
    </div>
    <div class="kchips">
      <button class="kchip ${!u.st?'on':''}" data-a="ktChip" data-v="">${t('Tous')} <b>${base.length}</b></button>
      ${chips.map(c=>`<button class="kchip ${u.st===c.id?'on':''}" data-a="ktChip" data-v="${esc(c.id)}"><span class="dot" style="background:${c.color}"></span>${esc(t(c.label))} <b>${counts[c.id]||0}</b></button>`).join('')}
    </div>`;
  const table = kTable('track', rows, cols, kTrackCell, u, o=>`--c:${kColor(o)}`);
  return erpShell(page||'suivi', t('Suivi des commandes'), '', `<div class="kboard">${bar}${table}</div>`);
};
['admin','gerant'].forEach(r=>ERP_VIEWS[r].suivi = ()=>viewTracking());
IN.ktQ = el=>{ S.ui.kt.q=el.value; S.ui.kt.page=1; render(); };
CH.ktF = el=>{ S.ui.kt[el.dataset.f]=el.value; S.ui.kt.page=1; render(); };
A.ktReset = ()=>{ Object.assign(S.ui.kt, {st:'', dc:'', fin:'', type:'', agent:'', prod:'', page:1}); render(); };
A.ktChip = el=>{ const u=S.ui.kt; u.st = u.st===el.dataset.v? '' : el.dataset.v; u.page=1; render(); };
A.ktTab = el=>{ Object.assign(S.ui.kt, {tab:el.dataset.v, st:'', page:1}); S.ui.kt.sel.clear(); render(); };
A.ktRefresh = ()=>{ Object.assign(S.ui.kt, {q:'', day:'', st:'', page:1}); syncNow(); render(); };
