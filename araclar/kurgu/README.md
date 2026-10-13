# Kurgu aracı

Fatih Labs Shorts tarzında (mor synthwave arka plan, sarı "Fatih Labs" etiketi, kelime kelime altyazı, kapak karesi, sonda "Kaydet & takip et") 1080x1920 video üretir.

## Adımlar

1. İçerik klasörüne `kurgu.json` yaz. Her sahnenin `konusma` alanı, senaryodaki seslendirme metninin o parçasıdır. Örnek: `icerik/2026-10-13-kendini-egiten-yz/kurgu.json`.
2. Seslendirme (ElevenLabs):
   ```
   python3 araclar/kurgu/seslendir.py icerik/<klasor>
   ```
   `ELEVENLABS_API_KEY` ve `ELEVENLABS_VOICE_ID` ortam değişkenleri gerekir. Çıktı: `ses.mp3` + `hizalama.json` (kelime zamanları).
3. Video:
   ```
   cd araclar/kurgu && npm install && cd ../..
   node araclar/kurgu/render.mjs icerik/<klasor> [--muzik fon.mp3]
   ```
   `ses.mp3` varsa `video.mp4`, yoksa tahmini zamanlamayla sessiz `onizleme.mp4` üretir.
   Hızlı kontrol: `--kareler 0.2,5,20` yalnızca o saniyelerin PNG görüntülerini kaydeder.

## Sahne alanları

- `tur: "baslik"` büyük başlık + emoji (altyazısız giriş), `tur: "son"` kapanış kartı.
- Diğer sahneler şu parçaları yukarıdan aşağı dizer: `etiket` (sarı hap), `ustYazi`, `daire` (`emoji` veya `metin`), `emoji`, `hapler` (mor), `kartlar` (`renk`: `yesil`/`kirmizi`, `soluk`), `altYazi`, `emojiAlt`, `kaynak`.
- `goster` / `...Goster`: öğe, sahnede bu kelime söylendiği anda belirir.
- Üst düzeyde `vurgu`: altyazıda sarı yazılacak kelimeler; `kapak`: videonun ilk ~0,5 sn'sindeki kapak karesi.
