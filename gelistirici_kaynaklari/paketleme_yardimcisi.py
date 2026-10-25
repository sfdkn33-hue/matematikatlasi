from pathlib import Path
import json,re,hashlib,collections,zipfile
root=Path('/mnt/data/MATEMATIK_ATLASI_v4_3_ORTAOKUL')
prev=Path('/mnt/data/MATEMATIK_ATLASI_v4_2_ORTAOKUL')
markup=Path('/mnt/data/atlas_exam_markup.html').read_text(encoding='utf8')
css=Path('/mnt/data/atlas_exam_style.css').read_text(encoding='utf8')
js=Path('/mnt/data/atlas_exam_logic.js').read_text(encoding='utf8')
bank=json.loads((root/'data/yazili_havuzu_v43.json').read_text(encoding='utf8'))
# fix prior provisional invalid 8th grade wording
for q in bank['questions']:
 if q['grade']==8 and 'doğrusunun x eksenini' in q['question'] and 'y=' not in q['question']:
  
  import re
  m=re.search(r'(\d+)x\+6=(\d+)',q['question'])
  if m: q['question']=f'y={m.group(1)}x+6 doğrusunun x eksenini kestiği noktanın x koordinatı kaçtır? y=0 yazarak göster.'
 # correct unsimplified `0/number` cases omitted for now
(root/'data/yazili_havuzu_v43.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2),encoding='utf8')
q=bank['questions'];assert len(q)==672
names=[x['id'] for x in q];assert len(names)==len(set(names))
embedded=json.dumps(bank,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
inner=f'<style>{css}</style>'+markup+'<script id="examData" type="application/json">'+embedded+'</script>'+'<script>'+js+'</script>'
page='<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Matematik Atlası · Yazılı Sınav Merkezi v4.3</title></head><body style="margin:0">'+inner+'</body></html>'
(root/'YAZILI_MERKEZI.html').write_text(page,encoding='utf8')
modular=(prev/'index.html').read_text(encoding='utf8')
modular=modular.replace('Matematik Atlası v4.2 · Ortaokul','Matematik Atlası v4.3 · Ortaokul')
modular=modular.replace('<div class="atlas-adult-tools"><span>Öğretmenler için</span>','<div class="atlas-adult-tools"><span>Öğretmenler için</span><a href="YAZILI_MERKEZI.html" style="font-weight:800">📝 Yazılı Sınav Merkezi · Word/PDF</a>')
modular=modular.replace('v4.2 · Cebir Laboratuvarı','v4.3 · Yazılı Sınav Merkezi')
(root/'index.html').write_text(modular,encoding='utf8')
standalone=(prev/'ATLAS_TEK_DOSYA.html').read_text(encoding='utf8')
standalone=standalone.replace('Matematik Atlası v4.2 · Ortaokul','Matematik Atlası v4.3 · Ortaokul')
standalone=standalone.replace('<div class="atlas-adult-tools"><span>Öğretmenler için</span>','<div class="atlas-adult-tools"><span>Öğretmenler için</span><button type="button" id="atlasOpenExam" style="font-weight:850;background:#e1f7ea;color:#165846;padding:10px">📝 Yazılı Sınav Merkezi · Word/PDF</button>')
standalone=standalone.replace('v4.2 · Cebir Laboratuvarı','v4.3 · Yazılı Sınav Merkezi')
overlay='<div id="atlasExamOverlay" hidden>'+inner+'</div><script>document.getElementById("atlasOpenExam").addEventListener("click",()=>{document.getElementById("atlasExamOverlay").hidden=false;document.getElementById("atlasExamOverlay").scrollTop=0;});</script>'
assert '</body>' in standalone
standalone=standalone.replace('</body>',overlay+'</body>')
(root/'ATLAS_TEK_DOSYA.html').write_text(standalone,encoding='utf8')
(root/'README_v43.md').write_text('''# Matematik Atlası v4.3 — Yazılı Sınav Merkezi (TEST)

## Gerçekleştirilen
- 5–8. sınıf seçimi, özgün açık uçlu soru bankası; sınıf/kazanım/zorluk/metin arama.
- **672 özgün/parametrik yazılı pilot soru varyantı**: kolay 212, orta 262, zor 198; 44 farklı kazanım/çıktı etiketi. 5–8. sınıflarda sınıf başına 168 soru.
- Soru ekle/çıkar/sırala, soru puanı değiştirme ve toplamı 100 puana dağıtma.
- Sınıf, dönem, süre, okul adı ve başlık alanları; 3/5/2 gibi güçlük dağılımıyla otomatik sınav oluşturma.
- Sınav ve cevap anahtarını **gerçek .docx Word dosyası** veya **gerçek çok sayfalı .pdf** olarak indirme. PDF görüntü tabanlıdır; Word metni düzenlenebilirdir.
- Süreli sınav simülasyonu, serbest yanıt ve tarayıcıda yerel taslak kaydı; süre dolunca yanıt kilitleme, çözüm ve rubrik gösterme.
- Daha büyük banka için yapısı doğrulanan JSON dosyasını kullanıcı tarayıcı oturumuna aktarma. İçe aktarılan sorular kalıcı sunucu havuzuna yazılmaz.
- Atlas ana sayfasından giriş. **Tek dosyalık HTML'de Yazılı Merkezi içeride ve çevrimdışı çalışır.** Ayrı `YAZILI_MERKEZI.html` de çevrimdışıdır.

## Önemli sınırlar ve açıklık
- **Henüz her kazanımda onlarca soru yoktur**; mevcut 44 kazanım etiketi değişen sayıda soruyla temsil edilir. Çok az sorusu olan çıktılar sonraki aşamada önceliklendirilmeli.
- MEB'in kapalı soru havuzuna erişim, MEB OYSS eşdeğerliği veya 2026–27 zümre senaryolarıyla otomatik resmî uyum iddiası yoktur. Kazanım/kod eşleştirmelerinin bir bölümü önceki uygulamanın taslak metaverisinden devralınmıştır.
- Açık uçlu çözümün bütün işlem basamaklarını tarayıcı güvenle otomatik notlayamaz. Cevap anahtarı ve aşamalı rubrik öğretmen kontrolü içindir.
- Otomatik zorluk etiketleri pilot/taslak düzeydedir; sınıf içinde ölçülmüş güçlük indeksi değildir.
- PDF tarayıcı içinde resim temelli A4 oluşturulur, metin seçilemez. Word dosyası düzenlenebilirdir.
- Öğrenci taslakları sadece mevcut tarayıcıda kalır; merkezi sunucu/e-Okul bağlantısı yoktur.
- Öğrenme çıktısı seçimi resmî dönem senaryosunu kendi kendine belirlemez. Öğretmen uygun senaryonun konu-soru tablosunu esas almalıdır.
- Önceki 2.807 oyun görevi ve kayıt saklama anahtarı değiştirilmedi. Canlı GitHub değişmedi.

## Sonraki içerik geliştirme işleri
1. Tüm 5–7. sınıf çıktılarında **çıktı başına kolay/orta/zor seviyelerinde ayrı ayrı en az 10 özgün soru** hedefi (toplam en az 30/kazanım).
2. 8. sınıfın 2018 programı tüm resmî kazanımlarının birer birer eşlenmesi, kazanım alt etiketi yerine resmî kodla denetlenmesi.
3. 2026–27 1. ve 2. dönem resmî konu-soru dağılım senaryolarının öğretmence eşleştirilmesi.
4. Matematiksel hata avı, öğretmen puanlama rubriği, kısmi puan, gerçek öğrenci pilotu, ekran okuyucu testi.

Kaynaklar:
- https://www.meb.gov.tr/ortak-yazili-sinav-sistemi-uygulama-kilavuzu-yayimlandi//haber/42228/tr
- https://odsgm.meb.gov.tr/www/birinci-donem-ortak-yazili-sinavlarinin-konu-soru-dagilim-tablolari-yayimlandi/icerik/1731/
''',encoding='utf8')
(root/'README.md').write_text('Matematik Atlası v4.3 — Ortaokul\n\nOyunun tek dosyası: ATLAS_TEK_DOSYA.html\nYazılı Sınav Merkezi: YAZILI_MERKEZI.html\nSoru bankası: data/yazili_havuzu_v43.json\nGeliştirme notları: README_v43.md\n',encoding='utf8')
(root/'GITHUB_YUKLEME_REHBERI.md').write_text('# Yayın notu\nBu paket TEST içindir. Canlı GitHub deposuna dokunulmadı.\n',encoding='utf8')
# Preserve tasks immutable
x=(prev/'data/tasks.json').read_bytes();y=(root/'data/tasks.json').read_bytes();assert hashlib.sha256(x).digest()==hashlib.sha256(y).digest();assert len(json.loads(y)['tasks'])==2807
print('HTML written bank=',len(q),'file sizes',len(page),len(standalone),'task sha256',hashlib.sha256(y).hexdigest()[:14]);print('counts:',collections.Counter(x['difficulty'] for x in q))
