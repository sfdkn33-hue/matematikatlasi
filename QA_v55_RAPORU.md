# Matematik Atlası v5.5 — Kalite ve Test Raporu

## Sürüm ve korunma denetimi
- **3.743** görev: 5. sınıf **955**, 6. sınıf **1.262**, 7. sınıf **827**, 8. sınıf **699**.
- Önceki v5.4 kaynaklarındaki **3.623 görev, ID, sıra ve içerik birebir** korunmuştur.
- **120 yeni görev**: 7. sınıf **24**, 8. sınıf **96**. 11 çeşit model: eşitsizlikten doğru model kurma, sayı doğrusu, eşitsizlik çözümü, üçgen elemanları, üçgen eşitsizliği, kenar-açı karşılaştırması, üçgen yapımı pilotu, Pisagor, oran, veri yorumlama ve bileşik alan.
- 8. sınıfta **41/52** kazanımda en az bir pilot görev; **11 kazanım hâlâ pilotsuz**. 7. sınıfta **30/30** çıktıda pilot var ancak tam yeterlik değil.
- Eski `YAZILI_MERKEZI.html`, yazılı havuzu ve eski 20 LGS pilot soru kaynağı **bayt düzeyinde değişmedi**.
- İlerleme anahtarı **`mathAtlas940Done`** sabit tutuldu.

## Yeni nesil LGS pilot sınavı
- Önceki 12 + **8 yeni özgün soru = 20 soruluk** tek bir beceri provası.
- Dört seçenek, soru gezgini, süre, cevap anahtarı, çözümlü inceleme, yanlış/doğru durumları mevcut.
- Matematiksel işlemler ve seçenek tekilliği geliştirici düzeyinde kontrol edildi. **Uzman madde analizi, ayırt edicilik ve gerçek LGS kalibrasyonu henüz yapılmadı.** Bu bir resmî MEB kitapçığı değildir.

## Programlı test (Chromium)
- **120/120 yeni görev** arayüzden seçildi, doğru ara değerler girildi, uygun kararlar seçildi ve test ilerleme depolamasına kaydedildi.
- Boş modelin reddi: True; hatalı modelin reddi: True; genel cevap alanıyla atlama: False.
- 20 sorunun doğru cevapları arayüzde işaretlendiğinde: **20/20 doğru**. Soru geçişi, çözümleri açma ve sonuç özeti görüldü.
- 390×844 mobil: yatay taşma **0 px**; 1280×800 masaüstü: **0 px**; yakalanan JavaScript `pageerror`: **0**.
- Bu otomatik testler Chromium'un bellek içi sayfasında ve `localStorage` taklidiyle gerçekleştirildi. **Gerçek GitHub Pages yüklemesi, farklı telefonlardaki gerçek depolama, çevrimdışı senkron ve eş zamanlı sınıf testi değildir.**

## Görsel ve pedagojik sınırlar
- Yeni stüdyo açık zemin/koyu yazı, odak çerçeveleri, mobil tek sütun ve 44 px üzeri dokunma alanları kullanır. Eski istatistik sütunlarına okunabilirlik yaması uygulanmıştır. **Tüm eski ekranlarda WCAG 2.2 AA kontrast denetimi yapılmamıştır.**
- Üçgen kurma modelindeki dijital çizimler şematik, ölçekli gerçek cetvel-pergel simülasyonu değil. KKK–AKA–KAK bilgi eşleştirmesi pilotu olarak değerlendirilmelidir.
- Görevlerde matematiksel ara sonuç ve seçim doğrulanır; öğrencinin yazılı/sözlü gerekçesi öğretmen tarafından değerlendirilmelidir.
- **Canlı GitHub'a dokunulmadı.** Öğretmen paneli, akıllı tahta-telefon eş zamanlaması, ödev atama/senkron takibi henüz tamamlanmadı.

## Kaynaklar
- 8. sınıf MEB 2018 programı: https://mufredat.meb.gov.tr/Dosyalar/201813017165445-MATEMAT%C4%B0K%20%C3%96%C4%9ERET%C4%B0M%20PROGRAMI%202018v.pdf
- 7. sınıf Türkiye Yüzyılı Maarif Modeli: https://tymm.meb.gov.tr/ogretim-programlari/ortaokul-matematik-dersi/8
