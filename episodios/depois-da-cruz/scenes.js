// O que aconteceu depois que Jesus morreu na cruz (parte 2 do longo). Vídeo longo, 1920×1080.
// L(parte, linha) é o índice da frase em SEGS (as partes do roteiro.md): trocar os tempos
// estimados da parte 10 pelos medidos, ou usar a versão do TikTok (parte 7 com 3 frases), reposiciona tudo.
// Mesmo traço e mesma câmera do longo 1 (sete-frases-na-cruz). Jesus na cruz só em silhueta;
// o corpo envolto em linho só de longe; a lança e as pernas quebradas só sugeridas; Jesus ressuscitado em pé, com rosto.

const L = (part, line) => PARTS[part - 1] + line;
const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];
const TIKTOK = typeof VARIANTE !== 'undefined' && VARIANTE === 'tiktok';
const N7 = PARTS[7] - PARTS[6]; // frases da pausa: 5 no YouTube, 3 no TikTok
const SIL = '#16110F';
const FLOOR_Y = 880; // pés dos personagens em primeiro plano (a legenda começa em ~920)
const NIGHT_OL = '#0E0D0C';

const soldado = (seed, extra = {}) => ({ ...man(seed), cover: null, beard: false, robe: C.p600, gear: { helmet: 'rom', armor: true }, ...extra });
const lider = (seed, extra = {}) => ({ ...man(seed), cover: COVERS[seed % 4], beard: true, ...extra });
const mulher = (seed, extra = {}) => ({ ...man(seed), beard: false, cover: ['#E2D8CF', C.g300, '#C9BBAE', C.g100][seed % 4], ...extra });
const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const VIVO = { ...JESUS, robe: '#FFFFFF' }; // Jesus ressuscitado: em pé, com rosto
const PILATOS = { robe: '#F4F1EC', skin: '#E0AC69', hair: '#3A2A20', beard: false };
const ANJO = { robe: '#FFFFFF', skin: '#E0AC69', hair: '#5A3A28', beard: false }; // "vestes brancas como a neve" (Mateus 28:3)
const MADALENA = { ...mulher(1101), robe: C.r400, cover: '#E2D8CF', skin: '#C68B59' };
const OUTRA = { ...mulher(1102), robe: C.g600, cover: C.g300, skin: '#A86B3C' };
const JOAO = { ...man(1002), robe: C.g400, beard: false, hair: '#3A2A20', cover: null, skin: '#C68B59' }; // o discípulo amado, como no longo 1
const PEDRO = { robe: C.p500, skin: '#C68B59', hair: '#5A3A28', beard: true, cover: null };
const TOME = { ...man(1103), robe: C.oliveDk, beard: true, cover: null, hair: '#191919', skin: '#A86B3C' };
const JOSE = { robe: '#5B3F7A', skin: '#E0AC69', hair: '#3A2A20', beard: true, cover: C.g100 }; // membro de destaque do Sinédrio
const NICODEMOS = { robe: '#7B6A55', skin: '#C68B59', hair: C.g400, beard: true, cover: C.g300 };
const PAULO = { robe: C.g600, skin: '#C68B59', hair: '#3A2A20', beard: true, bald: true };

// Texto em SVG (rótulos curtos).
const label = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${o.fam || 'Geist'}" font-weight="${o.w || 700}" font-size="${o.size || 36}" fill="${o.fill || C.inkDeep}" opacity="${f1((o.op ?? 1) * 100) / 100}">${esc(txt)}</text>`;
const flipX = (x, svg) => `<g transform="translate(${2 * x} 0) scale(-1 1)">${svg}</g>`;
const opg = (op, svg) => (op <= 0 ? '' : op >= 1 ? svg : `<g opacity="${f1(op * 100) / 100}">${svg}</g>`);
// Corte dentro de uma cena, no meio da frase: cruza de A para B no mesmo tempo das trocas de cena.
function xcut(t, tc, A, B) {
  const p = E.sine(prog(t, tc - XF / 2, tc + XF / 2));
  if (p <= 0) return A(t);
  if (p >= 1) return B(t);
  return A(t) + `<g opacity="${p.toFixed(3)}">${B(t)}</g>`;
}
// Sombra na faixa da legenda, para a legenda clara ler em cima de um fundo que muda de luz.
const SOMBRA_BAIXO = `<linearGradient id="gBaixo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></linearGradient><rect x="-200" y="720" width="${W + 400}" height="${H}" fill="url(#gBaixo)"/>`;
// Tremor de câmera (a mesma conta do véu no longo 1).
const quakeCam = (inner, cx, cy, z, q, t) => cam(inner, cx, cy, z, Math.sin(t * 43) * 12 * q, Math.cos(t * 37) * 8 * q);
// Braço que fala: sobe e desce enquanto a frase dura.
const fala = (t, t0, t1, base = 20, amp = 30) => base + amp * Math.abs(Math.sin(t * 5.5)) * (t > t0 && t < t1 ? 1 : 0);
// Onde fica a mão de uma pessoa (para pôr bolsa, pão, livro).
function mao(o, side) {
  const s = o.s || 1, f = o.flip ? -1 : 1, ang = (side > 0 ? o.armR : o.armL) ?? 14, r = (ang * Math.PI) / 180;
  return [o.x + f * s * side * (34 + 86 * Math.sin(r)), o.y + s * (-154 + 86 * Math.cos(r) + (o.kneel ? 40 : 0))];
}
// Sentado (na pedra, no chão): o corpo ajoelhado com as pernas para a frente. o.rock põe uma pedra baixa embaixo.
function sentado(o) {
  const s = o.s || 1, col = o.sil || C.g800, sw = o.sil ? 0 : f1(4 * s);
  const rk = o.rock ? `<ellipse cx="${f1(o.x)}" cy="${f1(o.y + 88 * s)}" rx="${f1(80 * s)}" ry="${f1(9 * s)}" fill="#000" opacity="0.18"/><path d="M ${f1(o.x - 78 * s)} ${f1(o.y + 86 * s)} C ${f1(o.x - 84 * s)} ${f1(o.y + 30 * s)} ${f1(o.x + 84 * s)} ${f1(o.y + 30 * s)} ${f1(o.x + 78 * s)} ${f1(o.y + 86 * s)} Z" fill="${o.rock}" ${ink(5, o.ol || C.ink)}/>` : '';
  const legs = [-15, 15].map((dx) => `<rect x="${f1(o.x + (dx - 9) * s)}" y="${f1(o.y + 18 * s)}" width="${f1(18 * s)}" height="${f1(60 * s)}" rx="${f1(9 * s)}" fill="${col}" stroke="${o.sil || C.ink}" stroke-width="${sw}"/>`).join('');
  return opg(o.op ?? 1, rk + legs + person({ ...o, kneel: true, noShadow: true, op: 1 }));
}
// Caído no chão, "como mortos" (Mateus 28:4): ang 0 em pé, ±85 deitado (gira pelos pés).
function caido(o, ang) {
  const s = o.s || 1, k = Math.abs(Math.sin((ang * Math.PI) / 180));
  let g = k > 0.6 ? `<ellipse cx="${f1(o.x + Math.sign(ang) * 150 * s)}" cy="${f1(o.y + 2)}" rx="${f1(170 * s)}" ry="${f1(12 * s)}" fill="#000" opacity="0.2"/>` : '';
  return g + `<g transform="translate(0 ${f1(-44 * s * k * k * k)}) rotate(${f1(ang)} ${f1(o.x)} ${f1(o.y)})">${person({ ...o, noShadow: k > 0.2 })}</g>`;
}
// Lágrimas que escorrem dos olhos de quem tem os pés em (x, y) e escala s.
function lagrimas(x, y, s, t, op = 1) {
  let g = '';
  [-12, 12].forEach((dx, i) => {
    const ph = (t * 0.9 + i * 0.5) % 1, ty = y + s * (-200 + ph * 40);
    g += `<path d="M ${f1(x + dx * s)} ${f1(ty)} q ${f1(-6 * s)} ${f1(10 * s)} 0 ${f1(14 * s)} q ${f1(6 * s)} ${f1(-4 * s)} 0 ${f1(-14 * s)} Z" fill="${C.b300}" opacity="${f1((1 - ph) * op * 100) / 100}"/>`;
  });
  return g;
}
// Pássaros que levantam voo (traço em V).
function passaros(t, t0, x0, y0, n = 5, col = C.ink, sp = 1, vy = 1) {
  let g = '';
  for (let i = 0; i < n; i++) {
    const p = (t - t0 - i * 0.12) * sp;
    if (p < 0) continue;
    const x = x0 + i * 40 + p * (150 + i * 20), y = y0 - p * (90 + i * 14) * vy + Math.sin(i * 2) * 20, fl = Math.sin(t * 16 + i) * 8;
    if (y < -60 || x > W + 60) continue;
    g += `<path d="M ${f1(x - 16)} ${f1(y - fl)} Q ${f1(x - 6)} ${f1(y - 6)} ${f1(x)} ${f1(y)} Q ${f1(x + 6)} ${f1(y - 6)} ${f1(x + 16)} ${f1(y - fl)}" stroke="${col}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  return g;
}
// Muro e casas da cidade em silhueta (contraluz do fim da tarde ou da madrugada).
function cidadeSil(x, base, s, fill) {
  const r = (a, b, c, d) => `<rect x="${a}" y="${b}" width="${c}" height="${d}"/>`;
  let g = r(-300, -120, 600, 120) + r(-340, -190, 70, 190) + r(270, -190, 70, 190);
  [[-220, 150, 110], [-100, 200, 100], [10, 236, 120], [140, 170, 100]].forEach(([hx, hh, hw]) => (g += r(hx, -hh, hw, hh)));
  for (let i = 0; i < 12; i++) g += r(-300 + i * 50, -146, 26, 28);
  return `<g transform="translate(${x} ${base}) scale(${s})" fill="${fill}">${g}</g>`;
}
// Céu do nascer do sol (o domingo).
function bgSunrise(t, o = {}) {
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>`;
  if (o.sun !== false) s += sun(o.sunX ?? 1500, o.sunY ?? 330, 58, t) + `<circle cx="${o.sunX ?? 1500}" cy="${o.sunY ?? 330}" r="520" fill="url(#gPeach)" opacity="0.35"/>`;
  s += clouds(t, o.ox || 0, '#FFF6EE', '#F1DCCB');
  s += hills(GROUND - 135, 80, 0.0032, o.seed || 5, '#EBDCCF', (o.ox || 0) * 0.3) + hills(GROUND - 55, 55, 0.0055, (o.seed || 5) + 2, '#E0CFC0', (o.ox || 0) * 0.6);
  s += floor('day', o.ox || 0);
  return s;
}
// Madrugada: céu escuro azulado, com a luz chegando no horizonte.
function bgMadrugada(t, o = {}) {
  let s = bgNight(t, { sky: 'skyDawn', moon: false, starOp: o.starOp ?? 0.55, ox: o.ox });
  s += `<circle cx="${o.glowX ?? 1550}" cy="${GROUND}" r="760" fill="url(#gPeach)" opacity="${o.glow ?? 0.22}"/>`;
  return s;
}

// ---------------------------------------------------------------- o túmulo (o mesmo desenho do carrossel)
// cave() de lib.js com a pedra redonda e o lacre de slide.html, na escala do vídeo largo.
const TB = { x: 1000, base: 800, s: 1.25 };
// cave() de lib.js com uma terceira paleta, a da madrugada (rocha meio-tom, para a pedra e o anjo lerem no escuro).
const ROCHA = { day: [C.g500, C.g600, C.g700, C.ink, C.g800], night: ['#3A3836', '#302E2C', '#262422', NIGHT_OL, C.g800], dawn: ['#5E5853', '#524C47', '#433E3A', NIGHT_OL, '#2A2624'] };
function caverna(x, base, s, tone) {
  if (tone !== 'dawn') return cave(x, base, s, tone);
  const [rock, facet, crack, ol, mouth] = ROCHA.dawn;
  return `<g transform="translate(${x} ${base}) scale(${s})">
    <path d="M -330 0 C -340 -170 -250 -380 -60 -440 C 120 -490 300 -360 330 -170 C 340 -90 336 -30 340 0 Z" fill="${rock}" ${ink(6, ol)}/>
    <path d="M 64 -452 C 200 -428 308 -330 327 -170 C 337 -90 333 -30 337 -3 L 152 -3 C 192 -150 172 -330 64 -452 Z" fill="${facet}"/>
    <path d="M -230 -250 C -200 -300 -160 -330 -110 -350" stroke="${crack}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M 200 -300 C 230 -260 250 -220 256 -170" stroke="${crack}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M -270 -60 C -250 -80 -220 -84 -196 -70" stroke="${crack}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M -120 0 L -120 -150 C -120 -270 110 -270 110 -150 L 110 0 Z" fill="${mouth}" ${ink(6, ol)}/>
    <path d="M -80 0 L -80 -140 C -80 -220 70 -220 70 -140 L 70 0 Z" fill="#141210"/>
  </g>`;
}
const PR = 111 * TB.s, PEDRA_Y = TB.base - PR, PEDRA_FECHADA = TB.x - 9, PEDRA_ABERTA = TB.x + 212;
function pedra(x, rot, tone) {
  const day = tone === 'day', fill = day ? C.g600 : tone === 'dawn' ? '#7C756E' : '#4A4643', mark = day ? C.g700 : tone === 'dawn' ? '#57514B' : '#2E2B29', ol = day ? C.inkDeep : NIGHT_OL, r = PR;
  return `<circle cx="${f1(x)}" cy="${f1(PEDRA_Y)}" r="${f1(r)}" fill="${fill}" ${ink(7, ol)}/>
    <g transform="translate(${f1(x)} ${f1(PEDRA_Y)}) rotate(${f1(rot)})">
      <path d="M ${f1(-r * 0.55)} ${f1(-r * 0.35)} C ${f1(-r * 0.2)} ${f1(-r * 0.6)} ${f1(r * 0.25)} ${f1(-r * 0.55)} ${f1(r * 0.5)} ${f1(-r * 0.25)}" stroke="${mark}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M ${f1(-r * 0.3)} ${f1(r * 0.45)} C ${f1(-r * 0.1)} ${f1(r * 0.55)} ${f1(r * 0.12)} ${f1(r * 0.52)} ${f1(r * 0.28)} ${f1(r * 0.4)}" stroke="${mark}" stroke-width="7" fill="none" stroke-linecap="round"/>
    </g>`;
}
// Lacre: o cordão vermelho atravessando a pedra e a rocha, com o selo de cera (Mateus 27:66).
// p desenha o cordão (0..1); broken = a pedra rolou e o cordão ficou pendurado nas bordas.
function lacre(p, broken, tone) {
  const ol = tone === 'day' ? C.inkDeep : NIGHT_OL, y = PEDRA_Y - 10, x0 = PEDRA_FECHADA - PR * 1.15, x1 = PEDRA_FECHADA + PR * 1.15;
  if (broken) return `<path d="M ${f1(x0)} ${f1(y)} q 16 30 6 70 M ${f1(x1)} ${f1(y)} q -16 30 -6 70" stroke="${C.r600}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  if (p <= 0) return '';
  const len = x1 - x0;
  let s = `<path d="M ${f1(x0)} ${f1(y)} L ${f1(x1)} ${f1(y)}" stroke="${C.r600}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${f1(len)}" stroke-dashoffset="${f1(len * (1 - clamp(p * 1.3)))}"/>`;
  const sp = pop(p, 0.75, 0.25);
  if (sp > 0) s += `<circle cx="${f1(PEDRA_FECHADA)}" cy="${f1(y)}" r="${f1(22 * sp)}" fill="${C.r600}" ${ink(6, ol)}/>`;
  return s;
}
// Pedrinhas que caem da rocha enquanto a terra treme.
function pedrinhas(t, q, tone) {
  if (q <= 0) return '';
  const r = rng(51), col = tone === 'day' ? C.g400 : '#8C857D', ol = tone === 'day' ? C.ink : NIGHT_OL;
  let g = '';
  for (let i = 0; i < 9; i++) {
    const x = TB.x + (r() - 0.5) * 620, y0 = TB.base - 300 - r() * 200, sp = 0.9 + r() * 0.8, off = r();
    const ph = (t * sp + off) % 1, y = y0 + ph * ph * (TB.base - y0);
    const rr = 8 + r() * 9, rot = t * 300 * sp + off * 360;
    g += `<path transform="translate(${f1(x + ph * 30)} ${f1(y)}) rotate(${f1(rot % 360)})" d="M ${f1(-rr)} ${f1(rr * 0.3)} L ${f1(-rr * 0.4)} ${f1(-rr)} L ${f1(rr * 0.8)} ${f1(-rr * 0.6)} L ${f1(rr)} ${f1(rr * 0.5)} L ${f1(rr * 0.1)} ${f1(rr)} Z" fill="${col}" stroke="${ol}" stroke-width="4" stroke-linejoin="round" opacity="${f1(q * (1 - ph * 0.3) * 100) / 100}"/>`;
  }
  // poeira que levanta na base da rocha
  const dc = tone === 'day' ? C.g400 : '#5A5856';
  for (let i = 0; i < 7; i++) {
    const ph = (t * 0.8 + i / 7) % 1, x = TB.x - 420 + i * 140 + Math.sin(i * 3) * 30;
    g += `<circle cx="${f1(x + (i % 2 ? 1 : -1) * ph * 50)}" cy="${f1(TB.base - 10 - ph * 70)}" r="${f1(22 + ph * 46)}" fill="${dc}" opacity="${f1(q * (1 - ph) * 0.5 * 100) / 100}"/>`;
  }
  return g;
}
// O anjo: homem de branco, luminoso ("aparência como um relâmpago", Mateus 28:3), sem asas (o texto não fala delas).
function anjo(o) {
  const s = o.s || 1, glow = o.glow ?? 0.7, gy = o.y - (o.seated ? 150 : 170) * s;
  let g = `<circle cx="${f1(o.x)}" cy="${f1(gy)}" r="${f1(330 * s)}" fill="url(#gWhite)" opacity="${f1(glow * 100) / 100}"/>`;
  const p = { ...ANJO, rim: C.b300, mood: 'calm', ...o, glow: undefined };
  g += o.seated ? sentado(p) : person(p);
  return opg(o.op ?? 1, g);
}
// Guarda romano (o soldier() do carrossel).
const GUARDAS = [[560, 1201, false], [1460, 1202, true]];
function guarda(i, o = {}) {
  const [x, seed, flip] = GUARDAS[i];
  return { ...soldado(seed), x: o.x ?? x, y: o.y ?? FLOOR_Y, s: o.s || 1.2, flip, armR: 26, gear: { helmet: 'rom', armor: true, spear: 'r' }, ...o };
}
// A cena do túmulo. o: tone ('night', 'day', 'dawn', 'dusk', 'sunrise'), bg (fundo pronto), open (0..1),
// seal (0..1), broken, quake (0..1), guards ([ângulo de queda, extra] por guarda, ou null), angel {...}, front (svg na frente).
function tumulo(t, o = {}) {
  const tone = o.tone || 'day', rockTone = tone === 'night' ? 'night' : tone === 'dawn' ? 'dawn' : 'day';
  let s = o.bg ?? (tone === 'night' ? bgNight(t, { moonX: 1600, moonY: 190 }) : tone === 'dawn' ? bgMadrugada(t) : tone === 'dusk' ? bgDusk(t) : tone === 'sunrise' ? bgSunrise(t, { sunX: 1560, sunY: o.sunY ?? 330 }) : bgDay(t, { sunX: 1560, sunY: 210 }));
  if (o.back) s += o.back;
  s += caverna(TB.x, TB.base, TB.s, rockTone);
  if (o.inside) s += o.inside;
  const op = clamp(o.open || 0), x = lerp(PEDRA_FECHADA, PEDRA_ABERTA, op);
  s += pedrinhas(t, o.quake || 0, rockTone);
  if (o.behind) s += o.behind;
  const broken = op > 0 && (o.seal ?? 0) > 0;
  if (broken) s += lacre(1, true, rockTone);
  s += pedra(x, ((x - PEDRA_FECHADA) / PR) * 57.3, rockTone);
  if (!broken) s += lacre(o.seal ?? 0, false, rockTone);
  if (o.angel) s += anjo(o.angel);
  (o.guards || []).forEach((g, i) => { if (g) s += caido(guarda(i, { t, ...g[1] }), g[0]); });
  if (o.front) s += o.front;
  if (o.flash > 0) s += `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#fff" opacity="${f1(clamp(o.flash) * 100) / 100}"/>`;
  return s;
}

// O domingo no túmulo (Mateus 28:2-4), usado na abertura e de novo na parte 4.
// k: q0/q1 (tremor), d0/d1 (o anjo desce), rola, senta, treme, cai (tempos); tone.
function domingo(t, k) {
  const q = prog(t, k.q0, k.q0 + 0.25) * (1 - prog(t, k.q1, k.q1 + 0.8));
  const desc = E.out(prog(t, k.d0, k.d1)), roll = E.inOut(prog(t, k.rola, k.rola + 1.3)), sit = E.inOut(prog(t, k.senta, k.senta + 0.7));
  const land = prog(t, k.d1 - 0.1, k.d1 + 0.5);
  let angel = null;
  if (t > k.d0) {
    const ax0 = lerp(780, 780 + (PEDRA_ABERTA - PEDRA_FECHADA), roll), sx = lerp(ax0, PEDRA_ABERTA, sit), sy = lerp(TB.base - 10, PEDRA_Y - PR + 95 - 40 * 1.12, sit) - Math.sin(Math.PI * sit) * 90;
    const y = lerp(-420, TB.base - 10, desc);
    angel = sit > 0.5 ? { x: sx, y: sy, s: 1.12, seated: true, armL: 20, armR: 30, glow: 0.75 + 0.15 * Math.sin(t * 3) }
      : { x: sx, y: sit > 0 ? sy : y, s: 1.12, armL: 14, armR: t > k.rola - 0.3 && roll < 1 ? 78 : 20, walk: roll > 0 && roll < 1 ? t * 6 : null, glow: 0.85, op: clamp(desc * 3) };
  }
  const fear = t > k.treme - 0.2, fall = (i) => E.in(prog(t, k.cai + i * 0.18, k.cai + 0.5 + i * 0.18)) * 85;
  const guards = [0, 1].map((i) => [(i ? 1 : -1) * fall(i), { mood: fall(i) > 40 ? 'closed' : fear || q > 0.1 ? 'fear' : 'calm', shake: fall(i) > 5 ? 0 : fear ? 7 : 4 * q, look: i ? -0.6 : 0.6 }]);
  let front = '';
  if (t > k.d0 && desc < 1) front += beam(780, -100, 780, TB.base, 60, 220, 0.8 * clamp(desc * 4));
  const flash = 0.5 * (1 - prog(t, k.d1, k.d1 + 0.6)) * (t > k.d1 - 0.05 ? 1 : 0);
  return { svg: tumulo(t, { tone: k.tone || 'dawn', open: roll, seal: 1, quake: q, guards, angel, back: passaros(t, k.q0 + 1.6, 180, 330, 6, '#0E1116', 1.0, 0.3), front, flash }), q };
}

// ================================================================ 1. ABERTURA
// O domingo cedo: a terra já está tremendo no primeiro quadro (Mateus 28:1-2).
const K1 = () => ({ q0: -2, q1: fim(L(1, 1)) - 0.4, d0: wordTime(L(1, 1), 'desceu') - 0.3, d1: wordTime(L(1, 1), 'rolou') - 0.35, rola: wordTime(L(1, 1), 'rolou'), senta: wordTime(L(1, 1), 'sentou') - 0.1, treme: wordTime(L(1, 2), 'tremeram') - 0.1, cai: wordTime(L(1, 2), 'mortos') - 0.5 });
function scTremor(t) {
  const { svg, q } = domingo(t, K1());
  return { svg: quakeCam(svg, 1000, FLOOR_Y, 1.12 - 0.07 * E.sine(prog(t, 0, at(L(1, 1)))), Math.max(q, 0.9), t), html: '' };
}
function scAnjoDesce(t) {
  const k = K1(), { svg, q } = domingo(t, k);
  const cy = lerp(430, 640, E.inOut(prog(t, k.d0, k.d1 + 0.4)));
  return { svg: quakeCam(svg, 1000, cy, 1.0 + 0.05 * prog(t, at(L(1, 1)), at(L(1, 2))), q, t), html: '' };
}
function scGuardasCaem(t) {
  const { svg, q } = domingo(t, K1());
  const z = 1.0 + 0.12 * E.inOut(prog(t, at(L(1, 2)), fim(L(1, 2)) + 0.3));
  return { svg: quakeCam(svg, 960, FLOOR_Y, z, q, t), html: '' };
}

// Naquela mesma manhã, alguns guardas vão até a cidade (Mateus 28:11).
function estradaCidade(t, ox, o = {}) {
  let s = (o.bg || bgSunrise)(t, { ox, sunX: 380, sunY: 300 }) + city(1650 - ox * 0.5, GROUND + 10, 0.9, t);
  s += `<path d="M -400 ${FLOOR_Y + 20} C 400 ${FLOOR_Y - 30} 1400 ${FLOOR_Y - 40} ${W + 400} ${FLOOR_Y - 10} L ${W + 400} ${H + 40} L -400 ${H + 40} Z" fill="#E6DCCF" stroke="${C.ink}" stroke-width="5"/>`;
  return s;
}
function scParaCidade(t) {
  const w = prog(t, at(L(1, 3)), at(L(1, 4)) + 0.4), ox = w * 260;
  let s = estradaCidade(t, ox);
  [1211, 1212, 1213].forEach((seed, i) => (s += person({ ...soldado(seed), x: 300 + w * 700 - i * 170, y: FLOOR_Y - 8 + (i % 2) * 10, s: 1.1, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26, walk: t * 7 + i, mood: i === 1 ? 'fear' : 'calm', look: i === 1 ? -1 : 1, t })));
  return { svg: cam(s, 900, 620, 1.04), html: '' };
}

// O salão dos chefes dos sacerdotes (blocos de pedra, colunas, lamparina).
function salao(t, o = {}) {
  const night = o.night, wall = night ? '#2A2420' : C.g200, line = night ? '#1A1512' : C.g300, ol = night ? NIGHT_OL : C.ink;
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${wall}"/>`;
  for (let r = 0; r < 12; r++) for (let c = 0; c < 13; c++) { const x = c * 170 - (r % 2) * 85 - 60, y = 20 + r * 64; if (y < 760) s += `<rect x="${x + 6}" y="${y}" width="158" height="56" rx="6" fill="none" stroke="${line}" stroke-width="4"/>`; }
  [300, 1620].forEach((x) => (s += rect(x - 52, 20, 104, 760, night ? '#3A322C' : C.g100, ink(6, ol)) + rect(x - 70, 0, 140, 40, night ? '#2E2723' : C.g300, `rx="8" ${ink(6, ol)}`) + rect(x - 70, 740, 140, 40, night ? '#2E2723' : C.g300, `rx="8" ${ink(6, ol)}`)));
  s += rect(-300, 780, W + 600, 600, night ? '#1F1A17' : C.g300) + `<line x1="-300" y1="780" x2="${W + 300}" y2="780" stroke="${ol}" stroke-width="6"/>`;
  if (o.lamp) s += lamparina(o.lamp[0], o.lamp[1], t, night ? 1 : 0.5);
  return s;
}
// Lamparina de barro num suporte, com a chama e a luz quente.
function lamparina(x, y, t, glow = 1, ol = C.ink) {
  return `<circle cx="${x}" cy="${y - 40}" r="${f1(420 + 12 * Math.sin(t * 7))}" fill="url(#gAmber)" opacity="${f1(0.45 * glow * 100) / 100}"/>
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 400}" stroke="${ol}" stroke-width="14" stroke-linecap="round"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y + 400}" stroke="${C.wood}" stroke-width="6" stroke-linecap="round"/>
    <path d="M ${x - 42} ${y} Q ${x} ${y + 28} ${x + 42} ${y} L ${x + 54} ${y - 8} L ${x - 30} ${y - 10} Z" fill="${C.p400}" ${ink(5, ol)}/>` + flame(x + 44, y - 8, 11, 38 + 6 * Math.sin(t * 11), C.p300) + flame(x + 44, y - 8, 6, 22 + 4 * Math.sin(t * 13), C.a300);
}
// Bolsa de couro amarrada (a "grande soma de dinheiro", Mateus 28:12). Fundo em (x, y).
function bolsa(x, y, s, rot = 0) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})">
    <path d="M -50 0 C -76 -12 -70 -74 -32 -92 L -18 -106 L 18 -106 L 32 -92 C 70 -74 76 -12 50 0 Z" fill="${C.p500}" ${ink(5)}/>
    <path d="M 22 -90 C 54 -70 60 -22 42 -2 L 50 0 C 76 -12 70 -74 32 -92 Z" fill="${C.p600}"/>
    <path d="M -28 -96 Q 0 -84 28 -96" stroke="${C.ink}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M -18 -106 L -30 -126 L -8 -116 L 0 -130 L 8 -116 L 30 -126 L 18 -106 Z" fill="${C.p400}" ${ink(4)}/>
  </g>`;
}
const moeda = (x, y, s, t, i) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(15 * s)}" ry="${f1((15 * Math.abs(Math.cos(t * 9 + i)) + 3) * s)}" fill="${C.a400}" ${ink(4)}/>`;
// Moedas que pulam da bolsa em arco.
function moedas(t, x0, y0, t0, n, spread = 1) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const p = prog(t, t0 + i * 0.09, t0 + i * 0.09 + 0.8);
    if (p <= 0 || p >= 1) continue;
    const dx = ((i % 2 ? 1 : -1) * (40 + i * 18)) * spread;
    s += moeda(x0 + dx * p, y0 - Math.sin(p * Math.PI) * (120 + i * 8) + p * 60, 1, t, i);
  }
  return s;
}
// Um chefe dos sacerdotes entrega a bolsa a um guarda.
function entrega(t, tg, o = {}) {
  const give = E.inOut(prog(t, tg - 0.5, tg + 0.4));
  let s = salao(t, { lamp: o.night ? [960, 380] : null, night: o.night });
  const ch = { ...lider(1221), x: 1180, y: FLOOR_Y, s: 1.35, look: -1, mood: 'calm', armR: 14, armL: lerp(20, 70, give) };
  const gd = { ...soldado(1222), x: 720, y: FLOOR_Y, s: 1.35, look: 1, mood: t > tg + 0.3 ? 'happy' : 'calm', armR: lerp(20, 68, give), gear: { helmet: 'rom', armor: true } };
  s += person(gd) + person(ch);
  const [hx0, hy0] = mao(ch, -1), [hx1, hy1] = mao(gd, 1), bx = lerp(hx0, hx1, give), by = lerp(hy0, hy1, give) - Math.sin(Math.PI * give) * 40;
  s += bolsa(bx, by + 34, 0.9, Math.sin(t * 5) * 4) + moedas(t, bx, by - 60, tg + 0.1, 6);
  if (o.more) s += o.more;
  return s;
}
function scBolsa(t) {
  return { svg: cam(entrega(t, wordTime(L(1, 4), 'dinheiro')), 960, FLOOR_Y, 1.0 + 0.08 * E.inOut(prog(t, at(L(1, 4)), at(L(1, 5)))), 0, 0), html: '' };
}

// Os inimigos lembraram a promessa (Mateus 27:62-63); a promessa: três dias (o céu passa três vezes).
function chefesNoite(t, tl, o = {}) {
  let s = salao(t, { night: true, lamp: [1530, 380] });
  const up = E.back(prog(t, tl - 0.2, tl + 0.3));
  [[650, 1231, 1.3, 1], [960, 1232, 1.4, 0], [1270, 1233, 1.3, -1]].forEach(([x, seed, sc, lk], i) => {
    s += person({ ...lider(seed), x, y: FLOOR_Y, s: sc, look: i === 1 ? 0 : t > tl ? (i ? -0.8 : 0.8) : lk * 0.3, mood: o.mood || 'angry', armR: i === 1 ? lerp(20, 168, up) : 20, armL: i === 1 ? 14 : 24 + 8 * Math.sin(t * 2 + i), rim: C.p400 });
  });
  return s;
}
// O túmulo lacrado com o céu passando de noite para dia três vezes.
function tresDias(t, t0, t1, o = {}) {
  const u = prog(t, t0, t1), ph = u * 3, d = 0.5 - 0.5 * Math.cos(2 * Math.PI * ph);
  const sa = Math.PI * (1 - ((ph + 0.5) % 1)), sx = 960 + Math.cos(sa) * 900, sy = GROUND - Math.sin(sa) * 520;
  let s = bgDay(t, { sun: false }) + sun(sx, sy, 58, t);
  s += cave(TB.x, TB.base, TB.s, 'day') + pedra(o.open ? PEDRA_ABERTA : PEDRA_FECHADA, 0, 'day') + lacre(1, !!o.open, 'day');
  if (o.guards !== false) [0, 1].forEach((i) => (s += person(guarda(i))));
  s += `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#0B0E13" opacity="${f1((0.2 + (1 - d) * 0.55) * 100) / 100}"/>` + stars(t, 110, 11, GROUND - 60, 1 - d);
  return s + SOMBRA_BAIXO;
}
function scInimigos(t) {
  const tc = wordTime(L(1, 5), 'depois') - 0.15;
  const svg = xcut(t, tc,
    (u) => cam(chefesNoite(u, wordTime(L(1, 5), 'lembraram')), 960, FLOOR_Y, 1.0 + 0.1 * E.inOut(prog(u, at(L(1, 5)), tc)), 0, 0),
    (u) => cam(tresDias(u, tc, fim(L(1, 5)) + 0.4), 1000, 600, 1.06 - 0.06 * prog(u, tc, at(L(1, 6)))));
  return { svg, html: '' };
}

// A sala dos discípulos à noite (porta, tranca e lamparina).
function sala(t, o = {}) {
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#211C19"/>`;
  for (let r = 0; r < 13; r++) for (let c = 0; c < 13; c++) { const x = c * 170 - (r % 2) * 85 - 60, y = 10 + r * 62; if (y < 760) s += `<rect x="${x + 6}" y="${y}" width="158" height="54" rx="8" fill="${(r * 7 + c * 3) % 5 ? '#2B2420' : '#302925'}" stroke="#15110F" stroke-width="5"/>`; }
  const dx = o.doorX ?? 250, open = o.open || 0;
  s += rect(dx - 120, 300, 240, 480, '#120F0D', ink(7, NIGHT_OL));
  if (open > 0) s += `<rect x="${dx - 112}" y="308" width="224" height="472" fill="#FFF3D6" opacity="${f1(open * 100) / 100}"/>`;
  s += `<g transform="translate(${dx - 112} 0) scale(${f1(1 - 0.85 * open)} 1)">${rect(0, 308, 224, 472, '#5A3F2C', ink(5, NIGHT_OL))}${[1, 2].map((k) => `<line x1="${k * 75}" y1="312" x2="${k * 75}" y2="776" stroke="#3E2B1E" stroke-width="6"/>`).join('')}</g>`;
  if (o.locked) s += rect(dx - 150, 520, 300, 30, C.wood, `rx="8" ${ink(5, NIGHT_OL)}`) + rect(dx - 160, 506, 26, 58, C.ch300, `rx="6" ${ink(4, NIGHT_OL)}`) + rect(dx + 134, 506, 26, 58, C.ch300, `rx="6" ${ink(4, NIGHT_OL)}`);
  s += rect(-300, 780, W + 600, 600, '#1A1613') + `<line x1="-300" y1="780" x2="${W + 300}" y2="780" stroke="${NIGHT_OL}" stroke-width="6"/>`;
  if (o.lamp !== false) s += lamparina(o.lampX ?? 1500, 420, t, 1, NIGHT_OL);
  return s;
}
const DISC = [[620, 1241], [800, 1242], [1120, 1243], [1300, 1244]];
function discipulos(t, o = {}) {
  let s = '';
  const who = [PEDRO, JOAO, { ...man(1243), beard: true, cover: null }, { ...man(1244), beard: true, cover: null }];
  DISC.forEach(([x, seed], i) => {
    const pp = { ...who[i], x: x + (o.dx || 0) * (i < 2 ? -1 : 1), y: FLOOR_Y - (i % 2) * 14, s: 1.25, look: (o.look ?? 0.5) * (i < 2 ? 1 : -1), mood: o.mood || 'sad', rim: o.rim ?? C.p400, t, shake: o.shake || 0 };
    if (o.arms) Object.assign(pp, o.arms(i));
    s += person(pp);
  });
  return s;
}
function scNaoEntenderam(t) {
  let s = sala(t) + discipulos(t, { mood: 'sad', arms: (i) => (i === 2 ? { armR: 160 + 6 * Math.sin(t * 3) } : i === 0 ? { armL: 40, armR: 40 } : {}) });
  return { svg: cam(s, 960, FLOOR_Y, 1.0 + 0.08 * E.inOut(prog(t, at(L(1, 6)), at(L(1, 7))))), html: '' };
}
// "Que história os guardas foram pagos pra contar": o guarda com a bolsa, de noite, olhando para os lados.
function scPagos(t) {
  let s = bgNight(t, { moonX: 1580, moonY: 200 }) + cidadeSil(600, GROUND + 20, 1.4, '#14171B');
  const g = { ...soldado(1222), x: 960, y: FLOOR_Y, s: 1.6, look: Math.sin(t * 2.2) > 0 ? 1 : -1, mood: 'calm', armL: 40, armR: 14, rim: '#5A606A', gear: { helmet: 'rom', armor: true } };
  s += person(g);
  const [hx, hy] = mao(g, -1);
  s += bolsa(hx, hy + 48, 1.05, Math.sin(t * 4) * 5);
  return { svg: cam(s, 960, FLOOR_Y, 1.0 + 0.1 * E.inOut(prog(t, at(L(1, 7)), at(L(1, 8))))), html: '' };
}
// "E quem viu Jesus vivo primeiro": o jardim ao nascer do sol, as duas figuras ainda em contraluz.
function scQuemViu(t) {
  let s = bgSunrise(t, { sunX: 1380, sunY: 420, seed: 9 });
  s += `<circle cx="1380" cy="420" r="700" fill="url(#gWhite)" opacity="0.5"/>`;
  [[180, 1.7], [1780, 1.5]].forEach(([x, sc]) => (s += olive(x, GROUND + 160, sc, '#3E4A3A', '#33402F', SIL)));
  s += person({ x: 1380, y: 760, s: 0.95, sil: SIL, rim: '#FFFFFF', armL: 20, armR: 20 });
  s += person({ x: 520, y: FLOOR_Y, s: 1.45, sil: SIL, rim: C.a300, cover: '#000', look: 1, armL: 14, armR: 14 });
  return { svg: cam(s, 1200, FLOOR_Y, 1.0 + 0.16 * E.inOut(prog(t, at(L(1, 8)), at(L(2, 0)) + 0.3))), html: '' };
}


// ================================================================ 2. SEXTA À TARDE
// y do morro de primeiro plano (hill de lib.js) na posição x, para pôr gente em cima dele.
function hillY(cx, top, hw, x) {
  const P = [[cx - hw, top + hw * 0.42], [cx - hw * 0.55, top + 30], [cx - hw * 0.3, top], [cx, top]];
  const xx = x > cx ? 2 * cx - x : x;
  let best = P[0][1], bd = 1e9;
  for (let u = 0; u <= 1; u += 0.01) {
    const v = 1 - u, bx = v * v * v * P[0][0] + 3 * v * v * u * P[1][0] + 3 * v * u * u * P[2][0] + u * u * u * P[3][0];
    const by = v * v * v * P[0][1] + 3 * v * v * u * P[1][1] + 3 * v * u * u * P[2][1] + u * u * u * P[3][1];
    if (Math.abs(bx - xx) < bd) { bd = Math.abs(bx - xx); best = by; }
  }
  return best;
}
const DUSK_OL = '#0E0B09', DUSK_HILL = '#2C221D', CRUZ_TARDE = '#0A0807';
// O Gólgota no fim da tarde, as três cruzes em silhueta (como no longo 1), com o sol baixo.
function golgotaTarde(t, o = {}) {
  let s = (o.bg === false ? '' : bgDusk(t)) + sun(o.sunX ?? 1560, o.sunY ?? GROUND - 70, 50, t) + cidadeSil(360, GROUND + 6, 0.55, '#2A201B');
  s += hill(960, 560, 1150, DUSK_HILL, DUSK_OL);
  const b = o.bows || [0.35, 0.35, 1], body = o.body !== false, rim = C.p400;
  s += crossFig(690, 592, 0.5, { fill: CRUZ_TARDE, rim, bow: b[0], body }) + crossFig(1230, 592, 0.5, { fill: CRUZ_TARDE, rim, bow: b[1], body });
  s += crossFig(960, 572, 0.64, { fill: CRUZ_TARDE, rim, plaque: true, bow: b[2], body });
  return s;
}
// A cruz do meio de perto, em silhueta, no fim da tarde.
function cruzTarde(t, x = 960, sc = 1.5, o = {}) {
  return bgDusk(t) + sun(o.sunX ?? 1600, o.sunY ?? 520, 54, t) + hill(x, 880, 1300, DUSK_HILL, DUSK_OL) + crossFig(x, 905, sc, { plaque: true, fill: CRUZ_TARDE, rim: C.p400, bow: 1 });
}
const silT = (o) => person({ sil: CRUZ_TARDE, rim: C.p400, noShadow: true, ...o });
function scSexta(t) {
  const z = 1.3 - 0.3 * E.inOut(prog(t, at(L(2, 0)), at(L(2, 1)) + 0.4));
  return { svg: cam(golgotaTarde(t), 960, 420, z), html: '' };
}
// As autoridades e o sábado que começava ao pôr do sol (João 19:31).
function scSabado(t) {
  const tp = wordTime(L(2, 1), 'sábado'), point = E.back(prog(t, tp - 0.4, tp));
  let s = bgDusk(t) + `<g transform="translate(1250 560) scale(0.62) translate(-960 -560)">${golgotaTarde(t, { bg: false })}</g>` + floor('dusk');
  [[420, 1251, 1.3], [660, 1252, 1.38], [900, 1253, 1.28]].forEach(([x, seed, sc], i) => (s += person({ ...lider(seed), x, y: FLOOR_Y - (i % 2) * 10, s: sc, look: 1, mood: 'angry', rim: C.p400, armR: i === 1 ? lerp(20, 112, point) : 20 + 6 * Math.sin(t * 3 + i), armL: 18 })));
  return { svg: cam(s, 960, 600, 1.0 + 0.05 * prog(t, at(L(2, 1)), at(L(2, 2)))), html: '' };
}
// Os soldados vão de cruz em cruz; só se vê a cabeça dos dois criminosos cair (João 19:32). Nada da violência.
function scPernas(t) {
  const t1 = wordTime(L(2, 2), 'pernas'), t2 = wordTime(L(2, 2), 'criminosos');
  const go = E.inOut(prog(t, at(L(2, 2)), t1 - 0.2)), go2 = E.inOut(prog(t, t1 + 0.4, t2));
  let s = golgotaTarde(t, { bows: [lerp(0.35, 1, E.inOut(prog(t, t1, t1 + 0.6))), lerp(0.35, 1, E.inOut(prog(t, t2 + 0.1, t2 + 0.7))), 1] });
  [0, 1].forEach((i) => {
    const x = lerp(lerp(330 - i * 70, 610 - i * 70, go), 1150 + i * 70, go2);
    s += silT({ x, y: hillY(960, 560, 1150, x) + 8, s: 0.42, walk: (go > 0 && go < 1) || (go2 > 0 && go2 < 1) ? t * 7 + i : null, gear: { helmet: 'rom', spear: 'r' }, armR: 26, look: 1 });
  });
  return { svg: cam(s, 960, 480, 1.08 + 0.04 * prog(t, at(L(2, 2)), at(L(2, 3)))), html: '' };
}
function scJaMorto(t) {
  let s = cruzTarde(t);
  s += silT({ x: 470, y: FLOOR_Y, s: 1.45, gear: { helmet: 'rom', armor: true }, armR: 20, armL: 14 });
  return { svg: cam(s, 960, 600, 1.0 + 0.06 * E.inOut(prog(t, at(L(2, 3)), at(L(2, 4))))), html: '' };
}
// A lança só sugerida: a ponta para antes do corpo e a câmera sobe para o céu (João 19:34). Sem sangue na tela.
function scLanca(t) {
  const tf = wordTime(L(2, 4), 'furou'), th = E.inOut(prog(t, tf - 0.3, tf + 0.3));
  let s = cruzTarde(t, 1260, 1.3, { sunX: 1700, sunY: 230 });
  const so = { x: 640, y: FLOOR_Y, s: 1.5, gear: { helmet: 'rom', armor: true }, armR: lerp(120, 150, th), armL: 14 };
  const [hx, hy] = mao(so, 1), a = (lerp(8, 34, th) * Math.PI) / 180, push = 24 * th;
  const tx = hx + Math.sin(a) * (330 + push), ty = hy - Math.cos(a) * (330 + push), bx = hx - Math.sin(a) * 120, by = hy + Math.cos(a) * 120;
  s += `<line x1="${f1(bx)}" y1="${f1(by)}" x2="${f1(tx)}" y2="${f1(ty)}" stroke="${CRUZ_TARDE}" stroke-width="12" stroke-linecap="round"/><path d="M ${f1(tx + Math.sin(a) * 46)} ${f1(ty - Math.cos(a) * 46)} L ${f1(tx + Math.cos(a) * 11)} ${f1(ty + Math.sin(a) * 11)} L ${f1(tx - Math.cos(a) * 11)} ${f1(ty - Math.sin(a) * 11)} Z" fill="${CRUZ_TARDE}"/>`;
  s += silT(so);
  return { svg: cam(s, 1000, FLOOR_Y, 1.0 + 0.08 * prog(t, at(L(2, 4)), at(L(2, 5)))), html: '' };
}
// "Aí entra um homem que ninguém esperava."
function scHomem(t) {
  const w = E.out(prog(t, at(L(2, 5)), fim(L(2, 5)) + 0.2));
  let s = bgDusk(t) + cidadeSil(500, GROUND + 6, 1.1, '#2A201B') + `<path d="M -400 ${FLOOR_Y + 10} C 600 ${FLOOR_Y - 30} 1400 ${FLOOR_Y - 30} ${W + 400} ${FLOOR_Y} L ${W + 400} ${H + 40} L -400 ${H + 40} Z" fill="#3A2D26" stroke="${DUSK_OL}" stroke-width="5"/>`;
  s += person({ ...JOSE, x: lerp(1900, 1180, w), y: FLOOR_Y - 6, s: 1.45, look: -1, mood: 'calm', walk: w < 0.98 ? t * 6 : null, rim: C.p400 });
  return { svg: cam(s, 1100, 620, 1.04), html: '' };
}
// O Sinédrio: José entre os que condenaram Jesus (Marcos 15:43; 14:64).
function scSinedrio(t) {
  const tc = wordTime(L(2, 6), 'condenado'), up = E.back(prog(t, tc - 0.3, tc + 0.1));
  let s = salao(t);
  [[420, 1261], [640, 1262], [1280, 1263], [1500, 1264]].forEach(([x, seed], i) => (s += person({ ...lider(seed), x, y: 760, s: 1.0, look: i < 2 ? 1 : -1, mood: up > 0.3 ? 'angry' : 'calm', armR: lerp(18, 165, up), noShadow: true })));
  [[330, 1265], [600, 1266], [1320, 1267], [1590, 1268]].forEach(([x, seed], i) => (s += person({ ...lider(seed), x, y: FLOOR_Y, s: 1.2, look: i < 2 ? 1 : -1, mood: up > 0.3 ? 'angry' : 'calm', armL: lerp(18, 160, up * (i % 2)), armR: lerp(18, 160, up * ((i + 1) % 2)) })));
  s += person({ ...JOSE, x: 960, y: FLOOR_Y, s: 1.35, mood: up > 0.3 ? 'sad' : 'calm', look: 0 });
  return { svg: cam(s, 960, FLOOR_Y, 1.0 + 0.12 * E.inOut(prog(t, at(L(2, 6)), wordTime(L(2, 6), 'conselho')))), html: '' };
}
// Discípulo em segredo, por medo (João 19:38): José sozinho à noite, olhando para os lados.
function scSegredo(t) {
  let s = bgNight(t, { moonX: 1580, moonY: 180 }) + cidadeSil(960, GROUND + 10, 1.8, '#15181C');
  s += rect(1180, 300, 760, 520, '#1C2024', ink(6, NIGHT_OL)) + rect(1150, 280, 820, 34, '#252A2F', `rx="6" ${ink(5, NIGHT_OL)}`);
  s += rect(1300, 420, 100, 120, C.a300, `rx="10" ${ink(5, NIGHT_OL)}`) + `<line x1="1350" y1="420" x2="1350" y2="540" stroke="${NIGHT_OL}" stroke-width="5"/><circle cx="1350" cy="480" r="300" fill="url(#gAmber)" opacity="0.32"/>`;
  s += person({ ...JOSE, x: 900, y: FLOOR_Y, s: 1.5, mood: 'fear', t, look: Math.sin(t * 1.8) > 0 ? 1 : -1, armL: 38, armR: 38, rim: '#5A606A' });
  return { svg: cam(s, 900, FLOOR_Y, 1.0 + 0.08 * E.inOut(prog(t, at(L(2, 7)), at(L(2, 8))))), html: '' };
}
// O palácio de Pilatos (o mesmo do longo 1).
function palacio(t) {
  let s = bgDay(t, { seed: 881, sunX: 300, sunY: 200 });
  [300, 620, 1300, 1620].forEach((x) => (s += rect(x - 44, 120, 88, 560, C.g100, ink(6)) + rect(x - 60, 100, 120, 32, C.g300, `rx="8" ${ink(6)}`)));
  s += rect(200, 90, 1520, 26, C.g300, ink(6));
  s += rect(1080, 640, 620, 130, C.g300, ink(6)) + rect(1050, 620, 680, 34, C.g400, `rx="8" ${ink(6)}`);
  s += throne(1560, 622, 0.62, C.a400);
  return s;
}
function scPilatosJose(t) {
  const tp = wordTime(L(2, 8), 'pediu'), w = E.inOut(prog(t, at(L(2, 8)), wordTime(L(2, 8), 'pilatos'))), ask = E.back(prog(t, tp - 0.3, tp + 0.2));
  let s = palacio(t);
  s += person({ ...PILATOS, x: 1360, y: 640, s: 1.1, look: -1, mood: 'calm', armR: 14 + 70 * E.inOut(prog(t, fim(L(2, 8)) - 0.6, fim(L(2, 8)))), armL: 14 });
  s += person({ ...JOSE, x: lerp(300, 880, w), y: FLOOR_Y, s: 1.3, look: 1, mood: 'calm', walk: w > 0 && w < 1 ? t * 6 : null, armL: lerp(14, 130, ask), armR: lerp(14, 130, ask) });
  return { svg: cam(s, 960, 560, 1.0 + 0.05 * prog(t, at(L(2, 8)), at(L(2, 9)))), html: '' };
}
// Nicodemos com a mirra e o aloés (João 19:39).
function estradaTarde(t) {
  return bgDusk(t) + sun(1600, GROUND - 60, 50, t) + cidadeSil(420, GROUND + 6, 0.8, '#2A201B') + `<path d="M -400 ${FLOOR_Y + 10} C 600 ${FLOOR_Y - 30} 1400 ${FLOOR_Y - 30} ${W + 400} ${FLOOR_Y} L ${W + 400} ${H + 40} L -400 ${H + 40} Z" fill="#3A2D26" stroke="${DUSK_OL}" stroke-width="5"/>`;
}
function scNicodemos(t) {
  const w = E.out(prog(t, at(L(2, 9)), wordTime(L(2, 9), 'visitado')));
  let s = estradaTarde(t);
  s += person({ ...JOSE, x: 1240, y: FLOOR_Y - 6, s: 1.35, look: -1, mood: 'calm', rim: C.p400, armR: w > 0.95 ? 60 : 14 });
  const n = { ...NICODEMOS, x: lerp(-150, 880, w), y: FLOOR_Y - 6, s: 1.35, look: 1, mood: 'calm', walk: w < 0.98 ? t * 5 : null, armL: 10, armR: 10, rim: C.p400 };
  s += person(n);
  [-1, 1].forEach((sd) => { const [hx, hy] = mao(n, sd); s += jar(hx, hy + 70, 1.1, Math.sin(t * 5 + sd) * 3 * (w < 0.98 ? 1 : 0)); });
  return { svg: cam(s, lerp(700, 1000, w), 620, 1.06, 0, 0), html: '' };
}
// O corpo envolto em faixas de linho, só de longe (João 19:40).
function corpoLinho(x, y, s) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-150" y="-40" width="300" height="46" rx="23" fill="#F4F1EC" ${ink(5)}/>${[-90, -40, 10, 60, 105].map((dx) => `<line x1="${dx}" y1="-37" x2="${dx + 10}" y2="3" stroke="${C.g400}" stroke-width="4"/>`).join('')}</g>`;
}
function scLinho(t) {
  let s = golgotaTarde(t, { body: false, sunY: GROUND - 30 });
  s += corpoLinho(960, 790, 0.75);
  const tend = Math.sin(t * 2.4) * 10;
  s += person({ ...JOSE, x: 760, y: 790, s: 0.78, kneel: true, look: 1, mood: 'sad', armL: 20, armR: 60 + tend, rim: C.p400 });
  s += person({ ...NICODEMOS, x: 1160, y: 790, s: 0.78, kneel: true, look: -1, mood: 'sad', armL: 60 - tend, armR: 20, rim: C.p400 });
  return { svg: cam(s, 960, 640, 1.0 + 0.04 * prog(t, at(L(2, 10)), at(L(2, 11)))), html: '' };
}
// O jardim e o túmulo novo, cavado na rocha (João 19:41; Marcos 15:46).
function flores(x, y, s, t, seed) {
  const r = rng(seed); let g = '';
  for (let i = 0; i < 6; i++) {
    const dx = (r() - 0.5) * 120, h = 30 + r() * 40, sw = Math.sin(t * 1.6 + i + seed) * 3, col = pick(r, [C.a300, C.r300, '#FFFFFF', C.b300]);
    g += `<line x1="${f1(dx)}" y1="0" x2="${f1(dx + sw)}" y2="${f1(-h)}" stroke="#3E4A3A" stroke-width="5" stroke-linecap="round"/><circle cx="${f1(dx + sw)}" cy="${f1(-h)}" r="10" fill="${col}" ${ink(3)}/>`;
  }
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${g}</g>`;
}
function jardim(t, o = {}) {
  const dark = o.tone === 'dusk' || o.tone === 'dawn' || o.tone === 'night';
  const c1 = dark ? '#4A5444' : C.olive, c2 = dark ? '#3B4537' : C.oliveDk, ol = dark ? DUSK_OL : C.ink;
  let s = (o.trees || [[150, GROUND + 140, 1.5], [430, GROUND + 90, 1.1], [1720, GROUND + 130, 1.35]]).map(([x, y, sc]) => olive(x, y, sc, c1, c2, ol)).join('');
  s += flores(330, 840, 1.1, t, 3) + flores(660, 820, 0.9, t, 4) + flores(1560, 840, 1.0, t, 5);
  return s;
}
function scJardim(t) {
  const pan = E.inOut(prog(t, wordTime(L(2, 11), 'túmulo') - 0.8, wordTime(L(2, 11), 'cavado') + 0.4));
  const s = tumulo(t, { tone: 'dusk', open: 1, back: jardim(t, { tone: 'dusk', trees: [[150, GROUND + 140, 1.5], [430, GROUND + 90, 1.1]] }), front: flores(1560, 840, 1.0, t, 5) });
  return { svg: cam(s, lerp(420, 1000, pan), lerp(700, 600, pan), lerp(1.35, 1.0, pan), 0, 0), html: '' };
}
// "Ali eles colocaram Jesus, e José rolou uma grande pedra na entrada" (Mateus 27:60).
function scPedraRola(t) {
  const tj = wordTime(L(2, 12), 'josé'), tr = wordTime(L(2, 12), 'rolou');
  const carry = E.inOut(prog(t, at(L(2, 12)), tj - 0.1)), roll = E.inOut(prog(t, tr - 0.2, fim(L(2, 12)) + 0.2));
  const open = 1 - roll;
  let behind = '';
  if (carry < 1) {
    const x = lerp(560, 990, carry), op = 1 - prog(carry, 0.75, 1), y = lerp(FLOOR_Y - 10, TB.base - 6, carry), sc = lerp(1.0, 0.8, carry);
    behind += opg(op, person({ ...JOSE, x: x - 130 * sc, y, s: sc, look: 1, walk: t * 5, armR: 60, armL: 40 }) + corpoLinho(x, y - 120 * sc, 0.55 * sc) + person({ ...NICODEMOS, x: x + 130 * sc, y, s: sc, look: 1, walk: t * 5, armL: 60, armR: 40 }));
  }
  let front = '';
  if (t > tj - 0.3) {
    const px = lerp(PEDRA_ABERTA, PEDRA_FECHADA, roll) + PR + 40, ap = prog(t, tj - 0.3, tj + 0.1);
    front += person({ ...JOSE, x: px, y: TB.base + 40, s: 1.15, flip: true, lean: 12 * (roll > 0 && roll < 1 ? 1 : 0.4), armR: 80, armL: 70, walk: roll > 0 && roll < 1 ? t * 5 : null, mood: 'sad', op: ap });
  }
  const s = tumulo(t, { tone: 'dusk', open, back: jardim(t, { tone: 'dusk' }), inside: behind, front });
  return { svg: cam(s, 1000, 640, 1.04 + 0.04 * prog(t, at(L(2, 12)), at(L(2, 13)))), html: '' };
}
// As duas Marias sentadas em frente ao túmulo (Mateus 27:61); a tarde vira noite.
function scMarias(t) {
  const n = E.inOut(prog(t, at(L(2, 13)), at(L(3, 0)) + 0.4));
  let s = tumulo(t, { tone: 'dusk', back: jardim(t, { tone: 'dusk' }) });
  s += `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#0B0E13" opacity="${f1(n * 0.45 * 100) / 100}"/>`;
  s += sentado({ ...MADALENA, x: 560, y: 784, s: 1.15, mood: 'sad', look: 0.6, armL: 30, armR: 30, rim: C.p400, rock: '#5A4A40' }) + lagrimas(560, 824, 1.15, t);
  s += sentado({ ...OUTRA, x: 780, y: 788, s: 1.1, mood: 'sad', look: 0.6, armL: 24, armR: 24, rim: C.p400, rock: '#5A4A40' });
  return { svg: cam(s, 900, FLOOR_Y, 1.12 - 0.12 * E.sine(prog(t, at(L(2, 13)), at(L(3, 0))))), html: '' };
}

// ================================================================ 3. OS GUARDAS
// Os chefes e os fariseus diante de Pilatos (Mateus 27:62-65).
const CHEFES = [[520, 1301], [700, 1302], [880, 1303]];
function diantePilatos(t, o = {}) {
  let s = palacio(t);
  s += person({ ...PILATOS, x: 1360, y: 640, s: 1.1, look: -1, mood: 'calm', armR: o.pilArm ?? 14, armL: 14 });
  const w = o.walk ?? 1;
  if (!o.noChefes) CHEFES.forEach(([x, seed], i) => (s += person({ ...lider(seed), x: lerp(x - 700, x, w), y: FLOOR_Y - (i % 2) * 12, s: 1.2, look: 1, mood: o.mood || 'angry', walk: w > 0 && w < 1 ? t * 6 + i : null, armR: i === (o.who ?? 2) ? o.arm ?? 20 : 20, armL: 18 })));
  return s;
}
// A história que eles queriam evitar: discípulos levando o corpo de noite. É imaginação deles, então vem
// apagada, em silhueta, e o corpo só de longe.
function roubo(t, o = {}) {
  let s = tumulo(t, { tone: 'night', open: 1, seal: o.seal ?? 0, guards: o.asleep ? [[-85, { mood: 'closed' }], [85, { mood: 'closed' }]] : null });
  const ph = (t * 0.07) % 1, x = lerp(1000, 120, (o.p ?? ph)), y = FLOOR_Y - 30;
  const dk = '#0B0C0E', rim = '#8A929E';
  s += person({ x: x - 120, y, s: 1.0, sil: dk, rim, walk: t * 5, armR: 60, armL: 30, noShadow: true, lean: -4 });
  s += corpoLinho(x, y - 128, 0.52).replace(/#F4F1EC/g, '#B8BDC4');
  s += person({ x: x + 120, y, s: 1.0, sil: dk, rim, walk: t * 5 + 2, armL: 60, armR: 30, noShadow: true, lean: -4, flip: true });
  s += `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#3A404A" opacity="0.18"/>`;
  return s;
}
function scChefesPilatos(t) {
  const w = E.out(prog(t, at(L(3, 0)), fim(L(3, 0)))), tc = wordTime(L(3, 1), 'venham') - 0.2;
  const A = (u) => cam(diantePilatos(u, { walk: w, arm: fala(u, seg(L(3, 1)), fim(L(3, 1)), 30, 50) }), 960, 560, 1.0 + 0.06 * prog(u, at(L(3, 0)), tc));
  const B = (u) => cam(roubo(u, { p: prog(u, tc, fim(L(3, 1)) + 0.4) * 0.5 }), 960, 640, 1.04);
  return { svg: xcut(t, tc, A, B), html: '' };
}
function scEngano(t) {
  const s = diantePilatos(t, { who: 2, arm: lerp(20, 100, E.back(prog(t, wordTime(L(3, 2), 'engano') - 0.3, wordTime(L(3, 2), 'engano')))) });
  return { svg: cam(s, 760, FLOOR_Y, 1.5 + 0.05 * prog(t, at(L(3, 2)), at(L(3, 3)))), html: '' };
}
function scDestacamento(t) {
  const tl = wordTime(L(3, 3), 'levem'), arm = lerp(14, 105, E.back(prog(t, tl - 0.3, tl + 0.1)));
  const s = diantePilatos(t, { pilArm: arm, mood: 'calm', noChefes: true });
  return { svg: cam(s, 1300, 640, 1.65 - 0.05 * prog(t, at(L(3, 3)), at(L(3, 4)))), html: '' };
}
// Guardas na entrada e a pedra lacrada (Mateus 27:66).
function scLacre(t) {
  const m = E.out(prog(t, at(L(3, 4)), wordTime(L(3, 4), 'entrada'))), tl = wordTime(L(3, 4), 'lacraram');
  const seal = prog(t, tl - 0.2, tl + 0.8);
  const guards = [0, 1].map((i) => [0, { x: lerp(i ? 2100 : -180, GUARDAS[i][0], m), walk: m < 1 ? t * 7 : null, mood: 'calm' }]);
  const s = tumulo(t, { tone: 'day', seal, guards, back: jardim(t, {}) });
  return { svg: cam(s, 1000, 620, 1.0 + 0.08 * E.inOut(prog(t, tl - 0.4, at(L(3, 5))))), html: '' };
}
function scEvitar(t) {
  return { svg: cam(roubo(t, { p: prog(t, at(L(3, 5)), at(L(3, 6)) + 1) * 0.8 }), 900, 640, 1.04 + 0.08 * prog(t, at(L(3, 5)), at(L(3, 6)))), html: '' };
}
// "Guarda essa história. Ela vai voltar.": o túmulo lacrado anoitece.
function scVaiVoltar(t) {
  const n = E.inOut(prog(t, at(L(3, 6)), at(L(4, 0))));
  let s = tumulo(t, { tone: 'dusk', seal: 1, guards: [[0, {}], [0, {}]], back: jardim(t, { tone: 'dusk' }) });
  s += `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#0B0E13" opacity="${f1((0.2 + n * 0.5) * 100) / 100}"/>` + stars(t, 110, 11, GROUND - 60, n);
  return { svg: cam(s, 1000, FLOOR_Y, 1.12 - 0.1 * E.sine(prog(t, at(L(3, 6)), at(L(4, 0))))), html: '' };
}


// ================================================================ 4. DOMINGO DE MANHÃ
// "Passou o sábado": a noite corre por cima do túmulo lacrado.
function scPassou(t) {
  const u = prog(t, at(L(4, 0)), at(L(4, 1)) + 0.3), a = Math.PI * (0.15 + 0.7 * u);
  let bg = bgNight(t * 6, { moon: false }) + moon(960 - Math.cos(a) * 820, GROUND - Math.sin(a) * 480, 46, '#14181D');
  const s = tumulo(t, { tone: 'night', bg, seal: 1, guards: [[0, {}], [0, {}]] });
  return { svg: cam(s, 1000, 600, 1.06 - 0.04 * u), html: '' };
}
// As duas Marias andando de madrugada (Mateus 28:1).
function scMulheres(t) {
  const w = prog(t, at(L(4, 1)), at(L(4, 2)) + 0.3), ox = w * 500;
  let s = bgMadrugada(t, { ox, glow: 0.3 + 0.15 * w }) + cidadeSil(300 - ox * 0.3, GROUND + 8, 0.7, '#161A20');
  s += [[300, 1.5], [900, 1.1], [1500, 1.6], [2100, 1.3]].map(([x, sc]) => olive(x - ox, GROUND + 160, sc, '#3E4A3A', '#33402F', NIGHT_OL)).join('');
  s += `<path d="M -400 ${FLOOR_Y + 14} C 600 ${FLOOR_Y - 26} 1400 ${FLOOR_Y - 26} ${W + 400} ${FLOOR_Y + 4} L ${W + 400} ${H + 40} L -400 ${H + 40} Z" fill="#2A3038" stroke="${NIGHT_OL}" stroke-width="5"/>`;
  s += person({ ...OUTRA, x: 640 + w * 300, y: FLOOR_Y - 6, s: 1.3, look: 1, mood: 'sad', walk: t * 5, rim: '#5A606A' });
  s += person({ ...MADALENA, x: 860 + w * 300, y: FLOOR_Y, s: 1.35, look: 1, mood: 'sad', walk: t * 5 + 1.5, rim: '#5A606A' });
  return { svg: cam(s, 1000, FLOOR_Y, 1.04), html: '' };
}
// O mesmo domingo da abertura, agora na ordem da história (Mateus 28:2-4).
const K4 = () => ({ q0: wordTime(L(4, 2), 'terremoto') - 0.35, q1: fim(L(4, 3)) - 0.4, d0: wordTime(L(4, 3), 'desceu') - 0.3, d1: wordTime(L(4, 3), 'rolou') - 0.35, rola: wordTime(L(4, 3), 'rolou'), senta: wordTime(L(4, 3), 'sentou') - 0.1, treme: wordTime(L(4, 5), 'tremeram') - 0.1, cai: wordTime(L(4, 5), 'mortos') - 0.5 });
function scTerremoto(t) {
  const { svg, q } = domingo(t, K4());
  return { svg: quakeCam(svg, 1000, FLOOR_Y, 1.0 + 0.06 * prog(t, at(L(4, 2)), at(L(4, 3))), q, t), html: '' };
}
function scAnjo2(t) {
  const k = K4(), { svg, q } = domingo(t, k);
  return { svg: quakeCam(svg, 1060, FLOOR_Y, 1.1 - 0.06 * prog(t, at(L(4, 3)), at(L(4, 4))), q, t), html: '' };
}
// "A aparência dele era como um relâmpago" (Mateus 28:3): de perto, a luz cresce de uma vez.
function scRelampago(t) {
  const tr = wordTime(L(4, 4), 'relâmpago'), f = prog(t, tr - 0.15, tr), flash = f * (1 - prog(t, tr, tr + 0.7));
  const glow = 0.8 + 0.25 * f;
  const angel = { x: PEDRA_ABERTA, y: PEDRA_Y - PR + 95 - 40 * 1.12, s: 1.12, seated: true, armL: 20, armR: 30, glow: Math.min(1, glow) };
  let s = tumulo(t, { tone: 'dawn', open: 1, seal: 1, angel });
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 + t * 0.15; s += `<path d="M ${PEDRA_ABERTA} 420 L ${f1(PEDRA_ABERTA + Math.cos(a - 0.05) * 1400)} ${f1(420 + Math.sin(a - 0.05) * 1400)} L ${f1(PEDRA_ABERTA + Math.cos(a + 0.05) * 1400)} ${f1(420 + Math.sin(a + 0.05) * 1400)} Z" fill="#fff" opacity="${f1(0.08 + 0.25 * f * (1 - prog(t, tr + 0.4, tr + 1.4)) * 100) / 100}"/>`; }
  s += `<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="#fff" opacity="${f1(flash * 0.7 * 100) / 100}"/>`;
  return { svg: cam(s, PEDRA_ABERTA, 430, 1.75 + 0.06 * prog(t, at(L(4, 4)), at(L(4, 5)))), html: '' };
}
function scComoMortos(t) {
  const { svg } = domingo(t, K4());
  return { svg: cam(svg, 960, FLOOR_Y, 1.0 + 0.1 * E.inOut(prog(t, at(L(4, 5)), fim(L(4, 5)) + 0.3))), html: '' };
}
// O anjo fala com as mulheres (Mateus 28:5-6).
const ANJO_PEDRA = (t, o = {}) => ({ x: PEDRA_ABERTA, y: PEDRA_Y - PR + 95 - 40 * 1.12, s: 1.12, seated: true, armL: 20, armR: 30, glow: 0.75 + 0.1 * Math.sin(t * 3), ...o });
function scNaoTenham(t) {
  const w = E.out(prog(t, at(L(4, 6)), seg(L(4, 6)) + 1.2)), calm = t > wordTime(L(4, 7), 'ressuscitou');
  const tv = wordTime(L(4, 8), 'venham'), point = E.back(prog(t, tv - 0.3, tv + 0.1));
  const talk = fala(t, seg(L(4, 6)), fim(L(4, 7)), 20, 40);
  const angel = ANJO_PEDRA(t, { armL: lerp(talk, 105, point), armR: 30, glow: 0.75 + 0.15 * prog(t, wordTime(L(4, 7), 'ressuscitou') - 0.2, wordTime(L(4, 7), 'ressuscitou') + 0.6) });
  const front = person({ ...OUTRA, x: lerp(-100, 380, w), y: FLOOR_Y, s: 1.3, look: 1, mood: calm ? 'happy' : 'fear', t, walk: w < 1 ? t * 5 : null, rim: '#8A929E' }) +
    person({ ...MADALENA, x: lerp(100, 580, w), y: FLOOR_Y, s: 1.35, look: 1, mood: calm ? 'happy' : 'fear', t, walk: w < 1 ? t * 5 + 1 : null, rim: '#8A929E' });
  const s = tumulo(t, { tone: 'dawn', bg: bgMadrugada(t, { glow: 0.45, starOp: 0.3 }), open: 1, seal: 1, angel, guards: [[-85, { mood: 'closed' }], [85, { mood: 'closed' }]], front });
  const zin = E.inOut(prog(t, tv - 0.2, fim(L(4, 8)) + 0.5));
  return { svg: cam(s, lerp(900, 1000, zin), FLOOR_Y, 1.0 + 0.04 * prog(t, at(L(4, 6)), tv) + 0.3 * zin), html: '' };
}
// As mulheres correm, com medo e alegria (Mateus 28:8).
function caminhoSol(t, ox) {
  let s = bgSunrise(t, { ox, sunX: 1500, sunY: 300 });
  s += [[200, 1.4], [800, 1.0], [1400, 1.5], [2000, 1.2], [2600, 1.4]].map(([x, sc]) => olive(((x - ox * 0.9) % 2800 + 2800) % 2800 - 300, GROUND + 140, sc)).join('');
  s += `<path d="M -400 ${FLOOR_Y + 14} C 600 ${FLOOR_Y - 26} 1400 ${FLOOR_Y - 26} ${W + 400} ${FLOOR_Y + 4} L ${W + 400} ${H + 40} L -400 ${H + 40} Z" fill="#E6DCCF" stroke="${C.ink}" stroke-width="5"/>`;
  return s;
}
function scCorrem(t) {
  const ox = (t - at(L(4, 9))) * 260;
  let s = caminhoSol(t, ox);
  s += person({ ...OUTRA, x: 760, y: FLOOR_Y - 4, s: 1.3, look: 1, mood: 'happy', walk: t * 10, lean: 6, armL: 30, armR: 30 + 15 * Math.sin(t * 10) });
  s += person({ ...MADALENA, x: 1010, y: FLOOR_Y, s: 1.35, look: 1, mood: 'happy', walk: t * 10 + 1.4, lean: 6, armL: 30 + 15 * Math.sin(t * 10), armR: 30 });
  return { svg: cam(s, 960, FLOOR_Y, 1.04), html: '' };
}
// Jesus vai ao encontro delas: "Salve!"; elas abraçam os pés dele (Mateus 28:9).
function encontro(t, o) {
  let s = caminhoSol(t, o.ox || 0);
  s += `<circle cx="${f1(o.jx)}" cy="560" r="420" fill="url(#gWhite)" opacity="0.55"/>`;
  s += person({ ...VIVO, x: o.jx, y: FLOOR_Y - 4, s: 1.4, look: -1, mood: o.jmood || 'happy', armR: o.jarm ?? 14, armL: o.jarmL ?? 14, walk: o.jwalk ? t * 5 : null, rim: C.a300 });
  const k = o.kneel || 0;
  [[OUTRA, -270, 0], [MADALENA, -90, 1]].forEach(([M, dx, i]) => {
    const x = lerp(o.wx + dx, o.jx - (i ? 175 : 345), k), kn = k > 0.5;
    s += person({ ...M, x, y: FLOOR_Y - 2 * i, s: 1.3, look: 1, mood: kn ? 'closed' : o.mood, t, kneel: kn, lean: kn ? 10 : 0, armL: kn ? 30 : 20, armR: kn ? 62 : 20, walk: o.walk ? t * 7 + i : null });
  });
  return s;
}
function scSalve(t) {
  const st = E.out(prog(t, at(L(4, 10)), wordTime(L(4, 10), 'encontro') + 0.4)), ts = wordTime(L(4, 10), 'salve');
  const s = encontro(t, { ox: 260 * Math.min(1.2, t - at(L(4, 10))) * (1 - st * 0.5), jx: lerp(1700, 1340, E.inOut(prog(t, wordTime(L(4, 10), 'jesus') - 0.3, wordTime(L(4, 10), 'encontro') + 0.5))), jwalk: t < wordTime(L(4, 10), 'encontro') + 0.5 && t > wordTime(L(4, 10), 'jesus') - 0.3, wx: lerp(760, 940, st), walk: st < 0.98, mood: t > ts ? 'happy' : 'fear', jarm: lerp(14, 150, E.back(prog(t, ts - 0.3, ts + 0.1))) });
  return { svg: cam(s, 1080, FLOOR_Y, 1.02 + 0.06 * prog(t, at(L(4, 10)), at(L(4, 11)))), html: '' };
}
function scPes(t) {
  const k = E.inOut(prog(t, at(L(4, 11)), wordTime(L(4, 11), 'pés') + 0.2));
  const s = encontro(t, { jx: 1340, wx: 940, kneel: k, mood: 'happy', jmood: 'happy', jarm: 30, jarmL: 30 });
  return { svg: cam(s, 1150, FLOOR_Y, 1.1 + 0.1 * E.inOut(prog(t, at(L(4, 11)), at(L(4, 12))))), html: '' };
}
// "Como tinha dito": o túmulo aberto e vazio, e o sol nasce (a promessa se cumpriu).
function scComoTinhaDito(t) {
  const up = E.inOut(prog(t, seg(L(4, 13)), fim(L(4, 13)) + 0.5));
  const s = tumulo(t, { tone: 'sunrise', sunY: lerp(560, 260, up), open: 1, seal: 1, back: jardim(t, {}) });
  const zin = E.inOut(prog(t, at(L(4, 12)), seg(L(4, 13)))), zout = E.inOut(prog(t, seg(L(4, 13)), at(L(5, 0))));
  return { svg: cam(s, 1000, 640, 1.0 + 0.3 * zin - 0.3 * zout), html: '' };
}

// ================================================================ 5. O TÚMULO VAZIO
// Maria Madalena corre até Pedro e o discípulo amado (João 20:1-2).
function casa(t) {
  let s = bgSunrise(t, { sunX: 1600, sunY: 280, seed: 21 }) + city(1500, GROUND + 6, 0.5, t);
  s += rect(300, 260, 900, 540, '#FFFFFF', ink(6)) + rect(1000, 262.5, 197.5, 535, C.g300) + rect(270, 236, 960, 34, C.g300, `rx="8" ${ink(6)}`);
  s += `<path d="M 380 800 L 380 540 C 380 460 540 460 540 540 L 540 800 Z" fill="#3A3330" ${ink(6)}/>` + rect(700, 380, 90, 90, C.g700, `rx="8" ${ink(4)}`) + rect(980, 380, 90, 90, C.g700, `rx="8" ${ink(4)}`);
  s += `<path d="M -400 ${FLOOR_Y + 14} L ${W + 400} ${FLOOR_Y + 4} L ${W + 400} ${H + 40} L -400 ${H + 40} Z" fill="#E6DCCF"/>`;
  return s;
}
function scCasaPedro(t) {
  const tc = wordTime(L(5, 1), 'correu'), run = E.out(prog(t, tc - 0.4, wordTime(L(5, 1), 'pedro') + 0.6)), talk = t > seg(L(5, 2)) - 0.2;
  let s = casa(t);
  const alarm = t > seg(L(5, 2)) + 0.6;
  s += person({ ...PEDRO, x: 840, y: FLOOR_Y - 10, s: 1.3, look: 1, mood: alarm ? 'fear' : 'calm', t, armL: 18, armR: alarm ? 60 : 18 });
  s += person({ ...JOAO, x: 680, y: FLOOR_Y, s: 1.25, look: 1, mood: alarm ? 'fear' : 'calm', t, armL: 18, armR: 18 });
  if (run > 0) s += person({ ...MADALENA, x: lerp(2050, 1080, run), y: FLOOR_Y, s: 1.3, look: -1, mood: 'sad', t, walk: run < 1 ? t * 10 : null, lean: run < 1 ? -6 : 0, armL: talk ? fala(t, seg(L(5, 2)), fim(L(5, 2)), 60, 40) : 30, armR: talk ? fala(t + 0.3, seg(L(5, 2)), fim(L(5, 2)), 60, 40) : 30 });
  const z = 1.0 + 0.1 * E.inOut(prog(t, seg(L(5, 2)) - 0.4, seg(L(5, 2)) + 0.6));
  return { svg: cam(s, 900, FLOOR_Y, z), html: '' };
}
// O túmulo aberto desenhado em qualquer x (para a câmera que anda).
const tumuloEm = (dx, t) => `<g transform="translate(${f1(dx)} 0)">${cave(TB.x, TB.base, TB.s, 'day')}${lacre(1, true, 'day')}${pedra(PEDRA_ABERTA, 90, 'day')}</g>`;
// A corrida: o outro discípulo corre mais rápido e chega primeiro (João 20:3-4).
function scCorrida(t) {
  const tr = wordTime(L(5, 4), 'rápido'), tp = wordTime(L(5, 4), 'primeiro');
  const stop = E.out(prog(t, tp - 0.6, tp + 0.4)), u = t - at(L(5, 3));
  const ox = 300 * (u - 0.5 * stop * Math.max(0, t - (tp - 0.6)));
  const pass = E.inOut(prog(t, tr - 0.6, tr + 0.8));
  let s = caminhoSol(t, ox) + tumuloEm(lerp(1500, 330, E.out(prog(t, tr - 0.4, tp + 0.4))), t);
  const running = stop < 1;
  const jx = lerp(720, 1080, pass), px = lerp(980, 820, pass) - 260 * prog(t, tr + 0.2, tp + 0.6);
  s += person({ ...PEDRO, x: px, y: FLOOR_Y - 4, s: 1.3, look: 1, mood: 'fear', t, walk: t * 10, lean: 7, armL: 30 + 15 * Math.sin(t * 10), armR: 30 });
  s += person({ ...JOAO, x: jx, y: FLOOR_Y, s: 1.25, look: 1, mood: 'fear', t, walk: running ? t * 11 + 1 : null, lean: running ? 7 : 0, armL: 30, armR: 30 + 15 * Math.sin(t * 11) * (running ? 1 : 0) });
  return { svg: cam(s, 960, FLOOR_Y, 1.02), html: '' };
}
// Ele olhou lá dentro e viu as faixas, mas não entrou (João 20:5); Pedro chega e entra (20:6).
function scOlhou(t) {
  let s = tumulo(t, { tone: 'sunrise', open: 1, seal: 1, back: jardim(t, {}) });
  s += person({ ...JOAO, x: 760, y: FLOOR_Y, s: 1.25, look: 1, mood: 'fear', lean: 14 * E.inOut(prog(t, at(L(5, 5)), seg(L(5, 5)) + 0.8)), armL: 20, armR: 40 });
  return { svg: cam(s, 900, FLOOR_Y, 1.25 + 0.06 * prog(t, at(L(5, 5)), at(L(5, 6)))), html: '' };
}
function scPedroEntra(t) {
  const tc = wordTime(L(5, 6), 'chegou'), te = wordTime(L(5, 6), 'entrou');
  const run = E.out(prog(t, at(L(5, 6)), tc + 0.3)), inn = E.inOut(prog(t, te - 0.3, te + 0.8));
  const pedro = opg(1 - prog(inn, 0.7, 1), person({ ...PEDRO, x: lerp(lerp(-150, 640, run), 990, inn), y: lerp(FLOOR_Y, TB.base - 4, inn), s: lerp(1.3, 1.0, inn), look: 1, mood: 'fear', t, walk: (run > 0 && run < 1) || (inn > 0 && inn < 1) ? t * 9 : null, lean: run < 1 ? 7 : 0 }));
  const s = tumulo(t, { tone: 'sunrise', open: 1, seal: 1, back: jardim(t, {}), inside: inn > 0.5 ? pedro : '', front: (inn > 0.5 ? '' : pedro) + person({ ...JOAO, x: 760, y: FLOOR_Y, s: 1.25, look: inn > 0.3 ? 1 : -1, mood: 'fear', t, lean: 6, armL: 20, armR: 30 }) });
  return { svg: cam(s, 900, FLOOR_Y, 1.1), html: '' };
}
// Dentro do túmulo: o banco de pedra, as faixas de linho e o lenço dobrado à parte (João 20:6-7).
const BANCO = { x0: 720, x1: 1860, y: 630 };
function dentro(t, o = {}) {
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#342D29"/>`;
  [[200, 140, 260], [1500, 180, 300], [900, 90, 200]].forEach(([x, y, w]) => (s += `<path d="M ${x - w} ${y} C ${x - w / 2} ${y - 50} ${x + w / 2} ${y - 40} ${x + w} ${y + 10}" stroke="#1A1614" stroke-width="8" fill="none" stroke-linecap="round"/>`));
  s += `<path d="M 110 800 L 110 470 C 110 250 530 250 530 470 L 530 800 Z" fill="#FFE7CF" ${ink(7, NIGHT_OL)}/>` + rect(115, 700, 410, 100, '#E9DCCB');
  s += `<circle cx="330" cy="560" r="700" fill="url(#gPeach)" opacity="0.45"/>`;
  s += `<path d="M 110 800 L 530 800 L 1500 ${H + 20} L -200 ${H + 20} Z" fill="#FFE7CF" opacity="0.12"/>`;
  s += rect(-300, 800, W + 600, 600, '#28221F') + `<line x1="-300" y1="800" x2="${W + 300}" y2="800" stroke="${NIGHT_OL}" stroke-width="6"/>`;
  s += `<ellipse cx="1250" cy="${BANCO.y}" rx="760" ry="260" fill="url(#gPeach)" opacity="0.3"/>`;
  s += rect(BANCO.x0 + 20, BANCO.y, BANCO.x1 - BANCO.x0 - 40, 800 - BANCO.y, '#3A3431', ink(6, NIGHT_OL)) + rect(BANCO.x0, BANCO.y - 20, BANCO.x1 - BANCO.x0, 30, '#4C4542', `rx="10" ${ink(6, NIGHT_OL)}`);
  // as faixas, caídas e vazias
  [[900, -10, 470], [940, 2, 430], [1000, -4, 390]].forEach(([x, dy, w], i) => (s += rect(x, BANCO.y - 40 + dy, w, 22, i % 2 ? '#EDE7DD' : '#F6F2EA', `rx="11" ${ink(4, NIGHT_OL)}`)));
  // o lenço, dobrado e separado
  const lx = 1660, ly = BANCO.y - 20;
  s += `<path d="M ${lx - 70} ${ly} L ${lx + 70} ${ly} L ${lx + 58} ${ly - 40} L ${lx - 58} ${ly - 40} Z" fill="#F6F2EA" ${ink(5, NIGHT_OL)}/><line x1="${lx - 62}" y1="${ly - 20}" x2="${lx + 62}" y2="${ly - 20}" stroke="${C.g400}" stroke-width="5"/>`;
  if (o.lit) s += `<circle cx="${lx}" cy="${ly - 20}" r="${f1(140 + 20 * Math.sin(t * 3))}" fill="url(#gWhite)" opacity="${f1(o.lit * 0.35 * 100) / 100}"/>`;
  return s;
}
function scLenco(t) {
  const pan = E.inOut(prog(t, wordTime(L(5, 7), 'dobrado') - 0.8, wordTime(L(5, 7), 'separado') + 0.2));
  const s = dentro(t, { lit: pan });
  const cx = lerp(1165, 1640, pan);
  return { svg: cam(s, cx, 600, lerp(2.1, 2.4, pan) + 0.05 * prog(t, at(L(5, 7)), at(L(5, 8))), 960 - cx, 0), html: '' };
}
// "Ele viu e creu" (João 20:8).
function scCreu(t) {
  const te = wordTime(L(5, 8), 'entrou'), tc = wordTime(L(5, 8), 'creu');
  const w = E.out(prog(t, te - 0.6, te + 0.6)), c = E.out(prog(t, tc - 0.3, tc + 0.6));
  let s = dentro(t, { lit: 0.6 });
  s += person({ ...PEDRO, x: 1180, y: FLOOR_Y, s: 1.3, look: 1, mood: 'fear', t, rim: C.p300 });
  if (w > 0) s += `<circle cx="${f1(lerp(330, 820, w))}" cy="620" r="${f1(260 + 120 * c)}" fill="url(#gAmber)" opacity="${f1(c * 0.55 * 100) / 100}"/>` + person({ ...JOAO, x: lerp(330, 820, w), y: lerp(800, FLOOR_Y, w), s: lerp(1.0, 1.25, w), look: c > 0.3 ? 0 : 1, mood: c > 0.3 ? 'happy' : 'fear', t, walk: w > 0 && w < 1 ? t * 5 : null, rim: C.p300, op: clamp(w * 3) });
  return { svg: cam(s, 1000, FLOOR_Y, 1.2 + 0.12 * E.inOut(prog(t, tc - 0.6, at(L(5, 9))))), html: '' };
}
// Eles ainda não tinham entendido (João 20:9-10): os dois voltam para casa; Maria fica.
function scNaoEntendido(t) {
  const w = E.inOut(prog(t, at(L(5, 9)) + 0.4, at(L(6, 0)) + 0.6));
  let s = tumulo(t, { tone: 'sunrise', open: 1, seal: 1, back: jardim(t, {}) });
  s += person({ ...JOAO, x: lerp(820, 1520, w), y: FLOOR_Y, s: 1.25, look: Math.sin(t * 1.3) > 0 ? -1 : 1, mood: 'calm', walk: w > 0 && w < 1 ? t * 5 : null });
  s += person({ ...PEDRO, x: lerp(1060, 1760, w), y: FLOOR_Y - 8, s: 1.3, look: -1, mood: 'sad', walk: w > 0 && w < 1 ? t * 5 + 1 : null, armR: 40 + 20 * Math.sin(t * 2), armL: 40 });
  const mp = E.out(prog(t, at(L(6, 0)) - 1.6, at(L(6, 0))));
  if (mp > 0) s += person({ ...MADALENA, x: lerp(-120, 620, mp), y: FLOOR_Y, s: 1.3, look: 1, mood: 'sad', walk: mp < 1 ? t * 5 : null });
  return { svg: cam(s, 1000, FLOOR_Y, 1.02 + 0.03 * prog(t, at(L(5, 9)), at(L(6, 0)))), html: '' };
}

// ================================================================ 6. MARIA E O JARDINEIRO
function scChorando(t) {
  let s = tumulo(t, { tone: 'sunrise', open: 1, seal: 1, back: jardim(t, {}) });
  s += person({ ...MADALENA, x: 720, y: FLOOR_Y, s: 1.35, look: 0.6, mood: 'sad', armL: -16 + 4 * Math.sin(t * 3), armR: -16 + 4 * Math.sin(t * 3 + 1), lean: 4 + 2 * Math.sin(t * 2) }) + lagrimas(720, FLOOR_Y, 1.35, t);
  return { svg: cam(s, 820, FLOOR_Y, 1.35 + 0.08 * prog(t, at(L(6, 0)), at(L(6, 1)))), html: '' };
}
// Os dois anjos de branco, sentados onde o corpo tinha estado, um à cabeceira e outro aos pés (João 20:12-13).
function scDoisAnjos(t) {
  const tm = seg(L(6, 3)), toM = E.inOut(prog(t, tm - 0.5, tm + 0.4));
  let s = dentro(t, { lit: 0 });
  s += anjo({ x: 830, y: BANCO.y - 20 + 45 - 40 * 1.05, s: 1.05, seated: true, look: -1, armL: fala(t, seg(L(6, 2)), fim(L(6, 2)), 30, 50), armR: 20, glow: 0.6 });
  s += anjo({ x: 1720, y: BANCO.y - 20 + 45 - 40 * 1.05, s: 1.05, seated: true, look: -1, armL: 20, armR: 20, glow: 0.6 });
  s += person({ ...MADALENA, x: 360, y: FLOOR_Y, s: 1.3, look: 1, mood: 'sad', rim: C.p300, armL: t > tm ? fala(t, tm, fim(L(6, 3)), 60, 30) : 24, armR: t > tm ? fala(t + 0.4, tm, fim(L(6, 3)), 60, 30) : 24 }) + lagrimas(360, FLOOR_Y, 1.3, t);
  return { svg: cam(s, lerp(1200, 620, toM), FLOOR_Y, lerp(1.0, 1.3, toM) + 0.04 * prog(t, at(L(6, 1)), tm)), html: '' };
}
// Ela se vira e vê Jesus em pé no jardim, e acha que é o jardineiro (João 20:14-15).
function jardimMaria(t, o) {
  let s = tumulo(t, { tone: 'sunrise', open: 1, seal: 1, back: jardim(t, { trees: [[150, GROUND + 140, 1.5], [430, GROUND + 90, 1.1]] }) });
  s += olive(1820, GROUND + 160, 1.6) + flores(1380, 850, 1.1, t, 8) + flores(1690, 860, 1.2, t, 9);
  s += `<circle cx="${o.jx}" cy="540" r="380" fill="url(#gWhite)" opacity="${f1((o.glow ?? 0.4) * 100) / 100}"/>`;
  s += person({ ...VIVO, x: o.jx, y: FLOOR_Y, s: 1.35, look: -1, mood: o.jmood || 'calm', armR: o.jarmR ?? 14, armL: o.jarmL ?? 14, rim: C.a300 });
  s += person({ ...MADALENA, x: o.mx, y: FLOOR_Y, s: 1.3, look: o.mlook ?? 1, flip: o.mflip, mood: o.mmood || 'sad', armL: o.marmL ?? 24, armR: o.marmR ?? 24, kneel: o.kneel }) + (o.tears ? lagrimas(o.mx, FLOOR_Y, 1.3, t, o.tears) : '');
  return s;
}
function scVirou(t) {
  const tv = wordTime(L(6, 4), 'virou'), tj = wordTime(L(6, 5), 'jardineiro');
  const js = E.inOut(prog(t, tv, tv + 0.6)), pan = E.inOut(prog(t, seg(L(6, 5)) - 0.3, tj + 0.3));
  const s = jardimMaria(t, { jx: 1500, mx: 700, mflip: false, mlook: t > tv ? 1 : -0.6, tears: 1, glow: 0.2 + 0.3 * js });
  return { svg: cam(s, lerp(lerp(800, 1100, js), 1420, pan), FLOOR_Y, lerp(1.25, 1.0, js) + 0.4 * pan), html: '' };
}
function scMariaNome(t) {
  const tm = wordTime(L(6, 6), 'maria'), arm = E.back(prog(t, tm - 0.3, tm + 0.1));
  const s = jardimMaria(t, { jx: 1500, mx: 700, jmood: t > tm - 0.3 ? 'happy' : 'calm', jarmL: lerp(14, 80, arm), tears: 1 - prog(t, tm, tm + 0.6), glow: 0.5 });
  return { svg: cam(s, 1420, FLOOR_Y, 1.5 + 0.06 * prog(t, at(L(6, 6)), at(L(6, 7)))), html: '' };
}
function scRaboni(t) {
  const tr = wordTime(L(6, 7), 'rabôni'), g = E.out(prog(t, tr - 0.3, tr + 0.5));
  const s = jardimMaria(t, { jx: 1500, mx: lerp(700, 1180, g), mmood: t > tr - 0.3 ? 'happy' : 'sad', marmL: lerp(24, 140, g), marmR: lerp(24, 140, g), jmood: 'happy', jarmL: 40, glow: 0.55 });
  return { svg: cam(s, lerp(900, 1300, g), FLOOR_Y, 1.3 + 0.06 * prog(t, at(L(6, 7)), at(L(6, 8)))), html: '' };
}
// O recado: "Estou voltando para meu Pai..." (João 20:17). Jesus aponta para a cidade, onde estão os discípulos.
function scRecado(t) {
  const ti = wordTime(L(6, 8), 'irmãos'), tp = wordTime(L(6, 8), 'pai'), pt = E.back(prog(t, ti - 0.3, ti + 0.1)), up = E.inOut(prog(t, tp - 0.4, tp + 0.4));
  let s = jardimMaria(t, { jx: 1500, mx: 1180, mmood: 'happy', marmL: 24, marmR: 24, jmood: 'happy', jarmL: lerp(lerp(14, 95, pt), 160, up), jarmR: 14 + 20 * up, glow: 0.5 });
  s += city(-60, GROUND + 6, 0.55, t);
  const out = E.inOut(prog(t, at(L(6, 8)), fim(L(6, 8))));
  return { svg: cam(s, lerp(1340, 960, out), FLOOR_Y, lerp(1.35, 1.0, out)), html: '' };
}
// Em Mateus e em João, Maria Madalena está entre os primeiros a ver Jesus vivo (Mateus 28:1, 9; João 20:14-18).
function scPrimeiros(t) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const card = (x, name, ref, who, p, hl) => {
    if (p <= 0) return '';
    const w = 560, h = 600, y = 150, edge = hl > 0 ? C.b500 : C.border;
    let g = `<rect x="${x - w / 2}" y="${y + 12}" width="${w}" height="${h}" rx="40" fill="${edge}"/><rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" rx="40" fill="#fff" stroke="${edge}" stroke-width="${hl > 0 ? 6 : 4}"/>`;
    g += label(x, y + 90, name, { size: 54 }) + label(x, y + h - 50, ref, { fam: 'Geist Mono', w: 500, size: 32, fill: C.muted });
    g += `<ellipse cx="${x}" cy="${y + 470}" rx="200" ry="16" fill="${C.g200}"/>`;
    who.forEach(([M, dx]) => (g += person({ ...M, x: x + dx, y: y + 470, s: 0.95, mood: 'happy', noShadow: true })));
    return `<g opacity="${f1(clamp(p) * 100) / 100}" transform="translate(${x} ${y + h / 2}) scale(${f1(p * 1000) / 1000}) translate(${-x} ${-(y + h / 2)})">${g}</g>`;
  };
  const tm = wordTime(L(6, 9), 'mateus'), tj = wordTime(L(6, 9), 'joão'), ta = wordTime(L(6, 9), 'apóstolo');
  const hl = prog(t, wordTime(L(6, 9), 'madalena') - 0.2, wordTime(L(6, 9), 'madalena'));
  s += card(640, 'Mateus', '28:1, 9', [[MADALENA, -70], [OUTRA, 80]], pop(t, tm - 0.15, 0.45), hl) + card(1280, 'João', '20:14-18', [[MADALENA, 0]], pop(t, tj - 0.15, 0.45), hl);
  return { svg: cam(s, 960, 480, 1.0 + 0.04 * prog(t, at(L(6, 9)), ta + 1)), html: '' };
}
// "Eu vi o Senhor!" (João 20:18): ela entra na sala dos discípulos.
function scEuVi(t) {
  const run = E.out(prog(t, at(L(6, 10)) + 0.2, wordTime(L(6, 10), 'anunciou') + 0.3)), tv = wordTime(L(6, 10), 'vi'), joy = E.back(prog(t, tv - 0.3, tv + 0.1));
  let s = sala(t, { open: 1, lampX: 1700 });
  s += `<circle cx="250" cy="560" r="560" fill="url(#gPeach)" opacity="0.4"/>`;
  s += discipulos(t, { mood: t > tv ? 'happy' : 'fear', look: -1, dx: 80, rim: C.p300 });
  s += person({ ...MADALENA, x: lerp(250, 860, run), y: FLOOR_Y, s: 1.35, look: 1, mood: 'happy', walk: run < 1 ? t * 9 : null, armL: lerp(24, 160, joy), armR: lerp(24, 160, joy), rim: C.a300 });
  return { svg: cam(s, 960, FLOOR_Y, 1.02 + 0.06 * prog(t, at(L(6, 10)), at(L(7, 0)))), html: '' };
}


// ================================================================ 7. PAUSA
// Cena calma, igual no YouTube e no TikTok (sem selo nem cartão): alguém lê a Bíblia ao amanhecer.
// Na última frase ("agora vem a história que eles pagaram pra contar") a câmera vai até a cidade.
const LEITOR = { ...man(1401), robe: C.b500, cover: null, beard: true, skin: '#C68B59', hair: '#2F2622' };
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
  let s = bgSunrise(t, { sunX: o.sunX ?? 1420, sunY: o.sunY ?? 430, seed: 31 });
  s += city(1720, GROUND + 4, 0.42, t);
  s += olive(470, GROUND + 250, 2.2) + flores(1150, 860, 1.0, t, 12) + flores(240, 850, 0.9, t, 13);
  s += passaros(t, (Math.floor(t / 14) * 14), 900, 380, 3, C.g700, 0.5);
  const rd = { ...LEITOR, x: 800, y: 764, s: 1.3, armL: 32, armR: 32, mood: o.mood || 'closed', look: o.look ?? 0, rock: C.g500 };
  s += sentado(rd);
  const [, hy] = mao(rd, 1);
  const ph = (t % 7) / 7;
  s += livro(800, hy + 34, 0.72, t, prog(ph, 0.86, 1));
  return s;
}
function scPausa(t) {
  const tg = seg(L(7, N7 - 1)), pan = E.inOut(prog(t, tg - 0.2, fim(L(7, N7 - 1)) + 0.6));
  const s = leitor(t, { mood: 'calm' });
  const cx = lerp(880, 1720, pan);
  return { svg: cam(s, cx, FLOOR_Y, 1.0 + 0.06 * prog(t, at(L(7, 0)), tg) + 0.6 * pan, 960 - cx - 80 * (1 - pan), 0), html: '' };
}

// ================================================================ 8. O DINHEIRO
// Os guardas contam tudo aos chefes dos sacerdotes (Mateus 28:11).
function chefesSalao(t, o = {}) {
  let s = salao(t);
  [[1180, 1501], [1380, 1502], [1580, 1503]].forEach(([x, seed], i) => (s += person({ ...lider(seed), x: x + (o.huddle || 0) * (i - 1) * -60, y: FLOOR_Y - (i % 2) * 12, s: 1.25, look: o.huddle > 0.5 ? (i === 0 ? 1 : -1) : -1, lean: (o.huddle || 0) * (i - 1) * -8, mood: o.mood || 'fear', t, armR: 18, armL: 18 })));
  return s;
}
function scContaram(t) {
  const w = E.out(prog(t, at(L(8, 0)), wordTime(L(8, 0), 'contaram')));
  let s = chefesSalao(t, { mood: t > wordTime(L(8, 0), 'chefes') ? 'fear' : 'calm' });
  [[0, 1511], [1, 1512]].forEach(([i, seed]) => (s += person({ ...soldado(seed), x: lerp(-200 - i * 180, 760 - i * 200, w), y: FLOOR_Y - i * 10, s: 1.25, look: 1, mood: 'fear', t, walk: w < 1 ? t * 8 + i : null, armR: w > 0.9 ? 90 + 50 * Math.sin(t * 7 + i) : 26, armL: w > 0.9 ? 60 + 40 * Math.sin(t * 6 + i * 2) : 20, gear: { helmet: 'rom', armor: true } })));
  return { svg: cam(s, 1000, FLOOR_Y, 1.0 + 0.05 * prog(t, at(L(8, 0)), at(L(8, 1)))), html: '' };
}
// Eles se reuniram e deram uma grande soma de dinheiro (Mateus 28:12).
function scSoma(t) {
  const tc = wordTime(L(8, 1), 'deram') - 0.2;
  const A = (u) => cam(chefesSalao(u, { huddle: E.inOut(prog(u, wordTime(L(8, 1), 'reuniram') - 0.3, wordTime(L(8, 1), 'reuniram') + 0.4)), mood: 'angry' }), 1380, FLOOR_Y, 1.3);
  const B = (u) => cam(entrega(u, wordTime(L(8, 1), 'dinheiro')) + moedas(u, 960, 520, wordTime(L(8, 1), 'dinheiro') + 0.3, 8, 1.4), 960, FLOOR_Y, 1.06);
  return { svg: xcut(t, tc, A, B), html: '' };
}
// "E mandaram os guardas dizerem:" (Mateus 28:13).
function scMandaram(t) {
  const tp = wordTime(L(8, 2), 'mandaram'), pt = E.back(prog(t, tp - 0.3, tp + 0.1));
  let s = salao(t);
  s += person({ ...soldado(1222), x: 760, y: FLOOR_Y, s: 1.35, look: 1, mood: 'fear', t, armR: 30, armL: 14, gear: { helmet: 'rom', armor: true }, shake: 1.5 });
  s += person({ ...lider(1221), x: 1180, y: FLOOR_Y, s: 1.35, look: -1, mood: 'angry', armL: lerp(20, 100, pt), armR: 14 });
  return { svg: cam(s, 970, FLOOR_Y, 1.35 + 0.05 * prog(t, at(L(8, 2)), at(L(8, 3)))), html: '' };
}
// A história comprada: "vieram de noite e furtaram o corpo, enquanto estávamos dormindo" (Mateus 28:13).
function scDormindo(t) {
  return { svg: cam(roubo(t, { asleep: true, seal: 1, p: prog(t, at(L(8, 3)), at(L(8, 4)) + 1) * 0.7 }), 960, FLOOR_Y, 1.0 + 0.06 * prog(t, at(L(8, 3)), at(L(8, 4)))), html: '' };
}
function scLembra(t) {
  return { svg: cam(roubo(t, { p: 0.35 + 0.2 * prog(t, at(L(8, 4)), at(L(8, 5))) }), 900, 640, 1.12 - 0.04 * prog(t, at(L(8, 4)), at(L(8, 5)))), html: '' };
}
// A versão paga se espalha (Mateus 28:15).
function rua(t, ox = 0) {
  return bgDay(t, { ox, sunX: 1600, sunY: 200 }) + city(560 - ox * 0.4, GROUND + 10, 1.3, t) + city(1500 - ox * 0.4, GROUND + 10, 1.0, t);
}
function scPagaram(t) {
  let s = rua(t);
  const g = { ...soldado(1222), x: 820, y: FLOOR_Y, s: 1.3, look: 1, mood: 'happy', armR: fala(t, seg(L(8, 5)), fim(L(8, 5)), 30, 70), armL: 20, gear: { helmet: 'rom', armor: true } };
  s += person(g);
  const [hx, hy] = mao(g, -1);
  s += bolsa(hx, hy + 44, 0.7, 8);
  [[1100, 1521], [1260, 1522], [1420, 1523]].forEach(([x, seed], i) => (s += person({ ...man(seed), x, y: FLOOR_Y - (i % 2) * 14, s: 1.2, look: -1, mood: i === 1 ? 'fear' : 'calm', t, lean: -4 })));
  return { svg: cam(s, 1080, FLOOR_Y, 1.05 + 0.06 * prog(t, at(L(8, 5)), at(L(8, 6)))), html: '' };
}
function scEspalhou(t) {
  const u = prog(t, at(L(8, 6)), at(L(9, 0))), ox = u * 500;
  let s = rua(t, ox);
  const P = [[200, 1531], [340, 1532], [700, 1533], [840, 1534], [1200, 1535], [1340, 1536], [1700, 1537], [1840, 1538], [2200, 1539], [2340, 1540]];
  P.forEach(([x, seed], i) => {
    const turn = t > at(L(8, 6)) + 0.4 + Math.floor(i / 2) * 0.9, k = i % 2;
    s += person({ ...man(seed), x: x - ox, y: FLOOR_Y - (k ? 8 : 0), s: 1.15, look: k ? -1 : 1, mood: turn && k ? 'fear' : 'calm', t, lean: turn ? (k ? -8 : 8) : 0, armR: !k && turn ? 120 + 10 * Math.sin(t * 6 + i) : 18, armL: 18 });
  });
  return { svg: cam(s, 960, FLOOR_Y, 1.04), html: '' };
}

// ================================================================ 9. EMAÚS E TOMÉ
// A estrada de Emaús (Lucas 24:13-16).
function estradaEmaus(t, ox) {
  let s = bgDay(t, { ox, sunX: 1450, sunY: 260, seed: 41 }) + city(260 - ox * 0.35, GROUND + 6, 0.55, t);
  s += [[200, 1.3], [900, 1.0], [1600, 1.4], [2300, 1.1]].map(([x, sc]) => olive(((x - ox * 0.9) % 2800 + 2800) % 2800 - 300, GROUND + 130, sc)).join('');
  s += `<path d="M -400 ${FLOOR_Y + 14} C 600 ${FLOOR_Y - 26} 1400 ${FLOOR_Y - 26} ${W + 400} ${FLOOR_Y + 4} L ${W + 400} ${H + 40} L -400 ${H + 40} Z" fill="#E6DCCF" stroke="${C.ink}" stroke-width="5"/>`;
  return s;
}
const EMAUS = [{ ...man(1601), robe: C.p400, beard: true, cover: C.g100 }, { ...man(1602), robe: C.g500, beard: true, cover: null }];
function scEmaus(t) {
  const ox = (t - at(L(9, 0))) * 80;
  let s = estradaEmaus(t, ox);
  EMAUS.forEach((M, i) => (s += person({ ...M, x: 860 + i * 220, y: FLOOR_Y - i * 6, s: 1.3, look: i ? -1 : 1, mood: t > seg(L(9, 1)) ? 'sad' : 'calm', walk: t * 5 + i, armR: i ? 20 : fala(t, seg(L(9, 1)), fim(L(9, 1)), 20, 60), armL: i ? fala(t + 0.6, seg(L(9, 1)), fim(L(9, 1)), 20, 50) : 20 })));
  return { svg: cam(s, 960, FLOOR_Y, 1.06 + 0.06 * prog(t, at(L(9, 0)), at(L(9, 2)))), html: '' };
}
function scComEles(t) {
  const ox = (t - at(L(9, 0))) * 80, j = E.out(prog(t, wordTime(L(9, 2), 'aproximou') - 0.6, wordTime(L(9, 2), 'caminhar')));
  let s = estradaEmaus(t, ox);
  s += person({ ...JESUS, x: lerp(-150, 620, j), y: FLOOR_Y - 4, s: 1.3, look: 1, mood: 'calm', walk: t * (j < 1 ? 8 : 5) + 3 });
  EMAUS.forEach((M, i) => (s += person({ ...M, x: 860 + i * 220, y: FLOOR_Y - i * 6, s: 1.3, look: t > wordTime(L(9, 2), 'olhos') ? (i ? -1 : -1) : i ? -1 : 1, mood: 'sad', walk: t * 5 + i })));
  return { svg: cam(s, lerp(1000, 900, j), FLOOR_Y, 1.04), html: '' };
}
// A mesa: ele parte o pão e os olhos deles se abrem (Lucas 24:30-31). Depois some (24:31-32).
function mesa(t, o = {}) {
  let s = salao(t, { night: true, lamp: [1620, 360] });
  const pj = o.jop ?? 1;
  EMAUS.forEach((M, i) => (s += person({ ...M, x: i ? 1290 : 630, y: FLOOR_Y - 40, s: 1.25, look: o.look ? o.look[i] : i ? -1 : 1, mood: o.mood || 'calm', t, armL: o.arms ? o.arms[i] : 30, armR: o.arms ? o.arms[i] : 30, rim: C.p400 })));
  if (o.glowC) s += `<circle cx="960" cy="560" r="${f1(380 + 60 * Math.sin(t * 3))}" fill="url(#gAmber)" opacity="${f1(o.glowC * 0.6 * 100) / 100}"/>`;
  const J = { ...JESUS, x: 960, y: FLOOR_Y - 50, s: 1.3, mood: 'calm', armL: o.jarm ?? 40, armR: o.jarm ?? 40, rim: C.a300 };
  if (pj > 0) s += opg(pj, `<circle cx="960" cy="560" r="300" fill="url(#gWhite)" opacity="${f1((o.jglow || 0) * 100) / 100}"/>` + person(J));
  s += rect(380, 740, 1160, 40, C.wood, `rx="10" ${ink(6, NIGHT_OL)}`) + rect(420, 780, 1080, 120, '#4A3526', ink(6, NIGHT_OL));
  const br = o.br || 0, [lx, ly] = mao(J, -1), [rx] = mao(J, 1);
  const bx0 = lerp(960, pj > 0 ? lx : 900, br), bx1 = lerp(960, pj > 0 ? rx : 1020, br), by = pj > 0 ? lerp(736, ly, br * (o.hold ?? 1)) : 736;
  s += `<path d="M ${f1(bx0 - 48)} ${f1(by)} C ${f1(bx0 - 48)} ${f1(by - 40)} ${f1(bx0 + (br > 0.05 ? 0 : 48))} ${f1(by - 40)} ${f1(bx0 + (br > 0.05 ? 0 : 48))} ${f1(by)} Z" fill="${C.p400}" ${ink(5, NIGHT_OL)}/>`;
  if (br > 0.05) s += `<path d="M ${f1(bx1)} ${f1(by)} C ${f1(bx1)} ${f1(by - 40)} ${f1(bx1 + 48)} ${f1(by - 40)} ${f1(bx1 + 48)} ${f1(by)} Z" fill="${C.p400}" ${ink(5, NIGHT_OL)}/>`;
  s += `<path d="M 720 740 L 750 690 L 790 690 L 820 740 Z" fill="${C.p500}" ${ink(5, NIGHT_OL)}/><path d="M 1120 740 L 1140 700 L 1180 700 L 1200 740 Z" fill="${C.g600}" ${ink(5, NIGHT_OL)}/>`;
  return s;
}
function scPao(t) {
  const tp = wordTime(L(9, 3), 'partiu'), ta = wordTime(L(9, 3), 'abriram');
  const br = E.inOut(prog(t, tp - 0.2, tp + 0.5)), op = t > ta - 0.2;
  const s = mesa(t, { br, jarm: lerp(40, 62, br), mood: op ? 'fear' : 'calm', look: [1, -1], jglow: op ? 0.5 : 0 });
  return { svg: cam(s, 960, FLOOR_Y, 1.2 + 0.08 * E.inOut(prog(t, at(L(9, 3)), ta + 0.4))), html: '' };
}
function scSumiu(t) {
  const td = wordTime(L(9, 4), 'desapareceu'), gone = E.inOut(prog(t, td - 0.2, td + 0.8));
  const te = wordTime(L(9, 5), 'ardendo'), burn = E.out(prog(t, te - 0.4, te + 0.6));
  const s = mesa(t, { br: 1, jop: 1 - gone, jglow: 0.5 * (1 - gone), hold: 1 - gone, mood: t > seg(L(9, 5)) ? 'happy' : 'fear', look: t > seg(L(9, 5)) ? [1, -1] : [1, -1], arms: t > seg(L(9, 5)) ? [-14, -14] : [30, 30], glowC: burn });
  return { svg: cam(s, 960, FLOOR_Y, 1.28 - 0.1 * prog(t, at(L(9, 4)), at(L(9, 6)))), html: '' };
}
// Portas trancadas, com medo; Jesus no meio deles (João 20:19-20).
function scTrancados(t) {
  let s = sala(t, { locked: true }) + discipulos(t, { mood: 'fear', shake: 1.2, look: -0.4 });
  return { svg: cam(s, 900, FLOOR_Y, 1.0 + 0.1 * E.inOut(prog(t, at(L(9, 6)), at(L(9, 7))))), html: '' };
}
function salaJesus(t, o) {
  let s = sala(t, { locked: true });
  if (o.j > 0) s += `<circle cx="${o.jx ?? 960}" cy="560" r="${f1(300 + 160 * o.j)}" fill="url(#gWhite)" opacity="${f1(o.j * 0.55 * 100) / 100}"/>`;
  s += discipulos(t, { mood: o.mood, look: o.look ?? 0.4, dx: 70, rim: o.j > 0 ? '#FFFFFF' : C.p400, shake: o.shake || 0, arms: o.arms });
  if (o.tome) s += person({ ...TOME, x: 1560, y: FLOOR_Y, s: 1.25, look: -1, mood: o.tmood || 'calm', t, kneel: o.tkneel, armL: o.tarm ?? 18, armR: o.tarm ?? 18, rim: o.j > 0 ? '#FFFFFF' : C.p400 });
  if (o.j > 0) s += person({ ...VIVO, x: o.jx ?? 960, y: FLOOR_Y, s: 1.35, look: o.jlook ?? 0, mood: 'happy', armL: o.jarmL ?? 20, armR: o.jarmR ?? 20, rim: C.a300, op: clamp(o.j * 1.5) });
  return s;
}
function scPaz(t) {
  const tin = wordTime(L(9, 7), 'entrou'), tz = wordTime(L(9, 7), 'paz'), tm = wordTime(L(9, 8), 'mostrou'), tl = wordTime(L(9, 8), 'alegraram');
  const j = E.out(prog(t, tin - 0.3, tin + 0.8)), open = E.back(prog(t, tz - 0.3, tz + 0.2)), show = E.inOut(prog(t, tm - 0.3, tm + 0.4));
  const s = salaJesus(t, { j, mood: t > tl - 0.2 ? 'happy' : 'fear', shake: t < tz ? 1 : 0, look: 0.6, jarmL: lerp(lerp(14, 70, open), 112, show), jarmR: lerp(lerp(14, 70, open), 112, show) });
  return { svg: cam(s, 960, FLOOR_Y, 1.0 + 0.12 * E.inOut(prog(t, tm - 0.4, tm + 0.6)) - 0.08 * E.inOut(prog(t, tl - 0.3, tl + 0.6))), html: '' };
}
// Tomé não estava lá (João 20:24-25).
function scTomeFora(t) {
  const w = prog(t, at(L(9, 9)), at(L(9, 10)) + 0.3);
  let s = bgNight(t, { moonX: 1580, moonY: 200 }) + cidadeSil(900, GROUND + 10, 1.9, '#15181C');
  s += person({ ...TOME, x: lerp(600, 1000, w), y: FLOOR_Y, s: 1.4, look: 1, mood: 'sad', walk: t * 5, rim: '#5A606A' });
  return { svg: cam(s, 900, FLOOR_Y, 1.08), html: '' };
}
function scSeEuNaoVir(t) {
  const tn = wordTime(L(9, 10), 'crerei'), shake = t > wordTime(L(9, 10), 'disse') ? Math.sin(t * 7) : 0;
  let s = sala(t, { lampX: 1700 }) + discipulos(t, { mood: 'happy', look: 1, dx: 0, arms: (i) => ({ armR: fala(t + i, seg(L(9, 10)) - 1, wordTime(L(9, 10), 'disse'), 30, 70) }) });
  s += person({ ...TOME, x: 1560, y: FLOOR_Y, s: 1.3, look: shake > 0 ? -1 : -0.2, mood: t > tn - 0.6 ? 'angry' : 'calm', armL: 18, armR: 18 });
  return { svg: cam(s, 1100, FLOOR_Y, 1.0 + 0.12 * E.inOut(prog(t, wordTime(L(9, 10), 'disse'), fim(L(9, 10))))), html: '' };
}
// Uma semana depois: "Coloque o seu dedo aqui; veja as minhas mãos" e "Senhor meu e Deus meu!" (João 20:26-28).
function scSemana(t) {
  const ta = wordTime(L(9, 11), 'apareceu'), tc = seg(L(9, 12)), j = E.out(prog(t, ta - 0.3, ta + 0.8)), reach = E.inOut(prog(t, tc - 0.2, tc + 0.6));
  const s = salaJesus(t, { j, jx: lerp(960, 1200, reach), jlook: reach > 0.3 ? 1 : 0, mood: 'happy', look: 0.6, tome: true, tmood: j > 0.5 ? 'fear' : 'calm', jarmR: lerp(20, 82, reach), jarmL: lerp(20, 30, reach) });
  const pan = E.inOut(prog(t, tc - 0.4, tc + 0.8));
  return { svg: cam(s, lerp(960, 1360, pan), FLOOR_Y, 1.0 + 0.3 * pan), html: '' };
}
function scSenhorMeu(t, o = {}) {
  const tk = wordTime(L(9, 13), 'senhor'), k = t > tk - 0.3 || o.kneel;
  const s = salaJesus(t, { j: 1, jx: 1200, jlook: 1, mood: 'happy', look: 0.6, tome: true, tmood: 'happy', tkneel: k, tarm: k ? 150 : 18, jarmR: 40, jarmL: 20 });
  return { svg: cam(s, 1360, FLOOR_Y, 1.3 + 0.06 * prog(t, at(L(9, 13)), at(L(10, 0)))), html: '' };
}

// ================================================================ 10. FECHAMENTO
// A lista de Paulo (1 Coríntios 15:5-7): Pedro, os Doze, mais de quinhentos de uma vez, Tiago e todos os apóstolos.
function pauloEscreve(t, t0) {
  let s = salao(t, { lamp: [1560, 380] });
  const P = { ...PAULO, x: 860, y: 700, s: 1.35, armL: 30, armR: 52 + 6 * Math.sin(t * 9), mood: 'calm', look: 0.4 };
  s += sentado({ ...P, rock: C.g500 });
  s += rect(560, 720, 800, 34, C.wood, `rx="10" ${ink(6)}`) + rect(600, 754, 720, 120, '#7A5A40', ink(6));
  const n = Math.floor(prog(t, t0, t0 + 5) * 6);
  s += rect(700, 690, 520, 36, '#EFE3CC', `rx="6" ${ink(5)}`);
  for (let k = 0; k < 6; k++) if (k < n) s += `<line x1="${730 + k * 80}" y1="708" x2="${790 + k * 80}" y2="708" stroke="#8C7A62" stroke-width="6" stroke-linecap="round"/>`;
  const [hx, hy] = mao(P, 1);
  s += `<line x1="${f1(hx)}" y1="${f1(hy)}" x2="${f1(hx + 40)}" y2="${f1(hy - 70)}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`;
  return s;
}
function testemunhas(t) {
  let s = bgDay(t, { sunX: 1600, sunY: 210, seed: 51 }) + hill(960, 470, 1400, '#E3DBD2');
  const tp = wordTime(L(10, 0), 'pedro'), td = wordTime(L(10, 0), 'doze'), tq = wordTime(L(10, 1), 'quinhentos'), tt = wordTime(L(10, 2), 'tiago'), ta = wordTime(L(10, 2), 'apóstolos');
  const r = rng(77);
  // mais de quinhentos de uma vez: a multidão enche o morro (sem número na tela)
  for (let row = 0; row < 5; row++) for (let c = 0; c < 26; c++) {
    const x = 60 + c * 72 + (row % 2) * 36, y = 600 + row * 58, p = pop(t, tq - 0.2 + r() * 1.4, 0.4);
    if (p > 0 && Math.abs(x - 960) > 140 - row * 10) s += person({ ...man(1700 + row * 30 + c), x, y, s: 0.36 * p, noShadow: true, mood: 'happy' });
  }
  const pd = pop(t, tp - 0.15, 0.45);
  if (pd > 0) s += person({ ...PEDRO, x: 960, y: 520, s: 0.75 * pd, mood: 'happy' });
  for (let i = 0; i < 12; i++) { const p = pop(t, td - 0.15 + i * 0.05, 0.4); if (p > 0) s += person({ ...man(1650 + i), x: 960 + (i - 5.5) * 66, y: 600, s: 0.42 * p, mood: 'happy', noShadow: true }); }
  const tg = pop(t, tt - 0.15, 0.45);
  if (tg > 0) s += person({ ...man(1690), robe: C.b600, beard: true, cover: null, x: 1680, y: 860, s: 0.8 * tg, mood: 'happy', look: -1 });
  for (let i = 0; i < 6; i++) { const p = pop(t, ta - 0.15 + i * 0.06, 0.4); if (p > 0) s += person({ ...man(1680 + i), x: 1450 + i * 80 - (i > 2 ? 240 : 0), y: i > 2 ? 870 : 820, s: 0.55 * p, mood: 'happy', look: -1 }); }
  return s;
}
function scPaulo(t) {
  const tc = wordTime(L(10, 0), 'jesus') - 0.2;
  const A = (u) => cam(pauloEscreve(u, at(L(10, 0))), 900, FLOOR_Y, 1.25 + 0.05 * prog(u, at(L(10, 0)), tc));
  const B = (u) => cam(testemunhas(u), 960, lerp(560, 640, E.inOut(prog(u, wordTime(L(10, 1), 'quinhentos') - 0.4, wordTime(L(10, 1), 'quinhentos') + 1))), lerp(1.7, 1.0, E.inOut(prog(u, wordTime(L(10, 0), 'doze') - 0.3, wordTime(L(10, 1), 'quinhentos') + 1))));
  return { svg: xcut(t, tc, A, B), html: '' };
}
// Os guardas pagos para contar outra história; os discípulos, que estavam trancados, saem para contar essa (Atos 4:20).
function scOutraHistoria(t) {
  let s = bgNight(t, { moonX: 1580, moonY: 200 }) + cidadeSil(900, GROUND + 10, 1.9, '#15181C');
  [[760, 1222], [1100, 1211]].forEach(([x, seed], i) => (s += person({ ...soldado(seed), x, y: FLOOR_Y, s: 1.35, look: i ? -1 : 1, mood: 'calm', armL: i ? 20 : 50, armR: i ? 50 : 20, rim: '#5A606A', gear: { helmet: 'rom', armor: true } })));
  s += bolsa(930, 730, 0.9, Math.sin(t * 3) * 4) + moedas(t, 930, 640, Math.floor((t - at(L(10, 3))) / 1.2) * 1.2 + at(L(10, 3)), 3, 0.6);
  return { svg: cam(s, 930, FLOOR_Y, 1.1 + 0.06 * prog(t, at(L(10, 3)), at(L(10, 4)))), html: '' };
}
function scSairam(t) {
  const op = E.inOut(prog(t, at(L(10, 4)) + 0.2, wordTime(L(10, 4), 'saíram'))), go = E.inOut(prog(t, wordTime(L(10, 4), 'saíram') - 0.3, at(L(10, 5)) + 0.6));
  let s = sala(t, { open: op, lampX: 1700 });
  s += `<circle cx="250" cy="560" r="${f1(200 + 500 * op)}" fill="url(#gPeach)" opacity="${f1(op * 0.5 * 100) / 100}"/>`;
  DISC.forEach(([x, seed], i) => {
    const M = [PEDRO, JOAO, { ...man(1243), beard: true, cover: null }, { ...man(1244), beard: true, cover: null }][i];
    const xx = lerp(x, 250 - i * 10, prog(go, i * 0.12, 0.55 + i * 0.12)), gone = prog(go, 0.45 + i * 0.12, 0.6 + i * 0.12);
    s += opg(1 - gone, person({ ...M, x: xx, y: FLOOR_Y - (i % 2) * 14, s: 1.25, look: -1, mood: op > 0.5 ? 'happy' : 'fear', walk: go > 0 && go < 1 ? t * 6 + i : null, rim: C.a300 }));
  });
  return { svg: cam(s, 820, FLOOR_Y, 1.04), html: '' };
}
// "Tomé precisou ver." / "Felizes os que não viram e creram" (João 20:29).
function scTomeViu(t) {
  const s = salaJesus(t, { j: 1, jx: 1200, jlook: 1, mood: 'happy', look: 0.6, tome: true, tmood: 'happy', tkneel: true, tarm: 150, jarmR: 82, jarmL: 20 });
  return { svg: cam(s, 1380, FLOOR_Y, 1.5 - 0.06 * prog(t, at(L(10, 5)), at(L(10, 6)))), html: '' };
}
function scFrase(t) {
  const tf = wordTime(L(10, 7), 'felizes'), l = E.out(prog(t, tf - 0.4, tf + 0.8));
  let s = bgSunrise(t, { sunX: 960, sunY: 360, seed: 61 }) + `<circle cx="960" cy="420" r="${f1(500 + 200 * l)}" fill="url(#gWhite)" opacity="${f1((0.3 + 0.4 * l) * 100) / 100}"/>`;
  s += olive(300, GROUND + 230, 2.0) + olive(1640, GROUND + 230, 1.8);
  s += person({ ...VIVO, x: 960, y: FLOOR_Y, s: 1.45, mood: 'happy', armL: fala(t, seg(L(10, 6)), fim(L(10, 7)), 20, 30), armR: 20 + 70 * l, rim: C.a300 });
  return { svg: cam(s, 960, FLOOR_Y, 1.25 + 0.1 * prog(t, at(L(10, 6)), at(L(10, 8)))), html: '' };
}
// "Você também não viu." O leitor da pausa volta: quem assiste.
function scVoce(t) {
  const tq = wordTime(L(10, 9), 'crê'), z = E.inOut(prog(t, seg(L(10, 9)) - 0.3, tq + 0.6));
  const s = leitor(t, { sunY: lerp(430, 330, prog(t, at(L(10, 8)), fim(L(10, 10)))), look: 0 });
  return { svg: cam(s, lerp(860, 820, z), FLOOR_Y, 1.0 + 0.05 * prog(t, at(L(10, 8)), seg(L(10, 9))) + 0.35 * z), html: '' };
}
// Só no YouTube: "A parte um... já tá publicada aqui." As três cruzes do longo 1.
function golgotaWide(t) {
  let s = city(370, 622, 0.5, t) + hill(960, 560, 1150, '#D6CCC1');
  s += crossFig(690, 592, 0.5, { fill: SIL, bow: 0.35 }) + crossFig(1230, 592, 0.5, { fill: SIL, bow: 0.35 }) + crossFig(960, 572, 0.64, { fill: SIL, plaque: true, bow: 0 });
  return s;
}
function scParteUm(t) {
  return { svg: cam(bgGloom(t, { seed: 801 }) + `<g opacity="0.9">${sun(1500, 200, 60, t)}</g>` + golgotaWide(t), 960, 430, 1.0 + 0.06 * E.sine(prog(t, at(L(10, 11)), seg(L(10, 12))))), html: '' };
}
const scFim = (t) => endCard(t, seg(L(10, 12)) - 0.3, ['Mateus 28', 'Lucas 24', 'João 20']);

// ================================================================ linha do tempo
const SCENES = [
  { a: 0, b: at(L(1, 1)), f: scTremor, ref: 'Mateus 28:1-4', dark: true },
  { a: at(L(1, 1)), b: at(L(1, 2)), f: scAnjoDesce, ref: null, dark: true },
  { a: at(L(1, 2)), b: at(L(1, 3)), f: scGuardasCaem, ref: null, dark: true },
  { a: at(L(1, 3)), b: at(L(1, 4)), f: scParaCidade, ref: 'Mateus 28:11-12' },
  { a: at(L(1, 4)), b: at(L(1, 5)), f: scBolsa, ref: null },
  { a: at(L(1, 5)), b: at(L(1, 6)), f: scInimigos, ref: 'Mateus 27:62-63', dark: true },
  { a: at(L(1, 6)), b: at(L(1, 7)), f: scNaoEntenderam, ref: 'Lucas 18:33-34', dark: true },
  { a: at(L(1, 7)), b: at(L(1, 8)), f: scPagos, ref: null, dark: true },
  { a: at(L(1, 8)), b: at(L(2, 0)), f: scQuemViu, ref: null },
  // 2. sexta à tarde
  { a: at(L(2, 0)), b: at(L(2, 1)), f: scSexta, ref: null, dark: true },
  { a: at(L(2, 1)), b: at(L(2, 2)), f: scSabado, ref: 'João 19:31-34', dark: true },
  { a: at(L(2, 2)), b: at(L(2, 3)), f: scPernas, ref: null, dark: true },
  { a: at(L(2, 3)), b: at(L(2, 4)), f: scJaMorto, ref: null, dark: true },
  { a: at(L(2, 4)), b: at(L(2, 5)), f: scLanca, ref: null, dark: true },
  { a: at(L(2, 5)), b: at(L(2, 6)), f: scHomem, ref: null, dark: true },
  { a: at(L(2, 6)), b: at(L(2, 7)), f: scSinedrio, ref: 'Marcos 15:43' },
  { a: at(L(2, 7)), b: at(L(2, 8)), f: scSegredo, ref: 'João 19:38', dark: true },
  { a: at(L(2, 8)), b: at(L(2, 9)), f: scPilatosJose, ref: 'Marcos 15:43' },
  { a: at(L(2, 9)), b: at(L(2, 10)), f: scNicodemos, ref: 'João 19:39-40', dark: true },
  { a: at(L(2, 10)), b: at(L(2, 11)), f: scLinho, ref: null, dark: true },
  { a: at(L(2, 11)), b: at(L(2, 12)), f: scJardim, ref: 'João 19:41; Marcos 15:46', dark: true },
  { a: at(L(2, 12)), b: at(L(2, 13)), f: scPedraRola, ref: 'Mateus 27:60', dark: true },
  { a: at(L(2, 13)), b: at(L(3, 0)), f: scMarias, ref: 'Mateus 27:61', dark: true },
  // 3. os guardas
  { a: at(L(3, 0)), b: at(L(3, 2)), f: scChefesPilatos, ref: 'Mateus 27:62-64', dark: (t) => t > wordTime(L(3, 1), 'venham') - 0.2 },
  { a: at(L(3, 2)), b: at(L(3, 3)), f: scEngano, ref: null },
  { a: at(L(3, 3)), b: at(L(3, 4)), f: scDestacamento, ref: 'Mateus 27:65-66' },
  { a: at(L(3, 4)), b: at(L(3, 5)), f: scLacre, ref: null },
  { a: at(L(3, 5)), b: at(L(3, 6)), f: scEvitar, ref: null, dark: true },
  { a: at(L(3, 6)), b: at(L(4, 0)), f: scVaiVoltar, ref: null, dark: true },
  // 4. domingo de manhã
  { a: at(L(4, 0)), b: at(L(4, 1)), f: scPassou, ref: null, dark: true },
  { a: at(L(4, 1)), b: at(L(4, 2)), f: scMulheres, ref: 'Mateus 28:1', dark: true },
  { a: at(L(4, 2)), b: at(L(4, 3)), f: scTerremoto, ref: 'Mateus 28:2-4', dark: true },
  { a: at(L(4, 3)), b: at(L(4, 4)), f: scAnjo2, ref: null, dark: true },
  { a: at(L(4, 4)), b: at(L(4, 5)), f: scRelampago, ref: null, dark: true },
  { a: at(L(4, 5)), b: at(L(4, 6)), f: scComoMortos, ref: null, dark: true },
  { a: at(L(4, 6)), b: at(L(4, 9)), f: scNaoTenham, ref: 'Mateus 28:5-6', dark: true },
  { a: at(L(4, 9)), b: at(L(4, 10)), f: scCorrem, ref: 'Mateus 28:8-9' },
  { a: at(L(4, 10)), b: at(L(4, 11)), f: scSalve, ref: null },
  { a: at(L(4, 11)), b: at(L(4, 12)), f: scPes, ref: null },
  { a: at(L(4, 12)), b: at(L(5, 0)), f: scComoTinhaDito, ref: null },
  // 5. o túmulo vazio
  { a: at(L(5, 0)), b: at(L(5, 3)), f: scCasaPedro, ref: 'João 20:1-2' },
  { a: at(L(5, 3)), b: at(L(5, 5)), f: scCorrida, ref: 'João 20:3-8' },
  { a: at(L(5, 5)), b: at(L(5, 6)), f: scOlhou, ref: null },
  { a: at(L(5, 6)), b: at(L(5, 7)), f: scPedroEntra, ref: null },
  { a: at(L(5, 7)), b: at(L(5, 8)), f: scLenco, ref: null, dark: true },
  { a: at(L(5, 8)), b: at(L(5, 9)), f: scCreu, ref: null, dark: true },
  { a: at(L(5, 9)), b: at(L(6, 0)), f: scNaoEntendido, ref: 'João 20:9' },
  // 6. Maria e o jardineiro
  { a: at(L(6, 0)), b: at(L(6, 1)), f: scChorando, ref: 'João 20:11-13' },
  { a: at(L(6, 1)), b: at(L(6, 4)), f: scDoisAnjos, ref: null, dark: true },
  { a: at(L(6, 4)), b: at(L(6, 6)), f: scVirou, ref: 'João 20:14-16' },
  { a: at(L(6, 6)), b: at(L(6, 7)), f: scMariaNome, ref: null },
  { a: at(L(6, 7)), b: at(L(6, 8)), f: scRaboni, ref: null },
  { a: at(L(6, 8)), b: at(L(6, 9)), f: scRecado, ref: 'João 20:17' },
  { a: at(L(6, 9)), b: at(L(6, 10)), f: scPrimeiros, ref: null },
  { a: at(L(6, 10)), b: at(L(7, 0)), f: scEuVi, ref: 'João 20:18', dark: true },
  // 7. pausa (mesma cena nas duas variantes)
  { a: at(L(7, 0)), b: at(L(8, 0)), f: scPausa, ref: null },
  // 8. o dinheiro
  { a: at(L(8, 0)), b: at(L(8, 1)), f: scContaram, ref: 'Mateus 28:11-15' },
  { a: at(L(8, 1)), b: at(L(8, 2)), f: scSoma, ref: null },
  { a: at(L(8, 2)), b: at(L(8, 3)), f: scMandaram, ref: null },
  { a: at(L(8, 3)), b: at(L(8, 4)), f: scDormindo, ref: null, dark: true },
  { a: at(L(8, 4)), b: at(L(8, 5)), f: scLembra, ref: null, dark: true },
  { a: at(L(8, 5)), b: at(L(8, 6)), f: scPagaram, ref: null },
  { a: at(L(8, 6)), b: at(L(9, 0)), f: scEspalhou, ref: null },
  // 9. Emaús e Tomé
  { a: at(L(9, 0)), b: at(L(9, 2)), f: scEmaus, ref: 'Lucas 24:13-16' },
  { a: at(L(9, 2)), b: at(L(9, 3)), f: scComEles, ref: null },
  { a: at(L(9, 3)), b: at(L(9, 4)), f: scPao, ref: 'Lucas 24:30-32', dark: true },
  { a: at(L(9, 4)), b: at(L(9, 6)), f: scSumiu, ref: null, dark: true },
  { a: at(L(9, 6)), b: at(L(9, 7)), f: scTrancados, ref: 'João 20:19-20', dark: true },
  { a: at(L(9, 7)), b: at(L(9, 9)), f: scPaz, ref: null, dark: true },
  { a: at(L(9, 9)), b: at(L(9, 10)), f: scTomeFora, ref: 'João 20:24-25', dark: true },
  { a: at(L(9, 10)), b: at(L(9, 11)), f: scSeEuNaoVir, ref: null, dark: true },
  { a: at(L(9, 11)), b: at(L(9, 13)), f: scSemana, ref: 'João 20:26-28', dark: true },
  { a: at(L(9, 13)), b: at(L(10, 0)), f: scSenhorMeu, ref: null, dark: true },
  // 10. fechamento
  { a: at(L(10, 0)), b: at(L(10, 3)), f: scPaulo, ref: '1 Coríntios 15:5-7' },
  { a: at(L(10, 3)), b: at(L(10, 4)), f: scOutraHistoria, ref: null, dark: true },
  { a: at(L(10, 4)), b: at(L(10, 5)), f: scSairam, ref: 'Atos 4:20', dark: true },
  { a: at(L(10, 5)), b: at(L(10, 6)), f: scTomeViu, ref: null, dark: true },
  { a: at(L(10, 6)), b: at(L(10, 8)), f: scFrase, ref: 'João 20:29' },
  // No TikTok o vídeo termina em "Me conta aqui embaixo." (L(10, 10)): a última cena segura até o fim.
  { a: at(L(10, 8)), b: TIKTOK ? DURATION + 1 : at(L(10, 11)), f: scVoce, ref: null },
  ...(TIKTOK ? [] : [
    { a: at(L(10, 11)), b: seg(L(10, 12)) - 0.3, f: scParteUm, ref: null },
    { a: seg(L(10, 12)) - 0.3, b: DURATION + 1, f: scFim, ref: null, end: true },
  ]),
];
