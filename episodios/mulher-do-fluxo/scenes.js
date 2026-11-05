// A mulher do fluxo de sangue (Marcos 5:24-34; Lucas 8:43-48; Levítico 15:19, 25). Vertical, mais de 1 min, sem acelerar.
// As cenas começam pelo índice da frase em SEGS. O primeiro quadro já está em movimento.

const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const MULHER = { robe: C.g600, skin: '#C68B59', hair: '#3A2A20', beard: false, cover: '#E2D8CF' };
const PEDRO = { robe: C.p500, skin: '#C68B59', hair: '#5A3A28', beard: true, cover: null };
const MEDICO = { ...man(3101), beard: true, cover: C.g300, robe: C.ch300 };
const OL = '#0E0D0C';

// Gente da multidão: [x, y, escala, semente, olhar]. walk anda junto; away afasta da mulher.
function povo(t, list, o = {}) {
  let s = '';
  list.forEach(([x, y, sc, sd, look]) => {
    const dx = o.away ? Math.sign(x - o.away[0]) * o.away[1] : 0;
    s += person({ ...man(sd), x: x + dx, y, s: sc, look: look ?? 0, walk: o.walk ? t * 5 + sd : null, ol: o.ol, sil: o.sil, mood: o.mood });
  });
  return s;
}
// Moedas que saem da mão dela e caem na do médico, em arco.
function moedas(t, x0, y0, x1, y1, t0, t1, n) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = t0 + (i * (t1 - t0)) / n, p = prog(t, a, a + 0.55);
    if (p <= 0 || p >= 1) continue;
    const x = lerp(x0, x1, p), y = lerp(y0, y1, p) - Math.sin(p * Math.PI) * 120;
    s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="15" ry="${f1(15 * Math.abs(Math.cos(t * 9 + i)) + 3)}" fill="${C.a400}" ${ink(4)}/>`;
  }
  return s;
}
// Rolo da Lei aberto sobre a mesa (linhas de texto sem letra legível).
function rolo(x, y, open) {
  const w = f1(260 * open);
  let s = `<rect x="${x - w}" y="${y - 210}" width="${f1(2 * w)}" height="420" fill="#EFE3CC" ${ink(6, OL)}/>`;
  for (let r = 0; r < 9; r++) for (let c = 0; c < 2; c++) {
    const lx = x - w + 30 + c * (w + 0), lw = Math.max(0, w - 60) * (0.7 + ((r * 3 + c) % 4) * 0.08);
    if (lw > 4) s += `<line x1="${f1(lx)}" y1="${y - 160 + r * 40}" x2="${f1(lx + lw)}" y2="${y - 160 + r * 40}" stroke="#8C7A62" stroke-width="7" stroke-linecap="round" opacity="0.7"/>`;
  }
  const roll = (rx) => `<rect x="${f1(rx - 34)}" y="${y - 240}" width="68" height="480" rx="30" fill="#E2D2B4" ${ink(6, OL)}/><rect x="${f1(rx - 12)}" y="${y - 290}" width="24" height="580" rx="12" fill="${C.wood}" ${ink(5, OL)}/>`;
  return s + roll(x - w - 20) + roll(x + w + 20);
}
// Riscos na parede, um por ano (Marcos 5:25: doze anos). Grupos de cinco.
function riscos(t, x, y, t0, t1) {
  let s = '';
  for (let i = 0; i < 12; i++) {
    const p = pop(t, lerp(t0, t1, i / 11), 0.25);
    if (p <= 0) continue;
    const g = Math.floor(i / 5), k = i % 5, gx = x + g * 150;
    s += k < 4
      ? `<line x1="${gx + k * 26}" y1="${y}" x2="${gx + k * 26}" y2="${f1(y + 110 * Math.min(1, p))}" stroke="#E9DCC9" stroke-width="9" stroke-linecap="round"/>`
      : `<line x1="${gx - 14}" y1="${y + 90}" x2="${f1(gx - 14 + 120 * Math.min(1, p))}" y2="${f1(y + 90 - 70 * Math.min(1, p))}" stroke="#E9DCC9" stroke-width="9" stroke-linecap="round"/>`;
  }
  return s;
}
const RUA = (t, ox = 0) => bgDay(t, { ox }) + city(540 - ox * 0.4, GROUND, 1.25, t);

// ---------------------------------------------------------------- 1. o gancho: todo mundo se afasta dela
function scGancho(t) {
  const back = E.out(prog(t, 0, 1.4));
  let s = RUA(t, t * 6);
  s += povo(t, [[150, 1150, 0.85, 3111, 1], [930, 1150, 0.85, 3112, -1], [230, 1235, 1.2, 3113, 1], [880, 1240, 1.2, 3114, -1], [330, 1180, 1.0, 3115, 1]], { away: [560, 130 * back] });
  s += person({ ...MULHER, x: 560, y: 1235, s: 1.3, mood: 'sad', look: -0.4, walk: t * 4 });
  return { svg: cam(s, 560, 1100, 1.1 + 0.12 * E.inOut(prog(t, 0, at(1)))), html: '' };
}

// ---------------------------------------------------------------- 2. a mão no manto
function scMao(t) {
  const reach = E.inOut(prog(t, seg(1) - 0.2, wordTime(1, 'tocou')));
  let s = RUA(t, 40);
  s += povo(t, [[120, 1170, 0.9, 3121, 1], [960, 1170, 0.9, 3122, -1]], { walk: true });
  s += person({ ...JESUS, x: 730, y: 1270, s: 1.9, walk: t * 4, look: 0.5, noShadow: true });
  s += person({ ...MULHER, x: 470, y: 1270, s: 1.9, kneel: true, mood: 'calm', look: 1, armR: lerp(10, 42, reach), noShadow: true });
  return { svg: cam(s, 600, 1100, 1.0 + 0.06 * reach), html: '' };
}

// ---------------------------------------------------------------- 3. doze anos
function scDoze(t) {
  let s = `<rect width="${W}" height="${H}" fill="#2B2420"/>`;
  for (let r = 0; r < 14; r++) s += `<line x1="0" y1="${200 + r * 64}" x2="${W}" y2="${200 + r * 64}" stroke="#241E1B" stroke-width="5"/>`;
  s += floor('dusk', 0, 1100);
  s += `<circle cx="760" cy="1040" r="520" fill="url(#gAmber)" opacity="0.4"/>`;
  s += riscos(t, 250, 560, seg(2), seg(2) + 2.4);
  s += `<rect x="690" y="1110" width="150" height="26" rx="8" fill="${C.wood}" ${ink(5, OL)}/>` + flame(765, 1100, 12, 40, C.a300) + `<ellipse cx="765" cy="1106" rx="30" ry="10" fill="${C.a600}" ${ink(4, OL)}/>`;
  s += person({ ...MULHER, x: 470, y: 1240, s: 1.35, kneel: true, lean: -6, mood: 'sad', look: 0.6, rim: C.a300, ol: OL });
  return { svg: cam(s, 540, 1000, 1.0 + 0.07 * E.inOut(prog(t, at(2), at(3)))), html: '' };
}

// ---------------------------------------------------------------- 4. os médicos
function scMedicos(t) {
  const worse = E.inOut(prog(t, seg(4) + 0.3, seg(4) + 1.4));
  let s = bgDay(t, { sun: false });
  s += `<rect x="-40" y="420" width="${W + 80}" height="620" fill="${C.g300}" ${ink(6)}/>` + `<rect x="700" y="560" width="200" height="300" rx="100" fill="${C.g700}" ${ink(6)}/>`;
  s += jar(820, 1000, 1.3) + jar(900, 1010, 1.0);
  s += person({ ...MEDICO, x: 760, y: 1235, s: 1.25, look: -1, flip: true, armR: t < seg(4) ? 40 : lerp(40, 110, worse), armL: t < seg(4) ? 14 : lerp(14, 110, worse) });
  s += moedas(t, 420, 1060, 690, 1080, seg(3), seg(3) + 1.6, 4);
  s += person({ ...MULHER, x: 340, y: 1235, s: 1.25, look: 1, mood: 'sad', armR: t < seg(4) ? 60 : 14, kneel: worse > 0.6, lean: -10 * worse });
  return { svg: cam(s, 540, 1080, 1.02 + 0.06 * E.inOut(prog(t, at(3), at(5)))), html: '' };
}

// ---------------------------------------------------------------- 5. a multidão
function scMultidao(t) {
  const ox = t * 30;
  let s = RUA(t, ox);
  s += povo(t, [[110, 1120, 0.7, 3141, 1], [300, 1110, 0.7, 3142, 0], [780, 1110, 0.7, 3143, 0], [980, 1120, 0.7, 3144, -1]], { walk: true });
  s += povo(t, [[180, 1210, 0.95, 3145, 1], [380, 1200, 0.95, 3146, 1], [700, 1200, 0.95, 3147, -1], [900, 1210, 0.95, 3148, -1]], { walk: true });
  s += person({ ...JESUS, x: 540, y: 1240, s: 1.3, walk: t * 5, look: 0.2 });
  s += povo(t, [[20, 1250, 1.35, 3149, 1], [1060, 1250, 1.35, 3152, -1]], { walk: true });
  return { svg: cam(s, 540, 1100, 1.0 + 0.06 * E.inOut(prog(t, at(5), at(6)))), html: '' };
}

// ---------------------------------------------------------------- 6. ela pensou
function scPensou(t) {
  const hope = t > seg(7) + 0.6;
  let s = RUA(t, 120);
  s += povo(t, [[180, 1150, 0.8, 3161, 1], [400, 1140, 0.8, 3162, 1], [700, 1140, 0.8, 3163, -1], [900, 1150, 0.8, 3164, -1]], { walk: true, sil: '#B9ADA3' });
  s += person({ ...MULHER, x: 540, y: 1270, s: 2.1, look: lerp(-0.2, 1, E.inOut(prog(t, seg(6), seg(6) + 0.6))), mood: hope ? 'calm' : 'sad', noShadow: true });
  return { svg: cam(s, 540, 1100, 1.0 + 0.06 * E.inOut(prog(t, at(6), at(8)))), html: '' };
}

// ---------------------------------------------------------------- 7. por trás, no meio do povo
function scToque(t) {
  const tt = wordTime(8, 'tocou'), go = E.inOut(prog(t, seg(8), tt - 0.6)), reach = E.out(prog(t, tt - 0.6, tt));
  const jx = lerp(560, 640, prog(t, at(8), tt));
  let s = RUA(t, 60 + t * 8);
  s += povo(t, [[150, 1150, 0.85, 3171, 1], [380, 1140, 0.85, 3172, 1], [820, 1140, 0.85, 3173, -1], [1000, 1150, 0.85, 3174, -1]], { walk: true });
  s += person({ ...JESUS, x: jx, y: 1215, s: 1.25, walk: t < tt ? t * 5 : null, look: 0.6 });
  s += person({ ...MULHER, x: lerp(120, jx - 170, go), y: 1215, s: 1.25, walk: go < 1 ? t * 6 : null, kneel: go >= 1, look: 1, mood: 'calm', armR: go >= 1 ? lerp(10, 42, reach) : 14 });
  return { svg: cam(s, lerp(480, jx - 70, reach), lerp(1110, 1150, reach), 1.0 + 0.25 * E.inOut(prog(t, tt - 0.8, tt + 0.4))), html: '' };
}

// ---------------------------------------------------------------- 8. o sangue parou
function scCura(t) {
  const healed = E.inOut(prog(t, seg(9) + 0.2, seg(9) + 0.9));
  let s = RUA(t, 80);
  s += povo(t, [[200, 1150, 0.8, 3181, 1], [880, 1150, 0.8, 3182, -1]], { sil: '#B9ADA3' });
  s += person({ ...MULHER, x: 540, y: 1250, s: 2.1, kneel: true, look: 0.2, mood: healed > 0.5 ? 'closed' : 'fear', noShadow: true, t });
  return { svg: cam(s, 540, 1100, 1.0 + 0.05 * healed), html: '' };
}

// ---------------------------------------------------------------- 9. Jesus parou também
function scParou(t) {
  const turn = E.inOut(prog(t, seg(10) + 0.2, seg(10) + 0.8));
  let s = RUA(t, 100);
  s += povo(t, [[150, 1150, 0.85, 3171, 1], [380, 1140, 0.85, 3172, 1], [820, 1140, 0.85, 3173, -1], [1000, 1150, 0.85, 3174, -1]]);
  s += person({ ...JESUS, x: 640, y: 1240, s: 1.25, walk: t < seg(10) ? t * 5 : null, look: lerp(0.6, -1, turn), flip: turn > 0.5 });
  s += person({ ...MULHER, x: 440, y: 1240, s: 1.25, kneel: true, look: 1, mood: 'closed' });
  return { svg: cam(s, 560, 1100, 1.05 + 0.08 * turn), html: '' };
}

// ---------------------------------------------------------------- 10. quem tocou?
function scQuem(t) {
  const lk = Math.sin((t - seg(11)) * 3.2);
  let s = RUA(t, 140);
  s += povo(t, [[160, 1150, 0.8, 3191, 1], [900, 1150, 0.8, 3192, -1]], { sil: '#B9ADA3' });
  s += person({ ...JESUS, x: 540, y: 1270, s: 2.1, look: lk, mood: 'calm', noShadow: true });
  return { svg: cam(s, 540, 1100, 1.0 + 0.05 * E.inOut(prog(t, at(11), at(12)))), html: '' };
}

// ---------------------------------------------------------------- 11. os discípulos estranharam
function scDiscipulos(t) {
  const wide = E.out(prog(t, seg(13) - 0.1, seg(13) + 0.5));
  let s = RUA(t, 160);
  s += povo(t, [[110, 1150, 0.85, 3201, 1], [300, 1140, 0.85, 3202, 1], [800, 1140, 0.85, 3203, -1], [990, 1150, 0.85, 3204, -1]]);
  s += person({ ...JESUS, x: 360, y: 1250, s: 1.25, look: 1, mood: 'calm' });
  s += person({ ...PEDRO, x: 720, y: 1250, s: 1.25, look: -1, flip: true, mood: t > seg(13) ? 'happy' : 'calm', armL: lerp(14, 110, wide), armR: lerp(14, 110, wide) });
  return { svg: cam(s, 540, 1110, 1.02 + 0.05 * E.inOut(prog(t, at(12), at(14)))), html: '' };
}

// ---------------------------------------------------------------- 12. ele sabia; continuou procurando
function scProcura(t) {
  const pan = E.inOut(prog(t, seg(15) - 0.3, seg(15) + 1.0));
  let s = RUA(t, 180);
  s += povo(t, [[120, 1150, 0.85, 3211, 1], [520, 1140, 0.85, 3212, 0], [980, 1150, 0.85, 3213, -1]]);
  s += person({ ...JESUS, x: 760, y: 1250, s: 1.25, look: lerp(0.4, -1, pan), flip: true, mood: 'calm' });
  s += person({ ...MULHER, x: 250, y: 1250, s: 1.25, kneel: true, look: 1, mood: pan > 0.6 ? 'fear' : 'closed', t });
  return { svg: cam(s, lerp(700, 340, pan), 1100, 1.05 + 0.12 * pan), html: '' };
}

// ---------------------------------------------------------------- 13. veio tremendo e contou tudo
function scTremendo(t) {
  const fall = wordTime(16, 'caiu'), go = E.inOut(prog(t, seg(16), fall)), all = E.out(prog(t, seg(17), seg(17) + 0.8));
  let s = RUA(t, 200);
  s += povo(t, [[90, 1140, 0.85, 3221, 1], [300, 1130, 0.85, 3222, 1], [800, 1130, 0.85, 3223, -1], [1000, 1140, 0.85, 3224, -1]]);
  s += person({ ...JESUS, x: 700, y: 1250, s: 1.25, look: -1, flip: true, mood: 'calm' });
  s += person({ ...MULHER, x: lerp(200, 520, go), y: 1250, s: 1.25, walk: go < 1 ? t * 6 : null, kneel: go >= 1, lean: go >= 1 ? 14 : 0, look: 1, mood: 'fear', shake: 4, t, armL: go >= 1 ? 40 : 14, armR: go >= 1 ? 40 : 14 });
  return { svg: cam(s, lerp(450, 600, go), 1110, 1.05 + 0.1 * all), html: '' };
}

// ---------------------------------------------------------------- 14. pela lei (Levítico 15)
function scLei(t) {
  const open = E.out(prog(t, seg(18) - 0.1, seg(18) + 0.9));
  let s = `<rect width="${W}" height="${H}" fill="#2B2420"/>`;
  s += `<circle cx="540" cy="900" r="620" fill="url(#gAmber)" opacity="0.35"/>`;
  s += `<rect x="-40" y="1120" width="${W + 80}" height="${H}" fill="${C.wood}" ${ink(6, OL)}/>`;
  s += rolo(540, 880, 0.15 + 0.85 * open);
  return { svg: cam(s, 540, 900, 1.0 + 0.06 * E.inOut(prog(t, at(18), at(19)))), html: '' };
}

// ---------------------------------------------------------------- 15. aconteceu o contrário
function scContrario(t) {
  const hand = E.inOut(prog(t, wordTime(20, 'cura') - 0.2, wordTime(20, 'ela')));
  let s = RUA(t, 220);
  s += povo(t, [[100, 1140, 0.85, 3231, 1], [320, 1130, 0.85, 3232, 1], [820, 1130, 0.85, 3233, -1], [1000, 1140, 0.85, 3234, -1]]);
  s += person({ ...JESUS, x: 680, y: 1235, s: 1.3, look: -1, flip: true, mood: 'calm', armR: lerp(14, 58, hand) });
  s += person({ ...MULHER, x: 480, y: 1235, s: 1.3, kneel: true, lean: lerp(14, 0, hand), look: lerp(0, 1, hand), mood: hand > 0.5 ? 'happy' : 'fear', t });
  return { svg: cam(s, 580, 1110, 1.12 + 0.08 * E.inOut(prog(t, at(19), at(21)))), html: '' };
}

// ---------------------------------------------------------------- 16. "Filha, a sua fé a curou"
function scFilha(t) {
  const filha = t > seg(23) - 0.1, up = E.inOut(prog(t, seg(23) + 2.0, seg(23) + 2.8));
  let s = RUA(t, 240);
  s += povo(t, [[150, 1150, 0.8, 3241, 1], [920, 1150, 0.8, 3242, -1]], { sil: '#C9BFB6' });
  s += person({ ...JESUS, x: 690, y: 1260, s: 1.75, look: -1, flip: true, mood: filha ? 'happy' : 'calm', armR: filha ? 50 : 14, noShadow: true });
  s += person({ ...MULHER, x: 380, y: 1260, s: 1.75, kneel: up < 0.5, look: 1, mood: filha ? 'happy' : 'calm', noShadow: true });
  return { svg: cam(s, 540, 1100, 1.0 + 0.08 * E.inOut(prog(t, at(21), at(24)))), html: '' };
}

// ---------------------------------------------------------------- 17. a única pessoa
function scUnica(t) {
  let s = RUA(t, 260);
  s += povo(t, [[180, 1150, 0.8, 3251, 1], [900, 1150, 0.8, 3252, -1]], { sil: '#C9BFB6' });
  s += person({ ...MULHER, x: 540, y: 1270, s: 2.1, look: 0, mood: 'happy', noShadow: true });
  return { svg: cam(s, 540, 1100, 1.0 + 0.06 * E.inOut(prog(t, at(24), at(25)))), html: '' };
}

// ---------------------------------------------------------------- 18. chegou impura, saiu filha (a rua do começo)
function scSaiu(t) {
  let s = RUA(t, 300 + t * 6);
  s += povo(t, [[150, 1150, 0.85, 3111, 1], [930, 1150, 0.85, 3112, -1]]);
  s += person({ ...man(3113), x: 330, y: 1225, s: 1.2, look: 1, walk: t * 4 + 1, mood: 'happy' });
  s += person({ ...man(3114), x: 730, y: 1225, s: 1.2, look: -1, walk: t * 4 + 2, mood: 'happy' });
  s += person({ ...MULHER, x: 530, y: 1235, s: 1.3, mood: 'happy', look: 0.3, walk: t * 4 });
  return { svg: cam(s, 540, 1100, 1.15 - 0.08 * E.inOut(prog(t, at(25), at(26)))), html: '' };
}

// ---------------------------------------------------------------- 19. aproxime-se de Jesus
function scAproxime(t) {
  const a0 = at(26), open = E.out(prog(t, seg(26) + 1.4, seg(26) + 2.4));
  let s = `<rect width="${W}" height="${H}" fill="url(#skySunrise)"/>` + sun(540, 900, 80, t);
  s += hills(GROUND - 100, 60, 0.0032, 21, '#E9C9A9') + floor('day', 0, GROUND);
  s += person({ ...JESUS, x: 540, y: 1260, s: 1.6, look: 0, mood: 'happy', armL: lerp(14, 55, open), armR: lerp(14, 55, open) });
  return { svg: cam(s, 540, 1000, 1.0 + 0.18 * E.inOut(prog(t, a0, AUDIO_END + 0.2))), html: '' };
}

// ---------------------------------------------------------------- 20. fim
// Sem o cartão do app: o vídeo entra no Programa de Recompensas sem divulgação comercial.
const scFim = (t) => endCard(t, AUDIO_END + 0.2, ['Marcos 5', 'Lucas 8'], { semApp: true });

// ---------------------------------------------------------------- linha do tempo
const SCENES = [
  { a: 0, b: at(1), f: scGancho, ref: 'Levítico 15:19, 25' },
  { a: at(1), b: at(2), f: scMao, ref: null },
  { a: at(2), b: at(3), f: scDoze, ref: 'Marcos 5:25', dark: true },
  { a: at(3), b: at(5), f: scMedicos, ref: 'Marcos 5:26' },
  { a: at(5), b: at(6), f: scMultidao, ref: 'Marcos 5:24' },
  { a: at(6), b: at(8), f: scPensou, ref: 'Marcos 5:28' },
  { a: at(8), b: at(9), f: scToque, ref: 'Lucas 8:44' },
  { a: at(9), b: at(10), f: scCura, ref: 'Marcos 5:29' },
  { a: at(10), b: at(11), f: scParou, ref: null },
  { a: at(11), b: at(12), f: scQuem, ref: 'Marcos 5:30' },
  { a: at(12), b: at(14), f: scDiscipulos, ref: 'Marcos 5:31' },
  { a: at(14), b: at(16), f: scProcura, ref: 'Marcos 5:30, 32' },
  { a: at(16), b: at(18), f: scTremendo, ref: 'Marcos 5:33; Lucas 8:47' },
  { a: at(18), b: at(19), f: scLei, ref: 'Levítico 15:19', dark: true },
  { a: at(19), b: at(21), f: scContrario, ref: null },
  { a: at(21), b: at(24), f: scFilha, ref: 'Lucas 8:48' },
  { a: at(24), b: at(25), f: scUnica, ref: null },
  { a: at(25), b: at(26), f: scSaiu, ref: null },
  { a: at(26), b: AUDIO_END + 0.2, f: scAproxime, ref: 'Tiago 4:8' },
  { a: AUDIO_END + 0.2, b: DURATION + 1, f: scFim, ref: null, end: true },
];
