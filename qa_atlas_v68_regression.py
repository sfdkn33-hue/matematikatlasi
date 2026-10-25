from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path('/mnt/data/atlas_v68_src')
h=(R/'ATLAS_TEK_DOSYA.html').read_text().replace('<head>',"<head><script>window.__mem={};window.__block=false;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>window.__mem[k]??null,setItem(k,v){if(window.__block)throw Error('blocked');window.__mem[k]=String(v)},removeItem:k=>delete window.__mem[k]}});</script>",1)
res={};errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 pg=b.new_page(viewport={'width':390,'height':844});pg.on('pageerror',lambda e:errors.append(str(e)));pg.set_content(h,wait_until='domcontentloaded',timeout=45000)
 pg.wait_for_function('window.MatematikAtlas68&&window.MatematikAtlasV30',timeout=10000)
 res['tested']={}
 for g in ['6','7','8']:
  t=pg.evaluate('(g)=>window.ATLAS_DB.tasks.find(t=>t.atlas68Workbench&&t.sinif===g)',g)
  tid=t['id'];pg.evaluate('(id)=>window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(x=>x.id===id))',tid)
  # bypass clicking original hidden completion button direct should fail
  pg.evaluate("document.querySelector('#answer').value='1';document.querySelector('#check').click()")
  a=pg.evaluate('(id)=>!!JSON.parse(localStorage.getItem("mathAtlas940Done")||"{}")[id]',tid)
  # choose wrong model and supply correct numeric -> reject
  pg.evaluate('''()=>{const t=window.ATLAS_DB.tasks.find(x=>x.id===document.querySelector('#atlas68Lab .a68-kicker').textContent.split(' · ')[0]);}''')
  pg.evaluate('''(id)=>{const c=window.ATLAS_DB.tasks.find(t=>t.id===id).atlas68Workbench,root=document.querySelector('#atlas68Lab');c.numbers.forEach((f,i)=>{const inp=root.querySelector('[data-v68-num="'+i+'"]');inp.value=String(f.expected);inp.dispatchEvent(new Event('input',{bubbles:true}));});if(c.mode==='decision'){[...root.querySelectorAll('.a68-choice')].find(b=>b.textContent!==c.expected).click();}else{const wrong=c.options.find(v=>v!==c.expected[0]);[...root.querySelectorAll('.a68-card')].find(b=>b.textContent===wrong).click();}root.querySelector('.a68-actions button').click();}''',tid)
  z=pg.evaluate('(id)=>!!JSON.parse(localStorage.getItem("mathAtlas940Done")||"{}")[id]',tid)
  res['tested'][g]={'id':tid,'legacyBypassBlocked':not a,'wrongModelBlocked':not z}
 # prior old completion key unaffected when fresh task saved (simulate old key)
 pg.evaluate("window.__mem.mathAtlas940Done=JSON.stringify({'MAT.5.1.1-G01':true})")
 pg.evaluate('(id)=>window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.id===id))',t['id'])
 res['oldCompletionPreserved']=pg.evaluate('!!JSON.parse(window.__mem.mathAtlas940Done)["MAT.5.1.1-G01"]')
 # simulate storage failure on correct workbench
 pg.evaluate('''(id)=>{const t=window.ATLAS_DB.tasks.find(t=>t.id===id),c=t.atlas68Workbench,root=document.querySelector('#atlas68Lab');c.numbers.forEach((f,i)=>{const z=root.querySelector('[data-v68-num="'+i+'"]');z.value=String(f.expected);z.dispatchEvent(new Event('input',{bubbles:true}));});if(c.mode==='decision')root.querySelectorAll('.a68-choice')[c.options.indexOf(c.expected)].click();else for(const val of c.expected){const b=[...root.querySelectorAll('.a68-card')].find(x=>x.textContent===val&&!x.disabled);b.click();}window.__block=true;root.querySelector('.a68-actions button').click();}''',t['id'])
 res['storageErrorVisible']=pg.evaluate('!!document.getElementById("atlas67StorageBanner")&&!document.getElementById("atlas67StorageBanner").hidden')
 res['storageNotRecorded']=pg.evaluate('(id)=>!JSON.parse(window.__mem.mathAtlas940Done||"{}")[id]',t['id'])
 res['javascriptErrors']=errors
 b.close()
R.joinpath('tests/QA_V68_REGRESSION.json').write_text(json.dumps(res,ensure_ascii=False,indent=2))
print(json.dumps(res,ensure_ascii=False,indent=2))
