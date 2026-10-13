# Fatih Labs Media

Bu repo, Fatih Labs kanalının yapay zekâ konulu kısa videolarını (Shorts/Reels/TikTok) ve bunların hazırlık dosyalarını tutar.

## Klasörler
- `shorts/` — Türkçe yayınlanmış videolar (`YYYY-AA-GG-konu.mp4`, kapaklı sürümler `-kapakli` ekiyle)
- `shorts/en/` — İngilizce videolar
- `podcast/` — podcast bölümleri ve kapak görselleri
- `icerik/` — her video için hazırlık klasörü (araştırma, senaryo, doğrulama, yayın metni)

## Çalışma kuralları
- Kullanıcıyla Türkçe konuş; kullanıcı teknik bilgiye sahip değil, sade anlat.
- Yeni içerik için `/yeni-short` akışını ve `.claude/agents/` içindeki alt ajanları kullan.
- Hiçbir iddiayı kaynaksız yayın metnine koyma; `dogrulayici` alt ajanından geçmeyen senaryo yayına hazır sayılmaz.
- `.mp4` ve `.png` dosyalarını silme veya üzerine yazma.
- Video kurgusu için `araclar/kurgu/` aracını kullan (bkz. `araclar/kurgu/README.md`); önceki videolarla aynı görsel tarzı korur.
