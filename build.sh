# Render completo de um episódio: bash build.sh <episódio>
# 3 workers em paralelo, junta, põe a narração (-14 LUFS) e o silêncio do cartão final,
# e acelera tudo por SPEED (data.js do episódio; 1 se não existir). T0/T1 geram só um trecho.
set -e
cd "$(dirname "$0")"
EP=${1:?uso: bash build.sh <episódio>}
D=episodios/$EP
N=${N:-3}
mkdir -p out && rm -f out/seg_*.mp4
# Espera cada processo pelo PID e para se algum falhar (antes, um "wait" sem PID seguia com um pedaço faltando).
PIDS=()
for k in $(seq 0 $((N - 1))); do node render.cjs "$EP" $k $N out/seg_$k.mp4 & PIDS+=($!); done
for p in "${PIDS[@]}"; do wait "$p" || { echo "✘ um processo de render falhou (veja o erro acima)" >&2; exit 1; }; done
for k in $(seq 0 $((N - 1))); do echo "file 'seg_$k.mp4'"; done > out/list.txt
read DUR SPEED < <(node -e "const fs=require('fs');eval(fs.readFileSync('$D/data.js','utf8').replace(/const /g,'var '));console.log(DURATION, typeof SPEED==='undefined'?1:SPEED)")
# T0/T1 (segundos) geram só um trecho: out/<ep>-<T0>.mp4
if [ -n "$T1" ]; then OUT="out/$EP-${T0:-0}.mp4"; DUR=$(node -e "console.log($T1-${T0:-0})"); SS=${T0:-0}; else OUT="out/$EP.mp4"; SS=0; fi
AUD="$D/narration.mp3"
# Vídeo longo: a narração vem em partes (partes/01.mp3...) e é juntada aqui.
PY=python3; $PY --version >/dev/null 2>&1 || PY=python  # no Windows o Python costuma ser "python"
if [ ! -f "$AUD" ] && [ -d "$D/partes" ]; then $PY tools/juntar.py "$D"; fi
# Sem narração ainda: monta com silêncio, para ver as cenas.
if [ ! -f "$AUD" ]; then SS=0; AUD=out/silencio.wav; ffmpeg -v error -y -f lavfi -i anullsrc=r=48000:cl=mono -t "$DUR" "$AUD"; fi
ffmpeg -v error -y -f concat -safe 0 -i out/list.txt -ss "$SS" -i "$AUD" \
  -filter_complex "[0:v]setpts=PTS/${SPEED}[v];[1:a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,apad=whole_dur=${DUR},atempo=${SPEED}[a]" \
  -map "[v]" -map "[a]" -t "$(node -e "console.log($DUR/$SPEED)")" -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -level 4.2 -r 30 \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"
rm -f out/seg_*.mp4 out/list.txt
ls -la "$OUT"
