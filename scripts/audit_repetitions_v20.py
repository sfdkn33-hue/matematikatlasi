from collections import defaultdict,Counter
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
tasks=json.loads((ROOT/'data/tasks.json').read_text(encoding='utf8'))['tasks']
groups=defaultdict(list)
for t in tasks:groups[(t['ogrenme_ciktisi'],t.get('onceki_yonerge',t['gorev']).strip().casefold())].append(t)
repeated=sorted([v for v in groups.values() if len(v)>1],key=lambda v:(-len(v),v[0]['ogrenme_ciktisi']))
total=sum(len(v)-1 for v in repeated)
assert len(repeated)==54 and total==120,(len(repeated),total)
lines=['# Matematik Atlası v2.0 — Yönerge tekrarı taraması','','**Denetim:** Aynı öğrenme çıktısı içinde harfiyen aynı görev yönergesi yazılmış mı?','',f'- 1.650 görev incelendi. **{len(repeated)} tekrar grubu**, ilk örnekler hariç **{total} yönerge tekrarı** bulundu.','- Aynı yönerge altında **veri/parametreler farklı olabilir**; bu tarama 120 özdeş matematiksel sorunun bulunduğu anlamına gelmez.','- Farklı yönergeler de pedagojik bakımdan tekrar içerebilir; bunun için insan incelemesi gerekir.','', '## İlk 25 örnek','', '| Öğrenme çıktısı | Tekrar sayısı | Görev kimlikleri | Yinelenen yönerge (özet) |','|---|---:|---|---|']
for v in repeated[:25]:
 s=v[0].get('onceki_yonerge',v[0]['gorev']).replace('|','\\|').replace('\n',' ')
 lines.append('| '+v[0]['ogrenme_ciktisi']+' | '+str(len(v))+' | '+', '.join(t['id'] for t in v[:4])+('…' if len(v)>4 else '')+' | '+s[:90]+('…' if len(s)>90 else '')+' |')
lines+=['','## Pedagojik düzeltme için öncelikler','', '1. Önce aynı yönergeli çoklu deney ve tablo görevlerinde değişen verileri öğrenciye açıkça göstermek ve farklı düşünme süreçleri gerektiren yeni mekanikler eklemek.','2. Geometri çizimlerinde yalnız koordinat, yarıçap ya da şekil kenarı değiştirmekle yetinmeyip karşılaştırma, hata ayıklama ve alternatif inşa süreçlerini çeşitlendirmek.','3. Aynı veriyle dönen görevleri sınıf içi oynanış testinde gözlemleyip gerçekten farklı kararlar gerektirip gerektirmediğine göre birleştirmek/yeniden yazmak.','','## Sınırlar','','Bu dosya otomatik metin benzerliği taramasıdır. Tüm 1.650 görevin pedagojik açıdan bağımsız ve hatasız olduğunu kanıtlamaz.']
(ROOT/'tests/TEKRAR_DENETIMI_v20.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
print('Repeat scan:',len(repeated),'groups /',total,'extra exact same-outcome prompts')
