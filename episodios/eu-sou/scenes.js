// Os sete "Eu sou" de Jesus (João 6, 8, 9, 10, 11, 14, 15 e 18; Êxodo 3:14). Vídeo longo, 1920×1080.
// L(parte, linha) é o índice da frase em SEGS (as partes do roteiro.md). Cada cena começa em at(i) ou wordTime.
// Mesmo traço e mesma câmera do longo do Pedro (pedro-voce-me-ama); Jesus antes da cruz, com a roupa clara (JESUS).
// Fidelidade (roteiro com 5 revisões):
// - Deus não aparece em figura nenhuma: a sarça é só o arbusto em chamas que não se consome, com Moisés diante dela.
// - No olival, os soldados recuam e caem para trás e Jesus fica de pé, calmo, sem raio, brilho nem efeito saindo
//   dele: o texto não explica por quê (João 18:6), e a imagem não explica no lugar dele.
// - No templo, Jesus se esconde e sai, sem milagre na imagem (João 8:59).
// - Marta encontra Jesus na estrada, antes do povoado (João 11:20, 30); o túmulo só aparece quando ele chega lá.
// - Lázaro sai com as mãos e os pés envolvidos em faixas de linho e o rosto envolto num pano (João 11:44).
// - O cego: Jesus cospe no chão, faz lama e passa nos olhos; ele se lava no tanque de Siloé e volta vendo (João 9:6-7).
// Cada um dos sete tem um cartão (cena inteira) com a frase, o número da lista e a referência.
// As frases 60 a 63 são as aberturas próprias dos curtos, gravadas depois da fala do longo (o longo não as usa):
// as cenas delas entram secas (cut: true), para o 1º quadro de cada curto não trazer a cena vizinha por baixo.

const L = (part, line) => PARTS[part - 1] + line;
const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];
const FLOOR_Y = 880; // pés dos personagens em primeiro plano (a legenda começa em ~920)
const NIGHT_OL = '#0E0D0C';
const CURTO = typeof RECORTE !== 'undefined' && RECORTE; // no curto vertical, o cartão sai sem o número da lista

const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const PEDRO = { robe: C.p500, skin: '#C68B59', hair: '#5A3A28', beard: true, cover: null };
const JOAO = { ...man(1002), robe: C.g600, beard: false, hair: '#3A2A20', cover: null, skin: '#C68B59' };
const TOME = { ...man(1103), robe: C.oliveDk, beard: true, cover: null, hair: '#191919', skin: '#A86B3C' };
const DISC = [JOAO, PEDRO, TOME, { ...man(1243), robe: C.p600, beard: true, cover: null }, { ...man(1244), robe: C.ch300, beard: true, cover: null }, { ...man(1246), robe: '#7B6A55', beard: true, cover: null }];
// Povo (multidão, ouvintes, quem está de luto): roupa em meio-tom, para Jesus, o único de roupa clara e sem véu, se destacar.
const TONS = [C.g600, C.p400, C.ch300, C.oliveDk, '#7B6A55', C.p600, '#9C8F70', C.g700, '#B9897A', '#8C7A62'];
const povo = (seed, extra = {}) => { const r = rng(seed * 31 + 7); return { ...man(seed), robe: pick(r, TONS), ...extra }; };
const lider = (seed, extra = {}) => ({ ...man(seed), cover: COVERS[seed % 4], beard: true, ...extra });
const LIDERES = [lider(3101, { robe: C.ch300 }), lider(3102, { robe: '#5B3F7A' }), lider(3103, { robe: C.g700 }), lider(3104, { robe: C.p600, cover: C.g300 })];
const mulher = (seed, extra = {}) => ({ ...povo(seed), beard: false, cover: ['#E2D8CF', C.g300, '#C9BBAE', C.g100][seed % 4], ...extra });
const MARTA = { ...mulher(3301), robe: C.r400, cover: '#E2D8CF', skin: '#C68B59' };
const MARIA = { ...mulher(3302), robe: C.g500, cover: C.g300, skin: '#A86B3C' };
const CEGO = { ...man(3201), robe: '#C9BBAE', cover: null, beard: true, hair: '#191919', skin: '#A86B3C' };
const LAZARO = { robe: '#F4F1EC', skin: '#C68B59', hair: '#3A2A20', beard: true, cover: null };
const JUDAS = { ...man(872), robe: '#7B6A55', beard: true, cover: null };
const MOISES = { robe: '#8C6A4A', skin: '#C68B59', hair: C.g400, beard: true, cover: C.g300 };
const LEITOR = { ...man(1401), robe: C.b500, cover: null, beard: true, skin: '#C68B59', hair: '#2F2622' };
const soldado = (seed) => ({ ...man(seed), cover: null, beard: false, robe: C.p600, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26 });
const guarda = (seed) => ({ ...man(seed), cover: C.g700, beard: true, robe: C.ch300, gear: { sword: 'r' }, armR: 30 });

// ---------------------------------------------------------------- utilidades (as mesmas do longo do Pedro)
const SOMBRA_BAIXO = `<linearGradient id="gBaixo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></linearGradient><rect x="-200" y="760" width="${W + 400}" height="${H}" fill="url(#gBaixo)"/>`;
const opg = (op, svg) => (op <= 0 ? '' : op >= 1 ? svg : `<g opacity="${f1(op * 100) / 100}">${svg}</g>`);
// Corte dentro de uma cena, no meio da frase: cruza de A para B no mesmo tempo das trocas de cena.
function xcut(t, tc, A, B) {
  const p = E.sine(prog(t, tc - XF / 2, tc + XF / 2));
  if (p <= 0) return A(t);
  if (p >= 1) return B(t);
  return A(t) + `<g opacity="${p.toFixed(3)}">${B(t)}</g>`;
}
const fala = (t, t0, t1, base = 20, amp = 30) => base + amp * Math.abs(Math.sin(t * 5.5)) * (t > t0 && t < t1 ? 1 : 0);
function lagrimas(x, y, s, t, op = 1) {
  let g = '';
  [-12, 12].forEach((dx, i) => {
    const ph = (t * 0.9 + i * 0.5) % 1, ty = y + s * (-200 + ph * 40);
    g += `<path d="M ${f1(x + dx * s)} ${f1(ty)} q ${f1(-6 * s)} ${f1(10 * s)} 0 ${f1(14 * s)} q ${f1(6 * s)} ${f1(-4 * s)} 0 ${f1(-14 * s)} Z" fill="${C.b300}" opacity="${f1((1 - ph) * op * 100) / 100}"/>`;
  });
  return g;
}
// Onde fica a mão de uma pessoa (para pôr pão, tocha, cajado).
function mao(o, side) {
  const s = o.s || 1, f = o.flip ? -1 : 1, ang = (side > 0 ? o.armR : o.armL) ?? 14, r = (ang * Math.PI) / 180;
  return [o.x + f * s * side * (34 + 86 * Math.sin(r)), o.y + s * (-154 + 86 * Math.cos(r) + (o.kneel ? 40 : 0))];
}
// Sentado (no chão, numa pedra baixa): o corpo ajoelhado com as pernas para a frente. o.rock põe a pedra.
function sentado(o) {
  const s = o.s || 1, col = o.sil || C.g800, sw = o.sil ? 0 : f1(4 * s), ol = o.sil || o.ol || C.ink;
  const rk = o.rock ? `<ellipse cx="${f1(o.x)}" cy="${f1(o.y + 88 * s)}" rx="${f1(80 * s)}" ry="${f1(9 * s)}" fill="#000" opacity="0.18"/><path d="M ${f1(o.x - 78 * s)} ${f1(o.y + 86 * s)} C ${f1(o.x - 84 * s)} ${f1(o.y + 30 * s)} ${f1(o.x + 84 * s)} ${f1(o.y + 30 * s)} ${f1(o.x + 78 * s)} ${f1(o.y + 86 * s)} Z" fill="${o.rock}" ${ink(5, ol)}/>` : '';
  const legs = [-15, 15].map((dx) => `<rect x="${f1(o.x + (dx - 9) * s)}" y="${f1(o.y + 18 * s)}" width="${f1(18 * s)}" height="${f1(60 * s)}" rx="${f1(9 * s)}" fill="${col}" stroke="${ol}" stroke-width="${sw}"/>`).join('');
  return opg(o.op ?? 1, rk + legs + person({ ...o, kneel: true, noShadow: true, op: 1 }));
}
// Caído para trás: ang 0 em pé, ±85 deitado (gira pelos pés). Devolve também onde a mão foi parar.
function girar(px, py, fx, fy, ang) {
  const r = (ang * Math.PI) / 180, c = Math.cos(r), sn = Math.sin(r);
  return [fx + (px - fx) * c - (py - fy) * sn, fy + (px - fx) * sn + (py - fy) * c];
}
function caido(o, ang) {
  const s = o.s || 1, k = Math.abs(Math.sin((ang * Math.PI) / 180)), lift = -44 * s * k * k * k;
  let g = k > 0.6 ? `<ellipse cx="${f1(o.x + Math.sign(ang) * 150 * s)}" cy="${f1(o.y + 2)}" rx="${f1(170 * s)}" ry="${f1(12 * s)}" fill="#000" opacity="0.25"/>` : '';
  return g + `<g transform="translate(0 ${f1(lift)}) rotate(${f1(ang)} ${f1(o.x)} ${f1(o.y)})">${person({ ...o, noShadow: k > 0.2 })}</g>`;
}
// Lembrança (o templo, quando volta no fim): a cena em sépia, com vinheta.
const SEPIA = `<filter id="fSepia"><feColorMatrix type="matrix" values="0.42 0.74 0.18 0 0.02  0.36 0.68 0.16 0 0.01  0.27 0.52 0.13 0 0  0 0 0 1 0"/></filter>`;
const lembranca = (svg) => SEPIA + `<g filter="url(#fSepia)">${svg}</g><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#gVig)"/>`;
const label = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${o.fam || 'Geist'}" font-weight="${o.w || 700}" font-size="${o.size || 36}" fill="${o.fill || C.inkDeep}" opacity="${f1((o.op ?? 1) * 100) / 100}">${o.html || esc(txt)}</text>`;

// ---------------------------------------------------------------- a lista (1 a 7): a bolinha do longo das 7 frases
function dot(x, y, n, sc = 1, op = 1) {
  if (sc <= 0 || op <= 0) return '';
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * 100) / 100})" opacity="${f1(op * 100) / 100}">
    <circle cy="8" r="42" fill="${C.ink}"/><circle r="42" fill="${C.b500}" stroke="${C.ink}" stroke-width="6"/>
    <text y="16" text-anchor="middle" font-family="Geist" font-weight="800" font-size="46" fill="#fff">${n}</text></g>`;
}
// Marca do item no canto de cima à esquerda, quando o narrador diz "a primeira", "a segunda"...
const tag = (t, t0, ...ns) => ns.map((n, k) => { const p = pop(t, t0 + k * 0.18, 0.45); return p > 0 ? dot(130 + k * 112, 120, n, p) : ''; }).join('');
const EUSOU = [null,
  { linhas: ['Eu sou o pão da vida'], curta: 'o pão da vida', ref: 'João 6:35' },
  { linhas: ['Eu sou a luz do mundo'], curta: 'a luz do mundo', ref: 'João 8:12' },
  { linhas: ['Eu sou a porta'], curta: 'a porta', ref: 'João 10:9' },
  { linhas: ['Eu sou o bom pastor'], curta: 'o bom pastor', ref: 'João 10:11' },
  { linhas: ['Eu sou a ressurreição', 'e a vida'], curta: 'a ressurreição e a vida', ref: 'João 11:25' },
  { linhas: ['Eu sou o caminho,', 'a verdade e a vida'], curta: 'o caminho, a verdade e a vida', ref: 'João 14:6' },
  { linhas: ['Eu sou a videira'], curta: 'a videira', ref: 'João 15:5' },
];
// Cartão do item (cena inteira, como os cartões de explicação do longo das 7 frases): papel, a frase em Lora com
// "Eu sou" em azul, a referência, o desenho do símbolo à direita na luz quente e a fila dos sete embaixo.
// O canto de cima à direita fica livre (o banner do app passa ali).
function cartao(t, t0, o) {
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${C.paper}"/>`;
  s += `<circle cx="1440" cy="540" r="560" fill="url(#gAmber)" opacity="0.32"/>`;
  const ap = pop(t, t0 + 0.15, 0.55);
  if (o.art && ap > 0) s += `<g transform="translate(1440 560) scale(${f1(ap * 1000) / 1000}) translate(-1440 -560)">${o.art(t)}</g>`;
  const X = 170, linhas = o.linhas;
  let size = o.size || 112;
  linhas.forEach((ln) => { while (measure(ln, `600 ${size}px Lora`) > (o.maxW || 1000) && size > 56) size -= 4; });
  const lh = size * 1.18, top = 500 - ((linhas.length - 1) * lh) / 2;
  const num = o.n && !CURTO;
  if (num) s += dot(X + 46, top - size - 64, o.n, pop(t, t0, 0.45) * 1.15);
  linhas.forEach((ln, k) => {
    const p = E.out(prog(t, t0 + 0.1 + k * 0.12, t0 + 0.5 + k * 0.12));
    const m = ln.match(/^(Eu [Ss]ou)(.*)$/);
    const txt = m ? `<tspan fill="${C.b500}">${m[1]}</tspan>${esc(m[2])}` : esc(ln);
    s += `<text x="${X}" y="${f1(top + k * lh + (1 - p) * 26)}" font-family="Lora" font-weight="600" font-size="${size}" fill="${C.inkDeep}" opacity="${f1(p * 100) / 100}">${txt}</text>`;
  });
  const pr = E.out(prog(t, t0 + 0.35, t0 + 0.8)), yr = top + (linhas.length - 1) * lh + 78;
  s += label(X + 4, yr, o.ref, { anchor: 'start', fam: 'Geist Mono', w: 500, size: 36, fill: C.muted, op: pr });
  if (num) for (let k = 1; k <= 7; k++) {
    const x = X + 16 + (k - 1) * 46, y = yr + 76;
    if (k < o.n) s += `<circle cx="${x}" cy="${f1(y)}" r="14" fill="${C.ink}" opacity="${pr}"/>`;
    else if (k === o.n) s += `<circle cx="${x}" cy="${f1(y)}" r="${f1(16 * pop(t, t0 + 0.5, 0.4))}" fill="${C.b500}" stroke="${C.ink}" stroke-width="4"/>`;
    else s += `<circle cx="${x}" cy="${f1(y)}" r="12" fill="none" stroke="${C.border}" stroke-width="4" opacity="${pr}"/>`;
  }
  return s;
}
const cenaCartao = (n, t0, art, maxW) => (t) => ({ svg: cam(cartao(t, t0(), { n, ...EUSOU[n], art, maxW }), 960, 540, 1.0 + 0.03 * prog(t, t0(), t0() + 6)), html: '' });

// ---------------------------------------------------------------- os símbolos dos cartões (centro em 1440, 560)
// Cesto com cinco pães e, na frente, dois peixinhos (João 6:9).
function cesto(x, y, s) {
  let g = `<path d="M ${f1(x - 190 * s)} ${f1(y - 150 * s)} L ${f1(x + 190 * s)} ${f1(y - 150 * s)} L ${f1(x + 145 * s)} ${f1(y)} L ${f1(x - 145 * s)} ${f1(y)} Z" fill="#B98A55" ${ink(6)}/>`;
  for (let k = 1; k <= 3; k++) g += `<line x1="${f1(x - 190 * s + k * 12 * s)}" y1="${f1(y - 150 * s + k * 37 * s)}" x2="${f1(x + 190 * s - k * 12 * s)}" y2="${f1(y - 150 * s + k * 37 * s)}" stroke="#8C6236" stroke-width="${f1(6 * s)}" stroke-linecap="round"/>`;
  g += paes(x, y - 186 * s, 1.5 * s, 2) + paes(x, y - 150 * s, 1.5 * s, 3);
  g += rect(x - 205 * s, y - 166 * s, 410 * s, 30 * s, '#C99A62', `rx="${f1(15 * s)}" ${ink(6)}`);
  g += peixe(x - 120 * s, y + 34 * s, 1.5 * s, -4, '#B8C7CF') + peixe(x + 120 * s, y + 40 * s, 1.5 * s, 184, '#9DB3BF');
  return g;
}
const artPao = () => cesto(1440, 720, 1.25);
// Candeia de barro acesa.
function candeia(x, y, s, t) {
  let g = `<circle cx="${f1(x + 120 * s)}" cy="${f1(y - 120 * s)}" r="${f1(330 * s)}" fill="url(#gAmber)" opacity="0.9"/>`;
  g += `<path d="M ${f1(x - 160 * s)} ${f1(y - 10 * s)} C ${f1(x - 170 * s)} ${f1(y - 90 * s)} ${f1(x + 110 * s)} ${f1(y - 100 * s)} ${f1(x + 170 * s)} ${f1(y - 56 * s)} L ${f1(x + 250 * s)} ${f1(y - 70 * s)} C ${f1(x + 268 * s)} ${f1(y - 50 * s)} ${f1(x + 250 * s)} ${f1(y - 20 * s)} ${f1(x + 160 * s)} ${f1(y - 8 * s)} C ${f1(x + 120 * s)} ${f1(y + 36 * s)} ${f1(x - 140 * s)} ${f1(y + 44 * s)} ${f1(x - 160 * s)} ${f1(y - 10 * s)} Z" fill="${C.p400}" ${ink(6)}/>`;
  g += `<path d="M ${f1(x - 150 * s)} ${f1(y + 4 * s)} C ${f1(x - 100 * s)} ${f1(y + 30 * s)} ${f1(x + 100 * s)} ${f1(y + 30 * s)} ${f1(x + 150 * s)} ${f1(y)}" stroke="${C.p600}" stroke-width="${f1(8 * s)}" fill="none" stroke-linecap="round"/>`;
  g += `<ellipse cx="${f1(x - 20 * s)}" cy="${f1(y - 62 * s)}" rx="${f1(46 * s)}" ry="${f1(13 * s)}" fill="${C.p600}" ${ink(4)}/>`;
  g += `<path d="M ${f1(x - 160 * s)} ${f1(y - 30 * s)} C ${f1(x - 240 * s)} ${f1(y - 40 * s)} ${f1(x - 240 * s)} ${f1(y + 30 * s)} ${f1(x - 150 * s)} ${f1(y + 16 * s)}" stroke="${C.ink}" stroke-width="${f1(22 * s)}" fill="none" stroke-linecap="round"/><path d="M ${f1(x - 160 * s)} ${f1(y - 30 * s)} C ${f1(x - 240 * s)} ${f1(y - 40 * s)} ${f1(x - 240 * s)} ${f1(y + 30 * s)} ${f1(x - 150 * s)} ${f1(y + 16 * s)}" stroke="${C.p400}" stroke-width="${f1(10 * s)}" fill="none" stroke-linecap="round"/>`;
  const h = (120 + 10 * Math.sin(t * 9) + 6 * Math.sin(t * 17)) * s, fx = x + 238 * s, fy = y - 70 * s;
  g += flame(fx, fy, 34 * s, h, C.r400) + flame(fx, fy, 24 * s, h * 0.75, C.p300) + flame(fx, fy, 13 * s, h * 0.45, C.a300);
  return g;
}
const artLuz = (t) => candeia(1400, 700, 1.25, t);
// Porta do curral de pedra, com uma ovelha entrando (João 10:7-9).
function curral(x, y, s, t, o = {}) {
  const ol = o.ol || C.ink, st = o.stone || C.g400, dk = o.dark || C.g500;
  let g = rect(x - 300 * s, y - 250 * s, 600 * s, 250 * s, st, ink(6, ol));
  const r = rng(61);
  for (let row = 0; row < 4; row++) for (let c = 0; c < 6; c++) {
    const bx = x - 300 * s + c * 100 * s + (row % 2) * 50 * s, by = y - 250 * s + row * 62 * s;
    if (bx > x + 260 * s) continue;
    g += rect(bx + 6 * s, by + 6 * s, (88 + r() * 10) * s, 50 * s, row % 2 ? st : shade(st, 0.94), `rx="${f1(12 * s)}" stroke="${ol}" stroke-width="${f1(4 * s)}"`);
  }
  g += `<path d="M ${f1(x - 90 * s)} ${f1(y)} L ${f1(x - 90 * s)} ${f1(y - 160 * s)} C ${f1(x - 90 * s)} ${f1(y - 230 * s)} ${f1(x + 90 * s)} ${f1(y - 230 * s)} ${f1(x + 90 * s)} ${f1(y - 160 * s)} L ${f1(x + 90 * s)} ${f1(y)} Z" fill="${dk}" ${ink(6, ol)}/>`;
  g += `<path d="M ${f1(x - 60 * s)} ${f1(y)} L ${f1(x - 60 * s)} ${f1(y - 150 * s)} C ${f1(x - 60 * s)} ${f1(y - 196 * s)} ${f1(x + 60 * s)} ${f1(y - 196 * s)} ${f1(x + 60 * s)} ${f1(y - 150 * s)} L ${f1(x + 60 * s)} ${f1(y)} Z" fill="${shade(dk, 0.7)}"/>`;
  if (o.sheep !== false) g += sheep(x - 10 * s, y + 6 * s, 1.15 * s, t, -1) + sheep(x + 190 * s, y + 30 * s, 1.0 * s, t + 1, -1);
  return g;
}
const artPorta = (t) => `<ellipse cx="1440" cy="790" rx="380" ry="26" fill="#000" opacity="0.08"/>` + curral(1440, 780, 0.95, t);
// Cajado e ovelha (João 10:11).
function cajado(x, y0, y1, s = 1, ol = C.ink) {
  const d = `M ${f1(x)} ${f1(y0)} L ${f1(x)} ${f1(y1)} C ${f1(x)} ${f1(y1 - 70 * s)} ${f1(x - 90 * s)} ${f1(y1 - 76 * s)} ${f1(x - 92 * s)} ${f1(y1 - 20 * s)}`;
  return `<path d="${d}" stroke="${ol}" stroke-width="${f1(22 * s)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${C.wood}" stroke-width="${f1(11 * s)}" fill="none" stroke-linecap="round"/>`;
}
const artPastor = (t) => `<ellipse cx="1440" cy="800" rx="320" ry="24" fill="#000" opacity="0.08"/>` + cajado(1300, 800, 300, 1.4) + sheep(1520, 800, 2.3, t, -1);
// Nascer do sol sobre o morro (a ressurreição e a vida), numa moldura à direita do texto.
const MOLDURA = (id, g) => `<clipPath id="${id}"><rect x="1160" y="260" width="680" height="540" rx="44"/></clipPath><g clip-path="url(#${id})">${g}</g><rect x="1160" y="260" width="680" height="540" rx="44" fill="none" ${ink(6)}/>`;
function artVida(t) {
  let g = `<rect x="1160" y="260" width="680" height="540" fill="#FBEFE2"/><circle cx="1500" cy="610" r="380" fill="url(#gPeach)" opacity="0.7"/>` + sun(1500, 610, 112, t);
  g += `<path d="M 1140 820 L 1140 650 C 1260 590 1380 630 1500 640 C 1620 650 1720 590 1860 640 L 1860 820 Z" fill="#E3D3C4" ${ink(6)}/>`;
  g += `<path d="M 1140 820 L 1140 728 C 1260 700 1380 716 1500 724 C 1640 732 1740 704 1860 724 L 1860 820 Z" fill="#D6C2B0" ${ink(6)}/>`;
  g += olive(1300, 690, 0.7) + olive(1700, 670, 0.55);
  return MOLDURA('cVida', g);
}
// Estrada que sobe até o horizonte (o caminho), na mesma moldura.
function artCaminho(t) {
  let g = `<rect x="1160" y="260" width="680" height="540" fill="#EEF2F6"/><circle cx="1520" cy="440" r="280" fill="url(#gPeach)" opacity="0.55"/>` + sun(1520, 440, 48, t);
  g += `<path d="M 1140 540 C 1280 494 1400 520 1500 502 C 1620 484 1720 510 1860 494 L 1860 820 L 1140 820 Z" fill="#E3D7C9" ${ink(5)}/>`;
  g += `<path d="M 1360 820 C 1410 730 1600 676 1520 606 C 1484 572 1500 530 1514 512 L 1532 512 C 1524 534 1520 568 1560 604 C 1652 680 1480 740 1640 820 Z" fill="#F6EEE3" ${ink(5)}/>`;
  g += olive(1270, 650, 0.72) + olive(1750, 630, 0.6);
  return MOLDURA('cCam', g);
}
// Videira: tronco, ramos, folhas e cachos. o.cut: um ramo cortado e seco no chão (João 15:6).
const UVA = '#5B3F7A', FOLHA = '#7FA06A', FOLHA_DK = '#5F7F4E';
function cacho(x, y, s, ol = C.ink, col = UVA) {
  let g = '';
  [[0, 0], [-16, -2], [16, -2], [-8, 14], [8, 14], [0, 28], [-24, -16], [0, -16], [24, -16]].forEach(([dx, dy]) => (g += `<circle cx="${f1(x + dx * s)}" cy="${f1(y + dy * s)}" r="${f1(11 * s)}" fill="${col}" stroke="${ol}" stroke-width="${f1(3.5 * s)}"/>`));
  return `<path d="M ${f1(x)} ${f1(y - 26 * s)} L ${f1(x)} ${f1(y - 44 * s)}" stroke="${C.wood}" stroke-width="${f1(5 * s)}"/>` + g;
}
function folha(x, y, s, ang, ol = C.ink, col = FOLHA) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)}) scale(${f1(s * 100) / 100})"><path d="M 0 0 C -30 -10 -40 -44 -14 -62 C -6 -48 6 -48 14 -62 C 40 -44 30 -10 0 0 Z" fill="${col}" stroke="${ol}" stroke-width="4" stroke-linejoin="round"/><path d="M 0 -4 L 0 -46" stroke="${shade(col, 0.7)}" stroke-width="3"/></g>`;
}
function videira(x, y, s, t, o = {}) {
  const ol = o.ol || C.ink, sw = Math.sin(t * 1.2) * 2;
  const ramo = (d) => `<path d="${d}" stroke="${ol}" stroke-width="${f1(20 * s)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${C.wood}" stroke-width="${f1(10 * s)}" fill="none" stroke-linecap="round"/>`;
  const P = (dx, dy) => `${f1(x + dx * s)} ${f1(y + dy * s)}`;
  let g = `<path d="M ${P(-26, 0)} C ${P(-30, -120)} ${P(10, -170)} ${P(0, -300)} L ${P(26, -300)} C ${P(34, -170)} ${P(0, -120)} ${P(22, 0)} Z" fill="${C.wood}" ${ink(6, ol)}/>`;
  const ramos = [[`M ${P(10, -280)} C ${P(-80, -330)} ${P(-200, -300)} ${P(-280, -360)}`, [-280, -360]], [`M ${P(14, -290)} C ${P(100, -340)} ${P(210, -310)} ${P(290, -370)}`, [290, -370]],
    [`M ${P(4, -200)} C ${P(-90, -210)} ${P(-170, -170)} ${P(-240, -200)}`, [-240, -200]], [`M ${P(16, -210)} C ${P(110, -220)} ${P(180, -180)} ${P(250, -210)}`, [250, -210]]];
  ramos.forEach(([d]) => (g += ramo(d)));
  [[-120, -330, -40], [-220, -330, 30], [100, -340, 40], [220, -340, -30], [-120, -195, -60], [-200, -190, 20], [110, -205, 60], [200, -200, -20], [0, -330, 0]].forEach(([dx, dy, a], i) => (g += folha(x + dx * s, y + dy * s, 1.3 * s, a + sw * (i % 2 ? 1 : -1), ol, i % 3 ? FOLHA : FOLHA_DK)));
  [[-160, -300], [160, -310], [-90, -170], [80, -180], [-250, -330], [260, -340]].forEach(([dx, dy]) => (g += cacho(x + dx * s, y + dy * s + 30 * s, 1.15 * s, ol)));
  if (o.cut) {
    const d = `M ${P(170, 40)} C ${P(230, 30)} ${P(300, 46)} ${P(360, 30)}`;
    g += `<path d="${d}" stroke="${ol}" stroke-width="${f1(18 * s)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#8E8170" stroke-width="${f1(8 * s)}" fill="none" stroke-linecap="round"/>`;
    g += folha(x + 250 * s, y + 34 * s, 1.0 * s, 100, ol, '#A79A7A') + folha(x + 320 * s, y + 30 * s, 0.9 * s, 70, ol, '#9C8F70');
  }
  return g;
}
const artVideira = (t) => videira(1440, 830, 1.25, t);
// A sarça: o arbusto pega fogo e não se consome (Êxodo 3:2). Nada nem ninguém dentro dele.
function sarca(x, y, s, t, o = {}) {
  const ol = o.ol || C.ink;
  let g = `<circle cx="${f1(x)}" cy="${f1(y - 120 * s)}" r="${f1(330 * s)}" fill="url(#gAmber)" opacity="${o.glow ?? 0.8}"/>`;
  g += `<path d="M ${f1(x - 30 * s)} ${f1(y)} L ${f1(x - 18 * s)} ${f1(y - 60 * s)} M ${f1(x + 26 * s)} ${f1(y)} L ${f1(x + 14 * s)} ${f1(y - 60 * s)}" stroke="${C.wood}" stroke-width="${f1(14 * s)}" stroke-linecap="round"/>`;
  const blobs = [[-90, -70, 56], [90, -74, 58], [-40, -120, 64], [46, -126, 62], [0, -80, 70], [-120, -40, 40], [124, -42, 40]];
  g += blobs.map(([bx, by, r]) => `<circle cx="${f1(x + bx * s)}" cy="${f1(y + by * s)}" r="${f1((r + 6) * s)}" fill="${ol}"/>`).join('');
  g += blobs.map(([bx, by, r], i) => `<circle cx="${f1(x + bx * s)}" cy="${f1(y + by * s)}" r="${f1(r * s)}" fill="${i % 2 ? '#6E8A55' : '#5E7A48'}"/>`).join('');
  [[-70, -150, 1.0, 1], [40, -160, 1.15, 2], [0, -110, 0.9, 3], [-130, -80, 0.7, 4], [120, -90, 0.75, 5]].forEach(([dx, dy, k, sd]) => {
    for (let j = 0; j < 3; j++) {
      const ph = sd * 1.7 + j * 2.1, h = (110 + 30 * Math.sin(t * 9 + ph) + 16 * Math.sin(t * 17 + ph * 2)) * s * k, fx = x + (dx + (j - 1) * 24 * k) * s;
      g += flame(fx, y + dy * s + 40 * s * k, 24 * s * k, h, C.r400) + flame(fx, y + dy * s + 40 * s * k, 16 * s * k, h * 0.72, C.p300) + flame(fx, y + dy * s + 40 * s * k, 9 * s * k, h * 0.45, C.a300);
    }
  });
  return g;
}
const artSarca = (t) => `<ellipse cx="1440" cy="800" rx="260" ry="22" fill="#000" opacity="0.1"/>` + sarca(1440, 800, 1.35, t);

// ---------------------------------------------------------------- cenários
// O pátio do templo: o pórtico de colunas, o muro de pedra atrás e o chão de lajes (João 8:20, 59; 10:23).
function coluna(x, top, base, w = 80, ol = C.ink) {
  return rect(x - w / 2, top, w, base - top, C.g100, ink(6, ol)) + rect(x + w * 0.14, top + 3, w * 0.33, base - top - 6, C.g300) +
    rect(x - w / 2 - 16, top - 26, w + 32, 30, C.g300, `rx="6" ${ink(5, ol)}`) + rect(x - w / 2 - 16, base - 26, w + 32, 30, C.g300, `rx="6" ${ink(5, ol)}`);
}
function templo(t, o = {}) {
  const ox = o.ox || 0;
  let s = `<rect x="-600" y="-600" width="${W + 1200}" height="${H + 600}" fill="url(#skyDay)"/>` + sun(1700 - ox * 0.2, 70, 40, t);
  s += rect(-400, 140, W + 800, GROUND - 140, '#D9CCB8', ink(6));
  for (let r = 1; r < 8; r++) {
    const y = 140 + r * 64;
    s += `<line x1="-400" y1="${y}" x2="${W + 400}" y2="${y}" stroke="#CBBDA7" stroke-width="5"/>`;
    for (let c = -2; c < 14; c++) { const x = c * 180 + (r % 2) * 90 - ox * 0.4; s += `<line x1="${f1(x)}" y1="${y - 64}" x2="${f1(x)}" y2="${y}" stroke="#CBBDA7" stroke-width="5"/>`; }
  }
  s += `<rect x="-400" y="${GROUND}" width="${W + 800}" height="${H - GROUND + 400}" fill="#E8DFD2"/>`;
  [700, 780, 880, 1010].forEach((y) => (s += `<line x1="-400" y1="${y}" x2="${W + 400}" y2="${y}" stroke="#D8CCBC" stroke-width="5"/>`));
  for (let k = -9; k <= 9; k++) s += `<line x1="${f1(960 + k * 160 - ox)}" y1="${GROUND}" x2="${f1(960 + k * 360 - ox * 1.6)}" y2="${H + 20}" stroke="#D8CCBC" stroke-width="5"/>`;
  (o.cols || [-140, 300, 740, 1180, 1620, 2060]).forEach((x) => (s += coluna(x - ox * 0.8, 150, GROUND + 6)));
  s += rect(-400, 64, W + 800, 64, C.g300, ink(6)) + rect(-400, 30, W + 800, 40, C.g400, ink(6));
  return s;
}
// Céu e campo de grama (João 6:10, "havia muita grama naquele lugar").
function campo(t, o = {}) {
  let s = `<rect x="-600" y="-600" width="${W + 1200}" height="${H + 600}" fill="url(#skyDay)"/>` + sun(o.sunX ?? 1600, o.sunY ?? 180, 54, t) + clouds(t, 0);
  s += hills(GROUND - 120, 70, 0.0032, 17, '#D9DCC0') + hills(GROUND - 40, 50, 0.0055, 19, '#CBD0AC');
  s += `<rect x="-400" y="${GROUND}" width="${W + 800}" height="${H - GROUND + 400}" fill="#C5CB9F"/>`;
  const r = rng(73);
  for (let i = 0; i < 46; i++) {
    const d = r(), y = GROUND + 40 + d * (H - GROUND), x = r() * (W + 200) - 100, sc = 0.6 + d * 1.2;
    s += `<path d="M ${f1(x - 10 * sc)} ${f1(y)} q ${f1(2 * sc)} ${f1(-16 * sc)} ${f1(-6 * sc)} ${f1(-26 * sc)} M ${f1(x)} ${f1(y)} q 0 ${f1(-20 * sc)} ${f1(4 * sc)} ${f1(-32 * sc)} M ${f1(x + 10 * sc)} ${f1(y)} q ${f1(-1 * sc)} ${f1(-15 * sc)} ${f1(8 * sc)} ${f1(-24 * sc)}" stroke="#8E9A6A" stroke-width="${f1(2.6 * Math.min(sc, 1.3))}" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}
// Praia do mar da Galileia (a mesma do longo do Pedro, de dia).
const MAR_COR = { day: [C.b400, C.b500], dawn: ['#6F8FA6', '#3E5A70'], night: ['#202C38', '#121A22'] };
function aguaEm(y, hz, tom = 'day') {
  const [a, b] = MAR_COR[tom].map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))), k = clamp((y - hz) / (H - hz + 600));
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], k)).toString(16).padStart(2, '0')).join('');
}
function praia(t, o = {}) {
  const ox = o.ox || 0, hz = o.hz ?? 560, sh = o.sh ?? 700;
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>`;
  const sx = (o.sunX ?? 1240) - ox * 0.1, sy = o.sunY ?? hz - 120;
  s += sun(sx, sy, 58, t) + clouds(t, ox, '#FFF6EE', '#F1DCCB');
  s += hills(hz - 10, 46, 0.0035, o.seed || 21, '#E6D3C4', ox * 0.2) + mar(t, hz, 'day', ox);
  if (sh) {
    let d = `M -400 ${sh}`;
    for (let x = -400; x <= W + 400; x += 60) d += ` L ${x} ${f1(sh + Math.sin(x * 0.02 + t * 1.3) * 5)}`;
    s += `<path d="${d}" stroke="#FFFFFF" stroke-width="10" fill="none" opacity="0.7" stroke-linecap="round"/>` + floor('day', ox, sh + 4);
  }
  return s;
}
// Pessoas dentro do barco: pés na linha do convés (y - 46*s do barco).
function lotado(t, bx, by, bs, seeds, o = {}) {
  return seeds.map((sd, i) => person({ ...povo(sd), x: bx + (i - (seeds.length - 1) / 2) * 92 * bs, y: by - 46 * bs, s: 0.6 * bs, look: o.look ?? 1, mood: 'calm', noShadow: true, ol: o.ol })).join('');
}
// Rua de pedra com o muro e as casas da cidade (João 9:1, 8).
function rua(t, o = {}) {
  const ox = o.ox || 0;
  let s = bgDay(t, { sunX: 1650, sunY: 170, seed: 33, ox });
  s += city(1500 - ox * 0.5, GROUND + 8, 0.62, t);
  s += rect(-400, 400, 1300 - ox * 0.8 + 400, GROUND - 400 + 10, '#D8CBB9', ink(6));
  for (let r = 1; r < 4; r++) { const y = 400 + r * 60; s += `<line x1="-400" y1="${y}" x2="${f1(900 - ox * 0.8)}" y2="${y}" stroke="#C9BBA6" stroke-width="5"/>`; }
  for (let r = 0; r < 4; r++) for (let c = -2; c < 9; c++) { const x = c * 140 + (r % 2) * 70 - ox * 0.8, y = 400 + r * 60; if (x < 900 - ox * 0.8) s += `<line x1="${f1(x)}" y1="${y}" x2="${f1(x)}" y2="${y + 60}" stroke="#C9BBA6" stroke-width="5"/>`; }
  return s;
}
// Lama nos olhos: manchas irregulares, sem contorno.
function lama(x, y, s, op = 1, seed = 1) {
  if (op <= 0) return '';
  const r = rng(seed); let d = '';
  for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2, rr = (11 + r() * 5) * s; d += `${k ? 'L' : 'M'} ${f1(x + Math.cos(a) * rr * 1.25)} ${f1(y + Math.sin(a) * rr * 0.8)} `; }
  return `<path d="${d}Z" fill="#5E4230" opacity="${f1(clamp(op) * 0.92 * 100) / 100}"/>`;
}
const lamaOlhos = (x, y, s, look, op) => [-12, 12].map((dx, i) => lama(x + (dx + 7 * look) * s, y + s * -209, s, op, 3 + i)).join('');
// O mendigo cego sentado numa pedra junto ao muro. o.mud: lama nos olhos (0..1); o.ve: já enxerga.
function cego(o) {
  const s = o.s || 1;
  let g = sentado({ ...CEGO, rock: C.g500, ...o, mood: o.ve ? 'calm' : 'closed', look: o.look ?? 0 });
  if (o.mud > 0) g += lamaOlhos(o.x, o.y + 40 * s, s, o.look ?? 0, o.mud);
  return g;
}
const tigela = (x, y, s = 1) => `<path d="M ${f1(x - 34 * s)} ${f1(y - 22 * s)} L ${f1(x + 34 * s)} ${f1(y - 22 * s)} C ${f1(x + 30 * s)} ${f1(y + 2 * s)} ${f1(x - 30 * s)} ${f1(y + 2 * s)} ${f1(x - 34 * s)} ${f1(y - 22 * s)} Z" fill="${C.p500}" ${ink(4)}/>`;
// Ladeira com o caminho (Betânia ao longe, à esquerda).
function estrada(t, o = {}) {
  const ox = o.ox || 0;
  let s = bgDay(t, { sunX: o.sunX ?? 1600, sunY: 200, seed: o.seed || 51, ox });
  if (o.vila) s += city(o.vila[0] - ox * 0.4, GROUND + 6, o.vila[1], t);
  s += `<path d="M -400 ${FLOOR_Y - 70} C 400 ${FLOOR_Y - 110} 1300 ${FLOOR_Y - 60} ${W + 400} ${FLOOR_Y - 90} L ${W + 400} ${FLOOR_Y + 40} C 1300 ${FLOOR_Y + 20} 500 ${FLOOR_Y + 50} -400 ${FLOOR_Y + 30} Z" fill="#EFE6DA" stroke="${C.ink}" stroke-width="4"/>`;
  s += olive(260 - ox * 0.7, GROUND + 70, 1.1) + olive(1760 - ox * 0.7, GROUND + 60, 0.95);
  return s;
}
// Casa de Betânia: muro branco, porta e janela.
function casa(x, base, s) {
  let g = rect(x - 260 * s, base - 300 * s, 520 * s, 300 * s, '#FFFFFF', ink(6)) + rect(x + 120 * s, base - 297 * s, 137 * s, 294 * s, C.g300);
  g += rect(x - 280 * s, base - 320 * s, 560 * s, 30 * s, C.g300, `rx="${f1(8 * s)}" ${ink(5)}`);
  g += `<path d="M ${f1(x - 60 * s)} ${f1(base)} L ${f1(x - 60 * s)} ${f1(base - 150 * s)} C ${f1(x - 60 * s)} ${f1(base - 200 * s)} ${f1(x + 60 * s)} ${f1(base - 200 * s)} ${f1(x + 60 * s)} ${f1(base - 150 * s)} L ${f1(x + 60 * s)} ${f1(base)} Z" fill="${C.g700}" ${ink(5)}/>`;
  g += rect(x - 200 * s, base - 230 * s, 60 * s, 70 * s, C.g700, `rx="${f1(8 * s)}" ${ink(4)}`);
  return g;
}
// O túmulo de Lázaro: "uma gruta com uma pedra colocada à entrada" (João 11:38). cave() de lib.js com a pedra
// redonda do longo da ressurreição. open (0..1) rola a pedra; a boca escura fica livre.
const TB = { x: 1180, base: 800, s: 1.2 };
const PR = 111 * TB.s, PEDRA_Y = TB.base - PR, PEDRA_FECHADA = TB.x - 9, PEDRA_ABERTA = TB.x + 220;
function pedra(x, rot) {
  const r = PR;
  return `<circle cx="${f1(x)}" cy="${f1(PEDRA_Y)}" r="${f1(r)}" fill="${C.g600}" ${ink(7, C.inkDeep)}/>
    <g transform="translate(${f1(x)} ${f1(PEDRA_Y)}) rotate(${f1(rot)})">
      <path d="M ${f1(-r * 0.55)} ${f1(-r * 0.35)} C ${f1(-r * 0.2)} ${f1(-r * 0.6)} ${f1(r * 0.25)} ${f1(-r * 0.55)} ${f1(r * 0.5)} ${f1(-r * 0.25)}" stroke="${C.g700}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M ${f1(-r * 0.3)} ${f1(r * 0.45)} C ${f1(-r * 0.1)} ${f1(r * 0.55)} ${f1(r * 0.12)} ${f1(r * 0.52)} ${f1(r * 0.28)} ${f1(r * 0.4)}" stroke="${C.g700}" stroke-width="7" fill="none" stroke-linecap="round"/>
    </g>`;
}
function tumulo(t, o = {}) {
  let s = o.bg ?? bgDay(t, { sunX: 400, sunY: 190, seed: 57 });
  s += olive(1700, GROUND + 60, 1.2) + olive(560, GROUND + 30, 0.9);
  s += cave(TB.x, TB.base, TB.s, 'day');
  if (o.inside) s += o.inside;
  const op = clamp(o.open || 0), x = lerp(PEDRA_FECHADA, PEDRA_ABERTA, op);
  s += pedra(x, ((x - PEDRA_FECHADA) / PR) * 57.3);
  if (o.front) s += o.front;
  return s;
}
// Lázaro saindo: o corpo em faixas de linho, as mãos e os pés amarrados e o rosto envolto num pano (João 11:44).
function lazaro(o) {
  const s = o.s || 1, x = o.x, y = o.y;
  let g = person({ ...LAZARO, ...o, armL: 6, armR: 6, mood: 'closed', look: 0 });
  // faixas no corpo e nas pernas, e as pernas presas juntas
  g += `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 1000) / 1000})">
    <rect x="-24" y="-52" width="48" height="54" rx="14" fill="#F4F1EC" ${ink(5)}/>
    ${[-150, -128, -106, -84, -62, -40, -18].map((yy, i) => `<line x1="-46" y1="${yy + (i % 2 ? 8 : 0)}" x2="46" y2="${yy + (i % 2 ? 0 : 8)}" stroke="${C.g400}" stroke-width="4"/>`).join('')}
    ${[-40, -24, -8].map((yy) => `<line x1="-22" y1="${yy}" x2="22" y2="${yy + 6}" stroke="${C.g400}" stroke-width="4"/>`).join('')}
    <circle cx="-43" cy="-68" r="14" fill="#F4F1EC" ${ink(4)}/><circle cx="43" cy="-68" r="14" fill="#F4F1EC" ${ink(4)}/>
    <path d="M -40 -246 C -40 -262 40 -262 40 -246 L 42 -186 C 30 -176 -30 -176 -42 -186 Z" fill="#ECE6DC" ${ink(5)}/>
    <line x1="-36" y1="-226" x2="36" y2="-220" stroke="${C.g400}" stroke-width="4"/><line x1="-38" y1="-204" x2="38" y2="-198" stroke="${C.g400}" stroke-width="4"/>
  </g>`;
  return opg(o.op ?? 1, g);
}
// A sala do jantar (a mesma do longo do Pedro): parede de pedra quente, mesa e lamparina.
function sala(t, o = {}) {
  let s = `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#231D19"/>`;
  for (let r = 0; r < 11; r++) for (let c = 0; c < 12; c++) {
    const x = c * 200 - (r % 2) * 100 - 80, y = -20 + r * 62;
    s += `<rect x="${x + 4}" y="${y}" width="192" height="56" rx="8" fill="${(r * 7 + c * 3) % 5 ? '#2E2621' : '#342B25'}" stroke="#120E0B" stroke-width="5"/>`;
  }
  s += floor('dusk', 0, 640);
  s += `<circle cx="${o.lx ?? 960}" cy="${o.ly ?? 600}" r="${o.lr ?? 780}" fill="url(#gAmber)" opacity="${o.glow ?? 0.4}"/>`;
  return s;
}
const mesa = (x, y, w = 760) => rect(x - w / 2, y, w, 34, C.wood, `rx="10" ${ink(6, NIGHT_OL)}`) + rect(x - w / 2 + 40, y + 34, w - 80, 120, '#5A4030', ink(6, NIGHT_OL));
const lamparina = (x, y, t) => flame(x, y - 8, 13, 44 + 4 * Math.sin(t * 9), C.a300) + `<ellipse cx="${x}" cy="${y}" rx="32" ry="12" fill="${C.a600}" ${ink(5, NIGHT_OL)}/>`;
// Noite no olival (João 18:1): lua, oliveiras escuras e o chão da noite.
const OLIVA = (x, y, sc) => olive(x, y, sc, '#3E4A3A', '#33402F', NIGHT_OL);
function noite(t, o = {}) {
  let s = bgNight(t, { moonX: o.moonX ?? 1640, moonY: o.moonY ?? 170, ox: o.ox || 0 });
  (o.trees || [[150, GROUND + 90, 1.55], [470, GROUND + 30, 1.0], [1420, GROUND + 20, 0.9], [1780, GROUND + 80, 1.45]]).forEach(([x, y, sc]) => (s += OLIVA(x - (o.ox || 0) * 0.6, y, sc)));
  return s;
}
// Tocha: haste na mão (hx, hy) inclinada em ang; o fogo sobe sempre para cima. Lanterna: caixinha com a chama dentro.
function tocha(hx, hy, ang, t, seed, s = 1) {
  const r = (ang * Math.PI) / 180, tx = hx + Math.sin(r) * 100 * s, ty = hy - Math.cos(r) * 100 * s, bx = hx - Math.sin(r) * 30 * s, by = hy + Math.cos(r) * 30 * s;
  return `<line x1="${f1(bx)}" y1="${f1(by)}" x2="${f1(tx)}" y2="${f1(ty)}" stroke="${NIGHT_OL}" stroke-width="${f1(13 * s)}" stroke-linecap="round"/><line x1="${f1(bx)}" y1="${f1(by)}" x2="${f1(tx)}" y2="${f1(ty)}" stroke="${C.wood}" stroke-width="${f1(6 * s)}" stroke-linecap="round"/>` + flames(tx, ty + 6 * s, 0.42 * s, t, seed);
}
function lanterna(hx, hy, t, s = 1) {
  const y = hy + 20 * s;
  return `<circle cx="${f1(hx)}" cy="${f1(y + 30 * s)}" r="${f1(90 * s)}" fill="url(#gAmber)" opacity="0.5"/><line x1="${f1(hx)}" y1="${f1(hy)}" x2="${f1(hx)}" y2="${f1(y)}" stroke="${NIGHT_OL}" stroke-width="${f1(5 * s)}"/>` +
    rect(hx - 20 * s, y, 40 * s, 52 * s, '#3A2E25', `rx="${f1(6 * s)}" ${ink(5, NIGHT_OL)}`) + rect(hx - 12 * s, y + 9 * s, 24 * s, 34 * s, C.a300, `rx="${f1(4 * s)}" opacity="${f1((0.85 + 0.15 * Math.sin(t * 8)) * 100) / 100}"`);
}

// ================================================================ abertura: as pedras no templo (João 8:56-59)
// Os que discutiam com ele, com as pedras na mão desde o 1º quadro.
function pedras(t, o = {}) {
  let s = templo(t, { ox: o.ox || 0 });
  const xs = [300, 500, 700, 890], up = o.up ?? 1, pick = o.pick || 0;
  LIDERES.forEach((who, i) => {
    const sh = Math.sin(t * 6 + i * 1.7) * 6 * up;
    const arm = lerp(lerp(20, 30, pick), 150 + (i % 2) * 12 + sh, up);
    s += person({ ...who, x: xs[i], y: FLOOR_Y - (i % 2) * 12, s: 1.3, look: 1, mood: o.mood || 'angry', armR: o.armR ? o.armR(i) : arm, armL: o.armL ? o.armL(i) : 24, lean: 18 * pick * (1 - up), gear: up > 0.3 || pick > 0.6 ? { stone: 'r' } : {} });
  });
  if (o.jesus !== false) s += person({ ...JESUS, x: o.jx ?? 1400, y: FLOOR_Y, s: 1.35, look: -1, mood: 'calm', armL: o.jarm ?? 14, walk: o.jwalk });
  return s;
}
function scPedras(t) {
  return { svg: cam(pedras(t), 960, 560, 1.06 - 0.06 * E.inOut(prog(t, 0, at(1)))), html: '' };
}
// "Ele tinha dito que Abraão viu o dia dele e se alegrou." Jesus fala; eles ouvem, sem pedra ainda.
function scAbraao(t) {
  const s = pedras(t, { up: 0, mood: 'calm', jarm: fala(t, seg(1), fim(1), 22, 30), armR: () => 24, armL: () => 24 });
  return { svg: cam(s, lerp(1180, 1120, prog(t, at(1), at(2))), 600, 1.18), html: '' };
}
// "Você ainda não tem cinquenta anos, e viu Abraão?"
function scCinquenta(t) {
  const tv = wordTime(2, 'você'), p = E.out(prog(t, tv - 0.3, tv + 0.3));
  const s = pedras(t, { up: 0, mood: 'angry', armR: (i) => (i === 3 ? lerp(24, 92, p) : i === 1 ? 24 + 90 * p * Math.abs(Math.sin(t * 4)) : 24), armL: () => 24 });
  return { svg: cam(s, 700, 600, 1.16 + 0.04 * prog(t, at(2), at(3))), html: '' };
}
// "Eu lhes afirmo que antes de Abraão nascer, Eu Sou!" Jesus de perto.
function scAntes(t, o = {}) {
  const ts = o.ts ?? wordTime(3, 'sou'), g = E.out(prog(t, ts - 0.4, ts + 0.2));
  let s = templo(t, { ox: 120 });
  s += person({ ...JESUS, x: 960, y: 1040, s: 2.4, look: -0.6, mood: 'calm', armL: o.arm ?? lerp(fala(t, o.t0 ?? seg(3), ts - 0.3, 18, 16), 52, g), noShadow: true });
  return cam(s, 960, 560, 1.0 + 0.08 * E.inOut(prog(t, o.a ?? at(3), o.b ?? at(4))));
}
// "Eles apanharam pedras. Jesus se escondeu e saiu do templo." Sem milagre: ele passa atrás das colunas e sai.
function scEscondeu(t) {
  const ta = wordTime(4, 'apanharam'), te = wordTime(4, 'escondeu'), tsai = wordTime(4, 'saiu');
  const pick = E.inOut(prog(t, ta - 0.3, ta + 0.4)), up = E.out(prog(t, ta + 0.5, ta + 1.1));
  const jx = lerp(1400, 1640, E.inOut(prog(t, te - 0.5, te + 0.4))) + 520 * prog(t, tsai, fim(4) + 0.8);
  let s = pedras(t, { pick, up, jesus: false });
  [[1250, 3110, 0.95], [1840, 3111, 1.0]].forEach(([x, sd, sc]) => (s += person({ ...povo(sd, { cover: C.g300 }), x, y: FLOOR_Y - 60, s: sc, look: -1, mood: 'calm', noShadow: true })));
  s += person({ ...JESUS, x: jx, y: FLOOR_Y, s: 1.35, look: t > te - 0.5 ? 1 : -1, mood: 'calm', walk: t > te - 0.5 ? t * 6 : null });
  s += rect(1595, -60, 170, H + 120, '#E9E4DD', ink(6)) + rect(1700, -57, 62, H + 114, '#D6CEC4');
  return { svg: cam(s, 980, 560, 1.04), html: '' };
}
// "Eu Sou."
function scEuSou(t) {
  const p = pop(t, at(5) + 0.15, 0.5), r = E.out(prog(t, at(5) + 0.4, at(5) + 0.8));
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${C.paper}"/><circle cx="960" cy="480" r="620" fill="url(#gAmber)" opacity="0.28"/>`;
  s += `<g transform="translate(960 470) scale(${f1(p * 1000) / 1000}) translate(-960 -470)">${label(960, 520, '', { fam: 'Lora', w: 600, size: 200, html: `<tspan fill="${C.b500}">Eu Sou</tspan>.` })}</g>`;
  s += label(960, 640, 'João 8:58', { fam: 'Geist Mono', w: 500, size: 38, fill: C.muted, op: r });
  return { svg: cam(s, 960, 540, 1.0 + 0.04 * prog(t, at(5), at(6))), html: '' };
}
// "No evangelho de João, Jesus diz 'Eu sou' muitas vezes. Separei as sete mais conhecidas."
function pergaminho(x, y, w, h, o = {}) {
  let s = rect(x - w / 2, y - h / 2, w, h, '#EFE3CC', ink(6));
  s += rect(x - w / 2 - 34, y - h / 2 - 22, 44, h + 44, '#C9A77A', `rx="20" ${ink(6)}`) + rect(x + w / 2 - 10, y - h / 2 - 22, 44, h + 44, '#C9A77A', `rx="20" ${ink(6)}`);
  const n = o.linhas || 7, r = rng(o.seed || 31), op = o.lineOp ?? 1;
  for (let k = 0; k < n; k++) {
    const yy = y - h / 2 + 60 + k * ((h - 110) / (n - 1)), x1 = x + w / 2 - 60 - r() * 200;
    s += `<line x1="${x - w / 2 + 60}" y1="${f1(yy)}" x2="${f1(x1)}" y2="${f1(yy)}" stroke="#8C7A62" stroke-width="8" stroke-linecap="round" opacity="${op}"/>`;
    const span = x1 - (x - w / 2 + 60) - 140, m1 = x - w / 2 + 80 + r() * span * 0.4, m2 = x - w / 2 + 80 + span * 0.55 + r() * span * 0.4;
    if (o.marks) [m1, m2].forEach((mx, j) => { const mp = clamp(o.marks * 9 - k * 1.1 - j * 0.6); if (mp > 0 && (k + j) % 3) s += `<rect x="${f1(mx)}" y="${f1(yy - 16)}" width="${f1(110 * mp)}" height="32" rx="8" fill="${C.b300}" opacity="${f1(op * 0.9 * 100) / 100}"/>`; });
  }
  return s;
}
function scSete(t) {
  const tm = wordTime(6, 'muitas'), ts = wordTime(6, 'sete');
  const marks = prog(t, tm - 0.2, tm + 1.2), clear = E.out(prog(t, ts - 0.4, ts + 0.1));
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#E9E1D8"/><circle cx="960" cy="480" r="760" fill="url(#gAmber)" opacity="0.3"/>`;
  s += pergaminho(960, 470, 1320, 600, { linhas: 7, seed: 41, marks, lineOp: f1((1 - clear) * 100) / 100 });
  s += label(960, 128, 'João', { fam: 'Lora', w: 600, size: 64, op: 1 - clear * 0.0 });
  for (let n = 1; n <= 7; n++) s += dot(960 + (n - 4) * 160, 480, n, pop(t, ts - 0.1 + (n - 1) * 0.1, 0.4) * 1.25);
  return { svg: cam(s, 960, 500, 1.0 + 0.05 * prog(t, at(6), at(7))), html: '' };
}

// ================================================================ o olival (João 18:1-6)
// Jesus à esquerda, os discípulos atrás dele; Judas e o destacamento à direita, com tochas, lanternas e armas.
// o.chega (0..1): o grupo chegando; o.passo: Jesus dá um passo à frente; o.fala [t0, t1]: Jesus fala;
// o.resp [t0, t1]: o da frente responde; o.tr / o.tc: quando recuam e quando caem (para trás, longe dele).
const BANDO = [
  // fila de trás, mais longe: os guardas com as tochas e a lanterna levantadas
  { who: guarda(4102), x: 1065, y: FLOOR_Y - 84, s: 0.86, tocha: 1 },
  { who: guarda(4104), x: 1395, y: FLOOR_Y - 90, s: 0.85, lanterna: 1 },
  { who: guarda(4106), x: 1650, y: FLOOR_Y - 86, s: 0.86, tocha: 1 },
  // fila da frente: Judas e os soldados (espaçados para que cada um caia sem cair em cima do outro)
  { who: JUDAS, x: 900, y: FLOOR_Y, s: 1.15, lado: -1 },
  { who: soldado(4101), x: 1230, y: FLOOR_Y + 4, s: 1.15 },
  { who: soldado(4103), x: 1560, y: FLOOR_Y + 2, s: 1.15 },
];
const JX = 620;
function olival(t, o = {}) {
  let s = noite(t, o);
  const rim = C.p400, ch = o.chega ?? 1, dx = lerp(820, 0, ch), walking = ch < 1;
  // a luz das tochas no chão e nas árvores
  s += `<circle cx="${f1(1350 + dx)}" cy="${FLOOR_Y - 260}" r="760" fill="url(#gAmber)" opacity="${f1(0.3 * clamp(ch * 2) * 100) / 100}"/>`;
  // discípulos atrás de Jesus
  [[300, 0], [420, 1], [190, 2]].forEach(([x, i]) => (s += person({ ...DISC[i], x, y: FLOOR_Y - 60, s: 1.0, look: 1, mood: 'calm', t, ol: NIGHT_OL, noShadow: true })));
  const jx = JX + 100 * (o.passo || 0);
  s += person({ ...JESUS, x: jx, y: FLOOR_Y, s: 1.3, look: 1, mood: 'calm', ol: NIGHT_OL, armR: o.fala ? fala(t, o.fala[0], o.fala[1], 18, 26) : 14, walk: o.passo > 0 && o.passo < 1 ? t * 5 : null });
  // o bando: recuam e caem para trás, longe dele; as tochas e a lanterna vão por cima de todos
  let luzes = '';
  BANDO.forEach((m, i) => {
    const k = i * 0.05;
    const r = o.tr != null ? E.out(prog(t, o.tr + k, o.tr + k + 0.45)) : 0, f = o.tc != null ? E.in(prog(t, o.tc + k, o.tc + k + 0.5)) : 0;
    const x = m.x + dx + 50 * r * m.s, ang = 84 * f;
    const armR = m.tocha || m.lanterna ? 150 : m === BANDO[4] && o.resp ? fala(t, o.resp[0], o.resp[1], 40, 30) : m.who.armR ?? 26;
    const P = { ...m.who, x, y: m.y, s: m.s, look: -1, mood: 'calm', t, rim, ol: NIGHT_OL, armR, armL: m.lado ? 30 : 18, walk: walking ? t * 6 + i : null };
    s += caido(P, ang);
    if (m.tocha || m.lanterna) {
      const [hx0, hy0] = mao(P, 1), [hx, hy] = girar(hx0, hy0, x, m.y, ang), lift = -44 * m.s * Math.pow(Math.abs(Math.sin((ang * Math.PI) / 180)), 3);
      const hy1 = Math.min(hy + lift, m.y - 14);
      luzes += m.tocha ? tocha(hx, hy1, ang, t, i, m.s * 1.3) : lanterna(hx, Math.min(hy1, m.y - 76 * m.s), t, m.s * 1.15);
    }
    if (f > 0.85) s += dust(x + 160 * m.s, m.y, t, o.tc + k + 0.45, 3, '#3A3633');
  });
  return s + luzes;
}
// "E, numa noite, quando ele disse 'Sou eu', os soldados e os guardas que vieram prendê-lo caíram no chão."
function scPromessa(t) {
  const ts = wordTime(7, 'sou'), tc = wordTime(7, 'caíram');
  const s = olival(t, { fala: [ts - 0.1, ts + 0.6], tr: tc - 0.35, tc: tc - 0.05 });
  return { svg: cam(s, 1080, 560, 1.06 - 0.05 * E.inOut(prog(t, at(7), at(8)))), html: '' };
}
// "Ele disse duas palavras, e os soldados e os guardas caíram no chão." (abertura do curto 1)
function scDuasPalavras(t) {
  const tw = wordTime(60, 'disse'), tc = wordTime(60, 'caíram');
  const s = olival(t, { fala: [tw, tw + 0.9], tr: tc - 0.35, tc: tc - 0.05 });
  return { svg: cam(s, 1080, 560, 1.12 - 0.08 * E.inOut(prog(t, seg(60) - 0.4, fim(60)))), html: '' };
}
// "Depois, Jesus atravessou um vale e entrou num olival com os discípulos." (o vale do Cedrom)
function scVale(t) {
  const a0 = at(47) - 0.07, p = prog(t, a0, at(48)), x = lerp(260, 980, p);
  let s = bgNight(t, { moonX: 1500, moonY: 160 });
  s += `<path d="M -400 ${GROUND + 40} C 300 ${GROUND + 120} 700 ${GROUND + 150} 960 ${GROUND + 150} C 1250 ${GROUND + 150} 1600 ${GROUND + 110} ${W + 400} ${GROUND + 30} L ${W + 400} ${H + 40} L -400 ${H + 40} Z" fill="#14181B"/>`;
  s += `<path d="M -200 ${FLOOR_Y + 60} C 400 ${FLOOR_Y + 30} 900 ${FLOOR_Y + 90} ${W + 200} ${FLOOR_Y + 40}" stroke="#2A3A48" stroke-width="26" fill="none" stroke-linecap="round"/>`;
  [[1300, GROUND + 70, 1.1], [1560, GROUND + 50, 1.35], [1820, GROUND + 90, 1.5], [1100, GROUND + 40, 0.8]].forEach(([tx, ty, sc]) => (s += OLIVA(tx, ty, sc)));
  [[-150, 0], [-270, 1], [-390, 2], [-500, 4]].forEach(([d, i]) => (s += person({ ...DISC[i], x: x + d, y: FLOOR_Y - 20 - (i % 2) * 14, s: 1.1, walk: t * 5 + i, look: 1, ol: NIGHT_OL, rim: '#56677A' })));
  s += person({ ...JESUS, x, y: FLOOR_Y, s: 1.25, walk: t * 5, look: 1, mood: 'calm', ol: NIGHT_OL, rim: '#56677A' });
  const cx = lerp(760, 1120, p);
  return { svg: cam(s, cx, 600, 1.06, 960 - cx, 0), html: '' };
}
// "Judas chegou com um destacamento de soldados e guardas, levando tochas, lanternas e armas."
function scChegam(t) {
  const ch = E.inOut(prog(t, at(48), fim(48) - 0.4));
  return { svg: cam(olival(t, { chega: ch }), lerp(1300, 1180, ch), 560, 1.12), html: '' };
}
// "Jesus saiu e perguntou: A quem vocês estão procurando?" e "A Jesus de Nazaré."
function scAQuem(t) {
  const ts = wordTime(49, 'saiu'), passo = E.inOut(prog(t, ts - 0.2, ts + 0.8)), resp = seg(50);
  const p = E.inOut(prog(t, resp - 0.4, resp + 0.4));
  const s = olival(t, { passo, fala: [wordTime(49, 'quem') - 0.2, fim(49)], resp: [resp, fim(50)] });
  return { svg: cam(s, lerp(860, 1180, p), 560, lerp(1.16, 1.22, p)), html: '' };
}
// "Sou eu." Jesus de perto, de pé, calmo. A luz é só a das tochas.
function scSouEu(t) {
  let s = noite(t, { trees: [[300, GROUND + 90, 1.6], [1650, GROUND + 60, 1.3]] });
  s += `<circle cx="1700" cy="600" r="700" fill="url(#gAmber)" opacity="0.22"/>`;
  s += person({ ...JESUS, x: 1240, y: 1040, s: 2.4, look: 1, mood: 'calm', ol: NIGHT_OL, noShadow: true }) + SOMBRA_BAIXO;
  return { svg: cam(s, 1240, 520, 1.0 + 0.04 * prog(t, at(51), at(52))), html: '' };
}
// "Quando Jesus disse 'Sou eu', eles recuaram e caíram por terra."
function scCairam(t) {
  const tr = wordTime(52, 'recuaram'), tc = wordTime(52, 'caíram');
  const s = olival(t, { passo: 1, tr: tr - 0.15, tc: tc - 0.1 });
  return { svg: cam(s, 1180, 560, 1.12 - 0.06 * E.inOut(prog(t, at(52), at(53)))), html: '' };
}
// "O texto não explica por quê." Tudo parado: eles no chão, Jesus de pé.
function scNaoExplica(t) {
  const tc = wordTime(52, 'caíram');
  const s = olival(t, { passo: 1, tr: tc - 6, tc: tc - 5 });
  return { svg: cam(s, lerp(1180, 1060, prog(t, at(53), at(54))), 560, lerp(1.06, 1.0, E.inOut(prog(t, at(53), at(54))))), html: '' };
}
// "No templo, ele tinha dito: antes de Abraão nascer, Eu Sou!" (lembrança, em sépia)
function scNoTemplo(t) {
  return { svg: lembranca(scAntes(t, { ts: wordTime(54, 'sou'), t0: seg(54), a: at(54), b: at(55) })) + `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#2A1E14" opacity="0.38"/>` + SOMBRA_BAIXO, html: '' };
}
// "E, na sarça que não se queimava, quando Moisés perguntou que nome devia dizer ao povo, Deus respondeu:"
// Só o arbusto em chamas, sem figura nenhuma dentro ou acima dele; Moisés de pé, com o cajado.
function deserto(t) {
  let s = `<rect x="-600" y="-600" width="${W + 1200}" height="${H + 600}" fill="url(#skySunrise)"/>` + sun(380, 220, 50, t);
  s += `<path d="M 700 ${GROUND + 10} C 900 380 1150 180 1380 160 C 1600 150 1800 330 2300 ${GROUND + 10} Z" fill="#C9B49E" ${ink(6)}/>`;
  s += `<path d="M 1380 160 C 1500 156 1600 230 1700 330 C 1620 300 1520 300 1440 360 C 1420 300 1400 220 1380 160 Z" fill="#B5A08A"/>`;
  s += hills(GROUND - 30, 40, 0.004, 63, '#E3D1BC');
  s += `<rect x="-400" y="${GROUND}" width="${W + 800}" height="${H - GROUND + 400}" fill="#E9D9C4"/>` + floor('day', 0, GROUND + 60).replace(/url\(#gFloorDay\)/, '#E9D9C4');
  return s;
}
function scSarca(t) {
  const tp = wordTime(55, 'perguntou'), ask = E.out(prog(t, tp - 0.3, tp + 0.3)) * (1 - E.out(prog(t, wordTime(55, 'deus') - 0.3, wordTime(55, 'deus') + 0.3)));
  let s = deserto(t);
  s += sheep(220, FLOOR_Y - 120, 0.8, t, 1) + sheep(360, FLOOR_Y - 90, 0.9, t + 1, 1);
  s += sarca(1300, FLOOR_Y - 20, 1.25, t);
  const M = { ...MOISES, x: 700, y: FLOOR_Y, s: 1.4, look: 1, mood: 'calm', armL: 22, armR: lerp(14, 70, ask) };
  const [hx, hy] = mao(M, -1);
  s += cajado(hx, hy + 120, hy - 200, 1.0) + person(M);
  return { svg: cam(s, lerp(1000, 1080, prog(t, at(55), at(56))), 560, 1.04 + 0.05 * E.inOut(prog(t, at(55), at(56)))), html: '' };
}
// "Eu Sou o que Sou. É isto que você dirá aos israelitas: Eu Sou me enviou a vocês." (Êxodo 3:14)
const scEuSouQueSou = (t) => ({ svg: cam(cartao(t, at(56), { linhas: ['Eu Sou o que Sou'], ref: 'Êxodo 3:14', art: artSarca }), 960, 540, 1.0 + 0.04 * prog(t, at(56), at(57))), html: '' });

// ================================================================ 1. o pão da vida (João 6)
function multidao(t, o = {}) {
  let s = campo(t);
  const r = rng(91);
  for (let row = 0; row < 4; row++) for (let c = 0; c < 15; c++) {
    const x = c * 140 + (row % 2) * 70 - 60 + (r() - 0.5) * 30, y = 690 + row * 46, sc = 0.42 + row * 0.07;
    if (Math.abs(x - 960) < 160 && row > 1) continue;
    s += sentado({ ...povo(5000 + row * 20 + c), x, y, s: sc, look: x < 960 ? 1 : -1, mood: o.mood || 'calm' });
  }
  const J = { ...JESUS, x: 960, y: 780, s: 1.1, look: 0, mood: 'calm', armR: o.bread ? 92 : 14, armL: 14 };
  s += person(J);
  if (o.bread) { const [hx, hy] = mao(J, 1); s += paes(hx + 6, hy - 6, 0.7, 1); }
  s += person({ ...DISC[0], x: 800, y: 770, s: 1.0, look: 1, mood: 'calm' }) + person({ ...DISC[1], x: 1120, y: 770, s: 1.0, look: -1, mood: 'calm', armR: 30 });
  return s;
}
// "A primeira veio depois que ele deu de comer a cerca de cinco mil homens com cinco pães e dois peixinhos."
function scCincoMil(t) {
  const tc = wordTime(8, 'com');
  const A = (tt) => cam(multidao(tt, { bread: tt > seg(8) + 1.5 }), 960, 620, 1.0 + 0.06 * E.inOut(prog(tt, at(8), tc)));
  const B = (tt) => cam(campo(tt) + `<ellipse cx="960" cy="860" rx="360" ry="30" fill="#000" opacity="0.1"/>` + cesto(960, 850, 1.45), 960, 620, 1.04 + 0.05 * prog(tt, tc, at(9)));
  return { svg: xcut(t, tc, A, B) + tag(t, wordTime(8, 'primeira') - 0.1, 1), html: '' };
}
// "No dia seguinte, a multidão atravessou o mar atrás dele." Barcos cheios cruzando o mar (João 6:22-24).
function scBarcos(t) {
  const a0 = at(9), d = (t - a0) * 50;
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skyDay)"/>` + sun(1600, 170, 54, t) + clouds(t, 0);
  s += hills(470, 50, 0.0035, 23, '#E6D3C4') + mar(t, 480, 'day');
  [[300, 610, 0.55, [5101, 5102, 5103, 5104]], [1180, 560, 0.42, [5111, 5112, 5113]], [760, 760, 0.8, [5121, 5122, 5123, 5124, 5125]]].forEach(([x, y, sc, seeds]) => {
    const bx = x + d * sc;
    s += barco(bx, y, sc, { t: t + x, inside: lotado(t, bx, y, sc, seeds), water: aguaEm(y, 480) });
  });
  return { svg: cam(s, 960, 560, 1.0 + 0.05 * E.inOut(prog(t, a0, at(10)))), html: '' };
}
// Na outra margem, Jesus fala à multidão (João 6:25-34).
function margem(t, o = {}) {
  let s = praia(t, { sunX: 1700, sunY: 200, sh: 660, hz: 520 });
  s += barco(1500, 600, 0.55, { t, water: aguaEm(600, 520) }) + barco(1800, 620, 0.6, { t: t + 2, water: aguaEm(620, 520) });
  const crowd = [[1060, 5201], [1220, 5202], [1380, 5203], [1540, 5204], [1700, 5205], [1150, 5206], [1460, 5207]];
  crowd.forEach(([x, sd], i) => {
    const back = i >= 5;
    s += person({ ...povo(sd), x, y: FLOOR_Y - (back ? 70 : 0), s: back ? 1.05 : 1.25, look: -1, mood: o.cmood || 'calm', armL: o.ask ? lerp(16, 100 + 10 * Math.sin(t * 5 + i), o.ask) : 16, noShadow: back });
  });
  s += person({ ...JESUS, x: 560, y: FLOOR_Y, s: 1.35, look: 1, mood: 'calm', armR: o.jarm ?? 14 });
  return s;
}
// "E Jesus disse o motivo: vocês estão me procurando, não porque viram os sinais miraculosos, mas porque comeram os pães..."
function scMotivo(t) {
  const s = margem(t, { jarm: fala(t, seg(10), fim(11), 20, 30) });
  return { svg: cam(s, lerp(1000, 820, E.inOut(prog(t, at(10), at(12)))), 600, 1.08 + 0.06 * prog(t, at(10), at(12))), html: '' };
}
// "E disse que o pão de Deus é aquele que desceu do céu e dá vida ao mundo."
function scPaoDeDeus(t) {
  const tc = wordTime(12, 'céu'), up = E.out(prog(t, tc - 0.5, tc + 0.2)) * (1 - E.in(prog(t, fim(12) - 0.2, at(13))));
  let s = praia(t, { sunX: 1500, sunY: 240, sh: 660, hz: 520 });
  s += person({ ...JESUS, x: 820, y: 1020, s: 2.2, look: 0.5, mood: 'calm', armR: lerp(fala(t, seg(12), tc - 0.4, 22, 20), 160, up), noShadow: true });
  [[1450, 5203], [1700, 5204]].forEach(([x, sd]) => (s += person({ ...povo(sd), x, y: 1060, s: 2.0, look: -1, mood: 'calm', noShadow: true })));
  return { svg: cam(s, 960, 560, 1.0 + 0.06 * E.inOut(prog(t, at(12), at(13)))), html: '' };
}
// "Eles pediram: Senhor, dá-nos sempre desse pão!"
function scDaNos(t) {
  const ask = E.out(prog(t, wordTime(13, 'dános') - 0.4, wordTime(13, 'dános') + 0.2));
  const s = margem(t, { ask, cmood: 'happy', jarm: 14 });
  return { svg: cam(s, 1300, 600, 1.2 + 0.04 * prog(t, at(13), at(14))), html: '' };
}
const scPao = cenaCartao(1, () => at(14), artPao);

// ================================================================ 2. a luz do mundo (João 8:12; 9)
// "A segunda, ele disse em duas ocasiões." Jesus ensinando no templo (João 8:20).
function ensinando(t, o = {}) {
  let s = templo(t, { ox: -200 });
  [[1180, 3121], [1360, 3122], [1540, 3123], [1270, 3124]].forEach(([x, sd], i) => (s += sentado({ ...povo(sd), x, y: FLOOR_Y - 60 - (i === 3 ? 40 : 0), s: i === 3 ? 0.95 : 1.1, look: -1, mood: 'calm' })));
  s += person({ ...JESUS, x: 760, y: FLOOR_Y, s: 1.35, look: 1, mood: 'calm', armR: o.jarm ?? 30 });
  return s;
}
function scSegunda(t) {
  const s = ensinando(t, { jarm: fala(t, seg(15), fim(15), 24, 24) });
  return { svg: cam(s, 1000, 600, 1.06 + 0.04 * prog(t, at(15), at(16))) + tag(t, wordTime(15, 'segunda') - 0.1, 2), html: '' };
}
// "Primeiro, no templo: Eu sou a luz do mundo..."
const tLuz = () => wordTime(16, 'eu') - 0.15;
function scLuz(t) {
  const A = (tt) => cam(ensinando(tt, { jarm: fala(tt, seg(16), tLuz(), 24, 24) }), 900, 600, 1.14);
  const B = (tt) => cam(cartao(tt, tLuz(), { n: 2, ...EUSOU[2], art: artLuz }), 960, 540, 1.0 + 0.03 * prog(tt, tLuz(), at(17)));
  return { svg: xcut(t, tLuz(), A, B), html: '' };
}
// O cego de nascença (João 9:1-7). Ele sentado junto ao muro; Jesus e os discípulos chegam pela direita.
function cegoCena(t, o = {}) {
  let s = rua(t, { ox: o.ox || 0 });
  s += tigela(530, FLOOR_Y - 4, 1.1);
  s += cego({ x: 640, y: FLOOR_Y - 60, s: 1.2, look: 0.4, mud: o.mud || 0, armL: 20, armR: 30 });
  const w = o.walk ?? 0, dx = lerp(560, 0, w), moving = w < 1;
  const point = o.point || 0;
  [[1430, 0, 1.25], [1600, 1, 1.25], [1760, 2, 1.2]].forEach(([x, i, sc]) => (s += person({ ...DISC[i], x: x + dx, y: FLOOR_Y - (i === 2 ? 20 : 0), s: sc, look: -1, mood: i === 0 && point > 0 ? 'sad' : 'calm', armL: i === 0 ? lerp(14, 96, point) : i === 1 ? lerp(14, 60, point) : 14, walk: moving ? t * 5 + i : null })));
  s += person({ ...JESUS, x: 1180 + dx, y: FLOOR_Y, s: 1.3, look: -1, mood: 'calm', armL: o.jarm ?? 14, walk: moving ? t * 5 : null });
  return s;
}
// "Depois, disse de novo, diante de um homem cego de nascença."
function scCego(t) {
  const w = E.out(prog(t, at(17), fim(17) - 0.3));
  return { svg: cam(cegoCena(t, { walk: w }), 960, 560, 1.04 + 0.04 * prog(t, at(17), at(18))), html: '' };
}
// "Os discípulos perguntaram: Mestre, quem pecou...?" e "E Jesus: Nem ele nem seus pais pecaram..."
// Uma cena só (sem fade no começo da resposta, que é onde o curto 3 entra): a câmera vai dos discípulos para Jesus.
function scQuemPecou(t) {
  const tp = wordTime(18, 'mestre'), point = E.out(prog(t, tp - 0.3, tp + 0.3)) * (1 - E.out(prog(t, seg(19) - 0.1, seg(19) + 0.5)));
  const pan = E.inOut(prog(t, seg(19) - 0.1, seg(19) + 1.1));
  const s = cegoCena(t, { walk: 1, point, jarm: fala(t, seg(19), fim(19), 30, 26) });
  return { svg: cam(s, lerp(1200, 940, pan), 600, lerp(1.2, 1.16, pan)), html: '' };
}
// "Os discípulos perguntaram quem tinha pecado para um homem nascer cego." (abertura do curto 3)
function scQuemTinhaPecado(t) {
  const tp = wordTime(63, 'perguntaram'), point = E.out(prog(t, tp - 0.3, tp + 0.3));
  const s = cegoCena(t, { walk: 1, point });
  return { svg: cam(s, lerp(1240, 1200, prog(t, seg(63) - 0.4, fim(63) + 0.6)), 600, 1.2), html: '' };
}
// "E disse: Enquanto estou no mundo, sou a luz do mundo." Os dois de perto.
function scEnquanto(t) {
  let s = rua(t, { ox: 140 });
  s += cego({ x: 700, y: 980, s: 1.9, look: 0.3, armL: 20, armR: 30 });
  s += person({ ...JESUS, x: 1240, y: 1040, s: 2.2, look: -1, mood: 'calm', armL: fala(t, seg(20), fim(20), 20, 24), noShadow: true });
  return { svg: cam(s, 980, 560, 1.0 + 0.05 * prog(t, at(20), at(21))), html: '' };
}
// "Então cuspiu no chão, misturou terra com saliva e passou nos olhos dele." Ele sentado na pedra; Jesus ajoelhado ao lado.
function scLama(t) {
  const tc = wordTime(21, 'cuspiu'), tm = wordTime(21, 'misturou'), tp = wordTime(21, 'passou');
  const mix = prog(t, tm - 0.1, tp - 0.3), reach = E.inOut(prog(t, tp - 0.3, tp + 0.4)), mud = prog(t, tp + 0.2, tp + 0.6);
  let s = rua(t, { ox: 200 });
  s += cego({ x: 820, y: 860, s: 1.9, look: 0.3, mud, armL: 20, armR: 26 });
  if (mix > 0) s += `<ellipse cx="1132" cy="852" rx="${f1(16 + 26 * mix)}" ry="${f1(6 + 9 * mix)}" fill="#6B4A33" ${ink(4)}/>`;
  const stir = mix > 0 && mix < 1 ? Math.sin(t * 14) * 8 : 0;
  const J = { ...JESUS, x: 1010, y: FLOOR_Y, s: 1.9, kneel: true, look: lerp(0.6, -1, reach), mood: 'calm', armR: lerp(t > tc - 0.2 ? 20 + stir : 12, 14, reach), armL: lerp(14, 140, reach), noShadow: true };
  s += person(J);
  // a gota de saliva (pequena), da boca até o chão
  const g = prog(t, tc, tc + 0.35);
  if (g > 0 && g < 1) s += `<circle cx="${f1(lerp(1022, 1130, g))}" cy="${f1(lerp(612, 846, g * g))}" r="5" fill="${C.b300}" ${ink(2)}/>`;
  if (reach > 0.2 && mud < 1) { const [hx, hy] = mao(J, -1); s += lama(hx, hy, 0.9, 1 - mud, 9); }
  return { svg: cam(s, 980, 640, 1.12 + 0.04 * prog(t, at(21), at(22))), html: '' };
}
// "Vá lavar-se no tanque de Siloé." Ele se levanta e vai, com a mão à frente.
function scVaLavar(t) {
  const tv = wordTime(22, 'vá'), go = E.inOut(prog(t, tv + 0.3, at(23) + 0.2));
  let s = rua(t, { ox: 120 });
  s += person({ ...JESUS, x: 760, y: FLOOR_Y, s: 1.4, look: 1, mood: 'calm', armR: lerp(14, 96, E.out(prog(t, tv - 0.3, tv + 0.2))) });
  const x = lerp(1040, 1300, go);
  s += person({ ...CEGO, x, y: FLOOR_Y, s: 1.4, look: 1, mood: 'closed', armR: 80, armL: 20, walk: go > 0 ? t * 4 : null });
  s += lamaOlhos(x, FLOOR_Y, 1.4, 1, 1);
  return { svg: cam(s, 1000, 600, 1.12), html: '' };
}
// "O homem foi, lavou-se e voltou vendo." O tanque de Siloé: degraus de pedra e a água.
function tanque(t) {
  let s = bgDay(t, { sunX: 1600, sunY: 170, seed: 37 });
  s += city(420, GROUND + 8, 0.55, t);
  s += `<path d="M 300 ${FLOOR_Y - 30} L 1660 ${FLOOR_Y - 30} L 1820 ${H + 40} L 140 ${H + 40} Z" fill="${C.g400}" ${ink(6)}/>`;
  s += `<path d="M 380 ${FLOOR_Y - 10} L 1580 ${FLOOR_Y - 10} L 1700 ${H + 40} L 260 ${H + 40} Z" fill="url(#gWater)" ${ink(5)}/>`;
  for (let k = 0; k < 6; k++) { const x = ((k * 260 + t * 30) % 1300) + 360; s += `<path d="M ${f1(x)} ${FLOOR_Y + 60 + (k % 3) * 40} q 30 -8 60 0" stroke="#FFFFFF" stroke-width="5" fill="none" opacity="0.6" stroke-linecap="round"/>`; }
  for (let k = 0; k < 3; k++) s += rect(560 - k * 60, FLOOR_Y - 90 + k * 30, 220 + k * 60, 30, C.g300, ink(5));
  return s;
}
function scVoltouVendo(t) {
  const tl = wordTime(23, 'lavouse'), tv = wordTime(23, 'voltou'), wash = prog(t, tl - 0.3, tv - 0.1), stand = E.out(prog(t, tv - 0.1, tv + 0.5));
  let s = tanque(t);
  const x = 900;
  if (stand <= 0) {
    const hand = 150 + 10 * Math.sin(t * 12);
    s += person({ ...CEGO, x, y: FLOOR_Y - 20, s: 1.35, kneel: true, look: 0, mood: 'closed', armL: wash > 0 ? hand : 20, armR: wash > 0 ? hand : 20, lean: 10 });
    const mudOp = 1 - prog(wash, 0.4, 1);
    s += `<g transform="rotate(10 ${x} ${FLOOR_Y - 20})">${lamaOlhos(x, FLOOR_Y - 20 + 40 * 1.35, 1.35, 0, mudOp)}</g>`;
    if (wash > 0) for (let k = 0; k < 5; k++) { const ph = (t * 2.4 + k / 5) % 1; s += `<circle cx="${f1(x - 60 + k * 30)}" cy="${f1(FLOOR_Y - 120 - ph * 90)}" r="7" fill="${C.b300}" opacity="${f1((1 - ph) * 100) / 100}"/>`; }
  } else {
    s += person({ ...CEGO, x, y: FLOOR_Y - 20, s: 1.35, look: Math.sin((t - tv) * 2.4), mood: 'calm', armL: lerp(20, 150, stand), armR: lerp(20, 150, stand) });
  }
  return { svg: cam(s, 940, 600, 1.1 + 0.05 * prog(t, at(23), at(24))), html: '' };
}

// ================================================================ 3 e 4. a porta e o bom pastor (João 10)
function scOvelhas(t) {
  let s = bgDay(t, { sunX: 1650, sunY: 180, seed: 41 }) + hill(1200, 560, 1500, '#D9CFBF');
  s += curral(1360, FLOOR_Y - 40, 0.75, t, { sheep: false });
  [[1080, FLOOR_Y + 10, 0.8], [1250, FLOOR_Y + 30, 0.9], [1560, FLOOR_Y + 20, 0.85], [1700, FLOOR_Y - 10, 0.75]].forEach(([x, y, sc], i) => (s += sheep(x, y, sc, t + i, i % 2 ? 1 : -1)));
  [[300, 3131], [440, 3132]].forEach(([x, sd]) => (s += person({ ...povo(sd), x, y: FLOOR_Y - 20, s: 1.15, look: 1, mood: 'calm' })));
  s += person({ ...JESUS, x: 720, y: FLOOR_Y, s: 1.3, look: 1, mood: 'calm', armR: fala(t, seg(24), fim(24), 40, 30) });
  return { svg: cam(s, 980, 600, 1.04 + 0.04 * prog(t, at(24), at(25))) + tag(t, wordTime(24, 'terceira') - 0.1, 3, 4), html: '' };
}
const scPorta = cenaCartao(3, () => at(25), artPorta);
const scPastor = cenaCartao(4, () => at(26), artPastor);

// ================================================================ 5. a ressurreição e a vida (João 11)
// "A quinta foi a caminho de um túmulo." Jesus e os discípulos na estrada.
function scACaminho(t) {
  const a0 = at(27), p = prog(t, a0, at(28)), x = lerp(1240, 980, p);
  let s = estrada(t, { ox: -p * 120 });
  [[150, 0], [270, 1], [390, 2]].forEach(([d, i]) => (s += person({ ...DISC[i], x: x + d, y: FLOOR_Y - 30 - (i % 2) * 10, s: 1.15, walk: t * 5 + i, look: -1 })));
  s += person({ ...JESUS, x, y: FLOOR_Y - 20, s: 1.3, walk: t * 5, look: -1, mood: 'calm' });
  return { svg: cam(s, 1000, 600, 1.06) + tag(t, wordTime(27, 'quinta') - 0.1, 5), html: '' };
}
// "Lázaro, amigo de Jesus, estava no sepulcro havia quatro dias." Em Betânia, as irmãs de luto (João 11:17-19).
function scLuto(t) {
  let s = bgDay(t, { sunX: 300, sunY: 180, seed: 55 });
  s += casa(1180, FLOOR_Y - 80, 1.15);
  s += sentado({ ...MARTA, x: 960, y: FLOOR_Y - 70, s: 1.25, look: 0.4, mood: 'sad', armL: 40, armR: 40, rock: C.g400 }) + sentado({ ...MARIA, x: 1180, y: FLOOR_Y - 70, s: 1.25, look: -0.3, mood: 'sad', armL: 40, armR: 40, rock: C.g400 });
  s += lagrimas(960, FLOOR_Y - 30, 1.25, t, 0.8) + lagrimas(1180, FLOOR_Y - 30, 1.25, t + 0.4, 0.8);
  [[640, 3341], [1520, 3342], [1680, 3343]].forEach(([x, sd], i) => (s += person({ ...(i ? mulher(sd) : povo(sd)), x, y: FLOOR_Y, s: 1.2, look: x < 1000 ? 1 : -1, mood: 'sad' })));
  return { svg: cam(s, 1100, 600, 1.06 + 0.05 * prog(t, at(28), at(29))), html: '' };
}
// "A irmã dele, Marta, foi encontrar Jesus antes de ele chegar ao povoado, e disse:" Na estrada, Betânia ao longe.
function scMartaVai(t) {
  const a0 = seg(29) - 0.32, w = E.inOut(prog(t, a0, fim(29) - 0.2));
  let s = estrada(t, { vila: [280, 0.55], seed: 53 });
  s += person({ ...MARTA, x: lerp(380, 820, w), y: FLOOR_Y - 10, s: 1.25, look: 1, mood: 'sad', walk: w < 1 ? t * 5 : null });
  [[1560, 0], [1680, 1], [1800, 2]].forEach(([x, i]) => (s += person({ ...DISC[i], x, y: FLOOR_Y - 40, s: 1.1, look: -1, mood: 'calm' })));
  s += person({ ...JESUS, x: 1340, y: FLOOR_Y - 20, s: 1.3, look: -1, mood: 'calm' });
  return { svg: cam(s, lerp(900, 1060, w), 600, 1.06), html: '' };
}
// A conversa na estrada (João 11:21-27): Marta à esquerda, Jesus à direita.
function encontro(t, o = {}) {
  let s = estrada(t, { vila: [140, 0.5], seed: 53, ox: 60 });
  [[1560, 0], [1680, 1], [1800, 2]].forEach(([x, i]) => (s += person({ ...DISC[i], x, y: FLOOR_Y - 40, s: 1.1, look: -1, mood: 'calm' })));
  const M = { ...MARTA, x: 780, y: FLOOR_Y, s: 1.35, look: 1, mood: o.mm || 'sad', armL: o.ma ?? 20, armR: o.ma ?? 20 };
  s += person(M);
  if (o.tears) s += lagrimas(780, FLOOR_Y, 1.35, t, o.tears);
  s += person({ ...JESUS, x: 1180, y: FLOOR_Y, s: 1.4, look: -1, mood: 'calm', armL: o.ja ?? 14 });
  return s;
}
function scSeEstivesses(t) {
  const s = encontro(t, { ma: 20 + 34 * E.out(prog(t, seg(30), seg(30) + 0.5)), tears: E.out(prog(t, seg(30), seg(30) + 0.8)) });
  return { svg: cam(s, 860, 600, 1.3 + 0.05 * prog(t, at(30), at(31))), html: '' };
}
function scIaRessuscitar(t) {
  const s = encontro(t, { ja: fala(t, seg(31), fim(31), 20, 26), tears: 0.5 });
  return { svg: cam(s, 1100, 600, 1.3 + 0.04 * prog(t, at(31), at(32))), html: '' };
}
function scUltimoDia(t) {
  const s = encontro(t, { mm: 'calm', ma: fala(t, seg(32), fim(32), 24, 20), tears: 0.3 });
  return { svg: cam(s, 980, 600, 1.16 + 0.04 * prog(t, at(32), at(33))), html: '' };
}
const scRessurreicao = cenaCartao(5, () => at(33), artVida, 940);
// "E perguntou: Você crê nisso?" Jesus de perto.
function scVoceCre(t) {
  let s = estrada(t, { seed: 53, ox: 260 });
  s += person({ ...JESUS, x: 1060, y: 1040, s: 2.4, look: -1, mood: 'calm', armL: fala(t, seg(34), fim(34), 20, 20), noShadow: true });
  return { svg: cam(s, 980, 540, 1.0 + 0.06 * prog(t, at(34), at(35))), html: '' };
}
// "E ela: Sim, Senhor, eu tenho crido que tu és o Cristo, o Filho de Deus que devia vir ao mundo."
function scEuCreio(t) {
  let s = estrada(t, { vila: [300, 0.5], seed: 53, ox: -120 });
  s += person({ ...MARTA, x: 900, y: 1040, s: 2.4, look: 1, mood: 'calm', armL: 34, armR: 34, noShadow: true });
  return { svg: cam(s, 940, 540, 1.0 + 0.06 * prog(t, at(35), at(36))), html: '' };
}
// "Depois, na frente do túmulo, ele bradou: Lázaro, venha para fora!" A pedra já tirada (João 11:41).
function scBradou(t) {
  const tl = wordTime(36, 'lázaro'), call = E.out(prog(t, tl - 0.3, tl + 0.2));
  const s = tumulo(t, { open: 1, front: diante(t, { call, mood: 'sad' }) });
  return { svg: cam(s, lerp(820, 940, prog(t, at(36), at(37))), 600, 1.06), html: '' };
}
// Quem está diante do túmulo: Marta, Maria e quem foi consolá-las (João 11:31, 45), e Jesus.
function diante(t, o = {}) {
  let g = '';
  [[150, 3351], [520, 3352]].forEach(([x, sd]) => (g += person({ ...mulher(sd), x, y: FLOOR_Y - 50, s: 1.05, look: 1, mood: o.mood, noShadow: true })));
  [[290, MARTA], [420, MARIA]].forEach(([x, who]) => (g += person({ ...who, x, y: FLOOR_Y, s: 1.25, look: 1, mood: o.mood })));
  return g + person({ ...JESUS, x: 760, y: FLOOR_Y, s: 1.35, look: 1, mood: 'calm', armR: lerp(14, 120, o.call || 0) });
}
// "E o morto saiu, com as mãos e os pés envolvidos em faixas de linho." Ele aparece na boca escura e dá uns passos.
function saida(t, t0, t1) {
  const p = E.out(prog(t, t0, t1)), y = lerp(TB.base - 40, TB.base + 90, p), sc = lerp(0.92, 1.4, p), bob = Math.abs(Math.sin(t * 6)) * 4 * (p > 0 && p < 1 ? 1 : 0);
  const inside = lazaro({ x: TB.x - 6, y: y - bob, s: sc, op: lerp(0.15, 1, clamp(p * 1.6)) });
  return inside;
}
function scSaiu(t, o = {}) {
  const t0 = o.t0 ?? seg(37) - 0.2, t1 = o.t1 ?? fim(37) - 0.4;
  const s = tumulo(t, { open: 1, front: diante(t, { call: 0.35, mood: t > t0 + 0.6 ? 'calm' : 'sad' }), inside: saida(t, t0, t1) });
  const k = prog(t, o.a ?? at(37), o.b ?? at(38));
  return cam(s, lerp(1060, 1120, k), 640, lerp(1.2, 1.3, k));
}
// "Lázaro estava no sepulcro havia quatro dias." (abertura do curto 2) O túmulo fechado.
function scSepulcro(t) {
  const s = tumulo(t, { open: 0 });
  return { svg: cam(s, 1100, 580, 1.14 - 0.08 * E.inOut(prog(t, seg(61) - 0.5, seg(62)))), html: '' };
}
// "E saiu." (abertura do curto 2)
const scESaiu = (t) => ({ svg: scSaiu(t, { t0: seg(62) - 0.3, t1: seg(62) + 0.9, a: at(62), b: seg(63) - 0.4 }), html: '' });

// ================================================================ 6. o caminho, a verdade e a vida (João 14)
function ceia(t, o = {}) {
  let s = sala(t, { lx: 960, ly: 560 });
  [[340, 3], [520, 4], [1400, 5], [1580, 0]].forEach(([x, i]) => (s += sentado({ ...DISC[i], x, y: 760, s: 1.0, look: x < 960 ? 1 : -1, mood: 'calm', ol: NIGHT_OL, rim: C.a300 })));
  s += person({ ...JESUS, x: 820, y: FLOOR_Y, s: 1.3, look: 1, mood: 'calm', armR: o.ja ?? 14, rim: C.a300, ol: NIGHT_OL });
  s += person({ ...TOME, x: 1180, y: FLOOR_Y, s: 1.3, look: -1, mood: o.tm || 'calm', armL: o.ta ?? 14, armR: o.ta ?? 14, rim: C.a300, ol: NIGHT_OL });
  s += mesa(980, 800, 980) + lamparina(980, 790, t) + paes(760, 800, 0.8, 2, NIGHT_OL);
  return s;
}
function scJantar(t) {
  return { svg: cam(ceia(t), 980, 600, 1.0 + 0.05 * prog(t, at(38), at(39))) + tag(t, wordTime(38, 'sexta') - 0.1, 6), html: '' };
}
// "Jesus disse que ia preparar lugar pra eles na casa do Pai. E que eles conheciam o caminho."
function scLugar(t) {
  return { svg: cam(ceia(t, { ja: fala(t, seg(39), fim(40), 22, 28) }), 860, 600, 1.2 + 0.05 * prog(t, at(39), at(41))), html: '' };
}
// "Tomé, o mesmo que depois chamaria Jesus de Senhor meu e Deus meu,"
function scTome(t) {
  let s = sala(t, { lx: 960, ly: 680, glow: 0.5 });
  s += person({ ...TOME, x: 1220, y: 1040, s: 2.4, look: -0.4, mood: 'calm', rim: C.a300, ol: NIGHT_OL, noShadow: true }) + SOMBRA_BAIXO;
  s += `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#gVig)"/>`;
  return { svg: cam(s, 1220, 520, 1.0 + 0.08 * E.inOut(prog(t, at(41), at(42)))), html: '' };
}
// "perguntou: Senhor, não sabemos para onde vais; como então podemos saber o caminho?"
function scComoSaber(t) {
  const q = E.out(prog(t, seg(42) - 0.2, seg(42) + 0.4));
  return { svg: cam(ceia(t, { tm: 'sad', ta: lerp(14, 56, q) }), 1080, 600, 1.24 + 0.04 * prog(t, at(42), at(43))), html: '' };
}
const scCaminho = cenaCartao(6, () => at(43), artCaminho, 940);

// ================================================================ 7. a videira (João 15)
// "A sétima, ele disse na mesma noite." Jesus e os discípulos à noite, ao lado de uma videira.
function scMesmaNoite(t) {
  let s = bgNight(t, { moonX: 1600, moonY: 170 });
  s += videira(1400, FLOOR_Y - 20, 1.0, t, { ol: NIGHT_OL });
  [[300, 0], [430, 1], [560, 2]].forEach(([x, i]) => (s += person({ ...DISC[i], x, y: FLOOR_Y - 30, s: 1.1, look: 1, mood: 'calm', ol: NIGHT_OL, rim: '#56677A' })));
  s += person({ ...JESUS, x: 900, y: FLOOR_Y, s: 1.3, look: -0.6, mood: 'calm', armR: fala(t, seg(44), fim(44), 30, 20), ol: NIGHT_OL, rim: '#56677A' });
  return { svg: cam(s, 980, 600, 1.04 + 0.04 * prog(t, at(44), at(45))) + tag(t, wordTime(44, 'sétima') - 0.1, 7), html: '' };
}
const scVideira = cenaCartao(7, () => at(45), artVideira);
// "E completou: sem mim vocês não podem fazer coisa alguma." Os ramos na videira têm uva; o cortado, não.
function scSemMim(t) {
  let s = bgNight(t, { moonX: 400, moonY: 170, starOp: 0.8 });
  s += `<circle cx="960" cy="520" r="620" fill="url(#gBlue)" opacity="0.12"/>`;
  s += videira(900, FLOOR_Y - 60, 1.5, t, { ol: NIGHT_OL, cut: true });
  return { svg: cam(s, 980, 540, 1.0 + 0.08 * E.inOut(prog(t, at(46), at(47)))), html: '' };
}

// ================================================================ fecho
// "As sete estão no evangelho de João." A lista inteira.
function scAsSete(t) {
  const a0 = seg(57) - 0.18;
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${C.paper}"/><circle cx="960" cy="520" r="760" fill="url(#gAmber)" opacity="0.22"/>`;
  for (let n = 1; n <= 7; n++) {
    const y = 236 + (n - 1) * 94, p = E.out(prog(t, a0 + 0.08 * n, a0 + 0.08 * n + 0.4));
    s += `<g opacity="${f1(p * 100) / 100}" transform="translate(${f1((1 - p) * -30)} 0)">`;
    s += dot(330, y, n, 0.78);
    s += label(400, y + 16, '', { anchor: 'start', fam: 'Lora', w: 600, size: 50, html: `<tspan fill="${C.b500}">Eu sou</tspan> ${esc(EUSOU[n].curta)}` });
    s += label(1620, y + 14, EUSOU[n].ref, { anchor: 'end', fam: 'Geist Mono', w: 500, size: 32, fill: C.muted });
    s += `</g>`;
  }
  return { svg: cam(s, 960, 540, 1.0 + 0.03 * prog(t, a0, at(58))), html: '' };
}
// "Se você quer ler essas sete direto na Bíblia, um pouco por dia, procura PregaAI na Play Store."
// "Das sete, qual você mais precisa ouvir hoje? Me conta aqui embaixo." Alguém lê a Bíblia ao amanhecer (como no longo da
// ressurreição). Durante a frase 58, o cartão do app: "PregaAI", o ícone e o selo oficial da Google Play, que entra e sai
// inteiro com o cartão, sobre fundo branco sólido e com respiro em volta (regras do selo no AGENTS.md). O texto não
// escreve "Android" nem "Play Store": quem fala pelo Android é o selo.
function bgSunrise(t, o = {}) {
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>`;
  s += sun(o.sunX ?? 1500, o.sunY ?? 330, 58, t) + `<circle cx="${o.sunX ?? 1500}" cy="${o.sunY ?? 330}" r="520" fill="url(#gPeach)" opacity="0.35"/>`;
  s += clouds(t, 0, '#FFF6EE', '#F1DCCB');
  s += hills(GROUND - 135, 80, 0.0032, o.seed || 5, '#EBDCCF') + hills(GROUND - 55, 55, 0.0055, (o.seed || 5) + 2, '#E0CFC0');
  s += floor('day');
  return s;
}
function flores(x, y, s, t, seed) {
  const r = rng(seed); let g = '';
  for (let i = 0; i < 6; i++) {
    const dx = (r() - 0.5) * 120, h = 30 + r() * 40, sw = Math.sin(t * 1.6 + i + seed) * 3, col = pick(r, [C.a300, C.r300, '#FFFFFF', C.b300]);
    g += `<line x1="${f1(dx)}" y1="0" x2="${f1(dx + sw)}" y2="${f1(-h)}" stroke="#3E4A3A" stroke-width="5" stroke-linecap="round"/><circle cx="${f1(dx + sw)}" cy="${f1(-h)}" r="10" fill="${col}" ${ink(3)}/>`;
  }
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${g}</g>`;
}
function livro(x, y, s, t, turn) {
  const pg = (side) => `<path d="M ${f1(x)} ${f1(y)} L ${f1(x + side * 112 * s)} ${f1(y - 10 * s)} L ${f1(x + side * 104 * s)} ${f1(y - 74 * s)} L ${f1(x)} ${f1(y - 62 * s)} Z" fill="#FBF9F4" ${ink(4)}/>`;
  let g = `<path d="M ${f1(x - 120 * s)} ${f1(y - 6 * s)} L ${f1(x)} ${f1(y + 8 * s)} L ${f1(x + 120 * s)} ${f1(y - 6 * s)} L ${f1(x + 116 * s)} ${f1(y + 4 * s)} L ${f1(x)} ${f1(y + 18 * s)} L ${f1(x - 116 * s)} ${f1(y + 4 * s)} Z" fill="${C.r600}" ${ink(4)}/>`;
  g += pg(-1) + pg(1);
  for (let k = 0; k < 4; k++) [-1, 1].forEach((sd) => (g += `<line x1="${f1(x + sd * 18 * s)}" y1="${f1(y - (50 - k * 11) * s)}" x2="${f1(x + sd * 92 * s)}" y2="${f1(y - (58 - k * 11) * s)}" stroke="${C.g400}" stroke-width="4" stroke-linecap="round"/>`));
  if (turn > 0 && turn < 1) {
    const k = Math.cos(Math.PI * turn), lift = Math.sin(Math.PI * turn) * 30 * s;
    g += `<path d="M ${f1(x)} ${f1(y)} L ${f1(x + k * 112 * s)} ${f1(y - 10 * s - lift)} L ${f1(x + k * 104 * s)} ${f1(y - 74 * s - lift)} L ${f1(x)} ${f1(y - 62 * s)} Z" fill="#FFFFFF" ${ink(4)}/>`;
  }
  return g;
}
function leitor(t, o = {}) {
  const x = o.x ?? 640;
  let s = bgSunrise(t, { sunX: o.sunX ?? 1460, sunY: o.sunY ?? 400, seed: 31 });
  s += city(1700, GROUND + 4, 0.42, t);
  s += olive(x - 330, GROUND + 250, 2.2) + flores(x + 350, 860, 1.0, t, 12) + flores(x - 560, 850, 0.9, t, 13);
  const rd = { ...LEITOR, x, y: 764, s: 1.3, armL: 32, armR: 32, mood: o.mood || 'closed', look: o.look ?? 0, rock: C.g500 };
  s += sentado(rd);
  const [, hy] = mao(rd, 1);
  const ph = (t % 7) / 7;
  s += livro(x, hy + 34, 0.72, t, prog(ph, 0.86, 1));
  return s;
}
function appCard(t, t0, t1) {
  const p = pop(t, t0, 0.45), q = 1 - E.in(prog(t, t1 - 0.3, t1));
  const k = clamp(p) * q;
  if (k <= 0) return '';
  return `<div class="app" style="position:absolute;left:1010px;top:150px;margin:0;opacity:${f1(k * 100) / 100};transform:scale(${f1(Math.min(p, 1.06) * 100) / 100});transform-origin:50% 50%">
    <div class="app-row"><img class="app-icon" src="assets/icon.png"><div><div class="app-name">PregaAI</div><div class="app-desc">Plano de leitura bíblica</div></div></div>
    <img class="play" src="assets/google-play-badge.png" alt="Disponível no Google Play">
  </div>`;
}
function scLer(t) {
  const s = leitor(t, { mood: 'closed' });
  return { svg: cam(s, 900, 620, 1.02 + 0.04 * prog(t, at(58), at(59))), html: appCard(t, seg(58) + 0.1, fim(58) + 0.5) };
}
function scQualDasSete(t) {
  const s = leitor(t, { mood: 'calm', look: 0.3 });
  return { svg: cam(s, lerp(900, 700, E.inOut(prog(t, at(59), fim(59)))), 640, 1.06 + 0.22 * E.inOut(prog(t, at(59), fim(59) + 0.4))), html: appCard(t, -10, fim(58) + 0.5) };
}

// ================================================================ fim
const scFim = (t) => endCard(t, CARTAO_INICIO, ['Evangelho de João', 'Êxodo 3']);

// ================================================================ linha do tempo
// Nos pontos onde os curtos começam (frases 19, 29 e 47) a cena já está inteira no 1º quadro do trecho
// (começa 0,32 s antes da frase), e onde terminam (23, 37 e 56) a seguinte só entra depois da pausa.
const SCENES = [
  // abertura
  { a: 0, b: at(1), f: scPedras, ref: 'João 8:59' },
  { a: at(1), b: at(2), f: scAbraao, ref: 'João 8:56' },
  { a: at(2), b: at(3), f: scCinquenta, ref: 'João 8:57' },
  { a: at(3), b: at(4), f: (t) => ({ svg: scAntes(t), html: '' }), ref: 'João 8:58' },
  { a: at(4), b: at(5), f: scEscondeu, ref: 'João 8:59' },
  { a: at(5), b: at(6), f: scEuSou, ref: null },
  { a: at(6), b: at(7), f: scSete, ref: null },
  { a: at(7), b: at(8), f: scPromessa, ref: 'João 18:6', dark: true },
  // 1. o pão da vida
  { a: at(8), b: at(9), f: scCincoMil, ref: 'João 6:9-10' },
  { a: at(9), b: at(10), f: scBarcos, ref: 'João 6:22-24' },
  { a: at(10), b: at(12), f: scMotivo, ref: 'João 6:26' },
  { a: at(12), b: at(13), f: scPaoDeDeus, ref: 'João 6:33' },
  { a: at(13), b: at(14), f: scDaNos, ref: 'João 6:34' },
  { a: at(14), b: at(15), f: scPao, ref: null },
  // 2. a luz do mundo
  { a: at(15), b: at(16), f: scSegunda, ref: 'João 8:20' },
  { a: at(16), b: at(17), f: scLuz, ref: null },
  { a: at(17), b: at(18), f: scCego, ref: 'João 9:1' },
  { a: at(18), b: at(20), f: scQuemPecou, ref: [[at(18), 'João 9:2'], [seg(19) - 0.2, 'João 9:3']] },
  { a: at(20), b: at(21), f: scEnquanto, ref: 'João 9:5' },
  { a: at(21), b: at(22), f: scLama, ref: 'João 9:6' },
  { a: at(22), b: at(23), f: scVaLavar, ref: 'João 9:7' },
  { a: at(23), b: seg(24) - 0.18, f: scVoltouVendo, ref: null },
  // 3 e 4. a porta e o bom pastor
  { a: seg(24) - 0.18, b: at(25), f: scOvelhas, ref: 'João 10' },
  { a: at(25), b: at(26), f: scPorta, ref: null },
  { a: at(26), b: at(27), f: scPastor, ref: null },
  // 5. a ressurreição e a vida
  { a: at(27), b: at(28), f: scACaminho, ref: 'João 11:11' },
  { a: at(28), b: seg(29) - 0.32, f: scLuto, ref: 'João 11:17-19' },
  { a: seg(29) - 0.32, b: at(30), f: scMartaVai, ref: 'João 11:20, 30' },
  { a: at(30), b: at(31), f: scSeEstivesses, ref: 'João 11:21' },
  { a: at(31), b: at(32), f: scIaRessuscitar, ref: 'João 11:23' },
  { a: at(32), b: at(33), f: scUltimoDia, ref: 'João 11:24' },
  { a: at(33), b: at(34), f: scRessurreicao, ref: null },
  { a: at(34), b: at(35), f: scVoceCre, ref: 'João 11:26' },
  { a: at(35), b: at(36), f: scEuCreio, ref: 'João 11:27' },
  { a: at(36), b: at(37), f: scBradou, ref: 'João 11:38-43' },
  { a: at(37), b: at(38), f: (t) => ({ svg: scSaiu(t), html: '' }), ref: 'João 11:44' },
  // 6. o caminho, a verdade e a vida
  { a: at(38), b: at(39), f: scJantar, ref: 'João 13:2', dark: true },
  { a: at(39), b: at(41), f: scLugar, ref: 'João 14:2-4', dark: true },
  { a: at(41), b: at(42), f: scTome, ref: 'João 20:28', dark: true },
  { a: at(42), b: at(43), f: scComoSaber, ref: 'João 14:5', dark: true },
  { a: at(43), b: at(44), f: scCaminho, ref: null },
  // 7. a videira
  { a: at(44), b: at(45), f: scMesmaNoite, ref: null, dark: true },
  { a: at(45), b: at(46), f: scVideira, ref: null },
  { a: at(46), b: seg(47) - 0.32, f: scSemMim, ref: null, dark: true },
  // o olival
  { a: seg(47) - 0.32, b: at(48), f: scVale, ref: 'João 18:1', dark: true },
  { a: at(48), b: at(49), f: scChegam, ref: 'João 18:3', dark: true },
  { a: at(49), b: at(51), f: scAQuem, ref: 'João 18:4-5', dark: true },
  { a: at(51), b: at(52), f: scSouEu, ref: null, dark: true },
  { a: at(52), b: at(53), f: scCairam, ref: 'João 18:6', dark: true },
  { a: at(53), b: at(54), f: scNaoExplica, ref: null, dark: true },
  { a: at(54), b: at(55), f: scNoTemplo, ref: 'João 8:58', dark: true },
  { a: at(55), b: at(56), f: scSarca, ref: 'Êxodo 3:2, 13' },
  { a: at(56), b: seg(57) - 0.18, f: scEuSouQueSou, ref: null },
  // fecho
  { a: seg(57) - 0.18, b: at(58), f: scAsSete, ref: null },
  { a: at(58), b: at(59), f: scLer, ref: null },
  { a: at(59), b: 287.5, f: scQualDasSete, ref: null },
  // aberturas dos curtos (só nos curtos): entram secas, sem a cena vizinha por baixo
  { a: 287.5, b: 293.0, f: scDuasPalavras, ref: 'João 18:6', dark: true, cut: true },
  { a: 293.0, b: at(62), f: scSepulcro, ref: 'João 11:17', cut: true },
  { a: at(62), b: 298.05, f: scESaiu, ref: 'João 11:44' },
  { a: 298.05, b: CARTAO_INICIO, f: scQuemTinhaPecado, ref: 'João 9:2', cut: true },
  // cartão final (o longo pula das frases do longo direto para cá: corte.json, cartao_inicio)
  { a: CARTAO_INICIO, b: DURATION + 1, f: scFim, ref: null, end: true, cut: true },
];
