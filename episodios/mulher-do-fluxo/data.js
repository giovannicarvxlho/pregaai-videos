// Narração da ElevenLabs (voz Marcelo Costa, estabilidade 50, similaridade 80, v4), 71,2 s.
// Tempos medidos com tools/segmentos.py e conferidos com tools/transcrever.py (Whisper).
// Só a narração base: a chamada para o app (YouTube) e o fecho falado do TikTok ainda não foram gravados.
const SEGS = [
  [0.08, 3.12, 'Pela lei, | quem essa mulher tocasse ficava impuro.', [[0.08, 0.65], [0.95, 3.12]]],
  [3.57, 5.00, 'E ela tocou em Jesus.'],
  [5.48, 8.46, 'Fazia doze anos que ela sofria | com um fluxo de sangue.'],
  [8.89, 10.91, 'Gastou tudo o que tinha com médicos.'],
  [11.31, 13.50, 'E, em vez de melhorar, só piorava.'],
  [14.07, 17.03, 'Um dia, uma multidão | se apertava em volta de Jesus.'],
  [17.47, 18.10, 'Ela pensou:'],
  [18.54, 21.27, '“Se eu tocar só na roupa dele, | eu fico curada.”'],
  [21.77, 25.47, 'Chegou por trás, no meio do povo, | e tocou na borda do manto.', [[21.77, 23.75], [23.98, 25.47]]],
  [25.90, 27.50, 'Na hora, o sangue parou.'],
  [28.00, 29.18, 'E Jesus parou também.'],
  [29.66, 30.79, '“Quem tocou na minha roupa?”'],
  [31.22, 32.51, 'Os discípulos estranharam:'],
  [32.90, 36.12, '“O povo está te apertando, | e o Senhor pergunta quem te tocou?”'],
  [36.51, 38.88, 'Mas Jesus sabia | que tinha saído poder dele.'],
  [39.26, 40.44, 'E continuou procurando.'],
  [40.88, 43.89, 'Ela veio tremendo, | caiu aos pés dele e contou'],
  [44.09, 46.37, 'toda a verdade, | na frente de todo mundo.'],
  [46.81, 49.47, 'Pela lei, aquele toque | deixaria Jesus impuro.'],
  [49.88, 51.18, 'Mas aconteceu o contrário:'],
  [51.57, 53.55, 'a cura passou dele pra ela.'],
  [53.99, 55.19, 'E Jesus não deu bronca.'],
  [55.49, 56.09, 'Ele disse:'],
  [56.59, 59.52, '“Filha, | a sua fé a curou. | Vá em paz.”', [[56.59, 56.95], [57.17, 58.44], [58.79, 59.52]]],
  [59.99, 63.16, 'É a única pessoa a quem Jesus fala | “filha” nos evangelhos.', [[59.99, 61.79], [61.99, 63.16]]],
  [63.54, 66.23, 'Ela chegou impura | e saiu chamada de filha.'],
  [66.70, 70.93, 'Se você se vê impuro, | aproxime-se de Jesus e seja purificado.', [[66.70, 67.91], [68.13, 70.93]]],
];
const AUDIO_END = 71.16;
const DURATION = 76.5;
// Sem acelerar: o Programa de Recompensas do TikTok só conta vídeo com mais de 1 minuto.
const SPEED = 1.0;
