# Baixa o Whisper small (sherpa-onnx) para tools/modelos, uma vez só: python3 tools/baixar_modelo.py
# Usado por transcrever.py e alinhar.py. Não depende de curl nem tar, então roda igual no Windows.
import os, sys, tarfile, urllib.request

URL = 'https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2'
NOME = 'sherpa-onnx-whisper-small'
dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'modelos', NOME)
if os.path.exists(os.path.join(dest, 'small-encoder.int8.onnx')):
    sys.exit('já baixado em ' + dest)
os.makedirs(dest, exist_ok=True)
print('baixando o modelo (algumas centenas de MB, só uma vez)...', flush=True)
with urllib.request.urlopen(URL) as r, tarfile.open(fileobj=r, mode='r|bz2') as tar:
    for m in tar:
        nome = os.path.basename(m.name)
        if m.isfile() and ('int8' in nome or 'tokens' in nome):
            with open(os.path.join(dest, nome), 'wb') as f:
                f.write(tar.extractfile(m).read())
            print(' ', nome, flush=True)
print('pronto:', dest)
