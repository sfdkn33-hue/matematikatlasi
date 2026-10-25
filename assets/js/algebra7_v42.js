/* v4.2 Ortaokul Cebir Laboratuvarı — client-side, no persistence key changes */
(()=>{'use strict';
const $=id=>document.getElementById(id),wrap=$('atlas7Algebra'),stage=$('alg42Stage'),status=$('alg42Status');
if(!wrap||!stage||!window.ATLAS_DB)return;
const tasks=new Map(window.ATLAS_DB.tasks.filter(x=>x.atlas7Algebra).map(x=>[String(x.id),x]));
let task=null,state={};const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={combine:'Benzer terimler',distribute:'Dağılma özelliği',equation:'Denklem terazisi',inequality:'Eşitsizlik yolu',proof_even:'Cebirsel ispat',proof_consecutive:'Üç sayı ispatı',proof_counter:'Karşı örnek',algorithm_linear:'Algoritma tasarımı',algorithm_error:'Hata dedektifi'};
function announce(s,kind=''){status.className='alg42-status '+kind;status.textContent=s}
function number(key,label){return `<label class="alg42-number"><span>${html(label)}</span><input type="number" step="1" inputmode="numeric" data-num="${key}" value="${html(state[key])}" placeholder="?" autocomplete="off"></label>`}
function choices(key,items){return `<div class="alg42-options" role="group" aria-label="${html(key)}">${items.map((item,i)=>`<button type="button" data-choice="${key}" data-val="${i}" aria-pressed="${state[key]===i}">${html(item)}</button>`).join('')}</div>`}
function reason(m){return `<div class="alg42-reason"><strong>Sonucun neden doğru olduğunu da göster:</strong>${choices('reason',m.reasonChoices)}</div>`}
function expression(a,b){return `${a}x ${b<0?'− '+Math.abs(b):'+ '+b}`}
function proofOptions(m){
 if(m.kind==='proof_counter'){
 const cc=[
 ['3 + 5 = 8, sonuç çift.','3 + 4 = 7, toplam tek; ama ikinci sayı tek değil.','5 × 7 = 35, çarpım tek; toplama değil.'],
 ['2 × 4 = 8, sonuç çift.','3 × 5 = 15, sonuç tek.','4 + 6 = 10, toplama sonucu çifttir.'],
 ['4 + 5 = 9, sonuç tek.','2 + 4 = 6, sonuç çift.','3 + 5 = 8, ama sayılar ardışık değildir.'],
 ['2 hem asaldır hem çifttir.','3 asaldır ve tektir.','5 asaldır ve tektir.'],
 ['3² = 9, sonuç tektir.','4² = 16, sonuç çifttir.','2² = 4, sonuç çifttir.']
 ];return cc[m.counterType];
 }
 if(m.kind==='proof_consecutive')return ['n+(n+1)+(n+2) = 3(n+1)','n+(n+1)+(n+2) = 3n+2','n+(n+1)+(n+2) = 3n+1'];
 if(m.proofVariant==='even')return ['2k + 2m = 2(k+m)','2k + 2m = 2(k+m)+1','2k + 2m = 2km'];
 return ['(2k+1)+(2m+1) = 2(k+m+1)','(2k+1)+(2m+1) = 2(k+m)+1','(2k+1)+(2m+1) = 2(k+m)+1+1+1'];
}
function colorBox(label,value){return `<div class="alg42-tile"><small>${html(label)}</small><strong>${html(value)}</strong></div>`}
function draw(){if(!task)return;const m=task.atlas7Algebra,k=m.kind;let out='';
 if(['combine','distribute'].includes(k)){
  out+=`<div class="alg42-expression">${html(m.expr)}</div>`;
  if(k==='combine')out+=`<div class="alg42-model">${colorBox('1. katsayı',m.terms[0])}${colorBox('1. sabit',m.terms[1])}${colorBox('2. katsayı',m.terms[2])}${colorBox('2. sabit',m.terms[3])}</div>`;
  else out+=`<div class="alg42-model">${colorBox('Çarpan',m.terms[0])}${colorBox('x katsayısı',m.terms[1])}${colorBox('Sabit terim',m.terms[2])}</div>`;
  out+=`<p>İfadeyi <strong>ax + b</strong> biçimine getir:</p><div class="alg42-inputrow">${number('a','x katsayısı (a)')}${number('b','Sabit terim (b)')}</div><div class="alg42-formula" aria-live="polite">${html(state.a||'?')}x ${state.b!==''?(Number(state.b)<0?'− '+Math.abs(Number(state.b)):'+ '+state.b):'+ ?'}</div>`;
 }
 if(k==='equation'){
  out+=`<div class="alg42-model"><div class="alg42-pan">${colorBox('x kutu',`${m.a} × x`)}${colorBox('Ek kalem',m.b)}</div><span class="alg42-equals">=</span>${colorBox('Toplam kalem',m.c)}</div>`;
  out+=`<div class="alg42-equation">${m.a}x + ${m.b} = ${m.c}</div><p>Her iki kefeye aynı işlemi uygulayarak x'i bul.</p><div class="alg42-inputrow">${number('x','Kutu sayısı (x)')}</div>`;
 }
 if(k==='inequality'){
  out+=`<div class="alg42-equation">${m.a}x + ${m.b} ${html(m.sign)} ${m.c}</div><p>Negatif katsayıya bölerek sınırı ve yönü bul. Sayı doğrusunda gösterilecek çözüm:</p>`;
  out+=`<div class="alg42-inputrow">${number('boundary','Sınır değeri')}</div>${choices('direction',['<','≤','>','≥'])}`;
  const ticks=Array.from({length:11},(_,i)=>`<span>${i}</span>`).join('');out+=`<div class="alg42-line" aria-label="0 ile 10 arasındaki sayı doğrusu">${ticks}</div>`;
 }
 if(['proof_even','proof_consecutive','proof_counter'].includes(k)){
  out+=`<div class="alg42-model">${colorBox('Örnek',m.kind==='proof_counter'?m.example:m.numbers.join(', '))}${colorBox('Hedef',m.kind==='proof_counter'?'Yanlış önermeyi çürüt':'Genel ispat')}</div>`;
  out+=`<p class="alg42-prompt">Aşağıdakilerden hangisi geçerli cebirsel ispat ya da karşı örnektir?</p>${choices('proof',proofOptions(m))}`;
  if(k==='proof_counter')out+=`<p class="alg42-teacher">Bir karşı örnek, “her zaman” ifadesini çürütür. Yalnız birkaç olumlu örnek ispat için yeterli değildir.</p>`;
 }
 if(k==='algorithm_linear'){
  const order=[2,0,3,1].map(i=>({i,text:m.steps[i]}));
  out+=`<p>Adımlara doğru sırayla dokun. Seçimlerini geri almak için sıfırla.</p><div class="alg42-stepgrid">${order.map(o=>`<button data-step="${o.i}" type="button" ${state.order.includes(o.i)?'disabled':''}>${html(o.text)}</button>`).join('')}</div><div class="alg42-chosen"><strong>Benim sıram:</strong> ${state.order.length?state.order.map(i=>html(m.steps[i])).join(' → '):'Henüz adım seçmedin'}</div><div class="alg42-inputrow">${number('result','Son sonuç')}</div>`;
 }
 if(k==='algorithm_error'){
  out+=`<div class="alg42-model">${colorBox('Başlangıç',m.initial)}${colorBox('Yanlış ara sonuç',m.initial+m.offset)}${colorBox('Yanlış sonuç',m.wrongAnswer)}</div>`;
  out+=`<p>Hatalı algoritmanın ilk yanlış adımını seç:</p>${choices('badStep',['Başlangıç değeri','Önce toplama yapma','Sonucu yazma'])}<div class="alg42-inputrow">${number('result','Doğru sonuç')}</div>`;
 }
 out+=reason(m);stage.innerHTML=out;
 stage.querySelectorAll('[data-num]').forEach(el=>el.addEventListener('input',()=>{state[el.dataset.num]=el.value;const formula=stage.querySelector('.alg42-formula');if(formula){formula.textContent=`${state.a||'?'}x ${state.b!==''?(Number(state.b)<0?'− '+Math.abs(Number(state.b)):'+ '+state.b):'+ ?'}`}}));
 stage.querySelectorAll('[data-choice]').forEach(el=>el.onclick=()=>{state[el.dataset.choice]=Number(el.dataset.val);draw()});
 stage.querySelectorAll('[data-step]').forEach(el=>el.onclick=()=>{state.order.push(Number(el.dataset.step));draw()});
}
function render(t){task=t||null;wrap.hidden=!t;if(!t){stage.textContent='';return}state={a:'',b:'',x:'',boundary:'',result:'',direction:null,reason:null,proof:null,badStep:null,order:[]};$('alg42Mode').textContent=labels[t.atlas7Algebra.kind]||'Cebir';draw();announce('Model hazır. Çözümünü oluştur ve gerekçe seç.');}
const integer=v=>v!==''&&v!==null&&Number.isInteger(Number(v));
function verify(){if(!task)return;const m=task.atlas7Algebra,k=m.kind;let good=false;
 if(k==='combine'||k==='distribute')good=integer(state.a)&&integer(state.b)&&Number(state.a)===m.answer[0]&&Number(state.b)===m.answer[1];
 if(k==='equation')good=integer(state.x)&&Number(state.x)===m.answer&&m.a*Number(state.x)+m.b===m.c;
 if(k==='inequality')good=integer(state.boundary)&&Number(state.boundary)===m.boundary&&['<','≤','>','≥'][state.direction]===m.solutionSign;
 if(['proof_even','proof_consecutive','proof_counter'].includes(k))good=state.proof===0;
 if(k==='algorithm_linear')good=state.order.length===4&&state.order.every((v,i)=>v===i)&&integer(state.result)&&Number(state.result)===m.answer;
 if(k==='algorithm_error')good=state.badStep===1&&integer(state.result)&&Number(state.result)===m.answer;
 if(state.reason!==m.reason)good=false;
 if(!good){window.Atlas616Trace?.wrong(task,'7. sınıf cebir ve ilişkiler');announce('Henüz doğru değil. İşlemini, seçtiğin modeli ve matematiksel gerekçeyi tekrar kontrol et. İlerleme kaydedilmedi.','bad');return;}
 const id=task.id,saved={...state,order:[...state.order]};window.__atlasAlgebraVerified=id;$('answer').value=task.beklenen_yanit_veya_rubrik;$('check').click();window.__atlasAlgebraVerified=null;
 if(task?.id===id){state=saved;draw();announce('✓ Doğru! Gerekçen ve modelin eşleşiyor.','good');}
}
$('alg42Check').onclick=verify;$('alg42Hint').onclick=()=>task&&announce('💡 '+task.ipucu);$('alg42Reset').onclick=()=>task&&render(task);
document.addEventListener('atlas:taskrender',e=>render(tasks.get(String(e.detail?.id||''))));
})();
