// Narração ESTIMADA (ainda sem áudio): o tempo de cada frase saiu do ritmo da
// voz da parte 2 dos valentes (5,97 sílabas/s, pausa de 0,46 s). Quando o mp3
// chegar, troque pelos tempos de tools/segmentos.py; as cenas acompanham.
// "|" quebra a legenda em blocos; *palavra* vira o destaque azul.
const SEGS = [
  [0.06, 3.08, 'Um soldado atirou uma flecha | sem mirar em *ninguém*.'],
  [3.54, 4.88, 'E ela matou | um *rei*.'],
  [5.34, 8.03, 'Acabe, rei de Israel, | ia guerrear contra a *Síria*.'],
  [8.49, 10.33, 'Antes, reuniu | *quatrocentos* profetas.'],
  [10.80, 11.63, 'Todos disseram:'],
  [12.10, 14.44, '“Ataque. O Senhor | vai te dar a *vitória*.”'],
  [14.91, 17.42, 'Mas Josafá, rei de Judá, | que ia junto, perguntou:'],
  [17.88, 19.73, '“Não tem outro | profeta do *Senhor*?”'],
  [20.19, 21.20, 'Tinha um, *Micaías*.'],
  [21.66, 22.66, 'E Acabe disse:'],
  [23.13, 24.30, '“Eu *odeio* esse homem.'],
  [24.76, 27.28, 'Ele nunca profetiza | nada de bom sobre mim.”'],
  [27.74, 28.91, 'Micaías veio e avisou:'],
  [29.38, 31.22, 'Acabe ia *morrer* | naquela guerra.'],
  [31.68, 34.70, 'Acabe mandou prendê-lo | até voltar em *segurança*.'],
  [35.16, 36.17, 'E Micaías respondeu:'],
  [36.63, 38.81, '“Se você voltar, | o Senhor *não falou* por mim.”'],
  [39.28, 41.96, 'Então Acabe entrou na batalha | *disfarçado*.'],
  [42.42, 44.60, 'E deixou Josafá | com as roupas de *rei*.'],
  [45.06, 46.74, 'O rei da Síria tinha mandado:'],
  [47.20, 49.04, '“Lutem só contra | o *rei de Israel*.”'],
  [49.51, 50.68, 'Cercaram *Josafá*.'],
  [51.14, 53.49, 'Mas não era Acabe, | e deixaram ele ir.'],
  [53.95, 55.29, 'O disfarce *funcionou*.'],
  [55.76, 58.77, 'Até que um soldado | disparou o arco *ao acaso*.'],
  [59.24, 61.92, 'A flecha entrou | entre os *encaixes* da armadura.'],
  [62.38, 65.40, 'Acabe sangrou o dia inteiro, | em pé no carro de guerra.'],
  [65.86, 67.37, 'E morreu | ao cair da *tarde*.'],
  [67.83, 71.35, 'Lavaram o carro em Samaria, | e os cães lamberam o sangue dele.'],
  [71.82, 73.32, 'Como o *Senhor* tinha dito.'],
  [73.79, 77.48, 'Acabe tinha quatrocentas vozes | dizendo o que ele queria ouvir.'],
  [77.94, 79.78, 'E *uma só* | dizendo a verdade.'],
  [80.25, 82.09, 'Ele escolheu | as *quatrocentas*.'],
];
const AUDIO_END = 82.09;
const DURATION = 88.9;
// Acelera o vídeo inteiro no fim do build (a voz mantém o tom).
const SPEED = 1.1;
