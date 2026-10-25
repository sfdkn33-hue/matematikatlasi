# Matematik Atlası v6.7 — Öğrenme ve Kayıt Güvenliği QA

**24 Ekim 2026.** v6.6.1 üzerine kritik güvenilirlik onarımı; **yeni soru: 0**. Öğrenci görev verisi tamamen korunmuştur.

## Değişiklikler

1. **1–7–21 gün hata onarımı:** `assets/js/atlas64_progress.js` içinde her tekrar aşamasına yalnızca planlanan en erken tarihten sonra, ilk denemede, ipucusuz doğru ve **önceki kabul edilen tekrar gününden farklı bir yerel takvim gününde ve aradaki 1/6/14 günlük asgari aralıkları sağlayınca** kanıt kabul edilir. İlk çözüm tarihi esas alınır; aynı gün üç tekrar üç aşama ilerletmez. Bozuk geçmiş başarılar, kayıtlardan silinmeden yeniden hesaplanır.
2. **Saat uyumsuzluğu:** Gelecekte oluşturulmuş tekrar kanıtı şimdiye göre 5 dakikadan daha fazla ileri görünüyorsa `clockWarning` üretilir; ustalık yanıltıcı şekilde güncellenmez. **Offline cihaz saati güvenilir zaman kaynağı değildir:** zamanı ileriye alıp sahte günler oluşturmanın kesin engellenmesi ancak güvenilen bir çevrimiçi saat/sunucuyla mümkündür.
3. **İlerleme kaydının doğrulanması:** `assets/js/app.js` içindeki `save()` `localStorage` yazımını geri okuyarak doğrular. Başarısızlıkta sessizce yeşil kaydedildi bildirimi gösterilmez; erişilebilir üst uyarı sunulur. RAM'de o oturumun tamamlanma durumu tutulur ve JSON yedeği hazırlanabilir. İlerleme ve taslak saklama hataları bildirilir.
4. **Pilot deneme geçmişi:** `assets/js/atlas64_progress.js` deneme olaylarını da geri okuyarak doğrular; kayıt yapılamazsa olay geçmişi geçici olarak RAM'de tutulur ve JSON yedeğine eklenir. Laboratuvar doğru çözümü bir kaydetme başarısı gibi sunmaz.
5. **Kullanıcı yedeği:** Görev ekranının ilerleme bölümüne `📥 Yedek al` düğmesi eklendi. Çıktıda eski tamamlanma işaretleri, pilot deneme geçmişi ve taslak cevaplar bulunur. Depolama tamamen engellenmişse JSON metnini elle kopyalama seçeneği var. **Otomatik geri yükleme, sunucu senkronizasyonu veya farklı cihazlara güvenli aktarım bu sürümde henüz yok.**

## Doğrulama

| Kontrol | Sonuç |
|---|---|
| Farklı günler, erken/geç tekrar, ipucu, hata, saat anomalisi, aynı gün 3 tekrar ve kayıt denemesi | **25 / 25** algoritma testi |
| Başarılı/başarısız yerel depolama, uyarı, yedek, yeniden iyileşme | **7 / 7** odaklı depolama testi |
| Gerçek `index.html` ile aynı sıradaki gömülü modüllerle Chromium açılışı | **4.001 görev yüklendi**, JS hatası yok |
| Normal pilot görev: boş yanlış, doğru kayıt, deneme izi | **Geçti** |
| Yazma izni kapalı: doğru işlem, uyarı, kayıt oluşmaması ve kopyalanabilir yedek | **Geçti** |
| Yazma izni geri geldiğinde kaydetme | **Geçti** |
| İlk + 22. günde aynı gün 3 tekrar | **1 / 3 basamak**, 6 gün sonrasına planlandı |
| LGS 8 soruluk zor mod | **1 / 8** açıldı |
| 390 px açılışta yatay taşma | **Yok** |
| Görev verisi, ID, kazanım kodları | **4.001 görev, 130 kod, v6.6.1 ile birebir aynı** |
| HTML'nin 101 modüler stil ve script referansı | **Tamamı mevcut** |

Testler: `tests/QA_V67_ALGORITHM.json`, `tests/QA_V67_STORAGE.json`, `tests/QA_V67_BROWSER.json`. Node ve kontrollü Chromium. Test scriptleri paket kökündeki `qa_atlas_v67_node.js`, `qa_atlas_v67_storage.js`, `qa_v67_integration.py`.

## Henüz tamamlanmayanlar

- **Yedekten içe aktarma** ve tarayıcılar arası güvenilir eşitleme yok. JSON yedeği yalnızca veriyi saklar; geri yükleme ürüne ayrıca eklenmeli.
- 1/7/21 tekrar kanıtı yalnızca **116 pilot görevde** ölçülür. Diğer 3.885 görev için ortak deneme/yanılgı takibi hâlâ gereklidir.
- Aynı görev sorusu tekrar tekrar çözülebilir; eşdeğer yeni soru varyantlarıyla gecikmeli transfer testi henüz kurulmadı. Bu nedenle 3 basamaklı tekrar **ustalık ispatı değildir**.
- Android'deki gerçek `content://download` depolama kalıcılığı, fiziksel akıllı tahtalar, öğretmen–öğrenci senkronizasyonu ve gerçek öğrenci saha testi yapılmadı.
- Genel 4.001 görev cevabının ve bütün varyantların bağımsız matematiksel kontrolü yapılmadı.

Canlı GitHub değiştirilmedi.
