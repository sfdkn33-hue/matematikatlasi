from pathlib import Path
import shutil,re,json
base=Path('/mnt/data/atlas_v619_build/MATEMATIK_ATLASI_v6_19')
root=Path('/mnt/data/atlas_v620_build/MATEMATIK_ATLASI_v6_20')
if root.exists():shutil.rmtree(root)
shutil.copytree(base,root)
assets=root/'assets/js'
old={k:(assets/k).read_text() for k in ['applied.js','decimal.js']}
# Three precautions: no fake attempts from an empty form; no repeat-click evidence; no diagnosis from answer field.
s=old['applied.js'];
anchor='let valid=()=>false;'
assert s.count(anchor)==1
s=s.replace(anchor,"""let valid=()=>false, focus=()=> 'model', mathTouched=false;
const choicesReady=()=>[...controls.querySelectorAll('fieldset')].every(f=>!!f.querySelector('button[aria-pressed="true"]'));
const numericReady=()=>[...controls.querySelectorAll('input[type="text"]')].every(i=>i.value.trim()!=='' && Number.isFinite(pnum(i.value)));
const mathReady=()=>mathTouched&&choicesReady()&&numericReady();
controls.addEventListener('click',e=>{if(e.target.closest('button'))mathTouched=true});
controls.addEventListener('input',e=>{if(e.target.matches('input:not([type=hidden]),select'))mathTouched=true});
controls.addEventListener('change',e=>{if(e.target.matches('input,select'))mathTouched=true});
""",1)
anchor="if(!checkResult(good))return;st.done=true;"
assert s.count(anchor)==1
s=s.replace(anchor,"""if(!good&&mathReady())window.Atlas620Trace?.wrong(task,'6. sınıf uygulamalı problemler',focus(),controls);
if(!checkResult(good))return;st.done=true;""",1)
# Assign focus by independently examining model, choice or result. No assumption about mental misconception.
substitutions={
"valid=()=>plan()===c.strategy&&expectNumber(ans,c.answer);break;":"focus=()=>plan()!==c.strategy?'operation':'amount';valid=()=>plan()===c.strategy&&expectNumber(ans,c.answer);break;",
"valid=()=>op()==='×'&&expectNumber(ans,c.answerNum/c.answerDen);break;":"focus=()=>op()!=='×'?'operation':'quantity';valid=()=>op()==='×'&&expectNumber(ans,c.answerNum/c.answerDen);break;",
"valid=()=>Number(slider.value)===c.groups&&expectNumber(ans,c.answerNum/c.answerDen);break;":"focus=()=>Number(slider.value)!==c.groups?'groups':'shareValue';valid=()=>Number(slider.value)===c.groups&&expectNumber(ans,c.answerNum/c.answerDen);break;",
"valid=()=>op()===c.strategy&&expectNumber(ans,c.answer);break;":"focus=()=>op()!==c.strategy?'operation':'distance';valid=()=>op()===c.strategy&&expectNumber(ans,c.answer);break;",
"valid=()=>ch()===c.larger&&expectNumber(ans,c.answer);break;":"focus=()=>ch()!==c.larger?'comparison':'remaining';valid=()=>ch()===c.larger&&expectNumber(ans,c.answer);break;",
"valid=()=>op()===c.operation&&expectNumber(ans,c.answerNum/c.answerDen);break;":"focus=()=>op()!==c.operation?'operation':'result';valid=()=>op()===c.operation&&expectNumber(ans,c.answerNum/c.answerDen);break;",
"valid=()=>ch()===operation&&expectNumber(ans,c.answerNum/c.answerDen);break;":"focus=()=>ch()!==operation?'unitRule':'converted';valid=()=>ch()===operation&&expectNumber(ans,c.answerNum/c.answerDen);break;",
"valid=()=>Number(slider.value)===c.targetMm;break;":"focus=()=> 'position';valid=()=>Number(slider.value)===c.targetMm;break;",
"valid=()=>ch()===c.correct;break;":"focus=()=> 'unit';valid=()=>ch()===c.correct;break;",
"valid=()=>ch()===c.correct&&expectNumber(ans,c.valueCm);break;":"focus=()=>ch()!==c.correct?'sign':'length';valid=()=>ch()===c.correct&&expectNumber(ans,c.valueCm);break;",
"valid=()=>count.reduce((a,x,i)=>a+x*parts[i],0)===c.targetMm;break;":"focus=()=> 'blocks';valid=()=>count.reduce((a,x,i)=>a+x*parts[i],0)===c.targetMm;break;",
}
for needle,replacement in substitutions.items():
 assert s.count(needle)==(2 if needle=='valid=()=>ch()===c.correct;break;' else 1),(needle,s.count(needle))
 s=s.replace(needle,replacement,1)
 if needle=='valid=()=>ch()===c.correct;break;':s=s.replace(needle,"focus=()=> 'estimate';valid=()=>ch()===c.correct;break;",1)
# mode estimate has the same ch() string as choose and was replaced as well
assert "case 'estimate'" in s
# Optional reason text must be excluded from mathematical readiness; it is a textarea already.
# Specific slider modes: only a deliberate change can log a wrong event, tracked by 'input'.
(assets/'applied.js').write_text(s)

s=old['decimal.js']
needle="function notify(txt,bad=false){const x=$('dcStatus');if(x){x.textContent=txt;x.dataset.error=bad?'true':'false'}}"
assert s.count(needle)==1
s=s.replace(needle,"""function notify(txt,bad=false){
 const x=$('dcStatus');if(x){x.textContent=txt;x.dataset.error=bad?'true':'false'}
 if(bad&&active&&active.mathTouched&&active.lastVerify&&active.mathReady()&&
    !/^(Bölme durdu|Bölme işlemi zaten|Kalan yolu tamamlandı|Henüz|Önce|Bir basamak ve yeni kalan|\d+ basamak için)/.test(txt)){
  window.Atlas620Trace?.wrong(active.task,'6. sınıf ondalık / kesir-bölme',active.focus(),$('dcControls'));
 }
 if(active)active.lastVerify=false;
}""",1)
needle="let st={task,finished:false};active=st;root.replaceChildren();"
assert s.count(needle)==1
s=s.replace(needle,"let st={task,finished:false,mathTouched:false,lastVerify:false,mathReady:()=>false,focus:()=> 'decimal'};active=st;root.replaceChildren();",1)
needle="const c=task.decimalLab;\n let reason=null;"
assert s.count(needle)==1
s=s.replace(needle,"""const c=task.decimalLab;
 st.mathReady=()=>{
   if(!st.mathTouched)return false;
   const inputs=[...controls.querySelectorAll('input:not([type=range])')].filter(i=>i!==reason&&i.type!=='hidden');
   if(inputs.some(i=>i.type!=='text' && !i.value.trim()))return false;
   if(inputs.some(i=>i.type==='number'&&!i.value.trim()))return false;
   // A classification choice must be a deliberate pupil choice, not an untouched default.
   const options=[...controls.querySelectorAll('.dc-choice')];
   if(options.length&&!options.some(b=>b.classList.contains('dc-picked')))return false;
   return true;
 };
 const choiceModes=new Set(['cycle','denominator','match','denominatorKeys','decimalDigits','remainderTrail']);
 st.focus=()=>['denominator','cycle','match','denominatorKeys'].includes(c.mode)?'classification':(['divide','divideSteps','remainderTrail'].includes(c.mode)?'remainder':'placeValue');
 controls.addEventListener('input',e=>{if(e.target!==reason&&e.target.matches('input,select'))st.mathTouched=true});
 controls.addEventListener('change',e=>{if(e.target!==reason&&e.target.matches('input,select'))st.mathTouched=true});
 controls.addEventListener('click',e=>{if(e.target.closest('button'))st.mathTouched=true});
 actions.addEventListener('click',e=>{const b=e.target.closest('button');st.lastVerify=!!b&&!b.textContent.includes('İpucu')});
 let reason=null;""",1)
# action listeners delegated before button callbacks, note status notify returns on successful intermediate and lastVerify consumed.
(assets/'decimal.js').write_text(s)

# reuse page's 6.19 standalone source as existing baseline then replace script bodies and append new code/styles
newjs=assets/'atlas620_targeted_coach.js'
newcss=root/'assets/css/atlas620_targeted_coach.css'
newjs.write_text(Path('/mnt/data/atlas_v620_build/atlas620_targeted_coach.js').read_text())
newcss.write_text(Path('/mnt/data/atlas_v620_build/atlas620_targeted_coach.css').read_text())
index=root/'index.html';s=index.read_text();assert '</head>' in s
s=s.replace('</head>','<link rel="stylesheet" href="assets/css/atlas620_targeted_coach.css"></head>',1)
s=s.replace('<script defer src="assets/js/atlas619_geometry_coach.js"></script>','<script defer src="assets/js/atlas619_geometry_coach.js"></script><script defer src="assets/js/atlas620_targeted_coach.js"></script>',1)
s=s.replace('v6.19 · Geometride hedefli öğrenme desteği','v6.20 · 6. sınıf sayı ve uygulamalı problemler')
index.write_text(s)
single=root/'ATLAS_TEK_DOSYA.html';t=single.read_text()
for name,src in old.items():
 assert t.count(src)==1,(name,t.count(src));t=t.replace(src,(assets/name).read_text(),1)
assert '</style>' in t and '</body>' in t
t=t.replace('</style>',newcss.read_text()+'</style>',1)
t=t.replace('</body>','<script>\n'+newjs.read_text()+'\n</script></body>',1)
t=t.replace('v6.19 · Geometride hedefli öğrenme desteği','v6.20 · 6. sınıf sayı ve uygulamalı problemler')
single.write_text(t)
print('BUILT',root,'html',single.stat().st_size)
