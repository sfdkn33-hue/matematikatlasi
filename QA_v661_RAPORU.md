# Matematik Atlası v6.6.1 — Mobil görünüm, kontrast ve navigasyon QA

**24 Ekim 2026** — v6.6 üzerine yalnızca arayüz düzeltmesi. Öğrenci görevleri, matematiksel kontrol motoru, puanlama ve kayıt kimlikleri değiştirilmedi.

## Görülen kusurlar ve düzeltmeler

1. **Koyu temadaki açık sorunun görünmez metni:** 7. sınıf Asansör Yolculuğu dahil `.card` ve `#question` için zemin ve mürekkep uyumlu hâle getirildi. Örnek ölçülen renkler: `#163954` / `#f2f8ff` (~11,24:1 kontrast).
2. **Ana sayfadaki soluk bilgi kutusu:** koyu temada `#atlasExpansionNote` artık koyu yazı/açık zemin. Örnek renkler: `#244362` / `#e9f2fd` (~9,05:1 kontrast).
3. **Sayı doğrusu ve şekil etiketlerinin silikleşmesi:** v3.4 pilotun sayısal SVG etiketleri, koyu temada açık renk çizim yüzeyine alındı, büyütüldü ve okunabilir koyu renkle çizildi. Örnek renkler: `#204b6c` / `#f7fbff` (~8,84:1).
4. **Mobil görev üst çubuğunun çakışması:** Ana sayfa ve kazanım başlığı ilk satırda; Öğrenme yolum ve Görev seç ikinci satırda. Kazanım denetimi düğmesi yalnız dar *görev ekranından* gizlendi; ana sayfada ve masaüstünde hâlâ mevcut.
5. **Sınıf seçiminin okunabilirliği:** sınıf kartları 2 sütun, seçili sınıf daha güçlü kenarlık ve koyu yazıyla; koyu tema desteği korundu.

## Gerçek uygulama Chromium testleri

- `index.html` modüllerinin aynısının gömüldüğü HTML kontrollü Chromium sayfasında çalıştırıldı.
- 8. sınıf seçildiğinde üst sınıf etiketi **8. sınıf · pilot** olarak güncellendi.
- Koyu tema ana sayfa açıklaması ölçüldü, mobil ekran görüntüsü alındı.
- 7. sınıf → Devam Et → **Asansör Yolculuğu** akışı açıldı. Soru kartı, sayı doğrusu ve navigasyon ekran görüntüsü alındı.
- Gerçek öğrenci seçiminde **5** cevabına basılınca `mathAtlas940Done` altında `ATLAS.7.TYMM-2026.PILOT-G01` tamamlandı.
- Koyu ve açık modda görünüm kontrol edildi.
- **320, 390, 768 ve 1280 px** ekran genişliklerinde yatay taşma yok. Mobil üst çubuk düğmelerinde geometrik çakışma yok.
- **Tarayıcı JavaScript hatası yok.** 4.001 görev veri kaynağı aynı, tüm önceki görev ID'leri birebir korundu.

## Sınırlar

- Görsel onarım; tüm 4.001 görevin her alt ekranına uygulanmış bağımsız kontrast denetimi değildir. Pilotlar ve başka laboratuvarlardaki sistematik WCAG denetimi ayrıca yapılmalıdır.
- Depolama tarayıcı testinde taklit edildi; Android `content://` üzerinden açılmış dosyada kayıtların kalıcılığı garanti edilemez. HTTPS dağıtım ve gerçek telefon testi yapılmadı.
- Bağlı öğretmen–öğrenci çoklu cihaz kayıt sistemi henüz yok.
- Canlı GitHub değiştirilmedi.
