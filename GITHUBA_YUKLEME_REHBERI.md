# Matematik Atlası v1.5 — GitHub Pages yükleme notu

**Önemli:** v1.5 ZIP dosyasının *içindekileri* mevcut depo köküne çıkar. Mevcut `index.html` dosyasının yerini yeni rol seçme ekranı alır; eski oyun artık `atlas.html` dosyasındadır. Aynı depoda eski sürüm dosyalarını elle karıştırma; yükleme öncesi yedek al.

Önce `index.html` sayfasında öğrenci / öğretmen seçimini dene. Ardından öğretmen panelindeki bütün uygulamaları ve `atlas.html` oyununu aç. GitHub Pages üzerinde `index.html` otomatik açılmalıdır.

Bu sürümde giriş seçimi tarayıcı içi görünüm tercihidir, hesap doğrulama değildir. `index.html?sec=1` ile alan değiştirilebilir. Öğrenci kayıtlarını sınıf bazında güvenli şekilde ayırmaz.

---

# Matematik Atlası — bilgisayardan GitHub'a yükleme

**DİKKAT:** Mevcut çalışan sitenin bir yedeğini alın. Bu yayın paketi önceki çalışma dosyalarının birikimini içermez; GitHub'a yüklediğinizde eski dosyalarınız da depoda durabilir.

## GitHub Desktop ile (önerilen)

1. ZIP'i bilgisayara indirin, **klasörün içine çıkarın**. İçeride `index.html`, `assets`, `data`, `gizlilik.html` görünmeli.
2. GitHub Desktop'ta mevcut Matematik Atlası deponuzu `File > Clone repository` üzerinden yerel bilgisayarınıza klonlayın (zaten klonlandıysa açın).
3. Güvenlik için bir yedek/geri dönüş commit'i oluşturun. Dilerseniz önce `release/atlas-v1-public` adlı ayrı bir dalda çalışın.
4. ZIP'ten çıkan **içeriği** deponuzun kök klasörüne kopyalayın. ZIP'i tek bir dosya olarak yüklemeyin.
5. `index.html` dosyasının depo kökünde olduğundan emin olun. `assets/` ve `data/` klasörlerini aynı seviyeye koyun.
6. GitHub Desktop'ta değişiklikleri kontrol edin; `Commit to main` (ya da ayrı dal) ve ardından `Push origin` deyin. Eski sayfaları silmeniz gerekiyorsa önce ayrıca doğrulayın.
7. GitHub > depo > **Settings > Pages** menüsünden `Deploy from a branch` seçin, `main` ve `/(root)` ayarlayın, kaydedin.
8. Yayın adresini gizli pencerede açın. Sırasıyla 5, 6, 7, 8. sınıf seçimini; bir görevin doğru/yanlış yanıtını; yazılı simülasyonu; mobil ekranı kontrol edin.

## Önceki ilerleme kayıtları

Önceki site aynı tam URL altında kalırsa ve tarayıcı verileri silinmezse mevcut yerel ilerleme anahtarlarının korunması amaçlanmıştır. Alan adı/depo yolu değişirse kayıtlar **otomatik olarak taşınmaz**. Öğrenci önce eski sitedeki `Yedek al` aracını kullanmalıdır.

## Sınırları

- Bu bir **herkese açık statik sürümdür**, canlı sınıf ve kullanıcı hesap sunucusu değildir.
- Öğrenci verisi, şifre, .env veya OAuth anahtarlarını GitHub'a yüklemeyin.
- Sitenin resmî MEB onaylı olduğu yönünde tanıtım yapmayın.

## Geri dönüş

Sorun çıkarsa GitHub Desktop'ta eski kararlı commit'e dönün veya önceki dalı yeniden dağıtın.


## v1.2 içerik güncellemesi

Bu ZIP v1.0'ın **yerine geçen tam pakettir**. Eski ZIP ile dosyaları üst üste karıştırmayın; deponun mevcut durumunu yedekleyip ZIP içeriğini repo köküne aktarın. `BECERI_TEMELLI_64_OZGUN_SORU.html` ve `data/mebi_yaklasimi_ozgun_32.json` dosyaları da birlikte yüklenecek. Yeni soru sayısı 1.096'tür. Canlı sitede dört sınıf ve sınav ekranlarını ayrıca test edin.

### v1.2 ek kontrol
GitHub Pages yayımlandıktan sonra ana sayfadan **64 özgün beceri sorusu** bağlantısını, sınav antrenmanını ve 5–8. sınıf oyun görevlerini her sınıfta en az birer kez test et. Bu dosyaların tek ZIP olarak değil, **açılmış klasör içeriği** olarak depo kökünde bulunması gerekir.


**Yeni sürüm:** `MATEMATIK_ATLASI_GITHUB_YAYIN_v1_3_LGS_ACIK_UCLU.zip` önceki v1.2 dosyasının yerini alır. ZIP'i tek dosya olarak değil, içindeki bütün dosyaları depo köküne çıkarıp yükleyiniz. `index.html` depo kökünde bulunmalıdır.


## v1.4 yükleme notu

Güncel tam paket: `MATEMATIK_ATLASI_GITHUB_YAYIN_v1_4_UC_YANLIS_COZUM.zip`. Önceki v1.3 paketinin yerini alır.
ZIP içindeki dosyaları deponun **kök klasörüne** çıkarın; yalnız ZIP'i yüklemeyin. `assets/js/atlas14_solution_policy.js` ve `assets/css/atlas14_solution.css` dosyalarının da yüklenmiş olduğuna emin olun.
Canlı sitede öğrenci olarak bir görevde önce boş yanıtı dene (yanlış sayılmamalı); ardından üç kez yanlış yanıt ver (çözüm üçüncüde açılmalı); çözümü açıp tamamlanma sayısının değişmediğini doğrula. Ayrı yeni nesil ve açık uçlu atölyeyi de kontrol et.
