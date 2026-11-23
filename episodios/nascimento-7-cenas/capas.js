// Arte das capas e miniaturas do episódio (carregada depois de data.js, lib.js, capa-lib.js e scenes.js), com as
// peças das cenas. Só o que o vídeo mostra; Jesus bebê na manjedoura, na luz, e na cruz só em silhueta.
// Miniaturas do longo (três motivos e três layouts, 12/11/2026):
// A (espetáculo): a estrela que para sobre a casa em Belém, com os magos em silhueta (Mateus 2:9). Texto à esquerda:
//   O NATAL EM / 7 CENAS.
// B (confronto): Herodes de perto, com raiva, e o menino na manjedoura, na luz, do outro lado (Mateus 2:16). Texto à direita:
//   HERODES / X JESUS.
// C (curiosidade): a manjedoura acesa e, do outro lado, a cruz com a placa (Mateus 2:2; 27:37). Texto embaixo à esquerda:
//   DO BERÇO / À CRUZ.
// Capas verticais (TikTok e Instagram): o nome no terço de cima, sempre na mesma posição; o herói no miolo 3:4.
const CHUNKS = buildChunks(SEGS);
const T = 2.0;
const coroaCapa = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M -150 60 L -170 -120 L -80 -20 L 0 -150 L 80 -20 L 170 -120 L 150 60 Z" fill="#FFD21E" stroke="${CAPA.ink}" stroke-width="16" stroke-linejoin="round"/><circle cx="0" cy="10" r="22" fill="#C0392B" stroke="${CAPA.ink}" stroke-width="8"/></g>`;

// A: a estrela grande, com raios, sobre a casa de Belém; os magos em silhueta embaixo.
function estrelaGrande(o = {}) {
  const X = o.x ?? 1300, Y = o.y ?? 330, S = o.s ?? 2.6;
  let s = capaFundo([[0, '#04060C'], [0.55, '#0C1424'], [0.85, '#1C2538'], [1, '#2A2A34']]);
  s += stars(T, 120, 11, 900, 0.9);
  s += capaLuz(X, Y, 900, '#FFB347', 0.55) + capaRaios(X, Y, 1600, 18, '#FFE6B0', 0.22, 4);
  s += capaLuz(X, Y, 360, '#FFF1C8', 0.95) + estrela(X, Y, S, T, { glow: 0.9, ol: CAPA.ink });
  s += beam(X, Y + 80, X, 900, 40, 320, 0.5);
  s += hills(760, 60, 0.004, 9, '#0E1118') + `<rect x="-200" y="820" width="2400" height="400" fill="#0B0D12"/>`;
  s += vila(X - 40, 860, 1.0, { noite: true, luzes: true, casas: [[-260, 140, 150], [-90, 190, 150], [80, 150, 160], [250, 120, 130]] });
  MAGOS.forEach((m, i) => (s += person({ ...m, x: (o.mx ?? 540) - i * 190, y: 1010 - i * 10, s: 1.35 - i * 0.06, look: 1, sil: '#05060A', rim: '#C9A35A', noShadow: true })));
  return s;
}
function artA() {
  let s = estrelaGrande({ x: 1330, y: 330, s: 2.7, mx: 820 });
  s += capaVinheta(0.55, '65%', '35%', '85%');
  s += capaTexto([{ t: 'O NATAL EM', w: 760 }, { t: '7 CENAS', w: 820, fill: 'ouro' }], { x: 60, y: 90, gap: 0.1, rot: -2 });
  return s;
}
// A manjedoura acesa, de perto (o herói das capas verticais e das miniaturas B e C).
function berco(x, base, s, luz = 1) {
  let g = capaLuz(x, base - 260 * s, 760 * s, '#FFB347', 0.85 * luz) + capaLuz(x, base - 240 * s, 330 * s, '#FFF1C8', 0.9 * luz);
  g += capaRaios(x, base - 260 * s, 1100 * s, 14, '#FFE6B0', 0.16 * luz, 3);
  g += manjedoura(x, base, s, { bebe: true, ol: CAPA.ink });
  return g;
}
// B: Herodes de perto, com raiva; do outro lado, o menino na manjedoura, na luz.
function artB() {
  let s = capaFundo([[0, '#07060B'], [0.55, '#1A0F14'], [1, '#3A1A0E']]);
  s += berco(1450, 930, 1.55);
  s += capaMotas(1050, 100, 850, 600, 22, 31, '#FFC98A', 0.6);
  s += retrato({ ...HERODES, robe: '#7A2E3A', cover: null, x: 560, y: 600, s: 1.5, mood: 'raiva', look: [0.8, 0.1], lado: 1, luz: '#FF9A4A', id: 'b1' });
  s += coroaCapa(560, 600 - 200 * 1.5 - 40, 1.25);
  s += capaVinheta(0.5, '50%', '45%', '85%');
  s += capaTexto([{ t: 'HERODES', w: 800 }, { t: 'X JESUS', w: 760, fill: 'ouro' }], { x: 1870, y: 40, anchor: 'end', gap: 0.1, rot: 2 });
  return s;
}
// C: a manjedoura acesa no meio; a cruz com a placa no alto, à direita; o texto à esquerda, no alto.
function artC() {
  let s = capaFundo([[0, '#0A0706'], [0.55, '#1E140E'], [1, '#2E1C10']]);
  s += capaLuz(1640, 260, 480, '#FF6A13', 0.6) + hill(1640, 560, 520, '#0A0605', '#000');
  s += crossFig(1640, 610, 0.85, { plaque: true, fill: '#030202', rim: '#FF8A3C', bow: 0.2 });
  s += berco(1080, 1000, 1.6);
  s += capaMotas(200, 80, 1500, 700, 30, 12, '#FFE3A8', 0.6);
  s += capaVinheta(0.55, '55%', '50%', '85%');
  s += capaTexto([{ t: 'DO BERÇO', w: 720 }, { t: 'À CRUZ', w: 640, fill: 'ouro' }], { x: 110, y: 100, gap: 0.1, rot: -2 });
  return s;
}

// ---------- capas verticais (desenho na janela do meio, x 656 a 1264) ----------
// Longo no TikTok: a manjedoura acesa e a estrela em cima.
function vNatal() {
  let s = capaFundo([[0, '#04060C'], [0.55, '#0C1424'], [1, '#1E1A22']]);
  s += stars(T, 60, 13, 700, 0.8);
  s += capaLuz(960, 560, 360, '#FFF1C8', 0.5) + estrela(960, 560, 1.05, T, { glow: 0.8 });
  s += berco(960, 1000, 1.1);
  return s + capaVinheta(0.45, '50%', '55%', '85%');
}
// Curto 1: a cruz com a placa e a estrela em cima.
function vRei() {
  let s = capaFundo([[0, '#05060B'], [0.6, '#121722'], [1, '#3A1A0E']]);
  s += capaLuz(960, 560, 300, '#FFF1C8', 0.5) + estrela(960, 560, 0.9, T, { glow: 0.7 });
  s += capaLuz(960, 820, 520, '#FF6A13', 0.6) + hill(960, 1010, 900, '#0A0605', '#000');
  s += crossFig(960, 1060, 0.85, { plaque: true, fill: '#030202', rim: '#FF8A3C', bow: 0.2 });
  return s + capaVinheta(0.45, '50%', '55%', '85%');
}
// Curto 2: só a manjedoura, na luz (Lucas não descreve o lugar).
function vLugar() {
  let s = capaFundo([[0, '#0A0706'], [0.6, '#1E140E'], [1, '#2E1C10']]);
  s += berco(960, 1000, 1.25);
  return s + capaVinheta(0.5, '50%', '55%', '85%');
}
// Curto 3: Simeão com o menino no colo, olhando para cima, na luz.
function vSimeao() {
  let s = capaFundo([[0, '#0A0706'], [0.6, '#20160F'], [1, '#33220F']]);
  s += capaLuz(960, 560, 620, '#FFB347', 0.8) + capaRaios(960, 420, 1100, 12, '#FFE6B0', 0.18, 2) + capaLuz(960, 520, 260, '#FFF1C8', 0.8);
  s += person({ ...SIMEAO, x: 960, y: 1080, s: 2.0, look: 0, mood: 'closed', armL: 60, armR: 70, rim: '#FFD9A0' });
  s += bebeColo(1018, 1080 - 290, 1.15, -12);
  return s + capaVinheta(0.45, '50%', '55%', '85%');
}
