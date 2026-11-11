# Vídeo longo: junta as partes da narração (episodios/<ep>/partes/01.mp3, 02.mp3...) em
# narration.mp3, com GAP segundos de silêncio depois de cada uma, e mostra onde cada parte começa.
# Uso: python3 tools/juntar.py episodios/<ep>
# A duração de cada parte vem das amostras decodificadas, a mesma conta que o concat faz. A duração do
# ffprobe inclui o enchimento do codificador no fim de cada mp3 e, somada, atrasou ~0,4 s as últimas
# frases do eu-sou (os curtos abriam com a primeira palavra cortada; corrigido em 11/11/2026).
import glob, os, subprocess, sys

GAP = 0.8
SR = 44100


def amostras(p):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-af', f'aresample={SR},aformat=channel_layouts=mono',
                          '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return len(pcm) / 2 / SR


def inicios(parts):
    """Onde cada parte começa na narração juntada (s), e o fim previsto."""
    out, t = [], 0.0
    for p in parts:
        out.append(t)
        t += amostras(p) + GAP
    return out, t


def juntar(d):
    parts = sorted(glob.glob(f'{d}/partes/*.mp3'))
    ini, t = inicios(parts)
    args, filt = [], ''
    for i, p in enumerate(parts):
        print(f'{os.path.basename(p)} começa em {ini[i]:7.2f} s')
        args += ['-i', p]
        filt += f'[{i}:a]aresample={SR},aformat=channel_layouts=mono,apad=pad_dur={GAP}[a{i}];'
    filt += ''.join(f'[a{i}]' for i in range(len(parts))) + f'concat=n={len(parts)}:v=0:a=1[out]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *args, '-filter_complex', filt, '-map', '[out]', '-c:a', 'libmp3lame', '-b:a', '192k', f'{d}/narration.mp3'], check=True)
    real = amostras(f'{d}/narration.mp3')
    print(f'{d}/narration.mp3: {real:.2f} s (previsto {t:.2f} s)')
    if abs(real - t) > 0.05:
        print(f'! a narração juntada difere {real - t:+.2f} s do previsto: confira os tempos (tools/tempos.py ou alinhar.py)')


if __name__ == '__main__':
    juntar(sys.argv[1].rstrip('/\\'))
