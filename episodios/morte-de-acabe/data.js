// Narração da ElevenLabs (Carlos, 45,87 s). Início e fim de cada frase medidos
// com tools/segmentos.py e conferidos com Whisper. Onde a voz pausa dentro da
// frase, o 4º item dá o trecho de cada bloco "|".
const SEGS = [
  [0.08, 2.51, 'Um soldado atirou uma flecha | sem mirar.'],
  [2.93, 3.85, 'E matou um rei.'],
  [4.45, 6.02, 'Acabe ia para a guerra.'],
  [6.52, 8.37, 'Quatrocentos profetas disseram:'],
  [8.63, 10.45, '“Vá. | Você vai vencer.”', [[8.63, 8.96], [9.29, 10.45]]],
  [10.90, 13.16, 'Só um, | Micaías, avisou:', [[10.90, 11.49], [11.73, 13.16]]],
  [13.59, 16.48, '“Se você voltar, | o Senhor não falou por mim.”', [[13.59, 14.62], [14.88, 16.48]]],
  [17.02, 18.39, 'Acabe mandou prendê-lo.'],
  [18.79, 20.71, 'E foi para a batalha | disfarçado.'],
  [21.19, 22.63, 'O inimigo tinha uma ordem:'],
  [23.04, 25.16, '“Lutem só contra | o rei de Israel.”'],
  [25.62, 26.89, 'O disfarce funcionou.'],
  [27.36, 29.57, 'Até que um soldado | disparou ao acaso.'],
  [29.98, 32.55, 'A flecha passou | entre os encaixes da armadura.'],
  [33.02, 34.94, 'Acabe morreu | ao cair da tarde.'],
  [35.35, 38.86, 'E os cães lamberam o sangue dele, | como o Senhor tinha dito.'],
  [39.33, 42.59, 'Ele ouviu quatrocentas vozes | que concordavam com ele.'],
  [43.02, 45.67, 'E ignorou a única | que dizia a verdade.'],
];
const AUDIO_END = 45.87;
const DURATION = 51.6;
// Acelera o vídeo inteiro no fim do build (a voz mantém o tom).
const SPEED = 1.15;
