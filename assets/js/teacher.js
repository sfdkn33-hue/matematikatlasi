/* Yerel ilerleme raporu. Sunucu/öğrenci hesabı yok. */
(()=>{
 'use strict';
 const db=window.ATLAS_DB,$=id=>document.getElementById(id);
 let done={};
 function load(){try{done=JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')||{}}catch(e){done={}}}
 function loadBonus(){try{return JSON.parse(localStorage.getItem('mathAtlasBonusDoneV21')||'{}')||{}}catch(e){return {}}}
 const bonusIds=new Set(db.tasks.filter(t=>t.bonusGorev).map(t=>t.id));
 const totals=()=>new Map(db.outcomes.map(o=>[o.kod,db.tasks.filter(t=>t.ogrenme_ciktisi===o.kod)]));
 function render(){load();const lookup=totals(),filter=$('teacherGrade').value;
  const outputs=db.outcomes.filter(x=>filter==='all'||String(x.sinif)===filter);
  const tbody=$('teacherRows');tbody.replaceChildren();
  let sum=0,completed=0,full=0;
  for(const o of outputs){
    const list=lookup.get(o.kod),score=list.filter(t=>done[t.id]).length;
    sum+=list.length;completed+=score;if(score===list.length)full++;
    const tr=document.createElement('tr');
    const values=[String(o.sinif),String(o.plan_sirasi),o.kod,o.tema_adi||o.tema,score+' / '+list.length,score===list.length?'Tamamlandı':score?'Sürüyor':'Başlanmadı'];
    for(const value of values){const td=document.createElement('td');td.textContent=value;tr.appendChild(td)}
    tbody.appendChild(tr);
  }
  const kpi=$('teacherKpis');kpi.replaceChildren();
  for(const label of [completed+' / '+sum+' görev',full+' / '+outputs.length+' öğrenme çıktısı',Math.round(sum?completed/sum*100:0)+'% tamamlandı',db.tasks.filter(t=>t.bonusGorev&&((filter==='all')||String(t.sinif)===filter)&&loadBonus()[t.id]).length+' / '+db.tasks.filter(t=>t.bonusGorev&&((filter==='all')||String(t.sinif)===filter)).length+' ek düşünme adımı']){
    const chip=document.createElement('span');chip.className='chip';chip.textContent=label;kpi.appendChild(chip)
  }
 }
 const taskIds=new Set(db.tasks.map(t=>t.id));
 function getDecimalReasons(){try{return JSON.parse(localStorage.getItem('mathAtlasDecimalNotes')||'{}')||{}}catch(e){return {}}}
 function getMeasure6Reasons(){try{return JSON.parse(localStorage.getItem('mathAtlasMeasure6Notes')||'{}')||{}}catch(e){return {}}}
 function getAlgebra6Reasons(){try{return JSON.parse(localStorage.getItem('mathAtlasAlgebra6Notes')||'{}')||{}}catch(e){return {}}}
 function getGeometry6Reasons(){try{return JSON.parse(localStorage.getItem('mathAtlasGeometry6Notes')||'{}')||{}}catch(e){return {}}}
 function getResearchReasons(){try{return JSON.parse(localStorage.getItem('mathAtlasResearchReasons')||'{}')||{}}catch(e){return {}}}
 function getGeometry5PlusNotes(){try{return JSON.parse(localStorage.getItem('mathAtlasGeometry5PlusNotes')||'{}')||{}}catch(e){return {}}}
 function getFraction5Notes(){try{return JSON.parse(localStorage.getItem('mathAtlasFraction5PlusNotes')||'{}')||{}}catch(e){return {}}}
 function getMeasure5Notes(){try{return JSON.parse(localStorage.getItem('mathAtlasMeasure5PlusNotes')||'{}')||{}}catch(e){return {}}}
function getNumber5Notes(){try{return JSON.parse(localStorage.getItem('mathAtlasNumber5PlusNotes')||'{}')||{}}catch(e){return {}}}
 function getProbability5Notes(){try{return JSON.parse(localStorage.getItem('mathAtlasProbability5PlusNotes')||'{}')||{}}catch(e){return {}}}
 function getAlgebra5Notes(){try{return JSON.parse(localStorage.getItem('mathAtlasAlgebra5PlusNotes')||'{}')||{}}catch(e){return {}}}
 function getStatistics5Notes(){try{return JSON.parse(localStorage.getItem('mathAtlasStatistics5PlusNotes')||'{}')||{}}catch(e){return {}}}
 function getReasons(){try{return JSON.parse(localStorage.getItem('mathAtlasAppliedReasons')||'{}')||{}}catch(e){return {}}}
 function download(filename,text){const blob=new Blob([text],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)}
 $('teacherBackup').addEventListener('click',()=>{load();const safe=Object.fromEntries(Object.entries(done).filter(([k,v])=>v===true&&taskIds.has(k)));const notes=Object.fromEntries(Object.entries(getReasons()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=2000));download('matematik_atlasi_yedek.json',JSON.stringify({format:'matematik-atlasi',version:8,completed:safe,bonusCompleted:Object.fromEntries(Object.entries(loadBonus()).filter(([k,v])=>bonusIds.has(k)&&v===true)),appliedReasons:notes,researchReasons:Object.fromEntries(Object.entries(getResearchReasons()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=2000)),geometry6Notes:Object.fromEntries(Object.entries(getGeometry6Reasons()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=1500)),algebra6Notes:Object.fromEntries(Object.entries(getAlgebra6Reasons()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=1500)),measure6Notes:Object.fromEntries(Object.entries(getMeasure6Reasons()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=1500)),decimalNotes:Object.fromEntries(Object.entries(getDecimalReasons()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=1500)),geometry5PlusNotes:Object.fromEntries(Object.entries(getGeometry5PlusNotes()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=1500)),number5PlusNotes:Object.fromEntries(Object.entries(getNumber5Notes()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=1500)),measure5PlusNotes:Object.fromEntries(Object.entries(getMeasure5Notes()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=1500)),fraction5PlusNotes:Object.fromEntries(Object.entries(getFraction5Notes()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=1500)),statistics5PlusNotes:Object.fromEntries(Object.entries(getStatistics5Notes()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=2000)),algebra5PlusNotes:Object.fromEntries(Object.entries(getAlgebra5Notes()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=1500)),probability5PlusNotes:Object.fromEntries(Object.entries(getProbability5Notes()).filter(([k,v])=>taskIds.has(k)&&typeof v==='string'&&v.length<=1500))},null,2))});
 $('teacherImport').addEventListener('change',async ev=>{const file=ev.target.files?.[0];if(!file)return;
  const status=$('teacherImportStatus');
  try{if(file.size>1500000)throw Error('Dosya çok büyük');const incoming=JSON.parse(await file.text());
   if(incoming.format!=='matematik-atlasi'||!incoming.completed||typeof incoming.completed!=='object'||Array.isArray(incoming.completed))throw Error('Yedek biçimi tanınmadı');
   const entries=Object.entries(incoming.completed).filter(([id,flag])=>taskIds.has(id)&&flag===true);
   load();for(const [id] of entries)done[id]=true;
   localStorage.setItem('mathAtlas940Done',JSON.stringify(done));
   if(incoming.bonusCompleted&&typeof incoming.bonusCompleted==='object'&&!Array.isArray(incoming.bonusCompleted)){const extra=loadBonus();for(const [id,flag] of Object.entries(incoming.bonusCompleted)){if(bonusIds.has(id)&&flag===true)extra[id]=true}localStorage.setItem('mathAtlasBonusDoneV21',JSON.stringify(extra))}
   if(incoming.appliedReasons&&typeof incoming.appliedReasons==='object'&&!Array.isArray(incoming.appliedReasons)){const reasons=getReasons();for(const [id,note] of Object.entries(incoming.appliedReasons)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=2000)reasons[id]=note}localStorage.setItem('mathAtlasAppliedReasons',JSON.stringify(reasons))}
   if(incoming.geometry5PlusNotes&&typeof incoming.geometry5PlusNotes==='object'&&!Array.isArray(incoming.geometry5PlusNotes)){const n=getGeometry5PlusNotes();for(const [id,note] of Object.entries(incoming.geometry5PlusNotes)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=1500)n[id]=note}localStorage.setItem('mathAtlasGeometry5PlusNotes',JSON.stringify(n))}
   if(incoming.fraction5PlusNotes&&typeof incoming.fraction5PlusNotes==='object'&&!Array.isArray(incoming.fraction5PlusNotes)){const n=getFraction5Notes();for(const [id,note] of Object.entries(incoming.fraction5PlusNotes)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=1500)n[id]=note}localStorage.setItem('mathAtlasFraction5PlusNotes',JSON.stringify(n))}
   if(incoming.measure5PlusNotes&&typeof incoming.measure5PlusNotes==='object'&&!Array.isArray(incoming.measure5PlusNotes)){const n=getMeasure5Notes();for(const [id,note] of Object.entries(incoming.measure5PlusNotes)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=1500)n[id]=note}localStorage.setItem('mathAtlasMeasure5PlusNotes',JSON.stringify(n))}
   if(incoming.probability5PlusNotes&&typeof incoming.probability5PlusNotes==='object'&&!Array.isArray(incoming.probability5PlusNotes)){const n=getProbability5Notes();for(const [id,note] of Object.entries(incoming.probability5PlusNotes)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=1500)n[id]=note}localStorage.setItem('mathAtlasProbability5PlusNotes',JSON.stringify(n))}
   if(incoming.algebra5PlusNotes&&typeof incoming.algebra5PlusNotes==='object'&&!Array.isArray(incoming.algebra5PlusNotes)){const n=getAlgebra5Notes();for(const [id,note] of Object.entries(incoming.algebra5PlusNotes)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=1500)n[id]=note}localStorage.setItem('mathAtlasAlgebra5PlusNotes',JSON.stringify(n))}
   if(incoming.statistics5PlusNotes&&typeof incoming.statistics5PlusNotes==='object'&&!Array.isArray(incoming.statistics5PlusNotes)){const n=getStatistics5Notes();for(const [id,note] of Object.entries(incoming.statistics5PlusNotes)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=2000)n[id]=note}localStorage.setItem('mathAtlasStatistics5PlusNotes',JSON.stringify(n))}
   if(incoming.number5PlusNotes&&typeof incoming.number5PlusNotes==='object'&&!Array.isArray(incoming.number5PlusNotes)){const n=getNumber5Notes();for(const [id,note] of Object.entries(incoming.number5PlusNotes)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=1500)n[id]=note}localStorage.setItem('mathAtlasNumber5PlusNotes',JSON.stringify(n))}
   if(incoming.geometry6Notes&&typeof incoming.geometry6Notes==='object'&&!Array.isArray(incoming.geometry6Notes)){const notes=getGeometry6Reasons();for(const [id,note] of Object.entries(incoming.geometry6Notes)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=1500)notes[id]=note}localStorage.setItem('mathAtlasGeometry6Notes',JSON.stringify(notes))}
   if(incoming.decimalNotes&&typeof incoming.decimalNotes==='object'&&!Array.isArray(incoming.decimalNotes)){const notes=getDecimalReasons();for(const [id,note] of Object.entries(incoming.decimalNotes)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=1500)notes[id]=note}localStorage.setItem('mathAtlasDecimalNotes',JSON.stringify(notes))}
   if(incoming.measure6Notes&&typeof incoming.measure6Notes==='object'&&!Array.isArray(incoming.measure6Notes)){const notes=getMeasure6Reasons();for(const [id,note] of Object.entries(incoming.measure6Notes)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=1500)notes[id]=note}localStorage.setItem('mathAtlasMeasure6Notes',JSON.stringify(notes))}
   if(incoming.algebra6Notes&&typeof incoming.algebra6Notes==='object'&&!Array.isArray(incoming.algebra6Notes)){const notes=getAlgebra6Reasons();for(const [id,note] of Object.entries(incoming.algebra6Notes)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=1500)notes[id]=note}localStorage.setItem('mathAtlasAlgebra6Notes',JSON.stringify(notes))}
   if(incoming.researchReasons&&typeof incoming.researchReasons==='object'&&!Array.isArray(incoming.researchReasons)){const notes=getResearchReasons();for(const [id,note] of Object.entries(incoming.researchReasons)){if(taskIds.has(id)&&typeof note==='string'&&note.length<=2000)notes[id]=note}localStorage.setItem('mathAtlasResearchReasons',JSON.stringify(notes))}
   status.textContent=entries.length+' kayıt başarıyla birleştirildi. Diğer kayıtlar korundu.';render();
  }catch(e){status.textContent='Yedek içe aktarılamadı: '+e.message}finally{ev.target.value=''}
 });
 $('teacherGrade').addEventListener('change',render);$('teacherRefresh').addEventListener('click',render);
 $('teacherDownload').addEventListener('click',()=>{
  load();const bonus=loadBonus(),notes=getReasons(),researchNotes=getResearchReasons(),geometryNotes=getGeometry6Reasons(),algebraNotes=getAlgebra6Reasons(),measureNotes=getMeasure6Reasons(),decimalNotes=getDecimalReasons(),geometry5Notes=getGeometry5PlusNotes(),number5Notes=getNumber5Notes(),fraction5Notes=getFraction5Notes(),measure5Notes=getMeasure5Notes(),statistics5Notes=getStatistics5Notes(),algebra5Notes=getAlgebra5Notes(),probability5Notes=getProbability5Notes();const rows=[['Sınıf','Plan sırası','Öğrenme çıktısı','Tema','Görev ID','Tamamlandı','Uygulamalı görev açıklaması','İstatistik gerekçesi','Geometri gerekçesi','Cebir gerekçesi','Geometrik nicelik gerekçesi','Ondalık ve kesir-bölme gerekçesi','Ek düşünme adımı','5. sınıf geometri gerekçesi','5. sınıf doğal sayılar gerekçesi','5. sınıf kesir gerekçesi','5. sınıf alan-çevre gerekçesi','5. sınıf istatistik gerekçesi','5. sınıf cebirsel düşünme gerekçesi','5. sınıf olasılık gerekçesi']];
  for(const o of db.outcomes.filter(x=>$('teacherGrade').value==='all'||String(x.sinif)===$('teacherGrade').value)){
    for(const t of db.tasks.filter(a=>a.ogrenme_ciktisi===o.kod))rows.push([o.sinif,o.plan_sirasi,o.kod,o.tema_adi||o.tema,t.id,done[t.id]?'Evet':'Hayır',notes[t.id]||'',researchNotes[t.id]||'',geometryNotes[t.id]||'',algebraNotes[t.id]||'',measureNotes[t.id]||'',decimalNotes[t.id]||'',t.bonusGorev?(bonus[t.id]?'Tamamlandı':'Bekliyor'):'—',geometry5Notes[t.id]||'',number5Notes[t.id]||'',fraction5Notes[t.id]||'',measure5Notes[t.id]||'',statistics5Notes[t.id]||'',algebra5Notes[t.id]||'',probability5Notes[t.id]||''])
  }
  const csv='\uFEFF'+rows.map(a=>a.map(v=>'"'+String(v??'').replace(/^[\t\r\n ]*[=+@-]/,m=>"'"+m).replace(/"/g,'""')+'"').join(';')).join('\r\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob);
  const link=document.createElement('a');link.href=url;link.download='matematik_atlasi_yerel_ilerleme.csv';document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url)
 });
 render();
})();
