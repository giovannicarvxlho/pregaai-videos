// A morte de Acabe (1 Reis 22). As cenas começam pelo índice da frase em SEGS,
// então trocar os tempos estimados pelos do áudio real reposiciona tudo.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const ACABE = { robe: C.r600, skin: '#C68B59', hair: '#2F2622', beard: true };
const JOSAFA = { robe: C.a400, skin: '#E0AC69', hair: '#5A3A28', beard: true };
const MICAIAS = { robe: C.b500, skin: '#A86B3C', hair: '#D1C6BF', beard: true };
const SIL = '#16110F';

// coroa solta (cai do rei no gancho e fica no trono vazio)
function crownAt(x, y, s, rot = 0, fill = C.a300) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})"><path d="M -32 20 L -36 -22 L -18 0 L 0 -28 L 18 0 L 36 -22 L 32 20 Z" fill="${fill}" ${ink(5)}/><circle cx="0" cy="6" r="5" fill="${C.r600}"/></g>`;
}

// ---------------------------------------------------------------- 1. a flecha
function scFlecha(t) {
  const tr = 1.0, fly = prog(t, tr, tr + 1.7);
  let s = bgDusk(t);
  for (let i = 0; i < 12; i++) s += person({ x: 520 + i * 52, y: 1030 + (i % 3) * 6, s: 0.22, sil: SIL, gear: { helmet: i % 2 ? 'phil' : null, spear: 'r' }, armR: 28, noShadow: true });
  s += chariot(860, 1040, 0.32, { sil: SIL, horse: true, gallop: t * 8 });
  // rastro e flecha numa parábola
  const P = (u) => [lerp(360, 1240, u), 960 - 380 * u + 260 * u * u];
  if (fly > 0 && fly < 1) {
    for (let k = 1; k < 14; k++) { const u = fly - k * 0.025; if (u > 0) { const [x, y] = P(u); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="5" fill="#fff" opacity="${f1((1 - k / 14) * 0.8 * 100) / 100}"/>`; } }
    const [x, y] = P(fly), [x2, y2] = P(Math.min(1, fly + 0.01));
    s += arrow(x, y, (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI, 0.9, SIL);
  }
  const draw = t < tr ? E.out(prog(t, 0.1, 0.8)) : 0;
  s += person({ x: 230, y: 1235, s: 1.3, sil: SIL, rim: C.p300, armR: 92, armL: lerp(40, 72, draw), gear: { bow: 'r', draw, helmet: 'phil' } });
  if (t < tr && t > 0.1) s += arrow(230 + 1.3 * (34 + 86) + 10, 1235 - 1.3 * 156, 0, 0.75, SIL);
  // a coroa cai ao longe em "matou um rei"
  const cr = prog(t, seg(1) + 0.3, seg(1) + 1.0);
  if (cr > 0) s += crownAt(lerp(880, 930, cr), lerp(860, 1030, E.in(cr)), 1.1, cr * 160) + dust(940, 1040, t, seg(1) + 1.0, 3, '#5A463B');
  return { svg: cam(s, 540, 1000, 1.02 + 0.06 * E.sine(prog(t, 0, 5.2))), html: '' };
}

// ---------------------------------------------------------------- 2. Acabe
function scAcabe(t) {
  const a0 = at(2);
  let s = bgDay(t, { seed: 301, sunX: 860, sunY: 430 });
  s += city(540, 975, 0.9, t);
  for (let i = 0; i < 6; i++) s += person({ x: 860 + i * 34, y: 1032, s: 0.18, sil: C.ch600, gear: { spear: 'r', helmet: 'phil' }, armR: 28, noShadow: true });
  const ts = wordTime(2, 'Síria');
  s += badge(930, 900, 'Síria', { size: 34, fill: C.r300, edge: C.r600, scale: pop(t, ts - 0.1), op: clamp(pop(t, ts - 0.1)) });
  s += throne(540, 1180, 0.95, C.a400);
  const pt = E.out(prog(t, a0 + 0.6, a0 + 1.2));
  s += person({ ...ACABE, x: 540, y: 1240, s: 1.32, look: 0.8 * pt, armR: lerp(14, 98, pt), gear: { crown: true } });
  return { svg: cam(s, 540, 1000, 1.06 - 0.06 * E.out(prog(t, a0, a0 + 3))), html: '' };
}

// ---------------------------------------------------------------- 3. os 400 profetas
function scProfetas(t) {
  const a0 = at(3), chant = t > seg(4);
  let s = bgDay(t, { seed: 311, sunX: 180, sunY: 440 });
  const crowd = [];
  for (let r = 0; r < 4; r++) for (let i = 0; i < 9 - (r % 2); i++) {
    const seed = 400 + r * 20 + i, x = 70 + i * 118 + (r % 2) * 59 + Math.sin(seed) * 10, y = 1060 + r * 50;
    const up = chant ? 0.5 + 0.5 * Math.sin(t * 7 + seed) : 0;
    crowd.push({ ...man(seed), cover: COVERS[seed % 4], x, y, s: 0.5 + r * 0.1, armL: 20 + 130 * up, armR: 20 + 130 * up, mood: 'calm', look: 0 });
  }
  crowd.sort((p, q) => p.y - q.y).forEach((o) => (s += person(o)));
  const tz = seg(5) - 0.1, zp = E.out(prog(t, tz, tz + 0.5));
  if (zp > 0) s += person({ ...man(477), cover: null, robe: C.g200, x: 540, y: lerp(1320, 1250, zp), s: 1.35, op: zp, armL: 150, armR: 150, mood: 'calm', gear: { horns: true } });
  const n = Math.round(400 * E.out(prog(t, a0 + 0.3, wordTime(3, 'profetas'))));
  const ci = E.out(prog(t, a0, a0 + 0.35));
  const html = `<div class="kpi" style="opacity:${ci};transform:translateY(${f1((1 - ci) * 20)}px)"><div class="eyebrow">Profetas</div><div class="kpi-n">${n}</div></div>`;
  return { svg: cam(s, 540, 1050, 1.0 + 0.05 * prog(t, a0, at(6))), html };
}

// ---------------------------------------------------------------- 4. outro profeta?
function scJosafa(t) {
  let s = bgDay(t, { seed: 321, sunX: 880, sunY: 420 });
  for (let i = 0; i < 14; i++) s += person({ ...man(500 + i), x: 40 + i * 76, y: 1050, s: 0.3, armL: 150, armR: 150, op: 0.75 });
  s += throne(330, 1170, 0.9, C.a400) + throne(750, 1170, 0.9, C.a400);
  s += person({ ...ACABE, x: 330, y: 1240, s: 1.18, look: 0.3, gear: { crown: true } });
  s += person({ ...JOSAFA, x: 750, y: 1240, s: 1.18, look: -1, armR: lerp(14, 60, E.out(prog(t, seg(6) + 0.6, seg(6) + 1.1))), gear: { crown: true } });
  const q = pop(t, seg(7) - 0.1, 0.4);
  if (q > 0) s += badge(780, 760, '?', { size: 70, weight: 800, fill: C.b300, edge: C.b500, scale: q, op: clamp(q) });
  return { svg: cam(s, 540, 1000, 1.04), html: '' };
}

// ---------------------------------------------------------------- 5. Micaías
function scMicaias(t) {
  const a0 = at(8);
  let s = bgDay(t, { seed: 331, sun: false });
  s += throne(800, 1170, 0.9, C.a400);
  const mi = E.out(prog(t, a0, a0 + 0.8));
  s += person({ ...MICAIAS, x: lerp(-120, 290, mi), y: 1240, s: 1.25, walk: mi < 1 ? t * 8 : null, look: 1, mood: 'calm' });
  const hate = t > seg(10) - 0.1;
  if (hate) s += `<circle cx="800" cy="980" r="${f1(260 + 20 * Math.sin(t * 5))}" fill="${C.r400}" opacity="0.18"/>`;
  s += person({ ...ACABE, x: 800, y: 1240, s: 1.25, look: -1, mood: hate ? 'angry' : 'calm', armL: hate ? 40 : 14, armR: hate ? 40 : 14, gear: { crown: true } });
  const nb = pop(t, wordTime(8, 'Micaías') - 0.1);
  s += badge(290, 820, 'Micaías', { size: 36, fill: C.b300, edge: C.b500, scale: nb, op: clamp(nb) });
  return { svg: cam(s, 540, 1000, 1.0 + 0.06 * E.sine(prog(t, a0, at(12)))), html: '' };
}

// ---------------------------------------------------------------- 6. o aviso: ovelhas sem pastor
function scAviso(t) {
  let s = bgDay(t, { seed: 341, sunX: 860, sunY: 440 });
  [[110, 1000, 0.75, 1], [300, 975, 0.7, -1], [520, 1005, 0.8, 1], [700, 985, 0.72, -1], [960, 990, 0.75, -1], [420, 1110, 1.05, 1], [640, 1120, 1.0, -1]].forEach(([x, y, sc, d], i) => {
    s += sheep(x + Math.sin(t * 0.6 + i) * 12, y, sc, t + i, d);
  });
  const tm = wordTime(13, 'morrer');
  s += throne(790, 1200, 0.85, C.a400);
  const fall = prog(t, tm - 0.1, tm + 0.5);
  s += crownAt(lerp(790, 830, fall), lerp(1060, 1195, E.in(fall)), 1.0, fall * 120);
  s += person({ ...MICAIAS, x: 290, y: 1245, s: 1.25, look: 1, armR: lerp(14, 110, E.out(prog(t, seg(12) + 0.4, seg(12) + 1))), mood: 'calm' });
  return { svg: cam(s, 540, 1000, 1.03), html: '' };
}

// ---------------------------------------------------------------- 7. pão e água
function scPrisao(t) {
  const a0 = at(14);
  let s = `<rect width="${W}" height="${H}" fill="#2B2724"/>`;
  for (let r = 0; r < 18; r++) for (let c = 0; c < 6; c++) {
    const x = c * 200 - (r % 2) * 100, y = 180 + r * 62;
    s += `<rect x="${x + 4}" y="${y}" width="192" height="56" rx="8" fill="${(r * 7 + c * 3) % 5 ? '#36312D' : '#3D3732'}" stroke="#1E1B19" stroke-width="5"/>`;
  }
  s += `<rect x="760" y="300" width="160" height="200" rx="10" fill="#C9C0B6" stroke="#1E1B19" stroke-width="6"/>`;
  const lit = 0.35 + 0.25 * prog(t, seg(16), seg(16) + 1.2);
  s += `<path d="M 760 300 L 920 300 L 760 1260 L 320 1260 Z" fill="url(#gBeam)" opacity="${f1(lit * 100) / 100}"/>`;
  s += floor('night', 0, 1180);
  s += person({ ...MICAIAS, x: 520, y: 1245, s: 1.28, mood: 'calm', look: t > seg(16) ? 0 : -0.4, rim: C.b300 });
  s += `<ellipse cx="860" cy="1232" rx="52" ry="22" fill="${C.p400}" ${ink(5, '#0E0D0C')}/>` + jar(760, 1236, 0.85);
  const down = E.out(prog(t, a0 + 0.3, a0 + 0.9));
  const by = lerp(-1300, 0, down);
  let bars = `<rect x="0" y="${f1(by + 360)}" width="${W}" height="34" fill="#4A4642" stroke="#0E0D0C" stroke-width="6"/>`;
  for (let i = 0; i < 9; i++) bars += `<rect x="${60 + i * 120}" y="${f1(by + 360)}" width="26" height="1000" rx="13" fill="#5A5652" stroke="#0E0D0C" stroke-width="6"/>`;
  s += bars;
  return { svg: cam(s, 540, 1000, 1.0 + 0.05 * prog(t, a0, at(17))), html: '' };
}

// ---------------------------------------------------------------- 8. o disfarce
function scDisfarce(t) {
  const a0 = at(17);
  let s = bgDay(t, { seed: 351, sunX: 200, sunY: 430 });
  for (let i = 0; i < 9; i++) s += tent(80 + i * 130, 1040, 0.45, C.g400, C.g500, C.r400);
  const xw = lerp(120, 720, E.inOut(prog(t, wordTime(17, 'disfarçado') - 0.6, wordTime(17, 'disfarçado') + 0.5)));
  const done = xw > 420;
  const o = done
    ? { ...ACABE, robe: C.g500, x: 420, y: 1240, s: 1.25, look: 0.6, gear: { helmet: 'isr', armor: true } }
    : { ...ACABE, x: 420, y: 1240, s: 1.25, look: 0.6, gear: { crown: true } };
  s += person(o);
  if (t > a0 + 0.3 && xw < 715) s += `<rect x="${f1(xw - 50)}" y="760" width="100" height="520" fill="url(#gBlue)" opacity="0.5"/><rect x="${f1(xw - 4)}" y="780" width="8" height="490" rx="4" fill="${C.b500}"/>`;
  const jg = E.out(prog(t, seg(18), seg(18) + 0.6));
  if (jg > 0) s += `<circle cx="790" cy="980" r="${f1(220 * jg)}" fill="url(#gAmber)" opacity="0.6"/>`;
  s += person({ ...JOSAFA, x: 790, y: 1240, s: 1.22, look: -0.5, gear: { crown: true } });
  return { svg: cam(s, 600, 1000, 1.03), html: '' };
}

// ---------------------------------------------------------------- 9. a ordem do rei da Síria
function scOrdem(t) {
  const a0 = at(19);
  let s = bgDusk(t, { sky: 'skyDusk' });
  for (let i = 0; i < 4; i++) s += chariot(560 + i * 150, 1050, 0.28, { sil: SIL, horse: true });
  const pt = E.out(prog(t, seg(20) - 0.3, seg(20) + 0.2));
  s += person({ x: 280, y: 1245, s: 1.35, sil: SIL, rim: C.p300, armR: lerp(14, 96, pt), gear: { crown: '#E4B750' } });
  const tg = pop(t, wordTime(20, 'rei') - 0.1, 0.45);
  if (tg > 0) s += crownAt(790, 880, 2.2, 0) + target(790, 880, 130 * Math.min(1, tg), t, clamp(tg));
  const ci = E.out(prog(t, a0 + 0.2, a0 + 0.6));
  const n = Math.round(32 * E.out(prog(t, a0 + 0.3, seg(19) + 1.4)));
  const html = `<div class="kpi" style="opacity:${ci};transform:translateY(${f1((1 - ci) * 20)}px)"><div class="eyebrow">Chefes de carros</div><div class="kpi-n">${n}</div></div>`;
  return { svg: cam(s, 540, 1000, 1.02), html };
}

// ---------------------------------------------------------------- 10. Josafá cercado
function scCercado(t) {
  const a0 = at(21), go = seg(22) + 0.4;
  let s = bgDay(t, { seed: 361, sunX: 860, sunY: 420 });
  const inn = E.out(prog(t, a0, a0 + 1.0)), out = E.in(prog(t, go, go + 1.2));
  const lx = lerp(-520, 120, inn) - out * 800, rx = lerp(1600, 960, inn) + out * 800;
  s += chariot(lx, 1215, 0.82, { sil: C.ch600, horse: true, gallop: t * 10, spin: t * 6, rider: person({ x: -20, y: -90, s: 0.9, sil: C.ch600, gear: { helmet: 'phil', spear: 'r' }, armR: 28, noShadow: true }) });
  s += chariot(rx, 1215, 0.82, { sil: C.ch600, horse: true, flip: true, gallop: t * 10, spin: -t * 6, rider: person({ x: -20, y: -90, s: 0.9, sil: C.ch600, gear: { helmet: 'phil', spear: 'r' }, armR: 28, noShadow: true }) });
  const scared = t > seg(21) && t < go + 0.6;
  s += person({ ...JOSAFA, x: 540, y: 1245, s: 1.2, mood: scared ? 'fear' : 'calm', shake: scared ? 2 : 0, t, armL: scared ? 150 : 14, armR: scared ? 150 : 14, gear: { crown: true } });
  return { svg: cam(s, 540, 1000, 1.04 - 0.04 * inn), html: '' };
}

// ---------------------------------------------------------------- 11. ao acaso
function scAcaso(t) {
  const tr = wordTime(24, 'acaso') - 0.15, fly = prog(t, tr, tr + 0.9);
  let s = bgDusk(t);
  for (let i = 0; i < 10; i++) s += person({ x: 380 + i * 70, y: 1060 + (i % 2) * 14, s: 0.32, sil: SIL, walk: t * 6 + i, gear: { helmet: i % 3 ? 'phil' : 'isr', spear: 'r' }, armR: 30, noShadow: true });
  const rider = person({ ...ACABE, robe: C.g500, x: -20, y: -90, s: 0.95, look: -0.3, gear: { helmet: 'isr', armor: true }, rim: C.p300 });
  s += chariot(800, 1215, 0.85, { horse: true, gallop: t * 7, spin: t * 4, fill: C.g500, rider });
  const draw = t < tr ? E.out(prog(t, seg(24), tr)) : 0;
  s += person({ x: 190, y: 1240, s: 1.3, sil: SIL, rim: C.p300, armR: 80, armL: lerp(40, 70, draw), gear: { bow: 'r', draw, helmet: 'phil' } });
  if (t < tr && draw > 0) s += arrow(190 + 1.3 * 120 + 10, 1240 - 1.3 * 171, -12, 0.75, SIL);
  if (fly > 0 && fly < 1) {
    const P = (u) => [lerp(360, 780, u), 1000 - 300 * u + 260 * u * u];
    for (let k = 1; k < 12; k++) { const u = fly - k * 0.03; if (u > 0) { const [x, y] = P(u); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="5" fill="#fff" opacity="${f1((1 - k / 12) * 0.8 * 100) / 100}"/>`; } }
    const [x, y] = P(fly), [x2, y2] = P(Math.min(1, fly + 0.01));
    s += arrow(x, y, (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI, 0.8, SIL);
  }
  return { svg: cam(s, 540, 1000, 1.0 + 0.08 * E.inOut(prog(t, seg(23), at(25)))), html: '' };
}

// ---------------------------------------------------------------- 12. entre os encaixes
function scEncaixes(t) {
  const a0 = at(25), hit = seg(25) + 0.15;
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  for (let x = 60; x < W; x += 60) s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#EDEBE6" stroke-width="2"/>`;
  for (let y = 60; y < H; y += 60) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#EDEBE6" stroke-width="2"/>`;
  // peito com placas de armadura, visto de perto
  let g = `<path d="M 230 1240 L 250 520 C 400 470 680 470 830 520 L 850 1240 Z" fill="${C.g400}" ${ink(7)}/>`;
  for (let r = 0; r < 6; r++) {
    const y = 560 + r * 110, gap = r === 3;
    g += `<path d="M 262 ${y} L 818 ${y} L 822 ${y + 92} L 258 ${y + 92} Z" fill="${C.g700}" ${ink(6)}/>`;
    for (let k = 0; k < 5; k++) g += `<circle cx="${300 + k * 120}" cy="${y + 20}" r="8" fill="${C.ch200}" ${ink(3)}/>`;
    if (gap) g += `<rect x="258" y="${y + 92}" width="564" height="18" fill="${C.g800}"/>`;
  }
  s += g;
  const gy = 560 + 3 * 110 + 101;
  const hp = E.out(prog(t, a0 + 0.1, hit));
  const ax = lerp(1300, 600, hp), ay = lerp(gy - 260, gy, hp);
  const sh = t > hit ? Math.sin((t - hit) * 60) * 6 * (1 - prog(t, hit, hit + 0.4)) : 0;
  s += arrow(ax, ay + sh, 160 + 0, 1.6);
  if (t > hit) {
    const pr = ((t - hit) * 1.2) % 1;
    s += `<circle cx="600" cy="${gy}" r="${f1(40 + pr * 90)}" fill="none" stroke="${C.r600}" stroke-width="7" opacity="${f1((1 - pr) * 100) / 100}"/>`;
    const lb = pop(t, wordTime(25, 'encaixes') - 0.1);
    s += `<line x1="600" y1="${gy}" x2="760" y2="${gy - 230}" stroke="${C.ink}" stroke-width="5" stroke-dasharray="10 10" opacity="${clamp(lb)}"/>`;
    s += badge(800, gy - 260, 'encaixe', { size: 40, upper: true, fill: C.r300, edge: C.r600, scale: lb, op: clamp(lb) });
  }
  return { svg: cam(s, 600, gy, 1.0 + 0.1 * E.inOut(prog(t, a0, at(26)))), html: '' };
}

// ---------------------------------------------------------------- 13. ao cair da tarde
function scTarde(t) {
  const a0 = at(26), dusk = E.inOut(prog(t, a0 + 0.3, seg(27) + 0.6)), die = E.out(prog(t, wordTime(27, 'morreu'), wordTime(27, 'morreu') + 1.2));
  let s = bgDay(t, { seed: 371, sun: false }) + `<g opacity="${f1(dusk * 100) / 100}">${bgDusk(t)}</g>`;
  s += sun(820, f1(lerp(380, 1060, dusk)), 70, t);
  const rider = person({ ...ACABE, robe: C.g500, x: -20, y: -90, s: 0.95, look: 0.4, mood: die > 0.3 ? 'closed' : 'sad', lean: 14 * die, armL: 20, armR: 20, gear: { helmet: 'isr', armor: true }, rim: dusk > 0.5 ? C.p300 : null });
  s += chariot(470, 1225, 1.05, { horse: true, fill: C.g500, rider });
  s += `<rect width="${W}" height="${H}" fill="#000" opacity="${f1(0.45 * die * 100) / 100}"/>`;
  return { svg: cam(s, 470, 1000, 1.0 + 0.06 * E.sine(prog(t, a0, at(28)))), html: '' };
}

// ---------------------------------------------------------------- 14. os cães, como o Senhor disse
function scCaes(t) {
  const a0 = at(28);
  let s = bgNight(t, { moonX: 820, moonY: 440 });
  s += city(560, 1000, 0.6, t, { fire: false }).replace(/fill="#FFFFFF"/g, 'fill="#2A2E33"').replace(new RegExp(C.g300, 'g'), '#23272B').replace(new RegExp(C.g400, 'g'), '#1E2226').replace(new RegExp(C.ink, 'g'), '#08090A');
  s += `<ellipse cx="560" cy="1190" rx="520" ry="70" fill="#1E3550" stroke="#08090A" stroke-width="6"/><ellipse cx="560" cy="1180" rx="440" ry="42" fill="#27476B" opacity="0.7"/>`;
  s += chariot(250, 1170, 0.7, { flip: true, fill: '#3A3836', ol: '#08090A' });
  s += dog(640, 1165, 0.9, '#0C0D0E', t) + dog(840, 1175, 0.8, '#0C0D0E', t + 1);
  let html = '';
  const vc = E.out(prog(t, seg(29) - 0.2, seg(29) + 0.25));
  if (vc > 0) html = `<div class="verse small" style="opacity:${vc};transform:translate(-50%, ${f1((1 - vc) * 30)}px)">
    <div class="eyebrow">A Bíblia diz</div><div class="vtext">“Os cães lamberam o seu sangue, ${hlWords('conforme a palavra do Senhor havia declarado.', prog(t, seg(29) + 0.3, seg(29) + 1.6))}”</div>
    <div class="vref">1 Reis 22:38 · a palavra: 1 Reis 21:19</div></div>`;
  return { svg: cam(s, 560, 1000, 1.04 - 0.04 * prog(t, a0, at(30))), html };
}

// ---------------------------------------------------------------- 15. 400 contra 1
function scQuatrocentos(t) {
  const a0 = at(30), one = seg(31), pick = wordTime(32, 'quatrocentas') - 0.2;
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const chosen = prog(t, pick, pick + 0.6), BR = [11, 14];
  for (let r = 0; r < 20; r++) for (let c = 0; c < 20; c++) {
    const k = r * 20 + c, ap = prog(t, a0 + 0.15 + k * 0.004, a0 + 0.45 + k * 0.004);
    if (ap <= 0) continue;
    const x = 160 + c * 40, y = 420 + r * 38;
    if (r === BR[0] && c === BR[1]) continue;
    const fill = chosen > 0 ? C.r400 : C.g400;
    s += `<circle cx="${x}" cy="${y}" r="${f1(13 * E.back(ap) * (1 + 0.15 * Math.sin(Math.PI * chosen)))}" fill="${fill}" stroke="${C.ink}" stroke-width="3"/>`;
  }
  const op = pop(t, one - 0.1, 0.45), fade = 1 - 0.75 * chosen;
  if (op > 0) {
    const x = 160 + BR[1] * 40, y = 420 + BR[0] * 38;
    s += `<g opacity="${f1(fade * 100) / 100}"><circle cx="${x}" cy="${y}" r="${f1(30 * op)}" fill="none" stroke="${C.b500}" stroke-width="5"/><circle cx="${x}" cy="${y}" r="${f1(14 * op)}" fill="${chosen > 0.5 ? C.g400 : C.b500}" stroke="${C.ink}" stroke-width="3"/></g>`;
  }
  const b1 = pop(t, wordTime(30, 'quatrocentas') - 0.1), b2 = pop(t, one + 0.2);
  s += badge(330, 1225 - 20, '400 vozes', { size: 38, fill: chosen > 0 ? C.r300 : '#fff', edge: chosen > 0 ? C.r600 : C.border, scale: b1, op: clamp(b1) });
  s += badge(760, 1225 - 20, '1 verdade', { size: 38, fill: C.b300, edge: C.b500, scale: b2, op: clamp(b2) * fade });
  return { svg: s, html: '' };
}

// ---------------------------------------------------------------- 16. fim
const scFim = (t) => endCard(t, AUDIO_END + 0.2, ['1 Reis 21', '1 Reis 22']);

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  { a: 0, b: at(2), f: scFlecha, label: '1 Reis 22', ref: '1 Reis 22:34', dark: true },
  { a: at(2), b: at(3), f: scAcabe, label: 'Acabe', ref: '1 Reis 22:3' },
  { a: at(3), b: at(6), f: scProfetas, label: '400 profetas', ref: [[at(3), '1 Reis 22:6'], [seg(5) - 0.1, '1 Reis 22:11-12']] },
  { a: at(6), b: at(8), f: scJosafa, label: 'Outro profeta?', ref: '1 Reis 22:7' },
  { a: at(8), b: at(12), f: scMicaias, label: 'Micaías', ref: '1 Reis 22:8' },
  { a: at(12), b: at(14), f: scAviso, label: 'O aviso', ref: '1 Reis 22:17' },
  { a: at(14), b: at(17), f: scPrisao, label: 'Pão e água', ref: '1 Reis 22:27-28', dark: true },
  { a: at(17), b: at(19), f: scDisfarce, label: 'Disfarce', ref: '1 Reis 22:30' },
  { a: at(19), b: at(21), f: scOrdem, label: 'A ordem', ref: '1 Reis 22:31', dark: true },
  { a: at(21), b: at(23), f: scCercado, label: 'Josafá cercado', ref: '1 Reis 22:32-33' },
  { a: at(23), b: at(25), f: scAcaso, label: 'Ao acaso', ref: '1 Reis 22:34', dark: true },
  { a: at(25), b: at(26), f: scEncaixes, label: 'Entre os encaixes', ref: '1 Reis 22:34' },
  { a: at(26), b: at(28), f: scTarde, label: 'Ao cair da tarde', ref: '1 Reis 22:35', dark: true },
  { a: at(28), b: at(30), f: scCaes, label: 'Como o Senhor disse', ref: '1 Reis 22:38', dark: true },
  { a: at(30), b: AUDIO_END + 0.2, f: scQuatrocentos, label: '400 contra 1', ref: '1 Reis 22:6-8' },
  { a: AUDIO_END + 0.2, b: DURATION + 1, f: scFim, label: null, ref: null, end: true },
];
