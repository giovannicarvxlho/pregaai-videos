// Por que o filho mais velho não quis entrar? (Lucas 15:1-32). Curto vertical escrito do zero, ~2:28.
// As cenas começam pelo índice da frase em SEGS (at(i)) e os gestos por wordTime(i, 'palavra').
// Notas de produção do roteiro: as duas primeiras histórias são perguntas de Jesus (a cena abre com ele falando
// e corta para a história); os porcos ficam de longe, sem close; o pai correndo é o momento do vídeo; no fim,
// o mais velho fica do lado de fora, com a porta aberta, e o vídeo não mostra se ele entra.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];
const wt = (i, w) => wordTime(i, w);
// Hora de uma palavra direto do SEGS (para a linha do tempo, que é montada antes da legenda existir).
function wseg(i, w) {
  const tk = SEGS[i][2].replace(/[|!*]/g, ' ').split(/\s+/).filter(Boolean);
  const k = tk.findIndex((x) => x.replace(/[^\p{L}]/gu, '').toLowerCase() === w);
  return k >= 0 && SEGS[i][4] ? SEGS[i][4][k] : SEGS[i][0];
}

const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const PAI = { robe: '#7B6A55', skin: '#C68B59', hair: '#E9E3DC', beard: true };
const NOVO = { robe: C.p400, skin: '#E0AC69', hair: '#3A2A20', beard: false };
const TRAPO = { ...NOVO, robe: '#8E8172' }; // depois de gastar tudo
const FESTA = { ...NOVO, robe: '#F6EBCB' }; // "a melhor roupa" (Lucas 15:22)
const VELHO = { robe: C.oliveDk, skin: '#C68B59', hair: '#2F2622', beard: true };
const PASTOR = { robe: '#C9BBAE', skin: '#A86B3C', hair: '#191919', beard: true, cover: null };
const MULHER = { robe: C.r400, skin: '#C68B59', hair: '#3A2A20', beard: false, cover: '#E2D8CF' };
const ANJO = { robe: '#FFFFFF', skin: '#E0AC69', hair: '#F2D9A0', rim: C.a300, mood: 'calm' };
const mulher = (seed, extra = {}) => ({ ...man(seed), beard: false, cover: ['#E2D8CF', C.g300, '#C9BBAE', C.g100][seed % 4], ...extra });
const FARISEUS = [lider(41, { robe: '#5B3F7A' }), lider(42, { robe: '#3F4A6B' })];
const CRUZA = { armL: -38, armR: -38 }; // braços cruzados na frente do peito

// ---------------------------------------------------------------- peças do episódio
// Céu, morros e chão do campo. o.sky troca o céu (skyDay, skySunrise, skyDusk, skyNight); o.seco é o campo da fome.
function campo(t, o = {}) {
  const sky = o.sky || 'skyDay', noite = sky === 'skyNight' || sky === 'skyDusk', sd = o.seed || 15, ox = o.ox || 0;
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#${sky})"/>`;
  if (sky === 'skyNight') s += stars(t, 60, sd, GROUND - 80, 0.9) + (o.lua === false ? '' : moon(o.luaX ?? 820, 420, 42, '#14181D'));
  else if (sky === 'skyDay') s += clouds(t, ox);
  else if (sky === 'skySunrise' && o.sol !== false) s += sun(o.solX ?? 820, o.solY ?? 520, 58, t);
  const [h1, h2, ch, tufo] = noite ? ['#2E2B26', '#26231F', '#1F1C19', '#15130F']
    : o.seco ? ['#DCC8A0', '#CDB38A', '#D9C29A', '#B39A72'] : ['#CFC9A6', '#B9B79C', '#C9C4A2', C.oliveDk];
  s += hills(GROUND - 140, 80, 0.003, sd, h1, ox * 0.3) + hills(GROUND - 60, 50, 0.005, sd + 2, h2, ox * 0.6);
  if (o.morro) { const [mx, mt, mw, mf] = o.morro; s += `<path d="M ${mx - mw} ${GROUND + 6} C ${f1(mx - mw * 0.55)} ${mt + 30} ${f1(mx - mw * 0.3)} ${mt} ${mx} ${mt} C ${f1(mx + mw * 0.3)} ${mt} ${f1(mx + mw * 0.55)} ${mt + 30} ${mx + mw} ${GROUND + 6} Z" fill="${mf}" ${ink(6)}/>`; }
  s += `<rect x="-400" y="${GROUND}" width="${W + 800}" height="${H}" fill="${ch}"/>`;
  const r = rng(sd * 7 + 3);
  for (let i = 0; i < 18; i++) {
    const d = r(), y = GROUND + 80 + d * 560, x = r() * (W + 200) - 100;
    s += `<path d="M ${f1(x - 10)} ${f1(y)} q 4 ${f1(-14 - d * 10)} 0 ${f1(-24 - d * 14)} M ${f1(x)} ${f1(y)} q 2 ${f1(-18 - d * 12)} 6 ${f1(-30 - d * 16)} M ${f1(x + 10)} ${f1(y)} q 0 ${f1(-12 - d * 8)} 8 ${f1(-20 - d * 10)}" stroke="${tufo}" stroke-width="${f1(3 + d * 2)}" fill="none" stroke-linecap="round" opacity="0.6"/>`;
  }
  return s;
}

// Casa do pai, com o pé em (x, base). o.luz (0..1) acende a porta e as janelas (a festa); o.noite escurece a parede.
function casa(x, base, s, t, o = {}) {
  const luz = o.luz || 0, noite = !!o.noite;
  const parede = noite ? '#4A3E36' : '#FFFFFF', lado = noite ? '#3A302A' : C.g300, ol = noite ? '#120E0C' : C.ink, vao = noite ? '#1A1512' : C.g700;
  let g = '';
  if (luz > 0) g += `<circle cx="${f1(x)}" cy="${f1(base - 160 * s)}" r="${f1(560 * s)}" fill="url(#gAmber)" opacity="${f1(luz * 0.6 * 100) / 100}"/>`;
  g += rect(x - 260 * s, base - 300 * s, 520 * s, 300 * s, parede, ink(6, ol)) + rect(x + 120 * s, base - 297 * s, 137 * s, 294 * s, lado);
  g += rect(x - 280 * s, base - 320 * s, 560 * s, 30 * s, lado, `rx="${f1(8 * s)}" ${ink(5, ol)}`);
  const porta = (fill) => `<path d="M ${f1(x - 60 * s)} ${f1(base)} L ${f1(x - 60 * s)} ${f1(base - 150 * s)} C ${f1(x - 60 * s)} ${f1(base - 200 * s)} ${f1(x + 60 * s)} ${f1(base - 200 * s)} ${f1(x + 60 * s)} ${f1(base - 150 * s)} L ${f1(x + 60 * s)} ${f1(base)} Z" fill="${fill}" ${ink(5, ol)}/>`;
  const janelas = (fill) => [-200, 150].map((dx) => rect(x + dx * s, base - 240 * s, 60 * s, 70 * s, fill, `rx="${f1(8 * s)}" ${ink(4, ol)}`)).join('');
  g += porta(vao) + janelas(vao);
  if (luz > 0) g += opg(luz, porta('#FFE3A3') + janelas(C.a300));
  return g;
}

// Notas de música saindo da casa (a festa): sobem e somem.
function notas(x, y, t, op = 1, n = 5) {
  if (op <= 0) return '';
  let g = '';
  for (let i = 0; i < n; i++) {
    const p = (t * 0.35 + i / n) % 1, nx = x + Math.sin(p * 6 + i * 2) * 50 + (i - n / 2) * 34, ny = y - p * 330;
    const a = Math.sin(p * Math.PI) * op;
    if (a <= 0.02) continue;
    g += `<g opacity="${f1(a * 100) / 100}" transform="translate(${f1(nx)} ${f1(ny)}) scale(${1 + (i % 2) * 0.25})"><ellipse cx="0" cy="0" rx="14" ry="10" fill="${C.a300}" ${ink(3)} transform="rotate(-20)"/><line x1="12" y1="-4" x2="12" y2="-48" stroke="${C.a300}" stroke-width="6" stroke-linecap="round"/><path d="M 12 -48 q 20 6 18 24" stroke="${C.a300}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
  }
  return g;
}

// Moeda (o.brilho põe a luz em volta).
function moeda(x, y, s = 1, brilhoOp = 0) {
  let g = '';
  if (brilhoOp > 0) g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(80 * s)}" fill="url(#gAmber)" opacity="${f1(brilhoOp * 100) / 100}"/>`;
  g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(22 * s)}" fill="${C.a400}" ${ink(4)}/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(13 * s)}" fill="none" stroke="${C.a600}" stroke-width="${f1(3 * s)}"/>`;
  return g;
}

// Estrela de brilho (achou, anel, roupa nova).
function brilho(x, y, s, op) {
  if (op <= 0) return '';
  const p = (dx, dy) => `${f1(x + dx * s)} ${f1(y + dy * s)}`;
  return opg(op, `<path d="M ${p(0, -40)} L ${p(9, -9)} L ${p(40, 0)} L ${p(9, 9)} L ${p(0, 40)} L ${p(-9, 9)} L ${p(-40, 0)} L ${p(-9, -9)} Z" fill="#FFFFFF" ${ink(3)}/>`);
}

// Porco de lado, com o pé em (x, base). Sempre de longe.
function porco(x, base, s, t = 0, look = 1) {
  const b = Math.sin(t * 3 + x * 0.01) * 3;
  return `<g transform="translate(${f1(x)} ${f1(base)}) scale(${f1(look * s * 100) / 100} ${s})">
    ${[-36, -16, 16, 36].map((lx) => `<rect x="${lx - 6}" y="-30" width="12" height="30" rx="5" fill="#D98E99" ${ink(3)}/>`).join('')}
    <ellipse cx="0" cy="-50" rx="62" ry="36" fill="${C.r300}" ${ink(4)}/>
    <circle cx="58" cy="${f1(-52 + b)}" r="26" fill="${C.r300}" ${ink(4)}/>
    <ellipse cx="82" cy="${f1(-46 + b)}" rx="10" ry="12" fill="#D98E99" ${ink(3)}/>
    <path d="M 46 ${f1(-74 + b)} l 8 -18 l 10 16 Z" fill="#D98E99" ${ink(3)}/>
    <path d="M -62 -56 q -16 -6 -10 -20" stroke="${C.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>`;
}

// Bolsa de moedas (a parte da herança).
function bolsa(x, y, s = 1) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M -34 0 C -48 -40 -26 -66 -12 -70 L 12 -70 C 26 -66 48 -40 34 0 C 30 16 -30 16 -34 0 Z" fill="${C.p500}" ${ink(4)}/><path d="M -16 -70 Q 0 -60 16 -70" stroke="${C.ink}" stroke-width="4" fill="none"/><circle cx="0" cy="-30" r="10" fill="${C.a400}" ${ink(3)}/></g>`;
}

// Moedas voando da bolsa (gastou tudo), a partir de t0.
function moedasVoando(x, y, t, t0, n = 7) {
  let g = '';
  for (let i = 0; i < n; i++) {
    const p = prog(t, t0 + i * 0.12, t0 + i * 0.12 + 0.9);
    if (p <= 0 || p >= 1) continue;
    const dx = (i % 2 ? 1 : -1) * (50 + i * 22);
    g += opg(1 - p * p, moeda(x + dx * p, y - Math.sin(p * Math.PI) * (150 + i * 10) + p * 120, 0.8));
  }
  return g;
}

// Vassoura com o cabo em (x, y), inclinada ang graus.
function vassoura(x, y, ang, s = 1) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)}) scale(${s})"><line x1="0" y1="0" x2="0" y2="200" stroke="${C.ink}" stroke-width="15" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="200" stroke="${C.wood}" stroke-width="7" stroke-linecap="round"/><path d="M -32 252 L -12 196 L 12 196 L 32 252 Z" fill="${C.a400}" ${ink(4)}/></g>`;
}

// Candeia de barro sobre a mesa (Lucas 15:8). acesa (0..1) põe a chama e a luz.
function candeia(x, y, s, t, acesa) {
  let g = '';
  if (acesa > 0) g += `<circle cx="${f1(x + 40 * s)}" cy="${f1(y - 60 * s)}" r="${f1(420 * s)}" fill="url(#gAmber)" opacity="${f1(acesa * 0.9 * 100) / 100}"/>`;
  g += `<path d="M ${f1(x - 70 * s)} ${f1(y)} C ${f1(x - 74 * s)} ${f1(y - 40 * s)} ${f1(x + 46 * s)} ${f1(y - 44 * s)} ${f1(x + 72 * s)} ${f1(y - 24 * s)} L ${f1(x + 108 * s)} ${f1(y - 30 * s)} C ${f1(x + 116 * s)} ${f1(y - 20 * s)} ${f1(x + 108 * s)} ${f1(y - 8 * s)} ${f1(x + 70 * s)} ${f1(y - 2 * s)} C ${f1(x + 50 * s)} ${f1(y + 16 * s)} ${f1(x - 60 * s)} ${f1(y + 20 * s)} ${f1(x - 70 * s)} ${f1(y)} Z" fill="${C.p400}" ${ink(5)}/>`;
  g += `<ellipse cx="${f1(x - 8 * s)}" cy="${f1(y - 26 * s)}" rx="${f1(20 * s)}" ry="${f1(6 * s)}" fill="${C.p600}" ${ink(3)}/>`;
  if (acesa > 0) {
    const h = (56 + 6 * Math.sin(t * 9) + 4 * Math.sin(t * 17)) * s * acesa, fx = x + 104 * s, fy = y - 30 * s;
    g += flame(fx, fy, 16 * s, h, C.r400) + flame(fx, fy, 11 * s, h * 0.75, C.p300) + flame(fx, fy, 6 * s, h * 0.45, C.a300);
  }
  return g;
}

// Mesa baixa com pão e jarro (Jesus comendo com eles, Lucas 15:2).
function mesaBaixa(x, y, s = 1) {
  return rect(x - 230 * s, y - 34 * s, 460 * s, 34 * s, C.wood, `rx="${f1(8 * s)}" ${ink(5)}`) + rect(x - 200 * s, y, 400 * s, 40 * s, '#4A3526', ink(5)) +
    paes(x - 80 * s, y - 34 * s, 0.8 * s, 2) + jar(x + 110 * s, y - 34 * s, 0.6 * s);
}

// Rebanho em fileiras (as noventa e nove), com a primeira fileira em y0.
function rebanho(x0, y0, cols, rows, s, t) {
  let g = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const k = r * cols + c, x = x0 + c * 74 * s + (r % 2) * 37 * s, y = y0 + r * 40 * s;
    g += sheep(x, y, s * 0.5, t + k, k % 3 ? 1 : -1);
  }
  return g;
}

// Pastor com a ovelha nos ombros (Lucas 15:5): a ovelha vai atrás da cabeça e as mãos seguram as patas.
function pastorOvelha(x, y, s, t, o = {}) {
  const k = 1.5 * s;
  return sheep(x, y - 98 * s, k, t, o.flip ? -1 : 1) + person({ ...PASTOR, x, y, s, walk: o.walk, look: o.look ?? 0, mood: 'happy', armL: 100, armR: 100, flip: o.flip });
}

// Sandálias no chão, junto dos pés (Lucas 15:22).
function sandalias(x, y, s, op) {
  if (op <= 0) return '';
  return opg(op, [-1, 1].map((d) => `<ellipse cx="${f1(x + d * 15 * s)}" cy="${f1(y - 2 * s)}" rx="${f1(18 * s)}" ry="${f1(7 * s)}" fill="${C.wood}" ${ink(3)}/>`).join(''));
}

// Anel no dedo, com brilho.
function anel(x, y, s, op) {
  if (op <= 0) return '';
  return opg(op, `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(9 * s)}" fill="none" stroke="${C.a300}" stroke-width="${f1(5 * s)}"/>`) + brilho(x + 18 * s, y - 18 * s, 0.6 * s, op * 0.8);
}

// Casa por dentro, à noite (a mulher e a moeda). luz (0..1) é a candeia acesa.
function interior(t, luz) {
  let s = `<rect x="-200" width="${W + 400}" height="${H}" fill="#3B2F28"/>`;
  s += opg(luz, `<rect x="-200" width="${W + 400}" height="${H}" fill="#E9DCCB"/>`);
  s += rect(140, 640, 170, 190, '#5A4A3E', `rx="14" ${ink(6)}`) + rect(160, 660, 130, 150, '#22324A', `rx="8" ${ink(4)}`) + `<path d="M 248 690 a 22 22 0 1 0 14 38 a 17 17 0 1 1 -14 -38 Z" fill="#F4F3F0"/>` + [[190, 700], [210, 770], [270, 780]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#F4F3F0"/>`).join('');
  s += rect(700, 760, 260, 18, C.wood, `rx="5" ${ink(4)}`) + jar(760, 760, 0.55) + jar(850, 760, 0.45, 0);
  s += `<rect x="-200" y="1180" width="${W + 400}" height="${H}" fill="#2A211C"/>` + opg(luz, `<rect x="-200" y="1180" width="${W + 400}" height="${H}" fill="#CDB99F"/>`);
  s += `<line x1="-200" y1="1180" x2="${W + 200}" y2="1180" stroke="${C.ink}" stroke-width="6"/>`;
  return s;
}
// Mesa da casa, com o tampo em y.
function mesaCasa(x, y) {
  return rect(x - 170, y, 340, 26, C.wood, `rx="6" ${ink(5)}`) + rect(x - 150, y + 26, 22, 120, '#4A3526', ink(4)) + rect(x + 128, y + 26, 22, 120, '#4A3526', ink(4));
}

// Cartão redondo com um ícone (as três histórias).
function medalha(x, y, r, t, conteudo, o = {}) {
  const id = `cm${Math.round(x)}${Math.round(y)}`;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${o.fill || C.g200}" ${ink(o.forte ? 8 : 5, o.forte ? C.b500 : C.ink)}/><defs><clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r - 3}"/></clipPath></defs><g clip-path="url(#${id})">${conteudo}</g>`;
}
const iconeOvelha = (x, y, s, t) => sheep(x - 10 * s, y + 50 * s, 0.9 * s, t);
const iconeMoeda = (x, y, s) => moeda(x, y, 2.4 * s);
const iconeFilhos = (x, y, s) => person({ ...NOVO, x: x - 62 * s, y: y + 92 * s, s: 0.5 * s, noShadow: true, mood: 'calm', look: 0.4 }) +
  person({ ...PAI, x, y: y + 96 * s, s: 0.56 * s, noShadow: true, mood: 'calm' }) + person({ ...VELHO, x: x + 62 * s, y: y + 92 * s, s: 0.5 * s, noShadow: true, mood: 'calm', look: -0.4 });

// Escalas na frente de uma pessoa: o pé em (x, y), tamanho s (para os planos que se repetem).
const NOITE = (t) => campo(t, { sky: 'skyNight', seed: 21 });

// A casa da festa à noite, à esquerda, com as notas saindo.
function casaFesta(t, o = {}) {
  let s = NOITE(t);
  s += casa(o.cx ?? 300, o.base ?? 1120, o.s ?? 1.05, t, { luz: o.luz ?? 1, noite: true });
  s += notas((o.cx ?? 300) + 10, (o.base ?? 1120) - 270, t, (o.luz ?? 1) * (o.notas ?? 1), 5);
  return s;
}

// ---------------------------------------------------------------- 0. gancho: a festa e quem ficou de fora
function scGancho(t) {
  // As notas da festa só entram depois que o texto do gancho sai (2,6 a 3,0 s), para não passarem por trás dele.
  let s = casaFesta(t, { notas: prog(t, 3.0, 3.6) });
  s += person({ ...PAI, x: 210, y: 1250, s: 1.2, look: 0.7, mood: 'happy', armR: 72, rim: C.a300 });
  s += person({ ...FESTA, x: 370, y: 1250, s: 1.15, look: -0.6, mood: 'happy', armL: 64, armR: 30, flip: true, rim: C.a300 });
  s += person({ ...VELHO, x: 820, y: 1245, s: 1.22, look: -0.8, mood: 'angry', ...CRUZA, rim: C.p400, flip: true });
  return { svg: cam(s, 540, 1000, 1.0 + 0.05 * E.sine(prog(t, 0, at(1)))), html: '' };
}

// ---------------------------------------------------------------- 1. o outro não quis entrar
function scFora(t) {
  const a0 = at(1), nao = wt(1, 'não');
  let s = casaFesta(t);
  s += person({ ...PAI, x: 210, y: 1250, s: 1.2, look: 0.7, mood: 'happy', armR: 72, rim: C.a300 });
  s += person({ ...FESTA, x: 370, y: 1250, s: 1.15, look: -0.6, mood: 'happy', armL: 64, armR: 30, flip: true, rim: C.a300 });
  const vira = E.out(prog(t, nao - 0.3, nao + 0.4));
  s += person({ ...VELHO, x: 820, y: 1245, s: 1.22, look: lerp(-0.8, 0.4, vira), mood: 'angry', ...CRUZA, rim: C.p400, flip: vira < 0.5 });
  const p = E.inOut(prog(t, a0, fim(1)));
  return { svg: cam(s, lerp(540, 700, p), 1020, lerp(1.05, 1.22, p)), html: '' };
}

// ---------------------------------------------------------------- 2. por que Jesus terminou assim?
function rodaDia(t) {
  let s = campo(t, { sky: 'skyDay', seed: 31 });
  s += olive(130, 1090, 0.95) + olive(980, 1070, 0.8);
  return s;
}
function scPorque(t) {
  const a0 = at(2);
  let s = rodaDia(t);
  s += person({ ...JESUS, x: 400, y: 1250, s: 1.3, look: 0.6, mood: 'calm', armR: fala(t, seg(2), fim(2), 30, 30) });
  s += person({ ...man(511), x: 700, y: 1250, s: 1.1, kneel: true, look: -0.6, mood: 'calm' });
  s += person({ ...man(512), x: 860, y: 1240, s: 1.05, kneel: true, look: -0.7, mood: 'calm' });
  return { svg: cam(s, 560, 1000, 1.06 + 0.05 * prog(t, a0, at(3))), html: '' };
}

// ---------------------------------------------------------------- 3. a última de três
function scTres(t) {
  const a0 = at(3), ult = wt(3, 'última'), contou = wt(3, 'contou');
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const P = [[250, 700], [540, 700], [830, 700]];
  const ic = [(x, y) => iconeOvelha(x, y, 1, t), (x, y) => iconeMoeda(x, y, 1), (x, y) => iconeFilhos(x, y, 1)];
  P.forEach(([x, y], k) => {
    const p = pop(t, a0 + 0.3 + k * 0.45, 0.45);
    if (p <= 0) return;
    const forte = k === 2 && t > ult - 0.15;
    const sc = p * (forte ? 1 + 0.12 * E.out(prog(t, ult - 0.15, ult + 0.3)) : 1);
    s += `<g transform="translate(${x} ${y}) scale(${f1(sc * 100) / 100}) translate(${-x} ${-y})">${medalha(x, y, 122, t, ic[k](x, y), { forte, fill: forte ? C.b300 : C.g200 })}</g>`;
  });
  const jp = E.out(prog(t, contou - 0.3, contou + 0.5));
  s += opg(jp, person({ ...JESUS, x: 380, y: 1230, s: 1.0, look: 0.6, mood: 'calm', armR: fala(t, contou, fim(3), 30, 26) }) +
    person({ ...FARISEUS[0], x: 660, y: 1230, s: 0.95, mood: 'angry', look: -0.6, flip: true, ...CRUZA }) + person({ ...FARISEUS[1], x: 790, y: 1225, s: 0.92, mood: 'angry', look: -0.6, flip: true }));
  return { svg: cam(s, 540, 960, 1.0 + 0.04 * prog(t, a0, at(4))), html: '' };
}

// ---------------------------------------------------------------- 4. publicanos e pecadores se reuniam
function scReuniam(t) {
  const a0 = at(4), pec = wt(4, 'pecadores'), reu = wt(4, 'reuniam');
  let s = rodaDia(t);
  s += person({ ...JESUS, x: 540, y: 1200, s: 1.2, look: 0, mood: 'happy', armL: 30, armR: 30 });
  const chega = (x0, x1, t0) => lerp(x0, x1, E.out(prog(t, t0, t0 + 1.0)));
  const pub = [{ ...man(521), x: chega(-80, 220, a0) }, { ...man(522), x: chega(-160, 340, a0 + 0.3) }];
  const pc = [{ ...mulher(523), x: chega(1160, 760, pec - 0.6) }, { ...man(524), x: chega(1240, 880, pec - 0.3) }];
  const senta = (t0) => t > t0;
  pub.forEach((o, k) => {
    const sit = senta(reu - 0.2 + k * 0.1);
    s += person({ ...o, y: 1255, s: 1.05, kneel: sit, walk: sit ? null : t * 6, look: 0.6, mood: 'calm' });
    if (k === 0) { const [hx, hy] = mao({ ...o, y: 1255, s: 1.05, kneel: sit }, 1); s += bolsa(hx, hy + 30, 0.7); }
  });
  pc.forEach((o, k) => {
    const sit = senta(reu + k * 0.1);
    s += person({ ...o, y: 1255, s: 1.05, kneel: sit, walk: sit ? null : t * 6, look: -0.6, mood: 'calm', flip: true });
  });
  return { svg: cam(s, 540, 1010, 1.04 + 0.04 * prog(t, a0, at(5))), html: '' };
}

// ---------------------------------------------------------------- 5. os fariseus criticavam
function criticam(t, o = {}) {
  let s = rodaDia(t);
  s += person({ ...JESUS, x: 280, y: 1130, s: 0.85, look: 0.3, mood: 'happy', armL: 40, armR: 40 });
  s += person({ ...man(521), x: 140, y: 1135, s: 0.8, look: 0.6, mood: 'happy', armR: 40 }) + person({ ...mulher(523), x: 420, y: 1135, s: 0.8, look: -0.6, mood: 'happy', flip: true, armR: 40 });
  s += mesaBaixa(280, 1165, 0.85);
  const aponta = o.aponta ?? 0;
  s += person({ ...FARISEUS[0], x: 700, y: 1260, s: 1.25, look: -0.7, mood: 'angry', flip: true, armR: lerp(20, 100, aponta), armL: 20 });
  s += person({ ...FARISEUS[1], x: 860, y: 1250, s: 1.2, look: -0.7, mood: 'angry', flip: true, ...CRUZA });
  return s;
}
function scCriticam(t) {
  const a0 = at(5), ap = wt(5, 'este');
  const s = criticam(t, { aponta: E.out(prog(t, ap - 0.3, ap + 0.3)) });
  return { svg: cam(s, 560, 1010, 1.03 + 0.05 * prog(t, a0, at(6))), html: '' };
}

// ---------------------------------------------------------------- 6. cem, dez e dois
function numeros(t, itens) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  itens.forEach(([txt, t0, y, icone]) => {
    const p = pop(t, t0 - 0.15, 0.4);
    if (p <= 0) return;
    s += `<g transform="translate(540 ${y}) scale(${f1(p * 100) / 100}) translate(-540 ${-y})">`;
    if (icone) s += icone(210, y - 6);
    s += `<text x="${icone ? 340 : 540}" y="${y + (icone ? 40 : 70)}" text-anchor="${icone ? 'start' : 'middle'}" font-family="Gasoek One" font-size="${icone ? 108 : 220}" fill="${C.b500}" stroke="${C.ink}" stroke-width="6" paint-order="stroke">${esc(txt)}</text></g>`;
  });
  return s;
}
function scNumeros(t) {
  const a0 = at(6);
  const s = numeros(t, [['100', wt(6, 'cem'), 560], ['10', wt(6, 'dez'), 820], ['2', wt(6, 'dois'), 1080]]);
  return { svg: cam(s, 540, 900, 1.0 + 0.04 * prog(t, a0, at(7))), html: '' };
}

// ---------------------------------------------------------------- 7. a primeira: cem ovelhas, uma perdida
function pastoDia(t) {
  return campo(t, { sky: 'skyDay', seed: 51, morro: [860, 900, 260, '#C3BD98'] });
}
function scOvelhas(t) {
  const a0 = at(7), cem = wt(7, 'cem'), sai = wt(7, 'deixaria'), perd = wt(7, 'perdida');
  const A = (tt) => {
    let s = rodaDia(tt);
    s += person({ ...JESUS, x: 380, y: 1250, s: 1.3, look: 0.6, mood: 'calm', armR: fala(tt, seg(7), cem, 30, 30) });
    s += person({ ...FARISEUS[0], x: 720, y: 1255, s: 1.2, look: -0.6, mood: 'calm', flip: true, ...CRUZA }) + person({ ...FARISEUS[1], x: 870, y: 1250, s: 1.15, look: -0.6, mood: 'calm', flip: true });
    return s;
  };
  const B = (tt) => {
    let s = pastoDia(tt);
    s += opg(E.out(prog(tt, perd - 0.5, perd + 0.3)), sheep(850, 905, 0.55, tt, -1));
    s += rebanho(70, 1085, 8, 4, 1.0, tt);
    const ida = E.inOut(prog(tt, sai - 0.2, fim(7) + 0.4));
    s += person({ ...PASTOR, x: lerp(640, 800, ida), y: lerp(1255, 1150, ida), s: lerp(1.2, 0.85, ida), walk: ida > 0 && ida < 1 ? tt * 6 : null, look: 0.7, mood: 'calm' });
    return s;
  };
  const p = E.inOut(prog(t, cem, fim(7)));
  return { svg: cam(xcut(t, cem - 0.1, A, B), lerp(540, 620, p), 1000, 1.02 + 0.05 * p), html: '' };
}

// ---------------------------------------------------------------- 8. a ovelha nos ombros
function scOmbros(t) {
  const a0 = at(8), chama = wt(8, 'chama');
  let s = pastoDia(t);
  s += casa(220, 1110, 0.8, t);
  const viz = E.out(prog(t, chama - 0.2, chama + 0.5));
  [[150, 541], [290, 542]].forEach(([x, sd], k) => (s += person({ ...man(sd), x, y: 1255, s: 1.1, look: 0.6, mood: viz > 0.4 ? 'happy' : 'calm', armL: lerp(20, 150, viz) + Math.sin(t * 7 + k) * 8 * viz, armR: lerp(20, 150, viz) + Math.sin(t * 7 + k + 1) * 8 * viz })));
  const vem = E.inOut(prog(t, a0, chama + 0.3));
  s += pastorOvelha(lerp(820, 600, vem), 1255, 1.25, t, { walk: vem < 1 ? t * 6 : null, look: -0.6, flip: true });
  return { svg: cam(s, 540, 1000, 1.02 + 0.05 * prog(t, a0, at(9))), html: '' };
}

// ---------------------------------------------------------------- 9. a segunda: dez moedas, uma perdida
const COINS = Array.from({ length: 10 }, (_, k) => [k < 5 ? 660 + k * 48 : 684 + (k - 5) * 48, k < 5 ? 1150 : 1132]);
function scMoedas(t) {
  const a0 = at(9), mul = wt(9, 'mulher'), perde = wt(9, 'perde'), proc = wt(9, 'procura');
  const A = (tt) => {
    let s = rodaDia(tt);
    s += person({ ...JESUS, x: 380, y: 1250, s: 1.3, look: 0.6, mood: 'calm', armR: fala(tt, seg(9), mul, 30, 30) });
    s += person({ ...FARISEUS[0], x: 720, y: 1255, s: 1.2, look: -0.6, mood: 'calm', flip: true, ...CRUZA }) + person({ ...FARISEUS[1], x: 870, y: 1250, s: 1.15, look: -0.6, mood: 'calm', flip: true });
    return s;
  };
  const B = (tt) => {
    let s = interior(tt, 0.35);
    s += person({ ...MULHER, x: 330, y: 1250, s: 1.25, look: tt > proc ? Math.sin(tt * 3) : 0.6, mood: tt > perde ? 'sad' : 'calm' });
    s += mesaCasa(700, 1150);
    [...COINS.keys()].sort((a, b) => COINS[a][1] - COINS[b][1]).forEach((k) => {
      const [x, y] = COINS[k];
      if (k < 9) { s += moeda(x, y - 20, 0.9); return; }
      const p = prog(tt, perde - 0.1, perde + 0.9);
      const cx = lerp(x, 930, p), cy = p < 0.35 ? y - 20 : lerp(y - 20, 1235, E.in(prog(p, 0.35, 0.7)));
      s += opg(1 - prog(p, 0.75, 1), moeda(cx, cy, 0.9));
    });
    return s;
  };
  return { svg: cam(xcut(t, mul - 0.1, A, B), 560, 1010, 1.02 + 0.05 * prog(t, a0, at(10))), html: '' };
}

// ---------------------------------------------------------------- 10. acende a candeia, varre e acha
function scCandeia(t) {
  const a0 = at(10), acende = wt(10, 'acende'), varre = wt(10, 'varre'), proc = wt(10, 'procura'), acha = wt(10, 'acha'), viz = wt(10, 'vizinhas');
  const luz = E.out(prog(t, acende - 0.1, acende + 0.6));
  const A = (tt) => {
    let s = interior(tt, 0.35 + 0.65 * luz);
    s += mesaCasa(700, 1150) + COINS.slice(0, 9).sort((a, b) => a[1] - b[1]).map(([x, y]) => moeda(x, y - 20, 0.9)).join('');
    s += candeia(585, 1150, 1.05, tt, luz);
    const vp = prog(tt, varre - 0.2, proc);
    const mx = lerp(330, 430, vp), sweep = Math.sin(tt * 7) * 14 * (vp > 0 && tt < proc ? 1 : 0);
    const ajoelha = tt > proc - 0.1;
    const M = { ...MULHER, x: ajoelha ? 760 : mx, y: 1250, s: 1.25, kneel: ajoelha, look: ajoelha ? 0.8 : 0.4, mood: 'calm', armR: ajoelha ? 40 : 50, armL: ajoelha ? 30 : 20, flip: false };
    if (tt > varre - 0.2 && !ajoelha) { const [hx, hy] = mao(M, 1); s += vassoura(hx, hy - 20, -20 + sweep, 1.1); }
    s += person(M);
    s += moeda(900, 1235, 0.9, ajoelha ? 0.4 + 0.3 * Math.sin(tt * 8) : 0);
    return s;
  };
  const B = (tt) => {
    let s = interior(tt, 1) + mesaCasa(700, 1150) + COINS.slice(0, 9).sort((a, b) => a[1] - b[1]).map(([x, y]) => moeda(x, y - 20, 0.9)).join('') + candeia(585, 1150, 1.05, tt, 1);
    const M = { ...MULHER, x: 380, y: 1250, s: 1.25, look: 0.5, mood: 'happy', armR: 150, armL: 20 };
    s += person(M);
    const [hx, hy] = mao(M, 1);
    s += moeda(hx, hy - 26, 1.1, 0.6) + brilho(hx + 34, hy - 60, 0.8, 0.6 + 0.4 * Math.abs(Math.sin(tt * 5)));
    const vp = E.out(prog(tt, viz - 0.6, viz + 0.4));
    [[mulher(551), 0], [mulher(552), 1]].forEach(([o, k]) => (s += person({ ...o, x: lerp(1180, 720 + k * 150, vp), y: 1250, s: 1.15, walk: vp < 1 ? tt * 6 + k : null, look: -0.6, mood: 'happy', flip: true, armL: lerp(20, 140, vp), armR: lerp(20, 140, vp) })));
    return s;
  };
  return { svg: cam(xcut(t, acha - 0.1, A, B), 560, 1010, 1.02 + 0.04 * prog(t, a0, at(11))), html: '' };
}

// ---------------------------------------------------------------- 11. alegria no céu, diante dos anjos, por um pecador que se arrepende
function scAlegria(t) {
  const a0 = at(11), seg2 = wt(11, 'segunda'), anj = wt(11, 'anjos'), pec = wt(11, 'pecador');
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skyDay)"/>` + clouds(t, 0) + clouds(t, 300);
  const g1 = E.out(prog(t, a0 + 0.3, a0 + 1.5));
  s += `<circle cx="540" cy="520" r="${f1(380 + 30 * Math.sin(t * 2))}" fill="url(#gAmber)" opacity="${f1(g1 * 0.8 * 100) / 100}"/>` + `<circle cx="540" cy="520" r="200" fill="url(#gWhite)" opacity="${f1(g1 * 0.9 * 100) / 100}"/>`;
  const ap = E.out(prog(t, anj - 0.5, anj + 0.6));
  [[230, 860], [850, 860], [380, 640], [700, 640]].forEach(([x, y], k) => (s += opg(ap * (k < 2 ? 1 : 0.8), person({ ...ANJO, x, y: y + Math.sin(t * 2 + k) * 10, s: k < 2 ? 0.7 : 0.55, armL: 60, armR: 60, noShadow: true, flip: x > 540 }))));
  s += `<rect x="-400" y="${GROUND + 60}" width="${W + 800}" height="${H}" fill="#C9C4A2"/>` + hills(GROUND + 60, 30, 0.004, 61, '#B9B79C');
  const pp = E.out(prog(t, pec - 0.4, pec + 0.5));
  s += beam(540, 560, 540, 1250, 120, 300, 0.6 * pp);
  s += opg(pp, person({ ...man(561), x: 540, y: 1255, s: 1.15, kneel: true, look: 0, mood: 'closed', armL: 24, armR: 24 }));
  const p = E.inOut(prog(t, a0, fim(11)));
  return { svg: cam(s, 540, lerp(820, 1000, p), lerp(1.1, 1.0, p)), html: '' };
}

// ---------------------------------------------------------------- 12. "Um homem tinha dois filhos"
const DIA_CASA = (t) => campo(t, { sky: 'skyDay', seed: 71 }) + casa(540, 1110, 0.95, t);
function scDoisFilhos(t) {
  const a0 = at(12), hom = wt(12, 'homem'), dois = wt(12, 'dois');
  let s = DIA_CASA(t);
  s += opg(E.out(prog(t, hom - 0.3, hom + 0.2)), person({ ...PAI, x: 540, y: 1260, s: 1.3, look: 0, mood: 'calm', armL: 40, armR: 40 }));
  const fp = E.out(prog(t, dois - 0.2, dois + 0.4));
  s += opg(fp, person({ ...NOVO, x: lerp(420, 300, fp), y: 1255, s: 1.15, look: 0.5, mood: 'calm' }) + person({ ...VELHO, x: lerp(660, 780, fp), y: 1255, s: 1.2, look: -0.5, mood: 'calm', flip: true }));
  return { svg: cam(s, 540, 1000, 1.03 + 0.05 * prog(t, a0, at(13))), html: '' };
}

// ---------------------------------------------------------------- 13. pediu a herança, foi pra longe e gastou tudo
function scHeranca(t) {
  const a0 = at(13), her = wt(13, 'herança'), lon = wt(13, 'longe'), gas = wt(13, 'gastou');
  const A = (tt) => {
    let s = DIA_CASA(tt);
    s += person({ ...PAI, x: 380, y: 1260, s: 1.28, look: 0.5, mood: 'sad', armR: lerp(20, 70, E.out(prog(tt, a0, her))) });
    const N = { ...NOVO, x: 690, y: 1255, s: 1.2, look: -0.5, mood: 'calm', flip: true, armR: fala(tt, seg(13), her, 40, 30) };
    s += person(N);
    const pb = E.inOut(prog(tt, her - 0.2, her + 0.6));
    const [px, py] = mao({ ...PAI, x: 380, y: 1260, s: 1.28, armR: 70 }, 1), [nx, ny] = mao({ ...N, armL: 40 }, -1);
    s += bolsa(lerp(px, nx, pb), lerp(py, ny, pb) + 34, 0.9);
    return s;
  };
  const B = (tt) => {
    let s = campo(tt, { sky: 'skyDusk', seed: 73 });
    s += city(560, 1090, 0.9, tt);
    const N = { ...NOVO, x: lerp(300, 620, prog(tt, lon - 0.2, fim(13) + 0.4)), y: 1255, s: 1.2, walk: tt * 6, look: 0.4, mood: 'happy', armR: 40 };
    s += person(N);
    const [hx, hy] = mao(N, 1);
    s += bolsa(hx, hy + 30, 0.8) + moedasVoando(hx, hy, tt, gas - 0.1, 8);
    return s;
  };
  return { svg: cam(xcut(t, lon - 0.1, A, B), 540, 1010, 1.03 + 0.04 * prog(t, a0, at(14))), html: '' };
}

// ---------------------------------------------------------------- 14. a fome e os porcos
function campoSeco(t) {
  return campo(t, { sky: 'skySunrise', seco: true, seed: 81, solX: 860, solY: 470 });
}
function scPorcos(t) {
  const a0 = at(14), por = wt(14, 'porcos'), nin = wt(14, 'ninguém');
  let s = campoSeco(t);
  s += rect(640, 1108, 260, 26, C.wood, `rx="6" ${ink(4)}`);
  [[620, 1150, 1], [700, 1120, -1], [830, 1125, 1], [910, 1160, -1]].forEach(([x, y, l], k) => (s += porco(x, y, 0.42, t + k, l)));
  const triste = t > por;
  s += person({ ...TRAPO, x: 290, y: 1255, s: 1.25, kneel: true, look: t > nin ? 0 : 0.7, mood: triste ? 'sad' : 'calm', armL: 30, armR: 30 });
  return { svg: cam(s, lerp(560, 480, E.inOut(prog(t, a0, at(15)))), 1010, 1.02 + 0.08 * E.inOut(prog(t, a0, at(15)))), html: '' };
}

// ---------------------------------------------------------------- 15. resolveu voltar: "Pai, pequei"
function scVoltar(t) {
  const a0 = at(15), pai = wt(15, 'pai');
  let s = campo(t, { sky: 'skySunrise', seed: 83, solX: 220, solY: 560 });
  const lev = E.out(prog(t, a0 + 0.2, a0 + 1.0));
  const anda = prog(t, a0 + 1.0, fim(15) + 0.4);
  const N = { ...TRAPO, x: lerp(660, 420, anda), y: 1255, s: 1.25, kneel: lev < 0.5, walk: anda > 0 ? t * 5 : null, look: -0.4, mood: 'sad', flip: true, armR: fala(t, pai, fim(15), 30, 24) };
  s += person(N);
  return { svg: cam(s, lerp(600, 480, anda), 1010, 1.04), html: '' };
}

// ---------------------------------------------------------------- 16. o pai viu de longe e correu
// Corrida: o pai sai da frente da casa e o filho vem de longe; os dois se encontram no meio e se abraçam.
function corrida(t, t0, t1, o = {}) {
  const p = E.inOut(prog(t, t0, t1));
  let s = campo(t, { sky: 'skySunrise', seed: 85, solX: 860, solY: 520 });
  s += casa(170, 1090, 0.7, t);
  const fx = lerp(280, 600, p), fy = lerp(1255, 1170, p), fs = lerp(1.25, 1.0, p);
  const nx = lerp(o.nx0 ?? 870, 720, p), ny = lerp(o.ny0 ?? 1085, 1170, p), ns = lerp(o.ns0 ?? 0.48, 1.0, p);
  const abraco = p >= 1;
  s += person({ ...TRAPO, x: nx, y: ny, s: ns, walk: abraco ? null : t * 4, look: -0.5, mood: abraco ? 'closed' : 'sad', flip: true, armL: abraco ? 70 : 14, armR: abraco ? 70 : 14 });
  s += person({ ...PAI, x: fx, y: fy, s: fs, walk: p > 0 && !abraco ? t * 12 : null, lean: p > 0 && !abraco ? 10 : 0, look: 0.8, mood: abraco ? 'closed' : o.mood || 'calm', armL: p > 0 ? (abraco ? 110 : 70) : 20, armR: p > 0 ? (abraco ? 110 : 70) : 20 });
  if (o.antes) s += o.antes;
  return s;
}
function scCorreu(t) {
  const a0 = at(16), viu = wt(16, 'viu'), comp = wt(16, 'compaixão');
  const t0 = comp - 0.2, t1 = fim(16) + 0.2;
  const longe = prog(t, a0, t0);
  const s = corrida(t, t0, t1, { nx0: lerp(900, 870, longe) });
  const p = E.inOut(prog(t, a0, t1));
  return { svg: cam(s, lerp(560, 650, p), lerp(1010, 980, p), lerp(1.0, 1.12, p)), html: '' };
}

// ---------------------------------------------------------------- 17. a melhor roupa, o anel, os calçados e a festa
function scRoupa(t) {
  const a0 = at(17), rou = wt(17, 'roupa'), ane = wt(17, 'anel'), cal = wt(17, 'calçados'), fes = wt(17, 'festa');
  const lf = E.out(prog(t, fes - 0.2, fes + 0.6));
  let s = campo(t, { sky: 'skyDusk', seed: 87 }) + casa(300, 1110, 0.95, t, { luz: lf, noite: true }) + notas(310, 860, t, lf, 5);
  s += person({ ...PAI, x: 330, y: 1255, s: 1.25, look: 0.6, mood: 'happy', armR: 60, rim: C.a300 });
  const novo = t > rou - 0.1;
  const N = { ...(novo ? FESTA : TRAPO), x: 640, y: 1255, s: 1.25, look: -0.4, mood: novo ? 'happy' : 'closed', flip: true, armL: 30, armR: 40, rim: C.a300 };
  s += person(N);
  s += brilho(640, 1040, 1.2, t > rou - 0.1 ? 1 - prog(t, rou, rou + 0.6) : 0);
  const [hx, hy] = mao(N, 1);
  const ap = E.out(prog(t, ane - 0.2, ane + 0.3));
  s += anel(hx, hy, 1.2, ap) + brilho(hx + 20, hy - 20, 0.7, ap * (1 - prog(t, ane + 0.4, ane + 1.0)));
  s += sandalias(640, 1258, 1.25, E.out(prog(t, cal - 0.2, cal + 0.3)));
  s += person({ ...man(571), x: 880, y: 1250, s: 1.1, look: -0.6, mood: 'happy', flip: true, armL: 60, armR: 60 });
  return { svg: cam(s, 560, 1010, 1.03 + 0.05 * prog(t, a0, at(18))), html: '' };
}

// ---------------------------------------------------------------- 18. "este meu filho estava morto e voltou à vida"
function scVida(t) {
  const a0 = at(18);
  let s = casaFesta(t);
  [[560, 581], [680, 582]].forEach(([x, sd], k) => (s += person({ ...man(sd), x, y: 1125, s: 0.8, look: -0.3, mood: 'happy', armL: 120 + Math.sin(t * 6 + k) * 20, armR: 120 + Math.sin(t * 6 + k + 2) * 20, rim: C.a300 })));
  s += person({ ...PAI, x: 360, y: 1255, s: 1.3, look: 0.6, mood: 'happy', armR: 62, armL: fala(t, seg(18), fim(18), 40, 30), rim: C.a300 });
  s += person({ ...FESTA, x: 560, y: 1255, s: 1.22, look: -0.4, mood: 'happy', flip: true, armL: 40, armR: 30, rim: C.a300 });
  return { svg: cam(s, 480, 1010, 1.04 + 0.05 * prog(t, a0, at(19))), html: '' };
}

// ---------------------------------------------------------------- 19. o mais velho chega, ouve a música e não quis entrar
function scChega(t) {
  const a0 = at(19), mus = wt(19, 'música'), ira = wt(19, 'ira'), ent = wt(19, 'entrar');
  let s = casaFesta(t);
  const anda = E.out(prog(t, a0, mus));
  const cruza = E.out(prog(t, ent - 0.3, ent + 0.3));
  s += person({ ...VELHO, x: lerp(1100, 760, anda), y: 1250, s: 1.25, walk: anda < 1 ? t * 6 : null, look: t > mus ? -0.8 : -0.3, mood: t > ira - 0.1 ? 'angry' : 'calm', flip: true, armL: lerp(14, -38, cruza), armR: lerp(14, -38, cruza), rim: C.p400 });
  return { svg: cam(s, lerp(640, 600, anda), 1010, 1.04 + 0.06 * prog(t, a0, at(20))), html: '' };
}

// ---------------------------------------------------------------- 20. o pai saiu e insistiu; a resposta do mais velho
function foraDaFesta(t, o = {}) {
  let s = casaFesta(t);
  s += person({ ...PAI, x: o.px ?? 520, y: 1250, s: 1.25, walk: o.pwalk, look: 0.6, mood: o.pmood || 'calm', armL: o.parm ?? 40, armR: o.parm ?? 40, rim: C.a300 });
  s += person({ ...VELHO, x: 780, y: 1250, s: 1.25, look: -0.7, mood: o.vmood || 'angry', flip: true, armL: o.varmL ?? -38, armR: o.varmR ?? -38, rim: C.p400 });
  return s;
}
function scResposta(t) {
  const a0 = at(20), sai = wt(20, 'saiu'), ins = wt(20, 'insistiu'), resp = wt(20, 'respondeu'), esse = wt(20, 'esse');
  const sp = E.inOut(prog(t, sai - 0.2, ins + 0.2));
  const pede = E.out(prog(t, ins - 0.2, ins + 0.4));
  const falando = t > resp && t < esse - 0.2;
  const aponta = E.out(prog(t, esse - 0.3, esse + 0.3));
  const s = foraDaFesta(t, {
    px: lerp(330, 540, sp), pwalk: sp > 0 && sp < 1 ? t * 6 : null, parm: lerp(20, 70, pede),
    varmL: falando ? 20 : -38, varmR: aponta > 0 ? lerp(30, 100, aponta) : falando ? fala(t, resp, esse, 30, 40) : -38,
  });
  const push = E.inOut(prog(t, resp, esse - 0.3)), volta = E.inOut(prog(t, esse - 0.3, fim(20)));
  const cx = lerp(lerp(560, 720, push), 420, volta), z = lerp(lerp(1.02, 1.2, push), 1.08, volta);
  return { svg: cam(s, cx, lerp(1010, 980, push), z), html: '' };
}

// ---------------------------------------------------------------- 21. "Meu filho, você está sempre comigo"
function juntos(t, o = {}) {
  let s = casaFesta(t, { cx: 240 });
  s += person({ ...PAI, x: 500, y: 1250, s: 1.25, look: 0.7, mood: 'calm', armR: o.parmR ?? 78, armL: o.parmL ?? 30, rim: C.a300 });
  s += person({ ...VELHO, x: 700, y: 1250, s: 1.25, look: -0.6, mood: o.vmood || 'angry', flip: true, armL: o.varm ?? -38, armR: o.varm ?? -38, rim: C.p400 });
  return s;
}
function scComigo(t) {
  const a0 = at(21), com = wt(21, 'comigo'), tudo = wt(21, 'tudo');
  const solta = E.out(prog(t, com - 0.2, com + 0.6));
  const s = juntos(t, { parmL: fala(t, seg(21), fim(21), 30, 24), varm: lerp(-38, 14, solta), vmood: solta > 0.5 ? 'sad' : 'angry' });
  const abre = E.inOut(prog(t, tudo - 0.3, fim(21) + 0.3));
  return { svg: cam(s, lerp(620, 520, abre), 1010, lerp(1.2, 1.0, abre)), html: '' };
}

// ---------------------------------------------------------------- 22. "este seu irmão"
function scIrmao(t) {
  const a0 = at(22), irm = wt(22, 'irmão');
  let s = casaFesta(t, { cx: 240 });
  const ap = E.out(prog(t, irm - 0.3, irm + 0.5));
  s += opg(ap, person({ ...FESTA, x: 250, y: 1150, s: 0.9, look: 0.6, mood: 'happy', rim: C.a300 }));
  s += person({ ...PAI, x: 500, y: 1250, s: 1.25, look: 0.5, mood: 'calm', armL: lerp(30, 110, ap), armR: 40, rim: C.a300 });
  s += person({ ...VELHO, x: 720, y: 1250, s: 1.25, look: lerp(-0.6, -1, ap), mood: 'sad', flip: true, armL: 14, armR: 14, rim: C.p400 });
  return { svg: cam(s, lerp(560, 480, E.inOut(prog(t, a0, fim(22)))), 1010, 1.05), html: '' };
}

// ---------------------------------------------------------------- 23. uma em cem, uma em dez, um em dois
function scUmaEm(t) {
  const a0 = at(23);
  const s = numeros(t, [
    ['1 em 100', wt(23, 'cem'), 560, (x, y) => medalha(x, y, 92, t, iconeOvelha(x, y, 0.75, t))],
    ['1 em 10', wt(23, 'dez'), 820, (x, y) => medalha(x, y, 92, t, iconeMoeda(x, y, 0.75))],
    ['1 em 2', wt(23, 'dois'), 1080, (x, y) => medalha(x, y, 92, t, iconeFilhos(x, y, 0.75))],
  ]);
  return { svg: cam(s, 540, 900, 1.0 + 0.04 * prog(t, a0, at(24))), html: '' };
}

// ---------------------------------------------------------------- 24. o pai foi ao encontro dos dois
function scEncontro(t) {
  const a0 = at(24), cor = wt(24, 'correu'), sai = wt(24, 'saiu');
  const A = (tt) => cam(corrida(tt, a0 + 0.3, cor + 0.8), 600, 1000, 1.04);
  const B = (tt) => cam(juntos(tt, { parmL: 30, varm: -38 }), 600, 1010, 1.1);
  return { svg: xcut(t, sai - 0.1, A, B), html: '' };
}

// ---------------------------------------------------------------- 25. gente reclamando de quem Jesus recebia; um filho reclamando de quem o pai recebeu
function scParalelo(t) {
  const a0 = at(25), ult = wt(25, 'última');
  const A = (tt) => cam(criticam(tt, { aponta: 1 }), 560, 1010, 1.05);
  const B = (tt) => cam(foraDaFesta(tt, { parm: 60, varmL: 20, varmR: fala(tt, ult, fim(25), 30, 40) }), 620, 1000, 1.12);
  return { svg: xcut(t, ult - 0.15, A, B), html: '' };
}

// ---------------------------------------------------------------- 26. Jesus não conta se ele entrou
function scPorta(t) {
  const a0 = at(26);
  let s = NOITE(t);
  s += casa(400, 1140, 1.15, t, { luz: 1, noite: true }) + notas(410, 860, t, 0.8, 4);
  s += `<path d="M 340 1140 L 460 1140 L 620 1250 L 180 1250 Z" fill="#FFE3A3" opacity="0.25"/>`;
  s += person({ ...VELHO, x: 760, y: 1250, s: 1.25, look: -0.8, mood: 'calm', flip: true, armL: 14, armR: 14, rim: C.a300 });
  return { svg: cam(s, 580, 1010, 1.04 + 0.08 * E.inOut(prog(t, a0, at(27)))), html: '' };
}

// ---------------------------------------------------------------- 27. qual das três te tocou mais?
function scQual(t) {
  const a0 = at(27);
  const hi = [wt(27, 'ovelha'), wt(27, 'moeda'), wt(27, 'pai')];
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const Y = [580, 840, 1100];
  const ic = [
    (y) => pastorOvelha(540, y + 112, 0.6, t, { look: 0 }),
    (y) => moeda(540, y, 2.6, 0.5),
    (y) => person({ ...NOVO, x: 430, y: y + 100, s: 0.58, noShadow: true, mood: 'happy', look: 0.5 }) + person({ ...PAI, x: 540, y: y + 104, s: 0.64, noShadow: true, mood: 'happy', armL: 100, armR: 100 }) + person({ ...VELHO, x: 650, y: y + 100, s: 0.58, noShadow: true, mood: 'calm', look: -0.5 }),
  ];
  Y.forEach((y, k) => {
    const on = t > hi[k] - 0.2 && (k === 2 || t < hi[k + 1] - 0.2);
    const p = pop(t, a0 + 0.2 + k * 0.3, 0.4);
    if (p <= 0) return;
    s += `<g transform="translate(540 ${y}) scale(${f1(p * 100) / 100}) translate(-540 ${-y})"><rect x="250" y="${y - 120}" width="580" height="240" rx="34" fill="${on ? C.b300 : C.g200}" ${ink(on ? 7 : 5)}/><defs><clipPath id="cq${k}"><rect x="253" y="${y - 117}" width="574" height="234" rx="31"/></clipPath></defs><g clip-path="url(#cq${k})">${ic[k](y)}</g></g>`;
  });
  return { svg: s, html: '' };
}

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  { a: 0, b: at(1), f: scGancho, ref: 'Lucas 15:11-32', dark: true },
  { a: at(1), b: at(2), f: scFora, ref: null, dark: true },
  { a: at(2), b: at(3), f: scPorque, ref: null },
  { a: at(3), b: at(4), f: scTres, ref: 'Lucas 15:3' },
  { a: at(4), b: at(5), f: scReuniam, ref: 'Lucas 15:1' },
  { a: at(5), b: at(6), f: scCriticam, ref: 'Lucas 15:2' },
  { a: at(6), b: at(7), f: scNumeros, ref: null },
  { a: at(7), b: at(8), f: scOvelhas, ref: 'Lucas 15:4' },
  { a: at(8), b: at(9), f: scOmbros, ref: 'Lucas 15:5-6' },
  { a: at(9), b: at(10), f: scMoedas, ref: 'Lucas 15:8', dark: (t) => t > wordTime(9, 'mulher') },
  { a: at(10), b: at(11), f: scCandeia, ref: 'Lucas 15:8-9', dark: (t) => t < wordTime(10, 'acende') + 0.2 },
  { a: at(11), b: at(12), f: scAlegria, ref: [[at(11), 'Lucas 15:7'], [wseg(11, 'segunda') - 0.2, 'Lucas 15:10']] },
  { a: at(12), b: at(13), f: scDoisFilhos, ref: 'Lucas 15:11' },
  { a: at(13), b: at(14), f: scHeranca, ref: 'Lucas 15:12-13', dark: (t) => t > wordTime(13, 'longe') },
  { a: at(14), b: at(15), f: scPorcos, ref: 'Lucas 15:14-16' },
  { a: at(15), b: at(16), f: scVoltar, ref: 'Lucas 15:17-18' },
  { a: at(16), b: at(17), f: scCorreu, ref: 'Lucas 15:20' },
  { a: at(17), b: at(18), f: scRoupa, ref: 'Lucas 15:22-23', dark: true },
  { a: at(18), b: at(19), f: scVida, ref: 'Lucas 15:24', dark: true },
  { a: at(19), b: at(20), f: scChega, ref: 'Lucas 15:25-28', dark: true },
  { a: at(20), b: at(21), f: scResposta, ref: 'Lucas 15:28-30', dark: true },
  { a: at(21), b: at(22), f: scComigo, ref: 'Lucas 15:31', dark: true },
  { a: at(22), b: at(23), f: scIrmao, ref: 'Lucas 15:32', dark: true },
  { a: at(23), b: at(24), f: scUmaEm, ref: null },
  { a: at(24), b: at(25), f: scEncontro, ref: [[at(24), 'Lucas 15:20'], [wseg(24, 'saiu') - 0.1, 'Lucas 15:28']], dark: (t) => t > wordTime(24, 'saiu') },
  { a: at(25), b: at(26), f: scParalelo, ref: [[at(25), 'Lucas 15:2'], [wseg(25, 'última') - 0.15, 'Lucas 15:28-30']], dark: (t) => t > wordTime(25, 'última') },
  { a: at(26), b: at(27), f: scPorta, ref: null, dark: true },
  { a: at(27), b: DURATION + 1, f: scQual, ref: null },
];
