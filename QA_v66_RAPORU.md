# Matematik Atlası v6.6 — Beş kazanımda soru çeşitliliği / QA

**Tarih:** 24 Ekim 2026. **Kaynak:** v6.5 geliştirme paketi, yerel tarayıcı testleri.

## İçerik

- Önceki **3.961 görev** nesnesi aynı ID ve içerikle korundu. Yeni **40 görev** eklendi; toplam **4.001**.
- Sınıflara göre: 5. sınıf **967**, 6. sınıf **1274**, 7. sınıf **887**, 8. sınıf **873**.
- **130 kod** izleniyor: 129 resmî kazanım/öğrenme çıktısı kodu ve 1 Atlas pilot kodu.
- Pilot soru geçmişi izlenen görev: **116** (v6.5'ten 76 + 40); eski klasik görevler için tam deneme telemetrisi hâlâ yok.

| Kazanım | Yeni görev | Odak |
|---|---:|---|
| MAT.7.6.2 | 8 | Grafik eleştirisi, örneklem, değişim, uç değer, iddia çürütme |
| MAT.7.7.1 | 8 | Tümleyen olay, örnek uzay, adil olasılık, eşit şans tasarımı |
| M.8.1.3.2 | 8 | Kareköklerin aralığı, tam kare kanıtı, yakınlık, iddia denetimi |
| M.8.2.1.2 | 8 | Çarpma alan hücreleri, negatif çarpan, özdeşlik, hata bulma |
| M.8.2.2.5 | 8 | Tarife karşılaştırma, sabit ücret, veri tablosu, eğim ve iki koşullu karar |

### Gerçekçi yorum

- **40 yeni soru yaklaşımı**, **40 farklı oyun mekaniği demek değildir.** Yeni görevler beş görsel şema türü (sütun, bilye/kart, sayı doğrusu, cebir karo, doğrusal ilişki) ve zorunlu karar düğmeleriyle sunuluyor.
- Bu turda beş kazanımı derinleştirdik; **129 resmî kazanımın tüm alt becerileri henüz denetlenmedi**. Kalite haritasındaki beceriler taslak; resmî alt süreç bileşenleriyle ve uzman incelemesiyle eşleştirilmeli.
- Görsel karar + matematik alanlarının tümü doğru olmalı; öğretmen onayı yok.
- Tam öğrenme kaydı ayrı bir süreçtir. 1., 7. ve 21. gün pilot tekrarları uygulanmakla birlikte farklı bağlamlarla ölçüm ve gerçek öğrenci denemeleri geliştirilmelidir.

## Kontrollü Chromium QA

- **40/40** görevde boş yanıt reddedildi.
- **40/40** görevde matematik alanları doğruyken görsel seçim boşsa veya yanlışsa tamamlanma reddedildi.
- **40/40** görevde görsel seçim doğruyken bir matematik alanı yanlışsa tamamlanma reddedildi.
- **40/40** görev görsel + tüm matematik alanları doğruyken tamamlanma kaydını oluşturdu.
- Eski genel cevap kutusundan görev geçme girişimleri başarısız; önceden tamamlanmış bir 5. sınıf görevinin kaydı korunuyor.
- v6.5'ten kalma bir pilot görevin açılabildiği kontrol edildi.
- 390 px mobil ve 1280 px masaüstü kontrollü DOM testlerinde yatay taşma veya JS hatası raporlanmadı. Ayrı görsel denemede v6.6 görev laboratuvarı, gerçek ana sayfa > Devam Et > sınıf > kazanım > görev seçimi yoluyla açıldı.
- İzole tarayıcıda güvenlik nedeniyle `localStorage` için test depolaması taklidi kullanıldı; bu gerçek bir HTTPS dağıtım testi değildir.

## Kısıtlar

1. Eski 3.961 görevin tamamını yeniden oynayıp doğrulamadık.
2. Otomatik test cevap anahtarlarıyla çalışır; öğretmenin bağımsız pedagojik soru değerlendirmesi ve sınıf pilotu gerekir.
3. İlk 116 pilot dışındaki görevlerde hata sayısı/ipucu/kalıcı öğrenme verisi aynı kapsamda tutulmaz.
4. Cihazlar arası öğretmen/öğrenci raporu senkronizasyonu yoktur.
5. Öğrenci ekranlarında çocuk tarafından tarayıcı araçlarıyla müdahale engellenmiş güvenli sınav altyapısı değildir.
6. Canlı GitHub'a dokunulmadı.
