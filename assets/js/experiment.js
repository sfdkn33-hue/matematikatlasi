/* Matematik Atlası v1.3 · Deneysel olasılık laboratuvarı. Dış bağımlılık yok. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id), root=()=> $('experimentLab');
  let current=null;
  const h=(tag,text='',klass='')=>{const e=document.createElement(tag);if(text!==null)e.textContent=text;if(klass)e.className=klass;return e};
  function append(parent,tag,text='',klass=''){const e=h(tag,text,klass);parent.appendChild(e);return e}
  function msg(text,bad=false){const area=$('expStatus');if(area){area.textContent=(bad?'⚠️ ':'')+text;area.hidden=false}}
  function btn(parent,label,action,klass=''){const b=append(parent,'button',label,klass);b.type='button';b.addEventListener('click',action);return b}
  function numberInput(parent,label,init='',min=0,max=100){const wrap=append(parent,'div','','exp-card');const name=append(wrap,'label',label);const field=append(wrap,'input');field.type='number';field.min=String(min);field.max=String(max);field.step='any';field.value=init===null?'':String(init);name.appendChild(field);return field}
  function quantityPercent(hits,total){return total?Math.round(hits/total*1000)/10:0}
  function formatPercent(hits,total){return quantityPercent(hits,total).toLocaleString('tr-TR')+'%'}
  function setup(task,onFinish){
    const r=root();r.hidden=!task.expLab;if(!task.expLab){current=null;return null}
    const state={task,onFinish,attempts:0,results:{},choice:'',reason:'',labels:[],estimation:null};current=state;
    r.replaceChildren();
    append(r,'div','DENEME YAP · KAYDET · GEREKÇELENDİR','eyebrow');
    append(r,'h3',{'run':'Canlı Deney Simülatörü','table':'Sıklık Tablosu Fabrikası','compare':'Veri Karşılaştırma Dedektifi','design':'Kendi Olasılık Düzenini Kur'}[task.expLab.mode]);
    append(r,'p',({'run':'Önce tahmin et, sonra verilerle yüzdeyi hesapla.','table':'Gözlem listesini sıklık grafiğine dönüştür.','compare':'Deneylerin tekrar sayısının farklı olabileceğini unutma.','design':'İstenen oranı kur, tekrarla ve gözlemle.'})[task.expLab.mode],'exp-note');
    const scene=append(r,'div','','exp-scene');scene.id='expScene';
    const actions=append(r,'div','','exp-actions');actions.id='expActions';
    const status=append(r,'div','','exp-status');status.id='expStatus';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    const note=append(r,'p','Otomatik kontrol yalnızca sayıların ve modellerin doğruluğunu denetler. Yazılı gerekçelerin anlamını açıklama puanlanmaz.','exp-note');
    note.setAttribute('aria-label','Öğretmen notu');
    return state;
  }
  function render(task,onFinish){
    const st=setup(task,onFinish);if(!st)return;
    const type=task.expLab.mode;
    if(type==='run')setupRun(st);else if(type==='table')setupTable(st);else if(type==='compare')setupCompare(st);else if(type==='design')setupDesign(st);
  }
  function chart(area,counts,total){
    const grid=append(area,'div','','exp-grid');
    for(const [label,count] of Object.entries(counts)){
      const card=append(grid,'div','','exp-card');
      append(card,'div',label);
      append(card,'strong',String(count));
      const bar=append(card,'div','','exp-bar');
      const fill=append(bar,'span');fill.style.width=(total?count/total*100:0)+'%';
      append(card,'div',formatPercent(count,total),'exp-note');
    }
  }
  function roll(labels,weights){let r=Math.random()*weights.reduce((a,b)=>a+b,0);for(let i=0;i<labels.length;i++){r-=weights[i];if(r<0)return labels[i]}return labels.at(-1)}
  function addExplanation(parent,label='Çıkarımını kısaca açıkla:'){
    const w=append(parent,'div','','exp-card');const l=append(w,'label',label);const a=append(w,'textarea');a.placeholder='Deney tekrarları ve gözlenen sıklıklar hakkında düşünceni yaz...';a.rows=3;l.appendChild(a);return a;
  }
  function setupRun(st){const c=st.task.expLab, scene=$('expScene'), actions=$('expActions');
    const note=append(scene,'p',`İstenen çıktı: ${c.target}. Önce yüzde tahmini gir, sonra deney başlat.`,'exp-note');
    const predict=numberInput(scene,'Deney öncesi tahminim (%)','',0,100);predict.id='expPrediction';
    const guesses=append(scene,'div','','exp-grid');
    const count=numberInput(guesses,`Kaç kez ${c.target} gözlendi?`,'',0,99999);count.id='expCount';
    const percent=numberInput(guesses,'Göreli sıklık (%)','',0,100);percent.id='expPercent';
    const plot=append(scene,'div');plot.id='expPlot';
    let frozenPrediction=null;
    function update(){plot.replaceChildren();append(plot,'p',`Toplam ${st.attempts} deney. Tahmin: ${frozenPrediction??'—'}%.`,'exp-note');chart(plot,st.results,st.attempts)}
    for(const label of c.labels)st.results[label]=0;update();
    function simulate(n){if(frozenPrediction===null){if(predict.value.trim()===''||!Number.isFinite(Number(predict.value))||Number(predict.value)<0||Number(predict.value)>100){msg('Önce 0 ile 100 arasında bir tahmin belirt.',true);return}frozenPrediction=Number(predict.value);predict.disabled=true}
      for(let i=0;i<n;i++){const label=roll(c.labels,c.weights);st.results[label]++;st.attempts++}update();msg(`${st.attempts} deney yapıldı. Görülen sonuçları kullanarak göreli sıklığı hesapla.`)
    }
    btn(actions,'🎲 5 deney yap',()=>simulate(5),'alt').id='expRun5';btn(actions,'🎯 20 deney yap',()=>simulate(20),'alt').id='expRun20';
    btn(actions,'✓ Sonuçları kontrol et',()=>{
      if(st.attempts<c.minTrials){msg(`En az ${c.minTrials} deneme yapmalısın.`,true);return}
      const hits=st.results[c.target],expected=quantityPercent(hits,st.attempts);
      const actual=Number(percent.value.replace(',','.'));
      if(count.value.trim()===''||Number(count.value)!==hits||percent.value.trim()===''||Math.abs(actual-expected)>.11){msg('Deneme sayısı, istenen sonuç sayısı ve yüzde hesabını yeniden kontrol et.',true);return}
      msg(`✅ Doğru! ${hits}/${st.attempts} = ${formatPercent(hits,st.attempts)}. Tahmin ile deney sonucunun eşit olması gerekmez.`);st.onFinish();
    }).id='expCheck';
    btn(actions,'💡 İpucu',()=>msg(st.task.ipucu),'alt');
  }
  function setupTable(st){const c=st.task.expLab,scene=$('expScene'),actions=$('expActions');
    append(scene,'p',`Toplam ${c.sequence.length} gözlem. Her değeri sayıp + ve − düğmeleriyle sütun yüksekliğini ayarla.`,'exp-note');
    const obs=append(scene,'div','','exp-table');for(const t of c.sequence)append(obs,'span',t,'exp-chip');
    const counts=Object.fromEntries(c.labels.map(x=>[x,0]));
    const grid=append(scene,'div','','exp-grid');
    function draw(){grid.replaceChildren();for(const label of c.labels){const card=append(grid,'div','','exp-card');append(card,'b',label);append(card,'div',`${counts[label]} adet`);const bar=append(card,'div','','exp-bar');const fill=append(bar,'span');fill.style.width=(counts[label]/c.sequence.length*100)+'%';const acts=append(card,'div','','exp-controls');btn(acts,'−',()=>{counts[label]=Math.max(0,counts[label]-1);draw()},'alt');btn(acts,'+',()=>{counts[label]=Math.min(c.sequence.length,counts[label]+1);draw()},'alt')}}
    draw();
    btn(actions,'✓ Çeteleyi kontrol et',()=>{const correct=c.labels.every(l=>counts[l]===c.sequence.filter(t=>t===l).length);if(!correct){msg('Çetele sayılarını gözlemlerle tekrar karşılaştır.',true);return}msg('✅ Tüm sıklıklar doğru. Toplam gözlem sayısı ile grafiğin toplamı eşleşti.');st.onFinish()}).id='expCheck';
    btn(actions,'💡 İpucu',()=>msg(st.task.ipucu),'alt');
  }
  function setupCompare(st){const c=st.task.expLab,scene=$('expScene'),actions=$('expActions');
    const cards=append(scene,'div','','exp-grid');
    for(const [letter,hits,total] of [['A',c.aHits,c.aTotal],['B',c.bHits,c.bTotal]]){
      const card=append(cards,'div','','exp-card');append(card,'b',`Deney ${letter}`);append(card,'strong',`${hits} / ${total}`);append(card,'p',`İstenen sonuç: ${hits} · Deneme: ${total}`,'exp-note');
    }
    append(scene,'p','Olasılıkları gerçekleşme sayısıyla değil, göreli sıklıkla karşılaştır.','exp-note');
    const choose=append(scene,'div','','exp-controls');const buttons=[];
    for(const value of ['A','B','Eşit'])buttons.push(btn(choose,value,()=>{st.choice=value;for(const b of buttons)b.classList.toggle('selected',b.textContent===value)},'exp-option'));
    const reason=addExplanation(scene,'Seçimini göreli sıklıklarla gerekçelendir:');reason.id='expReason';
    btn(actions,'✓ Kararımı kontrol et',()=>{
      if(st.choice!==c.answer){msg('Önce her deneydeki istenen sonuç sayısını toplam denemeye böl.',true);return}
      
      msg(`✅ Model doğru. A: ${formatPercent(c.aHits,c.aTotal)}, B: ${formatPercent(c.bHits,c.bTotal)}. Yazılı gerekçeni puanlamaya dahil edilmez.`);st.onFinish();
    }).id='expCheck';
    btn(actions,'💡 İpucu',()=>msg(st.task.ipucu),'alt');
  }
  function setupDesign(st){const c=st.task.expLab,scene=$('expScene'),actions=$('expActions');
    const sliders=append(scene,'div','','exp-grid');const fields={};
    for(const [label,key,init] of [['🔴 Kırmızı top','red',2],['🔵 Mavi top','blue',2]]){
      const card=append(sliders,'div','','exp-card'),lbl=append(card,'label',label),input=append(card,'input');input.type='range';input.min='1';input.max='8';input.value=String(init);const count=append(card,'strong',String(init));input.addEventListener('input',()=>{count.textContent=input.value;update();st.attempts=0;st.results={}});lbl.append(input);fields[key]=input;
    }
    const chartBox=append(scene,'div');chartBox.id='expPlot';
    function update(){chartBox.replaceChildren();const r=Number(fields.red.value),b=Number(fields.blue.value);append(chartBox,'p',`Torba: ${r} kırmızı, ${b} mavi. Beklenen oran: ${r}/${r+b}.`,'exp-note');if(st.attempts){chart(chartBox,st.results,st.attempts);append(chartBox,'p',`Toplam ${st.attempts} deney · Kırmızı göreli sıklığı: ${formatPercent(st.results['Kırmızı'],st.attempts)}.`,'exp-note')}}update();
    const reason=addExplanation(scene,'Deney sonucu ile beklenen oranın neden farklı çıkabildiğini açıkla:');reason.id='expReason';
    btn(actions,'🎯 20 çekiliş simüle et',()=>{const r=Number(fields.red.value),b=Number(fields.blue.value);
      if(r*c.denominator!==c.redNumerator*(r+b)){msg('Önce torbanı hedef kesre uygun tasarla.',true);return}
      if(!Object.prototype.hasOwnProperty.call(st.results,'Kırmızı'))st.results={'Kırmızı':0,'Mavi':0};for(let i=0;i<20;i++){const x=roll(['Kırmızı','Mavi'],[r,b]);st.results[x]++;st.attempts++}update();msg(`${st.attempts} deney tamamlandı. Şimdi çıkarımını belirt.`);
    }).id='expRun20';
    btn(actions,'✓ Tasarımı kontrol et',()=>{const r=Number(fields.red.value),b=Number(fields.blue.value);
      if(r*c.denominator!==c.redNumerator*(r+b)){msg('Kırmızı sayısı / toplam top sayısı hedef kesre eşit değil.',true);return}
      if(st.attempts<c.minTrials){msg('En az 20 çekiliş yapman gerekiyor.',true);return}
      
      msg('✅ Torba oranı doğru kuruldu ve deney tamamlandı. Her deneyde gözlenen oran farklı olabilir.');st.onFinish();
    }).id='expCheck';
    btn(actions,'💡 İpucu',()=>msg(st.task.ipucu),'alt');
  }
  window.MatematikAtlasExperiment={render};
})();
