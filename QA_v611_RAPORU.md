# Matematik Atlası v6.11 — Pedagojik çeşitlilik ve QA raporu

**24 Ekim 2026 · test ortamı.** Canlı GitHub veya mevcut canlı dağıtım değiştirilmedi.

## Sürüm kapsamı

- **Toplam görev:** 4.037 (yeni görev eklenmedi).
- **Yenilenen:** 48 ana görev; dört kazanımda on ikişer görev.
- **Değişmeyen:** 3.989 görev veri nesnesi. Eski 4.037 görev ID'si sırasıyla aynı.
- **Geliştirilen:** 12 soru ailesi; çember uzaklığı, bilye dengeleme, çark renklendirme, iddia analizi, daire dilimi sürgüsü, dilim boyama, alan oranı, tam kare çarpan seçimi, doğru radikal eşitlik, kök içine alma gibi etkinlikler. 12 ayrı oyun motoru değildir.
- **Ayrıntılı cihaz-içi deneme geçmişi desteği:** önceki 248 + 48 = **296 görev**. Diğer görevler için tam deneme geçmişi henüz mevcut değil.

## Kod/veri koruma

- v6.10 karşılaştırmasında değişen görev nesnesi: 48; aynı kalan: 3.989.
- `mathAtlas940Done` ilerleme anahtarı değişmedi; önceki tamamlanma işaretleri korunur. Eski başarı işareti, yenilenmiş etkinliğin bağımsız olarak başarıldığı kanıtı değildir.
- Eski görsel laboratuvar/ikinci aşama bağlantıları yalnızca yenilenen ilgili görevlerde kaldırıldı; diğer görevler korunmuştur.
- `data/tasks.json`, `data/tasks.js` ve tek dosya günceldir.

## Tam uygulama içinde tarayıcı testi

| Senaryo | Sonuç |
|---|---|
| Yeni etkinliğin görev seçildikten sonra görünmesi | 48/48 |
| Boş model / boş yanıtın reddedilmesi | 48/48 |
| Yalnız sayısal sonuçla tamamlamanın engellenmesi | 48/48 |
| Yalnız doğru modelle tamamlamanın engellenmesi | 48/48 |
| Model doğruyken yanlış sayıların reddi | 48/48 |
| Model ve sayı doğruyken ilerleme kaydı | 48/48 |
| Ayrıntılı `correct` olay kaydı | 48/48 |
| Eski genel cevap düğmesinden atlama | Engellendi |
| Depolama kapatıldığında sahte kayıt oluşmaması | Doğrulandı |
| Depolama hatası uyarısı | Görüntülendi |
| Daha önceki bir 5. sınıf görevinin kaydını koruma | Doğrulandı |
| 320 / 390 / 768 / 1280 px yatay taşma | Görülmedi |
| JavaScript sayfa hatası | 0 |

Bağımsız Python matematik denetimi: **48/48** model hedefi ve sayısal sonuç doğrulandı. Ancak bu, uygulamanın önceki diğer 3.989 görevinin her birinin doğrulandığı anlamına gelmez.

## Dört kazanımda sayıları maskeleyerek metin eşleştirme

| Kazanım | Toplam görev | Önce fazladan kalıp | Sonra fazladan kalıp |
|---|---:|---:|---:|
| MAT.5.3.7 | 32 | 23 | 20 |
| MAT.7.7.2 | 30 | 27 | 25 |
| MAT.7.4.8 | 28 | 24 | 22 |
| M.8.1.3.3 | 20 | 19 | 16 |

Bu otomatik **metin benzerliği** ölçüsüdür. Birbiriyle aynı metin kalıbında görünen görevler farklı görsel modeller kullanabilir; aynı beceriyi pekiştiren bazı tekrarlar yararlıdır. Tam pedagojik yeterlilik kararı bu sayıdan çıkarılamaz.

## Henüz çözülmeyen eksikler

1. Uygulamanın tüm 130 kazanım/kod altında süreç bileşenleri ve alt becerileri uzman incelemesiyle tamamlanmış değil.
2. Öğretmenler farklı öğrencilerin cihazlarından ödev/başarı verilerini henüz tek panelde toplayamıyor.
3. Gerçek Android `content://download` bağlamında `localStorage` güvenilirliği ve farklı cihazlarla sınıf pilotu ayrıca test edilmeli.
4. Daire dilimi ve köklü ifadelerdeki yeni modeller hâlâ temel sürgü/dilim/seçim mekaniklerini paylaşıyor; gerçek fiziksel sürükle-bırak çeşitliliği artırılabilir.
5. Görev kimlikleri korunduğu için önceki tamamlanma işaretlerinden yeni görevde ustalık sonucuna gidilemez.
6. Matematik denetimi 48 yenilenen görevle sınırlıdır; kalanların tamamında doğruluk ve erişilebilirlik denetimi yapılmadı.

Kanıtlar `tests/QA_V611_BROWSER.json`, `tests/MATEMATIK_DENETIM_v611.json` ve mobil ekran görüntülerinde.
