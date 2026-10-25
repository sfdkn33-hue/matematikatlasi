# Matematik Atlası v6.1 — Teknik ve Pedagojik Kalite Denetimi

**24 Ekim 2026 • Çalışma sürümü**

| Kontrol | Sonuç |
|---|---|
| Toplam aktif görev | 3.885 |
| Yeniden tasarlanan ana görev | 75 (7. sınıf 30, 8. sınıf 45) |
| Ana görev etkileşim biçimi | 15 ayrı alt mekanik |
| Görev ID dizisi, v6.0 ile karşılaştırma | 3.885/3.885 aynı sırada |
| Değiştirilmeyen görev nesnesi | 3.810/3.810 birebir aynı |
| Yeni etkileşim, doğru cevapla tamamlanma | **75/75 PASS** |
| Her ailede bir boş cevap denemesi | **5/5 reddedildi** |
| Hatalı fakat dolu cevap örneklemi | **Mobil ve masaüstü 2/2 reddedildi** |
| Önceki sürümden ilerleme kaydı | Mobil ve masaüstü korundu |
| 390×844 ve 1280×800 CSS/JS testi | Yatay taşma yok; `pageerror` yok |
| Genel öğretmen-onayına ihtiyaç | Yeni 75 görevde yok |
| `legacyAnswer` görünürlüğü | Yeni görevlerde kapalı |

## Yapılan gerçek test

İzole Chromium oturumunda, tam sayfa HTML bellek içi yüklendi ve tarayıcıya `localStorage` taklidi sağlandı. Öğrenci arayüzünden görev ve tema geçişleri, 75 görevin doğru model ile çözülmesi, otomatik tamamlanma anahtarının kontrolü, boş modellerin ve hatalı dolu modellerin reddi denendi. Her sınıf için ilgili öğrenme çıktısı/kazanım kodu tutuldu. DOM/JS `pageerror` izleme yapıldı. Mobil ekran ve masaüstü koyu tema görüntüleri kaydedildi.

## Tekrar ölçümü

Aynı basit metin-normalleştirme tekniğiyle (sayılar `#` simgesine dönüştürülür, küçük harfe çevrilir; 7–8. sınıflar):

| Gösterge | v6.0 | v6.1 |
|---|---:|---:|
| En az beş görev içeren benzer metin grubu | 91 | **84** |
| Bu gruplardaki toplam görev | 828 | **773** |

Bu ölçüm yalnız **yazı şablonlarının benzerliğine ilişkin uyarı** verir; tam pedagojik eşdeğerlik veya başarı ölçüsü değildir. v6.0 raporundaki 88 grup sayısıyla birebir karşılaştırılmamalıdır; normalleştirme yöntemi aynı değildir.

## Kontrast

Yeni ana metin `#17384b` ile yüzey `#f3f9fc` için matematiksel kontrast yaklaşık **11,6:1**'dir. Yeni grafik etiketi/yüzey çifti yaklaşık **11,0:1**'dir. Ancak bütün eski panellerin WCAG taraması bu turda tamamlanmadı.

## Sınırlamalar ve sonraki öneri

1. Bu sürümde bütün eski görevlerin uçtan uca tekrar testi yapılmadı. Değişmeyen nesneler kaynak karşılaştırmasıyla korundu.
2. Yeni 75 görevin birçoğunda ortak etkileşim kalıplarının beşer ayrı modeli var. Özellikle başka kalan tekrar kümeleri pedagojik editör incelemesi bekliyor.
3. Saha kullanımı, gerçek fiziksel akıllı tahta, öğrencilerin telefonları, iOS Safari, gerçek sunucu kayıt sistemi test edilmedi.
4. LGS sorularının biçim ve zorluk açısından resmî sınava denkliği doğrulanmış değildir.

**Canlı GitHub deposuna herhangi bir yükleme yapılmadı.**
