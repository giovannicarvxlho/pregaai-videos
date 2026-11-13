#!/usr/bin/env python3
# Trilha de fundo gerada aqui, sem custo e sem direitos (AGENTS.md: trilha e efeitos saem do próprio pipeline).
#
#   python3 tools/trilha.py <video.mp4> <saida.mp4> --roteiro episodios/<ep>/trilha.json   (segue o roteiro)
#   python3 tools/trilha.py <video.mp4> <saida.mp4>                                        (pad constante)
#   --nivel -3   (ganho final em dB; padrão 0)
#   --corte out/<nome>.corte.json   (curtos e cortes: a trilha segue os trechos que o tools/corte.cjs juntou)
#   --so-fundo   (sai só a trilha, sem a voz, ainda abaixando onde a voz fala: para medir o nível)
#   --medir      (além do vídeo, grava <saida>-fundo.mp4 só com a trilha, para medir)
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
# uma oitava abaixo, sumia no celular). Por baixo, o som do lugar (vento, multidão, noite, pássaros) e
# efeitos na palavra certa (o rolo, os dados, o tecido rasgando, o trovão, o coração, a pedra): ver "ambiente e
# efeitos" abaixo. Música e ambiente abaixam quando a voz fala (sidechain); impactos e efeitos não, para marcarem o momento. O vídeo não é recodificado: só o áudio sai de novo.
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
HUMORES.update({
    # pedido do Giovanni em 2026-11-13: "no começo iremos gerar curiosidade, então trilha de suspense; parte final
    # emoção, logo trilha emocional". Sem piano: a melodia é de cordas.
    'suspense':      ([Dm, Bb, Dm, A], 8.0, 0.7, 0.0, 0.0, 0.02),
    'tensao':        ([Dm, Bb, Gm, A], 6.0, 0.9, 0.0, 0.0, 0.04),
    'emocao':        ([F, C, Dm, Bb], 7.0, 1.0, 0.0, 0.0, 0.10),
    'emocao_menor':  ([Dm, Bb, F, A], 8.0, 1.0, 0.0, 0.0, 0.06),
})
# o que cada humor tem além do pad: pulso (batidas por minuto, volume), melodia de cordas (volume) e um par de
# notas agudas a meio tom de distância, bem baixo, que dá a sensação de suspense (volume)
EXTRAS = {
    'suspense':     {'pulso': (84, 0.55), 'agudo': 0.06},
    'tensao':       {'pulso': (104, 0.75), 'agudo': 0.08},
    'emocao':       {'melodia': 0.6},
    'emocao_menor': {'melodia': 0.5},
    'terno':        {'melodia': 0.35},
    'luz':          {'melodia': 0.6},
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
        palavras = re.sub(r'(^|\s)[!*]', r'\1', m.group(2).replace('|', ' ')).split()  # ! e * só marcam o começo
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


def staccato(f, amp):  # corda tocada curta, para o pulso do suspense
    t = np.arange(int(0.35 * SR)) / SR
    s = np.sin(2 * np.pi * f * t) + 0.6 * np.sin(2 * np.pi * f * 1.002 * t + 1.1) + 0.3 * np.sin(2 * np.pi * 2 * f * t)
    return amp * s / 1.9 * np.minimum(1, t / 0.006) * np.exp(-t / 0.13)


def violino(f, dur, amp):  # nota longa de cordas com vibrato, para a melodia da emoção
    t = np.arange(int(dur * SR)) / SR
    fase = 2 * np.pi * np.cumsum(f * (1 + 0.003 * np.sin(2 * np.pi * 5.5 * t))) / SR
    s = np.sin(fase) + 0.3 * np.sin(2 * fase) + 0.15 * np.sin(3 * fase)
    env = np.minimum(1, t / 0.45) * np.minimum(1, (t[-1] - t) / 0.6 + 0.001)
    return amp * s / 1.45 * env


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
        if roteiro.get('piano') is False:  # só o pad (pedido do Giovanni em 2026-11-13: "não gosto do teclado")
            p_amp = 0
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
            ex = EXTRAS.get(x['humor'], {})
            if 'pulso' in ex:  # colcheias alternando o baixo e a quinta do acorde
                bpm, amp = ex['pulso']
                for q, ti in enumerate(np.arange(0, dur, 30.0 / bpm)):
                    nt = staccato(baixo if q % 2 == 0 else notas[2], 0.5 * amp * (1.0 if q % 4 == 0 else 0.7))
                    i0 = int(ti * SR)
                    m = min(len(nt), janela - i0)
                    bloco[i0:i0 + m] += nt[:m]
            if 'agudo' in ex:  # ré e mi bemol agudos, batendo entre si
                bloco += ex['agudo'] * (np.sin(2 * np.pi * 1174.66 * t) + np.sin(2 * np.pi * 1244.51 * t)) / 2
            if 'melodia' in ex:  # duas notas longas por acorde: a de cima do acorde e a do meio, uma oitava acima
                meio = dur / 2
                for q, nota_m in enumerate((notas[2] * 2, notas[1] * 2)):
                    nt = violino(nota_m, meio + 1.0, 0.45 * ex['melodia'])
                    i0 = int(q * meio * SR)
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


# ---------------------------------------------------------------- ambiente e efeitos (sons do lugar, sem música)
# Tudo sintetizado de ruído filtrado e senoides, sem amostra de terceiros. No trilha.json:
#   "ambientes": [{"de": 8, "ate": 17, "tipo": "vento", "ganho": 0.8}, ...]   (frases; entra e sai em 2 s)
#   "efeitos":   [{"frase": 26, "palavra": "sorteio", "tipo": "dados"}, ...]
#   "ambiente_volume" e "efeitos_volume": em relação ao pad constante, como o "volume" da música.
def ruido(n, lo, hi, semente):
    x = np.fft.rfft(np.random.default_rng(semente).standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    borda = lambda a, b: np.clip((f - a) / max(1, b - a), 0, 1)
    x *= borda(lo * 0.7, lo) * (1 - borda(hi, hi * 1.4))
    y = np.fft.irfft(x, n)
    return y / (np.sqrt(np.mean(y ** 2)) or 1)


def lento(n, hz, semente):  # modulação suave entre 0 e 1
    k = max(2, int(n / SR * hz) + 2)
    v = np.random.default_rng(semente).random(k)
    return np.interp(np.arange(n), np.linspace(0, n, k), v)


def ambiente(tipo, n, semente):
    vento = lambda s: ruido(n, 150, 1000, s) * (0.35 + 0.65 * lento(n, 0.15, s + 1)) \
        + 0.5 * ruido(n, 400, 2000, s + 2) * lento(n, 0.08, s + 3) ** 3
    if tipo == 'vento':
        return vento(semente)
    if tipo == 'noite':  # vento baixo e escuro, com um ronco grave
        return 0.5 * vento(semente) + ruido(n, 80, 400, semente + 4) * (0.6 + 0.4 * lento(n, 0.1, semente + 5))
    if tipo == 'interior':
        return 0.4 * ruido(n, 100, 400, semente)
    if tipo == 'multidao':  # vozes indistintas: ruído na faixa da voz, ligando e desligando como sílabas
        out = np.zeros(n)
        for v in range(6):
            r = np.random.default_rng(semente + 10 + v)
            passo = int(0.22 * SR)
            porta = np.repeat(r.random(n // passo + 1) > 0.45, passo)[:n].astype(float)
            porta = np.convolve(porta, np.ones(int(0.04 * SR)) / int(0.04 * SR), 'same')
            out += ruido(n, 300, 1200, semente + 20 + v) * porta * (0.5 + 0.5 * lento(n, 0.2, semente + 30 + v))
        return out / 3
    if tipo == 'amanhecer':  # brisa e pássaros
        out = 0.3 * vento(semente)
        r = np.random.default_rng(semente + 40)
        t0 = r.uniform(0.5, 2.0)
        while t0 < n / SR - 1:
            for q in range(r.integers(2, 5)):
                f0, f1, d = r.uniform(2800, 3600), r.uniform(3800, 4800), r.uniform(0.07, 0.13)
                t = np.arange(int(d * SR)) / SR
                pio = np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, len(t))) / SR) * np.sin(np.pi * t / d) * 2.5
                i0 = int((t0 + q * 0.16) * SR)
                out[i0:i0 + len(pio)] += pio[:max(0, n - i0)]
            t0 += r.uniform(0.9, 2.8)
        return out
    raise ValueError(f'ambiente desconhecido: {tipo}')


def efeito(tipo, semente=3):
    r = np.random.default_rng(semente)
    def dur(s):
        return np.arange(int(s * SR)) / SR
    if tipo == 'papel':  # rolo desenrolando: chiado agudo com estalos
        t = dur(1.2)
        estalos = np.convolve((r.random(len(t)) > 0.996).astype(float), np.ones(240) / 240, 'same') * 30
        return ruido(len(t), 2000, 7000, semente) * (0.3 + estalos) * np.sin(np.pi * t / t[-1]) * 0.6
    if tipo == 'dados':  # dois dados quicando
        t = dur(1.0)
        out = np.zeros(len(t))
        for k, (ini, a) in enumerate(((0.0, 1.0), (0.18, 0.8), (0.32, 0.6), (0.43, 0.45), (0.51, 0.3), (0.56, 0.2))):
            c = dur(0.05)
            clique = ruido(len(c), 2000, 6000, semente + k) * np.exp(-c / 0.008) + 0.5 * np.sin(2 * np.pi * 3100 * c) * np.exp(-c / 0.01)
            i0 = int(ini * SR)
            out[i0:i0 + len(c)] += a * clique
        return out
    if tipo == 'rasgo':  # tecido rasgando: ruído em grãos, crescendo e cortando seco
        t = dur(1.4)
        grao = np.repeat(r.random(len(t) // int(SR / 90) + 2) > 0.35, int(SR / 90)).astype(float)[:len(t)]
        grao = np.convolve(grao, np.ones(96) / 96, 'same')[:len(t)]
        env = np.minimum(1, t / 0.25) * np.where(t > 1.33, np.exp(-(t - 1.33) / 0.02), 1)
        return ruido(len(t), 800, 6000, semente) * grao * env
    if tipo == 'trovao':  # estrondo grave que rola e some
        t = dur(4.5)
        return (ruido(len(t), 40, 500, semente) * np.exp(-t / 1.6) * (0.7 + 0.3 * lento(len(t), 6, semente))
                + 0.8 * ruido(len(t), 200, 3000, semente + 1) * np.exp(-t / 0.15)) * 1.2
    if tipo == 'coracao':  # duas batidas (tum-tum), com grave e um pouco de médio para o celular
        t = dur(1.8)
        out = np.zeros(len(t))
        for ini, a in ((0.0, 1.0), (0.28, 0.7), (0.9, 0.9), (1.18, 0.6)):
            b = dur(0.25)
            batida = (np.sin(2 * np.pi * 60 * b) + 0.6 * np.sin(2 * np.pi * 120 * b) + 0.4 * np.sin(2 * np.pi * 220 * b)) * np.exp(-b / 0.09) * np.minimum(1, b / 0.004)
            i0 = int(ini * SR)
            out[i0:i0 + len(b)] += a * batida
        return out
    if tipo == 'pedra':  # pedra grande rolando
        t = dur(2.3)
        env = np.minimum(1, t / 0.3) * np.minimum(1, (t[-1] - t) / 0.6)
        return (ruido(len(t), 80, 700, semente) * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * t) ** 2)
                + 0.15 * ruido(len(t), 1000, 4000, semente + 1) * (r.random(len(t)) > 0.7)) * env
    if tipo == 'pop':  # um cartão ou um número entrando na tela: bolha curta que sobe
        t = dur(0.12)
        return np.sin(2 * np.pi * np.cumsum(np.linspace(520, 900, len(t))) / SR) * np.sin(np.pi * t / t[-1]) ** 2
    if tipo == 'tique':  # destaque de palavra
        t = dur(0.05)
        return np.sin(2 * np.pi * 1500 * t) * np.exp(-t / 0.012)
    if tipo == 'madeira':  # a cruz assentando: batida seca de madeira
        t = dur(0.4)
        return ((np.sin(2 * np.pi * 180 * t) + 0.6 * np.sin(2 * np.pi * 355 * t) + 0.3 * np.sin(2 * np.pi * 710 * t))
                * np.exp(-t / 0.07) * np.minimum(1, t / 0.002))
    if tipo == 'brilho':  # luz que aparece: acorde agudo que entra devagar e se apaga
        t = dur(2.2)
        return sum(np.sin(2 * np.pi * f * t) for f in (1174.66, 1479.98, 1760.0, 2349.32)) / 4 \
            * np.minimum(1, t / 0.35) * np.exp(-t / 0.9)
    if tipo == 'anel':  # os anéis do grito se abrindo: tom grave que pulsa e some
        t = dur(1.8)
        return (np.sin(2 * np.pi * 146.83 * t) + 0.5 * np.sin(2 * np.pi * 293.66 * t)) \
            * (0.6 + 0.4 * np.sin(2 * np.pi * 5 * t)) * np.exp(-t / 0.6) * np.minimum(1, t / 0.03)
    if tipo == 'passo':  # pé no chão de terra: batida surda e curta, com um estalo leve
        t = dur(0.15)
        f0 = r.uniform(85, 110)
        return ((np.sin(2 * np.pi * f0 * t) + 0.5 * np.sin(2 * np.pi * 2 * f0 * t) + 0.25 * np.sin(2 * np.pi * 4.3 * f0 * t))
                * np.exp(-t / 0.045) + 0.2 * np.sin(2 * np.pi * 1500 * t) * np.exp(-t / 0.006)) * np.minimum(1, t / 0.002)
    if tipo in ('voz', 'vozes'):  # alguém fala: um "hã" de voz, sem palavra (formantes de vogal sobre uma nota)
        def hum(f0, d):
            t = dur(d)
            f = f0 * (1 + 0.04 * np.sin(2 * np.pi * 4 * t)) * (1 - 0.08 * t / d)
            fase = 2 * np.pi * np.cumsum(f) / SR
            s = sum(np.sin(h * fase) * (np.exp(-((h * f0 - 650) / 220) ** 2) + 0.6 * np.exp(-((h * f0 - 1150) / 260) ** 2) + 0.15)
                    for h in range(1, 12))
            return s * np.sin(np.pi * t / d) ** 0.7
        if tipo == 'voz':
            return hum(r.uniform(150, 210), 0.28)
        t = dur(0.8)
        out = np.zeros(len(t))
        for k in range(4):
            h = hum(r.uniform(130, 240), r.uniform(0.2, 0.35))
            i0 = int(r.uniform(0, 0.4) * SR)
            out[i0:i0 + len(h)] += h[:len(out) - i0]
        return out
    if tipo == 'risco':  # marca-texto passando: rangido tonal curto que sobe
        t = dur(0.35)
        return (np.sin(2 * np.pi * np.cumsum(np.linspace(900, 1400, len(t))) / SR)
                * (0.55 + 0.45 * np.sin(2 * np.pi * 40 * t)) * np.sin(np.pi * t / t[-1]))
    if tipo == 'swish':  # passagem de uma parte para outra: varrida tonal que desce (sem chiado)
        t = dur(0.4)
        return np.sin(2 * np.pi * np.cumsum(np.linspace(1300, 280, len(t))) / SR) * np.sin(np.pi * t / t[-1]) ** 1.5
    if tipo == 'peso':  # algo pesado caindo sobre os ombros
        t = dur(0.6)
        return ((np.sin(2 * np.pi * 110 * t) + 0.6 * np.sin(2 * np.pi * 220 * t) + 0.25 * np.sin(2 * np.pi * 440 * t))
                * np.exp(-t / 0.18) * np.minimum(1, t / 0.003))
    if tipo == 'estica':  # pano esticado entre duas mãos: rangido tonal
        t = dur(0.7)
        return (np.sin(2 * np.pi * np.cumsum(np.linspace(290, 345, len(t))) / SR)
                * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 28 * t))) * np.sin(np.pi * t / t[-1]))
    if tipo == 'passaros':  # só os pássaros, sem vento
        t = dur(3.5)
        out = np.zeros(len(t))
        t0 = 0.2
        while t0 < 3.0:
            for q in range(r.integers(2, 4)):
                f0, f1, d = r.uniform(2800, 3600), r.uniform(3800, 4800), r.uniform(0.07, 0.13)
                c = dur(d)
                pio = np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, len(c))) / SR) * np.sin(np.pi * c / d)
                i0 = int((t0 + q * 0.16) * SR)
                out[i0:i0 + len(pio)] += pio[:max(0, len(t) - i0)]
            t0 += r.uniform(0.8, 1.4)
        return out
    raise ValueError(f'efeito desconhecido: {tipo}')


def sons(seg, roteiro, fr):
    n = int(seg * SR)
    amb, efs = np.zeros(n), np.zeros(n)
    fim_de = lambda i: fr[i][0] if i < len(fr) else seg
    for k, x in enumerate(roteiro.get('ambientes', [])):
        a, b = int(quando(fr, x['de']) * SR), min(n, int(fim_de(x['ate']) * SR))
        if b <= a:
            continue
        s = ambiente(x['tipo'], b - a, 100 + 7 * k)
        r = min(int(2 * SR), (b - a) // 2)
        env = np.ones(b - a)
        env[:r] = np.linspace(0, 1, r)
        env[-r:] = np.linspace(1, 0, r)
        amb[a:b] += s * env * x.get('ganho', 1.0)
    efeitos = list(roteiro.get('efeitos', []))
    ev_arq = roteiro.get('_eventos')
    if ev_arq and os.path.exists(ev_arq):  # momentos tirados da animação: passos, falas, grifos, cartões
        ev = json.load(open(ev_arq, encoding='utf-8'))
        som = {'passos': 'passo', 'voz': 'voz', 'grifa': 'risco', 'cartao': 'pop'}
        for chave, tipo in som.items():
            g = roteiro.get('eventos', {}).get(chave, 0)
            efeitos += [{'t': t, 'tipo': tipo, 'ganho': g} for t in ev.get(chave, []) if g]
    for k, x in enumerate(efeitos):
        t0 = x['t'] if 't' in x else quando(fr, x['frase'], x.get('palavra'))
        i0 = int((t0 + x.get('atraso', 0)) * SR)
        s = efeito(x['tipo'], 200 + k)
        s = s / (np.max(np.abs(s)) or 1) * x.get('ganho', 1.0)
        m = max(0, min(len(s), n - i0))
        efs[i0:i0 + m] += s[:m]
    return amb, efs


def grava(arq, x):
    with wave.open(arq, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())


def prepara(roteiro, fr, total):
    """Música, impactos, ambiente e efeitos na linha do tempo da narração, já no volume do roteiro."""
    referencia, _ = faixas(total, {'secoes': CONSTANTE}, [])  # o pad constante, que a escala de volume usa
    musica, golpes = faixas(total, roteiro, fr)
    rms = lambda x: np.sqrt(np.mean(x ** 2)) or 1
    escala = 0.9 / np.max(np.abs(referencia))  # o pad constante sai com pico de 0,9
    musica *= escala * roteiro.get('volume', 1.0) * rms(referencia) / rms(musica)
    golpes *= escala * rms(referencia) * 1.4
    amb, efs = sons(total, roteiro, fr)
    amb *= escala * rms(referencia) * roteiro.get('ambiente_volume', 0.0)
    efs *= escala * rms(referencia) * 1.4 * roteiro.get('efeitos_volume', 0.0)
    return musica, golpes, amb, efs


def recorta(x, trechos, seg):
    """Junta os pedaços na ordem do vídeo, com 40 ms de transição em cada emenda."""
    k = int(0.04 * SR)
    out = np.zeros(int((seg + 3) * SR))
    pos = 0
    for a, b in trechos:
        p = x[int(a * SR):int(b * SR)].copy()
        p[:k] *= np.linspace(0, 1, min(k, len(p)))
        p[-k:] *= np.linspace(1, 0, min(k, len(p)))
        m = max(0, min(len(p), len(out) - pos))
        out[pos:pos + m] += p[:m]
        pos += len(p)
    return out


def mistura(entrada, saida, faixas4, seg, nivel, so_fundo=False):
    musica, golpes, amb, efs = faixas4
    with tempfile.TemporaryDirectory() as tmp:
        wm, wg, wa, we = (os.path.join(tmp, f'{x}.wav') for x in ('musica', 'golpes', 'ambiente', 'efeitos'))
        grava(wm, musica); grava(wg, golpes); grava(wa, amb); grava(we, efs)
        cauda = f'afade=t=in:st=0:d=3,afade=t=out:st={max(0, seg - 6):.2f}:d=6,atrim=0:{seg:.3f}'
        filtro = (f'[1:a]lowpass=f=3500,aecho=0.8:0.6:70|140:0.25|0.15,volume={nivel}dB,{cauda}[m];'
                  f'[2:a]lowpass=f=5000,aecho=0.8:0.5:90|180:0.3|0.2,volume={nivel}dB,{cauda}[g];'
                  f'[3:a]lowpass=f=8000,volume={nivel}dB,{cauda}[am];'
                  f'[4:a]aecho=0.8:0.4:60:0.2,volume={nivel}dB,{cauda}[ef];'
                  '[m][am]amix=inputs=2:normalize=0[fundo];'
                  '[0:a]asplit=2[voz][chave];'
                  '[fundo][chave]sidechaincompress=threshold=0.08:ratio=1.3:attack=80:release=900[mb];'
                  + ('[voz]anullsink;[mb][g][ef]amix=inputs=3:normalize=0[a]' if so_fundo else  # para medir
                     '[voz][mb][g][ef]amix=inputs=4:duration=first:normalize=0,alimiter=limit=0.9:level=disabled[a]'))
        subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', entrada, '-i', wm, '-i', wg, '-i', wa, '-i', we,
                               '-filter_complex', filtro, '-map', '0:v', '-map', '[a]', '-c:v', 'copy',
                               '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', saida])


def main():
    args = sys.argv[1:]
    valor = lambda k, d: args[args.index(k) + 1] if k in args else d
    opcoes = ('--nivel', '--roteiro', '--corte')
    pos = [x for i, x in enumerate(args) if not x.startswith('--') and (i == 0 or args[i - 1] not in opcoes)]
    cortes = [args[i + 1] for i, x in enumerate(args) if x == '--corte']
    if not pos or len(pos) % 2 or (cortes and len(cortes) != len(pos) // 2):
        sys.exit('uso: python3 tools/trilha.py <video.mp4> <saida.mp4> [<video2.mp4> <saida2.mp4> ...] '
                 '[--roteiro episodios/<ep>/trilha.json] [--corte out/<nome>.corte.json, um por vídeo] [--nivel 0]')
    pares = list(zip(pos[::2], pos[1::2]))
    nivel = float(valor('--nivel', 0))
    rot_arq = valor('--roteiro', None)
    roteiro = json.load(open(rot_arq, encoding='utf-8')) if rot_arq else {'secoes': CONSTANTE}
    if rot_arq:
        roteiro['_eventos'] = os.path.join(os.path.dirname(rot_arq), 'eventos.json')  # node tools/eventos.cjs <ep>
    fr = frases(os.path.join(os.path.dirname(rot_arq), 'data.js')) if rot_arq else []
    trechos = [json.load(open(c, encoding='utf-8'))['trechos'] for c in cortes] or [None] * len(pares)
    segs = [duracao(e) for e, _ in pares]
    # a trilha é calculada uma vez, na linha do tempo da narração, e recortada para cada vídeo
    total = max(max(b for _, b in t) if t else s for t, s in zip(trechos, segs)) + 3
    faixas4 = prepara(roteiro, fr, total)
    for (entrada, saida), t, seg in zip(pares, trechos, segs):
        f4 = [recorta(x, t, seg) for x in faixas4] if t else [x[:int((seg + 3) * SR)] for x in faixas4]
        mistura(entrada, saida, f4, seg, nivel, '--so-fundo' in args)
        if '--medir' in args:  # também <saida>-fundo.mp4, só a trilha (abaixando sob a voz), para medir
            mistura(entrada, saida.replace('.mp4', '-fundo.mp4'), f4, seg, nivel, True)
        print(f'{saida}: trilha {"pelo roteiro" if rot_arq else "constante"}, {nivel:g} dB, {seg:.1f} s')


if __name__ == '__main__':
    main()
