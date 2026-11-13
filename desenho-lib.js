// Peças do desenho animado com diálogo (teste de formato de 2026-11-13). Só os episódios em desenho carregam este
// arquivo (o scenes.js deles faz o document.write). O traço é outro: cabeça maior, olhos com íris e brilho,
// sobrancelha que mostra a emoção, boca que abre nas vogais de quem fala (FALAS do data.js) e piscada.
// Cada personagem é desenhado inteiro no "mundo" da cena (1080×1920 no zoom 1) e a câmera (camDes) faz o plano:
// geral, médio ou close. Tudo é função pura do tempo, como no lib.js.

const TD = { ol: '#2B1B12', pele: '#D9A273', papel: '#F3E7D3' };
let _tdId = 0;
const tk = (w = 5, c = TD.ol) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// Mistura duas cores #rrggbb (k = 0 dá a primeira, 1 a segunda).
function mixCor(a, b, k) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * clamp(k)).toString(16).padStart(2, '0')).join('');
}

// ---------- fala, boca e piscada ----------

// Abertura da boca do personagem p no tempo t (0 a 1): sobe e desce em cada trecho de vogal da fala.
// "JESUS_FORTE" fala pela boca de "JESUS" (o sufixo é só outro ajuste de voz).
const _base = (p) => p.split('_')[0];
function bocaDe(p, t) {
  if (typeof FALAS === 'undefined') return 0;
  for (const f of FALAS) {
    if (_base(f.p) !== p || t < f.a - 0.15 || t > f.b + 0.2) continue;
    let v = 0;
    for (const [a, b] of f.boca) {
      if (t < a - 0.06) break;
      const m = (a + b) / 2, h = Math.max(0.06, (b - a) / 2 + 0.05);
      v = Math.max(v, 1 - Math.abs(t - m) / h);
    }
    return clamp(v * 1.2) * (0.7 + 0.3 * Math.abs(Math.sin(t * 19.3)));
  }
  return 0;
}
function falando(p, t) {
  return typeof FALAS !== 'undefined' && FALAS.some((f) => _base(f.p) === p && t >= f.a - 0.1 && t <= f.b + 0.15);
}
// Piscada (0 aberto, 1 fechado), num ritmo próprio de cada personagem.
function piscaDe(t, seed) {
  const per = 2.9 + (seed % 7) * 0.41, x = (t + seed * 0.913) % per;
  return x < 0.14 ? 1 - Math.abs(x - 0.07) / 0.07 : 0;
}
// Respiração: um sobe e desce lento (para o personagem nunca ficar duro).
const respira = (t, seed = 0) => Math.sin(t * 2.1 + seed);

// ---------- cabeça ----------

const CABECA_L = 'M -88 -20 C -90 -88 -50 -116 0 -116 C 50 -116 90 -88 88 -20 C 87 22 80 52 63 78 C 47 100 24 111 0 113 C -24 111 -47 100 -63 78 C -80 52 -87 22 -88 -20 Z';
const CABECA = 'M -90 -18 C -92 -84 -52 -114 0 -114 C 52 -114 92 -84 90 -18 C 88 42 56 100 0 106 C -56 100 -88 42 -90 -18 Z';
// pálpebra de cima (quanto cobre, inclinação: + a ponta de fora mais baixa) e sobrancelha [dentro, fora, arco] por humor
const HUMOR = {
  neutro: [0.16, 0, [-42, -45, -8]], sereno: [0.22, 0.08, [-47, -43, -5]], triste: [0.34, 0.4, [-55, -36, -3]],
  dor: [0.46, 0.3, [-56, -38, -2]], choro: [0.4, 0.4, [-56, -36, -3]], raiva: [0.3, -0.5, [-28, -50, -2]],
  deboche: [0.46, 0, [-40, -40, -4]], espanto: [0, 0, [-62, -58, -10]], medo: [0.04, 0.1, [-60, -56, -8]],
  firme: [0.24, -0.15, [-38, -46, -5]],
};

// Cabeça em coordenadas locais (centro em 0,0; ~230 de altura). o: pele, cabelo (cor), penteado ('longo' | 'curto' |
// 'baguncado' | 'careca'), barba ('cheia' | 'curta' | 'rala' | 'bigode'), corBarba, olho (cor da íris), humor, look [x, y]
// de -1 a 1, pisca (0 a 1), boca (0 a 1), turn (-1 a 1, o rosto virado), lado (de onde vem a luz), pano {cor, listra,
// faixa}, manto (cor; manto de mulher), turbante, capacete ('rom' | 'cent'), coroa (espinhos), cilios, lagrimas,
// velho, tilt (graus).
function toonCabeca(o = {}) {
  const id = 'tc' + ++_tdId, pele = o.pele || TD.pele, peleDk = shade(pele, 0.8), cab = o.cabelo || '#3A2618';
  const L = o.lado ?? -1, hum = HUMOR[o.humor || 'neutro'] || HUMOR.neutro, turn = o.turn || 0, fx = turn * 13;
  const [lx, ly] = o.look || [0, 0], pisca = clamp(o.pisca || 0), ab = clamp(o.boca || 0);
  const barba = o.barba, corBarba = o.corBarba || cab, cap = o.capacete;
  let g = '';
  // atrás da cabeça: cabelo comprido e o pano que cai nas costas
  if (o.penteado === 'longo') g += `<path d="M -96 -40 C -118 50 -112 140 -88 196 Q -62 212 -34 196 C -48 130 -54 70 -52 20 L 52 20 C 54 70 48 130 34 196 Q 62 212 88 196 C 112 140 118 50 96 -40 Z" fill="${shade(cab, 0.85)}" ${tk(5)}/>`;
  const pano = o.pano || (o.manto ? { cor: o.manto } : null);
  if (pano) g += `<path d="M -114 -10 C -124 80 -130 170 -136 236 L 136 236 C 130 170 124 80 114 -10 Z" fill="${shade(pano.cor, 0.72)}" ${tk(5)}/>`;
  // orelhas
  if (!pano && !cap && !o.turbante) [-1, 1].forEach((d) => (g += `<ellipse cx="${d * 88 + fx * 0.3}" cy="4" rx="15" ry="23" fill="${pele}" ${tk(5)}/><path d="M ${d * 86 + fx * 0.3} -6 q ${d * 6} 8 0 18" fill="none" ${tk(3, peleDk)}/>`));
  // rosto com sombra do lado contrário à luz
  const CAB = (o.rosto || ROSTO) === 'longa' ? CABECA_L : CABECA;
  g += `<clipPath id="${id}h"><path d="${CAB}"/></clipPath><path d="${CAB}" fill="${pele}"/>`;
  g += `<g clip-path="url(#${id}h)"><ellipse cx="${-L * 92 + fx}" cy="20" rx="70" ry="150" fill="${peleDk}" opacity="0.55"/>`;
  g += `<ellipse cx="${L * 40 + fx}" cy="-50" rx="40" ry="26" fill="#fff" opacity="0.12"/>`;
  [-1, 1].forEach((d) => (g += `<ellipse cx="${d * 52 + fx}" cy="40" rx="17" ry="10" fill="#E07A62" opacity="0.32"/>`));
  if (o.velho) g += `<path d="M -32 -64 Q 0 -72 32 -64 M -26 -52 Q 0 -58 26 -52" fill="none" ${tk(3, peleDk)}/>`;
  g += `</g><path d="${CAB}" fill="none" ${tk(5)}/>`;

  // barba (por baixo da boca)
  if (barba && barba !== 'bigode') {
    const fim = barba === 'curta' ? 116 : barba === 'rala' ? 108 : 132;
    const d = `M -90 -4 C -94 66 -54 ${fim - 4} ${fx} ${fim} C 54 ${fim - 4} 94 66 90 -4 C 80 32 62 46 ${44 + fx} 44 C ${30 + fx} 54 ${14 + fx} 56 ${fx} 54 C ${-14 + fx} 56 ${-30 + fx} 54 ${-44 + fx} 44 C -62 46 -80 32 -90 -4 Z`;
    if (barba === 'rala') g += `<g clip-path="url(#${id}h)"><path d="${d}" fill="${corBarba}" opacity="0.3"/></g>`;
    else {
      g += `<path d="${d}" fill="${corBarba}" ${tk(5)}/>`;
      g += `<path d="M ${-40 + fx} 92 q 10 14 4 30 M ${30 + fx} 96 q -8 12 -2 26 M ${-66} 50 q 4 18 14 30" fill="none" ${tk(3, shade(corBarba, 1.6))} opacity="0.45"/>`;
    }
  }

  g += (ROSTOS[o.rosto || ROSTO] || rostoAtual)(o, { id, pele, peleDk, corBarba, cap, fx, turn, lx, ly, pisca, ab, barba, hum, L });

  // cabelo, pano, turbante, capacete, coroa
  const brilho = (d) => `<path d="${d}" fill="none" ${tk(6, shade(cab, 1.8))} opacity="0.45"/>`;
  if (!pano && !cap && !o.turbante) {
    const top = {
      longo: 'M -94 -6 C -108 -96 -56 -130 0 -126 C 56 -130 108 -96 94 -6 C 88 -46 76 -70 52 -84 C 38 -74 16 -86 4 -100 C -10 -84 -32 -74 -50 -84 C -74 -70 -88 -46 -94 -6 Z',
      curto: 'M -92 -26 C -100 -102 -50 -128 0 -124 C 50 -128 100 -102 92 -26 C 84 -60 64 -80 34 -86 C 14 -78 -16 -82 -38 -90 C -64 -82 -84 -62 -92 -26 Z',
      baguncado: 'M -94 -20 C -104 -104 -50 -130 0 -126 C 50 -130 104 -104 94 -20 L 80 -54 L 70 -40 L 58 -78 L 40 -64 L 26 -92 L 10 -72 L -6 -96 L -22 -72 L -38 -90 L -52 -66 L -66 -80 L -76 -46 L -86 -60 Z',
      careca: 'M -92 -6 C -98 -40 -92 -58 -80 -66 C -82 -40 -78 -20 -72 -4 Z M 92 -6 C 98 -40 92 -58 80 -66 C 82 -40 78 -20 72 -4 Z',
    }[o.penteado || 'curto'];
    g += `<path d="${top}" fill="${cab}" ${tk(5)}/>`;
    if (o.penteado !== 'careca') g += brilho('M -52 -102 Q 0 -120 44 -104');
  }
  if (pano) {
    g += `<path d="M -114 40 C -128 -94 -66 -144 0 -144 C 66 -144 128 -94 114 40 L 124 236 L 84 236 L 80 30 C 78 -52 46 -98 0 -98 C -46 -98 -78 -52 -80 30 L -84 236 L -124 236 Z" fill="${pano.cor}" ${tk(5)}/>`;
    g += `<path d="M -100 -40 C -96 30 -98 120 -104 220 M 100 -40 C 96 30 98 120 104 220" fill="none" ${tk(3, shade(pano.cor, 0.7))}/>`;
    if (pano.listra) g += `<path d="M -92 -96 Q 0 -150 92 -96" fill="none" ${tk(7, pano.listra)}/><path d="M -104 -78 Q 0 -138 104 -78" fill="none" ${tk(4, pano.listra)}/>`;
    if (pano.faixa) g += `<path d="M -86 -88 Q 0 -122 86 -88" fill="none" ${tk(11, pano.faixa)}/>`;
    g += `<path d="M -40 -134 Q 0 -146 40 -134" fill="none" ${tk(6, '#fff')} opacity="0.3"/>`;
  }
  if (o.turbante) {
    g += `<path d="M -96 -36 C -112 -132 -56 -170 0 -170 C 56 -170 112 -132 96 -36 Q 0 -70 -96 -36 Z" fill="#EEE7D7" ${tk(5)}/>`;
    g += `<path d="M -92 -70 Q 0 -112 92 -70 M -86 -104 Q 0 -146 86 -104 M -60 -140 Q 0 -160 60 -140" fill="none" ${tk(3, '#BDB29C')}/>`;
    g += `<path d="M -98 -44 Q 0 -80 98 -44" fill="none" ${tk(12, o.turbante)}/>`;
  }
  if (cap) {
    const br = '#C99A3B', brDk = '#8E6A24', crista = '#B3302B';
    if (cap === 'cent') {
      g += `<path d="M -124 -116 C -116 -222 116 -222 124 -116 C 84 -150 -84 -150 -124 -116 Z" fill="${crista}" ${tk(5)}/>`;
      for (let i = -6; i <= 6; i++) g += `<line x1="${i * 15}" y1="${-150 + Math.abs(i) * 1.5}" x2="${i * 18}" y2="${-196 + Math.abs(i) * 5}" ${tk(3, shade(crista, 0.65))}/>`;
    } else {
      g += `<rect x="-13" y="-212" width="26" height="80" rx="13" fill="${crista}" ${tk(5)}/><path d="M -6 -200 L -6 -144 M 6 -200 L 6 -144" ${tk(2.5, shade(crista, 0.65))}/>`;
    }
    g += `<path d="M -98 -30 C -104 -124 -52 -148 0 -148 C 52 -148 104 -124 98 -30 Q 0 -58 -98 -30 Z" fill="${br}" ${tk(5)}/>`;
    g += `<path d="M ${L * 70} -110 C ${L * 50} -134 ${L * 20} -140 ${L * -6} -140" fill="none" ${tk(7, '#F7DE96')} opacity="0.85"/>`;
    g += `<path d="M -106 -38 Q 0 -70 106 -38 L 108 -24 Q 0 -56 -108 -24 Z" fill="${brDk}" ${tk(4)}/>`;
    [-1, 1].forEach((d) => (g += `<path d="M ${d * 98} -30 L ${d * 74} -28 C ${d * 72} 10 ${d * 70} 40 ${d * 78} 66 Q ${d * 92} 72 ${d * 102} 56 C ${d * 102} 22 ${d * 102} -4 ${d * 98} -30 Z" fill="${br}" ${tk(4)}/>`));
  }
  if (o.coroa) {
    let c = '';
    for (const k of [0, 1]) c += `<ellipse cx="0" cy="${-80 + k * 6}" rx="${100 - k * 4}" ry="20" transform="rotate(${k ? -4 : 4} 0 -80)" fill="none" ${tk(14)}/><ellipse cx="0" cy="${-80 + k * 6}" rx="${100 - k * 4}" ry="20" transform="rotate(${k ? -4 : 4} 0 -80)" fill="none" stroke="#7B5532" stroke-width="7"/>`;
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2, x = Math.cos(a) * 100, y = -80 + Math.sin(a) * 20;
      if (Math.sin(a) > 0.3 && Math.abs(x) < 60) continue;
      c += `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x * 1.12)}" y2="${f1(y + (Math.sin(a) > 0 ? 10 : -18))}" ${tk(4)}/>`;
    }
    g += c;
  }
  return `<g transform="rotate(${o.tilt || 0} 0 60)">${g}</g>`;
}

// Traços do rosto, estilo de 13/11 (olhos redondos grandes). Os outros estilos estão em ROSTOS.
function rostoAtual(o, c) {
  const { id, pele, corBarba, cap, fx, turn, lx, ly, pisca, ab, barba, hum } = c;
  let g = '';
  // olhos
  const [palp, incl, sob] = hum;
  [-1, 1].forEach((d) => {
    const longe = Math.max(0, d * turn), sx = 1 - longe * 0.18;
    const ex = d * 36 + fx, ey = -6, rx = (o.humor === 'espanto' ? 19 : 18) * sx, ry = o.humor === 'espanto' ? 25 : 22;
    const cid = `${id}e${d}`, lid = Math.min(1, palp + pisca * (1 - palp));
    const yl = (x) => ey - ry + 2 * ry * lid + incl * ry * ((x - ex) * d) / rx;
    g += `<clipPath id="${cid}"><ellipse cx="${f1(ex)}" cy="${ey}" rx="${f1(rx)}" ry="${ry}"/></clipPath>`;
    g += `<ellipse cx="${f1(ex)}" cy="${ey}" rx="${f1(rx)}" ry="${ry}" fill="#FFFDF8"/>`;
    const ix = ex + lx * 7 * sx, iy = ey + ly * 6 + 2;
    g += `<g clip-path="url(#${cid})"><circle cx="${f1(ix)}" cy="${f1(iy)}" r="12.5" fill="${o.olho || '#6B4226'}"/><circle cx="${f1(ix)}" cy="${f1(iy)}" r="12.5" fill="none" stroke="${shade(o.olho || '#6B4226', 0.55)}" stroke-width="3"/>`;
    g += `<circle cx="${f1(ix)}" cy="${f1(iy)}" r="6.5" fill="#120A06"/><circle cx="${f1(ix - 4)}" cy="${f1(iy - 5)}" r="4.2" fill="#fff"/><circle cx="${f1(ix + 4)}" cy="${f1(iy + 4)}" r="1.9" fill="#fff"/>`;
    g += `<ellipse cx="${f1(ex)}" cy="${ey - ry}" rx="${f1(rx * 1.3)}" ry="${ry * 0.55}" fill="#9AA6BF" opacity="0.25"/>`;
    if (lid > 0.02) g += `<path d="M ${f1(ex - rx - 3)} ${ey - ry - 6} L ${f1(ex + rx + 3)} ${ey - ry - 6} L ${f1(ex + rx + 3)} ${f1(yl(ex + rx + 3))} L ${f1(ex - rx - 3)} ${f1(yl(ex - rx - 3))} Z" fill="${shade(pele, 0.93)}"/>`;
    g += `</g>`;
    if (lid > 0.93) {
      g += `<path d="M ${f1(ex - rx)} ${ey + 3} Q ${f1(ex)} ${ey + 11} ${f1(ex + rx)} ${ey + 3}" fill="none" ${tk(5)}/>`;
    } else {
      g += `<ellipse cx="${f1(ex)}" cy="${ey}" rx="${f1(rx)}" ry="${ry}" fill="none" ${tk(3)}/>`;
      if (lid < 0.2 && Math.abs(incl) < 0.1) g += `<path d="M ${f1(ex - rx - 2)} ${ey - 2} A ${f1(rx)} ${ry} 0 0 1 ${f1(ex + rx + 2)} ${ey - 2}" fill="none" ${tk(6)}/>`;
      else g += `<path d="M ${f1(ex - rx - 2)} ${f1(yl(ex - rx - 2))} L ${f1(ex + rx + 2)} ${f1(yl(ex + rx + 2))}" fill="none" ${tk(6)}/>`;
      g += `<path d="M ${f1(ex - rx * 0.7)} ${ey + ry - 3} Q ${f1(ex)} ${ey + ry + 3} ${f1(ex + rx * 0.7)} ${ey + ry - 3}" fill="none" ${tk(2.5)} opacity="0.5"/>`;
      if (o.cilios) {
        const xo = ex + d * rx, yo = yl(xo);
        g += `<path d="M ${f1(xo)} ${f1(yo)} l ${d * 9} -7 M ${f1(xo - d * 5)} ${f1(yo - 3)} l ${d * 6} -9" fill="none" ${tk(3.5)}/>`;
      }
    }
    // sobrancelha [dentro, fora, arco]; com capacete ela desce um pouco
    let [yi, yo, arco] = sob;
    if (o.humor === 'deboche' && d > 0) [yi, yo, arco] = [-50, -58, -8];
    const dy = cap ? 8 : 0, xi = d * 14 + fx, xo = d * 58 * sx + fx;
    g += `<path d="M ${f1(xo)} ${yo + dy} Q ${f1((xi + xo) / 2)} ${Math.min(yi, yo) + arco + dy} ${f1(xi)} ${yi + dy}" fill="none" ${tk(9, shade(corBarba, 0.8))}/>`;
  });
  if (o.lagrimas) [-1, 1].forEach((d) => (g += `<path d="M ${d * 40 + fx} 18 c -6 10 -6 16 0 17 c 6 -1 6 -7 0 -17 Z" fill="#A9D8FF" ${tk(2.5)}/>`));

  // nariz
  g += `<path d="M ${fx - 2} 10 Q ${fx - 12 - turn * 4} 30 ${fx} 34 Q ${fx + 8} 36 ${fx + 11} 30" fill="none" ${tk(4)}/>`;

  // boca
  const my = 62, mw = 16 + (o.humor === 'deboche' ? 3 : 0);
  if (ab < 0.08) {
    const forma = {
      neutro: `M -15 0 Q 0 4 15 0`, sereno: `M -15 -1 Q 0 6 15 -1`, triste: `M -15 5 Q 0 -4 15 5`, dor: `M -16 5 Q -4 -2 4 1 Q 10 3 16 5`,
      choro: `M -15 5 Q 0 -4 15 5`, raiva: `M -16 3 Q 0 -4 16 3`, deboche: `M -18 3 Q 2 5 20 -7`, firme: `M -15 1 L 15 1`,
    }[o.humor || 'neutro'];
    if (forma) g += `<path d="${forma}" transform="translate(${fx} ${my})" fill="none" ${tk(5)}/>`;
    else g += `<ellipse cx="${fx}" cy="${my + 2}" rx="7" ry="9" fill="#4B1616" ${tk(4)}/>`;
  } else {
    const w = mw - ab * 3, h = 5 + ab * 20, mid = `${id}m`;
    const d = `M ${-w} 0 Q 0 ${-h * 0.22} ${w} 0 Q ${w * 0.9} ${h * 1.05} 0 ${h * 1.12} Q ${-w * 0.9} ${h * 1.05} ${-w} 0 Z`;
    g += `<g transform="translate(${fx} ${my - 3})"><clipPath id="${mid}"><path d="${d}"/></clipPath><path d="${d}" fill="#4B1616"/>`;
    g += `<g clip-path="url(#${mid})"><ellipse cx="0" cy="${h * 1.08}" rx="${w * 0.65}" ry="${h * 0.42}" fill="#D8635A"/>`;
    if (ab > 0.3) g += `<rect x="${-w}" y="${-h * 0.3}" width="${w * 2}" height="${Math.min(6, h * 0.3) + h * 0.22}" fill="#FFFDF5"/>`;
    g += `</g><path d="${d}" fill="none" ${tk(4)}/></g>`;
  }
  if (barba && barba !== 'rala') g += `<path d="M -27 51 C -18 41 -6 43 0 47 C 6 43 18 41 27 51 C 31 57 22 59 14 55 C 8 53 4 53 0 55 C -4 53 -8 53 -14 55 C -22 59 -31 57 -27 51 Z" transform="translate(${fx} 0)" fill="${corBarba}" ${tk(4)}/>`;

  return g;
}

// Pálpebra de cima (quanto cobre o olho) nos estilos novos: mais leve que no 'atual', para ninguém ficar com cara de sono.
const PALP_LONGA = { neutro: 0.06, sereno: 0.14, triste: 0.3, dor: 0.36, choro: 0.32, raiva: 0.24, deboche: 0.42, espanto: 0, medo: 0.02, firme: 0.14 };
const PALP_LIVRO = { triste: 0.3, dor: 0.34, choro: 0.3, raiva: 0.26, deboche: 0.42, firme: 0.1 };

// Sobrancelha no estilo 'longa': [dentro, fora, arco] por humor (mais perto do olho e mais fina que no 'atual').
const SOB_LONGA = {
  neutro: [-36, -38, -6], sereno: [-37, -36, -4], triste: [-46, -32, -2], dor: [-47, -33, -1], choro: [-47, -32, -2],
  raiva: [-27, -41, -2], deboche: [-35, -36, -4], espanto: [-50, -47, -8], medo: [-49, -45, -6], firme: [-31, -39, -4],
};

// Estilo 'longa' (de longa animado): olho amendoado com dobra da pálpebra, íris menor, sobrancelha cheia e afinando
// para fora, nariz com a ponta desenhada, lábios e sombra embaixo da maçã do rosto. Mesma cabeça e mesmas medidas,
// para cabelo, pano e capacete servirem nos dois estilos.
function rostoLonga(o, c) {
  const { id, pele, peleDk, corBarba, cap, fx, turn, lx, ly, pisca, barba, hum, L } = c;
  const hm = o.humor || 'neutro', [palp, incl] = hum;
  let ab = c.ab;
  if ((hm === 'espanto' || hm === 'medo') && ab < 0.3) ab = 0.3; // susto: a boca fica entreaberta
  let g = '';
  // sombras do rosto: embaixo da maçã, do lado contrário à luz, e embaixo do queixo
  g += `<g clip-path="url(#${id}h)"><path d="M ${-L * 86 + fx} 6 C ${-L * 74 + fx} 40 ${-L * 56 + fx} 62 ${-L * 34 + fx} 74 C ${-L * 64 + fx} 76 ${-L * 84 + fx} 54 ${-L * 92 + fx} 24 Z" fill="${peleDk}" opacity="0.4"/></g>`;
  if (o.velho) g += `<path d="M ${-30 + fx} -62 Q ${fx} -68 ${30 + fx} -62 M ${-22 + fx} -52 Q ${fx} -56 ${22 + fx} -52 M ${-26 + fx} 40 Q ${-30 + fx} 54 ${-24 + fx} 66 M ${26 + fx} 40 Q ${30 + fx} 54 ${24 + fx} 66" fill="none" ${tk(2.5, shade(pele, 0.62))} opacity="0.7"/>`;
  [-1, 1].forEach((d) => {
    const longe = Math.max(0, d * turn), sx = 1 - longe * 0.2;
    const ex = d * 34 + fx, ey = -12, w = 21 * sx, h = hm === 'espanto' ? 15 : hm === 'medo' ? 14 : 11.5;
    const xin = ex - d * w, xout = ex + d * w, yin = ey + 2, yout = ey - 1.5;
    const cima = `M ${f1(xin)} ${yin} C ${f1(ex - d * w * 0.45)} ${f1(ey - h * 1.35)} ${f1(ex + d * w * 0.5)} ${f1(ey - h * 1.3)} ${f1(xout)} ${yout}`;
    const baixo = `C ${f1(ex + d * w * 0.45)} ${f1(ey + h * 0.95)} ${f1(ex - d * w * 0.5)} ${f1(ey + h)} ${f1(xin)} ${yin}`;
    // pálpebra de cima: uma curva que sai do canto de dentro e chega no de fora, e desce com o humor (incl > 0: o lado
    // de fora desce mais, tristeza; incl < 0: o de dentro, raiva). Com lid 0 ela é o próprio contorno do olho.
    const lid = Math.min(1, (PALP_LONGA[hm] ?? palp) + pisca * (1 - (PALP_LONGA[hm] ?? palp)));
    const li = clamp(lid - incl * 0.3), lo = clamp(lid + incl * 0.3);
    const c1 = lerp(ey - h * 1.35, ey + h * 0.9, li), c2 = lerp(ey - h * 1.3, ey + h * 0.9, lo);
    const palpebra = `M ${f1(xin)} ${yin} C ${f1(ex - d * w * 0.45)} ${f1(c1)} ${f1(ex + d * w * 0.5)} ${f1(c2)} ${f1(xout)} ${yout}`;
    const cid = `${id}o${d}`;
    g += `<clipPath id="${cid}"><path d="${cima} ${baixo} Z"/></clipPath><path d="${cima} ${baixo} Z" fill="#FBF6EE"/>`;
    const ix = ex + lx * 8 * sx, iy = ey + ly * 4 + 1, ir = 10, cor = o.olho || '#6B4226';
    g += `<g clip-path="url(#${cid})"><circle cx="${f1(ix)}" cy="${f1(iy)}" r="${ir}" fill="${cor}"/><circle cx="${f1(ix)}" cy="${f1(iy)}" r="${ir - 1}" fill="none" stroke="${shade(cor, 0.5)}" stroke-width="2"/>`;
    g += `<circle cx="${f1(ix)}" cy="${f1(iy)}" r="5" fill="#120A06"/><circle cx="${f1(ix - 2.8)}" cy="${f1(iy - 3.2)}" r="2.7" fill="#fff"/><circle cx="${f1(ix + 3)}" cy="${f1(iy + 3)}" r="1.1" fill="#fff"/>`;
    if (lid > 0.02) g += `<path d="${palpebra} L ${f1(xout + d * 6)} ${f1(ey - h * 2.2)} L ${f1(xin - d * 6)} ${f1(ey - h * 2.2)} Z" fill="${shade(pele, 0.93)}"/>`;
    g += `<path d="${palpebra}" fill="none" stroke="#3A2A40" stroke-width="7" opacity="0.15"/></g>`;
    g += `<path d="M ${f1(xout)} ${yout} ${baixo}" fill="none" ${tk(2.2)} opacity="${lid > 0.93 ? 0 : 0.55}"/>`;
    g += `<path d="${palpebra}" fill="none" ${tk(lid > 0.93 ? 4 : 4.6)}/>`;
    if (lid < 0.93) {
      g += `<path d="M ${f1(xout)} ${yout} l ${d * 6} -4" fill="none" ${tk(3.2)}/>`;
      if (o.cilios) g += `<path d="M ${f1(xout - d * 3)} ${yout - 2} l ${d * 8} -8 M ${f1(xout - d * 9)} ${yout - 5} l ${d * 5} -9" fill="none" ${tk(3)}/>`;
      if (lid < 0.5) g += `<path d="M ${f1(ex - d * w * 0.55)} ${f1(ey - h * 1.55)} Q ${f1(ex + d * w * 0.1)} ${f1(ey - h * 2)} ${f1(ex + d * w * 0.95)} ${f1(ey - h * 1.45)}" fill="none" ${tk(2.2)} opacity="0.45"/>`;
    }
    // sobrancelha cheia: grossa por dentro, fina por fora
    let [bi, bo, ba] = SOB_LONGA[hm] || SOB_LONGA.neutro;
    if (hm === 'deboche' && d > 0) [bi, bo, ba] = [-43, -50, -6];
    const dy = cap ? 6 : 0, xi = d * 12 + fx, xo = d * (12 + 48 * sx) + fx, yi = bi + dy, yo2 = bo + dy, ym = Math.min(yi, yo2) + ba;
    g += `<path d="M ${f1(xi)} ${yi - 5} Q ${f1((xi + xo) / 2)} ${ym - 4} ${f1(xo)} ${yo2} Q ${f1((xi + xo) / 2)} ${ym + 3} ${f1(xi)} ${yi + 4} Z" fill="${shade(corBarba, 0.85)}" ${tk(2)}/>`;
  });
  if (o.lagrimas) [-1, 1].forEach((d) => (g += `<path d="M ${d * 38 + fx} 6 c -5 9 -5 14 0 15 c 5 -1 5 -6 0 -15 Z" fill="#A9D8FF" ${tk(2)}/>`));
  // nariz: a ponte é só uma sombra leve; a ponta e as narinas, desenhadas
  const nx = fx + turn * 4;
  g += `<path d="M ${f1(nx - L * 5)} 6 C ${f1(nx - L * 7)} 12 ${f1(nx - L * 8)} 17 ${f1(nx - L * 9)} 23" fill="none" ${tk(2.4)} opacity="0.3"/>`;
  g += `<path d="M ${f1(nx - 13)} 24 C ${f1(nx - 16)} 32 ${f1(nx - 9)} 36 ${f1(nx - 4)} 33 C ${f1(nx - 1)} 37 ${f1(nx + 5)} 37 ${f1(nx + 8)} 33 C ${f1(nx + 13)} 36 ${f1(nx + 17)} 31 ${f1(nx + 13)} 24" fill="none" ${tk(3.2)}/>`;
  g += `<ellipse cx="${f1(nx - L * 5)}" cy="40" rx="11" ry="3.5" fill="${peleDk}" opacity="0.45"/>`;
  // boca com lábios
  const my = 60, lab = shade(pele, 0.78);
  if (ab < 0.08) {
    const forma = {
      neutro: 'M -18 0 Q -9 -3 -3 -1 Q 0 -2 3 -1 Q 9 -3 18 0', sereno: 'M -18 -2 Q -9 2 -2 1 Q 0 0 2 1 Q 9 2 18 -2',
      triste: 'M -18 4 Q -9 -2 0 -1 Q 9 -2 18 4', dor: 'M -18 4 Q -6 -3 2 0 Q 10 1 18 5', choro: 'M -18 4 Q -9 -2 0 -1 Q 9 -2 18 4',
      raiva: 'M -18 3 Q 0 -4 18 3', deboche: 'M -18 2 Q -4 3 6 0 Q 14 -2 21 -7', firme: 'M -17 0 Q 0 -1 17 0',
    }[hm] || 'M -18 0 Q 0 -2 18 0';
    g += `<g transform="translate(${f1(fx)} ${my})"><path d="M -10 3 Q 0 13 10 3 Q 0 7 -10 3 Z" fill="${lab}" opacity="0.6"/><path d="${forma}" fill="none" ${tk(3.8)}/><path d="M -8 10 Q 0 13 8 10" fill="none" ${tk(2.2)} opacity="0.4"/></g>`;
  } else {
    const w = 17 - ab * 2, h = 4 + ab * 19, mid = `${id}m`;
    const d = `M ${-w} 0 Q ${-w * 0.5} ${-h * 0.2} 0 ${-h * 0.08} Q ${w * 0.5} ${-h * 0.2} ${w} 0 Q ${w * 0.9} ${h * 1.05} 0 ${h * 1.12} Q ${-w * 0.9} ${h * 1.05} ${-w} 0 Z`;
    g += `<g transform="translate(${f1(fx)} ${my - 3})"><clipPath id="${mid}"><path d="${d}"/></clipPath><path d="${d}" fill="#3E1212"/>`;
    g += `<g clip-path="url(#${mid})"><ellipse cx="0" cy="${f1(h * 1.1)}" rx="${f1(w * 0.62)}" ry="${f1(h * 0.42)}" fill="#C9564E"/>`;
    if (ab > 0.3) g += `<rect x="${-w}" y="${f1(-h * 0.3)}" width="${w * 2}" height="${f1(Math.min(5, h * 0.28) + h * 0.2)}" fill="#FBF6EC"/>`;
    g += `</g><path d="${d}" fill="none" ${tk(3.5)}/><path d="M ${f1(-w * 0.55)} ${f1(h * 1.32)} Q 0 ${f1(h * 1.48)} ${f1(w * 0.55)} ${f1(h * 1.32)}" fill="none" ${tk(2.2)} opacity="0.4"/></g>`;
  }
  if (barba && barba !== 'rala') g += `<path d="M -26 49 C -17 40 -6 42 0 46 C 6 42 17 40 26 49 C 30 54 22 56 14 52 C 8 50 4 50 0 52 C -4 50 -8 50 -14 52 C -22 56 -30 54 -26 49 Z" transform="translate(${f1(fx)} 0)" fill="${corBarba}" ${tk(3.5)}/>`;
  return g;
}

// Estilo 'livro' (livro ilustrado, o mais perto do traço que o canal já usa): olho em ponto preto com brilho,
// sobrancelha curta, nariz em gancho e boca de uma linha. Pouca coisa, para a emoção vir da sobrancelha e da boca.
function rostoLivro(o, c) {
  const { id, corBarba, cap, fx, turn, lx, ly, pisca, barba, hum } = c;
  const hm = o.humor || 'neutro', [palp, incl] = hum;
  let ab = c.ab;
  if ((hm === 'espanto' || hm === 'medo') && ab < 0.3) ab = 0.3;
  let g = '';
  [-1, 1].forEach((d) => {
    const longe = Math.max(0, d * turn), sx = 1 - longe * 0.2;
    const ex = d * 30 + fx + lx * 4, ey = -6 + ly * 3, rx = 8 * sx, ry = hm === 'espanto' ? 13 : 11;
    const pl = PALP_LIVRO[hm] || 0, lid = Math.min(1, pl + pisca * (1 - pl));
    if (lid > 0.9) g += `<path d="M ${f1(ex - 10)} ${ey} Q ${f1(ex)} ${ey + 6} ${f1(ex + 10)} ${ey}" fill="none" ${tk(4.5)}/>`;
    else {
      const cid = `${id}p${d}`, cut = ey - ry + 2 * ry * lid * 0.9, inc = incl * 6 * d;
      g += `<clipPath id="${cid}"><path d="M ${f1(ex - 20)} ${f1(cut - inc)} L ${f1(ex + 20)} ${f1(cut + inc)} L ${f1(ex + 20)} ${ey + 30} L ${f1(ex - 20)} ${ey + 30} Z"/></clipPath>`;
      g += `<g clip-path="url(#${cid})"><ellipse cx="${f1(ex)}" cy="${f1(ey)}" rx="${f1(rx)}" ry="${ry}" fill="#1A120C"/><circle cx="${f1(ex - 2.5)}" cy="${f1(ey - 4)}" r="2.8" fill="#fff"/></g>`;
      if (lid > 0.15) g += `<path d="M ${f1(ex - 11)} ${f1(cut - inc)} L ${f1(ex + 11)} ${f1(cut + inc)}" fill="none" ${tk(3.5)}/>`;
      if (o.cilios) g += `<path d="M ${f1(ex + d * 8)} ${f1(ey - 6)} l ${d * 7} -5" fill="none" ${tk(3)}/>`;
    }
    let [bi, bo, ba] = (SOB_LONGA[hm] || SOB_LONGA.neutro).map((v, k) => (k < 2 ? v - 4 : v));
    if (hm === 'deboche' && d > 0) [bi, bo, ba] = [-46, -52, -6];
    const dy = cap ? 6 : 0, xi = d * 18 + fx, xo = d * 44 + fx;
    g += `<path d="M ${f1(xi)} ${bi + dy} Q ${f1((xi + xo) / 2)} ${Math.min(bi, bo) + ba + dy} ${f1(xo)} ${bo + dy}" fill="none" ${tk(5, shade(corBarba, 0.85))}/>`;
  });
  [-1, 1].forEach((d) => (g += `<ellipse cx="${d * 50 + fx}" cy="26" rx="15" ry="9" fill="#E9806A" opacity="0.4"/>`));
  if (o.lagrimas) [-1, 1].forEach((d) => (g += `<path d="M ${d * 34 + fx} 12 c -5 9 -5 14 0 15 c 5 -1 5 -6 0 -15 Z" fill="#A9D8FF" ${tk(2)}/>`));
  g += `<path d="M ${f1(fx + 2)} 12 Q ${f1(fx - 10)} 26 ${f1(fx + 4)} 30" fill="none" ${tk(3.5)}/>`;
  const my = 54;
  if (ab < 0.08) {
    const forma = { sereno: 'M -12 -1 Q 0 5 12 -1', triste: 'M -12 4 Q 0 -3 12 4', choro: 'M -12 4 Q 0 -3 12 4', dor: 'M -12 4 Q 0 -2 12 4',
      raiva: 'M -13 3 Q 0 -3 13 3', deboche: 'M -12 2 Q 2 4 15 -5', firme: 'M -11 0 L 11 0' }[hm] || 'M -12 0 Q 0 3 12 0';
    g += `<path d="${forma}" transform="translate(${f1(fx)} ${my})" fill="none" ${tk(4)}/>`;
  } else {
    const w = 11, h = 3 + ab * 14;
    g += `<path d="M ${f1(fx - w)} ${my - 2} Q ${f1(fx)} ${my - 4} ${f1(fx + w)} ${my - 2} Q ${f1(fx + w * 0.8)} ${f1(my + h)} ${f1(fx)} ${f1(my + h)} Q ${f1(fx - w * 0.8)} ${f1(my + h)} ${f1(fx - w)} ${my - 2} Z" fill="#3E1212" ${tk(3.5)}/>`;
  }
  if (barba && barba !== 'rala') g += `<path d="M -22 45 C -14 38 -5 40 0 43 C 5 40 14 38 22 45 C 25 50 18 51 12 48 C 6 46 3 46 0 48 C -3 46 -6 46 -12 48 C -18 51 -25 50 -22 45 Z" transform="translate(${f1(fx)} 0)" fill="${corBarba}" ${tk(3.5)}/>`;
  return g;
}

// Estilo do rosto: 'atual', 'longa' ou 'livro'. A URL pode trocar (?rosto=longa), para comparar.
const ROSTOS = { atual: rostoAtual, longa: rostoLonga, livro: rostoLivro };
const ROSTO = new URLSearchParams(location.search).get('rosto') || 'longa'; // 'longa' desde a revisão de 13/11 (o 'atual' ficou com cara de sono)

// ---------- corpo inteiro ----------

// Ângulos do braço [ombro, cotovelo] para a mão chegar em (hx, hy), coordenadas do corpo; o cotovelo fica para fora.
function alcance(d, hx, hy) {
  const L1 = 160, L2 = 146, sx = d * 104, sy = -608, vx = hx - sx, vy = hy - sy;
  const D = Math.min(Math.hypot(vx, vy), L1 + L2 - 1), r = 180 / Math.PI;
  const phi = Math.atan2(vx * d, vy) * r, alpha = Math.acos(clamp((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), -1, 1)) * r;
  const a = phi + alpha, ex = sx + d * L1 * Math.sin(a / r), ey = sy + L1 * Math.cos(a / r);
  return [a, Math.atan2((hx - ex) * d, hy - ey) * r - a];
}

// Personagem de pé, pés em (x, y), escala s (~900 de altura em s = 1; a cabeça fica em y - 770·s).
// o: tudo da cabeça (acima) e roupa (cor da túnica), roupa2 (manto por cima, de um ombro ao quadril), cinto,
// soldado (couraça, saiote de couro e capa), capa (cor), bracoE / bracoD [ângulo do ombro, dobra do cotovelo]
// em graus (0 = caído; + abre para fora), mao: 'aponta' | 'orelha', segura {lado, item: 'lanca'|'tunica'|'vara'|'jarro'},
// flip, seed, t (para respirar e piscar).
function toonCorpo(o = {}) {
  const s = o.s || 1, pele = o.pele || TD.pele, roupa = o.roupa || '#B79E7E', t = o.t || 0, seed = o.seed || 1;
  const sold = !!o.soldado, br = respira(t, seed) * 3;
  let g = `<ellipse cx="0" cy="0" rx="150" ry="22" fill="#000" opacity="0.16"/>`;
  // capa de soldado (atrás)
  if (sold || o.capa) g += `<path d="M -112 -630 C -160 -420 -170 -220 -158 -40 L 158 -40 C 170 -220 160 -420 112 -630 Z" fill="${o.capa || '#9E2B25'}" ${tk(5)}/>`;
  if (sold) {
    // pernas à mostra, sandálias de tiras
    [-1, 1].forEach((d) => {
      g += `<path d="M ${d * 34 - 18} -270 L ${d * 34 - 16} -18 L ${d * 34 + 16} -18 L ${d * 34 + 18} -270 Z" fill="${pele}" ${tk(5)}/>`;
      g += `<path d="M ${d * 34 - 17} -120 L ${d * 34 + 17} -100 M ${d * 34 - 17} -80 L ${d * 34 + 17} -60 M ${d * 34 - 17} -40 L ${d * 34 + 17} -24" ${tk(4, '#5B3A22')}/>`;
      g += `<ellipse cx="${d * 36}" cy="-10" rx="30" ry="13" fill="#5B3A22" ${tk(4)}/>`;
    });
    g += `<path d="M -104 -640 Q 0 -660 104 -640 C 112 -520 100 -440 104 -400 L 118 -250 Q 0 -232 -118 -250 L -104 -400 C -100 -440 -112 -520 -104 -640 Z" fill="${roupa}" ${tk(5)}/>`;
  } else {
    [-1, 1].forEach((d) => (g += `<ellipse cx="${d * 38}" cy="-12" rx="34" ry="15" fill="#6B4A2E" ${tk(4)}/>`));
    const hem = `C 116 -250 128 -100 132 -26 Q 0 -6 -132 -26 C -128 -100 -116 -250 -100 -400`;
    g += `<path d="M -112 -640 Q 0 -662 112 -640 C 122 -520 100 -440 100 -400 ${hem} C -100 -440 -122 -520 -112 -640 Z" fill="${roupa}" ${tk(5)}/>`;
    g += `<path d="M -40 -380 C -48 -260 -56 -140 -60 -36 M 30 -380 C 38 -250 50 -140 58 -34 M 84 -560 C 96 -480 92 -430 88 -400" fill="none" ${tk(3.5, shade(roupa, 0.72))}/>`;
    g += `<path d="M 60 -640 C 100 -560 104 -460 100 -400 C 112 -250 124 -110 130 -28 L 70 -20 C 76 -140 72 -280 60 -400 Z" fill="#000" opacity="0.1"/>`;
  }
  if (o.roupa2) g += `<path d="M -112 -640 C -40 -620 40 -520 112 -330 L 108 -250 C 30 -420 -60 -520 -116 -560 Z" fill="${o.roupa2}" ${tk(5)}/>`;
  if (sold) {
    // couraça de placas, ombreiras e saiote de tiras de couro
    for (let i = 0; i < 7; i++) g += `<rect x="${-58 + i * 17}" y="-410" width="17" height="96" rx="5" fill="#7A4E2C" ${tk(3.5)}/>`;
    g += `<path d="M -100 -640 Q 0 -664 100 -640 L 106 -404 Q 0 -390 -106 -404 Z" fill="#A9B0BA" ${tk(5)}/>`;
    for (let i = 1; i < 7; i++) g += `<path d="M -104 ${-640 + i * 34} Q 0 ${-656 + i * 34} 104 ${-640 + i * 34}" fill="none" ${tk(3, '#6F7782')}/>`;
    g += `<path d="M -60 -630 Q -20 -600 -30 -420" fill="none" ${tk(8, '#D9DEE4')} opacity="0.6"/>`;
    if (o.medalhas) [-560, -500, -440].forEach((y) => (g += `<circle cx="-36" cy="${y}" r="14" fill="#E2B04A" ${tk(3)}/><circle cx="36" cy="${y}" r="14" fill="#E2B04A" ${tk(3)}/>`));
  } else if (o.cinto) g += `<path d="M -102 -428 Q 0 -410 102 -428 L 102 -404 Q 0 -386 -102 -404 Z" fill="${o.cinto}" ${tk(4)}/>`;
  // pescoço
  g += `<path d="M -26 -690 L -28 -634 Q 0 -620 28 -634 L 26 -690 Z" fill="${shade(pele, 0.82)}" ${tk(4)}/>`;
  // braços: [ângulo do ombro, dobra do cotovelo]
  const braco = (d, ang) => {
    const [a, b] = ang, r = Math.PI / 180, L1 = 160, L2 = 146;
    const sx = d * 104, sy = -608 + br;
    const ex = sx + d * L1 * Math.sin(a * r), ey = sy + L1 * Math.cos(a * r);
    const hx = ex + d * L2 * Math.sin((a + b) * r), hy = ey + L2 * Math.cos((a + b) * r);
    const manga = sold ? pele : shade(roupa, 0.92), mangaSup = sold ? roupa : manga;
    let s2 = `<path d="M ${sx} ${sy} L ${f1(ex)} ${f1(ey)} L ${f1(hx)} ${f1(hy)}" fill="none" ${tk(52)}/>`;
    s2 += `<path d="M ${f1(ex)} ${f1(ey)} L ${f1(hx)} ${f1(hy)}" fill="none" stroke="${manga}" stroke-width="40" stroke-linecap="round"/>`;
    s2 += `<path d="M ${sx} ${sy} L ${f1(ex)} ${f1(ey)}" fill="none" stroke="${mangaSup}" stroke-width="42" stroke-linecap="round"/>`;
    if (sold) s2 += `<circle cx="${sx}" cy="${sy + 6}" r="34" fill="#A9B0BA" ${tk(4)}/>`;
    // mão
    const mao = d < 0 ? o.maoE : o.maoD;
    if (mao === 'aponta') {
      const ang2 = (a + b) * r;
      s2 += `<path d="M ${f1(hx)} ${f1(hy)} l ${f1(d * 46 * Math.sin(ang2))} ${f1(46 * Math.cos(ang2))}" ${tk(17)}/><path d="M ${f1(hx)} ${f1(hy)} l ${f1(d * 46 * Math.sin(ang2))} ${f1(46 * Math.cos(ang2))}" stroke="${pele}" stroke-width="9" stroke-linecap="round"/>`;
    }
    s2 += `<circle cx="${f1(hx)} " cy="${f1(hy)}" r="25" fill="${pele}" ${tk(4.5)}/><ellipse cx="${f1(hx - d * 18)}" cy="${f1(hy - 10)}" rx="9" ry="13" fill="${pele}" ${tk(3.5)}/>`;
    return { svg: s2, hx, hy };
  };
  const bE = braco(-1, o.alvoE ? alcance(-1, ...o.alvoE) : o.bracoE || [12, 8]), bD = braco(1, o.alvoD ? alcance(1, ...o.alvoD) : o.bracoD || [12, 8]);
  // objeto na mão
  let item = '';
  const seg = o.segura;
  if (seg) {
    const h = seg.lado < 0 ? bE : bD;
    if (seg.item === 'lanca') item = `<line x1="${f1(h.hx)}" y1="${f1(h.hy + 160)}" x2="${f1(h.hx)}" y2="${f1(h.hy - 520)}" ${tk(16)}/><line x1="${f1(h.hx)}" y1="${f1(h.hy + 160)}" x2="${f1(h.hx)}" y2="${f1(h.hy - 520)}" stroke="#8A5B35" stroke-width="8" stroke-linecap="round"/><path d="M ${f1(h.hx - 14)} ${f1(h.hy - 510)} L ${f1(h.hx)} ${f1(h.hy - 580)} L ${f1(h.hx + 14)} ${f1(h.hy - 510)} Z" fill="#C9CED6" ${tk(4)}/>`;
    if (seg.item === 'vara') {
      const [x2, y2] = seg.ate || [h.hx + seg.lado * 120, h.hy - 520];
      item = `<line x1="${f1(h.hx)}" y1="${f1(h.hy + 40)}" x2="${f1(x2)}" y2="${f1(y2)}" ${tk(14)}/><line x1="${f1(h.hx)}" y1="${f1(h.hy + 40)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="#7E9A52" stroke-width="7" stroke-linecap="round"/>`;
      item += `<ellipse cx="${f1(x2)}" cy="${f1(y2)}" rx="24" ry="18" fill="#E9D79C" ${tk(4)}/><circle cx="${f1(x2 - 6)}" cy="${f1(y2 - 3)}" r="3" fill="#B9A15F"/><circle cx="${f1(x2 + 8)}" cy="${f1(y2 + 4)}" r="3" fill="#B9A15F"/>`;
    }
    if (seg.item === 'jarro') item = `<path d="M ${f1(h.hx - 36)} ${f1(h.hy - 10)} C ${f1(h.hx - 44)} ${f1(h.hy + 60)} ${f1(h.hx + 44)} ${f1(h.hy + 60)} ${f1(h.hx + 36)} ${f1(h.hy - 10)} L ${f1(h.hx + 22)} ${f1(h.hy - 40)} L ${f1(h.hx - 22)} ${f1(h.hy - 40)} Z" fill="#B66A3C" ${tk(4.5)}/><path d="M ${f1(h.hx - 30)} ${f1(h.hy + 10)} Q ${f1(h.hx)} ${f1(h.hy + 20)} ${f1(h.hx + 30)} ${f1(h.hy + 10)}" fill="none" ${tk(3, '#E2A06D')}/>`;
  }
  // a túnica sem costura, segurada entre as duas mãos
  if (seg && seg.item === 'tunica') {
    const x0 = Math.min(bE.hx, bD.hx), x1 = Math.max(bE.hx, bD.hx), y0 = Math.min(bE.hy, bD.hy);
    item = `<path d="M ${f1(x0)} ${f1(y0)} L ${f1(x1)} ${f1(y0)} L ${f1(x1 + 20)} ${f1(y0 + 300)} Q ${f1((x0 + x1) / 2)} ${f1(y0 + 320)} ${f1(x0 - 20)} ${f1(y0 + 300)} Z" fill="#E7DDC9" ${tk(5)}/>`;
    item += `<path d="M ${f1(x0 + 30)} ${f1(y0 + 40)} C ${f1(x0 + 26)} ${f1(y0 + 140)} ${f1(x0 + 20)} ${f1(y0 + 220)} ${f1(x0 + 10)} ${f1(y0 + 290)} M ${f1(x1 - 40)} ${f1(y0 + 30)} C ${f1(x1 - 30)} ${f1(y0 + 140)} ${f1(x1 - 20)} ${f1(y0 + 220)} ${f1(x1)} ${f1(y0 + 296)}" fill="none" ${tk(3, '#BBAE96')}/>`;
  }
  g += item && seg.item === 'lanca' ? item : '';
  g += bE.svg + bD.svg;
  if (item && seg.item !== 'lanca') g += item;
  // cabeça
  const cab = toonCabeca({ ...o, pisca: o.pisca ?? piscaDe(t, seed), tilt: o.tilt || 0 });
  g += `<g transform="translate(0 ${f1(-770 + br * 0.6)})">${cab}</g>`;
  const fl = o.flip ? -1 : 1;
  return `<g transform="translate(${f1(o.x || 0)} ${f1(o.y || 0)}) scale(${f1(s * fl * 1000) / 1000} ${f1(s * 1000) / 1000})">${g}</g>`;
}

// ---------- crucificado ----------

// Cruz com o personagem, pé da cruz em (x, y), escala s. o: tudo da cabeça, placa (Jesus), cordas (os criminosos),
// tilt (cabeça), curva (0 a 1: a cabeça curvada no fim), t, seed.
function toonCrucificado(o = {}) {
  const s = o.s || 1, pele = o.pele || TD.pele, t = o.t || 0, seed = o.seed || 1, madeira = '#8A5B35';
  const br = o.parado ? 0 : respira(t * 0.8, seed) * 3;
  let g = '';
  g += `<path d="M -27 0 L -27 -1040 L 27 -1040 L 27 0 Z" fill="${madeira}" ${tk(5)}/><path d="M -430 -700 L 430 -700 L 430 -652 L -430 -652 Z" fill="${madeira}" ${tk(5)}/>`;
  g += `<path d="M -8 -1020 L -10 -720 M 12 -620 L 10 -40 M -400 -684 L -60 -680 M 80 -668 L 400 -672" fill="none" ${tk(3, '#5E3B20')} opacity="0.7"/>`;
  g += `<path d="M 27 -1040 L 27 0 L 10 0 L 10 -1040 Z M -430 -652 L 430 -652 L 430 -664 L -430 -664 Z" fill="#000" opacity="0.18"/>`;
  if (o.placa) {
    g += `<rect x="-110" y="-1032" width="220" height="74" rx="6" fill="#EFE3C6" ${tk(5)}/>`;
    [-1016, -996, -976].forEach((y, i) => (g += `<path d="M -90 ${y} ${Array.from({ length: 9 }, (_, k) => `q 5 ${i === 1 ? -4 : 4} 10 0 q 5 ${i === 1 ? 4 : -4} 10 0`).join(' ')}" fill="none" ${tk(2.5, '#6B5236')}/>`));
  }
  // braços ao longo da trave
  [-1, 1].forEach((d) => {
    g += `<path d="M ${d * 64} ${-636 + br} L ${d * 230} ${-668} L ${d * 380} ${-678}" fill="none" ${tk(48)}/><path d="M ${d * 64} ${-636 + br} L ${d * 230} ${-668} L ${d * 380} ${-678}" fill="none" stroke="${pele}" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += `<circle cx="${d * 392}" cy="-678" r="24" fill="${pele}" ${tk(4.5)}/>`;
    if (o.cordas) g += `<path d="M ${d * 352} -700 L ${d * 360} -654 M ${d * 368} -702 L ${d * 376} -654" ${tk(7, '#A88A5A')}/>`;
  });
  // tronco, pano na cintura e pernas
  g += `<path d="M -74 ${-660 + br} Q 0 ${-678 + br} 74 ${-660 + br} C 70 -560 60 -480 56 -410 L -56 -410 C -60 -480 -70 -560 -74 ${-660 + br} Z" fill="${pele}" ${tk(5)}/>`;
  g += `<path d="M 30 -650 C 60 -560 54 -470 50 -412 L 20 -412 C 30 -480 32 -570 30 -650 Z" fill="#000" opacity="0.12"/>`;
  g += `<path d="M -40 -600 Q -20 -588 -6 -600 M 6 -600 Q 20 -588 40 -600 M -30 -540 Q 0 -530 30 -540" fill="none" ${tk(3, shade(pele, 0.7))} opacity="0.6"/>`;
  [-1, 1].forEach((d) => (g += `<path d="M ${d * 26} -330 C ${d * 30 + 14} -240 ${d * 24 + 20} -170 ${d * 12 + 12} -96" fill="none" ${tk(50)}/><path d="M ${d * 26} -330 C ${d * 30 + 14} -240 ${d * 24 + 20} -170 ${d * 12 + 12} -96" fill="none" stroke="${pele}" stroke-width="38" stroke-linecap="round"/>`));
  g += `<ellipse cx="14" cy="-86" rx="34" ry="16" fill="${pele}" ${tk(4)}/>`;
  g += `<path d="M -66 -430 Q 0 -446 66 -430 L 74 -330 Q 30 -300 0 -340 Q -30 -300 -74 -330 Z" fill="#EDE4D2" ${tk(5)}/><path d="M -20 -424 L -6 -340 M 30 -424 L 34 -330" fill="none" ${tk(3, '#BEB29A')}/>`;
  // pescoço e cabeça (curva: cabeça caída para a frente e de lado, devagar)
  const cv = clamp(o.curva || 0), tilt = (o.tilt || 6) + cv * 16;
  g += `<path d="M -24 -700 L -26 -650 Q 0 -640 26 -650 L 24 -700 Z" fill="${shade(pele, 0.8)}" ${tk(4)}/>`;
  const cab = toonCabeca({ ...o, pisca: o.parado ? 1 : o.pisca ?? piscaDe(t, seed), tilt, look: cv > 0 ? [0, 1] : o.look });
  g += `<g transform="translate(${f1(tilt * 0.8)} ${f1(-766 + cv * 40 + br * 0.5)}) scale(0.94)">${cab}</g>`;
  return `<g transform="translate(${f1(o.x || 0)} ${f1(o.y || 0)}) scale(${s})">${g}</g>`;
}

// ---------- cenário ----------

// k: 0 é a manhã, 1 é o escuro do meio-dia às três (Mateus 27:45). Mundo de 1080×1920 no zoom 1.
function ceuDes(k, t = 0) {
  const id = 'cd' + ++_tdId;
  const top = mixCor('#79B4E4', '#0B0D1C', k), mid = mixCor('#B9DDF2', '#221C35', k), hor = mixCor('#FBE7C2', '#4A2B33', k);
  let g = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="0.55" stop-color="${mid}"/><stop offset="0.8" stop-color="${hor}"/></linearGradient>${radial(id + 's', '#FFF3C4', 1)}</defs>`;
  g += `<rect x="-2000" y="-2000" width="5080" height="5920" fill="url(#${id})"/>`;
  // sol (perde a luz no escuro)
  g += `<circle cx="800" cy="520" r="${f1(260 * (1 - k * 0.85))}" fill="url(#${id}s)" opacity="${f1((1 - k) * 0.9 * 100) / 100}"/>`;
  g += `<circle cx="800" cy="520" r="62" fill="${mixCor('#FFF6D8', '#5A2A26', k)}" opacity="${f1((1 - k * 0.6) * 100) / 100}"/>`;
  // nuvens que andam devagar
  const nv = mixCor('#FFFFFF', '#2C2540', k), nvDk = mixCor('#DCE7F0', '#1A1528', k);
  [[120, 330, 1], [620, 230, 0.8], [980, 420, 0.9], [-200, 520, 0.7]].forEach(([x, y, sc], i) => {
    const xx = ((x + t * (8 + i * 3) + 400) % 1700) - 400;
    g += `<g transform="translate(${f1(xx)} ${y}) scale(${sc})"><path d="M -150 30 C -170 -10 -120 -40 -80 -24 C -66 -70 0 -80 30 -40 C 60 -70 130 -50 126 -6 C 170 0 170 40 130 44 L -130 44 C -160 44 -170 36 -150 30 Z" fill="${nv}"/><path d="M -130 44 L 130 44 C 150 40 150 30 140 26 C 80 34 -60 34 -150 30 C -156 40 -144 44 -130 44 Z" fill="${nvDk}"/></g>`;
  });
  return g;
}
// Jerusalém ao longe (João 19:20: o lugar ficava perto da cidade), muralha com torres e o templo à direita.
function jerusalemDes(y, k) {
  const c = mixCor('#A7B6C8', '#2A2539', k), c2 = mixCor('#93A3B8', '#221E30', k);
  let g = `<path d="M -200 ${y} L -200 ${y - 70} L 60 ${y - 70} L 60 ${y - 110} L 110 ${y - 110} L 110 ${y - 70} L 340 ${y - 70} L 340 ${y - 120} L 390 ${y - 120} L 390 ${y - 76} L 640 ${y - 76} L 640 ${y - 104} L 700 ${y - 104} L 700 ${y - 80} L 1300 ${y - 80} L 1300 ${y} Z" fill="${c}"/>`;
  for (let x = -190; x < 1290; x += 26) g += `<rect x="${x}" y="${y - 84 - (x > 640 ? 6 : 0)}" width="14" height="14" fill="${c}"/>`;
  g += `<path d="M 760 ${y - 80} L 760 ${y - 230} L 990 ${y - 230} L 990 ${y - 80} Z M 820 ${y - 230} L 820 ${y - 300} L 930 ${y - 300} L 930 ${y - 230} Z" fill="${c2}"/>`;
  for (let x = 780; x < 980; x += 30) g += `<rect x="${x}" y="${y - 200}" width="10" height="110" fill="${mixCor(c2, '#000000', 0.15)}"/>`;
  return g;
}
// Morros e o chão do Calvário.
function morroDes(k, racha = 0) {
  const longe = mixCor('#CDBB92', '#352B37', k), meio = mixCor('#C19A62', '#45372F', k), meioDk = mixCor('#A57F4C', '#33281F', k);
  const chao = mixCor('#B08552', '#3A2D24', k), chaoDk = mixCor('#94693B', '#291F18', k);
  let g = `<path d="M -400 1150 C -100 1040 200 1080 420 1060 C 700 1036 980 1090 1500 1060 L 1500 2400 L -400 2400 Z" fill="${longe}"/>`;
  g += jerusalemDes(1070, k);
  g += `<path d="M -400 1180 C -100 1110 200 1140 420 1120 C 700 1100 980 1150 1500 1120 L 1500 2400 L -400 2400 Z" fill="${longe}"/>`;
  g += `<path d="M -300 1560 C -60 1380 250 1290 540 1280 C 830 1290 1140 1380 1380 1560 L 1380 2400 L -300 2400 Z" fill="${meio}" ${tk(5)}/>`;
  g += `<path d="M 700 1290 C 900 1320 1140 1400 1380 1560 L 1380 1700 C 1150 1560 900 1440 640 1370 Z" fill="${meioDk}" opacity="0.6"/>`;
  [[150, 1500, 1.1], [930, 1470, 0.9], [380, 1360, 0.6], [760, 1350, 0.55]].forEach(([x, y, sc], i) => (g += pedraDes(x, y, sc, k, racha * (i < 2 ? 1 : 0))));
  g += `<path d="M -400 1760 C 0 1700 500 1730 1000 1700 C 1200 1690 1400 1700 1500 1710 L 1500 2600 L -400 2600 Z" fill="${chao}" ${tk(5)}/>`;
  g += `<path d="M -400 1900 C 200 1850 700 1880 1500 1840 L 1500 2600 L -400 2600 Z" fill="${chaoDk}" opacity="0.5"/>`;
  [[60, 1790], [300, 1760], [700, 1770], [990, 1750], [180, 1850], [880, 1830]].forEach(([x, y]) => (g += tufoDes(x, y, k)));
  return g;
}
function pedraDes(x, y, sc, k, racha = 0) {
  const c = mixCor('#A99A86', '#3B3530', k), cDk = mixCor('#857762', '#2A2522', k);
  let g = `<path d="M -90 0 C -100 -40 -60 -76 -10 -80 C 50 -84 96 -50 92 0 Z" fill="${c}" ${tk(5)}/><path d="M 20 -80 C 60 -70 96 -46 92 0 L 30 0 C 50 -30 44 -60 20 -80 Z" fill="${cDk}"/>`;
  // rachadura (Mateus 27:51: as rochas se partiram), de cima para baixo
  if (racha > 0) g += `<path d="M -6 -80 L 6 -56 L -10 -36 L 8 -16 L -4 0" fill="none" ${tk(6, '#1A1410')} pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${f1((1 - clamp(racha)) * 1000) / 1000}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${sc})">${g}</g>`;
}
function tufoDes(x, y, k) {
  const c = mixCor('#7E8A4A', '#2E3324', k);
  return `<path d="M ${x - 30} ${y} q 6 -40 14 -46 q 0 30 6 40 q 6 -50 18 -58 q -2 40 4 56 q 10 -30 22 -36 q -6 26 -4 44 Z" fill="${c}" ${tk(3.5)}/>`;
}
// Escurece o quadro todo (as trevas) e a vinheta das bordas.
function trevasDes(k) {
  return `<rect x="-2000" y="-2000" width="5080" height="5920" fill="#0A0818" opacity="${f1(k * 0.38 * 100) / 100}"/>`;
}
// Vinheta: vai por cima da câmera (coordenadas do quadro), senão a borda dela aparece quando a câmera anda.
function vinhetaDes(k) {
  const id = 'vn' + ++_tdId;
  return `<defs><radialGradient id="${id}" cx="50%" cy="45%" r="70%"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${f1((0.28 + k * 0.3) * 100) / 100}"/></radialGradient></defs><rect x="0" y="0" width="1080" height="1920" fill="url(#${id})"/>`;
}
// Câmera: o ponto (x, y) do mundo vai para o centro do quadro, com zoom z; tremor (terremoto) opcional.
function camDes(svg, x, y, z = 1, o = {}) {
  const tr = o.tremor ? [Math.sin(o.t * 53) * o.tremor, Math.cos(o.t * 41) * o.tremor * 0.7] : [0, 0];
  return `<g transform="translate(${f1(540 + tr[0])} ${f1(960 + tr[1])}) scale(${f1(z * 1000) / 1000}) translate(${f1(-x)} ${f1(-y)})">${svg}</g>`;
}
// Câmera que anda de um enquadramento a outro ao longo da cena (a, b: [x, y, z]).
function camVai(svg, t, t0, t1, a, b, o = {}) {
  const p = E.sine(prog(t, t0, t1));
  return camDes(svg, lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(a[2], b[2], p), { ...o, t });
}
