// Pedro, você me ama? (João 21; Lucas 22; João 13; 2 Pedro 1). Vídeo longo, 1920×1080.
// L(parte, linha) é o índice da frase em SEGS (as partes do roteiro.md). Cada cena começa em at(i).
// Mesmo traço e mesma câmera do longo da ressurreição (depois-da-cruz). Jesus ressuscitado em pé, com rosto.
// A morte de Pedro não aparece: a Bíblia não narra; só a frase de João 21:18 (as mãos estendidas, outro o veste e o leva).

const L = (part, line) => PARTS[part - 1] + line;
const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];
const FLOOR_Y = 880; // pés dos personagens em primeiro plano (a legenda começa em ~920)
const NIGHT_OL = '#0E0D0C';

const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const VIVO = { ...JESUS, robe: '#FFFFFF' }; // ressuscitado
const PEDRO = { robe: C.p500, skin: '#C68B59', hair: '#5A3A28', beard: true, cover: null };
const VELHO = { ...PEDRO, hair: C.g300 }; // Pedro velho (João 21:18)
const JOAO = { ...man(1002), robe: C.g400, beard: false, hair: '#3A2A20', cover: null, skin: '#C68B59' }; // o discípulo amado
const TOME = { ...man(1103), robe: C.oliveDk, beard: true, cover: null, hair: '#191919', skin: '#A86B3C' };
const DISC = [JOAO, TOME, { ...man(1243), beard: true, cover: null }, { ...man(1244), beard: true, cover: null }, { ...man(1245), beard: false, cover: null }, { ...man(1246), beard: true, cover: null }];
const CRIADA = { ...man(2101), beard: false, cover: '#E2D8CF', robe: C.g500, skin: '#A86B3C' };
const HOMEM1 = { ...man(2102), cover: null, beard: true, robe: C.ch300 };
const HOMEM2 = { ...man(2103), cover: C.g300, beard: true, robe: C.g700 };
const soldado = (seed) => ({ ...man(seed), cover: null, beard: false, robe: C.p600, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26 });

// Sombra na faixa da legenda, para a legenda clara ler em cima de roupa clara (closes à noite).
const SOMBRA_BAIXO = `<linearGradient id="gBaixo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/></linearGradient><rect x="-200" y="760" width="${W + 400}" height="${H}" fill="url(#gBaixo)"/>`;
// Corte dentro de uma cena, no meio da frase: cruza de A para B no mesmo tempo das trocas de cena.
// Sentado no chão (ou numa pedra baixa): o corpo ajoelhado com as pernas para a frente.
function sentado(o) {
  const s = o.s || 1, col = o.sil || C.g800, sw = o.sil ? 0 : f1(4 * s);
  const legs = [-15, 15].map((dx) => `<rect x="${f1(o.x + (dx - 9) * s)}" y="${f1(o.y + 18 * s)}" width="${f1(18 * s)}" height="${f1(60 * s)}" rx="${f1(9 * s)}" fill="${col}" stroke="${o.sil || o.ol || C.ink}" stroke-width="${sw}"/>`).join('');
  return opg(o.op ?? 1, legs + person({ ...o, kneel: true, noShadow: true, op: 1 }));
}
// Lembrança (Lucas 5, a última ceia): a cena em sépia, com vinheta.
const SEPIA = `<filter id="fSepia"><feColorMatrix type="matrix" values="0.42 0.74 0.18 0 0.02  0.36 0.68 0.16 0 0.01  0.27 0.52 0.13 0 0  0 0 0 1 0"/></filter>`;
const lembranca = (svg) => SEPIA + `<g filter="url(#fSepia)">${svg}</g><rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#gVig)"/>`;
// Cor do mar (mar() do lib.js) na altura y, para a água que cobre o fundo do barco não ficar como uma faixa.
const MAR_COR = { day: [C.b400, C.b500], dawn: ['#6F8FA6', '#3E5A70'], night: ['#202C38', '#121A22'] };
function aguaEm(y, hz, tom = 'day') {
  const [a, b] = MAR_COR[tom].map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))), k = clamp((y - hz) / (H - hz + 600)); // o mar() pinta até H + 600
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], k)).toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------- cenários
// Praia do mar da Galileia: céu (amanhecer ou dia), a outra margem, o mar e a areia (sh).
function praia(t, o = {}) {
  const ox = o.ox || 0, hz = o.hz ?? 560, sh = o.sh ?? 700, dawn = o.ceu === 'dawn';
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#${dawn ? 'skyDawn' : 'skySunrise'})"/>`;
  if (dawn) s += stars(t, 70, 11, hz - 120, 0.35) + `<circle cx="${o.glowX ?? 1450}" cy="${hz}" r="760" fill="url(#gPeach)" opacity="${o.glow ?? 0.3}"/>`;
  else {
    const sx = (o.sunX ?? 1240) - ox * 0.1, sy = o.sunY ?? hz - 80;
    if (o.sun !== false) s += sun(sx, sy, 58, t) + `<circle cx="${sx}" cy="${sy}" r="520" fill="url(#gPeach)" opacity="0.35"/>`;
    s += clouds(t, ox, '#FFF6EE', '#F1DCCB');
  }
  s += hills(hz - 10, 46, 0.0035, o.seed || 21, dawn ? '#27303B' : '#E6D3C4', ox * 0.2);
  s += mar(t, hz, o.agua || (dawn ? 'dawn' : 'day'), ox);
  if (sh) {
    let d = `M -400 ${sh}`;
    for (let x = -400; x <= W + 400; x += 60) d += ` L ${x} ${f1(sh + Math.sin(x * 0.02 + t * 1.3) * 5)}`;
    s += `<path d="${d}" stroke="#FFFFFF" stroke-width="10" fill="none" opacity="${dawn ? 0.35 : 0.7}" stroke-linecap="round"/>` + floor(dawn ? 'dusk' : 'day', ox, sh + 4);
  }
  return s;
}
// Mar à noite, sem areia.
function noiteMar(t, o = {}) {
  const hz = o.hz ?? 600;
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skyNight)"/>` + stars(t, 110, 11, hz - 60, 1);
  if (o.moon !== false) s += moon(o.moonX ?? 1560, o.moonY ?? 200, 46, '#14181D');
  s += hills(hz - 10, 46, 0.0035, 21, '#1A1F24');
  s += mar(t, hz, 'night', o.ox || 0);
  return s;
}
// Parede de pedra do pátio à noite, com a luz quente da fogueira.
function patio(t, fx = 960, fy = 860, glow = 1) {
  let s = `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#14110F"/>`;
  for (let r = 0; r < 11; r++) for (let c = 0; c < 12; c++) {
    const x = c * 200 - (r % 2) * 100 - 80, y = -20 + r * 62;
    s += `<rect x="${x + 4}" y="${y}" width="192" height="56" rx="8" fill="${(r * 7 + c * 3) % 5 ? '#2A2420' : '#302925'}" stroke="#0E0B09" stroke-width="5"/>`;
  }
  s += floor('dusk', 0, 640);
  s += `<circle cx="${fx}" cy="${fy - 80}" r="${f1(700 * glow)}" fill="url(#gAmber)" opacity="${f1(0.42 * glow * 100) / 100}"/>`;
  return s;
}
function fogueira(x, y, s, t) {
  return `<path d="M ${x - 70 * s} ${y} L ${x + 70 * s} ${y - 24 * s} M ${x - 70 * s} ${y - 24 * s} L ${x + 70 * s} ${y}" stroke="${C.wood}" stroke-width="${f1(18 * s)}" stroke-linecap="round"/>` + flames(x, y - 6 * s, s, t, 3) + embers(x, y - 60 * s, t, 8, 5, 160 * s);
}
// Brasas com peixe em cima (João 21:9): fogo baixo, dois peixes numa grelha de gravetos.
function brasas(x, y, s, t, nPeixe = 2) {
  let g = `<ellipse cx="${x}" cy="${y + 4 * s}" rx="${f1(120 * s)}" ry="${f1(22 * s)}" fill="#3A2A20"/>`;
  for (let k = 0; k < 9; k++) g += `<circle cx="${f1(x + (k - 4) * 24 * s)}" cy="${f1(y - 6 * s + Math.sin(k * 2.3) * 6 * s)}" r="${f1(14 * s)}" fill="${k % 3 ? C.r400 : C.a400}" opacity="${f1((0.75 + 0.25 * Math.sin(t * 6 + k)) * 100) / 100}"/>`;
  g += flames(x, y - 10 * s, s * 0.55, t, 4);
  g += `<path d="M ${f1(x - 130 * s)} ${f1(y - 50 * s)} L ${f1(x + 130 * s)} ${f1(y - 50 * s)} M ${f1(x - 120 * s)} ${f1(y - 36 * s)} L ${f1(x - 120 * s)} ${f1(y)} M ${f1(x + 120 * s)} ${f1(y - 36 * s)} L ${f1(x + 120 * s)} ${f1(y)}" stroke="${C.wood}" stroke-width="${f1(9 * s)}" stroke-linecap="round"/>`;
  for (let k = 0; k < nPeixe; k++) g += peixe(x + (k - (nPeixe - 1) / 2) * 110 * s, y - 62 * s, 1.2 * s, 0, k % 2 ? '#C9A27C' : '#B98E66');
  return g;
}
// Sala da última ceia: parede de pedra quente, mesa e lamparina.
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
// Galo em silhueta; "crow" abre o bico.
function galo(x, y, s, crow) {
  const b = crow ? 1 : 0;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M -60 0 C -90 -40 -110 -110 -70 -150 C -40 -110 -40 -70 -20 -60 Z" fill="#1A1714"/>
    <ellipse cx="0" cy="-40" rx="62" ry="44" fill="#1A1714"/>
    <path d="M 30 -70 C 40 -110 60 -130 70 -150 C 84 -130 80 -100 60 -66 Z" fill="#1A1714"/>
    <circle cx="66" cy="-150" r="22" fill="#1A1714"/>
    <path d="M 56 -176 C 60 -192 72 -192 72 -178 C 78 -192 90 -188 86 -172 Z" fill="${C.r600}"/>
    <path d="M 86 ${-154 - 6 * b} L ${112 + 4 * b} ${-150 - 10 * b} L 88 -148 Z" fill="${C.a400}"/>
    <path d="M 86 -146 L ${110 + 4 * b} ${-138 + 10 * b} L 88 -142 Z" fill="${C.a400}"/>
    <path d="M -10 0 L -14 40 M 14 0 L 18 40" stroke="${C.a600}" stroke-width="8" stroke-linecap="round"/>
  </g>`;
}
// Pergaminho aberto, com os rolos nas pontas; o.num escreve um número numa das linhas.
function pergaminho(x, y, w, h, o = {}) {
  let s = rect(x - w / 2, y - h / 2, w, h, '#EFE3CC', ink(6));
  s += rect(x - w / 2 - 34, y - h / 2 - 22, 44, h + 44, '#C9A77A', `rx="20" ${ink(6)}`) + rect(x + w / 2 - 10, y - h / 2 - 22, 44, h + 44, '#C9A77A', `rx="20" ${ink(6)}`);
  const n = o.linhas || 7, r = rng(o.seed || 31);
  for (let k = 0; k < n; k++) {
    const yy = y - h / 2 + 50 + k * ((h - 90) / (n - 1)), x1 = x + w / 2 - 50 - r() * 160;
    if (o.num && k === (o.linhaNum ?? 3)) {
      s += `<line x1="${x - w / 2 + 50}" y1="${f1(yy)}" x2="${x - 80}" y2="${f1(yy)}" stroke="#8C7A62" stroke-width="7" stroke-linecap="round"/>`;
      s += `<text x="${x + 20}" y="${f1(yy + 22)}" text-anchor="middle" font-family="Lora" font-weight="600" font-size="64" fill="${C.inkDeep}">${o.num}</text>`;
      s += `<line x1="${x - 40}" y1="${f1(yy + 36)}" x2="${f1(x - 40 + 120 * (o.sub ?? 0))}" y2="${f1(yy + 36)}" stroke="${C.b500}" stroke-width="7" stroke-linecap="round"/>`;
      s += `<line x1="${x + 90}" y1="${f1(yy)}" x2="${f1(x1)}" y2="${f1(yy)}" stroke="#8C7A62" stroke-width="7" stroke-linecap="round"/>`;
    } else s += `<line x1="${x - w / 2 + 50}" y1="${f1(yy)}" x2="${f1(x1)}" y2="${f1(yy)}" stroke="#8C7A62" stroke-width="7" stroke-linecap="round"/>`;
  }
  return s;
}
// Pessoas dentro do barco: pés na linha do convés (y - 46*s do barco).
function tripulacao(t, bx, by, bs, o = {}) {
  let g = '';
  const xs = o.xs || [-230, -150, -70, 10, 90, 170, 240];
  xs.forEach((dx, i) => {
    const who = i === (o.iPedro ?? 3) ? PEDRO : DISC[i % DISC.length];
    g += person({ ...who, x: bx + dx * bs, y: by - 46 * bs, s: (o.ps || 0.62) * bs, look: o.look ?? (dx < 0 ? 0.6 : -0.6), mood: o.mood || 'calm', sil: o.sil, rim: o.rim, ol: o.ol, armL: o.arms ? o.arms(i, t)[0] : 14, armR: o.arms ? o.arms(i, t)[1] : 14, lean: o.lean ? o.lean(i, t) : 0, noShadow: true });
  });
  return g;
}

// ================================================================ 1. abertura
// "Cento e cinquenta e três peixes numa rede só. Alguém contou." A rede cheia na areia.
function scPeixes(t) {
  let s = praia(t, { sunX: 1500, sunY: 470, ceu: 'sun' });
  s += rede(260, 660, 1660, 660, 300, 46, { id: 'r1', t, fs: 1.15, seed: 11, bg: '#3E5A70', bgOp: 0.25 });
  return { svg: cam(s, 960, 700, 1.04 + 0.06 * E.inOut(prog(t, 0, at(1)))), html: '' };
}
// "Foi numa praia, depois que Jesus ressuscitou." Jesus de pé na beira, o sol nascendo.
function scPraiaJesus(t) {
  const a0 = at(1);
  let s = praia(t, { sunX: 1180, sunY: 500, ox: -40 * prog(t, a0, at(2)) });
  s += person({ ...VIVO, x: 1180, y: 820, s: 1.0, look: -0.4, mood: 'calm' });
  s += fogueira(860, 830, 0.45, t);
  return { svg: cam(s, 1100, 720, 1.0 + 0.06 * E.inOut(prog(t, a0, at(2)))), html: '' };
}
// "Na areia, uma fogueira já estava acesa. Com peixe em cima."
function scBrasas(t) {
  const a0 = at(2), fish = t > wordTime(2, 'peixe') - 0.3;
  let s = praia(t, { sunX: 1560, sunY: 470, sh: 640 });
  s += brasas(960, 840, 1.9, t, fish ? 2 : 0);
  return { svg: cam(s, 960, 760, 1.0 + 0.08 * E.inOut(prog(t, a0, at(3)))), html: '' };
}
// "Jesus fez a mesma pergunta a Pedro três vezes. E, na terceira, Pedro ficou magoado."
function scPergunta(t) {
  const a0 = at(3), hurt = t > seg(4) - 0.1, p = E.inOut(prog(t, seg(4) - 0.4, seg(4) + 0.8));
  let s = praia(t, { sunX: 1500, sunY: 470 });
  s += fogueira(960, 860, 0.5, t);
  s += person({ ...VIVO, x: 660, y: FLOOR_Y, s: 1.3, look: 1, mood: 'calm', armR: fala(t, seg(3), fim(3), 22, 34) });
  s += person({ ...PEDRO, x: 1260, y: FLOOR_Y, s: 1.3, flip: true, look: 1, mood: hurt ? 'sad' : 'calm', armL: hurt ? 30 : 14, armR: hurt ? 30 : 14 });
  if (hurt) s += lagrimas(1260, FLOOR_Y, 1.3, t, E.out(prog(t, seg(4) + 0.3, seg(4) + 1.0)));
  return { svg: cam(s, lerp(960, 1180, p), 640, lerp(1.0, 1.22, p)), html: '' };
}
// "Naquela manhã, Jesus avisou Pedro de como ele ia morrer." Pedro de perto, ouvindo.
function scAviso(t) {
  const a0 = at(5);
  let s = praia(t, { sunX: 600, sunY: 470, sh: 650 });
  s += person({ ...VIVO, x: 420, y: 1020, s: 2.2, look: 1, mood: 'calm', armR: fala(t, seg(5), fim(5), 20, 26), noShadow: true });
  s += person({ ...PEDRO, x: 1260, y: 1040, s: 2.3, flip: true, look: 1, mood: 'fear', t, noShadow: true });
  return { svg: cam(s, 1000, 640, 1.0 + 0.07 * E.inOut(prog(t, a0, at(6)))), html: '' };
}
// "Pra entender por que aquela pergunta machucou, a gente precisa ver outra fogueira." A fogueira da praia
// vira a do pátio. "A da noite em que Jesus foi preso."
const tOutra = () => wordTime(6, 'outra');
function scOutraFogueira(t) {
  const a0 = at(6);
  const A = (tt) => praia(tt, { sunX: 1560, sunY: 470, sh: 640 }) + fogueira(960, 860, 1.6, tt);
  const B = (tt) => patio(tt, 960, 860) + fogueira(960, 860, 1.6, tt);
  return { svg: cam(xcut(t, tOutra(), A, B), 960, 760, 1.0 + 0.1 * E.inOut(prog(t, a0, at(7)))), html: '' };
}
function scPreso(t) {
  const a0 = at(7), walk = t * 5, x = lerp(700, 1060, prog(t, a0, at(8)));
  let s = bgNight(t, { moonX: 1500, moonY: 200 });
  s += person({ ...soldado(2121), x: x - 200, y: FLOOR_Y, s: 1.2, walk, ol: NIGHT_OL });
  s += person({ ...JESUS, x, y: FLOOR_Y, s: 1.25, walk, mood: 'sad', ol: NIGHT_OL, look: 0.4 });
  s += person({ ...soldado(2122), x: x + 200, y: FLOOR_Y, s: 1.2, walk, ol: NIGHT_OL });
  s += person({ ...PEDRO, x: lerp(120, 300, prog(t, a0, at(8))), y: 760, s: 0.62, walk: t * 6, ol: NIGHT_OL, look: 1 });
  return { svg: cam(s, 900, 640, 1.0 + 0.06 * E.inOut(prog(t, a0, at(8)))), html: '' };
}

// ================================================================ 2. a primeira fogueira
// "Na última ceia, Pedro prometeu: Darei a minha vida por ti! Jesus respondeu: Antes que o galo cante..."
function ceia(t, o = {}) {
  const promise = E.out(prog(t, o.tp ?? wordTime(8, 'darei'), (o.tp ?? wordTime(8, 'darei')) + 0.6)), jr = t > (o.tj ?? seg(9)) - 0.1;
  let s = sala(t, { lx: 960, ly: 640 });
  s += sentado({ ...man(1250), x: 1560, y: 780, s: 1.0, look: -1, mood: 'calm', ol: NIGHT_OL, rim: C.a300 });
  s += sentado({ ...man(1251), x: 380, y: 780, s: 1.0, look: 1, mood: 'calm', ol: NIGHT_OL, rim: C.a300 });
  s += person({ ...JESUS, x: 700, y: FLOOR_Y, s: 1.3, look: 1, mood: jr ? 'sad' : 'calm', armR: jr ? fala(t, o.tj ?? seg(9), o.tj1 ?? fim(9), 30, 26) : 14, rim: C.a300, ol: NIGHT_OL });
  s += person({ ...PEDRO, x: 1220, y: FLOOR_Y, s: 1.3, flip: true, look: 1, mood: 'happy', armL: lerp(14, 70, promise), armR: lerp(14, 130, promise), rim: C.a300, ol: NIGHT_OL });
  s += mesa(960, 800, 900) + lamparina(960, 790, t) + paes(780, 800, 0.8, 2, NIGHT_OL);
  return s;
}
function scCeia(t) {
  const p = E.inOut(prog(t, seg(9) - 0.5, seg(9) + 0.8));
  return { svg: cam(ceia(t), lerp(1150, 780, p), 620, 1.14), html: '' };
}
// "Guarda essa promessa. Ela vai voltar." Pedro de perto, na luz da lamparina.
function scGuarda(t) {
  const a0 = at(10);
  let s = sala(t, { lx: 960, ly: 700, glow: 0.5 });
  s += person({ ...PEDRO, x: 960, y: 1040, s: 2.4, look: 0, mood: 'happy', armR: 150, armL: 14, rim: C.a300, ol: NIGHT_OL, noShadow: true }) + SOMBRA_BAIXO;
  s += `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#gVig)"/>`;
  return { svg: cam(s, 960, 520, 1.0 + 0.1 * E.inOut(prog(t, a0, at(11)))), html: '' };
}
// "Naquela mesma noite, perto de uma fogueira, no pátio do sumo sacerdote, Pedro negou Jesus três vezes."
function scNegou(t) {
  const a0 = at(11), tn = wordTime(11, 'negou'), neg = t > tn - 0.1;
  let s = patio(t, 960, 860);
  s += fogueira(960, 860, 0.9, t);
  [[640, 2131], [760, 2132]].forEach(([x, sd]) => (s += sentado({ ...soldado(sd), x, y: 800, s: 0.95, look: 1, rim: C.a300, ol: NIGHT_OL })));
  const acc = [[CRIADA, 330, wordTime(11, 'pedro') - 0.2], [HOMEM1, 1500, tn - 0.1], [HOMEM2, 1680, wordTime(11, 'três') - 0.1]];
  acc.forEach(([o, x, t0]) => {
    const pp = pop(t, t0, 0.35);
    if (pp > 0) s += person({ ...o, x, y: FLOOR_Y, s: 1.2 * pp, flip: x > 960, look: x < 960 ? 1 : 1, mood: 'angry', armR: lerp(14, 92, clamp(pp)), rim: C.a300, ol: NIGHT_OL });
  });
  s += person({ ...PEDRO, x: 1200, y: FLOOR_Y, s: 1.3, look: neg ? -1 : -0.3, mood: neg ? 'fear' : 'calm', armL: neg ? 44 : 14, armR: neg ? 44 : 14, shake: neg ? 4 : 0, t, rim: C.a300, ol: NIGHT_OL });
  return { svg: cam(s, 960, 640, 1.0 + 0.06 * E.inOut(prog(t, a0, at(12)))), html: '' };
}
// "O galo cantou. Lucas conta que Jesus se virou e olhou direto pra Pedro."
function scGaloOlhar(t) {
  const tg = wordTime(12, 'galo'), tl = wordTime(12, 'lucas'), tv = wordTime(12, 'virou'), tp = wordTime(12, 'pedro');
  const G = (tt) => {
    let s = bgNight(tt, { sky: 'skyDawn', moon: false, starOp: 0.6 });
    s += `<rect x="-40" y="700" width="${W + 80}" height="80" fill="#1E2226" stroke="${NIGHT_OL}" stroke-width="6"/>`;
    s += galo(960, 700, 1.7, tt > tg && tt < tg + 1.6 && Math.sin((tt - tg) * 14) > -0.3);
    return cam(s, 960, 560, 1.0 + 0.1 * E.out(prog(tt, tg - 0.3, tg + 0.8)));
  };
  const J = (tt) => {
    const turn = E.inOut(prog(tt, tv - 0.2, tv + 0.7));
    let s = patio(tt, 960, 900, 0.6);
    s += person({ ...JESUS, x: 960, y: 1040, s: 2.4, look: lerp(-1, 1, turn), flip: turn < 0.5, mood: 'sad', rim: C.a300, ol: NIGHT_OL, noShadow: true }) + SOMBRA_BAIXO;
    return cam(s, 960, 560, 1.0 + 0.05 * E.inOut(prog(tt, tl, tp)));
  };
  const P = (tt) => {
    let s = patio(tt, 960, 900, 0.6);
    s += person({ ...PEDRO, x: 960, y: 1040, s: 2.4, look: -1, mood: 'sad', rim: C.a300, ol: NIGHT_OL, noShadow: true }) + SOMBRA_BAIXO;
    return cam(s, 960, 560, 1.0 + 0.06 * E.inOut(prog(tt, tp, at(13))));
  };
  return { svg: xcut(t, tp - 0.15, (tt) => xcut(tt, tl, G, J), P), html: '' };
}
// "E Pedro saiu dali e chorou amargamente."
function scChorou(t) {
  const a0 = at(13), out = E.inOut(prog(t, seg(13), seg(13) + 0.9)), cry = t > wordTime(13, 'chorou') - 0.1;
  let s = bgNight(t, { moon: false, starOp: 0.5 });
  s += `<rect x="1300" y="300" width="420" height="380" fill="#2A2420" stroke="${NIGHT_OL}" stroke-width="6"/><rect x="1400" y="440" width="140" height="240" rx="70" fill="${C.a300}" opacity="0.55"/>`;
  s += person({ ...PEDRO, x: lerp(1420, 900, out), y: FLOOR_Y, s: 1.4, walk: !cry ? t * 6 : null, kneel: cry, lean: cry ? 16 : 0, mood: cry ? 'closed' : 'sad', look: -0.5, armL: cry ? 24 : 14, armR: cry ? 24 : 14, ol: NIGHT_OL });
  if (cry) s += lagrimas(900, FLOOR_Y + 40 * 1.4, 1.4, t, E.out(prog(t, wordTime(13, 'chorou'), wordTime(13, 'chorou') + 0.6)));
  return { svg: cam(s, 980, 640, 1.0 + 0.08 * E.inOut(prog(t, a0, at(14)))), html: '' };
}

// ================================================================ 3. a pescaria
// "Depois da ressurreição, no mar da Galileia, Pedro disse aos outros: Vou pescar." "Nós vamos com você."
function scVouPescar(t) {
  const a0 = at(14), tv = wordTime(14, 'vou'), tn = seg(15);
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skyDusk)"/><circle cx="1500" cy="560" r="700" fill="url(#gPeach)" opacity="0.35"/>`;
  s += hills(550, 46, 0.0035, 21, '#3B2D26') + mar(t, 560, 'dawn') + floor('dusk', 0, 700);
  s += barco(1380, 690, 0.75, { t, water: aguaEm(690, 560, 'dawn') });
  const point = E.out(prog(t, tv - 0.3, tv + 0.3)), yes = E.out(prog(t, tn - 0.1, tn + 0.4));
  s += person({ ...PEDRO, x: 900, y: FLOOR_Y, s: 1.3, look: 1, mood: 'calm', armR: lerp(14, 100, point), rim: C.p300, ol: NIGHT_OL });
  [[260, 0], [430, 1], [600, 2]].forEach(([x, i]) => (s += person({ ...DISC[i], x, y: FLOOR_Y - (i % 2) * 14, s: 1.2, look: 1, mood: yes > 0.5 ? 'happy' : 'calm', armR: lerp(14, 120, yes), rim: C.p300, ol: NIGHT_OL })));
  return { svg: cam(s, 900, 640, 1.0 + 0.06 * E.inOut(prog(t, a0, at(16)))), html: '' };
}
// "Eram sete no barco. E, naquela noite, não pegaram nada." A rede volta vazia.
function scNoiteBarco(t) {
  const a0 = at(16), ts = wordTime(16, 'sete'), pull = E.inOut(prog(t, wordTime(16, 'nada') - 1.2, fim(16)));
  let s = noiteMar(t, { moonX: 1500, moonY: 210 });
  const inside = tripulacao(t, 960, 640, 1.25, { sil: '#0B0D10', ps: 0.62, mood: 'sad' });
  const pp = pop(t, ts - 0.2, 0.4);
  s += barco(960, 640, 1.25, { t, inside: pp > 0 ? opg(clamp(pp), inside) : '', water: aguaEm(640, 600, 'night'), ol: NIGHT_OL, fill: '#4A3A2E', mast: true });
  s += rede(1300, 600, 1470, 640 - 120 * pull, 160 - 120 * pull, 0, { id: 'r2', ol: NIGHT_OL, col: '#8C96A0', bg: '#000', bgOp: 0.2 });
  return { svg: cam(s, 960, 560, 1.0 + 0.06 * E.inOut(prog(t, a0, at(17)))), html: '' };
}
// "Ao amanhecer, tinha um homem na praia. Eles não reconheceram."
function scAmanhecer(t) {
  const a0 = at(17);
  let s = praia(t, { ceu: 'dawn', glowX: 1500, sh: 760, hz: 520 });
  s += barco(560, 640, 0.85, { t, inside: tripulacao(t, 560, 640, 0.85, { look: 1, sil: '#1A1E24', ps: 0.62 }), water: aguaEm(640, 520, 'dawn'), fill: '#5A4234', ol: NIGHT_OL });
  s += person({ ...VIVO, x: 1480, y: 900, s: 1.05, sil: '#2A2F36', rim: C.p300 });
  return { svg: cam(s, 1000, 640, 1.0 + 0.06 * E.inOut(prog(t, a0, at(18)))), html: '' };
}
// "Ele disse: Lancem a rede do lado direito do barco."
function scLancem(t) {
  const a0 = at(18), tl = wordTime(18, 'lancem'), th = E.out(prog(t, wordTime(18, 'direito') - 0.2, fim(18) + 0.4));
  let s = praia(t, { ceu: 'dawn', glowX: 400, sh: 780, hz: 520 });
  s += person({ ...VIVO, x: 330, y: 940, s: 1.1, look: 1, mood: 'calm', armR: lerp(14, 100, E.out(prog(t, tl - 0.4, tl + 0.2))), rim: C.p300, ol: NIGHT_OL });
  s += barco(1180, 650, 0.9, { t, inside: tripulacao(t, 1180, 650, 0.9, { look: -0.6, ps: 0.62, ol: NIGHT_OL, arms: (i) => (i >= 5 ? [14, lerp(14, 150, th)] : [14, 14]) }), water: aguaEm(650, 520, 'dawn'), fill: '#5A4234', ol: NIGHT_OL });
  if (th > 0) s += rede(1460, 590, lerp(1480, 1760, th), lerp(600, 640, th), 30 + 110 * th, 0, { id: 'r3', ol: NIGHT_OL, col: '#DCD3C8', bgOp: 0.1 });
  return { svg: cam(s, 1000, 640, 1.0 + 0.05 * E.inOut(prog(t, a0, at(19)))), html: '' };
}
// "E a rede encheu tanto que eles não conseguiam puxar." Embaixo d'água, a rede se enche.
function scRedeCheia(t) {
  const a0 = at(19), fill = prog(t, seg(19) - 0.2, seg(19) + 2.2), n = Math.round(48 * E.out(fill)), q = 1 - prog(t, fim(19) + 0.2, at(20));
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skyDawn)"/><circle cx="400" cy="300" r="700" fill="url(#gPeach)" opacity="0.3"/>`;
  s += mar(t, 380, 'dawn');
  s += `<rect x="-600" y="380" width="${W + 1200}" height="${H}" fill="#1D3446" opacity="0.35"/>`;
  s += barco(960, 380, 1.0, { t, inside: tripulacao(t, 960, 380, 1.0, { look: 0.6, ps: 0.62, ol: NIGHT_OL, lean: (i) => (i >= 4 ? -18 : 0), arms: (i) => (i >= 4 ? [60, 60] : [14, 14]) }), water: aguaEm(380, 380, 'dawn'), fill: '#5A4234', ol: NIGHT_OL });
  s += `<path d="M 1200 370 L 1280 480" stroke="#DCD3C8" stroke-width="5"/>`;
  s += rede(1180, 480, 1780, 500, 300, n, { id: 'r4', t, fs: 1.0, ol: NIGHT_OL, col: '#DCD3C8', seed: 7, bgOp: 0.18 });
  return { svg: cam(s, 1150, 520, 1.0 + 0.05 * E.inOut(prog(t, a0, at(20))), Math.sin(t * 31) * 4 * fill * q, 0), html: '' };
}
// "No dia em que Jesus chamou Pedro, nesse mesmo mar, tinha sido igual: a noite inteira sem nada,
// e depois a rede cheia." Lembrança de Lucas 5, em sépia.
function scLembranca(t) {
  const td = wordTime(20, 'depois');
  const A = (tt) => {
    let s = noiteMar(tt, { moonX: 1500, moonY: 200 });
    s += barco(900, 640, 1.2, { t: tt, inside: person({ ...PEDRO, x: 820, y: 585, s: 0.85, mood: 'sad', look: 0.4, ol: NIGHT_OL, noShadow: true }) + person({ ...DISC[2], x: 1020, y: 585, s: 0.8, mood: 'sad', ol: NIGHT_OL, noShadow: true }), water: aguaEm(640, 600, 'night'), ol: NIGHT_OL, fill: '#4A3A2E' });
    s += rede(1240, 600, 1400, 620, 90, 0, { id: 'r5', ol: NIGHT_OL, col: '#8C96A0' });
    return cam(s, 960, 560, 1.0 + 0.05 * E.inOut(prog(tt, at(20), td)));
  };
  const B = (tt) => {
    const k = E.out(prog(tt, td + 0.2, fim(20)));
    let s = praia(tt, { sunX: 1500, sunY: 380, sh: 0, hz: 460 });
    s += barco(760, 520, 1.1, { t: tt, inside: person({ ...JESUS, x: 640, y: 470, s: 0.8, mood: 'calm', look: 1, noShadow: true }) + person({ ...PEDRO, x: 860, y: 470, s: 0.85, mood: 'fear', look: 1, armL: 60, armR: 60, noShadow: true }), water: aguaEm(520, 460) });
    s += rede(1000, 520, 1640, 560, 300, 40, { id: 'r6', t: tt, fs: 0.95, seed: 9, rasga: k, bgOp: 0.15 });
    return cam(s, 1100, 560, 1.0 + 0.05 * E.inOut(prog(tt, td, at(21))));
  };
  return { svg: lembranca(xcut(t, td, A, B)), html: '' };
}
// "O discípulo que Jesus amava disse a Pedro: É o Senhor!"
function scEoSenhor(t) {
  const a0 = at(21), te = wordTime(21, 'senhor'), point = E.out(prog(t, wordTime(21, 'é') - 0.4, wordTime(21, 'é') + 0.1)), turn = E.inOut(prog(t, te - 0.2, te + 0.5));
  let s = praia(t, { sunX: 1600, sunY: 420, sh: 0, hz: 470 });
  const inside = person({ ...JOAO, x: 720, y: 780, s: 1.35, look: 1, mood: 'happy', armR: lerp(14, 110, point) }) + person({ ...PEDRO, x: 1160, y: 780, s: 1.4, look: lerp(-1, 1, turn), flip: turn < 0.5, mood: turn > 0.5 ? 'fear' : 'calm' });
  s += barco(960, 860, 2.1, { t, inside, water: aguaEm(860, 470) });
  return { svg: cam(s, 960, 600, 1.0 + 0.05 * E.inOut(prog(t, a0, at(22)))), html: '' };
}
// "Pedro não esperou o barco. Vestiu a capa e se jogou no mar."
function scPula(t) {
  const a0 = at(22), tv = wordTime(22, 'vestiu'), tj = wordTime(22, 'jogou');
  let s = praia(t, { sunX: 1600, sunY: 420, sh: 0, hz: 460 });
  const cloak = E.out(prog(t, tv - 0.1, tv + 0.5));
  const jump = prog(t, tj - 0.2, tj + 0.7);
  let inside = person({ ...DISC[0], x: 600, y: 650, s: 0.95, look: 1, mood: 'happy', noShadow: true }) + person({ ...DISC[1], x: 460, y: 650, s: 0.9, look: 1, noShadow: true });
  const P = { ...PEDRO, robe: cloak > 0.5 ? C.p600 : C.p500, armL: lerp(14, 150, E.out(jump)), armR: lerp(14, 150, E.out(jump)), mood: 'happy', look: 1 };
  if (jump <= 0) inside += person({ ...P, x: 860, y: 650, s: 1.0, armL: lerp(14, 40, cloak), armR: lerp(14, 40, cloak), noShadow: true });
  s += barco(640, 720, 1.4, { t, inside, water: aguaEm(720, 460) });
  if (jump > 0 && jump < 1) {
    const fx = lerp(860, 1240, jump), fy = lerp(650, 900, jump) - Math.sin(jump * Math.PI) * 220; // pés de Pedro
    s += `<g transform="rotate(${f1(lerp(0, 120, jump))} ${f1(fx)} ${f1(fy - 150)})">${person({ ...P, x: fx, y: fy, s: 1.0, noShadow: true })}</g>`;
  }
  if (jump >= 1) {
    const ls = t - (tj + 0.7), sx = 1260 + ls * 180;
    for (let k = 0; k < 3; k++) { const r = (ls * 1.4 + k * 0.33) % 1; s += `<ellipse cx="${f1(1240)}" cy="840" rx="${f1(40 + r * 220)}" ry="${f1(10 + r * 40)}" fill="none" stroke="#FFFFFF" stroke-width="6" opacity="${f1((1 - r) * 0.8 * 100) / 100}"/>`; }
    s += `<circle cx="${f1(sx)}" cy="820" r="34" fill="${PEDRO.skin}" ${ink(5)}/><path d="M ${f1(sx - 34)} 812 C ${f1(sx - 30)} 780 ${f1(sx + 30)} 780 ${f1(sx + 34)} 812 Z" fill="${PEDRO.hair}"/>`;
    const arm = Math.sin(ls * 7);
    s += `<path d="M ${f1(sx - 20)} 830 q ${f1(-40 - 30 * arm)} ${f1(-50 * Math.max(0, arm))} ${f1(-80)} 10" stroke="${PEDRO.skin}" stroke-width="18" fill="none" stroke-linecap="round"/>`;
    s += `<rect x="-200" y="836" width="${W + 400}" height="400" fill="#4F8FD0" opacity="0.92"/>`;
  }
  return { svg: cam(s, 960, 600, 1.0 + 0.04 * E.inOut(prog(t, a0, at(23)))), html: '' };
}
// "Na praia, de novo, uma fogueira. Peixe nas brasas. E pão."
function scFogueiraPraia(t) {
  const a0 = at(23), tp = wordTime(23, 'pão');
  let s = praia(t, { sunX: 1500, sunY: 440, sh: 640, hz: 500 });
  s += brasas(1000, 860, 1.5, t, t > wordTime(23, 'peixe') - 0.2 ? 2 : 0);
  if (t > tp - 0.2) s += opg(E.out(prog(t, tp - 0.2, tp + 0.2)), paes(1400, 880, 1.2, 3));
  s += sentado({ ...VIVO, x: 560, y: 790, s: 1.25, look: 1, mood: 'calm', armR: 40 });
  return { svg: cam(s, 980, 700, 1.0 + 0.06 * E.inOut(prog(t, a0, at(24)))), html: '' };
}
// "Pedro arrastou a rede pra praia. Cento e cinquenta e três peixes grandes."
function scArrasta(t) {
  const a0 = at(24), drag = E.inOut(prog(t, seg(24), wordTime(24, 'cento') + 0.4)), tc = wordTime(24, 'cento');
  let s = praia(t, { sunX: 1550, sunY: 440, sh: 700, hz: 520 });
  const nx = lerp(900, 640, drag);
  s += person({ ...PEDRO, x: nx - 300, y: FLOOR_Y, s: 1.3, flip: true, look: -1, lean: -14, mood: 'happy', armL: 70, armR: 70, walk: drag < 1 ? t * 4 : null });
  s += `<path d="M ${f1(nx - 230)} 720 L ${f1(nx + 40)} 760" stroke="${C.wood}" stroke-width="7"/>`;
  s += rede(nx, 700, nx + 960, 690, 200, 44, { id: 'r7', t, fs: 1.15, seed: 13, bgOp: 0.15 });
  return { svg: cam(s, 960, 640, 1.0 + 0.05 * E.inOut(prog(t, a0, at(25)))), html: '' };
}
// "E a rede não rasgou." "Da primeira vez, as redes começaram a rasgar." (a rede de Lucas 5, em sépia)
function scNaoRasgou(t) {
  const tr = seg(26);
  const A = (tt) => {
    let s = praia(tt, { sunX: 1600, sunY: 420, sh: 560, hz: 470 });
    s += rede(160, 600, 1760, 600, 340, 52, { id: 'r8', t: tt, fs: 1.3, seed: 17, bgOp: 0.15 });
    return cam(s, 960, 700, 1.1 + 0.08 * E.inOut(prog(tt, at(25), tr)));
  };
  const B = (tt) => {
    const k = E.out(prog(tt, tr + 0.3, fim(26)));
    let s = praia(tt, { sunX: 1500, sunY: 380, sh: 0, hz: 400 });
    s += `<rect x="-600" y="400" width="${W + 1200}" height="${H}" fill="#1D3446" opacity="0.25"/>`;
    s += rede(300, 480, 1620, 500, 380, 46, { id: 'r9', t: tt, fs: 1.15, seed: 19, rasga: k, bgOp: 0.15 });
    return lembranca(cam(s, 960, 640, 1.04 + 0.05 * E.inOut(prog(tt, tr, at(27)))));
  };
  return { svg: xcut(t, tr - 0.1, A, B), html: '' };
}
// "A Bíblia não explica o número. Só registra."
function scNumero(t) {
  const a0 = at(27), sub = E.out(prog(t, wordTime(27, 'registra') - 0.2, wordTime(27, 'registra') + 0.5));
  let s = `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#E9E1D8"/><circle cx="960" cy="480" r="760" fill="url(#gAmber)" opacity="0.35"/>`;
  s += pergaminho(960, 470, 1100, 560, { num: '153', linhaNum: 3, sub, linhas: 7 });
  return { svg: cam(s, 960, 470, 1.0 + 0.08 * E.inOut(prog(t, a0, at(28)))), html: '' };
}
// "Venham comer." "Ninguém teve coragem de perguntar quem ele era. Eles sabiam que era o Senhor."
function scVenhamComer(t) {
  const a0 = at(28), tv = seg(28), give = E.out(prog(t, tv - 0.2, tv + 0.4));
  let s = praia(t, { sunX: 1600, sunY: 430, sh: 640, hz: 500 });
  s += brasas(960, 820, 1.0, t, 2);
  const VJ = { ...VIVO, x: 960, y: 720, s: 1.15, look: 0, mood: 'calm', armR: lerp(14, 70, give), armL: lerp(14, 70, give) };
  s += person(VJ);
  [[300, 0, 1], [520, 2, 1], [1440, 3, -1], [1640, 1, -1]].forEach(([x, i, lk]) => (s += sentado({ ...DISC[i], x, y: 840, s: 1.15, look: t > seg(29) ? lk * Math.sin(t * 1.4 + i) : lk, mood: 'calm' })));
  s += sentado({ ...PEDRO, x: 1230, y: 860, s: 1.2, look: -1, mood: 'calm' });
  return { svg: cam(s, 960, 640, 1.0 + 0.05 * E.inOut(prog(t, a0, at(30)))), html: '' };
}

// ================================================================ 4. as três perguntas
// Jesus e Pedro na beira, de manhã; os outros, longe, perto do fogo. o.z: quanto a câmera chega.
function perguntas(t, o) {
  let s = praia(t, { sunX: 1650, sunY: 300, sh: 690, hz: 520, agua: 'day' });
  [[1400, 1], [1500, 2], [1620, 3]].forEach(([x, i]) => (s += sentado({ ...DISC[i], x, y: 720, s: 0.55, look: -1, mood: 'calm' })));
  s += person({ ...VIVO, x: 640, y: FLOOR_Y, s: 1.35, look: 1, mood: o.jm || 'calm', armR: o.ja ?? 14 });
  s += person({ ...PEDRO, x: 1100, y: FLOOR_Y, s: 1.35, flip: true, look: 1, mood: o.pm || 'calm', armL: o.pa ?? 14, armR: o.pr ?? 14, kneel: o.kneel });
  if (o.extra) s += o.extra;
  return s;
}
function scPergunta1(t) {
  const a0 = at(30), ans = t > seg(31) - 0.1, p = E.inOut(prog(t, seg(31) - 0.4, seg(31) + 0.6));
  const s = perguntas(t, { ja: fala(t, wordTime(30, 'simão'), fim(30), 24, 30), pm: ans ? 'happy' : 'calm', pa: ans ? 140 : 14 });
  return { svg: cam(s, lerp(760, 980, p), 640, 1.12 + 0.04 * p), html: '' };
}
// "Cuide dos meus cordeiros." Os cordeirinhos aparecem em volta de Pedro.
function scCordeiros(t) {
  const a0 = at(32);
  let extra = '';
  [[1240, 860, 0.55, -1], [1340, 900, 0.5, -1], [960, 900, 0.5, 1], [1430, 860, 0.45, -1]].forEach(([x, y, sc, lk], i) => {
    const pp = pop(t, wordTime(32, 'cordeiros') - 0.3 + i * 0.12, 0.4);
    if (pp > 0) extra += sheep(x, y, sc * pp, t, lk);
  });
  const s = perguntas(t, { ja: fala(t, seg(32), fim(32), 30, 30), pm: 'happy', extra });
  return { svg: cam(s, 900, 640, 1.16 + 0.04 * E.inOut(prog(t, a0, at(33)))), html: '' };
}
function scPergunta2(t) {
  const ans = t > seg(34) - 0.1, p = E.inOut(prog(t, seg(34) - 0.4, seg(34) + 0.6));
  const s = perguntas(t, { ja: fala(t, wordTime(33, 'simão'), fim(33), 24, 30), pm: ans ? 'calm' : 'calm', pa: ans ? 140 : 14 });
  return { svg: cam(s, lerp(780, 1000, p), 620, 1.25 + 0.04 * p), html: '' };
}
// "Pastoreie as minhas ovelhas." Pedro com o rebanho no morro.
function rebanho(t, o = {}) {
  let s = bgDay(t, { sunX: 1600, sunY: 220, seed: 41 }) + hill(1000, 560, 1500, '#D9CFBF');
  const walk = o.walk || 0;
  [[560, 760, 0.85], [700, 820, 0.95], [860, 780, 0.8], [400, 840, 0.95], [1020, 840, 1.0], [260, 790, 0.8], [1180, 800, 0.85]].forEach(([x, y, sc], i) => (s += sheep(x + walk * 120, y, sc, t + i, 1)));
  const P = { ...(o.who || PEDRO), x: 1380 + walk * 120, y: FLOOR_Y, s: 1.3, look: -1, mood: 'happy', armR: 30, walk: o.walk ? t * 4 : null };
  s += person(P);
  const [hx, hy] = mao(P, 1);
  s += `<path d="M ${f1(hx)} ${f1(hy - 120)} L ${f1(hx)} ${f1(hy + 150)} M ${f1(hx)} ${f1(hy - 120)} q -40 -10 -40 30" stroke="${C.wood}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  return s;
}
function scOvelhas(t) {
  return { svg: cam(rebanho(t), 960, 640, 1.0 + 0.06 * E.inOut(prog(t, at(35), at(36)))), html: '' };
}
// "E pela terceira vez: Simão, filho de João, você me ama?" Jesus de perto.
function scPergunta3(t) {
  const a0 = at(36);
  let s = praia(t, { sunX: 1650, sunY: 300, sh: 690, hz: 520, agua: 'day' });
  s += person({ ...VIVO, x: 900, y: 1040, s: 2.4, look: 1, mood: 'calm', armR: fala(t, wordTime(36, 'simão'), fim(36), 20, 20), noShadow: true });
  return { svg: cam(s, 960, 560, 1.0 + 0.06 * E.inOut(prog(t, a0, at(37)))), html: '' };
}
// "A Bíblia diz que Pedro ficou magoado. Por causa da terceira vez."
function scMagoado(t) {
  const a0 = at(37);
  let s = praia(t, { sunX: 400, sunY: 300, sh: 690, hz: 520, agua: 'day' });
  s += person({ ...PEDRO, x: 1000, y: 1040, s: 2.4, look: -1, mood: 'sad', noShadow: true });
  s += lagrimas(1000, 1040, 2.4, t, E.out(prog(t, wordTime(37, 'magoado') - 0.2, wordTime(37, 'magoado') + 0.6)));
  return { svg: cam(s, 1000, 560, 1.0 + 0.07 * E.inOut(prog(t, a0, at(38)))), html: '' };
}
// "Três perguntas. Pedro tinha negado três vezes." De um lado a manhã na praia; do outro, a noite no pátio.
function scTres(t) {
  const a0 = at(38);
  const dia = praia(t, { sunX: 1700, sunY: 360, sh: 690, hz: 520, agua: 'day' }) + person({ ...VIVO, x: 1240, y: FLOOR_Y, s: 1.1, look: 1, mood: 'calm' }) + person({ ...PEDRO, x: 1560, y: FLOOR_Y, s: 1.1, flip: true, look: 1, mood: 'sad' });
  const noite = patio(t, 480, 860) + fogueira(480, 860, 0.7, t) + person({ ...PEDRO, x: 600, y: FLOOR_Y, s: 1.1, look: -1, mood: 'fear', rim: C.a300, ol: NIGHT_OL }) + person({ ...CRIADA, x: 300, y: FLOOR_Y, s: 1.05, look: 1, mood: 'angry', armR: 80, rim: C.a300, ol: NIGHT_OL });
  let s = `<clipPath id="cDia"><rect x="960" y="-200" width="${W}" height="${H + 400}"/></clipPath><clipPath id="cNoite"><rect x="-200" y="-200" width="1160" height="${H + 400}"/></clipPath>`;
  s += `<g clip-path="url(#cNoite)">${noite}</g><g clip-path="url(#cDia)">${dia}</g><line x1="960" y1="-50" x2="960" y2="${H + 50}" stroke="${C.inkDeep}" stroke-width="10"/>`;
  return { svg: cam(s, 960, 540, 1.0 + 0.03 * E.inOut(prog(t, a0, at(39)))), html: '' };
}
// "Senhor, tu sabes todas as coisas e sabes que te amo." "Cuide das minhas ovelhas."
function scResposta3(t) {
  const a0 = at(39), hand = E.out(prog(t, seg(40) - 0.3, seg(40) + 0.3));
  const s = perguntas(t, { pm: 'sad', pa: 50, pr: 50, kneel: true, ja: lerp(14, 70, hand), jm: 'calm' });
  return { svg: cam(s, 880, 660, 1.2 + 0.05 * E.inOut(prog(t, a0, at(41)))), html: '' };
}
// "Jesus não falou da negação. Nenhuma vez." Os dois andam juntos na beira.
function scNenhumaVez(t) {
  const a0 = at(41), x = lerp(700, 980, prog(t, a0, at(42)));
  let s = praia(t, { sunX: 1650, sunY: 300, sh: 690, hz: 520, agua: 'day', ox: (t - a0) * 30 });
  s += person({ ...VIVO, x, y: FLOOR_Y, s: 1.3, walk: t * 4, look: 0.6, mood: 'calm' });
  s += person({ ...PEDRO, x: x + 260, y: FLOOR_Y, s: 1.3, walk: t * 4 + 1, look: -0.6, mood: 'calm' });
  return { svg: cam(s, x + 130, 640, 1.08), html: '' };
}
// "Ao homem que tinha negado três vezes, Jesus deu as ovelhas dele pra cuidar."
function scPastor(t) {
  return { svg: cam(rebanho(t, { walk: prog(t, at(42), at(43)) }), 960, 640, 1.0 + 0.05 * E.inOut(prog(t, at(42), at(43)))), html: '' };
}

// ================================================================ 5. a morte de Pedro (só a frase de Jesus)
// "Depois, Jesus falou da morte de Pedro." "Quando você era mais jovem, vestia-se e ia para onde queria."
function scJovem(t) {
  const tj = seg(44);
  const A = (tt) => {
    let s = praia(tt, { sunX: 1650, sunY: 300, sh: 690, hz: 520, agua: 'day' });
    s += person({ ...VIVO, x: 760, y: 1020, s: 2.2, look: 1, mood: 'calm', armR: fala(tt, seg(43), fim(43), 20, 22), noShadow: true });
    s += person({ ...PEDRO, x: 1460, y: 1020, s: 2.2, flip: true, look: 1, mood: 'fear', t: tt, noShadow: true });
    return cam(s, 1100, 600, 1.0 + 0.05 * E.inOut(prog(tt, at(43), tj)));
  };
  const B = (tt) => {
    const belt = E.out(prog(tt, wordTime(44, 'vestiase') - 0.3, wordTime(44, 'vestiase') + 0.5)), go = prog(tt, wordTime(44, 'ia') - 0.2, at(45));
    let s = bgDay(tt, { sunX: 1600, sunY: 220, seed: 43, ox: go * 200 });
    const P = { ...PEDRO, x: lerp(820, 1260, go), y: FLOOR_Y, s: 1.35, look: go > 0 ? 1 : 0, mood: 'happy', armL: go > 0 ? 14 : lerp(14, 50, belt), armR: go > 0 ? 14 : lerp(14, 50, belt), walk: go > 0 ? tt * 6 : null };
    s += person(P);
    s += `<rect x="${f1(P.x - 52 * 1.35)}" y="${f1(P.y - 118 * 1.35)}" width="${f1(104 * 1.35 * belt)}" height="${f1(14 * 1.35)}" rx="6" fill="${C.wood}" ${ink(4)}/>`;
    return cam(s, 1000, 640, 1.0 + 0.04 * E.inOut(prog(tt, tj, at(45))));
  };
  return { svg: xcut(t, tj - 0.1, A, B), html: '' };
}
// "Mas, quando for velho, estenderá as mãos, e outra pessoa o vestirá e o levará para onde você não deseja ir."
function scVelho(t) {
  const a0 = at(45), te = wordTime(45, 'estenderá'), tv = wordTime(45, 'vestirá'), tl = wordTime(45, 'levará');
  const hands = E.out(prog(t, te - 0.2, te + 0.5)), come = E.out(prog(t, tv - 1.2, tv)), belt = E.out(prog(t, tv - 0.1, tv + 0.6)), go = prog(t, tl, at(46));
  let s = bgGloom(t, { seed: 9 }) + cidadeSil(1720, 640, 0.9, '#B9B0A6');
  const x = lerp(900, 1120, go);
  const P = { ...VELHO, x, y: FLOOR_Y, s: 1.35, look: go > 0 ? 1 : -0.5, mood: 'sad', armL: lerp(14, 70, hands), armR: lerp(14, 70, hands), walk: go > 0 ? t * 3 : null };
  s += person(P);
  s += `<rect x="${f1(x - 52 * 1.35)}" y="${f1(FLOOR_Y - 118 * 1.35)}" width="${f1(104 * 1.35 * belt)}" height="${f1(14 * 1.35)}" rx="6" fill="${C.g700}" ${ink(4)}/>`;
  s += person({ ...man(1290), cover: null, beard: false, robe: C.ch300, x: lerp(300, x - 230, come) + go * 0, y: FLOOR_Y, s: 1.3, look: 1, mood: 'calm', armR: lerp(14, 80, belt), walk: come < 1 || go > 0 ? t * 3 : null });
  return { svg: cam(s, 960, 640, 1.0 + 0.05 * E.inOut(prog(t, a0, at(46)))), html: '' };
}
function cidadeSil(x, base, s, fill) {
  const r = (a, b, c, d) => `<rect x="${a}" y="${b}" width="${c}" height="${d}"/>`;
  let g = r(-300, -120, 600, 120) + r(-340, -190, 70, 190) + r(270, -190, 70, 190);
  [[-220, 150, 110], [-100, 200, 100], [10, 236, 120], [140, 170, 100]].forEach(([hx, hh, hw]) => (g += r(hx, -hh, hw, hh)));
  return `<g transform="translate(${x} ${base}) scale(${s})" fill="${fill}">${g}</g>`;
}
// "A Bíblia não narra a morte de Pedro." "Mas explica essa frase: era o tipo de morte com que Pedro ia glorificar a Deus."
function scNaoNarra(t) {
  const a0 = at(46), lit = E.out(prog(t, wordTime(47, 'glorificar') - 0.6, wordTime(47, 'glorificar') + 0.6));
  let s = `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#E9E1D8"/>`;
  s += beam(960, -60, 960, 900, 120, 520, 0.2 + 0.6 * lit);
  s += pergaminho(960, 520, 1100, 520, { linhas: 6, seed: 37 });
  return { svg: cam(s, 960, 520, 1.0 + 0.06 * E.inOut(prog(t, a0, at(48)))), html: '' };
}
// "Mais tarde, numa carta, o próprio Pedro escreveu: Sei que em breve deixarei este tabernáculo..."
function scCarta(t) {
  const a0 = at(48);
  let s = sala(t, { lx: 1500, ly: 380, glow: 0.45 });
  s += lamparina(1500, 520, t) + rect(1440, 520, 120, 20, C.wood, ink(5, NIGHT_OL));
  const P = { ...VELHO, x: 860, y: 700, s: 1.35, armL: 30, armR: 52 + 6 * Math.sin(t * 9), mood: 'calm', look: 0.4, ol: NIGHT_OL, rim: C.a300 };
  s += sentado(P);
  s += rect(560, 720, 800, 34, C.wood, `rx="10" ${ink(6, NIGHT_OL)}`) + rect(600, 754, 720, 120, '#7A5A40', ink(6, NIGHT_OL));
  const n = Math.floor(prog(t, seg(48), fim(48)) * 7);
  s += rect(700, 690, 520, 36, '#EFE3CC', `rx="6" ${ink(5, NIGHT_OL)}`);
  for (let k = 0; k < 6; k++) if (k < n) s += `<line x1="${730 + k * 80}" y1="708" x2="${790 + k * 80}" y2="708" stroke="#8C7A62" stroke-width="6" stroke-linecap="round"/>`;
  const [hx, hy] = mao(P, 1);
  s += `<line x1="${f1(hx)}" y1="${f1(hy)}" x2="${f1(hx + 40)}" y2="${f1(hy - 70)}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`;
  return { svg: cam(s, 960, 600, 1.0 + 0.06 * E.inOut(prog(t, a0, at(49)))), html: '' };
}
// "Tabernáculo, ali, é o corpo." A tenda vira Pedro.
function scTabernaculo(t) {
  const a0 = at(49), tc = wordTime(49, 'corpo'), k = E.inOut(prog(t, tc - 0.5, tc + 0.3));
  let s = bgDay(t, { sunX: 1600, sunY: 220, seed: 45 });
  s += opg(1 - k, tent(960, FLOOR_Y, 1.9, C.g500, C.g600, C.r400));
  s += opg(k, person({ ...VELHO, x: 960, y: FLOOR_Y, s: 1.4, look: 0, mood: 'calm' }));
  return { svg: cam(s, 960, 640, 1.0 + 0.06 * E.inOut(prog(t, a0, at(50)))), html: '' };
}
// "Lembra da promessa da última ceia? Darei a minha vida por ti." (em sépia)
function scLembraCeia(t) {
  const s = ceia(t, { tp: wordTime(50, 'darei'), tj: 1e9 });
  return { svg: lembranca(cam(s, 1150, 620, 1.14 + 0.04 * E.inOut(prog(t, at(50), at(51))))), html: '' };
}
// "Naquela noite, Jesus tinha avisado: Para onde vou, vocês não podem me seguir agora, mas me seguirão mais tarde."
function scAvisou(t) {
  const s = ceia(t, { tp: -10, tj: wordTime(51, 'para'), tj1: fim(51) });
  return { svg: lembranca(cam(s, 820, 620, 1.18 + 0.05 * E.inOut(prog(t, at(51), at(52))))), html: '' };
}
// "Agora, depois de falar da morte dele, Jesus disse: Siga-me!"
function scSigaMe(t) {
  const a0 = at(52), ts = wordTime(52, 'sigame'), beck = E.out(prog(t, ts - 0.3, ts + 0.3)), go = prog(t, ts + 0.2, at(53));
  let s = praia(t, { sunX: 1650, sunY: 300, sh: 690, hz: 520, agua: 'day' });
  const jx = lerp(1180, 1420, prog(t, a0, at(53)));
  s += person({ ...VIVO, x: jx, y: FLOOR_Y, s: 1.3, walk: t * 4, flip: beck > 0.5, look: beck > 0.5 ? -1 : 1, mood: 'calm', armL: beck > 0.5 ? lerp(14, 70, beck) : 14 });
  s += person({ ...PEDRO, x: lerp(640, 820, go), y: FLOOR_Y, s: 1.3, look: 1, mood: 'calm', walk: go > 0 ? t * 5 : null });
  return { svg: cam(s, 1020, 640, 1.06), html: '' };
}
// "Pedro se virou, viu o discípulo que Jesus amava e perguntou: Senhor, e quanto a ele?" "O que lhe importa? Siga-me você."
function scQuantoAEle(t) {
  const a0 = at(53), tv = wordTime(53, 'virou'), tq = wordTime(53, 'quanto'), tr = seg(54);
  const turn = t > tv - 0.1 && t < tr - 0.1, ask = E.out(prog(t, tq - 0.3, tq + 0.3)) * (1 - E.out(prog(t, tr - 0.2, tr + 0.2)));
  let s = praia(t, { sunX: 1650, sunY: 300, sh: 690, hz: 520, agua: 'day' });
  s += person({ ...JOAO, x: 420, y: FLOOR_Y - 10, s: 1.2, walk: t * 4, look: 1, mood: 'calm' });
  s += person({ ...PEDRO, x: 960, y: FLOOR_Y, s: 1.3, flip: turn, look: turn ? 1 : 1, mood: turn ? 'calm' : 'calm', armR: turn ? lerp(14, 80, ask) : 14 });
  s += person({ ...VIVO, x: 1460, y: FLOOR_Y, s: 1.3, flip: true, look: 1, mood: 'calm', armR: t > tr ? lerp(14, 80, E.out(prog(t, tr, tr + 0.4))) : 14 });
  return { svg: cam(s, 960, 640, 1.04 + 0.04 * E.inOut(prog(t, a0, at(55)))), html: '' };
}

// ================================================================ 6. duas fogueiras
function scPrimeira(t) {
  const a0 = at(55);
  let s = patio(t, 960, 860) + fogueira(960, 860, 1.0, t);
  s += person({ ...PEDRO, x: 1230, y: FLOOR_Y, s: 1.35, look: -1, mood: 'fear', rim: C.a300, ol: NIGHT_OL });
  return { svg: cam(s, 1060, 640, 1.0 + 0.06 * E.inOut(prog(t, a0, at(56)))), html: '' };
}
function scSegunda(t) {
  const a0 = at(56);
  let s = praia(t, { sunX: 1500, sunY: 470, sh: 640 });
  s += brasas(960, 840, 1.0, t, 2);
  s += sentado({ ...VIVO, x: 640, y: 800, s: 1.25, look: 1, mood: 'calm', armR: fala(t, seg(56), fim(56), 30, 20) });
  s += sentado({ ...PEDRO, x: 1280, y: 800, s: 1.25, look: -1, mood: t > seg(57) ? 'happy' : 'calm' });
  return { svg: cam(s, 960, 640, 1.0 + 0.06 * E.inOut(prog(t, a0, at(58)))), html: '' };
}
// "E se Jesus te fizesse essa pergunta hoje...?" A praia vazia, o fogo ainda fumegando.
function scVoce(t) {
  const a0 = at(58);
  let s = praia(t, { sunX: 1300, sunY: 470, sh: 720 });
  s += barco(1500, 650, 0.7, { t, water: aguaEm(650, 560) });
  s += brasas(820, 850, 0.8, t, 0);
  s += rede(260, 790, 640, 800, 60, 0, { id: 'r10', boias: false, bgOp: 0.06 });
  return { svg: cam(s, 960, 640, 1.0 + 0.1 * E.inOut(prog(t, a0, AUDIO_END))), html: '' };
}

// ================================================================ fim
const scFim = (t) => endCard(t, AUDIO_END + 0.2, ['João 21', 'João 13', 'Lucas 22', '2 Pedro 1']);

// ================================================================ linha do tempo
const SCENES = [
  { a: 0, b: at(1), f: scPeixes, ref: 'João 21:11' },
  { a: at(1), b: at(2), f: scPraiaJesus, ref: null },
  { a: at(2), b: at(3), f: scBrasas, ref: 'João 21:9' },
  { a: at(3), b: at(5), f: scPergunta, ref: 'João 21:15-17' },
  { a: at(5), b: at(6), f: scAviso, ref: 'João 21:18-19' },
  { a: at(6), b: at(7), f: scOutraFogueira, ref: null, dark: (t) => t > tOutra() },
  { a: at(7), b: at(8), f: scPreso, ref: 'Lucas 22:54', dark: true },
  { a: at(8), b: at(10), f: scCeia, ref: 'João 13:37-38', dark: true },
  { a: at(10), b: at(11), f: scGuarda, ref: null, dark: true },
  { a: at(11), b: at(12), f: scNegou, ref: 'Lucas 22:55-60', dark: true },
  { a: at(12), b: at(13), f: scGaloOlhar, ref: [[seg(12) + 1.0, 'Lucas 22:61']], dark: true },
  { a: at(13), b: at(14), f: scChorou, ref: null, dark: true },
  { a: at(14), b: at(16), f: scVouPescar, ref: 'João 21:2-3', dark: true },
  { a: at(16), b: at(17), f: scNoiteBarco, ref: null, dark: true },
  { a: at(17), b: at(18), f: scAmanhecer, ref: 'João 21:4', dark: true },
  { a: at(18), b: at(19), f: scLancem, ref: 'João 21:6', dark: true },
  { a: at(19), b: at(20), f: scRedeCheia, ref: null, dark: true },
  { a: at(20), b: at(21), f: scLembranca, ref: 'Lucas 5:5-6', dark: true },
  { a: at(21), b: at(22), f: scEoSenhor, ref: 'João 21:7', dark: true },
  { a: at(22), b: at(23), f: scPula, ref: null, dark: true },
  { a: at(23), b: at(24), f: scFogueiraPraia, ref: 'João 21:9' },
  { a: at(24), b: at(25), f: scArrasta, ref: 'João 21:11' },
  { a: at(25), b: at(27), f: scNaoRasgou, ref: [[seg(26) - 0.1, 'Lucas 5:6']], dark: (t) => t > seg(26) - 0.1 },
  { a: at(27), b: at(28), f: scNumero, ref: null },
  { a: at(28), b: at(30), f: scVenhamComer, ref: 'João 21:12' },
  { a: at(30), b: at(32), f: scPergunta1, ref: 'João 21:15' },
  { a: at(32), b: at(33), f: scCordeiros, ref: null },
  { a: at(33), b: at(35), f: scPergunta2, ref: 'João 21:16' },
  { a: at(35), b: at(36), f: scOvelhas, ref: null },
  { a: at(36), b: at(37), f: scPergunta3, ref: 'João 21:17' },
  { a: at(37), b: at(38), f: scMagoado, ref: null },
  { a: at(38), b: at(39), f: scTres, ref: null, dark: true },
  { a: at(39), b: at(41), f: scResposta3, ref: null },
  { a: at(41), b: at(42), f: scNenhumaVez, ref: null },
  { a: at(42), b: at(43), f: scPastor, ref: null },
  { a: at(43), b: at(45), f: scJovem, ref: 'João 21:18' },
  { a: at(45), b: at(46), f: scVelho, ref: null },
  { a: at(46), b: at(48), f: scNaoNarra, ref: 'João 21:19' },
  { a: at(48), b: at(49), f: scCarta, ref: '2 Pedro 1:14', dark: true },
  { a: at(49), b: at(50), f: scTabernaculo, ref: '2 Pedro 1:13' },
  { a: at(50), b: at(51), f: scLembraCeia, ref: 'João 13:37', dark: true },
  { a: at(51), b: at(52), f: scAvisou, ref: 'João 13:36', dark: true },
  { a: at(52), b: at(53), f: scSigaMe, ref: 'João 21:19' },
  { a: at(53), b: at(55), f: scQuantoAEle, ref: 'João 21:20-22' },
  { a: at(55), b: at(56), f: scPrimeira, ref: null, dark: true },
  { a: at(56), b: at(58), f: scSegunda, ref: null },
  { a: at(58), b: AUDIO_END + 0.2, f: scVoce, ref: [[seg(60) - 0.2, 'João 21']] },
  { a: AUDIO_END + 0.2, b: DURATION + 1, f: scFim, ref: null, end: true },
];
