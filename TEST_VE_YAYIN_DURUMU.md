# Matematik Atlası — Yayın paketi kalite raporu

**Tarih:** 27 Ekim 2026
**Paket:** 1.0 açık erişim yayın adayı (statik GitHub Pages)

## Başarılı kontroller

- 5.579 benzersiz oyun görevi, 130 Atlas kodu; sınıf dağılımı: 5. sınıf 1.114, 6. sınıf 1.390, 7. sınıf 1.248, 8. sınıf 1.827.
- `data/tasks.js` ve `data/tasks.json` içerik eşitliği doğrulandı.
- Site içindeki bağlantıların mevcut dosyaya işaret etmesi denetlendi; eksik yerel kaynak bulunmadı.
- 71 JavaScript kaynak dosyasına yönelik sözdizimi testi başarılı (Node.js).
- Chromium'da bağımsız içerik yerleştirmeli (inline) test: 390 ve 1280 piksel ekranlarda dört sınıfın görev ekranları açıldı (8 temel akış).
- İlk ekranlarda yatay taşma ve JavaScript çalışma zamanı hatası bulunmadı. 8. sınıf ilk çalışması eski 3 soruluk pilota değil, M.8.1.1.1 koduna yönlendirildi.
- Ek ekranlar: Sınav Antrenmanı, Senaryolu Yazılı, Dönem Sonu Denemeleri, Yazılı Merkezi, Öğretmen Görünümü, Dinamik Geometri, Gizlilik — 7/7 açılış testi hatasız.
- Gizlilik sayfası, kullanım sınırları, favicon ve yükleme rehberi eklendi.

## Açık kalan doğrulamalar

- Tarayıcı ortamında gerçek yerel URL'ye gezinme güvenlik nedeniyle engellendi; yapılan testler HTML/CSS/JS'nin bellekte birleştirilip Chromium'a sunulmasıyla gerçekleştirildi. **GitHub Pages üzerinde gerçek alan adı ile uçtan uca test yapılmadı.**
- Bütün 5.579 görevin matematiksel cevap anahtarı bağımsız öğretmen onayından geçmedi; önceki sürümlerdeki otomatik kontroller bu denetimin yerine geçmez.
- Sınavların gerçek yazıcı/PDF, akıllı tahta, farklı mobil tarayıcı, erişilebilirlik ve performans saha testleri tamamlanmadı.
- 130 koddan biri tarihî pilot koddur; bazı kazanım eşleştirmeleri resmî programla yeniden doğrulanmalıdır.
- Sunucu özellikleri: Google/OAuth, QR sınıf eşleme, uzaktan kumanda, merkezi hesap ve ödev teslimi **bu statik yayında yoktur**.

## Yayın kararı

**Uygun kullanım:** ücretsiz herkese açık alıştırma sitesi / kamuya açık beta.
**Henüz uygun değil:** kesintisiz hizmet taahhüdü, resmî sınav, öğrenci kişisel verilerinin sunucuda toplanması ve ücretli ürün olarak üretim hizmeti.

Mevcut GitHub canlı sürümünün üzerine doğrudan yüklemeden önce geri dönüş noktası oluşturun.
