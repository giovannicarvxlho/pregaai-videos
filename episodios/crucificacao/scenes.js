// A crucificação (Mateus 27, Lucas 23, João 19). As cenas começam pelo índice da
// frase em SEGS, então trocar os tempos estimados pelos do áudio real reposiciona tudo.
// Na cruz, Jesus aparece sempre em silhueta contra a luz: sem sangue nem ferida na tela.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const SIL = '#16110F';
const JESUS = { robe: '#A33A44', skin: '#B97A4A', hair: '#2F2622', beard: true }; // manto vermelho (Mateus 27:28)
const soldado = (seed, extra = {}) => ({ ...man(seed), cover: null, beard: false, robe: C.p600, gear: { helmet: 'rom', armor: true }, ...extra });

// As três cruzes no morro. k = quanto cada cruz já está de pé (0 deitada, 1 erguida).
function golgota(t, o = {}) {
  const dark = o.dark, k = o.k || [1, 1, 1];
  const ol = dark ? '#060708' : C.ink, fill = dark ? '#1B1E22' : '#D6CCC1', cf = dark ? '#050505' : SIL;
  let s = dark ? '' : city(190, 935, 0.42, t);
  s += hill(600, 905, 760, fill, ol);
  const rim = dark ? '#3A3F47' : null;
  s += crossFig(370, 935, 0.58, { fill: cf, rim, rot: lerp(-70, 0, k[1]), op: clamp(k[1] * 4), bow: 0.35 });
  s += crossFig(830, 935, 0.58, { fill: cf, rim, rot: lerp(70, 0, k[2]), op: clamp(k[2] * 4), bow: 0.35 });
  s += crossFig(600, 912, 0.76, { fill: cf, rim, rot: lerp(-70, 0, k[0]), op: clamp(k[0] * 4), plaque: true, bow: o.bow || 0 });
  return s;
}

// ---------------------------------------------------------------- 1. "desça da cruz"
// Os que passavam insultavam, balançando a cabeça (Mateus 27:39-40).
function scZombaria(t) {
  let s = bgGloom(t, { seed: 701 }) + golgota(t);
  const up = E.out(prog(t, wordTime(0, 'desça') - 0.2, wordTime(0, 'desça') + 0.2));
  const MOCK = '#2B2421';
  s += person({ x: 150, y: 1268, s: 1.22, sil: MOCK, armR: lerp(14, 148, up), armL: 24, lean: Math.sin(t * 7) * 3 * up });
  s += person({ x: 945, y: 1282, s: 1.3, sil: MOCK, flip: true, armR: lerp(14, 140, up), armL: 20, lean: Math.sin(t * 7 + 2) * 3 * up });
  return { svg: cam(s, 600, 900, 1.03 + 0.05 * E.sine(prog(t, 0, at(1)))), html: '' };
}

// ---------------------------------------------------------------- 2. "e ele não desceu"
function scNaoDesceu(t) {
  let s = bgGloom(t, { seed: 711 });
  s += `<circle cx="540" cy="520" r="420" fill="url(#gWhite)" opacity="0.55"/>`;
  s += hill(540, 1235, 900, '#D6CCC1');
  s += crossFig(540, 1262, 1.86, { plaque: true, rim: C.g300 });
  return { svg: cam(s, 540, 560, 1.0 + 0.07 * E.sine(prog(t, at(1), at(2) + 0.4))), html: '' };
}

// ---------------------------------------------------------------- 3 e 4. o pretório
// Manto vermelho e coroa de espinhos (Mateus 27:27-29). Os soldados se ajoelham de deboche.
function pretorio(t, o) {
  let s = `<rect width="${W}" height="${H}" fill="${C.g200}"/>`;
  for (let r = 0; r < 14; r++) for (let c = 0; c < 7; c++) {
    const x = c * 170 - (r % 2) * 85, y = 300 + r * 64;
    if (y < 1180) s += `<rect x="${x + 6}" y="${y}" width="158" height="56" rx="6" fill="none" stroke="${C.g300}" stroke-width="4"/>`;
  }
  [150, 930].forEach((x) => (s += rect(x - 52, 260, 104, 940, C.g100, ink(6)) + rect(x - 70, 236, 140, 40, C.g300, `rx="8" ${ink(6)}`) + rect(x - 70, 1160, 140, 40, C.g300, `rx="8" ${ink(6)}`)));
  s += rect(-20, 1190, W + 40, 800, C.g300) + `<line x1="0" y1="1190" x2="${W}" y2="1190" stroke="${C.ink}" stroke-width="6"/>`;
  const kneel = !!o.kneel, salve = o.salve || 0;
  [[300, 801], [785, 802]].forEach(([x, seed], i) => {
    const sd = soldado(seed, { x, y: 1250, s: 1.2, look: i ? -1 : 1 });
    s += person(kneel ? { ...sd, kneel: true, mood: 'happy', armL: lerp(20, 150, salve), armR: lerp(20, 150, salve) } : { ...sd, mood: 'calm', armR: 26, gear: { ...sd.gear, spear: 'r' } });
  });
  s += person({ ...JESUS, x: 540, y: 1250, s: 1.55, mood: 'closed' });
  s += thornCrown(540, 1250, 1.55, o.drop || 0);
  return s;
}
function scCoroa(t) {
  const tc = wordTime(2, 'coroa'), drop = 1000 * (1 - E.in(prog(t, tc - 0.35, tc + 0.05)));
  let s = pretorio(t, { drop: t < tc - 0.35 ? 2000 : drop });
  const z = lerp(1.0, 1.5, E.inOut(prog(t, tc - 0.1, wordTime(2, 'espinhos') + 0.5)));
  return { svg: cam(s, 540, 1250, z), html: '' };
}
function scSalve(t) {
  const tw = wordTime(3, 'salve');
  const s = pretorio(t, { kneel: true, salve: E.back(prog(t, tw - 0.15, tw + 0.25)) });
  return { svg: cam(s, 540, 1000, 1.05 - 0.04 * prog(t, at(3), at(4))), html: '' };
}

// ---------------------------------------------------------------- 5. as três cruzes
function scGolgota(t) {
  const up = (w) => E.out(prog(t, wordTime(4, w) - 0.2, wordTime(4, w) + 0.45));
  const s = bgGloom(t, { seed: 721 }) + golgota(t, { k: [up('crucificaram'), up('dois'), up('criminosos')] });
  return { svg: cam(s, 600, 900, 1.08 - 0.06 * E.sine(prog(t, at(4), at(5)))), html: '' };
}

// ---------------------------------------------------------------- 6. "Pai, perdoa-lhes"
// Enquanto ele orava, os soldados tiravam sortes pelas roupas dele (Lucas 23:34).
function scPerdao(t) {
  const tp = wordTime(5, 'pai'), tn = wordTime(5, 'sabem');
  let s = bgGloom(t, { seed: 731 });
  s += `<circle cx="540" cy="500" r="340" fill="url(#gWhite)" opacity="${f1((0.2 + 0.5 * E.out(prog(t, tp - 0.2, tp + 0.6))) * 100) / 100}"/>`;
  s += hill(540, 1000, 900, '#D6CCC1');
  s += crossFig(540, 1020, 1.1, { plaque: true, rim: C.g300 });
  // a túnica no chão e as sortes
  s += `<path d="M 430 1218 Q 540 1190 650 1218 L 676 1262 Q 540 1278 404 1262 Z" fill="${C.g100}" ${ink(5)}/>`;
  const roll = Math.floor(t * 6) % 3;
  [[505, 1230], [570, 1238]].forEach(([x, y], i) => (s += `<rect x="${x}" y="${y - (roll === i ? 10 : 0)}" width="22" height="22" rx="5" fill="${C.white}" ${ink(4)} transform="rotate(${(roll + i) * 20} ${x + 11} ${y + 11})"/>`));
  [[290, 811, 1], [790, 812, -1]].forEach(([x, seed, lk], i) => {
    s += person({ ...soldado(seed), x, y: 1215, s: 1.05, kneel: true, mood: 'happy', look: lk, armL: 34, armR: i === 0 ? 40 + 30 * Math.abs(Math.sin(t * 6)) : 34 });
  });
  const z = E.inOut(prog(t, tn - 0.5, tn + 0.6));
  return { svg: cam(s, 540, 1240, lerp(1.0, 1.08, z) , 0, 0), html: '' };
}

// ---------------------------------------------------------------- 7 e 8. os líderes
// "Salvou os outros, mas não é capaz de salvar a si mesmo!" (Mateus 27:41-42)
function lideres(t, point) {
  let s = bgGloom(t, { seed: 741 });
  s += `<g transform="translate(860 880) scale(0.55) translate(-600 -905)">${golgota(t)}</g>` + floor('day');
  const L = [[200, 901, 0.96, 1238], [430, 902, 1.12, 1262], [700, 903, 1.08, 1255], [930, 904, 0.95, 1240]];
  L.forEach(([x, seed, sc, y], i) => {
    const bob = Math.abs(Math.sin(t * 8 + i * 1.3)) * 10;
    s += person({ ...lider(seed), x, y: y - bob, s: sc * 1.15, mood: 'happy', look: i < 2 ? 0.8 : -0.4, armR: i === 2 ? lerp(20, 165, point) : 30, armL: i === 1 ? 30 + bob * 2 : 22, lean: i === 0 ? -6 : 0 });
  });
  return s;
}
function scLideres(t) {
  return { svg: cam(lideres(t, 0), 560, 1000, 1.0 + 0.03 * prog(t, at(6), at(7))), html: '' };
}
function scSalvou(t) {
  const p = E.back(prog(t, wordTime(7, 'salvou') - 0.1, wordTime(7, 'salvou') + 0.35));
  return { svg: cam(lideres(t, p), 640, 1240, 1.32 + 0.06 * E.sine(prog(t, at(7), at(8)))), html: '' };
}

// ---------------------------------------------------------------- 9. as trevas
// Do meio-dia às três horas da tarde (Mateus 27:45).
const darkAt = () => [wordTime(8, 'tarde'), wordTime(8, 'escuro') + 0.4];
function scTrevas(t) {
  const [d0, d1] = darkAt(), d = E.inOut(prog(t, d0, d1));
  let s = bgGloom(t, { seed: 751, sun: [820, f1(lerp(360, 300, d))] }) + golgota(t);
  if (d > 0) s += `<g opacity="${f1(d * 100) / 100}">${bgDark(t)}${golgota(t, { dark: true })}</g>`;
  return { svg: cam(s, 600, 900, 1.0 + 0.05 * prog(t, at(8), at(9))), html: '' };
}

// ---------------------------------------------------------------- 10 e 11. "está consumado"
// "Curvou a cabeça e entregou o espírito" (João 19:30).
function noEscuro(t, bow, light) {
  let s = bgDark(t);
  s += `<circle cx="540" cy="560" r="460" fill="url(#gWhite)" opacity="${f1(light * 100) / 100}"/>`;
  s += hill(540, 1235, 900, '#1B1E22', '#060708');
  s += crossFig(540, 1262, 1.86, { plaque: true, fill: '#050505', rim: '#5A606A', bow });
  return s;
}
function scConsumado(t) {
  const l = 0.06 + 0.1 * E.out(prog(t, wordTime(9, 'consumado') - 0.2, wordTime(9, 'consumado') + 0.4));
  return { svg: cam(noEscuro(t, 0, l), 540, 600, 1.18 + 0.06 * prog(t, at(9), at(10))), html: '' };
}
function scEntregou(t) {
  const te = wordTime(10, 'espírito'), bow = E.inOut(prog(t, te - 0.3, te + 0.5));
  return { svg: cam(noEscuro(t, bow, 0.16 * (1 - bow)), 540, 700, 1.0 + 0.04 * prog(t, at(10), at(11))), html: '' };
}

// ---------------------------------------------------------------- 12. o véu rasgado
// "O véu do santuário rasgou-se em duas partes, de alto a baixo. A terra tremeu" (Mateus 27:51).
// Cores do véu: azul, roxo e vermelho (Êxodo 26:31).
function scVeu(t) {
  const t0 = wordTime(11, 'rasgou') - 0.1, t1 = wordTime(11, 'baixo') + 0.3;
  const p = E.inOut(prog(t, t0, t1)), quake = prog(t, t0, t0 + 0.2) * (1 - prog(t, t1, t1 + 0.6));
  let s = `<rect width="${W}" height="${H}" fill="#1E1A17"/>` + floor('dusk', 0, 1200);
  s += `<circle cx="540" cy="700" r="520" fill="url(#gAmber)" opacity="${f1((0.25 + 0.6 * p) * 100) / 100}"/>` + veil(p, 150, 930, 330, 1215);
  const sh = Math.sin(t * 43) * 9 * quake, sv = Math.cos(t * 37) * 6 * quake;
  return { svg: cam(s, 540, 760, 1.02 + 0.04 * prog(t, at(11), at(12)), sh, sv), html: '' };
}

// ---------------------------------------------------------------- 13 e 14. o centurião
// "Verdadeiramente este era o Filho de Deus!" (Mateus 27:54). Eles ficaram aterrorizados.
function centuriao(t, light) {
  let s = bgNight(t, { sky: 'skyDawn', moon: false, starOp: 0 });
  s += `<circle cx="790" cy="560" r="420" fill="url(#gAmber)" opacity="${f1(light * 0.6 * 100) / 100}"/>`;
  s += hill(800, 1010, 620, '#1B1E22', '#060708') + crossFig(800, 1030, 0.86, { plaque: true, fill: '#050505', rim: '#5A606A', bow: 1 });
  s += person({ ...soldado(821), robe: '#8E3B46', x: 360, y: 1258, s: 1.42, look: 1, mood: 'fear', t, armL: 18, armR: 24, gear: { helmet: 'cent', armor: true, spear: 'l' }, rim: light > 0.05 ? C.a300 : null });
  return s;
}
function scCenturiao(t) {
  return { svg: cam(centuriao(t, 0), 540, 900, 1.0 + 0.04 * prog(t, at(12), at(13))), html: '' };
}
function scFilho(t) {
  const l = E.out(prog(t, wordTime(13, 'filho') - 0.3, wordTime(13, 'filho') + 0.5));
  return { svg: cam(centuriao(t, l), 380, 960, 1.7 + 0.08 * prog(t, at(13), at(14)), 0, -200), html: '' };
}

// ---------------------------------------------------------------- 15. não foi fraqueza
// "Ninguém a tira de mim, mas eu a dou por minha espontânea vontade" (João 10:18).
function scFraqueza(t) {
  let s = `<rect width="${W}" height="${H}" fill="url(#skySunrise)"/>`;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + t * 0.12;
    s += `<path d="M 540 356 L ${f1(540 + Math.cos(a - 0.09) * 1500)} ${f1(356 + Math.sin(a - 0.09) * 1500)} L ${f1(540 + Math.cos(a + 0.09) * 1500)} ${f1(356 + Math.sin(a + 0.09) * 1500)} Z" fill="#fff" opacity="0.5"/>`;
  }
  s += `<circle cx="540" cy="356" r="300" fill="url(#gWhite)"/>`;
  s += hill(540, 1218, 900, '#E9D2BE');
  s += crossFig(540, 1240, 2.0, { plaque: true, rim: C.a300 });
  return { svg: cam(s, 540, 700, 1.05 - 0.05 * E.sine(prog(t, at(14), at(15)))), html: '' };
}

// ---------------------------------------------------------------- 16. "ele deu. por você"
function scPorVoce(t) {
  const tv = wordTime(16, 'você');
  let s = `<rect width="${W}" height="${H}" fill="url(#skySunrise)"/>` + sun(540, 640, 90, t);
  s += hills(960, 60, 0.004, 761, '#F2DCC8');
  s += hill(540, 980, 820, '#EAD5C3');
  s += crossFig(540, 1000, 0.82, { wood: true, body: false, plaque: true });
  const w = E.out(prog(t, tv - 0.9, tv + 0.1));
  if (w > 0) s += person({ x: lerp(250, 400, w), y: 1250, s: 0.82, sil: '#2B2421', walk: w < 1 ? t * 7 : null, op: clamp(w * 3) });
  return { svg: cam(s, 540, 900, 1.14 - 0.14 * E.inOut(prog(t, at(15), tv + 0.3))), html: '' };
}

// ---------------------------------------------------------------- 17. fim
const scFim = (t) => endCard(t, AUDIO_END + 0.2, ['Mateus 27', 'Lucas 23', 'João 19']);

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  { a: 0, b: at(1), f: scZombaria, ref: 'Mateus 27:39-40' },
  { a: at(1), b: at(2), f: scNaoDesceu, ref: null },
  { a: at(2), b: at(3), f: scCoroa, ref: 'Mateus 27:28-29' },
  { a: at(3), b: at(4), f: scSalve, ref: null },
  { a: at(4), b: at(5), f: scGolgota, ref: 'Mateus 27:33, 38' },
  { a: at(5), b: at(6), f: scPerdao, ref: 'Lucas 23:34' },
  { a: at(6), b: at(7), f: scLideres, ref: 'Mateus 27:41-42' },
  { a: at(7), b: at(8), f: scSalvou, ref: null },
  { a: at(8), b: at(9), f: scTrevas, ref: 'Mateus 27:45', dark: (t) => t > (darkAt()[0] + darkAt()[1]) / 2 },
  { a: at(9), b: at(10), f: scConsumado, ref: 'João 19:30', dark: true },
  { a: at(10), b: at(11), f: scEntregou, ref: null, dark: true },
  { a: at(11), b: at(12), f: scVeu, ref: 'Mateus 27:51', dark: true },
  { a: at(12), b: at(13), f: scCenturiao, ref: 'Mateus 27:54', dark: true },
  { a: at(13), b: at(14), f: scFilho, ref: null, dark: true },
  { a: at(14), b: at(15), f: scFraqueza, ref: null },
  { a: at(15), b: AUDIO_END + 0.2, f: scPorVoce, ref: 'João 10:18' },
  { a: AUDIO_END + 0.2, b: DURATION + 1, f: scFim, ref: null, end: true },
];
