/* Matematik Atlası v6.21 — privacy-minimized, OFFLINE class evidence pilot.
   Every student explicitly downloads a pseudonymous aggregate report. A teacher
   manually imports the files. No account verification / network / grading.
   Never merges these into mathAtlas940Done or mathAtlas64Attempts. */
(()=>{'use strict';
 const db=window.ATLAS_DB,host=document.querySelector('.teacher-wrap');if(!db||!host)return;
 const KEY='mathAtlas621ClassSnapshots',FORMAT='atlas-v621-learning-summary',VALID_GRADES=[5,6,7,8];
 const outcomeMeta=new Map(db.outcomes.map(o=>[String(o.kod),o]));
 const totals=new Map();for(const t of db.tasks){const k=String(t.ogrenme_ciktisi);totals.set(k,(totals.get(k)||0)+1)}
 const el=(tag,parent,value,cl)=>{const e=document.createElement(tag);if(cl)e.className=cl;if(value!=null)e.textContent=String(value);parent?.appendChild(e);return e};
 const read=()=>{try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a.filter(x=>x&&x.format===FORMAT):[]}catch{return []}};
 let items=read();
 let activeGrade='all';
 function validate(raw){
  if(!raw||raw.format!==FORMAT||raw.schema!==1||raw.windowDays!==30)throw Error('Atlas v6.21 öğrenme özeti değil.');
  if(typeof raw.code!=='string'||!/^[A-Za-z0-9_-]{2,20}$/.test(raw.code))throw Error('Öğrenci kodu geçersiz.');
  if(!VALID_GRADES.includes(raw.grade))throw Error('Sınıf bilgisi geçersiz.');
  const instant=Date.parse(raw.generatedAt);if(!Number.isFinite(instant)||instant>Date.now()+10*60000||instant<Date.now()-365*86400000)throw Error('Dosya tarihi uygun değil.');
  if(!Array.isArray(raw.outcomes)||raw.outcomes.length>140)throw Error('Çıktı sayısı geçersiz.');
  const expected=db.outcomes.filter(o=>Number(o.sinif)===raw.grade),used=new Set();
  if(raw.outcomes.length!==expected.length)throw Error('Öğrenme çıktısı kapsamı eksik ya da eski.');
  const outcomes=[];
  for(const r of raw.outcomes){
   const code=String(r.code||''),o=outcomeMeta.get(code),n=totals.get(code);
   if(!o||Number(o.sinif)!==raw.grade||used.has(code)||r.total!==n)throw Error('Görev kimlikleri/sayıları sürümle uyuşmuyor.');
   used.add(code);
   for(const field of ['done','wrong','hint','correct','wrongTasks','observedTasks']){
    if(!Number.isSafeInteger(r[field])||r[field]<0||r[field]>(['done','wrongTasks','observedTasks'].includes(field)?n:10000))throw Error('Ölçüm sayısı geçersiz: '+field);
   }
   if(r.wrongTasks>r.observedTasks||r.wrongTasks>r.wrong)throw Error('Hata olayları tutarsız.');
   const focus=r.focus;
   if(!focus||typeof focus!=='object'||['model','hesap','karar','adimlar'].some(k=>!Number.isSafeInteger(focus[k])||focus[k]<0||focus[k]>r.wrong))throw Error('Hata aşaması verisi geçersiz.');
   if(r.lastEventDay!==null&&(!/^\d{4}-\d{2}-\d{2}$/.test(r.lastEventDay)||!Number.isFinite(Date.parse(r.lastEventDay))))throw Error('Etkinlik tarihi geçersiz.');
   outcomes.push({code,total:n,done:r.done,wrong:r.wrong,hint:r.hint,correct:r.correct,wrongTasks:r.wrongTasks,observedTasks:r.observedTasks,
    focus:{model:focus.model,hesap:focus.hesap,karar:focus.karar,adimlar:focus.adimlar},lastEventDay:r.lastEventDay});
  }
  return {format:FORMAT,schema:1,code:raw.code,grade:raw.grade,generatedAt:new Date(instant).toISOString(),windowDays:30,outcomes};
 }
 const panel=el('section',host,null,'a621-panel');host.insertBefore(panel,host.firstChild);panel.id='a621Teacher';
 el('h2',panel,'📊 Sınıf Öğrenme İzleri · Pilot');
 el('p',panel,'Öğrencilerin kendilerinin indirdiği kodlu öğrenme özetlerini burada birleştirebilirsin. Bu cihazda saklanır; okul hesabı, çevrimiçi eşitleme veya kimlik doğrulama yoktur.','a621-muted');
 const info=el('p',panel,'Önce öğrenciler Matematik Atlası ana ekranından “Öğrenme özeti JSON” indirir. Sen yalnız paylaştıkları dosyaları içe aktarırsın. Gerçek ad, T.C. kimlik numarası veya kişisel not eklemeyin.','a621-info');
 const controls=el('div',panel,null,'a621-controls');
 const lgrade=el('label',controls,'Sınıf'),grade=el('select',lgrade);grade.id='a621Grade';
 for(const [value,label] of [['all','Tüm sınıflar'],['5','5. sınıf'],['6','6. sınıf'],['7','7. sınıf'],['8','8. sınıf']]){const o=el('option',grade,label);o.value=value}
 const lsearch=el('label',controls,'Öğrenci koduna göre filtrele');const search=el('input',lsearch);search.placeholder='Örn. A07';search.maxLength=20;search.id='a621Search';
 const fileLabel=el('label',controls,'↑ Öğrenci özeti içe aktar','a621-file-label');fileLabel.htmlFor='a621Import';
 const file=el('input',controls);file.type='file';file.accept='.json,application/json';file.multiple=true;file.id='a621Import';
 const csv=el('button',controls,'↓ Sınıf CSV');csv.type='button';csv.className='alt';csv.id='a621Csv';
 const message=el('p',panel,'','a621-status');message.setAttribute('role','status');message.id='a621Status';
 const metrics=el('div',panel,null,'a621-metrics');metrics.id='a621Metrics';
 const rosterTitle=el('h3',panel,'İçe aktarılan kodlar');rosterTitle.style.fontSize='17px';
 const roster=el('div',panel,null,'a621-roster');roster.id='a621Roster';
 el('h3',panel,'Kazanıma göre gözlenen destek ihtiyacı').style.fontSize='17px';
 el('p',panel,'“Destek öner” bir tanı veya risk puanı değildir: son 30 günde bir öğrencinin aynı çıktıda en az iki yanlış kontrolü ya da iki ipucu bulunmasıdır. Kayıt olmayan yerde “sorun yok” denemez.','a621-muted');
 const tableScroll=el('div',panel,null,'a621-twrap');const table=el('table',tableScroll);const thead=el('thead',table),head=el('tr',thead);
 for(const h of ['Sınıf','Öğrenme çıktısı','Tema','Öğrenci','Tamamlama','Yanlış kontrol','İpucu','Destek önerilen','Kanıt'])el('th',head,h);
 const body=el('tbody',table);body.id='a621Rows';
 const foot=el('p',panel,'Bu sınıf raporu resmî not, tanı veya öğrencilerin cihazlarına uzaktan erişim değildir. Olaylar her öğrenci özetinin oluşturulduğu andan geriye 30 günlük pencereden gelir; farklı günlerde üretilen dosyaların pencereleri tam aynı olmayabilir. Dosyalar değiştirilebilir; kimlik ve doğruluk bağımsız doğrulanmaz.','a621-foot');
 function persist(next){if(next.length>48)throw Error('En fazla 48 farklı öğrenci kodu saklanabilir.');
  const value=JSON.stringify(next);localStorage.setItem(KEY,value);if(localStorage.getItem(KEY)!==value)throw Error('Yerel depolama doğrulanamadı.');items=next;
 }
 const match=()=>items.filter(s=>(grade.value==='all'||String(s.grade)===grade.value)&&s.code.toLowerCase().includes(search.value.trim().toLowerCase()));
 function stat(label,value){const b=el('div',metrics,null,'a621-metric');el('strong',b,value);el('small',b,label)}
 function currentResults(){const selected=match(),out=[];
  for(const o of db.outcomes.filter(o=>grade.value==='all'||String(o.sinif)===grade.value)){
   const list=selected.filter(s=>s.grade===Number(o.sinif)).map(s=>s.outcomes.find(r=>r.code===o.kod)).filter(Boolean);
   if(!list.length)continue;
   const completed=list.reduce((n,r)=>n+r.done,0),total=list.reduce((n,r)=>n+r.total,0),wrong=list.reduce((n,r)=>n+r.wrong,0),hint=list.reduce((n,r)=>n+r.hint,0),observed=list.filter(r=>r.observedTasks>0).length;
   const support=list.filter(r=>r.wrong>=2||r.hint>=2).length;
   out.push({grade:o.sinif,code:o.kod,theme:o.tema_adi||o.tema||'',learners:list.length,completed,total,wrong,hint,observed,support});
  }
  return out.sort((a,b)=>b.support-a.support||b.wrong-a.wrong||String(a.code).localeCompare(String(b.code),'tr'));
 }
 function render(){activeGrade=grade.value;const selected=match(),results=currentResults();metrics.replaceChildren();body.replaceChildren();roster.replaceChildren();
  stat('Alınan öğrenci özeti',selected.length);stat('Kazanım satırı',results.length);
  stat('Yanlış kontrol (30 gün)',results.reduce((a,r)=>a+r.wrong,0));stat('Destek önerisi (öğrenci × çıktı)',results.reduce((a,r)=>a+r.support,0));
  if(!selected.length)el('p',roster,'Henüz öğrenci özeti yok. Bir öğrencinin indirdiği JSON dosyasını yükleyerek başla.','a621-muted');
  for(const s of selected){const chip=el('span',roster,null,'a621-student-chip');el('span',chip,s.code+' · '+s.grade+'. sınıf · '+s.generatedAt.slice(0,10));
   const drop=el('button',chip,'Sil');drop.type='button';drop.className='warn';drop.setAttribute('aria-label',s.code+' özetini sil');
   drop.onclick=()=>{if(!confirm(s.code+' kodlu öğrenci özetini bu tarayıcıdan silmek istiyor musun?'))return;
    try{persist(items.filter(x=>!(x.code===s.code&&x.grade===s.grade)));message.textContent=s.code+' kodlu özet kaldırıldı.';render()}
    catch(e){message.textContent='⚠ '+e.message}};
  }
  if(!results.length){const tr=el('tr',body),td=el('td',tr,'Bu filtre için kanıt dosyası bulunmuyor.','a621-table-empty');td.colSpan=9}
  for(const r of results){const tr=el('tr',body);const vals=[r.grade,r.code,r.theme,r.learners,r.completed+' / '+r.total,r.wrong,r.hint,r.support, r.observed+' / '+r.learners+' öğrencide gözlenen olay'];
   for(let i=0;i<vals.length;i++){const td=el('td',tr,vals[i]);if(i===7&&r.support)td.className='a621-tag';}
  }
 }
 function csvCell(x){let value=String(x??'');if(/^[\s]*[=+@-]/.test(value))value="'"+value;return '"'+value.replace(/"/g,'""')+'"'}
 function downloadCSV(){const rows=[['Sınıf','Öğrenme çıktısı','Tema','Öğrenci sayısı','Tamamlanan','Toplam görev','Yanlış kontrol (30g)','İpucu (30g)','Destek önerilen öğrenci','Gözlemli öğrenci']];
  for(const r of currentResults())rows.push([r.grade,r.code,r.theme,r.learners,r.completed,r.total,r.wrong,r.hint,r.support,r.observed]);
  const content='\uFEFF'+rows.map(a=>a.map(csvCell).join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));const a=el('a',document.body);a.href=url;a.download='matematik_atlasi_sinif_ogrenme_izleri_v621.csv';a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 file.addEventListener('change',async()=>{const files=Array.from(file.files||[]);file.value='';if(!files.length)return;
  let updated=0,skipped=0;const errors=[];
  for(const f of files){try{if(f.size>350000)throw Error('Dosya 350 KB sınırını aşıyor.');const raw=JSON.parse(await f.text());const s=validate(raw);
    const earlier=items.find(x=>x.code===s.code&&x.grade===s.grade);
    if(earlier&&Date.parse(earlier.generatedAt)>Date.parse(s.generatedAt)){skipped++;continue}
    persist([...items.filter(x=>!(x.code===s.code&&x.grade===s.grade)),s]);updated++;
   }catch(e){errors.push(f.name+': '+e.message)}
  }
  message.textContent=updated+' özet eklendi/güncellendi. '+(skipped?skipped+' eski dosya atlandı. ':'')+(errors.length?errors.length+' dosya reddedildi: '+errors.slice(0,2).join(' | '):'');render();
 });
 grade.onchange=render;search.oninput=render;csv.onclick=downloadCSV;
 window.Atlas621Teacher={validate,results:currentResults,stored:()=>items.slice(),render};
 render();
})();
