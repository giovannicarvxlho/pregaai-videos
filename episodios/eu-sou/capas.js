// Arte das capas e miniaturas do episódio (carregada depois de data.js, lib.js e scenes.js), com as funções das cenas.
// Quatro heróis, cada um com um motivo para clicar e só com o que o vídeo mostra:
// A: um soldado caindo para trás, à noite, na luz das tochas (João 18:6). Curiosidade: quais foram as duas palavras.
// B: a sarça em chamas que não se queima (Êxodo 3:2), sem figura nenhuma nela. Mistério.
// C: Lázaro saindo do túmulo nas faixas de linho (João 11:44). Espanto: quatro dias morto.
// D: o cego de nascença depois de se lavar em Siloé, vendo (João 9:7). Alegria (só no curto 3).
const CHUNKS = buildChunks(SEGS); // as funções de cena usam wordTime
const T = 2.0;
const VIN = (o = 0.55, cx = '50%', cy = '50%', r = '72%') => `<defs><radialGradient id="vin" cx="${cx}" cy="${cy}" r="${r}"><stop offset="50%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${o}"/></radialGradient></defs><rect x="-400" y="-400" width="2720" height="1880" fill="url(#vin)"/>`;
const LUZ = (x, y, r, cor, op) => `<defs>${radial('gLuz' + cor.slice(1), cor, 0.95)}</defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gLuz${cor.slice(1)})" opacity="${op}"/>`;

// A: o olival à noite; o soldado da frente cai para trás, outro já está caindo e uma tocha cai junto.
function artA(o = {}) {
  const x = o.x ?? 1250, ps = o.s ?? 2.2, py = o.y ?? 1150, ang = o.ang ?? 24;
  let s = noite(T, { trees: [[160, GROUND + 90, 1.7], [1840, GROUND + 70, 1.5]], moonX: o.moonX ?? 1700, moonY: 150 });
  s += `<rect x="-400" y="-400" width="2720" height="1880" fill="#05070A" opacity="0.3"/>`;
  s += LUZ(o.lx ?? x - 160, o.ly ?? 420, 760, '#FFB347', 0.85);
  s += tocha(o.tx ?? x - 400, o.ty ?? 640, o.tang ?? -34, T, 3, 2.0);
  s += caido({ ...soldado(4103), x: x + 360, y: py - 330, s: ps * 0.5, look: -1, mood: 'calm', ol: NIGHT_OL, rim: C.a300 }, 46);
  s += caido({ ...soldado(4101), x, y: py, s: ps, look: -1, mood: 'calm', ol: NIGHT_OL, rim: C.a300, noShadow: true, armL: 64, armR: 40 }, ang);
  return s + VIN(0.6);
}
// B: a sarça no deserto, ao entardecer; o fogo é a única luz.
function artB(o = {}) {
  const x = o.x ?? 520, bs = o.s ?? 2.3, by = o.y ?? 1000;
  let s = `<rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#skyDusk)"/>`;
  s += `<path d="M 700 760 C 900 380 1150 200 1380 180 C 1600 170 1800 330 2300 760 Z" fill="#2E2420" stroke="#120E0B" stroke-width="6"/>`;
  s += hills(700, 40, 0.004, 63, '#3A2D26') + `<rect x="-400" y="720" width="2720" height="800" fill="#2A211C"/>`;
  s += LUZ(x, by - 300, 820, '#FFB347', 0.9);
  s += sarca(x, by, bs, T, { ol: '#120E0B', glow: 0.5 });
  return s + VIN(0.62);
}
// C: Lázaro na boca do túmulo, de perto; a rocha escura e a luz da manhã atrás do morro.
function artC(o = {}) {
  const x = o.x ?? 1260, ls = o.s ?? 2.3, ly = o.y ?? 1010;
  let s = `<rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#skyDusk)"/>`;
  s += LUZ(x, o.ly ?? 300, 900, '#FFB347', 0.9);
  s += hills(820, 60, 0.004, 71, '#3A2D26');
  s += cave(x, ly + 140, 3.2, 'night');
  s += LUZ(x, ly - 330 * ls, 420, '#FFD9A0', 0.35);
  s += lazaro({ x, y: ly, s: ls });
  return s + VIN(0.6);
}
// D: o tanque de Siloé; o homem que nasceu cego, de braços para cima, vendo (o fim do curto 3), com o sol atrás.
function artD(o = {}) {
  const x = o.x ?? 960, ps = o.s ?? 2.0, py = o.y ?? 900;
  let s = tanque(T);
  s += LUZ(x, py - 260 * ps, 620, '#FFB347', 0.85);
  s += person({ ...CEGO, x, y: py, s: ps, look: o.look ?? 0.3, mood: 'calm', armL: 150, armR: 150, rim: C.a300 });
  for (let k = 0; k < 6; k++) { const a = -2.6 + k * 0.85, rr = 150 * ps; s += `<path d="M ${f1(x + Math.cos(a) * rr)} ${f1(py - 200 * ps + Math.sin(a) * rr * 0.6)} q -7 12 0 18 q 7 -6 0 -18 Z" fill="${C.b300}" stroke="${C.ink}" stroke-width="3"/>`; }
  return s + VIN(0.45);
}
