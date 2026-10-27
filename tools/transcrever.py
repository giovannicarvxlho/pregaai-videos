# Transcreve cada trecho com Whisper (sherpa-onnx) para conferir a legenda contra o áudio.
# Uso: python3 tools/transcrever.py <narration.mp3> "<saída do segmentos.py>"
# Modelo (uma vez):
#   pip install sherpa-onnx
#   mkdir -p tools/modelos && curl -sSL https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2 \
#     | tar xjf - -C tools/modelos --wildcards '*int8*' '*tokens*'
import array, os, subprocess, sys
import sherpa_onnx

mdir = os.path.join(os.path.dirname(__file__), 'modelos', 'sherpa-onnx-whisper-small')
rec = sherpa_onnx.OfflineRecognizer.from_whisper(
    encoder=f'{mdir}/small-encoder.int8.onnx', decoder=f'{mdir}/small-decoder.int8.onnx',
    tokens=f'{mdir}/small-tokens.txt', language='pt', task='transcribe', num_threads=4)
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-ac', '1', '-ar', '16000', '-f', 's16le', '-'],
                     capture_output=True, check=True).stdout
a = array.array('h'); a.frombytes(pcm)
for i, seg in enumerate(sys.argv[2].split(), 1):
    s, e = map(float, seg.split('-'))
    st = rec.create_stream()
    st.accept_waveform(16000, [x / 32768 for x in a[int(max(0, s - 0.1) * 16000):int((e + 0.1) * 16000)]])
    rec.decode_stream(st)
    print(f'{i:2d} {s:6.2f}-{e:6.2f} {st.result.text.strip()}', flush=True)
