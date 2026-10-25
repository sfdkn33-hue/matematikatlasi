# Matematik Atlası v3.9 — Üçgen Laboratuvarı

## Açma
- Çevrimdışı çalıştırmak için `ATLAS_TEK_DOSYA.html` dosyasını tarayıcıda açın.
- Modüler uygulama için `index.html` ile aynı dizinde `assets/` ve `data/` klasörleri korunmalıdır.

## Yeni 7. sınıf öğretim bölümü
- Resmî MEB programı: https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/469
- 5. Tema *Geometrik Şekiller*, **6 ders saati**, öğrenme çıktıları MAT.7.5.1 ve MAT.7.5.2.
- 56 yeni görev: **MAT.7.5.1 için 32**, **MAT.7.5.2 için 24**.
- Yedi oyun mekaniğinde sekizer görev: orta nokta ve kenarortay inşası, yükseklik ve dikme ayağı, açıyı iki eş açıya ayırma, ağırlık merkezi, eş yarıçaplı pergel inşası, kayıp köşeyi orta noktadan tamamlatma ve kenarortay inşa sıralaması.
- Matematiksel gerekçe gerektiren görevlerde hem çizim hem seçilen gerekçe doğru olmalıdır. Dokunmaya alternatif 0,5 birimlik hassas ok düğmeleri vardır.

## Toplam kapsam ve koruma
- 2.503 eski görev kanonik veri karmasıyla (SHA-256) **hiç değişmeden** korundu.
- Yeni genel toplam **2.559**: 5. sınıf 955, 6. sınıf 1.190, 7. sınıf 399, 8–12. sınıflarda toplam 15 pilot görev.
- 7. sınıfın 30 resmî çıktısından 16'sında uygulama bulunuyor; 14 çıktının temaları haritada planlı.
- Öğrenci ilerleme anahtarı `mathAtlas940Done`; aynı tarayıcı ve aynı köken içinde kayıtlar korunur. Dosya yolu/köken değişirse tarayıcı bunları ayrı depolar olarak görebilir.
- **Canlı GitHub deposunda hiçbir değişiklik yapılmadı.** Paket staging/test içindir.

## Sınırlamalar
- Görevlerin matematiksel yapılandırılmış modelleri test edildi; yeni 56 görevin tamamı uçtan uca tarayıcıda tek tek bitirilmedi.
- Mobilde her yeni mekanikten en az bir doğru/yanlış test, masaüstünde yedi boş yanıt testleri geçti. Eski görevlerin tümü yeniden test edilmedi.
- Üçgenler koordinat düzleminde incelenir; gerçek ölçeksiz cetvel/pergel kullanımının fiziksel hassasiyetini tamamen taklit etmez. Doğal dilde açıklama otomatik puanlanmaz.
- MEB onaylı resmî ürün değildir.
