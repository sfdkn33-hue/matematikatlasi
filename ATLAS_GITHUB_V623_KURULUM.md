# Matematik Atlası v6.23 · GitHub kaynak altyapısı

## Bu paket ne yapar?
Bu bir **yeni HTML uygulaması değildir**. v6.22'nin `lan/server.js` kaynağını günceller, iki yeni Node.js modülü ile testler ve güvenli yapılandırma şablonu ekler.

- Öğretmen hesabı: Google OpenID Connect yetkilendirme kodu + PKCE, state ve nonce; Google imzalı `id_token` doğrulaması (`iss`, `aud`, `exp`, `iat`, imza, `email_verified`). `openid email profile` dışında kapsam istemez. Gmail postası okunmaz.
- QR eşleştirme API: Tahta iki dakika geçerli tek kullanımlık bağlantı üretir. Telefondaki öğretmen istekte bulunur; **tahta onaylamadan kumanda yetkisi verilmez**. `approve` / `reject` ve durum uçları mevcuttur.
- Eski PIN yöntemi yalnız yerel pilotta korunur. Çevrimiçi zorunlu-Google modunda PIN bile Google oturumu olmadan çalışmaz.
- Öğrencinin cevapları, öğrenme geçmişi veya kişisel verileri sunucuya eklenmez. Öğrencinin görev tamamlama mantığı değiştirilmemiştir.

## Önemli: henüz tam ürün değil
QR kodu **görsel olarak çizecek ekran** ve telefonun kamera taramasından otomatik `claim` gönderen arayüz henüz entegre edilmedi. Yeni `.html` üretilmedi; bu aşamada altyapı ve API hazırlandı. Google Cloud OAuth kimlik bilgileri, güvenilir HTTPS alan adı ve bir dağıtım sunucusu olmadan gerçek Google hesabıyla giriş yapılamaz. Bunların hiçbiri GitHub Pages'in yalnız statik dosya barındırmasıyla çalışmaz.

## GitHub'a güvenli aktarım
- Depoyu GitHub bağlayıcısına **Contents read/write** izniyle aç. Canlı `main` dalına doğrudan güncelleme yapma.
- `feature/atlas-v623-google-qr-foundation` dalı oluştur.
- Paket içindeki aşağıdaki dosyaları aynı göreli yollarla bu dala aktar (var olan `lan/server.js`, `tests_v622/test_lan.js` ve varsa `.gitignore` dikkatle birleştirilmeli).
- GitHub Actions'da `atlas-lan-tests.yml` doğrulamasını çalıştır. Canlı sürüm yalnız gözden geçirilen PR ile güncellensin.
- `.env` ya da Google Client Secret **GitHub'a yüklenmez**.

## Yerel sunucu modu (Google olmadan)
Node.js >= 20, proje kökünden:
```
node lan/server.js
node tests_v622/test_lan.js
node tests_v623/test_pairing.js
node tests_v623/test_google.js
```
Tahta: `http://127.0.0.1:8765/tahta`; telefon aynı ağdan bilgisayarın yerel IP'sinde `/kumanda`. QR bağlantısı için tahta localhost üzerinden açılmışsa sunucu tek uygun yerel IP'yi kullanır; bilgisayarda birden fazla ağ kartı varsa `ATLAS_PAIRING_ORIGIN=http://192.168.x.y:8765` değerini elle ayarla. v6.22 PIN kumandası çalışmaya devam eder. **QR API henüz UI'a bağlanmadı.**

### QR API uçları
- `POST /api/room` — tahta oturumu aç (mevcut)
- `POST /api/pair/prepare` — tahta yetkisiyle kısa ömürlü `pairingUrl` al
- `POST /api/pair/claim` — telefon `{ "token": "..." }` gönderir, yalnız bekleme hakkı alır
- `GET /api/pair/requests` — yalnız tahta, bekleyen talepler
- `POST /api/pair/approve` / `POST /api/pair/reject` — yalnız tahta `{ "id": "..." }` ile karar verir
- `GET /api/pair/status` — telefon onaydan sonra HttpOnly kumanda çerezini alır

Tüm yazma uçlarında mevcut uygulamanın aynı kaynak (Origin) + `application/json` kontrolü geçerlidir. QR gizli bağlantısını sunucu loglarına, analitiğe ya da üçüncü taraf uygulamalara gönderme.

## Google ile giriş (gelecekteki HTTPS servisinde)
1. Google Cloud'da OAuth onay ekranı ve **Web application** OAuth istemcisi oluştur. Girişte Gmail okuma kapsamı isteme.
2. Sunucuda `ATLAS_PUBLIC_ORIGIN=https://senin-alan-adin` ayarla. Google **Authorized redirect URI** tam olarak `https://senin-alan-adin/auth/google/callback` olmalı.
3. `ATLAS_GOOGLE_CLIENT_ID`, `ATLAS_GOOGLE_CLIENT_SECRET` değerlerini sunucu ortam değişkenlerinde / secrets yöneticisinde sakla. **GitHub'a dosya olarak koyma.**
4. `ATLAS_LOGIN_MODE=google` olarak aç. HTTPS sağlayan ters vekil (reverse proxy) kullan; Node uygulamasını doğrudan genel internete açma.
5. `/auth/google/start?return_to=%2Fkumanda` bağlantısı öğretmeni Google'a yönlendirir. `/auth/google/callback` kimlik bilgisini doğrular ve `/kumanda` sayfasına döndürür. `/auth/me`, `/auth/info`, `POST /auth/logout` yardımcı uçlardır.
6. Sunucu oturumları bellektedir. Bu bir **pilot** sınırıdır: yeniden başlatınca oturumlar silinir, yatay çoklu sunucu kullanımı desteklenmez. Prod'da kalıcı oturum deposu, kapsamlı erişim kontrolü, denetim kaydı, güvenlik incelemesi, KVKK çalışması ve fiziksel telefon/tahta denemesi gerekir.

## Dokunulmayanlar
`data/tasks.json` (4.037 görev) ve öğrencinin var olan `mathAtlas940Done`, `mathAtlas64Attempts` kayıtları bu pakette **yoktur**. Mevcut Google Pages/HTML yayınını değiştirmez. Bu paket yalnız altyapı katmanı için hazırlanmıştır.
