// Cenas. Cada uma devolve { svg, html } para o tempo absoluto t.

// ---------------------------------------------------------------- 1. caverna
function scCaverna(t) {
  let s = bgDay(t) + cave(830, 1190, 1.1);
  const men = [];
  for (let i = 0; i < 28; i++) {
    const r = rng(i + 101), depth = r();
    const start = -3.9 + i * 0.2;
    const x = -110 + (t - start) * 225;
    if (x < -180) continue;
    const op = 1 - prog(x, 700, 790);
    if (op <= 0) continue;
    men.push({ ...man(i + 5), x, y: 1150 + depth * 70, s: 0.7 + depth * 0.2, walk: (t - start) * 8.5, op, mood: r() < 0.5 ? 'sad' : 'calm', look: 0.6, lean: 3 });
  }
  men.sort((a, b) => a.y - b.y).forEach((m) => (s += person(m)));
  const tE = wordTime(0, 'endividados'), tA = wordTime(0, 'amargurados');
  s += badge(250, 790, 'endividados', { upper: true, size: 30, scale: pop(t, tE), op: clamp(pop(t, tE)) });
  s += badge(540, 730, 'amargurados', { upper: true, size: 30, scale: pop(t, tA), op: clamp(pop(t, tA)) });
  const svg = cam(s, 540, 980, 1 + 0.05 * E.sine(prog(t, 0, 5.3)));
  // contador no estilo de KPI da marca
  const n = Math.round(400 * E.out(prog(t, 0.35, wordTime(0, 'homens') + 0.1)));
  const ci = E.out(prog(t, 0.05, 0.4));
  const html = `<div class="kpi" style="opacity:${ci};transform:translateY(${(1 - ci) * 20}px)">
    <div class="eyebrow">Homens na caverna</div><div class="kpi-n">${n}</div></div>`;
  return { svg, html };
}

// ---------------------------------------------------------------- 2. valentes
function scValentes(t) {
  let s = bgDay(t, { seed: 21, sunX: 180, sunY: 470 });
  const xw = lerp(30, 1050, E.inOut(prog(t, 5.55, 9.5)));
  const dim = 1 - 0.6 * prog(t, 10.05, 10.4);
  let row = '';
  for (let i = 0; i < 6; i++) {
    const x = 165 + i * 150, base = man(i + 40);
    const done = x < xw;
    const bump = done ? Math.sin(Math.PI * clamp((xw - x) / 90)) * 0.07 : 0;
    const breath = Math.sin(t * 2 + i) * 2;
    const o = { ...base, x, y: 1215 + breath * 0, s: 0.98 * (1 + bump) };
    if (done) Object.assign(o, { mood: 'calm', armL: 24, armR: 24, gear: { helmet: 'isr', armor: true, ...(i % 2 ? { spear: 'r' } : { shield: 'l', sword: 'r' }) } });
    else Object.assign(o, { mood: 'sad', armL: 6, armR: 6, lean: (i % 2 ? 4 : -4) });
    row += person(o);
    if (done && xw - x < 160) {
      const k = clamp((xw - x) / 160);
      for (let j = 0; j < 4; j++) {
        const a = j * 1.57 + i, rr = 40 + k * 70;
        row += `<g transform="translate(${f1(x + Math.cos(a) * rr)} ${f1(1020 + Math.sin(a) * rr * 0.6)})" opacity="${f1((1 - k) * 100) / 100}"><path d="M 0 -14 L 4 -4 L 14 0 L 4 4 L 0 14 L -4 4 L -14 0 L -4 -4 Z" fill="${C.b500}"/></g>`;
      }
    }
  }
  s += `<g opacity="${f1(dim * 100) / 100}">${row}</g>`;
  if (t > 5.4 && t < 9.7) {
    s += `<rect x="${f1(xw - 50)}" y="640" width="100" height="600" fill="url(#gBlue)" opacity="0.5"/>`;
    s += `<rect x="${f1(xw - 4)}" y="660" width="8" height="570" rx="4" fill="${C.b500}"/>`;
  }
  const svg = cam(s, 540, 1000, 1.06 - 0.06 * E.out(prog(t, 5.05, 10.5)));
  const ct = wordTime(3, 'Como');
  const p = pop(t, ct - 0.05, 0.4);
  const html = p > 0 ? `<div class="giant" style="transform:translate(-50%,-50%) scale(${f1(p * 100) / 100});opacity:${clamp(p)}">Como<span>?</span></div>` : '';
  return { svg, html };
}

// ---------------------------------------------------------------- 3. Queila
// Mapa: lon 34.75–35.45, lat 31.406–31.874 num cartão de 920×720.
const MAP = { x: 80, y: 380, w: 920, h: 720 };
const geo = (lat, lon) => [MAP.x + (lon - 34.75) * 1314, MAP.y + (31.874 - lat) * 1539];
const PLACES = {
  adulao: geo(31.649, 34.962), queila: geo(31.613, 35.001), belem: geo(31.705, 35.2),
  gate: geo(31.7, 34.848), jerusalem: geo(31.778, 35.235), hebrom: geo(31.532, 35.095),
};
function mapCard(t, o = {}) {
  const { x, y, w, h } = MAP;
  let s = `<rect x="${x}" y="${y + 12}" width="${w}" height="${h}" rx="44" fill="${C.border}"/>`;
  s += `<clipPath id="mapClip"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="44"/></clipPath>`;
  s += `<g clip-path="url(#mapClip)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.g100}"/>`;
  // planície da costa (oeste) e montes de Judá
  s += `<path d="M ${x} ${y} L ${x + 230} ${y} C ${x + 200} ${y + 200} ${x + 260} ${y + 420} ${x + 210} ${y + h} L ${x} ${y + h} Z" fill="#F3EEE7"/>`;
  [[520, 560, 230, '#ECE5DC'], [600, 720, 190, '#E6DDD3'], [380, 900, 160, '#E6DDD3'], [700, 470, 150, '#E1D7CC'], [480, 680, 110, '#E1D7CC']].forEach(([cx, cy, r, c]) => {
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.3}" ry="${r}" fill="${c}"/>`;
  });
  for (let k = 0; k < 3; k++) s += `<ellipse cx="560" cy="650" rx="${170 + k * 70}" ry="${120 + k * 55}" fill="none" stroke="#DCD2C7" stroke-width="2" stroke-dasharray="6 8"/>`;
  // Mar Morto
  s += `<path d="M 934 ${y} C 924 520 944 640 930 760 C 920 880 940 1000 934 ${y + h} L ${x + w} ${y + h} L ${x + w} ${y} Z" fill="${C.b300}"/>`;
  s += `<text transform="translate(972 760) rotate(90)" text-anchor="middle" font-family="Geist" font-weight="600" font-size="24" fill="${C.b600}" letter-spacing="2">MAR MORTO</text>`;
  s += `<text x="${x + 46}" y="${y + 70}" font-family="Geist" font-weight="600" font-size="26" letter-spacing="2.5" fill="${C.muted}">JUDÁ</text>`;
  s += `<text x="${x + 120}" y="${PLACES.gate[1] - 60}" text-anchor="middle" font-family="Geist" font-weight="600" font-size="26" letter-spacing="2" fill="${C.r600}" opacity="${o.philOp ?? 1}">FILÍSTIA</text>`;
  // rota dos filisteus até Queila
  if (o.attack > 0) {
    const [ax, ay] = PLACES.gate, [bx, by] = PLACES.queila;
    const len = Math.hypot(bx - ax, by - ay) + 40;
    const d = `M ${ax} ${ay} Q ${(ax + bx) / 2} ${ay + 90} ${bx - 18} ${by - 6}`;
    s += `<path d="${d}" fill="none" stroke="${C.r600}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${f1(len * o.attack)} ${f1(len * 2)}"/>`;
    if (o.attack > 0.95) {
      const pr = (t * 1.6) % 1;
      s += `<circle cx="${bx}" cy="${by}" r="${f1(16 + pr * 50)}" fill="none" stroke="${C.r600}" stroke-width="5" opacity="${f1((1 - pr) * 100) / 100}"/>`;
    }
  }
  const dot = (p, name, side, color, op = 1, big = false) => {
    const [px, py] = p;
    const tx = side === 'l' ? px - 26 : px + 26;
    return `<g opacity="${op}"><circle cx="${px}" cy="${py}" r="${big ? 15 : 11}" fill="${color}" stroke="#fff" stroke-width="5"/>
      <text x="${tx}" y="${py + 11}" text-anchor="${side === 'l' ? 'end' : 'start'}" font-family="Geist" font-weight="700" font-size="${big ? 34 : 28}" fill="${C.ink}">${name}</text></g>`;
  };
  s += dot(PLACES.jerusalem, 'Jerusalém', 'r', C.g600, 0.55);
  s += dot(PLACES.hebrom, 'Hebrom', 'r', C.g600, 0.55);
  s += dot(PLACES.gate, 'Gate', 'r', C.r600, o.philOp ?? 1);
  s += dot(PLACES.adulao, 'Adulão', 'l', C.ink, 1, true);
  s += dot(PLACES.queila, 'Queila', 'r', o.attack > 0.95 ? C.r600 : C.ink, 1, true);
  s += dot(PLACES.belem, 'Belém', 'r', C.b500, o.belemOp ?? 0, true);
  s += `</g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="44" fill="none" stroke="${C.border}" stroke-width="3"/>`;
  return s;
}

function scQueila(t) {
  const T0 = 11.12, tMapOut = 13.75;
  let s = '';
  // parte B/C: a cidade sob ataque e Davi
  const cityScene = () => {
    let c = bgDay(t, { seed: 31, sunX: 860, sunY: 430 });
    c += `<path d="M 220 ${GROUND + 2} C 360 870 860 850 1040 ${GROUND + 2} Z" fill="#D8CCC0" stroke="${C.ink}" stroke-width="5"/>`;
    c += city(650, 960, 1.0, t);
    c += olive(120, GROUND + 30, 1.0) + olive(1010, GROUND + 20, 0.8);
    // filisteus chegando pela direita
    for (let i = 0; i < 6; i++) {
      const st = 13.4 + i * 0.12;
      const x = 1180 + i * 70 - (t - st) * 85;
      c += person({ x, y: 1150 + (i % 2) * 30, s: 0.8, sil: C.ch600, walk: (t - st) * 7, armR: 28, gear: { helmet: 'phil', spear: 'r', shield: i % 2 ? 'l' : null } });
    }
    const dv = E.out(prog(t, 15.2, 15.7));
    if (dv > 0) {
      c += beam(300, 0, 260, 1180, 40, 240, 0.55 * dv);
      c += person({ ...DAVI, x: lerp(120, 270, dv), y: 1225, s: 1.32, look: 0.7, armR: 20, armL: 10, op: dv, mood: 'calm' });
    }
    return c;
  };
  if (t > tMapOut - 0.4) {
    const zoomIn = 1.25 - 0.25 * E.out(prog(t, tMapOut - 0.4, tMapOut + 0.6));
    s += cam(cityScene(), 640, 900, zoomIn + 0.04 * prog(t, 14, 17.5));
  }
  if (t < tMapOut) {
    const appear = E.out(prog(t, T0 - 0.1, T0 + 0.35));
    const out = E.in(prog(t, tMapOut - 0.4, tMapOut));
    const attack = E.inOut(prog(t, wordTime(5, 'atacaram') - 0.1, wordTime(5, 'Queila') + 0.1));
    const [qx, qy] = PLACES.queila;
    const inner = `<rect width="${W}" height="${H}" fill="${C.paper}"/>` + `<g opacity="${f1(appear * 100) / 100}">${mapCard(t, { attack })}</g>`;
    s += `<g opacity="${f1((1 - out) * 100) / 100}">${cam(inner, qx, qy, (0.96 + 0.04 * appear) * (1 + out * 0.8))}</g>`;
  }
  let html = '';
  const vc = E.out(prog(t, 15.35, 15.75));
  if (vc > 0) html += verseCard('“Vá, ataque os filisteus e liberte Queila.”', '1 Samuel 23:2', vc, 'small');
  return { svg: s, html };
}

// ---------------------------------------------------------------- 4. com medo
function scMedo(t) {
  let s = `<rect width="${W}" height="${H}" fill="url(#skyGloom)"/>`;
  s += hills(905, 80, 0.0032, 41, '#CFC6BC') + hills(985, 55, 0.0055, 43, '#C2B6AA') + floor('day');
  for (let i = 0; i < 7; i++) s += person({ x: 760 + i * 46, y: 1000, s: 0.22, sil: '#8E8580', gear: { helmet: 'phil', spear: 'r' }, armR: 28, noShadow: true });
  const group = [[540, 1110, 0.95, 50], [330, 1210, 1.2, 51], [760, 1210, 1.2, 52], [130, 1260, 1.25, 53], [950, 1260, 1.25, 54]];
  group.forEach(([x, y, sc, seed], i) => {
    s += person({ ...man(seed), x, y, s: sc, mood: 'fear', shake: 2.2, t: t + i, look: i % 2 ? -0.8 : 0.8, armL: 4, armR: 4, lean: i % 2 ? 3 : -3 });
  });
  const tm = wordTime(8, 'medo');
  s += badge(540, 690, 'com medo', { upper: true, size: 40, fill: C.r300, edge: C.r600, scale: pop(t, tm - 0.1), op: clamp(pop(t, tm - 0.1)) });
  s += `<rect width="${W}" height="${H}" fill="url(#gVig)"/>`;
  return { svg: cam(s, 540, 1050, 1 + 0.07 * E.sine(prog(t, 17.4, 21.4))), html: '' };
}

// ---------------------------------------------------------------- 5. de novo
function scDeNovo(t) {
  const ans = E.out(prog(t, 23.7, 24.8));
  let s = bgNight(t, { moonX: 830, moonY: 470, starOp: 1 });
  s += `<path d="M 220 ${GROUND + 160} C 300 1000 780 1000 860 ${GROUND + 160} Z" fill="#23272B" stroke="#08090A" stroke-width="5"/>`;
  // dois pulsos de oração: "de novo"
  [21.65, wordTime(9, 'novo') - 0.05].forEach((t0) => {
    const p = prog(t, t0, t0 + 1.4);
    if (p > 0 && p < 1) s += `<circle cx="540" cy="${f1(820 - p * 380)}" r="${f1(40 + p * 120)}" fill="none" stroke="${C.b300}" stroke-width="5" opacity="${f1((1 - p) * 0.8 * 100) / 100}"/>`;
  });
  if (ans > 0) {
    s += beam(540, 0, 540, 1150, 60, 300, 0.5 * ans);
    s += `<circle cx="540" cy="900" r="${300 + 40 * ans}" fill="url(#gWhite)" opacity="${f1(0.22 * ans * 100) / 100}"/>`;
    const r = rng(77);
    for (let i = 0; i < 24; i++) {
      const ph = (t * (0.18 + r() * 0.12) + r()) % 1, x = 540 + (r() - 0.5) * 520;
      s += `<circle cx="${f1(x)}" cy="${f1(200 + ph * 900)}" r="${f1(2 + r() * 3)}" fill="#fff" opacity="${f1(ans * (1 - ph) * 100) / 100}"/>`;
    }
  }
  const open = t > wordTime(11, 'Eu');
  s += person({ ...DAVI, x: 540, y: 1170, s: 1.35, kneel: true, armL: 160, armR: 160, mood: open ? 'calm' : 'closed', rim: C.b300 });
  return { svg: cam(s, 540, 1000, 1.08 - 0.06 * E.sine(prog(t, 21.3, 27.5))), html: '' };
}

// ---------------------------------------------------------------- 6. vitória
function scVitoria(t) {
  const lt = t - 27.43;
  let s = bgDay(t, { ox: lt * 700, seed: 61, sunX: 880, sunY: 440 });
  for (let i = 0; i < 5; i++) {
    const x = 900 + i * 90 + lt * 260;
    s += person({ x, y: 1150 + (i % 2) * 24, s: 0.72, sil: C.ch600, walk: lt * 14 + i, gear: { helmet: 'phil' }, armL: 40, armR: 40 });
  }
  const runners = [[730, 1220, 1.15, 'DAVI'], [570, 1170, 0.98, 70], [430, 1225, 1.08, 71], [290, 1165, 0.95, 72], [150, 1225, 1.06, 73]];
  runners.sort((a, b) => a[1] - b[1]).forEach(([x, y, sc, seed], i) => {
    const bob = Math.abs(Math.sin(lt * 9 + i)) * -10;
    const base = seed === 'DAVI' ? DAVI : man(seed);
    s += dust(x - 30, y, (lt % 0.7) + 10, 10, 2);
    s += person({ ...base, x: x + Math.sin(lt * 2 + i) * 6, y: y + bob, s: sc, walk: lt * 15 + i, lean: 8, armR: 165, armL: 30, mood: 'calm', gear: { sword: 'r' } });
  });
  const tv = wordTime(13, 'venceram');
  const p = pop(t, tv - 0.08, 0.4);
  const html = p > 0 ? `<div class="stamp ok" style="transform:translate(-50%,0) scale(${f1(p * 100) / 100});opacity:${clamp(p)}">${icon('check', 52, C.inkDeep, 3)}<span>Queila libertada</span></div>` : '';
  const shake = Math.sin(lt * 50) * 3 * (1 - prog(lt, 0, 0.5));
  return { svg: cam(s, 540, 1000, 1.04, shake, 0), html };
}

// ---------------------------------------------------------------- 7. Ziclague
function scZiclague(t) {
  const lt = t - 29.92;
  const pan = -90 * E.inOut(prog(t, 33.6, 36));
  let s = bgDusk(t);
  let w = '';
  w += `<g filter="url(#fSmoke)">${smoke(520, 840, t, 12, 5, 1.6) + smoke(760, 860, t, 9, 6, 1.2)}</g>`;
  w += city(600, 1040, 1.0, t, { fire: true });
  w += embers(600, 980, t, 26, 3, 700);
  // a trilha das famílias levadas, para o horizonte
  const tl = E.inOut(prog(t, wordTime(15, 'famílias') - 0.2, 35.6));
  if (tl > 0) {
    w += `<path d="M 650 1040 C 820 1030 980 1012 1260 1000" fill="none" stroke="#5A463B" stroke-width="6" stroke-dasharray="${f1(700 * tl)} 900" stroke-linecap="round"/>`;
    for (let i = 0; i < 9; i++) {
      const x = 1040 + i * 26 + (t - 34) * 30;
      w += person({ x, y: 1003, s: 0.14, sil: '#1C1512', walk: t * 6 + i, noShadow: true, op: tl });
    }
    w += dust(1030, 1000, t % 0.9 + 5, 5, 3, '#5A463B');
  }
  const men = [[130, 1225, 1.18, 81], [300, 1170, 1.0, 82], [430, 1235, 1.2, 83], [540, 1160, 0.95, 84], [20, 1165, 1.0, 85]];
  men.sort((a, b) => a[1] - b[1]).forEach(([tx, y, sc, seed], i) => {
    const arrive = E.out(prog(t, 30.1 + i * 0.12, 31.9 + i * 0.12));
    const x = lerp(tx - 420, tx, arrive);
    const m = man(seed);
    w += person({ ...m, robe: shade(m.robe, 0.62), skin: shade(m.skin, 0.75), cover: m.cover ? shade(m.cover, 0.62) : null, x, y, s: sc, walk: arrive < 1 ? lt * 8 : null, mood: 'sad', look: 1, rim: C.p300, lean: arrive >= 1 ? 4 : 2 });
  });
  s += `<g transform="translate(${f1(pan)} 0)">${w}</g>`;
  s += `<rect width="${W}" height="${H}" fill="url(#gVig)"/>`;
  return { svg: cam(s, 540, 1000, 1.02 + 0.04 * prog(t, 30, 36)), html: '' };
}

// ---------------------------------------------------------------- 8. pedras
function scPedras(t) {
  const lt = t - 35.93;
  let s = `<rect width="${W}" height="${H}" fill="url(#skyRed)"/>` + `<g filter="url(#fSmoke)">${smoke(540, 980, t, 10, 9, 2, '#4A2C2A')}</g>`;
  s += hills(930, 60, 0.004, 87, '#3A2422') + floor('dusk');
  const lean = 18 * E.inOut(prog(t, 36.1, 38.5));
  const ring = [[170, 1160, 1.0, 91, 1], [910, 1160, 1.0, 92, -1], [320, 1090, 0.82, 93, 1], [760, 1090, 0.82, 94, -1], [60, 1260, 1.25, 95, 1], [1020, 1260, 1.25, 96, -1]];
  ring.sort((a, b) => a[1] - b[1]).forEach(([x, y, sc, seed, dir], i) => {
    const m = man(seed);
    const raise = E.out(prog(t, wordTime(16, 'apedrejar') - 0.4 + i * 0.05, wordTime(16, 'apedrejar') + 0.1 + i * 0.05));
    s += person({ ...m, robe: shade(m.robe, 0.55), skin: shade(m.skin, 0.7), cover: m.cover ? shade(m.cover, 0.55) : null, x: x + dir * lean, y, s: sc, mood: 'angry', look: dir, armR: dir > 0 ? lerp(20, 160, raise) : 14, armL: dir < 0 ? lerp(20, 160, raise) : 14, gear: { stone: dir > 0 ? 'r' : 'l' }, rim: C.r400 });
  });
  s += person({ ...DAVI, robe: shade(C.b500, 0.8), x: 540, y: 1225, s: 1.4, mood: 'sad', look: 0, armL: 6, armR: 6, rim: C.r300 });
  s += `<rect width="${W}" height="${H}" fill="url(#gVig)"/>`;
  return { svg: cam(s, 540, 960, 1.0 + 0.1 * E.sine(prog(lt, 0, 2.7))), html: '' };
}

// ---------------------------------------------------------------- 9. força
function scForca(t) {
  const glow = E.out(prog(t, 40.0, 42.8));
  let s = `<rect width="${W}" height="${H}" fill="url(#skyDawn)"/>` + stars(t, 50, 23, 900, 1 - glow * 0.6);
  s += `<circle cx="540" cy="1080" r="${560}" fill="url(#gBlue)" opacity="${f1((0.15 + 0.35 * glow) * 100) / 100}"/>`;
  s += hills(1000, 60, 0.004, 97, '#1A1F26') + `<path d="M 300 1220 C 400 1080 680 1080 780 1220 Z" fill="#141920"/>` + rect(-400, 1180, 1880, 900, '#12161B');
  s += beam(540, 0, 540, 1120, 50, 200, 0.25 + 0.35 * glow);
  s += person({ ...DAVI, x: 540, y: 1112, s: 0.82, kneel: true, armL: 150, armR: 150, mood: 'closed', rim: C.b300 });
  const vc = E.out(prog(t, 38.75, 39.2));
  const hl = prog(t, wordTime(18, 'fortaleceu') - 0.1, 42.6);
  const html = vc > 0 ? verseCard('Davi, porém, ' + hlWords('fortaleceu-se no Senhor seu Deus.', hl), '1 Samuel 30:6', vc, 'big', true) : '';
  return { svg: cam(s, 540, 1000, 1.04 - 0.04 * prog(t, 38.6, 43)), html };
}

// ---------------------------------------------------------------- 10. tudo
function scTudo(t) {
  const lt = t - 43.03;
  let s = `<rect width="${W}" height="${H}" fill="url(#skySunrise)"/>` + sun(250, 960, 74, t);
  s += hills(930, 70, 0.0035, 101, '#E7D8CA') + hills(995, 50, 0.006, 103, '#DCCBBA') + floor('day', lt * 30);
  const fam = [
    [900, 1225, 1.2, { ...man(111), mood: 'happy' }], [770, 1170, 0.95, { robe: C.b300, skin: SKINS[2], cover: C.g100, beard: false, mood: 'happy' }],
    [660, 1230, 0.72, { robe: C.p300, skin: SKINS[0], hair: HAIRS[1], beard: false, mood: 'happy' }], [540, 1170, 1.1, { ...man(112), mood: 'happy' }],
    [410, 1230, 1.0, { robe: C.gr300, skin: SKINS[3], cover: C.g300, beard: false, mood: 'happy' }], [300, 1170, 0.66, { robe: C.a300, skin: SKINS[1], hair: HAIRS[0], beard: false, mood: 'happy' }],
    [200, 1230, 1.15, { ...man(113), mood: 'happy' }], [80, 1170, 0.95, { robe: C.p300, skin: SKINS[4], cover: C.g200, beard: false, mood: 'happy' }],
  ];
  fam.sort((a, b) => a[1] - b[1]).forEach(([x, y, sc, o], i) => {
    s += person({ ...o, x: x - lt * 34, y: y + Math.abs(Math.sin(lt * 6 + i)) * -5, s: sc, walk: lt * 7 + i, look: -0.6 });
  });
  const tt = wordTime(19, 'tudo');
  const p = pop(t, tt - 0.1, 0.4);
  const html = p > 0 ? `<div class="stamp ok" style="transform:translate(-50%,0) scale(${f1(p * 100) / 100});opacity:${clamp(p)}">${icon('check', 52, C.inkDeep, 3)}<span>Nada faltou</span></div>` : '';
  return { svg: cam(s, 540, 1000, 1.03), html };
}

// ---------------------------------------------------------------- 11. Belém
function scBelem(t) {
  const split = 50.75;
  let s = '';
  if (t < split + 0.3) {
    let a = bgDay(t, { seed: 121, sunX: 230, sunY: 520 });
    a += cave(830, 1170, 0.95);
    [[150, 1235, 131], [300, 1185, 132], [440, 1240, 133]].forEach(([x, y, seed], i) => {
      a += person({ ...man(seed), x, y, s: 1.08, mood: 'calm', look: 1, armL: 22, armR: 22, gear: { helmet: 'isr', armor: true, ...(i === 1 ? { spear: 'r' } : { shield: 'l' }) } });
    });
    a += person({ ...DAVI, x: 660, y: 1215, s: 1.12, kneel: true, armL: 30, armR: 30, look: -0.5, mood: 'calm' });
    const b = E.out(prog(t, 47.95, 48.4));
    if (b > 0) {
      const bx = 660, by = 640, bw = 380, bh = 320;
      a += `<g opacity="${b}" transform="translate(${bx} ${by}) scale(${f1(b * 100) / 100}) translate(${-bx} ${-by})">`;
      a += `<circle cx="640" cy="${880}" r="12" fill="#fff" stroke="${C.border}" stroke-width="3"/><circle cx="625" cy="${840}" r="18" fill="#fff" stroke="${C.border}" stroke-width="3"/>`;
      a += `<rect x="${bx - bw / 2}" y="${by - bh / 2 + 10}" width="${bw}" height="${bh}" rx="40" fill="${C.border}"/><rect x="${bx - bw / 2}" y="${by - bh / 2}" width="${bw}" height="${bh}" rx="40" fill="#fff" stroke="${C.border}" stroke-width="3"/>`;
      a += well(bx, by + 80, 0.95, 0.5 * prog(t, wordTime(21, 'poço'), wordTime(21, 'poço') + 0.4));
      const tb = pop(t, wordTime(21, 'Belém') - 0.1);
      a += badge(bx, by - 96, 'Belém', { size: 34, scale: tb, op: clamp(tb), fill: C.b300, edge: C.b500 });
      a += `</g>`;
    }
    const fade = 1 - prog(t, split - 0.15, split + 0.3);
    s += `<g opacity="${f1(fade * 100) / 100}">${cam(a, 540, 1000, 1.0 + 0.05 * prog(t, 45.85, 50.8))}</g>`;
  }
  if (t > split - 0.15) {
    const fin = prog(t, split - 0.15, split + 0.3);
    let b = bgDay(t, { seed: 141, sunX: 850, sunY: 440 });
    b += `<path d="M 150 ${GROUND + 2} C 300 850 820 850 970 ${GROUND + 2} Z" fill="#D5C9BD" stroke="${C.ink}" stroke-width="5"/>`;
    b += city(560, 965, 0.82, t);
    [[150, 1080, 0.85], [330, 1110, 0.7], [800, 1100, 0.75], [960, 1075, 0.9]].forEach(([x, y, sc]) => (b += tent(x, y, sc)));
    b += well(540, 1215, 1.05, 0.35 + 0.25 * Math.sin(t * 4));
    [[240, 1215, 1.0], [720, 1200, 0.95], [900, 1230, 1.05]].forEach(([x, y, sc], i) => {
      b += person({ x, y, s: sc, sil: C.ch600, armR: 26, gear: { helmet: 'phil', spear: 'r', shield: i === 1 ? 'l' : null } });
    });
    const tb = pop(t, split + 0.1);
    b += badge(560, 690, 'Belém', { size: 36, scale: tb, op: clamp(tb) });
    s += `<g opacity="${f1(fin * 100) / 100}">${cam(b, 540, 1050, 1.06 - 0.06 * E.out(prog(t, split, 53.4)))}</g>`;
  }
  return { svg: s, html: '' };
}

// ---------------------------------------------------------------- 12. três valentes
function scTres(t) {
  const lt = t - 53.38;
  const ox = lt * 230;
  let s = bgNight(t, { ox, moonX: 210, moonY: 420 });
  let world = '';
  const r = rng(151);
  for (let i = 0; i < 9; i++) {
    const wx = 120 + i * 300 + r() * 80, sc = 0.75 + r() * 0.35;
    world += tent(wx, 1072, sc, '#1A1D20', '#141619', '#3A3F44', '#08090A');
    if (i % 2 === 0) {
      const fx = wx + 150;
      world += `<circle cx="${fx}" cy="1090" r="160" fill="url(#gAmber)" opacity="0.35"/>` + flames(fx, 1092, 0.45, t, i) + rect(fx - 30, 1088, 60, 10, C.wood, 'rx="5"');
      world += person({ x: fx + 60, y: 1110, s: 0.62, sil: '#0E1012', armR: 26, gear: { helmet: 'phil', spear: 'r' } });
    }
  }
  s += `<g transform="translate(${f1(-ox)} 0)">${world}</g>`;
  const three = [[280, 1215, 161], [470, 1245, 162], [660, 1210, 163]];
  three.forEach(([x, y, seed], i) => {
    const m = man(seed);
    const run = lt * 11 + i * 1.3;
    const o = { ...m, robe: shade(m.robe, 0.45), skin: shade(m.skin, 0.55), x: x + Math.sin(lt * 1.5 + i) * 10, y: y + Math.abs(Math.sin(run)) * -8, s: 1.15, ol: '#060708', walk: run, lean: 9, mood: 'calm', look: 1, rim: C.b300, gear: { helmet: 'isr', armor: true } };
    if (i === 1) { o.armL = 35; o.armR = 35; }
    s += person(o);
    if (i === 1) s += jar(o.x, o.y - 160 * 1.15 + 84, 1.05, 0);
  });
  // capim em primeiro plano
  for (let i = 0; i < 26; i++) {
    const gx = ((i * 97 - ox * 1.4) % 1300 + 1300) % 1300 - 100;
    s += `<path d="M ${f1(gx)} 1300 Q ${f1(gx + 8)} 1220 ${f1(gx + 20)} 1190 Q ${f1(gx + 16)} 1240 ${f1(gx + 30)} 1300 Z" fill="#0F1113"/>`;
  }
  return { svg: s, html: '' };
}

// ---------------------------------------------------------------- 13. derramou
function scAgua(t) {
  const lt = t - 57.42;
  let s = `<rect width="${W}" height="${H}" fill="url(#skySunrise)"/>` + sun(870, 600, 64, t);
  s += hills(920, 70, 0.0035, 171, '#E5D6C8') + floor('day') + cave(-60, 1100, 0.95);
  const tp = 59.25, pour = E.inOut(prog(t, tp, tp + 0.6));
  s += beam(560, 0, 560, 1200, 50, 260, 0.35 + 0.25 * prog(t, tp, 61));
  // os três olhando para Davi
  [[150, 1215, 161], [290, 1180, 162], [410, 1225, 163]].forEach(([x, y, seed]) => {
    s += person({ ...man(seed), x, y, s: 1.0, look: 1, mood: t > 61.6 ? 'calm' : 'calm', armL: 18, armR: 18, gear: { helmet: 'isr', armor: true } });
  });
  [[930, 1180, 164], [1040, 1220, 165]].forEach(([x, y, seed]) => (s += person({ ...man(seed), x, y, s: 0.95, look: -1, armL: 14, armR: 14 })));
  const dx = 600, dy = 1235, ds = 1.22;
  const lookL = t > 61.55 ? -1 : 0.2;
  const armR = lerp(28, 118, pour), armL = lerp(28, 14, pour);
  s += person({ ...DAVI, x: dx, y: dy, s: ds, look: lookL, mood: t > 61.55 ? 'sad' : 'calm', armL, armR });
  // jarro: nas duas mãos, depois na mão direita, virando
  const hand = (side, ang) => { const r = (ang * Math.PI) / 180; return [dx + ds * side * (34 + 86 * Math.sin(r)), dy + ds * (-156 + 86 * Math.cos(r))]; };
  const [hx, hy] = hand(1, armR);
  const jx = lerp(dx, hx + 20, pour), jy = lerp(dy - ds * 92, hy + 10, pour), rot = lerp(0, 118, pour);
  s += jar(jx, jy, 1.05, rot);
  if (t > tp + 0.45) {
    const rr = (rot * Math.PI) / 180;
    const mx = jx + Math.sin(rr) * 66, my = jy - Math.cos(rr) * 66;
    const gy = dy + 4, wob = Math.sin(t * 18) * 4;
    const sf = prog(t, tp + 0.45, tp + 0.7), end = 1 - prog(t, 63.8, 64.3);
    if (end > 0) {
      s += `<path d="M ${f1(mx)} ${f1(my)} C ${f1(mx + 30)} ${f1(my + 20)} ${f1(mx + 34 + wob)} ${f1(lerp(my, gy, 0.5))} ${f1(mx + 30 + wob)} ${f1(lerp(my, gy, sf))}" stroke="url(#gWater)" stroke-width="${f1(16 * end)}" fill="none" stroke-linecap="round"/>`;
      s += `<path d="M ${f1(mx)} ${f1(my)} C ${f1(mx + 30)} ${f1(my + 20)} ${f1(mx + 34 + wob)} ${f1(lerp(my, gy, 0.5))} ${f1(mx + 30 + wob)} ${f1(lerp(my, gy, sf))}" stroke="${C.b300}" stroke-width="${f1(5 * end)}" fill="none" stroke-linecap="round"/>`;
    }
    const sx = mx + 30;
    const pd = prog(t, tp + 0.6, tp + 3.5);
    s += `<ellipse cx="${f1(sx)}" cy="${gy}" rx="${f1(30 + pd * 130)}" ry="${f1(8 + pd * 22)}" fill="${C.b400}" opacity="0.75"/>`;
    s += `<ellipse cx="${f1(sx)}" cy="${gy - 3}" rx="${f1(16 + pd * 70)}" ry="${f1(4 + pd * 9)}" fill="${C.b300}" opacity="0.8"/>`;
    for (let k = 0; k < 3; k++) {
      const ph = ((t - tp) * 1.4 + k / 3) % 1;
      s += `<ellipse cx="${f1(sx)}" cy="${gy}" rx="${f1(20 + ph * 150)}" ry="${f1(6 + ph * 26)}" fill="none" stroke="${C.b500}" stroke-width="3" opacity="${f1((1 - ph) * end * 0.7 * 100) / 100}"/>`;
    }
    const r = rng(181);
    for (let k = 0; k < 10; k++) {
      const ph = ((t - tp) * (1.6 + r()) + r()) % 1, a = -Math.PI / 2 + (r() - 0.5) * 2.2, v = 60 + r() * 60;
      s += `<circle cx="${f1(sx + Math.cos(a) * v * ph)}" cy="${f1(gy - 10 + Math.sin(a) * v * ph + 120 * ph * ph)}" r="${f1(4 + r() * 3)}" fill="${C.b400}" opacity="${f1((1 - ph) * end * 100) / 100}"/>`;
    }
  }
  return { svg: cam(s, 600, 1000, 1.0 + 0.08 * E.sine(prog(lt, 0, 7))), html: '' };
}

// ---------------------------------------------------------------- 14. lista
function scLista(t) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  for (let x = 60; x < W; x += 60) s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#EDEBE6" stroke-width="2"/>`;
  for (let y = 60; y < H; y += 60) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#EDEBE6" stroke-width="2"/>`;
  const ap = E.out(prog(t, 64.5, 64.95));
  const hl = E.inOut(prog(t, wordTime(28, 'repete') - 0.1, wordTime(28, 'vitória') + 0.35));
  const lord = pop(t, wordTime(29, 'Senhor') - 0.15, 0.4);
  const lordHtml = `<b class="lord${lord > 0 ? ' on' : ''}" style="transform:scale(${lord > 0 ? f1(lord * 100) / 100 : 1})">o Senhor</b>`;
  const v = (txt, ref) => `<div class="lrow vrow"><div class="vtext">${hlWords(['E', lordHtml, ...txt.split(' ')], hl)}</div><div class="lref">${ref}</div></div>`;
  const row = (n, txt, ref) => `<div class="lrow"><div class="lnum">${n}</div><div class="lname">${txt}</div><div class="lref">${ref}</div></div>`;
  const html = `<div class="list" style="opacity:${ap};transform:translateY(${f1((1 - ap) * 30)}px)">
    <div class="lhead"><div class="eyebrow">2 Samuel 23</div><div class="ltitle">Os principais guerreiros de Davi</div></div>
    ${row(1, 'Jabesão, o tacmonita', '23:8')}
    ${row(2, 'Eleazar, filho de Dodô', '23:9')}
    ${v('concedeu uma grande vitória naquele dia.', '23:10')}
    ${row(3, 'Samá, filho de Agé', '23:11')}
    ${v('concedeu-lhe uma grande vitória.', '23:12')}
    ${row(4, 'Abisai, irmão de Joabe', '23:18')}
  </div>`;
  return { svg: s, html };
}

// ---------------------------------------------------------------- 15. o caminho
const PINS = [[420, 'Adulão'], [980, 'Queila'], [1540, 'Ziclague'], [2100, 'Belém']];
function scCaminho(t) {
  // anda pelos marcos, para, e Davi se volta para Deus em "voltava para Deus"
  const camX = 1650 * E.inOut(prog(t, 70.2, 75.4));
  const tPray = wordTime(33, 'voltava') - 0.2;
  const raise = E.out(prog(t, tPray, tPray + 0.6)), light = E.out(prog(t, tPray + 0.1, tPray + 0.9));
  let s = `<rect width="${W}" height="${H}" fill="url(#skyDay)"/>` + sun(840, 470, 58, t);
  s += hills(900, 80, 0.0028, 191, '#E3DBD2', camX * 0.3) + hills(985, 55, 0.005, 193, '#D6CBC0', camX * 0.6) + floor('day', camX);
  let near = '';
  for (let i = 0; i < 6; i++) near += olive(200 + i * 520, GROUND + 4, 0.7 + (i % 2) * 0.15);
  near += `<rect x="-400" y="1190" width="3600" height="50" rx="25" fill="#F3EDE6" stroke="${C.ink}" stroke-width="4" stroke-opacity="0.25"/>`;
  PINS.forEach(([px, name]) => {
    near += `<line x1="${px}" y1="1190" x2="${px}" y2="830" stroke="${C.ink}" stroke-width="14" stroke-linecap="round"/><line x1="${px}" y1="1190" x2="${px}" y2="830" stroke="${C.wood}" stroke-width="6" stroke-linecap="round"/>`;
    near += badge(px, 800, name, { size: 42, fill: '#fff' });
  });
  const walk = camX / 34;
  const DX = 700;
  const grp = [[DX, 'DAVI'], [580, 201], [460, 202], [340, 203], [220, 204], [100, 205]];
  grp.slice().reverse().forEach(([sx, seed], i) => {
    const wx = camX + sx;
    const lvl = PINS.filter(([px]) => wx > px).length;
    const davi = seed === 'DAVI';
    const o = { ...(davi ? DAVI : man(seed)), x: wx, y: 1215 + (i % 2) * 16, s: 0.98, walk: walk + i, mood: davi || lvl > 0 ? 'calm' : 'sad', look: raise > 0 && !davi ? 1 : 0.8, armL: 16, armR: 16 };
    if (davi) {
      o.armL = o.armR = lerp(16, 150, raise);
      if (raise > 0.5) o.mood = 'closed';
      if (light > 0) o.rim = C.b300;
    } else {
      const g = {};
      if (lvl >= 2) { g.spear = 'r'; o.armR = 26; }
      if (lvl >= 3) { g.helmet = 'isr'; g.shield = 'l'; }
      if (lvl >= 4) g.armor = true;
      o.gear = g;
      const passed = PINS.filter(([px]) => wx > px).map(([px]) => wx - px);
      const since = passed.length ? Math.min(...passed) : 999;
      if (since < 70) o.s *= 1 + 0.08 * Math.sin((Math.PI * since) / 70);
    }
    near += person(o);
  });
  s += `<g transform="translate(${f1(-camX)} 0)">${near}</g>`;
  if (light > 0) {
    s += `<rect width="${W}" height="${H}" fill="#fff" opacity="${f1(0.18 * light * 100) / 100}"/>`;
    s += beam(DX, 0, DX, 1215, 70, 240, 0.95 * light);
    s += `<circle cx="${DX}" cy="980" r="${f1(280 + 200 * light)}" fill="url(#gWhite)" opacity="${f1(0.8 * light * 100) / 100}"/>`;
    const r = rng(211);
    for (let i = 0; i < 18; i++) {
      const ph = (t * (0.2 + r() * 0.15) + r()) % 1;
      s += `<circle cx="${f1(DX + (r() - 0.5) * 360)}" cy="${f1(300 + ph * 880)}" r="${f1(2 + r() * 3)}" fill="#fff" opacity="${f1(light * (1 - ph) * 100) / 100}"/>`;
    }
  }
  const push = 0.08 * E.inOut(prog(t, 75.2, 78.75));
  return { svg: cam(s, DX, 1000, 1 + push), html: '' };
}

// ---------------------------------------------------------------- 16. fim
const scFim = (t) => endCard(t, 78.75, ['1 Samuel 23', '1 Samuel 30', '2 Samuel 23']);

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  { a: 0, b: 5.05, f: scCaverna, label: 'Parte 2', ref: '1 Samuel 22:2' },
  { a: 5.05, b: 11.12, f: scValentes, label: 'Os valentes', ref: '2 Samuel 23' },
  { a: 11.12, b: 17.56, f: scQueila, label: 'Queila', ref: [[11.12, '1 Samuel 23:1'], [15.2, '1 Samuel 23:2']] },
  { a: 17.56, b: 21.3, f: scMedo, label: 'Com medo', ref: '1 Samuel 23:3' },
  { a: 21.3, b: 27.43, f: scDeNovo, label: 'De novo', ref: '1 Samuel 23:4', dark: true },
  { a: 27.43, b: 29.92, f: scVitoria, label: 'Primeira vitória', ref: '1 Samuel 23:5' },
  { a: 29.92, b: 35.93, f: scZiclague, label: 'Ziclague', ref: '1 Samuel 30:1-3', dark: true },
  { a: 35.93, b: 38.57, f: scPedras, label: 'O pior dia', ref: '1 Samuel 30:6', dark: true },
  { a: 38.57, b: 43.03, f: scForca, label: 'Força em Deus', ref: '1 Samuel 30:6', dark: true },
  { a: 43.03, b: 45.85, f: scTudo, label: 'Recuperaram tudo', ref: '1 Samuel 30:18-19' },
  { a: 45.85, b: 53.38, f: scBelem, label: 'Água de Belém', ref: '2 Samuel 23:13-15' },
  { a: 53.38, b: 57.42, f: scTres, label: 'Três valentes', ref: '2 Samuel 23:16', dark: true },
  { a: 57.42, b: 64.46, f: scAgua, label: 'Davi não bebeu', ref: '2 Samuel 23:16-17' },
  { a: 64.46, b: 70.1, f: scLista, label: 'Quem venceu', ref: '2 Samuel 23:10-12' },
  { a: 70.1, b: 78.75, f: scCaminho, label: 'Como mudaram?', ref: null },
  { a: 78.75, b: DURATION + 1, f: scFim, label: null, ref: null, end: true },
];
