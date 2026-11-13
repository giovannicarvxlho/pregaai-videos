#!/usr/bin/env python3
# Trilha de fundo gerada aqui, sem custo e sem direitos (AGENTS.md: trilha e efeitos saem do próprio pipeline).
# Um "pad" lento em ré menor (i, VI, III, VII), notas com leve desafinação, troca de acorde a cada 8 s com
# transição suave; depois o ffmpeg passa um filtro de graves e um eco curto que faz as vezes de reverb.
#
#   python3 tools/trilha.py out/salmo-22.mp4 out/salmo-22-trilha.mp4            (mistura num vídeo pronto)
#   python3 tools/trilha.py out/salmo-22.mp4 out/salmo-22-trilha.mp4 --nivel -24 (mais baixa; padrão -6 dB)
#
# A trilha abaixa sozinha quando a voz fala (sidechain): fica audível nas pausas e não disputa com a narração.
# O vídeo não é recodificado (o stream de imagem é copiado); só o áudio sai de novo.
import os, subprocess, sys, tempfile, wave
import numpy as np

SR = 48000
ACORDE_S = 8.0
# ré menor, si bemol maior, fá maior, dó maior: (baixo, notas do acorde) em Hz
ACORDES = [(73.42, [146.83, 174.61, 220.00]),
           (58.27, [116.54, 146.83, 174.61]),
           (87.31, [174.61, 220.00, 261.63]),
           (65.41, [130.81, 164.81, 196.00])]


def duracao(arq):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                                          '-of', 'csv=p=0', arq]).decode().strip())


def nota(f, t, amp):
    # três vozes levemente desafinadas e um pouco do 2º harmônico: som de "cordas" macio
    s = sum(np.sin(2 * np.pi * f * (1 + d) * t + fase) for d, fase in ((-0.0015, 0.0), (0.0, 1.3), (0.0015, 2.1)))
    s += 0.18 * np.sin(2 * np.pi * 2 * f * t)
    return amp * s / 3.2


def pad(seg):
    n = int(seg * SR)
    out = np.zeros(n)
    passo, sobra = int(ACORDE_S * SR), int(2.5 * SR)  # cada acorde dura 8 s + 2,5 s de transição
    janela = passo + sobra
    env = np.ones(janela)
    rampa = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, sobra))
    env[:sobra] = rampa
    env[-sobra:] = rampa[::-1]
    t = np.arange(janela) / SR
    for k, ini in enumerate(range(0, n, passo)):
        baixo, notas = ACORDES[k % len(ACORDES)]
        bloco = nota(baixo, t, 0.55) + sum(nota(f, t, 0.35) for f in notas) + nota(notas[0] * 2, t, 0.06)
        bloco *= env * (1 + 0.08 * np.sin(2 * np.pi * 0.1 * (t + ini / SR)))  # respiração lenta
        fim = min(n, ini + janela)
        out[ini:fim] += bloco[:fim - ini]
    out /= np.max(np.abs(out)) or 1
    return (out * 0.9 * 32767).astype(np.int16)


def main():
    a = [x for i, x in enumerate(sys.argv[1:], 1) if not x.startswith('--') and sys.argv[i - 1] != '--nivel']
    if len(a) != 2:
        sys.exit('uso: python3 tools/trilha.py <video.mp4> <saida.mp4> [--nivel -6]')
    entrada, saida = a
    nivel = float(sys.argv[sys.argv.index('--nivel') + 1]) if '--nivel' in sys.argv else -6.0
    seg = duracao(entrada)
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, 'pad.wav')
        with wave.open(wav, 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes(pad(seg + 3).tobytes())
        filtro = (f'[1:a]lowpass=f=1800,aecho=0.8:0.6:70|140:0.25|0.15,volume={nivel}dB,'
                  f'afade=t=in:st=0:d=3,afade=t=out:st={max(0, seg - 6):.2f}:d=6,atrim=0:{seg:.3f}[m];'
                  '[0:a]asplit=2[voz][chave];'
                  '[m][chave]sidechaincompress=threshold=0.02:ratio=2:attack=40:release=700[mb];'
                  '[voz][mb]amix=inputs=2:duration=first:normalize=0[a]')
        subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', entrada, '-i', wav, '-filter_complex', filtro,
                               '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k',
                               '-movflags', '+faststart', saida])
    print(f'{saida}: trilha a {nivel:g} dB, {seg:.1f} s')


if __name__ == '__main__':
    main()
