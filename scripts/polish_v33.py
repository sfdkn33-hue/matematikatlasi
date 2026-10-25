"""One-time v3.3 data spelling and number-presentation polish; run before build_standalone."""
from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
p=R/'data/tasks.json';d=json.loads(p.read_text(encoding='utf8'))
changed=[]
for t in d['tasks']:
 c=t.get('number5PlusLab',{})
 if c.get('mode')=='missingDigits':
  for f in c['fields']:
   if isinstance(f.get('answer'),str) and 'ikiyüz' in f['answer']:
    f['answer']=f['answer'].replace('ikiyüz','iki yüz');changed.append(t['id'])
   if 'options' in f:f['options']=[x.replace('ikiyüz','iki yüz') if isinstance(x,str) else x for x in f['options']]
assert sorted(set(changed))==['MAT.5.1.1-G69','MAT.5.1.1-G70']
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(R/'data/tasks.js').write_text('/* GENERATED from tasks.json; do not edit directly. */\nwindow.ATLAS_DB='+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
# First non-zero numeric group reads 7 million, not 007 million.
js=R/'assets/js/number5plus.js';s=js.read_text(encoding='utf8')
old="String(parts[i]).padStart(i===0?1:3,'0')"
new="String(parts[i]).padStart(i===parts.findIndex(x=>x!==0)?1:3,'0')"
assert s.count(old)==1;s=s.replace(old,new);js.write_text(s,encoding='utf8')
print('Polished thousands spelling and highest occupied place-value group.')
