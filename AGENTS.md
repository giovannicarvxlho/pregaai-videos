# pregaai-videos

Vídeos curtos do PregaAI para TikTok e Shorts. Como rodar e como montar um episódio está no README. Aqui ficam as decisões do Giovanni, que valem para todo episódio novo.

Este arquivo vale para qualquer agente que trabalhe neste repo (Claude Code, Antigravity, Gemini). O `CLAUDE.md` só importa este.

## Como o vídeo é feito (leia antes de começar)

**Modo automático** (decisão do Giovanni, 06/11/2026): o agente faz tudo sozinho e entrega o vídeo pronto. A única parada é a aprovação do roteiro. No Antigravity, isso é a skill `/episodio` (`.agents/skills/episodio`).

O vídeo é **código**, não IA de vídeo ou de imagem. Cada quadro é um SVG desenhado por `episodios/<ep>/scenes.js` com as peças de `lib.js`; o Playwright fotografa cada quadro e o ffmpeg junta tudo com a narração. Não use Veo, Imagen, Nano Banana, Canva nem banco de imagens, e não monte outro pipeline (Remotion, MoviePy, editor de vídeo).

1. **Ambiente:** `npm i` e depois `npm run checar`. Só siga com tudo ✔; cada ✘ vem com o comando que resolve.
2. **Leia** o `README.md` inteiro (principalmente "Como escrever o `scenes.js`") e o episódio de referência inteiro, `data.js` e `scenes.js`: `episodios/morte-de-acabe` para Short, `episodios/sete-frases-na-cruz` para vídeo longo.
3. **Roteiro** em `episodios/<ep>/roteiro.md`, conferido na NVI, marcado "aguardando validação do Giovanni", e o texto que a voz vai ler em `episodios/<ep>/narracao.txt` (uma frase por linha, `---` entre as partes, grafia para a voz: "Prega aí" em vez de PregaAI). Mostre o roteiro no formato de leitura e **pare** até o ok dele sobre o texto. É a única parada.
4. **Narração:** `python3 tools/narrar.py episodios/<ep>` gera o `narration.mp3` (longo: `partes/01.mp3`...) com a voz e os ajustes aprovados. Não use outro TTS nem outra voz. Se o Giovanni mandar um mp3 dele, use o dele.
5. **Tempos:** `segmentos.py` + `transcrever.py` e monte o `data.js` (Short), ou `juntar.py` + `alinhar.py` (longo), como no README. A legenda tem que bater com o que a voz falou.
6. **Cenas:** comece copiando o `scenes.js` da referência e troque as cenas uma a uma. Use as peças do `lib.js`; peça nova entra no `lib.js` no mesmo traço. Cada cena começa em `at(i)` ou `wordTime(i, 'palavra')`, nunca num segundo fixo.
7. **Revise vendo:** `node preview.cjs <ep>` (um quadro de cada cena), `bash sheet.sh 6`, abra o `sheet.png` e olhe de verdade: personagem inteiro e dentro do quadro, legenda sem cobrir rosto, nada nas zonas que o app cobre (README), nenhum `ERRO:` no terminal. Corrija e repita até ficar limpo.
8. **Render, capa e publicação:** `bash build.sh <ep>` gera `out/<ep>.mp4`; faça também a capa ou as miniaturas (regras abaixo) e o `episodios/<ep>/publicacao.md` a partir de `modelos/publicacao.md`.
9. **Entrega:** `python3 tools/pacote.py <ep>` monta a pasta e o .zip (ver "Ciclo do episódio e entrega"). Entregue tudo de uma vez, com o `sheet.png`. Com o ok dele, commit e push.

`out/`, `prev/`, `sheet.png` e `tools/modelos/` ficam fora do git.

## Metas de produção (Giovanni, 06/11/2026)

- **2 vídeos longos por dia**, cada um com **pelo menos 5 minutos**. Com 8 min ou mais, o YouTube põe anúncio no meio.
- **6 vídeos curtos por dia**, ligados aos longos do dia. Sugestão do Claude, a confirmar: tirar os curtos da narração do próprio longo, como no Reel das 7 frases. Assim eles não gastam crédito da ElevenLabs.
- **Banner de CTA a cada 30 segundos**, para trazer downloads e testes do app. O componente ainda não existe no `lib.js`. O primeiro vídeo que precisar dele cria um `ctaBanner()` lá, na marca (cartão branco, borda de 3 px, sombra dura, azul `#2383E2`, ícone do app e selo da Play de `assets/`), sem cobrir a legenda nem as zonas que o app cobre; depois disso, todos usam o mesmo.
- A confirmar com o Giovanni: o banner vale também para os curtos? No TikTok, a promoção do app pode tirar o vídeo do Programa de Recompensas (regra de 04/11 e decisão de 06/11 no MARK1).

## Ciclo do episódio e entrega (Giovanni, 06/11/2026)

O Giovanni quer o ciclo sempre assim, e no fim tudo de uma vez, separado, para subir no Drive e publicar depois.

1. **História:** ele escolhe, ou pede uma sugestão. Na sugestão, traga 3 opções, cada uma com o motivo e o dado que a sustenta: o que funcionou no placar e no playbook (MARK1, `projetos/pregaai-canais.md`), o calendário cristão (Advento em 29/11, Natal) e o que está em alta na busca. Não invente número: diga de onde veio.
2. **Roteiro:** o longo, com os trechos que viram curtos marcados. É a única parada: ele valida o texto.
3. **Produção:** narração, cenas, render do longo (YouTube e, quando a versão for diferente, TikTok), curtos, capas e miniaturas.
4. **Publicação:** o `episodios/<ep>/publicacao.md`, a partir de `modelos/publicacao.md`, com título, descrição ou legenda, hashtags, tags, capa, comentário fixado, configurações e calendário de cada plataforma. Os textos seguem as regras do modelo, que vêm das skills de publicação (`social-media-skills:youtube-publishing-and-metadata`, `tiktok-video-publishing`, `instagram-reels-publishing`, `hashtag-strategy`) e do playbook do canal. Use as skills quando estiverem disponíveis; quando discordarem dos dados do canal ou da regra oficial da plataforma, valem os dados e a regra oficial.
5. **Pacote:** `python3 tools/pacote.py <ep>` monta `out/pacote/<AAAA-MM-DD>-<ep>/` com **uma pasta por rede**, cada uma com os vídeos e as capas daquela rede (`youtube/`, `youtube-shorts/`, `tiktok/`, `instagram/`), mais o `publicacao.md` e o `.docx`, e um `.zip` da pasta. Ele avisa se o documento cita arquivo que não está no pacote, se tem vídeo ou capa sem uso, ou se falta capa (curto sem capa, longo sem miniaturas ou sem a capa do TikTok). Na nuvem, mande o .zip; no computador, diga o caminho da pasta.

**Onde vai cada vídeo:** o longo vai para o YouTube e o TikTok; os curtos vão para o TikTok, o YouTube Shorts e o Instagram. O Instagram não recebe o longo: ele aceita vídeo maior, mas Reel com mais de 3 min não é recomendado a quem não segue a conta.

**Curtos:** a ferramenta de recorte vertical (cena do longo no meio, título em cima, legenda embaixo) ainda não existe no repo. O primeiro episódio que precisar de curtos recortados cria essa ferramenta, gerando `out/<ep>-curto-<n>.mp4` e `out/<ep>-curto-<n>-capa.jpg`, que é o que o `pacote.py` procura.

## Fluxo

- **O Giovanni valida a história antes de tudo** (regra dele, 04/11/2026: "sempre eu PRECISO validar a história antes"). Todo roteiro novo, e toda mudança num roteiro (abertura, chamada, uma frase), vai para ele ler inteiro antes da narração e da animação, com o que mudou marcado. Só trate como aprovado depois do ok explícito dele sobre o texto; aceitar um plano ou uma estratégia não é aprovar o roteiro. Até lá, o roteiro fica marcado no topo como "aguardando validação do Giovanni".
- **Entrega do roteiro em dois formatos** (pedido dele, 04/11/2026), sempre: (1) **para ler e validar:** a história em parágrafos de texto corrido, uma parte por título, com o que mudou marcado; (2) **para a voz:** desde 06/11/2026 a narração sai pela API, então esse formato vira o `narracao.txt` do episódio (uma frase por linha, sem marcação, `---` entre as partes), que o `tools/narrar.py` lê. Só mostre os blocos no chat se ele pedir.
- **Narração:** sai pela API da ElevenLabs com `tools/narrar.py`, depois do ok no roteiro (decisão de 06/11/2026; a API exige plano pago e a chave no `.env.local`). Ajustes, gravados no `narrar.py`: voz Marcelo Costa (a dos curtos de 04 e 05/11, `pedro-nega` e `mulher-do-fluxo`), modelo **Eleven v4 Turbo** (desde 06/11/2026: gasta metade do crédito do v4 e passou no teste de ouvido do Giovanni, "ficou ótimo a voz"), estabilidade 50%, similaridade 80%, clone strength no padrão, Portuguese, velocidade 1,0. Antes era a voz Carlos com estabilidade ~45%. Com o mp3 em mãos, sincronize como no README (`segmentos.py`, `transcrever.py`, `data.js`).
- **Custo da ElevenLabs no mínimo** (Giovanni, 04/11/2026: "devem ser mínimos, utilizar o máximo por aqui"): a ElevenLabs fica só para a narração, gerada uma vez por roteiro aprovado (o `narrar.py` não sobrescreve mp3; `--refazer` só se o Giovanni pedir). Trilha e efeitos sonoros são gerados aqui, no próprio pipeline (síntese no ffmpeg), sem custo e sem problema de direitos.
- A chave da ElevenLabs fica no secret de rede do ambiente (Claude Code na nuvem) ou no `.env.local` da raiz (computador, fora do git). Nunca peça chave no chat nem grave em arquivo versionado.
- **Vídeo e capa juntos.** No modo automático a capa (`episodios/<ep>/capa.html` + `node capa.cjs <ep>`) já vai na entrega com o vídeo. Quando o Giovanni disser que ficou bom, faça commit e push do episódio com a capa.
- Confira todo texto bíblico na NVI (`assets/bible/nvi.json` do repo `pregaai`; no computador, clone o `pregaai` na mesma pasta deste repo, em `../pregaai`). Toda afirmação do roteiro tem que estar no texto. Se for inferência, escreva de um jeito que não afirme mais do que a Bíblia diz.
- Texto visível sem travessão (decisão de 15/10/2026). Número na tela só com fonte real.

## Vídeo (aprovado em 28/10/2026, referência: `episodios/morte-de-acabe`)

- Desenho com traço de tinta e os personagens de `lib.js`. **Poucos elementos por cena**: sem contadores, selos, brilhos ou cartões por cima da ilustração. O cartão final com a Google Play e o banner de CTA (06/11) são as exceções.
- Legenda só com o texto, sem cartão. A palavra que está sendo falada fica azul. A referência bíblica aparece pequena no alto, só quando a passagem muda.
- Roteiro curto: ~110 palavras e cenas de 1 a 4 s. Narração gerada em velocidade 1,0, com `SPEED = 1.25` no `data.js`.
- Narração humanizada: escreva como quem conta para um amigo ("pra", "tá", "você", pergunta direta), com frases curtas. Nada de tom de locutor.

## Capa e miniatura (regra de 03/11/2026: família, não molde)

Substitui o molde de 28/10 (fundo creme com raios, rosto com medo e seta em todas), que deixou as capas iguais umas às outras. A capa vende o vídeo em menos de um segundo, quase sempre no celular.

**Fica igual em todas (é o que faz o canal ser reconhecido):**
- Texto em Gasoek One, de 0 a 3 palavras, com o azul `#2383E2` como destaque. Personagens no traço de tinta de `lib.js`.
- **O texto soma ao título, nunca o repete.** Ele contradiz ou completa (título "Uma flecha ao acaso matou o rei Acabe", capa "NÃO FOI ACASO").
- A capa promete só o que o vídeo mostra.

**Muda conforme a história:**
- Fundo claro ou escuro pelo clima dela; noite, morte e juízo pedem escuro. Fundo calmo: raios só quando ajudam.
- **Um herói só:** um rosto ou um objeto da história. Rosto só com a emoção que o conteúdo tem (não a mesma cara de susto em tudo).
- Seta só quando aponta para algo que precisa ser visto.

**Dois testes antes de entregar** (`python3 tools/testar_capa.py <imagens>`):
- Reduzida a 168×94, o tamanho do feed no celular, dá para entender o que é.
- Em preto e branco, o herói continua se separando do fundo.

### Estilo da miniatura do vídeo longo (aprovado pelo Giovanni em 06/11/2026; referência: `episodios/depois-da-cruz/miniatura-a.html`, `-b`, `-c`)

Giovanni: "crave esse estilo", mas "não pode ficar SEMPRE igual, tem um padrão, mas nunca 100% igual". Vale a regra da família acima: o padrão abaixo é o que se repete, e a lista "Varia" é obrigatória.

**O padrão (repete em todas):**
- A arte sai das funções do próprio episódio (`data.js`, `lib.js` e `scenes.js` carregados na página da miniatura), para a miniatura mostrar só o que o vídeo mostra.
- Pouca luz no fundo e **uma fonte de luz quente** (gradiente radial dourado ou âmbar) atrás do herói, com vinheta escura nas bordas. É o que separa o herói do fundo no feed.
- **Herói grande:** um rosto em close com a emoção da história (medo, choro, espanto), ou uma figura central grande. Nada de cena aberta com personagens pequenos.
- **Texto:** Gasoek One, de 1 a 3 palavras, branco com contorno escuro grosso e sombra; a palavra-chave numa etiqueta azul `#2383E2` com borda preta, sombra dura e inclinada. De preferência, uma pergunta ou um mistério que o vídeo responde.
- Texto de um lado e herói do outro; o canto de baixo à direita fica livre (duração).
- Render: `ESCALA=2 node capa.cjs <ep> miniatura-<x>` (2560×1440). O JPG fica abaixo de 2 MB, para subir pelo celular.
- Antes de entregar: `tools/testar_capa.py` (168×94 e preto e branco) e uma folha com a miniatura no meio de miniaturas do nicho na busca do YouTube, para ver se ela se destaca.

**Varia (nunca 100% igual):** cada miniatura nova muda pelo menos 2 destes itens em relação às 3 últimas do canal (critério sugerido pelo Claude).
- A cor da luz e do fundo, pelo clima da história: noite azul-escura, madrugada dourada, nascer do sol quente, entardecer, escuro total.
- O lado do texto (esquerda ou direita) e a linha da etiqueta azul (primeira ou segunda), com inclinação para um lado ou para o outro.
- O enquadramento: close de rosto, plano médio, objeto em primeiro plano.
- O herói: uma pessoa, um objeto (bolsa de moedas, pedra, véu, cruz) ou um lugar.
- Os detalhes de emoção: suor, lágrimas, moedas no ar, poeira, raios de luz.
- O tipo de texto: pergunta ("QUEM ABRIU?"), afirmação forte ("PAGOS PRA MENTIR") ou contradição do título.

**Formatos:**
- Vídeo longo: 1280×720, nada importante no canto de baixo à direita (a duração do YouTube cobre). Fazer 3 versões, cada uma com um motivo diferente para clicar, para o "Testar e comparar" do YouTube Studio.
- Short e TikTok: 1080×1920, tudo o que importa no miolo 3:4 (y 240 a 1680), que é o recorte da grade do perfil. Sem referência bíblica e sem logo. No Short a capa pesa pouco: quem decide é o primeiro quadro.

**Capas por rede, em toda entrega** (pedido do Giovanni em 06/11/2026; arquivo, tamanho e de onde sai):
- **YouTube, longo:** 3 miniaturas 16:9 para o "Testar e comparar" (`episodios/<ep>/miniatura-a.html`, `-b`, `-c`; `ESCALA=2 node capa.cjs <ep> miniatura-a` gera 2560×1440).
- **TikTok, longo:** uma capa 1080×1920 (`episodios/<ep>/capa-tiktok.html` → `node capa.cjs <ep> capa-tiktok`), com o herói da miniatura e o texto no miolo 3:4. O longo é 16:9, mas a grade do perfil é vertical.
- **TikTok e Instagram, curtos:** uma capa 1080×1920 por curto (`episodios/<ep>/curto-<n>-capa.html` → `node capa.cjs <ep> curto-<n>-capa`), a mesma nas duas redes. No Instagram ela sobe como capa personalizada e não dá para trocar depois.
- **YouTube Shorts:** não sobe capa por arquivo. O documento diz qual quadro escolher no app.
- Todas passam pelos dois testes (`tools/testar_capa.py`) antes de entrar no pacote.

## Descrição da publicação (aprovada em 28/10/2026, referência: `episodios/morte-de-jezabel/roteiro.md`)

Um texto só para TikTok e YouTube, nesta ordem:
1. O gancho numa linha.
2. Um parágrafo que começa com "Histórias bíblicas em menos de 1 minuto:" e conta a história.
3. Um parágrafo curto com a virada ou a lição.
4. `📖 Base bíblica: <referências>`.
5. Uma pergunta para quem assiste, terminando em 👇.
6. `#históriasbíblicas #shorts #fé #bíblia` e uma do personagem. `#históriasbíblicas` vem primeiro porque o YouTube mostra as três primeiras acima do título.

Mesmas regras do roteiro: sem travessão e com cada afirmação conferida na NVI.

## Vídeo longo (aprovado em 02/11/2026, referência: `episodios/sete-frases-na-cruz`)

- 16:9, 1920×1080 (`const FORMAT = 'wide'` no `data.js`). Mesmo traço e mesmas regras de texto dos Shorts.
- Narração em partes, uma por capítulo do roteiro, entregue em blocos de código. Sem acelerar. Mínimo de 5 min (meta de 06/11); com 8 min ou mais o YouTube põe anúncio no meio.
- Cenas de explicação (cartões com os livros, versículos em cartão) valem aqui, porque são a cena inteira e não algo por cima da ilustração.
- Quando o roteiro vier de fora, confira tudo na NVI antes de produzir e diga o que foi corrigido.
- Miniatura 1280×720 pela regra da capa acima, em 3 versões para o "Testar e comparar".
