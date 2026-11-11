// Arte das capas e miniaturas do episódio (carregada depois de data.js, lib.js e scenes.js), com as funções das cenas.
// Cinco heróis, cada um com um motivo para clicar e só com o que o vídeo mostra:
// A: o véu do santuário rasgado de alto a baixo, com a luz passando pelo rasgo (Mateus 27:51). Curiosidade: que véu era.
// B: o sepulcro da frente com a pedra partida e luz suave na entrada, sem ninguém (Mateus 27:52). Estranheza.
// C: a cruz em silhueta diante do sol apagado, do meio-dia às três (Mateus 27:45; Lucas 23:45). Contradição.
// D: o centurião em frente da cruz, aterrorizado (Mateus 27:54; Marcos 15:39). Só no curto 3.
// E: um dos santos, de roupa clara, a caminho da cidade ao amanhecer (Mateus 27:53). Só no curto 2.
const CHUNKS = buildChunks(SEGS); // as funções de cena usam wordTime
const T = 2.0;
const VIN = (o = 0.55, cx = '50%', cy = '50%', r = '72%') => `<defs><radialGradient id="vin" cx="${cx}" cy="${cy}" r="${r}"><stop offset="50%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${o}"/></radialGradient></defs><rect x="-400" y="-400" width="2720" height="1880" fill="url(#vin)"/>`;
const LUZ = (x, y, r, cor, op) => `<defs>${radial('gLuz' + cor.slice(1), cor, 0.95)}</defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gLuz${cor.slice(1)})" opacity="${op}"/>`;
// Aproxima o desenho em volta de (cx, cy) e leva esse ponto para (px, py).
const zoom = (g, cx, cy, z, px = cx, py = cy) => `<g transform="translate(${px} ${py}) scale(${z}) translate(${-cx} ${-cy})">${g}</g>`;

// A: o santuário por dentro, na luz baixa do candelabro; o véu já rasgado e a luz que passa pelo rasgo.
function artA(o = {}) {
  let g = veuCena(T, 1, { id: 'cA' + (o.id || ''), glow: 0.3, gapMax: o.gap ?? 230 });
  g += LUZ(960, 470, 520, '#FFD27A', o.luz ?? 0.45);
  return zoom(g, 960, o.cy ?? 500, o.z ?? 1.08, o.px ?? 960, o.py ?? 500) + VIN(o.vin ?? 0.62);
}
// B: a encosta dos sepulcros na tarde escura; o da frente com a pedra partida, os outros abertos, só luz.
function artB(o = {}) {
  const est = [{ parte: 1, luz: 1 }, { rola: 1, luz: 0.8 }, { rola: 1, luz: 0.8 }];
  let g = encosta(T, { est, id: 'cB' + (o.id || '') });
  g += LUZ(PEDRA_A[0] - 10, PEDRA_A[1] - 30, 560, '#FFE0A8', o.luz ?? 0.4);
  return zoom(g, o.cx ?? 1060, o.cy ?? 640, o.z ?? 1.35, o.px ?? 700, o.py ?? 560) + VIN(o.vin ?? 0.6);
}
// C: o sol sem brilho no alto e a cruz do meio em silhueta, grande, na frente dele. O resto do brilho quente atrás.
function artC(o = {}) {
  const SX = o.sx ?? 1260, SY = o.sy ?? 330, R = o.r ?? 200;
  let s = `<rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#skyDawn)"/>`;
  s += LUZ(SX, SY, R * 3.2, '#FFB347', o.luz ?? 0.55);
  s += `<circle cx="${SX}" cy="${SY}" r="${R}" fill="#262B32" stroke="#6A6F78" stroke-width="10"/>`;
  s += hills(GROUND + 60, 80, 0.0032, 7, '#1F2428') + hills(GROUND + 140, 55, 0.0055, 9, '#191D21');
  s += hill(o.cx ?? 1260, o.hy ?? 900, 1200, '#1B1E22', '#060708');
  s += crossFig(o.cx ?? 1260, o.base ?? 960, o.s ?? 1.25, { plaque: true, fill: '#050505', rim: '#4A515B', bow: 1 });
  if (o.lados) s += crossFig((o.cx ?? 1260) - 470, 1000, 0.7, { fill: '#050505', rim: '#3A3F47', bow: 0.35 }) + crossFig((o.cx ?? 1260) + 470, 1000, 0.7, { fill: '#050505', rim: '#3A3F47', bow: 0.35 });
  return s + VIN(o.vin ?? 0.5);
}
// D: o centurião, aterrorizado, em frente da cruz; a luz quente atrás dela.
function artD(o = {}) {
  const x = o.x ?? 640, ps = o.s ?? 2.6, py = o.y ?? 1240;
  let s = bgTrevas(T, { glow: 0.12, gx: o.crx ?? 1000 });
  s += LUZ(o.crx ?? 1000, 380, 640, '#FFB347', o.luz ?? 0.75);
  s += hill(o.crx ?? 1000, o.hy ?? 700, 700, '#1B1E22', '#060708') + crossFig(o.crx ?? 1000, (o.hy ?? 700) + 20, o.cs ?? 0.95, { plaque: true, fill: '#050505', rim: RIM, bow: 1 });
  s += person({ ...CENT, x, y: py, s: ps, look: 1, mood: 'fear', t: 0.2, armL: 18, armR: 30, rim: C.a300 });
  return s + VIN(o.vin ?? 0.55);
}
// E: o amanhecer; os sepulcros abertos ao fundo e a cidade; um dos santos, de roupa clara, de perto, andando para ela.
function artE(o = {}) {
  const x = o.x ?? 700, ps = o.s ?? 2.4, py = o.y ?? 1240;
  let s = bgSunrise(T, { sunX: o.sunX ?? 1060, sunY: 300, seed: 41 });
  s += LUZ(o.sunX ?? 1060, 300, 700, '#FFD9A0', 0.5);
  s += city(o.cityX ?? 1180, GROUND + 40, 0.9, T);
  s += `<path d="M -400 ${GROUND + 90} L -400 360 C -100 330 200 340 420 400 C 600 450 700 560 780 ${GROUND + 90} Z" fill="#C9BBAE" ${ink(6)}/>`;
  s += sepulcro(140, 700, 0.5, { tom: 'amanhecer', rola: 1, id: 'sE1' }) + sepulcro(470, 708, 0.42, { tom: 'amanhecer', rola: 1, id: 'sE2' });
  s += `<path d="M -400 ${FLOOR_Y + 40} C 300 ${FLOOR_Y - 20} 1000 ${GROUND + 110} 1590 ${GROUND + 44} L 1640 ${GROUND + 50} C 1100 ${GROUND + 150} 500 ${FLOOR_Y + 70} -400 ${FLOOR_Y + 160} Z" fill="#F3EADF" stroke="${C.ink}" stroke-width="4"/>`;
  // três deles, em fila, andando para a cidade (o plural de "apareceram"); o da frente de perto
  s += LUZ(x + 60, py - 330 * ps, 420, '#FFC37A', 0.55);
  [[x + 330, 2104, ps * 0.62, py - 150], [x + 190, 2103, ps * 0.78, py - 90], [x, 2102, ps, py]].forEach(([px, seed, sc, y], i) => (s += person({ ...santo(seed), x: px, y, s: sc, look: 1, mood: 'calm', walk: 0.6 + i * 1.7 })));
  return s + VIN(o.vin ?? 0.3);
}
