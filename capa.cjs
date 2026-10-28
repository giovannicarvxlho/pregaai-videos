// Gera a capa (miniatura) de um episódio: node capa.cjs <episódio>
// Lê episodios/<ep>/capa.html e salva out/<ep>-capa.png (1080×1920) e um .jpg para upload.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
(async () => {
  const ep = process.argv[2];
  const br = await chromium.launch();
  const page = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', (e) => { console.error('ERRO:', e.message); process.exit(1); });
  await page.goto('file://' + path.join(__dirname, 'episodios', ep, 'capa.html'));
  await page.evaluate(() => window.ready);
  await page.waitForTimeout(200);
  require('fs').mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  const png = path.join(__dirname, 'out', `${ep}-capa.png`);
  await page.screenshot({ path: png });
  await br.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', png, '-q:v', '2', png.replace(/\.png$/, '.jpg')]);
  console.log(png);
})();
