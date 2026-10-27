# Render completo de um episódio: bash build.sh <episódio>
# 3 workers em paralelo, junta, põe a narração (-14 LUFS) e o silêncio do cartão final.
set -e
cd "$(dirname "$0")"
EP=${1:?uso: bash build.sh <episódio>}
D=episodios/$EP
N=${N:-3}
mkdir -p out && rm -f out/seg_*.mp4
for k in $(seq 0 $((N - 1))); do node render.cjs "$EP" $k $N out/seg_$k.mp4 & done
wait
for k in $(seq 0 $((N - 1))); do echo "file 'seg_$k.mp4'"; done > out/list.txt
DUR=$(node -e "const fs=require('fs');eval(fs.readFileSync('$D/data.js','utf8').replace(/const /g,'var '));console.log(DURATION)")
ffmpeg -v error -y -f concat -safe 0 -i out/list.txt -i "$D/narration.mp3" \
  -filter_complex "[1:a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,apad=whole_dur=${DUR}[a]" \
  -map 0:v -map "[a]" -t "$DUR" -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -level 4.2 -r 30 \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart "out/$EP.mp4"
rm -f out/seg_*.mp4 out/list.txt
ls -la "out/$EP.mp4"
