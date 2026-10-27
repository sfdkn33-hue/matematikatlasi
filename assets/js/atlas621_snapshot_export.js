/* Atlas v6.21 — A student-chosen pseudonymous, aggregate-only learning snapshot.
   No network, no real names, no free-text notes, no raw per-task event stream.
   Download is a voluntary student action; this does not prove student identity. */
(()=>{'use strict';
 const db=window.ATLAS_DB;
 if(!db||!document.getElementById('grade'))return;
 const byId=new Map(db.tasks.map(t=>[String(t.id),t]));
 const $=id=>document.getElementById(id);
 const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch{return fallback}};
 const codeOK=s=>/^[A-Za-z0-9_-]{2,20}$/.test(s);
 const today=()=>new Date().toISOString().slice(0,10);
 const FILEFORMAT='atlas-v621-learning-summary';
 function produce(code,grade){
  if(!codeOK(code)||![5,6,7,8].includes(grade))throw Error('Öğrenci kodu veya sınıf geçersiz.');
  const finished=read('mathAtlas940Done',{}),rev626=read('mathAtlas626Done',{}),rev662=read('mathAtlas662Done',{}), events=read('mathAtlas64Attempts',[]), now=Date.now();
  const from=now-30*86400000;
  const groups=db.outcomes.filter(o=>Number(o.sinif)===grade).map(o=>{
   const tasks=db.tasks.filter(t=>String(t.ogrenme_ciktisi)===String(o.kod));
   const ids=new Set(tasks.map(t=>String(t.id)));
   const relevant=(Array.isArray(events)?events:[]).filter(e=>e&&ids.has(String(e.taskId))&&
     Number.isFinite(e.when)&&e.when>=from&&e.when<=now+5*60000&&['wrong','hint','correct'].includes(e.status));
   const focus={model:0,hesap:0,karar:0,adimlar:0};
   for(const e of relevant)if(e.status==='wrong'&&Object.hasOwn(focus,e.focus))focus[e.focus]++;
   const last=relevant.length?Math.max(...relevant.map(e=>e.when)):null;
   return {code:o.kod,total:tasks.length,done:tasks.filter(t=>finished[t.id]===true&&(!t.atlas626||rev626[t.id]===t.atlas626.revision)&&(!t.atlas662||rev662[t.id]===t.atlas662.revision)).length,
    wrong:relevant.filter(e=>e.status==='wrong').length,hint:relevant.filter(e=>e.status==='hint').length,
    correct:relevant.filter(e=>e.status==='correct').length,
    wrongTasks:new Set(relevant.filter(e=>e.status==='wrong').map(e=>e.taskId)).size,
    observedTasks:new Set(relevant.map(e=>e.taskId)).size,
    focus,lastEventDay:last?new Date(last).toISOString().slice(0,10):null};
  });
  return {format:FILEFORMAT,schema:1,code,grade,generatedAt:new Date(now).toISOString(),windowDays:30,
   outcomes:groups};
 }
 function download(s,filename){const blob=new Blob([JSON.stringify(s,null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 const area=document.createElement('section');area.className='a621-student';area.id='atlas621StudentExport';
 const top=document.querySelector('.atlas-adult-tools')||document.querySelector('.top-tools')||document.querySelector('header');
 top.insertAdjacentElement('afterend',area);
 const heading=document.createElement('div');heading.className='a621-student-heading';area.appendChild(heading);
 heading.innerHTML='<strong>📋 Öğrenme özetim</strong><small>İstersen öğretmeninle bir kod kullanarak paylaş. Adını yazmana gerek yok.</small>';
 const row=document.createElement('div');row.className='a621-student-row';area.appendChild(row);
 const l=document.createElement('label');l.textContent='Öğrenci kodun';const input=document.createElement('input');input.id='a621Code';input.maxLength=20;input.placeholder='Örn. A07';input.autocomplete='off';l.appendChild(input);row.appendChild(l);
 const b=document.createElement('button');b.type='button';b.textContent='↓ Öğrenme özeti JSON';row.appendChild(b);
 const status=document.createElement('p');status.className='a621-msg';status.setAttribute('role','status');area.appendChild(status);
 const foot=document.createElement('small');foot.textContent='Yalnız seçili sınıfın toplamları ve son 30 günün gözlenen yanlış/ipucu sayıları indirilir. İsim, serbest açıklama ve tek tek soru yanıtları yoktur. Dosyayı öğretmenine yalnız sen verirsen aktarılır. Kayıtlar bu cihazdadır.';area.appendChild(foot);
 b.addEventListener('click',()=>{try{const code=input.value.trim(),grade=Number($('grade')?.value||0);
    if(!codeOK(code))throw Error('2–20 karakterli harf/rakam/-/_ içeren bir öğrenci kodu yaz.');
    const snapshot=produce(code,grade);download(snapshot,`atlas_ogrenme_${code}_${grade}_${today()}.json`);
    status.textContent='✓ Özet oluşturuldu. Dosya sen paylaşmadıkça başka cihaza gönderilmez.';
   }catch(e){status.textContent='⚠ '+e.message}
 });
 window.Atlas621Export={produce,codeOK};
})();
