/* Matematik Atlası v5.7 – 7. sınıf etkileşimli muhakeme: öğretmen onayı yoktur. */
(()=>{'use strict';
const root=document.getElementById('atlas57Lab'); if(!root||!window.ATLAS_DB)return;
const bank=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas57).map(t=>[t.id,t]));
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let task=null,select={};
const field=(key,label)=>`<label class="v57-field"><span>${esc(label)}</span><input type="number" step="any" inputmode="decimal" data-v57="${esc(key)}" placeholder="?" autocomplete="off"></label>`;
const pick=(key,title,vals)=>`<fieldset class="v57-pick"><legend>${esc(title)}</legend><div class="v57-options">${vals.map(v=>`<button type="button" data-v57pick="${esc(key)}" data-value="${esc(v)}" aria-pressed="false">${esc(v)}</button>`).join('')}</div></fieldset>`;
function scene(m){
 if(m.kind==='graph'){
  const b=Math.max(m.B-m.axis,1),a=Math.max(m.A-m.axis,1),max=Math.max(a,b);
  return `<div class="v57-graphic" role="img" aria-label="Dikey eksen ${m.axis} değerinden başlıyor. A grubu ${m.A}, B grubu ${m.B}"><p class="v57-badge">Grafiğin dikey eksen başlangıcı: ${m.axis}</p><div class="v57-bars"><div><strong>${m.A}</strong><div class="v57-bar v57-bar-a" style="height:${Math.max(12,Math.round(a/max*125))}px"></div><span>A grubu</span></div><div><strong>${m.B}</strong><div class="v57-bar v57-bar-b" style="height:${Math.max(12,Math.round(b/max*125))}px"></div><span>B grubu</span></div></div><small>Ölçek başlangıcını kontrol et; görünen yükseklik mutlak miktar değildir.</small></div>`;
 }
 if(m.kind==='ratio')return `<div class="v57-cards"><div><b>A standı</b><strong>${m.n1} kalem / ${m.p1} TL</strong></div><div><b>B standı</b><strong>${m.n2} kalem / ${m.p2} TL</strong></div><div><b>İhtiyaç</b><strong>${m.need} kalem</strong></div></div>`;
 if(m.kind==='complement')return `<div class="v57-graphic"><p>Bilyeleri grupla; yalnız bir çekiliş yapılıyor.</p><div class="v57-marbles" role="img" aria-label="${m.red} kırmızı, ${m.blue} mavi, ${m.green} yeşil bilye">${Array.from({length:m.red},()=>'<span class="red"></span>').join('')}${Array.from({length:m.blue},()=>'<span class="blue"></span>').join('')}${Array.from({length:m.green},()=>'<span class="green"></span>').join('')}</div><p class="v57-legend">🔴 ${m.red} kırmızı · 🔵 ${m.blue} mavi · 🟢 ${m.green} yeşil</p></div>`;
 if(m.kind==='equation')return `<div class="v57-cards"><div><b>Sabit ücret</b><strong>${m.b} TL</strong></div><div><b>Kişi başı</b><strong>${m.a} TL</strong></div><div><b>${m.sign==='='?'Toplam':'En çok'}</b><strong>${m.c} TL</strong></div></div>`;
 return '';
}
function controls(m){if(m.kind==='graph')return [field('difference','Gerçek sayı farkı'),field('percent','A grubuna göre yüzde artış (%)'),pick('judgment','Bu grafik farkı görsel olarak abartıyor mu?',['abartıyor','abartmıyor'])].join('');
 if(m.kind==='ratio')return [field('unitA','A birim fiyatı (TL)'),field('unitB','B birim fiyatı (TL)'),field('targetA',`${m.need} kalem için A toplamı (TL)`),field('targetB',`${m.need} kalem için B toplamı (TL)`),pick('cheaper','Hangi stant ekonomik?',['A','B','eşit'])].join('');
 if(m.kind==='complement')return [field('notRed','Kırmızı olmayan bilye sayısı'),field('total','Tüm olası sonuç sayısı'),field('pnum','Sade kesrin payı'),field('pden','Sade kesrin paydası'),pick('judgment','Bir olay ve tümleyeni toplamı kaçtır?',['0','1','2'])].join('');
 if(m.kind==='equation')return [field('remaining','Sabit gider çıkarılınca kalan (TL)'),field('result','Katılımcı sayısı / üst sınırı'),pick('sign','Doğru bağıntı simgesi',['=','≤','≥'])].join('');
 return '';
}
function render(t){task=t||null;select={};window.__atlas57Verified=null;root.hidden=!t;if(!t)return;
 const m=t.atlas57; $('v57-title').textContent=t.baslik;$('v57-code').textContent=t.ogrenme_ciktisi+' · kazanım beceri çalışması';$('v57-stage').innerHTML=scene(m)+`<p class="v57-stem">${esc(m.stem)}</p><div class="v57-fields">${controls(m)}</div>`;
 $('v57-solution').hidden=true;$('v57-solution').textContent='';const st=$('v57-status');st.textContent='Modeli incele, tüm ara adımları ve kararını oluştur.';st.dataset.error='false';
 root.querySelectorAll('[data-v57pick]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.v57pick;select[key]=b.dataset.value;root.querySelectorAll('[data-v57pick="'+key+'"]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
}
function check(){if(!task)return;const m=task.atlas57;let errors=[];
 root.querySelectorAll('[data-v57]').forEach(el=>{const key=el.dataset.v57,v=el.value.trim().replace(',','.');const ok=v!==''&&Number.isFinite(Number(v))&&Math.abs(Number(v)-Number(m[key]))<1e-7;el.classList.toggle('v57-invalid',!ok);if(!ok)errors.push(key)});
 root.querySelectorAll('[data-v57pick]').forEach(el=>{const key=el.dataset.v57pick;if(select[key]!==String(m[key])&&!errors.includes(key))errors.push(key)});
 const st=$('v57-status');if(errors.length){st.dataset.error='true';st.textContent=`${errors.length} ara değer veya karar eksik/hatalı. Matematiksel ilişkiyi yeniden kontrol et; görev tamamlanmadı.`;return}
 st.dataset.error='false';st.textContent='✓ Model ve tüm ara adımlar doğru. Görev otomatik kaydediliyor.';$('v57-solution').hidden=false;$('v57-solution').textContent=m.solution;
 window.__atlas57Verified=task.id;try{$('answer').value='1';$('check').click()}finally{window.__atlas57Verified=null}
}
$('v57-check').addEventListener('click',check);
$('v57-hint').addEventListener('click',()=>{$('v57-status').textContent='💡 '+(task?.atlas57.hint||'')});
$('v57-reset').addEventListener('click',()=>{if(task)render(task)});
document.addEventListener('atlas:taskrender',e=>render(bank.get(e.detail.id)||null));
})();
