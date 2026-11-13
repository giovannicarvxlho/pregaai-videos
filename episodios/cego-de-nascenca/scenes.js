// O cego de nascença (João 9:1-7).
// Abertura com texto grande no 1º quadro (legível sem som) + loop que fecha no final.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];

const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const CEGO = { robe: C.g500, skin: '#C68B59', hair: '#3A2A20', beard: true };
const DISC1 = { robe: C.g400, skin: '#A86B3C', hair: '#292726', beard: true };
const DISC2 = { robe: C.p500, skin: '#E0AC69', hair: '#5A3A28', beard: true };

// Manchas de barro sobre os olhos do personagem em (px, py) com escala ps.
function mudOnEyes(px, py, ps, op = 1, kneel = false) {
  if (op <= 0) return '';
  const dy = kneel ? 40 : 0;
  return `<g transform="translate(${f1(px)} ${f1(py)}) scale(${ps})" opacity="${f1(clamp(op) * 100) / 100}">
    <g transform="translate(0 ${dy})">
      <ellipse cx="-13" cy="-209" rx="13" ry="8" fill="${C.wood}" stroke="${C.ink}" stroke-width="3.5"/>
      <ellipse cx="13" cy="-209" rx="13" ry="8" fill="${C.wood}" stroke="${C.ink}" stroke-width="3.5"/>
      <circle cx="-18" cy="-200" r="3.5" fill="#523724"/>
      <circle cx="17" cy="-199" r="3" fill="#523724"/>
    </g>
  </g>`;
}

// Tanque de Siloé em pedra com água azul e ondulações.
function siloePool(x, y, s, t) {
  const w1 = Math.sin(t * 3) * 8;
  const w2 = Math.cos(t * 2.4) * 10;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">
    <ellipse cx="0" cy="24" rx="260" ry="76" fill="${C.g500}" ${ink(6)}/>
    <ellipse cx="0" cy="10" rx="250" ry="70" fill="${C.g400}" ${ink(6)}/>
    <ellipse cx="0" cy="12" rx="210" ry="52" fill="url(#gWater)" ${ink(5)}/>
    <ellipse cx="${f1(w1)}" cy="8" rx="130" ry="26" fill="none" stroke="${C.b300}" stroke-width="4" opacity="0.65"/>
    <ellipse cx="${f1(w2)}" cy="16" rx="70" ry="14" fill="none" stroke="#fff" stroke-width="3" opacity="0.5"/>
  </g>`;
}

// ---------------------------------------------------------------- 1. gancho (loop aberto + texto mudo)
function scGancho(t) {
  let s = bgGloom(t, { seed: 901 });
  s += `<circle cx="540" cy="960" r="380" fill="url(#gWhite)" opacity="0.55"/>`;
  s += city(540, 1020, 0.72, t);
  const mudOp = prog(t, 1.4, 2.2);
  // Cego sentado no chão com barro nos olhos
  s += person({ ...CEGO, x: 640, y: 1210, s: 1.25, kneel: true, mood: 'closed', look: -0.4, armL: 24, armR: 35 });
  s += mudOnEyes(640, 1210, 1.25, Math.max(0.95, mudOp), true);
  // Jesus diante dele estendendo a mão
  const reach = E.out(prog(t, 0.2, 1.5));
  s += person({ ...JESUS, x: 370, y: 1210, s: 1.28, look: 0.7, armR: lerp(30, 82, reach), armL: 16, mood: 'calm' });

  // Texto grande já no quadro 1 (legível sem som), sai ao fim da frase 3
  const out = prog(t, fim(3) + 0.1, fim(3) + 0.5);
  const html = `<div style="position:absolute;left:0;right:0;top:290px;display:flex;flex-direction:column;align-items:center;opacity:${f1((1 - out) * 100) / 100}">
    <div style="font:400 76px/1 'Gasoek One';color:#181614;text-shadow:0 6px 0 #fff;white-space:nowrap">ELE NÃO FOI</div>
    <div style="margin-top:18px;padding:6px 36px 20px;background:#2383E2;border:7px solid #181614;border-radius:30px;box-shadow:0 12px 0 0 #181614;font:400 94px/1 'Gasoek One';color:#fff;white-space:nowrap;transform:rotate(-3deg)">CURADO NA HORA</div>
  </div>`;
  const z = 1.0 + 0.08 * E.sine(prog(t, 0, at(5)));
  return { svg: cam(s, 540, 1040, z), html };
}

// ---------------------------------------------------------------- 2. os discípulos perguntam
function scDiscipulos(t) {
  const a0 = at(5);
  let s = bgDay(t, { seed: 912, sunX: 840, sunY: 430 });
  s += city(260, 1020, 0.65, t);
  // Cego sentado à esquerda
  s += person({ ...CEGO, x: 250, y: 1220, s: 1.18, kneel: true, mood: 'closed', look: 0.3, armL: 20, armR: 25 });
  // Jesus no centro, olha para os discípulos quando responde
  const resp = E.out(prog(t, seg(8), seg(8) + 0.5));
  s += person({ ...JESUS, x: 520, y: 1220, s: 1.25, look: lerp(-0.6, 0.8, resp), armR: lerp(18, 68, resp), mood: 'calm' });
  // Discípulos à direita perguntando
  const ask = E.out(prog(t, seg(6), seg(7) + 0.4)) * (1 - prog(t, seg(8), seg(8) + 0.5));
  s += person({ ...DISC1, x: 770, y: 1215, s: 1.18, look: -0.9, armL: lerp(18, 86, ask), mood: 'calm' });
  s += person({ ...DISC2, x: 920, y: 1225, s: 1.14, look: -1, armL: lerp(14, 58, ask), mood: 'calm' });
  return { svg: cam(s, 540, 1040, 1.0 + 0.05 * prog(t, a0, at(10))), html: '' };
}

// ---------------------------------------------------------------- 3. a lama nos olhos (e nada acontece)
function scLama(t) {
  const a0 = at(10);
  const putT = wordTime(11, 'passou');
  const mudP = E.out(prog(t, putT - 0.1, putT + 0.45));
  const nada = prog(t, seg(12), seg(12) + 0.5);
  let s = bgDay(t, { seed: 925, sun: false });
  // Fundo mais calmo em close
  const armReach = E.out(prog(t, wordTime(11, 'lama'), putT + 0.3)) * (1 - 0.65 * nada);
  s += person({ ...JESUS, x: 380, y: 1170, s: 1.42, look: 0.8, armR: lerp(28, 96, armReach), mood: 'calm' });
  s += person({ ...CEGO, x: 690, y: 1175, s: 1.38, kneel: true, look: -0.5, mood: 'closed', armL: 24, armR: 20 });
  s += mudOnEyes(690, 1175, 1.38, mudP, true);
  // Gota de barro na mão antes de passar
  if (armReach > 0.2 && mudP < 0.8) {
    const mx = lerp(495, 650, mudP), my = lerp(960, 935, mudP);
    s += `<circle cx="${f1(mx)}" cy="${f1(my)}" r="10" fill="${C.wood}" stroke="${C.ink}" stroke-width="3.5"/>`;
  }
  const z = 1.04 + 0.08 * E.inOut(prog(t, a0, at(13)));
  return { svg: cam(s, 560, 960, z), html: '' };
}

// ---------------------------------------------------------------- 4. "Vá se lavar no tanque de Siloé"
function scOrdem(t) {
  const a0 = at(13);
  const pt = E.out(prog(t, seg(13) + 0.3, wordTime(13, 'tanque')));
  let s = bgDay(t, { seed: 935, sunX: 200, sunY: 420 });
  s += city(820, 1020, 0.52, t);
  s += siloePool(870, 1145, 0.42, t);
  s += person({ ...JESUS, x: 340, y: 1185, s: 1.32, look: 0.9, armR: lerp(24, 98, pt), mood: 'calm' });
  s += person({ ...CEGO, x: 580, y: 1190, s: 1.24, kneel: true, look: 0.4, mood: 'closed' });
  s += mudOnEyes(580, 1190, 1.24, 1, true);
  return { svg: cam(s, 540, 1040, 1.0 + 0.05 * prog(t, a0, at(14))), html: '' };
}

// ---------------------------------------------------------------- 5. tateando pela rua, todo mundo olhando
function scCaminho(t) {
  const a0 = at(14);
  const pause = prog(t, seg(17), seg(17) + 0.4);
  const walkSpeed = pause > 0.5 ? 0 : 4.2;
  const ox = (t - a0) * 58 * (1 - 0.8 * pause);
  let s = bgDay(t, { seed: 945, ox, sunX: 840, sunY: 440 });
  // Pessoas na calçada olhando pra ele
  const watchers = [
    [220, 1135, 0.82, 501, 0.8],
    [430, 1120, 0.78, 502, 0.4],
    [790, 1140, 0.84, 503, -0.7],
    [940, 1125, 0.80, 504, -0.9],
  ];
  watchers.forEach(([wx, wy, ws, seed, lk]) => {
    s += person({ ...man(seed), x: wx - ox * 0.25, y: wy, s: ws, look: lk, mood: 'calm' });
  });
  // Cego andando devagar com os braços estendidos tateando
  const cx = lerp(420, 580, prog(t, a0, at(18)));
  s += person({ ...CEGO, x: cx, y: 1245, s: 1.32, walk: t * walkSpeed, look: 0.2, mood: 'closed', armL: 65, armR: 82 });
  s += mudOnEyes(cx, 1245, 1.32, 1, false);
  const z = 1.0 + 0.08 * E.out(prog(t, seg(16), at(18)));
  return { svg: cam(s, cx, 1040, z), html: '' };
}

// ---------------------------------------------------------------- 6. lava no tanque e volta enxergando
function scTanque(t) {
  const a0 = at(18);
  const washT = wordTime(18, 'lavou');
  const seeT = wordTime(18, 'voltou');
  const washed = prog(t, washT, washT + 0.6);
  const seeing = prog(t, seeT - 0.1, seeT + 0.45);
  let s = bgDay(t, { seed: 955, sunX: 540, sunY: 420 });
  s += olive(180, 1040, 0.85) + olive(900, 1045, 0.75);
  if (seeing > 0) {
    s += `<circle cx="540" cy="960" r="${f1(340 * seeing)}" fill="url(#gAmber)" opacity="${f1(0.45 * seeing * 100) / 100}"/>`;
  }
  s += siloePool(540, 1135, 1.0, t);
  const kneel = washed < 0.9 || seeing < 0.3;
  const mood = seeing > 0.35 ? 'happy' : 'closed';
  const armUp = seeing > 0.35 ? lerp(30, 125, seeing) : lerp(55, 110, Math.sin(t * 10) * 0.5 + 0.5);
  s += person({ ...CEGO, x: 540, y: 1105, s: 1.24, kneel, mood, look: 0, armL: armUp, armR: armUp });
  if (washed < 0.85) s += mudOnEyes(540, 1105, 1.24, 1 - washed, kneel);
  // Respingos de água enquanto lava o rosto
  if (washed > 0.05 && seeing < 0.5) {
    for (let i = 0; i < 6; i++) {
      const ph = ((t * 2.2 + i * 0.18) % 1);
      const dx = (i - 2.5) * 28, dy = -Math.sin(ph * Math.PI) * 70;
      s += `<circle cx="${f1(540 + dx)}" cy="${f1(1045 + dy)}" r="6" fill="${C.b400}" opacity="${f1((1 - ph) * 100) / 100}"/>`;
    }
  }
  return { svg: cam(s, 540, 1020, 1.0 + 0.06 * seeing), html: '' };
}

// ---------------------------------------------------------------- 7. fechamento do loop + impacto hoje
function scFechamento(t) {
  const a0 = at(19);
  const p = prog(t, a0, AUDIO_END);
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>`;
  s += sun(540, f1(lerp(820, 560, E.out(p))), 76, t);
  s += clouds(t, 0, '#FFFFFF', '#EDE5DC', [7, 4], [150, 740]);
  s += hills(GROUND - 135, 80, 0.0032, 977, '#E6DCD2') + hills(GROUND - 55, 55, 0.0055, 979, '#D8CCC0');
  s += floor('day', (t - a0) * 42);
  // Estrada rumo ao tanque de Siloé brilhando à frente
  s += `<path d="M 480 1040 L 600 1040 L 820 1920 L 260 1920 Z" fill="#EFE8E0" stroke="${C.ink}" stroke-width="4" opacity="0.7"/>`;
  s += siloePool(540, 1085, 0.45, t);
  // Pessoa caminhando firme para frente na obediência
  const walkY = lerp(1285, 1165, E.inOut(p));
  const walkS = lerp(1.38, 1.05, E.inOut(p));
  const clearMud = prog(t, seg(25), AUDIO_END);
  s += person({ ...CEGO, x: 540, y: walkY, s: walkS, walk: t * 5.2, mood: clearMud > 0.3 ? 'happy' : 'calm', armL: 24, armR: 24 });
  if (clearMud < 0.4) s += mudOnEyes(540, walkY, walkS, 1 - clearMud * 2.5, false);
  return { svg: cam(s, 540, 1030, 1.0 + 0.05 * p), html: '' };
}

// ---------------------------------------------------------------- 8. fim
const scFim = (t) => endCard(t, AUDIO_END + 0.2, ['João 9:1-7']);

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  { a: 0, b: at(5), f: scGancho, ref: 'João 9:6' },
  { a: at(5), b: at(10), f: scDiscipulos, ref: 'João 9:1-3' },
  { a: at(10), b: at(13), f: scLama, ref: 'João 9:6' },
  { a: at(13), b: at(14), f: scOrdem, ref: 'João 9:7' },
  { a: at(14), b: at(18), f: scCaminho, ref: null },
  { a: at(18), b: at(19), f: scTanque, ref: 'João 9:7' },
  { a: at(19), b: AUDIO_END + 0.2, f: scFechamento, ref: null },
  { a: AUDIO_END + 0.2, b: DURATION + 1, f: scFim, ref: null, end: true },
];
