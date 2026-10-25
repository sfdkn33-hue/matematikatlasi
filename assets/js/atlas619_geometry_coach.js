/* Matematik Atlası v6.19 — 6. sınıf geometrik şekiller için alan-temelli ek çalışma.
 * 170 mevcut görev / 17 eski oyun türü. 2 gerçek doğrulayıcı yanlışı sonrasında öneri.
 * Gözlenen yanıt alanı bir kavram yanılgısı / ustalık teşhisi DEĞİLDİR.
 * Mini çalışma ana görev sonucunu, öğretmen notunu ve 1-7-21 tekrar basamaklarını değiştirmez.
 */
(()=>{'use strict';
 const db=window.ATLAS_DB,progress=window.MatematikAtlas64,lab=document.getElementById('geometry6Lab');
 if(!db||!progress||!lab)return;
 const tasks=new Map(db.tasks.filter(t=>t.geometry6Lab).map(t=>[String(t.id),t]));
 const KEY='mathAtlas619Practice',FAMILY='6. sınıf geometrik şekiller';
 const validFocus=new Set(['angle','relation','classification','shape','lengths','perpendicular','diagonalProperties','midpoint','supplementary','bisector']);
 const fieldNames={angle:'Açı ölçümü ve toplam',relation:'Açıların konumu / ilişkisi',classification:'Dörtgenin özelliği',shape:'Dörtgenin inşası',lengths:'Köşegen uzunlukları',perpendicular:'Köşegenlerin dikliği',diagonalProperties:'Köşegenle sınıflandırma',midpoint:'Ortak orta nokta',supplementary:'Bütünler açı ilişkisi',bisector:'Açının ikiye bölünmesi'};
 const mk=(root,tag,value,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=String(value);root.appendChild(e);return e};
 const props={
  'yamuk':'Yalnız bir çift karşılıklı kenar paralel',
  'paralelkenar':'Karşılıklı kenarlar iki çift paralel',
  'dikdörtgen':'Dört dik açı ve eş uzunluklu köşegen',
  'eşkenar dörtgen':'Dört eş kenar, dik kesişen köşegen',
  'kare':'Dört eş kenar ve dört dik açı'
 };
 const diag={
  'paralelkenar':'Eşit de dik de olmak zorunda değil',
  'dikdörtgen':'Köşegenler eşit, dik olmak zorunda değil',
  'eşkenar dörtgen':'Köşegenler dik, eşit olmak zorunda değil',
  'kare':'Köşegenler hem eşit hem dik'
 };
 function make(task,focus){
  if(!task?.geometry6Lab)return null;
  const c=task.geometry6Lab,m=c.mode,k=Number(String(task.id).match(/G(\d+)$/)?.[1]||1)%10;
  let l={mode:m,focus:focus||'unknown',group:'',title:'',context:'',prompt:'',options:[],correct:'',numberLabel:'',expected:NaN,explain:'',hint:'',kind:'shape'};
  const set=(a)=>Object.assign(l,a);
  if(['correspond','alternate','outer','parallelTest'].includes(m)){
   const alpha=45+5*(k%8),relation=c.relation,focusRelation=focus==='relation';
   const others=['Yöndeş','İç ters','Dış ters','Bütünler'].filter(x=>x!==relation);
   const position={
    'correspond':'İşaretli açılar iki kesişimde aynı göreli konumdadır.',
    'parallelTest':'İşaretli açılar iki kesişimde aynı göreli konumdadır.',
    'alternate':'İşaretli açılar iki paralel doğrunun arasında, kesenin ters taraflarındadır.',
    'outer':'İşaretli açılar paralel doğruların dışında, kesenin ters taraflarındadır.'
   }[m];
   set({group:'Paralel doğrular',kind:'parallel',title:focusRelation?'Açı ilişkisinin adını ayırt et':'Eş açıların ölçüsünü ilişkilendir',
    context:`Yeni çizimde bir kesen, iki paralel doğruyu kesiyor. Üstteki örnek açı ${alpha}° olarak ölçüldü. ${position}`,
    prompt:focusRelation?'İşaretli açıların ilişkisinin adı hangisidir?':'Bu iki açı aynı konuma/karşılıklı uygun konuma denk geldiğinde hangi işlem gerekir?',
    options:focusRelation?[relation,others[0],others[1]]:['Açı ölçüsünü aynen taşı','Ölçüleri topla','Ölçüyü ikiye böl'],
    correct:focusRelation?relation:'Açı ölçüsünü aynen taşı',numberLabel:'Eş olan ikinci açının ölçüsü kaç derecedir?',expected:alpha,
    explain:'Paralel iki doğrunun yöndeş, iç ters veya dış ters açıları eş ölçülüdür. Burada bütünler açılar eşleştirilmedi.',
    hint:'İşaretli açıların hangi bölgede bulunduğuna ve paralellik koşuluna bak.',visual:[alpha,alpha]});
  }else if(['shapeBuild','shapeClass','propertyCheck'].includes(m)){
   const type=c.shape,correct=props[type];
   // Distractors must be FALSE for the named quadrilateral. A square also satisfies
   // rectangle/parallelogram properties, so using those as wrong choices would misgrade.
   const wrong={
    'yamuk':['Karşılıklı kenarlar iki çift paralel','Karşılıklı hiçbir kenar paralel değil'],
    'paralelkenar':['Karşılıklı kenarlar yalnız bir çift paralel','Karşılıklı kenarların ikisi mutlaka kesişir'],
    'dikdörtgen':['Dört açıdan yalnız ikisi dik','Köşegenlerin uzunlukları farklıdır'],
    'eşkenar dörtgen':['Karşılıklı kenarların hiçbiri paralel değildir','Dört kenarın hepsi farklı uzunluktadır'],
    'kare':['Karşılıklı kenarlar paralel değildir','Dört açıdan yalnız ikisi diktir']
   };
   set({group:'Dörtgenleri tanıma',kind:'quadrilateral',title:focus==='shape'?'Dörtgeni koşullarından yeniden kur':'Dörtgenin ayırt edici özelliğini seç',
    context:`Yeni bir ${type} modeli çiziliyor. Bu atölyede “yamuk” yalnızca bir çift paralel kenarlı model anlamındadır.`,
    prompt:`${type} için hangi açıklama doğru?`,options:[correct,...wrong[type]],correct,
    numberLabel:'Bu modelin kaç çift karşılıklı kenarı paraleldir?',expected:type==='yamuk'?1:2,
    explain:'Şekli yalnız görünüşünden değil, açı ve paralellik özelliklerinden sınıflandır.',hint:'Kare ve dikdörtgen, paralelkenarın özel hâlleridir.',visual:type});
  }else if(['angleTotal','quadrilateralAngle'].includes(m)){
   const a=70+5*(k%4),b=80+5*(k%3),d=95+5*(k%4),missing=360-a-b-d;
   set({group:'Dörtgenin iç açıları',kind:'quadrilateral',title:'Dört açıyı 360° üzerinde tamamla',context:`Şematik bir dörtgenin üç iç açısı ${a}°, ${b}° ve ${d}°.`,
    prompt:'Dördüncü iç açıyı hangi modelle buluruz?',options:[`360° − (${a}° + ${b}° + ${d}°)`,`180° − (${a}° + ${b}° + ${d}°)`,`360° + ${a}° + ${b}° + ${d}°`],
    correct:`360° − (${a}° + ${b}° + ${d}°)`,numberLabel:'Dördüncü iç açının değeri kaç derecedir?',expected:missing,
    explain:'Her dörtgenin iç açıları toplamı 360° olduğundan bilinen üç açıyı bu toplamdan çıkarırız.',hint:'Dörtgenin açı toplamını üçgenin 180° toplamıyla karıştırma.',visual:'dörtgen'});
  }else if(['diagonalBuild','diagonalName','diagonalFacts'].includes(m)){
   const type=c.shape,description=diag[type];
   let options=[],correct='';
   if(focus==='lengths'){
    correct=['dikdörtgen','kare'].includes(type)?'Köşegen uzunlukları eşittir':'Köşegen uzunluklarının eşit olması zorunlu değildir';
    options=['dikdörtgen','kare'].includes(type)?
     [correct,'Köşegenler birbirlerini ortalamaz','Köşegenler farklı uzunluktadır']:
     [correct,'Köşegenler her zaman birbirine eşittir','Köşegenler daima farklı uzunluktadır'];
   }else if(focus==='perpendicular'){
    correct=['kare','eşkenar dörtgen'].includes(type)?'Köşegenler dik kesişir':'Köşegenlerin dik kesişmesi zorunlu değildir';
    options=[correct,'Köşegenler asla kesişmez','Köşegenler iki ayrı orta noktaya sahiptir'];
   }else {correct=description;options=[description,...Object.keys(diag).filter(x=>x!==type).slice(0,2).map(x=>diag[x])];}
   set({group:'Köşegen özellikleri',kind:'diagonal',title:focus==='perpendicular'?'Köşegenlerin dikliğini denetle':focus==='lengths'?'Köşegenlerin eşitliğini denetle':'Köşegenleri özelliklerinden sınıflandır',
    context:`Yeni şekil: ${type}. Köşegenleri O noktasında ortadan ikiye kesişiyor. AC köşegeni 12 cm.`,
    prompt:'Bu şekil için doğru olan özellik hangisi?',options,correct,
    numberLabel:'O orta nokta ise AO kaç santimetredir?',expected:6,
    explain:'Paralelkenar ailesinde köşegenler birbirlerini ortalar. Eşitlik ve diklik ise şekle göre değişebilir.',hint:'Köşegenlerin birbirini ortalaması ile eşit/dik olması farklı özelliklerdir.',visual:type});
  }else if(m==='midpointFix'){
   const half=4+(k%5);
   set({group:'Orta nokta',kind:'diagonal',title:'Köşegenleri ortak orta noktada buluştur',context:`Bir paralelkenarda AO=${half} cm ve O, AC köşegeninin orta noktası.`,
    prompt:'O orta nokta olduğunda hangi uzunluk eşitliği geçerlidir?',options:['AO = OC','AO > OC','AO + OC = AO'],correct:'AO = OC',
    numberLabel:'AC köşegeninin tamamı kaç santimetredir?',expected:2*half,
    explain:'Orta nokta, doğru parçasını iki eş uzunlukta parçaya ayırır. AC=AO+OC.',hint:'O orta noktaysa aynı köşegenin iki yarısı eşittir.',visual:'paralelkenar'});
  }else if(m==='triangleAngle'){
   const a=40+5*(k%5),b=50+5*(k%4);
   set({group:'Üçgenin iç açıları',kind:'triangle',title:'Üçgen açılarının toplamını kullan',context:`Yeni üçgende iki iç açı ${a}° ve ${b}°.`,
    prompt:'Üçüncü iç açıyı hangi yöntemle bulmalıyız?',options:[`180° − (${a}° + ${b}°)`,`${a}° + ${b}°`,`360° − (${a}° + ${b}°)`],correct:`180° − (${a}° + ${b}°)`,
    numberLabel:'Üçüncü iç açının değeri kaç derecedir?',expected:180-a-b,
    explain:'Üçgenin iç açıları toplamı 180° olduğundan kalan iç açı farkla bulunur.',hint:'Üçgenin 180°, dörtgenin 360° olduğunu hatırla.',visual:[a,b]});
  }else if(m==='triangleExterior'){
   const a=35+5*(k%5),b=45+5*(k%4);
   set({group:'Üçgenin dış açısı',kind:'triangle',title:'Dış açıyı uzak iç açılarla bul',context:`Yeni üçgende dış açının komşu olmadığı iç açılar ${a}° ve ${b}°.`,
    prompt:'Dış açıyı hangi işlemle hesaplarız?',options:[`${a}° + ${b}°`,`180° − (${a}° + ${b}°)`,`${b}° − ${a}°`],correct:`${a}° + ${b}°`,
    numberLabel:'Dış açının değeri kaç derecedir?',expected:a+b,
    explain:'Bir üçgenin dış açısı, komşu olmayan iki iç açının toplamına eşittir.',hint:'Bu kuralda uzak iki iç açı toplanır.',visual:[a,b]});
  }else if(m==='parallelAngle'){
   const alpha=55+5*(k%8);
   set({group:'Paralelkenarın komşu açıları',kind:'quadrilateral',title:'Komşu açıları bütünler yap',context:`Paralelkenarda bir iç açı ${alpha}° olarak ölçüldü.`,
    prompt:'Komşu iç açıyı bulmak için hangi işlem doğru?',options:[`180° − ${alpha}°`,`360° − ${alpha}°`,`${alpha}° ÷ 2`],correct:`180° − ${alpha}°`,
    numberLabel:'Komşu iç açının ölçüsü kaç derecedir?',expected:180-alpha,
    explain:'Paralelkenarda komşu iç açılar bütünlerdir; toplamları 180° olur.',hint:'Komşu açıların toplamı 180°.',visual:'paralelkenar'});
  }else if(m==='rhombusHalf'){
   const alpha=60+10*(k%5);
   set({group:'Eşkenar dörtgende açıortay',kind:'diagonal',title:'Köşegenin ikiye ayırdığı açıyı bul',context:`Eşkenar dörtgende bir köşe açısı ${alpha}°. Bu köşeden geçen köşegen açıortaydır.`,
    prompt:'Köşegen bu köşe açısına ne yapar?',options:['İki eş açıya ayırır','Açıyı 180° yapar','Açının ölçüsünü iki katına çıkarır'],correct:'İki eş açıya ayırır',
    numberLabel:'Oluşan küçük açılardan biri kaç derecedir?',expected:alpha/2,
    explain:'Eşkenar dörtgende köşegenler köşe açılarını iki eş açıya ayırır.',hint:'Verilen açıyı iki eş parçaya böl.',visual:'eşkenar dörtgen'});
  }else return null;
  if(!Number.isFinite(l.expected)||l.options.length!==3||new Set(l.options).size!==3||!l.options.includes(l.correct))return null;
  // Rotate choices without making the correct answer always the first button.
  const offset=String(task.id).split('').reduce((s,x)=>s+x.charCodeAt(0),0)%3;
  l.options=[...l.options.slice(offset),...l.options.slice(0,offset)];
  return l;
 }
 let activeId='',lesson=null,focus=null,ui=null,opened=false,selected='',answer='',attempts=0;
 const read=()=>{try{const d=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(d)?d:[]}catch{return []}};
 const latest=(id)=>progress.getEvents().filter(e=>e.taskId===id&&e.status==='wrong'&&e.evidence==='module-validator');
 function reset(){if(ui)ui.remove();ui=null;activeId='';lesson=null;focus=null;opened=false;selected='';answer='';attempts=0}
 function diagram(parent){
  const wrap=mk(parent,'div',undefined,'a619-diagram');wrap.setAttribute('role','img');wrap.setAttribute('aria-label',lesson.context);
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 350 160');svg.setAttribute('aria-hidden','true');wrap.appendChild(svg);
  const ns='http://www.w3.org/2000/svg';const add=(tag,attrs)=>{const a=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))a.setAttribute(k,String(v));svg.appendChild(a);return a};
  const lin=(x1,y1,x2,y2)=>add('line',{x1,y1,x2,y2,stroke:'#146c83','stroke-width':3,'stroke-linecap':'round'});
  const tx=(x,y,v)=>{const t=add('text',{x,y,fill:'#193c54','font-size':16,'font-weight':700,'text-anchor':'middle'});t.textContent=v};
  if(lesson.kind==='parallel'){
   lin(25,45,325,45);lin(25,120,325,120);lin(120,145,220,18);
   tx(233,33,'α');tx(210,106,'β');tx(300,30,'d₁ ∥ d₂');
  }else if(lesson.kind==='triangle'){
   add('polygon',{points:'45,133 300,133 163,21',fill:'#dcf5ff',stroke:'#146c83','stroke-width':3});tx(74,119,'A');tx(275,119,'B');tx(162,48,'x');
  }else if(lesson.kind==='diagonal'){
   add('polygon',{points:'70,30 250,30 290,135 110,135',fill:'#dcf5ff',stroke:'#146c83','stroke-width':3});
   lin(70,30,290,135);lin(250,30,110,135);tx(175,86,'O');tx(78,23,'A');tx(250,24,'B');tx(298,146,'C');tx(103,150,'D');
  }else{
   const shape=lesson.visual==='yamuk'?'80,30 245,30 315,135 40,135':lesson.visual==='paralelkenar'?'105,30 260,30 235,135 80,135':lesson.visual==='eşkenar dörtgen'?'170,15 278,85 170,151 62,85':lesson.visual==='kare'?'110,25 240,25 240,145 110,145':'80,25 270,25 270,145 80,145';
   add('polygon',{points:shape,fill:'#dcf5ff',stroke:'#146c83','stroke-width':3});tx(172,88,lesson.group.includes('açı')?'x°':'?');
  }
  mk(wrap,'small','Şematik çizimdir; açı ve kenar ölçekleri birebir değildir.');
 }
 function draw(){
  if(!lesson||!ui)return;ui.replaceChildren();
  const top=mk(ui,'div',undefined,'a619-top');const title=mk(top,'div');mk(title,'strong','📐 Geometri Koçu · Başka bir yoldan öğren');mk(title,'small',lesson.group+' · ana görevin yerine geçmez');
  const toggle=mk(top,'button',opened?'Çalışmayı gizle':'Kısa çalışmayı aç','a619-toggle');toggle.type='button';toggle.setAttribute('aria-expanded',String(opened));toggle.onclick=()=>{opened=!opened;draw()};
  mk(ui,'p',`Son yanlış doğrulamada gözlenen alan: ${fieldNames[focus]||'Geometrik karar'}. Bu bilgi öğrencinin zihnindeki yanılgıyı kesin olarak göstermez.`,'a619-focus');
  if(!opened)return;
  mk(ui,'h4',lesson.title);mk(ui,'p',lesson.context,'a619-context');diagram(ui);
  mk(ui,'p','1. Adım · '+lesson.prompt,'a619-prompt');
  const buttons=mk(ui,'div',undefined,'a619-options');for(const option of lesson.options){const b=mk(buttons,'button',option,'a619-option');b.type='button';b.setAttribute('aria-pressed',String(selected===option));b.onclick=()=>{selected=option;draw()}}
  const label=mk(ui,'label',undefined,'a619-label');mk(label,'span','2. Adım · '+lesson.numberLabel);
  const input=mk(label,'input');input.type='text';input.inputMode='decimal';input.autocomplete='off';input.placeholder='Sonucu yalnız sayı olarak yaz';input.value=answer;input.oninput=()=>{answer=input.value};
  const controls=mk(ui,'div',undefined,'a619-actions');const check=mk(controls,'button','İki adımı doğrula','a619-check');check.type='button';const hint=mk(controls,'button','💡 Küçük ipucu','a619-hint');hint.type='button';
  const message=mk(ui,'p','','a619-message');message.setAttribute('role','status');message.setAttribute('aria-live','polite');
  hint.onclick=()=>{message.textContent=lesson.hint;message.dataset.kind='hint'};
  check.onclick=()=>{
   attempts++;
   const raw=answer.trim().replace(',','.');const n=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)?Number(raw):NaN;
   const modelOK=selected===lesson.correct,numberOK=raw!==''&&Number.isFinite(n)&&Math.abs(n-lesson.expected)<1e-7;
   if(!modelOK||!numberOK){message.dataset.kind='wrong';message.textContent=(!modelOK?'Seçilen model bu durumda doğru değil. ':'Model doğru. ')+(!numberOK?'Sayısal kanıtı yeniden hesapla. ':'')+(attempts>=2?lesson.hint:'');return}
   const item={taskId:activeId,mode:lesson.mode,fieldKey:focus||'unknown',when:Date.now(),trials:attempts,kind:'optional-geometry-practice',mainTaskCompleted:false};
   const next=[...read().slice(-499),item],value=JSON.stringify(next);let saved=false;
   try{localStorage.setItem(KEY,value);saved=localStorage.getItem(KEY)===value}catch{}
   message.dataset.kind=saved?'success':'warning';message.textContent='✅ İki adım da doğru. '+lesson.explain+(saved?' Mini çalışma kaydedildi.':' ⚠ Mini çalışma kaydedilemedi; kayıt doğrulanamadı.');
  };
  mk(ui,'p','Ana görevin matematiksel doğrulamasına dönerek yeniden dene. Bu etkinlik ana görevi bitirmez, öğretmen onayı veya kesin tanı oluşturmaz.','a619-foot');
 }
 function show(){if(!lesson||!activeId)return;
  if(!ui){ui=document.createElement('section');ui.id='atlas619GeometryCoach';ui.className='a619-card';ui.setAttribute('aria-label','6. sınıf geometri hedefli destek');}
  if(ui.previousElementSibling!==lab)lab.insertAdjacentElement('afterend',ui);
  draw();
 }
 document.addEventListener('atlas:taskrender',e=>{
  reset();activeId=String(e.detail?.id||'');const task=tasks.get(activeId);if(!task)return;
  const ev=latest(activeId);if(ev.length>=2){const observed=ev.at(-1)?.fieldKey;
   focus=validFocus.has(observed)?observed:null;lesson=make(task,focus);if(lesson)show();}
 });
 document.addEventListener('atlas:attemptlogged',e=>{
  if(e.detail?.status!=='wrong'||e.detail.taskId!==activeId||!tasks.has(activeId))return;
  const ev=latest(activeId);if(ev.length<2)return;
  const observed=ev.at(-1)?.fieldKey;const newFocus=validFocus.has(observed)?observed:null;
  if(focus!==newFocus){selected='';answer='';attempts=0;opened=false}
  focus=newFocus;lesson=make(tasks.get(activeId),focus);if(lesson)show();
 });
 window.Atlas619GeometryCoach={count:tasks.size,modes:[...new Set([...tasks.values()].map(t=>t.geometry6Lab.mode))],buildForTests:(id,field)=>make(tasks.get(String(id)),field),version:'6.19'};
})();
