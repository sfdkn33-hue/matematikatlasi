# Matematik Atlası — GitHub Desktop ile ilk yükleme (Windows)

Bu rehber, **zaten oluşturulmuş ama henüz boş** olan GitHub deposuna uygundur: https://github.com/sfdkn33-hue/matematikatlasi

## A. `main` dalına küçük bir başlangıç dosyası oluştur

1. GitHub'da `https://github.com/sfdkn33-hue/matematikatlasi` bağlantısını aç.
2. Repo boş olduğunda görülen **creating a new file** yazısına tıkla (gerekirse Add file > Create new file).
3. Dosya adına `README.md`, içine `# Matematik Atlası` yaz.
4. **Commit changes** ile `main` dalına kaydet. Böylece depo klonlanabilir ve ilk dalı oluşur.

## B. GitHub Desktop'ı kur / depoyu klonla

5. Resmî adres: https://desktop.github.com/download/ — Windows için GitHub Desktop'ı yükle ve kendi GitHub hesabınla giriş yap.
6. GitHub Desktop içinde `File > Clone repository... > URL` adımlarını izle.
7. Repository URL: `https://github.com/sfdkn33-hue/matematikatlasi.git`.
8. `Local path` bölümünden kolay bir konum seç (`Belgeler\GitHub` gibi). `Clone` düğmesine bas.

## C. Canlı dalı koruyan geliştirme dalını aç

9. Üstte `Current branch` düğmesine bas > `New branch`.
10. Dal ismi: `feature/atlas-v623-google-qr-foundation`. `Create branch` de.
11. Üstte hâlâ bu `feature/` dalının seçili olduğunu doğrula. **main üzerinde kaynakları yapıştırma.**

## D. Dosyaları klasöre kopyala

12. ChatGPT'den indirdiğin `MATEMATIK_ATLASI_GITHUB_ILK_YUKLEME_v623.zip` dosyasını sağ tık > `Tümünü ayıkla`.
13. Ayıklanan klasörü aç. İçinde `assets`, `data`, `lan`, `tests_v622`, `tests_v623`, `index.html`, `README.md` gibi dosyalar görünmeli.
14. **Bu içerideki tüm dosya ve klasörleri** `Ctrl+A` / `Ctrl+C` ile kopyala.
15. GitHub Desktop'a dön > `Repository > Show in Explorer` (**Depoyu Dosya Gezgini'nde aç**).
16. Kopyaladığın **içeriği** depo klasörüne `Ctrl+V` ile yapıştır. İç içe fazladan `MATEMATIK_ATLASI_GITHUB_PROJE_v623` klasörü oluşmamalı. Mevcut küçük `README.md` dosyasını değiştirmeye izin ver.

**Doğruluk kontrolü:** Bilgisayarındaki `...\matematikatlasi\data\tasks.json` ve `...\matematikatlasi\lan\server.js` konumları mevcut olmalı.

## E. Commit ve GitHub'a gönder

17. GitHub Desktop'taki `Changes` sekmesinde çok sayıda yeni dosya görünmeli.
18. Sol altta `Summary` alanına `feat: import Atlas 6.22 and v6.23 QR Google foundation` yaz.
19. `Commit to feature/atlas-v623-google-qr-foundation` düğmesine tıkla.
20. Üstte `Publish branch` (veya `Push origin`) düğmesine bas.
21. GitHub'da şu dal bağlantısını aç: `https://github.com/sfdkn33-hue/matematikatlasi/tree/feature/atlas-v623-google-qr-foundation`
22. ChatGPT'ye **“Dostum, yükledim, kontrol et”** yaz. İstersen ekrandaki son durumu da paylaş.

**Henüz `main` dalına merge yapma; Pages açma, Google Client Secret / öğrenci dosyaları yükleme.** Testleri ve kaynak yapısını birlikte inceleyelim.

## Sık karşılaşılan sorun

- `Publish branch` yoksa sağ üstte `Push origin` olabilir.
- `Changes` boşsa muhtemelen yanlış klasöre kopyaladın veya yanlış repo açık. `Repository > Show in Explorer` ile kontrol et.
- Çok uzun dosya yükleme sürerse GitHub Desktop'ta bağlantı/oturum durumuna bak. GitHub'a ZIP **dosyasını tek parça yükleme**; GitHub Desktop'a **ayıklanmış klasör içeriğini** koy.
- Yazma izni ChatGPT bağlayıcısında olmasa da **senin GitHub Desktop hesabınla** `Push origin` çalışabilir.
