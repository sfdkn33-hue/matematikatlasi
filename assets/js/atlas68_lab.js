/* Matematik Atlası v6.8 - model and proof, no teacher approval */
(()=>{
'use strict';
const root=document.getElementById('atlas68Lab'),db=window.ATLAS_DB;if(!root||!db)return;
const bank=new Map(db.tasks.filter(t=>t.atlas68Workbench).map(t=>[t.id,t]));
let active=null,selected=[],choice='',answers=[],wrong=0,hintUsed=false;
const E=(tag,parent,text,cl)=>{const z=document.createElement(tag);if(cl)z.className=cl;if(text!==undefined)z.textContent=String(text);parent?.appendChild(z);return z};
const numeric=x=>{const s=String(x??'').trim().replaceAll(' ','').replace(',','.');return /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(s)?Number(s):NaN};
const done=()=>{try{return JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')||{}}catch{return {}}};
function illustrate(m){const v=m.visual,b=E('div',root,undefined,'a68-picture');b.setAttribute('aria-label','Matematiksel veri ve model');
 if(v.kind==='decimal') E('strong',b,v.given,'a68-large');
 else if(v.kind==='compare'){const d=E('div',b,undefined,'a68-pair');v.values.forEach((s,i)=>{const x=E('div',d);E('small',x,'Sayı '+(i+1));E('b',x,s)})}
 else if(v.kind==='dataset'){E('p',b,'Veriler (karışık sırada):');const p=E('div',b,undefined,'a68-data');v.values.forEach(x=>E('span',p,x));}
 else if(v.kind==='bars'){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 340 188');s.setAttribute('role','img');s.setAttribute('aria-label',v.labels.map((x,i)=>x+': '+v.values[i]).join(', '));b.appendChild(s);
   const draw=(tag,attrs,txt)=>{const x=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,val])=>x.setAttribute(k,val));if(txt!==undefined)x.textContent=txt;s.appendChild(x)};
   const base=v.baseline||0,max=Math.max(...v.values),spread=Math.max(1,max-base);draw('line',{x1:44,y1:147,x2:323,y2:147,stroke:'#245878','stroke-width':2});draw('line',{x1:44,y1:18,x2:44,y2:147,stroke:'#245878','stroke-width':2});draw('text',{x:10,y:147,fill:'#173650','font-size':15},String(base));
   v.values.forEach((n,i)=>{const h=Math.max(3,(n-base)/spread*115),x=91+i*127;draw('rect',{x,y:147-h,width:58,height:h,rx:5,fill:i?'#ab641f':'#13678d'});draw('text',{x:x+7,y:139-h,fill:'#183950','font-size':15},String(n));draw('text',{x:x+15,y:172,fill:'#173650','font-size':15},v.labels[i])});
   E('p',b,'Düşey eksenin başlangıcı: '+base,'a68-sub');}
 else if(v.kind==='tiles'){E('p',b,'Alan modelinin satır ve sütunlarını karşılaştır.','a68-sub');const t=E('div',b,undefined,'a68-grid');['×',v.labels[0],v.labels[1],v.labels[2],'?', '?',v.labels[3],'?','?'].forEach((s,i)=>E('span',t,s,i===0?'a68-corner':i<3||i===3||i===6?'a68-header':'a68-cell'));}
}
function paint(){root.replaceChildren();if(!active){root.hidden=true;return}root.hidden=false;const a=active,m=a.atlas68Workbench;
 E('p',root,a.ogrenme_ciktisi+' · '+a.baslik,'a68-kicker');E('h3',root,a.baslik);E('p',root,a.gorev,'a68-question');illustrate(m);
 const field=E('fieldset',root,undefined,'a68-model');E('legend',field,m.mode==='order'?'Kartları sırayla diz':m.mode==='tiles'?'Karoları hücre sırasıyla yerleştir':'Doğru matematiksel kararı seç');
 if(m.mode==='decision'){
   const controls=E('div',field,undefined,'a68-pool');m.options.forEach(opt=>{const btn=E('button',controls,opt,'a68-choice');btn.type='button';btn.setAttribute('aria-pressed',String(choice===opt));if(choice===opt)btn.classList.add('selected');btn.onclick=()=>{choice=opt;paint()}});
 }else{
   const built=E('div',field,undefined,'a68-built');selected.forEach((c,i)=>E('span',built,(i+1)+'. '+c.value));if(!selected.length)E('p',built,'Seçtiğin kartlar burada sıralanacak.');
   const pool=E('div',field,undefined,'a68-pool');m.options.forEach((o,i)=>{const btn=E('button',pool,o,'a68-card');btn.type='button';btn.disabled=selected.some(x=>x.idx===i);btn.dataset.v68Card=String(i);btn.onclick=()=>{selected.push({idx:i,value:o});paint()}});
   const undo=E('button',field,'↶ Geri al','a68-secondary');undo.type='button';undo.disabled=!selected.length;undo.onclick=()=>{selected.pop();paint()};
   const reset=E('button',field,'Sıfırla','a68-secondary');reset.type='button';reset.disabled=!selected.length;reset.onclick=()=>{selected=[];paint()};
 }
 const fs=E('div',root,undefined,'a68-fields');m.numbers.forEach((n,i)=>{const lb=E('label',fs,undefined,'a68-num');E('span',lb,n.label);const inp=E('input',lb);inp.type='text';inp.inputMode='decimal';inp.dataset.v68Num=String(i);inp.setAttribute('autocomplete','off');inp.placeholder='Cevabını yaz';inp.value=answers[i]||'';inp.oninput=()=>answers[i]=inp.value});
 const acts=E('div',root,undefined,'a68-actions');const verify=E('button',acts,'✓ Modeli ve çözümü kontrol et');verify.type='button';const hint=E('button',acts,'💡 İpucu','a68-secondary');hint.type='button';
 const status=E('p',root,done()[a.id]?'Bu görev önceden tamamlandı. İstersen tekrar çöz.':'Görsel modeli ve matematiksel kanıtı birlikte tamamla.','a68-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const explanation=E('p',root,undefined,'a68-explanation');explanation.hidden=true;
 hint.onclick=()=>{hintUsed=true;window.MatematikAtlas64?.log({taskId:a.id,status:'hint',family:a.atlas63Pilot.family});explanation.hidden=false;explanation.textContent='İpucu: '+a.ipucu};
 verify.onclick=()=>{if(active!==a)return;
   const okModel=m.mode==='decision'?choice===m.expected:selected.length===m.expected.length&&selected.every((x,i)=>x.value===m.expected[i]);
   const okNumbers=m.numbers.every((x,i)=>String(answers[i]??'').trim()!==''&&Number.isFinite(numeric(answers[i]))&&Math.abs(numeric(answers[i])-x.expected)<1e-9);
   if(!okModel||!okNumbers){wrong++;window.MatematikAtlas64?.log({taskId:a.id,status:'wrong',family:a.atlas63Pilot.family,focus:!okModel?'model':'hesap'});status.textContent='Henüz doğru değil. '+(!okModel?'Kartları/seçimini':'Matematiksel kanıtını')+' yeniden dene; görev tamamlanmadı.';status.classList.add('error');if(wrong>=2&&!hintUsed){hintUsed=true;window.MatematikAtlas64?.log({taskId:a.id,status:'hint',family:a.atlas63Pilot.family,automatic:true});explanation.hidden=false;explanation.textContent='İpucu: '+a.ipucu}return;}
   const firstTry=!wrong&&!hintUsed&&!window.MatematikAtlas64?.hasAttemptsToday(a.id);
   window.__atlas68Verified=a.id;window.__atlas63Verified=a.id;document.getElementById('answer').value='1';document.getElementById('check').click();window.__atlas68Verified=null;window.__atlas63Verified=null;
   const live=root.querySelector('.a68-status');if(done()[a.id]){const saved=window.MatematikAtlas64?.log({taskId:a.id,status:'correct',family:a.atlas63Pilot.family,firstTry,hintUsed,wrongCount:wrong});if(live){live.textContent=saved===false?'⚠ Matematik doğru ancak tekrar geçmişi kaydedilemedi.':'✓ Doğru! Model ve kanıt kaydedildi.';live.classList.toggle('error',saved===false)}const ex=root.querySelector('.a68-explanation');if(ex){ex.textContent='Çözüm: '+m.explanation;ex.hidden=false}}
   else if(live){live.textContent='⚠ Çözüm doğru ama ilerleme kalıcı kaydedilemedi. JSON yedeği al.';live.classList.add('error')}
 };
}
document.addEventListener('atlas:taskrender',e=>{window.__atlas68Verified=null;active=bank.get(String(e.detail?.id))||null;selected=[];choice='';answers=[];wrong=0;hintUsed=false;paint()});
window.MatematikAtlas68={pilotCount:bank.size,number:numeric};
})();
