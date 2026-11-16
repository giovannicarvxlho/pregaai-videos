# Sobe a pasta de um pacote (out/pacote/<AAAA-MM-DD>-<ep>/) para o Google Drive do Giovanni:
#   DRIVE_ENTREGA_CHAVE=<chave> python3 tools/drive_entrega.py out/pacote/<AAAA-MM-DD>-<ep>
# O pacote.py chama sozinho no fim, quando acha DRIVE_ENTREGA_CHAVE no ambiente ou no .env.local.
#
# Destino: "Entregas do Mark"/<DD/MM/AA>/<AAAA-MM-DD>-<ep>/<rede>/<arquivo>, o mesmo desenho da VÍDEOS PREGAAI.
# "Entregas do Mark" é a pasta do app no Drive dele: com a permissão drive.file, o app só enxerga o que ele mesmo
# cria, e a pasta pode ficar dentro da VÍDEOS PREGAAI. Arquivo de mesmo nome é substituído, então dá para rodar
# de novo depois de refazer um vídeo.
#
# O vídeo vai direto para o Google: a Edge Function drive-entrega, no Supabase do PregaAI (repo pregaai), só abre
# cada envio. A chave é a drive_entrega_chave do Vault desse Supabase; na nuvem, o agente lê a chave pelo conector
# do Supabase na hora e passa só para o comando. Nunca grave a chave em arquivo versionado.
import json, mimetypes, os, sys, urllib.error, urllib.request

FUNCAO = 'https://gywcwlurgoccfrnkvnpz.supabase.co/functions/v1/drive-entrega'


def pasta_do_dia(nome):
    """'2026-11-16-tentacoes-de-jesus' → '16/11/26', o nome das pastas por dia na VÍDEOS PREGAAI."""
    ano, mes, dia = nome[:10].split('-')
    return f'{dia}/{mes}/{ano[2:]}'


def chamar(chave, corpo):
    req = urllib.request.Request(FUNCAO, data=json.dumps(corpo).encode(), method='POST', headers={
        'Authorization': f'Bearer {chave}', 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise RuntimeError(f'drive-entrega respondeu {e.code}: {e.read().decode(errors="replace")[:300]}') from None


def subir(dest, chave, mostrar=print):
    """Sobe os arquivos de `dest` com as subpastas. Devolve (caminho no Drive, id da pasta do pacote)."""
    nome = os.path.basename(os.path.normpath(dest))
    base = [pasta_do_dia(nome), nome]
    pastas = {tuple(base): chamar(chave, {'acao': 'pasta', 'caminho': base})['id']}
    for pasta, _, arquivos in sorted(os.walk(dest)):
        rel = os.path.relpath(pasta, dest)
        caminho = tuple(base + ([] if rel == '.' else rel.split(os.sep)))
        for a in sorted(arquivos):
            if caminho not in pastas:
                pastas[caminho] = chamar(chave, {'acao': 'pasta', 'caminho': list(caminho)})['id']
            arq = os.path.join(pasta, a)
            tipo = mimetypes.guess_type(a)[0] or 'application/octet-stream'
            tamanho = os.path.getsize(arq)
            url = chamar(chave, {'acao': 'envio', 'pasta': pastas[caminho], 'nome': a, 'tipo': tipo,
                                 'tamanho': tamanho})['url']
            with open(arq, 'rb') as f:  # os bytes vão direto ao Google, no endereço que a função abriu
                req = urllib.request.Request(url, data=f, method='PUT', headers={
                    'Content-Type': tipo, 'Content-Length': str(tamanho)})
                with urllib.request.urlopen(req, timeout=900) as r:
                    r.read()
            mostrar(f'  drive: {"/".join(list(caminho[2:]) + [a])} ({tamanho / 1e6:.1f} MB)')
    return 'Entregas do Mark/' + '/'.join(base), pastas[tuple(base)]


if __name__ == '__main__':
    if len(sys.argv) != 2 or not os.path.isdir(sys.argv[1]):
        sys.exit('uso: DRIVE_ENTREGA_CHAVE=<chave> python3 tools/drive_entrega.py out/pacote/<AAAA-MM-DD>-<ep>')
    chave = os.environ.get('DRIVE_ENTREGA_CHAVE', '').strip()
    if not chave:
        sys.exit('✘ falta DRIVE_ENTREGA_CHAVE (a drive_entrega_chave do Vault do Supabase do PregaAI)')
    caminho, pasta_id = subir(sys.argv[1], chave)
    print(f'drive: {caminho} (pasta {pasta_id})')
