// Pedro nega Jesus (Lucas 22:33-34, 54-62; João 21:15-17). Vertical, mais de 1 min, sem acelerar.
// As cenas começam pelo índice da frase em SEGS. O primeiro quadro já está em movimento.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const PEDRO = { robe: C.p500, skin: '#C68B59', hair: '#5A3A28', beard: true, cover: null };
const CRIADA = { ...man(2101), beard: false, cover: '#E2D8CF', robe: C.g500, skin: '#A86B3C' };
const HOMEM1 = { ...man(2102), cover: null, beard: true, robe: C.ch300 };
const HOMEM2 = { ...man(2103), cover: C.g300, beard: true, robe: C.g700 };
const OL = '#0E0D0C';

// Parede de pedra do pátio à noite, com a luz quente da fogueira.
function patio(t, fx = 540, fy = 1250, glow = 1) {
  let s = `<rect width="${W}" height="${H}" fill="#14110F"/>`;
  for (let r = 0; r < 15; r++) for (let c = 0; c < 6; c++) {
    const x = c * 200 - (r % 2) * 100, y = 160 + r * 62;
    s += `<rect x="${x + 4}" y="${y}" width="192" height="56" rx="8" fill="${(r * 7 + c * 3) % 5 ? '#2A2420' : '#302925'}" stroke="#0E0B09" stroke-width="5"/>`;
  }
  s += floor('dusk', 0, 1100);
  s += `<circle cx="${fx}" cy="${fy - 80}" r="${f1(620 * glow)}" fill="url(#gAmber)" opacity="${f1(0.42 * glow * 100) / 100}"/>`;
  return s;
}
function fogueira(x, y, s, t) {
  return `<path d="M ${x - 70 * s} ${y} L ${x + 70 * s} ${y - 24 * s} M ${x - 70 * s} ${y - 24 * s} L ${x + 70 * s} ${y}" stroke="${C.wood}" stroke-width="${f1(18 * s)}" stroke-linecap="round"/>` + flames(x, y - 6 * s, s, t, 3) + embers(x, y - 60 * s, t, 8, 5, 160 * s);
}
// Galo em silhueta; "crow" abre o bico.
function galo(x, y, s, crow) {
  const b = crow ? 1 : 0;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M -60 0 C -90 -40 -110 -110 -70 -150 C -40 -110 -40 -70 -20 -60 Z" fill="#1A1714"/>
    <ellipse cx="0" cy="-40" rx="62" ry="44" fill="#1A1714"/>
    <path d="M 30 -70 C 40 -110 60 -130 70 -150 C 84 -130 80 -100 60 -66 Z" fill="#1A1714"/>
    <circle cx="66" cy="-150" r="22" fill="#1A1714"/>
    <path d="M 56 -176 C 60 -192 72 -192 72 -178 C 78 -192 90 -188 86 -172 Z" fill="${C.r600}"/>
    <path d="M 86 ${-154 - 6 * b} L ${112 + 4 * b} ${-150 - 10 * b} L 88 -148 Z" fill="${C.a400}"/>
    <path d="M 86 -146 L ${110 + 4 * b} ${-138 + 10 * b} L 88 -142 Z" fill="${C.a400}"/>
    <path d="M -10 0 L -14 40 M 14 0 L 18 40" stroke="${C.a600}" stroke-width="8" stroke-linecap="round"/>
  </g>`;
}

// ---------------------------------------------------------------- 1. o gancho: o olhar no pátio
function scGancho(t) {
  let s = patio(t, 760, 1230);
  s += fogueira(760, 1228, 1.0, t);
  // Jesus no alto, entre dois guardas, numa passagem; vira-se para Pedro em "olhou"
  const turn = E.out(prog(t, seg(2) - 0.2, seg(2) + 0.5));
  s += `<rect x="70" y="760" width="420" height="40" rx="6" fill="#2A2420" stroke="${OL}" stroke-width="6"/>`;
  s += person({ ...man(2111), robe: C.p600, cover: null, beard: false, x: 130, y: 760, s: 0.72, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26, ol: OL });
  s += person({ ...JESUS, x: 280, y: 760, s: 0.95, look: lerp(-0.6, 1, turn), mood: 'sad', ol: OL, rim: C.a300 });
  s += person({ ...man(2112), robe: C.p600, cover: null, beard: false, x: 430, y: 760, s: 0.72, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26, ol: OL });
  // Pedro perto do fogo, de costas para a luz
  s += person({ ...PEDRO, x: 900, y: 1235, s: 1.25, flip: true, look: lerp(0, -1, turn), mood: turn > 0.5 ? 'sad' : 'calm', rim: C.a300, ol: OL });
  return { svg: cam(s, 600, 1050, 1.0 + 0.08 * E.inOut(prog(t, 0, at(3)))), html: '' };
}

// ---------------------------------------------------------------- 2. a promessa
function scPromessa(t) {
  const a0 = at(3), jr = t > seg(5) - 0.1;
  let s = `<rect width="${W}" height="${H}" fill="#2B2420"/>` + floor('dusk', 0, 1100);
  // mesa com a lamparina
  s += `<circle cx="540" cy="980" r="520" fill="url(#gAmber)" opacity="0.4"/>`;
  s += `<rect x="250" y="1100" width="580" height="40" rx="10" fill="${C.wood}" stroke="${OL}" stroke-width="6"/>` + flame(540, 1090, 14, 46, C.a300) + `<ellipse cx="540" cy="1098" rx="34" ry="12" fill="${C.a600}" stroke="${OL}" stroke-width="5"/>`;
  const promise = E.out(prog(t, seg(4), seg(4) + 0.6));
  s += person({ ...PEDRO, x: 760, y: 1235, s: 1.25, look: -1, mood: 'happy', armL: lerp(14, 60, promise), armR: lerp(14, 120, promise), rim: C.a300 });
  s += person({ ...JESUS, x: 320, y: 1235, s: 1.25, look: 1, mood: jr ? 'sad' : 'calm', armR: jr ? 40 : 14, rim: C.a300 });
  return { svg: cam(s, 540, 1050, 1.04 - 0.04 * E.inOut(prog(t, a0, at(8)))), html: '' };
}

// ---------------------------------------------------------------- 3. a prisão e Pedro de longe
function scPrisao(t) {
  const a0 = at(8), p2 = E.inOut(prog(t, seg(9) - 0.4, seg(9) + 0.8));
  let s = bgNight(t, { moonX: 860, moonY: 420 });
  s += city(760, 1000, 0.9, t).replace(/fill="#FFFFFF"/g, 'fill="#2A2E33"').replace(new RegExp(C.g300, 'g'), '#23272B').replace(new RegExp(C.g400, 'g'), '#1E2226').replace(new RegExp(C.ink, 'g'), '#08090A');
  const walk = t * 5, x = lerp(320, 560, prog(t, a0, at(10)));
  s += person({ ...man(2121), robe: C.p600, cover: null, beard: false, x: x - 150, y: 1240, s: 1.0, walk, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26, ol: OL });
  s += person({ ...JESUS, x, y: 1240, s: 1.05, walk, mood: 'sad', ol: OL, look: 0.4 });
  s += person({ ...man(2122), robe: C.p600, cover: null, beard: false, x: x + 150, y: 1240, s: 1.0, walk, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26, ol: OL });
  // Pedro, pequeno, bem atrás
  s += person({ ...PEDRO, x: lerp(-60, 120, prog(t, seg(9) - 0.5, at(10))), y: 1150, s: 0.55, walk: t * 6, ol: OL, look: 1 });
  return { svg: cam(s, lerp(540, 300, p2), 1050, 1.0 + 0.12 * p2), html: '' };
}

// ---------------------------------------------------------------- 4. o fogo no pátio
function scFogo(t) {
  const a0 = at(10), lit = E.out(prog(t, seg(10) + 0.4, seg(10) + 1.2));
  let s = patio(t, 540, 1230, 0.3 + 0.7 * lit);
  if (lit > 0) s += fogueira(540, 1228, lit, t);
  [[230, 2131], [380, 2132], [700, 2133]].forEach(([x, sd]) => (s += person({ ...man(sd), x, y: 1235, s: 1.0, kneel: true, rim: C.a300, ol: OL, look: x < 540 ? 1 : -1 })));
  const sit = E.out(prog(t, seg(11) - 0.2, seg(11) + 0.4));
  s += person({ ...PEDRO, x: lerp(1080, 860, sit), y: 1235, s: 1.1, kneel: sit > 0.9, walk: sit < 0.9 ? t * 6 : null, look: -1, rim: C.a300, ol: OL });
  return { svg: cam(s, 540, 1150, 1.0 + 0.06 * E.inOut(prog(t, a0, at(12)))), html: '' };
}

// ---------------------------------------------------------------- 5 a 7. as três negações
function negacao(t, acc, accX, i0, iNeg, iEnd, shake) {
  const a0 = at(i0), point = E.out(prog(t, seg(i0) + 0.3, seg(i0) + 0.8)), neg = t > seg(iNeg) - 0.1;
  let s = patio(t, 600, 1230);
  s += fogueira(600, 1228, 0.8, t);
  s += person({ ...acc, x: accX, y: 1235, s: 1.2, look: accX < 540 ? 1 : -1, armR: accX < 540 ? lerp(14, 92, point) : 14, armL: accX < 540 ? 14 : lerp(14, 92, point), flip: accX > 540, mood: 'angry', rim: C.a300, ol: OL });
  const px = accX < 540 ? 820 : 260;
  s += person({ ...PEDRO, x: px, y: 1235, s: 1.25, look: px > 540 ? -1 : 1, mood: neg ? 'fear' : 'calm', armL: neg ? 40 : 14, armR: neg ? 40 : 14, shake: neg ? shake : 0, t, rim: C.a300, ol: OL });
  return { svg: cam(s, 540, 1100, 1.02 + 0.07 * E.inOut(prog(t, a0, at(iEnd)))), html: '' };
}
const scNeg1 = (t) => negacao(t, CRIADA, 250, 12, 14, 15, 3);
const scNeg2 = (t) => negacao(t, HOMEM1, 830, 15, 17, 18, 5);
const scNeg3 = (t) => negacao(t, HOMEM2, 250, 18, 20, 21, 8);

// ---------------------------------------------------------------- 8. o galo
function scGalo(t) {
  const crowT = wordTime(21, 'galo');
  let s = bgNight(t, { sky: 'skyDawn', moon: false, starOp: 0.6 });
  s += `<rect x="-40" y="1030" width="${W + 80}" height="80" fill="#1E2226" stroke="${OL}" stroke-width="6"/>`;
  s += galo(560, 1030, 1.6, t > crowT && t < crowT + 1.6 && Math.sin((t - crowT) * 14) > -0.3);
  return { svg: cam(s, 560, 900, 1.0 + 0.1 * E.out(prog(t, crowT - 0.3, crowT + 0.8))), html: '' };
}

// ---------------------------------------------------------------- 9. o olhar (só Lucas)
function scOlhar(t) {
  const a0 = at(22), turn = E.inOut(prog(t, seg(23), seg(23) + 0.9)), toPedro = t > seg(25) - 0.2;
  let s = patio(t, 540, 1250, 0.6);
  if (!toPedro) {
    s += person({ ...JESUS, x: 540, y: 1270, s: 2.1, look: lerp(-1, 0, turn), flip: turn < 0.5, mood: 'sad', rim: C.a300, ol: OL, noShadow: true });
    return { svg: cam(s, 540, 1100, 1.0 + 0.05 * E.inOut(prog(t, a0, at(25)))), html: '' };
  }
  s += person({ ...PEDRO, x: 540, y: 1270, s: 2.1, look: 0, mood: 'sad', rim: C.a300, ol: OL, noShadow: true });
  return { svg: cam(s, 540, 1050, 1.0 + 0.06 * E.inOut(prog(t, at(25), at(26)))), html: '' };
}

// ---------------------------------------------------------------- 10. saiu e chorou
function scChorou(t) {
  const a0 = at(26), out = E.inOut(prog(t, seg(26), seg(26) + 0.8)), cry = t > seg(27) - 0.1;
  let s = bgNight(t, { moon: false, starOp: 0.5 });
  s += `<rect x="760" y="700" width="320" height="420" fill="#2A2420"/><rect x="820" y="880" width="120" height="240" rx="60" fill="${C.a300}" opacity="0.55"/>`;
  s += person({ ...PEDRO, x: lerp(820, 460, out), y: 1235, s: 1.35, walk: !cry ? t * 6 : null, kneel: cry, lean: cry ? 16 : 0, mood: cry ? 'closed' : 'sad', look: -0.5, armL: cry ? 24 : 14, armR: cry ? 24 : 14, ol: OL });
  return { svg: cam(s, 520, 1100, 1.0 + 0.08 * E.inOut(prog(t, a0, at(28)))), html: '' };
}

// ---------------------------------------------------------------- 11. João 21: na praia, ao amanhecer
function scPraia(t) {
  const a0 = at(28), q = t > seg(30) - 0.1 && t < seg(31), ans = t > seg(32) - 0.1;
  let s = `<rect width="${W}" height="${H}" fill="url(#skySunrise)"/>` + sun(540, 880, 70, t);
  s += `<rect x="-40" y="880" width="${W + 80}" height="200" fill="url(#gWater)"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M ${-40 + i * 210 + Math.sin(t + i) * 10} ${920 + (i % 3) * 45} q 40 -12 80 0" stroke="#FFFFFF" stroke-width="5" fill="none" opacity="0.6" stroke-linecap="round"/>`;
  s += floor('day', 0, 1060);
  s += fogueira(540, 1225, 0.6, t);
  s += person({ ...JESUS, x: 300, y: 1235, s: 1.25, look: 1, mood: 'calm', armR: q ? 50 : 14 });
  s += person({ ...PEDRO, x: 790, y: 1235, s: 1.25, look: -1, mood: ans ? 'happy' : 'sad', armL: ans ? 70 : 14, armR: ans ? 110 : 14 });
  return { svg: cam(s, 540, 1100, 1.06 - 0.06 * E.inOut(prog(t, a0, at(34)))), html: '' };
}

// ---------------------------------------------------------------- 12. chamada: sábado, o longo 2
function scSabado(t) {
  const a0 = at(34);
  let s = bgNight(t, { moonX: 860, moonY: 440 });
  s += cave(540, 1240, 1.2, 'night');
  s += `<circle cx="530" cy="1105" r="135" fill="${C.g600}" stroke="${OL}" stroke-width="7"/><path d="M 395 1095 L 665 1095" stroke="${C.r600}" stroke-width="9" stroke-linecap="round"/><circle cx="530" cy="1095" r="22" fill="${C.r600}" stroke="${OL}" stroke-width="6"/>`;
  return { svg: cam(s, 540, 1100, 1.0 + 0.06 * E.inOut(prog(t, a0, AUDIO_END))), html: '' };
}

// ---------------------------------------------------------------- 13. fim
const scFim = (t) => endCard(t, AUDIO_END + 0.2, ['Lucas 22', 'João 21']);

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  { a: 0, b: at(3), f: scGancho, ref: 'Lucas 22:61', dark: true },
  { a: at(3), b: at(8), f: scPromessa, ref: 'Lucas 22:33-34', dark: true },
  { a: at(8), b: at(10), f: scPrisao, ref: 'Lucas 22:54', dark: true },
  { a: at(10), b: at(12), f: scFogo, ref: 'Lucas 22:55', dark: true },
  { a: at(12), b: at(15), f: scNeg1, ref: 'Lucas 22:56-57', dark: true },
  { a: at(15), b: at(18), f: scNeg2, ref: 'Lucas 22:58', dark: true },
  { a: at(18), b: at(21), f: scNeg3, ref: 'Lucas 22:59-60', dark: true },
  { a: at(21), b: at(22), f: scGalo, ref: null, dark: true },
  { a: at(22), b: at(26), f: scOlhar, ref: 'Lucas 22:61', dark: true },
  { a: at(26), b: at(28), f: scChorou, ref: 'Lucas 22:62', dark: true },
  { a: at(28), b: at(34), f: scPraia, ref: 'João 21:15-17' },
  { a: at(34), b: AUDIO_END + 0.2, f: scSabado, ref: null, dark: true },
  { a: AUDIO_END + 0.2, b: DURATION + 1, f: scFim, ref: null, end: true },
];
