/* Matematik Atlası v1.6 · altıncı sınıf istatistik atölyesi · bağımlılıksız */
(()=>{'use strict';
const root=document.getElementById('researchLab');
let active=null;const $=id=>document.getElementById(id);
const make=(parent,tag,text='',cls='')=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==null)e.textContent=String(text);parent.append(e);return e};
const btn=(parent,label,fn,cls='')=>{const b=make(parent,'button',label,'rs-btn '+cls);b.type='button';b.addEventListener('click',fn);return b};
const stat=(message,bad=false)=>{let e=$('rsStatus');if(e){e.textContent=(bad?'⚠️ ':'')+message;e.dataset.error=String(bad)}};
const number=(val)=>{const s=String(val??'').trim().replace(',','.');return /^[-+]?\d+(\.\d+)?$/.test(s)?Number(s):NaN};
const close=(a,b,tol=.011)=>Number.isFinite(a)&&Math.abs(a-b)<tol;
const median=a=>{const b=[...a].sort((x,y)=>x-y),n=b.length;return (b[Math.floor((n-1)/2)]+b[Math.floor(n/2)])/2};
const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
let draft={};try{draft=JSON.parse(localStorage.getItem('mathAtlasResearchReasons')||'{}')||{}}catch(e){}
function reason(parent,task,required=false){const l=make(parent,'label',required?'Açıklaman (isteğe bağlı; puanlamaya dahil değil):':'Düşünceni açıklamak istersen yaz:','rs-field');const a=make(l,'textarea');a.rows=2;a.placeholder='Verinin ne söylediğini ve gerekçeni yaz...';a.value=draft[task.id]||'';a.addEventListener('input',()=>{draft[task.id]=a.value.slice(0,2000);try{localStorage.setItem('mathAtlasResearchReasons',JSON.stringify(draft))}catch(e){}});return a}
function input(parent,label){const l=make(parent,'label',label,'rs-field');const e=make(l,'input');e.type='text';e.inputMode='decimal';e.autocomplete='off';e.placeholder='Sonucu yaz';return e}
function options(parent,opts,label){const set=make(parent,'fieldset',null,'rs-pick');make(set,'legend',label);const row=make(set,'div',null,'rs-options');let selected=null;let buttons=[];
opts.forEach((v,i)=>{const b=btn(row,String(v),()=>{selected=i;buttons.forEach((el,k)=>el.setAttribute('aria-pressed',String(i===k)))},'rs-option');b.dataset.choice=String(i);b.setAttribute('aria-pressed','false');buttons.push(b)});return ()=>selected}
function cards(parent,items){const grid=make(parent,'div',null,'rs-cards');for(const [name,val] of items){const x=make(grid,'div',null,'rs-card');make(x,'small',name);make(x,'strong',val)}}
function chips(parent,values){const area=make(parent,'div',null,'rs-chips');for(const v of values)make(area,'span',v,'rs-chip');}
function bars(parent,labels,values,axisStart=0){const display=make(parent,'div',null,'rs-bars');display.setAttribute('role','img');display.setAttribute('aria-label',labels.map((x,i)=>`${x}: ${values[i]}`).join('; '));const hmax=Math.max(...values,axisStart+1);
labels.forEach((x,i)=>{const col=make(display,'div',null,'rs-bar-col');make(col,'b',values[i]);const track=make(col,'div',null,'rs-bar-track');const bar=make(track,'div',null,'rs-bar');bar.style.height=(Math.max(0,values[i]-axisStart)/(hmax-axisStart)*130)+'px';make(col,'small',x)});}
function countEditor(parent,labels,start,mode='columns'){
 const vals=labels.map((_,i)=>start?.[i]||0);const grid=make(parent,'div',null,'rs-count-grid');const fields=[];
 const draw=()=>{grid.replaceChildren();labels.forEach((label,i)=>{const x=make(grid,'div',null,'rs-counter');make(x,'strong',label);if(mode==='dots'){const dots=make(x,'div',null,'rs-dots');for(let t=0;t<vals[i];t++)make(dots,'span','●','rs-dot')}
 const r=make(x,'div',null,'rs-stepper');btn(r,'−',()=>{vals[i]=Math.max(0,vals[i]-1);draw()},'rs-minus').dataset.action='dec';make(r,'b',vals[i]);btn(r,'+',()=>{vals[i]=Math.min(50,vals[i]+1);draw()},'rs-plus').dataset.action='inc';});};draw();return ()=>vals;}
function render(task,onComplete){if(!root)return;root.hidden=!Boolean(task.researchLab);root.replaceChildren();if(!task.researchLab){active=null;return;}
const c=task.researchLab,s={task,done:false};active=s;
make(root,'div','6. SINIF · VERİ TOPLA · MODELLE · SORGULA','rs-kicker');make(root,'h3',c.title);
const scene=make(root,'div',null,'rs-scene'),ctrl=make(root,'div',null,'rs-controls'),actions=make(root,'div',null,'rs-actions');
const status=make(root,'div','Önce veriye bak, sonra modelini oluştur.','rs-status');status.id='rsStatus';status.setAttribute('aria-live','polite');status.setAttribute('role','status');
make(root,'p','Sayısal cevaplar ve model seçimleri otomatik kontrol edilir. Öğrencinin araştırma sorusunun özgünlüğü, gerekçeleri ve etik veri toplama davranışı isteğe bağlı nottur ve otomatik puanlanmaz. Kişisel bilgi girmeyin.','rs-note');
let validate=()=>false;
function finish(){if(s.done)return;let pass=false;try{pass=validate()}catch(e){stat('Girdi biçimini ve seçimini yeniden kontrol et.',true);return}if(!pass){stat('Model henüz doğru değil. Veriyi tekrar inceleyerek düzelt.',true);return} s.done=true;stat('✅ Doğru matematiksel model. Oluşturduğun veriyi ve kararını şimdi inceleyebilirsin.');onComplete()}
if(c.mode==='question'){
 cards(scene,[['Kriter','Veriyle cevaplanabilir, değişebilir, ölçülebilir']]);const q=options(ctrl,c.options,'En uygun araştırma sorusu:');const kind=options(ctrl,['Kesikli nicel','Kategorik','Sürekli nicel'],'Bu sorunun veri türü:');const note=reason(ctrl,task,true);
 validate=()=>q()===c.correct&&kind()===0;
}else if(c.mode==='sampling'||c.mode==='samplecrit'){
 make(scene,'p','Bir grubun bütününe ilişkin iddialarda yalnızca kolay ulaşılan kişiler değil, farklı öğrenci grupları temsil edilmelidir.');const pick=options(ctrl,c.options,'Daha savunulabilir örneklem planı:');const note=reason(ctrl,task,true);
 validate=()=>pick()===c.correct;
}else if(c.mode==='survey'){
 make(scene,'p',`Anonim gözlem kartları (${c.observations.length} gözlem):`);chips(scene,c.observations);const counts=countEditor(ctrl,c.labels,[],'columns');
 validate=()=>counts().every((v,i)=>v===c.counts[i]);
}else if(c.mode==='dotplot'){
 make(scene,'p','Her sayı bir gözlemdir. İlgili sütuna bir nokta eklemek için + düğmesine bas.');chips(scene,c.values);const vals=countEditor(ctrl,c.domain.map(String),[],'dots');
 validate=()=>vals().every((v,i)=>v===c.counts[i]);
}else if(c.mode==='stemleaf'){
 make(scene,'p','Kök onlar basamağını, yaprak birler basamağını gösterir. Yaprakları küçükten büyüğe sıralayarak ve aralarına boşluk koyarak yaz.');chips(scene,c.values);const inputs={};
 for(const stem of c.stems){const label=make(ctrl,'label',`Kök ${stem} | yapraklar:`,'rs-field');const i=make(label,'input');i.type='text';i.placeholder='Örn. 1 3 3 5';i.dataset.stem=String(stem);inputs[stem]=i}
 validate=()=>c.stems.every(stem=>inputs[stem].value.trim().replace(/\s+/g,' ')===c.leaves[stem]);
}else if(c.mode==='mean'){
 cards(scene,[['Gözlemler',c.values.join(' · ')],['Gözlem sayısı',String(c.values.length)]]);
 bars(scene,c.values.map((_,i)=>String(i+1)),c.values);const strategy=options(ctrl,['Toplamı gözlem sayısına böl','En büyük değeri seç','İlk ve son sayıyı topla'],'Aritmetik ortalama nasıl bulunur?');const sum=input(ctrl,'Verilerin toplamı:');const mean=input(ctrl,'Aritmetik ortalama:');
 validate=()=>strategy()===0&&close(number(sum.value),c.total)&&close(number(mean.value),c.answer);
}else if(c.mode==='median'){
 chips(scene,c.values);const sorted=make(scene,'div','Önce verileri sırala.','rs-preview');let didSort=false;
 btn(ctrl,'⇅ Küçükten büyüğe sırala',()=>{didSort=true;sorted.textContent='Sıralanmış: '+c.sorted.join(' · ')},'rs-alt');const middle=input(ctrl,'Ortanca:');const range=input(ctrl,'Açıklık:');
 validate=()=>didSort&&close(number(middle.value),c.median)&&close(number(range.value),c.spread);
}else if(c.mode==='cycle'){
 make(scene,'p','Her ↑ düğmesi bir adımı yukarı taşır. En iyi araştırma sırasını kur.');let steps=[...c.steps];const grid=make(ctrl,'div',null,'rs-cycle');
 function draw(){grid.replaceChildren();steps.forEach((step,i)=>{const row=make(grid,'div',null,'rs-cycle-row');make(row,'b',`${i+1}. ${step}`);const b=btn(row,'↑',()=>{if(i>0){[steps[i],steps[i-1]]=[steps[i-1],steps[i]];draw()}},'rs-alt');b.disabled=i===0;b.dataset.step=step})}draw();validate=()=>steps.every((v,i)=>v===c.correct[i]);
}else if(c.mode==='axis'){
 make(scene,'p','Grafikte alt sınır sıfır değil. Sütun yükseklikleri görsel olarak olduğundan çok farklı görünebilir.');const chart=make(scene,'div');bars(chart,['A','B'],[c.a,c.b],c.baseline);
 let zero=false;btn(ctrl,'↻ Eksen başlangıcını 0 yap',()=>{zero=true;chart.replaceChildren();bars(chart,['A','B'],[c.a,c.b],0)},'rs-alt');const diff=input(ctrl,'A ile B arasındaki gerçek fark:');
 validate=()=>zero&&close(number(diff.value),c.answer);
}else if(c.mode==='outlier'){
 cards(scene,[['Başlangıç verileri',c.values.join(', ')],['Ek veri',String(c.outlier)]]);let inserted=false;const current=make(scene,'p','Henüz aykırı gözlem eklenmedi.','rs-preview');btn(ctrl,'+ Aykırı değeri veri grubuna ekle',()=>{inserted=true;current.textContent='Yeni veri grubu: '+[...c.values,c.outlier].join(' · ')},'rs-alt');const mean=input(ctrl,'Yeni ortalama (iki ondalığa kadar):');const med=input(ctrl,'Yeni ortanca:');const preferred=options(ctrl,['Ortanca','Aritmetik ortalama','En büyük değer'],'Aykırı değerden daha az etkilenen özet:');
 validate=()=>inserted&&close(number(mean.value),c.mean,.012)&&close(number(med.value),c.median)&&preferred()===0;
}else if(c.mode==='compare'){
 cards(scene,[['A grubu',c.a.join(', ')],['B grubu',c.b.join(', ')]]);const a=input(ctrl,'A ortancası:');const b=input(ctrl,'B ortancası:');const pick=options(ctrl,['A','B','Eşit'],'Hangi grubun ortancası daha büyük?');
 validate=()=>close(number(a.value),c.medianA)&&close(number(b.value),c.medianB)&&['A','B','Eşit'][pick()]===c.correct;
}else if(c.mode==='claim'){
 cards(scene,c.labels.map((x,i)=>[x,c.counts[i]+' gözlem']));bars(scene,c.labels,c.counts);make(scene,'p',c.claim,'rs-claim');const value=input(ctrl,`${c.labels[c.target]} oranı (%; bir ondalık):`);const pick=options(ctrl,['Destekleniyor','Desteklenmiyor'],'İddia tabloda doğrulanıyor mu?');const note=reason(ctrl,task,true);
 validate=()=>close(number(value.value),c.percent,.06)&&pick()===1;
}else if(c.mode==='repair'){
 make(scene,'p','Gerçek tablo ve raporda gösterilen hatalı sütunlar:');cards(scene,[['Gerçek veri tablosu',c.labels.map((x,i)=>x+': '+c.real[i]).join('  ·  ')]]);bars(scene,c.labels,c.shown);const bad=options(ctrl,c.labels,'Hatalı sütun:');const fixed=input(ctrl,'Düzeltilmiş sütun yüksekliği:');
 validate=()=>bad()===c.wrong&&close(number(fixed.value),c.correct);
}
btn(actions,'✓ Araştırmayı kontrol et',finish).id='rsCheck';btn(actions,'💡 İpucu',()=>stat(task.ipucu),'rs-alt');
}
window.MatematikAtlasResearch={render};
})();
