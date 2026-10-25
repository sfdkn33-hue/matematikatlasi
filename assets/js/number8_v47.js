/* Matematik Atlası v4.7 — 8. sınıf sayılar/üslü ifadeler atölyesi. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const shell=$('atlas8Lab'),area=$('atlas8Stage'),notice=$('atlas8Status');
if(!shell||!area||!window.ATLAS_DB)return;
const taskMap=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas8Lab).map(t=>[String(t.id),t]));
let task=null,state={};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eq=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const isInt=x=>String(x).trim()!==''&&Number.isSafeInteger(Number(x));
const prime=[2,3,5,7];
const tit={divisor_cards:'Çarpan kartları',prime_ladder:'Asal çarpan merdiveni',gcd_board:'Ortak bölen ağı',lcm_track:'Kat buluşma çizgisi',coprime_detector:'Aralarında asal dedektifi',power_fraction:'İşaretli üs makinesi',exponent_law:'Üs kuralı yapbozu'};
function status(msg,tone=''){notice.className='a8-status '+tone;notice.textContent=msg;}
function input(k,label,ph='?'){return `<label class="a8-input"><span>${esc(label)}</span><input data-a8-input="${k}" type="number" step="1" inputmode="numeric" autocomplete="off" placeholder="${esc(ph)}" value="${esc(state[k]??'')}"></label>`}
function chips(vals,mode='choice'){return `<div class="a8-chips" role="group" aria-label="Kartlar">${vals.map(v=>`<button type="button" class="a8-chip ${mode==='toggle'&&state.selected.includes(v)?'is-active':''} ${mode==='choice'&&state.choice===v?'is-active':''}" data-a8-${mode}="${esc(v)}" aria-pressed="${mode==='toggle'?state.selected.includes(v):state.choice===v}">${esc(v)}</button>`).join('')}</div>`}
function buttons(vals,key){return `<div class="a8-chips" role="group" aria-label="Seçenekler">${vals.map((s,i)=>`<button type="button" class="a8-chip ${state[key]===i?'is-active':''}" data-a8-option="${key}:${i}" aria-pressed="${state[key]===i}">${esc(s)}</button>`).join('')}</div>`}
function divs(n){let arr=[];for(let d=1;d<=n;d++)if(n%d===0)arr.push(d);return arr}
function powerSymbol(base,exp){return `<span class="a8-power">(${base})<sup>${exp}</sup></span>`}
function draw(){if(!task)return;const m=task.atlas8Lab;let out='';
 if(m.kind==='divisor_cards'){
   out=`<div class="a8-number">${m.number}<small>sayısının bölenleri</small></div><p>Her doğru bölen kartını seç. Gereksiz kartlara dokunma.</p>${chips(m.candidates,'toggle')}<div class="a8-visual-note">Seçilen: ${state.selected.length} kart · Kaç tane bölen olduğunu da keşfet.</div>`;
 }
 if(m.kind==='prime_ladder'){
   out=`<div class="a8-number">${state.remaining}<small>kalan sayı</small></div><div class="a8-steps"><strong>Asal çarpanlarım:</strong> ${state.steps.length?state.steps.join(' × '):'—'}</div><p>Kalana tam bölünen bir asal kartı seç:</p>${chips(prime.filter(p=>p<=Math.max(7,state.remaining)),'prime')}
   <div class="a8-visual-note">Merdiven: ${m.number}${state.steps.map(p=>' ÷ '+p).join('')} = ${state.remaining}</div>`;
 }
 if(m.kind==='gcd_board'){
   out=`<div class="a8-dual"><div><small>İlk sayı</small><strong>${m.a}</strong><span>${divs(m.a).join(', ')}</span></div><div><small>İkinci sayı</small><strong>${m.b}</strong><span>${divs(m.b).join(', ')}</span></div></div><p>İki sayının da ortak böleni olan bütün kartları seç:</p>${chips(m.candidates,'toggle')}<div class="a8-entry">${input('value','En büyük ortak bölen (EBOB)')}</div>`;
 }
 if(m.kind==='lcm_track'){
   const lenA=2*m.answer/m.a,lenB=2*m.answer/m.b;
   out=`<p>İki farklı zilin tekrar saatleri:</p><div class="a8-timeline"><strong>🔵 ${m.a} dakikalık zil</strong><div>${Array.from({length:lenA},(_,i)=>`<span>${m.a*(i+1)}</span>`).join('')}</div><strong>🟠 ${m.b} dakikalık zil</strong><div>${Array.from({length:lenB},(_,i)=>`<span>${m.b*(i+1)}</span>`).join('')}</div></div><p>İlk ortak zamanı işaretle:</p>${chips([...new Set([...Array.from({length:lenA},(_,i)=>m.a*(i+1)),...Array.from({length:lenB},(_,i)=>m.b*(i+1))])].sort((a,b)=>a-b),'choice')}`;
 }
 if(m.kind==='coprime_detector'){
   out=`<div class="a8-dual"><div><small>${m.a} sayısının asal çarpanları</small><strong>${m.fa.join(' × ')}</strong></div><div><small>${m.b} sayısının asal çarpanları</small><strong>${m.fb.join(' × ')}</strong></div></div><p>Her ikisinde de bulunan <b>farklı asal çarpanları</b> seç. Hiç yoksa hiçbir kartı işaretleme.</p>${chips(m.candidates,'toggle')}<p>Sayılar aralarında asal mı?</p>${buttons(['Evet','Hayır'],'verdict')}<div class="a8-entry">${input('value','EBOB kaçtır?')}</div>`;
 }
 if(m.kind==='power_fraction'){
   out=`<div class="a8-mathpanel">${powerSymbol(m.base,m.exp)} <span class="a8-equals">=</span> <span class="a8-fraction"><span>pay</span><span>payda</span></span></div><div class="a8-entry">${input('numerator','Pay (işaretli olabilir)')}${input('denominator','Payda (pozitif)')}</div><p>Hangi özellikten yararlandın?</p>${buttons(['Sıfırıncı kuvvet 1’dir.','Negatif üs, tersini almayı gerektirir.','Pozitif üs, tekrarlı çarpma ile bulunur.'],'powerReason')}`;
 }
 if(m.kind==='exponent_law'){
   const text=m.mode==='product'?`${m.base}^${m.left} × ${m.base}^${m.right}`:m.mode==='quotient'?`${m.base}^${m.left} ÷ ${m.base}^${m.right}`:`(${m.base}^${m.left})^${m.right}`;
   out=`<div class="a8-mathpanel"><strong>${esc(text)}</strong><span class="a8-equals">= ${m.base}<sup>?</sup></span></div><div class="a8-entry">${input('exponent','Sonuçtaki üs')}</div><p>Bu dönüşüm hangi kurala dayanıyor?</p>${buttons(['Üsleri toplarım','Üsleri çıkarırım','Üsleri çarparım'],'rule')}<div class="a8-tiles">${Array.from({length:m.left},()=>'<span>1</span>').join('')}<b>${m.mode==='product'?'⊕':m.mode==='quotient'?'−':'×'}</b>${Array.from({length:m.right},()=>'<span>1</span>').join('')}</div>`;
 }
 area.innerHTML=out;
 area.querySelectorAll('[data-a8-toggle]').forEach(b=>b.onclick=()=>{let n=Number(b.dataset.a8Toggle);state.selected=state.selected.includes(n)?state.selected.filter(x=>x!==n):[...state.selected,n].sort((a,b)=>a-b);draw()});
 area.querySelectorAll('[data-a8-prime]').forEach(b=>b.onclick=()=>{const p=Number(b.dataset.a8Prime);if(state.remaining===1){status('Merdiven tamamlandı. Sonucu kontrol edebilirsin.','good');return}if(state.remaining%p){status(`${p}, ${state.remaining} sayısını tam bölmez. Başka bir asal dene.`,'bad');return}state.steps.push(p);state.remaining/=p;draw();status(state.remaining===1?'Asal çarpanları tamamladın. Şimdi doğrula.':`${p} ile böldün; kalan ${state.remaining}.`)});
 area.querySelectorAll('[data-a8-choice]').forEach(b=>b.onclick=()=>{state.choice=Number(b.dataset.a8Choice);draw()});
 area.querySelectorAll('[data-a8-option]').forEach(b=>b.onclick=()=>{const [key,i]=b.dataset.a8Option.split(':');state[key]=Number(i);draw()});
 area.querySelectorAll('[data-a8-input]').forEach(el=>el.oninput=()=>{state[el.dataset.a8Input]=el.value});
}
function render(t){task=t??null;shell.hidden=!task;if(!task){area.replaceChildren();return}const m=task.atlas8Lab;state={selected:[],choice:null,remaining:m.number,steps:[],value:'',numerator:'',denominator:'',exponent:'',verdict:null,powerReason:null,rule:null};$('atlas8Mode').textContent=tit[m.kind]||'Atölye';draw();status('Önce modeli tamamla, ardından çözümünü doğrula.');}
function verify(){if(!task)return;let m=task.atlas8Lab,good=false;
 if(m.kind==='divisor_cards')good=eq(state.selected,m.divisors);
 if(m.kind==='prime_ladder')good=state.remaining===1&&eq([...state.steps].sort((a,b)=>a-b),[...m.primes].sort((a,b)=>a-b));
 if(m.kind==='gcd_board')good=eq(state.selected,m.common)&&isInt(state.value)&&Number(state.value)===m.answer;
 if(m.kind==='lcm_track')good=state.choice===m.answer;
 if(m.kind==='coprime_detector')good=eq(state.selected,m.common)&&state.verdict===(m.common.length?1:0)&&isInt(state.value)&&Number(state.value)===m.gcd;
 if(m.kind==='power_fraction'){
   const required=m.exp===0?0:m.exp<0?1:2;
   good=isInt(state.numerator)&&isInt(state.denominator)&&Number(state.denominator)>0&&
   Number(state.numerator)*m.denominator===Number(state.denominator)*m.numerator&&state.powerReason===required;
 }
 if(m.kind==='exponent_law')good=isInt(state.exponent)&&Number(state.exponent)===m.exponent&&state.rule===({product:0,quotient:1,power:2}[m.mode]);
 if(!good){status('Henüz doğru değil. Kartları, işlemi ve gerekiyorsa kuralı tekrar kontrol et. İlerleme kaydedilmedi.','bad');return}
 const id=task.id;window.__atlas8Verified=id;$('answer').value=task.beklenen_yanit_veya_rubrik;$('check').click();window.__atlas8Verified=null;
 if(task?.id===id)status('✓ Harika! Model ve işlem doğru; görevin tamamlandı.','good');
}
$('atlas8Check').addEventListener('click',verify);
$('atlas8Hint').addEventListener('click',()=>task&&status('💡 '+task.ipucu));
$('atlas8Reset').addEventListener('click',()=>task&&render(task));
document.addEventListener('atlas:taskrender',e=>render(taskMap.get(String(e.detail?.id||''))));
})();
