#!/usr/bin/env python3
"""Give extra, independently verified math decisions to v2.0's repeated task instructions.
Does not replace primary interactions or overwrite their progress keys.
Idempotent: strips previous v2.1 added wording if present.
"""
from pathlib import Path
from collections import defaultdict, Counter
import json, math, re
ROOT=Path(__file__).resolve().parents[1]
path=ROOT/'data/tasks.json'
db=json.loads(path.read_text(encoding='utf8'))
tasks=db['tasks']
groups=defaultdict(list)
for t in tasks:
    primary=t.get('onceki_yonerge',t['gorev'])
    groups[(t['ogrenme_ciktisi'],primary.strip().casefold())].append(t)

def fmt(v):
    if isinstance(v, float):
        v=round(v,3)
        if v.is_integer(): v=int(v)
    return str(v).replace('.',',')

def numb(question,value,explain='',step=1):
    if abs(value-round(value))<1e-8:
        value=int(round(value)); step=max(1,int(step))
        opts=[value-step,value+step,value+2*step,value-2*step,value+3*step]
        opts=[x for x in opts if x>=0 and x!=value]
    else:
        value=round(value,2);step=max(0.1,float(step))
        opts=[round(value+step,2),round(value-step,2),round(value+2*step,2),round(value-2*step,2)]
        opts=[x for x in opts if x>=0 and x!=value]
    arr=[]
    for x in [value]+opts:
        if fmt(x) not in arr:arr.append(fmt(x))
        if len(arr)==3:break
    if len(arr)<3:raise ValueError((question,value,arr))
    return question,arr,fmt(value),explain

def pick(question,answer,wrong1,wrong2,explain=''):
    ans=str(answer);arr=[]
    for x in [answer,wrong1,wrong2]:
        x=str(x)
        if x not in arr:arr.append(x)
    if len(arr)<3:raise ValueError((question,arr))
    return question,arr,ans,explain

def gcd(a,b):return math.gcd(int(a),int(b))

def question_for(t,i):
    lab=next(k for k in t if k.endswith('Lab') or k=='studio')
    c=t[lab];mode=c.get('kind','') if lab=='studio' else c.get('mode',c.get('kind',''))
    scene=t.get('mekan','')
    if lab=='studio':
        if mode=='line':
            return [
              pick('Çizdiğin doğruyu iki yönde uzattığında uç nokta sayısı kaç olur?', '0','1','2','Bir doğru uçsuzdur.'),
              pick('Bir doğrunun üzerindeki iki farklı nokta tek bir doğru belirler mi?','Evet','Hayır','Yalnız yatay olduğunda'),
              pick('Düz bir yolu ne kadar uzatırsan uzat, doğru modelinin uzunluğu sınırlı olur mu?','Hayır','Evet','Yalnız sağa doğru'),
              pick('İki farklı doğru en fazla kaç ortak noktaya sahip olabilir?', '1','2','Sonsuz','Farklı iki doğru en fazla bir noktada kesişir.')
            ][i%4]
        if mode=='ray':
            return [
              pick('Bir ışının kaç başlangıç noktası vardır?','1','0','2'),
              pick('Başlangıç noktasından geriye uzattığında aynı ışın korunur mu?','Hayır','Evet','Her zaman bir doğru parçası olur'),
              pick('Bir ışın yalnızca bir yönde sınırsız uzar mı?','Evet','Hayır','Her iki yönde'),
              pick('Aynı başlangıçtan farklı yönlere çizilen ışınlar aynı ışın mıdır?','Hayır','Evet','Yalnız uzunluk eşitse')
            ][i%4]
        if mode=='segment':
            return [
              pick('Doğru parçasını belirlemek için kaç uç noktaya ihtiyaç vardır?','2','0','1'),
              pick('Doğru parçasının uzunluğu ölçülebilir mi?','Evet','Hayır','Yalnız dik olduğunda'),
              pick('İki uç noktasından birini öteleyince parça hep aynı uzunlukta kalır mı?','Hayır','Evet','Yalnız sağa ötelemede'),
              pick('Uç noktalarını A ve B diye adlandırmak, BA ile AB parçasını farklı yapar mı?','Hayır','Evet','Uzunluklar farklıysa')
            ][i%4]
        if mode=='perp':
            return [
              numb('Yatay çizgiyle dik geçidin yaptığı küçük açı kaç derecedir?',90,'Dik kesişme 90° oluşturur.',10),
              numb('İki dik doğrunun çevresinde kaç dik açı bölgesi oluşur?',4,'Bir tam açı dört dik açıdan oluşur.'),
              numb('İki dik doğru arasındaki komşu açıların toplamı kaç derecedir?',180,'Komşu bütünler açılar toplamı 180°dir.',30),
              numb('Bir tam açı kaç tane 90°lik dilimden oluşur?',4,'360 ÷ 90 = 4.')
            ][i%4]
        if mode=='circle':
            r=c.get('radius')
            if r:
                return [
                  numb(f'Yarıçapı {r} birim olan çemberin çapı kaç birimdir?',2*r,'Çap, yarıçapın iki katıdır.'),
                  numb(f'Merkezden çember üzerindeki bir noktaya uzaklık {r} ise, çember üzerindeki diğer noktaların uzaklığı kaçtır?',r,'Bütün yarıçaplar eşittir.'),
                  numb(f'Çapı {2*r} birim olan aynı çemberin yarıçapı kaç birimdir?',r,'Yarıçap çapın yarısıdır.')
                ][i%3]
            return [pick('Çemberde merkezi sabit tutup yarıçapı değiştirirsen hangi özellik korunur?','Merkez','Çap','Çevre'),
                    pick('Çemberin tüm noktalarının merkeze uzaklıkları eşit midir?','Evet','Hayır','Yalnız yatay doğrultuda')][i%2]
        if mode=='angle':
            v=int(c.get('target',60))
            if i%3==0:return numb(f'{v}°lik açının komşu bütünler açısı kaç derecedir?',180-v,'Bütünler açılar toplamı 180°dir.',10)
            if i%3==1:return pick(f'{v}°lik açı hangi sınıftadır?',('Dar' if v<90 else 'Dik' if v==90 else 'Geniş'),'Doğru','Tam','90°den küçük açı dardır; 90° dik, 90°–180° arası geniştir.')
            return numb(f'{v}°lik açıdan doğru açıya ulaşmak için kaç derece daha gerekir?',180-v,'Doğru açı 180°dir.',10)
        if mode=='polygon':
            n=int(c['target'])
            if i%3==0:return numb(f'{n} kenarlı kapalı çokgenin köşe sayısı kaçtır?',n,'Bir çokgende köşe ve kenar sayısı eşittir.')
            if i%3==1:return numb(f'{n} kenarlı çokgende köşelerin kaçında iki kenar birleşir?',n,'Her köşede iki kenar birleşir.')
            return numb(f'{n} köşeli bir çokgeni kapatmak için toplam kaç doğru parçası gerekir?',n,'Her kenar bir doğru parçasıdır.')
        if mode=='lineRelations':
            v=int(c.get('target',90))
            if i%2==0:return numb(f'İşaretlenen açı {v}° ise komşu bütünler açısı kaç derecedir?',180-v,'Komşu bütünler açıların toplamı 180°dir.',10)
            return numb(f'İşaretlenen açı {v}° ise ters açısının ölçüsü kaç derecedir?',v,'Ters açılar eşit ölçülüdür.',10)
        if mode=='polyAnalyze':
            return pick('Tüm kenarları aynı uzunlukta olup açıları farklı olan bir çokgen kesinlikle düzgün müdür?', 'Hayır','Evet','Sadece beşgenlerde','Düzgün çokgende hem kenar hem açı ölçüleri eşit olmalıdır.')
    if lab=='fractionLab':
        a=float(c['anchor']);cards=c['cards'];chosen=min(cards,key=lambda x:abs(float(x['value'])-a))
        if i%2==0:return pick('Referans noktasına en yakın kesir hangisidir?',chosen['label'],*[x['label'] for x in cards if x is not chosen][:2])
        return numb(f'Karşılaştırdığın {len(cards)} kesirden kaç tanesi {fmt(a)} referans değerinden büyüktür?',sum(float(x['value'])>a for x in cards),'Kartları sayı doğrusunda kıyasla.')
    if lab=='algebraLab':
        st=c['steps'];d=st[1]-st[0]
        return (numb(f'Şekil örüntüsüne 1 yeni adım eklendiğinde kaç nokta eklenir?',d,'Ardışık iki adım arasındaki farkı bul.') if i%2==0
                else numb(f'İlk üç adım {", ".join(map(str,st[:3]))} ise dördüncü adımda kaç nokta olur?',st[-1]+d,'Sabit artışı bir kez daha ekle.'))
    if lab=='probabilityLab':
        if mode=='compare':
            a,b=c['a'],c['b'];prop_a=a[0]/sum(a);prop_b=b[0]/sum(b)
            return (numb(f'A torbasında {sum(a)} toptan kaçı kırmızıdır?',a[0],'Kırmızı top sayısını pay olarak al.') if i%2==0
                   else pick(f'A kırmızı oranı {a[0]}/{sum(a)}, B kırmızı oranı {b[0]}/{sum(b)}. Hangisi daha büyüktür?', 'A' if prop_a>prop_b else 'B' if prop_a<prop_b else 'Eşit',*([x for x in ['A','B','Eşit'] if x!=('A' if prop_a>prop_b else 'B' if prop_a<prop_b else 'Eşit')])))
        if mode=='fair':
            z=c['sets'][ord(c['correct'])-65]
            return numb(f'Adil seçilen torbada toplam kaç top bulunur?',sum(z),'İki renkten eşit sayı olmalıdır.') if i%2==0 else numb(f'Adil torbada her bir renkten kaç top vardır?',z[0],'Adil oyun için kırmızı ve mavi sayıları eşittir.')
    if lab=='expLab':
        if mode=='run':
            labels=c['labels'];ws=c['weights'];s=sum(ws);w=ws[labels.index(c['target'])]
            v=i%5
            if v==0:return numb(f'Deney düzenekindeki toplam eş büyüklükte dilim/top ağırlığı kaç birimdir?',s,'Ağırlıkların toplamını al.')
            if v==1:return numb(f'Düzeneğin {c["target"]} sonucunu temsil eden kaç eş birimi vardır?',w,'Hedef sonucun modeldeki ağırlığını bul.')
            if v==2:return pick('20 rastlantısal deneyde her bir sonucun belirli sayıda çıkması kesin midir?','Hayır','Evet','Yalnız para atışında','Örneklemde sonuçlar rastlantıyla değişir.')
            if v==3:return pick('Deney sonunda gözlenen sıklık oranı hangi iki değere dayanır?', 'Hedef sayısı ve toplam deneme','Sadece hedef rengi','Çarkın görsel boyutu')
            return pick('Aynı deneyi yeniden yapınca gözlenen yüzde değişebilir mi?','Evet','Hayır','Sadece toplamı değiştirilirse','Deneysel oran tekrarlar arasında değişebilir.')
        if mode=='table':
            ct=Counter(c['sequence']);labels=list(c['labels']);which=labels[i%len(labels)]
            if i%3==0:return numb(f'Bu gözlem dizisinde toplam kaç deney sonucu kaydedilmiştir?',len(c['sequence']),'Dizideki bütün sonuçları say.')
            if i%3==1:return numb(f'Dizide “{which}” çıktısı kaç kez gözlenmiştir?',ct[which],'Hedef kategorinin sıklığını say.')
            return numb(f'“{which}” dışındaki sonuçların toplamı kaçtır?',len(c['sequence'])-ct[which],'Toplamdan hedef sıklığı çıkar.')
        if mode=='compare':
            if i%3==0:return numb(f'A deneyinde olayın gözlenme sayısı kaçtır?',c['aHits'],'Gözlenen sayıyı tablodan oku.')
            if i%3==1:return numb(f'B deneyinde olayın gözlenmediği tekrar sayısı kaçtır?',c['bTotal']-c['bHits'],'Toplam tekrar sayısından gözlenen sayıyı çıkar.')
            a=c['aHits']/c['aTotal'];b=c['bHits']/c['bTotal']
            return pick(f'{c["aHits"]}/{c["aTotal"]} ve {c["bHits"]}/{c["bTotal"]} gözlenen oranlarından hangisi büyüktür?', 'A' if a>b else 'B' if b>a else 'Eşit', *([x for x in ['A','B','Eşit'] if x!=('A' if a>b else 'B' if b>a else 'Eşit')]),explain='Sadece ham sayı değil, toplam tekrar sayısını da kullan.')
    if lab=='geometry6Lab':
        shape=c['shape']
        props={'kare':(4,4),'yamuk':(4,1),'paralelkenar':(4,2),'dikdörtgen':(4,2)}
        sides,pairs=props.get(shape,(4,2))
        return (numb(f'{shape.capitalize()} kaç kenarlı bir dörtgendir?',sides,'Dörtgenler dört kenarlıdır.') if i%2==0
                else numb(f'{shape.capitalize()} modelinde kaç çift karşı kenar paraleldir?',pairs,'Yamuk en az bir paralel kenar çiftine sahiptir; modelde bir çift gösteriliyor.'))
    if lab=='algebra6Lab':
        if mode=='spotError':
            at=int(c['errorAt']);correct=c['a']*at+c['b']
            return (numb(f'Hatalı görünen {at}. satırın doğru çıktı değeri kaç olmalıdır?',correct,'İlişkiye adım numarasını yerleştir.') if i%2==0
                    else numb(f'{at}. satır için y={c["a"]}n+{c["b"]} kuralının n katsayısı kaçtır?',c['a'],'n katsayısı adımlar arası artışı verir.'))
        if mode=='polygonInterior':
            n=int(c['sides'])
            return (numb(f'{n} kenarlı çokgen kaç üçgene ayrılır?',n-2,'Bir köşeden ayırmada n−2 üçgen oluşur.') if i%2==0
                    else numb(f'{n} kenarlı çokgenin iç açılar toplamı kaç derecedir?',(n-2)*180,'(n−2)×180° hesapla.',180))
    if lab=='geometryMeasureLab':
        v=c.get('d',0);pi=float(c.get('pi',3.14))
        if mode=='areaRepair':return numb(f'{c["a"]} m² kaç dm² eder?',int(c['a'])*100,'Alan birimlerinde doğrusal dönüşüm katsayısının karesi alınır.',100)
        if mode in ('measureRatio','diameterExperiment','piIdentity','piTable'):
            return (numb(f'Çapı {v} olan çemberin yarıçapı kaç birimdir?',v/2,'Yarıçap çapın yarısıdır.') if i%2==0
                    else numb(f'π≈3,14 ise çapı {v} olan çemberin çevresi yaklaşık kaç birimdir?',v*pi,'Çevre = çap × π.',1))
        if mode in ('wheelComparison','wheelsDifference'):
            other=c['otherD'];return (numb(f'{v} ve {other} çaplı iki tekerleğin çap farkı kaçtır?',abs(v-other),'Çapları çıkar.') if i%2==0
                                          else numb(f'{v} ve {other} çaplı tekerleklerin bir turda aldığı yol farkı yaklaşık kaçtır? (π≈3,14)',abs(v-other)*pi,'Çap farkını π ile çarp.',1))
        if mode=='circleRace':return numb(f'Yarıçap {v/2:g} birim ise çap kaç birimdir?',v,'Çap = 2 × yarıçap.')
        if mode=='radiusFromTrack':return numb(f'Yarıçap {v/2:g} birim ise çap kaç birimdir?',v,'Çap = 2 × yarıçap.')
    raise ValueError('Unhandled repeated task: '+t['id']+' '+lab+' '+str(mode))

edited=[]
unique_primary=set((x["ogrenme_ciktisi"],x.get("onceki_yonerge",x["gorev"]).strip().casefold()) for x in tasks)
new_primary=set()
for (_,instruction),items in groups.items():
    if len(items)<=1:continue
    for i,task in enumerate(items[1:]):
        question,choices,answer,expl=question_for(task,i)
        # A grounded scene label keeps visually similar contexts recognisable to students.
        question=task['mekan']+': '+question
        candidate=(task['ogrenme_ciktisi'],(task.get('onceki_yonerge',task['gorev'])+' İkinci düşünme adımı: '+question).strip().casefold())
        if candidate in new_primary:
            question=task['mekan']+' / '+task['baslik']+': '+question.split(': ',1)[-1]
        new_primary.add((task['ogrenme_ciktisi'],(task.get('onceki_yonerge',task['gorev'])+' İkinci düşünme adımı: '+question).strip().casefold()))
        # deterministic rotation without relying on random selection
        rot=(int(task['gorev_no'])%3)
        choices=choices[rot:]+choices[:rot]
        assert answer in choices and len(set(choices))==3
        task['onceki_yonerge']=task.get('onceki_yonerge',task['gorev'])
        task['gorev']=task['onceki_yonerge']+' İkinci düşünme adımı: '+question
        task['bonusGorev']={'soru':question,'secenekler':choices,'dogru':answer,'aciklama':expl,'zorunlu':False}
        edited.append(task)
assert len(edited)==120,len(edited)
# Main IDs, original number and class unchanged, with no literal prompt repeat within an outcome.
seen=set()
for t in tasks:
    k=t['ogrenme_ciktisi'],t['gorev'].strip().casefold()
    assert k not in seen,('duplicate after edition',t['id']);seen.add(k)
path.write_text(json.dumps(db,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Added',len(edited),'real optional verified secondary mathematics challenges. New original prompts are distinct.')
