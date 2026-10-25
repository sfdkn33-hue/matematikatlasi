/* v3.4: independent upper-grade PILOT visual choice layer. Never reuses or rewrites existing task IDs. */
(()=>{
'use strict';
const by=id=>document.getElementById(id);
const shell=by('atlasUpperPilot'),scene=by('atlasUpperScene'),options=by('atlasUpperOptions'),out=by('atlasUpperResult');
if(!shell||!window.ATLAS_DB)return;
const tasks=new Map(window.ATLAS_DB.tasks.filter(t=>t.pilot_ui).map(t=>[String(t.id),t]));
function esc(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
function makeScene(t){const grade=Number(t.sinif),i=Number(t.gorev_no),v=t.pilot_ui.scene;
 if(grade===7){const labels=['−6','−5','−4','−3','−2','−1','0','1','2','3'];const marker=i===1?3:i===2?0:5;
 return '<svg viewBox="0 0 600 155" role="img" aria-label="Eksi altıdan artı üçe sayı doğrusu">'+
 '<path d="M30 72H568" stroke="#3382b4" stroke-width="4" stroke-linecap="round"/><path d="M567 72l-12 -8v16z" fill="#3382b4"/>'+labels.map((x,j)=>`<path d="M${48+j*54} 61v22" stroke="#4b7187" stroke-width="2"/><text x="${48+j*54}" y="105" text-anchor="middle" fill="#23516a" font-size="19">${x}</text>`).join('')+`<circle cx="${48+marker*54}" cy="72" r="10" fill="#f29b54"/>`+'</svg>'}
 if(grade===8){return '<svg viewBox="0 0 550 130" role="img" aria-label="Çarpanlar, katlar ve üslü ifadeler oyun kartları"><g font-size="40" text-anchor="middle" font-weight="800"><text x="110" y="78" fill="#3684bc">24</text><text x="275" y="78" fill="#e88859">∩</text><text x="440" y="78" fill="#3e947b">36</text></g></svg>'}
 if(grade===9){return '<svg viewBox="0 0 550 120" role="img" aria-label="Üs ve kök işlemlerinin sayı kuleleri"><g fill="#3277ac" font-size="42" font-weight="700" text-anchor="middle"><text x="140" y="77">2³</text><text x="270" y="77">×</text><text x="390" y="77">2⁴</text></g></svg>'}
 if(grade===10){return '<svg viewBox="0 0 560 210" role="img" aria-label="Karşı kenarı 3, komşu kenarı 4, hipotenüsü 5 olan dik üçgen"><path d="M115 169L435 169L115 39Z" fill="#d9edfe" stroke="#317db1" stroke-width="4"/><path d="M115 147h23v22" fill="none" stroke="#327b60" stroke-width="3"/><g fill="#183d57" font-size="22" font-weight="700"><text x="85" y="105">3</text><text x="260" y="195">4</text><text x="300" y="92">5</text><text x="446" y="165">A</text></g></svg>'}
 if(grade===11){const ys=(i===2?[8,6,4,2]:[2,4,6,8]);return '<svg viewBox="0 0 560 190" role="img" aria-label="İki nicel değişkenin serpme diyagramı"><path d="M65 12V155H530" fill="none" stroke="#2c6689" stroke-width="4"/><g fill="#f39c63">'+ys.map((z,j)=>`<circle cx="${120+j*110}" cy="${158-z*15}" r="11"/>`).join('')+'</g><g fill="#285b79" font-size="17"><text x="514" y="181">x</text><text x="42" y="20">y</text></g></svg>'}
 return '<svg viewBox="0 0 550 155" role="img" aria-label="Üstel ve logaritmik fonksiyonlar sayısal ilişki"><g font-size="48" text-anchor="middle" font-weight="800"><text x="164" y="93" fill="#3877af">2ˣ</text><text x="285" y="93" fill="#718291">=</text><text x="407" y="93" fill="#3e9a7d">16</text></g></svg>';
}
function currentDone(id){try{return Boolean(JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')[id])}catch{return false}}
function render(detail){const t=tasks.get(String(detail.id||''));shell.hidden=!t;
 if(!t){options.textContent='';scene.textContent='';out.textContent='';return}
 by('atlasUpperBadge').textContent=t.sinif+'. SINIF · '+(t.curriculum_version==='MEB-2018'?'2018 ÖĞRETİM PROGRAMI':'MAARİF MODELİ')+' · PİLOT GÖREV';
 scene.innerHTML=makeScene(t);options.textContent='';
 const done=currentDone(t.id);out.textContent=done?'✓ Daha önce doğru tamamladın. İstersen yeniden dene.':'Doğru seçeneği bul; seçimini hemen kontrol edelim.';
 t.pilot_ui.options.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.textContent=s;b.dataset.answer=s;
 b.onclick=()=>{if(currentDone(t.id)){out.textContent='✓ Bu görev zaten tamamlanmış.';return}
 if(s===t.beklenen_yanit_veya_rubrik){
  b.classList.add('is-correct');out.textContent='✓ Doğru! '+t.ipucu;
  by('answer').value=s;by('check').click();
 }else{b.classList.add('is-incorrect');out.textContent='Henüz olmadı. Başka bir seçeneği deneyebilirsin.';}
 };options.appendChild(b)});
 by('atlasUpperHint').onclick=()=>{out.textContent='💡 '+t.ipucu};
}
document.addEventListener('atlas:taskrender',e=>render(e.detail||{}));
})();
