/* Matematik Atlası v6.11: dört kazanımın 48 ana etkinliği; cevaplar otomatik doğrulanır. */
(()=>{'use strict';
 const root=document.getElementById('atlas611Lab'),db=window.ATLAS_DB;
 if(!root||!db)return;
 const bank=new Map(db.tasks.filter(t=>t.atlas611Workbench).map(t=>[t.id,t]));
 let current=null,modelValue=null,selected='',classification='',paint=new Set(),numbers='',attempts=0,hint=false,touched=false;
 const E=(tag,parent,txt,cls)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=String(txt);parent?.appendChild(x);return x};
 const SVG='http://www.w3.org/2000/svg';
 const S=(tag,parent,attributes={},txt)=>{const x=document.createElementNS(SVG,tag);for(const [k,v] of Object.entries(attributes))x.setAttribute(k,String(v));if(txt!==undefined)x.textContent=String(txt);parent.appendChild(x);return x};
 const spec=()=>current.atlas611Workbench;
 const P=()=>spec().params;
 function completed(){try{return JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')||{}}catch{return {}}}
 function safeN(s){const x=String(s??'').trim().replace(/\s/g,'').replace(',','.');return /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(x)?Number(x):NaN}
 function controlButton(parent,text,marker,value,callback){const b=E('button',parent,text,'a611-btn');b.type='button';b.dataset[marker]=String(value);b.onclick=callback;return b}
 function scene(){const wrap=E('div',root,undefined,'a611-scene');const mode=spec().mode,v=P();const svg=S('svg',wrap,{viewBox:'0 0 360 205',role:'img','aria-label':'Matematiksel şekil ve veri modeli'});
  const label=(x,y,msg,size=16,fill='#194562')=>S('text',svg,{x,y,'font-size':size,fill,'font-weight':'700'},msg);
  if(mode==='circle'){
   const r1=v.r1,r2=v.r2,d=Number(modelValue??v.min);
   const scale=Math.min(150/(r1+r2+d+2),135/(Math.max(r1,r2)+2));
   const cx=55+r1*scale,cy=112,tx=cx+d*scale;
   const c1=S('circle',svg,{cx,cy,r:r1*scale,fill:'#d6ebfa','fill-opacity':'.65',stroke:'#126a90','stroke-width':3});
   S('circle',svg,{cx:tx,cy,r:r2*scale,fill:'#fbdfca','fill-opacity':'.5',stroke:'#bd6431','stroke-width':3});
   S('line',svg,{x1:cx,y1:cy,x2:tx,y2:cy,stroke:'#264a61','stroke-width':2,'stroke-dasharray':'5 4'});
   const x=(d*d+r1*r1-r2*r2)/(2*d),h2=r1*r1-x*x;
   if(h2>1e-8){const y=Math.sqrt(h2);for(const sy of [-1,1])S('circle',svg,{cx:cx+x*scale,cy:cy+sy*y*scale,r:5,fill:'#e57926',stroke:'#fff','stroke-width':1.5});}
   else if(Math.abs(h2)<1e-8&&d>0)S('circle',svg,{cx:cx+x*scale,cy,r:5,fill:'#e57926'});
   for(const [x0,s] of [[cx,'A'],[tx,'B']]){S('circle',svg,{cx:x0,cy,r:3.5,fill:'#183850'});label(x0-5,cy+19,s,13)}
   label(12,23,`r₁ = ${r1}  ·  r₂ = ${r2}  ·  AB = ${d}`,15);
   label(10,197,v.aspect==='contact'?'Ortak noktaları incele':'C, çemberlerin ortak noktasıdır',13);
  }else if(mode==='balls'||mode==='claim'){
   const n=v.red+(mode==='balls'?Number(modelValue||0):0),counts=[n,v.blue,v.yellow],labels=['Kırmızı','Mavi','Sarı'],colors=['#c83c3c','#327fce','#dca12c'];
   label(12,22,'Torbadan rastgele bir bilye çekiliyor',15);
   counts.forEach((count,i)=>{const x=14+i*119;label(x,47,`${labels[i]}: ${count}`,14);for(let k=0;k<count;k++)S('circle',svg,{cx:x+12+(k%5)*18,cy:70+Math.floor(k/5)*21,r:7,fill:colors[i],stroke:'#fff','stroke-width':1});});
   label(12,183,'Eş olasılık için uygun bilye sayıları eşit olmalı.',13);
  }else if(['sectorangle','sectorparts','sectorinverse','wheel'].includes(mode)){
   const r=mode==='wheel'?v.total:(v.radius||1),n=mode==='wheel'?v.total:mode==='sectorparts'?v.total:12;
   const picked=mode==='wheel'?paint.size:mode==='sectorparts'?paint.size:0;
   const degree=mode==='sectorangle'?Number(modelValue??0):mode==='sectorinverse'?0:(picked*360/n);
   S('circle',svg,{cx:112,cy:111,r:72,fill:'#edf7fc',stroke:'#206e93','stroke-width':2});
   if(mode==='sectorangle'||mode==='sectorparts'||mode==='wheel'){
    if(mode==='sectorangle'&&degree>=360){S('circle',svg,{cx:112,cy:111,r:71,fill:'#78bbd9'})}
    else if(mode==='sectorangle'&&degree>0){const a=(degree-90)*Math.PI/180;const xx=112+72*Math.cos(a),yy=111+72*Math.sin(a);S('path',svg,{d:`M112 111 L112 39 A72 72 0 ${degree>180?1:0} 1 ${xx} ${yy} Z`,fill:'#78bbd9',stroke:'#1b6c91','stroke-width':1.4});}
    else if(['sectorparts','wheel'].includes(mode)){for(let k=0;k<n;k++){const a1=-Math.PI/2+2*Math.PI*k/n,a2=-Math.PI/2+2*Math.PI*(k+1)/n;const p1=[112+72*Math.cos(a1),111+72*Math.sin(a1)],p2=[112+72*Math.cos(a2),111+72*Math.sin(a2)];S('path',svg,{d:`M112 111 L${p1[0]} ${p1[1]} A72 72 0 0 1 ${p2[0]} ${p2[1]} Z`,fill:paint.has(k)?'#ee9b47':'#dfeff7',stroke:'#6494ab','stroke-width':1.2})}}
   }
   S('circle',svg,{cx:112,cy:111,r:3,fill:'#194562'});
   label(206,66,mode==='wheel'?`${v.total} eş dilim`:`Yarıçap: ${v.radius}`,16);
   label(206,99,mode==='sectorangle'?`Seçilen açı: ${degree}°`:mode==='sectorinverse'?'Alanı oranla':`Boyalı: ${picked}`,15);
   label(206,142,'Alan / tam daire',14);label(206,162,'= açı / 360°',14);
  }else if(['rootfactor','rootchoice','rootreverse'].includes(mode)){
   label(14,35,mode==='rootreverse'?`${v.a}√${v.b}   =   √(? × ${v.b})`:`√${v.n}`,28);
   S('rect',svg,{x:14,y:57,width:330,height:102,rx:14,fill:'#e7f4fb',stroke:'#9cc7d9'});
   label(29,90,'Kök içinde tam kare çarpan ara.',17);
   label(29,124,'Bir sayının kökten çıkma koşulu:',15);
   label(29,149,'√(a² × b) = a√b',16);
  }
 }
 function resetControls(){modelValue=null;selected='';classification='';paint=new Set();numbers='';attempts=0;hint=false;touched=false}
 function modelCorrect(){const m=spec(),v=P();if(m.mode==='circle')return touched&&Number(modelValue)===m.modelExpected&&classification===m.classExpected;
  if(m.mode==='balls')return touched&&Number(modelValue)===m.modelExpected;
  if(m.mode==='wheel'||m.mode==='sectorparts')return touched&&paint.size===m.modelExpected;
  if(m.mode==='claim'||m.mode==='sectorinverse'||m.mode==='rootfactor'||m.mode==='rootchoice'||m.mode==='rootreverse')return selected===String(m.modelExpected);
  if(m.mode==='sectorangle')return touched&&Number(modelValue)===m.modelExpected;
  return false;
 }
 function draw(){root.replaceChildren();if(!current){root.hidden=true;return}root.hidden=false;const t=current,m=spec(),v=P(),mode=m.mode;
  E('p',root,`${t.ogrenme_ciktisi} · ${t.sinif}. SINIF · ANA ETKİNLİK`,'a611-kicker');E('h3',root,t.baslik);E('p',root,t.gorev,'a611-question');scene();
  const field=E('fieldset',root,undefined,'a611-field');const names={circle:'Çemberlerin merkez uzaklığını ayarla',balls:'Eksik bilyeleri ekle',wheel:'Dilimlere dokunarak çarkı boyamaya başla',claim:'İddiayı değerlendir',sectorangle:'Merkez açıyı ayarla',sectorparts:'Dilimleri boyayarak alan oluştur',sectorinverse:'Alan oranını seç',rootfactor:'Kökten çıkabilen en büyük tam kareyi seç',rootchoice:'Doğru eşitliği bul',rootreverse:'Kök içine giren tam kareyi seç'};E('legend',field,names[mode]);
  if(['circle','sectorangle'].includes(mode)){
   const lab=E('label',field,undefined,'a611-range');E('span',lab,'Seçilen değer: '+(modelValue??v.min??0)+(mode==='sectorangle'?'°':''));const range=E('input',lab);range.type='range';range.min=v.min??0;range.max=v.max??360;range.step=mode==='sectorangle'?15:1;range.value=modelValue??v.min??0;range.dataset.a611Slider='1';range.oninput=()=>{modelValue=Number(range.value);touched=true;draw()};
  }else if(mode==='balls'){
   const row=E('div',field,undefined,'a611-row');controlButton(row,'− Bilye çıkar','a611Minus',1,()=>{modelValue=Math.max(0,(Number(modelValue)||0)-1);touched=true;draw()});E('output',row,`${Number(modelValue)||0} kırmızı eklendi`,'a611-output');controlButton(row,'+ Kırmızı ekle','a611Plus',1,()=>{modelValue=Math.min(20,(Number(modelValue)||0)+1);touched=true;draw()});
  }else if(mode==='wheel'||mode==='sectorparts'){
   const total=v.total,grid=E('div',field,undefined,'a611-grid');for(let i=0;i<total;i++){const b=controlButton(grid,`${i+1}. dilim`,'a611Slice',i,()=>{paint.has(i)?paint.delete(i):paint.add(i);touched=true;draw()});b.setAttribute('aria-pressed',String(paint.has(i)));if(paint.has(i))b.classList.add('active')}
  }else{
   const grid=E('div',field,undefined,'a611-choices');const opts=mode==='claim'?m.options:m.options||[];opts.forEach(opt=>{const b=controlButton(grid,opt,'a611Choice',opt,()=>{selected=String(opt);draw()});b.setAttribute('aria-pressed',String(selected===String(opt)));if(selected===String(opt))b.classList.add('active')});
  }
  if(m.classExpected){const cls=E('fieldset',root,undefined,'a611-field');E('legend',cls,mode==='circle'?'Oluşan şekli sınıflandır':'Sınıfını seç');const row=E('div',cls,undefined,'a611-choices');(m.options||[]).forEach(opt=>{const b=controlButton(row,opt,'a611Class',opt,()=>{classification=opt;draw()});b.setAttribute('aria-pressed',String(classification===opt));if(classification===opt)b.classList.add('active')})}
  const field2=E('label',root,undefined,'a611-number');E('span',field2,m.answers.main.label);const input=E('input',field2);input.type='text';input.inputMode='decimal';input.autocomplete='off';input.placeholder='Matematiksel sonucu yaz';input.value=numbers;input.dataset.a611Number='1';input.oninput=()=>numbers=input.value;
  const buttons=E('div',root,undefined,'a611-actions');const check=controlButton(buttons,'✓ Modeli ve sonucu kontrol et','a611Check',1,()=>validate());check.classList.add('primary');controlButton(buttons,'💡 İpucu','a611Hint',1,()=>{hint=true;window.MatematikAtlas64?.log({taskId:t.id,status:'hint',family:m.family});const feedback=root.querySelector('.a611-status');feedback.textContent='İpucu: '+t.ipucu});
  const status=E('p',root,completed()[t.id]?'Daha önce tamamladın. Yeni modeli de yeniden çözebilirsin.':'Önce modeli kur, sonra sonucu yaz.','a611-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const detail=E('p',root,'','a611-explain');detail.hidden=true;
 }
 function validate(){const t=current,m=spec();if(!t)return;const status=root.querySelector('.a611-status');const detail=root.querySelector('.a611-explain');const n=safeN(numbers);const ok=modelCorrect()&&numbers.trim()!==''&&Number.isFinite(n)&&Math.abs(n-m.answers.main.expected)<1e-8;
  if(!ok){attempts++;window.MatematikAtlas64?.log({taskId:t.id,status:'wrong',family:m.family,focus:!modelCorrect()?'model':'hesap'});status.classList.add('wrong');status.textContent=!modelCorrect()?'Model henüz doğru değil. Seçimleri/şekli gözden geçir.':'Sayısal kanıtı yeniden hesapla.';if(attempts>=2){detail.hidden=false;detail.textContent='İpucu: '+t.ipucu}return}
  const firstTry=attempts===0&&!hint&&!window.MatematikAtlas64?.hasAttemptsToday(t.id);
  window.__atlas611Verified=t.id;
  const ans=document.getElementById('answer'),btn=document.getElementById('check');ans.value='1';btn.click();window.__atlas611Verified=null;
  // app.js redraws the task on successful save. Reacquire live elements after the redraw.
  const live=root.querySelector('.a611-status'),liveDetail=root.querySelector('.a611-explain');
  if(completed()[t.id]){
   const tracked=window.MatematikAtlas64?.log({taskId:t.id,status:'correct',family:m.family,firstTry,hintUsed:hint,wrongCount:attempts});
   if(live){live.classList.toggle('wrong',tracked===false);live.textContent=tracked===false?'⚠ Çözüm doğru fakat deneme geçmişi kaydedilemedi. Lütfen yedek al.':'✓ Şekil ve hesap doğrulandı; ilerlemen kaydedildi.';}
   if(liveDetail){liveDetail.hidden=false;liveDetail.textContent='Çözüm: '+m.explanation;}
  }else if(live){live.classList.add('wrong');live.textContent='⚠ Matematik doğru ancak ilerleme kalıcı olarak kaydedilemedi. Lütfen yedek al.';}
 }
 document.addEventListener('atlas:taskrender',event=>{window.__atlas611Verified=null;current=bank.get(String(event.detail?.id))||null;resetControls();draw()});
 window.MatematikAtlas611={reworked:bank.size};
})();
