# MATEMATİK ATLASI v5.0 — Öğrenme Kalitesi

**Staging/test sürümü. Canlı GitHub’a dokunulmadı.**

## Amaç
Görev sayısını körü körüne artırmak yerine; muhakeme, modelleme, hata teşhisi, birden fazla temsil, görsel okunabilirlik ve ilk öğretmen pilotuna hazırlık.

## Yeni görevler (108)
- **6. sınıf – MAT.6.1.5:** 24 yeni görev: ondalık-kesir merdiveni (8), binde birlik hassasiyetli sayı doğrusu (8), basamak yeri hata dedektifi (8). Tam/kesir kısmı, sıfırların basamak değeri ve farklı aralıklar.
- **7. sınıf – MAT.7.4.8–10:** 24 yeni görev: merkez açı kaydıracı (8), iki eş yamukla paralelkenar alanını keşif (8), birleşik yamuk/eşkenar dörtgen alan problemleri (8). Daha önceki 7.4.7 daire alanı görevleri korunmuştur.
- **8. sınıf – MEB 2018 M.8.1.3.5–7:** 60 yeni görev: köklü ifadelerde toplama/çıkarma (20), çarpımı tam sayı yapan kök (20), ondalık karekök (20).
- Toplam **3.283** görev: 5. sınıf **955**, 6. sınıf **1.262**, 7. sınıf **763**, 8. sınıf **303**.
- 7. sınıfta **30/30 çıktıda pilot**, 8. sınıfta **15/52 kazanımda pilot**. Bu bir tam program yeterlilik belgesi değildir.

## Nitelik geliştirme
- Yeni görevler önce model kurma, sonra çözüm doğrulama basamağı ister; 9 ayrı etkileşim türü ve yanılgı geri bildirimi vardır.
- Eski 7. sınıf geometri tema meta verisi düzeltildi (yanlış kaynak, kod listesi ve öğrenme çıktısı sayısı).
- Eski `statslab` sütun grafiğinde **sabit ve canlı** grafik panelleri açık zemine alındı; yazılar koyulaştırıldı. Temel kontrast çiftleri WCAG AA düzeyine göre kodla kontrol edildi; tüm uygulamaya dair genel sertifikasyon yapılmadı.
- Mobilde sınıf seçim düğmeleri 2×2 düzenlendi. Yeni alanların odak halkası ve en az 44px dokunma alanları var.
- Mevcut görev kimlikleri **3.175/3.175 birebir korundu**; öğrenci ilerleme anahtarı `mathAtlas940Done` değişmedi. `data/tasks.json` ve `data/tasks.js` artık aynı 3.283 görevi içeriyor.

## Kullanım
- `index.html` aç: çok dosyalı (assets/ ve data/ klasörleri aynı yapıda olmalı).
- `ATLAS_TEK_DOSYA.html` aç: çevrimdışı tek dosya. Bazı tarayıcılarda file:// depolama ve çalışma sınırlamaları olabilir.
- Yeni görevleri seçmek için sınıf > tema > öğrenme çıktısı > görevler adımlarını izle.
- `tests/` altında kod, tarayıcı, ekran görüntüsü, sayısal matematik ve kontrast kayıtları bulunur.

## Bilinen sınırlar
- 108 yeni görevin tamamı kontrollü Chromium tarayıcı akışında doğru girdilerle kaydedildi; ilk boş ve kestirme doğrulama engellendi. Tüm 3.175 eski görev yeniden uçtan uca test edilmedi.
- Gerçek öğrenci/öğretmen pedagojik pilota, fizikî akıllı tahta kullanımına, cihazlar arası eş zamanlamaya ve canlı dağıtım testine henüz girilmedi.
- Yalnızca seçili kontrast çiftleri denetlendi; bütün eski ekranlarda ve her tema varyantında kapsamlı WCAG testi bekliyor.
- Bazı ekranların öğretimsel diline, problem çeşitliliğine ve gerçek sürükle-bırak mekaniğine ek geliştirme gerekiyor.
- Öğretmen telefonu, canlı sınıf ve ödev sistemi **bu sürümde gerçek zamanlı çalışmıyor**; geliştirme planında.
- Bir görevde istenen sözlü gerekçeyi yazılım tek başına ölçemez; öğretmenin değerlendirmesi gerekir.

## Müfredat kaynakları
- 6. sınıf MAT.6.1.5: https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/457
- 7. sınıf MAT.7.4.7–10: https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/468
- 8. sınıf mevcut MEB programı: `data/8_SINIF_52_RESMI_KAZANIM_HARITASI.json`
