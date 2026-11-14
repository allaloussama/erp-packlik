"use strict";
/* ============================================================
   PackLik — liaison avec l'API PHP
   L'interface (app.js) travaille sur des tableaux en mémoire. Ce fichier les remplit depuis le
   serveur au démarrage, envoie chaque modification locale, et reçoit celles des autres postes.
   ============================================================ */
const COLLS = {products:PRODUCTS, orders:ORDERS, customers:CUSTOMERS, users:USERS, teams:TEAMS, suppliers:SUPPLIERS,
  purchases:PURCHASES, sup_payments:SUP_PAYMENTS, dhd_payments:DHD_PAYMENTS, cashboxes:CASHBOXES, cash_moves:CASH_MOVES,
  advances:ADVANCES, expenses:EXPENSES, ad_spend:AD_SPEND, stock_moves:STOCK_MOVES, activity:ACTIVITY, notifs:NOTIFS,
  carriers:CARRIERS, couriers:COURIERS, pixels:PIXELS, wilayas:WILAYAS};
const KV = {settings:SETTINGS, pixel_events:PIXEL_EVENTS};
Object.entries(KV).forEach(([k,o])=>o._key=k);
const NET = {csrf:null, rev:0, snap:{}, revs:{}, busy:false, again:false, quiet:new Set(), needSetup:false, needInit:false, pendingRender:false};
Object.keys(COLLS).concat('kv').forEach(c=>{ NET.snap[c]=new Map(); NET.revs[c]=new Map(); });

const keyOf = r => String(r.id ?? r._id);
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const clone = x => JSON.parse(JSON.stringify(x));

async function api(route, body){
  const init = body===undefined ? {} : {method:'POST', headers:{'Content-Type':'application/json', ...(NET.csrf? {'X-CSRF':NET.csrf}:{})}, body:JSON.stringify(body)};
  let res; try{ res = await fetch('api/?r='+route, {credentials:'same-origin', ...init}); }catch(e){ throw new Error(t('Connexion au serveur impossible')); }
  let j=null; try{ j = await res.json(); }catch(e){}
  if(!res.ok) throw Object.assign(new Error((j && j.error) || t('Erreur serveur')+' ('+res.status+')'), {status:res.status});
  return j;
}

/* Les données fictives générées par app.js sont mises de côté (elles ne servent qu'au bouton
   « Charger la démonstration ») : l'ERP n'affiche que ce qui vient de la base. */
const DEMO = {}; Object.entries(COLLS).forEach(([c,arr])=>{ DEMO[c]=clone(arr); arr.length=0; });
S.favs = new Set(); S.compare = new Set(); S.uid = 0; S.role = 'public';

function reindex(){
  const fill = (map, arr)=>{ Object.keys(map).forEach(k=>delete map[k]); arr.forEach(x=>map[x.id]=x); };
  fill(PBY,PRODUCTS); fill(CBY,CUSTOMERS); fill(UBY,USERS); fill(CRB,CARRIERS); fill(CUB,COURIERS); fill(CBX,CASHBOXES); fill(WBY,WILAYAS);
  AGENTS.length=0; AGENTS.push(...USERS.filter(u=>u.role==='agent'));
  const num = (a,b)=>a.id-b.id, recent = (a,b)=>b.at-a.at;
  PRODUCTS.sort(num); ORDERS.sort(num); CUSTOMERS.sort(num); USERS.sort(num); WILAYAS.sort(num);
  CASH_MOVES.sort(recent); STOCK_MOVES.sort(recent); ACTIVITY.sort(recent); NOTIFS.sort(recent); AD_SPEND.sort((a,b)=>a.date-b.date);
}
function normDoc(c, d){
  if(c==='orders'){ if(!d.times || Array.isArray(d.times)) d.times={}; ['items','initial','attempts','history'].forEach(k=>{ if(!Array.isArray(d[k])) d[k]=[]; }); }
  return d;
}
/* Applique des documents venus du serveur : [collection, id, rev, doc|null]. `sent` = ce qu'on venait
   d'envoyer ; un document retouché localement pendant l'aller-retour garde sa version locale. */
function applyDocs(list, sent, force){
  let changed = false; const idx = {};
  for(const [c, id, rev, d] of list){
    if(c==='kv'){ const o=KV[id]; if(o && d){ const j=JSON.stringify(d); if(JSON.stringify(o)!==j){ Object.keys(o).forEach(k=>delete o[k]); Object.assign(o,d); changed=true; } NET.snap.kv.set(id,j); NET.revs.kv.set(id,rev); } continue; }
    const arr = COLLS[c]; if(!arr) continue;
    const m = idx[c] || (idx[c] = new Map(arr.map(r=>[keyOf(r), r])));
    const cur = m.get(id);
    if(d==null){ if(cur){ arr.splice(arr.indexOf(cur),1); m.delete(id); changed=true; } NET.snap[c].delete(id); NET.revs[c].delete(id); continue; }
    normDoc(c, d); const j = JSON.stringify(d);
    NET.revs[c].set(id, rev);
    if(cur){
      const local = JSON.stringify(cur);
      const touched = !force && local!==(sent && sent.has(c+'/'+id)? sent.get(c+'/'+id) : NET.snap[c].get(id));
      if(!touched && local!==j){ Object.keys(cur).forEach(k=>delete cur[k]); Object.assign(cur, d); changed=true; }
    } else { arr.push(d); m.set(id, d); changed=true; }
    NET.snap[c].set(id, j);
  }
  if(changed) reindex();
  return changed;
}

/* Envoie ce qui a changé ici, reçoit ce qui a changé ailleurs. */
async function syncNow(){
  if(!S.uid) return;
  if(NET.busy){ NET.again=true; return; }
  NET.busy=true;
  try{
    const up=[], del=[], sent=new Map();
    for(const [c, arr] of Object.entries(COLLS)){
      const seen = new Set();
      for(const r of arr){
        if(r.id==null && !r._id) r._id = uid();
        const id=keyOf(r), j=JSON.stringify(r); seen.add(id);
        if(NET.snap[c].get(id)!==j){ up.push({c, id, d:r, base:NET.revs[c].get(id)||0}); sent.set(c+'/'+id, j); }
      }
      for(const id of NET.snap[c].keys()) if(!seen.has(id)) del.push({c, id});
    }
    for(const [id, o] of Object.entries(KV)){ const j=JSON.stringify(o); if(NET.snap.kv.get(id)!==j){ up.push({c:'kv', id, d:o, base:NET.revs.kv.get(id)||0}); sent.set('kv/'+id, j); } }
    // garde-fou : une suppression massive est presque toujours un bug d'affichage, pas une intention
    if(del.length>200){ console.warn('PackLik : '+del.length+' suppressions ignorées'); del.length=0; }
    let rejected = [], remote = false;
    for(let i=0; i===0 || i<up.length; i+=300){
      const res = await api('sync', {since:NET.rev, up:up.slice(i,i+300), del: i===0? del : []});
      remote = applyDocs(res.changes, sent) || remote;
      if(res.rejected.length){ applyDocs(res.rejected, null, true); rejected = rejected.concat(res.rejected); remote = true; }
      NET.rev = res.rev;
    }
    if(rejected.some(r=>!NET.quiet.has(r[0]+'/'+r[1]))) toast(t('Une modification n\'a pas été enregistrée : droits insuffisants ou élément modifié par un autre poste.'),'bad');
    NET.quiet.clear();
    if(NET.offline){ NET.offline=false; toast(t('Connexion rétablie'),'ok'); }
    if(remote){ autoAssign(); softRender(); }
  }catch(e){
    if(e.status===401 || e.status===403){ location.reload(); return; }
    if(!NET.offline){ NET.offline=true; toast(t('Hors ligne : vos modifications seront envoyées au retour de la connexion.'),'bad'); }
  }finally{
    NET.busy=false;
    if(NET.again){ NET.again=false; queueSync(); }
  }
}
let syncTimer; function queueSync(){ clearTimeout(syncTimer); syncTimer=setTimeout(syncNow, 400); }
function softRender(){ const ae=document.activeElement; if(S.modal || (ae && /INPUT|SELECT|TEXTAREA/.test(ae.tagName))) NET.pendingRender=true; else { NET.pendingRender=false; render(); } }

/* Nouvelles commandes sans agent : la répartition (règles de app.js) tourne sur les postes d'encadrement. */
function autoAssign(){
  if(!['admin','manager','gerant'].includes(S.role)) return;
  let n=0;
  ORDERS.filter(o=>o.status==='new' && !o.agentId && !o.assignTried).forEach(o=>{
    const a = assignAgent(o); o.assignTried = true; if(a.id) o.agentId = a.id;
    o.history.push({at:Date.now(), who:'Système', action: a.id? 'Assignée à '+UBY[a.id].name.split(' ')[0] : 'Placée dans la file commune', note:a.why, color:''});
    NET.quiet.add('orders/'+o.id); NET.quiet.add('kv/settings'); n++;
  });
  if(n) queueSync();
}

/* ---------- panier gardé sur l'appareil ---------- */
function saveCart(){ try{ localStorage.setItem('pk_cart', JSON.stringify(S.cart)); }catch(e){} }
function loadCart(){
  try{ S.cart = (JSON.parse(localStorage.getItem('pk_cart'))||[]).filter(i=>PBY[i.pid] && canOrder(PBY[i.pid])).map(i=>({pid:i.pid, v:i.v||null, q:Math.max(1,+i.q||1), price:unitPrice(PBY[i.pid], i.v, +i.q||1), cost:0})); }catch(e){ S.cart=[]; }
}
/* Prix unitaire : variante, sinon prix de base avec paliers par quantité (même règle que le serveur). */
function unitPrice(p, v, q){
  if(v && p.variants){ const x=p.variants.find(y=>y.id===v); if(x) return x.price; }
  let price = p.price; (p.tiers||[]).forEach(tr=>{ if(q>=tr.min && tr.price>0) price=Math.min(price, tr.price); });
  return price;
}

/* ---------- écrans : installation, connexion, initialisation ---------- */
function authCard(title, sub, fields, btn, formName, extra){
  return `<div style="min-height:100vh;display:grid;place-items:center;padding:20px;background:var(--bg)"><form class="card card-b col" data-sub="${formName}" style="width:min(420px,100%);gap:14px" novalidate>
    <div class="row" style="gap:10px"><span style="width:38px;height:38px;border-radius:10px;background:var(--ink);color:#fff;display:grid;place-items:center">${logoMark()}</span><div><h1 style="font-size:19px">${title}</h1><div class="small muted">${sub}</div></div></div>
    ${fields.map(([id,label,type,ac])=>`<div class="field"><label for="${id}">${label}</label><input class="input" id="${id}" type="${type}" autocomplete="${ac}" required></div>`).join('')}
    <button class="btn primary lg block" type="submit">${btn}</button>${extra||''}
    <a class="small" href="#/" style="text-align:center">${t('Retour à la boutique')}</a></form></div>`;
}
function viewLogin(){ return authCard('PackLik ERP', t('Connectez-vous pour continuer'), [['lgE',t('E-mail'),'email','username'],['lgP',t('Mot de passe'),'password','current-password']], t('Se connecter'), 'login'); }
function viewSetup(){ return authCard(t('Installation de PackLik'), t('Créez le compte administrateur'), [['suN',t('Nom complet'),'text','name'],['suE',t('E-mail'),'email','username'],['suP',t('Mot de passe (8 caractères minimum)'),'password','new-password']], t('Créer le compte'), 'setup'); }
function viewInit(){
  return `<div style="min-height:100vh;display:grid;place-items:center;padding:20px;background:var(--bg)"><div class="card card-b col" style="width:min(560px,100%);gap:14px">
    <h1 style="font-size:19px">${t('Première ouverture : que voulez-vous charger ?')}</h1>
    <button class="card card-b" data-a="initLoad" data-v="clean" style="text-align:start;cursor:pointer"><b>${t('Démarrer avec le vrai catalogue')}</b><div class="small muted">${t('91 produits PackLik, 69 wilayas, aucune commande. Stocks et prix d\'achat à saisir.')}</div></button>
    <button class="card card-b" data-a="initLoad" data-v="demo" style="text-align:start;cursor:pointer"><b>${t('Charger la démonstration')}</b><div class="small muted">${t('Catalogue + commandes, clients, équipe et finances FICTIFS, pour découvrir l\'ERP. À ne pas utiliser en production.')}</div></button>
  </div></div>`;
}
SUB.login = async()=>{ try{ await api('login', {email:val('lgE'), password:val('lgP')}); location.reload(); }catch(e){ toast(esc(e.message),'bad'); } };
SUB.setup = async()=>{ try{ await api('setup', {name:val('suN'), email:val('suE'), password:val('suP')}); location.reload(); }catch(e){ toast(esc(e.message),'bad'); } };
A.logout = async()=>{ try{ await api('logout', {}); }catch(e){} location.hash='#/'; location.reload(); };
A.initLoad = async(el)=>{
  const demo = el.dataset.v==='demo'; el.closest('.card').style.opacity=.5;
  const take = c => clone(DEMO[c]);
  WILAYAS.push(...take('wilayas'));
  PRODUCTS.push(...take('products').map(p=> demo? p : {...p, cost:0, stock:0, onDemand:true, sold30:0, lastSale:null, priceHistory:[], status:p.price? 'actif':'devis', variants:p.variants? p.variants.map(v=>({...v, cost:0, stock:0})):null}));
  CASHBOXES.push(...take('cashboxes').map(b=> demo? b : {...b, balance:0}));
  const dhd = take('carriers').find(c=>c.id==='dhd'), own = take('carriers').find(c=>c.id==='own');
  delete dhd.apiKey; delete dhd.apiUrl; delete dhd.lastSync; delete dhd.status; dhd.name='DHD Livraison'; dhd.family='ecotrack'; dhd.logo='dhd.png'; dhd.creds={};
  CARRIERS.push(dhd, {...own, connected:demo});
  if(demo){
    ['orders','customers','teams','suppliers','purchases','sup_payments','dhd_payments','cash_moves','advances','expenses','ad_spend','stock_moves','couriers'].forEach(c=>COLLS[c].push(...take(c)));
    USERS.push(...take('users').filter(u=>u.id!==S.uid).map(u=>({...u, email:'', online:u.role==='agent'})));
    PIXELS.push(...take('pixels').map(p=>({...p, token:'', active:false})));
  } else {
    TEAMS.push({id:1, name:'Équipe confirmation', managerId:null});
    SUPPLIERS.push({id:1, name:'Fournisseur principal', contact:'', phone:'', email:'', address:'', terms:7, termsMax:10, ceiling:null, userId:null});
    Object.assign(SETTINGS, {rules:[], carrierRules:[]});
  }
  Object.assign(SETTINGS, {dhdApiKey:'', waKey:'', pixelId:'', capiToken:''});
  reindex(); NET.needInit=false;
  await syncNow(); location.hash='#/erp'; render();
  toast(demo? t('Démonstration chargée (données fictives)') : t('Catalogue chargé'),'ok');
};

/* ---------- équipe : le mot de passe saisi dans la fiche membre est enregistré côté serveur ---------- */
const _memberSave = A.memberSave;
A.memberSave = async(el)=>{
  const pw = val('muW'), id = +el.dataset.id || Math.max(0, ...USERS.map(u=>u.id))+1, email = val('muE').trim();
  if(pw && pw.length<8){ toast(t('Mot de passe : 8 caractères minimum'),'bad'); return; }
  if(pw && !email){ toast(t('E-mail requis pour se connecter'),'bad'); return; }
  const before = USERS.length; _memberSave(el);
  if(USERS.length>before){ const u=USERS[USERS.length-1]; delete UBY[u.id]; u.id=id; UBY[id]=u; if(val('muR')==='fournisseur') u.supplierId=1; }
  if(pw){ await syncNow(); try{ await api('password', {uid:id, password:pw}); toast(t('Mot de passe enregistré'),'ok'); }catch(e){ toast(esc(e.message),'bad'); } }
};

/* ---------- garde d'accès + démarrage ---------- */
const _render = render;
render = function(){
  const {parts} = route();
  if(parts[0]==='erp' && (!S.uid || NET.needInit)){
    document.title = 'PackLik ERP';
    document.getElementById('app').innerHTML = NET.needSetup? viewSetup() : !S.uid? viewLogin() : viewInit();
    document.getElementById('ov').innerHTML = ''; return;
  }
  _render();
};
async function bootApp(){
  let b;
  try{ b = await api('boot'); }
  catch(e){ document.getElementById('app').innerHTML = `<div class="empty" style="padding:80px 20px"><b>${esc(e.message)}</b><div class="small">Vérifiez la configuration du serveur (PHP, base de données) puis rechargez.</div></div>`; return; }
  NET.csrf=b.csrf; NET.rev=b.rev; NET.needSetup=b.needSetup;
  const list=[]; Object.entries(b.data).forEach(([c,rows])=>rows.forEach(([id,rev,d])=>list.push([c,id,rev,d])));
  applyDocs(list, null, true); reindex();
  if(b.user){ S.uid=b.user.id; S.role=b.user.role; S.agentId=b.user.id; NET.needInit = b.empty && b.user.role==='admin'; }
  loadCart(); autoAssign(); render();
  // toute action de l'utilisateur déclenche l'envoi de ce qu'elle a modifié
  ['click','change','submit','drop'].forEach(ev=>document.addEventListener(ev, ()=>{ saveCart(); queueSync(); }));
  document.addEventListener('input', ()=>queueSync());
  document.addEventListener('focusout', ()=>{ if(NET.pendingRender) setTimeout(softRender, 50); });
  setInterval(()=>{ if(document.visibilityState==='visible') syncNow(); }, 10000);
}
