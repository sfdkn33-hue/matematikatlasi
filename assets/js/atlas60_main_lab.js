/* Matematik Atlası v6.0: 100 tasks with distinct, verified PRIMARY interactions.
   No teacher approvals. Existing progress IDs retained. */
(()=>{'use strict';
 const $=id=>document.getElementById(id),root=$('atlas60MainLab');if(!root||!window.ATLAS_DB)return;
 const bank=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas60Lab).map(t=>[t.id,t]));
 let task=null,c=null,state={},wrongCount=0,hintUsed=false;
 const fam=()=>({layers:'Küp katmanları',volume_design:'Hacim tasarımı',coprime:'Aralarında asallık',place:'Basamak değerleri',root:'Karekök modelleri'}[c?.kind]||'Ana model')+' · '+(c?.variant??task?.gorev_no%5);
 const saved=id=>{try{return !!JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')[id]}catch{return false}};
 function el(tag,parent,txt,cls){let x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined&&txt!==null)x.textContent=txt;parent.appendChild(x);return x}
 function button(parent,s,fn){let x=el('button',parent,s,'v60-btn');x.type='button';x.onclick=fn;return x}
 function message(s,err=false){$('atlas60Feedback').textContent=s;$('atlas60Feedback').dataset.error=String(err)}
 function input(p,label,kind='number'){let wrap=el('label',p,label,'v60-field');let x=el('input',wrap,null,'v60-input');x.type=kind;x.inputMode=kind==='number'?'decimal':'text';x.autocomplete='off';x.setAttribute('aria-label',label);return x}
 function pick(p,opts,name){const wrap=el('div',p,null,'v60-picks');state[name]=null;opts.forEach((v,i)=>{let b=button(wrap,String(v),()=>{state[name]=i;wrap.querySelectorAll('button').forEach((x,j)=>x.setAttribute('aria-pressed',String(j===i)))});b.setAttribute('aria-pressed','false')});return wrap}
 const value=(id)=>{let s=$('v60-'+id)?.value?.trim();if(!s)return NaN;return Number(s.replace(',','.'))};
 const near=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<1e-7;
 const fill=p=>{const m=el('div',p,null,'v60-grid-cubes');const [a,b]=c.base;for(let k=0;k<a*b;k++)el('span',m,'','v60-cube');el('small',p,a+' × '+b+' = '+a*b+' birim küp/kat','v60-caption')};
 function draw(){root.replaceChildren();if(!task)return;
  el('div',root,'MATEMATİK ATLASI · YENİ ANA GÖREV','v60-eyebrow');el('h3',root,task.baslik,'v60-title');el('p',root,task.gorev,'v60-instructions');let stage=el('div',root,null,'v60-stage');state={};
  if(c.kind==='layers'){
   fill(stage);const output=el('strong',stage,'Kat sayısı: 0','v60-counter');let range=el('input',stage,null,'v60-range');range.type='range';range.min=0;range.max=Math.max(2,c.target+2);range.value='0';range.step=1;range.setAttribute('aria-label','Modeldeki kat sayısı');state.layers=0;state.touched=false;
   range.oninput=()=>{state.layers=Number(range.value);state.touched=true;output.textContent='Kat sayısı: '+state.layers+' · Küp: '+state.layers*c.per_layer};
   let a=input(stage,'Bir katın küp sayısı');a.id='v60-layer';let b=input(stage,'Kurulan modeldeki toplam küp');b.id='v60-total';
   state.verify=()=>state.touched&&state.layers===c.target&&near(value('layer'),c.per_layer)&&near(value('total'),c.total);
  } else if(c.kind==='volume_design'){
   fill(stage);el('div',stage,'Hedef hacim: '+c.target+' birimküp','v60-target');let range=el('input',stage,null,'v60-range');range.type='range';range.min=1;range.max=Math.max(12,c.height+3);range.step=1;range.value=1;range.setAttribute('aria-label','Yüksekliği tasarla');state.height=1;state.moved=false;let label=el('strong',stage,'Yükseklik: 1','v60-counter');range.oninput=()=>{state.moved=true;state.height=Number(range.value);label.textContent='Yükseklik: '+range.value+' · Hacim: '+c.base_area*state.height};
   let a=input(stage,'Taban alanı (birimkare)');a.id='v60-area';let b=input(stage,'Tasarlanan hacim (birimküp)');b.id='v60-result';
   state.verify=()=>state.moved&&state.height===c.height&&near(value('area'),c.base_area)&&near(value('result'),c.target);
  } else if(c.kind==='coprime'){
   const variant=c.variant;
   if(variant===0||variant===2||variant===4){
    const items=el('div',stage,null,'v60-picks');el('strong',items,c.a+' ve '+c.b,'v60-pair');pick(stage,['Aralarında asal','Aralarında asal değil'],'judgment');const a=input(stage,'EBOB değerini yaz');a.id='v60-gcd';
    state.verify=()=>state.judgment===(c.is_coprime?0:1)&&near(value('gcd'),c.gcd);
   }else{
    el('p',stage,'Sabit sayı: '+c.partner+' · Değişecek sayı: '+c.start,'v60-target');pick(stage,c.candidate.map(v=>String(v)),'candidate');let a=input(stage,'En küçük artış miktarı');a.id='v60-shift';
    state.verify=()=>state.candidate===c.shift&&near(value('shift'),c.shift);
   }
  } else if(c.kind==='place'){
   el('div',stage,c.number,'v60-big-number');const powers=c.powers;
   if(c.variant===0){
    const grid=el('div',stage,null,'v60-place');const selects=[];c.digits.forEach((digit,i)=>{let wrap=el('label',grid,'Rakam '+(i+1)+': '+digit,'v60-field');let select=el('select',wrap,null,'v60-input');let blank=el('option',select,'10 üzeri seç');blank.value='';const choices=[...new Set([...powers,powers[0]+1,powers[powers.length-1]-1])].sort((a,b)=>b-a);choices.forEach(z=>{let opt=el('option',select,'10^'+z);opt.value=z});selects.push(select)});
    state.verify=()=>selects.every((s,i)=>s.value!==''&&Number(s.value)===powers[i]);
   }else if(c.variant===1){
    const rows=el('div',stage,null,'v60-place');c.digits.forEach((d,i)=>el('div',rows,(i+1)+'. satır: '+d+' × 10^'+c.wrong[i],'v60-line'));pick(stage,c.digits.map((_,i)=>(i+1)+'. satır'),'error');let inp=input(stage,'Yanlış satır için doğru üs');inp.id='v60-power';state.verify=()=>state.error===c.wrong_index&&near(value('power'),powers[c.wrong_index]);
   }else if(c.variant===2){
    el('p',stage,'İşaretli rakam: '+c.digits[c.focus_index]+' (soldan '+(c.focus_index+1)+'.)','v60-caption');pick(stage,[...new Set([...powers])].sort((a,b)=>b-a).map(x=>'10^'+x),'powerChoice');const choices=[...new Set(powers)].sort((a,b)=>b-a);let inp=input(stage,'Bu rakamın basamak değeri');inp.id='v60-contribution';const expected=c.digits[c.focus_index]*Math.pow(10,powers[c.focus_index]);state.verify=()=>state.powerChoice===choices.indexOf(powers[c.focus_index])&&near(value('contribution'),expected);
   }else{
    const multiply=c.variant===3;el('p',stage,multiply?'Virgül sağa bir basamak kayınca 10 katına çıkar.':'Virgül sola bir basamak kayınca sayı 10’a bölünür.','v60-caption');let inp=input(stage,multiply?'10 katına çıkan sayı':'10’a bölünen sayı');inp.id='v60-tenfold';let s=input(stage,'Soldan ilk rakamın başlangıçtaki 10 üssü');s.id='v60-power';state.verify=()=>near(value('tenfold'),multiply?c.tenfold:c.tenth)&&near(value('power'),powers[0]);
   }
  } else if(c.kind==='root'){
   el('div',stage,'√'+c.n,'v60-big-number');let line=el('div',stage,null,'v60-rootline');for(let x=c.lo-1;x<=c.hi+1;x++)el('span',line,String(x),'v60-mark');
   if(c.variant===0){pick(stage,[c.lo+' ile '+c.hi,(c.lo-1)+' ile '+c.lo,c.hi+' ile '+(c.hi+1)],'interval');let a=input(stage,'Küçük doğal sayının karesi');a.id='v60-square';state.verify=()=>state.interval===0&&near(value('square'),c.lo*c.lo)}
   else if(c.variant===1){pick(stage,['Orta noktanın solunda','Orta noktanın sağında'],'half');let a=input(stage,'4×'+c.n+' değeri');a.id='v60-proof';state.verify=()=>state.half===(c.side==='sol'?0:1)&&near(value('proof'),4*c.n)}
   else if(c.variant===2){pick(stage,[String(c.lo),String(c.hi)],'rounded');let a=input(stage,'Yakın tam sayıya uzaklığı anlamak için üst tam karenin n’den farkı');a.id='v60-gap';state.verify=()=>state.rounded===(c.near===c.lo?0:1)&&near(value('gap'),c.dist_high)}
   else if(c.variant===3){let a=input(stage,'Alanı örtebilecek en küçük tam sayı kenar');a.id='v60-edge';let b=input(stage,'Kaplamadan artan birimkare');b.id='v60-surplus';state.verify=()=>near(value('edge'),c.hi)&&near(value('surplus'),c.surplus)}
   else{let a=input(stage,'Alanı aşmadan sığan en büyük kare kenarı');a.id='v60-edge';let b=input(stage,'Kareyi çıkarınca geride kalan alan');b.id='v60-surplus';state.verify=()=>near(value('edge'),c.lo)&&near(value('surplus'),c.dist_low)}
  }
  const status=el('p',root,'Modeli kur, ardından denetle.','v60-status');status.id='atlas60Feedback';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const actions=el('div',root,null,'v60-actions');button(actions,'✓ Çözümümü denetle',()=>{if(!task||!state.verify)return;let result=false;try{result=state.verify()}catch(_){result=false}if(!result){wrongCount++;window.MatematikAtlas64?.log({taskId:task.id,status:'wrong',family:fam(),focus:'adimlar'});message('🔎 Henüz doğru değil. Modeli ve bütün ara adımları tekrar incele.',true);return}
   const old=task.id,firstTry=wrongCount===0&&!hintUsed&&!window.MatematikAtlas64?.hasAttemptsToday(old);
   window.__atlas60Verified=old;$('answer').value=task.beklenen_yanit_veya_rubrik;$('check').click();window.__atlas60Verified=null;
   if(saved(old)){const ok=window.MatematikAtlas64?.log({taskId:old,status:'correct',family:fam(),firstTry,hintUsed,wrongCount});message(ok===false?'⚠ Görev doğru ama deneme geçmişi kaydedilemedi. Yedek al.':'✅ Ana model doğrulandı; görev kaydedildi.',ok===false)}
   else message('⚠ Matematiksel çözüm doğru, fakat ilerleme kaydı başarısız. Yedek al.',true);
  });
  button(actions,'💡 İpucu',()=>{hintUsed=true;window.MatematikAtlas64?.log({taskId:task.id,status:'hint',family:fam()});message(task.ipucu)});button(actions,'↻ Yeniden dene',()=>draw());
 }
 document.addEventListener('atlas:taskrender',e=>{task=bank.get(e.detail?.id)||null;c=task?.atlas60Lab||null;wrongCount=0;hintUsed=false;root.hidden=!task;if(task)draw();else root.replaceChildren()});
})();
