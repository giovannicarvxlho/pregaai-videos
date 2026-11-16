# Revisão NVI, rodada 1: tentações de Jesus

Data: 2026-11-16. Revisor independente (não escreveu o texto).
Arquivos: `narracao.txt` (41 linhas, 6 partes) e `roteiro.md` (seções "Copy fora do roteiro", abertura escolhida, "Notas" e "Para ler"). Base: `pregaai/assets/bible/nvi.json`, capítulos Mt 3 e 4, Mc 1, Lc 4, Dt 1, 6, 8 e 10, Sl 91, Hb 2, 3 e 4, Êx 16 e 17, Nm 14.

## Resultado

- **1 ERRO** (corrigir antes de ir ao ar).
- **5 OBSERVAÇÕES.**
- Citações: 13 de 13 idênticas à NVI, em comparação exata (com maiúsculas, aspas internas ‘ ’, vírgulas e espaços), feita com script próprio, sem usar o `conferir.py`.
- O "Para ler" do `roteiro.md` é idêntico ao `narracao.txt`, parte por parte.

## Conferência das citações

| Linha | Citação (início) | NVI | Resultado |
|---|---|---|---|
| 2 | "Este é o meu Filho amado, em quem me agrado" | Mt 3:17 | idêntica |
| 3 | "Se você é o Filho de Deus" | Mt 4:3 | idêntica |
| 10 | "teve fome" | Mt 4:2 | idêntica |
| 11 | "Se você é o Filho de Deus, mande que estas pedras…" | Mt 4:3 | idêntica |
| 12 | "Está escrito: ‘Nem só de pão…’" | Mt 4:4 | idêntica |
| 17 | "Se você é o Filho de Deus, jogue-se… ‘Ele dará ordens…’" | Mt 4:6 | idêntica |
| 19 | "Também está escrito: ‘Não ponha à prova…’" | Mt 4:7 | idêntica |
| 23 | "Tudo isto lhe darei…" | Mt 4:9 | idêntica |
| 25 | "Retire-se, Satanás! Pois está escrito: ‘Adore…’" | Mt 4:10 | idêntica |
| 26 | "Então o diabo o deixou, e anjos vieram e o serviram" | Mt 4:11 | idêntica |
| 32 | "os conduziu por todo o caminho no deserto…" | Dt 8:2 | idêntica |
| 38 | "como nós, passou por todo tipo de tentação, porém, sem pecado" | Hb 4:15 | idêntica |
| 39 | "ele é capaz de socorrer aqueles que também estão sendo tentados" | Hb 2:18 | idêntica |

Fontes do Antigo Testamento das citações dentro das citações (busca na NVI inteira): "Nem só de pão" só aparece em Dt 8:3; "Não ponham à prova o Senhor, o seu Deus" em Dt 6:16; "só a ele prestem culto" em Dt 6:13; "a seus anjos ele dará ordens" em Sl 91:11-12.

## ERRO

### E1. Linha 9: "A primeira tentação veio depois de quarenta dias e quarenta noites sem comer."

- **O que está errado:** a frase, sem atribuição, afirma que nenhuma tentação aconteceu antes do 40º dia. Mateus permite essa leitura (Mt 4:2-3: jejuou 40 dias, teve fome, "o tentador aproximou-se"), mas Marcos e Lucas dizem que ele foi tentado durante os 40 dias: "Ali esteve quarenta dias, sendo tentado por Satanás" (Mc 1:13); "durante quarenta dias, foi tentado pelo diabo" (Lc 4:2). O próprio vídeo diz isso na linha 34 ("Quarenta dias de Jesus no deserto, sendo tentado"), que é quase a frase de Mc 1:13. Assim, o vídeo se contradiz: na parte 2, a primeira tentação vem no fim dos 40 dias; na parte 5, ele passou os 40 dias sendo tentado. A nota do roteiro diz que "o vídeo não menciona Lucas", mas a linha 34 depende de Marcos e Lucas, não de Mateus.
- **Versículos:** Mt 4:1-3; Mc 1:13; Lc 4:2-3.
- **Correção sugerida (troca de duas palavras):** "A primeira das três veio depois de quarenta dias e quarenta noites sem comer." As três tentações narradas vêm no fim dos 40 dias nos dois evangelhos (Lc 4:2-3: "ao fim deles, teve fome. O diabo lhe disse…"), e a linha 34 fica coerente. Outra opção: "A primeira que Mateus conta veio depois…", mas aí "Mateus" se repete na linha seguinte.

## OBSERVAÇÕES

### O1. Linha 5: "Foram três tentações, e Jesus respondeu as três do mesmo jeito." (e o título "As 3 tentações de Jesus")

- **Risco:** pelo mesmo motivo do E1, "foram três" afirma o total. Mc 1:13 e Lc 4:2 falam de 40 dias de tentação; os evangelhos narram três. O nome "as três tentações" é o usual e o título pode ficar.
- **Sugestão:** na fala, "Mateus conta três tentações, e Jesus respondeu as três do mesmo jeito." Com o E1 corrigido, a frase atual passa como leitura comum.

### O2. Linha 2: "Mateus conta que foi logo depois do batismo…"

- **Risco:** Mateus diz "Então" (Mt 4:1), logo depois do batismo (Mt 3:16-17). Quem diz "Logo após" é Marcos (Mc 1:12: "Logo após, o Espírito o impeliu para o deserto"). O fato está na NVI, mas a palavra "logo" é de Marcos, não de Mateus. Risco baixo, porque em Mateus o "Então" vem logo depois do batismo.
- **Sugestão:** manter, ou "Mateus conta que foi depois do batismo, quando…". Não afeta a voz do céu, que está certa (Mt 3:17, na 3ª pessoa: "Este é…"; Mc 1:11 diz "Tu és").

### O3. Linha 38: "Hebreus dá a resposta: ele, 'como nós, passou por todo tipo de tentação, porém, sem pecado'."

- **Risco:** Hebreus não fala do deserto nem do Espírito levando Jesus. Hb 4:15 afirma que ele foi tentado como nós e Hb 2:18 diz o que resulta disso ("tendo em vista o que ele mesmo sofreu quando tentado, ele é capaz de socorrer…"). O "para quê" explícito está em Hb 2:17 ("era necessário que ele se tornasse semelhante a seus irmãos em todos os aspectos, para se tornar sumo sacerdote misericordioso e fiel"). Aplicar isso ao deserto é inferência legítima, mas "a resposta", com artigo definido, apresenta a inferência como se Hebreus respondesse à pergunta do gancho.
- **Sugestão:** "Hebreus dá uma resposta:" (troca de uma palavra). A linha 39 ("por ter sido tentado") é paráfrase fiel de Hb 2:18.

### O4. Linha 30: "As três respostas de Jesus vêm do mesmo livro: Deuteronômio." (e a 1ª linha da legenda: "As 3 respostas de Jesus ao diabo saíram do mesmo livro da Bíblia.")

- **Conferido e correto:** Dt 8:3, Dt 6:16 e Dt 6:13. Mateus não diz o livro ("Está escrito"), mas a comparação na NVI sustenta a afirmação, e a legenda promete exatamente o que a parte 5 entrega.
- **Risco de comentário:** em Dt 6:13, a NVI diz "Temam o Senhor, o seu Deus, e só a ele prestem culto", e Jesus diz "Adore". Quem abrir Deuteronômio vai achar "Temam". "Retire-se, Satanás!" não vem de Deuteronômio: as "três respostas" são as três citações.
- **Sugestão:** manter a frase e pôr as referências (Dt 8:3; 6:16; 6:13) na "Base bíblica" da descrição ou na resposta ao primeiro comentário, para quem quiser conferir.

### O5. Linha 6: "No fim, esse jeito explica o deserto." e linhas 33 a 35 ("Quarenta anos de Israel… Quarenta dias de Jesus…")

- **Risco:** a ligação entre os 40 anos de Israel e os 40 dias de Jesus é uma leitura do narrador, uma tipologia. Mateus não a afirma. Os fatos usados estão na NVI (Dt 1:1-3; Dt 8:2; Mt 4:1-2), e o texto atual põe os dois lado a lado sem dizer que "Mateus mostra" ou "a Bíblia diz" que um repete o outro. Está dentro do limite e deve continuar assim. Há também uma questão de coerência da promessa: a linha 6 diz que "esse jeito explica o deserto", e a linha 38 diz que "Hebreus dá a resposta". São duas explicações; com a troca do O3 ("uma resposta"), as duas convivem melhor.
- **Sugestão:** manter. Não acrescentar frase que atribua o paralelo ao texto bíblico.

## Afirmações conferidas sem achado

- L1 e L37, o Espírito levou Jesus ao deserto para ser tentado: Mt 4:1.
- L3 e L4, a primeira frase do diabo começa com o que a voz tinha dito: Mt 3:17 ("meu Filho") e Mt 4:3 ("Se você é o Filho de Deus"). É também a primeira fala dele em Lc 4:3. A frase descreve o texto e não afirma intenção do diabo.
- L5, Jesus respondeu as três do mesmo jeito: "Está escrito" / "Também está escrito" / "Pois está escrito" (Mt 4:4, 7, 10).
- L9 e L10, "sem comer" e "teve fome": Mt 4:2 (jejuar) e Lc 4:2 ("Não comeu nada").
- L15, L22 e L24, a cidade santa, a parte mais alta do templo, o monte muito alto e todos os reinos do mundo: Mt 4:5 e 4:8. "O mundo inteiro" (L24) resume "todos os reinos do mundo e o seu esplendor" sem exagero relevante.
- L16 e L18, o diabo citou as Escrituras, e era o Salmo 91: Sl 91:11-12 na NVI. O diabo omite "para que o protejam em todos os seus caminhos".
- L27, "Ele não pulou. E no fim, os anjos vieram": Jesus recusa (Mt 4:7), o diabo o leva a outro lugar (Mt 4:8), e "anjos vieram e o serviram" (Mt 4:11). A frase não diz que vieram para segurá-lo; está certa.
- A ordem pão, templo e reinos é a de Mateus; Lucas troca a 2ª e a 3ª (Lc 4:5-12). A nota do roteiro está correta.
- L31, palavras de Moisés a Israel, no deserto, no quadragésimo ano: Dt 1:1 e 1:3. As três citações estão nesse discurso (Dt 6:1; 8:1).
- L32, "logo antes da frase do pão": Dt 8:2 vem imediatamente antes de Dt 8:3.
- L33, Israel 40 anos no deserto sendo provado: Dt 8:2 ("pô-los à prova").
- L40, "sabe socorrer": paráfrase de Hb 2:18 ("é capaz de socorrer"), aplicada em tom pastoral. Não é citação.

## Copy fora do roteiro

- **Texto do 1º quadro**, "Por que o Espírito levou Jesus para ser *tentado*?": sustentado por Mt 4:1, e o vídeo responde. Sem achado.
- **Título**, "As 3 tentações de Jesus: por que o Espírito o levou ao deserto?": o vídeo entrega as três e uma resposta. Sobre "3 tentações", ver O1 (nome usual, pode ficar).
- **1ª linha da legenda**, "As 3 respostas de Jesus ao diabo saíram do mesmo livro da Bíblia.": correta e paga na parte 5. Ver O4.
- **Capa**, "JESUS TENTADO. POR QUÊ?", com Jesus de costas, sozinho no deserto, e o monte ao fundo: promete só o que o vídeo mostra (Mt 4:1 e 4:8). Sem achado.
