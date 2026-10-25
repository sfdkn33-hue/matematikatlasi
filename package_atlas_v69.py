from pathlib import Path
import json,copy,collections,re,hashlib,subprocess,zipfile,shutil,html
R=Path('/mnt/data/atlas_v69_src');P=Path('/mnt/data'); prev=Path('/mnt/data/atlas_v68_src');old=json.loads((prev/'data/tasks.json').read_text());db=json.loads((R/'data/tasks.json').read_text());arr=old['tasks'];cur=db['tasks'];a=json.loads((R/'tests/QA_V69_BROWSER.json').read_text());
assert len(arr)==len(cur)==4037
assert [t['id'] for t in arr]==[t['id'] for t in cur]
modified=[(o,n) for o,n in zip(arr,cur) if o!=n]
assert len(modified)==48
assert all(n.get('atlas69Workbench') and n.get('atlas63Pilot') for o,n in modified)
assert len({t['id'] for t in cur})==4037
assert len(db['outcomes'])==130
assert len([x for x in cur if x.get('atlas63Pilot')])==200
assert all(x['mode'] in ['order','choice','slider'] for x in json.loads((R/'data/atlas69_changes.json').read_text()))
assert a['allPassed'] and a['countSaved']==48 and a['attempts']==48 and not a['errors'] and all(a[k] for k in ('legacyBypassBlocked','wrongModelBlocked','blockedSaveNotRecorded','storageWarning','oldProgressPreserved'))
assert all(not a['overflow'+str(w)] for w in (320,390,768,1280))
# Mathematical independent consistency checks
import math
for o,t in modified:
 m=t['atlas69Workbench'];v=m['scene'];target=m['number']['expected'];fid=t['id'];mode=m['mode']
 if v['kind']=='fraction':
  if 'sadeleşmiş payda' in t['gorev'] or 'paydayı' in t['gorev'].lower(): assert target==v['denominator']//math.gcd(v['numerator'],v['denominator'])
  if mode=='order': assert m['expected']==list(str(v['numerator']*100//v['denominator']).zfill(2))
 if v['kind']=='division':assert target==(v['numerator']*10)%v['denominator']
 if v['kind']=='machine':
  if 'input' in v:
   assert target==(v['a']*v['input'] if mode=='choice' and 'output' not in v and v.get('wrong') is None else v['a']*v['input']+v['b'])
  if 'wrong' in v:assert v['wrong']==v['a']*v['input']-v['b']
  if 'output' in v:assert int(m['expected'])==(v['output']-v['b'])//v['a']
 if v['kind']=='parallelogram':assert target==v['base']*v['height']
 if v['kind']=='triangle':assert target==v['area']*2/v['base'] if 'area' in v else target==v['base']*v['height']/2
 if v['kind']=='arc':
  if mode=='slider':assert target==v['angle']//math.gcd(v['angle'],360)
  elif 'arcCoefficient' in v:assert target==2*v['radius']
  else:assert target==2*v['radius']*v['angle']/360
# data format, source references, final HTML built
assert json.loads((R/'data/tasks.js').read_text().removeprefix('window.ATLAS_DB=').rstrip().removesuffix(';'))==db
from bs4 import BeautifulSoup
soup=BeautifulSoup((R/'index.html').read_text(),'html.parser')
refs=[e.get('href') for e in soup.select('link[rel=stylesheet][href]')]+[e.get('src') for e in soup.select('script[src]')]
assert all((R/ref).exists() for ref in refs)
assert (R/'ATLAS_TEK_DOSYA.html').stat().st_size>5e6
assert 'atlas69Lab' in (R/'ATLAS_TEK_DOSYA.html').read_text()

def norm(s):return re.sub(r'\b\d+(?:[,.]\d+)?\b','#',str(s).casefold()).strip()
def stats(tasks,grade=6):
 by=collections.Counter(norm(t.get('gorev','')) for t in tasks if str(t.get('sinif'))==str(grade))
 return {'templates':len(by),'extra':sum(c-1 for c in by.values()),'groups5':sum(c>=5 for c in by.values())}
oldstats=stats(arr);newstats=stats(cur);print('normalization',oldstats,newstats)
md=f'''# Matematik Atlası v6.9 — 6. Sınıf Soru Çeşitliliği ve Ana Oyun Yenileme

**Durum:** Kontrollü yerel test tamamlandı · 24 Ekim 2026. Canlı GitHub değiştirilmedi.

## Neler değişti?

- **Görev sayısı:** 4.037 → **4.037** (hiçbir yeni görev numarası/ID yok).
- **Yeniden tasarlanan ana görev:** **48**; dört 6. sınıf kazanımında **12'şer** eski görev.
- **Önceden tamamlanan görevler:** `mathAtlas940Done` kayıt anahtarı ve bütün görev ID/sırası korundu; eski tamamlanma işaretleri yeni ustalık kanıtı sayılmıyor.
- **Takipli pilot:** 152 → **200**; bu 48 göreve ilk deneme, yanlış ve ipucu bilgisi eklenebilir. Gerçek öğrenci ortamında doğrulanmadı.
- **Öğretmen onayı:** Yok; bütün yeni matematik doğrulamaları otomatik.

| Kazanım | Çalışılan ana soru aileleri | Yenilenen |
|---|---|---:|
| `MAT.6.1.6` Kesir–bölme–ondalık | Ondalık basamak kartları; payda asal çarpan analizi; ilk bölüm/kalan | 12 |
| `MAT.6.2.3` Algoritma | Akış sıralama; bozuk makineyi bulma; işlemi tersine çözme | 12 |
| `MAT.6.4.2` Alan | Paralelkenarı kaydırma; eş üçgenle tamamlama; alanı tersine tasarlama | 12 |
| `MAT.6.4.6` Merkez açı–yay | Sürgüyle açı; π katsayılı yay uzunluğu; yaydan açıya gitme | 12 |

Bu on iki **soru ailesi**, üç temel karar sistemiyle (kart sıralama, seçim, sürgü) ve dört konuya özgü görsel modelle uygulanmıştır. **12 ayrı oyun motoru** ya da **tüm soru türleri tamamlandı** anlamına gelmez. Her ailede sayısal parametreleri değişen dört görev vardır.

## Veri / kapsam

- Eski **4.037 görev kimliği ve sırası birebir aynı**; tam **48 görev nesnesi** değiştirildi.
- Diğer **3.989 görev nesnesi birebir aynı**.
- Eski kazanım sayısı **130 kod**; tüm kodların en az bir görevi vardır.
- `tasks.json` ve `tasks.js` senkron; ZIP içindeki `index.html`, `ATLAS_TEK_DOSYA.html` aynı v6.9 içerik bankasını kullanır.
- 6. sınıf sayısal metin şablonu göstergesi: önce **{oldstats['extra']}**, sonra **{newstats['extra']}** fazladan kullanım; ≥5 tekrar grubu önce **{oldstats['groups5']}**, sonra **{newstats['groups5']}**. Bu otomatik metin analizi pedagojik çeşitliliğin eksiksiz ölçüsü değildir.

## QA — Kontrollü Chromium (gerçek sınıf testi değil)

| Test | Sonuç |
|---|---|
| Bütün 48 görevin yeni laboratuvarda görünmesi | **48/48** |
| Boş çözümün tamamlanmayı engellemesi | **48/48** |
| Yalnız doğru sayı girme, yanlış/boş model | **48/48 reddedildi** |
| Yalnız doğru model, sayı boş | **48/48 reddedildi** |
| Model ve sayının doğru olunca kayıt oluşması | **48/48** |
| 48 doğru denemenin `mathAtlas64Attempts` geçmişine kaydı | **48/48** |
| Genel eski cevap düğmesinden atlama | **Engellendi** |
| Dolu ama yanlış model + doğru sayı | **Engellendi** |
| Tarayıcı kaydı engellendiğinde görevün tamamlanmış görünmemesi | **Doğrulandı** |
| Kayıt hatasında yedekleme uyarısının görünmesi | **Doğrulandı** |
| Örnek eski görevün tamamlanma kaydının korunması | **Doğrulandı** |
| 320/390/768/1280 piksel yatay taşma | **Görülmedi** |
| Sayfa JavaScript hatası | **0** |

Test sonuçları: `tests/QA_V69_BROWSER.json`. İlk denemede testin kayıt doğrulaması başarısız çıktı çünkü yeni laboratuvar ile eski `beklenen_yanit_veya_rubrik` doğrulaması eşleşmiyordu. Ana doğrulamayı atlatmadan **iç doğrulama anahtarı** düzeltildi ve 48 test yeniden başarıyla tamamlandı.

## Sınırlar ve sonraki adımlar

1. Bu 48 görev dışında kalan **3.989 görev için matematiksel uzman çözüm denetimi yapılmadı**; sorunların kalmamış olduğu iddia edilmez.
2. Soru ailelerindeki dört benzer parametreli varyant hâlâ pekiştirme tekrarıdır. Daha çeşitli görsel manipülasyonlar ve günlük yaşam bağlamları için sonraki turlar gerekir.
3. 130 kodun tüm alt becerileri tek tek resmî metinle karşılaştırılmış değildir.
4. Yeni sürümde aralıklı tekrar geçmişi **200 etiketli görev** için izlenebilir; diğer eski görevlerin ayrıntılı deneme geçmişi yoktur.
5. Öğretmen paneli, başka cihazlardan ödev sonuçlarını alamaz; gerçek sunucu / hesap / senkronizasyon sistemi kurulmadı.
6. `content://` üzerinden Android depolama davranışı ve gerçek öğrenci pilotu henüz doğrulanmadı.
'''
(R/'QA_v69_RAPORU.md').write_text(md)
(R/'README_v69.md').write_text('# Matematik Atlası v6.9\n\nAna giriş `index.html`; çevrimdışı tek HTML `ATLAS_TEK_DOSYA.html`. Veri `data/tasks.json` ve `data/tasks.js`. 48 mevcut görev yeniden tasarlandı. `QA_v69_RAPORU.md` testlerin ayrıntılarını içerir. Canlı GitHub değiştirilmedi.\n')
# simple standalone pedagogical change inventory
families=collections.defaultdict(list)
for o,n in modified:families[n['ogrenme_ciktisi']].append(n['atlas69Workbench']['family'])
rows=[]
for code,f in families.items():
 out=next(x for x in db['outcomes'] if x['kod']==code)
 examples=' '.join('<span class="chip">'+html.escape(x)+'</span>' for x in dict.fromkeys(f))
 rows.append(f'<article><h2>{html.escape(code)} · {html.escape(out["etiket"])}</h2><p>12 eski görev yeniden tasarlandı. Görev kimlikleri korundu.</p><div>{examples}</div></article>')
page='''<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Matematik Atlası v6.9 · Yenilenen kazanımlar</title><style>body{font-family:system-ui,-apple-system,sans-serif;background:#f4f8fd;color:#173b55;margin:0;line-height:1.5}main{max-width:930px;margin:auto;padding:20px}h1{font-size:clamp(24px,5vw,38px)}article{background:white;border:1px solid #b5d2e5;border-radius:15px;padding:19px;margin:14px 0}.chip{display:inline-block;color:#155075;border:1px solid #b2cee0;padding:8px 10px;border-radius:8px;background:#eaf5fc;margin:4px}.note{padding:14px;background:#fff3df;border-radius:10px;color:#674514}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:10px}.metric{padding:14px;background:#e5f3ff;border-radius:10px}.metric b{font-size:27px;display:block}</style></head><body><main><h1>Matematik Atlası v6.9 · Soru Çeşitliliği</h1><p>Yeni görev sayısını artırmadan, dört 6. sınıf kazanımındaki ana çözüm yollarını yeniledik.</p><div class="grid"><div class="metric"><b>4.037</b>Görev korundu</div><div class="metric"><b>48</b>Yenilenen ana görev</div><div class="metric"><b>12</b>Farklı soru ailesi</div><div class="metric"><b>200</b>Denemesi izlenebilen pilot</div></div><p class="note"><b>Sınır:</b> Dört kazanım için yeni yaklaşımlar eklemek, tüm müfredatın soru türleriyle tamamlandığı anlamına gelmez. Bu ekran öğrenme başarısı ölçümü değildir.</p>'''+''.join(rows)+'''<p>Test ve dosya ayrıntıları için QA_v69_RAPORU.md dosyasına bakın. Öğretmen onayı yoktur. Canlı GitHub güncellenmedi.</p></main></body></html>'''
(R/'V69_SORU_AILELERI.html').write_text(page)
# exact final standalone rebuilt from modular
subprocess.run(['python',str(R/'scripts/build_standalone.py')],check=True)
files={'MATEMATIK_ATLASI_v6_9_TEK_DOSYA.html':R/'ATLAS_TEK_DOSYA.html','MATEMATIK_ATLASI_v6_9_QA_RAPORU.md':R/'QA_v69_RAPORU.md','MATEMATIK_ATLASI_v6_9_SORU_AILELERI.html':R/'V69_SORU_AILELERI.html'}
for name,src in files.items():shutil.copyfile(src,P/name)
# source scripts inside archive
for src in [P/'build_atlas_v69.py',P/'qa_atlas_v69.py',P/'package_atlas_v69.py']:
 shutil.copyfile(src,R/src.name)
archive=P/'MATEMATIK_ATLASI_v6_9_48_GOREV_PEDAGOJIK_YENILEME_QA.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for f in R.rglob('*'):
  if f.is_file():z.write(f,'MATEMATIK_ATLASI_v6_9/'+str(f.relative_to(R)))
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 assert z.read('MATEMATIK_ATLASI_v6_9/ATLAS_TEK_DOSYA.html')==files['MATEMATIK_ATLASI_v6_9_TEK_DOSYA.html'].read_bytes()
 assert len(json.loads(z.read('MATEMATIK_ATLASI_v6_9/data/tasks.json'))['tasks'])==4037
 print('ARCHIVE_FILES',len(z.namelist()))
for name in [archive,*[P/n for n in files]]:assert name.exists() and name.stat().st_size>1000;print(name,name.stat().st_size)
