# Seslendirme ve kurgu

Çıktı: `shorts/2026-10-13-kendini-egiten-yz.mp4` (1080x1920, 30 fps, ~52 sn)

1. `tts.py` — senaryo-tr.md metnini Microsoft Edge TTS (`tr-TR-AhmetNeural`, +%22 hız) ile seslendirir, kelime zamanlarını `words.json`'a yazar.
2. `tighten.py` — cümle arası uzun duraklamaları kısaltır, sesi -14 LUFS'a normalize eder (`voice2.wav`, `words2.json`).
3. `video.html` — sahneler, ekran yazıları ve kelime kelime altyazı (kanalın mor ızgaralı stili).
4. `render.js` — sayfayı Playwright ile kare kare çekip ffmpeg'e verir:
   `node render.js $PWD/video.html words2.json <süre> silent.mp4 30`
   Sonra ses eklenir: `ffmpeg -i silent.mp4 -i voice2.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out.mp4`
