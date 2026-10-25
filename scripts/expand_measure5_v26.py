#!/usr/bin/env python3
"""Expand 5th-grade geometric quantities by 30 independently checkable interactive challenges.
Original task IDs are preserved; rerunning this script is idempotent.
"""
from pathlib import Path
import json, csv, itertools
ROOT=Path(__file__).resolve().parents[1]
file=ROOT/'data/tasks.json'
db=json.loads(file.read_text(encoding='utf-8'))
db['tasks']=[t for t in db['tasks'] if not t.get('v26_generated')]
oldids={t['id'] for t in db['tasks']}
source='https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/451'
texts={
'MAT.5.4.1':'Kenar uzunlukları doğal sayı olan bir dikdörtgenin çevre uzunluğu verildiğinde kenar uzunluklarını yorumlayabilme',
'MAT.5.4.2':'Birim karelerden yola çıkarak dikdörtgenin alanını değerlendirebilme',
'MAT.5.4.3':'Kenar uzunlukları doğal sayı olan bir dikdörtgenin alanının ölçüsü verildiğinde çevre uzunluğunu, çevre uzunluğu verildiğinde alanını yorumlayabilme',
'MAT.5.4.4':'Dikdörtgenin çevre uzunluğu ve alanı ile ilgili problemleri çözebilme'}
for o in db['outcomes']:
 if o['kod'] in texts:
  o.update(resmi_metin=texts[o['kod']],resmi_metin_mi='True',resmi_kaynak_url=source,
   tema_alan_becerileri=['MAB2 Matematiksel Problem Çözme'],tema_kavramsal_becerileri=['KB2.14 Yorumlama','KB2.17 Değerlendirme'],
   tema_egilimler=['E1.1 Merak','E3.6 Analitiklik'],tema_degerler=['D7 Estetik','D14 Saygı'],
   tema_beceriler_arasi=['MAB3 Matematiksel Temsil','MAB5 Matematiksel Araç ve Teknoloji ile Çalışma'],
   tema_eslesmesi_notu='Bileşenler MEB 5. sınıf 4. tema düzeyindedir; görev düzeyindeki sınıflandırma geliştirici önerisidir.')
# Modes allocated as 10, 5, 5, 10.
MODE_GROUPS=[('fenceBuild','MAT.5.4.1'),('fenceMax','MAT.5.4.1'),('unitTile','MAT.5.4.2'),('sameArea','MAT.5.4.3'),('budgetGarden','MAT.5.4.4'),('siteChoice','MAT.5.4.4')]
LABELS={'fenceBuild':'Çit Mühendisi','fenceMax':'En Verimli Dikdörtgen','unitTile':'Birim Kare Ressamı','sameArea':'Alan–Çevre Dedektifi','budgetGarden':'Park Tasarımcısı','siteChoice':'Akıllı Arsa Kararı'}
CONTEXT=['Okul bahçesi','Limonluk parkı','Bilim şenliği','Spor sahası','Okuma bahçesi']
rows=[]
for mode,code in MODE_GROUPS:
 for j in range(5):
  n=21+(0 if mode in ('fenceBuild','unitTile','sameArea','budgetGarden') else 5)+j
  taskid=f'{code}-G{n:02d}'
  assert taskid not in oldids,taskid
  oldids.add(taskid)
  lvl=1+j
  unit='m' if j%2==0 else 'cm'
  requireReason=j in (2,4)
  c={'mode':mode,'seed':j,'unit':unit,'requireReason':requireReason,'source':source}
  if mode=='fenceBuild':
   w,h=[(2,6),(3,5),(4,6),(3,7),(5,7)][j]
   P=2*(w+h);A=w*h
   c.update(perimeter=P,area=A,gridMax=9)
   prompt=f'{CONTEXT[j]} için çevresi {P} {unit} ve alanı {A} {unit}² olan dikdörtgeni iki kenarını ayarlayarak kur. Alan–çevre ilişkisini kontrol et.'
   evidence=f'2(a+b)={P}; ab={A}. Birden fazla olası yerleşim incelenebilir.'
  elif mode=='fenceMax':
   half=[7,8,9,10,11][j];P=2*half
   c.update(perimeter=P,limitArea=36,gridMax=12)
   prompt=f'{CONTEXT[j]} için {P} {unit} uzunluğunda çit var. Kenarları doğal sayı olan ve alanı 36 {unit}² yi aşmayan en geniş dikdörtgeni kur. Ölçüleri seç ve alanı hesapla.'
   evidence=f'Çevre {P}. Tamsayı kenarlardan 36 birimkareyi aşmadan en büyük alan araştırılır.'
  elif mode=='unitTile':
   w,h=[(2,3),(3,3),(3,4),(4,4),(4,5)][j]
   c.update(width=w,height=h,gridW=7,gridH=6)
   prompt=f'{CONTEXT[j]} için {w}×{h} birim boyutlarında dikdörtgeni kareli zeminde boyayarak oluştur. Alanını ve çevresini ayrı ayrı hesapla.'
   evidence=f'A={w*h} birimkare, Ç={2*(w+h)} birim.'
  elif mode=='sameArea':
   A=[12,18,20,24,30][j]
   pairs=[(x,A//x) for x in range(1,int(A**.5)+1) if A%x==0]
   assert len(pairs)>=3
   c.update(area=A,rectangles=pairs)
   prompt=f'{CONTEXT[j]} için aynı {A} birimkare alana sahip dikdörtgenleri karşılaştır. En az ve en çok çit isteyen iki farklı kenar çiftini seçip çevre farkını bul.'
   evidence=f'Çevre uç değerleri: {min(2*(a+b) for a,b in pairs)} ve {max(2*(a+b) for a,b in pairs)}.'
  elif mode=='budgetGarden':
   fence=[20,22,24,26,28][j];perCost=[2,3,2,3,2][j];tileCost=[1,1,2,1,2][j]
   # budget chosen so multiple feasible rectangles exist, optimum cannot exceed 36 sq. units.
   budget=[70,85,100,110,130][j];minArea=[10,12,14,16,18][j]
   c.update(fenceLimit=fence,budget=budget,unitFence=perCost,unitFloor=tileCost,minArea=minArea,limitArea=36,gridMax=9)
   feasible=[(a,b) for a in range(1,10) for b in range(1,10) if a*b<=36 and a*b>=minArea and 2*(a+b)<=fence and 2*(a+b)*perCost+a*b*tileCost<=budget]
   assert feasible
   c['maxArea']=max(a*b for a,b in feasible)
   prompt=f'{CONTEXT[j]} için en büyük dikdörtgeni tasarla: çit en çok {fence} {unit}, bütçe en çok {budget} TL. Çit {perCost} TL/{unit}; döşeme {tileCost} TL/{unit}². Alan en az {minArea} {unit}² ve en çok 36 {unit}² olsun.'
   evidence='Çit=2(a+b), alan=a×b, maliyet=çit×çit birim fiyatı + alan×döşeme birim fiyatı. Bütçe içinde en büyük alan.'
  else:
   # Three location cards with exact area and perimeter, select smallest total expense for an area need.
   choices=[[(2,6),(3,5),(4,4)],[(3,6),(4,5),(2,9)],[(3,8),(4,6),(5,5)],[(4,7),(5,6),(3,9)],[(5,6),(4,8),(3,10)]][j]
   need=[12,16,20,24,28][j]
   costFence=[5,4,6,5,4][j];costTile=[2,3,2,3,2][j]
   costs=[2*(a+b)*costFence+a*b*costTile for a,b in choices]
   feasible=[(i,x) for i,x in enumerate(costs) if choices[i][0]*choices[i][1]>=need]
   assert feasible
   winner=min(feasible,key=lambda z:(z[1],z[0]))[0]
   c.update(choices=choices,minArea=need,unitFence=costFence,unitFloor=costTile)
   prompt=f'{CONTEXT[j]} için en az {need} {unit}² alan gerekli. Üç arsanın çit ({costFence} TL/{unit}) ve döşeme ({costTile} TL/{unit}²) giderlerini karşılaştır; koşulu sağlayan en ekonomik arsayı seç ve toplam maliyetini hesapla.'
   evidence=f'Uygun arsalar karşılaştırılır; ekonomik seçim kart {winner+1}, toplam {costs[winner]} TL.'
  c['instruction']=prompt
  task={'id':taskid,'ogrenme_ciktisi':code,'sinif':'5','gorev_no':str(n),'seviye':str(lvl),'asama':['Keşfet','Modelle','Sına','Gerekçelendir','Uygula'][j],
        'plan_sirasi':next(o['plan_sirasi'] for o in db['outcomes'] if o['kod']==code),'tema_sirasi':3,'tema':'Geometrik Nicelikler','tema_ici_sira':n,
        'temanin_yaklasik_haftalari':'14–18','rol':['Mühendis','Tasarımcı','Dedektif','Planlamacı','Mimar'][j],'mekan':CONTEXT[j],
        'mekanik':LABELS[mode]+' · iki aşamalı modelleme','baslik':LABELS[mode]+' '+str(j+1),'gorev':prompt,'ipucu':evidence,
        'kontrol_turu':'etkilesimli','beklenen_yanit_veya_rubrik':evidence,'oyuncu_eylemi':'Seç, inşa et, kontrol et','sure_dakika':'6','ogrenci_urun':'Etkileşimli dikdörtgen modeli ve sayısal doğrulama',
        'measure5PlusLab':c,'v26_generated':True,'kaynak_url':source}
  db['tasks'].append(task)
  rows.append({'id':taskid,'ogrenme_ciktisi':code,'mode':mode,'zorluk':lvl,'gorev':prompt,'dogrulama':evidence,'kaynak':source})
# keep stable plan ordering, no reassign of original ids
order={o['kod']:o['plan_sirasi'] for o in db['outcomes']}
db['tasks'].sort(key=lambda x:(int(x['sinif']),order[x['ogrenme_ciktisi']],int(x['gorev_no'])))
for theme in db['themes']:
 theme['gorev_sayisi']=sum(t['tema_sirasi']==theme['tema_sirasi'] and t['sinif']==theme['sinif'] for t in db['tasks'])
assert len(db['tasks'])==2000
assert sum(t['sinif']=='5' for t in db['tasks'])==810
assert len({t['id'] for t in db['tasks']})==len(db['tasks'])
file.write_text(json.dumps(db,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
out=ROOT/'data'/'YENI_30_GEOMETRIK_NICELIKLER_GOREVI.csv'
with out.open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
reference={'tema':'Geometrik Nicelikler','ders_saati':20,'resmi_kaynak':source,'tema_beceri':['MAB2 Matematiksel Problem Çözme','KB2.14 Yorumlama','KB2.17 Değerlendirme'],
'egilimler':['E1.1 Merak','E3.6 Analitiklik'],'degerler':['D7 Estetik','D14 Saygı'],'beceriler_arasi':['MAB3 Matematiksel Temsil','MAB5 Matematiksel Araç ve Teknoloji ile Çalışma'],
'uyari':'Bu bileşenler tema düzeyindedir. Oyun görevleri MEB onaylı değildir.',
'ciktilar':[{'kod':k,'resmi_metin':v,'mevcut_gorev':sum(t['ogrenme_ciktisi']==k for t in db['tasks'])} for k,v in texts.items()]}
(ROOT/'data'/'5_SINIF_GEOMETRIK_NICELIKLER_RESMI_ESLESME.json').write_text(json.dumps(reference,ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'data'/'summary.json').write_text(json.dumps({'version':'2.6','tasks':2000,'grade5':810,'grade6':1190,'outcomes':47,'measure5':110,'new_tasks':30},ensure_ascii=False,indent=2),encoding='utf-8')
print('Built',len(rows),'new tasks; total',len(db['tasks']))
