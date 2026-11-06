// Monta vídeos cortados de um episódio já narrado e animado, sem narração nova:
//   node tools/corte.cjs episodios/<ep>/corte.json [nome-da-saida]
// O corte.json diz o episódio de origem e, para cada saída, as frases que ficam (índices do SEGS do data.js
// da origem). O vídeo final pula o resto: cada quadro chama as cenas e a legenda da origem no tempo certo
// (render.cjs com CORTE), e o áudio é a mesma narração, cortada nos mesmos pontos.
// Serve para o longo de 4 a 5 min recortado de um longo maior e para os curtos verticais tirados do longo.
//
// Campos de cada saída: nome (sai em out/<nome>.mp4), frases, cartao (segundos do cartão final, sem áudio),
// SO_MAPA=1 só escreve out/<nome>.corte.json, para revisar quadros com CORTE=... node preview.cjs.
// tiktok (também gera out/<nome>-tiktok.mp4, sem o cartão), layout ("vertical" para curto), titulo (texto fixo
// em cima, no curto; *palavra* sai em azul) e cta (banner do app a cada 30 s).
const { execFileSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const cfgPath = process.argv[2];
if (!cfgPath) { console.error('uso: node tools/corte.cjs episodios/<ep>/corte.json [nome-da-saida]'); process.exit(1); }
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const so = process.argv[3];
const N = Number(process.env.N || 3);
const OUT = path.join(RAIZ, 'out');
fs.mkdirSync(OUT, { recursive: true });

// SEGS e o resto do data.js da origem
const dataJs = fs.readFileSync(path.join(RAIZ, 'episodios', cfg.fonte, 'data.js'), 'utf8');
const D = new Function(dataJs.replace(/^const FORMAT.*$/m, '') + '; return { SEGS, AUDIO_END, DURATION, PARTS: typeof PARTS === "undefined" ? null : PARTS };')();
const SEGS = D.SEGS;

// Narração da origem (o longo vem em partes; o juntar.py monta o narration.mp3 se faltar)
const dirFonte = path.join(RAIZ, 'episodios', cfg.fonte);
const narr = path.join(dirFonte, 'narration.mp3');
if (!fs.existsSync(narr)) {
  const py = ['python3', 'python'].find((p) => { try { execFileSync(p, ['--version']); return true; } catch { return false; } });
  execFileSync(py, [path.join(RAIZ, 'tools', 'juntar.py'), dirFonte], { stdio: 'inherit' });
}

// Frases que ficam → trechos contínuos da narração. Cada trecho começa um pouco antes da 1ª frase e
// termina com a pausa natural depois da última (no máximo 0,6 s), para o corte respirar como a fala.
function trechos(frases) {
  const lista = [...new Set(frases)].sort((a, b) => a - b), out = [];
  for (let k = 0; k < lista.length; k++) {
    let j = k;
    while (j + 1 < lista.length && lista[j + 1] === lista[j] + 1) j++;
    const i0 = lista[k], i1 = lista[j];
    const antes = i0 > 0 ? Math.min(0.15, (SEGS[i0][0] - SEGS[i0 - 1][1]) / 2) : Math.min(0.15, SEGS[i0][0]);
    const depois = i1 + 1 < SEGS.length ? Math.min(0.6, SEGS[i1 + 1][0] - SEGS[i1][1]) : 0.6;
    out.push([+(SEGS[i0][0] - antes).toFixed(3), +(SEGS[i1][1] + depois).toFixed(3)]);
    k = j;
  }
  return out;
}

const roda = (cmd, args, env = {}) => new Promise((ok, erro) => {
  const p = spawn(cmd, args, { stdio: 'inherit', env: { ...process.env, ...env }, cwd: RAIZ });
  p.on('close', (c) => (c === 0 ? ok() : erro(new Error(`${cmd} saiu com ${c}`))));
});

(async () => {
  for (const s of cfg.saidas) {
    if (so && s.nome !== so) continue;
    const fala = trechos(s.frases);
    const tFala = fala.reduce((acc, [a, b]) => acc + b - a, 0);
    const video = [...fala];
    // Cartão final: o trecho da origem onde ele começa, só a imagem (o áudio da origem ali não entra).
    if (s.cartao) {
      const t0 = Number(cfg.cartao_inicio ?? (D.AUDIO_END + 0.2));
      video.push([t0, t0 + s.cartao]);
    }
    const total = video.reduce((acc, [a, b]) => acc + b - a, 0);
    const mapaPath = path.join(OUT, `${s.nome}.corte.json`);
    fs.writeFileSync(mapaPath, JSON.stringify({ trechos: video, layout: s.layout || null, titulo: s.titulo || null, cta: !!s.cta }));
    console.log(`\n== ${s.nome}: ${fala.length} trechos, fala ${tFala.toFixed(1)} s, vídeo ${total.toFixed(1)} s`);
    if (process.env.SO_MAPA) continue; // só escreve o mapa (para o preview.cjs com CORTE)

    // Áudio: os mesmos trechos da narração, com 20 ms de fade em cada ponta para não estalar; silêncio no cartão.
    const wav = path.join(OUT, `${s.nome}.wav`);
    const filtro = fala.map(([a, b], i) => `[0:a]atrim=${a}:${b},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=${(b - a - 0.02).toFixed(3)}:d=0.02[a${i}]`).join(';') +
      ';' + fala.map((_, i) => `[a${i}]`).join('') + `concat=n=${fala.length}:v=0:a=1,apad=whole_dur=${total.toFixed(3)}[out]`;
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', narr, '-filter_complex', filtro, '-map', '[out]', '-ar', '48000', wav]);

    // Imagem: N workers, cada um com um bloco de quadros (render.cjs com o mapa de tempo).
    const partes = [...Array(N).keys()].map((k) => path.join(OUT, `${s.nome}_seg_${k}.mp4`));
    await Promise.all(partes.map((p, k) => roda('node', ['render.cjs', cfg.fonte, String(k), String(N), p], { CORTE: mapaPath })));
    const lista = path.join(OUT, `${s.nome}_lista.txt`);
    fs.writeFileSync(lista, partes.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
    const mp4 = path.join(OUT, `${s.nome}.mp4`);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-i', wav,
      '-filter_complex', '[1:a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]', '-map', '0:v', '-map', '[a]', '-t', total.toFixed(3),
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.2', '-r', '30',
      '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', mp4]);
    [...partes, lista, wav].forEach((f) => fs.rmSync(f, { force: true }));
    console.log(mp4);

    // TikTok: o mesmo vídeo terminando na última fala, sem o cartão final.
    if (s.tiktok) {
      const tk = path.join(OUT, `${s.nome}-tiktok.mp4`);
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', mp4, '-t', tFala.toFixed(3), '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
        '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', tk]);
      console.log(tk);
    }
  }
})().catch((e) => { console.error('ERRO:', e.message); process.exit(1); });
