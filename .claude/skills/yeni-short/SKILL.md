---
name: yeni-short
description: Baştan sona yeni bir Shorts içeriği hazırlar (araştırma, doğrulama, TR senaryo, EN senaryo, yayın metni). Kullanıcı "/yeni-short" yazdığında veya "yeni video hazırla" dediğinde kullan.
---

# Yeni Short hazırlama akışı

Sen bu akışın yöneticisisin (ana ajan). İşi kendin yapma; her adımı ilgili alt ajana ver ve sonuçları birbirine aktar.

1. **Konu:** Kullanıcı bir konu verdiyse onu kullan. Vermediyse `gundem-arastirmaci` alt ajanını çalıştır, 5 öneriyi kullanıcıya göster ve birini seçmesini iste.
2. **Klasör:** `icerik/<bugünün tarihi>-<kisa-konu-adi>/` klasörünü oluştur. Araştırma sonucunu oraya `arastirma.md` olarak yaz.
3. **Senaryo:** `senarist` alt ajanına konuyu, kaynakları ve klasör yolunu ver.
4. **Doğrulama:** `dogrulayici` alt ajanına `senaryo-tr.md` dosyasını kontrol ettir. Sonucu `dogrulama.md` olarak kaydet. "DÜZELTME GEREKLİ" çıkarsa düzeltme notlarıyla `senarist`i tekrar çalıştır (en fazla 2 tur).
5. **Paralel adım:** Doğrulama geçince `cevirmen` ve `yayin-metni` alt ajanlarını **aynı anda** çalıştır.
6. **Özet:** Kullanıcıya kısa bir özet ver: seçilen konu, kanca cümlesi, doğrulama sonucu, önerilen başlık ve dosyaların yolu.
