// Renderiza alguns instantes em PNG para revisar: node preview.cjs <episódio> 1.2 5.5 ...
// Sem tempos, limpa prev/ e tira um quadro do meio de cada cena (bom para o sheet.sh).
const { abrir, url } = require('./tools/navegador.cjs');
const fs = require('fs');
const path = require('path');
(async () => {
  const ep = process.argv[2];
  let times = process.argv.slice(3).map(Number);
  const prev = path.join(__dirname, 'prev');
  fs.mkdirSync(prev, { recursive: true });
  const browser = await abrir();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', (e) => console.error('ERRO:', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto(url(path.join(__dirname, 'index.html'), '?ep=' + ep));
  await page.evaluate(() => window.ready);
  const [vw, vh] = await page.evaluate(() => [W, H]);
  await page.setViewportSize({ width: vw, height: vh });
  if (!times.length) {
    for (const f of fs.readdirSync(prev)) if (f.startsWith('t_')) fs.unlinkSync(path.join(prev, f));
    times = await page.evaluate(() => SCENES.map((s) => (s.a + Math.min(s.b, DURATION)) / 2));
  }
  for (const t of times) {
    await page.evaluate((t) => window.renderFrame(t), t);
    await page.screenshot({ path: path.join(prev, `t_${t.toFixed(2).padStart(6, '0')}.png`) });
  }
  await browser.close();
  console.log(`${times.length} quadros em prev/`);
})();
