# Matematik Atlası v6.1 — Anlamlı Çeşitlilik ve Kontrast Onarımı

**Başlangıç:** v6.0. **Dağıtım:** Staging paketi; canlı GitHub'a yüklenmedi.

## Değişiklikler

- **3.885 görev aynı kimlik ve sırada**, 3.810 görev nesnesi v6.0 ile birebir aynı.
- **75 mevcut ana görev yeniden tasarlandı**, yeni görev sayısı artırılmadı: 7. sınıfta 30; 8. sınıfta 45.
- Beş öğrenme çıktısına, her birinde üç farklı etkileşim olmak üzere **15 alt mekanik** getirildi. Her alt mekanikte beş ayrı durum/sayı modeli var.
- 7. sınıf veri analizi: sıfırdan başlamayan eksen, yüzde iddiası değerlendirme, yanlış farkın denetimi.
- 7. sınıf orantı: iki satırlı oran tablosu, birim fiyat seçimi, hatalı orantıyı düzeltme.
- 8. sınıf veri analizi: daire merkez açısı, grup yüzdesi, sütun karşılaştırma.
- 8. sınıf cebir: dört hücreli dağıtma tablosu, işaret hatası avı, cebirsel alan katsayıları.
- 8. sınıf olasılık: kesir modeli, en az bilye ekleyerek eş şans oluşturma, tümleyen olay.
- Ekranlar açık yüzey–koyu metin, yüksek görünürlüklü seçenekler, mobil uyumlu girişler ve erişilebilir seçim göstergeleri kullanıyor. Eski sütun grafiği renkleri için hedefli iyileştirme var.
- Yeni görevlerde eski metin kutusundan veya öğretmen onayıyla ilerleme yok. Doğru cevaplar otomatik kaydediliyor, yanlışlar reddediliyor.

## Klasör yapısı
- `index.html`: çok dosyalı kaynak giriş sayfası.
- `ATLAS_TEK_DOSYA.html`: çevrimdışı tek dosya derlemesi.
- `data/tasks.json` ve `data/tasks.js`: aynı 3.885 görev veri kümesi.
- `assets/js/atlas61_lab.js`: yeni 75 görevin ana kontrol ve etkileşimleri.
- `assets/css/atlas61_style.css`: yeni grafik, kart, seçim ve kontrast stilleri.
- `data/ATLAS_v61_75_YENIDEN_TASARLANAN.json`: değiştirilen 75 görevin listesi.
- `tests/`: tarayıcı çıktıları ve ekran görüntüleri.

## Bilinen sınırlamalar
1. Tüm 3.885 görevin baştan sona yeniden oynanması bu sürümde yapılmadı.
2. 7–8. sınıfta yoğun tekrarlı sayısal şablonlar tamamen sona ermedi.
3. Öğretmen–öğrenci cihazlar arası senkronizasyon, ödev atama, akıllı tahta uzaktan kumanda henüz çalışır özellikler değil.
4. İzole Chromium bellek içi testte `localStorage` taklidi kullanıldı. Gerçek GitHub Pages, Safari ve kesintili bağlantı test edilmedi.
5. MEB kazanımlarına göre pedagojik saha doğrulaması ve LGS güçlük kalibrasyonu yapılmadı.

**Not:** Görevleri tamamlayan öğrencilerin kayıt anahtarı `mathAtlas940Done` değişmedi. Yeniden yazılan görevlerin eski içerik metaverisi `atlas61_legacy` içinde tutuluyor; ileride sürüm karşılaştırması yapılabilir.
