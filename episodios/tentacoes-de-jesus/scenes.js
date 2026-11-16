// As 3 tentações de Jesus (Mateus 4:1-11; Deuteronômio 8; Hebreus 2 e 4). Curto vertical escrito do zero, ~2:45.
// As cenas começam pelo índice da frase em SEGS (at(i)) e os gestos por wordTime(i, 'palavra').
// O diabo é sempre uma sombra sem rosto (sil), nunca caricatura. Na cena do templo não há beirada nem queda:
// os dois aparecem de longe, de pé no alto do templo (nota de produção do roteiro).

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
const MOISES = { robe: C.p500, skin: '#C68B59', hair: '#E9E3DC', beard: true };
const ANJO = { robe: '#FFFFFF', skin: '#E0AC69', hair: '#F2D9A0', rim: C.a300, mood: 'calm' };
const SOMBRA = '#17110F';
const AREIA = ['#F1DDB8', '#E6C994', '#D9B57C', '#C79D63'];

// ---------------------------------------------------------------- peças do episódio
// Deserto: céu, sol, dunas em tons de areia e chão de areia. o.noite escurece; o.sky troca o céu.
function deserto(t, o = {}) {
  const ox = o.ox || 0, sd = o.seed || 41;
  if (o.noite) {
    let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skyNight)"/>` + stars(t, 70, sd, GROUND - 60, 1);
    if (o.lua !== false) s += moon(o.luaX ?? 800, o.luaY ?? 470, 46, '#14181D');
    s += hills(GROUND - 120, 80, 0.0032, sd, '#2A2622', ox * 0.3) + hills(GROUND - 50, 55, 0.0055, sd + 2, '#221E1B', ox * 0.6);
    s += `<rect x="-400" y="${GROUND}" width="${W + 800}" height="${H}" fill="#1B1714"/>`;
    return s;
  }
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#${o.sky || 'skySunrise'})"/>`;
  if (o.sol !== false) s += sun(o.solX ?? 820, o.solY ?? 520, 62, t);
  s += hills(GROUND - 150, 90, 0.0028, sd, AREIA[0], ox * 0.25) + hills(GROUND - 70, 60, 0.005, sd + 3, AREIA[1], ox * 0.5);
  s += `<defs><linearGradient id="gAreia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${AREIA[1]}"/><stop offset="1" stop-color="${AREIA[2]}"/></linearGradient></defs>`;
  s += `<rect x="-400" y="${GROUND}" width="${W + 800}" height="${H}" fill="url(#gAreia)"/>`;
  const r = rng(sd * 13 + 5);
  for (let i = 0; i < 16; i++) {
    const d = r(), y = GROUND + 90 + d * 560, x = ((r() * (W + 600) - ox * (0.8 + d)) % (W + 600) + W + 600) % (W + 600) - 300;
    s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(10 + d * 26)}" ry="${f1(4 + d * 9)}" fill="${AREIA[3]}" opacity="0.55"/>`;
  }
  return s;
}

// O diabo: sombra sem rosto, com uma névoa escura em volta. op some e aparece.
function sombra(x, y, s, t, o = {}) {
  const op = o.op ?? 1;
  if (op <= 0) return '';
  let g = `<defs><radialGradient id="gSombra"><stop offset="0" stop-color="#0B0807" stop-opacity="0.32"/><stop offset="1" stop-color="#0B0807" stop-opacity="0"/></radialGradient></defs>`;
  g += `<ellipse cx="${f1(x)}" cy="${f1(y - 170 * s)}" rx="${f1(190 * s)}" ry="${f1(250 * s)}" fill="url(#gSombra)"/>`;
  g += person({ x, y, s, sil: SOMBRA, armL: o.armL ?? 14, armR: o.armR ?? 14, lean: o.lean || 0, flip: o.flip, noShadow: false });
  return opg(op, g);
}

// O Espírito: pomba branca de asas abertas (Mateus 3:16), batendo as asas.
function pomba(x, y, s, t) {
  const b = Math.sin(t * 9) * 16;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">
    <path d="M -6 0 C -40 ${f1(-30 - b)} -96 ${f1(-34 - b)} -120 ${f1(-14 - b)} C -84 ${f1(-6 - b / 2)} -46 6 -10 12 Z" fill="#FFFFFF" ${ink(4)}/>
    <path d="M 6 0 C 40 ${f1(-30 - b)} 96 ${f1(-34 - b)} 120 ${f1(-14 - b)} C 84 ${f1(-6 - b / 2)} 46 6 10 12 Z" fill="#FFFFFF" ${ink(4)}/>
    <ellipse cx="0" cy="8" rx="22" ry="34" fill="#FFFFFF" ${ink(4)}/>
    <circle cx="0" cy="-28" r="15" fill="#FFFFFF" ${ink(4)}/>
    <path d="M -6 -22 L 0 -12 L 6 -22 Z" fill="${C.a400}"/>
    <path d="M -14 40 L 0 62 L 14 40 Z" fill="#FFFFFF" ${ink(4)}/>
  </g>`;
}

// Luz do céu sobre (x, y): o raio e um brilho.
function luzCeu(x, y, op, w = 120) {
  if (op <= 0) return '';
  return beam(x, -200, x, y, w * 0.6, w * 1.8, op) + `<circle cx="${f1(x)}" cy="${f1(y - 220)}" r="${f1(w * 2.4)}" fill="url(#gWhite)" opacity="${f1(op * 0.6 * 100) / 100}"/>`;
}

// Pedras do deserto (n), com o pé em (x, y).
function pedras(x, y, s = 1, n = 4) {
  const r = rng(91); let g = '';
  for (let i = 0; i < n; i++) {
    const px = x + (i - (n - 1) / 2) * 92 * s + (r() - 0.5) * 20 * s, rx = (34 + r() * 14) * s, ry = (22 + r() * 8) * s;
    g += `<ellipse cx="${f1(px)}" cy="${f1(y - ry)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${i % 2 ? '#A69A8E' : '#B9AEA2'}" ${ink(4)}/><path d="M ${f1(px - rx * 0.5)} ${f1(y - ry * 1.3)} q ${f1(rx * 0.4)} ${f1(-ry * 0.4)} ${f1(rx * 0.8)} 0" stroke="#fff" stroke-width="3" fill="none" opacity="0.5"/>`;
  }
  return g;
}

// Rolo das Escrituras. aberto (0..1) desenrola; o.glow põe a luz; o.titulo escreve no rolo.
function rolo(x, y, s, aberto, o = {}) {
  const w = lerp(26, 300, E.out(clamp(aberto))) * s, h = 210 * s;
  let g = '';
  if (o.glow) g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(330 * s)}" fill="url(#gAmber)" opacity="${f1(o.glow * 0.7 * 100) / 100}"/>`;
  g += `<rect x="${f1(x - w)}" y="${f1(y - h / 2)}" width="${f1(2 * w)}" height="${f1(h)}" fill="#F5ECD9" ${ink(5)}/>`;
  if (aberto > 0.4 && !o.titulo) for (let k = 0; k < 5; k++) {
    const lw = (w - 46 * s) * (k % 2 ? 0.86 : 1);
    if (lw > 10) g += `<line x1="${f1(x - lw)}" y1="${f1(y - 66 * s + k * 33 * s)}" x2="${f1(x + lw)}" y2="${f1(y - 66 * s + k * 33 * s)}" stroke="${C.g500}" stroke-width="${f1(6 * s)}" stroke-linecap="round"/>`;
  }
  if (o.titulo && aberto > 0.6) g += `<text x="${f1(x)}" y="${f1(y + 16 * s)}" text-anchor="middle" font-family="Gasoek One" font-size="${f1(56 * s)}" fill="${C.inkDeep}">${esc(o.titulo)}</text>`;
  [-1, 1].forEach((d) => {
    g += `<rect x="${f1(x + d * w - 22 * s)}" y="${f1(y - h / 2 - 22 * s)}" width="${f1(44 * s)}" height="${f1(h + 44 * s)}" rx="${f1(20 * s)}" fill="${C.wood}" ${ink(5)}/>`;
  });
  return g;
}

// "40" escrito na areia, revelado da esquerda para a direita (p 0..1).
function areia40(x, y, s, p) {
  if (p <= 0) return '';
  const cw = 560 * s * clamp(p);
  return `<defs><clipPath id="c40"><rect x="${f1(x - 280 * s)}" y="${f1(y - 300 * s)}" width="${f1(cw)}" height="${f1(400 * s)}"/></clipPath></defs>
    <g clip-path="url(#c40)">
      <text x="${f1(x + 6 * s)}" y="${f1(y + 10 * s)}" text-anchor="middle" font-family="Gasoek One" font-size="${f1(330 * s)}" fill="${AREIA[3]}" opacity="0.9">40</text>
      <text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="Gasoek One" font-size="${f1(330 * s)}" fill="none" stroke="#9C7A48" stroke-width="${f1(10 * s)}" opacity="0.8">40</text>
    </g>`;
}

// Templo visto de longe, com a parte mais alta (pináculo) no canto; topo do pináculo em (x + 250 s, base - 640 s).
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

// Monte alto com o pico em (cx, top).
function monte(cx, top, hw, fill = '#BFA27A') {
  return hill(cx, top, hw, fill) + `<path d="M ${f1(cx - 60)} ${f1(top + 30)} L ${cx} ${top} L ${f1(cx + 70)} ${f1(top + 34)} L ${f1(cx + 20)} ${f1(top + 60)} Z" fill="#E7D7BC"/>`;
}

// Coroa (o poder dos reinos).
function coroa(x, y, s, op = 1, fill = C.a300) {
  if (op <= 0) return '';
  return opg(op, `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><path d="M -40 26 L -46 -28 L -22 0 L 0 -36 L 22 0 L 46 -28 L 40 26 Z" fill="${fill}" ${ink(5)}/><circle cx="0" cy="8" r="7" fill="${C.r600}" ${ink(3)}/><circle cx="-26" cy="12" r="5" fill="${C.b500}"/><circle cx="26" cy="12" r="5" fill="${C.b500}"/></g>`);
}

// Bezerro de ouro num pedestal (Êxodo 32:4).
function bezerro(x, y, s) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">
    <circle cx="0" cy="-150" r="160" fill="url(#gAmber)" opacity="0.6"/>
    <rect x="-90" y="-40" width="180" height="40" fill="#B9AEA2" ${ink(5)}/>
    <path d="M -70 -40 L -64 -100 C -60 -140 30 -150 60 -120 L 90 -150 L 98 -136 L 82 -112 C 92 -96 86 -78 70 -76 L 64 -40 L 46 -40 L 44 -78 L -30 -80 L -40 -40 Z" fill="${C.a400}" ${ink(5)}/>
    <path d="M 84 -150 C 74 -168 92 -176 98 -162 M 96 -150 C 100 -172 118 -168 110 -152" stroke="${C.ink}" stroke-width="5" fill="none"/>
  </g>`;
}

// Rocha de Massá (Êxodo 17:6-7).
function rocha(x, y, s) {
  return `<path d="M ${f1(x - 150 * s)} ${f1(y)} L ${f1(x - 130 * s)} ${f1(y - 170 * s)} L ${f1(x - 30 * s)} ${f1(y - 240 * s)} L ${f1(x + 110 * s)} ${f1(y - 190 * s)} L ${f1(x + 160 * s)} ${f1(y)} Z" fill="#A89584" ${ink(6)}/><path d="M ${f1(x - 60 * s)} ${f1(y - 200 * s)} L ${f1(x - 20 * s)} ${f1(y - 120 * s)}" stroke="#7E6C5C" stroke-width="6"/>`;
}

// Tendas do povo no deserto, ao fundo.
function tendas(t, y, n = 6, s = 0.42) {
  let g = '';
  for (let i = 0; i < n; i++) g += tent(80 + i * (920 / (n - 1)), y + (i % 2) * 10, s, '#CDB79A', '#B39C7F', C.r400);
  return g;
}

// Gente do povo de Israel (rosto e roupa variados pela semente).
const povo = (seed, extra = {}) => ({ ...man(seed), ...extra });

// Mão estendida de Jesus: o braço direito sobe até ang no tempo t0.
const ergue = (t, t0, de = 14, ate = 80, d = 0.6) => lerp(de, ate, E.out(prog(t, t0, t0 + d)));

// ---------------------------------------------------------------- 0. gancho: levado ao deserto
function scGancho(t) {
  // Céu escuro no começo: o texto branco do gancho (quadro 0 a 3 s) precisa de contraste.
  let s = deserto(t, { sky: 'skyDusk', sol: false });
  s += `<circle cx="600" cy="${GROUND - 60}" r="520" fill="url(#gPeach)" opacity="0.35"/>`;
  s += sombra(900, 1010, 0.42, t, { op: 0.85 * prog(t, 1.0, 2.6) });
  const wx = lerp(300, 470, E.inOut(prog(t, 0, fim(0))));
  s += luzCeu(wx, 1240, 0.75, 110);
  s += person({ ...JESUS, x: wx, y: 1250, s: 1.3, walk: t * 5, look: 0.5, mood: 'calm' });
  s += opg(prog(t, 2.7, 3.3), pomba(wx + 10, 700 + Math.sin(t * 2) * 10, 0.75, t));
  return { svg: cam(s, 540, 1000, 1.0 + 0.07 * E.sine(prog(t, 0, at(1)))), html: '' };
}

// ---------------------------------------------------------------- 1. o batismo e a voz do céu
function scBatismo(t) {
  const a0 = at(1), voz = wt(1, 'disse');
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skyDay)"/>` + clouds(t, 0);
  s += hills(GROUND - 140, 70, 0.003, 21, '#CFC4AE') + hills(GROUND - 60, 50, 0.005, 23, '#B9B79C');
  s += `<rect x="-400" y="${GROUND}" width="${W + 800}" height="${H}" fill="#B9B79C"/>`;
  s += `<path d="M -400 ${GROUND + 80} C 200 ${GROUND + 40} 700 ${GROUND + 120} ${W + 400} ${GROUND + 60} L ${W + 400} ${H} L -400 ${H} Z" fill="url(#gWater)"/>`;
  const lit = E.out(prog(t, voz - 0.4, voz + 0.4));
  s += luzCeu(540, 1240, 0.35 + 0.55 * lit, 130);
  s += person({ ...JESUS, robe: '#F3EEE7', x: 540, y: 1300, s: 1.3, look: 0, mood: lit > 0.5 ? 'closed' : 'calm', armL: 24, armR: 24 });
  s += `<rect x="-400" y="1180" width="${W + 800}" height="${H}" fill="${C.b400}" opacity="0.55"/>`;
  for (let k = 0; k < 4; k++) s += `<path d="M ${f1(300 + k * 70 + Math.sin(t * 2 + k) * 14)} ${1196 + k * 22} q 60 -14 120 0" stroke="#fff" stroke-width="5" fill="none" opacity="0.6"/>`;
  const d = E.out(prog(t, a0 + 0.5, a0 + 2.6));
  s += pomba(540, lerp(240, 700, d), 0.9, t);
  return { svg: cam(s, 540, 980, 1.02 + 0.06 * E.sine(prog(t, a0, at(2)))), html: '' };
}

// ---------------------------------------------------------------- 2. as primeiras palavras do diabo
function scPrimeiras(t) {
  const a0 = at(2), fala0 = wt(2, 'se');
  let s = deserto(t, { sky: 'skyDusk', sol: false });
  s += `<circle cx="600" cy="${GROUND - 60}" r="520" fill="url(#gPeach)" opacity="0.35"/>`;
  s += person({ ...JESUS, x: 330, y: 1250, s: 1.25, look: 0.6, mood: 'calm', rim: C.p300 });
  const ap = E.out(prog(t, a0 + 0.3, a0 + 1.6));
  s += sombra(lerp(980, 780, ap), 1250, 1.3, t, { op: ap, armR: fala(t, fala0, fim(2), 30, 22), flip: true });
  return { svg: cam(s, 540, 1000, 1.0 + 0.06 * prog(t, a0, at(3))), html: '' };
}

// ---------------------------------------------------------------- 3. ele começou pelo que a voz tinha dito
function scEco(t) {
  const a0 = at(3), troca = wt(3, 'voz');
  let s = deserto(t, { sky: 'skyDusk', sol: false });
  const luz = 1 - 0.6 * E.inOut(prog(t, a0, fim(3)));
  s += luzCeu(400, 1240, 0.6 * luz, 120) + pomba(400, 600, 0.6, t);
  s += person({ ...JESUS, x: 400, y: 1250, s: 1.25, look: 0.4, mood: 'calm' });
  const lean = 10 * E.out(prog(t, troca - 0.3, troca + 0.4));
  s += sombra(790, 1250, 1.3, t, { lean, armR: 40, flip: true });
  return { svg: cam(s, 560, 1000, 1.05 - 0.05 * prog(t, a0, at(4))), html: '' };
}

// ---------------------------------------------------------------- 4. três tentações, a mesma resposta
function scTres(t) {
  const a0 = at(4), r = wt(4, 'respondeu');
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const P = [[270, 640], [540, 640], [810, 640]];
  const ic = [
    (x, y) => pedras(x, y + 70, 0.9, 3),
    (x, y) => `<rect x="${x - 40}" y="${y - 150}" width="80" height="220" fill="#EFE7DB" ${ink(5)}/><rect x="${x - 50}" y="${y - 166}" width="100" height="20" fill="${C.a300}" ${ink(4)}/>`,
    (x, y) => monte(x, y - 40, 130) + coroa(x, y - 70, 0.6),
  ];
  P.forEach(([x, y], k) => {
    const p = pop(t, a0 + 0.3 + k * 0.6, 0.45);
    if (p <= 0) return;
    s += `<g transform="translate(${x} ${y}) scale(${f1(p * 100) / 100}) translate(${-x} ${-y})"><circle cx="${x}" cy="${y}" r="120" fill="${C.g200}" ${ink(5)}/><g clip-path="url(#ct${k})">${ic[k](x, y)}</g><defs><clipPath id="ct${k}"><circle cx="${x}" cy="${y}" r="118"/></clipPath></defs></g>`;
  });
  const rp = E.out(prog(t, r - 0.2, r + 0.6));
  s += rolo(540, 1000, 0.9, rp, { glow: rp });
  return { svg: s, html: '' };
}

// ---------------------------------------------------------------- 5. o deserto
function scDeserto(t) {
  const a0 = at(5);
  let s = deserto(t, { sky: 'skySunrise', solX: 540, solY: 600, ox: t * 6 });
  s += person({ ...JESUS, x: lerp(560, 600, prog(t, a0, at(6))), y: 1090, s: 0.38, walk: t * 5, look: 0.2, noShadow: true });
  s += dust(700, 1100, t, a0 + 0.6, 3, AREIA[2]);
  return { svg: cam(s, 560, 1000, 1.0 + 0.1 * E.inOut(prog(t, a0, at(6)))), html: '' };
}

// ---------------------------------------------------------------- 6. guarda o número quarenta
function sc40(t) {
  const a0 = at(6), w = wt(6, 'quarenta');
  let s = `<rect width="${W}" height="${H}" fill="${AREIA[1]}"/>`;
  const r = rng(404);
  for (let i = 0; i < 70; i++) s += `<circle cx="${f1(r() * W)}" cy="${f1(r() * H)}" r="${f1(3 + r() * 7)}" fill="${AREIA[3]}" opacity="0.35"/>`;
  const p = prog(t, w - 0.4, w + 1.1);
  s += areia40(540, 980, 1.25, p);
  const [hx, hy] = [lerp(340, 760, p), 900 + Math.sin(p * 18) * 40];
  if (p > 0 && p < 1) s += `<line x1="${f1(hx)}" y1="${f1(hy)}" x2="${f1(hx + 160)}" y2="${f1(hy - 380)}" stroke="${C.wood}" stroke-width="16" stroke-linecap="round"/>`;
  return { svg: cam(s, 540, 960, 1.0 + 0.05 * prog(t, a0, at(7))), html: '' };
}

// ---------------------------------------------------------------- 7. quarenta dias e quarenta noites
function scDias(t) {
  const a0 = at(7), fome = wt(7, 'fome');
  const ciclo = (prog(t, a0, fome - 0.4) * 5) % 1, noite = Math.sin(ciclo * Math.PI) > 0.5 ? 1 : 0;
  const nk = clamp(Math.sin(ciclo * Math.PI) * 2 - 0.6);
  let s = deserto(t, { sky: 'skySunrise', solX: lerp(120, 960, ciclo), solY: 520 - Math.sin(ciclo * Math.PI) * 120 });
  s += opg(nk * 0.85, deserto(t, { noite: true, luaX: lerp(960, 120, ciclo) }));
  const triste = t > fome - 0.2;
  s += person({ ...JESUS, x: 540, y: 1250, s: 1.28, kneel: true, look: triste ? 0 : 0.3, mood: triste ? 'sad' : 'closed', armL: 30, armR: 30, rim: noite ? C.b300 : null });
  return { svg: cam(s, 540, 1020, 1.0 + 0.08 * E.inOut(prog(t, a0, at(8)))), html: '' };
}

// ---------------------------------------------------------------- 8. as pedras e os pães
function scPedras(t) {
  const a0 = at(8), paes0 = wt(8, 'pães');
  let s = deserto(t, { sky: 'skySunrise', solX: 860, solY: 470 });
  s += person({ ...JESUS, x: 300, y: 1250, s: 1.22, kneel: true, look: 0.5, mood: 'sad', armL: 26, armR: 26 });
  const ap = E.out(prog(t, a0, a0 + 1.0));
  s += sombra(830, 1250, 1.28, t, { op: ap, armR: lerp(14, 120, E.out(prog(t, wt(8, 'mande') - 0.3, wt(8, 'mande') + 0.3))), flip: true });
  s += pedras(560, 1300, 1.1, 3);
  const gp = prog(t, paes0 - 0.5, paes0 + 0.3);
  s += opg(gp * (0.55 + 0.15 * Math.sin(t * 6)), paes(560, 1240, 1.25, 3));
  return { svg: cam(s, 560, 1060, 1.04 + 0.05 * prog(t, a0, at(9))), html: '' };
}

// ---------------------------------------------------------------- 9. "Está escrito"
function scEscrito1(t) {
  const a0 = at(9), esc0 = wt(9, 'escrito');
  let s = deserto(t, { sky: 'skySunrise', solX: 860, solY: 470 });
  s += person({ ...JESUS, x: 380, y: 1250, s: 1.3, look: 0.5, mood: 'calm', armR: fala(t, seg(9), fim(9), 24, 26) });
  const rp = E.out(prog(t, esc0 - 0.3, esc0 + 0.8));
  s += rolo(760, 760, 0.7, rp, { glow: rp });
  s += sombra(900, 1250, 1.1, t, { op: 1 - 0.5 * rp, flip: true });
  return { svg: cam(s, 560, 1000, 1.0 + 0.06 * prog(t, a0, at(10))), html: '' };
}

// ---------------------------------------------------------------- 10. a palavra na frente do pão
function scPalavraPao(t) {
  const a0 = at(10), virada = wt(10, 'pôs');
  let s = deserto(t, { sky: 'skySunrise', solX: 860, solY: 470 });
  const vp = E.out(prog(t, virada - 0.3, virada + 0.6));
  s += opg(1 - 0.75 * vp, paes(780, 1270, 1.0, 3));
  s += person({ ...JESUS, x: 460, y: 1250, s: 1.3, look: lerp(0.6, -0.4, vp), mood: 'calm' });
  s += rolo(lerp(780, 600, vp), lerp(1040, 820, vp), lerp(0.4, 0.7, vp), 1, { glow: vp });
  return { svg: cam(s, 540, 1000, 1.03), html: '' };
}

// ---------------------------------------------------------------- 11. a cidade santa e o alto do templo
function scTemplo(t) {
  const a0 = at(11), sobe = wt(11, 'alta');
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skyDay)"/>` + clouds(t, 0) + sun(860, 400, 54, t);
  s += hills(GROUND - 120, 70, 0.003, 61, '#E3DBD2') + floor('day');
  s += city(220, 1080, 0.85, t) + city(900, 1090, 0.7, t);
  s += templo(470, 1180, 1.0);
  const topoX = 470 + 270, topoY = 1180 - 660;
  const up = E.out(prog(t, sobe - 0.4, sobe + 0.4));
  s += opg(up, person({ ...JESUS, x: topoX - 30, y: topoY, s: 0.32, look: 0.4, noShadow: true }) + person({ x: topoX + 40, y: topoY, s: 0.34, sil: SOMBRA, noShadow: true }));
  return { svg: cam(s, 560, lerp(1000, 820, E.inOut(prog(t, a0, at(12)))), 1.0 + 0.1 * E.inOut(prog(t, a0, at(12)))), html: '' };
}

// No alto do templo, de perto, mas sem beirada nem vazio: a câmera fica na altura deles, com o céu atrás.
function altoTemplo(t, o = {}) {
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skyDay)"/>` + clouds(t, 0) + sun(820, 380, 54, t);
  s += `<rect x="-100" y="1250" width="${W + 200}" height="${H}" fill="#EFE7DB" ${ink(6)}/>`;
  for (let i = 0; i < 9; i++) s += `<rect x="${-40 + i * 140}" y="1250" width="90" height="70" fill="#E4DACD" ${ink(4)}/>`;
  s += `<rect x="-100" y="1236" width="${W + 200}" height="26" fill="${C.a300}" ${ink(4)}/>`;
  if (o.luz) s += luzCeu(o.jx ?? 380, 1240, o.luz, 120);
  s += person({ ...JESUS, x: o.jx ?? 380, y: 1240, s: 1.28, look: o.look ?? 0.5, mood: 'calm', armR: o.armR ?? 14 });
  s += sombra(o.sx ?? 780, 1240, 1.32, t, { op: o.sop ?? 1, armR: o.sarm ?? 14, lean: o.slean || 0, flip: true });
  return s;
}

// ---------------------------------------------------------------- 12. "jogue-se daqui para baixo"
function scPula(t) {
  const a0 = at(12);
  const s = altoTemplo(t, { sarm: fala(t, wt(12, 'se'), fim(12), 40, 20) });
  return { svg: cam(s, 560, 1000, 1.04 + 0.04 * prog(t, a0, at(13))), html: '' };
}

// ---------------------------------------------------------------- 13. o Salmo 91 na boca do diabo
function scSalmo91(t) {
  const a0 = at(13), anjos = wt(13, 'anjos');
  let s = altoTemplo(t, { sarm: 70, look: 0.6 });
  s += `<g transform="translate(700 860) rotate(-8)">${rolo(0, 0, 0.42, 1).replace(/#F5ECD9/g, '#5A4E47').replace(new RegExp(C.g500, 'g'), '#3A322D')}</g>`;
  const ap = prog(t, anjos - 0.3, anjos + 0.7) * (1 - prog(t, fim(13) - 0.6, fim(13)));
  [[220, 520], [860, 470]].forEach(([x, y], k) => (s += opg(0.45 * ap, person({ ...ANJO, x, y: y + Math.sin(t * 2 + k) * 12, s: 0.6, armL: 60, armR: 60, noShadow: true }))));
  return { svg: cam(s, 560, 980, 1.06 - 0.04 * prog(t, a0, at(14))), html: '' };
}

// ---------------------------------------------------------------- 14. "Também está escrito"
function scEscrito2(t) {
  const a0 = at(14), esc0 = wt(14, 'escrito');
  const rp = E.out(prog(t, esc0 - 0.3, esc0 + 0.8));
  let s = altoTemplo(t, { armR: fala(t, seg(14), fim(14), 24, 26), sop: 1 - 0.4 * rp, look: 0.6 });
  s += rolo(380, 640, 0.6, rp, { glow: rp });
  return { svg: cam(s, 500, 980, 1.02 + 0.05 * prog(t, a0, at(15))), html: '' };
}

// ---------------------------------------------------------------- 15. cobrar de Deus uma prova
function scProva(t) {
  const a0 = at(15), estava = wt(15, 'estava');
  const lp = E.out(prog(t, estava - 0.5, estava + 0.4));
  const s = altoTemplo(t, { luz: 0.25 + 0.5 * lp, look: 0, slean: -8 * lp, sx: lerp(780, 860, lp), sop: 1 - 0.3 * lp });
  return { svg: cam(s, 440, 1000, 1.06 - 0.04 * prog(t, a0, at(16))), html: '' };
}

// Reinos do mundo vistos do monte: cidades no vale com brilho dourado.
function reinos(t, brilho) {
  let g = hills(GROUND - 110, 60, 0.003, 71, '#E2CFAE') + `<rect x="-400" y="${GROUND - 40}" width="${W + 800}" height="${H}" fill="#D7C29E"/>`;
  [[110, 1010, 0.26], [330, 1040, 0.3], [560, 1000, 0.24], [770, 1050, 0.32], [980, 1015, 0.26], [220, 1110, 0.36], [660, 1120, 0.4], [900, 1150, 0.34]].forEach(([x, y, sc]) => (g += city(x, y, sc, t)));
  if (brilho > 0) g += `<ellipse cx="540" cy="1080" rx="760" ry="200" fill="url(#gAmber)" opacity="${f1(brilho * 0.85 * 100) / 100}"/>` + embers(540, 1180, t, 14, 33, 1000);
  return g;
}
// O alto do monte em primeiro plano (as pessoas ficam com os pés em y 1240), com os reinos no vale.
function vistaMonte(t, brilho) {
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>` + sun(880, 420, 50, t);
  s += reinos(t, brilho);
  s += `<path d="M -200 ${H} L -200 1230 C 200 1200 700 1190 1300 1240 L 1300 ${H} Z" fill="#B79A72" ${ink(6)}/>`;
  s += `<path d="M -200 1300 C 300 1270 700 1280 1300 1310" stroke="#9E8160" stroke-width="5" fill="none"/>`;
  return s;
}

// ---------------------------------------------------------------- 16. o monte muito alto e os reinos
function scMonte(t) {
  const a0 = at(16), mostrou = wt(16, 'mostrou');
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>` + sun(860, 300, 54, t);
  const b = E.out(prog(t, mostrou - 0.2, mostrou + 1.0));
  s += reinos(t, b);
  s += `<path d="M -300 ${H} L -300 1320 L 250 700 L 330 760 L 800 1290 L 860 ${H} Z" fill="#B79A72" ${ink(6)}/><path d="M 190 790 L 250 700 L 330 760 L 270 800 Z" fill="#E7D7BC"/>`;
  s += person({ ...JESUS, x: 215, y: 712, s: 0.42, look: 0.6, noShadow: true }) + person({ x: 290, y: 712, s: 0.44, sil: SOMBRA, armR: lerp(14, 110, b), noShadow: true });
  return { svg: cam(s, 540, 960, 1.04 + 0.04 * E.inOut(prog(t, a0, at(17)))), html: '' };
}

// ---------------------------------------------------------------- 17. "Tudo isto lhe darei"
function scOferta(t) {
  const a0 = at(17), darei = wt(17, 'darei');
  let s = vistaMonte(t, 1);
  const cp = E.out(prog(t, darei - 0.3, darei + 0.9));
  [[180, 760], [400, 660], [660, 680], [900, 780]].forEach(([x, y], k) => (s += coroa(x, lerp(1060, y, cp) + Math.sin(t * 2 + k) * 10, 0.8, cp)));
  s += person({ ...JESUS, x: 330, y: 1250, s: 1.2, look: 0.5, mood: 'calm' });
  s += sombra(760, 1250, 1.25, t, { armR: lerp(30, 130, cp), armL: lerp(14, 60, cp), flip: true });
  return { svg: cam(s, 540, 1000, 1.0 + 0.05 * prog(t, a0, at(18))), html: '' };
}

// ---------------------------------------------------------------- 18. todo esse poder, em troca de uma adoração
function scTroca(t) {
  const a0 = at(18), troca = wt(18, 'adoração');
  let s = `<rect width="${W}" height="${H}" fill="#2A211C"/>` + `<circle cx="540" cy="800" r="520" fill="url(#gAmber)" opacity="0.55"/>`;
  s += coroa(540, 780, 3.2, 1) + embers(540, 1100, t, 10, 51, 600);
  const k = E.out(prog(t, troca - 0.4, troca + 0.3));
  s += person({ x: 540, y: 1260, s: 1.1, sil: SOMBRA, armL: lerp(14, 100, k), armR: lerp(14, 100, k), noShadow: true });
  return { svg: cam(s, 540, 960, 1.0 + 0.06 * prog(t, a0, at(19))), html: '' };
}

// ---------------------------------------------------------------- 19. "Retire-se, Satanás!"
function scRetire(t) {
  const a0 = at(19), ret = wt(19, 'retirese'), esc0 = wt(19, 'escrito');
  let s = vistaMonte(t, 0.4);
  const up = E.out(prog(t, ret - 0.3, ret + 0.3));
  s += luzCeu(360, 1250, 0.5 * up, 110);
  s += person({ ...JESUS, x: 360, y: 1250, s: 1.25, look: 0.6, mood: 'calm', armR: lerp(14, 140, up) });
  const sai = E.in(prog(t, esc0 - 0.2, fim(19)));
  s += sombra(lerp(760, 900, sai), 1250, 1.28, t, { op: 1 - sai, flip: true });
  const rp = E.out(prog(t, esc0 - 0.3, esc0 + 0.8));
  s += rolo(360, 640, 0.5, rp, { glow: rp });
  return { svg: cam(s, 540, 960, 1.02 + 0.04 * prog(t, a0, at(20))), html: '' };
}

// ---------------------------------------------------------------- 20. "anjos vieram e o serviram"
function scAnjos(t) {
  const a0 = at(20), vieram = wt(20, 'anjos');
  let s = deserto(t, { sky: 'skySunrise', solX: 540, solY: 560 });
  const ap = E.out(prog(t, vieram - 0.4, vieram + 1.0));
  s += person({ ...JESUS, x: 540, y: 1250, s: 1.25, kneel: true, look: 0, mood: 'closed', armL: 24, armR: 24 });
  s += person({ ...ANJO, x: lerp(-100, 270, ap), y: 1250, s: 1.2, look: 0.6, armR: 60 }) + jar(lerp(-10, 360, ap), 1170, 0.9);
  s += person({ ...ANJO, x: lerp(1180, 810, ap), y: 1250, s: 1.2, look: -0.6, armL: 60, flip: true }) + paes(lerp(1100, 730, ap), 1170, 0.7, 2);
  s += `<circle cx="540" cy="900" r="560" fill="url(#gAmber)" opacity="${f1(0.35 * ap * 100) / 100}"/>`;
  return { svg: cam(s, 540, 1000, 1.0 + 0.05 * prog(t, a0, at(21))), html: '' };
}

// ---------------------------------------------------------------- 21. ele não pulou; e no fim, os anjos vieram
function scCallback(t) {
  const a0 = at(21), corte = wt(21, 'fim') - 0.2;
  const A = (tt) => altoTemplo(tt, { look: 0, sarm: 40, luz: 0.3 });
  const B = (tt) => {
    let s = deserto(tt, { sky: 'skySunrise', solX: 540, solY: 560 });
    s += `<circle cx="540" cy="900" r="560" fill="url(#gAmber)" opacity="0.4"/>`;
    s += person({ ...ANJO, x: 290, y: 1250, s: 1.2, look: 0.6, armR: 60 }) + person({ ...JESUS, x: 540, y: 1250, s: 1.25, look: 0, mood: 'happy' }) + person({ ...ANJO, x: 790, y: 1250, s: 1.2, look: -0.6, armL: 60, flip: true });
    return s;
  };
  return { svg: cam(xcut(t, corte, A, B), 540, 1000, 1.0 + 0.05 * prog(t, a0, at(22))), html: '' };
}

// ---------------------------------------------------------------- 22. lembra do quarenta?
function scLembra(t) {
  const a0 = at(22);
  let s = `<rect width="${W}" height="${H}" fill="${AREIA[1]}"/>`;
  const r = rng(404);
  for (let i = 0; i < 70; i++) s += `<circle cx="${f1(r() * W)}" cy="${f1(r() * H)}" r="${f1(3 + r() * 7)}" fill="${AREIA[3]}" opacity="0.35"/>`;
  const p = pop(t, a0 + 0.1, 0.5);
  s += `<g transform="translate(540 900) scale(${f1(Math.max(0.01, p) * 100) / 100}) translate(-540 -900)">${areia40(540, 980, 1.25, 1)}</g>`;
  return { svg: s, html: '' };
}

// ---------------------------------------------------------------- 23. Deuteronômio
function scDeut(t) {
  const a0 = at(23), livro0 = wt(23, 'deuteronômio');
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const rp = E.out(prog(t, a0 + 0.1, a0 + 0.9));
  s += rolo(540, 860, 1.25, rp, { titulo: 'DEUTERONÔMIO', glow: prog(t, livro0 - 0.3, livro0 + 0.5) });
  [[300, 1180], [540, 1220], [780, 1180]].forEach(([x, y], k) => (s += opg(pop(t, a0 + 0.6 + k * 0.35, 0.4), rolo(x, y, 0.32, 1))));
  return { svg: cam(s, 540, 960, 1.0 + 0.04 * prog(t, a0, at(24))), html: '' };
}

// ---------------------------------------------------------------- 24. Moisés lembra ao povo
function scMoises(t) {
  const a0 = at(24);
  let s = deserto(t, { sky: 'skySunrise', solX: 900, solY: 480 });
  s += tendas(t, 1040, 7, 0.4);
  for (let i = 0; i < 7; i++) s += person({ ...povo(500 + i), x: 360 + i * 105, y: 1170 + (i % 2) * 22, s: 0.62, look: -0.7, mood: 'calm' });
  const fx = fala(t, seg(24), fim(24), 40, 30);
  s += `<line x1="${f1(150 + 10)}" y1="900" x2="${f1(150 + 30)}" y2="1250" stroke="${C.wood}" stroke-width="12" stroke-linecap="round"/>`;
  s += person({ ...MOISES, x: 200, y: 1250, s: 1.2, look: 0.7, mood: 'calm', armR: fx, armL: 30 });
  return { svg: cam(s, 540, 1050, 1.02 + 0.05 * prog(t, a0, at(25))), html: '' };
}

// ---------------------------------------------------------------- 25. quarenta anos de Israel no deserto
function scIsrael(t) {
  const a0 = at(25);
  const ciclo = (prog(t, a0, fim(25)) * 6) % 1;
  let s = deserto(t, { sky: 'skySunrise', solX: lerp(80, 1000, ciclo), solY: 520 - Math.sin(ciclo * Math.PI) * 140, ox: t * 30 });
  for (let i = 0; i < 9; i++) s += person({ ...povo(600 + i), x: 80 + i * 115 + Math.sin(i) * 20, y: 1160 + (i % 3) * 26, s: 0.58 + (i % 3) * 0.05, walk: t * 5 + i, look: 0.6 });
  s += dust(900, 1250, t, a0 + 0.3, 3, AREIA[2]);
  return { svg: cam(s, 540, 1050, 1.04), html: '' };
}

// ---------------------------------------------------------------- 26. quarenta dias de Jesus no deserto
function scJesus40(t) {
  const a0 = at(26), tentado = wt(26, 'tentado');
  let s = deserto(t, { sky: 'skySunrise', solX: 800, solY: 520, ox: t * 12 });
  s += luzCeu(460, 1250, 0.55, 110);
  s += person({ ...JESUS, x: 460, y: 1250, s: 1.25, walk: t * 5, look: 0.4, mood: 'calm' });
  s += sombra(860, 1250, 1.15, t, { op: 0.85 * E.out(prog(t, tentado - 0.4, tentado + 0.4)), flip: true });
  return { svg: cam(s, 540, 1000, 1.0 + 0.05 * prog(t, a0, at(27))), html: '' };
}

// ---------------------------------------------------------------- 27. lá, o povo: fome, prova e o bezerro
function scQueda(t) {
  const a0 = at(27), w1 = wt(27, 'prova'), w2 = wt(27, 'bezerro');
  const F = (tt) => {
    let s = deserto(tt, { sky: 'skySunrise', solX: 860, solY: 470 }) + tendas(tt, 1040, 5, 0.4);
    for (let i = 0; i < 5; i++) s += person({ ...povo(700 + i), x: 160 + i * 190, y: 1225, s: 0.95, mood: i % 2 ? 'angry' : 'sad', look: 0.2 * (i - 2), armR: i % 2 ? 110 + Math.sin(tt * 6 + i) * 10 : 30 }) + jar(225 + i * 190, 1236, 0.55, 95);
    return s;
  };
  const M = (tt) => {
    let s = deserto(tt, { sky: 'skySunrise', solX: 860, solY: 470 }) + rocha(560, 1150, 1.4);
    for (let i = 0; i < 5; i++) s += person({ ...povo(720 + i), x: 140 + i * 200, y: 1235, s: 0.9, mood: 'angry', look: 0, armR: 140 + Math.sin(tt * 7 + i) * 12, armL: 20 });
    return s;
  };
  const B = (tt) => {
    let s = deserto(tt, { sky: 'skyDusk', sol: false }) + bezerro(540, 1080, 1.4);
    for (let i = 0; i < 6; i++) s += person({ ...povo(740 + i), x: 110 + i * 172, y: 1225 + (i % 2) * 16, s: 0.8, kneel: true, mood: 'closed', look: (540 - (110 + i * 172)) / 600, armL: 90, armR: 90 });
    return s;
  };
  const svg = xcut(t, w2 - 0.2, (tt) => xcut(tt, w1 - 0.2, F, M), B);
  return { svg: cam(svg, 540, 1050, 1.02), html: '' };
}

// ---------------------------------------------------------------- 28. as palavras daquele mesmo deserto
function scPalavras(t) {
  const a0 = at(28);
  let s = deserto(t, { sky: 'skySunrise', solX: 820, solY: 500 });
  s += person({ ...JESUS, x: 540, y: 1250, s: 1.3, look: 0, mood: 'calm' });
  [[230, 760], [540, 560], [850, 760]].forEach(([x, y], k) => {
    const p = E.out(prog(t, a0 + 0.4 + k * 0.5, a0 + 1.1 + k * 0.5));
    s += opg(p, rolo(x, y + Math.sin(t * 2 + k) * 8, 0.42, 1, { glow: 0.6 }));
  });
  return { svg: cam(s, 540, 1000, 1.0 + 0.05 * prog(t, a0, at(29))), html: '' };
}

// ---------------------------------------------------------------- 29. onde o povo caiu, Jesus ficou de pé
function scDePe(t) {
  const a0 = at(29), pe = wt(29, 'jesus');
  let s = deserto(t, { sky: 'skyDusk', sol: false });
  for (let i = 0; i < 4; i++) s += person({ x: 90 + i * 120, y: 1245, s: 0.8, sil: '#2E2420', kneel: true, noShadow: true });
  const lp = E.out(prog(t, pe - 0.3, pe + 0.6));
  s += `<circle cx="780" cy="900" r="${f1(520 * lp)}" fill="url(#gAmber)" opacity="0.7"/>` + luzCeu(780, 1260, 0.6 * lp, 120);
  s += person({ ...JESUS, x: 780, y: 1250, s: 1.3, look: 0, mood: 'calm', rim: C.a300 });
  return { svg: cam(s, 600, 1000, 1.0 + 0.06 * prog(t, a0, at(30))), html: '' };
}

// ---------------------------------------------------------------- 30. então, por quê?
function scPorque(t) {
  const a0 = at(30);
  let s = deserto(t, { sky: 'skySunrise', solX: 780, solY: 560 });
  s += luzCeu(400, 1250, 0.6, 110) + pomba(410, 640, 0.6, t);
  s += person({ ...JESUS, x: 400, y: 1250, s: 1.28, look: 0.3, mood: 'calm' });
  s += sombra(820, 1250, 1.2, t, { op: 0.6, flip: true });
  return { svg: cam(s, 540, 1000, 1.08 - 0.06 * prog(t, a0, at(31))), html: '' };
}

// ---------------------------------------------------------------- 31. semelhante a seus irmãos
function scIrmaos(t) {
  const a0 = at(31), irm = wt(31, 'irmãos');
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skyDay)"/>` + clouds(t, 0) + hills(GROUND - 120, 70, 0.003, 81, '#E3DBD2') + floor('day');
  const p = E.out(prog(t, irm - 0.6, irm + 0.6));
  const gente = [povo(801, { x: 140 }), povo(802, { x: 330 }), { ...JESUS, x: 540 }, povo(803, { x: 750 }), povo(804, { x: 940 })];
  gente.forEach((o, k) => (s += person({ ...o, y: 1260, s: 1.0, look: (540 - o.x) / 700, mood: 'calm', op: k === 2 ? 1 : p })));
  return { svg: cam(s, 540, 1050, 1.08 - 0.06 * prog(t, a0, at(32))), html: '' };
}

// ---------------------------------------------------------------- 32. tentado como nós, porém sem pecado
function scSemPecado(t) {
  const a0 = at(32), sem = wt(32, 'sem');
  let s = deserto(t, { sky: 'skyDusk', sol: false });
  const lp = E.out(prog(t, sem - 0.3, sem + 0.5));
  s += luzCeu(540, 1260, 0.25 + 0.5 * lp, 120);
  [[200, 1260], [880, 1260], [140, 1100]].forEach(([x, y], k) => (s += sombra(x, y, 0.9, t + k, { op: 0.6 * (1 - lp), flip: x > 540 })));
  s += person({ ...JESUS, x: 540, y: 1260, s: 1.3, walk: t * 4, look: 0, mood: 'calm', rim: C.a300 });
  return { svg: cam(s, 540, 1000, 1.0 + 0.06 * prog(t, a0, at(33))), html: '' };
}

// ---------------------------------------------------------------- 33. capaz de socorrer
function scSocorrer(t) {
  const a0 = at(33), soc = wt(33, 'socorrer');
  let s = deserto(t, { sky: 'skySunrise', solX: 820, solY: 520 });
  const lev = E.out(prog(t, soc - 0.1, soc + 1.0));
  s += person({ ...JESUS, x: 380, y: 1250, s: 1.28, look: 0.6, mood: 'calm', armR: lerp(30, 80, E.out(prog(t, a0, soc))) });
  s += person({ ...povo(905), x: 690, y: 1250, s: 1.2, kneel: lev < 0.5, look: -0.5, mood: lev > 0.5 ? 'happy' : 'sad', armL: lerp(70, 40, lev) });
  return { svg: cam(s, 540, 1000, 1.02 + 0.05 * prog(t, a0, at(34))), html: '' };
}

// ---------------------------------------------------------------- 34. sem nenhum "se": Jesus, o Filho de Deus
function scSemSe(t) {
  const a0 = at(34), heb = wt(34, 'hebreus');
  let s = deserto(t, { sky: 'skySunrise', solX: 800, solY: 520 });
  const vira = E.out(prog(t, heb - 0.3, heb + 0.6));
  s += sombra(800, 1250, 1.2, t, { op: 1 - vira, flip: true });
  s += luzCeu(460, 1250, 0.3 + 0.6 * vira, 130) + opg(vira, pomba(470, lerp(380, 620, vira), 0.7, t));
  s += person({ ...JESUS, x: 460, y: 1250, s: 1.3, look: 0.2, mood: vira > 0.5 ? 'closed' : 'calm', rim: vira > 0.5 ? C.a300 : null });
  return { svg: cam(s, 520, 1000, 1.0 + 0.06 * prog(t, a0, at(35))), html: '' };
}

// ---------------------------------------------------------------- 35. o seu deserto
function scSeuDeserto(t) {
  const a0 = at(35), seu = wt(35, 'socorrer');
  let s = deserto(t, { sky: 'skyDusk', sol: false });
  s += `<circle cx="300" cy="${GROUND - 40}" r="420" fill="url(#gPeach)" opacity="0.4"/>`;
  const ch = E.inOut(prog(t, a0, seu));
  s += person({ ...JESUS, x: lerp(-60, 400, ch), y: 1250, s: 1.25, walk: ch < 1 ? t * 5 : null, look: 0.6, mood: 'calm', rim: C.p300, armR: lerp(14, 70, E.out(prog(t, seu - 0.2, seu + 0.5))) });
  s += person({ ...povo(930), x: 720, y: 1250, s: 1.2, kneel: true, look: lerp(0, -0.6, ch), mood: ch > 0.8 ? 'calm' : 'sad', armL: 60, armR: 60 });
  return { svg: cam(s, 560, 1000, 1.0 + 0.06 * prog(t, a0, at(36))), html: '' };
}

// ---------------------------------------------------------------- 36. qual parece mais com a sua?
function scPergunta(t) {
  const a0 = at(36);
  const hi = [wt(36, 'pão'), wt(36, 'cobrar'), wt(36, 'trocar')];
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const Y = [520, 820, 1120];
  const ic = [
    (y) => paes(540, y + 50, 1.3, 3) + pedras(540, y + 90, 0.8, 2).replace(/fill="#(A69A8E|B9AEA2)"/g, 'fill="#C9C0B6"'),
    (y) => `<rect x="500" y="${y - 110}" width="80" height="200" fill="#EFE7DB" ${ink(5)}/><rect x="490" y="${y - 126}" width="100" height="20" fill="${C.a300}" ${ink(4)}/>`,
    (y) => coroa(540, y - 10, 1.4),
  ];
  Y.forEach((y, k) => {
    const on = t > hi[k] - 0.2 && (k === 2 || t < hi[k + 1] - 0.2);
    const p = pop(t, a0 + 0.2 + k * 0.3, 0.4);
    if (p <= 0) return;
    s += `<g transform="translate(540 ${y}) scale(${f1(p * 100) / 100}) translate(-540 ${-y})"><rect x="250" y="${y - 135}" width="580" height="270" rx="34" fill="${on ? C.b300 : C.g200}" ${ink(on ? 7 : 5)}/>${ic[k](y)}</g>`;
  });
  return { svg: s, html: '' };
}

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  { a: 0, b: at(1), f: scGancho, ref: 'Mateus 4:1' },
  { a: at(1), b: at(2), f: scBatismo, ref: 'Mateus 3:16-17' },
  { a: at(2), b: at(3), f: scPrimeiras, ref: 'Mateus 4:3' },
  { a: at(3), b: at(4), f: scEco, ref: 'Mateus 4:3' },
  { a: at(4), b: at(5), f: scTres, ref: 'Mateus 4:1-11' },
  { a: at(5), b: at(6), f: scDeserto, ref: null },
  { a: at(6), b: at(7), f: sc40, ref: null },
  { a: at(7), b: at(8), f: scDias, ref: 'Mateus 4:2' },
  { a: at(8), b: at(9), f: scPedras, ref: 'Mateus 4:3' },
  { a: at(9), b: at(10), f: scEscrito1, ref: 'Mateus 4:4' },
  { a: at(10), b: at(11), f: scPalavraPao, ref: null },
  { a: at(11), b: at(12), f: scTemplo, ref: 'Mateus 4:5' },
  { a: at(12), b: at(13), f: scPula, ref: 'Mateus 4:6' },
  { a: at(13), b: at(14), f: scSalmo91, ref: 'Mateus 4:6' },
  { a: at(14), b: at(15), f: scEscrito2, ref: 'Mateus 4:7' },
  { a: at(15), b: at(16), f: scProva, ref: null },
  { a: at(16), b: at(17), f: scMonte, ref: 'Mateus 4:8' },
  { a: at(17), b: at(18), f: scOferta, ref: 'Mateus 4:9' },
  { a: at(18), b: at(19), f: scTroca, ref: null, dark: true },
  { a: at(19), b: at(20), f: scRetire, ref: 'Mateus 4:10' },
  { a: at(20), b: at(21), f: scAnjos, ref: 'Mateus 4:11' },
  { a: at(21), b: at(22), f: scCallback, ref: [[at(21), 'Mateus 4:6'], [wseg(21, 'fim') - 0.2, 'Mateus 4:11']] },
  { a: at(22), b: at(23), f: scLembra, ref: null },
  { a: at(23), b: at(24), f: scDeut, ref: 'Mateus 4:4, 7, 10' },
  { a: at(24), b: at(25), f: scMoises, ref: 'Deuteronômio 8:2' },
  { a: at(25), b: at(26), f: scIsrael, ref: 'Deuteronômio 8:2' },
  { a: at(26), b: at(27), f: scJesus40, ref: 'Mateus 4:1-2' },
  { a: at(27), b: at(28), f: scQueda, ref: [[at(27), 'Êxodo 16:2-3'], [wseg(27, 'prova') - 0.2, 'Êxodo 17:7'], [wseg(27, 'bezerro') - 0.2, 'Êxodo 32:8']] },
  { a: at(28), b: at(29), f: scPalavras, ref: null },
  { a: at(29), b: at(30), f: scDePe, ref: null },
  { a: at(30), b: at(31), f: scPorque, ref: null },
  { a: at(31), b: at(32), f: scIrmaos, ref: 'Hebreus 2:17' },
  { a: at(32), b: at(33), f: scSemPecado, ref: 'Hebreus 4:15' },
  { a: at(33), b: at(34), f: scSocorrer, ref: 'Hebreus 2:18' },
  { a: at(34), b: at(35), f: scSemSe, ref: 'Hebreus 4:14' },
  { a: at(35), b: at(36), f: scSeuDeserto, ref: null },
  { a: at(36), b: DURATION + 1, f: scPergunta, ref: null },
];
