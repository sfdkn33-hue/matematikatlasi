/* Child-friendly navigation shell — leaves task IDs, checking and existing storage untouched. */
(()=>{
'use strict';
const q=id=>document.getElementById(id), body=document.body;
const db=window.ATLAS_DB;
if(!db?.tasks?.length||!q('grade')||!q('atlasWelcome'))return;
const G=q('grade'),T=q('theme'),O=q('outcome');
const lookup=new Map(db.tasks.map(a=>[String(a.id),a]));
const codeTheme=new Map(db.outcomes.map(a=>[a.kod,a]));
const complete=()=>{try{return JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')||{}}catch{return {}}};
const stored=(key)=>{try{return localStorage.getItem(key)}catch{return null}};
const setStored=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
const validGrades=['5','6','7','8'];
let grade=validGrades.includes(stored('mathAtlasV30Grade'))?stored('mathAtlasV30Grade'):'5';
let mode='';
const symbols=['📐','🔢','🟩','🍕','📊','🧠','🎲'];
const colors=['#d9ecff','#fcebd4','#d8f4e6','#f9e4e2','#eadffb','#e1e9ff','#fff0c3'];
const palette=['#6097e8','#eba24b','#50b891','#e98572','#9972d8','#667fd6','#c99a39'];
function count(gradeValue){const tasks=db.tasks.filter(a=>String(a.sinif)===gradeValue),progress=complete();return {total:tasks.length,done:tasks.filter(x=>progress[x.id]).length};}
function setGrade(next){grade=validGrades.includes(String(next))?String(next):'5';setStored('mathAtlasV30Grade',grade);G.value=grade;G.dispatchEvent(new Event('change',{bubbles:true}));
 for(const [id,g] of validGrades.flatMap(n=>[['atlasGrade'+n,n],['atlasThemesGrade'+n,n]])){const b=q(id),on=grade===g;b.classList.toggle('is-current',on);b.setAttribute('aria-pressed',String(on))}
 q('atlasTopGrade').textContent=grade+'. sınıf'+(grade==='7'?' · 9 bölüm':'');updateProgress();if(mode==='themes')renderThemes();}
function updateProgress(){const {total,done}=count(grade),percent=total?Math.round(100*done/total):0;
 q('atlasHomeDone').textContent=done+' görev tamamlandı';q('atlasHomeFill').style.width=percent+'%';
 q('atlasHomeProgress').setAttribute('aria-valuenow',String(percent));
 q('atlasHomeCount').textContent=done?`${total} görevden ${done} tanesini tamamladın. Harika ilerliyorsun!`:`${total} görev seni bekliyor. İlk yıldızını kazan!`;
 q('atlasTinyFill').style.width=percent+'%';}
function hideNav(){body.classList.remove('atlas-nav-open');q('atlasPickTask').setAttribute('aria-expanded','false');q('atlasScreenShade').hidden=true;}
function setMode(next){mode=next;body.classList.toggle('atlas-home',next==='home');body.classList.toggle('atlas-theme-mode',next==='themes');body.classList.toggle('atlas-playing',next==='playing');
 for(const [id,visible] of [['atlasWelcome',next==='home'],['atlasThemes',next==='themes'],['atlasPlayingTop',next==='playing']])q(id).hidden=!visible;
 q('atlasTop').hidden=false;
 hideNav();window.scrollTo?.({top:0,behavior:'instant'});
 if(next==='themes')renderThemes();if(next==='home')updateProgress();
}
function firstAvailable(filter){const matches=db.tasks.filter(filter),progress=complete();const preferred=matches.filter(x=>!String(x.ogrenme_ciktisi||'').startsWith('ATLAS.8.2018.PILOT'));const ordered=preferred.length?preferred:matches;return ordered.find(x=>!progress[x.id])||ordered[0];}
function navigate(task){if(!task)return;grade=String(task.sinif);setGrade(grade);
 T.value=String(task.tema_sirasi);T.dispatchEvent(new Event('change',{bubbles:true}));
 O.value=String(task.ogrenme_ciktisi);O.dispatchEvent(new Event('change',{bubbles:true}));
 const btn=[...q('numbergrid').querySelectorAll('button')].find(b=>Number(b.textContent)===Number(task.gorev_no));
 btn?.click();setMode('playing');setStored('mathAtlasV30LastTask',String(task.id));updateTaskBar({id:task.id,theme:Number(task.tema_sirasi),outcome:task.ogrenme_ciktisi,number:task.gorev_no,title:task.baslik});
 clearDuplicatePrompt();q('title').focus({preventScroll:true});
}
function clearDuplicatePrompt(){const normalize=s=>String(s||'').trim().replace(/\s+/g,' ').toLocaleLowerCase('tr-TR').replace(/[.?!]+$/,'');const current=normalize(q('question')?.textContent);if(!current)return;const selectors=['.n5-prompt','.f5-prompt','.p5-intro','.g5x-prompt','.m5-prompt','.s5-prompt','.a5-prompt','#studioInstructions'];for(const selector of selectors){for(const node of document.querySelectorAll(selector)){node.classList.toggle('atlas-duplicate-prompt',normalize(node.textContent)===current)}}}
function updateTaskBar(detail){const th=db.themes.find(x=>String(x.sinif)===grade&&Number(x.tema_sirasi)===Number(detail.theme));
 q('atlasCurrentTheme').textContent=th?.tema||'Matematik macerası';
 const outcome=codeTheme.get(detail.outcome);const total=db.tasks.filter(x=>x.ogrenme_ciktisi===detail.outcome).length;
 q('atlasTaskNumber').textContent=`Görev ${detail.number}/${total} · ${outcome?.kod||detail.outcome}`;
}
function renderThemes(){const list=db.themes.filter(x=>String(x.sinif)===grade).sort((a,b)=>a.tema_sirasi-b.tema_sirasi),progress=complete();
 const box=q('atlasThemeCards');box.textContent='';
 list.forEach((th,i)=>{const tasks=db.tasks.filter(a=>String(a.sinif)===grade&&Number(a.tema_sirasi)===Number(th.tema_sirasi));const done=tasks.filter(a=>progress[a.id]).length;
 const b=document.createElement('button');b.type='button';b.className='atlas-theme-card';b.style.setProperty('--card-bg',colors[i%7]);b.style.setProperty('--card-bar',palette[i%7]);
 const a=document.createElement('span');a.className='atlas-theme-symbol';a.textContent=symbols[i%7];
 const name=document.createElement('span');name.className='atlas-theme-title';name.textContent=th.tema;
 const sub=document.createElement('span');sub.className='atlas-theme-subtitle';sub.textContent=th.atlas_pilot?`${tasks.length} görev`:`${tasks.length} görev · ${th.ders_saati} ders saati`;
 const bar=document.createElement('span');bar.className='atlas-theme-bar';const fill=document.createElement('span');fill.style.width=(tasks.length?100*done/tasks.length:0)+'%';bar.appendChild(fill);
 const bottom=document.createElement('span');bottom.className='atlas-theme-bottom';const label=document.createElement('span');label.textContent=`${done} tamamlandı`;const arrow=document.createElement('span');arrow.textContent='Başla →';bottom.append(label,arrow);
 b.append(a,name,sub,bar,bottom);b.onclick=()=>navigate(firstAvailable(t=>String(t.sinif)===grade&&Number(t.tema_sirasi)===Number(th.tema_sirasi)));
 box.appendChild(b)});
}
function dailyTask(){const all=db.tasks.filter(x=>String(x.sinif)===grade);const progress=complete();const unsolved=all.filter(x=>!progress[x.id]);
 if(!unsolved.length)return all[0];const date=new Date();const dayKey=`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
 // Stable within one local day; does not change saved progress until a task is solved.
 let hash=0;for(const c of dayKey+grade)hash=((hash*31)+c.charCodeAt(0))>>>0;
 return unsolved[hash%unsolved.length];}
function resume(){const candidate=lookup.get(stored('mathAtlasV30LastTask'));navigate(candidate&&String(candidate.sinif)===grade?candidate:firstAvailable(x=>String(x.sinif)===grade));}
function chooseGrade(g){setGrade(g)}
validGrades.forEach(n=>{q('atlasGrade'+n).onclick=()=>chooseGrade(n);q('atlasThemesGrade'+n).onclick=()=>chooseGrade(n)});
q('atlasContinue').onclick=resume;q('atlasExplore').onclick=()=>setMode('themes');q('atlasToday').onclick=()=>navigate(dailyTask());
q('atlasThemesBack').onclick=()=>setMode('home');q('atlasGoHome').onclick=()=>setMode('home');
q('atlasBrand').onclick=e=>{e.preventDefault();setMode('home')};
q('atlasPickTask').onclick=()=>{const open=!body.classList.contains('atlas-nav-open');body.classList.toggle('atlas-nav-open',open);q('atlasPickTask').setAttribute('aria-expanded',String(open));q('atlasScreenShade').hidden=!open;
 if(open)q('atlasTaskNav').querySelector('select')?.focus();};
q('atlasScreenShade').onclick=hideNav;
q('atlasTaskNav').addEventListener('click',e=>{if(e.target.closest('.theme-step,.numgrid button,#goNextOutcome')){hideNav();setTimeout(()=>q('title').focus({preventScroll:true}),0)}});
q('atlasTaskNav').addEventListener('change',e=>{if([G,T,O].includes(e.target))hideNav()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&body.classList.contains('atlas-nav-open')){hideNav();q('atlasPickTask').focus()}});
q('atlasThemeToggle').onclick=()=>{const dark=body.classList.toggle('atlas-dark');q('atlasThemeToggle').textContent=dark?'☀️ Açık':'🌙 Koyu';q('atlasThemeToggle').setAttribute('aria-pressed',String(dark));setStored('mathAtlasV30Dark',dark?'1':'0')};
if(stored('mathAtlasV30Dark')==='1'){body.classList.add('atlas-dark');q('atlasThemeToggle').textContent='☀️ Açık';q('atlasThemeToggle').setAttribute('aria-pressed','true')}
else q('atlasThemeToggle').setAttribute('aria-pressed','false');
document.addEventListener('atlas:taskrender',e=>{if(mode!=='playing')return;setStored('mathAtlasV30LastTask',String(e.detail.id));updateTaskBar(e.detail);clearDuplicatePrompt();updateProgress();});
// Completion listeners write progress asynchronously within existing game callbacks.
const completionObserver=new MutationObserver(()=>{if(mode==='playing')updateProgress()});completionObserver.observe(q('donecount'),{childList:true,characterData:true,subtree:true});
setGrade(grade);setMode('home');
window.MatematikAtlasV30={navigate,home:()=>setMode('home'),themes:()=>setMode('themes')};
})();
