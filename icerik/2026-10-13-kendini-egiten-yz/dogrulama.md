# Doğruluk kontrolü: senaryo-tr.md (1. tur)

_dogrulayici alt ajanı, 13 Ekim 2026. pub.sakana.ai, arxiv.org ve the-decoder.com açılamadı (DNS hatası). Birincil kaynaklardan yalnızca GitHub deposu (README) okundu; geri kalanı arama sonuçları ve ikincil haberlerden doğrulandı._

| İddia | Durum | Kaynak | Not |
|---|---|---|---|
| Sakana AI bir Japon şirketi | ✅ Doğru | Wikipedia, sakana.ai/company-info, TechCrunch | Tokyo merkezli, 2023'te kuruldu. |
| Sakana AI "MASS" adında bir yöntem denedi | ✅ Doğru | github.com/SakanaAI/mass, arxiv 2610.12176 | MASS = Multi-Agent Self-Supervision. Aramalara göre UC Berkeley ile ortak çalışma. |
| Tek bir model birden fazla işi yapıyor | ✅ Doğru | GitHub README | "executor, optimizer, and in-loop evaluator". Temel model Qwen3.6-27B. |
| Üç iş: çöz, puanla, kendini eğit | ⚠️ Sadeleştirilmiş | GitHub README | Kaynaktaki roller: çözücü, iş akışını iyileştiren, değerlendirici; eğitim ayrı bir adım. Kısa video için kabul edilebilir. |
| "Model gerçekten gelişiyor" | ⚠️ Kısmen doğru | GitHub README sonuç tablosu | Araştırma testlerinde gelişme var (ScienceAgentBench 28,8→31,7; MLR-Bench 1,71→2,25); Terminal-Bench 2.0 ve SWE-bench Verified'da hafif düşüş. |
| Hatayı kaçırırsa başarı sanıyor ve pekiştiriyor | ✅ Doğru | The Decoder başlığı, Sakana blog özeti | Yazarlar bunu bir risk olarak belirtiyor. |
| "Kör noktası büyüyor" | ⚠️ Abartılı | Aynı kaynaklar | Kaynaklar "pekiştirilebilir" diyor; büyüdüğü ölçülmemiş (deney 2 tur). |
| Kaynak: pub.sakana.ai/mass | ❓ Doğrulanamadı | Arama sonuçları | Yayından önce tarayıcıda açılıp kontrol edilmeli. |

**KARAR: YAYINLANABİLİR** (küçük düzeltmelerle)

Önerilen düzeltmeler:
1. "Model gerçekten gelişiyor" → "araştırma görevlerinde gelişiyor".
2. "Kör noktası büyüyor" ve "her turda büyüyen leke" görseli → "pekişebilir".
3. İsteğe bağlı: UC Berkeley ortaklığını kaynak notuna ekle.
4. pub.sakana.ai/mass bağlantısını yayından önce elle kontrol et.

Kaynaklar:
- https://github.com/SakanaAI/mass
- https://the-decoder.com/sakana-ais-self-improving-model-gets-better-at-solving-and-judging-but-cant-catch-its-own-blind-spots/
- https://sakana.ai/mass/
- https://aiweekly.co/alerts/sakana-ais-mass-teaches-multi-agent-workflows-to-self-improve
- https://en.wikipedia.org/wiki/Sakana_AI
