# MATEMATİK ATLASI v4.5 — 8. SINIF KAZANIM ENVANTERİ ve LGS MİNİ DENEME

**Sürüm:** 2026-10-23 · Pilot/test paketi. **Canlı GitHub'a yükleme yapılmadı.**

## Neler eklendi?
- 2018 MEB 8. sınıf matematik programının **52 resmî kazanım kodu**, 12 konu başlığı altında listelendi (`data/8_SINIF_52_RESMI_KAZANIM_HARITASI.json`). Kodlar resmî, kısa konu açıklamaları Atlas tarafından özetlenmiştir.
- Açık uçlu yazılı havuzuna **20 yeni ve farklı özgün taslak soru** eklendi (`data/yazili_havuzu_v45.json`). 770 → **790** soru varyantı. 8. sınıf 190 → **210**.
- İlk dönemle bağlantılı kodlardaki pilot kapsam **20/52 kazanım**. **32 kazanımda resmî koda bağlı pilot soru hâlâ yok.** Bir kodda soru bulunması tüm alt becerilerinin ölçüldüğü anlamına gelmez.
- Yalnızca 8. sınıf seçildiğinde görünen **12 soruluk LGS tarzı mini deneme** eklendi. Açıklamalı cevaplar değerlendirme sonrası görünür. Bu **tam LGS denemesi değildir** ve resmî LGS sorusu kullanılmamıştır.
- Eski `ATLAS.8.2018...` kodlu **168 soru** otomatik yeniden etiketlenmedi; öğretmen incelemesi için ayrı liste yapıldı (`data/8_SINIF_KOD_TEMIZLIK_BEKTLEYEN.json`).
- Eski 25 MEB senaryosu aynen bırakıldı. MEB senaryo kotaları öğretmen tarafından resmî tabloyla kontrol edilmelidir.

## Dosyalar
- `ATLAS_TEK_DOSYA.html`: Ana oyun + entegre yeni Yazılı Sınav Merkezi
- `YAZILI_MERKEZI.html`: Tek başına çalışan sınav merkezi
- `8_SINIF_52_KAZANIM_HARITASI.html`: Kazanım ve kapsam durumunun ayrı görünümü
- `data/yazili_havuzu_v45.json`, `data/lgs_mini_12_orijinal.json`
- `tests/QA_v45.md` ve `tests/QA_v45_AUTOMATED.json`: Test kapsamı

## Değişmeyenler
- **2.807 oyun görevi** ve eski görev kimlikleri; `tasks.json` SHA-256 başlangıcı: `cc9b5c0829ee1fc3` (önceki v4.4 ZIP ile birebir aynı)
- 770 eski soru kimliği, metni ve cevap modeli (yeni havuzun ilk 770 kaydıyla birebir)
- Mevcut öğrenci ilerlemesi için kullanılan yerel depolama düzeni
- Lise arşivi, 5–7. sınıflar, mevcut senaryolar

## Önemli sınırlar
Sorular henüz matematik öğretmeni tarafından satır satır onaylanmamıştır. Açık uçlu işlem basamaklarının güvenilir otomatik puanlaması yoktur. 12 soruluk mini deneme temel ve orta düzey pilot niteliğindedir; yeni nesil, grafik destekli, özgün uzun LGS problemleri sonraki sürümlerde çeşitlendirilecektir. MEB kapalı havuzuna bağlantı bulunmaz. Sınavlar resmî sınav yerine geçmez.

**Resmî kaynak:** MEB (2018), Matematik Dersi Öğretim Programı, 8. sınıf s.71–76: https://mufredat.meb.gov.tr/Dosyalar/201813017165445-MATEMAT%C4%B0K%20%C3%96%C4%9ERET%C4%B0M%20PROGRAMI%202018v.pdf?v=1.0.24
MEB 2026–2027 1. dönem konu-soru dağılımları: https://odsgm.meb.gov.tr/www/1donem-konu-soru-dagilim-tablolari-2026-2027/icerik/1724
