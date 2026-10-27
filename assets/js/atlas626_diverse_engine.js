/* Matematik Atlası 6.26 — varied, sequential, automatically verified challenges.
   Mathematical checks are not teacher approved. Exposed answers are for formative learning,
   NOT a secure graded examination (that would require a server-side item bank).
*/
(function(root){
'use strict';
function parse(raw){
  const s=String(raw??'').trim().replace(/\s+/g,'');
  if(!/^[+-]?\d+(?:[.,]\d+)?(?:\/[+-]?\d+(?:[.,]\d+)?)?$/.test(s))return NaN;
  const parts=s.split('/').map(x=>Number(x.replace(',','.')));
  return parts.length===2?(parts[1]===0?NaN:parts[0]/parts[1]):parts[0];
}
function near(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(b));}
function inspect(step,value){
  if(!step)return false;
  if(step.type==='number'||step.type==='slider'){
    if(!step.correct||!Number.isFinite(Number(step.correct.n))||!Number.isFinite(Number(step.correct.d))||Number(step.correct.d)===0)return false;
    return near(parse(value),Number(step.correct.n)/Number(step.correct.d));
  }
  if(step.type==='binary')return typeof value==='boolean'&&value===step.correct;
  if(step.type==='fill'){
    if(!value||typeof value!=='object'||Array.isArray(value)||!Array.isArray(step.parts)||step.parts.length<2)return false;
    return step.parts.every(part=>{
      const actual=value[part.key];
      if(part.kind==='number')return !!part.correct&&near(parse(actual),Number(part.correct.n)/Number(part.correct.d));
      if(part.kind==='text'){
        if(typeof actual!=='string'||!actual.trim())return false;
        const norm=s=>s.trim().replace(/\s+/g,' ').toLocaleLowerCase('tr-TR');
        return [part.correct,...(part.alternatives||[])].some(c=>norm(actual)===norm(c));
      }
      return false;
    });
  }
  if(step.type==='choice4')return Array.isArray(step.options)&&step.options.length===4&&typeof value==='string'&&step.options.includes(value)&&value===step.correct;
  if(step.type==='choice')return typeof value==='string'&&step.options.includes(value)&&value===step.correct;
  if(step.type==='tiles')return Array.isArray(value)&&value.length===step.correct.length&&value.every(v=>step.correct.includes(v))&&new Set(value).size===value.length;
  if(step.type==='match')return !!value&&typeof value==='object'&&step.items.length===Object.keys(value).length&&step.items.every(x=>value[x.left]===x.right);
  if(step.type==='order')return Array.isArray(value)&&value.length===step.correct.length&&value.every((v,i)=>v===step.correct[i]);
  return false;
}
function el(parent,tag,text='',cls=''){
 const n=document.createElement(tag);if(cls)n.className=cls;
 if(text!==null)n.textContent=String(text);parent.appendChild(n);return n;
}
function render(panel,task,onDone){
 const data=task?.atlas626;
 if(!panel)return false;
 if(!data){panel.hidden=true;panel.replaceChildren();return false;}
 panel.hidden=false;panel.replaceChildren();
 const wrap=el(panel,'section',null,'atlas626');
 el(wrap,'div',task.sinif+'. SINIF · MATEMATİKSEL KEŞİF','atlas626-kicker');
 el(wrap,'h3',data.heading,'atlas626-heading');
 el(wrap,'p',data.story,'atlas626-story');
 if(data.visual){
  if(data.visual.type==='fractionStrips'){
   // A given fraction is drawn; no computed answer is revealed by the visual layer.
   const rows=Array.isArray(data.visual.rows)?data.visual.rows:[];
   const figure=el(wrap,'figure',null,'atlas659-fraction-figure');
   const safe=rows.length>0&&rows.length<=3&&rows.every(r=>Number.isInteger(r.numerator)&&Number.isInteger(r.denominator)&&r.denominator>=1&&r.denominator<=24&&r.numerator>=0&&r.numerator<=r.denominator);
   if(safe){
    figure.setAttribute('role','group');figure.setAttribute('aria-label','Verilen kesirlerin boyalı şerit modelleri');
    rows.forEach(r=>{
     const item=el(figure,'div',null,'atlas659-fraction-row');
     el(item,'strong',r.label+' · '+r.numerator+'/'+r.denominator,'atlas659-fraction-label');
     const strip=el(item,'div',null,'atlas659-fraction-strip');
     strip.style.gridTemplateColumns='repeat('+r.denominator+', minmax(0,1fr))';
     strip.setAttribute('role','img');strip.setAttribute('aria-label',r.label+': '+r.denominator+' eş parçanın '+r.numerator+' tanesi boyalı');
     for(let i=0;i<r.denominator;i++){
      const part=el(strip,'span',null,'atlas659-fraction-part'+(i<r.numerator?' is-filled':''));
      part.setAttribute('aria-hidden','true');
     }
    });
    el(figure,'figcaption','Her şerit kendi içinde eş parçalara ayrılmıştır. Şeritler aynı uzunlukta bütünü temsil eder.','atlas626-rect-caption');
   }else figure.remove();
  }else if(data.visual.type==='placeValue'){
   const raw=String(data.visual.value||'');
   const m=raw.match(/^(\d{1,4}),([0-9]{1,3})$/);
   if(m){
    const table=el(wrap,'table',null,'atlas626-table atlas659-place-table');
    table.setAttribute('aria-label','Ondalık gösterim basamak tablosu');
    const head=el(table,'thead'),hr=el(head,'tr');
    ['Tam kısım','Onda birler','Yüzde birler','Binde birler'].forEach(x=>el(hr,'th',x));
    const body=el(table,'tbody'),row=el(body,'tr');
    [m[1],m[2][0]||'—',m[2][1]||'—',m[2][2]||'—'].forEach(x=>el(row,'td',x));
    el(wrap,'p','Tabloda “—” gösterilmeyen basamağı belirtir; boş basamakların değeri sıfırdır.','atlas659-place-note');
   }
  }else if(data.visual.type==='table'){
   const table=el(wrap,'table',null,'atlas626-table');const head=el(table,'thead');const tr=el(head,'tr');
   data.visual.headers.forEach(h=>el(tr,'th',h));const body=el(table,'tbody');
   data.visual.rows.forEach(row=>{const line=el(body,'tr');row.forEach(v=>el(line,'td',v));});
  }else if(data.visual.type==='rectModel'){
   const v=data.visual;const w=Number(v.width),h=Number(v.height),cw=Number(v.cutWidth||0),ch=Number(v.cutHeight||0);
   if(w>0&&h>0&&w<=100&&h<=100&&cw>=0&&cw<w&&ch>=0&&ch<h){
    const label='Dikdörtgen '+w+' × '+h+(cw&&ch?', köşeden çıkarılan '+cw+' × '+ch+' dikdörtgen':'');
    const box=el(wrap,'figure',null,'atlas626-rectangle-figure');box.setAttribute('role','img');box.setAttribute('aria-label',label);
    const pic=el(box,'div',null,'atlas626-rect-image');pic.style.aspectRatio=w+'/'+h;
    pic.style.maxWidth='min(100%,440px)';
    if(cw&&ch){const hole=el(pic,'div',null,'atlas626-rect-hole');hole.style.width=(100*cw/w)+'%';hole.style.height=(100*ch/h)+'%';}
    el(box,'figcaption',label,'atlas626-rect-caption');
   }
  }else if(data.visual.type==='probabilityStrip'){
   const groups=Array.isArray(data.visual.groups)?data.visual.groups:[];
   const total=groups.reduce((n,g)=>n+Number(g[1]||0),0);
   if(total>0&&total<=60&&groups.every(g=>Array.isArray(g)&&Number.isInteger(g[1])&&g[1]>=0)){
    const box=el(wrap,'figure',null,'atlas626-probability-figure');
    box.setAttribute('role','img');box.setAttribute('aria-label',groups.map(g=>g[0]+': '+g[1]).join('; '));
    const bars=el(box,'div',null,'atlas626-probability-cells');
    groups.forEach((g,j)=>{
     const name=String(g[0]).toLocaleLowerCase('tr-TR');
     const named=[['kırmızı','red'],['mavi','blue'],['yeşil','green'],['sarı','yellow'],['mor','purple'],['turuncu','orange']].find(x=>name.includes(x[0]));
     for(let i=0;i<g[1];i++){
      const cell=el(bars,'span',null,'atlas626-probability-cell '+(named?'hue-'+named[1]:'tone-'+(j%4)));
      cell.setAttribute('aria-hidden','true');
     }
    });
    el(box,'figcaption',groups.map(g=>g[0]+' '+g[1]).join(' · '),'atlas626-rect-caption');
   }
  }else if(data.visual.type==='numberline'){
   const raw=Array.isArray(data.visual.points)?data.visual.points:[];
   const values=raw.map(p=>Number(p.value?.n)/Number(p.value?.d));
   if(values.length>0&&values.length<=6&&values.every(Number.isFinite)){
    const min=Math.floor(Math.min(-1,...values)), max=Math.ceil(Math.max(1,...values));
    const box=el(wrap,'figure',null,'atlas626-numberline-figure');box.setAttribute('role','img');
    box.setAttribute('aria-label',raw.map((p,i)=>p.label+': '+p.value.n+'/'+p.value.d).join('; '));
    const axis=el(box,'div',null,'atlas626-numberline-axis');
    for(let tick=min;tick<=max;tick++){
     const k=el(axis,'span',String(tick),'atlas626-numberline-tick');
     k.style.left=(100*(tick-min)/(max-min))+'%';
    }
    raw.forEach((p,i)=>{const mark=el(axis,'span',p.label,'atlas626-numberline-dot');mark.style.left=(100*(values[i]-min)/(max-min))+'%';
     mark.style.top=((i%2)*-22-29)+'px';mark.title=p.label+': '+p.value.n+'/'+p.value.d;});
    el(box,'figcaption','İşaretli başlangıç değerini sayı doğrusunda incele; sonucu kendin hesapla.','atlas626-rect-caption');
   }
  }else if(data.visual.type==='bars'){
   const box=el(wrap,'div',null,'atlas626-chart');box.setAttribute('role','img');
   box.setAttribute('aria-label',data.visual.labels.map((l,i)=>l+': '+data.visual.values[i]).join(', '));
   const baseline=Number.isFinite(Number(data.visual.axisMin))?Number(data.visual.axisMin):0;
   const max=Math.max(baseline+1,...data.visual.values);
   if(baseline>0)el(box,'p','Dikkat: Gösterimin başlangıç değeri '+baseline+'. Sütunların görünüşünü değil, sayıları karşılaştır.','atlas626-axis-warning');
   data.visual.labels.forEach((label,i)=>{const row=el(box,'div',null,'atlas626-chart-row');
    el(row,'small',label);const track=el(row,'div',null,'atlas626-track');const fill=el(track,'div',null,'atlas626-fill');
    fill.style.width=(100*Math.max(0,data.visual.values[i]-baseline)/(max-baseline))+'%';
    el(row,'strong',data.visual.values[i]);
   });
  }
 }
 const progress=el(wrap,'div',null,'atlas626-stepnav'), stage=el(wrap,'div',null,'atlas626-stage');
 const msg=el(wrap,'p','Adım adım ilerle; her yanıt otomatik doğrulanır.','atlas626-status');msg.setAttribute('role','status');msg.setAttribute('aria-live','polite');
 const footer=el(wrap,'div',null,'atlas626-footer');
 const check=el(footer,'button','✓ Kontrol et','atlas626-primary');check.type='button';
 const help=el(footer,'button','💡 İpucu','atlas626-secondary');help.type='button';
 let cursor=0,ended=false,currentGet=()=>null,lastWrongKey='',hintShown=new Set();
 function paint(){
  progress.replaceChildren();for(let i=0;i<data.steps.length;i++){
   const p=el(progress,'span',i<cursor?'✓':i===cursor?String(i+1):'·','atlas626-step'+(i<=cursor?' current':''));
   p.setAttribute('aria-label',i<cursor?`Adım ${i+1} tamamlandı`:`Adım ${i+1}`);
  }
  if(ended){stage.replaceChildren();el(stage,'p','✅ '+data.explanation,'atlas626-done');check.disabled=true;return;}
  const step=data.steps[cursor];stage.replaceChildren();
  el(stage,'h4',`Adım ${cursor+1} / ${data.steps.length} · ${step.prompt}`);
  msg.textContent='Yanıtını seç veya gir, sonra kontrol et.';
  if(step.type==='slider'){
   const label=el(stage,'label',null,'atlas626-input-wrap');
   el(label,'span','Sürgüyü hareket ettirerek modelini oluştur'+(step.unit?' ('+step.unit+')':'') );
   const input=el(label,'input');input.type='range';input.className='atlas626-slider';
   input.min=String(step.min??0);input.max=String(step.max??360);input.step=String(step.step??1);input.value=input.min;
   const out=el(label,'output',input.value+(step.unit||''),'atlas626-slider-output');
   input.addEventListener('input',()=>{out.textContent=input.value+(step.unit||'');
    const circle=label.querySelector('.atlas626-circle');if(circle)circle.style.background='conic-gradient(#148ea8 0deg '+input.value+'deg,#dbeaf2 '+input.value+'deg 360deg)';});
   if(step.unit==='°'){const circle=el(label,'div',null,'atlas626-circle');circle.setAttribute('role','img');circle.setAttribute('aria-label','Çemberde seçilen merkez açı');circle.style.background='conic-gradient(#148ea8 0deg '+input.value+'deg,#dbeaf2 '+input.value+'deg 360deg)';}
   currentGet=()=>input.value;
  }else if(step.type==='number'){
   const label=el(stage,'label',null,'atlas626-input-wrap');
   el(label,'span','Sayısal yanıt'+(step.unit?' ('+step.unit+')':'')+' — kesir de yazabilirsin');
   const input=el(label,'input');input.type='text';input.inputMode='decimal';input.placeholder='Örn. 0,75 ya da 3/4';input.autocomplete='off';
   input.setAttribute('aria-label',step.prompt);currentGet=()=>input.value;
   input.addEventListener('keydown',e=>{if(e.key==='Enter')check.click()});
  }else if(step.type==='binary'){
   el(stage,'p','Önermeyi değerlendir. Seçim yapmadan kontrol edemezsin.','atlas626-instruction');
   const opts=el(stage,'div',null,'atlas626-options');let selected=null;
   [true,false].forEach(value=>{const b=el(opts,'button',value?'✓ Doğru':'✗ Yanlış','atlas626-option');b.type='button';b.setAttribute('aria-pressed','false');
    b.addEventListener('click',()=>{selected=value;[...opts.children].forEach(v=>v.setAttribute('aria-pressed',String(v===b)));});
   });currentGet=()=>selected;
  }else if(step.type==='fill'){
   el(stage,'p','Boşlukları sırayla doldur. Bütün alanların doğru olması gerekiyor.','atlas626-instruction');
   const state={};const inputs=el(stage,'div',null,'atlas626-fills');
   step.parts.forEach(part=>{const label=el(inputs,'label',null,'atlas626-input-wrap');el(label,'span',part.label);
    const input=el(label,'input');input.type='text';input.autocomplete='off';input.placeholder=part.kind==='number'?'Sayı veya kesir gir':'Cevabını yaz';
    input.inputMode=part.kind==='number'?'decimal':'text';input.setAttribute('aria-label',part.label);
    input.addEventListener('input',()=>{state[part.key]=input.value;});input.addEventListener('keydown',e=>{if(e.key==='Enter')check.click();});
   });currentGet=()=>state;
  }else if(step.type==='choice4'||step.type==='choice'){
   const opts=el(stage,'div',null,'atlas626-options');let chosen='';
   const offset=(Number(task.gorev_no)+cursor)%step.options.length;
   [...step.options.slice(offset),...step.options.slice(0,offset)].forEach(text=>{
    const b=el(opts,'button',text,'atlas626-option');b.type='button';b.setAttribute('aria-pressed','false');
    b.addEventListener('click',()=>{chosen=text;[...opts.children].forEach(z=>z.setAttribute('aria-pressed',String(z===b)))});
   });currentGet=()=>chosen;
  }else if(step.type==='match'){
   el(stage,'p','Her kavramı doğru kartla eşleştir.','atlas626-instruction');
   const box=el(stage,'div',null,'atlas626-matches');const state={};
   step.items.forEach((part,i)=>{const row=el(box,'label',null,'atlas626-match');el(row,'strong',part.left);
    const sel=el(row,'select');sel.setAttribute('aria-label',part.left);const empty=el(sel,'option','Kart seç');empty.value='';
    const offset=(i+Number(task.gorev_no))%step.options.length;const choices=[...step.options.slice(offset),...step.options.slice(0,offset)];
    choices.forEach(v=>{const option=el(sel,'option',v);option.value=v});
    sel.addEventListener('change',()=>{state[part.left]=sel.value;});
   });currentGet=()=>state;
  }else if(step.type==='tiles'){
   el(stage,'p','Birden çok doğru kutucuk olabilir. Uygun olanların hepsini seç.','atlas626-instruction');
   const grid=el(stage,'div',null,'atlas626-tiles');const picked=new Set();
   const shuffled=[...step.options];const offset=(Number(task.gorev_no)+cursor)%shuffled.length;shuffled.push(...shuffled.splice(0,offset));
   shuffled.forEach(text=>{const b=el(grid,'button',text,'atlas626-tile');b.type='button';b.setAttribute('aria-pressed','false');
    b.addEventListener('click',()=>{if(picked.has(text))picked.delete(text);else picked.add(text);b.setAttribute('aria-pressed',String(picked.has(text)))});
   });currentGet=()=>[...picked];
  }else if(step.type==='order'){
   el(stage,'p','Aşamaları olması gereken sırayla tıkla.','atlas626-instruction');
   const grid=el(stage,'div',null,'atlas626-options');const selected=[];
   const options=[...step.options].reverse();if(Number(task.gorev_no)%2===0)options.push(options.shift());
   const display=el(stage,'p','Henüz sıralama yapılmadı.','atlas626-order-preview');
   function sync(){display.textContent=selected.length?selected.map((x,i)=>(i+1)+'. '+x).join('  →  '):'Henüz sıralama yapılmadı.';}
   options.forEach(text=>{const b=el(grid,'button',text,'atlas626-option');b.type='button';
    b.addEventListener('click',()=>{if(selected.includes(text))return;selected.push(text);b.disabled=true;sync()});
   });const reset=el(stage,'button','↶ Sıralamayı sıfırla','atlas626-small');reset.type='button';
   reset.addEventListener('click',()=>{selected.length=0;[...grid.children].forEach(b=>b.disabled=false);sync()});
   currentGet=()=>selected;
  }
  check.textContent=cursor===data.steps.length-1?'✓ Görevi tamamla':'✓ Adımı kontrol et';
 }
 check.addEventListener('click',()=>{
  if(ended)return;const st=data.steps[cursor],reply=currentGet();
  if(inspect(st,reply)){
   cursor+=1;lastWrongKey='';if(cursor===data.steps.length){ended=true;paint();msg.textContent='✅ Görev tamamlandı. Çözüm yukarıda gösterildi.';onDone();return;}paint();
   msg.textContent='✅ Doğru. Bir sonraki düşünme adımına geç.';
  }else{
   msg.textContent=['number','fill'].includes(st.type)?'Boşlukları ve işlemleri yeniden kontrol et. Kesir için 3/4 yazabilirsin.':'Kararını yeniden incele. İpucunu kullanarak farklı bir çözüm dene.';
   const signature=task.id+'|'+cursor+'|'+JSON.stringify(reply);
   if(signature!==lastWrongKey){lastWrongKey=signature;
    root.MatematikAtlas64?.log({taskId:task.id,status:'wrong',family:'v6.26 · '+data.family,fieldKey:'stage'+(cursor+1),focus:'matematiksel karar',evidence:'module-validator',automatic:true});
   }
  }
 });
 help.addEventListener('click',()=>{if(!hintShown.has(cursor)){hintShown.add(cursor);
  root.MatematikAtlas64?.log({taskId:task.id,status:'hint',family:'v6.26 · '+data.family,fieldKey:'stage'+(cursor+1),focus:'ipucu',evidence:'module-validator',automatic:true});}
  msg.textContent='💡 '+data.hint;
 });
 paint();return true;
}
const api={parse,inspect,render};root.MatematikAtlas626=api;
if(typeof module!=='undefined'&&module.exports)module.exports={parse,inspect};
})(typeof window==='undefined'?globalThis:window);
