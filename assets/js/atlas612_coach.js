/* Matematik Atlası v6.12 — öğrenme koçu (cihaz-içi pilot).
   Yanlış veya ipucu olayından sonra AYNI kazanımda FARKLI soru ailesinden
   henüz çözülmemiş bir görev önerir. Tamamlama/ustalık işareti üretmez.
   Kişisel veri, ağ bağlantısı ve öğretmen onayı içermez. */
(()=>{
 'use strict';
 const db=window.ATLAS_DB,api=window.MatematikAtlas64;
 if(!db||!api)return;
 const MS=86400000;
 const tracked=db.tasks.filter(t=>t.atlas63Pilot||t.atlas610Workbench||t.atlas611Workbench||t.atlas60Lab||t.atlas61Lab);
 const indexed=new Map(db.tasks.map(t=>[t.id,t]));
 const families=new Map(tracked.map(t=>[t.id,(t.atlas63Pilot||t.atlas610Workbench||t.atlas611Workbench||t.atlas60Lab||t.atlas61Lab).family||'Farklı soru tarzı']));
 const byOutcome=new Map();for(const t of tracked){const c=t.ogrenme_ciktisi;if(!byOutcome.has(c))byOutcome.set(c,[]);byOutcome.get(c).push(t)}
 const $=id=>document.getElementById(id);
 const E=(tag,parent,content,className)=>{const x=document.createElement(tag);if(className)x.className=className;if(content!=null)x.textContent=String(content);parent?.appendChild(x);return x};
 const saved=()=>{try{return JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')||{}}catch{return {}}};
 const now=()=>Number.isFinite(window.__atlas64TestNow)?window.__atlas64TestNow:Date.now();
 const validEvents=()=>api.getEvents().filter(e=>indexed.has(e.taskId)&&e.when<=now()&&e.when>=now()-30*MS);
 function pickOther(origin,events,done,chosen=new Set()){
  if(!origin)return null;
  const mine=families.get(origin.id),options=(byOutcome.get(origin.ogrenme_ciktisi)||[])
    .filter(t=>t.id!==origin.id&&families.get(t.id)!==mine&&!chosen.has(t.id));
  const count=new Map(),last=new Map();for(const e of events){count.set(e.taskId,(count.get(e.taskId)||0)+1);last.set(e.taskId,Math.max(last.get(e.taskId)||0,e.when))}
  options.sort((a,b)=>{
   const score=t=>(done[t.id]?0:100)+(count.has(t.id)?0:30)-(count.get(t.id)||0)*8;
   return score(b)-score(a)||a.id.localeCompare(b.id,'tr');
  });
  return options[0]||null;
 }
 function recommend(grade,max=4){
  const events=validEvents(),done=saved(),g=String(grade);
  const problem=new Map();
  for(const ev of events){if(!['wrong','hint'].includes(ev.status))continue;
   const task=indexed.get(ev.taskId);if(!task||String(task.sinif)!==g||!families.has(task.id))continue;
   const code=task.ogrenme_ciktisi;
   if(!problem.has(code))problem.set(code,{code,task,wrong:0,hints:0,last:0});
   const v=problem.get(code);v[ev.status==='wrong'?'wrong':'hints']++;if(ev.when>=v.last){v.last=ev.when;v.task=task}if(ev.status==='wrong'&&(!v.lastWrong||ev.when>=v.lastWrong.when))v.lastWrong=ev
  }
  const ordered=[...problem.values()].sort((a,b)=>(b.wrong*3+b.hints*2)-(a.wrong*3+a.hints*2)||b.last-a.last);
  const result=[],chosen=new Set();
  for(const p of ordered){const target=pickOther(p.task,events,done,chosen);if(!target)continue;
   chosen.add(target.id);result.push({kind:'practice',sourceId:p.task.id,sourceFamily:families.get(p.task.id),targetId:target.id,targetFamily:families.get(target.id),code:p.code,wrong:p.wrong,hints:p.hints,alreadyDone:!!done[target.id],focus:p.lastWrong?.focus||null,
    wrongFields:p.lastWrong?.wrongFields||[]});
   if(result.length>=max)return result;
  }
  // If no error evidence exists, recommend new tasks without labelling anyone unsuccessful.
  if(!result.length){
   const seen=new Set();for(const t of tracked){if(String(t.sinif)!==g||seen.has(t.ogrenme_ciktisi))continue;
    if(done[t.id])continue;
    seen.add(t.ogrenme_ciktisi);chosen.add(t.id);result.push({kind:'discover',targetId:t.id,targetFamily:families.get(t.id),code:t.ogrenme_ciktisi,alreadyDone:false});
    if(result.length>=Math.min(3,max))break;
   }
  }
  return result;
 }
 function launch(id){const t=indexed.get(id);if(!t)return false;const dialog=$('atlas64Dashboard');if(dialog&&!dialog.hidden){$('atlas64Close')?.click()}window.MatematikAtlasV30?.navigate(t);return true}
 function insertCoach(container,grade){
  const choices=recommend(grade),area=E('section',container,null,'atlas612-coach');area.id='atlas612Coach';
  const heading=E('div',area,null,'atlas612-heading');E('h3',heading,'🎯 Bana uygun sonraki adım');E('span',heading,'Doğrulanmış denemeler','atlas612-label');
  E('p',area,'Öneriler yalnızca bu cihazın doğrulanmış görev denemelerine dayanır. Hata adımı biliniyorsa gösterilir; kavram yanılgısı veya ustalık tanısı değildir.','atlas612-intro');
  if(!choices.length){E('p',area,'Bu sınıfta öneri sunulabilen yeni pilot görev kalmadı. Tamamlanma ve tekrar durumunu aşağıdan görebilirsin.','atlas612-empty');return}
  for(const c of choices){const r=E('article',area,null,'atlas612-card');const content=E('div',r,null,'atlas612-cardbody');E('b',content,c.code+' · '+c.targetFamily);
   if(c.kind==='practice'){
    E('p',content,'Bu kazanımdaki “'+c.sourceFamily+'” çalışmalarında '+c.wrong+' yanlış, '+c.hints+' ipucu kaydı var. Şimdi başka bir yöntem dene.','atlas612-reason');
    let task=indexed.get(c.sourceId),labels=task?.atlas63Pilot?.fields?.map(f=>f.label)||[];
    const identified=c.wrongFields.map(i=>labels[i]).filter(Boolean);
    const focusText=c.focus==='model'?'Görsel veya işlem modelini kurma':c.focus==='hesap'?'Sayısal sonucu hesaplama':c.focus==='karar'?'Matematiksel karar verme':c.focus==='adimlar'?'Çok adımlı çözüm':' ';
    if(identified.length)E('p',content,'Son yanlış alan(lar): '+identified.join(' · '),'atlas613-insight');
    else if(focusText.trim())E('p',content,'Yeniden bakılacak bölüm: '+focusText,'atlas613-insight');
   }else E('p',content,'Bu soru tarzını keşfederek başla. Henüz yanlış kaydı bulunmuyor.','atlas612-reason');
   if(c.alreadyDone)E('small',content,'Bu görev daha önce tamamlanmış; pekiştirme için yeniden çözülebilir.');
   const b=E('button',r,'Farklı soruyu aç →','atlas612-open');b.type='button';b.setAttribute('data-atlas612-open',c.targetId);b.onclick=()=>launch(c.targetId);
  }
  E('p',area,'Görev seçmek tamamlama veya tekrar başarısı üretmez. Farklı soru ailesi aynı alt beceri demek olmayabilir; program eşleşmeleri öğretmen editörlüğü bekliyor.','atlas612-foot');
 }
 document.addEventListener('atlas:learningdashboard',e=>insertCoach(e.detail.container,e.detail.grade));
 const anchor=$('atlasPlayingTop');const inline=E('aside',null,null,'atlas612-inline');inline.id='atlas612Inline';inline.hidden=true;inline.setAttribute('aria-live','polite');anchor?.insertAdjacentElement('afterend',inline);
 document.addEventListener('atlas:taskrender',()=>{inline.hidden=true;inline.replaceChildren();anchor?.insertAdjacentElement('afterend',inline)});
 document.addEventListener('atlas:attemptlogged',e=>{
  const id=e.detail.taskId;if(e.detail.status!=='wrong'||!anchor||anchor.hidden)return;
  if(window.Atlas617Tutor?.supports(id))return; // v6.17 has a targeted mini-lesson; avoid duplicate advice cards.
  const t=indexed.get(id);if(!t||!families.has(id))return;
  const wrong=validEvents().filter(a=>a.taskId===id&&a.status==='wrong').length;
  if(wrong<2)return;
  const candidate=pickOther(t,validEvents(),saved());if(!candidate)return;
  inline.replaceChildren();E('strong',inline,'Başka bir yoldan deneyelim mi?');
  const latest=[...validEvents()].reverse().find(a=>a.taskId===id&&a.status==='wrong');
  const steps=t.atlas63Pilot?.fields||[],incorrect=(latest?.wrongFields||[]).map(i=>steps[i]?.label).filter(Boolean);
  const focus=latest?.focus==='model'?'Modeli kurma aşamasını':latest?.focus==='hesap'?'Sayısal hesabı':latest?.focus==='adimlar'?'Çok adımlı çözümü':null;
  if(incorrect.length)E('span',inline,'Son yanlış alan: '+incorrect.slice(0,3).join(' · '),'atlas613-insight');
  else if(focus)E('span',inline,'Birlikte yeniden inceleyelim: '+focus,'atlas613-insight');
  E('span',inline,'Aynı kazanımdaki farklı “'+families.get(candidate.id)+'” soru tarzını deneyebilirsin. Mevcut soruya da devam edebilirsin.');
  const btn=E('button',inline,'Farklı soru aç →');btn.type='button';btn.onclick=()=>launch(candidate.id);
  const activeLab=[...document.querySelectorAll('#atlas611Lab,#atlas610Lab,#atlas69Lab,#atlas68Lab,#atlas63PilotLab')].find(x=>!x.hidden);
  if(activeLab)activeLab.appendChild(inline);
  inline.hidden=false;
 });
 window.MatematikAtlas612={recommend,forTask:(id)=>{const t=indexed.get(id);return t&&pickOther(t,validEvents(),saved())?.id||null},launch,trackedCount:tracked.length};
})();
