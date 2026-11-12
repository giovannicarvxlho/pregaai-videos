// Arte das miniaturas do longo "depois da cruz" (12/11/2026), com as peças do capa-lib.js.
// Carregado depois de data.js, lib.js, capa-lib.js e scenes.js. Três motivos e três layouts, só com o que o vídeo mostra.
// Jesus não entra em close: na N3 ele aparece de longe, em silhueta, com a luz atrás.
const DC_T = 2.0;

// Moeda de ouro grande, com brilho (a "grande soma de dinheiro" de Mateus 28:12).
function dcMoeda(x, y, r, rot = 0, k = 1) {
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><ellipse cx="0" cy="0" rx="${f1(r)}" ry="${f1(r * k)}" fill="#FFC21E" stroke="${CAPA.ink}" stroke-width="9"/>
    <ellipse cx="0" cy="0" rx="${f1(r * 0.66)}" ry="${f1(r * k * 0.66)}" fill="none" stroke="#C98A12" stroke-width="7"/>
    <path d="M ${f1(-r * 0.62)} ${f1(-r * k * 0.34)} Q ${f1(-r * 0.3)} ${f1(-r * k * 0.8)} ${f1(r * 0.2)} ${f1(-r * k * 0.72)}" fill="none" stroke="#FFF3B8" stroke-width="8" stroke-linecap="round"/></g>`;
}
// Bolsa de dinheiro grande, aberta, com as moedas na boca.
function dcBolsa(x, y, s, rot = 0) {
  const couro = '#9A5B2E', couroDk = '#6E3D1C';
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})">
    ${dcMoeda(-34, -126, 30, -18, 0.5)}${dcMoeda(26, -134, 30, 14, 0.5)}${dcMoeda(-2, -150, 30, 0, 0.55)}
    <path d="M -60 0 C -96 -14 -88 -92 -40 -112 L -24 -128 L 24 -128 L 40 -112 C 88 -92 96 -14 60 0 Z" fill="${couro}" stroke="${CAPA.ink}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M 28 -110 C 68 -86 74 -28 52 -4 L 60 0 C 96 -14 88 -92 40 -112 Z" fill="${couroDk}"/>
    <path d="M -36 -116 Q 0 -100 36 -116" stroke="${CAPA.ink}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M -44 -70 C -30 -84 -14 -88 0 -86" stroke="#C98552" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.8"/>
  </g>`;
}

// N1 (escândalo): o guarda do túmulo com medo, de perto, e a "grande soma de dinheiro" (Mateus 28:11-15).
//     Ao fundo, o túmulo aberto com luz. Noite azul e ouro. Texto no alto, à esquerda.
function artN1(o = {}) {
  const G = guarda(1);
  let s = capaFundo([[0, '#040714'], [0.55, '#0A1634'], [1, '#142A58']]);
  s += capaMotas(0, 0, 1920, 520, 30, 13, '#DDE8FF', 0.5);
  // o túmulo aberto, embaixo à esquerda: a rocha fria e a luz saindo da entrada
  const TX = 330, TBASE = 1090, K = 1.55;
  s += `<path d="M -400 1200 L -400 880 C 300 820 900 860 1300 900 C 1600 930 1900 900 2400 920 L 2400 1200 Z" fill="#070D1E" stroke="#000" stroke-width="8"/>`;
  s += capaLuz(TX, TBASE - 220 * K, 760, '#FFC24A', 0.5);
  TOM_SEPULCRO.dcNoite = ['#2B3554', '#222B47', '#141A2E', '#04060B', '#56628A', '#333D5E', '#0A0D17'];
  s += sepulcro(TX, TBASE, K, { tom: 'dcNoite', rola: 1, luz: 1, id: 'dc1' });
  s += capaLuz(TX - 8, TBASE - 130 * K, 300, '#FFFFFF', 0.9);
  // o guarda, à direita, olhando para as moedas
  s += capaLuz(1040, 620, 520, '#FFB52E', 0.3);
  s += retrato({ skin: G.skin, hair: G.hair, robe: '#9C2F3A', x: 1500, y: 640, s: 1.55, helmet: 'rom', armor: true, mood: 'culpa', look: [-0.85, 0.35], lado: -1, luz: '#FFC24A', suor: true, id: 'dc1r' });
  // a bolsa e as moedas no ar, entre o túmulo e o guarda
  s += dcBolsa(1020, 1075, 2.5, -10);
  [[905, 640, 58, -22, 0.8], [1050, 520, 66, 12, 0.92], [1170, 700, 54, 28, 0.6], [960, 420, 46, -8, 0.7], [1150, 360, 50, 20, 0.95], [860, 800, 44, 30, 0.5]].forEach(([x, y, r, rot, k]) => (s += dcMoeda(x, y, r, rot, k)));
  s += capaVinheta(0.55, '50%', '50%', '82%');
  s += capaTexto([{ t: 'PAGOS PRA', w: 760 }, { t: 'MENTIR', w: 760, fill: 'ouro' }], { x: 60, y: 44, gap: 0.1, rot: -2 });
  return s;
}

// N2 (mistério): o túmulo aberto, a pedra rolada e a luz saindo; no chão, um guarda "como morto" (Mateus 28:2-4).
//     Ninguém à vista: a pergunta é quem rolou a pedra. Madrugada violeta e luz branca. Texto no alto, centralizado.
function artN2(o = {}) {
  const TX = 1190, TBASE = 1140, K = 2.0;
  const MX = TX + 8, MY = TBASE - 130 * K; // o meio da entrada (com o desenho espelhado, a pedra fica à esquerda)
  let s = capaFundo([[0, '#0A0618'], [0.5, '#24103E'], [0.82, '#5A2460'], [1, '#8A3A5C']]);
  s += capaMotas(0, 0, 1920, 420, 34, 21, '#E9DDFF', 0.55);
  s += `<path d="M -400 1200 L -400 900 C 300 850 900 880 1300 915 C 1600 940 1900 915 2400 930 L 2400 1200 Z" fill="#120A22" stroke="#000" stroke-width="8"/>`;
  s += capaLuz(MX, MY - 60, 1000, '#C9A6FF', 0.4);
  TOM_SEPULCRO.dcViol = ['#4A3C78', '#3A2F62', '#221A40', '#07050F', '#8E82C2', '#55498A', '#0B0816'];
  s += flipX(TX, sepulcro(TX, TBASE, K, { tom: 'dcViol', rola: 1, luz: 1, id: 'dc2' }));
  s += capaRaios(MX, MY, 1500, 9, '#FFF3C9', 0.13, 11, 196, 344);
  s += capaLuz(MX, MY, 560, '#FFC24A', 0.6) + capaLuz(MX, MY + 20, 340, '#FFFFFF', 0.98);
  s += capaMotas(MX - 420, 260, 840, 620, 36, 5, '#FFF3C9', 0.9);
  // um dos guardas, caído (Mateus 28:4)
  s += caido(guarda(0, { x: 70, y: 1040, s: 1.5, mood: 'fear', t: DC_T, flip: false, rim: '#C9A6FF', gear: { helmet: 'rom', armor: true } }), 84);
  s += capaVinheta(0.6, '62%', '55%', '85%');
  s += capaTexto([{ t: 'QUEM ROLOU', w: 1000 }, { t: 'A PEDRA?', w: 1000, fill: 'ouro' }], { x: 960, y: 28, anchor: 'middle', gap: 0.1 });
  return s;
}

// N3 (curiosidade): Maria Madalena chorando, de perto; atrás dela, de longe e contra o sol, o homem que ela
//     tomou pelo jardineiro (João 20:14-16; Marcos 16:9). Nascer do sol. Texto no alto, do meio para a direita.
function artN3(o = {}) {
  const JX = 1400, JY = 1010;
  let s = capaFundo([[0, '#0C2A3A'], [0.38, '#2E5A62'], [0.62, '#F0914A'], [0.8, '#FFC97A'], [1, '#3A2A16']]);
  s += capaLuz(JX, 560, 900, '#FFD27A', 0.85) + capaRaios(JX, 540, 1500, 16, '#FFF3C9', 0.22, 9);
  // o jardim em silhueta
  s += olive(1790, 900, 1.9, '#27432F', '#1B3222', '#0A140D') + olive(930, 880, 1.2, '#2E4C36', '#213A28', '#0A140D');
  s += `<path d="M -400 1200 L -400 850 C 200 800 800 850 1200 860 C 1600 870 2000 840 2400 860 L 2400 1200 Z" fill="#1E2E1C" stroke="#0A140D" stroke-width="8"/>`;
  s += capaLuz(JX, 600, 380, '#FFFFFF', 0.95);
  s += person({ ...VIVO, x: JX, y: JY, s: 1.95, sil: '#1E1206', rim: '#FFF3C9', armL: 20, armR: 34, noShadow: true });
  s += `<ellipse cx="${JX}" cy="${JY + 6}" rx="230" ry="22" fill="#FFE9B0" opacity="0.5"/>`;
  // ela chorava (João 20:11, 15) e se virou (20:14, 16): olhos abertos de espanto, com as lágrimas ainda no rosto
  const MX = 430, MY = 706, MS = 1.56;
  s += retrato({ skin: MADALENA.skin, hair: MADALENA.hair, robe: '#C93A4E', cover: '#EFE6DC', x: MX, y: MY, s: MS, mood: 'espanto', look: [0.75, -0.05], lado: 1, luz: '#FFD27A', id: 'dc3r' });
  s += capaGota(MX - 96 * MS, MY + 96 * MS, 1.5 * MS) + capaGota(MX + 78 * MS, MY + 110 * MS, 1.15 * MS);
  s += capaVinheta(0.5, '55%', '50%', '85%');
  s += capaTexto([{ t: 'QUEM VIU JESUS', w: 1130 }, { t: 'PRIMEIRO?', w: 1130, fill: 'ouro' }], { x: 1870, y: 34, anchor: 'end', gap: 0.1, rot: -1.5 });
  return s;
}
