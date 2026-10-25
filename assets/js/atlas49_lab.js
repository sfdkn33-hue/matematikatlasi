/* Matematik Atlası v4.9 — derinleştirilmiş ondalık, geometri, kök atölyesi. */
(()=>{'use strict';
const $=id=>document.getElementById(id),db=window.ATLAS_DB;
const tasks=new Map(db.tasks.filter(t=>t.atlas49).map(t=>[t.id,t]));
const root=$('atlas49Lab');let task=null,m=null,state={},verified=false;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const val=id=>(root.querySelector('#'+id)?.value||'').trim();
const number=s=>{let x=String(s??'').trim().replace(/\s/g,'').replace(',','.');if(/^[-+]?\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/.test(x)){const [a,b]=x.split('/').map(Number);return b? a/b:NaN;}return /^[-+]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(x)?Number(x):NaN;};
const near=(x,y)=>Number.isFinite(x)&&Math.abs(x-y)<1e-8;
const dec=x=>String(x).replace('.',',');
function say(s,bad=false){const p=$('atlas49Status');p.textContent=s;p.dataset.error=bad?'true':'false';}
function field(key,label,placeholder='Yanıtını yaz',mode='decimal'){return `<label class="v49-field"><span>${esc(label)}</span><input id="v49${key}" type="text" inputmode="${mode}" autocomplete="off" placeholder="${esc(placeholder)}"></label>`;}
function sel(key,label,values){return `<label class="v49-field"><span>${esc(label)}</span><select id="v49${key}"><option value="">Seç...</option>${values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('')}</select></label>`}
function choices(key,options){return `<div class="v49-choices" role="group" aria-label="Seçenekler">${options.map((o,i)=>`<button type="button" data-v49-choice="${key}" data-v49-value="${i}" aria-pressed="${state[key]===i}">${esc(o)}</button>`).join('')}</div>`}
function numberModel(n,mark=null){const digits=String(n).replace(',','').split('');const labels=['Yüzler','Onlar','Birler','Onda birler','Yüzde birler','Binde birler'];return `<div class="v49-places">${digits.map((d,i)=>`<div class="v49-place ${mark===i?'is-focus':''}"><span>${labels[i]}</span><b>${esc(d)}</b></div>`).join('')}</div>`}
function sliceDrawing(r,pieces){const c=70,cy=70,R=54;let rays='';for(let i=0;i<pieces;i++){const a=2*Math.PI*i/pieces;const x=c+R*Math.sin(a),y=cy-R*Math.cos(a);rays+=`<line x1='${c}' y1='${cy}' x2='${x.toFixed(2)}' y2='${y.toFixed(2)}' stroke='#147b8d' stroke-width='${pieces>16?.8:1.4}'/>`;}return `<svg class='v49-slices' role='img' aria-label='${pieces} eş daire dilimine ayrılmış daire' viewBox='0 0 140 140'><circle cx='70' cy='70' r='54' fill='#a7e9d5' stroke='#135c82' stroke-width='2'/>${rays}</svg>`;}
function shapeDrawing(shape,r=8,angle=90){
 if(shape==='circle'||shape==='sector'){
  const end=-Math.PI/2+angle*Math.PI/180,ex=100+70*Math.cos(end),ey=100+70*Math.sin(end);const large=angle>180?1:0;
  const slice=shape==='sector'?`<path d="M100 100 L100 30 A70 70 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)} Z" fill="#7fd3ba" stroke="#126c69" stroke-width="2"/>`:'';
  return `<svg class="v49-geometry" viewBox="0 0 200 200" role="img" aria-label="${shape==='circle'?'Daire':'Daire dilimi'} modeli: yarıçap ${r}, merkez açı ${angle}"><circle cx="100" cy="100" r="70" fill="#dbefff" stroke="#1b6698" stroke-width="3"/>${slice}<line x1="100" y1="100" x2="170" y2="100" stroke="#12395c" stroke-width="2"/><text x="126" y="95" font-size="13" fill="#12395c">r=${r}</text>${shape==='sector'?`<text x="90" y="115" fill="#12395c" font-size="11">${angle}°</text>`:''}</svg>`;
 }
 if(shape==='rhombus')return `<svg class="v49-geometry" viewBox="0 0 240 180" role="img" aria-label="Köşegenleri çizilmiş eşkenar dörtgen"><path d="M120 12 L226 90 L120 168 L14 90 Z" stroke="#165c87" stroke-width="3" fill="#d6f3eb"/><path d="M120 12 V168 M14 90 H226" stroke="#c16628" stroke-width="2" stroke-dasharray="5 4"/><text x="126" y="33" font-size="12" fill="#173954">d₁</text><text x="170" y="85" font-size="12" fill="#173954">d₂</text></svg>`;
 return `<svg class="v49-geometry" viewBox="0 0 240 180" role="img" aria-label="Yüksekliği gösterilen yamuk"><path d="M87 18 H157 L218 152 H24 Z" stroke="#155d87" stroke-width="3" fill="#d6f3eb"/><path d="M87 18 V152" stroke="#bc692c" stroke-width="2" stroke-dasharray="5 4"/><text x="119" y="14" fill="#173954" font-size="12">a</text><text x="112" y="166" fill="#173954" font-size="12">b</text><text x="70" y="90" fill="#173954" font-size="12">h</text></svg>`;
}
function updatePreview(){const p=$('v49Preview');if(!p)return;
 if(m.kind==='place_build'||m.kind==='decompose'){
  const x=Array.from({length:6},(_,i)=>Number(val('v49d'+i)||0));p.textContent=m.kind==='place_build'?`${x.slice(0,3).join('')},${x.slice(3).join('')}`:`${x[0]}×100 + ${x[1]}×10 + ${x[2]} + ${x[3]}/10 + ${x[4]}/100 + ${x[5]}/1000`;
 }
 if(m.kind==='sector_area')p.textContent=`${val('v49angle')||'□'}° / 360° × ${m.r}² × π`;
 if(m.kind==='circle_area')p.textContent=`${m.r} × ${m.r} × π = ${val('v49area')||'□'}π`;
 if(m.kind==='root_simplify')p.textContent=`√${m.n} = ${val('v49a')||'□'}√${val('v49b')||'□'}`;
 if(m.kind==='root_operation')p.textContent=`√${m.x} ${m.operation==='multiply'?'×':'÷'} √${m.y} = ${val('v49a')||'□'}√${val('v49b')||'□'}`;
}
function draw(){if(!task||!m)return;const kind=m.kind;let t='';
 if(kind==='place_build'||kind==='decompose'){
  t=`<div class="v49-hero">${esc(m.target)}</div><p>${kind==='place_build'?'Altı basamağın her birini ayrı seç.':'Her basamağı uygun 10 kuvveti / kesir ile eşleştir.'}</p><div class="v49-places v49-edit">${['Yüzler','Onlar','Birler','Onda birler','Yüzde birler','Binde birler'].map((name,i)=>`<label class="v49-place"><span>${name}</span><select id="v49d${i}"><option value="">?</option>${Array.from({length:10},(_,n)=>`<option value="${n}">${n}</option>`).join('')}</select></label>`).join('')}</div><div class="v49-preview" id="v49Preview" aria-live="polite">—</div>`;
 }else if(kind==='missing_digit'){
  t=`<div class="v49-hero">${esc(m.template)}</div>${sel('digit','Eksik rakam',Array.from({length:10},(_,i)=>i))}<p class="v49-hint">Eksik rakamın bulunduğu basamağın değerini de düşün.</p>`;
 }else if(kind==='compare_decimal'){
  t=`<div class="v49-comparison"><span>${esc(m.left)}</span><span aria-hidden="true">?</span><span>${esc(m.right)}</span></div>${choices('relation',['<','=','>'])}<div class="v49-scale"><span>Virgül</span><div class="v49-ruler"></div><span>Binde birler</span></div>`;
 }else if(kind==='round_decimal'){
  t=`<div class="v49-hero">${esc(m.target)}</div><p>Yuvarlanacak basamak: <strong>${['Birler','Onda birler','Yüzde birler'][m.precision]}</strong></p>${field('round','Yuvarlanmış sayı','Örn. 120,31')}<div class="v49-note">Sonraki basamaktaki rakam 5 veya üzeriyse seçtiğin basamağı bir artır.</div>`;
 }else if(kind==='error_detect'){
  t=`<p>Doğru matematiksel açıklamaya dokun:</p>${choices('correct',m.options)}`;
 }else if(kind==='circle_area'){
  t=`<div class="v49-twocol"><div id="v49Slices">${sliceDrawing(m.r,4)}</div><div><div class="v49-pill">Dilimleyerek keşfet</div><p>Daireyi ${m.pieces} eş dilime ayır. Dilimleri ters yönde dizersen giderek dikdörtgene yaklaşan bir şekil oluşur.</p><p><strong>r = ${m.r} br</strong></p></div></div>${sel('pieces','Daire kaç eş dilime ayrılacak?',[4,8,16,32])}${field('area','Alan için π katsayısı','Örn. 64')}<div class="v49-preview" id="v49Preview"></div>`;
 }else if(kind==='sector_area'){
  t=`<div class="v49-twocol">${shapeDrawing('sector',m.r,m.angle)}<div><p>Yarıçap: <b>${m.r}</b> birim</p><p>Merkez açı: <b>${m.angle}°</b></p></div></div>${sel('angle','Dairenin yüzde kaçı?',Array.from(new Set([m.angle,90,120,180,270])).sort((a,b)=>a-b).map(a=>a+'°'))}${field('area','Alan: π katsayısı (kesir de yazabilirsin)','Örn. 32 veya 9/2')}<div class="v49-preview" id="v49Preview"></div>`;
 }else if(kind==='polygon_area'){
  t=`<div class="v49-twocol">${shapeDrawing(m.shape)}<div>${m.shape==='rhombus'?`<p>Köşegenler: <b>${m.a} br</b> ve <b>${m.b} br</b></p>`:`<p>Paralel kenarlar: <b>${m.a} br</b>, <b>${m.b} br</b></p><p>Yükseklik: <b>${m.h} br</b></p>`}</div></div>${sel('formula','Alan bağıntısı',m.options)}${field('area','Hesapladığın alan','Örn. 48')}`;
 }else if(kind==='applied_area'){
  t=`<div class="v49-twocol">${shapeDrawing(m.shape,m.r,m.angle)}<div><p>Gerçek yaşam geometrik planı</p><p><strong>${esc(m.unit)}</strong> cinsinden cevap ver.</p></div></div>${sel('shape','Doğru model',['Daire','Daire dilimi','Eşkenar dörtgen','Yamuk'])}${field('area',m.unit.includes('π')?'Alan için π katsayısı':'Alan (m²)','Örn. 36')}`;
 }else if(kind==='root_simplify'){
  t=`<div class="v49-hero">√${m.n}</div>${sel('factor','Ayırdığın tam kare çarpan',Array.from(new Set([1,4,9,16,25,36,49,64,81,m.a*m.a])).sort((a,b)=>a-b).filter(x=>x<=m.n))}<div class="v49-rootbox"><span id="v49Preview">□√□</span></div><div class="v49-twoinputs">${field('a','Kök dışındaki katsayı a','Örn. 3','numeric')}${field('b','Kök içindeki b','Örn. 5','numeric')}</div><p class="v49-note">Kök içindeki sayının 1 dışında tam kare çarpanı kalmamalıdır.</p>`;
 }else if(kind==='root_operation'){
  t=`<div class="v49-hero">√${m.x} ${m.operation==='multiply'?'×':'÷'} √${m.y}</div><div class="v49-rootbox"><span>Sonuç</span><span id="v49Preview">□√□</span></div><div class="v49-twoinputs">${field('a','Katsayı c','Örn. 6','numeric')}${field('b','Kök içi d (tam sayıda 1 yaz)','Örn. 2 veya 1','numeric')}</div>`;
 }
 $('atlas49Title').textContent=task.baslik;$('atlas49Subtitle').textContent=`${task.ogrenme_ciktisi} · ${task.mekanik}`;$('atlas49Stage').innerHTML=t;
 root.querySelectorAll('button[data-v49-choice]').forEach(b=>b.addEventListener('click',()=>{state[b.dataset.v49Choice]=Number(b.dataset.v49Value);root.querySelectorAll(`[data-v49-choice="${b.dataset.v49Choice}"]`).forEach(c=>c.setAttribute('aria-pressed',String(c===b)));}));
 root.querySelectorAll('input,select').forEach(x=>x.addEventListener('input',()=>{updatePreview();if(x.id==='v49pieces'){$('v49Slices').innerHTML=sliceDrawing(m.r,Number(x.value)||4)}}));updatePreview();say('Bir model kur, seçimini yap ve kontrol et.');
}
function verify(){if(!task)return;const k=m.kind;let correct=false;
 if(k==='place_build'||k==='decompose')correct=m.digits.every((d,i)=>val('v49d'+i)!==''&&Number(val('v49d'+i))===d);
 if(k==='missing_digit')correct=val('v49digit')!==''&&Number(val('v49digit'))===m.digit;
 if(k==='compare_decimal')correct=state.relation!==undefined&&['<','=','>'][state.relation]===m.relation;
 if(k==='round_decimal')correct=near(number(val('v49round')),number(m.answer));
 if(k==='error_detect')correct=state.correct===m.correct;
 if(k==='circle_area')correct=Number(val('v49pieces'))===m.pieces&&near(number(val('v49area')),m.coefficient);
 if(k==='sector_area')correct=val('v49angle')===m.angle+'°'&&near(number(val('v49area')),m.coefficient);
 if(k==='polygon_area')correct=val('v49formula')===m.options[m.formula]&&near(number(val('v49area')),m.area);
 if(k==='applied_area')correct=val('v49shape')===({'circle':'Daire','sector':'Daire dilimi','rhombus':'Eşkenar dörtgen','trapezoid':'Yamuk'}[m.shape])&&near(number(val('v49area')),m.coefficient??m.area);
 if(k==='root_simplify')correct=number(val('v49factor'))===m.a*m.a&&number(val('v49a'))===m.a&&number(val('v49b'))===m.b;
 if(k==='root_operation')correct=number(val('v49a'))===m.coefficient&&number(val('v49b'))===m.radicand;
 if(!correct){say('Henüz doğru değil. Basamakları, modeli veya işlem sırasını tekrar kontrol et; ilerleme kaydedilmedi.',true);return;}
 const id=task.id; window.__atlas49Verified=id;$('answer').value='1';$('check').click();window.__atlas49Verified=null;
 say('✓ Modelin doğrulandı; görev tamamlandı. Matematiksel gerekçeni kendin de paylaşabilirsin.');
}
$('atlas49Check').addEventListener('click',verify);
$('atlas49Hint').addEventListener('click',()=>task&&say('💡 '+task.ipucu));
$('atlas49Reset').addEventListener('click',()=>task&&render(task));
function render(t){task=t||null;root.hidden=!task;if(!task){$('atlas49Stage').replaceChildren();return}m=task.atlas49;state={};draw();}
document.addEventListener('atlas:taskrender',evt=>render(tasks.get(String(evt.detail?.id||''))));
})();
