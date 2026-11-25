// Os reis magos eram reis? (Mateus 2:1-16; Lucas 2:16). Curto vertical escrito do zero, ~66 s com o cartão final.
// As cenas começam pelo índice da frase em SEGS (at(i)) e os gestos por wordTime(i, 'palavra').
// Notas de produção: a coroa só aparece na cena do presépio (a tradição, no gancho e no fecho); no que Mateus conta,
// os magos não têm coroa e quem usa coroa é Herodes. Nada na tela diz que "não eram três" nem que "não eram reis":
// a tela mostra o que o texto diz e um "?" onde ele não diz. A matança de Belém (2:16) aparece só como a ordem de
// Herodes, sem violência.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];
const wt = (i, w, d = 0) => wordTime(i, w) + d;
const PE = 1250; // pés de quem está em primeiro plano (a legenda começa em ~1286)
const NOL = '#0E0D0C';

// ---------------------------------------------------------------- personagens (os mesmos do longo do nascimento)
const MARIA = { robe: '#E9E1D8', skin: '#C68B59', hair: '#3A2A20', beard: false, cover: '#4F7FAF' };
const JOSE = { robe: '#8A6A4D', skin: '#B97A4A', hair: '#2F2622', beard: true, cover: '#C9BBAE' };
const HERODES = { robe: '#7A2E3A', skin: '#E0AC69', hair: '#2A1E18', beard: true, gear: { crown: true } };
const MAGOS = [
  { robe: '#2E6B5E', skin: '#8D5524', hair: '#191919', beard: true, cover: '#E4B750' },
  { robe: '#6B3A7A', skin: '#E0AC69', hair: '#5A3A28', beard: true, cover: '#F3EFE8' },
  { robe: '#A2653F', skin: '#A86B3C', hair: '#292726', beard: false, cover: '#2E6B5E' },
];
// Os "reis" do presépio: os mesmos três, com coroa (a tradição).
const REIS = MAGOS.map((m) => ({ ...m, cover: null, gear: { crown: true } }));
const pastor = (seed, extra = {}) => ({ ...man(seed), robe: ['#8A7A62', '#6E5A44', '#9C8B70', '#7A6A55'][seed % 4], cover: ['#C9BBAE', '#E2D8CF', '#A99A86', '#D8CBB8'][seed % 4], ...extra });
const soldado = (seed, extra = {}) => ({ ...man(seed), cover: null, beard: false, robe: C.p600, gear: { helmet: 'rom', armor: true, spear: 'r' }, ...extra });

const label = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${o.fam || 'Gasoek One'}" font-weight="${o.w || 400}" font-size="${o.size || 90}" fill="${o.fill || C.inkDeep}" opacity="${f1((o.op ?? 1) * 100) / 100}">${esc(txt)}</text>`;
const pilula = (x, y, txt, p, o = {}) => (p <= 0 ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(p * 100) / 100})">${rect(-(o.w || 300), -46, 2 * (o.w || 300), 92, o.bg || C.b500, `rx="46" ${o.borda ? ink(5) : ''}`)}${label(0, 16, txt, { fam: 'Geist', w: 800, size: o.size || 44, fill: o.fill || '#FFFFFF' })}</g>`);
// Selo redondo com número ou "?": o que o texto diz e o que ele não diz.
const selo = (x, y, txt, p, cor = C.b500, r = 70) => (p <= 0 ? '' : `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(p * 100) / 100})"><circle r="${r}" fill="${cor}" ${ink(6)}/>${label(0, r * 0.38, txt, { size: r * 1.15, fill: '#FFFFFF' })}</g>`);

// ---------------------------------------------------------------- peças
function estrela(x, y, s, t, o = {}) {
  const tw = 1 + 0.08 * Math.sin(t * 6.3) + 0.05 * Math.sin(t * 11.1), r = 46 * s * tw, r2 = 18 * s * tw;
  let g = `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(260 * s)}" fill="url(#gWhite)" opacity="${f1((o.glow ?? 0.85) * 100) / 100}"/>`;
  g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(120 * s)}" fill="url(#gAmber)" opacity="0.7"/>`;
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2, rr = i % 4 === 0 ? r * 1.9 : i % 2 === 0 ? r * 1.05 : r2;
    pts.push(`${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`);
  }
  g += `<path d="M ${pts.join(' L ')} Z" fill="#FFF7DA" stroke="${o.ol || C.ink}" stroke-width="${f1(4 * s)}" stroke-linejoin="round"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(12 * s)}" fill="#FFFFFF"/>`;
  return g;
}
function bebe(x, y, s = 1, o = {}) {
  const ol = o.ol || C.ink;
  let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><ellipse cx="-8" cy="4" rx="58" ry="26" fill="#F6F1E8" stroke="${ol}" stroke-width="5"/>`;
  for (let i = 0; i < 3; i++) g += `<path d="M ${-46 + i * 26} -18 Q ${-38 + i * 26} 4 ${-46 + i * 26} 26" fill="none" stroke="${C.g400}" stroke-width="4"/>`;
  g += `<circle cx="52" cy="-2" r="22" fill="#D6A27A" stroke="${ol}" stroke-width="5"/><path d="M 32 -16 Q 52 -36 72 -12" fill="#F6F1E8" stroke="${ol}" stroke-width="4"/>`;
  return g + '</g>';
}
// O menino no colo (Mateus diz "o menino", não o bebê na manjedoura).
const menino = (x, y, s = 1) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-12)">${bebe(0, 0, s)}</g>`;
function manjedoura(x, base, s = 1, o = {}) {
  const ol = o.ol || C.ink, wood = '#8A6440', woodDk = '#6B4A33';
  let g = `<g transform="translate(${f1(x)} ${f1(base)}) scale(${s})"><ellipse cx="0" cy="4" rx="190" ry="16" fill="#000" opacity="0.15"/>`;
  [[-130, -1], [130, 1]].forEach(([lx, d]) => {
    g += `<line x1="${lx - 40 * d}" y1="0" x2="${lx + 30 * d}" y2="-120" stroke="${ol}" stroke-width="26" stroke-linecap="round"/><line x1="${lx - 40 * d}" y1="0" x2="${lx + 30 * d}" y2="-120" stroke="${woodDk}" stroke-width="15" stroke-linecap="round"/>`;
    g += `<line x1="${lx + 40 * d}" y1="0" x2="${lx - 30 * d}" y2="-120" stroke="${ol}" stroke-width="26" stroke-linecap="round"/><line x1="${lx + 40 * d}" y1="0" x2="${lx - 30 * d}" y2="-120" stroke="${wood}" stroke-width="15" stroke-linecap="round"/>`;
  });
  g += `<path d="M -190 -190 L 190 -190 L 150 -100 L -150 -100 Z" fill="${wood}" stroke="${ol}" stroke-width="6" stroke-linejoin="round"/>`;
  g += `<line x1="-176" y1="-160" x2="176" y2="-160" stroke="${woodDk}" stroke-width="5"/><line x1="-162" y1="-130" x2="162" y2="-130" stroke="${woodDk}" stroke-width="5"/>`;
  const r = rng(77);
  for (let i = 0; i < 22; i++) { const px = -170 + i * 16 + r() * 8, a = -0.6 + r() * 1.2; g += `<line x1="${f1(px)}" y1="-188" x2="${f1(px + 30 * Math.sin(a))}" y2="${f1(-188 - 26 * Math.cos(a))}" stroke="#D9B45A" stroke-width="5" stroke-linecap="round"/>`; }
  g += `<path d="M -186 -190 Q 0 -214 186 -190 Z" fill="#E7C66E" stroke="${ol}" stroke-width="5" stroke-linejoin="round"/>`;
  if (o.bebe) g += bebe(0, -210, 1.05, { ol });
  return g + '</g>';
}
// A casa, de fora; o.luz acende a porta e as janelas.
function casa(x, base, s, o = {}) {
  const luz = o.luz || 0, ol = NOL;
  let g = luz > 0 ? `<circle cx="${f1(x)}" cy="${f1(base - 160 * s)}" r="${f1(520 * s)}" fill="url(#gAmber)" opacity="${f1(luz * 0.55 * 100) / 100}"/>` : '';
  g += rect(x - 260 * s, base - 300 * s, 520 * s, 300 * s, '#4A3E36', ink(6, ol)) + rect(x + 120 * s, base - 297 * s, 137 * s, 294 * s, '#3A302A');
  g += rect(x - 280 * s, base - 320 * s, 560 * s, 30 * s, '#3A302A', `rx="${f1(8 * s)}" ${ink(5, ol)}`);
  const porta = (fill) => `<path d="M ${f1(x - 60 * s)} ${f1(base)} L ${f1(x - 60 * s)} ${f1(base - 150 * s)} C ${f1(x - 60 * s)} ${f1(base - 200 * s)} ${f1(x + 60 * s)} ${f1(base - 200 * s)} ${f1(x + 60 * s)} ${f1(base - 150 * s)} L ${f1(x + 60 * s)} ${f1(base)} Z" fill="${fill}" ${ink(5, ol)}/>`;
  const janelas = (fill) => [-200, 150].map((dx) => rect(x + dx * s, base - 240 * s, 60 * s, 70 * s, fill, `rx="${f1(8 * s)}" ${ink(4, ol)}`)).join('');
  g += porta('#1A1512') + janelas('#1A1512');
  if (luz > 0) g += opg(luz, porta('#FFE3A3') + janelas(C.a300));
  return g;
}
function bau(x, y, s) {
  let g = `<circle cx="${f1(x)}" cy="${f1(y - 50 * s)}" r="${f1(120 * s)}" fill="url(#gAmber)" opacity="0.55"/>`;
  g += rect(x - 60 * s, y - 70 * s, 120 * s, 70 * s, '#8A5A2E', `rx="${f1(8 * s)}" ${ink(5)}`);
  g += `<path d="M ${f1(x - 64 * s)} ${f1(y - 66 * s)} Q ${f1(x)} ${f1(y - 120 * s)} ${f1(x + 64 * s)} ${f1(y - 66 * s)} Z" fill="${C.a400}" ${ink(5)}/>` + rect(x - 10 * s, y - 52 * s, 20 * s, 24 * s, C.a300, `rx="${f1(4 * s)}" ${ink(3)}`);
  return g;
}
function pote(x, y, s, cor, fumaca = 0, t = 0) {
  let g = `<path d="M ${f1(x - 34 * s)} ${f1(y)} C ${f1(x - 50 * s)} ${f1(y - 60 * s)} ${f1(x - 30 * s)} ${f1(y - 86 * s)} ${f1(x - 18 * s)} ${f1(y - 92 * s)} L ${f1(x + 18 * s)} ${f1(y - 92 * s)} C ${f1(x + 30 * s)} ${f1(y - 86 * s)} ${f1(x + 50 * s)} ${f1(y - 60 * s)} ${f1(x + 34 * s)} ${f1(y)} Z" fill="${cor}" ${ink(5)}/>`;
  g += rect(x - 22 * s, y - 106 * s, 44 * s, 16 * s, C.a300, `rx="${f1(6 * s)}" ${ink(4)}`);
  if (fumaca > 0) for (let i = 0; i < 3; i++) { const p = (t * 0.4 + i / 3) % 1; g += `<circle cx="${f1(x + Math.sin(p * 7 + i) * 16 * s)}" cy="${f1(y - 120 * s - p * 140 * s)}" r="${f1((10 + p * 16) * s)}" fill="#EDE8E1" opacity="${f1(fumaca * (1 - p) * 0.8 * 100) / 100}"/>`; }
  return g;
}
// Os três presentes de Mateus 2:11, lado a lado; p = [ouro, incenso, mirra] de 0 a 1.
const presentes = (x, y, s, p, t) => opg(p[0], bau(x - 190 * s, y, 1.1 * s)) + opg(p[1], pote(x, y, 1.0 * s, '#CDBBA6', 1, t)) + opg(p[2], pote(x + 190 * s, y, 0.95 * s, '#8A5A6E', 0, t));
const lamparina = (x, y, t) => flame(x, y - 8, 13, 44 + 4 * Math.sin(t * 9), C.a300) + `<ellipse cx="${x}" cy="${y}" rx="34" ry="12" fill="#8A5A2E" ${ink(4, NOL)}/>` + `<circle cx="${x}" cy="${y - 30}" r="160" fill="url(#gAmber)" opacity="0.5"/>`;
// O presépio da tradição: a manjedoura com o bebê, Maria, José e três reis de coroa. o.cinza apaga as cores.
function presepio(t, o = {}) {
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="#1B1714"/>` + stars(t, 50, 5, 900, 0.8);
  s += `<circle cx="540" cy="900" r="${f1(620 + 30 * Math.sin(t * 2))}" fill="url(#gAmber)" opacity="0.55"/>`;
  s += estrela(540, 330, 0.75, t, { ol: NOL, glow: 0.6 });
  s += rect(-600, PE - 10, W + 1200, H, '#2C241F') + `<line x1="-600" y1="${PE - 10}" x2="${W + 600}" y2="${PE - 10}" stroke="${NOL}" stroke-width="6"/>`;
  s += manjedoura(540, PE - 20, 0.85, { bebe: true, ol: NOL });
  s += person({ ...MARIA, x: 300, y: PE, s: 1.05, look: 1, mood: 'happy', kneel: true, ol: NOL, rim: C.a300 });
  s += person({ ...JOSE, x: 800, y: PE, s: 1.1, look: -1, mood: 'happy', ol: NOL, rim: C.a300 });
  REIS.forEach((m, i) => (s += person({ ...m, x: [115, 880, 985][i], y: PE + 8, s: [1.0, 0.95, 0.92][i], look: i ? -1 : 1, mood: 'happy', kneel: i === 0, ol: NOL, rim: C.a300, armR: i === 1 ? 60 : 18 })));
  return s;
}
// Jerusalém (vista de fora), de dia; Belém à noite.
function jerusalem(t) {
  let s = bgDay(t, { seed: 61 });
  s += city(540, GROUND + 30, 0.95, t);
  s += rect(-600, GROUND + 30, W + 1200, H, '#E6DCCF') + `<line x1="-600" y1="${GROUND + 30}" x2="${W + 600}" y2="${GROUND + 30}" stroke="${C.ink}" stroke-width="5"/>`;
  return s;
}
function trono(t, o = {}) {
  const ec = !!o.escuro, ol = ec ? NOL : C.ink;
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="${ec ? '#1D1714' : '#E9DFD2'}"/>`;
  [120, 960].forEach((x) => (s += rect(x - 52, 160, 104, 1000, ec ? '#3B2F28' : C.g100, ink(6, ol)) + rect(x - 70, 140, 140, 40, ec ? '#2E2621' : C.g300, `rx="8" ${ink(6, ol)}`)));
  s += rect(-600, 1160, W + 1200, 800, ec ? '#2A221E' : C.g300) + `<line x1="-600" y1="1160" x2="${W + 600}" y2="1160" stroke="${ol}" stroke-width="6"/>`;
  s += throne(o.x || 420, 1160, 0.95, '#B08A3A');
  return s;
}
function interiorCasa(t, l = 0.45) {
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="#E9DFD2"/>` + rect(-600, PE - 10, W + 1200, 900, '#D7C9B8') + `<line x1="-600" y1="${PE - 10}" x2="${W + 600}" y2="${PE - 10}" stroke="${C.ink}" stroke-width="6"/>`;
  s += rect(760, 330, 170, 190, '#1A2230', `rx="14" ${ink(6)}`) + estrela(845, 410, 0.32, t, { glow: 0.4 });
  s += `<circle cx="360" cy="900" r="560" fill="url(#gAmber)" opacity="${f1(l * 100) / 100}"/>`;
  return s;
}
// Cartão de item: número, a pergunta e um desenho (a cena inteira é o cartão, como no lenço dobrado).
function cartao(t, a0, n, titulo, desenho) {
  const p = pop(t, a0 + 0.1, 0.4), p2 = pop(t, a0 + 0.4, 0.4);
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="${C.paper}"/>`;
  s += `<g transform="translate(540 600) scale(${f1(p * 100) / 100})"><circle r="92" fill="${C.b500}" ${ink(7)}/>${label(0, 34, String(n), { size: 100, fill: '#FFFFFF' })}</g>`;
  s += opg(clamp(p2), label(540, 830, titulo, { size: 116 }));
  s += `<g transform="translate(540 1070) scale(${f1(clamp(p2) * 100) / 100})">${desenho}</g>`;
  return s;
}

// ---------------------------------------------------------------- 0. três reis diante da manjedoura; Mateus não conta nenhuma dessas três coisas
function scGancho(t) {
  const tn = wt(0, 'nenhuma', -0.1);
  // as três coisas, marcadas com "?" uma depois da outra: os três, as coroas, a manjedoura
  const q = [0, 1, 2].map((k) => pop(t, tn + k * 0.32, 0.35));
  let s = presepio(t);
  s += selo(150, 760, '?', q[0], C.r600, 66) + selo(985, 690, '?', q[1], C.r600, 66) + selo(540, 920, '?', q[2], C.r600, 66);
  const z = 1.0 + 0.06 * E.sine(prog(t, 0, at(1)));
  return { svg: cam(s, 540, 960, z), html: '' };
}
// ---------------------------------------------------------------- 1. ele conta outra cena, com uma pista
function scOutraCena(t) {
  const a0 = at(1), tp = wt(1, 'pista', -0.2);
  const sx = lerp(180, 700, E.inOut(prog(t, a0, tp))), sy = 420 - 60 * Math.sin(prog(t, a0, tp) * Math.PI);
  let s = bgNight(t, { moon: false });
  s += casa(700, GROUND + 70, 0.75, { luz: 0.4 + 0.4 * prog(t, tp, tp + 0.8) });
  s += raioEstrelaV(sx, sy + 40, GROUND, E.out(prog(t, tp, tp + 0.8)));
  s += estrela(sx, sy, 0.8, t, { ol: NOL });
  MAGOS.forEach((m, i) => (s += person({ ...m, x: lerp(-200, 420, E.out(prog(t, a0, fim(1)))) - i * 140, y: PE - i * 8, s: 1.2 - i * 0.05, look: 1, walk: t < fim(1) ? t * 5 + i : null, sil: '#0C0C0E', rim: '#8A7A5A', noShadow: true })));
  return { svg: cam(s, 540, 960, 1.0 + 0.05 * prog(t, a0, at(2))), html: '' };
}
const raioEstrelaV = (x, y, base, op) => (op > 0 ? beam(x, y, x, base, 18, 160, 0.55 * op) : '');
// ---------------------------------------------------------------- 2. primeiro: não chama de reis, chama de magos
function scT1(t) {
  const tm = wt(2, 'magos', -0.15), m = E.inOut(prog(t, tm, tm + 0.4));
  const coroa = 1 - m;
  const fig = person({ ...MAGOS[0], cover: m > 0.5 ? MAGOS[0].cover : null, gear: coroa > 0.5 ? { crown: true } : {}, x: 0, y: 160, s: 1.0, look: 1, mood: 'calm' });
  let s = cartao(t, at(2), 1, m > 0.5 ? 'MAGOS' : 'REIS?', fig);
  return { svg: s, html: '' };
}
// ---------------------------------------------------------------- 3. "Magos vindos do Oriente chegaram a Jerusalém" e perguntaram
function scJerusalem(t) {
  const a0 = at(3), tp = wt(3, 'perguntaram', -0.3), ch = E.out(prog(t, a0, tp));
  let s = jerusalem(t);
  MAGOS.forEach((m, i) => (s += person({ ...m, x: lerp(-320, 700, ch) - i * 200, y: PE - i * 6, s: 1.3 - i * 0.04, look: 1, walk: ch < 1 ? t * 5 + i : null, armR: i === 0 && t > tp ? fala(t, tp, fim(3), 30, 60) : 18 })));
  s += person({ ...man(1701), x: 960, y: PE + 4, s: 1.15, look: -1, mood: t > tp + 1.5 ? 'fear' : 'calm' });
  return { svg: cam(s, lerp(420, 560, ch), 980, 1.02 + 0.05 * prog(t, tp, fim(3))), html: '' };
}
// ---------------------------------------------------------------- 4. rei, nessa história, é Herodes; e o menino que eles vieram adorar
function scReiHerodes(t) {
  const th = wt(4, 'herodes', -0.2), tm = wt(4, 'menino', -0.25), m = E.inOut(prog(t, tm, tm + 0.6));
  let s = trono(t);
  s += person({ ...HERODES, x: 420, y: 1160, s: 1.55, look: 1, mood: 'calm', armL: 30, armR: 30 });
  s += pilula(540, 400, 'o rei Herodes', pop(t, th, 0.4), { w: 250 });
  if (m > 0) {
    let b = `<rect x="-600" width="${W + 1200}" height="${H}" fill="#151A22"/>` + stars(t, 40, 9, 900, 0.8) + estrela(540, 420, 0.9, t, { ol: NOL });
    b += casa(540, PE - 10, 0.8, { luz: 0.8 }) + `<circle cx="540" cy="${PE - 140}" r="300" fill="url(#gAmber)" opacity="0.5"/>`;
    s += opg(m, b) + pilula(540, 400, 'e o menino', pop(t, tm + 0.2, 0.4), { w: 220 });
  }
  return { svg: cam(s, 540, 900, 1.0 + 0.04 * prog(t, at(4), at(5))), html: '' };
}
// ---------------------------------------------------------------- 5. segundo: quantos eram? não diz; ouro, incenso e mirra
function scT2(t) {
  const a0 = at(5), to = wt(5, 'deram', -0.5);
  const p = ['ouro', 'incenso', 'mirra'].map((w) => pop(t, wt(5, w, -0.2), 0.45));
  let s = cartao(t, a0, 2, 'QUANTOS?', selo(0, 30, '?', pop(t, wt(5, 'mateus', -0.1), 0.4), C.r600, 100));
  if (t > to) {
    s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="${C.paper}"/>` + `<circle cx="540" cy="900" r="520" fill="url(#gAmber)" opacity="0.35"/>`;
    s += presentes(540, 1010, 1.5, p.map((x) => 0.25 + 0.75 * x), t);
    ['ouro', 'incenso', 'mirra'].forEach((w, i) => (s += pilula(255 + i * 285, 640, w, p[i], { w: 120, bg: '#FFFFFF', fill: C.ink, size: 40, borda: true })));
  }
  return { svg: cam(s, 540, 900, 1.0 + 0.03 * prog(t, a0, at(6))), html: '' };
}
// ---------------------------------------------------------------- 6. três presentes; quantas pessoas, o texto não diz
function scTresPresentes(t) {
  const a0 = at(6), tq = wt(6, 'quantas', -0.2);
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="${C.paper}"/>` + `<circle cx="540" cy="900" r="520" fill="url(#gAmber)" opacity="0.35"/>`;
  s += presentes(540, 820, 1.4, [1, 1, 1], t);
  s += selo(540, 480, '3', pop(t, a0 + 0.1, 0.4), C.b500, 90);
  const q = pop(t, tq, 0.4);
  if (q > 0) {
    // as pessoas: silhuetas com "?"
    [270, 540, 810].forEach((x, i) => (s += opg(q, person({ ...man(1900 + i), x, y: 1250, s: 0.7, look: 1, sil: C.g400, noShadow: true }))));
    s += selo(540, 960, '?', q, C.r600, 80);
  }
  return { svg: s, html: '' };
}
// ---------------------------------------------------------------- 7. terceiro: onde acharam Jesus? "Ao entrarem na casa, viram o menino com Maria, sua mãe."
function scT3(t) {
  const a0 = at(7), te = wt(7, 'ao', -0.2), tc = wt(7, 'casa', -0.2);
  if (t < te) return { svg: cartao(t, a0, 3, 'ONDE?', manjedoura(0, 140, 0.7, {}) + selo(0, -130, '?', pop(t, a0 + 0.9, 0.4), C.r600, 70)), html: '' };
  const w = E.out(prog(t, te, tc + 1.2));
  let s = interiorCasa(t, 0.5);
  s += person({ ...MARIA, x: 330, y: PE, s: 1.3, look: 1, mood: 'happy', armL: 60, armR: 70 }) + menino(372, PE - 195, 0.82);
  MAGOS.forEach((m, i) => (s += person({ ...m, x: lerp(1300, 640 + i * 160, w), y: PE + 6, s: 1.2, look: -1, mood: 'happy', walk: w < 1 ? t * 5 + i : null })));
  return { svg: cam(s, 560, 960, 1.02 + 0.04 * prog(t, te, at(8))), html: '' };
}
// ---------------------------------------------------------------- 8. numa casa; a manjedoura é de outra cena: os pastores, em Lucas
function quadro(inner, y, id) {
  return `<clipPath id="${id}"><rect x="90" y="${y}" width="900" height="470" rx="30"/></clipPath><g clip-path="url(#${id})">${inner}</g><rect x="90" y="${y}" width="900" height="470" rx="30" fill="none" ${ink(7)}/>`;
}
function scCasaManjedoura(t) {
  const a0 = at(8), tm = wt(8, 'manjedoura', -0.2), tl = wt(8, 'lucas', -0.2);
  const p1 = pop(t, a0 + 0.1, 0.45), p2 = pop(t, tm, 0.45);
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="${C.paper}"/>`;
  const casaIn = `<rect x="0" y="170" width="1080" height="560" fill="#151A22"/>${estrela(700, 260, 0.5, t, { ol: NOL, glow: 0.5 })}${casa(540, 640, 0.75, { luz: 0.8 })}${MAGOS.map((m, i) => person({ ...m, x: 250 + i * 70, y: 650, s: 0.62, look: 1, ol: NOL, rim: C.a300 })).join('')}`;
  const manjIn = `<rect x="0" y="700" width="1080" height="560" fill="#221C18"/><circle cx="540" cy="1050" r="340" fill="url(#gAmber)" opacity="0.6"/>${manjedoura(540, 1140, 0.8, { bebe: true, ol: NOL })}${person(pastor(1402, { x: 250, y: 1170, s: 0.92, look: 1, kneel: true, mood: 'happy', ol: NOL }))}${person(pastor(1403, { x: 830, y: 1170, s: 0.92, look: -1, kneel: true, mood: 'happy', ol: NOL }))}`;
  if (p1 > 0) s += opg(p1, quadro(casaIn, 200, 'qCasa') + pilula(540, 200, 'Mateus: a casa', p1, { w: 230, size: 40 }));
  if (p2 > 0) s += opg(p2, quadro(manjIn, 730, 'qManj') + pilula(540, 730, t > tl ? 'Lucas: os pastores' : 'a manjedoura', p2, { w: 250, size: 40 }));
  return { svg: s, html: '' };
}
// ---------------------------------------------------------------- 9. agora, a pista
function scAgoraPista(t) {
  const a0 = at(9);
  let s = bgNight(t, { moon: false }) + estrela(540, 640, 1.3, t, { ol: NOL });
  return { svg: cam(s, 540, 760, lerp(1.0, 1.25, E.inOut(prog(t, a0, at(10))))), html: '' };
}
// ---------------------------------------------------------------- 10. Herodes quis saber o tempo exato em que a estrela tinha aparecido (Mateus 2:7)
function scQuando(t) {
  const a0 = at(10), te = wt(10, 'estrela', -0.2);
  let s = trono(t, { escuro: true }) + `<circle cx="540" cy="900" r="520" fill="url(#gAmber)" opacity="0.35"/>` + lamparina(560, 1100, t);
  s += person({ ...HERODES, x: 300, y: 1160, s: 1.4, look: 1, mood: 'calm', armR: fala(t, seg(10), fim(10), 20, 40), ol: NOL, rim: C.a300 });
  MAGOS.forEach((m, i) => (s += person({ ...m, x: 690 + i * 150, y: PE - 70 + i * 4, s: 1.15, look: -1, ol: NOL, rim: C.a300 })));
  const e = pop(t, te, 0.5);
  if (e > 0) s += `<g transform="translate(540 470) scale(${f1(e * 100) / 100})">${rect(-280, -140, 560, 280, '#fff', `rx="44" stroke="${C.b500}" stroke-width="7"`)}${estrela(-150, -6, 0.42, t, { glow: 0.3 })}${label(70, -10, 'quando', { fam: 'Geist', w: 800, size: 58 })}${label(70, 56, 'apareceu?', { fam: 'Geist', w: 800, size: 58 })}</g>`;
  return { svg: cam(s, 540, 860, 1.02 + 0.04 * prog(t, a0, at(11))), html: '' };
}
// ---------------------------------------------------------------- 11. mandou matar os meninos de dois anos pra baixo, pelo que os magos disseram (Mateus 2:16)
function scOrdem(t) {
  const a0 = at(11), tm = wt(11, 'matar', -0.3), td = wt(11, 'dois', -0.2);
  const ap = E.back(prog(t, tm, tm + 0.4)), sai = E.in(prog(t, td, fim(11) + 0.4));
  let s = trono(t, { escuro: true }) + `<circle cx="420" cy="700" r="560" fill="url(#gAmber)" opacity="0.25"/>`;
  s += person({ ...HERODES, x: 360, y: 1160, s: 1.45, look: 1, mood: 'angry', armR: lerp(30, 96, ap), armL: 30, ol: NOL, rim: C.a300, shake: t < tm ? 3 : 0, t });
  for (let i = 0; i < 3; i++) s += person({ ...soldado(1801 + i), x: 700 + i * 140 + sai * 700, y: PE - 70 + (i % 2) * 12, s: 1.1, look: 1, armR: 26, walk: sai > 0 ? t * 6 + i : null, sil: '#0E0B09', rim: '#6A4E34', noShadow: true });
  s += pilula(540, 360, '2 anos pra baixo', pop(t, td, 0.45), { w: 290, size: 50 });
  return { svg: cam(s, 540, 860, 1.02 + 0.05 * prog(t, a0, at(12))), html: '' };
}
// ---------------------------------------------------------------- 12. Mateus não diz quanto tempo; a conta de Herodes não foi de uma noite
function scConta(t) {
  const a0 = at(12), tc = wt(12, 'conta', -0.2), tn = wt(12, 'noite', -0.25);
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="${C.paper}"/>`;
  const q = pop(t, a0 + 0.1, 0.45), d = E.inOut(prog(t, tc, tc + 0.6));
  s += `<g transform="translate(540 520) scale(${f1(q * 0.9 * 100) / 100})">${rect(-280, -140, 560, 280, '#fff', `rx="44" stroke="${C.b500}" stroke-width="7"`)}${estrela(-150, -6, 0.42, t, { glow: 0.3 })}${label(70, -10, 'quando', { fam: 'Geist', w: 800, size: 58 })}${label(70, 56, 'apareceu?', { fam: 'Geist', w: 800, size: 58 })}</g>`;
  if (d > 0) {
    s += opg(d, `<path d="M 540 680 L 540 740" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/><path d="M 512 718 L 540 752 L 568 718" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>`);
    s += `<g transform="translate(540 900) scale(${f1(pop(t, tc + 0.2, 0.5) * 100) / 100})">${rect(-290, -120, 580, 240, C.b500, `rx="44"`)}${label(0, 40, '2 anos', { size: 132, fill: '#fff' })}</g>`;
  }
  const n = pop(t, tn, 0.4);
  if (n > 0) s += `<g transform="translate(540 1150) scale(${f1(n * 100) / 100})">${rect(-210, -46, 420, 92, '#fff', `rx="46" ${ink(5)}`)}${label(0, 16, 'não 1 noite', { fam: 'Geist', w: 800, size: 46, fill: C.r600 })}</g>`;
  return { svg: s, html: '' };
}
// ---------------------------------------------------------------- 13. pode deixar os três reis no presépio
function scPresepio(t) {
  const a0 = at(13);
  return { svg: cam(presepio(t), 540, 960, lerp(1.08, 1.0, E.inOut(prog(t, a0, at(14))))), html: '' };
}
// ---------------------------------------------------------------- 14. só lembra o que fizeram quando acharam o menino: "prostrando-se, o adoraram"
function scAdoraram(t) {
  const a0 = at(14), tp = wt(14, 'prostrandose', -0.3), ta = wt(14, 'adoraram', -0.2);
  const pr = t > tp, l = 0.45 + 0.35 * E.out(prog(t, ta, ta + 0.8));
  let s = interiorCasa(t, l);
  s += person({ ...MARIA, x: 300, y: PE, s: 1.3, look: 1, mood: 'happy', armL: 60, armR: 70 }) + menino(342, PE - 195, 0.82);
  MAGOS.forEach((m, i) => { const x = 620 + i * 170; s += pr ? person({ ...m, x, y: PE - 70, s: 1.1, look: -1, kneel: true, mood: 'closed', armL: 28, armR: 28, lean: -10 }) : person({ ...m, x, y: PE + 6, s: 1.15, look: -1, mood: 'happy' }); });
  s += presentes(470, PE + 20, 0.55, [1, 1, 1], t);
  return { svg: cam(s, 520, 960, 1.02 + 0.03 * E.inOut(prog(t, a0, FIM_T))), html: '' };
}

// ---------------------------------------------------------------- 15. cartão final: o app na Google Play e na web
const FIM_T = AUDIO_END + 0.2;
function scFim(t) {
  return endCard(t, FIM_T, ['Mateus 2', 'Lucas 2'], { head: 'Seu plano de leitura da Bíblia', web: 'app.pregaai.com' });
}

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  { a: 0, b: at(1), f: scGancho, ref: null, dark: true },
  { a: at(1), b: at(2), f: scOutraCena, ref: 'Mateus 2', dark: true },
  { a: at(2), b: at(3), f: scT1, ref: null },
  { a: at(3), b: at(4), f: scJerusalem, ref: 'Mateus 2:1-2' },
  { a: at(4), b: at(5), f: scReiHerodes, ref: 'Mateus 2:1-3' },
  { a: at(5), b: at(6), f: scT2, ref: [[SEGS[5][4][6] - 0.2, 'Mateus 2:11']] },
  { a: at(6), b: at(7), f: scTresPresentes, ref: null },
  { a: at(7), b: at(8), f: scT3, ref: [[SEGS[7][4][4] - 0.2, 'Mateus 2:11']] },
  { a: at(8), b: at(9), f: scCasaManjedoura, ref: 'Lucas 2:16' },
  { a: at(9), b: at(10), f: scAgoraPista, ref: null, dark: true },
  { a: at(10), b: at(11), f: scQuando, ref: 'Mateus 2:7', dark: true },
  { a: at(11), b: at(12), f: scOrdem, ref: 'Mateus 2:16', dark: true },
  { a: at(12), b: at(13), f: scConta, ref: null },
  { a: at(13), b: at(14), f: scPresepio, ref: null, dark: true },
  { a: at(14), b: FIM_T, f: scAdoraram, ref: 'Mateus 2:11' },
  { a: FIM_T, b: DURATION + 1, f: scFim, ref: null, end: true },
];
