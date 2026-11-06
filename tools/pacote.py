# Monta a pasta de entrega de um episódio, pronta para subir no Drive: python3 tools/pacote.py <ep>
# Junta o que já foi renderizado em out/ e o episodios/<ep>/publicacao.md numa pasta só, por tipo,
# e gera um .zip para subir de uma vez. Não renderiza nada: rode antes o build.sh e o capa.cjs.
#
# Nomes que ele procura em out/ (os mesmos que o build.sh e o capa.cjs geram):
#   out/<ep>.mp4                 o longo (YouTube); se o episódio for um curto, vira curtos/curto-01.mp4
#   out/<ep>-tiktok.mp4          a versão do longo para o TikTok (episódio <ep>-tiktok), se existir
#   out/<ep>-miniatura-*.jpg     as miniaturas do longo (Testar e comparar)
#   out/<ep>-curto-<n>.mp4       os curtos recortados do longo, com out/<ep>-curto-<n>-capa.jpg
#   out/<ep>-capa.jpg            a capa, quando o episódio é um curto
# E em episodios/<ep>/: publicacao.md (obrigatório) e legenda.srt (se houver).
#
# Saída: out/pacote/<AAAA-MM-DD>-<ep>/ e out/pacote/<AAAA-MM-DD>-<ep>.zip
import datetime, glob, os, re, shutil, subprocess, sys, zipfile

if len(sys.argv) < 2:
    sys.exit('uso: python3 tools/pacote.py <ep>')
ep = sys.argv[1].strip('/\\').split('/')[-1].split('\\')[-1]
raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out, epd = os.path.join(raiz, 'out'), os.path.join(raiz, 'episodios', ep)
if not os.path.isdir(epd):
    sys.exit(f'✘ não existe episodios/{ep}')

try:
    from zoneinfo import ZoneInfo
    hoje = datetime.datetime.now(ZoneInfo('America/Sao_Paulo')).date()
except Exception:  # Windows sem tzdata: usa a data do computador
    hoje = datetime.date.today()

nome = f'{hoje:%Y-%m-%d}-{ep}'
dest = os.path.join(out, 'pacote', nome)
shutil.rmtree(dest, ignore_errors=True)
os.makedirs(dest)
longo = "FORMAT = 'wide'" in open(os.path.join(epd, 'data.js'), encoding='utf-8').read() if os.path.exists(os.path.join(epd, 'data.js')) else False

copias = []  # (origem, destino relativo)
def pega(origem, rel):
    if os.path.exists(origem):
        copias.append((origem, rel))

if longo:
    pega(os.path.join(out, f'{ep}.mp4'), 'longo/youtube.mp4')
    pega(os.path.join(out, f'{ep}-tiktok.mp4'), 'longo/tiktok.mp4')
    pega(os.path.join(epd, 'legenda.srt'), 'longo/legenda.srt')
    for m in sorted(glob.glob(os.path.join(out, f'{ep}-miniatura*.jpg'))):
        pega(m, 'longo/' + os.path.basename(m)[len(ep) + 1:])
    for c in sorted(glob.glob(os.path.join(out, f'{ep}-curto-*.mp4'))):
        n = int(re.search(r'-curto-(\d+)\.mp4$', c).group(1))
        pega(c, f'curtos/curto-{n:02d}.mp4')
        pega(c[:-4] + '-capa.jpg', f'curtos/curto-{n:02d}-capa.jpg')
else:
    pega(os.path.join(out, f'{ep}.mp4'), 'curtos/curto-01.mp4')
    pega(os.path.join(out, f'{ep}-capa.jpg'), 'curtos/curto-01-capa.jpg')

pub = os.path.join(epd, 'publicacao.md')
if not os.path.exists(pub):
    sys.exit(f'✘ falta episodios/{ep}/publicacao.md (copie de modelos/publicacao.md e preencha)')
pega(pub, 'publicacao.md')

for origem, rel in copias:
    os.makedirs(os.path.dirname(os.path.join(dest, rel)), exist_ok=True)
    shutil.copy2(origem, os.path.join(dest, rel))
    print('  ', rel)

# Documento também em .docx, que o Drive abre como Google Docs (só se o pandoc estiver instalado;
# sem ele, o .md também abre: "Abrir com > Documentos Google").
if shutil.which('pandoc'):
    subprocess.run(['pandoc', pub, '-o', os.path.join(dest, 'publicacao.docx')], check=True)
    print('   publicacao.docx')

# Conferência: o documento cita só arquivos que estão no pacote, e todo vídeo do pacote aparece no documento.
texto = open(pub, encoding='utf-8').read()
avisos = []
if '<!--' in texto or re.search(r'<[a-zà-ú][^>]*>', texto):
    avisos.append('o publicacao.md ainda tem comentários do modelo ou campos <...> por preencher')
citados = set(re.findall(r'`((?:longo|curtos)/[^`]+)`', texto))
no_pacote = {rel for _, rel in copias}
for f in sorted(citados - no_pacote):
    avisos.append(f'o documento cita {f}, que não está no pacote')
for f in sorted(r for r in no_pacote if r.endswith('.mp4') and r not in citados):
    avisos.append(f'{f} está no pacote, mas o documento não diz onde publicar')
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
