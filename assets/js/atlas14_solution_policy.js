/* Matematik Atlası v1.4 — üç yanlış sonrası isteğe bağlı çözüm.
   Yalnız doğrulayıcıdan gelen yanlış denemeler sayılır; boş cevaplar sayılmaz.
   Sayfa içinde geçmiş 3 yanlış aynı görev ve içerik sürümü için sayılır.
   Çözüm görüntüleme tamamlanma/başarı kaydı oluşturmaz. */
(()=>{'use strict';
 const KEY='atlas14VerifiedWrongByTask',LIMIT=3;
 const db=window.ATLAS_DB;
 if(!db)return;
 const byId=new Map(db.tasks.map(t=>[String(t.id),t]));
 let cache={};try{let obj=JSON.parse(localStorage.getItem(KEY)||'{}');if(obj&&typeof obj==='object'&&!Array.isArray(obj))cache=obj}catch(_){cache={}}
 let currentId=null,queuedId=null;
 const button=()=>document.getElementById('rubric');
 const revision=t=>String(t.atlas626?.revision||t.atlas662?.revision||t.atlas664?.revision||t.atlas663?.revision||t.atlas658?.revision||t.atlas657?.revision||t.atlas656?.revision||t.atlas655?.revision||t.atlas664?.version||'v1.3');
 const key=t=>String(t.id)+'::'+revision(t);
 function completed(t){try{const done=JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}');if(done[t.id]!==true)return false;
    if(t.atlas626){const v=JSON.parse(localStorage.getItem('mathAtlas626Done')||'{}');if(v[t.id]!==t.atlas626.revision)return false}
    if(t.atlas662){const v=JSON.parse(localStorage.getItem('mathAtlas662Done')||'{}');if(v[t.id]!==t.atlas662.revision)return false}
    return true;
   }catch(_){return false}}
 const attempts=t=>Math.min(LIMIT,Number(cache[key(t)])||0);
 const canShow=(t,alreadyDone)=>Boolean(t&&(attempts(t)>=LIMIT||alreadyDone===true));
 let note=document.getElementById('atlas14MistakeStatus');
 if(!note){note=document.createElement('p');note.id='atlas14MistakeStatus';note.setAttribute('role','status');note.setAttribute('aria-live','polite');note.className='atlas14-mistake-status';
 const b=button();if(b)b.closest('.flex')?.insertAdjacentElement('afterend',note)}
 function refresh(){const t=byId.get(currentId||'');const b=button();if(!t||!b)return;
   const n=attempts(t),ready=canShow(t,completed(t));b.disabled=!ready;
   b.textContent=ready?'📖 Çözümü Göster':'📖 Çözümü Göster ('+n+'/3 yanlış)';
   note.textContent=ready?(n>=LIMIT?'Üç yanlış deneme yapıldı. Çözümü inceleyebilir, ardından yeniden deneyebilirsin.':'Görev tamamlandı; çözümü inceleyebilirsin.'):(n===0?'Çözüm, aynı görevde üç yanlış denemeden sonra açılır. Boş cevap sayılmaz.':n+' yanlış deneme · çözüm için '+(LIMIT-n)+' yanlış deneme daha.');
 }
 function registerWrong(id){if(!id||!byId.has(id)||id!==currentId||queuedId===id)return;
   queuedId=id;
   queueMicrotask(()=>{queuedId=null;if(currentId!==id)return;const t=byId.get(id),k=key(t);
     cache[k]=Math.min(LIMIT,(Number(cache[k])||0)+1);
     try{localStorage.setItem(KEY,JSON.stringify(cache))}catch(_){}refresh();
   });
 }
 document.addEventListener('atlas:taskrender',e=>{currentId=String(e.detail?.id||'');refresh()});
 document.addEventListener('atlas:legacyfeedback',e=>{if(e.detail?.status==='wrong')registerWrong(String(e.detail.taskId||''))});
 document.addEventListener('atlas:attemptlogged',e=>{if(e.detail?.status==='wrong')registerWrong(String(e.detail.taskId||''))});
 // No artificial wrong event, success or progress credit is created when a solution is opened.
 function solutionViewed(t){if(window.MatematikAtlas64?.log)window.MatematikAtlas64.log({taskId:t.id,status:'hint',family:'Üç yanlış sonrası çözüm',evidence:'legacy-action'});}
 window.ATLAS_SOLUTION_POLICY={attempts,canShow,solutionViewed,refresh};
 const active=document.getElementById('grade');if(active){const q=byId.get(String(window.__atlasActiveTaskId||''));if(q)currentId=q.id;}refresh();
})();
