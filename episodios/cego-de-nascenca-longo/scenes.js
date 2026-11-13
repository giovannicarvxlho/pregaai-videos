// O cego de nascença — versão longa 16:9 (João 9:1-38).
// Mantém o gancho e fechamento do Short com todas as viradas da passagem.
// Banner do PregaAI fixo no canto superior direito durante todo o vídeo (CTA_FIXO = true).

const L = (part, line) => PARTS[part - 1] + line;
const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];

const FLOOR_Y = 860;
const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const CEGO = { robe: C.g500, skin: '#C68B59', hair: '#3A2A20', beard: true };
const DISC1 = { robe: C.g400, skin: '#A86B3C', hair: '#292726', beard: true };
const DISC2 = { robe: C.p500, skin: '#E0AC69', hair: '#5A3A28', beard: true };
const PAI = { robe: C.g600, skin: '#C68B59', hair: '#87857F', beard: true };
const MAE = { robe: C.g400, skin: '#C68B59', hair: '#7B7471', beard: false, cover: '#E2D8CF' };
const fariseu = (seed, extra = {}) => ({ ...lider(seed), robe: seed % 2 ? '#5B3F7A' : C.ch400, ...extra });

// Manchas de barro sobre os olhos do personagem.
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

// Tanque de Siloé em pedra com água azul.
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

// ---------------------------------------------------------------- 1. abertura + promessa
function scAbertura(t) {
  const a0 = 0;
  let s = bgGloom(t, { seed: 901 });
  s += `<circle cx="960" cy="560" r="460" fill="url(#gWhite)" opacity="0.5"/>`;
  s += city(960, GROUND, 0.85, t);
  const prom = prog(t, seg(L(1, 4)), at(L(2, 0)));
  if (prom > 0) {
    // Silhuetas ao fundo indicando os conflitos que vêm depois (interrogatório, pais, expulsão)
    s += opg(prom * 0.55,
      person({ ...fariseu(11), x: 380, y: 720, s: 0.9, sil: C.ch600, armR: 60 }) +
      person({ ...fariseu(12), x: 1540, y: 720, s: 0.9, sil: C.ch600, armL: 60 }) +
      person({ ...PAI, x: 1380, y: 740, s: 0.85, sil: C.ch500, look: -0.6 })
    );
  }
  const reach = E.out(prog(t, 0.2, 1.5));
  s += person({ ...JESUS, x: 740, y: FLOOR_Y, s: 1.32, look: 0.8, armR: lerp(30, 84, reach), mood: 'calm' });
  s += person({ ...CEGO, x: 1080, y: FLOOR_Y, s: 1.28, kneel: true, mood: 'closed', look: -0.4, armL: 24, armR: 32 });
  s += mudOnEyes(1080, FLOOR_Y, 1.28, 1, true);
  return { svg: cam(s, 960, 560, 1.0 + 0.06 * E.sine(prog(t, a0, at(L(2, 0))))), html: '' };
}

// ---------------------------------------------------------------- 2. discípulos, sábado e a lama
function scSabadoLama(t) {
  const a0 = at(L(2, 0));
  const lamaT = seg(L(2, 3));
  const mudP = E.out(prog(t, wordTime(L(2, 3), 'passou') - 0.1, wordTime(L(2, 3), 'passou') + 0.45));
  const ordemT = seg(L(2, 7));
  const zoomLama = E.inOut(prog(t, lamaT - 0.3, lamaT + 0.6)) * (1 - E.inOut(prog(t, ordemT - 0.3, ordemT + 0.3)));

  let s = bgDay(t, { seed: 912, sunX: 460, sunY: 220 });
  s += city(460, GROUND, 0.72, t);
  if (t > ordemT - 0.4) {
    s += siloePool(1600, 830, 0.55, t);
  }
  // Cego sentado
  s += person({ ...CEGO, x: 640, y: FLOOR_Y, s: 1.24, kneel: true, mood: 'closed', look: 0.4, armL: 20, armR: 24 });
  if (t > lamaT) s += mudOnEyes(640, FLOOR_Y, 1.24, mudP, true);

  // Jesus no centro: fala com discípulos, depois se volta para o cego e aplica barro, depois aponta para Siloé
  const lookDisc = 1 - 2 * E.inOut(prog(t, lamaT - 0.4, lamaT + 0.2));
  const ptOrdem = E.out(prog(t, ordemT, wordTime(L(2, 7), 'tanque')));
  const armR = t > ordemT ? lerp(20, 100, ptOrdem) : 24;
  const armL = t > lamaT && t < ordemT ? lerp(24, 88, E.out(prog(t, lamaT + 1.2, lamaT + 2.5))) : 20;
  s += person({ ...JESUS, x: 960, y: FLOOR_Y, s: 1.3, look: t > ordemT ? 0.9 : lookDisc * 0.7, armL, armR, mood: 'calm' });

  // Discípulos à direita
  const ask = E.out(prog(t, seg(L(2, 1)), seg(L(2, 2))));
  s += person({ ...DISC1, x: 1320, y: FLOOR_Y, s: 1.22, look: -0.9, armL: lerp(18, 72, ask * (1 - zoomLama)), mood: 'calm' });
  s += person({ ...DISC2, x: 1510, y: FLOOR_Y + 5, s: 1.18, look: -1, armL: 16, mood: 'calm' });

  const cx = lerp(960, 800, zoomLama);
  const z = 1.0 + 0.16 * zoomLama + 0.04 * prog(t, a0, at(L(3, 0)));
  return { svg: cam(s, cx, 600, z), html: '' };
}

// ---------------------------------------------------------------- 3. caminhada cega, tanque e vizinhos
function scCaminhadaTanque(t) {
  const a0 = at(L(3, 0));
  const tankT = seg(L(3, 3));
  const vizT = seg(L(3, 4));

  if (t < tankT - 0.15) {
    // Caminhada tateando pela rua
    const pause = prog(t, seg(L(3, 2)), seg(L(3, 2)) + 0.35);
    const ox = (t - a0) * 75 * (1 - 0.85 * pause);
    let s = bgDay(t, { seed: 945, ox, sunX: 480, sunY: 220 });
    [[360, 740, 0.82, 501, 0.8], [620, 725, 0.78, 502, 0.5], [1340, 740, 0.84, 503, -0.7], [1560, 730, 0.80, 504, -0.9]]
      .forEach(([wx, wy, ws, sd, lk]) => (s += person({ ...man(sd), x: wx - ox * 0.25, y: wy, s: ws, look: lk })));
    const cx = lerp(740, 1020, prog(t, a0, tankT));
    s += person({ ...CEGO, x: cx, y: FLOOR_Y, s: 1.32, walk: pause > 0.5 ? null : t * 4.5, look: 0.2, mood: 'closed', armL: 65, armR: 84 });
    s += mudOnEyes(cx, FLOOR_Y, 1.32, 1, false);
    return { svg: cam(s, cx, 580, 1.04 + 0.06 * pause), html: '' };
  }

  if (t < vizT - 0.15) {
    // Lavando o rosto no tanque de Siloé e voltando a enxergar
    const wash = prog(t, wordTime(L(3, 3), 'lavou'), wordTime(L(3, 3), 'lavou') + 0.7);
    const see = prog(t, wordTime(L(3, 3), 'voltou') - 0.1, wordTime(L(3, 3), 'enxergando') + 0.2);
    let s = bgDay(t, { seed: 955, sunX: 960, sunY: 200 });
    s += olive(320, GROUND, 1.0) + olive(1580, GROUND, 0.9);
    if (see > 0) s += `<circle cx="960" cy="580" r="${f1(420 * see)}" fill="url(#gAmber)" opacity="${f1(0.45 * see * 100) / 100}"/>`;
    s += siloePool(960, 810, 1.15, t);
    const kneel = see < 0.35;
    const arm = see > 0.35 ? lerp(30, 125, see) : lerp(55, 110, Math.sin(t * 10) * 0.5 + 0.5);
    s += person({ ...CEGO, x: 960, y: 785, s: 1.28, kneel, mood: see > 0.35 ? 'happy' : 'closed', armL: arm, armR: arm });
    if (wash < 0.85) s += mudOnEyes(960, 785, 1.28, 1 - wash, kneel);
    return { svg: cam(s, 960, 580, 1.0 + 0.08 * see), html: '' };
  }

  // Vizinhos duvidando ("Não é esse...?" / "Sou eu!")
  let s = bgDay(t, { seed: 962, sunX: 420, sunY: 210 });
  s += city(420, GROUND, 0.75, t);
  const souEu = prog(t, seg(L(3, 8)), seg(L(3, 8)) + 0.4);
  s += person({ ...CEGO, x: 740, y: FLOOR_Y, s: 1.32, mood: 'happy', look: 0.7, armL: lerp(24, 95, souEu), armR: lerp(24, 95, souEu) });
  [1180, 1380, 1560].forEach((vx, idx) => {
    s += person({ ...man(610 + idx), x: vx, y: FLOOR_Y - idx * 8, s: 1.2, look: -0.9, armL: idx === 0 ? fala(t, vizT, at(L(4, 0)), 25, 45) : 18 });
  });
  return { svg: cam(s, 960, 560, 1.02 + 0.04 * prog(t, vizT, at(L(4, 0)))), html: '' };
}

// ---------------------------------------------------------------- 4. fariseus divididos e medo dos pais
function scPaisFariseus(t) {
  const a0 = at(L(4, 0));
  const paisT = seg(L(4, 4));
  const medoT = seg(L(4, 6));

  let s = bgDay(t, { seed: 970, sun: false });
  // Muro de pedra ao fundo (pátio da sinagoga)
  s += rect(160, 220, 1600, 420, C.g300, ink(6)) + rect(200, 260, 1520, 380, '#EFECE7', ink(4));

  if (t < paisT - 0.15) {
    // Divisão entre os fariseus
    s += person({ ...CEGO, x: 960, y: FLOOR_Y, s: 1.26, mood: 'calm', look: 0 });
    s += person({ ...fariseu(21), x: 460, y: FLOOR_Y, s: 1.26, look: 0.9, mood: 'angry', armR: fala(t, a0, paisT, 30, 55) });
    s += person({ ...fariseu(22), x: 640, y: FLOOR_Y - 10, s: 1.2, look: 0.9, armR: 25 });
    s += person({ ...fariseu(23), x: 1300, y: FLOOR_Y - 10, s: 1.2, look: -0.9, armL: fala(t + 0.6, a0, paisT, 28, 45) });
    s += person({ ...fariseu(24), x: 1480, y: FLOOR_Y, s: 1.24, look: -0.9 });
    return { svg: cam(s, 960, 560, 1.0 + 0.04 * prog(t, a0, paisT)), html: '' };
  }

  // Os pais chegam e recuam com medo
  const recuo = E.out(prog(t, medoT, medoT + 1.2));
  s += person({ ...fariseu(21), x: 420, y: FLOOR_Y, s: 1.28, look: 0.9, mood: 'angry', armR: 50 });
  s += person({ ...CEGO, x: 760, y: FLOOR_Y, s: 1.26, look: 0.5, mood: 'calm' });
  const px = lerp(1140, 1360, recuo);
  const mx = lerp(1310, 1540, recuo);
  const pMood = recuo > 0.3 ? 'fear' : 'calm';
  s += person({ ...PAI, x: px, y: FLOOR_Y, s: 1.24, look: -0.8, mood: pMood, armL: recuo > 0.4 ? 80 : 20, t });
  s += person({ ...MAE, x: mx, y: FLOOR_Y + 4, s: 1.2, look: -0.9, mood: pMood, armL: 18, t });
  return { svg: cam(s, 960, 560, 1.02 + 0.04 * recuo), html: '' };
}

// ---------------------------------------------------------------- 5. "uma coisa eu sei" e expulsão
function scCoragemExpulsao(t) {
  const a0 = at(L(5, 0));
  const expT = seg(L(5, 5));
  const exp = E.inOut(prog(t, expT, at(L(6, 0))));

  let s = bgDay(t, { seed: 980, sun: false });
  if (exp > 0) s += opg(exp * 0.7, bgDusk(t));
  s += rect(160, 220, 1600, 420, C.g300, ink(6));

  // Ex-cego firme à esquerda, sai caminhando para fora quando expulso
  const cx = lerp(640, 220, exp);
  s += person({ ...CEGO, x: cx, y: FLOOR_Y, s: 1.3, look: exp > 0.3 ? -0.8 : 0.9, walk: exp > 0.1 ? t * 5 : null, armR: exp < 0.2 ? fala(t, a0, expT, 30, 50) : 20, mood: 'calm' });

  // Fariseus à direita ficando furiosos e apontando para fora
  [1180, 1360, 1540].forEach((fx, i) => {
    s += person({ ...fariseu(31 + i), x: fx, y: FLOOR_Y - i * 6, s: 1.26, look: -0.9, mood: 'angry', armL: exp > 0.05 ? 105 : fala(t + i, a0, expT, 20, 35) });
  });
  return { svg: cam(s, 960, 560, 1.02 + 0.05 * prog(t, a0, at(L(6, 0)))), html: '' };
}

// ---------------------------------------------------------------- 6. segundo encontro e revelação
function scSegundoEncontro(t) {
  const a0 = at(L(6, 0));
  const revT = seg(L(6, 6));
  const adorT = seg(L(6, 8));
  const rev = E.out(prog(t, revT, revT + 1.2));
  const ador = E.out(prog(t, adorT - 0.3, adorT + 0.4));

  let s = bgDusk(t);
  if (rev > 0) s += `<circle cx="960" cy="560" r="${f1(520 * rev)}" fill="url(#gAmber)" opacity="${f1(0.45 * rev * 100) / 100}"/>`;
  const walkJ = E.out(prog(t, a0, a0 + 2.0));
  const jx = lerp(380, 740, walkJ);
  s += person({ ...JESUS, x: jx, y: FLOOR_Y, s: 1.32, walk: walkJ < 1 ? t * 4.5 : null, look: 0.9, armR: lerp(22, 65, rev), mood: 'calm', rim: C.a300 });
  s += person({ ...CEGO, x: 1180, y: FLOOR_Y, s: 1.28, kneel: ador > 0.3, look: -0.9, mood: ador > 0.3 ? 'happy' : 'calm', armL: ador > 0.3 ? 85 : 22, armR: ador > 0.3 ? 85 : 22 });
  return { svg: cam(s, 960, 560, 1.0 + 0.06 * rev), html: '' };
}

// ---------------------------------------------------------------- 7. fechamento do loop + impacto hoje
function scFechamento(t) {
  const a0 = at(L(7, 0));
  const p = prog(t, a0, AUDIO_END);
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>`;
  s += sun(960, f1(lerp(520, 320, E.out(p))), 78, t);
  s += clouds(t, 0, '#FFFFFF', '#EDE5DC', [7, 4], [240, 1280]);
  s += hills(GROUND - 100, 70, 0.0025, 977, '#E6DCD2') + hills(GROUND - 35, 45, 0.0045, 979, '#D8CCC0');
  s += floor('day', (t - a0) * 48);
  // Estrada rumo ao tanque de Siloé no horizonte
  s += `<path d="M 880 640 L 1040 640 L 1380 1080 L 540 1080 Z" fill="#EFE8E0" stroke="${C.ink}" stroke-width="4" opacity="0.72"/>`;
  s += siloePool(960, 685, 0.52, t);
  const wy = lerp(890, 770, E.inOut(p));
  const ws = lerp(1.36, 1.02, E.inOut(p));
  s += person({ ...CEGO, x: 960, y: wy, s: ws, walk: t * 5.2, mood: p > 0.7 ? 'happy' : 'calm', armL: 24, armR: 24 });
  return { svg: cam(s, 960, 560, 1.0 + 0.05 * p), html: '' };
}

// ---------------------------------------------------------------- 8. fim
const scFim = (t) => endCard(t, AUDIO_END + 0.2, ['João 9:1-38']);

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  { a: 0, b: at(L(2, 0)), f: scAbertura, ref: 'João 9:1-7' },
  { a: at(L(2, 0)), b: at(L(3, 0)), f: scSabadoLama, ref: 'João 9:2-7, 14' },
  { a: at(L(3, 0)), b: at(L(4, 0)), f: scCaminhadaTanque, ref: 'João 9:7-12' },
  { a: at(L(4, 0)), b: at(L(5, 0)), f: scPaisFariseus, ref: 'João 9:13-23' },
  { a: at(L(5, 0)), b: at(L(6, 0)), f: scCoragemExpulsao, ref: 'João 9:24-34' },
  { a: at(L(6, 0)), b: at(L(7, 0)), f: scSegundoEncontro, ref: 'João 9:35-38', dark: true },
  { a: at(L(7, 0)), b: AUDIO_END + 0.2, f: scFechamento, ref: null },
  { a: AUDIO_END + 0.2, b: DURATION + 1, f: scFim, ref: null, end: true },
];
