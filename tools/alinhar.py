# Vídeo longo: mede no áudio o início e o fim de cada frase e de cada bloco "|" do data.js
# e reescreve o SEGS com os tempos reais. Para 100+ frases, o caminho manual do README
# (segmentos.py + transcrever.py + digitar) não escala.
# Como: corta a narração nas pausas, transcreve cada trecho com Whisper, alinha as palavras
# transcritas com as do roteiro e reparte o tempo de cada trecho pelas sílabas.
# Uso: python3 tools/alinhar.py episodios/<ep>   (precisa do narration.mp3; ver tools/juntar.py)
import array, difflib, math, os, re, subprocess, sys, unicodedata
import sherpa_onnx

d = sys.argv[1]
src = open(f'{d}/data.js', encoding='utf-8').read()
lines = re.findall(r"^  \[[\d.]+, [\d.]+, '((?:[^'\\]|\\.)*)'", src, re.M)

pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{d}/narration.mp3', '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
a = array.array('h'); a.frombytes(pcm)
# trechos de fala pelas pausas (o mesmo critério do segmentos.py)
e = [20 * math.log10(math.sqrt(sum(x * x for x in a[i:i + 160]) / 160) + 1) for i in range(0, len(a) - 160, 160)]
thr = max(e) - 38
segs, on, last = [], None, 0
for i, v in enumerate(e):
    if v > thr:
        if on is None: on = i
        last = i
    elif on is not None and i - last > 18:
        segs.append((on / 100, last / 100)); on = None
if on is not None: segs.append((on / 100, last / 100))

mdir = os.path.join(os.path.dirname(__file__), 'modelos', 'sherpa-onnx-whisper-small')
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{mdir}/small-encoder.int8.onnx', decoder=f'{mdir}/small-decoder.int8.onnx',
                                                 tokens=f'{mdir}/small-tokens.txt', language='pt', task='transcribe', num_threads=4)
NUM = {'1': 'um', '2': 'dois', '3': 'tres', '4': 'quatro', '5': 'cinco', '6': 'seis', '7': 'sete', '9': 'nove'}
def norm(w):
    w = unicodedata.normalize('NFD', w.lower()); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    w = re.sub(r'[^a-z0-9]', '', w)
    return NUM.get(w, w)
def syl(w):
    return max(1, len(re.findall(r'[aeiouy]+', norm(w))))

# palavras transcritas com o tempo estimado de cada uma
tw = []  # (palavra normalizada, início, fim)
for s, t in segs:
    st = rec.create_stream()
    st.accept_waveform(16000, [x / 32768 for x in a[int(max(0, s - 0.1) * 16000):int((t + 0.1) * 16000)]])
    rec.decode_stream(st)
    ws = [w for w in re.split(r'[\s-]+', st.result.text) if norm(w)]
    tot = sum(syl(w) for w in ws) or 1
    acc = 0
    for w in ws:
        k = syl(w); tw.append((norm(w), s + (t - s) * acc / tot, s + (t - s) * (acc + k) / tot)); acc += k
    print(f'{s:7.2f}-{t:7.2f} {st.result.text.strip()}', file=sys.stderr, flush=True)

# palavras do roteiro: (palavra normalizada, frase, bloco)
sw = []
for li, raw in enumerate(lines):
    for ci, chunk in enumerate(raw.replace("\\'", "'").split('|')):
        for w in re.split(r'[\s-]+', chunk):
            if norm(w): sw.append((norm(w), li, ci, syl(w)))
sm = difflib.SequenceMatcher(None, [x[0] for x in sw], [x[0] for x in tw], autojunk=False)
match = {}
for blk in sm.get_matching_blocks():
    for k in range(blk.size): match[blk.a + k] = blk.b + k
print(f'{len(match)}/{len(sw)} palavras do roteiro achadas no áudio', file=sys.stderr)

SYL = 1 / 5.35
def word_time(i, edge):
    # início (edge 0) ou fim (edge 1) da palavra i do roteiro; sem par, anda até a vizinha com par
    if i in match: return tw[match[i]][1 + edge]
    step = 1 if edge == 0 else -1
    j, gap = i, 0
    while 0 <= j < len(sw) and j not in match: gap += sw[j][3]; j += step
    if not (0 <= j < len(sw)): return None
    return tw[match[j]][1] - gap * SYL if edge == 0 else tw[match[j]][2] + gap * SYL

out, prev_end = [], 0.0
for li, raw in enumerate(lines):
    idx = [k for k, x in enumerate(sw) if x[1] == li]
    nch = max(sw[k][2] for k in idx) + 1
    spans = []
    for ci in range(nch):
        ck = [k for k in idx if sw[k][2] == ci]
        s0, s1 = word_time(ck[0], 0), word_time(ck[-1], 1)
        s0 = max(s0, prev_end + 0.02); s1 = max(s1, s0 + 0.3)
        spans.append([round(s0, 2), round(s1, 2)]); prev_end = s1
    hit = sum(1 for k in idx if k in match) / len(idx)
    if hit < 0.6: print(f'CONFERIR frase {li}: só {hit:.0%} das palavras achadas: {raw}', file=sys.stderr)
    out.append((spans[0][0], spans[-1][1], raw, spans if nch > 1 else None))

dur = len(a) / 16000
body = ''.join(f"  [{x[0]:.2f}, {x[1]:.2f}, '{x[2]}'" + (f", {x[3]}" if x[3] else '') + '],\n' for x in out)
src = re.sub(r'const SEGS = \[\n.*?\n\];', 'const SEGS = [\n' + body + '];', src, flags=re.S)
src = re.sub(r'const AUDIO_END = [\d.]+;', f'const AUDIO_END = {dur:.2f};', src)
src = re.sub(r'const DURATION = [\d.]+;', f'const DURATION = {dur + 20:.2f};', src)
src = re.sub(r'^// .*?\n(?=const FORMAT)', f'// Vídeo longo, 16:9. Narração em partes (partes/*.mp3, juntas por tools/juntar.py); tempos medidos\n// com tools/alinhar.py: pausas no áudio + Whisper + alinhamento com o roteiro.\n', src, flags=re.S)
open(f'{d}/data.js', 'w', encoding='utf-8').write(src)
print(f'{len(out)} frases, áudio de {dur:.2f} s', file=sys.stderr)
