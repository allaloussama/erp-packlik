"use strict";
/* ============================================================
   Factures et documents : facture, facture proforma, bon de livraison, décharge.
   Remplis automatiquement depuis la commande, numérotés à la suite, modifiables avant impression.
   Chaque document est rangé sur sa commande (o.docs) : mêmes droits que la commande.
   ============================================================ */
const DOC_TYPES = {
  facture:  {label:'Facture', prefix:'FAC', title:'FACTURE', prices:true},
  proforma: {label:'Facture proforma', prefix:'PRO', title:'FACTURE PROFORMA', prices:true},
  bl:       {label:'Bon de livraison', prefix:'BL', title:'BON DE LIVRAISON', prices:false},
  decharge: {label:'Décharge', prefix:'DEC', title:'DÉCHARGE', prices:false}
};
function docCo(){ return Object.assign({name:COMPANY.name, address:COMPANY.address, phone:COMPANY.phone1+' / '+COMPANY.phone2, email:COMPANY.email, site:COMPANY.site, nif:'', rc:'', nis:'', ai:'', rib:'', tva:0, color:'#FD6400', footer:'Merci pour votre confiance.', autoBl:true, autoFacture:true, validity:15}, SETTINGS.docs||{}); }

/* ---------- montant en lettres (français) ---------- */
function frWords(n){
  n=Math.floor(Math.abs(n)); if(!n) return 'zéro';
  const U=['','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'], D=['','dix','vingt','trente','quarante','cinquante','soixante','soixante','quatre-vingt','quatre-vingt'];
  const below100=x=>{ if(x<20) return U[x]; const d=Math.floor(x/10), u=x%10; if(d===7||d===9) return D[d]+(d===7&&u===1?'-et-':'-')+U[10+u]; return D[d]+(u===1&&d!==8?'-et-un':u?'-'+U[u]:(d===8?'s':'')); };
  const below1000=x=>{ const c=Math.floor(x/100), r=x%100; return (c? (c>1? U[c]+'-cent'+(r?'':'s') : 'cent')+(r?'-':'') : '')+(r? below100(r):''); };
  let out=[]; [[1e9,'milliard'],[1e6,'million'],[1e3,'mille']].forEach(([v,w])=>{ const q=Math.floor(n/v); if(q){ out.push(v===1e3? (q>1? below1000(q)+'-mille' : 'mille') : below1000(q)+'-'+w+(q>1?'s':'')); n%=v; } });
  if(n) out.push(below1000(n)); return out.join('-');
}
const cap = s => s.charAt(0).toUpperCase()+s.slice(1);

/* ---------- création et numérotation ---------- */
function docNext(type){ const y=new Date().getFullYear(), seq=SETTINGS.docSeq=SETTINGS.docSeq||{}, k=type+y; seq[k]=(seq[k]||0)+1; return DOC_TYPES[type].prefix+'-'+y+'-'+String(seq[k]).padStart(4,'0'); }
function docEnsure(o, type){ o.docs=o.docs||{}; if(!o.docs[type]){ o.docs[type]={no:docNext(type), at:Date.now(), by:me().name}; hist(o, DOC_TYPES[type].label+' créée', o.docs[type].no, 'blue'); } return o.docs[type]; }
/* automatique : bon de livraison à l'expédition, facture à la livraison */
const _setStatusDoc = setStatus;
setStatus = function(o, st, note){ const r=_setStatusDoc(o, st, note); const co=docCo(); if(st==='sent' && co.autoBl) docEnsure(o,'bl'); if(st==='delivered' && co.autoFacture) docEnsure(o,'facture'); return r; };

/* ---------- le document (A4) ---------- */
function docHtml(o, type){
  const D=DOC_TYPES[type], d=o.docs[type], co=docCo(), c=CBY[o.customerId]||{}, prices=D.prices;
  const lines=o.items.filter(i=>PBY[i.pid]).map(i=>{ const p=PBY[i.pid], v=i.v&&p.variants? (p.variants.find(x=>x.id===i.v)||{}).label : ''; return {sku:p.sku||'', name:p.name+(v?' ('+v+')':''), q:i.q, pu:i.price, tot:i.price*i.q, kg:(p.weight||0)*i.q/1000}; });
  const sub=orderSub(o), disc=discountAmt(o), fee=feeOf(o), ttc=orderTotal(o), tva=+co.tva||0, ht=Math.round(ttc/(1+tva/100)), tvaAmt=ttc-ht;
  const legal=[['NIF',co.nif],['RC',co.rc],['NIS',co.nis],['AI',co.ai]].filter(x=>x[1]).map(x=>`${x[0]} : ${esc(x[1])}`).join(' · ');
  const mono = s=>`<span style="font-variant-numeric:tabular-nums">${s}</span>`;
  const head = `<div class="doc-head"><div><img src="assets/brand/logo.png" alt="${esc(co.name)}" class="doc-logo"><div class="doc-co"><b>${esc(co.name)}</b><br>${esc(co.address)}<br>${esc(co.phone)}${co.email?' · '+esc(co.email):''}${co.site?' · '+esc(co.site):''}${legal?'<br>'+legal:''}</div></div>
    <div class="doc-title"><h1 style="color:${esc(co.color)}">${D.title}</h1><table><tr><td>N°</td><td><b>${esc(d.no)}</b></td></tr><tr><td>Date</td><td>${new Date(d.at).toLocaleDateString('fr-DZ')}</td></tr><tr><td>Commande</td><td>${esc(o.ref)}</td></tr>${type==='proforma'?`<tr><td>Validité</td><td>${co.validity} jours</td></tr>`:''}${o.tracking&&type!=='proforma'?`<tr><td>Suivi</td><td>${esc(o.tracking)}</td></tr>`:''}</table></div></div>`;
  const client = `<div class="doc-parties"><div class="doc-box"><small>${type==='decharge'?'Remis par':'Vendeur'}</small><b>${esc(co.name)}</b><br>${esc(co.address)}</div><div class="doc-box"><small>${type==='bl'||type==='decharge'?'Destinataire':'Client'}</small><b>${esc(c.name||'—')}</b><br>${esc(c.phone||'')}${c.phone2?' / '+esc(c.phone2):''}<br>${esc([o.address, cName(o.commune), wName(o.wilaya)].filter(Boolean).join(', '))}<br>${o.delivery==='desk'?'Livraison au bureau (stop desk)':'Livraison à domicile'} · ${esc(kCarrierName(carrierOf(o)))}</div></div>`;
  const table = `<table class="doc-tbl"><thead style="background:${esc(co.color)}"><tr><th>Réf.</th><th>Désignation</th><th class="r">Qté</th>${prices?'<th class="r">Prix unitaire</th><th class="r">Montant</th>':'<th class="r">Poids</th>'}</tr></thead><tbody>
    ${lines.map(l=>`<tr><td>${esc(l.sku)}</td><td>${esc(l.name)}</td><td class="r">${mono(l.q)}</td>${prices?`<td class="r">${mono(dzd(l.pu))}</td><td class="r">${mono(dzd(l.tot))}</td>`:`<td class="r">${mono(kg(l.kg))}</td>`}</tr>`).join('')}
    ${prices && fee? `<tr><td></td><td>Frais de livraison — ${esc(wName(o.wilaya))}</td><td class="r">1</td><td class="r">${mono(dzd(fee))}</td><td class="r">${mono(dzd(fee))}</td></tr>`:''}
  </tbody></table>`;
  const totals = prices? `<div class="doc-tot"><table>
    <tr><td>Sous-total produits</td><td class="r">${mono(dzd(sub))}</td></tr>${disc?`<tr><td>Remise</td><td class="r">${mono('− '+dzd(disc))}</td></tr>`:''}<tr><td>Livraison</td><td class="r">${mono(o.freeShip?'Gratuite':dzd(fee))}</td></tr>
    ${tva? `<tr><td>Total HT</td><td class="r">${mono(dzd(ht))}</td></tr><tr><td>TVA ${tva} %</td><td class="r">${mono(dzd(tvaAmt))}</td></tr>`:''}
    <tr class="grand" style="background:${esc(co.color)}"><td>${tva?'Total TTC':'Total à payer'}</td><td class="r">${mono(dzd(ttc))}</td></tr></table></div>
    <p class="doc-words">Arrêté${type==='facture'?'e la présente facture':' le présent document'} à la somme de : <b>${cap(frWords(ttc))} dinars algériens</b>.</p>`
    : `<p class="doc-words">Nombre de colis : <b>${parcelsOf(o).length}</b> · Poids total : <b>${kg(orderWeight(o))}</b>${type==='bl'?` · Montant à encaisser à la livraison : <b>${dzd(ttc)}</b>`:''}</p>`;
  const body = type==='decharge'
    ? `<div class="doc-text"><p>Je soussigné(e) <b>${esc(c.name||'……………………')}</b>, demeurant à ${esc([o.address, cName(o.commune), wName(o.wilaya)].filter(Boolean).join(', ')||'……………………')}, reconnais avoir reçu de <b>${esc(co.name)}</b> la marchandise désignée ci-dessous, en bon état et conforme à ma commande <b>${esc(o.ref)}</b>, et avoir réglé la somme de <b>${dzd(ttc)}</b> (${frWords(ttc)} dinars algériens).</p><p>Je décharge ${esc(co.name)} de toute responsabilité concernant cette livraison.</p></div>${table}`
    : table + totals;
  const sign = `<div class="doc-sign"><div><small>${type==='bl'||type==='decharge'?'Signature du livreur':'Cachet et signature'}</small></div><div><small>${type==='facture'||type==='proforma'?'Signature du client':'Signature du destinataire (lu et approuvé)'}</small></div></div>`;
  return `<div class="doc-sheet">${head}${client}${body}${sign}<div class="doc-foot">${esc(co.footer)}${co.rib?' · RIB : '+esc(co.rib):''}</div></div>`;
}

/* ---------- ouvrir, modifier, imprimer ---------- */
function docOpen(o, type){
  const d=docEnsure(o, type); S.ui.doc={id:o.id, type, edit:false};
  const html = d.html? rteClean(d.html) : docHtml(o, type);
  openModal(modalTpl(t(DOC_TYPES[type].label)+' · '+esc(d.no), `<div class="doc-wrap"><div id="docArea" class="doc-area">${html}</div></div>`,
    `<span class="small muted grow">${d.html? t('Modifié à la main'):t('Rempli automatiquement depuis la commande')}</span>${d.html?`<button class="btn" data-a="docReset">${ic('refresh','sm')} ${t('Recréer depuis la commande')}</button>`:''}<button class="btn" data-a="docEdit">${ic('edit','sm')} ${t('Modifier le texte')}</button><button class="btn primary" data-a="docPrint">${ic('print','sm')} ${t('Imprimer / PDF')}</button>`, true));
  document.querySelector('.modal').classList.add('doc-modal');
}
const docOrder = () => ORDERS.find(o=>o.id===S.ui.doc.id);
A.docOpen = el=>{ if(typeof KM!=='undefined' && KM){ KM=null; drawKMenu(); } const o=ORDERS.find(x=>x.id===+el.dataset.id); if(o) docOpen(o, el.dataset.v); };
A.docEdit = el=>{ const a=document.getElementById('docArea'); if(!S.ui.doc.edit){ S.ui.doc.edit=true; a.contentEditable='true'; a.classList.add('editing'); a.focus(); el.innerHTML=ic('check','sm')+' '+t('Enregistrer les modifications'); el.classList.add('green'); return; }
  const o=docOrder(); o.docs[S.ui.doc.type].html=rteClean(a.innerHTML); hist(o,'Document modifié', o.docs[S.ui.doc.type].no); toast(t('Document enregistré'),'ok'); docOpen(o, S.ui.doc.type); };
A.docReset = ()=>{ const o=docOrder(); delete o.docs[S.ui.doc.type].html; docOpen(o, S.ui.doc.type); };
A.docPrint = ()=>{ const a=document.getElementById('docArea'); if(S.ui.doc.edit){ const o=docOrder(); o.docs[S.ui.doc.type].html=rteClean(a.innerHTML); } document.body.classList.add('printing-doc'); window.print(); document.body.classList.remove('printing-doc'); };

/* ---------- module « Factures et documents » ---------- */
S.ui.docs = {type:'facture', q:'', pick:''};
function viewDocuments(){
  const u=S.ui.docs, co=docCo();
  const tabs = `<div class="tabs">${Object.entries(DOC_TYPES).map(([k,D])=>`<button class="${u.type===k?'on':''}" data-a="docsTab" data-v="${k}">${t(D.label)} <span class="c">${ORDERS.filter(o=>o.docs&&o.docs[k]).length}</span></button>`).join('')}<button class="${u.type==='model'?'on':''}" data-a="docsTab" data-v="model">${ic('gear','sm')} ${t('Modèle et entreprise')}</button></div>`;
  let inner;
  if(u.type==='model'){
    const f=(k,l,a)=>`<div class="field"><label>${t(l)}<input class="input" data-docset="${k}" value="${esc(co[k]??'')}" ${a||''}></label></div>`;
    inner = `<div class="card-b col" style="gap:14px"><p class="small muted" style="margin:0">${t('Ces informations apparaissent sur tous les documents. Les documents déjà modifiés à la main gardent leur texte.')}</p>
      <div class="grid3">${f('name','Raison sociale')}${f('address','Adresse')}${f('phone','Téléphone')}${f('email','E-mail')}${f('site','Site web')}${f('rib','RIB / CCP')}${f('nif','NIF')}${f('rc','RC (registre du commerce)')}${f('nis','NIS')}${f('ai','Article d\'imposition')}${f('tva','TVA (%)','type="number" min="0" step="1"')}${f('validity','Validité proforma (jours)','type="number" min="1"')}</div>
      <div class="grid3">${f('footer','Pied de page')}<div class="field"><label>${t('Couleur')}<input class="input" type="color" data-docset="color" value="${esc(co.color)}" style="height:40px;padding:3px"></label></div></div>
      <label class="check"><input type="checkbox" data-docset="autoBl" ${co.autoBl?'checked':''}> ${t('Créer automatiquement le bon de livraison à l\'expédition')}</label>
      <label class="check"><input type="checkbox" data-docset="autoFacture" ${co.autoFacture?'checked':''}> ${t('Créer automatiquement la facture à la livraison')}</label></div>`;
  } else {
    const q=u.q.toLowerCase();
    const list = ORDERS.filter(o=>o.docs && o.docs[u.type]).filter(o=>!q || o.docs[u.type].no.toLowerCase().includes(q) || o.ref.toLowerCase().includes(q) || ((CBY[o.customerId]||{}).name||'').toLowerCase().includes(q)).sort((a,b)=>b.docs[u.type].at-a.docs[u.type].at);
    const cand = ORDERS.filter(o=>!(o.docs&&o.docs[u.type]) && !['cancelled'].includes(o.status)).sort((a,b)=>b.created-a.created).slice(0,300);
    inner = `<div class="filters-bar"><input class="input s" placeholder="${t('Rechercher n°, commande, client…')}" value="${esc(u.q)}" data-in="docsQ" aria-label="${t('Rechercher')}"><span class="grow"></span>
      <select class="select" id="docPick" aria-label="${t('Commande')}" style="max-width:320px"><option value="">${t('Choisir une commande…')}</option>${cand.map(o=>`<option value="${o.id}">${o.ref} · ${esc((CBY[o.customerId]||{}).name||'')} · ${dzd(orderTotal(o))}</option>`).join('')}</select>
      <button class="btn primary" data-a="docNew">${ic('plus','sm')} ${t('Créer')} ${t(DOC_TYPES[u.type].label).toLowerCase()}</button></div>
      <div class="tbl-wrap" style="max-height:620px"><table class="tbl"><thead><tr><th>N°</th><th>${t('Date')}</th><th>${t('Commande')}</th><th>${t('Client')}</th><th>${t('Wilaya')}</th><th class="r">${t('Montant')}</th><th>${t('État')}</th><th></th></tr></thead><tbody>
      ${list.map(o=>{ const d=o.docs[u.type]; return `<tr><td><b>${esc(d.no)}</b></td><td class="small">${fDate(d.at)}</td><td>${esc(o.ref)}</td><td class="small">${esc((CBY[o.customerId]||{}).name||'—')}</td><td class="small">${esc(wName(o.wilaya))}</td><td class="r num"><b>${dzd(orderTotal(o))}</b></td><td><span class="badge ${STATUS[o.status]? STATUS[o.status].c:''}">${esc(stName(o.status,o))}</span>${d.html?` <span class="badge">${t('modifié')}</span>`:''}</td><td><div class="row" style="gap:4px;flex-wrap:nowrap"><button class="btn sm" data-a="docOpen" data-id="${o.id}" data-v="${u.type}">${ic('eye','sm')} ${t('Ouvrir')}</button></div></td></tr>`; }).join('') || emptyRow(8,'Aucun document pour l\'instant','file')}
      </tbody></table></div>`;
  }
  return erpShell('documents', t('Factures et documents'), t('Facture, proforma, bon de livraison et décharge : remplis automatiquement, modifiables, prêts à imprimer'), card('', tabs+inner));
}
ERP_VIEWS.admin.documents = ()=>viewDocuments();
A.docsTab = el=>{ S.ui.docs.type=el.dataset.v; render(); };
IN.docsQ = el=>{ S.ui.docs.q=el.value; render(); };
A.docNew = ()=>{ const id=+val('docPick'); if(!id){ toast(t('Choisissez une commande'),'bad'); return; } docOpen(ORDERS.find(o=>o.id===id), S.ui.docs.type); render(); };
document.addEventListener('change', e=>{ const el=e.target.closest('[data-docset]'); if(!el) return; const k=el.dataset.docset; SETTINGS.docs={...(SETTINGS.docs||{}), [k]: el.type==='checkbox'? el.checked : el.type==='number'? +el.value : el.value}; toast(t('Enregistré'),'ok'); });

/* depuis la liste des commandes : menu « Plus » */
const _kMenuItemsDoc = kMenuItems;
kMenuItems = function(o){ const h=_kMenuItemsDoc(o); if(KM.kind!=='more' || !isAdmin()) return h; return h + Object.entries(DOC_TYPES).map(([k,D])=>`<button class="kmitem" data-a="docOpen" data-id="${o.id}" data-v="${k}">${ic('file','sm')} ${t(D.label)}</button>`).join(''); };
