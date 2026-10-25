from pathlib import Path
from playwright.sync_api import sync_playwright
import json,time
R=Path('/mnt/data/atlas_v68_src');h=(R/'ATLAS_TEK_DOSYA.html').read_text()
shim='''<script>window.__mem={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return window.__mem[k]??null},setItem(k,v){window.__mem[k]=String(v)},removeItem(k){delete window.__mem[k]}}});</script>'''
h=h.replace('<head>','<head>'+shim,1)
report={'new':36,'results':[]};errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':390,'height':844});page.set_default_timeout(5000);page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(h,wait_until='domcontentloaded',timeout=60000)
 page.wait_for_function('window.MatematikAtlas68&&window.MatematikAtlasV30&&window.MatematikAtlas64',timeout=12000)
 report['loaded']=page.evaluate('window.ATLAS_DB.tasks.length')
 report['pilotCount']=page.evaluate('window.MatematikAtlas68.pilotCount')
 report['oldIdsPreserved']=page.evaluate('window.ATLAS_DB.tasks.filter(t=>!t.atlas68Workbench).length===4001')
 # Test each task via actual nav + model button clicks + check button, batched in one DOM execution
 # Synchronous DOM interaction is equivalent to actual user clicking, unlike setting verification globals.
 page.evaluate('''() => {
  window.__v68Report=[];
  const tasks=window.ATLAS_DB.tasks.filter(t=>t.atlas68Workbench);
  for(const t of tasks){
   const detail={id:t.id,grade:String(t.sinif),theme:Number(t.tema_sirasi),outcome:t.ogrenme_ciktisi,number:t.gorev_no,title:t.baslik};
   // navigate from actual V30 task selector
   window.MatematikAtlasV30.navigate(t);
   const root=document.getElementById('atlas68Lab'),cfg=t.atlas68Workbench;
   const clickVerify=()=>root.querySelector('.a68-actions button').click();
   const isDone=()=>!!JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')[t.id];
   const log={id:t.id,visible:!root.hidden,blankBlocked:false,numericOnlyBlocked:false,modelOnlyBlocked:false,correctSaved:false,wrongModelBlocked:false,numberOfSteps:cfg.numbers.length};
   clickVerify();log.blankBlocked=!isDone();
   cfg.numbers.forEach((f,i)=>{const inp=root.querySelector(`input[data-v68-num="${i}"]`);inp.value=String(f.expected);inp.dispatchEvent(new Event('input',{bubbles:true}));});
   clickVerify();log.numericOnlyBlocked=!isDone();
   // To ensure correct model but missing numeric is denied, clear required numeric temporarily
   let inp=root.querySelector('input[data-v68-num="0"]');inp.value='';inp.dispatchEvent(new Event('input',{bubbles:true}));
   if(cfg.mode==='decision'){
    const btn=[...root.querySelectorAll('.a68-choice')].find(x=>x.textContent===cfg.expected);if(!btn)throw Error('missing decision '+t.id);btn.click();
   }else{
    for(const val of cfg.expected){const btn=[...root.querySelectorAll('.a68-card')].find(x=>x.textContent===val&&!x.disabled);if(!btn)throw Error('missing card '+val+' '+t.id);btn.click();}
   }
   clickVerify();log.modelOnlyBlocked=!isDone();
   inp=root.querySelector('input[data-v68-num="0"]');inp.value=String(cfg.numbers[0].expected);inp.dispatchEvent(new Event('input',{bubbles:true}));
   clickVerify();log.correctSaved=isDone();
   window.__v68Report.push(log);
  }
 }''')
 report['results']=page.evaluate('window.__v68Report')
 report['completed']=page.evaluate('Object.keys(JSON.parse(localStorage.getItem("mathAtlas940Done")||"{}")).length')
 report['loggedCorrect']=page.evaluate('JSON.parse(localStorage.getItem("mathAtlas64Attempts")||"[]").filter(e=>e.status==="correct"&&e.taskId.startsWith("MA68-")).length')
 report['mobileOverflow']=page.evaluate('document.documentElement.scrollWidth>window.innerWidth')
 report['errors']=errors
 # screenshots of a new exercise on mobile and homepage
 page.evaluate('window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.atlas68Workbench&&t.sinif==="8"))')
 page.screenshot(path=str(R/'tests/QA_v68_ALG_MOBILE.png'),full_page=False)
 for w in (320,768,1280):
  page.set_viewport_size({'width':w,'height':844})
  report['overflow'+str(w)]=page.evaluate('document.documentElement.scrollWidth>window.innerWidth')
 b.close()
R.joinpath('tests').mkdir(exist_ok=True)
R.joinpath('tests/QA_V68_BROWSER.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='results'},ensure_ascii=False,indent=2))
print('Failures',[(r['id'],[k for k,v in r.items() if k in ('visible','blankBlocked','numericOnlyBlocked','modelOnlyBlocked','correctSaved') and not v]) for r in report['results'] if not all(r[k] for k in ('visible','blankBlocked','numericOnlyBlocked','modelOnlyBlocked','correctSaved'))][:10])
