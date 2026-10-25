# Matematik Atlası v6.20 — 6. Sınıf Uygulamalı Problemler ve Ondalık Gösterimlerde Hedefli Destek

**Tarih:** 25 Ekim 2026 · **Kaynak:** v6.19 · **Canlı GitHub:** Değiştirilmedi.

## Değişiklikler

- Mevcut **4.037 ana görev**, görev kimlikleri, kazanım kodları, `data/tasks.json` ve `data/tasks.js` kaynakları **v6.19 ile bayt düzeyinde aynı** kaldı. Yeni ana görev eklenmedi.
- 6. sınıfta **120 uygulamalı problem görevi** (`appliedLab`) ve **48 ondalık/kesir-bölme görevi** (`decimalLab`) için toplam **168 yeni hedefli mini çalışma** eklendi. Önceki v6.17 96 + v6.18 150 + v6.19 170 = 416 hedefli görev korunarak **584 farklı ana görev** için isteğe bağlı destek tanımı oluştu.
- İki modülde toplam **20 mevcut oyun türü** kapsandı: 12 uygulamalı problem (alışveriş, tarif, eşit paylaşma, rota, bütçe, yanlış işlemi düzeltme, birim dönüşümü, cetvel, uygun birim, karşılaştırma, ölçü blokları, tahmin); 8 ondalık/kesir-bölme (uzun bölme, basamak, kalan, sonlu–devirli gösterim, sadeleştirilmiş payda ve eşleştirme).
- Matematiksel olarak **gerçekten yanlış doğrulanan cevaplar** gözlenir. Boş seçim, gerekli sayı alanının boş bırakılması ve yalnızca isteğe bağlı yazılı gerekçeye yazılması yanlış deneme üretmez. Aynı cevap durumu üst üste kontrol edildiğinde mükerrer yanlış kaydı engellenir.
- Uygulamalı problemlerde gözlenen yanıt alanına göre (işlem planı, kalan tutar, dönüştürme sayısı vb.) farklı başlangıç ipuçları sunulur. Ondalık bölümde alan ayrımı bazı oyun türlerinde kaba kalır. **Yanıt alanı kanıtı bilişsel/kavram yanılgısı teşhisi değildir.**
- İki gerçek yanlış olayından sonra öğrenciye **isteğe bağlı iki adımlı kısa çalışma** sunulur: önce model/işlem seçimi, ardından sayısal kanıt. Yanlış seçim ipucuyla yeniden denenebilir. Öğrencinin ana görevindeki yanıt alanına otomatik cevap yazılmaz.
- Öğretmen onayı yoktur. Ana görev tamamlama anahtarı `mathAtlas940Done`, geçmiş `mathAtlas64Attempts`, önceki yardımcı çalışma anahtarları ve 1/7/21 gün tekrar mekanizması korunur. Yeni mini çalışma yalnızca `mathAtlas620Practice` altında yerel saklanır; ana göreve not veya başarı yazmaz.
- Mobil görünüm için açık renk, yüksek kontrast, geniş dokunma alanları ve ekran genişliğine uyarlı kart tasarlandı.

## Kontroller ve gerçek kapsam

| Test | Sonuç |
|---|---|
| Ana görev sayısı ve eski veri dosyaları | **4.037**; iki dosya v6.19 ile bayt bayt aynı |
| Yeni hedefli görev | **120 + 48 = 168** |
| Mod türü | **20** (12+8) |
| Yeni mini çalışmaların bağımsız sayı formülü eşleştirmesi | **168/168** |
| Alan seçimi varyantlarında üç seçenek/sonuç yapısı doğrulaması | **3192/3192** (farklı matematik örneği sayısı değildir) |
| Birer gerçek UI akışı, yanlış mini seçim → doğru | **20/20** |
| Gerçek ana modülde boş alanın sahte yanlış olmaması | **2 örnek motor** |
| Değişmeden tekrar kontrol edilen yanlışın çift kaydedilmemesi | **2 örnek motor** |
| Model/işlem ile sayısal tutarın ayrı yanlış alan olarak kaydı | **Uygulamalı alışveriş örneğinde geçti** |
| İsteğe bağlı gerekçenin tek başına yanlış kaydı üretmemesi | **Bir ondalık görevde geçti** |
| Gerçek doğru ana görev → normal tamamlanma | **2 örnek motor** |
| Yardımcı etkinlik kaydı engellendiğinde | **Uyarı görüldü** |
| Tek HTML'nin yüklenmesi ve JavaScript sayfa hataları | **0 hata** |
| 320 / 390 / 768 / 1280 pikselde taşma | **Görülmedi** |
| Çok dosyalı `index.html` yerel CSS/JS bağlantıları | **121 dosya var; benzersiz** |
| Manuel öğretmen onayı | **0** |

**Test yaklaşımı:** Yerel ağ erişimi olmayan Chromium'a tek HTML enjekte edildi. Tarayıcı depolaması yalnız test koşumunda `Map` ile taklit edildi; teslim dosyalarına bu taklit eklenmedi. Her yeni mini görevin beklenen sayı değeri ayrı Python formülüyle denetlendi. 20 oyun türünden birer mini arayüz akışı oynandı. İki ana motorun yanlış/doğru akışı gerçek doğrulayıcılarla sınandı. Testler `qa_v620_results.json` içindedir.

## Bilinen eksikler ve dürüst sınırlar

1. **168 yeni mini görev, 168 ayrı oyun motoru değildir;** 20 eski modun üzerine bağlanan pedagojik kısa modellerdir.
2. **Tüm 168 ana görevün bütün olası giriş kombinasyonları oynanmadı.** Matematiksel mini hedefler programatik kontrol edildi; 20 örnek UI akışı ve iki ana motorun gerçek doğrulayıcıları sınandı.
3. Öğrencinin kavram yanılgısı kesin belirlenemez. Birden çok gün ve yeni bağlamlarda öğrenci başarısı ile doğrulanmış ölçme tasarımı gerekir.
4. 6. sınıfın **bütün oran/orantı öğrenme çıktıları** için eksiksiz hata türü analizi yapılmadı. Bu sürüm özellikle uygulamalı kesir/yüzde ve ondalık işlem modellerini kapsar.
5. Fiziksel Android cihazda, akıllı tahtada, gerçek okul ağında ve çok cihazlı kullanıcı hesaplarıyla uçtan uca sınama **yapılmadı**. `localStorage` tek cihaza özgüdür; tarayıcı verisi silinirse yedeksiz kayıt kaybolur.
6. Akıllı tahtanın telefondan kontrolü, okul/sınıf bazlı uzaktan ödev atama ve MEB ortak yazılı simülasyonu henüz tam bitirilmedi.
7. Yeni mini çalışmaların öğrenme kazanımı sağladığı yönünde gerçek öğrenci deney verisi bulunmuyor; bu sürüm kontrollü teknik ve matematik prototipidir.

## Kaynaklar

- `assets/js/applied.js`: doğrulayıcı kanıtı ve alan türü ayrımı.
- `assets/js/decimal.js`: gerçek yanlış/eksik çalışma ayrımı, yardımcı kanıt çağrısı.
- `assets/js/atlas620_targeted_coach.js`: 168 mini çalışma, iki adım doğrulama, yerel yardımcı kayıt.
- `assets/css/atlas620_targeted_coach.css`: mobil ve açık renk koç kartları.
- `ATLAS_TEK_DOSYA.html`: tam tarayıcıda çalışan bağımsız kopya.
- `index.html`: çok dosyalı kaynak dağıtımı.
- `qa_v620_results.json`: QA ölçümleri.
- `V620_MOBIL_OGRENME_KOCU.png`: Chromium mobil mini koç görüntüsü.
