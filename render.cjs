// Render de um trecho do vídeo: node render.cjs <episódio> <worker> <workers> <out.mp4>
// Cada worker pega um bloco contíguo de quadros e manda JPEGs para o ffmpeg.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const FPS = 30;
(async () => {
  const [ep, k, n, out] = [process.argv[2], Number(process.argv[3]), Number(process.argv[4]), process.argv[5]];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', (e) => { console.error('ERRO:', e.message); process.exit(1); });
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?ep=' + ep);
  await page.evaluate(() => window.ready);
  const total = Math.round((await page.evaluate(() => DURATION)) * FPS);
  const per = Math.ceil(total / n), a = k * per, b = Math.min(total, a + per);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '10', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = a; f < b; f++) {
    await page.evaluate((t) => window.renderFrame(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if ((f - a) % 150 === 0) console.log(`w${k}: ${f - a}/${b - a} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await browser.close();
  console.log(`w${k}: pronto ${b - a} quadros em ${((Date.now() - t0) / 1000).toFixed(0)}s`);
})();
