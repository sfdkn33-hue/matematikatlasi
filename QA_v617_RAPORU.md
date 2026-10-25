# Matematik Atlası v6.17 — Hata Türüne Uygun Kısa Öğrenme Desteği

**Kaynak sürüm:** v6.16 · **Durum:** Kontrollü tarayıcı testi tamamlandı · **Canlı GitHub:** Değiştirilmedi.

## Değişiklik özeti

- **4.037 görev korunmuştur; yeni ana görev eklenmemiştir.** `data/tasks.json`, v6.16 ile **bayt bayt aynıdır**; görevlerin ID'leri ve öğrenci tamamlanma anahtarı (`mathAtlas940Done`) değişmemiştir.
- v6.10'dan 48 ve v6.11'den 48 olmak üzere **96 ana görevde** yanlış matematiksel kontrol sonrasında açılabilen **isteğe bağlı “Başka bir yoldan öğren”** mini çalışması vardır.
- Sekiz konu ailesi (her birinden 12 görev): **maliyet ve sabit ücret; sayı/şekil örüntüsü; uzunluk-alan birimleri; çember çevresi; üçgen sınıflandırma/çevre; eşit olasılık; daire dilimi; köklü ifade sadeleştirme.**
- Her mini çalışmada **model/işlem seçimi ve sayısal kanıt** olmak üzere iki zorunlu adım bulunur. 8 grupta görsel örnekleme eklendi: sayma kartları, alan kareleri, çember/üçgen SVG şemaları, bilyeler ve daire dilimi.
- Yanlış model/işlem seçimlerinde, **o seçeneğin neden doğru çözüm olmadığına yönelik** açıklama verilebiliyor. Bu açıklamalar gözlenen seçime bağlıdır; öğrencinin zihninde kesin hangi yanılgı olduğunu iddia etmez.
- İpucu ve düzeltici açıklamalar ana sorunun doğru cevabını otomatik doldurmaz. Mini çalışmayı tamamlamak **ana görevin tamamlanması veya 1–7–21 günlük tekrar başarısı değildir**.
- Yardımcı çalışma sonucu ayrı `mathAtlas617Practice` anahtarında kaydedilir. Bu kayıt başarısızsa uyarı verilir; yardımcı çalışmanın tamamlanması öğrencinin ana ilerleme kaydını değiştirmez.
- Aynı görev için eski genel öğrenme koçunun önerisi ile yeni mini çalışma iki ayrı kart olarak gösterilmez. Diğer görevlerin mevcut öneri sistemi korunur.
- **Öğretmen onayı** eklenmedi; ana matematik değerlendirmesi yine otomatik.

## Otomatik testler ve sonuçlar

| Denetim | Sonuç |
|---|---|
| 96 görev için mini çalışma oluşturma | **96/96** |
| Üç seçenek benzersiz; doğru seçenek içlerinde | **96/96** |
| Beklenen sayısal sonuç bağımsız formülle tutarlı | **96/96** |
| Doğru seçeneğin konumu | 1. sıra: 34, 2. sıra: 32, 3. sıra: 30 |
| Sekiz konu ailesinin birer görevinde gerçek yanlış–yanlış mini seçim–doğru mini çözüm akışı | **8/8 başarılı** |
| Mini çalışmayı bitirince ana görev otomatik tamamlanmıyor | **8/8 başarılı** |
| Mini çalışma depolaması engellenirse uyarı | Başarılı |
| V6.16 ile ana görev verisinin bayt bayt eşitliği | Başarılı |
| Mobil 320 ve 390 px yeni mini kart | Yatay taşma ve JavaScript hatası görülmedi |

**Test yöntemi:** Ağ erişimi olmayan tek HTML dosyası izole Chromium içine yüklendi. Tarayıcı depolaması **yalnız test oturumunda** taklit edildi; teslim edilen uygulamaya taklit kodu eklenmedi. Her varyantın bütün kullanıcı seçimleri denenmedi; 96 varyantın matematiksel model verileri ve cevap seçenekleri programatik olarak incelendi, sekiz ailede birer gerçek kullanıcı akışı oynandı. Test paketindeki `qa_results.json` ve `qa_all96.json` kontrol sonuçlarını içerir.

## Pedagojik ve ürün sınırları

1. **96 destekli görev, 96 farklı oyun motoru değildir:** sekiz konu ailesinden türeyen mini görsel/hesap alıştırmalarıdır. Aynı konunun bütün alt becerilerini ölçtüğü kanıtlanmamıştır.
2. Mini çalışmada öğrencinin seçtiği hatalı işlem *gözlemlenir*; bundan kesin bir bilişsel tanı çıkarılmaz. Daha güvenilir tanı için çoklu kanıt ve farklı günlerde yeni sorular gereklidir.
3. v6.16'da ayrıntılı ölçülen 471 görev ve seçili modüllerde gözlenen izler devam eder. Yeni destek **96 görevlik bir alt kümedir**, 4.037 görevin tamamında aktif değildir.
4. Yardımcı çalışma kayıtları henüz **cihazlar arasında eşzamanlanmıyor**; öğrenme koçunun tavsiye etkinliği öğrencilerle saha testinden geçirilmemiştir.
5. Yerel HTML'nin Android tarayıcıdaki depolama davranışı cihazdan cihaza değişebilir; gerçek Android cihaz testi yapılmadı.
6. 4.037 ana sorunun matematiksel doğruluğu bu geliştirmede baştan sona yeniden incelenmedi.

## Başlıca kaynaklar

- `assets/js/atlas617_tutor.js`: görev türü eşleme, düzeltici mikro-alıştırmalar, yanıta özel destek, ayrı kayıt.
- `assets/css/atlas617_tutor.css`: açık/koyu tema içinde yüksek kontrastlı ve telefon uyumlu destek kartı.
- `assets/js/atlas612_coach.js`: hedefli desteğin bulunduğu görevlerde tekrarlı genel öneri kartını gizler.
- `index.html`, `ATLAS_TEK_DOSYA.html`: yeni dosyaları bağlayan çoklu/tek dosyalık uygulama.
