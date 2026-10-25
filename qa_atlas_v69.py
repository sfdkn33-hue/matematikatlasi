from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path('/mnt/data/atlas_v69_src');R.joinpath('tests').mkdir(exist_ok=True)
h=(R/'ATLAS_TEK_DOSYA.html').read_text()
shim='''<script>window.__mem={};window.__block=false;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return window.__mem[k]??null},setItem(k,v){if(window.__block)throw Error('blocked');window.__mem[k]=String(v)},removeItem(k){delete window.__mem[k]}}});</script>'''
h=h.replace('<head>','<head>'+shim,1)
report={'checked':48};errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 pg=b.new_page(viewport={'width':390,'height':844});pg.set_default_timeout(6000);pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.set_content(h,wait_until='domcontentloaded',timeout=60000)
 pg.wait_for_function('window.MatematikAtlas69 && window.MatematikAtlasV30 && window.MatematikAtlas64',timeout=15000)
 report['taskCount']=pg.evaluate('window.ATLAS_DB.tasks.length');report['reworked']=pg.evaluate('window.MatematikAtlas69.reworked')
 pg.evaluate('''() => {
  window.__v69Res=[];
  for(const t of window.ATLAS_DB.tasks.filter(x=>x.atlas69Workbench)){
   window.MatematikAtlasV30.navigate(t);
   const root=document.querySelector('#atlas69Lab'),c=t.atlas69Workbench;
   const isDone=()=>!!JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')[t.id];
   const check=()=>root.querySelector('[data-a69-check]').click();
   const log={id:t.id,mode:c.mode,visible:!root.hidden,blank:false,numberOnly:false,modelOnly:false,wrongModel:false,saved:false};
   check();log.blank=!isDone();
   const input=()=>root.querySelector('[data-a69-num]');
   input().value=String(c.number.expected);input().dispatchEvent(new Event('input',{bubbles:true}));check();log.numberOnly=!isDone();
   input().value='';input().dispatchEvent(new Event('input',{bubbles:true}));
   if(c.mode==='order'){
    for(const v of c.expected){const z=[...root.querySelectorAll('[data-a69-card]')].find(b=>b.textContent===v&&!b.disabled);if(!z)throw Error('Missing card '+t.id+' '+v);z.click();}
   }else if(c.mode==='choice'){
    const z=[...root.querySelectorAll('[data-a69-choice]')].find(b=>b.textContent===c.expected);if(!z)throw Error('Missing choice '+t.id);z.click();
   }else{
    // Native input interaction, not setting any verification globals
    const s=root.querySelector('[data-a69-slider]');s.value=String(c.expected);s.dispatchEvent(new Event('input',{bubbles:true}));
   }
   check();log.modelOnly=!isDone();
   input().value=String(c.number.expected);input().dispatchEvent(new Event('input',{bubbles:true}));check();log.saved=isDone();
   window.__v69Res.push(log);
  }
 }''')
 report['tests']=pg.evaluate('window.__v69Res')
 report['allPassed']=all(all(r[k] for k in ('visible','blank','numberOnly','modelOnly','saved')) for r in report['tests'])
 report['countSaved']=pg.evaluate('Object.keys(JSON.parse(localStorage.getItem("mathAtlas940Done")||"{}")).length')
 report['attempts']=pg.evaluate('JSON.parse(localStorage.getItem("mathAtlas64Attempts")||"[]").filter(e=>e.status==="correct"&&e.taskId&&/MAT\\.6\\.(1\\.6|2\\.3|4\\.2|4\\.6)-G/.test(e.taskId)).length')
 report['errors']=errors
 # representative 4 workbenches screenshots
 for code in ['MAT.6.1.6','MAT.6.2.3','MAT.6.4.2','MAT.6.4.6']:
  pg.evaluate('(c)=>window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.atlas69Workbench&&t.ogrenme_ciktisi===c))',code)
  pg.screenshot(path=str(R/f'tests/QA_v69_{code}.png'),full_page=False)
 for w in [320,390,768,1280]:
  pg.set_viewport_size({'width':w,'height':844})
  report['overflow'+str(w)]=pg.evaluate('document.documentElement.scrollWidth>innerWidth')
 # regressions independent per first item and blocked storage
 pg.set_viewport_size({'width':390,'height':844})
 first=pg.evaluate('window.ATLAS_DB.tasks.find(t=>t.atlas69Workbench).id')
 pg.evaluate('(id)=>{const d=JSON.parse(localStorage.getItem("mathAtlas940Done")||"{}");delete d[id];d["MAT.5.1.1-G01"]=true;localStorage.setItem("mathAtlas940Done",JSON.stringify(d))}',first)
 pg.evaluate('(id)=>window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.id===id))',first)
 pg.evaluate("document.getElementById('answer').value='1';document.getElementById('check').click()")
 report['legacyBypassBlocked']=pg.evaluate('(id)=>!JSON.parse(localStorage.getItem("mathAtlas940Done")||"{}")[id]',first)
 pg.evaluate('''(id)=>{
   const t=window.ATLAS_DB.tasks.find(t=>t.id===id),c=t.atlas69Workbench,r=document.getElementById('atlas69Lab');
   const n=r.querySelector('[data-a69-num]');n.value=String(c.number.expected);n.dispatchEvent(new Event('input',{bubbles:true}));
   if(c.mode==='order'){const wrong=[...c.expected].reverse();for(const v of wrong){[...r.querySelectorAll('[data-a69-card]')].find(b=>b.textContent===v&&!b.disabled).click()}}
   else if(c.mode==='choice'){[...r.querySelectorAll('[data-a69-choice]')].find(b=>b.textContent!==c.expected).click()}
   else {const s=r.querySelector('[data-a69-slider]');s.value=String(c.min);s.dispatchEvent(new Event('input',{bubbles:true}))}
   r.querySelector('[data-a69-check]').click();
 }''',first)
 report['wrongModelBlocked']=pg.evaluate('(id)=>!JSON.parse(localStorage.getItem("mathAtlas940Done")||"{}")[id]',first)
 # storage failure scenario on a fresh task
 first2=pg.evaluate('window.ATLAS_DB.tasks.filter(t=>t.atlas69Workbench)[20].id')
 pg.evaluate('(id)=>{const d=JSON.parse(localStorage.getItem("mathAtlas940Done")||"{}");delete d[id];localStorage.setItem("mathAtlas940Done",JSON.stringify(d))}',first2)
 pg.evaluate('(id)=>window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.id===id))',first2)
 pg.evaluate('''(id)=>{
   const t=window.ATLAS_DB.tasks.find(t=>t.id===id),c=t.atlas69Workbench,r=document.querySelector('#atlas69Lab');
   const n=r.querySelector('[data-a69-num]');n.value=String(c.number.expected);n.dispatchEvent(new Event('input',{bubbles:true}));
   if(c.mode==='order')for(const val of c.expected){[...r.querySelectorAll('[data-a69-card]')].find(x=>x.textContent===val&&!x.disabled).click()}
   else if(c.mode==='choice')[...r.querySelectorAll('[data-a69-choice]')].find(x=>x.textContent===c.expected).click();
   else{const s=r.querySelector('[data-a69-slider]');s.value=String(c.expected);s.dispatchEvent(new Event('input',{bubbles:true}))}
   window.__block=true;r.querySelector('[data-a69-check]').click();
 }''',first2)
 report['blockedSaveNotRecorded']=pg.evaluate('(id)=>!JSON.parse(localStorage.getItem("mathAtlas940Done")||"{}")[id]',first2)
 report['storageWarning']=pg.evaluate('!!document.getElementById("atlas67StorageBanner")')
 report['oldProgressPreserved']=pg.evaluate('!!JSON.parse(window.__mem.mathAtlas940Done)["MAT.5.1.1-G01"]')
 b.close()
(R/'tests/QA_V69_BROWSER.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='tests'},ensure_ascii=False,indent=2))
print('FAILURES',[(r['id'],[k for k in ('visible','blank','numberOnly','modelOnly','saved') if not r[k]]) for r in report['tests'] if not all(r[k] for k in ('visible','blank','numberOnly','modelOnly','saved'))][:20])
