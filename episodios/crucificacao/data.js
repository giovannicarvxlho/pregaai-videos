// Tempos ESTIMADOS (5,35 sílabas/s, a média de Acabe e Jezabel, e 0,5 s entre
// frases). Troque pelos medidos com tools/segmentos.py quando a narração chegar.
const SEGS = [
  [0.10, 3.59, 'Provocaram Jesus: | “Desça da cruz, | se é Filho de Deus!”'],
  [4.09, 5.21, 'E ele não desceu.'],
  [5.71, 9.51, 'Antes, os soldados puseram nele | uma coroa de espinhos:'],
  [10.01, 11.14, '“Salve, rei dos judeus!”'],
  [11.64, 15.50, 'No Gólgota, | crucificaram ele | entre dois criminosos.'],
  [16.00, 20.49, 'E ele pediu: | “Pai, perdoa-lhes, | pois não sabem | o que estão fazendo.”'],
  [20.99, 22.48, 'Os líderes debochavam:'],
  [22.98, 26.47, '“Salvou os outros, | mas não consegue | salvar a si mesmo.”'],
  [26.97, 30.03, 'Do meio-dia às três da tarde, | ficou tudo escuro.'],
  [30.53, 33.02, 'Então Jesus disse: | “Está consumado!”'],
  [33.52, 35.20, 'E entregou o espírito.'],
  [35.70, 39.13, 'Na hora, o véu do santuário | rasgou de cima a baixo.'],
  [39.63, 40.94, 'E o centurião disse:'],
  [41.44, 44.49, '“Verdadeiramente | este era o Filho de Deus!”'],
  [44.99, 47.30, 'Ele não ficou na cruz | por fraqueza.'],
  [47.80, 49.48, 'Ninguém tirou a vida dele.'],
  [49.98, 51.35, 'Ele deu. | Por você.'],
];
const AUDIO_END = 51.55;
const DURATION = 57.3;
// Acelera o vídeo inteiro no fim do build (a voz mantém o tom).
const SPEED = 1.25;
