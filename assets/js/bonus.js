/* Matematik Atlası v2.1 — primary task independent optional second math decision. */
(function(){'use strict';
 const KEY='mathAtlasBonusDoneV21',root=document.getElementById('bonusLab');
 if(!root)return;
 const elt=(tag,txt,klass)=>{const x=document.createElement(tag);if(txt!==null)x.textContent=txt;if(klass)x.className=klass;return x};
 let passed={};try{passed=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){}
 function persist(){try{localStorage.setItem(KEY,JSON.stringify(passed))}catch(e){}}
 function render(task){root.replaceChildren();const cfg=task?.bonusGorev;
  root.hidden=!cfg;if(!cfg)return;
  const heading=elt('h3','🧠 İkinci düşünme adımı','bonus-title');root.appendChild(heading);
  root.appendChild(elt('p','Ana oyundan bağımsız isteğe bağlı bir matematik kararı. Yanıtını seç ve gerekçesini incele.','bonus-note'));
  root.appendChild(elt('p',cfg.soru,'bonus-question'));
  const field=elt('div',null,'bonus-choices');field.setAttribute('role','group');field.setAttribute('aria-label','İkinci düşünme adımı seçenekleri');root.appendChild(field);
  const status=elt('p',passed[task.id]?'✅ Bu ek düşünme adımı tamamlandı.':'Bir yanıt seç.','bonus-status');status.id='bonusStatus';status.setAttribute('aria-live','polite');status.setAttribute('role','status');
  for(const option of cfg.secenekler){const b=elt('button',String(option),'bonus-choice');b.type='button';b.setAttribute('aria-pressed','false');
    b.addEventListener('click',()=>{for(const x of field.querySelectorAll('button'))x.setAttribute('aria-pressed',String(x===b));
      if(String(option)===String(cfg.dogru)){
       passed[task.id]=true;persist();status.className='bonus-status bonus-success';status.textContent='✅ Doğru. '+(cfg.aciklama||'Modeli yeniden kontrol ettin.');
       root.dispatchEvent(new CustomEvent('bonus-done',{bubbles:true,detail:{id:task.id}}));
      }else{status.className='bonus-status bonus-error';status.textContent='Bu seçim uygun değil. Ana modelin verilerini yeniden incele.';}
    });field.appendChild(b);
  }
  root.appendChild(status);
 }
 window.MatematikAtlasBonus={render,completed:()=>({...passed})};
})();
