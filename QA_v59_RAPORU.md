# Matematik Atlası v5.9 — Oyun Niteliği ve Tekrar Azaltma

## Ne yapıldı?
- Mevcut **3.885 görev korundu**; 100 görevde ikinci aşama, yalnız sayı girilen alıştırma yerine **beş ayrı gerçek etkileşim modeline** dönüştürüldü.
- **7. sınıf:** 20 kutu açınımı görevi — altı yüz kartı üzerinden çıkarılacak yüz ve kalan malzeme; 20 daire alanı görevi — aynı ölçekte iki daire modeli ve yarıçap değişimine bağlı alan farkı.
- **8. sınıf:** 20 karekök aralığı — sayı doğrusunun hangi yarısı ve matematiksel kanıt; 20 çizgi grafiği — iki dönem arası net değişim ve en büyük artış karşılaştırması; 20 bilye olasılığı — torbayı en az eklemeyle eşitleme.
- Öğrencinin ilk modelden ikinci etaba geçişinde **ortak doğrulama kapısı** etkinleştirildi. Genel cevap kontrolü doğrudan ilerleme yazamıyor; zorunlu ikinci model de doğru olmalı.
- İkinci etap tamamlanma kaydı `task-id@v59` sürümüyle tutuluyor. Eski `mathAtlas940Done` anahtarı ve eski tamamlanmış görevler korunuyor. Daha önce yapılmış görevler yapılmış sayılmaya devam eder.
- Yeni ipuçları **doğru sayısal cevabı erken söylemiyor**; işlem kuralını hatırlatıyor.
- Açık zemin, koyu yazılar, seçili kart durumları, uygun dokunma alanları ve mobil sayı doğrusu / grafik modelleri eklendi.
- **Öğretmen onayı yoktur.** Tüm yeni cevaplar otomatik kontrol edilir.

## Sayısal denetim
| Kontrol | Sonuç |
|---|---|
| Toplam görev | 3.885 |
| Güncellenen görev | 100 |
| Yeni etkileşim türü | 5 (her biri 20) |
| Birebir kopya metin grubu | 0 → 0 |
| 7–8. sınıfta 5+ yinelenen sayısal şablon grubu | 97 → 96 |
| İlerleme kayıt anahtarı | `mathAtlas940Done` değişmedi |
| Görev ID ve sıra eşitliği | 3.885/3.885 PASS |
| Python bağımsız matematik kontrolü | 100/100 PASS |
| Node söz dizimi kontrolü | Tüm JS dosyalarında PASS |
| Chromium üretim DOM bileşeni, boş çözüm reddi ve doğru çözüm kaydı | 100/100 PASS |
| Bütünleşik HTML mobil açılış | PASS, 390 px yatay taşma ve JS pageerror yok |
| Gerçek uygulama akışında seçilen 7. sınıf görevi | İlk çözüm ikinci doğrulama olmadan kaydetmedi; ikinci etapla tamamlandı |

## Önemli sınırlamalar
- Bu çalışmanın **önceliği sayı artırmak değil, 100 seçilmiş görevin etkileşimini değiştirmekti**. 7–8. sınıfta 96 yoğun sayısal kalıp grubu hâlâ bulunuyor. Bu grup sayısı, kalan hatalı görev sayısı değildir; editoryal inceleme göstergesidir.
- Önceki soru ve ana laboratuvar mekaniklerinin tamamı yenilenmedi; 100 görevde **ikinci aşamalar** özgünleştirildi. Bunların çoğunda ilk aşama hâlâ mevcut hesap modelini kullanır.
- Chromium testleri yazılımla yürütülmüştür. Üretim dosyası, yerel adres engeli nedeniyle **belleğe yüklenerek** sınandı. Gerçek sunucu, öğrencilerin gerçek cihazları ve çevrimdışı senaryolar denenmedi.
- Öğretmen paneli henüz farklı cihazlardan veri toplamaz; canlı sınıf ve ödev senkronizasyonu yapılmadı.
- 7. sınıf MYMM ve 8. sınıf geçiş müfredatı ilişkisinin öğretmen onayıyla son pedagojik denetimi yapılmadı.
- Daha önce aynı görev ID'sini tamamlayan öğrencilerin eski ilerlemesi korunur; yeni içerik tekrar zorunlu tutulmaz. İsteyen öğrenci görevini açıp yeniden çalışabilir.
- Canlı GitHub deposunda hiçbir değişiklik yapılmadı.

## Dosyalar
`ATLAS_TEK_DOSYA.html`: çevrimdışı tek HTML. `index.html`: modüler ana sayfa. `data/tasks.json` ve `data/tasks.js`: eşit veri. `tests/v59_modified_ids.json`: değişen 100 görev. `tests/QA_v59_BROWSER.json`: otomatik test kaydı. `tests/QA_v59_*.png`: gerçek Chromium ekran görüntüleri. `tests/TEKRAR_DENETIMI_SONRASI.json`: yinelenme istatistikleri.
