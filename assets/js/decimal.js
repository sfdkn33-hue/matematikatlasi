/* MATEMATİK ATLASI v1.4 — ondalık gösterimler ve kesir/bölme laboratuvarı. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
function elem(parent,tag,text,cls){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==null&&text!==undefined)e.textContent=String(text);parent.appendChild(e);return e;}
function button(parent,txt,fn,cls=''){const b=elem(parent,'button',txt,'dc-btn '+cls);b.type='button';b.addEventListener('click',fn);return b;}
function field(parent,label,type='number'){
 const wrap=elem(parent,'label',null,'dc-field');elem(wrap,'span',label);const input=elem(wrap,'input');input.type=type;if(type==='number')input.step='1';return input;
}
function decimal(mills){const raw=(mills/1000).toFixed(3);return raw.replace('.',',').replace(/0+$/,'').replace(/,$/,'')}
function rational(n,d){const whole=Math.floor(n/d);let rem=n%d,seen=new Map(),digits=[];
 while(rem&& !seen.has(rem)&&digits.length<45){seen.set(rem,digits.length);rem*=10;digits.push(String(Math.floor(rem/d)));rem%=d}
 const at=rem?seen.get(rem):-1;
 return {whole,digits,prefix:at===-1?digits.join(''):digits.slice(0,at).join(''),cycle:at===-1?'':digits.slice(at).join(''),finite:rem===0,display:whole+(digits.length?','+ (at===-1?digits.join(''):digits.slice(0,at).join('')+'('+digits.slice(at).join('')+')'):'')};
}
let active=null;
function notify(txt,bad=false){
 const x=$('dcStatus');if(x){x.textContent=txt;x.dataset.error=bad?'true':'false'}
 if(bad&&active&&active.mathTouched&&active.lastVerify&&active.mathReady()&&
    !/^(Bölme durdu|Bölme işlemi zaten|Kalan yolu tamamlandı|Henüz|Önce|Bir basamak ve yeni kalan|\d+ basamak için)/.test(txt)){
  window.Atlas620Trace?.wrong(active.task,'6. sınıf ondalık / kesir-bölme',active.focus(),$('dcControls'));
 }
 if(active)active.lastVerify=false;
}
function gcd(a,b){while(b){const r=a%b;a=b;b=r;}return a;}
function numberLine(stage,whole,tenths,hundredths){
 const v=elem(stage,'div',null,'dc-big-number');
 const boxes=elem(stage,'div',null,'dc-place-grid');
 const labels=['Birler','Onda birler','Yüzde birler'];
 [whole,tenths,hundredths].forEach((d,i)=>{const box=elem(boxes,'div',null,'dc-place-box');elem(box,'span',labels[i]);elem(box,'strong',d);});
 v.textContent=whole+','+tenths+hundredths;
 return v;
}
function selectNumber(parent,label,max){const box=elem(parent,'label',null,'dc-field');elem(box,'span',label);const s=elem(box,'select');s.className='dc-select';for(let i=0;i<=max;i++){const o=elem(s,'option',i);o.value=String(i)}return s;}
function classifyChoice(ctrl){return choiceButtons(ctrl,['Sonlu','Devirli']);}
function verdict(c){return rational(c.numerator,c.denominator).finite?'Sonlu':'Devirli';}
function scanDigit(c,stage,ctrl,actions,finish){numberLine(stage,c.whole,c.tenths,c.hundredths);
 elem(stage,'p','Büyüteci yüzde birler basamağına getir: rakamı seç ve doğrula.','dc-hint');let v=null;
 for(let i=0;i<=9;i++)button(ctrl,String(i),()=>{v=i;[...ctrl.querySelectorAll('button')].forEach(b=>b.classList.toggle('dc-picked',b.textContent===String(i)))},'dc-choice');
 button(actions,'✓ Basamak rakamını doğrula',()=>{if(v!==c.hundredths)return notify('Yüzde birler virgülden sonraki ikinci basamaktır. Seçimini gözden geçir.',true);finish('Yüzde birler rakamı '+v+' olarak bulundu.');});
}
function scanValue(c,stage,ctrl,actions,finish){numberLine(stage,c.whole,c.tenths,c.hundredths);
 elem(stage,'p','Her ilerleme 1/100 değerindedir. Yüzde birler basamağının değerini kaydırıcıyla seç.','dc-hint');
 const scale=elem(stage,'div',null,'dc-scale');const r=elem(ctrl,'input');r.type='range';r.min='0';r.max='9';r.step='1';r.value='0';r.setAttribute('aria-label','Yüzde birler basamak değeri, yüzde birlik cinsinden');
 const show=elem(scale,'strong','0,00','dc-result');const buttons=elem(ctrl,'div',null,'dc-moves');
 function update(){show.textContent='Seçimim: 0,'+String(r.value).padStart(2,'0');}r.addEventListener('input',update);
 button(buttons,'− 0,01',()=>{r.value=String(Math.max(0,Number(r.value)-1));update()},'dc-mini');button(buttons,'+ 0,01',()=>{r.value=String(Math.min(9,Number(r.value)+1));update()},'dc-mini');update();
 button(actions,'✓ Değeri doğrula',()=>{if(Number(r.value)!==c.hundredths)return notify('Rakamsal konum ile basamak değeri farklı kavramlardır; yüzde birliklere tekrar bak.',true);finish('Basamak değeri 0,'+String(c.hundredths).padStart(2,'0')+' olarak gösterildi.');});
}
function expandSlots(c,stage,ctrl,actions,finish){
 numberLine(stage,c.whole,c.tenths,c.hundredths);
 elem(stage,'p','Tam kısım, onda birler ve yüzde birler kartlarını eşleştir.','dc-hint');
 const sels=[selectNumber(ctrl,'Tam birler',9),selectNumber(ctrl,'Onda birler /10',9),selectNumber(ctrl,'Yüzde birler /100',9)];
 const out=elem(stage,'p','','dc-result');function update(){out.textContent=sels[0].value+' + '+sels[1].value+'/10 + '+sels[2].value+'/100'}sels.forEach(x=>x.addEventListener('change',update));update();
 button(actions,'✓ Kesir kartlarını doğrula',()=>{if(sels.some((el,i)=>Number(el.value)!==[c.whole,c.tenths,c.hundredths][i]))return notify('Ayrıştırmadaki basamak kartlarından biri yanlış. Her kartın paydasını kontrol et.',true);finish(out.textContent+' ayrıştırması doğru.');});
}
function paintHundredths(c,stage,ctrl,actions,finish){
 numberLine(stage,c.whole,c.tenths,c.hundredths);
 elem(stage,'p','Tam kısım hazır. Ondalık kısmı onluk satır ve tek kare kartlarıyla boyayarak kur.','dc-hint');
 const board=elem(stage,'div',null,'dc-hundred');board.setAttribute('role','img');const cells=Array.from({length:100},()=>elem(board,'span',null,'dc-cell'));
 const t=selectNumber(ctrl,'Onluk satır (10/100)',9),h=selectNumber(ctrl,'Tek kare (1/100)',9);const out=elem(stage,'div','','dc-result');
 function update(){const count=10*Number(t.value)+Number(h.value);cells.forEach((el,i)=>el.classList.toggle('dc-painted',i<count));out.textContent=c.whole+' tam + '+count+'/100 = '+c.whole+','+String(count).padStart(2,'0');board.setAttribute('aria-label',count+' yüzlük kare boyalı');}
 [t,h].forEach(x=>x.addEventListener('change',update));update();
 button(actions,'✓ Desenimi doğrula',()=>{if(10*Number(t.value)+Number(h.value)!==10*c.tenths+c.hundredths)return notify('Boyalı alanın yüzde birlik değerini yeniden say. Bir satır 10 karedir.',true);finish('100 karelik model doğru tamamlandı.');});
}
function divideSteps(c,stage,ctrl,actions,finish){
 elem(stage,'div',c.numerator+' ÷ '+c.denominator,'dc-division');
 elem(stage,'p','Her turda kalanı 10 ile çarp; bölüm rakamını ve yeni kalanı hesapla.','dc-hint');
 let rem=c.numerator,steps=0,repeat=false,seen=new Set([rem]);const log=elem(stage,'ol',null,'dc-log');
 const digit=selectNumber(ctrl,'Sıradaki bölüm rakamı',9);const remainder=field(ctrl,'Yeni kalan (doğal sayı)');remainder.min='0';remainder.max=String(c.denominator-1);
 const pick=classifyChoice(ctrl);
 button(actions,'➜ Bölme adımı',()=>{
  if(rem===0||repeat)return notify('Bölme durdu. Şimdi gösterimin türünü seçip doğrula.',true);
  const q=Math.floor(rem*10/c.denominator),r=rem*10%c.denominator;
  if(Number(digit.value)!==q||remainder.value.trim()===''||Number(remainder.value)!==r)return notify('Yeni kalan = (eski kalan × 10) − (bulunan rakam × payda). Hesabını düzelt.',true);
  elem(log,'li',`${rem} × 10 = ${q} × ${c.denominator} + ${r}`);rem=r;steps++;
  repeat=r!==0&&seen.has(r);seen.add(r);remainder.value='';
  notify(rem===0?'Kalan sıfıra ulaştı.':repeat?'Önceki bir kalan tekrar etti.':'Yeni kalan: '+rem+'; bölmeye devam et.');
 });
 button(actions,'✓ Gösterimin türünü doğrula',()=>{if(steps===0||(!repeat&&rem!==0))return notify('Önce bölme adımlarını tamamlamalısın. Kalan sıfır olmalı veya tekrarlanmalı.',true);if(pick()!==verdict(c))return notify('Kalan sıfır olduysa sonlu; bir kalan tekrar ediyorsa devirli olur.',true);finish(steps+' bölme adımıyla '+verdict(c).toLocaleLowerCase('tr-TR')+' gösterime ulaşıldı.');});
}
function denominatorKeys(c,stage,ctrl,actions,finish){
 elem(stage,'div',c.numerator+'/'+c.denominator,'dc-division');const g=gcd(c.numerator,c.denominator),den=c.denominator/g;
 elem(stage,'p','Kesri sadeleştir, yeni paydadaki asal çarpanları belirle; sonra gösterimin türünü seç.','dc-hint');
 const reduced=field(ctrl,'Sadeleştirilmiş payda');reduced.min='1';
 const fs=[2,3,5,7,11,13,17,19];let picked=new Set();const chips=elem(ctrl,'div',null,'dc-moves');
 for(const prime of fs){const b=button(chips,String(prime),()=>{if(picked.has(prime))picked.delete(prime);else picked.add(prime);b.classList.toggle('dc-picked',picked.has(prime));b.setAttribute('aria-pressed',String(picked.has(prime)))},'dc-mini');b.setAttribute('aria-pressed','false')}
 const kind=classifyChoice(ctrl);
 button(actions,'✓ Payda anahtarını doğrula',()=>{let d=den,expected=[];for(let p=2;p<=d;p++)if(d%p===0){expected.push(p);while(d%p===0)d/=p;}
 if(Number(reduced.value)!==den||expected.join(',')!==[...picked].sort((a,b)=>a-b).join(','))return notify('Önce kesri sadeleştirip sadeleşmiş paydanın asal çarpanlarını seç.',true);
 if(kind()!==verdict(c))return notify('Sadeleşmiş paydada 2 ve 5 dışındaki asal çarpanlara dikkat et.',true);finish('Sadeleşmiş paydanın asal çarpanlarıyla doğru sınıflandırdın.');});
}
function decimalDigits(c,stage,ctrl,actions,finish){
 elem(stage,'div',c.numerator+' / '+c.denominator,'dc-division');elem(stage,'p','Kesri böl: virgülden sonraki ilk iki rakamı hesapla. Gerekiyorsa sonlu bölümün ardına sıfır eklenebilir.','dc-hint');
 const a=selectNumber(ctrl,'1. ondalık basamak',9),b=selectNumber(ctrl,'2. ondalık basamak',9),kind=classifyChoice(ctrl);const display=elem(stage,'div','','dc-result');
 function show(){display.textContent='0,'+a.value+b.value;}[a,b].forEach(x=>x.addEventListener('change',show));show();
 button(actions,'✓ Ondalık şifreyi doğrula',()=>{const r1=c.numerator*10;const d1=Math.floor(r1/c.denominator),rem=r1%c.denominator,d2=Math.floor(rem*10/c.denominator);
 if(Number(a.value)!==d1||Number(b.value)!==d2)return notify('Her rakamda kalan × 10 kuralını uygula. İlk iki rakamdan biri yanlış.',true);
 if(kind()!==verdict(c))return notify('İlk iki rakam her zaman gösterimin sonlu olduğunu kanıtlamaz; kalanları düşün.',true);finish('İki ondalık basamak ve gösterim türü doğru.');});
}
function remainderTrail(c,stage,ctrl,actions,finish){
 elem(stage,'div',c.numerator+' / '+c.denominator,'dc-division');elem(stage,'p','Kalanları takip et. Her doğru seçimde kalan yolu bir adım uzar; sıfır veya tekrar gördüğünde türünü belirle.','dc-hint');
 let rem=c.numerator,repeat=false,seen=new Set([rem]),steps=0,selected=null;const log=elem(stage,'ol',null,'dc-log');
 const choices=elem(ctrl,'div',null,'dc-moves');const type=classifyChoice(ctrl);
 function options(){choices.replaceChildren();if(rem===0||repeat){elem(choices,'strong','Kalan yolu tamamlandı.');return}
  const correct=(rem*10)%c.denominator;
  const opts=[correct,(correct+1)%c.denominator,(correct+2)%c.denominator];
  opts.sort((a,b)=>((a*7+3)%11)-((b*7+3)%11));selected=null;
  for(const val of opts){const b=button(choices,String(val),()=>{selected=val;[...choices.querySelectorAll('button')].forEach(x=>x.classList.toggle('dc-picked',x===b))},'dc-choice');b.setAttribute('aria-label','Sıradaki kalan '+val)}
 }
 options();
 button(actions,'➜ Kalanı kaydet',()=>{if(rem===0||repeat)return notify('Kalan yolu tamamlandı. Gösterim türünü doğrula.',true);
 const correct=rem*10%c.denominator;if(selected!==correct)return notify('Yanlış kalan. Eski kalanı 10 ile çarp, paydaya bölümden kalanı bul.',true);
 elem(log,'li',rem+' × 10 işleminin '+c.denominator+' ile bölümünden kalan '+correct);rem=correct;steps++;
 repeat=rem!==0&&seen.has(rem);seen.add(rem);options();notify(rem===0?'Kalan 0 oldu.':repeat?'Bir kalan tekrar etti.':'Sıradaki kalanı bul.');});
 button(actions,'✓ Kalan yolunu tamamla',()=>{if(steps===0||(!repeat&&rem!==0))return notify('Kalanı sıfıra veya bir tekrar noktasına kadar izle.',true);
 if(type()!==verdict(c))return notify('Sonlu–devirli sonucunu kalan yoluna göre tekrar değerlendir.',true);
 finish('Kalanlar doğru izlendi ve gösterim türü belirlendi.');});
}
function render(task,done){const root=$('decimalLab');root.hidden=!task.decimalLab;if(!task.decimalLab){active=null;root.replaceChildren();return}
 let st={task,finished:false,mathTouched:false,lastVerify:false,mathReady:()=>false,focus:()=> 'decimal'};active=st;root.replaceChildren();
 elem(root,'div','6. SINIF · MODEL KUR · KONTROL ET · GEREKÇELENDİR','dc-kicker');
 const names={grid:'Yüzlük Alan Ressamı',place:'Basamak Kilidi',line:'Ondalık Haritacı',compare:'Ondalık Terazi',divide:'Uzun Bölme Makinesi',cycle:'Devirli Örüntü Dedektifi',denominator:'Payda Dedektifi',match:'Ondalık Kart Eşleştirme'};
 elem(root,'h3',names[task.decimalLab.mode]);
 const stage=elem(root,'div',null,'dc-stage');stage.id='dcStage';
 const controls=elem(root,'div',null,'dc-controls');controls.id='dcControls';
 const actions=elem(root,'div',null,'dc-actions');actions.id='dcActions';
 const status=elem(root,'div','Çözümünü oluştur ve kontrol et.','dc-status');status.id='dcStatus';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 elem(root,'p','Otomatik denetim modeli ve sayısal sonucu kontrol eder. Yazılı matematiksel gerekçeleri sistem puanlamaz.','dc-teacher-note');
 const c=task.decimalLab;
 st.mathReady=()=>{
   if(!st.mathTouched)return false;
   const inputs=[...controls.querySelectorAll('input:not([type=range])')].filter(i=>i!==reason&&i.type!=='hidden');
   if(inputs.some(i=>i.type!=='text' && !i.value.trim()))return false;
   if(inputs.some(i=>i.type==='number'&&!i.value.trim()))return false;
   // A classification choice must be a deliberate pupil choice, not an untouched default.
   const options=[...controls.querySelectorAll('.dc-choice')];
   if(options.length&&!options.some(b=>b.classList.contains('dc-picked')))return false;
   return true;
 };
 const choiceModes=new Set(['cycle','denominator','match','denominatorKeys','decimalDigits','remainderTrail']);
 st.focus=()=>['denominator','cycle','match','denominatorKeys'].includes(c.mode)?'classification':(['divide','divideSteps','remainderTrail'].includes(c.mode)?'remainder':'placeValue');
 controls.addEventListener('input',e=>{if(e.target!==reason&&e.target.matches('input,select'))st.mathTouched=true});
 controls.addEventListener('change',e=>{if(e.target!==reason&&e.target.matches('input,select'))st.mathTouched=true});
 controls.addEventListener('click',e=>{if(e.target.closest('button'))st.mathTouched=true});
 actions.addEventListener('click',e=>{const b=e.target.closest('button');st.lastVerify=!!b&&!b.textContent.includes('İpucu')});
 let reason=null;
 if(c.requireReason){reason=field(controls,'Matematiksel gerekçen (isteğe bağlı nottur)','text');reason.placeholder='Basamak, kesir veya kalan ilişkisini bir cümleyle açıkla.';}
 function finish(txt){if(st.finished)return;
 st.finished=true;notify('✅ '+txt);if(reason){try{const key='mathAtlasDecimalNotes',notes=JSON.parse(localStorage.getItem(key)||'{}');notes[task.id]=reason.value.trim();localStorage.setItem(key,JSON.stringify(notes))}catch(e){}}done();}
 switch(c.mode){case 'grid':grid(c,stage,controls,actions,finish);break;case 'place':place(c,stage,controls,actions,finish);break;case 'line':line(c,stage,controls,actions,finish);break;case 'compare':compare(c,stage,controls,actions,finish);break;case 'divide':divide(c,stage,controls,actions,finish);break;case 'cycle':cycle(c,stage,controls,actions,finish);break;case 'denominator':denominator(c,stage,controls,actions,finish);break;case 'match':match(c,stage,controls,actions,finish);break;case 'scanDigit':scanDigit(c,stage,controls,actions,finish);break;case 'scanValue':scanValue(c,stage,controls,actions,finish);break;case 'expandSlots':expandSlots(c,stage,controls,actions,finish);break;case 'paintHundredths':paintHundredths(c,stage,controls,actions,finish);break;case 'divideSteps':divideSteps(c,stage,controls,actions,finish);break;case 'denominatorKeys':denominatorKeys(c,stage,controls,actions,finish);break;case 'decimalDigits':decimalDigits(c,stage,controls,actions,finish);break;case 'remainderTrail':remainderTrail(c,stage,controls,actions,finish);break;default:notify('Bilinmeyen laboratuvar modu: '+c.mode,true);}
 button(actions,'💡 İpucu',()=>notify(task.ipucu),'dc-alt');
}
function grid(c,stage,ctrl,actions,finish){let tenths=0,ones=0;const target=c.hundredths;
 elem(stage,'p','Bir dolu sütun 10/100, tek kare 1/100 gösterir. Onlukları ve tek hücreleri kullan.','dc-hint');
 const board=elem(stage,'div',null,'dc-hundred');board.setAttribute('role','img');
 const cards=[];for(let i=0;i<100;i++)cards.push(elem(board,'span',null,'dc-cell'));
 const panels=elem(ctrl,'div',null,'dc-two');
 function stepper(lbl,min,max,get,set){const p=elem(panels,'div',null,'dc-panel');elem(p,'b',lbl);const r=elem(p,'div',null,'dc-stepper');button(r,'−',()=>{set(Math.max(min,get()-1));update()},'dc-mini');const n=elem(r,'strong','0');button(r,'+',()=>{set(Math.min(max,get()+1));update()},'dc-mini');return n}
 const on=stepper('Onluk sütun',0,9,()=>tenths,x=>tenths=x),un=stepper('Tek kare',0,9,()=>ones,x=>ones=x);
 function update(){const total=tenths*10+ones;on.textContent=tenths;un.textContent=ones;cards.forEach((el,i)=>el.classList.toggle('dc-painted',i<total));board.setAttribute('aria-label',`100 kareden ${total} tanesi boyalı`);counter.textContent=`${tenths} × 1/10 + ${ones} × 1/100 = ${decimal(total*10)}`}
 const counter=elem(stage,'p','','dc-result');update();
 button(actions,'✓ Alan modelimi doğrula',()=>{if(tenths*10+ones!==target)return notify('Boyadığın kare sayısı hedef ondalık sayıya eşit değil. Onlukları ve yüzdelikleri yeniden incele.',true);finish(`${tenths}/10 + ${ones}/100 = ${decimal(target*10)}. Alan modeli doğru.`)});
}
function place(c,stage,ctrl,actions,finish){let v=c.mills;const names=['Birlik','Onda bir','Yüzde bir','Binde bir'];const digits=String(v).padStart(4,'0').split('').map(Number);
 const view=elem(stage,'div','0,000','dc-big-number');const wrap=elem(ctrl,'div',null,'dc-digits');const inputs=[];
 names.forEach((name,i)=>{const p=elem(wrap,'label',null,'dc-digit');elem(p,'span',name);const sel=elem(p,'select');for(let d=0;d<=9;d++){const op=elem(sel,'option',String(d));op.value=String(d)}sel.value='0';inputs.push(sel);sel.addEventListener('change',update)});
 function update(){const vals=inputs.map(x=>Number(x.value));view.textContent=vals[0]+','+vals.slice(1).join('');breakdown.textContent=vals.map((v,i)=>v?`${v}/${Math.pow(10,i)}`:null).filter(Boolean).join(' + ')||'0'}
 const breakdown=elem(stage,'p','','dc-result');update();
 button(actions,'✓ Basamakları doğrula',()=>{const vals=inputs.map(x=>Number(x.value));if(vals.some((x,i)=>x!==digits[i]))return notify('Basamak kartlarını hedef sayıya göre yeniden düzenle.',true);finish('Birlik ve kesir basamaklarının hepsi doğru yerleştirildi.')});
}
function line(c,stage,ctrl,actions,finish){let val=0;elem(stage,'p','Sayı doğrusunda noktanın yerini değiştir. Ara düğmeleriyle hassas hareket edebilirsin.','dc-hint');
 const marks=elem(stage,'div',null,'dc-line');const track=elem(marks,'div',null,'dc-line-track');for(let n=0;n<=10;n++){const tick=elem(track,'span',null,'dc-tick');tick.style.left=(n*10)+'%'}
 const marker=elem(track,'div',null,'dc-dot');marker.setAttribute('role','img');marker.setAttribute('aria-label','Sayı doğrusu işaretçisi');
 const ticks=elem(stage,'div',null,'dc-line-labels');for(const x of ['0','0,25','0,5','0,75','1'])elem(ticks,'span',x);
 const range=elem(ctrl,'input');range.type='range';range.min='0';range.max='1000';range.step='5';range.value='0';range.setAttribute('aria-label','Sayı doğrusu üzerinde noktanın binde birlik cinsinden konumu');
 const value=elem(stage,'p','','dc-result');function update(x){val=Math.min(1000,Math.max(0,x));range.value=String(val);marker.style.left=(val/10)+'%';value.textContent='Seçilen nokta: '+decimal(val)}
 range.addEventListener('input',()=>update(Number(range.value)));
 const bar=elem(ctrl,'div',null,'dc-moves');for(const n of [-100,-25,-5,5,25,100])button(bar,(n>0?'+':'')+n+' binde',()=>update(val+n),'dc-mini');update(0);
 button(actions,'✓ Noktayı doğrula',()=>{if(val!==c.mills)return notify(`Nokta ${decimal(val)} konumunda. Hedef ${decimal(c.mills)}. Sayı doğrusunda yeniden ilerle.`,true);finish(`Nokta ${decimal(val)} konumunda doğru işaretlendi.`)});
}
function choiceButtons(ctrl,options,fn){let selected='';const buttons=[];for(const item of options){const b=button(ctrl,item,()=>{selected=item;buttons.forEach(x=>{x.classList.toggle('dc-picked',x===b);x.setAttribute('aria-pressed',String(x===b))});fn?.(item)},'dc-choice');b.setAttribute('aria-pressed','false');buttons.push(b)}return ()=>selected}
function compare(c,stage,ctrl,actions,finish){const view=elem(stage,'div',null,'dc-two');elem(view,'div','A = '+decimal(c.a),'dc-panel dc-value');elem(view,'div','B = '+decimal(c.b),'dc-panel dc-value');elem(stage,'p','A ile B arasındaki matematiksel ilişkiyi işaretle.','dc-hint');
 const answer=choiceButtons(ctrl,['<','=','>']);
 button(actions,'✓ İşareti doğrula',()=>{if(answer()!==c.correct)return notify('Basamakları eşit uzunlukta düşün. Sona eklenen sıfırlar değeri değiştirmez.',true);finish('Karşılaştırma işareti doğru. Ondalık gösterimlerin değerleri karşılaştırıldı.')});
}
function divide(c,stage,ctrl,actions,finish){let rem=c.numerator,seq=[],steps=0;
 elem(stage,'p',`${c.numerator} ÷ ${c.denominator} işlemini adım adım ilerlet. Her turda kalan × 10 ile devam edilir.`,'dc-hint');
 const screen=elem(stage,'div','','dc-division');const log=elem(stage,'ol',null,'dc-log');const dInput=field(ctrl,'Sıradaki ondalık basamak');dInput.min='0';dInput.max='9';dInput.placeholder='0–9';const rInput=field(ctrl,'Yeni kalan');rInput.min='0';rInput.max=String(c.denominator-1);
 function update(){screen.textContent=`${c.numerator}/${c.denominator} = 0,${seq.join('')||'…'} · Şimdiki kalan: ${rem}`;dInput.value='';rInput.value=''}update();
 button(actions,'➜ Bir basamak ilerlet',()=>{
  if(rem===0)return notify('Bölme işlemi zaten sonlu olarak tamamlandı.',true);
  if(!/^\d$/.test(dInput.value.trim())||!/^\d+$/.test(rInput.value.trim()))return notify('Bir basamak ve yeni kalan için doğal sayı yazmalısın.',true);
  const expectedDigit=Math.floor(rem*10/c.denominator),expectedRem=rem*10%c.denominator;
  if(Number(dInput.value)!==expectedDigit||Number(rInput.value)!==expectedRem)return notify(`Şimdiki kalan ${rem}; 10 ile çarpıp ${c.denominator} sayısına böl. Hem bölüm basamağını hem yeni kalanı kontrol et.`,true);
  const prev=rem;rem=expectedRem;seq.push(expectedDigit);steps++;
  elem(log,'li',`${prev} × 10 = ${prev*10}; bölüm basamağı ${expectedDigit}, kalan ${rem}.`);
  update();notify(`${steps}. basamak doğru. ${rem===0?'Bölme işlemi sonlandı.':'Sıradaki kalanı incele.'}`);
 });
 button(actions,'✓ Bölmeyi tamamla',()=>{if(steps<Math.min(c.steps,rem===0?steps:c.steps)||steps===0){return notify(`Henüz yeterli bölme adımını tamamlamadın. ${c.steps} basamak veya sonlu sona ulaşma hedefi.`,true)}
  if(rem!==0&&steps<c.steps)return notify(`${c.steps} basamak için işlem yap.`,true);
  finish(`Payı paydaya bölerek ${steps} ondalık basamağı kendin ürettin.`)});
}
function cycle(c,stage,ctrl,actions,finish){const r=rational(c.numerator,c.denominator),digits=r.finite?r.digits.join(''):Array.from({length:12},(_,i)=>r.digits[r.cycle?(i<r.prefix.length?i:r.prefix.length+(i-r.prefix.length)%r.cycle.length):i]||'0').join('');
 elem(stage,'p',`${c.numerator} ÷ ${c.denominator} bölmesinde görülen ondalık basamaklar:`, 'dc-hint');elem(stage,'div','0,'+digits+(r.finite?'':'…'),'dc-division');
 const steps=elem(stage,'div',null,'dc-mini-rows');elem(steps,'p',r.finite?'Bir noktada kalan sıfır oluyor.':'Kalanlardan biri yeniden görüldüğünde sonraki basamaklar tekrar ediyor.','dc-hint');
 const chosen=choiceButtons(ctrl,['Sonlu','Devirli']);const cycleInput=field(ctrl,'Tekrar eden rakam grubu (sonluysa boş bırak)','text');cycleInput.placeholder='Örnek: 3 veya 142857';
 button(actions,'✓ Örüntüyü doğrula',()=>{if(chosen()!==(r.finite?'Sonlu':'Devirli'))return notify('Bölmenin sonunda kalan sıfır oluyor mu? Aynı kalan yeniden geliyor mu?',true);
 if(!r.finite&&cycleInput.value.trim()!==r.cycle)return notify('Tekrar eden en küçük rakam grubunu bul. Noktalama veya parantez yazma.',true);
 if(r.finite&&cycleInput.value.trim())return notify('Sonlu ondalık gösterimde tekrar eden grup yazmamalısın.',true);
 finish(`${c.numerator}/${c.denominator} = ${r.display} olarak gösterilir.`)});
}
function denominator(c,stage,ctrl,actions,finish){const r=rational(c.numerator,c.denominator);const g=(a,b)=>b?g(b,a%b):a,div=g(c.numerator,c.denominator),den=c.denominator/div;
 elem(stage,'div',`${c.numerator}/${c.denominator} = ${c.numerator/div}/${den}`,'dc-division');elem(stage,'p','Sadeleştirilmiş paydanın asal çarpanlarını düşün.','dc-hint');const chosen=choiceButtons(ctrl,['Sonlu','Devirli']);
 const explanation=field(ctrl,'Kısa gerekçen','text');explanation.placeholder='Örnek: Payda 2 ve 5 çarpanlarından oluşuyor.';
 button(actions,'✓ Tahminimi sınama',()=>{if(chosen()!==(r.finite?'Sonlu':'Devirli'))return notify('Sadeleşmiş paydada 2 ve 5 dışında asal çarpan var mı?',true);
 
 finish('Payda modeline dayalı tahminin doğru. Gerekçenin içeriğini puanlamaya dahil edilmez.')});
}
function match(c,stage,ctrl,actions,finish){const view=elem(stage,'div',`${c.numerator}/${c.denominator} = ?`,'dc-division');
 elem(stage,'p','Parantez içine alınmış rakamlar devirli bölümün tekrar eden kısmıdır.','dc-hint');const selected=choiceButtons(ctrl,c.choices);
 button(actions,'✓ Kartı doğrula',()=>{if(selected()!==c.correct)return notify('Kesri bölme ile çözümle ve parantez içindeki tekrarlı bölüme dikkat et.',true);finish(`${c.numerator}/${c.denominator} = ${c.correct} eşleştirmesi doğru.`)});
}
window.MatematikAtlasDecimal={render,rational,decimal};
})();
