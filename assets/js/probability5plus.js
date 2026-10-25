/* v2.9 · 5th grade subjective probability. 10 scenarios / 10 distinct interactions. */
(()=>{'use strict';
const root=document.getElementById('probability5PlusLab');if(!root)return;
const KEY='mathAtlasProbability5PlusNotes';
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_e){}
let current=null;
const modes=new Set(['spectrum','translate','bounds','uncertain','area','bagBuild','compare','fair','trials','ethics']);
function E(parent,tag,text,cls){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined&&text!==null)el.textContent=String(text);parent.appendChild(el);return el}
function B(parent,label,fn,cls){const b=E(parent,'button',label,cls||'p5-btn');b.type='button';b.addEventListener('click',fn);return b}
function choice(s,key,title,items){const wrap=E(s.controls,'div',null,'p5-field');E(wrap,'h4',title);const row=E(wrap,'div',null,'p5-choices');
 // Shift presentation order by task ordinal (prevents a fixed answer position).
 const ordered=[...items];let shift=(Number(s.task.gorev_no)||1)%ordered.length;ordered.push(...ordered.splice(0,shift));
 for(const item of ordered){const b=B(row,item.label,()=>{s.values[key]=item.value;for(const x of row.querySelectorAll('button'))x.setAttribute('aria-pressed',String(x===b));s.message.textContent='Seçimin kaydedildi. Diğer adımı da tamamla.'});b.dataset.key=key;b.dataset.value=String(item.value);b.setAttribute('aria-pressed',String(s.values[key]===item.value));}
 return row;
}
function numeric(s,key,title,min,max,step=5){const wrap=E(s.controls,'div',null,'p5-field');E(wrap,'h4',title);const range=E(wrap,'input');range.type='range';range.min=min;range.max=max;range.step=step;range.value=(s.values[key]??50);range.dataset.key=key;range.setAttribute('aria-label',title);const val=E(wrap,'p',null,'p5-reading');function redraw(){val.textContent='%'+(s.values[key]??50)+' · '+((s.values[key]??50)/100).toLocaleString('tr-TR',{maximumFractionDigits:2});}redraw();range.addEventListener('input',()=>{s.values[key]=Number(range.value);redraw()});E(wrap,'p','0 · imkânsız  ─────  1/2  ─────  1 · kesin','p5-caption');}
function colored(s,key,n,initial,label){const box=E(s.view,'div',null,'p5-gridwrap');E(box,'p',label,'p5-muted');const wheel=key==='wheel'?E(box,'div',null,'p5-wheel'):null;const grid=E(box,'div',null,'p5-grid');const arr=Array.from({length:n},(_,i)=>i<initial);s.bits[key]=arr;
 function draw(){grid.replaceChildren();for(let i=0;i<n;i++){const k=i;const button=B(grid,'',()=>{arr[k]=!arr[k];draw()},'p5-cell'+(arr[i]?' p5-cell-on':''));button.type='button';button.setAttribute('aria-label',`Bölme ${i+1}: ${arr[i]?'kırmızı':'mavi'}; rengi değiştir`);button.setAttribute('aria-pressed',String(arr[i]));button.dataset.cell=String(i);}
 const meter=box.querySelector('.p5-count');if(meter)meter.textContent=arr.filter(Boolean).length+'/'+n+' '+({'wheel':'kırmızı dilim','bag':'kırmızı top','area':'yeşil kare','illustration':'işaretli kart'}[key]||'bölme');if(wheel){wheel.style.background='conic-gradient('+arr.map((on,i)=>(on?'#ffc463':'#3989b2')+' '+(i*360/n)+'deg '+((i+1)*360/n)+'deg').join(',')+')';wheel.setAttribute('role','img');wheel.setAttribute('aria-label','Eşit çark: '+arr.filter(Boolean).length+' kırmızı, '+(n-arr.filter(Boolean).length)+' mavi dilim')}}
 E(box,'p',null,'p5-count');draw();return arr;}
function balls(s,red,blue,title){const section=E(s.view,'div',null,'p5-bag');E(section,'b',title);const row=E(section,'div',null,'p5-balls');for(let i=0;i<red;i++){const k=E(row,'span','●','p5-ball p5-red');k.setAttribute('aria-label','Kırmızı top')};for(let i=0;i<blue;i++){const k=E(row,'span','●','p5-ball p5-blue');k.setAttribute('aria-label','Mavi top')};E(section,'p',red+' kırmızı + '+blue+' mavi özdeş top','p5-caption')}
function present(s){const c=s.cfg,m=c.mode;
 if(m==='spectrum'){
  E(s.view,'div',`Çark: ${c.total} eş dilim, ${c.colored} tanesi sarı`,'p5-display');numeric(s,'percent','Sarı için tahmin: yüzde kaç?',0,100,10);
  choice(s,'secondary','Olasılığın sınırı hangisidir?',[{value:0,label:'-1 ile 1 arasında'},{value:1,label:'0 ile 1 arasında (ikisi de dâhil)'},{value:2,label:'1 ile 10 arasında'}]);
 }
 if(m==='translate'){
  colored(s,'illustration',c.total,c.colored,'İşaretli kartların görseli; kartlara dokunup modeli inceleyebilirsin.');
  choice(s,'percent','Yüzde gösterimi',[{value:40,label:'%40'},{value:4,label:'%4'},{value:60,label:'%60'}]);
  choice(s,'decimal','Ondalık gösterimi',[{value:'0,4',label:'0,4'},{value:'4,0',label:'4,0'},{value:'0,04',label:'0,04'}]);
  choice(s,'fraction','Sadeleşmiş kesir gösterimi',[{value:'2/5',label:'2/5'},{value:'4/5',label:'4/5'},{value:'1/5',label:'1/5'}]);
 }
 if(m==='bounds'){
  E(s.view,'p','Olasılık spektrumu: 0 ══════════ 1','p5-display');
  const grid=E(s.controls,'div',null,'p5-choices');s.bits.boundary=[false,false,false,false];c.values.forEach((v,i)=>{
   const b=B(grid,String(v).replace('.',','),()=>{s.bits.boundary[i]=!s.bits.boundary[i];b.setAttribute('aria-pressed',String(s.bits.boundary[i]))});b.dataset.bound=String(i);b.setAttribute('aria-pressed','false');
  });E(s.controls,'p','İşaretli iki sayı 0–1 spektrumunda bulunamaz.','p5-caption');
 }
 if(m==='uncertain'){
  E(s.view,'p','🌦️ Meteoroloji tahmini: %70 yağmur','p5-display');numeric(s,'percent','Raporu spektrumda göster',0,100,5);
  choice(s,'decision','Bu rapordan ne çıkar?',[{value:1,label:'Kesin yağmur yağacak'},{value:0,label:'Yağmur olası, fakat kesin değil'},{value:2,label:'Yağmur imkânsız'}]);
 }
 if(m==='area'){
  colored(s,'area',c.total,0,'Yeşil olması istenen 6 kareyi boyamak için karelere dokun.');
  choice(s,'percent','Boyadığın modelin yüzdesi',[{value:40,label:'%40'},{value:60,label:'%60'},{value:90,label:'%90'}]);
 }
 if(m==='bagBuild'){
  colored(s,'bag',c.total,c.initialRed,'Toplara dokun: parlak olan kırmızı, sönük olan mavi top.');
  choice(s,'class','Kırmızı top çekilmesi nasıl bir olay?', [{value:0,label:'Az olasılıklı'},{value:1,label:'Çok olasılıklı'},{value:2,label:'İmkânsız'}]);
 }
 if(m==='compare'){
  balls(s,c.a[0],c.a[1],'A torbası');balls(s,c.b[0],c.b[1],'B torbası');
  choice(s,'winner','Kırmızı hangi torbada daha olası?', [{value:0,label:'A torbası'},{value:1,label:'B torbası'},{value:2,label:'Eşit'}]);
  choice(s,'evidence','Matematiksel dayanak',[{value:0,label:'A torbasının rengini daha çok seviyorum'},{value:1,label:'A torbasında kırmızı oranı daha büyük'},{value:2,label:'Tek çekilişte kesin kırmızı gelir'}]);
 }
 if(m==='fair'){
  colored(s,'wheel',c.total,c.initialRed,'Çarkın 10 eş diliminin rengini değiştir; iki renk eşit sayıda olsun.');
  choice(s,'claim','Kurulan çark için doğru yorum',[{value:0,label:'İki rengin olasılığı eşittir'},{value:1,label:'Kırmızı kesin gelir'},{value:2,label:'Mavi imkânsızdır'}]);
 }
 if(m==='trials'){
  balls(s,c.red,c.blue,'Gerçek torba');E(s.view,'p','Altı denemenin sonucu: 🔴🔵🔵🔴🔵🔵','p5-display');
  choice(s,'winner','Torbanın içeriğine göre daha olası renk',[{value:0,label:'Kırmızı'},{value:1,label:'Mavi'},{value:2,label:'Kesin eşit'}]);
  choice(s,'conclusion','Sınırlı sayıda deneme için geçerli yorum',[{value:0,label:'Mavi daha çok çıktığına göre torbadaki oran değişmiştir'},{value:1,label:'Altı deneme, olasılığın kesin oranını kanıtlamaz'},{value:2,label:'Artık hep mavi gelecektir'}]);
 }
 if(m==='ethics'){
  E(s.view,'p','🏫 Sınıf çekilişi: Her öğrenci için eşit hak aranıyor.','p5-display');
  choice(s,'plan','Hangi yöntemle çekiliş yapılmalı?', [{value:0,label:'Her öğrencinin adını yalnız bir kez ekle'},{value:1,label:'Başarılı öğrencinin adını üç kez ekle'},{value:2,label:'Öğretmenin arkadaşının adını iki kez ekle'}]);
  choice(s,'evidence','Bu yöntem neden adildir?', [{value:0,label:'Her öğrenciye eşit katılım olanağı verir'},{value:1,label:'Bazı öğrenciler daha çok hak eder'},{value:2,label:'İlk kazanan hep aynı kişi olur'}]);
 }
}
function valid(s){const c=s.cfg,v=s.values,bit=s.bits;const n=a=>a.filter(Boolean).length;
 switch(c.mode){
  case 'spectrum':return v.percent===c.percent&&v.secondary===c.secondary;
  case 'translate':return n(bit.illustration||[])===c.colored&&v.percent===c.percent&&v.decimal===c.decimal&&v.fraction===c.fraction;
  case 'bounds':return bit.boundary?.every((value,i)=>value===c.wrong.includes(i));
  case 'uncertain':return v.percent===c.percent&&v.decision===c.decision;
  case 'area':return n(bit.area||[])===c.colored&&v.percent===c.percent;
  case 'bagBuild':return n(bit.bag||[])>c.total/2&&n(bit.bag||[])<c.total&&v.class===1;
  case 'compare':return v.winner===c.winner&&v.evidence===c.evidence;
  case 'fair':return n(bit.wheel||[])===c.target&&v.claim===0;
  case 'trials':return v.winner===c.winner&&v.conclusion===c.conclusion;
  case 'ethics':return v.plan===c.plan&&v.evidence===c.evidence;
  default:return false;
 }
}
function render(task,onComplete){root.hidden=!Boolean(task.probability5PlusLab);root.replaceChildren();if(!task.probability5PlusLab){current=null;return;}
 const c=task.probability5PlusLab;if(!modes.has(c.mode))throw Error('Unknown probability5Plus mode '+c.mode);
 const s={task,cfg:c,values:{},bits:{},reason:saved[task.id]||'',onComplete,done:false};current=s;root.dataset.taskId=task.id;root.dataset.mode=c.mode;
 E(root,'span','5. SINIF · ÖZNEL OLASILIK · 0–1 SPEKTRUMU','p5-tag');E(root,'h3',task.baslik);E(root,'p',task.gorev,'p5-intro');s.view=E(root,'div',null,'p5-view');s.controls=E(root,'div',null,'p5-controls');s.message=E(root,'p','Hazır: modeli incele ve en az iki karar ver.','p5-status');s.message.setAttribute('role','status');s.message.setAttribute('aria-live','polite');present(s);
 const label=E(root,'label',c.needReason?'Gerekçeni yaz (isteğe bağlı; otomatik puanlanmaz)':'Gerekçe (isteğe bağlı; puanlamaya dahil edilmez)','p5-note');const textarea=E(label,'textarea');textarea.value=s.reason;textarea.rows=2;textarea.placeholder='Tahminine dayanak olan matematiksel ilişkiyi kendi sözlerinle yaz.';
 textarea.addEventListener('input',()=>{s.reason=textarea.value.slice(0,1500);saved[task.id]=s.reason;try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(_e){}});
 const actions=E(root,'div',null,'p5-actions');const ok=B(actions,'✓ Kararlarımı kontrol et',()=>{
  if(s.done)return;
  if(!valid(s)){s.message.textContent='🔎 Kararlardan biri eksik veya yanlış. Modeli, sınırları ve gerekçeyi yeniden incele.';s.message.dataset.error='true';return;}
  s.done=true;s.message.dataset.error='false';s.message.textContent='✅ Olasılık modelin ve işaretlemelerin doğrulandı. Yazılı gerekçenin içeriği isteğe bağlı nottur ve otomatik puanlanmaz.';onComplete();
 },'p5-primary');ok.dataset.action='verify';B(actions,'💡 İpucu',()=>{s.message.textContent=task.ipucu});B(actions,'↻ Yeniden başla',()=>render(task,onComplete));
 E(root,'p','Öznel tahminlerde bir tek deneme kesin sonuç değildir. Burada otomatik kontrol, belirli model ve seçimleri sınar; yazılı gerekçelerin doğruluğunu garanti etmez. Veriler yalnız bu tarayıcıya kaydedilir.','p5-note');
}
window.MatematikAtlasProbability5Plus={render,validateForTests:valid,getCurrentForTests:()=>current};
})();
