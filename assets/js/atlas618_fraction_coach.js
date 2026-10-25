/* Matematik Atlası v6.18 — gözlenmiş cevap alanına bağlı kesir desteği.
   Bu katman yalnız 5. sınıfın 150 kesir oyununda çalışır.
   Yanlışın görüldüğü alanı gözler; öğrencinin zihinsel nedenini teşhis etmez.
   Asıl cevapları doldurmaz, ana tamamlama/ustalık kaydı üretmez.
*/
(()=>{'use strict';
 const db=window.ATLAS_DB, progress=window.MatematikAtlas64, lab=document.getElementById('fraction5PlusLab');
 if(!db||!progress||!lab)return;
 const tasks=new Map(db.tasks.filter(t=>t.fraction5PlusLab).map(t=>[String(t.id),t]));
 const KEY='mathAtlas618Practice';
 const labels={paint:'Eş parça modeli',equiv:'Denk kesir seçimi',decimal:'Ondalık gösterim',percent:'Yüzde gösterimi',marker:'Sayı doğrusu konumu',whole:'Tam kısmı belirleme',factor:'Genişletme çarpanı',newNumerator:'Yeni payı hesaplama',remainder:'Kalan parçalar',dial:'Yüzde çarkı',fraction:'Kesir gösterimi',markerA:'A noktasının konumu',markerB:'B noktasının konumu',sign:'Kesir karşılaştırması',cross:'Çapraz çarpım',sequence:'Sıralama',winner:'Doğru kartı seçme',distance:'Uzaklık hesabı',verdict:'İddianın doğruluğu',correct:'Doğru eşitsizlik işareti',between:'Aradaki kesri belirleme',proof:'Eşitsizliği doğrulama',diff:'Yüzde fark hesabı'};
 const mk=(parent,tag,text,cls)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=String(text);parent.appendChild(node);return node};
 const decimal=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:4});
 const frac=(n,d)=>`${n}/${d}`;
 const choice=(a,b,c)=>[String(a),String(b),String(c)];
 function make(task,focus=null){
  if(!task?.fraction5PlusLab)return null;
  const {mode,seed}=task.fraction5PlusLab,k=Number(seed)||0;
  let t={mode,title:'',context:'',prompt:'',options:[],correct:'',numberLabel:'',expected:0,explain:'',visual:null,tip:'',wrongTip:'Doğru işlemi seçerken bütünün büyüklüğünü ve birimlerini kontrol et.'};
  if(mode==='stripPaint'){
   const den=[3,4,5,6,8][k%5],num=1+(k%(den-1));
   Object.assign(t,{title:'Bütünü eş parçalara ayır',context:`Bir bütün ${den} eş parçaya ayrıldı; ${num} tanesi boyalı.`,prompt:'Boyalı kısmı hangi kesir gösterir?',options:choice(frac(num,den),frac(den,num),frac(num,den+1)),correct:frac(num,den),numberLabel:'Payı ve paydayı 2 ile genişletirsen yeni pay kaç olur?',expected:2*num,explain:'Pay boyalı parçaları, payda bütünün eş parça sayısını gösterir. Denk kesirde ikisi de aynı sayıyla çarpılır.',visual:{parts:den,fill:num},tip:'Payı sayarken boyalıları, paydayı bulurken bütün eş parçaları say.',wrongTip:'Pay ile paydayı yer değiştirmek kesrin değerini değiştirir.'});
  }else if(mode==='hundredGrid'){
   const n=[15,25,35,45,55,65,70,80,90,95][k%10];
   Object.assign(t,{title:'Yüzlük kareyi oku',context:`100 kareden ${n} tanesi boyalı.`,prompt:'Boyalı kısmın yüzdesi hangisidir?',options:choice(`%${n}`,`%${n/10}`,`%${100-n}`),correct:`%${n}`,numberLabel:'Aynı miktarın ondalık gösterimi kaçtır?',expected:n/100,explain:'100 eş kareden boyalı olanların sayısı yüzdeyi, yüze bölünmüş hâli ondalık sayıyı verir.',visual:{parts:100,fill:n},tip:'Yüzde, yüz eş parçanın kaç tanesinin seçildiğini belirtir.'});
  }else if(mode==='representationMatch'){
   const n=1+k%9;
   Object.assign(t,{title:'Üç gösterim, aynı miktar',context:`Kesir: ${n}/10`,prompt:'Bu kesrin yüzdelik karşılığı hangisi?',options:choice(`%${n*10}`,`%${n}`,`%${n*10+10}`),correct:`%${n*10}`,numberLabel:'Ondalık karşılığını yaz.',expected:n/10,explain:'10 paydalı kesri 100 paydalı hâle getirmek için 10 ile genişlet; ondalıkta onda birler basamağını kullan.',visual:{parts:10,fill:n},tip:'Payda 10 ise yüzde için payı 10 ile çarp.'});
  }else if(mode==='numberLine'){
   const n=[3,6,9,12,15,17,4,8,11,16][k%10];
   Object.assign(t,{title:'Kesri sayı doğrusuna koy',context:`Konum: ${n}/10 · sayı doğrusu 0–2 arasında.`,prompt:'Noktanın tam kısmı hangisi?',options:choice(Math.floor(n/10),Math.floor(n/10)+1,Math.floor(n/10)===0?2:0),correct:String(Math.floor(n/10)),numberLabel:'Noktanın yüzde konumu kaçtır? (1 tam = %100)',expected:n*10,explain:'Payı paydaya böldüğünde tam kısmı ve yüzde konumu belirlenir. 1 tam, %100 konumudur.',visual:{line:n/10,max:2},tip:'Önce noktanın 1 tamdan küçük mü büyük mü olduğunu bul.'});
  }else if(mode==='equivalenceBridge'){
   const den=3+k%4,num=1+k%(den-1),factor=2+k%3;
   Object.assign(t,{title:'Denk kesir köprüsü',context:`${num}/${den} kesrinin paydasını ${den*factor} yap.`,prompt:'Paydayı kaçla çarpman gerekiyor?',options:choice(factor,factor+1,1),correct:String(factor),numberLabel:'Yeni pay kaç olacaktır?',expected:num*factor,explain:'Denk kesir için pay ve paydayı aynı sayı ile çarpmalısın.',visual:{parts:den,fill:num},tip:'Yeni paydayı eski paydaya böl; sonra payı da aynı sayı ile çarp.'});
  }else if(mode==='mixedImproper'||mode==='pizzaShare'){
   const den=3+k%3,whole=1+k%3,rem=1+k%(den-1),num=whole*den+rem;
   Object.assign(t,{title:'Bileşik kesri bütünlere ayır',context:`${num}/${den} parçan var. Her bütün ${den} parçadan oluşuyor.`,prompt:'Kaç tam bütün oluşturabilirsin?',options:choice(whole,whole+1,Math.max(0,whole-1)),correct:String(whole),numberLabel:'Bütünleri ayırdıktan sonra kaç parça kalır?',expected:rem,explain:'Payı paydaya böldüğünde bölüm tam kısım, kalan ise yeni kesrin payıdır.',visual:{parts:den,fill:num,whole},tip:'Her bütün için paydaya eşit miktarda parça ayır.'});
  }else if(mode==='percentDial'){
   const n=1+k%9,percent=n*10;
   Object.assign(t,{title:'Yüzde çarkından kesre',context:`Çarkın %${percent} bölümü renklendirilmiş.`,prompt:'Bu miktara eşit kesir hangisidir?',options:choice(frac(n,10),frac(n,100),frac(10,n)),correct:frac(n,10),numberLabel:'Çarkı 10 eş sektöre ayırırsan kaç tanesi boyalı olur?',expected:n,explain:'%10, on eş parçadan biridir. %'+percent+', '+n+' adet onda birlik parçadır.',visual:{parts:10,fill:n},tip:'Yüzdeyi 10 ile bölerek on eş parçalı modeldeki parça sayısını bul.'});
  }else if(mode==='numberLineDuel'){
   const a=1+k%6,b=(a+2+k%3),swap=k%2===1;const A=swap?b:a,B=swap?a:b;
   Object.assign(t,{title:'İki kesir, iki nokta',context:`A = ${A}/10 · B = ${B}/10`,prompt:'A ile B arasındaki doğru karşılaştırma hangisi?',options:choice('<','=','>'),correct:A<B?'<':A>B?'>':'=',numberLabel:'B noktasının yüzde konumu kaçtır?',expected:B*10,explain:'Aynı paydaya sahip kesirleri paylarına bakarak sıralayabilirsin; yüzde konum için 10 ile genişlet.',visual:{lineA:A/10,lineB:B/10,max:1},tip:'Sağdaki nokta daha büyük sayıyı gösterir.'});
  }else if(mode==='compareSigns'){
   const cases=[[1,2,2,3],[3,4,2,3],[2,5,1,2],[3,5,4,7],[4,5,3,4],[1,3,2,7],[5,6,7,8],[2,3,3,4],[3,8,1,2],[4,7,3,5]];
   const [a,b,c,d]=cases[k%10];
   Object.assign(t,{title:'Çapraz çarpımla karşılaştır',context:`${a}/${b}  ?  ${c}/${d}`,prompt:'Doğru karşılaştırma işareti hangisi?',options:choice('<','=','>'),correct:a*d<c*b?'<':a*d>c*b?'>':'=',numberLabel:`Soldaki çapraz çarpım (${a} × ${d}) kaçtır?`,expected:a*d,explain:'Sol pay × sağ payda ile sağ pay × sol paydayı karşılaştır; paydayı doğrudan büyüklük ölçüsü sanma.',visual:{comparison:[[a,b],[c,d]]},tip:'Paydalar farklıysa çapraz çarpımları karşılaştır.'});
  }else if(mode==='sortCards'){
   const low=10+k%3*5,mid=40+k%4*5,high=75+k%3*5;
   Object.assign(t,{title:'Farklı gösterimleri sırala',context:`Kartlar: %${high}, ${decimal(low/100)}, ${mid}/100`,prompt:'Küçükten büyüğe doğru sıralama hangisi?',options:choice(`${decimal(low/100)} < ${mid}/100 < %${high}`,`%${high} < ${mid}/100 < ${decimal(low/100)}`,`${mid}/100 < ${decimal(low/100)} < %${high}`),correct:`${decimal(low/100)} < ${mid}/100 < %${high}`,numberLabel:'En büyük kartın yüzde değeri kaçtır?',expected:high,explain:'Her ifadeyi 100 üzerinden düşünürsen gösterimler arasında güvenilir bir sıralama yaparsın.',visual:{cards:[low,mid,high]},tip:'Kesir, yüzde ve ondalık gösterimleri önce aynı ölçekte yaz.'});
  }else if(mode==='closestAnchor'){
   const gap=5*(1+k%3),middle=50+(k%2?-gap:gap);
   Object.assign(t,{title:'Referansa en yakın noktayı bul',context:`Referans: %50 · Kartlar: %10, %${middle}, %90`,prompt:'Referansa en yakın kart hangisidir?',options:choice(`%${middle}`,'%10','%90'),correct:`%${middle}`,numberLabel:'En yakın kartın referansa uzaklığı yüzde kaç puandır?',expected:gap,explain:'Sayı doğrusundaki uzaklık iki sayının farkının mutlak değeridir.',visual:{lineA:0.5,lineB:middle/100,max:1},tip:'Yalnız küçük veya büyük olmasına değil, %50’ye olan uzaklığına bak.'});
  }else if(mode==='errorDetect'){
   const a=2+k%4,b=a+2;
   Object.assign(t,{title:'Robotun karşılaştırmasını denetle',context:`Robot: “${a}/10 > ${b}/10”`,prompt:'Robotun iddiası doğru mu?',options:choice('Doğru','Yanlış','Karar verilemez'),correct:'Yanlış',numberLabel:'Sağdaki kesrin yüzde karşılığı kaçtır?',expected:b*10,explain:'Paydalar eşitse payı büyük kesir daha büyüktür. Bu yüzden robotun > işareti yanlıştır.',visual:{lineA:a/10,lineB:b/10,max:1},tip:'Eş paydalı kesirleri karşılaştırırken payları incele.'});
  }else if(mode==='fractionRelay'){
   const low=1+k%3,high=8+k%2,between=4+k%3;
   Object.assign(t,{title:'İki sınır arasına yerleş',context:`Alt sınır: ${low}/10 · Üst sınır: ${high}/10`,prompt:'Hangi kart iki sınırın kesinlikle arasındadır?',options:choice(frac(between,10),frac(low,10),frac(high,10)),correct:frac(between,10),numberLabel:'Aradaki kartın yüzde konumu kaçtır?',expected:between*10,explain:'Arada olmak için sayı iki sınıra da eşit olmamalı: alt sınırdan büyük, üst sınırdan küçük olmalı.',visual:{lineA:low/10,lineB:high/10,line:between/10,max:1},tip:'Sınırdaki noktalar aralığın içinde kabul edilmez.'});
  }else if(mode==='budgetChoice'){
   const low=10+(k%3)*5,mid=40,high=70+(k%3)*5;
   Object.assign(t,{title:'En yüksek payı bul',context:`Plan A: %${low} · Plan B: ${mid}/100 · Plan C: ${decimal(high/100)}`,prompt:'En yüksek pay hangi plandadır?',options:choice('Plan A','Plan B','Plan C'),correct:'Plan C',numberLabel:'En yüksek ve en düşük pay arasındaki fark kaç yüzde puandır?',expected:high-low,explain:'Tüm miktarları yüzdeye çevir. En büyükten en küçüğü çıkar; bulunan sayı yüzde puan farkıdır.',visual:{cards:[low,mid,high]},tip:'Ondalık ve kesirleri yüzdeyle aynı ölçeğe getir.'});
  }else return null;
  // v6.18: The observed failed field selects a different mathematical re-entry point.
  // It is evidence about an answer field, NOT a diagnosis of why the child answered so.
  if(mode==='stripPaint'&&focus==='equiv'){
   const d=[3,4,5,6,8][k%5],n=1+k%(d-1);
   Object.assign(t,{title:'Denkliği iki tarafta birlikte kur',context:`İlk kesir: ${n}/${d}. Şeridi aynı büyüklükte yeniden böl.`,prompt:'Pay ve paydayı birlikte 2 ile çarparsan hangi kesir oluşur?',options:choice(frac(n*2,d*2),frac(n,d*2),frac(n*2,d)),correct:frac(n*2,d*2),numberLabel:'Yeni pay kaç olur?',expected:n*2,explain:'Bütünü daha çok parçaya ayırınca boyalı parça sayısını da aynı katsayıyla artırmalısın.',tip:'Denk kesirde sadece paydayı değiştirmek yeterli değildir.',wrongTip:'Pay ve paydayı aynı çarpanla dönüştür.'});
  }else if(mode==='hundredGrid'&&focus==='decimal'){
   const n=[15,25,35,45,55,65,70,80,90,95][k%10];
   Object.assign(t,{title:'Yüz kareyi ondalık sayıya çevir',context:`Bir yüzlük tabloda ${n} kare boyalı.`,prompt:'Bu miktar hangi ondalık sayıdır?',options:choice(decimal(n/100),decimal(n/1000),decimal(n/10)),correct:decimal(n/100),numberLabel:'Bu ondalık sayıyı yüzdeye çevirirsen kaç olur?',expected:n,explain:'Yüzde birler basamağı, yüzlük modelin her karesini temsil eder.',tip:'100 kareden seçilenlerin sayısını 100’e böl.',wrongTip:'Ondalık basamak kaydırma ile boyalı kare sayısını karıştırma.'});
  }else if(mode==='representationMatch'&&focus==='decimal'){
   const n=1+k%9;
   Object.assign(t,{title:'Ondalık basamağı yerleştir',context:`${n}/10 kadar boyalı bir model var.`,prompt:'Ondalık gösterim hangisidir?',options:choice(decimal(n/10),decimal(n/100),decimal(n)),correct:decimal(n/10),numberLabel:'Aynı miktar yüzde kaçtır? (yalnız sayıyı yaz)',expected:n*10,explain:'Onda birler basamağındaki rakamı yüzde karşılığına çevirmek için 10 ile çarparsın.',tip:'Payda 10 ise ondalık sayıda virgülden sonraki ilk basamağa bak.'});
  }else if(mode==='equivalenceBridge'&&focus==='newNumerator'){
   const d=3+k%4,n=1+k%(d-1),factor=2+k%3,newN=n*factor;
   Object.assign(t,{title:'Yeni payı üret',context:`${n}/${d} kesri ${factor} ile genişletiliyor.`,prompt:'Yeni kesrin payı hangisidir?',options:choice(newN,newN-1,newN+1),correct:String(newN),numberLabel:'Yeni kesrin paydası kaçtır?',expected:d*factor,explain:'Her iki terime aynı genişletme çarpanını uygula; boyalı pay da aynı oranda büyür.',tip:'Yeni pay = eski pay × genişletme çarpanı.'});
  }else if(['mixedImproper','pizzaShare'].includes(mode)&&focus==='remainder'){
   const d=3+k%3,w=1+k%3,r=1+k%(d-1),num=w*d+r;
   Object.assign(t,{title:'Bütünlerden arta kalanı ayır',context:`${num}/${d} parçadan ${w} tam bütün oluşturuldu.`,prompt:'Geriye hangi kesir kalır?',options:choice(frac(r,d),frac(r+1,d),frac(d,r)),correct:frac(r,d),numberLabel:'Başta toplam kaç bütün oluşturulmuştu?',expected:w,explain:'Tam bütünleri ayırdıktan sonra kalan, paydaya göre kesir olarak yazılır.',tip:'Payı paydaya böl; kalan, pay olacak.'});
  }else if(mode==='numberLineDuel'&&['markerA','markerB'].includes(focus)){
   const a=1+k%6,b=a+2+k%3,swap=k%2===1,A=swap?b:a,B=swap?a:b,point=focus==='markerA'?A:B,other=focus==='markerA'?B:A;
   Object.assign(t,{title:'Noktanın yüzde konumunu bul',context:`A = ${A}/10 · B = ${B}/10`,prompt:`${focus==='markerA'?'A':'B'} noktası hangi yüzde konumundadır?`,options:choice(`%${point*10}`,`%${point}`,`%${other*10}`),correct:`%${point*10}`,numberLabel:'Öteki noktanın yüzde konumu kaçtır?',expected:other*10,explain:'Ondalık sayı doğrusu ile yüzde ölçeği arasında dönüşüm yaparken 1 bütün = %100 kullanılır.',tip:'Paydası 10 olan kesri yüzdeye çevirmek için payı 10 ile çarp.'});
  }else if(mode==='compareSigns'&&focus==='cross'){
   const [a,b,c,d]=[[1,2,2,3],[3,4,2,3],[2,5,1,2],[3,5,4,7],[4,5,3,4],[1,3,2,7],[5,6,7,8],[2,3,3,4],[3,8,1,2],[4,7,3,5]][k%10];
   Object.assign(t,{title:'Çapraz çarpımı doğru eşleştir',context:`${a}/${b} ile ${c}/${d} karşılaştırılıyor.`,prompt:'Soldaki çapraz çarpım hangi işlemdir?',options:choice(`${a} × ${d}`,`${a} × ${b}`,`${c} × ${d}`),correct:`${a} × ${d}`,numberLabel:'Bu çarpımın sonucu kaçtır?',expected:a*d,explain:'Soldaki payı sağdaki payda ile; sağdaki payı soldaki payda ile çarparsın.',tip:'Çapraz çarpımda aynı kesrin payını kendi paydasıyla çarpma.'});
  }else if(mode==='errorDetect'&&focus==='correct'){
   const a=2+k%4,b=a+2;
   Object.assign(t,{title:'Yanlış işareti düzelt',context:`Robot “${a}/10 > ${b}/10” demiş.`,prompt:'Doğru işaret hangisi olmalı?',options:choice('<','=','>'),correct:'<',numberLabel:'Soldaki kesir yüzde kaçtır?',expected:a*10,explain:'Eş paydalarda küçük pay, küçük kesre karşılık gelir.',tip:'Aynı paydaya sahip iki kesrin paylarını karşılaştır.'});
  }else if(mode==='budgetChoice'&&focus==='diff'){
   const low=10+k%3*5,high=70+k%3*5;
   Object.assign(t,{title:'Yüzde farkını çıkarma ile bul',context:`İki planın payları %${low} ve %${high}.`,prompt:'Yüzde puan farkı hangi işlemle bulunur?',options:choice(`${high} − ${low}`,`${high} + ${low}`,`${low} − ${high}`),correct:`${high} − ${low}`,numberLabel:'Aradaki fark kaç yüzde puandır?',expected:high-low,explain:'İki yüzde arasındaki yüzde puan farkı büyüğünden küçüğünün çıkarılmasıdır.',tip:'Fark bulurken toplamak yerine çıkarma işlemi kullan.'});
  }
  if(new Set(t.options).size!==3||!t.options.includes(t.correct)||!Number.isFinite(t.expected))return null;
  const offset=String(task.id).split('').reduce((s,ch)=>s+ch.charCodeAt(0),0)%3;
  t.options=[...t.options.slice(offset),...t.options.slice(0,offset)];
  return t;
 }
 let activeId='',lesson=null,focusKey=null,selected='',numberValue='',wrongChecks=0,opened=false,host=null;
 const read=()=>{try{const entries=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(entries)?entries:[]}catch{return []}};
 function reset(){if(host)host.remove();host=null;activeId='';lesson=null;focusKey=null;selected='';numberValue='';wrongChecks=0;opened=false;}
 function fieldTitle(key){return labels[key]||'Model veya sayısal karar';}
 function diagnostic(root){
  if(!lesson)return;
  const ex=lesson.visual,container=mk(root,'div',undefined,'a618-diagram');container.setAttribute('role','img');container.setAttribute('aria-label',lesson.context);
  if(ex?.parts){const count=Math.min(ex.parts,100);const tiles=mk(container,'div',undefined,'a618-tiles');if(count>30)tiles.classList.add('a618-tiles-100');for(let i=0;i<count;i++)mk(tiles,'span','',i<ex.fill?'filled':'');if(ex.fill>ex.parts)mk(container,'small',`Toplam ${ex.fill} parça · her bütün ${ex.parts} parçadan oluşur.`)}
  if(ex?.comparison){mk(container,'strong',ex.comparison.map(([a,b])=>frac(a,b)).join('  ?  '),'a618-emphasis')}
  if(ex?.cards){const bar=mk(container,'div',undefined,'a618-bars');for(const [i,v]of ex.cards.entries()){const item=mk(bar,'div',undefined,'a618-baritem');mk(item,'span',`${['A','B','C'][i]} · %${v}`);const track=mk(item,'div',undefined,'a618-bartrack');const fill=mk(track,'i');fill.style.width=v+'%'}}
  if(ex&&Number.isFinite(ex.max)){const line=mk(container,'div',undefined,'a618-line');for(const [key,letter] of [['line','●'],['lineA','A'],['lineB','B']])if(Number.isFinite(ex[key])){const pin=mk(line,'span',letter,'a618-pin');pin.style.left=(Math.min(100,Math.max(0,ex[key]/ex.max*100)))+'%';pin.title=decimal(ex[key]);}mk(container,'small',`0 ile ${ex.max} arasındaki sayı doğrusu (yaklaşık konum)`) }
 }
 function draw(){
  if(!lesson||!host)return;host.replaceChildren();
  const heading=mk(host,'div',undefined,'a618-head');const head=mk(heading,'div');mk(head,'strong','🧩 Kesir Atölyesi · Başka bir yoldan öğren');mk(head,'small','İsteğe bağlı çalışma · asıl görevin yerine geçmez');
  const toggle=mk(heading,'button',opened?'Çalışmayı kapat':'Yeni modelle dene','a618-toggle');toggle.type='button';toggle.setAttribute('aria-expanded',String(opened));toggle.onclick=()=>{opened=!opened;draw()};
  mk(host,'p',`Son yanlış matematiksel kontrolde gözlenen alan: ${fieldTitle(focusKey)}. Bu, öğrencinin hangi kavramı anlamadığını kesin olarak göstermez.`,'a618-focus');
  if(!opened)return;
  mk(host,'h4',lesson.title);mk(host,'p',lesson.context,'a618-context');diagnostic(host);
  mk(host,'p','1. Adım · '+lesson.prompt,'a618-prompt');
  const options=mk(host,'div',undefined,'a618-options');for(const op of lesson.options){const b=mk(options,'button',op,'a618-choice');b.type='button';b.setAttribute('aria-pressed',String(selected===op));b.onclick=()=>{selected=op;draw()}}
  const lbl=mk(host,'label',undefined,'a618-inputlabel');mk(lbl,'span','2. Adım · '+lesson.numberLabel);const input=mk(lbl,'input');input.type='text';input.inputMode='decimal';input.placeholder='Sayısal sonucu yaz';input.autocomplete='off';input.value=numberValue;input.oninput=()=>numberValue=input.value;
  const actions=mk(host,'div',undefined,'a618-actions');const submit=mk(actions,'button','İki adımı doğrula','a618-primary');submit.type='button';const hint=mk(actions,'button','💡 Küçük ipucu','a618-hint');hint.type='button';const feedback=mk(host,'p','','a618-feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
  hint.onclick=()=>{feedback.textContent=lesson.tip;feedback.dataset.kind='hint'};
  submit.onclick=()=>{wrongChecks++;
   const raw=numberValue.trim().replace(',','.');const val=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(raw)?Number(raw):NaN;
   const ok1=selected===lesson.correct,ok2=raw!==''&&Number.isFinite(val)&&Math.abs(val-lesson.expected)<1e-7;
   if(!ok1||!ok2){feedback.dataset.kind='wrong';feedback.textContent=(!ok1?lesson.wrongTip+' ':'Model seçimin doğru. ')+(!ok2?'Sayısal sonucu yeniden kontrol et. ':'')+(wrongChecks>=2?lesson.tip:'');return}
   const item={taskId:activeId,mode:lesson.mode,focusKey:focusKey||'unknown',when:Date.now(),attempts:wrongChecks,kind:'optional-fraction-practice',mainTaskCompleted:false};
   const entries=[...read().slice(-499),item],payload=JSON.stringify(entries);let saved=false;
   try{localStorage.setItem(KEY,payload);saved=localStorage.getItem(KEY)===payload}catch{}
   feedback.dataset.kind=saved?'success':'warning';feedback.textContent='✅ Mini çalışmanın iki adımı doğru! '+lesson.explain+(saved?' Çalışma kaydedildi.':' ⚠ Çalışma kaydedilemedi.');
  };
  mk(host,'p','Bu çalışmayı tamamlamak ana soruyu veya 1–7–21 günlük tekrarları tamamlamaz. Asıl soruna dönüp onu ayrıca çözmen gerekir.','a618-disclaimer');
 }
 function show(){if(!lesson||lab.hidden||lab.dataset.taskId!==activeId)return;
  if(!host){host=document.createElement('section');host.id='atlas618FractionCoach';host.className='a618-wrap';host.setAttribute('aria-label','Kesirlerde hedefli pekiştirme');lab.insertAdjacentElement('afterend',host)}draw();
 }
 function onTaskRender(e){reset();const id=String(e.detail?.id||'');const task=tasks.get(id);if(!task)return;
  activeId=id;lesson=make(task);const events=progress.getEvents().filter(x=>x.taskId===id&&x.status==='wrong'&&x.evidence==='module-validator');
  if(lesson&&events.length>=2){const idx=events.at(-1)?.wrongFields?.[0];focusKey=Number.isInteger(idx)?task.fraction5PlusLab.fields[idx]?.key||null:null;lesson=make(task,focusKey);show()}
 }
 document.addEventListener('atlas:taskrender',onTaskRender);
 document.addEventListener('atlas:fractionfieldwrong',e=>{
  const id=String(e.detail?.taskId||'');if(id!==activeId||!tasks.has(id))return;
  focusKey=e.detail.fieldKey;lesson=make(tasks.get(id),focusKey);const count=progress.getEvents().filter(x=>x.taskId===id&&x.status==='wrong'&&x.evidence==='module-validator').length;
  if(count>=2)show();
 });
 window.Atlas618FractionCoach={count:tasks.size,buildForTests:(id,focus)=>make(tasks.get(String(id)),focus),supportedModes:[...new Set([...tasks.values()].map(t=>t.fraction5PlusLab.mode))],version:'6.18'};
})();
