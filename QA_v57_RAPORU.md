# Matematik Atlası v5.7 — Kalite, 7. Sınıf Muhakeme ve LGS QA

## Sonuç
- 7. sınıfa **32 yeni görev**: {'graph': 8, 'ratio': 8, 'complement': 8, 'equation': 8} (8'er görev). Genel toplam **3.885**.
- Sınıflar: 5: 955, 6: 1262, 7: 859, 8: 809.
- Eski **3.853 görev nesnesi aynı sırayla ve içerikle** korundu (JSON nesne eşitliği). Eski 3.853 ID korundu; eski tamamlanma kayıt anahtarı `mathAtlas940Done` değişmedi.
- **20 soruluk eski LGS beceri provası aynen korundu**; yanında özgün 8 soruluk ek yoğun muhakeme modu açıldı. İki modu kullanıcı sınav öncesi seçebiliyor.
- Yazılı Merkezi ZIP paketinde bağımsız HTML dosyasıdır; v5.7 tek HTML içerisinde çevrimdışı iframe/srcdoc olarak da açılır.
- **Öğretmen onayı eklenmedi.** Yanlış/boş görev modelleri ilerleme vermiyor; doğru model otomatik kayıt veriyor.

## İzole Chromium kontrolleri (390×844)
- Tek HTML kontrollü Chromium sayfasına `set_content()` ile yüklendi; test ortamında `localStorage` bellek içi taklitle sağlandı.
- 32/32 yeni görev için seçme, doğru sayısal girdiler, doğru karar ve tamamlanma anahtarı kaydı: PASS.
- Her dört mekanikten birer görevde boş modelin reddedilmesi: PASS.
- 8/8 yoğun muhakeme sorusunda seçim → 8/8 sonuç → çözümü açma: PASS.
- Eski standart 20 soruluk moda geri geçiş (1/20): PASS.
- Yeni grafik ekranı için gerçek 390px genişlik ve yatay taşma yok: PASS.
- JavaScript `pageerror`: 0.
- Modüler JS dosyaları Node `--check`: PASS. Görev JSON ve LGS şemaları: PASS.
- Matematiksel model formülleri ve sekiz yeni LGS cevabı bağımsız hesapla kontrol edildi; sekiz LGS çözümü pilot editörlük açısından okunabilir fakat gerçek sınav eşdeğerliği ölçülmedi.

## Görsel kalite
- Yeni ekranlarda açık zemin, koyu metin, basamak ve kart etiketleri, 44px+ dokunma alanları; grafik dikey eksen başlangıcı görünür biçimde gösteriliyor.
- Önceki `.statslab` sütun yazı/zemin karşıtlığı için yeni stil düzeltmesi eklendi.
- Ekran görüntüleri `QA_v57_7_SINIF_GRAFIK.png`, `QA_v57_LGS_MOBIL.png`.

## Sınırlar
- **Bütün eski 3.853 görevin** uçtan uca tarayıcı testi yapılmadı; mevcut nesneler aynı korundu.
- Yerel dosya ve yerel HTTP navigasyonu kurum tarayıcısında engellendi: **gerçek GitHub Pages, fiziksel akıllı tahta, çoklu öğrenci/öğretmen, sunucu eşitlemesi ve çevrimdışı/senkron geçiş testi yapılmadı.**
- 7. sınıftaki 859 görevin tamamı birebir pedagojik yeniden yazımdan geçirilmedi; 32 farklı yeni görev eklendi. Diğer eski ekranların tam WCAG 2.2 erişilebilirlik testi tamamlanmadı.
- 8 soruluk zorlayıcı ek tur, MEB soru kitapçığı değildir ve güçlük değeri sınıf verisiyle kalibre edilmedi. Her soru ayrıntılı çözüm içerir ancak LGS ile eşdeğerliği iddia edilmez.
- 7. sınıf soru etkinlikleri için öğretmen/öğrenci sahada pilotu yoktur.

## Resmî referans
- MEB TYMM 7. sınıf istatistiksel araştırma süreci: https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/470
- MEB'in 2026 LGS örnek soru duyurusu: https://gaziantep.meb.gov.tr/www/meb-olcme-degerlendirme-ve-sinav-hizmetleri-genel-mudurlugu-tarafindan-lgs-2026-kapsaminda-merkezi-sinava-yonelik-hazirlanan-ilk-ornek-soru-kitapciklari-mebi039de-yayimlandi/icerik/6743
- Canlı GitHub deposuna dokunulmadı.
