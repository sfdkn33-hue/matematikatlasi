(()=>{'use strict';
 const shell=document.createElement('aside');shell.id='atlas622Room';shell.setAttribute('aria-label','Sınıf bağlantı ekranı');
 shell.innerHTML=`<div class="a622-h"><strong>📺 Sınıf Bağlantısı</strong><button type="button" id="a622Toggle" aria-expanded="true">−</button></div><div id="a622Body"><p id="a622Status" role="status">Bu tahta henüz bir sınıf oturumuna bağlı değil.</p><div class="a622-pair" id="a622Pair" hidden><span>Oturum kodu <b id="a622Code"></b></span><span>Geçici PIN <b id="a622Pin"></b></span><small>Telefonunda bu sunucunun /kumanda adresini aç.</small></div><div class="a622-actions"><button type="button" id="a622Start">Bağlantı başlat</button><button type="button" id="a622End" hidden>Oturumu bitir</button></div><small class="a622-privacy">Yalnız görev gezinmesi aktarılır. Yanıtlar ve ilerleme tahtada kalır.</small></div>`;
 document.body.appendChild(shell);
 const $=id=>document.getElementById(id);let stream=null,room=null,busy=false,lastTask=null;
 const setStatus=s=>{$('a622Status').textContent=s;};
 async function req(url,body){const response=await fetch(url,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const result=await response.json();if(!response.ok)throw Error(result.error||'Bağlantı hatası');return result;}
 function showRoom(r){room=r;$('a622Start').hidden=true;$('a622End').hidden=false;$('a622Pair').hidden=false;$('a622Code').textContent=r.code;$('a622Pin').textContent=r.connected?'••••••':r.pin||'••••••';setStatus(r.connected?'✅ Öğretmen bağlandı · kumanda hazır':'Telefon bağlantısı bekleniyor…');}
 function closeStream(){stream?.close();stream=null;}
 function publishCurrent(){
  if(!room)return;const outcome=$('outcome')?.value,active=$('numbergrid')?.querySelector('button.active');
  if(!outcome||!active)return;const no=Number(active.textContent.trim());
  const found=window.ATLAS_DB?.tasks?.find(t=>t.ogrenme_ciktisi===outcome&&Number(t.gorev_no)===no);
  if(found){lastTask=String(found.id);req('/api/board/state',{taskId:lastTask}).catch(()=>{})}
 }
 function listen(){closeStream();stream=new EventSource('/api/events?role=board');stream.addEventListener('state',ev=>{const state=JSON.parse(ev.data);if(!room)return;showRoom({...room,connected:state.connected});});stream.addEventListener('command',ev=>{try{applyCommand(JSON.parse(ev.data))}catch(e){setStatus('⚠ Gezinme komutu uygulanamadı.');}});stream.addEventListener('ended',()=>{closeStream();room=null;reset()});stream.onerror=()=>{if(room)setStatus('⚠ Ağ bağlantısı kesildi; oyun yerel olarak çalışır. Bağlantı yeniden deneniyor…')};}
 function reset(){$('a622Start').hidden=false;$('a622End').hidden=true;$('a622Pair').hidden=true;setStatus('Sınıf oturumu kapalı.');}
 function shownGame(){
  if(document.body.classList.contains('atlas-playing'))return;
  const code=$('outcome')?.value,idx=[...($('numbergrid')?.querySelectorAll('button')||[])].findIndex(b=>b.classList.contains('active'));
  const tasks=window.ATLAS_DB?.tasks?.filter(t=>t.ogrenme_ciktisi===code)||[];
  if(tasks[idx])window.MatematikAtlasV30?.navigate(tasks[idx]);
 }
 function applyCommand(cmd){if(!room)return;const a=cmd.action;if(a==='home'){window.MatematikAtlasV30?.home();return;}
  if(a==='next'||a==='prev'){shownGame();const node=$(a);if(node&&!node.disabled)node.click();else setStatus('Bu öğrenme çıktısının sonuna ulaşıldı.');return;}
  if(a!=='select')return;
  const t=window.ATLAS_DB?.tasks?.find(x=>String(x.id)===cmd.taskId);if(!t)return;
  if(window.MatematikAtlasV30?.navigate){window.MatematikAtlasV30.navigate(t);return;}
  const grade=$('grade'),theme=$('theme'),outcome=$('outcome');if(!grade||!theme||!outcome)return;
  grade.value=String(t.sinif);grade.dispatchEvent(new Event('change',{bubbles:true}));
  theme.value=String(t.tema_sirasi);theme.dispatchEvent(new Event('change',{bubbles:true}));
  outcome.value=String(t.ogrenme_ciktisi);outcome.dispatchEvent(new Event('change',{bubbles:true}));
  const group=window.ATLAS_DB.tasks.filter(x=>String(x.ogrenme_ciktisi)===String(t.ogrenme_ciktisi));const index=group.findIndex(x=>String(x.id)===cmd.taskId);
  const buttons=$('numbergrid')?.querySelectorAll('button');if(index>=0&&buttons?.[index])buttons[index].click();
 }
 $('a622Start').onclick=async()=>{if(busy)return;busy=true;$('a622Start').disabled=true;try{const info=await req('/api/room',{});showRoom(info);listen();publishCurrent()}catch(e){setStatus('⚠ '+e.message)}finally{busy=false;$('a622Start').disabled=false}};
 $('a622End').onclick=async()=>{if(!room)return;try{await req('/api/room/end',{});}catch(e){setStatus('⚠ '+e.message);return;}closeStream();room=null;reset()};
 $('a622Toggle').onclick=()=>{const b=$('a622Body');b.hidden=!b.hidden;$('a622Toggle').textContent=b.hidden?'+':'−';$('a622Toggle').setAttribute('aria-expanded',String(!b.hidden))};
 document.addEventListener('atlas:taskrender',e=>{const id=String(e.detail?.id||'');if(id===lastTask||!room)return;lastTask=id;req('/api/board/state',{taskId:id}).catch(()=>{});});
 fetch('/api/session?role=board',{credentials:'same-origin'}).then(r=>r.json()).then(v=>{if(v.active){showRoom(v);listen();publishCurrent();}}).catch(()=>{});
 window.Atlas622Board={select:applyCommand};
})();
