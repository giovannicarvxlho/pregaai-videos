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

// ---------- Miniaturas novas do longo (12/11/2026), com as peças do capa-lib.js ----------
// Três motivos e três layouts; todas só com o que o vídeo mostra. Jesus não entra em close: aparece de longe, calmo.
// Fogo de capa (saturado, com traço): as chamas da cena são em tom pastel e somem em 168×94.
function esFogo(x, y, s, seed = 1) {
  const r = rng(seed * 13 + 5), OL = CAPA.ink;
  const lingua = (dx, w, h, cor, ol) => { const p = flame(x + dx * s, y, w * s, h * s, cor); return ol ? p.replace('/>', ` stroke="${OL}" stroke-width="${f1(9 * s)}" stroke-linejoin="round"/>`) : p; };
  const ls = [[-70, 62, 250 + r() * 40], [0, 84, 360 + r() * 40], [72, 60, 270 + r() * 40]];
  let g = ls.map(([dx, w, h]) => lingua(dx, w, h, '#FF3D00', true)).join('');
  g += ls.map(([dx, w, h]) => lingua(dx, w, h, '#FF3D00')).join('');
  g += ls.map(([dx, w, h]) => lingua(dx, w * 0.74, h * 0.76, '#FF8A00')).join('');
  g += ls.map(([dx, w, h]) => lingua(dx, w * 0.5, h * 0.54, '#FFD21E')).join('');
  g += lingua(0, 26, 130, '#FFF6C8');
  return g;
}
// Tocha de capa: haste grossa, pano no alto e o fogo saturado; (x, y) é a ponta acesa, ang a inclinação da haste.
function esTocha(x, y, ang, s = 1, seed = 2) {
  const r = (ang * Math.PI) / 180, L = 330 * s, bx = x - Math.sin(r) * L, by = y + Math.cos(r) * L;
  let g = `<line x1="${f1(bx)}" y1="${f1(by)}" x2="${f1(x)}" y2="${f1(y)}" stroke="${CAPA.ink}" stroke-width="${f1(40 * s)}" stroke-linecap="round"/><line x1="${f1(bx)}" y1="${f1(by)}" x2="${f1(x)}" y2="${f1(y)}" stroke="#7A4A26" stroke-width="${f1(22 * s)}" stroke-linecap="round"/>`;
  g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(34 * s)}" fill="#3A2416" stroke="${CAPA.ink}" stroke-width="${f1(9 * s)}"/>`;
  return g + esFogo(x, y + 6 * s, 0.62 * s, seed);
}
// N1 (confronto): um soldado do destacamento, de perto, aterrorizado e indo para trás; Jesus de pé, calmo, ao fundo;
//     uma tocha cai entre os dois (João 18:3-6: "Quando Jesus disse: 'Sou eu', eles recuaram e caíram por terra").
//     A luz é só a das tochas. Soldado à esquerda, texto à direita no alto. Noite verde-azulada e laranja.
function artN1(o = {}) {
  let s = capaFundo([[0, '#020A0C'], [0.5, '#06211F'], [1, '#0D372F']]);
  [[900, 800, 2.3], [1560, 830, 3.0], [1880, 800, 2.4]].forEach(([x, y, k]) => (s += olive(x, y, k, '#0D2E28', '#092521', '#020807')));
  s += `<path d="M -400 1200 L -400 850 C 300 810 900 850 1400 826 C 1700 814 2000 840 2400 826 L 2400 1200 Z" fill="#061613" stroke="#010504" stroke-width="8"/>`;
  s += capaLuz(1150, 740, 760, '#FF7A1A', 0.95) + capaLuz(1060, 800, 320, '#FFC24A', 0.75);
  s += `<ellipse cx="1250" cy="1046" rx="380" ry="36" fill="#FF9A3C" opacity="0.3"/>`;
  s += person({ ...JESUS, robe: '#FFF8EC', x: 1290, y: 1040, s: 1.78, look: -1, mood: 'calm', ol: '#0B0806', rim: '#FFB347' });
  s += esTocha(1010, 760, 40, 0.95, 3);
  s += capaMotas(880, 330, 260, 380, 16, 31, '#FFC98A', 0.85);
  // a sombra do casco do capa-lib passa do topo do capacete 'rom' (ela foi pensada para a crista larga do centurião): sai daqui
  s += retrato({ ...soldado(4101), x: 480, y: 660, s: 1.5, rot: -12, helmet: 'rom', armor: true, mood: 'medo', look: [0.82, -0.12], lado: 1, luz: '#FF9A3C', suor: true, id: 'e1' })
    .replace(/<path d="M -222 -124 C -232 -260 -160 -320 -60 -334[^>]*opacity="0\.16"\/>/, '');
  s += capaVinheta(0.6, '52%', '55%', '82%');
  s += capaTexto([{ t: 'JESUS FALOU', w: 690 }, { t: 'ELES', w: 470, fill: 'ouro' }, { t: 'CAÍRAM', w: 800, fill: 'ouro' }], { x: 1872, y: 34, anchor: 'end', gap: 0.1 });
  return s;
}
// A sarça de capa: a moita verde inteira (não se consome) e o fogo saturado saindo do meio dela (Êxodo 3:2).
function esSarca(x, y, s) {
  const OL = CAPA.ink, blobs = [[-150, -70, 78], [150, -76, 82], [-66, -150, 92], [76, -160, 90], [0, -90, 104], [-205, -30, 56], [208, -32, 56]];
  let g = `<path d="M ${x - 46 * s} ${y} L ${x - 26 * s} ${y - 90 * s} M ${x + 40 * s} ${y} L ${x + 22 * s} ${y - 90 * s}" stroke="${OL}" stroke-width="${f1(34 * s)}" stroke-linecap="round"/><path d="M ${x - 46 * s} ${y} L ${x - 26 * s} ${y - 90 * s} M ${x + 40 * s} ${y} L ${x + 22 * s} ${y - 90 * s}" stroke="#7A4A26" stroke-width="${f1(18 * s)}" stroke-linecap="round"/>`;
  g += esFogo(x - 150 * s, y - 120 * s, 0.62 * s, 4) + esFogo(x + 160 * s, y - 130 * s, 0.66 * s, 5) + esFogo(x, y - 190 * s, 0.9 * s, 6);
  g += blobs.map(([bx, by, r]) => `<circle cx="${f1(x + bx * s)}" cy="${f1(y + by * s)}" r="${f1((r + 9) * s)}" fill="${OL}"/>`).join('');
  g += blobs.map(([bx, by, r], i) => `<circle cx="${f1(x + bx * s)}" cy="${f1(y + by * s)}" r="${f1(r * s)}" fill="${i % 2 ? '#4E9A3E' : '#3C8232'}"/>`).join('');
  g += blobs.map(([bx, by, r]) => `<path d="M ${f1(x + (bx - r * 0.55) * s)} ${f1(y + (by - r * 0.35) * s)} Q ${f1(x + bx * s)} ${f1(y + (by - r * 0.95) * s)} ${f1(x + (bx + r * 0.5) * s)} ${f1(y + (by - r * 0.5) * s)}" fill="none" stroke="#FFD21E" stroke-width="${f1(9 * s)}" stroke-linecap="round" opacity="0.75"/>`).join('');
  g += esFogo(x - 86 * s, y - 60 * s, 0.5 * s, 7) + esFogo(x + 96 * s, y - 66 * s, 0.52 * s, 8) + esFogo(x + 6 * s, y - 30 * s, 0.4 * s, 9);
  return g;
}
// N2 (mistério): a sarça em chamas que não se consumia, sozinha, no entardecer do deserto (Êxodo 3:2; o nome em 3:13-14).
//     Sem ninguém: o herói é a sarça. Texto à esquerda, no meio. Roxo, magenta e fogo.
function artN2(o = {}) {
  const X = 1340, Y = 1030, K = 1.82;
  let s = capaFundo([[0, '#090517'], [0.45, '#22103C'], [0.75, '#57193E'], [1, '#8A3320']]);
  s += `<path d="M -500 820 C 200 640 720 300 960 250 C 1080 226 1150 300 1240 330 C 1420 390 1700 600 2400 820 Z" fill="#190C2B" stroke="#07030F" stroke-width="8"/>`;
  s += `<path d="M -400 1200 L -400 790 C 300 760 900 800 1400 780 C 1700 770 2000 790 2400 780 L 2400 1200 Z" fill="#1E0E22" stroke="#07030F" stroke-width="8"/>`;
  s += capaLuz(X, Y - 400, 720, '#FF6A13', 0.85) + capaRaios(X, Y - 430, 1400, 16, '#FFC24A', 0.1, 6) + capaLuz(X, Y - 400, 420, '#FFD21E', 0.6);
  s += `<ellipse cx="${X}" cy="${Y + 8}" rx="560" ry="40" fill="#FF9A3C" opacity="0.4"/>`;
  s += esSarca(X, Y, K);
  s += capaMotas(X - 520, 40, 1040, 700, 44, 17, '#FFD98A', 0.95);
  s += capaVinheta(0.62, '66%', '48%', '82%');
  s += capaTexto([{ t: 'O NOME', w: 560 }, { t: 'EU SOU', w: 760, fill: 'ouro' }], { x: 66, y: 300, gap: 0.12, rot: -3 });
  return s;
}
// Lázaro de capa: o mesmo boneco do vídeo, de perto, com as faixas de linho e o pano no rosto bem marcados (João 11:44).
// (x, y) são os pés; ~300 de altura em s = 1 (as mesmas medidas do person() do lib.js).
function esLazaro(x, y, s, o = {}) {
  const OL = CAPA.ink, linho = '#FFF8EC', dobra = '#C9B79A', sombra = '#D9CBB4', luz = o.luz || '#FFC24A';
  const st = (w = 5) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  let g = '';
  // pernas presas juntas e pés enfaixados
  g += `<path d="M -26 -60 L -30 -8 Q -30 4 -14 4 L 14 4 Q 30 4 30 -8 L 26 -60 Z" fill="${linho}" ${st()}/>`;
  [-44, -28, -12].forEach((yy) => (g += `<path d="M -28 ${yy} Q 0 ${yy + 9} 28 ${yy - 2}" fill="none" ${st(3.2).replace(OL, dobra)}/>`));
  // corpo enfaixado
  g += `<path d="M -40 -168 C -44 -120 -50 -84 -52 -52 Q -52 -40 -40 -40 L 40 -40 Q 52 -40 52 -52 C 50 -84 44 -120 40 -168 Q 0 -184 -40 -168 Z" fill="${linho}" ${st()}/>`;
  g += `<path d="M 14 -174 L 38 -168 C 42 -120 48 -84 50 -52 Q 50 -43 40 -43 L 24 -43 Z" fill="${sombra}" opacity="0.7"/>`;
  [-150, -128, -106, -84, -62].forEach((yy, i) => (g += `<path d="M ${-46 - i} ${yy + (i % 2 ? 9 : 0)} Q 0 ${yy + (i % 2 ? -2 : 12)} ${46 + i} ${yy + (i % 2 ? 0 : 9)}" fill="none" ${st(3.4).replace(OL, dobra)}/>`));
  // braços colados ao corpo e as mãos enfaixadas, dos lados (como no vídeo)
  [-1, 1].forEach((d) => (g += `<path d="M ${d * 36} -160 C ${d * 58} -150 ${d * 62} -110 ${d * 50} -78 L ${d * 30} -84 C ${d * 40} -112 ${d * 38} -140 ${d * 26} -152 Z" fill="${linho}" ${st()}/>`));
  [-1, 1].forEach((d) => (g += `<circle cx="${d * 47}" cy="-72" r="15" fill="${linho}" ${st()}/><path d="M ${d * 47 - 11} -74 Q ${d * 47} -66 ${d * 47 + 11} -76" fill="none" ${st(3.2).replace(OL, dobra)}/>`));
  // cabeça: o pano envolve o rosto inteiro
  g += `<circle cx="0" cy="-208" r="40" fill="${linho}" ${st()}/>`;
  g += `<path d="M 6 -246 C 30 -240 42 -220 38 -196 C 34 -180 20 -170 6 -168 C 22 -190 22 -222 6 -246 Z" fill="${sombra}" opacity="0.7"/>`;
  g += `<path d="M -36 -224 Q 0 -206 36 -228 M -39 -204 Q 0 -186 39 -208 M -32 -184 Q 0 -170 32 -188 M -14 -246 Q -2 -232 -20 -214" fill="none" ${st(3.4).replace(OL, dobra)}/>`;
  const fig = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${g}</g>`;
  const cw = 8;
  return `<filter id="esLz" x="-30%" y="-20%" width="160%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="${cw}" result="d"/><feOffset in="d" dx="${-cw * 0.9}" dy="${-cw * 0.4}" result="o"/><feFlood flood-color="${luz}"/><feComposite in2="o" operator="in" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter><g filter="url(#esLz)">${fig}</g>`;
}
// N3 (espanto): Lázaro saindo da gruta, com as mãos e os pés em faixas de linho e o rosto envolto num pano
//     (João 11:17, 43-44). O herói é a figura clara contra a boca escura do sepulcro. Texto à esquerda. Rocha escura, linho e ouro.
function artN3(o = {}) {
  const X = 1330, BASE = 1030;
  let s = capaFundo([[0, '#120A08'], [0.5, '#1F120B'], [1, '#2B190E']]);
  // a rocha da gruta, com o sol batendo nela pela esquerda
  s += `<path d="M 560 1200 C 520 620 760 120 1300 60 C 1800 20 2140 420 2160 1200 Z" fill="#B8702A" stroke="${CAPA.ink}" stroke-width="12"/>`;
  s += `<path d="M 1380 70 C 1800 80 2100 440 2140 1200 L 1760 1200 C 1800 700 1700 260 1380 70 Z" fill="#000" opacity="0.38"/>`;
  s += `<path d="M 640 1100 C 620 640 830 210 1250 110" fill="none" stroke="#FFC24A" stroke-width="16" stroke-linecap="round" opacity="0.8"/>`;
  s += `<path d="M 700 760 C 740 600 820 470 930 380 M 1800 420 C 1860 520 1900 640 1910 760 M 660 1000 C 680 960 720 940 760 950" fill="none" stroke="#7A4418" stroke-width="12" stroke-linecap="round"/>`;
  // a boca do sepulcro, escura, e o chão
  s += `<path d="M 950 1200 L 950 560 C 950 240 1710 240 1710 560 L 1710 1200 Z" fill="#060302" stroke="${CAPA.ink}" stroke-width="12"/>`;
  s += `<path d="M -400 1200 L -400 990 C 300 960 900 1000 1400 984 C 1700 974 2000 990 2400 984 L 2400 1200 Z" fill="#3A2110" stroke="${CAPA.ink}" stroke-width="10"/>`;
  s += capaLuz(X, 600, 560, '#FFB52E', 0.38);
  s += `<ellipse cx="${X}" cy="${BASE + 6}" rx="300" ry="30" fill="#FFC24A" opacity="0.45"/>`;
  s += esLazaro(X, BASE, 2.95, { luz: '#FFC24A' });
  s += capaMotas(980, 260, 700, 640, 30, 23, '#FFE9B0', 0.8);
  s += capaVinheta(0.6, '66%', '50%', '84%');
  s += capaTexto([{ t: 'LÁZARO', w: 600 }, { t: '4 DIAS', w: 690, fill: 'ouro' }, { t: 'MORTO', w: 690, fill: 'ouro' }], { x: 60, y: 150, gap: 0.1, rot: -2 });
  return s;
}
