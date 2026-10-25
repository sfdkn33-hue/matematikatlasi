# Matematik Atlası v5.8 — Tekrar Onarımı ve Kalite Kontrolü

## Özet

- 3.885 görev, aynı kimlikler ve aynı sırayla korundu. Sınıf dağılımı: 5: 955, 6: 1262, 7: 859, 8: 809.
- Önceki denetimde görülen **43 birebir soru metni grubu / 176 fazladan metin kopyası → 0**.
- Aynı soru ve aynı modelle bulunan **41 fazladan model kopyası → 0** (sayısal model de değişti).
- **219 görev metni**, veri/modelle ilişkili özgün yönerge hâline getirildi. **323 öğrenci görevine**, matematiksel olarak hesaplanan ve otomatik doğrulanan ek bir muhakeme aşaması bağlandı.
- Yanlış eşitlik/eşitsizlik ipucu bulunan **4 görevin açıklaması** düzeltildi.
- **200 eski `teacher_review_required` işareti** kaldırıldı; öğrenciye öğretmen onayı gerekmez.

## Veri ve teknik onarımlar

- `data/tasks.js` ve `data/tasks.json` aynı 3.885 görevi içeriyor; eski JSON dosyasındaki 32 görev eksiği kapatıldı.
- `data/summary.json` v5.8 ve güncel sınıf sayılarına göre senkronlandı.
- Tek HTML'nin içindeki veriler modüler dosyalarla aynı; ayrı dağıtımlar arasında kimlik sırası eşit.
- LGS sınav penceresi gizlenen `main` dışına taşındı. Standart **20** ve zorlayıcı **8** soru modları kullanıcı seçimiyle açılıyor; mod değiştirmek sınavı yeniden başlatıyor.
- Öğretmen ekranı sınıf filtrelerine **7 ve 8** eklendi. Bu panelin hâlâ *yalnızca aynı cihazdaki tarayıcı verisini* gösterdiği açıkça yazıldı; gerçek öğrencilerin cihazlarından senkronize kayıt mevcut değil.

## Otomatik kontroller

- Python veri karşılaştırması: **3.885/3.885 eski görev ID'si ve görev sırası korundu**.
- Tekrar denetimi: **0 birebir metin grubu**, **0 metin+model kopya grubu**; ayrıca güncel JSON/HTML eşitliği doğrulandı.
- Düzenlenen alan/kök/özdeşlik modelleri için bağımsız aritmetik kontrolleri uygulandı.
- JS sözdizimi kontrolleri geçti.
- İzole Chromium bileşen testinde LGS modalı **390px** genişlikte açıldı; zor mod seçiminde **8 soru**, normal modda **20 soru** listelendi.
- Üç ek düşünme türü (karşılaştırma, yanlış modeli teşhis, adımları sıralama) üretimde kullanılan aynı JS ile doğru cevapta tamamlandı. Boş başlangıçta tamamlanma kapısı açılmadı. Testlerde JS çalışma hatası çıkmadı.

## Sınırlar ve kalan işler

- **Sayısal şablon benzerliği bitmedi:** 7–8. sınıfta en az beş kez kullanılan 97 aynı şablon grubu hâlâ var. Bunlar birebir aynı soru değil, fakat pedagojik çeşitlilik açısından her biri öğretmen incelemesi gerektirir.
- Bazı mevcut oyun mekaniklerinin çekirdeği aynı kaldı. 323 görevde ikinci, farklı muhakeme eklenmiş olsa da bu, 323 tamamen yeni oyun mekaniği anlamına **gelmez**.
- Yeni sayısal çözüm modeli 41 görevde kontrol edildi; eski 3.885 görevin tamamı gerçek öğrencilerle uçtan uca oynanmadı.
- İzole Chromium bileşen testi **gerçek cihaz / canlı GitHub Pages / sunucu senkron / çok kullanıcılı sınıf testi değildir**. Öğretmen panelinde henüz ödev paylaşma ve uzaktan takip yoktur.
- Mevcut `mathAtlas940Done` öğrenci kayıt anahtarı bozulmaz. Daha önce bitirilmiş bir görevin içeriği yenilense de o görev tamamlandı sayılmaya devam eder; gelecekte isteğe bağlı *yeni içerikleri yeniden dene* işaretleri eklenebilir.

**Canlı GitHub deposuna dokunulmadı.** Bu paket test ve gözden geçirme içindir.
