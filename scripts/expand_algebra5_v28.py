#!/usr/bin/env python3
"""v2.8 50 genuine two-step algebra-thinking interactions aligned to official theme."""
from pathlib import Path
import json,csv,collections
P=Path(__file__).resolve().parents[1]; path=P/'data/tasks.json'; data=json.loads(path.read_text('utf8'))
assert len(data['tasks'])==2085
old_ids={t['id'] for t in data['tasks']}
M={
 'MAT.5.2.1':[('balance',4),('tiles',3),('regroup',3),('repairEquality',3)],
 'MAT.5.2.2':[('precedence',4),('brackets',3),('powers',3),('storyFormula',3)],
 'MAT.5.2.3':[('patternTable',3),('shapeGrow',3),('ruleMachine',3),('counterexample',3)],
 'MAT.5.2.4':[('machineTrace',3),('flowOrder',3),('loopTrace',3),('bugFix',3)],
}
TITLE={'balance':'Dengeli Terazi','tiles':'Dağılma Alanı','regroup':'Grup Fabrikası','repairEquality':'Eşitlik Tamircisi','precedence':'İşlem Sırası Rotası','brackets':'Parantez Mimarı','powers':'Kare–Küp Gücü','storyFormula':'Hikâyeden İşleme','patternTable':'Örüntü Tablosu','shapeGrow':'Kibrit Deseni','ruleMachine':'Kural Makinesi','counterexample':'Yanlış Varsayım Avcısı','machineTrace':'Sayı Makinesi','flowOrder':'Akış Şeması Kurucusu','loopTrace':'Tekrarlı Çıkarma Robotu','bugFix':'Algoritma Hata Avcısı'}
levels=['Keşfet','Modelle','Uygula','Sına','Gerekçelendir']; added=[]
for code,modes in M.items():
 j=0
 for mode,count in modes:
  for variant in range(count):
   j+=1; n=20+j;v=variant+j//4
   a=3+v%6;b=4+(v*2)%7;c=2+v%4
   d={'mode':mode,'needReason':(j%4==0),'variant':variant}
   if mode=='balance':
    k=2+v%5;d.update(a=a,b=b,change=k,base=a+b,newValue=a+b+k)
   if mode=='tiles':
    d.update(rows=a,left=b,right=c,part1=a*b,part2=a*c,total=a*(b+c))
   if mode=='regroup':
    d.update(a=a,b=b,c=c,groupLeft=a*b,groupRight=b*c,total=a*b*c)
   if mode=='repairEquality':
    d.update(a=a,b=b,rightA=a+1,rightB=b-1,error=1,total=a+b,faulty=a+b+1)
   if mode=='precedence':
    d.update(a=a,b=b,c=c,subtract=2+(v%3),product=b*c,afterSum=a+b*c,result=a+b*c-(2+v%3))
   if mode=='brackets':
    d.update(a=a,b=b,c=c,expressions=[f'({a}+{b})×{c}',f'{a}+{b}×{c}',f'{a}×({b}+{c})'],results=[(a+b)*c,a+b*c,a*(b+c)],targetIndex=variant%3)
   if mode=='powers':
    base=2+v%4;exp=(2 if variant%2==0 else 3);d.update(base=base,exponent=exp,value=base**exp,other=base**(5-exp))
   if mode=='storyFormula':
    packs=2+v%5, 3+v%4; d.update(packs=packs[0],items=packs[1],extra=a,correct=packs[0]*packs[1]+a)
   if mode=='patternTable':
    step=2+v%6;first=3+v%5;near=6+variant;far=17+v%7;d.update(step=step,first=first,near=near,far=far,nearValue=first+(near-1)*step,farValue=first+(far-1)*step)
   if mode=='shapeGrow':
    step=[2,3,4][variant%3];base=1+v%3;target=8+v%6;d.update(step=step,base=base,target=target,first=base+step,targetValue=base+step*target)
   if mode=='ruleMachine':
    coeff=2+v%5;offset=1+v%4;far=13+v;d.update(coeff=coeff,offset=offset,samples=[coeff*x+offset for x in [1,2,3]],far=far,farValue=coeff*far+offset)
   if mode=='counterexample':
    coeff=2+v%5;offset=1+v%4;ce=5+v%4;d.update(coeff=coeff,offset=offset,claimedOffset=offset+1,counterexample=ce,trueValue=coeff*ce+offset,falseValue=coeff*ce+offset+1)
   if mode=='machineTrace':
    inp=4+v;plus=2+variant;mult=2+v%3;d.update(inp=inp,plus=plus,mult=mult,intermediate=inp+plus,result=(inp+plus)*mult)
   if mode=='flowOrder':
    inp=3+v;step=2+v%4;mult=2+variant;d.update(inp=inp,plus=step,mult=mult,result=(inp+step)*mult,order=['Başla ve sayıyı gir',f'{step} ekle',f'{mult} ile çarp','Sonucu yazdır'],shuffled=[f'{mult} ile çarp','Sonucu yazdır','Başla ve sayıyı gir',f'{step} ekle'])
   if mode=='loopTrace':
    unit=3+v%4;times=2+variant;rem=1+v%unit;start=unit*times+rem;d.update(unit=unit,times=times,remainder=rem,start=start)
   if mode=='bugFix':
    inp=5+v;plus=3+variant;mult=2+v%3;d.update(inp=inp,plus=plus,mult=mult,shown=inp+plus+1,correctInter=inp+plus,result=(inp+plus)*mult)
   old_code_tasks=[t for t in data['tasks'] if t['ogrenme_ciktisi']==code]
   exemplar=old_code_tasks[0]; prompt={
     'balance':'Terazinin iki kefesini aynı biçimde değiştir; eşitliğin neden korunduğunu sonuçlarla göster.',
     'tiles':'Dikdörtgeni iki parçaya ayır, her parça ile bütünün kare sayısını doğrula.',
     'regroup':'Üç sayıdan kurulan eş grupları farklı sırayla paketle; iki ara işlemi denetle.',
     'repairEquality':'Yanlış eşitliği fark et; yalnız bozuk tarafta nasıl onaracağını bul.',
     'precedence':'İşlem sırasını adım adım kurup bütün ifadenin değerini hesapla.',
     'brackets':'Hedef değere ulaşan parantez yerini seç; işlemi hesapla.',
     'powers':'Kare mi, küp mü? Üslü ifadeyi seç ve sonucunu üret.',
     'storyFormula':'Paketli satış hikâyesini doğru işlem cümlesine dönüştür ve hesabını kontrol et.',
     'patternTable':'Sabit artışlı örüntünün hem yakın hem uzak adımını bul; genellemeyi sınamış ol.',
     'shapeGrow':'Kibrit veya karo örüntüsünde büyüme kuralını bulup uzak şekli tahmin et.',
     'ruleMachine':'Makinede adım sayısı ile değer arasındaki ilişkiyi kur; uzak değeri üret.',
     'counterexample':'Yanlış genellemeyi bir karşı örnekle çürüt; gerçek terimi hesapla.',
     'machineTrace':'Sayı makinesini iki adım boyunca izle; ara değeri ve çıktıyı belirt.',
     'flowOrder':'Karışmış akış şeması komutlarını sırala; çıkan sayıyı kontrol et.',
     'loopTrace':'Tekrarlı çıkarma robotunu çalıştır; kaç adımda ve hangi kalanla bittiğini göster.',
     'bugFix':'Algoritmadaki hatalı ara değeri düzelt; doğru nihai çıktıyı elde et.'}[mode]
   added.append({
     'id':f'{code}-G{n:02d}','ogrenme_ciktisi':code,'sinif':'5','gorev_no':str(n),
     'plan_sirasi':exemplar['plan_sirasi'],'tema_sirasi':6,'tema_ici_sira':exemplar.get('tema_ici_sira',1),
     'temanin_yaklasik_haftalari':'30–33','tema':'İşlemlerle Cebirsel Düşünme','seviye':str(min(5,1+(j-1)//3)),
     'asama':levels[min(4,(j-1)//3)],'rol':'Matematik kâşifi','mekan':'İşlem ve örüntü laboratuvarı',
     'mekanik':TITLE[mode],'baslik':f'{TITLE[mode]} · {n}','gorev':prompt,
     'kontrol_turu':'etkilesimli','beklenen_yanit_veya_rubrik':'İki matematiksel karar otomatik kontrol edilir. Yazılı gerekçe öğretmen tarafından incelenir.',
     'ipucu':'Önce modeli incele, sonra ara işlemi ve nihai kararı ayrı ayrı kontrol et.',
     'oyuncu_eylemi':'Model kur, dene, karşılaştır ve açıkla.','sure_dakika':'6','ogrenci_urun':'Cebirsel düşünme ve algoritma modeli',
     'algebra5PlusLab':d,'v28_generated':True})
assert len(added)==50 and not set(x['id'] for x in added)&old_ids
assert len(set(x['id'] for x in added))==50
for code in M:
 i=max(i for i,t in enumerate(data['tasks']) if t['ogrenme_ciktisi']==code)+1
 data['tasks'][i:i]=[a for a in added if a['ogrenme_ciktisi']==code]
for o in data['outcomes']:
 if o['kod'] in M:o['gorev_sayisi']=20+sum(n for mode,n in M[o['kod']])
for t in data['themes']:
 if str(t['sinif'])=='5' and t['tema_sirasi']==6:t['gorev_sayisi']=130
assert len(data['tasks'])==2135
path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n','utf8')
with (P/'data/CEBIRSEL_DUSUNME_50_YENI_GOREV.csv').open('w',newline='',encoding='utf-8-sig') as f:
 w=csv.writer(f,delimiter=';');w.writerow(['Görev ID','Öğrenme çıktısı','Oyun türü','Görev açıklaması','Ek gerekçe']);w.writerows([[a['id'],a['ogrenme_ciktisi'],a['mekanik'],a['gorev'],a['algebra5PlusLab']['needReason']] for a in added])
meta={'program':'Türkiye Yüzyılı Maarif Modeli · Ortaokul Matematik 5. Sınıf · 2. Tema','kaynak':'https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/450','ders_saati':20,
'resmi_metinler':{'MAT.5.2.1':'Eşitliğin korunumuna ve işlem özelliklerine yönelik çıkarım yapabilme','MAT.5.2.2':'Karşılaştığı günlük hayat ya da matematiksel durumlarda işlem önceliğini yorumlayabilme','MAT.5.2.3':'Sayı ve şekil örüntülerinin kuralına ilişkin muhakeme yapabilme','MAT.5.2.4':'Temel aritmetik işlem içeren durumlardaki algoritmaları yorumlayabilme'},
'alan_becerileri':['MAB1. Matematiksel Muhakeme'],'kavramsal_beceriler':['KB2.10. Çıkarım Yapma','KB2.14. Yorumlama'],'egilimler':['E3.3. Yaratıcılık','E3.7. Sistematiklik'],
'degerler':['D3. Çalışkanlık','D11. Özgürlük','D17. Tasarruf'],'okuryazarlik':['OB4. Görsel Okuryazarlık'],
'not':'Bileşen eşlemesi tema düzeyindedir; her bir göreve ayrı resmî MEB ataması yapıldığı iddia edilmez.'}
(P/'data/5_SINIF_CEBIRSEL_DUSUNME_RESMI_ESLESME.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n','utf8')
print('added',len(added),'all',len(data['tasks']),'modes',len(TITLE),'by code',collections.Counter(x['ogrenme_ciktisi'] for x in added))
