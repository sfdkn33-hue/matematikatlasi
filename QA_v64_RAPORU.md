# Matematik Atlası v6.4 — Kalıcı Öğrenme Takibi / QA

Tarih: 24 Ekim 2026 · İçerik kaynağı: v6.3.

## Doğrulanan kapsam
- Toplam **3.945 görev**. v6.3 içindeki **3.921 görev nesnesi ve görev kimliği değişmedi**. Yeni +24 görev: 5. sınıf `MAT.5.6.1` (12), 8. sınıf `M.8.2.2.6` (12).
- Sınıf dağılımı: 5. sınıf 967, 6. sınıf 1274, 7. sınıf 871, 8. sınıf 833.
- 130 kodun tamamında görev var: 129 resmî kod + 1 ayrı Atlas pilot kodu. Bu tam öğrenme veya tüm süreç bileşenlerinin karşılandığı anlamına gelmez.
- v6.3'ün 36 görevi korunarak **60 etiketli/otomatik denetimli pilot** elde edildi. Etiketlerin pedagojik uzman denetimi bekleniyor.
- `mathAtlas940Done` anahtarındaki eski ilerlemeye müdahale edilmedi; 1/7/21 günlük deneme izleri yalnızca yeni `mathAtlas64Attempts` anahtarında, aynı cihazda saklanıyor.
- Öğretmen onayı bulunmuyor. Çözümler matematiksel alanlar üzerinden otomatik doğrulanıyor.

## Gerçekleştirilen testler
- v6.4 yeni görevler: **24/24** boş yanıt → ret; dolu fakat yanlış yanıt → ret; doğru yanıt → kayıt; eski genel cevap kutusuyla geçiş → ret.
- v6.3 pilot regresyonu: **36/36** doğru cevap kabulü ve tüm dolu yanlış cevapları reddetme.
- Eski bir tamamlanma kaydının korunduğu doğrulandı.
- Girişim telemetrisi: Yeni 24 görevde doğrulama sonrası olaylar tutarlı; önce yanlış ardından doğru yanıt **ilk deneme başarısı sayılmadı**.
- Aralıklı tekrar algoritması: 1., 7. ve 21. gün, erken tekrar, yanlış deneme sonrası tekrar ve üçüncü aşama tarihleri kontrollü saat senaryosuyla sınandı: {'before': 'scheduled', 'due1': 'due', 'wrongReviewSteps': 0, 'stage1': 1, 'due7': 'due', 'stage3': 'complete', 'allStages': 3}.
- Öğrenme panelinin açılması, sınıf filtresi, kazanım listesi, görev bağlantısı, mobil ekran ve masaüstü ekranı denetlendi.
- 390 px mobil / 1280 px masaüstünde yatay sayfa taşması olmadı; test edilen akışlarda JS hatası olmadı.
- Kanıt: `tests/QA_v64_BROWSER.json`, `tests/QA_v63_BROWSER.json`, `tests/QA_v64_DASHBOARD_MOBILE.png`, `tests/QA_v64_DASHBOARD_DESKTOP.png`.

## Önemli sınırlar
1. **3.885 eski görevin tamamında deneme telemetrisi yok.** Yalnızca v6.3/v6.4 kapsamında etiketlenmiş 60 yeni görevde doğrulayıcı bağlantısı bulunuyor.
2. 1./7./21. gün tekrarları, aynı sorunun yeniden çözülmesiyle takip edilir; henüz yeni sayısal versiyonlarla gerçek transfer testi yok. Bu nedenle “tam öğrendi” etiketi kullanılmaz, **üç aşamalı aralıklı tekrar bitişi** şeklinde gösterilir.
3. Tekrar aşaması ancak belirtilen tarihten sonra **ilk denemede ipucusuz doğru** çözümle ilerler; bu da bir pedagojik tasarım kuralıdır, gerçek öğrenme ölçümüyle henüz kalibre edilmemiştir.
4. Kayıt yalnızca o tarayıcıdaki localStorage'dadır. Diğer öğrenci cihazlarıyla öğretmen paneline aktarım, kullanıcı kimliği, sunucu güvenliği ve gerçek sınıf pilotu mevcut değildir.
5. Cevap anahtarları istemci tarafında bulunur; güvenli sınav uygulaması değildir.
6. 24 yeni görev çeşitli soru yaklaşımları içerir, **24 ayrı oyun mekaniği** oluşturulduğu iddia edilmez. 5. sınıf görsellerindeki şema doğrudan cevap açıklamaz.
7. Eski 3.885 görevin tamamı bu turda yeniden oynanmadı. Resmî kazanımların alt süreç eşleşmeleri tek tek uzman gözetiminde doğrulanmadı.
8. Yerel dosya/site adresleri tarayıcı politikasıyla engellendiği için testler, aynı kaynakların birleştirildiği HTML'nin izole Chromium sayfasına yüklenmesiyle yapıldı.

## Sonraki işler
- 130 kod için kazanımın resmî alt becerilerini uzman denetimli işaretleme.
- 3.885 eski görevin alt beceri ve gerçek çözüm yollarına göre sınıflandırılması.
- 1/7/21 gün hatırlatma görevlerinde aynı soruyu tekrar etmek yerine yeni bağlam ve farklı sayı değerleri kullanarak kalıcı öğrenmeyi ölçme.
- Gerçek sınıf, telefon ve akıllı tahta üzerinde uçtan uca kullanıcı testleri.
