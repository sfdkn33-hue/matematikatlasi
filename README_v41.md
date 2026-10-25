# Matematik Atlası v4.1 — Olasılık Laboratuvarı

## Kullanım
- **Çevrimdışı:** `ATLAS_TEK_DOSYA.html` dosyasını Chrome/Chromium'da aç.
- **Modüler:** `index.html` dosyası, `assets/` ve `data/` klasörleri aynı dizin yapısında kalmalı.
- **Canlı GitHub değiştirilmedi.** Bu ZIP yalnızca yeni test/staging sürümüdür.

## Resmî programla eşleştirme
[MEB 7. sınıf 7. tema Veriden Olasılığa](https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/471): 9 ders saati, üç öğrenme çıktısı.
- MAT.7.7.1: olayın ve tümleyeninin teorik olasılığı — 30 görev.
- MAT.7.7.2: eşit/eşit olmayan olasılıklı olaylar — 30 görev.
- MAT.7.7.3: ayrık/ayrık olmayan olaylar — 30 görev.

## Dokuz mekanik (her biri 10 görev)
1. Örnek Uzay Avcısı — koşulu sağlayan kartları seç, kesri kur.
2. Tümleyen Bulmacası — A dışındaki kartları seç, P(Aᶜ) hesapla.
3. Olasılık Çarkı — eş dilimleri işaretle, teorik olasılığı deneyden ayır; isteğe bağlı 12 çevirme.
4. Adil Torba Kontrolü — eş olasılık kararını topların dağılımıyla açıkla.
5. Torbayı Dengele — eklenecek renk ve top sayısını seç, sonucu gör.
6. Adil Çark Denetimi — iki renk olayının olasılığını karşılaştır.
7. Kesişim Avcısı — ortak sayıları seç ve ayrıklık kararı ver.
8. Ayrık mı, Değil mi? — ortak çıktı sayısını hesapla.
9. Venn Haritacısı — öğeyi doğru bölgeye koy ve kesişimi say.

Matematiksel gerekçe doğru olmadan tamamlanma kaydı oluşmaz. Eş büyüklükte dilimler ve aynı büyüklükte özdeş toplar varsayılmıştır. Deneysel göreli sıklık, teorik olasılığın yerine geçirilmez.

## Veri koruma
- Önceki **2.649 görevin tamamı** aynı sıra, içerik ve kimlikle korunmuştur; JSON kayıtları SHA-256 ile doğrulandı.
- Yeni toplam **2.739 görev**: 5. sınıf 955, 6. sınıf 1190, 7. sınıf 579, 8–12. sınıflar 15 pilot.
- 7. sınıf 30 resmî çıktısının 22'sinde ilk oyun paketi var; sekiz çıktı sırada.
- Eski `mathAtlas940Done` anahtarı değiştirilmedi. **Önemli:** tarayıcı kökeni (ör. farklı file:/// yolu veya alan adı) değişirse ilerleme otomatik aktarılmayabilir. Canlı yayın öncesi öğrenci verisini yedekleyin.

## Test kapsamı
- Yeni 90 görevin matematiksel modelleri ve 2.649 geçmiş kaydın veri bütünlüğü kontrol edildi.
- 9 mekaniğin her birinden bir görev, 390 px mobil ve 1280 px masaüstü Chromium'da boş cevap, eksik gerekçe ve doğru çözümle denendi.
- 5, 6, 8 ve 12. sınıf ekranlarına dönüş, eski tamamlama kaydının saklanması ve yatay taşma kontrol edildi.
- Yeni 90 görevin **tamamı** tek tek tarayıcıda çözülmedi. Gerçek öğrenci/öğretmen pilotu, erişilebilirlik ve pedagojik alan testi hâlâ gereklidir.
- Bu bağımsız proje MEB tarafından onaylanmış resmî bir ürün değildir.
