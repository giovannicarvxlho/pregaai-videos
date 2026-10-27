# Trechos de fala de uma narração, medidos pelas pausas (para o SEGS do data.js).
# Uso: python3 tools/segmentos.py episodios/<ep>/narration.mp3
import array, math, subprocess, sys

pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-ac', '1', '-ar', '16000', '-f', 's16le', '-'],
                     capture_output=True, check=True).stdout
a = array.array('h'); a.frombytes(pcm)
# volume em dB a cada 10 ms
e = [20 * math.log10(math.sqrt(sum(x * x for x in a[i:i + 160]) / 160) + 1) for i in range(0, len(a) - 160, 160)]
thr = max(e) - 38
segs, on, last = [], None, 0
for i, v in enumerate(e):
    if v > thr:
        if on is None: on = i
        last = i
    elif on is not None and i - last > 18:  # pausa de mais de 0,18 s fecha o trecho
        segs.append((on, last)); on = None
if on is not None: segs.append((on, last))
print(' '.join(f'{s / 100:.2f}-{t / 100:.2f}' for s, t in segs))
