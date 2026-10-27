/* Matematik Atlası v6.63: touch/keyboard-friendly geometric construction and proof checks. */
(()=>{'use strict';
const root=document.getElementById('atlas662Lab');
if(!root || !window.ATLAS_DB)return;
const relevant=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas663 && !t.atlas664).map(t=>[t.id,t]));
const NS='http://www.w3.org/2000/svg';
const range=[-5,-4,-3,-2,-1,0,1,2,3,4,5];
let task=null,c=null,chosen=[],wrong=0,hinted=false;
const $=(tag,parent,txt,cls)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;parent.appendChild(n);return n};
const svgEl=(tag,parent,attrs={})=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));parent.appendChild(n);return n};
const btn=(parent,label,fn,cls='a663-btn')=>{const b=$( 'button',parent,label,cls);b.type='button';b.addEventListener('click',fn);return b};
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
const norm=a=>Math.hypot(a[0],a[1]);
const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
const same=(a,b)=>a?.[0]===b?.[0] && a?.[1]===b?.[1];
const near0=x=>Math.abs(x)<1e-8;
const midpoint=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
function validate(cfg,selected){
 if(!cfg || !selected)return false;
 const need=cfg.kind==='perpendicular'?2:1;
 if(selected.length!==need || !selected.every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)))return false;
 if(selected.some(p=>p.some(v=>v<-5||v>5||!Number.isInteger(v))))return false;
 const [a,b,d]=cfg.points;
 const q=selected[0];
 if(cfg.kind==='perpendicular'){
  const r=selected[1];if(same(q,r))return false;
  const m=midpoint(a,b),ab=sub(b,a);
  return near0(dot(sub(q,m),ab))&&near0(dot(sub(r,m),ab));
 }
 if(cfg.kind==='median')return same(q,midpoint(b,d));
 if(cfg.kind==='altitude')return near0(cross(sub(q,b),sub(d,b)))&&near0(dot(sub(q,a),sub(d,b)));
 if(cfg.kind==='angle'){
  const u=sub(b,a),v=sub(d,a),qv=sub(q,a);if(!norm(u)||!norm(v)||!norm(qv))return false;
  const aim=add(u.map(x=>x/norm(u)),v.map(x=>x/norm(v)));
  if(norm(aim)<1e-8)return false;
  return dot(qv,aim)>0&&Math.abs(cross(qv,aim))/(norm(qv)*norm(aim))<0.000001;
 }
 return false;
}
function coord(p){return `(${p[0]}, ${p[1]})`}
const toPx=([x,y])=>[240+40*x,240-40*y];
function line(svg,a,b,color,width=3,dash=''){
 const p=toPx(a),q=toPx(b);return svgEl('line',svg,{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:color,'stroke-width':width,'stroke-linecap':'round',...(dash?{'stroke-dasharray':dash}:{})});
}
function mark(svg,p,name,color,offset=12){const [x,y]=toPx(p);svgEl('circle',svg,{cx:x,cy:y,r:7,fill:color,stroke:'white','stroke-width':2});svgEl('text',svg,{x:x+offset,y:y-11,fill:'#15334f','font-size':15,'font-weight':'700'}).textContent=name;}
function explain(cfg){const [a,b,d]=cfg.points;
 if(cfg.kind==='median')return `BC kenarının orta noktası M = ${coord(midpoint(b,d))}. Kenarortay A${coord(a)} ile M'yi birleştirir; BM = MC.`;
 if(cfg.kind==='altitude')return `Seçilen D noktasından BC doğrusuna dik çizildi. AD · BC yön vektörü = 0 ve D, BC doğrusu üzerindedir.`;
 if(cfg.kind==='perpendicular')return `Seçilen iki noktanın her biri A ve B'ye eşit uzaklıktadır. İki noktanın belirlediği doğru, AB'nin orta noktasından geçer ve AB'ye diktir.`;
 return `A köşesinden çizilen ışın, AB ve AC doğrultularının oluşturduğu açıyı iki eş parçaya ayırır. Işın açının iç bölgesindedir.`;
}
function message(text,error=false){const s=root.querySelector('.a663-status');if(!s)return;s.textContent=text;s.dataset.error=String(error)}
function record(p){if(!p.every(v=>v>=-5&&v<=5))return;
 const need=c.kind==='perpendicular'?2:1;
 if(chosen.length===need)chosen=[];
 chosen.push(p);drawBoard();message(`${chosen.length}/${need} nokta seçildi. Çizimi doğrula.`);
}
function drawBoard(){
 const host=root.querySelector('.a663-map');if(!host)return;host.replaceChildren();
 const svg=svgEl('svg',host,{viewBox:'0 0 480 480',role:'img','aria-label':'Koordinat ızgarasında noktalar ve çizilen doğrular','preserveAspectRatio':'xMidYMid meet'});
 svg.setAttribute('preserveAspectRatio','xMidYMid meet');
 svgEl('rect',svg,{width:480,height:480,fill:'#ffffff',rx:12});
 for(const n of range){const q=240+n*40;svgEl('line',svg,{x1:q,y1:40,x2:q,y2:440,stroke:n===0?'#7d98b3':'#e2e8f0','stroke-width':n===0?2:1});svgEl('line',svg,{x1:40,y1:q,x2:440,y2:q,stroke:n===0?'#7d98b3':'#e2e8f0','stroke-width':n===0?2:1});svgEl('text',svg,{x:q,y:456,'text-anchor':'middle','font-size':10,fill:'#667a90'}).textContent=String(n);svgEl('text',svg,{x:20,y:q+3,'text-anchor':'middle','font-size':10,fill:'#667a90'}).textContent=String(-n);}
 const [a,b,d]=c.points;
 if(d){line(svg,a,b,'#8195aa',2);line(svg,b,d,'#8195aa',2);line(svg,d,a,'#8195aa',2);}
 else line(svg,a,b,'#8195aa',3);
 // Dotted infinite guide helps distinguish a triangle height from a segment-constrained construction.
 if(c.kind==='altitude'){const dir=sub(d,b),t1=add(b,dir.map(x=>-2*x)),t2=add(b,dir.map(x=>3*x));line(svg,t1,t2,'#c6a36d',1.5,'5 7');}
 if(chosen.length){
  if(c.kind==='perpendicular'){if(chosen.length===2)line(svg,chosen[0],chosen[1],'#0f789e',4);}
  else line(svg,a,chosen[0],'#0f789e',4);
 }
 mark(svg,a,'A','#cb4f3b');mark(svg,b,'B','#cb4f3b');if(d)mark(svg,d,'C','#cb4f3b');
 chosen.forEach((p,i)=>mark(svg,p,c.kind==='perpendicular'?'P'+(i+1):'D','#067e8b',-15));
 // Keyboard users can choose X/Y from the accessible selectors; pointer users can touch the graph.
 const selectable=svgEl('rect',svg,{x:40,y:40,width:400,height:400,fill:'transparent',style:'cursor:crosshair'});
 selectable.addEventListener('click',event=>{const rect=svg.getBoundingClientRect();const x=480*(event.clientX-rect.left)/rect.width;const y=480*(event.clientY-rect.top)/rect.height;const q=[Math.round((x-240)/40),Math.round((240-y)/40)];record(q);});
 const ptext=root.querySelector('.a663-picked');if(ptext)ptext.textContent=chosen.length?chosen.map((p,i)=>`${c.kind==='perpendicular'?'P'+(i+1):'D'} ${coord(p)}`).join(' · '):'Henüz nokta seçilmedi.';
}
function render(){root.replaceChildren();if(!task)return;c=task.atlas663;chosen=[];wrong=0;hinted=false;root.hidden=false;
 $('div',root,'ATLAS · GEOMETRİ YAPIM LABORATUVARI','a663-eyebrow');$('h3',root,task.baslik,'a663-head');$('p',root,task.gorev,'a663-desc');
 const info=$('div',root,null,'a663-info');$('span',info,`${task.ogrenme_ciktisi} · ${c.family}`);
 $('p',root,c.kind==='perpendicular'?'İki farklı nokta seç: çizilen doğru AB’nin gerçek orta dikmesi olmalı.':'D noktasını seç; çizim A noktasından D’ye otomatik oluşturulur.','a663-hintline');
 $('div',root,null,'a663-map');
 const accessible=$('div',root,null,'a663-coords');$('span',accessible,'Koordinatı seç:','a663-label');
 const inputs=[];
 for(const axis of ['x','y']){const label=$('label',accessible,axis.toUpperCase());const sel=$('select',label);sel.setAttribute('aria-label',axis.toUpperCase()+' koordinatı');for(let v=-5;v<=5;v++){const o=$('option',sel,String(v));o.value=String(v);if(v===0)o.selected=true;}inputs.push(sel);}
 btn(accessible,'Noktayı yerleştir',()=>record(inputs.map(x=>Number(x.value))));
 $('p',root,'Henüz nokta seçilmedi.','a663-picked');
 const st=$('p',root,'Izgaraya dokun ya da koordinatları seç.','a663-status');st.setAttribute('role','status');st.setAttribute('aria-live','polite');
 const actions=$('div',root,null,'a663-actions');btn(actions,'✓ Çizimimi doğrula',()=>{
  if(!validate(c,chosen)){wrong++;window.MatematikAtlas64?.log({taskId:task.id,status:'wrong',family:c.family});message('Çizim henüz koşulları sağlamıyor. Noktaları ve matematiksel gerekçeyi yeniden kontrol et.',true);return;}
  const id=task.id;
  if(!window.MatematikAtlas662Commit?.(id,task.atlas662.revision)){message('Çizim doğru ancak ilerleme kaydı doğrulanamadı. Cihaz depolamasını kontrol et.',true);return;}
  window.__atlas662Verified=id;
  const answer=document.getElementById('answer'),check=document.getElementById('check');
  if(answer&&check){answer.value='ATLAS662_OK';check.click();}
  window.__atlas662Verified=null;
  window.MatematikAtlas64?.log({taskId:id,status:'correct',family:c.family,firstTry:wrong===0&&!hinted,wrongCount:wrong,hintUsed:hinted});
  message('✓ Matematiksel inşa doğrulandı. '+explain(c));
 },'a663-primary');
 btn(actions,'💡 İpucu',()=>{hinted=true;window.MatematikAtlas64?.log({taskId:task.id,status:'hint',family:c.family});message(task.ipucu)});
 btn(actions,'↶ Son noktayı geri al',()=>{chosen.pop();drawBoard();message('Son nokta kaldırıldı.')});
 btn(actions,'↻ Baştan başla',()=>{chosen=[];drawBoard();message('Model sıfırlandı.')});
 drawBoard();
}
document.addEventListener('atlas:taskrender',e=>{task=relevant.get(e.detail?.id)||null;if(task)render();else {root.hidden=true;root.replaceChildren();}});
window.MatematikAtlas663={validate,explain};
})();
