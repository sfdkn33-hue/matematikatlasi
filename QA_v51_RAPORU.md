# Matematik Atlası v5.1 — Teknik, Matematik ve Görsel QA

## Geçen kontroller
- 3.283 önceki görevin **kimlikleri ve sırası korundu**. Bunlardan **60 ondalık görev içerik ve mekanik olarak yeniden yazıldı**; 3.223 eski görevin içeriği değişmedi. 76 yeni görev ile 3.359 görev.
- Yeni ve yenilenen 136 modelin sayısal beklenen sonuçları ayrı Python denetiminden geçti.
- Kontrollü mobil Chromium tarayıcısında **136/136 görev gerçek seçme, çözme, doğrulama ve kayıt akışında geçti**. 60 ondalık, 16 sürüklenebilir geometri, 20 sayı sınıflandırma, 20 grup grafiği, 20 grafik dönüşümü.
- Yanıtsız model, doğrudan genel kontrol ve öğretmen onayı düğmesiyle etkileşimli görevi geçme denemesi kayıt oluşturmadı.
- Fareyle hedef alana sürüklenen eş geometrik parça yerleşti. Tuşla/dokunarak yerleştirme alternatifi de tüm 16 görevde çalıştı.
- Mobil 390×844 ve masaüstü 1280×800: yatay taşma **0**; JavaScript pageerror **0**.
- Seçilmiş altı yazı/zemin çiftinin kontrastı **en az 4,5:1**; uygulamanın tamamı WCAG denetiminden geçirilmiş değildir.
- v5.0 yazılı merkezi, LGS pilot verisi ve resmî kazanım haritası dosyalarında byte değişikliği yok. Öğrenci ilerlemesi `mathAtlas940Done` anahtarını kullanmaya devam ediyor.

## Sınırlar ve öğretmen pilotu gereksinimi
- Etkinlikler kontrol edilmiş olsa da pedagojik yeterlilik ve zorluk dengesi öğretmen-öğrenci saha gözlemiyle test edilmedi.
- Grafik dönüşümünde bu etap yalnız **sütun → daire**; çizgi grafiğine dönüşüm sonraki sürümdedir.
- 8. sınıf **18/52 kazanımda oynanabilir pilot** içerik var, 34 kazanım henüz tamamlanmadı. 7. sınıf 30/30 çıktı için başlangıç kapsamı olsa da tam pedagojik kapsama eşdeğer değil.
- Eski tüm ekranlarda WCAG 2.2 AA/AAA ve klavye/ekran okuyucu tam denetimi yapılmadı. Önceki grafiğin okunurluk CSS'i korundu ve ek açık tema güçlendirmesi yapıldı.
- Gerçek GitHub Pages dağıtımı, birbirinden bağımsız öğrenci cihazları, akıllı tahta–telefon senkronizasyonu ve öğretmen ödev paneli henüz gerçek kullanım testinden geçmedi. **Canlı GitHub'a dokunulmadı.**
- Test tarayıcı izolasyonunda `localStorage` taklidi kullanıldı; gerçek dağıtım alanındaki saklama izinleri ayrıca sınanmalı.

## Kayıtlar
`tests/QA_v51_STATIC.json`, `tests/QA_v51_BROWSER.json`, `tests/QA_v51_DECIMAL_MOBILE.png`, `tests/QA_v51_DRAG_MOBILE.png`, `tests/QA_v51_CHART_MOBILE.png`, `tests/QA_v51_PIE_MOBILE.png`.
