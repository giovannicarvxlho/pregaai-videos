// Gera as 5 imagens do carrossel em out/carrossel-depois-da-cruz-<n>.png e .jpg: node episodios/carrossel-depois-da-cruz/render.cjs
const { abrir, url } = require('../../tools/navegador.cjs');
const { execFileSync } = require('child_process');
const path = require('path');
(async () => {
  const br = await abrir();
  const page = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', (e) => { console.error('ERRO:', e.message); process.exit(1); });
  const out = path.join(__dirname, '..', '..', 'out');
  require('fs').mkdirSync(out, { recursive: true });
  for (let n = 1; n <= 5; n++) {
    await page.goto(url(path.join(__dirname, 'slide.html'), '?n=' + n));
    await page.evaluate(() => window.ready);
    await page.waitForTimeout(150);
    const png = path.join(out, `carrossel-depois-da-cruz-${n}.png`);
    await page.screenshot({ path: png });
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', png, '-q:v', '2', png.replace(/\.png$/, '.jpg')]);
    console.log(png);
  }
  await br.close();
})();
