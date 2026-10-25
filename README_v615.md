# Matematik Atlası v6.15 — Eski Oyunlarda Gözlenen Yanlış ve İpucu Kayıtları

25 Ekim 2026 · Kontrollü çevrimdışı geliştirme

## İçerik
- 4.037 görev ve 130 kazanım/kod, eski ID'ler ve sıraları korunur; veri bankasına yeni soru eklenmedi.
- 471 görevdeki önceki ayrıntılı deneme ve alt aşama takibi aynı şekilde kalır.
- Eski ana uygulamadaki dokuz kontrol düğmesine ve sekiz ipucu düğmesine, gerçekten tıklanıp doğrulama yapıldığında olay kaydı bağlandı.
- Bilinen modelde yapılan yanlış deneme ile ipucu, **kullanıcı eylemi** olarak yerel `mathAtlas64Attempts` günlüğüne kaydedilir.
- Özellikle olasılık ve çarpanlar laboratuvarlarının merkezi geri bildirim kullanmayan iki yanlış kontrolü ayrıca bağlandı.
- İlk doğrulanmış tamamlama olaylarının (v6.14) kayıt davranışı korundu; var olmayan eski denemeler geriye dönük türetilmedi.
- Öğrenme panelinde eski laboratuvarların gözlenen yanlış/ipucu sayısı ayrı bir açıklamayla görünüyor.
- Önceki `mathAtlas940Done` ve diğer kayıt anahtarları korunur; yedekleme ve kayıt başarısızlığı uyarısı korunur.

## Pedagojik sınır
Bu yeni olaylar **kesin kavram yanılgısı veya ilk denemede ipucusuz başarı teşhisi değildir.** Eski özel laboratuvarların tamamı hâlâ yanlış ve ipucunu eksiksiz aktarmıyor. İstatistikler yalnız gözlenmiş olaylar için geçerlidir; bir olay kaydı bulunmaması öğrencinin hatasız olduğu anlamına gelmez. Öğretmen onayı yoktur.

## QA
- 13/13 ana tarayıcı senaryosu başarılı (Chromium, mobil 390 piksel).
- 10/10 regresyon ve veri karşılaştırması başarılı (Chromium, 320 piksel).
- 3/3 ilave olasılık/çarpan laboratuvarı senaryosu başarılı.
- Bağımsız JavaScript sözdizimi kontrolü başarılı.
- Ana uygulamadaki görevler kayıtlara geçiyor; sahada Android ve çoklu cihaz testi hâlâ gerekli.
- Test HTML'sine yerleştirilen sahte localStorage, teslim edilen dosyalara **eklenmemiştir**.

## Açma
`index.html` kaynak paketinin modüler başlangıcıdır. `ATLAS_TEK_DOSYA.html`, tarayıcıda tek dosya olarak denenebilir; yerel Android `content://` adresinde kayıtlar güvenilir olmayabilir. Çocuklar ve öğretmenler için bir HTTPS sunucusunda gerçek cihaz testi önerilir. Canlı GitHub değiştirilmedi.
