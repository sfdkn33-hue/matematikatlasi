# Matematik Atlası v6.8 — Kazanım Derinleştirme ve QA

**Kapsam:** v6.7 üzerine **36 yeni, otomatik doğrulanan ana etkinlik**; 4.001 görev nesnesi birebir korunmuştur. Toplam **4.037 görev**, **130 kazanım/kod**, takipli pilot sayısı **152**.

## Gerçekten geliştirilenler

- **6. sınıf · `MAT.6.1.5` — 12 görev:** basamak kartlarını sıraya dizme, ondalık çözümleme seçme, binde birliklerle karşılaştırma, yanlış basamağı tespit etme.
- **7. sınıf · `MAT.7.6.2` — 12 görev:** eksen yanıltıcılığı, veri kartlarını sıralayıp ortanca bulma, örneklem yanlılığı, yüzde değişim.
- **8. sınıf · `M.8.2.1.2` — 12 görev:** cebirsel alan karoları, eksik çapraz çarpım, eşdeğer açılım, dikdörtgen alanı.

**12 soru yaklaşımı** bu üç kazanımda üçer varyantla kullanılmıştır. Bunlar **12 farklı oyun motoru değil**: kart sıralama, alan karosu sıralama ve çok seçenekli model-kararı olmak üzere üç ana etkileşim davranışı içerir. Grafik, tablo, sayı kartı ve alan modeli görünümü vardır. Ana model seçimi ve ek matematiksel kanıt birlikte zorunludur.

## Veri / içerik tutarlılığı

- Eski **4.001 görev nesnesi birebir aynı**; eski ID, sıra ve `mathAtlas940Done` saklama anahtarı değişmedi.
- **36 yeni ID benzersiz**; 130 kazanımın tümünde en az bir görev var. `tasks.json` ve `tasks.js` aynı görev verisine dönüştürülür.
- **130 kodluk HTML denetim haritası:** `KAZANIM_DERINLESME_v68.html`. Görev sayısı, etiketlenen soru aileleri ve sayıları maskeleyerek hesaplanmış metin tekrar göstergesi bulunur. Tam program/alt beceri denetimi **henüz insan uzman tarafından onaylanmadı**.
- Metin normalleştirmesiyle **1863 şablon tekrar göstergesi** hesaplandı. Bu sayı **hatalı veya birebir kopya görev adedi değildir**; eski görevlerle bütün pilotların tamamını kapsayan kaba otomatik göstergedir.

## Kontrollü tarayıcı testleri

| Kontrol | Sonuç |
|---|---|
| Yeni görevlerin her biri ana menüden açılıp tamamlandı | **36/36** |
| Boş model ve boş cevap başarı vermedi | **36/36** |
| Sayısal cevap doğru, model boş | **36/36 reddedildi** |
| Model doğru, sayısal cevap boş | **36/36 reddedildi** |
| Model + cevap doğru, kayıt oluştu | **36/36** |
| Deneme geçmişi `mathAtlas64Attempts` | **36 doğru kayıt** |
| Genel eski cevap düğmesinden geçiş | **6, 7, 8. sınıfta 3/3 engellendi** |
| Bilerek yanlış model + doğru cevap | **3/3 engellendi** |
| Kayıt engellenince uyarı ve görevün kaydedilmemesi | **Geçti** |
| Eski görev kaydı | **Korundu** |
| 320, 390, 768 ve 1280 px yatay taşma | **Görülmedi** |
| Yeni görev tarayıcı açılış JavaScript hatası | **0** |

Kaynaklar: `tests/QA_V68_BROWSER.json` ve `tests/QA_V68_REGRESSION.json`; kontrollü Chromium'da tek HTML'yi bellekten yükleyerek uygulandı. Gerçek Android `content://` depolama kalıcılığı veya sınıf testi bu sonuçlara dahil değildir.

## Önemli sınırlar ve sonraki öncelikler

1. 130 kodun tüm alt becerileri resmî metinlerle tek tek karşılaştırılıp uzman kontrolünden geçirilmedi; soru türü tamlığı ilan edilemez.
2. Özellikle `MAT.6.2.3`, `MAT.6.1.6`, `MAT.6.4.2`, `MAT.6.4.6` ve bazı 8. sınıf grafik/denklem kazanımlarında daha fazla soru biçimi gerekiyor.
3. Aralıklı tekrar henüz aynı görevin tekrarıdır; eşdeğer **yeni** soruyla gecikmeli aktarım testi yok. Takipli pilot: 152; diğer 3.885 eski görevde ayrıntılı ilk deneme/yanılgı geçmişi bulunmuyor.
4. Öğretmenin başka cihazlardaki öğrencilere ödev ataması ve sonuçları güvenilir biçimde alması için yetkili sunucu/senkronizasyon altyapısı gerekir; henüz kurulu değil.
5. Matematiksel doğruluk için 36 yeni görevin beklenen değerleri ve kısmi bağımsız formül kontrolleri yapıldı; **tüm 4.037 görev için matematiksel uzman QA tamamlanmadı**.

Canlı GitHub değiştirilmedi. Öğretmen onayı bulunmuyor.
