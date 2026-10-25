/* v3.9 — Üçgen Laboratuvarı: MAT.7.5.1, MAT.7.5.2 */
(()=>{'use strict';
const $=x=>document.getElementById(x),wrap=$('atlas7Triangle'),stage=$('atlasTriangleStage'),notice=$('atlasTriangleNote');
if(!wrap||!window.ATLAS_DB)return;
const taskMap=new Map(window.ATLAS_DB.tasks.filter(x=>x.atlas7Triangle).map(x=>[x.id,x]));let current=null,state={};
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const point=p=>[30+28*p[0],310-28*p[1]],eq=(a,b)=>a&&b&&Math.abs(a[0]-b[0])<.01&&Math.abs(a[1]-b[1])<.01;
const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
function line(a,b,col,w=2,d=''){const p=point(a),q=point(b);return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${col}" stroke-width="${w}" ${d?'stroke-dasharray="'+d+'"':''}/>`}
function circle(p,color,r=5){const q=point(p);return `<circle cx="${q[0]}" cy="${q[1]}" r="${r}" fill="${color}" stroke="#fff" stroke-width="2"/>`}
function label(p,t,color='#225473'){const q=point(p);return `<text x="${q[0]+8}" y="${q[1]-9}" font-size="14" font-weight="800" font-family="system-ui" fill="${color}">${safe(t)}</text>`}
function message(t,cls=''){notice.textContent=t;notice.className='triangle-note '+cls}
function buttons(key,items){return `<div class="triangle-choices" role="group">${items.map((v,i)=>`<button type="button" data-choice="${key}" data-i="${i}" aria-pressed="false">${safe(v)}</button>`).join('')}</div>`}
function baseBoard(){let z='<svg id="triangleCanvas" class="triangle-board" viewBox="0 0 340 340" role="img" aria-label="0 ile 10 koordinatları arasında üçgen çizimi">';for(let i=0;i<=10;i++){z+=line([i,0],[i,10],'#e0edf4',1)+line([0,i],[10,i],'#e0edf4',1);if(i%2===0){let a=point([i,0]),b=point([0,i]);z+=`<text x="${a[0]-5}" y="328" font-size="11" fill="#628496">${i}</text><text x="7" y="${b[1]+4}" font-size="11" fill="#628496">${i}</text>`}}return z}
function canvas(c){let z=baseBoard(),pts=[c.A,c.B,c.C];
 if(pts.every(Boolean)){
 z+=`<polygon points="${pts.map(x=>point(x).join(',')).join(' ')}" fill="#d9eff9a8" stroke="#3588b2" stroke-width="2.8" stroke-linejoin="round"/>`;
 for(let i=0;i<3;i++)z+=circle(pts[i],'#2b81ac',5)+label(pts[i],['A','B','C'][i]);
 }
 if(c.kind==='median'||c.kind==='compass')z+=line(c.C,mid(c.A,c.B),'#d6a54e',2.2,'5 5');
 if(c.kind==='altitude')z+=line(c.A.map((v,j)=>v+(c.A[j]-c.B[j])*5),c.B.map((v,j)=>v+(c.B[j]-c.A[j])*5),'#a6b8c3',1.4,'5 5');
 if(c.kind==='inverse'){z+=line(c.A,c.M,'#d1a33f',3,'6 5')+circle(c.M,'#dc9c45',7)+label(c.M,'M');z+=circle(c.B,'#fff',7)}
 if(c.kind==='centroid'){
 const m1=mid(c.B,c.C),m2=mid(c.A,c.C);if(state.medA)z+=line(c.A,m1,'#c68c38',3,'7 5');if(state.medB)z+=line(c.B,m2,'#a167cb',3,'7 5');
 z+=circle(m1,'#e4ae50',5)+circle(m2,'#e4ae50',5);
 }
 if(c.kind==='compass'&&state.radius!==null){const a=point(c.A),b=point(c.B),r=state.radius*28;z+=`<circle cx="${a[0]}" cy="${a[1]}" r="${r}" fill="none" stroke="#c99548" stroke-width="2" stroke-dasharray="5 5"/><circle cx="${b[0]}" cy="${b[1]}" r="${r}" fill="none" stroke="#c99548" stroke-width="2" stroke-dasharray="5 5"/>`}
 if(state.marker){z+=circle(state.marker,'#1a9d84',7)+label(state.marker,c.kind==='inverse'?'B′':c.kind==='centroid'?'G?':'M?','#14785f');if(c.C&&(c.kind==='median'||c.kind==='compass'||c.kind==='altitude'))z+=line(c.C,state.marker,'#159e83',3,'6 4');}
 if(state.cursor)z+=`<circle cx="${point(state.cursor)[0]}" cy="${point(state.cursor)[1]}" r="10" fill="none" stroke="#ef8b30" stroke-width="3"/>`;
 return z+'</svg>'
}
function angleDiagram(c){const o=[62,239],r=152,a=c.angle*Math.PI/180,t=state.degrees*Math.PI/180;
 const endpoint=(deg)=>[o[0]+r*Math.cos(deg),o[1]-r*Math.sin(deg)];const end=endpoint(a),mark=endpoint(t);
 return `<svg class="triangle-angle" viewBox="0 0 340 290" role="img" aria-label="Açıyı iki eş parçaya ayıran açıortay"><line x1="${o[0]}" y1="${o[1]}" x2="214" y2="239" stroke="#287fa9" stroke-width="4"/><line x1="${o[0]}" y1="${o[1]}" x2="${end[0]}" y2="${end[1]}" stroke="#287fa9" stroke-width="4"/><line x1="${o[0]}" y1="${o[1]}" x2="${mark[0]}" y2="${mark[1]}" stroke="#16a084" stroke-width="4" stroke-dasharray="8 5"/><circle cx="${o[0]}" cy="${o[1]}" r="6" fill="#287fa9"/><text x="20" y="264" fill="#195777" font-size="15" font-weight="bold">C · ${c.angle}°</text><text x="166" y="35" fill="#147e68" font-size="14">${state.degrees}° yönü</text></svg>`
}
function cursorControls(){return `<div class="triangle-cursor"><span>İşaretçi: <b>(${state.cursor[0]}, ${state.cursor[1]})</b></span><div class="triangle-arrows"><button type="button" data-shift="-0.5,0" aria-label="Sola yarım birim">←</button><button type="button" data-shift="0,0.5" aria-label="Yukarı yarım birim">↑</button><button type="button" data-shift="0,-0.5" aria-label="Aşağı yarım birim">↓</button><button type="button" data-shift="0.5,0" aria-label="Sağa yarım birim">→</button></div><button class="triangle-place" type="button" id="trianglePlace">📍 Yerleştir</button></div>`}
function render(t,prev){current=t;const c=t?.atlas7Triangle;wrap.hidden=!c;if(!c){stage.replaceChildren();return}
 state=prev||{cursor:[5,5],marker:null,reason:-1,medA:false,medB:false,radius:null,degrees:0,seq:[]};
 $('triangleMode').textContent=({median:'Kenarortay',altitude:'Yükseklik',bisector:'Açıortay',centroid:'Ağırlık Merkezi',compass:'Pergel İnşası',inverse:'Kayıp Köşe',sequence:'İnşa Adımları'})[c.kind];
 let content='<p class="triangle-tip">🔎 Bir çizginin kenarortay, açıortay veya yükseklik olması farklı matematiksel koşullara bağlıdır.</p>';
 if(c.kind==='bisector')content+=angleDiagram(c)+`<label class="triangle-slider">Yeşil açıortay: <strong id="triangleDegVal">${state.degrees}°</strong><input id="triangleDegrees" type="range" min="0" max="${c.angle}" step="1" value="${state.degrees}"></label>`;
 else content+=canvas(c);
 if(['median','altitude','centroid','compass','inverse'].includes(c.kind))content+=cursorControls();
 if(c.kind==='centroid')content+='<h3>Önce iki farklı kenarortayı çiz</h3>'+`<div class="triangle-choices"><button type="button" data-toggle="medA" aria-pressed="${state.medA}">A köşesinden</button><button type="button" data-toggle="medB" aria-pressed="${state.medB}">B köşesinden</button></div>`;
 if(c.kind==='compass')content+='<h3>İki uçta eş yarıçaplı yay çiz</h3>'+buttons('radius',c.radii.map(x=>x+' birim'));
 if(c.kind==='sequence')content+=`<h3>Doğru 3 adımı sırayla seç</h3><p class="triangle-seq">Seçilen sıra: ${state.seq.map((idx,i)=>`${i+1}. ${safe(c.steps[idx])}`).join(' → ')||'Henüz seçilmedi'}</p>`+buttons('step',c.steps)+'<button type="button" class="triangle-undo" id="triangleUndo">↶ Son adımı geri al</button>';
 else content+='<h3>Matematiksel gerekçeni seç</h3>'+buttons('reason',c.choices);
 stage.innerHTML=content;
 stage.querySelectorAll('[data-choice]').forEach(btn=>btn.onclick=()=>{const idx=Number(btn.dataset.i),key=btn.dataset.choice;if(key==='reason')state.reason=idx;if(key==='radius')state.radius=c.radii[idx];if(key==='step'&&state.seq.length<3&&!state.seq.includes(idx))state.seq.push(idx);render(t,state)});
 stage.querySelectorAll('[data-toggle]').forEach(btn=>btn.onclick=()=>{state[btn.dataset.toggle]=!state[btn.dataset.toggle];render(t,state)});
 stage.querySelectorAll('[data-choice]').forEach(btn=>{let key=btn.dataset.choice,idx=Number(btn.dataset.i);btn.setAttribute('aria-pressed',String(key==='reason'?idx===state.reason:key==='radius'?c.radii[idx]===state.radius:state.seq.includes(idx)))});
 const control=stage.querySelector('#trianglePlace');if(control){control.onclick=()=>place(state.cursor);stage.querySelectorAll('[data-shift]').forEach(btn=>btn.onclick=()=>{const d=btn.dataset.shift.split(',').map(Number);state.cursor=[Math.max(0,Math.min(10,state.cursor[0]+d[0])),Math.max(0,Math.min(10,state.cursor[1]+d[1]))];render(t,state)});
 let board=stage.querySelector('#triangleCanvas');if(board)board.onclick=e=>{let rect=board.getBoundingClientRect();let x=(e.clientX-rect.left)/rect.width*340,y=(e.clientY-rect.top)/rect.height*340;place([Math.max(0,Math.min(10,Math.round((x-30)/14)/2)),Math.max(0,Math.min(10,Math.round((310-y)/14)/2))])};}
 const degrees=stage.querySelector('#triangleDegrees');if(degrees)degrees.oninput=()=>{state.degrees=Number(degrees.value);render(t,state)};
 const undo=stage.querySelector('#triangleUndo');if(undo)undo.onclick=()=>{state.seq.pop();render(t,state)};
 message('Önce modelini oluştur, ardından geometrik gerekçeni denetle.');
}
function place(p){state.cursor=p.slice();state.marker=p.slice();render(current,state)}
function verify(){if(!current)return;const c=current.atlas7Triangle;let ok=false;
 if(['median','altitude','inverse'].includes(c.kind))ok=eq(state.marker,c.target)&&state.reason===c.reason;
 if(c.kind==='bisector')ok=state.degrees===c.target&&state.reason===c.reason;
 if(c.kind==='centroid')ok=state.medA&&state.medB&&eq(state.marker,c.target)&&state.reason===c.reason;
 if(c.kind==='compass')ok=state.radius>c.half&&eq(state.marker,c.target)&&state.reason===c.reason;
 if(c.kind==='sequence')ok=JSON.stringify(state.seq)===JSON.stringify(c.answer);
 if(!ok){message('Henüz doğru değil. İnşayı ve gerekçeyi yeniden incele. İlerleme kaydedilmedi.','bad');return}
 const t=current,saved=JSON.parse(JSON.stringify(state));$('answer').value=t.beklenen_yanit_veya_rubrik;$('check').click();if(current?.id===t.id){render(t,saved);message('✓ Doğru! '+c.why,'good')}
}
$('triangleVerify').onclick=verify;$('triangleHint').onclick=()=>{if(current)message('💡 '+current.ipucu)};$('triangleRetry').onclick=()=>{if(current)render(current)};
document.addEventListener('atlas:taskrender',e=>render(taskMap.get(String(e.detail?.id||''))));
})();