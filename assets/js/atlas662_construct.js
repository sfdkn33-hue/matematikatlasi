/* Matematik Atlası v6.62 — task-integrated construction, no teacher approval. */
(()=>{'use strict';
 const root=document.getElementById('atlas662Lab');if(!root||!window.ATLAS_DB)return;
 const tasks=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas662 && !t.atlas663).map(t=>[t.id,t]));
 let task=null,c=null,state=null,wrong=0,hintShown=false;
 function node(tag,parent,txt,cls){const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined&&txt!==null)x.textContent=txt;parent.appendChild(x);return x}
 function btn(parent,text,fn,cls){const x=node('button',parent,text,cls||'a662-btn');x.type='button';x.addEventListener('click',fn);return x}
 function status(msg,negative=false){const x=root.querySelector('.a662-status');if(x){x.textContent=msg;x.dataset.negative=String(negative)}}
 function reset(){wrong=0;hintShown=false;state=null;draw()}
 function gridBuild(stage,initial,max){state={grid:initial.map(row=>row.slice()),touched:false};const table=node('div',stage,null,'a662-buildgrid');table.style.gridTemplateColumns=`repeat(${initial[0].length}, minmax(54px, 1fr))`;
   for(let r=0;r<initial.length;r++)for(let col=0;col<initial[r].length;col++){
    const item=btn(table,'0',()=>{state.grid[r][col]=(state.grid[r][col]+1)%(max+1);state.touched=true;item.textContent=String(state.grid[r][col]);item.setAttribute('aria-label',`Satır ${r+1}, sütun ${col+1}, ${state.grid[r][col]} küp`);update()},'a662-cube');
    item.textContent=String(state.grid[r][col]);item.setAttribute('aria-label',`Satır ${r+1}, sütun ${col+1}, ${state.grid[r][col]} küp`);
   }
   const info=node('p',stage,'','a662-result');const update=()=>{const sum=state.grid.flat().reduce((a,b)=>a+b,0);info.textContent=`Modelde ${sum} birim küp var. Her kare üzerindeki sayı o sütunun yüksekliğidir.`};update();}
 function cubeView(stage){node('div',stage,`Önden sütunlar: ${c.front.join(', ')} · Sağdan satırlar: ${c.side.join(', ')} · Toplam: ${c.total} küp`,'a662-target');
 node('p',stage,`Üstten görünüş (■ dolu / □ boş): ${c.occupied.map(row=>row.map(x=>x?'■':'□').join(' ')).join(' / ')}`,'a662-target');
 node('p',stage,'Dört sütunun her birine dokunarak 0–3 küp yerleştir. Birden fazla doğru yapı mümkünse hepsi kabul edilir.','a662-help');gridBuild(stage,[[0,0],[0,0]],c.maxHeight);}
 function cubeLayers(stage){node('p',stage,`Taban: ${c.rows} sıra × ${c.cols} sütun · Hedef kat: ${c.height} · Beklenen toplam: ${c.rows*c.cols*c.height} küp`,'a662-target');
 gridBuild(stage,Array.from({length:c.rows},()=>Array(c.cols).fill(0)),c.height+1);}
 function prism(stage){node('p',stage,`Hedef hacim: ${c.targetVolume} birimküp. Kapalı prizma, her ayrıt 1–${c.limit} birim.`,'a662-target');state={dims:[1,1,1],touched:false};const fields=node('div',stage,null,'a662-dims');['Uzunluk','Genişlik','Yükseklik'].forEach((label,i)=>{const wrap=node('label',fields,label,'a662-field');const select=node('select',wrap);select.setAttribute('aria-label',label);for(let n=1;n<=c.limit;n++){const opt=node('option',select,String(n));opt.value=String(n)}select.addEventListener('change',()=>{state.dims[i]=Number(select.value);state.touched=true;update()})});const info=node('p',stage,'','a662-result');function update(){const [a,b,d]=state.dims;info.textContent=`Hacim: ${a*b*d} · Yüzey alanı: ${2*(a*b+a*d+b*d)} birimkare`};update();}
 function reflection(stage){node('p',stage,`Yansıma ekseni: ${c.axis} · Başlangıç noktaları: ${c.points.map((p,i)=>'ABC'[i]+'('+p.join(',')+')').join('  ')}`,'a662-target');
 state={points:[null,null,null],selected:0,touched:false};const picker=node('div',stage,null,'a662-vertex');const bs=['A′','B′','C′'].map((name,i)=>btn(picker,name,()=>{state.selected=i;bs.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)))},'a662-btn'));bs[0].setAttribute('aria-pressed','true');
 const grid=node('div',stage,null,'a662-coordinate');const marks=[];
 for(let y=4;y>=-4;y--)for(let x=-4;x<=4;x++){
   const b=btn(grid,'·',()=>{state.points[state.selected]=[x,y];state.touched=true;redraw();},'a662-point');b.dataset.x=String(x);b.dataset.y=String(y);b.setAttribute('aria-label',`x ${x}, y ${y}`);if(x===0||y===0)b.classList.add('axis');marks.push(b)
 }
 const info=node('p',stage,'','a662-result');function redraw(){marks.forEach(b=>{const x=Number(b.dataset.x),y=Number(b.dataset.y);const chosen=state.points.map((p,i)=>p&&p[0]===x&&p[1]===y?['A′','B′','C′'][i]:null).filter(Boolean);b.textContent=chosen.join(' ')||'·';b.classList.toggle('selected',chosen.length>0)});info.textContent=state.points.map((p,i)=>'ABC'[i]+"′: "+(p?'('+p.join(', ')+')':'seçilmedi')).join('  ·  ')}redraw();}
 const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 function validated(){if(!state?.touched)return false;
 if(c.kind==='cube_layers')return state.grid.every(row=>row.every(v=>v===c.height));
 if(c.kind==='cube_view'){
  const g=state.grid,front=g[0].map((_,j)=>Math.max(...g.map(row=>row[j]))),side=g.map(row=>Math.max(...row)),occ=g.map(row=>row.map(v=>Number(v>0))),sum=g.flat().reduce((a,b)=>a+b,0);
  return eq(front,c.front)&&eq(side,c.side)&&eq(occ,c.occupied)&&sum===c.total;
 }
 if(c.kind==='prism_design'){const [a,b,d]=state.dims;return a*b*d===c.targetVolume&&2*(a*b+a*d+b*d)===c.minSurface;}
 if(c.kind==='reflection')return state.points.every((p,i)=>p&&eq(p,c.axis==='x'?[c.points[i][0],-c.points[i][1]]:[-c.points[i][0],c.points[i][1]]));
 return false;}
 function draw(){root.replaceChildren();if(!task)return;c=task.atlas662;
 node('div',root,'MATEMATİK ATLASI · YAP–DENE–DOĞRULA','a662-eyebrow');node('h3',root,task.baslik,'a662-title');node('p',root,task.gorev,'a662-text');const stage=node('div',root,null,'a662-stage');
 if(c.kind==='cube_view')cubeView(stage);else if(c.kind==='cube_layers')cubeLayers(stage);else if(c.kind==='prism_design')prism(stage);else if(c.kind==='reflection')reflection(stage);
 const info=node('p',root,'Modeli oluştur ve matematiksel doğrulamayı çalıştır.','a662-status');info.setAttribute('role','status');info.setAttribute('aria-live','polite');
 const actions=node('div',root,null,'a662-actions');btn(actions,'✓ Modelimi doğrula',()=>{if(!validated()){wrong++;window.MatematikAtlas64?.log({taskId:task.id,status:'wrong',family:c.family});status('🔎 Model henüz hedeflerin tümünü karşılamıyor. Tekrar deneyebilirsin.',true);return}
 const id=task.id;
 if(!window.MatematikAtlas662Commit?.(id,c.revision)){status('⚠ Matematik doğru ancak ilerleme sürümü kaydedilemedi. Cihazındaki depolamayı kontrol et.',true);return}
 window.__atlas662Verified=id;document.getElementById('answer').value='ATLAS662_OK';document.getElementById('check').click();window.__atlas662Verified=null;
 window.MatematikAtlas64?.log({taskId:id,status:'correct',family:c.family,firstTry:wrong===0&&!hintShown,wrongCount:wrong,hintUsed:hintShown});
 },'a662-primary');btn(actions,'💡 İpucu',()=>{hintShown=true;window.MatematikAtlas64?.log({taskId:task.id,status:'hint',family:c.family});status(task.ipucu)});btn(actions,'↻ Sıfırla',reset);
 }
 document.addEventListener('atlas:taskrender',e=>{task=tasks.get(e.detail?.id)||null;root.hidden=!task;wrong=0;hintShown=false;if(task)draw();else root.replaceChildren();});
 window.MatematikAtlas662={validateConfig:cfg=>{if(cfg.kind==='prism_design')return cfg.minSurface>0;return true}};
})();
