/* Matematik Atlası v5.1 — geliştirilmiş ondalık, dokunmatik geometri, veri laboratuvarı */
(()=>{'use strict';
const root=document.getElementById('atlas51Lab'),db=window.ATLAS_DB;if(!root||!db)return;
const $=id=>root.querySelector('#'+id);
const map=new Map(db.tasks.filter(t=>t.atlas51).map(t=>[String(t.id),t]));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const n=s=>{const q=String(s??'').trim().replace(',','.');return /^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(q)?Number(q):NaN};
const eql=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-8;
const f=v=>String(v).replace('.',',');
let task=null,m=null,placed=false;
const placeNames=['Yüzler','Onlar','Birler','Onda birler','Yüzde birler','Binde birler'];
const input=(id,label,placeholder='Yanıtını yaz')=>`<label class="v51-field">${esc(label)}<input id="v51-${id}" type="text" inputmode="decimal" placeholder="${esc(placeholder)}" autocomplete="off"></label>`;
const select=(id,label,values)=>`<label class="v51-field">${esc(label)}<select id="v51-${id}"><option value="">Seçiniz…</option>${values.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select></label>`;
const val=k=>($('v51-'+k)?.value||'').trim();
const status=(s,bad=false)=>{const x=$('v51-status');x.textContent=s;x.dataset.error=String(bad)};
function digits(data){return `<div class="v51-places">${placeNames.map((label,i)=>select('d'+i,label,[0,1,2,3,4,5,6,7,8,9])).join('')}</div>`}
function chart(values,labels){let max=Math.max(1,...values.flat());let out=`<svg class="v51-chart" viewBox="0 0 370 242" role="img" aria-label="${esc(labels.map((label,i)=>label+': '+values[i].join(', ')).join('; '))}">`;
 for(let i=0;i<values.length;i++){
   out+=`<text x="8" y="${31+i*72}" fill="#173c56" font-size="13" font-weight="700">${esc(labels[i])}</text>`;
   for(let j=0;j<values[i].length;j++){
    let height=Math.max(6,Math.round(values[i][j]/max*43)),x=51+j*76,y=24+i*72+43-height;
    out+=`<rect x="${x}" y="${y}" width="43" height="${height}" rx="3" fill="${['#116a88','#a05d17','#286e51'][i]}"/><text x="${x+21}" y="${y-4}" font-size="12" fill="#132f45" text-anchor="middle" font-weight="700">${values[i][j]}</text>`;
    if(i===2)out+=`<text x="${x+21}" y="238" font-size="11" fill="#27465c" text-anchor="middle">${['I','II','III','IV'][j]}</text>`;
   }
 }
 out+='</svg>';return out;
}
function smallChart(data){let mx=Math.max(...data);return `<svg class="v51-chart" viewBox="0 0 320 175" role="img" aria-label="A: ${data[0]}, B: ${data[1]}, C: ${data[2]}">${data.map((v,i)=>{let h=v/mx*107;return `<rect x="${46+i*95}" y="${129-h}" width="56" height="${h}" rx="4" fill="${['#116a88','#a05d17','#286e51'][i]}"/><text x="${74+i*95}" y="${124-h}" text-anchor="middle" fill="#17364e" font-size="16" font-weight="700">${v}</text><text x="${74+i*95}" y="152" text-anchor="middle" fill="#17364e" font-size="15">${'ABC'[i]}</text>`}).join('')}</svg>`}
function geom(shape,complete=false){if(shape==='trapezoid')return `<svg viewBox="0 0 350 150" role="img" aria-label="${complete?'İki yamuk birleşmiş paralelkenar':'Yalnız bir yamuk çizilmiş; ikinci parça eksik'}"><path d="M75 20 H178 L228 115 H25 Z" fill="#a4ddcb" stroke="#13656d" stroke-width="3"/>${complete?'<path d="M228 115 H325 L276 20 H178 Z" fill="#ffd996" stroke="#a36514" stroke-width="3"/>':'<path d="M228 115 H325 L276 20 H178 Z" fill="none" stroke="#a36514" stroke-width="3" stroke-dasharray="7 5"/>'}<text x="176" y="140" fill="#203d50" font-size="12">${complete?'Birleşik paralelkenar':'Eş yamuğu buraya taşı'}</text></svg>`;
 return `<svg viewBox="0 0 350 150" role="img" aria-label="${complete?'Dikdörtgen içinde eşkenar dörtgen modeli':'Alanı tamamlanmamış eşkenar dörtgen modeli'}"><rect x="40" y="15" width="270" height="120" fill="#eef8ff" stroke="#396b83" stroke-width="3"/>${complete?'<path d="M175 15 L310 75 L175 135 L40 75 Z" fill="#a4ddcb" stroke="#13656d" stroke-width="3"/>':'<path d="M175 15 L310 75 L175 135 L40 75 Z" fill="none" stroke="#a36514" stroke-dasharray="7 5" stroke-width="3"/>'}<path d="M175 15 V135 M40 75 H310" stroke="#467c93" stroke-dasharray="5 4" fill="none"/></svg>`;
}
function paint(){if(!task)return;const k=m.kind;let h='';
 if(k==='decimal_place')h=`<div class="v51-number">${esc(m.value)}</div><p>Her rakamı doğru basamağa yerleştir; sıfırları atlama.</p>${digits(m)}${select('reason','Sıfır rakamının basamak görevi',['Basamağın yeri korunur, o basamağın değeri sıfırdır.','Sıfırlar silinirse her zaman sayı değişmez.','Sıfırlar yalnızca son rakam olduğunda dikkate alınır.'])}`;
 if(k==='decimal_fraction')h=`<div class="v51-number">${esc(m.value)}</div><p>Tam kısmı ve kesir paylarını kendin oluştur.</p><div class="v51-grid">${input('whole','Tam kısım','Örn. 104')}${input('tenth','Onda birlerin payı')}${input('hundred','Yüzde birlerin payı')}${input('thousand','Binde birlerin payı')}</div><div class="v51-help">Gösterim: <strong id="v51-live">? + ?/10 + ?/100 + ?/1000</strong></div>`;
 if(k==='decimal_compare')h=`<div class="v51-numbers"><span>A = ${esc(m.left)}</span><span>B = ${esc(m.right)}</span></div><p>İlk farklı basamağı bulmak için yüzlerden binde birlere doğru incele.</p>${select('sign','A ile B arasındaki ilişki',['<','=','>'])}${select('focus','İlk farklı basamak',placeNames)}`;
 if(k==='decimal_error')h=`<div class="v51-numbers"><span>Gerçek: ${esc(m.value)}</span><span>Yanlış: ${esc(m.wrong)}</span></div><p>Yanlış çözümlemede kesir basamakları karıştı. Üç kesir payını yeniden düzenle.</p><div class="v51-grid">${select('ten','Onda birlerin payı',[0,1,2,3,4,5,6,7,8,9])}${select('hundred','Yüzde birlerin payı',[0,1,2,3,4,5,6,7,8,9])}${select('thousand','Binde birlerin payı',[0,1,2,3,4,5,6,7,8,9])}</div>${input('fixed','Düzeltilmiş ondalık sayı','Örn. 104,056')}`;
 if(k==='geom_drag')h=`<div class="v51-geom" id="v51-geom">${geom(m.shape,false)}</div><div class="v51-drop-layout"><button type="button" id="v51-piece" class="v51-piece" aria-label="Eş şekil parçası, hedefe sürükle">↗ Eş parça<br><small>Buradan sürükle</small></button><div id="v51-target" class="v51-target" aria-label="Parçayı yerleştirme alanı">⬚ Parça yerleştirme alanı</div></div><button id="v51-keyboard" class="v51-assist" type="button">⌨️ Dokunarak / klavyeyle yerleştir</button><div class="v51-help" id="v51-state" role="status">Parça henüz yerine yerleştirilmedi.</div>${input('full',m.shape==='trapezoid'?'Paralelkenarın toplam alanı':'Çevreleyen dikdörtgenin alanı')}${input('single',m.shape==='trapezoid'?'Tek yamuğun alanı':'Eşkenar dörtgenin alanı')}${select('reason','Modelden hangi bağıntı çıkar?',[m.rule,m.shape==='trapezoid'?'Bir yamuğun alanı iki paralelkenarın alanı kadardır.':'Eşkenar dörtgenin alanı daima dikdörtgenin alanına eşittir.','Şeklin alanını bulmak için yalnız çevresi yeterlidir.'])}`;
 if(k==='number_class')h=`<div class="v51-numbers"><span>A = ${esc(m.a)}</span><span>B = ${esc(m.b)}</span></div>${select('rational','Rasyonel ifade hangisi?',['A','B'])}${select('irrational','İrrasyonel ifade hangisi?',['A','B'])}${select('reason','Matematiksel gerekçe',[m.principle,'Her karekök irrasyoneldir.','Sonlu ondalık sayılar irrasyoneldir.'])}`;
 if(k==='graph_compare')h=`<p>A, B ve C gruplarının dört dönemlik karşılaştırması. Sayılar sütunların üstünde yazılıdır.</p><div class="v51-chart-box">${chart(m.values,m.labels)}</div><details><summary>Erişilebilir veri tablosu</summary><table class="v51-table"><thead><tr><th>Grup</th><th>I</th><th>II</th><th>III</th><th>IV</th></tr></thead><tbody>${m.values.map((a,i)=>`<tr><th>${m.labels[i]}</th>${a.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></details>${select('winner','Dört dönem toplamı en yüksek grup',['A','B','C'])}${input('gap','En yüksek iki grubun toplam farkı','Sayı')}`;
 if(k==='graph_convert')h=`<p>Grup büyüklükleri A, B ve C olarak gösterilmiş. Toplam <strong>${m.total}</strong> kişidir.</p><div class="v51-chart-box">${smallChart(m.values)}</div><p><strong>${m.focus} grubunun</strong> payını hem yüzde hem daire grafiği açısı olarak hesapla.</p>${input('percent','Yüzdelik payı (%)','Örn. 25')}${input('angle','Daire dilimindeki merkez açı (°)','Örn. 90')}<div id="v51-live" class="v51-help">Sütun grafiğinden daire grafiğine: oran × 360°.</div>`;
 $('v51-title').textContent=task.baslik;$('v51-subtitle').textContent=task.ogrenme_ciktisi+' · '+task.mekanik;
 $('v51-stage').innerHTML=h;
 if(k==='decimal_fraction')$('v51-stage').querySelectorAll('input').forEach(el=>el.addEventListener('input',()=>{$('v51-live').textContent=[val('whole')||'?',(val('tenth')||'?')+'/10',(val('hundred')||'?')+'/100',(val('thousand')||'?')+'/1000'].join(' + ')}));
 if(k==='geom_drag')setupDrag();
 status('Modeli kur, ara basamakları tamamla, ardından doğrula.');
}
function setupDrag(){let tile=$('v51-piece'),zone=$('v51-target'),p0=null;
 const mark=()=>{placed=true;tile.style.transform='';tile.setAttribute('aria-pressed','true');tile.textContent='✓ Parça yerleşti';zone.classList.add('v51-success');zone.textContent='✓ Parça tamamlandı';$('v51-geom').innerHTML=geom(m.shape,true);$('v51-state').textContent='Şekli tamamladın; şimdi alan bağıntısını kur.';};
 tile.addEventListener('pointerdown',e=>{if(placed)return;p0={x:e.clientX,y:e.clientY};tile.setPointerCapture(e.pointerId);tile.classList.add('v51-dragging');e.preventDefault()});
 tile.addEventListener('pointermove',e=>{if(!p0||placed)return;tile.style.transform=`translate(${e.clientX-p0.x}px, ${e.clientY-p0.y}px)`});
 tile.addEventListener('pointerup',e=>{if(!p0)return;let r=zone.getBoundingClientRect();let ok=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;tile.style.transform='';tile.classList.remove('v51-dragging');p0=null;if(ok)mark();else status('Parçayı kesikli hedef alana bırak. Klavye/dokunma düğmesini de kullanabilirsin.',true)});
 tile.addEventListener('pointercancel',()=>{tile.style.transform='';tile.classList.remove('v51-dragging');p0=null});
 $('v51-keyboard').addEventListener('click',mark);
}
function check(){if(!task)return;let k=m.kind,ok=false,which='';
 if(k==='decimal_place')ok=m.digits.every((d,i)=>val('d'+i)!==''&&n(val('d'+i))===d)&&val('reason')==='Basamağın yeri korunur, o basamağın değeri sıfırdır.';
 if(k==='decimal_fraction')ok=eql(n(val('whole')),m.whole)&&['tenth','hundred','thousand'].every((k,i)=>val(k)!==''&&n(val(k))===m.fractions[i]);
 if(k==='decimal_compare')ok=val('sign')===m.sign&&val('focus')===placeNames[m.firstDifference];
 if(k==='decimal_error')ok=['ten','hundred','thousand'].every((k,i)=>val(k)!==''&&n(val(k))===m.fractions[i])&&eql(n(val('fixed')),n(m.value));
 if(k==='geom_drag')ok=placed&&eql(n(val('full')),m.full)&&eql(n(val('single')),m.single)&&val('reason')===m.rule;
 if(k==='number_class')ok=val('rational')===m.rational&&val('irrational')===m.irrational&&val('reason')===m.principle;
 if(k==='graph_compare')ok=val('winner')===m.winner&&eql(n(val('gap')),m.gap);
 if(k==='graph_convert')ok=eql(n(val('percent')),m.percent)&&eql(n(val('angle')),m.angle);
 if(!ok){window.Atlas616Trace?.wrong(task,'v5.1 model laboratuvarı');status('Henüz doğrulanmadı. Model, ara değerler ve gerekçeyi yeniden kontrol et; ilerleme kaydedilmedi.',true);return}
 window.__atlas51Verified=task.id;
 const field=document.getElementById('answer'),button=document.getElementById('check');field.value='1';button.click();window.__atlas51Verified=null;
 status('✓ Model doğrulandı. Matematiksel gerekçeni kendin de paylaşabilirsin.');
}
function render(t){task=t||null;root.hidden=!task;if(!task){$('v51-stage').replaceChildren();return}m=task.atlas51;placed=false;paint()}
$('v51-check').addEventListener('click',check);
$('v51-hint').addEventListener('click',()=>task&&status('💡 '+task.ipucu));
$('v51-reset').addEventListener('click',()=>task&&render(task));
document.addEventListener('atlas:taskrender',e=>render(map.get(String(e.detail?.id||''))));
})();
