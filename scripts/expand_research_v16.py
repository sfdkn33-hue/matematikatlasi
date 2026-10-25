#!/usr/bin/env python3
"""v1.6: expand MAT.6.5.1 to 80, MAT.6.5.2 to 60 playable missions."""
import json, statistics, collections, random, math
from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'data/tasks.json';db=json.loads(p.read_text(encoding='utf8'));old=db['tasks'];ids={t['id'] for t in old}
new=[];upgraded=0
first='MAT.6.5.1'; second='MAT.6.5.2'
contexts=['okul kütüphanesi','bisiklet parkı','sınıf kitaplığı','fidan atölyesi','okul kantini','spor kulübü','geri dönüşüm ekibi','gezici kitaplık','oyun bahçesi','mahalle festivali']
subjects=['kitap','bisiklet','kitap','fidan','ürün','antrenman','şişe','kitap','oyun','etkinlik']
phase=['Keşfet','Planla','Veri üret','Veriyi göster','Analiz et','Yorumla','Sorgula','Yeniden dene']
names={
'question':'Araştırma Sorusu Tasarımcısı','sampling':'Temsilî Örneklem','survey':'Veri Toplama Tezgâhı','dotplot':'Nokta Grafiği Mimarı','stemleaf':'Kök–Yaprak Laboratuvarı','mean':'Ortalama Denge Masası','median':'Ortanca ve Açıklık Rotası','cycle':'Araştırma Döngüsü',
'axis':'Yanıltıcı Eksen Dedektifi','samplecrit':'Örneklem Yanlılığı Mahkemesi','outlier':'Aykırı Değer Deneyi','compare':'İki Grubu Karşılaştır','claim':'İddia ve Kanıt Masası','repair':'Hatalı Raporu Onar'}

for code,mode_list in [(first,['question','sampling','survey','dotplot','stemleaf','mean','median','cycle']), (second,['axis','samplecrit','outlier','compare','claim','repair'])]:
 for mode_index,mode in enumerate(mode_list):
  for j in range(10):
   n=mode_index*10+j+1;r=random.Random(n*271+(0 if code==first else 19));context=contexts[j]
   title=f'{names[mode]} · {context.title()}'
   prompt='';spec={'mode':mode,'title':names[mode]}
   if mode=='question':
    good=f'{context.title()}: Geçen hafta kaç {subjects[j]} kaydedildi?'
    opts=[good,f'{context.title()} ülkenin en güzel yeri midir?',f'{context.title()} herkes tarafından neden beğenilir?']
    shift=j%3;opts=opts[shift:]+opts[:shift]
    spec.update(options=opts,correct=opts.index(good),variable='Kesikli nicel')
    prompt=f'{context.title()}: Hangisi farklı öğrencilerden veri toplanarak cevaplanabilecek açık araştırma sorusudur? Veri türünü de belirt.'
   elif mode=='sampling':
    choices=['Farklı sınıflardan rastgele öğrenci seçmek','Yalnızca teneffüste ilk geçen arkadaşlara sormak','Sadece aynı kulüpteki öğrencilere sormak'];r.shuffle(choices)
    spec.update(options=choices,correct=choices.index('Farklı sınıflardan rastgele öğrenci seçmek'))
    prompt=f'{context.title()}: Okuldaki tüm öğrenciler hakkında yorum yapmak için hangi örneklem seçimi daha dengeli olur?'
   elif mode=='survey':
    labs=['Yürüyüş','Bisiklet','Servis']; seq=[labs[(k*k+j+k//3)%3] for k in range(17+j%5)];
    spec.update(labels=labs,observations=seq,counts=[seq.count(x) for x in labs]);prompt=f'{context.title()}: Anonim ulaşım tercihleri kartlarını sayarak sıklık tablosunu oluştur.'
   elif mode=='dotplot':
    values=[(k*(2+j%3)+j+k//3)%6 for k in range(11+j%6)];spec.update(values=values,domain=list(range(6)),counts=[values.count(x) for x in range(6)])
    prompt=f'{context.title()}: Bir haftadaki etkinlik sayısı verilerinden nokta grafiği yap. Her nokta bir gözlem olsun.'
   elif mode=='stemleaf':
    values=sorted([11+((k*7+j*5+k//4)%51) for k in range(12+j%5)]);stems=sorted(set(x//10 for x in values));spec.update(values=values,stems=stems,leaves={str(s):' '.join(str(x%10) for x in values if x//10==s) for s in stems})
    prompt=f'{context.title()}: {len(values)} adet iki basamaklı ölçümden kök–yaprak gösterimi oluştur; her satırdaki yaprakları küçükten büyüğe diz.'
   elif mode=='mean':
    values=[2+((k*3+j*2)%8) for k in range(5+j%3)];tot=sum(values);spec.update(values=values,total=tot,answer=tot/len(values))
    prompt=f'{context.title()}: Eşit paylaşım modeliyle aritmetik ortalamayı bul; toplamı ve kişi sayısını kullan.'
   elif mode=='median':
    values=[2+((k*k+j*3+k)%15) for k in range(7+(j%3))];values=values if len(values)%2 else values+[j+2];sortedvals=sorted(values)
    spec.update(values=values,median=statistics.median(values),spread=max(values)-min(values),sorted=sortedvals)
    prompt=f'{context.title()}: Verileri sırala; ortancayı ve açıklığı hesapla. Ortancanın tek ve çift veri sayısındaki farkına dikkat et.'
   elif mode=='cycle':
    steps=['Araştırma sorusunu belirle','Veri toplama planını kur','Veri topla ve göster','Sonucu sorgula']; shuffled=steps[:];r.shuffle(shuffled)
    if shuffled==steps:shuffled.reverse()
    spec.update(steps=shuffled,correct=steps)
    prompt=f'{context.title()}: Araştırma sürecinin dört adımını doğru sıraya getir; adımların döngüsel olduğunu hatırla.'
   elif mode=='axis':
    a,b=42+j*2,47+j*2;baseline=a-2;spec.update(a=a,b=b,baseline=baseline,answer=b-a)
    prompt=f'{context.title()}: Grafikte dikey eksen {baseline} değerinden başlıyor. İki sütun arasındaki gerçek sayısal farkı bul ve ekseni sıfırdan başlat.'
   elif mode=='samplecrit':
    opts=['Sınıf düzeylerine göre rastgele katılımcı seç','Yalnızca bir kulübün çevrim içi grubuna sor','Yalnızca sabah erken gelenleri kullan'];r.shuffle(opts)
    spec.update(options=opts,correct=opts.index('Sınıf düzeylerine göre rastgele katılımcı seç'))
    prompt=f'{context.title()}: Küçük ve yanlı bir anketi okulun tamamını temsil edecek biçimde düzelt.'
   elif mode=='outlier':
    values=[4+j%3,5+j%3,5+j%3,6+j%3,7+j%3];outlier=25+3*j;extended=values+[outlier];
    spec.update(values=values,outlier=outlier,mean=round(statistics.mean(extended),2),median=statistics.median(extended),initialMean=statistics.mean(values))
    prompt=f'{context.title()}: Yeni uç değeri veri grubuna katıp ortalama ile ortancayı karşılaştır. Hangisi uç değerden daha az etkilenir?'
   elif mode=='compare':
    a=[3+((k*2+j)%8) for k in range(7)]; b=[4+((k*3+j+2)%8) for k in range(7)];ma=statistics.median(a);mb=statistics.median(b)
    spec.update(a=a,b=b,medianA=ma,medianB=mb,correct='A' if ma>mb else 'B' if mb>ma else 'Eşit')
    prompt=f'{context.title()}: İki grubun ortancasını hesapla ve hangi grubun ortancasının daha büyük olduğunu belirle.'
   elif mode=='claim':
    labels=['Kitap','Spor','Müzik']; counts=[5+j%4,7+(j*2)%5,3+(j%3)]; idx=j%3;total=sum(counts);percent=round(100*counts[idx]/total,1)
    spec.update(labels=labels,counts=counts,target=idx,total=total,percent=percent,claim=f'Katılımcıların %80’i {labels[idx]} seçti.',correct='Desteklenmiyor')
    prompt=f'{context.title()}: “Katılımcıların %80’i {labels[idx]} seçti.” iddiası bu tabloyla destekleniyor mu? Yüzdeyi hesapla.'
   elif mode=='repair':
    labels=['A','B','C'];real=[4+j%3,7+j%4,5+(2*j)%5];idx=j%3;shown=real[:];shown[idx]+=2+(j%3)
    spec.update(labels=labels,real=real,shown=shown,wrong=idx,correct=real[idx]);prompt=f'{context.title()}: Grafikteki sütunlardan biri veri tablosunu yanlış temsil ediyor. Hatalı sütunu seç ve gerçek sıklığı gir.'
   nstr=f'{n:02d}';task_id=f'{code}-G{nstr}'
   task={'plan_sirasi':next(o['plan_sirasi'] for o in db['outcomes'] if o['kod']==code),'tema_sirasi':4,'tema':'İstatistiksel Araştırma Süreci','tema_ici_sira':1 if code==first else 2,'temanin_yaklasik_haftalari':'13–18','id':task_id,'ogrenme_ciktisi':code,'sinif':6,'gorev_no':n,'seviye':1+(j//2),'asama':phase[mode_index%8],'rol':'Veri dedektifi','mekan':context,'mekanik':names[mode],'baslik':title,'gorev':prompt,'kontrol_turu':'etkilesimli','beklenen_yanit_veya_rubrik':'Sayı, model ve kritik seçim otomatik değerlendirilir; açıklama ve araştırma niteliği öğretmen tarafından değerlendirilir.','ipucu':{'stemleaf':'Kök onlar basamağı, yaprak birler basamağıdır.','median':'Önce sayıları sırala; açıklık = en büyük − en küçük.','mean':'Ortalama = toplam / gözlem sayısı.'}.get(mode,'Verileri ve araştırma sorusunu yeniden karşılaştır.'),'oyuncu_eylemi':'Veriyi modelle, analiz et ve gerekçelendir','sure_dakika':5+j//4,'ogrenci_urun':'Etkileşimli veri görseli / çözüm ve yorum','researchLab':spec}
   if task_id in ids:
    old_one=next(x for x in old if x['id']==task_id);old_one.update(task);upgraded+=1
   else:
    new.append(task)
assert upgraded+len(new)==140,(upgraded,len(new))
db['tasks']=old+new
order={o['kod']:(o['sinif'],o['plan_sirasi']) for o in db['outcomes']}
db['tasks'].sort(key=lambda t:(order[t['ogrenme_ciktisi']],int(t['gorev_no'])))
for o in db['outcomes']:
 ts=[t for t in db['tasks'] if t['ogrenme_ciktisi']==o['kod']];assert [int(t['gorev_no']) for t in ts]==list(range(1,len(ts)+1)),o['kod']
for o in db['outcomes']:
 if o['sinif']==6 and o['tema_sirasi']>=4:
  if o['tema_sirasi']==4:o['tema_ders_saati']=24
  # recompute approximate weeks below
for theme in db['themes']:
 if str(theme['sinif'])=='6' and theme['tema_sirasi']==4:theme['ders_saati']=24
 theme['gorev_sayisi']=sum(str(t['sinif'])==str(theme['sinif']) and int(t['tema_sirasi'])==theme['tema_sirasi'] for t in db['tasks'])
# reflow timeline in the same grade, without claiming exact weekly dates
for grade in ('5','6'):
 cursor=1
 for th in [t for t in db['themes'] if str(t['sinif'])==grade]:
  th['ders_baslangici']=cursor;th['ders_bitisi']=cursor+int(th['ders_saati'])-1;th['yaklasik_hafta']=f'{math.ceil(cursor/5)}–{math.ceil((cursor+int(th["ders_saati"])-1)/5)}'
  cursor+=int(th['ders_saati'])
 for out in db['outcomes']:
  if str(out['sinif'])==grade:
   th=next(th for th in db['themes'] if str(th['sinif'])==grade and th['tema_sirasi']==out['tema_sirasi']);out['tema_tahmini_hafta']=th['yaklasik_hafta']
 for task in db['tasks']:
  if str(task['sinif'])==grade:
   th=next(th for th in db['themes'] if str(th['sinif'])==grade and th['tema_sirasi']==task['tema_sirasi']);task['temanin_yaklasik_haftalari']=th['yaklasik_hafta']
assert len(db['tasks'])==1230
assert len(set(t['id'] for t in db['tasks']))==1230
assert ids.issubset({t['id'] for t in db['tasks']})
assert collections.Counter(t['researchLab']['mode'] for t in db['tasks'] if 'researchLab' in t)=={m:10 for m in names}
p.write_text(json.dumps(db,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
summary=root/'data/summary.json';s=json.loads(summary.read_text(encoding='utf8'));s.update(version='1.6',tasks=1230,grade5=460,grade6=770,interactive=930,researchLab=140,researchModes=14,curriculum_source='https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/461')
summary.write_text(json.dumps(s,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Upgraded',upgraded,'old tasks; created',len(new),'total',len(db['tasks']))
