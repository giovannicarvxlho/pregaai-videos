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

// ---------- Miniaturas novas do longo (12/11/2026), com as peças do capa-lib.js ----------
// Cada uma com um motivo para clicar e um layout diferente; todas só com o que o vídeo mostra.
// N1 (espetáculo): o centurião aterrorizado, de perto, olhando para a cruz na tarde escura (Mateus 27:54:
//     "viram o terremoto e tudo o que havia acontecido, ficaram aterrorizados"). Texto à esquerda, embaixo.
function artN1(o = {}) {
  const CX = 500, TOPO = 500;
  let s = capaFundo([[0, '#050409'], [0.5, '#170C10'], [0.78, '#4A160C'], [1, '#7A2A10']]);
  s += capaLuz(CX, 330, 760, '#FF6A13', 0.95) + capaRaios(CX, 300, 900, 14, '#FFB347', 0.16, 8);
  // o sol que deixou de brilhar (Lucas 23:45), atrás da cruz do meio
  s += `<circle cx="${CX}" cy="250" r="158" fill="#6B1E0A" stroke="#FFC46B" stroke-width="9"/>`;
  s += hill(CX, TOPO, 1000, '#070505', '#000');
  s += crossFig(CX - 300, TOPO + 46, 0.5, { fill: '#040303', rim: '#B5461A', bow: 0.35 }) + crossFig(CX + 300, TOPO + 46, 0.5, { fill: '#040303', rim: '#B5461A', bow: 0.35 });
  s += crossFig(CX, TOPO + 16, 0.74, { plaque: true, fill: '#040303', rim: '#FF8A3C', bow: 1 });
  s += capaMotas(60, 80, 1000, 500, 26, 77, '#FFC98A', 0.7);
  // lascas de rocha no ar (Mateus 27:51: "a terra tremeu, e as rochas se partiram")
  const r = rng(27);
  for (let i = 0; i < 9; i++) {
    const x = 90 + r() * 900, y = 250 + r() * 220, k = 10 + r() * 16, rot = r() * 360;
    s += `<path transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})" d="M ${-k} ${k * 0.3} L ${-k * 0.4} ${-k} L ${k * 0.8} ${-k * 0.6} L ${k} ${k * 0.5} L ${k * 0.1} ${k} Z" fill="#070505" stroke="#B5461A" stroke-width="3"/>`;
  }
  s += retrato({ ...CENT, x: 1460, y: 600, s: 1.42, helmet: 'cent', armor: true, mood: 'medo', look: [-0.75, -0.45], lado: -1, luz: '#FF8A3C', suor: true, id: 'n1' });
  s += capaVinheta(0.55, '45%', '45%', '80%');
  s += capaTexto([{ t: 'JESUS MORREU', w: 800 }, { t: 'TUDO', w: 560, fill: 'ouro' }, { t: 'TREMEU', w: 860, fill: 'ouro' }], { x: 64, y: 548, gap: 0.1 });
  return s;
}
// N2 (curiosidade): o véu do santuário rasgado de alto a baixo, com a luz estourando pelo rasgo (Mateus 27:51).
//     Sem ninguém: o herói é o pano. Texto à esquerda, no meio. Roxo e ouro.
function artN2(o = {}) {
  const X0 = -500, X1 = 2100, cx = 1290;
  // o pano na penumbra do santuário: azul fundo e saturado (o brilho do rasgo entra por cima)
  let s = `<g style="filter: brightness(0.6) saturate(1.5)" transform="translate(${cx - (X0 + X1) / 2} 0)">` + veil(1, X0, X1, -60, 1150, { id: 'n2', querubins: 1, linho: true, gapMax: 430, beamTo: 1150 }) + `</g>`;
  s += `<defs><linearGradient id="n2esq" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#05030C" stop-opacity="0.92"/><stop offset="0.4" stop-color="#05030C" stop-opacity="0.5"/><stop offset="0.62" stop-color="#05030C" stop-opacity="0"/></linearGradient></defs><rect x="0" y="-400" width="1920" height="1880" fill="url(#n2esq)"/>`;
  s += capaRaios(cx, 240, 1700, 12, '#FFE9A8', 0.2, 4);
  s += capaLuz(cx, 420, 700, '#FFB52E', 0.75) + capaLuz(cx - 10, 470, 300, '#FFFFFF', 1, 0.62, 2.3) + capaLuz(cx, 260, 400, '#FFFFFF', 1);
  s += capaMotas(cx - 520, 40, 1040, 960, 46, 9, '#FFF3C9', 0.95);
  s += capaVinheta(0.72, '67%', '40%', '80%');
  s += capaTexto([{ t: 'O VÉU', w: 700 }, { t: 'RASGOU', w: 810, fill: 'ouro' }], { x: 64, y: 250, gap: 0.12, rot: -3 });
  return s;
}
// N3 (estranheza): o sepulcro da frente com a pedra partida e a luz saindo; ao fundo, as três cruzes
//     (Mateus 27:51-52: "as rochas se partiram, os sepulcros se abriram"). Texto à direita, no alto. Azul frio e ouro.
function artN3(o = {}) {
  const SX = 600, BASE = 1090, K = 2.3;
  let s = capaFundo([[0, '#04070F'], [0.55, '#0B1730'], [1, '#182C52']]);
  // o Gólgota ao longe, com o resto de luz atrás das cruzes
  s += capaLuz(1560, 640, 420, '#FF6A13', 0.8);
  s += hill(1560, 700, 520, '#05070C', '#000');
  s += crossFig(1430, 728, 0.3, { fill: '#020304', bow: 0.35 }) + crossFig(1690, 728, 0.3, { fill: '#020304', bow: 0.35 }) + crossFig(1560, 712, 0.42, { plaque: true, fill: '#020304', bow: 1 });
  s += `<path d="M -400 1200 L -400 760 C 300 700 900 760 1300 800 C 1600 830 1900 800 2400 820 L 2400 1200 Z" fill="#0A1322" stroke="#000" stroke-width="8"/>`;
  s += capaLuz(SX - 12, BASE - 150 * K, 1000, '#FFB52E', 0.5);
  TOM_SEPULCRO.capa = ['#2B3554', '#222B47', '#141A2E', '#04060B', '#56628A', '#333D5E', '#0A0D17']; // pedra fria, para a luz quente saltar
  s += sepulcro(SX, BASE, K, { tom: 'capa', parte: 1, luz: 1, id: 'n3' });
  s += capaRaios(SX - 12, BASE - 130 * K, 1500, 9, '#FFD98A', 0.12, 11, 196, 344);
  s += capaLuz(SX - 12, BASE - 130 * K, 520, '#FFB52E', 0.6) + capaLuz(SX - 12, BASE - 120 * K, 330, '#FFFFFF', 0.95);
  s += capaMotas(SX - 420, 120, 840, 760, 40, 5, '#FFE9B0', 0.9);
  s += capaVinheta(0.6, '40%', '55%', '85%');
  s += capaTexto([{ t: 'TÚMULOS', w: 900 }, { t: 'SE ABRIRAM', w: 900, fill: 'ouro' }], { x: 1862, y: 56, anchor: 'end', gap: 0.12, rot: 2 });
  return s;
}
