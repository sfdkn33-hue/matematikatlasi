/* Matematik Atlası 2.7: 5. sınıf yalnız kategorik veri ile araştırma ve kanıt eleştirisi.
   17 ayrı manipülasyon; matematiksel karar otomatik, öğrenci gerekçesi puanlanmaz. */
(()=>{'use strict';
const root=document.getElementById('statistics5PlusLab');if(!root)return;
const KEY='mathAtlasStatistics5PlusNotes';let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_e){}
const E=(par,tag,txt,cls)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==null&&txt!==undefined)el.textContent=String(txt);par.appendChild(el);return el;};
const B=(p,label,fn,cls)=>{const b=E(p,'button',label,cls||'s5-btn');b.type='button';b.onclick=fn;return b;};
const sum=a=>a.reduce((x,y)=>x+y,0),num=x=>{if(x===null||x===undefined||String(x).trim()==='')return NaN;const n=Number(String(x).replace(',','.'));return Number.isFinite(n)?n:NaN;};
let current=null;const distinctModes=new Set(['questionBuilder','neutralSurvey','privacyPlan','samplePlan','tally','barBuild','dotBuild','cycle','claim','axis','bias','repair','gap','compare','missing','scope','inconsistent']);
function cards(p,labels,values){const box=E(p,'div',null,'s5-cards');labels.forEach((v,i)=>{const card=E(box,'div',null,'s5-card');E(card,'span',v);E(card,'strong',values[i]);});}
function chart(p,labels,values,base=0){const c=E(p,'div',null,'s5-chart');const top=Math.max(...values,base+1);labels.forEach((label,i)=>{const group=E(c,'div',null,'s5-barcol');E(group,'b',values[i]);const track=E(group,'div',null,'s5-track');const bar=E(track,'span',null,'s5-bar');bar.style.height=Math.max(3,Math.round(130*(values[i]-base)/(top-base)))+'px';E(group,'small',label);});c.setAttribute('role','img');c.setAttribute('aria-label',labels.map((x,i)=>x+': '+values[i]).join('; '));return c;}
function select(s,key,label,opts){const field=E(s.ctrl,'fieldset',null,'s5-field');E(field,'legend',label);const row=E(field,'div',null,'s5-options');opts.forEach((opt,i)=>{const b=B(row,opt,()=>{s.values[key]=i;row.querySelectorAll('button').forEach(z=>z.setAttribute('aria-pressed',String(z===b)));},'s5-choice');b.setAttribute('aria-pressed','false');b.dataset.key=key;b.dataset.choice=i;});}
function number(s,key,label){const field=E(s.ctrl,'label',label,'s5-field');const inp=E(field,'input',null,'s5-input');inp.type='number';inp.inputMode='numeric';inp.step='1';inp.min='0';inp.max='120';inp.dataset.key=key;inp.placeholder='Sayı yaz';inp.oninput=()=>{if(inp.value==='')delete s.values[key];else s.values[key]=Number(inp.value);};}
function clicks(s,mode){const c=s.c;const area=E(s.ctrl,'div',null,'s5-countergrid');const preview=c.mode==='barBuild'?E(s.ctrl,'div',null,'s5-livepreview'):null;const draw=()=>{area.replaceChildren();c.labels.forEach((label,i)=>{const item=E(area,'div',null,'s5-counter');E(item,'b',label);if(mode==='dots'){const dots=E(item,'div',null,'s5-dots');for(let x=0;x<s.counts[i];x++)E(dots,'span','●');}
const row=E(item,'div',null,'s5-row');const dec=B(row,'−',()=>{s.counts[i]=Math.max(0,s.counts[i]-1);draw()},'s5-step');dec.dataset.countAction='minus';dec.dataset.index=i;
E(row,'strong',s.counts[i]);const add=B(row,'+',()=>{s.counts[i]=Math.min(40,s.counts[i]+1);draw()},'s5-step');add.dataset.countAction='plus';add.dataset.index=i;});if(preview){preview.replaceChildren();chart(preview,c.labels,s.counts);}};draw();}
function recordChips(s){const wrap=E(s.view,'div',null,'s5-tokens');for(const label of s.c.records)E(wrap,'span',label,'s5-token');}
function questionStage(s){const c=s.c,m=c.mode;
 if(['questionBuilder','neutralSurvey','privacyPlan','samplePlan','bias','scope'].includes(m)){
  E(s.view,'p','Her iki kararı da ver. Verinin kişisel bilgiler olmadan nasıl toplanacağını veya yorumlanacağını düşün.','s5-muted');
  select(s,'q',m==='scope'?'Bu veriye dayanarak savunulabilen yorum':m==='bias'?'Yanlı örnekleme yöntemi':'1. karar',c.questions);
  select(s,'method',m==='scope'?'Geçerli sınırlılık':m==='bias'?'Örneklemin gösterdiği sınır':'2. karar',c.methods);
 }
}
function dataStage(s){const c=s.c,m=c.mode;
 if(['tally','dotBuild'].includes(m)){E(s.view,'p','Gözlem kartlarını say ve ilgili kategoriye + düğmesiyle ekle.','s5-muted');recordChips(s);clicks(s,m==='dotBuild'?'dots':'columns');select(s,'top','En çok görülen kategori',c.labels);}
 if(m==='barBuild'){cards(s.view,c.labels,c.counts);E(s.view,'p','Grafiği +/− ile doğru yüksekliklerde inşa et.','s5-muted');clicks(s,'columns');select(s,'low','En az gözlenen kategori',c.labels);}
 if(m==='cycle'){
  E(s.view,'p','↑ tuşuyla adımları doğru sıraya taşı. Gizlilik ilkesinin hangi adımda uygulandığını da belirt.','s5-muted');
  const board=E(s.ctrl,'div',null,'s5-cycle');s.steps=[...c.shuffled];
  const draw=()=>{board.replaceChildren();s.steps.forEach((step,i)=>{const row=E(board,'div',null,'s5-cycleline');E(row,'span',(i+1)+'. '+step);const btn=B(row,'↑',()=>{if(i>0){[s.steps[i-1],s.steps[i]]=[s.steps[i],s.steps[i-1]];draw();}},'s5-step');btn.disabled=i===0;btn.dataset.step=step;});};draw();select(s,'privacy','Anonim veriyi gerçekten hangi adımda toplayacağız?',c.order);
 }
 if(m==='claim'){chart(s.view,c.labels,c.counts);E(s.view,'p',c.statement,'s5-claim');select(s,'claim','Bu iddia yalnız bu veri grubu için', ['Destekleniyor','Desteklenmiyor']);number(s,'margin','Karşılaştırılan iki sıklığın farkı');}
 if(m==='axis'){
  const note=E(s.view,'p','Dikey eksen '+c.baseline+' değerinden başlıyor; görsel fark olduğundan büyük görünebilir.','s5-claim');
  let holder=E(s.view,'div',null,'s5-chartbox');chart(holder,c.labels,c.counts,c.baseline);
  const b=B(s.ctrl,'↻ Eksen başlangıcını 0 yap',()=>{s.values.zero=true;holder.replaceChildren();chart(holder,c.labels,c.counts,0);note.textContent='Eksen şimdi 0’dan başlıyor. Gerçek sıklık farkını hesapla.';},'s5-btn');b.dataset.action='zero';number(s,'margin','En yüksek ve en düşük sıklık arasındaki gerçek fark');
 }
 if(m==='repair'){
  E(s.view,'p','Kayıt tablosu (gerçek değerler) ile aşağıdaki grafiği karşılaştır.','s5-muted');cards(s.view,c.labels,c.counts);chart(s.view,c.labels,c.shown);
  select(s,'corrupt','Yanlış çizilmiş sütun',c.labels);number(s,'fixed','Bu sütunun olması gereken yüksekliği');
 }
 if(m==='gap'||m==='missing'){
  cards(s.view,c.labels,c.visible.map(x=>x===null?'?':String(x)));E(s.view,'p','Toplam gözlem sayısı: '+c.total,'s5-claim');
  number(s,'hidden','Eksik sıklık');if(m==='missing')select(s,'top','Tamamlanınca en sık gözlenen kategori',c.labels);
  else select(s,'check','Eksik veri hangi kaynaktan güvenli biçimde tamamlanabilir?',['Anonim anket kayıtları','Öğrencilerin kimlik listesi','Rastgele sayı uydurma']);
 }
 if(m==='compare'){
  E(s.view,'p','A ve B gruplarının kategorik veri sıklıklarını karşılaştır.','s5-muted');
  const wrap=E(s.view,'div',null,'s5-dual');const a=E(wrap,'div'),b=E(wrap,'div');E(a,'b','A grubu');chart(a,c.labels,c.counts);E(b,'b','B grubu');chart(b,c.labels,c.other);
  E(s.view,'p','Sorulan kategori: '+c.labels[c.target],'s5-claim');select(s,'which','Hangi grupta daha çok gözlenmiş?',['A','B','Eşit']);number(s,'diff','İki grup arasındaki sıklık farkı');
 }
 if(m==='inconsistent'){
  E(s.view,'p','Asıl anonim çetele ve başka bir raporda yayımlanan değerler karşılaştırılıyor.','s5-muted');cards(s.view,c.labels,c.counts);chart(s.view,c.labels,c.reported);
  select(s,'corrupt','Raporda hangi sütun yanlış?',c.labels);number(s,'total','Orijinal çetelenin gerçek toplamı');
 }
}
function valid(s){const c=s.c,m=c.mode,v=s.values,n=Number;const same=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
 if(['questionBuilder','neutralSurvey','privacyPlan','samplePlan','bias','scope'].includes(m))return v.q===c.rightQ&&v.method===c.rightM;
 if(m==='tally'||m==='dotBuild')return same(s.counts,c.counts)&&v.top===c.top;
 if(m==='barBuild')return same(s.counts,c.counts)&&v.low===c.low;
 if(m==='cycle')return same(s.steps,c.order)&&v.privacy===2;
 if(m==='claim')return v.claim===0&&Number.isInteger(v.margin)&&v.margin===c.counts[c.target]-c.counts[c.opponent];
 if(m==='axis')return v.zero===true&&Number.isInteger(v.margin)&&v.margin===c.margin;
 if(m==='repair')return v.corrupt===c.corrupt&&Number.isInteger(v.fixed)&&v.fixed===c.counts[c.corrupt];
 if(m==='gap')return Number.isInteger(v.hidden)&&v.hidden===c.counts[c.hidden]&&v.check===0;
 if(m==='missing')return Number.isInteger(v.hidden)&&v.hidden===c.counts[c.hidden]&&v.top===c.top;
 if(m==='compare')return v.which===['A','B','Eşit'].indexOf(c.which)&&Number.isInteger(v.diff)&&v.diff===c.delta;
 if(m==='inconsistent')return v.corrupt===c.corrupt&&Number.isInteger(v.total)&&v.total===sum(c.counts);
 return false;
}
function render(task,onComplete){root.hidden=!Boolean(task.research5PlusLab);root.replaceChildren();if(!task.research5PlusLab){current=null;return;}
 const c=task.research5PlusLab;if(!distinctModes.has(c.mode))return;
 const s={task,c,values:{},counts:[0,0,0],steps:null,done:false,onComplete,reason:saved[task.id]||''};current=s;root.dataset.taskId=task.id;root.dataset.mode=c.mode;
 E(root,'div','5. SINIF · KATEGORİK VERİ · ARAŞTIR / SORGULA','s5-kicker');E(root,'h3',task.mekanik);E(root,'p',task.gorev,'s5-intro');s.view=E(root,'div',null,'s5-view');s.ctrl=E(root,'div',null,'s5-ctrl');
 questionStage(s);dataStage(s);
 const label=E(root,'label',c.needReason?'Gerekçeni yaz (isteğe bağlı; puanlanmaz):':'Gerekçeni yaz (isteğe bağlı; isteğe bağlı nottur):','s5-reason');
 const text=E(label,'textarea',null);text.rows=2;text.placeholder='Bu verinin hangi sonucu desteklediğini ve sınırlarını açıkla...';text.value=s.reason;
 text.addEventListener('input',()=>{s.reason=text.value.slice(0,2000);saved[task.id]=s.reason;try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(_e){}});
 s.status=E(root,'p','Hazır: modeli kur, ardından kontrol et.','s5-status');s.status.setAttribute('role','status');s.status.setAttribute('aria-live','polite');
 const row=E(root,'div',null,'s5-actions');const verify=B(row,'✓ Araştırmayı kontrol et',()=>{
  if(s.done)return;
  if(!valid(s)){s.status.textContent='🔎 Eksik veya yanlış karar var. Veriyi ve iki işlemi yeniden kontrol et.';s.status.dataset.error='true';return;}
  s.done=true;s.status.dataset.error='false';s.status.textContent='✅ Kategorik veri modeli doğrulandı. Gerekçenin içeriği isteğe bağlı nottur.';onComplete();
 },'s5-primary');verify.dataset.action='verify';
 B(row,'💡 İpucu',()=>s.status.textContent=task.ipucu,'s5-btn');B(row,'↻ Yeniden başla',()=>render(task,onComplete),'s5-btn');
 E(root,'p','Bu atölye yalnızca kurmaca ve anonim kategorik veriler kullanır. Çözüm koşulları otomatik kontrol edilir; yazılı gerekçeler otomatik doğru sayılmaz. İlerleme bu tarayıcıda saklanır.','s5-note');
}
window.MatematikAtlasStatistics5Plus={render,validateForTests:valid,getCurrentForTests:()=>current};
})();
