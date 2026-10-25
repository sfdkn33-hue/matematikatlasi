/* Matematik Atlası v5.6 · independent, interactive geometric models. */
(()=>{'use strict';
const root=document.getElementById('atlas56Lab'); if(!root||!window.ATLAS_DB)return;
const bank=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas56).map(t=>[String(t.id),t]));
const get=id=>root.querySelector('#'+id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let task=null, state={};
const labels={a2:'İkinci şeklin birinci kenarı',b2:'İkinci şeklin diğer kenarı',targetX:'Görüntü A noktasının x değeri',targetY:'Görüntü A noktasının y değeri',faces:'Yüz / açınım parçası sayısı',edges:'Ayrıt sayısı',vertices:'Köşe / tepe noktası sayısı',circ:'Açınım dikdörtgeninin çevreye eşit kenarı (π=3)',lateral:'Silindirin yan alanı (π=3)',bases:'İki tabanın toplam alanı (π=3)',total:'Toplam yüzey alanı (π=3)',base:'Tabanın alanı (π=3)',volume:'Silindirin hacmi (π=3)'};
const choiceDefs={classify:['Eşlik ve benzerlik',['Eş ve benzer','Yalnız benzer','Ne eş ne benzer']],base_shape:['Taban hangi şekil?',['Daire','Üçgen','Kare']],lateral_shape:['Açıldığında yan yüz?', ['Daire dilimi','Dikdörtgen','Üçgen']]};
function pick(k){let [lab,opts]=choiceDefs[k];return `<div class="v56-choices"><strong>${esc(lab)}</strong><div class="v56-key-buttons" role="group" aria-label="${esc(lab)}">${opts.map(v=>`<button type="button" data-v56-key="${esc(k)}" data-v56-value="${esc(v)}" aria-pressed="false">${esc(v)}</button>`).join('')}</div></div>`}
function status(t,err=false){const el=get('v56-status');el.textContent=t;el.dataset.error=String(err)}
function svgBox(content,label,view='0 0 340 235'){return `<svg class="v56-draw" viewBox="${view}" role="img" aria-label="${esc(label)}">${content}</svg>`}
function rectViz(m){let sx=24,sy=55;const w=Math.min(85,m.a*15),h=Math.min(95,m.b*13),w2=Math.min(112,m.a*m.scale*8),h2=Math.min(100,m.b*m.scale*7),sel=state.scale||1, ws=Math.min(100,m.a*sel*10), hs=Math.min(98,m.b*sel*8);
 return svgBox(`<rect x="${sx}" y="${sy}" width="${w}" height="${h}" fill="#dceffc" stroke="#28678b" stroke-width="3"/><text x="${sx}" y="${sy-12}">İlk: ${m.a} × ${m.b}</text><rect x="165" y="55" width="${w2}" height="${h2}" fill="#fce8c9" stroke="#a36328" stroke-width="3"/><text x="165" y="42">Hedef: ${m.a2} × ${m.b2}</text><rect x="165" y="177" width="${ws}" height="${Math.min(hs,35)}" fill="#d5f3ea" stroke="#087c73" stroke-width="2"/><text x="165" y="222">Senin ölçeğin: ×${sel}</text>`,'Benzerlik: ilk şekil, hedef ve öğrencinin seçtiği ölçek');}
const basePoints=(m)=>[[m.x,m.y],[m.x+2,m.y],[m.x+1,m.y+2]];
function polypoints(m){let p=basePoints(m),dx=state.dx||0,dy=state.dy||0,ax=state.axis;
 const move=(q)=>[q[0]+dx,q[1]+dy];
 if(m.kind==='translate')return p.map(move);
 if(m.kind==='reflect')return p.map(q=>ax==='x'?[q[0],-q[1]]:ax==='y'?[-q[0],q[1]]:q);
 return p.map(q=>{q=move(q);return ax==='x'?[q[0],-q[1]]:ax==='y'?[-q[0],q[1]]:q});
}
function coordViz(m){let part='';const X=x=>170+x*18,Y=y=>125-y*18;
 for(let j=-7;j<=7;j++){part+=`<path d="M${X(j)} 5V245 M${X(-7)} ${Y(j)}H${X(7)}" stroke="#dce9f0" stroke-width="1"/>`;if(j%2===0)part+=`<text x="${X(j)+2}" y="${Y(0)+12}" font-size="9">${j}</text>`}
 part+=`<path d="M${X(-7)} ${Y(0)}H${X(7)} M${X(0)} ${Y(-7)}V${Y(7)}" stroke="#446d80" stroke-width="2"/>`;
 const shape=(coords,fill,stroke)=>`<polygon points="${coords.map(v=>X(v[0])+','+Y(v[1])).join(' ')}" fill="${fill}" fill-opacity=".67" stroke="${stroke}" stroke-width="3"/>`;
 part+=shape(basePoints(m),'#c5e5f7','#266b9b');part+=shape(polypoints(m),'#f7d8a4','#b26b2f');
 const original=basePoints(m)[0],after=polypoints(m)[0];part+=`<text x="${X(original[0])+5}" y="${Y(original[1])-8}">A</text><text x="${X(after[0])+5}" y="${Y(after[1])+17}">A′</text>`;
 return svgBox(part,'Koordinat düzleminde mavi başlangıç üçgeni, turuncu hareketli görüntü','0 0 340 255')+
 `<div class="v56-steps"><div class="v56-step"><b>Öteleme</b><p>Sağa: ${state.dx||0}, yukarı: ${state.dy||0}</p></div><div class="v56-step"><b>Yansıma ekseni</b><p>${state.axis||'Henüz seçilmedi'}</p></div></div>`;
}
function solidViz(m){const net=state.unfold, kind=m.kind;const common='stroke="#286b81" stroke-width="3"';let pic='';
 if(kind==='prism'){
  if(net&&m.base_shape==='Üçgen'){pic=`<rect x="73" y="80" width="60" height="85" fill="#d6f2ea" ${common}/><rect x="133" y="80" width="60" height="85" fill="#d6f2ea" ${common}/><rect x="193" y="80" width="60" height="85" fill="#d6f2ea" ${common}/><path d="M133 80L163 25L193 80Z M133 165L163 220L193 165Z" fill="#f6e3bd" ${common}/>`;}else if(net){pic=`<rect x="45" y="70" width="62" height="65" fill="#d6f2ea" ${common}/><rect x="107" y="70" width="62" height="65" fill="#d6f2ea" ${common}/><rect x="169" y="70" width="62" height="65" fill="#d6f2ea" ${common}/><rect x="231" y="70" width="62" height="65" fill="#d6f2ea" ${common}/><rect x="108" y="20" width="60" height="50" fill="#f6e3bd" ${common}/><rect x="108" y="135" width="60" height="50" fill="#f6e3bd" ${common}/>`;}
  else if(m.base_shape==='Üçgen')pic=`<path d="M75 73L138 26L138 142Z M75 73L151 109L215 63L138 26 M138 142L215 179L215 63" fill="#dcf5ef" ${common}/><path d="M75 73L138 142L151 109L215 179" fill="none" ${common}/><text x="95" y="211">3B üçgen prizma şeması</text>`;else pic=`<path d="M75 70l48-35h100l-48 35z M75 70v100h100V70 M175 70l48-35v100l-48 35" fill="#dcf5ef" ${common}/><path d="M75 70h100" ${common}/><text x="105" y="205">3B dik prizma şeması</text>`;
 }else if(kind==='cylinder_net'||kind==='cylinder_area'||kind==='cylinder_volume'){
  if(net){pic=`<rect x="58" y="78" width="225" height="85" fill="#d5eef9" ${common}/><circle cx="170" cy="47" r="29" fill="#f7e4c4" ${common}/><circle cx="170" cy="196" r="29" fill="#f7e4c4" ${common}/><text x="73" y="118">2πr</text><text x="251" y="118">h</text>`;}
  else pic=`<ellipse cx="170" cy="61" rx="85" ry="32" fill="#d6f2ee" ${common}/><path d="M85 61v112 Q170 214 255 173V61" fill="#cfeaf6" ${common}/><path d="M85 173Q170 214 255 173" fill="none" ${common}/><text x="265" y="123">h=${m.h}</text>`;
 }else if(kind==='pyramid'){
  if(net&&m.base==='Üçgen'){pic=`<path d="M113 115L226 115L170 183Z" fill="#bde9e0" ${common}/><path d="M113 115L170 32L226 115Z M113 115L35 170L170 183Z M226 115L290 171L170 183Z" fill="#f8dfb4" ${common}/>`;}else if(net){pic=`<rect x="122" y="72" width="96" height="90" fill="#bde9e0" ${common}/><path d="M122 72L170 14L218 72Z M122 162L170 224L218 162Z M122 72L53 117L122 162Z M218 72L287 117L218 162Z" fill="#f8dfb4" ${common}/>`}
  else if(m.base==='Üçgen')pic=`<path d="M170 20L80 167L168 199L268 161Z" fill="#e7f5f9" ${common}/><path d="M80 167L268 161L168 199" fill="none" stroke="#528695" stroke-dasharray="5 4" stroke-width="2"/>`;else pic=`<path d="M170 23L70 157L170 200L270 157Z M170 23L170 200" fill="#e7f5f9" ${common}/><path d="M70 157L170 115L270 157" fill="none" stroke="#528695" stroke-dasharray="5 4" stroke-width="2"/>`;
 }else if(kind==='cone'){
  if(net){pic=`<path d="M170 100L90 26A115 115 0 1 0 278 165Z" fill="#cdeaf7" ${common}/><circle cx="67" cy="179" r="34" fill="#f6e2be" ${common}/><text x="157" y="217">Daire dilimi + daire</text>`;}
  else pic=`<path d="M170 20L81 180Q170 221 259 180Z" fill="#d8eef8" ${common}/><ellipse cx="170" cy="180" rx="89" ry="29" fill="#f3e0bb" ${common}/><text x="178" y="19">Tepe</text>`;
 }
 return `<div class="v56-unfold-title">${net?'Açınım: yüzler düzleme açılmıştır':'Kapalı modelin şematik görünümü'}</div>`+svgBox(pic,net?'Geometrik cismin şematik açınımı':'Geometrik cismin kapalı durumunun şematik çizimi');
}
function visual(m){if(m.kind.startsWith('similarity'))return rectViz(m);if(['translate','reflect','compose'].includes(m.kind))return coordViz(m);return solidViz(m)}
function tools(m){let h='';
 if(m.interactions.includes('scale'))h+=`<div class="v56-choices"><b>Ölçeği seç ve çizimi değiştir</b><div class="v56-tools">${[1,2,3].map(k=>`<button type="button" data-v56-scale="${k}" aria-pressed="${state.scale===k}">×${k}</button>`).join('')}</div></div>`;
 if(m.interactions.includes('dx')||m.interactions.includes('dy'))h+=`<div class="v56-choices"><b>Şekli kareli düzlemde hareket ettir</b><div class="v56-tools"><button data-v56-move="0,1" type="button">↑ Yukarı</button><button data-v56-move="-1,0" type="button">← Sola</button><button data-v56-move="1,0" type="button">→ Sağa</button><button data-v56-move="0,-1" type="button">↓ Aşağı</button></div><p class="v56-label">Klavye ve dokunmatik ekranlar için yön tuşları. Her dokunuş şekli 1 birim hareket ettirir.</p></div>`;
 if(m.interactions.includes('axis'))h+=`<div class="v56-choices"><b>Yansıma eksenini seç</b><div class="v56-tools">${['x','y'].map(ax=>`<button type="button" data-v56-axis="${ax}" aria-pressed="${state.axis===ax}">${ax} ekseni</button>`).join('')}</div></div>`;
 if(m.interactions.includes('unfold'))h+=`<div class="v56-tools"><button type="button" data-v56-toggle="unfold" aria-pressed="${Boolean(state.unfold)}">${state.unfold?'⇧ Modeli yeniden kapat':'▤ Açınımı aç'}</button></div>`;
 if(m.interactions.includes('fill'))h+=`<div class="v56-choices"><b>Silindiri katman katman doldur (${state.layers||0}/${m.h})</b><div class="v56-layerbar"><span style="width:${100*(state.layers||0)/m.h}%"></span></div><div class="v56-tools"><button type="button" data-v56-fill="1">＋ Bir katman ekle</button><button type="button" data-v56-fill="-1">− Katmanı azalt</button></div></div>`;
 return h;
}
function bind(m){root.querySelectorAll('[data-v56-key]').forEach(b=>b.addEventListener('click',()=>{state[b.dataset.v56Key]=b.dataset.v56Value;update(m)}));
 root.querySelectorAll('[data-v56-scale]').forEach(b=>b.addEventListener('click',()=>{state.scale=Number(b.dataset.v56Scale);state.touched=true;update(m)}));
 root.querySelectorAll('[data-v56-move]').forEach(b=>b.addEventListener('click',()=>{let [dx,dy]=b.dataset.v56Move.split(',').map(Number);state.dx=(state.dx||0)+dx;state.dy=(state.dy||0)+dy;state.touched=true;update(m)}));
 root.querySelectorAll('[data-v56-axis]').forEach(b=>b.addEventListener('click',()=>{state.axis=b.dataset.v56Axis;state.touched=true;update(m)}));
 root.querySelectorAll('[data-v56-toggle]').forEach(b=>b.addEventListener('click',()=>{state.unfold=!state.unfold;state.touched=true;update(m)}));
 root.querySelectorAll('[data-v56-fill]').forEach(b=>b.addEventListener('click',()=>{state.layers=Math.max(0,Math.min(m.h,(state.layers||0)+Number(b.dataset.v56Fill)));state.touched=true;update(m)}));
}
function update(m){get('v56-visual').innerHTML=visual(m);get('v56-tools').innerHTML=tools(m);root.querySelectorAll('[data-v56-key]').forEach(b=>b.setAttribute('aria-pressed',String(state[b.dataset.v56Key]===b.dataset.v56Value)));bindTools(m)}
function bindTools(m){root.querySelectorAll('[data-v56-scale]').forEach(b=>b.onclick=()=>{state.scale=Number(b.dataset.v56Scale);state.touched=true;update(m)});
 root.querySelectorAll('[data-v56-move]').forEach(b=>b.onclick=()=>{let [dx,dy]=b.dataset.v56Move.split(',').map(Number);state.dx=(state.dx||0)+dx;state.dy=(state.dy||0)+dy;state.touched=true;update(m)});
 root.querySelectorAll('[data-v56-axis]').forEach(b=>b.onclick=()=>{state.axis=b.dataset.v56Axis;state.touched=true;update(m)});
 root.querySelectorAll('[data-v56-toggle]').forEach(b=>b.onclick=()=>{state.unfold=!state.unfold;state.touched=true;update(m)});
 root.querySelectorAll('[data-v56-fill]').forEach(b=>b.onclick=()=>{state.layers=Math.max(0,Math.min(m.h,(state.layers||0)+Number(b.dataset.v56Fill)));state.touched=true;update(m)})}
function render(t){task=t||null;root.hidden=!t;if(!t){get('v56-stage').replaceChildren();return}const m=t.atlas56;state={dx:0,dy:0,axis:null,scale:null,unfold:false,layers:0,touched:false};get('v56-title').textContent=t.baslik;get('v56-code').textContent=t.ogrenme_ciktisi+' · Şematik interaktif model';get('v56-solution').hidden=true;
 const fields=m.fields.map(k=>`<label class="v56-field"><span>${esc(labels[k]||k)}</span><input type="number" step="any" inputmode="decimal" autocomplete="off" placeholder="Değeri hesapla" data-v56-field="${esc(k)}"></label>`).join('');
 get('v56-stage').innerHTML=`<div class="v56-prompt">${esc(m.stem)}</div><div class="v56-canvas" id="v56-visual">${visual(m)}</div><div id="v56-tools">${tools(m)}</div><div class="v56-fields">${fields}</div>${m.select.map(pick).join('')}`;
 root.querySelectorAll('[data-v56-key]').forEach(b=>b.onclick=()=>{state[b.dataset.v56Key]=b.dataset.v56Value;root.querySelectorAll(`[data-v56-key="${b.dataset.v56Key}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
 bindTools(m);status('Şekle dokunup modeli değiştir; sonra sayıları ve kavramları doğrula.');}
function interactionOk(m){switch(m.kind){case 'similarity_class':case 'similarity_build':return state.touched&&state.scale===m.scale;
 case 'translate':return state.touched&&state.dx===m.dx&&state.dy===m.dy;
 case 'reflect':return state.touched&&state.axis===m.axis;
 case 'compose':return state.touched&&state.dx===m.dx&&state.dy===m.dy&&state.axis===m.axis;
 case 'cylinder_volume':return state.touched&&state.layers===m.h;
 default:return state.touched&&state.unfold===true;}}
function check(){if(!task)return;const m=task.atlas56;let errors=[];
 if(!interactionOk(m))errors.push('görsel model');
 for(const k of m.fields){let el=root.querySelector(`[data-v56-field="${k}"]`);let str=el.value.trim().replace(',','.');let ok=str.length>0&&Number.isFinite(Number(str))&&Math.abs(Number(str)-m[k])<1e-9;el.setAttribute('aria-invalid',String(!ok));if(!ok)errors.push(labels[k]||k)}
 for(const k of m.select){if(state[k]!==String(m[k]))errors.push(choiceDefs[k][0])}
 if(errors.length){status(`Henüz ${errors.length} adım eksik veya hatalı: ${errors.join(', ')}. Görev kaydedilmedi.`,true);return;}
 const solve=m.fields.map(k=>(labels[k]||k)+': '+m[k]).join(' · ');get('v56-solution').textContent='✓ Doğru. '+solve+'. Model ve seçilen dönüşüm tutarlı; nasıl düşündüğünü kendin tartış.';get('v56-solution').hidden=false;
 status('✓ Tüm model ve sonuçlar doğru; görev kaydediliyor.');window.__atlas56Verified=task.id;
 try{document.getElementById('answer').value='1';document.getElementById('check').click()}finally{window.__atlas56Verified=null}
}
get('v56-check').onclick=check;get('v56-hint').onclick=()=>task&&status('💡 '+task.atlas56.hint);get('v56-reset').onclick=()=>task&&render(task);
document.addEventListener('atlas:taskrender',e=>render(bank.get(String(e.detail?.id||''))));
window.MatematikAtlasV56={taskCount:bank.size,modelState:()=>({...state}),getCurrentId:()=>task?.id||null};
})();
