# Matematik Atlası v3.4 — 5–12. sınıf genişleme (pilot)

## Açmak için
- Çevrimdışı tek dosya: **ATLAS_TEK_DOSYA.html**
- Tam kaynak/GitHub Pages: **index.html**, `assets/`, `data/` klasörleriyle birlikte
- 7–12 sınıflarından birini seçerek her sınıfta üç pilot matematik görevini oynayabilirsin.

**Önemli:** 5–6. sınıfların eski 2.145 görevi korunmuştur. 7–12 sınıfları henüz tam paket değildir.

### Nasıl ilerleyeceğiz?
1. 7. sınıf TYMM resmî öğrenme çıktıları ve temalar üzerinden tam kurgu.
2. 8. sınıf mevcut öğretim programı: LGS uygulama, problem çözme, akıl yürütme.
3. 9–10–11 TYMM: giderek büyüyen cebir, geometrik keşif, fonksiyon, istatistik ve kanıt atölyeleri.
4. 12. sınıf 2018 programı: üstel-logaritmik fonksiyonlardan türev ve integrale, YKS düzeyine kadar.
5. 8 ve 12 TYMM geçişinde yeni müfredat sürümüne geç; eski ID'leri ve geçmiş tamamlamaları silme.

### Tasarım ve kayıt kuralları
- Veriler: `data/tasks.json` → `data/tasks.js` üretimi, aynı veri `ATLAS_TEK_DOSYA.html` içine gömülü.
- Müfredat kataloğu: `data/curriculum_catalog_2026_2027.json`.
- İlerleme kayıt anahtarı: **mathAtlas940Done**. Eski 5/6 kimlikleri birebir aynı.
- Resmî olmayan 8/12 pilot referansları `ATLAS.8.2018...` ve `ATLAS.12.2018...`, gerçek MEB kodu değildir.
- Canlı GitHub'a hiç dokunulmadı; test deposuna yüklemek için ZIP'i açıp içindeki tam proje dosyalarını kullan.

Test kanıtları için `tests/QA_v34.md` belgesine bak.
