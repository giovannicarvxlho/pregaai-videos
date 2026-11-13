// Momentos da animação, tirados das próprias cenas, para os efeitos sonoros caírem no quadro certo
// (pedido do Giovanni em 2026-11-13: passos dos personagens, efeito quando alguém fala, efeito quando o
// marca-texto grifa; os efeitos marcados pelo tempo da fala ficavam "meio desincronizados").
//   node tools/eventos.cjs <ep>     → episodios/<ep>/eventos.json
// Roda cada cena do SCENES quadro a quadro (30 por segundo, sem navegador) e anota, na linha do tempo da
// narração inteira (a mesma do data.js):
//   passos: cada vez que a perna de um personagem que anda (person com walk) troca de lado;
//   voz:    o começo de cada fala (o gesto de falar, fala() do lib.js);
//   grifa:  o começo de cada marca-texto (hlWords) que passa de 0;
//   cartao: o primeiro quadro de cada cartão de texto (cartaoHTML) visível.
// O tools/trilha.py lê este arquivo e põe os efeitos (passo, voz, risco, pop) nesses tempos.
const fs = require('fs'), vm = require('vm'), path = require('path');
const ep = process.argv[2];
if (!ep) { console.error('uso: node tools/eventos.cjs <ep>'); process.exit(1); }
const raiz = path.join(__dirname, '..');
const ev = [];
let atual = null;
const ctx = { console, Math, document: { createElement: () => ({ getContext: () => ({}) }) }, window: {}, location: { search: '' },
  __ev: (tipo, ...a) => { if (atual) ev.push([atual.t, atual.i, tipo, atual.n[tipo] = (atual.n[tipo] || 0) + 1, ...a]); } };
vm.createContext(ctx);
// o que o index.html define antes do lib.js (o longo, sem recorte)
vm.runInContext("var CHEIA = false, FOCO = false, RECORTE = false, TITULO = '', CTA = false, FOCO_CFG = {}, GANCHO_URL = '', REFS = null, FRASES = null;", ctx);
let lib = fs.readFileSync(path.join(raiz, 'lib.js'), 'utf8');
lib = lib.replace(/(const fala = \(t, t0, t1, base = 20, amp = 30\) => )/, "$1(__ev('voz', t0, t1), 0) + ");
vm.runInContext(lib, ctx, { filename: 'lib.js' });
vm.runInContext(fs.readFileSync(path.join(raiz, 'episodios', ep, 'data.js'), 'utf8'), ctx, { filename: 'data.js' });
vm.runInContext(fs.readFileSync(path.join(raiz, 'episodios', ep, 'scenes.js'), 'utf8') + '\n;this.__S = SCENES;', ctx, { filename: 'scenes.js' });
vm.runInContext('var CHUNKS = buildChunks(SEGS);', ctx); // o index.html monta isto depois das cenas
vm.runInContext(`
  const __p = person, __h = hlWords, __c = typeof cartaoHTML === 'function' ? cartaoHTML : null;
  person = (o) => { if (o && o.walk != null) __ev('passo', Math.sin(o.walk)); return __p(o); };
  hlWords = (tk, p) => { __ev('grifa', p); return __h(tk, p); };
  if (__c) cartaoHTML = (o) => { __ev('cartao', o && o.p); return __c(o); };`, ctx);
const S = ctx.__S, FPS = 30, erros = new Set();
S.forEach((s, i) => {
  if (s.end) return; // o cartão final do app
  for (let t = s.a; t < s.b; t += 1 / FPS) { atual = { t, i, n: {} }; try { s.f(t); } catch (e) { if (!erros.has(i)) { erros.add(i); console.error(`cena ${i} (${s.f.name}) em ${t.toFixed(2)} s: ${e.message}`); } } }
});
atual = null;
// dos registros quadro a quadro para os momentos
const ant = new Map(), out = { passos: [], voz: [], grifa: [], cartao: [] }, visto = new Set();
for (const [t, i, tipo, k, a, b] of ev) {
  const chave = `${tipo}|${i}|${k}`, v0 = ant.get(chave);
  if (tipo === 'passo') { if (v0 != null && Math.sign(v0) !== Math.sign(a) && a !== 0) out.passos.push(t); ant.set(chave, a); }
  else if (tipo === 'grifa' || tipo === 'cartao') { const v = a || 0; if ((v0 == null || v0 <= 0.01) && v > 0.01) out[tipo].push(t); ant.set(chave, v); }
  else if (tipo === 'voz') { const c = `${i}|${a.toFixed(2)}`; if (!visto.has(c) && a >= S[i].a - 0.05 && a < S[i].b) { visto.add(c); out.voz.push(a); } }
}
const arred = (xs) => [...new Set(xs.map((x) => Math.round(x * 100) / 100))].sort((x, y) => x - y);
for (const k of Object.keys(out)) out[k] = arred(out[k]);
// passos de várias pessoas no mesmo instante viram um passo só (no máximo um a cada 0,12 s)
out.passos = out.passos.filter((t, j, xs) => j === 0 || t - xs[j - 1] >= 0.12);
fs.writeFileSync(path.join(raiz, 'episodios', ep, 'eventos.json'), JSON.stringify(out, null, 1) + '\n');
console.log(Object.entries(out).map(([k, v]) => `${k}: ${v.length}`).join(' · '));
