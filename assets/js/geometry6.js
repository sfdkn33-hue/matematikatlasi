/* Matematik Atlası v1.7 · 6. sınıf Geometrik Şekiller · SVG ile etkileşimli model */
(()=>{'use strict';
const root=document.getElementById('geometry6Lab');let active=null;let drafts={};try{drafts=JSON.parse(localStorage.getItem('mathAtlasGeometry6Notes')||'{}')||{}}catch(e){}
const SVG='http://www.w3.org/2000/svg';
function node(p,tag,text,cls){const x=document.createElement(tag);if(cls)x.className=cls;if(text!=null)x.textContent=String(text);p.appendChild(x);return x}
function button(p,label,fn){const b=node(p,'button',label,'g6-button');b.type='button';b.onclick=fn;return b}
function svgEl(p,tag,attrs={},text){const x=document.createElementNS(SVG,tag);for(const [k,v] of Object.entries(attrs))x.setAttribute(k,String(v));if(text!=null)x.textContent=text;p.appendChild(x);return x}
function line(p,a,b,clr='#75dcf6',w=4){return svgEl(p,'line',{x1:a[0],y1:a[1],x2:b[0],y2:b[1],stroke:clr,'stroke-width':w,'stroke-linecap':'round'})}
function label(p,x,y,s,clr='#e9f5ff'){return svgEl(p,'text',{x,y,fill:clr,'font-size':15,'font-weight':700,'text-anchor':'middle'},String(s))}
function circle(p,x,y,r=5,color='#ffd17d'){return svgEl(p,'circle',{cx:x,cy:y,r,fill:color})}
function scene(){const area=node(root,'div',null,'g6-scene');const svg=svgEl(area,'svg',{viewBox:'0 0 600 330',role:'img','aria-label':'Ölçekli matematiksel geometri modeli; şekil ve açı etiketleri için altındaki açıklamayı inceleyin.'});const caption=node(area,'p',null,'g6-caption');return {svg,caption}}
function clear(x){x.replaceChildren()}
function range(p,key,txt,value,min=0,max=180,step=5){const l=node(p,'label',null,'g6-field');node(l,'span',txt+': ');const val=node(l,'output',String(value));const x=node(l,'input');x.type='range';x.min=min;x.max=max;x.step=step;x.value=value;x.dataset.key=key; x.addEventListener('input',()=>{x.dataset.touched='true';val.textContent=x.value;x.dispatchEvent(new CustomEvent('g6change',{bubbles:true}))});return x}
function numeric(p,key,txt){const l=node(p,'label',null,'g6-field');node(l,'span',txt);const x=node(l,'input');x.type='number';x.inputMode='numeric';x.dataset.key=key;x.placeholder='Sonucu yaz';return x}
function selection(p,key,txt,choices){const f=node(p,'fieldset',null,'g6-fieldset');node(f,'legend',txt);const wrap=node(f,'div',null,'g6-choices');let value=null;for(const s of choices){const b=button(wrap,s,()=>{value=s;for(const ch of wrap.children)ch.setAttribute('aria-pressed',String(ch===b))});b.setAttribute('aria-pressed','false');b.dataset.value=s;b.dataset.key=key}return ()=>value}
function graphGrid(s){for(let x=50;x<600;x+=50)line(s,[x,0],[x,330],'#24435a',1);for(let y=40;y<330;y+=50)line(s,[0,y],[600,y],'#24435a',1)}
function shapeVerts(type){const dict={yamuk:[[145,85],[350,85],[475,260],[95,260]],paralelkenar:[[160,85],[380,85],[455,260],[235,260]],dikdörtgen:[[170,85],[415,85],[415,260],[170,260]],'eşkenar dörtgen':[[300,45],[445,167],[300,290],[155,167]],kare:[[200,65],[405,65],[405,270],[200,270]]};return dict[type]}
function drawShape(s,type,vals){clear(s);graphGrid(s);let v=vals||shapeVerts(type);svgEl(s,'polygon',{points:v.map(a=>a.join(',')).join(' '),fill:'#226a7c55',stroke:'#71e5d3','stroke-width':4,'stroke-linejoin':'round'});v.forEach((a,i)=>{circle(s,...a);label(s,a[0]+(i===0?-13:12),a[1]+(i<2?-11:19),'ABCD'[i])});return v}
function drawDiagonals(s,d1,d2,ang,offset=0){clear(s);graphGrid(s);const O=[300,168];const r1=d1*12,r2=d2*12;const rad=ang*Math.PI/180;const V=[Math.cos(rad)*r2,Math.sin(rad)*r2];const A=[O[0]-r1,O[1]],C=[O[0]+r1,O[1]],B=[O[0]+V[0]+offset*8,O[1]-V[1]],D=[O[0]-V[0]+offset*8,O[1]+V[1]];svgEl(s,'polygon',{points:[A,B,C,D].map(p=>p.join(',')).join(' '),fill:'#2b7c8655',stroke:'#6bf4e2','stroke-width':3});line(s,A,C,'#ffc775',3);line(s,B,D,'#ffc775',3);for(const [i,p] of [A,B,C,D].entries()){circle(s,...p,5);label(s,p[0]+(i%2?12:-10),p[1]+(i<2?-12:22),'ABCD'[i])}circle(s,...O,6,'#fff');label(s,O[0]+16,O[1]-12,'O');return [A,B,C,D]}
function drawParallel(s,alpha,beta,points){clear(s);graphGrid(s);const y1=100,y2=235,x1=370;const dx=(y2-y1)/Math.tan(alpha*Math.PI/180),x2=x1-dx;
 line(s,[55,y1],[555,y1]);line(s,[55,y2],[555,y2]);
 // Kesenin eğimi verilen üst açı ile tutarlıdır; alt değer öğrencinin tahminidir.
 const up=[x1+dx*1.1,y1-(y2-y1)*1.1],down=[x2-dx*.65,y2+(y2-y1)*.65];line(s,up,down,'#f4cf87',4);
 function mark(x,y,prefix){circle(s,x,y,5,'#ffffff');label(s,x+42,y-17,prefix+'1');label(s,x-42,y-17,prefix+'2');label(s,x-42,y+34,prefix+'3');label(s,x+42,y+34,prefix+'4')}
 mark(x1,y1,'A');mark(x2,y2,'B');label(s,505,79,'d₁');label(s,505,215,'d₂');
 label(s,125,47,`A₁=${alpha}°`,'#ffcf85');label(s,168,314,`B₁ tahmin=${beta}°`,'#9de7ef');
 if(points)for(const p of points){const upper=p[0]==='A',sector=Number(p[1]),x=upper?x1:x2,y=upper?y1:y2;svgEl(s,'circle',{cx:x+(sector===1||sector===4?42:-42),cy:y+(sector<=2?-22:28),r:20,fill:'#ffca5a33',stroke:'#f7d376','stroke-width':2})}
}

function render(task,onComplete){if(!root)return;root.hidden=!Boolean(task.geometry6Lab);root.replaceChildren();if(!task.geometry6Lab){active=null;return}
 const c=task.geometry6Lab,state={task,done:false};active=state;
 node(root,'div','6. SINIF · GEOMETRİK ŞEKİLLER · ÇİZ / ÖLÇ / KANITLA','g6-kicker');node(root,'h3',task.mekanik);node(root,'p',task.gorev,'g6-intro');
 const {svg:s,caption:cap}=scene(),controls=node(root,'div',null,'g6-controls'),actions=node(root,'div',null,'g6-actions');
 let correct=()=>false;let refresh=()=>{};let focusKey=()=> 'model';
 if(['correspond','alternate','outer','parallelTest'].includes(c.mode)){
  const r=range(controls,'target','Alt kesişimdeki açıyı ayarla',c.initial,20,160,5);
  const pick=selection(controls,'relation','Bu iki açı hangi ilişkidedir?',['Yöndeş','İç ters','Dış ters','Bütünler']);
  refresh=()=>drawParallel(s,c.alpha,Number(r.value),c.points);
  correct=()=>Number(r.value)===c.alpha&&pick()===c.relation;
  focusKey=()=>Number(r.value)!==c.alpha?'angle':'relation';
  cap.textContent='A1/A3 ve B1/B3, paralel doğruların bir kesenle oluşturduğu açılardır. Eş açıları ölçerek karşılaştır.';
 }else if(c.mode==='shapeBuild'){
  const a=range(controls,'top','Üst kenar (birim)',160,80,240,20),b=range(controls,'bottom','Alt kenar (birim)',200,80,240,20),o=range(controls,'offset','Alt kenarın yatay kayması',40,0,80,20);
  const wanted=c.shape;
  function kind(){const A=Number(a.value),B=Number(b.value),O=Number(o.value);return A!==B?'yamuk':O===0?(A===160?'kare':'dikdörtgen'):'paralelkenar'}
  refresh=()=>{const A=Number(a.value),B=Number(b.value),O=Number(o.value);const X=300;const top=[[X-A/2,75],[X+A/2,75]],bottom=[[X+O+B/2,235],[X+O-B/2,235]];drawShape(s,'yamuk',[top[0],top[1],bottom[0],bottom[1]])};
  correct=()=>[a,b,o].some(x=>x.dataset.touched==='true')&&kind()===wanted;
  cap.textContent=`Hedef şekil: ${wanted}. Bu atölyede “yamuk” yalnız bir çift paralel karşılıklı kenarı olan model anlamındadır. Kare ve dikdörtgen yüksekliği 160 birimlik sabit modelde karşılaştırılır.`;
 }else if(c.mode==='shapeClass'||c.mode==='propertyCheck'){
  const props={'yamuk':'Yalnız bir çift paralel kenar','paralelkenar':'İki çift paralel karşılıklı kenar','dikdörtgen':'Dört dik açı ve eş köşegenler','eşkenar dörtgen':'Dört eş kenar ve dik köşegenler','kare':'Dört eş kenar, dört dik açı'};
  const choose=selection(controls,'shape',c.mode==='shapeClass'?'En özel şekil adı:':'Şekli en belirgin biçimde tanımlayan özellik:',c.mode==='shapeClass'?['yamuk','paralelkenar','eşkenar dörtgen','dikdörtgen','kare']:Object.values(props));
  refresh=()=>drawShape(s,c.shape);correct=()=>choose()===(c.mode==='shapeClass'?c.shape:props[c.shape]);
  cap.textContent='Şeklin bir özelliği daha geniş bir dörtgen ailesinde de bulunabilir. En ayırt edici adı veya özelliği seç.';
 }else if(c.mode==='angleTotal'||c.mode==='quadrilateralAngle'){
  const f=numeric(controls,'angle','Eksik iç açı (derece):');
  refresh=()=>{drawShape(s,'yamuk');c.known.forEach((v,i)=>label(s,[145,350,475][i],[117,117,290][i],v+'°','#ffd17d'));label(s,114,288,'x°','#ffd17d')};
  correct=()=>Number(f.value)===360-c.known.reduce((a,b)=>a+b,0);cap.textContent='Şekil şematiktir. Dörtgenin iç açıları toplamını hesaplayıp x açısını bul.';
 }else if(['diagonalBuild','diagonalName','diagonalFacts'].includes(c.mode)){
  const target=c.shape,known={'paralelkenar':[12,8,60],'dikdörtgen':[10,10,60],'eşkenar dörtgen':[12,8,90],'kare':[10,10,90]};
  if(c.mode==='diagonalBuild'){
   const a=range(controls,'first','AC köşegeni için yarı uzunluk',8,6,12,2),b=range(controls,'second','BD köşegeni için yarı uzunluk',10,6,12,2),d=range(controls,'angle','Köşegenler arası açı',75,60,120,15);
   refresh=()=>drawDiagonals(s,+a.value,+b.value,+d.value);
   correct=()=>{if(![a,b,d].some(x=>x.dataset.touched==='true'))return false;const equal=+a.value===+b.value,perp=+d.value===90;return target==='kare'?equal&&perp:target==='dikdörtgen'?equal&&!perp:target==='eşkenar dörtgen'?!equal&&perp:!equal&&!perp};
   focusKey=()=>{const expectedEqual=['kare','dikdörtgen'].includes(target);return (+a.value===+b.value)!==expectedEqual?'lengths':'perpendicular'};
  }else{
   const choose=selection(controls,'diag',c.mode==='diagonalName'?'Köşegenlerin oluşturduğu en özel şekil:':'Köşegenlere ait belirleyici özellik:',c.mode==='diagonalName'?['paralelkenar','dikdörtgen','eşkenar dörtgen','kare']:['Eşit uzunluk, dik değil','Dik kesişim, eşit değil','Hem eşit hem dik','Ne eşit ne dik']);
   const dict={'paralelkenar':'Ne eşit ne dik','dikdörtgen':'Eşit uzunluk, dik değil','eşkenar dörtgen':'Dik kesişim, eşit değil','kare':'Hem eşit hem dik'};
   refresh=()=>drawDiagonals(s,...known[target]);correct=()=>choose()===(c.mode==='diagonalName'?target:dict[target]);
  }
  cap.textContent='Çapraz çizgiler köşegenlerdir; kesiştikleri O noktası her köşegeni iki eş parçaya ayırır. Bu özellik tek başına paralelkenar için yeterlidir.';
 }else if(c.mode==='midpointFix'){
  const offset=range(controls,'offset','Orta nokta kayması',c.offset,0,6,1);
  refresh=()=>drawDiagonals(s,10,8,60,+offset.value);correct=()=>+offset.value===0;
  cap.textContent='Sarı köşegenlerin kesiştiği O noktası, doğru parçalarının ortak orta noktası olmalıdır.';
 }else if(c.mode==='triangleAngle'||c.mode==='triangleExterior'){
  const x=numeric(controls,'answer','Bilinmeyen açı (derece):');
  refresh=()=>{clear(s);graphGrid(s);svgEl(s,'polygon',{points:'130,265 465,265 305,60',fill:'#205e7766',stroke:'#80e8dd','stroke-width':4});label(s,147,250,c.known[0]+'°');label(s,443,250,c.mode==='triangleAngle'?c.known[1]+'°':(180-c.known[0]-c.known[1])+'°');label(s,308,92,c.mode==='triangleAngle'?'x°':c.known[1]+'°');if(c.mode==='triangleExterior'){line(s,[465,265],[560,265],'#ffc978');label(s,510,244,'Dış açı x°')}};
  correct=()=>Number(x.value)===(c.mode==='triangleAngle'?180-c.known[0]-c.known[1]:c.known[0]+c.known[1]);
  cap.textContent='Şekil şematiktir: iç açı toplamı 180°; dış açı ise komşu olmayan iki iç açının toplamıdır.';
 }else if(c.mode==='parallelAngle'||c.mode==='rhombusHalf'){
  const value=range(controls,'answer','Bilinmeyen açıyı ayarla',45,10,170,5);
  refresh=()=>{if(c.mode==='parallelAngle')drawShape(s,'paralelkenar');else {drawShape(s,'eşkenar dörtgen');line(s,[300,45],[300,290],'#ffca78',3)}label(s,310,170,`${c.alpha}° → ${value.value}°`,'#ffdb87')};
  correct=()=>Number(value.value)===c.missing;
  cap.textContent=c.mode==='parallelAngle'?'Paralelkenarda komşu açılar bütünlerdir, yani toplamları 180° olur.':'Eşkenar dörtgenin köşegenleri köşe açılarını iki eş açıya böler.';
 }else {node(root,'p','Bu görev türü henüz hazır değil.');return}
 // A check is mathematical evidence only after the relevant visible controls are used.
 function hasModelEvidence(){
  const fields=[...controls.querySelectorAll('fieldset')];
  if(fields.some(f=>!f.querySelector('button[aria-pressed="true"]')))return false;
  if([...controls.querySelectorAll('input[type="number"]')].some(x=>!x.value.trim()))return false;
  const ranges=[...controls.querySelectorAll('input[type="range"]')];
  if(!fields.length&&!controls.querySelector('input[type="number"]')&&ranges.length&&!ranges.some(x=>x.dataset.touched==='true'))return false;
  return fields.length>0||ranges.some(x=>x.dataset.touched==='true')||!!controls.querySelector('input[type="number"]');
 }
 function observedField(){
  if(['triangleAngle','triangleExterior','angleTotal','quadrilateralAngle'].includes(c.mode))return 'angle';
  if(c.mode==='parallelAngle')return 'supplementary';
  if(c.mode==='rhombusHalf')return 'bisector';
  if(c.mode==='midpointFix')return 'midpoint';
  if(['shapeClass','propertyCheck'].includes(c.mode))return 'classification';
  if(['diagonalName','diagonalFacts'].includes(c.mode))return 'diagonalProperties';
  if(c.mode==='shapeBuild')return 'shape';
  return focusKey();
 }
 root.addEventListener('g6change',refresh);refresh();
 const noteLabel=node(root,'label',null,'g6-field g6-note');node(noteLabel,'span','Matematiksel gerekçen (isteğe bağlı):');const reason=node(noteLabel,'textarea');reason.rows=2;reason.value=drafts[task.id]||'';reason.placeholder='Neden böyle düşündüğünü açıkla...';reason.addEventListener('input',()=>{drafts[task.id]=reason.value.slice(0,1500);try{localStorage.setItem('mathAtlasGeometry6Notes',JSON.stringify(drafts))}catch(e){}});
 const status=node(root,'div','Modeli kur, ardından kontrol et.','g6-status');status.id='g6Status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 button(actions,'✓ Modeli doğrula',()=>{
  if(state.done)return;
  if(!hasModelEvidence()){
   status.dataset.error='true';status.textContent='Önce modelin gerekli matematiksel alanlarını tamamla. Boş ya da dokunulmamış kontrol yanlış deneme sayılmaz.';return;
  }
  if(!correct()){
   const fieldKey=observedField();
   window.Atlas616Trace?.wrong(task,'6. sınıf geometrik şekiller',{
    focus:['angle','supplementary','bisector'].includes(fieldKey)?'hesap':('model'===fieldKey?'model':'karar'),fieldKey
   });
   status.dataset.error='true';status.textContent='⚠️ Henüz doğru değil. Şekli, ölçüyü ve açı ilişkisini yeniden dene.';return;
  }
  state.done=true;status.dataset.error='false';status.textContent='✅ Model matematiksel olarak doğru. Oluşturduğun şekli inceleyebilirsin.';onComplete();
 }).id='g6Check';
 button(actions,'💡 İpucu',()=>{status.dataset.error='false';status.textContent=task.ipucu});
 node(root,'p','Sayısal ve geometrik model otomatik kontrol edilir; açıklamanın doğruluğu isteğe bağlı nottur ve otomatik puanlanmaz. Tarayıcı kayıtları resmî not kaydı değildir.','g6-foot');
}
window.MatematikAtlasGeometry6={render};
})();
