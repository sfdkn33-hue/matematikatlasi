from pathlib import Path
from playwright.sync_api import sync_playwright
import json,collections,math,re,hashlib
root=Path('/mnt/data/atlas_v620_build/MATEMATIK_ATLASI_v6_20')
prev=Path('/mnt/data/atlas_v619_build/MATEMATIK_ATLASI_v6_19')
db=json.loads((root/'data/tasks.json').read_text())
assert len(db['tasks'])==4037
assert (root/'data/tasks.json').read_bytes()==(prev/'data/tasks.json').read_bytes()
assert (root/'data/tasks.js').read_bytes()==(prev/'data/tasks.js').read_bytes()
assert not any(t.get('teacher_review_required') is True for t in db['tasks'])
assert set(t['id'] for t in db['tasks'])==set(t['id'] for t in json.loads((prev/'data/tasks.json').read_text())['tasks'])
count=collections.Counter((('applied',t['appliedLab']['mode']) if t.get('appliedLab') else ('decimal',t['decimalLab']['mode'])) for t in db['tasks'] if t.get('appliedLab') or t.get('decimalLab'))
assert len(count)==20,len(count)
index=(root/'index.html').read_text()
for res in ['atlas620_targeted_coach.js','atlas620_targeted_coach.css','atlas619_geometry_coach.js','atlas618_fraction_coach.js','atlas617_tutor.js']:
 assert index.count(res)==1,(res,index.count(res))
import html.parser
class AssetParser(html.parser.HTMLParser):
 def __init__(self):super().__init__();self.assets=[]
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='script' and attrs.get('src'):self.assets.append(attrs['src'])
  if tag=='link' and attrs.get('href'):self.assets.append(attrs['href'])
p=AssetParser();p.feed(index)
for v in p.assets:
 assert (root/v).is_file(),v
assert len(p.assets)==len(set(p.assets))
print('STATIC tasks',len(db['tasks']),'types',len(count),'local assets',len(p.assets))
metrics={'tasks':4037,'targeted_new':168,'targeted_total':584,'type_count':20,'math_checked':0,'focus_variants':0,'ui_flows':0,'validator_cases':{},'widths':{},'errors':[],'local_asset_count':len(p.assets)}
with sync_playwright() as q:
 b=q.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('about:blank')
 page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),clear:()=>m.clear(),key:i=>[...m.keys()][i]??null,get length(){return m.size}}})}''')
 page.set_content((root/'ATLAS_TEK_DOSYA.html').read_text(),wait_until='domcontentloaded',timeout=60000)
 page.wait_for_timeout(150)
 info=page.evaluate('''() => ({tasks:window.ATLAS_DB?.tasks?.length,newCount:window.Atlas620TargetedCoach?.count,applied:window.Atlas620TargetedCoach?.appliedCount,decimal:window.Atlas620TargetedCoach?.decimalCount,modes:window.Atlas620TargetedCoach?.modes?.length,old17:window.Atlas617Tutor?.count,old18:window.Atlas618FractionCoach?.count,old19:window.Atlas619GeometryCoach?.count})''')
 assert info=={'tasks':4037,'newCount':168,'applied':120,'decimal':48,'modes':20,'old17':96,'old18':150,'old19':170},info
 rows=page.evaluate('''() => window.ATLAS_DB.tasks.filter(t=>t.appliedLab||t.decimalLab).map(t=>({id:t.id,part:t.appliedLab?'applied':'decimal',c:t.appliedLab||t.decimalLab,lesson:window.Atlas620TargetedCoach.buildForTests(t.id)}))''')
 reps={}
 for row in rows:
  t=row['id'];c=row['c'];m=c['mode'];L=row['lesson'];key=(row['part'],m);reps.setdefault(key,t)
  assert L and len(L['options'])==3 and len(set(L['options']))==3 and L['correct'] in L['options'] and math.isfinite(L['expected']),(t,L)
  v=int(re.search(r'G(\d+)$',t).group(1))%7
  if row['part']=='applied':
   if m=='sale':expected=(100+v*10)*(1-(10+(v%2)*10)/100)*2+5
   elif m=='recipe':expected=(1+v%3)*2/4
   elif m=='share':expected=(2+v%3)*3/4/(2+v%3)
   elif m=='route':expected=2+v/4+1.5-0.5
   elif m=='budget':expected=(200+v*20)*(.65)
   elif m=='error':expected=(2+v)*2
   elif m=='convert':expected=(2+v)*100
   elif m=='ruler':expected=(25+v*5)/10
   elif m=='choose':expected=(12+v)*10
   elif m=='compare':expected=(2+v)*100
   elif m=='compose':expected=(1+v%2)*1000+234
   elif m=='estimate':expected=200
   else:raise AssertionError(m)
  else:
   n,d=c['numerator'],c['denominator'];g=math.gcd(n,d);red=d//g
   first=(n*10)//d;r1=(n*10)%d;second=(r1*10)//d
   if m in ('divideSteps','divide','remainderTrail'):expected=r1
   elif m in ('denominatorKeys','denominator'):expected=red
   elif m=='decimalDigits':expected=first*10+second
   elif m in ('cycle','match'):expected=first
   else:raise AssertionError(m)
  assert abs(L['expected']-expected)<1e-8,(t,m,L['expected'],expected)
  metrics['math_checked']+=1
 print('MATHEMATICS',metrics['math_checked'])
 fields=['operation','amount','quantity','groups','shareValue','distance','comparison','remaining','result','unitRule','converted','position','unit','sign','length','blocks','remainder','classification','placeValue']
 fieldChecks=page.evaluate('''fields=>window.ATLAS_DB.tasks.filter(t=>t.appliedLab||t.decimalLab).flatMap(t=>fields.map(field=>{const L=window.Atlas620TargetedCoach.buildForTests(t.id,field);return {id:t.id,field,valid:!!L&&new Set(L.options).size===3&&L.options.includes(L.correct)&&Number.isFinite(L.expected)}}))''',fields)
 assert all(v['valid'] for v in fieldChecks),[x for x in fieldChecks if not x['valid']][:10]
 metrics['focus_variants']=len(fieldChecks)
 print('FOCUS VARIANTS',metrics['focus_variants'])
 # UI: only choose test input; app task navigation should be live, not fake display
 for key,id in reps.items():
  page.evaluate('''id=>{for(let k=0;k<2;k++)window.MatematikAtlas64.log({taskId:id,status:'wrong',family:'6. sınıf',fieldKey:'operation',evidence:'module-validator'});window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.id===id))}''',id)
  card=page.locator('#atlas620TargetedCoach')
  assert card.count()==1,(key,id)
  card.locator('.a620-toggle').click()
  L=page.evaluate('''id=>window.Atlas620TargetedCoach.buildForTests(id,'operation')''',id)
  options=card.locator('.a620-option');names=options.all_text_contents();right=names.index(L['correct']);wrong=(right+1)%3
  options.nth(wrong).click();card.locator('.a620-label input').fill(str(L['expected']));card.locator('.a620-check').click()
  assert card.locator('.a620-message').get_attribute('data-kind')=='wrong',(key,card.locator('.a620-message').inner_text())
  options.nth(right).click();card.locator('.a620-label input').fill(str(L['expected']));card.locator('.a620-check').click()
  assert card.locator('.a620-message').get_attribute('data-kind')=='success',(key,card.locator('.a620-message').inner_text())
  assert not page.evaluate('''id=>!!JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')[id]''',id)
  metrics['ui_flows']+=1
 print('UI FLOWS',metrics['ui_flows'])
 print('BEGIN LIVE',flush=True)
 page.evaluate('''() => localStorage.clear()''')
 # Applied: no mathematical choice, or required number blank -> no false wrong.
 id=reps[('applied','sale')]
 page.evaluate('''id=>window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.id===id))''',id)
 getwrong=lambda id:page.evaluate('''id=>window.MatematikAtlas64.getEvents().filter(e=>e.taskId===id&&e.status==='wrong').map(e=>e.fieldKey)''',id)
 assert getwrong(id)==[]
 page.locator('#appliedLab button').filter(has_text='✓ Modelimi doğrula').click()
 assert getwrong(id)==[],('blank wrong',getwrong(id))
 page.locator('#appliedLab .ap-choices button').nth(1).click()
 page.locator('#appliedLab button').filter(has_text='✓ Modelimi doğrula').click()
 assert getwrong(id)==[],('blank numeric wrong',getwrong(id))
 page.locator('#appliedLab input[inputmode=decimal]').fill('1')
 page.locator('#appliedLab button').filter(has_text='✓ Modelimi doğrula').click()
 assert getwrong(id)==['operation'],('applied wrong',getwrong(id))
 page.locator('#appliedLab button').filter(has_text='✓ Modelimi doğrula').click()
 assert getwrong(id)==['operation'],('repeated unchanged answer',getwrong(id))
 page.locator('#appliedLab .ap-choices button').first.click()
 page.locator('#appliedLab button').filter(has_text='✓ Modelimi doğrula').click()
 assert getwrong(id)==['operation','amount'],('new wrong input',getwrong(id))
 assert page.locator('#atlas620TargetedCoach').count()==1
 print('APPLIED LIVE PASSED',flush=True)
 metrics['validator_cases']['applied_sale']='empty/partial not logged; changed mistake tracked, repeat blocked; two fields distinguishable'
 # decimal: sample match needs a choice, wrong selection should be one log then repeated no log
 id=reps[('decimal','match')];page.evaluate('''id=>window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.id===id))''',id)
 assert getwrong(id)==[]
 page.locator('#decimalLab button').filter(has_text='✓ Kartı doğrula').click()
 assert getwrong(id)==[]
 correct=page.evaluate('''id=>window.ATLAS_DB.tasks.find(t=>t.id===id).decimalLab.correct''',id)
 pick=page.locator('#decimalLab .dc-controls button.dc-choice')
 labels=pick.all_text_contents();wrong=next(i for i,x in enumerate(labels) if x!=correct)
 pick.nth(wrong).click()
 page.locator('#decimalLab button').filter(has_text='✓ Kartı doğrula').click()
 assert getwrong(id),('decimal wrong',getwrong(id))
 page.locator('#decimalLab button').filter(has_text='✓ Kartı doğrula').click()
 assert len(getwrong(id))==1,getwrong(id)
 pick.nth(next(i for i,x in enumerate(labels) if x!=correct and i!=wrong)).click()
 page.locator('#decimalLab button').filter(has_text='✓ Kartı doğrula').click()
 assert len(getwrong(id))==2,getwrong(id)
 assert page.locator('#atlas620TargetedCoach').count()==1
 print('DECIMAL LIVE PASSED',flush=True)
 metrics['validator_cases']['decimal_match']='blank not logged; changed wrong observed; repeats blocked'
 # screenshots, responsiveness with coach open
 page.locator('#atlas620TargetedCoach .a620-toggle').click()
 print('BEFORE SCREEN',flush=True)
 page.screenshot(path=str(root/'V620_MOBIL_OGRENME_KOCU.png'),full_page=False,timeout=10000)
 print('AFTER SCREEN',flush=True)
 for w in [320,390,768,1280]:
  page.set_viewport_size({'width':w,'height':844})
  width=page.evaluate('''() => ({scroll:document.documentElement.scrollWidth,inner:window.innerWidth})''')
  metrics['widths'][str(w)]=width;assert width['scroll']<=width['inner'],(w,width)
 # ensure a blocked auxiliary-practice storage writes warning and no fake success
 page.set_viewport_size({'width':390,'height':844})
 L=page.evaluate('''id=>window.Atlas620TargetedCoach.buildForTests(id,'classification')''',id)
 card=page.locator('#atlas620TargetedCoach');names=card.locator('.a620-option').all_text_contents()
 card.locator('.a620-option').nth(names.index(L['correct'])).click()
 card.locator('input').fill(str(L['expected']))
 page.evaluate('''() => {const o=window.localStorage;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>o.getItem(k),setItem:(k,v)=>{if(k==='mathAtlas620Practice')throw Error('Storage denied');o.setItem(k,v)},removeItem:k=>o.removeItem(k)}})}''')
 card.locator('.a620-check').click();assert card.locator('.a620-message').get_attribute('data-kind')=='warning'
 print('AFTER STORAGE',flush=True)
 metrics['storage_denied_warning']=True
 # Primary tasks remain independently solvable using their original validators.
 originalStorage=page.evaluate('''() => {const s=window.localStorage;return {get:s.getItem('mathAtlas940Done')}}''')
 id=reps[('applied','sale')]
 page.evaluate('''id=>window.MatemikAtlasUnused||window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.id===id))''',id)
 app=page.evaluate('''id=>window.ATLAS_DB.tasks.find(t=>t.id===id).appliedLab''',id)
 page.locator('#appliedLab .ap-choices button').first.click()
 page.locator('#appliedLab input[inputmode=decimal]').fill(str(app['answer']))
 page.locator('#appliedLab button').filter(has_text='✓ Modelimi doğrula').click()
 assert page.evaluate('''id=>!!JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')[id]''',id),('applied success not saved',id)
 metrics['validator_cases']['main_applied_correct']='real original validator completion saved'
 id=reps[('decimal','match')]
 page.evaluate('''id=>window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.id===id))''',id)
 c=page.evaluate('''id=>window.ATLAS_DB.tasks.find(t=>t.id===id).decimalLab''',id)
 labels=page.locator('#decimalLab .dc-controls button.dc-choice').all_text_contents()
 page.locator('#decimalLab .dc-controls button.dc-choice').nth(labels.index(c['correct'])).click()
 page.locator('#decimalLab button').filter(has_text='✓ Kartı doğrula').click()
 assert page.evaluate('''id=>!!JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')[id]''',id),('decimal success not saved',id)
 metrics['validator_cases']['main_decimal_correct']='real original validator completion saved'
 id=reps[('decimal','decimalDigits')]
 page.evaluate('''id=>window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.id===id))''',id)
 page.locator('#decimalLab input[placeholder*=Basamak],#decimalLab input[placeholder*=basamak]').count()
 # The optional explanation field is not a mathematical attempt.
 notes=page.locator('#decimalLab input[placeholder*=kesir],#decimalLab input[placeholder*=Basamak]')
 # Find by the actual explanation placeholder, not an answer control.
 note=page.locator('#decimalLab input[placeholder*=ilişkisini]')
 assert note.count()==1
 note.fill('Kalanı hatırlamaya çalışıyorum.')
 page.locator('#decimalLab button').filter(has_text='✓ Ondalık şifreyi doğrula').click()
 assert getwrong(id)==[],('reason-only was incorrectly logged',getwrong(id))
 metrics['validator_cases']['optional_note']='optional written reason alone creates no wrong-attempt event'
 assert not errors,errors
 metrics['errors']=errors
 (root/'qa_v620_results.json').write_text(json.dumps(metrics,ensure_ascii=False,indent=2))
 print('PASS',json.dumps(metrics,ensure_ascii=False))
 b.close()
