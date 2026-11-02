// Narração da ElevenLabs (Marcelo Costa, 49,24 s). Início e fim de cada frase
// medidos com tools/segmentos.py e conferidos com Whisper. Onde a voz pausa dentro
// da frase, o 4º item dá o trecho de cada bloco "|"; quando o bloco não tem pausa
// própria, o corte entre os dois foi dividido pelas sílabas.
const SEGS = [
  [0.07, 3.57, 'Provocaram Jesus: | “Desça da cruz, | se é Filho de Deus!”', [[0.07, 1.27], [1.64, 2.42], [2.42, 3.57]]],
  [4.05, 5.16, 'E ele não desceu.'],
  [5.69, 9.00, 'Antes, | os soldados puseram nele | uma coroa de espinhos:', [[5.69, 6.15], [6.42, 7.71], [7.71, 9.00]]],
  [9.36, 11.05, '“Salve, rei dos judeus!”'],
  [11.54, 14.83, 'No Gólgota, | crucificaram ele | entre dois criminosos.', [[11.54, 12.21], [12.48, 13.65], [13.65, 14.83]]],
  [15.26, 19.90, 'E ele pediu: | “Pai, perdoa-lhes, | pois não sabem | o que estão fazendo.”', [[15.26, 15.92], [16.46, 17.87], [18.23, 18.84], [18.84, 19.90]]],
  [20.38, 21.74, 'Os líderes debochavam:'],
  [22.13, 25.24, '“Salvou os outros, | mas não consegue | salvar a si mesmo.”'],
  [25.69, 29.09, 'Do meio-dia às três da tarde, | ficou tudo escuro.'],
  [29.54, 32.39, 'Então Jesus disse: | “Está consumado!”', [[29.54, 30.72], [31.19, 32.39]]],
  [32.79, 34.01, 'E entregou o espírito.'],
  [34.46, 37.91, 'Na hora, | o véu do santuário | rasgou de cima a baixo.', [[34.46, 35.03], [35.28, 36.41], [36.41, 37.91]]],
  [38.30, 39.37, 'E o centurião disse:'],
  [39.76, 42.81, '“Verdadeiramente | este era o Filho de Deus!”'],
  [43.25, 45.15, 'Ele não ficou na cruz | por fraqueza.'],
  [45.51, 46.94, 'Ninguém tirou a vida dele.'],
  [47.38, 49.02, 'Ele deu. | Por você.', [[47.38, 47.95], [48.43, 49.02]]],
];
const AUDIO_END = 49.24;
const DURATION = 55.0;
// Acelera o vídeo inteiro no fim do build (a voz mantém o tom).
const SPEED = 1.25;
