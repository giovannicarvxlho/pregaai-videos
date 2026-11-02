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
  s += crossFig(690, 592, 0.5, { fill: cf, rim, bow: 0.35 }) + crossFig(1230, 592, 0.5, { fill: cf, rim, bow: 0.35 });
  s += crossFig(960, 572, 0.64, { fill: cf, rim, plaque: true, bow: o.bow || 0 });
  return s;
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
function dot(x, y, n, sc = 1, op = 1) {
  if (sc <= 0 || op <= 0) return '';
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * 100) / 100})" opacity="${f1(op * 100) / 100}">
    <circle cy="8" r="42" fill="${C.ink}"/><circle r="42" fill="${C.b500}" stroke="${C.ink}" stroke-width="6"/>
    <text y="16" text-anchor="middle" font-family="Geist" font-weight="800" font-size="46" fill="#fff">${n}</text></g>`;
}
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

// ================================================================ 10. A SÉTIMA FRASE E O VÉU
// "Pai, nas tuas mãos entrego o meu espírito." E expirou (Lucas 23:46).
function scSetima(t) {
  const tp = seg(L(10, 1)), te = wordTime(L(10, 2), 'expirou'), bow = E.inOut(prog(t, te - 0.3, te + 0.6));
  const light = 0.08 + 0.3 * E.out(prog(t, tp - 0.2, tp + 0.8)) * (1 - 0.8 * bow);
  let s = bgDark(t) + `<circle cx="960" cy="240" r="520" fill="url(#gWhite)" opacity="${f1(light * 100) / 100}"/>`;
  s += hill(960, 880, 1300, '#1B1E22', '#060708') + crossFig(960, 905, 1.5, { plaque: true, fill: '#050505', rim: '#5A606A', bow });
  return { svg: cam(s, 960, 400, 1.0 + 0.06 * prog(t, at(L(10, 0)), at(L(10, 3)))), html: '' };
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
// Piloto: só a abertura (parte 1) e a parte 10. As outras partes entram depois.
const SCENES = [
  { a: 0, b: at(L(1, 2)), f: scTrevas, ref: 'Lucas 23:44-45', dark: (t) => t > (darkSpan()[0] + darkSpan()[1]) / 2 },
  { a: at(L(1, 2)), b: at(L(1, 4)), f: scVeuAbertura, ref: 'Mateus 27:51', dark: true },
  { a: at(L(1, 4)), b: at(L(1, 12)), f: scSete, ref: null },
  { a: at(L(1, 12)), b: at(L(10, 0)), f: scVeuLuz, ref: null, dark: true },
  { a: at(L(10, 0)), b: at(L(10, 3)), f: scSetima, ref: 'Lucas 23:46', dark: true },
  { a: at(L(10, 3)), b: at(L(10, 4)), f: scVeuRasga, ref: 'Mateus 27:51', dark: true },
  { a: at(L(10, 4)), b: at(L(10, 5)), f: scRochas, ref: null, dark: true },
  { a: at(L(10, 5)), b: at(L(10, 6)), f: scVeuCalmo, ref: null, dark: true },
  { a: at(L(10, 6)), b: at(L(10, 12)), f: scSantos, ref: [[at(L(10, 6)), 'Hebreus 9:3, 7'], [at(L(10, 10)), 'Hebreus 10:19-20']] },
  { a: at(L(10, 12)), b: at(L(10, 14)), f: scCenturiao, ref: 'Marcos 15:39', dark: true },
  { a: at(L(10, 14)), b: DURATION + 1, f: scFilho, ref: null, dark: true },
];
