/* v6.21: 7th grade ratio/percent, optional two-step targeted practice.
   Observed wrong *field* is a teaching cue, not a cognitive diagnosis. */
(()=>{'use strict';
 const db=window.ATLAS_DB,api=window.MatematikAtlas64;
 if(!db||!api)return;
 const bank=new Map(db.tasks.filter(t=>t.atlas7Ratio).map(t=>[String(t.id),t]));
 if(!bank.size)return;
 const KEY='mathAtlas621RatioPractice';
 const $=id=>document.getElementById(id),root=$('atlas7Ratio');
 let current=null,ui=null,focus='unknown',hasOpened=false,selected=null,wrongMini=0,completed=false;
 const create=(tag,parent,text,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined&&text!==null)e.textContent=String(text);parent?.appendChild(e);return e};
 const good=x=>Number.isFinite(Number(x))&&String(x).trim()!=='';
 const readEvents=id=>api.getEvents().filter(e=>e.taskId===id&&e.status==='wrong'&&e.evidence==='module-validator'&&e.when>=Date.now()-30*86400000&&e.when<=Date.now()+300000);
 function practice(t,observed){const kind=t?.atlas7Ratio?.kind;if(!kind)return null;
  const n=Number(String(t.id).match(/G(\d+)/)?.[1]||0)%5,ratio=2+n%3, a=ratio*3,b=3;
  const items={
   compare:{title:'Fark mı, kaç kat mı?',story:`İki miktar ${a} ve ${b}.`,answerLabel:t.atlas7Ratio.ask==='fark'?'İki miktarın farkı kaç?':'Büyük miktar küçüğün kaç katı?',options:t.atlas7Ratio.ask==='fark'?['Büyük sayıdan küçüğü çıkar','Büyük sayıyı küçüğe böl','İki sayıyı topla']:['Büyük sayıyı küçüğe böl','Büyük sayıdan küçüğü çıkar','İki sayıyı topla'],expected:t.atlas7Ratio.ask==='fark'?a-b:ratio,correct:0,tip:t.atlas7Ratio.ask==='fark'?'Fark sorusu çıkarma ile bulunur.':'Kaç kat sorusu bölme işlemiyle bulunur.'},
   equivalent:{title:'Denk oran için birlikte genişlet',story:`${ratio}:${b} oranında bir tarif var. İlk miktar iki katına çıkarılıyor.`,answerLabel:'İkinci miktar kaç olmalı?',options:['İki miktarı aynı sayı ile çarp','Yalnızca ilk miktarı çarp','İki miktara bir ekle'],expected:b*2,correct:0,tip:'Oranın iki tarafı da aynı çarpanla değişmeli.'},
   unit:{title:'Birim oranı hesapla',story:`${ratio*4} kalem ${4} eşit kutuya dağıtıldı.`,answerLabel:'Her kutuda kaç kalem vardır?',options:['Toplamı kutu sayısına böl','Toplamı kutu sayısıyla çarp','Kutuyu toplamdan çıkar'],expected:ratio,correct:0,tip:'Tek kutu için toplam miktarı kutu sayısına böleriz.'},
   table:{title:'Tabloda birim karşılığını bul',story:'Tabloda x=2 iken y=6, x=4 iken y=12.',answerLabel:'Bir x için kaç y vardır?',options:['y/x oranını bul','x ve y sayılarını topla','Her satırın farkını y/x say'],expected:3,correct:0,tip:'Her ikilide y değerini x değerine böl.'},
   graph:{title:'Grafikte birim değişimi oku',story:'Grafikte (2,6) ve (4,12) noktaları verilmiş.',answerLabel:'Bir x artışında y kaç artar?',options:['İki nokta arasındaki y değişimini x değişimine böl','Y değerlerini birbiriyle topla','İlk x değerini son y değerinden çıkar'],expected:3,correct:0,tip:'(12−6)/(4−2) işlemini kullan.'},
   double:{title:'Çift sayı doğrusunda eş çarpanı gör',story:'3 paket için 9 birim ürün var. Paket sayısı 5 olursa?',answerLabel:'Kaç birim ürün olur?',options:['Önce bir paketin değerini bul, sonra 5 ile çarp','Paket sayılarını topla','9 ile 5’i çarp'],expected:15,correct:0,tip:'9÷3=3, sonra 3×5.'},
   percent:{title:'Yüzdeyi bütün üzerinden hesapla',story:`Bir kutuda ${100+n*20} bilye var. %20’si kırmızı.`,answerLabel:'Kırmızı bilye sayısı kaç?',options:['Bütünü 20 ile çarpıp 100’e böl','Bütünü 20’ye böl','Bütüne 20 ekle'],expected:(100+n*20)/5,correct:0,tip:'Yüzde, yüz eş parçadan kaçının alındığıdır.'},
   recipe:{title:'Karışımda sabit oranı koru',story:'2 ölçek öz için 5 ölçek su kullanılıyor. Öz 6 ölçek olursa?',answerLabel:'Kaç ölçek su gerekir?',options:['Her iki miktarı 3 ile çarp','Sadece öz miktarını artır','Özle suyu topla'],expected:15,correct:0,tip:'Öz miktarı 3 katına çıktıysa su da 3 katına çıkar.'}
  };
  const lesson=items[kind];if(!lesson)return null;
  return {...lesson,focus:observed,kind,id:t.id};
 }
 function reset(){if(ui){ui.remove();ui=null}current=null;focus='unknown';hasOpened=false;selected=null;wrongMini=0;completed=false}
 function show(){if(!current)return;const t=practice(current,focus);if(!t)return;
  if(!ui){ui=create('section',root,null,'a621-tutor');ui.id='atlas621RatioTutor';ui.setAttribute('aria-label','Oran pekiştirme mini çalışması');}
  ui.replaceChildren();create('strong',ui,'🧩 Başka bir yoldan öğren · '+t.title,'a621-tutor-title');
  create('p',ui,focus==='hesap'?'Son kontrolde sonuç/karar alanında farklı bir değer gözlendi. Yeni bir örnekle hesabı kur.':focus==='karar'?'Son kontrolde matematiksel gerekçe seçimi doğru değildi. Yeni bir örnekte kuralı ve sonucu birlikte incele.':'Yeni bir örnek üzerinden ilişkiyi inceleyelim.','a621-tutor-sub');
  if(!hasOpened){const btn=create('button',ui,'→ Kısa çalışmayı aç');btn.type='button';btn.onclick=()=>{hasOpened=true;show()};return}
  create('p',ui,t.story,'a621-tutor-story');create('p',ui,'Önce doğru işlem planını seç:','a621-tutor-step');
  const choices=create('div',ui,null,'a621-tutor-choices');t.options.forEach((o,i)=>{const b=create('button',choices,o);b.type='button';b.setAttribute('aria-pressed',String(selected===i));b.onclick=()=>{selected=i;show()}});
  const line=create('label',ui,t.answerLabel,'a621-tutor-label'),input=create('input',line);input.type='number';input.step='any';input.inputMode='decimal';input.placeholder='Sonucu yaz';input.id='a621RatioAnswer';
  const btn=create('button',ui,completed?'✓ Kısa çalışma tamamlandı':'✓ Kısa çalışmayı kontrol et');btn.type='button';btn.disabled=completed;
  const msg=create('p',ui,'','a621-tutor-status');msg.setAttribute('role','status');
  btn.onclick=()=>{if(selected===null||!good(input.value)){msg.textContent='Önce işlem planını ve sayısal sonucunu gir.';return}
   const correct=selected===t.correct&&Math.abs(Number(input.value)-t.expected)<1e-8;
   if(!correct){wrongMini++;msg.textContent=(selected!==t.correct?'Seçtiğin işlem planını yeniden incele. ':'Sayı hesabını yeniden kontrol et. ')+(wrongMini>=2?'İpucu: '+t.tip:'');return}
   let saved=false;try{const old=JSON.parse(localStorage.getItem(KEY)||'[]');const arr=Array.isArray(old)?old:[];
    const next=[...arr.slice(-249),{taskId:t.id,kind:t.kind,focus:t.focus,when:Date.now(),mainTaskCompleted:false,kindOfEvidence:'optional-mini-practice'}];
    localStorage.setItem(KEY,JSON.stringify(next));saved=localStorage.getItem(KEY)===JSON.stringify(next)}catch{}
   completed=true;btn.disabled=true;btn.textContent='✓ Kısa çalışma tamamlandı';msg.textContent='✓ Yeni örnekte işlem ve sonuç doğru. '+t.tip+(saved?' Çalışma kaydedildi.':' ⚠ Yardımcı çalışma kaydedilemedi.');
  };
  create('small',ui,'Bu çalışma ana görevin başarı durumunu değiştirmez. Öğrencinin kesin kavram yanılgısını teşhis etmez.','a621-tutor-foot');
 }
 document.addEventListener('atlas:taskrender',e=>{reset();current=bank.get(String(e.detail?.id||''))||null;if(current){const w=readEvents(current.id);if(w.length>=2){focus=w[w.length-1].focus||'unknown';show()}}});
 document.addEventListener('atlas:attemptlogged',e=>{if(e.detail?.status!=='wrong'||!current||e.detail.taskId!==current.id)return;
  const w=readEvents(current.id);if(w.length>=2){focus=w[w.length-1].focus||'unknown';show()}
 });
 window.Atlas621RatioCoach={count:bank.size,practiceFor:(id,focus)=>practice(bank.get(String(id)),focus||'hesap')};
})();
