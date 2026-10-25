# Matematik Atlası v3.5 — 7. Sınıf Sayılar Laboratuvarı

Başlangıç dosyası: **ATLAS_TEK_DOSYA.html**; internetsiz tek başına açılabilir. GitHub Pages için `index.html`, `assets/`, `data/` birlikte gerekir.

## Yenilik
- 7. sınıf ilk 35 saatlik Sayılar ve Nicelikler (1) bölümüne dört resmî TYMM öğrenme çıktısında 20'şer toplam 80 yeni etkileşimli görev.
- Beş farklı etkileşim: sayı doğrusu, kesir şeridi, sıralama kartları, cevap/gerekçe seçimi ve kesir/ondalık sayı girişi.
- Toplam: 2.243 görev; 7. sınıf 83 (3 eski pilot + 80 yeni), 5. sınıf 955, 6. sınıf 1.190, 8–12 toplam 15 pilot görev.
- 7. sınıf resmî programı **30 çıktı**; yalnız 4 çıktı için oyun içeriği hazır, diğer 26 gelişim haritasında **planlı**.
- Tam yol haritası: **7_SINIF_MUFREDAT_HARITASI.html** ve `data/7_sinif_TYMM_2026_2027_katalog.json`.
- Sınıf değiştirerek 8. ve 12. sınıf için önceki programa ait pilotları, 9–11 için TYMM pilotlarını görebilirsin.

## Öğrenci kayıtları ve güvenlik
- Geçmişteki tüm v3.4 görev ID'leri ve görev içerikleri korundu. Eski `mathAtlas940Done` anahtarı değişmedi.
- İlerleme yalnız bu tarayıcıdaki localStorage'da; cihaz değişikliğinde kendiliğinden senkronize edilmez.
- Canlı GitHub deposuna dokunulmadı. Test için dosyaları ayrı bir depoya veya yerel bilgisayara aç.
- Test: `tests/test_v35.py` (Python Playwright ve Chromium gerekir). Ayrıntılar `tests/QA_v35.md`.
