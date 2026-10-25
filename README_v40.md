# Matematik Atlası v4.0 — Oran & Orantı Laboratuvarı

## Kullanım
- İnternetsiz kullanım: `ATLAS_TEK_DOSYA.html` dosyasını Chrome/Chromium'da aç.
- Modüler kullanım: `index.html`, `assets/` ve `data/` klasörlerini birlikte kullan.
- Canlı GitHub'daki dosyalara dokunulmadı. Bu bir test/staging paketidir.

## Yeni 7. sınıf bölümü
- [Resmî MEB programı](https://tymm.meb.gov.tr/ortaokul-matematik-dersi/unite/464): Sayılar ve Nicelikler (2), **15 ders saati**, MAT.7.1.5–MAT.7.1.7.
- **90 yeni görev**: her öğrenme çıktısı için 30 görev.
- **8 oyun mekaniği**: Fark mı Oran mı (10), Denk Oran Fabrikası (10), Birim Oran Dedektifi (10), Orantı Tablosu (15), Grafik Dedektifi (15), Çift Sayı Doğrusu (10), Yüzde Atölyesi (10), Tarif Laboratuvarı (10).
- Doğru/yanlış kararları ve seçilen gerekçeler ayrı değerlendirilir; yalnızca doğru sayı seçimi yeterli olmaz.
- Matematiksel modellerde kontrol çapraz çarpım yerine oran karşılaştırması ve çarpımsal ölçekleme anlayışını da destekleyecek şekilde tasarlandı.

## Eski veri korunumu
- Önceki **2.559 görevin tamamının sırası, içeriği ve ID'si** SHA-256 karşılaştırmasıyla değişmeden korundu. Manifest: `data/v39_task_manifest.json`.
- Genel toplam **2.649 görev**: 5. sınıf 955, 6. sınıf 1.190, 7. sınıf 489, 8–12. sınıfların toplamında 15 pilot.
- 7. sınıfın 30 resmî öğrenme çıktısından **19'u için oyun** var, 11'i geliştirme haritasında bekliyor.
- Öğrenci ilerlemesi için önceki `mathAtlas940Done` anahtarı kullanılmaya devam edilir. Ancak tarayıcıda dosyanın açıldığı adres/köken değişirse önceki kayıtlar otomatik taşınmayabilir.

## QA kapsamı
- 90 yeni görevin yapılandırılmış matematiksel yanıtları bağımsız formüllerle ve eski görev karmasıyla denetlendi.
- 390 piksel mobil Chromium'da sekiz yeni oyun türünde boş cevap ve eksik gerekçe reddedildi, doğru çözüm kaydedildi.
- Eski öğrenci ilerleme kaydı ve diğer yedi sınıfa geri dönüş mobil testte korundu.
- Geniş birleşik masaüstü tarayıcı testi süre sınırına takıldı; masaüstü başarı iddia edilmez.
- 90 yeni görevin tamamı tek tek tarayıcıda otomatik çözülmedi, her mekanik türünden birer örnek test edildi. Sınıf içi pedagojik test henüz yapılmadı.
- Gerçek veri toplama, kişisel öğrenci kaydı sunucuya aktarımı ve sınıflar arası senkronizasyon yoktur.
