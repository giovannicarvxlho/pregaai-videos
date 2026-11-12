// Arte das miniaturas do longo "As 7 frases de Jesus na cruz" (carregado depois de data.js, lib.js, capa-lib.js e
// scenes.js). Estilo novo de 12/11/2026: rosto em close do capa-lib.js, luz forte e texto branco e dourado.
// Três motivos e três layouts, só com o que o vídeo mostra. Jesus aparece sempre em silhueta, na cruz.
// Contorno de luz em volta de um grupo (o mesmo efeito do retrato(), para quando a figura leva peças por cima).
const sfContorno = (g, id, cor, lado = 1, cw = 14) => `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="${cw}" result="d"/><feOffset in="d" dx="${lado * cw * 0.9}" dy="${-cw * 0.4}" result="o"/><feFlood flood-color="${cor}"/><feComposite in2="o" operator="in" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter><g filter="url(#${id})">${g}</g>`;
// Véu de mulher por cima do retrato (cabeça de raio 200 em s = 1): deixa a testa e as sobrancelhas à mostra,
// o que o pano do retrato() não deixa. cor: o pano; lado: de onde vem a luz.
function sfVeu(x, y, s, cor, lado = 1) {
  const st = (w = 13) => `stroke="${CAPA.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  let g = `<path d="M -262 330 C -300 40 -290 -270 0 -278 C 290 -270 300 40 262 330 L 150 330 C 178 150 196 30 176 -52 C 150 -150 80 -182 0 -182 C -80 -182 -150 -150 -176 -52 C -196 30 -178 150 -150 330 Z" fill="${cor}" ${st()}/>`;
  g += `<path d="M ${-lado * 262} 330 C ${-lado * 300} 40 ${-lado * 290} -270 0 -278 C ${-lado * 150} -250 ${-lado * 214} -120 ${-lado * 206} 40 C ${-lado * 204} 150 ${-lado * 196} 250 ${-lado * 176} 330 Z" fill="#000" opacity="0.16"/>`;
  g += `<path d="M -176 -52 C -150 -150 -80 -182 0 -182 C 80 -182 150 -150 176 -52" fill="none" ${st(26)}/><path d="M -176 -52 C -150 -150 -80 -182 0 -182 C 80 -182 150 -150 176 -52" fill="none" stroke="${shade(cor, 0.8)}" stroke-width="12" stroke-linecap="round"/>`;
  g += `<path d="M ${lado * 236} 250 C ${lado * 262} 40 ${lado * 250} -200 ${lado * 60} -252" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity="0.55"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>`;
}
// O lado de dentro do véu, atrás da cabeça e do pescoço (vai antes do retrato).
const sfVeuFundo = (x, y, s, cor) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M -262 330 C -300 40 -290 -270 0 -278 C 290 -270 300 40 262 330 Z" fill="${shade(cor, 0.5)}"/></g>`;
// Cabelo curto por cima do retrato (com bald: true), com a testa e as sobrancelhas à mostra; emenda na barba.
function sfCabelo(x, y, s, cor, lado = -1) {
  const st = (w = 13, c = CAPA.ink) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  let g = `<path d="M -212 34 C -240 -190 -124 -266 0 -266 C 124 -266 240 -190 212 34 C 200 -40 182 -96 150 -136 C 110 -112 50 -176 0 -172 C -56 -176 -104 -116 -150 -136 C -182 -96 -200 -40 -212 34 Z" fill="${cor}" ${st()}/>`;
  // mechas: riscos escuros que descem do alto até a franja
  [[-120, -226, -150, -150], [-52, -256, -70, -182], [20, -262, 14, -186], [88, -246, 104, -160], [150, -206, 170, -140]].forEach(([x1, y1, x2, y2]) => (g += `<path d="M ${x1} ${y1} Q ${(x1 + x2) / 2 + 10} ${(y1 + y2) / 2} ${x2} ${y2}" fill="none" ${st(9, shade(cor, 0.62))}/>`));
  g += `<path d="M ${lado * 176} -150 C ${lado * 150} -210 ${lado * 96} -238 ${lado * 30} -244" fill="none" ${st(12, shade(cor, 1.9))} opacity="0.6"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>`;
}
// Fio de lágrima que desce do olho pela bochecha, com a gota na ponta.
function sfLagrima(x, y, s, len = 150, sc = 1.5) {
  return `<path d="M ${x} ${y} C ${x - 6 * s} ${y + len * 0.4 * s} ${x + 8 * s} ${y + len * 0.7 * s} ${x} ${y + len * s}" fill="none" stroke="${CAPA.ink}" stroke-width="${30 * s}" stroke-linecap="round"/><path d="M ${x} ${y} C ${x - 6 * s} ${y + len * 0.4 * s} ${x + 8 * s} ${y + len * 0.7 * s} ${x} ${y + len * s}" fill="none" stroke="#8FD0FF" stroke-width="${17 * s}" stroke-linecap="round"/>` + capaGota(x, y + (len + 26) * s, sc * s);
}
// N1 (emoção, sobe primeiro): Maria, a mãe de Jesus, chorando perto da cruz (João 19:25-27, a 3ª frase).
//     Rosto à esquerda, as três cruzes na luz vermelha à direita, o "7" e o texto embaixo, à direita.
function artN1(o = {}) {
  const CX = 1330, TOPO = 548;
  let s = capaFundo([[0, '#090205'], [0.42, '#2B060B'], [0.74, '#74100F'], [1, '#A81C14']]);
  s += capaLuz(CX, 320, 760, '#FF3B2F', 0.8) + capaLuz(CX, 290, 340, '#FFC46B', 0.9) + capaRaios(CX, 290, 1000, 14, '#FF9A6B', 0.13, 6);
  s += hill(CX, TOPO, 980, '#0A0405', '#000');
  s += crossFig(CX - 330, TOPO + 50, 0.5, { fill: '#050203', rim: '#9E1F16', bow: 0.35 }) + crossFig(CX + 330, TOPO + 50, 0.5, { fill: '#050203', rim: '#9E1F16', bow: 0.35 });
  s += crossFig(CX, TOPO + 18, 0.84, { plaque: true, fill: '#050203', rim: '#FF9A4A', bow: 1 });
  s += capaMotas(860, 60, 1000, 480, 26, 31, '#FFC9A0', 0.7);
  const MX = 468, MY = 650, MS = 1.58;
  let m = sfVeuFundo(MX, MY, MS, MARIA.cover) + retrato({ ...MARIA, cover: null, bald: true, x: MX, y: MY, s: MS, mood: 'choro', look: [0.6, -0.35], lado: 1, luz: '#FF8A5C', id: 'sf1', contorno: 0 });
  m += sfVeu(MX, MY, MS, MARIA.cover, 1);
  s += sfContorno(m, 'sf1k', '#FF8A5C', 1, 14);
  s += capaVinheta(0.55, '58%', '42%', '82%');
  s += capaTexto([{ t: '7', size: 500, fill: 'ouro', traco: 0.07 }], { x: 876, y: 566 });
  s += capaTexto([{ t: 'ÚLTIMAS', w: 690 }, { t: 'FRASES', w: 690, fill: 'ouro' }], { x: 1156, y: 640, gap: 0.1 });
  return s;
}
// N2 (confronto): o criminoso que pediu "lembra-te de mim" ouve a 2ª frase, "Hoje você estará comigo no paraíso"
//     (Lucas 23:39-43). Ele de perto, à direita, virado para a cruz do meio, que fica na luz, em silhueta.
function artN2(o = {}) {
  const LX = 300, LY = 330, X = 1440, Y = 650, S = 1.7;
  const HAIR = '#5A3A28', skin = '#C68B59', wood = '#4A2F1E', OL = CAPA.ink;
  let s = capaFundo([[0, '#020709'], [0.55, '#06222A'], [1, '#0D3F45']]);
  s += capaLuz(LX, LY, 980, '#FFC24A', 0.9) + capaRaios(LX, LY, 1700, 16, '#FFE9A8', 0.2, 5) + capaLuz(LX, LY - 20, 400, '#FFFFFF', 0.9);
  s += hill(LX, 700, 760, '#030708', '#000');
  s += crossFig(LX, 730, 1.02, { plaque: true, fill: '#020405', bow: 0.15 });
  s += capaMotas(40, 60, 1100, 600, 30, 12, '#FFF0C0', 0.85);
  // a cruz dele: o poste atrás da cabeça e a trave na altura do rosto (os ombros ficam fora do quadro)
  s += `<g transform="translate(${X} ${Y}) scale(${S})"><rect x="-78" y="-700" width="156" height="1500" fill="${wood}" stroke="${OL}" stroke-width="13"/>`;
  s += `<rect x="-400" y="-96" width="1200" height="150" fill="${wood}" stroke="${OL}" stroke-width="13"/><rect x="-400" y="16" width="1200" height="38" fill="#000" opacity="0.28"/></g>`;
  let m = retrato({ skin, hair: HAIR, beard: true, bald: true, robe: shade(skin, 0.92), x: X, y: Y, s: S, mood: 'espanto', look: [-0.85, -0.3], lado: -1, luz: '#FFD27A', id: 'sf2', contorno: 0 });
  m += sfCabelo(X, Y, S, HAIR, -1);
  m += capaGota(X - 84 * S - 10, Y + 70 * S, 2.1) + capaGota(X + 84 * S + 26, Y + 96 * S, 1.6);
  s += sfContorno(m, 'sf2k', '#FFD27A', -1, 14);
  s += capaVinheta(0.6, '40%', '42%', '85%');
  s += capaTexto([{ t: 'HOJE NO', w: 640 }, { t: 'PARAÍSO', w: 820, fill: 'ouro' }], { x: 64, y: 640, gap: 0.1 });
  return s;
}
// N3 (o grito, cartaz): a 4ª frase, "Meu Deus! Meu Deus! Por que me abandonaste?", nas trevas do meio-dia às três
//     (Mateus 27:45-46). A cruz do meio grande, em silhueta, no centro; o texto atravessa o alto do quadro.
function artN3(o = {}) {
  const CX = 960;
  let s = capaFundo([[0, '#04020B'], [0.5, '#170A31'], [0.82, '#431457'], [1, '#7A1E63']]);
  s += capaLuz(CX, 640, 820, '#D0308A', 0.7) + capaLuz(CX, 580, 340, '#FFC4E4', 0.75) + capaRaios(CX, 600, 1400, 16, '#E9A6FF', 0.1, 3);
  s += hill(CX, 930, 1500, '#05030A', '#000');
  s += crossFig(CX - 620, 1068, 0.62, { fill: '#030207', rim: '#6B2A8A', bow: 0.35 }) + crossFig(CX + 620, 1068, 0.62, { fill: '#030207', rim: '#6B2A8A', bow: 0.35 });
  s += crossFig(CX, 1130, 1.42, { plaque: true, fill: '#030207', rim: '#E08CFF', bow: 1 });
  s += capaMotas(200, 380, 1500, 500, 30, 44, '#F3C9FF', 0.6);
  s += capaVinheta(0.6, '50%', '60%', '80%');
  s += capaTexto([{ t: 'POR QUE ME', w: 900 }, { t: 'ABANDONASTE?', w: 1760, fill: 'ouro' }], { x: 960, y: 34, anchor: 'middle', gap: 0.08 });
  return s;
}
