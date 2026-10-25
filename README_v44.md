# Matematik Atlası v4.4 — Yazılı Merkezi ve Senaryo Denetleyicisi

- Korunan mevcut oyun görevi: **2.807** (oyun motorunda görevler değiştirilmedi).
- Yazılı bankası: **770 soru varyantı** (önceki 672, yeni 98).
- **25 adet seçilmiş 2026–2027 1. dönem MEB tablo senaryosu** dijital kotaya aktarıldı; 6. sınıf 1. yazılı için ülke genelindeki sınav kılavuzu bekleniyor.
- Sınıfa göre senaryo seçimi, kod-kota tablosu, eksik soru uyarısı, öğretmen onayı ve mevcut senaryo oluşturucuya aktarım.
- 8. sınıfta yeni resmî `M.8...` kodları kullanıldı; eski `ATLAS.8.2018...` kodlarına sahip sorular değiştirilmedi ve kendiliğinden MEB senaryosuna dahil edilmiyor.
- 5–8. sınıflara toplam 98 yeni **özgün parametrik pilot soru varyantı** eklendi. Birçoğu aynı mekanizmanın farklı sayısal değerleridir; bağımsız soru türü sayılmaz.
- **Dikkat:** PDF kaynaklarında görünmeyen senaryolar eklenmedi. Sayı kotasının karşılanması sorunun beceri, içerik, puanlama ve müfredat bakımından tam uyumu anlamına gelmez. Yayın öncesinde öğretmenlerin satır satır kontrolü şarttır.
- Tarayıcıdaki açık uçlu cevaplar öğretmen kontrolü olmadan otomatik tam puanlanmaz.
- Canlı GitHub değiştirilmedi.

## Resmî kaynaklar
- https://rize.meb.gov.tr/ksdt/temel-egitim/mat5.pdf
- https://rize.meb.gov.tr/ksdt/temel-egitim/mat6.pdf
- https://rize.meb.gov.tr/ksdt/temel-egitim/mat7.pdf
- https://rize.meb.gov.tr/ksdt/temel-egitim/mat8.pdf

## Teknik
- `YAZILI_MERKEZI.html`: bağımsız, internet gerektirmeyen yazılı merkezi.
- `ATLAS_TEK_DOSYA.html`: ana oyun ile entegre tek HTML.
- `MEB_2026_2027_SENARYO_AKTARIMI.json`: seçilmiş senaryoların denetlenebilir kota listesi.
- `tests/QA_v44.md`: test sonuçları ve kapsam sınırları.
