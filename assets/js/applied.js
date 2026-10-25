/* Matematik Atlası v1.5 — 6. sınıf uygulamalı problemler ve uzunluk laboratuvarı */
(()=>{'use strict';
const root=document.getElementById('appliedLab');let current=null;
const $=id=>document.getElementById(id);
const unitMm={km:1000000,m:1000,dm:100,cm:10,mm:1};
const unitNames={km:'Kilometre',m:'Metre',dm:'Desimetre',cm:'Santimetre',mm:'Milimetre'};
let drafts={};try{drafts=JSON.parse(localStorage.getItem('mathAtlasAppliedReasons')||'{}')||{}}catch(e){}
function node(parent,tag,text='',cls=''){const x=document.createElement(tag);if(cls)x.className=cls;if(text!==null)x.textContent=String(text);parent.appendChild(x);return x}
function button(parent,text,callback,cls=''){const x=node(parent,'button',text,'ap-btn '+cls);x.type='button';x.addEventListener('click',callback);return x}
function pnum(raw){const s=String(raw||'').trim().replace(/\s/g,'');if(!/^[+-]?\d+(?:[.,]\d+)?(?:\/\d+)?$/.test(s))return NaN;
if(s.includes('/')){const a=s.split('/');return Number(a[0])/Number(a[1])}return Number(s.replace(',','.'))}
function close(a,b){return Number.isFinite(a)&&Math.abs(a-b)<0.000001}
function format(n){return Number(n).toLocaleString('tr-TR',{maximumFractionDigits:4})}
function fraction(n,d){return d===1?String(n):n+'/'+d}
function reasonBox(controls,task,required=false){const x=node(controls,'label',null,'ap-field');node(x,'span',required?'Gerekçeni yaz (isteğe bağlı; otomatik puanlanmaz):':'Çözümünü gerekçelendir (isteğe bağlı; isteğe bağlı nottur):');const a=node(x,'textarea');a.rows=2;a.placeholder='Nasıl düşündün? Hangi işlemi seçtin?';a.value=drafts[task.id]||'';a.addEventListener('input',()=>{drafts[task.id]=a.value;try{localStorage.setItem('mathAtlasAppliedReasons',JSON.stringify(drafts))}catch(e){}});return a}
function numeric(controls,label){const l=node(controls,'label',null,'ap-field');node(l,'span',label);const i=node(l,'input');i.type='text';i.inputMode='decimal';i.autocomplete='off';i.placeholder='Örn. 1,25 veya 5/4';return i}
function choice(controls,options,label='Seçimini yap:'){const box=node(controls,'fieldset',null,'ap-choose');const legend=node(box,'legend',label);legend.className='ap-help';const row=node(box,'div',null,'ap-choices');let value=null;const bts=[];for(const op of options){const name=Array.isArray(op)?op[1]:op;const key=Array.isArray(op)?op[0]:op;const b=button(row,name,()=>{value=key;bts.forEach(k=>k.setAttribute('aria-pressed',String(k===b)))},'ap-option');b.setAttribute('aria-pressed','false');bts.push(b)}return ()=>value}
function cards(stage,arr){const pane=node(stage,'div',null,'ap-cards');for(const [name,value] of arr){const c=node(pane,'div',null,'ap-card');node(c,'small',name);node(c,'strong',value)}return pane}
function fractionBars(stage,n,d,caption){node(stage,'p',caption,'ap-help');const bar=node(stage,'div',null,'ap-fracbar');bar.style.gridTemplateColumns=`repeat(${d},minmax(0,1fr))`;for(let k=0;k<d;k++)node(bar,'span',null,'ap-bit'+(k<n?' ap-fill':''));bar.setAttribute('role','img');bar.setAttribute('aria-label',`${d} eş parçadan ${n} parça`)}
function live(text,bad=false){const e=$('apStatus');if(!e)return;e.textContent=(bad?'⚠ ':'')+text;e.dataset.error=String(bad)}
function checkResult(ok,details){if(!ok){live('Matematiksel model veya sonuç henüz doğru değil. İpucunu inceleyerek yeniden dene.',true);return false}return true}
function render(task,onDone){if(!root)return;root.hidden=!Boolean(task.appliedLab);root.replaceChildren();if(!task.appliedLab){current=null;return}
const c=task.appliedLab,st={task,done:false};current=st;
node(root,'div','6. SINIF · SEÇ · MODELLE · DOĞRULA','ap-kicker');node(root,'h3',c.label);
const stage=node(root,'div',null,'ap-stage'),controls=node(root,'div',null,'ap-controls'),actions=node(root,'div',null,'ap-actions');
const status=node(root,'div','Göreve uygun modeli kur, sonucunla karşılaştır.','ap-status');status.id='apStatus';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
node(root,'p','Bu uygulama sayısal sonuçları ve model seçimlerini kontrol eder. Açık uçlu açıklamanın anlamını sistem puanlamaz. Cetvel sanal bir ölçme modelidir.','ap-note');
let valid=()=>false, focus=()=> 'model', mathTouched=false;
const choicesReady=()=>[...controls.querySelectorAll('fieldset')].every(f=>!!f.querySelector('button[aria-pressed="true"]'));
const numericReady=()=>[...controls.querySelectorAll('input[type="text"]')].every(i=>i.value.trim()!=='' && Number.isFinite(pnum(i.value)));
const mathReady=()=>mathTouched&&choicesReady()&&numericReady();
controls.addEventListener('click',e=>{if(e.target.closest('button'))mathTouched=true});
controls.addEventListener('input',e=>{if(e.target.matches('input:not([type=hidden]),select'))mathTouched=true});
controls.addEventListener('change',e=>{if(e.target.matches('input,select'))mathTouched=true});

const finish=()=>{if(st.done)return;let good=false;try{good=valid()}catch(e){live('Girdi kontrol edilemedi; biçimini yeniden incele.',true);return}if(!good&&mathReady())window.Atlas620Trace?.wrong(task,'6. sınıf uygulamalı problemler',focus(),controls);
if(!checkResult(good))return;st.done=true;live('✅ '+c.explanation);onDone()};
const expectNumber=(i,val)=>close(pnum(i.value),val);
switch(c.mode){
case 'sale':{
 cards(stage,[['Birim fiyat',`${c.price} TL`],['İndirim',`%${c.discount}`],['Adet',c.quantity],['Teslimat',`${c.shipping} TL`]]);
 const plan=choice(controls,[['indirim-adet-teslimat','Önce indirim, sonra adet ve teslimat'],['adet-indirim-iptal','Teslimat da indirimli'],['adet-sonra-indirim','Teslimatı önce fiyata ekle']],'İşlem planını seç:');
 const ans=numeric(controls,'Ödenecek toplam (TL)');
 focus=()=>plan()!==c.strategy?'operation':'amount';valid=()=>plan()===c.strategy&&expectNumber(ans,c.answer);break;
}
case 'recipe':{
 fractionBars(stage,c.numerator,c.denominator,'Başlangıç miktarının kesir modeli:');
 cards(stage,[['Başlangıç',fraction(c.numerator,c.denominator)+' litre'],['Ölçek',fraction(c.factorNum,c.factorDen)+' kat']]);
 const op=choice(controls,['×','÷','+'],'Tarifi büyütme/küçültme işlemi hangisi?');const ans=numeric(controls,'Yeni karışım miktarı (litre)');
 focus=()=>op()!=='×'?'operation':'quantity';valid=()=>op()==='×'&&expectNumber(ans,c.answerNum/c.answerDen);break;
}
case 'share':{
 fractionBars(stage,c.numerator,c.denominator,'Toplam içecek miktarı:');
 const label=node(stage,'p','Paylaştırılan kişi sayısı: 1','ap-live');const slider=node(controls,'input');slider.type='range';slider.min='1';slider.max='10';slider.step='1';slider.value='1';slider.setAttribute('aria-label','Eşit paylaşan kişi sayısı');slider.oninput=()=>label.textContent='Paylaştırılan kişi sayısı: '+slider.value;
 const ans=numeric(controls,'Bir kişinin aldığı miktar (litre)');focus=()=>Number(slider.value)!==c.groups?'groups':'shareValue';valid=()=>Number(slider.value)===c.groups&&expectNumber(ans,c.answerNum/c.answerDen);break;
}
case 'route':{
 cards(stage,[['İlk yol',format(c.a/100)+' km'],['İkinci yol',format(c.b/100)+' km'],['Geri dönüş',format(c.c/100)+' km']]);
 const op=choice(controls,[['topla-sonra-çıkar','Önce topla, sonra geri dönüşü çıkar'],['hepsini-topla','Üç uzunluğu da topla'],['ilkinden-çıkar','Yalnız ilk yoldan çıkar']],'Rota işlemini belirle:');
 const ans=numeric(controls,'Başlangıca göre net uzaklık (km)');focus=()=>op()!==c.strategy?'operation':'distance';valid=()=>op()===c.strategy&&expectNumber(ans,c.answer);break;
}
case 'budget':{
 cards(stage,[['Bütçe',c.budget+' TL'],['Malzeme',fraction(c.numerator,c.denominator)+' bütçe'],['Ulaşım','%'+c.percent]]);
 const bar=node(stage,'div',null,'ap-budgetbar');const px=c.numerator/c.denominator*100;const blocks=[[px,'ap-budget-main'],[c.percent,'ap-budget-side'],[100-px-c.percent,'ap-budget-left']];blocks.forEach(([width,klass])=>{const d=node(bar,'span',null,klass);d.style.width=width+'%' });
 const ch=choice(controls,['Kesir gideri','Yüzde gideri','Eşit gider'],'Hangi gider daha büyük?');const ans=numeric(controls,'Kalan bütçe (TL)');focus=()=>ch()!==c.larger?'comparison':'remaining';valid=()=>ch()===c.larger&&expectNumber(ans,c.answer);break;
}
case 'error':{
 cards(stage,[['İlk miktar',fraction(c.n,c.d)+' litre'],['Kap/ölçek',fraction(c.m,c.q)+' litre'],['Öğrenci cevabı',fraction(c.wrongNum,c.wrongDen)]]);
 node(stage,'p','Öğrenci yanlış bir işlem kullanmış. Önce doğru işlemi, sonra doğru sonucu bul.','ap-help');
 const op=choice(controls,['×','÷','+','−'],'Doğru işlem sembolü:');const ans=numeric(controls,'Düzeltilmiş sonuç');focus=()=>op()!==c.operation?'operation':'result';valid=()=>op()===c.operation&&expectNumber(ans,c.answerNum/c.answerDen);break;
}
case 'convert':{
 cards(stage,[['Başlangıç',c.value+' '+c.source],['İstenen birim',unitNames[c.target]],['Birim merdiveni','km ↔ m ↔ dm ↔ cm ↔ mm']]);
 const operation=c.source===c.target?'=':unitMm[c.source]>unitMm[c.target]?'×':'÷';
 const ch=choice(controls,['×','÷','='],'Dönüşümde büyüklük sayısal olarak nasıl değişir?');const ans=numeric(controls,`Sonuç (${c.target})`);focus=()=>ch()!==operation?'unitRule':'converted';valid=()=>ch()===operation&&expectNumber(ans,c.answerNum/c.answerDen);break;
}
case 'ruler':{
 const ruler=node(stage,'div',null,'ap-ruler');const ticks=node(ruler,'div',null,'ap-ticks');for(let i=0;i<=25;i++){const tick=node(ticks,'span',i%5===0?String(i/2):'','ap-tick'+(i%5===0?' ap-major':''));tick.title=(i*0.5)+' cm'}
 const line=node(ruler,'div',null,'ap-ruler-line');const dot=node(line,'span',null,'ap-ruler-dot');const lab=node(stage,'p','İşaret: 0 cm','ap-live');
 const slider=node(controls,'input');slider.type='range';slider.min='0';slider.max=String(c.maxMm);slider.step='5';slider.value='0';slider.setAttribute('aria-label','Cetveldeki sanal noktanın konumu');const update=()=>{const v=Number(slider.value);dot.style.left=(v/c.maxMm*100)+'%';lab.textContent='İşaret: '+format(v/10)+' cm'};slider.addEventListener('input',update);update();focus=()=> 'position';valid=()=>Number(slider.value)===c.targetMm;break;
}
case 'choose':{
 cards(stage,[['Ölçülecek nesne',c.object]]);
 const ch=choice(controls,c.choices,'En uygun ölçme birimi:');const why=reasonBox(controls,task,true);focus=()=> 'unit';focus=()=> 'estimate';valid=()=>ch()===c.correct;break;
}
case 'compare':{
 cards(stage,[['A uzunluğu',c.a+' '+c.unitA],['B uzunluğu',c.b+' '+c.unitB]]);
 const max=Math.max(c.valueCm,c.otherCm);const graph=node(stage,'div',null,'ap-compare');for(const [name,value] of [['A',c.valueCm],['B',c.otherCm]]){const row=node(graph,'div',null,'ap-compare-row');node(row,'b',name);const track=node(row,'div',null,'ap-compare-track');const fill=node(track,'span',null,'ap-compare-fill');fill.style.width=(100*value/max)+'%'}
 const ch=choice(controls,['<','=','>'],'A ile B arasındaki ilişki:');const ans=numeric(controls,'A uzunluğunu santimetreye çevir (cm)');focus=()=>ch()!==c.correct?'sign':'length';valid=()=>ch()===c.correct&&expectNumber(ans,c.valueCm);break;
}
case 'compose':{
 const count=[0,0,0,0],units=['m','dm','cm','mm'],parts=[1000,100,10,1],displays=[];
 node(stage,'p','Birim bloklarını ekleyip çıkararak hedef uzunluğu oluştur. Farklı eşdeğer çözümler de kabul edilir.','ap-help');const row=node(controls,'div',null,'ap-stepgroup');const stat=node(stage,'p','Toplam: 0 m','ap-live');
 const sync=()=>{displays.forEach((d,i)=>d.textContent=count[i]+' '+units[i]);stat.textContent='Toplam: '+format(count.reduce((a,x,i)=>a+x*parts[i],0)/1000)+' m'};
 units.forEach((name,i)=>{const b=node(row,'div',null,'ap-step');node(b,'span',unitNames[name]);button(b,'−',()=>{count[i]=Math.max(0,count[i]-1);sync()},'ap-small');const number=node(b,'b','0 '+name);displays.push(number);button(b,'+',()=>{count[i]=Math.min(c.max[i],count[i]+1);sync()},'ap-small')});sync();focus=()=> 'blocks';valid=()=>count.reduce((a,x,i)=>a+x*parts[i],0)===c.targetMm;break;
}
case 'estimate':{
 cards(stage,[['Tahmin edilecek',c.object]]);
 const ch=choice(controls,c.choices,'En mantıklı yaklaşık değer:');const why=reasonBox(controls,task,true);valid=()=>ch()===c.correct;break;
}
default:live('Bilinmeyen oyun türü.',true);return;
}
button(actions,'✓ Modelimi doğrula',finish);
button(actions,'💡 İpucu',()=>live('💡 '+c.hint));
button(actions,'↻ Yeniden başlat',()=>render(task,onDone),'ap-alt');
}
window.MatematikAtlasApplied={render,parseNumber:pnum};
})();
