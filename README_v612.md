# Matematik Atlası v6.12 — Kişiselleştirilmiş Öğrenme Koçu / QA

24 Ekim 2026 · Kontrollü çevrimdışı pilot. Canlı GitHub'a dokunulmadı.

## Kaynak ve kapsam

- **4.037** görev veri nesnesi v6.11 ile **bayt düzeyinde aynıdır**. Yeni görev eklenmedi; ID, sınıf ve kazanım bağlantıları korunur.
- Yeni sistemde **296 görev / 22 kazanım** için etiketli soru ailesi ile cihaz-içi yanlış/ipucu geçmişi mevcuttur. Diğer **3.741 görev** henüz aynı düzeyde kişiselleştirilmez.
- Öğretmen onayı veya sunucu/hesap bağlantısı eklenmedi. Kayıtlar mevcut `mathAtlas64Attempts` ve `mathAtlas940Done` anahtarlarını kullanır.
- Yeni içerik `assets/js/atlas612_coach.js`, `assets/css/atlas612_coach.css`; tek HTML ve çok dosyalı sürüm hazırlanmıştır.

## Çalışan özellikler

1. **Öğrenme Yolum → Bana uygun sonraki adım:** Son 30 gündeki yanlış/ipucu denemelerini kazanım düzeyinde analiz eder; aynı kazanımdan **farklı etiketli soru ailesini** önerir. Birden çok yanlış bulunan kazanımlara daha önce bakılır.
2. **Hata sonrası anlık destek:** Desteklenen bir görevde iki yanlış kaydından sonra isteğe bağlı "Başka bir yoldan deneyelim mi?" seçeneği, **görevün altında** görünür. Doğrudan çözümü veya cevabı göstermez.
3. **İlk başlangıç:** Öğrencinin hiç yanlış verisi yoksa "zorlanıyorsun" demeden, henüz tamamlanmamış başlangıç soruları gösterilir.
4. **Zorunlu matematiksel doğrulama:** Öneriye basmak başarı üretmez, görev seçimi sadece yeni soruya gider; gerçek başarıyı mevcut matematik doğrulayıcıları kaydeder.
5. **Kişisel veri:** Öneriler tümüyle mevcut cihazdaki kayıtlarla hesaplanır, bağlantı/ağ isteği kullanılmaz.

## Test kanıtı

- Chromium yalıtılmış yerel depolama taklidiyle tam **6.1 MB tek HTML** açıldı; JavaScript hata sayısı **0**.
- 4.037 benzersiz ID; 4.037 veri nesnesinin 6.11 ile birebir eşitliği doğrulandı.
- Kaydı olmayan öğrenciye yanlışlıkla "hata" atanmaması, yanlış+ipucu sonrası **aynı kazanım / farklı aile** önerilmesi, 5/6/8. sınıf ayrımı, öneriyle gezinme, tamamlama işaretine dokunulmaması doğrulandı.
- **Gerçek görev üzerinde iki boş/yanlış cevap** sonrası anlık desteğin açılması ve bu destekle başka soru seçiminin çalışması sınandı. Yanlış çözümden dolayı görev tamamlanmadı.
- 320, 390, 768, 1280 px cihaz genişliklerinde öğrenme koçu açıkken **yatay taşma görülmedi**; mobil ekran görüntüleri `tests/` içindedir.
- Ayrıntılar: `tests/QA_V612_BROWSER.json`.

## Sınırlar ve sonraki öncelikler

- **296/4.037 görev (yaklaşık %7,3)** kapsamlı deneme verisine bağlı; 130 kazanımın yalnızca **22'sinde** öneri üretilebiliyor. Bu, tüm Atlas için yapay zekâ tabanlı veya tüm alt becerileri doğru tanılayan bir motor değildir; **kural tabanlı, etiketli çalışma önericisidir.**
- Tek kazanımın farklı soru ailesi, farklı **alt beceri** olduğunu her zaman kanıtlamaz; alt becerilerin MEB süreç bileşenlerine göre ayrı etiketlenmesi gerekir.
- Öneri; son 30 günlük yerel kayda dayanır, farklı bir gerçek öğrenci profili oluşturmaz, öğrenciyi "öğrenemedi" diye etiketlemez.
- `content://download` gibi Android yerel HTML konumlarında gerçek depolama kalıcılığı ve farklı cihazlarda/okullarda saha testi yapılmadı. Test tarayıcısı depolama taklidi kullandı.
- Var olan 1–7–21 tekrar sistemi bu sürümde değiştirilmedi; yeni öneriler tekrar basamaklarını kesin başarı saymaz.
- Matematiksel çözümlerin 4.037 tanesinin hepsi bu turda yeniden test edilmedi; cevap anahtarı v6.11'den korunuyor.
- Canlı depoya yükleme / sunucu senkronizasyonu yok.
