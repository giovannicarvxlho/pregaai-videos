// A morte de Jezabel (2 Reis 9:22-37), versão de teste com mais detalhe por quadro.
// Mesma narração e mesmo roteiro do morte-de-jezabel; muda só o desenho.
// O que vem da referência (OverSimplified): rosto com sobrancelha e boca que falam, fundos
// com textura e profundidade, cortes secos entre planos, coisas vivas no fundo (bandeiras,
// pássaros, poeira, chama). O que é nosso: o traço de tinta, o olho de ponto, a paleta e a legenda.
// As peças novas ficam aqui enquanto é teste; se o estilo for aprovado, sobem para o lib.js.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const sub = (i, k) => SEGS[i][3][k];
const OL = C.ink;
const st = (w) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const g_ = (x, y, s, inner, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})">${inner}</g>`;
const talk = (t, a, b, k = 1) => (t > a && t < b ? k * Math.abs(Math.sin(t * 13)) * (0.55 + 0.45 * Math.abs(Math.sin(t * 5.1))) : 0);
const blink = (t, seed = 0) => ((t + seed * 1.37) % 3.4 < 0.12 ? 1 : 0);

const JZ = { robe: '#8E3B46', skin: '#C68B59', hair: '#191919', gold: '#E4B750' };
const JEU = { robe: '#56654A', cloak: '#8C2F2F', skin: '#B07A50', hair: '#2E211A', helm: '#B9894A' };

const LOCAL_DEFS = `<defs>
  <radialGradient id="jzVig" cx="50%" cy="42%" r="72%"><stop offset="0.62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.42"/></radialGradient>
  <radialGradient id="jzGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFD27A" stop-opacity="0.85"/><stop offset="1" stop-color="#FFB24A" stop-opacity="0"/></radialGradient>
  <radialGradient id="jzSpot" cx="50%" cy="40%" r="55%"><stop offset="0" stop-color="#FFE7B3" stop-opacity="0.55"/><stop offset="1" stop-color="#FFE7B3" stop-opacity="0"/></radialGradient>
  <linearGradient id="jzSkyGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2B97A"/><stop offset="0.45" stop-color="#F8DDB0"/><stop offset="1" stop-color="#FBEFD9"/></linearGradient>
  <linearGradient id="jzSkyRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A2228"/><stop offset="0.5" stop-color="#A9483A"/><stop offset="1" stop-color="#E9A26A"/></linearGradient>
  <linearGradient id="jzSkyDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1820"/><stop offset="0.55" stop-color="#43292E"/><stop offset="1" stop-color="#7E4334"/></linearGradient>
  <linearGradient id="jzSkyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFDDF7"/><stop offset="0.6" stop-color="#E4EFF8"/><stop offset="1" stop-color="#F6F1E8"/></linearGradient>
  <linearGradient id="jzBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1CF" stop-opacity="0.6"/><stop offset="1" stop-color="#FFF1CF" stop-opacity="0"/></linearGradient>
  <linearGradient id="jzFloorRoom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A5E48"/><stop offset="1" stop-color="#5E3D2F"/></linearGradient>
  <filter id="jzSepia"><feColorMatrix type="matrix" values="0.42 0.74 0.18 0 0.03  0.36 0.66 0.16 0 0.02  0.27 0.51 0.13 0 0  0 0 0 1 0"/></filter>
</defs>`;
const vig = (op = 1) => `<rect x="-10" y="-10" width="${W + 20}" height="${H + 20}" fill="url(#jzVig)" opacity="${op}"/>`;
const out = (svg, o = {}) => ({ svg: LOCAL_DEFS + svg + vig(o.vig ?? 1), html: '' });

// ------------------------------------------------------------------ peças de cenário
// Muro de pedra com blocos de tamanho variado, tom levemente diferente por bloco e rachaduras.
function stoneWall(x0, y0, x1, y1, pal, seed) {
  const r = rng(seed);
  let s = rect(x0, y0, x1 - x0, y1 - y0, pal.base);
  for (let y = y0, row = 0; y < y1; y += 64, row++) {
    let x = x0 - (row % 2) * 70 - r() * 40;
    while (x < x1) {
      const w = 110 + r() * 90, k = 0.92 + r() * 0.12;
      s += `<rect x="${f1(x + 4)}" y="${f1(y + 4)}" width="${f1(w - 8)}" height="56" rx="9" fill="${shade(pal.base, k)}" stroke="${pal.line}" stroke-width="3"/>`;
      if (r() < 0.5) s += `<path d="M ${f1(x + 14)} ${f1(y + 44)} q ${f1(w * 0.3)} -10 ${f1(w * 0.6)} 2" stroke="${pal.hi}" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round"/>`;
      if (r() < 0.08) s += `<path d="M ${f1(x + w * 0.4)} ${f1(y + 6)} l 10 16 l -8 12 l 12 18" stroke="${pal.line}" stroke-width="3" fill="none"/>`;
      x += w;
    }
  }
  return s;
}
// Bandeira com pano que ondula.
function banner(x, y, h, t, cor, faixa = C.a400) {
  const w = 90, wav = (k) => f1(Math.sin(t * 3 + k) * 8);
  return `<line x1="${x}" y1="${y - 30}" x2="${x}" y2="${y + h + 10}" stroke="${OL}" stroke-width="8" stroke-linecap="round"/>` +
    `<path d="M ${x} ${y} L ${x + w} ${y + +wav(0)} L ${x + w + +wav(1)} ${y + h * 0.5} L ${x + w} ${y + h + +wav(2)} L ${x + w / 2} ${y + h - 30} L ${x} ${y + h} Z" fill="${cor}" ${st(5)}/>` +
    `<path d="M ${x + 14} ${y + 26} L ${x + w - 14} ${y + 26 + +wav(0) * 0.6}" stroke="${faixa}" stroke-width="10" stroke-linecap="round"/>` +
    `<circle cx="${x}" cy="${y - 34}" r="10" fill="${C.a400}" ${st(4)}/>`;
}
function palm(x, base, s, t, tone = {}) {
  const trunk = tone.trunk || '#9C7350', leaf = tone.leaf || '#6E8A4A', leafDk = shade(leaf, 0.8);
  let g = '';
  for (let i = 0; i < 7; i++) g += `<path d="M ${-14 + i * 1.5} ${-i * 46} L ${14 + i * 1.5} ${-i * 46} L ${12 + (i + 1) * 1.5} ${-(i + 1) * 46} L ${-12 + (i + 1) * 1.5} ${-(i + 1) * 46} Z" fill="${shade(trunk, i % 2 ? 0.9 : 1)}" ${st(4)}/>`;
  const sw = Math.sin(t * 1.6) * 4;
  [[-160, 40], [-110, -10], [-40, -40], [40, -40], [110, -10], [160, 40]].forEach(([dx, dy], i) => {
    const ex = dx + sw, ey = dy - 322 + 40;
    g += `<path d="M 10 -322 Q ${f1(dx * 0.5)} ${f1(-380 + dy * 0.3)} ${f1(ex)} ${f1(ey)} Q ${f1(dx * 0.55)} ${f1(-350 + dy * 0.2)} 10 -318 Z" fill="${i % 2 ? leaf : leafDk}" ${st(4)}/>`;
  });
  return g_(x, base, s, g);
}
function birds(t, n, y0, seed, cor = '#3A2F2A') {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const sp = 40 + r() * 50, x = ((r() * 1400 + t * sp) % 1400) - 160, y = y0 + r() * 220 + Math.sin(t * 2 + i) * 10, fl = Math.sin(t * 9 + i * 2) * 8, k = 0.7 + r() * 0.6;
    s += `<path d="M ${f1(x - 16 * k)} ${f1(y - fl * k)} Q ${f1(x - 6 * k)} ${f1(y - 8 * k)} ${f1(x)} ${f1(y)} Q ${f1(x + 6 * k)} ${f1(y - 8 * k)} ${f1(x + 16 * k)} ${f1(y - fl * k)}" stroke="${cor}" stroke-width="${f1(4 * k)}" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}
function motes(t, x, y, w, h, n, seed, cor = '#FFF4DA') {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const px = x + ((r() * w + Math.sin(t * 0.7 + i) * 30) % w), py = y + ((r() * h - t * (8 + r() * 14)) % h + h) % h;
    s += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(2 + r() * 3)}" fill="${cor}" opacity="${f1((0.3 + 0.5 * r()) * 100) / 100}"/>`;
  }
  return s;
}
function lamp(x, y, s, t) {
  const fl = 1 + Math.sin(t * 17) * 0.08 + Math.sin(t * 7.3) * 0.06;
  return `<circle cx="${x}" cy="${y - 40 * s}" r="${f1(170 * s * fl)}" fill="url(#jzGlow)" opacity="0.7"/>` + g_(x, y, s,
    `<path d="M -60 0 Q -60 -36 0 -36 Q 70 -36 90 -22 L 60 -10 Q 50 0 30 0 Z" fill="${C.a600}" ${st(5)}/><ellipse cx="0" cy="-36" rx="34" ry="9" fill="${shade(C.a600, 0.8)}" ${st(4)}/>` +
    `<path d="M 84 -24 C 70 ${f1(-60 * fl)} 96 ${f1(-84 * fl)} 92 ${f1(-110 * fl)} C 112 ${f1(-80 * fl)} 110 -50 96 -24 Z" fill="#FFB43C" ${st(4)}/><path d="M 90 -30 C 86 -50 96 -62 94 -76 C 104 -60 102 -44 96 -30 Z" fill="#FFF0B3"/>`);
}
function curtain(x, y, w, h, t, cor, side = 1) {
  const sway = Math.sin(t * 1.3) * 10;
  let s = `<path d="M ${x} ${y} L ${x + w} ${y} C ${x + w * 0.8 + sway} ${y + h * 0.4} ${x + w * 0.5 + sway} ${y + h * 0.7} ${x + w * 0.55 + sway * 1.5} ${y + h} L ${x} ${y + h} Z" fill="${cor}" ${st(5)}/>`;
  for (let i = 1; i < 4; i++) s += `<path d="M ${x + w * i * 0.18} ${y + 10} Q ${x + w * i * 0.16 + sway * 0.5} ${y + h * 0.6} ${x + w * i * 0.14 + sway} ${y + h - 10}" stroke="${shade(cor, 0.8)}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  return side < 0 ? flipX(x + w / 2, s) : s;
}
function crown(x, y, s, rot = 0, fill = C.a300, glint = 0) {
  let g = `<path d="M -32 20 L -36 -22 L -18 0 L 0 -28 L 18 0 L 36 -22 L 32 20 Z" fill="${fill}" ${st(5)}/><path d="M -30 20 L 30 20 L 31 10 L -31 10 Z" fill="${shade(fill, 0.85)}"/><circle cx="0" cy="6" r="5" fill="${C.r600}"/><circle cx="-18" cy="10" r="3.5" fill="${C.b500}"/><circle cx="18" cy="10" r="3.5" fill="${C.b500}"/>`;
  if (glint > 0) g += `<path d="M 22 -30 l 4 -12 l 4 12 l 12 4 l -12 4 l -4 12 l -4 -12 l -12 -4 Z" fill="#FFF8D8" opacity="${f1(glint * 100) / 100}"/>`;
  return g_(x, y, s, g, rot);
}
function kohlPot(x, y, s, rot = 0) {
  return g_(x, y, s, `<path d="M -26 0 Q -32 -40 -16 -52 L 16 -52 Q 32 -40 26 0 Z" fill="#2F5E6E" ${st(5)}/><rect x="-20" y="-64" width="40" height="14" rx="5" fill="${C.a400}" ${st(4)}/><path d="M -20 -30 L 20 -30" stroke="${C.a300}" stroke-width="5"/>`, rot);
}
function mirror(x, y, s, sky = '#CFE3F7') {
  return g_(x, y, s, `<rect x="-10" y="60" width="20" height="90" rx="8" fill="${C.a600}" ${st(5)}/><circle cx="0" cy="0" r="78" fill="${C.a400}" ${st(6)}/><circle cx="0" cy="0" r="62" fill="${sky}" ${st(4)}/><path d="M -40 -20 Q -20 -50 10 -46" stroke="#FFFFFF" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.8"/>`);
}

// ------------------------------------------------------------------ rostos de perto
// Busto com cabeça grande: olho de ponto (o nosso), sobrancelha e boca que atuam (a referência).
// brow: [inclinação, altura] por lado; mouth: 'smirk' | 'flat' | 'open' | 'shout' | 'frown' | 'o'; talk 0..1 abre a boca.
function face(o) {
  const R = 110, lx = (o.look || 0) * 12, ly = (o.lookY || 0) * 8;
  let g = '';
  const brow = o.brow || [[0, 0], [0, 0]];
  // cabelo de trás (Jezabel)
  if (o.longHair) g += `<path d="M -128 -10 C -140 -150 -60 -200 0 -200 C 60 -200 140 -150 128 -10 C 136 80 150 170 160 260 L -160 260 C -150 170 -136 80 -128 -10 Z" fill="${o.hair}" ${st(7)}/>`;
  // corpo
  const robe = o.robe, dk = shade(robe, 0.8);
  g += `<path d="M -34 70 L -36 150 Q 0 168 36 150 L 34 70 Z" fill="${o.skin}" ${st(6)}/>`;
  g += `<path d="M -210 330 C -205 210 -150 150 -60 138 L -20 200 L 0 222 L 20 200 L 60 138 C 150 150 205 210 210 330 Z" fill="${robe}" ${st(7)}/>`;
  g += `<path d="M 60 138 C 150 150 205 210 210 330 L 120 330 C 120 240 100 180 60 138 Z" fill="${dk}" opacity="0.7"/>`;
  if (o.cloak) g += `<path d="M -210 330 C -205 230 -170 170 -110 150 L -90 200 C -130 230 -150 280 -150 330 Z" fill="${o.cloak}" ${st(6)}/><path d="M 210 330 C 205 230 170 170 110 150 L 90 200 C 130 230 150 280 150 330 Z" fill="${o.cloak}" ${st(6)}/>`;
  if (o.armor) g += `<path d="M -150 170 Q -100 140 -50 150 L -40 330 L -160 330 Z" fill="${C.ch200}" ${st(6)}/><path d="M 150 170 Q 100 140 50 150 L 40 330 L 160 330 Z" fill="${C.ch200}" ${st(6)}/>` + [0, 1, 2].map((i) => `<line x1="-145" y1="${200 + i * 40}" x2="-55" y2="${195 + i * 40}" stroke="${C.ch100}" stroke-width="5"/><line x1="145" y1="${200 + i * 40}" x2="55" y2="${195 + i * 40}" stroke="${C.ch100}" stroke-width="5"/>`).join('');
  if (o.necklace) for (let i = -4; i <= 4; i++) g += `<circle cx="${i * 13}" cy="${168 + Math.abs(i) * -4 + 22 - Math.abs(i) * 2}" r="7" fill="${i % 2 ? C.a300 : C.b500}" ${st(3)}/>`;
  if (o.belt) g += `<path d="M -170 300 L 170 300 L 172 326 L -172 326 Z" fill="#5A3A22" ${st(5)}/>`;
  // cabeça
  g += `<circle cx="0" cy="0" r="${R}" fill="${o.skin}" ${st(7)}/>`;
  g += `<path d="M 40 -100 A ${R} ${R} 0 0 1 40 100 A 130 130 0 0 0 40 -100 Z" fill="#000" opacity="0.08"/>`;
  g += `<ellipse cx="-62" cy="34" rx="20" ry="11" fill="${C.r400}" opacity="0.25"/><ellipse cx="62" cy="34" rx="20" ry="11" fill="${C.r400}" opacity="0.25"/>`;
  if (o.earrings) g += `<circle cx="-112" cy="34" r="13" fill="none" stroke="${C.a400}" stroke-width="6"/><circle cx="112" cy="34" r="13" fill="none" stroke="${C.a400}" stroke-width="6"/>`;
  // cabelo da frente / capacete / turbante
  if (o.longHair) g += `<path d="M -112 -10 C -118 -110 -60 -128 0 -128 C 60 -128 118 -110 112 -10 C 100 -60 60 -84 0 -84 C -60 -84 -100 -60 -112 -10 Z" fill="${o.hair}" ${st(6)}/>`;
  if (o.helmet) {
    g += `<path d="M -122 -56 C -122 -196 122 -196 122 -56 L 132 -44 L -132 -44 Z" fill="${o.helmet}" ${st(7)}/><path d="M -132 -44 L 132 -44 L 128 -28 L -128 -28 Z" fill="${shade(o.helmet, 0.8)}" ${st(5)}/>`;
    g += `<path d="M -8 -186 L -8 -224 Q 0 -234 8 -224 L 8 -186 Z" fill="${C.r600}" ${st(4)}/><path d="M -70 -136 Q 0 -166 70 -136" stroke="${shade(o.helmet, 1.15)}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  }
  if (o.cap) g += `<path d="M -112 -30 C -110 -130 110 -130 112 -30 C 70 -50 -70 -50 -112 -30 Z" fill="${o.cap}" ${st(6)}/>`;
  if (o.wild) {
    for (let i = 0; i < 11; i++) { const a = Math.PI * (1.05 + i * 0.09); g += `<path d="M ${f1(Math.cos(a) * 92)} ${f1(Math.sin(a) * 92)} q ${f1(Math.cos(a) * 30)} ${f1(Math.sin(a) * 50)} ${f1(Math.cos(a + 0.2) * 60)} ${f1(Math.sin(a + 0.2) * 60)}" stroke="${o.hair}" stroke-width="26" fill="none" stroke-linecap="round"/>`; }
    g += `<path d="M -104 -30 C -100 -120 100 -120 104 -30 C 80 -70 -80 -70 -104 -30 Z" fill="${o.hair}" ${st(5)}/>`;
  }
  if (o.beard) {
    g += `<path d="M -108 10 C -112 110 -50 160 0 160 C 50 160 112 110 108 10 C 90 60 60 70 0 70 C -60 70 -90 60 -108 10 Z" fill="${o.hair}" ${st(6)}/>`;
    g += `<path d="M -40 52 Q -20 40 0 48 Q 20 40 40 52" stroke="${o.hair}" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  }
  // olhos de ponto (e a parte branca quando há medo)
  const ey = -6 + ly;
  if (o.fear) g += `<circle cx="${-38 + lx}" cy="${ey}" r="22" fill="#fff" ${st(4)}/><circle cx="${38 + lx}" cy="${ey}" r="22" fill="#fff" ${st(4)}/>`;
  if (o.blink) g += `<path d="M ${-50 + lx} ${ey} Q ${-38 + lx} ${ey + 6} ${-26 + lx} ${ey}" stroke="${C.d1}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M ${26 + lx} ${ey} Q ${38 + lx} ${ey + 6} ${50 + lx} ${ey}" stroke="${C.d1}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  else g += `<circle cx="${-38 + lx * 1.3}" cy="${ey}" r="${o.fear ? 9 : 11}" fill="${C.d1}"/><circle cx="${38 + lx * 1.3}" cy="${ey}" r="${o.fear ? 9 : 11}" fill="${C.d1}"/>`;
  if (o.lids) g += `<path d="M ${-58 + lx} ${ey - 2} Q ${-38 + lx} ${ey - 16} ${-18 + lx} ${ey - 2} L ${-18 + lx} ${ey - 20} L ${-58 + lx} ${ey - 20} Z" fill="${o.skin}"/><path d="M ${18 + lx} ${ey - 2} Q ${38 + lx} ${ey - 16} ${58 + lx} ${ey - 2} L ${58 + lx} ${ey - 20} L ${18 + lx} ${ey - 20} Z" fill="${o.skin}"/><path d="M ${-58 + lx} ${ey - 2} Q ${-38 + lx} ${ey - 12} ${-18 + lx} ${ey - 2} M ${18 + lx} ${ey - 2} Q ${38 + lx} ${ey - 12} ${58 + lx} ${ey - 2}" stroke="${C.d1}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if (o.liner) {
    const k = o.liner;
    g += `<path d="M ${-56 + lx} ${ey - 4} Q ${-38 + lx} ${ey - 20} ${-18 + lx} ${ey - 6} M ${-56 + lx} ${ey - 4} L ${-56 - 18 * k + lx} ${ey - 16 - 10 * k}" stroke="${C.d1}" stroke-width="${f1(7 * k)}" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M ${56 + lx} ${ey - 4} Q ${38 + lx} ${ey - 20} ${18 + lx} ${ey - 6} M ${56 + lx} ${ey - 4} L ${56 + 18 * k + lx} ${ey - 16 - 10 * k}" stroke="${C.d1}" stroke-width="${f1(7 * k)}" fill="none" stroke-linecap="round"/>`;
  }
  const bw = (side, [tilt, up]) => { const cx = side * 38 + lx, y = (o.helmet ? -24 : -44) - up * 14; return `<line x1="${f1(cx - side * 22)}" y1="${f1(y + tilt * side * 0 + tilt * 9)}" x2="${f1(cx + side * 22)}" y2="${f1(y - tilt * 9)}" stroke="${o.browCol || C.d1}" stroke-width="10" stroke-linecap="round"/>`; };
  g += bw(-1, brow[0]) + bw(1, brow[1]);
  if (o.sweat) { const dy = ((o.t || 0) * 60) % 50; g += `<path d="M 104 ${f1(-70 + dy)} C 94 ${f1(-54 + dy)} 94 ${f1(-42 + dy)} 104 ${f1(-42 + dy)} C 114 ${f1(-42 + dy)} 114 ${f1(-54 + dy)} 104 ${f1(-70 + dy)} Z" fill="${C.b300}" ${st(4)}/>`; }
  // boca
  const my = o.beard ? 92 : 52, tk = o.talk || 0, m = o.mouth || 'flat';
  if (m === 'smirk') g += `<path d="M -30 ${my} Q 6 ${my + 10 + tk * 6} 34 ${my - 12}" stroke="${C.d1}" stroke-width="7" fill="none" stroke-linecap="round"/>` + (tk > 0.05 ? `<path d="M -22 ${my + 2} Q 4 ${my + 6 + tk * 26} 28 ${my - 6} Q 6 ${my + 8} -22 ${my + 2} Z" fill="#5A1F25" ${st(5)}/>` : '');
  else if (m === 'flat') g += `<line x1="-22" y1="${my}" x2="22" y2="${my}" stroke="${C.d1}" stroke-width="7" stroke-linecap="round"/>`;
  else if (m === 'frown') g += `<path d="M -26 ${my + 8} Q 0 ${my - 8} 26 ${my + 8}" stroke="${C.d1}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  else if (m === 'o') g += `<ellipse cx="0" cy="${my + 4}" rx="${f1(12 + tk * 4)}" ry="${f1(16 + tk * 6)}" fill="#3A1418" ${st(5)}/>`;
  else {
    const big = m === 'shout' ? 1 : 0.55, h = 10 + (big * 34) * (0.35 + 0.65 * tk), w = 26 + big * 18;
    g += `<path d="M ${-w} ${my - 4} Q 0 ${f1(my - 10)} ${w} ${my - 4} Q ${f1(w * 0.8)} ${f1(my + h)} 0 ${f1(my + h + 4)} Q ${f1(-w * 0.8)} ${f1(my + h)} ${-w} ${my - 4} Z" fill="#3A1418" ${st(5)}/>`;
    if (h > 18) g += `<path d="M ${f1(-w * 0.6)} ${my - 2} L ${f1(w * 0.6)} ${my - 2}" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>`;
  }
  // coroa por cima
  if (o.crown) g += crown(0, -138, 2.3, 0, C.a300, o.glint || 0);
  return g_(o.x, o.y, o.s || 1, g, o.rot || 0);
}
const jezFace = (o) => face({ robe: JZ.robe, skin: JZ.skin, hair: JZ.hair, longHair: true, earrings: true, necklace: true, ...o });
const jeuFace = (o) => face({ robe: JEU.robe, skin: JEU.skin, hair: JEU.hair, helmet: JEU.helm, beard: true, cloak: JEU.cloak, armor: true, ...o });

// Pessoa de corpo inteiro com boca (o person() do lib não tem boca).
function mouthOn(x, y, s, kind, tk = 0) {
  const my = y - 184 * s, w = 9 * s;
  if (kind === 'open' || kind === 'shout') return `<ellipse cx="${f1(x)}" cy="${f1(my + 2 * s)}" rx="${f1(w)}" ry="${f1((3 + 7 * tk) * s)}" fill="#3A1418" stroke="${OL}" stroke-width="${f1(2.5 * s)}"/>`;
  if (kind === 'smirk') return `<path d="M ${f1(x - w)} ${f1(my)} Q ${f1(x)} ${f1(my + 5 * s)} ${f1(x + w)} ${f1(my - 4 * s)}" stroke="${C.d1}" stroke-width="${f1(3.5 * s)}" fill="none" stroke-linecap="round"/>`;
  return `<line x1="${f1(x - w * 0.7)}" y1="${f1(my)}" x2="${f1(x + w * 0.7)}" y2="${f1(my)}" stroke="${C.d1}" stroke-width="${f1(3.5 * s)}" stroke-linecap="round"/>`;
}

// Braço de perto: manga do ombro à mão, mão redonda e, se apontar, o dedo.
function armTo(x0, y0, x1, y1, sleeve, skin, o = {}) {
  // ombro -> cotovelo -> mão; o cotovelo sai para o lado (bend) para o braço não virar vara
  const w = o.w || 84, L = Math.hypot(x1 - x0, y1 - y0), ang = Math.atan2(y1 - y0, x1 - x0);
  const bend = (o.bend ?? 0.22) * L, px = -Math.sin(ang), py = Math.cos(ang);
  const ex = (x0 + x1) / 2 + px * bend, ey = (y0 + y1) / 2 + py * bend;
  const fa = Math.atan2(y1 - ey, x1 - ex), hx = x1 - Math.cos(fa) * w * 0.35, hy = y1 - Math.sin(fa) * w * 0.35;
  const seg = (ax, ay, bx, by, c, ww) => `<line x1="${f1(ax)}" y1="${f1(ay)}" x2="${f1(bx)}" y2="${f1(by)}" stroke="${c}" stroke-width="${f1(ww)}" stroke-linecap="round"/>`;
  let s = seg(x0, y0, ex, ey, OL, w + 14) + seg(ex, ey, hx, hy, OL, w * 0.86 + 14) + seg(x0, y0, ex, ey, sleeve, w) + seg(ex, ey, hx, hy, sleeve, w * 0.86);
  s += `<path d="M ${f1(hx - px * 0 - Math.sin(fa) * w * 0.4)} ${f1(hy + Math.cos(fa) * w * 0.4)} L ${f1(hx + Math.sin(fa) * w * 0.4)} ${f1(hy - Math.cos(fa) * w * 0.4)}" stroke="${shade(sleeve, 0.72)}" stroke-width="14" stroke-linecap="round"/>`;
  s += `<circle cx="${f1(x1)}" cy="${f1(y1)}" r="${f1(w * 0.46)}" fill="${skin}" ${st(6)}/>`;
  if (o.point) { const fx = x1 + Math.cos(fa) * w * 0.95, fy = y1 + Math.sin(fa) * w * 0.95; s += seg(x1, y1, fx, fy, OL, w * 0.34) + seg(x1, y1, fx, fy, skin, w * 0.34 - 11) + `<circle cx="${f1(x1)}" cy="${f1(y1)}" r="${f1(w * 0.46 - 3)}" fill="${skin}"/>`; }
  if (o.tool) s += o.tool(x1, y1, fa);
  return s;
}
// poeira macia (sem contorno), para não virar bolinha
function puff(x, y, r, op, t, i) {
  const c = '#EAD8BE';
  return `<g opacity="${f1(op * 100) / 100}"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${c}"/><circle cx="${f1(x - r * 0.55 + Math.sin(t * 2 + i) * 4)}" cy="${f1(y + r * 0.2)}" r="${f1(r * 0.7)}" fill="${shade(c, 1.03)}"/><circle cx="${f1(x + r * 0.5)}" cy="${f1(y - r * 0.25)}" r="${f1(r * 0.6)}" fill="${shade(c, 0.96)}"/></g>`;
}

// ------------------------------------------------------------------ 1. Jeú chegando (plano aberto)
function scChegando(t) {
  const u = prog(t, 0, at(1) + 0.4);
  let s = `<rect x="-200" y="-200" width="1500" height="2400" fill="url(#jzSkyGold)"/>`;
  s += `<circle cx="820" cy="640" r="300" fill="url(#jzGlow)" opacity="0.5"/>` + sun(820, 640, 70, t);
  s += cloud(((120 + t * 10) % 1400) - 200, 330, 0.9, '#FFF4E4', '#EBCFB0') + cloud(((700 + t * 6) % 1400) - 200, 250, 0.6, '#FFF4E4', '#EBCFB0');
  s += hills(GROUND - 230, 90, 0.0028, 41, '#D9B48C') + hills(GROUND - 140, 70, 0.0042, 43, '#CFA57C');
  // Jezreel no alto do morro, com a torre da sentinela (2 Reis 9:17) e bandeiras
  s += `<path d="M 60 ${GROUND - 20} C 220 ${GROUND - 210} 560 ${GROUND - 230} 760 ${GROUND - 20} Z" fill="#C79A6E" ${st(5)}/>`;
  s += city(410, GROUND - 150, 0.62, t);
  s += `<rect x="560" y="${GROUND - 380}" width="70" height="240" fill="${C.g300}" ${st(5)}/>` + [0, 1, 2].map((i) => rect(556 + i * 28, GROUND - 400, 18, 22, C.g300, st(4))).join('');
  s += person({ x: 595, y: GROUND - 380, s: 0.32, ...man(711), armR: 120 + Math.sin(t * 6) * 10, noShadow: true });
  s += banner(250, GROUND - 330, 70, t, JZ.robe) + banner(470, GROUND - 350, 70, t + 1, JZ.robe);
  s += birds(t, 5, 380, 7);
  // estrada e campo, com palmeiras em profundidade
  s += floor('day', 0, GROUND - 20);
  s += `<path d="M -200 1900 C 200 1500 520 1200 700 ${GROUND - 10}" fill="none" stroke="#EAD9C2" stroke-width="150" stroke-linecap="round"/>`;
  s += palm(120, GROUND + 40, 0.55, t) + palm(930, GROUND + 70, 0.7, t + 1);
  // o carro de Jeú vem correndo, com nuvem de poeira atrás
  const x = lerp(1180, 640, u), y = lerp(1250, 1040, u), sc = lerp(0.78, 0.4, u);
  for (let i = 0; i < 9; i++) {
    const k = i / 9, px = x + (180 + k * 380) * sc, py = y - 20 * sc - k * 50 * sc;
    s += puff(px + Math.sin(t * 3 + i) * 10, py, (40 + k * 90) * sc, 0.8 - k * 0.65, t, i);
  }
  const rider = person({ x: -20, y: -90, s: 0.9, robe: JEU.robe, skin: JEU.skin, hair: JEU.hair, beard: true, mood: 'angry', armR: 100, gear: { helmet: 'isr' }, noShadow: true });
  s += chariot(x, y, sc, { horse: true, flip: true, gallop: t * 11, spin: -t * 6, rider, fill: '#9A7B57' });
  s += palm(-40, 1500, 1.3, t) + palm(1150, 1560, 1.15, t + 2);
  return out(cam(s, 600, 1000, 1.0 + 0.06 * E.sine(u)));
}

// ------------------------------------------------------------------ 2. o quarto: pintou os olhos, arrumou o cabelo
function room(t) {
  let s = rect(-100, -100, 1300, 2200, '#B5715A');
  // tapeçaria com padrão
  s += rect(60, 260, 960, 760, '#7E2E36', st(6));
  for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) {
    const x = 120 + c * 120, y = 320 + r * 120;
    s += `<path d="M ${x} ${y - 34} L ${x + 34} ${y} L ${x} ${y + 34} L ${x - 34} ${y} Z" fill="${(r + c) % 2 ? '#A2464C' : '#C68A3A'}" stroke="#5A1F25" stroke-width="3"/>`;
  }
  s += rect(60, 260, 960, 36, C.a400, st(5)) + rect(60, 984, 960, 36, C.a400, st(5));
  s += rect(-100, 1180, 1300, 900, 'url(#jzFloorRoom)', st(6));
  for (let i = 0; i < 9; i++) s += `<line x1="${-100 + i * 160}" y1="1180" x2="${-300 + i * 200}" y2="2000" stroke="#4E3226" stroke-width="3"/>`;
  return s;
}
function scEspelho(t) {
  const [p1, p2, p3] = SEGS[1][3];
  // plano 1 e 2: close dela na penteadeira; plano 3: ela vai até a janela
  if (t < p3[0] - 0.12) {
    let s = room(t);
    s += lamp(160, 1150, 1.1, t) + motes(t, 0, 300, 1080, 900, 26, 3);
    const liner = E.out(prog(t, p1[0] - 0.1, p1[1]));
    const crowned = t > p2[0] + 0.2;
    const fix = prog(t, p2[0], p2[1]);
    const smile = t > p2[0];
    s += jezFace({ x: 540, y: 760, s: 2.1, liner, look: 0.2, lids: smile, mouth: smile ? 'smirk' : 'flat', brow: smile ? [[0.2, 0.2], [-0.4, 0.6]] : [[0, 0.2], [0, 0.2]], crown: crowned, glint: crowned ? clamp(1 - prog(t, p2[0] + 0.2, p2[0] + 0.7)) : 0, blink: blink(t, 2) && t > p2[1] });
    // mão com o pincel de kohl
    if (t < p1[1] + 0.2) {
      const hx = lerp(860, 700, liner), hy = lerp(1300, 740, E.out(prog(t, p1[0] - 0.3, p1[0] + 0.2)));
      s += armTo(870, 1360, hx, hy + 40, shade(JZ.robe, 0.85), JZ.skin, { w: 78, tool: (x, y) => `<line x1="${f1(x - 6)}" y1="${f1(y - 8)}" x2="${f1(x - 70)}" y2="${f1(y - 70)}" stroke="${C.d1}" stroke-width="12" stroke-linecap="round"/>` });
    }
    // mão ajeitando o cabelo
    if (fix > 0 && fix < 1) {
      const hy = 560 + Math.sin(fix * Math.PI * 2) * 30;
      s += armTo(230, 1360, 300, hy + 60, shade(JZ.robe, 0.85), JZ.skin, { w: 78 });
    }
    // penteadeira em primeiro plano, com o pote de kohl e o espelho
    s += rect(-40, 1140, 1160, 70, '#6B4A33', st(6)) + kohlPot(820, 1140, 1.3, 0) + mirror(180, 1010, 0.9);
    s += `<circle cx="960" cy="1120" r="18" fill="${C.a300}" ${st(4)}/><circle cx="1000" cy="1126" r="12" fill="${C.b500}" ${st(4)}/>`;
    return out(cam(s, 540, 900, lerp(1.08, 1.0, prog(t, p1[0], p2[1]))));
  }
  // plano 3: ela atravessa o quarto até a janela, com a luz entrando
  const go = E.inOut(prog(t, p3[0], p3[1] + 0.2));
  let s = room(t);
  s += `<path d="M 640 1180 L 640 560 A 170 170 0 0 1 980 560 L 980 1180 Z" fill="#CFE3F7" ${st(8)}/>` + sun(820, 620, 46, t);
  s += `<path d="M 640 560 L 980 560 L 1100 1900 L 300 1900 Z" fill="url(#jzBeam)" opacity="0.8"/>`;
  s += curtain(560, 400, 140, 800, t, '#C68A3A') + curtain(920, 400, 140, 800, t + 1, '#C68A3A', -1);
  s += motes(t, 500, 560, 600, 900, 30, 9);
  s += lamp(150, 1180, 1.0, t);
  const x = lerp(300, 720, go);
  s += person({ robe: JZ.robe, skin: JZ.skin, hair: JZ.hair, cover: null, x, y: 1260, s: 1.9, look: 1, liner: 1, mood: 'calm', gear: { crown: true }, walk: go > 0 && go < 1 ? t * 7 : null });
  s += mouthOn(x, 1260, 1.9, 'smirk');
  return out(cam(s, 600, 1000, 1.0));
}

// ------------------------------------------------------------------ 3. o filho dela, o rei (campo de Nabote)
function scJorao(t) {
  const u = prog(t, at(2), at(3));
  let s = `<rect x="-200" y="-200" width="1500" height="2400" fill="url(#jzSkyRed)"/>`;
  s += `<circle cx="300" cy="${GROUND - 40}" r="380" fill="url(#jzGlow)" opacity="0.45"/>` + sun(300, GROUND - 60, 80, t);
  s += hills(GROUND - 150, 70, 0.0034, 61, '#7A3B33') + hills(GROUND - 60, 50, 0.0052, 63, '#5F2E29');
  s += `<rect x="-200" y="${GROUND}" width="1500" height="1200" fill="#4A2A24"/>`;
  // videira do campo de Nabote (2 Reis 9:25-26), em fileiras
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { const x = c * 180 - r * 60 + 40, y = GROUND + 40 + r * 70, k = 0.5 + r * 0.25; s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 70 * k}" stroke="#2A1814" stroke-width="${6 * k}"/><circle cx="${x - 14 * k}" cy="${y - 70 * k}" r="${22 * k}" fill="#3E5A2E" stroke="#1E140F" stroke-width="3"/><circle cx="${x + 16 * k}" cy="${y - 64 * k}" r="${18 * k}" fill="#355028" stroke="#1E140F" stroke-width="3"/>`; }
  // o carro tombado, a roda solta e a flecha na terra
  s += `<g transform="rotate(-24 800 1150)">${chariot(800, 1150, 0.75, { fill: '#7B5D45', ol: '#1E140F' })}</g>`;
  s += `<g transform="translate(420 1230) rotate(${f1(30 + Math.sin(t * 2) * 3)})"><circle r="56" fill="#6E5440" stroke="#1E140F" stroke-width="6"/><circle r="44" fill="none" stroke="#4A3526" stroke-width="7"/>${[0, 1, 2].map((k) => `<line x1="${f1(Math.cos(k) * -42)}" y1="${f1(Math.sin(k) * -42)}" x2="${f1(Math.cos(k) * 42)}" y2="${f1(Math.sin(k) * 42)}" stroke="#4A3526" stroke-width="6"/>`).join('')}</g>`;
  s += crown(560, 1200, 1.7, -16, C.a400, 0.4 + 0.4 * Math.sin(t * 4));
  s += arrow(700, 1228, 64, 1.2, '#1E140F');
  s += birds(t, 4, 420, 21, '#1E140F');
  return out(cam(s, 600, 1170, 1.35 + 0.12 * E.sine(u)), { vig: 1.2 });
}

// ------------------------------------------------------------------ 4. a janela do palácio (plano aberto)
const WINB = { x: 700, y: 300, w: 300, h: 380 }, WINS = { x: 330, y: 380, w: 200, h: 270 };
function archPath(wd) { const { x, y, w, h } = wd; return `M ${x - w / 2} ${y + h} L ${x - w / 2} ${y + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${y + w / 2} L ${x + w / 2} ${y + h} Z`; }
function facade(t, inBig = '', inSmall = '', dusk = false) {
  const pal = dusk ? { base: '#5A4438', line: '#2A1E18', hi: '#6E5446' } : { base: '#E3CDB4', line: '#9C8268', hi: '#F4E6D4' };
  let s = `<rect x="-200" y="-200" width="1500" height="2400" fill="url(#${dusk ? 'jzSkyDusk' : 'jzSkyDay'})"/>`;
  s += stoneWall(-60, 120, 1140, GROUND + 60, pal, 77);
  s += `<rect x="-60" y="110" width="1200" height="40" fill="${shade(pal.base, 0.85)}" ${st(6)}/>`;
  for (let i = 0; i < 9; i++) s += rect(-40 + i * 140, 60, 80, 56, shade(pal.base, 0.9), st(5));
  [WINB, WINS].forEach((wd, i) => {
    const d = archPath(wd);
    s += `<clipPath id="jzw${i}"><path d="${d}"/></clipPath><path d="${d}" fill="${dusk ? '#120C0A' : '#2B2320'}"/><g clip-path="url(#jzw${i})">${i ? inSmall : inBig}</g>`;
    s += `<path d="${d}" fill="none" stroke="${OL}" stroke-width="9"/><rect x="${wd.x - wd.w / 2 - 26}" y="${wd.y + wd.h - 6}" width="${wd.w + 52}" height="34" rx="9" fill="${shade(pal.base, 0.8)}" ${st(6)}/>`;
  });
  if (!dusk) s += banner(120, 160, 120, t, JZ.robe) + banner(960, 160, 120, t + 1.2, JZ.robe);
  // trepadeira no muro
  s += `<path d="M 1040 ${GROUND + 40} C 1000 800 1060 700 1010 560 C 980 480 1020 420 1000 360" stroke="#4E6B3A" stroke-width="10" fill="none" stroke-linecap="round"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<ellipse cx="${1010 + (i % 2 ? 22 : -20)}" cy="${900 - i * 90}" rx="22" ry="12" fill="${i % 2 ? '#5F7F45' : '#6E8A4A'}" ${st(3)} transform="rotate(${i % 2 ? 30 : -30} ${1010 + (i % 2 ? 22 : -20)} ${900 - i * 90})"/>`).join('');
  return s;
}
function jezAtWindow(t, o = {}) {
  return person({ robe: JZ.robe, skin: JZ.skin, hair: JZ.hair, x: WINB.x, y: WINB.y + WINB.h + 120, s: 1.25, liner: 1, look: o.look ?? 0.3, mood: o.mood || 'calm', lean: o.lean || 0, gear: { crown: true }, noShadow: true, armR: o.armR, t }) + mouthOn(WINB.x, WINB.y + WINB.h + 120, 1.25, o.mouth || 'smirk', o.talk || 0);
}
function scPortao(t) {
  const a0 = at(3), pass = E.inOut(prog(t, a0 + 0.2, seg(4) - 0.2));
  let s = facade(t, jezAtWindow(t, { lean: t > seg(3) + 1.2 ? 6 : 0 }), '');
  // portão de madeira com cravos
  s += `<path d="M 100 ${GROUND + 60} L 100 820 A 150 150 0 0 1 400 820 L 400 ${GROUND + 60} Z" fill="#6B4A33" ${st(8)}/>`;
  for (let i = 0; i < 4; i++) s += `<line x1="${130 + i * 80}" y1="760" x2="${130 + i * 80}" y2="${GROUND + 60}" stroke="#4E3424" stroke-width="5"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) s += `<circle cx="${150 + c * 70}" cy="${860 + r * 70}" r="7" fill="${C.ch300}"/>`;
  s += floor('day', 0, GROUND + 60);
  const cx = lerp(1260, 640, pass);
  const rider = person({ x: -20, y: -90, s: 0.95, robe: JEU.robe, skin: JEU.skin, hair: JEU.hair, beard: true, mood: 'angry', gear: { helmet: 'isr' }, noShadow: true, look: pass > 0.95 ? 1 : 0 });
  s += chariot(cx, 1270, 0.95, { horse: true, flip: true, gallop: pass < 1 ? t * 10 : null, spin: -t * 5 * (pass < 1 ? 1 : 0), rider, fill: '#9A7B57' });
  if (pass < 1) for (let i = 0; i < 5; i++) s += puff(cx + 230 + i * 60, 1245 - i * 6, 34 + i * 12, (0.7 - i * 0.12) * (1 - pass * 0.6), t, i);
  return out(cam(s, 640, 800, 1.0 + 0.04 * prog(t, a0, seg(4))));
}
// close dela na janela: "Como vai, assassino?"
function scProvoca(t) {
  let s = facade(t, '', '');
  const tk = talk(t, seg(4), SEGS[4][1]);
  const inner = `<rect x="-400" y="-400" width="800" height="900" fill="#2B2320"/>` + jezFace({ x: 0, y: 60, s: 1.05, liner: 1, lids: true, look: 0.6, lookY: 0.6, mouth: 'smirk', talk: tk, brow: [[0.3, 0.3], [-0.5, 0.8]], crown: true });
  s = `<rect x="-200" y="-200" width="1500" height="2400" fill="url(#jzSkyDay)"/>` + stoneWall(-60, -100, 1140, 2000, { base: '#E3CDB4', line: '#9C8268', hi: '#F4E6D4' }, 78);
  const d = `M 190 1230 L 190 620 A 350 350 0 0 1 890 620 L 890 1230 Z`;
  s += `<clipPath id="jzwc"><path d="${d}"/></clipPath><g clip-path="url(#jzwc)">${g_(540, 830, 1.9, inner)}</g><path d="${d}" fill="none" stroke="${OL}" stroke-width="12"/>`;
  s += `<rect x="140" y="1220" width="800" height="60" rx="12" fill="#C9B194" ${st(8)}/>`;
  s += banner(60, 300, 140, t, JZ.robe);
  return out(cam(s, 540, 900, 1.0 + 0.03 * prog(t, seg(4), SEGS[4][1])));
}

// ------------------------------------------------------------------ 5. Jeú olha para cima e grita
function jeuClose(t, o) {
  let s = `<rect x="-200" y="-200" width="1500" height="2400" fill="url(#jzSkyDay)"/>`;
  s += cloud(((300 + t * 12) % 1400) - 200, 360, 1.1, '#FFFFFF', '#D9E2EA');
  // o muro visto de baixo, em diagonal
  s += `<g transform="rotate(-8 540 700)">${stoneWall(-200, 80, 760, 1100, { base: '#E3CDB4', line: '#9C8268', hi: '#F4E6D4' }, 79)}</g>`;
  s += jeuFace({ x: 600, y: 800, s: 2.0, t, ...o });
  return s;
}
function scJeu(t) {
  const [q1, q2] = SEGS[5][3];
  const grita = t > wordTime(5, 'gritou') - 0.08;
  const tk = grita ? talk(t, wordTime(5, 'gritou') - 0.1, SEGS[6][1] + 0.1) : 0;
  const s = jeuClose(t, { look: -0.4, lookY: -1, mouth: grita ? 'shout' : 'flat', talk: tk, brow: grita ? [[1, 0], [1, 0]] : [[0.4, 0], [-0.5, 0.8]], blink: blink(t, 1) && !grita });
  // braço erguido quando grita
  let arm = '';
  if (t > SEGS[6][0] - 0.2) { const up = E.back(prog(t, SEGS[6][0] - 0.2, SEGS[6][0] + 0.15)); arm = armTo(890, 1150, lerp(900, 980, up), lerp(1150, 860, up), JEU.cloak, JEU.skin, { w: 90 }); }
  return out(cam(s + arm, 600, 900, 1.0 + 0.05 * prog(t, seg(5), SEGS[6][1])) + (grita ? `<g opacity="0.5">${[0, 1, 2].map((i) => `<path d="M ${f1(760 + i * 16)} ${f1(800 - i * 60)} q 40 -20 80 0" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round" opacity="${f1(0.5 + 0.5 * Math.sin(t * 20 + i))}"/>`).join('')}</g>` : ''));
}

// ------------------------------------------------------------------ 6. os funcionários aparecem
function scServos(t) {
  const t0 = seg(7);
  const official = (dx, d, seed, sk) => {
    const p = E.out(prog(t, t0 + d, t0 + d + 0.5));
    if (p <= 0) return '';
    const look = Math.sin(t * 2 + seed) > 0 ? 0.6 : -0.6;
    return face({ x: dx, y: lerp(620, 260, p), s: 0.62, robe: ['#B5A399', '#9C8268', '#C9BBAE'][seed % 3], skin: sk, hair: '#2F2622', cap: ['#E2D8CF', '#7B7471', '#D1C6BF'][seed % 3], fear: true, sweat: true, t, look, mouth: 'o', brow: [[-0.8, 0.6], [-0.8, 0.6]], blink: blink(t, seed) });
  };
  const inner = `<rect x="-300" y="-100" width="600" height="900" fill="#2B2320"/>` + official(-60, 0.0, 1, '#A86B3C') + official(70, 0.35, 2, '#E0AC69') + official(10, 0.75, 3, '#8D5524');
  let s = `<rect x="-200" y="-200" width="1500" height="2400" fill="url(#jzSkyDay)"/>` + stoneWall(-60, -100, 1140, 2000, { base: '#E3CDB4', line: '#9C8268', hi: '#F4E6D4' }, 80);
  const d = `M 230 1220 L 230 660 A 310 310 0 0 1 850 660 L 850 1220 Z`;
  s += `<clipPath id="jzws"><path d="${d}"/></clipPath><g clip-path="url(#jzws)">${g_(540, 640, 1.5, inner)}</g><path d="${d}" fill="none" stroke="${OL}" stroke-width="12"/>`;
  s += `<rect x="180" y="1210" width="720" height="60" rx="12" fill="#C9B194" ${st(8)}/>`;
  return out(cam(s, 540, 900, 1.0));
}

// ------------------------------------------------------------------ 7. "Joguem essa mulher lá embaixo."
function scOrdem(t) {
  const tk = talk(t, seg(8), SEGS[8][1]);
  let s = jeuClose(t, { look: -0.3, lookY: -1, mouth: 'shout', talk: tk, brow: [[1.1, 0], [1.1, 0]] });
  // o dedo apontando para cima
  { const up = E.back(prog(t, seg(8) - 0.1, seg(8) + 0.25)); s += armTo(320, 1150, lerp(320, 220, up), lerp(1150, 860, up), JEU.cloak, JEU.skin, { w: 90, point: up > 0.6 }); }
  return out(cam(s, 540, 900, 1.06 + 0.04 * prog(t, seg(8), SEGS[8][1])));
}

// ------------------------------------------------------------------ 8. "E eles jogaram." (a queda fica fora da tela)
function scJogaram(t) {
  const tJ = wordTime(9, 'jogaram') - 0.1;
  const shock = t > seg(9) - 0.1;
  const inner = `<rect x="-400" y="-400" width="800" height="900" fill="#2B2320"/>` + jezFace({ x: 0, y: 60, s: 1.05, liner: 1, fear: shock, mouth: shock ? 'o' : 'smirk', talk: 0.8, brow: shock ? [[-0.8, 1], [-0.8, 1]] : [[0.3, 0.3], [-0.5, 0.8]], crown: !shock || t < tJ, rot: shock ? -6 : 0 });
  let s = `<rect x="-200" y="-200" width="1500" height="2400" fill="url(#jzSkyDay)"/>` + stoneWall(-60, -100, 1140, 2000, { base: '#E3CDB4', line: '#9C8268', hi: '#F4E6D4' }, 78);
  const d = `M 190 1230 L 190 620 A 350 350 0 0 1 890 620 L 890 1230 Z`;
  const shake = shock ? Math.sin(t * 60) * 6 : 0;
  s += `<clipPath id="jzwj"><path d="${d}"/></clipPath><g clip-path="url(#jzwj)">${g_(540 + shake, 830, 1.9, inner)}</g><path d="${d}" fill="none" stroke="${OL}" stroke-width="12"/>`;
  // as mãos dos funcionários entrando pelos lados
  const h = E.out(prog(t, seg(9) - 0.1, seg(9) + 0.25));
  if (h > 0) s += armTo(-40, 1420, lerp(60, 330, h), lerp(1400, 1150, h), '#B5A399', '#A86B3C', { w: 80, bend: -0.25 }) + armTo(1120, 1420, lerp(1020, 750, h), lerp(1400, 1150, h), '#9C8268', '#8D5524', { w: 80, bend: 0.25 });
  s += `<rect x="140" y="1220" width="800" height="60" rx="12" fill="#C9B194" ${st(8)}/>`;
  // a coroa cai em câmera lenta e a cena corta para preto
  const f = prog(t, tJ, tJ + 0.6);
  if (f > 0) s += crown(lerp(540, 620, f), lerp(560, 1500, E.in(f)), 2.4, f * 140, C.a300, 0.8);
  s += `<rect x="-20" y="-20" width="${W + 40}" height="${H + 40}" fill="#000" opacity="${f1(E.in(prog(t, tJ + 0.25, tJ + 0.7)) * 100) / 100}"/>`;
  return out(cam(s, 540, 900, 1.0 + 0.05 * prog(t, seg(9) - 0.2, tJ)));
}

// ------------------------------------------------------------------ 9. o pátio ao anoitecer
function scPatio(t) {
  const u = prog(t, SEGS[9][1] + 0.5, at(11));
  let s = facade(t, '', '', true);
  s += `<rect x="-200" y="${GROUND + 60}" width="1500" height="1200" fill="#2A1E18"/>`;
  for (let i = 0; i < 14; i++) { const r = rng(900 + i); s += `<ellipse cx="${f1(r() * 1100)}" cy="${f1(GROUND + 120 + r() * 500)}" rx="${f1(30 + r() * 40)}" ry="${f1(10 + r() * 10)}" fill="#3A2A22" stroke="#120C0A" stroke-width="3"/>`; }
  // o que ficou no chão: a coroa, o pote de kohl quebrado, o véu
  s += `<path d="M 300 1250 Q 420 1200 540 1240 Q 640 1270 720 1230 L 760 1270 Q 600 1310 420 1290 Q 330 1285 300 1250 Z" fill="${shade(JZ.robe, 0.7)}" stroke="#120C0A" stroke-width="5"/>`;
  s += crown(560, 1200, 1.5, 24, C.a400, 0.3 + 0.3 * Math.sin(t * 3)) + kohlPot(820, 1250, 1.0, 70);
  // os funcionários com a tocha, olhando para baixo (2 Reis 9:34-35)
  const tl = (x, seed, flip) => person({ ...man(seed), x, y: 1200, s: 1.3, mood: 'sad', look: flip ? -0.6 : 0.6, armR: flip ? 14 : 150, noShadow: true, flip });
  s += `<circle cx="300" cy="960" r="230" fill="url(#jzGlow)" opacity="${f1((0.55 + 0.1 * Math.sin(t * 13)) * 100) / 100}"/>`;
  s += tl(230, 610, false) + tl(890, 611, true);
  { const hx = 230 + (34 + 86 * Math.sin(150 * Math.PI / 180)) * 1.3, hy = 1200 + (-154 + 86 * Math.cos(150 * Math.PI / 180)) * 1.3; s += `<line x1="${f1(hx)}" y1="${f1(hy + 70)}" x2="${f1(hx)}" y2="${f1(hy - 70)}" stroke="${OL}" stroke-width="16" stroke-linecap="round"/><line x1="${f1(hx)}" y1="${f1(hy + 70)}" x2="${f1(hx)}" y2="${f1(hy - 70)}" stroke="${C.wood}" stroke-width="8" stroke-linecap="round"/><circle cx="${f1(hx)}" cy="${f1(hy)}" r="14" fill="#E0AC69" ${st(4)}/><path d="M ${f1(hx)} ${f1(hy - 72)} C ${f1(hx - 22)} ${f1(hy - 100)} ${f1(hx)} ${f1(hy - 130)} ${f1(hx)} ${f1(hy - 160 + Math.sin(t * 15) * 8)} C ${f1(hx + 18)} ${f1(hy - 120)} ${f1(hx + 24)} ${f1(hy - 96)} ${f1(hx)} ${f1(hy - 72)} Z" fill="#FFB43C" ${st(4)}/>`; s = s.replace('cx="300" cy="960" r="230"', `cx="${f1(hx)}" cy="${f1(hy - 100)}" r="230"`); }
  // cães ao longe, saindo de cena
  s += dog(lerp(1000, 1250, u), 1010, 0.6, '#0E0A08', t) + dog(lerp(860, 1120, u), 1030, 0.5, '#0E0A08', t + 1);
  return out(cam(s, 560, 1050, 1.0 + 0.05 * E.sine(u)), { vig: 1.3 });
}

// ------------------------------------------------------------------ 10. anos antes, Elias (1 Reis 21:23), em sépia
function scElias(t) {
  const u = prog(t, at(12), at(13));
  let s = `<rect x="-200" y="-200" width="1500" height="2400" fill="#F3E3C3"/>` + hills(GROUND - 120, 60, 0.004, 33, '#D9C29A') + floor('day', 0, GROUND - 20);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) { const x = c * 200 + r * 80 + 20, y = GROUND + 20 + r * 60; s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 60}" stroke="#5A4630" stroke-width="6"/><circle cx="${x - 12}" cy="${y - 62}" r="20" fill="#7E8A5A" ${st(3)}/><circle cx="${x + 14}" cy="${y - 56}" r="16" fill="#6E7A4A" ${st(3)}/>`; }
  // Acabe recua, assustado; Elias aponta
  s += person({ robe: '#4B3A6B', skin: '#C68B59', hair: '#2F2622', beard: true, x: 300, y: 1230, s: 1.25, mood: 'fear', look: 1, gear: { crown: true }, lean: -6, t, armL: 40 });
  const tk = talk(t, seg(12), SEGS[12][1], 0.8);
  s += face({ x: 760, y: 820, s: 1.25, robe: '#7A5A3A', skin: '#A86B3C', hair: '#4A3426', wild: true, beard: true, belt: true, mouth: 'open', talk: tk, brow: [[0.9, 0], [0.9, 0]], look: -0.7 });
  s += armTo(640, 1030, 500, 900, '#7A5A3A', '#A86B3C', { w: 62, point: true });
  // moldura de lembrança: sépia, bordas queimadas e grão
  const film = `<rect x="-20" y="-20" width="${W + 40}" height="${H + 40}" fill="none" stroke="#2A1E14" stroke-width="90" opacity="0.55"/>` + motes(t, 0, 0, W, H, 40, 5, '#3A2A1A');
  return { svg: LOCAL_DEFS + `<g filter="url(#jzSepia)">${cam(s, 540, 1000, 1.04 - 0.04 * u)}</g>` + film + vig(1.4), html: '' };
}

// ------------------------------------------------------------------ 11. a última palavra
function scUltima(t) {
  const ti = [wordTime(13, 'palácio'), wordTime(13, 'coroa'), wordTime(13, 'maquiagem')];
  const gone = E.in(prog(t, seg(14), seg(14) + 0.8));
  let s = `<rect x="-20" y="-20" width="${W + 40}" height="${H + 40}" fill="#1A1412"/>`;
  s += `<ellipse cx="540" cy="900" rx="560" ry="520" fill="url(#jzSpot)" opacity="${f1((1 - gone * 0.6) * 100) / 100}"/>`;
  s += rect(-20, 1060, W + 40, 70, '#4A3426', st(6)) + rect(-20, 1130, W + 40, 900, '#2A1E18');
  const items = [
    (x, y) => `<g transform="translate(${x} ${y + 60}) scale(0.4)">${city(0, 0, 1, t)}</g>`,
    (x, y) => crown(x, y - 30, 2.1, 0, C.a300, 0.6),
    (x, y) => kohlPot(x, y + 60, 2.0, 0),
  ];
  items.forEach((f, i) => {
    const p = pop(t, ti[i] - 0.1, 0.45), ix = 230 + i * 310;
    if (p > 0) s += `<g opacity="${f1(clamp(p) * (1 - gone) * 100) / 100}" transform="translate(${ix} 1000) scale(${f1(p * 100) / 100}) translate(${-ix} -1000)">${f(ix, 1000)}</g>`;
  });
  // o rolo se abre com luz: a palavra que se cumpriu
  const b = E.out(prog(t, wordTime(14, 'palavra') - 0.2, wordTime(14, 'palavra') + 0.6));
  if (b > 0) {
    const w = 120 + 520 * b;
    s += `<circle cx="540" cy="860" r="${f1(380 * b)}" fill="url(#jzGlow)" opacity="${f1(b * 0.8 * 100) / 100}"/>`;
    s += `<rect x="${f1(540 - w / 2)}" y="760" width="${f1(w)}" height="230" fill="#F4E6C8" ${st(6)}/>` + [0, 1, 2, 3].map((i) => `<line x1="${f1(540 - w / 2 + 40)}" y1="${806 + i * 44}" x2="${f1(540 + w / 2 - 40 - (i % 2) * 60)}" y2="${806 + i * 44}" stroke="#B8A27A" stroke-width="7" stroke-linecap="round" opacity="${f1(b * 100) / 100}"/>`).join('');
    s += `<rect x="${f1(540 - w / 2 - 34)}" y="740" width="40" height="270" rx="18" fill="${C.wood}" ${st(6)}/><rect x="${f1(540 + w / 2 - 6)}" y="740" width="40" height="270" rx="18" fill="${C.wood}" ${st(6)}/>`;
  }
  return out(s, { vig: 1.2 });
}

const scFim = (t) => endCard(t, AUDIO_END + 0.2, ['1 Reis 21', '2 Reis 9']);

// ------------------------------------------------------------------ linha do tempo (cortes secos entre planos, como na referência)
const SCENES = [
  { a: 0, b: at(1), f: scChegando, ref: '2 Reis 9:30' },
  { a: at(1), b: at(2), f: scEspelho, ref: null, cut: true, dark: true },
  { a: at(2), b: at(3), f: scJorao, ref: '2 Reis 9:24', dark: true },
  { a: at(3), b: seg(4) - 0.15, f: scPortao, ref: '2 Reis 9:31', cut: true },
  { a: seg(4) - 0.15, b: at(5), f: scProvoca, ref: null, cut: true },
  { a: at(5), b: at(7), f: scJeu, ref: '2 Reis 9:32', cut: true, dark: true },
  { a: at(7), b: at(8), f: scServos, ref: null, cut: true },
  { a: at(8), b: at(9), f: scOrdem, ref: '2 Reis 9:33', cut: true, dark: true },
  { a: at(9), b: SEGS[9][1] + 0.5, f: scJogaram, ref: null, cut: true, dark: (t) => t > wordTime(9, 'jogaram') + 0.3 },
  { a: SEGS[9][1] + 0.5, b: at(12), f: scPatio, ref: '2 Reis 9:35', dark: true },
  { a: at(12), b: at(13), f: scElias, ref: '1 Reis 21:23' },
  { a: at(13), b: AUDIO_END + 0.2, f: scUltima, ref: null, dark: true },
  { a: AUDIO_END + 0.2, b: DURATION + 1, f: scFim, ref: null, end: true },
];
