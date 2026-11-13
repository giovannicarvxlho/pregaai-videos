// Por que Jesus só apareceu depois que ele foi expulso (João 9:35-38).
// Abertura com texto grande no 1º quadro (legível sem som) + loop que fecha no final.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];

const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const CEGO = { robe: C.g500, skin: '#C68B59', hair: '#3A2A20', beard: true };
const PAI = { robe: C.g600, skin: '#C68B59', hair: '#87857F', beard: true };
const MAE = { robe: C.g400, skin: '#C68B59', hair: '#7B7471', beard: false, cover: '#E2D8CF' };
const fariseu = (seed, extra = {}) => ({ ...lider(seed), robe: seed % 2 ? '#5B3F7A' : C.ch400, ...extra });

function mudOnEyes(px, py, ps, op = 1, kneel = false) {
  if (op <= 0) return '';
  const dy = kneel ? 40 : 0;
  return `<g transform="translate(${f1(px)} ${f1(py)}) scale(${ps})" opacity="${f1(clamp(op) * 100) / 100}">
    <g transform="translate(0 ${dy})">
      <ellipse cx="-13" cy="-209" rx="13" ry="8" fill="${C.wood}" stroke="${C.ink}" stroke-width="3.5"/>
      <ellipse cx="13" cy="-209" rx="13" ry="8" fill="${C.wood}" stroke="${C.ink}" stroke-width="3.5"/>
    </g>
  </g>`;
}

function siloePool(x, y, s, t) {
  const w1 = Math.sin(t * 3) * 8;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">
    <ellipse cx="0" cy="24" rx="260" ry="76" fill="${C.g500}" ${ink(6)}/>
    <ellipse cx="0" cy="10" rx="250" ry="70" fill="${C.g400}" ${ink(6)}/>
    <ellipse cx="0" cy="12" rx="210" ry="52" fill="url(#gWater)" ${ink(5)}/>
    <ellipse cx="${f1(w1)}" cy="8" rx="130" ry="26" fill="none" stroke="${C.b300}" stroke-width="4" opacity="0.65"/>
  </g>`;
}

// ---------------------------------------------------------------- 1. gancho (loop + texto mudo)
function scGancho(t) {
  let s = bgGloom(t, { seed: 401 });
  s += city(540, 1020, 0.72, t);
  const turn = prog(t, 6.3, 9.0);
  s += person({ ...fariseu(11), x: 230, y: 1150, s: 1.0, flip: turn > 0.3, look: turn > 0.3 ? -0.8 : 0.8 });
  s += person({ ...PAI, x: 850, y: 1150, s: 1.0, flip: turn > 0.3, look: turn > 0.3 ? 0.8 : -0.8 });
  s += person({ ...CEGO, x: 540, y: 1185, s: 1.24, mood: 'calm', look: 0, armL: 24, armR: 24 });

  const out = prog(t, fim(1) + 0.1, fim(1) + 0.5);
  const html = `<div style="position:absolute;left:0;right:0;top:290px;display:flex;flex-direction:column;align-items:center;opacity:${f1((1 - out) * 100) / 100}">
    <div style="font:400 72px/1 'Gasoek One';color:#181614;text-shadow:0 6px 0 #fff;white-space:nowrap">ELE DEFENDEU</div>
    <div style="margin-top:18px;padding:6px 34px 20px;background:#2383E2;border:7px solid #181614;border-radius:30px;box-shadow:0 12px 0 0 #181614;font:400 76px/1 'Gasoek One';color:#fff;white-space:nowrap;transform:rotate(-3deg)">QUEM NUNCA VIU</div>
  </div>`;
  return { svg: cam(s, 540, 1030, 1.0 + 0.06 * E.sine(prog(t, 0, at(3)))), html };
}

// ---------------------------------------------------------------- 2. barro (cego) e Siloé (sozinho)
function scBarroTanque(t) {
  const tTanque = seg(4);
  if (t < tTanque - 0.15) {
    let s = bgDay(t, { seed: 412, sun: false });
    const put = prog(t, seg(3) + 0.3, seg(3) + 1.4);
    s += person({ ...JESUS, x: 370, y: 1185, s: 1.32, look: 0.8, armR: lerp(28, 92, put) });
    s += person({ ...CEGO, x: 690, y: 1190, s: 1.28, kneel: true, mood: 'closed', look: -0.5 });
    s += mudOnEyes(690, 1190, 1.28, put, true);
    return { svg: cam(s, 540, 1010, 1.02 + 0.05 * put), html: '' };
  }
  const see = prog(t, tTanque + 0.6, tTanque + 1.6);
  let s = bgDay(t, { seed: 415, sunX: 540, sunY: 420 });
  s += siloePool(540, 1135, 1.0, t);
  s += person({ ...CEGO, x: 540, y: 1105, s: 1.24, kneel: see < 0.4, mood: see > 0.4 ? 'happy' : 'closed', armL: lerp(50, 90, see), armR: lerp(50, 90, see) });
  if (see < 0.6) s += mudOnEyes(540, 1105, 1.24, 1 - see * 1.6, see < 0.4);
  return { svg: cam(s, 540, 1000, 1.02 + 0.05 * see), html: '' };
}

// ---------------------------------------------------------------- 3. líderes pressionam e pais recuam
function scPressaoPais(t) {
  const paisT = seg(6);
  const recuo = E.out(prog(t, paisT + 0.4, at(7)));
  let s = bgDay(t, { seed: 422, sun: false });
  s += rect(100, 360, 880, 680, C.g300, ink(6));
  s += person({ ...fariseu(21), x: 240, y: 1180, s: 1.15, look: 0.9, mood: 'angry', armR: fala(t, seg(5), paisT, 30, 50) });
  s += person({ ...CEGO, x: 520, y: 1185, s: 1.22, mood: 'calm', look: 0 });
  s += person({ ...PAI, x: lerp(760, 860, recuo), y: 1180, s: 1.14, look: -0.8, mood: recuo > 0.2 ? 'fear' : 'calm', t });
  s += person({ ...MAE, x: lerp(880, 960, recuo), y: 1185, s: 1.1, look: -0.9, mood: recuo > 0.2 ? 'fear' : 'calm', t });
  return { svg: cam(s, 540, 1020, 1.0 + 0.04 * recuo), html: '' };
}

// ---------------------------------------------------------------- 4. "eu era cego" e expulsão
function scExpulso(t) {
  const exp = E.inOut(prog(t, seg(8), at(9)));
  let s = bgDay(t, { seed: 430, sun: false });
  if (exp > 0) s += opg(exp * 0.75, bgDusk(t));
  s += rect(100, 360, 880, 680, C.g300, ink(6));
  s += person({ ...CEGO, x: lerp(420, 160, exp), y: 1185, s: 1.24, walk: exp > 0.1 ? t * 5 : null, look: exp > 0.2 ? -0.7 : 0.9, armR: exp < 0.2 ? 75 : 22, mood: 'calm' });
  s += person({ ...fariseu(31), x: 740, y: 1180, s: 1.2, look: -0.9, mood: 'angry', armL: exp > 0.05 ? 105 : 25 });
  s += person({ ...fariseu(32), x: 890, y: 1185, s: 1.16, look: -0.9, mood: 'angry', armL: exp > 0.05 ? 95 : 18 });
  return { svg: cam(s, 540, 1020, 1.02 + 0.04 * exp), html: '' };
}

// ---------------------------------------------------------------- 5. Jesus vai atrás dele e se revela
function scReencontro(t) {
  const a0 = at(9);
  const rev = E.out(prog(t, seg(9) + 1.5, at(10)));
  let s = bgDusk(t);
  s += `<circle cx="540" cy="960" r="${f1(420 * rev)}" fill="url(#gAmber)" opacity="${f1(0.45 * rev * 100) / 100}"/>`;
  const jx = lerp(200, 380, E.out(prog(t, a0, a0 + 1.8)));
  s += person({ ...JESUS, x: jx, y: 1185, s: 1.26, look: 0.9, armR: lerp(24, 72, rev), rim: C.a300 });
  s += person({ ...CEGO, x: 700, y: 1190, s: 1.24, kneel: rev > 0.4, look: -0.9, mood: rev > 0.4 ? 'happy' : 'calm', armL: rev > 0.4 ? 80 : 20, armR: rev > 0.4 ? 80 : 20 });
  return { svg: cam(s, 540, 1010, 1.0 + 0.06 * rev), html: '' };
}

// ---------------------------------------------------------------- 6. fechamento do loop + impacto hoje
function scFechamento(t) {
  const a0 = at(10);
  const p = prog(t, a0, AUDIO_END);
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>`;
  s += sun(540, f1(lerp(760, 500, E.out(p))), 76, t);
  s += clouds(t, 0, '#FFFFFF', '#EDE5DC', [7, 4], [150, 740]);
  s += hills(GROUND - 135, 80, 0.0032, 477, '#E6DCD2') + hills(GROUND - 55, 55, 0.0055, 479, '#D8CCC0');
  s += floor('day', (t - a0) * 40);
  const wy = lerp(1200, 1110, E.inOut(p));
  const ws = lerp(1.26, 1.04, E.inOut(p));
  s += person({ ...JESUS, x: 430, y: wy, s: ws, walk: t * 4.5, look: 0.3, armR: 30, rim: C.a300 });
  s += person({ ...CEGO, x: 650, y: wy + 6, s: ws * 0.96, walk: t * 4.5, look: -0.3, mood: 'happy' });
  return { svg: cam(s, 540, 1000, 1.0 + 0.05 * p), html: '' };
}

const scFim = (t) => endCard(t, AUDIO_END + 0.2, ['João 9:35-38']);

const SCENES = [
  { a: 0, b: at(3), f: scGancho, ref: 'João 9:35-38' },
  { a: at(3), b: at(5), f: scBarroTanque, ref: 'João 9:6-7' },
  { a: at(5), b: at(7), f: scPressaoPais, ref: 'João 9:18-23' },
  { a: at(7), b: at(9), f: scExpulso, ref: 'João 9:25, 34', dark: (t) => t > seg(8) + 0.8 },
  { a: at(9), b: at(10), f: scReencontro, ref: 'João 9:35-38', dark: true },
  { a: at(10), b: AUDIO_END + 0.2, f: scFechamento, ref: null },
  { a: AUDIO_END + 0.2, b: DURATION + 1, f: scFim, ref: null, end: true },
];
