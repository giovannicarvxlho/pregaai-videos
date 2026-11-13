// A única frase que desmontou os líderes religiosos (João 9:13-34).
// Abertura com texto grande no 1º quadro (legível sem som) + loop que fecha no final.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];

const CEGO = { robe: C.g500, skin: '#C68B59', hair: '#3A2A20', beard: true };
const PAI = { robe: C.g600, skin: '#C68B59', hair: '#87857F', beard: true };
const MAE = { robe: C.g400, skin: '#C68B59', hair: '#7B7471', beard: false, cover: '#E2D8CF' };
const fariseu = (seed, extra = {}) => ({ ...lider(seed), robe: seed % 2 ? '#5B3F7A' : C.ch400, ...extra });

// ---------------------------------------------------------------- 1. gancho (loop + texto mudo)
function scGancho(t) {
  let s = bgGloom(t, { seed: 601 });
  s += city(540, 1020, 0.72, t);
  const rec = E.out(prog(t, 1.5, 4.5));
  s += person({ ...CEGO, x: 360, y: 1185, s: 1.24, mood: 'calm', look: 0.7 });
  s += person({ ...PAI, x: lerp(650, 770, rec), y: 1180, s: 1.16, look: -0.6, mood: 'fear', t });
  s += person({ ...MAE, x: lerp(790, 910, rec), y: 1185, s: 1.12, look: -0.7, mood: 'fear', t });

  const out = prog(t, fim(1) + 0.1, fim(1) + 0.5);
  const html = `<div style="position:absolute;left:0;right:0;top:290px;display:flex;flex-direction:column;align-items:center;opacity:${f1((1 - out) * 100) / 100}">
    <div style="font:400 72px/1 'Gasoek One';color:#181614;text-shadow:0 6px 0 #fff;white-space:nowrap">OS PAIS DEIXARAM</div>
    <div style="margin-top:18px;padding:6px 36px 20px;background:#2383E2;border:7px solid #181614;border-radius:30px;box-shadow:0 12px 0 0 #181614;font:400 84px/1 'Gasoek One';color:#fff;white-space:nowrap;transform:rotate(-3deg)">ELE SOZINHO</div>
  </div>`;
  return { svg: cam(s, 540, 1030, 1.0 + 0.06 * E.sine(prog(t, 0, at(3)))), html };
}

// ---------------------------------------------------------------- 2. sábado e os pais lavam as mãos
function scSabadoPais(t) {
  const paisT = seg(4);
  const recuo = E.out(prog(t, seg(5), at(6)));
  let s = bgDay(t, { seed: 612, sun: false });
  s += rect(100, 360, 880, 680, C.g300, ink(6));
  s += person({ ...fariseu(41), x: 250, y: 1180, s: 1.2, look: 0.9, mood: 'angry', armR: fala(t, seg(3), at(6), 30, 50) });
  s += person({ ...CEGO, x: 520, y: 1185, s: 1.22, mood: 'calm', look: 0 });
  if (t > paisT - 0.3) {
    s += person({ ...PAI, x: lerp(740, 850, recuo), y: 1180, s: 1.14, look: -0.9, mood: 'fear', armL: recuo > 0.3 ? 75 : 20, t });
    s += person({ ...MAE, x: lerp(870, 960, recuo), y: 1185, s: 1.1, look: -0.9, mood: 'fear', t });
  }
  return { svg: cam(s, 540, 1020, 1.0 + 0.05 * prog(t, at(3), at(6))), html: '' };
}

// ---------------------------------------------------------------- 3. "uma coisa eu sei"
function scUmaCoisaEuSei(t) {
  const respT = seg(8);
  const brilho = E.out(prog(t, respT + 0.8, at(9)));
  let s = bgDay(t, { seed: 625, sun: false });
  s += rect(100, 360, 880, 680, C.g300, ink(6));
  if (brilho > 0) s += `<circle cx="340" cy="1000" r="${f1(320 * brilho)}" fill="url(#gAmber)" opacity="${f1(0.45 * brilho * 100) / 100}"/>`;
  s += person({ ...CEGO, x: 340, y: 1185, s: 1.28, look: 0.9, mood: brilho > 0.3 ? 'happy' : 'calm', armR: brilho > 0.1 ? 65 : 22, rim: brilho > 0.2 ? C.a300 : null });
  s += person({ ...fariseu(51), x: 700, y: 1180, s: 1.18, look: -0.9, mood: brilho > 0.4 ? 'calm' : 'angry', armL: brilho > 0.4 ? 18 : fala(t, seg(6), respT, 35, 55) });
  s += person({ ...fariseu(52), x: 870, y: 1185, s: 1.14, look: -0.9, mood: brilho > 0.4 ? 'calm' : 'angry' });
  return { svg: cam(s, 540, 1020, 1.02 + 0.06 * brilho), html: '' };
}

// ---------------------------------------------------------------- 4. fechamento do loop + impacto hoje
function scFechamento(t) {
  const a0 = at(9);
  const p = prog(t, a0, AUDIO_END);
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>`;
  s += sun(540, f1(lerp(760, 500, E.out(p))), 76, t);
  s += clouds(t, 0, '#FFFFFF', '#EDE5DC', [7, 4], [150, 740]);
  s += hills(GROUND - 135, 80, 0.0032, 677, '#E6DCD2') + hills(GROUND - 55, 55, 0.0055, 679, '#D8CCC0');
  s += floor('day', (t - a0) * 35);
  s += person({ ...CEGO, x: 540, y: 1175, s: 1.32, walk: t * 4.5, mood: 'happy', armL: 24, armR: 24, rim: C.a300 });
  return { svg: cam(s, 540, 1000, 1.0 + 0.06 * p), html: '' };
}

const scFim = (t) => endCard(t, AUDIO_END + 0.2, ['João 9:13-34']);

const SCENES = [
  { a: 0, b: at(3), f: scGancho, ref: 'João 9:18-23' },
  { a: at(3), b: at(6), f: scSabadoPais, ref: 'João 9:14-23' },
  { a: at(6), b: at(9), f: scUmaCoisaEuSei, ref: 'João 9:24-25' },
  { a: at(9), b: AUDIO_END + 0.2, f: scFechamento, ref: null },
  { a: AUDIO_END + 0.2, b: DURATION + 1, f: scFim, ref: null, end: true },
];
