# Desenho com diálogo: cada personagem com a sua voz da ElevenLabs, juntadas com as pausas do roteiro.
# Uso: python3 tools/dialogo.py episodios/<ep>            gera as falas que faltam, monta o narration.mp3 e o data.js
#      python3 tools/dialogo.py episodios/<ep> --custo    só diz quais falas faltam e quantos caracteres gastariam
#      python3 tools/dialogo.py episodios/<ep> --refazer 3,7   gera de novo essas falas (gasta crédito)
#      python3 tools/dialogo.py episodios/<ep> --estimar  data.js com tempos estimados, sem voz e sem crédito (para montar
#                                                         e revisar as cenas antes da aprovação do roteiro)
#
# episodios/<ep>/dialogo.txt: uma fala por linha, "PERSONAGEM: texto"; "[pausa N]" põe N s de silêncio (ação sem fala);
#   "[gancho TEXTO]" é o texto do 1º quadro (vai para o GANCHO do data.js); linhas com # são comentário.
# episodios/<ep>/vozes.json: { "PERSONAGEM": { "voz": "<voice_id>", "ajustes": {voice_settings} } }.
# Cada fala vira falas/NN.mp3 + NN.tempos.json (o tempo de cada letra, devolvido pela ElevenLabs). Fala que já existe
# com o mesmo texto e a mesma voz não é gerada de novo; a que mudou de texto ou de voz é.
# O data.js sai com o SEGS (legenda e wordTime, pelas funções do tools/tempos.py) e o FALAS: quem fala em cada frase
# e os trechos em que a boca está aberta (as vogais da fala), para o desenho mexer a boca de quem fala.
import base64, importlib.util, json, os, re, subprocess, sys, time, urllib.error, urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location('tempos', os.path.join(AQUI, 'tempos.py'))
tempos = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(tempos)

# Mesmo modelo e ajustes da narração aprovada (tools/narrar.py); a voz muda por personagem.
AJUSTES = {'model_id': 'eleven_v4_turbo', 'language_code': 'pt',
           'voice_settings': {'stability': 0.5, 'similarity_boost': 0.8, 'speed': 1.0}}
API = 'https://api.elevenlabs.io'
GAP = 0.35  # silêncio entre duas falas seguidas
# Cada voz da Voice Library sai com um volume; na mixagem toda fala vai para o mesmo volume médio (dB), e a fala
# "em alta voz" (personagem com sufixo _FORTE ou _ALTO) fica um pouco acima. O limitador segura os picos.
VOLUME, VOLUME_ALTO = -20.0, -17.5
VOGAIS = set('aeiouáéíóúâêôãõàAEIOUÁÉÍÓÚÂÊÔÃÕÀ')


def chave():
    if os.environ.get('ELEVENLABS_API_KEY'):
        return os.environ['ELEVENLABS_API_KEY']
    p = os.path.join(os.path.dirname(AQUI), '.env.local')
    if os.path.exists(p):
        for linha in open(p, encoding='utf-8'):
            k, _, v = linha.strip().partition('=')
            if k.strip() == 'ELEVENLABS_API_KEY' and v.strip():
                return v.strip().strip('"\'')
    return 'sem-chave'  # na nuvem a rede troca pela chave de verdade


def pedir(caminho, corpo=None):
    req = urllib.request.Request(API + caminho, data=json.dumps(corpo).encode() if corpo else None,
                                 headers={'xi-api-key': chave(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def ler_roteiro(d):
    itens, gancho = [], ''
    for n, linha in enumerate(open(os.path.join(d, 'dialogo.txt'), encoding='utf-8'), 1):
        linha = linha.strip()
        if not linha or linha.startswith('#'):
            continue
        if m := re.fullmatch(r'\[pausa ([\d.]+)\]', linha):
            itens.append(('pausa', float(m[1])))
        elif m := re.fullmatch(r'\[gancho (.+)\]', linha):
            gancho = m[1].strip()
        elif m := re.fullmatch(r'([A-Z0-9_]+):\s*(.+)', linha):
            itens.append(('fala', m[1], m[2].strip()))
        else:
            sys.exit(f'✘ dialogo.txt, linha {n}: não entendi "{linha}" (use PERSONAGEM: texto ou [pausa N])')
    return itens, gancho


def volume_medio(mp3):
    """Volume médio do mp3 em dB (volumedetect do ffmpeg)."""
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', mp3, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True)
    return float(re.search(r'mean_volume: (-?[\d.]+) dB', r.stderr)[1])


def duracao(mp3):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3],
                                capture_output=True, text=True, check=True).stdout)


def main():
    if len(sys.argv) < 2:
        sys.exit('uso: python3 tools/dialogo.py episodios/<ep> [--custo] [--refazer N,M]')
    d = sys.argv[1].rstrip('/\\')
    so_custo = '--custo' in sys.argv
    estimar = '--estimar' in sys.argv
    refazer = set()
    if '--refazer' in sys.argv:
        refazer = {int(x) for x in sys.argv[sys.argv.index('--refazer') + 1].split(',')}
    itens, gancho = ler_roteiro(d)
    vozes = json.load(open(os.path.join(d, 'vozes.json'), encoding='utf-8'))
    falas = [x for x in itens if x[0] == 'fala']
    sem_voz = sorted({p for _, p, _ in falas} - set(vozes))
    if sem_voz:
        sys.exit(f'✘ vozes.json sem voz para: {", ".join(sem_voz)}')

    pasta = os.path.join(d, 'falas')
    os.makedirs(pasta, exist_ok=True)
    fazer = []
    for k, (_, p, txt) in enumerate(falas, 1):
        jp = os.path.join(pasta, f'{k:02d}.tempos.json')
        ok = os.path.exists(jp) and os.path.exists(jp[:-12] + '.mp3')
        if ok:
            j = json.load(open(jp, encoding='utf-8'))
            ok = j['texto'] == txt and j['voz'] == vozes[p]['voz']
        if not ok or k in refazer:
            fazer.append((k, p, txt))
    total = sum(len(t) for _, _, t in fazer)
    print(f'{len(falas)} falas; a gerar: {len(fazer)} ({total} caracteres; no v4 Turbo, ~{total // 2} créditos)', flush=True)
    for k, p, t in fazer:
        print(f'  {k:02d} {p}: {t}')
    if so_custo:
        return
    if estimar:
        fazer = []
    if fazer:
        st, corpo = pedir('/v1/user/subscription')
        if st == 200:
            s = json.loads(corpo)
            resta = s['character_limit'] - s['character_count']
            if total > resta:
                sys.exit(f'✘ precisa de {total} caracteres e restam {resta} no plano {s["tier"]}')
    for k, p, txt in fazer:
        aj = json.loads(json.dumps(AJUSTES))
        aj['voice_settings'].update(vozes[p].get('ajustes', {}))
        for tentativa in range(4):  # 429 e 5xx são passageiros
            st, corpo = pedir(f'/v1/text-to-speech/{vozes[p]["voz"]}/with-timestamps?output_format=mp3_44100_128',
                              {'text': txt, **aj})
            if st == 200 or (st != 429 and st < 500):
                break
            time.sleep(5 * 2 ** tentativa)
        if st != 200:
            sys.exit(f'✘ ElevenLabs {st} na fala {k:02d} ({p}): {corpo.decode(errors="replace")[:400]}')
        j = json.loads(corpo)
        open(os.path.join(pasta, f'{k:02d}.mp3'), 'wb').write(base64.b64decode(j['audio_base64']))
        json.dump({'texto': txt, 'voz': vozes[p]['voz'], 'personagem': p, 'alinhamento': j['alignment']},
                  open(os.path.join(pasta, f'{k:02d}.tempos.json'), 'w', encoding='utf-8'), ensure_ascii=False)
        print(f'  ✔ {k:02d} {p}', flush=True)

    # Linha do tempo: cada fala no seu lugar, com as pausas do roteiro entre elas.
    t, k, inicios, tw, info, fim_audio = 0.0, 0, [], [], [], 0.0
    for it in itens:
        if it[0] == 'pausa':
            t += it[1]
            continue
        k += 1
        mp3 = os.path.join(pasta, f'{k:02d}.mp3')
        if estimar:  # ~14 letras por segundo, a fala começa 0,1 s depois do início do mp3
            txt = it[2]
            al = {'characters': list(txt), 'character_start_times_seconds': [0.1 + i / 14 for i in range(len(txt))],
                  'character_end_times_seconds': [0.1 + (i + 1) / 14 for i in range(len(txt))]}
        else:
            al = json.load(open(mp3[:-4] + '.tempos.json', encoding='utf-8'))['alinhamento']
        cs, a0s, b0s = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
        # palavras faladas (mesma regra do tempos.py: o fim é o da última letra, sem a pontuação)
        cur = None
        for c, a, b in zip(cs, a0s, b0s):
            if c.isspace():
                if cur:
                    tw.append(cur)
                cur = None
            elif cur is None:
                cur = [c, a + t, b + t]
            else:
                cur[0] += c
                if c.isalnum():
                    cur[2] = b + t
        if cur:
            tw.append(cur)
        # boca aberta nas vogais; trechos colados viram um só
        boca = []
        for c, a, b in zip(cs, a0s, b0s):
            if c in VOGAIS:
                a, b = a + t, b + t
                if boca and a - boca[-1][1] < 0.07:
                    boca[-1][1] = b
                else:
                    boca.append([a, b])
        info.append({'p': it[1], 'boca': [[round(a, 2), round(b, 2)] for a, b in boca]})
        inicios.append(t)
        fim_audio = t + (len(it[2]) / 14 + 0.3 if estimar else duracao(mp3))
        t = fim_audio + GAP
    tw = [(tempos.norm(w), a, b) for w, a, b in tw if tempos.norm(w)]
    linhas = [tempos.quebrar(txt).replace("'", "\\'") for _, _, txt in falas]
    segs = tempos.preencher(linhas, tw)
    for x, s in zip(info, segs):
        x['a'], x['b'] = s[0], s[1]

    # Áudio: as falas no tempo certo, por cima de silêncio
    n = len(falas)
    if not estimar:
        entradas = sum([['-i', os.path.join(pasta, f'{i:02d}.mp3')] for i in range(1, n + 1)], [])
        ganho = [(VOLUME_ALTO if re.search(r'_(FORTE|ALTO)$', p) else VOLUME) - volume_medio(os.path.join(pasta, f'{i:02d}.mp3'))
                 for i, (_, p, _) in enumerate(falas, 1)]
        filtro = ''.join(f'[{i}:a]aresample=44100,aformat=channel_layouts=mono,volume={ganho[i]:.1f}dB,adelay={round(inicios[i] * 1000)}:all=1[a{i}];'
                         for i in range(n))
        filtro += ''.join(f'[a{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0:duration=longest,alimiter=limit=0.89:level=disabled[o]'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', *entradas, '-filter_complex', filtro, '-map', '[o]', '-t', f'{t:.2f}',
                        '-c:a', 'libmp3lame', '-b:a', '128k', os.path.join(d, 'narration.mp3')], check=True)

    js = ['// TEMPOS ESTIMADOS, sem voz (tools/dialogo.py --estimar): só para montar as cenas.'] if estimar else []
    js += ['// Diálogo do desenho: as falas de cada personagem (falas/NN.mp3), juntadas por tools/dialogo.py. Não edite à mão:',
          '// mude o dialogo.txt ou o vozes.json e rode o tools/dialogo.py de novo.',
          'const SEGS = [', *[tempos.linha_js(x) for x in segs], '];',
          '// Quem fala em cada frase do SEGS e os trechos em que a boca está aberta (vogais), em segundos.',
          'const FALAS = [', *[f'  {json.dumps(x, ensure_ascii=False)},' for x in info], '];',
          f'const AUDIO_END = {fim_audio:.2f};', f'const DURATION = {t:.2f};',
          '// Diálogo não acelera: a voz de cada personagem fica no tempo em que foi gravada.', 'const SPEED = 1;']
    if gancho:
        js.append(f"const GANCHO = '{gancho}';")
    open(os.path.join(d, 'data.js'), 'w', encoding='utf-8').write('\n'.join(js) + '\n')
    print(f'✔ {d}/' + ('data.js estimado' if estimar else 'narration.mp3 e data.js') + f': {n} falas, fala até {fim_audio:.2f} s, vídeo de {t:.2f} s')


if __name__ == '__main__':
    main()
