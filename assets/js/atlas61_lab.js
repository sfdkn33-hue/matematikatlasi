/* Matematik Atlası v6.1 — 75 redesigned PRIMARY tasks, answer checking is automatic. */
(()=>{'use strict';
 const root=document.getElementById('atlas61Lab');if(!root||!window.ATLAS_DB)return;
 const bank=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas61Lab).map(t=>[String(t.id),t]));
 let task=null,c=null,state={},wrongCount=0,hintUsed=false;
 const fam=()=>({stats7:'İstatistiksel yorum',ratio7:'Orantı muhakemesi',graph8:'Grafik yorumlama',algebra8:'Cebirsel alan modeli',prob8:'Olasılık modeli'}[c?.family]||'Matematiksel karar')+' · '+(c?.kind||'model');
 const saved=id=>{try{return !!JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')[id]}catch{return false}};
 const E=(tag,parent,value,cls)=>{const z=document.createElement(tag);if(cls)z.className=cls;if(value!==null&&value!==undefined)z.textContent=String(value);parent.appendChild(z);return z};
 const button=(parent,value,fn)=>{const b=E('button',parent,value,'v61-button');b.type='button';b.onclick=fn;return b};
 const fmt=x=>Number(x).toLocaleString('tr-TR',{maximumFractionDigits:2});
 const read=x=>{const s=x?.value?.trim().replace(',','.');return s&&/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(s)?Number(s):NaN};
 const eq=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<0.055;
 function field(parent,label,key){let w=E('label',parent,label,'v61-field');let z=E('input',w,null,'v61-input');z.type='text';z.inputMode='decimal';z.autocomplete='off';z.dataset.field=key;state.fields[key]=z;return z}
 function choices(parent,label,options){E('strong',parent,label,'v61-subtitle');let w=E('div',parent,null,'v61-choices');let chosen=-1;options.forEach((txt,i)=>{const b=button(w,txt,()=>{chosen=i;w.querySelectorAll('button').forEach((v,j)=>v.setAttribute('aria-pressed',String(j===i)))});b.setAttribute('aria-pressed','false')});return ()=>chosen}
 function readKey(s){return read(state.fields[s])}
 function sceneStats(parent){const base=c.kind==='axis'?c.base:0;const vals=[c.a,c.b],max=Math.max(...vals)+2;
  let chart=E('div',parent,null,'v61-graph');const W=320,baseline=154,height=115;const bar=vals.map((v,i)=>{let h=Math.max(2,(v-base)/(max-base)*height),x=95+i*108;return `<rect x="${x}" y="${baseline-h}" width="57" height="${h}" rx="6" fill="${i?'#247e91':'#4172ad'}"/><text x="${x+28}" y="${baseline-h-8}" text-anchor="middle" fill="#14384b" font-size="14" font-weight="800">${v}</text><text x="${x+28}" y="179" text-anchor="middle" fill="#14384b" font-size="13">${i?'B':'A'}</text>`}).join('');
  chart.innerHTML=`<svg viewBox="0 0 ${W} 190" role="img" aria-label="A ${c.a}, B ${c.b}, eksen başlangıcı ${base}"><line x1="52" y1="154" x2="304" y2="154" stroke="#37627a" stroke-width="2"/><text x="43" y="157" text-anchor="end" fill="#27475b" font-size="13">${base}</text>${bar}</svg>`}
 function chartThree(parent){let vis=E('div',parent,null,'v61-graph');let a=c.values,total=Math.max(...a)+2;const bars=a.map((v,i)=>{let h=105*v/total,x=70+i*86;return `<rect x="${x}" y="${140-h}" width="55" height="${h}" rx="5" fill="${['#3477a5','#24856c','#ab6b2a'][i]}"/><text x="${x+27}" y="${132-h}" text-anchor="middle" font-size="14" fill="#14384b">${v}</text><text x="${x+27}" y="167" text-anchor="middle" font-size="13" fill="#14384b">${'ABC'[i]}</text>`}).join('');vis.innerHTML=`<svg viewBox="0 0 345 185" role="img" aria-label="A ${a[0]}, B ${a[1]}, C ${a[2]} sütun grafiği"><line x1="45" y1="140" x2="325" y2="140" stroke="#37627a" stroke-width="2"/>${bars}</svg>`;}
 function drawBalls(parent,r,b,g=0){const section=E('div',parent,null,'v61-balls');[['Kırmızı',r,'v61-red'],['Mavi',b,'v61-blue'],['Yeşil',g,'v61-green']].forEach(([name,n,color])=>{if(n===0)return;let line=E('div',section,null,'v61-ballrow');E('strong',line,`${name} · ${n}`);let tray=E('div',line,null,'v61-balltray');for(let i=0;i<n;i++)E('span',tray,'',color)})}
 function paint(){root.replaceChildren();if(!task)return;
  E('span',root,task.sinif+'. SINIF · ANA MUHAKEME ETKİNLİĞİ','v61-kicker');E('p',root,task.gorev,'v61-text');
  const stage=E('div',root,null,'v61-stage');state={fields:{},ok:()=>false};
  if(c.family==='stats7'){
    sceneStats(stage);
    if(c.kind==='axis'){const get=choices(stage,'İddiayı değerlendir',['Evet, iki katından fazla','Hayır, iki katından fazla değil']);field(stage,'Gerçek fark (B − A)','diff');state.ok=()=>get()===c.choice&&eq(readKey('diff'),c.diff)}
    else if(c.kind==='claim'){const get=choices(stage,'“En az %25 arttı” iddiası',['Veriler destekliyor','Veriler desteklemiyor']);field(stage,'Gerçek artış yüzdesi (%)','pct');state.ok=()=>get()===c.choice&&eq(readKey('pct'),c.pct)}
    else{const get=choices(stage,'Araştırmacının yorumu',['Doğru','Yanlış']);field(stage,'Veriler arasındaki gerçek fark','diff');state.ok=()=>get()===c.choice&&eq(readKey('diff'),c.diff)}
  }else if(c.family==='ratio7'){
    E('div',stage,`${c.q} birim → ${c.total} değer`,'v61-fact');
    if(c.kind==='table'){const table=E('div',stage,null,'v61-ratio-table');['Paket sayısı','Ürün sayısı'].forEach((label,i)=>{const row=E('div',table,null,'v61-ratio-row');E('strong',row,label);E('span',row,i===0?String(c.q):String(c.total));E('span',row,i===0?String(c.target):'?')});const get=choices(stage,'Nasıl ölçeklenir?',['Her iki nicelik aynı katsayıyla','Yalnız sonuç sayısına sabit ekleyerek']);field(stage,'1 birimde elde edilen değer','unit');field(stage,`${c.target} birimde elde edilen değer`,'ans');state.ok=()=>get()===0&&eq(readKey('unit'),c.per)&&eq(readKey('ans'),c.answer)}
    else if(c.kind==='price'){E('p',stage,`A: ${c.q} birim = ${c.total} TL · B: ${c.q} birim = ${c.q*c.comp_per} TL`,'v61-fact');const get=choices(stage,'Birimi daha ucuz olan',['A','B']);field(stage,'A birim fiyatı (TL)','a');field(stage,'B birim fiyatı (TL)','b');state.ok=()=>get()===c.choice&&eq(readKey('a'),c.per)&&eq(readKey('b'),c.comp_per)}
    else{const get=choices(stage,'Öğrencinin çözümü',['Doğru','Yanlış']);field(stage,'Gerçekte elde edilecek çıktı','ans');field(stage,'Bir birimde elde edilen çıktı','unit');state.ok=()=>get()===c.choice&&eq(readKey('ans'),c.answer)&&eq(readKey('unit'),c.per)}
  }else if(c.family==='graph8'){
    chartThree(stage);if(c.kind==='pie'){const disk=E('div',stage,null,'v61-pie');const p1=c.values[0]/c.total*100,p2=(c.values[0]+c.values[1])/c.total*100;disk.style.background=`conic-gradient(#3477a5 0% ${p1}%,#24856c ${p1}% ${p2}%,#ab6b2a ${p2}% 100%)`;disk.setAttribute('role','img');disk.setAttribute('aria-label','A B C gruplarının dağılımını gösteren daire grafiği');}const get=choices(stage,'İncelenen grubu seç',['A','B','C']);
    if(c.kind==='pie'){field(stage,'Daire dilimi merkez açısı (derece)','ans');state.ok=()=>get()===c.choice&&eq(readKey('ans'),c.answer)}
    else if(c.kind==='share'){field(stage,'Toplam içindeki pay (%)','ans');state.ok=()=>get()===c.choice&&eq(readKey('ans'),c.answer)}
    else{field(stage,'En büyük ve en küçük değer farkı','ans');state.ok=()=>get()===c.choice&&eq(readKey('ans'),c.answer)}
  }else if(c.family==='algebra8'){
    const format=(a,b)=>`${a}x ${b>=0?'+':'−'} ${Math.abs(b)}`;
    E('div',stage,`(${format(c.a,c.b)}) × (${format(c.cc,c.d)})`,'v61-expression');
    if(c.kind==='grid'){let grid=E('div',stage,null,'v61-tiles');['x² hücresi','I. x hücresi','II. x hücresi','Sabit hücre'].forEach((v,i)=>field(grid,v,'c'+i));state.ok=()=>c.cells.every((v,i)=>eq(readKey('c'+i),v))}
    else if(c.kind==='error'){E('div',stage,'Bir öğrencinin yazdığı hücre katsayıları: '+c.wrong.join(' | '),'v61-fact');const get=choices(stage,'Hatalı hücreyi bul',['x²','I. x','II. x','Sabit']);field(stage,'Hatalı hücrenin doğru katsayısı','fix');field(stage,'Sadeleşmiş x katsayısı','coef');state.ok=()=>get()===1&&eq(readKey('fix'),c.cells[1])&&eq(readKey('coef'),c.coeff[1])}
    else{let grid=E('div',stage,null,'v61-tiles');['x² katsayısı','x katsayısı','Sabit terim'].forEach((s,i)=>field(grid,s,'z'+i));state.ok=()=>c.coeff.every((v,i)=>eq(readKey('z'+i),v))}
  }else if(c.family==='prob8'){
    let red=c.red,blue=c.blue;let g=c.kind==='balance'?0:c.green;
    let container=E('div',stage,null,'v61-ballbox');const balls=()=>{container.replaceChildren();drawBalls(container,red,blue,g)};balls();
    if(c.kind==='balance'){
     const row=E('div',stage,null,'v61-choices');button(row,'+ Kırmızı bilye ekle',()=>{if(red<30){red++;balls()}});button(row,'↻ Sıfırla',()=>{red=c.red;balls()});field(stage,'Eşitlemek için eklenen kırmızı bilye','added');state.ok=()=>red===blue&&(red-c.red)===c.num&&eq(readKey('added'),c.num);
    }else{
     const get=choices(stage,c.kind==='bag'?'Hangi olayın olasılığını hesaplıyorsun?':'Hangi olayın olasılığını hesaplıyorsun?',c.kind==='bag'?['Kırmızı','Mavi','Yeşil']:['Mavi gelmesi','Mavi gelmemesi']);field(stage,'Olasılık kesrinin payı','num');field(stage,'Olasılık kesrinin paydası','den');state.ok=()=>{const a=readKey('num'),b=readKey('den');return get()===c.choice&&Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&b>0&&a<=b&&a*c.den===b*c.num};
    }
  }
  const status=E('p',root,'Her adımı tamamla. Sistem otomatik denetler.','v61-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const actions=E('div',root,null,'v61-actions');button(actions,'✓ Çözümümü kontrol et',()=>{if(!task)return;let ok=false;try{ok=state.ok()}catch(err){ok=false}if(!ok){wrongCount++;window.MatematikAtlas64?.log({taskId:task.id,status:'wrong',family:fam(),focus:'adimlar'});status.textContent='🔎 Bir veya birkaç adım henüz doğru değil. Modeli yeniden incele.';status.dataset.error='true';return}
   const id=task.id,firstTry=wrongCount===0&&!hintUsed&&!window.MatematikAtlas64?.hasAttemptsToday(id);
   const check=document.getElementById('check'),answer=document.getElementById('answer');window.__atlas61Verified=id;answer.value=task.beklenen_yanit_veya_rubrik;check.click();window.__atlas61Verified=null;
   if(saved(id)){const tracked=window.MatematikAtlas64?.log({taskId:id,status:'correct',family:fam(),firstTry,hintUsed,wrongCount});status.textContent=tracked===false?'⚠ Çözüm doğru, deneme geçmişi kaydedilemedi. Yedek al.':'✅ Çözüm otomatik doğrulandı, görevin tamamlanması kaydedildi.';status.dataset.error=String(tracked===false)}
   else{status.textContent='⚠ Matematik doğru, ilerleme kaydedilemedi. Yedek al.';status.dataset.error='true'}
  });button(actions,'💡 İpucu',()=>{hintUsed=true;window.MatematikAtlas64?.log({taskId:task.id,status:'hint',family:fam()});status.textContent=task.ipucu;status.dataset.error='false'});button(actions,'↻ Baştan dene',paint);
 }
 document.addEventListener('atlas:taskrender',event=>{task=bank.get(String(event.detail?.id))||null;c=task?.atlas61Lab||null;wrongCount=0;hintUsed=false;root.hidden=!task;if(task)paint();else root.replaceChildren()});
})();
