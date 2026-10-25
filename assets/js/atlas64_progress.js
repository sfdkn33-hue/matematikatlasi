/* Matematik Atlası v6.4 — cihaz-içi deneme kanıtı ve aralıklı tekrar önerileri.
   Yalnızca atlas63Pilot doğrulayıcısından gelen denemeleri ölçer.
   Eski tamamlanma kayıtlarından ustalık / ipucusuz başarı türetilmez.
   Kişisel bilgi toplamaz; ağ isteği göndermez. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id), db=window.ATLAS_DB;
 const dialog=$('atlas64Dashboard'), body=$('atlas64Body'), chooser=$('atlas64Grade');
 if(!db||!dialog||!body||!chooser)return;
 const KEY='mathAtlas64Attempts',PROGRESS='mathAtlas940Done',MS=86400000,STEPS=[1,7,21],MIN_GAPS=[1,6,14];
 let volatileHistory=null; // unsaved attempts retained in memory for emergency JSON export
 const taskMap=new Map(db.tasks.map(t=>[t.id,t]));
 const isTagged=t=>!!(t.atlas63Pilot||t.atlas610Workbench||t.atlas611Workbench||t.atlas60Lab||t.atlas61Lab);
 const tagged=db.tasks.filter(isTagged);
 const allTrackable=db.tasks; // all have a verified completion path; diagnostic error tracking remains limited.
 const familyOf=t=>t.atlas63Pilot?.family||t.atlas610Workbench?.family||t.atlas611Workbench?.family||
  (t.atlas60Lab?'v6.0 · '+t.atlas60Lab.kind+' · '+(t.atlas60Lab.variant??t.gorev_no%5):'')||
  (t.atlas61Lab?'v6.1 · '+t.atlas61Lab.family+' · '+t.atlas61Lab.kind:'')||'Etiketlenmemiş';
 const byCode=new Map();for(const t of db.tasks){if(!byCode.has(t.ogrenme_ciktisi))byCode.set(t.ogrenme_ciktisi,[]);byCode.get(t.ogrenme_ciktisi).push(t)}
 const readJSON=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||fallback}catch(e){return fallback}};
 const store=items=>{const encoded=JSON.stringify(items);try{localStorage.setItem(KEY,encoded);if(localStorage.getItem(KEY)!==encoded)throw Error('Kayıt doğrulanamadı');volatileHistory=null;return true}catch(e){volatileHistory=items;document.dispatchEvent(new CustomEvent('atlas:storagefailure',{detail:{area:'tekrar geçmişi'}}));return false}};
 const now=()=>Number.isFinite(window.__atlas64TestNow)?window.__atlas64TestNow:Date.now();
 const dateText=stamp=>new Date(stamp).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'});
 const outcomes=new Map(db.outcomes.map(o=>[o.kod,o]));
 let lastFocus=null;
 const E=(tag,parent,value,cls)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(value!==undefined&&value!==null)el.textContent=String(value);if(parent)parent.appendChild(el);return el};
 const completed=()=>readJSON(PROGRESS,{});
 const history=()=> (volatileHistory||readJSON(KEY,[])).filter(e=>e&&taskMap.has(e.taskId)&&Number.isFinite(e.when)&&['wrong','correct','hint'].includes(e.status));
 function log(data){
  if(!data||!taskMap.has(String(data.taskId))||!['wrong','correct','hint'].includes(data.status))return false;
  const items=history();items.push({taskId:String(data.taskId),status:data.status,when:now(),family:String(data.family||''),wrongFields:Array.isArray(data.wrongFields)?data.wrongFields.filter(x=>Number.isInteger(x)).slice(0,12):[],firstTry:data.firstTry===true,hintUsed:data.hintUsed===true,wrongCount:Number(data.wrongCount)||0,automatic:data.automatic===true,
   focus:['model','hesap','karar','adimlar'].includes(data.focus)?data.focus:null,
   fieldKey:/^[a-zA-Z]{1,30}$/.test(data.fieldKey||'')?data.fieldKey:null,
   evidence:data.evidence==='completion-only'?'completion-only':(data.evidence==='legacy-action'?'legacy-action':(data.evidence==='module-validator'?'module-validator':(isTagged(taskMap.get(String(data.taskId)))?'detailed':'basic')))});
  // Keep local data bounded. This cap is visible and documented, not silent mastery evidence.
  const saved=store(items.slice(-10000));
  if(saved)document.dispatchEvent(new CustomEvent('atlas:attemptlogged',{detail:{taskId:String(data.taskId),status:data.status}}));
  return saved;
 }
 // v6.7: A qualified review requires a due timestamp AND a NEW calendar day.
 // Earlier completions stay intact; existing historic evidence is recalculated, not blindly trusted.
 const dayKey=stamp=>{const d=new Date(stamp);return [d.getFullYear(),d.getMonth()+1,d.getDate()].join('-')};
 function state(taskId,events=current){
  const nowMs=now();
  const ev=events.filter(e=>e.taskId===taskId && Number.isFinite(e.when) && e.when<=nowMs)
    .sort((a,b)=>a.when-b.when);
  const ok=ev.filter(e=>e.status==='correct');
  const base=ok[0];
  const future=events.some(e=>e.taskId===taskId&&Number.isFinite(e.when)&&e.when>nowMs+5*60*1000);
  if(!base)return {phase:future?'clockWarning':'notStarted',due:null,steps:0,hasWrong:ev.some(e=>e.status==='wrong'),attempts:ev.length,first:null,clockWarning:future};
  let steps=0;
  const first=base.when;
  let lastQualified=first;
  let lastDay=dayKey(first);
  // Scheduled milestones target days 1, 7, 21 after initial success, and also
  // require minimum gaps of 1, 6, and 14 days after the prior credited proof.
  // Crucially each credited event must occur on a later LOCAL calendar day
  // than the last credited event (never three successes on the same day).
  for(const e of ok.slice(1)){
   if(steps===STEPS.length)break;
   const eligible=e.when>=Math.max(first+STEPS[steps]*MS,lastQualified+MIN_GAPS[steps]*MS) &&
    e.when>lastQualified && dayKey(e.when)!==lastDay &&
    e.firstTry===true && !e.hintUsed && Number(e.wrongCount||0)===0;
   if(!eligible)continue;
   steps++;
   lastQualified=e.when;
   lastDay=dayKey(e.when);
  }
  const due=steps===STEPS.length?null:Math.max(first+STEPS[steps]*MS,lastQualified+MIN_GAPS[steps]*MS);
  const phase=future?'clockWarning':steps===3?'complete':due<=nowMs?'due':'scheduled';
  return {phase,due,steps,first,lastQualified,attempts:ev.length,
    hasWrong:ev.some(e=>e.status==='wrong'),assisted:!!base.hintUsed,clockWarning:future};
 }
 let current=[];
 function refresh(){current=history();draw()}
 function mini(label,value,container){const b=E('div',container,null,'atlas64-metric');E('b',b,value);E('span',b,label)}
 function taskButton(container,t,label){const b=E('button',container,label,'atlas64-task-button');b.type='button';b.onclick=()=>{close();window.MatematikAtlasV30?.navigate(t)};return b}
 function draw(){
  body.replaceChildren();const grade=String(chooser.value),items=db.tasks.filter(t=>String(t.sinif)===grade),typed=tagged.filter(t=>String(t.sinif)===grade),done=completed(),recs=typed.map(t=>({t,s:state(t.id)}));
  const doneCount=items.filter(t=>done[t.id]).length;
  const reviews=recs.filter(x=>x.s.phase==='due');const future=recs.filter(x=>x.s.phase==='scheduled');const earned=recs.filter(x=>x.s.phase==='complete');const fresh=recs.filter(x=>x.s.phase==='notStarted');
  const metrics=E('div',body,null,'atlas64-metrics');mini('Tamamlanan görev',doneCount+' / '+items.length,metrics);mini('Ayrıntılı ölçülen görev',typed.length,metrics);mini('Yeni doğrulanmış kayıt',new Set(current.filter(e=>e.status==='correct'&&String(taskMap.get(e.taskId)?.sinif)===grade).map(e=>e.taskId)).size,metrics);mini('Tekrar zamanı gelen',reviews.length,metrics);mini('Üç aşama tekrarı biten',earned.length,metrics);
  document.dispatchEvent(new CustomEvent('atlas:learningdashboard',{detail:{container:body,grade}}));
  E('p',body,'Yeni doğru tamamlanmalar tüm görevlerde doğrulanmış kayıt olayına dönüşür. 471 görevde ayrıntılı aşama kaydı; eski ana ve seçili özel laboratuvarlarda yalnız doğrulayıcıya bağlı gözlenen yanlış ve ipuçları izlenir. Ölçülmemiş denemeler hatasız sayılmaz.','atlas64-explain');
  const legacyEvents=current.filter(e=>['legacy-action','module-validator'].includes(e.evidence)&&String(taskMap.get(e.taskId)?.sinif)===grade);
  const observed=E('p',body,'Bu cihazda eski ana ve özel laboratuvarlardan gözlenen olaylar: '+legacyEvents.filter(e=>e.status==='wrong').length+' yanlış kontrol · '+legacyEvents.filter(e=>e.status==='hint').length+' ipucu. Bu kayıtlar yalnız gözlenen tıklamalardır; kavram yanılgısı tanısı değildir.','atlas64-explain');
  const p=E('p',body,'İlk tamamlama ustalık belgesi değildir. 1., 7. ve 21. gün tekrarları yalnızca zamanı geldiğinde, birbirinden farklı takvim günlerinde ve ilk denemede ipucusuz doğruysa ilerler. Cihaz saati bağımsız doğrulanmaz.','atlas64-explain');
  const list=E('section',body,null,'atlas64-section');E('h3',list,'📆 Pekiştirme sırası');
  const clockIssues=recs.filter(x=>x.s.phase==='clockWarning');
  if(clockIssues.length)E('p',list,'⚠ Cihaz saati geçmiş kayıtlarla çelişiyor. Tarih ve saati kontrol et; tekrar aşamaları şimdilik ilerletilmiyor.','atlas64-error-row');
  const targets=[...reviews,...clockIssues,...fresh,...future].slice(0,8);
  if(targets.length===0){E('p',list,'Bu sınıfta henüz otomatik deneme kaydı tutulan görev yok. Mevcut ilerlemen silinmedi.','atlas64-empty');}
  for(const {t,s} of targets){const r=E('div',list,null,'atlas64-task-row');const info=E('div',r);E('strong',info,t.ogrenme_ciktisi+' · '+t.baslik);E('small',info,s.phase==='due'?'Tekrar zamanı geldi. '+(s.steps+1)+'. aşama · ipucusuz ilk deneme':s.phase==='notStarted'?'Yeni görev · başlangıç ölçümü':s.phase==='clockWarning'?'Cihaz tarihini kontrol et · tekrar kanıtı beklemede': 'Tekrar tarihi: '+dateText(s.due));taskButton(r,t,s.phase==='due'?'Tekrar çöz →':'Göreve git →')}
  if(future.length>0){E('p',list,future.length+' görev gelecekteki tekrar tarihini bekliyor. Tekrarın erken yapılması aralıklı tekrar aşamasını ilerletmez.','atlas64-small')}
  const err=E('section',body,null,'atlas64-section');E('h3',err,'🔎 Hata ve ipucu izleri');
  const recent=current.filter(e=>String(taskMap.get(e.taskId)?.sinif)===grade&&e.when>=now()-30*MS),stats=new Map();
  for(const ev of recent){const fam=['legacy-action','module-validator'].includes(ev.evidence)?(ev.family||'Eski görev · gözlenen deneme'):familyOf(taskMap.get(ev.taskId)||{});if(!stats.has(fam))stats.set(fam,{wrong:0,hints:0,correct:0});stats.get(fam)[ev.status==='wrong'?'wrong':ev.status==='hint'?'hints':'correct']++}
  const mistakes=[...stats].filter(([f,s])=>s.wrong||s.hints).sort((a,b)=>(b[1].wrong+b[1].hints)-(a[1].wrong+a[1].hints));
  if(!mistakes.length)E('p',err,'Son 30 güne ait etiketli görevlerde hata veya ipucu kaydı yok. Bu, henüz çözümlenmeyen diğer görevlerin hatasız olduğu anlamına gelmez.','atlas64-empty');
  for(const [name,n] of mistakes.slice(0,6)){const p=E('p',err,null,'atlas64-error-row');E('b',p,name);E('span',p,'Yanlış deneme: '+n.wrong+' · İpucu: '+n.hints+' · Doğru: '+n.correct)}
  const section=E('section',body,null,'atlas64-section');E('h3',section,'📚 Kazanım ve soru tarzı envanteri');
  E('p',section,'Deneme kaydı yalnızca güvenilir otomatik doğrulayıcısı ölçüme bağlanan görevlerde vardır. Etiketler, resmî alt beceri tanısı değildir; diğer görevler sınıflandırma ve ölçüm bekliyor.','atlas64-small');
  const table=E('div',section,null,'atlas64-table');
  const head=E('div',table,null,'atlas64-tr atlas64-th');['Kazanım','Görev / tamamlanan','Etiketlenen / tür'].forEach(x=>E('span',head,x));
  const gradeOutcomes=db.outcomes.filter(o=>String(o.sinif)===grade);
  for(const o of gradeOutcomes){const tasks=byCode.get(o.kod)||[],tag=tasks.filter(isTagged),families=new Set(tag.map(familyOf)),r=E('div',table,null,'atlas64-tr');const a=E('div',r);E('b',a,o.kod);E('small',a,o.etiket);E('span',r,tasks.length+' / '+tasks.filter(t=>done[t.id]).length);const last=E('span',r,tag.length+' etiketli · '+families.size+' tür');if(!tag.length)last.title='Soru türü/alt beceri sınıflandırması bekleniyor'}
  const foot=E('p',body,'Sadece bu cihazın kaydıdır. Bu panel ne resmî sınav ölçümü ne de bir öğretmen tarafından onaylanan ustalık raporudur.','atlas64-foot');
 }
 function open(){lastFocus=document.activeElement;chooser.value=localStorage.getItem('mathAtlasV30Grade')||document.getElementById('grade')?.value||'5';dialog.hidden=false;document.body.classList.add('atlas64-open');refresh();$('atlas64Close')?.focus()}
 function close(){dialog.hidden=true;document.body.classList.remove('atlas64-open');if(lastFocus?.isConnected)lastFocus.focus()}
 $('atlas64OpenHome').onclick=open;$('atlas64OpenTask').onclick=open;$('atlas64Close').onclick=close;$('atlas64Refresh').onclick=refresh;chooser.onchange=draw;
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Tab'){const f=[...dialog.querySelectorAll('button,select')].filter(el=>!el.disabled);if(!f.length)return;if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()}}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.hidden)close()});
 document.addEventListener('atlas:verifiedsave',e=>{for(const id of e.detail?.taskIds||[]){if(!taskMap.has(id)||isTagged(taskMap.get(id)))continue;log({taskId:id,status:'correct',family:'Doğrulanmış görev tamamlanması',automatic:true,firstTry:false,hintUsed:false,wrongCount:0,evidence:'completion-only'});}});
 const API={log,refresh,isDetailed:id=>isTagged(taskMap.get(String(id))||{}),getEvidenceCoverage:()=>({eligible:allTrackable.length,detailed:tagged.length}),hasAttemptsToday:(id)=>history().some(e=>e.taskId===id && (e.status==='wrong'||e.status==='hint') && new Date(e.when).toDateString()===new Date(now()).toDateString()),calculate:(id)=>state(id,history()),getEvents:()=>history(),getSummary:(grade)=>{const all=tagged.filter(t=>String(t.sinif)===String(grade));return {tagged:all.length,reviewDue:all.filter(t=>state(t.id,history()).phase==='due').length}}};
 window.MatematikAtlas64=API;
})();
