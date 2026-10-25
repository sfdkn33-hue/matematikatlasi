(()=>{'use strict';
const $=id=>document.getElementById(id);
const wrap=$('atlas7Probability'),stage=$('prob41Stage'),messageArea=$('prob41Status');
if(!wrap||!stage||!messageArea||!window.ATLAS_DB)return;
const taskById=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas7Probability).map(t=>[String(t.id),t]));
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let task=null,state=null;
const typeLabels={sample:'Örnek uzay',complement:'Tümleyen olay',spinner:'Olasılık çarkı',bags:'Adil torba',rebalance:'Torbada denge',wheelcompare:'Eş olasılık',intersection:'Kesişim',disjoint:'Ayrık olay',regions:'Venn haritası'};
const pad=n=>String(n).padStart(2,'0');
function info(text,mode=''){messageArea.className='prob41-status '+mode;messageArea.textContent=text}
function buttons(items,field,selected){return `<div class="prob41-choices" role="group" aria-label="${safe(field)}">${items.map((x,i)=>`<button type="button" data-field="${field}" data-value="${safe(x.value)}" aria-pressed="${String(selected===x.value)}">${safe(x.label)}</button>`).join('')}</div>`}
function tiles(nums,selected,colors={}){return `<div class="prob41-tiles" role="group" aria-label="Kartları seç">${nums.map(n=>{let col=colors[n]||'';return `<button type="button" data-tile="${n}" aria-pressed="${String(selected.has(n))}" title="${col||'Kart'} ${n}">${n}</button>`}).join('')}</div>`}
function histogram(colors){let entries=Object.entries(colors);return `<div class="prob41-ball-groups">${entries.map(([name,num])=>`<div class="prob41-ball-group"><b>${safe(name)}: ${num}</b><div class="prob41-balls">${Array.from({length:num},()=>`<i class="prob41-ball ${name==='Kırmızı'?'red':name==='Mavi'?'blue':'yellow'}" aria-hidden="true"></i>`).join('')}</div></div>`).join('')}</div>`}
function wheel(segments){const n=segments.length;return `<div class="prob41-wheel" role="img" aria-label="${n} eş dilim: ${segments.map((s,i)=>`dilim ${i+1} ${s}`).join(', ')}" style="background:conic-gradient(${segments.map((s,i)=>`${s==='Kırmızı'?'#ee7892':s==='Mavi'?'#74b8e9':'#f3c569'} ${i*100/n}% ${(i+1)*100/n}%`).join(',')})"><div>${n} dilim</div></div><p class="prob41-sub">Dilimler eş büyüklükte. Her biri aynı olasılığa sahip.</p>`}
function setvisual(m){return `<div class="prob41-set-head"><div><b>A</b><span>${safe(m.labelA)}</span><p>${safe(m.A.join(', ')||'∅')}</p></div><div><b>B</b><span>${safe(m.labelB)}</span><p>${safe(m.B.join(', ')||'∅')}</p></div></div>`}
function venndiagram(m){return `<div class="prob41-venn" role="img" aria-label="İki kesişen A ve B olaylarının Venn şeması"><span class="prob41-v1">A</span><span class="prob41-v2">B</span><span class="prob41-mid">A ∩ B</span></div>`}
function numberInput(key,label,max=99){return `<label class="prob41-num"><span>${safe(label)}</span><input data-number="${key}" type="number" min="0" max="${max}" step="1" inputmode="numeric" placeholder="?" value="${safe(state[key])}"></label>`}
function fraction(){return `<div class="prob41-frac"><span>Olasılık</span>${numberInput('num','Uygun çıktı',100)}<b>/</b>${numberInput('den','Tüm çıktı',100)}</div>`}
function reasonBlock(m){return `<div class="prob41-reasons"><strong>Hangi matematiksel gerekçe doğrudur?</strong>${buttons(m.reasonChoices.map((x,i)=>({value:i,label:x})),'reason',state.reason)}</div>`}
function draw(){if(!task)return;const m=task.atlas7Probability,kind=m.kind;
 let out=`<div class="prob41-intro">Önce modeli incele, sonra kendi çözümünü oluştur.</div>`;
 if(['sample','complement','intersection'].includes(kind)){
  out+=`<p class="prob41-prompt">${kind==='complement'?'A olayına girmeyen kartları seç.':kind==='intersection'?'A ve B’de ortak olan kartları seç.':'A olayına giren kartları seç.'}</p>`;
  if(kind==='intersection')out+=setvisual(m);
  out+=tiles(m.space,state.selected);
  if(kind==='intersection')out+=buttons([{value:'ayrik',label:'Ayrık'},{value:'ortak',label:'Ayrık olmayan'}],'relation',state.relation);
  else out+=fraction();
 }
 if(kind==='spinner'){
  out+=wheel(m.segments);
  out+=`<p class="prob41-sub">${safe(m.labelA)} dilimleri seç (${m.segments.length} dilim).</p>`;
  let colors={};m.segments.forEach((c,i)=>colors[i+1]=c);
  out+=`<div class="prob41-sectors">${m.segments.map((c,i)=>`<button data-tile="${i+1}" type="button" data-color="${c}" aria-pressed="${state.selected.has(i+1)}">${pad(i+1)} · ${safe(c)}</button>`).join('')}</div>`+fraction();
  out+=`<button type="button" class="prob41-test" id="prob41Spin">🎡 Çarkı 12 kez çevir (deney)</button><p class="prob41-sub" id="prob41Trials">${state.trials?`12 denemede ${state.trials} kez ${safe(m.labelA)} geldi. Deney teorik kesri değiştirmez.`:'Deneyin sonucu her seferinde değişebilir; teorik olasılığı sektörlerden bul.'}</p>`;
 }
 if(['bags','rebalance'].includes(kind)){
  const colors={...m.colors}; if(kind==='rebalance' && Number.isInteger(+state.add) && state.add!=='')colors[state.addColor]=(colors[state.addColor]||0)+Math.max(0,+state.add);
  out+=histogram(kind==='rebalance'?m.colors:colors);
  if(kind==='rebalance' && state.add!=='' && state.addColor)out+=`<p class="prob41-preview">Ekledikten sonra: Kırmızı <strong>${colors['Kırmızı']}</strong> · Mavi <strong>${colors['Mavi']}</strong></p>`;
  if(kind==='bags')out+=buttons([{value:'equal',label:'Eşit olasılıklı'},{value:'unequal',label:'Eşit değil'}],'relation',state.relation);
  else out+=`<p class="prob41-prompt">Hangi renkten top eklemelisin?</p>`+buttons([{value:'Kırmızı',label:'Kırmızı ekle'},{value:'Mavi',label:'Mavi ekle'}],'addColor',state.addColor)+numberInput('add','Kaç top eklenecek?',30);
 }
 if(kind==='wheelcompare'){out+=wheel(m.segments)+histogram(m.colors)+buttons([{value:'equal',label:'Eşit olasılıklı'},{value:'unequal',label:'Eşit değil'}],'relation',state.relation)}
 if(kind==='disjoint'){out+=setvisual(m)+numberInput('count','Ortak çıktı sayısı',40)+buttons([{value:'ayrik',label:'Ayrık'},{value:'ortak',label:'Ayrık olmayan'}],'relation',state.relation)}
 if(kind==='regions'){out+=setvisual(m)+venndiagram(m)+`<p class="prob41-prompt">${m.probe} sayısı hangi bölgededir?</p>`+buttons([{value:'A',label:'Yalnız A'},{value:'AB',label:'A ∩ B'},{value:'B',label:'Yalnız B'},{value:'D',label:'İkisinin dışı'}],'zone',state.zone)+numberInput('count','Kesişimde kaç sayı var?',40)}
 out+=reasonBlock(m);stage.innerHTML=out;
 stage.querySelectorAll('[data-tile]').forEach(b=>b.onclick=()=>{let v=Number(b.dataset.tile);state.selected.has(v)?state.selected.delete(v):state.selected.add(v);draw()});
 stage.querySelectorAll('[data-field]').forEach(b=>b.onclick=()=>{let f=b.dataset.field;state[f]=f==='reason'?Number(b.dataset.value):b.dataset.value;draw()});
 stage.querySelectorAll('[data-number]').forEach(inp=>{inp.addEventListener('input',()=>{state[inp.dataset.number]=inp.value});});
 const spin=$('prob41Spin');if(spin)spin.onclick=()=>{state.trials=Array.from({length:12},()=>m.segments[Math.floor(Math.random()*m.segments.length)]).filter(x=>x===m.labelA).length;$('prob41Trials').textContent=`12 denemede ${state.trials} kez ${m.labelA} geldi. Bu deney teorik olasılığı değiştirmez.`;};
}
function render(t){task=t;const m=t?.atlas7Probability;wrap.hidden=!m;if(!m){stage.replaceChildren();return}state={selected:new Set(),num:'',den:'',relation:null,reason:null,add:'',addColor:null,count:'',zone:null,trials:null};$('prob41Mode').textContent=typeLabels[m.kind]||'Olasılık';draw();info('Model hazır. Seçimini yap ve matematiksel gerekçeyi belirt.');}
function eqset(xs,ys){return xs.length===ys.length && xs.every(x=>ys.includes(x))}
function verify(){if(!task)return;const m=task.atlas7Probability,kind=m.kind;let good=false;
 const numerator=Number(state.num),denom=Number(state.den);const hasFraction=state.num.trim()!==''&&state.den.trim()!==''&&Number.isInteger(numerator)&&Number.isInteger(denom)&&denom>0&&numerator>=0&&numerator<=denom;
 const fractionOK=hasFraction&&(numerator*m.fraction[1]===m.fraction[0]*denom);
 const chosen=[...state.selected].sort((a,b)=>a-b),target=m.target?.slice().sort((a,b)=>a-b);
 if(['sample','complement','spinner'].includes(kind))good=eqset(chosen,target)&&fractionOK;
 else if(kind==='intersection')good=eqset(chosen,target)&&state.relation===(m.isDisjoint?'ayrik':'ortak');
 else if(['bags','wheelcompare'].includes(kind))good=state.relation===(m.equal?'equal':'unequal');
 else if(kind==='rebalance')good=state.addColor===m.addColor&&state.add!==''&&Number.isInteger(+state.add)&&+state.add===m.addCount;
 else if(kind==='disjoint')good=state.count!==''&&Number.isInteger(+state.count)&&+state.count===m.count&&state.relation===(m.isDisjoint?'ayrik':'ortak');
 else if(kind==='regions')good=state.zone===m.correctZone&&state.count!==''&&Number.isInteger(+state.count)&&+state.count===m.count;
 if(state.reason!==m.reason)good=false;
 if(!good){info('Henüz doğru değil. Olayın çıktılarını, hesaplamanı ve seçtiğin gerekçeyi yeniden kontrol et. İlerleme kaydedilmedi.','bad');return}
 const previous=task,saved={...state,selected:new Set(state.selected)};
 window.__atlasProbabilityVerified=task.id; $('answer').value=task.beklenen_yanit_veya_rubrik; $('check').click(); window.__atlasProbabilityVerified=null;
 if(task?.id===previous.id){state=saved;draw();info('✓ Doğru! '+m.why,'good')}
}
$('prob41Verify').onclick=verify;$('prob41Hint').onclick=()=>task&&info('💡 '+task.ipucu);$('prob41Reset').onclick=()=>task&&render(task);
document.addEventListener('atlas:taskrender',e=>render(taskById.get(String(e.detail?.id||''))));
})();
