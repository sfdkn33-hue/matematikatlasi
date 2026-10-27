/* Matematik Atlası v4.8 | 8. sınıf 10 kuvvetleri ve kök laboratuvarı. */
(()=>{'use strict';
const el=id=>document.getElementById(id),shell=el('atlas8Lab48'),area=el('atlas8Stage48'),statusBox=el('atlas8Status48');
if(!shell||!area||!window.ATLAS_DB)return;
const tasks=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas8Lab48).map(t=>[String(t.id),t]));
let task=null,model=null,state={};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sup=x=>String(x).replace(/-/g,'⁻').replace(/0/g,'⁰').replace(/1/g,'¹').replace(/2/g,'²').replace(/3/g,'³').replace(/4/g,'⁴').replace(/5/g,'⁵').replace(/6/g,'⁶').replace(/7/g,'⁷').replace(/8/g,'⁸').replace(/9/g,'⁹');
const dec=x=>(x/10).toLocaleString('tr-TR',{minimumFractionDigits:1,maximumFractionDigits:1});
const choose=(vals,name,label=x=>x)=>`<div class="a48-cards" role="group" aria-label="${esc(name)}">${vals.map(v=>`<button class="a48-choice" type="button" aria-pressed="${String(state[name])===String(v)}" data-a48-name="${esc(name)}" data-a48-val="${esc(v)}">${esc(label(v))}</button>`).join('')}</div>`;
const pwr=e=>`10<sup>${e}</sup>`;
function status(msg,typ=''){statusBox.textContent=msg;statusBox.className='a48-status '+typ;}
function squareSvg(k){const step=190/k;let lines='';for(let i=1;i<k;i++){let x=(i*step).toFixed(2);lines+=`<line x1="${x}" y1="0" x2="${x}" y2="190" stroke="#fff" stroke-opacity=".78"/>`+`<line x1="0" y1="${x}" x2="190" y2="${x}" stroke="#fff" stroke-opacity=".78"/>`;}
return `<svg class="a48-square" viewBox="0 0 210 210" role="img" aria-label="${k} satır ve ${k} sütunlu kareli model"><rect x="0" y="0" width="190" height="190" rx="4" fill="#60b6d3"/>${lines}<text x="195" y="105" font-size="12" fill="#28536c" transform="rotate(90,195,105)" text-anchor="middle">${k} br</text><text x="95" y="206" font-size="12" fill="#28536c" text-anchor="middle">${k} br</text></svg>`}
function draw(){if(!task)return;const m=model;let output='';
if(m.kind==='place_match'){
 output=`<div class="a48-value">${esc(m.number_text)}</div><p>Her rakam için doğru basamak kuvvetini seç. Sıfır rakamları da bir basamakta bulunur.</p><div class="a48-rows">${m.cells.map((c,i)=>`<div class="a48-row"><label for="a48place${i}"><span><b>${c.digit}</b> ×</span><select id="a48place${i}" data-a48-exp="${i}"><option value="">10’un kuvvetini seç</option>${m.exp_choices.map(e=>`<option value="${e}" ${String(state['e'+i])===String(e)?'selected':''}>10${sup(e)}</option>`).join('')}</select></label></div>`).join('')}</div><p class="a48-note">Virgülün soluna doğru üs artar, sağına doğru negatif olur.</p>`;
}
if(m.kind==='power_shift'){
 const variant=m.variant||'direct',expected=m.exp;
 const equation=`${m.coefficient} × 10<sup>${state.shift??'□'}</sup> = ${esc(m.number_text)}`;
 if(variant==='debug'){
  output=`<div class="a48-value">${esc(m.number_text)}</div><p><b>Hata avcısı:</b> Bir öğrenci ${m.coefficient} × 10<sup>${m.wrong_exp}</sup> = ${esc(m.number_text)} demiş. Önce iddiayı denetle, ardından doğru kuvveti seç.</p>${choose(['Doğru','Yanlış'],'claim')}<strong>Doğru üs</strong>${choose(m.options,'shift',e=>'10'+sup(e))}<div class="a48-math">${equation}</div>`;
 }else if(variant==='direction'){
  output=`<div class="a48-value">${esc(m.number_text)}</div><p><b>Virgül rotası:</b> ${m.coefficient} katsayısından hedef sayıya ulaşmak için 10’un kuvvetini seç ve ondalık virgülün hangi yöne ilerlediğini göster.</p>${choose(['Sola','Sağa'],'direction')}<strong>Gerekli kuvvet</strong>${choose(m.options,'shift',e=>'10'+sup(e))}<div class="a48-math">${equation}</div>`;
 }else if(variant==='compare'){
  output=`<div class="a48-value">${esc(m.number_text)}</div><p><b>Büyüklük araştırması:</b> Hedef sayı ${m.coefficient} katsayısına göre büyümüş mü, küçülmüş mü? Kararı verdikten sonra eşitliği sağlayan üssü bul.</p>${choose(['Büyüdü','Küçüldü'],'compare')}<strong>Üs kartı</strong>${choose(m.options,'shift',e=>'10'+sup(e))}<div class="a48-math">${equation}</div>`;
 }else{
  output=`<div class="a48-value">${esc(m.number_text)}</div><div class="a48-math">${equation}</div><p>Eksik üssü seç ve virgülün hangi yönde kaydığını düşün.</p>${choose(m.options,'shift',e=>'10'+sup(e))}<div class="a48-note">Katsayı ${m.coefficient}; seçtiğin kuvvet ${state.shift??'—'}.</div>`;
 }
}

if(m.kind==='science'){
 if(m.type==='convert')output=`<div class="a48-value">${esc(m.number_text)}</div><p>Bilimsel gösterimde katsayı <strong>1 ile 10 arasında</strong> olmalı. Önce katsayıyı, sonra 10’un kuvvetini seç.</p><strong>Katsayı</strong>${choose(m.coef_choices,'coef',dec)}<strong>10’un kuvveti</strong>${choose(m.exp_choices,'exp',e=>'10'+sup(e))}<div class="a48-math">${state.coef?dec(Number(state.coef)):'□'} × 10<sup>${state.exp??'□'}</sup></div>`;
 else output=`<div class="a48-twocol"><div class="a48-compare">${dec(m.left_coef10)} × 10<sup>${m.left_exp}</sup></div><div class="a48-compare">${dec(m.right_coef10)} × 10<sup>${m.right_exp}</sup></div></div><p>Soldaki ve sağdaki sayıları karşılaştır:</p>${choose(['<','=','>'],'relation')}<div class="a48-note">Önce üsleri karşılaştır. Üsler eşitse katsayılar belirleyicidir.</div>`;
}
if(m.kind==='square_build'){
 const k=state.side;output=`<div class="a48-twocol"><div>${squareSvg(k)}</div><div><div class="a48-math">Hedef alan: ${m.area} br²<small>Modelde ${k} × ${k} = ${k*k} br²</small></div><p>Modeli büyüterek veya küçülterek alanı eşitle.</p></div></div><div class="a48-range"><button type="button" data-a48-step="-1" aria-label="Kenar uzunluğunu azalt">−</button><input type="range" class="a48-slider" aria-label="Kenar uzunluğu" min="${m.min_side}" max="${m.max_side}" step="1" value="${k}" id="a48side"><button type="button" data-a48-step="1" aria-label="Kenar uzunluğunu artır">+</button></div><div class="a48-math">√${m.area} = <strong>${k}</strong></div>`;
}
if(m.kind==='root_line'){
 const low=state.lower,vals=Array.from({length:m.max-m.min+1},(_,i)=>m.min+i);
 output=`<div class="a48-value">√${m.number}</div><p>Sayı doğrusunda sayının bulunduğu aralığın <strong>sol ucunu</strong> seç. Sağ uç bir sonraki doğal sayıdır.</p><div class="a48-line" role="group" aria-label="Sayı doğrusu">${vals.map((v,i)=>`${i?'<i>—</i>':''}<button type="button" aria-pressed="${v===low}" data-a48-lower="${v}">${v}</button>`).join('')}</div><div class="a48-math">${low===null?'□':low}<sup>2</sup> ${low===null?'':`= ${low*low}`} &lt; ${m.number} &lt; ${low===null?'□':low+1}<sup>2</sup> ${low===null?'':`= ${(low+1)*(low+1)}`}<small>Seçtiğin ardışık sayıların karelerini karşılaştır.</small></div>`;
}
area.innerHTML=output;
area.querySelectorAll('[data-a48-exp]').forEach(x=>x.addEventListener('change',()=>{state['e'+x.dataset.a48Exp]=x.value}));
area.querySelectorAll('[data-a48-name]').forEach(x=>x.addEventListener('click',()=>{state[x.dataset.a48Name]=x.dataset.a48Val;draw()}));
area.querySelectorAll('[data-a48-step]').forEach(x=>x.addEventListener('click',()=>{state.side=Math.max(m.min_side,Math.min(m.max_side,state.side+Number(x.dataset.a48Step)));draw()}));
area.querySelectorAll('#a48side').forEach(x=>x.addEventListener('input',()=>{state.side=Number(x.value);draw()}));
area.querySelectorAll('[data-a48-lower]').forEach(x=>x.addEventListener('click',()=>{state.lower=Number(x.dataset.a48Lower);draw()}));
}
function render(t){task=t||null;shell.hidden=!task;if(!task){area.replaceChildren();return}model=task.atlas8Lab48;state={side:model.kind==='square_build'?Math.max(1,model.side-2):1,lower:null};el('atlas8Mode48').textContent=model.kind==='power_shift'?({direct:'Üs Bulmacası',debug:'Hata Avcısı',direction:'Virgül Rotası',compare:'Büyüklük Araştırması'}[model.variant||'direct']):({place_match:'Basamak Haritası',science:'Bilimsel Gösterim',square_build:'Tam Kare Yapıcı',root_line:'Karekök Sayı Doğrusu'}[model.kind]);draw();status('Modelini oluşturup çözümünü kontrol et.');}
function verify(){if(!task)return;const m=model;let good=false;
if(m.kind==='place_match')good=m.cells.every((c,i)=>state['e'+i]!==undefined&&state['e'+i]!==''&&Number(state['e'+i])===c.power);
if(m.kind==='power_shift')good=window.MatematikAtlasPower624?.verify(m,state)===true;
if(m.kind==='science')good=m.type==='convert'?(state.coef!==undefined&&state.exp!==undefined&&Number(state.coef)===m.coef10&&Number(state.exp)===m.exp):state.relation===m.relation;
if(m.kind==='square_build')good=state.side===m.side;
if(m.kind==='root_line')good=state.lower===m.lower;
if(!good){status('Henüz doğru değil. Modeldeki her seçimi yeniden düşün; ilerleme kaydedilmedi.','bad');return}
const current=task.id;window.__atlas8Verified48=current;el('answer').value=task.beklenen_yanit_veya_rubrik;el('check').click();window.__atlas8Verified48=null;
if(task?.id===current)status('✓ Tebrikler! Matematiksel model doğru, görevin tamamlandı.','good');
}
el('atlas8Check48').addEventListener('click',verify);el('atlas8Hint48').addEventListener('click',()=>task&&status('💡 '+task.ipucu));el('atlas8Reset48').addEventListener('click',()=>task&&render(task));
document.addEventListener('atlas:taskrender',event=>render(tasks.get(String(event.detail?.id||''))));
})();
