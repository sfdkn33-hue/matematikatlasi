/* Matematik Atlası v5.5: model üretimi, tahmin ve çok adımlı doğrulama. */
(()=>{'use strict';
const root=document.getElementById('atlas55Lab');if(!root||!window.ATLAS_DB)return;
const bank=new Map(window.ATLAS_DB.tasks.filter(t=>t.atlas55).map(t=>[String(t.id),t]));
const $=id=>root.querySelector('#'+id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fields={
 ineq_context:[['variable','Kişi sayısı × birim bedel (TL)'],['bound','x için sınır değer']],
 ineq_line:[['endpoint','Sınır noktası'],['sample','Koşulu sağlayan komşu tam sayı']],
 ineq_solve:[['difference','Sabit terim − sağ taraf'],['threshold','x için sınır değer']],
 tri_element:[['answer','İstenen uzunluk / açı']],
 tri_inequality:[['low','En küçük tam sayı uzunluk'],['high','En büyük tam sayı uzunluk'],['count','Olası uzunluk sayısı']],
 tri_angle:[['largest','En uzun kenarın uzunluğu']],
 tri_construct:[['answer','Üçüncü kenar / kalan açı / aradaki açı']],
 tri_pyth:[['squares','Dik kenar kareleri toplamı'],['c','Kestirme uzunluğu (m)'],['saving','Kazanılan mesafe (m)']],
 seven_ratio:[['unit','Birim fiyat (TL)'],['pred','Tahmin edilen fiyat (TL)']],
 seven_chart:[['total','İki sınıfta toplam seçen']],
 seven_area:[['area','Yamuğun tüm alanı (m²)'],['cut','Kesilen dikdörtgen alanı (m²)'],['remain','Geri kalan alan (m²)']]
};
const choices={
 ineq_context:['op','Karşılaştırma simgesi',['≤','≥']],
 ineq_line:['dot','Sınır noktası',['açık','kapalı']],
 ineq_solve:['result_op','Çözüm eşitsizliğinin yönü',['<','≤','>','≥']],
 tri_element:['typ','Çizilen özel doğru',['kenarortay','açıortay','yükseklik']],
 tri_angle:['vertex','En büyük açının köşesi',['A','B','C']],
 tri_construct:['mode','Üçgeni kurmaya uygun bilgiler',['KKK','AKA','KAK']],
 seven_chart:['leading','Katılım oranı daha yüksek sınıf',['A','B','Eşit']]
};
const extraChoices={
 ineq_line:['side','Sayı doğrusu taraması',['sol','sağ']],
 tri_angle:['side','En uzun kenar',['AB','BC','CA']],
 tri_construct:['valid','Üçgen oluşturulabilir mi?',['evet','hayır']]
};
let task=null,picked={};
function mark(label,id,vals){return `<div class="v55-pick"><strong>${esc(label)}</strong><div class="v55-choices" role="group" aria-label="${esc(label)}">${vals.map(v=>`<button type="button" data-v55key="${esc(id)}" data-v55value="${esc(v)}" aria-pressed="false">${esc(v)}</button>`).join('')}</div></div>`}
function numberLine(endpoint,side='',dot=''){const cx=170,ys=69;let z=`<svg class="v55-svg" viewBox="0 0 340 120" role="img" aria-label="Sayı doğrusu: sınır ${endpoint}, öğrenci taramayı ve nokta türünü seçer"><path d="M18 69H323m-8-6 8 6-8 6M26 63l-8 6 8 6" stroke="#21526b" stroke-width="3" fill="none"/>`;
 for(let j=-3;j<=3;j++){let x=cx+j*37;z+=`<path d="M${x} 61v16" stroke="#21526b" stroke-width="2"/><text x="${x}" y="98" text-anchor="middle">${endpoint+j}</text>`;}
 if(side){let end=side==='sol'?21:321;z+=`<path d="M${cx} ${ys}H${end}" stroke="#0c8e85" stroke-width="6" stroke-linecap="round"/><circle cx="${cx}" cy="${ys}" r="9" fill="${dot==='kapalı'?'#0c8e85':'white'}" stroke="#0c8e85" stroke-width="3"/>`;}return z+'</svg>'}
function triangleSVG(m){const letter=(x,y,t)=>`<text x="${x}" y="${y}">${t}</text>`;
 if(m.kind==='tri_pyth')return `<svg class="v55-svg" viewBox="0 0 320 188" role="img" aria-label="Dik üçgen ve Pisagor modeli"><path d="M42 150H252V27Z" fill="#e2f6ef" stroke="#087870" stroke-width="3"/><path d="M42 134h16v16" fill="none" stroke="#bc6c36" stroke-width="3"/>${letter(112,171,m.a+' m')}${letter(11,92,m.b+' m')}${letter(148,72,'? m')}</svg>`;
 if(m.kind==='tri_inequality')return `<div class="v55-minibars"><div>1. çubuk <b>${m.a} cm</b></div><div>2. çubuk <b>${m.b} cm</b></div></div><p class="v55-ruler">3. çubuk için geçerli tamsayı aralığını oluştur.</p>`;
 if(m.kind==='tri_element')return `<svg class="v55-svg" viewBox="0 0 330 185" role="img" aria-label="ABC üçgeni ve AD yardımcı doğrusu"><path d="M104 25L25 157H300Z" fill="#e8f6fc" stroke="#1a6f85" stroke-width="3"/><path d="M104 25 L${m.typ==='kenarortay'?162:m.typ==='yükseklik'?104:135} 157" stroke="#c36727" stroke-width="3" stroke-dasharray="6 5"/>${letter(95,19,'A')}${letter(10,170,'B')}${letter(307,170,'C')}${letter(m.typ==='kenarortay'?155:m.typ==='yükseklik'?100:132,177,'D')}</svg><p class="v55-ruler">Ölçeksiz çizim, görevde verilen bilgiler esastır.</p>`;
 if(m.kind==='tri_angle'){return `<svg class="v55-svg" viewBox="0 0 330 187" role="img" aria-label="ABC üçgeninde kenar uzunluklarını karşılaştır"><path d="M133 25 L23 163 H300 Z" fill="#edf7ff" stroke="#087a73" stroke-width="3"/>${letter(129,18,'A')}${letter(9,174,'B')}${letter(303,174,'C')}${letter(185,176,'BC='+m.sides.BC)}${letter(42,80,'AB='+m.sides.AB)}${letter(238,90,'CA='+m.sides.CA)}</svg><p class="v55-ruler">Şema ölçeksizdir; kenarlardaki sayılar dikkate alınmalıdır.</p>`;}
 return `<svg class="v55-svg" viewBox="0 0 330 175" role="img" aria-label="Üçgen oluşturma çalışma şeması"><path d="M45 146H285L135 20Z" fill="#e2f5ee" stroke="#08776b" stroke-width="3"/>${letter(135,17,'A')}${letter(31,156,'B')}${letter(291,156,'C')}</svg><p class="v55-ruler">Şema ölçeksizdir; yapım için verilen ölçüleri kullan.</p>`;
}
function viz(m){if(m.kind==='ineq_line')return numberLine(m.endpoint,picked.side,picked.dot);
 if(m.kind==='ineq_context')return `<div class="v55-minibars"><div>Sabit ücret <b>${m.fixed} TL</b></div><div>Birim bedel <b>${m.k} TL</b></div></div>`;
 if(m.kind==='ineq_solve')return `<div class="v55-note"><b>−${m.k}x + ${m.b} ${m.op} ${m.c}</b><p>Her iki tarafı negatif sayıya bölünce ne değişir?</p></div>`;
 if(m.kind.startsWith('tri_'))return triangleSVG(m);
 if(m.kind==='seven_chart')return `<div class="v55-minibars"><div>A sınıfı <b>${m.vA} / ${m.cA}</b></div><div>B sınıfı <b>${m.vB} / ${m.cB}</b></div></div>`;
 if(m.kind==='seven_area')return `<svg class="v55-svg" viewBox="0 0 330 180" role="img" aria-label="Yamuk alanı modeli"><path d="M98 24H228 L296 143 H24Z" fill="#dff5ee" stroke="#0b776d" stroke-width="3"/><path d="M98 24V143" stroke="#d1792a" stroke-width="2" stroke-dasharray="5 4"/><text x="154" y="18">a=${m.a}</text><text x="144" y="165">b=${m.b}</text><text x="40" y="85">h=${m.h}</text></svg><p class="v55-ruler">Alanı parçalayarak hesapla. Şekil ölçeksizdir.</p>`;
 if(m.kind==='seven_ratio')return `<div class="v55-minibars"><div>${m.n} ürün: <b>${m.first} TL</b></div><div>${m.n2} ürün: <b>${m.second} TL</b></div></div>`;
 return ''}
function status(message,err=false){const x=$('v55-status');x.textContent=message;x.dataset.error=String(err)}
function render(t){task=t||null;picked={};root.hidden=!t;if(!t){$('v55-stage').replaceChildren();return}let m=t.atlas55;let h=`<div class="v55-viz" id="v55-viz">${viz(m)}</div><div class="v55-problem">${esc(m.stem)}</div><div class="v55-fields">${fields[m.kind].map(([k,label])=>`<label class="v55-field"><span>${esc(label)}</span><input type="number" step="any" inputmode="decimal" autocomplete="off" data-v55="${esc(k)}" placeholder="Yanıtını yaz"></label>`).join('')}</div>`;
 const primary=choices[m.kind];if(primary)h+=mark(primary[1],primary[0],primary[2]);let secondary=extraChoices[m.kind];if(secondary)h+=mark(secondary[1],secondary[0],secondary[2]);
 $('v55-title').textContent=t.baslik;$('v55-topic').textContent=t.ogrenme_ciktisi+' · '+(t.sinif==='8'?'8. sınıf LGS hazırlık becerisi':'7. sınıf muhakeme becerisi');$('v55-stage').innerHTML=h;$('v55-solution').hidden=true;status('Önce modeli incele; işlem basamaklarını ve kararını oluştur.');
 root.querySelectorAll('[data-v55key]').forEach(b=>b.addEventListener('click',()=>{let k=b.dataset.v55key;picked[k]=b.dataset.v55value;root.querySelectorAll(`[data-v55key="${k}"]`).forEach(other=>other.setAttribute('aria-pressed',String(b===other)));if(m.kind==='ineq_line')$('v55-viz').innerHTML=viz(m)}));}
function check(){if(!task)return;let m=task.atlas55,wrong=[];
 for(let [key] of fields[m.kind]){let i=root.querySelector(`[data-v55="${key}"]`),v=i.value.trim().replace(',','.');if(!v||!Number.isFinite(Number(v))||Math.abs(Number(v)-m[key])>1e-8)wrong.push(key);i.classList.toggle('is-wrong',wrong.includes(key));}
 for(let entry of [choices[m.kind],extraChoices[m.kind]]){if(!entry)continue;let key=entry[0],expected=key==='valid'?(m.valid?'evet':'hayır'):m[key];if(picked[key]!==String(expected))wrong.push(key);}
 if(wrong.length){status(`Henüz ${wrong.length} adım eksik veya hatalı. İpucunu kullanıp yeniden dene; ilerleme kaydedilmedi.`,true);return;}
 $('v55-solution').hidden=false;$('v55-solution').textContent='✓ Doğrulandı. '+m.explanation+' · '+fields[m.kind].map(([key,name])=>name+': '+m[key]).join(' · ');
 status('✓ Ara değerler ve seçim doğru! Görev kaydediliyor.');window.__atlas55Verified=task.id;
 try{document.getElementById('answer').value='1';document.getElementById('check').click()}finally{window.__atlas55Verified=null}
}
$('v55-check').addEventListener('click',check);$('v55-hint').addEventListener('click',()=>task&&status('💡 '+task.ipucu));$('v55-reset').addEventListener('click',()=>task&&render(task));
document.addEventListener('atlas:taskrender',e=>render(bank.get(String(e.detail?.id||''))));
window.MatematikAtlasV55={taskCount:bank.size,getCurrentId:()=>task?.id||null};
})();
