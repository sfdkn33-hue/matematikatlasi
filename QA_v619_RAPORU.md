# Matematik Atlası v6.19 — 6. sınıf Geometride Hedefli Öğrenme

**Tarih:** 25 Ekim 2026 · **Kaynak sürüm:** v6.18 · **Durum:** Yerel QA paketine hazır · **Canlı GitHub:** Değiştirilmedi.

## Ne değişti?

- Önceki **4.037** ana görev ve benzersiz görev kimliği korundu. `data/tasks.json` ve `data/tasks.js` dosyaları v6.18 ile **bayt bayt aynı**. Eski `mathAtlas940Done`, `mathAtlas64Attempts`, `mathAtlas617Practice` ve `mathAtlas618Practice` anahtarları değiştirilmedi.
- 6. sınıf **Geometrik Şekiller** modülündeki **170 görevde, 17 mevcut oyun türünün** her biri için isteğe bağlı geometrik iki adımlı mini çalışma eklendi: önce model/özellik seçimi, sonra sayısal gerekçe. Bu **170 yeni ana görev** veya **17 yeni oyun motoru** değildir.
- Oyun türleri arasında paralel doğrularda yöndeş/iç ters/dış ters açılar, yamuk–paralelkenar–dikdörtgen–eşkenar dörtgen–kare özellikleri, dörtgen ve üçgen açıları, köşegenlerin eşitliği/dikliği/ortalanması, paralelkenarda bütünler açılar, eşkenar dörtgende açıortay bulunur.
- **Gerçek yanlış doğrulamasında**, görev türünün izin verdiği ölçüde yanlışın görüldüğü matematiksel alan (`fieldKey`) mevcut hata olayına ekleniyor. Örneğin iki paralel doğruda açı ölçüsü yanlışsa `angle`, eş açı doğru ama ilişki yanlışsa `relation` kaydedilir. Köşegen inşasında uzunluk/diklik uyuşmazlıkları ayrılabilir. **Bu, öğrencinin zihnindeki kavram yanılgısının kesin teşhisi değildir.**
- Hiçbir matematiksel alana dokunulmayan model veya gerekli sayısal/seçim alanı boşken `✓ Modeli doğrula` düğmesi yanlış cevap üretmez. İsteğe bağlı gerekçe metnine yazmak tek başına matematiksel deneme sayılmaz.
- Aynı görevde kayıtlı **iki gerçek yanlış matematik kontrolünden sonra** mini çalışma görünür. Hatalı seçim ve sayı yeniden denenebilir, ipucu ayrıca sunulur. İki adım doğru olsa bile **ana görev tamamlanmaz**. Öğrenci ana oyuna dönüp kendi cevabını doğrulamalıdır.
- Yardımcı çalışma verisi yalnız cihazda `mathAtlas619Practice` anahtarında, en çok 500 kayıtla tutulur; kaydetme başarısız olursa yanlış başarı mesajı gösterilmez. Kayıt ana görev ilerlemesini, resmî notları veya 1/7/21 gün tekrar başarısını etkilemez. Öğretmen onayı yoktur.
- v6.17'nin **96**, v6.18'in **150** hedefli görevine ek, farklı **170** görev desteklendi: bu üç ayrı çalışma katmanında toplam **416** farklı ana görev için isteğe bağlı pekiştirme tanımı vardır.
- Önceki v6.18 çok dosyalı `index.html` içindeki yinelenen iki CSS/JS referansı bu paket içinde temizlendi.

## Test kanıtları

| Denetim | Sonuç |
|---|---|
| Ana görev sayısı, ID'ler, görev verisi | **4.037, v6.18 ile bayt bayt aynı** |
| Yeni destekli geometri görevleri | **170 / 170** |
| Destek kapsamındaki mevcut oyun türleri | **17 tür × 10 varyant** |
| Mini çalışmaların beklenen sayılarını bağımsız formüllerle doğrulama | **170 / 170 başarılı** |
| Model seçeneği benzersizliği ve geçerli sayısal çözüm (10 olası alan varyantı × 170) | **1.700 / 1.700 başarılı** |
| Her oyun türünden gerçek mini kullanıcı akışı: yanlış seçim → düzeltme → doğru | **17 / 17 başarılı** |
| Ana görevin mini çalışma bitince kendiliğinden tamamlanmaması | **17 / 17 başarılı** |
| Gerçek doğrulayıcıdan hata olayı (sayısal, seçim ve açı ilişkisi) | **6 hatalı doğrulama gözlendi** |
| Hiç dokunulmamış modelin yanlış olarak yazılmaması | **Başarılı** |
| Boş sayısal alanın yanlış olarak yazılmaması | **Başarılı** |
| Aynı soruda açı ölçümü hatasından ilişki seçimi hatasına alan geçişi | **Başarılı** |
| Gerçek doğru geometri yanıtının ana ilerlemeye kaydı | **Başarılı** |
| Yerel saklama engeli | **Açık uyarı verildi** |
| 320 / 390 / 768 / 1.280 px Chromium görünümü | **Yatay taşma görülmedi** |
| Tek HTML'deki JavaScript çalışma hatası | **0** |
| Yeni/düzenlenen JS sözdizimi kontrolleri | **4 / 4 başarılı** |
| Çok dosyalı index'teki yerel CSS/JS dosya referansları | **119 / 119 mevcut; tekrarlı kaynak yok** |
| Elle öğretmen onayı isteyen görev | **0** |

**Test tekniği:** Tek dosya uygulama Chromium üzerinde `about:blank` test ortamına yerleştirilerek çalıştırıldı. Tarayıcı saklaması **yalnız test oturumunda** kontrollü bellek nesnesiyle taklit edildi; dağıtılan HTML'de bu taklit bulunmaz. Kontrol edilen 170 varyantın matematiksel hedefleri programatik olarak denetlendi; her oyun türünden bir gerçek mini arayüz akışı oynandı. Doğru gerçek ana kontrol ayrıca sınandı. Test senaryoları ve sonuçlar `qa_v619_results.json` içindedir.

**Sınır:** Yerel HTTP adresiyle çok dosyalı `index.html` gerçek tarayıcı açılışı, test ortamının ağ erişimi engeli nedeniyle doğrulanamadı. Bunun yerine indeksin **119 yerel varlığı**, benzersiz kaynak bağlantıları ve aynı kodu içeren tek HTML'nin oynanabilirliği doğrulandı. Fiziksel Android, akıllı tahta ve sınıf ortamı testi yapılmadı.

## Ürün/pedagoji sınırları

1. Hata olayı yalnız matematik doğrulayıcısının gözleyebildiği **yanıt alanını** temsil eder. İki hata bir öğrencinin kavram yanılgısını kesin olarak teşhis etmez; öneriler deneyseldir.
2. Bazı 17 oyun türünde ayrı bir yeni görsel model sunulsa da mini alıştırmalar belli bir konu ailesinde ortak model kullanır. **170 farklı etkileşim motoru yapılmadı.** Birden fazla öğrenciyle gerçek öğrenme kazanımı ölçülmedi.
3. 4.037 ana görevin tüm matematiksel doğruluğu yeniden denetlenmedi. Programatik matematik testleri **170 yeni mini çalışma** üzerindedir.
4. 6. sınıf oran-orantı veya kesir konularının tamamında yeni hedefli destek henüz yok. v6.19'un genişletme kapsamı öncelikle 6. sınıf geometrisidir.
5. Sınıfa/öğrenciye uzaktan ödev atama, cihazlar arası eşitleme, öğretmenin telefonundan akıllı tahta kontrolü ve MEB ortak yazılı simülasyonunun tam sürümü henüz tamamlanmış değildir.
6. Çalışmalar `localStorage` üzerindedir; farklı cihazlara otomatik geçmez. Tarayıcı kayıtları silinirse yedek alınmamış ilerleme kaybedilebilir.

## Dosya rehberi

- `index.html`: çok dosyalı yerel uygulama başlangıcı.
- `ATLAS_TEK_DOSYA.html`: bağımsız oynanabilir HTML.
- `assets/js/geometry6.js`: eksik model için sahte hata koruması, yanıt alanına bağlı hata olayı.
- `assets/js/atlas619_geometry_coach.js`: 17 oyun türüne özgü mini çalışma üretimi, kaydetme ve görsel arayüz.
- `assets/css/atlas619_geometry_coach.css`: geniş dokunma alanları ve mobil uyum.
- `assets/js/atlas616_module_trace.js`, `assets/js/atlas64_progress.js`: gözlenen yanıt alanını mevcut geçmiş şemasında koruyan sınırlı ek alan.
- `V619_MOBIL_GEOMETRI_KOCU.png`: Chromium mobil görünüm örneği.
- `qa_v619_results.json`: test sayaçları.
