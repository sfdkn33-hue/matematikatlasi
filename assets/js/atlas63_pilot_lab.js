/* Matematik Atlası v6.3: 36 pilot görev ana ilerleme motoru ile bütünleşik.
   İçerik veri tabanındaki atlas63Pilot alanından gelir. */
(()=>{
 'use strict';
 const root=document.getElementById('atlas63PilotLab');
 const scope=document.getElementById('atlas63Scope');
 const db=window.ATLAS_DB;
 if(!root||!db)return;
 const bank=new Map(db.tasks.filter(t=>t.atlas63Pilot&&!t.atlas68Workbench&&!t.atlas69Workbench).map(t=>[t.id,t]));
 let active=null,wrong=0,showHint=false;
 const E=(tag,parent,text,cls)=>{const el=tag==='svg'?document.createElementNS('http://www.w3.org/2000/svg','svg'):document.createElement(tag);if(cls)el.className=cls;if(text!==undefined&&text!==null)el.textContent=text;if(parent)parent.appendChild(el);return el};
 const esc=x=>String(x).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 function progress(){try{return JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')||{}}catch(e){return {}}}
 function number(raw){const s=String(raw).trim().replace(/\s/g,'').replace(',','.');if(!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:\/[+-]?(?:\d+(?:\.\d+)?|\.\d+))?$/.test(s))return NaN;
   if(s.includes('/')){const [a,b]=s.split('/').map(Number);return b===0?NaN:a/b;}return Number(s)}
 function correct(f,answer){if(f.type==='choice')return String(answer)===String(f.expected);
  const n=number(answer);return String(answer).trim()!==''&&Number.isFinite(n)&&Math.abs(n-Number(f.expected))<1e-8;}
 function visual(id,holder,config){
  if(config?.atlas66Visual){window.Atlas66Visual?.render(holder,config.atlas66Visual,root);return;}
  if(config?.atlas64Visual){
   const meta=config.atlas64Visual;const v=E('div',holder,null,'v63-visual');
   const svg=E('svg',v);svg.setAttribute('viewBox','0 0 340 124');svg.setAttribute('role','img');
   if(meta.kind==='prob'){const p=Number(meta.point);svg.setAttribute('aria-label','Sıfır ile bir arasında olasılık doğrusu. Uç noktalar 0 ve 1, orta nokta 0,5.');
    svg.innerHTML='<line x1="24" y1="55" x2="316" y2="55" stroke="#286d95" stroke-width="4"/>'+Array.from({length:11},(_,i)=>{let x=24+29.2*i;return '<line x1="'+x+'" y1="46" x2="'+x+'" y2="64" stroke="#286d95" stroke-width="1.5"/>'}).join('')+'<text x="19" y="89" fill="#17334b" font-size="15">0</text><text x="158" y="89" fill="#17334b" font-size="13">0,5</text><text x="308" y="89" fill="#17334b" font-size="15">1</text><text x="12" y="19" fill="#17334b" font-size="13">İmkânsız</text><text x="267" y="19" fill="#17334b" font-size="13">Kesin</text>';
   }else if(meta.kind==='slope'){let pts=meta.points.map(([x,y])=>[Number(x),Number(y)]),minx=Math.min(0,...pts.map(p=>p[0]))-1,maxx=Math.max(0,...pts.map(p=>p[0]))+1,miny=Math.min(0,...pts.map(p=>p[1]))-2,maxy=Math.max(0,...pts.map(p=>p[1]))+2;
    const sx=x=>20+(x-minx)/(maxx-minx)*300,sy=y=>108-(y-miny)/(maxy-miny)*90;svg.setAttribute('aria-label','İki noktadan geçen doğru şeması: ' + pts.map(p=>'('+p[0]+', '+p[1]+')').join(' ve '));
    svg.innerHTML='<line x1="20" y1="'+sy(0)+'" x2="320" y2="'+sy(0)+'" stroke="#acb5c3" stroke-width="1.5"/><line x1="'+sx(0)+'" y1="10" x2="'+sx(0)+'" y2="110" stroke="#acb5c3" stroke-width="1.5"/><line x1="'+sx(pts[0][0])+'" y1="'+sy(pts[0][1])+'" x2="'+sx(pts[1][0])+'" y2="'+sy(pts[1][1])+'" stroke="#206f9e" stroke-width="4"/>'+pts.map((p,i)=>'<circle cx="'+sx(p[0])+'" cy="'+sy(p[1])+'" r="5" fill="#d36c2b"/><text x="'+Math.min(290,sx(p[0])+7)+'" y="'+Math.max(13,sy(p[1])-8)+'" font-size="12" fill="#17334b">'+(i===0?'A':'B')+'</text>').join('');
    E('p',v,'Şema; hesaplamalarda verilen gerçek koordinatları kullan.','v63-context');
   }return;
  }
  const v=E('div',holder,null,'v63-visual');v.setAttribute('aria-label','Sorunun görsel verisi');
  if(id==='V62-DEMO-6-01'){
    E('div',v,'407,035 · basamak kartları','v63-context');let row=E('div',v,null,'v63-digit-tiles');'407,035'.split('').forEach(char=>E('span',row,char,char===','?'decimal':''));
    E('p',v,'Virgülün sağı: onda birler → yüzde birler → binde birler.','v63-context');
  }else if(id==='V62-DEMO-6-07'){
    E('p',v,'0,400 ile 0,410 arasını 10 eşit aralığa böl.','v63-context');
    let svg=E('svg',v);svg.setAttribute('viewBox','0 0 340 85');
    svg.innerHTML='<line x1="16" y1="36" x2="324" y2="36" stroke="#1d638b" stroke-width="3"/>'+Array.from({length:11},(_,i)=>'<line x1="'+(16+30.8*i)+'" x2="'+(16+30.8*i)+'" y1="28" y2="44" stroke="#1d638b" stroke-width="2"/>').join('')+'<text x="16" y="70" font-size="13" fill="#153550">0,400</text><text x="266" y="70" font-size="13" fill="#153550">0,410</text>';
  }else if(id==='V62-DEMO-7-01'||id==='V62-DEMO-7-05'){
    E('p',v,'Dikey eksenin başlangıcına dikkat!','v63-context');
    let svg=E('svg',v);svg.setAttribute('viewBox','0 0 330 150');
    svg.innerHTML='<line x1="50" y1="15" x2="50" y2="116" stroke="#245676" stroke-width="2"/><line x1="50" y1="116" x2="306" y2="116" stroke="#245676" stroke-width="2"/><rect x="100" y="70" width="63" height="46" fill="#247caa"/><rect x="205" y="28" width="63" height="88" fill="#dc9842"/><text x="112" y="65" fill="#153550" font-size="14">'+(id==='V62-DEMO-7-01'?'98':'97')+'</text><text x="218" y="23" fill="#153550" font-size="14">'+(id==='V62-DEMO-7-01'?'102':'100')+'</text><text x="18" y="119" fill="#153550" font-size="14">'+(id==='V62-DEMO-7-01'?'95':'95')+'</text><text x="122" y="139" fill="#153550" font-size="13">A</text><text x="230" y="139" fill="#153550" font-size="13">B</text>';
    E('p',v,'Şema ölçek hissini tartışmak içindir; kesin karşılaştırma için sayı değerlerini kullan.','v63-context');
  }else if(id==='V62-DEMO-8-03'){
    let tbl=E('table',v);tbl.innerHTML='<tr><th>x</th><th>0</th><th>2</th><th>4</th></tr><tr><th>y</th><td>7</td><td>13</td><td>19</td></tr>';
  }else if(id==='V62-DEMO-8-01'){
    E('p',v,'A ve B tarifelerinin ortak noktasını araştır.','v63-context');let svg=E('svg',v);svg.setAttribute('viewBox','0 0 340 180');
    svg.innerHTML='<line x1="38" y1="10" x2="38" y2="145" stroke="#245676" stroke-width="2"/><line x1="38" y1="145" x2="321" y2="145" stroke="#245676" stroke-width="2"/><polyline points="38,117 308,17" fill="none" stroke="#2278b6" stroke-width="4"/><polyline points="38,94 308,32" fill="none" stroke="#de8e2a" stroke-width="4"/><text x="282" y="13" font-size="13" fill="#1a6499">A</text><text x="310" y="32" font-size="13" fill="#975500">B</text><text x="10" y="14" font-size="12" fill="#153550">TL</text><text x="249" y="164" font-size="12" fill="#153550">Mesafe</text>';
    E('p',v,'Mavi: A = 30 + 8x · Turuncu: B = 60 + 5x','v63-context');
  }else{v.remove();}
 }
 function paint(){root.replaceChildren();if(!active){root.hidden=true;return}root.hidden=false;
  const a=active,c=a.atlas63Pilot,stored=!!progress()[a.id];
  E('div',root,a.ogrenme_ciktisi+' · '+c.style+' · '+c.difficulty,'v63-kicker');E('h3',root,a.baslik);
  E('p',root,'Bu etkinlikte bütün zorunlu matematik alanları birlikte doğru olmalıdır.','v63-context');
  E('div',root,c.question,'v63-question');visual(c.pilot_id,root,c);
  const form=E('div',root,null,'v63-fields');
  c.fields.forEach((f,i)=>{
   const block=E(f.type==='choice'?'fieldset':'label',form,null,'v63-field');
   E(f.type==='choice'?'legend':'span',block,f.label);
   if(f.type==='choice'){
     for(const opt of f.options){const label=E('label',block,null,'v63-radio');const input=E('input',label);input.type='radio';input.name='atlas63-field-'+i;input.value=String(opt);input.dataset.v63Field=String(i);E('span',label,opt);}
   }else{const input=E('input',block);input.type='text';input.dataset.v63Field=String(i);input.autocomplete='off';input.setAttribute('inputmode','decimal');input.setAttribute('aria-label',f.label);input.placeholder='Cevabını yaz';}
  });
  const status=E('div',root,stored?'✓ Bu görevi daha önce tamamladın.':'Modelini oluştur; bütün yanıtlar birlikte denetlenir.','v63-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');if(stored)status.dataset.success='true';
  const actions=E('div',root,null,'v63-actions');const verify=E('button',actions,'✓ Çözümü doğrula');verify.type='button';const hint=E('button',actions,'💡 İpucu','v63-hint');hint.type='button';
  const info=E('div',root,null,'v63-context');info.hidden=true;
  hint.onclick=()=>{window.MatematikAtlas64?.log({taskId:a.id,status:'hint',family:c.family});showHint=!showHint;info.hidden=!showHint;if(showHint)info.textContent='İpucu: '+a.ipucu};
  verify.onclick=()=>{if(active!==a)return;const mistakes=[];if(c.atlas66Visual&&root.dataset.v66Picked!==String(c.atlas66Visual.expectedAction))mistakes.push('görsel seçim');
   c.fields.forEach((f,i)=>{let element,val;if(f.type==='choice'){
      element=root.querySelector('input[type=radio][name="atlas63-field-'+i+'"]:checked');val=element?element.value:'';
    }else{element=root.querySelector('input[data-v63-field="'+i+'"]');val=element?.value||''}
    const okay=correct(f,val);if(!okay)mistakes.push(i+1);
    if(f.type==='numeric'&&element)element.setAttribute('aria-invalid',String(!okay));
   });
   if(mistakes.length){wrong++;window.MatematikAtlas64?.log({taskId:a.id,status:'wrong',family:c.family,wrongFields:mistakes});status.textContent='Henüz doğru değil. '+mistakes.join(', ')+'. alan(lar)ı yeniden düşün; görev tamamlanmadı.';status.dataset.error='true';status.dataset.success='false';if(wrong>=2&&!showHint){showHint=true;window.MatematikAtlas64?.log({taskId:a.id,status:'hint',family:c.family,automatic:true});info.hidden=false;info.textContent='İpucu: '+a.ipucu}return}
   const firstTry=wrong===0&&!showHint&&!window.MatematikAtlas64?.hasAttemptsToday(a.id);const usedHint=showHint;const wrongBefore=wrong;const previous=window.__atlas63Verified;window.__atlas63Verified=a.id;
   // Ana kayıt motorunda da aynı görevin doğrulanması zorunludur.
   const answer=document.getElementById('answer');answer.value='1';document.getElementById('check').click();
   window.__atlas63Verified=previous===a.id?null:previous;
   if(progress()[a.id]){
     const repeatSaved=window.MatematikAtlas64?.log({taskId:a.id,status:'correct',family:c.family,firstTry:firstTry,hintUsed:usedHint,wrongCount:wrongBefore});
     if(active===a){const liveStatus=root.querySelector('.v63-status')||status;liveStatus.textContent=repeatSaved===false?'⚠ Doğru çözdün ancak tekrar geçmişi kaydedilemedi; ilerlemeni yedekle.':'✓ Doğru! Görev ilerlemene kaydedildi.';liveStatus.dataset.error=String(repeatSaved===false);liveStatus.dataset.success=String(repeatSaved!==false);if(info.isConnected){info.hidden=false;info.textContent='Çözüm: '+c.explanation}}
   }else if(active===a){const liveStatus=root.querySelector('.v63-status')||status;liveStatus.textContent='⚠ Çözüm kontrol edildi ancak ilerleme kalıcı kaydedilemedi. Yedek almayı dene.';liveStatus.dataset.error='true'}
  };
 }
 function paintScope(outcome,grade){if(!scope)return;scope.replaceChildren();const codes=db.outcomes.filter(o=>String(o.sinif)===String(grade));const current=codes.find(o=>o.kod===outcome);if(!current)return;
  const all=db.tasks.filter(t=>t.ogrenme_ciktisi===outcome),tagged=all.filter(t=>t.atlas63Pilot),done=progress();
  E('h4',scope,current.kod+' · '+current.etiket);let w=E('div',scope,null,'v63-dataset');E('div',w,all.filter(t=>done[t.id]).length+' / '+all.length+' görev tamamlandı.');
  const families=[...new Set(tagged.map(t=>t.atlas63Pilot.family))];
  E('div',w,tagged.length+' görev için içerik üreticisi tarafından işaretlenmiş soru türü etiketi var · '+families.length+' genel aile.');
  E('p',w,'Etiketlenmemiş eski görevler “eksik” sayılmıyor; tür doğrulaması bekliyor. Görev sayısı tam öğrenme kanıtı değildir.');
  const chips=E('div',w,null,'v63-chips');families.forEach(s=>E('span',chips,s,'v63-chip'));
  E('h4',scope,'Bu sınıfın kazanımları ('+codes.length+')');let allbox=E('div',scope,null,'v63-outcomes');
  for(const o of codes){const tasks=db.tasks.filter(t=>t.ogrenme_ciktisi===o.kod),n=tasks.filter(t=>done[t.id]).length,tag=tasks.filter(t=>t.atlas63Pilot);let div=E('div',allbox);E('strong',div,o.kod+' ');E('span',div,n+'/'+tasks.length+' · Etiketli: '+tag.length);}
 }
 document.addEventListener('atlas:taskrender',e=>{window.__atlas63Verified=null;active=bank.get(String(e.detail?.id))||null;wrong=0;showHint=false;paint();paintScope(e.detail?.outcome,e.detail?.grade)});
 window.MatematikAtlas63={pilotCount:bank.size,checkNumber:number};
})();
