// Narração (ElevenLabs, 78,76 s). Início e fim de cada frase medidos pelas
// pausas do áudio e conferidos com Whisper. "|" quebra a legenda em blocos;
// *palavra* vira destaque azul; "!" no começo esconde a legenda (a cena mostra
// o texto de outro jeito).
const SEGS = [
  [0.06, 4.82, 'Davi recebeu numa caverna | *quatrocentos* homens | endividados e amargurados.'],
  [5.29, 6.05, 'Anos depois,'],
  [6.40, 9.88, 'os homens de Davi | eram os guerreiros | mais *valentes* do reino.'],
  [10.43, 10.76, '!Como?'],
  [11.49, 12.27, 'Pouco depois,'],
  [12.48, 14.73, 'os filisteus atacaram | a cidade de *Queila*.'],
  [15.26, 17.32, 'Deus mandou Davi | *defender* a cidade.'],
  [17.81, 18.92, 'Mas os homens disseram:'],
  [19.41, 21.01, '“Aqui nós estamos | com *medo*.”'],
  [21.59, 23.23, 'Davi perguntou a Deus | *de novo*.'],
  [23.65, 24.54, 'E Deus respondeu:'],
  [25.02, 27.15, '“Eu entrego os filisteus | nas suas *mãos*.”'],
  [27.72, 28.35, 'Eles foram.'],
  [28.85, 29.59, 'E *venceram*.'],
  [30.26, 33.70, 'Um dia, voltaram para casa | e a cidade estava *queimada*.'],
  [34.09, 35.69, 'As famílias, *levadas*.'],
  [36.18, 38.34, 'Os homens falaram | em *apedrejar* Davi.'],
  [38.81, 39.64, 'E a Bíblia diz:'],
  [40.07, 42.78, '!Davi se fortaleceu no Senhor, seu Deus.'],
  [43.29, 45.55, 'Foram atrás | e recuperaram *tudo*.'],
  [46.16, 47.60, 'De volta à caverna de *Adulão*,'],
  [47.91, 50.56, 'Davi disse que queria beber | água do poço de *Belém*.'],
  [50.98, 53.13, 'Belém estava ocupada | pelos *filisteus*.'],
  [53.62, 57.16, 'Três dos valentes | *atravessaram* o acampamento | inimigo para buscar.'],
  [57.68, 58.80, 'Davi *não bebeu*.'],
  [59.21, 61.15, 'Derramou a água | diante de Deus:'],
  [61.65, 64.14, '“É o sangue de homens | que *arriscaram a vida*.”'],
  [64.78, 66.52, 'E, na própria lista | dos valentes,'],
  [66.77, 68.82, 'a Bíblia repete | quem deu a vitória:'],
  [69.26, 69.85, '*o Senhor*.'],
  [70.37, 72.66, 'Eles não viraram valentes | de um dia pro outro.'],
  [73.10, 74.94, 'Viraram andando | com um líder'],
  [75.14, 77.00, 'que, no medo | e no pior dia,'],
  [77.21, 78.53, '*voltava para Deus*.'],
];
const AUDIO_END = 78.76;
const DURATION = 83.4;
