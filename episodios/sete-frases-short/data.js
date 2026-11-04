// Narração recortada da gravação do vídeo longo (episodios/sete-frases-na-cruz/narration.mp3):
// as mesmas frases, na mesma voz. Tempos exatos, porque vêm dos cortes.
const SEGS = [
  [0.21, 1.77, 'Ele falou sete frases.'],
  [2.21, 7.05, 'E tem um detalhe que quase ninguém percebe: | nenhum evangelho registra as sete.', [[2.21, 4.42], [4.92, 7.05]]],
  [7.49, 9.24, 'Mateus e Marcos guardaram uma.'],
  [9.68, 11.01, 'Lucas guardou três.'],
  [11.45, 12.91, 'João, outras três.'],
  [13.35, 15.92, 'E nenhuma frase de Lucas aparece em João.'],
  [16.36, 19.64, 'É juntando os quatro relatos | que a gente escuta a cruz inteira.', [[16.36, 17.85], [17.87, 19.64]]],
  [20.08, 22.26, 'Perdão pra quem estava crucificando ele.'],
  [22.70, 24.37, 'Uma promessa pra um condenado.'],
  [24.81, 26.33, 'Cuidado com a própria mãe.'],
  [26.77, 28.04, 'Um grito de abandono.'],
  [28.48, 29.06, 'Sede.'],
  [29.50, 30.58, 'Está consumado.'],
  [31.02, 33.98, 'E, no fim, o espírito entregue nas mãos do Pai.'],
];
const AUDIO_END = 34.40;
const DURATION = 40.10;
// Acelera o vídeo inteiro no fim do build (a voz mantém o tom).
const SPEED = 1.25;
