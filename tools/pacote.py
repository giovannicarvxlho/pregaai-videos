# Monta a pasta de entrega de um episódio, uma subpasta por rede social, pronta para subir no Drive:
#   python3 tools/pacote.py <ep>
# Cada pasta (youtube/, tiktok/, instagram/) leva os vídeos e as capas daquela rede e um documento .docx só dela,
# que o Drive abre como Google Docs. Gera também um .zip para subir tudo de uma vez.
# Não renderiza nada: rode antes o build.sh e o capa.cjs. Precisa do pandoc (o npm run checar confere).
#
# O que ele procura (os nomes que o build.sh e o capa.cjs geram):
#   out/<ep>.mp4                    o longo. Se o episódio for um curto, é o curto 01.
#   out/<ep>-tiktok.mp4             a versão do longo para o TikTok (episódio <ep>-tiktok); sem ela, vai a do YouTube
#   out/<ep>-miniatura-*.jpg        miniaturas do YouTube (Testar e comparar)  <- episodios/<ep>/miniatura-*.html
#   out/<ep>-capa-tiktok.jpg        capa do longo no TikTok, 1080×1920         <- episodios/<ep>/capa-tiktok.html
#   out/<ep>-curto-<n>.mp4          curtos recortados do longo
#   out/<ep>-curto-<n>-capa.jpg     capa de cada curto, 1080×1920              <- episodios/<ep>/curto-<n>-capa.html
#   out/<ep>-capa.jpg               capa, quando o episódio é um curto          <- episodios/<ep>/capa.html
#   episodios/<ep>/legenda.srt      legenda do longo no YouTube, se houver
#   episodios/<ep>/publicacao.md    o texto de tudo, com uma seção por rede (modelo em modelos/publicacao.md)
#
# O longo vai para o YouTube e o TikTok; os curtos para o YouTube (Shorts), o TikTok e o Instagram, o mesmo arquivo
# nas três pastas. O Shorts não recebe capa: ela não sobe por arquivo, e o documento diz qual quadro escolher.
# Saída: out/pacote/<AAAA-MM-DD>-<ep>/ e out/pacote/<AAAA-MM-DD>-<ep>.zip
import datetime, glob, os, re, shutil, subprocess, sys, tempfile, zipfile

REDES = {'youtube': 'YouTube', 'tiktok': 'TikTok', 'instagram': 'Instagram'}

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
if not shutil.which('pandoc'):
    sys.exit('✘ falta o pandoc, que gera os .docx. Windows: winget install -e --id JohnMacFarlane.Pandoc'
             ' · Mac: brew install pandoc · Linux: sudo apt install pandoc')

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
    import json
    longo = any(not x.get('layout') for x in json.load(open(corte, encoding='utf-8'))['saidas'])
o = lambda f: os.path.join(out, f)
copias = []  # (origem, destino relativo)
def pega(origem, *rels):
    if os.path.exists(origem):
        copias.extend((origem, r) for r in rels)

curtos = []  # (vídeo, capa)
if longo:
    pega(o(f'{ep}.mp4'), 'youtube/longo.mp4')
    pega(o(f'{ep}-tiktok.mp4') if os.path.exists(o(f'{ep}-tiktok.mp4')) else o(f'{ep}.mp4'), 'tiktok/longo.mp4')
    pega(o(f'{ep}-capa-tiktok.jpg'), 'tiktok/longo-capa.jpg')
    pega(os.path.join(epd, 'legenda.srt'), 'youtube/legenda.srt')
    for m in sorted(glob.glob(o(f'{ep}-miniatura*.jpg'))):
        pega(m, 'youtube/' + os.path.basename(m)[len(ep) + 1:])
    for c in sorted(glob.glob(o(f'{ep}-curto-*.mp4')), key=lambda c: int(re.search(r'-curto-(\d+)\.mp4$', c).group(1))):
        curtos.append((c, c[:-4] + '-capa.jpg'))
else:
    curtos.append((o(f'{ep}.mp4'), o(f'{ep}-capa.jpg')))
for n, (video, capa) in enumerate(curtos, 1):
    pega(video, *(f'{rede}/curto-{n:02d}.mp4' for rede in REDES))
    pega(capa, f'tiktok/curto-{n:02d}-capa.jpg', f'instagram/curto-{n:02d}-capa.jpg')

for origem, rel in copias:
    os.makedirs(os.path.dirname(os.path.join(dest, rel)), exist_ok=True)
    shutil.copy2(origem, os.path.join(dest, rel))
    print('  ', rel)

# ---------------------------------------------------------------- um documento por rede
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
    with tempfile.NamedTemporaryFile('w', suffix='.md', delete=False, encoding='utf-8') as tmp:
        tmp.write(cabecalho.rstrip() + f'\n\n## {titulo}\n' + corpo)
    docx = os.path.join(dest, pasta, f'publicacao-{pasta}.docx')
    subprocess.run(['pandoc', tmp.name, '-f', 'markdown', '-o', docx], check=True)
    os.unlink(tmp.name)
    print(f'   {pasta}/publicacao-{pasta}.docx')

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
    if os.path.exists(video) and not os.path.exists(capa):
        avisos.append(f'curto {n:02d} sem capa (TikTok e Instagram): gere {os.path.relpath(capa, raiz)}')
if longo and not glob.glob(o(f'{ep}-miniatura*.jpg')):
    avisos.append('longo sem miniaturas do YouTube: gere as 3 do Testar e comparar')
if longo and not os.path.exists(o(f'{ep}-capa-tiktok.jpg')):
    avisos.append(f'longo sem capa do TikTok: gere out/{ep}-capa-tiktok.jpg (episodios/{ep}/capa-tiktok.html)')
if not any(r.endswith('.mp4') for r in no_pacote):
    avisos.append('nenhum vídeo encontrado em out/: rode o build.sh antes')

arq_zip = dest + '.zip'
with zipfile.ZipFile(arq_zip, 'w') as z:
    for pasta, _, arquivos in os.walk(dest):
        for a in sorted(arquivos):
            caminho = os.path.join(pasta, a)
            modo = zipfile.ZIP_STORED if a.endswith(('.mp4', '.jpg', '.png')) else zipfile.ZIP_DEFLATED
            z.write(caminho, os.path.join(nome, os.path.relpath(caminho, dest)), compress_type=modo)

mb = os.path.getsize(arq_zip) / 1e6
print(f'\npasta: {dest}\nzip:   {arq_zip} ({mb:.0f} MB)')
for a in avisos:
    print('! ' + a)
sys.exit(1 if avisos else 0)
