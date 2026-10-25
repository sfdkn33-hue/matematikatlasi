#!/usr/bin/env python3
"""Audit literal prompt repetitions vs underlying model repetitions separately."""
from pathlib import Path
from collections import defaultdict,Counter
import json
R=Path(__file__).resolve().parents[1]
j=json.loads((R/'data/tasks.json').read_text(encoding='utf8'));tasks=j['tasks']
orig=defaultdict(list);current=defaultdict(list);mechanics=defaultdict(list)
for t in tasks:
    oc=t['ogrenme_ciktisi'];old=t.get('onceki_yonerge',t['gorev'])
    orig[oc,old.strip().casefold()].append(t['id'])
    current[oc,t['gorev'].strip().casefold()].append(t['id'])
    lab=next(k for k in t if k.endswith('Lab') or k in ('studio','numeric'))
    mechanics[oc,lab,json.dumps(t[lab],sort_keys=True,ensure_ascii=False)].append(t['id'])
reps=lambda dic:[v for v in dic.values() if len(v)>1]
a,b,c=map(reps,(orig,current,mechanics))
bonus=[t for t in tasks if 'bonusGorev' in t]
assert len(tasks)==1650 and len(bonus)==120
assert len(a)==54 and sum(len(v)-1 for v in a)==120
assert not b
assert len(c)==77 and sum(len(v)-1 for v in c)==116
five=Counter(int(t['seviye']) for t in tasks if str(t['sinif'])=='5')
six=Counter(int(t['seviye']) for t in tasks if str(t['sinif'])=='6')
lines=['# Matematik Atlası v2.1 — Tekrar ve zorluk denetimi','',
'## Ölçülen veriler','',
'| Gösterge | Sonuç |','|---|---:|',
'| Ana görev | 1.650 |',
'| Öğrenme çıktısı | 47 |',
'| v2.0 temel yönerge tekrar grubu | 54 |',
'| v2.0 ilk örnekler hariç harfiyen tekrar eden yönerge | 120 |',
'| v2.1 ikinci, otomatik doğrulanan düşünme kartı | 120 |',
'| v2.1 tümleştirilmiş *tam metin* yönerge tekrarı | 0 |',
'| v2.1 hâlen aynen tekrarlanan ana etkileşim yapılandırması, grup | 77 |',
'| v2.1 ek tekrar eden ana etkileşim yapılandırması | 116 |','',
'**Önemli:** Tam yönerge tekrarının sıfır olması, matematiksel mekanik tekrarının sıfır olduğu anlamına GELMEZ. Üstelik 120 ek kart isteğe bağlıdır; zorunlu ana görevleri değiştirmez.','',
'## Sınıfa göre zorluk etiketleri','',
'| Sınıf | Seviye 1 | 2 | 3 | 4 | 5 | Toplam |','|---|---:|---:|---:|---:|---:|---:|']
for grade,counts in [('5',five),('6',six)]:
    lines.append(f'| {grade} | '+' | '.join(str(counts[x]) for x in range(1,6))+' | '+str(sum(counts.values()))+' |')
lines+=['','Bu etiketlerin dengesi, tek başına görevlerin gerçek bilişsel zorluk düzeyini kanıtlamaz. 6. sınıf düzeyi 5 görevler görece yoğundur; sınıf içi testte izlenmelidir.','',
'## Aynı ana mekanikle devam eden örnek gruplar','',
'| Öğrenme çıktısı | Tekrarlanan ana görevler |','|---|---|']
for vals in c[:22]:
  t=next(t for t in tasks if t['id']==vals[0])
  lines.append('| '+t['ogrenme_ciktisi']+' | '+', '.join(vals[:5])+('…' if len(vals)>5 else '')+' |')
lines+=['','## QA kapsamı ve sınırlamalar','',
'- 120/120 ek kart doğru cevap ve 120/120 yanlış cevap senaryosu tarayıcıdan geçirildi.',
'- 1.650/1.650 ana görev çalışma ekranı açılış/tür/gezinti kontrolünden geçti; bu, 1.650 matematiksel çözüm testi değildir.',
'- v2.0 ondalık çalışma motorundan 40 pozitif, 8 negatif akış regresyon testinde geçti; 13 eski atölyenin açılışı kontrol edildi.',
'- Öğretmen ekranı yedekleme/içe aktarma, CSV ve ek görev durumu, taklit edilmiş tarayıcı depolamasıyla sınandı.',
'- Gerçek GitHub Pages sunucusu, fiziksel akıllı tahta, sınıf denemesi ve tüm matematiksel kanıtların uzman değerlendirmesi halen yapılmalıdır.',
'- Öğretmen panelindeki ilerleme, yerel cihaz kaydıdır; resmî not sistemi değildir.',
'','## Sonraki doğru teknik iş','',
'116 özdeş ana görev yapılandırmasını gerçek farklı inşa/deney/hata analizi mekaniklerine çevirmek; ardından bağımsız matematiksel çözüm anahtarıyla bütün görevleri yeniden test etmek.', '']
(R/'tests/TEKRAR_VE_ZORLUK_DENETIMI_v21.md').write_text('\n'.join(lines),encoding='utf8')
print('Audit: original 120, new exact 0, remaining 116 primary same-model repetitions, 120 bonus checks')
