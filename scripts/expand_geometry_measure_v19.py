#!/usr/bin/env python3
"""v1.9: 6. sınıf Geometrik Nicelikler; 6*5*10=300 etkileşimli görev."""
from pathlib import Path
import json,copy,math
R=Path(__file__).resolve().parents[1]
p=R/'data/tasks.json'; db=json.loads(p.read_text(encoding='utf8'))
assert len(db['tasks'])==1470,'Apply only to v1.8 source'
CTX=['Okul bahçesi','Erdemli sahili','Limon bahçesi','Bilim şenliği','Bisiklet parkuru','Mahalle parkı','Sanat atölyesi','Spor sahası','Kütüphane','Fidanlık']
MODES={
'6.4.1':['tileMeter','unitBridge','scaleSquare','compareDimensions','areaRepair'],
'6.4.2':['shearRectangle','halfRectangle','heightHunt','equalAreas','rebuildTriangle'],
'6.4.3':['parkSurface','splitShape','flooringBudget','missingHeight','chooseDesign'],
'6.4.4':['measureRatio','diameterExperiment','piIdentity','wheelComparison','piTable'],
'6.4.5':['circleRace','radiusFromTrack','lapsAndDistance','fencePricing','wheelsDifference'],
'6.4.6':['arcPortion','arcDistance','sectorRecovery','clockArc','arcChallenge']}
MODE_NAMES={
 'tileMeter':'Alan birimi döşeme','unitBridge':'Alan dönüşüm köprüsü','scaleSquare':'Kenar–alan büyütme','compareDimensions':'Uzunluk–alan ayrımı','areaRepair':'Yanlış dönüşümü onar',
 'shearRectangle':'Paralelkenarı dönüştür','halfRectangle':'İki eş üçgen','heightHunt':'Gerçek yüksekliği seç','equalAreas':'Alan korunumu araştırması','rebuildTriangle':'Üçgen inşa istasyonu',
 'parkSurface':'Park alanı projesi','splitShape':'Birleşik alan laboratuvarı','flooringBudget':'Döşeme bütçesi','missingHeight':'Tersine yükseklik','chooseDesign':'Şantiye tasarım seçimi',
 'measureRatio':'Çevre–çap oranı ölçümü','diameterExperiment':'Çapı ikiye katla','piIdentity':'π değerini keşfet','wheelComparison':'İki çember karşılaştırması','piTable':'Çember ölçüm tablosu',
 'circleRace':'Çember çevresini hesapla','radiusFromTrack':'Tersine yarıçap','lapsAndDistance':'Tur mesafesi stratejisi','fencePricing':'Dairesel çit bütçesi','wheelsDifference':'Farklı tekerlek izleri',
 'arcPortion':'Merkez açı payı','arcDistance':'Yay mesafesi','sectorRecovery':'Merkez açıyı geri bul','clockArc':'Saatin gösterdiği yay','arcChallenge':'İki yayı kıyasla'}
STAGES=['Keşfet','Modelle','İnşa et','Sına','Gerekçelendir']
existing={x['id']:x for x in db['tasks']}
new=[]
def f(key,label,answer,kind='number',options=None,**kw):
 out=dict(key=key,label=label,answer=answer,kind=kind,**kw)
 if options is not None:out['options']=options
 return out
def shuffle(opts, i,j):return opts[(2*i+j+1)%len(opts):]+opts[:(2*i+j+1)%len(opts)]
for part,modes in MODES.items():
 code='MAT.'+part
 for j,mode in enumerate(modes):
  for i in range(10):
   num=10*j+i+1; tid=f'{code}-G{num:02d}'
   a=2+(i*2+j)%9;b=3+(i+j*3)%9;h=2+(i*3+j)%8
   # pi=3.14 for numerical models; geometry length units are explicitly virtual
   d=2*(2+(i+j)%9); theta=[30,45,60,72,90,120,135,144,180,270][i]
   circ=round(3.14*d,2); fraction=theta/360
   config=dict(mode=mode,kind=part,a=a,b=b,h=h,d=d,theta=theta,pi=3.14,fields=[],visual=('tiles' if part.endswith('.1') else 'shapes' if part.endswith('.2') or part.endswith('.3') else 'circle'),hint='',requireReason=mode in ['compareDimensions','areaRepair','heightHunt','equalAreas','splitShape','chooseDesign','measureRatio','piIdentity','piTable','wheelsDifference','arcChallenge','sectorRecovery'],scene=CTX[i])
   fields=[];query='';hint=''
   if mode=='tileMeter':
    n=1+(i%5);config.update(n=n, rows=n*10)
    fields=[f('rows','Kaç onluk dm² sırası döşenecek?',n*10,'range',min=0,max=50,step=1),f('area','Toplam kaç dm²?',n*100)]
    query=f'{CTX[i]}: {n} m² yer için her 1 m² üzerinde 10×10 dm² kare modeli kur. Kaç sıra ve kaç dm² gerektiğini bul.';hint='1 m² = 100 dm² = 10 sıra × 10 kare.'
   elif mode=='unitBridge':
    units=[('m²','dm²',100),('dm²','cm²',100),('cm²','mm²',100),('km²','m²',1000000),('m²','cm²',10000)]
    u,v,ratio=units[(i+j)%5];config.update(units=[u,v],ratio=ratio)
    fields=[f('converted',f'{a} {u} kaç {v}?',a*ratio)]
    query=f'Birim köprüsü: {a} {u} → ? {v}. Kenar uzunluklarını dönüştürünce alanın nasıl değişeceğini hesapla.';hint=f'Her kenar dönüşümündeki katsayının karesini al: 1 {u} = {ratio} {v}.'
   elif mode=='scaleSquare':
    n=2+(i%5);s=2+(j+i)%4;config.update(n=n,s=s)
    fields=[f('factor','Alan kaç katına çıkar?',s*s,'choice',shuffle([s,s*s,s*s+1,s*s+s],i,j))]
    query=f'Kare alanının bir kenarı {n} birimken kenarını {s} katına çıkar. Alan kaç katına yükselir?';hint='Alan iki boyutlu: kenar ölçeği s ise alan ölçeği s².'
   elif mode=='compareDimensions':
    scale=[10,100,1000][i%3];config['scale']=scale
    fields=[f('linear',f'{a} m kaç {"dm" if scale==10 else "cm" if scale==100 else "mm"}? ',a*scale),f('square','Aynı uzunluk dönüşümünde alanın katı',scale*scale)]
    query=f'{CTX[i]}: Uzunluk {scale} kat büyüyerek yeni birime çevriliyor. {a} m kaç alt birimdir; aynı dönüşümde alan sayısı kaç kat artar?';hint='Uzunlukta ×k, alan ölçüsünde ×k².'
   elif mode=='areaRepair':
    ratio=100;wrong=a*10;config.update(units=['m²','dm²'],wrong=wrong)
    fields=[f('repair',f'{a} m² için doğru dm² miktarı',a*ratio),f('mistake','Yanlış işlem nedir?','Kenar katsayısını alan için kullanmak','choice',shuffle(['Kenar katsayısını alan için kullanmak','Çarpma yerine toplama yapmak','Yarıçapı çap sanmak'],i,j))]
    query=f'Bir planlamacı {a} m² = {wrong} dm² yazmış. Yanlışı belirle ve 100 karelik modelle sonucu düzelt.';hint='Metre → desimetre 10 kattır; metrekare → desimetrekare 100 kattır.'
   elif mode=='shearRectangle':
    config['shape']='parallelogram';fields=[f('height','Eğik dörtgenin dik yüksekliği',h,'range',min=1,max=12),f('area','Paralelkenarın alanı',a*h)]
    query=f'Paralelkenar tabanı {a}, dik yüksekliği {h} birim. Köşeyi yatay kaydırıp dikdörtgenle karşılaştır; alan kaç birimkare?';hint='Yatay kaydırma alanı değiştirmez: taban × dik yükseklik.'
   elif mode=='halfRectangle':
    config['shape']='triangle';fields=[f('triangles','Bir dikdörtgen iki eş üçgene ayrılır; kaç parça?',2,'choice',shuffle([2,3,4],i,j)),f('area','Bir üçgenin alanı',a*h/2)]
    query=f'{a}×{h} dikdörtgeni köşegeni boyunca ikiye ayır. Tek üçgenin alanını bul.';hint='İki eş üçgenin alanlarının toplamı dikdörtgen alanıdır.'
   elif mode=='heightHunt':
    config.update(shape='parallelogram',slant=h+3);fields=[f('height','Alan hesabındaki yükseklik hangisi?',h,'choice',shuffle([h,h+3,a+h+3],i,j)),f('area','Doğru alan',a*h)]
    query=f'Paralelkenarda taban {a}, dik uzaklık {h}, eğik kenar {h+3} birim. Alan için doğru yüksekliği seç ve hesabı yap.';hint='Eğik kenar değil, tabana dik uzaklık kullanılır.'
   elif mode=='equalAreas':
    config['shape']='parallelogram';fields=[f('base','Yeni taban uzunluğu',a*2,'range',min=1,max=30),f('height','Alanı koruyan yeni yükseklik',h/2),f('area','Ortak alan',a*h)]
    query=f'Tabanı {a}, yüksekliği {h} olan paralelkenarın tabanını iki katına çıkar. Alanı korumak için yükseklik kaç olmalı?';hint='Taban iki katına çıkarsa alan sabitken yükseklik yarıya iner.'
   elif mode=='rebuildTriangle':
    config['shape']='triangle';fields=[f('height','Üçgen yüksekliğini ayarla',h,'range',min=1,max=12),f('target','Üçgenin alanı',a*h/2)]
    query=f'Tabanı {a} birim olan bir üçgeni yüksekliği {h} olacak şekilde kur. Alanını bul.';hint='Üçgen alanı = taban × dik yükseklik ÷ 2.'
   elif mode=='parkSurface':
    config['shape']='rectangle';fields=[f('area',f'{a}×{h} metrelik dikdörtgenin alanı',a*h),f('units','Alan birimi','m²','choice',shuffle(['m²','m','cm'],i,j))]
    query=f'{CTX[i]}: {a} m × {h} m dikdörtgen alanına çim serilecek. Döşenecek alanı ve doğru ölçü birimini seç.';hint='İki uzunluğun çarpımı metrekaredir.'
   elif mode=='splitShape':
    config['shape']='composite';fields=[f('rect','Dikdörtgen alanı',a*h),f('tri','Üçgen alanı',a*b/2),f('total','Toplam alan',a*h+a*b/2)]
    query=f'Birleşik park: {a}×{h} dikdörtgene tabanı {a}, yüksekliği {b} üçgen ekleniyor. Ayrı alanları ve toplamını hesapla.';hint='Parçaları ayır: dikdörtgen a×h, üçgen a×b/2.'
   elif mode=='flooringBudget':
    price=2+(i%5);config.update(shape='rectangle',price=price);fields=[f('tiles','Alan (m²)',a*h),f('cost','Toplam zemin maliyeti',a*h*price)]
    query=f'{a} m × {h} m zemin, m² başına {price} TL. Alanı ve toplam maliyeti hesaplayıp bütçeyi oluştur.';hint='Önce alanı hesapla, sonra m² maliyetiyle çarp.'
   elif mode=='missingHeight':
    shape='triangle' if i%2 else 'parallelogram';area=a*h/(2 if shape=='triangle' else 1);config['shape']=shape
    fields=[f('height','Eksik dik yükseklik',h,'range',min=1,max=12)]
    query=f'{shape=="triangle" and "Üçgenin" or "Paralelkenarın"} tabanı {a} m, alanı {area:g} m². Dik yüksekliği geri bul.';hint='Üçgende alanı ikiyle çarpıp tabana böl; paralelkenarda doğrudan tabana böl.'
   elif mode=='chooseDesign':
    config['shape']='composite';opts=[f'A: {a}×{h} dikdörtgen',f'B: taban {a}, yükseklik {h} üçgen',f'C: taban {a}, yükseklik {h} paralelkenar']
    fields=[f('design','Dikdörtgenle aynı alana sahip başka şekil',opts[2],'choice',shuffle(opts,i,j)),f('area','Korunan alan',a*h)]
    query=f'{CTX[i]} için {a}×{h} dikdörtgen kadar alan gerektiğinde, aynı taban/yükseklik değerleriyle hangi başka şekil uygundur?';hint='Paralelkenar da taban × yüksekliğe sahiptir; üçgen yarısıdır.'
   elif mode=='measureRatio':
    config.update(d=d);fields=[f('circ','Çemberin ölçülmüş uzunluğu (π≈3,14)',circ),f('ratio','Çevre ÷ çap oranı',3.14)]
    query=f'Çapı {d} cm olan çemberi yuvarlayıp çevresini ölç. π≈3,14 al; çevreyi ve çevre/çap oranını hesapla.';hint='Farklı çemberlerde çevre/çap oranı yaklaşık π’dir.'
   elif mode=='diameterExperiment':
    fields=[f('factor','Çapı iki katına çıkarınca çevre kaç kat olur?',2,'choice',shuffle([2,3,4],i,j)),f('new','Yeni çevre uzunluğu (π≈3,14)',round(circ*2,2))]
    query=f'Çapı {d} cm olan çemberin çapını iki katına çıkar. Çevre ne kadar değişir? Yeni çevreyi bul.';hint='Çevre, çapla doğru orantılıdır; çap iki katına çıkarsa çevre iki kat olur.'
   elif mode=='piIdentity':
    opts=['Çevre ÷ çap ≈ 3,14','Çevre ÷ yarıçap ≈ 3,14','Çap ÷ çevre ≈ 3,14'];fields=[f('relation','π değerini veren ilişki',opts[0],'choice',shuffle(opts,i,j)),f('diameter','Yarıçapın iki katı olan çap',d)]
    query=f'Farklı çemberleri ölçüp ortak oranı bul. Yarıçapı {d/2:g} olan çemberin çapını ve π ilişkisinin doğru ifadesini seç.';hint='π = çember uzunluğu ÷ çap uzunluğu; çap = 2×yarıçap.'
   elif mode=='wheelComparison':
    other=d+2*(1+i%3);config['otherD']=other;fields=[f('more','Hangi tekerleğin çevresi daha uzun?',f'B ({other} cm)','choice',shuffle([f'A ({d} cm)',f'B ({other} cm)','Eşit'],i,j)),f('difference','Çevreler farkı (π≈3,14)',round(3.14*(other-d),2))]
    query=f'Tekerlek A çap {d} cm, B çap {other} cm. Hangisi bir turda daha çok yol alır ve fark nedir?';hint='Çap farkını π ile çarp.'
   elif mode=='piTable':
    fields=[f('c1',f'Çap {d} cm için çevre',circ),f('c2',f'Çap {d+2} cm için çevre',round(3.14*(d+2),2)),f('ratio','Her iki ölçümde çevre/çap',3.14)]
    query=f'Ölçüm tablosunu doldur: çaplar {d} ve {d+2} cm, π≈3,14. Oranın sabitliğini açıkla.';hint='Her satırda çevre = π × çap.'
   elif mode=='circleRace':
    fields=[f('radius','Yarıçap uzunluğu',d/2,'range',min=1,max=12,step=1),f('circ','Çember uzunluğu',circ)]
    query=f'Yarıçapı {d/2:g} m olacak çembersel parkuru ayarla. π≈3,14 ile bir tur uzunluğu nedir?';hint='Ç = 2πr = πd.'
   elif mode=='radiusFromTrack':
    fields=[f('radius','Çevre uzunluğundan yarıçapı geri bul',d/2)]
    query=f'Çevresi {circ:g} m olan dairesel koşu yolunun yarıçapı kaç m? π≈3,14.';hint='r = çevre ÷ (2π).'
   elif mode=='lapsAndDistance':
    laps=2+(i%7);config['laps']=laps;fields=[f('laps','Tur sayısını ayarla',laps,'range',min=1,max=10,step=1),f('distance','Toplam mesafe',round(circ*laps,2))]
    query=f'Çapı {d} m olan yuvarlak parkurda {laps} tur atılıyor. Toplam yol kaç metredir?';hint='Bir tur uzunluğunu bulup tur sayısıyla çarp.'
   elif mode=='fencePricing':
    price=3+(i%7);config['price']=price;fields=[f('length','Gereken çit uzunluğu',circ),f('cost',f'{price} TL/metreden toplam bedel',round(circ*price,2))]
    query=f'{CTX[i]}: Çap {d} m, çit metre fiyatı {price} TL. Çemberin uzunluğu ve çit maliyeti nedir?';hint='Çevre × birim çit fiyatı.'
   elif mode=='wheelsDifference':
    other=d+2;config['otherD']=other;fields=[f('small','Küçük çember çevresi',circ),f('big','Büyük çember çevresi',round(3.14*other,2)),f('difference','Çevre uzunlukları farkı',6.28)]
    query=f'Çapları {d} cm ve {other} cm olan iki tekerlek bir tur dönüyor. Aldıkları yolların farkını bul.';hint='Çap farkı 2 cm olduğundan çevre farkı 2π ≈ 6,28 cm.'
   elif mode=='arcPortion':
    fields=[f('angle','Merkez açıyı ayarla',theta,'range',min=0,max=360,step=1),f('fraction','Çemberin kaçta kaçı?',round(fraction,6))]
    query=f'{theta}° merkez açının gördüğü yay, tam çember uzunluğunun hangi oranıdır? Açı dilimini ayarla.';hint='Yay oranı = merkez açı / 360°.'
   elif mode=='arcDistance':
    full=round(3.14*d,2);config['full']=full;fields=[f('angle','Merkez açı',theta,'range',min=0,max=360,step=1),f('arc','Yay uzunluğu (π≈3,14)',round(full*fraction,3))]
    query=f'Çap {d} cm, merkez açı {theta}°. π≈3,14 ile görülen yay uzunluğunu hesapla.';hint='Yay uzunluğu = çevre × açı / 360.'
   elif mode=='sectorRecovery':
    full=round(3.14*d,2);length=round(full*fraction,3);config['arc']=length;fields=[f('angle','Yaydan merkez açıyı bul',theta)]
    query=f'Çember uzunluğu {full:g} cm; yay uzunluğu {length:g} cm. Bu yayı gören merkez açı kaç derecedir?';hint='Merkez açı = (yay / çevre) × 360. (Ölçüler yuvarlandığı için yakın sonuç kabul edilir.)'
   elif mode=='clockArc':
    minutes=[5,10,15,20,25,30,35,40,45,50][i];ang=6*minutes;config.update(theta=ang,minutes=minutes);fields=[f('angle',f'{minutes} dakikalık dönüş açısı',ang,'range',min=0,max=360,step=1),f('fraction','Tam turun oranı',round(minutes/60,6))]
    query=f'Saatin yelkovanı {minutes} dakika ilerledi. Dönüş açısını ve çember yayının tam çevreye oranını belirle.';hint='60 dakika = 360°; 1 dakika = 6°.'
   elif mode=='arcChallenge':
    other=d*2;config.update(otherD=other,secondAngle=theta/2);arc1=round(circ*fraction,3);arc2=round(3.14*other*(theta/2)/360,3)
    fields=[f('comparison','İki yay için doğru ilişki','Yaylar eşit uzunluktadır','choice',shuffle(['Yaylar eşit uzunluktadır','Birinci yay daha uzundur','İkinci yay daha uzundur'],i,j)),f('length','Her bir yay uzunluğu',arc1)]
    query=f'A çemberi çap {d} cm, açısı {theta}°; B çemberi çap {other} cm, açısı {theta/2:g}°. Yayları karşılaştır.';hint='Çap iki kat, açı yarım olursa yay uzunluğu sabit kalır.'
   else:raise ValueError(mode)
   for ff in fields:
    if ff['kind']=='choice':
     assert len(ff['options'])==len(set(map(str,ff['options']))),mode
     assert ff['answer'] in ff['options']
   config['fields']=fields;config['expected']={ff['key']:ff['answer'] for ff in fields};config['hint']=hint
   task=existing.get(tid)
   if task is None:
    task=copy.deepcopy(existing[f'{code}-G20'])
    task.update(id=tid,gorev_no=str(num),seviye=str(min(5,1+(num-1)//10)),asama=STAGES[(num-1)//10],rol='Mühendis',mekan=CTX[i]);new.append(task)
   task.update(geometryMeasureLab=config,mekanik=MODE_NAMES[mode],baslik=f'{MODE_NAMES[mode]} · {CTX[i]}',gorev=query,ipucu=hint,kontrol_turu='otomatik',ogrenci_urun='Etkileşimli model, ölçüm ve matematiksel gerekçe',oyuncu_eylemi='Modeli oluştur, gözlemle, hesapla ve kontrol et',beklenen_yanit_veya_rubrik='; '.join(f'{x["label"]}: {x["answer"]}' for x in fields),sure_dakika='5')
assert len(new)==180
all_tasks=db['tasks']+new
all_tasks.sort(key=lambda x:(int(x['sinif']),int(x['plan_sirasi']),int(x['gorev_no'])))
db['tasks']=all_tasks
for th in db['themes']:
 if str(th['sinif'])=='6' and int(th['tema_sirasi'])==7:th.update(gorev_sayisi=300,ders_saati=33)
for t in db['tasks']:
 if t['ogrenme_ciktisi'].startswith('MAT.6.4.'):
  t['tema_sirasi']=7;t['temanin_yaklasik_haftalari']='28–35'
for o in db['outcomes']:
 if o['kod'].startswith('MAT.6.4.'):
  o['tema_ders_saati']=33
p.write_text(json.dumps(db,ensure_ascii=False,indent=2),encoding='utf8')
print('v1.9 geometry',len(db['tasks']),'tasks; 300 interactive geometry tasks, 180 appended')
