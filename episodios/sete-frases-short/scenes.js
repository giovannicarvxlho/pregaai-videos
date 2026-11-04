// Short que resume o vídeo longo "As 7 frases de Jesus na cruz" e leva até ele.
// O ângulo é o do longo: nenhum evangelho registra as sete (Mt 27:46; Mc 15:34; Lc 23:34, 43, 46;
// Jo 19:26-27, 28, 30). Teste: um texto de gancho grande já no primeiro quadro, porque 45,9% pularam
// o último Short logo no começo.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];

function dot(x, y, n, sc = 1, op = 1, col = C.b500) {
  if (sc <= 0 || op <= 0) return '';
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * 100) / 100})" opacity="${f1(op * 100) / 100}">
    <circle cy="8" r="42" fill="${C.ink}"/><circle r="42" fill="${col}" stroke="${C.ink}" stroke-width="6"/>
    <text y="16" text-anchor="middle" font-family="Geist" font-weight="800" font-size="46" fill="#fff">${n}</text></g>`;
}
const ghost = (x, y, n, op = 1) => `<g opacity="${f1(op * 100) / 100}"><circle cx="${x}" cy="${y}" r="42" fill="#fff" stroke="${C.border}" stroke-width="6"/><text x="${x}" y="${y + 16}" text-anchor="middle" font-family="Geist" font-weight="800" font-size="46" fill="${C.g400}">${n}</text></g>`;
const label = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${o.fam || 'Geist'}" font-weight="${o.w || 700}" font-size="${o.size || 36}" fill="${o.fill || C.inkDeep}">${esc(txt)}</text>`;

// ---------------------------------------------------------------- 1. o gancho, legível sem som
function scGancho(t) {
  let s = bgGloom(t, { seed: 1101 });
  s += `<circle cx="540" cy="760" r="420" fill="url(#gWhite)" opacity="0.5"/>`;
  s += hill(540, 1240, 900, '#D6CCC1') + crossFig(540, 1262, 1.05, { plaque: true, rim: C.g300 });
  // o texto está no quadro 1 (sem entrar animado) e sai quando a frase termina
  const out = prog(t, fim(1) + 0.1, fim(1) + 0.5);
  const html = `<div style="position:absolute;left:0;right:0;top:330px;display:flex;flex-direction:column;align-items:center;opacity:${f1((1 - out) * 100) / 100}">
    <div style="font:400 84px/1 'Gasoek One';color:#181614;text-shadow:0 8px 0 #fff;white-space:nowrap">NENHUM EVANGELHO</div>
    <div style="margin-top:22px;padding:4px 40px 24px;background:#2383E2;border:7px solid #181614;border-radius:34px;box-shadow:0 14px 0 0 #181614;font:400 150px/1 'Gasoek One';color:#fff;white-space:nowrap;transform:rotate(-4deg)">TEM AS 7</div></div>`;
  return { svg: cam(s, 540, 1262, 1.0 + 0.05 * prog(t, 0, at(2))), html };
}

// ---------------------------------------------------------------- 2. os quatro evangelhos
const BOOKS = [
  { name: 'Mateus', ref: '27:46', x: 290, y: 560, dots: [4] },
  { name: 'Marcos', ref: '15:34', x: 790, y: 560, dots: [4] },
  { name: 'Lucas', ref: '23:34, 43, 46', x: 290, y: 930, dots: [1, 2, 7] },
  { name: 'João', ref: '19:26-27, 28, 30', x: 790, y: 930, dots: [3, 5, 6] },
];
const CW = 440, CH = 300;
function card(b, pin, out, hl) {
  if (pin <= 0 || out >= 1) return '';
  const x = b.x - CW / 2, y = b.y + 30 * out, edge = hl > 0 ? C.b500 : C.border, cx = b.x, cy = b.y + CH / 2, sc = pin * (1 + 0.05 * hl);
  return `<g opacity="${f1(clamp(pin) * (1 - out) * 100) / 100}" transform="translate(${cx} ${cy}) scale(${f1(sc * 1000) / 1000}) translate(${-cx} ${-cy})">
    <rect x="${x}" y="${y + 12}" width="${CW}" height="${CH}" rx="36" fill="${edge}"/>
    <rect x="${x}" y="${y}" width="${CW}" height="${CH}" rx="36" fill="#fff" stroke="${edge}" stroke-width="${hl > 0 ? 6 : 4}"/>
    ${label(cx, y + 76, b.name, { size: 52 })}${label(cx, y + 264, b.ref, { fam: 'Geist Mono', w: 500, size: 30, fill: C.muted })}</g>`;
}
function scLivros(t) {
  const T0 = at(2), Tj = seg(6) + 0.2;
  const Tb = { 4: seg(2) + 0.1, 1: seg(3), 2: seg(3) + 0.12, 7: seg(3) + 0.24, 3: seg(4), 5: seg(4) + 0.12, 6: seg(4) + 0.24 };
  const row = (n) => [540 + (n - 4) * 128, 400];
  const home = (n) => (n === 4 ? 0 : [3, 5, 6].includes(n) ? 3 : 2);
  const inCard = (bi, n) => { const b = BOOKS[bi], k = b.dots.indexOf(n); return [b.x + (k - (b.dots.length - 1) / 2) * 104, b.y + 170]; };
  const mix = (A, B, u) => [lerp(A[0], B[0], u), lerp(A[1], B[1], u)];
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const crossOp = prog(t, Tj + 0.4, Tj + 0.9);
  if (crossOp > 0) s += crossFig(540, 1240, 1.0, { plaque: true, op: crossOp });
  const hl = pop(t, seg(5), 0.4) * (1 - prog(t, Tj - 0.2, Tj));
  BOOKS.forEach((b, i) => (s += card(b, pop(t, T0 + 0.1 + i * 0.1, 0.4), prog(t, Tj + 0.1, Tj + 0.5), i >= 2 ? hl : 0)));
  for (let n = 1; n <= 7; n++) {
    const pb = E.inOut(prog(t, Tb[n], Tb[n] + 0.5)), pr = E.inOut(prog(t, Tj + (n - 1) * 0.05, Tj + 0.55 + (n - 1) * 0.05));
    const P = mix(mix(row(n), inCard(home(n), n), pb), row(n), pr);
    s += dot(P[0], P[1], n, pop(t, T0 + (n - 1) * 0.06, 0.35));
  }
  const cp = pop(t, wordTime(2, 'marcos') - 0.1, 0.4), cr = E.inOut(prog(t, Tj + 0.1, Tj + 0.7));
  if (cp > 0 && cr < 1) { const P = mix(inCard(1, 4), row(4), cr); s += dot(P[0], P[1], 4, cp, 1 - cr * 0.9); }
  return { svg: s, html: '' };
}

// ---------------------------------------------------------------- 3. as sete, uma por uma
const RESUMO = [['Perdão', 'Lucas 23:34'], ['Promessa', 'Lucas 23:43'], ['Cuidado', 'João 19:26-27'], ['Abandono', 'Mateus 27:46'], ['Sede', 'João 19:28'], ['Consumado', 'João 19:30'], ['Entrega', 'Lucas 23:46']];
function scSete(t) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  RESUMO.forEach(([nome, ref], i) => {
    const y = 380 + i * 128, lit = pop(t, seg(7 + i) - 0.1, 0.4), in0 = prog(t, at(7) + i * 0.05, at(7) + 0.3 + i * 0.05);
    if (lit > 0) {
      s += dot(170, y, i + 1, lit) + `<g opacity="${f1(clamp(lit) * 100) / 100}">${label(250, y + 20, nome, { anchor: 'start', size: 60, w: 800 })}${label(980, y + 14, ref, { anchor: 'end', fam: 'Geist Mono', w: 500, size: 30, fill: C.muted })}</g>`;
    } else s += ghost(170, y, i + 1, in0) + `<g opacity="${f1(in0 * 0.35 * 100) / 100}">${rect(250, y - 14, 300, 28, C.g300, 'rx="14"')}</g>`;
  });
  return { svg: cam(s, 540, 760, 1.0 + 0.03 * prog(t, at(7), AUDIO_END)), html: '' };
}

const scFim = (t) => endCard(t, AUDIO_END + 0.2, ['Mateus 27', 'Lucas 23', 'João 19']);

const SCENES = [
  { a: 0, b: at(2), f: scGancho, ref: null },
  { a: at(2), b: at(7), f: scLivros, ref: null },
  { a: at(7), b: AUDIO_END + 0.2, f: scSete, ref: null },
  { a: AUDIO_END + 0.2, b: DURATION + 1, f: scFim, ref: null, end: true },
];
