# Matematik Atlası v6.3 — Tam Öğrenme Entegrasyonu

Önceki çalışan kaynak: v6.1. v6.2 ayrı pilotundaki 36 görev ana oyun motoruna entegre edilmiştir.

## Yeni ve değişmeyenler
- 3.885 mevcut görev nesnesi ve bütün ID'leri **aynen** korundu.
- 6, 7, 8. sınıfta üç hedef kazanıma 12'şer özgün görev eklendi; **3.921 görev**.
- 36 yeni görevde sayı ve seçim modellerinin tamamı matematiksel olarak doğrulanmadan tamamlanma mümkün değil.
- Öğrenci ilerlemesi için eski `mathAtlas940Done` anahtarı kullanılıyor. Eski görevlerin tamamlanma kayıtları etkilenmiyor.
- Öğretmen onayı istenmez; cevaplar otomatik değerlendirilir.
- Yeni ekranlarda mobil erişilebilir giriş alanları, grafikler, sayı doğrusu ve veri tabloları destekleniyor.
- Kazanım bazlı soru türü paneli, yalnızca **yeni 36 görevdeki denetlenebilir etiketleri** sayar. Var olan 3.885 görev için türlerin tümü kataloglanmış değildir.

## Dosyalar
- `index.html`: parçalı sürüm; internette yayınlamak için bu klasörün tamamı gerekir.
- `ATLAS_TEK_DOSYA.html`: internet gerektirmeyen tek dosyalık sürüm.
- `KAZANIM_TURU_DENETIMI.html`: 130 kodun içerik durumu, filtreleme ve soru türü etiketleri.
- `data/tasks.json`, `data/tasks.js`: aynı 3.921 görevli veri.
- `tests/QA_v63_BROWSER.json`: kontrollü Chromium testleri.
- `QA_v63_RAPORU.md`: test kapsamı ve sınırlar.

## Sınırlamalar
Bu sürüm 36 özgün soru örneğinin **ana uygulamaya entegrasyonudur**. 129 resmî kazanımın hepsinin tam öğrenme düzeyinde tamamlandığı, 36 ayrı oyun mekanizması üretildiği veya öğretmenin bütün öğrenci cihazlarından sonuç okuyabildiği iddia edilmez.
Canlı GitHub'a dokunulmadı. Gerçek sınıf pilotu ve resmî kazanım alt süreç bileşenlerinin madde madde kontrolü sürüyor.
