// Renderiza alguns instantes em PNG para revisar: node preview.cjs <episódio> 1.2 5.5 ...
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const ep = process.argv[2], times = process.argv.slice(3).map(Number);
  require('fs').mkdirSync(path.join(__dirname, 'prev'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', (e) => console.error('ERRO:', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?ep=' + ep);
  await page.evaluate(() => window.ready);
  for (const t of times) {
    await page.evaluate((t) => window.renderFrame(t), t);
    await page.screenshot({ path: path.join(__dirname, 'prev', `t_${t.toFixed(2).padStart(6, '0')}.png`) });
  }
  await browser.close();
})();
