// "Deus abandonou Jesus na cruz?" e o Salmo 22 (Salmo 22; Mateus 27; Marcos 15; João 19 e 20; Lucas 24; Hebreus 2 e 5).
// Vídeo longo, 1920×1080, no mesmo mundo do "quando Jesus morreu" (as cruzes, as trevas, o véu, os soldados) e do
// "depois da cruz" (a sala trancada, Tomé, o túmulo vazio). Cada cena começa em at(i), wordTime ou nas pontas dos
// trechos dos cortes (antes/depois).
// Regras de imagem (roteiro aprovado e regras do canal):
// - Jesus na cruz sempre em silhueta, de longe ou com luz atrás; sem close com expressão exagerada. O rosto com
//   emoção é de quem estava na cena (soldados, líderes, Tomé, os discípulos).
// - Nada de pés pregados nem de pregos em destaque: os evangelhos não descrevem os pregos na hora da crucificação.
//   Tomé fala das marcas nas mãos (João 20:25) e Jesus ressuscitado mostra as mãos e os pés (Lucas 24:39), de pé,
//   de corpo inteiro, sem marca desenhada.
// - No Getsêmani (Hebreus 5:7), Jesus aparece de costas e em silhueta, ajoelhado, de longe.
// - Cada citação na tela é idêntica ao texto falado (conferido na NVI pelo conferir.py); "…" marca o corte.
// - Texto visível sem travessão.
// Cortes (corte.json): curto 1 = 57, 23-29; curto 2 = 58-59, 32-38, 40, 42-45, 50-54; curto 3 = 60-62, 3, 8-16,
// 32-34, 37, 42-43, 50. Nas pontas desses trechos a troca de cena usa antes(i)/depois(i). As frases 57 a 62 são as
// aberturas próprias dos curtos, gravadas depois da fala do longo: as cenas delas entram secas (cut: true).
// No curto com enquadramento por cena (layout foco), os cartões de texto saem estreitos, na faixa do meio da cena
// (x 690 a 1170), que é a janela que o curto mostra, e com fundo escuro, porque a legenda do curto é clara.

const L = (part, line) => PARTS[part - 1] + line;
const at = (i) => SEGS[i][0] - 0.25;
const seg = (i) => SEGS[i][0];
const fim = (i) => SEGS[i][1];
// início da k-ésima palavra da frase i (os tempos que a ElevenLabs devolveu)
const wt = (i, k) => (SEGS[i][4] && SEGS[i][4][k] != null ? SEGS[i][4][k] : SEGS[i][0]);
const CURTO = typeof RECORTE !== 'undefined' && RECORTE;
const NARROW = typeof FOCO !== 'undefined' && FOCO;
// Pontas dos trechos de tools/corte.cjs: um trecho começa até 0,15 s antes da 1ª frase e termina até 0,6 s depois
// da última. antes(i): a cena da frase que abre um trecho já está inteira no 1º quadro dele. depois(i): a cena
// seguinte a um trecho que termina na frase i só começa a entrar depois da pausa.
const inicioTrecho = (i) => seg(i) - Math.min(0.15, i > 0 ? (seg(i) - fim(i - 1)) / 2 : seg(i));
const fimTrecho = (i) => fim(i) + (i + 1 < SEGS.length ? Math.min(0.6, seg(i + 1) - fim(i)) : 0.6);
const antes = (i) => Math.min(at(i), inicioTrecho(i) - XF / 2 - 0.02);
const depois = (i) => Math.max(at(i + 1), fimTrecho(i) + XF / 2 + 0.02);
// As aberturas dos curtos entram secas entre o fim do trecho anterior e o começo do seu.
const seco = (i) => (fimTrecho(i - 1) + inicioTrecho(i)) / 2;

const FLOOR_Y = 880; // pés dos personagens em primeiro plano (a legenda do longo começa em ~920)
const SIL = '#16110F';
const NIGHT_OL = '#0E0D0C';
const RIM = '#5A606A'; // contraluz frio da tarde escura
const DUSK_OL = '#0E0B09', DUSK_HILL = '#2C221D', CRUZ_TARDE = '#0A0807';

// ---------------------------------------------------------------- personagens
const soldado = (seed, extra = {}) => ({ ...man(seed), cover: null, beard: false, robe: C.p600, gear: { helmet: 'rom', armor: true }, ...extra });
const TONS = [C.g600, C.p400, C.ch300, C.oliveDk, '#7B6A55', C.p600, '#9C8F70', C.g700, '#B9897A', '#8C7A62'];
const povo = (seed, extra = {}) => { const r = rng(seed * 31 + 7); return { ...man(seed), robe: pick(r, TONS), ...extra }; };
const mulher = (seed, extra = {}) => ({ ...povo(seed), beard: false, cover: ['#E2D8CF', C.g300, '#C9BBAE', C.g100][seed % 4], ...extra });
const JESUS = { robe: '#E9E1D8', skin: '#B97A4A', hair: '#2F2622', beard: true };
const VIVO = { ...JESUS, robe: '#FFFFFF' }; // Jesus ressuscitado (como no "depois da cruz")
const PEDRO = { robe: C.p500, skin: '#C68B59', hair: '#5A3A28', beard: true, cover: null };
const JOAO = { ...man(1002), robe: C.g400, beard: false, hair: '#3A2A20', cover: null, skin: '#C68B59' };
const TOME = { ...man(1103), robe: C.oliveDk, beard: true, cover: null, hair: '#191919', skin: '#A86B3C' };
const DISCS = [PEDRO, JOAO, { ...man(1243), robe: C.p600, beard: true, cover: null }, { ...man(1244), robe: C.ch300, beard: true, cover: null }];
const LEITOR = { ...man(1401), robe: C.b500, cover: null, beard: true, skin: '#C68B59', hair: '#2F2622' };
// Alguém de hoje: roupa de hoje (camisa azul), sem véu, cabelo curto.
const HOJE = { robe: '#3F6E9E', skin: '#C68B59', hair: '#2F2622', beard: false, cover: null };
// Os líderes (Mateus 27:41): chefes dos sacerdotes (branco), mestres da lei (com o rolo) e líderes religiosos.
const CHEFE = (seed, extra = {}) => lider(seed, { robe: '#F4F1EC', cover: '#FFFFFF', ...extra });
const MESTRE = (seed, extra = {}) => lider(seed, { robe: '#5B3F7A', cover: C.g300, ...extra });
const ANCIAO = (seed, extra = {}) => lider(seed, { robe: C.g700, cover: '#E2D8CF', ...extra });

// ---------------------------------------------------------------- utilidades
const label = (x, y, txt, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${o.anchor || 'middle'}" font-family="${o.fam || 'Geist'}" font-weight="${o.w || 700}" font-size="${o.size || 36}" fill="${o.fill || C.inkDeep}" opacity="${f1((o.op ?? 1) * 100) / 100}"${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${o.html || esc(txt)}</text>`;
const bump = (t, t0, d = 0.9) => Math.sin(Math.PI * prog(t, t0, t0 + d));
const camQ = (inner, fx, fy, z, sx, sy, q, t) => cam(inner, fx, fy, z, sx - fx + Math.sin(t * 43) * 12 * q, sy - fy + Math.cos(t * 37) * 8 * q);
const papel = (glow = 0.24, gx = 960, gy = 460) => `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="${C.paper}"/><circle cx="${gx}" cy="${gy}" r="800" fill="url(#gAmber)" opacity="${glow}"/>`;
// Fundo dos cartões no curto (layout foco): escuro e quente, para a legenda clara do curto ler em cima.
const escuroCartao = (t) => `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1E1A17"/><circle cx="960" cy="680" r="${f1(560 + 10 * Math.sin(t * 1.3))}" fill="url(#gAmber)" opacity="0.32"/>`;
const fundoCartao = (t, glow, gx, gy) => (NARROW ? escuroCartao(t) : papel(glow, gx, gy));
// Anel de som que se abre (o grito).
function anel(x, y, t, t0, col = '#fff') {
  const p = prog(t, t0, t0 + 1.2);
  return p > 0 && p < 1 ? `<circle cx="${x}" cy="${y}" r="${f1(60 + 420 * E.out(p))}" fill="none" stroke="${col}" stroke-width="${f1(10 * (1 - p))}" opacity="${f1((1 - p) * 0.7 * 100) / 100}"/>` : '';
}
// Sentado (numa pedra baixa ou numa cadeira): o corpo ajoelhado com as pernas para a frente.
function sentado(o) {
  const s = o.s || 1, col = o.legs || o.sil || C.g800, sw = o.sil ? 0 : f1(4 * s), ol = o.sil || o.ol || C.ink;
  const rk = o.rock ? `<ellipse cx="${f1(o.x)}" cy="${f1(o.y + 88 * s)}" rx="${f1(80 * s)}" ry="${f1(9 * s)}" fill="#000" opacity="0.18"/><path d="M ${f1(o.x - 78 * s)} ${f1(o.y + 86 * s)} C ${f1(o.x - 84 * s)} ${f1(o.y + 30 * s)} ${f1(o.x + 84 * s)} ${f1(o.y + 30 * s)} ${f1(o.x + 78 * s)} ${f1(o.y + 86 * s)} Z" fill="${o.rock}" ${ink(5, ol)}/>` : '';
  const legs = [-15, 15].map((dx) => `<rect x="${f1(o.x + (dx - 9) * s)}" y="${f1(o.y + 18 * s)}" width="${f1(18 * s)}" height="${f1(60 * s)}" rx="${f1(9 * s)}" fill="${col}" stroke="${ol}" stroke-width="${sw}"/>`).join('');
  return opg(o.op ?? 1, rk + legs + person({ ...o, kneel: true, noShadow: true, op: 1 }));
}

// ---------------------------------------------------------------- cartões de texto (HTML)
// Um cartão branco no estilo da lista da marca (borda e sombra dura). No longo, largo e no alto; no curto com
// enquadramento por cena, estreito, na faixa do meio da cena (a janela do curto), abaixo da legenda.
// o: eyebrow, titulo, linhas [{ txt (html), ref, op }], p (entrada 0..1), topW, topN, fs (tamanho do texto no longo).
function cartaoHTML(o) {
  const p = clamp(o.p ?? 1);
  if (p <= 0) return '';
  const N = NARROW;
  const pad = N ? '14px 22px' : '34px 48px', fs = N ? (o.fsN || 29) : (o.fs || 58);
  const head = o.eyebrow || o.titulo ? `<div style="padding:${N ? '16px 22px 12px' : '36px 44px 26px'};border-bottom:${N ? 2 : 3}px solid #ECEAE6">
    ${o.eyebrow ? `<div style="font:600 ${N ? 14 : 28}px/1 Geist;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted}">${o.eyebrow}</div>` : ''}
    ${o.titulo ? `<div style="margin-top:${N ? 8 : 14}px;font:700 ${N ? 27 : 52}px/1.15 Geist;letter-spacing:-0.02em;color:${C.inkDeep}">${o.titulo}</div>` : ''}</div>` : '';
  const rows = o.linhas.map((l, k) => {
    const op = clamp(l.op ?? 1);
    const ref = l.ref ? `<div style="flex:none;font:500 ${N ? 15 : 28}px/1.2 'Geist Mono';color:${C.muted};${N ? 'margin-top:10px' : 'margin-left:30px;white-space:nowrap'}">${l.ref}</div>` : '';
    return `<div style="${N ? '' : 'display:flex;align-items:center;'}padding:${pad};background:#FBFAF8;${k ? `border-top:${N ? 2 : 3}px solid #F1EFEB;` : ''}opacity:${f1((0.18 + 0.82 * op) * 100) / 100}">
      <div style="flex:1;font:600 ${l.fs || fs}px/1.28 Lora;color:${C.inkDeep}">${l.txt}</div>${ref}</div>`;
  }).join('');
  const pos = N ? `left:${o.xN ?? 690}px;width:${o.wN ?? 480}px;top:${o.topN ?? 540}px;border:2px solid ${C.border};border-radius:22px;box-shadow:0 5px 0 0 ${C.border}`
    : `left:${o.left ?? 260}px;right:${o.right ?? 260}px;top:${o.topW ?? 190}px;border:3px solid ${C.border};border-radius:44px;box-shadow:0 10px 0 0 ${C.border}`;
  return `<div style="position:absolute;${pos};box-sizing:border-box;background:#fff;overflow:hidden;opacity:${f1(p * 100) / 100};transform:translateY(${f1((1 - p) * (N ? 14 : 30))}px)">${head}${rows}</div>`;
}
// Texto com marca-texto que avança (hlWords do lib.js) e, opcionalmente, palavras em azul (k: índices).
const hl = (txt, h) => hlWords(txt, h).replace(/ <\/mark>$/, '</mark>');
const azul = (w) => `<span style="color:${C.b500}">${w}</span>`;

// ---------------------------------------------------------------- fundos e peças da cruz (os mesmos do "quando Jesus morreu")
function bgTrevas(t, o = {}) {
  let s = bgNight(t, { sky: 'skyDawn', moon: false, starOp: 0, ox: o.ox });
  s += `<circle cx="${o.gx ?? 960}" cy="${GROUND}" r="${o.gr ?? 900}" fill="url(#gPeach)" opacity="${o.glow ?? 0.1}"/>`;
  return s;
}
// O Gólgota com as três cruzes e Jerusalém atrás. o.k: [meio, esquerda, direita] (0..1) levanta cada cruz.
function golgota(t, o = {}) {
  const dark = o.dark, ol = dark ? '#060708' : C.ink, fill = dark ? '#1B1E22' : '#D6CCC1', cf = dark ? '#050505' : SIL, rim = dark ? '#3A3F47' : null;
  let s = dark ? '' : city(370, 622, 0.5, t);
  s += hill(960, 560, 1150, fill, ol);
  const k = o.k || [1, 1, 1], up = (i) => ({ rot: lerp(i === 2 ? 70 : -70, 0, E.out(k[i])), op: clamp(k[i] * 4) });
  const b = o.bows || [0.35, 0.35, o.bow ?? 0];
  if (k[1] > 0) s += crossFig(690, 592, 0.5, { fill: cf, rim, bow: b[0], ...up(1) });
  if (k[2] > 0) s += crossFig(1230, 592, 0.5, { fill: cf, rim, bow: b[1], ...up(2) });
  if (k[0] > 0) s += crossFig(960, 572, 0.64, { fill: cf, rim, plaque: true, bow: b[2], ...up(0) });
  return s;
}
const golgotaLonge = (t, x, y, sc, o = {}) => `<g transform="translate(${x} ${y}) scale(${sc}) translate(-960 -560)">${golgota(t, o)}</g>`;
// A cruz do meio de perto, em silhueta, no escuro. o.light: brilho atrás da cabeça; o.peso: a sombra que desce.
function cruzPerto(t, o = {}) {
  // o céu passa das bordas do quadro: a abertura começa perto da cabeça e desce a câmera
  let s = `<rect x="-600" y="-900" width="${W + 1200}" height="${H + 1800}" fill="#101419"/>` + bgDark(t);
  if (o.light) s += `<circle cx="960" cy="240" r="520" fill="url(#gWhite)" opacity="${f1(o.light * 100) / 100}"/>`;
  s += hill(960, 880, 1300, '#1B1E22', '#060708');
  s += crossFig(960, 905, 1.5, { plaque: true, fill: '#050505', rim: RIM, bow: o.bow || 0 });
  return s;
}
const CABECA = [960, 905 - 442 * 1.5]; // onde fica a cabeça na cruz de perto

// ---------------------------------------------------------------- o rolo (o salmo escrito havia séculos)
// Pergaminho aberto na horizontal, com as duas varas. As linhas são traços de tinta (sem letra legível).
// o: x0, x1 (onde ficam as varas), y, h, linhas, destaque (0..1, a primeira linha acende), fimLuz (0..1, o fim acende).
function rolo(o) {
  const { x0, x1, y, h } = o, top = y - h / 2, ol = o.ol || '#2A211B';
  let s = `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${h}" fill="#EFE3C8" ${ink(6, ol)}/>`;
  s += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${h}" fill="url(#gAmber)" opacity="0.12"/>`;
  // manchas do tempo
  const r = rng(o.seed || 22);
  for (let i = 0; i < 9; i++) s += `<ellipse cx="${f1(x0 + r() * (x1 - x0))}" cy="${f1(top + r() * h)}" rx="${f1(30 + r() * 60)}" ry="${f1(14 + r() * 26)}" fill="#C9AE7E" opacity="0.18"/>`;
  // colunas de texto: blocos de traços curtos
  const colW = o.colW || 300, gap = 70, nl = o.linhas || 7;
  for (let cx = x0 + 60; cx + colW < x1 - 40; cx += colW + gap) {
    for (let k = 0; k < nl; k++) {
      const yy = top + 50 + k * ((h - 100) / (nl - 1));
      let xx = cx;
      while (xx < cx + colW - 20) {
        const w = 18 + r() * 46;
        if (xx + w > cx + colW) break;
        s += `<line x1="${f1(xx)}" y1="${f1(yy)}" x2="${f1(xx + w)}" y2="${f1(yy)}" stroke="#4A3A2C" stroke-width="7" stroke-linecap="round" opacity="0.75"/>`;
        xx += w + 14;
      }
    }
  }
  // a primeira linha da primeira coluna (o salmo começa com o grito)
  if (o.destaque > 0) s += `<rect x="${x0 + 46}" y="${top + 32}" width="${colW + 28}" height="36" rx="10" fill="${C.b300}" opacity="${f1(o.destaque * 0.75 * 100) / 100}"/>`;
  if (o.fimLuz > 0) s += `<circle cx="${x1 - 220}" cy="${y}" r="${f1(260 + 60 * o.fimLuz)}" fill="url(#gAmber)" opacity="${f1(o.fimLuz * 0.75 * 100) / 100}"/><rect x="${x1 - colW - 70}" y="${top + h - 70}" width="${colW + 28}" height="36" rx="10" fill="${C.a300}" opacity="${f1(o.fimLuz * 0.7 * 100) / 100}"/>`;
  const vara = (x) => `<rect x="${x - 22}" y="${top - 40}" width="44" height="${h + 80}" rx="22" fill="${C.wood}" ${ink(6, ol)}/><rect x="${x - 34}" y="${top - 56}" width="68" height="26" rx="13" fill="#8C6A4A" ${ink(5, ol)}/><rect x="${x - 34}" y="${top + h + 30}" width="68" height="26" rx="13" fill="#8C6A4A" ${ink(5, ol)}/>`;
  return s + vara(x0) + vara(x1);
}
// A mesa à luz da lamparina, com o rolo aberto. pan (0..1) leva a câmera do começo ao fim do rolo.
function lamparinaMesa(x, y, t) {
  return `<circle cx="${x}" cy="${y - 40}" r="${f1(380 + 12 * Math.sin(t * 7))}" fill="url(#gAmber)" opacity="0.5"/>` +
    `<path d="M ${x - 42} ${y} Q ${x} ${y + 28} ${x + 42} ${y} L ${x + 54} ${y - 8} L ${x - 30} ${y - 10} Z" fill="${C.p400}" ${ink(5, NIGHT_OL)}/>` +
    flame(x + 44, y - 8, 11, 38 + 6 * Math.sin(t * 11), C.p300) + flame(x + 44, y - 8, 6, 22 + 4 * Math.sin(t * 13), C.a300);
}
const ROLO = { x0: 120, x1: 3000, y: 560, h: 440 };
function mesaRolo(t, o = {}) {
  let s = `<rect x="-1000" y="-300" width="${W + 2700}" height="${H + 600}" fill="#231D19"/>`;
  s += `<rect x="-1000" y="820" width="${W + 2700}" height="600" fill="#3A2C22"/><line x1="-1000" y1="820" x2="${W + 1700}" y2="820" stroke="${NIGHT_OL}" stroke-width="6"/>`;
  s += rolo({ ...ROLO, destaque: o.destaque || 0, fimLuz: o.fimLuz || 0 });
  s += lamparinaMesa(o.lx ?? 1500, 300, t);
  return s;
}
// pan 0: o começo do rolo no meio da tela; 1: o fim.
const camRolo = (s, pan, z) => { const fx = lerp(560, ROLO.x1 - 420, pan); return cam(s, fx, 560, z, 960 - fx, 0); };

// ---------------------------------------------------------------- a túnica, as roupas e os dados (João 19:23-24)
// A túnica sem costura, tecida numa peça só, de alto a baixo. Centro em (x, y); ~350 × 300 em s = 1.
// o.id (recorte da trama), o.glow (luz atrás), o.linha (0..1: a luz que corre do alto até embaixo, sem costura),
// o.tensao (0..1: o pano esticado entre duas mãos), o.flat (deitada no chão, em perspectiva).
const TUNICA = 'M -58 -150 Q 0 -124 58 -150 L 150 -120 L 178 -40 L 114 -24 L 98 -76 L 106 150 L -106 150 L -98 -76 L -114 -24 L -178 -40 L -150 -120 Z';
function tunica(x, y, s = 1, o = {}) {
  const fill = o.fill || '#E7DCC8', dk = shade(fill, 0.82), id = o.id || 'tn';
  let g = '';
  if (o.glow > 0) g += `<circle cx="0" cy="0" r="330" fill="url(#gAmber)" opacity="${f1(o.glow * 0.8 * 100) / 100}"/>`;
  g += `<path d="${TUNICA}" fill="${fill}" ${ink(6)}/>`;
  g += `<clipPath id="${id}"><path d="${TUNICA}"/></clipPath><g clip-path="url(#${id})">`;
  for (let k = 0; k < 12; k++) g += `<line x1="-190" y1="${-136 + k * 25}" x2="190" y2="${-136 + k * 25}" stroke="${dk}" stroke-width="3" opacity="0.55"/>`;
  g += `<path d="M 34 -150 L 160 -118 L 190 -40 L 116 -20 L 112 160 L 40 160 Z" fill="#000" opacity="0.07"/>`;
  if (o.tensao > 0) g += `<path d="M -150 -110 Q 0 ${f1(-60 + 40 * o.tensao)} 150 -110" fill="none" stroke="${dk}" stroke-width="5" opacity="${f1(o.tensao * 100) / 100}"/>`;
  if (o.linha > 0) {
    const yl = lerp(-140, 150, o.linha);
    g += `<rect x="-14" y="-140" width="28" height="${f1(yl + 140)}" fill="${C.a300}" opacity="0.85"/><circle cx="0" cy="${f1(yl)}" r="22" fill="#FFF6DF" opacity="0.95"/>`;
  }
  g += `</g><path d="M -58 -150 Q 0 -110 58 -150" fill="none" ${ink(5)}/>`;
  const sy = o.flat ? 0.5 : 1;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(o.rot || 0)}) scale(${f1(s * 1000) / 1000} ${f1(s * sy * 1000) / 1000})"${o.op != null ? ` opacity="${f1(o.op * 100) / 100}"` : ''}>${g}</g>`;
}
// As outras peças, dobradas: manto, cinto, pano da cabeça e sandálias (uma para cada soldado).
const PECAS = [{ cor: '#8E7A62', tipo: 'manto' }, { cor: C.g300, tipo: 'pano' }, { cor: '#6B4A33', tipo: 'cinto' }, { cor: '#7A5A40', tipo: 'sandalias' }];
function peca(x, y, s, i, sc = 1) {
  if (sc <= 0) return '';
  const P = PECAS[i];
  let g = '';
  if (P.tipo === 'sandalias') {
    g += [-22, 22].map((dx) => `<ellipse cx="${dx}" cy="-14" rx="18" ry="40" fill="${P.cor}" ${ink(5)}/><line x1="${dx - 16}" y1="-30" x2="${dx + 16}" y2="-30" stroke="${C.ink}" stroke-width="5"/>`).join('');
  } else if (P.tipo === 'cinto') {
    g += `<ellipse cx="0" cy="-14" rx="52" ry="22" fill="none" stroke="${C.ink}" stroke-width="20"/><ellipse cx="0" cy="-14" rx="52" ry="22" fill="none" stroke="${P.cor}" stroke-width="11"/><rect x="40" y="-24" width="22" height="18" rx="4" fill="${C.a400}" ${ink(4)}/>`;
  } else {
    const h = P.tipo === 'manto' ? 46 : 30;
    g += `<rect x="-70" y="${-h - 4}" width="140" height="${h}" rx="12" fill="${P.cor}" ${ink(5)}/><line x1="-56" y1="${-h * 0.45 - 4}" x2="56" y2="${-h * 0.45 - 4}" stroke="${shade(P.cor, 0.75)}" stroke-width="4"/>`;
    if (P.tipo === 'manto') g += `<rect x="-62" y="${-h - 24}" width="124" height="22" rx="10" fill="${shade(P.cor, 1.1)}" ${ink(5)}/>`;
  }
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * sc * 1000) / 1000})">${g}</g>`;
}
// Dado (osso de sorteio), branco, com os pontos.
function dado(x, y, s, rot, face) {
  const pts = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[face] || [[0, 0]];
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 100) / 100})"><rect x="-22" y="-22" width="44" height="44" rx="10" fill="#FFFFFF" ${ink(5)}/>${pts.map(([a, b]) => `<circle cx="${a * 11}" cy="${b * 11}" r="4.5" fill="${C.ink}"/>`).join('')}</g>`;
}
// O pé da cruz, de dia (o Gólgota pequeno atrás e o chão), onde os soldados dividem as roupas.
function peDaCruz(t, o = {}) {
  let s = bgGloom(t, { seed: o.seed || 951 }) + golgotaLonge(t, o.gx ?? 960, o.gy ?? 520, o.gs ?? 0.9);
  s += floor('day', 0, 700);
  return s;
}
// Quatro soldados ajoelhados em volta do pano. k: pecas (0..1 para cada um), glow (a túnica acende), ergue
// (0..1: o soldado do meio levanta a túnica), dados (a hora do sorteio), olhar (todos olham para a túnica).
const SOLD = () => (NARROW ? [[735, 811], [860, 812], [1060, 813], [1185, 814]] : [[560, 811], [760, 812], [1160, 813], [1360, 814]]);
function divisao(t, k = {}) {
  let s = peDaCruz(t, { gx: 960, gy: 470, gs: 0.85 });
  const sold = SOLD(), py = 855;
  s += `<ellipse cx="960" cy="${py + 10}" rx="${NARROW ? 330 : 520}" ry="52" fill="${C.g100}" ${ink(5)}/>`;
  sold.forEach(([x, seed], i) => {
    const dir = x < 960 ? 1 : -1, p = k.pecas ? k.pecas[i] : 1;
    s += person({ ...soldado(seed), x, y: 800, s: NARROW ? 0.98 : 1.12, kneel: true, look: k.olhar ? dir * 0.8 : dir, mood: 'calm', armL: dir < 0 ? lerp(14, 52, p) : 24, armR: dir > 0 ? lerp(14, 52, p) : 24, t });
  });
  sold.forEach(([x], i) => { const dir = x < 960 ? 1 : -1; s += peca(x + dir * (NARROW ? 52 : 70), py + 8, NARROW ? 0.8 : 1, i, pop(t, (k.tp || [])[i] ?? -9, 0.4)); });
  if (k.tunica !== false) s += tunica(960, py - 4, NARROW ? 0.42 : 0.5, { flat: true, glow: k.glow || 0, id: 'tnD' + (k.id || '') });
  return s;
}

// Soldado em pé mostrando a túnica aberta na frente do corpo, segura pelos ombros, com a cabeça livre em cima.
// o: x, y, s, linha, glow, look, mood, id.
function segurando(t, o = {}) {
  const P = { ...soldado(o.seed || 812), x: o.x ?? 960, y: o.y ?? 850, s: o.s || 1.2, armL: 106, armR: 106, mood: o.mood || 'calm', look: o.look || 0, t };
  const [lx, ly] = mao(P, -1), [rx, ry] = mao(P, 1);
  const ts = (rx - lx) / 300, cy = (ly + ry) / 2 + 118 * ts;
  return person(P) + tunica((lx + rx) / 2, cy, ts, { glow: o.glow || 0, linha: o.linha || 0, id: o.id || 'tnS' });
}
// Dois soldados com a túnica esticada entre eles. puxa (0..1): o da esquerda puxa; para (0..1): o da direita
// levanta a outra mão ("Não a rasguemos").
function entreDois(t, o = {}) {
  const puxa = o.puxa || 0, para = o.para || 0, gap = NARROW ? 190 : 270, sc = NARROW ? 1.05 : 1.2;
  const A = { ...soldado(811), x: 960 - gap - (NARROW ? 8 : 30) * puxa, y: 850, s: sc, armR: 76, armL: 20, look: 1, lean: -6 * puxa, mood: puxa > 0.3 ? 'angry' : 'calm', t };
  const B = { ...soldado(813), x: 960 + gap, y: 850, s: sc, armL: 76, armR: lerp(20, 150, para), look: -1, mood: 'calm', t };
  const [ax, ay] = mao(A, 1), [bx, by] = mao(B, -1);
  const ts = Math.max((bx - ax) / 300, 0.74); // de perto, eles seguram pelas mangas
  return person(A) + person(B) + tunica((ax + bx) / 2, (ay + by) / 2 + 118 * ts, ts, { tensao: puxa, id: o.id || 'tnE' });
}

// ---------------------------------------------------------------- o véu (o mesmo do "quando Jesus morreu")
function menorah(x, y, s, t = 0, ol = C.ink) {
  let g = `<line x1="0" y1="0" x2="0" y2="-120" stroke="${C.a600}" stroke-width="9" stroke-linecap="round"/><rect x="-34" y="-6" width="68" height="14" rx="7" fill="${C.a400}" ${ink(4, ol)}/>`;
  for (let k = 1; k <= 3; k++) g += `<path d="M ${-k * 22} -120 L ${-k * 22} ${-120 + 28 + k * 12} Q ${-k * 22} ${-56 + k * 6} 0 ${-56 + k * 6} Q ${k * 22} ${-56 + k * 6} ${k * 22} ${-120 + 28 + k * 12} L ${k * 22} -120" fill="none" stroke="${C.a600}" stroke-width="7" stroke-linecap="round"/>`;
  for (let k = -3; k <= 3; k++) { const h = 24 + 4 * Math.sin(t * 9 + k * 1.7); g += `<path d="M ${k * 22} -124 q -7 ${f1(-h * 0.55)} 0 ${f1(-h)} q 7 ${f1(h * 0.45)} 0 ${f1(h)} Z" fill="${C.a300}"/>`; }
  return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-140" r="120" fill="url(#gAmber)" opacity="0.5"/>${g}</g>`;
}
function pilar(x, top, base, w = 96) {
  return rect(x - w / 2, top, w, base - top, '#4A3F36', ink(6, NIGHT_OL)) + rect(x + w * 0.14, top + 4, w * 0.3, base - top - 8, '#56493F') +
    rect(x - w / 2 - 18, top - 28, w + 36, 32, C.a600, `rx="6" ${ink(5, NIGHT_OL)}`) + rect(x - w / 2 - 18, base - 30, w + 36, 32, '#3A322B', `rx="6" ${ink(5, NIGHT_OL)}`);
}
function santuarioDentro(t, o = {}) {
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#1E1A17"/>`;
  for (let r = 0; r < 14; r++) for (let c = 0; c < 13; c++) {
    const x = c * 180 - (r % 2) * 90 - 120, y = -60 + r * 70;
    s += `<rect x="${x + 4}" y="${y}" width="172" height="64" rx="8" fill="${(r * 7 + c * 3) % 5 ? '#2A241F' : '#2F2822'}" stroke="#120E0B" stroke-width="5"/>`;
  }
  s += floor('dusk', 0, 860);
  s += `<circle cx="960" cy="480" r="780" fill="url(#gAmber)" opacity="${f1((o.glow ?? 0.25) * 100) / 100}"/>`;
  return s;
}
const VEU = { X0: 500, X1: 1420, Y0: 122, Y1: 862 };
function veuCena(t, p, o = {}) {
  let s = santuarioDentro(t, { glow: (o.glow ?? 0.22) + 0.4 * p });
  s += menorah(220, 868, 1.55, t, NIGHT_OL);
  [VEU.X0 - 125, VEU.X1 + 125].forEach((x) => (s += pilar(x, 60, 872)));
  s += veil(p, VEU.X0, VEU.X1, VEU.Y0, VEU.Y1, { id: o.id || 'vv', querubins: 1, linho: true, fios: true, metades: true, beamTo: H + 80, gapMax: o.gapMax ?? 200 });
  return s;
}
function poeiraAlto(t, t0, x, y, n = 10) {
  let g = '';
  const r = rng(91);
  for (let i = 0; i < n; i++) {
    const ph = clamp((t - t0 - r() * 0.5) / 1.4), dx = (r() - 0.5) * 260;
    if (ph <= 0 || ph >= 1) continue;
    g += `<circle cx="${f1(x + dx + ph * 20)}" cy="${f1(y + ph * ph * 520)}" r="${f1(3 + r() * 4)}" fill="#C9B79E" opacity="${f1((1 - ph) * 0.8 * 100) / 100}"/>`;
  }
  return g;
}
// Seta "de alto a baixo", desenhada de cima para baixo.
function seta(x, y0, y1, a) {
  if (a <= 0) return '';
  const y = lerp(y0, y1, a);
  let g = `<line x1="${x}" y1="${y0}" x2="${x}" y2="${f1(y - 24)}" stroke="${C.ink}" stroke-width="28" stroke-linecap="round"/><line x1="${x}" y1="${y0}" x2="${x}" y2="${f1(y - 24)}" stroke="${C.b500}" stroke-width="14" stroke-linecap="round"/>`;
  g += `<path d="M ${x - 40} ${f1(y - 50)} L ${x} ${f1(y + 8)} L ${x + 40} ${f1(y - 50)} Z" fill="${C.b500}" ${ink(7)}/>`;
  return g;
}

// ---------------------------------------------------------------- salas e lugares
// A sala trancada à noite (João 20:19, 26), a mesma do "depois da cruz".
function lamparina(x, y, t, glow = 1, ol = C.ink) {
  return `<circle cx="${x}" cy="${y - 40}" r="${f1(420 + 12 * Math.sin(t * 7))}" fill="url(#gAmber)" opacity="${f1(0.45 * glow * 100) / 100}"/>
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 400}" stroke="${ol}" stroke-width="14" stroke-linecap="round"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y + 400}" stroke="${C.wood}" stroke-width="6" stroke-linecap="round"/>
    <path d="M ${x - 42} ${y} Q ${x} ${y + 28} ${x + 42} ${y} L ${x + 54} ${y - 8} L ${x - 30} ${y - 10} Z" fill="${C.p400}" ${ink(5, ol)}/>` + flame(x + 44, y - 8, 11, 38 + 6 * Math.sin(t * 11), C.p300) + flame(x + 44, y - 8, 6, 22 + 4 * Math.sin(t * 13), C.a300);
}
function sala(t, o = {}) {
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#211C19"/>`;
  for (let r = 0; r < 13; r++) for (let c = 0; c < 13; c++) { const x = c * 170 - (r % 2) * 85 - 60, y = 10 + r * 62; if (y < 760) s += `<rect x="${x + 6}" y="${y}" width="158" height="54" rx="8" fill="${(r * 7 + c * 3) % 5 ? '#2B2420' : '#302925'}" stroke="#15110F" stroke-width="5"/>`; }
  const dx = o.doorX ?? 250;
  s += rect(dx - 120, 300, 240, 480, '#120F0D', ink(7, NIGHT_OL));
  s += `<g transform="translate(${dx - 112} 0)">${rect(0, 308, 224, 472, '#5A3F2C', ink(5, NIGHT_OL))}${[1, 2].map((k) => `<line x1="${k * 75}" y1="312" x2="${k * 75}" y2="776" stroke="#3E2B1E" stroke-width="6"/>`).join('')}</g>`;
  s += rect(dx - 150, 520, 300, 30, C.wood, `rx="8" ${ink(5, NIGHT_OL)}`) + rect(dx - 160, 506, 26, 58, C.ch300, `rx="6" ${ink(4, NIGHT_OL)}`) + rect(dx + 134, 506, 26, 58, C.ch300, `rx="6" ${ink(4, NIGHT_OL)}`);
  s += rect(-300, 780, W + 600, 600, '#1A1613') + `<line x1="-300" y1="780" x2="${W + 300}" y2="780" stroke="${NIGHT_OL}" stroke-width="6"/>`;
  if (o.lamp !== false) s += lamparina(o.lampX ?? 1650, 420, t, 1, NIGHT_OL);
  return s;
}
// O nascer do sol (o domingo).
function bgSunrise(t, o = {}) {
  let s = `<rect x="-600" width="${W + 1200}" height="${H}" fill="url(#skySunrise)"/>`;
  s += sun(o.sunX ?? 1500, o.sunY ?? 330, 58, t) + `<circle cx="${o.sunX ?? 1500}" cy="${o.sunY ?? 330}" r="520" fill="url(#gPeach)" opacity="0.35"/>`;
  s += clouds(t, o.ox || 0, '#FFF6EE', '#F1DCCB');
  s += hills(GROUND - 135, 80, 0.0032, o.seed || 5, '#EBDCCF', (o.ox || 0) * 0.3) + hills(GROUND - 55, 55, 0.0055, (o.seed || 5) + 2, '#E0CFC0', (o.ox || 0) * 0.6);
  s += floor('day', o.ox || 0);
  return s;
}
function flores(x, y, s, t, seed) {
  const r = rng(seed); let g = '';
  for (let i = 0; i < 6; i++) {
    const dx = (r() - 0.5) * 120, h = 30 + r() * 40, sw = Math.sin(t * 1.6 + i + seed) * 3, col = pick(r, [C.a300, C.r300, '#FFFFFF', C.b300]);
    g += `<line x1="${f1(dx)}" y1="0" x2="${f1(dx + sw)}" y2="${f1(-h)}" stroke="#3E4A3A" stroke-width="5" stroke-linecap="round"/><circle cx="${f1(dx + sw)}" cy="${f1(-h)}" r="10" fill="${col}" ${ink(3)}/>`;
  }
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">${g}</g>`;
}
function passaros(t, t0, x0, y0, n = 5, col = C.ink) {
  let g = '';
  for (let i = 0; i < n; i++) {
    const p = t - t0 - i * 0.12;
    if (p < 0) continue;
    const x = x0 + i * 40 + p * (150 + i * 20), y = y0 - p * (40 + i * 8) + Math.sin(i * 2) * 20, fl = Math.sin(t * 16 + i) * 8;
    if (y < -60 || x > W + 60) continue;
    g += `<path d="M ${f1(x - 16)} ${f1(y - fl)} Q ${f1(x - 6)} ${f1(y - 6)} ${f1(x)} ${f1(y)} Q ${f1(x + 6)} ${f1(y - 6)} ${f1(x + 16)} ${f1(y - fl)}" stroke="${col}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  return g;
}
// O túmulo vazio ao amanhecer: a pedra rolada e a luz na entrada, sem ninguém dentro (Lucas 24:1-3).
function tumuloVazio(t, o = {}) {
  let s = bgSunrise(t, { sunX: o.sunX ?? 1540, sunY: o.sunY ?? 300, seed: 61 });
  s += olive(240, GROUND + 160, 1.6) + olive(1740, GROUND + 150, 1.4);
  s += sepulcro(o.x ?? 960, o.base ?? 830, o.s ?? 1.3, { tom: 'amanhecer', rola: o.rola ?? 1, luz: o.luz ?? 0.8, id: o.id || 'tv' });
  s += flores(520, 870, 1.0, t, 4) + flores(1400, 880, 1.1, t, 5);
  if (o.aves) s += passaros(t, o.aves, 1200, 260, 5, '#8C7A62');
  return s;
}
// O pôr do sol na cruz (Jesus já morto): a cruz em silhueta contra o céu quente.
function cruzTarde(t, o = {}) {
  return bgDusk(t) + sun(o.sunX ?? 1600, o.sunY ?? 520, 54, t) + hill(960, 880, 1300, DUSK_HILL, DUSK_OL) + crossFig(960, 905, 1.5, { plaque: true, fill: CRUZ_TARDE, rim: C.p400, bow: 1 });
}
// Um quarto de hoje, à noite: a janela com os prédios acesos, a luminária e alguém sentado com a Bíblia aberta.
function quartoHoje(t, o = {}) {
  let s = `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#2E3440"/>`;
  s += `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="url(#gAmber)" opacity="0"/>`;
  // a janela: céu da noite e os prédios com as janelas acesas
  const WX = 1080, WY = 140, WW = 640, WH = 470;
  s += `<clipPath id="janela"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}"/></clipPath><g clip-path="url(#janela)"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" fill="#141B2A"/>${stars(t, 26, 5, 300, 0.6)}`;
  const r = rng(404);
  for (let b = 0; b < 8; b++) {
    const bx = WX - 20 + b * 88, bh = 160 + r() * 220, by = WY + WH - bh;
    s += rect(bx, by, 80, bh + 10, b % 2 ? '#1E2636' : '#232C3E');
    for (let wy = by + 18; wy < WY + WH - 20; wy += 34) for (let wx = bx + 12; wx < bx + 70; wx += 22) if (r() < 0.45) s += rect(wx, wy, 10, 14, C.a300, `opacity="${f1((0.5 + 0.5 * r()) * 100) / 100}"`);
  }
  s += `</g>` + `<rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" fill="none" stroke="#1A1E26" stroke-width="22"/><line x1="${WX + WW / 2}" y1="${WY}" x2="${WX + WW / 2}" y2="${WY + WH}" stroke="#1A1E26" stroke-width="14"/>`;
  s += rect(-300, 800, W + 600, 600, '#3B3530') + `<line x1="-300" y1="800" x2="${W + 300}" y2="800" stroke="#14110F" stroke-width="6"/>`;
  // a luminária de pé
  const LX = 560;
  s += `<circle cx="${LX}" cy="330" r="${f1(460 + 8 * Math.sin(t * 2))}" fill="url(#gAmber)" opacity="0.55"/>`;
  s += `<line x1="${LX}" y1="320" x2="${LX}" y2="800" stroke="#14110F" stroke-width="12"/><path d="M ${LX - 70} 330 L ${LX - 44} 250 L ${LX + 44} 250 L ${LX + 70} 330 Z" fill="#E9D7B5" ${ink(5, '#14110F')}/><ellipse cx="${LX}" cy="800" rx="60" ry="12" fill="#14110F"/>`;
  // a poltrona
  const PX = o.x ?? 860;
  s += `<path d="M ${PX - 170} 800 L ${PX - 170} 610 Q ${PX - 170} 560 ${PX - 120} 560 L ${PX + 120} 560 Q ${PX + 170} 560 ${PX + 170} 610 L ${PX + 170} 800 Z" fill="#7A4E3A" ${ink(6, '#14110F')}/>`;
  s += `<rect x="${PX - 200}" y="660" width="70" height="140" rx="26" fill="#6A4232" ${ink(6, '#14110F')}/><rect x="${PX + 130}" y="660" width="70" height="140" rx="26" fill="#6A4232" ${ink(6, '#14110F')}/>`;
  const rd = { ...HOJE, x: PX, y: 712, s: 1.3, armL: 34, armR: 34, mood: o.mood || 'calm', look: o.look ?? 0, ol: '#14110F' };
  s += sentado(rd);
  const [, hy] = mao(rd, 1);
  s += livro(PX, hy + 30, 0.72, t, prog((t % 8) / 8, 0.88, 1));
  // a mesinha com o celular
  s += rect(PX + 260, 640, 160, 20, '#5A3F2C', `rx="6" ${ink(5, '#14110F')}`) + rect(PX + 300, 660, 16, 140, '#5A3F2C', ink(4, '#14110F')) + rect(PX + 364, 660, 16, 140, '#5A3F2C', ink(4, '#14110F'));
  s += rect(PX + 316, 626, 70, 14, '#14110F', 'rx="4"');
  return s;
}
// Quem lê ao amanhecer (o fecho, como nos longos anteriores).
function leitor(t, o = {}) {
  const x = o.x ?? 640;
  let s = bgSunrise(t, { sunX: o.sunX ?? 1460, sunY: o.sunY ?? 400, seed: 31 });
  s += city(1700, GROUND + 4, 0.42, t);
  s += olive(x - 330, GROUND + 250, 2.2) + flores(x + 350, 860, 1.0, t, 12) + flores(x - 560, 850, 0.9, t, 13);
  const rd = { ...LEITOR, x, y: 764, s: 1.3, armL: 32, armR: 32, mood: o.mood || 'closed', look: o.look ?? 0, rock: C.g500 };
  s += sentado(rd);
  const [, hy] = mao(rd, 1);
  s += livro(x, hy + 34, 0.72, t, prog((t % 7) / 7, 0.86, 1));
  return s;
}
function appCard(t, t0, t1) {
  const p = pop(t, t0, 0.45), q = 1 - E.in(prog(t, t1 - 0.3, t1)), k = clamp(p) * q;
  if (k <= 0) return '';
  return `<div class="app" style="position:absolute;left:1010px;top:236px;margin:0;opacity:${f1(k * 100) / 100};transform:scale(${f1(Math.min(p, 1.06) * 100) / 100});transform-origin:50% 50%">
    <div class="app-row"><img class="app-icon" src="assets/icon.png"><div><div class="app-name">PregaAI</div><div class="app-desc">Plano de leitura bíblica</div></div></div>
    <img class="play" src="assets/google-play-badge.png" alt="Disponível no Google Play">
  </div>`;
}

// ---------------------------------------------------------------- as quatro cenas do salmo
// Desenhos dos cartões das cenas, numa moldura em 1160..1840 × 260..800 (a mesma do "quando Jesus morreu").
const MOLDURA = (id, g, fundo = C.paper) => `<clipPath id="${id}"><rect x="1160" y="260" width="680" height="540" rx="44"/></clipPath><g clip-path="url(#${id})"><rect x="1160" y="260" width="680" height="540" fill="${fundo}"/>${g}</g><rect x="1160" y="260" width="680" height="540" rx="44" fill="none" ${ink(6)}/>`;
function artInsultos(t, id) {
  let g = `<rect x="1160" y="260" width="680" height="540" fill="url(#skyGloom)"/>` + hill(1660, 560, 420, '#D6CCC1') + crossFig(1660, 580, 0.42, { plaque: true, rim: C.g300, bow: 0.2 });
  g += rect(1160, 700, 680, 100, '#E2D8CC');
  g += person({ ...povo(1101), x: 1310, y: 800, s: 0.95, look: 1, mood: 'angry', armR: 140, armL: 20, lean: -4 });
  g += person({ ...povo(1102), x: 1460, y: 790, s: 0.9, look: 1, mood: 'angry', armL: 24, lean: 6 * Math.sin(t * 6) });
  return MOLDURA(id, g, '#E6E0D9');
}
function artLideres(t, id) {
  let g = `<rect x="1160" y="260" width="680" height="540" fill="url(#skyGloom)"/>` + hill(1720, 600, 380, '#D6CCC1') + crossFig(1720, 616, 0.36, { plaque: true, rim: C.g300, bow: 0.2 });
  g += rect(1160, 720, 680, 80, '#E2D8CC');
  [[1280, CHEFE(1201), 30], [1420, MESTRE(1202), 150], [1560, ANCIAO(1203), 30]].forEach(([x, P, ar], i) => (g += person({ ...P, x, y: 800 - (i % 2) * 8, s: 0.82, look: 0.8, mood: 'happy', armR: ar, armL: 20 })));
  return MOLDURA(id, g, '#E6E0D9');
}
function artMaos(t, id) {
  let g = `<rect x="1160" y="260" width="680" height="540" fill="#211C19"/><circle cx="1500" cy="560" r="300" fill="url(#gWhite)" opacity="0.5"/>` + rect(1160, 720, 680, 80, '#1A1613');
  g += person({ ...TOME, x: 1290, y: 800, s: 0.8, look: 1, mood: 'fear', t, armL: 18, armR: 30, rim: '#FFFFFF' });
  g += person({ ...VIVO, x: 1530, y: 800, s: 0.92, look: -0.4, mood: 'calm', armL: 112, armR: 112, rim: C.a300 });
  return MOLDURA(id, g, '#211C19');
}
function artRoupas(t, id) {
  let g = `<rect x="1160" y="260" width="680" height="540" fill="url(#skyGloom)"/>` + rect(1160, 640, 680, 160, '#E2D8CC');
  g += person({ ...soldado(813), x: 1290, y: 760, s: 0.9, kneel: true, look: 1, mood: 'happy', armR: 50 });
  g += `<ellipse cx="1560" cy="740" rx="230" ry="38" fill="${C.g100}" ${ink(5)}/>` + tunica(1560, 700, 0.5, { id: id + 't' });
  g += dado(1420, 742, 0.9, 20, 5) + dado(1480, 760, 0.9, -12, 3);
  return MOLDURA(id, g, '#E6E0D9');
}
const CENAS = [null,
  { titulo: 'Os insultos', ref: 'Salmo 22:7', art: artInsultos },
  { titulo: 'A frase dos líderes', ref: 'Salmo 22:8', art: artLideres },
  { titulo: 'As mãos e os pés', ref: 'Salmo 22:16', art: artMaos },
  { titulo: 'As roupas sorteadas', ref: 'Salmo 22:18', art: artRoupas },
];
// Cartão de uma das quatro cenas: o número, o título, a referência e o desenho; embaixo, a linha do salmo que a
// voz cita (verso: html), com marca-texto. No curto, o cartão estreito com a mesma linha.
function cartaoCena(t, t0, n, verso, h) {
  const it = CENAS[n];
  if (NARROW) {
    const p = E.out(prog(t, t0 + 0.05, t0 + 0.45));
    return { svg: escuroCartao(t), html: cartaoHTML({ p, eyebrow: `Cena ${n} do salmo`, titulo: it.titulo, linhas: verso ? [{ txt: hl(verso, h), ref: it.ref }] : [{ txt: `<span style="color:${C.muted}">${it.ref}</span>` }], topN: 540 }) };
  }
  let s = papel(0.3, 1500, 530);
  const ap = pop(t, t0 + 0.15, 0.55);
  if (ap > 0) s += `<g transform="translate(1500 530) scale(${f1(ap * 1000) / 1000}) translate(-1500 -530)">${it.art(t, 'mc' + n)}</g>`;
  const X = 170, top = 400, size = 96;
  s += dot(X + 46, top - size - 70, n, pop(t, t0, 0.45) * 1.15);
  s += label(X + 120, top - size - 52, `Cena ${n} do salmo`, { anchor: 'start', fam: 'Geist', w: 600, size: 30, fill: C.muted, op: E.out(prog(t, t0 + 0.1, t0 + 0.5)), ls: '0.06em' });
  const p = E.out(prog(t, t0 + 0.1, t0 + 0.5));
  s += `<text x="${X}" y="${f1(top + (1 - p) * 26)}" font-family="Lora" font-weight="600" font-size="${size}" fill="${C.inkDeep}" opacity="${f1(p * 100) / 100}">${esc(it.titulo)}</text>`;
  s += label(X + 4, top + 70, it.ref, { anchor: 'start', fam: 'Geist Mono', w: 500, size: 36, fill: C.muted, op: E.out(prog(t, t0 + 0.35, t0 + 0.8)) });
  const vp = verso ? E.out(prog(t, t0 + 0.3, t0 + 0.8)) : 0;
  const html = vp > 0 ? `<div style="position:absolute;left:${X}px;top:540px;width:900px;font:600 54px/1.3 Lora;color:${C.inkDeep};opacity:${f1(vp * 100) / 100}">“${hl(verso, h)}”</div>` : '';
  return { svg: s, html };
}

// ================================================================ abertura
// "Deus abandonou Jesus na cruz?" "Na cruz, o próprio Jesus perguntou: Meu Deus! Meu Deus! Por que me abandonaste?"
// O primeiro quadro já está em movimento: a cruz do meio de perto, no escuro, e a luz que cresce atrás dela.
// Os anéis do grito saem nas duas vezes de "Meu" e em "abandonaste". k: [t0 da luz, meu1, meu2, abandonaste].
function grito(t, k, o = {}) {
  const light = 0.06 + 0.22 * E.inOut(prog(t, k[0], k[0] + 2.2));
  let s = cruzPerto(t, { light });
  s += anel(CABECA[0], CABECA[1], t, k[1]) + anel(CABECA[0], CABECA[1], t, k[2]) + anel(CABECA[0], CABECA[1], t, k[3] - 0.15);
  return s;
}
function scAbertura(t) {
  const k = [-1, wt(1, 6), wt(1, 8), wt(1, 13)];
  const z = lerp(1.35, 1.0, E.inOut(prog(t, -0.2, fim(0) + 0.8))) + 0.06 * prog(t, seg(1), antes(2));
  const fy = lerp(CABECA[1] + 60, 470, E.inOut(prog(t, -0.2, fim(0) + 0.8)));
  return { svg: cam(grito(t, k), 960, fy, z, 0, 470 - fy), html: '' };
}
// "E tem um detalhe que quase ninguém percebe: essa frase já estava escrita havia séculos."
// O rolo do salmo à luz da lamparina; a primeira linha acende em "frase".
function scRolo(t) {
  const d = E.out(prog(t, wordTime(2, 'frase') - 0.2, wordTime(2, 'frase') + 0.5));
  const z = lerp(1.25, 1.1, E.inOut(prog(t, antes(2), antes(3))));
  return { svg: camRolo(mesaRolo(t, { destaque: d }), 0.02, z), html: '' };
}
// "É a primeira linha do Salmo 22." (e a abertura do curto 2, frase 59)
function cartaoSalmo1(t, t0, i) {
  const p = E.out(prog(t, t0 + 0.05, t0 + 0.5)), h = prog(t, seg(i) + 0.2, fim(i));
  return { svg: fundoCartao(t), html: cartaoHTML({ p, eyebrow: 'A Bíblia diz', titulo: 'Salmo 22', linhas: [{ txt: hl('Meu Deus! Meu Deus! Por que me abandonaste?', h), ref: 'Salmo 22:1' }], topW: 260 }) };
}
const scSalmo1 = (t) => cartaoSalmo1(t, antes(3), 3);
// "E esse mesmo salmo descreve outras quatro cenas daquele dia. Os insultos. O que os líderes religiosos disseram.
// As mãos e os pés. E as roupas sorteadas." Quatro molduras vazias; cada uma acende quando a voz chega nela.
const RAMOS = [null, [5, 'insultos'], [5, 'líderes'], [5, 'mãos'], [5, 'roupas']];
function scQuatro(t) {
  const a0 = depois(3), tq = wordTime(4, 'quatro');
  let s = papel(0.22, 960, 420);
  const FW = 380, FH = 302, k = FW / 680;
  for (let n = 1; n <= 4; n++) {
    const fx = 960 + (n - 2.5) * 420 - FW / 2, fy = 250, p = pop(t, tq - 0.15 + (n - 1) * 0.1, 0.4);
    if (p <= 0) continue;
    const tn = wordTime(RAMOS[n][0], RAMOS[n][1]) - 0.15, on = E.out(prog(t, tn, tn + 0.4));
    s += `<g transform="translate(${f1(fx + FW / 2)} ${f1(fy + FH / 2)}) scale(${f1(p * 1000) / 1000}) translate(${f1(-fx - FW / 2)} ${f1(-fy - FH / 2)})">`;
    s += `<rect x="${fx}" y="${fy}" width="${FW}" height="${FH}" rx="30" fill="#fff" stroke="${C.border}" stroke-width="5" stroke-dasharray="16 12"/>`;
    if (on > 0) s += `<g opacity="${f1(on * 100) / 100}" transform="translate(${fx} ${fy}) scale(${f1(k * 10000) / 10000}) translate(-1160 -260)">${CENAS[n].art(t, 'q' + n)}</g>`;
    s += dot(fx + 6, fy + 6, n, 0.7 + 0.15 * bump(t, tn, 0.5));
    s += label(fx + FW / 2, fy + FH + 70, CENAS[n].titulo, { fam: 'Lora', w: 600, size: 40, op: 0.25 + 0.75 * on });
    s += `</g>`;
  }
  return { svg: cam(s, 960, 470, 1.0 + 0.04 * prog(t, a0, at(6))), html: '' };
}
// "A resposta passa pelo fim desse salmo, e explica por que esse grito importa pra você até hoje."
// A câmera corre o rolo até o fim, que acende; em "importa", alguém de hoje lê a Bíblia.
function scResposta(t) {
  const tc = wordTime(6, 'importa') - 0.25;
  const A = (u) => { const pan = E.inOut(prog(u, at(6), wordTime(6, 'salmo') + 0.3)); return camRolo(mesaRolo(u, { destaque: 1 - pan, fimLuz: E.out(prog(u, wordTime(6, 'fim') - 0.2, wordTime(6, 'salmo') + 0.4)) }), pan, 1.1); };
  const B = (u) => cam(quartoHoje(u, { mood: 'calm', look: 0.2 }), 900, 560, 1.06 + 0.04 * prog(u, tc, at(7)));
  return { svg: xcut(t, tc, A, B), html: '' };
}
// "E guarda uma palavra pequena do grito. Ela vai voltar." A frase do grito com uma palavra escondida, duas vezes.
// (A mesma peça volta nas frases 39 e 40, quando a palavra se revela.)
// cobre (0..1): a caixa azul com "?" cobre cada "Meu"; rev (0..1): a palavra aparece em azul; foco: [meu1, meu2]
// (0..1) realce de cada uma; deus: sublinha "Deus" (em "não diz Deus").
function fraseMeu(t, o = {}) {
  const N = NARROW, fs = N ? 46 : 104, cobre = clamp(o.cobre ?? 0), rev = clamp(o.rev ?? 0), m = o.foco || [0, 0];
  const corTexto = N ? '#F4F1EC' : C.inkDeep;
  const meu = (k) => {
    const mk = cobre * (1 - rev), sc = 1 + 0.16 * (m[k] || 0);
    const box = mk > 0.002 ? `<span style="position:absolute;left:50%;top:50%;width:${f1(fs * 1.9)}px;height:${f1(fs * 1.0)}px;margin:${f1(-fs * 0.5)}px 0 0 ${f1(-fs * 0.95)}px;box-sizing:border-box;border-radius:${f1(fs * 0.22)}px;background:${C.b500};border:${N ? 3 : 5}px solid ${C.b600};box-shadow:0 ${N ? 4 : 8}px 0 0 ${C.b600};transform:scale(${f1(mk * 1000) / 1000});display:flex;align-items:center;justify-content:center;font:800 ${f1(fs * 0.6)}px/1 Geist;color:#fff">?</span>` : '';
    return `<span style="display:inline-block;position:relative;transform:scale(${f1(sc * 100) / 100})"><span style="color:${rev > 0.5 ? (N ? '#6FB1FC' : C.b500) : corTexto};opacity:${f1((1 - mk * 0.999) * 1000) / 1000}">Meu</span>${box}</span>`;
  };
  const deus = `<span style="${o.deus ? `text-decoration:underline ${C.r400} ${N ? 4 : 7}px;text-underline-offset:${N ? 8 : 14}px` : ''}">Deus!</span>`;
  const p = clamp(o.p ?? 1);
  return `<div style="position:absolute;left:${N ? 690 : 160}px;width:${N ? 480 : 1600}px;top:${N ? 545 : 250}px;text-align:center;font:600 ${fs}px/1.3 Lora;color:${corTexto};opacity:${f1(p * 100) / 100};transform:translateY(${f1((1 - p) * 24)}px)">${meu(0)} ${deus} ${meu(1)} ${deus}<br>Por que me abandonaste?
    <div style="margin-top:${N ? 20 : 40}px;font:500 ${N ? 17 : 32}px/1 'Geist Mono';color:${N ? '#A8A7A3' : C.muted}">Salmo 22:1</div></div>`;
}
function scGuarda(t) {
  const a0 = at(7), tp = wordTime(7, 'pequena') - 0.25;
  const p = E.out(prog(t, a0, a0 + 0.5)), mask = pop(t, tp, 0.45);
  return { svg: cam(fundoCartao(t), 960, 470, 1.0 + 0.03 * prog(t, a0, antes(8))), html: fraseMeu(t, { p, cobre: mask }) };
}

// ================================================================ 1. os insultos (Marcos 15:25, 27; Mateus 27:39-40; Salmo 22:7)
// "Marcos conta que Jesus foi crucificado às nove da manhã, entre dois ladrões." As três cruzes se levantam, de manhã.
function scNove(t) {
  const up = (w, d = 0) => E.out(prog(t, wordTime(8, w) - 0.25 + d, wordTime(8, w) + 0.55 + d));
  const s = bgGloom(t, { seed: 921, sun: [380, 330] }) + golgota(t, { k: [up('crucificado'), up('ladrões'), up('ladrões', 0.25)] });
  return { svg: cam(s, 960, 430, 1.06 - 0.05 * E.sine(prog(t, antes(8), at(9)))), html: '' };
}
// "A primeira cena do salmo diz: balançando a cabeça, lançam insultos contra mim."
function scCena1(t) {
  const t0 = at(9), h = prog(t, wordTime(9, 'balançando') - 0.1, fim(9));
  return cartaoCena(t, t0, 1, 'balançando a cabeça, lançam insultos contra mim', h);
}
// "Mateus conta que, na cruz, os que passavam lançavam insultos, balançando a cabeça. E diziam: Desça da cruz, se
// é Filho de Deus!" Os que passam na estrada, de dia, balançam a cabeça; um para e grita, apontando para a cruz.
const PASSAM = [[0, 1501], [-260, 1502], [-520, 1503], [-780, 1504], [-1040, 1505]];
function scPassam(t) {
  const a0 = at(10), td = wordTime(11, 'desça') - 0.3, grita = E.out(prog(t, td, td + 0.35));
  const PARA = NARROW ? 790 : 760;
  let s = bgGloom(t, { seed: 961 }) + (NARROW ? golgotaLonge(t, 1150, 500, 0.85) : golgotaLonge(t, 1300, 520, 0.95)) + floor('day', 0, 700);
  s += `<path d="M -400 ${FLOOR_Y + 30} C 300 ${FLOOR_Y - 10} 1300 ${FLOOR_Y - 30} ${W + 400} ${FLOOR_Y - 60} L ${W + 400} ${FLOOR_Y + 120} L -400 ${FLOOR_Y + 120} Z" fill="#E9DFD2"/>`;
  const andar = (t - a0) * 150;
  PASSAM.forEach(([dx, seed], i) => {
    const para = i === 1, xBase = (NARROW ? 420 : 380) + dx + andar, x = para ? Math.min(xBase, PARA) : xBase;
    if (x < -200 || x > W + 200) return;
    const parado = para && xBase >= PARA;
    const nod = Math.sin(t * 7 + i * 1.7);
    s += person({ ...povo(seed), x, y: FLOOR_Y - (i % 2) * 14, s: 1.2, look: parado ? 1 : nod > 0 ? 1 : -0.4, mood: 'angry', lean: parado ? -6 * grita : 7 * nod, walk: parado ? null : t * 5 + i, armR: parado ? lerp(20, 150, grita) : 20, armL: 18 });
  });
  return { svg: cam(s, 960, 520, 1.02 + 0.05 * prog(t, a0, antes(12))), html: '' };
}

// ================================================================ 2. a frase dos líderes (Salmo 22:8; Mateus 27:41-43)
// "A segunda cena é uma frase. No salmo, quem zomba diz: Recorra ao Senhor! Que o Senhor o liberte!"
function scCena2(t) {
  const h = prog(t, wordTime(13, 'recorra') - 0.1, fim(13));
  return cartaoCena(t, at(12), 2, t > seg(13) - 0.3 ? 'Recorra ao Senhor! Que o Senhor o liberte!' : null, h);
}
// "Na cruz, os chefes dos sacerdotes, os mestres da lei e os líderes religiosos disseram: Ele confiou em Deus. Que
// Deus o salve agora." Os três grupos na frente da cruz; cada um entra quando a voz chega nele; apontam para cima.
const LIDERES = [[300, CHEFE(1301)], [470, CHEFE(1302)], [700, MESTRE(1303)], [870, MESTRE(1304)], [1100, ANCIAO(1305)], [1270, ANCIAO(1306)]];
const LX = NARROW ? [705, 795, 890, 985, 1080, 1170] : LIDERES.map(([x]) => x), LS = NARROW ? 1.0 : 1.2;
function lideres(t, o = {}) {
  let s = bgGloom(t, { seed: 971 }) + (NARROW ? golgotaLonge(t, 960, 470, 0.72) : golgotaLonge(t, 1560, 520, 0.8)) + floor('day', 0, 700);
  const tg = o.tg || [-9, -9, -9], tc = o.tc ?? 1e9;
  LIDERES.forEach(([x, P], i) => {
    const g = Math.floor(i / 2), p = pop(t, tg[g] + (i % 2) * 0.1, 0.4);
    if (p <= 0) return;
    const point = E.back(prog(t, tc + i * 0.06, tc + 0.4 + i * 0.06)), bob = Math.abs(Math.sin(t * 8 + i * 1.3)) * 8 * (t > tc ? 1 : 0);
    s += person({ ...P, x: LX[i], y: FLOOR_Y - (i % 2) * 14 - bob, s: LS * Math.min(1, p), look: 0.8, mood: t > tc ? 'happy' : 'calm', armR: i % 2 ? lerp(20, 150, point) : 22, armL: 20 });
  });
  if (o.rolo) LX.slice(2, 4).forEach((x, i) => (s += `<g transform="translate(${f1(x - 52 * LS / 1.2)} ${f1(FLOOR_Y - 150 * LS / 1.2 - (i % 2 ? 14 : 0))}) rotate(-20) scale(${LS / 1.2})"><rect x="-12" y="-46" width="24" height="92" rx="12" fill="#EFE3C8" ${ink(5)}/><rect x="-16" y="-54" width="32" height="12" rx="6" fill="${C.wood}" ${ink(4)}/><rect x="-16" y="42" width="32" height="12" rx="6" fill="${C.wood}" ${ink(4)}/></g>`));
  return s;
}
function scLideres(t) {
  const tg = [wordTime(14, 'chefes') - 0.15, wordTime(14, 'mestres') - 0.15, wordTime(14, 'líderes') - 0.15];
  const s = lideres(t, { tg, tc: wordTime(14, 'confiou') - 0.2, rolo: true });
  return { svg: cam(s, 900, 560, 1.02 + 0.05 * prog(t, at(14), at(15))), html: '' };
}
// "Entre eles estavam os mestres da lei." A câmera vai até os dois com o rolo da Lei debaixo do braço.
function scMestres(t) {
  const k = E.inOut(prog(t, at(15), seg(15) + 1.2));
  const s = lideres(t, { tc: -9, rolo: true });
  const fx = lerp(900, NARROW ? 937 : 785, k), z = lerp(1.07, 1.45, k);
  return { svg: cam(s, fx, lerp(560, 640, k), z, 960 - fx, lerp(0, -40, k)), html: '' };
}
// "E zombaram com uma frase muito parecida com a do salmo." As duas frases, uma embaixo da outra.
function scParecida(t) {
  const a0 = at(16), p = E.out(prog(t, a0, a0 + 0.45)), tp = wordTime(16, 'parecida') - 0.2, k = E.out(prog(t, tp, tp + 0.5));
  const m = (w) => `<span style="background:linear-gradient(${C.b300},${C.b300}) no-repeat;background-size:${f1(k * 100)}% 100%">${w}</span>`;
  return { svg: fundoCartao(t), html: cartaoHTML({ p, eyebrow: 'Muito parecida', linhas: [
    { txt: `Recorra ao ${m('Senhor')}! Que o ${m('Senhor')} o ${m('liberte')}!`, ref: 'Salmo 22:8' },
    { txt: `Ele confiou em ${m('Deus')}. Que ${m('Deus')} o ${m('salve')} agora`, ref: 'Mateus 27:43', op: E.out(prog(t, a0 + 0.3, a0 + 0.8)) },
  ], topW: 250, topN: 520 }) };
}

// ================================================================ 3. as mãos e os pés (Salmo 22:16; João 20:25; Lucas 24:39)
function scCena3(t) {
  const h = prog(t, wordTime(17, 'perfuraram') - 0.1, fim(17));
  return cartaoCena(t, depois(16), 3, t > wordTime(17, 'perfuraram') - 0.5 ? 'Perfuraram minhas mãos e meus pés' : null, h);
}
// "Os evangelhos não descrevem os pregos na hora da crucificação." Os quatro livros; a cruz ao fundo, de longe.
const LIVROS = ['Mateus', 'Marcos', 'Lucas', 'João'];
const REF_CRUZ = ['27:35', '15:24', '23:33', '19:18'];
function pilula(x, y, txt, o = {}) {
  const w = measure(txt, '700 40px Geist') + 64, on = o.on;
  return `<g opacity="${f1((o.op ?? 1) * 100) / 100}" transform="translate(${f1(x)} ${f1(y)}) scale(${f1((o.sc ?? 1) * 100) / 100})">
    <rect x="${f1(-w / 2)}" y="-34" width="${f1(w)}" height="76" rx="26" fill="${on ? C.b600 : C.border}"/>
    <rect x="${f1(-w / 2)}" y="-40" width="${f1(w)}" height="76" rx="26" fill="${on ? C.b500 : '#fff'}" stroke="${on ? C.b600 : C.border}" stroke-width="4"/>
    ${label(0, 12, txt, { size: 40, fill: on ? '#fff' : o.fill || C.ink })}</g>`;
}
function scEvangelhos(t) {
  const a0 = at(18), tn = wordTime(18, 'não') - 0.1;
  let s = papel(0.22, 960, 420) + crossFig(960, 880, 0.62, { fill: '#E2D9CD', plaque: true }) + crossFig(740, 892, 0.46, { fill: '#E8E0D5' }) + crossFig(1180, 892, 0.46, { fill: '#E8E0D5' });
  const apaga = E.out(prog(t, tn, tn + 0.8));
  // onde cada evangelho conta a crucificação, numa frase só ("o crucificaram"), sem descrever os pregos
  LIVROS.forEach((b, i) => {
    const q = pop(t, a0 + 0.1 + i * 0.12, 0.4), x = 960 + (i - 1.5) * 300;
    if (q > 0) s += pilula(x, 250, b, { sc: q, op: 1 - 0.15 * apaga }) + label(x, 340, REF_CRUZ[i], { fam: 'Geist Mono', w: 500, size: 32, fill: C.muted, op: clamp(q) });
  });
  return { svg: cam(s, 960, 520, 1.0 + 0.04 * prog(t, a0, at(19))), html: '' };
}
// "Mas, depois, Tomé falou das marcas dos pregos nas suas mãos." (João 20:25) Na sala, à noite, Tomé fala com os outros.
function scTome(t) {
  const a0 = at(19), tm = wordTime(19, 'marcas') - 0.2, g = E.inOut(prog(t, tm, tm + 0.5));
  let s = sala(t, { lampX: 1700 });
  [[560, DISCS[0]], [730, DISCS[1]], [900, DISCS[2]]].forEach(([x, P], i) => (s += person({ ...P, x, y: FLOOR_Y - (i % 2) * 14, s: 1.22, look: 1, mood: 'happy', rim: C.p400, t })));
  s += person({ ...TOME, x: 1220, y: FLOOR_Y, s: 1.3, look: -1, mood: t > tm ? 'sad' : 'calm', t, armL: lerp(18, 70, g) + 8 * Math.sin(t * 5) * g, armR: lerp(18, 60, g), rim: C.p400 });
  const k = E.inOut(prog(t, a0, tm + 0.6));
  return { svg: cam(s, lerp(900, 1050, k), 600, 1.02 + 0.1 * k, 0, 0), html: '' };
}
// "E Jesus, ressuscitado, disse aos discípulos: Vejam as minhas mãos e os meus pés. Sou eu mesmo!" (Lucas 24:39)
// Ele aparece no meio deles, de corpo inteiro, com luz atrás, e abre as mãos; os discípulos olham.
function scVejam(t) {
  const a0 = at(20), tr = wordTime(20, 'ressuscitado') - 0.3, tv = wordTime(20, 'vejam') - 0.2;
  const j = E.out(prog(t, tr, tr + 0.9)), show = E.inOut(prog(t, tv, tv + 0.6));
  let s = sala(t, { lampX: 1700 });
  s += `<circle cx="960" cy="560" r="${f1(300 + 160 * j)}" fill="url(#gWhite)" opacity="${f1(j * 0.55 * 100) / 100}"/>`;
  [[520, DISCS[0], 1], [690, DISCS[1], 1], [1230, TOME, -1], [1400, DISCS[3], -1]].forEach(([x, P, lk], i) => (s += person({ ...P, x, y: FLOOR_Y - (i % 2) * 14, s: 1.22, look: lk, mood: j > 0.5 ? (show > 0.5 ? 'happy' : 'fear') : 'sad', t, shake: j > 0.3 && show < 0.5 ? 1 : 0, rim: j > 0 ? '#FFFFFF' : C.p400 })));
  if (j > 0) s += person({ ...VIVO, x: 960, y: FLOOR_Y, s: 1.32, look: 0, mood: 'calm', armL: lerp(20, 112, show), armR: lerp(20, 112, show), rim: C.a300, op: clamp(j * 1.5) });
  return { svg: cam(s, 960, 600, 1.0 + 0.06 * prog(t, a0, at(21))), html: '' };
}

// ================================================================ 4. as roupas sorteadas (João 19:23-24; Salmo 22:18)
function scCena4(t) { return cartaoCena(t, at(21), 4, null, 0); }
// "Os soldados dividiram as roupas do condenado em quatro partes, uma pra cada um. Sobrou a túnica."
// Quatro soldados ajoelhados em volta do pano; cada peça vai para um; a túnica fica no meio e acende.
function scDividem(t) {
  const tq = wordTime(22, 'quatro') - 0.2, tu = wordTime(22, 'cada') - 0.2;
  const tp = [tq, tq + 0.35, tu, tu + 0.35];
  const ts = wordTime(23, 'túnica') - 0.3, glow = E.out(prog(t, ts, ts + 0.5));
  const s = divisao(t, { tp, pecas: tp.map((x) => E.inOut(prog(t, x - 0.3, x + 0.2)) * (1 - E.inOut(prog(t, x + 0.7, x + 1.1)))), glow, olhar: t > ts, id: 'a' });
  const k = E.inOut(prog(t, ts - 0.2, ts + 0.9)) * (NARROW ? 0.45 : 1); // no curto, a câmera sobe menos: as cabeças ficam abaixo da legenda
  return { svg: cam(s, 960, lerp(560, 800, k), lerp(1.02, 1.32, k), 0, lerp(0, -170, k)), html: '' };
}
// "Ela era sem costura, tecida numa única peça, de alto a baixo." Um soldado levanta a túnica aberta; uma luz
// corre por ela do alto até embaixo, sem achar costura.
function scSemCostura(t) {
  const a0 = at(24), ta = wordTime(24, 'alto') - 0.2, tb = wordTime(24, 'baixo') + 0.3;
  const linha = E.inOut(prog(t, ta, tb));
  let s = peDaCruz(t, { gx: 1400, gy: 470, gs: 0.8 });
  s += segurando(t, { x: 960, linha, glow: 0.35, id: 'tnS24' });
  return { svg: cam(s, 960, 600, 1.04 + 0.06 * prog(t, a0, at(25))), html: '' };
}
// "Eles disseram: Não a rasguemos." Dois soldados com a túnica entre eles; um ia puxar, o outro levanta a mão.
function scNaoRasguemos(t) {
  const a0 = at(25), tn = wordTime(25, 'não') - 0.3;
  const puxa = E.inOut(prog(t, a0, tn)) * (1 - E.inOut(prog(t, tn + 0.3, tn + 0.9))), para = E.back(prog(t, tn - 0.1, tn + 0.3));
  let s = peDaCruz(t, { gx: 1460, gy: 470, gs: 0.8 }) + entreDois(t, { puxa, para, id: 'tnE25' });
  return { svg: cam(s, 960, 600, 1.05 + 0.04 * prog(t, a0, at(26))), html: '' };
}
// "E: Vamos decidir por sorteio quem ficará com ela." Ajoelhados, eles jogam os dados; a túnica dobrada ao lado.
function scSorteio(t) {
  const a0 = at(26), ts = wordTime(26, 'sorteio') - 0.35;
  let s = peDaCruz(t, { gx: 960, gy: 470, gs: 0.85 });
  const sold = SOLD();
  s += `<ellipse cx="960" cy="865" rx="${NARROW ? 330 : 520}" ry="52" fill="${C.g100}" ${ink(5)}/>` + tunica(NARROW ? 1010 : 1080, 858, NARROW ? 0.36 : 0.42, { flat: true, id: 'tnD26', rot: -6 });
  sold.forEach(([x, seed], i) => { const dir = x < 960 ? 1 : -1; s += person({ ...soldado(seed), x, y: 800, s: NARROW ? 0.98 : 1.12, kneel: true, look: dir, mood: 'happy', armL: dir < 0 ? 40 + (i === 2 ? 50 * bump(t, ts, 0.5) : 0) : 24, armR: dir > 0 ? 40 : 24, t }); });
  // os dois dados: saem da mão, sobem, caem e rolam até parar
  [[0, 5, -60], [1, 3, 50]].forEach(([k, face, dx]) => {
    const u = prog(t, ts + k * 0.08, ts + 1.1 + k * 0.08), x = lerp(1040, 960 + dx, u), y = 760 - 230 * Math.sin(Math.PI * Math.min(1, u * 1.2)) + 80 * u;
    const rot = u < 1 ? t * 700 + k * 90 : 15 + k * 30, f = u < 1 ? 1 + (Math.floor(t * 12 + k) % 6) : face;
    s += dado(x, Math.min(y, 850), NARROW ? 1.4 : 1.3, rot, f);
  });
  return { svg: cam(s, 960, 640, 1.08 + 0.05 * prog(t, a0, at(27))), html: '' };
}
// "João conta que isso aconteceu para que se cumprisse a Escritura: Dividiram as minhas roupas entre si, e tiraram
// sortes pelas minhas vestes." (João 19:24, citando o Salmo 22:18)
function scEscritura(t) {
  const a0 = at(27), p = E.out(prog(t, a0, a0 + 0.5)), h = prog(t, wordTime(27, 'dividiram') - 0.1, fim(27));
  return { svg: fundoCartao(t), html: cartaoHTML({ p, eyebrow: 'João 19:24 cita o salmo', titulo: 'Para que se cumprisse a Escritura', linhas: [{ txt: hl('Dividiram as minhas roupas entre si, e tiraram sortes pelas minhas vestes', h), ref: 'Salmo 22:18' }], topW: 230 }) };
}
// "Eles não rasgaram a túnica de Jesus." Quem ganhou a túnica a levanta, inteira.
function scInteira(t) {
  const a0 = at(28);
  let s = peDaCruz(t, { gx: 1400, gy: 470, gs: 0.8 });
  s += segurando(t, { x: 960, glow: 0.5 + 0.1 * Math.sin(t * 2), mood: 'happy', id: 'tnS28' });
  return { svg: cam(s, 960, 600, 1.1 - 0.06 * E.inOut(prog(t, a0, depois(28) + 0.6))), html: '' };
}
// "Horas depois, quando Jesus morreu, outro tecido se rasgou em duas partes, de alto a baixo: o véu do santuário."
// O véu rasga de alto a baixo (Mateus 27:51); a seta desce junto; a câmera abre para mostrar o santuário.
function scVeu(t) {
  const t0 = wordTime(29, 'rasgou') - 0.15, t1 = wordTime(29, 'baixo') + 0.35;
  const p = E.inOut(prog(t, t0, t1)), q = 0.4 * prog(t, t0, t0 + 0.2) * (1 - prog(t, t1, t1 + 0.6));
  const a = E.inOut(prog(t, wordTime(29, 'alto') - 0.25, wordTime(29, 'baixo') + 0.25));
  let s = veuCena(t, p, { id: 'v29' }) + poeiraAlto(t, t0, 960, VEU.Y0) + seta(960, VEU.Y0 + 40, VEU.Y1 - 40, a);
  const z = lerp(1.18, 1.02, E.inOut(prog(t, at(29), t0 + 0.4)));
  return { svg: camQ(s, 960, 500, z, 960, 500, q, t), html: '' };
}

// ================================================================ 5. o grito e a pergunta (Mateus 27:46; 16:21; 2 Coríntios 5:21; Isaías 53:6; Romanos 8:32)
// "Por volta das três da tarde, veio o grito."
function scTres(t) {
  let s = cruzPerto(t, { light: 0.08 }) + anel(CABECA[0], CABECA[1], t, wordTime(30, 'grito') - 0.1) + anel(CABECA[0], CABECA[1], t, wordTime(30, 'grito') + 0.4);
  return { svg: cam(s, 960, 420, 1.0 + 0.08 * prog(t, depois(29), at(31))), html: '' };
}
// "Agora, a pergunta do começo: Deus abandonou Jesus?" A pergunta, grande, na frente da cruz no escuro.
function pergunta(t, t0, o = {}) {
  const p = E.out(prog(t, t0, t0 + 0.5));
  let s = o.claro ? bgSunrise(t, { sunX: 960, sunY: 470, seed: 71 }) + `<rect x="-300" y="-300" width="${W + 600}" height="${H + 600}" fill="#FFF6EA" opacity="0.55"/>` : bgTrevas(t, { glow: 0.14 }) + golgota(t, { dark: true, bow: 1 });
  const col = o.claro ? C.inkDeep : '#F4F1EC';
  if (NARROW) {
    s += `<g opacity="${f1(p * 100) / 100}" transform="translate(0 ${f1((1 - p) * 20)})">${label(960, 640, 'Deus abandonou', { fam: 'Lora', w: 600, size: 64, fill: col })}${label(960, 724, '', { fam: 'Lora', w: 600, size: 64, fill: col, html: `<tspan fill="${o.claro ? C.b500 : '#6FB1FC'}">Jesus</tspan>?` })}</g>`;
  } else {
    s += `<g opacity="${f1(p * 100) / 100}" transform="translate(0 ${f1((1 - p) * 24)})">${label(960, o.claro ? 480 : 300, '', { fam: 'Lora', w: 600, size: 120, fill: col, html: `Deus abandonou <tspan fill="${o.claro ? C.b500 : '#6FB1FC'}">Jesus</tspan>?` })}</g>`;
  }
  return s;
}
function scPergunta(t) { return { svg: cam(pergunta(t, at(31)), 960, 470, 1.0 + 0.04 * prog(t, at(31), antes(32))), html: '' }; }
// "Ele tinha avisado aos discípulos que seria morto e ressuscitaria no terceiro dia." (Mateus 16:21)
// Antes da cruz: Jesus fala aos discípulos na estrada; eles ficam tristes em "morto".
function scAvisou(t) {
  const a0 = antes(32), tm = wordTime(32, 'morto') - 0.2, tr = wordTime(32, 'ressuscitaria') - 0.2;
  let s = bgDay(t, { seed: 331, sunX: 1560, sunY: 230 }) + olive(1700, GROUND + 160, 1.5) + olive(180, GROUND + 140, 1.3);
  s += `<path d="M -400 ${FLOOR_Y + 40} C 400 ${FLOOR_Y - 30} 1300 ${FLOOR_Y - 10} ${W + 400} ${FLOOR_Y - 40} L ${W + 400} ${FLOOR_Y + 140} L -400 ${FLOOR_Y + 140} Z" fill="#EFE6DA"/>`;
  s += person({ ...JESUS, x: NARROW ? 780 : 760, y: FLOOR_Y, s: 1.28, look: 1, mood: 'calm', armR: fala(t, a0 + 0.3, fim(32), 30, 40), armL: 18 });
  (NARROW ? [[985, DISCS[0]], [1135, DISCS[1]]] : [[1020, DISCS[0]], [1180, DISCS[1]], [1340, TOME], [1500, DISCS[2]]]).forEach(([x, P], i) => (s += person({ ...P, x, y: FLOOR_Y - (i % 2) * 14, s: 1.2, look: -1, mood: t > tm && t < tr + 0.6 ? 'sad' : t > tr + 0.6 ? 'fear' : 'calm', t })));
  return { svg: NARROW ? cam(s, 960, 600, 1.0 + 0.04 * prog(t, a0, at(33))) : cam(s, 1060, 600, 1.04 + 0.04 * prog(t, a0, at(33))), html: '' };
}
// "Mesmo assim, o grito não foi encenação. Naquela hora, ele carregava o que não era dele."
// A cruz de perto; em "carregava", uma sombra pesada desce do alto sobre ela, e a cabeça se inclina.
function scPeso(t) {
  const tg = wordTime(33, 'grito') - 0.1, tc = wordTime(34, 'carregava') - 0.3, pz = E.inOut(prog(t, tc, tc + 1.6));
  let s = cruzPerto(t, { light: 0.08 * (1 - pz), bow: 0.15 * pz }) + anel(CABECA[0], CABECA[1], t, tg);
  s += `<defs><linearGradient id="gPeso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.9"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect x="-300" y="${f1(-700 + 700 * pz)}" width="${W + 600}" height="760" fill="url(#gPeso)"/>`;
  return { svg: cam(s, 960, 470, 1.0 + 0.08 * prog(t, at(33), depois(34))), html: '' };
}
// "Paulo escreveu: Deus tornou pecado por nós aquele que não tinha pecado. Guarda essa frase. Ela não termina ali."
// O cartão com a primeira metade de 2 Coríntios 5:21; em "Guarda", o resto da frase aparece coberto.
const CONTINUA = (rev, h, N) => (rev >= 1 ? `<span style="color:${C.b500}">${hl('para que nele nos tornássemos justiça de Deus', h)}</span>` :
  `<span style="display:inline-block;width:${N ? 230 : 560}px;height:${N ? 26 : 46}px;vertical-align:${N ? -3 : -6}px;border-radius:${N ? 8 : 14}px;background:${C.b500};border:${N ? 2 : 4}px solid ${C.b600};box-shadow:0 ${N ? 3 : 6}px 0 0 ${C.b600};opacity:${f1((1 - rev) * 100) / 100}"></span>`);
function cartao2Co(t, o) {
  const N = NARROW, h1 = o.h1, cont = o.cont || 0;
  const pecado = hl('Deus tornou pecado por nós aquele que não tinha pecado', h1);
  const resto = cont > 0 ? `, <span style="opacity:${f1(clamp(cont) * 100) / 100}">${CONTINUA(o.rev || 0, o.h2 || 0, N)}</span>` : '';
  return cartaoHTML({ p: o.p, eyebrow: 'Paulo escreveu', linhas: [{ txt: `<span style="opacity:${f1((o.dim ? 0.5 : 1) * 100) / 100}">${pecado}</span>${resto}`, ref: '2 Coríntios 5:21' }], topW: 250 });
}
function scPaulo(t) {
  const a0 = depois(34), p = E.out(prog(t, a0, a0 + 0.5)), h1 = prog(t, wordTime(35, 'deus') - 0.1, fim(35));
  const cont = pop(t, wordTime(36, 'guarda') - 0.2, 0.45);
  return { svg: fundoCartao(t), html: cartao2Co(t, { p, h1, cont: cont <= 0 ? 0 : cont }) };
}
// "E Isaías, séculos antes: o Senhor fez cair sobre ele a iniquidade de todos nós." (Isaías 53:6)
function scIsaias(t) {
  const a0 = antes(37), p = E.out(prog(t, a0 + 0.1, a0 + 0.6)), h = prog(t, wordTime(37, 'senhor') - 0.3, fim(37));
  return { svg: fundoCartao(t), html: cartaoHTML({ p, eyebrow: 'Séculos antes', titulo: 'Isaías', linhas: [{ txt: hl('…o Senhor fez cair sobre ele a iniquidade de todos nós', h), ref: 'Isaías 53:6' }], topW: 250 }) };
}
// "Saber o fim não tirou o peso daquela hora: Deus não poupou a seu próprio Filho, mas o entregou por todos nós."
function scRomanos(t) {
  const a0 = depois(37), p = E.out(prog(t, a0 + 0.1, a0 + 0.6)), h = prog(t, wordTime(38, 'poupou') - 0.4, fim(38));
  return { svg: fundoCartao(t), html: cartaoHTML({ p, eyebrow: 'Paulo escreveu', linhas: [{ txt: hl('Deus “não poupou a seu próprio Filho, mas o entregou por todos nós”', h), ref: 'Romanos 8:32' }], topW: 250 }) };
}

// ================================================================ 6. a palavra pequena (Salmo 22:1, 10)
// "Agora, a palavra pequena. É meu. Mesmo ali, a frase que ele escolheu não diz Deus. Diz Meu Deus. Duas vezes."
// A frase do grito volta com a palavra coberta; em "meu", ela aparece em azul; em "Duas vezes", cada "Meu" pulsa.
function scMeu(t) {
  const a0 = depois(38), p = E.out(prog(t, a0, a0 + 0.5));
  const tm = wordTime(39, 'meu') - 0.15, rev = E.out(prog(t, tm, tm + 0.35));
  const td = wt(40, 9) - 0.1; // "Deus" de "não diz Deus"
  const tmd = wt(40, 11) - 0.1, tdv = wordTime(40, 'duas') - 0.1, tv = wordTime(40, 'vezes') - 0.1;
  const foco = [Math.max(bump(t, tmd, 0.8), bump(t, tdv, 0.6)), Math.max(bump(t, tmd, 0.8), bump(t, tv, 0.6))];
  const apaga = E.out(prog(t, td, td + 0.3)) * (1 - E.out(prog(t, tmd - 0.1, tmd + 0.3)));
  return { svg: cam(fundoCartao(t), 960, 470, 1.0 + 0.03 * prog(t, a0, depois(40))), html: fraseMeu(t, { p, cobre: 1, rev, foco, deus: apaga > 0.5 }) };
}
// "E o mesmo salmo diz, mais adiante: desde o ventre materno és o meu Deus." (Salmo 22:10)
function scVentre(t) {
  const a0 = depois(40), p = E.out(prog(t, a0, a0 + 0.5)), h = prog(t, wordTime(41, 'desde') - 0.1, fim(41));
  const m = E.out(prog(t, wordTime(41, 'meu') - 0.15, wordTime(41, 'meu') + 0.2));
  const txt = hl('…desde o ventre materno és o', h) + ` <span style="color:${m > 0.5 ? C.b500 : 'inherit'};font-weight:700">meu</span> ` + hl('Deus', prog(t, wordTime(41, 'meu'), fim(41)));
  return { svg: fundoCartao(t), html: cartaoHTML({ p, eyebrow: 'Mais adiante, no mesmo salmo', linhas: [{ txt, ref: 'Salmo 22:10' }], topW: 260 }) };
}

// ================================================================ 7. o fim do salmo (Salmo 22:21, 22, 24, 31; Hebreus 2:12; 5:7)
// "E o fim do salmo? Ele não termina em abandono." A câmera corre o rolo até o fim, que acende.
function scFimRolo(t) {
  const a0 = antes(42), pan = E.inOut(prog(t, a0, fim(42) + 0.4)), luz = E.out(prog(t, seg(43) - 0.2, seg(43) + 0.9));
  return { svg: camRolo(mesaRolo(t, { fimLuz: luz }), pan, 1.1 + 0.04 * prog(t, seg(43), depois(43))), html: '' };
}
// "A oração muda: E tu me respondeste. E pouco depois: não escondeu dele o rosto, mas ouviu o seu grito de socorro."
function scResponde(t) {
  const a0 = depois(43), p = E.out(prog(t, a0, a0 + 0.5));
  const h1 = prog(t, wordTime(44, 'tu') - 0.3, fim(44)), h2 = prog(t, wordTime(45, 'escondeu') - 0.3, fim(45));
  return { svg: fundoCartao(t), html: cartaoHTML({ p, eyebrow: 'O fim do salmo', titulo: 'A oração muda', linhas: [
    { txt: hl('…E tu me respondeste.', h1), ref: 'Salmo 22:21' },
    { txt: hl('…não escondeu dele o rosto, mas ouviu o seu grito de socorro.', h2), ref: 'Salmo 22:24', op: E.out(prog(t, seg(45) - 0.4, seg(45))) },
  ], topW: 200 }) };
}
// "A carta aos Hebreus pega outra linha desse salmo, Proclamarei o teu nome a meus irmãos, e diz que quem fala ali é
// Jesus." (Hebreus 2:11-12, citando o Salmo 22:22) Em "Jesus", o nome de quem fala aparece em cima da linha.
function scHebreus(t) {
  const a0 = depois(45), p = E.out(prog(t, a0, a0 + 0.5)), h = prog(t, wordTime(46, 'proclamarei') - 0.1, wordTime(46, 'irmãos') + 0.3);
  const tj = wt(46, (SEGS[46][4] || []).length - 1) - 0.15, j = pop(t, tj, 0.45);
  const quem = j > 0 ? `<div style="display:inline-block;margin-bottom:${NARROW ? 10 : 18}px;padding:${NARROW ? '4px 14px' : '8px 24px'};border-radius:${NARROW ? 10 : 18}px;background:${C.b500};color:#fff;font:700 ${NARROW ? 20 : 38}px/1.2 Geist;transform:scale(${f1(Math.min(j, 1.06) * 100) / 100});transform-origin:0 50%">Quem fala: Jesus</div><br>` : '';
  return { svg: fundoCartao(t), html: cartaoHTML({ p, eyebrow: 'Hebreus 2:12 cita o salmo', linhas: [{ txt: quem + hl('Proclamarei o teu nome a meus irmãos', h), ref: 'Salmo 22:22' }], topW: 250 }) };
}
// "E diz também que, nos dias dele na terra, Jesus orou em alta voz e com lágrimas, àquele que o podia salvar da
// morte. E foi ouvido, por causa da sua reverente submissão." (Hebreus 5:7) À noite, entre as oliveiras, Jesus
// ajoelhado, de costas e em silhueta, de longe; em "ouvido", uma luz suave desce do alto.
function scOrou(t) {
  const a0 = depois(46), to = wordTime(47, 'ouvido') - 0.3, luz = E.inOut(prog(t, to, to + 1.4));
  let s = bgNight(t, { moonX: 1500, moonY: 200 });
  s += olive(260, GROUND + 260, 2.6, '#3B4537', '#2E3729', NIGHT_OL) + olive(1680, GROUND + 250, 2.4, '#3B4537', '#2E3729', NIGHT_OL) + olive(560, GROUND + 120, 1.4, '#3B4537', '#2E3729', NIGHT_OL);
  s += `<path d="M 700 ${FLOOR_Y + 10} C 760 760 1160 760 1220 ${FLOOR_Y + 10} Z" fill="#2A2D30" ${ink(5, NIGHT_OL)}/>`;
  s += beam(960, -100, 960, FLOOR_Y, 80, 360, 0.55 * luz);
  s += `<circle cx="960" cy="560" r="${f1(260 + 120 * luz)}" fill="url(#gWhite)" opacity="${f1(0.4 * luz * 100) / 100}"/>`;
  s += person({ x: 960, y: 790, s: 1.15, kneel: true, sil: '#0B0D10', rim: lerp(0, 1, luz) > 0.3 ? C.a300 : '#5A606A', armL: 138, armR: 138, noShadow: true });
  return { svg: cam(s, 960, 560, 1.0 + 0.06 * prog(t, a0, at(48))), html: '' };
}
// "A última linha do salmo diz: ele agiu poderosamente." (Salmo 22:31)
function scAgiu(t) {
  const a0 = at(48), p = E.out(prog(t, a0, a0 + 0.5)), h = prog(t, wordTime(48, 'ele') - 0.1, fim(48));
  return { svg: fundoCartao(t), html: cartaoHTML({ p, eyebrow: 'A última linha do salmo', linhas: [{ txt: hl('…ele agiu poderosamente.', h), ref: 'Salmo 22:31', fs: NARROW ? 36 : 72 }], topW: 280 }) };
}
// "O grito perguntava Por que me abandonaste. O salmo termina com ele agiu." O começo e o fim do salmo, lado a lado.
function scComecoFim(t) {
  const a0 = at(49), p1 = E.out(prog(t, a0, a0 + 0.5)), p2 = E.out(prog(t, wordTime(49, 'termina') - 0.2, wordTime(49, 'termina') + 0.3));
  let s = fundoCartao(t, 0.22, 960, 460);
  const N = NARROW;
  const caixa = (x, y, w, h, ref, txt, cor, p) => (p <= 0 ? '' : `<g opacity="${f1(p * 100) / 100}" transform="translate(0 ${f1((1 - p) * 20)})"><rect x="${x}" y="${y + (N ? 5 : 10)}" width="${w}" height="${h}" rx="${N ? 22 : 40}" fill="${C.border}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${N ? 22 : 40}" fill="#fff" stroke="${C.border}" stroke-width="${N ? 2 : 3}"/>
    ${label(x + w / 2, y + (N ? 40 : 70), ref, { fam: 'Geist Mono', w: 500, size: N ? 18 : 32, fill: C.muted })}${label(x + w / 2, y + h / 2 + (N ? 30 : 46), txt, { fam: 'Lora', w: 600, size: N ? 34 : 56, fill: cor })}</g>`);
  if (N) {
    s += caixa(700, 520, 520, 140, 'O grito, Salmo 22:1', 'Por que me abandonaste?', C.muted, p1);
    s += caixa(700, 690, 520, 140, 'O fim, Salmo 22:31', 'ele agiu', C.b500, p2);
  } else {
    s += caixa(160, 300, 760, 300, 'O grito, Salmo 22:1', 'Por que me abandonaste?', C.muted, p1);
    s += caixa(1000, 300, 760, 300, 'O fim, Salmo 22:31', 'ele agiu', C.b500, p2);
    if (p2 > 0) s += `<g opacity="${f1(p2 * 100) / 100}"><line x1="900" y1="450" x2="${f1(lerp(900, 990, p2))}" y2="450" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/></g>`;
  }
  return { svg: cam(s, 960, 470, 1.0 + 0.03 * prog(t, a0, antes(50))), html: '' };
}
// "No terceiro dia, o túmulo estava vazio." (Lucas 24:1-3) A pedra rolada e a luz na entrada, sem ninguém.
function scTumulo(t) {
  const a0 = antes(50), luz = 0.5 + 0.4 * E.out(prog(t, wordTime(50, 'vazio') - 0.4, wordTime(50, 'vazio') + 0.6));
  return { svg: cam(tumuloVazio(t, { luz, aves: a0 + 0.4 }), 960, 560, 1.0 + 0.07 * E.inOut(prog(t, a0, depois(50)))), html: '' };
}

// ================================================================ 8. a resposta (2 Coríntios 5:21)
// "Então, Deus abandonou Jesus?" A pergunta outra vez, agora na luz da manhã.
function scPergunta2(t) { return { svg: cam(pergunta(t, depois(50), { claro: true }), 960, 470, 1.0 + 0.04 * prog(t, depois(50), at(52))), html: '' }; }
// "Naquela hora, Deus o entregou de verdade, por nós. Mas não o deixou sem resposta."
// A cruz no fim da tarde; em "Mas", o túmulo vazio na luz da manhã.
function scEntregou(t) {
  const tc = wordTime(52, 'mas') - 0.2;
  const A = (u) => cam(cruzTarde(u), 960, 470, 1.02 + 0.05 * prog(u, at(52), tc));
  const B = (u) => cam(tumuloVazio(u, { luz: 0.9, id: 'tv52' }), 960, 560, 1.12 - 0.08 * E.inOut(prog(u, tc, at(53))));
  return { svg: xcut(t, tc, A, B), html: '' };
}
// "E aquela frase de Paulo, a do pecado, continua: para que nele nos tornássemos justiça de Deus."
// O cartão de 2 Coríntios 5:21 volta; o resto da frase se revela.
function scPaulo2(t) {
  const a0 = at(53), p = E.out(prog(t, a0, a0 + 0.5)), tc = wordTime(53, 'continua') - 0.1;
  const rev = E.out(prog(t, tc, tc + 0.5)), h2 = prog(t, wordTime(53, 'para') - 0.1, fim(53));
  return { svg: fundoCartao(t), html: cartao2Co(t, { p, h1: 1, cont: 1, rev: rev >= 1 ? 1 : rev, h2, dim: rev > 0.5 }) };
}
// "É por isso que esse grito importa pra você até hoje." Alguém de hoje, com a Bíblia aberta.
function scHoje(t) {
  const a0 = at(54);
  return { svg: cam(quartoHoje(t, { mood: 'closed' }), 880, 600, 1.12 - 0.06 * E.inOut(prog(t, a0, depois(54)))), html: '' };
}

// ================================================================ fecho
// "Se você quer ler o Salmo 22 inteiro, um pouco por dia, procura PregaAI na Google Play." O cartão do app entra
// depois que o banner do canto (aos 270 s) sai, para os dois selos não ficarem juntos na tela.
function scApp(t) {
  const t0 = Math.max(wordTime(55, 'procura') - 0.3, 274.7);
  return { svg: cam(leitor(t, { mood: t > t0 ? 'calm' : 'closed', look: t > t0 ? 0.3 : 0 }), 900, 620, 1.02 + 0.05 * prog(t, depois(54), at(56))), html: appCard(t, t0, at(56) + 0.3) };
}
// "Das quatro cenas que o salmo descreve, qual mais te surpreendeu? Me conta aqui embaixo." As quatro, em lista.
function scAsQuatro(t) {
  const a0 = at(56);
  let s = papel(0.22, 960, 520);
  for (let n = 1; n <= 4; n++) {
    const y = 250 + (n - 1) * 140, p = E.out(prog(t, a0 + 0.1 * n, a0 + 0.1 * n + 0.4));
    s += `<g opacity="${f1(p * 100) / 100}" transform="translate(${f1((1 - p) * -30)} 0)">`;
    s += dot(330, y, n, 0.9) + label(410, y + 18, CENAS[n].titulo, { anchor: 'start', fam: 'Lora', w: 600, size: 64 }) + label(1620, y + 14, CENAS[n].ref, { anchor: 'end', fam: 'Geist Mono', w: 500, size: 34, fill: C.muted });
    s += `</g>`;
  }
  return { svg: cam(s, 960, 520, 1.0 + 0.03 * prog(t, a0, seco(57))), html: '' };
}

// ================================================================ aberturas dos curtos (só nos curtos)
// Curto 1: "Quatro soldados dividiram as roupas de um condenado. E sobrou uma peça." O mesmo pé da cruz; as quatro
// peças vão para os quatro; a túnica fica no meio e acende.
function scAbreTunica(t) {
  const a0 = seco(57), tq = wordTime(57, 'dividiram') - 0.1, tp = [tq, tq + 0.3, tq + 0.6, tq + 0.9];
  const ts = wordTime(57, 'peça') - 0.5, glow = E.out(prog(t, ts, ts + 0.5));
  const s = divisao(t, { tp, pecas: tp.map((x) => E.inOut(prog(t, x - 0.3, x + 0.2)) * (1 - E.inOut(prog(t, x + 0.7, x + 1.1)))), glow, olhar: t > ts, id: 'b' });
  const k = E.inOut(prog(t, ts - 0.3, ts + 0.9)) * (NARROW ? 0.45 : 1);
  return { svg: cam(s, 960, lerp(560, 800, k), lerp(1.04, 1.32, k), 0, lerp(0, -170, k)), html: '' };
}
// Curto 2: "Se Jesus sabia que ia ressuscitar, por que gritou: Meu Deus! Meu Deus! Por que me abandonaste? A frase é
// a primeira linha do Salmo 22." A cruz no escuro, com os anéis do grito; depois, o cartão do salmo.
function scAbreGrito(t) {
  const a0 = seco(58), n = (SEGS[58][4] || []).length;
  const k = [a0, wt(58, n - 8), wt(58, n - 6), wt(58, n - 1)];
  return { svg: cam(grito(t, k), 960, 470, 1.06 + 0.06 * prog(t, a0, at(59))), html: '' };
}
const scSalmo1b = (t) => cartaoSalmo1(t, at(59), 59);
// Curto 3: "Jesus gritou na cruz, e alguns disseram que ele estava chamando Elias." (Mateus 27:47) Quem estava perto
// da cruz, no escuro; um aponta para o alto.
function scElias(t) {
  const a0 = seco(60), te = wordTime(60, 'elias'), up = E.out(prog(t, te - 0.5, te));
  const CX = NARROW ? 1120 : 1250;
  let s = bgTrevas(t, { glow: 0.1, gx: CX }) + hill(CX, 620, 1100, '#1B1E22', '#060708') + crossFig(CX, 640, 0.8, { plaque: true, fill: '#050505', rim: RIM, bow: 0.2 });
  s += anel(CX, 640 - 442 * 0.8, t, wordTime(60, 'gritou') - 0.1);
  s += person({ ...povo(1031), x: NARROW ? 800 : 420, y: FLOOR_Y, s: 1.25, look: 1, mood: 'calm', armR: lerp(30, 160, up), rim: RIM });
  s += person({ ...povo(1032), x: NARROW ? 960 : 640, y: FLOOR_Y, s: 1.25, look: -1, mood: 'fear', t, armL: 20, armR: lerp(20, 60, up), rim: RIM });
  if (!NARROW) s += person({ ...povo(1033, { cover: C.g300 }), x: 860, y: FLOOR_Y, s: 1.25, look: 1, mood: 'sad', rim: RIM });
  return { svg: NARROW ? cam(s, 960, 540, 1.0 + 0.04 * prog(t, a0, at(61))) : cam(s, 900, 540, 1.03 + 0.05 * prog(t, a0, at(61))), html: '' };
}
// "Mateus e Marcos guardaram até o som das palavras: Eloí, Eloí, lamá sabactâni? Que significa: Meu Deus! Meu
// Deus! Por que me abandonaste?" (Mateus 27:46; Marcos 15:34)
function scEloi(t) {
  const a0 = at(61), p = E.out(prog(t, a0, a0 + 0.5));
  const h1 = prog(t, wordTime(61, 'eloí') - 0.1, fim(61)), h2 = prog(t, seg(62) + 0.6, fim(62));
  return { svg: fundoCartao(t), html: cartaoHTML({ p, eyebrow: 'Mateus 27:46 e Marcos 15:34', titulo: 'O som das palavras', linhas: [
    { txt: `<i>${hl('Eloí, Eloí, lamá sabactâni?', h1)}</i>`, fs: NARROW ? 32 : 60 },
    { txt: hl('Meu Deus! Meu Deus! Por que me abandonaste?', h2), op: E.out(prog(t, seg(62) - 0.3, seg(62) + 0.2)) },
  ], topW: 200 }) };
}

// ================================================================ fim
const scFim = (t) => endCard(t, CARTAO_INICIO, ['Salmo 22', 'Mateus 27', 'João 19']);

// ================================================================ linha do tempo
const SCENES = [
  // abertura
  { a: 0, b: antes(2), f: scAbertura, ref: null, dark: true },
  { a: antes(2), b: antes(3), f: scRolo, ref: null, dark: true },
  { a: antes(3), b: depois(3), f: scSalmo1, ref: null },
  { a: depois(3), b: at(6), f: scQuatro, ref: null },
  { a: at(6), b: at(7), f: scResposta, ref: null, dark: true },
  { a: at(7), b: antes(8), f: scGuarda, ref: null },
  // 1. os insultos
  { a: antes(8), b: at(9), f: scNove, ref: 'Marcos 15:25, 27' },
  { a: at(9), b: at(10), f: scCena1, ref: null },
  { a: at(10), b: at(12), f: scPassam, ref: [[at(10), 'Mateus 27:39'], [at(11), 'Mateus 27:40']] },
  // 2. a frase dos líderes
  { a: at(12), b: at(14), f: scCena2, ref: null },
  { a: at(14), b: at(15), f: scLideres, ref: 'Mateus 27:41-43' },
  { a: at(15), b: at(16), f: scMestres, ref: null },
  { a: at(16), b: depois(16), f: scParecida, ref: null },
  // 3. as mãos e os pés
  { a: depois(16), b: at(18), f: scCena3, ref: null },
  { a: at(18), b: at(19), f: scEvangelhos, ref: null },
  { a: at(19), b: at(20), f: scTome, ref: 'João 20:25', dark: true },
  { a: at(20), b: at(21), f: scVejam, ref: 'Lucas 24:39', dark: true },
  // 4. as roupas sorteadas
  { a: at(21), b: at(22), f: scCena4, ref: null },
  { a: at(22), b: at(24), f: scDividem, ref: 'João 19:23' },
  { a: at(24), b: at(25), f: scSemCostura, ref: null },
  { a: at(25), b: at(26), f: scNaoRasguemos, ref: 'João 19:24' },
  { a: at(26), b: at(27), f: scSorteio, ref: null },
  { a: at(27), b: at(28), f: scEscritura, ref: null },
  { a: at(28), b: at(29), f: scInteira, ref: null },
  { a: at(29), b: depois(29), f: scVeu, ref: 'Mateus 27:51', dark: true },
  // 5. o grito e a pergunta
  { a: depois(29), b: at(31), f: scTres, ref: 'Mateus 27:46', dark: true },
  { a: at(31), b: antes(32), f: scPergunta, ref: null, dark: true },
  { a: antes(32), b: at(33), f: scAvisou, ref: 'Mateus 16:21' },
  { a: at(33), b: depois(34), f: scPeso, ref: null, dark: true },
  { a: depois(34), b: antes(37), f: scPaulo, ref: null },
  { a: antes(37), b: depois(37), f: scIsaias, ref: null },
  { a: depois(37), b: depois(38), f: scRomanos, ref: null },
  // 6. a palavra pequena
  { a: depois(38), b: depois(40), f: scMeu, ref: null },
  { a: depois(40), b: antes(42), f: scVentre, ref: null },
  // 7. o fim do salmo
  { a: antes(42), b: depois(43), f: scFimRolo, ref: null, dark: true },
  { a: depois(43), b: depois(45), f: scResponde, ref: null },
  { a: depois(45), b: depois(46), f: scHebreus, ref: null },
  { a: depois(46), b: at(48), f: scOrou, ref: 'Hebreus 5:7', dark: true },
  { a: at(48), b: at(49), f: scAgiu, ref: null },
  { a: at(49), b: antes(50), f: scComecoFim, ref: null },
  { a: antes(50), b: depois(50), f: scTumulo, ref: 'Lucas 24:1-3' },
  // 8. a resposta
  { a: depois(50), b: at(52), f: scPergunta2, ref: null },
  { a: at(52), b: at(53), f: scEntregou, ref: null, dark: (t) => t < wordTime(52, 'mas') - 0.2 },
  { a: at(53), b: at(54), f: scPaulo2, ref: null },
  { a: at(54), b: depois(54), f: scHoje, ref: null, dark: true },
  // fecho
  { a: depois(54), b: at(56), f: scApp, ref: null },
  { a: at(56), b: seco(57), f: scAsQuatro, ref: null },
  // aberturas dos curtos (só nos curtos): entram secas, sem a cena vizinha por baixo
  { a: seco(57), b: seco(58), f: scAbreTunica, ref: 'João 19:23', cut: true },
  { a: seco(58), b: at(59), f: scAbreGrito, ref: null, dark: true, cut: true },
  { a: at(59), b: seco(60), f: scSalmo1b, ref: null },
  { a: seco(60), b: at(61), f: scElias, ref: 'Mateus 27:47', dark: true, cut: true },
  { a: at(61), b: CARTAO_INICIO, f: scEloi, ref: null },
  // cartão final (o longo pula das frases do longo direto para cá: corte.json, cartao_inicio)
  { a: CARTAO_INICIO, b: DURATION + 1, f: scFim, ref: null, end: true, cut: true },
];

// No curto com enquadramento por cena, a legenda é sempre clara e fica no céu: nas cenas claras, um degradê escuro
// no alto da cena segura a leitura, também em cima do véu azul (o cartão final fica como está).
if (NARROW) {
  const ceu = `<defs><linearGradient id="gCeu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.5"/><stop offset="0.7" stop-color="#000" stop-opacity="0.32"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs><rect x="-300" y="-300" width="${W + 600}" height="840" fill="url(#gCeu)"/>`;
  SCENES.forEach((sc) => {
    if (sc.end) return;
    const f = sc.f;
    sc.f = (t) => { const r = f(t); return { svg: r.svg + ceu, html: r.html }; };
  });
}
