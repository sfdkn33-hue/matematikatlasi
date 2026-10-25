/* v2.4 · Sayılar ve Nicelikler I · 22 pedagogical game modes, 110 new tasks */
(()=>{'use strict';
const root=document.getElementById('number5PlusLab');if(!root)return;
const KEY='mathAtlasNumber5PlusNotes';let notes={};try{notes=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_e){}
const make=(parent,tag,txt,cls)=>{let el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined&&txt!==null)el.textContent=String(txt);parent.appendChild(el);return el};
const add=(parent,label,value,kind='div')=>{const x=make(parent,kind,value,'n5-card');x.dataset.label=label;x.setAttribute('aria-label',label+': '+value);return x};
const num=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:2});
const modes={composeGroups:'Bölük Kasası',readNumber:'Seslendirme Stüdyosu',writeNumber:'Sayı Kodlayıcı',zeroGroup:'Sessiz Bölük Dedektifi',digitPlace:'Basamak Feneri',decomposer:'Çözümleme Masası',compareBig:'Büyük Sayı Podyumu',pattern1000:'Binlik Makine',faultyRead:'Okunuş Hata Avcısı',missingDigits:'Kilitli Binler Bölüğü',stock:'Kitap Lojistiği',fleet:'Servis Planlama',time:'Zaman Rotası',market:'Birim Fiyat Pazarı',orchard:'Meyve Hasadı',estimate:'Tahmin Merkezi',invoice:'Fatura Denetçisi',inverse:'Ters İşlem Dedektifi',budget:'Bütçe Stratejisi',sustain:'Sürdürülebilir Su Planı',librarySplit:'Kitap Paylaşım Atölyesi',strategy:'Strateji Akış Şeması'};
let current=null;
function tileLine(parent,entries){const row=make(parent,'div',null,'n5-tiles');entries.forEach(([label,val])=>{let c=make(row,'div',null,'n5-tile');make(c,'small',label);make(c,'strong',val)})}
function svg(parent,attrs={}){const e=document.createElementNS('http://www.w3.org/2000/svg','svg');e.setAttribute('viewBox','0 0 650 170');e.setAttribute('role','img');e.setAttribute('aria-label',attrs.label||'Matematiksel ilişki modeli');parent.appendChild(e);return e}
function se(parent,tag,attrs={},content){const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));if(content!=null)e.textContent=String(content);parent.appendChild(e);return e}
function bars(parent,items,maximum){const s=svg(parent,{label:'Nicelikleri karşılaştıran çubuklar'});items.forEach(([label,value],i)=>{const x=25,y=28+i*42,w=Math.max(6,520*value/maximum);se(s,'text',{x,y:y+14,fill:'#e7f0f7','font-size':16},label);se(s,'rect',{x:148,y:y-4,width:w,height:23,rx:5,fill:['#3da8a5','#ecbf74','#79aee8'][i%3]});se(s,'text',{x:Math.min(610,155+w),y:y+13,fill:'#f5f9fa','font-size':15},num(value))})}
function showVisual(st){const c=st.c,v=c.visual,m=c.mode,out=st.visual;out.replaceChildren();
 if(['composeGroups','readNumber','writeNumber','zeroGroup','digitPlace','decomposer','faultyRead','missingDigits'].includes(m)){
  let n=v.number,parts=[Math.floor(n/1e9)%1000,Math.floor(n/1e6)%1000,Math.floor(n/1e3)%1000,n%1000];
  const row=make(out,'div',null,'n5-groups');['Milyarlar','Milyonlar','Binler','Birler'].forEach((label,i)=>{if(i===0&&parts[i]===0)return;const x=make(row,'div',null,'n5-group');make(x,'small',label);const val=m==='missingDigits'&&i===2&&!('missing' in st.values)?'???':String(parts[i]).padStart(i===parts.findIndex(x=>x!==0)?1:3,'0');make(x,'strong',val);if(parts[i]===0)x.classList.add('n5-silent')});
  if(m==='writeNumber')make(out,'p','🎙️ '+v.spoken,'n5-phrase');
  if(m==='faultyRead')make(out,'p','🤖 Robot diyor ki: “'+v.wrongReading+'”','n5-phrase');
  if(m==='digitPlace'||m==='decomposer'){
   const text=String(n),at=text.length-1-v.position,span=make(out,'p',null,'n5-digits');[...text].forEach((ch,i)=>make(span,'span',ch,i===at?'n5-highlight':''));make(out,'p','Renkli rakamın yeri çözümleme için önemlidir.','n5-muted')
  }
  if(m==='zeroGroup')make(out,'p','Sıfır bölükler okunurken sessiz kalır.','n5-muted');
  if(m==='missingDigits'&&st.values.missing!=null)make(out,'p','Gizli bölük denemen: '+String(st.values.missing).padStart(3,'0'),'n5-muted');
  return;
 }
 if(m==='compareBig'){
  make(out,'p','🎯 Kartları küçükten büyüğe dokunarak sıraya koy.','n5-order-help');
  const cards=make(out,'div',null,'n5-podium');
  for(let i=0;i<3;i++){const card=make(cards,'button',null,'n5-podium-card');card.type='button';card.dataset.card='ABC'[i];card.disabled=st.rank.includes(i);const letter=make(card,'b','ABC'[i]);make(card,'strong',num(v.numbers[i]));card.setAttribute('aria-label',letter.textContent+' kartı, '+num(v.numbers[i]));card.addEventListener('click',()=>{st.rank.push(i);showVisual(st)});}
  const track=make(out,'div',null,'n5-podium-track');track.setAttribute('aria-live','polite');
  make(track,'span',st.rank.length?'Küçük → büyük: '+st.rank.map(i=>'ABC'[i]).join(' → '):'Henüz kart yerleştirilmedi.');
  const reset=make(track,'button','↶ Kartları yeniden sırala','n5-mini');reset.type='button';reset.onclick=()=>{st.rank=[];showVisual(st)};
  return;
 }
 if(m==='pattern1000'){tileLine(out,[['Giriş',num(v.number)],['Dönüşüm','× 1000'],['Çıkış',('result' in st.values)?num(st.values.result):'?']]);return}
 if(m==='stock'){bars(out,[['İlk stok',v.start],['Gelen',v.incoming],['Dağıtılan',v.sent]],v.start+v.incoming);return}
 if(m==='fleet'){
  tileLine(out,[['Öğrenci',v.students],['Araç başına koltuk',v.seats],['Seçilen araç',st.values.trips??'?']]);
  const line=make(out,'div',null,'n5-icons');const count=Math.min(12,Math.max(1,Number(st.values.trips)||1));for(let i=0;i<count;i++)make(line,'span','🚌');return
 }
 if(m==='time'){const now=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');tileLine(out,[['Başlangıç',now(v.start)],['Süre',v.duration+' dk'],['Bitiş',st.values.finish||'?']]);return}
 if(m==='market'){tileLine(out,[['A paketi',v.packA[0]+' ürün / '+v.packA[1]+' TL'],['B paketi',v.packB[0]+' ürün / '+v.packB[1]+' TL']]);make(out,'p','Kararı paket fiyatına göre değil, 1 ürünün fiyatına göre ver.','n5-muted');return}
 if(m==='orchard'){tileLine(out,[['Ağaç',v.trees],['Ağaç başına ürün',v.fruits],['Bozulan',v.spoiled]]);const line=make(out,'div',null,'n5-icons');for(let i=0;i<Math.min(14,v.trees);i++)make(line,'span','🌳');return}
 if(m==='estimate'){bars(out,[['1. bağış',v.n1],['2. bağış',v.n2]],v.n1+v.n2);make(out,'p','Önce yüzlüğe yuvarla; sonra gerçek toplama ile sınama yap.','n5-muted');return}
 if(m==='invoice'){tileLine(out,[['Adet',v.quantity],['Birim fiyat',v.unit+' TL'],['Fişte yazan',v.shown+' TL']]);return}
 if(m==='inverse'){tileLine(out,[['Paket',v.packages],['Paket başına',v.items],['Gönderilen',v.delivered]]);make(out,'p','Başlangıç miktarını çarparak bul; farkı kayıp olarak yorumla.','n5-muted');return}
 if(m==='budget'){tileLine(out,[['Toplam bütçe',v.budget+' TL'],['Tek ürün',v.price+' TL'],['Denediğin adet',st.values.buy??'?']]);const row=make(out,'div',null,'n5-icons');for(let i=0;i<Math.min(12,Number(st.values.buy)||3);i++)make(row,'span','📦');return}
 if(m==='sustain'){tileLine(out,[['Günlük tasarruf',v.saved+' litre'],['Gün',v.days],['İki dönem','2 ×']]);const row=make(out,'div',null,'n5-icons');for(let i=0;i<Math.min(12,v.days);i++)make(row,'span','💧');return}
 if(m==='librarySplit'){tileLine(out,[['Toplam kitap',v.books],['Kutu kapasitesi',v.classSize],['Tam kutular',st.values.each??'?']]);return}
 if(m==='strategy'){tileLine(out,[['İlk sevkiyat',v.first],['İkinci sevkiyat',v.added],['Takım sayısı',v.teams]]);const row=make(out,'div',null,'n5-flow');['Verilenleri anla','İşlem sırasını kur','Kontrol et'].forEach(s=>make(row,'span',s));return}
}
function validate(st){if(st.c.mode==='compareBig'&&(st.rank.length!==3||st.rank.join(',')!==st.c.visual.numbers.map((_,i)=>i).sort((a,b)=>st.c.visual.numbers[a]-st.c.visual.numbers[b]).join(',')))return false;for(const field of st.c.fields){if(!Object.prototype.hasOwnProperty.call(st.values,field.key))return false;const actual=st.values[field.key],expected=field.answer;
 if(field.kind==='number'||field.kind==='range') {if(!Number.isFinite(Number(actual))||Math.abs(Number(actual)-Number(expected))>0.005)return false}
 else if(String(actual).trim()!==String(expected).trim())return false;
 }return true}
function field(st,f){const box=make(st.fields,'fieldset',null,'n5-field');make(box,'legend',f.label);
 if(st.c.mode==='missingDigits'&&f.key==='missing'){
  // The three digit dials replace the impractical 0..999 slider; direct keyboard entry remains available.
  st.digits=[0,0,0];const names=['Yüzler','Onlar','Birler'];const wheels=make(box,'div',null,'n5-dials');
  const outputs=[];
  const direct=make(box,'input',null,'n5-direct');direct.type='number';direct.min=0;direct.max=999;direct.step=1;direct.inputMode='numeric';direct.placeholder='Veya 0–999 arasında sayıyı yaz';direct.setAttribute('aria-label','Gizli binler bölüğünü sayı olarak yaz');
  function sync(){const val=st.digits[0]*100+st.digits[1]*10+st.digits[2];st.values[f.key]=val;direct.value=val;outputs.forEach((o,i)=>o.textContent=st.digits[i]);showVisual(st);}
  names.forEach((name,i)=>{const wheel=make(wheels,'div',null,'n5-dial');make(wheel,'span',name,'n5-dial-label');const plus=make(wheel,'button','＋','n5-dial-btn');plus.type='button';plus.setAttribute('aria-label',name+' basamağını artır');const disp=make(wheel,'output','0','n5-dial-value');outputs.push(disp);const minus=make(wheel,'button','−','n5-dial-btn');minus.type='button';minus.setAttribute('aria-label',name+' basamağını azalt');plus.onclick=()=>{st.digits[i]=(st.digits[i]+1)%10;sync()};minus.onclick=()=>{st.digits[i]=(st.digits[i]+9)%10;sync()};});
  direct.addEventListener('input',()=>{const raw=direct.value.trim();if(!raw){delete st.values[f.key];return;}if(!/^\d{1,3}$/.test(raw)){delete st.values[f.key];return;}const v=Number(raw);st.digits=String(v).padStart(3,'0').split('').map(Number);outputs.forEach((o,i)=>o.textContent=st.digits[i]);st.values[f.key]=v;showVisual(st);});
  const clear=make(box,'button','↶ Çarkları temizle','n5-mini');clear.type='button';clear.onclick=()=>{st.digits=[0,0,0];outputs.forEach(o=>o.textContent='0');direct.value='';delete st.values[f.key];showVisual(st)};
 }else if(f.kind==='choice'){
  const items=make(box,'div',null,'n5-choices');const options=[...new Set(f.options.map(x=>String(x)))];
  const jump=st.c.seed%options.length;options.push(...options.splice(0,jump));
  for(const value of options){let btn=make(items,'button',value,'n5-choice');btn.type='button';btn.dataset.value=value;btn.setAttribute('aria-pressed','false');btn.onclick=()=>{st.values[f.key]=typeof f.answer==='number'?Number(value):value;items.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));showVisual(st)}}
 }else {
  const input=make(box,'input',null,'n5-input');input.dataset.field=f.key;
  input.type=f.kind==='range'?'range':f.kind==='number'?'number':'text';input.autocomplete='off';
  if(input.type==='range'){input.min=f.min;input.max=f.max;input.step=f.step||1;input.value=Number(f.answer)===Number(f.min)?f.max:f.min;const display=make(box,'output',input.value);input.addEventListener('input',()=>{st.values[f.key]=Number(input.value);display.textContent=input.value;showVisual(st)});
   // Keyboard and touchscreen accessible numerical alternative to long slider distances.
   const direct=make(box,'input',null,'n5-direct');direct.type='number';direct.min=f.min;direct.max=f.max;direct.step=f.step||1;direct.placeholder='Değeri doğrudan yaz';direct.setAttribute('aria-label',f.label+' doğrudan değer');direct.addEventListener('input',()=>{if(direct.value===''){delete st.values[f.key];return}const v=Number(direct.value);if(Number.isFinite(v)&&v>=f.min&&v<=f.max){st.values[f.key]=v;input.value=v;display.textContent=v;showVisual(st)}});
  }else{input.placeholder=f.kind==='number'?'Sonucu yaz':'Yanıtı yaz';input.inputMode=f.kind==='number'?'decimal':'text';input.addEventListener('input',()=>{let v=input.value.trim();if(!v){delete st.values[f.key];return}if(f.kind==='number')v=Number(v.replace(',','.'));st.values[f.key]=v;showVisual(st)})}
 }
}
function render(task,finish){root.hidden=!task.number5PlusLab;root.replaceChildren();if(!task.number5PlusLab){current=null;return}
 const c=task.number5PlusLab,st={task,c,values:{},rank:[],finish,reason:notes[task.id]||'',done:false};current=st;root.dataset.mode=c.mode;root.dataset.taskId=task.id;
 make(root,'div','5. SINIF · SAYILAR VE NİCELİKLER I · OYUN ATÖLYESİ','n5-kicker');make(root,'h3',modes[c.mode]);make(root,'p',task.gorev,'n5-prompt');
 st.visual=make(root,'div',null,'n5-visual');st.fields=make(root,'div',null,'n5-fields');
 c.fields.forEach(f=>field(st,f));showVisual(st);
 if(c.requireReason){const wrap=make(root,'div',null,'n5-reason');const lab=make(wrap,'label','Kullandığın stratejiyi açıkla (isteğe bağlı nottur):');lab.htmlFor='n5Reason';const inp=make(wrap,'textarea',null);inp.id='n5Reason';inp.rows=3;inp.placeholder='En az bir matematiksel ilişkiyi örnekle açıkla.';inp.value=st.reason;inp.addEventListener('input',()=>{st.reason=inp.value;notes[task.id]=inp.value;try{localStorage.setItem(KEY,JSON.stringify(notes))}catch(_e){}})}
 st.status=make(root,'p','Modeli incele, her kararı tamamla ve ardından kontrol et.','n5-status');st.status.id='n5Status';st.status.setAttribute('role','status');st.status.setAttribute('aria-live','polite');const actions=make(root,'div',null,'n5-actions');
 const check=make(actions,'button','✓ Kararlarımı doğrula','n5-btn');check.type='button';check.onclick=()=>{if(st.done)return;if(!validate(st)){window.Atlas616Trace?.wrong(task,'5. sınıf sayılar ve nicelikler');st.status.dataset.error='true';st.status.textContent=st.c.mode==='compareBig'?'Kartları küçükten büyüğe doğru sırala; ardından en küçük ve en büyük kartı seç.': 'Henüz doğru değil. Görseli ve yanıtlarını yeniden incele. Gerekliyse gerekçeni de yaz.';return}st.done=true;st.status.dataset.error='false';st.status.textContent='✅ İki matematiksel kararın doğrulandı. Modelin ekranda kalıyor.';st.finish()};
 const hint=make(actions,'button','💡 İpucu','n5-btn');hint.type='button';hint.onclick=()=>{st.status.textContent=task.ipucu};
 const reset=make(actions,'button','↻ Yeniden dene','n5-btn');reset.type='button';reset.onclick=()=>render(task,finish);
 make(root,'p','Sayılar ve işlem kararları otomatik kontrol edilir. Yazılı açıklamanın niteliğini sistem puanlamaz; bu cihazdaki kayıtlar resmî notlandırma değildir.','n5-footnote');
}
window.MatematikAtlasNumber5Plus={render,validateForTests:validate};
})();
