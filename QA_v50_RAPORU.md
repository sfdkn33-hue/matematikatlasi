# Matematik Atlası v5.0 — Matematik, Teknik ve Görsel QA

## Doğrulanan
- 3.175 eski görevin ID/veri nesneleri birebir korundu; yeni 108 görev eklendi: **3.283**.
- 108 yeni modelin sonuçları Python ile bağımsız doğrulandı, yanlış/eksik model kapısı uygulamada engellendi.
- Chromium mobil: **108/108** doğru model ile tamamlanıp `mathAtlas940Done` anahtarına kaydedildi; boş model ve kestirme doğrulama reddedildi.
- Üç eski v4.9 laboratuvarının (6, 7, 8. sınıf) hâlâ görüntülendiği kontrol edildi.
- Mobil 390×844 ve masaüstü 1280×800 ölçülerinde yeni stüdyo açıldı, yatay taşma ve JavaScript `pageerror` yok.
- Beş seçili metin/zemin çifti WCAG AA 4,5:1 eşiğini karşıladı; bu **uygulamanın tümü için erişilebilirlik sertifikası değildir**.
- Telefon sınıf seçim ekranındaki 3+1 düğme yerleşimi 2×2 olacak şekilde düzeltildi.

## Sınırlar
- Otomatik test, Chromium bellek içi sayfa + izole yerel kayıt taklidi kullandı. Dağıtım alan adındaki gerçek depolama ve CDN davranışı ayrıca sınanmalıdır.
- Eski 3.175 görevin tümünde yeniden tarayıcı testi yapılmadı; yalnızca veri eşitliği ve örnek regresyon testi uygulandı.
- Sınıf içi öğrenci/öğretmen saha denemesi, gerçek cihaz çiftleri, çoklu eş zamanlı bağlantılar ve dağıtım testleri henüz yapılmadı.
- Program kapsamı ve pedagojik başarı için öğretmen değerlendirmesi gerekir.

## Ham sonuçlar
- `tests/QA_v50_STATIC.json`
- `tests/QA_v50_BROWSER.json`
- `tests/QA_v50_MATH_CONTRAST.json`
- `tests/QA_v50_DECIMAL_MOBIL.png`, `QA_v50_TRAPEZOID_MOBIL.png`, `QA_v50_ROOT_MOBIL.png`
