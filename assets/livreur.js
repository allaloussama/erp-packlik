"use strict";
/* ============================================================
   Rôle « Livreur » : sa tournée, son argent, son historique, ses performances.
   Le compte est relié à une fiche livreur (Livraison › Livreurs) par user.courierId.
   Le serveur ne lui envoie que ses commandes et leurs clients, et n'accepte que les changements de livraison
   (voir guard_courier() dans api/lib.php) : ici on ne touche donc ni aux produits, ni au journal.
   ============================================================ */
ROLE_LABEL.livreur = 'Livreur';
ROLE_HOME.livreur = 'tournee';
MENUS.livreur = [['Mon espace livreur', [['tournee','truck','Ma tournée','lvt'], ['argent','cash','Mon argent','lvc'], ['historique','history','Historique'], ['perf','target','Mes performances']]]];
const LV_TODO = ['sent','picked','transit','outfor','failed'];
const lvMe = () => CUB[me().courierId] || {id:me().courierId, name:me().name, perDelivery:0};
const lvMine = () => ORDERS.filter(o=>o.courierId && o.courierId===me().courierId);
const lvCash = () => lvMine().filter(o=>o.cashWithCourier);
const _countersLv = counters;
counters = function(){ const c=_countersLv(); if(S.role==='livreur'){ c.lvt=lvMine().filter(o=>LV_TODO.includes(o.status)).length; c.lvc=lvCash().length; } return c; };

/* changement de statut côté livreur : seulement la commande (pas de stock, pas de journal) */
function lvSet(o, st, label, note, color){
  o.status=st; o.times[st]=Date.now(); o.lastDhdUpdate=Date.now();
  o.history.push({at:Date.now(), who:me().name, action:label, note:note||'', color:color||'blue'});
  if(st==='delivered') o.cashWithCourier=true;
}
const lvPhone = p => String(p||'').replace(/\D/g,'');
const lvWa = p => { const d=lvPhone(p); return 'https://wa.me/'+(d.startsWith('0')? '213'+d.slice(1) : d); };
const lvMap = o => 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent([o.address, cName(o.commune), wName(o.wilaya), 'Algérie'].filter(Boolean).join(', '));

function lvCard(o){
  const c=CBY[o.customerId]||{}, todo=LV_TODO.includes(o.status), last=o.attempts && o.attempts[o.attempts.length-1];
  return `<article class="lv-card ${o.status}">
    <div class="lv-top"><b class="num">${esc(o.ref)}</b><span class="kpill" style="${kPillStyle(kColor(o))}">${esc(kLabel(o))}</span><span class="grow"></span><b class="lv-amt num">${dzd(orderTotal(o))}</b></div>
    <div class="lv-who"><b>${esc(c.name||'—')}</b><span dir="ltr" class="num">${esc(c.phone||'')}</span>${c.phone2?`<span dir="ltr" class="num muted small">${esc(c.phone2)}</span>`:''}</div>
    <div class="lv-addr">${ic('pin','sm')}<span>${esc([o.address, cName(o.commune), wName(o.wilaya)].filter(Boolean).join(', ') || '—')}${o.delivery==='desk'? ' · '+t('bureau'):''}</span></div>
    <div class="lv-items">${o.items.map(i=>`${i.q} × ${esc((PBY[i.pid]||{name:'?'}).name)}`).join(' · ')}</div>
    ${o.note? `<div class="lv-note">${ic('note','sm')} ${esc(o.note)}</div>`:''}
    ${last && o.status==='failed'? `<div class="lv-note red">${ic('alert','sm')} ${esc(t((FBY[last.reason]||{}).fr||last.reason))}${last.comment?' — '+esc(last.comment):''}</div>`:''}
    ${o.courierNote? `<div class="lv-note">${ic('edit','sm')} ${esc(o.courierNote)}</div>`:''}
    <div class="lv-quick">${c.phone? `<a class="lv-q" href="tel:${lvPhone(c.phone)}">${ic('phone','sm')} ${t('Appeler')}</a><a class="lv-q wa" href="${lvWa(c.phone)}" target="_blank" rel="noopener">${ic('wa','sm')} WhatsApp</a>`:''}<a class="lv-q" href="${lvMap(o)}" target="_blank" rel="noopener">${ic('route','sm')} ${t('Itinéraire')}</a><button class="lv-q" data-a="lvNote" data-id="${o.id}">${ic('note','sm')} ${t('Note')}</button></div>
    ${todo? `<div class="lv-acts">${o.status!=='outfor'? `<button class="btn" data-a="lvGo" data-id="${o.id}">${ic('truck','sm')} ${t('Je pars livrer')}</button>`:''}<button class="btn red" data-a="lvFail" data-id="${o.id}">${ic('x','sm')} ${t('Échec')}</button><button class="btn green" data-a="lvDone" data-id="${o.id}">${ic('check','sm')} ${t('Livrée')}</button></div>` : ''}
  </article>`;
}
S.ui.lv = {tab:'todo', q:''};
function viewLvTour(){
  const u=S.ui.lv, all=lvMine().filter(o=>LV_TODO.includes(o.status));
  const tabs=[['todo','À livrer', all.filter(o=>['sent','picked','transit'].includes(o.status))],['outfor','En route', all.filter(o=>o.status==='outfor')],['failed','À reprendre', all.filter(o=>o.status==='failed')]];
  const cur=(tabs.find(x=>x[0]===u.tab)||tabs[0]);
  let list=cur[2]; if(u.q){ const q=u.q.toLowerCase(); list=list.filter(o=>o.ref.toLowerCase().includes(q) || ((CBY[o.customerId]||{}).name||'').toLowerCase().includes(q) || ((CBY[o.customerId]||{}).phone||'').replace(/\s/g,'').includes(q.replace(/\s/g,'')) || (o.commune||'').toLowerCase().includes(q)); }
  const due=lvCash().reduce((s,o)=>s+orderTotal(o),0), toCollect=all.reduce((s,o)=>s+orderTotal(o),0);
  const body = `<div class="lv-kpis"><div><span>${t('Colis à livrer')}</span><b class="num">${all.length}</b></div><div><span>${t('À encaisser')}</span><b class="num">${dzd(toCollect)}</b></div><div class="dark"><span>${t('Argent en main')}</span><b class="num">${dzd(due)}</b></div></div>
    <div class="lv-bar"><div class="kseg2">${tabs.map(([k,l,a])=>`<button class="${cur[0]===k?'on':''}" data-a="lvTab" data-v="${k}">${t(l)} <b>${a.length}</b></button>`).join('')}</div><input class="input" placeholder="${t('Rechercher : n°, client, téléphone, commune…')}" value="${esc(u.q)}" data-in="lvQ" aria-label="${t('Rechercher')}"></div>
    <div class="lv-list">${list.map(lvCard).join('') || `<div class="card empty">${ic('check')}<div>${t('Rien ici pour le moment')}</div></div>`}</div>`;
  return erpShell('tournee', t('Ma tournée'), esc(lvMe().name||me().name), body);
}
function viewLvCash(){
  const cash=lvCash(), sum=cash.reduce((s,o)=>s+orderTotal(o),0);
  const handed=lvMine().filter(o=>!o.cashWithCourier && ['paid','closed'].includes(o.status)).sort((a,b)=>(b.times.paid||0)-(a.times.paid||0));
  const body = `<div class="lv-kpis"><div class="dark"><span>${t('Argent en main à remettre')}</span><b class="num">${dzd(sum)}</b></div><div><span>${t('Colis encaissés')}</span><b class="num">${cash.length}</b></div><div><span>${t('Déjà remis')}</span><b class="num">${dzd(handed.reduce((s,o)=>s+orderTotal(o),0))}</b></div></div>
    ${card(t('À remettre au bureau'), `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Commande')}</th><th>${t('Client')}</th><th>${t('Livrée le')}</th><th class="r">${t('Montant')}</th></tr></thead><tbody>${cash.map(o=>`<tr><td><b>${esc(o.ref)}</b></td><td class="small">${esc((CBY[o.customerId]||{}).name||'—')}</td><td class="small">${o.times.delivered? fDT(o.times.delivered):'—'}</td><td class="r num"><b>${dzd(orderTotal(o))}</b></td></tr>`).join('') || emptyRow(4,'Aucun argent en main','check')}</tbody>${cash.length? `<tfoot><tr><td colspan="3"><b>${t('Total')}</b></td><td class="r num"><b>${dzd(sum)}</b></td></tr></tfoot>`:''}</table></div><div class="card-b small muted">${t('Remettez cet argent au bureau : l\'administration le marque comme reçu et il passe dans « Déjà remis ».')}</div>`)}
    ${card(t('Déjà remis'), `<div class="tbl-wrap"><table class="tbl"><tbody>${handed.slice(0,60).map(o=>`<tr><td><b>${esc(o.ref)}</b></td><td class="small">${o.times.paid? fDT(o.times.paid):'—'}</td><td class="r num">${dzd(orderTotal(o))}</td></tr>`).join('') || emptyRow(3,'Aucune remise pour le moment')}</tbody></table></div>`)}`;
  return erpShell('argent', t('Mon argent'), '', body);
}
function viewLvHist(){
  const list=lvMine().filter(o=>!LV_TODO.includes(o.status)).sort((a,b)=>Math.max(...Object.values(b.times||{0:0}))-Math.max(...Object.values(a.times||{0:0})));
  const body = card('', `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t('Commande')}</th><th>${t('Client')}</th><th>${t('Commune')}</th><th>${t('Statut')}</th><th>${t('Date')}</th><th class="r">${t('Montant')}</th><th></th></tr></thead><tbody>${list.map(o=>{ const h=o.history[o.history.length-1]; return `<tr><td><b>${esc(o.ref)}</b></td><td class="small">${esc((CBY[o.customerId]||{}).name||'—')}</td><td class="small">${esc(cName(o.commune)||'—')}</td><td><span class="kpill" style="${kPillStyle(kColor(o))}">${esc(kLabel(o))}</span></td><td class="small">${h? fDT(h.at):'—'}</td><td class="r num">${dzd(orderTotal(o))}</td><td><button class="btn sm ghost" data-a="kTimeline" data-id="${o.id}">${ic('history','sm')}</button></td></tr>`; }).join('') || emptyRow(7,'Aucune livraison terminée')}</tbody></table></div>`);
  return erpShell('historique', t('Historique'), '', body);
}
function viewLvPerf(){
  const mine=lvMine(), month=dayStart(Date.now())-29*DAY;
  const done=mine.filter(o=>o.times.delivered && o.times.delivered>=month), fail=mine.filter(o=>(o.attempts||[]).some(a=>a.at>=month && a.byCourier)).length, ret=mine.filter(o=>['returning','returned'].includes(o.status)).length;
  const rate = done.length+ret? Math.round(done.length/(done.length+ret)*100) : 0, pay=(+lvMe().perDelivery||0)*done.length;
  const days=[...Array(14)].map((_,i)=>{ const s=dayStart(Date.now())-(13-i)*DAY; return {l:new Date(s).getDate()+'/'+(new Date(s).getMonth()+1), v:mine.filter(o=>o.times.delivered>=s && o.times.delivered<s+DAY).length, c:'#FD6400'}; });
  const body = `<div class="kpis">${kpi(t('Livrées (30 j)'), done.length)}${kpi(t('Échecs signalés (30 j)'), fail)}${kpi(t('Taux de livraison'), rate+' %')}${kpi(t('Rémunération estimée (30 j)'), dzd(pay), (+lvMe().perDelivery||0)? dzd(+lvMe().perDelivery)+' / '+t('livraison'):'' ,'accent')}</div>
    ${card(t('Livraisons par jour (14 j)'), `<div class="card-b">${barChart(days)}</div>`)}`;
  return erpShell('perf', t('Mes performances'), '', body);
}
ERP_VIEWS.livreur = {tournee:()=>viewLvTour(), argent:()=>viewLvCash(), historique:()=>viewLvHist(), perf:()=>viewLvPerf()};
const lvO = el => lvMine().find(o=>o.id===+el.dataset.id);
A.lvTab = el=>{ S.ui.lv.tab=el.dataset.v; render(); };
IN.lvQ = el=>{ S.ui.lv.q=el.value; render(); };
A.lvGo = el=>{ const o=lvO(el); if(!o) return; lvSet(o,'outfor', t('En livraison'), t('Le livreur part livrer'), 'amber'); toast(o.ref+' : '+t('en route'),'ok'); render(); };
A.lvDone = el=>{ const o=lvO(el); if(!o) return;
  openModal(modalTpl(t('Livrée')+' · '+esc(o.ref), `<p style="margin-top:0">${t('Montant encaissé auprès du client')} :</p><div class="lv-big num">${dzd(orderTotal(o))}</div><label class="field">${t('Remarque (facultatif)')}<input class="input" id="lvDN"></label>`,
    `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn green" data-a="lvDoneGo" data-id="${o.id}">${ic('check','sm')} ${t('Confirmer : livrée et encaissée')}</button>`)); };
A.lvDoneGo = el=>{ const o=lvO(el); if(!o) return; const n=val('lvDN').trim(); closeModal(); lvSet(o,'delivered', t('Livrée par')+' '+me().name+' — '+t('argent chez le livreur'), n, 'green'); toast(o.ref+' : '+t('livrée'),'ok'); render(); };
A.lvFail = el=>{ const o=lvO(el); if(!o) return;
  openModal(modalTpl(t('Livraison impossible')+' · '+esc(o.ref), `<div class="col" style="gap:10px"><label class="field">${t('Motif')}<select class="select" id="lvFR">${FAIL_REASONS.map(f=>`<option value="${esc(f.id)}">${esc(t(f.fr))}</option>`).join('')}</select></label><label class="field">${t('Commentaire')}<textarea class="input" id="lvFC" rows="2" placeholder="${t('Ex. client absent, rappeler après 17 h')}"></textarea></label></div>`,
    `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn red" data-a="lvFailGo" data-id="${o.id}">${t('Enregistrer l\'échec')}</button>`)); };
A.lvFailGo = el=>{ const o=lvO(el); if(!o) return; const r=val('lvFR'), c=val('lvFC').trim(); closeModal(); o.attempts=o.attempts||[];
  o.attempts.push({n:o.attempts.length+1, at:Date.now(), reason:r, comment:c, action:'', agentId:o.agentId, due:Date.now()+2*HOUR, result:'', resolved:false, byCourier:true});
  lvSet(o,'failed', t('Tentative')+' '+o.attempts.length+' '+t('échouée'), t((FBY[r]||{}).fr||r)+(c?' — '+c:''), 'red'); toast(o.ref+' : '+t('échec enregistré'),'ok'); render(); };
A.lvNote = el=>{ const o=lvO(el); if(!o) return; openModal(modalTpl(t('Note du livreur')+' · '+esc(o.ref), `<textarea class="input" id="lvN" rows="3">${esc(o.courierNote||'')}</textarea>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn primary" data-a="lvNoteGo" data-id="${o.id}">${t('Enregistrer')}</button>`)); };
A.lvNoteGo = el=>{ const o=lvO(el); if(!o) return; o.courierNote=val('lvN').trim(); o.history.push({at:Date.now(), who:me().name, action:'Note du livreur', note:o.courierNote, color:''}); closeModal(); render(); };

/* ---------- admin : compte livreur relié à une fiche livreur ---------- */
const _memberEditLv = A.memberEdit;
A.memberEdit = el=>{ _memberEditLv(el); const u=UBY[+el.dataset.id]||{}; const r=document.getElementById('muR'); if(!r) return;
  if(!r.querySelector('option[value=livreur]')) r.insertAdjacentHTML('beforeend', `<option value="livreur" ${u.role==='livreur'?'selected':''}>${t('Livreur')}</option>`);
  r.closest('.grid2').insertAdjacentHTML('beforeend', `<div class="field" id="muCw" style="${u.role==='livreur'?'':'display:none'}"><label for="muC">${t('Fiche livreur')}</label><select class="select" id="muC">${COURIERS.map(c=>`<option value="${c.id}" ${c.id===u.courierId?'selected':''}>${esc(c.name)}</option>`).join('') || `<option value="">${t('Créez d\'abord un livreur dans Livraison › Livreurs')}</option>`}</select></div>`);
  r.addEventListener('change', ()=>{ document.getElementById('muCw').style.display = r.value==='livreur'? '' : 'none'; });
};
const _memberSaveLv = A.memberSave;
A.memberSave = async el=>{ const role=val('muR'), cid=+val('muC')||null; if(role==='livreur' && !cid){ toast(t('Choisissez la fiche livreur'),'bad'); return; }
  const before=USERS.length; const id=+el.dataset.id;
  const p=_memberSaveLv(el);
  const u = id? UBY[id] : (USERS.length>before? USERS[USERS.length-1] : null);
  if(u){ if(role==='livreur') u.courierId=cid; else delete u.courierId; }
  return p; };
