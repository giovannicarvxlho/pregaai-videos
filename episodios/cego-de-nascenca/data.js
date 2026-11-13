// Narração da ElevenLabs (Marcelo Costa, Eleven v4 Turbo, 75,09 s).
// Início e fim de cada trecho medidos com tools/segmentos.py e conferidos com Whisper.
const SEGS = [
  [0.05, 1.41, 'Jesus cuspiu no chão,'],
  [1.81, 4.52, 'fez barro e passou | nos olhos de um homem cego.'],
  [5.03, 7.43, 'E tem um detalhe que | quase ninguém percebe:'],
  [7.91, 9.51, 'ele não foi curado na hora.'],
  [9.97, 14.18, 'E o motivo disso muda a forma | como você espera | o seu milagre até hoje.'],
  [14.91, 16.45, 'O homem tinha nascido cego.'],
  [16.92, 19.18, 'Os discípulos olharam pra ele | e perguntaram:'],
  [19.62, 22.42, '“Mestre, | quem pecou? | Ele ou os pais?”', [[19.62, 20.09], [20.30, 20.90], [21.23, 22.42]]],
  [22.93, 24.75, 'Jesus respondeu | que ninguém pecou,'],
  [25.02, 27.42, 'mas que aquilo ia mostrar | a obra de Deus.'],
  [27.95, 30.37, 'Aí, | em vez de só falar uma palavra,', [[27.95, 28.32], [28.58, 30.37]]],
  [30.62, 34.36, 'Jesus cuspiu na terra, | fez lama e passou nos olhos dele.', [[30.62, 31.97], [32.27, 34.36]]],
  [34.91, 36.22, 'Só que não aconteceu nada.'],
  [36.74, 39.70, 'Jesus disse: | “Vá se lavar no tanque de Siloé.”', [[36.74, 37.51], [37.90, 39.70]]],
  [40.26, 40.90, 'Pensa nisso:'],
  [41.26, 45.50, 'ele saiu dali ainda cego, | tateando pela rua, | com barro no rosto.'],
  [46.01, 47.02, 'Todo mundo olhando.'],
  [47.56, 48.53, 'E se não funcionasse?'],
  [49.15, 53.83, 'Mesmo assim, ele foi até o tanque, | lavou o rosto e voltou enxergando.', [[49.15, 51.29], [51.50, 53.83]]],
  [54.41, 56.63, 'Sabe por que Jesus | não curou ele na hora?'],
  [57.11, 59.42, 'Porque tem milagre | que Deus começa em você,'],
  [59.67, 62.74, 'mas só se completa enquanto | você caminha na obediência.'],
  [63.24, 66.58, 'O que Jesus fez com aquele cego | vale pra sua vida até hoje:'],
  [66.99, 71.00, 'Se agora parece que você | só tem lama no rosto | e ainda não vê a resposta,'],
  [71.34, 72.49, 'continua andando.'],
  [72.88, 75.09, 'O seu tanque de Siloé | tá logo ali.'],
];
const AUDIO_END = 75.3;
const DURATION = 81.0;
const SPEED = 1.25;
