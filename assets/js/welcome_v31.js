/* v3.1 in-game presentation layer; keeps all completion and task storage keys intact. */
(()=>{
'use strict';
const q=id=>document.getElementById(id);
const body=document.body;
if(!q('atlasTaskState')||!q('atlasShowInfo')||!window.ATLAS_DB)return;
const btn=q('atlasShowInfo'),extra=q('atlasTaskExtra');
function toggleInfo(open){body.classList.toggle('atlas-help-open',open);btn.setAttribute('aria-pressed',String(open));btn.textContent=open?'ⓘ Ayrıntıları gizle':'ⓘ Ayrıntılar';extra.hidden=!open;}
toggleInfo(false);
btn.addEventListener('click',()=>toggleInfo(!body.classList.contains('atlas-help-open')));
const taskMap=new Map(window.ATLAS_DB.tasks.map(x=>[String(x.id),x]));
function progressMap(){try{return JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')||{}}catch{return {}}}
function reflect(ev){const task=taskMap.get(String(ev.detail?.id||''));if(!task)return;const completed=!!progressMap()[task.id];const state=q('atlasTaskState');state.textContent=completed?'✓ Tamamlandı! İstersen sonraki göreve geç.':'★ Önce düşün, sonra modelini dene.';state.dataset.done=String(completed);
 // Compact progress is accessible at the bottom rather than repeated onscreen.
 const details=q('atlasProgressDetails');if(details)details.open=false;
 toggleInfo(false);
}
document.addEventListener('atlas:taskrender',reflect);
/* Game callbacks generally update the progress label during render. Keep badge in sync when they do not. */
new MutationObserver(()=>{
 if(!body.classList.contains('atlas-playing'))return;
 const current=String(localStorage.getItem('mathAtlasV30LastTask')||'');const data=taskMap.get(current);if(!data)return;
 const state=q('atlasTaskState'),yes=!!progressMap()[current];
 state.textContent=yes?'✓ Tamamlandı! İstersen sonraki göreve geç.':'★ Önce düşün, sonra modelini dene.';
 state.dataset.done=String(yes);
}).observe(q('donecount'),{childList:true,characterData:true,subtree:true});
})();
