# Junta os PNGs de prev/ numa folha só (colunas = $1, padrão 3)
# Lista os arquivos num concat em vez de -pattern_type glob, que o ffmpeg do Windows não tem.
cd "$(dirname "$0")/prev" && n=$(ls t_*.png | wc -l) && cols=${1:-3} && rows=$(( (n + cols - 1) / cols )) && \
ls t_*.png | sed "s/.*/file '&'/" > lista.txt && \
ffmpeg -v error -y -f concat -safe 0 -i lista.txt -vf "scale=360:-1,tile=${cols}x${rows}:padding=6:color=white" -frames:v 1 ../sheet.png && \
rm lista.txt
