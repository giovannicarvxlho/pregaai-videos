// Renderiza alguns instantes em PNG para revisar: node preview.cjs <episódio> 1.2 5.5 ...
// Sem tempos, limpa prev/ e tira um quadro do meio de cada cena (bom para o sheet.sh).
const { abrir, url } = require('./tools/navegador.cjs');
const fs = require('fs');
const path = require('path');
// CORTE=<arquivo.json>: os tempos pedidos são do vídeo cortado (ver render.cjs).
(async () => {
  const ep = process.argv[2];
  let times = process.argv.slice(3).map(Number);
  const prev = path.join(__dirname, 'prev');
  fs.mkdirSync(prev, { recursive: true });
  const corte = process.env.CORTE ? JSON.parse(fs.readFileSync(process.env.CORTE, 'utf8')) : null;
  const q = corte ? (corte.layout ? '&layout=' + corte.layout : '') + (corte.titulo ? '&titulo=' + encodeURIComponent(corte.titulo) : '') + (corte.cta ? '&cta=1' : '') + (corte.refs ? '&refs=' + encodeURIComponent(JSON.stringify(corte.refs)) : '') + (corte.frases ? '&frases=' + corte.frases.join(',') : '') + (corte.foco ? '&foco=' + encodeURIComponent(JSON.stringify(corte.foco)) : '') + (corte.gancho ? '&gancho=' + encodeURIComponent(corte.gancho) : '') : '';
  const mapa = (tv) => {
    if (!corte) return tv;
    let acc = 0;
    for (const [a, b] of corte.trechos) { if (tv < acc + (b - a)) return a + (tv - acc); acc += b - a; }
    return corte.trechos[corte.trechos.length - 1][1];
  };
  const browser = await abrir();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', (e) => console.error('ERRO:', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto(url(path.join(__dirname, 'index.html'), '?ep=' + ep + q));
  await page.evaluate(() => window.ready);
  const [vw, vh] = await page.evaluate(() => [window.VW || W, window.VH || H]);
  await page.setViewportSize({ width: vw, height: vh });
  if (!times.length) {
    for (const f of fs.readdirSync(prev)) if (f.startsWith('t_')) fs.unlinkSync(path.join(prev, f));
    times = corte ? [] : await page.evaluate(() => SCENES.map((s) => (s.a + Math.min(s.b, DURATION)) / 2));
    if (corte) { const tot = corte.trechos.reduce((s, [a, b]) => s + b - a, 0); for (let x = 1; x < tot; x += 6) times.push(x); }
  }
  for (const t of times) {
    await page.evaluate(([t, tv]) => window.renderFrame(t, tv), [mapa(t), t]);
    await page.screenshot({ path: path.join(prev, `t_${t.toFixed(2).padStart(6, '0')}.png`) });
  }
  await browser.close();
  console.log(`${times.length} quadros em prev/`);
})();
