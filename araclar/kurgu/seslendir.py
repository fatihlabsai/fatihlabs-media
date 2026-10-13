"""ElevenLabs ile kurgu.json'daki konuşma metnini seslendirir.

Kullanım: python3 araclar/kurgu/seslendir.py <icerik-klasoru>

Gerekli ortam değişkenleri:
  ELEVENLABS_API_KEY   ElevenLabs API anahtarı
  ELEVENLABS_VOICE_ID  Kullanılacak sesin kimliği (ElevenLabs > Voices > ses > "ID")
İsteğe bağlı:
  ELEVENLABS_MODEL     Varsayılan: eleven_multilingual_v2

Çıktı: klasöre ses.mp3 ve kelime zamanlaması için hizalama.json yazar.
"""
import base64
import json
import os
import sys
import urllib.request
from pathlib import Path

klasor = Path(sys.argv[1])
kurgu = json.loads((klasor / "kurgu.json").read_text(encoding="utf-8"))
metin = " ".join(s["konusma"].strip() for s in kurgu["sahneler"])

anahtar = os.environ.get("ELEVENLABS_API_KEY")
ses_id = os.environ.get("ELEVENLABS_VOICE_ID") or kurgu.get("ses_id")
if not anahtar or not ses_id:
    sys.exit("ELEVENLABS_API_KEY ve ELEVENLABS_VOICE_ID ortam değişkenleri gerekli.")

govde = {
    "text": metin,
    "model_id": os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2"),
    "language_code": kurgu.get("dil", "tr"),
    "voice_settings": kurgu.get("ses_ayarlari", {"stability": 0.45, "similarity_boost": 0.8, "style": 0.25, "use_speaker_boost": True}),
}
istek = urllib.request.Request(
    f"https://api.elevenlabs.io/v1/text-to-speech/{ses_id}/with-timestamps?output_format=mp3_44100_192",
    data=json.dumps(govde).encode(),
    headers={"xi-api-key": anahtar, "Content-Type": "application/json"},
)
with urllib.request.urlopen(istek, timeout=180) as yanit:
    sonuc = json.load(yanit)

(klasor / "ses.mp3").write_bytes(base64.b64decode(sonuc["audio_base64"]))
(klasor / "hizalama.json").write_text(json.dumps(sonuc["alignment"], ensure_ascii=False), encoding="utf-8")
print("Hazır:", klasor / "ses.mp3", f"({len(metin.split())} kelime)")
