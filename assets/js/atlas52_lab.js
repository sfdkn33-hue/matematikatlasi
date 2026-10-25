/* Matematik Atlası v5.2 — bağımsız olasılık ve çizgi grafiği modelleri */
(()=>{'use strict';
const root=document.getElementById('atlas52Lab'),db=window.ATLAS_DB;if(!root||!db)return;
const $=id=>root.querySelector('#'+id);
const tasks=new Map(db.tasks.filter(x=>x.atlas52).map(x=>[String(x.id),x]));
const esc=x=>String(x??'').replace(/[&<>"']/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[k]));
const math=s=>{let v=String(s??'').trim().replace('−','-').replace(',','.');let m=v.match(/^\s*(-?\d+)\s*\/\s*(\d+)\s*$/);if(m&&Number(m[2])>0)return Number(m[1])/Number(m[2]);return /^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(v)?Number(v):NaN};
const close=(x,y)=>Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x-y)<0.001;
const input=(id,label,placeholder='Yanıt')=>`<label class="v52-field">${esc(label)}<input id="v52-${id}" type="text" placeholder="${esc(placeholder)}" inputmode="decimal" autocomplete="off" /></label>`;
const select=(id,label,values)=>`<label class="v52-field">${esc(label)}<select id="v52-${id}"><option value="">Seç…</option>${values.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select></label>`;
const val=k=>($('v52-'+k)?.value||'').trim();
const COLORS=['#b45034','#276caa','#21866c'];
const balls=(counts)=>{let balls=[];counts.forEach((n,i)=>{for(let j=0;j<n;j++)balls.push(`<span class="v52-ball" style="--ball:${COLORS[i]}" title="${['Kırmızı','Mavi','Yeşil'][i]} bilye" aria-label="${['Kırmızı','Mavi','Yeşil'][i]} bilye"></span>`)});return `<div class="v52-urn" role="img" aria-label="${counts.map((c,i)=>`${c} ${['kırmızı','mavi','yeşil'][i]}`).join(', ')} bilye">${balls.join('')}</div><div class="v52-key">${counts.map((x,i)=>`<span><i style="--ball:${COLORS[i]}"></i>${['Kırmızı','Mavi','Yeşil'][i]}: <b>${x}</b></span>`).join('')}</div>`};
function wheel(n){let svg='<svg class="v52-wheel" viewBox="0 0 250 250" role="img" aria-label="'+n+' eşit dilimli adil olasılık çarkı">';let cx=125,cy=125,r=100;
 for(let i=0;i<n;i++){const a=(i/n*2-0.5)*Math.PI,b=((i+1)/n*2-0.5)*Math.PI;let x1=cx+r*Math.cos(a),y1=cy+r*Math.sin(a),x2=cx+r*Math.cos(b),y2=cy+r*Math.sin(b);svg+=`<path d="M ${cx} ${cy} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${1/n>0.5?1:0} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z" fill="${['#badff0','#e7cda2','#b6dcd0','#e6c3be'][i%4]}" stroke="#234b62" stroke-width="1.8"/>`}
 return svg+'<circle cx="125" cy="125" r="5" fill="#173d58"/></svg>'}
function lineChart(touches,target){const v=touches||[0,0,0,0],actual=target||[0,0,0,0];let pts=v.map((n,i)=>[45+i*80,190-n*10]);let grid=[];
 for(let n=0;n<=16;n+=4)grid.push(`<line x1="35" x2="307" y1="${190-n*10}" y2="${190-n*10}" stroke="#c3d8e5"/><text x="27" y="${194-n*10}" text-anchor="end" fill="#244761" font-size="11">${n}</text>`);
 return `<svg class="v52-line" viewBox="0 0 330 225" role="img" aria-label="Dört haftalık çizgi grafiği; seçtiğin değerler ${v.join(', ')}">${grid.join('')}<polyline fill="none" stroke="#0b678b" stroke-width="3" points="${pts.map(p=>p.join(',')).join(' ')}"/>${pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="#ec9139" stroke="#173d58" stroke-width="2"/><text x="${p[0]}" y="215" text-anchor="middle" fill="#244761" font-size="13">${i+1}. hafta</text>`).join('')}</svg>`}
let current=null,model=null;
function status(msg,bad=false){const el=$('v52-status');el.textContent=msg;el.dataset.error=String(bad)}
function render(t){current=t||null;root.hidden=!current;if(!current){$('v52-stage').replaceChildren();return}
 model=current.atlas52;let m=model,h='';
 if(m.kind==='sample_space')h=balls(m.counts)+`<p>Tek çekiliş için her bilye ayrı olası durumdur. Farklı renk sayısı ise başka bir bilgidir.</p><div class="v52-fields">${input('total','Olası tekil durum sayısı')}${select('distinct','Kaç farklı renk çıkabilir?', [1,2,3])}</div>`;
 if(m.kind==='likelihood_compare')h=balls([m.a,m.b,0])+`<p>Bu torbadan <b>kırmızı</b> çekme olasılığını <b>mavi</b> ile karşılaştır.</p>${select('relation','Kırmızı çıkma şansı',['daha az','eşit','daha fazla'])}${select('evidence','Kararının gerekçesi',['Aynı torbada hangi renk daha çoksa o rengin çıkma şansı yüksektir.','İki rengin şansı her zaman eşittir.','Sadece torbanın büyüklüğü şansı belirler.'])}`;
 if(m.kind==='equal_chance')h=`<p>${m.n} eş dilimli adil çark</p>${wheel(m.n)}<div class="v52-fields">${input('numerator','Bir dilimin olasılığı: pay','Örn. 1')}${input('denominator','Bir dilimin olasılığı: payda','Örn. 6')}${input('angle','Tek dilimin merkez açısı (°)')}</div>${select('evidence','Neden bu hesap geçerli?',['Bütün dilimler eşit genişliktedir.','Çarkta her dilimin açısı farklıdır.'])}`;
 if(m.kind==='probability_bounds')h=`<div class="v52-emphasis">P(A) = ${esc(m.shown)}</div><p>Bu olasılık değeri geçerli mi? Geçerliyse olayın olmama olasılığını da hesapla.</p>${select('valid','Olasılık değeri geçerli mi?',['Evet','Hayır'])}${select('interpretation','Hangi durum?', ['imkânsız','kesin','mümkün','geçersiz'])}${m.valid?input('complement','P(A olmaması) — kesir veya ondalık','Örn. 3/4'): '<p class="v52-tip">Geçersiz bir olasılık değeri için karşıt olasılık hesaplanmaz.</p>'}`;
 if(m.kind==='simple_event')h=balls(m.counts)+`<p>Tek çekilişte <strong>${esc(m.labels[m.focus])}</strong> bilye gelme olasılığını oluşturup sadeleştir.</p><div class="v52-fields">${input('favorable','Uygun durum sayısı')}${input('total','Tüm durum sayısı')}${input('numerator','Sadeleştirilmiş pay')}${input('denominator','Sadeleştirilmiş payda')}</div>${select('reason','Gerekçe',['Uygun durum sayısı / bütün olası durum sayısı','Bütün olası durum sayısı / uygun durum sayısı'])}`;
 if(m.kind==='line_graph')h=`<p>Dört haftanın değerleri: <strong>${m.values.join(' · ')}</strong>. Kaydırıcılarla her haftanın noktasını grafikte doğru yüksekliğe taşı.</p><div class="v52-chart" id="v52-chart">${lineChart([0,0,0,0],m.values)}</div><div class="v52-sliders">${m.values.map((x,i)=>`<label>${i+1}. hafta — <b id="v52-read-${i}">0</b><input type="range" min="0" max="16" step="1" value="0" id="v52-point-${i}" aria-label="${i+1}. haftanın grafik noktası"/></label>`).join('')}</div><div class="v52-fields">${input('difference','En büyük ve en küçük değer farkı')}${select('trend','Genel değişim',['artan','azalan','dalgalı'])}</div>`;
 $('v52-title').textContent=current.baslik;$('v52-subtitle').textContent=current.ogrenme_ciktisi+' · '+current.mekanik;
 $('v52-stage').innerHTML=h;
 if(m.kind==='line_graph'){for(let i=0;i<4;i++)$('v52-point-'+i).addEventListener('input',()=>{let pts=m.values.map((_,j)=>Number($('v52-point-'+j).value));for(let j=0;j<4;j++)$('v52-read-'+j).textContent=pts[j];$('v52-chart').innerHTML=lineChart(pts,m.values)})}
 status('Görsel modeli incele. Ara basamakları tamamla ve çözümü doğrula.');
}
function check(){if(!current)return;let m=model,valid=false;
 if(m.kind==='sample_space')valid=close(math(val('total')),m.total)&&val('distinct')===String(m.distinct);
 if(m.kind==='likelihood_compare')valid=val('relation')===m.relation&&val('evidence')==='Aynı torbada hangi renk daha çoksa o rengin çıkma şansı yüksektir.';
 if(m.kind==='equal_chance')valid=close(math(val('numerator')),1)&&close(math(val('denominator')),m.n)&&close(math(val('angle')),m.angle)&&val('evidence')==='Bütün dilimler eşit genişliktedir.';
 if(m.kind==='probability_bounds')valid=val('valid')===(m.valid?'Evet':'Hayır')&&val('interpretation')===m.interpretation&&(!m.valid||close(math(val('complement')),m.complement));
 if(m.kind==='simple_event')valid=close(math(val('favorable')),m.favorable)&&close(math(val('total')),m.total)&&close(math(val('numerator')),m.fraction[0])&&close(math(val('denominator')),m.fraction[1])&&val('reason')==='Uygun durum sayısı / bütün olası durum sayısı';
 if(m.kind==='line_graph')valid=m.values.every((x,i)=>Number($('v52-point-'+i)?.value)===x)&&close(math(val('difference')),m.difference)&&val('trend')===m.trend;
 if(!valid){window.Atlas616Trace?.wrong(current,'v5.2 olasılık ve grafik');status('Bu model henüz doğru değil. Görseli ve ara değerleri yeniden incele; ilerleme kaydedilmedi.',true);return}
 window.__atlas52Verified=current.id;
 try{const field=document.getElementById('answer'),button=document.getElementById('check');field.value='1';button.click()}
 finally{window.__atlas52Verified=null}
 status('✓ Doğru model! Sonucu nasıl gerekçelendirdiğini de kendin paylaş.');
}
$('v52-check').addEventListener('click',check);
$('v52-hint').addEventListener('click',()=>current&&status('💡 '+current.ipucu));
$('v52-reset').addEventListener('click',()=>current&&render(current));
document.addEventListener('atlas:taskrender',e=>render(tasks.get(String(e.detail?.id||''))));
})();
