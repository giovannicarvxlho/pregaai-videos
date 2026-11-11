// A crucificação de Jesus: as 7 frases na cruz. Vídeo longo, 1920×1080.
// L(parte, linha) é o índice da frase em SEGS (as partes do roteiro.md), então trocar os
// tempos estimados pelos medidos reposiciona tudo. Jesus na cruz sempre em silhueta.

const L = (part, line) => PARTS[part - 1] + line;
const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];
const SIL = '#16110F';
const soldado = (seed, extra = {}) => ({ ...man(seed), cover: null, beard: false, robe: C.p600, gear: { helmet: 'rom', armor: true }, ...extra });
const FLOOR_Y = 880; // pés dos personagens em primeiro plano (a legenda começa em ~920)

// As três cruzes no Gólgota, com Jerusalém atrás (João 19:20).
function golgotaWide(t, o = {}) {
  const dark = o.dark, ol = dark ? '#060708' : C.ink, fill = dark ? '#1B1E22' : '#D6CCC1', cf = dark ? '#050505' : SIL, rim = dark ? '#3A3F47' : null;
  let s = dark ? '' : city(370, 622, 0.5, t);
  s += hill(960, 560, 1150, fill, ol);
  const k = o.k || [1, 1, 1], up = (i) => ({ rot: lerp(i === 2 ? 70 : -70, 0, k[i]), op: clamp(k[i] * 4) });
  s += crossFig(690, 592, 0.5, { fill: cf, rim, bow: 0.35, ...up(1) }) + crossFig(1230, 592, 0.5, { fill: cf, rim, bow: 0.35, ...up(2) });
  s += crossFig(960, 572, 0.64, { fill: cf, rim, plaque: true, bow: o.bow || 0, ...up(0) });
  return s;
}

const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const MANTO = '#A33A44'; // manto vermelho (Mateus 27:28)
const PILATOS = { robe: '#F4F1EC', skin: '#E0AC69', hair: '#3A2A20', beard: false };
const mulher = (seed, extra = {}) => ({ ...man(seed), beard: false, cover: ['#E2D8CF', C.g300, '#C9BBAE', C.g100][seed % 4], ...extra });
const NIGHT_OL = '#0E0D0C';

// Marca da frase (1 a 7) no canto, a mesma bolinha da abertura.
const tag = (n, t, t0) => { const p = pop(t, t0, 0.45); return p > 0 ? dot(140, 130, n, p) : ''; };
// Texto em SVG (rótulos curtos).
const label = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${o.fam || 'Geist'}" font-weight="${o.w || 700}" font-size="${o.size || 36}" fill="${o.fill || C.inkDeep}" opacity="${f1((o.op ?? 1) * 100) / 100}">${esc(txt)}</text>`;
// A cruz do meio de perto, em silhueta; light acende um brilho atrás da cabeça.
function crossClose(t, o = {}) {
  const dark = o.dark;
  let s = dark ? bgDark(t) : bgGloom(t, { seed: o.seed || 821 });
  if (o.light) s += `<circle cx="960" cy="240" r="520" fill="url(#gWhite)" opacity="${f1(o.light * 100) / 100}"/>`;
  s += hill(960, 880, 1300, dark ? '#1B1E22' : '#D6CCC1', dark ? '#060708' : C.ink);
  s += crossFig(960, 905, 1.5, { plaque: true, fill: dark ? '#050505' : SIL, rim: dark ? '#5A606A' : C.g300, bow: o.bow || 0 });
  return s;
}
// A cruz levada no ombro de quem tem os pés em (x, y) e escala s, andando para a direita.
function carried(x, y, s) {
  const sx = x + 30 * s, sy = y - 160 * s, ex = x - 300 * s, ey = y - 6 * s;
  const ang = Math.atan2(sy - ey, sx - ex), ux = Math.cos(ang), uy = Math.sin(ang);
  const tx = sx + ux * 90 * s, ty = sy + uy * 90 * s, cx = sx + ux * 20 * s, cy = sy + uy * 20 * s;
  const ln = (x1, y1, x2, y2) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${C.ink}" stroke-width="${f1(26 * s)}" stroke-linecap="round"/><line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${C.wood}" stroke-width="${f1(15 * s)}" stroke-linecap="round"/>`;
  return ln(ex, ey, tx, ty) + ln(cx - uy * 95 * s, cy + ux * 95 * s, cx + uy * 95 * s, cy - ux * 95 * s);
}

// ================================================================ 1. ABERTURA
// O sol deixou de brilhar e as trevas, do meio-dia às três (Lucas 23:44-45; Mateus 27:45).
const darkSpan = () => [seg(L(1, 1)), wordTime(L(1, 1), 'escuro') + 0.4];
function scTrevas(t) {
  const tb = wordTime(L(1, 0), 'brilhar'), sunOp = 1 - 0.8 * E.inOut(prog(t, tb - 0.7, tb + 0.5));
  const [d0, d1] = darkSpan(), d = E.inOut(prog(t, d0, d1));
  let s = bgGloom(t, { seed: 801 }) + `<g opacity="${f1(sunOp * 100) / 100}">${sun(1500, 200, 60, t)}</g>` + golgotaWide(t);
  if (d > 0) s += `<g opacity="${f1(d * 100) / 100}">${bgDark(t)}${golgotaWide(t, { dark: true })}</g>`;
  return { svg: cam(s, 960, 430, 1.0 + 0.06 * E.sine(prog(t, 0, at(L(1, 2))))), html: '' };
}

// O véu rasga de alto a baixo (Mateus 27:51).
function veuCena(t, p, quake, zoom) {
  let s = `<rect width="${W}" height="${H}" fill="#1E1A17"/>` + floor('dusk', 0, 860);
  s += `<circle cx="960" cy="500" r="640" fill="url(#gAmber)" opacity="${f1((0.25 + 0.6 * p) * 100) / 100}"/>` + veil(p, 560, 1360, 150, 850, { beamTo: H });
  const sh = Math.sin(t * 43) * 9 * quake, sv = Math.cos(t * 37) * 6 * quake;
  return cam(s, 960, 480, zoom, sh, sv);
}
function scVeuAbertura(t) {
  const t0 = wordTime(L(1, 2), 'rasgou') - 0.1, t1 = fim(L(1, 3)) + 0.2;
  const p = E.inOut(prog(t, t0, t1)), quake = prog(t, t0, t0 + 0.2) * (1 - prog(t, t1, t1 + 0.6));
  return { svg: veuCena(t, p, quake, 1.02 + 0.04 * prog(t, at(L(1, 2)), at(L(1, 4)))), html: '' };
}

// As 7 frases: nenhum evangelho registra as sete (Mt 27:46; Mc 15:34; Lc 23:34, 43, 46; Jo 19:26-27, 28, 30).
// Numeração na ordem tradicional: 1, 2 e 7 em Lucas; 3, 5 e 6 em João; 4 em Mateus e Marcos.
const BOOKS = [
  { name: 'Mateus', ref: '27:46', x: 330, dots: [4] },
  { name: 'Marcos', ref: '15:34', x: 750, dots: [4] },
  { name: 'Lucas', ref: '23:34, 43, 46', x: 1170, dots: [1, 2, 7] },
  { name: 'João', ref: '19:26-27, 28, 30', x: 1590, dots: [3, 5, 6] },
];
const CARD = { top: 330, w: 360, h: 380 };
function bookCard(b, i, t, k) {
  const { pin, out, hl } = k;
  if (pin <= 0 || out >= 1) return '';
  const x = b.x - CARD.w / 2, y = CARD.top + 30 * out, sc = pin * (1 + 0.05 * hl);
  const edge = hl > 0 ? C.b500 : C.border, sw = hl > 0 ? 6 : 4;
  return `<g opacity="${f1(clamp(pin) * (1 - out) * 100) / 100}" transform="translate(${b.x} ${CARD.top + CARD.h / 2}) scale(${f1(sc * 1000) / 1000}) translate(${-b.x} ${-(CARD.top + CARD.h / 2)})">
    <rect x="${x}" y="${y + 12}" width="${CARD.w}" height="${CARD.h}" rx="36" fill="${edge}"/>
    <rect x="${x}" y="${y}" width="${CARD.w}" height="${CARD.h}" rx="36" fill="#fff" stroke="${edge}" stroke-width="${sw}"/>
    <text x="${b.x}" y="${y + 82}" text-anchor="middle" font-family="Geist" font-weight="700" font-size="46" letter-spacing="-0.5" fill="${C.inkDeep}">${b.name}</text>
    <text x="${b.x}" y="${y + 330}" text-anchor="middle" font-family="Geist Mono" font-weight="500" font-size="28" fill="${C.muted}">${b.ref}</text></g>`;
}
function scSete(t) {
  const T1 = wordTime(L(1, 4), 'sete'), T2 = seg(L(1, 5)) + 0.2, T4 = seg(L(1, 10)) + 0.2, T5 = seg(L(1, 11)) + 0.3;
  const Tb = { 4: seg(L(1, 6)) + 0.1, 1: seg(L(1, 7)), 2: seg(L(1, 7)) + 0.12, 7: seg(L(1, 7)) + 0.24, 3: seg(L(1, 8)), 5: seg(L(1, 8)) + 0.12, 6: seg(L(1, 8)) + 0.24 };
  const arc = (n) => { const a = Math.PI + ((n - 0.5) / 7) * Math.PI; return [960 + 560 * Math.cos(a), 610 + 400 * Math.sin(a)]; };
  const row = (n) => [960 + (n - 4) * 140, 200];
  const inCard = (bi, n) => { const b = BOOKS[bi], k = b.dots.indexOf(n); return [b.x + (k - (b.dots.length - 1) / 2) * 104, CARD.top + 205]; };
  const home = (n) => (n === 4 ? 0 : n === 3 || n === 5 || n === 6 ? 3 : 2);
  const mix = (A, B, u) => [lerp(A[0], B[0], u), lerp(A[1], B[1], u)];
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  // a cruz some quando os livros entram e volta quando as frases se juntam
  const crossOp = (1 - prog(t, T2, T2 + 0.4)) + prog(t, T4 + 0.4, T4 + 0.9);
  if (crossOp > 0) s += crossFig(960, 900, 0.95, { plaque: true, op: clamp(crossOp) });
  const hl = pop(t, seg(L(1, 9)), 0.4) * (1 - prog(t, T4 - 0.2, T4));
  BOOKS.forEach((b, i) => (s += bookCard(b, i, t, { pin: pop(t, seg(L(1, 5)) + 0.4 + i * 0.12, 0.45), out: prog(t, T4 + 0.2, T4 + 0.6), hl: i >= 2 ? hl : 0 })));
  for (let n = 1; n <= 7; n++) {
    const p1 = E.inOut(prog(t, T2 + (n - 1) * 0.04, T2 + 0.6 + (n - 1) * 0.04));
    let P = mix(arc(n), row(n), p1);
    const pb = E.inOut(prog(t, Tb[n], Tb[n] + 0.55)), pr = E.inOut(prog(t, T4 + (n - 1) * 0.05, T4 + 0.6 + (n - 1) * 0.05));
    P = mix(mix(P, inCard(home(n), n), pb), row(n), pr);
    const pulse = 1 + 0.18 * Math.sin(Math.PI * prog(t, T5 + (n - 1) * 0.3, T5 + (n - 1) * 0.3 + 0.35));
    s += dot(P[0], P[1], n, pop(t, T1 - 0.1 + (n - 1) * 0.1, 0.4) * pulse);
  }
  // a mesma frase em Marcos (a 4 aparece nos dois)
  const cp = pop(t, wordTime(L(1, 6), 'marcos') - 0.1, 0.4), cr = E.inOut(prog(t, T4 + 0.15, T4 + 0.75));
  if (cp > 0 && cr < 1) { const P = mix(inCard(1, 4), row(4), cr); s += dot(P[0], P[1], 4, cp, 1 - cr * 0.9); }
  return { svg: cam(s, 960, 520, 1.0 + 0.03 * prog(t, at(L(1, 4)), at(L(1, 12)))), html: '' };
}

// "Aquele véu rasgado importa até hoje": a câmera entra pelo rasgo.
function scVeuLuz(t) {
  const z = 1.0 + 0.5 * E.inOut(prog(t, seg(L(1, 12)), fim(L(1, 12)) + 0.8));
  return { svg: veuCena(t, 1, 0, z), html: '' };
}

// ================================================================ 2. A MORTE MAIS HUMILHANTE
// Contexto histórico, fora da Bíblia: cruzes vazias na beira da estrada, sem corpos na tela.
function estrada(t, o) {
  let s = bgGloom(t, { seed: 831 });
  s += `<path d="M 760 ${GROUND} L 1160 ${GROUND} L 1960 ${H + 20} L -40 ${H + 20} Z" fill="#E6DCCF" stroke="${C.ink}" stroke-width="5"/>`;
  for (let i = 3; i >= 0; i--) {
    const k = i / 3, show = i === 0 ? 1 : pop(t, o.more + (i - 1) * 0.25, 0.4);
    if (show <= 0) continue;
    const x = lerp(470, 800, k), y = lerp(960, 680, k), sc = lerp(0.72, 0.2, k) * show;
    s += crossFig(x, y, sc, { wood: true, body: false }) + crossFig(W - x, y, sc, { wood: true, body: false });
  }
  const walk = prog(t, o.people, o.people + 9);
  if (walk > 0) [0, 1, 2].forEach((i) => (s += person({ ...man(840 + i), x: lerp(-120, 1300, walk) - i * 130, y: 900 + i * 14, s: 0.9, walk: t * 6 + i, look: i === 1 ? -1 : 1, op: clamp(walk * 8) })));
  return s;
}
function scCruz(t) {
  const s = estrada(t, { more: seg(L(2, 1)) + 0.4, people: seg(L(2, 2)) + 0.6 });
  return { svg: cam(s, 960, 640, 1.12 - 0.12 * E.inOut(prog(t, at(L(2, 0)), at(L(2, 3))))), html: '' };
}
// Escravos, rebeldes e bandidos; o cidadão romano ficava fora.
function scQuem(t) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>` + floor('day', 0, 760);
  const ws = ['escravos', 'rebeldes', 'bandidos'];
  const civ = pop(t, seg(L(2, 4)) + 0.3, 0.5), fade = prog(t, seg(L(2, 4)), seg(L(2, 4)) + 0.5);
  ws.forEach((w, i) => {
    const p = pop(t, wordTime(L(2, 3), w) - 0.15, 0.45), x = 480 + i * 330;
    if (p <= 0) return;
    s += `<g opacity="${f1(clamp(p) * (1 - 0.6 * fade) * 100) / 100}">${person({ x, y: 820, s: 1.15 * p, sil: '#2B2421' })}${label(x, 880, w, { size: 40 })}</g>`;
  });
  if (civ > 0) s += `<g opacity="${f1(clamp(civ) * 100) / 100}">${person({ ...PILATOS, robe: '#FFFFFF', x: 1560, y: 820, s: 1.15 * civ, look: -1, mood: 'calm' })}${label(1560, 880, 'cidadão romano', { size: 40, fill: C.b600 })}</g>`;
  return { svg: cam(s, 960, 540, 1.02), html: '' };
}
// Cícero, o orador (Contra Verres, II.5.165).
function scCicero(t) {
  let s = bgDay(t, { seed: 851, sunX: 1600, sunY: 220 });
  [380, 760, 1160, 1540].forEach((x) => (s += rect(x - 46, 150, 92, 500, C.g100, ink(6)) + rect(x - 62, 128, 124, 34, C.g300, `rx="8" ${ink(6)}`)));
  s += rect(250, 120, 1420, 30, C.g300, ink(6));
  s += rect(700, 700, 520, 100, C.g300, `rx="10" ${ink(6)}`) + rect(740, 680, 440, 30, C.g400, `rx="8" ${ink(6)}`);
  const arm = 120 + 30 * Math.sin(t * 2.2);
  s += person({ ...PILATOS, hair: C.g700, bald: true, x: 960, y: 690, s: 1.25, mood: 'angry', armR: arm, armL: 20 });
  for (let i = 0; i < 5; i++) s += person({ ...man(860 + i), x: 300 + i * 340 + (i > 1 ? 80 : 0), y: 930, s: 0.95, look: i < 2 ? 1 : -1, noShadow: true });
  return { svg: cam(s, 960, 540, 1.0 + 0.05 * prog(t, at(L(2, 5)), at(L(2, 6)))), html: '' };
}
function scVergonha(t) {
  return { svg: cam(bgGloom(t, { seed: 861 }) + golgotaWide(t), 960, 400, 1.0 + 0.25 * E.inOut(prog(t, at(L(2, 6)), at(L(3, 0))))), html: '' };
}

// ================================================================ 3. ATÉ A CRUZ
// Getsêmani: a oração (Lucas 22:44; Mateus 26:39).
function scGetsemani(t) {
  let s = bgNight(t, { moonX: 1520, moonY: 200 });
  [[260, 1.6], [640, 1.25], [1350, 1.4], [1720, 1.7]].forEach(([x, sc]) => (s += olive(x, GROUND + 60, sc, '#3E4A3A', '#33402F', NIGHT_OL)));
  const pray = E.out(prog(t, seg(L(3, 2)), seg(L(3, 2)) + 1));
  s += `<circle cx="960" cy="560" r="${f1(260 + 80 * pray)}" fill="url(#gBlue)" opacity="${f1(0.15 + 0.25 * pray * 100 / 100)}"/>`;
  s += `<path d="M 760 880 Q 960 800 1160 880 Z" fill="#2A2F35" stroke="${NIGHT_OL}" stroke-width="6"/>`;
  s += person({ ...JESUS, x: 960, y: 870, s: 1.45, kneel: true, mood: t < seg(L(3, 2)) ? 'sad' : 'closed', armL: lerp(20, 150, pray), armR: lerp(20, 150, pray), rim: C.b300 });
  return { svg: cam(s, 960, 600, 1.0 + 0.12 * E.inOut(prog(t, at(L(3, 0)), at(L(3, 4))))), html: '' };
}
// A prisão: Judas com a multidão armada, o beijo, a orelha do servo (Mateus 26:47-49; João 18:10; Lucas 22:51).
function torch(x, y, t, seed) {
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 90}" stroke="${NIGHT_OL}" stroke-width="12" stroke-linecap="round"/>` + flames(x, y - 90, 0.45, t, seed);
}
function scPrisao(t) {
  const mob = E.out(prog(t, seg(L(3, 5)) - 0.2, seg(L(3, 5)) + 1.6));
  const step = E.inOut(prog(t, seg(L(3, 6)), seg(L(3, 7)) + 0.4)), kiss = E.inOut(prog(t, wordTime(L(3, 7), 'beijou') - 0.3, wordTime(L(3, 7), 'beijou') + 0.2));
  const cut = wordTime(L(3, 8), 'orelha'), heal = wordTime(L(3, 9), 'curou');
  let s = bgNight(t, { moonX: 1520, moonY: 200 });
  [[220, 1.6], [520, 1.2], [1780, 1.5]].forEach(([x, sc]) => (s += olive(x, GROUND + 60, sc, '#3E4A3A', '#33402F', NIGHT_OL)));
  const mx = lerp(2300, 1420, mob);
  for (let i = 0; i < 7; i++) {
    const x = mx + (i % 4) * 120 + (i > 3 ? 60 : 0), y = 860 + (i > 3 ? -30 : 0);
    s += person({ x, y, s: 1.05, sil: '#1A1714', rim: C.p400, flip: true, gear: i % 2 ? { spear: 'r' } : { sword: 'r' }, armR: 30, walk: mob < 1 ? t * 7 + i : null, noShadow: true });
    if (i % 3 === 0) s += torch(x - 60, y - 140, t, i);
  }
  // o servo do sumo sacerdote, na frente da multidão
  const hurt = t > cut, healed = t > heal;
  s += person({ ...man(871), x: mx - 120, y: 880, s: 1.15, look: -1, mood: hurt && !healed ? 'fear' : 'calm', t, armL: hurt && !healed ? 165 : 20 });
  if (healed) s += `<circle cx="${f1(mx - 120 - 40)}" cy="${f1(880 - 236)}" r="${f1(30 + 40 * prog(t, heal, heal + 0.6))}" fill="url(#gWhite)" opacity="${f1((1 - prog(t, heal + 0.4, heal + 1.4)) * 100) / 100}"/>`;
  // Judas chega perto e beija
  const jx = lerp(mx - 260, 1080, step);
  s += person({ ...man(872), robe: '#7B6A55', beard: true, x: jx, y: 880, s: 1.2, look: -1, lean: -9 * kiss, walk: step > 0 && step < 1 ? t * 7 : null });
  // Pedro com a espada
  const swing = prog(t, cut - 0.5, cut);
  s += person({ ...man(873), robe: C.g600, beard: true, x: 600, y: 880, s: 1.2, look: 1, mood: 'angry', armR: lerp(160, 70, E.in(swing)) * (t > cut - 0.6 ? 1 : 0) || 20, gear: t > cut - 0.6 ? { sword: 'r' } : {} });
  s += person({ ...JESUS, x: 860, y: 880, s: 1.25, look: healed || t > heal - 0.6 ? 1 : 0, mood: 'calm', armR: t > heal - 0.6 ? 70 : 14, rim: C.b300 });
  const camX = lerp(960, 900, prog(t, seg(L(3, 6)), seg(L(3, 7)))), z = 1.0 + 0.2 * E.inOut(prog(t, seg(L(3, 6)), seg(L(3, 7)) + 0.6)) - 0.2 * E.inOut(prog(t, seg(L(3, 8)) - 0.3, seg(L(3, 8)) + 0.4));
  return { svg: cam(s, camX, 620, Math.max(z, 1.01 + Math.abs(960 - camX) / 960), 960 - camX, 0), html: '' };
}
// Pilatos, Barrabás e o lavar das mãos (Lucas 23:4, 14, 22; Mateus 27:20-26).
function palacio(t, o) {
  let s = bgDay(t, { seed: 881, sunX: 300, sunY: 200 });
  [300, 620, 1300, 1620].forEach((x) => (s += rect(x - 44, 120, 88, 560, C.g100, ink(6)) + rect(x - 60, 100, 120, 32, C.g300, `rx="8" ${ink(6)}`)));
  s += rect(200, 90, 1520, 26, C.g300, ink(6));
  s += rect(1080, 640, 620, 130, C.g300, ink(6)) + rect(1050, 620, 680, 34, C.g400, `rx="8" ${ink(6)}`);
  s += throne(1560, 622, 0.62, C.a400);
  return s;
}
function scPilatos(t) {
  const g = ['vezes', 'encontrava', 'morte'].map((w) => wordTime(L(3, 12), w));
  const arm = g.reduce((m, tg) => Math.max(m, Math.sin(Math.PI * prog(t, tg - 0.2, tg + 0.5))), 0);
  const yell = t > seg(L(3, 13)) - 0.1, free = E.inOut(prog(t, wordTime(L(3, 14), 'solto') - 0.3, wordTime(L(3, 14), 'solto') + 1.2));
  const led = E.inOut(prog(t, wordTime(L(3, 14), 'condenado') - 0.4, wordTime(L(3, 14), 'condenado') + 0.8));
  let s = palacio(t);
  s += person({ ...PILATOS, x: 1360, y: 640, s: 1.1, look: -1, mood: 'calm', armR: 14 + 90 * arm, armL: 14 });
  // Barrabás aparece no estrado e sai livre pela esquerda
  const bb = pop(t, wordTime(L(3, 13), 'barrabás') - 0.2, 0.4);
  if (bb > 0) s += person({ ...man(882), robe: '#5A4636', hair: '#191919', beard: true, x: lerp(1180, -200, free), y: lerp(640, 900, prog(free, 0, 0.25)), s: 1.1, look: -1, mood: 'happy', walk: free > 0 && free < 1 ? t * 7 : null, op: clamp(bb) });
  // Jesus, de mãos amarradas, levado por um soldado
  const jx = lerp(820, 1500, led);
  s += person({ ...JESUS, x: jx, y: 880, s: 1.25, look: 1, mood: 'closed', armL: 8, armR: 8, walk: led > 0 && led < 1 ? t * 5 : null });
  s += `<line x1="${f1(jx - 34)}" y1="${f1(880 - 70 * 1.25)}" x2="${f1(jx + 34)}" y2="${f1(880 - 70 * 1.25)}" stroke="#7A5A3A" stroke-width="6"/>`;
  if (led > 0) s += person({ ...soldado(883), x: jx + 150, y: 880, s: 1.2, look: -1, armR: 26, gear: { helmet: 'rom', armor: true, spear: 'r' }, walk: led < 1 ? t * 5 : null, op: clamp(led * 4) });
  for (let i = 0; i < 6; i++) s += person({ ...man(884 + i), x: 60 + i * 115, y: 930 + (i % 2) * 20, s: 1.0, look: 1, mood: yell ? 'angry' : 'calm', armR: yell ? 150 + 15 * Math.sin(t * 9 + i) : 20, noShadow: true });
  return { svg: cam(s, 960, 540, 1.0 + 0.04 * prog(t, at(L(3, 11)), at(L(3, 15)))), html: '' };
}
function scLavaMaos(t) {
  let s = palacio(t);
  s += `<rect width="${W}" height="${H}" fill="${C.paper}" opacity="0.35"/>`;
  s += person({ ...PILATOS, x: 960, y: 900, s: 1.7, look: 0, mood: 'calm', armL: 42, armR: 42 });
  s += rect(880, 760, 160, 20, '#C9BBAE', `rx="10" ${ink(5)}`) + `<path d="M 860 700 L 1060 700 Q 1050 770 960 770 Q 870 770 860 700 Z" fill="${C.g300}" ${ink(6)}/>` + `<ellipse cx="960" cy="702" rx="98" ry="14" fill="${C.b400}" ${ink(4)}/>`;
  for (let i = 0; i < 6; i++) {
    const ph = (t * 1.6 + i / 6) % 1, x = 920 + (i % 3) * 40, y = 650 + ph * 50;
    s += `<path d="M ${x} ${f1(y)} q -7 12 0 16 q 7 -4 0 -16 Z" fill="${C.b300}" opacity="${f1((1 - ph) * 100) / 100}"/>`;
  }
  return { svg: cam(s, 960, 520, 1.0 + 0.05 * prog(t, at(L(3, 15)), at(L(3, 16)))), html: '' };
}
function scEntregue(t) {
  const go = E.inOut(prog(t, seg(L(3, 16)) + 0.8, fim(L(3, 16)) + 0.6));
  let s = palacio(t);
  s += person({ ...PILATOS, x: 1360, y: 640, s: 1.1, look: 1, mood: 'calm', armR: 95 });
  const jx = lerp(900, 2000, go);
  s += person({ ...soldado(885), x: jx - 170, y: 880, s: 1.2, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26, walk: go > 0 && go < 1 ? t * 5 : null });
  s += person({ ...JESUS, x: jx, y: 880, s: 1.25, look: 1, mood: 'closed', armL: 8, armR: 8, walk: go > 0 && go < 1 ? t * 5 : null });
  s += person({ ...soldado(886), x: jx + 170, y: 880, s: 1.2, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26, walk: go > 0 && go < 1 ? t * 5 : null });
  return { svg: cam(s, 960, 540, 1.02), html: '' };
}
// O pretório: coroa de espinhos, manto vermelho, a vara e o "Salve, rei dos judeus!" (Mateus 27:28-29).
function pretorioW(t, o) {
  let s = `<rect width="${W}" height="${H}" fill="${C.g200}"/>`;
  for (let r = 0; r < 12; r++) for (let c = 0; c < 12; c++) { const x = c * 170 - (r % 2) * 85, y = 60 + r * 64; if (y < 740) s += `<rect x="${x + 6}" y="${y}" width="158" height="56" rx="6" fill="none" stroke="${C.g300}" stroke-width="4"/>`; }
  [360, 1560].forEach((x) => (s += rect(x - 52, 40, 104, 740, C.g100, ink(6)) + rect(x - 70, 20, 140, 40, C.g300, `rx="8" ${ink(6)}`) + rect(x - 70, 740, 140, 40, C.g300, `rx="8" ${ink(6)}`)));
  s += rect(-20, 780, W + 40, 400, C.g300) + `<line x1="0" y1="780" x2="${W}" y2="780" stroke="${C.ink}" stroke-width="6"/>`;
  const sal = o.salve || 0;
  [[640, 891, 1], [1280, 892, -1], [480, 893, 1], [1440, 894, -1]].forEach(([x, seed, lk], i) => {
    if (i > 1 && !o.kneel) return;
    const sd = soldado(seed, { x, y: 860, s: 1.2, look: lk });
    s += person(o.kneel ? { ...sd, kneel: true, mood: 'happy', armL: lerp(20, 150, sal), armR: lerp(20, 150, sal) } : { ...sd, mood: 'happy', armR: 26, gear: { ...sd.gear, spear: 'r' } });
  });
  const robe = o.manto ? MANTO : JESUS.robe;
  s += person({ ...JESUS, robe, x: 960, y: 860, s: 1.45, mood: 'closed', armR: o.vara ? 30 : 14 });
  if (o.vara) { const hx = 960 + (34 + 86 * Math.sin(Math.PI / 6)) * 1.45, hy = 860 + (-154 + 86 * Math.cos(Math.PI / 6)) * 1.45; s += `<line x1="${f1(hx - 10)}" y1="${f1(hy + 50)}" x2="${f1(hx + 24)}" y2="${f1(hy - 230)}" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/><line x1="${f1(hx - 10)}" y1="${f1(hy + 50)}" x2="${f1(hx + 24)}" y2="${f1(hy - 230)}" stroke="${C.olive}" stroke-width="6" stroke-linecap="round"/>`; }
  s += thornCrown(960, 860, 1.45, o.drop || 0);
  return s;
}
function scCoroaW(t) {
  const tc = wordTime(L(3, 17), 'coroa'), drop = 1000 * (1 - E.in(prog(t, tc - 0.35, tc + 0.05)));
  const s = pretorioW(t, { drop: t < tc - 0.35 ? 2000 : drop });
  return { svg: cam(s, 960, 860, lerp(1.0, 1.45, E.inOut(prog(t, tc - 0.1, fim(L(3, 17)) + 0.3)))), html: '' };
}
function scSalveW(t) {
  const tm = wordTime(L(3, 18), 'manto'), tv = wordTime(L(3, 18), 'vara'), tk = wordTime(L(3, 18), 'ajoelharam'), ts = wordTime(L(3, 18), 'salve');
  const s = pretorioW(t, { manto: t > tm - 0.2, vara: t > tv - 0.2, kneel: t > tk - 0.2, salve: E.back(prog(t, ts - 0.15, ts + 0.25)) });
  return { svg: cam(s, 960, 700, 1.0 + 0.04 * prog(t, at(L(3, 18)), at(L(3, 20)))), html: '' };
}
// A placa: JESUS NAZARENO, O REI DOS JUDEUS (João 19:19-20).
function placa(t, rev, langs = Infinity, readers = 0) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  s += rect(560, 160, 800, 300, '#8A6A4D', `rx="14" ${ink(8)}`) + rect(590, 190, 740, 240, '#A07E5E', `rx="8"`);
  for (let k = 0; k < 4; k++) s += `<circle cx="${k % 2 ? 1320 : 600}" cy="${k < 2 ? 200 : 420}" r="11" fill="${C.ch300}" ${ink(4)}/>`;
  const l1 = 'JESUS NAZARENO,', l2 = 'O REI DOS JUDEUS';
  const n = Math.floor(clamp(rev) * (l1.length + l2.length));
  s += label(960, 290, l1.slice(0, n), { size: 66, w: 800, fill: '#2B1F17' }) + label(960, 380, l2.slice(0, Math.max(0, n - l1.length)), { size: 66, w: 800, fill: '#2B1F17' });
  ['aramaico', 'latim', 'grego'].forEach((w, i) => {
    const p = pop(t, langs + i * 0.35, 0.4);
    if (p > 0) s += `<g transform="translate(${700 + i * 260} 545) scale(${f1(p * 100) / 100})">${rect(-110, -40, 220, 80, C.white, `rx="22" stroke="${C.border}" stroke-width="4"`)}${label(0, 12, w, { fam: 'Geist Mono', w: 600, size: 34, fill: C.ink })}</g>`;
  });
  if (readers > 0) for (let i = 0; i < 7; i++) s += person({ x: 260 + i * 230, y: 890, s: 0.8, sil: '#2B2421', op: clamp(readers * 3 - i * 0.3), noShadow: true });
  return s;
}
function scTitulo(t) {
  return { svg: cam(placa(t, prog(t, wordTime(L(3, 20), 'título') - 0.2, fim(L(3, 20)))), 960, 420, 1.0 + 0.04 * prog(t, at(L(3, 20)), at(L(3, 21)))), html: '' };
}
// O caminho: Jesus leva a cruz; Simão de Cirene é obrigado a carregá-la atrás dele (João 19:17; Lucas 23:26).
function caminho(t, o) {
  let s = bgGloom(t, { seed: 901 }) + city(280, GROUND + 20, 0.95, t);
  s += `<path d="M -40 870 C 600 830 1300 830 1960 860 L 1960 ${H + 20} L -40 ${H + 20} Z" fill="#E6DCCF" stroke="${C.ink}" stroke-width="5"/>`;
  return s;
}
function scCaminho(t) {
  const t21 = seg(L(3, 21)), tz = seg(L(3, 22)), grab = wordTime(L(3, 22), 'obrigaram'), swap = wordTime(L(3, 22), 'carregar');
  const jx = lerp(560, 1060, prog(t, t21 - 0.3, fim(L(3, 25)) + 1));
  let s = caminho(t);
  const sim = E.out(prog(t, tz, grab + 0.4)), sx = lerp(2050, jx + 380, sim);
  const hasCross = t > swap;
  // os soldados
  s += person({ ...soldado(902), x: jx - 300, y: 900, s: 1.15, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26, walk: t * 5 });
  s += person({ ...soldado(903), x: jx + 230, y: 905, s: 1.15, look: t > grab - 0.3 && t < swap + 0.5 ? 1 : -1, armR: t > grab - 0.3 && t < swap ? 95 : 26, gear: { helmet: 'rom', armor: true, spear: 'l' }, walk: t * 5 });
  // Jesus
  s += person({ ...JESUS, x: jx, y: 890, s: 1.25, look: 1, mood: 'closed', walk: t * 5 });
  if (!hasCross) s += carried(jx, 890, 1.25);
  // Simão de Cirene, que vinha do campo
  const simX = hasCross ? lerp(sx, jx - 520, E.inOut(prog(t, swap, swap + 1.2))) : sx;
  s += person({ ...man(904), robe: '#B5A399', beard: true, cover: '#E2D8CF', x: simX, y: 900, s: 1.2, look: hasCross ? 1 : -1, walk: t * 5, mood: 'calm' });
  if (hasCross) s += carried(simX, 900, 1.2);
  const nm = pop(t, wordTime(L(3, 23), 'simão') - 0.2, 0.4);
  if (nm > 0) s += `<g opacity="${f1(clamp(nm) * 100) / 100}">${rect(simX - 190, 520, 380, 76, C.white, `rx="22" stroke="${C.border}" stroke-width="4"`)}${label(simX, 572, 'Simão de Cirene', { size: 40, fill: C.b600 })}</g>`;
  return { svg: cam(s, jx, 640, 1.0, 960 - jx, 0), html: '' };
}
// "Simão, pai de Alexandre e de Rufo" (Marcos 15:21)
function scFilhos(t) {
  const p = E.out(prog(t, at(L(3, 24)), at(L(3, 24)) + 0.5)), hl = prog(t, wordTime(L(3, 24), 'alexandre') - 0.2, fim(L(3, 24)));
  const tk = 'Certo homem de Cirene, chamado Simão, pai de Alexandre e de Rufo, passava por ali, chegando do campo.'.split(' ');
  const txt = tk.map((w, i) => (i >= 8 && i <= 11 ? `<mark style="--p:${f1(clamp(hl * 4 - (i - 8)) * 100)}%">${w} </mark>` : `${w} `)).join('');
  return { svg: `<rect width="${W}" height="${H}" fill="${C.paper}"/>`, html: verseCard(txt, 'Marcos 15:21', f1(p * 100) / 100, 'big') };
}
// As mulheres que choravam e as palavras de Jesus (Lucas 23:27-28).
function scFilhas(t) {
  const turn = t > wordTime(L(3, 27), 'virou') - 0.2;
  const jx = 1100;
  let s = caminho(t);
  for (let i = 0; i < 4; i++) s += person({ ...man(911 + i), x: 1500 + i * 120, y: 860 - (i % 2) * 20, s: 0.95, sil: '#9E9488', noShadow: true });
  s += person({ ...soldado(915), x: jx + 260, y: 900, s: 1.15, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26 });
  [[420, 921], [580, 922], [740, 923]].forEach(([x, seed], i) => (s += person({ ...mulher(seed), x, y: 900 - (i % 2) * 14, s: 1.1, look: 1, mood: 'sad', armL: 150 - i * 10, armR: i === 1 ? 150 : 20 })));
  s += person({ ...JESUS, x: jx, y: 890, s: 1.25, look: turn ? -1 : 1, mood: 'calm', walk: turn ? null : t * 5 });
  return { svg: cam(s, 900, 620, 1.0 + 0.12 * E.inOut(prog(t, wordTime(L(3, 27), 'virou'), fim(L(3, 27))))), html: '' };
}

// ================================================================ 4. PRIMEIRA FRASE
// Nove da manhã, um criminoso de cada lado (Marcos 15:25, 27).
function scNove(t) {
  const up = (l, w) => E.out(prog(t, wordTime(l, w) - 0.2, wordTime(l, w) + 0.5));
  const s = bgGloom(t, { seed: 921, sun: [380, 330] }) + golgotaWide(t, { k: [up(L(4, 0), 'crucificaram'), up(L(4, 1), 'criminoso'), up(L(4, 1), 'lado')] });
  return { svg: cam(s, 960, 430, 1.06 - 0.05 * E.sine(prog(t, at(L(4, 0)), at(L(4, 2))))), html: '' };
}
function scPlaca(t) {
  const rev = prog(t, wordTime(L(4, 2), 'jesus') - 0.1, fim(L(4, 2)));
  const s = placa(t, rev, wordTime(L(4, 3), 'aramaico') - 0.1, prog(t, wordTime(L(4, 3), 'leu') - 0.4, wordTime(L(4, 3), 'leu') + 0.6));
  return { svg: cam(s, 960, 470, 1.0 + 0.03 * prog(t, at(L(4, 2)), at(L(4, 4)))), html: '' };
}
// "O que escrevi, escrevi" (João 19:21-22).
function scEscrevi(t) {
  const te = wordTime(L(4, 4), 'escrevi'), chop = Math.sin(Math.PI * prog(t, te - 0.3, te + 0.4));
  let s = palacio(t);
  s += person({ ...PILATOS, x: 1360, y: 640, s: 1.1, look: -1, mood: t > seg(L(4, 4)) + 1.5 ? 'angry' : 'calm', armR: 14 + 80 * chop, armL: 14 });
  [[520, 931], [700, 932], [880, 933]].forEach(([x, seed], i) => (s += person({ ...lider(seed), x, y: 880 - (i % 2) * 12, s: 1.2, look: 1, mood: 'angry', armR: 120 + 20 * Math.sin(t * 8 + i), armL: 20 })));
  return { svg: cam(s, 960, 540, 1.02 + 0.04 * prog(t, at(L(4, 4)), at(L(4, 5)))), html: '' };
}
function scPerdoa(t) {
  const tp = seg(L(4, 6)), light = 0.08 + 0.4 * E.out(prog(t, tp - 0.2, tp + 0.8));
  const s = crossClose(t, { light });
  return { svg: cam(s, 960, 905, 1.0 + 0.06 * prog(t, at(L(4, 5)), at(L(4, 7)))) + tag(1, t, seg(L(4, 5)) + 0.4), html: '' };
}
// Os soldados tiram sortes pelas roupas (Lucas 23:34; João 19:23-24).
function scSortes(t) {
  let s = bgGloom(t, { seed: 941 });
  s += hill(960, 640, 1300, '#D6CCC1') + crossFig(960, 660, 0.95, { plaque: true, rim: C.g300 });
  s += `<path d="M 840 860 Q 960 830 1080 860 L 1104 900 Q 960 914 816 900 Z" fill="${C.g100}" ${ink(5)}/>`;
  const roll = Math.floor(t * 6) % 3;
  [[915, 868], [985, 876]].forEach(([x, y], i) => (s += `<rect x="${x}" y="${y - (roll === i ? 10 : 0)}" width="24" height="24" rx="5" fill="${C.white}" ${ink(4)} transform="rotate(${(roll + i) * 20} ${x + 12} ${y + 12})"/>`));
  [[640, 951, 1], [1280, 952, -1], [470, 953, 1]].forEach(([x, seed, lk], i) => (s += person({ ...soldado(seed), x, y: 870 - (i === 2 ? 30 : 0), s: i === 2 ? 0.95 : 1.1, kneel: true, mood: 'happy', look: lk, armL: 34, armR: i === 0 ? 40 + 30 * Math.abs(Math.sin(t * 6)) : 34 })));
  return { svg: cam(s, 960, 640, 1.03 + 0.04 * prog(t, at(L(4, 7)), at(L(4, 8)))), html: '' };
}
// Salmo 22:18, citado em João 19:24.
function scSalmo18(t) {
  const p = E.out(prog(t, at(L(4, 8)) + 0.2, at(L(4, 8)) + 0.7)), hl = prog(t, seg(L(4, 9)), fim(L(4, 9)));
  const out = prog(t, fim(L(4, 10)) - 0.2, fim(L(4, 10)) + 0.3);
  return { svg: `<rect width="${W}" height="${H}" fill="${C.paper}"/>`, html: verseCard(hlWords('Dividiram as minhas roupas entre si, e tiraram sortes pelas minhas vestes.', hl), 'Salmo 22:18', f1(p * (1 - out) * 100) / 100, 'big') };
}

// ================================================================ 5. SEGUNDA FRASE
function scZombariaW(t) {
  const up = E.out(prog(t, wordTime(L(5, 0), 'desça') - 0.2, wordTime(L(5, 0), 'desça') + 0.2));
  let s = bgGloom(t, { seed: 961 }) + golgotaWide(t);
  s += person({ x: 300, y: 900, s: 1.3, sil: '#2B2421', armR: lerp(14, 150, up), armL: 24, lean: Math.sin(t * 7) * 4 });
  s += person({ x: 1640, y: 910, s: 1.35, sil: '#2B2421', flip: true, armR: lerp(14, 140, up), armL: 20, lean: Math.sin(t * 7 + 2) * 4 });
  return { svg: cam(s, 960, 500, 1.03 + 0.04 * prog(t, at(L(5, 0)), at(L(5, 1)))), html: '' };
}
function scLideresW(t) {
  const tp = wordTime(L(5, 1), 'salvou'), point = E.back(prog(t, tp - 0.1, tp + 0.35));
  let s = bgGloom(t, { seed: 971 }) + `<g transform="translate(1450 600) scale(0.6) translate(-960 -560)">${golgotaWide(t)}</g>` + floor('day');
  [[360, 981, 1.15], [620, 982, 1.25], [900, 983, 1.2], [1160, 984, 1.1]].forEach(([x, seed, sc], i) => {
    const bob = Math.abs(Math.sin(t * 8 + i * 1.3)) * 10;
    s += person({ ...lider(seed), x, y: 880 - bob, s: sc, mood: 'happy', look: 0.8, armR: i === 2 ? lerp(20, 160, point) : 30, armL: i === 1 ? 30 + bob * 2 : 22 });
  });
  return { svg: cam(s, 960, 540, 1.0 + 0.05 * prog(t, at(L(5, 1)), at(L(5, 2)))), html: '' };
}
// Os dois criminosos (Mateus 27:44; Marcos 15:32; Lucas 23:39-43).
function shout(x, y, dir, t, on, col) {
  if (on <= 0) return '';
  let g = '';
  for (let k = 0; k < 3; k++) { const a = (dir > 0 ? -0.5 : Math.PI + 0.5) + dir * (k - 1) * 0.42, j = 6 * Math.sin(t * 20 + k); g += `<line x1="${f1(x + Math.cos(a) * 46)}" y1="${f1(y + Math.sin(a) * 46)}" x2="${f1(x + Math.cos(a) * (84 + j))}" y2="${f1(y + Math.sin(a) * (84 + j))}" stroke="${col}" stroke-width="8" stroke-linecap="round"/>`; }
  return `<g opacity="${f1(on * 100) / 100}">${g}</g>`;
}
function ladroes(t, o) {
  let s = bgGloom(t, { seed: 991 });
  if (o.warm) s += `<circle cx="640" cy="330" r="${f1(380 + 200 * o.warm)}" fill="url(#gAmber)" opacity="${f1(o.warm * 0.8 * 100) / 100}"/>`;
  s += hill(960, 860, 1300, '#D6CCC1');
  const lb = o.leftTurn ?? 0.35;
  s += crossFig(600, 900, 1.0, { rim: C.g300, bow: lb });
  s += flipX(1320, crossFig(1320, 900, 1.0, { rim: C.g300, bow: 0.35 }));
  s += crossFig(960, 880, 1.15, { plaque: true, rim: C.g300, bow: 0.15 });
  s += shout(600 + 30, 900 - 430, 1, t, o.leftShout || 0, C.r600) + shout(1320 - 30, 900 - 430, -1, t, o.rightShout || 0, C.r600);
  if (o.leftSpeak) s += shout(600 + 30, 900 - 430, 1, t * 0.3, o.leftSpeak, C.b500);
  return s;
}
function scLadroes(t) {
  const ins = wordTime(L(5, 2), 'insultavam'), rep = seg(L(5, 3)) + 1.2;
  const both = prog(t, ins - 0.4, ins), leftStop = prog(t, rep - 0.2, rep + 0.3);
  const s = ladroes(t, { leftShout: both * (1 - leftStop), rightShout: both, leftSpeak: leftStop * (1 - prog(t, fim(L(5, 4)), fim(L(5, 4)) + 0.4)), leftTurn: lerp(0.35, 0.9, leftStop) });
  const z = 1.0 + 0.25 * E.inOut(prog(t, seg(L(5, 4)), seg(L(5, 4)) + 1));
  return { svg: cam(s, lerp(960, 820, E.inOut(prog(t, seg(L(5, 4)), seg(L(5, 4)) + 1))), 880, z, lerp(0, 140, E.inOut(prog(t, seg(L(5, 4)), seg(L(5, 4)) + 1))), 0), html: '' };
}
function scParaiso(t) {
  const warm = E.inOut(prog(t, wordTime(L(5, 7), 'hoje') - 0.3, wordTime(L(5, 7), 'paraíso') + 0.5));
  const s = ladroes(t, { leftTurn: 0.9, warm });
  return { svg: cam(s, 820, 880, 1.25, 140, 0) + tag(2, t, seg(L(5, 6)) + 0.3), html: '' };
}
function scHoje(t) {
  const h = E.out(prog(t, wordTime(L(5, 10), 'hoje') - 0.3, wordTime(L(5, 10), 'hoje') + 0.6));
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>`;
  s += `<circle cx="600" cy="300" r="${f1(420 + 300 * h)}" fill="url(#gWhite)" opacity="${f1((0.3 + 0.6 * h) * 100) / 100}"/>`;
  s += hill(700, 860, 1300, '#E9D2BE') + crossFig(600, 900, 1.25, { rim: C.a300, bow: 0.9 });
  return { svg: cam(s, 700, 900, 1.08 - 0.08 * E.sine(prog(t, at(L(5, 8)), at(L(6, 0))))), html: '' };
}

// ================================================================ 6. PAUSA
function scPausa(t) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const tq = wordTime(L(6, 1), 'frases');
  for (let n = 1; n <= 7; n++) {
    const done = n <= 2, x = 960 + (n - 4) * 160, p = pop(t, at(L(6, 0)) + 0.2 + (n - 1) * 0.08, 0.4);
    const pulse = done ? 1 + 0.2 * Math.sin(Math.PI * prog(t, tq - 0.2 + (n - 1) * 0.3, tq + 0.2 + (n - 1) * 0.3)) : 1;
    s += done ? dot(x, 420, n, p * pulse) : `<g opacity="${f1(clamp(p) * 100) / 100}"><circle cx="${x}" cy="420" r="42" fill="#fff" stroke="${C.border}" stroke-width="6"/>${label(x, 436, n, { size: 46, w: 800, fill: C.g400 })}</g>`;
  }
  return { svg: s, html: '' };
}

// ================================================================ 7. TERCEIRA FRASE
// Maria e o discípulo amado perto da cruz (João 19:25-27).
const MARIA = { ...mulher(1001), robe: C.b500, cover: '#E2D8CF', skin: '#C68B59' };
const DISCIPULO = { ...man(1002), robe: C.g400, beard: false, hair: '#3A2A20', cover: null, skin: '#C68B59' };
function scMaria(t) {
  const tm = wordTime(L(7, 1), 'maria'), td = seg(L(7, 2)), go = E.inOut(prog(t, seg(L(7, 6)) + 0.4, fim(L(7, 7)) + 0.6));
  const look = t > seg(L(7, 4)) + 0.6;
  let s = bgGloom(t, { seed: 1011 }) + city(260, GROUND + 10, 0.6, t);
  s += hill(1100, 600, 1200, '#D6CCC1') + crossFig(1100, 620, 0.85, { plaque: true, rim: C.g300, bow: 0.3 });
  [[420, 1003], [560, 1004]].forEach(([x, seed]) => (s += person({ ...mulher(seed), x: x - 400 * go, y: 880, s: 1.1, look: 1, mood: 'sad', walk: go > 0 && go < 1 ? t * 5 : null })));
  const mx = lerp(760, 300, go);
  s += person({ ...MARIA, x: mx, y: 885, s: 1.2, look: look ? 1 : 0.6, mood: 'sad', walk: go > 0 && go < 1 ? t * 5 : null });
  const dp = pop(t, td + 0.2, 0.4);
  if (dp > 0) s += person({ ...DISCIPULO, x: mx + 190, y: 885, s: 1.2 * dp, look: look ? -1 : 0.6, mood: 'sad', walk: go > 0 && go < 1 ? t * 5 : null });
  const tagLbl = (x, txt, t0) => { const p = pop(t, t0, 0.4); const w = measure(txt, '700 34px Geist') + 44; return p > 0 && go < 0.1 ? `<g opacity="${f1(clamp(p) * 100) / 100}">${rect(x - w / 2, 480, w, 64, C.white, `rx="20" stroke="${C.border}" stroke-width="4"`)}${label(x, 524, txt, { size: 34, fill: C.b600 })}</g>` : ''; };
  s += tagLbl(mx, 'Maria', tm - 0.1) + tagLbl(mx + 190, 'o discípulo', td + 0.5);
  const z = 1.0 + 0.3 * E.inOut(prog(t, seg(L(7, 4)), seg(L(7, 4)) + 0.8)) * (1 - E.inOut(prog(t, seg(L(7, 6)), seg(L(7, 6)) + 1)));
  return { svg: cam(s, 880, 640, z, 80, 0) + tag(3, t, seg(L(7, 3)) + 0.2), html: '' };
}

// ================================================================ 8. QUARTA FRASE
function scTrevas8(t) {
  const d = E.inOut(prog(t, wordTime(L(8, 0), 'trevas') - 0.4, fim(L(8, 0)) + 0.3));
  let s = bgGloom(t, { seed: 1021 }) + `<g opacity="${f1((1 - d) * 100) / 100}">${sun(960, 170, 60, t)}</g>` + golgotaWide(t);
  if (d > 0) s += `<g opacity="${f1(d * 100) / 100}">${bgDark(t)}${golgotaWide(t, { dark: true })}</g>`;
  return { svg: cam(s, 960, 430, 1.0 + 0.05 * prog(t, at(L(8, 0)), at(L(8, 1)))), html: '' };
}
function scSol(t) {
  const f = E.inOut(prog(t, wordTime(L(8, 1), 'deixou') - 0.2, fim(L(8, 1)) + 0.2));
  let s = `<rect width="${W}" height="${H}" fill="#14171B"/>` + `<rect width="${W}" height="${H}" fill="url(#skyGloom)" opacity="${f1((1 - f) * 100) / 100}"/>`;
  s += `<circle cx="960" cy="440" r="${f1(330 - 60 * f)}" fill="${C.a300}" opacity="${f1((0.25 * (1 - f)) * 100) / 100}"/>`;
  s += `<circle cx="960" cy="440" r="180" fill="${f > 0.5 ? '#1E2228' : C.a300}" opacity="${f1((1 - 0.6 * Math.sin(Math.PI * f)) * 100) / 100}" stroke="${f > 0.5 ? '#3A3F47' : 'none'}" stroke-width="6"/>`;
  return { svg: cam(s, 960, 440, 1.0 + 0.06 * prog(t, at(L(8, 1)), at(L(8, 2)))), html: '' };
}
function ring(x, y, t, t0, col = '#fff') {
  const p = prog(t, t0, t0 + 1.2);
  return p > 0 && p < 1 ? `<circle cx="${x}" cy="${y}" r="${f1(60 + 420 * E.out(p))}" fill="none" stroke="${col}" stroke-width="${f1(10 * (1 - p))}" opacity="${f1((1 - p) * 0.7 * 100) / 100}"/>` : '';
}
function scBradou(t) {
  let s = crossClose(t, { dark: true, light: 0.08 });
  const hy = 905 - 442 * 1.5;
  s += ring(960, hy, t, wordTime(L(8, 2), 'bradou')) + ring(960, hy, t, seg(L(8, 3))) + ring(960, hy, t, seg(L(8, 3)) + 0.8);
  return { svg: cam(s, 960, 420, 1.0 + 0.08 * prog(t, at(L(8, 2)), at(L(8, 5)))) + tag(4, t, seg(L(8, 2)) + 0.5), html: '' };
}
// Salmo 22: a primeira linha e as roupas sorteadas.
function scSalmo22(t) {
  const p = E.out(prog(t, at(L(8, 5)) + 0.1, at(L(8, 5)) + 0.6));
  const h1 = prog(t, seg(L(8, 6)), fim(L(8, 6)) + 0.4), h2 = prog(t, seg(L(8, 7)), fim(L(8, 7)) + 0.4);
  const row = (ref, txt, h) => `<div class="lrow vrow" style="padding:30px 44px"><div class="vtext" style="padding-left:0;font-size:46px">${hlWords(txt, h)}</div><div class="lref">${ref}</div></div>`;
  const html = `<div class="list" style="left:260px;right:260px;top:200px;opacity:${f1(p * 100) / 100};transform:translateY(${f1((1 - p) * 30)}px)">
    <div class="lhead"><div class="eyebrow">A Bíblia diz</div><div class="ltitle">Salmo 22</div></div>
    ${row('22:1', 'Meu Deus! Meu Deus! Por que me abandonaste?', h1)}${row('22:18', 'Dividiram as minhas roupas entre si, e tiraram sortes pelas minhas vestes.', h2)}</div>`;
  return { svg: `<rect width="${W}" height="${H}" fill="${C.paper}"/>`, html };
}
// "Ele está chamando Elias" (Mateus 27:47).
function scElias(t) {
  let s = bgDark(t) + hill(1250, 620, 1100, '#1B1E22', '#060708') + crossFig(1250, 640, 0.8, { plaque: true, fill: '#050505', rim: '#5A606A', bow: 0.2 });
  [[420, 1031, 165], [640, 1032, 20], [860, 1033, 30]].forEach(([x, seed, ar], i) => (s += person({ ...man(seed), x, y: 885, s: 1.25, look: 1, mood: i === 0 ? 'calm' : 'fear', t, armR: ar, rim: '#5A606A' })));
  return { svg: cam(s, 900, 540, 1.0 + 0.05 * prog(t, at(L(8, 8)), at(L(9, 0)))), html: '' };
}

// ================================================================ 9. QUINTA E SEXTA FRASES
// "Tenho sede"; a esponja com vinagre num caniço (João 19:28-29); "Está consumado!" (João 19:30).
function scSede(t) {
  const up = E.inOut(prog(t, wordTime(L(9, 2), 'caniço') - 0.6, fim(L(9, 2)))), down = E.inOut(prog(t, wordTime(L(9, 3), 'provou'), wordTime(L(9, 3), 'provou') + 0.8));
  const reach = up * (1 - down);
  let s = crossClose(t, { dark: true, light: 0.06 + 0.25 * E.out(prog(t, wordTime(L(9, 4), 'consumado') - 0.3, wordTime(L(9, 4), 'consumado') + 0.5)) });
  const hx = 960 + 40, hy = 905 - 442 * 1.5 + 40, bx = 1600, by = 1200;
  const tx = lerp(bx, hx + 30, reach), ty = lerp(by, hy + 10, reach);
  if (reach > 0) s += `<line x1="${f1(tx + 640)}" y1="${f1(ty + 800)}" x2="${f1(tx)}" y2="${f1(ty)}" stroke="#060708" stroke-width="16" stroke-linecap="round"/><line x1="${f1(tx + 640)}" y1="${f1(ty + 800)}" x2="${f1(tx)}" y2="${f1(ty)}" stroke="#5E5C4A" stroke-width="8" stroke-linecap="round"/><ellipse cx="${f1(tx)}" cy="${f1(ty)}" rx="26" ry="20" fill="#8C7A55" stroke="#060708" stroke-width="5"/>`;
  const tg = t < wordTime(L(9, 3), 'sexta') - 0.1 ? tag(5, t, seg(L(9, 0)) + 0.6) : tag(6, t, wordTime(L(9, 3), 'sexta') - 0.1);
  return { svg: cam(s, 960, 420, 1.0 + 0.06 * prog(t, at(L(9, 0)), at(L(9, 5)))) + tg, html: '' };
}
function scGrego(t) {
  const p = E.out(prog(t, at(L(9, 5)) + 0.1, at(L(9, 5)) + 0.6));
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  s += `<g opacity="${f1(p * 100) / 100}" transform="translate(0 ${f1((1 - p) * 20)})">`;
  s += `<text x="960" y="470" text-anchor="middle" font-family="Lora, 'DejaVu Serif', serif" font-weight="600" font-size="170" fill="${C.inkDeep}">τετέλεσται</text>`;
  s += label(960, 570, 'tetélestai', { fam: 'Lora', w: 500, size: 52, fill: C.muted }) + label(960, 680, 'grego, João 19:30', { fam: 'Geist Mono', w: 500, size: 32, fill: C.muted }) + '</g>';
  return { svg: s, html: '' };
}
function scObra(t) {
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>`;
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2 + t * 0.1; s += `<path d="M 960 240 L ${f1(960 + Math.cos(a - 0.08) * 2200)} ${f1(240 + Math.sin(a - 0.08) * 2200)} L ${f1(960 + Math.cos(a + 0.08) * 2200)} ${f1(240 + Math.sin(a + 0.08) * 2200)} Z" fill="#fff" opacity="0.5"/>`; }
  s += `<circle cx="960" cy="240" r="320" fill="url(#gWhite)"/>` + hill(960, 880, 1300, '#E9D2BE') + crossFig(960, 905, 1.5, { plaque: true, rim: C.a300, bow: 0.4 });
  return { svg: cam(s, 960, 905, 1.06 - 0.06 * E.sine(prog(t, at(L(9, 6)), at(L(10, 0))))), html: '' };
}

// ================================================================ 11. FECHAMENTO
const RESUMO = ['Perdão', 'Promessa', 'Cuidado', 'Abandono', 'Sede', 'Consumado', 'Entrega'];
function scResumo(t) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  for (let n = 1; n <= 7; n++) {
    const x = 960 + (n - 4) * 230, lit = pop(t, seg(L(11, n)) - 0.1, 0.45), p = pop(t, seg(L(11, 0)) + (n - 1) * 0.06, 0.4);
    s += lit > 0 ? dot(x, 400, n, 1 + 0.25 * Math.max(0, lit - 1) + 0.0) : `<g opacity="${f1(clamp(p) * 100) / 100}"><circle cx="${x}" cy="400" r="42" fill="#fff" stroke="${C.border}" stroke-width="6"/>${label(x, 416, n, { size: 46, w: 800, fill: C.g400 })}</g>`;
    if (lit > 0) s += `<g opacity="${f1(clamp(lit) * 100) / 100}">${label(x, 520, RESUMO[n - 1], { size: 38, w: 700, fill: C.inkDeep })}</g>`;
  }
  return { svg: cam(s, 960, 450, 1.0 + 0.04 * prog(t, at(L(11, 0)), at(L(11, 8)))), html: '' };
}
function scNaoMereceu(t) {
  return { svg: veuCena(t, 1, 0, 1.0 + 0.12 * prog(t, at(L(11, 8)), at(L(11, 9)))), html: '' };
}
function scMorreu(t) {
  const s = crossClose(t, { dark: true, light: 0.05, bow: 1 });
  return { svg: cam(s, 960, 420, 1.04 - 0.04 * prog(t, at(L(11, 9)), at(L(11, 10)))), html: '' };
}
function scAberto(t) {
  let s = templo(t, { open: 1, flood: 1, path: 1 });
  const w = E.inOut(prog(t, at(L(11, 10)), at(L(11, 11)) + 0.4));
  POVO.forEach(([x, seed, sc], i) => (s += person({ ...man(seed), x: lerp(520 + i * 150, 820 + i * 150, w), y: T_.fl + 50 - (i % 2) * 10, s: sc, look: 1, walk: w < 1 ? t * 7 + i : null, rim: C.a300 })));
  return { svg: cam(s, 960, 640, 1.0), html: '' };
}
function scVoce(t) {
  let s = veuCena(t, 1, 0, 1.0);
  const w = E.out(prog(t, at(L(11, 11)) + 0.2, wordTime(L(11, 11), 'você')));
  s += person({ x: lerp(600, 900, w), y: 1000, s: 1.1, sil: '#16110F', walk: w > 0 && w < 1 ? t * 6 : null, op: clamp(w * 4) });
  return { svg: s, html: '' };
}
const scFim = (t) => endCard(t, seg(L(11, 12)) - 0.3, ['Mateus 27', 'Lucas 23', 'João 19']);

// ================================================================ 10. A SÉTIMA FRASE E O VÉU
// "Pai, nas tuas mãos entrego o meu espírito." E expirou (Lucas 23:46).
function scSetima(t) {
  const tp = seg(L(10, 1)), te = wordTime(L(10, 2), 'expirou'), bow = E.inOut(prog(t, te - 0.3, te + 0.6));
  const light = 0.08 + 0.3 * E.out(prog(t, tp - 0.2, tp + 0.8)) * (1 - 0.8 * bow);
  let s = bgDark(t) + `<circle cx="960" cy="240" r="520" fill="url(#gWhite)" opacity="${f1(light * 100) / 100}"/>`;
  s += hill(960, 880, 1300, '#1B1E22', '#060708') + crossFig(960, 905, 1.5, { plaque: true, fill: '#050505', rim: '#5A606A', bow });
  return { svg: cam(s, 960, 400, 1.0 + 0.06 * prog(t, at(L(10, 0)), at(L(10, 3)))) + tag(7, t, seg(L(10, 0)) + 0.3), html: '' };
}
function scVeuRasga(t) {
  const t0 = wordTime(L(10, 3), 'rasgou') - 0.1, t1 = wordTime(L(10, 3), 'baixo') + 0.3;
  const p = E.inOut(prog(t, t0, t1)), quake = prog(t, t0, t0 + 0.2) * (1 - prog(t, t1, t1 + 0.6));
  return { svg: veuCena(t, p, quake, 1.0 + 0.04 * prog(t, at(L(10, 3)), at(L(10, 4)))), html: '' };
}

// "A terra tremeu, e as rochas se partiram" (Mateus 27:51).
function rock(x, y, s, split, id) {
  const d = 'M -150 0 C -170 -60 -120 -140 -40 -150 C 40 -170 130 -120 150 -50 C 165 -10 150 0 150 0 Z';
  const crack = 'M 6 -152 L -10 -110 L 14 -80 L -8 -40 L 10 0';
  const g = (side) => `<clipPath id="${id}${side}"><path d="${side < 0 ? 'M -200 -200 L 6 -152 L -10 -110 L 14 -80 L -8 -40 L 10 0 L -200 10 Z' : 'M 200 -200 L 6 -152 L -10 -110 L 14 -80 L -8 -40 L 10 0 L 200 10 Z'}"/></clipPath>
    <g transform="translate(${f1(side * 16 * split)} 0) rotate(${f1(side * 4 * split)} ${side * 150} 0)"><g clip-path="url(#${id}${side})"><path d="${d}" fill="#2A2D31" stroke="#060708" stroke-width="7"/></g></g>`;
  const line = split > 0 ? `<path d="${crack}" fill="none" stroke="#060708" stroke-width="7" stroke-linejoin="round" stroke-dasharray="260" stroke-dashoffset="${f1(260 * (1 - clamp(split * 3)))}"/>` : '';
  return `<g transform="translate(${x} ${y}) scale(${s})">${g(-1)}${g(1)}${split < 0.34 ? line : ''}</g>`;
}
function scRochas(t) {
  const tq = wordTime(L(10, 4), 'tremeu') - 0.2, tr = wordTime(L(10, 4), 'rochas');
  const quake = prog(t, tq, tq + 0.2) * (1 - prog(t, fim(L(10, 4)) + 0.2, fim(L(10, 4)) + 0.8));
  const split = E.out(prog(t, tr - 0.1, tr + 0.6));
  let s = bgDark(t) + golgotaWide(t, { dark: true, bow: 1 });
  s += rock(430, 860, 1.25, split, 'rA') + rock(1500, 870, 1.05, E.out(prog(t, tr + 0.15, tr + 0.75)), 'rB');
  const sh = Math.sin(t * 43) * 12 * quake, sv = Math.cos(t * 37) * 8 * quake;
  return { svg: cam(s, 960, 540, 1.04, sh, sv), html: '' };
}

// "Guarda esse detalhe do véu": o véu inteiro, parado.
function scVeuCalmo(t) {
  return { svg: veuCena(t, 0, 0, 1.12 - 0.08 * E.sine(prog(t, at(L(10, 5)), at(L(10, 6))))), html: '' };
}

// O templo em corte: Lugar Santo, o véu e o Santo dos Santos (Hebreus 9:2-3, 7).
// Só o sumo sacerdote passava do véu, uma vez por ano, com o sangue (o vaso fechado, sem sangue na tela).
// Depois o véu se abre de alto a baixo, a luz sai pela porta e vira o caminho (Hebreus 10:19-20).
const T_ = { x0: 330, x1: 1640, top: 300, fl: 820, vx: 1160, vw: 34 };
function menorah(x, y, s) {
  let g = `<line x1="0" y1="0" x2="0" y2="-120" stroke="${C.a600}" stroke-width="9" stroke-linecap="round"/><rect x="-34" y="-6" width="68" height="14" rx="7" fill="${C.a400}" ${ink(4)}/>`;
  for (let k = 1; k <= 3; k++) g += `<path d="M ${-k * 22} -120 L ${-k * 22} ${-120 + 28 + k * 12} Q ${-k * 22} ${-56 + k * 6} 0 ${-56 + k * 6} Q ${k * 22} ${-56 + k * 6} ${k * 22} ${-120 + 28 + k * 12} L ${k * 22} -120" fill="none" stroke="${C.a600}" stroke-width="7" stroke-linecap="round"/>`;
  for (let k = -3; k <= 3; k++) g += `<path d="M ${k * 22} -126 q -7 -14 0 -26 q 7 12 0 26 Z" fill="${C.a300}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>`;
}
function templo(t, o) {
  const { open = 0, flood = 0, path = 0 } = o;
  let s = bgGloom(t, { seed: 811 });
  s += rect(-600, T_.fl, W + 1200, H - T_.fl + 40, C.g300) + `<line x1="-600" y1="${T_.fl}" x2="${W + 600}" y2="${T_.fl}" stroke="${C.ink}" stroke-width="6"/>`;
  // paredes e telhado
  s += rect(T_.x0 - 30, T_.top - 40, T_.x1 - T_.x0 + 60, 40, C.g400, ink(7)) + rect(T_.x0, T_.top, T_.x1 - T_.x0, T_.fl - T_.top, C.g200, ink(7));
  // Lugar Santo
  s += rect(T_.x0 + 30, T_.top + 30, T_.vx - T_.x0 - 30, T_.fl - T_.top - 30, '#EFE6DA', ink(5));
  s += menorah(560, T_.fl, 1.15) + rect(820, T_.fl - 70, 180, 22, C.wood, `rx="6" ${ink(5)}`) + rect(840, T_.fl - 48, 14, 48, C.wood, ink(4)) + rect(966, T_.fl - 48, 14, 48, C.wood, ink(4));
  for (let k = 0; k < 6; k++) s += `<ellipse cx="${850 + (k % 3) * 52}" cy="${T_.fl - 80 - Math.floor(k / 3) * 14}" rx="24" ry="9" fill="${C.p300}" ${ink(3)}/>`;
  // Santo dos Santos: escuro, com a luz que cresce quando o véu se abre
  const ix0 = T_.vx + T_.vw, ix1 = T_.x1 - 30;
  s += rect(ix0, T_.top + 30, ix1 - ix0, T_.fl - T_.top - 30, '#2A2622', ink(5));
  s += `<circle cx="${(ix0 + ix1) / 2}" cy="${(T_.top + T_.fl) / 2}" r="${f1(220 + 260 * flood)}" fill="url(#gAmber)" opacity="${f1((0.35 + 0.6 * flood) * 100) / 100}"/>`;
  // a luz sai pelo véu aberto, atravessa o Lugar Santo e sai pela porta
  if (flood > 0) {
    s += `<path d="M ${T_.vx + 10} ${T_.top + 40} L ${T_.vx + 10} ${T_.fl} L ${T_.x0 - 20 - 600 * flood} ${T_.fl + 40} L ${T_.x0 - 20 - 600 * flood} ${T_.fl - 260} Z" fill="#FFF3D6" opacity="${f1(0.55 * flood * 100) / 100}"/>`;
  }
  // o caminho de luz no chão (Hebreus 10:20)
  if (path > 0) s += `<rect x="${f1(lerp(T_.vx, -40, path))}" y="${T_.fl - 8}" width="${f1(T_.vx - lerp(T_.vx, -40, path))}" height="16" rx="8" fill="${C.a300}" ${ink(4)}/>`;
  // o véu de lado: abre de cima para baixo
  const vy = lerp(T_.top + 30, T_.fl, open);
  if (open < 1) s += rect(T_.vx, vy, T_.vw, T_.fl - vy, C.b500, ink(5));
  if (open > 0 && open < 1) s += `<path d="M ${T_.vx - 6} ${f1(vy)} l 12 -18 l 12 14 l 12 -16" fill="none" stroke="${C.ink}" stroke-width="4"/>`;
  // porta à esquerda
  s += rect(T_.x0 - 8, T_.fl - 250, 46, 250, '#3A3330', ink(5));
  // rótulos
  const lab = (x, txt, col) => `<text x="${x}" y="${T_.top + 92}" text-anchor="middle" font-family="Geist" font-weight="700" font-size="38" fill="${col}">${txt}</text>`;
  s += lab((T_.x0 + T_.vx) / 2 + 15, 'Lugar Santo', C.g700) + lab((ix0 + ix1) / 2, 'Santo dos Santos', '#F4EBDD');
  return s;
}
function sacerdote(x, walk, op) {
  const o = { robe: C.b500, skin: '#B97A4A', hair: '#2F2622', beard: true, cover: '#FFFFFF', x, y: T_.fl, s: 0.95, look: 1, walk, armL: 14, armR: 40, op };
  // o vaso nas mãos (sem mostrar o conteúdo)
  const hx = x + (34 + 86 * Math.sin((40 * Math.PI) / 180)) * 0.95, hy = T_.fl + (-154 + 86 * Math.cos((40 * Math.PI) / 180)) * 0.95;
  return person(o) + `<g opacity="${f1(op * 100) / 100}"><path d="M ${f1(hx - 26)} ${f1(hy - 16)} L ${f1(hx + 26)} ${f1(hy - 16)} Q ${f1(hx + 22)} ${f1(hy + 14)} ${f1(hx)} ${f1(hy + 14)} Q ${f1(hx - 22)} ${f1(hy + 14)} ${f1(hx - 26)} ${f1(hy - 16)} Z" fill="${C.a400}" ${ink(4)}/></g>`;
}
const POVO = [[80, 1001, 0.78], [175, 1002, 0.82], [250, 1003, 0.74]];
function scSantos(t) {
  const tw0 = seg(L(10, 7)), tw1 = wordTime(L(10, 7), 'ano');
  const tOpen0 = wordTime(L(10, 9), 'rasgou') - 0.1, tOpen1 = fim(L(10, 9)) + 0.2;
  const open = E.inOut(prog(t, tOpen0, tOpen1)), flood = E.out(prog(t, tOpen0 + 0.4, tOpen1 + 0.8));
  const path = E.inOut(prog(t, seg(L(10, 11)), seg(L(10, 11)) + 1.6));
  let s = templo(t, { open, flood, path });
  // o sumo sacerdote atravessa o Lugar Santo e passa pelo véu
  const w = E.inOut(prog(t, tw0, tw1)), pop1 = prog(t, tw0 - 0.3, tw0), gone = prog(t, tw1 - 0.2, tw1 + 0.2);
  const px = lerp(T_.x0 + 90, T_.vx - 40, w);
  if (pop1 > 0 && gone < 1) s += sacerdote(px, w > 0 && w < 1 ? t * 7 : null, pop1 * (1 - gone));
  if (gone > 0 && t < tOpen0) s += `<g opacity="${f1(gone * 0.9 * 100) / 100}">${person({ robe: C.b500, skin: '#B97A4A', hair: '#2F2622', beard: true, cover: '#FFFFFF', x: 1400, y: T_.fl, s: 0.95, sil: '#1A1714', noShadow: true })}</g>`;
  // o povo do lado de fora; quando o caminho se abre, eles entram
  const walkIn = E.inOut(prog(t, seg(L(10, 11)) + 0.6, fim(L(10, 11)) + 1.0));
  POVO.forEach(([x, seed, sc], i) => {
    const lit = flood > 0.3 ? C.a300 : null, xx = lerp(x, 520 + i * 150, walkIn);
    s += person({ ...man(seed), x: xx, y: T_.fl + 50 - (i % 2) * 10, s: sc, look: 1, mood: flood > 0.3 ? 'calm' : 'calm', walk: walkIn > 0 && walkIn < 1 ? t * 7 + i : null, rim: lit });
  });
  // câmera: geral; segue o sacerdote; vai até o povo na porta; abre de novo
  const camX = lerp(lerp(lerp(960, px, prog(t, tw0 - 0.3, tw0 + 0.3) * (1 - prog(t, tw1, tw1 + 0.5))), 360, E.inOut(prog(t, seg(L(10, 8)), seg(L(10, 8)) + 0.8)) * (1 - E.inOut(prog(t, seg(L(10, 9)), seg(L(10, 9)) + 0.8)))), 960, 0);
  const zoom = 1 + 0.3 * E.inOut(prog(t, tw0 - 0.3, tw0 + 0.3)) * (1 - E.inOut(prog(t, tw1, tw1 + 0.6))) + 0.35 * E.inOut(prog(t, seg(L(10, 8)), seg(L(10, 8)) + 0.8)) * (1 - E.inOut(prog(t, seg(L(10, 9)), seg(L(10, 9)) + 0.8)));
  return { svg: cam(s, camX, 640, zoom, 960 - camX, 0), html: '' };
}

// O centurião em frente à cruz: "Realmente este homem era o Filho de Deus!" (Marcos 15:39).
function centuriaoW(t, light) {
  let s = bgNight(t, { sky: 'skyDawn', moon: false, starOp: 0 });
  s += `<circle cx="1330" cy="300" r="560" fill="url(#gAmber)" opacity="${f1(light * 0.6 * 100) / 100}"/>`;
  s += hill(1330, 640, 900, '#1B1E22', '#060708') + crossFig(1330, 660, 0.9, { plaque: true, fill: '#050505', rim: '#5A606A', bow: 1 });
  s += person({ ...soldado(821), robe: '#8E3B46', x: 640, y: FLOOR_Y, s: 1.55, look: 1, mood: 'fear', t, armL: 18, armR: 24, gear: { helmet: 'cent', armor: true, spear: 'l' }, rim: light > 0.05 ? C.a300 : null });
  return s;
}
function scCenturiao(t) {
  return { svg: cam(centuriaoW(t, 0), 960, 540, 1.0 + 0.04 * prog(t, at(L(10, 12)), at(L(10, 14)))), html: '' };
}
function scFilho(t) {
  const l = E.out(prog(t, wordTime(L(10, 14), 'filho') - 0.3, wordTime(L(10, 14), 'filho') + 0.5));
  return { svg: cam(centuriaoW(t, l), 700, 520, 1.6 + 0.06 * prog(t, at(L(10, 14)), fim(L(10, 14)) + 1)), html: '' };
}

// ================================================================ linha do tempo
const SCENES = [
  { a: 0, b: at(L(1, 2)), f: scTrevas, ref: 'Lucas 23:44-45', dark: (t) => t > (darkSpan()[0] + darkSpan()[1]) / 2 },
  { a: at(L(1, 2)), b: at(L(1, 4)), f: scVeuAbertura, ref: 'Mateus 27:51', dark: true },
  { a: at(L(1, 4)), b: at(L(1, 12)), f: scSete, ref: null },
  { a: at(L(1, 12)), b: at(L(2, 0)), f: scVeuLuz, ref: null, dark: true },
  // 2. a morte mais humilhante
  { a: at(L(2, 0)), b: at(L(2, 3)), f: scCruz, ref: null },
  { a: at(L(2, 3)), b: at(L(2, 5)), f: scQuem, ref: null },
  { a: at(L(2, 5)), b: at(L(2, 6)), f: scCicero, ref: 'Cícero, Contra Verres II.5.165' },
  { a: at(L(2, 6)), b: at(L(3, 0)), f: scVergonha, ref: null },
  // 3. até a cruz
  { a: at(L(3, 0)), b: at(L(3, 4)), f: scGetsemani, ref: [[at(L(3, 1)), 'Lucas 22:44'], [at(L(3, 2)), 'Mateus 26:39']], dark: true },
  { a: at(L(3, 4)), b: at(L(3, 11)), f: scPrisao, ref: [[at(L(3, 5)), 'Mateus 26:47-49'], [at(L(3, 8)), 'João 18:10'], [at(L(3, 9)), 'Lucas 22:51']], dark: true },
  { a: at(L(3, 11)), b: at(L(3, 15)), f: scPilatos, ref: [[at(L(3, 11)), 'Lucas 23:4, 14, 22'], [at(L(3, 13)), 'Mateus 27:20-21']] },
  { a: at(L(3, 15)), b: at(L(3, 16)), f: scLavaMaos, ref: 'Mateus 27:24' },
  { a: at(L(3, 16)), b: at(L(3, 17)), f: scEntregue, ref: 'Mateus 27:26' },
  { a: at(L(3, 17)), b: at(L(3, 18)), f: scCoroaW, ref: 'Mateus 27:28-29' },
  { a: at(L(3, 18)), b: at(L(3, 20)), f: scSalveW, ref: null },
  { a: at(L(3, 20)), b: at(L(3, 21)), f: scTitulo, ref: 'João 19:19' },
  { a: at(L(3, 21)), b: at(L(3, 24)), f: scCaminho, ref: [[at(L(3, 21)), 'João 19:17'], [at(L(3, 22)), 'Lucas 23:26']] },
  { a: at(L(3, 24)), b: at(L(3, 26)), f: scFilhos, ref: null },
  { a: at(L(3, 26)), b: at(L(4, 0)), f: scFilhas, ref: 'Lucas 23:27-28' },
  // 4. primeira frase
  { a: at(L(4, 0)), b: at(L(4, 2)), f: scNove, ref: 'Marcos 15:25, 27' },
  { a: at(L(4, 2)), b: at(L(4, 4)), f: scPlaca, ref: 'João 19:19-20' },
  { a: at(L(4, 4)), b: at(L(4, 5)), f: scEscrevi, ref: 'João 19:21-22' },
  { a: at(L(4, 5)), b: at(L(4, 7)), f: scPerdoa, ref: [[at(L(4, 6)), 'Lucas 23:34']] },
  { a: at(L(4, 7)), b: at(L(4, 8)), f: scSortes, ref: null },
  { a: at(L(4, 8)), b: at(L(5, 0)), f: scSalmo18, ref: 'João 19:24' },
  // 5. segunda frase
  { a: at(L(5, 0)), b: at(L(5, 1)), f: scZombariaW, ref: 'Mateus 27:39-40' },
  { a: at(L(5, 1)), b: at(L(5, 2)), f: scLideresW, ref: 'Mateus 27:41-42' },
  { a: at(L(5, 2)), b: at(L(5, 5)), f: scLadroes, ref: [[at(L(5, 2)), 'Mateus 27:44; Marcos 15:32'], [at(L(5, 3)), 'Lucas 23:39-41']] },
  { a: at(L(5, 5)), b: at(L(5, 8)), f: scParaiso, ref: 'Lucas 23:42-43' },
  { a: at(L(5, 8)), b: at(L(6, 0)), f: scHoje, ref: null },
  // 6. pausa
  { a: at(L(6, 0)), b: at(L(7, 0)), f: scPausa, ref: null },
  // 7. terceira frase
  { a: at(L(7, 0)), b: at(L(8, 0)), f: scMaria, ref: [[at(L(7, 0)), 'João 19:25'], [at(L(7, 4)), 'João 19:26-27']] },
  // 8. quarta frase
  { a: at(L(8, 0)), b: at(L(8, 1)), f: scTrevas8, ref: 'Mateus 27:45', dark: (t) => t > (wordTime(L(8, 0), 'trevas') + fim(L(8, 0))) / 2 },
  { a: at(L(8, 1)), b: at(L(8, 2)), f: scSol, ref: 'Lucas 23:45', dark: true },
  { a: at(L(8, 2)), b: at(L(8, 5)), f: scBradou, ref: 'Mateus 27:46', dark: true },
  { a: at(L(8, 5)), b: at(L(8, 8)), f: scSalmo22, ref: null },
  { a: at(L(8, 8)), b: at(L(9, 0)), f: scElias, ref: 'Mateus 27:47', dark: true },
  // 9. quinta e sexta frases
  { a: at(L(9, 0)), b: at(L(9, 5)), f: scSede, ref: [[at(L(9, 0)), 'João 19:28-29'], [at(L(9, 3)), 'João 19:30']], dark: true },
  { a: at(L(9, 5)), b: at(L(9, 6)), f: scGrego, ref: null },
  { a: at(L(9, 6)), b: at(L(10, 0)), f: scObra, ref: [[at(L(9, 7)), 'João 17:4']] },
  { a: at(L(10, 0)), b: at(L(10, 3)), f: scSetima, ref: 'Lucas 23:46', dark: true },
  { a: at(L(10, 3)), b: at(L(10, 4)), f: scVeuRasga, ref: 'Mateus 27:51', dark: true },
  { a: at(L(10, 4)), b: at(L(10, 5)), f: scRochas, ref: null, dark: true },
  { a: at(L(10, 5)), b: at(L(10, 6)), f: scVeuCalmo, ref: null, dark: true },
  { a: at(L(10, 6)), b: at(L(10, 12)), f: scSantos, ref: [[at(L(10, 6)), 'Hebreus 9:3, 7'], [at(L(10, 10)), 'Hebreus 10:19-20']] },
  { a: at(L(10, 12)), b: at(L(10, 14)), f: scCenturiao, ref: 'Marcos 15:39', dark: true },
  { a: at(L(10, 14)), b: at(L(11, 0)), f: scFilho, ref: null, dark: true },
  // 11. fechamento
  { a: at(L(11, 0)), b: at(L(11, 8)), f: scResumo, ref: null },
  { a: at(L(11, 8)), b: at(L(11, 9)), f: scNaoMereceu, ref: null, dark: true },
  { a: at(L(11, 9)), b: at(L(11, 10)), f: scMorreu, ref: null, dark: true },
  { a: at(L(11, 10)), b: at(L(11, 11)), f: scAberto, ref: 'Hebreus 10:19-20' },
  { a: at(L(11, 11)), b: seg(L(11, 12)) - 0.3, f: scVoce, ref: null, dark: true },
  { a: seg(L(11, 12)) - 0.3, b: DURATION + 1, f: scFim, ref: null, end: true },
];
