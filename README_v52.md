# MATEMATİK ATLASI v5.2 — Olasılık, çizgi grafiği ve okunabilirlik

**Staging sürümü. Canlı GitHub deposu değiştirilmedi.**

## İçerik
- Toplam **3.471 görev** (5: 955, 6: 1.262, 7: 779, 8: 475).
- Eski **3.359 görevin tamamı**, kimlikleri, sırası ve içerikleriyle birebir korundu.
- 8. sınıfa **112 yeni görev**: 5 olasılık kazanımı × 20 = **100**; ayrıca çizgi grafiği dönüşümü **12**.
- 8. sınıfta oyun pilotu olan kazanım sayısı **23/52**. Kalan **29** kazanım bekliyor.
- Olasılık laboratuvarında: olası durum, şans karşılaştırma, eş dilimli çark, 0–1 aralığı, basit olay olasılığı. Grafik laboratuvarında dört haftalık nokta/kaydırıcı çizimi.
- Yeni sorular özgün yazılmıştır, MEB sorularından kopya değildir. 8. sınıfta MEB 2018 kazanımları kullanılmıştır.

## Çalıştırma
- `ATLAS_TEK_DOSYA.html` çevrimdışı tek dosyalık sürümdür; aynı dosyanın kısa kopyası ZIP dışındaki `MATEMATIK_ATLASI_v5_2_TEK_DOSYA.html`.
- `index.html` ve `assets/` altında modüler sürüm için klasörleri bir arada koruyun.
- Öğrenci ilerlemesi önceki `mathAtlas940Done` anahtarıyla tutulur; aynı tarayıcı/profilde korunmalıdır. Farklı cihazlar arasında eşitlenmez.
- Kod üzerinde dağıtım, sunucu eşlemesi ve canlı GitHub değişikliği yapılmadı.

## Denetim
- 112 görev için model cevabı doğrulama, reddetme kestirmeleri ve mobil/masaüstü kontrollü Chromium testi başarılı. Ayrıntı: `QA_v52_RAPORU.md` ve `tests/QA_v52_*`.
- Renk karşıtlığı düzeltmeleri yeni panelde ve istatistik sütunlarının belirli eski stillerinde uygulanmıştır; **tüm uygulama için tam WCAG denetimi yapılmadı**.
- Çarkta tek dilim olasılığı, basit olay ve olasılık aralığı 8. sınıf kazanım sınırını aşmaz; birleşik/bağımlı olay olasılığı işlenmedi.
- Öğretmen paneli, akıllı tahta–telefon eşitleme ve çoklu öğrenci ödev modülü ayrı mimari geliştirme gerektiriyor.
