"use strict";
/* ============================================================
   Commandes à confirmer : copie de l'interface Kando (barre d'outils, filtres détaillés,
   pastilles de statut, colonnes réglables, actions de ligne, fenêtres).
   Le suivi des commandes est dans kando-track.js. Les règles métier restent celles de
   app.js (resConfirm, setStatus, stock, finance…).
   ============================================================ */
Object.assign(IC, {
  sliders:'<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  pkg:'<path d="m16 16 2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l2-1.1"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>',
  filter:'<path d="M3 4h18l-7 8v6l-4 2v-8z"/>',
  note:'<path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5z"/><path d="M15 3v6h6"/>',
  rows:'<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  userR:'<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  arrowU:'<path d="m18 15-6-6-6 6"/>', arrowD:'<path d="m6 9 6 6 6-6"/>'
});

/* ---------- statuts (listes modifiables, mêmes couleurs que Kando) ---------- */
const KC = {TEAL:'#80BCBD', ORANGE:'#FFA447', GREEN:'#39FF14', RED:'#E23024', PURPLE:'#9D76C1', BLACK:'#040D12', NAVY:'#0F2B46', GRAY:'#9ca3af'};
CANCEL_REASONS.includes('Rupture de stock') || CANCEL_REASONS.splice(CANCEL_REASONS.length-1, 0, 'Rupture de stock');
const KDEF = {
  conf: [
    {id:'pending', label:'En attente', color:KC.TEAL, kind:'pending'},
    {id:'fail01', label:'Échec 01', color:KC.ORANGE, kind:'fail', n:1},
    {id:'fail02', label:'Échec 02', color:KC.ORANGE, kind:'fail', n:2},
    {id:'fail03', label:'Échec 03', color:KC.ORANGE, kind:'fail', n:3},
    {id:'confirmed', label:'Confirmée', color:KC.GREEN, kind:'confirm'},
    {id:'cancelled', label:'Annulée', color:KC.RED, kind:'cancel'},
    {id:'postponed', label:'Reporté', color:KC.PURPLE, kind:'callback'},
    {id:'duplicate', label:'Dupliquer', color:KC.BLACK, kind:'cancel', reason:'Doublon'},
    {id:'fail04', label:'Échec 04', color:KC.ORANGE, kind:'fail', n:4},
    {id:'fail05', label:'Échec 05', color:KC.ORANGE, kind:'fail', n:5},
    {id:'wrongNumber', label:'Mauvais numéro', color:KC.NAVY, kind:'cancel', reason:'Faux numéro'},
    {id:'wrongCommune', label:'Mauvaise commune', color:KC.NAVY, kind:'cancel', reason:'Hors zone'},
    {id:'smsSent', label:'SMS envoyé', color:KC.NAVY, kind:'pending'},
    {id:'toConfirmLater', label:'À confirmer plus tard', color:KC.NAVY, kind:'callback'},
    {id:'outOfStock', label:'Rupture de stock', color:KC.NAVY, kind:'cancel', reason:'Rupture de stock'}
  ],
  fin: [
    {id:'fin_select', label:'Sélectionner statut', color:KC.GRAY},
    {id:'fin_unpaid', label:'Non payé', color:KC.RED},
    {id:'fin_partial', label:'Acompte', color:KC.ORANGE},
    {id:'fin_paid', label:'Payé', color:'#2FBF4A'},
    {id:'fin_refunded', label:'Remboursé', color:KC.PURPLE}
  ],
  notes: [
    {id:'n1', label:'Client injoignable', color:'#FF6B6B'}, {id:'n2', label:'Client absent', color:'#F5A623'},
    {id:'n3', label:'Reporté à demain', color:'#8B8B00'}, {id:'n4', label:'Adresse incorrecte', color:'#4A90D9'},
    {id:'n5', label:'Commune non desservie', color:'#E91E8C'}, {id:'n6', label:'Client refuse le colis', color:'#4CAF50'},
    {id:'n7', label:'Colis endommagé', color:'#9B59B6'}, {id:'n8', label:'Livraison programmée', color:KC.NAVY}
  ],
  man: [
    {id:'m_sent', label:'Remis au livreur', color:KC.TEAL, kind:'sent'},
    {id:'m_outfor', label:'En livraison', color:KC.ORANGE, kind:'outfor'},
    {id:'m_failed', label:'Tentative échouée', color:'#E8A33D', kind:'failed'},
    {id:'m_delivered', label:'Livrée', color:'#2FBF4A', kind:'delivered'},
    {id:'m_returning', label:'Retour en cours', color:'#D9822B', kind:'returning'},
    {id:'m_returned', label:'Retournée', color:KC.RED, kind:'returned'}
  ]
};
const KIND_LABEL = {pending:'En attente', fail:'Échec (injoignable)', callback:'Reporté (rappel)', confirm:'Confirmée', cancel:'Annulée',
  sent:'Remis', picked:'Ramassée', transit:'En transit', outfor:'En livraison', failed:'Tentative échouée', delivered:'Livrée', returning:'Retour en cours', returned:'Retournée'};
/* étapes du colis chez une société de livraison (couleurs du suivi Kando) */
const K_STEP = {sent:['Prête à expédier','#80BCBD'], picked:['Ramassée','#5FA8D3'], transit:['En transit','#4A90C2'], outfor:['En livraison','#FFA447'],
  failed:['Tentative échouée','#E8A33D'], delivered:['Livrée','#2FBF4A'], returning:['Retour vers centre','#D9822B'], returned:['Retournée','#E23024'],
  paid:['Encaissée','#1F8A3B'], closed:['Clôturée','#0F2B46']};
const SHIP_ST = Object.keys(K_STEP);
const PRE_ST = ['new','calling','unreach','callback','cancelled','toprep','ready'];

function kList(k){ const l = (SETTINGS.kando||{})[k]; return Array.isArray(l) && l.length? l : KDEF[k]; }
const kManage = () => S.role==='admin';
function kTextOn(hex){ const h=String(hex||'#999999').replace('#',''); const l=(0.299*parseInt(h.slice(0,2),16)+0.587*parseInt(h.slice(2,4),16)+0.114*parseInt(h.slice(4,6),16))/255; return l>0.7? '#0B1220':'#fff'; }
function kPillStyle(c){ return `background:${c};color:${kTextOn(c)}`; }
function kindOf(st){ return st==='new'?'pending' : st==='unreach'?'fail' : st==='callback'?'callback' : st==='cancelled'?'cancel' : st==='calling'?'calling' : 'confirm'; }
/* Statut affiché d'une commande pas encore expédiée : celui choisi s'il correspond encore à son étape, sinon celui par défaut. */
function confDef(o){
  const L=kList('conf'), k=kindOf(o.status);
  if(k==='calling') return {id:'_calling', label:'En appel', color:'#6C5CE7', kind:'calling'};
  let d = o.confStatus && L.find(x=>x.id===o.confStatus);
  if(d && d.kind===k && (k!=='fail' || (d.n||1)===(o.unreachN||1)) && (k!=='cancel' || (d.reason||d.label)===o.cancelReason || !o.cancelReason)) return d;
  if(k==='fail') d = L.find(x=>x.kind==='fail' && (x.n||1)===(o.unreachN||1)) || L.find(x=>x.kind==='fail');
  else if(k==='cancel') d = L.find(x=>x.kind==='cancel' && (x.reason||x.label)===o.cancelReason) || L.find(x=>x.kind==='cancel');
  else d = L.find(x=>x.kind===k);
  return d || {id:'_'+k, label:KIND_LABEL[k]||k, color:'#999999', kind:k};
}
const finDef = o => kList('fin').find(x=>x.id===(o.financeStatus||'fin_select')) || kList('fin')[0];
function kLabel(o){ return SHIP_ST.includes(o.status)? t(K_STEP[o.status][0]) : t(confDef(o).label); }
function kColor(o){ return SHIP_ST.includes(o.status)? K_STEP[o.status][1] : confDef(o).color; }
function kCanConf(o){ return S.role==='admin' || S.role==='manager' || (S.role==='agent' && o.agentId===S.agentId); }
function kCanShip(){ return ['admin','gerant'].includes(S.role); }
const kCanDelete = () => S.role==='admin';

/* ---------- sociétés de livraison : aucune par défaut ---------- */
const NO_CARRIER = {id:'', name:'—', short:'—', connected:false, feeFactor:1, baseKg:5, extraPerKg:0, maxParcelKg:999, chargeOverweight:false, desk:true, cod:true, color:'#9ca3af'};
carrierOf = o => CRB[o.carrier] || NO_CARRIER;
autoCarrier = function(o){ const r=(SETTINGS.carrierRules||[]).find(x=>+x.wilaya===+o.wilaya && CRB[x.carrier] && CRB[x.carrier].connected); if(r) return r.carrier; const d=CARRIERS.find(c=>c.isDefault&&c.connected); return d? d.id : ''; };
function carrierHasApi(c){ return ['yalidine','ecotrack','noest'].includes(c.family) && c.creds && c.creds.token; }
function kCarrierName(c){ return !c.id? '—' : c.internal? t('Mes livreurs') : c.name; }
function carrierLogo(c, size){ return c.logo? `<img src="assets/carriers/${esc(c.logo)}" alt="" width="${size}" height="${size}" style="border-radius:5px;object-fit:contain;vertical-align:middle;background:#fff">` : `<span class="avatar sm" style="width:${size}px;height:${size}px;font-size:9px;background:${c.color||'var(--kraft-l)'};color:#fff;display:inline-grid;vertical-align:middle">${esc((c.short||c.name||'—').slice(0,3))}</span>`; }

/* ---------- remise en DA ou en %, poids et frais saisis à la main ---------- */
const _discountAmt = discountAmt;
discountAmt = o => o.discountType==='amount'? Math.min(orderSub(o), Math.max(0, +o.discount||0)) : _discountAmt(o);
const _orderWeight = orderWeight;
orderWeight = o => +o.weightFixed > 0? +o.weightFixed : _orderWeight(o);
preSendCheck = function(o){ const e=[]; if(!carrierOf(o).id) e.push('Choisissez une société de livraison'); else if(!carrierOf(o).connected) e.push('Société de livraison désactivée'); if(needsSplit(o)) e.push('Poids trop élevé : découper la commande'); if(!validPhone(CBY[o.customerId].phone)) e.push('Téléphone invalide'); if(!o.commune) e.push('Commune manquante'); expand(o.items).forEach(i=>{ if(PBY[i.pid] && PBY[i.pid].stock < i.q && !PBY[i.pid].onDemand) e.push('Stock insuffisant'); }); return [...new Set(e)]; };

/* ---------- fenêtres par-dessus le panneau d'une commande : le panneau n'est plus redessiné à chaque mise à jour ---------- */
renderOverlay = function(){
  const ov = document.getElementById('ov');
  let h = ''; if(S.drawer && !S.drawer.page) h += renderDrawer(); if(S.modal) h += S.modal.html;
  if(ov._h === h) return;
  const had = {drawer: !!ov.querySelector('.drawer') && !!S.drawer && ov._did===S.drawer.id, modal: !!ov.querySelector('.modal') && !!S.modal}; // même fenêtre redessinée (étape, onglet) : pas de nouvelle animation
  const scrolls = [...ov.querySelectorAll('.drawer-b,.modal-b,.timeline,.kscroll')].map(e=>e.scrollTop);
  ov.innerHTML = h; ov._h = h; ov._did = S.drawer && S.drawer.id; ov._mod = S.modal;
  if(had.drawer) ov.querySelectorAll('.drawer,.drawer-ov').forEach(e=>e.style.animation='none');
  if(had.modal) ov.querySelectorAll('.overlay').forEach(e=>e.style.animation='none');
  [...ov.querySelectorAll('.drawer-b,.modal-b,.timeline,.kscroll')].forEach((e,i)=>{ if(scrolls[i]) e.scrollTop=scrolls[i]; });
};
const _afterResult = afterResult;
afterResult = function(){ if(S.drawer && S.drawer.inline){ S.drawer=null; render(); return; } _afterResult(); };
const _closeModal = closeModal;
closeModal = function(){ _closeModal(); if(S.drawer && S.drawer.inline) S.drawer=null; };
A.closeModal = ()=>closeModal();
/* exécute une action de l'écran d'appel (qui travaille sur « la commande ouverte ») depuis le tableau */
function kRun(o, fn){ if(S.drawer && S.drawer.id===o.id){ fn(); return; } S.drawer={id:o.id, tab:'call', page:true, inline:true, addQ:''}; fn(); if(S.drawer && S.drawer.inline && !S.modal) S.drawer=null; }

/* ---------- changer le statut de confirmation ---------- */
function kConfApply(o, id, note){
  const d = kList('conf').find(x=>x.id===id); if(!d || !o) return;
  if(!kCanConf(o)){ toast(t('Commande d\'un autre agent'),'bad'); return; }
  if(note!==undefined) o.statusNote = note;
  const k = kindOf(o.status), inDrawer = S.drawer && !S.drawer.inline && S.drawer.id===o.id;
  const done = ()=> inDrawer? afterResult() : render();
  o.confStatus = d.id;
  if(k===d.kind && d.kind!=='fail' && d.kind!=='cancel'){ hist(o, d.label, note||'', ''); render(); return; }
  if(d.kind==='pending'){ o.nextCall=null; o.lockedBy=null; delete o.prevStatus; o.cancelReason=''; if(o.status==='new') o.status='calling'; setStatus(o,'new', t(d.label)); render(); }
  else if(d.kind==='fail'){
    const n=Math.max(1,Math.min(9,+d.n||1)); let next;
    if(n<=2) next=Date.now()+[30*MIN,2*HOUR][n-1]; else { const x=new Date(); x.setDate(x.getDate()+1); x.setHours(9,30,0,0); next=x.getTime(); }
    o.calls++; o.unreachN=n; o.nextCall=next; o.lockedBy=null; delete o.prevStatus; o.status='calling';
    setStatus(o,'unreach', t(d.label)+' · '+t('rappel')+' '+fDT(next)); toast(o.ref+' : '+t(d.label)+' — '+t('rappel programmé à')+' '+fTime(next),'ok'); done();
  }
  else if(d.kind==='callback') kRun(o, A.resCallback);
  else if(d.kind==='confirm') kRun(o, A.resConfirm);
  else if(d.kind==='cancel'){ o.cancelReason = d.reason || d.label; o.lockedBy=null; o.nextCall=null; delete o.prevStatus; if(o.status==='cancelled') o.status='calling'; setStatus(o,'cancelled', t('Motif')+' : '+t(o.cancelReason)); toast(o.ref+' : '+t(d.label),'ok'); done(); }
}

/* ---------- colonnes (comme Kando : afficher, renommer, réordonner, colonnes libres) ---------- */
const KCOLS = {
  conf: [['source','Source',1],['platform','Plateforme',1],['origin','Origine',1],['orderNo','Commande N°',1],['date','Date',1],['store','Nom boutique',1],['fullName','Nom complet',1],['phone','Téléphone',1],['verify','Vérifier',1],['status','Statut',1],['confirmedBy','Confirmé par',1],['address','Adresse',1],['dc','Société de livraison',1],['dcAction','DC action',0],['typeL','Type de livraison',1],['wilaya','Wilaya',1],['commune','Commune',1],['product','Produit',1],['sku','Réf (SKU)',1],['variants','Variantes',0],['qty','Quantité',0],['productPrice','Prix de produit',1],['deliveryCost','Prix de livraison',1],['discount','Remise',0],['weight','Poids (kg)',1],['exchange','Changer',0],['total','Total',1],['finance','Finance',1],['costMeta','Cost final',0],['remarks','Remarques',0],['otherCols','Autres colonnes',1],['actions','Actions',1]],
  track: [['sentAt','Date d\'expédition',1],['dc','Société de livraison',1],['deliveryMan','Livreur',0],['tracking','Numéro de suivi',1],['status','Statut',1],['finance','Finance',1],['fullName','Nom complet',1],['phone','Téléphone',1],['verify','Vérifier',1],['trackNote','Notes de suivi',1],['wilaya','Wilaya',1],['commune','Commune',1],['product','Produit',1],['total','Total',1],['trackedBy','Suivi par',1],['confirmedBy','Confirmé par',1],['actions','Actions',1],['orderNo','Commande N°',0],['address','Adresse',0],['typeL','Type de livraison',0],['qty','Quantité',0],['weight','Poids',0],['deliveryCost','Prix de livraison',1],['discount','Remise',0],['remarks','Remarques',0]]
};
/* sur téléphone, la carte d'une commande montre d'abord ces colonnes ; « Détails » déplie les autres */
const KMAIN = {conf:['orderNo','fullName','phone','status','product','wilaya','total','actions'], track:['fullName','phone','status','tracking','dc','total','actions']};
function kCols(b){
  let saved=null; try{ saved=JSON.parse(localStorage.getItem('pk_cols_'+b)); }catch(e){}
  if(!Array.isArray(saved)) saved = ((SETTINGS.kando||{}).cols||{})[b];
  const base = KCOLS[b].map(([key,,def])=>({key, visible:!!def}));
  if(!Array.isArray(saved)) return base;
  const known = new Set(base.map(c=>c.key));
  const out = saved.filter(c=>c && (known.has(c.key) || String(c.key).startsWith('custom_'))).map(c=>({key:c.key, visible:!!c.visible, label:c.label||undefined}));
  base.forEach(c=>{ if(!out.some(x=>x.key===c.key)) out.push(c); });
  return out;
}
function kSetCols(b, cols){ try{ localStorage.setItem('pk_cols_'+b, JSON.stringify(cols)); }catch(e){} }
function kColLabel(b, c){ return c.label || t((KCOLS[b].find(x=>x[0]===c.key)||[0,c.key])[1]); }
function kColPanel(b){
  const cols=kCols(b), m=kManage();
  return `<div class="kpop kcolpanel">${cols.map((c,i)=>`<div class="kcolrow"><input type="checkbox" ${c.visible?'checked':''} data-ch="kColVis" data-b="${b}" data-k="${esc(c.key)}" aria-label="${esc(kColLabel(b,c))}"><input class="kcolname" ${m?'':'readonly'} value="${esc(kColLabel(b,c))}" data-ch="kColName" data-b="${b}" data-k="${esc(c.key)}"><button class="kico" data-a="kColMove" data-b="${b}" data-k="${esc(c.key)}" data-v="-1" ${i===0?'disabled':''} title="${t('Monter')}" aria-label="${t('Monter')}">${ic('arrowU','sm')}</button><button class="kico" data-a="kColMove" data-b="${b}" data-k="${esc(c.key)}" data-v="1" ${i===cols.length-1?'disabled':''} title="${t('Descendre')}" aria-label="${t('Descendre')}">${ic('arrowD','sm')}</button>${m && c.key.startsWith('custom_')? `<button class="kico red" data-a="kColDel" data-b="${b}" data-k="${esc(c.key)}" title="${t('Supprimer')}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button>`:''}</div>`).join('')}
    ${m? `<div class="row" style="gap:4px;border-top:1px solid var(--line2);padding-top:8px;margin-top:6px"><input class="input" style="height:32px" id="kNewCol" placeholder="${t('Nom de la colonne')}"><button class="btn sm green" data-a="kColAdd" data-b="${b}">${ic('plus','sm')} ${t('Ajouter une colonne')}</button></div><button class="btn green block" style="margin-top:8px" data-a="kColSave" data-b="${b}">${t('Enregistrer')}</button>`:''}</div>`;
}
CH.kColVis = el=>{ const b=el.dataset.b, c=kCols(b); const x=c.find(y=>y.key===el.dataset.k); if(x) x.visible=el.checked; kSetCols(b,c); render(); };
CH.kColName = el=>{ const b=el.dataset.b, c=kCols(b); const x=c.find(y=>y.key===el.dataset.k); if(x) x.label=el.value.trim()||undefined; kSetCols(b,c); render(); };
A.kColMove = el=>{ const b=el.dataset.b, c=kCols(b), i=c.findIndex(y=>y.key===el.dataset.k), j=i+(+el.dataset.v); if(j<0||j>=c.length) return; [c[i],c[j]]=[c[j],c[i]]; kSetCols(b,c); render(); };
A.kColDel = el=>{ const b=el.dataset.b; kSetCols(b, kCols(b).filter(y=>y.key!==el.dataset.k)); render(); };
A.kColAdd = el=>{ const name=val('kNewCol').trim(); if(!name) return; const b=el.dataset.b; const c=kCols(b); c.push({key:'custom_'+uid(), visible:true, label:name}); kSetCols(b,c); render(); };
A.kColSave = el=>{ const b=el.dataset.b; SETTINGS.kando = SETTINGS.kando||{}; SETTINGS.kando.cols = {...(SETTINGS.kando.cols||{}), [b]:kCols(b)}; kU(b).pop=''; toast(t('Colonnes enregistrées pour toute l\'équipe'),'ok'); render(); };

/* ---------- menus ancrés (statut, finance, notes, « … ») ---------- */
let KM = null;
function kMenuItems(o){
  const kind=KM.kind, pill=(a, v, label, color, extra)=>`<div class="kmrow"><button role="menuitem" class="kmpill" style="${kPillStyle(color)}" data-a="${a}" data-v="${esc(v)}">${esc(t(label))}</button>${extra||''}</div>`;
  const noteBtn=(v,color)=>`<button class="kmnote" style="${kPillStyle(color)}" data-a="kNoteFor" data-v="${esc(v)}" title="${t('Note')}" aria-label="${t('Note')}">${ic('note','sm')}</button>`;
  const manage=k=> kManage()? `<button class="kmmanage" data-a="kManage" data-v="${k}">${ic('gear','sm')} ${t(k==='notes'?'Gérer les notes':'Gérer les statuts')}</button>`:'';
  const noteBox = KM.noteFor? `<div class="kmnotebox"><p>${t('Note pour le statut')} : <b>${esc(t(KM.noteLabel||''))}</b></p><textarea id="kmNote" rows="2">${esc(KM.noteText||'')}</textarea><div class="row" style="justify-content:flex-end;gap:4px"><button class="btn sm" data-a="kNoteCancel">${t('Annuler')}</button><button class="btn sm green" data-a="kNoteSave">${t('Enregistrer')}</button></div></div>` : '';
  if(kind==='conf') return noteBox + kList('conf').map(d=>pill('kPick', d.id, d.label, d.color, noteBtn(d.id, d.color))).join('') + manage('conf');
  if(kind==='fin') return kList('fin').map(d=>pill('kPick', d.id, d.label, d.color)).join('') + manage('fin');
  if(kind==='tnote') return kList('notes').map(d=>pill('kPick', d.id, d.label, d.color)).join('') + `<div class="kmrow"><button class="kmpill" style="${kPillStyle('#E3E6EB')}" data-a="kPick" data-v="">${t('Aucune note')}</button></div>` + manage('notes');
  if(kind==='man') return noteBox + kList('man').map(d=>pill('kPick', d.id, d.label, d.color, noteBtn(d.id, d.color))).join('') + manage('man');
  if(kind==='ship') return kShipNext(o).map(st=>pill('kPick', st, K_STEP[st][0], K_STEP[st][1])).join('') || `<div class="small muted" style="padding:8px">${t('Aucun changement possible')}</div>`;
  if(kind==='fail') return FAIL_REASONS.map(f=>pill('kPick', f.id, f.fr, '#E8A33D')).join('');
  if(kind==='more') return `<button class="kmitem" data-a="kPick" data-v="detail">${ic('eye','sm')} ${t('Voir le détail')}</button><button class="kmitem" data-a="kPick" data-v="call">${ic('headset','sm')} ${t('Fiche d\'appel')}</button><button class="kmitem" data-a="kPick" data-v="dup">${ic('copy','sm')} ${t('Dupliquer la commande')}</button>`;
  return '';
}
function drawKMenu(){
  let m=document.getElementById('kmenu'); if(!m){ m=document.createElement('div'); m.id='kmenu'; document.body.appendChild(m); }
  if(!KM){ m.innerHTML=''; return; }
  const o = ORDERS.find(x=>x.id===KM.id) || {};
  m.innerHTML = `<div class="kmenu" role="menu" style="left:${KM.x}px;top:${KM.y}px;width:${KM.kind==='more'?200:230}px">${kMenuItems(o)}</div>`;
  const box=m.firstChild, r=box.getBoundingClientRect();
  if(r.bottom>innerHeight-8) box.style.top=Math.max(8, KM.top-r.height-4)+'px';
  if(r.right>innerWidth-8) box.style.left=Math.max(8, innerWidth-r.width-8)+'px';
  const f = box.querySelector('textarea') || box.querySelector('button'); if(f) f.focus({preventScroll:true});
}
function kOpenMenu(el, kind, id){ const r=el.getBoundingClientRect(); KM={kind, id:+id, x:r.left, y:r.bottom+4, top:r.top}; drawKMenu(); }
document.addEventListener('click', e=>{ if(KM && !e.target.closest('#kmenu') && !e.target.closest('[data-a=kMenu]')){ KM=null; drawKMenu(); } }, true);
document.addEventListener('keydown', e=>{ if(KM && e.key==='Escape'){ KM=null; drawKMenu(); } });
window.addEventListener('scroll', e=>{ if(KM && !(e.target.closest && e.target.closest('#kmenu'))){ KM=null; drawKMenu(); } }, true);
A.kMenu = el=>{ const same = KM && KM.id===+el.dataset.id && KM.kind===el.dataset.k; if(same){ KM=null; drawKMenu(); return; } kOpenMenu(el, el.dataset.k, el.dataset.id); };
A.kNoteFor = el=>{ const o=ORDERS.find(x=>x.id===KM.id); const L=kList(KM.kind==='man'?'man':'conf'); const d=L.find(x=>x.id===el.dataset.v); KM.noteFor=el.dataset.v; KM.noteLabel=d? d.label:''; KM.noteText = o && o.statusNote || ''; drawKMenu(); };
A.kNoteCancel = ()=>{ KM.noteFor=null; drawKMenu(); };
A.kNoteSave = ()=>{ const o=ORDERS.find(x=>x.id===KM.id), v=KM.noteFor, kind=KM.kind, text=(document.getElementById('kmNote')||{}).value||''; KM=null; drawKMenu(); if(!o) return; if(kind==='man') kManApply(o, v, text.trim()); else kConfApply(o, v, text.trim()); };
A.kPick = el=>{
  const o=ORDERS.find(x=>x.id===KM.id), kind=KM.kind, v=el.dataset.v; KM=null; drawKMenu(); if(!o) return;
  if(kind==='conf') kConfApply(o, v);
  else if(kind==='fin'){ o.financeStatus=v; render(); }
  else if(kind==='tnote'){ o.trackNote=v; render(); }
  else if(kind==='man') kManApply(o, v);
  else if(kind==='ship') kShipTo(o, v);
  else if(kind==='fail') kFail(o, v);
  else if(kind==='more'){ if(v==='detail') kDetail(o); else if(v==='call') A.kCall({dataset:{id:o.id}}); else kDuplicate(o); }
};

/* ---------- gestionnaire de statuts (ajouter / renommer / couleur / supprimer) ---------- */
A.kManage = el=>{ KM=null; drawKMenu(); if(!kManage()) return; S.ui.km = {list:el.dataset.v, items:clone(kList(el.dataset.v))}; kManageDraw(); };
function kManageDraw(){
  const m=S.ui.km, kinds = m.list==='conf'? ['pending','fail','callback','confirm','cancel'] : m.list==='man'? ['sent','outfor','failed','delivered','returning','returned'] : null;
  const title = t(m.list==='notes'? 'Gérer les notes' : 'Gérer les statuts') + (m.list==='fin'? ' · '+t('Finance') : m.list==='man'? ' · '+t('Livreur') : '');
  S.modal = {html: modalTpl(title, `<div class="col" style="gap:8px">${m.items.map((s,i)=>`<div class="kmanrow"><input type="color" value="${esc(s.color)}" data-km="${i}" data-f="color" aria-label="${t('Couleur')}"><input class="input" value="${esc(t(s.label))}" data-km="${i}" data-f="label" aria-label="${t('Nom')}">${kinds? `<select class="select" data-km="${i}" data-f="kind" aria-label="${t('Effet')}">${kinds.map(k=>`<option value="${k}" ${s.kind===k?'selected':''}>${t(KIND_LABEL[k])}</option>`).join('')}</select>${s.kind==='fail'? `<input class="input num" type="number" min="1" max="9" style="width:58px" value="${s.n||1}" data-km="${i}" data-f="n" aria-label="${t('Numéro d\'échec')}">`:''}`:''}<button class="kico red" data-a="kManDel" data-v="${i}" ${m.items.length<=1?'disabled':''} aria-label="${t('Supprimer')}">${ic('trash','sm')}</button></div>`).join('')}
      <button class="btn block kdash" data-a="kManAdd">${ic('plus','sm')} ${t(m.list==='notes'?'Ajouter une note':'Ajouter un statut')}</button>
      ${kinds? `<p class="xs muted" style="margin:0">${t('« Effet » : ce que fait le statut dans l\'ERP (file de rappel, confirmation, annulation, étape du colis).')}</p>`:''}</div>`,
    `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn green" data-a="kManSave">${t('Enregistrer')}</button>`)};
  renderOverlay();
}
document.addEventListener('input', e=>{ const el=e.target.closest('input[data-km]'); if(!el || !S.ui.km) return; const it=S.ui.km.items[+el.dataset.km]; it[el.dataset.f] = el.dataset.f==='n'? (+el.value||1) : el.value; });
document.addEventListener('change', e=>{ const el=e.target.closest('select[data-km]'); if(!el || !S.ui.km) return; S.ui.km.items[+el.dataset.km].kind=el.value; kManageDraw(); });
A.kManAdd = ()=>{ const m=S.ui.km; m.items.push({id:'c_'+uid(), label:'', color:KC.NAVY, ...(m.list==='conf'?{kind:'pending'}: m.list==='man'?{kind:'outfor'}:{})}); kManageDraw(); };
A.kManDel = el=>{ S.ui.km.items.splice(+el.dataset.v,1); kManageDraw(); };
A.kManSave = ()=>{
  const m=S.ui.km, items=m.items.filter(s=>(s.label||'').trim()).map(s=>({...s, label:s.label.trim()}));
  if(m.list==='conf'){ const miss=['pending','fail','callback','confirm','cancel'].filter(k=>!items.some(s=>s.kind===k)); if(miss.length){ toast(t('Gardez au moins un statut pour')+' : '+miss.map(k=>t(KIND_LABEL[k])).join(', '),'bad'); return; } }
  if(!items.length){ toast(t('Gardez au moins un statut'),'bad'); return; }
  SETTINGS.kando = SETTINGS.kando||{}; SETTINGS.kando[m.list] = items; S.ui.km=null; closeModal(); toast(t('Statuts enregistrés'),'ok'); render();
};

/* ---------- petites cellules communes ---------- */
function kRisk(o){ const cs=custStats(o.customerId); return {d:cs.delivered, r:cs.returned, risk: (cs.delivered+cs.returned)? Math.round(cs.returned/(cs.delivered+cs.returned)*100) : 0}; }
const riskColor = r => r<30? '#2FBF4A' : r<60? '#FFA447' : '#E23024';
function kVerify(o){ const s=kRisk(o); return `<button class="kverify" style="border-color:${riskColor(s.risk)}" data-a="kClient" data-id="${o.id}" title="${t('Fiche client')} — ${t('Ratio de risque')} ${s.risk}%" dir="ltr"><span class="g">${ic('pkg','sm')}${s.d}</span><span class="r">${ic('undo','sm')}${s.r}</span></button>`; }
function kPhone(o){
  const c=CBY[o.customerId]; if(!c) return '—'; const mine = S.role!=='agent' || o.agentId===S.agentId;
  if(!mine) return `<span class="masked num" dir="ltr">${maskPhone(c.phone)}</span>`;
  const d=c.phone.replace(/\s/g,'');
  return `<div class="kphone" dir="ltr"><div class="row" style="gap:6px;flex-wrap:nowrap"><a class="kwa" href="https://wa.me/213${d.slice(1)}" target="_blank" rel="noopener" aria-label="WhatsApp">${ic('wa','sm')}</a><a href="tel:${d}" data-a="logCall" data-id="${o.id}">${esc(c.phone)}</a><button class="kplus" data-a="kPhone2" data-id="${o.id}" title="${t('Ajouter téléphone 2')}" aria-label="${t('Ajouter téléphone 2')}">+</button></div>${S.ui.kp2===o.id? `<input class="kp2" id="kp2" value="${esc(c.phone2||'')}" placeholder="${t('Téléphone 2')}" data-ch="kPhone2Save" data-id="${o.id}">` : c.phone2? `<a class="xs" href="tel:${c.phone2.replace(/\s/g,'')}" style="color:#1F8A3B">${esc(c.phone2)}</a>`:''}</div>`;
}
A.kPhone2 = el=>{ S.ui.kp2 = S.ui.kp2===+el.dataset.id? null : +el.dataset.id; render(); setTimeout(()=>{ const i=document.getElementById('kp2'); if(i) i.focus(); },0); };
CH.kPhone2Save = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id), c=o && CBY[o.customerId]; if(c){ const v=el.value.replace(/\D/g,''); if(!v) c.phone2=''; else if(validPhone(v)) c.phone2=fmtPhone(v); else toast(t('Numéro invalide : 05, 06 ou 07 suivi de 8 chiffres'),'bad'); } S.ui.kp2=null; render(); };
const PLAT = {facebook:['Facebook','#1877F2','globe'], instagram:['Instagram','#E1306C','globe'], tiktok:['TikTok','#111111','globe'], whatsapp:['WhatsApp','#25D366','wa'], messenger:['Messenger','#0084FF','msg'], google:['Google','#4285F4','globe'], snapchat:['Snapchat','#C9A800','globe']};
function platformOf(o){ return o.platform || {WhatsApp:'whatsapp', Messenger:'messenger', Instagram:'instagram'}[o.source] || ''; }
const sourceKey = o => o.source==='Site'? 'Site' : 'Manuel';
const sourceMeta = o => o.source==='Site'? ['Boutique PackLik','#FD6400','store'] : ['Manuel','#6B7280','tag'];
const storeOf = o => o.store || 'PackLik';
const agentName = id => (UBY[id]||{}).name || '';
function kBadge(color, icon, label){ return `<span class="kbadge" style="background:${color}1A;color:${color}">${ic(icon,'sm')} ${esc(t(label))}</span>`; }
function kStatusPill(o, kind, can){
  const d = kind==='man'? manDef(o) : kind==='conf'? confDef(o) : {label:kLabel(o), color:kColor(o)};
  const note = o.statusNote? `<button class="kpill sm" style="${kPillStyle(d.color)};max-width:12rem" data-a="${can?'kMenu':'kNoop'}" data-k="${kind}" data-id="${o.id}" title="${esc(o.statusNote)}"><span class="trunc">${esc(o.statusNote)}</span></button>` : '';
  return `<span class="kstatus">${note}${can? `<button class="kpill" style="${kPillStyle(d.color)}" data-a="kMenu" data-k="${kind}" data-id="${o.id}" aria-haspopup="menu">${esc(t(d.label))} ${ic('chevD','sm')}</button>` : `<span class="kpill" style="${kPillStyle(d.color)}">${esc(t(d.label))}</span>`}</span>`;
}
A.kNoop = ()=>{};
function kFinPill(o, can){ const d=finDef(o); return can? `<button class="kpill" style="${kPillStyle(d.color)}" data-a="kMenu" data-k="fin" data-id="${o.id}">${esc(t(d.label))} ${ic('chevD','sm')}</button>` : `<span class="kpill" style="${kPillStyle(d.color)}">${esc(t(d.label))}</span>`; }
function kProduct(o){ const it=o.items[0], p=it && PBY[it.pid]; return `<span class="row" style="gap:4px;flex-wrap:nowrap"><span class="kprod">${esc(p? p.name : '—')}</span>${p? `<span class="kbadge" style="background:#FD64001A;color:var(--kraft-d)" title="${t('Lié')} : ${esc(p.name)} · ${t('Stock')} ${stockInfo(p.id).available}">${ic('pkg','sm')} ${t('Lié')}</span>`:''}${o.items.length>1? `<span class="xs muted">+${o.items.length-1}</span>`:''}</span>`; }
function kDiscount(o){ return o.discountType==='amount'? dzd(+o.discount||0) : (+o.discount||0)+' %'; }
function kCarrierSelect(o, edit){ const cr=carrierOf(o); if(!edit) return `<span class="row" style="gap:6px;flex-wrap:nowrap">${cr.id? carrierLogo(cr,20):''}<span>${esc(kCarrierName(cr))}</span></span>`; return `<select class="kcell" data-ch="kRowCarrier" data-id="${o.id}" aria-label="${t('Société de livraison')}"><option value="">— ${t('Choisir')} —</option>${CARRIERS.filter(c=>c.connected||c.id===o.carrier).map(c=>`<option value="${esc(c.id)}" ${c.id===o.carrier?'selected':''}>${esc(kCarrierName(c))}</option>`).join('')}</select>`; }
CH.kRowCarrier = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); o.carrier=el.value; o.parcels=null; if(!(CRB[el.value]||{}).internal) o.courierId=null; hist(o, 'Société de livraison', el.value? CRB[el.value].name : '—'); render(); };
CH.kRow = el=>{
  const o=ORDERS.find(x=>x.id===+el.dataset.id); if(!o) return; const f=el.dataset.f, v=el.value;
  if(f==='wilaya'){ o.wilaya=+v; o.commune=''; o.parcels=null; if(!o.carrier) o.carrier=autoCarrier(o); hist(o,'Wilaya modifiée', wName(o.wilaya)); }
  else if(f==='commune') o.commune=v;
  else if(f==='delivery'){ o.delivery=v; hist(o,'Type de livraison', v==='home'?'Domicile':'Bureau'); }
  else if(f==='agent') reassign(o, +v||null, 'Choix manuel');
  else if(f==='tracker') o.trackerId = +v||null;
  else if(f==='tracking'){ o.tracking=v.trim(); hist(o,'Numéro de suivi saisi', o.tracking,'blue'); }
  else if(f==='custom'){ o.custom = {...(o.custom||{}), [el.dataset.k]:v}; }
  render();
};
CH.kStock = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); o.dcStock=el.checked; };

/* ---------- cellules du tableau « à confirmer » ---------- */
function kConfCell(o, c){
  const key=c.key, edit = kCanConf(o) && PRE_ST.includes(o.status) && o.status!=='calling', ops=S.role!=='agent';
  if(key.startsWith('custom_')) return `<input class="kcell" style="width:7rem" value="${esc((o.custom||{})[key]||'')}" data-ch="kRow" data-f="custom" data-k="${esc(key)}" data-id="${o.id}" aria-label="${esc(kColLabel('conf',c))}">`;
  switch(key){
    case 'source': { const m=sourceMeta(o), pk=platformOf(o); return `<div class="col" style="gap:2px;align-items:flex-start"><button class="kbadge btnlike" style="background:${m[1]}1A;color:${m[1]}" data-a="kSource" data-id="${o.id}">${ic(m[2],'sm')} ${esc(t(m[0]))}</button>${pk && o.source==='Site' && PLAT[pk]? `<span class="kbadge xs" style="background:${PLAT[pk][1]}14;color:${PLAT[pk][1]}">${esc(PLAT[pk][0])}</span>`:''}</div>`; }
    case 'platform': { const pk=platformOf(o); return pk && PLAT[pk]? kBadge(PLAT[pk][1], PLAT[pk][2], PLAT[pk][0]) : '<span class="muted">—</span>'; }
    case 'origin': return o.original? `<button class="kico gold" data-a="kOrigin" data-id="${o.id}" title="${t('Commande d\'origine (avant modification)')}" aria-label="${t('Commande d\'origine')}">${ic('history','sm')}</button>` : '<span class="muted">—</span>';
    case 'orderNo': return `<b class="num">${esc(o.ref)}</b>${o.fresh?` <span class="badge green">${t('nouveau')}</span>`:''}`;
    case 'date': { const d=new Date(o.created); return `<span class="num muted">${isoDay(o.created)} <span class="xs">${pad(d.getHours())}:${pad(d.getMinutes())}</span></span>`; }
    case 'store': return `<span class="muted">${esc(storeOf(o))}</span>`;
    case 'fullName': return `<button class="kname" data-a="kCall" data-id="${o.id}" title="${t('Fiche d\'appel')}">${esc((CBY[o.customerId]||{}).name||'—')}</button>${o.duplicate? ` <span class="kbadge" style="background:#E230241A;color:#E23024">${ic('copy','sm')} ${t('Doublon probable')}</span>`:''}`;
    case 'phone': return kPhone(o);
    case 'verify': return kVerify(o);
    case 'status': return kStatusPill(o, 'conf', kCanConf(o) && o.status!=='calling') + (o.status==='calling'&&o.lockedBy? `<div class="xs muted">${ic('lock','sm')} ${esc(agentName(o.lockedBy).split(' ')[0])}</div>`:'') + (o.nextCall && ['unreach','callback'].includes(o.status)? (()=>{ const cd=countdown(o.nextCall); return `<div class="xs"><span class="countdown ${cd.cls}">${cd.txt}</span></div>`; })() : '');
    case 'confirmedBy': return ops && S.role!=='gerant'? `<select class="kcell" data-ch="kRow" data-f="agent" data-id="${o.id}" aria-label="${t('Confirmé par')}"><option value="">—</option>${AGENTS.map(a=>`<option value="${a.id}" ${a.id===o.agentId?'selected':''}>${esc(a.name)}</option>`).join('')}</select>` : `<span>${esc(agentName(o.agentId)||'—')}</span>`;
    case 'address': return `<span class="trunc muted" style="max-width:12rem" title="${esc(o.address)}">${esc(o.address||'—')}</span>`;
    case 'dc': return kCarrierSelect(o, edit);
    case 'dcAction': return `<label class="row xs" style="gap:5px" title="${t('Avec stock : la référence du produit doit exister chez la société de livraison.')}"><input type="checkbox" ${o.dcStock?'checked':''} data-ch="kStock" data-id="${o.id}" ${edit?'':'disabled'}> ${t('Stock')}</label>`;
    case 'typeL': return edit? `<select class="kcell" data-ch="kRow" data-f="delivery" data-id="${o.id}" aria-label="${t('Type de livraison')}"><option value="home" ${o.delivery==='home'?'selected':''}>${t('Domicile')}</option><option value="desk" ${o.delivery==='desk'?'selected':''}>${t('Bureau')}</option></select>` : t(o.delivery==='home'?'Domicile':'Bureau');
    case 'wilaya': return edit? `<select class="kcell" data-ch="kRow" data-f="wilaya" data-id="${o.id}" aria-label="${t('Wilaya')}">${WILAYAS.filter(w=>w.active||w.id===o.wilaya).map(w=>`<option value="${w.id}" ${w.id===o.wilaya?'selected':''}>${w.code} - ${esc(wName(w.id))}</option>`).join('')}</select>` : esc(wName(o.wilaya));
    case 'commune': return edit? `<select class="kcell" data-ch="kRow" data-f="commune" data-id="${o.id}" aria-label="${t('Commune')}">${communeOptions(o.wilaya, o.commune)}</select>` : esc(cName(o.commune)||'—');
    case 'product': return kProduct(o);
    case 'sku': return `<span class="num muted" dir="ltr">${o.items.map(i=>(PBY[i.pid]||{}).sku).filter(Boolean).join(', ')||'—'}</span>`;
    case 'variants': return `<span class="muted">${o.items.map(i=>i.v && PBY[i.pid] && PBY[i.pid].variants? (PBY[i.pid].variants.find(v=>v.id===i.v)||{}).label : '').filter(Boolean).join(', ')||'—'}</span>`;
    case 'qty': return `<span class="num">${o.items.reduce((s,i)=>s+i.q,0)}</span>`;
    case 'productPrice': return `<span class="num">${dzd((o.items[0]||{}).price||0)}</span>`;
    case 'deliveryCost': return `<span class="num">${o.freeShip? t('Gratuite') : dzd(feeOf(o))}</span>`;
    case 'discount': return `<span class="num">${kDiscount(o)}</span>`;
    case 'weight': return `<span class="num">${kg(orderWeight(o))}</span>`;
    case 'exchange': return `<span class="xs">${o.exchange? esc(o.returnedProduct||'✓') : '—'}</span>`;
    case 'total': return `<b class="num" style="color:var(--kraft-d)">${dzd(orderTotal(o))}</b>`;
    case 'finance': return kFinPill(o, ops);
    case 'costMeta': { if(!seesCost()) return '—'; const f=finOf(o); return `<b class="num" style="color:var(--kraft-d)">${dzd(f.total-f.net)}</b>`; }
    case 'remarks': return `<span class="trunc xs muted" style="max-width:10rem" title="${esc(o.note||'')}">${esc(o.note||'—')}</span>`;
    case 'otherCols': return `<span class="trunc xs muted" style="max-width:12rem">${t('Source')}: ${esc(o.source)} | Qty: ${o.items.reduce((s,i)=>s+i.q,0)}</span>`;
    case 'actions': return `<div class="kacts">
      ${kCanShip()? `<button class="kico ${o.tracking||SHIP_ST.includes(o.status)?'sent':'green'}" data-a="kSend" data-id="${o.id}" title="${t('Envoyer à la société de livraison')}" aria-label="${t('Envoyer à la société de livraison')}">${ic('truck','sm')}</button><button class="kico green ${o.courierId?'sent':''}" data-a="kToMan" data-id="${o.id}" title="${t('Envoyer à un livreur')}" aria-label="${t('Envoyer à un livreur')}">${ic('userR','sm')}</button>`:''}
      ${kCanConf(o)? `<button class="kico" data-a="kEdit" data-id="${o.id}" title="${t('Modifier')}" aria-label="${t('Modifier')}">${ic('edit','sm')}</button>`:''}
      <button class="kico" data-a="kShare" data-id="${o.id}" title="${t('Partager')}" aria-label="${t('Partager')}">${ic('share','sm')}</button>
      <button class="kico" data-a="kTimeline" data-id="${o.id}" title="${t('Suivi de la commande')}" aria-label="${t('Suivi de la commande')}">${ic('clock','sm')}</button>
      <button class="kico" data-a="kMenu" data-k="more" data-id="${o.id}" title="${t('Plus')}" aria-label="${t('Plus')}">${ic('more','sm')}</button>
      ${kCanDelete()? `<button class="kico red" data-a="kDel" data-id="${o.id}" title="${t('Supprimer')}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button>`:''}</div>`;
  }
  return '';
}

/* ---------- filtres de date (Aujourd'hui · Hier · Semaine · Mois · Tous + jour précis) ---------- */
function kInDate(ts, f, day){
  if(day){ const d=new Date(day+'T00:00').getTime(); return ts>=d && ts<d+DAY; }
  const today=dayStart(Date.now());
  if(f==='today') return ts>=today; if(f==='yesterday') return ts>=today-DAY && ts<today;
  if(f==='week') return ts>=today-6*DAY; if(f==='month') return ts>=today-29*DAY; return true;
}
function kDateBar(u, b){ return `<div class="kseg">${[['today','Aujourd\'hui'],['yesterday','Hier'],['week','Semaine'],['month','Mois'],['all','Tous']].map(([k,l])=>`<button class="${!u.day&&u.date===k?'on':''}" data-a="kDate" data-b="${b}" data-v="${k}">${t(l)}</button>`).join('')}</div>
  <label class="kiconbtn kday ${u.day?'on':''}" title="${t('Choisir un jour')}">${ic('cal','sm')}${u.day? `<span class="xs num">${u.day}</span><span class="kx2" data-a="kDayClear" data-b="${b}" role="button" aria-label="${t('Effacer')}">${ic('x','sm')}</span>`:''}<input type="date" value="${u.day||''}" data-ch="kDay" data-b="${b}" aria-label="${t('Jour')}"></label>`; }
const kU = b => b==='conf'? S.ui.kc : S.ui.kt;
A.kDate = el=>{ const u=kU(el.dataset.b); u.date=el.dataset.v; u.day=''; u.page=1; u.sel.clear(); render(); };
CH.kDay = el=>{ const u=kU(el.dataset.b); u.day=el.value; u.page=1; render(); };
A.kDayClear = el=>{ const u=kU(el.dataset.b); u.day=''; render(); };
function kPager(b, total, page){
  const n=Math.max(1,Math.ceil(total/50)), from = total? (page-1)*50+1 : 0, to=Math.min(total, page*50);
  return `<div class="kpager"><span class="xs muted">${from} - ${to} ${t('sur')} ${total}</span>${n>1? `<div class="row" style="gap:4px">${Array.from({length:Math.min(n,5)},(_,i)=>i+1).map(p=>`<button class="kpg ${p===page?'on':''}" data-a="kPage" data-b="${b}" data-v="${p}">${p}</button>`).join('')}${page>5? `<button class="kpg on">${page}</button>`:''}<button class="btn sm ghost" data-a="kPage" data-b="${b}" data-v="${n}">${t('Dernier')} ›</button></div>`:''}</div>`;
}
A.kPage = el=>{ kU(el.dataset.b).page=+el.dataset.v; render(); window.scrollTo(0,0); };
A.kPop = el=>{ const u=kU(el.dataset.b); u.pop = u.pop===el.dataset.v? '' : el.dataset.v; render(); };
A.kSheet = el=>{ const u=kU(el.dataset.b); u.sheet=!u.sheet; render(); };
document.addEventListener('click', e=>{ ['kc','kt'].forEach(k=>{ const u=S.ui[k]; if(u && u.pop && !e.target.closest('.kpop') && !e.target.closest('[data-a=kPop]')){ u.pop=''; setTimeout(render,0); } }); }, true);
A.kExp = el=>{ const u=kU(el.dataset.b), id=+el.dataset.id; u.exp.has(id)? u.exp.delete(id) : u.exp.add(id); render(); };

/* ---------- tableau (ordinateur) / cartes (téléphone) ---------- */
function kTable(b, rows, cols, cellFn, u, rowStyle, draftRow){
  const vis=cols.filter(c=>c.visible), all = rows.length>0 && rows.every(o=>u.sel.has(o.id));
  return `<div class="card ktable"><div class="tbl-wrap"><table class="tbl ktbl"><thead><tr><th class="kchk"><input type="checkbox" ${all?'checked':''} ${rows.length?'':'disabled'} data-ch="kAll" data-b="${b}" aria-label="${t('Tout sélectionner')}"></th>${vis.map(c=>`<th>${esc(kColLabel(b,c))}${['status','finance','dc','typeL','wilaya','commune','product'].includes(c.key)? ' '+ic('chevD','sm'):''}</th>`).join('')}</tr></thead><tbody>
    ${draftRow||''}
    ${rows.length? rows.map(o=>`<tr class="${u.exp.has(o.id)?'open':''}" style="${rowStyle(o)}"><td class="kchk"><input type="checkbox" ${u.sel.has(o.id)?'checked':''} data-ch="kSel" data-b="${b}" data-id="${o.id}" aria-label="${esc(o.ref)}"><button class="kexp" data-a="kExp" data-b="${b}" data-id="${o.id}">${t(u.exp.has(o.id)?'Moins':'Détails')} ${ic(u.exp.has(o.id)?'arrowU':'arrowD','sm')}</button></td>${vis.map(c=>`<td data-label="${esc(kColLabel(b,c))}" class="${KMAIN[b].includes(c.key)?'km':'kx'} k-${c.key}">${cellFn(o,c)}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${vis.length+1}" class="kempty">${t(b==='conf'?'Aucune commande':'Aucune commande à suivre')}</td></tr>`}
  </tbody></table></div>${kPager(b, u._total||0, u.page)}</div>`;
}
CH.kSel = el=>{ const u=kU(el.dataset.b), id=+el.dataset.id; el.checked? u.sel.add(id) : u.sel.delete(id); render(); };
CH.kAll = el=>{ const u=kU(el.dataset.b); (u._ids||[]).forEach(id=> el.checked? u.sel.add(id) : u.sel.delete(id)); render(); };

/* ---------- Commandes à confirmer ---------- */
S.ui.kc = {q:'', date:'all', day:'', page:1, sel:new Set(), st:'', noPlat:false, noProd:false, src:'', plat:'', hour:'', store:'', wil:'', agent:'', pop:'', sheet:false, exp:new Set(), row:null};
function kConfBase(){
  const u=S.ui.kc; let l = visibleOrders().filter(o=>PRE_ST.includes(o.status) && kInDate(o.created, u.date, u.day));
  if(u.q){ const q=u.q.toLowerCase(), qd=q.replace(/\s/g,''); l=l.filter(o=>{ const c=CBY[o.customerId]||{}; return o.ref.toLowerCase().includes(q) || (c.name||'').toLowerCase().includes(q) || (c.phone||'').replace(/\s/g,'').includes(qd) || o.items.some(i=>(PBY[i.pid]||{name:''}).name.toLowerCase().includes(q)) || wName(o.wilaya).toLowerCase().includes(q); }); }
  if(u.src) l=l.filter(o=>sourceKey(o)===u.src);
  if(u.plat) l=l.filter(o=>platformOf(o)===u.plat);
  if(u.hour!=='') l=l.filter(o=>new Date(o.created).getHours()===+u.hour);
  if(u.store) l=l.filter(o=>storeOf(o)===u.store);
  if(u.wil) l=l.filter(o=>String(o.wilaya)===u.wil);
  if(u.agent) l=l.filter(o=>String(o.agentId||'')===u.agent);
  return l;
}
viewConfList = function(){
  const u=S.ui.kc, base=kConfBase(), cols=kCols('conf'), canBulk=S.role!=='agent';
  let list = base;
  if(u.st) list=list.filter(o=>confDef(o).id===u.st);
  if(u.noPlat) list=list.filter(o=>!platformOf(o));
  if(u.noProd) list=list.filter(o=>!o.items.length);
  list.sort((a,b)=>b.created-a.created);
  u._total=list.length; u.page=Math.min(u.page, Math.max(1,Math.ceil(list.length/50))); const rows=list.slice((u.page-1)*50, u.page*50); u._ids=rows.map(o=>o.id);
  const counts={}; base.forEach(o=>{ const id=confDef(o).id; counts[id]=(counts[id]||0)+1; });
  const defs = kList('conf').concat(counts._calling? [{id:'_calling', label:'En appel', color:'#6C5CE7'}]:[]);
  const opt = (v,cur,l)=>`<option value="${esc(v)}" ${String(cur)===String(v)?'selected':''}>${esc(l)}</option>`;
  const all = visibleOrders().filter(o=>PRE_ST.includes(o.status));
  const hours=[...new Set(all.map(o=>new Date(o.created).getHours()))].sort((a,b)=>a-b);
  const wils=[...new Set(all.map(o=>o.wilaya))].sort((a,b)=>a-b);
  const plats=[...new Set(all.map(platformOf).filter(Boolean))];
  const selN = u.sel.size, canAssign = canBulk && S.role!=='gerant';
  const bar = `
    <div class="kmbar"><input class="input" placeholder="${t('Rechercher…')}" value="${esc(u.q)}" data-in="kcQ" aria-label="${t('Rechercher')}">${canAssign? `<button class="kbig ghost" data-a="kPop" data-b="conf" data-v="assign" aria-label="${t('Assigner un agent de confirmation')}">${ic('user')}${selN? ' '+selN:''}</button>`:''}<button class="kbig ghost" data-a="kSheet" data-b="conf" aria-label="${t('Filtres')}">${ic('sliders')}</button><button class="kbig" data-a="kForm" aria-label="${t('Nouvelle commande')}">${ic('plus')}</button></div>
    ${u.sheet? `<div class="ksheet-bg" data-a="kSheet" data-b="conf"></div>`:''}
    <div class="ksheet ${u.sheet?'open':''}">
      <div class="ksheet-h"><b>${t('Filtres')}</b><button class="kico" data-a="kSheet" data-b="conf" aria-label="${t('Fermer')}">${ic('x')}</button></div>
      <div class="kcmd">
        <div class="ksearch">${ic('search','sm')}<input class="input" placeholder="${t('Rechercher…')}" value="${esc(u.q)}" data-in="kcQ" aria-label="${t('Rechercher')}"></div>
        ${kDateBar(u,'conf')}
        <div class="kright">
          ${selN? `<span class="kmulti">${t('Multitâche')} ${selN}</span>`:''}
          <div class="kpopwrap"><button class="kiconbtn" data-a="kPop" data-b="conf" data-v="cols" title="${t('Paramètres de colonnes')}" aria-label="${t('Paramètres de colonnes')}">${ic('sliders','sm')}</button>${u.pop==='cols'? kColPanel('conf'):''}</div>
          ${kCanDelete()? `<button class="kiconbtn danger" data-a="kDelSel" data-b="conf" ${selN?'':'disabled'} title="${t('Corbeille')}" aria-label="${t('Supprimer la sélection')}">${ic('trash','sm')}</button><button class="kbtn danger" data-a="kDelAll" data-b="conf" ${list.length?'':'disabled'}>${ic('trash','sm')} ${t('Tout supprimer')}</button><button class="kiconbtn" data-a="kTrash" title="${t('Corbeille')}" aria-label="${t('Corbeille')}" style="position:relative">${ic('archive','sm')}${kTrashList().length? `<span class="kdot">${kTrashList().length}</span>`:''}</button>`:''}
          <button class="kiconbtn" data-a="kReport" data-b="conf" title="${t('Rapport d\'envoi')}" aria-label="${t('Rapport d\'envoi')}">${ic('file','sm')}</button>
          ${kManage()? `<button class="kiconbtn" data-a="kManage" data-v="conf" title="${t('Gérer les statuts')}" aria-label="${t('Gérer les statuts')}">${ic('gear','sm')}</button>`:''}
          <button class="btn primary" data-a="kForm">${ic('plus','sm')} ${t('Nouvelle commande')}</button>
        </div>
      </div>
      <div class="kfilters">
        <select class="kfsel" data-ch="kcF" data-f="src">${opt('',u.src,t('Plateforme')+': '+t('Tous'))}${['Site','Manuel'].map(s=>opt(s,u.src,t(s==='Site'?'Boutique PackLik':'Manuel'))).join('')}</select>
        <select class="kfsel" data-ch="kcF" data-f="plat">${opt('',u.plat,t('Source')+': '+t('Tous'))}${plats.map(p=>opt(p,u.plat,PLAT[p]?PLAT[p][0]:p)).join('')}</select>
        <select class="kfsel" data-ch="kcF" data-f="hour">${opt('',u.hour,t('Heure')+': '+t('Tous'))}${hours.map(h=>opt(h,u.hour,pad(h)+':00')).join('')}</select>
        <select class="kfsel" data-ch="kcF" data-f="store">${opt('',u.store,t('Nom boutique')+': '+t('Tous'))}${opt('PackLik',u.store,'PackLik')}</select>
        <select class="kfsel" data-ch="kcF" data-f="wil">${opt('',u.wil,t('Wilaya')+': '+t('Tous'))}${wils.map(w=>opt(w,u.wil,(WBY[w]||{code:w}).code+' - '+wName(w))).join('')}</select>
        ${S.role!=='agent'? `<select class="kfsel" data-ch="kcF" data-f="agent">${opt('',u.agent,t('Confirmé par')+': '+t('Tous'))}${AGENTS.map(a=>opt(a.id,u.agent,a.name)).join('')}</select>`:''}
        ${u.src||u.plat||u.hour!==''||u.store||u.wil||u.agent? `<button class="kbtn" data-a="kcReset">${ic('x','sm')} ${t('Réinitialiser')}</button>`:''}
        <div class="kright">
          ${canAssign? `<div class="kpopwrap"><button class="kbtn brand" data-a="kPop" data-b="conf" data-v="assign">${ic('user','sm')} ${t('Assigner un agent de confirmation')}${selN?` (${selN})`:''}</button>${u.pop==='assign'? kAssignPop('conf', selN):''}</div>`:''}
          ${kCanShip()? `<button class="kbtn brand" data-a="kSendSel">${ic('truck','sm')} ${t('Envoyer à la société de livraison')}${selN?` (${selN})`:''}</button>`:''}
        </div>
      </div>
    </div>
    <div class="kchips">
      <button class="kchip ${!u.st&&!u.noPlat&&!u.noProd?'on':''}" data-a="kcChip" data-v="">${t('Tous')} <b>${base.length}</b></button>
      ${defs.map(d=>`<button class="kchip ${u.st===d.id?'on':''}" data-a="kcChip" data-v="${esc(d.id)}"><span class="dot" style="background:${d.color}"></span>${esc(t(d.label))} <b>${counts[d.id]||0}</b></button>`).join('')}
      <button class="kchip ${u.noPlat?'on':''}" data-a="kcChip" data-v="_noplat"><span class="dot" style="background:#667080"></span>${t('Sans source')} <b>${base.filter(o=>!platformOf(o)).length}</b></button>
      <button class="kchip ${u.noProd?'on':''}" data-a="kcChip" data-v="_noprod"><span class="dot" style="background:#667080"></span>${t('Aucun produit')} <b>${base.filter(o=>!o.items.length).length}</b></button>
    </div>`;
  const table = kTable('conf', rows, cols, kConfCell, u, o=>{ const c=kColor(o); return `background:${c}1F;border-inline-start:3px solid ${c}`; }, kRowDraft(cols));
  return erpShell('confirmer', t('Commandes à confirmer'), '', `<div class="kboard">${bar}${table}</div>`);
};
function kAssignPop(b, selN){ return `<div class="kpop" style="width:260px;padding:12px"><b class="xs">${t('Assigner un agent de confirmation')}</b>${selN? `<select class="select" id="kAssignSel" style="margin-top:8px"><option value="">—</option>${AGENTS.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join('')}<option value="0">${t('File commune')}</option></select><div class="row" style="gap:6px;margin-top:8px"><button class="btn sm grow" data-a="kPop" data-b="${b}" data-v="assign">${t('Annuler')}</button><button class="btn sm green grow" data-a="kAssign" data-b="${b}">${t('Enregistrer')}</button></div>` : `<p class="small muted" style="margin:8px 0 0">${t('Sélectionnez d\'abord des commandes')}</p>`}</div>`; }
['admin','manager','agent'].forEach(r=>ERP_VIEWS[r].confirmer = ()=>viewConfList());
if(!MENUS.agent[0][1].some(x=>x[0]==='confirmer')) MENUS.agent[0][1].splice(1, 0, ['confirmer','headset','Commandes à confirmer','mine']);
IN.kcQ = el=>{ S.ui.kc.q=el.value; S.ui.kc.page=1; render(); };
CH.kcF = el=>{ S.ui.kc[el.dataset.f]=el.value; S.ui.kc.page=1; render(); };
A.kcReset = ()=>{ Object.assign(S.ui.kc, {src:'', plat:'', hour:'', store:'', wil:'', agent:'', page:1}); render(); };
A.kcChip = el=>{ const u=S.ui.kc, v=el.dataset.v; if(v==='_noplat') u.noPlat=!u.noPlat; else if(v==='_noprod') u.noProd=!u.noProd; else { u.st = u.st===v? '' : v; if(!v){ u.noPlat=false; u.noProd=false; } } u.page=1; render(); };
A.kAssign = el=>{ const u=kU(el.dataset.b), v=val('kAssignSel'); if(v===''){ toast(t('Choisissez un agent'),'bad'); return; } u.sel.forEach(id=>{ const o=ORDERS.find(x=>x.id===id); if(o) reassign(o, +v||null, 'Action en masse'); }); toast(u.sel.size+' '+t('commande(s) réassignée(s)'),'ok'); u.sel.clear(); u.pop=''; render(); };
A.kCall = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); if(!o) return; if(S.role==='agent' && o.agentId!==S.agentId){ toast(t('Commande d\'un autre agent'),'bad'); return; } S.modal=null; S.drawer={id:o.id, tab:'call', addQ:''}; lockOrder(o); render(); };
A.openOrder = A.kCall;

/* ---------- export CSV (« Rapport d'envoi ») ---------- */
A.kReport = el=>{
  const b=el.dataset.b, cols=kCols(b).filter(c=>c.visible && !['actions','verify','origin'].includes(c.key));
  const list = b==='conf'? kConfBase() : kTrackBase();
  const txt = (o,k)=>{ const c=CBY[o.customerId]||{}; switch(k){ case 'orderNo': return o.ref; case 'date': return fDT(o.created); case 'sentAt': return o.times.sent? fDT(o.times.sent):''; case 'fullName': return c.name; case 'phone': return c.phone; case 'status': return kLabel(o); case 'finance': return t(finDef(o).label); case 'confirmedBy': return agentName(o.agentId); case 'trackedBy': return agentName(o.trackerId); case 'address': return o.address; case 'dc': return kCarrierName(carrierOf(o)); case 'typeL': return o.delivery==='home'?'Domicile':'Bureau'; case 'wilaya': return wName(o.wilaya); case 'commune': return o.commune; case 'product': return o.items.map(i=>i.q+'x '+(PBY[i.pid]||{}).name).join(' | '); case 'sku': return o.items.map(i=>(PBY[i.pid]||{}).sku).join(', '); case 'qty': return o.items.reduce((s,i)=>s+i.q,0); case 'productPrice': return (o.items[0]||{}).price; case 'deliveryCost': return feeOf(o); case 'discount': return kDiscount(o); case 'weight': return orderWeight(o); case 'total': return orderTotal(o); case 'remarks': return o.note; case 'tracking': return o.tracking; case 'trackNote': return (kList('notes').find(n=>n.id===o.trackNote)||{}).label||''; case 'source': return o.source; case 'platform': return platformOf(o); case 'store': return storeOf(o); case 'deliveryMan': return (CUB[o.courierId]||{}).name||''; default: return k.startsWith('custom_')? (o.custom||{})[k]||'' : ''; } };
  downloadCSV((b==='conf'?'commandes':'suivi')+'_'+isoDay(Date.now())+'.csv', [cols.map(c=>kColLabel(b,c)), ...list.map(o=>cols.map(c=>txt(o,c.key)))]);
};

/* ---------- envoi à la société de livraison / à un livreur ---------- */
async function shipOrders(list){
  let ok=0; const ko=[];
  for(const o of list){
    if(!['toprep','ready'].includes(o.status)){ ko.push(o.ref+' : '+t('Confirmez la commande avant l\'envoi')); continue; }
    const chk = preSendCheck(o); if(chk.length){ ko.push(o.ref+' : '+chk.map(t).join(', ')); continue; }
    const cr = carrierOf(o);
    if(carrierHasApi(cr) && !o.tracking){
      try{ await syncNow(); await api('carrier.send', {orderId:o.id, amount:orderTotal(o), weight:orderWeight(o), products:expand(o.items).map(i=>i.q+'x '+PBY[i.pid].name).join(', ')}); await syncNow(); }
      catch(e){ ko.push(o.ref+' : '+e.message); continue; }
    }
    setStatus(o,'sent', cr.internal? 'Remis au livreur' : carrierHasApi(cr)? 'Colis créé chez '+cr.name+' par API' : 'Envoi enregistré (suivi saisi à la main)'); ok++;
  }
  S.ui.kc.sel.clear(); render();
  if(ok) toast(ok+' '+t('colis envoyé(s)'),'ok');
  if(ko.length) openModal(modalTpl(t('Envois bloqués'), `<div class="col small">${ko.map(x=>`<div>${esc(x)}</div>`).join('')}</div>`, `<button class="btn primary" data-a="closeModal">${t('Fermer')}</button>`));
}
const _oSet = A.oSet;
A.oSet = el=>{ if(el.dataset.v==='sent'){ const o=drawerOrder(); if(o) shipOrders([o]); return; } _oSet(el); };
A.bulkSend = ()=>{ const sel=S.ui.track2.sel; shipOrders(ORDERS.filter(o=>o.status==='ready' && (!sel.size||sel.has(o.id)))); };
A.kSend = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); if(SHIP_ST.includes(o.status)){ toast(o.ref+' : '+t('déjà envoyée'),'ok'); return; } shipOrders([o]); };
A.kSendSel = ()=>{ const u=S.ui.kc; if(!u.sel.size){ toast(t('Sélectionnez d\'abord des commandes'),'bad'); return; } shipOrders(ORDERS.filter(o=>u.sel.has(o.id))); };
A.kToMan = el=>{
  const o=ORDERS.find(x=>x.id===+el.dataset.id), own=CARRIERS.find(c=>c.internal);
  const list = COURIERS.filter(c=>c.active);
  openModal(modalTpl(t('Envoyer à un livreur'), `${!['toprep','ready'].includes(o.status) && !SHIP_ST.includes(o.status)? `<p class="small" style="color:var(--amber-d);margin-top:0">${t('Confirmez la commande avant l\'envoi')}</p>`:''}
    ${!own? `<p class="small muted">${t('Activez « Mes livreurs » dans le menu Sociétés de livraison.')}</p>` : list.length? `<div class="col" style="gap:6px">${list.map(c=>`<button class="kmanpick" data-a="kToManGo" data-id="${o.id}" data-v="${c.id}">${ic('userR','sm')} <span class="grow">${esc(c.name)} <span class="xs muted">· ${c.zones.map(w=>esc(wName(w))).join(', ')}</span></span></button>`).join('')}</div>` : `<p class="small muted">${t('Aucun livreur. Ajoutez-en depuis le menu Livreurs.')}</p>`}`, ''));
};
A.kToManGo = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id), own=CARRIERS.find(c=>c.internal); o.carrier=own.id; o.courierId=+el.dataset.v; o.parcels=null; hist(o,'Livreur', CUB[o.courierId].name); closeModal(); if(['toprep','ready'].includes(o.status)) shipOrders([o]); else { toast(o.ref+' → '+CUB[o.courierId].name,'ok'); render(); } };

/* ---------- fenêtres : fiche client, partage, suivi, détail, origine, source ---------- */
A.kClient = el=>{
  const o=ORDERS.find(x=>x.id===+el.dataset.id), c=CBY[o.customerId], s=kRisk(o);
  const row=(icon,l,v,ltr)=>`<div class="kcardrow"><span class="row" style="gap:6px">${ic(icon,'sm')}<b>${t(l)}</b></span><span ${ltr?'dir="ltr"':''}>${esc(String(v===undefined||v===null||v===''?'—':v))}</span></div>`;
  openModal(modalTpl(t('Fiche client'), `<div class="col" style="gap:8px"><div class="kavatar">${ic('userR','lg')}</div>${row('phone','Téléphone',c.phone,1)}${row('user','Nom complet',c.name)}${row('pin','Adresse',[c.address,cName(c.commune),wName(c.wilaya)].filter(Boolean).join(', '))}${row('truck','Livré',s.d)}${row('undo','Retourné',s.r)}<div class="kcardrow"><b>${t('Ratio de risque')}</b><div class="krisk"><div style="width:calc(${s.risk}% + 40px);background:${riskColor(s.risk)}">${s.risk}%</div></div></div></div>`, ''));
};
A.kShare = el=>{
  const o=ORDERS.find(x=>x.id===+el.dataset.id), c=CBY[o.customerId], d=c.phone.replace(/\D/g,''), msg=encodeURIComponent(c.name+' — '+o.ref);
  openModal(modalTpl(t('Partager'), `<div class="col" style="gap:8px">${[['SMS','msg',`sms:${d}?body=${msg}`],['WhatsApp','wa',`https://wa.me/213${d.slice(1)}?text=${msg}`],['Viber','send',`viber://chat?number=%2B213${d.slice(1)}`]].map(([l,i,h])=>`<a class="kmanpick" href="${h}" target="_blank" rel="noopener">${ic(i,'sm')} ${l}</a>`).join('')}</div>`, ''));
};
function kHistColor(h){ return {red:'#E23024', green:'#2FBF4A', amber:'#FFA447', blue:'#4A90C2', kraft:'#FD6400'}[h.color] || '#80BCBD'; }
A.kTimeline = el=>{
  const o=ORDERS.find(x=>x.id===+el.dataset.id);
  openModal(modalTpl(t('Suivi de la commande')+' · '+o.ref, `<ol class="ktl">${o.history.slice().reverse().map(h=>`<li><span class="kpill sm" style="${kPillStyle(kHistColor(h))}">${esc(t(h.action))}</span><p class="xs muted" dir="ltr">${fDT(h.at)} · ${esc(t(h.who))}</p>${h.note? `<p class="knote">${esc(t(h.note))}</p>`:''}</li>`).join('')}</ol>`, ''));
};
/* bloc « statut de confirmation » : dans le détail de la commande et dans la fiche d'appel */
function kStatusBlock(o){
  if(!PRE_ST.includes(o.status)) return `<div class="kstatusblock"><b class="small">${t('Statut')}</b> <span class="kpill" style="${kPillStyle(kColor(o))}">${esc(kLabel(o))}</span></div>`;
  const can = kCanConf(o) && o.status!=='calling' || (S.drawer && !S.drawer.inline && S.drawer.id===o.id && kCanConf(o)), cur=confDef(o);
  return `<div class="kstatusblock"><div class="row between"><b class="small">${t('Statut de confirmation')}</b>${kManage()? `<button class="btn sm ghost" data-a="kManage" data-v="conf">${ic('gear','sm')} ${t('Gérer les statuts')}</button>`:''}</div>
    ${o.statusNote? `<div class="knote">${ic('note','sm')} ${esc(o.statusNote)}</div>`:''}
    <div class="kpills">${kList('conf').map(d=>`<button class="kpill ${d.id===cur.id?'cur':''}" style="${kPillStyle(d.color)}" ${can?`data-a="kStatusSet" data-id="${o.id}" data-v="${esc(d.id)}"`:'disabled'}>${esc(t(d.label))}</button>`).join('')}</div>
    ${can? `<div class="row" style="gap:6px;margin-top:8px"><input class="input" id="kStNote" placeholder="${t('Note du statut (facultatif)')}" value="${esc(o.statusNote||'')}"><button class="btn sm" data-a="kStatusNote" data-id="${o.id}">${t('Enregistrer la note')}</button></div>`:''}</div>`;
}
A.kStatusSet = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); const n=document.getElementById('kStNote'); const note = n? n.value.trim() : undefined; if(S.modal) S.modal=null; kConfApply(o, el.dataset.v, note); };
A.kStatusNote = el=>{ const o=ORDERS.find(x=>x.id===+el.dataset.id); o.statusNote=val('kStNote').trim(); hist(o, 'Note', o.statusNote); toast(t('Note enregistrée'),'ok'); if(S.modal && S.ui.kd===o.id) kDetail(o); else render(); };
function kDetail(o){
  S.ui.kd=o.id; const c=CBY[o.customerId]||{};
  const f=[['Nom complet',c.name],['Téléphone',c.phone],['Adresse',o.address],['Société de livraison',kCarrierName(carrierOf(o))],['Type de livraison',o.delivery==='home'?t('Domicile'):t('Bureau')],['Wilaya',wName(o.wilaya)],['Commune',cName(o.commune)],['Finance',t(finDef(o).label)],['Prix de livraison',dzd(feeOf(o))],['Total',dzd(orderTotal(o))],['Confirmé par',agentName(o.agentId)],['Numéro de suivi',o.tracking]];
  openModal(modalTpl(t('Détail de la commande')+' · '+o.ref, `${kStatusBlock(o)}<div class="kdgrid">${f.map(([k,v])=>`<div><div class="xs muted">${t(k)}</div><div dir="auto">${esc(String(v||'—'))}</div></div>`).join('')}</div>
    <div class="kdprods"><div class="xs muted">${t('Produit')}</div>${o.items.map(i=>{ const p=PBY[i.pid]||{name:'—'}; return `<div class="row between small" style="gap:8px"><span class="row" style="gap:8px;flex-wrap:nowrap">${p.id? prodArt(p,34):''}<span>${esc(p.name)}${i.v&&p.variants? ` <span class="muted">(${esc((p.variants.find(v=>v.id===i.v)||{}).label||'')})</span>`:''}</span></span><span class="num">${dzd(i.price)} × ${i.q}</span></div>`; }).join('')}</div>
    ${o.note? `<div class="kdprods"><div class="xs muted">${t('Remarques')}</div><div class="small">${esc(o.note)}</div></div>`:''}`,
    `${kCanConf(o)? `<button class="btn" data-a="kEdit" data-id="${o.id}">${ic('edit','sm')} ${t('Modifier')}</button>`:''}${PRE_ST.includes(o.status)? `<button class="btn primary" data-a="kCall" data-id="${o.id}">${ic('headset','sm')} ${t('Fiche d\'appel')}</button>`:''}`, true));
}
A.kDetail = el=>kDetail(ORDERS.find(x=>x.id===+el.dataset.id));
A.kOrigin = el=>{
  const o=ORDERS.find(x=>x.id===+el.dataset.id), g=o.original; if(!g) return;
  const first = o.history[0]? t(o.history[0].action) : '—';
  openModal(modalTpl(t('Commande d\'origine (avant modification)')+' · '+o.ref, `<p class="xs muted" style="margin-top:0">${t('Reçue le')} : <span dir="ltr">${fDT(g.at)}</span></p><div class="kdgrid">${[['Statut',first],['Nom complet',g.name],['Téléphone',g.phone],['Adresse',g.address],['Type de livraison',g.delivery==='home'?t('Domicile'):t('Bureau')],['Wilaya',wName(g.wilaya)],['Commune',g.commune],['Remise',g.discount? (g.discountType==='amount'? dzd(g.discount) : g.discount+' %') : '—']].map(([k,v])=>`<div><div class="xs muted">${t(k)}</div><div dir="auto">${esc(String(v||'—'))}</div></div>`).join('')}</div>
    <div class="kdprods"><div class="xs muted">${t('Produit')}</div>${(g.items||[]).map(i=>`<div class="row between small"><span>${esc((PBY[i.pid]||{name:'—'}).name)}</span><span class="num">${dzd(i.price)} × ${i.q}</span></div>`).join('')}</div>${g.note? `<div class="kdprods"><div class="xs muted">${t('Remarques')}</div><div class="small">${esc(g.note)}</div></div>`:''}`, ''));
};
A.kSource = el=>{
  const o=ORDERS.find(x=>x.id===+el.dataset.id), m=sourceMeta(o), a=UBY[o.agentId], team = a && TEAMS.find(x=>x.id===a.teamId), mgr = team && UBY[team.managerId];
  openModal(modalTpl(t(m[0]), `<div class="col" style="gap:8px">${[['Nom boutique',storeOf(o)],['Plateforme',(PLAT[platformOf(o)]||[''])[0]],['Confirmé par',a&&a.name],['Manager',mgr&&mgr.name]].filter(x=>x[1]).map(([k,v])=>`<div class="kcardrow"><b>${t(k)}</b><span>${esc(v)}</span></div>`).join('')}</div>`, o.source==='Site'? `<a class="btn primary block" href="#/">${ic('globe','sm')} ${t('Lien')}</a>`:''));
};
async function kDuplicate(o){
  const c=CBY[o.customerId];
  try{ const r=await api('order', {name:c.name, phone:c.phone, wilaya:o.wilaya, commune:o.commune, address:o.address, delivery:o.delivery, note:o.note, source:o.source==='Site'?'Téléphone':o.source, carrier:o.carrier, items:o.items.map(i=>({pid:i.pid, v:i.v, q:i.q, price:i.price}))}); await syncNow(); toast(t('Commande dupliquée')+' : '+r.ref,'ok'); render(); }
  catch(e){ toast(esc(e.message),'bad'); }
}

/* ---------- corbeille (30 jours) ---------- */
const kTrashList = () => TRASHED.filter(o=>!o.purgedAt && Date.now()-o.trashedAt < 30*DAY);
const kTrashable = o => !['delivered','paid','closed'].includes(o.status);
function kConfirmDelete(ids){
  const ok=ids.filter(id=>{ const o=ORDERS.find(x=>x.id===id); return o && kTrashable(o); });
  if(!ok.length){ toast(t('Les commandes livrées ou encaissées ne se suppriment pas.'),'bad'); return; }
  S.ui.kdel=ok;
  openModal(modalTpl(t('Supprimer'), `<div class="row" style="gap:12px;flex-wrap:nowrap"><span class="kround red">${ic('trash')}</span><div><b>${t('Voulez-vous vraiment supprimer ?')}</b><div class="small muted">${t('Les commandes seront déplacées vers la corbeille')} (${ok.length})</div></div></div>`, `<button class="btn grow" data-a="closeModal">${t('Annuler')}</button><button class="btn red grow" data-a="kDelGo">${t('Supprimer')}</button>`));
}
A.kDel = el=>kConfirmDelete([+el.dataset.id]);
A.kDelSel = el=>kConfirmDelete([...kU(el.dataset.b).sel]);
A.kDelAll = el=>kConfirmDelete((el.dataset.b==='conf'? kConfBase() : kTrackBase()).map(o=>o.id));
A.kDelGo = ()=>{
  const ids=S.ui.kdel||[];
  ids.forEach(id=>{ const o=ORDERS.find(x=>x.id===id); if(!o) return; o.trashedAt=Date.now(); o.trashedBy=me().name; ORDERS.splice(ORDERS.indexOf(o),1); TRASHED.push(o); S.ui.kc.sel.delete(id); S.ui.kt.sel.delete(id); });
  log('Commandes mises à la corbeille', ids.length+''); toast(ids.length+' '+t('commande(s) déplacée(s) vers la corbeille'),'ok'); S.ui.kdel=null; closeModal(); render();
};
A.kTrash = ()=>{
  const l=kTrashList();
  openModal(modalTpl(t('Corbeille')+` (${l.length})`, `<p class="xs muted" style="margin-top:0">${t('Les commandes supprimées restent ici 30 jours puis sont effacées définitivement.')}</p>${l.length? `<div class="col" style="gap:6px">${l.map(o=>{ const c=CBY[o.customerId]||{}; return `<div class="ktrashrow"><div class="grow" style="min-width:0"><b class="small">${esc(c.name||o.ref)}</b><div class="xs muted trunc">${esc([o.ref, c.phone, (PBY[(o.items[0]||{}).pid]||{}).name].filter(Boolean).join(' · '))}</div></div><span class="xs muted">${Math.max(0,30-Math.floor((Date.now()-o.trashedAt)/DAY))} j</span><button class="kico green" data-a="kRestore" data-id="${o.id}" title="${t('Restaurer')}" aria-label="${t('Restaurer')}">${ic('undo','sm')}</button><button class="kico red" data-a="kPurge" data-id="${o.id}" title="${t('Supprimer')}" aria-label="${t('Supprimer définitivement')}">${ic('trash','sm')}</button></div>`; }).join('')}</div>` : `<p class="kempty">${t('La corbeille est vide.')}</p>`}`, l.length? `<button class="btn red" data-a="kPurgeAll">${t('Vider la corbeille')}</button>`:''));
};
A.kRestore = el=>{ const o=TRASHED.find(x=>x.id===+el.dataset.id); if(!o) return; delete o.trashedAt; delete o.trashedBy; TRASHED.splice(TRASHED.indexOf(o),1); ORDERS.push(o); reindex(); toast(o.ref+' '+t('restaurée'),'ok'); A.kTrash(); render(); };
A.kPurge = el=>{ const o=TRASHED.find(x=>x.id===+el.dataset.id); if(o) o.purgedAt=Date.now(); A.kTrash(); queueSync(); };
A.kPurgeAll = ()=>{ kTrashList().forEach(o=>o.purgedAt=Date.now()); A.kTrash(); queueSync(); };

/* ---------- ajouter par ligne ---------- */
A.kRowStart = ()=>{ const p=PRODUCTS.find(x=>x.price && x.status==='actif'); S.ui.kc.row = {name:'', phone:'', status:'pending', address:'', carrier:autoCarrier({wilaya:16}), delivery:'home', wilaya:16, commune:'', pid:p?p.id:0, price:p?p.price:0, q:1}; S.ui.kc.pop=''; render(); };
function kRowDraft(cols){
  const r=S.ui.kc.row; if(!r) return '';
  const p=PBY[r.pid], tmp={wilaya:+r.wilaya, delivery:r.delivery, carrier:r.carrier, items:p?[{pid:p.id, q:+r.q||1, price:+r.price||0}]:[]};
  const fee = tmp.items.length? feeOf(tmp) : 0;
  const inp = (f, attrs)=>`<input class="kcell kin" value="${esc(r[f])}" data-kr="${f}" ${attrs||''}>`;
  const cell = k=>{ switch(k){
    case 'fullName': return inp('name','placeholder="'+t('Nom complet')+'"');
    case 'phone': return inp('phone','dir="ltr" inputmode="numeric" placeholder="05 XX XX XX XX"');
    case 'status': return `<select class="kcell kin" data-kr="status">${kList('conf').filter(d=>['pending','confirm'].includes(d.kind)).map(d=>`<option value="${d.id}" ${r.status===d.id?'selected':''}>${esc(t(d.label))}</option>`).join('')}</select>`;
    case 'address': return inp('address','placeholder="'+t('Adresse')+'"');
    case 'dc': return `<select class="kcell kin" data-kr="carrier"><option value="">—</option>${CARRIERS.filter(c=>c.connected).map(c=>`<option value="${c.id}" ${c.id===r.carrier?'selected':''}>${esc(kCarrierName(c))}</option>`).join('')}</select>`;
    case 'typeL': return `<select class="kcell kin" data-kr="delivery"><option value="home" ${r.delivery==='home'?'selected':''}>${t('Domicile')}</option><option value="desk" ${r.delivery==='desk'?'selected':''}>${t('Bureau')}</option></select>`;
    case 'wilaya': return `<select class="kcell kin" data-kr="wilaya">${WILAYAS.filter(w=>w.active).map(w=>`<option value="${w.id}" ${w.id===+r.wilaya?'selected':''}>${w.code} - ${esc(wName(w.id))}</option>`).join('')}</select>`;
    case 'commune': return `<select class="kcell kin" data-kr="commune">${communeOptions(r.wilaya, r.commune)}</select>`;
    case 'product': return `<select class="kcell kin" data-kr="pid">${PRODUCTS.filter(x=>x.price && !['devis','archivé','masqué'].includes(x.status)).map(x=>`<option value="${x.id}" ${x.id===+r.pid?'selected':''}>${esc(x.name)}</option>`).join('')}</select>`;
    case 'sku': return `<span class="muted num">${esc(p?p.sku:'')}</span>`;
    case 'productPrice': return inp('price','type="number" min="0" dir="ltr" style="width:6rem"');
    case 'qty': return inp('q','type="number" min="1" dir="ltr" style="width:4.5rem"');
    case 'deliveryCost': return `<span class="num">${dzd(fee)}</span>`;
    case 'total': return `<b class="num">${dzd((+r.price||0)*(+r.q||1)+fee)}</b>`;
    case 'actions': return `<div class="kacts"><button class="btn sm red" data-a="kRowCancel">${ic('x','sm')} ${t('Annuler')}</button><button class="btn sm green" data-a="kRowSave">${t('Enregistrer')}</button></div>`;
    default: return ''; } };
  return `<tr class="kdraft"><td class="kchk"></td>${cols.filter(c=>c.visible).map(c=>`<td data-label="${esc(kColLabel('conf',c))}" class="km">${cell(c.key)}</td>`).join('')}</tr>`;
}
document.addEventListener('change', e=>{ const el=e.target.closest('[data-kr]'); if(!el || !S.ui.kc.row) return; const r=S.ui.kc.row; r[el.dataset.kr]=el.value; if(el.dataset.kr==='pid'){ const p=PBY[+el.value]; r.price=p? unitPrice(p, null, +r.q||1) : 0; } if(el.dataset.kr==='wilaya'){ r.commune=''; r.carrier=autoCarrier({wilaya:+el.value}) || r.carrier; } render(); });
document.addEventListener('input', e=>{ const el=e.target.closest('input[data-kr]'); if(el && S.ui.kc.row) S.ui.kc.row[el.dataset.kr]=el.value; });
A.kRowCancel = ()=>{ S.ui.kc.row=null; render(); };
A.kRowSave = async el=>{
  const r=S.ui.kc.row; el.disabled=true;
  try{ const res=await api('order', {name:r.name, phone:r.phone, wilaya:+r.wilaya, commune:r.commune, address:r.address, delivery:r.delivery, carrier:r.carrier, source:'Téléphone', items:[{pid:+r.pid, q:+r.q||1, price:+r.price||0}]}); S.ui.kc.row=null; await syncNow(); kAfterCreate(res.id, r.status); toast(res.ref+' '+t('créée'),'ok'); render(); }
  catch(e){ el.disabled=false; toast(esc(e.message),'bad'); }
};
function kAfterCreate(id, statusId){ const o=ORDERS.find(x=>x.id===id); if(!o || !statusId || statusId==='pending') return; const d=kList('conf').find(x=>x.id===statusId); if(d && d.kind!=='pending') kConfApply(o, statusId); }

/* ---------- ajouter plusieurs lignes ---------- */
A.kMulti = ()=>{ S.ui.kc.pop=''; const p=PRODUCTS.find(x=>x.price && x.status==='actif'); S.ui.km2 = {count:3, carrier:autoCarrier({wilaya:16}), delivery:'home', pid:p?p.id:0, rows:null}; kMultiDraw(); };
function kMultiDraw(){
  const m=S.ui.km2;
  if(!m.rows){
    S.modal={html:modalTpl(t('Ajouter plusieurs lignes'), `<div class="grid2"><div class="field"><label>${t('Nombre de commandes')}<input class="input" type="number" min="1" max="15" value="${m.count}" data-km2="count"></label><span class="xs" style="color:var(--red)">max : 15</span></div>
      <div class="field"><label>${t('Société de livraison')}<select class="select" data-km2="carrier"><option value="">—</option>${CARRIERS.filter(c=>c.connected).map(c=>`<option value="${c.id}" ${c.id===m.carrier?'selected':''}>${esc(kCarrierName(c))}</option>`).join('')}</select></label></div>
      <div class="field"><label>${t('Type de livraison')}<select class="select" data-km2="delivery"><option value="home">${t('Domicile')}</option><option value="desk" ${m.delivery==='desk'?'selected':''}>${t('Bureau')}</option></select></label></div>
      <div class="field"><label>${t('Produit')}<select class="select" data-km2="pid">${PRODUCTS.filter(x=>x.price && x.status==='actif').map(x=>`<option value="${x.id}" ${x.id===+m.pid?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label></div></div>`,
      `<button class="btn red" data-a="closeModal">${ic('x','sm')} ${t('Annuler')}</button><button class="btn green" data-a="kMultiNext">${t('Importer')}</button>`)};
  } else {
    S.modal={html:modalTpl(t('Ajouter plusieurs lignes')+` (${m.rows.length})`, `<div class="kscroll col" style="gap:8px">${m.rows.map((r,i)=>`<div class="kmultirow"><b class="xs muted">#${i+1}</b><input class="input" placeholder="${t('Nom complet')}" value="${esc(r.name)}" data-km2r="${i}" data-f="name"><input class="input" dir="ltr" inputmode="numeric" placeholder="05 XX XX XX XX" value="${esc(r.phone)}" data-km2r="${i}" data-f="phone"><select class="select" data-km2r="${i}" data-f="wilaya">${WILAYAS.filter(w=>w.active).map(w=>`<option value="${w.id}" ${w.id===+r.wilaya?'selected':''}>${w.code} - ${esc(wName(w.id))}</option>`).join('')}</select><select class="select" data-km2r="${i}" data-f="commune">${communeOptions(r.wilaya, r.commune)}</select><input class="input num" type="number" min="1" value="${r.q}" style="width:70px" data-km2r="${i}" data-f="q" aria-label="${t('Quantité')}">${r.err? `<span class="xs" style="color:var(--red);grid-column:1/-1">${esc(r.err)}</span>`:''}</div>`).join('')}</div>`,
      `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn green" data-a="kMultiSave">${t('Enregistrer tout')}</button>`, true)};
  }
  renderOverlay();
}
document.addEventListener('change', e=>{ const el=e.target.closest('[data-km2],[data-km2r]'); if(!el || !S.ui.km2) return; const m=S.ui.km2; if(el.dataset.km2) m[el.dataset.km2]=el.value; else { const r=m.rows[+el.dataset.km2r]; r[el.dataset.f]=el.value; if(el.dataset.f==='wilaya'){ r.commune=''; kMultiDraw(); } } });
document.addEventListener('input', e=>{ const el=e.target.closest('input[data-km2r]'); if(el && S.ui.km2) S.ui.km2.rows[+el.dataset.km2r][el.dataset.f]=el.value; });
A.kMultiNext = ()=>{ const m=S.ui.km2; const n=Math.max(1,Math.min(15,+m.count||1)); m.rows=Array.from({length:n},()=>({name:'', phone:'', wilaya:16, commune:'', q:1})); kMultiDraw(); };
A.kMultiSave = async el=>{
  const m=S.ui.km2; el.disabled=true; let ok=0;
  for(const r of m.rows){ if(r.done) continue; try{ await api('order', {name:r.name, phone:r.phone, wilaya:+r.wilaya, commune:r.commune, delivery:m.delivery, carrier:m.carrier, source:'Téléphone', items:[{pid:+m.pid, q:+r.q||1}]}); r.done=true; r.err=''; ok++; } catch(e){ r.err=e.message; } }
  await syncNow(); m.rows=m.rows.filter(r=>!r.done);
  toast(ok+' '+t('commande(s) créée(s)'), m.rows.length?'bad':'ok');
  if(m.rows.length) kMultiDraw(); else { S.ui.km2=null; closeModal(); } render();
};
