// Narração da ElevenLabs. Tempos de cada palavra devolvidos pela própria API (tools/tempos.py --novo);
// confira os blocos "|" da legenda (até ~28 letras) e marque "!" ou "*" onde precisar.
const SEGS = [
  [0.00, 5.44, 'Três reis diante da manjedoura. | Mateus não conta nenhuma | dessas três coisas.', [[0.0, 2.08], [2.8, 4.24], [4.32, 5.44]], [0.0, 0.4, 0.8, 1.28, 1.44, 2.8, 3.33, 3.56, 3.88, 4.32, 4.72, 4.96]],
  [5.84, 10.72, 'Ele conta outra cena. | E ela tem uma pista | que quase ninguém percebe.', [[5.84, 7.28], [7.84, 8.96], [9.04, 10.72]], [5.84, 6.08, 6.48, 6.88, 7.84, 8.04, 8.24, 8.4, 8.68, 9.04, 9.32, 9.8, 10.16]],
  [11.36, 16.00, 'Primeiro: Mateus não chama | eles de reis. Chama de magos.', [[11.36, 13.52], [13.56, 16.0]], [11.36, 12.32, 12.96, 13.2, 13.56, 13.84, 14.0, 14.96, 15.28, 15.44]],
  [16.64, 23.60, '"Magos vindos do Oriente | chegaram a Jerusalém" | e perguntaram: "Onde está | o recém-nascido rei dos judeus?"', [[16.64, 18.16], [18.24, 19.44], [19.76, 21.6], [21.64, 23.6]], [16.64, 17.2, 17.56, 17.68, 18.24, 18.76, 18.88, 19.76, 19.92, 21.04, 21.4, 21.64, 21.8, 22.56, 22.88, 23.04]],
  [24.24, 28.48, 'Rei, nessa história, | é Herodes. E o menino | que eles vieram adorar.', [[24.24, 25.36], [25.6, 27.28], [27.36, 28.48]], [24.24, 24.64, 24.88, 25.6, 25.68, 26.72, 26.84, 27.0, 27.36, 27.49, 27.68, 28.12]],
  [29.20, 36.08, 'Segundo: quantos eram? | Mateus não diz. Diz o que eles | deram: ouro, incenso e mirra.', [[29.2, 30.8], [31.28, 33.36], [33.44, 36.08]], [29.2, 30.08, 30.48, 31.28, 31.68, 31.84, 32.64, 32.88, 32.96, 33.08, 33.44, 34.24, 34.8, 35.6, 35.68]],
  [36.56, 40.08, 'Três presentes. Quantas | pessoas, o texto não diz.', [[36.56, 38.24], [38.32, 40.08]], [36.56, 36.88, 38.0, 38.32, 39.2, 39.28, 39.65, 39.8]],
  [40.72, 47.12, 'Terceiro: onde acharam Jesus? | "Ao entrarem na casa, | viram o menino com Maria, | sua mãe."', [[40.72, 42.96], [43.52, 44.72], [45.08, 46.48], [46.68, 47.12]], [40.72, 41.68, 41.92, 42.48, 43.52, 43.68, 44.2, 44.4, 45.08, 45.32, 45.48, 45.84, 46.24, 46.68, 46.88]],
  [47.68, 55.04, 'Numa casa. A manjedoura | é de outra cena: foi lá | que os pastores acharam o bebê, | e quem conta é Lucas.', [[47.68, 49.68], [49.76, 51.6], [51.64, 53.28], [53.6, 55.04]], [47.68, 48.0, 48.96, 49.12, 49.76, 49.92, 50.08, 50.48, 51.2, 51.44, 51.64, 51.76, 52.0, 52.48, 52.84, 52.96, 53.6, 53.68, 53.92, 54.4, 54.56]],
  [55.68, 56.88, 'Agora, a pista.', [[55.68, 56.88]], [55.68, 56.32, 56.48]],
  [57.44, 61.68, 'Herodes quis saber dos magos | o tempo exato em que a estrela | tinha aparecido.', [[57.44, 59.12], [59.2, 60.76], [60.8, 61.68]], [57.44, 58.0, 58.27, 58.56, 58.72, 59.2, 59.4, 59.72, 60.12, 60.24, 60.29, 60.44, 60.8, 61.04]],
  [62.16, 67.76, 'Depois, mandou matar | os meninos de dois anos | pra baixo, de acordo | com o que os magos disseram.', [[62.16, 63.68], [63.76, 65.04], [65.12, 66.4], [66.48, 67.76]], [62.16, 62.96, 63.32, 63.76, 63.92, 64.32, 64.48, 64.8, 65.12, 65.28, 65.88, 66.0, 66.48, 66.59, 66.64, 66.76, 66.88, 67.32]],
  [68.24, 73.36, 'Mateus não diz quanto | tempo tinha passado. | Mas a conta de Herodes | não foi de uma noite.', [[68.24, 69.52], [69.6, 70.64], [71.04, 72.24], [72.28, 73.36]], [68.24, 68.69, 68.88, 69.2, 69.6, 69.92, 70.16, 71.04, 71.24, 71.36, 71.68, 71.8, 72.28, 72.56, 72.76, 72.88, 73.04]],
  [73.84, 76.00, 'Pode deixar os três | reis no presépio.', [[73.84, 74.96], [75.04, 76.0]], [73.84, 74.16, 74.56, 74.72, 75.04, 75.32, 75.44]],
  [76.48, 82.16, 'Só lembra o que Mateus | conta que eles fizeram | quando acharam o menino: | "prostrando-se, o adoraram".', [[76.48, 77.52], [77.64, 78.64], [78.72, 79.92], [80.4, 82.16]], [76.48, 76.64, 76.93, 77.0, 77.12, 77.64, 77.92, 78.0, 78.24, 78.72, 78.96, 79.4, 79.52, 80.4, 81.52, 81.6]],
];
const AUDIO_END = 82.16;
const DURATION = 87.9; // fala + cartão final (Google Play e web), ~5,7 s depois da fala, como no morte-de-acabe
// Acelera o vídeo inteiro no fim do build (a voz mantém o tom).
const SPEED = 1.25;
// Texto do gancho no 1º quadro (some aos 3 s) e banner do app a cada 30 s.
const GANCHO = '3 reis na *manjedoura*?';
const CTA_CICLO = true;
