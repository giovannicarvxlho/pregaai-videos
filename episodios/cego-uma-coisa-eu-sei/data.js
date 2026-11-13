// Narração da ElevenLabs. Tempos de cada palavra devolvidos pela própria API (tools/tempos.py --novo);
// confira os blocos "|" da legenda (até ~28 letras) e marque "!" ou "*" onde precisar.
const SEGS = [
  [0.00, 6.08, 'Quando o cego voltou enxergando, | os próprios pais dele | se recusaram a confirmar | quem fez o milagre.', [[0.0, 1.68], [2.0, 3.44], [3.52, 4.88], [5.04, 6.08]], [0.0, 0.16, 0.24, 0.64, 1.04, 2.0, 2.24, 2.72, 3.12, 3.52, 3.68, 4.28, 4.4, 5.04, 5.28, 5.55, 5.6]],
  [6.56, 14.80, 'E tem um detalhe nessa cena | que quase ninguém percebe: | ele não citou nenhum versículo, | e mesmo assim calou | todos os líderes.', [[6.56, 8.0], [8.08, 9.6], [10.24, 12.0], [12.4, 13.6], [13.84, 14.8]], [6.56, 6.72, 6.84, 7.0, 7.44, 7.68, 8.08, 8.32, 8.76, 9.12, 10.24, 10.4, 10.56, 10.96, 11.52, 12.4, 12.56, 12.92, 13.36, 13.84, 14.16, 14.32]],
  [15.36, 19.60, 'E o motivo disso muda | a forma como você defende | a sua fé até hoje.', [[15.36, 16.8], [16.88, 18.16], [18.2, 19.6]], [15.36, 15.48, 15.6, 15.92, 16.56, 16.88, 17.12, 17.36, 17.56, 17.84, 18.2, 18.28, 18.56, 18.8, 19.28]],
  [20.16, 23.84, 'Como Jesus tinha curado | no sábado, os fariseus | queriam condenar ele.', [[20.16, 21.28], [21.32, 22.64], [22.72, 23.84]], [20.16, 20.32, 20.72, 20.96, 21.32, 21.44, 22.12, 22.24, 22.72, 23.12, 23.6]],
  [24.32, 27.20, 'Chamaram os pais do ex-cego | pra pressionar a família.', [[24.32, 25.84], [25.92, 27.2]], [24.32, 24.72, 24.88, 25.2, 25.36, 25.92, 26.08, 26.68, 26.8]],
  [27.68, 33.20, 'Com medo de serem expulsos, | os pais lavaram as mãos: | "Perguntem a ele. | Ele já tem idade."', [[27.68, 29.2], [29.44, 30.8], [31.16, 32.0], [32.32, 33.2]], [27.68, 27.96, 28.2, 28.32, 28.56, 29.44, 29.6, 29.84, 30.28, 30.4, 31.16, 31.64, 31.76, 32.32, 32.48, 32.64, 32.8]],
  [33.68, 37.68, 'Então partiram pra cima | do homem: "Sabemos | que esse Jesus é pecador!"', [[33.68, 34.88], [34.96, 36.32], [36.36, 37.68]], [33.68, 34.0, 34.56, 34.72, 34.96, 35.12, 35.76, 36.36, 36.48, 36.64, 37.0, 37.12]],
  [38.16, 41.20, 'Ele não discutiu doutrina. | Não tentou provar nada.', [[38.16, 39.6], [40.0, 41.2]], [38.16, 38.4, 38.68, 39.09, 40.0, 40.16, 40.48, 40.88]],
  [41.68, 48.96, 'Só disse uma frase: | "Se ele é pecador, | não sei. Uma coisa eu sei: | eu era cego e agora vejo!"', [[41.68, 42.88], [43.44, 44.4], [44.72, 46.56], [47.04, 48.96]], [41.68, 41.84, 42.24, 42.48, 43.44, 43.64, 43.76, 43.84, 44.72, 44.88, 45.6, 45.92, 46.24, 46.44, 47.04, 47.24, 47.44, 48.08, 48.16, 48.56]],
  [49.44, 52.80, 'Sabe por que aquela | única frase desmontou | os doutores da lei?', [[49.44, 50.32], [50.4, 51.92], [51.96, 52.8]], [49.44, 49.68, 49.84, 50.04, 50.4, 50.88, 51.28, 51.96, 52.04, 52.48, 52.68]],
  [53.28, 58.40, 'Porque você pode | discutir uma teoria, | mas nunca consegue negar | uma vida transformada.', [[53.28, 54.0], [54.12, 55.2], [55.52, 57.04], [57.12, 58.4]], [53.28, 53.52, 53.76, 54.12, 54.56, 54.72, 55.52, 55.92, 56.24, 56.76, 57.12, 57.44, 57.68]],
  [58.88, 60.64, 'Isso vale pra sua vida até hoje:', [[58.88, 60.64]], [58.88, 59.24, 59.44, 59.56, 59.76, 60.0, 60.32]],
  [61.16, 65.04, 'Você não precisa saber | explicar tudo sobre Deus | pra dar testemunho dele.', [[61.16, 62.16], [62.24, 63.68], [63.76, 65.04]], [61.16, 61.31, 61.44, 61.96, 62.24, 62.8, 63.12, 63.44, 63.76, 64.0, 64.2, 64.8]],
  [65.44, 69.28, 'Quem viveu o milagre carrega | uma prova que ninguém | consegue refutar.', [[65.44, 67.12], [67.2, 68.24], [68.32, 69.28]], [65.44, 65.68, 66.04, 66.16, 66.8, 67.2, 67.36, 67.68, 67.84, 68.32, 68.8]],
];
const AUDIO_END = 69.28;
const DURATION = 75.28; // fala + cartão final; ajuste se precisar
// Acelera o vídeo inteiro no fim do build (a voz mantém o tom).
const SPEED = 1.25;
