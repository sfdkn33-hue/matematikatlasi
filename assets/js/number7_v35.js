/* Matematik Atlası v3.5 — isolated 7th grade laboratory, no change to existing progress keys. */
(()=>{
'use strict';
const el=id=>document.getElementById(id),root=el('atlas7Lab'),stage=el('atlas7Stage'),msg=el('atlas7Note');
if(!root||!window.ATLAS_DB)return;
const tasks=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas7Lab).map(t=>[t.id,t]));
let active=null,choice=null,sequence=[],numerator=0,line=0;
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function decimal(v){return String(v).replace('.',',')}
function parseNum(s){
 let t=String(s).trim().replace(/\s+/g,'').replace(',','.');
 if(!/^[+-]?\d+(?:\.\d+)?(?:\/[+-]?\d+(?:\.\d+)?)?$/.test(t))return null;
 const [a,b]=t.split('/').map(Number); if(!Number.isFinite(a)||!Number.isFinite(b??1)||b===0)return null;
 return a/(b??1)
}
function done(id){try{return !!JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')[id]}catch{return false}}
function status(text,kind=''){msg.textContent=text;msg.className='atlas7-note '+kind}
function setHtml(html){stage.innerHTML=html}
function lineDraw(){
 const slider=el('atlas7Range');if(!slider)return;line=Number(slider.value)/2;
 el('atlas7Coordinate').textContent='Seçilen konum: '+decimal(line);

}
function fractionDraw(){
 const c=active.atlas7Lab,d=c.denominator;
 el('atlas7Numerator').textContent=numerator+'/'+d;
 el('atlas7Tiles').innerHTML=Array.from({length:d},(_,i)=>'<div class="'+(i<numerator?'painted':'')+'" aria-hidden="true"></div>').join('');
}
function orderDraw(){const c=active.atlas7Lab;
 el('atlas7Picked').textContent=sequence.map(i=>c.items[i]).join('  →  ');
 stage.querySelectorAll('[data-index]').forEach(b=>{b.disabled=sequence.includes(Number(b.dataset.index));});
}
function show(task){active=task;let c=task?.atlas7Lab;root.hidden=!c;if(!c){stage.textContent='';return}
 choice=null;sequence=[];numerator=0;line=0;
 el('atlas7Mode').textContent={'line':'Sayı doğrusu','order':'Sıralama','choice':'Akıl yürütme','fraction':'Parça modeli','input':'İşlem kur'}[c.kind]||'Keşif';
 if(c.kind==='line'){
  const labels=Array.from({length:11},(_,i)=>i-5);
  setHtml('<div class="atlas7-value" id="atlas7Coordinate">Seçilen konum: 0</div><input class="atlas7-line" id="atlas7Range" type="range" min="-10" max="10" step="1" value="0" aria-label="Sayı doğrusunda konum seç"/><div class="atlas7-ticks" id="atlas7TickLabels">'+labels.map(x=>'<span>'+x+'</span>').join('')+'</div><p class="atlas7-example">İşaretçiyi sürükle ya da klavyenin ok tuşlarını kullan. Her küçük adım 0,5 birimdir.</p>');
  el('atlas7Range').oninput=lineDraw;
 } else if(c.kind==='fraction'){
  setHtml('<div class="atlas7-picked">Şeritte seçilen boyalı alan:</div><div class="atlas7-strips" id="atlas7Tiles" role="img" aria-label="Eş parçalara ayrılmış kesir şeridi"></div><div class="atlas7-frac-adjust"><button id="atlas7Minus" aria-label="Boyanan parçayı azalt">−</button><strong id="atlas7Numerator">0/'+c.denominator+'</strong><button id="atlas7Plus" aria-label="Boyanan parçayı artır">+</button></div>');
  el('atlas7Minus').onclick=()=>{numerator=Math.max(0,numerator-1);fractionDraw()};
  el('atlas7Plus').onclick=()=>{numerator=Math.min(c.denominator,numerator+1);fractionDraw()};fractionDraw();
 } else if(c.kind==='order'){
  setHtml('<div class="atlas7-picked" id="atlas7Picked"></div><div class="atlas7-cards" role="group" aria-label="Sıralanacak sayı kartları">'+c.items.map((v,i)=>'<button type="button" data-index="'+i+'">'+esc(v)+'</button>').join('')+'</div><p class="atlas7-example">Kartları küçükten büyüğe birer birer seç. Yanılırsan “Yeniden dene”ye basabilirsin.</p>');
  stage.querySelectorAll('[data-index]').forEach(b=>{b.onclick=()=>{const i=Number(b.dataset.index);if(!sequence.includes(i)){sequence.push(i);orderDraw()}}});orderDraw();
 } else if(c.kind==='choice'){
  setHtml('<div class="atlas7-cards" role="group" aria-label="Yanıt seçenekleri">'+c.options.map((v,i)=>'<button type="button" data-choice="'+i+'" aria-pressed="false">'+esc(v)+'</button>').join('')+'</div>');
  stage.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{choice=c.options[Number(b.dataset.choice)];stage.querySelectorAll('[data-choice]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
 } else if(c.kind==='input'){
  setHtml('<label class="atlas7-input-label" for="atlas7Text">Sonucu kesir ya da ondalık sayı olarak yaz</label><input type="text" class="atlas7-input" id="atlas7Text" inputmode="decimal" autocomplete="off" placeholder="'+esc(c.placeholder||'Örnek: 3/4')+'"/><p class="atlas7-example">Virgül kullanabilirsin: 0,5 ve 1/2 eşdeğer kabul edilir.</p>');
  el('atlas7Text').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();verify()}});
 }
 status(done(task.id)?'✓ Bu görevi daha önce doğru tamamladın. İstersen tekrar deneyebilirsin.':'Çözümünü oluşturup “Yanıtımı doğrula”ya bas.');
}
function verify(){if(!active)return;const c=active.atlas7Lab;let ok=false,provided='';
 if(c.kind==='line'){provided=String(line);ok=Math.abs(line-parseNum(c.answer))<1e-9}
 else if(c.kind==='fraction'){provided=numerator+'/'+c.denominator;ok=Math.abs(numerator/c.denominator-parseNum(c.answer))<1e-9}
 else if(c.kind==='choice'){provided=choice||'';ok=choice!==null&&choice===c.answer}
 else if(c.kind==='order'){provided=sequence.map(i=>c.items[i]).join('|');ok=provided===c.solution.join('|')}
 else if(c.kind==='input'){provided=el('atlas7Text')?.value||'';ok=parseNum(provided)!==null&&(!c.require_decimal||/^[+-]?\d+[.,]\d+$/.test(provided.trim()))&&Math.abs(parseNum(provided)-parseNum(c.answer))<1e-9}
 if(!provided){status('Henüz seçim yapılmadı. Önce model üzerinde bir karar ver.','bad');return}
 if(!ok){status('Bu kez olmadı. Modeli yeniden düşün; ilerleme kaydedilmedi.','bad');return}
 // Use the application’s own completion and storage routine; never write the key independently.
 const saved={number:numerator,coordinate:line,order:sequence.slice(),choice:choice,input:provided};
 el('answer').value=active.beklenen_yanit_veya_rubrik;
 el('check').click();
 // Completion refreshes the app; restore the student's successful visible model.
 if(c.kind==='line'){el('atlas7Range').value=String(saved.coordinate*2);lineDraw()}
 if(c.kind==='fraction'){numerator=saved.number;fractionDraw()}
 if(c.kind==='order'){sequence=saved.order;orderDraw()}
 if(c.kind==='choice'){choice=saved.choice;stage.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(c.options[Number(b.dataset.choice)]===choice)))}
 if(c.kind==='input')el('atlas7Text').value=saved.input;
 status('✓ Doğru! '+c.explanation,'good');
}
function retry(){if(active)show(active)}
el('atlas7Verify').onclick=verify;
el('atlas7Retry').onclick=retry;
el('atlas7Tip').onclick=()=>{if(active)status('💡 '+active.ipucu)};
document.addEventListener('atlas:taskrender',ev=>show(tasks.get(String(ev.detail?.id||''))));
})();
