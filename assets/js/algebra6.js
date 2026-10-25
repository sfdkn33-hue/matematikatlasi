/* Matematik Atlası v1.8 · 6. sınıf cebirsel düşünme: 21 oyun mekaniği. */
(()=>{'use strict';
 const root=document.getElementById('algebra6Lab');if(!root)return;
 const SVG='http://www.w3.org/2000/svg', store='mathAtlasAlgebra6Notes';
 let notes={};try{notes=JSON.parse(localStorage.getItem(store)||'{}')||{}}catch(e){}
 let active=null;
 const N=(parent,tag,txt,klass)=>{const e=document.createElement(tag);if(klass)e.className=klass;if(txt!==undefined&&txt!==null)e.textContent=String(txt);parent.appendChild(e);return e};
 const S=(parent,tag,atts,text)=>{const e=document.createElementNS(SVG,tag);for(const [k,v] of Object.entries(atts||{}))e.setAttribute(k,String(v));if(text!==undefined)e.textContent=String(text);parent.appendChild(e);return e};
 function button(parent,label,handler,cls){const x=N(parent,'button',label,cls||'a6-btn');x.type='button';x.addEventListener('click',handler);return x}
 const shownValue=v=>typeof v==='number'?v.toLocaleString('tr-TR'):v;
 function block(parent,head,value,accent=false){const d=N(parent,'div',null,'a6-tile'+(accent?' a6-accent':''));N(d,'span',head);N(d,'strong',shownValue(value));return d}
 function svgBoard(parent){const svg=S(parent,'svg',{viewBox:'0 0 560 230',role:'img','aria-label':'Matematiksel ilişkinin görsel modeli'});return svg}
 function drawGraph(parent,c,state){const svg=svgBoard(parent),mx=Math.max(c.n+2,12),my=c.a*mx+c.b+5;
  S(svg,'line',{x1:46,y1:195,x2:530,y2:195,stroke:'#9cc2d5','stroke-width':3});
  S(svg,'line',{x1:46,y1:195,x2:46,y2:17,stroke:'#9cc2d5','stroke-width':3});
  let pts=[];for(let k=0;k<=mx;k++){const x=46+480*k/mx,y=195-171*(c.a*k+c.b)/my;pts.push(x+','+y)}
  S(svg,'polyline',{points:pts.join(' '),stroke:'#5af5db','stroke-width':3,fill:'none'});
  const x=Number(state.values.x??0),y=Number(state.values.y??0);
  const px=46+480*x/mx,py=195-171*Math.max(0,y)/my;
  S(svg,'circle',{cx:px,cy:py,r:9,fill:'#ffcf7d',stroke:'#222d3d','stroke-width':2});
  S(svg,'text',{x:70,y:28,fill:'#fff','font-size':14},'Adım → Terim grafiği');
  S(svg,'text',{x:Math.min(482,px+14),y:Math.max(30,py-12),fill:'#ffcf7d','font-size':14},`(${x}, ${y})`);
  S(svg,'text',{x:511,y:219,fill:'#d3eaf4','font-size':13},'n');
 }
 function drawPolygon(parent,sides){const svg=svgBoard(parent),count=sides,angle=-Math.PI/2,r=85,cx=280,cy=114;
  const p=Array.from({length:count},(_,i)=>[cx+r*Math.cos(angle+i*2*Math.PI/count),cy+r*Math.sin(angle+i*2*Math.PI/count)]);
  S(svg,'polygon',{points:p.map(x=>x.join(',')).join(' '),fill:'#1a718055',stroke:'#6bead5','stroke-width':4});
  for(let j=2;j<count-1;j++)S(svg,'line',{x1:p[0][0],y1:p[0][1],x2:p[j][0],y2:p[j][1],stroke:'#ffd080','stroke-width':2});
  S(svg,'text',{x:15,y:29,fill:'#e0f1fb','font-size':14},`${sides} kenar · ${sides-2} üçgen`);
 }
 function drawTiles(parent,c){const box=N(parent,'div',null,'a6-blockboard');const n=Math.min(c.n,10);
  for(let group=0;group<n;group++){const row=N(box,'div',null,'a6-blockrow');for(let k=0;k<c.a;k++)N(row,'span',null,'a6-small-square')}
  const remainder=N(box,'div',null,'a6-blockrow a6-fixed');for(let k=0;k<c.b;k++)N(remainder,'span',null,'a6-small-square');
  N(box,'p',`${n} grup × ${c.a} kare + ${c.b} sabit kare = ?`,'a6-muted')
 }
 function drawTable(parent,rows){const table=N(parent,'table',null,'a6-table');for(const [idx,values] of rows.entries()){
  const tr=N(table,'tr');values.forEach(v=>N(tr,idx===0?'th':'td',v))
 }return table}
 function buildScene(state){const c=state.task.algebra6Lab;const visual=state.visual;visual.replaceChildren();
  const m=c.mode,a=c.a,b=c.b,n=c.n;
  if(['costTable','balanceBuilder','tableMissing','spotError','tableFromAlgo'].includes(m)){
   let rows=[['Girdi','Çıktı']];
   if(m==='costTable'||m==='tableFromAlgo'){rows.push(...c.ns.map(x=>[x,'?']))}
   if(m==='balanceBuilder')rows.push(...c.ns.map(x=>[x,a*x+b]));
   if(m==='tableMissing')rows.push(...[1,2,3,n].map(x=>[x,x===n?'?':a*x+b]));
   if(m==='spotError')rows.push(...c.ns.map((x,i)=>[x,c.shown[i]]));
   drawTable(visual,rows);
  }else if(['expressionCards','storyMatch','codeMatch','ruleCards'].includes(m)){
   const strip=N(visual,'div',null,'a6-math');N(strip,'span','GENEL İLİŞKİ');N(strip,'strong',m==='ruleCards'?`${a+b}, ${2*a+b}, ${3*a+b}…`:`${a}n + ${b}`);
  }else if(['machineDial','reverseInput','budgetSim'].includes(m)){
   const flow=N(visual,'div',null,'a6-flow');block(flow,'Girdi',state.values.in??state.values.quantity??'?');N(flow,'span','→');block(flow,`× ${a}`,`+ ${b}`);N(flow,'span','→');block(flow,m==='budgetSim'?'Bütçe': 'Hedef çıktı',c.budget??c.target,true);
   if(m==='budgetSim')N(visual,'p',`Her ek ürün ${a} TL; sabit teslimat ${b} TL.`,'a6-muted');
  }else if(m==='stepTiles')drawTiles(visual,c);
  else if(m==='graphPoint')drawGraph(visual,c,state);
  else if(['polygonInterior','exteriorAngle'].includes(m))drawPolygon(visual,c.sides);
  else if(m==='flowOrder'){
   const row=N(visual,'div',null,'a6-flow');for(const st of state.values.order||[])block(row,'Seçilen adım',st);if(!(state.values.order||[]).length)N(row,'p','Akış sırası aşağıda oluşturulacak.','a6-muted');
  }else if(m==='algorithmTrace'||m==='bugHunt'||m==='ifBranch'||m==='repairAlgo'||m==='tableFromAlgo'){
   const row=N(visual,'div',null,'a6-flow');block(row,'Girdi',n);N(row,'span','→');block(row,'×',a);N(row,'span','→');block(row,'±',b);N(row,'span','→');block(row,'Çıktı','?',true);
   if(m==='bugHunt')N(visual,'p',`Kaydedilen değerler: ${c.shown.join(' → ')}`,'a6-muted');
   if(m==='ifBranch')N(visual,'p',`Koşul: x ≥ ${c.threshold} ise üst yol; değilse alt yol.`,'a6-muted');
  }else{
   const row=N(visual,'div',null,'a6-flow');block(row,'Birim başı',a);N(row,'span','× n +');block(row,'Sabit',b);N(row,'span','=','?');
  }
 }
 function buildControls(st){const c=st.task.algebra6Lab;st.controls.replaceChildren();st.values={};
  for(const f of c.fields){const g=N(st.controls,'fieldset',null,'a6-field');N(g,'legend',f.label);
   if(f.kind==='number'){
    const e=N(g,'input');e.type='number';e.step='any';e.inputMode='decimal';e.placeholder='Sayısal yanıt';e.dataset.key=f.key;
    e.addEventListener('input',()=>{st.values[f.key]=e.value;st.say('Yanıtını kontrol edebilirsin.');if(c.mode==='graphPoint')buildScene(st)})
   }else if(f.kind==='range'){
    const e=N(g,'input');e.type='range';e.min=String(f.min);e.max=String(f.max);e.step=String(f.step||1);e.value=String(f.min);
    const out=N(g,'output',`Seçilen: ${e.value}`);e.dataset.key=f.key;e.addEventListener('input',()=>{st.values[f.key]=Number(e.value);out.textContent=`Seçilen: ${e.value}`;st.say('Seçimini değiştirdin. Kontrol etmeyi unutma.');buildScene(st)})
   }else if(f.kind==='choice'){
    const group=N(g,'div',null,'a6-options');for(const option of f.options){const text=String(option);const btn=button(group,text,()=>{st.values[f.key]=option;group.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));st.say('Seçim yapıldı. İstersen doğrula.')});btn.setAttribute('aria-pressed','false');btn.dataset.choice=text}
   }else if(f.kind==='order'){
    const row=N(g,'div',null,'a6-options');st.values[f.key]=[];
    for(const option of f.options){const btn=button(row,String(option),()=>{if(st.values[f.key].includes(option))return;st.values[f.key].push(option);btn.disabled=true;buildScene(st);st.say(`Seçilen adım: ${st.values[f.key].length}/${f.answer.length}`)});btn.dataset.order=String(option)}
    button(g,'↶ Sıralamayı temizle',()=>{st.values[f.key]=[];buildControls(st);buildScene(st)},'a6-btn a6-secondary');
   }
  }
 }
 function correct(st){for(const f of st.task.algebra6Lab.fields){let value=st.values[f.key];
  if(f.kind==='number'){
   if(value===undefined||String(value).trim()==='')return false;
   const parsed=Number(String(value).replace(',','.'));if(!Number.isFinite(parsed)||Math.abs(parsed-f.answer)>1e-9)return false;
  }else if(f.kind==='order'){
   if(!Array.isArray(value)||value.length!==f.answer.length||value.some((x,i)=>x!==f.answer[i]))return false;
  }else{if(value===undefined||value!==f.answer)return false}
 }return true}
 function render(task,onComplete){const has=Boolean(task.algebra6Lab);root.hidden=!has;root.replaceChildren();if(!has){active=null;return}
  const st={task,values:{},done:false,onComplete};active=st;
  N(root,'div','6. SINIF · CEBİR OYUN LABORATUVARI','a6-kicker');N(root,'h3',task.mekanik);N(root,'p',task.gorev,'a6-question');
  st.visual=N(root,'div',null,'a6-visual');st.controls=N(root,'div',null,'a6-controls');
  buildControls(st);buildScene(st);
  const wrap=N(root,'label',null,'a6-reason');N(wrap,'span','Nasıl düşündün? (Öğretmenin inceleyebilir)');const textarea=N(wrap,'textarea');textarea.rows=2;textarea.maxLength=1500;textarea.placeholder='Kuralı veya gerekçeni bir örnekle açıkla...';textarea.value=notes[task.id]||'';
  textarea.addEventListener('input',()=>{notes[task.id]=textarea.value;try{localStorage.setItem(store,JSON.stringify(notes))}catch(e){}});
  if(task.algebra6Lab.requireReason){textarea.required=false;N(wrap,'small','Bu görevde en az bir cümlelik matematiksel gerekçe yazman gerekir. İçeriğini sistem puanlamayacak.','a6-muted')}
  const status=N(root,'div','Modeli oluştur, ardından doğrula.','a6-status');status.id='a6Status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');st.say=s=>{status.textContent=s};
  const actions=N(root,'div',null,'a6-actions');button(actions,'✓ Modeli doğrula',()=>{
   if(st.done)return;
   
   if(!correct(st)){status.dataset.error='true';st.say('⚠️ Henüz tamamlanmadı: bütün alanları kontrol et, işlemleri ve sıralamayı gözden geçir.');return}
   st.done=true;status.dataset.error='false';st.say('✅ Matematiksel model doğru. Gerekçenin anlamını isteğe bağlı yazabilirsin.');st.onComplete();
  }).id='a6Check';
  button(actions,'💡 İpucu',()=>{status.dataset.error='false';st.say('💡 '+task.ipucu)},'a6-btn a6-secondary');
  button(actions,'↻ Yeniden dene',()=>render(task,onComplete),'a6-btn a6-secondary');
  N(root,'p','Seçimler ve sayısal yanıtlar otomatik kontrol edilir. Yazılı gerekçeler otomatik puanlanmaz. Kayıtlar bu cihazın tarayıcısındadır.','a6-muted');
 }
 window.MatematikAtlasAlgebra6={render};
})();
