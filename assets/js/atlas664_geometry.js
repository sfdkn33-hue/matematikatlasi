/* v6.64 — draggable triangle / fractional-coordinate geometry construction. */
(()=>{'use strict';
 const root=document.getElementById('atlas662Lab'), M=window.MatematikAtlas664Math;
 if(!root||!M||!window.ATLAS_DB)return;
 const data=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas664).map(t=>[t.id,t]));
 const NS='http://www.w3.org/2000/svg',R=5.5,S=40,O=260;
 const node=(tag,parent,text,cls)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined&&text!==null)n.textContent=text;parent.appendChild(n);return n;};
 const btn=(par,txt,fn,cls='a664-button')=>{const b=node('button',par,txt,cls);b.type='button';b.addEventListener('click',fn);return b;};
 const shape=(tag,parent,attributes)=>{const n=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attributes||{}))n.setAttribute(k,String(v));parent.appendChild(n);return n;};
 const snap=x=>Math.min(R,Math.max(-R,Math.round(x*4)/4)),toPx=p=>[O+S*p[0],O-S*p[1]],fromPx=(svg,e)=>{
  const r=svg.getBoundingClientRect();const x=(e.clientX-r.left)*520/r.width,y=(e.clientY-r.top)*520/r.height;
  return [snap((x-O)/S),snap((O-y)/S)];};
 const coord=p=>p.map(x=>Number(x.toFixed(2))).join('; ');
 let t=null,pts=[],q=null,sel='D',wrong=0,hinted=false,svg=null,drag=null;
 function status(msg,error=false){const n=root.querySelector('.a664-status');if(n){n.textContent=msg;n.dataset.error=String(error);}}
 function addLine(a,b,color,width=3,dash){const p=toPx(a),s=toPx(b),opts={x1:p[0],y1:p[1],x2:s[0],y2:s[1],stroke:color,'stroke-width':width,'stroke-linecap':'round'};if(dash)opts['stroke-dasharray']=dash;shape('line',svg,opts);}
 function point(p,label,which){const [x,y]=toPx(p);if(which!=='D'){
  const hit=shape('circle',svg,{cx:x,cy:y,r:19,fill:'transparent',class:'a664-handle','data-vertex':which,tabindex:0,role:'button','aria-label':`${which} köşesini ok tuşlarıyla taşı`});
  hit.addEventListener('keydown',e=>{const steps={ArrowLeft:[-.25,0],ArrowRight:[.25,0],ArrowUp:[0,.25],ArrowDown:[0,-.25]};if(!steps[e.key])return;e.preventDefault();const i='ABC'.indexOf(which);const next=pts.map(p=>p.slice());next[i]=M.add(next[i],steps[e.key]).map(snap);if(M.validTriangle(next)){pts=next;q=null;sel=which;draw();syncSelect();svg.querySelector(`[data-vertex="${which}"]`)?.focus();status(`${which} köşesi ${coord(next[i])} konumuna taşındı.`)}else status('Bu yerleşimde üçgen geçerli değil.',true);});
 }
 shape('circle',svg,{cx:x,cy:y,r:7.5,fill:which==='D'?'#007c85':'#cb5747',stroke:'#fff','stroke-width':2,'pointer-events':'none'});
 shape('text',svg,{x:x+12,y:y-10,'font-size':15,'font-weight':800,fill:'#17354d','pointer-events':'none'}).textContent=label;
 }
 function draw(){if(!svg)return;svg.replaceChildren();shape('rect',svg,{x:0,y:0,width:520,height:520,fill:'#fff'});
  for(let n=-5;n<=5;n++){const x=O+S*n,y=O-S*n;addLine([n,-5.5],[n,5.5],n===0?'#9db6c7':'#e5edf3',n===0?2:1);addLine([-5.5,n],[5.5,n],n===0?'#9db6c7':'#e5edf3',n===0?2:1);shape('text',svg,{x,y:497,'font-size':11,'text-anchor':'middle',fill:'#58778e'}).textContent=String(n);shape('text',svg,{x:17,y:y+4,'font-size':11,'text-anchor':'middle',fill:'#58778e'}).textContent=String(n);}
  const [a,b,c]=pts;addLine(a,b,'#879db0',2.4);addLine(b,c,'#879db0',2.4);addLine(c,a,'#879db0',2.4);
  if(t.atlas664.kind==='altitude'){
   const v=M.sub(c,b),u=M.mul(v,1/M.length(v)),d=M.add(b,M.mul(u,-18)),e=M.add(b,M.mul(u,18));addLine(d,e,'#d49b51',1.7,'6 6');
  }
  if(q){addLine(a,q,'#007c85',3.6);point(q,'D','D');}
  point(a,'A','A');point(b,'B','B');point(c,'C','C');
  const output=root.querySelector('.a664-coord-read');if(output)output.textContent=`A(${coord(a)}), B(${coord(b)}), C(${coord(c)}), D${q?'('+coord(q)+')':' henüz yok'}`;
 }
 function selectedPos(){return sel==='D'?q:pts['ABC'.indexOf(sel)];}
 function syncSelect(){const target=root.querySelector('.a664-target');if(target)target.value=sel;const pos=selectedPos();const x=root.querySelector('.a664-x'),y=root.querySelector('.a664-y');if(x)x.value=pos?String(pos[0]):'0';if(y)y.value=pos?String(pos[1]):'0';}
 function place(which,p){if(which==='D'){q=p;status('D noktası yerleştirildi. İnşayı doğrulayabilirsin.');}
 else {const i='ABC'.indexOf(which),copy=pts.map(p=>p.slice());copy[i]=p;
  if(!M.validTriangle(copy)){status('Bu taşıma üçgeni bozuyor. Farklı bir konum seç.',true);return false;}pts=copy;q=null;status(`${which} köşesi taşındı. D noktasını yeniden oluştur.`);}
  draw();return true;
 }
 function feedbackText(){const cfg=t.atlas664,p=M.target(cfg.kind,pts),a=pts[0],b=pts[1],c=pts[2];
  if(cfg.kind==='median')return `BC orta noktası D = (${coord(p)}). BD = DC ve A ile D birleştirildi.`;
  if(cfg.kind==='altitude'){const v=M.sub(c,b),ratio=M.dot(M.sub(p,b),v)/M.dot(v,v);return `AD, BC doğrusuna diktir. Dikme ayağı D = (${coord(p)}), ${ratio<0||ratio>1?'BC doğru parçasının dışındadır':'BC doğru parçası üzerindedir'}.`;}
  return `A(${coord(a)}) köşesinde AB ve AC doğrultularının birim vektörleri toplandığında iç açıortay yönü bulunur. Çizilen AD ışını bu doğrultudadır.`;
 }
 function render(task){t=task;pts=task.atlas664.points.map(p=>p.slice());q=null;sel='D';wrong=0;hinted=false;root.replaceChildren();root.hidden=false;root.classList.add('a664');
  node('div',root,'MATEMATİK ATLASI · DİNAMİK GEOMETRİ','a664-kicker');node('h3',root,t.baslik,'a664-title');node('p',root,t.gorev,'a664-description');
  node('p',root,`${t.ogrenme_ciktisi} · ${t.atlas664.family}`,'a664-band');
  node('p',root,'Kırmızı A/B/C köşelerini sürükleyebilir veya klavyeyle taşıyabilirsin. Yeşil D noktasını grafiğe dokunarak oluştur.','a664-help');
  const holder=node('div',root,null,'a664-graph');svg=shape('svg',holder,{viewBox:'0 0 520 520',role:'img','aria-label':'Sürüklenebilir üçgen ve koordinat düzlemi'});
  svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;const el=e.target.closest('[data-vertex]');drag=el?el.getAttribute('data-vertex'):'D';sel=drag;svg.setPointerCapture(e.pointerId);place(drag,fromPx(svg,e));syncSelect();e.preventDefault();});
  svg.addEventListener('pointermove',e=>{if(drag&&svg.hasPointerCapture(e.pointerId)){place(drag,fromPx(svg,e));syncSelect();}});
  const stop=()=>{drag=null;};svg.addEventListener('pointerup',stop);svg.addEventListener('pointercancel',stop);
  const form=node('div',root,null,'a664-controls');const label=node('label',form,'Taşınacak nokta: ');const target=node('select',label,null,'a664-target');
  for(const k of ['D','A','B','C']){const o=node('option',target,k);o.value=k;}
  target.addEventListener('change',()=>{sel=target.value;syncSelect();});
  for(const [k,cl]of [['X','a664-x'],['Y','a664-y']]){const l=node('label',form,k+' koordinatı:');const f=node('input',l,null,cl);f.type='number';f.min='-5.5';f.max='5.5';f.step='.25';f.value='0';}
  btn(form,'Noktayı yerleştir',()=>{const x=Number(root.querySelector('.a664-x').value),y=Number(root.querySelector('.a664-y').value);
   if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x)>R||Math.abs(y)>R){status('Koordinatlar -5,5 ile 5,5 arasında olmalı.',true);return;}place(sel,[snap(x),snap(y)]);syncSelect();});
  node('p',root,'','a664-coord-read');const stat=node('p',root,'D noktasını oluştur ve çizimini doğrula.','a664-status');stat.setAttribute('role','status');stat.setAttribute('aria-live','polite');
  const bar=node('div',root,null,'a664-actions');btn(bar,'✓ Çizimimi doğrula',()=>{
   if(!M.validate(t.atlas664.kind,pts,q)){wrong++;window.MatematikAtlas64?.log({taskId:t.id,status:'wrong',family:t.atlas664.family});status('Çizim geometrik koşulu henüz sağlamıyor. D noktasını gözden geçir.',true);return;}
   if(!window.MatematikAtlas662Commit?.(t.id,t.atlas662.revision)){status('Matematik doğru, ancak ilerleme kaydı doğrulanamadı.',true);return;}
   window.__atlas662Verified=t.id;
   try{const a=document.getElementById('answer'),check=document.getElementById('check');if(a&&check){a.value='ATLAS662_OK';check.click();}}
   finally{window.__atlas662Verified=null;}
   window.MatematikAtlas64?.log({taskId:t.id,status:'correct',family:t.atlas664.family,firstTry:wrong===0&&!hinted,wrongCount:wrong,hintUsed:hinted});
   status('✓ Matematiksel inşa doğrulandı. '+feedbackText());
  },'a664-primary');
  btn(bar,'💡 İpucu',()=>{hinted=true;status(t.ipucu);window.MatematikAtlas64?.log({taskId:t.id,status:'hint',family:t.atlas664.family});});
  btn(bar,'↻ Yeniden başla',()=>{pts=t.atlas664.points.map(p=>p.slice());q=null;wrong=0;hinted=false;draw();syncSelect();status('Başlangıç şekli geri geldi.');});
  draw();syncSelect();
 }
 document.addEventListener('atlas:taskrender',e=>{const task=data.get(e.detail?.id);if(task)render(task);else{root.classList.remove('a664');}});
 window.MatematikAtlas664={math:M,taskIds:Array.from(data.keys())};
})();
