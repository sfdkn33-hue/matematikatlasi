/* Matematik Atlası v6.10 · 48 ana görevin yeni modeli · otomatik doğrulama */
(()=>{'use strict';
 const root=document.getElementById('atlas610Lab'),db=window.ATLAS_DB;
 if(!root||!db)return;
 const bank=new Map(db.tasks.filter(t=>t.atlas610Workbench).map(t=>[t.id,t]));
 let active=null,count=0,scaled=null,choice='',extra='',cards=[],paint=new Set(),number='',errors=0,hint=false,touched=false;
 const el=(tag,parent,txt,cls)=>{let x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=String(txt);parent?.append(x);return x};
 const svgEl=(tag,parent,attrs={},txt)=>{const x=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>x.setAttribute(k,String(v)));if(txt!==undefined)x.textContent=String(txt);parent.append(x);return x};
 function stored(){try{const v=JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}');return v&&typeof v==='object'?v:{}}catch{return {}}}
 const parseNum=s=>{const x=String(s??'').trim().replace(/\s/g,'').replace(',','.');return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(x)?Number(x):NaN};
 const p=()=>active.atlas610Workbench.params;
 function picture(){
  const scene=root.querySelector('.a610-scene');if(!scene)return;scene.replaceChildren();const m=active.atlas610Workbench,v=p(),context=v.context;
  const svg=svgEl('svg',scene,{viewBox:'0 0 360 205',role:'img','aria-label':'Canlı matematik modeli'});
  const tx=(x,y,s,size=17,fill='#164b63')=>svgEl('text',svg,{x,y,'font-size':size,fill,'font-weight':'700'},s);
  if(['cost','reverse','compare'].includes(context)){
   const n=m.mode==='slider'?(scaled??0):count;
   tx(18,27,context==='compare'?'İki farklı maliyet modeli':'Paket sayacı');
   for(let i=0;i<Math.min(n,7);i++){
    const x=18+i*46;svgEl('rect',svg,{x,y:54,width:38,height:44,rx:7,fill:'#ccebf7',stroke:'#2a729b','stroke-width':2});tx(x+9,80,'▣',18);
   }
   if(context==='compare'){
    tx(18,136,`A = ${v.af} + ${n} × ${v.a} = ${v.af+n*v.a} TL`,17);
    tx(18,167,`B = ${v.bf} + ${n} × ${v.b} = ${v.bf+n*v.b} TL`,17);
   }else{
    tx(18,139,`Sabit ücret: ${v.fixed} TL`,16);
    tx(18,170,`Birim: ${v.unit} TL · ${n} paket`,16);
   }
  }else if(['pattern','missing','formula'].includes(context)){
   const step=context==='pattern'?count:(v.target??5);
   tx(18,26,context==='missing'?'Boş terimi bul':context==='formula'?'Kuralı kartlarla kur':'Karelerden örüntü');
   if(context==='missing'){
    for(let k=1;k<=4;k++){
     const x=14+(k-1)*88;svgEl('rect',svg,{x,y:62,width:76,height:64,rx:10,fill:k===v.missing?'#fff0dc':'#e8f5fc',stroke:'#5f9db9','stroke-width':2});
     tx(x+13,82,`${k}.`,13);tx(x+19,109,k===v.missing?'?':v.seq[k-1],19);
    }
   }else{
    for(let k=0;k<v.base;k++){const x=18+k*25;svgEl('rect',svg,{x,y:119,width:19,height:19,rx:3,fill:'#b2dfe9',stroke:'#4686a4'});}
    for(let k=1;k<=Math.min(step,7);k++){
     const x=14+(k-1)*48;svgEl('rect',svg,{x,y:66,width:39,height:39,rx:6,fill:'#e0f1fa',stroke:'#3c91b9'});tx(x+12,91,k,17);
    }
    tx(18,155,`Her adımda +${v.rate} · Başlangıç +${v.base}`,16);
   }
  }else if(['area','tiles','area-choice'].includes(context)){
   tx(18,26,'Uzunluk ölçeği ≠ alan ölçeği');
   const side=context==='area'?(scaled??1):10;
   const cols=10,cell=12.2,x0=18,y0=50;
   for(let r=0;r<10;r++)for(let c=0;c<10;c++)svgEl('rect',svg,{x:x0+c*cell,y:y0+r*cell,width:cell-1,height:cell-1,fill:context==='tiles'?'#d8ebf7':(r<(side===1?1:10)&&c<(side===1?1:10)?'#7bc7de':'#ecf7fa'),stroke:'#93b8c9','stroke-width':.5});
   tx(174,85,context==='area'?`Kenar ×${side}`:'1 dm² = 100 cm²',16);
   tx(174,117,context==='area'?`Alan ×${side*side}`:'10 × 10 kare',16);
   tx(174,149,context==='tiles'?`${paint.size} kare seçildi`:'Kareli alan modeli',15);
  }else if(['circle-roll','pi-ratio','circle-scale'].includes(context)){
   const original=v.diameter,diameter=context==='circle-scale'?(scaled??original):original;
   tx(18,27,'Çember · çap ve çevre');
   svgEl('circle',svg,{cx:111,cy:111,r:63,fill:'#e1f5fa',stroke:'#18759c','stroke-width':3});
   svgEl('line',svg,{x1:48,x2:174,y1:111,y2:111,stroke:'#dc812c','stroke-width':4});
   svgEl('circle',svg,{cx:111,cy:111,r:4,fill:'#155b77'});
   tx(70,105,`d=${diameter}`,15,'#94501b');
   tx(194,81,'Çevre ≈ 3,14 × d',15);
   tx(194,121,context==='circle-roll'?`Tur: ${scaled??0}`:`Çap: ${diameter} cm`,16);
   tx(194,152,'Bir tam tur: 360°',14);
  }
 }
 function modelIsCorrect(){const m=active.atlas610Workbench;
  if(m.mode==='stepper')return touched&&count===m.modelExpected;
  if(m.mode==='slider')return touched&&scaled===m.modelExpected;
  if(m.mode==='choice')return choice===m.modelExpected;
  if(m.mode==='order')return cards.length===m.modelExpected.length&&cards.every((v,i)=>v===m.modelExpected[i]);
  if(m.mode==='tiles'){
   const v=p();const expected=new Set();for(let r=0;r<v.width;r++)for(let c=0;c<v.height;c++)expected.add(r*5+c);
   return paint.size===expected.size&&[...expected].every(x=>paint.has(x));
  }return false;
 }
 function draw(){root.replaceChildren();if(!active){root.hidden=true;return}root.hidden=false;
  const t=active,m=t.atlas610Workbench,v=p();el('p',root,`${t.ogrenme_ciktisi} · 6. sınıf · ANA ETKİNLİK`,'a610-kicker');el('h3',root,t.baslik);el('p',root,t.gorev,'a610-question');el('div',root,undefined,'a610-scene');picture();
  const field=el('fieldset',root,undefined,'a610-model');el('legend',field,({'stepper':'Adedi modelle','slider':'Modeli sürgüyle ayarla','choice':'Doğru matematiksel modeli seç','order':'İfadeyi sırala','tiles':'Karelere dokunarak modeli oluştur'})[m.mode]);
  if(m.mode==='stepper'){
   const line=el('div',field,undefined,'a610-stepper');const minus=el('button',line,'−','a610-alt');minus.type='button';minus.disabled=count===0;minus.dataset.a610Minus='1';minus.onclick=()=>{count=Math.max(0,count-1);touched=true;draw()};el('output',line,count+(v.context==='pattern'?' adım':' paket'),'a610-count');const plus=el('button',line,'+','a610-alt');plus.type='button';plus.dataset.a610Plus='1';plus.onclick=()=>{count=Math.min(12,count+1);touched=true;draw()};
  }else if(m.mode==='slider'){
   const wrap=el('label',field,undefined,'a610-sl-wrap');const val=el('span',wrap,'Seçili: '+(scaled??v.min));const input=el('input',wrap);input.type='range';input.min=v.min;input.max=v.max;input.step=v.step||1;input.value=scaled??v.min;input.dataset.a610Slider='1';input.oninput=()=>{scaled=Number(input.value);touched=true;val.textContent='Seçili: '+scaled;picture()};
  }else if(m.mode==='choice'){
   const row=el('div',field,undefined,'a610-choices');m.options.forEach(opt=>{const b=el('button',row,opt,'a610-alt');b.type='button';b.dataset.a610Choice=opt;b.setAttribute('aria-pressed',String(choice===opt));if(choice===opt)b.classList.add('selected');b.onclick=()=>{choice=opt;draw()}});
  }else if(m.mode==='order'){
   const row=el('div',field,undefined,'a610-choices');const used=el('div',field,undefined,'a610-assembled');el('span',used,cards.length?cards.join('  '):'Kartları sırasıyla seç.');m.options.forEach(opt=>{const b=el('button',row,opt,'a610-alt');b.type='button';b.dataset.a610Card=opt;b.disabled=cards.includes(opt);b.onclick=()=>{cards.push(opt);draw()}});const undo=el('button',field,'↶ Son kartı geri al','a610-alt');undo.type='button';undo.dataset.a610Undo='1';undo.disabled=!cards.length;undo.onclick=()=>{cards.pop();draw()};
  }else if(m.mode==='tiles'){
   const grid=el('div',field,undefined,'a610-tilegrid');for(let k=0;k<25;k++){
    const b=el('button',grid,paint.has(k)?'✓':'','a610-tile');b.type='button';b.dataset.a610Tile=k;b.setAttribute('aria-label',`${Math.floor(k/5)+1}. satır ${k%5+1}. sütun`);b.setAttribute('aria-pressed',String(paint.has(k)));if(paint.has(k))b.classList.add('on');b.onclick=()=>{paint.has(k)?paint.delete(k):paint.add(k);draw()};
   }
  }
  if(m.extraChoiceExpected){const field2=el('fieldset',root,undefined,'a610-model');el('legend',field2,'Hangi teklif daha ucuz?');const r=el('div',field2,undefined,'a610-choices');m.options.forEach(opt=>{const b=el('button',r,opt,'a610-alt');b.type='button';b.dataset.a610Extra=opt;b.setAttribute('aria-pressed',String(extra===opt));if(extra===opt)b.classList.add('selected');b.onclick=()=>{extra=opt;draw()}})}
  const label=el('label',root,undefined,'a610-label');el('span',label,m.number.label);const input=el('input',label);input.type='text';input.inputMode='decimal';input.placeholder='Sonucu yaz';input.value=number;input.dataset.a610Number='1';input.oninput=()=>number=input.value;
  const acts=el('div',root,undefined,'a610-actions'),verify=el('button',acts,'✓ Modeli ve hesabı kontrol et'),hintBtn=el('button',acts,'💡 İpucu','a610-alt');verify.type='button';verify.dataset.a610Check='1';hintBtn.type='button';
  const status=el('p',root,stored()[t.id]?'Bu görevi önceden tamamladın; istersen tekrar çözebilirsin.':'Önce modeli kur, sonra sayısal hesabı tamamla.','a610-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');const details=el('p',root,'','a610-explain');details.hidden=true;
  hintBtn.onclick=()=>{hint=true;window.MatematikAtlas64?.log({taskId:t.id,status:'hint',family:m.family});details.hidden=false;details.textContent='İpucu: '+t.ipucu};
  verify.onclick=()=>{
   if(active!==t)return;
   const modelOk=modelIsCorrect()&&(!m.extraChoiceExpected||extra===m.extraChoiceExpected);const n=parseNum(number);const numberOk=number.trim()!==''&&Number.isFinite(n)&&Math.abs(n-m.number.expected)<0.001;
   if(!modelOk||!numberOk){errors++;window.MatematikAtlas64?.log({taskId:t.id,status:'wrong',family:m.family,focus:!modelOk?'model':'hesap'});status.textContent='Henüz doğru değil. '+(!modelOk?'Önce modelin doğruluğunu kontrol et.':'Sayısal hesabını yeniden dene.');status.classList.add('error');if(errors>=2){hint=true;details.hidden=false;details.textContent='İpucu: '+t.ipucu;}return}
   const firstTry=errors===0&&!hint&&!window.MatematikAtlas64?.hasAttemptsToday(t.id);
   window.__atlas610Verified=t.id;
   const ans=document.getElementById('answer'),submit=document.getElementById('check');ans.value='1';submit.click();window.__atlas610Verified=null;
   const live=root.querySelector('.a610-status'),exp=root.querySelector('.a610-explain');
   if(stored()[t.id]){
    const ok=window.MatematikAtlas64?.log({taskId:t.id,status:'correct',family:m.family,firstTry,hintUsed:hint,wrongCount:errors});
    if(live){live.textContent=ok===false?'⚠ İşlem doğru, fakat tekrar geçmişi kaydedilemedi. Yedek al.':'✓ Model ve matematiksel hesap doğrulandı.';live.classList.toggle('error',ok===false)}
    if(exp){exp.hidden=false;exp.textContent='Çözüm: '+m.explanation}
   }else if(live){live.textContent='⚠ Matematik doğru ancak ilerleme kaydedilemedi. Yedek al.';live.classList.add('error')}
  };
 }
 document.addEventListener('atlas:taskrender',ev=>{window.__atlas610Verified=null;active=bank.get(String(ev.detail?.id))||null;count=0;scaled=null;choice='';extra='';cards=[];paint=new Set();number='';errors=0;hint=false;touched=false;draw()});
 window.MatematikAtlas610={reworked:bank.size};
})();
