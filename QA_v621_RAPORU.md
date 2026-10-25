# Matematik Atlası v6.21 — Öğretmen Öğrenme İzleri ve 7. Sınıf Oran Koçu

**Tarih:** 25 Ekim 2026 · **Kaynak:** v6.20 · **Dağıtım:** yerel test paketi. **Canlı GitHub'a dokunulmadı.**

## 1. Yeni ürün kapsamı

- **4.037 ana görev** ve bunların bütün ID/kazanım ilişkileri korunmuştur. `data/tasks.json` ve `data/tasks.js` v6.20 ile **bayt bayt aynı** kalmıştır; mevcut kayıtlara toplu veri göçü yapılmamıştır.
- **7. sınıf oran-orantı laboratuvarındaki 75 görev** için hedefli, isteğe bağlı iki aşamalı mini çalışma (önce işlem planı, sonra sayı kanıtı) eklenmiştir. Temel 7 tür: **fark/kat, denk oran, birim oran, tablo, grafik, yüzde, tarif**. Bu 75 görev 75 farklı oyun motoru anlamına gelmez.
- Önceki **584** hedefli destekli göreve **75** eklendi; toplam **659/4.037** görev (yaklaşık **%16,3**) isteğe bağlı hedefli ek çalışma kapsamındadır.
- Oran-orantı doğrulayıcısı artık **yalnız tamamlanmış matematiksel denemeyi** hatalı kontrol olarak kaydeder: gerekli sayı/karar ve gerekçe seçimi dolu olmalıdır. Boş veya yarım modele sahte yanlış yazılmaz. Aynı cevabın arka arkaya kontrolü tekrarlanmış hata olarak sayılmaz. Geçerli ipucu eylemi de ayrı kaydedilir. Bunlar **yanıt alanı kanıtıdır, zihindeki kesin yanılgının tanısı değildir**.
- Mini çalışmanın tamamlanması `mathAtlas940Done` veya 1/7/21 gün tekrar başarısını **değiştirmez**; yardımcı sonuç `mathAtlas621RatioPractice` anahtarına ayrı ve sınırlı sayıda yazılır.

## 2. Öğrencinin kodlu öğrenme özeti

- Ana sayfada **“Öğrenme özetim”** paneli eklendi. Öğrenci yalnız **2–20 karakterli, isim olmayan bir kod** seçerek (örneğin A07) sınıf düzeyine ait bir **JSON dosyası** indirebilir.
- Özet, ilgili öğrenme çıktıları için **tamamlanmış görev sayısı** ile **son 30 gündeki gerçekten kayıtlı yanlış/ipucu/doğru olay sayılarının toplamını**, kayıtlı hatalı görev sayısını ve yalnız bilinen bazı hata alanı sayılarını taşır.
- **Öğrenci adı, serbest açıklama, tek tek yanıtlar, ham olay zaman çizelgesi ve IP gibi bilgiler dışa aktarılmaz.** Özetin doğruluk ve aidiyeti kimlik doğrulamayla ispatlanmaz; kullanıcı dosyayı kendi isteğiyle paylaşır. Veri otomatik gönderilmez.

## 3. Öğretmen sınıf öğrenme izleri (çevrimdışı pilot)

- `ogretmen.html` üzerinde öncelikli gösterilen **Sınıf Öğrenme İzleri** paneli: birden çok öğrenci özeti JSON dosyasını elle içe aktarma, 5–8. sınıfa ve kodlara göre filtreleme, öğrenme çıktısı bazında toplam tamamlama/yanlış/ipucu/öğrenci sayısı ve **CSV dışa aktarma**.
- Aynı kod ve sınıf için **son geçerli dosya** saklanır (eski tarihli özet yenisini ezemez); bir kod manuel silinebilir. En fazla **48 öğrenci kodu** aynı tarayıcıda tutulur.
- “Destek öner” sayımı yalnızca gözlenen son 30 günlük **en az iki yanlış kontrol** veya **en az iki ipucu** bulunan öğrenci–çıktı eşleşmesini gösterir. Bu **not, tanı, tam öğrenme veya öğrenci risk puanı değildir**.
- Öğretmen ekranına aktarılan bu kodlu özetler `mathAtlas621ClassSnapshots` anahtarında **bu tarayıcıda** saklanır ve **öğrencinin kendi tamamlanma/deneme kayıtlarına eklenmez**. Eski öğretmen cihaz-içi raporu da korunmuştur.
- Resmî öğrenci hesabı, kimlik doğrulama, okul ağına gönderim, arka planda senkronizasyon, öğretmen telefonu ile akıllı tahtayı uzaktan yönetme **yoktur**. Aynı kod farklı öğrencilerce seçilebilir; kimlik teyidi yapılmadığı için pilotu gerçek karne veya kişisel değerlendirme olarak kullanmamak gerekir.

## 4. Kontrol edilenler

| Denetim | Sonuç |
|---|---|
| Ana görev sayısı ve özgün ID'ler | **4.037 / 4.037 korundu** |
| Veri dosyalarının v6.20 ile bayt eşitliği | **2/2 eşit** |
| Yeni oran görevleri / mini ders eşleştirmesi | **75/75** |
| Oran mini örneklerinde bağımsız işlem sonucu denetimi | **75/75** |
| Oran oyun türü sayısı | **7** |
| Gerçek oran oyununda boş/yarım yanıt | Sahte yanlış kaydı oluşmadı |
| Değişmeyen yanlış cevaba tekrar basma | İkinci hata yazılmadı |
| Farklı iki tamamlanmış yanlış cevap | **2 yanlış**, destek kartı açıldı |
| Mini çalışma bitince ana görevin başarıya çevrilmemesi | Doğrulandı |
| Öğrenci kodlu özet JSON oluşturma ve indirme | Başarılı |
| Öğrenci özetinde kod/sınıf/çıktı ve hata alanı sayıları | Başarılı |
| Gerçek öğretmen sayfasında iki farklı öğrenci JSON içe aktarma | **2/2** |
| Sınıf filtresi ve CSV indirme | Başarılı |
| Geçersiz öğrenci kodlu dosyanın reddi | Başarılı |
| Öğretmen içe aktarmanın ana öğrenci ilerlemesine dokunmaması | Doğrulandı |
| 320, 390, 768, 1280 pikselde yatay taşma | Görülmedi (test edilen yeni akışlarda) |
| Kontrol edilen tarayıcı akışlarında JavaScript hatası | **0** |
| Öğretmen onayı gereken ana görev | **0** |

**Test yöntemi:** Tek HTML ve öğretmen sayfasının tüm yerel kaynakları ağ bağlantısız izole Chromium içine yüklenerek Playwright ile kontrol edildi. Yerel saklama yalnız test tarayıcısında geçici Map ile taklit edildi. Gerçek öğrenci aktarımı *örnek iki takma kodlu* veri ile yapıldı; hiçbir gerçek öğrenci verisi kullanılmadı. `tests/v621/qa_v621.py` ve `tests/v621/qa_results.json` dosyaları koşumun yöntemini ve bulguları içerir. Matematik hesaplarının 75 varyantı programatik olarak kontrol edildi; 75 görevin tüm olası öğrenci hamleleri veya MEB uyumu tek tek saha koşulunda sınanmadı.

## 5. Nasıl deneyebilirsiniz?

1. ZIP'i klasöre çıkarın ve `index.html` dosyasını açın (veya oyun için `MATEMATIK_ATLASI_v6_21_TEK_DOSYA.html` kopyasını deneyin).
2. Oyunda sınıf düzeyini seçin, **“Öğrenme özetim”** bölümüne öğrenci adı yerine kod (örneğin A07) girin, JSON indirin.
3. Öğretmen sayfasını aynı ZIP içindeki `ogretmen.html` ile açın. Üstteki **Sınıf Öğrenme İzleri** panelindeki **“Öğrenci özeti içe aktar”** alanıyla öğrenci JSON dosyalarını yükleyin. İsterseniz ayrı `OGRETMEN_PANELI_TEK_DOSYA.html` dosyasını da kullanabilirsiniz.
4. Sınıfı seçin, kazanım bazında gözlenen izleri inceleyin, **Sınıf CSV** indirin. Öğrencinin kodunu silmek için ilgili “Sil” düğmesini kullanın.
5. Veri kritikse kendi güvenli saklama ve izin prosedürlerinizi uygulayın. Bu pilotta kayıtlar yalnız tarayıcı depolamasındadır; tarayıcı verileri silinirse içe aktarılan sınıf özetleri kaybolabilir.

## 6. Sınırlar ve sıradaki işler

- Hiç yanlış kaydı olmayan öğrenci **konuyu tam öğrendi** sayılmaz; ilgili görevde hata ölçümü bulunmayabilir.
- 659 görevde **hedefli mini çalışma tanımı** vardır; bu sayı ayrıntılı hata teşhisi yapılabilen görev sayısı değildir.
- Ortak gerçek zaman penceresi yoktur: farklı tarihlerde üretilmiş öğrenci dosyaları her biri kendi son 30 günü kapsar.
- Öğrencilerin doğrulanan kimlikleri, MEB sistemlerine bağlantı, gerçek Android/akıllı tahta donanım testi, öğretmen telefonundan canlı tahta yönetimi, canlı ödev dağıtımı ve otomatik senkronizasyon **tamamlanmadı**.
- **Sonraki sürüm önceliği:** güvenli, rızaya dayalı öğrenci/sınıf kimliği ve senkronizasyon için gerçek mimari; ikinci aşamada öğretmen telefonuyla sınıf oturumu kontrolü. Kodlu dosya prototipi canlı çok cihazlı sistemin yerini tutmaz.
