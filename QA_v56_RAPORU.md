# Matematik Atlası v5.6 — Resmî Kazanımlarda Pilot Kapsamı ve QA

## Durum
- **3.853 toplam görev**: 5. sınıf **955**, 6. sınıf **1262**, 7. sınıf **827**, 8. sınıf **809**.
- **110 yeni 8. sınıf görevi**, 11 kazanım × 10 varyant; **11 ayrı mekanik türü** (her kazanım bir ana etkileşim şablonu).
- 8. sınıfın **52/52 resmî kazanımı için en az bir oynanabilir pilot**, ancak içerik derinliği ve pedagoji testleri tamamlanmış anlamına **GELMEZ**.
- 7. sınıf **827 görev**; yeni 7. sınıf görevi eklenmedi, önceki 30/30 pilot korundu.
- Önceki v5.5’in **3.743 görevi, sıra, kimlik ve veri nesnesi tam eşit**. Öğrenci ilerleme anahtarı **`mathAtlas940Done`** sabit.
- `YAZILI_MERKEZI.html`, yazılı havuzu, eski LGS soru kaynakları ve v5.5 20-soruluk prova içeriği **bayt düzeyinde değişmedi**.

## Kazanımlar ve yeni oyun mekaniği
- **Eşlik-benzerlik (2 × 10):** şekil karşılaştırma, benzerlik oranı değiştirme ve ikinci dikdörtgenin canlı ölçekli görüntüsü.
- **Dönüşüm (3 × 10):** koordinat kareleri üzerinde üçgeni yön düğmeleriyle öteleme, x/y yansıması, en fazla iki adımlı birleşik dönüşüm.
- **Geometrik cisimler (6 × 10):** dik prizma (üçgen ve dikdörtgen taban), silindir açınımı, yüzey alanını yan yüz ve tabanlara ayırma, katmanlı silindir hacmi, üçgen/kare tabanlı piramit açınımı ve koninin daire + daire dilimi modeli.
- Piramit ve konide **alan-hacim formülü sorulmuyor**, MEB 2018 kazanım sınırına bağlı kalındı. Benzer çokgenlerde ileri problem rutinlerine girilmedi.
- Silindir alan ve hacim örneklerinde işlem kolaylığı için **π = 3** kullanıldı; açıkça belirtiliyor.

## Otomatik QA
- **110/110 bağımsız Python matematik tutarlılık kontrolü PASS**.
- **110/110 görev** gerçek görev-seçim, doğru görsel etkileşim, sayısal giriş ve tamamlanma akışından geçirildi.
- Sayı alanları boşken ve etkileşim yapılmadan tamamlanma: **engellendi**. Model doğru olsa bile sayı eksikken tamamlanma: **engellendi**. Genel cevap alanından atlama: **engellendi**.
- Test ilerleme deposundaki yeni tamamlanan ID: **110**.
- Mobil 390 × 844 yatay taşma: **0 px**. Masaüstü 1280 × 800 yatay taşma: **0 px**. Yakalanan JS `pageerror`: **0**.
- Önceki 5, 6, 7, 8. sınıf görevlerinden birer navigasyon testi: **PASS**. 20 soruluk LGS denemesinde doğru seçeneklerle **20/20** sonucu ve çözüm ekranına geçiş: **PASS**.
- QA ekran görüntüleri `tests/QA_v56_*` dosyalarında.

## Açık sınırlamalar
- **Bu sürüm bir pilot kalite geliştirmesidir.** Oyun sayısının artması, her öğrencinin gerçekten öğreneceğini veya LGS standardını karşıladığını tek başına göstermez. Model çeşitliliği on bir ana şablon üzerine kuruludur; her kazanımda görevler arasında sayısal, şekil ve bağlam varyasyonları kullanıldı.
- Geometrik çizimler ölçekli fiziksel açınım değildir; ekranda şematik, buton kontrollü katlanma/açılma simülasyonu vardır. Fizik motoru veya gerçek üç boyutlu nesne döndürme yok.
- Otomatik testte Chromium sayfası **belleğe yüklenmiş** ve `localStorage` izole taklit edilmiştir. `file://`, gerçek GitHub Pages, farklı cihaz, internet kesintisi, çok kullanıcılı ödev, öğretmen–tahta–telefon senkronizasyonu test edilmedi.
- Öğrencinin yazılı/sözlü gerekçesi otomatik puanlanmıyor; öğretmen değerlendirmesi gerekiyor.
- Yeni laboratuvar için açık zemin/koyu metin, seçili durum ve 44px dokunma hedefleri tasarlandı. **Eski bütün panellerde WCAG 2.2 AA kontrast taraması henüz yapılmadı**; önceki koyu tema sorunları tamamen kapatıldı denemez.
- Öğretmen paneli, öğrenci hesapları ve ödev takibi hâlâ gerçek zamanlı sunucu altyapısı olmadan ürünleştirilemez.
- **Canlı GitHub’a hiçbir değişiklik yapılmadı.**

## Resmî kaynak
- MEB 2018 ilköğretim Matematik Öğretim Programı, s. 74–76: https://mufredat.meb.gov.tr/Dosyalar/201813017165445-MATEMAT%C4%B0K%20%C3%96%C4%9ERET%C4%B0M%20PROGRAMI%202018v.pdf
