// Peças só de capa e miniatura (carregado depois do lib.js). O vídeo não usa este arquivo.
// A miniatura disputa o clique num quadro de 168×94 no celular: precisa de um rosto grande com emoção legível,
// luz forte atrás do herói e texto de alto contraste. O traço é o mesmo do lib.js (tinta, formas chapadas,
// cabeça redonda); aqui o personagem é desenhado de perto, com olhos, sobrancelhas e boca.
// Unidades: as da cena (1920×1080).

const CAPA = { ink: '#120E0C', ouro: '#FFD21E', fogo: '#FF6A13', branco: '#FFFFFF' };
let _capaId = 0;

// Texto da miniatura em SVG: Gasoek One, contorno escuro grosso e sombra dura.
// linhas: [{ t, size, fill }], de cima para baixo. o: x, y (topo), anchor ('start'|'end'|'middle'), rot, gap.
// fill 'ouro' usa o degradê dourado; qualquer outra cor entra como está.
function capaTexto(linhas, o = {}) {
  const id = 'ct' + (++_capaId), anchor = o.anchor || 'start';
  let y = o.y || 0, g = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE45C"/><stop offset="1" stop-color="#FFB800"/></linearGradient></defs>`;
  linhas.forEach((l) => {
    // l.w: largura do bloco; o tamanho da letra sai dela (linhas com a mesma largura formam um cartaz)
    const sz = l.w ? Math.round((l.w / measure(l.t, "100px 'Gasoek One'")) * 100) : l.size;
    const sw = Math.round(Math.min(sz * (l.traco ?? 0.2), 34)), fill = l.fill === 'ouro' ? `url(#${id})` : (l.fill || CAPA.branco);
    y += sz * 0.84;
    const base = `x="${o.x || 0}" text-anchor="${anchor}" font-family="'Gasoek One'" font-size="${sz}"`;
    g += `<text ${base} y="${f1(y + sz * 0.085)}" fill="${CAPA.ink}" stroke="${CAPA.ink}" stroke-width="${sw}" stroke-linejoin="round">${esc(l.t)}</text>`;
    g += `<text ${base} y="${f1(y)}" fill="${fill}" stroke="${CAPA.ink}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke fill">${esc(l.t)}</text>`;
    y += sz * (o.gap ?? 0.16);
  });
  return `<g transform="rotate(${o.rot || 0} ${o.x || 0} ${o.y || 0})" filter="drop-shadow(0 14px 18px rgba(0,0,0,0.55))">${g}</g>`;
}

// Luz: mancha radial (cor no centro, transparente na borda).
function capaLuz(x, y, r, cor, op = 1, sx = 1, sy = 1) {
  const id = 'cl' + (++_capaId);
  if (sx !== 1 || sy !== 1) return `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">${capaLuz(0, 0, r, cor, op)}</g>`;
  return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${cor}" stop-opacity="1"/><stop offset="0.45" stop-color="${cor}" stop-opacity="0.45"/><stop offset="1" stop-color="${cor}" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id})" opacity="${op}"/>`;
}
// Raios de luz saindo de um ponto (leque de cunhas).
function capaRaios(x, y, r, n, cor, op = 0.25, giro = 0, a0 = 0, a1 = 360) {
  const id = 'cr' + (++_capaId); let g = '';
  for (let i = 0; i < n; i++) {
    const a = ((a0 + ((a1 - a0) * i) / n + giro) * Math.PI) / 180, w = (((a1 - a0) / n) * 0.42 * Math.PI) / 180;
    g += `<path d="M ${x} ${y} L ${f1(x + r * Math.cos(a - w))} ${f1(y + r * Math.sin(a - w))} L ${f1(x + r * Math.cos(a + w))} ${f1(y + r * Math.sin(a + w))} Z"/>`;
  }
  return `<defs><radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${x}" cy="${y}" r="${r}"><stop offset="0" stop-color="${cor}" stop-opacity="1"/><stop offset="1" stop-color="${cor}" stop-opacity="0"/></radialGradient></defs><g fill="url(#${id})" opacity="${op}">${g}</g>`;
}
// Escurece as bordas (o olho vai para o meio).
function capaVinheta(op = 0.6, cx = '50%', cy = '50%', r = '75%') {
  const id = 'cv' + (++_capaId);
  return `<defs><radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${op}"/></radialGradient></defs><rect x="-400" y="-400" width="2720" height="1880" fill="url(#${id})"/>`;
}
// Fundo em degradê vertical: [[posição, cor], ...].
function capaFundo(stops) {
  const id = 'cf' + (++_capaId);
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([p, c]) => `<stop offset="${p}" stop-color="${c}"/>`).join('')}</linearGradient></defs><rect x="-400" y="-400" width="2720" height="1880" fill="url(#${id})"/>`;
}
// Fagulhas e poeira no ar (pontos claros), com semente estável.
function capaMotas(x, y, w, h, n, seed, cor = '#FFD9A0', op = 0.8) {
  const r = rng(seed); let g = '';
  for (let i = 0; i < n; i++) g += `<circle cx="${f1(x + r() * w)}" cy="${f1(y + r() * h)}" r="${f1(2 + r() * 5)}" fill="${cor}" opacity="${f1((0.25 + r() * 0.75) * op * 100) / 100}"/>`;
  return g;
}
// Gota (lágrima ou suor) com brilho.
function capaGota(x, y, s = 1, cor = '#8FD0FF') {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M 0 -30 C -20 0 -22 22 0 24 C 22 22 20 0 0 -30 Z" fill="${cor}" stroke="${CAPA.ink}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="-6" cy="8" rx="4" ry="7" fill="#fff" opacity="0.9"/></g>`;
}

// Rosto de perto, do peito para cima. (x, y) é o centro da cabeça; a cabeça tem raio 200 em s = 1.
// o: skin, hair, robe, beard, cover (cor do pano na cabeça), helmet ('cent' | 'rom'), armor,
//    mood ('medo' | 'espanto' | 'choro' | 'raiva' | 'calmo'), look [dx, dy] de -1 a 1,
//    lado (de que lado vem a luz: -1 esquerda, 1 direita), luz (cor da luz), suor, flip, id.
function retrato(o = {}) {
  const s = o.s || 1, R = 200, id = 'rt' + (o.id || ++_capaId);
  const OL = o.ol || CAPA.ink, SW = 13;
  const st = (w = SW, c = OL) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const skin = o.skin || '#C68B59', skDk = shade(skin, 0.7), hair = o.hair || '#2F2622';
  const robe = o.robe || '#8E3B46', lado = o.lado ?? -1, luz = o.luz || '#FFB347';
  const mood = o.mood || 'medo', [lx, ly] = o.look || [0, 0];
  const fy = o.helmet ? 48 : 0; // com capacete o rosto desce, para os olhos não caírem na aba
  let g = '';

  // tronco: ombros, manto e, no soldado, a couraça
  g += `<path d="M -470 700 C -470 400 -330 262 -170 222 L 170 222 C 330 262 470 400 470 700 Z" fill="${robe}" ${st()}/>`;
  g += `<path d="M ${lado * -170} 222 C ${lado * -330} 262 ${lado * -470} 400 ${lado * -470} 700 L ${lado * -330} 700 C ${lado * -330} 470 ${lado * -260} 330 ${lado * -120} 250 Z" fill="#000" opacity="0.22"/>`;
  if (o.armor) {
    const aco = '#8C8F96', acoDk = '#5E6168';
    g += `<path d="M -250 700 L -235 330 Q 0 270 235 330 L 250 700 Z" fill="${aco}" ${st()}/>`;
    for (let i = 0; i < 4; i++) g += `<path d="M ${-240 + i * 3} ${400 + i * 78} Q 0 ${350 + i * 78} ${240 - i * 3} ${400 + i * 78}" fill="none" ${st(8, acoDk)}/>`;
    [-1, 1].forEach((d) => (g += `<path d="M ${d * 180} 300 C ${d * 250} 250 ${d * 400} 290 ${d * 420} 420 C ${d * 340} 380 ${d * 260} 380 ${d * 200} 420 Z" fill="${aco}" ${st()}/><path d="M ${d * 215} 345 C ${d * 280} 315 ${d * 350} 325 ${d * 390} 380" fill="none" ${st(8, acoDk)}/>`));
  }
  // pescoço
  g += `<path d="M -78 140 L -86 250 Q 0 292 86 250 L 78 140 Z" fill="${skDk}" ${st()}/>`;
  if (o.armor) g += `<path d="M -150 232 C -120 180 120 180 150 232 C 150 300 -150 300 -150 232 Z" fill="${shade(robe, 1.15)}" ${st()}/>`;

  // cabeça: a luz forte de um lado (filete claro), a sombra do outro
  g += `<clipPath id="${id}"><circle cx="0" cy="0" r="${R}"/></clipPath>`;
  g += `<g clip-path="url(#${id})"><rect x="-210" y="-210" width="420" height="420" fill="${luz}"/><circle cx="${-lado * 20}" cy="8" r="${R}" fill="${skin}"/><circle cx="${-lado * 330}" cy="60" r="250" fill="${skDk}" opacity="0.75"/>`;
  g += `<ellipse cx="-122" cy="${92 + fy}" rx="44" ry="26" fill="#E0564A" opacity="0.28"/><ellipse cx="122" cy="${92 + fy}" rx="44" ry="26" fill="#E0564A" opacity="0.28"/></g>`;
  g += `<circle cx="0" cy="0" r="${R}" fill="none" ${st()}/>`;

  // barba (por baixo da boca)
  if (o.beard) {
    g += `<path d="M -196 30 C -200 150 -110 232 0 232 C 110 232 200 150 196 30 C 150 96 70 ${70 + fy} 0 ${70 + fy} C -70 ${70 + fy} -150 96 -196 30 Z" fill="${hair}" ${st()}/>`;
    g += `<path d="M ${lado * 150} 120 C ${lado * 120} 180 ${lado * 70} 205 ${lado * 20} 212" fill="none" ${st(9, shade(hair, 1.9))} opacity="0.55"/>`;
  }

  // olhos
  const big = mood === 'medo' || mood === 'espanto';
  const ex = 84, ey = -22 + fy, rx = big ? 62 : 52, ry = (big ? 72 : mood === 'raiva' ? 40 : 52) - (o.helmet ? 8 : 0), ir = big ? 27 : 32;
  [-1, 1].forEach((d) => {
    const cx = d * ex, cid = `${id}e${d < 0 ? 'l' : 'r'}`;
    g += `<clipPath id="${cid}"><ellipse cx="${cx}" cy="${ey}" rx="${rx}" ry="${ry}"/></clipPath>`;
    g += `<ellipse cx="${cx}" cy="${ey}" rx="${rx}" ry="${ry}" fill="#fff"/>`;
    g += `<g clip-path="url(#${cid})"><ellipse cx="${cx}" cy="${ey - ry * 1.25}" rx="${rx * 1.3}" ry="${ry * 0.6}" fill="#C9D3E0" opacity="0.7"/>`;
    g += `<circle cx="${f1(cx + lx * (rx - ir - 4))}" cy="${f1(ey + ly * (ry - ir - 6))}" r="${ir}" fill="#3B2314"/><circle cx="${f1(cx + lx * (rx - ir - 4))}" cy="${f1(ey + ly * (ry - ir - 6))}" r="${ir * 0.55}" fill="#0B0705"/>`;
    g += `<circle cx="${f1(cx + lx * (rx - ir - 4) - 10)}" cy="${f1(ey + ly * (ry - ir - 6) - 11)}" r="${ir * 0.3}" fill="#fff"/></g>`;
    g += `<ellipse cx="${cx}" cy="${ey}" rx="${rx}" ry="${ry}" fill="none" ${st(10)}/>`;
    if (mood === 'choro') g += `<path d="M ${cx - rx} ${ey - 6} Q ${cx} ${ey - ry * 1.5} ${cx + rx} ${ey - 6} Z" fill="${skin}" ${st(10)}/>`;
    // sobrancelha
    const by = ey - ry - (o.helmet ? 34 : big ? 40 : 26);
    const [y1, y2] = mood === 'raiva' ? [by - 6, by + 44] : mood === 'calmo' ? [by + 10, by + 6] : [by + 26, by - 16]; // [fora, dentro]
    g += `<path d="M ${d * (ex + rx + 4)} ${y1} Q ${d * ex} ${Math.min(y1, y2) - (mood === 'raiva' ? 0 : 20)} ${d * (ex - rx + 12)} ${y2}" fill="none" ${st(24, o.sobrancelha || shade(hair, 0.8))}/>`;
  });

  // boca
  const my = 118 + fy * 0.5;
  if (big) {
    const mid = id + 'm', mw = mood === 'espanto' ? 40 : 52, mh = (mood === 'espanto' ? 54 : 50) - (o.helmet ? 6 : 0);
    g += `<clipPath id="${mid}"><ellipse cx="0" cy="${my}" rx="${mw}" ry="${mh}"/></clipPath><ellipse cx="0" cy="${my}" rx="${mw}" ry="${mh}" fill="#3A0D12"/>`;
    g += `<g clip-path="url(#${mid})"><ellipse cx="0" cy="${my + mh * 0.9}" rx="${mw * 0.8}" ry="${mh * 0.6}" fill="#E0564A"/><rect x="${-mw}" y="${my - mh - 4}" width="${mw * 2}" height="${mh * 0.42}" fill="#fff"/></g>`;
    g += `<ellipse cx="0" cy="${my}" rx="${mw}" ry="${mh}" fill="none" ${st(10)}/>`;
  } else if (mood === 'choro') {
    g += `<path d="M -50 ${my + 22} Q -24 ${my - 22} 0 ${my - 4} Q 24 ${my - 22} 50 ${my + 22}" fill="none" ${st(13)}/>`;
  } else if (mood === 'raiva') {
    g += `<path d="M -54 ${my + 14} Q 0 ${my - 26} 54 ${my + 14} L 46 ${my + 34} Q 0 ${my + 6} -46 ${my + 34} Z" fill="#fff" ${st(10)}/>`;
  } else {
    g += `<path d="M -40 ${my} Q 0 ${my + 16} 40 ${my}" fill="none" ${st(13)}/>`;
  }

  // cabelo, pano ou capacete
  if (o.helmet) {
    const ouro = '#F2B632', ouroDk = '#C98A12', crista = '#D7263D';
    if (o.helmet === 'cent') {
      g += `<path d="M -292 -196 C -300 -470 300 -470 292 -196 C 180 -300 -180 -300 -292 -196 Z" fill="${crista}" ${st()}/>`;
      for (let i = -5; i <= 5; i++) g += `<line x1="${i * 34}" y1="${-282 + Math.abs(i) * 6}" x2="${i * 46}" y2="${-388 + Math.abs(i) * 15}" ${st(7, shade(crista, 0.62))}/>`;
      g += `<path d="M ${lado * 262} -236 C ${lado * 250} -340 ${lado * 170} -392 ${lado * 70} -398" fill="none" ${st(14, '#FF7A8A')} opacity="0.8"/>`;
    } else {
      g += `<rect x="-34" y="-420" width="68" height="190" rx="30" fill="${crista}" ${st()}/>`;
    }
    g += `<g clip-path="url(#${id})"><path d="M -236 -96 Q 0 -160 236 -96 L 240 -52 Q 0 -118 -240 -52 Z" fill="#000" opacity="0.28"/></g>`;
    [-1, 1].forEach((d) => (g += `<path d="M ${d * 152} -110 L ${d * 222} -110 L ${d * 228} 96 Q ${d * 200} 150 ${d * 160} 118 C ${d * 178} 40 ${d * 174} -40 ${d * 152} -110 Z" fill="${ouro}" ${st()}/>`));
    g += `<path d="M ${-lado * 222} -100 L ${-lado * 227} 90 Q ${-lado * 204} 138 ${-lado * 176} 122 C ${-lado * 196} 40 ${-lado * 196} -30 ${-lado * 190} -100 Z" fill="#000" opacity="0.18"/>`;
    g += `<path d="M -222 -124 C -236 -340 236 -340 222 -124 Q 0 -186 -222 -124 Z" fill="${ouro}" ${st()}/>`;
    g += `<path d="M ${-lado * 222} -124 C ${-lado * 232} -260 ${-lado * 160} -320 ${-lado * 60} -334 C ${-lado * 130} -280 ${-lado * 150} -200 ${-lado * 150} -150 Z" fill="#000" opacity="0.16"/>`;
    g += `<path d="M -234 -124 Q 0 -190 234 -124 L 240 -84 Q 0 -152 -240 -84 Z" fill="${ouroDk}" ${st()}/>`;
    g += `<path d="M ${lado * 192} -150 C ${lado * 190} -236 ${lado * 130} -278 ${lado * 60} -286" fill="none" ${st(16, '#FFE9A8')} opacity="0.9"/>`;
  } else if (o.cover) {
    g += `<path d="M -214 40 C -250 -250 250 -250 214 40 L 250 250 L 150 250 L 150 10 C 140 -110 70 -150 0 -150 C -70 -150 -140 -110 -150 10 L -150 250 L -250 250 Z" fill="${o.cover}" ${st()}/>`;
    g += `<path d="M -196 -112 Q 0 -190 196 -112 L 200 -66 Q 0 -146 -200 -66 Z" fill="${shade(o.cover, 0.78)}" ${st(9)}/>`;
  } else if (!o.bald) {
    g += `<path d="M -206 -10 C -226 -200 -110 -252 0 -252 C 110 -252 226 -200 206 -10 C 170 -110 80 -150 0 -150 C -80 -150 -170 -110 -206 -10 Z" fill="${hair}" ${st()}/>`;
  }

  // suor (do lado da sombra) e lágrimas
  if (o.suor) g += capaGota(-lado * 236, -30 + fy, 1.5) + capaGota(-lado * 262, 84 + fy, 1.05);
  if (mood === 'choro') g += capaGota(-ex - 6, ey + ry + 44, 1.5) + capaGota(ex + 14, ey + ry + 70, 1.2);

  return `<g transform="translate(${f1(o.x || 0)} ${f1(o.y || 0)}) scale(${(o.flip ? -1 : 1) * s} ${s}) rotate(${o.rot || 0})">${g}</g>`;
}
