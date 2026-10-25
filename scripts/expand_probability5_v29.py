#!/usr/bin/env python3
"""v2.9, grade 5 subjective probability. Never modify pre-existing task records."""
from pathlib import Path
import json,csv
P=Path(__file__).resolve().parents[1]
f=P/'data/tasks.json'; db=json.loads(f.read_text('utf-8'))
assert len(db['tasks'])==2135, 'Run only on v2.8 bank'
source='https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/455'
outcomes={
 'MAT.5.6.1':{'official':'Herhangi bir olayın olasılığının 0 (imkânsız) ile 1 (kesin) arasında (0 ve 1 dâhil) olduğunu (olasılık spektrumu) yorumlayabilme', 'components':['Olayları ve olası durumları inceler.','Bir olayın olasılığına dair tahminlerini farklı sayı temsillerine dönüştürür.','Kendi ifadeleriyle tahminde bulunduğu bir olayın olasılığının 0 ile 1 arasında (0 ve 1 dâhil) olduğunu ifade eder.']},
 'MAT.5.6.2':{'official':'Olayları az ya da çok olasılıklı şeklinde yapılandırabilme','components':['Olayların olasılıklarına ilişkin nedensel veya mantıksal ilişkiler ortaya koyar.','Kendi öz bilgisi ile elde ettiği ilişkilere dayanarak olayların olasılıklarını az veya çok olasılıklı şeklinde ortaya koyar.']}}
for o in db['outcomes']:
 if o['kod'] in outcomes:
  o['resmi_metin']=outcomes[o['kod']]['official'];o['resmi_metin_mi']=True;o['resmi_kaynak']=source;o['resmi_surec_bilesenleri']=outcomes[o['kod']]['components']
for theme in db['themes']:
 if str(theme['sinif'])=='5' and theme['tema_sirasi']==7:
  theme['gorev_sayisi']=50;theme['kaynak']=source
spec=[
('MAT.5.6.1','spectrum','Spektrum Mimarı','Özdeş 10 eş bölmeli çarkın 3 bölgesi sarı. Sarıya gelme ihtimalini yüzde spektrumunda işaretle, sonra 0–1 kuralını seç.','Çarkı incele, tahmin işaretini sürükle ve doğru sınırı belirt.',{'colored':3,'total':10,'percent':30,'secondary':1},False,'3/10 = %30 = 0,3. Olasılık 0 ile 1 arasında.'),
('MAT.5.6.1','translate','Üç Dilde Olasılık','10 eş kartın 4 tanesi yıldızlı. Yıldızlı kart çekme olasılığını yüzde, ondalık ve kesir olarak eşleştir.','Aynı olasılığın farklı sayı temsillerini bul.',{'colored':4,'total':10,'percent':40,'decimal':'0,4','fraction':'2/5'},False,'4/10 = %40 = 0,4 = 2/5.'),
('MAT.5.6.1','bounds','İmkânsız Değer Avcısı','Olasılık değeri diye önerilen -0,2, 0,3, 1,3 ve 1 sayılarını incele; olasılık olamayacakların ikisini seç.','Spektrumun iki dışına taşan sayıları işaretle.',{'values':[-0.2,0.3,1.3,1],'wrong':[0,2]},False,'Olasılıklar 0 ile 1 aralığındadır; -0,2 ve 1,3 olamaz.'),
('MAT.5.6.1','uncertain','Hava Durumu Yorumcusu','Hava durumu raporu yarın yağmur olasılığını %70 olarak tahmin ediyor. Spektrumu işaretle ve bunun kesin yağmur anlamına gelip gelmediğini seç.','Tahmin edilen yüzde kesinlikle aynı şey değildir.',{'percent':70,'decision':0},True,'Tahmin %70 olabilir, fakat %100 olmadığı için kesin değildir.'),
('MAT.5.6.1','area','Olasılık Mozaiği','10 eş karelik görselde 6 kareyi yeşile boya. Ortaya çıkan tahmini yüzde ile eşleştir.','Alan modeli ve yüzde temsilini birlikte oluştur.',{'total':10,'colored':6,'percent':60},False,'6/10 alan = %60 = 0,6.'),
('MAT.5.6.2','bagBuild','Renk Torbası Tasarımcısı','8 özdeş top kullanarak, kırmızı top seçmenin maviden daha olası olduğu bir torba tasarla. En az bir mavi top kalsın.','Topların rengini değiştir ve hangi rengin daha olası olduğunu açıkla.',{'total':8,'initialRed':4,'minBlue':1,'relation':'redMore'},True,'Kırmızı sayısı mavi sayısından büyük olmalı; iki renk de bulunmalı.'),
('MAT.5.6.2','compare','İki Torba Hakemi','A torbasında 5 kırmızı 3 mavi, B torbasında 2 kırmızı 6 mavi özdeş top var. Hangi torbada kırmızı çekmek daha olası? Dayanağını seç.','Her iki torbada toplam sekiz top olduğuna dikkat et.',{'a':[5,3],'b':[2,6],'winner':0,'evidence':1},True,'A torbası: 5/8 > B torbası: 2/8.'),
('MAT.5.6.2','fair','Adil Çark Ustası','10 eş dilimli çarkı iki renge öyle boya ki iki rengin gelme şansı eşit olsun.','Aynı büyüklükte iki renk grubu oluştur.',{'total':10,'initialRed':10,'target':5},False,'İki rengin de 5/10 = %50 olasılığı vardır.'),
('MAT.5.6.2','trials','Deney Sonucu Savcısı','7 kırmızı 3 mavi özdeş topun olduğu torbada altı denemede 2 kırmızı ve 4 mavi gelmiş. Sence hangisi uzun vadede daha olası? Kısa deneyden ne çıkarılamaz?','Küçük örneklem kesin olasılık kanıtı değildir.',{'red':7,'blue':3,'observedRed':2,'trials':6,'winner':0,'conclusion':1},True,'Torbada kırmızı daha fazla; altı gözlem gerçekte bulunan top sayılarını değiştirmez.'),
('MAT.5.6.2','ethics','Adil Oyun Kurulu','Sınıf ödül çekilişinin tüm öğrenciler için adil olmasını istiyorsun. Hangi sistemi seçer ve neden onu savunursun?','Adalet, tercih edilen arkadaşlara daha çok hak vermemektir.',{'plan':0,'evidence':0},True,'Herkese eşit katılım hakkı verirsek seçilme olasılığı eşit olur.')]
count={'MAT.5.6.1':20,'MAT.5.6.2':20};rows=[]
for code,mode,title,prompt,hint,cfg,reason,answer in spec:
 count[code]+=1;i=count[code]
 t={
 'plan_sirasi':22 if code.endswith('.1') else 23,'tema_sirasi':7,'tema':'Veriden Olasılığa',
 'tema_ici_sira':1 if code.endswith('.1') else 2,'temanin_yaklasik_haftalari':'34–35',
 'id':f'{code}-G{i:02d}','ogrenme_ciktisi':code,'sinif':'5','gorev_no':str(i),
 'seviye':str(2 if i<=23 else 3),'asama':'Araştır / Gerekçelendir',
 'rol':'Olasılık Mühendisi','mekan':'Olasılık Laboratuvarı',
 'mekanik':'Olasılık Tasarım Atölyesi · '+title,'baslik':title,'gorev':prompt,
 'kontrol_turu':'etkilesimli','beklenen_yanit_veya_rubrik':answer,
 'ipucu':hint,'oyuncu_eylemi':'Modeli değiştir, iki ayrı kararı kontrol et',
 'sure_dakika':'5','ogrenci_urun':'Olasılık modeli ve matematiksel çıkarım',
 'probability5PlusLab':{'mode':mode,'needReason':reason,**cfg},'v29_generated':True}
 db['tasks'].append(t)
 rows.append({k:t[k] for k in ('id','ogrenme_ciktisi','baslik','gorev','beklenen_yanit_veya_rubrik','ipucu')})
assert len(db['tasks'])==2145 and len(set(t['id'] for t in db['tasks']))==2145
f.write_text(json.dumps(db,ensure_ascii=False,indent=2)+'\n','utf-8')
with (P/'data/OLASILIK_10_YENI_GOREV.csv').open('w',newline='',encoding='utf-8-sig') as out:
 w=csv.DictWriter(out,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
reference={'source':source,'grade':'5','theme':'Veriden Olasılığa','hours':9,'skills':['KB2.13 Yapılandırma','KB2.14 Yorumlama','MAB3 Matematiksel Temsil'],'dispositions':['E1.1 Merak','E2.5 Oyunseverlik','E3.9 Şüphe Duyma'],'values':['D1 Adalet'],'visual_literacy':['OB4 Görsel Okuryazarlık'],'outcomes':outcomes,'note':'Bu bileşenler resmî tema düzeyindedir; her tekil görev için otomatik eşleşme doğrulanmış sayılmaz.'}
(P/'data/5_SINIF_OLASILIK_RESMI_ESLESME.json').write_text(json.dumps(reference,ensure_ascii=False,indent=2)+'\n','utf8')
(P/'data/summary.json').write_text(json.dumps({'version':'2.9','tasks':2145,'grade5':955,'grade6':1190,'outcomes':47,'probability5':50,'new_tasks':10,'new_modes':10,'official_5_probability_outcomes':2},ensure_ascii=False,indent=2)+'\n','utf8')
print('10 new v29 tasks; 2145 total')
