// Render de um trecho do vídeo: node render.cjs <episódio> <worker> <workers> <out.mp4>
// Cada worker pega um bloco contíguo de quadros e manda JPEGs para o ffmpeg.
// CORTE=<arquivo.json> (gerado pelo tools/corte.cjs): vídeo cortado. O quadro do tempo tv do vídeo final
// mostra a narração no tempo t do trecho correspondente; layout, enquadramento, gancho, título e banner vão na URL.
const { abrir, url } = require('./tools/navegador.cjs');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const FPS = 30;
(async () => {
  const [ep, k, n, out] = [process.argv[2], Number(process.argv[3]), Number(process.argv[4]), process.argv[5]];
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
  page.on('pageerror', (e) => { console.error('ERRO:', e.message); process.exit(1); });
  await page.goto(url(path.join(__dirname, 'index.html'), '?ep=' + ep + q));
  await page.evaluate(() => window.ready);
  const [vw, vh] = await page.evaluate(() => [window.VW || W, window.VH || H]);
  await page.setViewportSize({ width: vw, height: vh });
  // T0/T1 (segundos, opcionais) renderizam só um trecho, para revisar partes de um vídeo longo.
  const f0 = Math.round(Number(process.env.T0 || 0) * FPS);
  const fimVideo = corte ? corte.trechos.reduce((s, [a, b]) => s + b - a, 0) : await page.evaluate(() => DURATION);
  const total = Math.round((process.env.T1 ? Number(process.env.T1) : fimVideo) * FPS) - f0;
  const per = Math.ceil(total / n), a = f0 + k * per, b = Math.min(f0 + total, a + per);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '10', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = a; f < b; f++) {
    await page.evaluate(([t, tv]) => window.renderFrame(t, tv), [mapa(f / FPS), f / FPS]);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if ((f - a) % 150 === 0) console.log(`w${k}: ${f - a}/${b - a} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await browser.close();
  console.log(`w${k}: pronto ${b - a} quadros em ${((Date.now() - t0) / 1000).toFixed(0)}s`);
})();
