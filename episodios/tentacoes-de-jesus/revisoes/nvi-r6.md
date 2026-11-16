# Revisão de fidelidade NVI, rodada 6: As 3 tentações de Jesus

Data: 2026-11-16. Revisor independente; não li `revisoes/` nem a seção "Revisões" do roteiro.
Arquivos: `narracao.txt` (inteiro), `roteiro.md` (Copy fora do roteiro, abertura Escolhida, Notas, Para ler).
Fonte: `/home/user/pregaai/assets/bible/nvi.json`, comparação exata por script próprio (substring contínua; aspas internas ‘ ’ incluídas).

## Resultado

**2 ERROS, 6 OBSERVAÇÕES.**

- A narração está limpa: as 17 citações são idênticas à NVI e nenhuma afirmação vai além do texto.
- Os 2 erros estão nas **Notas**, nas duas frases entre aspas que vão para a descrição (Tiago 1:13 e 1 Coríntios 10:13). Não são texto da NVI.
- O "Para ler" é idêntico ao `narracao.txt` nas 6 partes (comparação exata, parte por parte).
- Título, legenda, 1º quadro e capa prometem só o que o vídeo entrega.

## Citações

### Narração (17)

| Citação | Versículo NVI | Resultado |
|---|---|---|
| "Este é o meu Filho amado, em quem me agrado" | Mt 3:17 | idêntica |
| "Se você é o Filho de Deus" (linha 3) | Mt 4:3 | idêntica |
| "teve fome" | Mt 4:2 | idêntica |
| "Se você é o Filho de Deus, mande que estas pedras se transformem em pães" | Mt 4:3 | idêntica |
| "Está escrito: ‘Nem só de pão viverá o homem, mas de toda palavra que procede da boca de Deus’" | Mt 4:4 | idêntica |
| "Se você é o Filho de Deus, jogue-se daqui para baixo" | Mt 4:6 | idêntica |
| "ordens a seus anjos a seu respeito" | Mt 4:6 (não Sl 91:11; ver O3) | idêntica |
| "Também está escrito: ‘Não ponha à prova o Senhor, o seu Deus’" | Mt 4:7 | idêntica |
| "Tudo isto lhe darei, se você se prostrar e me adorar" | Mt 4:9 | idêntica |
| "Retire-se, Satanás! Pois está escrito: ‘Adore o Senhor, o seu Deus e só a ele preste culto’" | Mt 4:10 | idêntica |
| "Então o diabo o deixou, e anjos vieram e o serviram" | Mt 4:11 | idêntica |
| "os conduziu por todo o caminho no deserto, durante estes quarenta anos, para humilhá-los e pô-los à prova" | Dt 8:2 | idêntica |
| "era necessário que ele se tornasse semelhante a seus irmãos em todos os aspectos" | Hb 2:17 | idêntica |
| "como nós, passou por todo tipo de tentação, porém, sem pecado" | Hb 4:15 | idêntica |
| "ele é capaz de socorrer aqueles que também estão sendo tentados" | Hb 2:18 | idêntica |
| "Se você é o Filho de Deus" (linha 40) | Mt 4:3 | idêntica |
| "Jesus, o Filho de Deus" | Hb 4:14 | idêntica |

### Notas e abertura

| Citação | Versículo NVI | Resultado |
|---|---|---|
| "aproximemo-nos do trono da graça com toda a confiança, a fim de recebermos misericórdia e encontrarmos graça que nos ajude no momento da necessidade" | Hb 4:16 | idêntica |
| 'em alta voz e com lágrimas' | Hb 5:7 | idêntica |
| "logo" / "sendo tentado" | Mc 1:12 / Mc 1:13 | idênticas (ver O6) |
| "Temam" / "Adore" | Dt 6:13 / Mt 4:10 | idênticas |
| 'Este é o meu Filho amado...' (Escolhida) | Mt 3:17 (início, com reticências) | idêntica |
| **"Deus a ninguém tenta"** | Tg 1:13 | **não está na NVI** (E1) |
| **"Deus é fiel: não permite tentação além do que se pode suportar e dá o escape"** | 1Co 10:13 | **não está na NVI** (E2) |

## ERROS

### E1. Notas, "Produção": "Deus a ninguém tenta" (Tiago 1:13)
- **Problema:** está entre aspas, com referência, e vai para a descrição como citação, mas não é um trecho contínuo da NVI. A NVI diz "Pois Deus não pode ser tentado pelo mal, e a ninguém tenta." Na NVI, "Deus" e "a ninguém tenta" estão separados por "não pode ser tentado pelo mal, e". A forma do roteiro também não é a da ARA ("ele mesmo a ninguém tenta").
- **Versículo:** Tg 1:13.
- **Correção:** usar o trecho exato, "Deus não pode ser tentado pelo mal, e a ninguém tenta" (Tiago 1:13). A outra saída é tirar as aspas e escrever como paráfrase: Deus não tenta ninguém (Tiago 1:13).

### E2. Notas, "Produção": "Deus é fiel: não permite tentação além do que se pode suportar e dá o escape" (1 Coríntios 10:13)
- **Problema:** é uma paráfrase entre aspas, com referência, que seria lida como citação. O conteúdo está certo, mas a NVI diz: "E Deus é fiel; ele não permitirá que vocês sejam tentados além do que podem suportar. Mas, quando forem tentados, ele lhes providenciará um escape, para que o possam suportar." Nenhum trecho de "não permite tentação…" ou de "dá o escape" existe na NVI.
- **Versículo:** 1Co 10:13.
- **Correção:** citar o trecho exato, "E Deus é fiel; ele não permitirá que vocês sejam tentados além do que podem suportar. Mas, quando forem tentados, ele lhes providenciará um escape, para que o possam suportar" (1 Coríntios 10:13). A outra saída é manter a paráfrase sem aspas.
- **Sugestão:** o `conferir.py` deveria passar também nas aspas das Notas que vão para descrição e legenda, não só nas da narração. As duas passaram pelas rodadas anteriores por esse buraco.

## OBSERVAÇÕES

### O1. "E repara nas primeiras palavras do diabo: 'Se você é o Filho de Deus'." (linha 3) e "O diabo começou com 'Se você é o Filho de Deus'." (linha 40)
- **Risco:** Mt 4:3 e Lc 4:3 trazem a primeira fala **registrada**. Mas Mc 1:13 ("Ali esteve quarenta dias, sendo tentado por Satanás") e Lc 4:2 ("durante quarenta dias, foi tentado pelo diabo") dizem que a tentação durou os 40 dias, e o que o diabo falou nesse tempo não está escrito. "As primeiras palavras" e "começou" afirmam, ao pé da letra, um pouco mais do que o texto. O roteiro já tem o cuidado certo na linha 9 ("A primeira das três"); falta o mesmo cuidado aqui.
- **Correção (sugestão):** "E repara na primeira frase do diabo em Mateus" ou "repara como o diabo abre a conversa em Mateus". A outra saída é manter a frase e acrescentar às respostas prontas: "Mateus e Lucas registram essa como a primeira fala; Marcos e Lucas dizem que ele foi tentado durante os 40 dias, e o que foi dito nesse tempo não está escrito."

### O2. "Hebreus diz, sem nenhum se: 'Jesus, o Filho de Deus'." (linha 40)
- **Risco:** o contraste com o "se" do diabo sugere que o diabo pôs a filiação em dúvida. As próprias Notas mandam não dizer que o diabo "duvidava", porque o "se" de Mt 4:3 pode valer "já que". O "Se" está literalmente na NVI, então a frase se defende, mas chama exatamente o comentário que as Notas querem evitar.
- **Correção (sugestão):** manter a frase e ter pronta a resposta: "O vídeo não diz que o diabo duvidava; aponta a forma da frase. O 'se' pode valer 'já que': ele tentou Jesus a usar o que é."

### O3. "E citou o Salmo 91: Deus daria 'ordens a seus anjos a seu respeito', e eles o segurariam." (linha 16)
- **Risco:** a paráfrase é fiel ao que o diabo diz em Mt 4:6. Ela também não afirma que o diabo cortou "em todos os seus caminhos", o que é bom. Mas as palavras entre aspas estão na ordem de Mt 4:6. O Sl 91:11 da NVI diz "a seus anjos ele dará ordens a seu respeito". Quem abrir o Salmo 91 não acha a frase igual.
- **Correção (sugestão):** manter, cumprindo a regra das Notas (na tela, Mt 4:6, nunca Sl 91:11). Se a legenda ou a tela mostrar as aspas junto de "Salmo 91", a referência ao lado tem que ser Mt 4:6.

### O4. "As três respostas de Jesus vêm do mesmo livro: Deuteronômio." (linha 28)
- **Risco:** a afirmação é verdadeira (Dt 8:3; 6:16; 6:13). Mas quem conferir na NVI encontra palavras diferentes nos três: Dt 8:3 "da boca do Senhor" (Mt 4:4 "de Deus"); Dt 6:16 "Não ponham à prova… como fizeram em Massá" (Mt 4:7 "Não ponha"); Dt 6:13 "Temam o Senhor, o seu Deus, e só a ele prestem culto" (Mt 4:10 "Adore"). As Notas cobrem só o 6:13.
- **Correção (sugestão):** ampliar a resposta pronta para os três versículos: "Mateus cita Deuteronômio com as palavras dele; a NVI traduz o Antigo Testamento direto do hebraico, por isso a redação muda e o sentido é o mesmo."

### O5. "No templo, o diabo falou de anjos pra ele pular. Ele não pulou. E no fim, os anjos vieram." (linha 25)
- **Risco:** a sequência está certa (Mt 4:6 e 4:11), mas o encadeamento pode soar como causa ("não pulou, por isso os anjos vieram"). Mateus não dá motivo para a vinda dos anjos. Risco baixo, e a frase é o "momento para mandar".
- **Correção (sugestão):** manter. Na descrição ou na legenda, não escrever "por isso" nem "como recompensa".

### O6. Notas, "Base bíblica": "Marcos 1:12-13 e Lucas 4:1-13 (o 'logo' e os 40 dias 'sendo tentado')"
- **Risco:** as duas palavras entre aspas são de Marcos (1:12 "Logo após"; 1:13 "sendo tentado"). Lucas 4:2 diz "foi tentado". Se a descrição atribuir "sendo tentado" a Lucas, a citação fica errada.
- **Correção (sugestão):** "Marcos 1:12-13 (o 'logo' e os 40 dias 'sendo tentado'); Lucas 4:1-13".

## Conferido e sem achado

- **Ordem dos fatos:** batismo e voz (Mt 3:16-17) → "Então" levado pelo Espírito (4:1) → 40 dias de jejum, fome (4:2) → pão (4:3-4) → templo (4:5-7) → monte (4:8-10) → o diabo sai, anjos servem (4:11). A narração segue a ordem de Mateus e não menciona Lucas (que troca a 2ª e a 3ª).
- **"Foi logo depois do batismo":** Mc 1:12 "Logo após, o Espírito o impeliu para o deserto"; Mt 4:1 "Então"; Lc 4:1 "voltou do Jordão".
- **"Ele começou justo pelo que a voz do céu tinha dito":** é uma inferência pela proximidade de Mt 3:17 e 4:3 ("meu Filho" e "Filho de Deus"). Não diz mais que o texto.
- **"A primeira das três veio depois de quarenta dias e quarenta noites sem comer":** Mt 4:2-3; "sem comer" está em Lc 4:2 ("Não comeu nada").
- **"Pular seria cobrar de Deus uma prova de que estava com ele":** Dt 6:16 ("como fizeram em Massá") e Ex 17:7 ("puseram o Senhor à prova, dizendo: 'O Senhor está entre nós, ou não?'"). É uma inferência bem ancorada.
- **"Todo esse poder, em troca de uma adoração":** Mt 4:8-9 ("todos os reinos do mundo e o seu esplendor"; "se você se prostrar e me adorar"); Lc 4:6 fala em "autoridade". É um resumo fiel.
- **"Logo antes da frase do pão, Moisés lembra…":** Dt 8:2 vem imediatamente antes de Dt 8:3. O orador é Moisés (Dt 1:1; 8:1, "que eu hoje lhes ordeno").
- **"Lá, o povo reclamou da fome, pôs Deus à prova e se curvou diante de um bezerro de ouro":** Ex 16:2-3 ("reclamou… para fazer morrer de fome"), Ex 17:7, Ex 32:2-4 e 32:8 ("curvaram-se diante dele"). Dt 9:16 e 9:22 também trazem o bezerro e Massá. "Bezerro de ouro" não está entre aspas, e o ouro vem de Ex 32:2-4.
- **"Jesus respondeu com as palavras daquele mesmo deserto":** Dt 1:1, "Estas são as palavras ditas por Moisés a todo o Israel no deserto".
- **"Onde o povo caiu, Jesus ficou de pé":** é interpretação, apoiada em Hb 3:17 ("cujos corpos caíram no deserto"), 1Co 10:5-12 ("cuide-se para que não caia") e Hb 4:15 ("sem pecado"). Não afirma que Mateus faz o paralelo.
- **"Hebreus não conta essa cena":** conferi Hebreus 1 a 13 por "deserto", "diabo", "tentação/tentado", "quarenta", "pão", "batismo" e "Espírito". O livro cita o diabo (2:14), a tentação de Jesus em geral (2:18; 4:15) e o deserto de Israel (3:8-9, 17), mas não narra a cena. A afirmação é verdadeira.
- **Fecho com Hebreus:** 2:17, 4:15 e 2:18, apresentados como o que Hebreus "diz", sem afirmar que Hebreus explica a cena. O "por isso" da linha 39 é a lógica do próprio Hb 2:18 ("Porque, tendo em vista o que ele mesmo sofreu quando tentado"). "Jesus, o Filho de Deus" está em Hb 4:14.
- **Pergunta final:** os três termos ("pôr o pão na frente da palavra de Deus", "cobrar de Deus uma prova", "trocar a adoração por poder") repetem as linhas 12, 18 e 22, sem conteúdo novo.
- **Copy:** o 1º quadro ("Por que o Espírito levou Jesus para ser *tentado* pelo diabo?") está em Mt 4:1. O título ("As 3 tentações de Jesus: por que o Espírito o levou ao deserto?") é respondido nas partes 5 e 6. A legenda ("As 3 respostas de Jesus ao diabo saíram do mesmo livro da Bíblia.") é entregue na linha 28. A capa ("JESUS TENTADO. POR QUÊ?") não promete além do vídeo.
- **Respostas prontas:** "o próprio Jesus ofereceu orações e súplicas 'em alta voz e com lágrimas' e foi ouvido": Hb 5:7 diz "sendo ouvido por causa da sua reverente submissão", então a paráfrase é fiel; "clamor" é mesmo da ARA. A harmonização Mt 4:2 / Mc 1:13 / Lc 4:2-3 está correta. A nota sobre a ordem de Lucas (4:5-12) também. As referências do paralelo com Israel (1Co 10:6-13; Hb 3:8-9, 17; Dt 9:12-16) sustentam o que se propõem a sustentar.
- **"Para ler" e `narracao.txt`:** são idênticos nas 6 partes.
