// Testes do repo: `npm test` (roda também no GitHub, a cada push e PR: .github/workflows/testes.yml).
//   node tools/testar.cjs [episódio ...]   (sem argumento, todos os episódios)
// 1. Todo episódio com scenes.js abre e desenha um quadro por segundo sem erro, e todo wordTime(i, 'palavra')
//    acha a palavra na frase (se não acha, a cena cai no começo da frase sem avisar).
// 2. O texto do data.js bate com o narracao.txt, palavra por palavra em ordem: pega frase trocada no roteiro
//    sem refazer os tempos.
// 3. O corte.json aponta para frases que existem, com layout conhecido e título nos curtos.
// 4. Nenhum corte começa no meio da fala: mede o áudio logo no início de cada trecho (defeito dos curtos do
//    eu-sou, corrigido em 11/11/2026).
// Sai com código 1 se algo falhar, e diz o quê.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { abrir, url } = require('./navegador.cjs');

const RAIZ = path.join(__dirname, '..');
const EPS = path.join(RAIZ, 'episodios');
const TELA = [['Prega aí', 'PregaAI']];
const MIN_TEXTO = 0.9;      // fração mínima das palavras do narracao.txt achadas em ordem no data.js
const MIN_LINHA = 0.6;      // e de cada frase com 4 palavras ou mais
const VOZ_DB = -35;         // pico acima disto nos primeiros 60 ms do trecho = começou na fala

const falhas = [];
const falha = (ep, msg) => falhas.push(`${ep}: ${msg}`);

const norm = (w) => w.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const palavras = (txt) => txt.split(/\s+/).map(norm).filter(Boolean);

function dados(ep) {
  const src = fs.readFileSync(path.join(EPS, ep, 'data.js'), 'utf8');
  return new Function(src.replace(/^const FORMAT.*$/m, '') +
    '; return { SEGS, DURATION, AUDIO_END: typeof AUDIO_END === "undefined" ? null : AUDIO_END };')();
}

// Casa as palavras do narracao.txt com as do data.js em ordem (maior subsequência comum) e diz,
// para cada linha do narracao.txt, quantas palavras dela acharam par.
function casar(a, b) {
  const n = a.length, m = b.length, L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const achou = new Array(n).fill(false);
  for (let i = 0, j = 0; i < n && j < m;) {
    if (a[i] === b[j]) { achou[i] = true; i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++;
  }
  return achou;
}

function textoBate(ep) {
  const nt = path.join(EPS, ep, 'narracao.txt');
  if (!fs.existsSync(nt)) return;
  let narr = fs.readFileSync(nt, 'utf8');
  for (const [voz, tela] of TELA) narr = narr.split(voz).join(tela);
  const linhas = narr.split('\n').filter((l) => l.trim() && l.trim() !== '---');
  const a = [], dono = [];
  linhas.forEach((l, li) => palavras(l).forEach((w) => { a.push(w); dono.push(li); }));
  const b = palavras(dados(ep).SEGS.map((s) => s[2].replace(/^!/, '').replace(/[|*]/g, ' ')).join(' '));
  const achou = casar(a, b);
  const total = achou.filter(Boolean).length / Math.max(1, a.length);
  if (total < MIN_TEXTO) falha(ep, `só ${(total * 100).toFixed(0)}% das palavras do narracao.txt estão no data.js, na ordem (mínimo ${MIN_TEXTO * 100}%)`);
  linhas.forEach((l, li) => {
    const ks = dono.map((d, k) => (d === li ? k : -1)).filter((k) => k >= 0);
    if (ks.length < 4) return;
    const r = ks.filter((k) => achou[k]).length / ks.length;
    if (r < MIN_LINHA) falha(ep, `a frase do narracao.txt não está no data.js (${(r * 100).toFixed(0)}% das palavras): "${l.trim().slice(0, 70)}". Mudou o texto sem refazer os tempos (tools/tempos.py)?`);
  });
}

function picoNoInicio(mp3, t0) {
  const r = spawnSync('ffmpeg', ['-v', 'info', '-ss', String(Math.max(0, t0)), '-t', '0.06', '-i', mp3,
    '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /max_volume: (-?[\d.]+|-inf) dB/.exec(r.stderr || '');
  return m ? (m[1] === '-inf' ? -Infinity : Number(m[1])) : null;
}

function cortes(ep) {
  const cj = path.join(EPS, ep, 'corte.json');
  if (!fs.existsSync(cj)) return;
  const cfg = JSON.parse(fs.readFileSync(cj, 'utf8'));
  if (!fs.existsSync(path.join(EPS, cfg.fonte || '', 'data.js'))) return falha(ep, `corte.json: a origem "${cfg.fonte}" não tem data.js`);
  const { SEGS } = dados(cfg.fonte);
  const mp3 = path.join(EPS, cfg.fonte, 'narration.mp3');
  const temAudio = fs.existsSync(mp3);
  for (const s of cfg.saidas || []) {
    const nome = s.nome || '(sem nome)';
    if (!Array.isArray(s.frases) || !s.frases.length) { falha(ep, `corte ${nome}: sem frases`); continue; }
    const ruins = s.frases.filter((i) => !Number.isInteger(i) || i < 0 || i >= SEGS.length);
    if (ruins.length) { falha(ep, `corte ${nome}: frases que não existem no SEGS (${SEGS.length} frases): ${ruins.join(', ')}`); continue; }
    if (s.layout && !['vertical', 'cheia'].includes(s.layout)) falha(ep, `corte ${nome}: layout "${s.layout}" desconhecido`);
    if (s.layout && !s.titulo) falha(ep, `corte ${nome}: curto sem título`);
    if (typeof s.tiktok === 'number' && (s.tiktok < 0 || s.tiktok >= SEGS.length)) falha(ep, `corte ${nome}: "tiktok" aponta para a frase ${s.tiktok}, que não existe`);
    if (!temAudio) continue;
    // início de cada trecho contínuo, igual ao tools/corte.cjs
    const lista = [...new Set(s.frases)];
    for (let k = 0; k < lista.length; k++) {
      let j = k;
      while (j + 1 < lista.length && lista[j + 1] === lista[j] + 1) j++;
      const i0 = lista[k];
      const antes = i0 > 0 ? Math.min(0.15, (SEGS[i0][0] - SEGS[i0 - 1][1]) / 2) : Math.min(0.15, SEGS[i0][0]);
      const t0 = SEGS[i0][0] - antes;
      if (t0 < 0.05) { k = j; continue; }  // começo da narração: a voz começa ali mesmo, não é corte
      const db = picoNoInicio(mp3, t0);
      if (db !== null && db > VOZ_DB) falha(ep, `corte ${nome}: o trecho da frase ${i0} começa no meio da fala (${db} dB em ${t0.toFixed(2)} s): o SEGS[${i0}] está atrasado em relação ao áudio`);
      k = j;
    }
  }
}

async function cenas(browser, ep) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  await page.goto(url(path.join(RAIZ, 'index.html'), '?ep=' + ep));
  await page.evaluate(() => window.ready);
  const r = await page.evaluate(() => {
    const orig = window.wordTime, falta = new Set();
    window.wordTime = (i, w) => {
      let achou = false;
      for (const c of CHUNKS) if (c.seg === i) for (const x of c.words) if (x.w.replace(/[^\p{L}]/gu, '').toLowerCase() === w.toLowerCase()) achou = true;
      if (!achou) falta.add(`${i}:${w}`);
      return orig(i, w);
    };
    let quadros = 0;
    for (let t = 0; t < DURATION; t += 1) { window.renderFrame(t); quadros++; }
    return { quadros, falta: [...falta] };
  });
  await page.close();
  for (const e of [...new Set(erros)].slice(0, 5)) falha(ep, `erro ao desenhar: ${e}`);
  if (r.falta.length) falha(ep, `wordTime não acha a palavra na frase (a cena cai no começo dela): ${r.falta.slice(0, 8).join(', ')}`);
  return r.quadros;
}

(async () => {
  const pedidos = process.argv.slice(2);
  const eps = fs.readdirSync(EPS).filter((e) => !e.startsWith('_') && fs.existsSync(path.join(EPS, e, 'data.js')))
    .filter((e) => !pedidos.length || pedidos.includes(e)).sort();
  const browser = await abrir();
  let quadros = 0;
  for (const ep of eps) {
    try {
      if (fs.existsSync(path.join(EPS, ep, 'scenes.js'))) quadros += await cenas(browser, ep);
      textoBate(ep);
      cortes(ep);
    } catch (e) {
      falha(ep, `o teste quebrou: ${e.message}`);
    }
  }
  await browser.close();
  console.log(`${eps.length} episódios, ${quadros} quadros desenhados`);
  if (falhas.length) {
    for (const f of falhas) console.error('✘ ' + f);
    process.exit(1);
  }
  console.log('✔ tudo certo');
})();
