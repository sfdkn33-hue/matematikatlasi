# Matematik Atlası v6.22 — Yerel ağ öğretmen kumandası

## Amaç
Akıllı tahta / ders bilgisayarında açılan Matematik Atlası görevlerini öğretmenin kendi telefonundan **aynı yerel ağ üzerinde** seçip değiştirmesi. İçerik ve 4.037 görev kimliği korunmuştur. Önceki 659 hedefli pekiştirme görevinin içeriği değiştirilmemiştir.

## Kurulum — 5 adım
1. ZIP'i bilgisayarda çıkarın. **Node.js 18 veya daha yeni** kurulu olmalı (ek npm paketi gerekmez).
2. Windows'ta `BASLAT_WINDOWS.bat`, macOS/Linux'ta `sh BASLAT_MAC_LINUX.sh` çalıştırın; alternatif: terminalde `node lan/server.js`.
3. Akıllı tahta / bilgisayarda `http://127.0.0.1:8765/tahta` adresini açın, sağ alttan **Bağlantı başlat** seçin.
4. Terminalde görünen yerel IP adresini telefonda açın, örneğin `http://192.168.1.15:8765/kumanda`. **Bu örnek IP'dir; kendi bilgisayarınızın IP'sini kullanın.** Telefon ve tahta aynı güvenilir Wi-Fi'de olmalı; kablosuz istemci izolasyonu kapalı olmalıdır.
5. Tahtadaki altı karakterli kod ve altı haneli PIN'i telefona yazın. Öğretmen kumandasından sınıf ve görev seçin veya ileri / geri gidin.

## Önemli farklar
- `index.html` ve `ATLAS_TEK_DOSYA.html`: önceki oyun işlevleri korunur. **Uzaktan kumanda yalnız Node sunucusunun `/tahta` ve `/kumanda` sayfaları üzerinden çalışır.** Tek HTML'yi dosya yöneticisinden doğrudan açmak telefon bağlantısı kurmaz.
- Sunucu **görev seçimi** ve oturum durumunu yalnız bellekte tutar; **öğrencinin ismi, matematik yanıtı, öğretmen onayı, notları veya ilerleme kaydı sunucuya yüklenmez.** Tahtadaki ilerleme kendi tarayıcı depolamasında kalır.
- Daha önce `file://` üzerinden bir HTML'de oluşan ilerleme ile `http://...` altında oluşacak ilerleme **aynı tarayıcı deposu değildir**. Eski ilerleme otomatik taşınmaz; eski uygulamadan yedek alın.
- Sunucunun ağ trafiği **HTTP üzerinden şifresizdir**. Bu sürüm internete ya da güvensiz/kamuya açık ağa açılmak için tasarlanmadı; yalnız kontrollü okul/ev Wi‑Fi ağı ve pilot test için kullanın. Kurumsal kullanım öncesinde HTTPS, daha kapsamlı kimlik doğrulama, sunucu koruması ve KVKK incelemesi gerekir.
- PIN girme denemesi sınırlandırılır, aynı odaya ikinci öğretmen katılamaz, iki saat sonunda oturum sona erer. Tahtadan **Oturumu bitir** eski kumanda yetkisini iptal eder.
- Aynı ağdaki cihazlar birbirlerini görmüyorsa güvenlik duvarı / port 8765 veya Wi-Fi istemci izolasyonu kontrol edilmelidir.
- Sunucu kapatılırsa / internet ağı giderse uzaktan kumanda çalışmaz; oyun tahtada yerel olarak kullanılabilir.
- Fiziksel akıllı tahta ve farklı telefonlarla saha testi yapılmadı. Ağ/API ve Chromium izole arayüz testleri `QA_v622_RAPORU.md` dosyasında.

## Diğer dosyalar
- `ogretmen.html` ve `OGRETMEN_PANELI_TEK_DOSYA.html`: v6.21'den gelen **çevrimdışı sınıf öğrenme özetleri paneli**, kumandadan ayrıdır.
- `lan/server.js`, `lan/board.js`, `lan/teacher.html`, `lan/board.css`: uzaktan kumandanın sunucu ve istemci dosyaları.
- `tests_v622/test_lan.js`: ağ protokolü, yetki, gerçek zamanlı olay testi. Çalıştırmak için `node tests_v622/test_lan.js`.

Canlı GitHub'a dokunulmamıştır.
