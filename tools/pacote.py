# Monta a pasta de entrega de um episódio, uma subpasta por rede social, pronta para subir no Drive:
#   python3 tools/pacote.py <ep>
# Cada pasta (youtube/, tiktok/, instagram/) leva os vídeos e as capas daquela rede e um texto .txt só dela
# (publicacao-<rede>.txt), para copiar e colar nos apps (pedido do Giovanni em 11/11/2026, no lugar do .docx).
# Gera também um .zip para subir tudo de uma vez. Não renderiza nada: rode antes o build.sh e o capa.cjs.
#
# O zip abre numa pasta só: dentro dele ficam direto youtube/, tiktok/ e instagram/, sem repetir o nome do
# pacote (o "Extrair tudo" do Windows já cria a pasta com o nome do zip; pedido do Giovanni em 11/11/2026).
#
# Drive no computador: com PACOTE_DRIVE=<pasta> no ambiente ou no .env.local da raiz (fora do git), o pacote
# também é copiado para <pasta>/<AAAA-MM-DD>-<ep>/. Use uma pasta sincronizada pelo Google Drive para computador
# (ex.: PACOTE_DRIVE=G:\Meu Drive\PregaAI\Pacotes), e o Drive sobe sozinho.
#
# O que ele procura (os nomes que o build.sh e o capa.cjs geram):
#   out/<ep>.mp4                    o longo. Se o episódio for um curto, é o curto 01.
#   out/<ep>-tiktok.mp4             a versão do longo para o TikTok (episódio <ep>-tiktok); sem ela, vai a do YouTube
#   out/<ep>-miniatura-*.jpg        miniaturas do YouTube (Testar e comparar)  <- episodios/<ep>/miniatura-*.html
#   out/<ep>-capa-tiktok.jpg        capa do longo no TikTok, 1080×1920         <- episodios/<ep>/capa-tiktok.html
#   out/<ep>-curto-<n>.mp4          curtos recortados do longo
#   out/<ep>-curto-<n>-ig.mp4       o curto composto na vertical (layout "foco" do corte.cjs, desde 12/11/2026; antes, "cheia"), o que vai para as três redes
#   out/<ep>-curto-<n>-capa.jpg     capa de cada curto, 1080×1920              <- episodios/<ep>/curto-<n>-capa.html
#   out/<ep>-capa.jpg               capa, quando o episódio é um curto          <- episodios/<ep>/capa.html
#   episodios/<ep>/legenda.srt      legenda do longo no YouTube, se houver
#   episodios/<ep>/publicacao.md    o texto de tudo, com uma seção por rede (modelo em modelos/publicacao.md)
#
# O longo vai para o YouTube e o TikTok; os curtos para o YouTube (Shorts), o TikTok e o Instagram, o mesmo arquivo
# composto na vertical, sem faixas (layout "foco", decisão do Giovanni em 12/11/2026; de 11/11 a 12/11, a "cheia").
# Sem a versão vertical (-ig), vai o recorte com faixas, com aviso.
# nas três pastas. O Shorts não recebe capa: ela não sobe por arquivo, e o documento diz qual quadro escolher.
# Saída: out/pacote/<AAAA-MM-DD>-<ep>/ e out/pacote/<AAAA-MM-DD>-<ep>.zip (e a cópia no Drive, se configurada)
import datetime, glob, json, os, re, shutil, subprocess, sys, zipfile

REDES = {'youtube': 'YouTube', 'tiktok': 'TikTok', 'instagram': 'Instagram'}


def config(nome):
    """Valor do ambiente ou do .env.local da raiz (o mesmo arquivo da chave da ElevenLabs)."""
    if os.environ.get(nome):
        return os.environ[nome].strip()
    p = os.path.join(raiz, '.env.local')
    if os.path.exists(p):
        for linha in open(p, encoding='utf-8'):
            k, _, v = linha.strip().partition('=')
            if k.strip() == nome and v.strip():
                return v.strip().strip('"\'')
    return ''


def inline(t):
    """Tira a marcação de uma linha: negrito, código e links; o texto fica igual."""
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'\1 (\2)', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'\1', t)
    return t.replace('`', '')


def para_txt(md):
    """Markdown do publicacao.md -> texto puro para copiar e colar. O que está entre ``` sai como está."""
    saida, bloco = [], False
    for linha in md.splitlines():
        if linha.strip().startswith('```'):
            bloco = not bloco
            saida.append('')
            continue
        if bloco:
            saida.append(linha)
            continue
        m = re.match(r'^(#{1,6})\s+(.*)$', linha)
        if m:
            nivel, titulo = len(m.group(1)), inline(m.group(2)).strip()
            if nivel <= 2:
                saida += ['', titulo.upper(), '=' * len(titulo), '']
            elif nivel == 3:
                saida += ['', titulo, '-' * len(titulo), '']
            else:
                saida += ['', '> ' + titulo, '']
            continue
        if re.match(r'^\s*\|?\s*:?-{3,}', linha):  # linha separadora da tabela
            continue
        if linha.strip().startswith('|'):
            celulas = [inline(c).strip() for c in linha.strip().strip('|').split('|')]
            saida.append('  ·  '.join(c for c in celulas if c))
            continue
        linha = re.sub(r'^>\s?', '', linha)
        saida.append(inline(linha).rstrip())
    texto = '\n'.join(saida)
    texto = re.sub(r'\n{3,}', '\n\n', texto).strip() + '\n'
    return texto


if len(sys.argv) < 2:
    sys.exit('uso: python3 tools/pacote.py <ep>')
ep = re.split(r'[\\/]', sys.argv[1].strip('/\\'))[-1]
raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out, epd = os.path.join(raiz, 'out'), os.path.join(raiz, 'episodios', ep)
if not os.path.isdir(epd):
    sys.exit(f'✘ não existe episodios/{ep}')
pub = os.path.join(epd, 'publicacao.md')
if not os.path.exists(pub):
    sys.exit(f'✘ falta episodios/{ep}/publicacao.md (copie de modelos/publicacao.md e preencha)')

try:
    from zoneinfo import ZoneInfo
    hoje = datetime.datetime.now(ZoneInfo('America/Sao_Paulo')).date()
except Exception:  # Windows sem tzdata: usa a data do computador
    hoje = datetime.date.today()
nome = f'{hoje:%Y-%m-%d}-{ep}'
dest = os.path.join(out, 'pacote', nome)
shutil.rmtree(dest, ignore_errors=True)
os.makedirs(dest)

# ---------------------------------------------------------------- vídeos e capas
dados = os.path.join(epd, 'data.js')
longo = os.path.exists(dados) and "FORMAT = 'wide'" in open(dados, encoding='utf-8').read()
# Episódio montado por corte (tools/corte.cjs) a partir de um longo: tem corte.json com uma saída horizontal.
corte = os.path.join(epd, 'corte.json')
if not longo and os.path.exists(corte):
    longo = any(not x.get('layout') for x in json.load(open(corte, encoding='utf-8'))['saidas'])
o = lambda f: os.path.join(out, f)
copias = []  # (origem, destino relativo)
def pega(origem, *rels):
    if os.path.exists(origem):
        copias.extend((origem, r) for r in rels)

curtos = []  # (vídeo, capa)
sem_cheia = []  # curtos recortados de um longo que não têm a versão em tela cheia
if longo:
    pega(o(f'{ep}.mp4'), 'youtube/longo.mp4')
    pega(o(f'{ep}-tiktok.mp4') if os.path.exists(o(f'{ep}-tiktok.mp4')) else o(f'{ep}.mp4'), 'tiktok/longo.mp4')
    pega(o(f'{ep}-capa-tiktok.jpg'), 'tiktok/longo-capa.jpg')
    pega(os.path.join(epd, 'legenda.srt'), 'youtube/legenda.srt')
    for m in sorted(glob.glob(o(f'{ep}-miniatura*.jpg'))):
        pega(m, 'youtube/' + os.path.basename(m)[len(ep) + 1:])
    # cada curto pelo número, venha do recorte com faixas (<ep>-curto-<n>.mp4) ou só da tela cheia (-ig)
    nums = sorted({int(m.group(1)) for c in glob.glob(o(f'{ep}-curto-*.mp4'))
                   if (m := re.search(r'-curto-(\d+)(?:-ig)?\.mp4$', c))})
    for k in nums:
        curtos.append((o(f'{ep}-curto-{k}.mp4'), o(f'{ep}-curto-{k}-capa.jpg')))
else:
    curtos.append((o(f'{ep}.mp4'), o(f'{ep}-capa.jpg')))
for n, (video, capa) in enumerate(curtos, 1):
    cheia = video[:-4] + '-ig.mp4'  # tela cheia, sem as faixas escuras (o nome -ig ficou de quando era só do Instagram)
    if longo and not os.path.exists(cheia):
        sem_cheia.append(n)
    pega(cheia if os.path.exists(cheia) else video,
         f'youtube/curto-{n:02d}.mp4', f'tiktok/curto-{n:02d}.mp4', f'instagram/curto-{n:02d}.mp4')
    pega(capa, f'tiktok/curto-{n:02d}-capa.jpg', f'instagram/curto-{n:02d}-capa.jpg')

for origem, rel in copias:
    os.makedirs(os.path.dirname(os.path.join(dest, rel)), exist_ok=True)
    shutil.copy2(origem, os.path.join(dest, rel))
    print('  ', rel)

# ---------------------------------------------------------------- um texto por rede
texto = open(pub, encoding='utf-8').read()
texto_limpo = re.sub(r'<!--.*?-->', '', texto, flags=re.S)
cabecalho = re.split(r'^## ', texto_limpo, maxsplit=1, flags=re.M)[0]
secoes = {m.group(1).strip(): m.group(2) for m in re.finditer(r'^## ([^\n]+)\n(.*?)(?=^## |\Z)', texto_limpo, flags=re.M | re.S)}
avisos = []
for pasta, titulo in REDES.items():
    corpo = next((v for k, v in secoes.items() if k.lower().startswith(titulo.lower())), None)
    if corpo is None:
        avisos.append(f'o publicacao.md não tem a seção "## {titulo}"')
        continue
    os.makedirs(os.path.join(dest, pasta), exist_ok=True)
    txt = os.path.join(dest, pasta, f'publicacao-{pasta}.txt')
    # utf-8 com BOM: o visualizador do Drive e o Bloco de Notas acertam os acentos e os emojis
    with open(txt, 'w', encoding='utf-8-sig', newline='\n') as f:
        f.write(para_txt(cabecalho.rstrip() + f'\n\n## {titulo}\n' + corpo))
    print(f'   {pasta}/publicacao-{pasta}.txt')

# ---------------------------------------------------------------- conferência
if '<!--' in texto or re.search(r'<[^<>\n]{1,60}>', texto_limpo):
    avisos.append('o publicacao.md ainda tem comentários do modelo ou campos <...> por preencher')
citados = set(re.findall(r'`((?:youtube|tiktok|instagram)/[^`]+)`', texto))
no_pacote = {rel for _, rel in copias}
for f in sorted(citados - no_pacote):
    avisos.append(f'o documento cita {f}, que não está no pacote')
for f in sorted(r for r in no_pacote if r.endswith(('.mp4', '.jpg')) and r not in citados):
    avisos.append(f'{f} está no pacote, mas o documento não diz como usar')
for n, (video, capa) in enumerate(curtos, 1):
    if (os.path.exists(video) or os.path.exists(video[:-4] + '-ig.mp4')) and not os.path.exists(capa):
        avisos.append(f'curto {n:02d} sem capa (TikTok e Instagram): gere {os.path.relpath(capa, raiz)}')
if longo and not glob.glob(o(f'{ep}-miniatura*.jpg')):
    avisos.append('longo sem miniaturas do YouTube: gere as 3 do Testar e comparar')
if longo and not os.path.exists(o(f'{ep}-capa-tiktok.jpg')):
    avisos.append(f'longo sem capa do TikTok: gere out/{ep}-capa-tiktok.jpg (episodios/{ep}/capa-tiktok.html)')
for n in sem_cheia:
    avisos.append(f'curto {n:02d} sem a versão vertical (saída "<ep>-curto-{n}-ig", layout "foco", no corte.json):'
                  ' foi o recorte com faixas escuras para as três redes')

# Duração e tamanho de cada vídeo, pelas regras de cada rede (especificações no AGENTS.md).
def medir(arq):
    try:
        r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                            'stream=width,height:format=duration', '-of', 'json', arq],
                           capture_output=True, text=True, check=True)
        j = json.loads(r.stdout)
        st = j['streams'][0]
        return int(st['width']), int(st['height']), float(j['format']['duration'])
    except Exception:
        return None
mmss = lambda s: f'{int(s // 60)}:{int(round(s % 60)):02d}'
if shutil.which('ffprobe'):
    for origem, rel in copias:
        if not rel.endswith('.mp4'):
            continue
        m = medir(origem)
        if not m or m[2] < 1:  # arquivo que não é vídeo de verdade (teste) ou ilegível
            continue
        w, h, dur = m
        curto = '/curto-' in rel
        if (curto or rel.startswith('instagram/')) and (w, h) != (1080, 1920):
            avisos.append(f'{rel} está em {w}×{h}; curto e Reel saem em 1080×1920 (9:16)')
        if rel.startswith('instagram/') and dur > 180:
            avisos.append(f'{rel} tem {mmss(dur)}: Reel acima de 3 min não é recomendado a quem não segue a conta')
        if rel.startswith('youtube/curto-') and dur > 180:
            avisos.append(f'{rel} tem {mmss(dur)}: acima de 3 min o YouTube não trata como Short')
        if rel == 'youtube/longo.mp4' and dur > 300:
            avisos.append(f'{rel} tem {mmss(dur)}: o longo vai de 4 a 5 min, nunca mais de 5 (regra de 06/11/2026)')
else:
    print('(sem o ffprobe: duração e tamanho dos vídeos não foram conferidos)')
if not any(r.endswith('.mp4') for r in no_pacote):
    avisos.append('nenhum vídeo encontrado em out/: rode o build.sh antes')

arq_zip = dest + '.zip'
with zipfile.ZipFile(arq_zip, 'w') as z:
    for pasta, _, arquivos in os.walk(dest):
        for a in sorted(arquivos):
            caminho = os.path.join(pasta, a)
            modo = zipfile.ZIP_STORED if a.endswith(('.mp4', '.jpg', '.png')) else zipfile.ZIP_DEFLATED
            z.write(caminho, os.path.relpath(caminho, dest), compress_type=modo)

mb = os.path.getsize(arq_zip) / 1e6
print(f'\npasta: {dest}\nzip:   {arq_zip} ({mb:.0f} MB)')

drive = config('PACOTE_DRIVE')
if drive:
    if os.path.isdir(drive):
        destino = os.path.join(drive, nome)
        shutil.rmtree(destino, ignore_errors=True)
        shutil.copytree(dest, destino)
        print(f'drive: {destino}')
    else:
        avisos.append(f'PACOTE_DRIVE aponta para {drive}, que não existe: o pacote não foi copiado para o Drive')
for a in avisos:
    print('! ' + a)
sys.exit(1 if avisos else 0)
