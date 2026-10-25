#!/usr/bin/env python3
"""Resmi MAT.6.3.1-4 için 17 özgün etkileşim ailesi × 10 görev."""
import json, math, random
from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'data/tasks.json';db=json.loads(p.read_text(encoding='utf8'))
old=db['tasks'];byid={x['id']:x for x in old};oldids=set(byid)
context=['okul bahçesi','metro hattı','mozaik atölyesi','sergi salonu','bisiklet parkuru','şehir planı','sınıf panosu','spor alanı','uçurtma tasarımı','arkeoloji kazısı']
mechanics={
'correspond':'Yöndeş Açı Eşleştirici','alternate':'İç Ters Açı Köprüsü','outer':'Dış Ters Açı Rotası','parallelTest':'Paralellik Dedektifi',
'shapeBuild':'İki Kesenle Dörtgen İnşası','shapeClass':'Dörtgen Sınıflama Haritası','angleTotal':'Dörtgen Açı Yapbozu','propertyCheck':'Ortak Özellik Dedektifi',
'diagonalBuild':'Köşegen İnşa Masası','diagonalName':'Köşegenden Şekil Tanı','midpointFix':'Orta Nokta Tamircisi','diagonalFacts':'Köşegen Özellikleri Haritası',
'triangleAngle':'Üçgenin Kayıp Açısı','triangleExterior':'Dış Açı İstasyonu','quadrilateralAngle':'Dörtgen Açı Tamamlama','parallelAngle':'Paralelkenar Açı Terazisi','rhombusHalf':'Eşkenar Dörtgen Köşegen Açısı'}
groups=[('MAT.6.3.1',['correspond','alternate','outer','parallelTest']),('MAT.6.3.2',['shapeBuild','shapeClass','angleTotal','propertyCheck']),('MAT.6.3.3',['diagonalBuild','diagonalName','midpointFix','diagonalFacts']),('MAT.6.3.4',['triangleAngle','triangleExterior','quadrilateralAngle','parallelAngle','rhombusHalf'])]
shapes=['yamuk','paralelkenar','dikdörtgen','eşkenar dörtgen','kare']
created=upgraded=0
for code,modes in groups:
 o=next(v for v in db['outcomes'] if v['kod']==code)
 for mi,mode in enumerate(modes):
  for j in range(10):
   n=mi*10+j+1;rand=random.Random(61301+mi*451+j*67+int(code[-1])*10007)
   cfg={'mode':mode};x=context[j]
   if mode in ('correspond','alternate','outer','parallelTest'):
    a=35+5*((3*j+mi)%19);cfg.update(alpha=a,initial=round(max(20,min(160,a+(15 if j%2 else -15)))/5)*5)
    cfg['relation']={'correspond':'Yöndeş','alternate':'İç ters','outer':'Dış ters','parallelTest':'Yöndeş'}[mode]
    cfg['points']={'correspond':['A1','B1'],'alternate':['A3','B1'],'outer':['A1','B3'],'parallelTest':['A1','B1']}[mode]
    prompt=f'{x.title()}: İki paralel doğru ve kesen üzerinde {cfg["points"][0]} ile {cfg["points"][1]} açısını incele. İşaretli açıyı ölçüp eş açı ilişkisini kur.'
    if mode=='parallelTest':prompt=f'{x.title()}: Kesenin oluşturduğu A1 ve B1 açılarını eşitleyerek doğruların paralelliğini test et; hangi açı ilişkisinin kullanıldığını belirt.'
   elif mode in ('shapeBuild','shapeClass','propertyCheck'):
    typ=(['yamuk','paralelkenar','dikdörtgen','kare'][(j+mi)%4] if mode=='shapeBuild' else shapes[(j+mi)%5]);cfg.update(shape=typ)
    prompt=f'{x.title()}: İki paralel doğru ve iki kesenle oluşan {typ} modelini incele; kenar ve açı özelliklerinden sınıflandır.'
   elif mode=='angleTotal':
    a=75+(j*7)%31;b=85+(j*9)%28;c=90+(j*5)%26;cfg.update(known=[a,b,c],missing=360-a-b-c)
    prompt=f'{x.title()}: Dörtgende üç iç açı {a}°, {b}°, {c}° olduğuna göre eksik açıyı bul. İç açı toplamını kontrol et.'
   elif mode in ('diagonalBuild','diagonalName','diagonalFacts'):
    typ=['paralelkenar','dikdörtgen','eşkenar dörtgen','kare'][(j+mi)%4]
    cfg.update(shape=typ)
    prompt=f'{x.title()}: Birbirini ortalayan köşegenlerle {typ} oluşturmak için köşegen uzunlukları ve kesişme açılarını kullan.'
   elif mode=='midpointFix':
    off=(j%5)+1;cfg.update(offset=off)
    prompt=f'{x.title()}: Köşegenlerin kesişme noktası doğru parçasını iki eş parçaya ayırmıyor. Kaymayı sıfırlayarak şekli düzelt.'
   elif mode=='triangleAngle':
    a=30+5*(j%9);b=40+5*((2*j+1)%9);cfg.update(known=[a,b],missing=180-a-b)
    prompt=f'{x.title()}: Üçgenin iki açısı {a}° ve {b}°. Üçüncü açıyı matematiksel modelle bul.'
   elif mode=='triangleExterior':
    a=30+5*(j%8);b=35+5*((2*j+3)%8);cfg.update(known=[a,b],missing=a+b)
    prompt=f'{x.title()}: Bir üçgenin uzak iki iç açısı {a}° ile {b}°. Dış açıyı bul; uzaktaki açılarla ilişkilendir.'
   elif mode=='quadrilateralAngle':
    vals=[70+5*(j%7),80+5*((j+3)%7),90+5*((2*j+1)%7)];cfg.update(known=vals,missing=360-sum(vals))
    prompt=f'{x.title()}: Dörtgende iç açılar {vals[0]}°, {vals[1]}°, {vals[2]}° ve x. x değerini belirle.'
   elif mode=='parallelAngle':
    a=55+5*(j%15);cfg.update(alpha=a,missing=180-a)
    prompt=f'{x.title()}: Paralelkenarda bir iç açı {a}°. Ona komşu açı kaç derece olur? Açıyı hareket ettirerek eşleştir.'
   elif mode=='rhombusHalf':
    a=60+10*(j%10);cfg.update(alpha=a,missing=a//2)
    prompt=f'{x.title()}: Eşkenar dörtgende köşegen {a}° lik köşe açısını ikiye böler. Oluşan yarım açıyı ayarla.'
   else:raise ValueError(mode)
   taskid=f'{code}-G{n:02d}'
   task={'plan_sirasi':o['plan_sirasi'],'tema_sirasi':5,'tema':'Geometrik Şekiller','tema_ici_sira':o['tema_cikti_sirasi'],'temanin_yaklasik_haftalari':'18–22','id':taskid,'ogrenme_ciktisi':code,'sinif':'6','gorev_no':n,'seviye':min(5,1+mi+(j//5)),'asama':['Keşfet','İnşa et','Karşılaştır','Çıkarım yap','Uygula'][min(mi,4)],'rol':'Geometri mühendisi','mekan':x,'mekanik':mechanics[mode],'baslik':mechanics[mode]+' · '+x.title(),'gorev':prompt,'kontrol_turu':'etkilesimli','beklenen_yanit_veya_rubrik':'Çizilen model, açı veya seçilen özellik otomatik kontrol edilir; açıklamanın niteliği öğretmen tarafından değerlendirilir.','ipucu':{'correspond':'Yöndeş açılar paralel doğrularda eşittir.','alternate':'İç ters açılar paralel doğrularda eşittir.','outer':'Dış ters açılar paralel doğrularda eşittir.','parallelTest':'Yöndeş açıların eşliği paralellik için bir testtir.','shapeBuild':'Dörtgenin iki yatay kenarı paralel olacak; diğer kenar çiftini ve dikliği gözle.','diagonalBuild':'Köşegenler birbirini ortalar. Dik olmaları eşkenar dörtgen; eş olmaları dikdörtgen özelliğidir.','midpointFix':'Kesişme orta nokta olmalıdır.','triangleExterior':'Dış açı, kendisine komşu olmayan iki iç açının toplamıdır.'}.get(mode,'Ölçülen açıları ve şeklin ortak özelliklerini karşılaştır.'),'oyuncu_eylemi':'Ölç, kur, seç ve doğrula','sure_dakika':4+(j%4),'ogrenci_urun':'Etkileşimli SVG çizimi ve matematiksel ilişki','geometry6Lab':cfg}
   if taskid in byid:byid[taskid].update(task);upgraded+=1
   else:old.append(task);byid[taskid]=task;created+=1
assert upgraded==80 and created==90,(upgraded,created)
order={o['kod']:(o['sinif'],o['plan_sirasi']) for o in db['outcomes']}
db['tasks'].sort(key=lambda t:(order[t['ogrenme_ciktisi']],int(t['gorev_no'])))
for o in db['outcomes']:
 ts=[t for t in db['tasks'] if t['ogrenme_ciktisi']==o['kod']]
 assert [int(t['gorev_no']) for t in ts]==list(range(1,len(ts)+1)),o['kod']
 if o['kod'].startswith('MAT.6.3.'):o['tema_ders_saati']=20
for th in db['themes']:
 if str(th['sinif'])=='6' and th['tema_sirasi']==5:th['ders_saati']=20
 th['gorev_sayisi']=sum(str(t['sinif'])==str(th['sinif']) and int(t['tema_sirasi'])==th['tema_sirasi'] for t in db['tasks'])
# Yaklaşık hafta hesaplarını ders saati üzerinden yeniden kur (resmî kesin tarihler değil).
for grade in ('5','6'):
 start=1
 for th in (x for x in db['themes'] if str(x['sinif'])==grade):
  h=int(th['ders_saati']);th['ders_baslangici']=start;th['ders_bitisi']=start+h-1;th['yaklasik_hafta']=f'{math.ceil(start/5)}–{math.ceil((start+h-1)/5)}';start+=h
 for o in db['outcomes']:
  if str(o['sinif'])==grade:o['tema_tahmini_hafta']=next(t['yaklasik_hafta'] for t in db['themes'] if str(t['sinif'])==grade and t['tema_sirasi']==o['tema_sirasi'])
 for t in db['tasks']:
  if str(t['sinif'])==grade:t['temanin_yaklasik_haftalari']=next(th['yaklasik_hafta'] for th in db['themes'] if str(th['sinif'])==grade and th['tema_sirasi']==t['tema_sirasi'])
assert len(db['tasks'])==1320 and oldids.issubset(set(byid))
p.write_text(json.dumps(db,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
s=root/'data/summary.json';info=json.loads(s.read_text(encoding='utf8'));info.update(version='1.7',tasks=1320,grade5=460,grade6=860,interactive=1100,geometry6Lab=170,geometry6Modes=17,curriculum_source='https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/459')
s.write_text(json.dumps(info,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(root/'tests/legacy_ids_v16.json').write_text(json.dumps(sorted(oldids),ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Upgraded',upgraded,'created',created,'total',len(db['tasks']),'geometry6',170)
