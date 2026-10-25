(()=>{
 'use strict';
 const data=window.ATLAS65_AUDIT||[],root=document.getElementById('atlas65Dashboard');if(!root||!data.length)return;
 const grade=document.getElementById('a65Grade'),prio=document.getElementById('a65Priority'),search=document.getElementById('a65Search'),list=document.getElementById('a65List');
 const mk=(t,par,txt,cl)=>{const el=document.createElement(t);if(cl)el.className=cl;if(txt!==undefined&&txt!==null)el.textContent=txt;if(par)par.appendChild(el);return el};
 const el=document.getElementById('a65Kpis');
 const banner=(title,value)=>{const card=mk('div',el,null,'a65-kpi');mk('b',card,String(value));mk('span',card,title)};
 function filtered(){return data.filter(a=>(grade.value==='all'||a.grade===grade.value)&&(prio.value==='all'||a.priority===prio.value)&&(!search.value|| (a.code+' '+a.label+' '+a.proposed_skills.join(' ')).toLocaleLowerCase('tr').includes(search.value.trim().toLocaleLowerCase('tr')))).sort((a,b)=>b.priority_score-a.priority_score)}
 function render(){const all=filtered();el.replaceChildren();banner('Görünen kazanım/kod',all.length);banner('Toplam görev',all.reduce((x,a)=>x+a.tasks,0));banner('Etiketli pilot görev',all.reduce((x,a)=>x+a.tagged,0));banner('Şablon tekrar göstergesi',all.reduce((x,a)=>x+a.template_excess,0));document.getElementById('a65Result').textContent=all.length+' kayıt listeleniyor · Kartları açıp örnek soruları ve çalışma taslağını incele.';
  list.replaceChildren();
  for(const a of all){const details=mk('details',list,null,'a65-record');details.dataset.code=a.code;const summary=mk('summary',details);const left=mk('span',summary);mk('span',left,a.code+' · '+a.grade+'. sınıf','a65-code');mk('b',left,a.label);const r=mk('span',summary,null,'a65-stat');mk('span',r,a.tasks+' görev · '+a.tagged+' etiketli');mk('br',r);const flag=mk('span',r,a.priority,'a65-flag');flag.dataset.priority=a.priority;
   const box=mk('div',details,null,'a65-inner');mk('p',box,'Sayısal değerler çıkarılınca kalan '+a.unique_templates+' ayrı metin kalıbı; '+a.template_excess+' fazladan aynı kalıp. Birebir metin fazlası: '+a.exact_excess+'. Bu, tek başına pedagojik kopya kanıtı değildir.');
   mk('h3',box,'Taslak alt beceriler · uzman doğrulaması bekliyor');let ul=mk('ul',box);for(const s of a.proposed_skills)mk('li',ul,s);
   mk('h3',box,'Soru türlerine ilişkin kanıt');mk('p',box,a.tagged+' görevin türü içerik geliştiricisi tarafından etiketlenmiş (otomatik etkinlik doğrulaması olan pilotlar). Diğer soru türleri yalnızca yönerge/metin analiziyle tahmin edilir.');
   if(Object.keys(a.tagged_families).length){mk('p',box,'Etiketli yaklaşım türleri:');for(const [name,n] of Object.entries(a.tagged_families))mk('span',box,name+' · '+n,'a65-pill')}
   if(Object.keys(a.heuristic_families).length){mk('p',box,'Metinden olası aileler (henüz işlevsel kalite denetimi yok):');for(const [name,n] of Object.entries(a.heuristic_families))mk('span',box,name+' · '+n,'a65-pill')}
   mk('h3',box,'İncelemede öncelikli soru aileleri');mk('p',box,a.recommended_types.join(' · ')||'Mevcut etiketler incelenmeli; ek aile zorunluluğu uzman kararıyla belirlenmeli.');
   mk('h3',box,'Kaynak veriden örnek görevler');const listS=mk('ul',box,null,'a65-samples');for(const sample of a.examples)mk('li',listS,sample.id+' — '+sample.question);
   if(a.code.startsWith('ATLAS'))mk('p',box,'Bu kod resmî kazanım değildir; Atlas pilotu.');
  }
 }
 function open(){root.hidden=false;render();document.getElementById('atlas65Close').focus()}
 function close(){root.hidden=true;}
 document.getElementById('atlas65Close').onclick=close;
 document.getElementById('a65Reset').onclick=()=>{grade.value='all';prio.value='all';search.value='';render()};
 for(const target of [grade,prio])target.addEventListener('change',render);
 search.addEventListener('input',render);
 document.querySelectorAll('[data-atlas65-open]').forEach(b=>b.addEventListener('click',open));
 root.addEventListener('click',e=>{if(e.target===root)close()});document.addEventListener('keydown',e=>{if(!root.hidden&&e.key==='Escape')close()});
 if(document.body.dataset.atlas65Standalone==='true')open();
 window.Atlas65Audit={open,close,getRows:()=>data.slice()};
})();