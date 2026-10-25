/* Matematik Atlası v5.4 | Muhakeme stüdyosu: öğrenci gerçek ara adımları oluşturur. */
(()=>{'use strict';
const root=document.getElementById('atlas54Lab');if(!root||!window.ATLAS_DB)return;
const tasks=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas54).map(t=>[String(t.id),t]));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const elt=id=>root.querySelector('#'+id);
const num=(key,label)=>`<label class="v54-field"><span>${esc(label)}</span><input type="number" inputmode="decimal" step="any" data-v54="${esc(key)}" autocomplete="off" placeholder="Sonuç"></label>`;
const pick=(key,label,options)=>`<div class="v54-choicebox"><strong>${esc(label)}</strong><div class="v54-picks" role="group" aria-label="${esc(label)}">${options.map(([v,s])=>`<button type="button" data-v54key="${esc(key)}" data-v54value="${esc(v)}" aria-pressed="false">${esc(s)}</button>`).join('')}</div></div>`;
function viz(m){
 if(m.kind==='coordinate'){
  let z='<svg viewBox="0 0 320 270" role="img" aria-label="Koordinat düzlemi ve başlangıç noktası" class="v54-svg">';for(let k=0;k<=10;k++){let v=30+k*24;z+=`<path d="M${v} 15V255 M30 ${15+k*24}H270" stroke="#d2e2ec" stroke-width="1"/>`;}z+='<path d="M150 10V260 M24 135H280" stroke="#345878" stroke-width="2.5"/><path d="M150 10l-5 9m5-9l5 9 M280 135l-9-5m9 5l-9 5" stroke="#345878" stroke-width="2" fill="none"/>';
  z+=`<circle cx="${150+m.x*24}" cy="${135-m.y*24}" r="7" fill="#087f75"/><text x="${150+m.x*24+10}" y="${135-m.y*24-10}" font-size="14" fill="#164460" font-weight="700">P(${m.x},${m.y})</text><text x="290" y="135" fill="#164460">x</text><text x="155" y="16" fill="#164460">y</text></svg>`;return z;
 }
 if(m.kind==='linear_table')return '<div class="v54-tablewrap"><table><thead><tr><th>x</th>'+m.values.map(p=>`<th>${p[0]}</th>`).join('')+'</tr></thead><tbody><tr><th>y</th>'+m.values.map(p=>`<td>${p[1]}</td>`).join('')+'</tr></tbody></table></div>';
 if(m.kind==='bias')return `<div class="v54-data-columns"><div><b>A grubu</b><div class="v54-bars">${m.dataA.map(n=>`<div title="${n}" style="height:${Math.max(15,Math.min(100,n*2))}%"><span>${n}</span></div>`).join('')}</div></div><div><b>B grubu</b><div class="v54-bars">${m.dataB.map(n=>`<div title="${n}" style="height:${Math.max(15,Math.min(100,n*2))}%"><span>${n}</span></div>`).join('')}</div></div></div>`;
 if(m.kind==='trapezoid')return `<svg viewBox="0 0 330 165" role="img" aria-label="Paralel tabanları ${m.a} ve ${m.b}, yüksekliği ${m.h} olan yamuk" class="v54-svg"><path d="M88 27 H${88+m.a*12} L${58+m.b*12} 133 H58 Z" fill="#d7f5ed" stroke="#087c72" stroke-width="3"/><path d="M88 27V133" stroke="#ce8533" stroke-width="2" stroke-dasharray="5 5"/><text x="144" y="20">Üst ${m.a} m</text><text x="126" y="154">Alt ${m.b} m</text><text x="33" y="91">h=${m.h}</text></svg>`;
 if(m.kind==='slope')return `<svg viewBox="0 0 300 154" role="img" aria-label="Yatay değişim ve düşey yükselme modeli" class="v54-svg"><path d="M33 120L${33+m.run*22} 120 L${33+m.run*22} ${120-m.rise*12}Z" fill="#d7f5ed" stroke="#087f75" stroke-width="3"/><text x="${38+m.run*8}" y="142">${m.run} m →</text><text x="${47+m.run*22}" y="${112-m.rise*6}">↑ ${m.rise} m</text></svg>`;
 if(m.kind==='complement')return `<div class="v54-chips" aria-label="Kırmızı mavi yeşil kartlar">${Array(m.red).fill('<span class="v54-red"></span>').join('')}${Array(m.blue).fill('<span class="v54-blue"></span>').join('')}${Array(m.green).fill('<span class="v54-green"></span>').join('')}</div>`;
 if(m.kind==='compare_lines')return `<div class="v54-plan"><div><b>A planı</b><span>${m.fixA} TL + ${m.rateA} TL/birim</span></div><div><b>B planı</b><span>${m.fixB} TL + ${m.rateB} TL/birim</span></div></div>`;
 if(m.kind==='linear_graph')return `<div class="v54-tablewrap"><table><thead><tr><th>x</th><th>0</th><th>2</th></tr></thead><tbody><tr><th>y</th><td>?</td><td>?</td></tr></tbody></table></div>`;
 return '';
}
let task=null,choice={},attempts=0;
function state(msg,error=false){const x=elt('v54-status');x.textContent=msg;x.dataset.error=String(error);}
const requireFields={
 compare_unit:[['u1','A birim fiyatı (TL)'],['u2','B birim fiyatı (TL)']],
 bias:[['medianA','A ortancası'],['medianB','B ortancası']],
 trapezoid:[['area','Yamuğun alanı (m²)'],['remain','Kalan alan (m²)']],
 complement:[['non','Kırmızı olmayan kart'],['total','Toplam kart']],
 equation:[['remaining','Sabit ücret çıktıktan sonra (TL)'],['x','Katılım sayısı']],
 coordinate:[['xx','Son x koordinatı'],['yy','Son y koordinatı']],
 linear_table:[['rate','Birim artış / eğim'],['b','x=0 başlangıç değeri'],['at','x=7 için y']],
 linear_graph:[['y0','x=0 için y'],['y2','x=2 için y'],['rate','Eğim']],
 compare_lines:[['meeting','Eşit fiyatın oluştuğu birim'],['priceA', 'İlerideki A fiyatı'],['priceB','İlerideki B fiyatı']],
 slope:[['run','Yatay değişim'],['rise','Düşey değişim'],['slope','Eğim']]
};
const special={
 compare_unit:['best','Hangi seçenek birim başına daha ucuz?', [['A','A'],['B','B'],['equal','Eşit']]],
 bias:['claim','Ortancalara göre hangi grup tipik olarak daha yüksek?', [['A','A'],['B','B'],['equal','Eşit']]],
 complement:['compare','Hangi olay daha olası?', [['nonred','Kırmızı gelmemesi'],['red','Kırmızı gelmesi'],['equal','Eşit']]],
 coordinate:['quadrant','Yeni nokta hangi bölgededir?', [['I','I. bölge'],['II','II. bölge'],['III','III. bölge'],['IV','IV. bölge'],['EKSEN','Eksen üzerinde']]],
 compare_lines:['best','Belirtilen ileriki kullanımda hangisi daha ucuz?', [['A','A'],['B','B'],['equal','Eşit']]]
};
function render(t){task=t||null;root.hidden=!t;choice={};attempts=0;if(!t){elt('v54-stage').replaceChildren();return;}const m=t.atlas54;
 let html=`<div class="v54-viz">${viz(m)}</div><p class="v54-problem">${esc(m.stem)}</p><div class="v54-inputgrid">${requireFields[m.kind].map(([k,label])=>num(k,label)).join('')}</div>`;
 if(special[m.kind])html+=pick(...special[m.kind]);
 html+='<div class="v54-why"><strong>Akıl yürütme</strong><p>Önce görsel/veriyi incele, ardından ara değerleri bul. Son kararını bu hesaplardan türet. Çözümün sonunda açıklama açılır.</p></div>';
 elt('v54-stage').innerHTML=html;elt('v54-title').textContent=t.baslik;elt('v54-subtitle').textContent=t.ogrenme_ciktisi+' · '+(t.sinif==='8'?'LGS beceri pratiği':'Maarif Modeli beceri pratiği');elt('v54-solution').hidden=true;elt('v54-solution').textContent='';state('Veriyi yorumla ve tüm adımları tamamla.');
 root.querySelectorAll('[data-v54key]').forEach(b=>b.addEventListener('click',()=>{let k=b.dataset.v54key;choice[k]=b.dataset.v54value;root.querySelectorAll(`[data-v54key="${k}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));
}
function check(){if(!task)return;let m=task.atlas54;attempts++;let wrong=[];
 for(const [k] of requireFields[m.kind]){const el=root.querySelector(`[data-v54="${k}"]`), v=el?.value?.trim();const n=Number(v);if(!v||!Number.isFinite(n)||Math.abs(n-m[k])>1e-9)wrong.push(k);el?.classList.toggle('v54-invalid',wrong.includes(k));}
 if(special[m.kind]){let k=special[m.kind][0];if(choice[k]!==m[k])wrong.push(k)}
 if(wrong.length){window.Atlas616Trace?.wrong(task,'v5.4 muhakeme ve çok adımlı çözüm');state(`Henüz ${wrong.length} adım eksik veya hatalı. Hesabını kontrol et; ilerleme kaydedilmedi.`,true);return}
 let explain=task.atlas54.explanation+' · '+requireFields[m.kind].map(([k,label])=>label+': '+m[k]).join(' · ')+(special[m.kind]?' · Karar: '+m[special[m.kind][0]]:'');
 elt('v54-solution').hidden=false;elt('v54-solution').textContent='Çözüm kontrolü: '+explain;
 state('✓ Ara hesaplar ve yorum doğru! İlerleme kaydediliyor.');window.__atlas54Verified=task.id;
 try{document.getElementById('answer').value='1';document.getElementById('check').click()}finally{window.__atlas54Verified=null}
}
elt('v54-check').addEventListener('click',check);elt('v54-hint').addEventListener('click',()=>task&&state('💡 '+task.ipucu));elt('v54-reset').addEventListener('click',()=>task&&render(task));
document.addEventListener('atlas:taskrender',e=>render(tasks.get(String(e.detail?.id||''))));
window.MatematikAtlasV54={getCurrentId:()=>task?.id||null,taskCount:tasks.size};
})();
