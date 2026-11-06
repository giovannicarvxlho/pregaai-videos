# Gera a narração na ElevenLabs pela API, com a voz e os ajustes aprovados.
# Uso: python3 tools/narrar.py episodios/<ep>   (lê episodios/<ep>/narracao.txt)
#      python3 tools/narrar.py --checar          (só confere a chave, o plano e o saldo)
# narracao.txt: o texto aprovado do jeito que a voz deve ler, uma frase por linha. Uma linha "---"
# separa as partes. Com uma parte sai narration.mp3; com várias, partes/01.mp3, 02.mp3...
# (o build.sh junta, ou rode tools/juntar.py).
# Chave: ELEVENLABS_API_KEY no ambiente ou no .env.local da raiz (fora do git). Na nuvem do
# Claude Code a rede injeta a chave e não precisa de nada.
# Não sobrescreve mp3 que já existe, porque cada geração gasta crédito; --refazer gera de novo.
import json, os, sys, urllib.error, urllib.request

VOZ = 'bJrNspxJVFovUxNBQ0wh'  # Marcelo Costa - Articulate and Balanced (Voice Library)
# v4 Turbo: metade do crédito do v4 (0,5 por caractere); aprovado pelo Giovanni no teste de 06/11/2026.
AJUSTES = {'model_id': 'eleven_v4_turbo', 'language_code': 'pt',
           'voice_settings': {'stability': 0.5, 'similarity_boost': 0.8, 'speed': 1.0}}
API = 'https://api.elevenlabs.io'
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def chave():
    if os.environ.get('ELEVENLABS_API_KEY'):
        return os.environ['ELEVENLABS_API_KEY']
    p = os.path.join(RAIZ, '.env.local')
    if os.path.exists(p):
        for linha in open(p, encoding='utf-8'):
            k, _, v = linha.strip().partition('=')
            if k.strip() == 'ELEVENLABS_API_KEY' and v.strip():
                return v.strip().strip('"\'')
    return 'sem-chave'  # na nuvem a rede troca pela chave de verdade


def pedir(caminho, corpo=None):
    """Devolve (status, bytes)."""
    req = urllib.request.Request(API + caminho, data=json.dumps(corpo).encode() if corpo else None,
                                 headers={'xi-api-key': chave(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def falha(status, corpo):
    msg = corpo.decode(errors='replace')
    if status == 401:
        sys.exit('✘ ElevenLabs: chave ausente, inválida ou sem permissão de texto para fala.\n'
                 '  Crie uma chave em elevenlabs.io (Developers > API Keys) e salve no .env.local da raiz:\n'
                 '  ELEVENLABS_API_KEY=...\n' + msg)
    if status == 402:
        sys.exit('✘ ElevenLabs recusou: o plano Free não usa vozes da Voice Library pela API. Precisa de plano pago.\n' + msg)
    sys.exit(f'✘ ElevenLabs {status}: {msg}')


def saldo():
    """(plano, caracteres que restam) ou None se a chave não puder ler a assinatura."""
    st, corpo = pedir('/v1/user/subscription')
    if st != 200:
        return None if st == 401 and b'permission' in corpo else falha(st, corpo)
    d = json.loads(corpo)
    return d['tier'], d['character_limit'] - d['character_count']


if len(sys.argv) < 2:
    sys.exit(__doc__ or 'uso: python3 tools/narrar.py episodios/<ep> [--refazer] | --checar')

if sys.argv[1] == '--checar':
    s = saldo()
    if s is None:
        print('✔ chave da ElevenLabs (sem permissão para ler o plano; não dá para conferir o saldo)')
    elif s[0] == 'free':
        sys.exit(f'✘ ElevenLabs no plano Free ({s[1]} caracteres restantes): a API não usa a voz da narração. Precisa de plano pago.')
    else:
        print(f'✔ ElevenLabs, plano {s[0]}, {s[1]} caracteres restantes')
    sys.exit()

d = sys.argv[1].rstrip('/\\')
refazer = '--refazer' in sys.argv
txt = os.path.join(d, 'narracao.txt')
if not os.path.exists(txt):
    sys.exit(f'✘ falta {txt}: o texto aprovado, uma frase por linha, "---" entre as partes')
partes = [p.strip() for p in open(txt, encoding='utf-8').read().split('\n---\n') if p.strip()]
saidas = [os.path.join(d, 'narration.mp3')] if len(partes) == 1 else \
         [os.path.join(d, 'partes', f'{i:02d}.mp3') for i in range(1, len(partes) + 1)]
fazer = [(p, s) for p, s in zip(partes, saidas) if refazer or not os.path.exists(s)]
if not fazer:
    sys.exit('nada a gerar: os mp3 já existem (use --refazer para gerar de novo, gasta crédito)')

total = sum(len(p) for p, _ in fazer)
s = saldo()
if s and total > s[1]:
    sys.exit(f'✘ precisa de {total} caracteres e restam {s[1]} no plano {s[0]}')
print(f'gerando {len(fazer)} mp3, {total} caracteres' + (f' (restam {s[1]})' if s else ''), flush=True)

for texto, saida in fazer:
    st, audio = pedir(f'/v1/text-to-speech/{VOZ}?output_format=mp3_44100_128', {'text': texto, **AJUSTES})
    if st != 200:
        falha(st, audio)
    os.makedirs(os.path.dirname(saida), exist_ok=True)
    with open(saida, 'wb') as f:
        f.write(audio)
    print(' ', saida, flush=True)
