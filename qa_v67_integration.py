from pathlib import Path
from playwright.sync_api import sync_playwright
import json,time
R=Path('/mnt/data/atlas_v67_src');h=(R/'ATLAS_TEK_DOSYA.html').read_text()
shim='<script>window.__mem={};window.__block=false;Object.defineProperty(window,"localStorage",{configurable:true,value:{getItem(k){return window.__mem[k]??null},setItem(k,v){if(window.__block)throw Error("QuotaExceededError");window.__mem[k]=String(v)},removeItem(k){if(window.__block)throw Error("QuotaExceededError");delete window.__mem[k]}}});</script>'
h=h.replace('<head>','<head>'+shim,1)
report={};fail=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':390,'height':820});page.set_default_timeout(4000)
 page.on('pageerror',lambda e:fail.append(str(e)))
 page.set_content(h,wait_until='domcontentloaded',timeout=40000)
 page.wait_for_function('window.MatematikAtlas64 && window.MatematikAtlasV30 && window.MatematikAtlas67',timeout=10000)
 report['loaded']=page.evaluate('window.ATLAS_DB.tasks.length')
 report['backupButton']=page.locator('#atlas67ManualBackup').count()==1
 report['mobileOverflow']=page.evaluate('document.documentElement.scrollWidth>innerWidth')
 # LGS smoke on homepage
 try:
  page.locator('#atlasLgs54Quick').click(timeout=3000)
  report['lgsOpen']=page.locator('#atlasLgs54').is_visible()
  page.locator('#lgs57-mode').select_option('advanced',timeout=3000)
  report['lgsAdvancedCounter']=page.locator('#lgs54-count').inner_text(timeout=3000)
  page.locator('#lgs54-exit').click(timeout=3000)
 except Exception as e:report['lgsException']=str(e)[:250]
 ids=page.evaluate('window.ATLAS_DB.tasks.filter(t=>t.atlas63Pilot&&!t.atlas63Pilot.atlas66Visual).slice(0,3).map(t=>t.id)')
 report['selectedIds']=ids
 def navigate(task_id):
  page.evaluate('(id)=>window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.id===id))',task_id)
  page.wait_for_timeout(100)
  assert page.locator('#atlas63PilotLab').is_visible()
 def fill_correct(task_id):
  page.evaluate('''(id)=>{const t=window.ATLAS_DB.tasks.find(t=>t.id===id);t.atlas63Pilot.fields.forEach((f,i)=>{if(f.type==='choice'){const r=[...document.querySelectorAll('#atlas63PilotLab input[type=radio]')].find(x=>x.dataset.v63Field==String(i)&&x.value===String(f.expected));if(!r)throw Error('missing option '+i);r.checked=true;}else{const q=document.querySelector('#atlas63PilotLab input[data-v63-field="'+i+'"]');if(!q)throw Error('missing field '+i);q.value=String(f.expected);}})}''',task_id)
 def click_verify():page.locator('#atlas63PilotLab button').filter(has_text='Çözümü doğrula').click(timeout=3500)
 navigate(ids[0]);report['firstTaskOpened']=True
 click_verify();report['blankWrong']='Henüz doğru değil' in page.locator('#atlas63PilotLab .v63-status').inner_text()
 fill_correct(ids[0]);click_verify()
 report['firstTaskSaved']=page.evaluate('(id)=>!!JSON.parse(window.__mem.mathAtlas940Done||"{}")[id]',ids[0])
 report['firstLogSaved']=page.evaluate('(id)=>JSON.parse(window.__mem.mathAtlas64Attempts||"[]").some(e=>e.taskId===id&&e.status==="correct")',ids[0])
 navigate(ids[1]);fill_correct(ids[1]);page.evaluate('window.__block=true');click_verify()
 report['saveWarningBanner']=page.locator('#atlas67StorageBanner').is_visible()
 report['blockedSaveNotClaimed']='kaydedilemedi' in page.locator('#atlas63PilotLab .v63-status').inner_text()
 report['secondNotPersisted']=page.evaluate('(id)=>!JSON.parse(window.__mem.mathAtlas940Done||"{}")[id]',ids[1])
 page.locator('#atlas67BackupText').click(timeout=3500)
 report['backupReadable']=page.locator('#atlas67BackupData').input_value().find(ids[1])!=-1
 page.evaluate('window.__block=false');fill_correct(ids[1]);click_verify()
 report['recoverPersisted']=page.evaluate('(id)=>!!JSON.parse(window.__mem.mathAtlas940Done||"{}")[id]',ids[1])
 report['warnCleared']=page.locator('#atlas67StorageBanner').count()==0
 # v6.7 mastery scenario original bug
 base=1780000000000;ms=86400000;ev=[{'taskId':ids[0],'status':'correct','when':base,'firstTry':True,'hintUsed':False,'wrongCount':0}]+[{'taskId':ids[0],'status':'correct','when':base+22*ms+i*1000,'firstTry':True,'hintUsed':False,'wrongCount':0} for i in range(3)]
 page.evaluate('([list,n])=>{window.__mem.mathAtlas64Attempts=JSON.stringify(list);window.__atlas64TestNow=n}',[ev,base+23*ms])
 state=page.evaluate('(id)=>window.MatematikAtlas64.calculate(id)',ids[0]);report['sameDayReviewSteps']=state['steps'];report['sameDayReviewPhase']=state['phase']
 report['javascriptErrors']=fail
 browser.close()
R.joinpath('tests/QA_V67_BROWSER.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
