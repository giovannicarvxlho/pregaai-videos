// O nascimento de Jesus em 7 cenas. Vídeo longo, 1920×1080, no molde do viral das 7 frases.
// L(parte, linha) é o índice da frase em SEGS (as partes do narracao.txt).
// Peças de outros episódios copiadas aqui: anjo e caído (depois-da-cruz), casa (lucas-15-perdidos),
// templo e pomba (tentacoes-de-jesus), cajado (eu-sou), pretório e placa (sete-frases-na-cruz).

const L = (part, line) => PARTS[part - 1] + line;
const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];
const wt = (i, w, d = 0) => wordTime(i, w) + d;
const FLOOR_Y = 880; // pés de quem está em primeiro plano (a legenda começa em ~920)
const SIL = '#16110F';
const NOITE_OL = '#0E0D0C';
// No curto vertical (layout foco) a janela é uma fatia de ~607 px da cena; a legenda cobre y ~360-430 e o app cobre y > ~840.
// As cenas de cartão têm uma versão em coluna para essa faixa (VERT).
const VERT = typeof FOCO !== 'undefined' && FOCO;
// Quadro com uma cena dentro: desenha inner (feito para o retângulo src [x, y, w, h]) no retângulo dst.
function quadroEm(inner, src, dst, id, o = {}) {
  const k = dst[2] / src[2], tx = dst[0] - src[0] * k, ty = dst[1] - src[1] * k;
  return `<clipPath id="${id}"><rect x="${f1(dst[0])}" y="${f1(dst[1])}" width="${f1(dst[2])}" height="${f1(dst[3])}" rx="${f1(36 * k)}"/></clipPath><g clip-path="url(#${id})"><g transform="translate(${f1(tx)} ${f1(ty)}) scale(${f1(k * 1000) / 1000})">${inner}</g></g><rect x="${f1(dst[0])}" y="${f1(dst[1])}" width="${f1(dst[2])}" height="${f1(dst[3])}" rx="${f1(36 * k)}" fill="none" stroke="${o.hl ? C.b500 : C.ink}" stroke-width="${o.hl ? 8 : 6}"/>`;
}

// ---------------------------------------------------------------- personagens
const MARIA = { robe: '#E9E1D8', skin: '#C68B59', hair: '#3A2A20', beard: false, cover: '#4F7FAF' };
const JOSE = { robe: '#8A6A4D', skin: '#B97A4A', hair: '#2F2622', beard: true, cover: '#C9BBAE' };
const ANJO = { robe: '#FFFFFF', skin: '#E0AC69', hair: '#5A3A28', beard: false };
const SIMEAO = { robe: '#E4DACD', skin: '#D2A17A', hair: '#E9E6E1', beard: true, cover: '#F3EFE8' };
const ANA = { robe: '#7C6A8A', skin: '#B97A4A', hair: '#E9E6E1', beard: false, cover: '#5E4E6C' };
const HERODES = { robe: '#7A2E3A', skin: '#E0AC69', hair: '#2A1E18', beard: true, gear: { crown: true } };
const MAGOS = [
  { robe: '#2E6B5E', skin: '#8D5524', hair: '#191919', beard: true, cover: '#E4B750' },
  { robe: '#6B3A7A', skin: '#E0AC69', hair: '#5A3A28', beard: true, cover: '#F3EFE8' },
  { robe: '#A2653F', skin: '#A86B3C', hair: '#292726', beard: false, cover: '#2E6B5E' },
];
const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const JOAO_B = { robe: '#8A6A3A', skin: '#A86B3C', hair: '#191919', beard: true };
const PILATOS = { robe: '#F4F1EC', skin: '#E0AC69', hair: '#3A2A20', beard: false };
const MANTO = '#A33A44';
const soldado = (seed, extra = {}) => ({ ...man(seed), cover: null, beard: false, robe: C.p600, gear: { helmet: 'rom', armor: true }, ...extra });
const pastor = (seed, extra = {}) => ({ ...man(seed), robe: ['#8A7A62', '#6E5A44', '#9C8B70', '#7A6A55'][seed % 4], cover: ['#C9BBAE', '#E2D8CF', '#A99A86', '#D8CBB8'][seed % 4], ...extra });
const mulher = (seed, extra = {}) => ({ ...man(seed), beard: false, cover: ['#E2D8CF', C.g300, '#C9BBAE', C.g100][seed % 4], ...extra });

// Texto em SVG.
const label = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${o.fam || 'Geist'}" font-weight="${o.w || 700}" font-size="${o.size || 36}" fill="${o.fill || C.inkDeep}" opacity="${f1((o.op ?? 1) * 100) / 100}"${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${esc(txt)}</text>`;
const fade = (op, svg) => opg(clamp(op), svg);

// ---------------------------------------------------------------- peças
// A estrela: brilho, oito pontas e cintilar.
function estrela(x, y, s, t, o = {}) {
  const tw = 1 + 0.08 * Math.sin(t * 6.3) + 0.05 * Math.sin(t * 11.1), r = 46 * s * tw, r2 = 18 * s * tw;
  let g = `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(260 * s * (o.halo || 1))}" fill="url(#gWhite)" opacity="${f1((o.glow ?? 0.85) * 100) / 100}"/>`;
  g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(120 * s)}" fill="url(#gAmber)" opacity="0.7"/>`;
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2, rr = i % 4 === 0 ? r * 1.9 : i % 2 === 0 ? r * 1.05 : r2;
    pts.push(`${f1(x + rr * Math.cos(a))} ${f1(y + rr * Math.sin(a))}`);
  }
  g += `<path d="M ${pts.join(' L ')} Z" fill="#FFF7DA" stroke="${o.ol || C.ink}" stroke-width="${f1(4 * s)}" stroke-linejoin="round"/>`;
  g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(12 * s)}" fill="#FFFFFF"/>`;
  return g;
}
// Raio da estrela até o chão.
const raioEstrela = (x, y, base, op) => (op > 0 ? beam(x, y, x, base, 18, 160, 0.55 * op) : '');

// Bebê enrolado em panos (Lucas 2:7), deitado; (x, y) é o centro.
function bebe(x, y, s = 1, o = {}) {
  const ol = o.ol || C.ink;
  let g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">`;
  g += `<ellipse cx="-8" cy="4" rx="58" ry="26" fill="#F6F1E8" stroke="${ol}" stroke-width="5"/>`;
  for (let i = 0; i < 3; i++) g += `<path d="M ${-46 + i * 26} -18 Q ${-38 + i * 26} 4 ${-46 + i * 26} 26" fill="none" stroke="${C.g400}" stroke-width="4"/>`;
  g += `<circle cx="52" cy="-2" r="22" fill="${o.skin || '#D6A27A'}" stroke="${ol}" stroke-width="5"/>`;
  g += `<path d="M 32 -16 Q 52 -36 72 -12" fill="#F6F1E8" stroke="${ol}" stroke-width="4"/>`;
  g += `<path d="M 44 0 q 4 3 8 0 M 56 0 q 4 3 8 0" fill="none" stroke="${ol}" stroke-width="3" stroke-linecap="round"/>`;
  return g + '</g>';
}
// Bebê no colo (de pé, em pé no braço de quem segura): (x, y) é o centro.
function bebeColo(x, y, s = 1, ang = -20) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${ang})">${bebe(0, 0, s)}</g>`;
}

// A manjedoura: o cocho de madeira com palha; o.bebe põe o bebê dentro.
function manjedoura(x, base, s = 1, o = {}) {
  const ol = o.ol || C.ink, wood = o.wood || '#8A6440', woodDk = o.woodDk || '#6B4A33';
  let g = `<g transform="translate(${f1(x)} ${f1(base)}) scale(${s})">`;
  g += `<ellipse cx="0" cy="4" rx="190" ry="16" fill="#000" opacity="0.15"/>`;
  [[-130, -1], [130, 1]].forEach(([lx, d]) => {
    g += `<line x1="${lx - 40 * d}" y1="0" x2="${lx + 30 * d}" y2="-120" stroke="${ol}" stroke-width="26" stroke-linecap="round"/><line x1="${lx - 40 * d}" y1="0" x2="${lx + 30 * d}" y2="-120" stroke="${woodDk}" stroke-width="15" stroke-linecap="round"/>`;
    g += `<line x1="${lx + 40 * d}" y1="0" x2="${lx - 30 * d}" y2="-120" stroke="${ol}" stroke-width="26" stroke-linecap="round"/><line x1="${lx + 40 * d}" y1="0" x2="${lx - 30 * d}" y2="-120" stroke="${wood}" stroke-width="15" stroke-linecap="round"/>`;
  });
  g += `<path d="M -190 -190 L 190 -190 L 150 -100 L -150 -100 Z" fill="${wood}" stroke="${ol}" stroke-width="6" stroke-linejoin="round"/>`;
  g += `<line x1="-176" y1="-160" x2="176" y2="-160" stroke="${woodDk}" stroke-width="5"/><line x1="-162" y1="-130" x2="162" y2="-130" stroke="${woodDk}" stroke-width="5"/>`;
  // palha
  const r = rng(77);
  for (let i = 0; i < 22; i++) { const px = -170 + i * 16 + r() * 8, a = -0.6 + r() * 1.2; g += `<line x1="${f1(px)}" y1="-188" x2="${f1(px + 30 * Math.sin(a))}" y2="${f1(-188 - 26 * Math.cos(a))}" stroke="#D9B45A" stroke-width="5" stroke-linecap="round"/>`; }
  g += `<path d="M -186 -190 Q 0 -214 186 -190 Z" fill="#E7C66E" stroke="${ol}" stroke-width="5" stroke-linejoin="round"/>`;
  if (o.bebe) g += bebe(0, -210, 1.05, { ol });
  return g + '</g>';
}

// Anjo: uma pessoa de branco com brilho.
function anjo(o) {
  const s = o.s || 1, glow = o.glow ?? 0.7, gy = o.y - 170 * s;
  let g = `<circle cx="${f1(o.x)}" cy="${f1(gy)}" r="${f1(330 * s)}" fill="url(#gWhite)" opacity="${f1(glow * 100) / 100}"/>`;
  g += person({ ...ANJO, rim: C.b300, mood: 'calm', ...o, glow: undefined, op: 1 });
  return opg(o.op ?? 1, g);
}
// Caído ou deitado: gira pelos pés (ang ±85 = deitado).
function caido(o, ang) {
  const s = o.s || 1, k = Math.abs(Math.sin((ang * Math.PI) / 180));
  let g = k > 0.6 ? `<ellipse cx="${f1(o.x + Math.sign(ang) * 150 * s)}" cy="${f1(o.y + 2)}" rx="${f1(170 * s)}" ry="${f1(12 * s)}" fill="#000" opacity="0.2"/>` : '';
  return g + `<g transform="translate(0 ${f1(-44 * s * k * k * k)}) rotate(${f1(ang)} ${f1(o.x)} ${f1(o.y)})">${person({ ...o, noShadow: k > 0.2 })}</g>`;
}
// Esteira de dormir.
const esteira = (x, y, w, fill = '#B79B72', ol = C.ink) => rect(x - w / 2, y - 6, w, 18, fill, `rx="9" ${ink(5, ol)}`);

// A casa (lucas-15-perdidos). o.luz acende as janelas; o.noite escurece.
function casa(x, base, s, t, o = {}) {
  const luz = o.luz || 0, noite = !!o.noite;
  const parede = noite ? '#4A3E36' : '#FFFFFF', lado = noite ? '#3A302A' : C.g300, ol = noite ? NOITE_OL : C.ink, vao = noite ? '#1A1512' : C.g700;
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
// Casinhas da vila (Nazaré, Belém) ao longe.
function vila(x, base, s, o = {}) {
  const noite = !!o.noite, ol = noite ? NOITE_OL : C.ink, par = noite ? '#3E342D' : '#FFFFFF', lado = noite ? '#2F2722' : C.g300, jan = noite ? C.a400 : C.g700;
  const casas = o.casas || [[-260, 120, 130], [-110, 160, 120], [30, 130, 140], [190, 170, 120], [330, 110, 110]];
  let g = '';
  casas.forEach(([dx, hh, ww], i) => {
    const X = x + dx * s, Y = base, h = hh * s, w = ww * s;
    g += rect(X, Y - h, w, h, par, ink(5, ol)) + rect(X + w * 0.68, Y - h + 2.5, w * 0.32 - 2.5, h - 2.5, lado) + rect(X - 6 * s, Y - h - 14 * s, w + 12 * s, 16 * s, lado, `rx="${f1(5 * s)}" ${ink(4, ol)}`);
    if (i % 2 === 0) g += rect(X + w * 0.25, Y - h * 0.62, w * 0.22, h * 0.24, noite && o.luzes ? C.a300 : jan, `rx="${f1(4 * s)}" ${ink(3, ol)}`);
  });
  return g;
}
// O templo (tentacoes-de-jesus).
function templo(x, base, s) {
  let g = '';
  g += `<rect x="${f1(x - 330 * s)}" y="${f1(base - 300 * s)}" width="${f1(560 * s)}" height="${f1(300 * s)}" fill="#F3EDE4" ${ink(5)}/>`;
  for (let i = 0; i < 6; i++) g += `<rect x="${f1(x - 300 * s + i * 90 * s)}" y="${f1(base - 260 * s)}" width="${f1(30 * s)}" height="${f1(240 * s)}" fill="#E4DACD" ${ink(4)}/>`;
  g += `<path d="M ${f1(x - 350 * s)} ${f1(base - 300 * s)} L ${f1(x - 50 * s)} ${f1(base - 420 * s)} L ${f1(x + 250 * s)} ${f1(base - 300 * s)} Z" fill="#E9E1D5" ${ink(5)}/>`;
  g += `<rect x="${f1(x + 200 * s)}" y="${f1(base - 640 * s)}" width="${f1(140 * s)}" height="${f1(640 * s)}" fill="#EFE7DB" ${ink(5)}/>`;
  g += `<rect x="${f1(x + 186 * s)}" y="${f1(base - 660 * s)}" width="${f1(168 * s)}" height="${f1(26 * s)}" fill="${C.a300}" ${ink(4)}/>`;
  for (let k = 0; k < 4; k++) g += `<rect x="${f1(x + 228 * s)}" y="${f1(base - 590 * s + k * 140 * s)}" width="${f1(84 * s)}" height="${f1(60 * s)}" rx="${f1(30 * s)}" fill="${C.g500}" ${ink(3)}/>`;
  return g;
}
// Pomba (tentacoes-de-jesus); asa batendo com t.
function pomba(x, y, s, t, fill = '#FFFFFF') {
  const b = Math.sin(t * 9) * 16;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">
    <path d="M -6 0 C -40 ${f1(-30 - b)} -96 ${f1(-34 - b)} -120 ${f1(-14 - b)} C -84 ${f1(-6 - b / 2)} -46 6 -10 12 Z" fill="${fill}" ${ink(4)}/>
    <path d="M 6 0 C 40 ${f1(-30 - b)} 96 ${f1(-34 - b)} 120 ${f1(-14 - b)} C 84 ${f1(-6 - b / 2)} 46 6 10 12 Z" fill="${fill}" ${ink(4)}/>
    <ellipse cx="0" cy="8" rx="22" ry="34" fill="${fill}" ${ink(4)}/>
    <circle cx="0" cy="-28" r="15" fill="${fill}" ${ink(4)}/>
    <path d="M -6 -22 L 0 -12 L 6 -22 Z" fill="${C.a400}"/>
    <path d="M -14 40 L 0 62 L 14 40 Z" fill="${fill}" ${ink(4)}/>
  </g>`;
}
// Rolinha pousada, de perfil (para o cesto).
function rolinha(x, y, s, flip = 1) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * flip)} ${f1(s)})">
    <path d="M -46 6 C -40 -26 0 -34 26 -16 C 40 -8 44 10 30 20 L -40 24 Z" fill="#E7DED3" ${ink(4)}/>
    <path d="M -30 -6 C -6 -18 14 -12 22 0 C 6 4 -14 4 -30 -6 Z" fill="#CFC2B4" ${ink(3)}/>
    <circle cx="34" cy="-22" r="14" fill="#E7DED3" ${ink(4)}/><circle cx="38" cy="-25" r="2.8" fill="${C.ink}"/>
    <path d="M 46 -22 L 58 -18 L 46 -15 Z" fill="${C.a400}" ${ink(2)}/>
    <path d="M -44 8 L -70 -2 L -66 16 Z" fill="#CFC2B4" ${ink(3)}/></g>`;
}
// Cesto de vime.
function cesto(x, y, s) {
  let g = `<path d="M ${f1(x - 110 * s)} ${f1(y - 50 * s)} L ${f1(x + 110 * s)} ${f1(y - 50 * s)} L ${f1(x + 86 * s)} ${f1(y + 40 * s)} L ${f1(x - 86 * s)} ${f1(y + 40 * s)} Z" fill="#C9A46A" ${ink(5)}/>`;
  for (let i = 0; i < 3; i++) g += `<line x1="${f1(x - 104 * s + i * 4 * s)}" y1="${f1(y - 26 * s + i * 26 * s)}" x2="${f1(x + 104 * s - i * 4 * s)}" y2="${f1(y - 26 * s + i * 26 * s)}" stroke="#9C7A46" stroke-width="${f1(4 * s)}"/>`;
  return g;
}
// O cajado (eu-sou).
function cajado(x, y0, y1, s = 1, ol = C.ink) {
  const d = `M ${f1(x)} ${f1(y0)} L ${f1(x)} ${f1(y1)} C ${f1(x)} ${f1(y1 - 70 * s)} ${f1(x - 90 * s)} ${f1(y1 - 76 * s)} ${f1(x - 92 * s)} ${f1(y1 - 20 * s)}`;
  return `<path d="${d}" stroke="${ol}" stroke-width="${f1(22 * s)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${C.wood}" stroke-width="${f1(11 * s)}" fill="none" stroke-linecap="round"/>`;
}
// Presentes dos magos: o baú (ouro) e dois potes (incenso e mirra).
function bau(x, y, s, t = 0) {
  let g = `<circle cx="${f1(x)}" cy="${f1(y - 50 * s)}" r="${f1(120 * s)}" fill="url(#gAmber)" opacity="0.55"/>`;
  g += rect(x - 60 * s, y - 70 * s, 120 * s, 70 * s, '#8A5A2E', `rx="${f1(8 * s)}" ${ink(5)}`);
  g += `<path d="M ${f1(x - 64 * s)} ${f1(y - 66 * s)} Q ${f1(x)} ${f1(y - 120 * s)} ${f1(x + 64 * s)} ${f1(y - 66 * s)} Z" fill="${C.a400}" ${ink(5)}/>`;
  g += rect(x - 10 * s, y - 52 * s, 20 * s, 24 * s, C.a300, `rx="${f1(4 * s)}" ${ink(3)}`);
  return g;
}
function pote(x, y, s, cor, fumaca = 0, t = 0) {
  let g = `<path d="M ${f1(x - 34 * s)} ${f1(y)} C ${f1(x - 50 * s)} ${f1(y - 60 * s)} ${f1(x - 30 * s)} ${f1(y - 86 * s)} ${f1(x - 18 * s)} ${f1(y - 92 * s)} L ${f1(x + 18 * s)} ${f1(y - 92 * s)} C ${f1(x + 30 * s)} ${f1(y - 86 * s)} ${f1(x + 50 * s)} ${f1(y - 60 * s)} ${f1(x + 34 * s)} ${f1(y)} Z" fill="${cor}" ${ink(5)}/>`;
  g += rect(x - 22 * s, y - 106 * s, 44 * s, 16 * s, C.a300, `rx="${f1(6 * s)}" ${ink(4)}`);
  if (fumaca > 0) for (let i = 0; i < 3; i++) { const p = (t * 0.4 + i / 3) % 1; g += `<circle cx="${f1(x + Math.sin(p * 7 + i) * 16 * s)}" cy="${f1(y - 120 * s - p * 140 * s)}" r="${f1((10 + p * 16) * s)}" fill="#EDE8E1" opacity="${f1(fumaca * (1 - p) * 0.8 * 100) / 100}"/>`; }
  return g;
}
// Palmeira (o Egito).
function palmeira(x, base, s, ol = C.ink, tronco = '#8A6A4D', folha = '#7E9A5C') {
  let g = `<path d="M ${f1(x - 14 * s)} ${f1(base)} C ${f1(x - 10 * s)} ${f1(base - 150 * s)} ${f1(x + 20 * s)} ${f1(base - 260 * s)} ${f1(x + 30 * s)} ${f1(base - 330 * s)} L ${f1(x + 54 * s)} ${f1(base - 326 * s)} C ${f1(x + 40 * s)} ${f1(base - 250 * s)} ${f1(x + 14 * s)} ${f1(base - 150 * s)} ${f1(x + 14 * s)} ${f1(base)} Z" fill="${tronco}" ${ink(5, ol)}/>`;
  const cx = x + 42 * s, cy = base - 330 * s;
  [-150, -110, -60, -20, 20].forEach((a) => { const r = (a * Math.PI) / 180, ex = cx + Math.cos(r) * 170 * s, ey = cy + Math.sin(r) * 120 * s + 60 * s; g += `<path d="M ${f1(cx)} ${f1(cy)} Q ${f1((cx + ex) / 2)} ${f1(Math.min(cy, ey) - 60 * s)} ${f1(ex)} ${f1(ey)} Q ${f1((cx + ex) / 2 + 10 * s)} ${f1(Math.min(cy, ey) - 20 * s)} ${f1(cx)} ${f1(cy)} Z" fill="${folha}" ${ink(4, ol)}/>`; });
  return g;
}
// Cartão de livro (Mateus, Lucas...).
function livroCard(x, y, w, h, nome, o = {}) {
  const pin = o.pin ?? 1, hl = o.hl || 0, op = o.op ?? 1;
  if (pin <= 0 || op <= 0) return '';
  const edge = hl > 0 ? C.b500 : C.border, sw = hl > 0 ? 6 : 4, sc = pin * (1 + 0.05 * hl), cy = y + h / 2;
  return `<g opacity="${f1(clamp(op) * 100) / 100}" transform="translate(${f1(x)} ${f1(cy)}) scale(${f1(sc * 1000) / 1000}) translate(${f1(-x)} ${f1(-cy)})">
    <rect x="${f1(x - w / 2)}" y="${f1(y + 12)}" width="${w}" height="${h}" rx="36" fill="${edge}"/>
    <rect x="${f1(x - w / 2)}" y="${f1(y)}" width="${w}" height="${h}" rx="36" fill="#fff" stroke="${edge}" stroke-width="${sw}"/>
    <text x="${f1(x)}" y="${f1(y + 84)}" text-anchor="middle" font-family="Geist" font-weight="700" font-size="52" letter-spacing="-0.5" fill="${C.inkDeep}">${esc(nome)}</text>
    ${o.sub ? `<text x="${f1(x)}" y="${f1(y + h - 34)}" text-anchor="middle" font-family="Geist Mono" font-weight="500" font-size="28" fill="${C.muted}">${esc(o.sub)}</text>` : ''}</g>`;
}
// Ícones das 7 cenas (para os cartões).
function icone(n, x, y, s, t) {
  const g = (inner) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 100) / 100})">${inner}</g>`;
  if (n === 1) return g(`<circle r="70" fill="url(#gWhite)" opacity="0.9"/>` + person({ ...ANJO, x: 0, y: 70, s: 0.45, rim: C.b300 }));
  if (n === 2) return g(person({ ...JOSE, x: 0, y: 70, s: 0.45, mood: 'closed' }));
  if (n === 3) return g(manjedoura(0, 60, 0.32, { bebe: true }));
  if (n === 4) return g(sheep(-10, 60, 0.6, t) + cajado(46, 60, -50, 0.5));
  if (n === 5) return g(person({ ...SIMEAO, x: 0, y: 70, s: 0.45, armL: 60, armR: 60 }) + bebeColo(0, -2, 0.32, 0));
  if (n === 6) return g(estrela(0, -20, 0.55, t, { glow: 0.5 }));
  return g(person({ ...HERODES, x: 0, y: 70, s: 0.45, mood: 'angry' }));
}

// O livro aberto da cena: número e evangelho (abre cada uma das 7 cenas).
function indice(t, n, livro, o = {}) {
  const t0 = o.t0 ?? 0;
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const p = pop(t, t0 + 0.05, 0.5), c = pop(t, t0 + 0.3, 0.5);
  s += livroCard(1180, 250, 520, 420, livro, { pin: c, sub: o.sub || '', hl: 1 });
  if (c > 0) s += opg(clamp(c), icone(n, 1180, 540, 2.3, t));
  s += dot(700, 460, n, 2.4 * p);
  for (let k = 1; k <= 7; k++) { const on = k <= n; s += dot(520 + (k - 1) * 146, 790, k, 0.62 * pop(t, t0 + 0.1 + k * 0.04, 0.4), on ? 1 : 0.28); }
  return s;
}

// ---------------------------------------------------------------- 1. ABERTURA
// A estrela vai na frente dos viajantes e para sobre o lugar onde estava o menino (Mateus 2:9).
function estrelaCena(t, k) {
  // k: x (posição da estrela de 0 a 1), parada (0 a 1), raio (0 a 1), magos (andando ou não)
  let s = bgNight(t, { moon: false });
  s += vila(1500, GROUND + 6, 0.85, { noite: true, luzes: true, casas: [[-260, 120, 130], [-110, 160, 120], [30, 130, 140], [190, 150, 120]] });
  const sx = lerp(260, 1540, k.x), sy = (VERT ? 300 : 0) + lerp(170, 240, k.x) - 18 * Math.sin(k.x * Math.PI);
  s += raioEstrela(sx, sy + 40, GROUND - 20, k.raio);
  s += estrela(sx, sy, 0.9, t, { ol: NOITE_OL });
  const mx = lerp(330, 900, k.anda);
  MAGOS.forEach((m, i) => (s += person({ ...m, x: mx - i * 160, y: FLOOR_Y - i * 8, s: 1.05 - i * 0.05, look: 1, walk: k.andando ? t * 5 + i : null, sil: '#0C0C0E', rim: '#8A7A5A', noShadow: true })));
  return s;
}
const K_ESTRELA = (t) => ({ x: E.inOut(prog(t, -0.5, wt(L(1, 1), 'parou'))), raio: E.out(prog(t, wt(L(1, 1), 'parou'), fim(L(1, 1)))), anda: E.inOut(prog(t, -1, fim(L(1, 1)))), andando: t < fim(L(1, 1)) });
function scEstrela(t) {
  const k = K_ESTRELA(t), cx = lerp(700, 1300, E.inOut(prog(t, 0, fim(L(1, 1)))));
  return { svg: cam(estrelaCena(t, k), cx, 760, 1.1 - 0.08 * prog(t, 0, fim(L(1, 1))), 960 - cx), html: '' };
}

// Herodes manda matar os meninos de Belém, de dois anos para baixo (Mateus 2:16).
function scOrdem(t) {
  const tm = wt(L(1, 2), 'matar'), aponta = E.back(prog(t, tm - 0.4, tm));
  let s = `<rect width="${W}" height="${H}" fill="#1D1714"/>` + `<circle cx="760" cy="420" r="700" fill="url(#gAmber)" opacity="0.28"/>`;
  [240, 1680].forEach((x) => (s += rect(x - 52, 40, 104, 760, '#3B2F28', ink(6, NOITE_OL))));
  s += rect(-20, 800, W + 40, 400, '#2A221E') + `<line x1="0" y1="800" x2="${W}" y2="800" stroke="${NOITE_OL}" stroke-width="6"/>`;
  s += throne(620, 800, 0.9, '#8A6A2E');
  s += person({ ...HERODES, x: 620, y: 800, s: 1.5, look: 1, mood: 'angry', armR: lerp(18, 96, aponta), ol: NOITE_OL, rim: C.a300 });
  // soldados saem para a direita, rumo a Belém
  const sai = E.in(prog(t, tm + 0.3, fim(L(1, 3)) + 0.4));
  for (let i = 0; i < 4; i++) s += person({ ...soldado(951 + i), x: 1180 + i * 150 + sai * 900, y: 860 + (i % 2) * 14, s: 1.2, look: 1, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26, walk: sai > 0 ? t * 6 + i : null, sil: '#0E0B09', rim: '#6A4E34', noShadow: true });
  const z = 1.0 + 0.1 * E.inOut(prog(t, seg(L(1, 3)), fim(L(1, 3)) + 0.3));
  return { svg: cam(s, 820, 520, z), html: '' };
}

// As sete cenas: Mateus guardou três, Lucas guardou quatro, nenhuma nos dois.
const LIVROS = [{ nome: 'Mateus', x: 600, sub: 'cap. 1 e 2', dots: [2, 6, 7] }, { nome: 'Lucas', x: 1320, sub: 'cap. 1 e 2', dots: [1, 3, 4, 5] }];
const CARD7 = { top: 300, w: 600, h: 470 };
function scSete(t) {
  const T1 = wt(L(1, 4), 'sete'), T2 = seg(L(1, 6)) - 0.2, TM = seg(L(1, 6)) + 0.3, TL = seg(L(1, 7)) + 0.05, T4 = seg(L(1, 10)) + 0.1;
  const hlM = pop(t, seg(L(1, 8)), 0.4) * (1 - prog(t, seg(L(1, 9)) - 0.1, seg(L(1, 9)) + 0.2));
  const hlL = pop(t, seg(L(1, 9)), 0.4) * (1 - prog(t, T4 - 0.2, T4));
  const topo = (n) => [960 + (n - 4) * 150, 150];
  const meio = (n) => [960 + (n - 4) * 150, 540];
  const noCartao = (n) => { const b = LIVROS[LIVROS[0].dots.includes(n) ? 0 : 1], k = b.dots.indexOf(n); return [b.x + (k - (b.dots.length - 1) / 2) * 118, CARD7.top + 190]; };
  const mix = (A, B, u) => [lerp(A[0], B[0], u), lerp(A[1], B[1], u)];
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const cardOut = prog(t, T4 + 0.1, T4 + 0.5);
  LIVROS.forEach((b, i) => {
    const pin = pop(t, T2 + i * 0.15, 0.45), hl = i === 0 ? hlM : hlL;
    s += livroCard(b.x, CARD7.top + 30 * cardOut, CARD7.w, CARD7.h, b.nome, { pin, hl, op: 1 - cardOut });
    const ic = i === 0 ? pop(t, wt(L(1, 8), 'estrela') - 0.1, 0.4) : pop(t, wt(L(1, 9), 'manjedoura') - 0.1, 0.4);
    if (ic > 0 && cardOut < 1) s += opg(ic * (1 - cardOut), i === 0 ? estrela(b.x, CARD7.top + 340, 0.75, t, { glow: 0.35 }) : manjedoura(b.x, CARD7.top + 430, 0.5, { bebe: true }));
  });
  for (let n = 1; n <= 7; n++) {
    const tb = LIVROS[0].dots.includes(n) ? TM : TL, k = LIVROS[0].dots.includes(n) ? LIVROS[0].dots.indexOf(n) : LIVROS[1].dots.indexOf(n);
    const pb = E.inOut(prog(t, tb + k * 0.1, tb + 0.55 + k * 0.1)), pr = E.inOut(prog(t, T4 + (n - 1) * 0.05, T4 + 0.6 + (n - 1) * 0.05));
    const P = mix(mix(topo(n), noCartao(n), pb), meio(n), pr);
    const pulse = 1 + 0.15 * Math.sin(Math.PI * prog(t, seg(L(1, 10)) + 0.8 + (n - 1) * 0.15, seg(L(1, 10)) + 1.15 + (n - 1) * 0.15));
    s += dot(P[0], P[1], n, pop(t, T1 - 0.15 + (n - 1) * 0.09, 0.4) * pulse * (1 + 0.4 * pr));
  }
  return { svg: s, html: '' };
}

// Três palavras escondidas e a cruz (a promessa que se paga no fim).
function tresPalavras(t, k) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const words = ['REI', 'DOS', 'JUDEUS'], ws = [230, 230, 420], gap = 40, tot = ws.reduce((a, b) => a + b, 0) + gap * 2;
  let x = 960 - tot / 2;
  if (k.col) {
    words.forEach((w, i) => {
      const p = pop(t, k.t0 + i * 0.25, 0.45), rv = k.rev ? pop(t, k.rev + i * 0.3, 0.4) : 0, wd = i === 2 ? 440 : 300;
      if (p > 0) s += `<g transform="translate(960 ${520 + i * 140}) scale(${f1(p * 100) / 100})">${rect(-wd / 2, -58, wd, 116, rv > 0 ? '#FFFFFF' : C.g300, `rx="26" stroke="${rv > 0 ? C.b500 : C.border}" stroke-width="5"`)}${rv > 0 ? label(0, 30, w, { size: 80, w: 800, fill: C.inkDeep, fam: 'Gasoek One', op: rv }) : label(0, 26, '?', { size: 72, w: 800, fill: C.muted })}</g>`;
    });
    return s;
  }
  words.forEach((w, i) => {
    const p = pop(t, k.t0 + i * 0.25, 0.45), rv = k.rev ? pop(t, k.rev + i * 0.3, 0.4) : 0;
    if (p > 0) {
      const cx = x + ws[i] / 2;
      s += `<g transform="translate(${f1(cx)} ${k.y}) scale(${f1(p * 100) / 100})">${rect(-ws[i] / 2, -70, ws[i], 140, rv > 0 ? '#FFFFFF' : C.g300, `rx="26" stroke="${rv > 0 ? C.b500 : C.border}" stroke-width="5"`)}`;
      s += rv > 0 ? label(0, 34, w, { size: 92, w: 800, fill: C.inkDeep, fam: 'Gasoek One', op: rv }) : label(0, 30, '?', { size: 84, w: 800, fill: C.muted });
      s += '</g>';
    }
    x += ws[i] + gap;
  });
  return s;
}
function scTres(t) {
  let s = tresPalavras(t, { t0: wt(L(1, 11), 'três') - 0.1, y: 360 });
  const tc = wt(L(1, 11), 'cruz') - 0.15, c = E.out(prog(t, tc, tc + 0.6));
  if (c > 0) s += crossFig(960, 1020, 0.68, { fill: SIL, plaque: true, body: false, op: c });
  return { svg: cam(s, 960, 540, 1.0 + 0.03 * prog(t, at(L(1, 11)), at(L(2, 0)))), html: '' };
}

// ---------------------------------------------------------------- 2. PRIMEIRA CENA: GABRIEL E MARIA (Lucas 1:26-38)
const scIndice1 = (t) => ({ svg: indice(t, 1, 'Lucas', { t0: at(L(2, 0)), sub: '1:26-38' }), html: '' });
function nazare(t, o = {}) {
  let s = bgDay(t, { seed: 21, sunX: 1650, sunY: 190 });
  s += vila(300, GROUND + 10, 0.9);
  s += casa(1180, FLOOR_Y - 10, 1.05, t);
  s += `<path d="M -40 ${FLOOR_Y - 10} L ${W + 40} ${FLOOR_Y - 10} L ${W + 40} ${H + 20} L -40 ${H + 20} Z" fill="#E6DCCF" stroke="${C.ink}" stroke-width="5"/>`;
  return s;
}
function scNazare(t) {
  const tg = wt(L(2, 1), 'gabriel') - 0.3, a = E.out(prog(t, tg, tg + 0.8)), tm = wt(L(2, 2), 'maria');
  let s = nazare(t);
  s += luzBeam(820, FLOOR_Y, a);
  if (a > 0) s += anjo({ x: 820, y: FLOOR_Y, s: 1.35, look: 1, armR: 30, glow: 0.8, op: a });
  s += person({ ...MARIA, x: 1250, y: FLOOR_Y, s: 1.3, look: a > 0.3 ? -1 : 0, mood: a > 0.2 && t < tm + 1.2 ? 'fear' : 'calm' });
  const z = 1.0 + 0.25 * E.inOut(prog(t, tm - 0.6, fim(L(2, 2)) + 0.2));
  return { svg: cam(s, lerp(960, 1040, prog(t, tm - 0.6, fim(L(2, 2)))), 760, z), html: '' };
}
const luzBeam = (x, base, op) => (op > 0 ? beam(x, -200, x, base, 90, 260, 0.55 * op) : '');
// Gabriel e Maria de perto. fala: quem fala (0 anjo, 1 Maria); k.mood de Maria; k.luz.
function dialogo(t, k) {
  let s = nazare(t);
  s += `<rect width="${W}" height="${H}" fill="${C.paper}" opacity="0.25"/>`;
  if (k.luz > 0) s += `<circle cx="1180" cy="250" r="${f1(600 + 200 * k.luz)}" fill="url(#gWhite)" opacity="${f1(k.luz * 0.85 * 100) / 100}"/>`;
  const fa = k.fala === 0, fm = k.fala === 1;
  s += anjo({ x: 700, y: FLOOR_Y, s: 1.6, look: 1, armR: fa ? fala(t, 0, 999, 24, 40) : 20, armL: 16, glow: 0.75 + 0.1 * Math.sin(t * 3) });
  const mp = { ...MARIA, x: 1220, y: FLOOR_Y, s: 1.6, look: -1, mood: k.mood || 'calm', armL: fm ? fala(t, 0, 999, 18, 30) : 16, armR: 16 };
  s += k.kneel ? person({ ...mp, kneel: true, mood: 'closed', armL: 60, armR: 60 }) : person(mp);
  return s;
}
function scNaoTema(t) {
  const fear = t < wt(L(2, 3), 'medo') + 0.6;
  return { svg: cam(dialogo(t, { fala: 0, mood: fear ? 'fear' : 'calm', luz: 0.2 }), 960, 760, 1.05 + 0.04 * prog(t, at(L(2, 3)), at(L(2, 5)))), html: '' };
}
function scAltissimo(t) {
  const ta = wt(L(2, 5), 'altíssimo') - 0.2, l = 0.2 + 0.6 * E.out(prog(t, ta, ta + 0.8)), tf = wt(L(2, 6), 'fim');
  let s = dialogo(t, { fala: 0, mood: 'calm', luz: l });
  // o Reino sem fim: a coroa de luz acima
  const cr = pop(t, wt(L(2, 6), 'reino') - 0.1, 0.5);
  if (cr > 0) s += `<g transform="translate(960 230) scale(${f1(cr * 2.2 * 100) / 100})"><path d="M -32 22 L -36 -20 L -18 2 L 0 -26 L 18 2 L 36 -20 L 32 22 Z" fill="${C.a300}" ${ink(5)}/></g>`;
  return { svg: cam(s, 960, 760, 1.08 + 0.06 * prog(t, at(L(2, 5)), tf + 0.5)), html: '' };
}
function scComo(t) {
  const tr = seg(L(2, 8)), te = wt(L(2, 8), 'espírito') - 0.2, l = 0.15 + 0.75 * E.inOut(prog(t, te, wt(L(2, 8), 'sombra')));
  const tn = wt(L(2, 9), 'impossível') - 0.2, l2 = Math.max(l, 0.9 * E.out(prog(t, tn, tn + 0.6)));
  let s = dialogo(t, { fala: t < tr ? 1 : 0, mood: t < tr ? 'calm' : 'calm', luz: t < tr ? 0.15 : l2 });
  // a sombra do Altíssimo: uma luz que desce sobre Maria
  const desce = E.inOut(prog(t, te, wt(L(2, 8), 'sombra') + 0.3));
  if (desce > 0) s += `<ellipse cx="1220" cy="${f1(lerp(-200, 420, desce))}" rx="360" ry="200" fill="url(#gWhite)" opacity="${f1(0.8 * clamp(desce * 2) * 100) / 100}"/>`;
  return { svg: cam(s, 1050, 760, 1.1 + 0.05 * prog(t, at(L(2, 7)), at(L(2, 10)))), html: '' };
}
function scServa(t) {
  const ts = wt(L(2, 10), 'serva') - 0.4;
  return { svg: cam(dialogo(t, { fala: 1, kneel: t > ts, luz: 0.5 }), 1100, 780, 1.2 + 0.06 * prog(t, at(L(2, 10)), at(L(2, 11)))), html: '' };
}
// Um Reino sem fim, anunciado a uma moça prometida em casamento.
function scReino(t) {
  let s = nazare(t);
  const l = 0.6 + 0.15 * Math.sin(t * 2);
  s += `<circle cx="1180" cy="420" r="700" fill="url(#gWhite)" opacity="${f1(l * 0.5 * 100) / 100}"/>`;
  s += person({ ...MARIA, x: 1250, y: FLOOR_Y, s: 1.25, look: 0, mood: 'calm', armL: 30, armR: 30 });
  const cr = pop(t, at(L(2, 11)) + 0.4, 0.6);
  if (cr > 0) s += `<g transform="translate(1250 260) scale(${f1(cr * 1.6 * 100) / 100})"><circle r="110" fill="url(#gAmber)" opacity="0.6"/><path d="M -32 22 L -36 -20 L -18 2 L 0 -26 L 18 2 L 36 -20 L 32 22 Z" fill="${C.a300}" ${ink(5)}/></g>`;
  const z = lerp(1.25, 1.0, E.inOut(prog(t, at(L(2, 11)), fim(L(2, 12)))));
  return { svg: cam(s, lerp(1200, 960, E.inOut(prog(t, at(L(2, 11)), fim(L(2, 12))))), 760, z), html: '' };
}

// ---------------------------------------------------------------- 3. SEGUNDA CENA: O SONHO DE JOSÉ (Mateus 1:18-24)
const scIndice2 = (t) => ({ svg: indice(t, 2, 'Mateus', { t0: at(L(3, 0)), sub: '1:18-25' }), html: '' });
function patio(t, o = {}) {
  let s = bgDusk(t);
  s += vila(1560, GROUND + 10, 0.8);
  s += `<path d="M -40 ${FLOOR_Y - 10} L ${W + 40} ${FLOOR_Y - 10} L ${W + 40} ${H + 20} L -40 ${H + 20} Z" fill="#E1D5C6" stroke="${C.ink}" stroke-width="5"/>`;
  return s;
}
function scJose(t) {
  const tj = seg(L(3, 2)), ta = wt(L(3, 3), 'anular') - 0.3, tp = seg(L(3, 4)), tpub = wt(L(3, 4), 'pública') - 0.6;
  let s = patio(t);
  // Maria, de longe, à esquerda; José pensa à direita
  s += person({ ...MARIA, x: 520, y: FLOOR_Y - 30, s: 1.05, look: 1, mood: 'calm' });
  const vira = E.inOut(prog(t, ta, ta + 0.6));
  s += person({ ...JOSE, x: 1260, y: FLOOR_Y, s: 1.5, look: vira > 0.5 ? 1 : -1, mood: t > ta ? 'sad' : 'calm', armR: t > tj && t < ta ? 40 : 16, armL: 18 });
  // a desonra pública: a multidão que ficaria olhando
  const povo = E.out(prog(t, tpub, tpub + 0.6)) * (1 - prog(t, fim(L(3, 4)), fim(L(3, 4)) + 0.4));
  if (povo > 0) for (let i = 0; i < 6; i++) s += person({ ...man(1301 + i), x: 140 + i * 110, y: FLOOR_Y + 60, s: 1.0, look: 1, mood: 'angry', sil: '#5A524C', op: povo * 0.85, noShadow: true });
  const cx = lerp(960, 1180, E.inOut(prog(t, tj - 0.3, tj + 0.6))), z = 1.0 + 0.2 * E.inOut(prog(t, tj - 0.3, tj + 0.6)) - 0.15 * E.inOut(prog(t, tp, tp + 0.8));
  return { svg: cam(s, cx, 760, z, 960 - cx), html: '' };
}
// O sonho: José dormindo e o anjo (Mateus 1:20-21).
function sonho(t, o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="#14110F"/>` + `<circle cx="1260" cy="380" r="820" fill="url(#gAmber)" opacity="0.08"/>`;
  s += rect(-20, 820, W + 40, 400, '#211B17') + `<line x1="0" y1="820" x2="${W}" y2="820" stroke="${NOITE_OL}" stroke-width="6"/>`;
  s += lamparinaJ(380, 760, t);
  s += esteira(980, 830, 520);
  s += caido({ ...JOSE, x: 760, y: 818, s: 1.25, mood: 'closed', ol: NOITE_OL, cover: null }, 85 + (o.acorda || 0) * -85);
  const a = o.anjo || 0;
  if (a > 0) s += anjo({ x: 1380, y: 800, s: 1.35, look: -1, armL: o.fala ? fala(t, 0, 999, 24, 40) : 30, armR: 16, glow: 0.9, op: a });
  return s;
}
const lamparinaJ = (x, y, t) => flame(x, y - 8, 13, 44 + 4 * Math.sin(t * 9), C.a300) + `<ellipse cx="${x}" cy="${y}" rx="34" ry="12" fill="#8A5A2E" ${ink(4, NOITE_OL)}/>` + `<circle cx="${x}" cy="${y - 30}" r="160" fill="url(#gAmber)" opacity="0.5"/>`;
function scSonho(t) {
  const ta = seg(L(3, 5)) + 0.3, a = E.out(prog(t, ta, ta + 0.9));
  return { svg: cam(sonho(t, { anjo: a, fala: t > wt(L(3, 5), 'josé') - 0.2 }), 1060, 560, 1.0 + 0.08 * prog(t, at(L(3, 5)), at(L(3, 7)))), html: '' };
}
// Emanuel, Deus conosco (Mateus 1:22-23; Isaías 7:14).
function cartaoNome(t, k) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const p = pop(t, k.t0, 0.5), q = pop(t, k.t1, 0.5);
  if (p > 0) s += `<g transform="translate(960 380) scale(${f1(p * 100) / 100})">${label(0, 40, 'Emanuel', { fam: 'Gasoek One', size: 170, w: 400, fill: C.inkDeep })}</g>`;
  if (q > 0) s += `<g transform="translate(960 600) scale(${f1(q * 100) / 100})">${rect(-330, -78, 660, 140, C.b500, `rx="32"`)}${label(0, 30, 'Deus conosco', { size: 84, w: 800, fill: '#FFFFFF' })}</g>`;
  if (k.guarda) { const g = pop(t, k.guarda, 0.4); if (g > 0) s += `<g transform="translate(960 800) scale(${f1(g * 100) / 100})">${rect(-210, -42, 420, 84, '#fff', `rx="42" stroke="${C.border}" stroke-width="4"`)}${label(0, 14, 'guarda esse nome', { fam: 'Geist Mono', size: 34, w: 600, fill: C.ink })}</g>`; }
  return s;
}
function scEmanuel(t) {
  const s = cartaoNome(t, { t0: wt(L(3, 7), 'emanuel') - 0.15, t1: wt(L(3, 7), 'deus') - 0.15, guarda: seg(L(3, 8)) });
  return { svg: cam(s, 960, 540, 1.0 + 0.04 * prog(t, at(L(3, 7)), at(L(3, 9)))), html: '' };
}
// José acorda, obedece e recebe Maria (Mateus 1:24).
function scObedeceu(t) {
  const tac = wt(L(3, 9), 'acordou') - 0.3, ac = E.inOut(prog(t, tac, tac + 0.7)), tr = wt(L(3, 9), 'recebeu') - 0.5, vai = E.inOut(prog(t, tr, tr + 1.5));
  let s;
  if (vai <= 0) s = sonho(t, { acorda: ac });
  else {
    s = bgDay(t, { seed: 31, sunX: 1650, sunY: 180 }) + vila(260, GROUND + 10, 0.85);
    s += `<path d="M -40 ${FLOOR_Y - 10} L ${W + 40} ${FLOOR_Y - 10} L ${W + 40} ${H + 20} L -40 ${H + 20} Z" fill="#E6DCCF" stroke="${C.ink}" stroke-width="5"/>`;
    s += casa(1300, FLOOR_Y - 10, 0.95, t);
    s += person({ ...MARIA, x: 1180, y: FLOOR_Y, s: 1.3, look: -1, mood: vai > 0.8 ? 'happy' : 'calm' });
    s += person({ ...JOSE, x: lerp(300, 1010, vai), y: FLOOR_Y, s: 1.35, look: 1, mood: 'happy', walk: vai < 1 ? t * 6 : null, armR: vai >= 1 ? 40 : 14 });
  }
  return { svg: cam(s, 960, 540, vai > 0 ? 1.02 : 1.06), html: '' };
}

// ---------------------------------------------------------------- 4. TERCEIRA CENA: A MANJEDOURA (Lucas 2:1-7)
const scIndice3 = (t) => ({ svg: indice(t, 3, 'Lucas', { t0: at(L(4, 0)), sub: '2:1-7' }), html: '' });
function scSoLucas(t) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const tm = seg(L(4, 1)), tl = wt(L(4, 1), 'mas') - 0.1;
  s += livroCard(600, 260, 560, 440, 'Mateus', { pin: pop(t, tm - 0.1, 0.45), sub: '2:1' });
  const b = pop(t, wt(L(4, 1), 'belém') - 0.15, 0.4);
  if (b > 0) s += `<g transform="translate(600 520) scale(${f1(b * 100) / 100})">${rect(-170, -50, 340, 100, C.g300, `rx="24" stroke="${C.border}" stroke-width="4"`)}${label(0, 18, 'nasceu em Belém', { size: 40, w: 700 })}</g>`;
  s += livroCard(1320, 260, 560, 440, 'Lucas', { pin: pop(t, tl, 0.45), hl: pop(t, wt(L(4, 1), 'lucas') - 0.1, 0.4), sub: '2:1-7' });
  const m = pop(t, wt(L(4, 1), 'manjedoura') - 0.15, 0.45);
  if (m > 0) s += opg(m, manjedoura(1320, 640, 0.6, { bebe: true }));
  return { svg: s, html: '' };
}
// A estrada de Nazaré a Belém, por causa do recenseamento (Lucas 2:1-5).
function scViagem(t) {
  const tr = wt(L(4, 2), 'recenseamento') - 0.2, ed = pop(t, tr, 0.45) * (1 - prog(t, wt(L(4, 2), 'josé') - 0.2, wt(L(4, 2), 'josé') + 0.2));
  const go = prog(t, wt(L(4, 2), 'josé') - 0.4, fim(L(4, 2)) + 0.6);
  let s = bgDay(t, { seed: 41, sunX: 300, sunY: 230 });
  s += vila(1650, GROUND + 8, 0.6) + label(1650, GROUND - 150, 'Belém', { size: 34, w: 700, fill: C.ink, op: clamp(go * 3) });
  s += `<path d="M -40 ${FLOOR_Y - 20} C 600 ${FLOOR_Y - 60} 1300 ${FLOOR_Y - 60} ${W + 40} ${FLOOR_Y - 30} L ${W + 40} ${H + 20} L -40 ${H + 20} Z" fill="#E6DCCF" stroke="${C.ink}" stroke-width="5"/>`;
  const x = lerp(260, 1240, E.inOut(go));
  s += person({ ...JOSE, x: x + 150, y: FLOOR_Y, s: 1.3, look: 1, walk: go > 0 && go < 1 ? t * 5 : null, armR: 26 }) + cajado(x + 150 + 70, FLOOR_Y, FLOOR_Y - 250, 0.9);
  s += person({ ...MARIA, x, y: FLOOR_Y + 6, s: 1.25, look: 1, walk: go > 0 && go < 1 ? t * 5 + 1 : null, armL: 40, armR: 40 });
  // o decreto
  if (ed > 0) s += `<g transform="translate(960 300) scale(${f1(ed * 100) / 100})">${rect(-260, -120, 520, 240, '#F3EAD6', `rx="16" ${ink(6)}`)}${label(0, -40, 'DECRETO', { fam: 'Gasoek One', size: 56, w: 400, fill: '#6B2A2A' })}${label(0, 30, 'recenseamento', { size: 40, w: 700 })}${label(0, 80, 'de todo o império', { size: 30, w: 600, fill: C.muted })}</g>`;
  return { svg: cam(s, lerp(860, 1060, go), 540, 1.02), html: '' };
}
// Belém de noite, a hospedaria sem lugar, o parto e a manjedoura (Lucas 2:6-7).
function belemNoite(t) {
  let s = bgNight(t, { moonX: 1640, moonY: 170 });
  s += vila(420, GROUND + 6, 1.0, { noite: true, luzes: true });
  s += `<path d="M -40 ${FLOOR_Y - 20} L ${W + 40} ${FLOOR_Y - 20} L ${W + 40} ${H + 20} L -40 ${H + 20} Z" fill="#2A2420" stroke="${NOITE_OL}" stroke-width="5"/>`;
  return s;
}
function scHora(t) {
  const tb = seg(L(4, 4)), te = wt(L(4, 5), 'envolveu') - 0.2, tc = wt(L(4, 5), 'manjedoura') - 0.3, th = wt(L(4, 5), 'hospedaria') - 0.3;
  let s = belemNoite(t);
  s += `<circle cx="1180" cy="700" r="520" fill="url(#gAmber)" opacity="${f1((0.25 + 0.25 * prog(t, tb, tb + 1)) * 100) / 100}"/>`;
  s += lamparinaJ(1560, 760, t);
  const noCocho = t > tc;
  s += manjedoura(1180, FLOOR_Y, 0.95, { bebe: noCocho, ol: NOITE_OL });
  s += person({ ...JOSE, x: 1480, y: FLOOR_Y + 10, s: 1.3, look: -1, mood: 'happy', ol: NOITE_OL });
  const colo = t > tb && !noCocho;
  s += person({ ...MARIA, x: 860, y: FLOOR_Y + 10, s: 1.3, look: 1, mood: t > tb ? 'happy' : 'calm', kneel: t > te, armL: colo ? 60 : 16, armR: colo ? 70 : 16, ol: NOITE_OL });
  if (colo) s += bebeColo(905, FLOOR_Y - (t > te ? 150 : 190), 0.85, -12);
  // a hospedaria cheia: a porta acesa ao fundo, que se fecha
  const fecha = E.inOut(prog(t, th, th + 0.8));
  s += `<g opacity="${f1((1 - 0.6 * fecha) * 100) / 100}">${rect(360, GROUND - 120, 70, 110, C.a300, ink(4, NOITE_OL))}</g>`;
  const cx = lerp(1000, 1100, E.inOut(prog(t, tb, tc))), z = 1.0 + 0.2 * E.inOut(prog(t, tb - 0.3, te));
  return { svg: cam(s, cx, 760, z, 960 - cx), html: '' };
}
// Só a manjedoura: Lucas não descreve o lugar (Lucas 2:7).
function scCocho(t) {
  const tl = seg(L(4, 7)), vazio = E.inOut(prog(t, tl, tl + 0.8)), td = seg(L(4, 8)), l = 0.35 + 0.4 * E.out(prog(t, td, td + 1));
  let s = belemNoite(t);
  s += `<rect width="${W}" height="${H}" fill="#0F0D0C" opacity="${f1(vazio * 0.92 * 100) / 100}"/>`;
  s += `<circle cx="960" cy="560" r="${f1(420 + 120 * l)}" fill="url(#gAmber)" opacity="${f1(l * 100) / 100}"/>`;
  s += manjedoura(960, 800, 1.6, { bebe: true, ol: NOITE_OL });
  // "cocho onde os animais comem": a palha que cai
  const tc = seg(L(4, 6));
  for (let i = 0; i < 5; i++) { const p = prog(t, tc + i * 0.25, tc + 1.4 + i * 0.25); if (p > 0 && p < 1) s += `<line x1="${760 + i * 90}" y1="${f1(380 + p * 220)}" x2="${780 + i * 90}" y2="${f1(360 + p * 220)}" stroke="#D9B45A" stroke-width="6" stroke-linecap="round" opacity="${f1((1 - p) * 100) / 100}"/>`; }
  return { svg: cam(s, 960, 520, 1.0 + 0.08 * prog(t, at(L(4, 6)), at(L(4, 9)))), html: '' };
}
function scBerco(t) {
  const l = 0.6 + 0.3 * E.out(prog(t, at(L(4, 9)), wt(L(4, 9), 'cocho')));
  let s = `<rect width="${W}" height="${H}" fill="#110E0C"/>` + `<circle cx="960" cy="520" r="760" fill="url(#gAmber)" opacity="${f1(l * 100) / 100}"/>` + `<circle cx="960" cy="560" r="300" fill="url(#gWhite)" opacity="${f1(l * 0.6 * 100) / 100}"/>`;
  s += manjedoura(960, 830, 1.9, { bebe: true, ol: NOITE_OL });
  return { svg: cam(s, 960, 560, lerp(1.0, 1.25, E.inOut(prog(t, at(L(4, 9)), at(L(5, 0)))))), html: '' };
}

// ---------------------------------------------------------------- 5. QUARTA CENA: OS PASTORES (Lucas 2:8-20)
const scIndice4 = (t) => ({ svg: indice(t, 4, 'Lucas', { t0: at(L(5, 0)), sub: '2:8-20' }), html: '' });
function campo(t, o = {}) {
  const g = o.gloria || 0;
  let s = bgNight(t, { moonX: 260, moonY: 160, starOp: 1 - g });
  if (g > 0) s += `<rect width="${W}" height="${H}" fill="#FFF6DC" opacity="${f1(g * 0.55 * 100) / 100}"/>` + `<circle cx="960" cy="200" r="1100" fill="url(#gWhite)" opacity="${f1(g * 100) / 100}"/>`;
  s += vila(1700, GROUND + 4, 0.5, { noite: true, luzes: true });
  return s;
}
const PASTORES = [[420, 1401], [700, 1402], [1060, 1403]];
const OVELHAS = [[220, 0.9, 1], [560, 0.8, -1], [880, 0.85, 1], [1280, 0.95, -1], [1500, 0.8, 1], [1720, 0.9, -1]];
function rebanho(t, o = {}) {
  let s = '';
  OVELHAS.forEach(([x, sc, lk], i) => (s += sheep(x, FLOOR_Y + 40 + (i % 2) * 20, sc, t + i, lk)));
  if (o.fogo !== false) s += flames(1300, FLOOR_Y - 10, 0.8, t, 7) + `<circle cx="1300" cy="${FLOOR_Y - 50}" r="200" fill="url(#gAmber)" opacity="0.6"/>`;
  PASTORES.forEach(([x, seed], i) => {
    const fear = o.medo ? o.medo : 0;
    const p = pastor(seed, { x: x + (o.recua || 0) * (i - 1) * 40, y: FLOOR_Y, s: 1.2, look: o.look ?? (i === 2 ? -1 : 1), mood: fear > 0.3 ? 'fear' : o.mood || 'calm', armL: fear > 0.3 ? 120 : 16, armR: fear > 0.3 ? 120 : 24, ol: o.ol, kneel: o.kneel, shake: fear > 0.3 ? 4 : 0, t });
    s += person(p);
    if (!o.kneel && fear <= 0.3) s += cajado(x + 80, FLOOR_Y, FLOOR_Y - 290, 0.85, o.ol || C.ink);
  });
  return s;
}
function scPastores(t) {
  return { svg: cam(campo(t) + rebanho(t, { ol: NOITE_OL }), 900, 560, 1.0 + 0.05 * prog(t, at(L(5, 1)), at(L(5, 2)))), html: '' };
}
function scGloria(t) {
  const ta = seg(L(5, 2)), a = E.out(prog(t, ta, ta + 0.8)), tg = wt(L(5, 2), 'glória') - 0.2, g = E.inOut(prog(t, tg, tg + 1.0));
  const medo = prog(t, wt(L(5, 3), 'aterrorizados') - 0.8, wt(L(5, 3), 'aterrorizados'));
  let s = campo(t, { gloria: g * 0.8 }) + rebanho(t, { medo: Math.max(medo, g > 0.5 ? 0.4 : 0), look: 1, recua: medo, ol: g > 0.5 ? C.ink : NOITE_OL });
  if (a > 0) s += anjo({ x: 1500, y: VERT ? 830 : 520, s: 1.3, look: -1, armL: 120, armR: 120, glow: 1, op: a });
  return { svg: cam(s, 1000, 540, 1.0 + 0.06 * prog(t, at(L(5, 2)), at(L(5, 4)))), html: '' };
}
function scAnuncio(t) {
  const ts = wt(L(5, 6), 'sinal') - 0.2, sb = pop(t, ts, 0.5);
  let s = campo(t, { gloria: 0.7 }) + rebanho(t, { medo: t < seg(L(5, 5)) ? 0.4 : 0, look: 1, mood: 'calm' });
  s += anjo({ x: 1500, y: VERT ? 830 : 520, s: 1.3, look: -1, armL: 20, armR: fala(t, 0, 999, 24, 40), glow: 1 });
  // o sinal: o bebê no cocho, num balão
  if (sb > 0) s += `<g transform="translate(${VERT ? 1260 : 1180} ${VERT ? 640 : 270}) scale(${f1(sb * (VERT ? 0.8 : 1) * 100) / 100})">${rect(-200, -150, 400, 300, '#fff', `rx="40" stroke="${C.border}" stroke-width="5"`)}${manjedoura(0, 110, 0.6, { bebe: true })}</g>`;
  return { svg: cam(s, 1060, 520, 1.04 + 0.05 * prog(t, at(L(5, 4)), at(L(5, 7)))), html: '' };
}
// Uma grande multidão do exército celestial (Lucas 2:13-14).
function scExercito(t) {
  const tm = seg(L(5, 7)) + 0.3, n = 26;
  let s = campo(t, { gloria: 0.85 }) + rebanho(t, { look: 1, mood: 'calm', kneel: t > seg(L(5, 9)) });
  for (let i = 0; i < n; i++) {
    const r = rng(500 + i), row = i % 3, x = 140 + ((i * 73) % 1640) + r() * 30, y = 220 + row * 110 + r() * 30, p = E.out(prog(t, tm + (i % 9) * 0.16, tm + 0.6 + (i % 9) * 0.16));
    if (p > 0) s += anjo({ x, y: y + 20 * Math.sin(t * 2 + i), s: 0.42 + row * 0.05, look: 0, armL: 120, armR: 120, glow: 0.5, op: p });
  }
  s += anjo({ x: 1500, y: VERT ? 830 : 520, s: 1.3, look: -1, armL: 120, armR: 120, glow: 1 });
  const z = 1.0 - 0.08 * E.inOut(prog(t, tm, tm + 2));
  return { svg: cam(s, 960, 480, z), html: '' };
}
// Os pastores correm e encontram o bebê na manjedoura (Lucas 2:15-16).
function scEncontraram(t) {
  const tc = wt(L(5, 10), 'correram') - 0.3, corre = E.inOut(prog(t, tc, tc + 1.6)), te = wt(L(5, 10), 'encontraram') - 0.2;
  let s;
  if (t < te) {
    s = campo(t) + `<path d="M -40 ${FLOOR_Y - 20} L ${W + 40} ${FLOOR_Y - 20} L ${W + 40} ${H + 20} L -40 ${H + 20} Z" fill="#2A2420" stroke="${NOITE_OL}" stroke-width="5"/>`;
    PASTORES.forEach(([x, seed], i) => (s += person(pastor(seed, { x: x + corre * 1500, y: FLOOR_Y, s: 1.2, look: 1, walk: t * 9 + i, mood: 'happy', ol: NOITE_OL }))));
  } else {
    s = belemNoite(t) + `<circle cx="1000" cy="700" r="560" fill="url(#gAmber)" opacity="0.45"/>` + lamparinaJ(1600, 760, t);
    s += manjedoura(1000, FLOOR_Y, 0.95, { bebe: true, ol: NOITE_OL });
    s += person({ ...MARIA, x: 760, y: FLOOR_Y + 10, s: 1.25, look: 1, mood: 'happy', kneel: true, ol: NOITE_OL });
    s += person({ ...JOSE, x: 1250, y: FLOOR_Y + 10, s: 1.3, look: -1, mood: 'happy', ol: NOITE_OL });
    const ch = E.out(prog(t, te, te + 1));
    PASTORES.forEach(([x, seed], i) => (s += person(pastor(seed, { x: lerp(2000, 1420 + i * 150, ch), y: FLOOR_Y + 14, s: 1.15, look: -1, mood: 'happy', ol: NOITE_OL, walk: ch < 1 ? t * 7 + i : null }))));
  }
  return { svg: cam(s, 960, 540, 1.02), html: '' };
}
function scSinal(t) {
  let s = belemNoite(t) + `<circle cx="960" cy="650" r="620" fill="url(#gAmber)" opacity="0.55"/>`;
  s += manjedoura(960, FLOOR_Y, 1.1, { bebe: true, ol: NOITE_OL });
  PASTORES.forEach(([x, seed], i) => (s += person(pastor(seed, { x: [600, 1320, 1500][i], y: FLOOR_Y + 14, s: 1.15, look: i ? -1 : 1, mood: 'happy', kneel: true, ol: NOITE_OL }))));
  return { svg: cam(s, 960, 790, lerp(1.0, 1.3, E.inOut(prog(t, at(L(5, 11)), at(L(6, 0)))))), html: '' };
}

// ---------------------------------------------------------------- 6. QUINTA CENA: SIMEÃO E ANA (Lucas 2:22-38)
const scIndice5 = (t) => ({ svg: indice(t, 5, 'Lucas', { t0: at(L(6, 0)), sub: '2:22-38' }), html: '' });
function jerusalem(t, o = {}) {
  let s = bgDay(t, { seed: 61, sunX: 1680, sunY: 170 });
  s += city(320, GROUND + 20, 0.85, t) + templo(1350, FLOOR_Y - 20, 1.0);
  s += `<path d="M -40 ${FLOOR_Y - 20} L ${W + 40} ${FLOOR_Y - 20} L ${W + 40} ${H + 20} L -40 ${H + 20} Z" fill="#E6DCCF" stroke="${C.ink}" stroke-width="5"/>`;
  return s;
}
function scSimeao(t) {
  const tr = wt(L(6, 1), 'revelação') - 0.3, l = E.out(prog(t, tr, tr + 0.8)), tn = seg(L(6, 2)), tt = seg(L(6, 3)), go = E.inOut(prog(t, tt, fim(L(6, 3)) + 0.4));
  let s = jerusalem(t);
  s += luzBeam(lerp(620, 1100, go), FLOOR_Y, l * (1 - go * 0.6));
  s += person({ ...SIMEAO, x: lerp(620, 1100, go), y: FLOOR_Y, s: 1.4, look: go > 0 ? 1 : 0, mood: l > 0.5 ? 'happy' : 'calm', armL: 20 + 60 * l * (1 - go), armR: 20 + 60 * l * (1 - go), walk: go > 0 && go < 1 ? t * 4 : null });
  const z = 1.0 + 0.25 * E.inOut(prog(t, tn - 0.3, tn + 0.6)) * (1 - E.inOut(prog(t, tt, tt + 0.8)));
  return { svg: cam(s, lerp(680, 1060, go), 760, z), html: '' };
}
// Simeão toma o menino nos braços (Lucas 2:27-30).
function patioTemplo(t, l = 0.3) {
  let s = `<rect width="${W}" height="${H}" fill="${C.g200}"/>`;
  [300, 760, 1160, 1620].forEach((x) => (s += rect(x - 44, 80, 88, 720, C.g100, ink(6)) + rect(x - 60, 60, 120, 32, C.g300, `rx="8" ${ink(6)}`)));
  s += rect(160, 50, 1600, 26, C.g300, ink(6));
  s += `<circle cx="960" cy="300" r="760" fill="url(#gAmber)" opacity="${f1(l * 100) / 100}"/>`;
  s += rect(-20, 800, W + 40, 400, C.g300) + `<line x1="0" y1="800" x2="${W}" y2="800" stroke="${C.ink}" stroke-width="6"/>`;
  return s;
}
function scColo(t) {
  const tp = wt(L(6, 4), 'pais') - 0.4, chega = E.out(prog(t, tp, tp + 1.2)), tb = wt(L(6, 4), 'braços') - 0.4, pega = t > tb;
  let s = patioTemplo(t, 0.25 + 0.3 * prog(t, tb, tb + 1));
  s += person({ ...JOSE, x: lerp(2100, 1520, chega), y: 820, s: 1.3, look: -1, walk: chega < 1 ? t * 5 : null });
  s += person({ ...MARIA, x: lerp(1950, 1330, chega), y: 820, s: 1.25, look: -1, armL: pega ? 16 : 60, armR: pega ? 16 : 70, walk: chega < 1 ? t * 5 + 1 : null });
  if (!pega) s += bebeColo(lerp(1950, 1330, chega) - 40, 820 - 190, 0.75, 12);
  s += person({ ...SIMEAO, x: 820, y: 820, s: 1.4, look: 1, mood: 'happy', armL: pega ? 60 : 20, armR: pega ? 70 : 40 });
  if (pega) s += bebeColo(870, 820 - 205, 0.82, -12);
  return { svg: cam(s, 1100, 520, 1.0 + 0.05 * prog(t, at(L(6, 4)), at(L(6, 5)))), html: '' };
}
function scDespedir(t) {
  const l = 0.4 + 0.3 * prog(t, at(L(6, 5)), fim(L(6, 6))) + 0.2 * Math.sin(t * 2);
  let s = patioTemplo(t, l);
  s += `<circle cx="960" cy="340" r="420" fill="url(#gWhite)" opacity="${f1(l * 0.7 * 100) / 100}"/>`;
  s += person({ ...SIMEAO, x: 960, y: 900, s: 2.1, look: 0, mood: t > seg(L(6, 7)) ? 'closed' : 'happy', armL: 60, armR: 70 });
  s += bebeColo(1020, 900 - 300, 1.2, -12);
  const tc = seg(L(6, 8)), z = lerp(1.0, 1.45, E.inOut(prog(t, tc - 0.3, tc + 1.2)));
  return { svg: cam(s, lerp(960, 1000, E.inOut(prog(t, tc - 0.3, tc + 1.2))), lerp(540, 440, E.inOut(prog(t, tc - 0.3, tc + 1.2))), z), html: '' };
}
// Ana, a profetisa, chega naquele exato momento (Lucas 2:36-38).
function scAna(t) {
  const tc = wt(L(6, 9), 'chegou') - 0.3, chega = E.out(prog(t, tc, tc + 1.4)), tf = seg(L(6, 10));
  let s = patioTemplo(t, 0.3);
  s += person({ ...SIMEAO, x: 640, y: 820, s: 1.3, look: 1, mood: 'happy', armL: 60, armR: 70 }) + bebeColo(686, 820 - 190, 0.76, -12);
  s += person({ ...MARIA, x: 460, y: 830, s: 1.2, look: 1, mood: 'happy' }) + person({ ...JOSE, x: 300, y: 830, s: 1.25, look: 1, mood: 'happy' });
  s += person({ ...ANA, x: lerp(2050, 1020, chega), y: 820, s: 1.25, look: -1, mood: 'happy', walk: chega < 1 ? t * 3.5 : null, lean: 6, armL: t > tf ? fala(t, 0, 999, 20, 40) : 16 });
  if (chega < 1) s += `<line x1="${f1(lerp(2050, 1020, chega) - 56)}" y1="820" x2="${f1(lerp(2050, 1020, chega) - 60)}" y2="${f1(820 - 260)}" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/><line x1="${f1(lerp(2050, 1020, chega) - 56)}" y1="820" x2="${f1(lerp(2050, 1020, chega) - 60)}" y2="${f1(820 - 260)}" stroke="${C.wood}" stroke-width="6" stroke-linecap="round"/>`;
  const ouv = E.out(prog(t, tf, tf + 1));
  for (let i = 0; i < 5; i++) s += person({ ...man(1601 + i), x: 1260 + i * 130, y: 860 + (i % 2) * 14, s: 1.0, look: -1, mood: 'happy', op: ouv, noShadow: true });
  return { svg: cam(s, lerp(900, 1100, ouv), 520, 1.02), html: '' };
}
// A oferta: duas rolinhas ou dois pombinhos (Lucas 2:24; Levítico 12:8).
function scRolinhas(t) {
  const tr = wt(L(6, 11), 'rolinhas') - 0.3, r = pop(t, tr, 0.5), tl = seg(L(6, 12)), law = pop(t, tl + 0.1, 0.5), tc = wt(L(6, 12), 'cordeiro') - 0.3;
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  if (t < tl) {
    s = patioTemplo(t, 0.25);
    s += person({ ...JOSE, x: 860, y: 900, s: 1.9, look: 0, mood: 'calm', armL: 52, armR: 52 });
    if (r > 0) s += `<g transform="translate(860 680) scale(${f1(r * 100) / 100})">${cesto(0, 0, 1.0)}${rolinha(-40, -62, 0.9, 1)}${rolinha(46, -58, 0.85, -1)}</g>`;
  } else {
    // a lei: um cordeiro, ou duas rolinhas
    if (!VERT) s += `<g transform="translate(960 160) scale(${f1(law * 100) / 100})">${rect(-330, -56, 660, 112, '#fff', `rx="28" stroke="${C.border}" stroke-width="4"`)}${label(0, 18, 'Lei de Moisés  ·  Levítico 12', { size: 40, w: 700 })}</g>`;
    const ca = pop(t, tl + 0.5, 0.5), dv = pop(t, wt(L(6, 12), 'quem') - 0.2, 0.5), op = 1 - 0.65 * prog(t, tc, tc + 0.5);
    if (ca > 0) s += opg(ca * op, `<g transform="translate(560 640)">${sheep(0, 120, 2.3, t, 1)}</g>` + label(560, VERT ? 480 : 860, 'um cordeiro', { size: 46, w: 700 }));
    s += label(960, 560, 'ou', { size: 60, w: 700, fill: C.muted, op: ca });
    if (dv > 0) s += opg(dv, `<g transform="translate(1360 600) scale(1.3)">${cesto(0, 0, 1.0)}${rolinha(-40, -62, 0.9, 1)}${rolinha(46, -58, 0.85, -1)}</g>` + label(1360, VERT ? 480 : 860, 'duas rolinhas', { size: 46, w: 700 }));
  }
  return { svg: cam(s, 960, 540, 1.0 + 0.03 * prog(t, at(L(6, 11)), at(L(6, 13)))), html: '' };
}
// Anos depois: "Vejam! É o Cordeiro de Deus" (João 1:29).
function scCordeiro(t) {
  const tv = wt(L(6, 13), 'vejam') - 0.3, aponta = E.back(prog(t, tv, tv + 0.4)), tj = wt(L(6, 13), 'jesus') - 0.6, vem = E.out(prog(t, tj, tj + 2.5));
  let s = bgDay(t, { seed: 71, sunX: 1700, sunY: 160 });
  s += `<path d="M -40 ${GROUND + 40} C 500 ${GROUND + 10} 1300 ${GROUND + 70} ${W + 40} ${GROUND + 30} L ${W + 40} ${GROUND + 150} C 1300 ${GROUND + 180} 500 ${GROUND + 120} -40 ${GROUND + 150} Z" fill="${C.b400}" ${ink(5)}/>`;
  s += `<path d="M -40 ${FLOOR_Y - 20} L ${W + 40} ${FLOOR_Y - 20} L ${W + 40} ${H + 20} L -40 ${H + 20} Z" fill="#E6DCCF" stroke="${C.ink}" stroke-width="5"/>`;
  s += person({ ...JOAO_B, x: 560, y: FLOOR_Y, s: 1.45, look: 1, mood: t > tv ? 'happy' : 'calm', armR: lerp(20, 100, aponta), armL: 18 });
  s += person({ ...JESUS, x: lerp(2050, 1400, vem), y: FLOOR_Y - 10, s: 1.4, look: -1, walk: vem > 0 && vem < 1 ? t * 4 : null });
  const lb = pop(t, wt(L(6, 13), 'cordeiro', -0.1), 0.45);
  if (lb > 0) s += `<g transform="translate(${VERT ? 1400 : 960} ${VERT ? 500 : 230}) scale(${f1(lb * (VERT ? 0.75 : 1) * 100) / 100})">${rect(-330, -60, 660, 120, C.b500, `rx="30"`)}${label(0, 22, 'Cordeiro de Deus', { size: 62, w: 800, fill: '#fff' })}</g>`;
  return { svg: cam(s, 960, 540, 1.0 + 0.04 * prog(t, at(L(6, 13)), at(L(7, 0)))), html: '' };
}

// ---------------------------------------------------------------- 7. SEXTA CENA: OS MAGOS (Mateus 2:1-12)
function scIndice6(t) {
  let s = indice(t, 6, 'Mateus', { t0: at(L(7, 0)), sub: '2:1-12' });
  // quando? a Bíblia não diz: um "?" entre o 5 e o 6
  const q = pop(t, wt(L(7, 0), 'bíblia') - 0.1, 0.45);
  if (q > 0) s += `<g transform="translate(${f1(520 + 4.5 * 146)} 690) scale(${f1(q * 100) / 100})">${rect(-70, -44, 140, 88, '#fff', `rx="44" stroke="${C.b500}" stroke-width="5"`)}${label(0, 18, '?', { size: 56, w: 800, fill: C.b500 })}</g>`;
  return { svg: s, html: '' };
}
function portaJerusalem(t) {
  let s = bgDusk(t);
  s += rect(1180, 140, 760, 720, '#CDBBA6', ink(6)) + `<path d="M 1380 860 L 1380 520 Q 1380 400 1500 400 Q 1620 400 1620 520 L 1620 860 Z" fill="#3B302A" ${ink(6)}/>`;
  for (let i = 0; i < 8; i++) s += rect(1180 + i * 95, 110, 60, 40, '#CDBBA6', ink(5));
  s += `<path d="M -40 ${FLOOR_Y - 20} L ${W + 40} ${FLOOR_Y - 20} L ${W + 40} ${H + 20} L -40 ${H + 20} Z" fill="#E1D5C6" stroke="${C.ink}" stroke-width="5"/>`;
  return s;
}
function scMagosJerusalem(t) {
  const tp = wt(L(7, 1), 'perguntaram') - 0.3, ch = E.out(prog(t, at(L(7, 1)), tp));
  let s = portaJerusalem(t);
  s += estrela(420, 180, 0.6, t, { glow: 0.5 });
  MAGOS.forEach((m, i) => (s += person({ ...m, x: lerp(-300, 880, ch) - i * 190, y: FLOOR_Y - i * 6, s: 1.3 - i * 0.04, look: 1, walk: ch < 1 ? t * 5 + i : null, armR: i === 0 && t > tp ? fala(t, tp, fim(L(7, 1)), 30, 60) : 18 })));
  for (let i = 0; i < 3; i++) s += person({ ...man(1701 + i), x: 1250 + i * 140, y: FLOOR_Y + 10, s: 1.1, look: -1, mood: t > tp + 1.5 ? 'fear' : 'calm', noShadow: true });
  return { svg: cam(s, lerp(700, 960, ch), 540, 1.02 + 0.04 * prog(t, tp, fim(L(7, 1)))), html: '' };
}
function trono(t, o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="${o.escuro ? '#1D1714' : '#E9DFD2'}"/>`;
  const ol = o.escuro ? NOITE_OL : C.ink;
  [240, 1680].forEach((x) => (s += rect(x - 52, 40, 104, 760, o.escuro ? '#3B2F28' : C.g100, ink(6, ol)) + rect(x - 70, 20, 140, 40, o.escuro ? '#2E2621' : C.g300, `rx="8" ${ink(6, ol)}`)));
  s += rect(-20, 800, W + 40, 400, o.escuro ? '#2A221E' : C.g300) + `<line x1="0" y1="800" x2="${W}" y2="800" stroke="${ol}" stroke-width="6"/>`;
  s += throne(o.x || 760, 800, 0.9, '#B08A3A');
  return s;
}
function scPerturbado(t) {
  const tr = seg(L(7, 3)), split = E.inOut(prog(t, tr + 0.6, tr + 1.3));
  let s = trono(t);
  s += person({ ...HERODES, x: 760, y: 800, s: 1.5, look: 1, mood: t > wt(L(7, 2), 'perturbado') - 0.4 ? 'fear' : 'calm', armL: 30, armR: 30 });
  if (split > 0) {
    // os dois "reis" da cena
    s += opg(split, `<rect x="960" width="${W - 960}" height="860" fill="#1A2230"/>` + `<line x1="960" y1="0" x2="960" y2="860" stroke="${C.ink}" stroke-width="8"/><line x1="960" y1="860" x2="${W}" y2="860" stroke="${C.ink}" stroke-width="8"/>` + estrela(1440, 430, 1.0, t, { ol: NOITE_OL }));
    const a = pop(t, wt(L(7, 3), 'herodes') - 0.1, 0.4), b = pop(t, wt(L(7, 3), 'menino') - 0.2, 0.4);
    if (a > 0 && !VERT) s += `<g transform="translate(560 170) scale(${f1(a * 100) / 100})">${rect(-280, -54, 560, 108, '#fff', `rx="26" stroke="${C.border}" stroke-width="4"`)}${label(0, 16, 'Mateus: "o rei Herodes"', { size: 38, w: 700 })}</g>`;
    if (b > 0 && !VERT) s += `<g transform="translate(1440 760) scale(${f1(b * 100) / 100})">${rect(-330, -54, 660, 108, C.b500, `rx="26"`)}${label(0, 16, 'magos: "o rei dos judeus"', { size: 38, w: 700, fill: '#fff' })}</g>`;
  }
  return { svg: cam(s, 960, 540, 1.0 + 0.03 * prog(t, at(L(7, 2)), at(L(7, 4)))), html: '' };
}
// Herodes chama os magos em segredo (Mateus 2:7-8).
function scSegredo(t) {
  const tg = seg(L(7, 5)), g = pop(t, tg - 0.1, 0.45), te = wt(L(7, 4), 'estrela') - 0.2, e = pop(t, te, 0.5);
  let s = trono(t, { escuro: true }) + `<circle cx="900" cy="560" r="520" fill="url(#gAmber)" opacity="0.35"/>` + lamparinaJ(1120, 720, t);
  s += person({ ...HERODES, x: 760, y: 800, s: 1.5, look: 1, mood: 'calm', armR: fala(t, seg(L(7, 4)), fim(L(7, 4)), 20, 40), ol: NOITE_OL, rim: C.a300 });
  MAGOS.forEach((m, i) => (s += person({ ...m, x: 1250 + i * 170, y: 820 + i * 4, s: 1.3, look: -1, ol: NOITE_OL, rim: C.a300 })));
  if (e > 0) s += `<g transform="translate(1000 ${VERT ? 560 : 230}) scale(${f1(e * (VERT ? 0.7 : 1) * 100) / 100})">${rect(-230, -130, 460, 260, '#fff', `rx="40" stroke="${g > 0 ? C.b500 : C.border}" stroke-width="${g > 0 ? 7 : 5}"`)}${estrela(-90, -10, 0.38, t, { glow: 0.3 })}${label(60, -8, 'quando', { size: 44, w: 800 })}${label(60, 46, 'apareceu?', { size: 44, w: 800 })}</g>`;
  if (g > 0) s += `<g transform="translate(1000 ${VERT ? 690 : 410}) scale(${f1(g * (VERT ? 0.8 : 1) * 100) / 100})">${rect(-210, -40, 420, 80, C.b500, `rx="40"`)}${label(0, 13, 'guarda esse detalhe', { fam: 'Geist Mono', size: 32, w: 600, fill: '#fff' })}</g>`;
  return { svg: cam(s, 980, 520, 1.02 + 0.04 * prog(t, at(L(7, 4)), at(L(7, 6)))), html: '' };
}
function scEnviou(t) {
  const ta = wt(L(7, 6), 'adorálo') - 0.6, sorriso = t > ta;
  let s = trono(t);
  s += person({ ...HERODES, x: 760, y: 800, s: 1.5, look: 1, mood: sorriso ? 'happy' : 'calm', armR: 90 });
  MAGOS.forEach((m, i) => (s += person({ ...m, x: 1250 + i * 170, y: 820 + i * 4, s: 1.3, look: -1, mood: 'calm' })));
  const z = 1.0 + 0.35 * E.inOut(prog(t, ta - 0.2, ta + 0.6));
  return { svg: cam(s, lerp(960, 760, E.inOut(prog(t, ta - 0.2, ta + 0.6))), lerp(540, 440, E.inOut(prog(t, ta - 0.2, ta + 0.6))), z), html: '' };
}
// A estrela vai adiante deles e para sobre o lugar onde estava o menino (Mateus 2:9).
function scEstrelaParou(t) {
  const tp = wt(L(7, 7), 'parou');
  const k = { x: E.inOut(prog(t, at(L(7, 7)) - 0.5, tp)), raio: E.out(prog(t, tp, tp + 1)), anda: E.inOut(prog(t, at(L(7, 7)) - 1, tp + 0.8)), andando: t < tp + 0.8 };
  const cx = lerp(700, 1300, E.inOut(prog(t, at(L(7, 7)), tp + 0.5)));
  return { svg: cam(estrelaCena(t, k), cx, 760, 1.05, 960 - cx), html: '' };
}
// Na casa: o menino com Maria; os magos se prostram e dão os presentes (Mateus 2:11).
function interiorCasa(t, l = 0.45) {
  let s = `<rect width="${W}" height="${H}" fill="#E9DFD2"/>` + rect(-20, 800, W + 40, 400, '#D7C9B8') + `<line x1="0" y1="800" x2="${W}" y2="800" stroke="${C.ink}" stroke-width="6"/>`;
  s += rect(1500, 260, 150, 170, '#1A2230', `rx="14" ${ink(6)}`) + estrela(1575, 330, 0.3, t, { glow: 0.4 });
  s += `<circle cx="560" cy="560" r="520" fill="url(#gAmber)" opacity="${f1(l * 100) / 100}"/>`;
  return s;
}
function scPresentes(t) {
  const tp = wt(L(7, 9), 'prostraram') - 0.3, pr = t > tp, gifts = ['ouro', 'incenso', 'mirra'].map((w) => pop(t, wt(L(7, 9), w) - 0.2, 0.45));
  let s = interiorCasa(t);
  s += person({ ...MARIA, x: 520, y: 820, s: 1.35, look: 1, mood: 'happy', armL: 60, armR: 70 }) + bebeColo(566, 820 - 200, 0.85, -12);
  MAGOS.forEach((m, i) => { const x = 960 + i * 250; s += pr ? person({ ...m, x, y: 830, s: 1.25, look: -1, kneel: true, mood: 'closed', armL: 28, armR: 28, lean: -22 }) : person({ ...m, x: lerp(2100, x, E.out(prog(t, at(L(7, 8)), seg(L(7, 8)) + 1.2))), y: 830, s: 1.25, look: -1, walk: t < seg(L(7, 8)) + 1.2 ? t * 5 + i : null }); });
  if (gifts[0] > 0) s += opg(gifts[0], bau(800, 860, 0.9, t));
  if (gifts[1] > 0) s += opg(gifts[1], pote(900, 870, 0.8, '#CDBBA6', 1, t));
  if (gifts[2] > 0) s += opg(gifts[2], pote(990, 872, 0.75, '#8A5A6E', 0, t));
  ['ouro', 'incenso', 'mirra'].forEach((w, i) => { if (gifts[i] > 0) s += `<g transform="translate(${(VERT ? 900 : 760) + i * 170} ${VERT ? 500 : 250}) scale(${f1(gifts[i] * 100) / 100})">${rect(-80, -36, 160, 72, '#fff', `rx="36" stroke="${C.border}" stroke-width="4"`)}${label(0, 12, w, { fam: 'Geist Mono', size: 32, w: 600 })}</g>`; });
  return { svg: cam(s, 940, 540, 1.0 + 0.05 * prog(t, at(L(7, 8)), at(L(7, 10)))), html: '' };
}
// Manjedoura × casa (Lucas 2:16; Mateus 2:11).
function scManjedouraCasa(t) {
  const a = pop(t, seg(L(7, 10)) - 0.1, 0.5), b = pop(t, wt(L(7, 10), 'magos') - 0.2, 0.5);
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const quadro = (x, inner, titulo, sub) => `<clipPath id="q${x}"><rect x="${x - 420}" y="170" width="840" height="560" rx="44"/></clipPath><g clip-path="url(#q${x})">${inner}</g><rect x="${x - 420}" y="170" width="840" height="560" rx="44" fill="none" ${ink(6)}/>` + label(x, 810, titulo, { size: 52, w: 800 }) + label(x, 862, sub, { fam: 'Geist Mono', size: 30, w: 500, fill: C.muted });
  if (VERT) {
    const inL = `<rect x="0" y="0" width="1000" height="900" fill="#221C18"/><circle cx="500" cy="560" r="340" fill="url(#gAmber)" opacity="0.6"/>${manjedoura(500, 660, 0.8, { bebe: true, ol: NOITE_OL })}${person(pastor(1402, { x: 230, y: 690, s: 0.95, look: 1, kneel: true, mood: 'happy', ol: NOITE_OL }))}${person(pastor(1403, { x: 770, y: 690, s: 0.95, look: -1, kneel: true, mood: 'happy', ol: NOITE_OL }))}`;
    const inM = `<rect x="900" y="0" width="1100" height="900" fill="#E9DFD2"/><circle cx="1300" cy="520" r="340" fill="url(#gAmber)" opacity="0.45"/>${casa(1420, 700, 0.75, t, { luz: 0.6 })}${MAGOS.map((m, i) => person({ ...m, x: 1180 + i * 70, y: 712, s: 0.6, look: 1 })).join('')}`;
    const m2 = b > 0;
    s += quadroEm(m2 ? inM : inL, m2 ? [1000, 170, 840, 560] : [80, 170, 840, 560], [690, 450, 540, 360], 'mc');
    s += `<g transform="translate(960 846)">${rect(-190, -32, 380, 64, C.b500, `rx="32"`)}${label(0, 12, m2 ? 'Mateus: a casa' : 'Lucas: a manjedoura', { size: 32, w: 800, fill: '#fff' })}</g>`;
    return { svg: s, html: '' };
  }
  if (a > 0) s += opg(a, quadro(500, `<rect x="0" y="0" width="1000" height="900" fill="#221C18"/><circle cx="500" cy="560" r="340" fill="url(#gAmber)" opacity="0.6"/>${manjedoura(500, 660, 0.8, { bebe: true, ol: NOITE_OL })}${person(pastor(1402, { x: 230, y: 690, s: 0.95, look: 1, kneel: true, mood: 'happy', ol: NOITE_OL }))}${person(pastor(1403, { x: 770, y: 690, s: 0.95, look: -1, kneel: true, mood: 'happy', ol: NOITE_OL }))}`, 'Lucas: a manjedoura', 'os pastores · 2:16'));
  if (b > 0) s += opg(b, quadro(1420, `<rect x="900" y="0" width="1100" height="900" fill="#E9DFD2"/><circle cx="1300" cy="520" r="340" fill="url(#gAmber)" opacity="0.45"/>${casa(1420, 700, 0.75, t, { luz: 0.6 })}${MAGOS.map((m, i) => person({ ...m, x: 1180 + i * 70, y: 712, s: 0.6, look: 1 })).join('')}`, 'Mateus: a casa', 'os magos · 2:11'));
  return { svg: s, html: '' };
}
// Avisados em sonho, voltam por outro caminho (Mateus 2:12).
function scOutroCaminho(t) {
  const tv = wt(L(7, 11), 'caminho') - 1.0, vira = E.inOut(prog(t, tv, tv + 0.8)), go = prog(t, tv, fim(L(7, 11)) + 1);
  let s = bgNight(t, { moonX: 1640, moonY: 160 });
  s += vila(1650, GROUND + 4, 0.55, { noite: true, luzes: true });
  // duas estradas: a de Jerusalém (esquerda, cima) e a outra (direita, baixo)
  s += `<path d="M 960 ${FLOOR_Y + 300} C 900 ${FLOOR_Y + 60} 600 ${GROUND + 80} 160 ${GROUND + 30}" fill="none" stroke="#3A322C" stroke-width="70" stroke-linecap="round"/>`;
  s += `<path d="M 960 ${FLOOR_Y + 300} C 1020 ${FLOOR_Y + 60} 1300 ${GROUND + 120} 1900 ${GROUND + 90}" fill="none" stroke="#4A4038" stroke-width="70" stroke-linecap="round"/>`;
  s += label(280, GROUND - 10, 'Herodes', { size: 34, w: 700, fill: '#8A7F75' });
  const x = lerp(960, 1700, E.inOut(go)), y = lerp(FLOOR_Y + 60, GROUND + 110, E.inOut(go));
  MAGOS.forEach((m, i) => (s += person({ ...m, x: x - i * 90 * (1 - go * 0.5), y: y + i * 10, s: lerp(1.2, 0.6, go), look: vira > 0.5 ? 1 : -1, walk: go > 0 && go < 1 ? t * 5 + i : null, sil: '#0C0C0E', rim: '#5A5242', noShadow: true })));
  return { svg: cam(s, 960, 520, 1.02), html: '' };
}

// ---------------------------------------------------------------- 8. SÉTIMA CENA: HERODES E O EGITO (Mateus 2:13-21)
const scIndice7 = (t) => ({ svg: indice(t, 7, 'Mateus', { t0: at(L(8, 0)), sub: '2:13-21' }), html: '' });
function scFuga(t) {
  const ta = seg(L(8, 1)) + 0.4, a = E.out(prog(t, ta, ta + 0.8)), tl = seg(L(8, 3)), go = E.inOut(prog(t, tl, fim(L(8, 3)) + 0.4));
  let s;
  if (t < tl) s = sonho(t, { anjo: a, fala: true });
  else {
    s = bgNight(t, { moonX: 1500, moonY: 170 });
    s += `<path d="M -40 ${FLOOR_Y - 20} L ${W + 40} ${FLOOR_Y - 20} L ${W + 40} ${H + 20} L -40 ${H + 20} Z" fill="#2A2420" stroke="${NOITE_OL}" stroke-width="5"/>`;
    s += vila(200, GROUND + 4, 0.6, { noite: true }) + palmeira(1700, GROUND + 40, 0.5, NOITE_OL, '#3A2E26', '#2E3A26');
    const x = lerp(500, 1500, go);
    s += person({ ...JOSE, x: x + 140, y: FLOOR_Y, s: 1.25, look: 1, walk: t * 5, sil: '#0C0C0E', rim: '#5A5242', noShadow: true }) + cajado(x + 210, FLOOR_Y, FLOOR_Y - 240, 0.85, '#0C0C0E');
    s += person({ ...MARIA, x, y: FLOOR_Y + 6, s: 1.2, look: 1, walk: t * 5 + 1, armL: 60, armR: 70, sil: '#0C0C0E', rim: '#5A5242', noShadow: true });
  }
  return { svg: cam(s, t < tl ? 1060 : lerp(800, 1150, go), 560, 1.02), html: '' };
}
function scFurioso(t) {
  const tm = wt(L(8, 5), 'matar') - 0.3, ap = E.back(prog(t, tm, tm + 0.4)), sai = E.in(prog(t, tm + 0.4, fim(L(8, 5)) + 0.6));
  let s = trono(t, { escuro: true }) + `<circle cx="760" cy="440" r="640" fill="url(#gAmber)" opacity="0.25"/>`;
  s += person({ ...HERODES, x: 760, y: 800, s: 1.55, look: 1, mood: 'angry', armR: lerp(30, 96, ap), armL: 30, ol: NOITE_OL, rim: C.a300, shake: t < tm ? 3 : 0, t });
  for (let i = 0; i < 4; i++) s += person({ ...soldado(1801 + i), x: 1220 + i * 150 + sai * 900, y: 860 + (i % 2) * 14, s: 1.2, look: 1, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26, walk: sai > 0 ? t * 6 + i : null, sil: '#0E0B09', rim: '#6A4E34', noShadow: true });
  return { svg: cam(s, 900, 520, 1.02 + 0.06 * prog(t, at(L(8, 4)), at(L(8, 6)))), html: '' };
}
// O detalhe pago: a pergunta sobre a estrela vira o limite de dois anos (Mateus 2:7, 16).
function scDoisAnos(t) {
  const t0 = seg(L(8, 6)), td = wt(L(8, 6), 'dois') - 0.2;
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const q = pop(t, t0, 0.45), d = E.inOut(prog(t, td, td + 0.6));
  if (VERT) {
    s += `<g transform="translate(960 540) scale(${f1(q * 0.78 * 100) / 100})">${rect(-230, -130, 460, 260, '#fff', `rx="40" stroke="${C.b500}" stroke-width="6"`)}${estrela(-90, -10, 0.38, t, { glow: 0.3 })}${label(60, -8, 'quando', { size: 44, w: 800 })}${label(60, 46, 'apareceu?', { size: 44, w: 800 })}</g>`;
    if (d > 0) s += opg(d, `<path d="M 960 660 L 960 690" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/><path d="M 940 676 L 960 700 L 980 676" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>`) + `<g transform="translate(960 790) scale(${f1(pop(t, td + 0.2, 0.5) * 0.78 * 100) / 100})">${rect(-240, -110, 480, 220, C.b500, `rx="40"`)}${label(0, 34, '2 anos', { fam: 'Gasoek One', size: 110, w: 400, fill: '#fff' })}</g>`;
    return { svg: s, html: '' };
  }
  s += `<g transform="translate(${f1(lerp(960, 560, d))} 420) scale(${f1(q * 100) / 100})">${rect(-230, -130, 460, 260, '#fff', `rx="40" stroke="${C.b500}" stroke-width="6"`)}${estrela(-90, -10, 0.38, t, { glow: 0.3 })}${label(60, -8, 'quando', { size: 44, w: 800 })}${label(60, 46, 'apareceu?', { size: 44, w: 800 })}</g>`;
  if (d > 0) {
    s += opg(d, `<path d="M 830 420 L 1060 420" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/><path d="M 1040 392 L 1080 420 L 1040 448" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`);
    s += `<g transform="translate(1380 420) scale(${f1(pop(t, td + 0.2, 0.5) * 100) / 100})">${rect(-240, -130, 480, 260, C.b500, `rx="40"`)}${label(0, 24, '2 anos', { fam: 'Gasoek One', size: 110, w: 400, fill: '#fff' })}</g>`;
  }
  s += label(960, 760, 'Mateus 2:7 e 2:16', { fam: 'Geist Mono', size: 32, w: 500, fill: C.muted, op: q });
  return { svg: s, html: '' };
}
function scQueriaMorto(t) {
  const tq = wt(L(8, 7), 'morto') - 0.4;
  let s = trono(t, { escuro: true }) + `<circle cx="760" cy="400" r="560" fill="url(#gAmber)" opacity="0.2"/>`;
  s += person({ ...HERODES, x: 760, y: 800, s: 1.55, look: 1, mood: t > tq ? 'angry' : 'happy', ol: NOITE_OL, rim: C.a300 });
  const q = pop(t, seg(L(8, 7)), 0.45), x = E.out(prog(t, tq, tq + 0.4));
  if (q > 0) s += `<g transform="translate(${VERT ? 1040 : 1340} ${VERT ? 640 : 400}) scale(${f1(q * (VERT ? 0.6 : 1) * 100) / 100})">${rect(-380, -90, 760, 180, '#fff', `rx="36" stroke="${C.border}" stroke-width="4"`)}${label(0, -6, '"para que eu também', { size: 46, w: 700, fill: C.ink })}${label(0, 52, 'vá adorá-lo"', { size: 46, w: 700, fill: C.ink })}${x > 0 ? `<line x1="-330" y1="${f1(16)}" x2="${f1(-330 + 660 * x)}" y2="16" stroke="${C.r600}" stroke-width="12" stroke-linecap="round"/>` : ''}</g>`;
  return { svg: cam(s, 1000, 520, 1.02 + 0.08 * prog(t, at(L(8, 7)), at(L(8, 8)))), html: '' };
}
function scVolta(t) {
  const go = E.inOut(prog(t, at(L(8, 8)) + 0.4, fim(L(8, 8)) + 0.6));
  let s = bgDay(t, { seed: 81, sunX: 300, sunY: 200 });
  s += palmeira(1580, GROUND + 60, 0.75) + palmeira(1780, GROUND + 40, 0.6);
  s += `<path d="M -40 ${FLOOR_Y - 20} L ${W + 40} ${FLOOR_Y - 20} L ${W + 40} ${H + 20} L -40 ${H + 20} Z" fill="#EAD9B9" stroke="${C.ink}" stroke-width="5"/>`;
  const x = lerp(1500, 600, go);
  s += person({ ...MARIA, x: x + 150, y: FLOOR_Y + 6, s: 1.25, look: -1, walk: go > 0 && go < 1 ? t * 5 : null });
  s += person({ ...man(1901), robe: '#E9E1D8', hair: '#2F2622', beard: false, cover: null, x: x + 30, y: FLOOR_Y + 10, s: 0.6, look: -1, walk: go > 0 && go < 1 ? t * 7 : null });
  s += person({ ...JOSE, x: x - 120, y: FLOOR_Y, s: 1.3, look: -1, walk: go > 0 && go < 1 ? t * 5 + 1 : null }) + cajado(x - 190, FLOOR_Y, FLOOR_Y - 250, 0.9);
  return { svg: cam(s, 960, 540, 1.02), html: '' };
}

// ---------------------------------------------------------------- 9. FECHAMENTO
function scReiJudeus(t) {
  let s = tresPalavras(t, { t0: at(L(9, 0)) - 0.4, rev: wt(L(9, 0), 'rei') - 0.1, y: 360, col: VERT });
  const m = VERT ? 0 : pop(t, wt(L(9, 0), 'viajantes') - 0.3, 0.5);
  if (m > 0) s += opg(m, MAGOS.map((mg, i) => person({ ...mg, x: 760 + i * 200, y: 900, s: 1.1, look: 0, mood: 'happy' })).join('') + label(960, 1010, 'Mateus 2:2', { fam: 'Geist Mono', size: 30, w: 500, fill: C.muted }));
  return { svg: cam(s, 960, 540, 1.0 + 0.03 * prog(t, at(L(9, 0)), at(L(9, 1)))), html: '' };
}
// Nos quatro evangelhos, as palavras só voltam no dia em que Jesus morreu.
function scQuatro(t) {
  const t0 = seg(L(9, 1)), tm = wt(L(9, 1), 'morreu') - 0.3;
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const nomes = ['Mateus', 'Marcos', 'Lucas', 'João'], refs = ['2:2 · 27:11, 29, 37', '15:2, 9, 12, 18, 26', '23:3, 37, 38', '18:33, 39 · 19:3, 19, 21'];
  if (VERT) {
    nomes.forEach((n, i) => {
      const x = 820 + (i % 2) * 280, y = 460 + Math.floor(i / 2) * 200, p = pop(t, t0 + 0.6 + i * 0.12, 0.45), lit = pop(t, tm + i * 0.15, 0.4);
      s += livroCard(x, y, 250, 175, n, { pin: p, hl: lit });
      if (lit > 0) s += opg(lit, crossFig(x, y + 160, 0.15, { fill: SIL, plaque: true, body: false }));
    });
    return { svg: s, html: '' };
  }
  nomes.forEach((n, i) => {
    const x = 330 + i * 420, p = pop(t, t0 + 0.6 + i * 0.12, 0.45), lit = pop(t, tm + i * 0.15, 0.4);
    s += livroCard(x, 300, 360, 380, n, { pin: p, hl: lit, sub: lit > 0 ? refs[i] : '' });
    if (lit > 0) s += opg(lit, crossFig(x, 600, 0.36, { fill: SIL, plaque: true, body: false }));
  });
  if (pop(t, tm, 0.4) > 0) s += label(960, 860, 'no dia da cruz', { size: 50, w: 800, fill: C.b500, op: pop(t, tm, 0.4) });
  return { svg: s, html: '' };
}
function palacio(t) {
  let s = bgDay(t, { seed: 881, sunX: 300, sunY: 200 });
  [300, 620, 1300, 1620].forEach((x) => (s += rect(x - 44, 120, 88, 560, C.g100, ink(6)) + rect(x - 60, 100, 120, 32, C.g300, `rx="8" ${ink(6)}`)));
  s += rect(200, 90, 1520, 26, C.g300, ink(6));
  s += `<path d="M -40 ${FLOOR_Y - 20} L ${W + 40} ${FLOOR_Y - 20} L ${W + 40} ${H + 20} L -40 ${H + 20} Z" fill="${C.g300}" stroke="${C.ink}" stroke-width="5"/>`;
  return s;
}
function scPilatos(t) {
  let s = palacio(t);
  s += person({ ...PILATOS, x: 1240, y: FLOOR_Y, s: 1.5, look: -1, mood: 'calm', armR: fala(t, seg(L(9, 2)), fim(L(9, 2)), 30, 50) });
  s += person({ ...JESUS, x: 700, y: FLOOR_Y + 10, s: 1.5, look: 1, mood: 'closed', armL: 8, armR: 8 });
  s += `<line x1="666" y1="${f1(FLOOR_Y + 10 - 70 * 1.5)}" x2="734" y2="${f1(FLOOR_Y + 10 - 70 * 1.5)}" stroke="#7A5A3A" stroke-width="6"/>`;
  s += person({ ...soldado(2001), x: 420, y: FLOOR_Y + 10, s: 1.35, look: 1, gear: { helmet: 'rom', armor: true, spear: 'r' }, armR: 26 });
  return { svg: cam(s, 960, 540, 1.02 + 0.04 * prog(t, at(L(9, 2)), at(L(9, 3)))), html: '' };
}
// O pretório: os soldados se ajoelham e zombam (Mateus 27:29).
function pretorio(t, o) {
  let s = `<rect width="${W}" height="${H}" fill="${C.g200}"/>`;
  [360, 1560].forEach((x) => (s += rect(x - 52, 40, 104, 740, C.g100, ink(6)) + rect(x - 70, 20, 140, 40, C.g300, `rx="8" ${ink(6)}`)));
  s += rect(-20, 780, W + 40, 400, C.g300) + `<line x1="0" y1="780" x2="${W}" y2="780" stroke="${C.ink}" stroke-width="6"/>`;
  const sal = o.salve || 0;
  [[640, 891, 1], [1280, 892, -1], [480, 893, 1], [1440, 894, -1]].forEach(([x, seed, lk]) => {
    const sd = soldado(seed, { x, y: 860, s: 1.2, look: lk });
    s += person(o.kneel ? { ...sd, kneel: true, mood: 'happy', armL: lerp(20, 150, sal), armR: lerp(20, 150, sal) } : { ...sd, mood: 'happy', armR: 26, gear: { ...sd.gear, spear: 'r' } });
  });
  s += person({ ...JESUS, robe: MANTO, x: 960, y: 860, s: 1.45, mood: 'closed', armR: 30 });
  const hx = 960 + (34 + 86 * Math.sin(Math.PI / 6)) * 1.45, hy = 860 + (-154 + 86 * Math.cos(Math.PI / 6)) * 1.45;
  s += `<line x1="${f1(hx - 10)}" y1="${f1(hy + 50)}" x2="${f1(hx + 24)}" y2="${f1(hy - 230)}" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/><line x1="${f1(hx - 10)}" y1="${f1(hy + 50)}" x2="${f1(hx + 24)}" y2="${f1(hy - 230)}" stroke="${C.olive}" stroke-width="6" stroke-linecap="round"/>`;
  s += thornCrown(960, 860, 1.45, 0);
  return s;
}
function scZombaram(t) {
  const tk = wt(L(9, 3), 'ajoelharam') - 0.3, ts = wt(L(9, 3), 'salve') - 0.15;
  return { svg: cam(pretorio(t, { kneel: t > tk, salve: E.back(prog(t, ts, ts + 0.4)) }), 960, 680, 1.0 + 0.05 * prog(t, at(L(9, 3)), at(L(9, 4)))), html: '' };
}
// A acusação escrita na cruz (Mateus 27:37).
function scPlaca(t) {
  const tc = wt(L(9, 4), 'cruz') - 0.3, rev = prog(t, wt(L(9, 4), 'acusação'), fim(L(9, 4)) + 0.2);
  let s = bgGloom(t, { seed: 911 });
  s += hill(960, 880, 1300, '#D6CCC1', C.ink);
  s += VERT ? crossFig(960, 1320, 1.3, { plaque: false, fill: SIL, rim: C.g300 }) : crossFig(960, 1080, 1.65, { plaque: false, fill: SIL, rim: C.g300 });
  // a placa grande, por cima da cabeça
  const pl = pop(t, tc, 0.5);
  if (pl > 0) {
    s += `<g transform="translate(960 ${VERT ? 540 : 170}) scale(${f1(pl * (VERT ? 0.62 : 1) * 100) / 100})">${rect(-430, -90, 860, 180, '#8A6A4D', `rx="12" ${ink(8)}`)}${rect(-404, -66, 808, 132, '#A07E5E', `rx="8"`)}`;
    const l1 = 'ESTE É JESUS,', l2 = 'O REI DOS JUDEUS', n = Math.floor(clamp(rev) * (l1.length + l2.length));
    s += label(0, -6, l1.slice(0, n), { size: 54, w: 800, fill: '#2B1F17' }) + label(0, 54, l2.slice(0, Math.max(0, n - l1.length)), { size: 54, w: 800, fill: '#2B1F17' }) + '</g>';
  }
  return { svg: cam(s, 960, 520, 1.0 + 0.05 * prog(t, at(L(9, 4)), at(L(9, 5)))), html: '' };
}
// O mesmo título: os magos se prostram para adorar; os soldados se ajoelham para zombar.
function scMesmoTitulo(t) {
  const a = pop(t, at(L(9, 5)) + 0.2, 0.5), b = pop(t, wt(L(9, 5), 'crucificado') - 0.2, 0.5);
  const hl1 = pop(t, wt(L(9, 6), 'adorar') - 0.3, 0.4), hl2 = pop(t, wt(L(9, 6), 'zombar') - 0.3, 0.4);
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const quadro = (x, inner, titulo, hl) => `<clipPath id="m${x}"><rect x="${x - 420}" y="200" width="840" height="520" rx="44"/></clipPath><g clip-path="url(#m${x})">${inner}</g><rect x="${x - 420}" y="200" width="840" height="520" rx="44" fill="none" stroke="${hl > 0 ? C.b500 : C.ink}" stroke-width="${hl > 0 ? 9 : 6}"/>` + label(x, 800, titulo, { size: 52, w: 800, fill: hl > 0 ? C.b500 : C.inkDeep });
  const inA = `<rect x="0" y="0" width="1000" height="900" fill="#E9DFD2"/><circle cx="360" cy="460" r="300" fill="url(#gAmber)" opacity="0.5"/>${person({ ...MARIA, x: 270, y: 640, s: 0.95, look: 1, mood: 'happy', armL: 60, armR: 70 })}${bebeColo(302, 500, 0.6, -12)}${MAGOS.map((m, i) => person({ ...m, x: 470 + i * 150, y: 650, s: 0.9, look: -1, kneel: true, mood: 'closed', armL: 28, armR: 28, lean: -22 })).join('')}`;
  const inB = `<rect x="900" y="0" width="1100" height="900" fill="${C.g200}"/>${person({ ...JESUS, robe: MANTO, x: 1420, y: 640, s: 0.95, mood: 'closed' })}${thornCrown(1420, 640, 0.95, 0)}${[[1200, 891, 1], [1640, 892, -1]].map(([x, sd, lk]) => person({ ...soldado(sd, { x, y: 650, s: 0.9, look: lk }), kneel: true, mood: 'happy', armL: 150, armR: 150 })).join('')}`;
  if (VERT) {
    const b2 = t > wt(L(9, 6), 'outros') - 0.2;
    s += quadroEm(b2 ? inB : inA, b2 ? [1000, 200, 840, 520] : [80, 200, 840, 520], [690, 450, 540, 334], 'mv', { hl: b2 ? hl2 : hl1 });
    s += `<g transform="translate(960 ${b2 ? 812 : 812})">${rect(-150, -34, 300, 68, b2 ? C.ink : C.b500, `rx="34"`)}${label(0, 13, b2 ? 'pra zombar' : 'pra adorar', { size: 36, w: 800, fill: '#fff' })}</g>`;
    return { svg: s, html: '' };
  }
  s += `<g transform="translate(960 120)">${rect(-300, -50, 600, 100, C.b500, `rx="50"`)}${label(0, 18, 'rei dos judeus', { size: 50, w: 800, fill: '#fff' })}</g>`;
  if (a > 0) s += opg(a, quadro(500, `<rect x="0" y="0" width="1000" height="900" fill="#E9DFD2"/><circle cx="360" cy="460" r="300" fill="url(#gAmber)" opacity="0.5"/>${person({ ...MARIA, x: 270, y: 640, s: 0.95, look: 1, mood: 'happy', armL: 60, armR: 70 })}${bebeColo(302, 500, 0.6, -12)}${MAGOS.map((m, i) => person({ ...m, x: 470 + i * 150, y: 650, s: 0.9, look: -1, kneel: true, mood: 'closed', armL: 28, armR: 28, lean: -22 })).join('')}`, 'pra adorar', hl1));
  if (b > 0) s += opg(b, quadro(1420, `<rect x="900" y="0" width="1100" height="900" fill="${C.g200}"/>${person({ ...JESUS, robe: MANTO, x: 1420, y: 640, s: 0.95, mood: 'closed' })}${thornCrown(1420, 640, 0.95, 0)}${[[1200, 891, 1], [1640, 892, -1]].map(([x, sd, lk]) => person({ ...soldado(sd, { x, y: 650, s: 0.9, look: lk }), kneel: true, mood: 'happy', armL: 150, armR: 150 })).join('')}`, 'pra zombar', hl2));
  return { svg: s, html: '' };
}
// Emanuel no começo; "eu estarei sempre com vocês" na última frase (Mateus 1:23; 28:20).
function scEmanuelFim(t) {
  const t0 = seg(L(9, 7)), tl = seg(L(9, 9)), m = E.inOut(prog(t, tl - 0.2, tl + 0.8));
  let s;
  if (m < 1) {
    s = cartaoNome(t, { t0: wt(L(9, 7), 'emanuel') - 0.15, t1: wt(L(9, 7), 'deus') - 0.15 });
    const lv = pop(t, seg(L(9, 8)), 0.45);
    if (lv > 0) s += `<g transform="translate(960 860) scale(${f1(lv * 100) / 100})">${rect(-300, -48, 600, 96, '#fff', `rx="48" stroke="${C.border}" stroke-width="4"`)}${label(0, 14, 'Mateus 1:23', { fam: 'Geist Mono', size: 36, w: 600 })}</g>`;
    if (m > 0) s = opg(1 - m, s);
  }
  if (m > 0) {
    let r = bgDay(t, { seed: 91, sunX: 1500, sunY: 230 });
    r += `<circle cx="1000" cy="300" r="700" fill="url(#gWhite)" opacity="0.55"/>` + hill(1000, 560, 1200, '#D9CDBF', C.ink);
    r += person({ ...JESUS, x: 1000, y: 600, s: 1.25, look: 0, mood: 'happy', armL: 40, armR: 40 });
    for (let i = 0; i < 6; i++) r += person({ ...man(2101 + i), x: 300 + i * 120 + (i > 2 ? 760 : 0), y: FLOOR_Y + (i % 2) * 14, s: 1.1, look: i > 2 ? -1 : 1, mood: 'happy' });
    const q = pop(t, wt(L(9, 9), 'estarei') - 0.2, 0.45);
    if (q > 0) r += `<g transform="translate(1000 140) scale(${f1(q * 100) / 100})">${rect(-460, -60, 920, 120, '#fff', `rx="40" stroke="${C.b500}" stroke-width="5"`)}${label(0, 18, '"eu estarei sempre com vocês"', { size: 46, w: 800 })}</g>`;
    s = (s || '') + opg(m, r);
  }
  return { svg: cam(s, 960, 540, 1.0 + 0.03 * prog(t, at(L(9, 7)), at(L(9, 10)))), html: '' };
}
// A pergunta final: qual das sete você não conhecia?
function scPergunta(t) {
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const t0 = at(L(9, 10));
  for (let n = 1; n <= 7; n++) {
    const x = 960 + (n - 4) * 230, p = pop(t, t0 + 0.1 + n * 0.06, 0.4), pulse = 1 + 0.12 * Math.sin(Math.PI * prog(t, seg(L(9, 10)) + 0.3 + n * 0.18, seg(L(9, 10)) + 0.65 + n * 0.18));
    if (p <= 0) continue;
    s += `<g transform="translate(${f1(x)} 420) scale(${f1(p * pulse * 100) / 100})">${rect(-100, -110, 200, 220, '#fff', `rx="30" stroke="${C.border}" stroke-width="4"`)}${icone(n, 0, 10, 0.95, t)}</g>`;
    s += dot(x, 580, n, 0.6 * p);
  }
  s += label(960, 800, 'Qual você não conhecia?', { size: 64, w: 800, op: pop(t, seg(L(9, 10)) + 0.2, 0.5) });
  return { svg: s, html: '' };
}
const scFim = (t) => endCard(t, AUDIO_END + 0.25, ['Mateus 1 e 2', 'Lucas 1 e 2', 'Mateus 27 e 28']);

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  // 1. abertura
  { a: 0, b: at(L(1, 2)), f: scEstrela, ref: 'Mateus 2:9', dark: true },
  { a: at(L(1, 2)), b: at(L(1, 4)), f: scOrdem, ref: 'Mateus 2:16', dark: true },
  { a: at(L(1, 4)), b: at(L(1, 11)), f: scSete, ref: null },
  { a: at(L(1, 11)), b: at(L(2, 0)), f: scTres, ref: null },
  // 2. primeira cena
  { a: at(L(2, 0)), b: at(L(2, 1)), f: scIndice1, ref: null },
  { a: at(L(2, 1)), b: at(L(2, 3)), f: scNazare, ref: 'Lucas 1:26-27' },
  { a: at(L(2, 3)), b: at(L(2, 5)), f: scNaoTema, ref: 'Lucas 1:30-31' },
  { a: at(L(2, 5)), b: at(L(2, 7)), f: scAltissimo, ref: 'Lucas 1:32-33' },
  { a: at(L(2, 7)), b: at(L(2, 10)), f: scComo, ref: 'Lucas 1:34-37' },
  { a: at(L(2, 10)), b: at(L(2, 11)), f: scServa, ref: 'Lucas 1:38' },
  { a: at(L(2, 11)), b: at(L(3, 0)), f: scReino, ref: null },
  // 3. segunda cena
  { a: at(L(3, 0)), b: at(L(3, 1)), f: scIndice2, ref: null },
  { a: at(L(3, 1)), b: at(L(3, 5)), f: scJose, ref: 'Mateus 1:18-19' },
  { a: at(L(3, 5)), b: at(L(3, 7)), f: scSonho, ref: 'Mateus 1:20-21', dark: true },
  { a: at(L(3, 7)), b: at(L(3, 9)), f: scEmanuel, ref: 'Mateus 1:22-23' },
  { a: at(L(3, 9)), b: at(L(4, 0)), f: scObedeceu, ref: 'Mateus 1:24', dark: (t) => t < wt(L(3, 9), 'recebeu') - 0.5 },
  // 4. terceira cena
  { a: at(L(4, 0)), b: at(L(4, 1)), f: scIndice3, ref: null },
  { a: at(L(4, 1)), b: at(L(4, 2)), f: scSoLucas, ref: null },
  { a: at(L(4, 2)), b: at(L(4, 3)), f: scViagem, ref: 'Lucas 2:1-5' },
  { a: at(L(4, 3)), b: at(L(4, 6)), f: scHora, ref: 'Lucas 2:6-7', dark: true },
  { a: at(L(4, 6)), b: at(L(4, 9)), f: scCocho, ref: null, dark: true },
  { a: at(L(4, 9)), b: at(L(5, 0)), f: scBerco, ref: null, dark: true },
  // 5. quarta cena
  { a: at(L(5, 0)), b: at(L(5, 1)), f: scIndice4, ref: null },
  { a: at(L(5, 1)), b: at(L(5, 2)), f: scPastores, ref: 'Lucas 2:8', dark: true },
  { a: at(L(5, 2)), b: at(L(5, 4)), f: scGloria, ref: 'Lucas 2:9', dark: (t) => t < wt(L(5, 2), 'glória') },
  { a: at(L(5, 4)), b: at(L(5, 7)), f: scAnuncio, ref: 'Lucas 2:10-12' },
  { a: at(L(5, 7)), b: at(L(5, 10)), f: scExercito, ref: 'Lucas 2:13-14' },
  { a: at(L(5, 10)), b: at(L(5, 11)), f: scEncontraram, ref: 'Lucas 2:15-16', dark: true },
  { a: at(L(5, 11)), b: at(L(6, 0)), f: scSinal, ref: null, dark: true },
  // 6. quinta cena
  { a: at(L(6, 0)), b: at(L(6, 1)), f: scIndice5, ref: null },
  { a: at(L(6, 1)), b: at(L(6, 4)), f: scSimeao, ref: 'Lucas 2:25-27' },
  { a: at(L(6, 4)), b: at(L(6, 5)), f: scColo, ref: 'Lucas 2:27-28' },
  { a: at(L(6, 5)), b: at(L(6, 9)), f: scDespedir, ref: 'Lucas 2:29-30' },
  { a: at(L(6, 9)), b: at(L(6, 11)), f: scAna, ref: 'Lucas 2:36-38' },
  { a: at(L(6, 11)), b: at(L(6, 13)), f: scRolinhas, ref: [[at(L(6, 11)), 'Lucas 2:24'], [at(L(6, 12)), 'Levítico 12:8']] },
  { a: at(L(6, 13)), b: at(L(7, 0)), f: scCordeiro, ref: 'João 1:29' },
  // 7. sexta cena
  { a: at(L(7, 0)), b: at(L(7, 1)), f: scIndice6, ref: null },
  { a: at(L(7, 1)), b: at(L(7, 2)), f: scMagosJerusalem, ref: 'Mateus 2:1-2' },
  { a: at(L(7, 2)), b: at(L(7, 4)), f: scPerturbado, ref: 'Mateus 2:1-3' },
  { a: at(L(7, 4)), b: at(L(7, 6)), f: scSegredo, ref: 'Mateus 2:7', dark: true },
  { a: at(L(7, 6)), b: at(L(7, 7)), f: scEnviou, ref: 'Mateus 2:8' },
  { a: at(L(7, 7)), b: at(L(7, 8)), f: scEstrelaParou, ref: 'Mateus 2:9', dark: true },
  { a: at(L(7, 8)), b: at(L(7, 10)), f: scPresentes, ref: 'Mateus 2:11' },
  { a: at(L(7, 10)), b: at(L(7, 11)), f: scManjedouraCasa, ref: null },
  { a: at(L(7, 11)), b: at(L(8, 0)), f: scOutroCaminho, ref: 'Mateus 2:12', dark: true },
  // 8. sétima cena
  { a: at(L(8, 0)), b: at(L(8, 1)), f: scIndice7, ref: null },
  { a: at(L(8, 1)), b: at(L(8, 4)), f: scFuga, ref: 'Mateus 2:13-14', dark: true },
  { a: at(L(8, 4)), b: at(L(8, 6)), f: scFurioso, ref: 'Mateus 2:16', dark: true },
  { a: at(L(8, 6)), b: at(L(8, 7)), f: scDoisAnos, ref: null },
  { a: at(L(8, 7)), b: at(L(8, 8)), f: scQueriaMorto, ref: null, dark: true },
  { a: at(L(8, 8)), b: at(L(9, 0)), f: scVolta, ref: 'Mateus 2:19-21' },
  // 9. fechamento
  { a: at(L(9, 0)), b: at(L(9, 1)), f: scReiJudeus, ref: null },
  { a: at(L(9, 1)), b: at(L(9, 2)), f: scQuatro, ref: null },
  { a: at(L(9, 2)), b: at(L(9, 3)), f: scPilatos, ref: 'Mateus 27:11' },
  { a: at(L(9, 3)), b: at(L(9, 4)), f: scZombaram, ref: 'Mateus 27:29' },
  { a: at(L(9, 4)), b: at(L(9, 5)), f: scPlaca, ref: 'Mateus 27:37' },
  { a: at(L(9, 5)), b: at(L(9, 7)), f: scMesmoTitulo, ref: 'Mateus 2:11; 27:29' },
  { a: at(L(9, 7)), b: at(L(9, 10)), f: scEmanuelFim, ref: [[at(L(9, 7)), 'Mateus 1:23'], [at(L(9, 9)), 'Mateus 28:20']] },
  { a: at(L(9, 10)), b: AUDIO_END + 0.25, f: scPergunta, ref: null },
  { a: AUDIO_END + 0.25, b: DURATION + 1, f: scFim, ref: null, end: true, cut: true },
];
