/* Matematik Atlası v5.0 - matematiksel keşif. Tamamlanma kapısı doğrulama öncesi açılmaz. */
(()=>{'use strict';
const $=id=>document.getElementById(id),root=$('atlas50Lab'),db=window.ATLAS_DB;
if(!root||!db)return;
const tasks=new Map(db.tasks.filter(t=>t.atlas50).map(t=>[String(t.id),t]));
let task=null,m=null,state={};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const get=id=>(root.querySelector('#v50'+id)?.value||'').trim();
const num=s=>{let q=String(s||'').trim().replace(/\s/g,'').replace(',','.');if(/^[-+]?\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/.test(q)){let [a,b]=q.split('/').map(Number);return b?a/b:NaN}return /^[-+]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(q)?Number(q):NaN};
const equal=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-9;
const field=(key,label,placeholder='Yanıtını gir')=>`<label class="v50-field">${esc(label)}<input id="v50${key}" type="text" inputmode="decimal" autocomplete="off" placeholder="${esc(placeholder)}"></label>`;
const select=(key,label,opts)=>`<label class="v50-field">${esc(label)}<select id="v50${key}"><option value="">Seç</option>${opts.map((v,i)=>`<option value="${esc(v)}">${esc(v)}</option>`).join('')}</select></label>`;
const say=(text,bad=false)=>{let p=$('atlas50Status');p.textContent=text;p.dataset.error=String(bad)};
const fmt=n=>Number(n.toFixed(9)).toString().replace('.',',');
function sectorSVG(angle){const end=-Math.PI/2+angle*Math.PI/180;const x=100+80*Math.cos(end),y=100+80*Math.sin(end);const big=angle>180?1:0;const wedge=angle===360?'<circle cx="100" cy="100" r="80" fill="#96dcce"/>': angle>0?`<path d="M100 100 L100 20 A80 80 0 ${big} 1 ${x.toFixed(3)} ${y.toFixed(3)} Z" fill="#96dcce"/>`:'';return `<svg role="img" aria-label="${angle} derecelik merkez açı" class="v50-diagram" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="#eff8ff" stroke="#156d97" stroke-width="3"/>${wedge}<line x1="100" y1="100" x2="100" y2="20" stroke="#156d97" stroke-width="2"/><circle cx="100" cy="100" r="3" fill="#156d97"/><text x="100" y="107" dx="6" fill="#143c56" font-size="12">${angle}°</text></svg>`}
function trapezoidSVG(m,copies=false){return `<svg class="v50-diagram" viewBox="0 0 360 185" role="img" aria-label="${copies?'İki eş yamuk birleşerek paralelkenara dönüşüyor':'Bir yamuk'}"><path d="M65 22 H145 L195 136 H18 Z" fill="#a3e2d0" stroke="#116a76" stroke-width="3"/>${copies?'<path d="M145 22 H322 L275 136 H195 Z" fill="#fbd78c" fill-opacity=".78" stroke="#9b5f16" stroke-width="2.5"/>':''}<line x1="65" y1="22" x2="65" y2="136" stroke="#b35b21" stroke-width="2" stroke-dasharray="5 5"/><text x="105" y="17" fill="#15445e" font-size="12">a=${m.a}</text><text x="97" y="154" fill="#15445e" font-size="12">b=${m.b}</text><text x="46" y="82" fill="#15445e" font-size="12">h=${m.h}</text>${copies?'<text x="240" y="85" fill="#15445e" font-size="12">eş kopya</text>':''}</svg>`}
function gardenSVG(m){return `<svg viewBox="0 0 320 190" class="v50-diagram" role="img" aria-label="Yamuk bahçenin içinde eşkenar dörtgen biçimli çiçeklik. Şekil ölçekli çizilmemiştir."><path d="M94 20 L221 20 L293 172 L22 172 Z" fill="#b9e0c5" stroke="#1c7656" stroke-width="3"/><path d="M158 39 L221 99 L158 158 L95 99 Z" fill="#f4d58e" stroke="#a16e1e" stroke-width="3"/><path d="M158 39 V158 M95 99 H221" fill="none" stroke="#a16e1e" stroke-dasharray="4 3"/><text x="152" y="14" font-size="12" fill="#153f58">a=${m.a}</text><text x="147" y="186" font-size="12" fill="#153f58">b=${m.b}</text><text x="28" y="92" font-size="12" fill="#153f58">h=${m.h}</text></svg>`}
function paint(){if(!task)return;let h='',k=m.kind;
 if(k==='dec_fraction'){
  h=`<div class="v50-hero">${m.target}</div><p>Kesir kısmını üç ayrı birime ayır:</p><div class="v50-three">${['Onda birler /10','Yüzde birler /100','Binde birler /1000'].map((lab,i)=>select('d'+i,lab,[0,1,2,3,4,5,6,7,8,9])).join('')}</div><div class="v50-result" id="v50Live">Kesir toplamı: ?/10 + ?/100 + ?/1000</div>${select('rule','Aradaki sıfırlar için doğru açıklama',['Sıfırın bulunduğu basamağın değeri sıfırdır, konumu korunur','Her sıfır, basamağın tamamen silinmesini sağlar','Sıfırlar yalnızca tam sayı bölümünde önemlidir'])}`;
 }else if(k==='dec_line'){
  h=`<div class="v50-hero">${m.target}</div><div class="v50-axis-labels"><b>${m.base}</b><b>${m.base+1}</b></div><input id="v50slider" class="v50-range" type="range" min="0" max="1000" step="1" value="0" aria-label="Binde birlik sayı doğrusu"/><div class="v50-axis" aria-hidden="true"><span id="v50Marker" style="left:0%">◆</span></div><div class="v50-result" id="v50Live">İşaretlenen konum: ${m.base},000</div>${select('interval','Hangi onda birlik aralık?',Array.from({length:10},(_,i)=>`${m.base},${i}–${m.base},${i+1}`))}<p class="v50-mini">Sürgüyü dokunarak, ok tuşlarıyla veya kaydırarak konumlandırabilirsin.</p>`;
 }else if(k==='dec_fix'){
  h=`<div class="v50-comparison"><div><small>Yanlış çözümleme</small><strong>${m.wrong}</strong></div><div><small>Hedef sayı</small><strong>${m.target}</strong></div></div>${select('hundred','Yüzde birler basamağındaki doğru rakam',Array.from({length:10},(_,i)=>i))}${select('thousand','Binde birler basamağındaki doğru rakam',Array.from({length:10},(_,i)=>i))}${field('correct','Düzeltilmiş ondalık gösterim','Örn. 12,408')}${select('rule','Öğrencinin yanılgısı',['Virgülü yanlış yerde kullandı','Yüzde birler ile binde birler basamaklarını karıştırdı','Tam kısmı değiştirdi'])}`;
 }else if(k==='sector_slider'){
  h=`<div class="v50-figure" id="v50Figure">${sectorSVG(0)}</div><label class="v50-field">Merkez açıyı kur: <output id="v50AngleOut">0°</output><input id="v50angle" class="v50-range" type="range" min="0" max="360" step="15" value="0"></label><p>Hedef açı: <b>${m.angle}°</b> · yarıçap: <b>${m.r} birim</b></p><div class="v50-two">${field('numer','Dairenin kaçta kaçı? Pay','Örn. 1')}${field('denom','Payda','Örn. 4')}</div>${field('area','Dilim alanının π katsayısı','Kesir de yazılabilir')}<div id="v50Live" class="v50-result">Açı değiştikçe dairede kapladığı alanı gözlemle.</div>`;
 }else if(k==='trapezoid_copies'){
  h=`<div id="v50Figure" class="v50-figure">${trapezoidSVG(m,false)}</div><button id="v50Copy" type="button" class="v50-construct" aria-pressed="false">＋ Eş yamuk kopyasını yerleştir</button><div id="v50Live" class="v50-result">Bir yamuk var; ikinci kopyayı ekle.</div>${field('double','Birleşmiş paralelkenarın alanı','br²')}${field('area','Tek yamuğun alanı','br²')}${select('rule','Doğru alan bağıntısı',['(a+b)×h/2','(a−b)×h','a×b×h'])}`;
 }else if(k==='composite_area'){
  h=`<div class="v50-figure">${gardenSVG(m)}</div><p class="v50-mini">Şema ölçekli değildir; hesaplamada verilen uzunlukları kullan.</p><div class="v50-two">${field('outer','Bahçe alanı (m²)')}${field('inner','Çiçeklik alanı (m²)')}</div>${select('op','Kalan alan için işlem seç',['Alanları topla','Büyük alandan küçük alanı çıkar','Alanları çarp'])}${field('remain','Çim alanı (m²)')}`;
 }else if(k==='rad_collect'){
  h=`<div class="v50-hero">${m.left}√${m.rad} ${m.op} ${m.right}√${m.rad}</div>${select('rule','İşlem mantığı',['Kök içleri aynıysa katsayılar toplanır / çıkarılır','Kök içleri birbirleriyle toplanır / çıkarılır','Sonuç için kökler her zaman çarpılır'])}<div class="v50-two">${field('coef','Sonucun katsayısı','Örn. 5')}${field('rad','Sonucun kök içi','Örn. 3')}</div><div class="v50-result">Eş köklü terimleri, eş değişkenli terimler gibi düşün.</div>`;
 }else if(k==='rad_partner'){
  const opts=Array.from(new Set([m.partner,m.partner*2,m.partner*m.partner,1])).sort((a,b)=>a-b);
  h=`<div class="v50-hero">√${m.n} × √□ = tam sayı</div>${select('partner','En küçük k değerini seç',opts)}${field('product','Çarpımın sonucu','Pozitif tam sayı')}<div class="v50-result" id="v50Live">Tam kare çarpanlara ayır; eksik çarpanı tamamla.</div>`;
 }else if(k==='rad_decimal'){
  h=`<div class="v50-hero">√(${m.rad})</div><p>Önce sayıyı <strong>${m.square_numerator}/10000</strong> kesrine dönüştür.</p><div class="v50-two">${field('numer','Payın karekökü','Örn. 12')}${field('root','Ondalık sonuç','Örn. 0,12')}</div>${select('rule','Doğru gerekçe',['√10000=100 olduğu için kesir kökü alınabilir','Karekök alınırken virgül her zaman bir basamak kayar','Karekök almak sayıyı ikiyle çarpmaktır'])}`;
 }
 $('atlas50Title').textContent=task.baslik;$('atlas50Subtitle').textContent=`${task.ogrenme_ciktisi} · ${task.mekanik}`;
 $('atlas50Stage').innerHTML=h;
 $('atlas50Stage').querySelectorAll('input,select').forEach(el=>el.addEventListener('input',update));
 root.querySelector('#v50Copy')?.addEventListener('click',()=>{state.copied=!state.copied;const b=$('v50Copy');b.setAttribute('aria-pressed',String(state.copied));b.textContent=state.copied?'✓ İkinci eş yamuk eklendi':'＋ Eş yamuk kopyasını yerleştir';$('v50Figure').innerHTML=trapezoidSVG(m,state.copied);update()});
 update();say('Görevi önce model üzerinde kur, ardından doğrula.');
}
function update(){if(!m)return;
 if(m.kind==='dec_fraction'){const x=[get('d0'),get('d1'),get('d2')].map(v=>v===''?'?':v);$('v50Live').textContent=`${m.integer} + ${x[0]}/10 + ${x[1]}/100 + ${x[2]}/1000`}
 if(m.kind==='dec_line'){const v=Number(get('slider')||0);$('v50Marker').style.left=(v/10)+'%';$('v50Live').textContent='İşaretlenen konum: '+m.base+','+String(v).padStart(3,'0')}
 if(m.kind==='sector_slider'){const a=Number(get('angle')||0);$('v50Figure').innerHTML=sectorSVG(a);$('v50AngleOut').textContent=a+'°';$('v50Live').textContent=a+'° / 360° = '+fmt(a/360)+' daire'}
 if(m.kind==='trapezoid_copies'){$('v50Live').textContent=state.copied?`İki yamuk = tabanı ${m.a+m.b}, yüksekliği ${m.h} olan paralelkenar.`:'İkinci eş yamuk kopyasını ekleyerek bağıntıyı keşfet.'}
 if(m.kind==='rad_partner'&&get('partner')){$('v50Live').textContent=`√${m.n} × √${get('partner')} = √${m.n*Number(get('partner'))}`}
}
function check(){if(!task||!m)return;const k=m.kind;let ok=false;
 if(k==='dec_fraction')ok=m.digits.every((d,i)=>get('d'+i)!==''&&num(get('d'+i))===d)&&get('rule')==='Sıfırın bulunduğu basamağın değeri sıfırdır, konumu korunur';
 if(k==='dec_line')ok=num(get('slider'))===m.offset&&get('interval')===`${m.base},${m.tenth}–${m.base},${m.tenth+1}`;
 if(k==='dec_fix')ok=num(get('hundred'))===m.digits[1]&&num(get('thousand'))===m.digits[2]&&equal(num(get('correct')),num(m.target))&&get('rule')==='Yüzde birler ile binde birler basamaklarını karıştırdı';
 if(k==='sector_slider')ok=num(get('angle'))===m.angle&&equal(num(get('numer'))/num(get('denom')),m.angle/360)&&num(get('denom'))>0&&equal(num(get('area')),m.coeff);
 if(k==='trapezoid_copies')ok=state.copied===true&&equal(num(get('double')),m.double)&&equal(num(get('area')),m.area)&&get('rule')==='(a+b)×h/2';
 if(k==='composite_area')ok=equal(num(get('outer')),m.outer)&&equal(num(get('inner')),m.inner)&&get('op')==='Büyük alandan küçük alanı çıkar'&&equal(num(get('remain')),m.remaining);
 if(k==='rad_collect')ok=get('rule')==='Kök içleri aynıysa katsayılar toplanır / çıkarılır'&&equal(num(get('coef')),m.coeff)&&equal(num(get('rad')),m.rad);
 if(k==='rad_partner')ok=equal(num(get('partner')),m.partner)&&equal(num(get('product')),m.product);
 if(k==='rad_decimal')ok=equal(num(get('numer')),m.root_numerator)&&equal(num(get('root')),num(m.answer))&&get('rule')==='√10000=100 olduğu için kesir kökü alınabilir';
 if(!ok){window.Atlas616Trace?.wrong(task,'v5.0 keşif laboratuvarı');say('Henüz doğrulanmadı. Seçimlerini ve ara işlemlerini yeniden kontrol et; yanlış sonuç kaydedilmedi.',true);return}
 window.__atlas50Verified=task.id;$('answer').value='1';$('check').click();window.__atlas50Verified=null;
 say('✓ Model doğrulandı; görev ilerlemesi kaydedildi. Gerekçeni sözlü olarak da açıklayabilirsin.');
}
$('atlas50Check').addEventListener('click',check);
$('atlas50Hint').addEventListener('click',()=>task&&say('💡 '+task.ipucu));
$('atlas50Reset').addEventListener('click',()=>task&&render(task));
function render(t){task=t||null;root.hidden=!task;if(!task){$('atlas50Stage').replaceChildren();return;}m=task.atlas50;state={};paint()}
document.addEventListener('atlas:taskrender',e=>render(tasks.get(String(e.detail?.id||''))));
})();
