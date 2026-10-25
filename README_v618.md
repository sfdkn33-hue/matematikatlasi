# Matematik Atlası v6.18 — Kesirlerde Hedefli Öğrenme

**Kaynak:** v6.17. **İçerik:** 4.037 ana görev değişmeden korunur.

Yeni pilot, 5. sınıfın 150 kesir görevi için 15 mevcut oyun türüne bağlı, **iki aşamalı kısa pekiştirme** sunar. Çalışmalar ana görevin cevabı yerine geçmez; ilerleme ve 1–7–21 günlük tekrar başarısını kendiliğinden üretmez. Öğretmen onayı yoktur.

## Dosyalar

- `index.html`: modüler uygulama. Bir web sunucusu üzerinden açıldığında bağlı kaynakları kullanır.
- `ATLAS_TEK_DOSYA.html`: oynanabilir, tek dosyalı sürüm. Öğrenci kayıtlarının kalıcılığı Android/tarayıcıya göre değişebilir.
- `assets/js/fraction5plus.js`: eksik bırakılan alanı yanlış saymayan ve yanlış girilmiş alanı ayıran doğrulayıcı olay bağlantısı.
- `assets/js/atlas616_module_trace.js`: mevcut `mathAtlas64Attempts` kayıtlarına hatalı alan indeksi ve kaba aşama etiketi ekler.
- `assets/js/atlas618_fraction_coach.js`: 15 kesir oyun türünün kısa destek modellerini üretir; bazı türlerde yanlış alanına göre farklı mini çalışma seçer.
- `assets/css/atlas618_fraction_coach.css`: açık, mobil öncelikli, erişilebilir etkinlik kartı.
- `qa_v618_results.json`, `QA_v618_RAPORU.md`: test sonuçları, bilinen kapsam ve sınırlar.

## Kanıt düzeyi

Öğrencinin seçtiği **yanlış alan** kaydedilebilir. Bu bilgi onun **neden yanlış düşündüğünün kanıtı değildir**. Mini çalışmaların pedagojik etkisi henüz gerçek sınıflarda karşılaştırmalı ölçülmemiştir. Kod öğrenci hesabı, sunucu senkronu veya uzaktan tahta kontrolü içermez.

Canlı GitHub'a dokunulmamıştır.
