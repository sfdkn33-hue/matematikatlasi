from pathlib import Path
import json, math, collections, random
F=Path('/mnt/data/MATEMATIK_ATLASI_v4_3_ORTAOKUL/data/yazili_havuzu_v43.json')
d=json.loads(F.read_text(encoding='utf8'));Q=d['questions'];R3=['Matematiksel modeli doğru kurma','İşlemleri ve çözüm adımlarını açıklama','Sonucu ve birimini doğru belirtme'];R2=['Doğru yöntemi belirleme','Hesaplama ve sonuç']
def put(g,code,topic,level,family,i,statement,ans,steps):
 Q.append({'id':f'ATLAS-P{g}-{family}-{level[0]}-{i+1:02}', 'grade':g,'outcome':code,'topic':topic,'difficulty':level,'family':f'P{g}-{family}-{level}', 'question':statement,'answer':str(ans),'answer_alt':[],'solution':steps,'rubric':R2 if level=='Kolay' else R3,'source':'Matematik Atlası · özgün parametrik örnek', 'curriculum':'TYMM taslak eşleşme' if g<8 else '8. sınıf 2018 programı · taslak eşleşme','review_status':'pedagojik öğretmen onayı bekler'})
# 20 ayrı matematiksel aile, her biri 6 farklı sayı modeli × kolay/orta/zor.
for i in range(12):
 # 5. SINIF
 a=146+i*17; b=27+i*3; c=8+i
 put(5,'MAT.5.1.2','Doğal sayılarla işlemler','Kolay','TOP',i,f'Bir kütüphaneye {a} yeni kitap ve {b} dergi geldi. Toplam kaç yayın geldi?',a+b,f'{a}+{b}={a+b}.')
 put(5,'MAT.5.1.2','Doğal sayılarla işlemler','Orta','TOP',i,f'Bir kütüphanede {a} kitap vardı; {b} kitap geldi ve {c} kitap ödünç verildi. Son durumda rafta kaç kitap kaldı? İşlem sırasını açıkla.',a+b-c,f'{a}+{b}−{c}={a+b-c}.')
 put(5,'MAT.5.1.2','Doğal sayılarla işlemler','Zor','TOP',i,f'Kütüphanede {a} kitap vardır. Her biri {c} kitap getiren {b} sınıfın bağışı ekleniyor, ardından {c*7} kitap başka okula gönderiliyor. Kalan kitap sayısını iki işlem basamağında bul.',a+b*c-c*7,f'{b}×{c}={b*c}; {a}+{b*c}−{c*7}={a+b*c-c*7}.')
 n=8+i*3; p=3+i
 put(5,'MAT.5.1.3','Kesirler','Kolay','FRA',i,f'{n} eş dilime bölünmüş pastanın {p} dilimi yenildi. Yenilen kısmı kesir olarak yaz ve pay/paydayı açıkla.',f'{p}/{n}',f'{p} dilim / {n} dilim = {p}/{n}.')
 put(5,'MAT.5.1.3','Kesirler','Orta','FRA',i,f'{n} eş parçalı iki aynı çikolata vardır. İlkinin {p} parçası, ikincinin {p+2} parçası yeniyor. Toplam kaç bütün çikolatalık miktar yenmiştir? Kesirle göster.',f'{2*p+2}/{n}',f'({p}+{p+2})/{n}={2*p+2}/{n} (sadeleştirilebilir).')
 put(5,'MAT.5.1.3','Kesirler','Zor','FRA',i,f'Eş {n} parçalı iki pizzanın birinden {p}, diğerinden {p+2} dilim yenildi. Toplam yenilen miktar ile bir tam pizza arasındaki farkın kaç dilim olduğunu bul. Sonucun işaretinin anlamını açıkla.',abs(n-(2*p+2)),f'Yenilen toplam {2*p+2}/{n} pizzadır; 1 bütünden farkın büyüklüğü |{n}−{2*p+2}|={abs(n-(2*p+2))} dilimdir.')
 a=9+i; b=5+i
 put(5,'MAT.5.4.2','Dikdörtgen alanı','Kolay','AREA',i,f'Kenarları {a} ve {b} birim olan dikdörtgenin alanı kaç birim karedir?',a*b,f'A={a}×{b}={a*b}.')
 put(5,'MAT.5.4.2','Dikdörtgen alanı','Orta','AREA',i,f'{a}×{b} ölçülerindeki dikdörtgen, kısa kenara paralel iki parçaya bölünüyor. Parçalardan birinin genişliği 2 birim. Kalan parçanın alanını hesapla.',(a-2)*b,f'Kalan genişlik {a}−2={a-2}; alan {a-2}×{b}={(a-2)*b}.')
 put(5,'MAT.5.4.2','Dikdörtgen alanı','Zor','AREA',i,f'{a+4} birim uzunluğunda, {b+2} birim eninde bir bahçenin dört kenarından içeriye 1 birim genişliğinde yol yapılıyor. Yol dışında kalan dikdörtgen alan kaç birim karedir?',(a+2)*b,f'İç uzunluk {a+4}−2={a+2}, iç genişlik {b+2}−2={b}; alan {(a+2)*b}.')
 a=4+i;b=3+i
 put(5,'MAT.5.2.2','İşlem önceliği','Kolay','ORDER',i,f'{a}+{b}×2 işleminin sonucu nedir? Öncelikli işlemi belirt.',a+2*b,f'Önce {b}×2={b*2}; sonra {a+b*2}.')
 put(5,'MAT.5.2.2','İşlem önceliği','Orta','ORDER',i,f'{a}×({b}+3)−{a} işleminin sonucunu hesapla. Parantezin etkisini açıkla.',a*(b+2),f'Parantez {b+3}; {a}×{b+3}−{a}={a*(b+2)}.')
 put(5,'MAT.5.2.2','İşlem önceliği','Zor','ORDER',i,f'{a}×({b}+4)−2×({a}+{b}) işleminin değerini işlem basamaklarını göstererek hesapla.',a*(b+4)-2*(a+b),f'{a}×{b+4}={a*(b+4)}; 2×{a+b}={2*(a+b)}; fark {a*(b+4)-2*(a+b)}.')
 # 6. SINIF
 a=12+3*i;b=18+3*i
 put(6,'MAT.6.1.4','EBOB ve EKOK','Kolay','EKOK',i,f'{a} ve {b} sayılarının ortak katlarının en küçüğünü bul.',math.lcm(a,b),f'EKOK({a},{b})={math.lcm(a,b)}.')
 put(6,'MAT.6.1.4','EBOB ve EKOK','Orta','EKOK',i,f'Biri {a}, diğeri {b} dakikada bir gelen iki servis saat 08.00’de birlikte geldi. Bir daha kaç dakika sonra birlikte gelecek?',math.lcm(a,b),f'Tekrarlanma süresi EKOK({a},{b})={math.lcm(a,b)} dakikadır.')
 put(6,'MAT.6.1.4','EBOB ve EKOK','Zor','EKOK',i,f'İki alarm {a} ve {b} dakikada bir çalıyor. Saat 09.00’da birlikte çaldılar. Sonraki {math.lcm(a,b)*3} dakika içinde 09.00 dışındaki kaç kez birlikte çalarlar? Zaman çizelgesiyle açıkla.',3,f'Ortak çalma aralığı {math.lcm(a,b)} dakikadır; {math.lcm(a,b)*3} dakika içinde 3 kez.')
 p=3+i;q=8+i*2
 put(6,'MAT.6.1.5','Kesir ve ondalık','Kolay','DEC',i,f'{p}/{q} kesrini payı paydaya bölerek ondalık olarak yaz (4 basamağa kadar).',round(p/q,4),f'{p}÷{q}≈{p/q:.4f}.')
 put(6,'MAT.6.1.5','Kesir ve ondalık','Orta','DEC',i,f'{p}/{q} ve {p+1}/{q} kesirlerinin farkını ondalık biçimde yaz (4 basamağa kadar).',round(1/q,4),f'Fark 1/{q}≈{1/q:.4f}.')
 put(6,'MAT.6.1.5','Kesir ve ondalık','Zor','DEC',i,f'Bir uzunluğun {p}/{q} kadarı ve ayrıca {p+1}/{q} kadarı ölçüldü. İki ölçüm toplamının 1 bütünden farkının büyüklüğünü ondalık olarak yaz (4 basamağa kadar).',round(abs(1-(2*p+1)/q),4),f'Toplam ({p}+{p+1})/{q}={2*p+1}/{q}; fark |1−{2*p+1}/{q}|≈{abs(1-(2*p+1)/q):.4f}.')
 a=12+2*i;b=6+i
 put(6,'MAT.6.4.2','Üçgen alanı','Kolay','TRI',i,f'Tabanı {a} cm yüksekliği {b} cm olan üçgenin alanını bul.',a*b/2,f'{a}×{b}/2={a*b/2:g} cm².')
 put(6,'MAT.6.4.2','Üçgen alanı','Orta','TRI',i,f'Tabanı {a} cm ve yüksekliği {b} cm olan üçgen, aynı taban ve yükseklikte dikdörtgenle karşılaştırılıyor. Dikdörtgen alanı üçgen alanından kaç cm² fazladır?',a*b/2,f'Dikdörtgen {a*b}; üçgen {a*b/2:g}; fark {a*b/2:g}.')
 put(6,'MAT.6.4.2','Üçgen alanı','Zor','TRI',i,f'Taban uzunluğu {a} cm olan üçgenin alanı {a*b/2:g} cm². Taban 2 cm uzatılırken alan aynı tutulursa yeni yükseklik kaç cm olur?',round((a*b)/(a+2),4),f'Aynı alan için ({a+2})h/2={a*b/2:g}, h={a*b}/{a+2}≈{(a*b)/(a+2):.4f} cm.')
 a=7+i;b=3+i
 put(6,'MAT.6.2.1','Cebirsel düşünme','Kolay','ALG',i,f'Bir kalemin fiyatı x TL. {a} kalem ve {b} TL defter için ödenecek tutarın sabit terimi kaç TL’dir?',b,f'Toplam {a}x+{b}; sabit terim {b}.')
 put(6,'MAT.6.2.1','Cebirsel düşünme','Orta','ALG',i,f'Bir kitabın fiyatı x TL. {a} kitap ve tanesi {b} TL olan 3 defterin toplamı {a}x+□ TL biçiminde ifade ediliyor. □ kaçtır?',3*b,f'3×{b}={3*b}; toplam {a}x+{3*b}.')
 put(6,'MAT.6.2.1','Cebirsel düşünme','Zor','ALG',i,f'Tanesi x TL olan kitaptan {a} tane, tanesi {b} TL olan kalemden {a+2} tane alınıyor. {2*b} TL indirim uygulanıyor. Toplam ifadenin sabit terimi kaç TL olur? İfadeyi kur.',(a+2)*b-2*b,f'{a}x+({a+2})×{b}−{2*b}={a}x+{(a+2)*b-2*b}.')
 # 7. SINIF
 a=2+i;b=5+i;c=3+i
 put(7,'MAT.7.1.5','Oran','Kolay','RATIO',i,f'{a} mavi ve {b} kırmızı boncuk vardır. Mavi boncuk sayısının kırmızıya oranı nedir?',f'{a}/{b}',f'Mavi/kırmızı={a}/{b}.')
 put(7,'MAT.7.1.5','Oran','Orta','RATIO',i,f'Bir meyve suyu karışımında {a} bardak konsantre ile {b} bardak su kullanılıyor. Aynı oranla {3*a} bardak konsantre için kaç bardak su gerekir?',3*b,f'Katsayı 3; su {b}×3={3*b}.')
 put(7,'MAT.7.1.5','Oran','Zor','RATIO',i,f'Bir içecekte limon/su oranı {a}/{b}. Toplam {4*(a+b)} bardak karışım hazırlanıyor. Kaç bardak su gerekir? Oran parçalarını açıklayarak çöz.',4*b,f'Toplam parça {a+b}; her parça 4 bardak, su={b}×4={4*b}.')
 a=2+i;b=3+i;x=4+i
 put(7,'MAT.7.2.2','Birinci dereceden denklemler','Kolay','EQ',i,f'x+{a}={x+a} denkleminin kökü kaçtır?',x,f'Her iki taraftan {a} çıkarılır: x={x}.')
 put(7,'MAT.7.2.2','Birinci dereceden denklemler','Orta','EQ',i,f'{a}x+{b}={a*x+b} denklemini iki adımdan çöz ve sonucunu kontrol et.',x,f'{a}x={a*x}; x={x}. Kontrol: {a}×{x}+{b}={a*x+b}.')
 put(7,'MAT.7.2.2','Birinci dereceden denklemler','Zor','EQ',i,f'{a}(x+{b})−{a-1}x={x+a*b} denkleminin çözümünü bul ve bunun tüm gerçek sayılar için doğru olup olmadığını açıkla. Tüm sayılar çözümse yanıtına 1 yaz, değilse 0 yaz.',1,f'Sol taraf={a}x+{a*b}−{a-1}x=x+{a*b}, sağ tarafla özdeştir. Her x için doğru, yanıt 1.')
 a=3+i;b=4+i;c=5+i
 put(7,'MAT.7.4.4','Prizma hacmi','Kolay','VOL',i,f'Ayrıt uzunlukları {a}, {b}, {c} cm olan dikdörtgenler prizmasının hacmi kaç cm³ olur?',a*b*c,f'V={a}×{b}×{c}={a*b*c} cm³.')
 put(7,'MAT.7.4.4','Prizma hacmi','Orta','VOL',i,f'Hacmi {a*b*c} cm³ olan bir prizmanın tabanı {a}×{b} cm dikdörtgendir. Yüksekliği kaç cm olur?',c,f'Taban alanı {a*b} cm²; yükseklik {a*b*c}/{a*b}={c} cm.')
 put(7,'MAT.7.4.4','Prizma hacmi','Zor','VOL',i,f'Ayrıtları {a}, {b}, {c} cm olan bir akvaryumun su yüksekliği {c-2} cm. İçeride suyun kapladığı hacim ile tam dolu hacim arasındaki fark kaç cm³’tür?',a*b*2,f'Boş yükseklik 2 cm; boş hacim {a}×{b}×2={a*b*2} cm³.')
 n=12+3*i;r=3+i
 put(7,'MAT.7.7.1','Olasılık','Kolay','PROB',i,f'{n} eş kartın {r} tanesi kırmızıdır. Kırmızı gelme olasılığını kesir olarak yaz.',f'{r}/{n}',f'Uygun durum {r}, tüm durum {n}; olasılık {r}/{n}.')
 put(7,'MAT.7.7.1','Olasılık','Orta','PROB',i,f'{n} eş kartın {r} tanesi kırmızıdır. Kırmızı gelmeme olasılığı nedir?',f'{n-r}/{n}',f'Tümleyen=(1−{r}/{n})={n-r}/{n}.')
 put(7,'MAT.7.7.1','Olasılık','Zor','PROB',i,f'{n} eş kartın {r} tanesi kırmızı. Kırmızı gelmeme olasılığını bulduktan sonra sonuca eşit olacak biçimde kaç kırmızı olmayan kart daha eklersen tümleyen olasılık 3/4 olur? (Eklenecek kart sayısını yaz.)',max(0,4*r-n),f'Eğer eklenecek kırmızı olmayan kart t ise (n−r+t)/(n+t)=3/4 → t=4r−n={4*r-n}. Bu modelde t negatifse böyle ekleme mümkün değildir (0 cevabı ekleme yok demek değildir).')
 # 8. SINIF
 a=36+6*i;b=54+9*i
 put(8,'ATLAS.8.2018.CARPAN','EBOB','Kolay','GCD',i,f'{a} ve {b} sayılarının EBOB’u kaçtır?',math.gcd(a,b),f'EBOB({a},{b})={math.gcd(a,b)}.')
 put(8,'ATLAS.8.2018.CARPAN','EBOB','Orta','GCD',i,f'{a} kırmızı ve {b} yeşil kalem eş içerikli en çok sayıda pakete ayrılacak. Kaç paket yapılabilir?',math.gcd(a,b),f'Paket sayısı EBOB({a},{b})={math.gcd(a,b)}.')
 put(8,'ATLAS.8.2018.CARPAN','EBOB','Zor','GCD',i,f'{a} cm ve {b} cm uzunluğundaki iki şerit en büyük eş boydaki parçalara ayrılıyor. Toplam kaç parça oluşur?',a//math.gcd(a,b)+b//math.gcd(a,b),f'Parça boyu {math.gcd(a,b)} cm; toplam {a//math.gcd(a,b)}+{b//math.gcd(a,b)}={a//math.gcd(a,b)+b//math.gcd(a,b)}.')
 a=2+i%3;b=3+i
 put(8,'ATLAS.8.2018.USLU','Üslü ifadeler','Kolay','POWER',i,f'{a}^{b} işleminin değeri kaçtır?',a**b,f'{a}^{b}={a**b}.')
 put(8,'ATLAS.8.2018.USLU','Üslü ifadeler','Orta','POWER',i,f'{a}^{b}×{a}² işleminin sonucunu tek kuvvetin üssü olarak yaz. Yalnızca üssü gir.',b+2,f'{a}^{b}×{a}²={a}^{b+2}.')
 put(8,'ATLAS.8.2018.USLU','Üslü ifadeler','Zor','POWER',i,f'({a}^{b}×{a}³) ÷ {a}² işlemi {a}^k biçiminde yazılır. k kaçtır? Üs kurallarını gerekçelendir.',b+1,f'k={b}+3−2={b+1}.')
 a=3+i
 put(8,'ATLAS.8.2018.KAREKOK','Kareköklü ifadeler','Kolay','ROOT',i,f'√{a*a} ifadesinin pozitif değerini bul.',a,f'√({a}²)={a}.')
 put(8,'ATLAS.8.2018.KAREKOK','Kareköklü ifadeler','Orta','ROOT',i,f'√{2*a*a} ifadesi k√2 biçiminde yazılıyor. k kaçtır?',a,f'√({a}²×2)={a}√2.')
 put(8,'ATLAS.8.2018.KAREKOK','Kareköklü ifadeler','Zor','ROOT',i,f'√{8*a*a}−√{2*a*a} ifadesi k√2 olur. k kaçtır? Kök dışına çıkarma işlemlerini göster.',a,f'√({4*a*a}×2)−√({a*a}×2)=2×{a}√2−{a}√2={a}√2.')
 a=2+i;b=3+i;c=5+i
 put(8,'ATLAS.8.2018.DENKLEM','Doğrusal denklemler','Kolay','LINE',i,f'y={a}x+{b} doğrusunun y eksenini kestiği değer kaçtır?',b,f'x=0 için y={b}.')
 put(8,'ATLAS.8.2018.DENKLEM','Doğrusal denklemler','Orta','LINE',i,f'y={a}x+{b} doğrusu üzerinde x={c} iken y kaçtır?',a*c+b,f'y={a}×{c}+{b}={a*c+b}.')
 put(8,'ATLAS.8.2018.DENKLEM','Doğrusal denklemler','Zor','LINE',i,f'y={a}x+{b} ve y={a+2}x+{b-2*c} doğrularının kesişme noktasının x koordinatını bul.',c,f'{a}x+{b}=({a+2})x+{b-2*c}; 2x={2*c}; x={c}.')
# Known invalid patterns safeguards
for q in Q:
 if q['id'].startswith('ATLAS-P7-PROB-Z-'):
  # express valid hard task with exact integer answer, adding red cards to achieve probability 1/2
  i=int(q['id'].split('-')[-1])-1;n=12+3*i;r=3+i
  q['question']=f'{n} eş kartın {r} tanesi kırmızı. Kırmızı gelme olasılığının 1/2 olması için torbaya kaç kırmızı kart daha eklenmelidir? Denklemini kur.'
  q['answer']=str(n-2*r)
  q['solution']=f'({r}+t)/({n}+t)=1/2 → 2r+2t=n+t → t={n-2*r}.'
# Guard: unique ids and clean full list
seen=set()
for q in Q:
 assert q['id'] not in seen,q['id'];seen.add(q['id']);assert q['question'] and q['solution'] and q['answer']
d['questions']=Q;d['notice']='Resmî MEB soru havuzu değildir; öğretmen onayı bekleyen özgün pilot/parametrik soru bankasıdır. Kazanım eşleştirmeleri öğretmen tarafından doğrulanmalıdır.'
F.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf8')
print('question bank',len(Q),'difficulties',collections.Counter(q['difficulty'] for q in Q),'outcomes',len(set(q['outcome'] for q in Q)))
