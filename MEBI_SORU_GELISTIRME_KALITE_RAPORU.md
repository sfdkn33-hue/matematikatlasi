# Matematik Atlası — Beceri Temelli Özgün Soru Eki / v1.1

## Kaynak doğrulaması
MEBİ resmî portalı ve MEB ÖDSGM'nin 2025-2026 LGS örnek soru yayımlama duyuruları doğrulandı. Açık PDF'lerin tamamına erişilemedi. Resmî tekil soruları aynen kopyalama veya MEB onayı iddiası yoktur.

## Değişiklikler
- Her sınıfa 8, toplam 32 özgün çoktan seçmeli soru; seçenekler ve çözüm açıklaması.
- `BECERI_TEMELLI_32_OZGUN_SORU.html` ayrı etkileşimli ekran; sınıf, soru, zorluk seçimi.
- Önceki 1.032 sorunun tamamı korunarak `ANTRENMAN_MERKEZI.html`, `DONEM_SONU_DENEMELERI.html`, `SENARYOLU_YAZILI_SIMULATORU.html` dosyalarına eklendi. Her birinde 1.064 soru.
- `data/tasks.json` ve `data/tasks.js` eski sürümle byte-byte aynı. Oyun görevleri 5.579.
- Yeni JSON ve kaynak/telif bildirimi eklendi.

## Denetim
- 32 soruda benzersiz kimlik, dört benzersiz seçenek, tek doğru cevap kontrol edildi.
- Doğru seçenekler her sınıfta A/B/C/D için ikişer kez dağıtıldı.
- Matematiksel sonuçlar formüllerle doğrulandı; bu kontrol bağımsız uzman pedagojik değerlendirmesi yerine geçmez.
- 390 ve 1280 piksel Chromium testlerinde tüm 32 soru için doğru ve yanlış cevap denendi: 64 soru akışı, 128 cevap kontrolü başarılı.
- Üç sınav aracı ve ana sayfanın açılması kontrol edildi; ön izleme ekranında yatay taşma ve JS hatası yok.
- GitHub Pages canlı yayın testi yapılmadı. EBA/MEBBİS yetkili girişi veya MEBİ'yle doğrudan entegrasyon yapılmadı.
- Her soru resmî kazanıma uygunluk ve pedagoji için öğretmen kontrolü gerektirir.

## Yayın tavsiyesi
Bu paket yayın adayıdır; v1.0 ZIP yerine depo köküne yüklenmeli. Canlı sitede örnek testler ve öğretmen kontrolü ardından geniş erişime açılmalıdır.
