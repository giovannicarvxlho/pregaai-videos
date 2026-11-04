# Vídeo longo: junta as partes da narração (episodios/<ep>/partes/01.mp3, 02.mp3...) em
# narration.mp3, com GAP segundos de silêncio depois de cada uma, e mostra onde cada parte começa.
# Uso: python3 tools/juntar.py episodios/<ep>
import glob, os, subprocess, sys

GAP = 0.8
d = sys.argv[1]
parts = sorted(glob.glob(f'{d}/partes/*.mp3'))
args, filt, t = [], '', 0.0
for i, p in enumerate(parts):
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True, check=True).stdout)
    print(f'{os.path.basename(p)} começa em {t:7.2f} s ({dur:.2f} s)')
    args += ['-i', p]
    filt += f'[{i}:a]aresample=44100,aformat=channel_layouts=mono,apad=pad_dur={GAP}[a{i}];'
    t += dur + GAP
filt += ''.join(f'[a{i}]' for i in range(len(parts))) + f'concat=n={len(parts)}:v=0:a=1[out]'
subprocess.run(['ffmpeg', '-v', 'error', '-y', *args, '-filter_complex', filt, '-map', '[out]', '-c:a', 'libmp3lame', '-b:a', '192k', f'{d}/narration.mp3'], check=True)
print(f'{d}/narration.mp3: {t:.2f} s')
