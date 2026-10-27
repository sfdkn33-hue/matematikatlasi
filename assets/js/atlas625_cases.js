/* Matematik Atlası 6.25 — deliberately different case-based problem mechanics.
   No extra score, automatic teacher sign-off or invented misconception diagnosis. */
(function(){
 'use strict';
 const math=window.MatematikAtlas625Math;
 const el=(parent,tag,text='',cls='')=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==null)n.textContent=String(text);parent.appendChild(n);return n;};
 function render(root,task,onDone){
   const c=task?.atlas625;
   if(!c||!math)return false;
   root.hidden=false;root.replaceChildren();
   const box=el(root,'section',null,'v625');
   el(box,'div','6. SINIF · AKIL YÜRÜTME ATÖLYESİ','v625-kicker');
   el(box,'h3',c.heading,'v625-heading');
   const scene=el(box,'div',null,'v625-scene');
   c.cards.forEach(([name,val])=>{
      const item=el(scene,'div',null,'v625-card');
      el(item,'small',name);el(item,'strong',val);
   });
   const reason=el(box,'fieldset',null,'v625-reason');el(reason,'legend',c.model.label);
   const choose=el(reason,'div',null,'v625-options');let selected=null;const opts=[];
   c.model.options.forEach((option)=>{
     const b=el(choose,'button',option,'v625-option');b.type='button';b.setAttribute('aria-pressed','false');
     b.addEventListener('click',()=>{selected=option;opts.forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});opts.push(b);
   });
   const inputs=[];
   for(const n of c.numbers){
      const label=el(box,'label',null,'v625-field');el(label,'span',n.label+(n.unit?' ('+n.unit+')':''));
      const input=el(label,'input');input.type='text';input.inputMode='decimal';input.autocomplete='off';
      input.placeholder='Örn. 1,25 veya 5/4';input.setAttribute('aria-label',n.label);inputs.push(input);
   }
   const status=el(box,'p','Önce matematiksel kararını seç, ardından sonuçları hesapla.','v625-status');
   status.setAttribute('role','status');status.setAttribute('aria-live','polite');
   const actions=el(box,'div',null,'v625-actions');let done=false,lastWrongSignature=null,hintShown=false;
   function action(text,run,cls){const b=el(actions,'button',text,cls);b.type='button';b.addEventListener('click',run);return b;}
   action('✓ Çözümümü kontrol et',()=>{
      if(done)return;
      if(!selected){status.textContent='Önce kararını işaretle.';return;}
      if(inputs.some(i=>!i.value.trim()||!Number.isFinite(math.parse(i.value)))){
        status.textContent='Sayısal alanları doldur. Kesir için 3/4, ondalık için 0,75 yazabilirsin.';return;
      }
      const check=math.inspect(c,{model:selected,numbers:inputs.map(i=>i.value)});
      if(!check.ok){
        const sig=JSON.stringify([selected,...inputs.map(i=>i.value.trim())]);
        if(sig!==lastWrongSignature){
          window.MatematikAtlas64?.log({taskId:task.id,status:'wrong',family:'v6.25 · '+c.family,fieldKey:check.field,focus:check.field==='model'?'karar':'hesap',evidence:'module-validator',automatic:true});
          lastWrongSignature=sig;
        }
        status.textContent=check.field==='model'?'Karar modelini tekrar incele. İşlem veya yorum bu durumda uygun değil.':'Hesaplamayı ve birimleri yeniden kontrol et. Bütün sayısal sonuçlar doğru olmalı.';return;
      }
      done=true;status.textContent='✅ '+c.explanation;
      onDone();
   },'v625-check');
   action('💡 İpucu',()=>{
     if(!hintShown){window.MatematikAtlas64?.log({taskId:task.id,status:'hint',family:'v6.25 · '+c.family,fieldKey:'hint',focus:'adimlar',evidence:'module-validator',automatic:true});hintShown=true;}
     status.textContent='💡 '+c.hint;
   },'v625-hint');
   action('↻ Sıfırla',()=>render(root,task,onDone),'v625-reset');
   el(box,'p','Yanıtların matematiksel doğruluğu otomatik kontrol edilir. Açıklama yazmana ya da öğretmen onayına gerek yoktur.','v625-foot');
   return true;
 }
 window.MatematikAtlas625={render};
})();
