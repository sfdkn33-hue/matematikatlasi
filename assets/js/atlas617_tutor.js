/* Matematik Atlası v6.17: doğrulanmış model/hesap hatasına bağlanan iki aşamalı ek çalışma.
 * Yalnız v6.10/v6.11 laboratuvarları (96 görev): tanı kesin değildir; hata aşaması kanıttır.
 * Ek çalışma ana görevin cevabını veya başarı kaydını vermez.
 */
(()=>{'use strict';
 const db=window.ATLAS_DB,api=window.MatematikAtlas64,host=document.getElementById('atlasPlayingTop');
 if(!db||!api||!host)return;
 const all=new Map(db.tasks.map(t=>[String(t.id),t]));
 const KEY='mathAtlas617Practice';
 let current=null,opened=false,selected='',entered='',trials=0,lesson=null,ui=null;
 const el=(name,parent,text,cls)=>{const node=document.createElement(name);if(cls)node.className=cls;if(text!==undefined)node.textContent=String(text);parent?.appendChild(node);return node};
 const fmt=x=>String(x).replace('.',',');
 function skill(task){const a=task?.atlas610Workbench,b=task?.atlas611Workbench;
  if(a){const c=a.params.context;
   if(['cost','compare','reverse'].includes(c))return 'cost';
   if(['pattern','missing','formula'].includes(c))return 'pattern';
   if(['area','tiles','area-choice'].includes(c))return 'area';
   if(['circle-roll','pi-ratio','circle-scale'].includes(c))return 'circumference';
  }
  if(b){const m=b.mode;
   if(m==='circle')return 'triangle';
   if(['balls','wheel','claim'].includes(m))return 'probability';
   if(['sectorangle','sectorparts','sectorinverse'].includes(m))return 'sector';
   if(['rootfactor','rootchoice','rootreverse'].includes(m))return 'root';
  }
  return null;
 }
 function build(task){const type=skill(task);if(!type)return null;
  const seed=[...String(task.id)].reduce((n,ch)=>n+ch.charCodeAt(0),0), k=seed%4;
  let l={type,question:'',options:[],correct:'',numberLabel:'',expected:0,unit:'',explain:'',visual:'',focusHint:''};
  if(type==='cost'){
   const fixed=5+k,unit=3+(seed%3),count=2+(seed%4);
   l={...l,demo:{fixed,unit,count},title:'Sabit ve değişken ücreti ayır',visual:`Sabit ücret: ${fixed} TL  ·  ${count} paket  ·  Paket başına ${unit} TL`,
    question:'Toplam ücret için doğru işlem hangisi?',options:[`${fixed} + ${count} × ${unit}`,`(${fixed} + ${unit}) × ${count}`,`${fixed} + ${count} + ${unit}`],correct:`${fixed} + ${count} × ${unit}`,
    errors:{[`(${fixed} + ${unit}) × ${count}`]:'Bu işlemde sabit ücret de paket sayısı kadar tekrarlanıyor.',[`${fixed} + ${count} + ${unit}`]:'Birim ücreti paket sayısıyla çarpman gerekiyor.'},
    numberLabel:'Toplam ödeme (TL)',expected:fixed+count*unit,unit:'TL',explain:'Sabit ücret bir kere, paket ücreti paket sayısı kadar eklenir.',focusHint:'Sabit ücretin yalnız bir kez alınmasını göz önünde bulundur.'};
  }else if(type==='pattern'){
   const base=2+k,rate=3+seed%3,n=4+seed%3;
   l={...l,demo:{base,rate,n},title:'Örüntüyü kuralıyla kur',visual:`0. adım: ${base}   ·   Her adımda +${rate}   ·   İstenen: ${n}. adım`,
    question:'Doğru kural hangisi?',options:[`${base} + ${n} × ${rate}`,`${base} + (${n} − 1) × ${rate}`,`${base} + ${n} + ${rate}`],correct:`${base} + ${n} × ${rate}`,
    errors:{[`${base} + (${n} − 1) × ${rate}`]:'0. adım başlangıç olduğundan, n. adıma ulaşırken artışı n kez eklersin.',[`${base} + ${n} + ${rate}`]:'Artışın miktarı ile adım sayısını ayrı ayrı toplamak yeterli olmaz; çarpmalısın.'},
    numberLabel:`${n}. adımdaki değer`,expected:base+n*rate,explain:'Örüntünün başlangıç değeri 0. adıma aittir; n adımda artış n kez eklenir.',focusHint:'0. adımın da tanımlandığını unutma.'};
  }else if(type==='area'){
   const square=2+k;
   l={...l,demo:{square},title:'Uzunluk ve alan dönüşümünü ayır',visual:`${square} dm² alanlı kareli model`,
    question:'Bir desimetrekarenin santimetrekare karşılığı nedir?',options:['1 dm² = 100 cm²','1 dm² = 10 cm²','1 dm² = 1.000 cm²'],correct:'1 dm² = 100 cm²',
    errors:{'1 dm² = 10 cm²':'Bu dönüşüm uzunluk içindir; alanın iki boyutu vardır.','1 dm² = 1.000 cm²':'10 × 10 kare olduğunu kareli modelle kontrol et.'},
    numberLabel:`${square} dm² kaç cm² eder?`,expected:square*100,unit:'cm²',explain:'1 dm = 10 cm; alan için hem en hem boy dönüşür: 10 × 10 = 100.',focusHint:'Alan dönüşümünde çarpan karesini kullan.'};
  }else if(type==='circumference'){
   const d=6+2*k;
   l={...l,demo:{d},title:'Çap ile çemberin çevresini ilişkilendir',visual:`Çap = ${d} cm  ·  π sembolik bırakılacak`,
    question:'Çevreyi veren doğru ifade hangisi?',options:['Çevre = π × çap','Çevre = π × yarıçap','Çevre = π × yarıçap²'],correct:'Çevre = π × çap',
    errors:{'Çevre = π × yarıçap':'Yarıçapın iki katı çapı verir; tek πr çevreye yetmez.','Çevre = π × yarıçap²':'Yarıçapın karesi çemberin çevresi için değil, dairenin alanı için kullanılır.'},
    numberLabel:'Çevre kaç π cm eder? (yalnız katsayıyı yaz)',expected:d,unit:'π cm',explain:'Çemberin çevresi çapın π katıdır. Yarıçap kullanırsan 2πr yazmalısın.',focusHint:'Yarıçap, çapın yarısıdır.'};
  }else if(type==='triangle'){
   const variants=[[3,4,5,'Çeşitkenar'],[4,4,5,'İkizkenar'],[5,5,5,'Eşkenar'],[4,5,6,'Çeşitkenar']];const [a,b,c,klass]=variants[k];
   l={...l,demo:{a,b,c},title:'Üçgeni kenarlarıyla tanı',visual:`Kenarlar: ${a} birim · ${b} birim · ${c} birim`,
    question:'Bu üçgen kenar uzunluklarına göre hangi türdedir?',options:['Eşkenar','İkizkenar','Çeşitkenar'],correct:klass,
    numberLabel:'Üçgenin çevresi kaç birimdir?',expected:a+b+c,unit:'birim',explain:'Çevre üç kenarın toplamıdır. Kenarların eşitliği ise üçgenin türünü belirler.',focusHint:'Sınıflandırırken yalnız çevreye değil, hangi kenarların eşit olduğuna bak.'};
  }else if(type==='probability'){
   const red=2+k,blue=red+2;
   l={...l,demo:{red,blue},title:'Eşit olasılığı kur',visual:`Torbada ${red} kırmızı ve ${blue} mavi bilye var.`,
    question:'Çekilme olasılıklarını eşitlemek için hangi işlem gerekir?',options:['2 kırmızı ekle','2 mavi ekle','1 kırmızı ekle'],correct:'2 kırmızı ekle',
    errors:{'2 mavi ekle':'Mavi bilye zaten daha fazla; bu seçenekte fark büyür.','1 kırmızı ekle':'Bir kırmızı bilye eklenirse iki rengin sayısı yine eşit olmaz.'},
    numberLabel:'Eşitlemeden sonra kırmızı bilye seçilme olasılığı yüzde kaç?',expected:50,unit:'%',explain:'Eş sayıda iki renk varsa kırmızı seçilme olasılığı 1/2, yani %50 olur.',focusHint:'Eş olasılık için iki rengin sayısını eşitle.'};
  }else if(type==='sector'){
   const angle=k%2===0?90:180,radius=4+2*(seed%3),fraction=angle===90?'1/4':'1/2';
   l={...l,demo:{angle,radius},title:'Daire dilimini bütünle karşılaştır',visual:`Yarıçap = ${radius} birim · Merkez açı = ${angle}°`,
    question:'Bu dilim tam dairenin kaçta kaçıdır?',options:['1/4','1/2','3/4'],correct:fraction,
    numberLabel:'Dilim alanı kaç π birimkaredir? (yalnız katsayı)',expected:radius*radius*(angle/360),unit:'π birim²',explain:'Daire alanını merkez açının 360 dereceye oranıyla çarparsın.',focusHint:'Önce merkez açının tam açıya oranını bul.'};
  }else if(type==='root'){
   const pairs=[[72,36,6],[98,49,7],[200,100,10],[162,81,9]],[n,sq,coef]=pairs[k];
   const d=[sq,4,9,16,25].filter((x,i,arr)=>arr.indexOf(x)===i&&x!==sq).slice(0,2);
   l={...l,demo:{n,sq,coef},title:'En büyük tam kareyi bul',visual:`√${n} ifadesini sadeleştir.`,
    question:'Kök içinde ayırabileceğin en büyük tam kare çarpanı hangisi?',options:[String(sq),...d.map(String)],correct:String(sq),
    numberLabel:'Kök dışındaki katsayı kaçtır?',expected:coef,explain:`${n} = ${sq} × 2; tam kare çarpan kök dışına √${sq} olarak çıkar.`,focusHint:'Kök dışına çıkan katsayının karesi, seçtiğin tam kare çarpana eşittir.'};
  }
  // Vary answer position deterministically; no fixed first-button shortcut.
  if(l.options?.length){const shift=seed%l.options.length;l.options=[...l.options.slice(shift),...l.options.slice(0,shift)]}
  return l;
 }
 function diagram(panel,l){
  const d=l.demo||{},root=el('div',panel,undefined,'a617-demo');root.setAttribute('role','img');root.setAttribute('aria-label','Etkileşimsiz matematiksel referans modeli: '+l.visual);
  const tag=(content,cls)=>el('span',root,content,cls||'a617-mini-item');
  if(l.type==='cost'){
   tag('Sabit ücret '+d.fixed+' TL','a617-fixed');for(let i=0;i<d.count;i++)tag('Paket '+(i+1),'a617-mini-item');
   el('small',root,'Her paket '+d.unit+' TL. Sabit ücreti kaç kez ödersin?','a617-demo-caption');
  }else if(l.type==='pattern'){
   tag('0. adım: '+d.base,'a617-fixed');for(let i=1;i<=3;i++)tag((i)+'. adım: +'+d.rate,'a617-mini-item');
   el('small',root,'Büyüme her adımda aynı miktardır.','a617-demo-caption');
  }else if(l.type==='area'){
   const box=el('div',root,undefined,'a617-area-grid');for(let i=0;i<100;i++)el('i',box,undefined,'a617-area-cell');
   el('small',root,'10 × 10 küçük kareden oluşan 1 dm² alan modeli','a617-demo-caption');
  }else if(l.type==='circumference'){
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 200 125');svg.setAttribute('aria-hidden','true');svg.classList.add('a617-svg');
   const add=(type,atts,txt)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',type);for(const [k,v] of Object.entries(atts))n.setAttribute(k,String(v));if(txt!==undefined)n.textContent=txt;svg.append(n)};
   add('circle',{cx:100,cy:62,r:49,fill:'#d7eafb',stroke:'#1e749e','stroke-width':3});add('line',{x1:51,y1:62,x2:149,y2:62,stroke:'#b84c2d','stroke-width':3});add('text',{x:100,y:54,fill:'#17334a','font-size':15,'text-anchor':'middle'},'d = '+d.d);root.append(svg);
  }else if(l.type==='triangle'){
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 240 140');svg.setAttribute('aria-hidden','true');svg.classList.add('a617-svg');svg.innerHTML='<path d="M22 117 L210 117 L113 14 Z" fill="#dff1fc" stroke="#216e98" stroke-width="3"/>';
   for(const [text,x,y]of[[d.a,54,59],[d.b,176,59],[d.c,113,134]]){const tx=document.createElementNS('http://www.w3.org/2000/svg','text');tx.setAttribute('x',x);tx.setAttribute('y',y);tx.setAttribute('fill','#142f46');tx.setAttribute('font-size','18');tx.textContent=String(text);svg.append(tx)}root.append(svg);
   el('small',root,'Şema ölçekli değildir; kenar değerleri esas alınır.','a617-demo-caption');
  }else if(l.type==='probability'){
   const groups=[['Kırmızı',d.red,'a617-red'],['Mavi',d.blue,'a617-blue']];for(const [name,n,cls]of groups){let group=el('div',root,undefined,'a617-ball-row');el('strong',group,name+': '+n,'a617-ball-label');for(let i=0;i<n;i++)el('i',group,undefined,'a617-ball '+cls)}
  }else if(l.type==='sector'){
   const circle=el('div',root,undefined,'a617-sector');circle.style.background=`conic-gradient(#358ac3 0deg ${d.angle}deg,#e2eaf0 ${d.angle}deg 360deg)`;circle.setAttribute('aria-hidden','true');tag(d.angle+'° merkez açı','a617-fixed');
  }else if(l.type==='root'){
   tag('√'+d.n,'a617-root-tile');tag('=','a617-mini-item');tag('√( □ × 2 )','a617-root-tile');
  }
 }
 function getLastFocus(id){const ev=api.getEvents().filter(e=>e.taskId===id&&e.status==='wrong');return ev.at(-1)?.focus||null}
 function reset(){opened=false;selected='';entered='';trials=0;if(ui){ui.remove();ui=null}}
 function render(){if(!current||!lesson||!ui)return;ui.replaceChildren();const t=current;
  const head=el('div',ui,undefined,'a617-head');const headText=el('div',head);el('strong',headText,'🧩 Başka bir yoldan öğren');el('span',headText,'Ayrı bir mini çalışma · ana görevin yerine geçmez','a617-small');
  const close=el('button',head,opened?'Kapat':'Çalışmayı aç','a617-toggle');close.type='button';close.setAttribute('aria-expanded',String(opened));close.onclick=()=>{opened=!opened;render()};
  if(!opened)return;
  const focus=getLastFocus(t.id);if(focus)el('p',ui,(focus==='model'?'Son kontrolde model/seçim aşaması':focus==='hesap'?'Son kontrolde sayısal hesap aşaması':'Son kontrolde çok adımlı çözüm')+' doğru değildi. Bu, hatanın kesin nedenini göstermez.','a617-context');
  el('h4',ui,lesson.title);el('p',ui,lesson.visual,'a617-visual');diagram(ui,lesson);el('p',ui,'1. Adım — '+lesson.question,'a617-prompt');
  const choices=el('div',ui,undefined,'a617-choices');for(const option of lesson.options){const button=el('button',choices,option,'a617-choice');button.type='button';button.setAttribute('aria-pressed',String(selected===option));if(selected===option)button.classList.add('on');button.onclick=()=>{selected=option;render()}}
  const label=el('label',ui,undefined,'a617-number');el('span',label,'2. Adım — '+lesson.numberLabel);const input=el('input',label);input.type='text';input.inputMode='decimal';input.autocomplete='off';input.value=entered;input.placeholder='Sayısal sonucu yaz';input.setAttribute('aria-label',lesson.numberLabel);input.oninput=()=>{entered=input.value};
  const bar=el('div',ui,undefined,'a617-actions');const check=el('button',bar,'İki adımı kontrol et','a617-check');check.type='button';
  const help=el('button',bar,'Küçük ipucu','a617-help');help.type='button';
  const status=el('p',ui,'','a617-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  help.onclick=()=>{status.textContent=lesson.focusHint;status.dataset.kind='hint'};
  check.onclick=()=>{
   if(!current||current.id!==t.id)return;
   trials++;const modelCorrect=selected===lesson.correct;
   const raw=entered.trim().replace(',','.');const value=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)?Number(raw):NaN;
   const numberCorrect=raw!==''&&Number.isFinite(value)&&Math.abs(value-lesson.expected)<1e-8;
   if(!modelCorrect||!numberCorrect){status.dataset.kind='wrong';status.textContent=(!modelCorrect?(lesson.errors?.[selected]||'Önce işlem veya model seçimini yeniden incele.')+' ':'Model doğru; sayısal sonucunu yeniden hesapla. ')+(trials>=2?lesson.focusHint:'');return}
   const payload={taskId:t.id,type:lesson.type,when:Date.now(),attempts:trials,kind:'optional-mini-practice',mainTaskCompleted:false};
   let saved=false;try{const prior=JSON.parse(localStorage.getItem(KEY)||'[]');const next=[...(Array.isArray(prior)?prior:[]).slice(-499),payload],value=JSON.stringify(next);localStorage.setItem(KEY,value);saved=localStorage.getItem(KEY)===value}catch(e){}
   status.dataset.kind=saved?'right':'warn';status.textContent='✅ İki adımı da doğru yaptın. '+lesson.explain+(saved?' Mini çalışma kaydedildi.':' ⚠ Mini çalışmanın kaydı yapılamadı.');
   // The original task remains untouched; do NOT call the application's task completion path.
  };
  el('p',ui,'Bu çalışma asıl görevi tamamlamaz. Lütfen kendi soruna dönerek yeniden çöz. Öneri, kanıtlanmış bir kavram yanılgısı teşhisi değildir.','a617-foot');
 }
 function display(){const root=document.getElementById(current?.atlas610Workbench?'atlas610Lab':'atlas611Lab');if(!root||root.hidden)return;
   if(!ui){ui=document.createElement('section');ui.id='atlas617Tutor';ui.className='a617-wrap';ui.setAttribute('aria-label','Kısa matematik pekiştirme çalışması')}
   root.insertAdjacentElement('beforebegin',ui);render();
 }
 document.addEventListener('atlas:taskrender',ev=>{reset();current=all.get(String(ev.detail?.id||''))||null;lesson=build(current);if(current&&lesson){let past=api.getEvents().filter(x=>x.taskId===current.id&&x.status==='wrong');if(past.length>=2)display()}});
 document.addEventListener('atlas:attemptlogged',ev=>{if(ev.detail?.status!=='wrong'||!current||ev.detail.taskId!==current.id||!lesson)return;
  const errors=api.getEvents().filter(x=>x.taskId===current.id&&x.status==='wrong').length;
  if(errors>=2)display();
 });
 window.Atlas617Tutor={supports:id=>!!build(all.get(id)),lessonFor:id=>build(all.get(id)),count:db.tasks.filter(t=>skill(t)!==null).length,version:'6.17'};
})();
