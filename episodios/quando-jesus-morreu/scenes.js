// O que aconteceu quando Jesus morreu (Mateus 27:45-56; Marcos 15:33-39; Lucas 23:44-49; João 19:28-37).
// Vídeo longo, 1920×1080. Cada cena começa em at(i), wordTime ou nas pontas dos trechos dos cortes (antes/depois).
// Reverência (roteiro e regras do canal):
// - Jesus na cruz sempre em silhueta, sem sangue nem ferida. Deus não aparece em figura nenhuma; o Lugar
//   Santíssimo fica vazio e escuro.
// - Os mortos ressuscitados não assustam: na sexta, os sepulcros se abrem com luz suave e ninguém sai deles.
//   Na cidade, são pessoas comuns de roupa clara, ao amanhecer, porque Mateus diz que saíram dos sepulcros
//   depois da ressurreição de Jesus (Mateus 27:53).
// - O sumo sacerdote leva uma bacia fechada, sem sangue à vista (Hebreus 9:7).
// - As pernas quebradas só sugeridas (a cabeça dos dois criminosos cai). A lança fica longe do corpo e
//   "sangue e água" é um fio claro, sem detalhe (João 19:34).
// - O primeiro quadro já está em movimento: a pedra de um sepulcro rachando (no vídeo anterior o público saiu
//   em 0:02 com uma cena parada).
// Cortes (corte.json): curto 1 = 61, 22, 18-19, 13, 15-16, 24-25; curto 2 = 0-3, 30-33; curto 3 = 39-40, 13,
// 35-38. Nas pontas desses trechos a troca de cena usa antes(i)/depois(i). A frase 61 só existe para a
// abertura do curto 1 (a cortina fechada e o sumo sacerdote diante dela) e não aparece no longo.

const L = (part, line) => PARTS[part - 1] + line;
const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];
const CURTO = typeof RECORTE !== 'undefined' && RECORTE;
// Pontas dos trechos de tools/corte.cjs: um trecho começa até 0,15 s antes da 1ª frase e termina até 0,6 s
// depois da última. antes(i): a cena da frase que abre um trecho já está inteira no 1º quadro dele.
// depois(i): a cena seguinte a um trecho que termina na frase i só começa a entrar depois da pausa.
const inicioTrecho = (i) => seg(i) - Math.min(0.15, i > 0 ? (seg(i) - fim(i - 1)) / 2 : seg(i));
const fimTrecho = (i) => fim(i) + (i + 1 < SEGS.length ? Math.min(0.6, seg(i + 1) - fim(i)) : 0.6);
const antes = (i) => Math.min(at(i), inicioTrecho(i) - XF / 2 - 0.02);
const depois = (i) => Math.max(at(i + 1), fimTrecho(i) + XF / 2 + 0.02);
// O trecho da frase 61 (abertura do curto 1) vai até 254,04 s, depois do CARTAO_INICIO do data.js (253,80).
// No recorte (curtos e TikTok), que não usa o cartão final, a cena da 61 continua até o fim desse trecho;
// no longo, o cartão entra no CARTAO_INICIO, como manda o corte.json.
const FIM_A = CURTO ? Math.max(CARTAO_INICIO, fimTrecho(61) + 0.05) : CARTAO_INICIO;

const FLOOR_Y = 880; // pés dos personagens em primeiro plano (a legenda começa em ~920)
const SIL = '#16110F';
const NIGHT_OL = '#0E0D0C';
const DUSK_OL = '#0E0B09', DUSK_HILL = '#2C221D', CRUZ_TARDE = '#0A0807';
const RIM = '#5A606A'; // contraluz frio da tarde escura

const soldado = (seed, extra = {}) => ({ ...man(seed), cover: null, beard: false, robe: C.p600, gear: { helmet: 'rom', armor: true }, ...extra });
const CENT = { ...soldado(821), robe: '#8E3B46', gear: { helmet: 'cent', armor: true, spear: 'l' } };
const lider = (seed, extra = {}) => ({ ...man(seed), cover: COVERS[seed % 4], beard: true, ...extra });
const mulher = (seed, extra = {}) => ({ ...man(seed), beard: false, cover: ['#E2D8CF', C.g300, '#C9BBAE', C.g100][seed % 4], ...extra });
const TONS = [C.g600, C.p400, C.ch300, C.oliveDk, '#7B6A55', C.p600, '#9C8F70', C.g700, '#B9897A', '#8C7A62'];
const povo = (seed, extra = {}) => { const r = rng(seed * 31 + 7); return { ...man(seed), robe: pick(r, TONS), ...extra }; };
const PILATOS = { robe: '#F4F1EC', skin: '#E0AC69', hair: '#3A2A20', beard: false };
const JOAO = { ...man(1002), robe: C.g600, beard: false, hair: '#3A2A20', cover: null, skin: '#C68B59' };
const LEITOR = { ...man(1401), robe: C.b500, cover: null, beard: true, skin: '#C68B59', hair: '#2F2622' };
// O sumo sacerdote: manto azul (Êxodo 28:31), turbante de linho com a lâmina de ouro e o peitoral (Êxodo 28).
const SUMO = { robe: C.b500, skin: '#B97A4A', hair: '#2F2622', beard: true, cover: '#FFFFFF' };
const sacerdote = (seed, extra = {}) => ({ ...man(seed), robe: '#F4F1EC', cover: '#FFFFFF', beard: true, ...extra });
// Os santos ressuscitados, já na cidade, ao amanhecer: gente comum de roupa clara (Mateus 27:53).
const CLAROS = ['#F4F1EC', '#EFE8E4', '#FFFFFF', '#F1E8D6', '#E9E1D8'];
const santo = (seed, extra = {}) => ({ ...(seed % 2 ? man(seed) : mulher(seed)), robe: CLAROS[seed % CLAROS.length], ...(seed % 2 ? { cover: null } : { cover: '#FFFFFF' }), ...extra });

// ---------------------------------------------------------------- utilidades (as mesmas dos longos anteriores)
const opg = (op, svg) => (op <= 0 ? '' : op >= 1 ? svg : `<g opacity="${f1(op * 100) / 100}">${svg}</g>`);
const label = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${o.fam || 'Geist'}" font-weight="${o.w || 700}" font-size="${o.size || 36}" fill="${o.fill || C.inkDeep}" opacity="${f1((o.op ?? 1) * 100) / 100}">${o.html || esc(txt)}</text>`;
// Corte dentro de uma cena, no meio da frase: cruza de A para B no mesmo tempo das trocas de cena.
function xcut(t, tc, A, B) {
  const p = E.sine(prog(t, tc - XF / 2, tc + XF / 2));
  if (p <= 0) return A(t);
  if (p >= 1) return B(t);
  return A(t) + `<g opacity="${p.toFixed(3)}">${B(t)}</g>`;
}
// Acende e apaga (realce de um instante).
const bump = (t, t0, d = 0.9) => Math.sin(Math.PI * prog(t, t0, t0 + d));
const fala = (t, t0, t1, base = 20, amp = 30) => base + amp * Math.abs(Math.sin(t * 5.5)) * (t > t0 && t < t1 ? 1 : 0);
// Câmera: o ponto (fx, fy) do desenho aparece em (sx, sy) da tela, com zoom z; q faz o quadro tremer.
const camQ = (inner, fx, fy, z, sx, sy, q, t) => cam(inner, fx, fy, z, sx - fx + Math.sin(t * 43) * 12 * q, sy - fy + Math.cos(t * 37) * 8 * q);
// Onde fica a mão de uma pessoa (para pôr vara, bacia, rolo).
function mao(o, side) {
  const s = o.s || 1, f = o.flip ? -1 : 1, ang = (side > 0 ? o.armR : o.armL) ?? 14, r = (ang * Math.PI) / 180;
  return [o.x + f * s * side * (34 + 86 * Math.sin(r)), o.y + s * (-154 + 86 * Math.cos(r) + (o.kneel ? 40 : 0))];
}
// Sentado (numa pedra baixa): o corpo ajoelhado com as pernas para a frente. o.rock põe a pedra.
function sentado(o) {
  const s = o.s || 1, col = o.sil || C.g800, sw = o.sil ? 0 : f1(4 * s), ol = o.sil || o.ol || C.ink;
  const rk = o.rock ? `<ellipse cx="${f1(o.x)}" cy="${f1(o.y + 88 * s)}" rx="${f1(80 * s)}" ry="${f1(9 * s)}" fill="#000" opacity="0.18"/><path d="M ${f1(o.x - 78 * s)} ${f1(o.y + 86 * s)} C ${f1(o.x - 84 * s)} ${f1(o.y + 30 * s)} ${f1(o.x + 84 * s)} ${f1(o.y + 30 * s)} ${f1(o.x + 78 * s)} ${f1(o.y + 86 * s)} Z" fill="${o.rock}" ${ink(5, ol)}/>` : '';
  const legs = [-15, 15].map((dx) => `<rect x="${f1(o.x + (dx - 9) * s)}" y="${f1(o.y + 18 * s)}" width="${f1(18 * s)}" height="${f1(60 * s)}" rx="${f1(9 * s)}" fill="${col}" stroke="${ol}" stroke-width="${sw}"/>`).join('');
  return opg(o.op ?? 1, rk + legs + person({ ...o, kneel: true, noShadow: true, op: 1 }));
}
// Anel de som que se abre (o brado).
function anel(x, y, t, t0, col = '#fff') {
  const p = prog(t, t0, t0 + 1.2);
  return p > 0 && p < 1 ? `<circle cx="${x}" cy="${y}" r="${f1(60 + 420 * E.out(p))}" fill="none" stroke="${col}" stroke-width="${f1(10 * (1 - p))}" opacity="${f1((1 - p) * 0.7 * 100) / 100}"/>` : '';
}

// ---------------------------------------------------------------- fundos e peças da tarde da cruz
// A tarde das trevas (Mateus 27:45): céu de chumbo, quase noite, com um resto de luz quente no horizonte.
function bgTrevas(t, o = {}) {
  let s = bgNight(t, { sky: 'skyDawn', moon: false, starOp: 0, ox: o.ox });
  s += `<circle cx="${o.gx ?? 960}" cy="${GROUND}" r="${o.gr ?? 900}" fill="url(#gPeach)" opacity="${o.glow ?? 0.1}"/>`;
  return s;
}
// O Gólgota com as três cruzes em silhueta e Jerusalém atrás (o mesmo do longo das 7 frases).
function golgota(t, o = {}) {
  const dark = o.dark, ol = dark ? '#060708' : C.ink, fill = dark ? '#1B1E22' : '#D6CCC1', cf = dark ? '#050505' : SIL, rim = dark ? '#3A3F47' : null;
  let s = dark ? '' : city(370, 622, 0.5, t);
  s += hill(960, 560, 1150, fill, ol);
  const b = o.bows || [0.35, 0.35, o.bow ?? 0];
  s += crossFig(690, 592, 0.5, { fill: cf, rim, bow: b[0] }) + crossFig(1230, 592, 0.5, { fill: cf, rim, bow: b[1] });
  s += crossFig(960, 572, 0.64, { fill: cf, rim, plaque: true, bow: b[2] });
  return s;
}
// O Gólgota pequeno, ao fundo (x, y é onde fica o alto do morro; sc, a escala).
const golgotaLonge = (t, x, y, sc, o = {}) => `<g transform="translate(${x} ${y}) scale(${sc}) translate(-960 -560)">${golgota(t, o)}</g>`;
// A cruz do meio de perto, em silhueta.
function cruzPerto(t, o = {}) {
  let s = bgDark(t);
  if (o.light) s += `<circle cx="960" cy="240" r="520" fill="url(#gWhite)" opacity="${f1(o.light * 100) / 100}"/>`;
  s += hill(960, 880, 1300, '#1B1E22', '#060708');
  s += crossFig(960, 905, 1.5, { plaque: true, fill: '#050505', rim: RIM, bow: o.bow || 0 });
  return s;
}
// Pedrinhas que caem e poeira que sobe enquanto a terra treme.
function cascalho(t, cx, w, y0, base, q, o = {}) {
  if (q <= 0) return '';
  const r = rng(o.seed || 51), col = o.col || '#8C857D', ol = o.ol || NIGHT_OL, n = o.n || 9;
  let g = '';
  for (let i = 0; i < n; i++) {
    const x = cx + (r() - 0.5) * w, yy = y0 - r() * 160, sp = 0.9 + r() * 0.8, off = r();
    const ph = (t * sp + off) % 1, y = yy + ph * ph * (base - yy), rr = (8 + r() * 9) * (o.s || 1), rot = t * 300 * sp + off * 360;
    g += `<path transform="translate(${f1(x + ph * 30)} ${f1(y)}) rotate(${f1(rot % 360)})" d="M ${f1(-rr)} ${f1(rr * 0.3)} L ${f1(-rr * 0.4)} ${f1(-rr)} L ${f1(rr * 0.8)} ${f1(-rr * 0.6)} L ${f1(rr)} ${f1(rr * 0.5)} L ${f1(rr * 0.1)} ${f1(rr)} Z" fill="${col}" stroke="${ol}" stroke-width="4" stroke-linejoin="round" opacity="${f1(q * (1 - ph * 0.3) * 100) / 100}"/>`;
  }
  const dc = o.dust || '#5A5856';
  for (let i = 0; i < 7; i++) {
    const ph = (t * 0.8 + i / 7) % 1, x = cx - w * 0.5 + (i + 0.5) * (w / 7) + Math.sin(i * 3) * 30;
    g += `<circle cx="${f1(x + (i % 2 ? 1 : -1) * ph * 50)}" cy="${f1(base - 10 - ph * 70)}" r="${f1(22 + ph * 46)}" fill="${dc}" opacity="${f1(q * (1 - ph) * 0.45 * 100) / 100}"/>`;
  }
  return g;
}
// Rocha que se parte ao meio (Mateus 27:51), a mesma do longo das 7 frases.
function rocha(x, y, s, split, id, o = {}) {
  const fill = o.fill || '#3E3B38', ol = o.ol || '#060708';
  const d = 'M -150 0 C -170 -60 -120 -140 -40 -150 C 40 -170 130 -120 150 -50 C 165 -10 150 0 150 0 Z';
  const crack = 'M 6 -152 L -10 -110 L 14 -80 L -8 -40 L 10 0';
  const g = (side) => `<clipPath id="${id}${side}"><path d="${side < 0 ? 'M -200 -200 L 6 -152 L -10 -110 L 14 -80 L -8 -40 L 10 0 L -200 10 Z' : 'M 200 -200 L 6 -152 L -10 -110 L 14 -80 L -8 -40 L 10 0 L 200 10 Z'}"/></clipPath>
    <g transform="translate(${f1(side * 26 * split)} 0) rotate(${f1(side * 6 * split)} ${side * 150} 0)"><g clip-path="url(#${id}${side})"><path d="${d}" fill="${fill}" stroke="${ol}" stroke-width="7"/></g></g>`;
  const line = split > 0 ? `<path d="${crack}" fill="none" stroke="${ol}" stroke-width="7" stroke-linejoin="round" stroke-dasharray="260" stroke-dashoffset="${f1(260 * (1 - clamp(split * 3)))}"/>` : '';
  return `<g transform="translate(${x} ${y}) scale(${s})">${g(-1)}${g(1)}${split < 0.34 ? line : ''}</g>`;
}
// Rachadura no chão: um zigue-zague que corre de x0 a x1 enquanto p vai de 0 a 1.
function racha(x0, x1, y, p, seed, o = {}) {
  if (p <= 0) return '';
  const r = rng(seed), n = 16, pts = [];
  for (let k = 0; k <= n; k++) pts.push([lerp(x0, x1, k / n), y + (r() - 0.5) * (o.amp || 26) + (k % 2 ? 7 : -7)]);
  const d = 'M ' + pts.map(([px, py]) => `${f1(px)} ${f1(py)}`).join(' L ');
  return `<path d="${d}" fill="none" stroke="${o.col || '#060708'}" stroke-width="${f1((o.w || 10) * clamp(p * 1.6))}" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${f1((1 - p) * 1000) / 1000}"/>`;
}
// Luz que sobe dos sepulcros abertos: pontinhos claros subindo devagar (sem ninguém).
function motas(t, x, y, w, n, seed, op) {
  if (op <= 0) return '';
  const r = rng(seed); let g = '';
  for (let i = 0; i < n; i++) {
    const off = r(), sp = 0.12 + r() * 0.1, sx = (r() - 0.5) * w, ph = (t * sp + off) % 1, rr = 2.5 + r() * 3.5;
    g += `<circle cx="${f1(x + sx + Math.sin(t * 1.3 + i) * 12)}" cy="${f1(y - ph * 320)}" r="${f1(rr)}" fill="#FFF3D6" opacity="${f1(op * Math.sin(Math.PI * ph) * 0.9 * 100) / 100}"/>`;
  }
  return g;
}

// ---------------------------------------------------------------- a lista (1 a 7)
function dot(x, y, n, sc = 1, op = 1) {
  if (sc <= 0 || op <= 0) return '';
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * 100) / 100})" opacity="${f1(op * 100) / 100}">
    <circle cy="8" r="42" fill="${C.ink}"/><circle r="42" fill="${C.b500}" stroke="${C.ink}" stroke-width="6"/>
    <text y="16" text-anchor="middle" font-family="Geist" font-weight="800" font-size="46" fill="#fff">${n}</text></g>`;
}
// Os sete itens: o título do cartão de cada um, o da lista final e a referência.
const SETE = [null,
  { titulo: 'As trevas', ref: 'Mateus 27:45' },
  { titulo: 'O véu rasgado', ref: 'Mateus 27:51' },
  { titulo: 'O terremoto', ref: 'Mateus 27:51' },
  { titulo: 'Os túmulos abertos', ref: 'Mateus 27:52-53' },
  { titulo: 'O centurião', ref: 'Mateus 27:54' },
  { titulo: 'O povo e as mulheres', ref: 'Lucas 23:48-49' },
  { titulo: 'Sangue e água', ref: 'João 19:34' },
];
// Cartão do item (cena inteira, como no longo dos "Eu sou"): papel, o número, o título em Lora, a referência,
// a fila dos sete e, à direita, uma moldura com o desenho do item. O canto de cima à direita fica livre (banner).
const MOLDURA = (id, g, fundo = C.paper) => `<clipPath id="${id}"><rect x="1160" y="260" width="680" height="540" rx="44"/></clipPath><g clip-path="url(#${id})"><rect x="1160" y="260" width="680" height="540" fill="${fundo}"/>${g}</g><rect x="1160" y="260" width="680" height="540" rx="44" fill="none" ${ink(6)}/>`;
function cartao(t, t0, n, art) {
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${C.paper}"/><circle cx="1500" cy="530" r="600" fill="url(#gAmber)" opacity="0.3"/>`;
  const ap = pop(t, t0 + 0.15, 0.55);
  if (art && ap > 0) s += `<g transform="translate(1500 530) scale(${f1(ap * 1000) / 1000}) translate(-1500 -530)">${art(t)}</g>`;
  const X = 170, it = SETE[n];
  let size = 112;
  while (measure(it.titulo, `600 ${size}px Lora`) > 900 && size > 60) size -= 4;
  const top = 500;
  s += dot(X + 46, top - size - 64, n, pop(t, t0, 0.45) * 1.15);
  const p = E.out(prog(t, t0 + 0.1, t0 + 0.5));
  s += `<text x="${X}" y="${f1(top + (1 - p) * 26)}" font-family="Lora" font-weight="600" font-size="${size}" fill="${C.inkDeep}" opacity="${f1(p * 100) / 100}">${esc(it.titulo)}</text>`;
  const pr = E.out(prog(t, t0 + 0.35, t0 + 0.8)), yr = top + 78;
  s += label(X + 4, yr, it.ref, { anchor: 'start', fam: 'Geist Mono', w: 500, size: 36, fill: C.muted, op: pr });
  for (let k = 1; k <= 7; k++) {
    const x = X + 16 + (k - 1) * 46, y = yr + 76;
    if (k < n) s += `<circle cx="${x}" cy="${f1(y)}" r="14" fill="${C.ink}" opacity="${pr}"/>`;
    else if (k === n) s += `<circle cx="${x}" cy="${f1(y)}" r="${f1(16 * pop(t, t0 + 0.5, 0.4))}" fill="${C.b500}" stroke="${C.ink}" stroke-width="4"/>`;
    else s += `<circle cx="${x}" cy="${f1(y)}" r="12" fill="none" stroke="${C.border}" stroke-width="4" opacity="${pr}"/>`;
  }
  return s;
}
const cenaCartao = (n, t0, art) => (t) => ({ svg: cam(cartao(t, t0(), n, art), 960, 540, 1.0 + 0.03 * prog(t, t0(), t0() + 6)), html: '' });

// ---------------------------------------------------------------- os desenhos dos cartões (moldura em 1160..1840 × 260..800)
function artTrevas(t) {
  let g = `<rect x="1160" y="260" width="680" height="540" fill="url(#skyDawn)"/>`;
  g += `<circle cx="1680" cy="370" r="56" fill="#262B32" stroke="#4A515B" stroke-width="6"/>`; // o sol sem brilho
  g += hill(1500, 640, 470, '#14171B', '#060708');
  g += crossFig(1385, 668, 0.27, { fill: '#050505', rim: '#3A3F47', bow: 0.35 }) + crossFig(1615, 668, 0.27, { fill: '#050505', rim: '#3A3F47', bow: 0.35 });
  g += crossFig(1500, 652, 0.36, { fill: '#050505', rim: '#3A3F47', plaque: true });
  return MOLDURA('mTrevas', g, '#1E2530');
}
function artVeu() {
  let g = `<rect x="1160" y="260" width="680" height="540" fill="#1E1A17"/><circle cx="1500" cy="520" r="420" fill="url(#gAmber)" opacity="0.45"/>`;
  g += veil(1, 1300, 1700, 340, 770, { id: 'vM', querubins: 1, linho: true, metades: true, gapMax: 110, beamTo: 820 });
  return MOLDURA('mVeu', g, '#1E1A17');
}

// ================================================================ abertura (Mateus 27:51-52)
// Os sepulcros na encosta, na tarde escura. O da frente racha e se parte já no 1º quadro; os de trás rolam a
// pedra. Depois, só luz suave saindo das entradas: ninguém sai deles na sexta (Mateus 27:53).
const SEPS = [
  { x: 1080, base: 860, s: 1.25, id: 'sA' },
  { x: 350, base: 712, s: 0.6, id: 'sB' },
  { x: 1720, base: 718, s: 0.55, id: 'sC' },
];
const PEDRA_A = [SEPS[0].x - 9 * SEPS[0].s, SEPS[0].base - 111 * SEPS[0].s]; // centro da pedra do sepulcro da frente
function encosta(t, o = {}) {
  const tom = o.tom || 'escuro', ol = tom === 'escuro' ? NIGHT_OL : C.ink;
  let s = o.bg ?? bgTrevas(t, { glow: 0.12, gx: 1400 });
  s += `<path d="M -400 ${GROUND + 70} L -400 470 C 0 420 260 380 520 410 C 760 440 860 360 1100 350 C 1380 340 1560 420 1760 400 C 1900 390 2100 420 ${W + 400} 430 L ${W + 400} ${GROUND + 70} Z" fill="${o.ridge || '#2A2725'}" ${ink(6, ol)}/>`;
  const est = o.est || [];
  [1, 2, 0].forEach((i) => {
    const sp = SEPS[i], e = est[i] || {};
    s += sepulcro(sp.x, sp.base, sp.s, { tom, id: sp.id + (o.id || ''), ...e });
    if (e.luz > 0) s += motas(t, sp.x - 5 * sp.s, sp.base - 60 * sp.s, 200 * sp.s, 10, i + 3, e.luz);
  });
  if (o.q > 0) s += cascalho(t, SEPS[0].x, 760, SEPS[0].base - 420, SEPS[0].base, o.q, { seed: 51 });
  return s;
}
// "Túmulos se abriram na hora em que Jesus morreu. E Mateus diz que mortos foram ressuscitados."
// A câmera começa colada na pedra que racha e abre até mostrar os três sepulcros com luz.
function scAbertura(t) {
  const est = [
    { racha: E.out(prog(t, -0.3, 0.6)), parte: E.inOut(prog(t, 0.45, 1.8)), luz: E.inOut(prog(t, 1.4, 4.0)) },
    { rola: E.inOut(prog(t, 0.9, 2.5)), luz: E.inOut(prog(t, 2.4, 4.6)) },
    { rola: E.inOut(prog(t, 1.4, 3.0)), luz: E.inOut(prog(t, 2.9, 5.1)) },
  ];
  const q = lerp(1, 0.15, E.inOut(prog(t, fim(0) - 0.3, seg(1) + 0.6)));
  const k = E.inOut(prog(t, 0.6, 3.5)), push = E.inOut(prog(t, seg(1), fim(1) + 0.5));
  const fx = lerp(PEDRA_A[0], 960, k), fy = lerp(PEDRA_A[1], 600, k), sy = lerp(450, 600, k);
  const z = lerp(1.9, 1.04, k) + 0.08 * push;
  return { svg: camQ(encosta(t, { est, q, id: 'a' }), fx, fy, z, 960, sy, q, t), html: '' };
}

// A terra treme e as rochas se partem (Mateus 27:51): o Gólgota escuro ao fundo, uma rachadura corre pelo chão
// e duas rochas grandes se partem. k: tq (começa a tremer), tr (as rochas), q1 (para). Usado nas frases 2 e 26.
function terremoto(t, k, o = {}) {
  const q = prog(t, k.tq - 0.1, k.tq + 0.2) * (1 - prog(t, k.q1, k.q1 + 0.8));
  let s = bgTrevas(t, { glow: 0.08 }) + golgota(t, { dark: true, bow: 1 });
  s += racha(-80, W + 80, 792, E.out(prog(t, k.tq, k.tq + 1.1)), 7, { w: 13, amp: 34 });
  const id = o.id || 'r';
  s += rocha(430, 850, 1.25, E.out(prog(t, k.tr - 0.1, k.tr + 0.6)), id + 'A') + rocha(1500, 840, 1.05, E.out(prog(t, k.tr + 0.15, k.tr + 0.75)), id + 'B');
  s += cascalho(t, 960, 1800, 560, 880, q * 0.7, { seed: 61, n: 12 });
  return { svg: s, q };
}
// "No mesmo instante, a terra tremeu, e as rochas se partiram."
function scTerra(t) {
  const k = { tq: wordTime(2, 'tremeu') - 0.15, tr: wordTime(2, 'rochas') - 0.05, q1: fim(2) - 0.2 };
  const { svg, q } = terremoto(t, k, { id: 'r2' });
  const pre = 0.12 * (1 - prog(t, k.tq - 0.2, k.tq));
  return { svg: camQ(svg, 960, 600, 1.04 + 0.05 * E.inOut(prog(t, at(2), at(3))), 960, 600, Math.max(q, pre), t), html: '' };
}

// O santuário por dentro, na luz baixa: parede de pedra, chão, colunas e o candelabro aceso (Êxodo 25:31-37).
function menorah(x, y, s, t = 0, ol = C.ink) {
  let g = `<line x1="0" y1="0" x2="0" y2="-120" stroke="${C.a600}" stroke-width="9" stroke-linecap="round"/><rect x="-34" y="-6" width="68" height="14" rx="7" fill="${C.a400}" ${ink(4, ol)}/>`;
  for (let k = 1; k <= 3; k++) g += `<path d="M ${-k * 22} -120 L ${-k * 22} ${-120 + 28 + k * 12} Q ${-k * 22} ${-56 + k * 6} 0 ${-56 + k * 6} Q ${k * 22} ${-56 + k * 6} ${k * 22} ${-120 + 28 + k * 12} L ${k * 22} -120" fill="none" stroke="${C.a600}" stroke-width="7" stroke-linecap="round"/>`;
  for (let k = -3; k <= 3; k++) { const h = 24 + 4 * Math.sin(t * 9 + k * 1.7); g += `<path d="M ${k * 22} -124 q -7 ${f1(-h * 0.55)} 0 ${f1(-h)} q 7 ${f1(h * 0.45)} 0 ${f1(h)} Z" fill="${C.a300}"/>`; }
  return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-140" r="120" fill="url(#gAmber)" opacity="0.5"/>${g}</g>`;
}
function pilar(x, top, base, w = 96) {
  return rect(x - w / 2, top, w, base - top, '#4A3F36', ink(6, NIGHT_OL)) + rect(x + w * 0.14, top + 4, w * 0.3, base - top - 8, '#56493F') +
    rect(x - w / 2 - 18, top - 28, w + 36, 32, C.a600, `rx="6" ${ink(5, NIGHT_OL)}`) + rect(x - w / 2 - 18, base - 30, w + 36, 32, '#3A322B', `rx="6" ${ink(5, NIGHT_OL)}`);
}
function santuarioDentro(t, o = {}) {
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1E1A17"/>`;
  for (let r = 0; r < 14; r++) for (let c = 0; c < 13; c++) {
    const x = c * 180 - (r % 2) * 90 - 120, y = -60 + r * 70;
    s += `<rect x="${x + 4}" y="${y}" width="172" height="64" rx="8" fill="${(r * 7 + c * 3) % 5 ? '#2A241F' : '#2F2822'}" stroke="#120E0B" stroke-width="5"/>`;
  }
  s += floor('dusk', 0, 860);
  s += `<circle cx="960" cy="480" r="780" fill="url(#gAmber)" opacity="${f1((o.glow ?? 0.25) * 100) / 100}"/>`;
  return s;
}
// O véu de frente, grande, com as colunas e o candelabro. p: o rasgo (0..1); o: id, querubins, realce, glow.
const VEU = { X0: 500, X1: 1420, Y0: 122, Y1: 862 };
function veuCena(t, p, o = {}) {
  let s = santuarioDentro(t, { glow: (o.glow ?? 0.22) + 0.4 * p });
  s += menorah(220, 868, 1.55, t, NIGHT_OL);
  [VEU.X0 - 125, VEU.X1 + 125].forEach((x) => (s += pilar(x, 60, 872)));
  s += veil(p, VEU.X0, VEU.X1, VEU.Y0, VEU.Y1, { id: o.id || 'vv', querubins: o.querubins ?? 1, linho: true, fios: true, metades: true, realce: o.realce, beamTo: H + 80, gapMax: o.gapMax ?? 200 });
  return s;
}
// Poeira que cai do alto quando o pano começa a rasgar.
function poeiraAlto(t, t0, x, y, n = 10) {
  let g = '';
  const r = rng(91);
  for (let i = 0; i < n; i++) {
    const ph = clamp((t - t0 - r() * 0.5) / 1.4), dx = (r() - 0.5) * 260;
    if (ph <= 0 || ph >= 1) continue;
    g += `<circle cx="${f1(x + dx + ph * 20)}" cy="${f1(y + ph * ph * 520)}" r="${f1(3 + r() * 4)}" fill="#C9B79E" opacity="${f1((1 - ph) * 0.8 * 100) / 100}"/>`;
  }
  return g;
}
// "E, no templo, uma cortina se rasgou ao meio, de alto a baixo." A cena mais cuidada: o véu inteiro, com os
// querubins bordados; quando rasga, a câmera desce junto com a ponta do rasgo, do alto até embaixo.
function scVeuRasga(t) {
  const t0 = wordTime(3, 'rasgou') - 0.15, t1 = wordTime(3, 'baixo') + 0.35;
  const p = E.inOut(prog(t, t0, t1)), k1 = E.inOut(prog(t, t0 - 0.7, t0 + 0.1)), k2 = E.inOut(prog(t, t1 - 0.1, t1 + 0.9));
  const tip = lerp(VEU.Y0 + 150, VEU.Y1 - 170, p);
  const fy = lerp(lerp(500, tip, k1), 500, k2), sy = lerp(lerp(500, 430, k1), 500, k2);
  const z = lerp(lerp(1.04 + 0.03 * prog(t, at(3), t0), 1.6, k1), 1.03, k2);
  const q = 0.45 * prog(t, t0, t0 + 0.2) * (1 - prog(t, t1, t1 + 0.6));
  const s = veuCena(t, p, { id: 'v3' }) + poeiraAlto(t, t0, 960, VEU.Y0);
  return { svg: camQ(s, 960, fy, z, 960, sy, q, t), html: '' };
}

// "Separei sete coisas que os evangelhos contam daquela hora. E a última, só um deles conta."
// Sete marcas vazias; os quatro evangelhos embaixo; a sétima acende com uma interrogação.
const LIVROS = ['Mateus', 'Marcos', 'Lucas', 'João'];
function pilula(x, y, txt, o = {}) {
  const w = measure(txt, '700 40px Geist') + 64, on = o.on;
  return `<g opacity="${f1((o.op ?? 1) * 100) / 100}" transform="translate(${f1(x)} ${f1(y)}) scale(${f1((o.sc ?? 1) * 100) / 100})">
    <rect x="${f1(-w / 2)}" y="-34" width="${f1(w)}" height="76" rx="26" fill="${on ? C.b600 : C.border}"/>
    <rect x="${f1(-w / 2)}" y="-40" width="${f1(w)}" height="76" rx="26" fill="${on ? C.b500 : '#fff'}" stroke="${on ? C.b600 : C.border}" stroke-width="4"/>
    ${label(0, 12, txt, { size: 40, fill: on ? '#fff' : o.fill || C.ink })}</g>`;
}
function scSete(t) {
  const ts = wordTime(4, 'sete'), te = wordTime(4, 'evangelhos'), tu = wordTime(5, 'última');
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${C.paper}"/><circle cx="960" cy="420" r="760" fill="url(#gAmber)" opacity="0.24"/>`;
  s += crossFig(960, 900, 0.52, { fill: '#E6DED3', plaque: true }) + crossFig(760, 912, 0.4, { fill: '#ECE5DB' }) + crossFig(1160, 912, 0.4, { fill: '#ECE5DB' });
  for (let n = 1; n <= 7; n++) {
    const x = 960 + (n - 4) * 170, y = 360, p = pop(t, ts - 0.15 + (n - 1) * 0.09, 0.4);
    if (p <= 0) continue;
    const hl = n === 7 ? E.out(prog(t, tu - 0.2, tu + 0.3)) : 0, pulse = 1 + 0.12 * hl + 0.06 * hl * Math.sin(t * 5);
    s += `<g transform="translate(${x} ${y}) scale(${f1(p * pulse * 100) / 100})"><circle cy="8" r="46" fill="${hl > 0.5 ? C.b600 : C.border}"/><circle r="46" fill="#fff" stroke="${hl > 0.5 ? C.b500 : C.border}" stroke-width="${hl > 0.5 ? 8 : 6}"/>`;
    s += hl > 0.5 ? label(0, 17, '?', { size: 52, w: 800, fill: C.b500 }) : label(0, 16, n, { size: 44, w: 800, fill: C.g400 });
    s += `</g>`;
  }
  LIVROS.forEach((b, i) => { const p = pop(t, te - 0.1 + i * 0.12, 0.4); if (p > 0) s += pilula(960 + (i - 1.5) * 250, 560, b, { sc: p }); });
  return { svg: cam(s, 960, 500, 1.0 + 0.04 * prog(t, depois(3), at(6))), html: '' };
}

// ================================================================ 1. as trevas (Mateus 27:45-50)
const scCartao1 = cenaCartao(1, () => at(6), artTrevas);
// "Do meio-dia às três da tarde, houve trevas sobre toda a terra." O sol alto e o escuro que cai.
const trevasSpan = () => [wordTime(7, 'trevas') - 0.5, fim(7) + 0.2];
function scTrevas(t) {
  const [d0, d1] = trevasSpan(), d = E.inOut(prog(t, d0, d1));
  let s = bgGloom(t, { seed: 1021 }) + `<g opacity="${f1((1 - d) * 100) / 100}">${sun(1420, 170, 60, t)}</g>` + golgota(t);
  if (d > 0) s += `<g opacity="${f1(d * 100) / 100}">${bgTrevas(t)}${golgota(t, { dark: true })}</g>`;
  return { svg: cam(s, 960, 430, 1.0 + 0.05 * prog(t, at(7), at(8))), html: '' };
}
// "Lucas diz que o sol deixou de brilhar. Três horas de escuro, no meio do dia."
// De perto, o sol perde o brilho; depois a câmera desce até as cruzes no escuro, com o sol apagado no alto.
function scSol(t) {
  const f = E.inOut(prog(t, wordTime(8, 'deixou') - 0.2, fim(8) + 0.2));
  const k = E.inOut(prog(t, seg(9) - 0.3, seg(9) + 1.7));
  const SX = 1380, SY = 220;
  let s = `<rect x="-600" y="-600" width="${W + 1200}" height="${H + 1200}" fill="url(#skyDawn)"/>`;
  s += `<circle cx="${SX}" cy="${SY}" r="${f1(520 - 200 * f)}" fill="url(#gAmber)" opacity="${f1((0.85 * (1 - f)) * 100) / 100}"/>`;
  s += `<circle cx="${SX}" cy="${SY}" r="${f1(170 - 30 * f)}" fill="${C.a300}" opacity="${f1(0.3 * (1 - f) * 100) / 100}"/>`;
  s += `<circle cx="${SX}" cy="${SY}" r="110" fill="${f > 0.5 ? '#262B32' : C.a300}" stroke="${f > 0.5 ? '#4A515B' : 'none'}" stroke-width="7" opacity="${f1((1 - 0.5 * Math.sin(Math.PI * f)) * 100) / 100}"/>`;
  s += hills(GROUND - 120, 80, 0.0032, 7, '#1F2428') + hills(GROUND - 50, 55, 0.0055, 9, '#191D21') + floor('night');
  s += golgota(t, { dark: true });
  const fx = lerp(SX, 960, k), fy = lerp(SY, 520, k), sy = lerp(420, 520, k), z = lerp(2.1, 1.04, k) + 0.04 * prog(t, seg(9) + 1.7, at(10));
  return { svg: cam(s, fx, fy, z, 960 - fx, sy - fy), html: '' };
}
// "Por volta das três, Jesus bradou em alta voz: Meu Deus! Meu Deus! Por que me abandonaste?"
function scBradou(t) {
  let s = cruzPerto(t, { light: 0.08 });
  const hy = 905 - 442 * 1.5;
  s += anel(960, hy, t, wordTime(10, 'bradou')) + anel(960, hy, t, wordTime(10, 'meu')) + anel(960, hy, t, wordTime(10, 'abandonaste') - 0.2);
  return { svg: cam(s, 960, 420, 1.0 + 0.08 * prog(t, at(10), at(11))), html: '' };
}
// "Alguns acharam que ele estava chamando Elias." (Mateus 27:47)
function scElias(t) {
  const te = wordTime(11, 'elias'), up = E.out(prog(t, te - 0.5, te));
  let s = bgTrevas(t, { glow: 0.1, gx: 1250 }) + hill(1250, 620, 1100, '#1B1E22', '#060708') + crossFig(1250, 640, 0.8, { plaque: true, fill: '#050505', rim: RIM, bow: 0.2 });
  s += person({ ...povo(1031), x: 420, y: FLOOR_Y, s: 1.25, look: 1, mood: 'calm', armR: lerp(30, 160, up), rim: RIM });
  s += person({ ...povo(1032), x: 640, y: FLOOR_Y, s: 1.25, look: -1, mood: 'calm', armL: 20, armR: lerp(20, 60, up), rim: RIM });
  s += person({ ...povo(1033, { cover: C.g300 }), x: 860, y: FLOOR_Y, s: 1.25, look: 1, mood: 'sad', rim: RIM });
  return { svg: cam(s, 900, 540, 1.03 + 0.05 * prog(t, at(11), at(12))), html: '' };
}
// "Um deles correu, molhou uma esponja em vinagre e deu pra ele beber." (Mateus 27:48: uma esponja na ponta de
// uma vara). Ele corre até o jarro, molha a esponja e ergue a vara até perto do rosto.
function scEsponja(t) {
  const tc = wordTime(12, 'correu'), tm = wordTime(12, 'molhou'), td = wordTime(12, 'deu');
  const run = E.inOut(prog(t, tc - 0.5, tm - 0.15)), dip = E.inOut(prog(t, tm - 0.1, tm + 0.5)), lift = E.inOut(prog(t, td - 0.15, td + 0.9));
  const CX = 1290, CB = 640, CS = 0.8;
  let s = bgTrevas(t, { glow: 0.1, gx: 1250 }) + hill(1250, 620, 1100, '#1B1E22', '#060708');
  s += crossFig(CX, CB, CS, { plaque: true, fill: '#050505', rim: RIM, bow: 0.2 });
  [[150, 1032], [330, 1033]].forEach(([x, seed]) => (s += person({ ...povo(seed), x, y: 846, s: 1.0, look: 1, mood: 'calm', rim: RIM, noShadow: true })));
  const JAR = [1110, 880];
  const x = lerp(160, 760, run), moving = run > 0 && run < 1;
  const armR = lift > 0 ? lerp(62, 150, lift) : moving || run < 1 ? 105 : lerp(105, 62, dip);
  const P = { ...povo(1231), x, y: FLOOR_Y, s: 1.3, look: 1, mood: 'calm', walk: moving ? t * 9 : null, armR, armL: moving ? 30 + 20 * Math.sin(t * 9) : 16, rim: RIM };
  const [hx, hy] = mao(P, 1);
  const carry = [hx + 210, hy - 230], noJarro = [JAR[0], JAR[1] - 76 + 10 * Math.sin(Math.PI * prog(t, tm + 0.3, tm + 1.0))];
  const rosto = [CX - 26, CB - 432 * CS + 18];
  const tip = lift > 0 ? [lerp(noJarro[0], rosto[0], lift), lerp(noJarro[1], rosto[1], lift)] : [lerp(carry[0], noJarro[0], dip), lerp(carry[1], noJarro[1], dip)];
  const dx = tip[0] - hx, dy = tip[1] - hy, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, butt = [tip[0] - ux * 520, tip[1] - uy * 520];
  const vara = `<line x1="${f1(butt[0])}" y1="${f1(butt[1])}" x2="${f1(tip[0])}" y2="${f1(tip[1])}" stroke="#060708" stroke-width="14" stroke-linecap="round"/><line x1="${f1(butt[0])}" y1="${f1(butt[1])}" x2="${f1(tip[0])}" y2="${f1(tip[1])}" stroke="#7A6A4A" stroke-width="7" stroke-linecap="round"/>`;
  const molhada = t > tm;
  const esponja = `<ellipse cx="${f1(tip[0])}" cy="${f1(tip[1])}" rx="19" ry="15" fill="${molhada ? '#8C7A55' : '#C9B48A'}" stroke="#060708" stroke-width="5"/>`;
  // enquanto a esponja está no jarro, o jarro vai na frente dela
  const dentro = dip > 0.5 && lift < 0.15;
  s += (dentro ? '' : jar(JAR[0], JAR[1], 1.4)) + person(P) + vara + esponja + (dentro ? jar(JAR[0], JAR[1], 1.4) : '');
  const cxm = lerp(700, 960, lift), z = 1.06 - 0.03 * lift;
  return { svg: cam(s, cxm, 560, z, 960 - cxm, 0), html: '' };
}
// "E Jesus, com um alto brado, entregou o espírito." (Mateus 27:50) A cabeça se inclina.
function scEntregou(t) {
  const tb = wordTime(13, 'brado'), te = wordTime(13, 'entregou'), bow = E.inOut(prog(t, te - 0.2, te + 0.8));
  const light = 0.08 + 0.3 * E.out(prog(t, tb - 0.3, tb + 0.6)) * (1 - 0.8 * bow);
  let s = bgDark(t) + `<circle cx="960" cy="240" r="520" fill="url(#gWhite)" opacity="${f1(light * 100) / 100}"/>`;
  s += hill(960, 880, 1300, '#1B1E22', '#060708') + crossFig(960, 905, 1.5, { plaque: true, fill: '#050505', rim: RIM, bow });
  s += anel(960, 905 - 442 * 1.5, t, tb - 0.1);
  return { svg: cam(s, 960, 400, 1.0 + 0.06 * prog(t, antes(13), at(14))), html: '' };
}

// ================================================================ 2. o véu (Mateus 27:51; Êxodo 26:33; 2 Crônicas 3:14; Hebreus 9:7; 10:19-20)
const scCartao2 = cenaCartao(2, () => at(14), artVeu);
// Seta da direção do rasgo ("de alto a baixo"), desenhada de cima para baixo pelo meio do rasgo.
function seta(x, y0, y1, a) {
  if (a <= 0) return '';
  const y = lerp(y0, y1, a);
  let g = `<line x1="${x}" y1="${y0}" x2="${x}" y2="${f1(y - 24)}" stroke="${C.ink}" stroke-width="28" stroke-linecap="round"/><line x1="${x}" y1="${y0}" x2="${x}" y2="${f1(y - 24)}" stroke="${C.b500}" stroke-width="14" stroke-linecap="round"/>`;
  g += `<path d="M ${x - 40} ${f1(y - 50)} L ${x} ${f1(y + 8)} L ${x + 40} ${f1(y - 50)} Z" fill="${C.b500}" ${ink(7)}/>`;
  return g;
}
// "Naquele momento, o véu do santuário se rasgou em duas partes. E o texto faz questão de dizer a direção: de
// alto a baixo." O véu inteiro rasga; na frase seguinte, uma seta desce pelo rasgo, do alto até embaixo.
function scDirecao(t) {
  const t0 = wordTime(15, 'rasgou') - 0.15, t1 = fim(15) + 0.3;
  const p = E.inOut(prog(t, t0, t1)), q = 0.4 * prog(t, t0, t0 + 0.2) * (1 - prog(t, t1, t1 + 0.6));
  const a = E.inOut(prog(t, wordTime(16, 'alto') - 0.25, wordTime(16, 'baixo') + 0.25));
  let s = veuCena(t, p, { id: 'v15' }) + poeiraAlto(t, t0, 960, VEU.Y0);
  s += seta(960, VEU.Y0 + 40, VEU.Y1 - 40, a);
  return { svg: camQ(s, 960, 500, 1.03 + 0.04 * prog(t, antes(15), depois(16)), 960, 500, q, t), html: '' };
}
// "Mas que véu era esse?" O santuário do templo por fora; a câmera vai até a porta.
function templo(t) {
  let s = bgDay(t, { sunX: 1600, sunY: 170, seed: 811 });
  // a esplanada e os degraus
  s += rect(160, 700, 1600, 60, C.g300, ink(6)) + rect(260, 760, 1400, 40, C.g400, ink(6)) + rect(360, 800, 1200, 40, C.g300, ink(6));
  // o santuário: corpo, a fachada mais larga em cima e o friso de ouro
  s += rect(620, 300, 680, 400, C.g100, ink(6)) + rect(1080, 303, 217, 394, C.g300);
  s += rect(520, 190, 880, 140, C.g100, ink(6)) + rect(1200, 193, 197, 134, C.g300);
  s += rect(505, 172, 910, 26, C.a400, `rx="6" ${ink(5)}`) + rect(520, 326, 880, 14, C.a400, ink(4));
  [690, 780, 1140, 1230].forEach((x) => (s += `<line x1="${x}" y1="360" x2="${x}" y2="690" stroke="${C.g300}" stroke-width="10"/>`));
  // a porta alta (escura), com o batente de ouro
  s += `<path d="M 870 700 L 870 450 C 870 380 1050 380 1050 450 L 1050 700 Z" fill="${C.g800}" ${ink(6)}/><path d="M 870 700 L 870 450 C 870 380 1050 380 1050 450 L 1050 700" fill="none" stroke="${C.a400}" stroke-width="10"/>`;
  // os pórticos do pátio, baixos, dos dois lados
  [[180, 520], [1400, 1740]].forEach(([x0, x1]) => {
    s += rect(x0 - 20, 560, x1 - x0 + 40, 26, C.g300, ink(5));
    for (let x = x0; x <= x1; x += 85) s += rect(x - 16, 586, 32, 114, C.g100, ink(5));
  });
  return s;
}
function scTemplo(t) {
  const k = E.inOut(prog(t, depois(16), antes(18) + 0.2));
  return { svg: cam(templo(t), 960, lerp(560, 560, k), lerp(1.0, 1.6, k), 0, lerp(0, -20, k)), html: '' };
}

// O santuário em corte (Êxodo 26:33; Hebreus 9:2-7): o Lugar Santo, com o candelabro, a mesa dos pães e o altar
// do incenso; a cortina; e o Lugar Santíssimo, vazio e escuro. A parede da frente está cortada para ver dentro.
// o.rasgo (0..1) abre a cortina de alto a baixo e a luz passa para o Lugar Santo; o.rot: [Santo, Santíssimo]
// (0..1); o.pulso: realce da cortina; o.id: prefixo dos recortes.
const T_ = { x0: 250, x1: 1670, top: 250, fl: 800, vx: 1150, vw: 46 };
function cortinaCorte(x, y0, y1, w, rasgo, pulso, id) {
  const yf = lerp(y0, y1 + 20, rasgo), d = (y) => (y >= yf ? 0 : 44 * rasgo * Math.pow((yf - y) / Math.max(1, yf - y0), 0.8));
  let pano = rect(x - 40, y0, w + 80, y1 - y0, C.b500);
  for (let xx = x + 8; xx < x + w; xx += 15) pano += `<line x1="${xx}" y1="${y0}" x2="${xx}" y2="${y1}" stroke="${C.b600}" stroke-width="4"/>`;
  [[y0 + 24, '#5B3F7A'], [y0 + 46, C.r600], [y0 + 70, '#F1E8D6'], [y1 - 82, '#F1E8D6'], [y1 - 64, C.r600], [y1 - 42, '#5B3F7A']].forEach(([y, c]) => (pano += rect(x - 40, y, w + 80, c === '#F1E8D6' ? 8 : 16, c)));
  let s = '';
  if (pulso > 0) s += `<rect x="${x - 14}" y="${y0 - 6}" width="${w + 28}" height="${y1 - y0 + 12}" rx="10" fill="none" stroke="${C.b300}" stroke-width="${f1(16 * pulso)}" opacity="${f1(pulso * 100) / 100}"/>`;
  const N = 24, ys = []; for (let k = 0; k <= N; k++) ys.push(y0 + ((y1 - y0) * k) / N);
  const half = (side) => {
    const out = ys.map((y) => `${f1(side < 0 ? x - d(y) * 0.5 : x + w + d(y) * 0.5)} ${f1(y)}`);
    const inn = ys.slice().reverse().map((y) => `${f1(x + w / 2 + side * d(y))} ${f1(y)}`);
    return `M ${out.join(' L ')} L ${inn.join(' L ')} Z`;
  };
  [-1, 1].forEach((side) => (s += `<clipPath id="${id}${side}"><path d="${half(side)}"/></clipPath><g clip-path="url(#${id}${side})">${pano}</g><path d="${half(side)}" fill="none" ${ink(5)}/>`));
  s += rect(x - 18, y0 - 12, w + 36, 14, C.a400, `rx="7" ${ink(4)}`);
  return s;
}
function altarIncenso(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})">${rect(-34, -96, 68, 96, C.a400, ink(5))}${rect(-44, -108, 88, 16, C.a600, `rx="5" ${ink(4)}`)}<path d="M -6 -112 q -10 -24 2 -44 q 6 18 -2 44 Z" fill="${C.g300}" opacity="0.8"/></g>`;
}
function corte(t, o = {}) {
  const rasgo = o.rasgo || 0, luz = o.luz || 0, rot = o.rot || [1, 1], id = o.id || 'ct';
  let s = bgGloom(t, { seed: 811 });
  s += rect(-600, T_.fl, W + 1200, H - T_.fl + 600, C.g300) + `<line x1="-600" y1="${T_.fl}" x2="${W + 600}" y2="${T_.fl}" stroke="${C.ink}" stroke-width="6"/>`;
  s += rect(T_.x0 - 30, T_.top - 40, T_.x1 - T_.x0 + 60, 40, C.g400, ink(7)) + rect(T_.x0, T_.top, T_.x1 - T_.x0, T_.fl - T_.top, C.g200, ink(7));
  // Lugar Santo
  s += rect(T_.x0 + 30, T_.top + 30, T_.vx - T_.x0 - 30, T_.fl - T_.top - 30, '#EFE6DA', ink(5));
  s += menorah(450, T_.fl, 1.15, t) + rect(640, T_.fl - 70, 180, 22, C.wood, `rx="6" ${ink(5)}`) + rect(660, T_.fl - 48, 14, 48, C.wood, ink(4)) + rect(786, T_.fl - 48, 14, 48, C.wood, ink(4));
  for (let k = 0; k < 6; k++) s += `<ellipse cx="${670 + (k % 3) * 52}" cy="${T_.fl - 80 - Math.floor(k / 3) * 14}" rx="24" ry="9" fill="${C.p300}" ${ink(3)}/>`;
  s += altarIncenso(980, T_.fl, 1.0);
  // Lugar Santíssimo: vazio e escuro; a luz só aparece quando a cortina rasga
  const ix0 = T_.vx + T_.vw, ix1 = T_.x1 - 30;
  s += rect(ix0, T_.top + 30, ix1 - ix0, T_.fl - T_.top - 30, '#2A2622', ink(5));
  if (luz > 0) {
    s += `<clipPath id="${id}S"><rect x="${ix0}" y="${T_.top + 30}" width="${ix1 - ix0}" height="${T_.fl - T_.top - 30}"/></clipPath><g clip-path="url(#${id}S)"><circle cx="${(ix0 + ix1) / 2}" cy="${(T_.top + T_.fl) / 2}" r="${f1(200 + 260 * luz)}" fill="url(#gAmber)" opacity="${f1(0.9 * luz * 100) / 100}"/></g>`;
    s += `<path d="M ${T_.vx + 20} ${T_.top + 40} L ${T_.vx + 20} ${T_.fl} L ${T_.x0 + 30} ${T_.fl} L ${T_.x0 + 30} ${f1(T_.fl - 330 * luz)} Z" fill="#FFF3D6" opacity="${f1(0.5 * luz * 100) / 100}"/>`;
  }
  s += cortinaCorte(T_.vx, T_.top + 30, T_.fl, T_.vw, rasgo, o.pulso || 0, id + 'c');
  // a porta, à esquerda
  s += rect(T_.x0 - 8, T_.fl - 250, 46, 250, '#3A3330', ink(5));
  const lab = (x, txt, col, p) => (p > 0 ? `<g opacity="${f1(clamp(p) * 100) / 100}" transform="translate(0 ${f1((1 - clamp(p)) * 14)})">${label(x, T_.top + 96, txt, { size: 40, fill: col })}</g>` : '');
  s += lab((T_.x0 + T_.vx) / 2 + 15, 'Lugar Santo', C.g700, rot[0]) + lab((ix0 + ix1) / 2, 'Lugar Santíssimo', '#F4EBDD', rot[1]);
  return s;
}
// O sumo sacerdote: peitoral com as pedras, a lâmina de ouro no turbante e a bacia na mão direita, fechada,
// sem nada à vista. o.brilho: um reflexo na bacia; o.bacia: false para sair sem ela.
function sumoSacerdote(o) {
  const s = o.s || 1, P = { ...SUMO, armL: 14, armR: 40, mood: 'calm', ...o, op: 1 };
  let g = person(P);
  const pedras = [C.r400, C.a400, C.gr400, C.b300, C.p300, C.r300];
  let peito = rect(-20, -160, 40, 42, C.a400, `rx="5" ${ink(4)}`);
  for (let k = 0; k < 12; k++) peito += `<circle cx="${-11 + (k % 3) * 11}" cy="${-152 + Math.floor(k / 3) * 9}" r="3.4" fill="${pedras[k % 6]}"/>`;
  if (!o.walk) g += `<g transform="translate(${f1(o.x)} ${f1(o.y)}) scale(${f1(s * 1000) / 1000})">${peito}${rect(-16, -242, 32, 12, C.a400, `rx="4" ${ink(3)}`)}</g>`;
  else g += `<g transform="translate(${f1(o.x)} ${f1(o.y)}) scale(${f1(s * 1000) / 1000})">${peito}${rect(-16, -242, 32, 12, C.a400, `rx="4" ${ink(3)}`)}</g>`;
  if (o.bacia !== false) {
    const [hx, hy] = mao(P, 1), k = s;
    g += `<path d="M ${f1(hx - 30 * k)} ${f1(hy - 16 * k)} L ${f1(hx + 30 * k)} ${f1(hy - 16 * k)} Q ${f1(hx + 26 * k)} ${f1(hy + 14 * k)} ${f1(hx)} ${f1(hy + 14 * k)} Q ${f1(hx - 26 * k)} ${f1(hy + 14 * k)} ${f1(hx - 30 * k)} ${f1(hy - 16 * k)} Z" fill="${C.a400}" ${ink(4)}/>`;
    g += `<ellipse cx="${f1(hx)}" cy="${f1(hy - 16 * k)}" rx="${f1(30 * k)}" ry="${f1(6 * k)}" fill="${C.a600}" ${ink(3)}/>`;
    if (o.brilho > 0) g += `<circle cx="${f1(hx)}" cy="${f1(hy - 4 * k)}" r="${f1(70 * k)}" fill="url(#gAmber)" opacity="${f1(o.brilho * 0.9 * 100) / 100}"/><path d="M ${f1(hx - 14 * k)} ${f1(hy - 2 * k)} q 8 ${f1(10 * k)} ${f1(22 * k)} ${f1(4 * k)}" stroke="#FFF6DF" stroke-width="${f1(4 * k)}" fill="none" stroke-linecap="round" opacity="${f1(o.brilho * 100) / 100}"/>`;
  }
  return opg(o.op ?? 1, g);
}
// "No templo, essa cortina separava o Lugar Santo do Lugar Santíssimo." (Êxodo 26:33)
function scCorte(t) {
  const rot = [E.out(prog(t, wordTime(18, 'santo') - 0.3, wordTime(18, 'santo') + 0.2)), E.out(prog(t, wordTime(18, 'santíssimo') - 0.3, wordTime(18, 'santíssimo') + 0.2))];
  const pulso = bump(t, wordTime(18, 'cortina') - 0.2, 1.2);
  return { svg: cam(corte(t, { rot, pulso, id: 'c18' }), 960, 540, 1.02 + 0.04 * prog(t, antes(18), at(19))), html: '' };
}
// "Desde Salomão, ela era feita de azul, roxo, vermelho e linho fino, com querubins desenhados." (2 Crônicas 3:14)
// O véu de perto: cada cor acende quando a voz fala dela, e os querubins vão sendo bordados.
function scCores(t) {
  const w = (word) => wordTime(19, word) - 0.12;
  const realce = { azul: bump(t, w('azul'), 0.8), roxo: bump(t, w('roxo'), 0.8), vermelho: bump(t, w('vermelho'), 0.8), linho: bump(t, w('linho'), 1.0) };
  const qp = prog(t, w('querubins') - 0.1, fim(19) + 0.3);
  const s = veuCena(t, 0, { id: 'v19', querubins: qp, realce });
  return { svg: cam(s, 960, 470, 1.22 - 0.08 * E.inOut(prog(t, at(19), depois(19))), 0, 20), html: '' };
}
// "E só uma pessoa podia passar pra lá: o sumo sacerdote. Uma vez por ano. E nunca sem levar o sangue do
// sacrifício. Naquela tarde, a cortina se rasgou." (Hebreus 9:7; Mateus 27:51) Os sacerdotes ficam no Lugar
// Santo; só o sumo sacerdote vai até a cortina, com a bacia. Na frase 23 ele some (era outro tempo) e a cortina
// rasga de alto a baixo naquela tarde.
const sumoX = (t) => lerp(170, 1060, E.inOut(prog(t, seg(20) + 0.2, fim(20) - 0.1)));
function scSumo(t) {
  const px = sumoX(t), anda = px > 172 && px < 1058;
  const sai = prog(t, seg(23) - 0.2, seg(23) + 0.6);
  const tr = wordTime(23, 'se') - 0.1, rasgo = E.inOut(prog(t, tr, tr + 0.75)), luz = E.out(prog(t, tr + 0.25, tr + 1.1));
  let s = corte(t, { rot: [1, 1], rasgo, luz, id: 'c20' });
  const brilho = bump(t, wordTime(22, 'sangue') - 0.3, 1.4);
  // os outros sacerdotes param no Lugar Santo e olham ele passar
  [[560, 1601], [830, 1602]].forEach(([x, seed]) => (s += person({ ...sacerdote(seed), x, y: T_.fl, s: 0.92, look: px > x ? 1 : -1, mood: 'calm', op: 1 - sai })));
  s += sumoSacerdote({ x: px, y: T_.fl + 14, s: 1.0, look: 1, walk: anda ? t * 6 : null, armR: lerp(40, 62, brilho), brilho, op: 1 - sai });
  // câmera: geral; segue o sacerdote; chega perto da bacia; abre de novo para o rasgo
  const segue = E.inOut(prog(t, seg(20), seg(20) + 0.8)), perto = E.inOut(prog(t, seg(22) - 0.4, seg(22) + 0.4)), abre = E.inOut(prog(t, seg(23) - 0.1, seg(23) + 1.0));
  const fx = lerp(lerp(960, clamp(px, 560, 1040), segue), 1060, perto * (1 - abre)), fxa = lerp(fx, 960, abre);
  const z = lerp(lerp(1.0, 1.25, segue) + 0.25 * perto, 1.02, abre);
  return { svg: cam(s, fxa, 640, z, 960 - fxa, lerp(-40, 0, abre) * segue), html: '' };
}
// "Anos depois, a carta aos Hebreus explica o que isso quer dizer: temos plena confiança para entrar no Santo
// dos Santos pelo sangue de Jesus, por um novo e vivo caminho que ele nos abriu por meio do véu, isto é, do seu
// corpo." O cartão com Hebreus 10:19-20 (NVI): cada bloco acende quando a voz chega nele.
const HEB = [['…temos plena confiança para entrar', 2], ['no Santo dos Santos pelo sangue de', 3], ['Jesus, por um novo e vivo caminho', 4], ['que ele nos abriu por meio do véu,', 5], ['isto é, do seu corpo.', 6]];
function scHebreus(t) {
  const sp = SEGS[24][3], a0 = antes(24), p = E.out(prog(t, a0 + 0.1, a0 + 0.6));
  const txt = HEB.map(([w, k]) => {
    const on = E.out(prog(t, sp[k][0] - 0.15, sp[k][0] + 0.25)), h = prog(t, sp[k][0], sp[k][1]);
    return `<span style="opacity:${f1((0.22 + 0.78 * on) * 100) / 100}">${hlWords(w, h)}</span>`;
  }).join('');
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${C.paper}"/><circle cx="960" cy="480" r="820" fill="url(#gAmber)" opacity="0.22"/>`;
  return { svg: s, html: verseCard(txt, 'Hebreus 10:19-20', f1(p * 100) / 100, 'big') };
}
// "O lugar onde só o sumo sacerdote entrava, uma vez por ano." O véu aberto e a luz; o sumo sacerdote, de antes,
// some aos poucos diante dele.
function scLugar(t) {
  const mem = 1 - prog(t, seg(25) + 0.6, fim(25) + 0.3);
  let s = veuCena(t, 1, { id: 'v25', glow: 0.3 });
  s += sumoSacerdote({ x: 690, y: 900, s: 1.25, look: 1, op: 0.85 * mem });
  return { svg: cam(s, 960, 500, 1.02 + 0.1 * E.inOut(prog(t, at(25), depois(25)))), html: '' };
}

// ================================================================ linha do tempo
const SCENES = [
  // abertura
  { a: 0, b: at(2), f: scAbertura, ref: 'Mateus 27:52', dark: true },
  { a: at(2), b: at(3), f: scTerra, ref: 'Mateus 27:51', dark: true },
  { a: at(3), b: depois(3), f: scVeuRasga, ref: null, dark: true },
  { a: depois(3), b: at(6), f: scSete, ref: null },
  // 1. as trevas
  { a: at(6), b: at(7), f: scCartao1, ref: null },
  { a: at(7), b: at(8), f: scTrevas, ref: 'Mateus 27:45', dark: (t) => t > (trevasSpan()[0] + trevasSpan()[1]) / 2 },
  { a: at(8), b: at(10), f: scSol, ref: 'Lucas 23:45', dark: true },
  { a: at(10), b: at(11), f: scBradou, ref: 'Mateus 27:46', dark: true },
  { a: at(11), b: at(12), f: scElias, ref: 'Mateus 27:47', dark: true },
  { a: at(12), b: antes(13), f: scEsponja, ref: 'Mateus 27:48', dark: true },
  { a: antes(13), b: at(14), f: scEntregou, ref: 'Mateus 27:50', dark: true },
  // 2. o véu
  { a: at(14), b: antes(15), f: scCartao2, ref: null },
  { a: antes(15), b: depois(16), f: scDirecao, ref: 'Mateus 27:51', dark: true },
  { a: depois(16), b: antes(18), f: scTemplo, ref: null },
  { a: antes(18), b: at(19), f: scCorte, ref: 'Êxodo 26:33' },
  { a: at(19), b: depois(19), f: scCores, ref: '2 Crônicas 3:14', dark: true },
  { a: depois(19), b: antes(24), f: scSumo, ref: [[depois(19), 'Hebreus 9:7'], [at(23), 'Mateus 27:51']] },
  { a: antes(24), b: at(25), f: scHebreus, ref: null },
  { a: at(25), b: depois(25), f: scLugar, ref: null, dark: true },
];
