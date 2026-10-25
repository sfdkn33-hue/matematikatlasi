
(()=>{
const db=window.ATLAS_DB,$=id=>document.getElementById(id);
const G=$('grade'),T=$('theme'),O=$('outcome');let taskIndex=0;let done={};
let draftAnswers={};try{draftAnswers=JSON.parse(localStorage.getItem('mathAtlasDraftAnswers')||'{}')||{}}catch(e){draftAnswers={}}
const saveDrafts=()=>{const payload=JSON.stringify(draftAnswers);try{localStorage.setItem('mathAtlasDraftAnswers',payload);if(localStorage.getItem('mathAtlasDraftAnswers')!==payload)throw Error('Taslak doğrulanamadı')}catch(e){document.dispatchEvent(new CustomEvent('atlas:storagefailure',{detail:{area:'taslak kayıtları'}}))}};
$('answer').addEventListener('input',()=>{const a=t();if(!a)return;draftAnswers[a.id]=$('answer').value;saveDrafts()});
function taskNavFocus(){$('title').focus({preventScroll:true})}

try{done=JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')}catch(e){}
const atlas614LastSaved=new Set(Object.entries(done).filter(([id,v])=>v===true).map(([id])=>id));
const themes=()=>db.themes.filter(a=>String(a.sinif)===G.value),currentTheme=()=>themes().find(a=>Number(a.tema_sirasi)===Number(T.value));
const currentOutcomes=()=>db.outcomes.filter(a=>String(a.sinif)===G.value&&Number(a.tema_sirasi)===Number(T.value));
const pack=()=>db.tasks.filter(t=>t.ogrenme_ciktisi===O.value), t=()=>pack()[taskIndex];
// v6.7: Success in mathematics must NOT be confused with success on persistent storage.
let atlasSaveFailed=false;
function atlasStorageBanner(){let b=document.getElementById('atlas67StorageBanner');if(b)return b;
 b=document.createElement('aside');b.id='atlas67StorageBanner';b.setAttribute('role','alert');b.setAttribute('aria-live','assertive');
 b.innerHTML='<strong>⚠ İlerlemen bu cihazda kaydedilemedi.</strong><p>Doğru yanıtın değerlendirildi, ancak sayfayı kapatırsan ilerlemen kaybolabilir. Mümkünse uygulamayı güvenilir bir HTTPS adresinde aç. Şimdi yedek dosyası oluşturabilirsin.</p><button type="button" id="atlas67Backup">📥 İlerlememi yedekle (JSON)</button><button type="button" id="atlas67BackupText">Yedek verisini göster</button><textarea id="atlas67BackupData" hidden readonly aria-label="Kopyalanabilir ilerleme yedeği"></textarea>';
 document.body.prepend(b);b.querySelector('#atlas67Backup').onclick=()=>atlasExportBackup(false);
 b.querySelector('#atlas67BackupText').onclick=()=>atlasExportBackup(true);return b;
}
function atlasExportBackup(asText){
 const payload={schema:'matematik-atlasi-v6.7-backup',exportedAt:new Date().toISOString(),completed:done,
   attempts:(window.MatematikAtlas64?.getEvents?.()||[]),drafts:draftAnswers};
 const encoded=JSON.stringify(payload,null,2);
 if(asText){const t=atlasStorageBanner().querySelector('#atlas67BackupData');t.hidden=false;t.value=encoded;t.focus();t.select();return}
 try{const url=URL.createObjectURL(new Blob([encoded],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='Matematik_Atlasi_ilerleme_yedegi.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
 catch(e){atlasExportBackup(true)}
}
window.MatematikAtlas67={backup:atlasExportBackup,storageHealthy:()=>!atlasSaveFailed};
const backupButton=document.createElement('button');backupButton.type='button';backupButton.id='atlas67ManualBackup';backupButton.textContent='📥 Yedek al';backupButton.title='Bu cihazdaki ilerlememi JSON olarak yedekle';backupButton.onclick=()=>atlasExportBackup(false);
const progressAnchor=document.getElementById('atlasProgressDetails');if(progressAnchor)progressAnchor.appendChild(backupButton);
document.addEventListener('atlas:storagefailure',()=>{atlasSaveFailed=true;atlasStorageBanner()});
const save=()=>{const encoded=JSON.stringify(done);
 try{localStorage.setItem('mathAtlas940Done',encoded);if(localStorage.getItem('mathAtlas940Done')!==encoded)throw Error('Kayıt geri okunamadı');
  const newlySaved=Object.keys(done).filter(id=>done[id]===true&&!atlas614LastSaved.has(id));
  for(const id of newlySaved)atlas614LastSaved.add(id);
  atlasSaveFailed=false;document.getElementById('atlas67StorageBanner')?.remove();
  if(newlySaved.length)document.dispatchEvent(new CustomEvent('atlas:verifiedsave',{detail:{taskIds:newlySaved}}));
  return true}
 catch(e){atlasSaveFailed=true;atlasStorageBanner();return false}
};
function setOptions(sel,items,current){sel.innerHTML='';if(!items.length){sel.disabled=true;return}sel.disabled=false;for(const a of items){const op=document.createElement('option');op.value=a.value;op.textContent=a.text;sel.appendChild(op)}if(current&&items.some(x=>String(x.value)===String(current)))sel.value=current}
function populateThemes(choose){const th=themes();setOptions(T,th.map(a=>({value:a.tema_sirasi,text:a.tema_sirasi+'. '+a.tema})),choose||th[0].tema_sirasi);populateOutcomes()}
function populateOutcomes(choose){const outs=currentOutcomes();setOptions(O,outs.map(a=>({value:a.kod,text:a.tema_cikti_sirasi+'. '+a.kod+' · '+a.etiket})),choose||outs[0].kod);taskIndex=0;render()}
function themeMap(){const box=$('themeMap');box.innerHTML='';for(const th of themes()){
 const codes=db.outcomes.filter(a=>String(a.sinif)===G.value&&Number(a.tema_sirasi)===Number(th.tema_sirasi)).map(a=>a.kod);
 const completed=db.tasks.filter(a=>codes.includes(a.ogrenme_ciktisi)&&done[a.id]).length;
 const goal=db.tasks.filter(a=>codes.includes(a.ogrenme_ciktisi)).length;const btn=document.createElement('button');btn.className='theme-step'+(Number(th.tema_sirasi)===Number(T.value)?' selected':'');
 btn.type='button';btn.setAttribute('aria-pressed',String(Number(th.tema_sirasi)===Number(T.value)));
 btn.innerHTML='<span class="step-num'+(completed===goal?' done':'')+'">'+(completed===goal?'✓':th.tema_sirasi)+'</span><span>'+th.tema+'<span class="step-meta">'+completed+'/'+goal+' görev'+(th.atlas_pilot?' · pilot':' · '+th.ders_saati+' ders saati')+'</span></span>';
 btn.onclick=()=>{T.value=th.tema_sirasi;populateOutcomes()};box.appendChild(btn)
}}
function render(){const list=pack();if(!list.length)return;taskIndex=Math.max(0,Math.min(taskIndex,list.length-1));const a=list[taskIndex],o=db.outcomes.find(x=>x.kod===a.ogrenme_ciktisi),th=currentTheme();
 $('desc').textContent=o.resmi_metin||o.etiket;$('themeInfo').textContent=th.atlas_pilot?'Pilot içerik · ders saatleri ve yıllık sıralama sonraki aşamada tamamlanacak':th.ders_saati+' ders saati · yaklaşık '+th.yaklasik_hafta+'. haftalar (5 saat/hafta hesabı)';
 $('lessonPlan').textContent=o.atlas_pilot?(o.curriculum_version+' · PİLOT · '+o.kod+' · '+th.tema):o.plan_sirasi+'. öğrenme çıktısı / '+db.outcomes.filter(x=>x.sinif===o.sinif).length+' · '+o.kod+' · '+th.tema;
 $('eyebrow').textContent=a.ogrenme_ciktisi+' · GÖREV '+a.gorev_no+'/'+pack().length+' · '+a.asama;
 $('title').textContent=a.baslik;$('question').textContent=a.gorev;$('question').hidden=!!(a.atlas611Workbench||a.atlas610Workbench||a.atlas69Workbench||a.atlas68Workbench||a.atlas63Pilot||a.atlas61Lab||a.atlas60Lab||a.atlas54||a.atlas55||a.atlas56||a.atlas57);$('mechanic').textContent=a.mekanik;$('level').textContent='Seviye '+a.seviye;
 $('answer').value=draftAnswers[a.id]||'';$('feedback').style.display='none';$('numbergrid').innerHTML='';$('legacyAnswer').hidden=!!(a.atlas611Workbench||a.atlas610Workbench||a.atlas69Workbench||a.atlas68Workbench||a.atlas63Pilot||a.atlas61Lab);
 for(const b of list){const btn=document.createElement('button');btn.textContent=b.gorev_no;btn.title='Görev '+b.gorev_no;btn.className=(b.gorev_no===a.gorev_no?'active ':'')+(done[b.id]?'done':'');btn.onclick=()=>{taskIndex=list.findIndex(x=>x.id===b.id);render();taskNavFocus()};$('numbergrid').appendChild(btn)}
$('prev').disabled=taskIndex===0;
 $('next').disabled=taskIndex===list.length-1;
 const count=list.filter(x=>done[x.id]).length;
 $('progress').textContent='Bu öğrenme çıktısı: '+count+'/'+pack().length+' · Toplam: '+db.tasks.filter(x=>done[x.id]).length+'/'+db.tasks.length+' görev. Tamamlanan görevler bu tarayıcıda saklanır.';
 $('donecount').textContent='✓ '+db.tasks.filter(x=>done[x.id]).length+' tamamlandı';
 const hasNext=db.outcomes.some(x=>x.sinif===o.sinif&&x.plan_sirasi>o.plan_sirasi);
 $('goNextOutcome').disabled=!hasNext;$('goNextOutcomeBottom').disabled=!hasNext;
 renderStudio(a);window.MatematikAtlasBonus?.render(a);window.MatematikAtlasChallenge?.render(a,!!done[a.id]);themeMap();document.dispatchEvent(new CustomEvent('atlas:taskrender',{detail:{id:a.id,grade:String(a.sinif),theme:Number(a.tema_sirasi),outcome:a.ogrenme_ciktisi,number:a.gorev_no,title:a.baslik}}))
}
function gateDone(a,finish){if(a.atlas61Lab){finish();return}if(window.MatematikAtlasChallenge?.gate(a,finish)===false){feedback('✅ İlk model doğru. Tamamlama için ikinci modeli de kontrol et.');return}finish()}
function feedback(str,ok=false){
 if(!ok && (/^🔎/u.test(str)||/^Tekrar dene[. !]/u.test(str)||/^Henüz tamamlanmadı[.! ]/u.test(str))){
  const active=t();if(active)document.dispatchEvent(new CustomEvent('atlas:legacyfeedback',{detail:{taskId:active.id,status:'wrong'}}));
 }
 if(ok&&atlasSaveFailed){ok=false;str='⚠ Matematiksel çözüm doğru, ancak ilerlemen kalıcı olarak kaydedilemedi. Üstteki yedekleme seçeneğini kullan.';}
 $('feedback').style.display='block';$('feedback').className='feedback '+(ok?'good':'warning');$('feedback').textContent=str
}
const norm=s=>String(s).toLocaleLowerCase('tr-TR').trim().replace(/\s+/g,' ').replace(/(?<!\d)[.!?]+$/g,'').replace(/,(?=\d)/g,'.');
function numericQuantity(raw){
 const s=String(raw).toLocaleLowerCase('tr-TR').trim().replace(/\s+/g,' ');
 const m=s.match(/^([+-]?(?:\d[\d\s.,]*\d|\d))\s*(°|derece|cm²|cm2|cm|m²|m2|m|kg|g|₺|tl|%)?$/u);
 if(!m)return null;
 let part=m[1].replace(/\s/g,''),unit=(m[2]||'').replace(/2$/,'²');
 if(unit==='derece')unit='°';if(unit==='tl')unit='₺';
 const values=[];const add=x=>{if(/^[-+]?\d+(?:\.\d+)?$/.test(x)){const n=Number(x);if(Number.isFinite(n)&&!values.includes(n))values.push(n)}};
 if(part.includes(',')&&part.includes('.')){
  if(part.lastIndexOf(',')>part.lastIndexOf('.'))add(part.replace(/\./g,'').replace(',','.'));
  else add(part.replace(/,/g,''));
 }else if(part.includes(',')){
  if((part.match(/,/g)||[]).length>1&&/^[-+]?\d{1,3}(?:,\d{3})+$/.test(part))add(part.replace(/,/g,''));
  else add(part.replace(',','.'));
 }else if(part.includes('.')){
  if(/^[-+]?\d{1,3}(?:\.\d{3}){2,}$/.test(part))add(part.replace(/\./g,''));
  else{add(part);if(/^[-+]?\d{1,3}\.\d{3}$/.test(part))add(part.replace('.',''))}
 }else add(part);
 return values.length?{values,unit}:null;
}
function answersEquivalent(actual,expected,task){
 if(norm(actual)===norm(expected))return true;
 const a=numericQuantity(actual),b=numericQuantity(expected);
 if(!a||!b||!a.values.some(x=>b.values.some(y=>Math.abs(x-y)<1e-10)))return false;
 if(a.unit===b.unit)return true;
 // Do not accept incorrect physical dimensions or units.
 if(a.unit&&b.unit)return false;
 const unit=a.unit||b.unit;
 if(unit==='°')return /açı|derece|\biletki\b|°/iu.test(task.gorev||'')||/açı|derece|°/iu.test(task.mekanik||'');
 return !!(unit&&new RegExp('(?:\\b'+unit.replace('²','[²2]')+'\\b)','iu').test((task.gorev||'')+' '+(task.beklenen_yanit_veya_rubrik||'')));
}
$('check').onclick=()=>{const x=t(),resp=$('answer').value.trim();if(!resp){feedback('Önce çözümünü veya bir gerekçeni yaz.');return}

if(x.atlas611Workbench && window.__atlas611Verified!==x.id){feedback('Önce v6.11 görsel modelini ve matematiksel hesabını doğrula.');return}
if(x.atlas610Workbench && window.__atlas610Verified!==x.id){feedback('Önce v6.10 modelini ve sayısal kanıtını doğrula.');return}
if(x.atlas69Workbench && window.__atlas69Verified!==x.id){feedback('Önce v6.9 modelini ve matematiksel kanıtını doğru tamamla.');return}
if(x.atlas68Workbench && window.__atlas68Verified!==x.id){feedback('Önce v6.8 Ana Etkinlik alanındaki görsel modeli ve matematiksel kanıtı tamamla.');return}
if(x.atlas63Pilot && window.__atlas63Verified!==x.id){feedback('Önce Tam Öğrenme Laboratuvarındaki bütün alanları doğru tamamla.');return}
if(x.atlas61Lab && window.__atlas61Verified!==x.id){feedback('Önce yeni ana laboratuvardaki tüm adımları doğrula.');return}
if(!x.atlas61Lab && x.atlas60Lab && window.__atlas60Verified!==x.id){feedback('Önce yeni ana görevde bütün matematiksel adımları doğrula.');return}
if(x.atlas57 && window.__atlas57Verified!==x.id){feedback('Önce 7. sınıf Muhakeme Atölyesi modelini doğrula.');return}
if(x.atlas56 && window.__atlas56Verified!==x.id){feedback('Önce v5.6 Geometri Stüdyosu modelini doğrula.');return}
if(x.atlas55 && window.__atlas55Verified!==x.id){feedback('Önce v5.5 model laboratuvarındaki ara adımları doğrula.');return}
if(x.atlas54 && window.__atlas54Verified!==x.id){feedback('Önce v5.4 muhakeme stüdyosunda tüm işlem basamaklarını ve yorumunu doğrula.');return}
if(x.atlas53 && window.__atlas53Verified!==x.id){feedback('Önce v5.3 Cebir Mimarları laboratuvarındaki ara adımları doğrula.');return}
if(x.atlas52 && window.__atlas52Verified!==x.id){feedback('Önce v5.2 olasılık ve grafik atölyesindeki modeli doğrula.');return}
if(x.atlas51 && window.__atlas51Verified!==x.id){feedback('Önce v5.1 keşif atölyesindeki modeli doğrula.');return}
if(x.atlas50 && window.__atlas50Verified!==x.id){feedback('Önce v5.0 keşif stüdyosundaki modeli doğrula.');return}
if(x.atlas49 && window.__atlas49Verified!==x.id){feedback('Önce yeni kalite atölyesindeki modelini doğrula.');return}
if(x.atlas8Lab48 && window.__atlas8Verified48!==x.id){feedback('Önce 8. sınıf v4.8 laboratuvarındaki modelini doğrula.');return}
if(x.atlas8Lab && window.__atlas8Verified!==x.id){feedback('Önce 8. sınıf sayı ve üs laboratuvarındaki modelini doğrula.');return}
if(x.atlas7Algebra && window.__atlasAlgebraVerified!==x.id){feedback('Önce Cebir Laboratuvarı içindeki modeli ve gerekçeyi doğrula.');return}
if(x.atlas7Probability && window.__atlasProbabilityVerified!==x.id){feedback('Önce Olasılık Laboratuvarı içindeki modeli çöz ve doğrula.');return}
if(answersEquivalent(resp,x.beklenen_yanit_veya_rubrik,x)){gateDone(x,()=>{done[x.id]=true;delete draftAnswers[x.id];saveDrafts();save();render();feedback('✅ Doğru! '+x.ipucu,true)})}else {feedback('Tekrar dene. İpucundan yararlan veya düşünme yolunu kontrol et.')}};
$('hint').onclick=()=>{const a=t();feedback('💡 '+a.ipucu)};
$('rubric').onclick=()=>{const a=t();let persisted=false;try{persisted=JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')[a.id]===true}catch(e){}
 if(!persisted){feedback('Çözüm anahtarı görevi doğru tamamlayıp ilerlemeni kaydettikten sonra açılır. İpucu düğmesini kullan.');return}
 feedback('Beklenen çözüm/kanıt: '+a.beklenen_yanit_veya_rubrik)};

$('next').onclick=()=>{taskIndex=Math.min(pack().length-1,taskIndex+1);render();taskNavFocus()};
$('prev').onclick=()=>{taskIndex=Math.max(0,taskIndex-1);render();taskNavFocus()};
function nextOutcome(){const current=db.outcomes.find(x=>x.kod===O.value);const next=db.outcomes.find(x=>x.sinif===current.sinif&&x.plan_sirasi===current.plan_sirasi+1);if(!next)return;T.value=String(next.tema_sirasi);populateOutcomes(next.kod)}
$('goNextOutcome').onclick=nextOutcome;$('goNextOutcomeBottom').onclick=nextOutcome;
G.onchange=()=>populateThemes();T.onchange=()=>populateOutcomes();O.onchange=()=>{taskIndex=0;render()};
// MATEMATİK ATLASI v0.4 · 80 geometry tasks; v0.3 bank, codes and progress retained.
const svgNS='http://www.w3.org/2000/svg';
const studio={task:null,points:[],closed:false,angle:45,option:'',drawing:false,preview:null,keyboard:{x:280,y:200,active:false}};
const getCfg=()=>studio.task?.studio;
const near=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const point=(x,y)=>({x,y});
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function el(tag,attr={},parent=$('studioCanvas')){const e=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attr))e.setAttribute(k,String(v));parent.appendChild(e);return e}
function drawLine(a,b,color=lightGeometryBoard()?'#166e9a':'#7ee7e8',width=4,extra={}){return el('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:color,'stroke-width':width,'stroke-linecap':'round',...extra})}
function dot(p,color='#ffc67a',r=7){el('circle',{cx:p.x,cy:p.y,r,fill:color,stroke:'#08243b','stroke-width':2})}
function lightGeometryBoard(){return !['lineRelations','polyAnalyze','doubleCircle'].includes(getCfg()?.kind)}
function annotation(x,y,t){const a=el('text',{x,y,fill:lightGeometryBoard()?'#194a6c':'#e2f3ff','font-size':16,'font-weight':700});a.textContent=t}
function projectToBoard(ev){const svg=$('studioCanvas');const m=svg.getScreenCTM();if(m){const p=new DOMPoint(ev.clientX,ev.clientY).matrixTransform(m.inverse());return point(clamp(p.x,0,600),clamp(p.y,0,380));}const rect=svg.getBoundingClientRect();return point(clamp((ev.clientX-rect.left)*600/rect.width,0,600),clamp((ev.clientY-rect.top)*380/rect.height,0,380))}
function snap(p){return point(clamp(Math.round(p.x/40)*40,40,560),clamp(Math.round(p.y/40)*40,40,340))}
function studioStatus(t){$('studioStat').textContent=t}
function refreshChoices(opts=[],correctLabel=''){$('studioChoices').innerHTML='';opts.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.textContent=s;b.setAttribute('aria-pressed',String(studio.option===s));if(studio.option===s)b.classList.add('selected');b.onclick=()=>{studio.option=s;refreshChoices(opts,correctLabel);studioStatus('Seçimin: '+s+'. Çizimini kontrol edebilirsin.')};$('studioChoices').appendChild(b)})}
function makeChoices(cfg){const options=cfg.kind==='tool'?['cetvel','pergel','iletki','gönye']:
 cfg.kind==='angleRead'?[cfg.target,(cfg.target+30)%180||180,Math.abs(cfg.target-30)||15,180-cfg.target].filter((x,i,a)=>a.indexOf(x)===i).map(x=>x+'°'):
 cfg.kind==='angle'&&cfg.conceptCorrect?['Dar açı','Dik açı','Geniş açı']:
 cfg.conceptCorrect?[cfg.conceptCorrect,...({line:['İki uç noktası vardır','Bir yönde sınırsız uzar','Bütün noktaları merkeze eşit uzaklıktadır'],ray:['Her iki yönde sonsuza gider','İki uç noktası vardır','90° açı oluşturur'],segment:['İki yönde sonsuza uzar','Tek uç noktası vardır','Bir merkezi vardır'],perp:['Hiçbir zaman kesişmezler','Bir merkez etrafında döner','İki ucu olmayan kapalı çizgidir'],circle:['İki yönde sınırsız uzar','İki uç noktası bulunur','90° açı oluşturur']}[cfg.kind]||[])]:[];
 // Rotate for task variety to avoid answer always being first
 const n=Number(studio.task.gorev_no);if(options.length){const rot=n%options.length;options.push(...options.splice(0,rot))}
 refreshChoices(options);}
function renderProbability5PlusLab(a){window.MatematikAtlasProbability5Plus?.render(a,()=>{done[a.id]=true;save();render();feedback('✅ Olasılık tasarım görevi tamamlandı.',true)})}
function renderAlgebra5PlusLab(a){window.MatematikAtlasAlgebra5Plus?.render(a,()=>{done[a.id]=true;save();render();feedback('✅ Cebirsel düşünme görevi tamamlandı.',true)})}
function renderStudio(a){document.body.classList.toggle('atlas611-task',!!a.atlas611Workbench);document.body.classList.toggle('atlas610-task',!!a.atlas610Workbench);if(a.atlas611Workbench){$('studio').hidden=true;$('legacyAnswer').hidden=true;document.querySelectorAll('[id$=Lab]').forEach(e=>{if(e.id!=='atlas611Lab')e.hidden=true});return;}if(a.atlas610Workbench){$('studio').hidden=true;$('legacyAnswer').hidden=true;document.querySelectorAll('[id$=Lab]').forEach(e=>{if(e.id!=='atlas610Lab')e.hidden=true});return;}if(a.atlas69Workbench){$('studio').hidden=true;$('legacyAnswer').hidden=true;document.querySelectorAll('[id$=Lab]').forEach(e=>{if(e.id!=='atlas69Lab')e.hidden=true});return;}studio.task=a;renderNumberLab(a);renderMeasureLab(a);renderFractionLab(a);renderStatLab(a);renderAlgebraLab(a);renderProbabilityLab(a);renderFactorLab(a);renderExperimentLab(a);renderDecimalLab(a);renderAppliedLab(a);renderResearchLab(a);renderGeometry6Lab(a);renderAlgebra6Lab(a);renderMeasure6Lab(a);renderGeometry5PlusLab(a);renderNumber5PlusLab(a);renderFraction5PlusLab(a);renderMeasure5PlusLab(a);renderStatistics5PlusLab(a);renderAlgebra5PlusLab(a);renderProbability5PlusLab(a);const cfg=getCfg();$('studio').hidden=!cfg;document.body.classList.remove('atlas-board-focus');$('studioFocus').setAttribute('aria-pressed','false');$('studioFocus').textContent='⛶ Büyüt';$('legacyAnswer').hidden=!!(a.atlas611Workbench||a.atlas610Workbench||a.atlas69Workbench||a.atlas68Workbench||a.atlas63Pilot||a.atlas61Lab||a.atlas60Lab||a.atlas57||a.atlas56||a.atlas55||a.atlas54||a.atlas53||a.atlas52||a.atlas51||a.atlas50||a.atlas49||a.atlas8Lab48||a.atlas8Lab||a.pilot_ui||a.atlas7Lab||a.atlas7Solid||a.atlas7Stats||a.atlas7Transform||a.atlas7Triangle||a.atlas7Ratio||a.atlas7Algebra||a.atlas7Probability||cfg||a.numeric||a.geometryLab||a.fractionLab||a.statLab||a.algebraLab||a.probabilityLab||a.factorLab||a.expLab||a.decimalLab||a.appliedLab||a.researchLab||a.geometry6Lab||a.algebra6Lab||a.geometryMeasureLab||a.geometry5PlusLab||a.number5PlusLab||a.fraction5PlusLab||a.measure5PlusLab||a.research5PlusLab||a.algebra5PlusLab||a.probability5PlusLab);if(a.numeric||a.geometryLab||a.fractionLab||a.statLab||a.algebraLab||a.probabilityLab||a.factorLab||!cfg)return;
 studio.points=[];studio.closed=false;studio.angle=cfg.kind==='angle'?25:cfg.target||45;$('angleSlider').min=0;$('angleSlider').max=180;studio.option='';studio.preview=null;studio.drawing=false;studio.keyboard={x:280,y:200,active:false};
 $('studioInstructions').textContent=cfg.instruction;$('studioTitle').textContent=({tool:'Çizim aracı seç',circle:'Pergel istasyonu',angle:'Açıölçer laboratuvarı',angleRead:'Açıyı oku',perp:'Dikme ustası',line:'Doğru kur',ray:'Işın oluştur',segment:'Doğru parçası çiz',polygon:'Çokgen mimarı',lineRelations:'Kesişen doğrular ve açı ilişkileri',polyAnalyze:'Düzgün çokgen dedektifi',doubleCircle:'İki çemberle üçgen inşası'})[cfg.kind]||'Çizim istasyonu';
 $('studioCanvasBox').hidden=cfg.kind==='tool';document.body.classList.remove('atlas-board-focus');$('studioFocus').setAttribute('aria-pressed','false');$('studioFocus').textContent='⛶ Büyüt';const precise= $('studioPrecision');precise.hidden=!['circle','perp','line','ray','segment','polygon'].includes(cfg.kind);precise.open=false;studioPreciseCursor();$('angleControl').hidden=cfg.kind!=='angle';$('angleSlider').value=studio.angle;$('angleValue').textContent=studio.angle+'°';
 $('studioUndo').hidden=cfg.kind==='tool'||cfg.kind==='angleRead'||cfg.kind==='angle'||advancedKinds.has(cfg.kind);$('studioClear').hidden=cfg.kind==='tool'||cfg.kind==='angleRead';
 $('studioStep').textContent=cfg.kind==='tool'?'1 seçim':cfg.kind==='angleRead'?'açı okuma':cfg.kind==='polygon'?cfg.target+' köşe':'çizim';
 studioStatus('Hazır: yönergeleri izleyip çizime başla.');makeChoices(cfg);setupAdvanced(cfg);paint();}
function grid(){const light=lightGeometryBoard();el('rect',{x:0,y:0,width:600,height:380,fill:light?'#f2f9ff':'#091d31'});for(let x=40;x<=560;x+=40)drawLine(point(x,0),point(x,380),light?'#c5dfec':'#24435a',1);for(let y=40;y<=340;y+=40)drawLine(point(0,y),point(600,y),light?'#c5dfec':'#24435a',1);for(let x=40;x<=560;x+=40)for(let y=40;y<=320;y+=40)el('circle',{cx:x,cy:y,r:2,fill:light?'#8aafc7':'#2c5768'})}
function drawProtractor(angle,read=false){const o=point(252,252),r=148;
 // semicircle 0 degrees right to 180 degrees left, upper side
 el('path',{d:`M ${o.x-r} ${o.y} A ${r} ${r} 0 0 1 ${o.x+r} ${o.y}`,stroke:'#237ca2','stroke-width':3,fill:'#c4e3f3','fill-opacity':.50});
 for(let d=0;d<=180;d+=10){const rad=d*Math.PI/180,len=d%30===0?16:8;const p=(rr)=>point(o.x+rr*Math.cos(rad),o.y-rr*Math.sin(rad));drawLine(p(r-len),p(r),'#237ba2',2);if(d%30===0){const k=p(r+20);annotation(k.x-9,k.y+5,String(d))}}
 const to=deg=>point(o.x+150*Math.cos(deg*Math.PI/180),o.y-150*Math.sin(deg*Math.PI/180));
 drawLine(o,to(0),'#bf7a24',4);drawLine(o,to(angle),'#077d98',5);dot(o,'#ffcf71');
 if(!read){const end=to(angle);el('circle',{cx:end.x,cy:end.y,r:16,stroke:'#d2f9fa','stroke-width':2,fill:'#4cbece','fill-opacity':.25});}
 if(!read){let label=el('text',{x:264,y:280,fill:'#b5d5e6','font-size':13});label.textContent='0° → açıyı sürükle'}
}
function polyArea(pts){return Math.abs(pts.reduce((v,p,i)=>{let q=pts[(i+1)%pts.length];return v+p.x*q.y-q.x*p.y},0))/2}
function segmentsIntersect(a,b,c,d){const cross=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
 const ab1=cross(a,b,c),ab2=cross(a,b,d),cd1=cross(c,d,a),cd2=cross(c,d,b);
 return (ab1*ab2<0&&cd1*cd2<0) || (Math.abs(ab1)<1e-6&&onSegment(a,b,c)) || (Math.abs(ab2)<1e-6&&onSegment(a,b,d)) || (Math.abs(cd1)<1e-6&&onSegment(c,d,a)) || (Math.abs(cd2)<1e-6&&onSegment(c,d,b));}
function onSegment(a,b,p){return p.x>=Math.min(a.x,b.x)-1e-6&&p.x<=Math.max(a.x,b.x)+1e-6&&p.y>=Math.min(a.y,b.y)-1e-6&&p.y<=Math.max(a.y,b.y)+1e-6}
function simplePolygon(pts){if(polyArea(pts)<2000)return false;const n=pts.length;for(let i=0;i<n;i++){if(near(pts[i],pts[(i+1)%n])<35)return false;for(let j=i+1;j<n;j++){if(j===i+1||(i===0&&j===n-1))continue;if(segmentsIntersect(pts[i],pts[(i+1)%n],pts[j],pts[(j+1)%n]))return false;}}return true;}
function paintUnadorned(){const svg=$('studioCanvas');svg.textContent='';const cfg=getCfg();if(!cfg||cfg.kind==='tool')return;grid();if(paintAdvanced(cfg))return;
 if(cfg.kind==='angle'||cfg.kind==='angleRead'){drawProtractor(cfg.kind==='angleRead'?cfg.target:studio.angle,cfg.kind==='angleRead');return}
 if(cfg.kind==='perp'){
  drawLine(point(60,240),point(540,240),'#bb7b30',5);dot(point(320,240),'#ffd27e');annotation(331,259,'P');
  if(studio.points.length){drawLine(point(320,240),studio.points[0]);dot(studio.points[0])}return;
 }
 if(cfg.kind==='polygon'){
  if(studio.points.length){const pts=studio.points;for(let i=0;i<pts.length-1;i++)drawLine(pts[i],pts[i+1]);if(studio.closed){drawLine(pts[pts.length-1],pts[0],'#14836d',5)}for(let i=0;i<pts.length;i++){dot(pts[i],i===0?'#ffca6e':'#7ee5df');annotation(pts[i].x+8,pts[i].y-10,String.fromCharCode(65+i))}}
  return;
 }
 const pts=studio.points;
 if(cfg.kind==='circle'){
  if(cfg.fixedCenter){const o=point(280,180);dot(o,'#ffbf7b');annotation(293,180,'O');if(pts.length){const r=near(o,pts[0]);el('circle',{cx:o.x,cy:o.y,r,stroke:'#167da3','stroke-width':4,fill:'#4baace','fill-opacity':.10});dot(pts[0])}}else{if(pts.length)dot(pts[0]);if(pts.length===2){el('circle',{cx:pts[0].x,cy:pts[0].y,r:near(pts[0],pts[1]),stroke:'#167da3','stroke-width':4,fill:'#4baace','fill-opacity':.10});dot(pts[1])}}return;
 }
 if(pts.length>=1)dot(pts[0],'#ffc67a');if(pts.length>=2){const a=pts[0],b=pts[1];let dir=point((b.x-a.x)/near(a,b),(b.y-a.y)/near(a,b));
  if(cfg.kind==='line'){const v=point(dir.x*1100,dir.y*1100);drawLine(point(a.x-v.x,a.y-v.y),point(a.x+v.x,a.y+v.y));annotation(a.x+7,a.y-10,'A');annotation(b.x+7,b.y-10,'B')}
  else if(cfg.kind==='ray'){drawLine(a,point(a.x+dir.x*1100,a.y+dir.y*1100));annotation(a.x+7,a.y-10,'A')}
  else{drawLine(a,b);annotation(a.x+7,a.y-10,'A');annotation(b.x+7,b.y-10,'B');}
  dot(a);dot(b);
 }
}
function paintKeyboardCursor(){const c=getCfg();if(!c||!studio.keyboard.active||['tool','angleRead','lineRelations','polyAnalyze','doubleCircle'].includes(c.kind))return;
 const k=studio.keyboard;el('circle',{cx:k.x,cy:k.y,r:14,fill:'#ffe39b','fill-opacity':0.24,stroke:'#ffec92','stroke-width':3,'stroke-dasharray':'4 2','pointer-events':'none','data-keyboard-cursor':'true'});
 el('line',{x1:k.x-19,y1:k.y,x2:k.x+19,y2:k.y,stroke:'#fff','stroke-width':1.8,'pointer-events':'none'});
 el('line',{x1:k.x,y1:k.y-19,x2:k.x,y2:k.y+19,stroke:'#fff','stroke-width':1.8,'pointer-events':'none'});
}
function paint(){paintUnadorned();paintKeyboardCursor()}
function studioPreciseCursor(){const out=$('studioCursor');if(out)out.textContent='Konum: '+Math.round(studio.keyboard.x/40)+', '+Math.round(studio.keyboard.y/40)+' (kare)'}
$('studioPrecision').querySelectorAll('[data-dir]').forEach(btn=>btn.addEventListener('click',()=>{
 const k=studio.keyboard,dir=btn.dataset.dir;
 k.x=clamp(k.x+(dir==='right'?40:dir==='left'?-40:0),40,560);
 k.y=clamp(k.y+(dir==='down'?40:dir==='up'?-40:0),40,320);
 k.active=true;studioPreciseCursor();paint();
 studioStatus('Hedef noktayı taşıdın; yerleştirmek için mavi düğmeye bas.');
}));
$('studioPlace').addEventListener('click',()=>{studio.keyboard.active=true;addBoardPoint(point(studio.keyboard.x,studio.keyboard.y));studioPreciseCursor()});
$('studioFocus').addEventListener('click',()=>{const on=document.body.classList.toggle('atlas-board-focus');$('studioFocus').setAttribute('aria-pressed',String(on));$('studioFocus').textContent=on?'✕ Küçült':'⛶ Büyüt';if(on){$('studioCanvas').focus({preventScroll:true})}else{$('studioFocus').focus({preventScroll:true})}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('atlas-board-focus')){e.preventDefault();document.body.classList.remove('atlas-board-focus');$('studioFocus').setAttribute('aria-pressed','false');$('studioFocus').textContent='⛶ Büyüt';$('studioFocus').focus({preventScroll:true})}});
$('studioCanvas').addEventListener('focus',()=>{studio.keyboard.active=true;paint()});
$('studioCanvas').addEventListener('blur',()=>{studio.keyboard.active=false;paint()});
function addBoardPoint(p){const cfg=getCfg();if(!cfg)return;
 if(advancedKinds.has(cfg.kind))return;
 if(cfg.kind==='angle'){const o=point(252,252);const deg=Math.atan2(o.y-p.y,p.x-o.x)*180/Math.PI;studio.angle=Math.round(clamp(deg,0,180));$('angleSlider').value=studio.angle;$('angleValue').textContent=studio.angle+'°';paint();studioStatus('Açı kolunu ayarladın. Şimdi ölçüyü kontrol et.');return}
 if(cfg.kind==='angleRead'||cfg.kind==='tool')return;
 if(cfg.kind==='perp'){studio.points=[p];studioStatus('Dikme çizildi. Ölçüsünü kontrol et.');paint();return;}
 if(cfg.kind==='polygon'){
   if(studio.closed){studioStatus('Şekil zaten kapalı. Değiştirmek için Temizleye bas.');return;}
   if(studio.points.length>=3&&near(p,studio.points[0])<28){studio.closed=true;studioStatus('Çokgeni kapattın. Doğrulamak için düğmeye bas.');paint();return}
   if(studio.points.length>=cfg.target){studioStatus('Gerekli köşeleri koydun. İlk noktaya tekrar dokun.');return}
   if(studio.points.some(a=>near(a,p)<30)){studioStatus('Yeni köşeyi başka bir noktaya yerleştir.');return}
   studio.points.push(p);studioStatus(studio.points.length+'/'+cfg.target+' köşe. '+(studio.points.length===cfg.target?'Şimdi ilk noktaya dokun.':'Sıradaki köşeyi koy.'));paint();return;
 }
 if(cfg.kind==='circle'){
  if(cfg.fixedCenter){studio.points=[p]}else{if(studio.points.length===1&&near(studio.points[0],p)<4){studioStatus('Merkezden farklı bir nokta seç.');return;}studio.points=studio.points.length>=2?[p]:[...studio.points,p]}
 }else{if(studio.points.length===1&&near(studio.points[0],p)<4){studioStatus('Aynı nokta ikinci uç olamaz. Başka bir nokta seç.');return;}studio.points=studio.points.length>=2?[p]:[...studio.points,p]}
 studioStatus((studio.points.length===2||cfg.fixedCenter)?'Çizim tamam. Kontrol edebilirsin.':'İlk nokta seçildi. İkinci noktaya dokun.');paint();
}
$('studioCanvas').addEventListener('pointerdown',e=>{const cfg=getCfg();if(!cfg||cfg.kind==='angleRead'||cfg.kind==='tool')return; if(cfg.kind==='lineRelations'&&cfg.adjust){studio.drawing=true;try{e.currentTarget.setPointerCapture(e.pointerId)}catch{};dragAdvanced(projectToBoard(e),cfg);return;}if(cfg.kind==='polyAnalyze'&&cfg.mode==='repair'){studio.drawing=true;try{e.currentTarget.setPointerCapture(e.pointerId)}catch{};dragAdvanced(projectToBoard(e),cfg);return;} if(advancedKinds.has(cfg.kind))return;studio.drawing=cfg.kind==='angle';if(studio.drawing){try{e.currentTarget.setPointerCapture(e.pointerId)}catch{}addBoardPoint(projectToBoard(e))}else{addBoardPoint(cfg.kind==='circle'?snap(projectToBoard(e)):cfg.kind==='polygon'?projectToBoard(e):snap(projectToBoard(e)))}});
$('studioCanvas').addEventListener('pointermove',e=>{if(studio.drawing&&getCfg()?.kind==='angle')addBoardPoint(projectToBoard(e));else if(studio.drawing&&advancedKinds.has(getCfg()?.kind))dragAdvanced(projectToBoard(e),getCfg())});
$('studioCanvas').addEventListener('pointerup',()=>studio.drawing=false);
$('studioCanvas').addEventListener('pointercancel',()=>studio.drawing=false);
$('studioCanvas').addEventListener('keydown',e=>{if(!getCfg())return;let hit=true;switch(e.key){case 'ArrowLeft':studio.keyboard.x-=40;break;case 'ArrowRight':studio.keyboard.x+=40;break;case 'ArrowUp':studio.keyboard.y-=40;break;case 'ArrowDown':studio.keyboard.y+=40;break;case 'Enter':case ' ':addBoardPoint(point(studio.keyboard.x,studio.keyboard.y));break;default:hit=false}if(hit){e.preventDefault();studio.keyboard.x=clamp(studio.keyboard.x,40,560);studio.keyboard.y=clamp(studio.keyboard.y,40,340);paint();studioStatus('Klavye noktası: '+studio.keyboard.x/40+', '+studio.keyboard.y/40+'. Enter ile yerleştir.')}});
$('angleSlider').oninput=e=>{studio.angle=Number(e.target.value);$('angleValue').textContent=studio.angle+'°';paint()};
$('studioUndo').onclick=()=>{studio.closed=false;studio.points.pop();paint();studioStatus('Son nokta geri alındı.')};
$('studioClear').onclick=()=>{if(advancedKinds.has(getCfg()?.kind)){renderStudio(studio.task);return;}studio.points=[];studio.closed=false;studio.angle=25;studio.option='';$('angleSlider').value=25;$('angleValue').textContent='25°';makeChoices(getCfg());paint();studioStatus('Tahta temizlendi.')};
function verifyStudio(){const cfg=getCfg();if(!cfg)return;if(advancedKinds.has(cfg.kind)){verifyAdvanced(cfg);return;}let ok=false,why='';const ps=studio.points;
 switch(cfg.kind){
 case 'tool':ok=studio.option===cfg.correct;why=ok?'Doğru aracı seçtin.':'Bu işlemde kullanılan temel aracı yeniden düşün.';break;
 case 'segment':case 'line':case 'ray':ok=ps.length===2&&near(ps[0],ps[1])>65;why=ok?'İki noktayı doğru biçimde birleştirdin.':'Tahtada iki ayrı nokta belirlemelisin.';if(ok&&cfg.kind==='segment'&&cfg.target){ok=Math.abs(near(ps[0],ps[1])/40-cfg.target)<.2;why='Doğru parçasının uzunluğunu karelerle karşılaştır.'}break;
 case 'circle':{
 const center=cfg.fixedCenter?point(280,180):ps[0],edge=cfg.fixedCenter?ps[0]:ps[1];const r=center&&edge?near(center,edge)/40:0;
 ok=Boolean(center&&edge&&r>1.1&&(!cfg.radius||Math.abs(r-cfg.radius)<.24));why=ok?'Çemberde bütün noktalar merkeze aynı uzaklıktadır.':`Merkez ve çember üzerinde bir nokta seç. ${cfg.radius?'Yarıçap '+cfg.radius+' kare olmalı.':'Yarıçap en az bir kareden büyük olmalı.'}`;break;}
 case 'perp':{const p=ps[0];ok=Boolean(p&&Math.abs(p.x-320)<=12&&Math.abs(p.y-240)>70);why=ok?'Diklik tamam: yatay yola 90° açıyla çıktın.':'P noktasının tam üstünde veya altında, aynı hizada bir nokta seç (90°).';break;}
 case 'angle':ok=Math.abs(studio.angle-cfg.target)<=3;why=ok?'Açıyı doğru ölçüye getirdin.':'Açıölçerin 0° başlangıcını izle. Hedef '+cfg.target+'°; şu an '+studio.angle+'°.';break;
 case 'angleRead':ok=studio.option===cfg.target+'°';why=ok?'Açıölçerde doğru çizgiyi okudun.':'Başlangıç kolu 0° üzerinde; diğer kolun değdiği çizgiyi yeniden incele.';break;
 case 'polygon':ok=studio.closed&&ps.length===cfg.target&&simplePolygon(ps);why=ok?'Tebrikler! '+cfg.target+' kenarlı basit, kapalı çokgen inşa ettin.':'Şekli '+cfg.target+' köşeyle kapat; kenarlar iç içe geçmemeli ve köşeler üst üste binmemeli.';break;
 }
 if(ok&&cfg.conceptCorrect&&!['angleRead','tool'].includes(cfg.kind)){ok=studio.option===cfg.conceptCorrect;why=ok?why+' Özelliği de doğru belirledin.':'Çizimin uygun görünüyor; şimdi değişmeyen özelliği veya açı türünü doğru seç.'}
 if(ok){gateDone(studio.task,()=>{done[studio.task.id]=true;save();render();feedback('✅ '+why+' Görev tamamlandı.',true)})}else{feedback('🔎 '+why+' Çizimini düzelterek yeniden deneyebilirsin.');studioStatus('Yeniden dene: '+why)}
}
$('studioVerify').onclick=verifyStudio;

// v0.5: three new real mathematical workbenches (60 tasks)
const advancedKinds=new Set(['lineRelations','polyAnalyze','doubleCircle']);
let visibleMeasures=false;
function advancedOptions(cfg){const opts=cfg.options.slice();const shift=Number(studio.task.gorev_no)%opts.length;opts.push(...opts.splice(0,shift));refreshChoices(opts)}
function setupAdvanced(cfg){
  const advanced=advancedKinds.has(cfg.kind);
  $('labControls').hidden=!advanced;
  $('labCircleControls').hidden=cfg.kind!=='doubleCircle';
  $('labPolygonControls').hidden=cfg.kind!=='polyAnalyze';
  $('labToggle').hidden=cfg.kind!=='polyAnalyze';
  visibleMeasures=false;$('labToggle').textContent='📏 Ölçüleri göster';
  if(cfg.kind==='lineRelations'){
    $('angleControl').hidden=!cfg.adjust;
    $('angleSlider').min=15;$('angleSlider').max=165;
    studio.angle=cfg.adjust?Math.max(15,cfg.target-23):cfg.target||45;
    $('angleSlider').value=studio.angle;$('angleValue').textContent=studio.angle+'°';
    studioStatus(cfg.adjust?'İkinci veya üçüncü doğruyu döndürerek hedef açıyı oluştur.':'Açıları incele ve uygun sonucu seç.');
  }
  if(cfg.kind==='polyAnalyze'){
    studio.offset=cfg.mode==='regular'?0:(cfg.offset||32);
    $('polyOffset').value=studio.offset;
    $('polyOffsetValue').textContent=studio.offset===0?'0 · düzgün':'Sapma: '+studio.offset;
    $('labPolygonControls').hidden=cfg.mode!=='repair';
    studioStatus(cfg.mode==='repair'?'Şekildeki bozuk köşeyi düzelterek düzgün çokgen oluştur.':'Önce şekli incele; uzunluk ve açı ölçülerini açabilirsin.');
  }
  if(cfg.kind==='doubleCircle'){
    studio.radii={r1:2,r2:2,d:2};
    for(const id of ['r1','r2','d']){$('lab_'+id).value=studio.radii[id];$('val_'+id).textContent=studio.radii[id]+' birim';}
    studioStatus('Yarıçapları ve merkezler arası uzaklığı değiştir. Üçgen ancak çemberler iki noktada kesiştiğinde kurulur.');
  }
  if(advanced)advancedOptions(cfg);
}
$('polyOffset').addEventListener('input',e=>{studio.offset=Number(e.target.value);$('polyOffsetValue').textContent=studio.offset===0?'0 · düzgün':'Sapma: '+studio.offset;paint();studioStatus('Bir köşeyi taşıdın; kenarları ve iç açıları yeniden incele.');});
$('labToggle').onclick=()=>{visibleMeasures=!visibleMeasures;$('labToggle').textContent=visibleMeasures?'📏 Ölçüleri gizle':'📏 Ölçüleri göster';paint();};
for(const id of ['r1','r2','d'])$('lab_'+id).addEventListener('input',e=>{
 studio.radii[id]=Number(e.target.value);$('val_'+id).textContent=e.target.value+' birim';paint();
 const {r1,r2,d}=studio.radii;
 studioStatus(Math.abs(r1-r2)<d&&d<r1+r2?'İki kesişim var. Merkezleri ve üst kesişimi birleştirerek üçgeni incele.':'İki farklı kesişim henüz oluşmadı. Üçgen için yarıçap ve uzaklıkları değiştir.');
});
function lineAcross(deg,O=point(300,190),col='#65d9e3'){
 const a=deg*Math.PI/180,dx=550*Math.cos(a),dy=550*Math.sin(a);
 drawLine(point(O.x-dx,O.y-dy),point(O.x+dx,O.y+dy),col,4);
}
function arc(angle,r=73,O=point(300,190),col='#ffe098'){
 const rad=angle*Math.PI/180;
 const a=point(O.x+r,O.y),b=point(O.x+r*Math.cos(rad),O.y-r*Math.sin(rad));
 el('path',{d:`M ${a.x} ${a.y} A ${r} ${r} 0 ${angle>180?1:0} 0 ${b.x} ${b.y}`,stroke:col,'stroke-width':4,fill:'none'});
}
function advancedLines(cfg){
 const O=point(300,190);if(cfg.mode==='parallel'){
  drawLine(point(65,142),point(535,142),'#7de5ea',5);drawLine(point(65,238),point(535,238),'#f5c57f',5);
  annotation(75,119,'d₁ ∥ d₂');annotation(340,276,'Kesişim yok');return;
 }
 lineAcross(0,O,'#f8c979');
 const beta=cfg.mode==='three'?60:studio.angle;
 lineAcross(-beta,O,'#79e8e7');
 if(cfg.mode==='three')lineAcross(-studio.angle,O,'#ae9aff');
 else{arc(studio.angle);annotation(383,160,String(Math.round(studio.angle))+'°');}
 dot(O,'#ffffff',6);annotation(311,208,'O');
 if(cfg.mode==='three'){
  annotation(31,40,'3 farklı doğru, aynı noktadan geçiyor');
  annotation(50,325,'2 doğru → 4 açı bölgesi; 3 farklı doğru → 6 açı bölgesi');
 }else{annotation(54,42,'Ters açılar eş · komşu bütünler açılar toplamı 180°');}
}
function polyVertices(cfg){const n=cfg.n,step=2*Math.PI/n,r=119,cx=300,cy=190;
 return Array.from({length:n},(_,i)=>{const ang=-Math.PI/2+i*step;
 let rr=r+(i===0?studio.offset:0);return point(cx+rr*Math.cos(ang),cy+rr*Math.sin(ang));});}
function sideLengths(pts){return pts.map((p,i)=>near(p,pts[(i+1)%pts.length]));}
function innerAngles(pts){return pts.map((p,i)=>{const a=pts[(i+pts.length-1)%pts.length],b=pts[(i+1)%pts.length],u=point(a.x-p.x,a.y-p.y),v=point(b.x-p.x,b.y-p.y);
 return Math.acos(clamp((u.x*v.x+u.y*v.y)/(Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y)),-1,1))*180/Math.PI;});}
function advancedPolygon(cfg){const pts=polyVertices(cfg),ls=sideLengths(pts),angs=innerAngles(pts),n=pts.length;
 el('polygon',{points:pts.map(p=>p.x+','+p.y).join(' '),fill:'#1c8090','fill-opacity':.28,stroke:'#78e9e9','stroke-width':4,'stroke-linejoin':'round'});
 for(let i=0;i<n;i++){
   dot(pts[i],i===0?'#ffc977':'#92e9e2',5);annotation(pts[i].x+9,pts[i].y+5,String.fromCharCode(65+i));
   if(visibleMeasures){let p=pts[i],q=pts[(i+1)%n];const mid=point((p.x+q.x)/2,(p.y+q.y)/2);annotation(mid.x-12,mid.y-7,(ls[i]/30).toFixed(1));}
 }
 annotation(35,34,n+' köşe · '+n+' kenar');
 if(visibleMeasures){annotation(36,62,'Kenarlar: '+ls.map(x=>(x/30).toFixed(1)).join(' · '));
 annotation(35,88,'İç açılar: '+angs.map(x=>Math.round(x)+'°').join(' · '));
 annotation(35,345,'Kenar ve açıların hepsi eş mi?');}
 else annotation(35,345,'📏 Ölçüleri görmek için düğmeye dokun.');
 if(cfg.mode==='repair'&&studio.offset>4){annotation(340,345,'A köşesini düzelt: sapma '+studio.offset);}
}
function circleIntersection(r1,r2,d){if(!(Math.abs(r1-r2)<d&&d<r1+r2))return null;
 const x=(r1*r1-r2*r2+d*d)/(2*d),h=Math.sqrt(Math.max(0,r1*r1-x*x));return {x,h};}
function advancedCircles(cfg){const {r1,r2,d}=studio.radii,scale=25,O1=point(300-d*scale/2,192),O2=point(300+d*scale/2,192);
 el('circle',{cx:O1.x,cy:O1.y,r:r1*scale,stroke:'#62dfee','stroke-width':3,fill:'#3288aa','fill-opacity':.09});
 el('circle',{cx:O2.x,cy:O2.y,r:r2*scale,stroke:'#f7c77a','stroke-width':3,fill:'#f7c77a','fill-opacity':.05});
 const ix=circleIntersection(r1,r2,d);
 drawLine(O1,O2,'#f6d58e',3);dot(O1,'#94e7ef',5);dot(O2,'#ffca75',5);
 annotation(O1.x-26,O1.y+24,'O₁');annotation(O2.x+10,O2.y+24,'O₂');
 annotation(25,28,`r₁ = ${r1}     r₂ = ${r2}     merkez uzaklığı = ${d}`);
 if(ix){const P=point(O1.x+ix.x*scale,O1.y-ix.h*scale),Q=point(P.x,O1.y+ix.h*scale);
 drawLine(O1,P,'#91f6bd',5);drawLine(O2,P,'#91f6bd',5);dot(P,'#fff3b2',6);dot(Q,'#dd96ea',5);
 annotation(P.x+8,P.y-8,'P');annotation(Q.x+10,Q.y+5,'Q');
 annotation(22,348,'△ O₁PO₂ kenarları: '+r1+' · '+r2+' · '+d+' birim');
 }else{annotation(24,343,'İki kesişim yok: O₁PO₂ üçgeni kurulamaz!');}
}
function paintAdvanced(cfg){if(cfg.kind==='lineRelations'){advancedLines(cfg);return true}
 if(cfg.kind==='polyAnalyze'){advancedPolygon(cfg);return true}
 if(cfg.kind==='doubleCircle'){advancedCircles(cfg);return true}
 return false}
function verifyAdvanced(cfg){let correct=studio.option===cfg.correct,why='';
 if(cfg.kind==='lineRelations'){
  if(cfg.adjust&&Math.abs(studio.angle-cfg.target)>2){correct=false;why='İstenen açı '+cfg.target+'°. Çizdiğin açı '+studio.angle+'°. Önce doğruyu döndür.'}
  else why=cfg.mode==='parallel'?'Paralel iki doğru birbirini kesmez; ortak köşeli bir açı oluşturmaz.':cfg.mode==='three'?'Aynı noktadan geçen üç farklı doğru çevreyi altı açı bölgesine ayırır.':'Ters açıların ölçüleri eşittir. Komşu bütünler açıların toplamı 180° olur.';
 }
 if(cfg.kind==='polyAnalyze'){
   if(cfg.mode==='repair'&&studio.offset>3){correct=false;why='Düzgün çokgen için yalnız kenarlar değil, bütün iç açılar da eşit olmalı. Sapmayı sıfıra getir.'}
   else why='Düzgün çokgenin tüm kenarları ve tüm iç açıları eşittir; yalnızca kenar sayısı yeterli değildir.';
 }
 if(cfg.kind==='doubleCircle'){
  const s=studio.radii;
  if(s.r1!==cfg.r1||s.r2!==cfg.r2||s.d!==cfg.d){correct=false;why=`Önce r₁=${cfg.r1}, r₂=${cfg.r2}, merkez uzaklığı=${cfg.d} birim olacak biçimde inşa et.`}
  else if(!circleIntersection(s.r1,s.r2,s.d)){correct=false;why='Çemberler iki ayrı noktada kesişmedi. Merkez uzaklığı, yarıçapların farkından büyük ve toplamından küçük olmalı.'}
  else why='Merkezler ve üst kesişim noktası üçgen oluşturur. Üçgenin kenar uzunlukları iki yarıçap ve merkezler arası uzaklıktır.';
 }
 if(studio.option&&studio.option!==cfg.correct&&correct===false&&!((cfg.kind==='lineRelations'&&cfg.adjust&&Math.abs(studio.angle-cfg.target)>2)||(cfg.kind==='polyAnalyze'&&cfg.mode==='repair'&&studio.offset>3)||(cfg.kind==='doubleCircle'&&(studio.radii.r1!==cfg.r1||studio.radii.r2!==cfg.r2||studio.radii.d!==cfg.d))))why='Seçtiğin yanıt modelden çıkan ölçü veya özellikle uyuşmuyor. Yeniden ölç.';
 if(!studio.option){correct=false;why=why||'Önce seçeneklerden yanıtını seç.'}
 if(!correct){feedback('🔎 '+(why||'Çizimini ve uzunluk/açı ilişkilerini yeniden değerlendir.'));studioStatus('Yeniden dene. '+why);return}
 gateDone(studio.task,()=>{done[studio.task.id]=true;save();render();feedback('✅ '+why+' Görev tamamlandı.',true)});
}

function dragAdvanced(p,cfg){
 if(cfg.kind==='lineRelations'&&cfg.adjust){const O=point(300,190);studio.angle=Math.round(clamp(Math.atan2(O.y-p.y,p.x-O.x)*180/Math.PI,15,165));$('angleSlider').value=studio.angle;$('angleValue').textContent=studio.angle+'°';paint();}
 if(cfg.kind==='polyAnalyze'&&cfg.mode==='repair'){studio.offset=Math.round(clamp(190-p.y-119,0,70));$('polyOffset').value=studio.offset;$('polyOffsetValue').textContent=studio.offset===0?'0 · düzgün':'Sapma: '+studio.offset;paint();}
}

// Matematik Atlası v0.6: MAT.5.1.1 + MAT.5.1.2, forty genuine number/problem missions.
let numericState={task:null,choice:null,selectedDigit:null,selectedPack:null,plan:null};
const numDiv=$('numberLab'),numScene=$('numLabScene'),numButtons=$('numLabButtons'),numInputs=$('numLabInputs'),numPreview=$('numLabPreview');
const numSmall=['','bir','iki','üç','dört','beş','altı','yedi','sekiz','dokuz'];
const numTens=['','on','yirmi','otuz','kırk','elli','altmış','yetmiş','seksen','doksan'];
function numberTrio(n){n=Number(n);if(!n)return '';const h=Math.floor(n/100),ten=Math.floor(n/10)%10,one=n%10;
 return [h?(h===1?'yüz':numSmall[h]+' yüz'):'',numTens[ten],numSmall[one]].filter(Boolean).join(' ')}
function numberRead(n){n=Number(n);if(!Number.isInteger(n)||n<0||n>999999999999)return '—';if(n===0)return 'sıfır';
 let groups=[Math.floor(n/1e9),Math.floor(n/1e6)%1000,Math.floor(n/1000)%1000,n%1000],names=['milyar','milyon','bin',''];
 return groups.map((v,i)=>v===0?'':i===2&&v===1?'bin':(numberTrio(v)+(names[i]?' '+names[i]:''))).filter(Boolean).join(' ')}
function numberFmt(n){return Number(n).toLocaleString('tr-TR')}
function numNode(tag,txt,parent,cl){let node=document.createElement(tag);if(txt!=null)node.textContent=String(txt);if(cl)node.className=cl;(parent||numScene).appendChild(node);return node}
function numChip(txt,cl){return numNode('span',txt,numScene,'num-chip'+(cl?' '+cl:''))}
function numInput(key,label,placeholder,kind='number'){
 const holder=numNode('label',null,numInputs);numNode('span',label,holder);const inp=numNode('input',null,holder);
 inp.dataset.key=key;inp.id='num_'+key;inp.autocomplete='off';inp.inputMode=kind==='time'?'numeric':'numeric';inp.type='text';inp.placeholder=placeholder;
 inp.addEventListener('input',updateNumPreview);return inp;}
function numField(key){return numInputs.querySelector('[data-key="'+key+'"]')?.value.trim()||''}
function numAsInt(v){if(!/^\s*\d{1,3}(?:[. ]\d{3})*\s*$|^\s*\d+\s*$/.test(v))return null;const n=Number(v.replace(/[.\s]/g,''));return Number.isSafeInteger(n)?n:null}
function numAsTime(v){const m=v.match(/^\s*(\d{1,2}):(\d{2})\s*$/);if(!m)return null;const h=+m[1],mm=+m[2];return h<=23&&mm<60?h*60+mm:null}
function numTime(value){const h=Math.floor(value/60),mm=value%60;return String(h%24).padStart(2,'0')+':'+String(mm).padStart(2,'0')}
function numberPick(items,group,select){
 if(group)numNode('div',group,numButtons,'small');
 const row=numNode('div',null,numButtons,'num-buttons');row.style.margin='4px 0';
 items.forEach((item)=>{let button=numNode('button',item.label,row);button.type='button';button.dataset.value=String(item.value);
 button.onclick=()=>{select(item.value);for(const b of row.querySelectorAll('button'))b.classList.toggle('chosen',b===button);updateNumPreview()};});return row;
}
function renderNumberLab(a){
 numDiv.hidden=!a.numeric;if(!a.numeric)return;const cfg=a.numeric;numericState={task:a,choice:null,selectedDigit:null,selectedPack:null,plan:null};
 numScene.replaceChildren();numButtons.replaceChildren();numInputs.replaceChildren();
 $('numLabTitle').textContent=a.mekanik;$('numLabInstructions').textContent=cfg.instruction;
 const groups=['Milyarlar','Milyonlar','Binler','Birler'];
 if(a.ogrenme_ciktisi==='MAT.5.1.1'){
  const num=cfg.number,values=[Math.floor(num/1e9),Math.floor(num/1e6)%1000,Math.floor(num/1000)%1000,num%1000],idx=values.findIndex(v=>v>0);
  if(cfg.kind==='compose'){
   numChip('🔐 Okunuş: '+numberRead(num),'call');
   groups.forEach((name,i)=>{if(i>=idx)numInput('group'+i,name+' bölüğü','0–999')});
  } else if(cfg.kind==='read'){
   for(let i=idx;i<4;i++){numChip(groups[i]+'\n'+String(values[i]).padStart(i===idx?1:3,'0'))}
   const options=cfg.choices.map(v=>({value:v,label:numberRead(v)}));
   const shift=Number(a.gorev_no)%options.length;options.push(...options.splice(0,shift));
   numberPick(options,'Hangisi doğru okunuştur?',v=>numericState.choice=v);
  }else if(cfg.kind==='place'){
   const chars=String(num).split('');let container=numNode('div',null,numScene,'num-buttons');container.style.justifyContent='center';
   chars.forEach((digit,i)=>{let b=numNode('button',digit,container);b.type='button';b.dataset.digitIndex=i;
    b.style.minWidth='32px';b.style.padding='9px';b.onclick=()=>{numericState.selectedDigit=i;container.querySelectorAll('button').forEach(x=>x.classList.toggle('chosen',x===b));updateNumPreview()};
    if((chars.length-i-1)%3===0&&i<chars.length-1)numNode('span','.',container,'num-sep');});
   const p=cfg.placePower;const pnames=['birler','onlar','yüzler','binler','on binler','yüz binler','milyonlar','on milyonlar','yüz milyonlar','milyarlar','on milyarlar','yüz milyarlar'];
   numNode('div','🎯 '+pnames[p]+' basamağını işaretle.',numButtons,'small');
   numInput('value','Seçtiğin rakamın basamak değeri','Örn. 300000');
  }else if(cfg.kind==='zero'){
   for(let i=idx;i<4;i++)numChip(groups[i]+'\n'+String(values[i]).padStart(i===idx?1:3,'0'),values[i]===0?'dim':'');
   numberPick(groups.slice(idx).map((name,j)=>({value:idx+j,label:name})),'Soldan ilk sıfır bölük hangisi?',v=>numericState.choice=v);
  }
 }else{
  const c=cfg;numChip('📍 '+c.context,'call');
  const models={supply:[['Başlangıç',c.a],['Gelen',c.b],['Ayrılan',c.c]],garden:[['Sıra',c.a],['Her sırada',c.b],['Tutmayınca',c.c]],transport:[['Kutu',c.a],['Araç kapasitesi',c.b]],market:[['A · adet',c.a],['A · fiyat',c.b+' TL'],['B · adet',c.c],['B · fiyat',c.d+' TL']],time:[['Başlama',numTime(c.a)],['Süre',Math.floor(c.b/60)+' sa '+c.b%60+' dk']]};
  for(const [k,v] of models[c.kind])numChip(k+' · '+v);
  let plans=[c.plan,'Yalnızca topla','Çarp → Topla','Önce çıkar → Sonra böl'].filter((x,i,arr)=>arr.indexOf(x)===i).slice(0,4);
  const step=Number(a.gorev_no)%plans.length;plans.push(...plans.splice(0,step));
  numberPick(plans.map(s=>({label:s,value:s})),'1. adım · İşlem stratejini seç',v=>numericState.plan=v);
  if(c.kind==='market')numberPick([{label:'A paketi',value:'A'},{label:'B paketi',value:'B'}],'2. adım · Daha ekonomik paketi seç',v=>numericState.selectedPack=v);
  if(c.kind==='time'){
   numInput('estimate','3. adım · Tahmini bitiş saati (ss:dd)','Örn. 10:30','time');
   numInput('answer','4. adım · Hesapladığın bitiş saati (ss:dd)','Örn. 10:30','time');
  }else{
   numInput('estimate','3. adım · Yaklaşık sonucu tahmin et','Tahminin');
   numInput('answer',c.kind==='transport'?'4. adım · En az araç sayısı':c.kind==='market'?'4. adım · En düşük birim fiyat (TL)':'4. adım · Kesin sonuç','Kesin sayısal sonuç');
   if(c.kind==='transport')numInput('last','5. adım · Son araçtaki kutu sayısı','Kalan yük');
  }
 }
 updateNumPreview();
}
function updateNumPreview(){const a=numericState.task;if(!a?.numeric)return;const cfg=a.numeric;
 if(a.ogrenme_ciktisi==='MAT.5.1.1'){
  if(cfg.kind==='compose'){
   const all=[0,1,2,3].map(i=>numField('group'+i));if(all.every(v=>!v)){numPreview.textContent='Bölük kutularını doldurdukça sayının yazılışı ve okunuşu burada oluşacak.';return}
   if(all.some(v=>v!==''&&numAsInt(v)===null)||all.some(v=>v!==''&&numAsInt(v)>999)){numPreview.textContent='Her bölük 0 ile 999 arasında olmalı.';return}
   const n=all.reduce((acc,v)=>acc*1000+(v===''?0:numAsInt(v)),0);
   numPreview.textContent='Oluşturduğun sayı: '+numberFmt(n)+'\nOkunuşu: '+numberRead(n);return;
  }
  if(cfg.kind==='read'){numPreview.textContent=numericState.choice===null?'Sayıyı soldan sağa, üçer basamaklı bölükler hâlinde oku.':'Seçtiğin okunuş: '+numberRead(numericState.choice);return}
  if(cfg.kind==='place'){numPreview.textContent=numericState.selectedDigit===null?'Hedef basamağı işaretle ve basamak değerini yaz.':'İşaretlediğin rakam: '+String(cfg.number)[numericState.selectedDigit]+'. Basamak değeri alanını doldur.';return}
  if(cfg.kind==='zero'){numPreview.textContent=numericState.choice===null?'Sıfır bölükleri okunuşta seslendirilmez.':'Seçtiğin bölük: '+['Milyarlar','Milyonlar','Binler','Birler'][numericState.choice];return}
 }
 numPreview.textContent='Seçilen strateji: '+(numericState.plan||'henüz seçilmedi')+' · Tahmin: '+(numField('estimate')||'—')+' · Sonuç: '+(numField('answer')||'—')+(cfg.kind==='market'?' · Paket: '+(numericState.selectedPack||'—'):'');
}
function checkNumberLab(){const a=numericState.task;if(!a?.numeric)return;const c=a.numeric;let valid=false,reason='';
 if(a.ogrenme_ciktisi==='MAT.5.1.1'){
  if(c.kind==='compose'){
   const blocks=[0,1,2,3].map(i=>numField('group'+i));
   if(blocks.some((x,i)=>i>=([Math.floor(c.number/1e9),Math.floor(c.number/1e6)%1000,Math.floor(c.number/1000)%1000,c.number%1000].findIndex(v=>v>0))&&x==='')){reason='Her bölük kutusu dolmalı. Sıfır olan bölük için de 0 yaz.'}
   else if(blocks.some(x=>x!==''&&(numAsInt(x)===null||numAsInt(x)>999))){reason='Bölüklere 0 ile 999 arasında doğal sayı yaz.'}
   else{let got=blocks.reduce((sum,v)=>sum*1000+(v===''?0:numAsInt(v)),0);valid=got===c.number;reason=valid?'Bütün bölükleri doğru sıraya yerleştirdin.':'Bölükleri hedef okunuşla karşılaştır; özellikle sıfır olanları kontrol et.'}
  }else if(c.kind==='read'){valid=numericState.choice===c.number;reason=valid?'Okunuştaki bütün bölükler yerli yerinde.':'Milyonlar, binler ve birler bölüklerini ayrı ayrı oku.'}
  else if(c.kind==='place'){valid=numericState.selectedDigit===c.placeIndex&&numAsInt(numField('value'))===c.placeValue;reason=valid?'Doğru rakamı ve basamak değerini buldun.':'Hem doğru basamağı seçmeli hem de rakam × 10’un basamak kuvvetini yazmalısın.'}
  else if(c.kind==='zero'){valid=numericState.choice===c.zeroIndex;reason=valid?'Soldan ilk sıfır bölüğü belirledin; sıfır bölükleri okunuşta söylenmez.':'Üç basamağın tamamı sıfır olan bölüklerden soldaki ilkini bul.'}
 }else{
  if(numericState.plan!==c.plan){reason='Önce verilen ve isteneni düşünerek uygun işlem stratejisini seç.'}
  else if(c.kind==='market'&&numericState.selectedPack!==c.chosen){reason='Paketin toplam fiyatına değil, bir kalemin birim fiyatına bak.'}
  else if(numField('estimate')===''){reason='Önce bir tahmin yap; kesin hesaplamaya geçmeden büyüklüğü düşün.'}
  else if(c.kind==='time'){
   const est=numAsTime(numField('estimate')),got=numAsTime(numField('answer')),expected=numAsTime(c.answer);
   if(est===null||got===null){reason='Saatleri ss:dd biçiminde yaz (örnek 10:35).'}
   else if(Math.abs(est-expected)>c.tolerance){reason='Tahmini bitiş saatin beklenen zamandan çok uzak. Saat ve dakika sürelerini düşün.'}
   else{valid=got===expected;reason=valid?'Saat ve dakikaları doğru topladın.':'Dakikaların toplamı 60’ı aşınca yeni saat oluşur.'}
  }else{
   const est=numAsInt(numField('estimate')),got=numAsInt(numField('answer'));
   if(est===null||got===null){reason='Tahmin ve kesin sonuç için geçerli, sıfır veya pozitif tam sayı yaz.'}
   else if(Math.abs(est-c.answer)>c.tolerance){reason='Tahminin sonuçtan çok uzak; sayıları yaklaşık değerlere yuvarlayarak tekrar dene.'}
   else if(c.kind==='transport'){
    const last=numAsInt(numField('last'));
    valid=got===c.answer&&last===c.last;reason=valid?'Bölme işleminin kalanını son araçta doğru yorumladın.':'Bütün kutular taşınmalı: kalan kutular için ayrı araç gerekir. Son araçtaki yükü hesapla.';
   }else{valid=got===c.answer;reason=valid?'Seçtiğin strateji, tahmin ve kesin sonuç birbirini doğruluyor.':'İşlem planını sırayla uygula; sonucu ters işlemle kontrol et.'}
  }
 }
 if(valid){done[a.id]=true;save();render();feedback('✅ '+reason+' Görev tamamlandı.',true)}
 else{feedback('🔎 '+reason);numPreview.textContent+='\nİpucu: '+reason}
}
$('numLabVerify').onclick=checkNumberLab;
$('numLabHint').onclick=()=>feedback('💡 '+numericState.task?.ipucu);
$('numLabReset').onclick=()=>{if(numericState.task)renderNumberLab(numericState.task);feedback('Görev yeniden başlatıldı.')};

// v1.0 -- Geometrik Nicelikler: gerçek geometrik modeller ve durum tabanlı kontrol
const mLab=$('measureLab'),mDraw=$('mlDrawing'),mCtrl=$('mlControllers'),mView=$('mlPreview');
let measureState={task:null,pairs:[[2,2],[3,2]],cells:new Set(),choice:''};
function mlN(tag,parent,text,cls){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined&&text!==null)e.textContent=String(text);if(parent)parent.appendChild(e);return e}
function mlDims(p){return {w:p[0],h:p[1],area:p[0]*p[1],perimeter:2*(p[0]+p[1])}}
function mlCanon(p){return p.slice().sort((a,b)=>a-b).join('x')}
function mlSVG(pair,maxSide=12){const [w,h]=pair,width=355,height=220,cell=Math.min(17,300/maxSide,160/maxSide);let result=`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${w} birim genişliğinde ve ${h} birim yüksekliğinde dikdörtgen"><defs><pattern id="mlMiniGrid" width="${cell}" height="${cell}" patternUnits="userSpaceOnUse"><path d="M ${cell} 0 L 0 0 0 ${cell}" fill="none" stroke="#54849a" stroke-width=".9"/></pattern></defs><rect x="23" y="18" width="${w*cell}" height="${h*cell}" fill="#164e63" stroke="#74ecbf" stroke-width="2"/><rect x="23" y="18" width="${w*cell}" height="${h*cell}" fill="url(#mlMiniGrid)"/><text x="${23+w*cell/2}" y="${28+h*cell}" font-size="12" text-anchor="middle" fill="#dbfff6">${w} × ${h}</text></svg>`;return result}
function mlSlider(group,which,dim,maxSide){const label=mlN('label',group,(dim===0?'Yatay kenar':'Düşey kenar')+': ');const val=mlN('strong',label,measureState.pairs[which][dim]+' birim');const slide=mlN('input',label);slide.type='range';slide.min='1';slide.max=String(maxSide);slide.step='1';slide.value=measureState.pairs[which][dim];slide.dataset.pair=String(which);slide.dataset.dim=String(dim);slide.addEventListener('input',()=>{measureState.pairs[which][dim]=Number(slide.value);val.textContent=slide.value+' birim';mlUpdate()});return slide}
function mlInputs(keys){const grid=mlN('div',mCtrl,null,'ml-rows');for(const [id,title,placeholder] of keys){const lab=mlN('label',grid,title);const inp=mlN('input',lab);inp.id='ml_'+id;inp.className='ml-input';inp.type='number';inp.min='0';inp.inputMode='numeric';inp.placeholder=placeholder||'Sonucun';inp.addEventListener('input',mlUpdate)}return grid}
function mlVal(id){const n=document.getElementById('ml_'+id);if(!n||n.value.trim()===''||!/^[0-9]+$/.test(n.value.trim()))return null;const val=Number(n.value);return Number.isSafeInteger(val)?val:null}
function mlParagraph(parent,text){const p=mlN('p',parent,text);p.style.margin='7px 0';return p}
function mlPairControls(index,maxSide){const pan=mlN('div',null,null,'ml-panel');mlN('h4',pan,index===0?'A tasarımı':'B tasarımı');mlSlider(pan,index,0,maxSide);mlSlider(pan,index,1,maxSide);const stat=mlN('div',pan,'','ml-stat');stat.id='mlPairStat'+index;return pan}
function mlChoices(items){const bar=mlN('div',mCtrl,null,'ml-compare');mlParagraph(mCtrl,'Karşılaştırma: Diğer nicelik de aynı kalır mı?');for(const [val,label] of items){const b=mlN('button',bar,label);b.type='button';b.dataset.mlchoice=val;b.addEventListener('click',()=>{measureState.choice=val;bar.querySelectorAll('button').forEach(x=>x.classList.toggle('chosen',x===b));mlUpdate()})}}
function mlExplanation(){const label=mlN('label',mCtrl,'Gözlemini kendi cümlenle açıkla (isteğe bağlı nottur):');const ta=mlN('textarea',label);ta.id='mlReason';ta.rows=2;ta.placeholder='Dikdörtgenin kenarlarını değiştirdim; çünkü…';ta.style.minHeight='75px'}
function renderMeasureLab(a){
 mLab.hidden=!a.geometryLab;if(!a.geometryLab){measureState.task=null;return}
 const c=a.geometryLab;measureState={task:a,pairs:[[2,2],[3,2]],cells:new Set(),choice:''};mDraw.replaceChildren();mCtrl.replaceChildren();mView.textContent='';$('mlTitle').textContent=a.mekanik;
 let desc='';if(c.kind==='perimeter')desc=c.two?'İki farklı kenar çifti seç; her ikisi de hedef çevreye ulaşsın.':'Sürgüleri kullanarak doğru çevreyi sağlayan dikdörtgen çiz.';
 if(c.kind==='paint')desc='Karelere dokunarak bir dikdörtgen boya. Yanlış boyadığın kareye yeniden dokunabilirsin.';
 if(c.kind==='compare')desc='İki ayrı dikdörtgenin kenarlarını değiştirip ölçülerini karşılaştır.';
 if(c.kind==='project')desc='Bir tasarım seç; çevre, alan ve toplam maliyeti kendin hesapla.';
 $('mlDesc').textContent=desc;
 if(c.kind==='paint'){
  const counts=mlN('div',mDraw,null,'ml-counters');counts.id='mlCounts';const grid=mlN('div',mDraw,null,'ml-grid');grid.setAttribute('aria-label','8 çarpı 8 kareli çalışma alanı');
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
    const b=mlN('button',grid,'');b.type='button';const index=y*8+x;b.dataset.square=String(index);b.setAttribute('aria-label',`${y+1}. satır ${x+1}. sütun`);b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(measureState.cells.has(index))measureState.cells.delete(index);else measureState.cells.add(index);b.classList.toggle('filled');b.setAttribute('aria-pressed',String(measureState.cells.has(index)));mlUpdate()});
  }
  mlInputs([['area','Boyalı alan kaç birim karedir?','Sayı yaz'],['cols','Bir satırda kaç kare var?','Sayı yaz']]);
 }else{
  const panels=mlN('div',mCtrl,null,'ml-panels');panels.appendChild(mlPairControls(0,c.maxSide));if((c.kind==='perimeter'&&c.two)||c.kind==='compare')panels.appendChild(mlPairControls(1,c.maxSide));
  const area=mlN('div',mDraw);area.id='mlRectDisplay';
  if(c.kind==='perimeter'&&c.two){mlChoices([['different','Alanları farklı olabilir'],['same','Alanları her zaman aynıdır']]);mlExplanation()}
  if(c.kind==='compare'){mlChoices([['different','Diğer nicelik farklı olabilir'],['same','Diğer nicelik de aynı olmak zorundadır']]);mlExplanation()}
  if(c.kind==='project'){
   mlParagraph(mCtrl,`1 m çit: ${c.unitFence} TL · 1 m² döşeme: ${c.unitFloor} TL`);
   mlInputs([['perimeter','Hesapladığın çevre (m)','Çevre'],['area','Hesapladığın alan (m²)','Alan'],['cost','Hesapladığın toplam maliyet (TL)','Maliyet']]);
  }
 }
 mlUpdate();
}
function mlUpdate(){const a=measureState.task;if(!a?.geometryLab)return;const c=a.geometryLab;
 if(c.kind==='paint'){
  const chosen=measureState.cells.size;const counts=$('mlCounts');counts.replaceChildren();for(const text of ['Boyalı kare: '+chosen,'Alan tahmini: '+(mlVal('area')??'—'),'Satırdaki kare: '+(mlVal('cols')??'—')])mlN('span',counts,text);
  mView.textContent=`Boyalı ${chosen} birim kare var. Seçilen karelerin bir dikdörtgen oluşturduğundan emin ol. Her satırda aynı sayıda kare bulunmalı.`;return
 }
 const indices=(c.kind==='compare'||(c.kind==='perimeter'&&c.two))?[0,1]:[0];const holder=$('mlRectDisplay');holder.replaceChildren();
 const tiles=mlN('div',holder,null,'ml-panels');for(const i of indices){const pan=mlN('div',tiles,null,'ml-panel');mlN('h4',pan,i===0?'A tasarımı':'B tasarımı');const d=mlDims(measureState.pairs[i]);const img=mlN('div',pan);img.innerHTML=mlSVG(measureState.pairs[i],c.maxSide);$('mlPairStat'+i).textContent=`Alan: ${d.area} br² · Çevre: ${d.perimeter} br`;}
 const a0=mlDims(measureState.pairs[0]);let summary=`A tasarımı: ${a0.w}×${a0.h} · Alan ${a0.area} · Çevre ${a0.perimeter}`;
 if(indices.length>1){const b=mlDims(measureState.pairs[1]);summary+=`\nB tasarımı: ${b.w}×${b.h} · Alan ${b.area} · Çevre ${b.perimeter}`;}
 if(c.kind==='project')summary+=`\nÇit bedeli = ${a0.perimeter}×${c.unitFence}, zemin bedeli = ${a0.area}×${c.unitFloor}. Toplamı sen hesaplayıp yaz.`;
 mView.textContent=summary;
}
function mlAnalyzeSquares(){const cells=Array.from(measureState.cells);if(!cells.length)return null;const xs=cells.map(n=>n%8),ys=cells.map(n=>Math.floor(n/8)),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),width=maxX-minX+1,height=maxY-minY+1;return {width,height,count:cells.length,full:cells.length===width*height&&cells.every(n=>(n%8)>=minX&&(n%8)<=maxX&&Math.floor(n/8)>=minY&&Math.floor(n/8)<=maxY)}}
function checkMeasureLab(){const a=measureState.task;if(!a?.geometryLab)return;const c=a.geometryLab,d1=mlDims(measureState.pairs[0]),d2=mlDims(measureState.pairs[1]);let ok=false,msg='';
 if(c.kind==='perimeter'){
  const first=d1.perimeter===c.target;
  if(!c.two){ok=first;msg=ok?'Çevreni doğru hesaplayıp hedef uzunluğa ulaştın.':'İki uzun ve iki kısa kenarın toplamı hedef çevreye eşit olmalı.'}
  else{const distinct=mlCanon(measureState.pairs[0])!==mlCanon(measureState.pairs[1]);ok=first&&d2.perimeter===c.target&&distinct&&d1.area!==d2.area&&measureState.choice==='different';
    msg=ok?'İki farklı dikdörtgen aynı çevreye sahip ama alanları farklı; bunu gözleminle açıkladın.':'İki modelin de çevresi hedefe eşit olmalı; farklı kenar çiftleri seç, alanları karşılaştır ve gözlemini yaz.'}
 }else if(c.kind==='paint'){
  const rect=mlAnalyzeSquares();ok=!!(rect&&rect.full&&mlVal('area')===rect.count&&mlVal('cols')===rect.width&&rect.count===c.area&&
      (c.mode==='dimensions'?rect.width===c.cols&&rect.height===c.rows:rect.height===c.requiredRows));
  msg=ok?'Birim kareler tam bir dikdörtgen oldu. Satır × sütun kuralıyla alanı buldun.':'Boyalı karelerin arasında boşluk bulunmamalı. İstenen satır ve sütun sayısına uygun dikdörtgen boya, alanını ve bir sıradaki kare sayısını yaz.';
 }else if(c.kind==='compare'){
  const isArea=c.mode==='area',target1=isArea?d1.area:d1.perimeter,target2=isArea?d2.area:d2.perimeter,other1=isArea?d1.perimeter:d1.area,other2=isArea?d2.perimeter:d2.area;
  ok=target1===c.target&&target2===c.target&&mlCanon(measureState.pairs[0])!==mlCanon(measureState.pairs[1])&&other1!==other2&&measureState.choice==='different';
  msg=ok?'İlişkiyi iki farklı modelle doğruladın ve gözlemini kaydettin.':'İki dikdörtgenin hedef ölçüsü eşit, kenar çiftleri farklı ve diğer ölçüsü farklı olmalı. Karşılaştırma seçimini ve açıklamanı tamamla.';
 }else if(c.kind==='project'){
  const total=d1.perimeter*c.unitFence+d1.area*c.unitFloor;let meets=false;
  if(c.mode==='budget')meets=d1.area>=c.minArea&&total<=c.maxCost;
  if(c.mode==='fence')meets=d1.perimeter===c.exactPerimeter&&d1.area>=c.minArea;
  if(c.mode==='tiles')meets=d1.area===c.exactArea&&d1.perimeter<=c.maxPerimeter;
  if(c.mode==='balance')meets=d1.area>=c.minArea&&d1.perimeter<=c.maxPerimeter;
  ok=meets&&mlVal('perimeter')===d1.perimeter&&mlVal('area')===d1.area&&mlVal('cost')===total;
  msg=ok?'Tasarım tüm gerçek yaşam kısıtlarını sağlıyor; çevre, alan ve maliyet hesapların doğru.':(!meets?'Bu dikdörtgen belirtilen alan, çit veya bütçe sınırlarını karşılamıyor. Kenarları yeniden ayarla.':'Dikdörtgen uygun; şimdi çevre, alan ve toplam maliyet hesaplarını düzelt.');
 }
 if(ok){done[a.id]=true;save();render();feedback('✅ '+msg+' Görev tamamlandı.',true)}else feedback('🔎 '+msg);
}
$('mlVerify').onclick=checkMeasureLab;
$('mlHint').onclick=()=>feedback('💡 '+measureState.task?.ipucu);
$('mlReset').onclick=()=>{if(measureState.task)renderMeasureLab(measureState.task);feedback('Görev yeniden başlatıldı.')};

// v1.0 FRACTION GAME ENGINE — learning outcome MAT.5.1.3 / MAT.5.1.4
const fxRoot=$('fractionLab'),fxBoard=$('fxBoard'),fxCtrl=$('fxControls'),fxPrev=$('fxPreview');
let fxState={task:null};
function fxN(tag,parent,txt,cls){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==null&&txt!==undefined)e.textContent=txt;if(parent)parent.appendChild(e);return e}
function fxButton(parent,text,cb,cls=''){const b=fxN('button',parent,text,cls);b.type='button';b.addEventListener('click',cb);return b}
function fxInput(parent,label,id,type='number',placeholder='Yanıtını yaz'){const wrap=fxN('label',parent,label,'fx-input-wrap');const e=fxN('input',wrap);e.id=id;e.type=type;e.placeholder=placeholder;if(type==='number'){e.inputMode='decimal';e.step='any'}return e}
function fxInputNum(id){const v=document.getElementById(id)?.value.trim();if(!v||!/^\d+(?:[.,]\d+)?$/.test(v))return null;const n=Number(v.replace(',','.'));return Number.isFinite(n)?n:null}
function fxFraction(num,den){return num+'/'+den}
function fxStrip(parent,num,den,extra){const row=fxN('div',parent,null,'fx-striprow');if(extra)fxN('span',row,extra,'fx-name');const strip=fxN('div',row,null,'fx-strip');strip.style.gridTemplateColumns=`repeat(${den}, minmax(0,1fr))`;for(let k=0;k<den;k++){let p=fxN('span',strip,'','fx-slab'+(k<num?' shade':''));p.title='1/'+den;}return row}
function fxSlider(parent,label,id,min,max,value,step,onchange){const lab=fxN('label',parent,label,'fx-slide');const output=fxN('strong',lab,String(value));const inp=fxN('input',lab);inp.type='range';inp.id=id;inp.min=min;inp.max=max;inp.step=step;inp.value=value;inp.addEventListener('input',()=>{output.textContent=id.startsWith('fxMark')?(Number(inp.value)/1000).toLocaleString('tr-TR',{maximumFractionDigits:3}):inp.value;onchange(Number(inp.value))});return inp}
function fxReason(parent){const wrap=fxN('label',parent,'Gerekçeni yaz (isteğe bağlı not):','fx-input-wrap');const ta=fxN('textarea',wrap);ta.id='fxReason';ta.rows=2;ta.placeholder='Neden bu sıralamayı veya seçimi yaptım?';return ta}
function fxColoredGrid(parent,howMany,total,mode='normal') {const bar=fxN('div',parent,null,'fx-tiles');bar.style.gridTemplateColumns=`repeat(${total<=12?total:10},minmax(0,1fr))`;for(let i=0;i<total;i++){const btn=fxButton(bar,'',()=>{if(fxState.paint.has(i))fxState.paint.delete(i);else fxState.paint.add(i);fxUpdate()});btn.className='fx-tile'+(fxState.paint.has(i)?' marked':'');btn.dataset.fxcell=String(i);btn.setAttribute('aria-label',(i+1)+'. parça');btn.setAttribute('aria-pressed',String(fxState.paint.has(i)));}return bar}
function fxRender(){let a=fxState.task;if(!a)return;const c=a.fractionLab;fxBoard.replaceChildren();fxCtrl.replaceChildren();fxPrev.textContent='';$('fxTitle').textContent=a.mekanik;$('fxInstructions').textContent=({wall:'Bölme sayısını seç, eş parçalara dokunarak boyama yap.',equiv:'İlk ve ikinci şeridin aynı büyüklüğü gösterdiğini ispatla.',hundred:'Yüzlük panonun karelerine veya satırlarına dokunarak boyama yap.',line:'Noktayı sayı doğrusunda kaydır, tam ve kesir kısmını yaz.',pair:'Kesirleri sayı doğrusuna yerleştirip karşılaştırma işaretini seç.',order:'Kartları en küçükten en büyüğe sırayla seç.',near:'Referans noktasına en yakın kesri seç ve nedenini açıkla.',resource:'Gerçek yaşamda hangi seçeneğe öncelik vereceğini göster.'})[c.kind];
 if(c.kind==='wall'){
  fxSlider(fxCtrl,'Bir bütünü kaç eş parçaya ayıracaksın?','fxParts',1,12,fxState.parts,1,v=>{fxState.parts=v;fxState.paint.clear();fxUpdate()});fxN('div',fxBoard,'Parçaları kendin boya:','fx-explain');
 } else if(c.kind==='equiv'){
  fxN('div',fxBoard,'Başlangıç modeli: '+fxFraction(c.num,c.den),'fx-explain');fxStrip(fxBoard,c.num,c.den);fxN('div',fxBoard,`Yeni model (${c.factor} kat küçük parça):`,'fx-explain');fxInput(fxCtrl,'Yeni kesrin payı:','fxNum');fxInput(fxCtrl,'Yeni kesrin paydası:','fxDen');
 } else if(c.kind==='hundred'){
  fxN('div',fxBoard,'Yüzlük tablo: boyadığın her kare %1 eder.','fx-explain');const rows=fxN('div',fxCtrl,null,'fx-rowbuttons');for(let r=0;r<10;r++){fxButton(rows,(r+1)+'. sırayı boya',()=>{let ids=Array.from({length:10},(_,i)=>r*10+i);const full=ids.every(x=>fxState.paint.has(x));for(let x of ids){if(full)fxState.paint.delete(x);else fxState.paint.add(x)}fxUpdate()},'fx-rowbutton')}
  fxInput(fxCtrl,'Yüzde gösterimi (% işareti olmadan):','fxPercent');fxInput(fxCtrl,'Ondalık gösterimi (ör. 0,35):','fxDecimal','text','0,35');
 } else if(c.kind==='line'){
  fxN('div',fxBoard,'0 ile 3 arasında uygun noktayı işaretle.','fx-explain');fxSlider(fxCtrl,'Noktayı sağa/sola kaydır:','fxLine',0,3*c.den,0,1,v=>{fxState.marker=v;fxUpdate()});
  fxInput(fxCtrl,'Tam kısım:','fxWhole');fxInput(fxCtrl,`Kesir kısmının payı (payda ${c.den}):`,'fxRemain');
 } else if(c.kind==='pair'){
  fxStrip(fxBoard,c.a,c.b,'A');fxStrip(fxBoard,c.c,c.d,'B');const row=fxN('div',fxCtrl,null,'fx-row');for(const [key,label] of [['>','A > B'],['<','A < B'],['=','A = B']]){const b=fxButton(row,label,()=>{fxState.choice=key;fxUpdate()},'fx-option');b.dataset.choice=key}
  fxSlider(fxCtrl,'A noktasının sayı doğrusundaki yeri (0–1):','fxMarkA',0,1000,0,5,v=>{fxState.ma=v;fxUpdate()});fxSlider(fxCtrl,'B noktasının sayı doğrusundaki yeri (0–1):','fxMarkB',0,1000,0,5,v=>{fxState.mb=v;fxUpdate()});
 } else if(c.kind==='order'){
  fxN('p',fxCtrl,'En küçük karttan başla:','fx-explain');const list=fxN('div',fxCtrl,null,'fx-cardline');c.cards.forEach((card,i)=>{const b=fxButton(list,card.label,()=>{if(!fxState.order.includes(i)){fxState.order.push(i);fxUpdate()}},'fx-option');b.dataset.orderidx=i});fxButton(fxCtrl,'↶ Seçimi geri al',()=>{fxState.order.pop();fxUpdate()},'fx-secondary');
 } else if(c.kind==='near'){
  fxN('p',fxCtrl,'Karşılaştıracağın kesri seç:','fx-explain');const list=fxN('div',fxCtrl,null,'fx-cardline');c.cards.forEach((card,i)=>{const b=fxButton(list,card.label,()=>{fxState.choice=i;fxUpdate()},'fx-option');b.dataset.nearidx=i});fxReason(fxCtrl);
 } else if(c.kind==='resource'){
  fxN('p',fxCtrl,'Doğru karar verebilmek için üç oranı aynı ölçekte düşün:','fx-explain');const list=fxN('div',fxCtrl,null,'fx-cardline');c.cards.forEach((card,i)=>{const b=fxButton(list,card.name+' · '+card.label,()=>{fxState.choice=i;fxUpdate()},'fx-option');b.dataset.resourceidx=i});fxInput(fxCtrl,'Seçtiğin oranın yüzde karşılığı:','fxSelectedPercent');fxReason(fxCtrl);
 }
 fxUpdate()
}
function fxNumberLine(parent,marks,anchor=null,max=1){const wrap=fxN('div',parent,null,'fx-linewrap');let line=fxN('div',wrap,null,'fx-linetrack');for(let i=0;i<=max;i++){
 const lbl=fxN('span',line,String(i),'fx-tick');lbl.style.left=(100*i/max)+'%';}
 if(anchor!==null){const x=fxN('div',line,'★','fx-anchor');x.style.left=(100*anchor/max)+'%';}
 for(const m of marks){const x=fxN('div',line,'●','fx-marker '+(m.cls||''));x.style.left=(100*Math.max(0,Math.min(max,m.v))/max)+'%';x.title=m.label}
 return wrap
}
function fxUpdate(){const a=fxState.task;if(!a)return;const c=a.fractionLab,kind=c.kind;
 if(kind==='wall'){fxBoard.replaceChildren();fxN('div',fxBoard,`${c.wholes} bütün · her biri ${fxState.parts} eş parça`,'fx-explain');for(let w=0;w<c.wholes;w++){fxN('div',fxBoard,(w+1)+'. bütün','fx-explain');const row=fxN('div',fxBoard,null,'fx-tiles');row.style.gridTemplateColumns=`repeat(${fxState.parts},minmax(0,1fr))`;for(let i=0;i<fxState.parts;i++){const k=w*fxState.parts+i;const b=fxButton(row,'',()=>{fxState.paint.has(k)?fxState.paint.delete(k):fxState.paint.add(k);fxUpdate()},'fx-tile'+(fxState.paint.has(k)?' marked':''));b.dataset.fxcell=k;b.setAttribute('aria-label',`${w+1}. bütün, ${i+1}. parça`);b.setAttribute('aria-pressed',String(fxState.paint.has(k)))} }fxPrev.textContent=`Boyalı model: ${fxState.paint.size}/${fxState.parts} bütün. Pay ve payda arasındaki eşitliği kontrol et.`
 }else if(kind==='equiv'){const old=fxBoard.querySelector('.fx-targetgrid');if(old)old.remove();const row=fxN('div',fxBoard,null,'fx-targetgrid');const box=fxN('div',row,null,'fx-tiles');box.style.gridTemplateColumns=`repeat(${c.den*c.factor}, minmax(0,1fr))`;for(let i=0;i<c.den*c.factor;i++){const b=fxButton(box,'',()=>{fxState.paint.has(i)?fxState.paint.delete(i):fxState.paint.add(i);fxUpdate()},'fx-tile'+(fxState.paint.has(i)?' marked':''));b.dataset.fxcell=i;b.setAttribute('aria-pressed',String(fxState.paint.has(i)))}fxPrev.textContent=`Yeni şeritte ${fxState.paint.size} parça boyalı. İkinci model ilk modelle aynı miktarı göstermeli.`
 }else if(kind==='hundred'){const old=fxBoard.querySelector('.fx-hundred');if(old)old.remove();const box=fxN('div',fxBoard,null,'fx-hundred');box.style.gridTemplateColumns='repeat(10,minmax(0,1fr))';for(let i=0;i<100;i++){const b=fxButton(box,'',()=>{fxState.paint.has(i)?fxState.paint.delete(i):fxState.paint.add(i);fxUpdate()},'fx-tile'+(fxState.paint.has(i)?' marked':''));b.dataset.fxcell=i;b.setAttribute('aria-label',(i+1)+'. kare');b.setAttribute('aria-pressed',String(fxState.paint.has(i)))}fxPrev.textContent=`${fxState.paint.size} / 100 kare boyandı. Farklı gösterimlerin eşitliğini hesapla.`
 }else if(kind==='line'){fxBoard.querySelectorAll('.fx-linewrap').forEach(x=>x.remove());fxNumberLine(fxBoard,[{v:fxState.marker/c.den,label:'Seçtiğin konum'}],null,3);fxPrev.textContent=`İşaretlediğin nokta: ${fxState.marker}/${c.den}. Tam ve kesir kısmını doğru yaz.`
 }else if(kind==='pair'){fxBoard.querySelectorAll('.fx-linewrap').forEach(x=>x.remove());fxNumberLine(fxBoard,[{v:fxState.ma/1000,label:'A',cls:'fx-marker-a'},{v:fxState.mb/1000,label:'B',cls:'fx-marker-b'}]);fxCtrl.querySelectorAll('[data-choice]').forEach(b=>{b.classList.toggle('chosen',b.dataset.choice===fxState.choice)});fxPrev.textContent=`Sayı doğrusundaki işaretlerin konumlarını gözlemle. A ile B arasındaki ilişkiyi kontrol et.`
 }else if(kind==='order'){fxBoard.replaceChildren();const seq=fxN('div',fxBoard,null,'fx-order-seq');fxState.order.forEach((i,k)=>fxN('div',seq,(k+1)+'. '+c.cards[i].label,'fx-order-chip'));fxCtrl.querySelectorAll('[data-orderidx]').forEach(b=>b.disabled=fxState.order.includes(Number(b.dataset.orderidx)));fxPrev.textContent=`Seçilen ${fxState.order.length}/3 kart. 0–1 arasındaki değerlerini düşün.`
 }else if(kind==='near'){fxBoard.replaceChildren();fxNumberLine(fxBoard,[],c.anchor);const legend=fxN('div',fxBoard,null,'fx-legend');c.cards.forEach((x,i)=>fxN('span',legend,`${x.label} = yaklaşık ${x.value.toLocaleString('tr-TR',{maximumFractionDigits:3})}`));fxCtrl.querySelectorAll('[data-nearidx]').forEach(b=>b.classList.toggle('chosen',Number(b.dataset.nearidx)===fxState.choice));fxPrev.textContent='Kesirlerin referans noktasına uzaklıklarını karşılaştır ve kendi gerekçeni yaz.'
 }else if(kind==='resource'){fxBoard.replaceChildren();const box=fxN('div',fxBoard,null,'fx-meterlist');c.cards.forEach((item,i)=>{const row=fxN('div',box,null,'fx-meterrow');fxN('span',row,item.name);const track=fxN('div',row,null,'fx-meter');const fill=fxN('div',track);fill.style.width=(item.value*100)+'%';fxN('b',row,item.label)});fxCtrl.querySelectorAll('[data-resourceidx]').forEach(b=>b.classList.toggle('chosen',Number(b.dataset.resourceidx)===fxState.choice));fxPrev.textContent='Kararını görsel doluluk çubuklarıyla karşılaştır. Seçtiğin oranın yüzde değerini hesapla.'}
}
function fxCheck(){const a=fxState.task;if(!a)return;const c=a.fractionLab;let ok=false,msg='';const selected=fxState.paint.size;
 if(c.kind==='wall'){ok=selected>0&&selected*c.den===c.num*fxState.parts&&selected<=fxState.parts*c.wholes;msg=ok?'Boyadığın parça sayısı hedef kesre eşit; denk modeli kurdun.':'Eş parçalara ayırma sayını ve boyadığın parçaları yeniden kontrol et.'}
 if(c.kind==='equiv'){ok=selected===c.num*c.factor&&fxInputNum('fxNum')===c.num*c.factor&&fxInputNum('fxDen')===c.den*c.factor;msg=ok?'Yeni pay ve payda aynı çarpanla genişletildi. İki model denk.':'Yeni pay ve paydayı aynı çarpanla bul; doğru sayıda parçayı boya.'}
 if(c.kind==='hundred'){const decimal=fxInputNum('fxDecimal');ok=selected===c.count&&fxInputNum('fxPercent')===c.count&&decimal!==null&&Math.abs(decimal-c.count/100)<1e-8;msg=ok?'Kesir, yüzde ve ondalık gösterimi eşleştirdin.':'Boyalı yüzlük kareleri say; yüzde ve ondalık gösterimlerini tekrar hesapla.'}
 if(c.kind==='line'){ok=fxState.marker===c.num&&fxInputNum('fxWhole')===Math.floor(c.num/c.den)&&fxInputNum('fxRemain')===c.num%c.den;msg=ok?'Bileşik kesri doğru yerde işaretleyip tam sayılı kesre dönüştürdün.':'Sayı doğrusundaki konum ile tam sayılı gösterim aynı büyüklüğü göstermeli.'}
 if(c.kind==='pair'){const v1=c.a/c.b,v2=c.c/c.d;const comp=v1>v2?'>':v1<v2?'<':'=';ok=fxState.choice===comp&&Math.abs(fxState.ma/1000-v1)<=.0075&&Math.abs(fxState.mb/1000-v2)<=.0075;msg=ok?'Sayı doğrusundaki konumlar ve karşılaştırma işaretin tutarlı.':'Her iki kesri de sayı doğrusunda doğru yere yaklaştır ve karşılaştırma işaretini gözden geçir.'}
 if(c.kind==='order'){const sorted=c.cards.map((_,i)=>i).sort((a,b)=>c.cards[a].value-c.cards[b].value);ok=fxState.order.length===3&&fxState.order.every((v,i)=>v===sorted[i]);msg=ok?'Kesir, yüzde ve ondalık gösterimleri doğru sıraya yerleştirdin.':'Kartları en küçük değerden en büyük değere yeniden sırala.'}
 if(c.kind==='near'){const vals=c.cards.map(x=>Math.abs(x.value-c.anchor));const min=Math.min(...vals);const winner=vals.findIndex(x=>Math.abs(x-min)<1e-10);const reason=document.getElementById('fxReason')?.value.trim()||'';ok=fxState.choice===winner;msg=ok?'Referans noktasına yakınlığı doğru karşılaştırdın; cevabın otomatik doğrulandı.':'Referans noktasına uzaklıkları kontrol edip en az bir cümle gerekçe yaz.'}
 if(c.kind==='resource'){const vals=c.cards.map(x=>x.value);const target=c.mode==='min'?Math.min(...vals):Math.max(...vals);const winner=vals.findIndex(v=>v===target);const p=fxInputNum('fxSelectedPercent');const reason=document.getElementById('fxReason')?.value.trim()||'';ok=fxState.choice===winner&&p!==null&&Math.abs(p-100*target)<1e-8;msg=ok?'Karar ve yüzde dönüşümü doğru; sonucun otomatik doğrulandı.':'Seçtiğin kart, yüzde dönüşümü ve gerekçeni yeniden kontrol et.'}
 if(ok){done[a.id]=true;save();render();feedback('✅ '+msg+' Görev tamamlandı.',true)}else feedback('🔎 '+msg)
}
function renderFractionLab(a){fxRoot.hidden=!a.fractionLab;if(!a.fractionLab){fxState.task=null;return}fxState={task:a,parts:2,paint:new Set(),marker:0,ma:0,mb:0,choice:null,order:[]};fxRender()}
$('fxVerify').addEventListener('click',fxCheck);
$('fxHint').addEventListener('click',()=>feedback('💡 '+fxState.task?.ipucu));
$('fxReset').addEventListener('click',()=>{if(fxState.task){renderFractionLab(fxState.task);feedback('Model sıfırlandı; yeniden deneyebilirsin.')}});

// MAT.5.5.1 / MAT.5.5.2: 40 offline research and critique activities
const stRoot=$('statsLab'),stBoard=$('stBoard'),stControl=$('stControls'),stReport=$('stReport');
let stState={task:null,chosen:null,counts:[],axis:4,reason:''};
function stNode(tag,parent,content,cls){const el=document.createElement(tag);if(cls)el.className=cls;if(content!==undefined&&content!==null)el.textContent=content;if(parent)parent.appendChild(el);return el}
function stButton(parent,txt,cb,cls=''){const b=stNode('button',parent,txt,cls);b.type='button';b.addEventListener('click',cb);return b}
function stOptions(options){const wrap=stNode('div',stControl,null,'st-options');options.forEach((option,i)=>{const b=stButton(wrap,option,()=>{stState.chosen=i;wrap.querySelectorAll('button').forEach((btn,j)=>btn.classList.toggle('st-picked',j===i));stRenderReport()},'st-opt');b.dataset.choice=i;b.setAttribute('aria-pressed',String(stState.chosen===i));if(stState.chosen===i)b.classList.add('st-picked')});return wrap}
function stHint(text){stNode('p',stBoard,text,'st-muted')}
function stReason(){const label=stNode('label',stControl,'İstersen nedenini kendi cümlenle yaz (puana etkisi yok):','st-reason');const ta=stNode('textarea',label);ta.id='stReason';ta.value=stState.reason||'';ta.placeholder='Veriler hangi sonuca izin veriyor, hangisine vermiyor?';ta.addEventListener('input',()=>stState.reason=ta.value.trim());return ta}
function stTable(cats,counts){const table=stNode('table',stBoard);const th=stNode('tr',table);['Kategori','Sıklık'].forEach(x=>stNode('th',th,x));cats.forEach((cat,i)=>{const tr=stNode('tr',table);stNode('td',tr,cat);stNode('td',tr,String(counts[i]))});const tr=stNode('tr',table);stNode('th',tr,'Toplam');stNode('th',tr,String(counts.reduce((s,x)=>s+x,0)))}
function stBars(cats,counts,{axis=0,max=0}={}){const wrap=stNode('div',stBoard,null,'st-chartbox');const bars=stNode('div',wrap,null,'st-columns');const top=Math.max(max,...counts,1);cats.forEach((cat,i)=>{const w=stNode('div',bars,null,'st-colwrap');stNode('b',w,String(counts[i]),'st-colvalue');const rect=stNode('div',w,null,'st-col');rect.style.height=(Math.max(0,counts[i]-axis)/Math.max(1,top-axis)*135)+'px';stNode('span',w,cat,'st-colname')});return wrap}
function stRenderReport(){const c=stState.task.statLab;const msg=c.kind==='tally'||c.kind==='build'?'Sıklık değerlerini hesaplayıp görselleştir.':c.kind==='axis'?`Grafiğin başlangıcı: ${stState.axis}. Gerçek sıklıkları karşılaştır.`:'Seçtiğin yanıtı görev yönergesindeki ölçütlerle karşılaştır.';stReport.textContent=msg;stControl.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.choice)===stState.chosen)))}
function stRender(){const task=stState.task;if(!task)return;const c=task.statLab;stBoard.replaceChildren();stControl.replaceChildren();$('stTitle').textContent=c.label;$('stDescription').textContent=c.instruction;
 if(c.kind==='question'||c.kind==='survey'||c.kind==='sample'){
  stNode('div',stBoard,c.context,'st-box st-question');stNode('p',stBoard,c.kind==='question'?'Veriyle cevaplanabilen ve tarafsız olan araştırma sorusunu seç.':c.kind==='survey'?'Araştırmanın amacına uygun, yönlendirmeyen ve özel bilgi istemeyen anket sorusunu seç.':'Hedef kitleyi en iyi temsil edecek, seçime dayalı yanlılığı azaltan örneklemi belirle.','st-muted');stOptions(c.options);
 } else if(c.kind==='tally'){
  stNode('div',stBoard,'Bu kartlar, kurgusal bir sınıf anketindeki anonim yanıtlardır:','st-tag');const tokens=stNode('div',stBoard,null,'st-tokens');c.responses.forEach((r,i)=>stNode('span',tokens,(i+1)+'. '+r,'st-token'));stHint('Her kategorinin kaç kez geçtiğini sayıp +/− tuşlarıyla sıklık tablosunu oluştur.');stCountControls(c.categories);stNode('p',stControl,'En sık gözlenen kategoriyi seç:','st-muted');stOptions(c.categories);
 } else if(c.kind==='build'){
  stTable(c.categories,c.counts);stHint('Tablodaki her kategori için sütun yüksekliğini +/− ile ayarla; eksen sıfırdan başlar.');stCountControls(c.categories);stNode('p',stControl,'Kategorilerin sıklığını karşılaştırmak için uygun gerekçeyi seç:','st-muted');stOptions(c.options);stReason();
 } else if(c.kind==='claim'){
  stTable(c.categories,c.counts);stNode('p',stBoard,'Aşağıdaki yorumlardan hangisi sadece bu verilere dayanarak söylenebilir?','st-muted');stOptions(c.options);stReason();
 } else if(c.kind==='axis'){
  stTable(c.categories,c.counts);stNode('p',stBoard,c.claim,'st-bad');stBars(c.categories,c.counts,{axis:stState.axis,max:Math.max(...c.counts)});
  const label=stNode('label',stControl,'Grafiğin düşey eksen başlangıcını değiştir:','st-reason');const x=stNode('input',label);x.type='range';x.min=0;x.max=Math.min(...c.counts)-1;x.step=1;x.value=stState.axis;const show=stNode('b',label,' Başlangıç: '+stState.axis);x.id='stAxis';x.addEventListener('input',()=>{stState.axis=+x.value;show.textContent=' Başlangıç: '+stState.axis;stRender()});stNode('p',stControl,'Grafikteki yanıltıcı etkiyi tanımla:','st-muted');stOptions(c.options);stReason();
 } else if(c.kind==='verdict'){
  stTable(c.categories,c.counts);stNode('div',stBoard,'İddia: '+c.claim,'st-box st-question');stNode('p',stControl,'İddia için veri temelli karar ver:','st-muted');stOptions(c.options);stReason();
 }
 stRenderReport()
}
function stCountControls(categories){const cnt=stNode('div',stControl,null,'st-countcontrols');categories.forEach((name,i)=>{const row=stNode('div',cnt,null,'st-countrow');stNode('strong',row,name);const ctr=stNode('div',row,null,'st-stepper');stButton(ctr,'−',()=>{stState.counts[i]=Math.max(0,stState.counts[i]-1);stUpdateCounts()},'st-minus');stNode('strong',ctr,'0','st-current');stButton(ctr,'+',()=>{stState.counts[i]=Math.min(30,stState.counts[i]+1);stUpdateCounts()},'st-plus')});stUpdateCounts()}
function stUpdateCounts(){stControl.querySelectorAll('.st-countrow').forEach((row,i)=>row.querySelector('.st-current').textContent=stState.counts[i]);stBoard.querySelector('.st-livechart')?.remove();const chart=stNode('div',stBoard,null,'st-livechart');const rows=stNode('div',chart,null,'st-columns');const cfg=stState.task.statLab;const max=Math.max(...(cfg.counts||cfg.responses.map(()=>0)),...stState.counts,1);cfg.categories.forEach((cat,i)=>{const w=stNode('div',rows,null,'st-colwrap');stNode('strong',w,String(stState.counts[i]),'st-colvalue');const bar=stNode('div',w,null,'st-col');bar.style.height=(135*stState.counts[i]/max)+'px';stNode('span',w,cat,'st-colname')});stNode('p',chart,'Toplam kayıt: '+stState.counts.reduce((a,b)=>a+b,0),'st-muted')}
function stCheck(){const a=stState.task;if(!a)return;const c=a.statLab;let ok=stState.chosen===c.correct,msg='';
 if(c.kind==='tally'){const counts=c.categories.map(x=>c.responses.filter(y=>y===x).length);ok=ok&&counts.every((n,i)=>stState.counts[i]===n);msg='Kategorileri tek tek say ve en sık görüleni belirle.'}
 if(c.kind==='build'){ok=ok&&c.counts.every((n,i)=>stState.counts[i]===n);msg='Sütunların yüksekliğini tablodaki sıklıklarla eşleştir.'}
 if(c.kind==='axis'){ok=ok&&stState.axis===0;msg='Sıfırdan başlamayan eksenin sıklık farkını nasıl abarttığını incele.'}
 
 if(ok){try{const notes=JSON.parse(localStorage.getItem('mathAtlasStatNotes')||'{}');notes[a.id]=stState.reason||'Model üzerinde doğru seçim';localStorage.setItem('mathAtlasStatNotes',JSON.stringify(notes))}catch(e){}done[a.id]=true;save();render();feedback('✅ Doğru! Matematiksel model kontrol edildi; açıklama isteğe bağlı olarak kaydedildi.',true)}else feedback('🔎 Henüz tamamlanmadı. '+(msg||'Araştırma sorusunu, örneklemi ve seçimini yeniden değerlendir.'))
}
function renderStatLab(a){stRoot.hidden=!a.statLab;if(!a.statLab){stState.task=null;return}const c=a.statLab;stState={task:a,chosen:null,counts:Array(c.categories?.length||0).fill(0),axis:c.kind==='axis'?Math.min(...c.counts)-1:0,reason:''};stRender()}
$('stVerify').addEventListener('click',stCheck);
$('stHint').addEventListener('click',()=>feedback('💡 '+(stState.task?.ipucu||'Soru, veri ve sonuç arasındaki ilişkiyi kontrol et.')));
$('stReset').addEventListener('click',()=>{if(stState.task){renderStatLab(stState.task);feedback('Araştırma istasyonu sıfırlandı.')}});
$('stExport').addEventListener('click',()=>{let notes={};try{notes=JSON.parse(localStorage.getItem('mathAtlasStatNotes')||'{}')}catch(e){}const rows=[['Görev kimliği','Öğrenme çıktısı','İsteğe bağlı öğrenci açıklaması','Tamamlandı']];for(const task of db.tasks.filter(t=>t.statLab)){rows.push([task.id,task.ogrenme_ciktisi,notes[task.id]||'',done[task.id]?'Evet':'Hayır'])}const csv='\ufeff'+rows.map(r=>r.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='MATEMATIK_ATLASI_ISTATISTIK_OGRETMEN_RAPORU.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1500)});

// v1.0 — 5. sınıf işlemlerle cebirsel düşünme: 80 etkileşimli görev.
const abRoot=$('algebraLab'),abScene=$('abScene'),abControl=$('abControls'),abReport=$('abReport');
let ab={task:null,selected:null,answer:'',reason:'',sides:[false,false],sequence:[],table:{},branch:''};
const abNode=(tag,parent,txt,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined&&txt!==null)e.textContent=String(txt);parent.appendChild(e);return e};
const abButton=(parent,txt,fn,cls)=>{const e=abNode('button',parent,txt,cls);e.type='button';e.addEventListener('click',fn);return e};
function abCard(text){return abNode('div',abScene,text,'ab-card')}
function abChoices(options){const wrap=abNode('div',abControl,null,'ab-choices');options.forEach((v,i)=>{const b=abButton(wrap,v,()=>{ab.selected=i;abControl.querySelectorAll('[data-option]').forEach(el=>{const on=Number(el.dataset.option)===i;el.setAttribute('aria-pressed',String(on));el.classList.toggle('picked',on)});abMessage('Seçimini yaptın. Şimdi modelini kontrol edebilirsin.')},'ab-choice');b.dataset.option=i;b.setAttribute('aria-pressed','false')})}
function abInput(parent,label,key,defaultValue=''){const l=abNode('label',parent,label,'ab-field');const inp=abNode('input',l);inp.type='text';inp.inputMode='numeric';inp.autocomplete='off';inp.value=defaultValue;inp.dataset.key=key;inp.addEventListener('input',()=>{ab.table[key]=inp.value;abReport.textContent='Tahminini doğrulamak için “Kontrol et” düğmesine bas.'});return inp}
function abReason(){const l=abNode('label',abControl,'Gerekçeni kendi cümlelerinle açıkla (isteğe bağlı not):','ab-field');const area=abNode('textarea',l);area.rows=2;area.placeholder='Neden böyle düşündün?';let notes={};try{notes=JSON.parse(localStorage.getItem('mathAtlasAlgebraNotes')||'{}')}catch(e){}area.value=notes[ab.task.id]||'';area.addEventListener('input',()=>{ab.reason=area.value});ab.reason=area.value}
function abMessage(txt){abReport.textContent=txt}
function abTiles(label,nums){const box=abNode('div',abScene,null,'ab-tiles');abNode('h4',box,label);nums.forEach((x,i)=>abNode('span',box,x,'ab-tile'+(i===nums.length-1?' ab-last':'')))}
function abRender(){const t=ab.task;if(!t)return;const c=t.algebraLab;abScene.replaceChildren();abControl.replaceChildren();$('abTitle').textContent=c.label;$('abDescription').textContent=c.instruction;abMessage('Modeli incele, tahmin yap ve sonra kontrol et.');
 if(c.kind==='balance'){
  abCard('Başlangıç: '+c.start+' = '+c.start);const sc=abNode('div',abScene,null,'ab-balance');const L=abNode('div',sc,'Sol kefe: '+c.start,'ab-pan');const R=abNode('div',sc,'Sağ kefe: '+c.start,'ab-pan');
  const same=(x)=>c.op==='+'?x+c.k:c.op==='-'?x-c.k:c.op==='×'?x*c.k:x/c.k;
  const w=abNode('div',abControl,null,'ab-choices');[0,1].forEach((i)=>abButton(w,(i===0?'Sol':'Sağ')+' kefeye '+c.op+c.k+' uygula',()=>{ab.sides[i]=true;(i===0?L:R).textContent=(i===0?'Sol':'Sağ')+' kefe: '+same(c.start);(i===0?L:R).classList.add('ab-applied');abMessage(ab.sides.every(Boolean)?'İki kefeyi karşılaştır. Eşitlik korundu mu?':'Henüz tek kefeye işlem uyguladın. Dengeyi gözle.')},'ab-side'));
 } else if(c.kind==='property'||c.kind==='distribute'||c.kind==='counter'||c.kind==='first'||c.kind==='translate'||c.kind==='debugOrder'||c.kind==='debugFlow'){
  abCard(c.display);abChoices(c.options);
 } else if(c.kind==='evaluate'){
  abCard(c.display);abChoices(c.options);abInput(abControl,'İşlemin sonucu:', 'value');
 } else if(c.kind==='extend'){
  abTiles('Örüntünün ilk terimleri',c.sequence);abInput(abControl,c.ask+' terim kaçtır?','value');abChoices(c.options);
 } else if(c.kind==='nth'){
  abTiles('Örüntü',c.sequence);abChoices(c.options);abInput(abControl,c.ask+'. terim kaçtır?','value');
 } else if(c.kind==='shape'){
  const figure=abNode('div',abScene,null,'ab-figures');c.steps.forEach((v,i)=>{const w=abNode('div',figure,null,'ab-figure');abNode('span',w,(i+1)+'. adım','ab-figlabel');const d=abNode('div',w,null,'ab-dots');for(let j=0;j<v;j++)abNode('span',d,'','ab-dot')});abInput(abControl,c.ask+'. şekilde kaç nokta olmalı?','value');abChoices(c.options);
 } else if(c.kind==='ruleTest'){
  abTiles('Kuralı keşfet',c.sequence);abChoices(c.options);abInput(abControl,c.ask+'. terim kaçtır?','value');
 } else if(c.kind==='flow'){
  abCard('Akış şemasının parçalarını doğru sıraya koy. Bir karta dokunarak sıraya ekle.');const flowPreview=abNode('div',abScene,null,'ab-flowchart');const pool=abNode('div',abControl,null,'ab-choices');const selected=abNode('div',abControl,null,'ab-sequence');
  const redraw=()=>{flowPreview.replaceChildren();ab.sequence.forEach((v,j)=>{if(j)abNode('div',flowPreview,'↓','ab-arrow');const kind=v==='Başla'||v==='Bitir'?'ab-terminal':v.startsWith('Giriş')||v.startsWith('Yazdır')?'ab-io':'ab-process';abNode('div',flowPreview,v,'ab-flowstep '+kind)});selected.replaceChildren();ab.sequence.forEach((v,j)=>abButton(selected,(j+1)+'. '+v,()=>{ab.sequence.splice(j,1);redraw()},'ab-step'));pool.replaceChildren();c.shuffle.forEach(v=>{if(!ab.sequence.includes(v))abButton(pool,v,()=>{ab.sequence.push(v);redraw()},'ab-choice')});abMessage('Seçilen adım: '+ab.sequence.length+'/'+c.steps.length)};redraw();
 } else if(c.kind==='table'){
  abCard('Sayı makinesi: Giriş x → '+c.formula+' → Çıkış y');const tb=abNode('div',abControl,null,'ab-table');c.xs.forEach(x=>abInput(tb,'Giriş '+x+' için çıkış:',String(x)));
 } else if(c.kind==='branch'){
  abCard(c.display);abChoices(c.options);abInput(abControl,'Makinenin çıktısı:','value');
 }
 if(['balance','property','distribute','counter','first','evaluate','translate','debugOrder','extend','nth','shape','ruleTest','flow','table','branch','debugFlow'].includes(c.kind))abReason();
}
function abValidNumber(text,value){if(text===undefined||text===null)return false;const s=String(text).trim().replace(',','.');if(!/^-?\d+(?:\.\d+)?$/.test(s))return false;return Math.abs(Number(s)-value)<1e-9}
function abCheck(){if(!ab.task)return;const c=ab.task.algebraLab;let ok=false;let tip='';
 if(c.kind==='balance'){ok=ab.sides.every(Boolean);tip='Eşitliğin iki tarafına aynı geçerli işlemi uyguladığında denge korunur.'}
 else if(['property','distribute','counter','first','translate','debugOrder','debugFlow'].includes(c.kind)){ok=ab.selected===c.correct;tip='Seçimindeki sayısal ilişkiyi tekrar karşılaştır.'}
 else if(['evaluate','extend','nth','shape','ruleTest','branch'].includes(c.kind)){ok=ab.selected===c.correct&&abValidNumber(ab.table.value,c.value);tip='Hem açıklamanı hem de hesapladığın sayıyı kontrol et.'}
 else if(c.kind==='table'){ok=c.xs.every(x=>abValidNumber(ab.table[String(x)],c.k*x+c.b));tip='Her girişe aynı aritmetik adımlar uygulanmalı.'}
 else if(c.kind==='flow'){ok=ab.sequence.join('|')===c.steps.join('|');tip='Akış şemasının önce giriş, sonra işlem, ardından çıktı ve bitiş aşamaları olmalı.'}
 if(!ok){feedback('🔎 '+tip);abMessage('Bir deneme daha yapabilirsin.');return}
 if(ab.reason.trim())try{const notes=JSON.parse(localStorage.getItem('mathAtlasAlgebraNotes')||'{}');notes[ab.task.id]=ab.reason.trim();localStorage.setItem('mathAtlasAlgebraNotes',JSON.stringify(notes))}catch(e){}
 done[ab.task.id]=true;save();render();feedback('✅ Matematiksel modelin/yanıtın doğru. Gerekçe varsa isteğe bağlı not olarak kaydedildi.',true)
}
function renderAlgebraLab(t){abRoot.hidden=!t.algebraLab;if(!t.algebraLab){ab.task=null;return}ab={task:t,selected:null,answer:'',reason:'',sides:[false,false],sequence:[],table:{},branch:''};abRender()}
$('abVerify').addEventListener('click',abCheck);
$('abHint').addEventListener('click',()=>feedback('💡 '+(ab.task?.ipucu||'İşlem adımlarını tekrar değerlendir.')));
$('abReset').addEventListener('click',()=>{if(ab.task){renderAlgebraLab(ab.task);feedback('Atölye sıfırlandı.')}});

// Matematik Atlası v1.1, 5.Sınıf Öznel Olasılık (MAT.5.6.1 / 5.6.2)
const prRoot=$('probabilityLab'),prScene=$('prScene'),prControls=$('prControls'),prReport=$('prReport');
let pr={task:null,value:50,choice:'',trials:0,hits:0};
let prDrafts={};try{prDrafts=JSON.parse(localStorage.getItem('mathAtlasProbabilityReasons')||'{}')||{}}catch(e){}
function prNode(tag,parent,content,cls){const el=document.createElement(tag);if(content!==undefined&&content!==null)el.textContent=String(content);if(cls)el.className=cls;if(parent)parent.appendChild(el);return el}
function prMessage(str,good){prReport.textContent=str;prReport.className='pr-report'+(good===true?' ok':good===false?' error':'')}
function prDrawParts(n,d,red=false){const p=prNode('div',prScene,null,'pr-meter');p.setAttribute('role','img');p.setAttribute('aria-label',d+' eş parçadan '+n+' tanesi '+(red?'kırmızı':'yeşil'));for(let i=0;i<d;i++)prNode('span',p,null,'pr-segment'+(i<n?(red?' red':' active'):''));prNode('div',prScene,n+' / '+d+' eş parça','pr-subtle')}
function prBalls(parent,r,b,title){const card=prNode('div',parent,null,'pr-bag');prNode('h4',card,title);const balls=prNode('div',card,null,'pr-ballset');balls.setAttribute('role','img');balls.setAttribute('aria-label',r+' kırmızı, '+b+' mavi top');for(let i=0;i<r;i++)prNode('span',balls,null,'pr-ball pr-red');for(let i=0;i<b;i++)prNode('span',balls,null,'pr-ball pr-blue');prNode('p',card,r+' kırmızı · '+b+' mavi');return card}
function prChoices(options,labels){options.forEach((option,i)=>{const label=labels?labels[i]:option;const btn=prNode('button',prControls,null,'pr-option');btn.type='button';if(labels){const prefix=prNode('span',btn,option,'pr-option-prefix');prefix.setAttribute('aria-hidden','true');}prNode('span',btn,label);btn.setAttribute('aria-label',String(label));btn.setAttribute('aria-pressed',String(pr.choice===option));btn.onclick=()=>{pr.choice=option;prControls.querySelectorAll('button.pr-option').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));prMessage('Seçimin kaydedildi. İstersen kararını kontrol et.')};});}
function prTrial(c){const total=c.red+c.blue;const hit=Math.random()*total<c.red;pr.trials++;if(hit)pr.hits++;prMessage('Deneme '+pr.trials+': '+(hit?'kırmızı':'mavi')+' top geldi. '+pr.hits+'/'+pr.trials+' kırmızı gözlendi. Tek bir sonuç olasılığı kesinleştirmez; kararını torbadaki sayıların ilişkisine dayandır.')}
function prDrawSlider(){const c=pr.task.probabilityLab;const title=prNode('div',prControls,'Tahminini 0–1 aralığında yerleştir:','pr-subtle');const box=prNode('div',prControls,null);box.style.gridColumn='1 / -1';const slider=prNode('input',box);slider.type='range';slider.min=0;slider.max=100;slider.step=5;slider.value=pr.value;slider.className='pr-slider';slider.id='prScale';slider.setAttribute('aria-label','Olasılık tahmini, yüzde 0 ile 100 arasında');const txt=prNode('div',box,null,'pr-value');const ticks=prNode('div',box,null,'pr-scale');prNode('span',ticks,'0 · İmkânsız');prNode('span',ticks,'1/2');prNode('span',ticks,'1 · Kesin');function update(){txt.textContent='%'+pr.value+' = '+(pr.value/100).toLocaleString('tr-TR',{maximumFractionDigits:2});slider.setAttribute('aria-valuetext','Yüzde '+pr.value)}update();slider.oninput=()=>{pr.value=Number(slider.value);update();prMessage('Spektrumdaki yerini ayarladın; kontrol etmeye hazırsın.')};}
function prRender(){if(!pr.task)return;const c=pr.task.probabilityLab;prScene.replaceChildren();prControls.replaceChildren();$('prTitle').textContent=c.label;$('prDescription').textContent=c.prompt;prMessage('Modeli incele, tahminde bulun ve gerekçeni düşün.');const reason=['bag','compare','fair','justify'].includes(c.kind);$('prReasonLabel').hidden=!reason;$('prReason').hidden=!reason;$('prReason').value=prDrafts[pr.task.id]||'';
 if(['spectrum','place','convert'].includes(c.kind))prDrawParts(c.n,c.d,c.kind==='convert');
 if(['spectrum','place'].includes(c.kind))prDrawSlider();
 if(c.kind==='boundary')prNode('div',prScene,c.statement,'pr-term');
 if(c.kind==='bag'||c.kind==='justify')prBalls(prScene,c.red,c.blue,'Renk torbası');
 if(c.kind==='compare'){const row=prNode('div',prScene,null,'pr-dual');prBalls(row,c.a[0],c.a[1],'A torbası');prBalls(row,c.b[0],c.b[1],'B torbası');}
 if(c.kind==='fair'){prNode('div',prScene,'Bir ödül oyunu adil olacaksa iki renk de eşit olasılıklı olmalıdır.','pr-term');const row=prNode('div',prScene,null,'pr-dual');c.sets.forEach((s,i)=>prBalls(row,s[0],s[1],String.fromCharCode(65+i)+' seçeneği'));}
 if(['convert','boundary','bag','compare','fair','justify'].includes(c.kind))prChoices(c.options,c.kind==='justify'?c.reasons:null);
 if(['bag','compare'].includes(c.kind)){const button=prNode('button',prControls,c.kind==='compare'?'🎲 A torbasından bir deneme yap':'🎲 Bir deneme yap','pr-sim');button.type='button';button.onclick=()=>{let r,b;if(c.kind==='compare'){[r,b]=c.a;}else{r=c.red;b=c.blue;}prTrial({red:r,blue:b})};prNode('p',prControls,'Denemelerin sonuçları çeşitlilik gösterebilir; kararın doğru olması için tek bir denemenin sonucuna güvenme.','pr-subtle')}
}
function renderProbabilityLab(task){prRoot.hidden=!task.probabilityLab;if(!task.probabilityLab){pr.task=null;return;}pr={task,value:50,choice:'',trials:0,hits:0};prRender()}
$('prReason').addEventListener('input',e=>{if(!pr.task)return;prDrafts[pr.task.id]=e.target.value;try{localStorage.setItem('mathAtlasProbabilityReasons',JSON.stringify(prDrafts))}catch(e){}});
function prCheck(){if(!pr.task)return;const c=pr.task.probabilityLab;const ok=['spectrum','place'].includes(c.kind)?pr.value===c.target:pr.choice===c.correct;const hasChoice=['spectrum','place'].includes(c.kind)||!!pr.choice;const needReason=['bag','compare','fair','justify'].includes(c.kind);const reason=$('prReason').value.trim();
 if(!hasChoice){prMessage('Önce kendi tahminini veya açıklama seçeneğini belirle.',false);return}
 if(!ok){document.dispatchEvent(new CustomEvent('atlas:legacyfeedback',{detail:{taskId:pr.task.id,status:'wrong'}}));prMessage('🔎 Yeniden incele: '+c.reason+' Sayılara ve eş bölgelere dikkat et.',false);return}
 
 done[pr.task.id]=true;save();render();feedback('✅ Model ve karar doğru! '+(needReason?'Yazılı gerekçen isteğe bağlı not olarak kaydedildi. ':'')+c.reason,true);
}
$('prVerify').addEventListener('click',prCheck);
$('prHint').addEventListener('click',()=>{if(pr.task)prMessage('💡 '+pr.task.probabilityLab.reason)});
$('prReset').addEventListener('click',()=>{if(pr.task)renderProbabilityLab(pr.task)});

// v1.2 Factor-Lab: 80 görev (MAT.6.1.1–MAT.6.1.4), tüm sayısal işlemler deterministik.
const ftRoot=$('factorLab'),ftVisual=$('ftVisual'),ftControls=$('ftControls'),ftStatus=$('ftStatus');
let ft={task:null,choice:null,selected:new Set(),entries:[],rows:1,witness:null};
let ftDraft={};try{ftDraft=JSON.parse(localStorage.getItem('mathAtlasFactorReasons')||'{}')||{}}catch(e){}
function ftNode(tag,parent,txt,cls){const el=document.createElement(tag);if(txt!==undefined&&txt!==null)el.textContent=String(txt);if(cls)el.className=cls;if(parent)parent.appendChild(el);return el}
function ftSay(s,bad=false){ftStatus.className='ft-status'+(bad?' error':'');ftStatus.textContent=s}
function ftMetric(text){ftNode('div',ftVisual,text,'ft-meta')}
function ftPill(parent,text){return ftNode('span',parent,text,'ft-pill')}
function ftModel(n,label){const b=ftNode('div',ftVisual,null,'ft-board');ftPill(b,label||'Sayı');ftPill(b,n)}
function ftChoices(opts,multi=true,labeler=null){ftControls.replaceChildren();opts.forEach((x)=>{const btn=ftNode('button',ftControls,labeler?labeler(x):String(x));btn.type='button';btn.setAttribute('aria-pressed',String(multi?ft.selected.has(String(x)):ft.choice===String(x)));btn.onclick=()=>{
 if(multi){if(ft.selected.has(String(x)))ft.selected.delete(String(x));else ft.selected.add(String(x));}else ft.choice=String(x);
 for(const el of ftControls.querySelectorAll('button'))el.setAttribute('aria-pressed',String(multi?ft.selected.has(el.dataset.choice):ft.choice===el.dataset.choice));ftSay('Seçimin değişti. Şimdi kararını doğrulayabilirsin.');
 };btn.dataset.choice=String(x)});}
function ftGrid(n,columns){const grid=ftNode('div',ftVisual,null,'ft-grid');grid.style.gridTemplateColumns='repeat('+columns+', minmax(0,24px))';for(let k=0;k<n;k++)ftNode('div',grid,'','ft-cell');grid.setAttribute('role','img');grid.setAttribute('aria-label',n+' kareden oluşan, '+columns+' sütunlu dikdörtgen');}
function ftTimeline(a,b,max){const timeline=ftNode('div',ftVisual,null,'ft-timeline');const maxTicks=Math.min(max,72);for(let v=0;v<=maxTicks;v++){if(v&&v%1!==0)continue;const el=ftNode('span',timeline,String(v),'ft-tick'+(v>0&&v%a===0?' hit-a':'')+(v>0&&v%b===0?' hit-b':''));if(v%a!==0&&v%b!==0&&maxTicks>40&&v%2!==0)el.style.opacity='.35'}ftMetric('Sarı üst çizgi: '+a+' dakikalık döngü · Mavi alt çizgi: '+b+' dakikalık döngü');}
function ftReasonSync(c){$('ftReasonWrap').hidden=!c.needsReason;$('ftReason').value=ftDraft[ft.task.id]||''}
function ftBuild(){const c=ft.task.factorLab;ftVisual.replaceChildren();ftControls.replaceChildren();$('ftTitle').textContent=c.label;$('ftDescription').textContent=c.prompt;ftReasonSync(c);ftSay('Modeli incele; uygun seçimleri yapıp doğrula.');
 if(c.kind==='array'){
  ftModel(c.n,'Toplam fidan');ftMetric('Sütun sayısı '+c.w+'. Satır sayısını +/− ile değiştir.');
  const row=ftNode('div',ftControls,null,'ft-counter');row.style.gridColumn='1 / -1';
  const minus=ftNode('button',row,'−');const count=ftNode('div',row,ft.rows,'ft-ans');const plus=ftNode('button',row,'+');
  const picture=ftNode('div',ftVisual,null);function sync(){count.textContent=ft.rows;picture.replaceChildren();if(ft.rows*c.w<=100){const grid=ftNode('div',picture,null,'ft-grid');grid.style.gridTemplateColumns='repeat('+c.w+', minmax(0,24px))';for(let i=0;i<ft.rows*c.w;i++)ftNode('div',grid,null,'ft-cell');grid.setAttribute('role','img');grid.setAttribute('aria-label',ft.rows+' satır, '+c.w+' sütun, toplam '+ft.rows*c.w+' kare');}}
  minus.onclick=()=>{ft.rows=Math.max(1,ft.rows-1);sync()};plus.onclick=()=>{ft.rows=Math.min(20,ft.rows+1);sync()};sync();return;
 }
 if(c.kind==='tree'){
  ftModel(c.n,'Hedef sayı');ftMetric('Asal kartlara basarak asal çarpanlar çarpımını oluştur. Aynı kartı tekrar kullanabilirsin.');
  const product=ftNode('div',ftVisual,'Henüz kart seçilmedi.','ft-ans');const update=()=>{product.textContent=ft.entries.length?ft.entries.join(' × ')+' = '+ft.entries.reduce((a,b)=>a*b,1):'Henüz kart seçilmedi.'};
  c.options.forEach(x=>{const b=ftNode('button',ftControls,String(x));b.onclick=()=>{if(ft.entries.length<12){ft.entries.push(x);update();ftSay('Asal çarpımını oluşturuyorsun.')}}});
  const undo=ftNode('button',ftControls,'↶ Son kartı sil');undo.onclick=()=>{ft.entries.pop();update()};return;
 }
 if(c.kind==='primality'){
  ftModel(c.n,'İncelenen sayı');ftMetric('Asal ise yalnız “Asal” seç. Asal değilse “Asal değil” seçip onu bölen bir sayı göster.');
  const row=ftNode('div',ftControls,null);row.style.gridColumn='1 / -1';row.style.display='flex';row.style.gap='8px';
  ['Asal','Asal değil'].forEach(x=>{const b=ftNode('button',row,x);b.dataset.choice=x;b.onclick=()=>{ft.choice=x;row.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.choice===x)));ftSay('Sınıflandırmanı seçtin.')}});
  const chips=ftNode('div',ftControls,null,'ft-board');chips.style.gridColumn='1 / -1';ftNode('div',chips,'Bölen kanıtı (asal değilse):','ft-label');
  c.options.forEach(x=>{const b=ftNode('button',chips,String(x));b.onclick=()=>{ft.witness=x;chips.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===b)))}});return;
 }
 if(c.kind==='sync'){ftModel(c.a,'1. döngü');ftMetric('Diğer döngü: '+c.b+' dakika');ftTimeline(c.a,c.b,c.answer*2)}
 else if(c.kind==='grouping'){ftModel(c.a,'Limon');ftPill(ftVisual,c.b+' portakal');ftMetric('Bütün paketlerde aynı sayıda meyve bulunmalı, hiç meyve artmamalı.');}
 else if(c.kind==='bothmult'){ftModel(c.a,'Birinci sayı');ftPill(ftVisual,c.b+' ikinci sayı');ftMetric('Ortak katlar iki sayının da katıdır.');}
 else if(c.kind==='bothdiv'){ftModel(c.a,'Birinci sayı');ftPill(ftVisual,c.b+' ikinci sayı');ftMetric('Ortak bölen her iki sayıyı da kalansız böler.');}
 else if(['factorhunt','multiples','gate','digit','route','primefactors','sieve'].includes(c.kind)){
  if(c.n)ftModel(c.n,'Hedef sayı');
  if(c.kind==='digit'){ftModel(c.base,'Eksik basamak');}
  if(c.kind==='sieve')ftMetric('1 asal değildir. 2 en küçük asal sayıdır; diğer adaylar için 1 ve kendisi dışında bölen ara.');
  if(c.kind==='factorhunt')ftMetric('Bir çarpan, hedefi kalansız böler.');
  if(c.kind==='multiples')ftMetric('Katlar aynı adımlarla ilerler.');
  if(c.kind==='gate')ftMetric('2, 3, 4, 5, 6, 9, 10 kapılarını kontrol et.');
 }
 else if(c.kind==='claim'){ftMetric(c.statement)}
 else if(c.kind==='rule'){ftMetric('Hedef bölen: '+c.n)}
 const single=['sync','grouping','claim','rule'].includes(c.kind);
 ftChoices(c.options??(['Doğru','Yanlış']),!single,(x)=>c.kind==='rule'?String.fromCharCode(65+c.options.indexOf(x))+'. '+x:String(x));
}
function renderFactorLab(t){ftRoot.hidden=!t.factorLab;if(!t.factorLab){ft.task=null;return}ft={task:t,choice:null,selected:new Set(),entries:[],rows:1,witness:null};ftBuild()}
$('ftReason').addEventListener('input',e=>{if(!ft.task)return;ftDraft[ft.task.id]=e.target.value;try{localStorage.setItem('mathAtlasFactorReasons',JSON.stringify(ftDraft))}catch(e){}});
function ftVerify(){if(!ft.task)return;const c=ft.task.factorLab;let ok=false;
 if(c.kind==='array')ok=ft.rows===c.answer;
 else if(c.kind==='tree')ok=JSON.stringify([...ft.entries].sort((a,b)=>a-b))===JSON.stringify([...c.answers].sort((a,b)=>a-b));
 else if(c.kind==='primality')ok=ft.choice===c.answer&&(c.prime||ft.witness!==null&&c.n%ft.witness===0&&ft.witness>1&&ft.witness<c.n);
 else if(c.answers)ok=JSON.stringify([...ft.selected].map(Number).sort((a,b)=>a-b))===JSON.stringify([...c.answers].sort((a,b)=>a-b));
 else if(c.kind==='rule')ok=ft.choice===String(c.options[c.answer]);
 else ok=ft.choice===String(c.answer);
 if(!ok){if(ft.selected.size||ft.entries.length||ft.choice!==null||ft.witness!==null||ft.rows!==1)document.dispatchEvent(new CustomEvent('atlas:legacyfeedback',{detail:{taskId:ft.task.id,status:'wrong'}}));ftSay('Bu model henüz uygun değil. Sayılar arasındaki ilişkiyi tekrar kontrol et.',true);return}
 
 done[ft.task.id]=true;save();
 const dots=$('numbergrid').querySelectorAll('button');if(dots[taskIndex])dots[taskIndex].classList.add('done');
 const completed=pack().filter(x=>done[x.id]).length;const total=db.tasks.filter(x=>done[x.id]).length;
 $('progress').textContent='Bu öğrenme çıktısı: '+completed+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev. Tamamlanan görevler bu tarayıcıda saklanır.';$('donecount').textContent='✓ '+total+' tamamlandı';themeMap();
 ftSay('✅ Doğru model! Çözümün ekranda korunuyor; sonraki göreve geçebilirsin.');
 feedback('✅ Matematiksel model veya seçim doğru! '+(c.needsReason?'Açıklaman isteğe bağlı not olarak kaydedildi. ':'')+'Bir sonraki göreve geçebilirsin.',true)
}
$('ftCheck').onclick=ftVerify;
$('ftHint').onclick=()=>{if(ft.task)ftSay('💡 '+ft.task.factorLab.hint)};
$('ftReset').onclick=()=>{if(ft.task)renderFactorLab(ft.task)};

function renderDecimalLab(a){
  window.MatematikAtlasDecimal.render(a.atlas51?{...a,decimalLab:null}:a,()=>{
    done[a.id]=true;save();
    const buttons=$('numbergrid').querySelectorAll('button');if(buttons[taskIndex])buttons[taskIndex].classList.add('done');
    const count=pack().filter(x=>done[x.id]).length,total=db.tasks.filter(x=>done[x.id]).length;
    $('progress').textContent='Bu öğrenme çıktısı: '+count+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev. Tamamlanan görevler bu tarayıcıda saklanır.';
    $('donecount').textContent='✓ '+total+' tamamlandı';themeMap();
    feedback('✅ Matematiksel model doğrulandı. İstasyonun sonucunu inceleyebilirsin.',true);
  });
}
function renderExperimentLab(a){
  window.MatematikAtlasExperiment.render(a,()=>{gateDone(a,()=>{
    done[a.id]=true;save();
    for(const btn of $('numbergrid').querySelectorAll('button')){
      if(btn.title==='Görev '+a.gorev_no)btn.classList.add('done');
    }
    const count=pack().filter(x=>done[x.id]).length;
    const total=db.tasks.filter(x=>done[x.id]).length;
    $('progress').textContent='Bu öğrenme çıktısı: '+count+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev. Tamamlanan görevler bu tarayıcıda saklanır.';
    $('donecount').textContent='✓ '+total+' tamamlandı';themeMap();
    feedback('✅ Deney görevi tamamlandı. Grafik ve gözlemler ekranda korunuyor. Yazılı yorumun isteğe bağlıdır; puanlanmaz.',true);
  });});
}
function renderAppliedLab(a){
  window.MatematikAtlasApplied.render(a,()=>{
    done[a.id]=true;save();
    const buttons=$('numbergrid').querySelectorAll('button');if(buttons[taskIndex])buttons[taskIndex].classList.add('done');
    const count=pack().filter(x=>done[x.id]).length,total=db.tasks.filter(x=>done[x.id]).length;
    $('progress').textContent='Bu öğrenme çıktısı: '+count+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev. Tamamlanan görevler bu tarayıcıda saklanır.';
    $('donecount').textContent='✓ '+total+' tamamlandı';themeMap();
    feedback('✅ Matematiksel model tamamlandı; çözüm ekranda kalıyor. Açıklama notun puanlanmaz.',true);
  });
}
function renderGeometry6Lab(a){
  window.MatematikAtlasGeometry6.render(a,()=>{gateDone(a,()=>{
    done[a.id]=true;save();
    const buttons=$('numbergrid').querySelectorAll('button');if(buttons[taskIndex])buttons[taskIndex].classList.add('done');
    const count=pack().filter(x=>done[x.id]).length,total=db.tasks.filter(x=>done[x.id]).length;
    $('progress').textContent='Bu öğrenme çıktısı: '+count+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev.';
    $('donecount').textContent='✓ '+total+' tamamlandı';themeMap();
    feedback('✅ Geometrik model kontrol edildi. Matematiksel gerekçe notun puanlanmaz.',true);
  });});
}
function renderResearchLab(a){
  window.MatematikAtlasResearch.render(a,()=>{gateDone(a,()=>{
    done[a.id]=true;save();
    const buttons=$('numbergrid').querySelectorAll('button');if(buttons[taskIndex])buttons[taskIndex].classList.add('done');
    const count=pack().filter(x=>done[x.id]).length,total=db.tasks.filter(x=>done[x.id]).length;
    $('progress').textContent='Bu öğrenme çıktısı: '+count+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev. Kayıtlar bu tarayıcıdadır.';
    $('donecount').textContent='✓ '+total+' tamamlandı';themeMap();
    feedback('✅ Veri modeli doğrulandı. Yorumunun doğruluğunu puanlamaya dahil edilmez.',true);
  });});
}
function renderMeasure6Lab(a){
 window.MatematikAtlasMeasure6.render(a,()=>{
  done[a.id]=true;save();const item=$('numbergrid').querySelectorAll('button')[taskIndex];if(item)item.classList.add('done');
  const completed=pack().filter(x=>done[x.id]).length,total=db.tasks.filter(x=>done[x.id]).length;
  $('progress').textContent='Bu öğrenme çıktısı: '+completed+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev.';
  $('donecount').textContent='✓ '+total+' tamamlandı';themeMap();
  feedback('✅ Geometrik ölçüm doğrulandı. Çözümün ekranda kalıyor.',true);
 });
}
function renderAlgebra6Lab(a){
 window.MatematikAtlasAlgebra6.render(a,()=>{
  done[a.id]=true;save();
  const b=$('numbergrid').querySelectorAll('button')[taskIndex];if(b)b.classList.add('done');
  const completed=pack().filter(x=>done[x.id]).length,total=db.tasks.filter(x=>done[x.id]).length;
  $('progress').textContent='Bu öğrenme çıktısı: '+completed+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev.';
  $('donecount').textContent='✓ '+total+' tamamlandı';themeMap();
  feedback('✅ Cebirsel model kontrol edildi. Oluşturduğun çalışma ekranda kalıyor.',true);
 });
}
function renderGeometry5PlusLab(a){
 window.MatematikAtlasGeometry5Plus.render(a,()=>{
  done[a.id]=true;save();
  const b=$('numbergrid').querySelectorAll('button')[taskIndex];if(b)b.classList.add('done');
  const completed=pack().filter(x=>done[x.id]).length,total=db.tasks.filter(x=>done[x.id]).length;
  $('progress').textContent='Bu öğrenme çıktısı: '+completed+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev.';
  $('donecount').textContent='✓ '+total+' tamamlandı';themeMap();
  feedback('✅ İki aşamalı geometrik model doğrulandı. Açıklamanı puanlamaya dahil edilmez.',true);
 });
}
function renderMeasure5PlusLab(a){
 window.MatematikAtlasMeasure5Plus.render(a,()=>{
  done[a.id]=true;save();const btn=$('numbergrid').querySelectorAll('button')[taskIndex];if(btn)btn.classList.add('done');
  const count=pack().filter(x=>done[x.id]).length,total=db.tasks.filter(x=>done[x.id]).length;
  $('progress').textContent='Bu öğrenme çıktısı: '+count+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev.';
  $('donecount').textContent='✓ '+total+' tamamlandı';themeMap();feedback('✅ Alan ve çevre modeli doğrulandı; gerekçeyi isteğe bağlı nottur.',true);
 });
}
function renderFraction5PlusLab(a){
 window.MatematikAtlasFraction5Plus.render(a,()=>{
  done[a.id]=true;save();const btn=$('numbergrid').querySelectorAll('button')[taskIndex];if(btn)btn.classList.add('done');
  const completed=pack().filter(x=>done[x.id]).length,total=db.tasks.filter(x=>done[x.id]).length;
  $('progress').textContent='Bu öğrenme çıktısı: '+completed+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev.';
  $('donecount').textContent='✓ '+total+' tamamlandı';themeMap();
  feedback('✅ Kesir modeli ve karşılaştırma kararın doğrulandı.',true);
 });
}
function renderNumber5PlusLab(a){
 window.MatematikAtlasNumber5Plus.render(a,()=>{
  done[a.id]=true;save();const b=$('numbergrid').querySelectorAll('button')[taskIndex];if(b)b.classList.add('done');
  const count=pack().filter(x=>done[x.id]).length,total=db.tasks.filter(x=>done[x.id]).length;
  $('progress').textContent='Bu öğrenme çıktısı: '+count+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev.';
  $('donecount').textContent='✓ '+total+' tamamlandı';themeMap();
  feedback('✅ Doğal sayılar modeli doğrulandı. Açıklamanı puanlamaya dahil edilmez.',true);
 });
}
function renderStatistics5PlusLab(a){
 window.MatematikAtlasStatistics5Plus.render(a,()=>{
  done[a.id]=true;save();const btn=$('numbergrid').querySelectorAll('button')[taskIndex];if(btn)btn.classList.add('done');
  const count=pack().filter(x=>done[x.id]).length,total=db.tasks.filter(x=>done[x.id]).length;
  $('progress').textContent='Bu öğrenme çıktısı: '+count+'/'+pack().length+' · Toplam: '+total+'/'+db.tasks.length+' görev.';
  $('donecount').textContent='✓ '+total+' tamamlandı';themeMap();
  feedback('✅ Kategorik araştırma ve kanıt kararı doğrulandı. Yazılı gerekçe isteğe bağlıdır; puanlanmaz.',true);
 });
}
// Güncel görev sayısı ve serbest genişleme
$('totalKpi').textContent='🧩 '+db.tasks.length+' görev';
$('studioKpi').textContent='🎮 '+db.tasks.filter(x=>x.studio||x.numeric||x.geometryLab||x.fractionLab||x.statLab||x.algebraLab||x.probabilityLab||x.factorLab||x.expLab||x.decimalLab||x.appliedLab||x.researchLab||x.geometry6Lab||x.algebra6Lab||x.geometryMeasureLab||x.geometry5PlusLab||x.number5PlusLab||x.fraction5PlusLab||x.measure5PlusLab||x.research5PlusLab||x.algebra5PlusLab||x.probability5PlusLab||x.atlas49||x.atlas50||x.atlas51||x.atlas52||x.atlas53||x.atlas54||x.atlas55||x.atlas56||x.atlas57||x.atlas60Lab||x.atlas61Lab).length+' etkileşimli görev';
populateThemes();
})();
