/* Matematik Atlası v2.5: 150 new 5th grade fraction challenges. Standalone dependency-free. */
(()=>{'use strict';
const root=document.getElementById('fraction5PlusLab');if(!root)return;
const KEY='mathAtlasFraction5PlusNotes';let notes={};try{notes=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){}
const titles={stripPaint:'Kesir Şeridi İnşası',hundredGrid:'Yüzlük Pano Boyama',representationMatch:'Gösterim Eşleştirme',numberLine:'Sayı Doğrusu Haritacısı',equivalenceBridge:'Denklik Köprüsü',mixedImproper:'Bileşik Kesir Dönüştürücü',pizzaShare:'Paylaşım Masası',percentDial:'Yüzde Çarkı',numberLineDuel:'Çift Nokta Düellosu',compareSigns:'Çapraz Çarpım Dedektifi',sortCards:'Gösterim Sıralama Yarışı',closestAnchor:'Referans Noktası Avı',errorDetect:'Yanlış Çıkarım Avcısı',fractionRelay:'Aralık Köprüsü',budgetChoice:'Kaynak Paylaştırma Stratejisi'};
const mk=(p,tag,txt,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined&&txt!==null)e.textContent=String(txt);p.appendChild(e);return e};
const fmt=(v)=>Number(v).toLocaleString('tr-TR',{maximumFractionDigits:3});
const svgNS='http://www.w3.org/2000/svg';
function svgEl(parent,tag,atts,text){const e=document.createElementNS(svgNS,tag);for(const [key,val]of Object.entries(atts||{}))e.setAttribute(key,String(val));if(text!=null)e.textContent=text;parent.append(e);return e}
let current=null;
function renderVisual(s){const c=s.config,v=c.visual,mode=c.mode,out=s.visual;out.replaceChildren();
 if(['stripPaint','hundredGrid'].includes(mode)){
  const capacity=mode==='hundredGrid'?100:v.capacity;
  mk(out,'p',mode==='hundredGrid'?'Her kare bütünün %1’idir. Satır başlığına dokunarak 10 kareyi birlikte boyayabilirsin.':'Her düğme bütünden eş büyüklükte bir parçayı temsil eder.','f5-hint');
  const board=mk(out,'div',null,'f5-paint '+(capacity===100?'f5-hundred':'f5-strip'));
  for(let i=0;i<capacity;i++){
   if(capacity===100&&i%10===0){const row=mk(board,'button',(i/10+1)+'. satır','f5-row-select');row.type='button';row.dataset.row=i/10;row.onclick=()=>{const ids=Array.from({length:10},(_,j)=>i+j),full=ids.every(n=>s.paint.has(n));ids.forEach(n=>full?s.paint.delete(n):s.paint.add(n));s.values.paint=s.paint.size;renderVisual(s)};}
   const b=mk(board,'button','',s.paint.has(i)?'f5-cell marked':'f5-cell');b.type='button';b.dataset.cell=i;b.setAttribute('aria-pressed',String(s.paint.has(i)));b.setAttribute('aria-label',(i+1)+'. eş parça');b.onclick=()=>{s.paint.has(i)?s.paint.delete(i):s.paint.add(i);s.values.paint=s.paint.size;renderVisual(s)};
  }
  mk(out,'div',s.paint.size+' / '+capacity+' parça boyandı','f5-count');return;
 }
 if(mode==='percentDial'){
  const n=Number(s.values.dial??0),pic=mk(out,'div',null,'f5-dial');pic.style.background=`conic-gradient(#2dd4bf ${n*3.6}deg,#193e57 0)`;
  mk(pic,'span','%'+n);return;
 }
 if(['numberLine','numberLineDuel','closestAnchor','fractionRelay','sortCards','errorDetect','compareSigns','budgetChoice'].includes(mode)){
  const panel=mk(out,'div',null,'f5-line-panel');const ssvg=svgEl(panel,'svg',{viewBox:'0 0 700 140',role:'img','aria-label':'Kesirlerin sayı doğrusu gösterimi'});
  svgEl(ssvg,'line',{x1:55,y1:65,x2:645,y2:65,stroke:'#8ba9be','stroke-width':4});
  const max=mode==='numberLine'?2:1;
  for(let i=0;i<=10;i++){const x=55+590*i/10;svgEl(ssvg,'line',{x1:x,y1:59,x2:x,y2:72,stroke:'#9cdce5','stroke-width':1.6});if(i%5===0)svgEl(ssvg,'text',{x,y:97,fill:'#e2eff5','text-anchor':'middle','font-size':17},fmt(i*max/10))}
  const dots=[];
  if(mode==='numberLine')dots.push(['Seçim',Number(s.values.marker??0)/100]);
  if(mode==='numberLineDuel')dots.push(['A',Number(s.values.markerA??0)/100],['B',Number(s.values.markerB??0)/100]);
  if(mode==='closestAnchor')dots.push(['Referans',v.anchor]);
  if(mode==='compareSigns'||mode==='errorDetect')dots.push(['A',v.av],['B',v.bv]);
  if(mode==='fractionRelay'){const a=v.low.split('/').map(Number),b=v.high.split('/').map(Number);dots.push(['Alt sınır',a[0]/a[1]],['Üst sınır',b[0]/b[1]])}
  for(let i=0;i<dots.length;i++){const [label,value]=dots[i];const x=55+590*value/max;svgEl(ssvg,'circle',{cx:x,cy:65,r:8,fill:['#2dd4bf','#fca5a5','#e5c87e'][i%3]});svgEl(ssvg,'text',{x,y:38-9*(i%2),fill:'#effafc','text-anchor':'middle','font-size':15},label)}
  if(mode==='sortCards')mk(out,'p','Kartlara soldan sağa değil, değerlerinin küçükten büyüğe sırasına göre dokun.','f5-hint');
  if(mode==='errorDetect')mk(out,'p',v.a+' '+v.claim+' '+v.b+' — Robotun iddiasını incele.','f5-claim');
  if(mode==='budgetChoice')mk(out,'p','Kartların nicelikleri farklı gösterimlerle ifade ediliyor.','f5-hint');
  return;
 }
 if(['equivalenceBridge','mixedImproper','pizzaShare','representationMatch'].includes(mode)){
  const total=v.den||10, numerator=v.num||v.percent/100*total;const row=mk(out,'div',null,'f5-rep-model');
  if(mode==='representationMatch'){mk(row,'div',`${numerator} / ${total}`,'f5-big');mk(row,'div','⇄','f5-big');mk(row,'div','% ?   ·   0, ?','f5-big');return;}
  const whole=Math.floor(numerator/total),rem=numerator%total;
  const count=Math.min(5,Math.ceil(numerator/total));for(let w=0;w<count;w++){
   const bar=mk(row,'div',null,'f5-model-whole');bar.setAttribute('aria-label',(w+1)+'. bütün');
   const tiles=total>10?10:total;for(let i=0;i<tiles;i++){
    const amount=total>10?numerator*10/total:numerator;
    const on=w*tiles+i<amount;mk(bar,'span','',on?'f5-filled':'');
   }
  }
  if(mode==='equivalenceBridge')mk(out,'p',`İlk model: ${numerator}/${total} · Yeni modelde payda ${total*v.factor} olacak.`,'f5-hint');
  if(mode==='pizzaShare')mk(out,'p',`Tepsi sayısı: ${whole} tam + ${rem}/${total} tepsi`,'f5-hint');
  return;
 }
 }
function valid(s){const c=s.config;for(const f of c.fields){const x=s.values[f.key],y=f.answer;if(x===undefined||x===null)return false;
 if(f.kind==='sequence'){if(!Array.isArray(x)||x.length!==y.length||!x.every((v,i)=>v===y[i]))return false}
 else if(f.kind==='number'||f.kind==='range'||f.kind==='paint'){if(x===''||!Number.isFinite(Number(x))||Math.abs(Number(x)-Number(y))>1e-7)return false}
 else if(String(x)!==String(y))return false;
 }return true;}
function field(s,f){const box=mk(s.fields,'fieldset',null,'f5-field');mk(box,'legend',f.label);
 if(f.kind==='paint'){mk(box,'p','Üstteki karelere dokunarak modelini oluştur.','f5-hint');return;}
 if(f.kind==='sequence'){
  const opts=mk(box,'div',null,'f5-choices');const show=mk(box,'p','Seçilen sıra: (henüz yok)','f5-selection');
  for(const [i,card]of s.config.visual.cards.entries()){
   const b=mk(opts,'button',card.label,'f5-choice');b.type='button';b.dataset.sequence=i;b.onclick=()=>{s.values.sequence=s.values.sequence||[];if(s.values.sequence.includes(i))return;s.values.sequence.push(i);b.disabled=true;show.textContent='Sıra: '+s.values.sequence.map(idx=>s.config.visual.cards[idx].label).join(' → ')};
  }
  const back=mk(opts,'button','↶ Sıralamayı temizle','f5-alt');back.type='button';back.onclick=()=>{s.values.sequence=[];opts.querySelectorAll('button[data-sequence]').forEach(b=>b.disabled=false);show.textContent='Seçilen sıra: (henüz yok)'};return;
 }
 if(f.kind==='choice'){
  const opts=mk(box,'div',null,'f5-choices');const choices=[...new Set(f.options.map(String))],shift=s.config.seed%choices.length;choices.push(...choices.splice(0,shift));
  for(const [idx,val]of choices.entries()){let lbl=val;
   if(['winner','between'].includes(f.key)&&['closestAnchor','budgetChoice'].includes(s.config.mode)){lbl=s.config.visual.cards?.[Number(val)]?.label||val;}
   const b=mk(opts,'button',lbl,'f5-choice');b.type='button';b.dataset.choiceKey=f.key;b.dataset.choice=val;b.onclick=()=>{s.values[f.key]=val;opts.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button===b)));if(s.config.mode==='percentDial')renderVisual(s)};b.setAttribute('aria-pressed','false');
  }return;
 }
 if(f.kind==='range'){
  const slider=mk(box,'input',null,'f5-range');slider.type='range';slider.min=f.min;slider.max=f.max;slider.step=f.step||1;slider.value=f.min;slider.dataset.rangeKey=f.key;
  const output=mk(box,'output',String(f.min),'f5-output');const precise=mk(box,'input',null,'f5-number');precise.type='number';precise.min=f.min;precise.max=f.max;precise.step=f.step||1;precise.setAttribute('aria-label',f.label+' sayısal giriş');precise.placeholder='Sayıyı buraya da yazabilirsin';
  slider.oninput=()=>{s.values[f.key]=Number(slider.value);output.textContent=slider.value;precise.value=slider.value;renderVisual(s)};
  precise.oninput=()=>{if(precise.value===''){delete s.values[f.key];return;}const n=Number(precise.value);if(Number.isFinite(n)&&n>=f.min&&n<=f.max){s.values[f.key]=n;slider.value=n;output.textContent=String(n);renderVisual(s)}};return;
 }
 const input=mk(box,'input',null,'f5-number');input.type='number';input.step='any';input.inputMode='decimal';input.dataset.numberKey=f.key;input.placeholder='Sonucu yaz';input.oninput=()=>{const raw=input.value.trim();if(raw===''){delete s.values[f.key];return;}s.values[f.key]=Number(raw.replace(',','.'))};
}
function render(task,finish){root.hidden=!task.fraction5PlusLab;root.replaceChildren();if(!task.fraction5PlusLab){current=null;return}
 const c=task.fraction5PlusLab,s={task,config:c,finish,paint:new Set(),values:{},reason:notes[task.id]||'',done:false};current=s;root.dataset.mode=c.mode;root.dataset.taskId=task.id;
 mk(root,'div','5. SINIF · KESİRLER · TEMSİL / ÇIKARIM','f5-kicker');mk(root,'h3',titles[c.mode]);mk(root,'p',task.gorev,'f5-prompt');s.visual=mk(root,'div',null,'f5-visual');s.fields=mk(root,'div',null,'f5-fields');renderVisual(s);for(const f of c.fields)field(s,f);
 if(c.requireReason){const block=mk(root,'div',null,'f5-reason');const label=mk(block,'label','Matematiksel gerekçeni yaz (isteğe bağlı nottur):');label.htmlFor='f5Reason';const inp=mk(block,'textarea',null);inp.id='f5Reason';inp.rows=3;inp.placeholder='Hangi modele veya karşılaştırma kuralına göre karar verdin?';inp.value=s.reason;inp.oninput=()=>{s.reason=inp.value;notes[task.id]=s.reason;try{localStorage.setItem(KEY,JSON.stringify(notes))}catch(e){}};}
 s.status=mk(root,'p','Modelini oluştur, bütün kararlarını ver ve kontrol et.','f5-status');s.status.id='f5Status';s.status.setAttribute('role','status');s.status.setAttribute('aria-live','polite');const actions=mk(root,'div',null,'f5-actions');
 const verify=mk(actions,'button','✓ Modelimi kontrol et','f5-primary');verify.type='button';verify.onclick=()=>{if(s.done)return;if(!valid(s)){
   // A partially built model is not a mathematically evaluated wrong attempt.
   const incomplete=c.fields.find(f=>s.values[f.key]===undefined||s.values[f.key]===null||s.values[f.key]===''||(f.kind==='sequence'&&(!Array.isArray(s.values[f.key])||s.values[f.key].length!==f.answer.length)));
   if(incomplete){s.status.textContent='Önce “'+incomplete.label+'” alanını tamamla. Eksik model yanlış olarak kaydedilmedi.';s.status.classList.add('f5-error');return}
   const bad=c.fields.find(f=>{const x=s.values[f.key],y=f.answer;
    if(f.kind==='sequence')return !Array.isArray(x)||!x.every((v,i)=>v===y[i]);
    if(['number','range','paint'].includes(f.kind))return !Number.isFinite(Number(x))||Math.abs(Number(x)-Number(y))>1e-7;
    return String(x)!==String(y);
   });
   if(!bad)return; // Fail closed if the validator and evidence extraction ever disagree.
   const badIndex=c.fields.indexOf(bad);const focus=bad.kind==='number'?'hesap':(['choice','sequence'].includes(bad.kind)?'karar':'model');
   window.Atlas616Trace?.wrong(task,'5. sınıf kesir modelleri',{focus,wrongFields:[badIndex]});
   document.dispatchEvent(new CustomEvent('atlas:fractionfieldwrong',{detail:{taskId:task.id,fieldKey:bad.key,mode:c.mode,fieldKind:bad.kind}}));
   s.status.textContent='🔎 “'+bad.label+'” alanını yeniden incele. Hatanın nedeni hakkında kesin bir çıkarım yapılmıyor.';
   s.status.classList.add('f5-error');return
  } s.done=true;s.status.classList.remove('f5-error');s.status.textContent='✅ Matematiksel model doğrulandı. Çözümün incelemek için ekranda duruyor.';s.finish()};
 const hint=mk(actions,'button','💡 İpucu','f5-secondary');hint.type='button';hint.onclick=()=>{s.status.textContent=task.ipucu};
 const reset=mk(actions,'button','↻ Baştan başla','f5-secondary');reset.type='button';reset.onclick=()=>render(task,finish);
 mk(root,'p','Sayısal model ve seçimler otomatik kontrol edilir; gerekçenin anlamı isteğe bağlı nottur ve otomatik puanlanmaz. İlerleme yalnızca bu cihazda tutulur.','f5-note');
}
window.MatematikAtlasFraction5Plus={render,validateForTests:valid,getCurrentForTests:()=>current};
})();
