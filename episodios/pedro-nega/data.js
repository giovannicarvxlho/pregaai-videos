// Narração da ElevenLabs (voz Marcelo Costa, estabilidade 50, similaridade 80, v4), 82,5 s.
// Tempos medidos com tools/segmentos.py e conferidos com tools/transcrever.py (Whisper).
const SEGS = [
  [0.06, 2.23, 'Pedro negou Jesus três vezes.'],
  [2.63, 3.43, 'E na terceira,'],
  [3.73, 4.80, 'Jesus olhou pra ele.'],
  [5.50, 7.86, 'Poucas horas antes, Pedro tinha prometido:'],
  [8.31, 11.67, '“Estou pronto para ir contigo | para a prisão e para a morte.”'],
  [12.19, 13.19, 'E Jesus respondeu:'],
  [13.69, 15.22, '“Antes que o galo cante hoje,'],
  [15.63, 17.82, 'três vezes você negará que me conhece.”'],
  [18.57, 22.80, 'Naquela noite, prenderam Jesus | e o levaram pra casa do sumo sacerdote.'],
  [23.33, 25.03, 'Pedro foi atrás, de longe.'],
  [25.61, 27.32, 'No pátio, acenderam um fogo,'],
  [27.54, 28.81, 'e ele sentou com os outros.'],
  [29.29, 31.43, 'Uma criada olhou bem pra ele e disse:'],
  [31.83, 33.27, '“Este homem estava com ele.”'],
  [33.72, 35.23, '“Mulher, não o conheço.”'],
  [35.71, 37.42, 'Pouco depois, um homem disse:'],
  [37.73, 39.09, '“Você também é um deles.”'],
  [39.46, 40.68, '“Homem, não sou!”'],
  [41.13, 43.28, 'Uma hora mais tarde, outro insistiu:'],
  [43.66, 46.55, '“Certamente este homem estava com ele, | pois é galileu.”'],
  [46.90, 49.24, '“Homem, não sei do que você está falando!”'],
  [49.61, 52.14, 'E ele ainda estava falando | quando o galo cantou.'],
  [52.71, 54.87, 'Aí vem um detalhe que só Lucas conta:'],
  [55.35, 56.41, 'O Senhor se virou'],
  [56.62, 58.39, 'e olhou diretamente pra Pedro.'],
  [58.85, 60.77, 'Pedro lembrou do que Jesus tinha dito.'],
  [61.13, 61.91, 'Saiu dali'],
  [62.19, 63.58, 'e chorou amargamente.'],
  [64.09, 65.60, 'Mas a história não acabou ali.'],
  [65.99, 69.41, 'Depois de ressuscitar, | Jesus perguntou a Pedro três vezes:'],
  [69.89, 70.60, '“Você me ama?”'],
  [71.04, 73.00, 'E três vezes Pedro respondeu:'],
  [73.43, 73.92, '“Senhor,'],
  [74.29, 75.48, 'tu sabes que te amo.”'],
  [75.99, 80.67, 'No sábado, às 15 horas, sai o vídeo completo | do que aconteceu depois da cruz.'],
  [81.02, 82.30, 'Segue o perfil pra não perder.'],
];
const AUDIO_END = 82.52;
const DURATION = 88.0;
// Sem acelerar: o Programa de Recompensas do TikTok só conta vídeo com mais de 1 minuto
// (decisão de 04/11/2026: recortes e curtos com 70 a 90 s, velocidade 1,0).
const SPEED = 1.0;
