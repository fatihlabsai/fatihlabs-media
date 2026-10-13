# Ajan ve Alt Ajan Rehberi (Sıfırdan)

## 1. Bu ne demek?

- **Ajan:** Kendisine verilen bir işi adım adım, araç kullanarak (internette arama, dosya okuma/yazma) kendi başına yapan yapay zekâ. Claude Code'da konuştuğun Claude zaten bir ajandır — buna **ana ajan** diyoruz.
- **Alt ajan (subagent):** Ana ajanın iş verdiği "uzman çalışan". Her birinin tek bir görevi, kendi talimatları ve kendi araçları var. Kendi ayrı hafızasıyla çalışır, işini bitirince sonucu ana ajana teslim eder.

Bir benzetme: Ana ajan **yapımcı**, alt ajanlar **ekip** (araştırmacı, senarist, çevirmen…). Sen sadece yapımcıyla konuşursun.

## 2. Neden alt ajan?

- **Odak:** Her biri tek işe odaklandığı için daha iyi sonuç verir.
- **Paralellik:** Çevirmen ve yayın metni yazarı aynı anda çalışabilir.
- **Temiz hafıza:** Araştırmacının okuduğu onlarca sayfa ana sohbeti doldurmaz; sadece özeti gelir.
- **Tekrar kullanılabilir:** Bir kere yazarsın, her gün kullanırsın.

## 3. Bu repoda kurulu ekip

| Alt ajan | Görevi | Dosya |
|---|---|---|
| `gundem-arastirmaci` | Güncel YZ haberlerinden 5 konu önerir | `.claude/agents/gundem-arastirmaci.md` |
| `dogrulayici` | Senaryodaki iddiaları kaynaklarla kontrol eder | `.claude/agents/dogrulayici.md` |
| `senarist` | 30-60 sn Türkçe senaryo yazar | `.claude/agents/senarist.md` |
| `cevirmen` | Senaryoyu İngilizce izleyiciye uyarlar | `.claude/agents/cevirmen.md` |
| `yayin-metni` | Başlık, açıklama, hashtag ve dosya adı önerir | `.claude/agents/yayin-metni.md` |

Bunları sırayla çalıştıran akış (yönetici talimatı): `.claude/skills/yeni-short/SKILL.md`

```
            Sen
             │
        Ana ajan (yapımcı)  ← /yeni-short
             │
   gundem-arastirmaci → senarist → dogrulayici
                                      │
                         ┌────────────┴────────────┐
                      cevirmen               yayin-metni   (aynı anda)
```

Sonuçlar `icerik/<tarih>-<konu>/` klasörüne kaydedilir.

## 4. Nasıl kullanırım?

Claude Code'da bu repoyu açıp şunlardan birini yaz:

- `/yeni-short` → baştan sona her şeyi yapar, konu seçimini sana sorar.
- `/yeni-short Gemini'nin yeni özelliği` → konuyu sen verirsin.
- `gundem-arastirmaci ile bugünün konularını bul` → tek bir alt ajanı çağırırsın.
- `dogrulayici ile icerik/.../senaryo-tr.md dosyasını kontrol et`

Kurulu alt ajanları görmek ve düzenlemek için Claude Code'da `/agents` yaz.

## 5. Kendi alt ajanını yapmak

`.claude/agents/` klasörüne yeni bir `.md` dosyası ekle. Şablon:

```markdown
---
name: kapak-fikircisi
description: Video için kapak görseli fikirleri üretir. Senaryo hazır olunca kullan.
tools: Read, Write
---

Sen ... (buraya ne yapacağını, kurallarını ve çıktı biçimini yaz)
```

Üç önemli alan:
- **name:** Küçük harf, tire ile. Çağırırken bu adı kullanırsın.
- **description:** Ana ajan, hangi alt ajanı ne zaman çağıracağına buna bakarak karar verir. Net yaz: "Ne yapar + ne zaman kullanılır".
- **tools:** İzin verilen araçlar. Yazmazsan hepsine izin verilir. Sık kullanılanlar: `Read` (dosya oku), `Write` (dosya yaz), `Edit` (dosya düzenle), `WebSearch` (internette ara), `WebFetch` (sayfa aç), `Bash` (komut çalıştır).

Alttaki metin ise alt ajanın "iş tanımı"dır — yeni işe başlayan birine yazar gibi açık yaz.

## 6. İpuçları

- Küçük başla: önce tek bir alt ajanı tek başına dene, sonucu beğenmezsen talimatını düzelt.
- Bir alt ajan bir iş yapsın. "Hem araştır hem yaz hem çevir" yerine üç ayrı alt ajan.
- Alt ajanlar başka alt ajan çağıramaz; zinciri her zaman ana ajan (veya `/yeni-short` gibi bir akış) yönetir.
- Talimatları beğenmediğinde dosyayı düzenlemen yeterli — kod bilgisi gerekmez, düz Türkçe yazı.
