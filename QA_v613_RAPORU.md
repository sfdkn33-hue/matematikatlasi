# Matematik Atlası v6.13 — Deneme Kapsamı ve Hata Adımı / QA

24 Ekim 2026 · Çevrimdışı kontrollü prototip · Canlı GitHub değiştirilmedi.

## Kapsam ve kaynak bütünlüğü
- **4.037** görevin tamamı korunmuştur; `data/tasks.json` ve `data/tasks.js` v6.12 ile birebir aynıdır. ID'ler ve kazanım kodları değiştirilmemiştir.
- Ayrıntılı yanlış, ipucu, doğru ve ilk deneme kayıt kapsamı **296 → 471 görev** (+175); kazanım/kod **22 → 29** (+7).
- **v6.0 ana görevlerinin 100'ü ve v6.1 ana görevlerinin 75'i** deneme geçmişine bağlandı.
- Takip dağılımı: 5. sınıf 24, 6. sınıf 120, 7. sınıf 134, 8. sınıf 193.
- 471 görev, toplamın yaklaşık **%11,7**'si. Geri kalan **3.566** görev hâlâ aynı ayrıntılı ölçüm kapsamında değil.

## Öğrenme koçu yenilikleri
- Hata kayıtlarında doğrulayıcı ayırt edebiliyorsa **görsel/model kurma** veya **sayısal hesap** aşaması ayrı gösterilir.
- Bir pilotta yanlış cevap alanının etiketi bulunuyorsa *son yanlış alan* öğrencinin önüne çıkarılır. Bu bir **alt beceri/kavram yanılgısı teşhisi değildir**.
- v6.0/v6.1 gibi doğrulayıcıların ara aşamaları ayıramadığı durumlarda sistem yalnızca *çok adımlı çözüm* uyarısı verir, hangi kavramın yanlış anlaşıldığını tahmin etmez.
- Aynı kazanımdaki farklı soru ailesini önerme korunur; öneri tıklaması **tamamlama kaydı üretmez**.
- Mevcut `mathAtlas940Done` ve `mathAtlas64Attempts` anahtarları kullanılmaya devam eder. Eski bitirme kayıtları kalıcı öğrenme kanıtına dönüşmez.

## Gerçek kullanıcı akışlarıyla kontrollü Chromium testleri
- v6.0 katman etkinliği: boş çözüm **yanlış olarak kaydedildi**, ipucu kaydedildi, ardından doğru modelle **ilerleme ve deneme kaydı** oluştu. Yanlış sonrası doğru, ilk deneme başarısı sayılmadı.
- v6.1 cebirsel alan modeli: boş çözüm reddedildi, doğru hücrelerle tamamlandı; yanlış sonrası doğru ipucusuz ilk deneme sayılmadı.
- v6.1 hata sonrası aynı kazanımdan farklı soru ailesi önerisi oluştu.
- v6.10 maliyet modelinin yanlış seçimi `focus=model` kaydı oluşturdu; görev tamamlanmadı.
- Sınıfa göre toplam 471 etiketli görev ve 29 kazanım/kod hesaplandı.
- Eski tamamlanma işareti otomatik ustalık sonucu üretmedi.
- 390 px mobil görünümde yatay taşma ve JS çalışma zamanı hatası görülmedi.
- İlgili test verisi: `tests/QA_v613_BROWSER.json`, mobil görüntü `tests/QA_v613_PERSONALIZED_390.png`.
- Tüm yeni JS modülleri `node --check` sözdizimi kontrolünden geçti.
- **Sınırlama:** 471 görevin tamamı uçtan uca manuel/tarayıcıyla tek tek çözülmedi; matematik doğrulayıcılarının yeni entegre edilen türlerinden örnekler kontrol edildi.

## Teknik / pedagojik sınırlar
- Kişiselleştirme **kural tabanlıdır** ve yalnızca kayıt tutulan cihazda çalışır; öğrencinin gerçek kavram yanılgısı otomatik olarak kesin teşhis edilmez.
- 1/7/21 gün tekrar sisteminde aynı soru tekrarını kullanma ve cihaz saatine güvenme sınırlamaları sürüyor. Sunucu/öğretmen senkronizasyonu yok.
- Tam **130 kodun** alt becerileri resmî kaynaklardan bağımsız uzman incelemesiyle onaylanmış değildir.
- Kalan 3.566 görevde deneme geçmişi ve otomatik hata sınıflandırması kapsamı yok. Öğretmen onayı bulunmuyor.
- Gerçek Android `content://` depolaması ve cihazlar arası veri paylaşımı bu kontrollü test kapsamında değildir.
