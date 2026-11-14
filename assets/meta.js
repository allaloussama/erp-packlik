"use strict";
/* ============================================================
   Coût Meta — copie du module Kando : comptes Facebook, comptes publicitaires,
   campagnes (dépense + résultats) reliées aux produits, et pour chaque produit
   coût par résultat, coût par commande confirmée et coût par commande livrée.
   Les campagnes sont lues dans l'API Marketing de Meta (graph.facebook.com),
   directement depuis le navigateur de l'admin ; le jeton est gardé côté serveur,
   lisible par l'admin seul.
   ============================================================ */
const GRAPH = 'https://graph.facebook.com/v21.0';
const META_COLS = [['product','Produit'],['spend','Montant dépensé'],['results','Résultat'],['costPerResult','Coût/résultat'],['costConfirm','Coût confirmation'],['costDelivered','Coût livré']];
const CUR_SUFFIX = {DZD:'DA', USD:'$', EUR:'€'};
const RESULT_ACTIONS = new Set(['purchase','onsite_conversion.purchase','offsite_conversion.fb_pixel_purchase','lead','onsite_conversion.lead_grouped']);
S.ui.mt = {syncing:null, msg:{}, open:{}, cols:false, token:'', loading:false};

/* retour de la connexion Facebook : le jeton arrive dans l'adresse (#access_token=…) */
(function(){
  const h=location.hash;
  if(h.includes('access_token=')){
    const p=new URLSearchParams(h.replace(/^#\/?/,''));
    let ok=false; try{ ok = p.get('state') && p.get('state')===sessionStorage.getItem('pk_meta_state'); }catch(e){}
    if(ok) try{ sessionStorage.setItem('pk_meta_tok', p.get('access_token')); }catch(e){}
    history.replaceState(null, '', location.pathname + '#/erp/meta');
  } else if(/[#&]error=/.test(h) && h.includes('state=')) history.replaceState(null, '', location.pathname + '#/erp/meta');
})();

const mAccounts = () => META.accounts || [];
async function graphGet(path, params, token){
  const p = new URLSearchParams({...params, access_token:token});
  let r; try{ r = await fetch(`${GRAPH}/${path}?${p}`); }catch(e){ throw new Error(t('Connexion à Meta impossible')); }
  const j = await r.json().catch(()=>({}));
  if(!r.ok || j.error) throw new Error((j.error && j.error.message) || 'Meta API '+r.status);
  return j;
}
const sumResults = acts => (acts||[]).filter(a=>RESULT_ACTIONS.has(a.action_type)).reduce((s,a)=>s+(+a.value||0),0);
function metaSinceAll(){ const d=new Date(); d.setMonth(d.getMonth()-36); return d.toISOString().slice(0,10); }
const actId = id => String(id).startsWith('act_')? id : 'act_'+String(id).replace(/\D/g,'');
async function fetchAdAccounts(token){ const j=await graphGet('me/adaccounts', {fields:'name,account_id,currency', limit:'100'}, token); return (j.data||[]).map(a=>({id:a.id, accountId:a.account_id, name:a.name, currency:a.currency})); }
async function fetchInsights(ad, token, since, until){
  const j=await graphGet(actId(ad)+'/insights', {level:'account', fields:'spend,actions', time_range:JSON.stringify({since, until}), time_increment:'monthly', limit:'500'}, token);
  return (j.data||[]).map(r=>({month:(r.date_start||'').slice(0,7), spend:r.spend||'0', results:String(sumResults(r.actions))}));
}
async function fetchCampaignInsights(ad, token, since, until){
  const j=await graphGet(actId(ad)+'/insights', {level:'campaign', fields:'campaign_name,spend,impressions,clicks,ctr,cpc,cpm,actions', time_range:JSON.stringify({since, until}), limit:'500'}, token);
  const rows=(j.data||[]).map(r=>({campaign:r.campaign_name||'—', spend:r.spend||'0', results:String(sumResults(r.actions)), impressions:r.impressions||'0', clicks:r.clicks||'0', ctr:r.ctr||'0', cpc:r.cpc||'0', cpm:r.cpm||'0'}));
  // les campagnes sans dépense sur la période (en pause, pas commencées…) : listées aussi, pour les relier d'avance
  const list = await graphGet(actId(ad)+'/campaigns', {fields:'name,effective_status', limit:'500'}, token).catch(()=>({data:[]}));
  const st=new Map((list.data||[]).map(c=>[c.name||'', c.effective_status||'']));
  rows.forEach(r=>r.status=st.get(r.campaign)||undefined);
  const seen=new Set(rows.map(r=>r.campaign));
  (list.data||[]).forEach(c=>{ if(c.name && !seen.has(c.name)){ seen.add(c.name); rows.push({campaign:c.name, status:c.effective_status, spend:'0', results:'0'}); } });
  return rows.sort((a,b)=>(+b.spend)-(+a.spend));
}

/* quel produit une campagne annonce-t-elle : choix manuel, sinon rapprochement par le nom */
const mNorm = s => String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9؀-ۿ]+/g,' ').trim();
function matchProduct(name){
  const n=mNorm(name), nt=new Set(n.split(' ').filter(w=>w.length>1)); let best=null, score=0;
  for(const p of PRODUCTS){ const pn=mNorm(p.name); if(!pn) continue; if(n.includes(pn)) return p; const pt=pn.split(' ').filter(w=>w.length>1); if(!pt.length) continue; const sc=pt.filter(w=>nt.has(w)).length/pt.length; if(sc>score){ score=sc; best=p; } }
  return score>=0.6? best : null;
}
function campaignProductId(accId, campaign){ const ov=(META.campaignMap||{})[accId+'::'+campaign]; if(ov!==undefined) return ov; const a=matchProduct(campaign); return a? String(a.id) : ''; }

/* devises : tout est calculé en DA puis affiché dans la devise choisie */
const dispCur = () => META.dispCur || 'DZD';
function rateDZD(c){ return c==='DZD'? 1 : +((META.dispRates||{})[c]||0); }
function conv(amount, from){ const f=(from||'DZD').toUpperCase(), to=dispCur(); if(f===to) return amount; const a=rateDZD(f); if(!a) return null; if(to==='DZD') return amount*a; const b=rateDZD(to); return b? amount*a/b : null; }
const mFmt = v => v===null? t('⚠ taux à saisir') : `${nf(Math.round(v))} ${CUR_SUFFIX[dispCur()]}`;
function needRates(){ const need=new Set(); mAccounts().forEach(a=>(a.adAccounts||[]).forEach(ad=>{ const f=(ad.currency||'DZD').toUpperCase(); if(f!==dispCur() && f!=='DZD') need.add(f); })); if(dispCur()!=='DZD') need.add(dispCur()); return [...need]; }

function clientRows(acc){
  const ids=new Set(); (acc.adAccounts||[]).forEach(ad=>(ad.campaigns||[]).forEach(c=>{ const pid=campaignProductId(acc.id, c.campaign); if(pid) ids.add(+pid); }));
  const stores=new Set((acc.adAccounts||[]).map(ad=>ad.store||'').filter(Boolean));
  return PRODUCTS.filter(p=>ids.has(p.id)).map(p=>{
    let spend=0, results=0;
    (acc.adAccounts||[]).forEach(ad=>(ad.campaigns||[]).forEach(c=>{ if(campaignProductId(acc.id, c.campaign)===String(p.id)){ const v=conv(+c.spend||0, ad.currency); spend = spend===null||v===null? null : spend+v; results += +c.results||0; } }));
    const orders = ORDERS.filter(o=>o.items.some(i=>i.pid===p.id) && (!stores.size || stores.has(storeOf(o))));
    const confirmed = orders.filter(o=>CONFIRMED_ST.includes(o.status)).length, delivered = orders.filter(o=>DELIVERED_ST.includes(o.status)).length;
    const sp=spend||0;
    return {p, spend, results, cpr: results? sp/results : 0, confirmed, delivered, costConfirm: confirmed? sp/confirmed : 0, costDelivered: delivered? sp/delivered : 0};
  });
}
function metaCols(){ const saved=META.cols; const ids=Array.isArray(saved)? saved.filter(id=>META_COLS.some(c=>c[0]===id)) : META_COLS.map(c=>c[0]); return ids.includes('product')? ids : ['product', ...ids]; }
const metaColLabel = id => ((META.colLabels||{})[id]) || t((META_COLS.find(c=>c[0]===id)||[0,id])[1]);

function viewMeta(){
  const m=S.ui.mt, accs=mAccounts(), cols=metaCols();
  const tok = (()=>{ try{ return sessionStorage.getItem('pk_meta_tok'); }catch(e){ return null; } })();
  if(tok){ try{ sessionStorage.removeItem('pk_meta_tok'); }catch(e){} setTimeout(()=>mAddToken(tok), 0); }
  let tSpend=0, tRes=0, tConf=0, tDel=0; accs.forEach(a=>clientRows(a).forEach(r=>{ tSpend = tSpend===null||r.spend===null? null : tSpend+r.spend; tRes+=r.results; tConf+=r.confirmed; tDel+=r.delivered; }));
  const kpis=[['Montant dépensé', mFmt(tSpend), 'wallet'], ['Résultats', nf(tRes), 'target'], ['Coût/résultat moyen', tSpend===null? mFmt(null) : mFmt(tRes? tSpend/tRes : 0), 'chart'], ['Coût confirmation moyen', tSpend===null? mFmt(null) : mFmt(tConf? tSpend/tConf : 0), 'cash'], ['Coût livré moyen', tSpend===null? mFmt(null) : mFmt(tDel? tSpend/tDel : 0), 'truck']];
  const header = `<div class="row between wrap" style="gap:10px"><p class="small muted" style="margin:0">${t('Coût final par commande à partir des publicités Meta')}</p><div class="row wrap" style="gap:8px">
    <div class="mcur">${['DZD','USD','EUR'].map(c=>`<button class="${dispCur()===c?'on':''}" data-a="mCur" data-v="${c}">${c}</button>`).join('')}${needRates().map(c=>`<span class="xs muted">1 ${c} = <input class="input num" type="number" dir="ltr" style="width:80px;height:28px" value="${esc((META.dispRates||{})[c]||'')}" placeholder="245" data-ch="mRate" data-v="${c}"> DA</span>`).join('')}</div>
    <div class="kpopwrap"><button class="btn" data-a="mCols">${ic('sliders','sm')} ${t('Colonnes')}</button>${m.cols? `<div class="kpop kcolpanel"><b class="xs muted" style="display:block;padding:4px 6px">${t('Colonnes visibles et ordre')}</b>${cols.map((id,i)=>`<div class="kcolrow"><input type="checkbox" checked ${id==='product'?'disabled':''} data-ch="mColOff" data-v="${id}"><input class="kcolname" value="${esc(metaColLabel(id))}" data-ch="mColName" data-v="${id}"><button class="kico" data-a="mColMove" data-v="${id}" data-d="-1" ${i===0?'disabled':''}>${ic('arrowU','sm')}</button><button class="kico" data-a="mColMove" data-v="${id}" data-d="1" ${i===cols.length-1?'disabled':''}>${ic('arrowD','sm')}</button></div>`).join('')}${META_COLS.filter(c=>!cols.includes(c[0])).map(c=>`<div class="kcolrow" style="opacity:.55"><input type="checkbox" data-ch="mColOn" data-v="${c[0]}"><span class="grow small">${t(c[1])}</span></div>`).join('')}<div class="row between" style="padding:6px"><button class="btn sm ghost" data-a="mColReset">${t('Réinitialiser')}</button><button class="btn sm green" data-a="mCols">${t('Enregistrer')}</button></div></div>`:''}</div>
  </div></div>`;
  const kpiRow = `<div class="mkpis">${kpis.map(([l,v,i])=>`<div class="card card-b mkpi"><div class="row between"><span class="xs muted" style="font-weight:600">${t(l)}</span><span class="mki">${ic(i,'sm')}</span></div><div class="num" style="font-size:20px;font-weight:800;margin-top:6px">${v}</div></div>`).join('')}</div>`;
  const addBar = `<div class="row wrap" style="gap:8px"><button class="btn mfb" data-a="mAdd">${ic('plus','sm')} ${t('Ajouter un compte Facebook')}</button><input class="input" style="width:240px;height:36px" placeholder="${t('Jeton d\'accès Meta…')}" value="${esc(m.token)}" data-in="mTok"><button class="btn mfbo" data-a="mTokOk" ${m.loading?'disabled':''}>${m.loading? '…' : 'OK'}</button>${m.msg._g? `<span class="xs" style="color:var(--red)">${esc(m.msg._g)}</span>`:''}</div>`;
  const cards = !accs.length? `<div class="card card-b"><div class="row" style="gap:10px;border-bottom:1px solid var(--line2);padding-bottom:12px"><span class="mfbic">${ic('globe','sm')}</span><b>${t('Comptes Meta Ads')}</b></div><div class="mempty"><p class="small muted">${t('Aucun compte Facebook connecté pour l\'instant.')}</p></div>${addBar}</div>` :
    accs.map(acc=>{
      const rows=clientRows(acc), cur=[...new Set((acc.adAccounts||[]).map(ad=>(ad.currency||'DZD').toUpperCase()))].join(' · ')||'DZD';
      let total=0; (acc.adAccounts||[]).forEach(ad=>{ const v=conv((ad.insights||[]).reduce((s,i)=>s+(+i.spend||0),0), ad.currency); total = total===null||v===null? null : total+v; });
      const open=!!m.open[acc.id];
      const cell=(r,id)=>{ const ok=r.spend!==null, miss=`<span class="muted">${ok?'—':mFmt(null)}</span>`; switch(id){
        case 'product': return `<td><b>${esc(r.p.name)}</b></td>`;
        case 'spend': return `<td class="r num">${ok? `<b>${mFmt(r.spend)}</b>` : miss}</td>`;
        case 'results': return `<td class="r num">${nf(r.results)}</td>`;
        case 'costPerResult': return `<td class="r num">${r.results&&ok? mFmt(r.cpr) : miss}</td>`;
        case 'costConfirm': return `<td class="r num">${r.confirmed&&ok? mFmt(r.costConfirm) : miss}</td>`;
        case 'costDelivered': return `<td class="r num">${r.delivered&&ok? `<b style="color:var(--green);font-size:15px">${mFmt(r.costDelivered)}</b>` : miss}</td>`; } return ''; };
      return `<div class="card mcard"><div class="mch"><div class="row" style="gap:10px"><span class="mfbic round">${ic('globe','sm')}</span><div><div class="row" style="gap:6px"><b>${esc(acc.name)}</b><span class="badge ${cur==='DZD'?'':'amber'}">${esc(cur)}</span></div><div class="xs muted">${t('Montant dépensé')} : <b style="color:var(--ink)">${mFmt(total)}</b></div></div></div>
        <div class="row" style="gap:6px"><button class="btn sm mfbo" data-a="mSyncAll" data-id="${esc(acc.id)}" ${m.syncing?'disabled':''}>${ic('refresh','sm')} ${t('Synchroniser les campagnes')}</button><button class="kico red" data-a="mDel" data-id="${esc(acc.id)}" aria-label="${t('Supprimer')}">${ic('trash','sm')}</button></div></div>
        <div class="card-b col" style="gap:14px">
          ${rows.length? `<div class="tbl-wrap" style="border:1px solid var(--line);border-radius:10px"><table class="tbl"><thead><tr>${cols.map(id=>`<th class="${id==='product'?'':'r'}" ${id==='costDelivered'?'style="color:var(--green)"':''}>${esc(metaColLabel(id))}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(id=>cell(r,id)).join('')}</tr>`).join('')}</tbody></table></div>` : `<div class="mempty"><p class="small muted">${t('Aucun produit lié aux campagnes de ce compte.')}</p></div>`}
          <div class="madbox"><button class="madh" data-a="mOpen" data-id="${esc(acc.id)}"><span class="xs" style="font-weight:700;color:var(--ink2)">${t('Connexion Meta Ads')} · ${(acc.adAccounts||[]).length} ${t('compte(s)')}</span>${ic(open?'chevD':'chevR','sm')}</button>
          ${open? `<div class="col" style="gap:8px;padding:10px;border-top:1px solid var(--line2)">${(acc.adAccounts||[]).map(ad=>{ const sp=(ad.insights||[]).reduce((s,i)=>s+(+i.spend||0),0), res=(ad.campaigns||[]).reduce((s,c)=>s+(+c.results||0),0), msg=m.msg[ad.id]; return `<div class="madacc">
            <div class="row between wrap" style="gap:8px;align-items:flex-end"><div><b class="xs">${esc(ad.name)}</b><div class="xs muted">${t('Montant dépensé')} : <b title="${nf(Math.round(sp))} ${esc(ad.currency||'')}">${mFmt(conv(sp, ad.currency))}</b> · ${t('Résultats')} : <b>${res}</b></div></div>
              <div class="row wrap" style="gap:6px;align-items:flex-end"><label class="xs muted">${t('Boutique')}<select class="select" style="height:30px" data-ch="mAd" data-f="store" data-acc="${esc(acc.id)}" data-ad="${esc(ad.id)}"><option value="">${t('Choisir la boutique')}</option><option value="PackLik" ${ad.store==='PackLik'?'selected':''}>PackLik</option></select></label><label class="xs muted">${t('De')}<input class="input" type="date" style="height:30px" value="${esc(ad.from||'')}" data-ch="mAd" data-f="from" data-acc="${esc(acc.id)}" data-ad="${esc(ad.id)}"></label><label class="xs muted">${t('À')}<input class="input" type="date" style="height:30px" value="${esc(ad.to||'')}" data-ch="mAd" data-f="to" data-acc="${esc(acc.id)}" data-ad="${esc(ad.id)}"></label><button class="btn sm mfbo" data-a="mSync" data-acc="${esc(acc.id)}" data-ad="${esc(ad.id)}" ${m.syncing===ad.id?'disabled':''}>${ic('refresh','sm')} ${t('Synchroniser depuis Meta')}</button></div></div>
            ${msg? `<p class="xs" style="margin:4px 0 0;color:${msg.ok?'var(--green)':'var(--red)'}">${esc(msg.text)}</p>`:''}
            ${(ad.campaigns||[]).length? `<p class="xs muted" style="margin:8px 0 4px">${t('Assigne chaque campagne à son produit — sa dépense et ses résultats iront sur ce produit')}</p><div class="tbl-wrap" style="border:1px solid var(--line2);border-radius:8px"><table class="tbl" style="font-size:12px"><thead><tr><th>${t('Campagne')}</th><th class="r">${t('Montant dépensé')} (${CUR_SUFFIX[dispCur()]})</th><th class="r">${t('Résultats')}</th><th class="r">${t('Produit')}</th></tr></thead><tbody>${ad.campaigns.map((c,i)=>{ const key=acc.id+'::'+c.campaign, ov=(META.campaignMap||{})[key], auto=matchProduct(c.campaign); return `<tr><td class="trunc" style="max-width:220px" title="${esc(c.campaign)}">${esc(c.campaign)}${c.status&&c.status!=='ACTIVE'? ` <span class="badge" style="font-size:9px">${/PAUSED/.test(c.status)? t('en pause') : esc(c.status.toLowerCase())}</span>`:''}</td><td class="r num" title="${nf(Math.round(+c.spend||0))} ${esc(ad.currency||'')}">${mFmt(conv(+c.spend||0, ad.currency))}</td><td class="r num">${esc(c.results)}</td><td class="r"><select class="select" style="height:28px;max-width:170px;font-size:11px" data-ch="mMap" data-acc="${esc(acc.id)}" data-c="${i}" data-ad="${esc(ad.id)}"><option value="auto" ${ov===undefined?'selected':''}>${t('Auto (nom)')} — ${auto? esc(auto.name) : t('Non lié au catalogue')}</option><option value="" ${ov===''?'selected':''}>${t('Ignorer')}</option>${PRODUCTS.map(p=>`<option value="${p.id}" ${ov===String(p.id)?'selected':''}>${esc(p.name)}</option>`).join('')}</select></td></tr>`; }).join('')}</tbody></table></div>`:''}
          </div>`; }).join('')}</div>`:''}</div>
        </div></div>`;
    }).join('') + addBar;
  return erpShell('meta', t('Coût Meta'), '', `<div class="col" style="gap:18px">${header}${kpiRow}${cards}</div>`);
}
ERP_VIEWS.admin.meta = viewMeta;
(MENUS.admin.find(g=>g[0]==='Finance')||MENUS.admin[0])[1].push(['meta','target','Coût Meta']);

/* ---------- actions ---------- */
A.mCur = el=>{ META.dispCur=el.dataset.v; render(); };
CH.mRate = el=>{ META.dispRates={...(META.dispRates||{}), [el.dataset.v]:el.value}; render(); };
A.mCols = ()=>{ S.ui.mt.cols=!S.ui.mt.cols; render(); };
CH.mColOff = el=>{ META.cols=metaCols().filter(id=>id!==el.dataset.v); render(); };
CH.mColOn = el=>{ META.cols=[...metaCols(), el.dataset.v]; render(); };
CH.mColName = el=>{ META.colLabels={...(META.colLabels||{}), [el.dataset.v]:el.value.trim()}; if(!el.value.trim()) delete META.colLabels[el.dataset.v]; render(); };
A.mColMove = el=>{ const c=metaCols(), i=c.indexOf(el.dataset.v), j=i+(+el.dataset.d); if(j<0||j>=c.length) return; [c[i],c[j]]=[c[j],c[i]]; META.cols=c; render(); };
A.mColReset = ()=>{ META.cols=META_COLS.map(c=>c[0]); META.colLabels={}; render(); };
A.mOpen = el=>{ S.ui.mt.open[el.dataset.id]=!S.ui.mt.open[el.dataset.id]; render(); };
IN.mTok = el=>{ S.ui.mt.token=el.value; };
A.mTokOk = ()=>mAddToken(S.ui.mt.token.trim());
async function mAddToken(tok){
  const m=S.ui.mt; if(!tok) return; m.loading=true; m.msg._g=''; render();
  try{
    const me_ = await graphGet('me', {fields:'id,name'}, tok), ads = await fetchAdAccounts(tok);
    META.accounts = mAccounts().filter(a=>a.id!==me_.id).concat({id:me_.id, name:me_.name||'Facebook', token:tok, refreshedAt:new Date().toISOString(), adAccounts:ads});
    m.token=''; m.open[me_.id]=true; toast(t('Compte Facebook ajouté')+' : '+esc(me_.name||''),'ok');
    queueSync(); mSyncAccount(META.accounts[META.accounts.length-1]);
  }catch(e){ m.msg._g=e.message; }
  m.loading=false; render();
}
A.mAdd = ()=>{
  if(!META.appId){
    openModal(modalTpl(t('Ajouter un compte Facebook'), `<p class="small" style="margin-top:0">${t('Pour se connecter avec Facebook, créez une application Meta (type Entreprise, produit « Connexion Facebook »), ajoutez cette adresse dans les URI de redirection OAuth valides, puis collez son identifiant ici.')}</p><div class="sumbox xs" dir="ltr" style="word-break:break-all">${esc(location.origin+location.pathname)}</div><div class="field" style="margin-top:10px"><label>${t('App ID')}<input class="input" id="mAppId" dir="ltr" inputmode="numeric"></label></div><p class="xs muted">${t('Sans application, collez directement un jeton d\'accès (droit ads_read) dans le champ « Jeton d\'accès Meta ».')}</p>`, `<button class="btn" data-a="closeModal">${t('Annuler')}</button><button class="btn mfb" data-a="mAppSave">${t('Enregistrer et se connecter')}</button>`));
    return;
  }
  mLogin();
};
A.mAppSave = ()=>{ const v=val('mAppId').replace(/\D/g,''); if(!v){ toast(t('App ID requis'),'bad'); return; } META.appId=v; closeModal(); syncNow().then(mLogin); };
function mLogin(){
  const state=Math.random().toString(36).slice(2); try{ sessionStorage.setItem('pk_meta_state', state); }catch(e){}
  location.href = 'https://www.facebook.com/v21.0/dialog/oauth?'+new URLSearchParams({client_id:META.appId, redirect_uri:location.origin+location.pathname, response_type:'token', scope:'ads_read', state});
}
A.mDel = el=>{ if(!confirm(t('Retirer ce compte Facebook ?'))) return; META.accounts=mAccounts().filter(a=>a.id!==el.dataset.id); render(); };
CH.mAd = el=>{ const acc=mAccounts().find(a=>a.id===el.dataset.acc), ad=acc && acc.adAccounts.find(x=>x.id===el.dataset.ad); if(ad){ ad[el.dataset.f]=el.value; render(); } };
CH.mMap = el=>{ const acc=mAccounts().find(a=>a.id===el.dataset.acc), ad=acc.adAccounts.find(x=>x.id===el.dataset.ad), c=ad.campaigns[+el.dataset.c], key=acc.id+'::'+c.campaign; META.campaignMap={...(META.campaignMap||{})}; if(el.value==='auto') delete META.campaignMap[key]; else META.campaignMap[key]=el.value; render(); };
async function mSyncAd(acc, ad, quiet){
  const m=S.ui.mt; m.syncing=ad.id; if(!quiet){ m.msg[ad.id]={ok:true, text:t('Synchronisation…')}; render(); }
  try{
    const since=ad.from||metaSinceAll(), until=ad.to||new Date().toISOString().slice(0,10);
    const [ins, camps] = await Promise.all([fetchInsights(ad.id, acc.token, since, until), fetchCampaignInsights(ad.id, acc.token, since, until)]);
    ad.insights=ins; ad.campaigns=camps; m.msg[ad.id]={ok:true, text:t('Synchronisé depuis Meta')}; queueSync();
  }catch(e){ if(!quiet) m.msg[ad.id]={ok:false, text:e.message}; }
  m.syncing=null; if(location.hash.startsWith('#/erp/meta')) render();
}
async function mSyncAccount(acc, quiet){ for(const ad of acc.adAccounts||[]) await mSyncAd(acc, ad, quiet); }
A.mSync = el=>{ const acc=mAccounts().find(a=>a.id===el.dataset.acc), ad=acc.adAccounts.find(x=>x.id===el.dataset.ad); mSyncAd(acc, ad); };
A.mSyncAll = el=>{ const acc=mAccounts().find(a=>a.id===el.dataset.id); S.ui.mt.open[acc.id]=true; mSyncAccount(acc); };
/* relecture automatique toutes les 3 minutes tant que la page est ouverte (Meta limite le nombre de lectures) */
setInterval(()=>{ if(S.role==='admin' && location.hash.startsWith('#/erp/meta') && document.visibilityState==='visible' && !S.ui.mt.syncing) mAccounts().forEach(a=>mSyncAccount(a, true)); }, 180000);
