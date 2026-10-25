/* Matematik Atlası v5.3 — Cebirsel ifadeler: dört farklı gerçek model */
(()=>{'use strict';
const root=document.getElementById('atlas53Lab');const db=window.ATLAS_DB;
if(!root||!db)return;
const $=id=>root.querySelector('#'+id);
const tasks=new Map(db.tasks.filter(t=>t.atlas53).map(t=>[String(t.id),t]));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sign=n=>n>=0?'+'+n:'−'+Math.abs(n);
const box=(txt,cl='')=>`<span class="v53-tile ${cl}" aria-label="${esc(txt)}">${esc(txt)}</span>`;
const field=(key,label,placeholder='Sayı')=>`<label class="v53-field">${esc(label)}<input data-v53="${esc(key)}" type="number" step="1" inputmode="numeric" placeholder="${esc(placeholder)}" autocomplete="off"></label>`;
const choices=(key,list)=>`<div class="v53-choices" role="group" aria-label="${esc(key==='family'?'Özdeşlik türü':'Çarpanlara ayırma yöntemi')}">${list.map(([value,text])=>`<button type="button" class="v53-choice" data-choice-key="${esc(key)}" data-choice-value="${esc(value)}" aria-pressed="false">${esc(text)}</button>`).join('')}</div>`;
const num=k=>{let s=root.querySelector(`[data-v53="${k}"]`)?.value?.trim();return s!==''&&s!==undefined&&Number.isSafeInteger(Number(s))?Number(s):null};
let current=null,model=null,choice={};
function status(msg,err=false){const el=$('v53-status');el.textContent=msg;el.dataset.error=String(err)}
function choiceWire(){root.querySelectorAll('[data-choice-key]').forEach(b=>b.addEventListener('click',()=>{let k=b.dataset.choiceKey;choice[k]=b.dataset.choiceValue;root.querySelectorAll(`[data-choice-key="${k}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));status('Model türünü seçtin. Şimdi ara katsayıları tamamla.')}))}
const trKeys=[['square_plus','(x + b)²'],['square_minus','(x − b)²'],['difference','A² − B²']];
const facKeys=[['common','Ortak çarpan'],['difference','İki kare farkı'],['perfect','Tam kare']];
function render(t){current=t||null;root.hidden=!t;choice={};if(!t){$('v53-stage').replaceChildren();return}
 model=t.atlas53;let m=model,h='';
 if(m.kind==='expression'){
  h=`<div class="v53-scene"><p class="v53-label">Sözlü durumu cebirsel ifadeye dönüştür</p><div class="v53-equation">a · x + b</div><p>x = <strong>${m.x}</strong> olduğunda yerine koymayı da yap.</p></div><div class="v53-grid">${field('a','x’in katsayısı a')}${field('b','Sabit terim b')}${field('value',`x = ${m.x} için ifadenin değeri`)}</div>`;
 }
 if(m.kind==='product'){
  const title=`(${m.a}x ${sign(m.b)}) · (${m.c}x ${sign(m.d)})`;
  h=`<div class="v53-scene"><div class="v53-equation">${esc(title)}</div><p>Her kutu, bir satır terimiyle bir sütun teriminin çarpımıdır. Negatif karolar da bulunabilir.</p></div><div class="v53-product"><div class="v53-head"></div><div class="v53-head">${esc(m.c)}x</div><div class="v53-head">${esc(sign(m.d))}</div><div class="v53-head">${esc(m.a)}x</div><div>${field('c0','x² katsayısı')}</div><div>${field('c1','x katsayısı')}</div><div class="v53-head">${esc(sign(m.b))}</div><div>${field('c2','x katsayısı')}</div><div>${field('c3','Sabit')}</div></div><p class="v53-label">Aynı tür terimleri topla</p><div class="v53-grid">${field('A','Sonuçta x² katsayısı')}${field('B','Sonuçta x katsayısı')}${field('C','Sonuçta sabit')}</div>`;
 }
 if(m.kind==='identity'){
  const b=m.b;let tiles=m.identity==='difference'?box(`${m.a*m.a}x²`)+box(`−${b*b}`,'minus'):box('x²')+box((m.identity==='square_minus'?'−':'')+b+'x','mixed')+box((m.identity==='square_minus'?'−':'')+b+'x','mixed')+box(b*b,'const');
  h=`<div class="v53-scene"><p class="v53-label">İşaretli cebir karoları</p><div class="v53-tile-grid">${tiles}</div><p>Kare farkında <em>orta terimler birbirini yok eder</em>. Tam karede iki eş dikdörtgen terimi vardır.</p></div><p class="v53-label">Hangi özdeşlik?</p>${choices('family',trKeys)}<div class="v53-grid">${field('A','x² katsayısı')}${field('B','x katsayısı (yoksa 0)')}${field('C','Sabit terim')}</div>`;
 }
 if(m.kind==='factor'){
  h=`<div class="v53-scene"><p class="v53-label">İfadeden çarpanlara</p><p>Önce uygun dönüşüm yöntemini seç. Sonra ifadeyi çarpan yapısında yeniden kur.</p></div>${choices('family',facKeys)}`;
  if(m.factor_type==='common')h+=`<div class="v53-factor">k·(a·x + b)</div><div class="v53-grid">${field('k','Ortak çarpan k')}${field('a','Parantez içi x katsayısı a')}${field('b','Parantez içi sabit b')}</div>`;
  if(m.factor_type==='difference')h+=`<div class="v53-factor">(a·x − b)(a·x + b)</div><div class="v53-grid">${field('a','Her çarpandaki x katsayısı a')}${field('b','Her çarpandaki sabitin büyüklüğü b')}</div>`;
  if(m.factor_type==='perfect')h+=`<div class="v53-factor">(x ± b)²</div><div class="v53-grid">${field('b','Kare içindeki pozitif sayı b')}</div>${choices('sign',[['+','(x + b)²'],['−','(x − b)²']])}`;
 }
 $('v53-title').textContent=t.baslik;$('v53-subtitle').textContent=t.ogrenme_ciktisi+' · '+t.mekanik;
 $('v53-stage').innerHTML=h;choiceWire();status('Önce ara adımları kur; yalnız sonucun doğru olması yeterli değil.');
}
function equal(k,v){return num(k)!==null&&num(k)===v}
function verify(){if(!current)return;let m=model,ok=false;
 if(m.kind==='expression')ok=equal('a',m.a)&&equal('b',m.b)&&equal('value',m.value);
 if(m.kind==='product')ok=m.cells.every((v,i)=>equal('c'+i,v))&&equal('A',m.coeffs[0])&&equal('B',m.coeffs[1])&&equal('C',m.coeffs[2]);
 if(m.kind==='identity')ok=choice.family===m.identity&&equal('A',m.coeffs[0])&&equal('B',m.coeffs[1])&&equal('C',m.coeffs[2]);
 if(m.kind==='factor')ok=choice.family===m.factor_type&&(m.factor_type==='common'?(equal('k',m.k)&&equal('a',m.a)&&equal('b',m.b)):m.factor_type==='difference'?(equal('a',m.a)&&equal('b',m.b)):(equal('b',m.b)&&choice.sign===(m.sgn>0?'+':'−')));
 if(!ok){status('Bazı ara adımlar veya model türü henüz doğru değil. İpucunu inceleyip tekrar dene. İlerleme kaydedilmedi.',true);return}
 status('✓ Bütün model adımları doğru. Görev kaydediliyor…');window.__atlas53Verified=current.id;
 try{let ans=document.getElementById('answer'),button=document.getElementById('check');ans.value='1';button.click()}
 finally{window.__atlas53Verified=null}
}
$('v53-check').addEventListener('click',verify);
$('v53-hint').addEventListener('click',()=>current&&status('💡 '+current.ipucu));
$('v53-reset').addEventListener('click',()=>current&&render(current));
document.addEventListener('atlas:taskrender',e=>render(tasks.get(String(e.detail?.id||''))));
})();
