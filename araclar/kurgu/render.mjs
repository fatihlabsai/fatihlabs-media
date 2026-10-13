// Kullanım: node araclar/kurgu/render.mjs <icerik-klasoru> [--onizleme] [--muzik dosya.mp3]
// Klasörde kurgu.json olmalı. ses.mp3 + hizalama.json varsa (seslendir.py üretir) gerçek seslendirmeyle,
// yoksa tahmini zamanlamayla sessiz önizleme üretir.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ARAC = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const klasor = path.resolve(argv[0]);
const muzikIdx = argv.indexOf('--muzik');
const muzik = muzikIdx > -1 ? path.resolve(argv[muzikIdx + 1]) : null;
const FPS = 30;

const kurgu = JSON.parse(fs.readFileSync(path.join(klasor, 'kurgu.json'), 'utf8'));
const sesDosya = path.join(klasor, 'ses.mp3');
const hizDosya = path.join(klasor, 'hizalama.json');
const gercekSes = fs.existsSync(sesDosya) && fs.existsSync(hizDosya) && !argv.includes('--onizleme');
const sesBaslangic = kurgu.kapak ? 0.45 : 0.15;

// Kelime zamanlarını çıkar
const metin = kurgu.sahneler.map(s => s.konusma.trim()).join(' ');
let kelimeler = [];
if (gercekSes) {
  const a = JSON.parse(fs.readFileSync(hizDosya, 'utf8'));
  const ch = a.characters, bs = a.character_start_times_seconds, bt = a.character_end_times_seconds;
  let cur = null;
  for (let i = 0; i < ch.length; i++) {
    if (/\s/.test(ch[i])) { if (cur) { kelimeler.push(cur); cur = null; } continue; }
    if (!cur) cur = { w: '', bas: bs[i], bit: bt[i] };
    cur.w += ch[i]; cur.bit = bt[i];
  }
  if (cur) kelimeler.push(cur);
} else {
  let t = 0;
  for (const w of metin.split(/\s+/)) {
    const d = 0.045 * w.length + 0.08;
    kelimeler.push({ w, bas: t, bit: t + d });
    t += d + (/[.?!:]$/.test(w) ? 0.3 : /[,;]$/.test(w) ? 0.12 : 0.01);
  }
}
for (const k of kelimeler) { k.bas += sesBaslangic; k.bit += sesBaslangic; }

const beklenen = metin.split(/\s+/).length;
if (kelimeler.length !== beklenen) throw new Error(`Kelime sayısı uyuşmuyor: hizalama ${kelimeler.length}, metin ${beklenen}`);

let i = 0;
for (const [n, s] of kurgu.sahneler.entries()) {
  const adet = s.konusma.trim().split(/\s+/).length;
  s.kelimeler = kelimeler.slice(i, i + adet);
  s.bas = n === 0 ? sesBaslangic : s.kelimeler[0].bas - 0.08;
  i += adet;
}
const sonKelime = kelimeler[kelimeler.length - 1].bit;
const sure = +(sonKelime + 1.4).toFixed(2);
const veri = { ...kurgu, sesBaslangic, sure };

const cikis = path.join(klasor, gercekSes ? 'video.mp4' : 'onizleme.mp4');
const gecici = path.join(klasor, '.goruntu.mp4');
console.log(`${gercekSes ? 'Gerçek ses' : 'ÖNİZLEME (tahmini zamanlama, sessiz)'} · ${sure}s · ${Math.ceil(sure * FPS)} kare`);

const tarayici = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const sayfa = await tarayici.newPage({ viewport: { width: 1080, height: 1920 } });
await sayfa.addInitScript(v => { window.KURGU = v; }, veri);
await sayfa.goto('file://' + path.join(ARAC, 'sablon.html'));
await sayfa.evaluate(() => document.fonts.ready);

// --kareler 0.2,3,10 → sadece bu anların PNG görüntülerini kaydet (hızlı kontrol için)
const kIdx = argv.indexOf('--kareler');
if (kIdx > -1) {
  for (const t of argv[kIdx + 1].split(',').map(Number)) {
    await sayfa.evaluate(t => window.ciz(t), t);
    await sayfa.screenshot({ path: path.join(klasor, `kare-${t}.png`) });
  }
  await tarayici.close();
  process.exit(0);
}

const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '19', gecici], { stdio: ['pipe', 'inherit', 'inherit'] });
const kareSayisi = Math.ceil(sure * FPS);
for (let f = 0; f < kareSayisi; f++) {
  await sayfa.evaluate(t => window.ciz(t), f / FPS);
  const kare = await sayfa.screenshot({ type: 'jpeg', quality: 93 });
  if (!ff.stdin.write(kare)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 150 === 0) process.stdout.write(`  kare ${f}/${kareSayisi}\n`);
}
ff.stdin.end();
await new Promise((r, j) => ff.on('close', c => (c === 0 ? r() : j(new Error('ffmpeg hata ' + c)))));
await tarayici.close();

// Ses birleştirme
const gecikme = Math.round(sesBaslangic * 1000);
const args = ['-v', 'error', '-y', '-i', gecici];
let filtre = null;
if (gercekSes) {
  args.push('-i', sesDosya);
  if (muzik) {
    args.push('-stream_loop', '-1', '-i', muzik);
    filtre = `[1:a]adelay=${gecikme}|${gecikme},loudnorm=I=-16:TP=-1.5[v];[2:a]volume=0.12,afade=t=out:st=${sure - 1}:d=1[m];[v][m]amix=inputs=2:duration=first:normalize=0[a]`;
  } else {
    filtre = `[1:a]adelay=${gecikme}|${gecikme},loudnorm=I=-16:TP=-1.5,apad[a]`;
  }
} else if (muzik) {
  args.push('-stream_loop', '-1', '-i', muzik);
  filtre = `[1:a]volume=0.12,afade=t=out:st=${sure - 1}:d=1[a]`;
}
if (filtre) args.push('-filter_complex', filtre, '-map', '0:v', '-map', '[a]', '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-shortest');
else args.push('-map', '0:v');
args.push('-c:v', 'copy', '-t', String(sure), '-movflags', '+faststart', cikis);
await new Promise((r, j) => spawn('ffmpeg', args, { stdio: 'inherit' }).on('close', c => (c === 0 ? r() : j(new Error('ffmpeg ses hata ' + c)))));
fs.unlinkSync(gecici);
console.log('Hazır:', cikis);
