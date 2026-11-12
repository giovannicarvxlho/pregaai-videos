// Arte das capas e miniaturas do episódio (carregada depois de data.js, lib.js e scenes.js).
// Três heróis, cada um com um motivo para clicar: a rede com 153 peixes (curiosidade), Pedro chorando na
// fogueira da manhã (emoção: a terceira pergunta) e Pedro velho, de mãos estendidas (João 21:18; 2 Pedro 1:14).
const CHUNKS = buildChunks(SEGS); // as funções de cena usam wordTime
const T = 2.0;
const MANTO = '#7E5236'; // de perto, a roupa de Pedro (C.p500) some contra a pele; nas capas ela fica um tom mais escura
const VIN = (o = 0.55, cx = '50%', cy = '50%', r = '72%') => `<defs><radialGradient id="vin" cx="${cx}" cy="${cy}" r="${r}"><stop offset="50%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${o}"/></radialGradient></defs><rect x="-400" y="-400" width="2720" height="1880" fill="url(#vin)"/>`;
const LUZ = (x, y, r, cor, op) => `<defs>${radial('gLuz' + cor.slice(1), cor, 0.95)}</defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gLuz${cor.slice(1)})" opacity="${op}"/>`;

// A: a rede cheia na areia, ao nascer do sol (luz dourada atrás).
function artA(o = {}) {
  let s = praia(T, { sunX: o.sunX ?? 520, sunY: 470, sh: 600, hz: 520 });
  s += LUZ(o.sunX ?? 520, 500, 900, '#FFB347', 0.75);
  s += rede(o.x0 ?? -200, o.y ?? 600, o.x1 ?? 1380, o.y ?? 600, o.d ?? 480, 64, { id: 'cA', t: T, fs: o.fs ?? 2.0, seed: 23, bg: '#1F3344', bgOp: 0.5, w: 4 });
  return s + VIN(0.55);
}
// B: Pedro chorando, de perto, na luz da fogueira da manhã (céu do amanhecer, ainda escuro).
function artB(o = {}) {
  const x = o.x ?? 1320, ps = o.s ?? 3.7, py = o.y ?? 1560;
  let s = praia(T, { ceu: 'dawn', glowX: x, glow: 0.45, sh: 700, hz: 540 });
  s += LUZ(x, 620, 640, '#FF9E3D', 0.85);
  s += brasas(x - 420, 1010, 1.4, T, 0);
  const P = { ...PEDRO, robe: MANTO, x, y: py, s: ps, look: -0.6, mood: 'sad', rim: C.a300, noShadow: true };
  s += person(P) + lagrimas(x, py, ps, 0.35, 1) + lagrimas(x, py, ps, 0.8, 0.8);
  return s + VIN(0.6);
}
// C: Pedro velho, de mãos estendidas (João 21:18), no céu fechado, com uma luz fria atrás.
function artC(o = {}) {
  const x = o.x ?? 600, ps = o.s ?? 3.2, py = o.y ?? 1500;
  let s = bgGloom(T, { seed: 9 }) + `<rect x="-400" y="-400" width="2720" height="1880" fill="#1B2430" opacity="0.55"/>`;
  s += cidadeSil(x + 900, 640, 1.0, '#2C3640');
  s += LUZ(x, 520, 640, '#CFE3FF', 0.8);
  s += person({ ...VELHO, robe: MANTO, x, y: py, s: ps, look: 0, mood: 'calm', armL: 72, armR: 72, rim: '#CFE3FF', noShadow: true });
  return s + VIN(0.6);
}

// ---------- Miniaturas novas do longo (12/11/2026), com as peças do capa-lib.js ----------
// Três motivos e três layouts, só com o que o vídeo mostra (peças próprias com o prefixo pv):
// N1 (emoção): Pedro magoado, de perto, na praia ao amanhecer, com a fogueira de brasas (João 21:9, 17).
// N2 (curiosidade): a rede cheia que Pedro arrastou para a praia, 153 peixes grandes (João 21:11).
// N3 (mistério): Pedro velho, de mãos estendidas, o aviso de Jesus sobre a morte dele (João 21:18-19).

// Praia ao amanhecer com cor de capa: céu do roxo ao laranja, sol na linha do mar, mar azul e areia escura.
function pvPraia(o = {}) {
  const hz = o.hz ?? 640, sh = o.sh ?? 830, sx = o.sx ?? 470;
  let s = capaFundo(o.ceu || [[0.2, '#1B1140'], [0.36, '#6B2463'], [0.47, '#D9483F'], [0.535, '#FF9A3C'], [0.56, '#FFD27A']]);
  s += capaLuz(sx, hz, o.luzR ?? 760, '#FFB347', o.luz ?? 0.9) + capaRaios(sx, hz, 1200, 14, '#FFE3A0', 0.13, 6, 180, 360);
  s += `<circle cx="${sx}" cy="${hz}" r="${o.sol ?? 132}" fill="#FFF1C4" stroke="#FFB347" stroke-width="10"/>`;
  // o mar
  s += `<defs><linearGradient id="pvMar${o.id || ''}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.mar0 || '#3A86C8'}"/><stop offset="1" stop-color="${o.mar1 || '#12406F'}"/></linearGradient></defs>`;
  s += `<rect x="-400" y="${hz}" width="2720" height="${sh - hz + 60}" fill="url(#pvMar${o.id || ''})"/><line x1="-400" y1="${hz}" x2="2320" y2="${hz}" stroke="${CAPA.ink}" stroke-width="7"/>`;
  // o reflexo do sol na água
  const r = rng(31);
  for (let i = 0; i < 9; i++) {
    const y = hz + 16 + i * ((sh - hz - 30) / 9), w = 70 + i * 34 + r() * 40;
    s += `<rect x="${f1(sx - w / 2 + (r() - 0.5) * 30)}" y="${f1(y)}" width="${f1(w)}" height="${f1(7 + i * 0.8)}" rx="4" fill="#FFE3A0" opacity="${f1((0.9 - i * 0.06) * 100) / 100}"/>`;
  }
  for (let i = 0; i < 14; i++) s += `<rect x="${f1(-200 + r() * 2300)}" y="${f1(hz + 20 + r() * (sh - hz - 50))}" width="${f1(50 + r() * 90)}" height="6" rx="3" fill="#BFE0FF" opacity="0.35"/>`;
  // a areia, com a linha de espuma
  s += `<path d="M -400 ${sh} C 300 ${sh - 26} 900 ${sh + 22} 1500 ${sh - 6} C 1800 ${sh - 18} 2100 ${sh + 8} 2320 ${sh} L 2320 1300 L -400 1300 Z" fill="${o.areia || '#3B2416'}" stroke="${CAPA.ink}" stroke-width="7"/>`;
  s += `<path d="M -400 ${sh} C 300 ${sh - 26} 900 ${sh + 22} 1500 ${sh - 6} C 1800 ${sh - 18} 2100 ${sh + 8} 2320 ${sh}" fill="none" stroke="#FFFFFF" stroke-width="12" opacity="0.6" stroke-linecap="round"/>`;
  return s;
}
// Choro por cima do retrato de mood 'medo' (olhos grandes): pálpebra caída para fora, água na borda de baixo do olho,
// fios de lágrima e a boca de choro (a boca do retrato fica em cima da barba e some). Mesmo x, y e s do retrato.
function pvChoro(x, y, s, o = {}) {
  const skin = o.skin || PEDRO.skin, id = 'pvc' + (o.id || '');
  const st = (w, c = CAPA.ink) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const ex = 84, ey = -22, rx = 62, ry = 72;
  let g = '';
  [-1, 1].forEach((d) => {
    const cx = d * ex, cid = id + (d < 0 ? 'l' : 'r'), xi = cx - d * (rx + 12), xo = cx + d * (rx + 12), yi = ey - ry * 0.7, yo = ey - ry * 0.02;
    g += `<clipPath id="${cid}"><ellipse cx="${cx}" cy="${ey}" rx="${rx - 4}" ry="${ry - 4}"/></clipPath><g clip-path="url(#${cid})">`;
    g += `<path d="M ${xi} ${ey - ry - 20} L ${xo} ${ey - ry - 20} L ${xo} ${yo} L ${xi} ${yi} Z" fill="${shade(skin, 0.9)}"/><line x1="${xi}" y1="${yi}" x2="${xo}" y2="${yo}" ${st(13)}/>`;
    g += `<path d="M ${cx - rx} ${ey + ry * 0.5} Q ${cx} ${ey + ry * 0.2} ${cx + rx} ${ey + ry * 0.5} L ${cx + rx} ${ey + ry + 10} L ${cx - rx} ${ey + ry + 10} Z" fill="#8FD0FF" opacity="0.92"/><path d="M ${cx - rx * 0.5} ${ey + ry * 0.62} q ${rx * 0.3} -10 ${rx * 0.6} 0" fill="none" ${st(6, '#fff')}/></g>`;
  });
  // sobrancelhas de tristeza, por cima do cabelo (as do retrato ficam escondidas sob a franja)
  [-1, 1].forEach((d) => (g += `<path d="M ${d * 26} ${ey - ry - 30} Q ${d * 96} ${ey - ry - 34} ${d * 160} ${ey - ry + 22}" fill="none" ${st(26, o.sobrancelha || shade(o.hair || PEDRO.hair, 0.55))}/>`));
  // fios de lágrima descendo dos dois olhos
  const fio = (cx, y0, len, w) => `<path d="M ${cx - w} ${y0} C ${cx - w - 6} ${y0 + len * 0.5} ${cx - w + 2} ${y0 + len * 0.8} ${cx} ${y0 + len} C ${cx + w + 4} ${y0 + len * 0.8} ${cx + w + 2} ${y0 + len * 0.4} ${cx + w} ${y0} Z" fill="#8FD0FF" ${st(8)}/><path d="M ${cx - w * 0.3} ${y0 + 12} L ${cx - w * 0.3} ${y0 + len * 0.55}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.85"/>`;
  g += fio(-96, ey + ry - 8, o.l1 ?? 118, 16) + fio(100, ey + ry - 8, o.l2 ?? 84, 14);
  // a boca: um vão na barba, com a boca aberta virada para baixo
  g += `<ellipse cx="0" cy="124" rx="86" ry="62" fill="${shade(skin, 0.93)}" ${st(11)}/>`;
  g += `<path d="M -58 160 C -50 96 50 96 58 160 C 32 138 -32 138 -58 160 Z" fill="#3A0D12" ${st(11)}/>`;
  g += `<path d="M -32 116 Q 0 100 32 116 L 27 126 Q 0 113 -27 126 Z" fill="#fff"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${g}</g>`;
}
// Fogueira de brasas com o peixe em cima (João 21:9), em cor de capa: brasa laranja e vermelha, chama e grelha de gravetos.
function pvBrasas(x, y, s) {
  const st = (w, c = CAPA.ink) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  let g = `<ellipse cx="0" cy="6" rx="150" ry="30" fill="#1C100A"/>`;
  const r = rng(7);
  for (let k = 0; k < 11; k++) g += `<circle cx="${f1((k - 5) * 25 + (r() - 0.5) * 8)}" cy="${f1(-8 + (r() - 0.5) * 14)}" r="${f1(15 + r() * 5)}" fill="${['#FF3D1F', '#FF7A1A', '#FFC21E'][k % 3]}" ${st(4, '#5A1A08')}/>`;
  [[-56, 86, 30], [0, 120, 36], [54, 78, 28]].forEach(([dx, h, w]) => {
    g += `<path d="M ${dx - w} -14 C ${dx - w} ${-h * 0.5} ${dx - w * 0.2} ${-h * 0.7} ${dx} ${-h - 14} C ${dx + w * 0.2} ${-h * 0.7} ${dx + w} ${-h * 0.5} ${dx + w} -14 Z" fill="#FF6A13" ${st(6, '#7A1E08')}/>`;
    g += `<path d="M ${dx - w * 0.5} -14 C ${dx - w * 0.5} ${-h * 0.35} ${dx} ${-h * 0.45} ${dx} ${-h * 0.7} C ${dx} ${-h * 0.45} ${dx + w * 0.5} ${-h * 0.35} ${dx + w * 0.5} -14 Z" fill="#FFD21E"/>`;
  });
  g += `<path d="M -170 -150 L 170 -150 M -156 -150 L -156 0 M 156 -150 L 156 0" fill="none" ${st(20)}/><path d="M -170 -150 L 170 -150 M -156 -150 L -156 0 M 156 -150 L 156 0" fill="none" ${st(10, '#8A5A36')}/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>` + peixe(x - 72 * s, y - 172 * s, 1.5 * s, 0, '#E9B98A', CAPA.ink) + peixe(x + 78 * s, y - 172 * s, 1.5 * s, 0, '#D9A070', CAPA.ink);
}
function artN1(o = {}) {
  const X = 1476, Y = 610, S = 1.62;
  let s = pvPraia({ sx: 470, hz: 640, sh: 836, id: 'a' });
  // a fogueira de brasas com o peixe em cima (João 21:9)
  s += capaLuz(430, 930, 460, '#FF6A13', 0.9) + pvBrasas(430, 1010, 1.25) + capaMotas(250, 640, 380, 260, 16, 12, '#FFD27A', 0.9);
  s += retrato({ ...PEDRO, robe: MANTO, x: X, y: Y, s: S, mood: 'medo', look: [-0.5, 0.55], lado: -1, luz: '#FFB347', id: 'pvA' });
  s += pvChoro(X, Y, S);
  s += capaVinheta(0.5, '45%', '50%', '82%');
  s += capaTexto([{ t: 'PEDRO FICOU', w: 800 }, { t: 'MAGOADO', w: 990, fill: 'ouro' }], { x: 60, y: 56, gap: 0.12 });
  return s;
}
// Peixe grande em cor de capa (prata azulada, barriga clara, olho com brilho), no traço de tinta.
function pvPeixe(x, y, s, ang, col) {
  const st = `stroke="${CAPA.ink}" stroke-width="3.4" stroke-linejoin="round"`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)}) scale(${f1(s * 100) / 100})">
    <path d="M -30 0 L -62 -24 L -54 0 L -62 24 Z" fill="${shade(col, 0.72)}" ${st}/>
    <path d="M -6 -20 L 10 -34 L 22 -18 Z" fill="${shade(col, 0.72)}" ${st}/>
    <path d="M -38 0 C -20 -27 24 -27 46 0 C 24 27 -20 27 -38 0 Z" fill="${col}" ${st}/>
    <path d="M -30 7 C -10 23 24 23 42 4 C 22 13 -8 14 -30 7 Z" fill="#fff" opacity="0.55"/>
    <path d="M 12 -17 C 5 -7 5 7 12 17" stroke="${shade(col, 0.6)}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="29" cy="-5" r="6.5" fill="#fff" stroke="${CAPA.ink}" stroke-width="2.6"/><circle cx="30" cy="-5" r="3" fill="${CAPA.ink}"/>
  </g>`;
}
// A rede cheia, de perto: um saco de malha grossa com os peixes grandes apertados dentro e as boias em cima.
function pvRedeCheia(x0, y0, x1, y1, d, seed = 23) {
  const my = Math.max(y0, y1), path = `M ${x0} ${y0} C ${f1(x0 + (x1 - x0) * 0.02)} ${my + d} ${f1(x1 - (x1 - x0) * 0.02)} ${my + d} ${x1} ${y1} Z`;
  const r = rng(seed), cores = ['#6FB7E9', '#A6D8F5', '#4E9AD0', '#CBE8F8', '#F2C078'];
  let f = '', k = 0;
  for (let row = 0; row < 6; row++) for (let c = 0; c < 6; c++) {
    const x = x0 + 70 + c * ((x1 - x0 - 140) / 5) + (row % 2 ? 100 : 0) + (r() - 0.5) * 50, y = y0 + 80 + row * (d * 0.128) + (r() - 0.5) * 30;
    f += pvPeixe(x, y, 2.75 + r() * 0.5, (r() - 0.5) * 44 + (row % 2 ? 180 : 0), cores[(k++ * 3 + row) % cores.length]);
  }
  let m = '';
  for (let x = x0 - d - 200; x < x1 + d + 200; x += 128) m += `M ${x} ${y0 - 60} l ${d + 200} ${d + 200} M ${x + d + 200} ${y0 - 60} l ${-(d + 200)} ${d + 200} `;
  let s = `<clipPath id="pvRc"><path d="${path}"/></clipPath>`;
  s += `<g clip-path="url(#pvRc)"><path d="${path}" fill="#041B2B"/>${f}<path d="${m}" stroke="${CAPA.ink}" stroke-width="10" fill="none" opacity="0.4"/><path d="${m}" stroke="#F8EBC8" stroke-width="5" fill="none" opacity="0.9"/></g>`;
  s += `<path d="${path}" fill="none" stroke="${CAPA.ink}" stroke-width="15" stroke-linejoin="round"/>`;
  s += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="${CAPA.ink}" stroke-width="30" stroke-linecap="round"/><line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="#C99A5B" stroke-width="16" stroke-linecap="round"/>`;
  for (let i = 0; i <= 5; i++) s += `<circle cx="${f1(lerp(x0, x1, i / 5))}" cy="${f1(lerp(y0, y1, i / 5))}" r="24" fill="#FFB52E" stroke="${CAPA.ink}" stroke-width="9"/>`;
  return s;
}
function artN2(o = {}) {
  // mar turquesa e céu ainda escuro, com o sol nascendo atrás da rede: outra paleta, para não repetir a A
  let s = pvPraia({ sx: 560, hz: 430, sh: 850, sol: 170, luzR: 1000, id: 'b', mar0: '#22B3B0', mar1: '#0A4E6E', areia: '#2B1C12',
    ceu: [[0.2, '#04121F'], [0.34, '#0B3350'], [0.42, '#1F6E7E'], [0.441, '#FFD27A']] });
  // a corda por onde Pedro arrastou a rede (João 21:11), saindo do quadro
  s += `<path d="M 70 300 C 20 240 -30 200 -100 150" fill="none" stroke="${CAPA.ink}" stroke-width="30" stroke-linecap="round"/><path d="M 70 300 C 20 240 -30 200 -100 150" fill="none" stroke="#C99A5B" stroke-width="16" stroke-linecap="round"/>`;
  s += `<ellipse cx="600" cy="985" rx="560" ry="60" fill="#000" opacity="0.4"/>`;
  s += pvRedeCheia(50, 300, 1150, 270, 890);
  s += capaLuz(560, 380, 620, '#FFD27A', 0.3) + capaMotas(100, 120, 1060, 300, 22, 3, '#FFF1C4', 0.9);
  s += capaVinheta(0.55, '40%', '50%', '85%');
  s += capaTexto([{ t: 'PEDRO PUXOU', w: 690 }, { t: '153', w: 540, fill: 'ouro' }, { t: 'PEIXES', w: 690, fill: 'ouro' }], { x: 1870, y: 50, anchor: 'end', gap: 0.1 });
  return s;
}
// Sobrancelhas por cima do retrato (as dele ficam sob o cabelo quando não há capacete). tipo: 'triste' | 'medo'.
function pvSobrancelhas(x, y, s, cor, ry = 72) {
  const ey = -22;
  let g = '';
  [-1, 1].forEach((d) => (g += `<path d="M ${d * 26} ${ey - ry - 34} Q ${d * 96} ${ey - ry - 40} ${d * 160} ${ey - ry + 16}" fill="none" stroke="${cor}" stroke-width="26" stroke-linecap="round"/>`));
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${g}</g>`;
}
// Mão aberta estendida, de frente (palma e dedos), com a manga. (x, y) é o centro da palma.
function pvMao(x, y, s, skin, manga, flip = 1) {
  const st = (w) => `stroke="${CAPA.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  let g = `<path d="M -70 330 L -58 90 L 58 90 L 70 330 Z" fill="${manga}" ${st(13)}/>`;
  [[-54, -96, 86], [-18, -118, 96], [18, -112, 92], [52, -84, 78]].forEach(([dx, top, len]) => (g += `<rect x="${dx - 17}" y="${top}" width="34" height="${len + 40}" rx="17" fill="${skin}" ${st(11)}/>`));
  g += `<rect x="60" y="-20" width="34" height="86" rx="17" transform="rotate(-38 77 50)" fill="${skin}" ${st(11)}/>`;
  g += `<rect x="-76" y="-34" width="152" height="140" rx="50" fill="${skin}" ${st(13)}/>`;
  g += `<path d="M -40 30 Q 0 50 40 30" fill="none" stroke="${shade(skin, 0.7)}" stroke-width="8" stroke-linecap="round"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${flip * s} ${s})">${g}</g>`;
}
// Boca apertada de aflição e fios da barba, por cima do retrato (cobre a boca aberta do retrato).
function pvAflito(x, y, s, barba) {
  const st = (w, c = CAPA.ink) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  let g = `<ellipse cx="0" cy="120" rx="66" ry="64" fill="${barba}"/>`;
  g += `<path d="M -150 96 C -130 150 -90 190 -40 208 M 150 96 C 130 150 90 190 40 208 M -60 222 Q 0 236 60 222" fill="none" ${st(9, shade(barba, 0.72))}/>`;
  g += `<path d="M -52 138 Q -30 104 -6 122 Q 16 138 34 116 Q 46 104 56 124" fill="none" ${st(15)}/>`;
  // fios do cabelo, para a cabeça não parecer um capuz
  [[-150, -168, -118, -206], [-84, -204, -66, -238], [0, -212, 0, -246], [84, -204, 66, -238], [150, -168, 118, -206]].forEach(([x1, y1, x2, y2]) => (g += `<path d="M ${x1} ${y1} Q ${(x1 + x2) / 2 + 10} ${(y1 + y2) / 2} ${x2} ${y2}" fill="none" ${st(9, shade(barba, 0.72))}/>`));
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${g}</g>`;
}
function artN3(o = {}) {
  const X = 540, Y = 500, S = 1.5, GRIS = '#B9B2AA'; // cabelo e barba grisalhos (o branco do vídeo, de perto, parecia um capuz)
  // céu fechado e frio (o vídeo mostra esse trecho no céu cinzento), com uma luz clara atrás de Pedro
  let s = capaFundo([[0.2, '#070B18'], [0.42, '#18264A'], [0.6, '#33466E'], [0.75, '#141C33']]);
  s += capaLuz(X + 30, 420, 860, '#BFD9FF', 0.9) + capaRaios(X + 30, 400, 1400, 14, '#E3EEFF', 0.11, 9);
  s += hills(930, 60, 0.004, 9, '#0A1124') + `<rect x="-400" y="960" width="2720" height="400" fill="#070B18"/>`;
  s += retrato({ ...VELHO, hair: GRIS, robe: MANTO, x: X, y: Y, s: S, mood: 'medo', look: [0.55, -0.35], lado: 1, luz: '#CFE3FF', suor: true, id: 'pvC' });
  s += pvAflito(X, Y, S, GRIS) + pvSobrancelhas(X, Y, S, '#5E5852');
  // as mãos estendidas (João 21:18)
  s += pvMao(X - 410, 900, 1.15, VELHO.skin, MANTO, 1) + pvMao(X + 410, 900, 1.15, VELHO.skin, MANTO, -1);
  s += capaVinheta(0.55, '35%', '45%', '85%');
  s += capaTexto([{ t: 'JESUS AVISOU', w: 800 }, { t: 'PEDRO', w: 800, fill: 'ouro' }], { x: 1866, y: 250, anchor: 'end', gap: 0.12, rot: 2 });
  return s;
}
