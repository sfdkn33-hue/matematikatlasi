# Matematik Atlası v6.9 — 6. Sınıf Soru Çeşitliliği ve Ana Oyun Yenileme

**Durum:** Kontrollü yerel test tamamlandı · 24 Ekim 2026. Canlı GitHub değiştirilmedi.

## Neler değişti?

- **Görev sayısı:** 4.037 → **4.037** (hiçbir yeni görev numarası/ID yok).
- **Yeniden tasarlanan ana görev:** **48**; dört 6. sınıf kazanımında **12'şer** eski görev.
- **Önceden tamamlanan görevler:** `mathAtlas940Done` kayıt anahtarı ve bütün görev ID/sırası korundu; eski tamamlanma işaretleri yeni ustalık kanıtı sayılmıyor.
- **Takipli pilot:** 152 → **200**; bu 48 göreve ilk deneme, yanlış ve ipucu bilgisi eklenebilir. Gerçek öğrenci ortamında doğrulanmadı.
- **Öğretmen onayı:** Yok; bütün yeni matematik doğrulamaları otomatik.

| Kazanım | Çalışılan ana soru aileleri | Yenilenen |
|---|---|---:|
| `MAT.6.1.6` Kesir–bölme–ondalık | Ondalık basamak kartları; payda asal çarpan analizi; ilk bölüm/kalan | 12 |
| `MAT.6.2.3` Algoritma | Akış sıralama; bozuk makineyi bulma; işlemi tersine çözme | 12 |
| `MAT.6.4.2` Alan | Paralelkenarı kaydırma; eş üçgenle tamamlama; alanı tersine tasarlama | 12 |
| `MAT.6.4.6` Merkez açı–yay | Sürgüyle açı; π katsayılı yay uzunluğu; yaydan açıya gitme | 12 |

Bu on iki **soru ailesi**, üç temel karar sistemiyle (kart sıralama, seçim, sürgü) ve dört konuya özgü görsel modelle uygulanmıştır. **12 ayrı oyun motoru** ya da **tüm soru türleri tamamlandı** anlamına gelmez. Her ailede sayısal parametreleri değişen dört görev vardır.

## Veri / kapsam

- Eski **4.037 görev kimliği ve sırası birebir aynı**; tam **48 görev nesnesi** değiştirildi.
- Diğer **3.989 görev nesnesi birebir aynı**.
- Eski kazanım sayısı **130 kod**; tüm kodların en az bir görevi vardır.
- `tasks.json` ve `tasks.js` senkron; ZIP içindeki `index.html`, `ATLAS_TEK_DOSYA.html` aynı v6.9 içerik bankasını kullanır.
- 6. sınıf sayısal metin şablonu göstergesi: önce **579**, sonra **571** fazladan kullanım; ≥5 tekrar grubu önce **71**, sonra **65**. Bu otomatik metin analizi pedagojik çeşitliliğin eksiksiz ölçüsü değildir.

## QA — Kontrollü Chromium (gerçek sınıf testi değil)

| Test | Sonuç |
|---|---|
| Bütün 48 görevin yeni laboratuvarda görünmesi | **48/48** |
| Boş çözümün tamamlanmayı engellemesi | **48/48** |
| Yalnız doğru sayı girme, yanlış/boş model | **48/48 reddedildi** |
| Yalnız doğru model, sayı boş | **48/48 reddedildi** |
| Model ve sayının doğru olunca kayıt oluşması | **48/48** |
| 48 doğru denemenin `mathAtlas64Attempts` geçmişine kaydı | **48/48** |
| Genel eski cevap düğmesinden atlama | **Engellendi** |
| Dolu ama yanlış model + doğru sayı | **Engellendi** |
| Tarayıcı kaydı engellendiğinde görevün tamamlanmış görünmemesi | **Doğrulandı** |
| Kayıt hatasında yedekleme uyarısının görünmesi | **Doğrulandı** |
| Örnek eski görevün tamamlanma kaydının korunması | **Doğrulandı** |
| 320/390/768/1280 piksel yatay taşma | **Görülmedi** |
| Sayfa JavaScript hatası | **0** |

Test sonuçları: `tests/QA_V69_BROWSER.json`. İlk denemede testin kayıt doğrulaması başarısız çıktı çünkü yeni laboratuvar ile eski `beklenen_yanit_veya_rubrik` doğrulaması eşleşmiyordu. Ana doğrulamayı atlatmadan **iç doğrulama anahtarı** düzeltildi ve 48 test yeniden başarıyla tamamlandı.

## Sınırlar ve sonraki adımlar

1. Bu 48 görev dışında kalan **3.989 görev için matematiksel uzman çözüm denetimi yapılmadı**; sorunların kalmamış olduğu iddia edilmez.
2. Soru ailelerindeki dört benzer parametreli varyant hâlâ pekiştirme tekrarıdır. Daha çeşitli görsel manipülasyonlar ve günlük yaşam bağlamları için sonraki turlar gerekir.
3. 130 kodun tüm alt becerileri tek tek resmî metinle karşılaştırılmış değildir.
4. Yeni sürümde aralıklı tekrar geçmişi **200 etiketli görev** için izlenebilir; diğer eski görevlerin ayrıntılı deneme geçmişi yoktur.
5. Öğretmen paneli, başka cihazlardan ödev sonuçlarını alamaz; gerçek sunucu / hesap / senkronizasyon sistemi kurulmadı.
6. `content://` üzerinden Android depolama davranışı ve gerçek öğrenci pilotu henüz doğrulanmadı.
