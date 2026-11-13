#!/usr/bin/env python3
# Trilha de fundo gerada aqui, sem custo e sem direitos (AGENTS.md: trilha e efeitos saem do próprio pipeline).
#
#   python3 tools/trilha.py <video.mp4> <saida.mp4> --roteiro episodios/<ep>/trilha.json   (segue o roteiro)
#   python3 tools/trilha.py <video.mp4> <saida.mp4>                                        (pad constante)
#   --nivel -3   (ganho final em dB; padrão 0)
#
# Com --roteiro, a trilha acompanha a história (pedido do Giovanni em 2026-11-13: "momentos emocionantes,
# impactantes, gostaria que a trilha sonora respeitasse isso"). O trilha.json do episódio diz, por frase do
# SEGS do data.js: o humor de cada trecho (a harmonia e os instrumentos), o ganho no começo e no fim do trecho
# (sobe e desce dentro dele) e os impactos (uma batida grave ou um acorde luminoso numa palavra). Exemplo:
#   {"volume": 0.7,
#    "secoes": [{"frase": 0, "humor": "misterio", "ganho": 0.45, "ate": 0.6}, ...],
#    "impactos": [{"frase": 29, "palavra": "rasgou", "tipo": "escuro"}, ...]}
# "volume": a média da trilha em relação ao pad constante (0.7 = 30% mais baixa).
#
# Dois instrumentos sintetizados: cordas (um pad de notas levemente desafinadas) e um piano (notas com ataque e
# queda, em arpejo). Tudo na região média, porque alto-falante de celular quase não toca grave (a 1ª versão,
# uma oitava abaixo, sumia no celular). As cordas e o piano abaixam quando a voz fala (sidechain); os impactos
# não, para marcarem o momento. O vídeo não é recodificado: só o áudio sai de novo.
import json, os, re, subprocess, sys, tempfile, wave
import numpy as np

SR = 48000
OITAVA = 2
# acordes em Hz (baixo, notas), uma oitava abaixo de onde soam (OITAVA sobe)
Dm, Gm, A = (73.42, [146.83, 174.61, 220.00]), (98.00, [146.83, 196.00, 233.08]), (110.0, [138.59, 164.81, 220.00])
Bb, F, C = (58.27, [116.54, 146.83, 174.61]), (87.31, [174.61, 220.00, 261.63]), (65.41, [130.81, 164.81, 196.00])
D, G = (73.42, [146.83, 185.00, 220.00]), (98.00, [146.83, 196.00, 246.94])
# humor: acordes, segundos por acorde, cordas, piano, segundos entre notas do piano, brilho (oitava de cima)
HUMORES = {
    'pad':       ([Dm, Bb, F, C], 8.0, 1.0, 0.0, 0.0, 0.06),  # a trilha constante, sem roteiro
    'misterio':  ([Dm, Gm, Dm, A], 8.0, 1.0, 0.5, 2.0, 0.04),
    'menor':     ([Dm, Bb, F, C], 8.0, 0.8, 0.7, 1.0, 0.06),
    'escuro':    ([Dm, Bb, Gm, A], 10.0, 1.0, 0.0, 0.0, 0.02),
    'esperanca': ([Bb, F, C, F], 6.0, 0.7, 1.0, 0.75, 0.10),
    'terno':     ([F, Bb, F, C], 8.0, 0.35, 0.9, 1.5, 0.08),
    'luz':       ([D, G, D, A], 6.0, 1.0, 1.0, 0.75, 0.18),
}
CONSTANTE = [{'frase': 0, 'humor': 'pad', 'ganho': 1.0}]


def duracao(arq):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                                          '-of', 'csv=p=0', arq]).decode().strip())


def frases(data_js):
    """[(início, [(palavra, início)])] de cada frase do SEGS."""
    s = open(data_js, encoding='utf-8').read()
    corpo = re.search(r'SEGS\s*=\s*\[(.*?)\n\];', s, re.S).group(1)
    out = []
    for linha in corpo.split('\n'):
        m = re.match(r"\s*\[([\d.]+),\s*[\d.]+,\s*'((?:[^'\\]|\\.)*)'", linha)
        if not m:
            continue
        tempos = [float(x) for x in re.findall(r'[\d.]+', linha[linha.rfind('[') + 1:linha.rfind(']')])]
        palavras = re.sub(r'[|!*]', ' ', m.group(2)).split()
        out.append((float(m.group(1)), list(zip(palavras, tempos)) if len(palavras) == len(tempos) else []))
    return out


def quando(fr, i, palavra=None):
    ini, pals = fr[i]
    if palavra:
        for p, t in pals:
            if p.strip('.,!?:;"“”\'').lower().startswith(palavra.lower()):
                return t
    return ini


def cordas(f, t, amp):
    s = sum(np.sin(2 * np.pi * f * (1 + d) * t + fase) for d, fase in ((-0.0015, 0.0), (0.0, 1.3), (0.0015, 2.1)))
    return amp * (s + 0.18 * np.sin(2 * np.pi * 2 * f * t)) / 3.2


def piano(f, amp):
    t = np.arange(int(3.0 * SR)) / SR
    s = sum(a * np.exp(-t / q) * np.sin(2 * np.pi * f * h * (1 + 0.0004 * h) * t)
            for h, a, q in ((1, 1.0, 1.6), (2, 0.5, 1.0), (3, 0.25, 0.6), (4, 0.12, 0.4)))
    return amp * s * np.minimum(1, t / 0.005)


def impacto(tipo):
    t = np.arange(int(5.0 * SR)) / SR
    if tipo == 'luz':  # acorde de ré maior em sino, com ataque suave
        s = sum(np.sin(2 * np.pi * f * t) * np.exp(-t / 3.5) for f in (587.33, 739.99, 880.0, 1174.66)) / 4
        return s * np.minimum(1, t / 0.08)
    queda = 73.42 * 2 * (1 + 0.6 * np.exp(-t / 0.08))  # batida grave com a altura caindo
    s = np.sin(2 * np.pi * np.cumsum(queda) / SR) * np.exp(-t / 1.6)
    s += 0.5 * np.sin(2 * np.pi * 220 * t) * np.exp(-t / 2.2)
    ruido = np.random.default_rng(7).standard_normal(len(t)) * np.exp(-t / 0.12)
    return (s + 0.25 * np.convolve(ruido, np.ones(8) / 8, 'same')) / 1.6


def faixas(seg, roteiro, fr):
    n = int(seg * SR)
    secoes = roteiro['secoes']
    inicios = [quando(fr, x['frase']) if fr else 0.0 for x in secoes] + [seg]
    ganho = np.zeros(n)
    musica = np.zeros(n)
    sobra = int(2.5 * SR)
    for k, x in enumerate(secoes):
        a, b = int(inicios[k] * SR), int(inicios[k + 1] * SR)
        ganho[a:b] = np.linspace(x['ganho'], x.get('ate', x['ganho']), max(1, b - a))[:b - a]
        acordes, dur, c_amp, p_amp, p_passo, brilho = HUMORES[x['humor']]
        passo = int(dur * SR)
        janela = passo + sobra
        env = np.ones(janela)
        rampa = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, sobra))
        env[:sobra], env[-sobra:] = rampa, rampa[::-1]
        t = np.arange(janela) / SR
        for j, ini in enumerate(range(a, b, passo)):
            baixo, notas = acordes[j % len(acordes)]
            baixo, notas = baixo * OITAVA, [f * OITAVA for f in notas]
            bloco = c_amp * (cordas(baixo, t, 0.55) + sum(cordas(f, t, 0.35) for f in notas)
                             + cordas(notas[0] * 2, t, brilho * 2))
            if p_amp and p_passo:  # arpejo: baixo, notas do acorde subindo e descendo
                seq = [baixo * 2] + notas + [notas[0] * 2] + notas[::-1][1:-1]
                for q, ti in enumerate(np.arange(0, dur, p_passo)):
                    nt = piano(seq[q % len(seq)], 0.22 * p_amp)
                    i0 = int(ti * SR)
                    m = min(len(nt), janela - i0)
                    bloco[i0:i0 + m] += nt[:m]
            bloco *= env * (1 + 0.06 * np.sin(2 * np.pi * 0.1 * (t + ini / SR)))
            fim = min(n, ini + janela, b + sobra)
            musica[ini:fim] += bloco[:fim - ini]
    k = int(1.5 * SR)  # suaviza as trocas de ganho entre trechos
    ganho = np.convolve(np.pad(ganho, (k, k), mode='edge'), np.ones(k) / k, 'same')[k:-k]
    musica *= ganho
    golpes = np.zeros(n)
    for x in roteiro.get('impactos', []):
        i0 = int(quando(fr, x['frase'], x.get('palavra')) * SR)
        s = impacto(x.get('tipo', 'escuro'))
        m = min(len(s), n - i0)
        golpes[i0:i0 + m] += s[:m] * x.get('ganho', 1.0)
    return musica, golpes


def grava(arq, x):
    with wave.open(arq, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def main():
    args = sys.argv[1:]
    valor = lambda k, d: args[args.index(k) + 1] if k in args else d
    pos = [x for i, x in enumerate(args) if not x.startswith('--') and (i == 0 or args[i - 1] not in ('--nivel', '--roteiro'))]
    if len(pos) != 2:
        sys.exit('uso: python3 tools/trilha.py <video.mp4> <saida.mp4> [--roteiro episodios/<ep>/trilha.json] [--nivel 0]')
    entrada, saida = pos
    nivel = float(valor('--nivel', 0))
    seg = duracao(entrada)
    rot_arq = valor('--roteiro', None)
    roteiro = json.load(open(rot_arq, encoding='utf-8')) if rot_arq else {'secoes': CONSTANTE}
    fr = frases(os.path.join(os.path.dirname(rot_arq), 'data.js')) if rot_arq else []
    referencia, _ = faixas(seg + 3, {'secoes': CONSTANTE}, [])  # o pad constante, que a escala de volume usa
    musica, golpes = faixas(seg + 3, roteiro, fr)
    rms = lambda x: np.sqrt(np.mean(x ** 2)) or 1
    escala = 0.9 / np.max(np.abs(referencia))  # o pad constante sai com pico de 0,9
    musica *= escala * roteiro.get('volume', 1.0) * rms(referencia) / rms(musica)
    golpes *= escala * rms(referencia) * 1.4
    with tempfile.TemporaryDirectory() as tmp:
        wm, wg = os.path.join(tmp, 'musica.wav'), os.path.join(tmp, 'golpes.wav')
        grava(wm, musica); grava(wg, golpes)
        cauda = f'afade=t=in:st=0:d=3,afade=t=out:st={max(0, seg - 6):.2f}:d=6,atrim=0:{seg:.3f}'
        filtro = (f'[1:a]lowpass=f=3500,aecho=0.8:0.6:70|140:0.25|0.15,volume={nivel}dB,{cauda}[m];'
                  f'[2:a]lowpass=f=5000,aecho=0.8:0.5:90|180:0.3|0.2,volume={nivel}dB,{cauda}[g];'
                  '[0:a]asplit=2[voz][chave];'
                  '[m][chave]sidechaincompress=threshold=0.05:ratio=1.5:attack=60:release=800[mb];'
                  '[voz][mb][g]amix=inputs=3:duration=first:normalize=0,alimiter=limit=0.9:level=disabled[a]')
        subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', entrada, '-i', wm, '-i', wg,
                               '-filter_complex', filtro, '-map', '0:v', '-map', '[a]', '-c:v', 'copy',
                               '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', saida])
    print(f'{saida}: trilha {"pelo roteiro" if rot_arq else "constante"}, {nivel:g} dB, {seg:.1f} s')


if __name__ == '__main__':
    main()
