#!/usr/bin/env python3
"""Upgrade v1.7 DB to v1.8 6th-grade algebra - deterministic content builder.
Run only on v1.7 source. Does not overwrite prior IDs.
"""
from pathlib import Path
import json, copy, collections
ROOT=Path(__file__).resolve().parents[1]
path=ROOT/'data/tasks.json'
db=json.loads(path.read_text(encoding='utf-8'))
assert len(db['tasks'])==1320, 'This migration should be applied only to v1.7 (1320 tasks)'
contexts=['Okul kütüphanesi','Limon bahçesi','Bilet gişesi','Fidanlık','Bilim şenliği','Hayvan barınağı','Sınıf kantini','Bisiklet parkı','Tiyatro salonu','Yardım kampanyası']
roles=['Araştırmacı','Mühendis','Dedektif','Tasarımcı','Veri uzmanı','Kâşif','Programcı','Planlamacı','Matematikçi','Stratejist']
stages=['Keşfet','Modelle','Karşılaştır','Sına','Açıkla']
def field(name,label,ans,kind='number',options=None,lo=None,hi=None,step=None):
    d={'key':name,'label':label,'kind':kind,'answer':ans}
    if options is not None:d['options']=options
    if lo is not None:d['min']=lo
    if hi is not None:d['max']=hi
    if step is not None:d['step']=step
    return d
MODE_DEF={
'6.2.1':[
 ('costTable','Değişkenli maliyet tablosu'),('expressionCards','Cebirsel ifade kartları'),('machineDial','Sayı makinesi ayarı'),
 ('reverseInput','Tersine giden sayı makinesi'),('budgetSim','En büyük uygun alışveriş'),('storyMatch','İfadeye uygun hikâyeyi bul'),('balanceBuilder','Tablodan katsayı ve sabiti keşfet')],
'6.2.2':[
 ('stepTiles','Şekil örüntüsü inşası'),('tableMissing','Eksik örüntü tablosu'),('ruleCards','Genel terim kartları'),
 ('graphPoint','Grafik noktasını yerleştir'),('spotError','Bozuk örüntüyü yakala'),('polygonInterior','Üçgenlere ayırarak iç açı toplamı'),('exteriorAngle','Düzgün çokgende dış açı avcısı')],
'6.2.3':[
 ('flowOrder','Akış şeması sıralama'),('algorithmTrace','Algoritma izleme'),('bugHunt','Hatalı adımı bul'),
 ('ifBranch','Koşullu dal seçimi'),('tableFromAlgo','Algoritmadan tablo üret'),('codeMatch','Sözde kodu eşleştir'),('repairAlgo','Yanlış işlemi onar')]
}
MODE_INFO={m:(code,title) for code,modes in MODE_DEF.items() for m,title in modes}
existing={x['id']:x for x in db['tasks']}
new=[]
for codekey,modes in MODE_DEF.items():
 code='MAT.'+codekey
 for j,(mode,name) in enumerate(modes):
  for i in range(10):
   num=j*10+i+1; taskid=f'{code}-G{num:02d}'
   # Pick diverse but comprehensible deterministic parameters, never rely on random math truths.
   a=2+(i+j)%7; b=3+((3*i+2*j)%16); n=2+(i*2+j)%9
   if a==b:b+=2
   if mode=='tableMissing':n=5+(i+j)%8
   c={'mode':mode,'a':a,'b':b,'n':n,'fields':[],'scene':contexts[i],'kind':codekey}
   query=''; hint=''
   if mode=='costTable':
    c['ns']=[1,3,5]
    c['fields']=[field('v'+str(k),f'{k} ürün için toplam maliyet (TL)',a*k+b) for k in c['ns']]
    query=f'{contexts[i]}: Birim bedel {a} TL, tek seferlik hazırlık {b} TL. 1, 3 ve 5 ürün için maliyet tablosunu oluştur.'
    hint='Sabit bedel yalnız bir kez alınır: maliyet = birim bedel × adet + sabit bedel.'
   elif mode=='expressionCards':
    options=[f'{a}n + {b}',f'{b}n + {a}',f'{a}n - {b}',f'{a+b}n']
    c['fields']=[field('formula','Maliyeti veren cebirsel ifadeyi seç',options[0],'choice',options)]
    query=f'Her ürünün maliyeti {a} TL ve her siparişte sabit {b} TL ödeniyor. n ürün için hangi ifade doğrudur?'
    hint='Ürün sayısı değişkendir; sabit ücret n ile çarpılmaz.'
   elif mode=='machineDial':
    target=a*n+b;c['fields']=[field('in','Makineye girilecek sayıyı ayarla',n,'range',lo=0,hi=20,step=1)]
    c['target']=target;query=f'Sayı makinesi önce {a} ile çarpıyor, sonra {b} ekliyor. Çıktı {target} olsun: giriş sayısını ayarla.'
    hint=f'Önce {b} çıkar, sonra {a} ile böl.'
   elif mode=='reverseInput':
    c['target']=a*n+b;c['fields']=[field('in','Bilinmeyen başlangıç sayısı',n)]
    query=f'Sayı makinesinin kuralı {a}x + {b}. Ekran {c["target"]} gösteriyor. x kaçtır?'
    hint='Çıktıdan sabiti çıkarıp katsayıya böl.'
   elif mode=='budgetSim':
    c['target']=n;c['budget']=a*n+b;c['fields']=[field('quantity','Bütçeyi aşmadan alınabilecek en çok ürün',n,'range',lo=0,hi=20,step=1)]
    query=f'Her fidan {a} TL, teslimat {b} TL. Bütçen {c["budget"]} TL. En çok kaç fidan alabilirsin?'
    hint='n fidanın maliyeti a×n+b. Bir fidan daha eklersen bütçe aşılmalı.'
   elif mode=='storyMatch':
    opts=[f'Ürün başı {a} TL, x adet ve {b} TL sabit ücret',f'Ürün başı {b} TL, x adet ve {a} TL sabit ücret',f'Ürün başı {a} TL, x adet ve {b} TL indirim',f'Ürün başı {a+b} TL, x adet ve ek ücret yok']
    c['fields']=[field('story',f'{a}x+{b} ifadesine hangi hikâye uyar?',opts[0],'choice',opts)]
    query=f'Bir matematiksel model {a}x + {b}. x adet ürüne bağlı değişkeni ve sabit maliyeti doğru açıklayan hikâyeyi seç.'
    hint='x ile çarpılan nicelik ürün başı tutar, x içermeyen nicelik sabit gider.'
   elif mode=='balanceBuilder':
    c['ns']=[2,5];c['fields']=[field('a','Bir ürünün bedeli / x’in katsayısı',a),field('b','Sabit ücret (TL)',b)]
    query=f'Tabloda 2 ürün {2*a+b} TL, 5 ürün {5*a+b} TL. x ürünün maliyeti ax+b olsun. a ve b’yi bul.'
    hint='Üç ürün artışının maliyet farkını 3’e bölüp a’yı bul, ardından b’yi hesapla.'
   elif mode=='stepTiles':
    c['fields']=[field('term',f'{n}. adımdaki kare sayısı',a*n+b)]
    query=f'Sanal kare örüntüsünde n. adım {a}n+{b} kareden oluşuyor. {n}. adımı kurup toplam kare sayısını yaz.'
    hint=f'{a} karelik adımlar {n} kez tekrarlanır, baştaki {b} kare eklenir.'
   elif mode=='tableMissing':
    c['fields']=[field('missing',f'{n}. adımdaki eksik terim',a*n+b)]
    query=f'Örüntü tablosunda 1. adım {a+b}, 2. adım {2*a+b}, 3. adım {3*a+b}. {n}. adımın değeri nedir?'
    hint=f'Her yeni adımda {a} artar; ilk terim ile adım numarasının ilişkisini incele.'
   elif mode=='ruleCards':
    opts=[f'{a}n + {b}',f'{a+b}n',f'{b}n + {a}',f'{a}n + {b+2}']
    c['fields']=[field('rule','Örüntünün n. adımını veren kural',opts[0],'choice',opts)]
    query=f'Örüntü: {a+b}, {2*a+b}, {3*a+b}, {4*a+b}, ... Hangi cebirsel kural bütün adımlarda geçerlidir?'
    hint='Artış miktarı n’nin katsayısını verir. İlk terimdeki sabiti kontrol et.'
   elif mode=='graphPoint':
    c['target']=a*n+b;c['fields']=[field('x','Grafikte adım (x)',n,'range',lo=0,hi=15,step=1),field('y','Grafikte terim (y)',c['target'],'number')]
    query=f'n. terimi {a}n+{b} olan örüntünün {n}. adımını (x,y) grafiğine yerleştir.'
    hint='Yatay eksen adım, düşey eksen terim sayısıdır.'
   elif mode=='spotError':
    c['ns']=[1,2,3,4];c['errorAt']=i%4;c['shown']=[a*k+b+(2 if ix==c['errorAt'] else 0) for ix,k in enumerate(c['ns'])]
    c['fields']=[field('row','Hatalı değer hangi adımda?',c['ns'][c['errorAt']],'choice',c['ns'])]
    query='Bir örüntü tablosunda tek bir hesaplama yanlıştır. Hatalı satırı bul; doğru kuralı kullanarak karşılaştır.'
    hint='Komşu terimler her seferinde aynı miktarda artmalı; tek hatayı belirle.'
   elif mode=='polygonInterior':
    sides=3+(i%8);c['sides']=sides;c['fields']=[field('tri','Bir köşeden kaç üçgen oluşur?',sides-2),field('sum','İç açılar toplamı (derece)',(sides-2)*180)]
    query=f'{sides} kenarlı çokgeni bir köşesinden köşegenlerle üçgenlere ayır. Üçgen sayısını ve iç açılar toplamını bul.'
    hint='Bir köşeden oluşturulan üçgen sayısı n−2; her üçgenin iç açılar toplamı 180°.'
   elif mode=='exteriorAngle':
    sides=[3,4,5,6,8,9,10,12,15,18][i];c['sides']=sides;c['fields']=[field('angle','Bir dış açı (derece)',360//sides)]
    query=f'{sides} kenarlı düzgün çokgende bir dış açı kaç derecedir? Dönüş turunu 360° kabul et.'
    hint='Düzgün çokgende bütün dış açılar eşittir ve toplamları 360°.'
   elif mode=='flowOrder':
    c['steps']=['Girdiyi oku',f'{a} ile çarp',f'{b} ekle','Çıktıyı yaz'];c['fields']=[field('order','Akış adımlarını doğru sıraya koy',c['steps'],'order',list(reversed(c['steps'])))]
    query=f'x sayısından {a}x+{b} üreten algoritma kartlarını başlangıçtan bitişe sırala.'
    hint='Önce girdi, sonra işlem, sonra sonuç gösterimi. Çarpma toplamanın önündedir.'
   elif mode=='algorithmTrace':
    c['fields']=[field('mul',f'{n} girdisini {a} ile çarpınca',n*a),field('out',f'Sonra {b} eklenince çıktı',n*a+b)]
    query=f'Algoritma x={n} alıyor, önce {a} ile çarpıyor, sonra {b} ekliyor. Ara değer ve son değeri bul.'
    hint='İşlemleri adım adım uygula, ara değeri atlama.'
   elif mode=='bugHunt':
    c['errorStep']=2 if i%2==0 else 3
    c['shown']=[n,a*n+2,a*n+b+2] if c['errorStep']==2 else [n,a*n,a*n+b+3]
    c['fields']=[field('step','Hata hangi adımda oluştu?',f'{c["errorStep"]}. adım','choice',['1. adım','2. adım','3. adım'])]
    query=f'Kural: girdiyi {a} ile çarp, {b} ekle. Girdi {n}; kaydedilen akış '+ ' → '.join(map(str,c['shown']))+'. İlk yanlış adımı seç.'
    hint='Girdiden itibaren sırayla kontrol et; ilk kez hangi işlem beklenen sonucu vermiyor?'
   elif mode=='ifBranch':
    thresh=5+(i%6);n=1+(i*3+j)%13
    if n<thresh and a*n<b:n=(b+a-1)//a
    c['threshold']=thresh;c['n']=n
    branch='Üst yol' if n>=thresh else 'Alt yol';output=(a*n+b) if n>=thresh else (a*n-b)
    c['fields']=[field('branch',f'x≥{thresh} koşulunda hangi yol çalışır?',branch,'choice',['Üst yol','Alt yol']),field('out','Algoritma çıktısı',output)]
    query=f'Girdi x={n}; x≥{thresh} ise {a}x+{b}, değilse {a}x−{b} uygulanıyor. Doğru yolu ve sonucu seç.'
    hint='Önce koşulu denetle, ardından yalnız seçilen dalın ifadesini hesapla.'
   elif mode=='tableFromAlgo':
    c['ns']=[1,2,4];c['fields']=[field('v'+str(k),f'x={k} için çıktı',a*k+b) for k in c['ns']]
    query=f'Algoritma “x’i {a} ile çarp ve {b} ekle.” x=1, x=2, x=4 için tabloyu tamamla.'
    hint='Aynı algoritma bütün girdiler için uygulanmalı.'
   elif mode=='codeMatch':
    options=[f'OKU x → y←{a}×x+{b} → YAZ y',f'OKU x → y←{b}×x+{a} → YAZ y',f'OKU x → y←{a}×(x+{b}) → YAZ y',f'OKU x → y←{a}×x−{b} → YAZ y']
    c['fields']=[field('code','İstenen cebirsel ifadeyi veren sözde kod',options[0],'choice',options)]
    query=f'{a}x+{b} için doğru sözde kodu seç. İşlem sırası ve sabit terim doğru kullanılmalı.'
    hint='Sabit terim giriş x ile çarpılmamalı; ekleme çarpmadan sonra gelir.'
   elif mode=='repairAlgo':
    wanted='Ekle' if i%2==0 else 'Çıkar';out=a*n+b if wanted=='Ekle' else a*n-b
    c['fields']=[field('repair','Hatalı işlemin yerine hangisi gelmeli?',wanted,'choice',['Ekle','Çıkar','Böl','Hiçbiri']),field('out','Düzeltilmiş algoritmanın çıktısı',out)]
    query=f'Program x={n} sayısını {a} ile çarpıp yanlışlıkla {b} '+('çıkarıyor' if wanted=='Ekle' else 'ekliyor')+'. Hedef ifade '+(f'{a}x+{b}' if wanted=='Ekle' else f'{a}x−{b}')+'. Komutu onar ve doğru çıktıyı bul.'
    hint='İşlem işaretini hedef cebirsel ifadeyle karşılaştır.'
   else:raise ValueError(mode)
   # Rotate choice positions to avoid an always-first correct answer.
   for f in c['fields']:
    if f['kind']=='choice' and len(f['options'])>1:
     k=(3*i+j+1)%len(f['options']);f['options']=f['options'][k:]+f['options'][:k]
    if f['kind']=='order':
     f['options']=f['options'][(i%3):]+f['options'][:(i%3)]
   c['requireReason']=mode in {'storyMatch','ruleCards','polygonInterior','spotError','bugHunt','ifBranch','codeMatch'}
   c['hint']=hint;c['expected']={f['key']:f['answer'] for f in c['fields']}
   if taskid in existing:
    task=existing[taskid]
   else:
    original=existing[f'{code}-G20']
    task=copy.deepcopy(original)
    task.update(id=taskid,gorev_no=str(num),seviye=str(min(5,1+(num-1)//14)),asama=stages[(num-1)//14],rol=roles[i],mekan=contexts[i],baslik=f'{name} · {contexts[i]}')
    new.append(task)
   task['mekanik']=name;task['gorev']=query;task['ipucu']=hint
   task['kontrol_turu']='otomatik';task['ogrenci_urun']='Etkileşimli model, cevap ve isteğe bağlı matematiksel açıklama'
   task['oyuncu_eylemi']='Modeli değiştir, ilişkiyi bul ve doğrula';task['sure_dakika']='4'
   task['beklenen_yanit_veya_rubrik']='; '.join(f'{f["label"]}: {f["answer"]}' for f in c['fields'])
   task['algebra6Lab']=c
# update old first, add new after; sort by plan sequence and within outcome
assert len(new)==150
all_tasks=db['tasks']+new
all_tasks.sort(key=lambda t:(int(t['sinif']),int(t['plan_sirasi']),int(t['gorev_no'])))
db['tasks']=all_tasks
for o in db['outcomes']:
 if o['kod'].startswith('MAT.6.2.'):
  o['tema_ders_saati']=33;o['tema_tahmini_hafta']='22–28';o['resmi_metin_mi']='False'
 if o['kod'].startswith('MAT.6.4.'):
  o['tema_ders_saati']=33;o['tema_tahmini_hafta']='28–35'
# Keep the user-approved teaching order unchanged; shift only the two official hour counts.
for th in db['themes']:
 if th['sinif']=='6' and int(th['tema_sirasi'])==6:
  th.update(ders_saati=33,ders_baslangici=107,ders_bitisi=139,yaklasik_hafta='22–28',gorev_sayisi=210)
 if th['sinif']=='6' and int(th['tema_sirasi'])==7:
  th.update(ders_saati=33,ders_baslangici=140,ders_bitisi=172,yaklasik_hafta='28–35')
for task in db['tasks']:
 if task['sinif']=='6' and int(task['tema_sirasi'])==6:task['temanin_yaklasik_haftalari']='22–28'
 if task['sinif']=='6' and int(task['tema_sirasi'])==7:task['temanin_yaklasik_haftalari']='28–35'
for th in db['themes']:
 th['gorev_sayisi']=sum(t['sinif']==th['sinif'] and int(t['tema_sirasi'])==int(th['tema_sirasi']) for t in db['tasks'])
assert len(db['tasks'])==1470
assert len({t['id'] for t in db['tasks']})==1470
assert collections.Counter(t['ogrenme_ciktisi'] for t in db['tasks'] if t.get('algebra6Lab'))=={'MAT.6.2.1':70,'MAT.6.2.2':70,'MAT.6.2.3':70}
path.write_text(json.dumps(db,ensure_ascii=False,indent=2),encoding='utf-8')
print('v1.8:',len(db['tasks']),'total, 210 interactive algebra6 tasks, 21 mechanics, +150 IDs')
