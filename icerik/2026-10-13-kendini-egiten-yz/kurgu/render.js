const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs'), { spawn } = require('child_process');
(async () => {
  const [,, html, words, dur, out, fps, only] = process.argv;
  const W = fs.readFileSync(words, 'utf8');
  const src = fs.readFileSync(html, 'utf8').replace('WORDS_JSON', W).replace('DURATION', dur);
  fs.writeFileSync(html.replace('.html', '.built.html'), src);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + html.replace('.html', '.built.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  if (only) { for (const t of only.split(',')) { await p.evaluate(t => setT(t), +t); await p.screenshot({ path: `${out}_${t}.png` }); } await b.close(); return; }
  const n = Math.ceil(+dur * +fps);
  const ff = spawn('ffmpeg', ['-v','error','-y','-f','image2pipe','-framerate',fps,'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',out], { stdio: ['pipe','inherit','inherit'] });
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => setT(t), i / +fps);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(i, '/', n);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
})();
