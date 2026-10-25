# Matematik Atlası · Ortaokul (5–8. sınıflar)

**Kaynak kod deposu / ilk içe aktarma · v6.22 + v6.23 altyapı taslağı**

Matematik Atlası; ortaokul öğrencileri için otomatik matematiksel doğrulama yapan görevler, hedefli öğrenme koçu ve öğretmen sınıf yönetimi sistemidir. Öğrenci cevapları öğretmen onayı gerektirmeden uygulama tarafından değerlendirilir.

## Kaynakların durumu

| Bileşen | Durum |
| --- | --- |
| `data/tasks.json` | 4.037 mevcut görev korunmuştur |
| `index.html` ve `assets/` | v6.22 öğrenci arayüzü ve oyun motorları |
| `lan/board.js`, `lan/teacher.html` | v6.22 tahta–telefon sınıf kumandası |
| `lan/server.js` | v6.23 yerel sınıf sunucusu, yetki kontrolleri |
| `lan/qr-pairing.js` | Kısa ömürlü, tek kullanımlık QR eşleştirme **API** altyapısı |
| `lan/google-auth.js` | Google OpenID Connect/OAuth doğrulama **sunucu** altyapısı |
| `.github/workflows/atlas-lan-tests.yml` | Pull Request ve elle tetiklenen testler |

### Henüz hazır olmayanlar

- **Gerçek Gmail/Google girişi çalıştırılmadı:** Google Cloud OAuth istemcisi, HTTPS sunucu ve arayüz bağlantıları kurulmalı.
- **Kamera üzerinden QR okutma ekranı henüz bağlanmadı:** QR ve yetkilendirme API mevcuttur; görsel QR üretimi, telefon tarama akışı ve tahta onayı için kullanıcı arayüzü entegrasyonu gerekir.
- **Üretim/halk erişimi için uygun değildir:** Yerel sınıf ağı pilotundan önce okul ve cihaz testleri gerekir. GitHub Pages Node.js sunucusu çalıştırmaz.
- Öğrenci bilgileri, Gmail içeriği, özel anahtarlar veya gerçek oturum şifreleri bu depoya konmamalıdır.

## Başlangıç

**Ön koşul:** Node.js 20 veya üzeri. Proje dizininde:

```sh
node lan/server.js
```

Tahta aynı bilgisayarda `http://127.0.0.1:8765/tahta`, telefon aynı güvenilir yerel ağdan `http://BILGISAYARIN-YEREL-IP-ADRESI:8765/kumanda`.

**Testler:**

```sh
node tests_v622/test_lan.js
node tests_v623/test_pairing.js
node tests_v623/test_google.js
```

Bu 64 kontrollü test, gerçek Google OAuth servisini veya fiziksel telefonu kullanmaz.

## Güvenlik ve kaynak yönetimi

- `main` kararlı temel için ayrılmıştır. Bu ilk içe aktarmayı `feature/atlas-v623-google-qr-foundation` dalına yükle; hemen birleştirme.
- `.env`, OAuth gizli anahtarları, gerçek öğrenci verileri ve kimlik bilgileri GitHub'a yüklenmez. `config/atlas.env.example` yalnız değişken adları için örnektir.
- v6.22'nin büyük, üretilmiş *tek dosyalı HTML* kopyaları ve eski ekran görüntüleri Git geçmişini şişirmemek için **bu yükleme paketinden çıkarıldı**. Oyun kaynakları (`index.html`, `assets/`, `data/`) korunmuştur.
- Eski yerel `localStorage` kayıtlarının başka bir web adresine otomatik taşındığı varsayılmamalıdır.

## Rehberler

- **[İlk GitHub yükleme adımları](GITHUB_DESKTOP_ADIM_ADIM.md)**
- **[v6.23 API ve OAuth kurulum notları](ATLAS_GITHUB_V623_KURULUM.md)**
- **[v6.22 sınıf kumandası notları](README_v622.md)**
