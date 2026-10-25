/* Matematik Atlası v1.9: 6. sınıf Geometrik Nicelikler, 30 farklı görev modu */
(()=>{'use strict';
const root=document.getElementById('measure6Lab');if(!root)return;
const SVG='http://www.w3.org/2000/svg', KEY='mathAtlasMeasure6Notes';
let notes={};try{notes=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_e){}
const E=(p,t,s,cls)=>{const e=document.createElement(t);if(cls)e.className=cls;if(s!==null&&s!==undefined)e.textContent=String(s);p.appendChild(e);return e};
const S=(p,t,atts,txt)=>{const e=document.createElementNS(SVG,t);for(const [k,v] of Object.entries(atts||{}))e.setAttribute(k,String(v));if(txt!==undefined)e.textContent=String(txt);p.appendChild(e);return e};
const btn=(p,s,fn,cls='m6-button')=>{const b=E(p,'button',s,cls);b.type='button';b.addEventListener('click',fn);return b};
const fmt=n=>typeof n==='number'?n.toLocaleString('tr-TR',{maximumFractionDigits:4}):String(n);
const col={a:'#5de4da',b:'#f0c675',c:'#96bfff',muted:'#b7d9e8'};
const label=(svg,x,y,s,color=col.muted)=>S(svg,'text',{x,y,fill:color,'font-size':15,'font-weight':'600'},s);
function shape(svg,which,x,y,w,h,fill=col.a){
 const pts=which==='triangle'?`${x},${y+h} ${x+w/2},${y} ${x+w},${y+h}`:which==='parallelogram'?`${x+35},${y} ${x+w+35},${y} ${x+w},${y+h} ${x},${y+h}`:null;
 if(pts)S(svg,'polygon',{points:pts,fill:fill+'33',stroke:fill,'stroke-width':3});else S(svg,'rect',{x,y,width:w,height:h,rx:3,fill:fill+'33',stroke:fill,'stroke-width':3});
}
function circle(svg,cx,cy,r,color=col.a,arcAngle=0){
 S(svg,'circle',{cx,cy,r,fill:'none',stroke:color,'stroke-width':4});
 S(svg,'line',{x1:cx-r,y1:cy,x2:cx+r,y2:cy,stroke:col.muted,'stroke-width':2,'stroke-dasharray':'6 5'});
 S(svg,'circle',{cx,cy,r:4,fill:color});
 if(arcAngle>0){const ang=arcAngle*Math.PI/180,x=cx+r*Math.cos(-Math.PI/2+ang),y=cy+r*Math.sin(-Math.PI/2+ang);
  const wedge=`M ${cx} ${cy} L ${cx} ${cy-r} A ${r} ${r} 0 ${arcAngle>180?1:0} 1 ${x} ${y} Z`;
  S(svg,'path',{d:wedge,fill:'#f0c67540',stroke:col.b,'stroke-width':2});
  label(svg,cx+r+18,cy,`${arcAngle}°`,col.b);
 }
}
function diagram(st){const c=st.task.geometryMeasureLab,m=c.mode;st.visual.replaceChildren();const sv=S(st.visual,'svg',{viewBox:'0 0 650 280',role:'img','aria-label':'Değiştirilebilir geometrik model'});
 const a=c.a,h=Number(st.values.height??c.h),dx=c.d;label(sv,20,25,st.task.mekanik,col.a);
 if(c.visual==='tiles'){
  if(m==='tileMeter'){
   const rows=Number(st.values.rows??0);for(let tile=0;tile<c.n;tile++){for(let y=0;y<10;y++)for(let x=0;x<10;x++)S(sv,'rect',{x:24+tile*121+x*10,y:55+y*10,width:9,height:9,fill:tile*10+y<rows?col.a:'#28465a',stroke:'#47687a','stroke-width':0.5});label(sv,28+tile*121,181,`${tile+1}. m²`)}
   label(sv,24,224,`${c.n} m² = ${c.n*100} dm²`);label(sv,24,255,`Boyanmış onluk sıralar: ${rows}`);
  }else if(m==='scaleSquare'){
   let s=c.s;shape(sv,'rectangle',40,55,80,80,col.a);shape(sv,'rectangle',245,40,Math.min(225,80*s/2),Math.min(210,80*s/2),col.b);label(sv,42,155,`${c.n} birim`);label(sv,240,268,`Kenar ×${s}  →  Alan ×${s*s}`);
  }else{
   shape(sv,'rectangle',50,52,100,100,col.a);label(sv,52,175,'1 kare alan modeli');S(sv,'line',{x1:210,y1:105,x2:304,y2:105,stroke:col.b,'stroke-width':3});label(sv,313,113,'→ alan birimi');
   label(sv,230,65,m==='compareDimensions'?'Uzunluk: ×k':`Kenarlar dönüştürülür`);label(sv,230,177,m==='compareDimensions'?'Alan: ×k²':m==='areaRepair'?'Hatalı: ×10, doğrusu: ×100':'Alan dönüşümüne dikkat');
  }
 }else if(c.visual==='shapes'){
  let sh=c.shape||'rectangle';let visualh=Math.max(65,Math.min(160,15*h));
  if(m==='halfRectangle'){shape(sv,'rectangle',80,70,280,145,col.a);S(sv,'line',{x1:80,y1:215,x2:360,y2:70,stroke:col.b,'stroke-width':4});label(sv,400,114,'2 eş üçgen');}
  else if(sh==='composite'){
   shape(sv,'rectangle',60,110,220,120,col.a);shape(sv,'triangle',280,110,180,120,col.b);label(sv,60,252,'Dikdörtgen');label(sv,295,252,'Üçgen');
  }else{
   if(m==='shearRectangle'){const shift=Number(st.values._shear??35);S(sv,'polygon',{points:`${80+shift},70 ${340+shift},70 340,${70+visualh} 80,${70+visualh}`,fill:col.a+'33',stroke:col.a,'stroke-width':3});}else shape(sv,sh,80,70,260,visualh,col.a);S(sv,'line',{x1:210,y1:70,x2:210,y2:70+visualh,stroke:col.b,'stroke-width':2,'stroke-dasharray':'6 5'});
   label(sv,92,255,`Taban: ${Number(st.values.base??a)}`);label(sv,390,118,`Dik yükseklik: ${fmt(h)}`,col.b);
   if(m==='heightHunt')label(sv,392,155,`Eğik kenar: ${c.slant}`,col.c);
  }
  if(m==='flooringBudget')label(sv,403,193,`1 m²: ${c.price} TL`,col.b);
 }else if(c.visual==='circle'){
  let radius=Math.max(55,Math.min(84,3.5*dx)),angle=c.kind==='6.4.6'?Number(st.values.angle??c.theta):0;
  if(m==='arcChallenge'){
   circle(sv,170,135,62,col.a,c.theta);circle(sv,445,135,93,col.c,c.secondAngle);label(sv,135,257,`A çap ${c.d}`);label(sv,414,257,`B çap ${c.otherD}`);
  }else if(['wheelComparison','wheelsDifference'].includes(m)){
   circle(sv,175,135,60,col.a);circle(sv,440,135,88,col.c);label(sv,133,245,`Çap ${c.d}`);label(sv,410,245,`Çap ${c.otherD}`);
  }else{circle(sv,248,139,radius,col.a,angle);label(sv,388,89,`Çap: ${dx} birim`);label(sv,388,123,`π ≈ 3,14`);
   if(c.kind==='6.4.6')label(sv,388,170,`Yay oranı = ${fmt(angle)}°/360°`,col.b);
   else if(m==='circleRace')label(sv,388,170,`r = ${fmt(st.values.radius??c.d/2)}`,col.b);
   else if(m==='lapsAndDistance')label(sv,388,170,`Tur: ${fmt(st.values.laps??1)}`,col.b);
   else label(sv,388,170,`Çevre ≈ ${fmt(3.14*dx)}`,col.b);
  }
 }
 if(st.values&&Object.keys(st.values).length)label(sv,22,273,`Seçimler: ${Object.keys(st.values).length}/${c.fields.length} alan`,col.muted);
}
function showChoices(st,g,f){const row=E(g,'div',null,'m6-choices');for(const o of f.options){const b=btn(row,fmt(o),()=>{st.values[f.key]=o;row.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));diagram(st);st.status.textContent='Seçimini yaptın; diğer alanları da kontrol et.'});b.dataset.choice=String(o);b.setAttribute('aria-pressed','false')}}
function controls(st){const c=st.task.geometryMeasureLab;st.form.replaceChildren();st.values={};for(const f of c.fields){const g=E(st.form,'fieldset',null,'m6-field');E(g,'legend',f.label);
 if(f.kind==='choice'){showChoices(st,g,f)}
 else if(f.kind==='range'){
  const slider=E(g,'input');slider.type='range';slider.min=String(f.min);slider.max=String(f.max);slider.step=String(f.step||1);slider.value=String(f.min);slider.dataset.key=f.key;
  const out=E(g,'output','Seçilen: '+slider.value);slider.addEventListener('input',()=>{st.values[f.key]=Number(slider.value);out.textContent='Seçilen: '+slider.value;diagram(st)});
 }else{
  const field=E(g,'input');field.type='number';field.inputMode='decimal';field.step='any';field.placeholder='Sayısal değer';field.dataset.key=f.key;
  field.addEventListener('input',()=>{st.values[f.key]=field.value;st.status.textContent='Modeli doğrulayabilirsin.'});
 }}diagram(st)}
function correct(st){for(const f of st.task.geometryMeasureLab.fields){const got=st.values[f.key];if(got===undefined||got===null||String(got).trim()==='')return false;
 if(f.kind==='choice'){if(got!==f.answer)return false}
 else {const v=Number(String(got).replace(',','.'));if(!Number.isFinite(v))return false;let tolerance=st.task.geometryMeasureLab.mode==='sectorRecovery'?.55:1e-5;
  if(Math.abs(v-Number(f.answer))>tolerance)return false}
 }return true}
function render(task,onComplete){root.hidden=!task.geometryMeasureLab;root.replaceChildren();if(!task.geometryMeasureLab)return;
 const st={task,onComplete,values:{},done:false};const c=task.geometryMeasureLab;
 E(root,'div','6. SINIF · GEOMETRİK NİCELİKLER · ETKİLEŞİMLİ ATÖLYE','m6-kicker');E(root,'h3',task.mekanik);E(root,'p',task.gorev,'m6-question');
 st.visual=E(root,'div',null,'m6-visual');st.form=E(root,'div',null,'m6-controls');st.status=E(root,'div','Geometrik modeli oluştur, yanıtları gir ve doğrula.','m6-status');st.status.id='m6Status';st.status.setAttribute('role','status');st.status.setAttribute('aria-live','polite');
 controls(st);
 if(c.mode==='shearRectangle'){const sh=E(root,'label',null,'m6-field');E(sh,'span','Şekli kaydır, alanın korunmasını gözle: ');const slider=E(sh,'input');slider.type='range';slider.min='0';slider.max='75';slider.value='35';slider.addEventListener('input',()=>{st.values._shear=Number(slider.value);diagram(st)});}
 const reasonWrap=E(root,'label',null,'m6-reason');E(reasonWrap,'span','Matematiksel gerekçeni açıkla (isteğe bağlı not)');const note=E(reasonWrap,'textarea');note.rows=3;note.maxLength=1500;note.placeholder='Çizimden hangi ilişkiye ulaştın?';note.value=notes[task.id]||'';
 note.addEventListener('input',()=>{notes[task.id]=note.value;try{localStorage.setItem(KEY,JSON.stringify(notes))}catch(_e){}});
 if(c.requireReason){note.required=false;E(reasonWrap,'small','En az bir cümle gerekçe isteğe bağlıdır; doğruluğunu sistem puanlamaz.','m6-muted')}
 const acts=E(root,'div',null,'m6-actions');btn(acts,'✓ Modeli kontrol et',()=>{
  if(st.done)return;
  
  if(!correct(st)){st.status.textContent='⚠️ Bir veya birkaç model/ölçü yanlış. Şekli ve hesaplamaları gözden geçir.';st.status.dataset.error='true';return}
  st.done=true;st.status.dataset.error='false';st.status.textContent='✅ Model ve sayısal hesap doğru. Gerekçenin anlamını isteğe bağlı nottur.';onComplete();
 }).id='m6Check';btn(acts,'💡 İpucu',()=>{st.status.dataset.error='false';st.status.textContent='💡 '+task.ipucu},'m6-button alt');btn(acts,'↻ Sıfırla',()=>render(task,onComplete),'m6-button alt');
 E(root,'p','Çember hesaplarında π≈3,14 kullanılır. Uzunluk/alan birimleri görev metnine göredir. Yerel ilerleme resmî not kaydı değildir.','m6-muted');
}
window.MatematikAtlasMeasure6={render};
})();
