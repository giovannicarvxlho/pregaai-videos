// Primitivas de desenho e animação. Tudo é função pura do tempo: o mesmo t
// sempre gera o mesmo quadro, então o render pode pular, repetir e paralelizar.

const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  in: (t) => t * t * t,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  back: (t) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  sine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
};
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const f1 = (n) => Math.round(n * 10) / 10;

// Paleta: neutros e escala azul do PregaAI (src/constants/theme.ts e
// docs/design.md §2.3). Âmbar, pêssego, vermelho e verde vêm da paleta base.
const C = {
  paper: '#F8F7F4', white: '#FFFFFF', ink: '#37352F', inkDeep: '#181614', muted: '#87857F', border: '#D2D1CE',
  g100: '#FBF9F8', g200: '#F8F4F1', g300: '#EFE8E4', g400: '#D1C6BF', g500: '#B5A399', g600: '#AB988C', g700: '#7B7471', g800: '#292726',
  ch100: '#73767D', ch200: '#595A5C', ch300: '#505153', ch400: '#444547', ch500: '#353638', ch600: '#2F3032', ch900: '#222324', ch1100: '#191A1C',
  d1: '#191919', d2: '#202020', d3: '#2B2B2B', d0: '#0C0C0C',
  b300: '#AAD1FF', b400: '#6FB1FC', b500: '#2383E2', b600: '#0675D3',
  a300: '#F9D779', a400: '#E4B750', a600: '#B67700',
  p300: '#FFC19B', p400: '#D4946C', p500: '#BA7A53', p600: '#A2653F',
  r300: '#FFAEB7', r400: '#E3858F', r600: '#BB515E',
  gr300: '#A1E0A9', gr400: '#76C382', gr600: '#319751',
  olive: '#B9B79C', oliveDk: '#9E9C80', wood: '#6B4A33',
};

// Medida de texto com as fontes já carregadas (para dimensionar etiquetas em SVG).
const _ctx = document.createElement('canvas').getContext('2d');
function measure(text, font) { _ctx.font = font; return _ctx.measureText(text).width; }
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------- céu, terreno e cenário ----------

function rect(x, y, w, h, fill, extra = '') { return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}" ${extra}/>`; }

function skyGrad(id, stops) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
}
function radial(id, color, op = 1) {
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
}

// Morro suave: soma de senoides, fechado até o pé da tela.
function hills(y0, amp, freq, seed, fill, ox = 0, x0 = -400, x1 = 1480) {
  const r = rng(seed); const ph1 = r() * 6.28, ph2 = r() * 6.28, ph3 = r() * 6.28;
  let d = `M ${x0} ${H + 400}`;
  for (let x = x0; x <= x1; x += 24) {
    const u = x + ox;
    const y = y0 - amp * (0.55 * Math.sin(u * freq + ph1) + 0.3 * Math.sin(u * freq * 2.1 + ph2) + 0.15 * Math.sin(u * freq * 4.3 + ph3));
    d += ` L ${x} ${f1(y)}`;
  }
  return `<path d="${d} L ${x1} ${H + 400} Z" fill="${fill}"/>`;
}

function sun(x, y, r, t = 0) {
  const pulse = 1 + 0.03 * Math.sin(t * 1.5);
  return `<circle cx="${x}" cy="${y}" r="${f1(r * 2.4 * pulse)}" fill="${C.a300}" opacity="0.18"/>
    <circle cx="${x}" cy="${y}" r="${f1(r * 1.5)}" fill="${C.a300}" opacity="0.25"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${C.a300}"/>`;
}

// Nuvem com sombra dura embaixo (a "edge" da marca).
function cloud(x, y, s, fill = C.white, edge = '#E7E2DB') {
  const parts = [[0, 0, 46], [52, -18, 58], [112, 0, 44], [56, 14, 50]];
  const body = (dy, c) => parts.map(([px, py, r]) => `<circle cx="${px}" cy="${py + dy}" r="${r}" fill="${c}"/>`).join('') +
    `<rect x="0" y="${dy}" width="112" height="${44 + 10}" fill="${c}"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${body(10, edge)}${body(0, fill)}</g>`;
}

function stars(t, n, seed, yMax = 1000, op = 1) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const x = r() * W, y = r() * yMax, rad = 1.2 + r() * 2.6, ph = r() * 6.28, sp = 1 + r() * 2;
    const o = op * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * sp + ph)));
    s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rad)}" fill="#fff" opacity="${f1(o * 100) / 100}"/>`;
  }
  return s;
}
function moon(x, y, r, sky) {
  return `<circle cx="${x}" cy="${y}" r="${r * 2.2}" fill="#fff" opacity="0.05"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${C.paper}"/>
    <circle cx="${x + r * 0.42}" cy="${y - r * 0.18}" r="${r * 0.92}" fill="${sky}"/>`;
}

// Traço de tinta do cenário (o mesmo das pessoas).
const ink = (w = 5, c = C.ink) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round"`;

// Caverna: massa de pedra com abertura escura.
function cave(x, base, s = 1, tone = 'day') {
  const day = tone === 'day';
  const rock = day ? C.g500 : '#3A3836', facet = day ? C.g600 : '#302E2C', crack = day ? C.g700 : '#262422', ol = day ? C.ink : '#0E0D0C';
  return `<g transform="translate(${x} ${base}) scale(${s})">
    <path d="M -330 0 C -340 -170 -250 -380 -60 -440 C 120 -490 300 -360 330 -170 C 340 -90 336 -30 340 0 Z" fill="${rock}" ${ink(6, ol)}/>
    <path d="M 64 -452 C 200 -428 308 -330 327 -170 C 337 -90 333 -30 337 -3 L 152 -3 C 192 -150 172 -330 64 -452 Z" fill="${facet}"/>
    <path d="M -230 -250 C -200 -300 -160 -330 -110 -350" stroke="${crack}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M 200 -300 C 230 -260 250 -220 256 -170" stroke="${crack}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M -270 -60 C -250 -80 -220 -84 -196 -70" stroke="${crack}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M -120 0 L -120 -150 C -120 -270 110 -270 110 -150 L 110 0 Z" fill="${C.g800}" ${ink(6, ol)}/>
    <path d="M -80 0 L -80 -140 C -80 -220 70 -220 70 -140 L 70 0 Z" fill="#1A1817"/>
  </g>`;
}

// Cidade murada. o.fire põe as casas em chamas e escurece tudo.
function city(x, base, s, t, o = {}) {
  const dark = !!o.fire, ol = dark ? '#120E0C' : C.ink;
  const wall = dark ? '#3B302A' : C.g300, wallSh = dark ? '#2E2621' : C.g400, house = dark ? '#45372F' : '#FFFFFF', houseSh = dark ? '#33291F' : C.g300, win = dark ? C.a400 : C.g700;
  let g = '';
  const houses = [[-200, 150, 120], [-90, 196, 100], [10, 236, 120], [120, 170, 100], [200, 140, 90]];
  houses.forEach(([hx, hh, hw], i) => {
    g += rect(hx, -hh, hw, hh, house, ink(5, ol)) + rect(hx + hw * 0.66, -hh + 2.5, hw * 0.34 - 2.5, hh - 2.5, houseSh);
    g += rect(hx + hw * 0.2, -hh + 30, 18, 24, win, `rx="4" ${ink(3, ol)}`);
    if (hh > 160) g += rect(hx + hw * 0.2, -hh + 82, 18, 24, win, `rx="4" ${ink(3, ol)}`);
    if (o.fire) g += flames(hx + hw * 0.5, -hh + 2, 0.8 + (i % 3) * 0.25, t, i);
  });
  g += rect(-280, -120, 560, 120, wall, ink(5, ol)) + rect(122, -117.5, 155.5, 115, wallSh);
  for (let i = 0; i < 12; i++) g += rect(-280 + i * 48, -146, 26, 28, i > 8 ? wallSh : wall, ink(5, ol));
  g += rect(-320, -190, 70, 190, wallSh, ink(5, ol)) + rect(250, -190, 70, 190, wallSh, ink(5, ol));
  for (let i = 0; i < 2; i++) g += rect(-320 + i * 44, -212, 26, 24, wallSh, ink(5, ol)) + rect(250 + i * 44, -212, 26, 24, wallSh, ink(5, ol));
  g += `<path d="M -50 0 L -50 -60 C -50 -100 50 -100 50 -60 L 50 0 Z" fill="${dark ? '#1A1512' : C.g700}" ${ink(5, ol)}/>`;
  if (o.fire) g += flames(-285, -212, 1.2, t, 7) + flames(285, -212, 1.0, t, 9);
  return `<g transform="translate(${x} ${base}) scale(${s})">${g}</g>`;
}

function tent(x, base, s, fill = C.ch400, shadeC = C.ch500, flag = C.r400, ol = C.ink) {
  return `<g transform="translate(${x} ${base}) scale(${s})">
    <line x1="0" y1="-150" x2="0" y2="-212" stroke="${ol}" stroke-width="13" stroke-linecap="round"/><line x1="0" y1="-150" x2="0" y2="-212" stroke="${C.wood}" stroke-width="5" stroke-linecap="round"/>
    <path d="M 0 -212 L 46 -199 L 0 -184 Z" fill="${flag}" ${ink(4, ol)}/>
    <path d="M -110 0 C -80 -40 -30 -110 0 -150 C 30 -110 80 -40 110 0 Z" fill="${fill}" ${ink(5, ol)}/>
    <path d="M 2 -146 C 32 -106 78 -42 106 -3 L 2 -3 Z" fill="${shadeC}"/>
    <path d="M -16 0 L 0 -70 L 16 0 Z" fill="#141414" ${ink(4, ol)}/>
  </g>`;
}

function well(x, base, s, glow = 0) {
  const post = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.ink}" stroke-width="22" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.wood}" stroke-width="12" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${base}) scale(${s})">
    ${glow ? `<circle cx="0" cy="-60" r="180" fill="url(#gBlue)" opacity="${f1(glow * 100) / 100}"/>` : ''}
    ${post(-62, -40, -62, -170)}${post(62, -40, 62, -170)}${post(-78, -168, 78, -168)}
    <line x1="0" y1="-166" x2="0" y2="-102" stroke="${C.ink}" stroke-width="4"/>
    <path d="M -15 -102 L 15 -102 L 11 -76 L -11 -76 Z" fill="${C.p400}" ${ink(4)}/>
    <path d="M -84 -50 L 84 -50 L 80 0 L -80 0 Z" fill="${C.g500}" ${ink(5)}/>
    <path d="M 32 -48 L 81.5 -48 L 78 -2.5 L 32 -2.5 Z" fill="${C.g600}"/>
    <ellipse cx="0" cy="-50" rx="86" ry="17" fill="${C.g300}" ${ink(5)}/>
    <ellipse cx="0" cy="-50" rx="62" ry="10" fill="${C.b500}" ${ink(3)}/>
  </g>`;
}

// Oliveira: contorno só na borda de fora da copa (traço largo por baixo).
function olive(x, base, s, c1 = C.olive, c2 = C.oliveDk, ol = C.ink) {
  const blobs = [[-40, -130, 44, c2], [34, -136, 48, c2], [-6, -172, 50, c1], [-46, -142, 34, c1], [40, -148, 36, c1]];
  return `<g transform="translate(${x} ${base}) scale(${s})">
    <path d="M -9 0 C -7 -40 -19 -70 -5 -112 L 9 -112 C 5 -70 15 -40 11 0 Z" fill="${C.wood}" ${ink(5, ol)}/>
    ${blobs.map(([bx, by, r]) => `<circle cx="${bx}" cy="${by}" r="${r + 5}" fill="${ol}"/>`).join('')}
    ${blobs.map(([bx, by, r, c]) => `<circle cx="${bx}" cy="${by}" r="${r}" fill="${c}"/>`).join('')}
  </g>`;
}

function jar(x, y, s, rot = 0) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})">
    <path d="M -16 -62 L 16 -62 L 14 -46 C 40 -36 46 -6 34 18 C 26 34 -26 34 -34 18 C -46 -6 -40 -36 -14 -46 Z" fill="${C.p400}" ${ink(5)}/>
    <path d="M 10 -44 C 38 -34 42 -6 32 16 C 28 24 20 28 12 29 C 26 6 26 -22 10 -44 Z" fill="${C.p500}"/>
    <rect x="-21" y="-70" width="42" height="12" rx="6" fill="${C.p500}" ${ink(4)}/>
  </g>`;
}

function flame(x, y, w, h, fill) {
  return `<path d="M ${f1(x)} ${f1(y)} C ${f1(x - w)} ${f1(y)} ${f1(x - w * 0.9)} ${f1(y - h * 0.55)} ${f1(x)} ${f1(y - h)} C ${f1(x + w * 0.9)} ${f1(y - h * 0.55)} ${f1(x + w)} ${f1(y)} ${f1(x)} ${f1(y)} Z" fill="${fill}"/>`;
}
function flames(x, y, s, t, seed) {
  let g = '';
  for (let k = 0; k < 3; k++) {
    const ph = seed * 1.7 + k * 2.1;
    const h = (90 + 30 * Math.sin(t * 9 + ph) + 18 * Math.sin(t * 17 + ph * 2)) * s;
    const dx = (k - 1) * 26 * s + Math.sin(t * 6 + ph) * 4;
    g += flame(x + dx, y, 26 * s, h, C.r400) + flame(x + dx, y, 18 * s, h * 0.72, C.p300) + flame(x + dx, y, 10 * s, h * 0.45, C.a300);
  }
  return `<circle cx="${x}" cy="${y - 40 * s}" r="${150 * s}" fill="url(#gAmber)" opacity="0.55"/>` + g;
}

function smoke(cx, base, t, n, seed, spread = 1, color = '#6E6862') {
  const r = rng(seed); let g = '';
  for (let i = 0; i < n; i++) {
    const off = r(), sp = 0.12 + r() * 0.06, sx = (r() - 0.5) * 120 * spread;
    const ph = (t * sp + off) % 1;
    const y = base - ph * 760, x = cx + sx + ph * 200 + Math.sin(t * 0.8 + i) * 20;
    const rad = 40 + ph * 150;
    g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rad)}" fill="${color}" opacity="${f1((1 - ph) * 0.45 * 100) / 100}"/>`;
  }
  return g;
}
function embers(cx, base, t, n, seed, w = 500) {
  const r = rng(seed); let g = '';
  for (let i = 0; i < n; i++) {
    const off = r(), sp = 0.25 + r() * 0.3, sx = (r() - 0.5) * w;
    const ph = (t * sp + off) % 1;
    const x = cx + sx + Math.sin(t * 3 + i) * 18 + ph * 80, y = base - ph * 700;
    g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(3 + r() * 3)}" fill="${i % 2 ? C.a300 : C.p300}" opacity="${f1((1 - ph) * 100) / 100}"/>`;
  }
  return g;
}

// Raio de luz vindo de cima.
function beam(x0, y0, x1, y1, w0, w1, op) {
  return `<path d="M ${x0 - w0} ${y0} L ${x0 + w0} ${y0} L ${x1 + w1} ${y1} L ${x1 - w1} ${y1} Z" fill="url(#gBeam)" opacity="${f1(op * 100) / 100}"/>`;
}

function dust(x, y, t, t0, n = 3, color = C.g400) {
  let g = '';
  for (let i = 0; i < n; i++) {
    const ph = clamp((t - t0 - i * 0.08) / 0.7);
    if (ph <= 0 || ph >= 1) continue;
    g += `<circle cx="${f1(x - ph * 60 - i * 20)}" cy="${f1(y - ph * 30)}" r="${f1(14 + ph * 34)}" fill="${color}" opacity="${f1((1 - ph) * 0.6 * 100) / 100}"/>`;
  }
  return g;
}

// ---------- pessoas ----------

const SKINS = ['#C68B59', '#8D5524', '#E0AC69', '#A86B3C', '#7A4A26', '#B97A4A'];
const HAIRS = ['#292726', '#3A2A20', '#191919', '#5A3A28', '#2F2622'];
const ROBES = [C.g300, C.g400, C.g500, C.g600, C.g200, '#C9BBAE', '#D9CFC7'];
const COVERS = [C.g100, C.g300, '#E2D8CF', C.g400];

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  r = Math.round(r * k); g = Math.round(g * k); b = Math.round(b * k);
  return '#' + ((1 << 24) + (clamp(r, 0, 255) << 16) + (clamp(g, 0, 255) << 8) + clamp(b, 0, 255)).toString(16).slice(1);
}

// Pessoa de frente, com traço de tinta (como as ilustrações do Notion). Pés em
// (x, y); ~300 de altura em s = 1.
// o: robe, skin, hair, beard, cover, mood, look, walk (fase), armL/armR (graus
// a partir do corpo, 0 = para baixo), kneel, gear {helmet, armor, shield, spear,
// sword, stone}, flip, sil (cor de silhueta), rim, op, shake, lean, ol (traço).
function person(o) {
  const s = o.s || 1, sil = o.sil;
  const col = (c) => sil || c;
  const OL = sil ? sil : (o.ol || C.ink), SW = sil ? 0 : 5;
  const st = (w = SW) => (w ? `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round"` : '');
  const robe = col(o.robe || C.g400), robeDk = col(shade(o.robe || C.g400, 0.84)), skin = col(o.skin || SKINS[0]), hair = col(o.hair || HAIRS[0]);
  const k = o.kneel ? 1 : 0;
  let g = '';
  if (!o.noShadow) g += `<ellipse cx="0" cy="2" rx="${k ? 70 : 54}" ry="11" fill="#000" opacity="${sil ? 0.25 : 0.13}"/>`;
  if (!k) {
    const a = o.walk == null ? 0 : Math.sin(o.walk) * 24;
    const leg = (x, ang) => `<g transform="translate(${x} -46) rotate(${f1(ang)})"><rect x="-9" y="0" width="18" height="50" rx="9" fill="${col(C.g800)}" ${st(4)}/></g>`;
    g += leg(-13, a) + leg(13, -a);
  }
  const gear = o.gear || {};
  const hem = k ? 0 : -34, hw = k ? 62 : 50;
  let b = '';
  // braços: traço largo por baixo, cor por cima
  const arm = (side, ang, len = 86) => {
    const sx = side * 34, sy = -154, r = (ang * Math.PI) / 180;
    return { sx, sy, hx: sx + side * len * Math.sin(r), hy: sy + len * Math.cos(r) };
  };
  const aL = arm(-1, o.armL ?? 14), aR = arm(1, o.armR ?? 14);
  const sleeve = gear.armor ? col(C.ch200) : robeDk;
  const drawArm = (a) => (SW ? `<line x1="${a.sx}" y1="${a.sy}" x2="${f1(a.hx)}" y2="${f1(a.hy)}" stroke="${OL}" stroke-width="${22 + SW * 2}" stroke-linecap="round"/>` : '') +
    `<line x1="${a.sx}" y1="${a.sy}" x2="${f1(a.hx)}" y2="${f1(a.hy)}" stroke="${sleeve}" stroke-width="22" stroke-linecap="round"/><circle cx="${f1(a.hx)}" cy="${f1(a.hy)}" r="11" fill="${skin}" ${st(4)}/>`;
  const spearAt = (a) => (SW ? `<line x1="${f1(a.hx)}" y1="${f1(a.hy + 70)}" x2="${f1(a.hx)}" y2="${f1(a.hy - 250)}" stroke="${OL}" stroke-width="15" stroke-linecap="round"/>` : '') +
    `<line x1="${f1(a.hx)}" y1="${f1(a.hy + 70)}" x2="${f1(a.hx)}" y2="${f1(a.hy - 250)}" stroke="${col(C.wood)}" stroke-width="7" stroke-linecap="round"/><path d="M ${f1(a.hx - 12)} ${f1(a.hy - 244)} L ${f1(a.hx)} ${f1(a.hy - 296)} L ${f1(a.hx + 12)} ${f1(a.hy - 244)} Z" fill="${col(C.ch100)}" ${st(4)}/>`;
  // braço de trás (o que segura lança) vai antes do corpo
  if (gear.spear === 'r') b += spearAt(aR);
  if (gear.spear === 'l') b += spearAt(aL);
  b += `<path d="M -38 -166 C -40 -120 -46 -80 -${hw} ${hem - 10} Q -${hw} ${hem} -40 ${hem} L 40 ${hem} Q ${hw} ${hem} ${hw} ${hem - 10} C 46 -80 40 -120 38 -166 Q 0 -180 -38 -166 Z" fill="${robe}" ${st()}/>`;
  if (!sil) b += `<path d="M 16 -170 L 36 -165 C 39 -120 45 -80 ${hw - 3} ${hem - 10} Q ${hw - 3} ${hem - 3} 40 ${hem - 3} L 24 ${hem - 3} Z" fill="#000" opacity="0.08"/>`;
  b += `<path d="M -42 -111 L 42 -111 L 43 -99 L -43 -99 Z" fill="${robeDk}" ${st(3)}/>`;
  if (gear.armor) {
    b += `<path d="M -36 -166 L 36 -166 L 41 -104 L -41 -104 Z" fill="${col(C.g700)}" ${st()}/>`;
    if (!sil) for (let i = 0; i < 3; i++) b += `<line x1="-34" y1="${-150 + i * 15}" x2="34" y2="${-150 + i * 15}" stroke="${C.ch200}" stroke-width="4"/>`;
  }
  b += drawArm(aL) + drawArm(aR);
  if (gear.armor) b += `<circle cx="-35" cy="-158" r="16" fill="${col(C.ch200)}" ${st(4)}/><circle cx="35" cy="-158" r="16" fill="${col(C.ch200)}" ${st(4)}/>`;
  if (gear.sword) {
    const a = gear.sword === 'l' ? aL : aR;
    b += `<path d="M ${f1(a.hx - 6)} ${f1(a.hy - 6)} L ${f1(a.hx)} ${f1(a.hy - 128)} L ${f1(a.hx + 8)} ${f1(a.hy - 6)} Z" fill="${col('#EEECE8')}" ${st(4)}/><line x1="${f1(a.hx - 20)}" y1="${f1(a.hy - 8)}" x2="${f1(a.hx + 20)}" y2="${f1(a.hy - 8)}" stroke="${col(C.g700)}" stroke-width="9" stroke-linecap="round"/>`;
  }
  if (gear.stone) {
    const a = gear.stone === 'l' ? aL : aR;
    b += `<circle cx="${f1(a.hx)}" cy="${f1(a.hy - 16)}" r="18" fill="${col(C.g600)}" ${st(4)}/><circle cx="${f1(a.hx - 5)}" cy="${f1(a.hy - 21)}" r="5" fill="${col(C.g400)}"/>`;
  }
  if (gear.shield) {
    const a = gear.shield === 'l' ? aL : aR, phil = gear.helmet === 'phil';
    b += `<circle cx="${f1(a.hx)}" cy="${f1(a.hy - 10)}" r="45" fill="${col(phil ? C.ch400 : C.g500)}" ${st()}/><circle cx="${f1(a.hx)}" cy="${f1(a.hy - 10)}" r="33" fill="none" stroke="${col(phil ? C.ch100 : C.g600)}" stroke-width="6"/><circle cx="${f1(a.hx)}" cy="${f1(a.hy - 10)}" r="9" fill="${col(phil ? C.ch100 : C.g700)}" ${st(3)}/>`;
  }
  // cabeça
  const lx = (o.look || 0) * 7;
  let h = `<circle cx="0" cy="-206" r="36" fill="${skin}" ${st()}/>`;
  if (o.cover && !gear.helmet) {
    h += `<path d="M -42 -196 C -46 -238 -26 -254 0 -254 C 26 -254 46 -238 42 -196 L 50 -162 L 30 -162 L 30 -200 C 28 -222 14 -230 0 -230 C -14 -230 -28 -222 -30 -200 L -30 -162 L -50 -162 Z" fill="${col(o.cover)}" ${st()}/>`;
    h += `<rect x="-38" y="-239" width="76" height="10" rx="5" fill="${col(shade(o.cover, 0.8))}" ${st(3)}/>`;
  } else if (!gear.helmet && !o.bald) {
    h += `<path d="M -37 -204 C -40 -238 -20 -249 0 -249 C 20 -249 40 -238 37 -204 C 30 -222 14 -229 0 -229 C -14 -229 -30 -222 -37 -204 Z" fill="${hair}" ${st()}/>`;
  }
  if (o.beard) h += `<path d="M -34 -202 C -34 -175 -17 -162 0 -162 C 17 -162 34 -175 34 -202 C 24 -191 12 -187 0 -187 C -12 -187 -24 -191 -34 -202 Z" fill="${hair}" ${st(4)}/>`;
  if (gear.helmet === 'isr') h += `<path d="M -41 -202 C -41 -252 41 -252 41 -202 L 45 -196 L -45 -196 Z" fill="${col(C.g700)}" ${st()}/><rect x="-5" y="-260" width="10" height="16" rx="5" fill="${col(C.ch200)}" ${st(3)}/>`;
  if (gear.helmet === 'phil') {
    for (let i = -3; i <= 3; i++) h += `<rect x="${i * 10 - 4}" y="-292" width="8" height="${58 - Math.abs(i) * 5}" rx="4" fill="${col(C.ch100)}" transform="rotate(${i * 5} 0 -230)" ${st(3)}/>`;
    h += `<rect x="-41" y="-239" width="82" height="17" rx="6" fill="${col(C.ch400)}" ${st(4)}/>`;
  }
  if (!sil) {
    const mood = o.mood || 'calm', ey = -209, ink = C.d1;
    const arc = (x, up) => `<path d="M ${x - 6 + lx} ${ey + (up ? 2 : 0)} Q ${x + lx} ${ey + (up ? -6 : 5)} ${x + 6 + lx} ${ey + (up ? 2 : 0)}" stroke="${ink}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    if (mood === 'happy') h += arc(-12, true) + arc(12, true);
    else if (mood === 'closed') h += arc(-12, false) + arc(12, false);
    else {
      if (mood === 'fear') h += `<circle cx="${-12 + lx}" cy="${ey}" r="9.5" fill="#fff" ${st(3)}/><circle cx="${12 + lx}" cy="${ey}" r="9.5" fill="#fff" ${st(3)}/>`;
      const er = mood === 'fear' ? 4.5 : 5;
      h += `<circle cx="${-12 + lx * 1.3}" cy="${ey}" r="${er}" fill="${ink}"/><circle cx="${12 + lx * 1.3}" cy="${ey}" r="${er}" fill="${ink}"/>`;
    }
    const brow = (x1, y1, x2, y2) => `<line x1="${x1 + lx}" y1="${y1}" x2="${x2 + lx}" y2="${y2}" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"/>`;
    if (mood === 'fear' || mood === 'sad') h += brow(-22, -222, -8, -228) + brow(22, -222, 8, -228);
    if (mood === 'angry') h += brow(-22, -230, -7, -222) + brow(22, -230, 7, -222);
    if (mood === 'fear') {
      const dropY = -230 + (((o.t || 0) * 50) % 36);
      h += `<path d="M 44 ${dropY} C 37 ${dropY + 11} 37 ${dropY + 18} 44 ${dropY + 18} C 51 ${dropY + 18} 51 ${dropY + 11} 44 ${dropY} Z" fill="${C.b300}" ${st(3)}/>`;
    }
  }
  g += `<g transform="translate(0 ${k ? 40 : 0}) rotate(${o.lean || 0} 0 -40)">${b}${h}</g>`;
  const shake = o.shake ? `translate(${f1(Math.sin((o.t || 0) * 47) * o.shake)} 0)` : '';
  const flip = o.flip ? -1 : 1;
  let out = `<g transform="translate(${f1(o.x)} ${f1(o.y)}) ${shake} scale(${f1(s * flip * 1000) / 1000} ${f1(s * 1000) / 1000})">${g}</g>`;
  if (o.rim) out = `<g transform="translate(${f1(-6 * s)} ${f1(-3 * s)})">${person({ ...o, rim: null, sil: o.rim, noShadow: true, op: 1 })}</g>` + out;
  if (o.op != null && o.op < 1) out = `<g opacity="${f1(o.op * 100) / 100}">${out}</g>`;
  return out;
}

// Homem do grupo, com variação estável por semente.
function man(seed, extra = {}) {
  const r = rng(seed * 7919 + 13);
  return {
    robe: pick(r, ROBES), skin: pick(r, SKINS), hair: pick(r, HAIRS), beard: r() < 0.75,
    cover: r() < 0.4 ? pick(r, COVERS) : null, ...extra,
  };
}
const DAVI = { robe: C.b500, skin: '#E0AC69', hair: '#8B4A2B', beard: false };

// ---------- etiquetas em SVG (estilo da marca: borda + sombra dura) ----------

function badge(x, y, text, o = {}) {
  const size = o.size || 32, weight = o.weight || 700, fam = o.fam || 'Geist';
  const label = o.upper ? text.toUpperCase() : text;
  const ls = o.upper ? size * 0.06 : 0;
  const tw = measure(label, `${weight} ${size}px ${fam}`) + ls * label.length;
  const px = size * 0.6, ph = size * 1.7, wdt = tw + px * 2, edge = o.edge || C.border;
  const sc = o.scale ?? 1;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(sc * 1000) / 1000})" opacity="${o.op ?? 1}">
    <rect x="${f1(-wdt / 2)}" y="${f1(-ph / 2 + 7)}" width="${f1(wdt)}" height="${f1(ph)}" rx="${size * 0.42}" fill="${edge}"/>
    <rect x="${f1(-wdt / 2)}" y="${f1(-ph / 2)}" width="${f1(wdt)}" height="${f1(ph)}" rx="${size * 0.42}" fill="${o.fill || C.white}" stroke="${edge}" stroke-width="3"/>
    <text x="0" y="${f1(size * 0.36)}" text-anchor="middle" font-family="${fam}" font-weight="${weight}" font-size="${size}" letter-spacing="${ls}" fill="${o.color || C.inkDeep}">${esc(label)}</text>
  </g>`;
}

// Peixe do PregaAI (src/components/ui/FishGlyph.tsx), viewBox 400×200.
function fishGlyph(color, eyeColor) {
  return `<g transform="translate(400 0) scale(-1 1)">
    <path d="M 40 100 Q 180 -2 292 100 Q 180 202 40 100 Z" fill="${color}" stroke="${color}" stroke-width="44" stroke-linejoin="round"/>
    <path d="M 290 100 L 366 48 L 366 152 Z" fill="${color}" stroke="${color}" stroke-width="44" stroke-linejoin="round"/>
  </g><circle cx="300" cy="86" r="16" fill="${eyeColor}"/>`;
}
// Wordmark "PREGAAI" (mesmo arquivo), viewBox 651×100.
const WM_A = 'M7 93 L42 7 H70 L105 93 H89 L80 72 H32 L23 93 Z M36 60 H76 L56 12 Z';
const WM = [
  [0, 'M7 7 H54 A30 30 0 0 1 54 67 H23 V93 H7 Z M23 17 H54 A20 20 0 0 1 54 57 H23 Z'],
  [95, 'M7 7 H54 A30 30 0 0 1 72 61.6 L90 93 H72 L50 67 H23 V93 H7 Z M23 17 H54 A20 20 0 0 1 54 57 H23 Z'],
  [196, 'M7 7 H80 V17 H23 V44 H72 V56 H23 V83 H80 V93 H7 Z'],
  [287, 'M88.07 30 A43 43 0 1 0 92.81 54 L76.70 54 A27 27 0 1 1 68.14 30 Z'],
  [287, 'M60 54 H92.81 V62 H60 Z'],
  [387, WM_A], [505, WM_A], [621, 'M7 7 H23 V93 H7 Z'],
];
function wordmark(color) {
  return WM.map(([x, d]) => `<path d="${d}" transform="translate(${x} 0)" fill="${color}" fill-rule="evenodd" stroke="${color}" stroke-width="14" stroke-linejoin="round"/>`).join('');
}

// Ícones lucide (stroke 2, viewBox 24), usados nos selos.
const ICON = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
};
const icon = (name, size, color, sw = 2.4) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICON[name]}</svg>`;

// ---------- cena: fundo, câmera e componentes comuns ----------

const DEFS = `<defs>
  ${skyGrad('skyDay', [[0, '#D9E9FB'], [0.5, '#EEF3F8'], [1, '#F8F7F4']])}
  ${skyGrad('skyNight', [[0, '#101419'], [0.55, '#191D23'], [1, '#272A2E']])}
  ${skyGrad('skyDusk', [[0, '#1C1715'], [0.45, '#3B2820'], [1, '#93573A']])}
  ${skyGrad('skyRed', [[0, '#1D1514'], [0.5, '#3E2222'], [1, '#7A3A38']])}
  ${skyGrad('skyGloom', [[0, '#C9C6C1'], [0.6, '#DAD5CF'], [1, '#E6E0D9']])}
  ${skyGrad('skySunrise', [[0, '#E3EEF9'], [0.45, '#F8F2EA'], [1, '#FFD9BD']])}
  ${skyGrad('skyDawn', [[0, '#151A21'], [0.55, '#1E2530'], [1, '#33404F']])}
  ${radial('gAmber', C.a300, 0.9)}
  ${radial('gBlue', C.b400, 0.85)}
  ${radial('gWhite', '#FFFFFF', 0.9)}
  ${radial('gPeach', C.p300, 0.9)}
  <linearGradient id="gBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.b400}"/><stop offset="1" stop-color="${C.b500}"/></linearGradient>
  ${skyGrad('gFloorDay', [[0, '#E9E1D8'], [1, '#D8CCBE']])}
  ${skyGrad('gFloorNight', [[0, '#15181B'], [1, '#0C0E10']])}
  ${skyGrad('gFloorDusk', [[0, '#271F1B'], [1, '#17120F']])}
  <filter id="fSmoke" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
  <radialGradient id="gVig" cx="0.5" cy="0.45" r="0.75"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></radialGradient>
</defs>`;

const cam = (inner, cx, cy, s, tx = 0, ty = 0) => `<g transform="translate(${f1(cx + tx)} ${f1(cy + ty)}) scale(${(s).toFixed(4)}) translate(${-cx} ${-cy})">${inner}</g>`;
const pop = (t, t0, d = 0.35) => { const p = prog(t, t0, t0 + d); return p <= 0 ? 0 : E.back(p); };
const GROUND = 1040;

// Chão até o pé da tela, com pedrinhas e tufos (com paralaxe quando a câmera anda).
function floor(kind, ox = 0, y0 = GROUND) {
  const P = { day: ['gFloorDay', '#D3C7BA', C.ink], night: ['gFloorNight', '#23272B', '#060708'], dusk: ['gFloorDusk', '#3A2D26', '#0E0B09'] }[kind];
  let s = `<rect x="-400" y="${y0}" width="1880" height="${H - y0 + 400}" fill="url(#${P[0]})"/>`;
  const r = rng(kind.length * 31 + 7);
  for (let i = 0; i < 24; i++) {
    const depth = r(), y = y0 + 110 + depth * (H - y0 - 90), sc = 0.5 + depth * 1.2;
    const x = ((((r() * 1700 - ox * (0.8 + depth * 0.7)) % 1700) + 1700) % 1700) - 300;
    const w = f1(2.6 * Math.min(sc, 1.3));
    if (r() < 0.5) s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(13 * sc)}" ry="${f1(7 * sc)}" fill="${P[1]}" stroke="${P[2]}" stroke-width="${w}"/>`;
    else s += `<path d="M ${f1(x - 11 * sc)} ${f1(y)} Q ${f1(x - 9 * sc)} ${f1(y - 16 * sc)} ${f1(x - 16 * sc)} ${f1(y - 25 * sc)} M ${f1(x)} ${f1(y)} Q ${f1(x)} ${f1(y - 21 * sc)} ${f1(x + 3 * sc)} ${f1(y - 32 * sc)} M ${f1(x + 11 * sc)} ${f1(y)} Q ${f1(x + 10 * sc)} ${f1(y - 15 * sc)} ${f1(x + 18 * sc)} ${f1(y - 23 * sc)}" stroke="${P[2]}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="0.5"/>`;
  }
  return s;
}

function bgDay(t, o = {}) {
  const ox = o.ox || 0, seed = o.seed || 3;
  let s = `<rect width="${W}" height="${H}" fill="url(#skyDay)"/>`;
  if (o.sun !== false) s += sun(o.sunX ?? 830, o.sunY ?? 520, 58, t);
  s += cloud(((140 + t * 9 - ox * 0.08) % 1400) - 200, 400, 0.9) + cloud(((760 + t * 6 - ox * 0.08) % 1400) - 200, 320, 0.66);
  s += hills(905, 80, 0.0032, seed, '#E3DBD2', ox * 0.3) + hills(985, 55, 0.0055, seed + 2, '#D6CBC0', ox * 0.6);
  s += floor('day', ox);
  return s;
}
function bgNight(t, o = {}) {
  const ox = o.ox || 0;
  let s = `<rect width="${W}" height="${H}" fill="url(#${o.sky || 'skyNight'})"/>` + stars(t, 70, 11, 980, o.starOp ?? 1);
  if (o.moon !== false) s += moon(o.moonX ?? 820, o.moonY ?? 480, 46, '#14181D');
  s += hills(920, 80, 0.0032, 7, '#1F2428', ox * 0.3) + hills(990, 55, 0.0055, 9, '#191D21', ox * 0.6);
  s += floor('night', ox);
  return s;
}
function bgDusk(t, o = {}) {
  const ox = o.ox || 0;
  let s = `<rect width="${W}" height="${H}" fill="url(#${o.sky || 'skyDusk'})"/>`;
  s += `<circle cx="${600 - ox * 0.2}" cy="980" r="520" fill="url(#gPeach)" opacity="0.35"/>`;
  s += hills(925, 70, 0.0032, 13, '#3B2D26', ox * 0.3) + hills(995, 50, 0.0055, 15, '#30251F', ox * 0.6);
  s += floor('dusk', ox);
  return s;
}

const XF = 0.32; // duração da transição

// Marca-texto que avança palavra por palavra (funciona com quebra de linha).
function hlWords(tokens, p) {
  const tk = Array.isArray(tokens) ? tokens : tokens.split(' ');
  return tk.map((w, i) => `<mark style="--p:${f1(clamp(p * tk.length - i) * 100)}%">${w} </mark>`).join('');
}

function verseCard(text, ref, p, size, center) {
  return `<div class="verse ${size} ${center ? 'center' : ''}" style="opacity:${p};transform:translate(-50%, ${f1((1 - p) * 30)}px) scale(${f1((0.97 + 0.03 * p) * 1000) / 1000})">
    <div class="eyebrow">${size === 'big' ? 'A Bíblia diz' : 'Deus disse'}</div><div class="vtext">${text}</div><div class="vref">${ref}</div></div>`;
}

// Cartão final: o peixe entra nadando, o wordmark, as referências e o convite.
function endCard(t, t0, refs) {
  const lt = t - t0;
  const s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const swim = E.out(prog(lt, 0.0, 0.9));
  const fx = lerp(-420, 0, swim), wig = Math.sin(lt * 9) * 6 * (1 - swim * 0.7);
  const wm = E.out(prog(lt, 0.55, 1.05)), tx = E.out(prog(lt, 0.95, 1.4)), cta = pop(lt, 1.35, 0.45);
  const html = `<div class="end">
    <div class="logo">
      <svg class="fish" viewBox="0 0 400 200" style="transform:translateX(${f1(fx)}px) rotate(${f1(wig)}deg)">${fishGlyph(C.b500, C.paper)}</svg>
      <svg class="wm" viewBox="0 0 651 100" preserveAspectRatio="none" style="opacity:${wm};transform:translateX(${f1((1 - wm) * 40)}px)">${wordmark(C.ink)}</svg>
    </div>
    <div class="end-sub" style="opacity:${tx};transform:translateY(${f1((1 - tx) * 20)}px)">A história está em</div>
    <div class="end-refs" style="opacity:${tx};transform:translateY(${f1((1 - tx) * 20)}px)">${refs.map((r) => `<span>${r}</span>`).join('')}</div>
    <div class="cta" style="opacity:${clamp(cta)};transform:scale(${f1(cta * 100) / 100})">Siga para a próxima história</div>
  </div>`;
  return { svg: s, html };
}

// ---------- legenda ----------

// Sílabas aproximadas (grupos de vogais, sem acento): a fala do TTS tem ritmo
// quase constante dentro de uma frase, então dividir o tempo pelas sílabas
// erra pouco.
function syl(w) {
  const m = w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').match(/[aeiouy]+/g);
  return Math.max(1, m ? m.length : 1);
}

// Blocos de legenda com o tempo de cada palavra.
// Monta os blocos a partir de SEGS (início, fim, texto) do episódio.
function buildChunks(SEGS) {
  const out = [];
  SEGS.forEach(([a, b, raw], si) => {
    const hidden = raw.startsWith('!');
    const text = hidden ? raw.slice(1) : raw;
    const parts = text.split('|').map((p) => p.trim());
    const words = [];
    parts.forEach((p, pi) => p.split(/\s+/).forEach((w) => words.push({ w, part: pi })));
    // destaque: *...* pode cobrir mais de uma palavra
    let inK = false;
    words.forEach((x) => {
      const open = x.w.includes('*') && !inK;
      let w = x.w;
      if (open) { inK = true; w = w.replace('*', ''); }
      x.k = inK;
      if (inK && w.includes('*')) { inK = false; w = w.replace('*', ''); }
      x.w = w;
    });
    const weights = words.map((x, i) => syl(x.w) + 0.35 + (i < words.length - 1 && /[,:;]$/.test(x.w) ? 0.6 : 0));
    const total = weights.reduce((s, v) => s + v, 0);
    let acc = 0;
    words.forEach((x, i) => { x.t = a + (acc / total) * (b - a) - 0.04; acc += weights[i]; });
    parts.forEach((_, pi) => {
      const ws = words.filter((x) => x.part === pi);
      out.push({ seg: si, segEnd: b, t0: ws[0].t - 0.06, words: ws, hidden, last: pi === parts.length - 1 });
    });
  });
  out.forEach((c, i) => {
    const next = out[i + 1];
    const hold = next && next.t0 - c.segEnd < 0.6 ? next.t0 : c.segEnd + 0.4;
    c.t1 = next ? Math.min(hold, next.t0) : c.segEnd + 0.5;
  });
  return out;
}

// Hora em que uma palavra (pela ordem na frase) é falada; as cenas sincronizam por aqui.
function wordTime(segIndex, word) {
  for (const c of CHUNKS) if (c.seg === segIndex) for (const x of c.words) if (x.w.replace(/[^\p{L}]/gu, '').toLowerCase() === word.toLowerCase()) return x.t;
  return SEGS[segIndex][0];
}
