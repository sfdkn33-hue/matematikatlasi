from pathlib import Path
import json,copy,shutil,math,re
SRC=Path('/mnt/data/atlas_v68_src');DST=Path('/mnt/data/atlas_v69_src')
if DST.exists():shutil.rmtree(DST)
shutil.copytree(SRC,DST,ignore=shutil.ignore_patterns('tests','*.zip'))
p=DST/'data/tasks.json';db=json.loads(p.read_text());old=copy.deepcopy(db['tasks']);T=db['tasks'];idmap={t['id']:t for t in T}
changes=[]
def change(code,i, title,question, hint, model):
 t=idmap[f'{code}-G{i:02d}']; assert not t.get('atlas63Pilot') and not t.get('atlas68Workbench'),t['id']
 # Old laboratory is replaced, not stacked behind new laboratory
 for key in ('decimalLab','algebra6Lab','geometryMeasureLab'):t.pop(key,None)
 t.update(baslik=title, gorev=question,ipucu=hint,mekanik='v6.9 · '+model['family'],kontrol_turu='etkilesimli',beklenen_yanit_veya_rubrik='Öğrencinin görsel modeli ve sayısal kanıtı otomatik doğrulanır.',atlas69Workbench=model,atlas63Pilot={'pilot_id':t['id'],'style':model['family'],'family':model['family'],'fields':[{'type':'numeric',**model['number']}],'question':question,'explanation':model['explanation'],'source_type':'Atlas v6.9 yeniden tasarlanmış görev', 'status':'Saha testi bekliyor'})
 changes.append(dict(id=t['id'],code=code,family=model['family'],mode=model['mode'],expected=model['expected'],number=model['number']['expected']))
def M(family,mode,opts,expected,nlabel,nval,scene,explanation,extra=None):
 m={'family':family,'mode':mode,'options':opts,'expected':expected,'number':{'label':nlabel,'expected':nval},'scene':scene,'explanation':explanation}
 if extra:m.update(extra)
 assert mode in ('choice','order','slider') and (expected in opts if mode=='choice' else (len(expected)==len(opts) if mode=='order' else isinstance(expected,int))), (family,expected,opts)
 assert isinstance(nval,(int,float));return m

# MAT.6.1.6: three genuine approaches x four different scenarios
co='MAT.6.1.6'
frac=[(1,4),(2,5),(3,8),(7,20)]
for ix,(a,b) in enumerate(frac,1):
 n=int(a*100//b); simplified=b//math.gcd(a,b)
 change(co,ix,'Ondalık bölme makinesi',f'{a}/{b} kesrini payı paydaya bölerek ondalık gösterime dönüştür. İki ondalık basamağı doğru sırada kur ve sadeleşmiş paydayı bul.', 'Pay ve paydayı böl. Gerekirse sonuna sıfır ekle. Sadeleşmiş paydayı da hesapla.', M('Ondalık basamak kartları','order',[str(n//10),str(n%10)],[str(n//10),str(n%10)],'Sadeleşmiş payda',simplified,{'kind':'fraction','numerator':a,'denominator':b},f'{a}/{b} = {a/b:.2f}; sadeleşmiş payda {simplified}.'))
frac2=[(1,6),(2,7),(3,10),(5,12)]
for j,(a,b) in enumerate(frac2,5):
 g=math.gcd(a,b);red=b//g;terminating=red
 while terminating%2==0:terminating//=2
 while terminating%5==0:terminating//=5
 kind='Sonlu' if terminating==1 else 'Devirli'
 change(co,j,'Payda ve devir dedektifi',f'{a}/{b} kesrinin en sade hâlini düşün. Ondalık açılımın sonlu mu devirli mi olacağını seç ve sadeleşmiş paydayı yaz.', 'Sadeleştirilmiş paydada yalnız 2 ve 5 asal çarpanları varsa sonuç sonludur.', M('Payda asal çarpan analizi','choice',['Sonlu','Devirli'],kind,'En sade payda',red,{'kind':'fraction','numerator':a,'denominator':b},f'Sadeleşmiş payda {red}; {kind.lower()} ondalık açılım.'))
frac3=[(1,3),(3,7),(2,9),(3,11)]
for j,(a,b) in enumerate(frac3,9):
 dec=(10*a)//b;rem=(10*a)%b
 change(co,j,'Kalan yolculuğu',f'{a}/{b} bölmesinde virgülden sonraki ilk basamağı seç, ilk basamaktan sonraki kalanı hesapla.', 'Payı 10 ile genişlet, bölümün tam kısmı ilk ondalık rakamdır. Kalanı ayrıca izle.', M('Uzun bölme ve kalan','choice',[str(dec),str((dec+1)%10),str((dec+2)%10)],str(dec),'İlk basamaktan sonraki kalan',rem,{'kind':'division','numerator':a,'denominator':b},f'10 × {a} = {b} × {dec} + {rem}; ilk rakam {dec}, kalan {rem}.'))

# MAT.6.2.3: make reverse, flow, bug tasks
co='MAT.6.2.3'
for j,(a,b,x) in enumerate([(2,3,4),(3,4,5),(4,2,3),(5,6,2)],1):
 steps=['Girdiyi oku',f'{a} ile çarp',f'{b} ekle','Çıktıyı yaz']; opts=[steps[3],steps[1],steps[0],steps[2]]
 change(co,j,'Algoritma akışı kur',f'Girdi x için {a}x+{b} değerini üreten algoritmanın dört kartını sırala. Girdi {x} ise son çıktıyı da yaz.', 'Girdi → çarpma → toplama → çıktı sırasını kur.', M('Akış şeması kurma','order',opts,steps,'Son çıktı',a*x+b,{'kind':'machine','a':a,'b':b,'input':x},f'{a}×{x}+{b}={a*x+b}.'))
for j,(a,b,x) in enumerate([(2,5,6),(3,7,4),(4,3,5),(5,2,3)],5):
 wrong=a*x-b
 change(co,j,'Bozuk makineyi tamir et',f'Algoritma önce {a} ile çarpıp sonra {b} EKLEMELİ. Girdi {x}; makine {wrong} çıktısını verdi. Hatalı işlem türünü seç ve doğru sonucu yaz.', 'Çıkarma ile toplama birbirine karıştırılmış. Son işlemi yeniden yap.', M('Algoritma hatasını teşhis','choice',['Çarpma','Toplama yerine çıkarma','Girdiyi iki kez okuma'],'Toplama yerine çıkarma','Doğru çıktı',a*x+b,{'kind':'machine','a':a,'b':b,'input':x,'wrong':wrong},f'Hata son adımda: {a*x}+{b}={a*x+b}; yanlış {wrong}.'))
for j,(a,b,x) in enumerate([(2,9,4),(3,5,6),(4,7,3),(5,4,7)],9):
 output=a*x+b; options=[str(x+2),str(x),str(x-1)]
 change(co,j,'Ters algoritma şifresi',f'Bilinmeyen sayı önce {a} ile çarpılıp ardından {b} ekleniyor. Çıktı {output}. Doğru girdiyi seç, çarpma adımındaki ara değeri yaz.', 'Önce çıktının içinden eklenen sayıyı çıkar, sonra çarpana böl.', M('Algoritmayı ters çözme','choice',options,str(x),'Toplama öncesi ara değer',a*x,{'kind':'machine','a':a,'b':b,'output':output},f'({output}−{b})÷{a}={x}; ara değer {a*x}.'))

# MAT.6.4.2: area configurations
co='MAT.6.4.2'
for j,(base,h,skew) in enumerate([(6,4,3),(8,3,2),(7,6,4),(9,4,3)],1):
 change(co,j,'Paralelkenarı dönüştür',f'Tabanı {base}, dik yüksekliği {h} olan paralelkenarın üst kenarını sola kaydırarak dikdörtgene dönüştür. Kes-yapıştır konumunu ayarla ve alanını hesapla.', 'Paralelkenarda eğik kenar değil dik yükseklik kullanılır. Sürgüyü sıfıra getir.', M('Kes–kaydır–alan koruma','slider',[],0,'Alan (birimkare)',base*h,{'kind':'parallelogram','base':base,'height':h,'initial':skew,'min':0,'max':6,'step':1,'unit':'birim'},f'Kaydırma alanı değiştirmez: {base}×{h}={base*h}.',{'initial':skew,'min':0,'max':6,'step':1}))
for j,(base,h) in enumerate([(8,5),(6,7),(10,3),(12,5)],5):
 change(co,j,'Üçgeni tamamla',f'Tabanı {base}, dik yüksekliği {h} olan üçgeni eş bir üçgenle tamamlayınca hangi şekil elde edilebilir? Doğru modeli seçip üçgen alanını yaz.', 'İki eş üçgen paralelkenar oluşturabilir. Üçgen, paralelkenarın yarısıdır.', M('Eş üçgenle alan modeli','choice',['İki eş üçgenle paralelkenar','Üçgen alanı taban × yükseklik','Yükseklik eğik kenardır'],'İki eş üçgenle paralelkenar','Üçgenin alanı',base*h/2,{'kind':'triangle','base':base,'height':h},f'{base}×{h}÷2={base*h/2:g}.'))
for j,(base,area) in enumerate([(6,24),(8,36),(10,25),(12,42)],9):
 h=2*area/base
 change(co,j,'Alanı tersinden tasarla',f'Tabanı {base} birim, alanı {area} birimkare olan üçgenin yüksekliğini bul. Doğru yöntemi seçip yüksekliği yaz.', 'Üçgende yükseklik = 2 × alan ÷ taban.', M('Ters alan problemi','choice',['2 × alan ÷ taban','Alan ÷ taban','Taban ÷ (2 × alan)'],'2 × alan ÷ taban','Gerekli dik yükseklik',h,{'kind':'triangle','base':base,'height':h,'area':area},f'2×{area}÷{base}={h:g}.'))

# MAT.6.4.6 arc ratio, full length expressed as kπ, no pi decimal
co='MAT.6.4.6'
for j,ang in enumerate([45,90,120,180],1):
 redn=ang//math.gcd(ang,360);redd=360//math.gcd(ang,360)
 change(co,j,'Yay açısını ayarla',f'Merkez açıyı sürgüyle {ang}° değerine getir. Yayı tam çemberin sadeleşmiş kaçta kaçı olduğunu pay/payda biçiminde modelle; payı yaz.', 'Yay payı = merkez açı ÷ 360. Sadeleştirmeyi unutma.', M('Dinamik yay dilimi','slider',[],ang,'Sadeleşmiş oranın payı',redn,{'kind':'arc','radius':5,'angle':ang,'min':0,'max':360,'step':15},f'{ang}/360={redn}/{redd}.',{'initial':0,'min':0,'max':360,'step':15,'denominator':redd}))
for j,(radius,ang) in enumerate([(4,90),(6,60),(8,45),(3,120)],5):
 k=2*radius*ang/360
 assert k==int(k)
 change(co,j,'Yay uzunluğu atölyesi',f'Yarıçapı {radius} birim olan çemberde {ang}° merkez açı için doğru yay oranını seç. Yay uzunluğunun π katsayısını hesapla.', 'Tam çevre 2πr; bunun açı/360 kadarı ilgili yayı verir.', M('Yay uzunluğu ve çevre','choice',[f'{ang}/360',f'{ang}/180',f'{360-ang}/360'],f'{ang}/360','Yay uzunluğunun π katsayısı',int(k),{'kind':'arc','radius':radius,'angle':ang},f'2×{radius}×({ang}/360)π={int(k)}π.'))
for j,(radius,ang) in enumerate([(6,90),(5,180),(8,135),(9,60)],9):
 k=2*radius*ang/360
 opts=[str(ang),str((ang+45)%360),str(max(0,ang-45))]
 change(co,j,'Yaydan açıya ters yol',f'Yarıçap {radius}. Yay uzunluğu {k:g}π birim ise merkez açıyı seç; çemberin toplam çevresinin π katsayısını yaz.', 'Merkez açı / 360 = yay uzunluğu / çember çevresi.', M('Yay verisinden açıyı bulma','choice',opts,str(ang),'Tam çevrenin π katsayısı',2*radius,{'kind':'arc','radius':radius,'angle':ang,'arcCoefficient':k},f'Yay oranı {k:g}/{2*radius}={ang}/360.'))
assert len(changes)==48
assert len(T)==4037 and [t['id'] for t in T]==[t['id'] for t in old]
assert sum(a!=b for a,b in zip(T,old))==48
# Synchronized JS DB, string matches earlier
p.write_text(json.dumps(db,ensure_ascii=False,indent=2))
(DST/'data/tasks.js').write_text('window.ATLAS_DB='+json.dumps(db,ensure_ascii=False,separators=(',',':'))+';\n')
(DST/'data/atlas69_changes.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2))
# app event guard for both legacy save bypass and lab UI
app=DST/'assets/js/app.js'
s=app.read_text();s=s.replace('a.atlas68Workbench||a.atlas63Pilot','a.atlas69Workbench||a.atlas68Workbench||a.atlas63Pilot')
s=s.replace("if(x.atlas68Workbench && window.__atlas68Verified!==x.id)","if(x.atlas69Workbench && window.__atlas69Verified!==x.id){feedback('Önce v6.9 modelini ve matematiksel kanıtını doğru tamamla.');return}\nif(x.atlas68Workbench && window.__atlas68Verified!==x.id)")
s=s.replace('function renderStudio(a){studio.task=a;',"function renderStudio(a){if(a.atlas69Workbench){$('studio').hidden=true;$('legacyAnswer').hidden=true;document.querySelectorAll('[id$=Lab]').forEach(e=>{if(e.id!=='atlas69Lab')e.hidden=true});return;}studio.task=a;")
# Guard rubric/hint also, even though hidden
s=s.replace("$('rubric').onclick=()=>{if(t().atlas61Lab)","$('rubric').onclick=()=>{if(t().atlas69Workbench){feedback('Önce modeli çöz; doğrulama alanı çözümü kendisi açıklayacak.');return}if(t().atlas61Lab)")
app.write_text(s)
idx=DST/'index.html'; h=idx.read_text()
h=h.replace('Matematik Atlası v6.8 · Tam Öğrenme Ana Etkinlikleri','Matematik Atlası v6.9 · Anlamlı Soru Çeşitliliği')
h=h.replace('<link rel="stylesheet" href="assets/css/atlas68_style.css">','<link rel="stylesheet" href="assets/css/atlas68_style.css"><link rel="stylesheet" href="assets/css/atlas69_style.css">')
h=h.replace('<section id="atlas68Lab"','<section id="atlas69Lab" hidden aria-label="v6.9 yeniden tasarlanmış ana görevler"></section><section id="atlas68Lab"')
h=h.replace('<script defer src="assets/js/atlas68_lab.js"></script>','<script defer src="assets/js/atlas68_lab.js"></script><script defer src="assets/js/atlas69_lab.js"></script>')
assert 'atlas69Lab' in h and 'atlas69_lab.js' in h
idx.write_text(h)
lab63=DST/'assets/js/atlas63_pilot_lab.js';code=lab63.read_text();code=code.replace('t.atlas63Pilot&&!t.atlas68Workbench','t.atlas63Pilot&&!t.atlas68Workbench&&!t.atlas69Workbench');lab63.write_text(code)
print('Built data',len(T),'changed',len(changes),'source',DST)
