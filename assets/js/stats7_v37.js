/* Matematik Atlası v3.7 - Statistically grounded interactive lab, grade 7. */
(()=>{'use strict';
const byId=id=>document.getElementById(id),outer=byId('atlas7Stats'),stage=byId('atlasStatsStage'),noteBox=byId('atlasStatsNote');
if(!outer||!window.ATLAS_DB)return;
const bank=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas7Stats).map(t=>[t.id,t]));
let active=null,s={};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>Number(x).toLocaleString('tr-TR',{maximumFractionDigits:3});
function parse(v){const z=String(v??'').trim().replace(/\s/g,'').replace(',','.');return /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(z)?Number(z):NaN}
const equal=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<1e-6;
function note(s,tone=''){noteBox.textContent=s;noteBox.className='stats-note '+tone}
function buttons(name,labels){return `<div class="stats-options" role="group" aria-label="${esc(name)}">`+labels.map((z,i)=>`<button type="button" data-group="${esc(name)}" data-pick="${i}" aria-pressed="false">${esc(z)}</button>`).join('')+'</div>'}
function field(id,label){return `<label class="stats-field">${esc(label)}<input type="text" inputmode="decimal" id="${esc(id)}" autocomplete="off" placeholder="Sonuç"></label>`}
function chips(values){return '<div class="stats-chips" aria-label="Örnek veri kümesi">'+values.map(v=>'<span>'+esc(v)+'</span>').join('')+'</div>'}
function barSVG(labels,values,baseline=0){const mx=Math.max(...values,baseline+1),maxHeight=152,W=300;let h='<svg class="stats-chart" viewBox="0 0 360 235" role="img" aria-label="Sıklık grafiği; eksen başlangıcı '+baseline+'">';h+='<line x1="40" y1="188" x2="336" y2="188" stroke="#557a91" stroke-width="2"/><line x1="40" y1="26" x2="40" y2="188" stroke="#557a91" stroke-width="2"/>';h+='<text x="30" y="190" text-anchor="end" font-size="12" fill="#52768d">'+baseline+'</text>';
values.forEach((v,i)=>{const H=Math.max(1,maxHeight*(v-baseline)/(mx-baseline)),x=70+i*90;h+=`<rect x="${x}" y="${188-H}" width="58" height="${H}" fill="${['#2e98c8','#65bca9','#ddb674'][i%3]}" rx="4"/><text x="${x+29}" y="${178-H}" text-anchor="middle" font-size="15" font-weight="800" fill="#1f536f">${fmt(v)}</text><text x="${x+29}" y="208" text-anchor="middle" font-size="13" fill="#224e65">${esc(labels[i])}</text>`});return h+'</svg>'}
function lineSVG(values,labels){const pad=42,top=18,height=150,MAX=10;let h='<svg class="stats-chart" viewBox="0 0 360 220" role="img" aria-label="Oluşturulan ölçüm grafiği">';for(let y=0;y<=10;y+=2){const cy=top+height*(1-y/MAX);h+=`<line x1="${pad}" y1="${cy}" x2="340" y2="${cy}" stroke="#e0ecf3"/><text x="35" y="${cy+4}" text-anchor="end" fill="#53788e" font-size="11">${y}</text>`}
const pts=values.map((v,i)=>[65+i*87,top+height*(1-v/MAX)]);h+='<polyline fill="none" stroke="#247dab" stroke-width="3" points="'+pts.map(p=>p.join(',')).join(' ')+'"/>';pts.forEach((p,i)=>{h+=`<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="#22a58d" stroke="white" stroke-width="2"/><text x="${p[0]}" y="190" text-anchor="middle" fill="#2e5e78" font-size="11">${esc(labels[i])}</text>`});return h+'</svg>'}
function restorePick(){stage.querySelectorAll('[data-group]').forEach(b=>{const yes=s[b.dataset.group]===Number(b.dataset.pick);b.setAttribute('aria-pressed',String(yes))})}
function render(task,prev){active=task;const c=task?.atlas7Stats;outer.hidden=!c;if(!c){stage.replaceChildren();return}
 s=prev||{question:-1,sample:-1,counts:c.labels?.map(()=>0)||[],values:c.values?.map(()=>0)||[],answers:[],type:-1,group:-1,reason:-1,check:-1,evidence:'',difference:'',range_difference:''};
 byId('atlasStatsMode').textContent={'plan':'Araştırma Sorusu','tally':'Veriyi Say','trend':'Çizgi Grafiği Kur','summary':'Dağılımı Çözümle','axis':'Yanıltıcı Grafik','sample':'Örneklem Eleştirisi','claim':'İddia Kontrolü','spread':'Yayılım Karşılaştır'}[c.kind];
 let html='<p class="stats-tip">🔎 Bu oyundaki veriler eğitim amacıyla oluşturulmuş örneklerdir. Gerçek öğrencilerin kişisel bilgileri kullanılmaz.</p>';
 switch(c.kind){
 case 'plan':html+='<h3>1. Hangi araştırma sorusu uygun?</h3>'+buttons('question',c.question_options)+'<h3>2. Hangi örneklem daha temsil edici?</h3>'+buttons('sample',c.sample_options);break;
 case 'tally':html+='<h3>Kimliksiz yanıt kartları</h3>'+chips(c.data)+'<h3>Sıklık tablosunu oluştur</h3><div class="stats-tally">'+c.labels.map((v,i)=>`<div class="stats-tally-row"><strong>${esc(v)}</strong><button type="button" data-counter="${i}" data-delta="-1" aria-label="${esc(v)} azalt">−</button><output id="statsCount${i}">${s.counts[i]}</output><button type="button" data-counter="${i}" data-delta="1" aria-label="${esc(v)} artır">+</button><div class="stats-meter"><i id="statsMeter${i}"></i></div></div>`).join('')+'</div><div id="statsPlot"></div>';break;
 case 'trend':html+='<h3>Ölçüm tablosu</h3><div class="stats-measures">'+c.values.map((v,i)=>`<div><span>${esc(c.labels[i])}</span><strong>${fmt(v)}</strong></div>`).join('')+'</div><div id="statsPlot"></div><h3>Grafikteki noktaları ayarla</h3>'+c.values.map((v,i)=>`<label class="stats-slider-row">${esc(c.labels[i])}<input type="range" min="0" max="10" step="0.5" data-slider="${i}" value="${s.values[i]}"><output id="statsValue${i}">${fmt(s.values[i])}</output></label>`).join('');break;
 case 'summary':html+='<h3>Ölçüm kartları</h3>'+chips(c.values.map(fmt))+'<div class="stats-fields">'+c.labels.map((v,i)=>field('statsField'+i,v)).join('')+'</div>';break;
 case 'axis':html+='<h3>Raporun sütun grafiği</h3>'+barSVG(c.labels,c.values,c.baseline)+'<p class="stats-tip">Grafik ekseni <b>'+fmt(c.baseline)+'</b> değerinden başlıyor. Sütun uzunlukları üzerinden iki gerçek değerin oranını karşılaştırmak uygun mu?</p>'+buttons('type',['Uygun, sıfırdan başlıyor','Yanıltıcı olabilir, sıfırdan başlamıyor'])+field('statsDifference','B ile A arasındaki gerçek fark');break;
 case 'sample':html+='<h3>Temsil gücü yüksek örneklemi seç</h3>'+buttons('group',c.options)+'<h3>Gerekçeyi seç</h3>'+buttons('reason',c.why_options);break;
 case 'claim':html+='<h3>Veri raporu</h3>'+barSVG(c.labels,c.counts)+'<blockquote class="stats-claim">'+esc(c.claim)+'</blockquote>'+buttons('check',['İddia destekleniyor','İddia desteklenmiyor'])+field('statsEvidence','Kanıt: ilk kategorinin sıklığı');break;
 case 'spread':html+='<h3>İki grubun ölçümleri</h3>'+c.series.map((arr,i)=>`<div class="stats-series"><strong>${esc(c.labels[i])}</strong>${chips(arr.map(fmt))}</div>`).join('')+buttons('group',c.labels.map(x=>x+' daha tutarlı'))+field('statsRange','Açıklıkların farkı');break;
 }
 stage.innerHTML=html;
 stage.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>{s[b.dataset.group]=Number(b.dataset.pick);restorePick()});restorePick();
 stage.querySelectorAll('[data-counter]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.counter);s.counts[i]=Math.max(0,Math.min(c.data.length,s.counts[i]+Number(b.dataset.delta)));updateTally()});
 stage.querySelectorAll('[data-slider]').forEach(el=>el.oninput=()=>{const i=Number(el.dataset.slider);s.values[i]=Number(el.value);updateTrend()});
 if(c.kind==='tally')updateTally();if(c.kind==='trend')updateTrend();
 if(c.kind==='summary')for(let i=0;i<4;i++)byId('statsField'+i).value=s.answers[i]??'';
 if(c.kind==='axis')byId('statsDifference').value=s.difference??'';
 if(c.kind==='claim')byId('statsEvidence').value=s.evidence??'';
 if(c.kind==='spread')byId('statsRange').value=s.range_difference??'';
 note('Veriyi incele, modelini oluştur ve yanıtını denetle.');
 }
function updateTally(){const c=active.atlas7Stats;s.counts.forEach((n,i)=>{byId('statsCount'+i).textContent=n;byId('statsMeter'+i).style.width=Math.round(100*n/c.data.length)+'%'});byId('statsPlot').innerHTML=barSVG(c.labels,s.counts)}
function updateTrend(){const c=active.atlas7Stats;s.values.forEach((v,i)=>byId('statsValue'+i).textContent=fmt(v));byId('statsPlot').innerHTML=lineSVG(s.values,c.labels)}
function verify(){if(!active)return;const c=active.atlas7Stats;let ok=false;
 switch(c.kind){
 case 'plan':ok=s.question===c.question_correct&&s.sample===c.sample_correct;break;
 case 'tally':ok=s.counts.length===c.counts.length&&s.counts.every((v,i)=>v===c.counts[i]);break;
 case 'trend':ok=s.values.every((v,i)=>equal(v,c.values[i]));break;
 case 'summary':s.answers=c.answer.map((_,i)=>byId('statsField'+i).value);ok=s.answers.every((v,i)=>equal(parse(v),c.answer[i]));break;
 case 'axis':s.difference=byId('statsDifference').value;ok=s.type===c.answer_type&&equal(parse(s.difference),c.difference);break;
 case 'sample':ok=s.group===c.answer&&s.reason===c.why_answer;break;
 case 'claim':s.evidence=byId('statsEvidence').value;ok=s.check===(c.truth?0:1)&&equal(parse(s.evidence),c.evidence);break;
 case 'spread':s.range_difference=byId('statsRange').value;ok=s.group===c.answer&&equal(parse(s.range_difference),c.range_difference);break;
 }
 if(!ok){note('Henüz doğru değil. Veriyi ve gerekçeni yeniden incele; ilerleme kaydedilmedi.','bad');return}
 const id=active.id;const copy=JSON.parse(JSON.stringify(s));byId('answer').value=active.beklenen_yanit_veya_rubrik;byId('check').click();
 if(active?.id===id){render(active,copy);note('✓ Doğru! '+c.why,'good')}
}
byId('atlasStatsVerify').onclick=verify;
byId('atlasStatsHint').onclick=()=>{if(active)note('💡 '+active.ipucu)};
byId('atlasStatsRetry').onclick=()=>{if(active)render(active)};
document.addEventListener('atlas:taskrender',e=>render(bank.get(String(e.detail?.id||''))));
})();