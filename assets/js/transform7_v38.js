/* Matematik Atlası v3.8 — Doğruya göre yansıma ve geometrik inşa atölyesi */
(()=>{'use strict';
const $=id=>document.getElementById(id),wrap=$('atlas7Transform'),stage=$('atlasTransformStage'),status=$('atlasTransformNote');
if(!wrap||!window.ATLAS_DB)return;
const tasks=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas7Transform).map(t=>[t.id,t]));
let task=null,s={};
const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P=v=>[160+v[0]*26,160-v[1]*26],line=(a,b,stroke,width=2,dash='')=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${stroke}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const circ=(x,y,r,fill,stroke='#fff')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const txt=(x,y,value,color='#235874')=>`<text x="${x}" y="${y}" font-size="14" font-family="system-ui" font-weight="800" fill="${color}">${h(value)}</text>`;
function msg(t,tone=''){status.textContent=t;status.className='transform-note '+tone}
function options(name,choices){return `<div class="transform-options" role="group" aria-label="${h(name)}">${choices.map((v,i)=>`<button type="button" data-option="${h(name)}" data-index="${i}" aria-pressed="false">${h(v)}</button>`).join('')}</div>`}
function path(v){return v.map(p=>P(p).join(',')).join(' ')}
function grid(){let z='<svg id="transCanvas" class="transform-board" viewBox="0 0 320 320" role="img" aria-label="Koordinatlı çizim alanı, eksi beş ile artı beş">';
 for(let i=-5;i<=5;i++){const v=160+i*26;z+=line([30,v],[290,v],i===0?'#91b7c8':'#e4f0f6',i===0?1.7:1)+line([v,30],[v,290],i===0?'#91b7c8':'#e4f0f6',i===0?1.7:1);if(i%2===0){z+=txt(v-5,307,i,'#637f91')+txt(7,164-i*26,i,'#637f91')}}return z}
function axisLine(c){let p=c.axis==='v'?[[160+26*c.k,25],[160+26*c.k,294]]:[[26,160-26*c.k],[294,160-26*c.k]];return line(p[0],p[1],'#c45c90',3,'8 4')}
function gridContent(c){let z=grid();if(c.kind==='point'||c.kind==='shape'){
 z+=axisLine(c);const vs=c.kind==='point'?[c.point]:c.vertices;
 if(vs.length>1)z+=`<polygon points="${path(vs)}" fill="#6bbad044" stroke="#278ab2" stroke-width="3" stroke-linejoin="round"/>`;
 vs.forEach((p,i)=>{const q=P(p);z+=circ(q[0],q[1],5,'#208cb7')+txt(q[0]+7,q[1]-8,String.fromCharCode(65+i))});
 if(s.points?.length){if(s.points.length>1)z+=s.points.length===c.target.length&&c.kind==='shape'?`<polygon points="${path(s.points)}" fill="#189c8622" stroke="#189c86" stroke-width="3"/>`:`<polyline points="${path(s.points)}" fill="none" stroke="#189c86" stroke-width="3"/>`;s.points.forEach((p,i)=>{const q=P(p);z+=circ(q[0],q[1],6,'#189c86')+txt(q[0]+8,q[1]-9,String.fromCharCode(65+i)+'′','#147960')})}
 if(s.cursor){const q=P(s.cursor);z+=`<circle cx="${q[0]}" cy="${q[1]}" r="9" fill="none" stroke="#f39b2f" stroke-width="3"/>`}
 }else if(c.kind==='axis'){
 let q=P(c.source),r=P(c.image);z+=line(q,r,'#2794b2',3,'6 5')+circ(...q,6,'#278bb4')+circ(...r,6,'#229d80')+txt(q[0]+7,q[1]-8,'A')+txt(r[0]+7,r[1]-8,'A′');
 if(s.axisIndex!==-1){let k=c.options[s.axisIndex],temp={axis:c.axis,k};z+=axisLine(temp)}
 }else if(c.kind==='midpoint'){
 let a=P(c.endpoints[0]),b=P(c.endpoints[1]);z+=line(a,b,'#2489b2',4)+circ(...a,6,'#2489b2')+circ(...b,6,'#2489b2')+txt(a[0]+8,a[1]-9,'A')+txt(b[0]+8,b[1]-9,'B');
 if(s.radius!==null){let px=s.radius*26;z+=`<circle cx="${a[0]}" cy="${a[1]}" r="${px}" fill="none" stroke="#d89b35" stroke-width="2" stroke-dasharray="5 4"/><circle cx="${b[0]}" cy="${b[1]}" r="${px}" fill="none" stroke="#d89b35" stroke-width="2" stroke-dasharray="5 4"/>`}
 if(s.mid){let q=P(s.mid);z+=circ(...q,6,'#17a187')}
 if(s.line){let k=c.midpoint;z+=s.line==='v'?line(P([k[0],-5]),P([k[0],5]),'#179e85',3):line(P([-5,k[1]]),P([5,k[1]]),'#179e85',3)}
 }return z+'</svg>'}
function angleContent(c){const start=165,y=200,len=123,rad=c.angle*Math.PI/180;
 const second=[start+len*Math.cos(rad),y-len*Math.sin(rad)],target=Number(s.value??0)*Math.PI/180;
 let z=`<svg class="transform-angle" viewBox="0 0 360 290" role="img" aria-label="Açının kolları ve açıortay inşası">`;
 z+=`<path d="M ${start+55} ${y} A55 55 0 0 0 ${start+55*Math.cos(rad)} ${y-55*Math.sin(rad)}" fill="none" stroke="#e2a054" stroke-width="4"/>`;
 z+=line([start,y],[start+len,y],'#278bb4',4)+line([start,y],second,'#278bb4',4);
 const rr=75;const q=P([0,0]); // ray points selected using same radius from vertex
 if(s.r1!==null){z+=circ(start+rr*Math.cos(0),y-rr*Math.sin(0),5,'#db9e44')}
 if(s.r2!==null){z+=circ(start+rr*Math.cos(rad),y-rr*Math.sin(rad),5,'#db9e44')}
 if(s.r1!==null&&s.r2!==null&&s.r1===s.r2){const ang=c.angle/2*Math.PI/180;z+=`<path d="M ${start+rr} ${y} Q ${start+rr+35} ${y-58} ${start+rr*Math.cos(rad)} ${y-rr*Math.sin(rad)}" fill="none" stroke="#e5a759" stroke-width="2" stroke-dasharray="5 4"/>`}
 z+=line([start,y],[start+120*Math.cos(target),y-120*Math.sin(target)],'#159e86',4,'7 4');z+=circ(start,y,6,'#2477a2')+txt(start-26,y+21,'O')+txt(start-48,y-120,c.angle+'°');
 return z+'</svg>'}
function cursorPanel(){return `<div class="transform-cursor"><div>İşaretçi: <b id="transPos">(${s.cursor[0]}, ${s.cursor[1]})</b></div><div class="transform-arrows"><button data-move="-1,0" aria-label="Sola taşı">←</button><button data-move="0,1" aria-label="Yukarı taşı">↑</button><button data-move="0,-1" aria-label="Aşağı taşı">↓</button><button data-move="1,0" aria-label="Sağa taşı">→</button></div><button id="transPlace" type="button" class="place">📍 Noktayı yerleştir</button></div>`}
function render(taskArg,previous){task=taskArg;const c=task?.atlas7Transform;wrap.hidden=!c;if(!c){stage.replaceChildren();return}
 s=previous||{points:[],cursor:[0,0],axisIndex:-1,reason:-1,radius:null,mid:null,line:'',r1:null,r2:null,value:0,proof:-1};
 const names={point:'Ayna Noktası',shape:'Yansıma Ressamı',axis:'Simetri Dedektifi',midpoint:'Pergel İnşası',angle:'Açıortay İnşası',reason:'Matematiksel Kanıt'};$('atlasTransformMode').textContent=names[c.kind];
 let html=`<p class="transform-tip">🪞 Yansıma, bir şeklin büyüklüğünü değiştirmez. Şekil ve görüntüsü eş kalır.</p>`;
 if(['point','shape','axis','midpoint'].includes(c.kind))html+=gridContent(c);
 if(['point','shape'].includes(c.kind))html+=`<p class="transform-tip">${c.kind==='shape'?`<b>${s.points.length===c.target.length?'Şekil tamam, kontrol edebilirsin.':'Sıradaki köşe: '+String.fromCharCode(65+s.points.length)+'′'}</b> · ${s.points.length}/${c.target.length} yerleştirildi.`:'A′ noktasını belirle.'} Tahtaya dokunabilir veya ok düğmelerini kullanabilirsin.</p>`+cursorPanel()+ (c.kind==='shape'?'<button id="transUndo" type="button" class="transform-small">↶ Son köşeyi geri al</button>':'');
 if(c.kind==='axis')html+='<h3>Gerçek ayna doğrusunu seç</h3>'+options('axis',c.options.map(k=>(c.axis==='v'?'x = ':'y = ')+k))+'<h3>Neden bu doğru?</h3>'+options('reason',c.reasons);
 if(c.kind==='midpoint')html+='<h3>1. Pergel açıklığı (iki uçta aynı)</h3>'+options('radius',c.radius_options.map(v=>v+' kare'))+'<h3>2. AB parçasının orta noktasını yerleştir</h3>'+cursorPanel()+'<h3>3. Kesişimlerden hangi doğruyu geçirirsin?</h3>'+options('line',['Dikey doğru','Yatay doğru']);
 if(c.kind==='angle')html+=angleContent(c)+'<h3>1. Açının iki kolunda eş uzaklık belirle</h3><div class="transform-pair"><label>Birinci kol <select id="transR1"><option value="">Seç</option>'+c.radii.map(v=>`<option value="${v}">${v} birim</option>`).join('')+'</select></label><label>İkinci kol <select id="transR2"><option value="">Seç</option>'+c.radii.map(v=>`<option value="${v}">${v} birim</option>`).join('')+'</select></label></div><h3>2. İki eş açıyı oluştur</h3><div class="transform-slider"><input id="transDegree" type="range" min="0" max="90" step="1" value="'+s.value+'"><output id="transDegreeValue">'+s.value+'°</output></div><p class="transform-tip">Yeşil kesikli doğruyu kaydırarak iki açıyı eşitle.</p>';
 if(c.kind==='reason')html+='<h3>Hangi ölçümler inşayı doğrular?</h3>'+`<p class="transform-tip">${c.subkind==='angle'?'Verilen açı: '+c.size+'°':'AB uzunluğu: '+c.size+' birim'}</p>`+options('proof',c.choices);
 stage.innerHTML=html;
 stage.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>{
 const index=Number(b.dataset.index),kind=b.dataset.option;if(kind==='axis')s.axisIndex=index;
 else if(kind==='reason')s.reason=index;else if(kind==='radius')s.radius=c.radius_options[index];
 else if(kind==='line')s.line=index===0?'v':'h';else if(kind==='proof')s.proof=index;
 if(['radius','line','axis'].includes(kind))render(task,s);else updateButtons();
 });updateButtons();
 const place=stage.querySelector('#transPlace');if(place){place.onclick=()=>placePoint(s.cursor);
 stage.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{const d=b.dataset.move.split(',').map(Number);s.cursor=[Math.max(-5,Math.min(5,s.cursor[0]+d[0])),Math.max(-5,Math.min(5,s.cursor[1]+d[1]))];render(task,s)})}
 const board=stage.querySelector('#transCanvas');if(board&&place){board.addEventListener('click',e=>{const r=board.getBoundingClientRect();let x=(e.clientX-r.left)*320/r.width,y=(e.clientY-r.top)*320/r.height;const q=[Math.max(-5,Math.min(5,Math.round((x-160)/26))),Math.max(-5,Math.min(5,Math.round((160-y)/26)))];placePoint(q)})}
 const undo=stage.querySelector('#transUndo');if(undo)undo.onclick=()=>{s.points.pop();render(task,s)};
 if(c.kind==='angle'){const change=()=>{s.r1=Number(stage.querySelector('#transR1').value)||null;s.r2=Number(stage.querySelector('#transR2').value)||null;s.value=Number(stage.querySelector('#transDegree').value);render(task,s)};stage.querySelector('#transR1').value=s.r1||'';stage.querySelector('#transR2').value=s.r2||'';stage.querySelector('#transR1').onchange=change;stage.querySelector('#transR2').onchange=change;stage.querySelector('#transDegree').oninput=change}
 msg('Tahtayı incele, tahminini oluştur ve çözümünü kontrol et.');
}
function updateButtons(){stage.querySelectorAll('[data-option]').forEach(b=>{const k=b.dataset.option;const value=k==='axis'?s.axisIndex:k==='reason'?s.reason:k==='radius'?(task.atlas7Transform.radius_options||[]).indexOf(s.radius):k==='line'?(s.line==='v'?0:s.line==='h'?1:-1):s.proof;b.setAttribute('aria-pressed',String(Number(b.dataset.index)===value))})}
function placePoint(q){const c=task?.atlas7Transform;if(!c)return;s.cursor=q.slice();if(c.kind==='point')s.points=[q.slice()];else if(c.kind==='shape'){if(s.points.length<c.target.length)s.points.push(q.slice());else msg('Bütün köşeler seçildi; hata varsa son köşeyi geri al.','bad')}else if(c.kind==='midpoint')s.mid=q.slice();render(task,s)}
function verify(){if(!task)return;const c=task.atlas7Transform,eq=(a,b)=>a&&b&&a[0]===b[0]&&a[1]===b[1];let ok=false;
 if(c.kind==='point')ok=s.points.length===1&&eq(s.points[0],c.target);
 if(c.kind==='shape')ok=s.points.length===c.target.length&&s.points.every((p,i)=>eq(p,c.target[i]));
 if(c.kind==='axis')ok=s.axisIndex===c.correct_index&&s.reason===c.reason;
 if(c.kind==='midpoint')ok=Number(s.radius)>c.half&&eq(s.mid,c.midpoint)&&s.line===c.correct_line;
 if(c.kind==='angle')ok=Boolean(s.r1&&s.r2&&s.r1===s.r2)&&Number(s.value)===c.target;
 if(c.kind==='reason')ok=s.proof===c.answer;
 if(!ok){window.Atlas616Trace?.wrong(task,'7. sınıf geometrik dönüşümler');msg('Henüz doğru değil. Ayna uzaklıklarını, eş açıları veya inşa şartlarını yeniden kontrol et. İlerleme kaydedilmedi.','bad');return}
 const id=task.id,copy=JSON.parse(JSON.stringify(s));$('answer').value=task.beklenen_yanit_veya_rubrik;$('check').click();if(task?.id===id){render(task,copy);msg('✓ Doğru inşa! '+c.why,'good')}
}
$('atlasTransformVerify').onclick=verify;
$('atlasTransformHint').onclick=()=>{if(task)msg('💡 '+task.ipucu)};
$('atlasTransformRetry').onclick=()=>{if(task)render(task)};
document.addEventListener('atlas:taskrender',e=>render(tasks.get(String(e.detail?.id||''))));
})();