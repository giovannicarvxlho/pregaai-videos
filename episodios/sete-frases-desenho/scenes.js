// As 7 frases na cruz em desenho animado, com diálogo (teste de formato de 2026-11-13).
// Peças do desenho em desenho-lib.js (carregado aqui; as funções dele só rodam dentro das cenas, depois de carregar).
// Cada cena começa e acaba nas falas (FALAS do data.js, gerado pelo tools/dialogo.py), nunca num segundo fixo.
document.write('<script src="desenho-lib.js"><\/script>');
// A referência do alto em branco com sombra: no desenho o céu é claro e o cinza da marca some.
document.head.insertAdjacentHTML('beforeend', '<style>.ref{color:#FFFFFF!important;font-weight:600!important;font-size:32px!important;text-shadow:0 2px 10px rgba(0,0,0,0.85)}</style>');

const FA = (i) => FALAS[i].a, FB = (i) => FALAS[i].b;
const FIM = DURATION;

// Personagens (a mesma pessoa tem sempre o mesmo rosto e a mesma roupa).
const P = {
  JESUS: { pele: '#C98E5E', cabelo: '#3B2416', penteado: 'longo', barba: 'cheia', olho: '#5A3A22', coroa: true, seed: 3 },
  CRIM1: { pele: '#B57A4B', cabelo: '#1E1A18', penteado: 'baguncado', barba: 'rala', olho: '#3A2A1E', cordas: true, seed: 5 },
  CRIM2: { pele: '#D7A06C', cabelo: '#5A3A24', penteado: 'curto', barba: 'curta', olho: '#6B4A2A', cordas: true, seed: 7 },
  SOLD1: { pele: '#D9A877', capacete: 'rom', barba: 'rala', cabelo: '#4A3020', roupa: '#A8322C', soldado: true, olho: '#4A6A8A', seed: 11 },
  SOLD2: { pele: '#E2B48A', capacete: 'rom', roupa: '#A8322C', soldado: true, olho: '#6B4A2A', cabelo: '#6B4A2A', seed: 13 },
  PASS: { pele: '#BF8656', pano: { cor: '#C9B28A', listra: '#7A5A3A', faixa: '#3A2A20' }, barba: 'curta', cabelo: '#2A1E16', roupa: '#8C7A5E', seed: 17 },
  SAC: { pele: '#D2A271', turbante: '#7A4A2A', barba: 'cheia', cabelo: '#8F887E', corBarba: '#9C958C', velho: true, roupa: '#E3D8C2', roupa2: '#8A5A3A', seed: 19 },
  MAE: { pele: '#CF9A6C', manto: '#7C6A58', cilios: true, roupa: '#B9A88E', cabelo: '#3A2618', olho: '#5A3A22', seed: 23 },
  DISC: { pele: '#D6A374', cabelo: '#4A2E1C', penteado: 'curto', roupa: '#6F7B4E', olho: '#5A3A22', seed: 29 },
  HOM1: { pele: '#C48A58', pano: { cor: '#B5A386', faixa: '#5A4030' }, barba: 'curta', cabelo: '#2E2018', roupa: '#9A7F5C', seed: 31 },
  HOM2: { pele: '#C99666', penteado: 'careca', cabelo: '#8A8278', barba: 'cheia', corBarba: '#8F887E', velho: true, roupa: '#7D6A55', seed: 37 },
  CENT: { pele: '#D4A070', capacete: 'cent', barba: 'curta', cabelo: '#3A2A1E', roupa: '#A8322C', soldado: true, medalhas: true, capa: '#8E2420', olho: '#5A3A22', seed: 41 },
};
// Cruzes no mundo: [x do pé, y do pé, escala]. A de Jesus no meio, os criminosos atrás e menores.
const CX = { J: [540, 1330, 0.6], E: [175, 1372, 0.44], D: [905, 1372, 0.44] };
// Centro da cabeça de quem está na cruz (para a câmera).
const cabecaCruz = (c, tilt = 6) => [c[0] + c[2] * tilt * 0.8, c[1] - c[2] * 766];
// Centro da cabeça de quem está de pé em (x, y) com escala s.
const cabecaPe = (x, y, s) => [x, y - 770 * s];
// Ponto do mundo na tela, para as etiquetas em HTML (mesma conta do camDes).
const naTela = (wx, wy, cx, cy, z) => [540 + (wx - cx) * z, 960 + (wy - cy) * z];
const DESF = '<filter id="desf" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>';

// Morte de Jesus: depois do "Pai, nas tuas mãos" a cabeça curva devagar e o desenho dele para (João 19:30).
const T_CURVA = () => FB(19) + 0.35;
function jesusEstado(t) {
  const cv = E.inOut(prog(t, T_CURVA(), T_CURVA() + 2.2));
  return t >= T_CURVA() ? { curva: cv, parado: cv >= 1, humor: 'sereno', pisca: cv > 0.5 ? 1 : 0, boca: 0 } : {};
}
// Escuro: do fim da fala à mãe até o grito; clareia um pouco no centurião.
const kEscuro = (t) => clamp(prog(t, FB(13) + 0.6, FB(13) + 2.6) - 0.35 * prog(t, FA(20) - 0.2, FIM));

// O Calvário inteiro: céu, morros, as três cruzes e quem está na frente. o.j / o.e / o.d sobrepõem Jesus e os
// criminosos (esquerda e direita); o.frente: SVG por cima das cruzes; o.desf: 'fundo' desfoca céu e morros,
// 'cruzes' desfoca também as cruzes (close em quem está no chão).
function golgota(t, o = {}) {
  const k = o.k ?? kEscuro(t);
  let fundo = ceuDes(k, t) + morroDes(k, o.racha || 0);
  let cruzes = toonCrucificado({ ...P.CRIM1, x: CX.E[0], y: CX.E[1], s: CX.E[2], t, humor: 'raiva', look: [0.7, 0], boca: bocaDe('CRIMINOSO1', t), tilt: -4, ...(o.e || {}) });
  cruzes += toonCrucificado({ ...P.CRIM2, x: CX.D[0], y: CX.D[1], s: CX.D[2], t, humor: t < FA(7) - 0.2 ? 'neutro' : 'triste', look: [-0.7, 0], boca: bocaDe('CRIMINOSO2', t), tilt: 4, ...(o.d || {}) });
  cruzes += toonCrucificado({ ...P.JESUS, x: CX.J[0], y: CX.J[1], s: CX.J[2], t, placa: true, humor: 'sereno', boca: bocaDe('JESUS', t), ...(o.j || {}), ...jesusEstado(t) });
  if (o.desf) fundo = `<g filter="url(#desf)">${fundo}${o.desf === 'cruzes' ? cruzes : ''}</g>`;
  return DESF + fundo + (o.desf === 'cruzes' ? '' : cruzes) + (o.frente || '') + trevasDes(k);
}
const pe = (base, x, y, s, extra = {}) => toonCorpo({ ...base, x, y, s, ...extra });
const etiqueta = (x, y, txt) => `<div style="position:absolute;left:${f1(x)}px;top:${f1(y)}px;transform:translateX(-50%);padding:10px 22px 12px;border-radius:30px;background:rgba(20,14,10,0.62);color:#F7F1E6;font:600 34px/1 Geist;white-space:nowrap">${txt}</div>`;
const cartaz = (top, html, op, tam = 66) => `<div style="position:absolute;left:70px;right:70px;top:${top}px;text-align:center;opacity:${f1(op * 100) / 100};color:#FFFFFF;font:800 ${tam}px/1.18 Geist;letter-spacing:-0.02em;text-shadow:0 4px 18px rgba(0,0,0,0.7)">${html}</div>`;

// Pedrinhas do sorteio no chão, entre os dois soldados; uma delas cai depois da fala.
function pedrinhas(t, t0) {
  let g = '';
  [[500, 1872], [530, 1866], [585, 1874], [560, 1880]].forEach(([x, y], i) => (g += `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="#CFC3AE" ${tk(3)}/>`));
  const p = prog(t, t0, t0 + 0.7);
  if (p > 0) g += `<ellipse cx="${f1(lerp(620, 548, p))}" cy="${f1(1700 + 170 * p - 260 * p * (1 - p))}" rx="9" ry="6" fill="#F0E6D2" ${tk(3)}/>`;
  return g;
}

const SCENES = [
  // 1. Plano geral do Calvário; a câmera entra em Jesus durante a 1ª frase.
  {
    a: 0, b: FB(0) + 0.35, dark: true, ref: [[FA(0) - 0.2, '1ª frase · Lucas 23:34']],
    f: (t) => {
      const [hx, hy] = cabecaCruz(CX.J);
      return { svg: camVai(golgota(t, { j: { look: [0, 0.5] } }), t, 0.4, FB(0), [540, 820, 1.0], [hx, hy + 120, 2.35]) };
    },
  },
  // 2. Os soldados com a túnica sem costura ao pé da cruz (João 19:23-24).
  {
    a: FB(0) + 0.35, b: FA(2) - 0.2, cut: true, dark: true, ref: 'João 19:23-24',
    f: (t) => {
      const frente = pe(P.SOLD1, 330, 1860, 0.55, { t, humor: 'firme', look: [0.6, 0], boca: bocaDe('SOLDADO1', t), segura: { item: 'tunica' }, alvoE: [-70, -560], alvoD: [70, -560] })
        + pe(P.SOLD2, 760, 1860, 0.55, { t, humor: 'neutro', look: [0.6, 0], flip: true, boca: bocaDe('SOLDADO2', t), alvoD: [200, -560] }) + pedrinhas(t, 1e9);
      const [x, y] = cabecaPe(330, 1860, 0.55);
      return { svg: camVai(golgota(t, { frente, desf: 'cruzes' }), t, FB(0) + 0.35, FA(2), [520, y + 200, 1.7], [x + 60, y + 150, 2.3]) };
    },
  },
  // 3. O outro soldado responde; a pedrinha do sorteio cai.
  {
    a: FA(2) - 0.2, b: FA(3) - 0.15, cut: true, dark: true,
    f: (t) => {
      const frente = pe(P.SOLD1, 330, 1860, 0.55, { t, humor: 'neutro', look: [0.6, 0.2], segura: { item: 'tunica' }, alvoE: [-70, -560], alvoD: [70, -560] })
        + pe(P.SOLD2, 760, 1860, 0.55, { t, humor: 'deboche', look: [0.7, 0], flip: true, boca: bocaDe('SOLDADO2', t), alvoD: t > FB(2) ? [120, -330] : [200, -560] }) + pedrinhas(t, FB(2) + 0.1);
      const [x, y] = cabecaPe(760, 1860, 0.55);
      return { svg: camVai(golgota(t, { frente, desf: 'cruzes' }), t, FA(2), FA(3), [x - 40, y + 150, 2.3], [600, y + 300, 1.8]) };
    },
  },
  // 4. Quem passa zomba (Mateus 27:39-40).
  {
    a: FA(3) - 0.15, b: FA(4) - 0.15, cut: true, dark: true, ref: 'Mateus 27:39-42 · Lucas 23:36-37',
    f: (t) => {
      const balanca = Math.sin(t * 7) * 5 * clamp(1 - prog(t, FB(3), FB(3) + 0.4));
      const frente = pe(P.PASS, 280, 1880, 0.56, { t, humor: 'deboche', look: [0.5, -0.7], tilt: balanca, boca: bocaDe('PASSANTE', t), maoD: 'aponta', alvoD: [220, -820] });
      const [x, y] = cabecaPe(280, 1880, 0.56);
      return { svg: camVai(golgota(t, { frente, desf: 'cruzes' }), t, FA(3) - 0.15, FA(4), [x + 40, y + 130, 2.4], [x + 60, y + 120, 2.6]) };
    },
  },
  // 5. O chefe dos sacerdotes (Mateus 27:41-42).
  {
    a: FA(4) - 0.15, b: FA(5) - 0.15, cut: true, dark: true,
    f: (t) => {
      const frente = pe(P.SAC, 800, 1880, 0.58, { t, humor: 'deboche', look: [-0.5, -0.6], boca: bocaDe('SACERDOTE', t), alvoE: [-60, -520], alvoD: [60, -520] });
      const [x, y] = cabecaPe(800, 1880, 0.58);
      return { svg: camVai(golgota(t, { frente, desf: 'cruzes' }), t, FA(4) - 0.15, FA(5), [x - 40, y + 130, 2.4], [x - 60, y + 110, 2.6]) };
    },
  },
  // 6. Um soldado oferece o vinagre e zomba (Lucas 23:36-37).
  {
    a: FA(5) - 0.15, b: FA(6) - 0.15, cut: true, dark: true,
    f: (t) => {
      const frente = pe(P.SOLD1, 420, 1860, 0.56, { t, humor: 'deboche', look: [0.4, -0.8], boca: bocaDe('SOLDADO1', t), alvoD: [150, -900], segura: { lado: 1, item: 'jarro' } });
      const [x, y] = cabecaPe(420, 1860, 0.56);
      return { svg: camVai(golgota(t, { frente, desf: 'fundo' }), t, FA(5) - 0.15, FA(6), [x + 120, y - 20, 1.6], [x + 60, y + 60, 2.1]) };
    },
  },
  // 7. O criminoso da esquerda insulta (Lucas 23:39).
  {
    a: FA(6) - 0.15, b: FA(7) - 0.15, cut: true, dark: true, ref: 'Lucas 23:39-43',
    f: (t) => {
      const [x, y] = cabecaCruz(CX.E, -4);
      return { svg: camVai(golgota(t, { desf: 'fundo', e: { humor: 'raiva', look: [0.9, 0] } }), t, FA(6) - 0.15, FA(7), [x + 30, y + 120, 3.4], [x + 50, y + 110, 3.6]) };
    },
  },
  // 8. O outro criminoso repreende; a câmera passa por Jesus no "Mas este homem não cometeu nenhum mal".
  {
    a: FA(7) - 0.15, b: FA(10) - 0.15, cut: true, dark: true,
    f: (t) => {
      const [x, y] = cabecaCruz(CX.D, 4), [jx, jy] = cabecaCruz(CX.J);
      const olhaJ = t > FA(9) - 0.2;
      const svg = golgota(t, { desf: 'fundo', d: { humor: olhaJ ? 'triste' : 'raiva', look: olhaJ ? [-1, 0] : [-0.9, 0.1] } });
      return { svg: t < FA(9) - 0.3 ? camVai(svg, t, FA(7), FA(9), [x - 20, y + 120, 3.4], [x - 40, y + 110, 3.5]) : camVai(svg, t, FA(9) - 0.3, FB(9), [x - 40, y + 110, 3.5], [(x + jx) / 2, (y + jy) / 2 + 160, 1.9]) };
    },
  },
  // 9. "Jesus, lembra-te de mim..."
  {
    a: FA(10) - 0.15, b: FA(11) - 0.15, cut: true, dark: true,
    f: (t) => {
      const [x, y] = cabecaCruz(CX.D, 4);
      return { svg: camVai(golgota(t, { desf: 'fundo', d: { humor: 'triste', look: [-1, -0.2] } }), t, FA(10) - 0.15, FA(11), [x - 30, y + 110, 3.6], [x - 40, y + 100, 3.9]) };
    },
  },
  // 10. A resposta de Jesus (2ª frase).
  {
    a: FA(11) - 0.15, b: FB(11) + 0.7, cut: true, dark: true, ref: [[FA(11) - 0.1, '2ª frase · Lucas 23:43']],
    f: (t) => {
      const [x, y] = cabecaCruz(CX.J);
      return { svg: camVai(golgota(t, { desf: 'fundo', j: { look: [1, 0.1], humor: 'sereno', turn: 0.35 } }), t, FA(11) - 0.15, FB(11) + 0.7, [x + 20, y + 70, 3.0], [x + 30, y + 60, 3.2]) };
    },
  },
  // 11. A mãe e o discípulo perto da cruz (João 19:25-27): Jesus olha para ela e depois para ele.
  {
    a: FB(11) + 0.7, b: FB(13) + 0.6, cut: true, dark: true, ref: [[FA(12) - 0.2, '3ª frase · João 19:26-27']],
    f: (t) => {
      const olhaEle = t > FA(13) - 0.3, cx = 470, cy = 1330, z = 1.45;
      const frente = pe(P.MAE, 330, 1900, 0.54, { t, humor: 'triste', look: [0.3, -1], boca: 0 })
        + pe(P.DISC, 520, 1900, 0.57, { t, humor: 'triste', look: olhaEle ? [0, -1] : [-0.5, -0.6] });
      const svg = golgota(t, { k: 0, frente, j: { look: olhaEle ? [0.1, 1] : [-0.6, 1], humor: 'triste', turn: olhaEle ? 0 : -0.3 } });
      const op = clamp(prog(t, FA(12) - 0.4, FA(12))) * (1 - prog(t, FB(13) + 0.2, FB(13) + 0.6));
      const [mx, my] = naTela(330, 1900 - 770 * 0.54 - 150, cx, cy, z), [dx, dy] = naTela(520, 1900 - 770 * 0.57 - 150, cx, cy, z);
      const html = `<div style="opacity:${f1(op * 100) / 100}">${etiqueta(mx - 30, my, 'a mãe de Jesus')}${etiqueta(dx + 50, dy - 64, 'o discípulo a quem ele amava')}</div>`;
      return { svg: camDes(svg, cx, cy + (1 - E.out(prog(t, FB(11) + 0.7, FA(13)))) * 30, z), html };
    },
  },
  // 12. O escuro: o sol deixa de brilhar (Mateus 27:45; Lucas 23:44-45a).
  {
    a: FB(13) + 0.6, b: FA(14) - 0.2, ref: [[FB(13) + 0.8, 'Do meio-dia às três da tarde · Mateus 27:45']], dark: true,
    f: (t) => ({ svg: camVai(golgota(t, {}), t, FB(13) + 0.6, FA(14), [540, 1120, 1.0], [540, 1080, 1.12]) }),
  },
  // 13. O grito (4ª frase), em alta voz; a tradução do evangelho fica na tela até o fim da fala seguinte.
  {
    a: FA(14) - 0.2, b: FB(14) + 0.35, cut: true, dark: true, ref: [[FA(14) - 0.1, '4ª frase · Mateus 27:46 · Marcos 15:34']],
    f: (t) => {
      const [x, y] = cabecaCruz(CX.J);
      return { svg: camVai(golgota(t, { desf: 'fundo', j: { look: [0, -1], humor: 'triste' } }), t, FA(14) - 0.2, FB(14), [x, y - 10, 2.2], [x, y, 2.5]), html: traducao(t) };
    },
  },
  // 14. "Ouçam! Ele está chamando Elias." e, na mesma hora, um deles sai correndo (Mateus 27:47-48).
  {
    a: FB(14) + 0.35, b: FA(16) - 0.15, cut: true, dark: true, ref: 'Marcos 15:35 · Mateus 27:48',
    f: (t) => {
      const corre = E.in(prog(t, FB(15) + 0.05, FA(16)));
      const frente = pe(P.HOM1, 520 + corre * 700, 1880 - Math.abs(Math.sin(t * 14)) * 14 * (corre > 0 ? 1 : 0), 0.56, { t, humor: 'espanto', look: [-0.4, -0.8], boca: bocaDe('HOMEM1', t), alvoD: corre > 0 ? [120, -500] : [110, -790] });
      const [x, y] = cabecaPe(520, 1880, 0.56);
      return { svg: camDes(golgota(t, { frente, desf: 'cruzes' }), x + 40 + corre * 300, y + 60, 2.4), html: traducao(t) };
    },
  },
  // 15. "Tenho sede." (5ª frase)
  {
    a: FA(16) - 0.15, b: FB(16) + 0.4, cut: true, dark: true, ref: [[FA(16) - 0.1, '5ª frase · João 19:28']],
    f: (t) => {
      const [x, y] = cabecaCruz(CX.J);
      return { svg: camVai(golgota(t, { desf: 'fundo', j: { look: [0, 0.4], humor: 'triste' } }), t, FA(16) - 0.15, FB(16) + 0.4, [x, y + 70, 3.2], [x, y + 60, 3.4]) };
    },
  },
  // 16. A esponja com vinagre na ponta da vara, até a boca de Jesus (Mateus 27:48; João 19:29).
  {
    a: FB(16) + 0.4, b: FA(17) - 0.15, cut: true, dark: true, ref: 'João 19:29 · Mateus 27:48',
    f: (t) => {
      const p = E.out(prog(t, FB(16) + 0.4, FA(17) - 0.5));
      // ponta da vara (coordenadas do corpo do homem em 700, 1880, escala 0.55): sobe até a boca de Jesus
      const [jx, jy] = cabecaCruz(CX.J), alvo = [(jx + 4 - 700) / 0.55, (jy + 40 - 1880) / 0.55];
      const ponta = [lerp(-120, alvo[0], p), lerp(-900, alvo[1], p)];
      const frente = `<path d="M 760 1880 C 740 1820 800 1810 800 1860 Z" fill="#B66A3C" ${tk(4)}/>`
        + pe(P.HOM1, 700, 1880, 0.55, { t, humor: 'neutro', look: [-0.5, -1], alvoE: [-150, -820], segura: { lado: -1, item: 'vara', ate: ponta } });
      return { svg: camDes(golgota(t, { frente }), 600, 1330, 1.35) };
    },
  },
  // 17. "Deixem-no. Vejamos se Elias vem salvá-lo." (Mateus 27:49)
  {
    a: FA(17) - 0.15, b: FB(17) + 0.4, cut: true, dark: true, ref: 'Mateus 27:49',
    f: (t) => {
      const frente = pe(P.HOM2, 380, 1880, 0.56, { t, humor: 'deboche', look: [0.8, -0.3], boca: bocaDe('HOMEM2', t), maoD: 'aponta', alvoD: [230, -640] });
      const [x, y] = cabecaPe(380, 1880, 0.56);
      return { svg: camVai(golgota(t, { frente, desf: 'cruzes' }), t, FA(17) - 0.15, FB(17), [x + 40, y + 130, 2.4], [x + 50, y + 120, 2.6]) };
    },
  },
  // 18. "Está consumado!" (6ª frase)
  {
    a: FB(17) + 0.4, b: FB(18) + 0.3, cut: true, dark: true, ref: [[FA(18) - 0.1, '6ª frase · João 19:30']],
    f: (t) => {
      const [x, y] = cabecaCruz(CX.J);
      return { svg: camVai(golgota(t, { desf: 'fundo', j: { look: [0, 0], humor: 'neutro' } }), t, FB(17) + 0.4, FB(18) + 0.3, [x, y + 70, 3.0], [x, y + 60, 3.2]) };
    },
  },
  // 19. "Pai, nas tuas mãos entrego o meu espírito." (7ª frase) e ele curva a cabeça.
  {
    a: FB(18) + 0.3, b: T_CURVA() + 2.6, cut: true, dark: true, ref: [[FA(19) - 0.1, '7ª frase · Lucas 23:46']],
    f: (t) => {
      const [x, y] = cabecaCruz(CX.J);
      return { svg: camVai(golgota(t, { desf: 'fundo', j: { look: [0, -1], humor: 'neutro' } }), t, FB(18) + 0.3, T_CURVA() + 2.6, [x, y + 60, 2.8], [x, y + 260, 1.7]) };
    },
  },
  // 20. O véu do santuário se rasga de alto a baixo; a terra treme (Mateus 27:51).
  {
    a: T_CURVA() + 2.6, b: T_CURVA() + 5.4, cut: true, dark: true, ref: 'Mateus 27:51',
    f: (t) => {
      const t0 = T_CURVA() + 2.6, p = E.inOut(prog(t, t0 + 0.3, t0 + 2.3));
      return { svg: camDes(templo(t, p), 540, 960, 1.04 + 0.05 * prog(t, t0, t0 + 2.8), { tremor: 7 * (1 - prog(t, t0 + 2.2, t0 + 2.8)), t }) };
    },
  },
  // 21. As rochas se partem no Calvário.
  {
    a: T_CURVA() + 5.4, b: FA(20) - 0.2, cut: true, dark: true,
    f: (t) => ({ svg: camDes(golgota(t, { racha: E.out(prog(t, T_CURVA() + 5.4, T_CURVA() + 6.4)) }), 540, 1250, 1.05, { tremor: 9 * (1 - prog(t, T_CURVA() + 6.0, FA(20))), t }) }),
  },
  // 22. O centurião (Mateus 27:54) e, no fim, o cartão das quatro contas e a pergunta.
  {
    a: FA(20) - 0.2, b: FIM, end: false, cut: true, dark: true, ref: [[FA(20) - 0.1, 'Mateus 27:54']],
    f: (t) => {
      const frente = pe(P.SOLD2, 820, 1800, 0.44, { t, humor: 'medo', look: [-0.3, -1] }) + pe(P.SOLD1, 250, 1800, 0.44, { t, humor: 'espanto', look: [0.3, -1] })
        + pe(P.CENT, 540, 1900, 0.6, { t, humor: 'espanto', look: [0, -1], boca: bocaDe('CENTURIAO', t), segura: { lado: 1, item: 'lanca' } });
      const [x, y] = cabecaPe(540, 1900, 0.6), t1 = FB(20) + 0.8;
      const svg = camVai(golgota(t, { frente, desf: 'cruzes' }), t, FA(20) - 0.2, FB(20), [x, y + 120, 2.6], [x, y + 200, 1.9]);
      const vela = `<rect x="0" y="0" width="1080" height="1920" fill="#08060E" opacity="${f1(0.62 * prog(t, t1, t1 + 0.6) * 100) / 100}"/>`;
      const c1 = prog(t, t1 + 0.2, t1 + 0.6) * (1 - prog(t, t1 + 3.6, t1 + 4.0)), c2 = prog(t, t1 + 4.1, t1 + 4.6);
      const html = cartaz(560, 'Lucas guardou 3.<br>João, outras 3.<br>Mateus e Marcos, 1.<br><span style="color:#6FB1FC">Juntos, as 7.</span>', c1, 76)
        + cartaz(620, 'Qual dessas <span style="color:#6FB1FC">7 frases</span> mais mexe com você?', c2, 92);
      return { svg: svg + vela, html };
    },
  },
];

// Vinheta por cima de todas as cenas, no quadro (fora da câmera).
SCENES.forEach((sc) => {
  const f = sc.f;
  sc.f = (t) => { const r = f(t); return { ...r, svg: r.svg + vinhetaDes(kEscuro(t)) }; };
});

// Tradução do "Eloí", a do próprio evangelho (Mateus 27:46), do grito até o fim do "Ele está chamando Elias".
function traducao(t) {
  const op = prog(t, FA(14) + 0.2, FA(14) + 0.6) * (1 - prog(t, FB(15) + 0.1, FB(15) + 0.5));
  if (op <= 0) return '';
  return `<div style="position:absolute;left:80px;right:80px;top:330px;text-align:center;opacity:${f1(op * 100) / 100};color:#F7F1E6;font:italic 500 58px/1.22 Lora;text-shadow:0 3px 14px rgba(0,0,0,0.75)">que significa: “Meu Deus! Meu Deus! Por que me abandonaste?”<div style="font:500 30px/1 'Geist Mono';letter-spacing:0.06em;color:#C9C3B8;margin-top:22px">as mesmas palavras do Salmo 22:1</div></div>`;
}

// O templo: o véu do santuário rasgando de cima para baixo (Mateus 27:51). As cores e os querubins são só desenho,
// tirados do véu do tabernáculo (Êxodo 26:31); o texto de Mateus não descreve o véu, e nada disso vai para a tela.
function templo(t, p) {
  let g = `<defs>${skyGrad('tpl', [[0, '#3A2A22'], [0.6, '#5A4430'], [1, '#2A1E16']])}</defs><rect x="-300" y="-300" width="1680" height="2520" fill="url(#tpl)"/>`;
  for (let y = 60; y < 1900; y += 90) for (let x = -60 + ((y / 90) % 2) * 70; x < 1140; x += 140) g += `<rect x="${x}" y="${y}" width="136" height="86" rx="6" fill="#6B533C" opacity="0.35"/>`;
  g += `<rect x="-300" y="1560" width="1680" height="700" fill="#3B2C20"/><path d="M -300 1560 L 1380 1560" ${tk(5)}/>`;
  [60, 1020].forEach((x) => (g += `<rect x="${x - 50}" y="280" width="100" height="1290" fill="#B79C74" ${tk(5)}/><rect x="${x - 66}" y="250" width="132" height="40" fill="#C9AE84" ${tk(5)}/><rect x="${x - 66}" y="1540" width="132" height="34" fill="#C9AE84" ${tk(5)}/>`));
  g += veil(p, 150, 930, 420, 1540, { querubins: 1, linho: true, fios: true, metades: true, id: 'veuD', beamTo: 1540, gapMax: 230 }); // sem facho de luz: o texto não fala em luz
  return g;
}
