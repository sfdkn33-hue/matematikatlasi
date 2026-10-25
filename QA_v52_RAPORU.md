# Matematik Atlası v5.2 — QA Raporu

## Doğrulananlar
- Veri bütünlüğü: v5.1’deki 3.359 görev birebir korundu, **112 yeni görev** eklendi, toplam **3.471**.
- Görev türleri: {'sample_space': 20, 'likelihood_compare': 20, 'equal_chance': 20, 'probability_bounds': 20, 'simple_event': 20, 'line_graph': 12}.
- 112 sayısal modelin ve cevapların bağımsız hesaplama doğrulaması geçti. Aynı mekanikte birebir tekrar eden soru yönergesi yok.
- Kontrollü Chromium testinde **112/112 görev** doğru çözüm ve ilerleme kaydı oluşturdu. Kestirmeyle tamamlama, boş model, hatalı model ve öğretmen onayı üzerinden atlama testi engellendi.
- Mobil **390×844** ve masaüstü **1280×800** testinde belge yatay taşması **0**, `pageerror` **0**. Grafik kaydırıcısı klavye yön tuşuyla artırılabiliyor.
- Seçilmiş yedi renk çiftinin kontrast oranları: {'main_text': 11.78, 'input_text': 11.15, 'hint_text': 8.88, 'success_text': 7.56, 'error_text': 7.08, 'button_text': 6.23, 'chart_axis_text': 9.77}; tamamı **en az 4.5:1**.
- Eski yazılı merkezi, orijinal LGS 20 soru kaynağı ve resmî 52 kazanım haritası dosyalarının baytları değişmedi.
- Olasılık: M.8.5.1.1–M.8.5.1.5 kazanımları, önceki 2018 programı. Öğrenme kapsamı seçimi MEB kazanımlarına göre yapıldı.

## Sınırlar
- 112 görevden her birinin bireysel gerçek öğrenciyle pedagojik kalibrasyonu yapılmadı. Bazı modeller bilinçli olarak aynı mekaniğin farklı sayısal senaryolarıdır; oyun türü sayısı görev sayısına eşit değildir.
- Tam renk/klavye/ekran okuyucu WCAG taraması tüm eski panellerde yapılmadı. Yeni panel ve bir kısım eski istatistik sütunu hedeflendi.
- İzole tarayıcı ortamı `localStorage` benzetimi kullanıldı; gerçek dağıtımda çok cihazlı eşitleme yoktur.
- Matematik Atlası henüz öğretmen–öğrenci gerçek zamanlı servis, ödev raporu ya da ödeme altyapısına sahip değildir. Gerçek okul saha pilotu yapılmadı.
- Canlı GitHub değişikliği yapılmadı.

## Dosyalar
`ATLAS_TEK_DOSYA.html`, `8_SINIF_OYUN_HARITASI.html`, `data/ATLAS_v52_112_YENI_GOREV.json`, `tests/QA_v52_BROWSER.json`, `tests/QA_v52_STATIC.json`, mobil test ekranları.
