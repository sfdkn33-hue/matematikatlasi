(()=>{'use strict';
const $=id=>document.getElementById(id),wrap=$('atlas7Ratio'),stage=$('atlasRatioStage'),note=$('atlasRatioNote');
let current=null,state=null,lastWrongSignature="",hintLogged=false;
const db=window.ATLAS_DB,taskById=new Map(db.tasks.map(t=>[String(t.id),t]));
const safe=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
function message(s,mode=''){note.className='ratio-note '+mode;note.textContent=s}
function bar(label,value,max,col){let pct=Math.max(3,Math.min(100,100*value/max));return `<div class="ratio-bar-item"><span>${safe(label)}</span><div class="ratio-track"><div class="ratio-fill" style="width:${pct}%;background:${col}"></div></div><strong>${value}</strong></div>`}
function graph(c){const Xmax=Math.max(c.x1,c.x2)+2,Ymax=Math.max(c.y1,c.y2)+3;
 const px=x=>42+x/Xmax*268,py=y=>223-y/Ymax*191;
 let lines='';for(let i=0;i<=5;i++){let x=42+i*268/5,y=223-i*191/5;lines+=`<line x1="${x}" y1="32" x2="${x}" y2="223" stroke="#e1edf3"/><line x1="42" y1="${y}" x2="310" y2="${y}" stroke="#e1edf3"/>`}
 return `<svg class="ratio-graph" role="img" aria-label="İki noktalı koordinat grafiği; başlangıç 0 0, A ${c.x1} ${c.y1}, B ${c.x2} ${c.y2}" viewBox="0 0 350 260">${lines}<path d="M42 32V223H310" stroke="#466c86" stroke-width="2" fill="none"/><path d="M42 223L${px(c.x1)} ${py(c.y1)}L${px(c.x2)} ${py(c.y2)}" fill="none" stroke="#78b5ca" stroke-dasharray="5 6" stroke-width="2"/><circle cx="${px(c.x1)}" cy="${py(c.y1)}" r="7" fill="#258ec0"/><circle cx="${px(c.x2)}" cy="${py(c.y2)}" r="7" fill="#ee9e3b"/><text x="${px(c.x1)+10}" y="${py(c.y1)-9}" font-size="13" fill="#225a79">A</text><text x="${px(c.x2)+10}" y="${py(c.y2)-9}" font-size="13" fill="#94621d">B</text><text x="25" y="235" font-size="11">0</text><text x="313" y="236" font-size="12">x</text><text x="25" y="27" font-size="12">y</text><text x="12" y="252" font-size="10" fill="#58748a">A (${c.x1},${c.y1}) · B (${c.x2},${c.y2})</text></svg>`}
function cards(c){return `<div class="ratio-values"><div class="ratio-value"><small>İlk durum</small><strong>${c.x1} → ${c.y1}</strong></div><div class="ratio-value"><small>İkinci durum</small><strong>${c.x2} → ${c.y2}</strong></div></div>`}
function miniGrid(base,pct,subtype){let colored=Math.round(pct/10);return `<div class="ratio-percent"><p><strong>%${pct}</strong> · Her blok %10</p><div class="ratio-percent-grid">${Array.from({length:10},(_,i)=>`<span class="${i<colored?'on':''}"></span>`).join('')}</div><small>Yüzdelik dilimi bir bütünden hareketle düşün; değişimin başlangıç miktarına göre olduğunu unutma.</small></div>`}
function doubleAxis(c){return `<div class="ratio-double" role="img" aria-label="Çift sayı doğrusu, ${c.q} birim ${c.total} sonuç; ${c.target} birimin sonucu bilinmiyor"><div class="ratio-scale"><span>İlk nicelik</span><strong>0</strong><strong>${c.q}</strong><strong>${c.target}</strong></div><div class="ratio-dash"></div><div class="ratio-scale"><span>İkinci nicelik</span><strong>0</strong><strong>${c.total}</strong><strong>?</strong></div><p>Her iki sıra birlikte değişir. Kaç katına çıktığını belirle.</p></div>`}
function choiceRow(kind,list,selected){return `<div class="ratio-choice" role="group" aria-label="${kind==='decision'?'Orantı kararı':'Matematiksel gerekçe'}">${list.map((t,i)=>`<button type="button" data-ratio-kind="${kind}" data-i="${i}" aria-pressed="${selected===i}">${safe(t)}</button>`).join('')}</div>`}
function draw(){if(!current)return;let c=current.atlas7Ratio,kind=c.kind;
 let s='<p class="ratio-intro">🔎 Önce matematiksel ilişkiyi modelle; ardından cevabını ve gerekçeni denetle.</p>';
 if(kind==='compare')s+=`<div class="ratio-visual">${bar('A',c.x,c.x,'#4eade0')}${bar('B',c.y,c.x,'#78c49d')}</div>`;
 if(kind==='equivalent')s+=`<div class="ratio-visual"><h3>Oran çubukları</h3>${bar('Mavi (başlangıç)',c.a,Math.max(c.x,c.answer),'#318ec5')}${bar('Sarı (başlangıç)',c.b,Math.max(c.x,c.answer),'#efbf52')}${bar('Mavi (hedef)',c.x,Math.max(c.x,c.answer),'#318ec5')}</div>`;
 if(kind==='unit')s+=`<div class="ratio-visual">${bar('Miktar',c.q,Math.max(c.total,c.q),'#49a3d0')}${bar('Toplam',c.total,Math.max(c.total,c.q),'#72b89c')}<p>1 birimdeki değer = toplam ÷ miktar</p></div>`;
 if(kind==='table')s+=`<div class="ratio-visual"><h3>İki eşleştirmeyi karşılaştır</h3>${cards(c)}<table class="ratio-table"><tr><th>Nicelik</th><th>1. durum</th><th>2. durum</th></tr><tr><th>x</th><td>${c.x1}</td><td>${c.x2}</td></tr><tr><th>y</th><td>${c.y1}</td><td>${c.y2}</td></tr><tr><th>y/x</th><td>?</td><td>?</td></tr></table></div>`;
 if(kind==='graph')s+=`<div class="ratio-visual"><h3>Noktalardan ilişkiyi oku</h3>${graph(c)}</div>`;
 if(kind==='double')s+=`<div class="ratio-visual">${doubleAxis(c)}</div>`;
 if(kind==='percent')s+=`<div class="ratio-visual">${miniGrid(c.base,c.pct,c.subtype)}</div>`;
 if(kind==='recipe')s+=`<div class="ratio-visual"><h3>Aynı karışımın oranı korunmalı</h3>${bar('Su (başlangıç)',c.a,Math.max(c.water,c.answer),'#6dbceb')}${bar('Öz (başlangıç)',c.b,Math.max(c.water,c.answer),'#e1a869')}${bar('Su (hedef)',c.water,Math.max(c.water,c.answer),'#6dbceb')}</div>`;
 if(kind==='table'||kind==='graph')s+='<h3>Bu durum doğru orantı mı?</h3>'+choiceRow('decision',['Evet, doğru orantı','Hayır, doğru orantı değil'],state.decision);
 else s+=`<label class="ratio-input-label" for="ratioAnswer">${kind==='compare'?'Fark / kat değeri':kind==='unit'?'Birim oran':kind==='percent'?'Yüzde problemi yanıtı':'Eksik miktar'}${kind==='unit'?' ('+safe(c.unit)+')':''}</label><div class="ratio-input-wrap"><button type="button" data-ratio-step="-1" aria-label="Bir azalt">−</button><input id="ratioAnswer" type="number" inputmode="numeric" step="1" min="0" max="5000" placeholder="Yanıtını yaz" value="${safe(state.entry)}"/><button type="button" data-ratio-step="1" aria-label="Bir artır">+</button></div>`;
 s+='<h3>Bu çözümün matematiksel gerekçesi hangisi?</h3>'+choiceRow('reason',c.choices,state.reason);
 stage.innerHTML=s;
 stage.querySelectorAll('[data-ratio-kind]').forEach(b=>b.onclick=()=>{let type=b.dataset.ratioKind;state[type]=Number(b.dataset.i);draw()});
 const answer=stage.querySelector('#ratioAnswer');if(answer){answer.addEventListener('input',()=>{state.entry=answer.value});stage.querySelectorAll('[data-ratio-step]').forEach(b=>b.onclick=()=>{let x=Number(state.entry)||0;state.entry=String(Math.max(0,Math.min(5000,x+Number(b.dataset.ratioStep))));draw();stage.querySelector('#ratioAnswer')?.focus()})}
}
function render(task){current=task;lastWrongSignature="";hintLogged=false;let c=task?.atlas7Ratio;wrap.hidden=!c;if(!c){stage.replaceChildren();return}state={entry:'',decision:-1,reason:-1};$('atlasRatioMode').textContent=({'compare':'Fark ve kat','equivalent':'Denk oran','unit':'Birim oran','table':'Orantı tablosu','graph':'Grafik','double':'Çift sayı doğrusu','percent':'Yüzdeler','recipe':'Tarif'}[c.kind]);draw();message('Modelini incele, cevabını ve gerekçeni seç.')}
function verify(){if(!current)return;let c=current.atlas7Ratio;let numeric=String(state.entry).trim()!==''&&Number(state.entry)===c.answer;
 let decision=state.decision===(c.answer?0:1);
 let ok=(['table','graph'].includes(c.kind)?decision:numeric)&&state.reason===c.reason;
 if(!ok){
  const isDecision=['table','graph'].includes(c.kind);
  const complete=state.reason>=0&&(isDecision?state.decision>=0:(String(state.entry).trim()!==''&&Number.isFinite(Number(state.entry))));
  if(complete){const signature=[current.id,state.entry,state.decision,state.reason].join('|');
   if(signature!==lastWrongSignature){
    const wrongValue=isDecision?(state.decision!==(c.answer?0:1)):!numeric;
    const focus=wrongValue?'hesap':'karar',fieldKey=wrongValue?'value':'reason';
    const saved=window.MatematikAtlas64?.log({taskId:current.id,status:'wrong',family:'7. sınıf oran ve orantı',focus,evidence:'module-validator',fieldKey,automatic:true,firstTry:false});
    if(saved)lastWrongSignature=signature;
   }
  }
  message('Henüz doğru değil. İki niceliğin ilişkisini, sonucu ve gerekçeyi yeniden kontrol et. İlerleme kaydedilmedi.','bad');return} 
 let task=current;let st={...state};$('answer').value=task.beklenen_yanit_veya_rubrik;$('check').click();if(current?.id===task.id){state=st;draw();message('✓ Doğru! '+c.why,'good')}
}
$('atlasRatioCheck').onclick=verify;$('atlasRatioHint').onclick=()=>{if(current){if(!hintLogged){const saved=window.MatematikAtlas64?.log({taskId:current.id,status:'hint',family:'7. sınıf oran ve orantı',evidence:'module-validator',automatic:true,hintUsed:true});if(saved)hintLogged=true;}message('💡 '+current.ipucu)}};$('atlasRatioReset').onclick=()=>{if(current)render(current)};
document.addEventListener('atlas:taskrender',e=>render(taskById.get(String(e.detail?.id||''))));
})();