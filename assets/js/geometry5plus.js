/* Matematik Atlası v2.3: 5. sınıf geometri genişleme — 15 oyun mekaniği, 60 görev. */
(()=>{'use strict';
const root=document.getElementById('geometry5PlusLab');if(!root)return;
const NS='http://www.w3.org/2000/svg',KEY='mathAtlasGeometry5PlusNotes';
let notes={};try{notes=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_e){}
const H=(p,tag,txt,cls)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined&&txt!==null)x.textContent=String(txt);p.appendChild(x);return x};
const S=(p,tag,attrs={},txt)=>{const x=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))x.setAttribute(k,String(v));if(txt!==undefined)x.textContent=String(txt);p.appendChild(x);return x};
const B=(p,label,fn)=>{const x=H(p,'button',label,'g5x-btn');x.type='button';x.onclick=fn;return x};
const T=(s,x,y,text,color='#d3e8ef')=>S(s,'text',{x,y,fill:color,'font-size':16,'font-weight':600},text);
const L=(s,x1,y1,x2,y2,color='#69e4d0',stroke=3)=>S(s,'line',{x1,y1,x2,y2,stroke:color,'stroke-width':stroke,'stroke-linecap':'round'});
const dot=(s,x,y,color='#ffce75')=>S(s,'circle',{cx:x,cy:y,r:6,fill:color});
const eq=(a,b)=>typeof b==='number'?Number(a)===b:String(a)===String(b);
const TAU=Math.PI*2;
function polygonPoints(n,offset=0,r=89,cx=300,cy=135){return Array.from({length:n},(_,i)=>{const a=-Math.PI/2+i*TAU/n;return [cx+(r+(i===0?offset:0))*Math.cos(a),cy+(r+(i===0?offset:0))*Math.sin(a)]})}
function poly(s,pts,color='#66e5cb'){S(s,'polygon',{points:pts.map(p=>p.join(',')).join(' '),fill:'#154b55',stroke:color,'stroke-width':3});pts.forEach((p,i)=>{dot(s,...p);T(s,p[0]+9,p[1]-8,'ABCDEF'[i])})}
function circle(s,x,y,r,colour='#71d3ff'){S(s,'circle',{cx:x,cy:y,r,fill:'none',stroke:colour,'stroke-width':3});dot(s,x,y,colour)}
function drawCircles(s,st){const c=st.cfg,v=st.values,r1=Number(v.r1??c.r1),r2=Number(v.r2??c.r2),d=Number(v.d??c.d),scale=23,x=180,y=135;
 circle(s,x,y,scale*r1,'#6ce8d9');circle(s,x+d*scale,y,scale*r2,'#f9bf7d');T(s,28,31,`r₁=${r1}    r₂=${r2}    merkezler arası=${d}`);
 if(d>0&&d<=r1+r2&&d>=Math.abs(r1-r2)){
  const along=(r1*r1-r2*r2+d*d)/(2*d),height=Math.sqrt(Math.max(0,r1*r1-along*along));
  const px=x+along*scale,py=y-height*scale;if(height>0.0001){dot(s,px,py,'#ffdf82');L(s,x,y,px,py);L(s,x+d*scale,y,px,py,'#f9bf7d');L(s,x,y,x+d*scale,y,'#afcaef');T(s,px+10,py-9,'P');}
  else dot(s,px,py,'#ffdf82');
  T(s,25,261,height>0.0001?'İki kesişim noktası → gerçek üçgen kurulabilir':'Teğet çemberler → üçgen oluşmaz','#cfeeea');
 }else T(s,25,261,'İki noktada kesişmiyor → üçgen oluşmaz','#ffd79e');
}
function drawGrid(s,st){const c=st.cfg,ox=75,oy=27,sp=30;
 for(let x=0;x<=9;x++){L(s,ox+x*sp,oy,ox+x*sp,oy+7*sp,'#2b5870',1);T(s,ox+x*sp-5,oy+7*sp+19,x,'#a1bfce')}
 for(let y=0;y<=7;y++){L(s,ox,oy+y*sp,ox+9*sp,oy+y*sp,'#2b5870',1);T(s,ox-23,oy+y*sp+5,y,'#a1bfce')}
 for(let x=0;x<=9;x++)for(let y=0;y<=7;y++){
  const p=S(s,'circle',{cx:ox+x*sp,cy:oy+y*sp,r:9,fill:'#91d8f5','fill-opacity':0.10,stroke:'#628ca6','stroke-width':0.7,role:'button',tabindex:0,'data-g5-point':`${x},${y}`,'aria-label':`x ${x}, y ${y} noktasını işaretle`});
  const fn=()=>{if(st.path.length<2){st.path.push([x,y]);st.status.textContent=`${st.path.length}. nokta işaretlendi.`;diagram(st)}};
  p.addEventListener('click',fn);p.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();fn()}});
 }
 st.path.forEach((p,i)=>{const px=ox+p[0]*sp,py=oy+p[1]*sp;dot(s,px,py,'#ffdc83');T(s,px+9,py-12,'AB'[i])});
 if(st.path.length===2)L(s,ox+st.path[0][0]*sp,oy+st.path[0][1]*sp,ox+st.path[1][0]*sp,oy+st.path[1][1]*sp,'#ffdc83',4);
 T(s,405,80,'Noktaya dokun');T(s,405,110,'veya Tab + Enter');
}
function drawVertexRoute(s,st){const pts=polygonPoints(st.cfg.sides,0,80,265,130);
 S(s,'circle',{cx:265,cy:130,r:86,fill:'none',stroke:'#315771','stroke-dasharray':'6 5'});
 st.path.forEach((id,j)=>{if(j){const a=pts[st.path[j-1]],b=pts[id];L(s,a[0],a[1],b[0],b[1],'#ffdc83',4)}});
 pts.forEach((p,i)=>{const el=S(s,'circle',{cx:p[0],cy:p[1],r:14,fill:'#36778a',stroke:'#b4f0df','stroke-width':2,role:'button',tabindex:0,'data-vertex':String(i),'aria-label':`${'ABCDEF'[i]} köşesini çizime ekle`});
  T(s,p[0]+15,p[1]-10,'ABCDEF'[i]);const fn=()=>{if(st.path.length<=pts.length){st.path.push(i);st.status.textContent='Köşeler: '+st.path.map(x=>'ABCDEF'[x]).join('→');diagram(st)}};
  el.addEventListener('click',fn);el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();fn()}})});
 T(s,400,80,'A → B → C → …');T(s,400,115,'→ A ile kapat');
}
function diagram(st){const c=st.cfg,m=c.mode,v=st.values;st.visual.replaceChildren();const s=S(st.visual,'svg',{viewBox:'0 0 610 285',role:'img','aria-label':'Etkileşimli geometrik çizim alanı'});
 if(m==='gridSegment'){drawGrid(s,st);return}if(m==='vertexRoute'){drawVertexRoute(s,st);return}
 if(m.startsWith('circles')){drawCircles(s,st);return}
 if(['polygonGate','regularRepair','polygonProperties'].includes(m)){
  const n=Number(v.sides??c.sides),offset=m==='regularRepair'?Number(v.offset??24):0;
  poly(s,polygonPoints(n,offset));T(s,30,40,`Kenar sayısı: ${n}`);if(offset)T(s,360,240,`Bir köşe ${offset} birim sapmış`,'#ffca88');return;
 }
 if(m==='toolPath'){
  T(s,25,38,'Araç seç → işlevini doğrula');
  const icons=['📏','◎','∠','⊥'];icons.forEach((ic,i)=>{const x=45+i*137;S(s,'rect',{x,y:72,width:112,height:120,rx:12,fill:v.tool===['cetvel','pergel','açıölçer','gönye'][i]?'#2d7d77':'#183747',stroke:'#5c8998'});T(s,x+39,133,ic,'#e7faec');T(s,x+10,172,['cetvel','pergel','açıölçer','gönye'][i])});return;
 }
 if(m==='lineExtent'){
  T(s,30,48,'Uç noktalar ve sonsuza uzama');L(s,130,145,480,145);
  if(c.target==='doğru'||c.target==='ışın'){S(s,'path',{d:'M 480 145 l -18 -9 v 18 z',fill:'#69e4d0'});if(c.target==='doğru')S(s,'path',{d:'M 130 145 l 18 -9 v 18 z',fill:'#69e4d0'})}
  if(c.target!=='doğru')dot(s,130,145,'#ffdf8b');if(c.target==='doğru parçası')dot(s,480,145,'#ffdf8b');return;
 }
 if(m==='perpendicularFoot'){
  const ox=75,unit=43,pX=c.pointX,current=Number(v.foot??1);T(s,30,43,`P noktasının x koordinatı: ${pX}`);L(s,ox,217,ox+10*unit,217,'#b7dcf1',3);dot(s,ox+pX*unit,70);T(s,ox+pX*unit+9,65,'P');L(s,ox+pX*unit,70,ox+pX*unit,217,'#476477',2);
  L(s,ox+current*unit,70,ox+current*unit,217,'#f9ca7d',4);dot(s,ox+current*unit,217,'#f9ca7d');return;
 }
 if(['angleTurn','angleReadRepair','oppositeAngles','angleTable'].includes(m)){
  const x=275,y=190;let a=Number(v.theta??(m==='angleTurn'?15:c.target||c.sectors?.[0]||45));T(s,22,35,'Açı ilişkilerini çizimde incele');
  L(s,x,y,x+180,y,'#78eddb',4);
  const θ=a*Math.PI/180;L(s,x,y,x+150*Math.cos(θ),y-150*Math.sin(θ),'#ffc378',4);dot(s,x,y);
  if(m==='angleTurn'||m==='angleReadRepair'){S(s,'path',{d:`M ${x+58} ${y} A 58 58 0 ${a>180?1:0} 0 ${x+58*Math.cos(θ)} ${y-58*Math.sin(θ)}`,fill:'none',stroke:'#eaca83','stroke-width':3});T(s,32,262,m==='angleReadRepair'?`Bir koldaki başlangıç 0°; iki ölçeği karıştırma.`:`Açı kolu: ${a}°`)}
  else if(m==='oppositeAngles'){L(s,x,y,x-180,y,'#78eddb',3);L(s,x,y,x-150*Math.cos(θ),y+150*Math.sin(θ),'#ffc378',3);T(s,32,262,'Ters açılar eş · komşular bütünler')}
  else{const [x1,y1,z1]=c.sectors;const aa=x1*Math.PI/180,bb=(x1+y1)*Math.PI/180;L(s,x,y,x+150*Math.cos(aa),y-150*Math.sin(aa),'#9abafd');L(s,x,y,x+145*Math.cos(bb),y-145*Math.sin(bb),'#fbcf93');[aa,bb].forEach(a1=>L(s,x,y,x-150*Math.cos(a1),y+150*Math.sin(a1),'#4d8e9f',2));T(s,25,263,`${x1}° + ${y1}° + ? = 180°`)}return;
 }
 T(s,30,140,'Model üzerinde değişiklik yap ve seçenekleri doğrula.');
}
function fieldControl(st,f){const group=H(st.form,'fieldset',null,'g5x-field');H(group,'legend',f.label);
 if(f.kind==='choice'){
  const row=H(group,'div',null,'g5x-options');const opts=[...new Set(f.options)];if(opts.length>1){const off=st.cfg.seed%opts.length;opts.push(...opts.splice(0,off))}
  opts.forEach(o=>{const b=B(row,String(o),()=>{st.values[f.key]=o;row.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));diagram(st)});b.dataset.answer=String(o);b.setAttribute('aria-pressed','false')});
 }else if(f.kind==='range'){
  const slider=H(group,'input');slider.type='range';slider.min=f.min;slider.max=f.max;slider.step=f.step||1;slider.value=f.answer===null?f.min:Math.max(f.min,Number(f.answer)===f.min?f.max:f.min);slider.dataset.field=f.key;slider.setAttribute('aria-label',f.label);
  const out=H(group,'output',slider.value);slider.addEventListener('input',()=>{st.values[f.key]=Number(slider.value);st.touched.add(f.key);out.textContent=slider.value;diagram(st)});
 }
}
function validate(st){const c=st.cfg;
 if(c.mode==='gridSegment'&&JSON.stringify(st.path)!==JSON.stringify([c.A,c.B]))return false;
 if(c.mode==='vertexRoute'){
  const expected=[...Array(c.sides).keys(),0];if(JSON.stringify(st.path)!==JSON.stringify(expected))return false;
 }
 for(const f of c.fields){if(!(f.key in st.values))return false;if(f.answer!==null&&!eq(st.values[f.key],f.answer))return false}
 if(c.mode==='circlesInverse'){
  if(!c.fields.every(f=>st.touched.has(f.key)))return false;
  const {r1,r2,d}=st.values;if(!(Math.abs(r1-r2)<d&&d<r1+r2))return false;
  const kind=(r1===r2&&r2===d)?'eşkenar':new Set([r1,r2,d]).size===2?'ikizkenar':'çeşitkenar';if(c.variant==='farklı_yaricapli_ikizkenar'&&!(r1!==r2&&(d===r1||d===r2)))return false;return kind===c.requiredType;
 }
 return true;
}
function render(task,finish){root.hidden=!task.geometry5PlusLab;root.replaceChildren();if(!task.geometry5PlusLab)return;
 const c=task.geometry5PlusLab,st={task,cfg:c,finish,values:{},touched:new Set(),path:[],done:false};
 root.dataset.mode=c.mode;root.dataset.taskId=task.id;
 H(root,'div','5. SINIF · GEOMETRİK ŞEKİLLER · YENİ OYUN','g5x-kicker');H(root,'h3',task.mekanik);H(root,'p',task.gorev,'g5x-hint');
 st.visual=H(root,'div',null,'g5x-visual');st.form=H(root,'div',null,'g5x-fields');st.status=H(root,'p','Önce şekil üzerinde çalış; sonra matematiksel kararlarını kontrol et.','g5x-status');st.status.id='g5xStatus';st.status.setAttribute('role','status');st.status.setAttribute('aria-live','polite');
 c.fields.forEach(f=>fieldControl(st,f));diagram(st);
 if(c.mode==='gridSegment'||c.mode==='vertexRoute')B(root,'↻ Noktaları yeniden yerleştir',()=>{st.path=[];diagram(st)});
 const lab=H(root,'label',null,'g5x-reason');H(lab,'span','Bu şekil sana hangi özelliği gösterdi? (isteğe bağlı not)');const note=H(lab,'textarea');note.rows=2;note.maxLength=1500;note.placeholder='İlişkiyi kendi cümlenle açıkla...';note.value=notes[task.id]||'';
 note.addEventListener('input',()=>{notes[task.id]=note.value;try{localStorage.setItem(KEY,JSON.stringify(notes))}catch(_e){}});
 if(c.requireReason){note.required=false;H(lab,'small','Bu görevde en az bir cümle gerekçe yazmalısın. İçeriği sistem puanlamaz.','g5x-hint')}
 const act=H(root,'div',null,'g5x-actions');B(act,'✓ Modelimi doğrula',()=>{
  if(st.done)return;
  
  if(!validate(st)){window.Atlas616Trace?.wrong(task,'5. sınıf geometri modelleri');st.status.textContent='🔎 Model ve seçimler henüz birlikte doğru değil; şekle yeniden bak.';st.status.dataset.error='true';return}
  st.done=true;st.status.textContent='✅ Çizim ve matematiksel ilişki doğrulandı. Gerekçe isteğe bağlı not.';st.status.dataset.error='false';finish();
 });B(act,'💡 İpucu',()=>{st.status.textContent=task.ipucu});
 H(root,'p','Otomatik kontrol çizimi ve sayı ilişkilerini denetler; açıklamaların matematiksel niteliğini sistem puanlamaz.','g5x-hint');
}
window.MatematikAtlasGeometry5Plus={render};
})();
