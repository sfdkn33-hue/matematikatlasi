/* Matematik Atlası v6.16 — doğrulayıcıya bağlı modüler hata/ipucu kanıtı.
 * Doğru ve yanlış matematik kararını modülün kendi doğrulayıcısı verir.
 * Bu katman yalnız görünür bir öğrenci eylemini raporlar; boş formu hata saymaz.
 * Kavram yanılgısı veya başarı/ustalık sonucu üretmez.
 */
(()=>{
 'use strict';
 const api=window.MatematikAtlas64,db=window.ATLAS_DB;
 if(!api||!db)return;
 const modules={
  geometry5PlusLab:'5. sınıf geometri modelleri',fraction5PlusLab:'5. sınıf kesir modelleri',
  number5PlusLab:'5. sınıf sayılar ve nicelikler',geometry6Lab:'6. sınıf geometrik şekiller',
  atlas7Transform:'7. sınıf geometrik dönüşümler',atlas7Algebra:'7. sınıf cebir ve ilişkiler',
  atlas50Lab:'v5.0 keşif laboratuvarı',atlas51Lab:'v5.1 model laboratuvarı',
  atlas52Lab:'v5.2 olasılık ve grafik',atlas54Lab:'v5.4 muhakeme ve çok adımlı çözüm'
 };
 const ids=new Set(db.tasks.map(t=>String(t.id)));
 let taskId=null,interacted=false,lastWrongStamp=0;
 const rootIds=new Set(Object.keys(modules));
 function matchModule(target){
   let el=target instanceof Element?target:null;
   while(el){if(rootIds.has(el.id)&&!el.hidden&&getComputedStyle(el).display!=='none')return el;el=el.parentElement;}
   return null;
 }
 function isEligible(id){return id&&id===taskId&&ids.has(id)&&!api.isDetailed?.(id);}
 function record(task,status,family,meta={}){
   const id=String(task?.id||'');if(!isEligible(id))return false;
   if(status==='wrong'&&!interacted)return false;
   // One real mathematical wrong result is recorded once by its module validator.
   if(status==='wrong'&&performance.now()-lastWrongStamp<45)return false;
   if(status==='wrong')lastWrongStamp=performance.now();
   return api.log({taskId:id,status,family:family||'Özel oyun · gözlenen deneme',
     evidence:'module-validator',firstTry:false,hintUsed:status==='hint',automatic:true,
     focus:meta.focus||null,fieldKey:meta.fieldKey||null,wrongFields:Array.isArray(meta.wrongFields)?meta.wrongFields:[]});
 }
 document.addEventListener('atlas:taskrender',e=>{
   taskId=String(e.detail?.id||'');interacted=false;lastWrongStamp=0;
 });
 // User-initiated input is needed before logging a failed model; simply opening/checking
 // an untouched model or resetting it does not fabricate wrong-attempt evidence.
 for(const event of ['input','change','click','pointerup'])document.addEventListener(event,e=>{
   const root=matchModule(e.target);if(!root||!taskId)return;
   const button=e.target.closest?.('button');
   const label=(button?.textContent||'').trim().toLocaleLowerCase('tr-TR');
   if(event==='click'&&button&&label.includes('ipucu')){
     const task=db.tasks.find(t=>String(t.id)===taskId);
     if(task&&isEligible(taskId))record(task,'hint',modules[root.id]);
     return;
   }
   if(button&&(label.includes('yeniden')||label.includes('sıfırla')||label.includes('baştan'))){interacted=false;return;}
   if(button&&(label.includes('doğrula')||label.includes('kontrol')||label.includes('ipucu')||label.includes('geri')))return;
   if(event==='click'&&e.target.matches?.('input,textarea,select,option'))return;
   if(event==='pointerup'&&!e.target.closest?.('svg,canvas,[role=slider],input[type=range]'))return;
   if(e.target.matches?.('textarea'))return; // Free-text notes are not machine-graded math evidence.
   if(['input','change'].includes(event)&&e.target.matches?.('input:not([type=range]),select')&&!String(e.target.value||'').trim())return;
   // Only interaction with a visible, active module counts. An attempt without a choice
   // or entered value is still allowed to give feedback, but is not an observed error.
   if(isEligible(taskId))interacted=true;
 },true);
 window.Atlas616Trace={wrong:(task,family,meta)=>record(task,'wrong',family,meta),
   version:'6.16',modules:Object.keys(modules),coverage:'observed-actions-only'};
})();