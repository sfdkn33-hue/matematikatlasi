# Matematik Atlası v6.18 — Bağımsız Sürüm ve Kalite Raporu

**Tarih:** 25 Ekim 2026 · **Kaynak:** v6.17 · **Ortam:** yerel test / staging; canlı GitHub güncellenmedi.

## Geliştirmeler

- 4.037 görev, görev kimlikleri, `data/tasks.json` ve `data/tasks.js` v6.17 ile **bayt düzeyinde aynı**. Eski öğrenci ilerleme anahtarı `mathAtlas940Done` değiştirilmedi.
- 5. sınıf kesir laboratuvarındaki **150 görev / 15 eski oyun türüne** isteğe bağlı hedefli kısa çalışma eklendi. Eski v6.17'de bulunan 96 destekli ana görev silinmedi: toplam **246 ayrı görev** bu iki katmanda isteğe bağlı mini destek kapsamındadır. Bu sayı **246 ayrı oyun motoru** demek değildir.
- Öğrenci henüz modelin bütün alanlarını doldurmamışsa, kontrol düğmesine basmak **yanlış matematik denemesi olarak kayıtlanmaz**. Bütün alanlar dolu ve kontrol başarısızsa, doğrulayıcının tespit ettiği ilk **yanlış cevap alanı** izlenir.
- Alan indeksi `mathAtlas64Attempts` geçmişine mevcut `module-validator` kanıtıyla, `wrongFields` ve kaba `focus` sınıfıyla yazılır. Örneğin **model boyama** ile **denk kesir seçimi** farklı alanlardır. Bu bir *kavram yanılgısı tanısı* değildir.
- İki gözlenen yanlış matematik denemesinden sonra açılabilen isteğe bağlı küçük atölye, **model/işlem tercihi + sayısal kanıt** adımlarını ayrı ayrı doğrular. Bazı modlarda son yanlış alan farklı mini çalışma üretir.
- Mini çalışma tamamlandığında `mathAtlas618Practice` cihaz içi anahtarına sınırlı veri yazılır, ana görevin doğru çözüm kaydı oluşturulmaz. Başarısız kayıtta açık uyarı çıkar.
- Arayüz yüksek kontrastlı açık temalı, büyük butonlu ve 320 px'e kadar test edilmiş mobil düzen kullanır.

## Test sonuçları

| Test | Sonuç |
|---|---|
| Görev sayısı, görev veri dosyaları ve ID'lerin korunması | **4.037, bayt bayt aynı** |
| Yeni kesir desteği kapsamı | **150 görev; 15 oyun türü** |
| Temel mini problem matematiksel sonuçlarını bağımsız formüllerle karşılaştırma | **150/150 geçti** |
| Ana görevlerin 2 alanı için varyant oluşturma: üç farklı seçenek, gerçek doğru seçenek ve geçerli sayı | **300/300 geçti** |
| Her oyun türünden gerçek mini-UI akışı: yanlış model tercihi → düzeltme → sayısal doğrulama | **15/15 geçti** |
| Tamamlanmamış ana göreve kontrol basınca sahte yanlış kaydının önlenmesi | **Geçti** |
| Önceki modellere ait yanlış kaydında `wrongFields`/`focus` bilgisinin saklanması | **Geçti** |
| Farklı yanlış alanın farklı mini etkinlik açması: boyama ve denk kesir | **Geçti** |
| Görev ekranına yeniden girildiğinde son yanlış alanın geri çağrılması | **Geçti** |
| Mini çalışma başarıyla bittiğinde ana görev tamamlanmasının oluşmaması | **15/15 geçti** |
| Tarayıcı depolama yazımı reddettiğinde açık uyarı | **Geçti** |
| 320, 390, 768, 1280 px ekranlarda yatay taşma | **Görülmedi** |
| Tarayıcı JavaScript çalışma hatası | **0** |
| Değişen JavaScript dosyalarında sözdizimi | **Geçti** |
| Çok dosyalı girişin yerel kaynak bağlantıları | **127 referans, eksik 0** |
| `teacher_review_required` gerektiren görev | **0** |

**Test yöntemi:** Yönetimsel ağ navigasyonu engelli olduğundan, tek HTML Chromium içerik yerleştirmesiyle çalıştırıldı; `localStorage` **yalnız test oturumunda** taklit edildi. Öğrencinin yazdığı ve işaretlediği cevaplar, görsel kontrollerin tıklanması ve doğrulama düğmesi üzerinden test edildi. Test edilen alanlar, gerçek cihaz ve gerçek okul testi yerine geçmez. 150 ana görevin tamamı baştan sona elle çözülmedi; 150 mini matematik sonucu programatik olarak kontrol edildi, 15 oyun türünde birer mini çalışma ekran akışı oynandı. Eski 4.037 ana sorunun tümünün yeniden matematik doğruluk denetimi yapılmadı.

## Bilinen sınırlar

1. 15 oyun türündeki pekiştirmelerin tamamı birbiriyle farklı motor değildir; birçok varyant sayısal parametrelerle oluşturulur. Yalnız gözlenen alanı ve aritmetik eşitliği ayırt eder.
2. Bazı görevlerde alt alan farklı çalışmaya götürürken bazıları aynı konunun genel mini modeline yönlendirir. Her alt beceri henüz ayrı tanısal çalışma değildir.
3. Yeni çalışma hatalarını kullanıcı tercihlerinden çıkarılan *kesin kavram yanılgısı* veya *öğrenme/ustalık belgesi* olarak yorumlamamak gerekir.
4. Cihazlar arası hesap/eşitleme, öğretmenin telefonundan akıllı tahtayı kontrol, sınıf bazlı ödev dağıtımı ve gerçek MEB yazılı simülasyonunun tam sürümü bu paketin konusu değildir.
5. Fiziksel Android telefon ve akıllı tahta; tarayıcılar arasında kalıcı depolama; gerçek öğrenci ve öğretmen saha denemeleri tamamlanmamıştır.
6. Öğrenci ilerleme kayıtları kullanıcının cihaz/tarayıcı koşullarına bağlıdır. Aynı cihazda tarayıcı verileri silinirse, ayrıca bir yedek alınmadıkça geçmiş kaybolabilir.

## Dosyalar

- `assets/js/fraction5plus.js` ve `assets/js/atlas616_module_trace.js`
- `assets/js/atlas618_fraction_coach.js`
- `assets/css/atlas618_fraction_coach.css`
- `index.html`, `ATLAS_TEK_DOSYA.html`
- `qa_v618_results.json`, `V618_MOBIL_KESIR_KOCU.png`
