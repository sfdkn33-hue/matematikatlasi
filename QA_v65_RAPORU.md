# MATEMATİK ATLASI v6.5 — TAM ÖĞRENME KAPSAM DENETİMİ / QA

Tarih: 24 Ekim 2026 · Kaynak: v6.4 ZIP / veri tabanı

## Kapsam / değişiklik

- **3.961 görev**: 3.945 eski görev aynen korundu, 16 yeni pilot eklenmiştir. **130 kod** (129 kazanım/çıktı kodu + 1 resmî olmayan Atlas pilot kodu). Mevcut kod haritası dış kaynaktan bu turda yeniden onaylanmamıştır.
- Sınıflara göre görev: 5. sınıf **967**, 6. sınıf **1274**, 7. sınıf **871**, 8. sınıf **849**.
- Yeni 16 görev: 8. sınıf **M.8.2.2.1 (bir bilinmeyenli denklem)** +8 ve **M.8.2.2.2 (koordinat sistemi)** +8. Önceki bu iki kazanım 8'er görevdi, artık 16'şar görev; 16 yeni görevin tamamı `atlas63Pilot` otomatik denetim sistemiyle bağlandı.
- **76 etiketlenmiş pilot görev**: önceki 60 + yeni 16. Etiket sayısı **farklı oyun mekaniği sayısı değildir**; öğrenci ustalığı için de kanıt değildir.
- **130 kodun her biri** için görev sayısı, ilk örnekler, sayısal şablon tekrarları, olası soru aileleri, 5 alt beceri taslağı ve inceleme önceliği oluşturuldu.
- Uygulamaya ana sayfadan ve görev ekranından açılan **Kazanım Kalite Haritası** eklendi. Ayrıca bağımsız `KAZANIM_KALITE_HARITASI.html`, kaynak JSON, CSV ve biçimlendirilmiş Excel çıktısı var.

## Denetim sonuçları ve doğru yorum

| Sınıf | Kod | Görev | Etiketli pilot | Sayısal metin şablonu fazlası |
|---|---:|---:|---:|---:|
| 5 | 23 | 967 | 12 | 270 |
| 6 | 24 | 1274 | 12 | 643 |
| 7 | 30 | 871 | 12 | 523 |
| 8 | 53 | 849 | 40 | 407 |
| **Toplam** | **130** | **3.961** | **76** | **1843** |

- Sayılardan arındırılmış aynı görev metinleri için **1843 fazladan şablon kullanımı** görülüyor; **0 birebir metin fazlası** (aynı kazanım içinde). Bu **1843 hatalı soru** anlamına gelmez: farklı görseller/metin kalıpları veya pekiştirmenin amaçlı tekrarları olabilir.
- Öncelik sınıflaması: **81 yüksek**, **44 orta**, **5 izle**. Bu puanlar yalnız **yeniden editöryel inceleme sırası** içindir; öğrenci başarısı puanı, standartlaştırılmış kalite ölçüsü veya resmî doğrulama değildir.
- Otomatik metin taraması, örneğin bir soruda “grafik” kelimesini bulup grafik okuma içerdiğini tahmin edebilir. **Bunun gerçekten grafiği kullandırıp kullandırmadığı ancak görevi oynayarak anlaşılır.**
- Alt beceri maddeleri, MEB alt süreç bileşenlerinin birebir aktarımı değil; içeriğin eksik türlerini tartışmak için **uzman incelemesi bekleyen taslaklardır**.

## Tarayıcı QA — doğrulananlar

- İzole Chromium sayfasında **3.961 görev**, **130 kod**, **76 pilot** sorunsuz yüklendi; kimliklerin tümü benzersiz.
- Yeni 16 görevin **16/16** tanesi: boş cevap reddedildi; bilinçli yanlış fakat dolu cevap reddedildi; eski genel yanıt kutusundan geçiş engellendi; zorunlu alanların tamamı doğru olduğunda öğrenci ilerlemesi kaydedildi.
- v6.4 kaynak veri tabanındaki **3.945 eski görev nesnesi değişmeden korundu**. `mathAtlas940Done` anahtarı değişmedi; eski bir tamamlanma örneği testte korundu.
- 130 kartlı denetim ekranında açma/kapatma, 8. sınıf filtresi (**53 kod**), kazanım kodu araması, kart genişletme ve ayrı açılan HTML testi başarılı.
- Mobil **390 px** ve masaüstü **1280 px** denemelerinde test edilen denetim görünümünde yatay taşma yok; test sırasında yakalanan JS istisnası yok.
- `teacher_review_required` anahtarı kaynak görevlerde **0**; yeni görevlerde öğretmen onayı yok.
- Test kanıtı: `tests/QA_v65_BROWSER.json` ve `tests/QA_v65_AUDIT_MOBILE.png`, `tests/QA_v65_AUDIT_DESKTOP.png`.

## Sınırlamalar / sonraki kararlar

1. **130 kodun bütün resmî alt süreçlerini tamamlamadık.** Beş alt beceri maddesi, her kod için onaya hazır bir başlangıç listesi; program karşılaştırması hâlâ gerekli.
2. **3.885 önceki klasik görevin tamamında** ilk deneme/hint/öğrenme telemetrisi yok; deneme geçmişi **76 pilot** kapsamındadır. Bir görev bitirmek, tam öğrenmek değildir.
3. 16 yeni görevin soru bağlamları farklıdır ama çoğunun matematiksel cevap girişi aynı panel aracılığıyla yapılır. **16 farklı sürükle-bırak motoru iddia edilmez.**
4. Öğretmen paneli cihazlar arası sınıf verisi toplamaz; yerel browser kayıtları senkronize değildir.
5. Standalone HTML'nin gerçek dosya ortamında bütün tarayıcılarda/akıllı tahtalarda test edilmesi ve gerçek öğrenci öğrenme çıktıları incelenmesi bekleniyor.
6. Öğrencinin güvenle kullanılacağı resmî sınav altyapısı değildir; cevap anahtarları istemci tarafındadır.
7. Bu sürümde önceki 3.945 görevin **tamamı tek tek yeniden çözülmedi**; yeni 16 ve audit kullanıcı akışları test edildi.
8. **Canlı GitHub’a dokunulmadı.**

## Yayın öncesi yapılacak sıra

1. Yüksek öncelik grubundaki önce **8. sınıf doğrusal denklemler, karekökler, cebirsel ifadeler** ve **7. sınıf istatistik/olasılık** gibi yoğun tekrarlı kazanımlarda resmî süreç eşleştirmesi ve gerçek soru çözümleriyle editörlük.
2. 130 kazanımın öğrenme çıktısını uzman tarafından resmî beceri süreçlerine bölerek tabloyu güncelleme; uygun olmayan soru ailelerini zorunlu saymama.
3. Belirlenen boş soru türlerine özgün **etkileşimli** çözümler; eski ilerleme kimliklerini koruyarak entegrasyon.
4. Aynı kazanıma bağlı yeni bağlamlarda 1/7/21 gün gecikmeli değerlendirme ve gerçek sınıf pilotu.
