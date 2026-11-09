// Arte das capas e miniaturas do episódio (carregada depois de data.js, lib.js e scenes.js).
// Três heróis, cada um com um motivo para clicar: a rede com 153 peixes (curiosidade), Pedro chorando na
// fogueira da manhã (emoção: a terceira pergunta) e Pedro velho, de mãos estendidas (João 21:18; 2 Pedro 1:14).
const CHUNKS = buildChunks(SEGS); // as funções de cena usam wordTime
const T = 2.0;
const MANTO = '#7E5236'; // de perto, a roupa de Pedro (C.p500) some contra a pele; nas capas ela fica um tom mais escura
const VIN = (o = 0.55, cx = '50%', cy = '50%', r = '72%') => `<defs><radialGradient id="vin" cx="${cx}" cy="${cy}" r="${r}"><stop offset="50%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${o}"/></radialGradient></defs><rect x="-400" y="-400" width="2720" height="1880" fill="url(#vin)"/>`;
const LUZ = (x, y, r, cor, op) => `<defs>${radial('gLuz' + cor.slice(1), cor, 0.95)}</defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gLuz${cor.slice(1)})" opacity="${op}"/>`;

// A: a rede cheia na areia, ao nascer do sol (luz dourada atrás).
function artA(o = {}) {
  let s = praia(T, { sunX: o.sunX ?? 520, sunY: 470, sh: 600, hz: 520 });
  s += LUZ(o.sunX ?? 520, 500, 900, '#FFB347', 0.75);
  s += rede(o.x0 ?? -200, o.y ?? 600, o.x1 ?? 1380, o.y ?? 600, o.d ?? 480, 64, { id: 'cA', t: T, fs: o.fs ?? 2.0, seed: 23, bg: '#1F3344', bgOp: 0.5, w: 4 });
  return s + VIN(0.55);
}
// B: Pedro chorando, de perto, na luz da fogueira da manhã (céu do amanhecer, ainda escuro).
function artB(o = {}) {
  const x = o.x ?? 1320, ps = o.s ?? 3.7, py = o.y ?? 1560;
  let s = praia(T, { ceu: 'dawn', glowX: x, glow: 0.45, sh: 700, hz: 540 });
  s += LUZ(x, 620, 640, '#FF9E3D', 0.85);
  s += brasas(x - 420, 1010, 1.4, T, 0);
  const P = { ...PEDRO, robe: MANTO, x, y: py, s: ps, look: -0.6, mood: 'sad', rim: C.a300, noShadow: true };
  s += person(P) + lagrimas(x, py, ps, 0.35, 1) + lagrimas(x, py, ps, 0.8, 0.8);
  return s + VIN(0.6);
}
// C: Pedro velho, de mãos estendidas (João 21:18), no céu fechado, com uma luz fria atrás.
function artC(o = {}) {
  const x = o.x ?? 600, ps = o.s ?? 3.2, py = o.y ?? 1500;
  let s = bgGloom(T, { seed: 9 }) + `<rect x="-400" y="-400" width="2720" height="1880" fill="#1B2430" opacity="0.55"/>`;
  s += cidadeSil(x + 900, 640, 1.0, '#2C3640');
  s += LUZ(x, 520, 640, '#CFE3FF', 0.8);
  s += person({ ...VELHO, robe: MANTO, x, y: py, s: ps, look: 0, mood: 'calm', armL: 72, armR: 72, rim: '#CFE3FF', noShadow: true });
  return s + VIN(0.6);
}
