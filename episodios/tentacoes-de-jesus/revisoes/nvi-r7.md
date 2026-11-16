# Revisão de fidelidade NVI, rodada 7: tentacoes-de-jesus

Data: 2026-11-16. Revisor independente: não escreveu o texto, não leu `revisoes/` nem a seção "Revisões" do roteiro.md e não rodou o `conferir.py`.
Escopo: `narracao.txt` inteiro; no `roteiro.md`, "Copy fora do roteiro", a abertura "Escolhida", "Notas" e "Para ler". Fonte: `pregaai/assets/bible/nvi.json`, conferido com script próprio (comparação exata de substring, aspas internas ‘ ’ incluídas).

## Resultado

- **1 ERRO** (nas Notas, no comentário fixado do canal). A narração não tem erro.
- **8 OBSERVAÇÕES.**
- As 28 citações entre aspas duplas (17 na narração, 11 nas Notas) são trechos contínuos e idênticos ao versículo da NVI. A única ressalva é de caixa: "logo" (Mc 1:12 traz "Logo").
- O "Para ler" é idêntico ao `narracao.txt` nas 6 partes (comparação exata, parte por parte).
- Título, 1ª linha da legenda, texto do 1º quadro e capa prometem o que o vídeo entrega.

## Citações

| Citação (início) | Versículo NVI | Resultado |
|---|---|---|
| "Este é o meu Filho amado, em quem me agrado" | Mt 3:17 | idêntica |
| "Se você é o Filho de Deus" (2x) | Mt 4:3 e 4:6 | idêntica |
| "teve fome" | Mt 4:2 | idêntica |
| "Se você é o Filho de Deus, mande que estas pedras…" | Mt 4:3 | idêntica |
| "Está escrito: ‘Nem só de pão…boca de Deus’" | Mt 4:4 | idêntica |
| "Se você é o Filho de Deus, jogue-se daqui para baixo" | Mt 4:6 | idêntica |
| "ordens a seus anjos a seu respeito" | Mt 4:6 | idêntica em Mt 4:6; não em Sl 91:11 (ver O2) |
| "Também está escrito: ‘Não ponha à prova…’" | Mt 4:7 | idêntica |
| "Tudo isto lhe darei, se você se prostrar e me adorar" | Mt 4:9 | idêntica |
| "Retire-se, Satanás! Pois está escrito: ‘Adore…’" | Mt 4:10 | idêntica |
| "Então o diabo o deixou, e anjos vieram e o serviram" | Mt 4:11 | idêntica |
| "os conduziu por todo o caminho no deserto…pô-los à prova" | Dt 8:2 | idêntica |
| "era necessário que ele se tornasse semelhante…" | Hb 2:17 | idêntica |
| "como nós, passou por todo tipo de tentação, porém, sem pecado" | Hb 4:15 | idêntica |
| "ele é capaz de socorrer aqueles que também estão sendo tentados" | Hb 2:18 | idêntica |
| "Jesus, o Filho de Deus" | Hb 4:14 | idêntica |
| Notas: "logo" / "sendo tentado" | Mc 1:12 / Mc 1:13 | "Logo" com maiúscula (ver O7) / idêntica |
| Notas: "Temam" / "Adore" | Dt 6:13 / Mt 4:10 | idênticas |
| Notas: "Deus não pode ser tentado pelo mal, e a ninguém tenta" | Tg 1:13 | idêntica |
| Notas: "aproximemo-nos do trono da graça…necessidade" | Hb 4:16 | idêntica |
| Notas: "em alta voz e com lágrimas" | Hb 5:7 | idêntica |
| Notas: "Meu Deus! Meu Deus! Por que me abandonaste?" | Mt 27:46 | idêntica |
| Notas: "não seja como eu quero, mas sim como tu queres" | Mt 26:39 | idêntica |
| Notas: "Creio, ajuda-me a vencer a minha incredulidade!" | Mc 9:24 | idêntica |
| Notas: "Dá-nos hoje o nosso pão de cada dia" | Mt 6:11 | idêntica |

## Erros

### E1. Comentário fixado: definição de "pôr Deus à prova" mais absoluta que a Bíblia

- **Frase (Notas, "Comentário do canal no lançamento"):** "clamar a Deus na dor, perguntar por quê ou dizer que tem dúvida não é pôr Deus à prova; pôr à prova é exigir que ele prove que está com você, como em Massá (Êxodo 17:7)."
- **Problema:** a NVI não diz isso, e do jeito que está escrita a frase é refutável com versículos que as próprias Notas listam:
  - Números 21:5 conta que o povo "falou contra Deus e contra Moisés, dizendo: "Por que vocês nos tiraram do Egito para morrermos no deserto?"", e 1 Coríntios 10:9 (listado no "Paralelo com Israel") chama esse episódio de pôr o Senhor à prova: "Não devemos pôr o Senhor à prova, como alguns deles fizeram — e foram mortos por serpentes". Perguntar "por quê" em tom de acusação foi pôr à prova.
  - Salmo 78:18-19 junta as duas coisas: "puseram Deus à prova, exigindo o que desejavam comer. Duvidaram de Deus, dizendo: "Poderá Deus preparar uma mesa no deserto?"".
  - Em Massá também houve "por que" (Êx 17:3, "Por que você nos tirou do Egito?").
  - A definição "pôr à prova é exigir que ele prove que está com você" é mais estreita que o uso bíblico (1Co 10:9 / Nm 21:5 é queixa contra Deus, não pedido de prova de presença).
  - O ponto pastoral está certo: lamento e dúvida confessada (Hb 5:7, Mt 27:46, Mc 9:24) não são o que o povo fez em Massá. O que precisa mudar é a forma, que hoje é uma regra absoluta. O comentário vai ao ar fixado, onde alguém pode contestar citando 1Co 10:9.
- **Correção (ancorar nos exemplos em vez de definir):** "Clamar a Deus na dor não é o que o povo fez em Massá. O próprio Jesus orou "em alta voz e com lágrimas" (Hebreus 5:7) e disse na cruz "Meu Deus! Meu Deus! Por que me abandonaste?" (Mateus 27:46). O pai do menino disse "Creio, ajuda-me a vencer a minha incredulidade!" (Marcos 9:24), e Jesus o atendeu. Em Massá, o povo exigiu e disse: "O Senhor está entre nós, ou não?" (Êxodo 17:7)." Todas as aspas conferidas: Hb 5:7, Mt 27:46, Mc 9:24 e Êx 17:7, idênticas.

## Observações

### O1. Paralelo Israel–Jesus: as referências das Notas não ligam Jesus a Israel
- **Frases (narração):** "Quarenta anos de Israel no deserto, provado por Deus." / "Quarenta dias de Jesus no deserto: levado pelo Espírito, tentado pelo diabo." / "Onde o povo caiu, Jesus ficou de pé."
- **Avaliação:** a narração não ultrapassa o texto. Ela justapõe, sem dizer que Mateus traça o paralelo. Os fatos de Israel conferem: Êx 16:2-3 (reclamação da fome), Êx 17:7 ("puseram o Senhor à prova"), Êx 32:4 e 32:8 (bezerro de ouro, "curvaram-se diante dele"). Também confere "palavras daquele mesmo deserto": Dt 1:1 diz que as palavras foram ditas "no deserto, a leste do Jordão".
- **Risco:** as referências de "Paralelo com Israel" (1Co 10:6-13, Hb 3:8-9 e 3:17, Dt 9:12-16, Nm 14:34) documentam só o lado de Israel. Se alguém perguntar "onde a Bíblia liga Jesus a Israel?", não há resposta pronta.
- **Sugestão:** acrescentar Dt 8:5 ("assim como um homem disciplina o seu filho, da mesma forma o Senhor, o seu Deus, os disciplina"), Êx 4:22 ("Israel é o meu primeiro filho") e Mt 2:15 ("Do Egito chamei o meu filho", citando Os 11:1). É Mateus aplicando a Jesus uma frase sobre Israel. Todas conferidas na NVI.

### O2. "ordens a seus anjos a seu respeito" é a redação de Mt 4:6, não a de Sl 91:11
- **Frase:** "E citou o Salmo 91: Deus daria "ordens a seus anjos a seu respeito", e eles o segurariam."
- **Avaliação:** a paráfrase é fiel à fala do diabo em Mt 4:6. O "Ele" de Sl 91:11 é o Altíssimo (Sl 91:9), então "Deus daria" está certo, e "eles o segurariam" está em Mt 4:6 e Sl 91:12. Mas a citação vem logo depois de "Salmo 91", e na NVI o salmo diz "a seus anjos ele dará ordens a seu respeito". As Notas já mandam pôr Mt 4:6 na tela. Manter. Se a descrição ou um comentário citar o salmo, usar o texto de Sl 91:11.

### O3. Mt 4:10 "Adore" contra Dt 6:13 "Temam": deixar a resposta pronta
- **Frases:** "As três respostas de Jesus vêm do mesmo livro: Deuteronômio." e, na legenda, "As 3 respostas de Jesus ao diabo saíram do mesmo livro da Bíblia."
- **Avaliação:** correto. Mt 4:4 = Dt 8:3, Mt 4:7 = Dt 6:16, Mt 4:10 = Dt 6:13 (e Dt 10:20).
- **Risco:** quem abrir Dt 6:13 na NVI lê "Temam o Senhor, o seu Deus, e só a ele prestem culto", não "Adore". As Notas registram a diferença, mas ela não está entre as "Respostas prontas para comentários". Sugestão: incluir uma resposta curta ("Jesus cita Dt 6:13; a NVI traduz o hebraico 'Temam', e Mateus registra 'Adore'; a frase 'só a ele preste culto' é a mesma").

### O4. "sem nenhum se" pode ser lido como "o diabo duvidava"
- **Frase:** "O diabo começou com "Se você é o Filho de Deus". Hebreus diz, sem nenhum se: "Jesus, o Filho de Deus"."
- **Avaliação:** a frase contrasta só a redação, e isso está no texto (Mt 4:3 tem "Se"; Hb 4:14 não). As Notas proíbem dizer que o diabo duvidava, e a narração não diz. Alguém pode inferir a dúvida; nas respostas, não ir além de "o texto não diz o que ele pensava". Assim como está, a linha da narração pode ficar.

### O5. Hebreus citado fora de ordem, ligado por "por isso"
- **Frases:** a sequência Hb 2:17, depois Hb 4:15, depois "E que, por isso," Hb 2:18, depois Hb 4:14.
- **Avaliação:** "por isso" liga 4:15 a 2:18. Em Hebreus, a causa de 2:18 é "o que ele mesmo sofreu quando tentado", o que é compatível com "passou por todo tipo de tentação". Não é erro. "Hebreus não conta essa cena" confere: o livro inteiro só fala do deserto de Israel (Hb 3:8-17) e do diabo em 2:14. Sugestão de produção: cada linha leva a própria referência na tela (Hb 2:17, Hb 4:15, Hb 2:18, Hb 4:14), para não parecer um trecho contínuo.

### O6. Resposta "Quem orou e não foi atendido": não dizer que Jesus não foi ouvido
- **Frase (Notas):** "Quem orou e não foi atendido: no Getsêmani, Jesus orou "não seja como eu quero, mas sim como tu queres" (Mateus 26:39)."
- **Avaliação:** a citação e o lugar estão certos (Getsêmani, Mt 26:36). A resposta não afirma que Jesus deixou de ser atendido, e não deve passar a afirmar: Hb 5:7, citado no comentário fixado, diz que ele foi "sendo ouvido por causa da sua reverente submissão".

### O7. Notas: "logo" e "sendo tentado" atribuídos a Marcos e Lucas juntos
- **Frase (Notas):** "Marcos 1:12-13 e Lucas 4:1-13 (o "logo" e os 40 dias "sendo tentado")".
- **Avaliação:** as duas palavras são de Marcos. Mc 1:12 traz "Logo após", com maiúscula, então a comparação exata só passa sem diferenciar caixa. Mc 1:13 traz "sendo tentado". Lucas 4:2 diz "foi tentado" e não tem "logo". Sugestão: "Marcos 1:12-13 (o "Logo após" e os 40 dias "sendo tentado") e Lucas 4:1-13".

### O8. A linha de referências do título do roteiro omite Deuteronômio 6
- **Frase (H1 do roteiro.md):** "(Mateus 4:1-11; Deuteronômio 8; Hebreus 2 e 4)".
- **Avaliação:** duas das três respostas vêm de Dt 6 (6:16 e 6:13). O título publicado não traz essa linha, então não é erro. Se ela for para a descrição, usar "Deuteronômio 6 e 8".

## Conferido sem achado

- **Ordem dos fatos:** batismo e voz (Mt 3:16-17), depois "Então" o deserto (Mt 4:1; "Logo após" em Mc 1:12), 40 dias, fome, pão (4:2-4), templo (4:5-7), monte (4:8-10) e anjos (4:11). "Primeiras palavras do diabo em Mateus" confere: o diabo não aparece em Mateus antes de 4:1, e 4:3 é a primeira fala. "Respondeu às três do mesmo jeito" confere com "Está escrito" em 4:4, 4:7 e 4:10.
- **"Pular seria cobrar de Deus uma prova de que estava com ele":** inferência apoiada em Dt 6:16 ("como fizeram em Massá") e Êx 17:7 ("O Senhor está entre nós, ou não?").
- **"Logo antes da frase do pão, Moisés lembra…":** Dt 8:2 vem imediatamente antes de Dt 8:3. O orador é Moisés (Dt 1:1 e 1:5).
- **"provado por Deus" contra "tentado pelo diabo":** a narração não confunde as duas coisas, o que bate com Dt 8:2 e com Tg 1:13, que está na descrição.
- **Pergunta final:** retoma as três formulações já feitas no vídeo ("pôs a palavra de Deus na frente do pão", "cobrar de Deus uma prova", "Todo esse poder, em troca de uma adoração"). Não acrescenta afirmação nova.
- **Copy:** o 1º quadro e a capa repetem a pergunta de Mt 4:1. O título é respondido na parte 6, com a ressalva honesta "Hebreus não conta essa cena". A 1ª linha da legenda é entregue em "As três respostas de Jesus vêm do mesmo livro: Deuteronômio".
- **Notas, demais referências:** Mt 3:16-17, Sl 91:11-12, Dt 8:2-3, Dt 6:13 e 6:16, Êx 16:2-3, 17:7 e 32:8, Hb 2:17-18, 4:14-15, Lc 4 com a ordem trocada (reinos em 4:5, templo em 4:9) e a harmonização dos 40 dias (Mt 4:2, Mc 1:13, Lc 4:2-3). Todas dizem o que as Notas afirmam.
