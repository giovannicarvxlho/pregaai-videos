// Arte das capas e miniaturas do episódio (carregada depois de data.js, lib.js, capa-lib.js e scenes.js), com as
// funções das cenas. Só o que o vídeo mostra; Jesus só em silhueta, na cruz, de longe ou com luz atrás.
// Miniaturas do longo (três motivos e três layouts, 12/11/2026):
// A (espetáculo): a cruz em silhueta com a luz estourando atrás e os anéis do grito (Mateus 27:46). Texto à esquerda:
//   DEUS / ABANDONOU / JESUS? (texto do Giovanni, 13/11/2026).
// B (confronto): um mestre da lei zombando, de perto, e a cruz do outro lado (Mateus 27:41-43). Texto à direita.
// C (curiosidade): o rolo do salmo com a primeira linha acesa e a sombra da cruz em cima (Salmo 22:1). Texto à
//   esquerda, embaixo.
// Capas verticais (TikTok e Instagram): o nome no terço de cima, sempre na mesma posição; o herói no miolo 3:4.
const CHUNKS = buildChunks(SEGS); // as funções de cena usam wordTime
const T = 2.0;
const zoom = (g, cx, cy, z, px = cx, py = cy) => `<g transform="translate(${px} ${py}) scale(${z}) translate(${-cx} ${-cy})">${g}</g>`;
// Anéis do grito em volta de (x, y).
const aneis = (x, y, r0, cor = '#FFD9A0', n = 3) => [...Array(n).keys()].map((k) => `<circle cx="${x}" cy="${y}" r="${r0 + k * r0 * 0.62}" fill="none" stroke="${cor}" stroke-width="${12 - k * 3}" opacity="${f1((0.6 - k * 0.16) * 100) / 100}"/>`).join('');

// A: a cruz em silhueta, grande, com a luz quente estourando atrás da cabeça e os anéis do grito.
function cruzGrito(o = {}) {
  const CX = o.cx ?? 1300, BASE = o.base ?? 1200, S = o.s ?? 2.0, HY = BASE - 442 * S;
  let s = capaFundo([[0, '#04050A'], [0.5, '#120D10'], [0.8, '#3A160C'], [1, '#5A220C']]);
  s += capaLuz(CX, HY, 900, '#FF6A13', 0.95) + capaRaios(CX, HY, 1500, 16, '#FFB347', 0.2, 6);
  s += capaLuz(CX, HY, 330, '#FFE6B0', 0.95) + capaLuz(CX, HY, 150, '#FFFFFF', 1);
  s += aneis(CX, HY, o.r0 ?? 230);
  s += hill(CX, BASE - 60, 1500, '#060404', '#000');
  // só a cruz da esquerda: o canto de baixo à direita fica livre (a duração do YouTube cobre)
  if (o.lados !== false) s += crossFig(CX - 620, BASE + 20, S * 0.45, { fill: '#040303', rim: '#B5461A', bow: 0.35 });
  s += crossFig(CX, BASE, S, { plaque: true, fill: '#030202', rim: '#FF8A3C', bow: 0 });
  s += capaMotas(CX - 700, 60, 1400, 700, 30, 22, '#FFC98A', 0.7);
  return s;
}
function artA() {
  let s = cruzGrito({ cx: 1330, base: 1210, s: 2.0 });
  s += capaVinheta(0.6, '65%', '35%', '80%');
  s += capaTexto([{ t: 'DEUS', w: 470 }, { t: 'ABANDONOU', w: 800 }, { t: 'JESUS?', w: 900, fill: 'ouro' }], { x: 70, y: 150, gap: 0.1, rot: -2 });
  return s;
}
// B: um mestre da lei zombando (Mateus 27:41-43), de perto, à esquerda; a cruz em silhueta do outro lado, na luz.
function artB() {
  const M = MESTRE(1304);
  let s = capaFundo([[0, '#07060B'], [0.55, '#1A0F14'], [1, '#4A1A0E']]);
  s += capaLuz(1450, 470, 640, '#FF6A13', 0.9) + capaRaios(1450, 430, 1200, 12, '#FFB347', 0.16, 3);
  s += hill(1450, 760, 900, '#070505', '#000') + crossFig(1450, 790, 1.05, { plaque: true, fill: '#030202', rim: '#FF8A3C', bow: 0.3 });
  s += capaMotas(1000, 80, 900, 600, 22, 31, '#FFC98A', 0.6);
  s += retrato({ ...M, x: 560, y: 600, s: 1.55, mood: 'culpa', look: [0.8, -0.1], lado: 1, luz: '#FF9A4A', id: 'b1' });
  s += capaVinheta(0.5, '50%', '45%', '85%');
  s += capaTexto([{ t: 'ZOMBARAM DE', w: 760 }, { t: 'JESUS', w: 760, fill: 'ouro' }], { x: 1870, y: 40, anchor: 'end', gap: 0.1, rot: 2 });
  return s;
}
// C: o rolo do salmo aberto, à luz da lamparina, com a primeira linha acesa e a sombra da cruz por cima.
function artC() {
  let s = capaFundo([[0, '#0A0706'], [0.6, '#1E140E'], [1, '#2E1C10']]);
  s += capaLuz(1250, 430, 900, '#FFB52E', 0.7);
  s += `<g transform="translate(1250 520) rotate(-8) scale(1.25) translate(-1080 -560)">` + rolo({ x0: 640, x1: 1520, y: 560, h: 520, destaque: 1, colW: 330, linhas: 8, seed: 7 }) + `</g>`;
  // a sombra da cruz que cai sobre o rolo
  s += `<g opacity="0.55">${crossFig(1300, 1140, 1.45, { fill: '#1A0E08', body: true, bow: 0 })}</g>`;
  s += capaLuz(900, 300, 260, '#FFF1C8', 0.5);
  s += capaMotas(700, 80, 1200, 900, 34, 12, '#FFE3A8', 0.7);
  s += capaVinheta(0.62, '60%', '45%', '80%');
  s += capaTexto([{ t: 'SALMO 22', w: 960, fill: 'ouro' }, { t: 'SÉCULOS ANTES', w: 860 }], { x: 60, y: 520, gap: 0.12, rot: -2 });
  return s;
}

// ---------- capas verticais (desenho na janela do meio, x 656 a 1264) ----------
// Longo no TikTok: a cruz do grito no meio.
const vCruz = () => cruzGrito({ cx: 960, base: 1150, s: 1.15, r0: 150, lados: false }) + capaVinheta(0.45, '50%', '55%', '80%');
// Curto 1 ("Jesus, um Filho abandonado pelo Pai?"): a cruz de perto, no frio da noite, com uma luz fraca que
// vem de cima e não chega até ela.
function vFilho() {
  let s = capaFundo([[0, '#04060B'], [0.55, '#0D1420'], [1, '#1A2433']]);
  s += capaLuz(960, 120, 640, '#9CC0FF', 0.45) + capaRaios(960, 60, 1100, 10, '#BFD4FF', 0.12, 4, 60, 120);
  s += hill(960, 1040, 1300, '#070A10', '#000') + crossFig(960, 1080, 1.55, { plaque: true, fill: '#020305', rim: '#8FB0E6', bow: 0.3 });
  return s + capaVinheta(0.5, '50%', '50%', '85%');
}
// Curto 2: a cruz no fim da tarde, com os anéis do grito.
function vGrito() {
  let s = capaFundo([[0, '#0B0710'], [0.5, '#2A1218'], [0.8, '#7A2E14'], [1, '#B4461A']]);
  s += capaLuz(960, 420, 700, '#FFB347', 0.8) + aneis(960, 450, 140, '#FFE0B0') + capaLuz(960, 450, 120, '#FFFFFF', 0.9);
  s += hill(960, 1040, 1300, '#0A0605', '#000') + crossFig(960, 1070, 1.4, { plaque: true, fill: '#030202', rim: '#FF8A3C', bow: 0 });
  return s + capaVinheta(0.4, '50%', '50%', '85%');
}
// Curto 3 ("Você já se sentiu abandonado por Deus?"): alguém sentado sozinho no escuro, e, ao longe, a cruz com
// a luz quente do fim do salmo.
function vSozinho() {
  let s = capaFundo([[0, '#05060B'], [0.6, '#11141C'], [1, '#1E1A22']]);
  s += capaLuz(1130, 300, 420, '#FFB347', 0.7) + hill(1130, 520, 700, '#0A0C10', '#000') + crossFig(1130, 540, 0.5, { plaque: true, fill: '#030202', rim: '#FF8A3C', bow: 0.2 });
  s += `<rect x="0" y="900" width="1920" height="300" fill="#08090C"/>`;
  s += sentado({ ...povo(1041), x: 900, y: 790, s: 1.9, rock: '#262A30', mood: 'sad', look: 0.4, rim: '#FF9A4A' });
  return s + capaVinheta(0.5, '45%', '55%', '85%');
}
// Curto 3: quem estava perto da cruz aponta para o alto ("está chamando Elias", Mateus 27:47).
function vElias() {
  let s = capaFundo([[0, '#05060B'], [0.6, '#121722'], [1, '#2A2230']]);
  s += capaLuz(1100, 330, 520, '#FF8A3C', 0.85) + aneis(1100, 300, 110, '#FFD9A0', 2);
  s += hill(1100, 640, 900, '#0A0C10', '#000') + crossFig(1100, 660, 0.85, { plaque: true, fill: '#030202', rim: '#FF8A3C', bow: 0.2 });
  s += person({ ...povo(1031), x: 830, y: 920, s: 1.6, look: 1, mood: 'fear', t: 0.3, armR: 160, rim: '#FF9A4A' });
  s += person({ ...povo(1032), x: 1060, y: 945, s: 1.5, look: 1, mood: 'fear', t: 0.7, armL: 20, armR: 40, rim: '#FF9A4A' });
  return s + capaVinheta(0.45, '50%', '55%', '85%');
}
