// Narração ESTIMADA (ainda sem áudio): o tempo de cada frase saiu do ritmo da
// voz da parte 2 dos valentes (5,97 sílabas/s, pausa de 0,46 s). Quando o mp3
// chegar, troque pelos tempos de tools/segmentos.py; as cenas acompanham.
// "|" quebra a legenda em blocos; *palavra* vira o destaque azul.
const SEGS = [
  [0.06, 2.41, 'Um soldado atirou uma flecha | sem mirar.'],
  [2.87, 3.71, 'E matou um rei.'],
  [4.17, 5.68, 'Acabe ia para a guerra.'],
  [6.14, 7.82, 'Quatrocentos profetas disseram:'],
  [8.28, 9.29, '“Vá. Você vai vencer.”'],
  [9.75, 10.92, 'Só um, Micaías, avisou:'],
  [11.39, 13.57, '“Se você voltar, | o Senhor não falou por mim.”'],
  [14.03, 15.37, 'Acabe mandou prendê-lo.'],
  [15.83, 17.84, 'E foi para a batalha | disfarçado.'],
  [18.31, 20.15, 'O inimigo tinha uma ordem:'],
  [20.61, 22.29, '“Lutem só contra | o rei de Israel.”'],
  [22.75, 23.93, 'O disfarce funcionou.'],
  [24.39, 26.74, 'Até que um soldado | disparou ao acaso.'],
  [27.20, 29.88, 'A flecha passou | entre os encaixes da armadura.'],
  [30.34, 32.02, 'Acabe morreu | ao cair da tarde.'],
  [32.48, 35.83, 'E os cães lamberam o sangue dele, | como o Senhor tinha dito.'],
  [36.30, 39.31, 'Ele ouviu quatrocentas vozes | que concordavam com ele.'],
  [39.78, 42.29, 'E ignorou a única | que dizia a verdade.'],
];
const AUDIO_END = 42.29;
const DURATION = 48.0;
// Acelera o vídeo inteiro no fim do build (a voz mantém o tom).
const SPEED = 1.15;
