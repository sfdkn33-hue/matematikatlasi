#!/usr/bin/env python3
"""Complete 40 inherited legacy decimal/fraction tasks without rekeying any tasks."""
from pathlib import Path
import re,json,collections
root=Path(__file__).resolve().parents[1]
p=root/'data/tasks.json'
d=json.loads(p.read_text(encoding='utf8'))
for task in d['tasks']:
    code=task['ogrenme_ciktisi'];n=int(task['gorev_no'])
    if code not in ('MAT.6.1.5','MAT.6.1.6') or n>20:continue
    if task.get('decimalLab'):raise RuntimeError('Refusing to overwrite existing interactive task')
    if code.endswith('.5'):
        m=re.search(r'(\d+),(\d{2})\s+sayıs',task['gorev'])
        assert m,(task['id'],task['gorev'])
        whole=int(m.group(1)); dec=m.group(2);tenths=int(dec[0]);hundredths=int(dec[1]);
        mode=('scanDigit' if n%4==1 else 'scanValue' if n%4==2 else 'expandSlots' if n%4==3 else 'paintHundredths')
        cfg={'mode':mode,'whole':whole,'tenths':tenths,'hundredths':hundredths,'value':f'{whole},{dec}', 'requireReason':n>=15}
        task['mekanik']={'scanDigit':'Basamak Tarayıcısı','scanValue':'Yüzde Bir Sürgüsü','expandSlots':'Ondalık Ayrıştırma Masası','paintHundredths':'Yüzlük Desen İnşası'}[mode]
        task['gorev']=({'scanDigit':f'{whole},{dec} sayısında yüzde birler rakamını bul. Basamak kartlarını inceleyerek doğru rakama dokun.',
                        'scanValue':f'{whole},{dec} sayısında yüzde birler basamağının değerini bul ve yüzde birlik sürgüsünde göster.',
                        'expandSlots':f'{whole},{dec} sayısını birler + onda birler + yüzde birler olacak şekilde üç kesir kartıyla ayrıştır.',
                        'paintHundredths':f'{whole},{dec} sayısının tam kısmını incele, kesir kısmını 100 karelik modelde onluk satırlar ve tek karelerle oluştur.'})[mode]
    else:
        m=re.search(r'(\d+)\s*/\s*(\d+)',task['gorev']);assert m,task['id']
        num,den=map(int,m.groups())
        mode=('divideSteps' if n%4==1 else 'denominatorKeys' if n%4==2 else 'decimalDigits' if n%4==3 else 'remainderTrail')
        cfg={'mode':mode,'numerator':num,'denominator':den,'requireReason':n>=15}
        task['mekanik']={'divideSteps':'Basamak Basamak Bölme','denominatorKeys':'Asal Payda Anahtarı','decimalDigits':'Ondalık Şifre Çözücü','remainderTrail':'Kalan Yolculuğu'}[mode]
        task['gorev']=({'divideSteps':f'{num}/{den} kesrini payı paydaya bölerek çöz. Bölme basamaklarını doğru işlemlerle oluştur ve sonlu/devirli kararını ver.',
                        'denominatorKeys':f'{num}/{den} kesrinin paydasını sadeleştirilmiş hâlde incele. Paydanın asal çarpan yapısıyla gösterimin sonlu/devirli olmasını ilişkilendir.',
                        'decimalDigits':f'{num}/{den} kesrinin ilk iki ondalık basamağını bölme işlemiyle bul, sonlu/devirli durumunu değerlendir.',
                        'remainderTrail':f'{num}/{den} bölmesinde kalanları adım adım izle. Kalan sıfır olursa veya bir kalan tekrarlarsa gösterim türünü belirle.'})[mode]
    task['decimalLab']=cfg
    task['kontrol_turu']='etkilesimli'
    task['beklenen_yanit_veya_rubrik']='Sayısal model ve işlem aşamaları otomatik kontrol edilir; yazılı gerekçenin içeriği öğretmen tarafından değerlendirilir.'
    task['oyuncu_eylemi']='Etkileşimli modeli oluştur; işlemini kontrol et ve gerekiyorsa gerekçelendir.'
    task['ogrenci_urun']='Etkin model, matematiksel karar ve gerektiğinde yazılı açıklama'
    task['baslik']=task['mekanik']+' · Görev '+str(n)

assert len(d['tasks'])==1650
assert len({x['id'] for x in d['tasks']})==1650
assert sum(any(t.get(k) for k in ('studio','numeric','geometryLab','fractionLab','statLab','algebraLab','probabilityLab','factorLab','expLab','decimalLab','appliedLab','researchLab','geometry6Lab','algebra6Lab','geometryMeasureLab')) for t in d['tasks'])==1650
modes=collections.Counter(t['decimalLab']['mode'] for t in d['tasks'] if t.get('decimalLab'))
d['source']+='; v2.0: Eski 40 metin görevini araca dönüştürme, yeni ders saati iddiası yok.'
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(root/'data/summary.json').write_text(json.dumps({'version':'2.0','outcomes':47,'tasks':1650,'grade5':460,'grade6':1190,'interactive':1650,'decimalLab':120,'decimalLabModes':dict(sorted(modes.items()))},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Converted 40 legacy tasks, preserved all 1650 IDs; decimal modes:',modes)
