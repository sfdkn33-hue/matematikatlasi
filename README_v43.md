# Matematik Atlası v4.3 — Yazılı Sınav Merkezi (TEST)

## Gerçekleştirilen
- 5–8. sınıf seçimi, özgün açık uçlu soru bankası; sınıf/kazanım/zorluk/metin arama.
- **672 özgün/parametrik yazılı pilot soru varyantı**: kolay 212, orta 262, zor 198; 44 farklı kazanım/çıktı etiketi. 5–8. sınıflarda sınıf başına 168 soru.
- Soru ekle/çıkar/sırala, soru puanı değiştirme ve toplamı 100 puana dağıtma.
- Sınıf, dönem, süre, okul adı ve başlık alanları; 3/5/2 gibi güçlük dağılımıyla otomatik sınav oluşturma.
- Sınav ve cevap anahtarını **gerçek .docx Word dosyası** veya **gerçek çok sayfalı .pdf** olarak indirme. PDF görüntü tabanlıdır; Word metni düzenlenebilirdir.
- Süreli sınav simülasyonu, serbest yanıt ve tarayıcıda yerel taslak kaydı; süre dolunca yanıt kilitleme, çözüm ve rubrik gösterme.
- Daha büyük banka için yapısı doğrulanan JSON dosyasını kullanıcı tarayıcı oturumuna aktarma. İçe aktarılan sorular kalıcı sunucu havuzuna yazılmaz.
- Atlas ana sayfasından giriş. **Tek dosyalık HTML'de Yazılı Merkezi içeride ve çevrimdışı çalışır.** Ayrı `YAZILI_MERKEZI.html` de çevrimdışıdır.

## Önemli sınırlar ve açıklık
- **Henüz her kazanımda onlarca soru yoktur**; mevcut 44 kazanım etiketi değişen sayıda soruyla temsil edilir. Çok az sorusu olan çıktılar sonraki aşamada önceliklendirilmeli.
- MEB'in kapalı soru havuzuna erişim, MEB OYSS eşdeğerliği veya 2026–27 zümre senaryolarıyla otomatik resmî uyum iddiası yoktur. Kazanım/kod eşleştirmelerinin bir bölümü önceki uygulamanın taslak metaverisinden devralınmıştır.
- Açık uçlu çözümün bütün işlem basamaklarını tarayıcı güvenle otomatik notlayamaz. Cevap anahtarı ve aşamalı rubrik öğretmen kontrolü içindir.
- Otomatik zorluk etiketleri pilot/taslak düzeydedir; sınıf içinde ölçülmüş güçlük indeksi değildir.
- PDF tarayıcı içinde resim temelli A4 oluşturulur, metin seçilemez. Word dosyası düzenlenebilirdir.
- Öğrenci taslakları sadece mevcut tarayıcıda kalır; merkezi sunucu/e-Okul bağlantısı yoktur.
- Öğrenme çıktısı seçimi resmî dönem senaryosunu kendi kendine belirlemez. Öğretmen uygun senaryonun konu-soru tablosunu esas almalıdır.
- Önceki 2.807 oyun görevi ve kayıt saklama anahtarı değiştirilmedi. Canlı GitHub değişmedi.

## Sonraki içerik geliştirme işleri
1. Tüm 5–7. sınıf çıktılarında **çıktı başına kolay/orta/zor seviyelerinde ayrı ayrı en az 10 özgün soru** hedefi (toplam en az 30/kazanım).
2. 8. sınıfın 2018 programı tüm resmî kazanımlarının birer birer eşlenmesi, kazanım alt etiketi yerine resmî kodla denetlenmesi.
3. 2026–27 1. ve 2. dönem resmî konu-soru dağılım senaryolarının öğretmence eşleştirilmesi.
4. Matematiksel hata avı, öğretmen puanlama rubriği, kısmi puan, gerçek öğrenci pilotu, ekran okuyucu testi.

Kaynaklar:
- https://www.meb.gov.tr/ortak-yazili-sinav-sistemi-uygulama-kilavuzu-yayimlandi//haber/42228/tr
- https://odsgm.meb.gov.tr/www/birinci-donem-ortak-yazili-sinavlarinin-konu-soru-dagilim-tablolari-yayimlandi/icerik/1731/
