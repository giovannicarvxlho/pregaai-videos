// Narração da ElevenLabs. Tempos de cada palavra devolvidos pela própria API (tools/tempos.py --novo);
// confira os blocos "|" da legenda (até ~28 letras) e marque "!" ou "*" onde precisar.
const SEGS = [
  [0.00, 5.76, 'O cego que Jesus curou foi | expulso de tudo por defender | um homem que ele nunca | tinha visto na vida.', [[0.0, 1.6], [1.72, 3.36], [3.44, 4.56], [4.64, 5.76]], [0.0, 0.08, 0.48, 0.56, 0.96, 1.44, 1.72, 2.16, 2.4, 2.8, 2.96, 3.44, 3.6, 3.92, 4.0, 4.32, 4.64, 4.96, 5.28, 5.44]],
  [6.32, 13.20, 'E tem um detalhe que quase | ninguém percebe: quando todo | mundo virou as costas pra ele, | Jesus não estava lá.', [[6.32, 7.68], [7.8, 9.84], [9.92, 11.44], [11.84, 13.2]], [6.32, 6.4, 6.56, 6.72, 7.12, 7.36, 7.8, 8.16, 9.24, 9.6, 9.92, 10.16, 10.48, 10.68, 11.04, 11.28, 11.84, 12.4, 12.68, 13.04]],
  [13.76, 20.40, 'E o motivo de Jesus só | aparecer depois que ele ficou | sozinho muda o jeito que você | olha pra rejeição até hoje.', [[13.76, 14.92], [14.96, 16.48], [16.56, 18.72], [18.8, 20.4]], [13.76, 13.87, 13.92, 14.28, 14.4, 14.8, 14.96, 15.6, 16.08, 16.16, 16.32, 16.56, 17.6, 17.96, 18.08, 18.36, 18.48, 18.8, 19.04, 19.2, 19.8, 20.08]],
  [21.04, 24.48, 'Quando Jesus passou | barro nos olhos dele, | ele ainda era cego.', [[21.04, 21.92], [22.0, 23.12], [23.36, 24.48]], [21.04, 21.28, 21.6, 22.0, 22.4, 22.52, 22.8, 23.36, 23.52, 23.92, 24.08]],
  [25.04, 29.04, 'Quando lavou o rosto | no tanque de Siloé, | Jesus já tinha sumido.', [[25.04, 26.0], [26.04, 27.04], [27.36, 29.04]], [25.04, 25.32, 25.56, 25.68, 26.04, 26.16, 26.44, 26.56, 27.36, 27.92, 28.24, 28.56]],
  [29.52, 33.20, 'Os líderes religiosos | pressionaram o homem | pra negar o milagre.', [[29.52, 30.8], [30.88, 32.0], [32.08, 33.2]], [29.52, 29.76, 30.16, 30.88, 31.64, 31.76, 32.08, 32.24, 32.67, 32.72]],
  [33.60, 37.20, 'Os próprios pais | tiveram medo e deixaram | ele se virar sozinho.', [[33.6, 34.64], [34.68, 36.08], [36.16, 37.2]], [33.6, 33.84, 34.32, 34.68, 35.2, 35.52, 35.6, 36.16, 36.28, 36.4, 36.72]],
  [37.68, 42.08, 'Mas ele não voltou atrás: | "Eu era cego e agora vejo!"', [[37.68, 39.44], [39.97, 42.08]], [37.68, 38.04, 38.32, 38.56, 39.04, 39.97, 40.2, 40.48, 41.04, 41.2, 41.68]],
  [42.64, 45.36, 'Por causa disso, | expulsaram ele da sinagoga.', [[42.64, 43.44], [43.72, 45.36]], [42.64, 42.8, 43.12, 43.72, 44.48, 44.64, 44.8]],
  [45.84, 52.48, 'Só então Jesus foi | atrás dele e disse: | "Você já o tem visto. É aquele | que está falando com você."', [[45.84, 46.96], [47.08, 48.24], [48.72, 51.12], [51.2, 52.48]], [45.84, 46.08, 46.48, 46.84, 47.08, 47.36, 47.76, 47.92, 48.72, 49.28, 49.52, 49.68, 49.84, 50.64, 50.88, 51.2, 51.36, 51.6, 51.96, 52.08]],
  [53.12, 56.08, 'Sabe por que Jesus | esperou ele ser | expulso pra se revelar?', [[53.12, 54.0], [54.08, 54.72], [54.8, 56.08]], [53.12, 53.36, 53.6, 53.76, 54.08, 54.48, 54.64, 54.8, 55.4, 55.52, 55.68]],
  [56.64, 61.84, 'Porque enquanto você | tá cercado de gente | tentando te calar, | você só conhece o milagre.', [[56.64, 57.44], [57.52, 58.72], [58.8, 59.76], [60.04, 61.84]], [56.64, 56.96, 57.24, 57.52, 57.68, 58.32, 58.44, 58.8, 59.2, 59.36, 60.04, 60.48, 60.72, 61.23, 61.28]],
  [62.32, 66.24, 'Mas quando as portas | se fecham, você conhece | quem fez o milagre.', [[62.32, 63.2], [63.28, 64.88], [65.04, 66.24]], [62.32, 62.52, 62.72, 62.88, 63.28, 63.44, 64.16, 64.48, 65.04, 65.36, 65.68, 65.76]],
  [66.80, 70.00, 'O que aconteceu | com aquele cego vale | pra sua vida até hoje:', [[66.8, 67.44], [67.48, 68.48], [68.56, 70.0]], [66.8, 66.88, 66.96, 67.48, 67.6, 67.92, 68.32, 68.56, 68.72, 68.96, 69.28, 69.68]],
  [70.56, 75.60, 'Se depois do que Deus fez, | algumas pessoas se afastaram | de você, não se desespere.', [[70.56, 71.92], [72.08, 73.6], [73.64, 75.6]], [70.56, 70.72, 71.04, 71.16, 71.28, 71.6, 72.08, 72.52, 72.92, 73.04, 73.64, 73.76, 74.64, 74.88, 75.04]],
  [76.12, 78.80, 'É aí fora que Jesus vai | se revelar de verdade.', [[76.12, 77.52], [77.6, 78.8]], [76.12, 76.24, 76.56, 76.88, 77.04, 77.47, 77.6, 77.76, 78.16, 78.32]],
];
const AUDIO_END = 78.80;
const DURATION = 84.80; // fala + cartão final; ajuste se precisar
// Acelera o vídeo inteiro no fim do build (a voz mantém o tom).
const SPEED = 1.25;
