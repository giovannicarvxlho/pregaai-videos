# Revisão de fidelidade NVI — rodada 9 (revisor independente)

Data: 2026-11-16. Escopo: `narracao.txt` inteiro; no `roteiro.md`, só "Copy fora do roteiro", a abertura "Escolhida", "Notas" e "Para ler". Não li a pasta `revisoes/` nem a seção "Revisões" e não rodei o `conferir.py`. Bíblia: `pregaai/assets/bible/nvi.json`.

## Resultado

**0 ERROS, 6 OBSERVAÇÕES.** Pela fidelidade à NVI, o episódio pode ir ao ar como está. As observações são riscos de leitura e ajustes opcionais.

Método: um script próprio extrai todo trecho entre aspas duplas (`"..."` e `“...”`) da narração, das Notas e da Copy e testa se ele é substring exata do versículo (as aspas internas ‘ ’ contam). Os textos sem aspas foram lidos contra os versículos e os livros citados (busca em Mateus inteiro e em Hebreus inteiro). O "Para ler" foi comparado bloco a bloco com o `narracao.txt` juntando as linhas.

## Citações (comparação exata)

| Trecho (início) | Versículo NVI | Confere |
|---|---|---|
| "Este é o meu Filho amado, em quem me agrado" | Mt 3:17 | sim |
| "Se você é o Filho de Deus" (2x) | Mt 4:3 | sim |
| "teve fome" | Mt 4:2 | sim |
| "Se você é o Filho de Deus, mande que estas pedras…" | Mt 4:3 | sim |
| "Está escrito: ‘Nem só de pão viverá o homem…’" | Mt 4:4 | sim |
| "Se você é o Filho de Deus, jogue-se daqui para baixo" | Mt 4:6 | sim |
| "ordens a seus anjos a seu respeito" | Mt 4:6 (não Sl 91:11, ver O1) | sim em Mt 4:6 |
| "Também está escrito: ‘Não ponha à prova…’" | Mt 4:7 | sim |
| "Tudo isto lhe darei, se você se prostrar e me adorar" | Mt 4:9 | sim |
| "Retire-se, Satanás! Pois está escrito: ‘Adore…’" | Mt 4:10 | sim |
| "Então o diabo o deixou, e anjos vieram e o serviram" | Mt 4:11 | sim |
| "os conduziu por todo o caminho no deserto…" | Dt 8:2 | sim |
| "era necessário que ele se tornasse semelhante…" | Hb 2:17 | sim |
| "como nós, passou por todo tipo de tentação, porém, sem pecado" | Hb 4:15 | sim |
| "ele é capaz de socorrer aqueles que também estão sendo tentados" | Hb 2:18 | sim |
| "Jesus, o Filho de Deus" | Hb 4:14 | sim |
| Notas: "Logo após" / "sendo tentado" | Mc 1:12 / 1:13 | sim |
| Notas: "Temam" / "Adore" | Dt 6:13 / Mt 4:10 | sim |
| Notas: "aproximemo-nos do trono da graça…" | Hb 4:16 | sim |
| Notas: "em alta voz e com lágrimas" | Hb 5:7 | sim |
| Notas: "Meu Deus! Meu Deus! Por que me abandonaste?" | Mt 27:46 (= Sl 22:1) | sim |
| Notas: "Creio, ajuda-me a vencer a minha incredulidade!" | Mc 9:24 | sim |
| Notas: "Dá-nos hoje o nosso pão de cada dia" | Mt 6:11 | sim |

As aspas da Copy (título, legenda, 1º quadro, capa) são texto do canal, não citação.

## Conferido sem achado (afirmações que não são citação)

- "logo depois do batismo": Mt 4:1 ("Então"), Mc 1:12 ("Logo após").
- "primeiras palavras do diabo em Mateus": em Mateus inteiro o diabo não fala antes de 4:3.
- "Mateus conta três tentações… do mesmo jeito": as três respostas abrem com "está escrito" (4:4, 4:7, 4:10).
- "quarenta dias e quarenta noites sem comer": Mt 4:2 diz "jejuar"; "sem comer" está em Lc 4:2 ("Não comeu nada"), que está na base das Notas.
- Ordem dos fatos: pão, templo, reinos, como em Mt 4:3-10; o diabo sai e os anjos vêm depois (4:11).
- "Pular seria cobrar de Deus uma prova de que estava com ele": Dt 6:16 remete a Massá, e em Êx 17:7 a prova foi "O Senhor está entre nós, ou não?". A inferência tem base.
- "As três respostas… vêm do mesmo livro: Deuteronômio": Dt 8:3, 6:16 e 6:13.
- "Logo antes da frase do pão, Moisés lembra…": Dt 8:2 vem antes de 8:3, e o discurso é de Moisés (Dt 5:1).
- Paralelo com Israel: fome e queixa "do Senhor" (Êx 16:3, 8; Dt 8:3), prova (Êx 17:2, 7), curvar-se diante do bezerro (Êx 32:8; ouro em 32:2-4, 31), na mesma ordem das três tentações e na ordem cronológica de Êxodo. "Palavras daquele mesmo deserto": Dt 1:1 ("no deserto") e 1:3 (no quadragésimo ano). "Onde o povo caiu, Jesus ficou de pé" é inferência, sem atribuir a frase a nenhum livro.
- "Hebreus não conta essa cena": confirmado; em Hebreus, "deserto" aparece só para Israel (3:8, 3:17) e para os heróis da fé (11:38).
- "Hebreus diz, sem nenhum se: 'Jesus, o Filho de Deus'": Hb 4:14, sem condição.
- O "por isso" antes de Hb 2:18 casa com o "Porque, tendo em vista o que ele mesmo sofreu quando tentado" do próprio versículo.
- Referências das Notas: Êx 16:2-3, 8; 17:7; 32:2-8; Dt 9:12-16 (bezerro); Nm 14:34 (40 anos); 1Co 10:6-13; Hb 3:8-9 e 3:17; Lc 4:2-3 (tentado durante os 40 dias e, ao fim, com fome); Lc 4:5-12 (reinos antes do templo). A afirmação de que as três respostas de Mateus diferem um pouco de Deuteronômio também confere: "boca do Senhor" em Dt 8:3, "ponham" em Dt 6:16, "Temam… prestem" em Dt 6:13. A nota de produção (a ordem das palavras citadas é a de Mateus) confere com Sl 91:11.

## Copy (item 3) e "Para ler" (item 4)

- O 1º quadro ("Por que o Espírito levou Jesus para ser tentado pelo diabo?"), o título ("As 3 tentações de Jesus: por que o Espírito o levou ao deserto?"), a 1ª linha da legenda ("As 3 respostas de Jesus ao diabo saíram do mesmo livro da Bíblia.") e a capa ("JESUS TENTADO. POR QUÊ?") prometem o que o vídeo entrega: as três tentações, uma resposta ao "por quê" (paralelo com Israel e Hebreus, com a ressalva honesta "Hebreus não conta essa cena") e o livro comum (Deuteronômio).
- O "Para ler" é idêntico ao `narracao.txt` nos 6 blocos (comparação exata, linhas juntadas com espaço).

## Observações

**O1. A citação do Salmo 91 está na ordem de Mateus, não na do Salmo.**
- Frase: `E citou o Salmo 91: Deus daria "ordens a seus anjos a seu respeito", e eles o segurariam.`
- Problema: a frase indica o Salmo 91, mas o trecho entre aspas só existe contínuo em Mt 4:6 ("Ele dará ordens a seus anjos a seu respeito"). O Sl 91:11 diz "a seus anjos ele dará ordens a seu respeito". O sentido é o mesmo e as palavras saíram da boca do diabo em Mateus, então não é erro. Ainda assim, quem abrir o Salmo 91 não acha a sequência, e no "Para ler" e em qualquer legenda escrita a referência mais próxima das aspas é "Salmo 91".
- Correção sugerida: manter a nota de produção (na tela, Mateus 4:6). Se quiser eliminar o risco no texto, tire as aspas e deixe paráfrase pura: `E citou o Salmo 91: Deus daria ordens a seus anjos a seu respeito, e eles o segurariam.` Na descrição, escreva "Mateus 4:6 (citando o Salmo 91:11-12)".

**O2. O comentário fixado não diz o que tem a ver com este vídeo.**
- Frase (Notas): `na dor, Jesus também orou "em alta voz e com lágrimas" (Hebreus 5:7) e bradou na cruz, com as palavras do Salmo 22, "Meu Deus! Meu Deus! Por que me abandonaste?" (Mateus 27:46). E, quando um pai disse "Creio, ajuda-me a vencer a minha incredulidade!", Jesus o atendeu (Marcos 9:24-27).`
- Problema: as citações e as referências estão certas. O texto parece servir de proteção para quem ouvir "cobrar de Deus uma prova" e achar que clamar na dor é pecado, mas não diz isso. Fixado num vídeo sobre tentação, sem ponte, ele parece trazido do episódio do Salmo 22, e o "também" fica sem referente.
- Correção sugerida: uma frase de ligação narrativa, sem definição nem regra, por exemplo: `No templo, Jesus não pulou para cobrar uma prova. Mas, na dor, ele também orou...`.

**O3. "Poder" é leitura; Mateus diz "reinos" e "esplendor".**
- Frases: `Todo esse poder, em troca de uma adoração.` e `ou trocar a adoração por poder?`
- Problema: Mt 4:8-9 fala de "todos os reinos do mundo e o seu esplendor". "Poder" é uma leitura razoável (Lc 4:6 diz "toda a autoridade"), mas o vídeo não menciona Lucas.
- Correção: opcional. A versão literal seria `Todos esses reinos, em troca de uma adoração.` Como está, passa.

**O4. "Vêm do mesmo livro" convida a conferir, e a redação muda.**
- Frases: `As três respostas de Jesus vêm do mesmo livro: Deuteronômio.` e a 1ª linha da legenda.
- Problema: é verdade, mas quem abrir Dt 6:13 na NVI lê "Temam o Senhor… e só a ele prestem culto", sem "Adore"; Dt 8:3 diz "boca do Senhor" e Dt 6:16 diz "ponham". O comentário "Deuteronômio não diz isso" é previsível.
- Correção: nenhuma no vídeo. Leve para as respostas prontas das Notas a explicação que já está na base bíblica ("em 6:13 a NVI diz 'Temam' e Mateus 4:10 cita 'Adore'").

**O5. A resposta de Hebreus é aplicação, e o "deserto" do espectador é mais amplo que "tentados".**
- Frases: `Hebreus não conta essa cena, mas diz que "era necessário que ele se tornasse semelhante a seus irmãos em todos os aspectos".` e `Ele passou pelo deserto antes de você. E sabe socorrer quem está no seu.`
- Problema: em Hb 2:17 a necessidade tem finalidade própria ("para se tornar sumo sacerdote misericordioso e fiel… e fazer propiciação"), cortada no vídeo. "Quem está no seu [deserto]" pode ser ouvido como qualquer sofrimento, e Hb 2:18 fala de "tentados". O vídeo marca que Hebreus não conta a cena, Hb 4:15-16 ("fraquezas", "necessidade") cobre o sentido amplo e a descrição traz Hb 2:17-18 inteiros. O risco é baixo.
- Correção: nenhuma obrigatória. Manter Hb 2:17-18 inteiros na descrição, como as Notas já pedem.

**O6. "E no fim, os anjos vieram" sugere um vínculo que Mateus não faz.**
- Frase: `No templo, o diabo falou de anjos pra ele pular. Ele não pulou. E no fim, os anjos vieram.`
- Problema: cada frase é verdadeira (Mt 4:6 e 4:11). A justaposição, com o artigo "os", pode ser ouvida como "os mesmos anjos prometidos vieram como recompensa"; Mt 4:11 diz só que "anjos vieram e o serviram". É ironia narrativa, não afirmação.
- Correção: opcional. `E no fim, anjos vieram e o serviram.` deixa a frase no texto.
