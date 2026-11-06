// Gera a capa de um episódio: node capa.cjs <episódio> [arquivo]
// Lê episodios/<ep>/capa.html e salva out/<ep>-capa.png (1080×1920) e um .jpg para upload.
// Com "miniatura", lê miniatura.html (vídeo longo); o tamanho vem de window.SIZE na página.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
(async () => {
  const ep = process.argv[2], file = process.argv[3] || 'capa';
  const br = await chromium.launch();
  const page = await br.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: Number(process.env.ESCALA || 1) }); // ESCALA=2: miniatura em 2560×1440 (o YouTube pede a maior resolução possível)
  page.on('pageerror', (e) => { console.error('ERRO:', e.message); process.exit(1); });
  await page.goto('file://' + path.join(__dirname, 'episodios', ep, `${file}.html`));
  await page.evaluate(() => window.ready);
  const size = await page.evaluate(() => window.SIZE || null);
  if (size) await page.setViewportSize({ width: size[0], height: size[1] });
  await page.waitForTimeout(200);
  require('fs').mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  const png = path.join(__dirname, 'out', `${ep}-${file}.png`);
  await page.screenshot({ path: png });
  await br.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', png, '-q:v', '2', png.replace(/\.png$/, '.jpg')]);
  console.log(png);
})();
