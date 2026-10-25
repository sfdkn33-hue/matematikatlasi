/* Matematik Atlası v6.20 — gerçek doğrulayıcı olayından sınırlı öğrenme desteği.
 * 120 uygulamalı ve 48 ondalık görev, eski ana görev/ID/veri ve 1-7-21 kayıtları değişmez.
 * Alan gözlemi öğrencinin zihnindeki nedeni kesin teşhis etmez.
 */
(()=>{'use strict';
 const db=window.ATLAS_DB,api=window.MatematikAtlas64;
 const apps=new Map((db?.tasks||[]).filter(t=>t.appliedLab||t.decimalLab).map(t=>[String(t.id),t]));
 if(!db||!api||!apps.size)return;
 const KEY='mathAtlas620Practice';
 const wrap=(tag,parent,txt,cls)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=String(txt);parent?.appendChild(n);return n};
 const choice=(a,b,c)=>[String(a),String(b),String(c)];
 const fmt=x=>Number(x).toLocaleString('tr-TR',{maximumFractionDigits:5});
  const int=(n,d)=>Math.floor(n/d);
 const gcd=(a,b)=>b?gcd(b,a%b):a;
 let previousId='',previousSignature='';
 const signature=(controls)=>[...controls.querySelectorAll('input,select,button[aria-pressed]')].map(e=>e.tagName==='BUTTON'?`${e.textContent?.trim()}:${e.getAttribute('aria-pressed')}`:e.value).join('|');
 function wrong(task,familyName,fieldKey,controls){
  const id=String(task?.id||'');if(!apps.has(id)||!controls)return false;
  const sig=signature(controls);
  if(id===previousId&&sig===previousSignature)return false;
  const validKey=/^[a-zA-Z]{1,30}$/.test(fieldKey||'')?fieldKey:'model';
  const ok=api.log({taskId:id,status:'wrong',family:familyName,fieldKey:validKey,focus:['amount','result','shareValue','distance','remaining','converted','length','quantity','placeValue','remainder'].includes(validKey)?'hesap':'karar',evidence:'module-validator',automatic:true,firstTry:false});
  if(ok){previousId=id;previousSignature=sig}return ok;
 }
 window.Atlas620Trace={wrong,version:'6.20'};
 function build(t,focus){
  if(!t||(!t.appliedLab&&!t.decimalLab))return null;
  const kind=t.appliedLab?'appliedLab':'decimalLab',c=t[kind],mode=c.mode;
  const k=Number(String(t.id).match(/G(\d+)$/)?.[1]||1),v=k%7;
  const z={kind,mode,focus:focus||'unknown',title:'',context:'',prompt:'',options:[],correct:'',numberLabel:'',expected:NaN,explain:'',tip:'',diagram:'bars'};
  const put=x=>Object.assign(z,x);
  const hard=['amount','result','shareValue','distance','remaining','converted','length','quantity'].includes(focus);
  if(kind==='appliedLab'){
   switch(mode){
   case 'sale':{
    const p=100+v*10,d=10+(v%2)*10,q=2,ship=5;
    const final=p*(100-d)/100*q+ship;
    put({title:hard?'Son ücreti parçalara ayır':'İndirim sırasını kur',context:`Yeni alışveriş: Birim fiyat ${p} TL, indirim %${d}, ${q} ürün ve ${ship} TL kargo.`,prompt:'Doğru işlem planı hangisidir?',options:choice('Önce birime indirim, sonra adet, en son kargo','Önce kargoya indirim uygula','Adetle çarpmadan yalnız kargo ekle'),correct:'Önce birime indirim, sonra adet, en son kargo',numberLabel:'Ödenecek toplam kaç TL?',expected:final,explain:'İndirim ürün fiyatına uygulanır; teslimat tutarı en sonda eklenir.',tip:'İndirimden sonra kalan yüzdeyi ürün adediyle çarp.'});break;
   }
   case 'recipe':{
    const n=1+v%3,d=4,f=2;
    put({title:'Tarif ölçeğini kesir şeridinde kur',context:`Bir karışımın başlangıç miktarı ${n}/4 litre. Aynı tariften iki kat yapılacak.`,prompt:'Miktar nasıl bulunur?',options:choice('Kesri 2 ile çarp','Kesre 2 ekle','Kesri 2 ile böl'),correct:'Kesri 2 ile çarp',numberLabel:'Yeni miktar kaç litredir?',expected:n*f/d,explain:'İki katına çıkarırken paydaki miktar ikiyle çarpılır; değer iki kat olur.',tip:'Paydayı değiştirmeden başlangıç miktarını iki katına çıkar.',diagram:'fractions'});break;
   }
   case 'share':{
    const people=2+v%3,n=people*3,d=4;
    put({title:'Adil paylaşmada bir kişiye düşeni bul',context:`Toplam ${n}/4 litre meyve suyu ${people} kişiye eşit paylaştırılıyor.`,prompt:'Kişi başına miktar için doğru işlem hangisi?',options:choice(`(${n}/4) ÷ ${people}`,`(${n}/4) × ${people}`,`(${n}/4) + ${people}`),correct:`(${n}/4) ÷ ${people}`,numberLabel:'Bir kişiye kaç litre düşer?',expected:n/d/people,explain:'Eşit paylaşma toplamı kişi sayısına bölmektir.',tip:'Toplam miktarı kişi sayısına böl.',diagram:'fractions'});break;
   }
   case 'route':{
    const a=2+v/4,b=1.5,back=0.5;
    put({title:'Gidiş ve dönüşü aynı sayı doğrusunda göster',context:`İlk yol ${fmt(a)} km, devamı ${fmt(b)} km; ardından ${fmt(back)} km geri dönülüyor.`,prompt:'Net uzaklığı hangi işlemle buluruz?',options:choice('İlk iki yolu topla, geri dönüşü çıkar','Tüm yolları topla','Yalnız ilk yoldan geri dönüşü çıkar'),correct:'İlk iki yolu topla, geri dönüşü çıkar',numberLabel:'Başlangıca göre net uzaklık kaç km?',expected:a+b-back,explain:'Gidişler pozitif, geri dönüş ters yönlüdür.',tip:'Önce toplam gidişi bul; sonra geri dönüşü çıkar.',diagram:'line'});break;
   }
   case 'budget':{
    const budget=200+v*20,percent=10,fract=1/4;
    put({title:'Bütçe yüzdelerini ortak ölçekte karşılaştır',context:`Toplam ${budget} TL. Malzeme gideri bütçenin 1/4’ü, ulaşım gideri %10’u.`,prompt:'Hangi gider daha büyük?',options:choice('Malzeme: 1/4 = %25','Ulaşım: %10, %25’ten büyük','İki gider eşittir'),correct:'Malzeme: 1/4 = %25',numberLabel:'Kalan para kaç TL?',expected:budget*(1-fract-percent/100),explain:'Önce kesir ve yüzdeyi aynı bütçe üzerinden bul; her ikisini toplamdan çıkar.',tip:'1/4 bütçenin %25’idir; %25 + %10 = %35 gider.',diagram:'percent'});break;
   }
   case 'error':{
    const n=2+v,d=4,container=1/8;
    put({title:'Robotun yanlış işlem seçimini düzelt',context:`Toplam ${n}/4 litre içecek, 1/8 litrelik kaplara doldurulacak.`,prompt:'Kap sayısını hangi işlemle buluruz?',options:choice(`(${n}/4) ÷ (1/8)`,`(${n}/4) × (1/8)`,`(${n}/4) + (1/8)`),correct:`(${n}/4) ÷ (1/8)`,numberLabel:'Kaç tam kap dolar?',expected:n/d/container,explain:'Kap sayısı = toplam hacim ÷ bir kabın hacmi.',tip:'Bir bütünü kaç tane 1/8’lik parça oluşturur?',diagram:'fractions'});break;
   }
   case 'convert':{
    const meters=2+v;
    put({title:hard?'Santimetreye yeniden dönüştür':'Birim dönüşümü yönünü belirle',context:`Sanal uzunluk: ${meters} metre. Santimetre cinsinden göstermek istiyoruz.`,prompt:'Hangi dönüştürme kuralı doğrudur?',options:choice('1 m = 100 cm','1 m = 10 cm','1 m = 1000 cm'),correct:'1 m = 100 cm',numberLabel:'Uzunluk kaç cm?',expected:meters*100,explain:'Metreyi santimetreye dönüştürürken 100 ile çarpılır.',tip:'Sayıca daha küçük bir birime geçince aynı uzunluğun sayısal değeri artar.',diagram:'ruler'});break;
   }
   case 'ruler':{
    const mm=25+v*5;
    put({title:'Cetvelde milimetreyi santimetreye bağla',context:`Cetvelde bir çizginin uzunluğu ${mm} milimetre.`,prompt:'Milimetreyi santimetreye çevirmek için ne yapılır?',options:choice('10 ile böl','10 ile çarp','100 ile böl'),correct:'10 ile böl',numberLabel:'Uzunluk kaç cm?',expected:mm/10,explain:'10 mm = 1 cm; çizimdeki işaret aynı yerde kalır, yalnız birim değişir.',tip:'Milimetredeki değeri 10’a böl.',diagram:'ruler'});break;
   }
   case 'choose':{
    const cm=12+v;
    put({title:'Nesneye uygun ölçme birimini seç',context:`Bir defterin kapak eni yaklaşık ${cm} cm olabilir.`,prompt:'Kapak enini ölçmek için en uygun birim hangisidir?',options:choice('Santimetre','Kilometre','Metre'),correct:'Santimetre',numberLabel:`${cm} cm kaç milimetredir?`,expected:cm*10,explain:'Elde taşınan nesneler için santimetre uygundur; 1 cm = 10 mm.',tip:'Önce nesnenin boyutunu günlük hayatla karşılaştır.',diagram:'ruler'});break;
   }
   case 'compare':{
    const a=2+v,b=a*100;
    put({title:hard?'Uzunlukları aynı birimde bul':'İki uzunluğu aynı ölçeğe getir',context:`A = ${a} metre, B = ${b} santimetre.`,prompt:'A ve B’nin ilişkisi hangisidir?',options:choice('A = B','A > B','A < B'),correct:'A = B',numberLabel:'A’nın santimetre değeri kaçtır?',expected:b,explain:'Ölçü birimleri eşitlenince iki uzunluk aynı büyüklüktedir.',tip:'1 metreyi 100 santimetreye çevir.',diagram:'ruler'});break;
   }
   case 'compose':{
    const m=1+v%2,dm=2,cm=3,mm=4;
    put({title:'Ölçü bloklarını tek birimde birleştir',context:`Model: ${m} m + ${dm} dm + ${cm} cm + ${mm} mm.`,prompt:'Toplamı milimetreye dönüştürmek için hangi kural doğrudur?',options:choice('m×1000 + dm×100 + cm×10 + mm','m×100 + dm×10 + cm + mm','Bütün sayıları doğrudan topla'),correct:'m×1000 + dm×100 + cm×10 + mm',numberLabel:'Toplam uzunluk kaç milimetredir?',expected:m*1000+dm*100+cm*10+mm,explain:'Her uzunluğu ortak birime dönüştürdükten sonra topla.',tip:'1 m = 1000 mm; 1 dm = 100 mm; 1 cm = 10 mm.',diagram:'ruler'});break;
   }
   case 'estimate':{
    put({title:'Gerçekçi uzunluğu ölçüyle karşılaştır',context:'Bir sınıf kapısının yüksekliğini tahmin ediyorsun.',prompt:'Yaklaşık hangi değer anlamlıdır?',options:choice('2 m','2 mm','2 km'),correct:'2 m',numberLabel:'2 metre kaç santimetredir?',expected:200,explain:'Kapı insan boyuna yakın ölçektedir; kilometre ve milimetre gerçekçi değildir.',tip:'Ölçmeden önce 1 metreyi zihninde canlandır.',diagram:'ruler'});break;
   }
   default:return null;
   }
  }else{
   const n=c.numerator,d=c.denominator,rem=n%d,red=d/gcd(n,d);
   const first=int(n*10,d),r1=(n*10)%d,second=int(r1*10,d),finite=(()=>{let x=red;while(x%2===0)x/=2;while(x%5===0)x/=5;return x===1})();
   switch(mode){
   case 'divideSteps': case 'divide':{
    put({title:focus==='remainder'?'Kalanı adım adım hesapla':'Bölme kuralını modelle',context:`Kesir ${n}/${d} için ondalık bölmeye başlıyoruz. İlk kalan ${n}.`,prompt:'Ondalık bölümün ilk rakamını bulmak için hangi işlem yapılır?',options:choice('Kalanı 10 ile çarp ve paydaya böl','Kalanı paydayla topla','Paydayı 10 ile çarp ve paya böl'),correct:'Kalanı 10 ile çarp ve paydaya böl',numberLabel:'İlk adım sonunda yeni kalan kaçtır?',expected:r1,explain:'Kalan × 10 = bölüm rakamı × payda + yeni kalan.',tip:`${n} × 10 işlemini ${d} sayısına böl.`,diagram:'division'});break;
   }
   case 'denominatorKeys': case 'denominator':{
    put({title:'Sadeleştirilmiş paydadan türü tanı',context:`${n}/${d} kesrinin sadeleşmiş paydası ${red}.`,prompt:'Sadeleşmiş paydanın asal çarpanlarına göre gösterim türü nedir?',options:choice(finite?'Sonlu':'Devirli',finite?'Devirli':'Sonlu','Sadece paya bakılarak belirlenir'),correct:finite?'Sonlu':'Devirli',numberLabel:'Kesrin sadeleşmiş paydası kaçtır?',expected:red,explain:'Sadeleşmiş paydada yalnız 2 ve 5 varsa gösterim sonlu olur.',tip:'Önce kesri sadeleştir; paydanın asal çarpanlarını ayır.',diagram:'denominator'});break;
   }
   case 'decimalDigits':{
    put({title:'İlk iki ondalık rakamı adımlarla bul',context:`Yeni bölme: ${n}/${d}.`,prompt:'Bir sonraki ondalık basamağa geçişte hangisi yapılır?',options:choice('Kalanı 10 ile çarp','Payı ve paydayı topla','Kalanı 10’a böl'),correct:'Kalanı 10 ile çarp',numberLabel:'İlk iki ondalık rakamı iki basamaklı sayı olarak yaz (ör. 0,18 için 18).',expected:first*10+second,explain:'Her yeni rakam önceki kalan × 10 işlemiyle bulunur.',tip:'İlk rakamı ve ikinci rakamı ayrı hesaplayıp yan yana yaz.',diagram:'division'});break;
   }
   case 'remainderTrail':{
    put({title:'Kalanın tekrarını izle',context:`Kesir ${n}/${d}; ilk bölme adımında kalan ${r1}.`,prompt:'Devir oluştuğunu ne zaman anlarız?',options:choice('Sıfır olmayan bir kalan tekrar ettiğinde','Bölüm rakamlarından biri 0 olduğunda','Payda paydan büyük olduğunda'),correct:'Sıfır olmayan bir kalan tekrar ettiğinde',numberLabel:'İlk adımın yeni kalanı kaçtır?',expected:r1,explain:'Aynı kalan yeniden gelirse bölme işlemi aynı rakam dizisini üretir.',tip:'Kalan sıfırsa sonlu, sıfır değilken tekrarlanıyorsa devirli.',diagram:'division'});break;
   }
   case 'cycle':{
    put({title:'Sonlu ve devirli gösterimi ayırt et',context:`${n}/${d} kesrini uzun bölmeyle yazmak istiyoruz.`,prompt:'Bu kesrin ondalık gösterimi hangi türdedir?',options:choice(finite?'Sonlu':'Devirli',finite?'Devirli':'Sonlu','Sadece payı inceleyerek karar verilir'),correct:finite?'Sonlu':'Devirli',numberLabel:'İlk ondalık bölüm rakamı kaçtır?',expected:first,explain:'Sadeleşmiş paydanın asal çarpanları ve kalanların tekrarı aynı sonucu verir.',tip:'Yalnız 2 ve 5 asal çarpanlarına izin veren paydalar sonlu gösterim verir.',diagram:'denominator'});break;
   }
   case 'match':{
    const value=Number((n/d).toFixed(4)),wrong1=Number((value+0.1).toFixed(4)),wrong2=Number((value+0.2).toFixed(4));
    put({title:'Kesir ve ondalık kartı bağla',context:`Kesir ${n}/${d}. Yaklaşık değer isteniyor.`,prompt:'Dört ondalık basamak doğruluğunda hangi kartı seçersin?',options:choice(fmt(value),fmt(wrong1),fmt(wrong2)),correct:fmt(value),numberLabel:'İlk ondalık bölüm rakamı kaçtır?',expected:first,explain:'Kesri bölerek elde edilen ondalık rakamları aynı miktarı gösterir.',tip:'Payı paydaya böl, tam kısım sıfırsa ondalık basamağa geç.',diagram:'division'});break;
   }
   default:return null;
   }
  }
  if(z.options.length!==3||new Set(z.options).size!==3||!z.options.includes(z.correct)||!Number.isFinite(z.expected))return null;
  const off=String(t.id).split('').reduce((s,x)=>s+x.charCodeAt(0),0)%3;
  z.options=[...z.options.slice(off),...z.options.slice(0,off)];
  return z;
 }
 let activeId='',lesson=null,focus='',host=null,open=false,selected='',value='',trials=0;
 const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}};
 const eventsFor=id=>api.getEvents().filter(x=>x.taskId===id&&x.status==='wrong'&&x.evidence==='module-validator');
 const names={operation:'İşlem planı',amount:'Toplam ücret',quantity:'Kesirli miktar',groups:'Paylaşılacak kişi sayısı',shareValue:'Kişi başına miktar',distance:'Net uzaklık',comparison:'Gider büyüklüğü',remaining:'Kalan bütçe',result:'Sayısal sonuç',unitRule:'Birim dönüştürme kuralı',converted:'Dönüştürülen miktar',position:'Cetvel konumu',unit:'Uygun birim',sign:'Büyüklük karşılaştırması',length:'Ortak birimde uzunluk',blocks:'Ölçü bloklarının toplamı',remainder:'Bölme kalanı',classification:'Gösterimin türü',placeValue:'Basamak / sayı modeli',model:'Matematiksel model'};
 function reset(){host?.remove();host=null;activeId='';lesson=null;focus='';open=false;selected='';value='';trials=0}
 function visual(parent){
  const panel=wrap('div',parent,undefined,'a620-visual');panel.setAttribute('role','img');panel.setAttribute('aria-label',lesson.context);
  if(lesson.diagram==='fractions'){
   wrap('div',panel,'Bir bütün eş parçalara ayrılır; birim kesirler toplanır veya paylaştırılır.','a620-explain');
   const grid=wrap('div',panel,undefined,'a620-fractions');for(let i=0;i<8;i++)wrap('span',grid,'','');wrap('small',panel,'Bu bir boş kesir şablonudur; doldurulmuş cevap göstermez.');
  }else if(lesson.diagram==='percent'){
   const p=wrap('div',panel,undefined,'a620-percent');for(let i=0;i<20;i++)wrap('i',p,'','');wrap('small',panel,'20 karelik boş şema: önce kesir ve yüzdeyi ortak bütün üzerinde düşün.');
  }else if(lesson.diagram==='ruler'||lesson.diagram==='line'){
   const ruler=wrap('div',panel,undefined,'a620-ruler');for(let i=0;i<=10;i++)wrap('span',ruler,i%2===0?String(i):'');wrap('small',panel,'Sayı doğrusu şematiktir; ölçek birebir değildir.');
  }else if(lesson.diagram==='division'||lesson.diagram==='denominator'){
   wrap('div',panel,'PAY ÷ PAYDA','a620-division');wrap('div',panel,'Kalan × 10 = (bölüm rakamı × payda) + yeni kalan','a620-explain');
  }else{
   wrap('div',panel,'Önce modele karar ver → Sayısal kanıtı hesapla','a620-division');
  }
 }
 function draw(){if(!host||!lesson)return;host.replaceChildren();
  const heading=wrap('div',host,undefined,'a620-head'),txt=wrap('div',heading);
  wrap('strong',txt,'🧮 Matematik Koçu · Başka bir yoldan öğren');wrap('small',txt,lesson.kind==='appliedLab'?'Uygulamalı problem · iki matematik adımı':'Ondalık gösterim · iki matematik adımı');
  const toggle=wrap('button',heading,open?'Çalışmayı gizle':'Kısa çalışmayı aç','a620-toggle');toggle.type='button';toggle.setAttribute('aria-expanded',String(open));toggle.onclick=()=>{open=!open;draw()};
  wrap('p',host,`Son gerçek yanlış kontrolde gözlenen alan: ${names[focus]||'Matematiksel karar'}. Bu, öğrencinin kavram yanılgısını kesin olarak teşhis etmez.`,'a620-focus');
  if(!open)return;
  wrap('h4',host,lesson.title);wrap('p',host,lesson.context,'a620-context');visual(host);
  wrap('p',host,'1. Adım · '+lesson.prompt,'a620-prompt');const choices=wrap('div',host,undefined,'a620-options');
  for(const option of lesson.options){const b=wrap('button',choices,option,'a620-option');b.type='button';b.setAttribute('aria-pressed',String(option===selected));b.onclick=()=>{selected=option;draw()}}
  const label=wrap('label',host,undefined,'a620-label');wrap('span',label,'2. Adım · '+lesson.numberLabel);const input=wrap('input',label);input.type='text';input.inputMode='decimal';input.autocomplete='off';input.placeholder='Yalnızca sayısal sonucu yaz';input.value=value;input.oninput=()=>{value=input.value};
  const actions=wrap('div',host,undefined,'a620-actions');const check=wrap('button',actions,'İki adımı doğrula','a620-check');check.type='button';
  const hint=wrap('button',actions,'💡 Küçük ipucu','a620-hint');hint.type='button';
  const message=wrap('p',host,'','a620-message');message.setAttribute('role','status');message.setAttribute('aria-live','polite');
  hint.onclick=()=>{message.textContent=lesson.tip;message.dataset.kind='hint'};
  check.onclick=()=>{trials++;
   const raw=value.trim().replace(',','.');const number=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)?Number(raw):NaN;
   const modelOK=selected===lesson.correct,numOK=raw!==''&&Number.isFinite(number)&&Math.abs(number-lesson.expected)<1e-7;
   if(!modelOK||!numOK){message.dataset.kind='wrong';message.textContent=(!modelOK?'Seçtiğin işlem/model bu durumda uygun değil. ':'Model seçimin doğru. ')+(!numOK?'Sayısal kanıtı yeniden hesapla. ':'')+(trials>=2?lesson.tip:'');return}
   const record={taskId:activeId,kind:'optional-v620-practice',mode:lesson.mode,fieldKey:focus||'unknown',when:Date.now(),attempts:trials,mainTaskCompleted:false};
   const payload=JSON.stringify([...read().slice(-499),record]);let saved=false;
   try{localStorage.setItem(KEY,payload);saved=localStorage.getItem(KEY)===payload}catch{}
   message.dataset.kind=saved?'success':'warning';message.textContent='✅ Her iki adımı doğru çözdün. '+lesson.explain+(saved?' Mini çalışman kaydedildi.':' ⚠ Çalışmanın kaydı doğrulanamadı; kaydedilemedi.');
  };
  wrap('p',host,'Bu ek etkinlik ana görevi bitirmez, not vermez, öğretmen onayı istemez veya tekrar aşamalarını ilerletmez. Ana soruna dön ve kendi matematiksel cevabını doğrula.','a620-foot');
 }
 function show(){if(!lesson||!activeId)return;
  const anchor=document.getElementById(lesson.kind==='appliedLab'?'appliedLab':'decimalLab');if(!anchor||anchor.hidden)return;
  if(!host){host=document.createElement('section');host.className='a620-card';host.id='atlas620TargetedCoach';host.setAttribute('aria-label','Hedefli kısa öğrenme çalışması')}
  anchor.insertAdjacentElement('afterend',host);draw();
 }
 function initialize(id){reset();activeId=id;const t=apps.get(id);if(!t)return;const e=eventsFor(id);
  if(e.length<2)return;focus=e.at(-1)?.fieldKey||'';lesson=build(t,focus);if(lesson)show();}
 document.addEventListener('atlas:taskrender',e=>initialize(String(e.detail?.id||'')));
 document.addEventListener('atlas:attemptlogged',e=>{
  if(e.detail?.status!=='wrong'||e.detail.taskId!==activeId||!apps.has(activeId))return;
  const ev=eventsFor(activeId);if(ev.length<2)return;
  const newFocus=ev.at(-1)?.fieldKey||'';
  if(newFocus!==focus){selected='';value='';trials=0;open=false}
  focus=newFocus;lesson=build(apps.get(activeId),focus);if(lesson)show();
 });
 window.Atlas620TargetedCoach={count:apps.size,appliedCount:[...apps.values()].filter(t=>t.appliedLab).length,decimalCount:[...apps.values()].filter(t=>t.decimalLab).length,modes:[...new Set([...apps.values()].map(t=>t.appliedLab?.mode||t.decimalLab?.mode))],buildForTests:(id,focus)=>build(apps.get(String(id)),focus),version:'6.20'};
})();
