/* Geometry lab: six interactive learning approaches; legacy progress is unchanged. */
(()=>{'use strict';
const $=id=>document.getElementById(id),shell=$('atlas7Solid'),stage=$('atlasSolidStage'),feedback=$('atlasSolidNote');
if(!shell||!window.ATLAS_DB)return;
const bank=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas7Solid).map(t=>[t.id,t]));
let active=null,s={};
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const parse=v=>{let x=String(v??'').trim().replace(/\s/g,'').replace(',','.');return /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(x)?Number(x):NaN};
const valid=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<1e-8;
function note(t,tone=''){feedback.className='atlas-solid-note '+tone;feedback.textContent=t}
function iso(h){const u=35,v=21,w=34,n=h.length,m=h[0].length;const p=(x,y,z)=>[240+(x-y)*u,200+(x+y)*v-z*w];
 const poly=(pts,color)=>'<polygon points="'+pts.map(x=>p(...x).map(n=>n.toFixed(1)).join(',')).join(' ')+'" fill="'+color+'" stroke="#477194" stroke-width="1.7" stroke-linejoin="round"/>';
 let cells=[];h.forEach((row,y)=>row.forEach((height,x)=>{for(let z=0;z<height;z++)cells.push({x,y,z})}));cells.sort((a,b)=>a.x+a.y+a.z-b.x-b.y-b.z);
 let shapes=cells.map(({x,y,z})=>poly([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]],'#4da2d2')+poly([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]],'#75c5e7')+poly([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]],'#b0e5ff')).join('');
 let corners=[];for(const x of [0,m])for(const y of [0,n])for(const z of [0,Math.max(1,...h.flat())])corners.push(p(x,y,z));
 let x0=Math.min(...corners.map(z=>z[0]))-14,x1=Math.max(...corners.map(z=>z[0]))+14,y0=Math.min(...corners.map(z=>z[1]))-14,y1=Math.max(...corners.map(z=>z[1]))+14;
 return `<svg class="solid-iso" viewBox="${x0} ${y0} ${x1-x0} ${y1-y0}" role="img" aria-label="Eş küplerle oluşturulmuş izometrik yapı">${shapes}</svg>`}
function prism(a,b,k){return iso(Array.from({length:b},()=>Array(a).fill(k)))}
function net(a,b,c){const k=16,x=250,y=160;const faces=[{x,y,w:a*k,h:b*k,s:`${a}×${b}`},{x,y:y-c*k,w:a*k,h:c*k,s:`${a}×${c}`},{x,y:y+b*k,w:a*k,h:c*k,s:`${a}×${c}`},{x:x-c*k,y,w:c*k,h:b*k,s:`${b}×${c}`},{x:x+a*k,y,w:c*k,h:b*k,s:`${b}×${c}`},{x:x+(a+c)*k,y,w:a*k,h:b*k,s:`${a}×${b}`}];
 let shapes=faces.map((f,i)=>`<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" fill="${['#b6e1fa','#c5f1e2','#c5f1e2','#ffe0a0','#ffe0a0','#b6e1fa'][i]}" stroke="#416b89" stroke-width="2"/><text x="${f.x+f.w/2}" y="${f.y+f.h/2+4}" font-size="12" font-weight="700" fill="#224e6b" text-anchor="middle">${f.s}</text>`).join('');
 let x0=Math.min(...faces.map(f=>f.x))-12,x1=Math.max(...faces.map(f=>f.x+f.w))+12,y0=Math.min(...faces.map(f=>f.y))-12,y1=Math.max(...faces.map(f=>f.y+f.h))+12;
 return `<svg class="solid-net" viewBox="${x0} ${y0} ${x1-x0} ${y1-y0}" role="img" aria-label="Dikdörtgenler prizmasının açınımı">${shapes}</svg>`}
const input=(id,label)=>`<label for="${id}" class="solid-label">${esc(label)}</label><input id="${id}" class="solid-number" type="text" inputmode="decimal" autocomplete="off" placeholder="Örneğin: 12">`;
function renderModel(){if(!active)return;let c=active.atlas7Solid;if(!['stack','formula'].includes(c.kind))return;let [a,b,h]=c.dims;const model=$('solidModel');if(model)model.innerHTML=prism(a,b,s.levels);$('solidCount').textContent=c.kind==='stack'?`Dolu kat: ${s.levels}/${h} · Her kat ${a*b} küp · Şimdi ${a*b*s.levels} küp`:`Taban alanı: ${a*b} birim² · Yükseklik: ${s.levels} · Hacim: ${a*b*s.levels} birim³`;}
function show(task){active=task;let c=task?.atlas7Solid;shell.hidden=!c;if(!c){stage.innerHTML='';return} s={mask:Array(c.rows*c.cols||0).fill(0),levels:0,choice:''};$('atlasSolidMode').textContent={view:'Görünüş Tahtası',net:'Açınım Laboratuvarı',stack:'Küp İnşa Et',formula:'Hacim Tasarla',convert:'Ölçü Birimi Dönüştür',context:'Gerçek Yaşam'}[c.kind];
 let html='';switch(c.kind){
 case 'view':html=iso(c.heights)+'<p class="solid-muted">Şekle istenen yönden bak. Dolu görünen kareleri aşağıda işaretle.</p><div class="solid-silhouette" style="--solid-cols:'+c.cols+'">'+Array.from({length:c.rows*c.cols},(_,i)=>`<button type="button" class="solid-cell" data-cell="${i}" aria-label="Satır ${Math.floor(i/c.cols)+1} sütun ${i%c.cols+1}" aria-pressed="false"></button>`).join('')+'</div>';break;
 case 'net':html=net(...c.dims)+'<p class="solid-muted">Altı yüz, üç eş çiftten oluşuyor. Yüz çiftlerinin alanlarını ve bütün yüzeylerin alanını hesapla.</p><div class="solid-fields">'+['a×b yüz çiftinin alanı','a×c yüz çiftinin alanı','b×c yüz çiftinin alanı','Toplam alan (cm²)'].map((z,i)=>input('solidPart'+i,z)).join('')+'</div>';break;
 case 'stack':html='<div id="solidModel"></div><div class="solid-live" id="solidCount"></div><div class="solid-row"><button id="solidMinus" type="button">− Kat çıkar</button><button id="solidPlus" type="button">+ Kat ekle</button></div>'+input('solidInput','Toplam birim küp sayısı');break;
 case 'formula':html='<div id="solidModel"></div><label class="solid-label" for="solidSlider">Yüksekliği sürükleyerek ayarla</label><input type="range" id="solidSlider" min="1" max="8" step="1" value="1" class="solid-slider"><div class="solid-live" id="solidCount"></div>';break;
 case 'convert':html='<div class="solid-convert"><div><small>VERİLEN</small><strong>'+esc(c.value)+' '+esc(c.from_unit)+'</strong></div><span>➜</span><div><small>HEDEF</small><strong>'+esc(c.to_unit)+'</strong></div></div><p class="solid-muted">1 L = 1 dm³ · 1 mL = 1 cm³<br>Hacim basamakları arasında 1000; litre basamakları arasında 10 kat vardır.</p>'+input('solidInput','Dönüştürme sonucu ('+c.to_unit+')');break;
 case 'context':html=prism(...c.dims)+'<p class="solid-muted">Kaplama mı, iç hacim mi? Önce problem türünü seç, sonra işlemini yap.</p><div class="solid-row" id="solidChoose"><button type="button" data-choice="surface" aria-pressed="false">🎨 Yüzey alanı</button><button type="button" data-choice="volume" aria-pressed="false">📦 Hacim</button></div>'+input('solidInput','Sonuç ('+c.unit+')');break;}
 stage.innerHTML=html;
 if(c.kind==='view')stage.querySelectorAll('[data-cell]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.cell);s.mask[i]=1-s.mask[i];b.setAttribute('aria-pressed',String(!!s.mask[i]))});
 if(c.kind==='stack'){$('solidMinus').onclick=()=>{s.levels=Math.max(0,s.levels-1);renderModel()};$('solidPlus').onclick=()=>{s.levels=Math.min(c.dims[2],s.levels+1);renderModel()};renderModel()}
 if(c.kind==='formula'){s.levels=1;$('solidSlider').oninput=()=>{s.levels=Number($('solidSlider').value);renderModel()};renderModel()}
 if(c.kind==='context')stage.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{s.choice=b.dataset.choice;stage.querySelectorAll('[data-choice]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)))});
 note('Modelini tamamlayıp yanıtını doğrula.');}
function verify(){if(!active)return;let c=active.atlas7Solid,ok=false;
 switch(c.kind){case 'view':ok=s.mask.join('')===c.mask;break;case 'net':ok=c.parts.every((v,i)=>valid(parse($('solidPart'+i).value),v))&&valid(parse($('solidPart3').value),c.answer);break;case 'stack':ok=s.levels===c.dims[2]&&valid(parse($('solidInput').value),c.answer);break;case 'formula':ok=s.levels===c.answer;break;case 'convert':ok=valid(parse($('solidInput').value),c.answer);break;case 'context':ok=s.choice===c.measure&&valid(parse($('solidInput').value),c.answer);break;}
 if(!ok){note('Bu çözüm henüz doğru değil. Modelini ve işlemini yeniden incele; ilerleme kaydedilmedi.','bad');return}
 let taskId=active.id,copy=JSON.parse(JSON.stringify(s)),inputs=Array.from(stage.querySelectorAll('input[type=text]')).map(i=>[i.id,i.value]);$('answer').value=active.beklenen_yanit_veya_rubrik;$('check').click();
 if(active?.id===taskId){s=copy;if(c.kind==='view')stage.querySelectorAll('[data-cell]').forEach(b=>b.setAttribute('aria-pressed',String(!!s.mask[Number(b.dataset.cell)])));if(c.kind==='formula')$('solidSlider').value=String(s.levels);if(['stack','formula'].includes(c.kind))renderModel();if(c.kind==='context')stage.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.choice===s.choice)));inputs.forEach(([id,value])=>{if($(id))$(id).value=value});note('✓ Doğru! '+c.explanation,'good')}}
$('atlasSolidVerify').onclick=verify;$('atlasSolidRetry').onclick=()=>{if(active)show(active)};$('atlasSolidHint').onclick=()=>{if(active)note('💡 '+active.ipucu)};
document.addEventListener('atlas:taskrender',e=>show(bank.get(String(e.detail?.id||''))));
})();