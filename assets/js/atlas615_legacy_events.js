/* Matematik Atlası v6.15 — eski görevlerde doğrulanan yanlış ve ipucu olayları.
   Yalnız kullanıcı kontrol eylemine bağlı olaylar kaydedilir. Kavram teşhisi/ustalık türetilmez.
   Ayrıntılı doğrulayıcıları yeniden ölçmez. */
(()=>{
 'use strict';
 const DB=window.ATLAS_DB,api=window.MatematikAtlas64;
 if(!DB||!api)return;
 const known=new Map(DB.tasks.map(t=>[t.id,t]));
 let activeId=null,lastVerify=null;
 const verify=new Set(['check','studioVerify','numLabVerify','mlVerify','fxVerify','stVerify','abVerify','prVerify','ftCheck']);
 const hints=new Set(['hint','numLabHint','mlHint','fxHint','stHint','abHint','prHint','ftHint']);
 const families={check:'Ana cevap kontrolü',studioVerify:'Geometri çizim atölyesi',numLabVerify:'Sayı atölyesi',mlVerify:'Ölçme ve alan',fxVerify:'Kesir modelleri',stVerify:'İstatistik ve veri',abVerify:'Cebirsel model',prVerify:'Olasılık modeli',ftCheck:'Çarpanlar ve katlar'};
 const hintFor={hint:'check',numLabHint:'numLabVerify',mlHint:'mlVerify',fxHint:'fxVerify',stHint:'stVerify',abHint:'abVerify',prHint:'prVerify',ftHint:'ftCheck'};
 const attempted=new Map();
 function eligible(id){return !!(id&&known.has(id)&&!api.isDetailed?.(id))}
 document.addEventListener('atlas:taskrender',e=>{activeId=String(e.detail?.id||'');lastVerify=null});
 // Capturing click occurs before a task's own click handler, not after its DOM redraw.
 document.addEventListener('click',e=>{
  const button=e.target.closest?.('button');if(!button||!eligible(activeId)||button.closest('[hidden]'))return;
  const id=button.id;
  if(hints.has(id)){
   api.log({taskId:activeId,status:'hint',family:families[hintFor[id]]||'Eski görev · ipucu',evidence:'legacy-action'});
   return;
  }
  if(verify.has(id)){lastVerify={id:activeId,button:id,at:performance.now()};}
 },true);
 document.addEventListener('atlas:legacyfeedback',e=>{
  const id=String(e.detail?.taskId||'');
  if(!eligible(id)||id!==activeId||!lastVerify||lastVerify.id!==id)return;
  // A warning on screen is not automatically a wrong attempt; only one raised
  // during the actual Verify action and while that action is in progress counts.
  if(performance.now()-lastVerify.at>1500)return;
  api.log({taskId:id,status:'wrong',family:families[lastVerify.button]||'Eski görev · kontrol',evidence:'legacy-action'});
  lastVerify=null;
 });
 window.MatematikAtlas615={instrumentedVerifyIds:[...verify],instrumentedHintIds:[...hints],eligibleCount:DB.tasks.filter(t=>!api.isDetailed?.(t.id)).length,mode:'observed-only'};
})();
