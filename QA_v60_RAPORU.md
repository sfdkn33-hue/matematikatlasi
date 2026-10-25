# Matematik Atlası v6.0 — Geliştirme ve kalite raporu

**Temel:** v5.9 (3.885 görev). **Hedef:** Sayıları değiştirerek aynı soruyu tekrarlamayı azaltmak; seçilen görevlerde ana oyun mekaniklerini yeniden kurmak.

## Yapılan değişiklikler

| Sınıf ve tema | Gerçek ana etkinliği değiştirilen görev | Yeni kararlar |
|---|---:|---|
| 7 — Birim küp ve katman | 20 | Kat kurma, kat çıkarma, kat ekleme, farklı tabana çevirme, başka yönden inşa etme |
| 7 — Hacim tasarımı | 20 | Hedef hacim, iki kat hacim, tek/çift taban kenarı değiştirme |
| 8 — Aralarında asal sayılar | 20 | EBOB kontrolü, en küçük artışı bulma, komşu çift, iki sayıyı dönüştürme |
| 8 — Basamaklar / 10'un kuvvetleri | 20 | Tam eşleştirme, yanlış üs avı, tek basamak analizi, ×10, ÷10 |
| 8 — Karekök sayı doğrusu | 20 | Aralık, orta nokta, en yakın tam sayı, en küçük örten kare, sığan en büyük kare |
| **Toplam** | **100** | **25 alt görev biçimi** |

**Koruma:** 3.885/3.885 görev kimliği ve sırası aynı. Değiştirilmeyen 3.785 görev nesnesi birebir aynı. Güncellenen görevlerin eski ana modelleri `atlas60_legacy` içinde korunuyor. `mathAtlas940Done` anahtarı değişmedi.

## Otomatik kontroller
- Bağımsız Python matematiksel model kontrolü: **100/100 başarılı** (küp hacmi, hedef hacim, EBOB, basamak kuvvetleri, karekök sınırları).
- İzole Chromium görev tamamlama: **100/100 başarılı** (önce boş model kabul edilmedi; sonra doğru model tamamlanıp kayıt oluşturdu).
- Normal kullanıcı yolu üzerinden görev sayfası görünürlüğü: **390 px mobil ve 1.280 px masaüstü başarılı**.
- Bu ekranlarda yatay taşma ve `pageerror`: **görülmedi**.
- Yeni JS ve tüm var olan JS dosyaları sözdizimi kontrolü: **geçti**.
- Görev JSON/JS eşitlemesi ve tek HTML derlemesi: **yapıldı**.
- Önceki 7–8. sınıf ≥5 örnekli benzer sayısal metin grupları (aynı otomatik normalleştirme): **93 → 88** (7. sınıf 55→53; 8. sınıf 38→35).
- Birebir aynı tam soru metni: **0 fazla kopya**.

## Bilinen sınırlar
1. **88 yoğun sayısal kalıp grubu** kaldı; bu sürüm tam pedagojik yeniden yazım değildir.
2. İzole testte `localStorage` benzetimi kullanıldı. Gerçek öğrenci cihazlarında kayıt, tarayıcı profili geçişi, mobil Safari ve çevrimdışı işleyiş test edilmedi.
3. Bazı eski ekranların renk ve kontrast denetimi sürüyor; yeni ana laboratuvar açık zemin ve koyu metinle yeniden tasarlandı.
4. Eski 3.785 görevin hepsi yeniden oynanmadı; değişmeyen JSON nesnelerinin birebir eşitliği test edildi.
5. Çok kullanıcı destekli ödev, öğretmen raporlama ve akıllı tahta–telefon senkronizasyonu henüz mevcut değil.
6. Yeni soruların sınıfta pedagojik ve LGS güçlük kalibrasyonu yapılmadı.

**Canlı GitHub'a dokunulmadı.**

## Ek negatif ve sürüm geçişi testleri
- Beş ana mekanik ailesinden seçilmiş birer görevde **yanlış ama dolu cevap** ilerleme oluşturmadı: **5/5**.
- Önceden tamamlanmış görevin `mathAtlas940Done` kaydı sürüm açılışında silinmedi: **PASS**.
- Kaynak test: `tests/QA_v60_NEGATIVE.json`.
