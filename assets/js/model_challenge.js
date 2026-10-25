/* Mathematics Atlas v2.2. Required second manipulation for 116 previously identical main models.
   On completed tasks the original local progress is respected. Text is always textContent. */
(()=>{'use strict';
 const root=document.getElementById('modelChallengeLab');
 if(!root)return;
 const KEY='mathAtlasModelChallengeV22';
 let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){saved={}}
 let current=null;
 function make(tag,parent,text,cls){const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined&&text!==null)x.textContent=String(text);parent.appendChild(x);return x}
 function btn(parent,text,fn){const b=make('button',parent,text,'mc-button');b.type='button';b.addEventListener('click',fn);return b}
 function report(s,msg,wrong){s.textContent=msg;s.dataset.error=String(!!wrong)}
 const fmt=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:3});
 function persist(){try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(_){}}
 function completed(active){active.solved=true;saved[active.key]=true;persist();report(active.status,'✅ İkinci matematiksel karar da doğrulandı. '+active.cfg.kanit,false);
  if(active.callback){const cb=active.callback;active.callback=null;cb();}}
 function baseControls(cfg,p,mode){
  const wrong=Number(cfg.dogru)+Number(cfg.fark),two=Math.max(0,Number(cfg.dogru)-Number(cfg.fark));
  const useDefault=cfg.dogru===0?Math.min(2,wrong):0;
  if(String(mode).startsWith('v59_')){
   const stage=make('div',p,null,'mc59-stage');
   const numeric=(label)=>{const wrap=make('label',stage,label,'mc59-field');const el=make('input',wrap,null,'mc59-number');el.type='number';el.inputMode='numeric';el.step='1';el.autocomplete='off';return el};
   const choice=(labels)=>{const wrap=make('div',stage,null,'mc59-buttons');let selected=null;
    labels.forEach((label,i)=>{const b=btn(wrap,label,()=>{selected=i;wrap.querySelectorAll('button').forEach((v,j)=>v.setAttribute('aria-pressed',String(i===j)))});b.setAttribute('aria-pressed','false')});return ()=>selected};
   const note=(s)=>make('p',stage,s,'mc59-note');
   if(mode==='v59_net'){
    note('Üç ölçüden oluşan kapalı kutunun altı yüzü var. Yüz kartlarının her biri gerçek bir yüzeyi gösterir.');
    const faces=make('div',stage,null,'mc59-faces');let picked=-1;
    ['Üst','Alt','Ön','Arka','Sol','Sağ'].forEach((name,i)=>{const b=btn(faces,name+' · '+cfg.faces[i]+' cm²',()=>{picked=i;faces.querySelectorAll('button').forEach((el,j)=>el.setAttribute('aria-pressed',String(j===i)))});b.setAttribute('aria-pressed','false')});
    const ans=numeric('Yüz çıkarıldıktan sonra kalan alan (cm²)');
    return ()=>picked===cfg.which&&ans.value!==''&&Number(ans.value)===cfg.remain;
   }
   if(mode==='v59_circle'){
    const max=Math.max(cfg.r,cfg.r2),oldrad=53*cfg.r/max,newrad=53*cfg.r2/max;
    const graphic=make('div',stage,null,'mc59-svg');graphic.innerHTML=`<svg viewBox="0 0 320 148" role="img" aria-label="İlk yarıçap ${cfg.r}, yeni yarıçap ${cfg.r2}"><circle cx="79" cy="64" r="${oldrad}" fill="#d1e8fb" stroke="#116392" stroke-width="2"/><circle cx="242" cy="64" r="${newrad}" fill="#b2edda" stroke="#176b51" stroke-width="2"/><path d="M79 64 h${oldrad}" stroke="#173b60" stroke-width="2"/><path d="M242 64 h${newrad}" stroke="#185741" stroke-width="2"/><text x="79" y="135" text-anchor="middle" fill="#1e4667" font-size="14">Önce r=${cfg.r}</text><text x="242" y="135" text-anchor="middle" fill="#1e4667" font-size="14">Sonra r=${cfg.r2}</text></svg>`;
    note('Alan yarıçapın karesi ile değişir. Şekiller aynı ölçekle çizildi.');
    const c=choice(['Alan arttı','Alan azaldı']);const answer=numeric('İki alan arasındaki farkın π katsayısı');
    return ()=>c()===(cfg.direction==='arttı'?0:1)&&answer.value!==''&&Number(answer.value)===cfg.delta;
   }
   if(mode==='v59_root'){
    const n=cfg.n,k=cfg.low;
    const graph=make('div',stage,null,'mc59-svg');graph.innerHTML=`<svg viewBox="0 0 340 112" role="img" aria-label="${k} ile ${k+1} sayı doğrusu ve orta nokta"><path d="M32 43 H307" stroke="#1c6888" stroke-width="4"/><path d="M307 43 l-9 -6 v12 z" fill="#1c6888"/><rect x="46" y="33" width="114" height="20" rx="9" fill="#d0e7ff"/><rect x="160" y="33" width="114" height="20" rx="9" fill="#bdebd7"/>${[46,160,274].map(x=>`<path d="M${x} 31 v24" stroke="#234360" stroke-width="2"/>`).join('')}<text x="46" y="79" text-anchor="middle" fill="#173d60" font-size="16">${k}</text><text x="160" y="79" text-anchor="middle" fill="#173d60" font-size="16">${k+0.5}</text><text x="274" y="79" text-anchor="middle" fill="#173d60" font-size="16">${k+1}</text><text x="160" y="102" text-anchor="middle" fill="#173d60" font-size="12">√${n} hangi yarıda?</text></svg>`;
    const c=choice(['Sol yarıda','Sağ yarıda']);note(`Karesini alırken kesirden kaçınmak için 4×${n} ile (${2*k+1})² değerlerini karşılaştır.`);
    const rel=choice([`4×${n} < (${2*k+1})²`,`4×${n} > (${2*k+1})²`]);
    return ()=>c()===(cfg.side==='sol'?0:1)&&rel()===(cfg.comparison==='<'?0:1);
   }
   if(mode==='v59_graph'){
    const mx=Math.max(1,...cfg.values.flat());const h=175,w=430,pts=[];
    const svg=make('div',stage,null,'mc59-svg');let lines='';
    for(let v=0;v<=mx;v+=Math.max(1,Math.ceil(mx/5))){let y=145-v/mx*105;lines+=`<path d="M35 ${y} H407" stroke="#d0e0e8"/><text x="30" y="${y+4}" text-anchor="end" fill="#32536d" font-size="12">${v}</text>`}
    const colors=['#0c6a9b','#ad4d25','#27826c'];
    cfg.values.forEach((row,i)=>{let points=row.map((v,j)=>[55+j*107,145-v/mx*105]);lines+=`<polyline fill="none" stroke="${colors[i]}" stroke-width="3" points="${points.map(x=>x.join(',')).join(' ')}"/>`;
       for(const [x,y] of points)lines+=`<circle cx="${x}" cy="${y}" r="5" fill="${colors[i]}"/><text x="${x}" y="${y-9}" text-anchor="middle" fill="#153a54" font-size="11">${row[points.findIndex(p=>p[0]===x)]}</text>`;});
    for(let i=0;i<4;i++)lines+=`<text x="${55+i*107}" y="170" text-anchor="middle" fill="#1c405d" font-size="12">${i+1}. dönem</text>`;
    svg.innerHTML=`<svg viewBox="0 0 ${w} ${h+5}" role="img" aria-label="A B C gruplarının dört dönemlik çizgi grafiği">${lines}</svg>`;
    note('A: mavi çizgi · B: turuncu çizgi · C: yeşil çizgi. Net değişim = son dönem değeri − ilk dönem değeri.');
    const c=choice(['A','B','C','Eşit en büyük']);const ans=numeric('En büyük net değişimin işaretli değeri');const i={'A':0,'B':1,'C':2,'Eşit':3}[cfg.winner];
    return ()=>c()===i&&ans.value!==''&&Number(ans.value)===cfg.delta;
   }
   if(mode==='v59_balance'){
    let a=cfg.a,b=cfg.b;
    const view=make('div',stage,null,'mc59-balls');
    const paint=()=>{view.replaceChildren();[['Kırmızı',a,'mc59-red'],['Mavi',b,'mc59-blue']].forEach(([name,num,klass])=>{const line=make('div',view,null,'mc59-ballrow');make('strong',line,name+' · '+num);const tray=make('div',line,null,'mc59-balltray');for(let i=0;i<num;i++)make('span',tray,'',klass)})};paint();
    const controls=make('div',stage,null,'mc59-buttons');btn(controls,'+ Kırmızı ekle',()=>{if(a<30){a++;paint()}});btn(controls,'+ Mavi ekle',()=>{if(b<30){b++;paint()}});btn(controls,'↺ Sıfırla',()=>{a=cfg.a;b=cfg.b;paint()});
    note('Yalnızca bilye ekleyebilirsin; olasılıkların eşit olması için iki renk sayısı aynı olmalı. En az kaç bilye gerekir?');
    const ans=numeric('Denge sağlandığında torbanın toplam bilye sayısı');
    return ()=>a===b&&(a-cfg.a)+(b-cfg.b)===cfg.needs&&ans.value!==''&&Number(ans.value)===cfg.new_total;
   }
  }
  if(mode==='ruler'){
   make('p',p,'Tahmin kaydırıcısı: önce verilen ilişkiyi düşün, sonra ölçüyü ayarla.','mc-instruction');
   const out=make('output',p,fmt(useDefault),'mc-number');const range=make('input',p,null,'mc-range');range.type='range';range.min='0';range.max=String(Math.max(12,Math.ceil(cfg.dogru+cfg.fark*4)));range.step='1';range.value=String(useDefault);range.setAttribute('aria-label',cfg.soru);let touched=false;
   range.addEventListener('input',()=>{touched=true;out.textContent=fmt(range.value)});
   return ()=>touched&&Number(range.value)===Number(cfg.dogru);
  }
  if(mode==='digits'){
   make('p',p,'Basamak makinesi: + ve − düğmeleriyle doğru sayıyı inşa et.','mc-instruction');
   const box=make('div',p,null,'mc-digits');const state={yuz:0,on:0,bir:0};const outputs={};
   for(const [id,title,step] of [['yuz','Yüzlük',100],['on','Onluk',10],['bir','Birlik',1]]){
    const line=make('div',box,null,'mc-digit');make('span',line,title);const dec=btn(line,'−',()=>{state[id]=Math.max(0,state[id]-1);outputs[id].textContent=state[id];refresh()});outputs[id]=make('strong',line,0);const inc=btn(line,'+',()=>{state[id]=Math.min(id==='yuz'?9:9,state[id]+1);outputs[id].textContent=state[id];refresh()});dec.setAttribute('aria-label',title+' azalt');inc.setAttribute('aria-label',title+' artır');
   }
   const out=make('output',p,'0','mc-number');function refresh(){out.textContent=String(state.yuz*100+state.on*10+state.bir)}
   return ()=>state.yuz*100+state.on*10+state.bir===Number(cfg.dogru);
  }
  if(mode==='diagnose'){
   make('p',p,'Üç öğrencinin modellerini karşılaştır. Matematiksel olarak hatalı olan İKİ sonucu işaretle.','mc-instruction');
   const options=[cfg.dogru,wrong,two];if(new Set(options).size!==3){options[2]=cfg.dogru+cfg.fark*2}
   const a=make('div',p,null,'mc-options');const choices=new Set();
   options.forEach((v,i)=>{const b=btn(a,'Model '+(i+1)+': '+fmt(v),()=>{if(choices.has(i))choices.delete(i);else choices.add(i);b.setAttribute('aria-pressed',String(choices.has(i))) });b.setAttribute('aria-pressed','false')});
   return ()=>choices.size===2&&choices.has(1)&&choices.has(2);
  }
  if(mode==='order'){
   make('p',p,'Çözüm adımlarını matematiksel sıraya koy, sonra sonucu gir.','mc-instruction');
   const labels=['Verilen şekli veya veri grubunu incele','İlgili matematiksel ilişkiyi uygula','Sonucu ilk model üzerinde kontrol et'];const state=[labels[2],labels[0],labels[1]];
   const list=make('div',p,null,'mc-steps');function redraw(){list.replaceChildren();state.forEach((str,i)=>{const l=make('div',list,null,'mc-step');make('span',l,(i+1)+'. '+str);const b=btn(l,'↑',()=>{if(i>0){[state[i-1],state[i]]=[state[i],state[i-1]];redraw()}});b.disabled=i===0;b.setAttribute('aria-label',(i+1)+'. adımı yukarı taşı')})}redraw();
   const label=make('label',p,'Bulduğun değer:','mc-input-label');const val=make('input',label,null,'mc-input');val.type='number';val.inputMode='numeric';val.placeholder='Sonuç';
   return ()=>state.every((x,i)=>x===labels[i])&&val.value!==''&&Number(val.value)===Number(cfg.dogru);
  }
  if(mode==='comparison'){
   make('p',p,'İki çizelgeden hangisi modeli doğru gösteriyor? Seç ve ölçüyü kendin düzelt.','mc-instruction');
   const options=make('div',p,null,'mc-options');let chosen=null;
   const candidates=[wrong,cfg.dogru];candidates.forEach((v,i)=>{const b=btn(options,(i?'B':'A')+' çizelgesi · '+fmt(v),()=>{chosen=i;options.querySelectorAll('button').forEach((x,j)=>x.setAttribute('aria-pressed',String(j===i)))});b.setAttribute('aria-pressed','false')});
   const label=make('label',p,'Doğru değer (kendi hesabın):','mc-input-label');const input=make('input',label,null,'mc-input');input.type='number';input.inputMode='decimal';
   return ()=>chosen===1&&input.value!==''&&Number(input.value)===Number(cfg.dogru);
  }
  throw Error('Unknown model type '+mode);
 }
 function render(task,alreadyDone){root.replaceChildren();const cfg=task?.modelChallenge;root.hidden=!cfg;current=null;if(!cfg)return;
  const a={id:task.id,key:task.id+(cfg.rev?'@'+cfg.rev:''),cfg,status:null,callback:null,solved:!!saved[task.id+(cfg.rev?'@'+cfg.rev:'')]||!!alreadyDone};current=a;
  make('div',root,'II. ETAP · FARKLI BİR MATEMATİKSEL KARAR','mc-kicker');make('h3',root,'🧩 Modeli derinleştir');make('p',root,cfg.soru,'mc-question');
  const area=make('div',root,null,'mc-workspace');const check=baseControls(cfg,area,cfg.tur);
  a.status=make('p',root,a.solved?'✅ Bu ikinci model daha önce tamamlandı.':'Ana görevi ve bu ikinci modeli doğru çözerek ilerle.','mc-status');a.status.setAttribute('role','status');a.status.setAttribute('aria-live','polite');
  const actions=make('div',root,null,'mc-actions');const verify=btn(actions,'✓ İkinci modeli denetle',()=>{if(check())completed(a);else report(a.status,'🔎 Model henüz tutarlı değil. Görevdeki matematiksel ilişkiyi yeniden kullan.',true)});verify.id='modelChallengeCheck';
  btn(actions,'💡 Kuralı hatırla',()=>{const hints={v59_net:'Kapalı kutunun yüzey alanından çıkarılan tek yüzün alanını eksilt.',v59_circle:'İki dairenin alanını πr² ile ayrı hesapla, farkın π katsayısını karşılaştır.',v59_root:'Orta noktayla kıyaslamak için 4n ile (2k+1)² değerlerini karşılaştır.',v59_graph:'Her grup için son dönem değerinden ilk dönem değerini çıkar.',v59_balance:'Önce az bilyesi olan rengi belirle; eşitlik sağlanana kadar yalnız o renge ekle.'};report(a.status,'İpucu: '+(hints[cfg.tur]||cfg.kanit),false)});
  if(a.solved)report(a.status,'✅ Bu model tamamlandı. İlerleme kaydı korunuyor.',false);
 }
 // Returns true if primary completion may proceed; otherwise holds a callback until the challenge succeeds.
 function gate(task,callback){if(!task.modelChallenge)return true;
  if(saved[task.id+(task.modelChallenge.rev?'@'+task.modelChallenge.rev:'')]||current?.id===task.id&&current.solved)return true;
  if(current?.id!==task.id)return false;
  current.callback=callback;report(current.status,'Ana çalışma doğru! Görev tamamlanmadan önce bu ikinci modeli de bitir.',false);
  return false;
 }
 window.MatematikAtlasChallenge={render,gate,snapshot:()=>({...saved}),active:()=>current?.id||null};
})();
