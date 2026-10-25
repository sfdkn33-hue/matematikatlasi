/* MATEMATIK ATLASI v2.8 - 5th grade algebraic thinking; no eval or dynamic code. */
(()=>{'use strict';
const root=document.getElementById('algebra5PlusLab');if(!root)return;
const KEY='mathAtlasAlgebra5PlusNotes';let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){}
const modes=new Set(['balance','tiles','regroup','repairEquality','precedence','brackets','powers','storyFormula','patternTable','shapeGrow','ruleMachine','counterexample','machineTrace','flowOrder','loopTrace','bugFix']);
const E=(p,tag,content,cls)=>{const z=document.createElement(tag);if(cls)z.className=cls;if(content!==null&&content!==undefined)z.textContent=String(content);p.append(z);return z};
const button=(p,text,fn,cls='a5-btn')=>{const z=E(p,'button',text,cls);z.type='button';z.addEventListener('click',fn);return z};
let now=null;
function select(s,key,label,options){const fs=E(s.ctrl,'fieldset',null,'a5-field');E(fs,'legend',label);const row=E(fs,'div',null,'a5-options');options.forEach((option,i)=>{const z=button(row,option,()=>{s.values[key]=i;row.querySelectorAll('button').forEach(k=>k.setAttribute('aria-pressed',String(k===z)));if(s.paintExtra)s.paintExtra();},'a5-choice');z.dataset.key=key;z.dataset.choice=i;z.setAttribute('aria-pressed','false');});}
function number(s,key,label){const field=E(s.ctrl,'label',label,'a5-field');const input=E(field,'input',null,'a5-input');input.type='number';input.step='1';input.inputMode='numeric';input.dataset.key=key;input.placeholder='Sayı gir';input.addEventListener('input',()=>{if(input.value.trim()==='')delete s.values[key];else s.values[key]=Number(input.value);});}
function lines(s,...items){const wrap=E(s.view,'div',null,'a5-lines');items.forEach(item=>E(wrap,'span',item,'a5-line'));return wrap;}
function tiles(s,rows,left,right){const grid=E(s.view,'div',null,'a5-tiles');grid.style.gridTemplateColumns=`repeat(${left+right},minmax(7px,1fr))`;for(let i=0;i<rows;i++)for(let k=0;k<left+right;k++)E(grid,'span',null,k<left?'a5-tile-left':'a5-tile-right');E(s.view,'p',`${rows} satır · ${left} mavi sütun · ${right} turuncu sütun`,'a5-muted');}
function drawShapes(s,step,base){const wrap=E(s.view,'div',null,'a5-shapes');for(let n=1;n<=3;n++){const box=E(wrap,'div',null,'a5-shape');E(box,'b',n+'. adım');const row=E(box,'div',null,'a5-shape-row');for(let j=0;j<base+step*n;j++)E(row,'span','▣');}}
function ordered(s,items,shuffled){s.steps=[...shuffled];const outer=E(s.ctrl,'div',null,'a5-order');const redraw=()=>{outer.replaceChildren();s.steps.forEach((v,i)=>{const row=E(outer,'div',null,'a5-orderline');E(row,'span',(i+1)+'. '+v);const z=button(row,'↑',()=>{if(i){[s.steps[i],s.steps[i-1]]=[s.steps[i-1],s.steps[i]];redraw()}},'a5-btn');z.disabled=i===0;z.dataset.up=i;});};redraw();}
function visualBalance(s){const c=s.c;const dock=E(s.view,'div',null,'a5-balance');dock.setAttribute('role','img');dock.setAttribute('aria-label','Terazinin iki kefesinin değişimini gösteren model');
 const redraw=()=>{dock.replaceChildren();const left=(c.a+c.b)+(s.values.both===0||s.values.both===1?c.change:0);const right=c.base+(s.values.both===0||s.values.both===2?c.change:0);
 const l=E(dock,'div',null,'a5-pan');E(l,'small','SOL KEFE');E(l,'strong',left);E(dock,'span',left===right?'⚖️':'⚠️','a5-balance-icon');const r=E(dock,'div',null,'a5-pan');E(r,'small','SAĞ KEFE');E(r,'strong',right);E(dock,'p',left===right?'Terazi dengede.':'Terazi dengesiz; iki tarafı karşılaştır.','a5-balance-state');};
 s.paintExtra=redraw;redraw();}
function visualPattern(s){const c=s.c;const board=E(s.view,'div',null,'a5-sequence');for(let i=0;i<4;i++){const cell=E(board,'div',null,'a5-seq-card');E(cell,'small',(i+1)+'. adım');E(cell,'strong',c.first+i*c.step)}}
function visualMachine(s){const c=s.c;const b=E(s.view,'div',null,'a5-machine-flow');[c.inp,'+ '+c.plus,'?', '× '+c.mult,'?'].forEach((txt,i)=>E(b,'div',txt,i%2===0?'a5-machine-node':'a5-machine-action'))}
function formatCode(s){const c=s.c,m=c.mode;
 if(m==='balance'){lines(s,`${c.a} + ${c.b} = ${c.a+c.b}`,`Her iki tarafa da ${c.change} ekleyerek eşitliği koru.`);select(s,'both','Terazinin iki kefesine ne yapmalıyız?',[`Her ikisine ${c.change} ekle`,`Yalnız sol kefeye ${c.change} ekle`,`Yalnız sağ kefeye ${c.change} ekle`]);number(s,'left','Yeni sol taraf');number(s,'right','Yeni sağ taraf');visualBalance(s);}
 if(m==='tiles'){lines(s,`${c.rows} × (${c.left} + ${c.right}) = ?`);tiles(s,c.rows,c.left,c.right);number(s,'part1','Mavi bölgenin birim kare sayısı');number(s,'part2','Turuncu bölgenin birim kare sayısı');number(s,'total','Toplam kare sayısı');}
 if(m==='regroup'){lines(s,`(${c.a} × ${c.b}) × ${c.c} = ${c.a} × (${c.b} × ${c.c})`);select(s,'property','Hangi özellik geçerlidir?',['Birleşme','Dağılma','Çıkarmanın değişme özelliği']);number(s,'pair','İlk grupta '+c.a+' × '+c.b+' kaç eder?');number(s,'total','İki gruplayışın ortak sonucu');}
 if(m==='repairEquality'){lines(s,`${c.a} + ${c.b} = ${c.rightA} + ${c.rightB} + ${c.error}  ?`);select(s,'repair','Sağ tarafta eşitliği nasıl onarırsın?',['1 çıkar','1 ekle','2 ekle']);number(s,'fixed','Onarılan sağ tarafın değeri');}
 if(m==='precedence'){lines(s,`${c.a} + ${c.b} × ${c.c} − ${c.subtract}`);const ops=['Çarpma','Toplama','Çıkarma'];const row=E(s.ctrl,'div',null,'a5-actions');E(s.ctrl,'p','İşlem sırasını sırayla düğmelere dokunarak oluştur.','a5-muted');const trace=E(s.ctrl,'p','Henüz işlem seçilmedi.','a5-muted');ops.forEach((label,i)=>{const z=button(row,label,()=>{if(s.steps.length<3){s.steps.push(i);trace.textContent=s.steps.map(i=>ops[i]).join(' → ')}},'a5-btn');z.dataset.step=i;});button(row,'↶ Geri al',()=>{s.steps.pop();trace.textContent=s.steps.map(i=>ops[i]).join(' → ')||'Henüz işlem seçilmedi.'});number(s,'product','Önce çarpımın değeri');number(s,'result','İfadenin nihai değeri');}
 if(m==='brackets'){lines(s,'Parantezler sonuca nasıl etki ediyor?',`Hedef sayı: ${c.results[c.targetIndex]}`);select(s,'expr','Hedefe ulaşan işlemi seç',c.expressions);number(s,'result','Seçtiğin işlemin sonucu');}
 if(m==='powers'){lines(s,`Taban: ${c.base}`,`İstenen: bu sayının ${c.exponent===2?'karesi':'küpü'}`);select(s,'exp','Üs seç',[`${c.base}²`,`${c.base}³`]);number(s,'value','Üslü ifadenin değeri');}
 if(m==='storyFormula'){lines(s,`${c.packs} kutu var; her kutuda ${c.items} kalem var. Ayrıca ${c.extra} kalem daha bulundu.`);select(s,'formula','Toplam kalem sayısını gösteren işlem',[`${c.packs}×${c.items}+${c.extra}`,`${c.packs}+${c.items}×${c.extra}`,`${c.packs}×(${c.items}+${c.extra})`]);number(s,'value','Bütün kalemlerin sayısı');}
 if(m==='patternTable'){lines(s,`1. adım ${c.first}, 2. adım ${c.first+c.step}, 3. adım ${c.first+2*c.step}, 4. adım ${c.first+3*c.step}`);select(s,'step','Bir sonraki adımda kaç artıyor?',[`${c.step}`,`${c.step+1}`,`${c.step+2}`]);visualPattern(s);number(s,'near',`${c.near}. adımın değeri`);number(s,'far',`${c.far}. adımın değeri`);}
 if(m==='shapeGrow'){drawShapes(s,c.step,c.base);select(s,'step','Her adımda kaç kare ekleniyor?',[`${c.step}`,`${c.step+1}`,`${c.step+2}`]);number(s,'target',`${c.target}. adımdaki kare sayısı`);}
 if(m==='ruleMachine'){lines(s,`1→${c.samples[0]}`,`2→${c.samples[1]}`,`3→${c.samples[2]}`);number(s,'coeff','Adım sayısının kaç katı?');number(s,'offset','Üzerine kaç ekleniyor?');number(s,'far',`${c.far}. adımın değeri`);}
 if(m==='counterexample'){lines(s,`İlk adımlar: ${c.coeff+c.offset}, ${2*c.coeff+c.offset}, ${3*c.coeff+c.offset}`,`İddia: n. adım = ${c.coeff}×n+${c.claimedOffset}`);select(s,'claim','İddia bütün terimlerde doğru mu?',['Hayır, karşı örnek var','Evet, her zaman doğru']);number(s,'term',`${c.counterexample}. adımdaki gerçek terim`);number(s,'difference','İddianın bu adımda yaptığı hata (mutlak fark)');}
 if(m==='machineTrace'){lines(s,`Başlangıç: ${c.inp}`,`1. adım: ${c.plus} ekle`,`2. adım: ${c.mult} ile çarp`);visualMachine(s);number(s,'intermediate','1. adımın sonucu');number(s,'result','Makinenin çıktısı');}
 if(m==='flowOrder'){lines(s,`Makinenin girdi sayısı: ${c.inp}`);ordered(s,c.order,c.shuffled);number(s,'result','Doğru sıra izlendiğinde çıktı');}
 if(m==='loopTrace'){lines(s,`Başlangıç: ${c.start}`,`Robot kalan sayı ${c.unit} veya daha büyükken ${c.unit} çıkarıyor.`);s.remaining=c.start;s.count=0;const status=E(s.ctrl,'div',null,'a5-robot');const update=()=>{status.textContent=`Kalan: ${s.remaining} · Yapılan çıkarma: ${s.count}`};update();const z=button(s.ctrl,'− '+c.unit+' çıkar',()=>{if(s.remaining>=c.unit){s.remaining-=c.unit;s.count++;update()}},'a5-primary');z.dataset.action='subtract';number(s,'steps','Çıkarma sayısı');number(s,'remainder','Son kalan');}
 if(m==='bugFix'){lines(s,`Başla: ${c.inp}`,`1. adım: ${c.plus} ekle`, `Raporda bulunan ara sonuç: ${c.shown}`,`2. adım: ${c.mult} ile çarp`);select(s,'fault','Hata hangi aşamada?',['Toplama sonrası ara değer','Başlangıç sayısı','Çarpan seçimi']);number(s,'fixed','Doğru ara değer');number(s,'result','Düzeltilmiş nihai çıktı');}
}
function valid(s){const c=s.c,v=s.values,m=c.mode;const good=(key,answer)=>Number.isInteger(v[key])&&v[key]===answer;
 if(m==='balance')return v.both===0&&good('left',c.newValue)&&good('right',c.newValue);
 if(m==='tiles')return good('part1',c.rows*c.left)&&good('part2',c.rows*c.right)&&good('total',c.rows*(c.left+c.right));
 if(m==='regroup')return v.property===0&&good('pair',c.a*c.b)&&good('total',c.a*c.b*c.c);
 if(m==='repairEquality')return v.repair===0&&good('fixed',c.a+c.b);
 if(m==='precedence')return s.steps.join(',')==='0,1,2'&&good('product',c.b*c.c)&&good('result',c.a+c.b*c.c-c.subtract);
 if(m==='brackets')return v.expr===c.targetIndex&&good('result',c.results[c.targetIndex]);
 if(m==='powers')return v.exp===c.exponent-2&&good('value',c.base**c.exponent);
 if(m==='storyFormula')return v.formula===0&&good('value',c.packs*c.items+c.extra);
 if(m==='patternTable')return v.step===0&&good('near',c.first+(c.near-1)*c.step)&&good('far',c.first+(c.far-1)*c.step);
 if(m==='shapeGrow')return v.step===0&&good('target',c.base+c.step*c.target);
 if(m==='ruleMachine')return good('coeff',c.samples[1]-c.samples[0])&&good('offset',2*c.samples[0]-c.samples[1])&&good('far',(c.samples[1]-c.samples[0])*c.far+2*c.samples[0]-c.samples[1]);
 if(m==='counterexample')return v.claim===0&&good('term',c.coeff*c.counterexample+c.offset)&&good('difference',1);
 if(m==='machineTrace')return good('intermediate',c.inp+c.plus)&&good('result',(c.inp+c.plus)*c.mult);
 if(m==='flowOrder')return s.steps.join('|')===c.order.join('|')&&good('result',(c.inp+c.plus)*c.mult);
 if(m==='loopTrace')return s.count===c.times&&s.remaining===c.remainder&&good('steps',c.times)&&good('remainder',c.remainder);
 if(m==='bugFix')return v.fault===0&&good('fixed',c.inp+c.plus)&&good('result',(c.inp+c.plus)*c.mult);
 return false;
}
function render(task,onComplete){root.hidden=!Boolean(task.algebra5PlusLab);root.replaceChildren();if(!task.algebra5PlusLab){now=null;return;}const c=task.algebra5PlusLab;if(!modes.has(c.mode))throw Error('Unknown 5th grade algebra mode');
 const s={task,c,values:{},steps:[],remaining:0,count:0,reason:saved[task.id]||'',done:false,onComplete};now=s;root.dataset.taskId=task.id;root.dataset.mode=c.mode;
 E(root,'p','5. SINIF · CEBİRSEL DÜŞÜNME · DENE / KONTROL ET','a5-kicker');E(root,'h3',task.mekanik);E(root,'p',task.gorev,'a5-muted');s.view=E(root,'div',null,'a5-view');s.ctrl=E(root,'div',null,'a5-controls');formatCode(s);
 const label=E(root,'label',c.needReason?'Gerekçeni açıkla (en az 16 karakter; isteğe bağlı; otomatik puanlanmaz):':'Gerekçeni açıkla (isteğe bağlı; isteğe bağlı; otomatik puanlanmaz):','a5-reason');const txt=E(label,'textarea');txt.rows=2;txt.placeholder='Yaptığın işlemin neden doğru olduğunu kendi sözlerinle açıkla.';txt.value=s.reason;txt.addEventListener('input',()=>{s.reason=txt.value.slice(0,1500);saved[task.id]=s.reason;try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(_){}});
 s.status=E(root,'p','Hazır. Modeli oluştur ve iki sonucu kontrol et.','a5-status');s.status.setAttribute('aria-live','polite');s.status.setAttribute('role','status');
 const actions=E(root,'div',null,'a5-actions');const check=button(actions,'✓ Çözümü kontrol et',()=>{if(s.done)return;if(!valid(s)){s.status.textContent='🔎 Bir işlem, seçim veya gerekçe eksik / yanlış. Yeniden incele.';s.status.dataset.error='true';return;}s.done=true;s.status.dataset.error='false';s.status.textContent='✅ Matematiksel iki kontrol başarılı. Gerekçenin içeriği öğretmene bırakılmıştır.';onComplete()},'a5-primary');check.dataset.action='verify';button(actions,'💡 İpucu',()=>{s.status.textContent=task.ipucu});button(actions,'↻ Sıfırla',()=>render(task,onComplete));
 E(root,'p','İlerleme ve açıklamalar yalnız bu tarayıcıda saklanır. Gerekçeler otomatik doğru sayılmaz.','a5-muted');}
window.MatematikAtlasAlgebra5Plus={render,validateForTests:valid,getCurrentForTests:()=>now};
})();
