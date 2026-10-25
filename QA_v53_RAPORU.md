# MATEMATİK ATLASI v5.3 — BAĞIMSIZ QA RAPORU

## Kaynak ve sınır
- Temel: v5.2 ZIP kaynak paketi. Canlı GitHub'a dokunulmadı.
- Öğrenim: 2026–2027'de 8. sınıf için kullanılan 2018 Matematik öğretim programındaki cebir kazanımları.
- Resmî kazanımlar: M.8.2.1.1, M.8.2.1.2, M.8.2.1.3, M.8.2.1.4. 20'şer pilot görev.
- MEB programı: https://mufredat.meb.gov.tr/Dosyalar/201813017165445-MATEMAT%C4%B0K%20%C3%96%C4%9ERET%C4%B0M%20PROGRAMI%202018v.pdf

## Doğrulananlar
- v5.2'deki 3.471 eski görevin bütün JSON kayıtları ve sırası birebir korundu.
- 80 yeni benzersiz kimlik ve görev eklendi; toplam 3.551 görev; 8. sınıfta 555.
- 8. sınıfta 52 kazanımın 27'sinde en az bir pilot oyun var. Bu tam müfredat kapsamı değildir.
- 80 yeni matematik modelinin cebirsel doğruluğu SymPy ile bağımsız denetlendi; 80/80 başarılı.
- 390×844 Chromium'da 80/80 görev kullanıcı arayüzünden doğru yanıtla tamamlandı; yerel test veri deposundaki `mathAtlas940Done` anahtarında 80 ilerleme kaydı doğrulandı.
- Her dört görev türünün ilk örneğinde boş modelle ilerleme reddedildi; genel cevap alanından model atlama engellendi.
- Mobil testte `pageerror` 0; yatay taşma 0 px. 1280×800 masaüstünde dört örnek ekran açıldı; yatay taşma 0.
- Yeni açık tema renkleri koyu tema altında da açık zemin/koyu yazı olarak kaldı; yeni bileşenlerin dokunma hedefleri ve odak çerçevesi iyileştirildi.
- Eski `YAZILI_MERKEZI.html`, `data/yazili_havuzu_v46.json`, `data/lgs_v46_20_orijinal.json` ve `8_SINIF_52_KAZANIM_HARITASI.html` dosyalarının baytları aynı kaldı.
- 8. sınıf oyun haritasındaki mevcut 52 kazanımdan 4 cebir kazanımının pilot durumları 20 görev olarak güncellendi.

## Uygulama ve test ortamı
- Chromium, dosya/yerel HTTP adresine gitmeyi engellediği için bağımsız tek HTML `page.set_content` ile bellekte açıldı.
- `localStorage` erişimini engelleyen `about:blank` test kökeninde bellek içi taklit kullanıldı; bu gerçek site alan adı geçişinde kalıcı depolamayı doğrulamaz.
- Matematiksel kontrollerin her biri gerçek arayüz doğrulamasına bağlıdır; yalnızca `answer=1` yazarak atlama engellenir.
- Sunuculu çok cihazlı senkron, öğretmen–öğrenci oturumu, ödev takibi ve ücretli erişim henüz uygulanmadı.
- Eski 3.471 görevin tamamı bu sürümde tek tek yeniden oynanmadı. Tüm eski panellerin WCAG erişilebilirlik denetimi henüz tamamlanmadı.
- Pilot içerikler öğrencilerle öğretmen gözetiminde denenmeli. Görevlerin zorluk, beceri türü ve tekrar derecesi sınıf pilotundan sonra kalibre edilmeli.

## Kanıt dosyaları
- `tests/QA_v53_STATIC.json` — eşitlik, benzersiz kimlik, 80 matematik kontrolü, korunmuş kritik dosyalar.
- `tests/QA_v53_BROWSER.json` — 80 etkileşim, kayıt ve hata sonuçları.
- `tests/QA_v53_CEBIR_MOBIL.png`, `tests/QA_v53_*_DESKTOP.png` — yeni ekran gerçek test görüntüleri.
