# Matematik Atlası v6.0 — Ana Etkinliklerin Yeniden Tasarımı

Bu sürüm, v5.9 üzerinden yapılan yerel geliştirmedir. Canlı GitHub'a hiçbir değişiklik yapılmadı.

## Ne değişti?
- **3.885 görevin kimlikleri, sıraları ve mevcut ilerleme kayıt anahtarı** korunmuştur.
- **100 görevde (7. sınıf 40 / 8. sınıf 60)** eski ana hesap modeli yerine yeni ana görev eklendi. Eski modeller `atlas60_legacy` altında geri dönüş için saklandı, ancak öğrenci ekranında kullanılmıyor.
- 5 laboratuvar ailesi: (1) Küp katmanlarını kurma / çıkarma / döndürme, (2) hedef hacim ve taban değişiklikleri, (3) aralarında asallık ve en küçük artırma, (4) basamak kuvveti, hata avı ve onla ölçekleme, (5) karekök aralığı, orta nokta, yakın tam sayı ve kare kaplama.
- Her ailede 5 ayrı matematiksel karar biçimi vardır (toplam 25 görev alt biçimi); her biçimde dört farklı sayısal örnek vardır.
- Görev doğrulaması, yeni ana laboratuvardaki bütün seçimler ve girişler doğru olmadan çalışmaz. **Öğretmen onayı yoktur.**
- `data/tasks.json` ve `data/tasks.js` eşit içerik temelinden yeniden oluşturuldu; `ATLAS_TEK_DOSYA.html` modüler `index.html` ile aynı JS/CSS verilerini içerir.

## Önemli sınırlar
- Eski görevlerdeki geçmiş tamamlanma işaretleri silinmez. Daha önce tamamlanmış 100 görev öğrenciye yeniden zorunlu tutulmaz.
- 7–8. sınıfta sayısal şablonlarda yüksek tekrar hâlâ var: normalleştirilmiş metinde ≥5 görevli kümeler, seçili denetimde 93'ten 88'e indi. Bu ölçü **pedagojik yeterliliğin tek ölçüsü değildir**; başka bir normalleştirme aynı kümeleri farklı sayabilir.
- Testler izole Chromium'da yapıldı; gerçek GitHub Pages, cihazlar arası senkron, öğretmen paneli ve saha pilotu test edilmedi.
- Sayısal alanlar otomatik doğrulanır; sözel gerekçe otomatik puanlanmaz.

## Nasıl açılır?
`ATLAS_TEK_DOSYA.html` dosyasını bir tarayıcıda açın. Bu uygulamanın çevrimdışı önizlemesidir. Modüler web dağıtımı için `index.html` ve `assets/`, `data/` klasörlerinin tamamı birlikte tutulmalıdır.

## Testler
`tests/QA_v60_BROWSER.json`: 100 yeni ana görevde boş model reddi, doğru çözüme kabul ve ilerleme kaydı. `tests/QA_v60_VISIBLE_390.png` ve `tests/QA_v60_VISIBLE_1280.png`: gerçek görev ekranı görüntüleri. `tests/v60_main_redesigned_ids.json`: yenilenen tam 100 kimlik.
