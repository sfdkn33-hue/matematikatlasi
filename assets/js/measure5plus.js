/* 5th-grade geometric quantities: genuinely manipulable rectangles and independent constraint checks. */
(()=>{'use strict';
const root=document.getElementById('measure5PlusLab');if(!root)return;
const KEY='mathAtlasMeasure5PlusNotes';let notes={};try{notes=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_e){}
const titles={fenceBuild:'Çit Mühendisi',fenceMax:'En Verimli Dikdörtgen',unitTile:'Birim Kare Ressamı',sameArea:'Alan–Çevre Dedektifi',budgetGarden:'Park Tasarımcısı',siteChoice:'Akıllı Arsa Kararı'};
const E=(node,tag,txt,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==null&&txt!==undefined)e.textContent=String(txt);node.appendChild(e);return e;};
let current=null;
const n=(x)=>Number(x);
function variants(area){const out=[];for(let a=1;a*a<=area;a++){if(area%a===0)out.push([a,area/a]);}return out;}
function validate(s){const c=s.c,v=s.values,m=c.mode;
 if(m==='fenceBuild')return Number.isInteger(n(v.w))&&Number.isInteger(n(v.h))&&n(v.w)>0&&n(v.h)>0&&2*(n(v.w)+n(v.h))===c.perimeter&&n(v.w)*n(v.h)===c.area&&n(v.area)===c.area;
 if(m==='fenceMax'){
  const half=c.perimeter/2,opts=[];for(let a=1;a<half;a++){let b=half-a;if(a*b<=c.limitArea)opts.push(a*b)}
  return Number.isInteger(n(v.w))&&Number.isInteger(n(v.h))&&n(v.w)>0&&n(v.h)>0&&2*(n(v.w)+n(v.h))===c.perimeter&&n(v.w)*n(v.h)===Math.max(...opts)&&n(v.area)===n(v.w)*n(v.h);
 }
 if(m==='unitTile'){
  if(s.cells.size!==c.width*c.height)return false;
  const xs=[...s.cells].map(i=>i%c.gridW),ys=[...s.cells].map(i=>Math.floor(i/c.gridW));
  const minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys),w=maxx-minx+1,h=maxy-miny+1;
  return w*h===s.cells.size && w===c.width&&h===c.height&&n(v.area)===w*h&&n(v.perimeter)===2*(w+h);
 }
 if(m==='sameArea'){
  const ps=variants(c.area);const per=ps.map(([a,b])=>2*(a+b));const min=Math.min(...per),max=Math.max(...per);
  const vmin=Number(v.low),vmax=Number(v.high);
  return Number.isInteger(vmin)&&Number.isInteger(vmax)&&vmin!==vmax&&ps[vmin]&&ps[vmax]&&per[vmin]===min&&per[vmax]===max&&n(v.difference)===max-min;
 }
 if(m==='budgetGarden'){
  const w=n(v.w),h=n(v.h);if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w>c.gridMax||h>c.gridMax)return false;
  const area=w*h,perimeter=2*(w+h),cost=perimeter*c.unitFence+area*c.unitFloor;
  // Compare student strategy with all feasible plans (independent optimality check).
  let best=0;for(let a=1;a<=c.gridMax;a++)for(let b=1;b<=c.gridMax;b++){const P=2*(a+b),A=a*b;if(A>=c.minArea&&A<=c.limitArea&&P<=c.fenceLimit&&P*c.unitFence+A*c.unitFloor<=c.budget)best=Math.max(best,A)}
  return area===best&&perimeter<=c.fenceLimit&&cost<=c.budget&&n(v.cost)===cost;
 }
 if(m==='siteChoice'){
  const costs=c.choices.map(([a,b])=>2*(a+b)*c.unitFence+a*b*c.unitFloor);
  const good=costs.map((cost,i)=>({cost,i})).filter(({i})=>c.choices[i][0]*c.choices[i][1]>=c.minArea);
  const cheapest=Math.min(...good.map(x=>x.cost));const choice=Number(v.choice);
  return Number.isInteger(choice)&&good.some(x=>x.i===choice&&x.cost===cheapest)&&n(v.cost)===cheapest;
 }
 return false;
}
function model(s){const c=s.c,m=c.mode,visual=s.visual;visual.replaceChildren();
 if(m==='unitTile'){
  const instructions=E(visual,'p','Karelere dokun: boyadığın hücreler boşluksuz, tek bir dikdörtgen oluşturmalı.','m5-muted');
  const grid=E(visual,'div',null,'m5-grid');grid.style.gridTemplateColumns=`repeat(${c.gridW}, minmax(0,1fr))`;grid.setAttribute('role','group');grid.setAttribute('aria-label','Kareli geometri tahtası');
  for(let y=0;y<c.gridH;y++)for(let x=0;x<c.gridW;x++){
   const id=y*c.gridW+x,b=E(grid,'button','',s.cells.has(id)?'m5-cell active':'m5-cell');b.type='button';b.dataset.cell=String(id);b.setAttribute('aria-label',`${x+1}. sütun ${y+1}. satır`);b.setAttribute('aria-pressed',String(s.cells.has(id)));
   b.onclick=()=>{s.cells.has(id)?s.cells.delete(id):s.cells.add(id);model(s)};
  }
  E(visual,'p',`${s.cells.size} birim kare boyandı`,'m5-muted');return;
 }
 if(m==='sameArea'||m==='siteChoice'){
  const pairs=m==='sameArea'?variants(c.area):c.choices;
  const cards=E(visual,'div',null,'m5-cards');pairs.forEach(([a,b],i)=>{
   const card=E(cards,'div',null,'m5-card');const shape=E(card,'div',null,'m5-preview');drawGrid(shape,a,b);
   E(card,'strong',`${i+1}. kart · ${a} × ${b}`);E(card,'p',`Alan ${a*b} · Çevre ${2*(a+b)}`);
   if(m==='siteChoice')E(card,'p',`Toplam maliyet: ${2*(a+b)*c.unitFence+a*b*c.unitFloor} TL`,'m5-muted');
  });return;
 }
 const w=Number(s.values.w)||2,h=Number(s.values.h)||3;
 const vis=E(visual,'div',null,'m5-rectangle');drawGrid(vis,Math.min(12,w),Math.min(12,h));
 E(visual,'p',`Model: ${w} × ${h} · Alan ${w*h} · Çevre ${2*(w+h)}`,'m5-muted');
}
function drawGrid(where,w,h){let grid=E(where,'div',null,'m5-shape');grid.style.setProperty('--cols',w);for(let i=0;i<w*h;i++)E(grid,'i',null,'m5-tile');}
function addNumber(s,key,title,min=0,max=150){const wrapper=E(s.controls,'label',title,'m5-field');const input=E(wrapper,'input',null,'m5-input');input.type='number';input.inputMode='numeric';input.min=min;input.max=max;input.step=1;input.dataset.key=key;input.placeholder='Sayı yaz';input.addEventListener('input',()=>{if(input.value==='')delete s.values[key];else s.values[key]=Number(input.value);if(key==='w'||key==='h')model(s)});return input;}
function addChoice(s,key,label,choices){const wrap=E(s.controls,'fieldset',null,'m5-field');E(wrap,'legend',label);const row=E(wrap,'div',null,'m5-choices');for(const [i,x] of choices.entries()){
 const b=E(row,'button',x.title||String(x),'m5-option');b.type='button';b.dataset.choiceKey=key;b.dataset.choice=String(x.value??i);b.setAttribute('aria-pressed','false');
 b.onclick=()=>{s.values[key]=Number(x.value??i);row.querySelectorAll('button').forEach(z=>z.setAttribute('aria-pressed',String(z===b)))};
 }}
function setControls(s){const c=s.c,m=c.mode;
 if(['fenceBuild','fenceMax','budgetGarden'].includes(m)){
  addNumber(s,'w','1. dikdörtgen kenarı',1,c.gridMax);addNumber(s,'h','2. dikdörtgen kenarı',1,c.gridMax);
  addNumber(s,m==='budgetGarden'?'cost':'area',m==='budgetGarden'?'Çit + döşeme toplam maliyeti (TL)':'Dikdörtgenin alanı',0,200);
 }
 if(m==='unitTile'){addNumber(s,'area','Boyanan dikdörtgenin alanı (birim kare)',0,50);addNumber(s,'perimeter','Boyanan dikdörtgenin çevresi (birim)',0,60)}
 if(m==='sameArea'){
  const choices=variants(c.area).map(([a,b],i)=>({value:i,title:`${a} × ${b}`}));
  addChoice(s,'low','En az çit gerektiren kenar çifti',choices);addChoice(s,'high','En çok çit gerektiren kenar çifti',choices);
  addNumber(s,'difference','İki çevre arasındaki fark (birim)',0,100);
 }
 if(m==='siteChoice'){
  addChoice(s,'choice','Alan koşulunu sağlayan en ekonomik arsa',c.choices.map((p,i)=>({value:i,title:`${i+1}. arsa · ${p[0]}×${p[1]}`})));
  addNumber(s,'cost','Seçtiğin arsanın toplam maliyeti (TL)',0,1000);
 }
}
function render(task,finish){root.hidden=!task.measure5PlusLab;root.replaceChildren();if(!task.measure5PlusLab){current=null;return;}
 const c=task.measure5PlusLab,s={task,c,finish,values:{},cells:new Set(),reason:notes[task.id]||'',done:false};current=s;
 root.dataset.mode=c.mode;root.dataset.taskId=task.id;
 E(root,'div','5. SINIF · GEOMETRİK NİCELİKLER','m5-kicker');E(root,'h3',titles[c.mode]);E(root,'p',task.gorev,'m5-prompt');
 s.visual=E(root,'div',null,'m5-visual');s.controls=E(root,'div',null,'m5-controls');model(s);setControls(s);
 if(c.requireReason){const label=E(root,'label','Seçtiğin çözümün neden doğru olduğunu açıkla (isteğe bağlı not).','m5-reason');const t=E(label,'textarea',null);t.rows=3;t.value=s.reason;t.placeholder='Alanı, çevreyi veya maliyeti nasıl ilişkilendirdin?';t.oninput=()=>{s.reason=t.value;notes[task.id]=s.reason;try{localStorage.setItem(KEY,JSON.stringify(notes))}catch(_e){}}}
 s.status=E(root,'p','Modelini kur ve kontrol et.','m5-status');s.status.setAttribute('role','status');s.status.setAttribute('aria-live','polite');
 const actions=E(root,'div',null,'m5-actions');const ok=E(actions,'button','✓ Modeli doğrula','m5-primary');ok.type='button';ok.onclick=()=>{
  if(s.done)return;
  if(!validate(s)){s.status.textContent='🔎 Bir koşul sağlanmadı. Kenarları, kareleri veya maliyeti yeniden kontrol et.';s.status.classList.add('m5-error');return;}
  s.done=true;s.status.classList.remove('m5-error');s.status.textContent='✅ Matematiksel koşullar doğrulandı. Oluşturduğun model ekranda kalacak.';s.finish();
 };
 const hint=E(actions,'button','💡 İpucu','m5-secondary');hint.type='button';hint.onclick=()=>s.status.textContent=task.ipucu;
 const retry=E(actions,'button','↻ Yeniden kur','m5-secondary');retry.type='button';retry.onclick=()=>render(task,finish);
 E(root,'p','Sayısal model ve kurallar otomatik değerlendirilir; yazılı gerekçenin doğruluğunu açıklama puanlanmaz. Kayıtlar bu tarayıcıda tutulur.','m5-footnote');
}
window.MatematikAtlasMeasure5Plus={render,validateForTests:validate,getCurrentForTests:()=>current};
})();
