#!/usr/bin/env python3
"""5th grade categorical statistics: 85 scenarios, with 17 nonidentical action patterns."""
from pathlib import Path
import json,csv,collections
P=Path(__file__).resolve().parents[1]; source=P/'data/tasks.json';data=json.loads(source.read_text('utf8'))
assert len(data['tasks'])==2000 and len(set(t['id'] for t in data['tasks']))==2000
OLD={t['id']:t for t in data['tasks']}
CASES=[
 ('Kitap Kulübü','kitap türü',['Macera','Bilim','Şiir']),
 ('Okul Kantini','ara öğün tercihi',['Meyve','Sandviç','Yoğurt']),
 ('Doğa Gözlem Ekibi','doğa gözlemi',['Ağaç','Kuş','Çiçek']),
 ('Spor Şenliği','etkinlik tercihi',['Voleybol','Yüzme','Bisiklet']),
 ('Ulaşım Araştırması','okula ulaşım şekli',['Yürüyüş','Servis','Bisiklet'])]
MODES1=['questionBuilder','neutralSurvey','privacyPlan','samplePlan','tally','barBuild','dotBuild','cycle']
MODES2=['claim','axis','bias','repair','gap','compare','missing','scope','inconsistent']
TITLES={'questionBuilder':'Araştırma Sorusu Tasarımcısı','neutralSurvey':'Tarafsız Anket Laboratuvarı','privacyPlan':'Veri Güvenliği Nöbetçisi','samplePlan':'Örneklem Stratejisti','tally':'Çetele İstasyonu','barBuild':'Sütun Grafiği Mühendisi','dotBuild':'Nokta Grafiği Kurgusu','cycle':'Araştırma Süreci Rotası','claim':'Kanıt Hakemi','axis':'Yanıltıcı Eksen Dedektifi','bias':'Örneklemde Yanlılık Avı','repair':'Grafik Onarım Atölyesi','gap':'Eksik Kayıt Bulmacası','compare':'İki Sınıfı Karşılaştır','missing':'Gizli Kategoriyi Bul','scope':'İddianın Sınırı','inconsistent':'Tutarsız Rapor Denetçisi'}
CODES={'MAT.5.5.1':(MODES1,40), 'MAT.5.5.2':(MODES2,45)}
new=[]
for code,(modes,count) in CODES.items():
 for k,mode in enumerate(modes):
  for j,(place,subject,labels) in enumerate(CASES):
   ix=k*5+j;no=21+ix; a=[5+j,10+j%3,3+j//2]; r=(k+j)%3;counts=a[r:]+a[:r]
   # deterministic shuffled fictitious observations
   records=[labels[z] for z,n in enumerate(counts) for _ in range(n)];step=(j*7+k*3+1)%len(records);records=records[step:]+records[:step]
   correctTop=max(range(3),key=lambda z:counts[z]);correctLow=min(range(3),key=lambda z:counts[z]);
   cfg=dict(mode=mode,place=place,subject=subject,labels=labels,counts=counts,records=records,top=correctTop,low=correctLow,needReason=(k+j)%4==0)
   if mode=='questionBuilder':
    qs=[f'{place} grubunda {subject} kategorileri nasıl dağılıyor?',f'{place} için en güzel {subject} kesinlikle hangisidir?',f'Her öğrenci {labels[0]} seçmeli değil mi?']; rot=(k+j)%3;cfg.update(questions=qs[rot:]+qs[:rot],rightQ=(3-rot)%3,methods=['Anonim, tek seçimli kategorik anket','Katılımcıların adlarını herkese açıklama','Bir kategoriye yönlendirerek kayıt toplama'],rightM=0)
   if mode=='neutralSurvey':
    cands=[f'En çok hangi {subject} seçeneğini tercih edersin?',f'En sevdiğin seçenek {labels[0]}, değil mi?',f'Bu soruyu yanıtlayanların adresi nedir?']; rot=(j+1)%3;cfg.update(questions=cands[rot:]+cands[:rot],rightQ=(3-rot)%3,methods=['Bir yanıt: '+', '.join(labels),'İsim ve telefon numarası','Sadece '+labels[0]+' seçeneğini sun'],rightM=0)
   if mode=='privacyPlan':cfg.update(questions=['İsim yerine anonim kategori kodu kullan','Kimlik ve adresleri tabloyla birlikte yayımla','Kişisel bilgileri sosyal grupta paylaş'],rightQ=0,methods=['Yalnız toplam kategori sıklıklarını göster','Tek tek katılımcıların bilgilerini paylaş','Fotoğraflarla katılımcıları tanıt'],rightM=0)
   if mode=='samplePlan':cfg.update(questions=['Farklı sınıflardan dengeli ve gönüllü katılım','Yalnızca ilk teneffüste kantindeki ilk üç kişi','Tek bir kulübün üyelerini bütün okul sayma'],rightQ=0,methods=['Katılımcıların sınıf dağılımını kontrol et','Sadece en sevilen kategoriyi kaydet','Sonuçları tüm ülkeye kesin genelle'],rightM=0)
   if mode=='cycle':cfg.update(order=['Araştırma sorusu oluştur','Veri toplama planı hazırla','Anonim veriyi topla','Tablo / grafik oluştur','Sonucu sorgula'],shuffled=['Veri toplama planı hazırla','Tablo / grafik oluştur','Araştırma sorusu oluştur','Sonucu sorgula','Anonim veriyi topla'])
   if mode=='claim':cfg.update(target=correctTop,opponent=correctLow,margin=counts[correctTop]-counts[correctLow],statement=f'{labels[correctTop]} kategorisi, {labels[correctLow]} kategorisinden daha sık gözlenmiştir.',truth=True)
   if mode=='axis':cfg.update(hi=correctTop,lo=correctLow,baseline=min(counts)-1,margin=counts[correctTop]-counts[correctLow])
   if mode=='bias':cfg.update(questions=['Yalnızca '+labels[0]+' seçenleri ankete almak','Farklı gruplardan dengeli katılım sağlamak','Anketi anonim ve tarafsız yürütmek'],rightQ=0,methods=['Yalnız bu grubun tercihleri bilinir; genellenemez','Bütün öğrenciler aynı seçeneği seçer','Okuldaki herkes temsil edilmiştir'],rightM=0)
   if mode=='repair':cfg.update(corrupt=(j+k)%3,shown=[v+(2 if z==(j+k)%3 else 0) for z,v in enumerate(counts)])
   if mode=='gap':cfg.update(hidden=(j+k)%3,total=sum(counts),visible=[None if z==(j+k)%3 else x for z,x in enumerate(counts)])
   if mode=='compare':
    other=[x+((1 if z==correctTop else -1)*(2+j%2)) for z,x in enumerate(counts)]
    cfg.update(other=other,target=correctTop,which='B' if other[correctTop]>counts[correctTop] else 'A',delta=abs(other[correctTop]-counts[correctTop]))
   if mode=='missing':cfg.update(hidden=(j+k)%3,total=sum(counts),visible=[None if z==(j+k)%3 else x for z,x in enumerate(counts)])
   if mode=='scope':cfg.update(questions=[f'Bu {sum(counts)} anonim gözlemde en sık kategori {labels[correctTop]}.',f'{labels[correctTop]} tüm ülkede kesinlikle birincidir.',f'Hiçbir katılımcı {labels[correctLow]} seçmemiştir.'],rightQ=0,methods=['Başka gruplarda dağılım değişebilir','Bu tablo bütün ülkede kanıt oluşturur','Tek bir örneklem geleceği kesin gösterir'],rightM=0)
   if mode=='inconsistent':cfg.update(corrupt=(j+k)%3,reported=[x+(2 if z==(j+k)%3 else 0) for z,x in enumerate(counts)],total=sum(counts))
   # Ensure every question does NOT leak the correct answer directly; visual has the data as needed
   prompt={'questionBuilder':f'{place}: {subject} üzerine veriyle yanıtlanabilir araştırma sorusunu kur; veriyi nasıl güvenle toplayacağını seç.',
           'neutralSurvey':f'{place}: tarafsız anket sorusunu ve geçerli tek seçimli yanıt seçeneklerini belirle.',
           'privacyPlan':f'{place}: anonim veriyi güvenli topla ve güvenli paylaş.',
           'samplePlan':f'{place}: {subject} konusunda savunulabilir bir örnekleme planı yap.',
           'tally':f'{place}: anonim tercih fişlerini say, kategorik sıklık tablosu oluştur, en sık olanı bul.',
           'barBuild':f'{place}: anket sıklıklarından doğru sütun grafiği kur ve en az tercih edileni işaretle.',
           'dotBuild':f'{place}: her gözlem için bir nokta yerleştir ve en sık tercih edileni belirle.',
           'cycle':f'{place}: istatistiksel araştırma sürecinin adımlarını doğru sıraya getir.',
           'claim':f'{place}: bir başka öğrencinin veri yorumunu kanıtla sınayıp sıklık farkını bul.',
           'axis':f'{place}: sıfırdan başlamayan grafiğin nasıl yanıltabileceğini incele.',
           'bias':f'{place}: taraflı örneklemi teşhis et; hangi sonuca varılamayacağını bul.',
           'repair':f'{place}: bir sütun yanlış çizildi. Hangi kategori, doğru sıklık kaç?',
           'gap':f'{place}: eksik tabloyu toplam gözlem sayısından tamamla; veri kaynağını sorgula.',
           'compare':f'{place}: iki grubun aynı kategorideki sıklıklarını karşılaştır.',
           'missing':f'{place}: toplamdan eksik kategori sıklığını bulup en çok tercih edileni belirle.',
           'scope':f'{place}: hangi yorum yalnızca bu gözlemlere dayanarak savunulabilir?',
           'inconsistent':f'{place}: rapordaki çelişkili sütunu belirle ve doğru toplamı yeniden oluştur.'}[mode]
   task={
    'id':f'{code}-G{no:02d}', 'ogrenme_ciktisi':code,'sinif':'5','gorev_no':str(no),
    'plan_sirasi':16 if code.endswith('1') else 17,'tema_sirasi':5,'tema_ici_sira':1 if code.endswith('1') else 2,
    'temanin_yaklasik_haftalari':'25–29','tema':'İstatistiksel Araştırma Süreci',
    'seviye':str(1+min(k//2,4)), 'asama':['Keşfet','Modelle','Uygula','Sına','Gerekçelendir'][min(k//2,4)],
    'rol':['Araştırmacı','Grafik mimarı','Veri dedektifi','Editör','Karar hakemi'][k%5],
    'mekan':place,'mekanik':TITLES[mode],'baslik':f'{TITLES[mode]} · {no}/{20+count}',
    'gorev':prompt,'kontrol_turu':'etkilesimli','beklenen_yanit_veya_rubrik':'Kategorik veriye dayalı matematiksel karar doğrulanır; açıklama öğretmen tarafından incelenir.',
    'ipucu':'Yalnız örneklemin verisine dayan. Kategorileri, sayıları ve tarafsızlığı kontrol et; kimlik bilgisi toplama.',
    'oyuncu_eylemi':'Veriyi düzenle, model oluştur, kanıtı denetle.','sure_dakika':'6','ogrenci_urun':'Kategorik veri modeli ve değerlendirme',
    'research5PlusLab':cfg,'v27_generated':True}
   assert task['id'] not in OLD and task['id'] not in {x['id'] for x in new}
   new.append(task)
assert len(new)==85
# Insert immediately after existing corresponding code blocks and preserve every old task's payload.
for code in CODES:
 ix=max(i for i,t in enumerate(data['tasks']) if t['ogrenme_ciktisi']==code)+1
 data['tasks'][ix:ix]=[x for x in new if x['ogrenme_ciktisi']==code]
for o in data['outcomes']:
 if o['kod'] in CODES:o['gorev_sayisi']=60 if o['kod']=='MAT.5.5.1' else 65
for theme in data['themes']:
 if str(theme['sinif'])=='5' and theme['tema_sirasi']==5:theme['gorev_sayisi']=125
assert len(data['tasks'])==2085
source.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n','utf8')
rows=[['Görev ID','Öğrenme çıktısı','Yer','Oyun türü','Görev yönergesi','Beceri odağı']];
for t in new:
 rows.append([t['id'],t['ogrenme_ciktisi'],t['mekan'],t['mekanik'],t['gorev'],'Kategorik veri analizi' if t['ogrenme_ciktisi'].endswith('1') else 'İstatistiksel yorum eleştirisi'])
with (P/'data/ISTATISTIK_85_YENI_GOREV.csv').open('w',encoding='utf-8-sig',newline='') as f:csv.writer(f,delimiter=';').writerows(rows)
meta={'program':'Türkiye Yüzyılı Maarif Modeli — Ortaokul Matematik 5. Sınıf / 5. Tema','kaynak':'https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/452','ders_saati':24,'resmi_metinler':{'MAT.5.5.1':'Kategorik veri ile çalışabilme ve veriye dayalı karar verebilme','MAT.5.5.2':'Başkaları tarafından oluşturulan kategorik veriye dayalı istatistiksel sonuç veya yorumları tartışabilme'},'alan_becerileri':['MAB4. Veri ile Çalışma ve Veriye Dayalı Karar Verme'],'kavramsal_beceriler':['KB2.18. Tartışma'],'egilimler':['E3.4 Gerçeği Arama','E3.5 Açık Fikirlilik','E3.6 Analitiklik','E3.7 Sistematiklik','E3.8 Soru Sorma','E3.9 Şüphe Duyma','E3.10 Eleştirel Bakma'],'degerler':['D5 Duyarlılık','D6 Dürüstlük','D17 Tasarruf','D18 Temizlik','D8 Mahremiyet'],'eslesme_duzeyi':'Tema düzeyi program bileşenleri. Her bir göreve resmî atama yapıldığı iddia edilmez.','süreç':'Kategorik veri, araştırma sorusu, tarafsız örneklem, güvenli veri toplama, görselleştirme ve sonuç eleştirisi.'}
(P/'data/5_SINIF_ISTATISTIK_RESMI_ESLESME.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n','utf8')
print('NEW',len(new),'COUNTS',collections.Counter(t['ogrenme_ciktisi'] for t in new), 'TOTAL',len(data['tasks']))
