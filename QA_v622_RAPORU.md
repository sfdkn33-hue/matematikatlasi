# Matematik Atlası v6.22 — Sınıf Kumandası QA Raporu

**Tarih:** 25 Ekim 2026. **Kaynak:** v6.21. **Canlı GitHub:** değiştirilmedi.

## Sürüm ve kapsam
- **4.037 ana görev ve tüm ID'ler korundu.** Yeni ana görev eklenmedi.
- v6.21'in **659 hedefli pekiştirme** görevine ait JS ve veri değiştirilmedi.
- Bu sürüm **öğretmenin telefonundan akıllı tahtadaki görevleri yönetmesi** için aynı yerel Wi-Fi ağı üzerinden Node.js sunuculu bir *pilot* ekler.
- Kumanda izinleri: geçerli görevi seçme, önceki/sonraki göreve geçme ve ana sayfayı gösterme. Yanıt doldurma, ipucu kullanma, doğru sayma, puan verme veya öğrenci kayıtlarını değiştirme kumandadan mümkün değildir.
- Tahta geçici kod+PIN üretir, öğretmen eşleşir, oturum bellekte tutulur ve 2 saatte sona erer. Öğrenci adı/yanıtı veya öğrenme geçmişi sunucuya gönderilmez.

## Kaynak bütünlüğü
- `data/tasks.json` v6.21 ile **bayt bayt aynı:** SHA256 `a26ec218d0e7d2cca34d76b669636388d9b71f4de5f53926362864d5d7a6ab18`.
- `assets/js/app.js`, `assets/js/atlas621_ratio_coach.js`, `assets/js/atlas621_teacher_insights.js` v6.21 ile bayt düzeyinde aynıdır.
- Eski öğrenci anahtarlarının adları değiştirilmedi (`mathAtlas940Done`, `mathAtlas64Attempts`). Bu, *farklı HTTP origin'indeki* eski kayıtların otomatik taşındığı anlamına gelmez.

## Doğrulanan testler
| Test | Sonuç |
|---|---:|
| Gerçek yerel HTTP / SSE: oturum, PIN, katalog, yetki, geçersiz komut, sürenin sonu değil oturum kapatma, çapraz-origin engeli | **18/18 başarılı** |
| Tarayıcıda ağ taklidiyle (API simülasyonu) 6. sınıf görevine gezinme, oyun ekranının görünmesi, önceki göreve dönme, görev sayısının korunması, 390 ve 1280 px yatay taşma | **10/10 başarılı** |
| Tarayıcı JavaScript hatası (kontrollü ortam) | **0** |
| Yeni JS dosyalarının Node sözdizim denetimi | Başarılı |

Ağ testleri `node tests_v622/test_lan.js` ile sunucunun gerçek HTTP uç noktalarında, SSE olay iletiminde yürütüldü. UI testlerinde tarayıcının ağ bağlantısı ortam politikasıyla engellendiği için **yanıtlar taklit edilerek** kaynak oyun ve kumanda kullanıcı arayüzleri incelendi. Bu iki test grubu birleştirilerek gerçek iki fiziksel cihazın birlikte sınandığı iddia edilmez.

## Bilinen sınırlar ve riskler
1. **Gerçek Android telefon + fiziksel akıllı tahta + okul Wi-Fi ağında uçtan uca saha testi yapılmadı.** Özellikle okul ağının cihaz izolasyonu, güvenlik duvarı ve tarayıcı politikaları test edilmeli.
2. **HTTP şifreli değildir.** Pilot yalnız güvenilir, izole yerel ağda kullanılmalı. İnternete açılmamalı. Üretim için TLS/HTTPS, kimlik doğrulama, sunucu sertifikaları ve kapsamlı güvenlik denetimi gerekiyor.
3. Telefon üzerinden görev komutu kabul edilmesi, tahtanın eylemi uyguladığının kesin onayı değildir. Öğretmen paneli tahta tarafından iletilen *son görünen görev* bilgisini izleyebilir.
4. Sunucu Node.js 18+ ve çalışan bir bilgisayar gerektirir; ZIP'i tek başına telefonda veya Github Pages'te açmak uzaktan kumandayı çalıştırmaz.
5. Sınıflar arası canlı öğrenci hesapları, ödev atama, eşzamanlı ödev takibi ve kayıt eşitleme **henüz yoktur**. Önceki v6.21 çevrimdışı öğretmen özet paneli korunur.
6. İki saatlik oturum dolunca öğretmen yeniden kod/PIN ile eşleşmelidir. Sunucu kapanırsa oturum kaybolur.
7. Telefon kumandası yalnızca gezinme komutları gönderir; tüm matematiksel yanıtların otomatik değerlendirmesi tahta uygulamasında kalır.
8. Programın 4.037 matematik görevünün tamamı bu sürümde baştan sona bağımsız yeniden doğrulanmadı.

## Test yapısı
- `tests_v622/test_lan.js`: API ve SSE testleri; `node tests_v622/test_lan.js` ile çalışır.
- `README_v622.md`: adım adım Windows/Mac/Linux kurulum ve güvenlik.
- `lan/server.js`, `lan/teacher.html`, `lan/board.js`, `lan/board.css`: yeni bileşenler.
