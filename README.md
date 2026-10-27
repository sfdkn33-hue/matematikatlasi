# Matematik Atlası — GitHub Pages yayın paketi

Bu depo **5–8. sınıf Matematik Atlası**'nın ücretsiz erişilebilen, statik web sürümünü barındırmak için hazırlanmıştır.

## v1.5: Öğrenci ve öğretmen çalışma alanları

- `index.html`: iki çalışma alanından birini seçme ekranı. Seçim tarayıcıda hatırlanır; `index.html?sec=1` ile rol değiştirilebilir.
- `ogrenci-paneli.html`: öğrenciler için sade öğrenme ve deneme bağlantıları.
- `ogretmen-paneli.html`: yayımlanan **18 uygulama ve araca** tek ekrandan erişim (ana oyun dahil).
- `atlas.html`: önceki `index.html` ana oyun motoru, soru ve görevleri değiştirilmeden taşındı.
- Her içerik sayfasında paneline dönüş menüsü bulunur.
- **Bu bir kimlik doğrulama sistemi değildir**: rol seçimi güvenlik sağlamaz, herkes öğretmen görünümüne geçebilir; ilerleme verileri bu tarayıcıya özeldir. Merkezi okul/sınıf yönetimi veya Google oturumu bulunmaz.

## Kapsam

- 5.579 oyun görevi / 1.132 sınav sorusu (güncel üç sınav havuzu); 130 Atlas kodundan biri eski pilot kodudur.
- Öğrenme etkinlikleri, otomatik cevap değerlendirme, ilerleme kaydı (bu tarayıcıda), çalışma alanları, antrenman ve deneme ekranları.
- Ücretsiz, oturum açmadan kullanım; öğretmen onayı gerekmez.

## Bilinen sınırlar

- **GitHub Pages statiktir.** Google/Gmail girişi, QR ile eşleme, telefondan akıllı tahta yönetimi, merkezi öğrenci takibi ve abonelik için ayrı sunucu/altyapı gerekir; bu dağıtımda çalışmaz.
- Öğrenci ilerleme verileri tarayıcıda kalır; cihazlar arasında otomatik senkronize edilmez.
- Soru bankasının yanıt anahtarları istemci tarafındadır; bu sürüm resmî/güvenli yüksek önem taşıyan sınav için kullanılmamalıdır.
- Tüm 5–8. sınıf kazanımlarının MEB ile eşleşmesi ve soruların pedagojik doğruluğu bağımsız uzman onayından geçmedi.
- Gerçek cihazlar, sınıf ağı ve tüm ekranlarda saha testleri devam eder.

## Yayınlama

`GITHUBA_YUKLEME_REHBERI.md` dosyasını takip edin. GitHub Pages ayarı **main / (root)** olmalıdır. ZIP dosyasının kendisini GitHub'a yüklemek yerine **ZIP'in içindekileri** depo köküne koyun.

## Güvenlik

Bu statik pakette `.env`, sunucu yapılandırması, özel anahtar, kimlik doğrulama sırları veya gerçek öğrenci verisi bulunmaz.

## Kaynak

Orijinal geliştirme arşivinden derlenmiş, kaynak dosyaları ve ilerleme anahtarları korunmuş yayın adayı. Resmî MEB hizmeti veya MEB onaylı program değildir.

## v1.2 — Beceri temelli özgün sorular (MEBİ yaklaşımından ilhamla)

- `BECERI_TEMELLI_64_OZGUN_SORU.html`: dört sınıfta on altışar soru; özgün tablolar, grafikler ve işlem şemalarıyla otomatik denetim ve çözümler.
- `data/mebi_yaklasimi_ozgun_32.json`: v1.1 soruları.
- `data/atlas_v12_32_yeni_beceri_sorusu.json`: v1.2 yeni 32 soru.
- `data/atlas_v12_64_beceri_sorusu_toplam.json`: toplam 64 özgün soru.
- 64 özgün soru, `ANTRENMAN_MERKEZI.html`, `DONEM_SONU_DENEMELERI.html` ve `SENARYOLU_YAZILI_SIMULATORU.html` içine eklenmiştir (önceki 1.032 soru korunur, yeni 1.096).
- MEBİ/MEB soru metinleri, görselleri ve cevapları kopyalanmamıştır. Öğretmen incelemesi ve canlı alan adı testi gereklidir.

## v1.2 yayın notu

- 5, 6, 7 ve 8. sınıfa sekizer yeni beceri temelli soru (toplam 32); önceki 1.064 soru değiştirilmedi.
- 24 veri tablosu, 6 işlem şeması, 2 çubuk grafik.
- Resmî MEB/MEBİ onayı veya soru bankası lisansı iddia edilmez.
- Kazanım kodları ve pedagojik nitelik için öğretmen incelemesi sürmektedir.
- GitHub Pages statik sürüm; cihazlar arası öğrenci hesabı ve canlı öğretmen–tahta bağlantısı bulunmaz.


## v1.3 — Özgün muhakeme ve açık uçlu soru paketi
- 5.579 oyun görevi, 1.132 sınav sorusu, toplam 6.711 ana içerik.
- 8. sınıfa 18 çok aşamalı çoktan seçmeli soru; 5–7. sınıflara 18 sayısal yanıtlı açık uçlu soru eklenmiştir.
- Tüm yeni sorular üç sınav aracının veri havuzuna işlendi.
- `LGS_VE_ACIK_UCLU_ATOLYE.html` yeni soruların çevrimdışı etkileşimli ekranıdır.
- Yazılı işlemler otomatik olarak doğrulanmaz. Nihai cevap otomatik kontrol edilir, işlem ve gerekçe için çözüm anahtarı gösterilir.
- Resmî kazanım eşleştirmeleri, kapsamlı pedagojik inceleme ve canlı GitHub Pages testi henüz tamamlanmamıştır.
- MEB/MEBİ soruları kopyalanmamıştır.

## v1.4 — Üç yanlış denemeden sonra çözüm seçeneği

- Ana oyun görevlerinde çözüm düğmesi başlangıçta kilitlidir. Üç ayrı doğrulanmış yanlış kontrolünden sonra açılır. Boş yanıt sayılmaz.
- Yanlış sayacı görev ve içerik sürümü bazında cihazda saklanır. Öğrencinin mevcut başarı kayıtları değiştirilmez.
- Açık uçlu/LGS atölyesi, 32/64 beceri sorusu, yeni nesil soru ekranı ve tanılama-tekrar çalışmasında aynı gösterme davranışı uygulanır. Tanılama ekranında ilk yanıtın ölçüm sonucu korunur.
- Çözümü açmak başarı kaydı oluşturmaz; öğrencinin yeniden deneme hakkı sürer. İpuçları üçüncü yanlıştan önce de kullanılabilir.
- Süreli deneme ve senaryolu yazılıda cevap anahtarı sınav tamamlanmadan açılmaz.
- Eski mini-laboratuvarların tamamında doğrulanmış yanlış olayı yayımlanmadığından uçtan uca saha testi gerekir.
- Soru sayısı değişmedi: 5.579 oyun + 1.132 sınav = 6.711 içerik.
