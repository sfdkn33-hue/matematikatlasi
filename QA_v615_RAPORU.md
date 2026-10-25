# Matematik Atlası v6.15 — Öğrenme İzlerini Genişletme / Bağımsız QA

**Tarih:** 25 Ekim 2026  
**Başlangıç:** v6.14 (4.037 görev, 471 ayrıntılı ölçülen görev)  
**Sonuç:** 4.037 görev aynen korundu. Öğrencinin eski ana laboratuvarlarda gerçekten yaptığı bazı yanlış kontroller ve ipucu kullanımları artık yerel öğrenme geçmişinde kayıtlanıyor. **Yanlış/ipuçlarının tüm 4.037 görevde eksiksiz kaydedildiği iddia edilmez.**

## Değişiklikler
1. `assets/js/app.js`: Eski ana laboratuvarların gerçek yanlış doğrulama bildirimleri (`🔎`, `Tekrar dene`) için yapılandırılmış bir olay yayını eklendi. Ana cevap kontrolündeki mükerrer kayıt kaldırıldı. Olasılık ve çarpanlar atölyelerinin farklı bildirim kullanan gerçek yanlış kontrolü de olay yayınına bağlandı.
2. `assets/js/atlas615_legacy_events.js`: Dokuz doğrulama ve sekiz ipucu düğmesinin eylemlerini **yalnız etkin görev ve kullanıcı eylemi bağlamında** dinleyen gözlemci eklendi. Görev açmak, sıfırlamak veya raporu görüntülemek yanlış deneme sayılmaz. Ayrıntılı takip edilen 471 görevin kendi kaydı tekrarlanmaz.
3. `assets/js/atlas64_progress.js`: `legacy-action` olay kanıtı ayrı etiketlenir. Öğrenme panelinde eski laboratuvarlarda gözlenen yanlış ve ipuçları ayrıca gösterilir; bunlar kavram yanılgısı veya ustalık teşhisi olarak sunulmaz.
4. `index.html` ve tek dosya: Yeni gözlemci doğru script yüklenme sırasıyla bağlandı; içerik verileri ve ilerleme anahtarları değiştirilmedi.

## Test kanıtları
| Denetim | Sonuç |
|---|---|
| Tarayıcı: ana uygulama, geometri yanlış/doğru, kesir ipucu/yanlış, çarpan ipucu, sıfırlama, mobil panel | **13/13 geçti** |
| Veri: eski 4.037 görev, ID, kazanım, eski ayrıntılı takip; depolama engeli ve iyileşmesi; 320px | **10/10 geçti** |
| İstatistik olasılık hatası, çarpan modeli hatası, boş/default modelde sahte hata engeli | **3/3 geçti** |
| JavaScript sözdizimi kontrolü | **3/3 geçti** |

**Toplam: 26 tarayıcı/veri testi ve 3 sözdizimi kontrolü başarılı.** Testler yerel HTML dosyası yerine kontrollü izole Chromium sayfasında, `localStorage` taklidiyle yapıldı. Bu yöntem gerçek Android, HTTPS, çoklu kullanıcı veya cihazlar arası veri senkronizasyonu testi yerine geçmez.

## Kapsamın dürüst sınırları
- 471 görevde ayrıntılı aşama/hata kaydı zaten vardı; **geri kalan 3.566 görevün tamamında** yanlışı gözlemlediğimiz söylenemez. Yeni katman özellikle ana `app.js` üzerinden çalışan geometri, sayı, kesir, cebir, ölçme, istatistik, olasılık ve çarpanlar doğrulayıcılarını hedefler. Diğer modüler atölyelerin özel mesaj kontrolleri henüz kapsamlı olarak bağlanmadı.
- `wrong` kaydı yalnız gerçekten yapılmış kontrol; `hint` kaydı görünen ipucu düğmesinin kullanımıdır. Kullanılan matematiksel alt beceri her zaman belirlenemez, **hata nedeni uydurulmaz**.
- Kayıtlar kullanıcının tarayıcısındadır. Sınır aşımı, tarayıcı depolama kısıtları, saat manipülasyonu ve cihaz değişimi riskleri devam eder. Geçmiş olayları bilmeyen sistem, eski bir başarıdan ipucusuzluk kanıtı çıkarmaz.
- 4.037 sorunun tamamı matematiksel olarak tekrar çözdürülmedi; gerçek çocuklarla kullanılabilirlik değerlendirmesi yapılmadı.
- Öğrenci tamamlanması matematiksel doğrulukla değerlendirilir; **öğretmen onayı yoktur**. Canlı GitHub değiştirilmedi.

## Sıradaki işler
Öncelik: Eski modüler oyun motorlarının kendi içindeki başarısız kontrollerini yapılandırılmış olay API'sine tek tek bağlamak; ardından yanlışın **model/hesap/yorum** aşamasını doğrulanabilen yerlerde ayrıştırmak. Yedek içeriğini kontrollü geri yükleme ve öğretmen–öğrenci çoklu cihaz senkronizasyonu ayrıca gerekir.
