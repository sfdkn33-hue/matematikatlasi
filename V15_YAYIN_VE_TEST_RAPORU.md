# Matematik Atlası v1.5 — Öğretmen ve Öğrenci Çalışma Alanları

Tarih: 27 Ekim 2026
Durum: GitHub Pages'e yüklenmeye aday statik paket; canlı depoya yüklenmedi.

## Yapılan değişiklikler

- `index.html` artık **Öğrenciyim / Öğretmenim** rol seçme sayfasıdır.
- Öğrenci paneli (`ogrenci-paneli.html`) 8 temel öğrenme/sınav bağlantısı içerir.
- Öğretmen paneli (`ogretmen-paneli.html`) **ana oyun dahil tüm 18 HTML uygulamasına/aracına** kategorili, aranabilir erişim sağlar.
- Önceki ana oyun `atlas.html` adına taşındı. Kaynak görev, cevap ve soru verileri korunmuştur.
- Her içerik sayfasında `☰ Atlas` menüsü ile seçilen panele dönme ve rol değiştirme bağlantısı eklendi.
- Rol tercihi tek tarayıcıda hatırlanır. `index.html?sec=1` bağlantısı ile rol değiştirilebilir.
- Gizlilik açıklamalarına yerel rol seçiminin sınırları eklendi.

## Kapsam ve denetim

| Kontrol | Sonuç |
|---|---|
| Korunan oyun görevleri | 5.579 |
| Korunan sınav soruları | 1.132 (mevcut sınav veri dosyaları değişmedi) |
| Öğretmen panelindeki uygulama bağlantıları | 18/18 mevcut dosyaya işaret ediyor |
| Öğrenci paneli bağlantıları | 8/8 mevcut dosyaya işaret ediyor |
| Önceki `data/` dosyalarının SHA-256 bütünlüğü | 13/13 aynı |
| JavaScript sözdizimi (`node --check`) | 80/80 başarılı |
| Yerel HTML, CSS ve JS dosya bağlantıları | Eksik bağlantı bulunmadı |
| Öğretmen ve öğrenci arayüzleri (390 ve 1280 px) | Tarayıcıya doğrudan sağlanmış içerikle 6/6 görünüm başarılı; yatay taşma yok |
| Öğretmen paneli arama filtresi | Mobil ve masaüstünde başarılı |
| Rol seçim/hatırlama/değiştirme mantığı | Bağımsız JavaScript testleri başarılı |

## Sınırlar

- Bu bir **kimlik doğrulama**, şifre veya yetkilendirme sistemi değildir. Öğretmen alanını teknik olarak herkes açabilir.
- Aynı tarayıcıyı paylaşan kullanıcıların öğrenci kayıtları ayrıştırılmaz. Yerel ilerleme raporu yalnızca aynı tarayıcıya aittir. Öğrencilere ait kişisel bilgileri bu sürümde toplamayın.
- Google ile giriş, öğretmen–öğrenci hesap eşleştirme, sınıfa ödev atama, QR ile kimlik eşleme, merkezi ilerleme takibi ve telefondan akıllı tahta kontrolü **henüz yoktur**; bunlar satış öncesinde sunucu ile geliştirilecek.
- Çalışma ortamının yerel web adresine tarayıcı navigasyonunu engellemesi nedeniyle paket üzerindeki **gerçek çok sayfalı, sunucu üstü uçtan uca test** tamamlanamadı. Portal arayüzleri tarayıcıya doğrudan yüklenerek test edildi. GitHub Pages dağıtımında ayrıca sınanmalıdır.
- Resmî müfredat eşleştirmesi, pedagojik ve gerçek sınıf testleri önceki sürümlerde olduğu gibi tamamlanmamıştır.

## Yükleme

ZIP içindeki dosyaları GitHub Pages'in yayımladığı deponun ana klasörüne **doğrudan** aktarın. `index.html` kökte kalmalıdır. v1.4'ün `index.html` ana oyunu bu sürümde `atlas.html` dosyasıdır. Bu ZIP, önceki yayın paketlerinin yerini alır. Önce mevcut depoyu yedekleyin. Yükleme sonrası öğrenci/öğretmen seçimini ve tüm öğretmen bağlantılarını gerçek GitHub Pages adresinde kontrol edin.
