# Gera a legenda .srt de um episódio a partir do data.js (os tempos medidos de cada frase),
# com os mesmos blocos "|" da legenda do vídeo. Respeita o SPEED do episódio.
# Uso: python3 tools/legenda.py episodios/<ep>   -> episodios/<ep>/legenda.srt
import re, sys, unicodedata

d = sys.argv[1]
src = open(f'{d}/data.js', encoding='utf-8').read()
speed = float((re.search(r'const SPEED = ([\d.]+)', src) or [0, 1])[1])
segs = re.findall(r"^  \[([\d.]+), ([\d.]+), '((?:[^'\\]|\\.)*)'(?:, (\[\[.*?\]\]))?\]", src, re.M)

def syl(w):
    w = unicodedata.normalize('NFD', w.lower()); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return max(1, len(re.findall(r'[aeiouy]+', w)))

cues = []
for a, b, raw, spans in segs:
    parts = [p.strip() for p in raw.replace("\\'", "'").lstrip('!').split('|')]
    if spans:
        times = [tuple(x) for x in eval(spans)]
    else:  # sem pausa medida dentro da frase: divide o tempo pelas sílabas
        w = [sum(syl(x) for x in p.split()) for p in parts]
        a, b, acc, times = float(a), float(b), 0, []
        for k in w: times.append((a + (b - a) * acc / sum(w), a + (b - a) * (acc + k) / sum(w))); acc += k
    cues += [(s, e, p) for (s, e), p in zip(times, parts)]

def ts(t):
    t = max(0, t / speed); ms = round(t * 1000)
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'
out = []
for i, (s, e, txt) in enumerate(cues):
    nxt = cues[i + 1][0] if i + 1 < len(cues) else e + 1
    end = min(e + 0.4, nxt - 0.05)  # segura um pouco depois da fala, sem encostar na próxima
    out.append(f'{i + 1}\n{ts(s)} --> {ts(max(end, s + 0.5))}\n{txt}\n')
open(f'{d}/legenda.srt', 'w', encoding='utf-8').write('\n'.join(out))
print(f'{d}/legenda.srt: {len(cues)} blocos')
