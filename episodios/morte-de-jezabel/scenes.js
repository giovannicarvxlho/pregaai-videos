// A morte de Jezabel (2 Reis 9:22-37). As cenas começam pelo índice da frase em
// SEGS. A queda fica fora da tela: a janela, o véu caindo e corte para preto.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const JEZABEL = { robe: '#8E3B46', skin: '#C68B59', hair: '#191919', cover: '#1E1A1A', beard: false };
const JEU = { sil: '#1C1716' };

function crownAt(x, y, s, rot = 0, fill = C.a300) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M -32 20 L -36 -22 L -18 0 L 0 -28 L 18 0 L 36 -22 L 32 20 Z" fill="${fill}" ${ink(5)}/><circle cx="0" cy="6" r="5" fill="${C.r600}"/></g>`;
}

// Muro do palácio com janelas em arco. Cada janela recebe o que aparece dentro dela.
const WIN = [{ x: 680, y: 470, w: 250, h: 330 }, { x: 330, y: 520, w: 190, h: 260 }];
function palace(t, inside = [], o = {}) {
  let s = `<rect x="-20" y="${o.top ?? 300}" width="1120" height="${1060 - (o.top ?? 300)}" fill="${C.g300}" stroke="${C.ink}" stroke-width="6"/>`;
  for (let r = 0; r < 12; r++) for (let c = 0; c < 7; c++) {
    const x = c * 170 - (r % 2) * 85, y = (o.top ?? 300) + 20 + r * 62;
    if (y > 1030) continue;
    s += `<rect x="${x + 6}" y="${y}" width="158" height="54" rx="6" fill="none" stroke="${C.g400}" stroke-width="3"/>`;
  }
  WIN.forEach((wd, i) => {
    const { x, y, w, h } = wd, d = `M ${x - w / 2} ${y + h} L ${x - w / 2} ${y + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${y + w / 2} L ${x + w / 2} ${y + h} Z`;
    s += `<clipPath id="win${i}"><path d="${d}"/></clipPath><path d="${d}" fill="#2B2724"/>`;
    s += `<g clip-path="url(#win${i})">${inside[i] || ''}</g>`;
    s += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="8"/><rect x="${x - w / 2 - 22}" y="${y + h - 4}" width="${w + 44}" height="30" rx="8" fill="${C.g400}" stroke="${C.ink}" stroke-width="6"/>`;
  });
  return s;
}

// ---------------------------------------------------------------- 1. Jeú chegando
function scChegando(t) {
  let s = bgDay(t, { seed: 501, sunX: 860, sunY: 430 });
  s += `<path d="M 160 ${GROUND + 2} C 300 860 820 860 960 ${GROUND + 2} Z" fill="#D8CCC0" stroke="${C.ink}" stroke-width="5"/>` + city(560, 965, 0.8, t);
  s += `<path d="M -100 1300 C 300 1220 640 1120 1180 1070" fill="none" stroke="#F3EDE6" stroke-width="70" stroke-linecap="round"/>`;
  const u = prog(t, 0, at(1) + 0.3), x = lerp(1240, 760, u), y = lerp(1250, 1085, u), sc = lerp(0.62, 0.36, u);
  s += dust(x + 200 * sc, y, (t % 0.6) + 10, 10, 3);
  s += chariot(x, y, sc, { sil: JEU.sil, horse: true, flip: true, gallop: t * 9, spin: -t * 5, rider: person({ x: -20, y: -90, s: 0.9, sil: JEU.sil, gear: { helmet: 'isr' }, noShadow: true }) });
  return { svg: cam(s, 600, 1000, 1.04 + 0.04 * E.sine(prog(t, 0, at(1)))), html: '' };
}

// ---------------------------------------------------------------- 2. pintou os olhos, arrumou o cabelo
function scEspelho(t) {
  const [p1, p2, p3] = SEGS[1][3];
  let s = `<rect width="${W}" height="${H}" fill="${C.g200}"/>` + rect(0, 1190, W, 800, C.g300) + `<line x1="0" y1="1190" x2="${W}" y2="1190" stroke="${C.ink}" stroke-width="6"/>`;
  const liner = E.out(prog(t, p1[0], p1[1]));
  const cr = t > p2[0] + 0.15;
  const go = E.inOut(prog(t, p3[0], p3[1]));
  const x = lerp(540, 380, go);
  // a janela aparece à direita quando ela vai até lá
  if (go > 0) s += `<g opacity="${f1(go * 100) / 100}"><path d="M 760 1190 L 760 600 A 150 150 0 0 1 1060 600 L 1060 1190 Z" fill="#CFE3F7" stroke="${C.ink}" stroke-width="8"/>${sun(910, 680, 50, t)}</g>`;
  s += person({ ...JEZABEL, x, y: 1250, s: 1.7, look: go > 0.3 ? 1 : 0, liner, mood: 'calm', gear: cr ? { crown: true } : {}, walk: go > 0 && go < 1 ? t * 6 : null });
  // começa perto do rosto, com o vestido acabando acima da legenda, e abre
  const z = lerp(1.6, 1.0, E.inOut(prog(t, p2[0] - 0.1, p3[0] + 0.2)));
  return { svg: cam(s, 540, 1250, z), html: '' };
}

// ---------------------------------------------------------------- 3. o filho dela, o rei
function scJorao(t) {
  let s = bgDay(t, { seed: 511, sunX: 200, sunY: 430 });
  s += `<path d="M -100 1250 C 300 1180 640 1110 1180 1060" fill="none" stroke="#F3EDE6" stroke-width="90" stroke-linecap="round"/>`;
  s += chariot(820, 1150, 0.7, { fill: C.g500 }).replace('<g transform', '<g opacity="0.9" transform');
  s += crownAt(470, 1200, 1.6, -18, C.a300);
  s += arrow(640, 1222, 62, 1.1);
  return { svg: cam(s, 520, 1100, 1.0 + 0.08 * E.sine(prog(t, at(2), at(3)))), html: '' };
}

// ---------------------------------------------------------------- 4 a 7. a janela
// Jezabel na janela grande; Jeú passa pelo portão embaixo e olha para cima; os
// funcionários aparecem na janela menor; a queda vira um véu caindo e corte para preto.
function jezInWindow(t, lean = 0) {
  const w = WIN[0];
  return person({ ...JEZABEL, x: w.x, y: w.y + w.h * 0.45 + 237, s: 1.15, liner: 1, look: 0.2, mood: 'calm', lean, gear: { crown: true }, noShadow: true });
}
function servants(t, k) {
  const w = WIN[1];
  let s = '';
  [[-50, 0.15], [40, 0.35]].forEach(([dx, d], i) => {
    const p = E.out(prog(k, d, d + 0.4));
    if (p > 0) s += person({ ...man(600 + i), x: w.x + dx, y: lerp(w.y + w.h + 400, w.y + w.h * 0.5 + 196, p), s: 0.95, look: 0.4, mood: 'calm', noShadow: true });
  });
  return s;
}
function scJanela(t) {
  const a0 = at(3), gate = { x: 300, y: 1060 };
  let s = bgDay(t, { seed: 521, sun: false });
  const tc = seg(5), tGrito = seg(5) + 1.5;
  const tServ = seg(7), tJog = wordTime(9, 'jogaram') - 0.1;
  const lean = t > seg(4) - 0.1 && t < seg(5) ? 6 : 0;
  const k = prog(t, tServ - 0.2, SEGS[7][1]);
  s += palace(t, [jezInWindow(t, lean), servants(t, k)], { top: 260 });
  // portão e Jeú no carro, passando da direita para a esquerda
  s += `<path d="M ${gate.x - 110} ${GROUND + 20} L ${gate.x - 110} ${gate.y - 120} A 110 110 0 0 1 ${gate.x + 110} ${gate.y - 120} L ${gate.x + 110} ${GROUND + 20} Z" fill="#2B2724" stroke="${C.ink}" stroke-width="8"/>`;
  s += floor('day', 0, GROUND + 20);
  const pass = E.inOut(prog(t, a0 + 0.2, tc));
  const cx = lerp(1250, 620, pass);
  const look = t > tc - 0.2;
  s += chariot(cx, 1250, 0.95, { sil: JEU.sil, horse: true, flip: true, gallop: pass < 1 ? t * 9 : null, spin: -t * 4 * (pass < 1 ? 1 : 0), rider: person({ x: -20, y: -90, s: 0.95, sil: JEU.sil, rim: look ? C.p300 : null, armR: t > tGrito - 0.2 && t < SEGS[6][1] + 0.3 ? 150 : 14, gear: { helmet: 'isr' }, noShadow: true }) });
  // a queda: um véu vermelho cai da janela e a cena corta para preto
  const fall = prog(t, tJog, tJog + 0.55);
  if (fall > 0) {
    const w = WIN[0];
    s += `<path d="M ${w.x - 60} ${f1(w.y + w.h - 60 + fall * 260)} q 60 -40 120 0 q -30 120 -60 160 q -30 -40 -60 -160 Z" fill="${JEZABEL.robe}" stroke="${C.ink}" stroke-width="5" opacity="${f1((1 - fall) * 100) / 100}"/>`;
  }
  s += `<rect width="${W}" height="${H}" fill="#000" opacity="${f1(E.in(prog(t, tJog + 0.25, tJog + 0.75)) * 100) / 100}"/>`;
  const z = 1.0 + 0.05 * prog(t, a0, at(5));
  return { svg: cam(s, 640, 800, z), html: '' };
}

// ---------------------------------------------------------------- 8. o que sobrou
function scPatio(t) {
  let s = bgDusk(t, { sky: 'skyDusk' }) + palace(t, ['', ''], { top: 420 }).replace(new RegExp(C.g300, 'g'), '#4A3A32').replace(new RegExp(C.g400, 'g'), '#3B2E27').replace(new RegExp(C.ink, 'g'), '#140F0C');
  s += floor('dusk', 0, GROUND + 20);
  s += crownAt(560, 1225, 1.4, 22, C.a400);
  return { svg: cam(s, 560, 1100, 1.0 + 0.06 * E.sine(prog(t, at(10), at(11)))), html: '' };
}

// ---------------------------------------------------------------- 9. os cães junto ao muro
function scCaes(t) {
  let s = bgDusk(t);
  s += `<rect x="-20" y="760" width="1120" height="300" fill="#3B2E27" stroke="#140F0C" stroke-width="6"/>`;
  for (let c = 0; c < 8; c++) for (let r = 0; r < 4; r++) s += `<rect x="${c * 150 - (r % 2) * 75 + 4}" y="${770 + r * 70}" width="142" height="62" rx="6" fill="none" stroke="#2E241F" stroke-width="3"/>`;
  s += floor('dusk', 0, GROUND + 20);
  s += dog(380, 1215, 1.0, '#0E0B09', t) + dog(700, 1225, 0.9, '#0E0B09', t + 1.3);
  return { svg: cam(s, 540, 1050, 1.04 - 0.04 * prog(t, at(11), at(13))), html: '' };
}

// ---------------------------------------------------------------- 10. a última palavra
function scUltima(t) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const ti = [wordTime(13, 'palácio'), wordTime(13, 'coroa'), wordTime(13, 'maquiagem')];
  const gone = E.in(prog(t, seg(14), seg(14) + 0.6));
  const items = [
    (x, y) => `<g transform="translate(${x} ${y + 60}) scale(0.42)">${city(0, 0, 1, t)}</g>`,
    (x, y) => crownAt(x, y - 40, 2.2, 0),
    (x, y) => `<g transform="translate(${x} ${y - 40})"><rect x="-34" y="-70" width="68" height="110" rx="18" fill="${C.g200}" ${ink(6)}/><rect x="-40" y="-92" width="80" height="30" rx="10" fill="${C.ink}"/><line x1="0" y1="-92" x2="0" y2="-150" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/></g>`,
  ];
  items.forEach((f, i) => {
    const p = pop(t, ti[i] - 0.1, 0.4);
    const ix = 230 + i * 310;
    if (p > 0) s += `<g opacity="${f1(clamp(p) * (1 - gone) * 100) / 100}" transform="translate(${ix} 820) scale(${f1(p * 100) / 100}) translate(${-ix} -820)">${f(ix, 820)}</g>`;
  });
  const b = pop(t, wordTime(14, 'palavra') - 0.1, 0.5);
  if (b > 0) s += `<g transform="translate(540 820) scale(${f1(b * 9 * 100) / 100}) translate(-12 -12)" opacity="${f1(clamp(b) * 100) / 100}"><path d="M12 7v14" fill="none" stroke="${C.b500}" stroke-width="2.2" stroke-linecap="round"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" fill="${C.b300}" stroke="${C.b500}" stroke-width="1.6" stroke-linejoin="round"/></g>`;
  return { svg: s, html: '' };
}

// ---------------------------------------------------------------- 11. fim
const scFim = (t) => endCard(t, AUDIO_END + 0.2, ['1 Reis 21', '2 Reis 9']);

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  { a: 0, b: at(1), f: scChegando, ref: '2 Reis 9:30' },
  { a: at(1), b: at(2), f: scEspelho, ref: null },
  { a: at(2), b: at(3), f: scJorao, ref: '2 Reis 9:24' },
  { a: at(3), b: SEGS[9][1] + 0.5, f: scJanela, ref: [[at(3), '2 Reis 9:31'], [seg(5), '2 Reis 9:32'], [seg(8), '2 Reis 9:33']], dark: (t) => t > wordTime(9, 'jogaram') + 0.3 },
  { a: SEGS[9][1] + 0.5, b: at(11), f: scPatio, ref: '2 Reis 9:35', dark: true },
  { a: at(11), b: at(13), f: scCaes, ref: [[at(11), '2 Reis 9:36'], [seg(12), '1 Reis 21:23']], dark: true },
  { a: at(13), b: AUDIO_END + 0.2, f: scUltima, ref: null },
  { a: AUDIO_END + 0.2, b: DURATION + 1, f: scFim, ref: null, end: true },
];
