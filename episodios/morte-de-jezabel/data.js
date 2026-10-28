// Narração da ElevenLabs (Carlos, 46,45 s). Início e fim de cada frase medidos
// com tools/segmentos.py e conferidos com Whisper. Onde a voz pausa dentro da
// frase, o 4º item dá o trecho de cada bloco "|".
const SEGS = [
  [0.05, 3.57, 'Sabe o que a rainha Jezabel fez | quando soube que Jeú tava chegando?'],
  [4.22, 8.08, 'Pintou os olhos. | Arrumou o cabelo. | E foi pra janela.', [[4.22, 5.26], [5.57, 6.65], [7.07, 8.08]]],
  [8.64, 11.74, 'Jeú tinha acabado de matar o filho dela, | o rei.', [[8.64, 11.04], [11.31, 11.74]]],
  [12.31, 15.23, 'Quando ele passou pelo portão, | ela provocou lá de cima:', [[12.31, 13.62], [13.86, 15.23]]],
  [15.69, 16.98, '“Como vai, assassino?”'],
  [17.50, 20.83, 'Jeú nem respondeu. | Olhou pra janela e gritou:', [[17.50, 18.87], [19.24, 20.83]]],
  [21.26, 22.47, '“Quem aí tá do meu lado?”'],
  [22.92, 25.01, 'Dois ou três funcionários | apareceram.'],
  [25.45, 27.01, '“Joguem essa mulher | lá embaixo.”'],
  [27.50, 28.35, 'E eles jogaram.'],
  [28.80, 33.67, 'Depois, quando foram enterrar, | só acharam o crânio, | os pés e as mãos.', [[28.80, 30.59], [30.85, 32.00], [32.22, 33.67]]],
  [34.13, 36.05, 'Os cães tinham comido o resto.'],
  [36.55, 39.89, 'Do jeitinho que Elias tinha avisado, | anos antes.', [[36.55, 38.76], [38.96, 39.89]]],
  [40.33, 43.33, 'Ela tinha o palácio, | a coroa e a maquiagem.'],
  [43.73, 46.23, 'Mas a última palavra | nunca foi dela.'],
];
const AUDIO_END = 46.45;
const DURATION = 52.4;
// Acelera o vídeo inteiro no fim do build (a voz mantém o tom).
const SPEED = 1.25;
