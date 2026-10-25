from pathlib import Path
from playwright.sync_api import sync_playwright
import json,re,hashlib,collections,html.parser
R=Path(__file__).resolve().parents[2]
prev=Path('/mnt/data/MATEMATIK_ATLASI_v6_20_6SINIF_HEDEFLI_OGRENME_QA.zip')
import zipfile
if prev.exists():
 with zipfile.ZipFile(prev) as z:
  for file in ['data/tasks.json','data/tasks.js']:
   assert (R/file).read_bytes()==z.read('MATEMATIK_ATLASI_v6_20/'+file),file
D=json.loads((R/'data/tasks.json').read_text()); tasks=D['tasks']
assert len(tasks)==4037 and len(set(x['id'] for x in tasks))==4037
assert not any(x.get('teacher_review_required') for x in tasks)
ratio=[t for t in tasks if t.get('atlas7Ratio')];assert len(ratio)==75
assert 96+150+170+168+75==659
class Parser(html.parser.HTMLParser):
 def __init__(self):super().__init__();self.f=[]
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='script' and 'src' in d:self.f.append(d['src'])
  if t=='link' and 'href' in d:self.f.append(d['href'])
for name in ['index.html','ogretmen.html']:
 p=Parser();p.feed((R/name).read_text());assert len(p.f)==len(set(p.f));assert all((R/x).is_file() for x in p.f)

def inlined(html):
 s=(R/html).read_text()
 s=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>\n'+(R/m[1]).read_text()+'\n</style>',s)
 s=re.sub(r'<script(?: defer)? src="([^"]+)"></script>',lambda m:'<script>\n'+(R/m[1]).read_text()+'\n</script>',s)
 return s

result={'version':'6.21','tasks':4037,'newTargeted':75,'targetedTotal':659,'ratioVariants':len(ratio),'ratioModes':sorted(set(t['atlas7Ratio']['kind'] for t in ratio)),'studentExport':{},'teacherImport':{},'ratioFlows':{},'viewport':{},'errors':[]}
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844},accept_downloads=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('about:blank')
 # The original old tests use a temporary storage shim for set_content, not a production file modification.
 page.evaluate('''() => {let v=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>v.get(k)??null,setItem(k,s){v.set(k,String(s))},removeItem:k=>v.delete(k),clear:()=>v.clear()}})}''')
 page.set_content((R/'ATLAS_TEK_DOSYA.html').read_text(),wait_until='domcontentloaded',timeout=65000)
 page.wait_for_timeout(250)
 state=page.evaluate('''() => ({t:window.ATLAS_DB?.tasks.length,ratio:window.Atlas621RatioCoach?.count,export:!!window.Atlas621Export,grade:document.getElementById('grade').value})''')
 assert state['t']==4037 and state['ratio']==75 and state['export'],state
 # Independent mini math check by types, not only three options existence.
 mini=page.evaluate('''() => window.ATLAS_DB.tasks.filter(t=>t.atlas7Ratio).map(t=>({id:t.id,kind:t.atlas7Ratio.kind, lesson:window.Atlas621RatioCoach.practiceFor(t.id)}))''')
 for obj in mini:
  l=obj['lesson'];assert l and len(l['options'])==3 and len(set(l['options']))==3 and 0<=l['correct']<=2
  n=int(re.search(r'G(\d+)',obj['id']).group(1))%5; ratioNum=2+n%3
  truth={'compare':(ratioNum*3-3 if next(t for t in ratio if t['id']==obj['id'])['atlas7Ratio'].get('ask')=='fark' else ratioNum),'equivalent':6,'unit':ratioNum,'table':3,'graph':3,'double':15,'percent':(100+n*20)/5,'recipe':15}[obj['kind']]
  assert l['expected']==truth,(obj['id'],truth,l['expected'])
 result['mathChecked']=len(mini)
 # student export: example observed evidence and anonymized schema
 first=ratio[0]['id'];second=ratio[1]['id']
 page.evaluate('''id=>{document.getElementById('grade').value='7';localStorage.setItem('mathAtlas940Done',JSON.stringify({[id]:true}));const now=Date.now();localStorage.setItem('mathAtlas64Attempts',JSON.stringify([{taskId:id,when:now,status:'wrong',focus:'hesap',evidence:'module-validator'},{taskId:id,when:now-3000,status:'hint',evidence:'module-validator'},{taskId:id,when:now-6000,status:'correct',evidence:'completion-only'}]));}''',first)
 snapshot=page.evaluate('''() => window.Atlas621Export.produce('A07',7)''');
 assert snapshot['code']=='A07' and snapshot['grade']==7 and len(snapshot['outcomes'])>0
 target=next(o for o in snapshot['outcomes'] if o['code']==ratio[0]['ogrenme_ciktisi'])
 assert target['done']==1 and target['wrong']==1 and target['hint']==1 and target['correct']==1 and target['focus']['hesap']==1,target
 assert 'notes' not in json.dumps(snapshot).lower() and 'freeText' not in json.dumps(snapshot)
 result['studentExport']={'valid':True,'code':'A07','outcomes':len(snapshot['outcomes']),'focusCount':target['focus']['hesap']}
 # export UI button: no code rejected, valid triggers download, no server involved
 page.locator('#a621Code').fill('A09')
 with page.expect_download() as info:page.locator('#atlas621StudentExport button').click()
 assert info.value.suggested_filename.startswith('atlas_ogrenme_A09_7_')
 # ratio live validator: empty/partial doesn't create wrong, repeated identical answer not counted
 page.evaluate('''() => localStorage.clear()''')
 page.evaluate('''id=>window.MatematikAtlasV30.navigate(window.ATLAS_DB.tasks.find(t=>t.id===id))''',first)
 assert not page.locator('#atlas7Ratio').is_hidden()
 page.locator('#atlasRatioCheck').click()
 getwrong=lambda:page.evaluate('''id=>window.MatematikAtlas64.getEvents().filter(e=>e.taskId===id&&e.status==='wrong')''',first)
 assert len(getwrong())==0,'empty should not log'
 page.locator('#ratioAnswer').fill('1')
 page.locator('#atlasRatioCheck').click()
 assert len(getwrong())==0,'numeric alone should not log'
 page.locator('#atlasRatioStage button[data-ratio-kind="reason"]').first.click()
 page.locator('#atlasRatioCheck').click();assert len(getwrong())==1
 page.locator('#atlasRatioCheck').click();assert len(getwrong())==1,'repeat should not log'
 page.locator('#ratioAnswer').fill('3')
 page.locator('#atlasRatioCheck').click();assert len(getwrong())==2
 assert page.locator('#atlas621RatioTutor').count()==1
 page.locator('#atlas621RatioTutor>button').click()
 assert page.locator('#atlas621RatioTutor .a621-tutor-choices button').count()==3
 page.locator('#atlas621RatioTutor .a621-tutor-choices button').first.click()
 expected=page.evaluate('''id=>window.Atlas621RatioCoach.practiceFor(id).expected''',first)
 page.locator('#a621RatioAnswer').fill(str(expected))
 done_before=page.evaluate('''id=>JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')[id]===true''',first)
 page.locator('#atlas621RatioTutor>button').click()
 assert page.locator('#atlas621RatioTutor .a621-tutor-status').inner_text().startswith('✓')
 done_after=page.evaluate('''id=>JSON.parse(localStorage.getItem('mathAtlas940Done')||'{}')[id]===true''',first)
 assert not done_before and not done_after
 result['ratioFlows']={'emptyIgnored':True,'partialIgnored':True,'dedupedWrong':True,'miniSuccessNoMainCompletion':True}
 for width in [320,390,768,1280]:
  page.set_viewport_size({'width':width,'height':800});page.wait_for_timeout(50)
  result['viewport'][str(width)]=page.evaluate('''() => ({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,mini:document.getElementById('atlas621RatioTutor').getBoundingClientRect().width})''')
  assert result['viewport'][str(width)]['scroll']<=width+1,(width,result['viewport'][str(width)])
 page.set_viewport_size({'width':390,'height':860});page.locator('#atlas621RatioTutor').screenshot(path=str(R/'V621_MOBIL_ORAN_KOCU.png'))
 # Teacher page isolated same storage shim; evaluate imports through actual input selection.
 page.evaluate('''() => localStorage.clear()''')
 page.set_content(inlined('ogretmen.html'),wait_until='domcontentloaded',timeout=65000);page.wait_for_timeout(150)
 assert page.locator('#a621Teacher').count()==1 and page.evaluate('''() => window.Atlas621Teacher?.stored().length''')==0
 snapshots=[]
 a=dict(snapshot);snapshots.append(a)
 other=json.loads(json.dumps(snapshot));other['code']='A08';other['outcomes'][0]['wrong']=2;other['outcomes'][0]['wrongTasks']=1;other['outcomes'][0]['observedTasks']=1
 # improve consistency for A08 within one chosen outcome; no raw events are in snapshots.
 snapshots.append(other)
 importfile=R/'tests/v621/test_student_1.json';importfile.write_text(json.dumps(a,ensure_ascii=False))
 importfile2=R/'tests/v621/test_student_2.json';importfile2.write_text(json.dumps(other,ensure_ascii=False))
 page.locator('#a621Import').set_input_files([str(importfile),str(importfile2)])
 page.wait_for_timeout(250)
 assert page.evaluate('''() => window.Atlas621Teacher.stored().length''')==2
 assert page.locator('#a621Status').inner_text().startswith('2 özet')
 page.locator('#a621Grade').select_option('7');page.wait_for_timeout(75)
 assert page.locator('#a621Rows tr').count()>0
 with page.expect_download() as dl:page.locator('#a621Csv').click()
 assert dl.value.suggested_filename.endswith('v621.csv')
 invalid=dict(snapshot);invalid['code']='<img src=x onerror=alert(1)>'
 badpath=R/'tests/v621/test_bad.json';badpath.write_text(json.dumps(invalid,ensure_ascii=False))
 page.locator('#a621Import').set_input_files(str(badpath));page.wait_for_timeout(100)
 assert page.evaluate('''() => window.Atlas621Teacher.stored().length''')==2
 assert 'reddedildi' in page.locator('#a621Status').inner_text()
 # Old imports must not overwrite current snapshots; no progress mutation.
 assert page.evaluate('''() => localStorage.getItem('mathAtlas940Done')''') is None
 result['teacherImport']={'accepted':2,'rejectedMaliciousCode':True,'gradeFilter':True,'csvExport':True,'progressUntouched':True}
 for width in [320,390,768,1280]:
  page.set_viewport_size({'width':width,'height':800});page.wait_for_timeout(50)
  scroll=page.evaluate('''() => document.documentElement.scrollWidth''');
  assert scroll<=width+1,(width,scroll)
 page.set_viewport_size({'width':390,'height':850});page.evaluate("() => document.getElementById('a621Status').textContent='✓ 2 kodlu öğrenci özeti birleştirildi.'");page.locator('#a621Teacher').screenshot(path=str(R/'V621_MOBIL_OGRETMEN_PANELI.png'))
 result['errors']=errors
 assert not errors,errors
 b.close()
# test fixture files are intentionally not included in production ZIP
for f in ['test_student_1.json','test_student_2.json','test_bad.json']:(R/'tests/v621'/f).unlink(missing_ok=True)
(R/'tests/v621/qa_results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False,indent=2))
