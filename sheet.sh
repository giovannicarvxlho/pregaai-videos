# Junta os PNGs de prev/ numa folha só (colunas = $1, padrão 3)
cd "$(dirname "$0")/prev" && n=$(ls t_*.png | wc -l) && cols=${1:-3} && rows=$(( (n + cols - 1) / cols )) && \
ffmpeg -v error -y -pattern_type glob -i 't_*.png' -vf "scale=360:-1,tile=${cols}x${rows}:padding=6:color=white" -frames:v 1 ../sheet.png
