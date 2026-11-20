// O lenço dobrado no túmulo de Jesus (João 19:38-42; 20:1-18, 30-31; 11:38-44). Curto vertical escrito do zero, ~2:10.
// As cenas começam pelo índice da frase em SEGS (at(i)) e os gestos por wordTime(i, 'palavra').
// Notas de produção do roteiro: Jesus ressuscitado não aparece; as faixas ficam sobre o banco, sem forma de corpo;
// a cena de Maria Madalena é no escuro e sem anjos (o vídeo segue João 20); o túmulo de Lázaro é uma gruta com pedra;
// nada na tela chama o lenço de sinal nem o pano de Lázaro de lenço.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];
const wt = (i, w) => wordTime(i, w);

const NOL = '#0E0D0C';
const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const PEDRO = { robe: C.p500, skin: '#C68B59', hair: '#5A3A28', beard: true, cover: null };
const JOAO = { ...man(1002), robe: C.g400, beard: false, hair: '#3A2A20', cover: null, skin: '#C68B59' };
const MADALENA = { ...man(1101), beard: false, robe: C.r400, cover: '#E2D8CF', skin: '#C68B59' };
const JOSE = { robe: '#5B3F7A', skin: '#E0AC69', hair: '#3A2A20', beard: true, cover: C.g100 };
const NICODEMOS = { robe: '#7B6A55', skin: '#C68B59', hair: C.g400, beard: true, cover: C.g300 };
const MARTA = { ...man(1105), beard: false, robe: C.g600, cover: C.g300, skin: '#A86B3C' };
const VIZINHO = { ...man(1108), robe: C.oliveDk, beard: true, cover: null };

const label = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="${o.fam || 'Gasoek One'}" font-weight="${o.w || 400}" font-size="${o.size || 90}" fill="${o.fill || C.inkDeep}" opacity="${f1((o.op ?? 1) * 100) / 100}">${esc(txt)}</text>`;

// ---------------------------------------------------------------- peças do episódio
// As faixas de linho, soltas sobre o banco (sem forma de corpo). Centro em (x, y), y é o tampo do banco.
function faixas(x, y, s = 1, ol = NOL) {
  let g = '';
  [[-150, -22, 300], [-120, -42, 250], [-170, -60, 210]].forEach(([dx, dy, w], i) => (g += `<rect x="${dx}" y="${dy}" width="${w}" height="22" rx="11" fill="${i % 2 ? '#EDE7DD' : '#F6F2EA'}" ${ink(4, ol)}/>`));
  g += `<path d="M 110 -30 C 170 -40 190 -10 150 2 C 120 10 100 0 112 -12" fill="none" stroke="#F6F2EA" stroke-width="18" stroke-linecap="round"/><path d="M 110 -30 C 170 -40 190 -10 150 2 C 120 10 100 0 112 -12" fill="none" stroke="${ol}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${g}</g>`;
}
// O lenço, dobrado (João 20:7).
function lenco(x, y, s = 1, ol = NOL) {
  const g = `<path d="M -70 0 L 70 0 L 58 -42 L -58 -42 Z" fill="#F6F2EA" ${ink(5, ol)}/><line x1="-63" y1="-21" x2="63" y2="-21" stroke="${C.g400}" stroke-width="5"/><path d="M -58 -42 L 58 -42 L 50 -56 L -50 -56 Z" fill="#FFFFFF" ${ink(5, ol)}/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${g}</g>`;
}
// Dentro do túmulo, na vertical: a porta com a luz, o chão, o banco de pedra, as faixas e o lenço à parte.
const BK = { x0: 400, x1: 1070, y: 1000 }, FX = 600, LX = 950, PISO = 1190;
function interior(t, o = {}) {
  let s = `<rect x="-500" y="-500" width="${W + 1000}" height="${H + 1000}" fill="#342D29"/>`;
  [[260, 360, 240], [820, 300, 260], [600, 560, 180], [900, 700, 150]].forEach(([x, y, w]) => (s += `<path d="M ${x - w} ${y} C ${x - w / 2} ${y - 50} ${x + w / 2} ${y - 40} ${x + w} ${y + 10}" stroke="#1A1614" stroke-width="8" fill="none" stroke-linecap="round"/>`));
  s += `<path d="M 50 ${PISO} L 50 780 C 50 580 320 580 320 780 L 320 ${PISO} Z" fill="#FFE7CF" ${ink(7, NOL)}/>` + rect(55, PISO - 120, 260, 120, '#E9DCCB');
  s += `<circle cx="185" cy="880" r="640" fill="url(#gPeach)" opacity="0.42"/>`;
  s += rect(-500, PISO, W + 1000, 1200, '#28221F') + `<line x1="-500" y1="${PISO}" x2="${W + 500}" y2="${PISO}" stroke="${NOL}" stroke-width="6"/>`;
  s += `<path d="M 50 ${PISO} L 320 ${PISO} L 900 ${H + 40} L -260 ${H + 40} Z" fill="#FFE7CF" opacity="0.12"/>`;
  s += `<ellipse cx="760" cy="${BK.y}" rx="520" ry="230" fill="url(#gPeach)" opacity="0.28"/>`;
  s += rect(BK.x0 + 20, BK.y, BK.x1 - BK.x0 - 40, PISO - BK.y, '#3A3431', ink(6, NOL)) + rect(BK.x0, BK.y - 20, BK.x1 - BK.x0, 30, '#4C4542', `rx="10" ${ink(6, NOL)}`);
  if (o.litF) s += `<circle cx="${FX}" cy="${BK.y - 50}" r="${f1(210 + 16 * Math.sin(t * 3))}" fill="url(#gWhite)" opacity="${f1(o.litF * 0.32 * 100) / 100}"/>`;
  if (o.lit) s += `<circle cx="${LX}" cy="${BK.y - 48}" r="${f1(170 + 16 * Math.sin(t * 3))}" fill="url(#gWhite)" opacity="${f1(o.lit * 0.4 * 100) / 100}"/>`;
  if (o.faixas !== false) s += faixas(FX, BK.y - 20, 1);
  if (o.lenco !== false) s += lenco(LX, BK.y - 20, 1);
  return s;
}
// Fora do túmulo de Jesus: de madrugada (o.noite) ou ao amanhecer. A pedra já está removida (João 20:1).
function fora(t, o = {}) {
  const n = !!o.noite, x = o.x ?? 610;
  let s = n ? `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skyNight)"/>` + stars(t, 60, 31, GROUND - 120, 0.8)
    : `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>` + sun(230, 600, 56, t);
  s += hills(GROUND - 140, 80, 0.003, 21, n ? '#23262A' : '#D9C7B4') + hills(GROUND - 60, 50, 0.005, 23, n ? '#1C1F22' : '#C9B5A1');
  s += `<rect x="-600" y="${GROUND}" width="${W + 1200}" height="${H}" fill="${n ? '#1A1816' : '#CDBBA6'}"/>`;
  s += olive(150, GROUND + 150, 1.2, n ? '#33392F' : C.olive, n ? '#2A2F27' : C.oliveDk, n ? NOL : C.ink);
  s += sepulcro(x, 1210, o.s ?? 1.3, { tom: n ? 'escuro' : 'amanhecer', rola: 1, luz: o.luz || 0, id: 'spJ' });
  return s;
}
// O túmulo de Lázaro: "uma gruta com uma pedra colocada à entrada" (João 11:38). o.rola tira a pedra.
function gruta(t, o = {}) {
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skyDay)"/>` + clouds(t);
  s += hills(GROUND - 140, 80, 0.003, 41, '#E3DBD2') + hills(GROUND - 60, 50, 0.005, 43, '#D6CBC0');
  s += `<rect x="-600" y="${GROUND}" width="${W + 1200}" height="${H}" fill="#D9CFC2"/>`;
  s += olive(930, GROUND + 130, 1.1);
  s += sepulcro(o.x ?? 640, 1200, o.s ?? 1.25, { tom: 'dia', rola: o.rola ?? 0, id: 'spL' });
  return s;
}
// Lázaro como saiu: mãos e pés envolvidos em faixas e o rosto envolto num pano (João 11:44). o.solto (0..1) afrouxa as faixas.
function enfaixado(x, y, s = 1, o = {}) {
  const k = o.solto || 0, sw = Math.sin((o.t || 0) * 2.2) * 1.5;
  let g = `<ellipse cx="0" cy="2" rx="52" ry="11" fill="#000" opacity="0.13"/>`;
  g += `<path d="M -40 0 L -50 -196 C -50 -236 50 -236 50 -196 L 40 0 Z" fill="#F4F1EC" ${ink(5)}/>`;
  for (let yy = -26; yy > -200; yy -= 30) g += `<line x1="-46" y1="${yy}" x2="46" y2="${yy - 14}" stroke="${C.g400}" stroke-width="4" opacity="${f1((1 - k * 0.7) * 100) / 100}"/>`;
  g += `<circle cx="0" cy="-262" r="40" fill="#EDE7DD" ${ink(5)}/><path d="M -38 -272 C -14 -258 14 -258 38 -272 M -36 -250 C -12 -238 12 -238 36 -250" stroke="${C.g400}" stroke-width="4" fill="none"/>`;
  if (k > 0) [[-58, -150, -30], [60, -110, 24], [-52, -60, -18]].forEach(([dx, dy, rot], i) => (g += `<rect x="${f1(dx - 40 + (dx < 0 ? -1 : 1) * 30 * k)}" y="${f1(dy + 90 * k * (0.6 + i * 0.2))}" width="80" height="16" rx="8" fill="#F6F2EA" ${ink(3)} opacity="${f1(k * 100) / 100}" transform="rotate(${f1(rot * k)} ${dx} ${dy})"/>`));
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(sw)}) scale(${s})">${g}</g>`;
}
// Corpo envolto em faixas, só de longe (João 19:40).
function corpoLinho(x, y, s) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"><rect x="-150" y="-40" width="300" height="46" rx="23" fill="#F4F1EC" ${ink(5)}/>${[-90, -40, 10, 60, 105].map((dx) => `<line x1="${dx}" y1="-37" x2="${dx + 10}" y2="3" stroke="${C.g400}" stroke-width="4"/>`).join('')}</g>`;
}
// Cartão de capítulo: número, título e um desenho (a cena inteira é o cartão).
function cartao(t, a0, n, titulo, desenho, sub) {
  const p = pop(t, a0 + 0.1, 0.4), p2 = pop(t, a0 + 0.45, 0.4);
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  s += `<g transform="translate(540 520) scale(${f1(p * 100) / 100})"><circle r="92" fill="${C.b500}" ${ink(7)}/>${label(0, 34, String(n), { size: 100, fill: '#FFFFFF' })}</g>`;
  s += opg(clamp(p2), label(540, 760, titulo, { size: 104 }) + (sub ? label(540, 840, sub, { fam: 'Geist', w: 600, size: 44, fill: C.muted }) : ''));
  s += `<g transform="translate(540 1060) scale(${f1(clamp(p2) * 100) / 100})">${desenho}</g>`;
  return s;
}

// ---------------------------------------------------------------- 0. um pano dobrado (o texto do gancho fica no terço de cima até 3 s)
function scGancho(t) {
  const s = interior(t, { lit: 0.7 + 0.3 * prog(t, 0, 2) });
  const z = 1.75 + 0.2 * E.sine(prog(t, 0, at(1)));
  return { svg: cam(s, LX, BK.y - 30, z, 540 - LX, 110), html: '' };
}
// ---------------------------------------------------------------- 1. podia ter escrito só que o corpo não estava lá
function scPodia(t) {
  const a0 = at(1), d = wt(1, 'descreveu');
  const s = fora(t, { luz: 0.25 + 0.35 * prog(t, d - 0.3, d + 1) });
  return { svg: cam(s, 610, 1060, 1.0 + 0.16 * E.inOut(prog(t, a0, at(2)))), html: '' };
}
// ---------------------------------------------------------------- 2. por quê? três detalhes
function scPorque(t) {
  const tr = wt(2, 'três');
  let s = interior(t, { lit: 0.5, litF: 0.3 });
  [0, 1, 2].forEach((k) => {
    const p = pop(t, tr - 0.1 + k * 0.28, 0.35);
    if (p > 0) s += `<g transform="translate(${330 + k * 210} 560) scale(${f1(p * 100) / 100})"><circle r="74" fill="${C.b500}" ${ink(6, NOL)}/>${label(0, 28, String(k + 1), { size: 84, fill: '#FFFFFF' })}</g>`;
  });
  return { svg: cam(s, 600, 1000, 1.02 + 0.05 * prog(t, at(2), at(3))), html: '' };
}
// ---------------------------------------------------------------- 3. nove capítulos antes, em outro túmulo
function scOutro(t) {
  const s = gruta(t, { rola: 0 });
  return { svg: cam(s, 640, 1060, 1.0 + 0.14 * E.inOut(prog(t, at(3), at(4)))), html: '' };
}
// ---------------------------------------------------------------- 4. o primeiro detalhe: as faixas ficaram
function scT1(t) {
  return { svg: cartao(t, at(4), 1, 'AS FAIXAS', faixas(0, 60, 1.7, C.ink)), html: '' };
}
// ---------------------------------------------------------------- 5. José e Nicodemos envolvem o corpo em faixas
function scEnvolvem(t) {
  let s = bgDusk(t) + `<rect x="-600" y="${GROUND}" width="${W + 1200}" height="${H}" fill="#3A2C25"/>`;
  s += corpoLinho(540, 1230, 0.95);
  const tend = Math.sin(t * 2.4) * 10;
  s += person({ ...JOSE, x: 300, y: 1236, s: 1.0, kneel: true, look: 1, mood: 'sad', armL: 20, armR: 60 + tend, rim: C.p400 });
  s += person({ ...NICODEMOS, x: 790, y: 1236, s: 1.0, kneel: true, look: -1, mood: 'sad', armL: 60 - tend, armR: 20, rim: C.p400 });
  return { svg: cam(s, 540, 1100, 1.0 + 0.07 * prog(t, at(5), at(6))), html: '' };
}
// ---------------------------------------------------------------- 6. trinta e quatro quilos de mirra e aloés
function scMirra(t) {
  const a0 = at(6), w = E.out(prog(t, a0, wt(6, 'cerca')));
  let s = bgDusk(t) + `<rect x="-600" y="${GROUND}" width="${W + 1200}" height="${H}" fill="#3A2C25"/>`;
  const n = { ...NICODEMOS, x: lerp(-140, 420, w), y: 1250, s: 1.3, look: 1, mood: 'calm', walk: w < 0.98 ? t * 5 : null, armL: 10, armR: 10, rim: C.p400 };
  [0, 1, 2, 3].forEach((k) => { const p = pop(t, wt(6, 'trinta') - 0.1 + k * 0.22, 0.35); if (p > 0) s += `<g transform="translate(${660 + k * 96} ${1250 - (k % 2) * 8}) scale(${f1(p * 100) / 100})">${jar(0, -40, 1.25, 0)}</g>`; });
  s += person(n);
  [-1, 1].forEach((sd) => { const [hx, hy] = mao(n, sd); s += jar(hx, hy + 76, 1.15, Math.sin(t * 5 + sd) * 3 * (w < 0.98 ? 1 : 0)); });
  return { svg: cam(s, 560, 1100, 1.03 + 0.04 * prog(t, a0, at(7))), html: '' };
}
// ---------------------------------------------------------------- 7. domingo, ainda escuro: Maria Madalena vê a pedra removida e corre
function scMadalena(t) {
  const a0 = at(7), tv = wt(7, 'viu'), tc = wt(7, 'correu');
  const w = E.out(prog(t, a0, tv)), r = E.in(prog(t, tc - 0.2, tc + 1.4));
  let s = fora(t, { noite: true });
  const x = lerp(lerp(-140, 300, w), -220, r), running = r > 0 && r < 1;
  s += person({ ...MADALENA, x, y: 1250, s: 1.3, look: r > 0 ? -1 : 1, flip: r > 0, mood: t > tv - 0.1 ? 'fear' : 'sad', t, walk: w < 1 ? t * 5 : running ? t * 11 : null, lean: running ? -7 : 0, armL: t > tv && r <= 0 ? 60 : 24, armR: 24, rim: '#6B7A99' });
  return { svg: cam(s, 560, 1080, 1.02 + 0.06 * prog(t, a0, at(8))), html: '' };
}
// ---------------------------------------------------------------- 8. os dois correm; o outro chega primeiro, se curva e vê as faixas
function scCorrida(t) {
  const a0 = at(8), tp = wt(8, 'primeiro'), tc = wt(8, 'curvou');
  const j = E.out(prog(t, a0, tp)), p = E.out(prog(t, a0 + 0.5, tc + 1.2)), cur = E.inOut(prog(t, tc - 0.2, tc + 0.7));
  let s = fora(t, { luz: 0.35 });
  s += person({ ...PEDRO, x: lerp(-320, 120, p), y: 1262, s: 1.3, look: 1, mood: 'fear', t, walk: p < 1 ? t * 10 : null, lean: p < 1 ? 7 : 0, armL: 30, armR: 30 });
  s += person({ ...JOAO, x: lerp(-140, 390, j), y: 1250, s: 1.25, look: 1, mood: 'fear', t, walk: j < 1 ? t * 11 : null, lean: j < 1 ? 7 : 16 * cur, armL: 20, armR: 20 + 26 * cur });
  return { svg: cam(s, 560, 1080, 1.04 + 0.08 * cur), html: '' };
}
// ---------------------------------------------------------------- 9. o corpo não estava; as faixas, sim
function scFaixasSim(t) {
  const ts = wt(9, 'faixas');
  const s = interior(t, { litF: prog(t, ts - 0.3, ts + 0.4), lenco: false });
  const z = 1.25 + 0.3 * E.inOut(prog(t, ts - 0.5, ts + 0.6));
  return { svg: cam(s, lerp(740, FX, prog(t, ts - 0.5, ts + 0.6)), BK.y - 40, z, 540 - lerp(740, FX, prog(t, ts - 0.5, ts + 0.6)), 60), html: '' };
}
// ---------------------------------------------------------------- 10. o segundo detalhe: o lenço
function scT2(t) {
  return { svg: cartao(t, at(10), 2, 'O LENÇO', lenco(0, 60, 2.4, C.ink)), html: '' };
}
// ---------------------------------------------------------------- 11. Pedro entrou e viu também o lenço
function scPedroEntra(t) {
  const a0 = at(11), te = wt(11, 'entrou'), tl = wt(11, 'lenço');
  const w = E.out(prog(t, a0, te + 0.5));
  let s = interior(t, { lit: prog(t, tl - 0.3, tl + 0.5) * 0.8 });
  s += person({ ...PEDRO, x: lerp(185, 330, w), y: lerp(PISO, 1262, w), s: lerp(1.0, 1.3, w), look: 1, mood: 'fear', t, walk: w < 1 ? t * 5 : null, armR: t > tl ? 50 : 18, rim: C.p300 });
  return { svg: cam(s, 600, 1040, 1.0 + 0.06 * prog(t, a0, at(12))), html: '' };
}
// ---------------------------------------------------------------- 12. "Ele estava dobrado à parte, separado das faixas de linho"
function scLencoClose(t) {
  const a0 = at(12), td = wt(12, 'dobrado');
  const s = interior(t, { lit: 0.5 + 0.5 * prog(t, td - 0.3, td + 0.3) });
  const z = lerp(1.5, 2.1, E.inOut(prog(t, a0, td + 0.4)));
  return { svg: cam(s, LX, BK.y - 30, z, 540 - LX, 60), html: '' };
}
// ---------------------------------------------------------------- 13. não estava junto com as faixas: das faixas até o lenço
function scAparte(t) {
  const a0 = at(13), te = wt(13, 'dobrado');
  const pan = E.inOut(prog(t, a0 + 0.3, te + 0.2));
  const s = interior(t, { litF: 1 - pan, lit: pan });
  const cx = lerp(FX, LX, pan);
  return { svg: cam(s, cx, BK.y - 30, 1.7, 540 - cx, 60), html: '' };
}
// ---------------------------------------------------------------- 14. o terceiro detalhe: capítulo onze, o túmulo de Lázaro
function scT3(t) {
  return { svg: cartao(t, at(14), 3, 'LÁZARO', enfaixado(0, 170, 0.95, { t }), 'João 11'), html: '' };
}
// ---------------------------------------------------------------- 15. "O morto saiu", com as faixas e o rosto envolto num pano
function scSaiu(t) {
  const a0 = at(15), ts = wt(15, 'saiu');
  const w = E.out(prog(t, ts - 0.3, ts + 1.6));
  let s = gruta(t, { rola: 1 });
  s += opg(clamp(w * 3), enfaixado(lerp(630, 560, w), lerp(1196, 1262, w), lerp(0.78, 1.15, w), { t }));
  s += person({ ...JESUS, x: 170, y: 1262, s: 1.3, look: 1, mood: 'calm', armR: fala(t, a0, ts, 70, 30) });
  return { svg: cam(s, 520, 1080, 1.03 + 0.07 * prog(t, a0, at(16))), html: '' };
}
// ---------------------------------------------------------------- 16. "Tirem as faixas dele e deixem-no ir"
function scTirem(t) {
  const a0 = at(16), tt = wt(16, 'tirem');
  const w = E.out(prog(t, tt, tt + 1.4));
  let s = gruta(t, { rola: 1 });
  s += enfaixado(560, 1262, 1.15, { t });
  s += person({ ...JESUS, x: 170, y: 1262, s: 1.3, look: 1, mood: 'calm', armR: fala(t, tt - 0.2, fim(16), 60, 36) });
  s += person({ ...MARTA, x: lerp(1240, 800, w), y: 1256, s: 1.2, look: -1, flip: true, mood: 'happy', t, walk: w < 1 ? t * 6 : null, armL: 40 });
  return { svg: cam(s, 520, 1080, 1.08), html: '' };
}
// ---------------------------------------------------------------- 17. saiu ainda enrolado; Jesus mandou tirar as faixas dele
function scEnrolado(t) {
  const a0 = at(17), tm = wt(17, 'mandou');
  const k = prog(t, tm, fim(17) + 0.3);
  let s = gruta(t, { rola: 1, x: 800, s: 1.0 });
  s += person({ ...VIZINHO, x: 330, y: 1262, s: 1.25, look: 1, mood: 'happy', armR: 56 + 14 * Math.sin(t * 6) * (k > 0 ? 1 : 0) });
  s += enfaixado(540, 1262, 1.25, { t, solto: k });
  s += person({ ...MARTA, x: 750, y: 1262, s: 1.2, look: -1, flip: true, mood: 'happy', armL: 56 + 14 * Math.sin(t * 6 + 1) * (k > 0 ? 1 : 0) });
  return { svg: cam(s, 540, 1080, 1.1 + 0.08 * prog(t, a0, at(18))), html: '' };
}
// ---------------------------------------------------------------- 18. no túmulo de Jesus, as faixas ficaram lá, e o lenço à parte
function scDoisTumulos(t) {
  const a0 = at(18), tf = wt(18, 'faixas'), tl = wt(18, 'lenço');
  const p1 = pop(t, a0 + 0.1, 0.4), p2 = pop(t, a0 + 0.35, 0.4);
  let s = `<rect width="${W}" height="${H}" fill="#221D1A"/>`;
  const painel = (y, inner, vb, p) => (p <= 0 ? '' : `<g transform="translate(540 ${y + 235}) scale(${f1(p * 100) / 100}) translate(-540 ${-(y + 235)})"><rect x="84" y="${y - 6}" width="912" height="482" rx="36" fill="${NOL}"/><svg x="90" y="${y}" width="900" height="470" viewBox="${vb}" preserveAspectRatio="xMidYMid slice">${inner}</svg><rect x="90" y="${y}" width="900" height="470" rx="30" fill="none" stroke="${NOL}" stroke-width="8"/></g>`);
  s += painel(230, gruta(t, { rola: 1 }) + enfaixado(430, 1262, 1.15, { t }), '150 800 900 470', p1);
  s += painel(750, interior(t, { litF: prog(t, tf - 0.2, tf + 0.4) * (1 - prog(t, tl - 0.3, tl)), lit: prog(t, tl - 0.3, tl + 0.4) }), '330 760 760 397', p2);
  return { svg: s, html: '' };
}
// ---------------------------------------------------------------- 19. então, por que João contou tudo isso?
function scPorQue(t) {
  const a0 = at(19);
  const s = fora(t, { luz: 0.3 + 0.4 * prog(t, a0, at(20)) });
  return { svg: cam(s, 600, 1090, 1.15 + 0.3 * E.inOut(prog(t, a0, at(20)))), html: '' };
}
// ---------------------------------------------------------------- 20. o outro discípulo entrou depois de Pedro: "Ele viu e creu"
function scCreu(t) {
  const a0 = at(20), te = wt(20, 'entrou'), tc = wt(20, 'creu');
  const w = E.out(prog(t, te - 0.5, te + 0.9)), c = E.out(prog(t, tc - 0.2, tc + 0.6));
  let s = interior(t, { lit: 0.6, litF: 0.4 });
  s += person({ ...PEDRO, x: 230, y: 1262, s: 1.3, look: 1, mood: 'fear', t, rim: C.p300 });
  if (w > 0) {
    const x = lerp(185, 520, w), y = lerp(PISO, 1262, w);
    s += `<circle cx="${f1(x)}" cy="${f1(y - 250)}" r="${f1(240 + 110 * c)}" fill="url(#gAmber)" opacity="${f1(c * 0.55 * 100) / 100}"/>`;
    s += person({ ...JOAO, x, y, s: lerp(1.0, 1.25, w), look: 1, mood: c > 0.3 ? 'happy' : 'fear', t, walk: w < 1 ? t * 5 : null, rim: C.p300, op: clamp(w * 3) });
  }
  return { svg: cam(s, 600, 1060, 1.0 + 0.12 * E.inOut(prog(t, tc - 0.6, at(21)))), html: '' };
}
// ---------------------------------------------------------------- 21. eles ainda não haviam compreendido a Escritura
function scNaoCompreendido(t) {
  const a0 = at(21);
  const w = E.inOut(prog(t, a0 + 0.6, at(22) + 0.4));
  let s = fora(t, { luz: 0.3 });
  s += person({ ...JOAO, x: lerp(330, 760, w), y: 1250, s: 1.25, look: Math.sin(t * 1.2) > 0 ? -1 : 1, mood: 'calm', walk: w > 0 && w < 1 ? t * 4 : null });
  s += person({ ...PEDRO, x: lerp(120, 520, w), y: 1262, s: 1.3, look: 1, mood: 'sad', walk: w > 0 && w < 1 ? t * 4 + 1 : null, armR: 40 + 16 * Math.sin(t * 2), armL: 30 });
  return { svg: cam(s, 560, 1080, 1.02 + 0.05 * prog(t, a0, at(22))), html: '' };
}
// ---------------------------------------------------------------- 22. o discípulo entrou, viu, e creu
function scViuCreu(t) {
  const a0 = at(22), tc = wt(22, 'creu');
  const c = E.out(prog(t, tc - 0.2, tc + 0.5));
  let s = interior(t, { lit: 0.8, litF: 0.5 });
  s += `<circle cx="330" cy="960" r="${f1(260 + 120 * c)}" fill="url(#gAmber)" opacity="${f1((0.2 + 0.4 * c) * 100) / 100}"/>`;
  s += person({ ...JOAO, x: 330, y: 1262, s: 1.4, look: 1, mood: c > 0.2 ? 'happy' : 'calm', t, rim: C.p300 });
  return { svg: cam(s, 600, 1040, 1.12 + 0.1 * prog(t, a0, at(23))), html: '' };
}
// ---------------------------------------------------------------- 23. Maria Madalena ficou ali, chorando; viu Jesus; vai aos discípulos (Jesus não aparece)
function scMaria(t) {
  const a0 = at(23), tv = wt(23, 'viu'), tg = wt(23, 'vai');
  const v = E.out(prog(t, tv - 0.2, tv + 0.6)), g = E.in(prog(t, tg - 0.1, tg + 1.6));
  let s = fora(t, { luz: 0.3 });
  if (v > 0) s += `<circle cx="1080" cy="1000" r="${f1(420 + 120 * v)}" fill="url(#gAmber)" opacity="${f1(v * 0.6 * (1 - g * 0.5) * 100) / 100}"/>`;
  const x = lerp(330, -220, g), feliz = v > 0.3;
  s += person({ ...MADALENA, x, y: 1250, s: 1.35, look: g > 0 ? -1 : feliz ? 1 : 0.6, flip: g > 0, mood: feliz ? 'happy' : 'sad', t, walk: g > 0 && g < 1 ? t * 10 : null, lean: g > 0 ? -7 : feliz ? 0 : 4 + 2 * Math.sin(t * 2), armL: feliz ? 50 : -16 + 4 * Math.sin(t * 3), armR: feliz ? 50 : -16 + 4 * Math.sin(t * 3 + 1), rim: feliz ? C.a300 : null });
  if (!feliz) s += lagrimas(x, 1250, 1.35, t);
  return { svg: cam(s, 540, 1080, 1.1 + 0.06 * prog(t, a0, at(24))), html: '' };
}
// ---------------------------------------------------------------- 24. foram escritos "para que vocês creiam..." (João 20:30-31)
function scEscritos(t) {
  const a0 = at(24), tp = wt(24, 'creiam');
  const p = pop(t, a0 + 0.1, 0.45), l = prog(t, tp - 0.4, tp + 0.6);
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  s += `<circle cx="540" cy="900" r="${f1(430 + 60 * l)}" fill="url(#gAmber)" opacity="${f1((0.25 + 0.4 * l) * 100) / 100}"/>`;
  s += `<g transform="translate(540 960) scale(${f1(p * 100) / 100}) translate(-540 -960)">${livro(540, 1000, 3.2, t, 0)}</g>`;
  return { svg: cam(s, 540, 940, 1.0 + 0.05 * prog(t, a0, at(25))), html: '' };
}
// ---------------------------------------------------------------- 25. qual desses detalhes você nunca tinha reparado?
function scQual(t) {
  const a0 = at(25);
  const hi = [wt(25, 'faixas'), wt(25, 'lenço'), wt(25, 'lázaro')];
  let s = `<rect width="${W}" height="${H}" fill="${C.paper}"/>`;
  const Y = [400, 670, 940];
  const ic = [() => faixas(540, 30, 1.2, C.ink), () => lenco(540, 40, 1.9, C.ink), () => enfaixado(540, 98, 0.62, { t })];
  Y.forEach((y, k) => {
    const on = t > hi[k] - 0.2 && (k === 2 || t < hi[k + 1] - 0.2);
    const p = pop(t, a0 + 0.2 + k * 0.3, 0.4);
    if (p <= 0) return;
    s += `<g transform="translate(540 ${y}) scale(${f1(p * 100) / 100}) translate(-540 ${-y})"><rect x="250" y="${y - 118}" width="580" height="236" rx="34" fill="${on ? C.b300 : C.g200}" ${ink(on ? 7 : 5)}/><g transform="translate(0 ${y})">${ic[k]()}</g></g>`;
  });
  return { svg: s, html: '' };
}

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  { a: 0, b: at(1), f: scGancho, ref: null, dark: true },
  { a: at(1), b: at(2), f: scPodia, ref: null },
  { a: at(2), b: at(3), f: scPorque, ref: null, dark: true },
  { a: at(3), b: at(4), f: scOutro, ref: 'João 11' },
  { a: at(4), b: at(5), f: scT1, ref: null },
  { a: at(5), b: at(6), f: scEnvolvem, ref: 'João 19:40', dark: true },
  { a: at(6), b: at(7), f: scMirra, ref: 'João 19:39', dark: true },
  { a: at(7), b: at(8), f: scMadalena, ref: 'João 20:1-2', dark: true },
  { a: at(8), b: at(9), f: scCorrida, ref: 'João 20:3-5' },
  { a: at(9), b: at(10), f: scFaixasSim, ref: null, dark: true },
  { a: at(10), b: at(11), f: scT2, ref: null },
  { a: at(11), b: at(12), f: scPedroEntra, ref: 'João 20:6-7', dark: true },
  { a: at(12), b: at(13), f: scLencoClose, ref: 'João 20:7', dark: true },
  { a: at(13), b: at(14), f: scAparte, ref: null, dark: true },
  { a: at(14), b: at(15), f: scT3, ref: null },
  { a: at(15), b: at(16), f: scSaiu, ref: 'João 11:44' },
  { a: at(16), b: at(17), f: scTirem, ref: 'João 11:44' },
  { a: at(17), b: at(18), f: scEnrolado, ref: null },
  { a: at(18), b: at(19), f: scDoisTumulos, ref: null, dark: true },
  { a: at(19), b: at(20), f: scPorQue, ref: null },
  { a: at(20), b: at(21), f: scCreu, ref: 'João 20:8', dark: true },
  { a: at(21), b: at(22), f: scNaoCompreendido, ref: 'João 20:9' },
  { a: at(22), b: at(23), f: scViuCreu, ref: null, dark: true },
  { a: at(23), b: at(24), f: scMaria, ref: 'João 20:11-18' },
  { a: at(24), b: at(25), f: scEscritos, ref: 'João 20:30-31' },
  { a: at(25), b: DURATION + 1, f: scQual, ref: null },
];
