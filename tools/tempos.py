# Tempos da narração sem Whisper: a ElevenLabs devolve o início e o fim de cada letra do texto que leu,
# e o tools/narrar.py grava isso ao lado de cada mp3 (narration.tempos.json ou partes/NN.tempos.json).
#
#   python3 tools/tempos.py episodios/<ep>                   preenche os tempos do SEGS do data.js; o texto da tela fica
#   python3 tools/tempos.py episodios/<ep> --novo [--longo]  cria o data.js: uma frase por linha do narracao.txt,
#                                                            com os blocos "|" da legenda já quebrados
#
# Cada frase do SEGS sai como [início, fim, 'texto | blocos', [[início, fim] de cada bloco], [início de cada palavra]].
# O 5º item deixa o wordTime exato (antes, o tempo de cada palavra era repartido por sílaba dentro do trecho).
# O texto da tela pode diferir da fala ("PregaAI" na tela, "Prega aí" na voz): as palavras são casadas em ordem,
# e as que não acham par ficam entre as vizinhas. Frase com menos de 80% de palavras achadas sai com aviso.
# Narração sem .tempos.json (gerada antes de 11/11/2026 ou gravada pelo Giovanni): use o tools/alinhar.py.
import difflib, importlib.util, json, os, re, sys, unicodedata

AQUI = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location('juntar', os.path.join(AQUI, 'juntar.py'))
juntar = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(juntar)

TELA = [('Prega aí', 'PregaAI')]  # grafia da voz -> grafia da tela
BLOCO = 28  # letras por bloco da legenda (README)
SYL = 1 / 5.35  # segundos por sílaba, para palavra sem par
LIGA = set('e o a os as de do da dos das no na nos nas em um uma uns umas que pra para com por ao aos se sem'.split())


def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', w)


def syl(w):
    return max(1, len(re.findall(r'[aeiouy]+', norm(w))))


def partes_do_texto(d):
    txt = os.path.join(d, 'narracao.txt')
    if not os.path.exists(txt):
        sys.exit(f'✘ falta {txt}')
    return [p.strip() for p in open(txt, encoding='utf-8').read().split('\n---\n') if p.strip()]


def falados(d, partes):
    """Palavras que a voz leu, com o tempo na narração juntada: [(normalizada, início, fim)]."""
    if len(partes) == 1:
        mp3s = [os.path.join(d, 'narration.mp3')]
        ini = [0.0]
    else:
        mp3s = [os.path.join(d, 'partes', f'{i:02d}.mp3') for i in range(1, len(partes) + 1)]
        ini, _ = juntar.inicios(mp3s)
    voz_tela = [([norm(x) for x in v.split()], norm(t)) for v, t in TELA]
    out = []
    for parte, mp3, t0 in zip(partes, mp3s, ini):
        jp = mp3[:-4] + '.tempos.json'
        if not os.path.exists(jp):
            sys.exit(f'✘ falta {jp}: a narração foi gerada sem os tempos (antes de 11/11/2026?). Use o tools/alinhar.py.')
        j = json.load(open(jp, encoding='utf-8'))
        if j['texto'].strip() != parte:
            print(f'! {os.path.basename(jp)}: o narracao.txt mudou depois da narração; os tempos são do texto que a voz leu',
                  file=sys.stderr)
        al = j['alinhamento']
        ws, cur = [], None
        for c, a, b in zip(al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']):
            if c.isspace():
                if cur:
                    ws.append(cur)
                cur = None
            elif cur is None:
                cur = [c, a, b]
            else:
                cur[0] += c
                if c.isalnum():  # o fim é o da última letra: a pontuação final esticava a frase em ~0,3 s
                    cur[2] = b
        if cur:
            ws.append(cur)
        ws = [(norm(w), a + t0, b + t0) for w, a, b in ws if norm(w)]
        k = 0
        while k < len(ws):  # junta as palavras da grafia da voz na grafia da tela ("prega" + "ai" -> "pregaai")
            for voz, tela in voz_tela:
                n = len(voz)
                if [w[0] for w in ws[k:k + n]] == voz:
                    ws[k:k + n] = [(tela, ws[k][1], ws[k + n - 1][2])]
                    break
            k += 1
        out += ws
    return out


def preencher(linhas, tw):
    """Para cada linha do SEGS (texto da tela, com | ! *): (início, fim, texto, blocos, início de cada palavra)."""
    js = []  # cada palavra como o lib.js conta: (frase, bloco, palavra)
    for li, raw in enumerate(linhas):
        texto = raw.replace("\\'", "'")
        texto = texto[1:] if texto.startswith('!') else texto
        for ci, bloco in enumerate(texto.split('|')):
            for w in bloco.strip().split():
                js.append((li, ci, w.replace('*', '')))
    casaveis = [k for k, x in enumerate(js) if norm(x[2])]
    sm = difflib.SequenceMatcher(None, [norm(js[k][2]) for k in casaveis], [w[0] for w in tw], autojunk=False)
    par = {}
    for blk in sm.get_matching_blocks():
        for i in range(blk.size):
            par[casaveis[blk.a + i]] = blk.b + i
    t = {}  # palavra -> (início, fim)
    for k in casaveis:
        if k in par:
            t[k] = (tw[par[k]][1], tw[par[k]][2])
    # palavras sem par: repartidas por sílaba entre a vizinha de antes e a de depois
    i = 0
    while i < len(casaveis):
        if casaveis[i] in t:
            i += 1
            continue
        j = i
        while j < len(casaveis) and casaveis[j] not in t:
            j += 1
        run = casaveis[i:j]
        antes = t[casaveis[i - 1]][1] if i > 0 else None
        depois = t[casaveis[j]][0] if j < len(casaveis) else None
        sy = [syl(js[k][2]) for k in run]
        if antes is None and depois is None:
            antes = 0.0
        if antes is None:
            antes = depois - sum(sy) * SYL
        if depois is None:
            depois = antes + sum(sy) * SYL
        acc, tot = 0, sum(sy)
        for k, s in zip(run, sy):
            t[k] = (antes + (depois - antes) * acc / tot, antes + (depois - antes) * (acc + s) / tot)
            acc += s
        i = j
    # palavras só de pontuação ("—", "?") herdam o tempo da próxima palavra
    ult = None
    for k in reversed(range(len(js))):
        if k in t:
            ult = t[k]
        elif ult:
            t[k] = (ult[0], ult[0])
    for k in range(len(js)):
        if k not in t:
            t[k] = t[k - 1] if k else (0.0, 0.0)
    out = []
    for li, raw in enumerate(linhas):
        ks = [k for k, x in enumerate(js) if x[0] == li]
        nb = max(js[k][1] for k in ks) + 1
        blocos = []
        for ci in range(nb):
            kb = [k for k in ks if js[k][1] == ci]
            blocos.append([round(t[kb[0]][0], 2), round(t[kb[-1]][1], 2)])
        cas = [k for k in ks if norm(js[k][2])]
        achadas = sum(1 for k in cas if k in par) / max(1, len(cas))
        if achadas < 0.8:
            print(f'CONFERIR frase {li}: só {achadas:.0%} das palavras acharam par na fala: {raw}', file=sys.stderr)
        out.append((blocos[0][0], blocos[-1][1], raw, blocos, [round(t[k][0], 2) for k in ks]))
    return out


def quebrar(frase):
    """Blocos "|" da legenda: o menor número de blocos de até ~28 letras, com tamanhos parecidos,
    de preferência quebrando depois de vírgula ou ponto e sem deixar palavra sozinha no fim."""
    ws = frase.split()
    if len(frase) <= BLOCO + 4 or len(ws) < 3:
        return frase
    n = -(-len(frase) // BLOCO)
    alvo = len(frase) / n
    tam = lambda i, j: len(' '.join(ws[i:j]))
    # custo[j][k]: melhor jeito de pôr as j primeiras palavras em k blocos
    INF = float('inf')
    custo = [[INF] * (n + 1) for _ in range(len(ws) + 1)]
    volta = [[0] * (n + 1) for _ in range(len(ws) + 1)]
    custo[0][0] = 0
    for k in range(1, n + 1):
        for j in range(1, len(ws) + 1):
            for i in range(k - 1, j):
                if custo[i][k - 1] == INF:
                    continue
                t = tam(i, j)
                c = (t - alvo) ** 2 / 4 + (400 if t > BLOCO + 4 else 0) + (200 if j - i == 1 else 0)
                if j < len(ws) and not re.search(r'[,;:.!?]$', ws[j - 1]):
                    c += 30  # quebra fora da pontuação custa um pouco
                if j < len(ws) and norm(ws[j - 1]) in LIGA:
                    c += 150  # nunca deixar artigo ou preposição no fim do bloco ("e os | guardas")
                if custo[i][k - 1] + c < custo[j][k]:
                    custo[j][k], volta[j][k] = custo[i][k - 1] + c, i
    cortes, j = [], len(ws)
    for k in range(n, 0, -1):
        i = volta[j][k]
        cortes.append(' '.join(ws[i:j]))
        j = i
    return ' | '.join(reversed(cortes))


def linha_js(x):
    return f"  [{x[0]:.2f}, {x[1]:.2f}, '{x[2]}', {json.dumps(x[3])}, {json.dumps(x[4])}],"


def main():
    if len(sys.argv) < 2:
        sys.exit('uso: python3 tools/tempos.py episodios/<ep> [--novo [--longo]]')
    d = sys.argv[1].rstrip('/\\')
    partes = partes_do_texto(d)
    tw = falados(d, partes)
    dj = os.path.join(d, 'data.js')
    if '--novo' in sys.argv:
        if os.path.exists(dj):
            sys.exit(f'✘ {dj} já existe: sem --novo, o tempos.py só preenche os tempos dele')
        longo = '--longo' in sys.argv
        linhas, parts = [], []
        for p in partes:
            parts.append(len(linhas))
            for ln in p.split('\n'):
                ln = ln.strip()
                if not ln:
                    continue
                for voz, tela in TELA:
                    ln = ln.replace(voz, tela)
                linhas.append(quebrar(ln).replace("'", "\\'"))
        segs = preencher(linhas, tw)
        fim = segs[-1][1]
        cab = ['// Narração da ElevenLabs. Tempos de cada palavra devolvidos pela própria API (tools/tempos.py --novo);',
               '// confira os blocos "|" da legenda (até ~28 letras) e marque "!" ou "*" onde precisar.']
        if longo:
            cab.append("const FORMAT = 'wide';")
        if len(partes) > 1:
            cab += ['// Índice da primeira frase de cada parte do roteiro.', f'const PARTS = {json.dumps(parts)};']
        corpo = '\n'.join(cab + ['const SEGS = ['] + [linha_js(x) for x in segs] + ['];',
                f'const AUDIO_END = {fim:.2f};',
                f'const DURATION = {fim + (10 if longo else 6):.2f}; // fala + cartão final; ajuste se precisar',
                '// Acelera o vídeo inteiro no fim do build (a voz mantém o tom).' if not longo else '',
                f'const SPEED = {1 if longo else 1.25};', ''])
        open(dj, 'w', encoding='utf-8').write(corpo.replace('\n\n', '\n'))
        print(f'{dj}: {len(segs)} frases, fala até {fim:.2f} s', file=sys.stderr)
        return
    if not os.path.exists(dj):
        sys.exit(f'✘ falta {dj} (use --novo para criar a partir do narracao.txt)')
    src = open(dj, encoding='utf-8').read()
    linhas = re.findall(r"^  \[[\d.]+, [\d.]+, '((?:[^'\\]|\\.)*)'", src, re.M)
    if not linhas:
        sys.exit(f'✘ não achei o SEGS em {dj}')
    segs = preencher(linhas, tw)
    corpo = '\n'.join(linha_js(x) for x in segs)
    src = re.sub(r'const SEGS = \[\n.*?\n\];', lambda m: 'const SEGS = [\n' + corpo + '\n];', src, count=1, flags=re.S)
    open(dj, 'w', encoding='utf-8').write(src)
    print(f'{dj}: {len(segs)} frases com os tempos da fala; AUDIO_END e DURATION ficaram como estavam '
          f'(a última frase acaba em {segs[-1][1]:.2f} s)', file=sys.stderr)


if __name__ == '__main__':
    main()
