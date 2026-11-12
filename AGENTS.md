# pregaai-videos

Vídeos curtos do PregaAI para TikTok e Shorts. Como rodar e como montar um episódio está no README. Aqui ficam as decisões do Giovanni, que valem para todo episódio novo.

Este arquivo vale para qualquer agente que trabalhe neste repo (Claude Code, Antigravity, Gemini). O `CLAUDE.md` só importa este.

## Como o vídeo é feito (leia antes de começar)

**Modo automático** (decisão do Giovanni, 06/11/2026): o agente faz tudo sozinho e entrega o vídeo pronto. A única parada é a aprovação do roteiro. No Antigravity, isso é a skill `/episodio` (`.agents/skills/episodio`).

O vídeo é **código**, não IA de vídeo ou de imagem. Cada quadro é um SVG desenhado por `episodios/<ep>/scenes.js` com as peças de `lib.js`; o Playwright fotografa cada quadro e o ffmpeg junta tudo com a narração. Não use Veo, Imagen, Nano Banana, Canva nem banco de imagens, e não monte outro pipeline (Remotion, MoviePy, editor de vídeo).

1. **Ambiente:** `npm i` e depois `npm run checar`. Só siga com tudo ✔; cada ✘ vem com o comando que resolve.
2. **Leia** o `README.md` inteiro (principalmente "Como escrever o `scenes.js`") e o episódio de referência inteiro, `data.js` e `scenes.js`: `episodios/morte-de-acabe` para Short, `episodios/sete-frases-na-cruz` para vídeo longo.
3. **Roteiro** em `episodios/<ep>/roteiro.md`, conferido na NVI, marcado "aguardando validação do Giovanni", com o bloco **Aposta** no topo (ver "Aposta e aprendizado"), e o texto que a voz vai ler em `episodios/<ep>/narracao.txt` (uma frase por linha, `---` entre as partes, grafia para a voz: "Prega aí" em vez de PregaAI). Mostre o roteiro no formato de leitura e **pare** até o ok dele sobre o texto. É a única parada.
4. **Narração:** `python3 tools/narrar.py episodios/<ep>` gera o `narration.mp3` (longo: `partes/01.mp3`...) com a voz e os ajustes aprovados. Não use outro TTS nem outra voz. Se o Giovanni mandar um mp3 dele, use o dele.
5. **Tempos:** `python3 tools/tempos.py episodios/<ep> --novo` (curto) ou `juntar.py` + `tempos.py --novo --longo` (longo) cria o `data.js` com o tempo exato de cada palavra, que a própria ElevenLabs devolve junto com o áudio (desde 11/11/2026; antes, o Whisper transcrevia o áudio e errava palavras). Confira os blocos `|` e marque `!` e `*` onde precisar; depois de mexer no texto da tela, `tempos.py` sem `--novo` refaz só os tempos. Narração sem `.tempos.json` (antiga ou gravada pelo Giovanni): o caminho antigo do README (`alinhar.py`, ou `segmentos.py` + `transcrever.py`). A legenda tem que bater com o que a voz falou.
6. **Cenas:** comece copiando o `scenes.js` da referência e troque as cenas uma a uma. Use as peças do `lib.js`; peça nova entra no `lib.js` no mesmo traço. Cada cena começa em `at(i)` ou `wordTime(i, 'palavra')`, nunca num segundo fixo.
7. **Revise vendo:** `node preview.cjs <ep>` (um quadro de cada cena), `bash sheet.sh 6`, abra o `sheet.png` e olhe de verdade: personagem inteiro e dentro do quadro, legenda sem cobrir rosto, nada nas zonas que o app cobre (README), nenhum `ERRO:` no terminal. Corrija e repita até ficar limpo.
8. **Render, capa e publicação:** `bash build.sh <ep>` gera `out/<ep>.mp4`; faça também a capa ou as miniaturas (regras abaixo) e o `episodios/<ep>/publicacao.md` a partir de `modelos/publicacao.md`.
9. **Teste:** `npm test` (episódios desenham sem erro, todo `wordTime` acha a palavra, `data.js` bate com o `narracao.txt` frase por frase, `corte.json` válido, nenhum corte começando no meio da fala). Roda também no GitHub a cada push e PR; PR com teste vermelho não entra na `main`.
10. **Entrega:** `python3 tools/pacote.py <ep>` monta a pasta e o .zip (ver "Ciclo do episódio e entrega"). Entregue tudo de uma vez, com o `sheet.png`. Com o ok dele, commit e push.

`out/`, `prev/`, `sheet.png` e `tools/modelos/` ficam fora do git.

**Git:** mudança no repo vai por PR e o próprio agente faz o merge na `main`, sem perguntar (autorização do Giovanni em 06/11/2026). Sem o merge, a próxima sessão e o PC dele não recebem a mudança.

## Metas de produção (Giovanni, 06/11/2026)

- **Volume (Giovanni, 12/11/2026, recomendação da pesquisa de plataformas; substitui a meta de 2 longos e 6 curtos de 06/11):** **1 vídeo longo por dia e 1 a 2 curtos por dia por rede, diferentes entre si.** O longo continua com **4 a 5 minutos, nunca mais de 5**, contando o cartão final do YouTube (Giovanni, 06/11/2026: "o tempo limite é 5 minutos"). Motivo: postar mais não muda o vídeo típico (Buffer, 11,4 mi de posts), protege contra a regra de conteúdo inautêntico do YouTube (molde repetido em volume) e cabe no plano Starter da ElevenLabs com 1 curto escrito do zero por dia. Detalhe no MARK1, `projetos/pregaai-pesquisa/relatorio.md`.
- **Curtos:** cada curto é escrito como curto (do zero) ou é um recorte do longo com enquadramento por cena (abaixo, "Especificações por rede"). Recorte não gasta crédito da ElevenLabs; curto escrito do zero gasta ~850 a 1.150 caracteres.
- **Banner de CTA a cada 30 segundos**, para trazer downloads e testes do app: `ctaBanner()` no `lib.js` (CSS `.cta` no `index.html`), ligado com `cta: true` no `corte.json` ou `?cta=1` na URL. Entra aos 30 s, fica ~4,5 s e some no cartão final, que já tem o app. Feito em 06/11/2026, no longo da ressurreição.
  - **Desde 07/11/2026 (pedido do Giovanni: o logo da Play Store), o banner leva o selo oficial "Disponível no Google Play"** (`assets/google-play-badge.png`, o mesmo do cartão final). Cartão branco da marca com o ícone e "PregaAI"; alterna: 1ª, 3ª, 5ª vez o selo (Android), 2ª, 4ª, 6ª "No iPhone: app.pregaai.com". O texto não escreve "Android" nem "Play Store": quem fala pelo Android é o selo.
  - **Onde fica:** no longo 16:9, no canto de cima à direita (selo com 92 px de altura; na vez do Android sem a linha "Plano de leitura bíblica", para não encostar na referência do alto). No curto vertical (recorte), no lugar do título, que some enquanto o banner está na tela (selo com 100 px): não cobre a cena, a legenda nem as zonas que o app cobre.
  - **Regras do selo** (Google Play no Partner Marketing Hub, página "Lockups, icons, & badges"): só o selo oficial e atual, inteiro, sem mudar cor, proporção nem elementos; respiro em volta de 1/4 da altura dele; fundo sólido com contraste; altura mínima de 28 px; não usar selo em baixa resolução. O selo só anima junto com o cartão (entra e sai inteiro). O ícone do Play (o triângulo) sozinho não pode ir em material de marketing, e o Google diz para não deixar marca dele como o elemento mais forte da peça (por isso o ícone do app tem a mesma altura do selo). Escrever "Android" pede a linha "Android é uma marca da Google LLC"; a linha "Google Play e o logotipo do Google Play são marcas da Google LLC." fica no cartão final.
- O banner vai também nos curtos (foi nos da ressurreição; mantido em 07/11/2026, quando o Giovanni decidiu seguir as recomendações da análise: nas 10 aparições medidas no TikTok, o banner não derrubou a retenção). No TikTok, todo vídeo com o banner sai com a divulgação de conteúdo comercial ligada, o que pode tirar o vídeo do Programa de Recompensas (regra de 04/11 e decisão de 06/11 no MARK1).

## Ciclo do episódio e entrega (Giovanni, 06/11/2026)

O Giovanni quer o ciclo sempre assim, e no fim tudo de uma vez, separado, para subir no Drive e publicar depois.

1. **História:** ele escolhe, ou pede uma sugestão. Na sugestão, traga 3 opções, cada uma com o motivo e o dado que a sustenta: o que funcionou no placar e no playbook (MARK1, `projetos/pregaai-canais.md`), o calendário cristão (Advento em 29/11, Natal) e o que está em alta na busca. Não invente número: diga de onde veio. **Pelo menos uma das 3 vem do garimpo** (pedido do Giovanni em 11/11/2026): o topo de `python3 .claude/skills/roteiros/motor.py garimpo` no MARK1, que ordena os posts de outros perfis do nicho que fizeram muito mais views que a mediana do próprio perfil (`projetos/pregaai-dados/garimpo.csv`), com o link e o múltiplo. Do post de fora se aproveita só a pergunta ou a história; o texto, a arte, o áudio, o título e a capa são nossos, e tudo continua conferido na NVI (regra completa em "Garimpo de fora da curva", no `projetos/pregaai-roteiros.md` do MARK1).
2. **Roteiro:** o longo, com os trechos que viram curtos marcados. É a única parada: ele valida o texto.
3. **Produção:** narração, cenas, render do longo (YouTube e, quando a versão for diferente, TikTok), curtos, capas e miniaturas.
4. **Publicação:** o `episodios/<ep>/publicacao.md`, a partir de `modelos/publicacao.md`, com título, descrição ou legenda, hashtags, tags, capa, comentário fixado, configurações e calendário de cada plataforma. Os textos seguem as regras do modelo, que vêm das skills de publicação (`social-media-skills:youtube-publishing-and-metadata`, `tiktok-video-publishing`, `instagram-reels-publishing`, `hashtag-strategy`) e do playbook do canal. Use as skills quando estiverem disponíveis; quando discordarem dos dados do canal ou da regra oficial da plataforma, valem os dados e a regra oficial.
5. **Pacote:** `python3 tools/pacote.py <ep>` monta `out/pacote/<AAAA-MM-DD>-<ep>/` com **três pastas, `youtube/`, `tiktok/` e `instagram/`**, cada uma com os vídeos e as capas daquela rede e **um texto só dela em .txt** (`publicacao-<rede>.txt`, texto puro para copiar e colar nos apps; pedido do Giovanni em 11/11/2026, no lugar do .docx de 06/11), e um `.zip` de tudo. Nenhum .md vai para a entrega (pedido do Giovanni em 06/11/2026): o `publicacao.md` fica no repositório, com uma seção por rede, e o pacote corta cada seção num .txt, sem a marcação (o que está entre ``` sai igual, pronto para colar). Ele avisa se o documento cita arquivo que não está no pacote, se tem vídeo ou capa sem uso, ou se falta capa (curto sem capa, longo sem miniaturas ou sem a capa do TikTok). **A entrega é um zip só** (pedido do Giovanni em 06/11/2026: "deve ser 1 zip"), com as três pastas dentro; nunca um zip por rede. **O zip abre numa pasta só** (pedido dele em 11/11/2026): `youtube/`, `tiktok/` e `instagram/` ficam direto na raiz do zip, sem uma pasta com o nome do pacote por cima, porque o "Extrair tudo" do Windows já cria a pasta com o nome do zip. Na nuvem, mande esse zip único; no computador, diga o caminho da pasta. **Drive no computador:** com `PACOTE_DRIVE=<pasta>` no `.env.local` (uma pasta sincronizada pelo Google Drive para computador), o `pacote.py` também copia a pasta do pacote para lá, e o Drive sobe sozinho.

**Onde vai cada vídeo:** o longo vai para o YouTube e o TikTok; os curtos vão para o TikTok, o YouTube (Shorts, na mesma pasta `youtube/`) e o Instagram. No TikTok não dá mais para fixar comentário (o Giovanni tentou de várias formas em 09/11/2026): o texto do app vai como resposta do perfil ao primeiro comentário. O Instagram não recebe o longo: ele aceita vídeo maior, mas Reel com mais de 3 min não é recomendado a quem não segue a conta.

**Curtos e cortes:** `node tools/corte.cjs episodios/<ep>/corte.json` monta vídeos a partir de um longo já narrado e animado, sem narração nova: para cada saída, as frases que ficam (índices do `SEGS` da origem). Serve para o longo de 4 a 5 min recortado de um maior (com o cartão final e a versão do TikTok sem ele) e para os curtos verticais (`layout: "vertical"`: cena 16:9 no meio, título fixo em cima, legenda embaixo). **Todo curto recortado sai com enquadramento por cena, e é essa versão que vai para as três redes** (`layout: "foco"`, saída `<ep>-curto-<n>-ig`; decisão do Giovanni em 12/11/2026). A cena 16:9 enche a tela vertical inteira: como as cenas são SVG, a janela de 607,5 × 1080 da cena vira 1080 × 1920 sem perder resolução. A legenda fica na faixa do céu, logo abaixo do título (y 640), porque com a cena cheia os personagens ocupam a metade de baixo; um degradê escuro em cima e embaixo segura a leitura. Cada saída leva **`gancho`** (o texto do 1º quadro, obrigatório: aparece no quadro 0 e some aos 3 s, antes do título fixo; `*palavra*` sai em azul) e, quando o meio da cena não mostra o que importa, **`foco`**, em unidades da cena 1920×1080: `{"padrao": {"cx": 960}, "cena": {"44": {"cx": 1500, "z": 1.15}}, "frase": {"48": {"cx": 700, "ate": {"cx": 1200}}}}`. `cx` e `cy` são o centro da janela; `z` é o zoom (de 1 a 3; menos que 1 deixaria faixa); `ate` leva a janela até outro ponto ao longo da frase ou da cena (campo e contracampo num diálogo, panorâmica numa paisagem). Vale a regra da frase, depois a da cena, depois o padrão; sem `ate`, a câmera empurra devagar (`empurra`, 0,04 por padrão). O índice da cena é a posição no `SCENES` da origem. **Revise vendo:** `SO_MAPA=1 node tools/corte.cjs ...` e `CORTE=out/<nome>.corte.json node preview.cjs <origem> <tempos>`, um quadro por cena, e ajuste o `foco` até o personagem que fala estar inteiro e no centro; o `npm test` recusa cena ou frase que não existe, `cx`, `cy` e `z` fora da faixa e curto sem `gancho`. Cena larga demais para a janela (multidão inteira, cartão de texto 16:9) vira campo e contracampo com `ate`, ou fica fora do curto. O layout `cheia` (a cena 16:9 em 37% da altura e a mesma cena desfocada em volta), usado de 09/11 a 12/11/2026, saiu de uso; o `vertical` (com faixas escuras) também. Os dois continuam funcionando para refazer episódios antigos. Cada quadro chama as cenas e a legenda da origem no tempo certo, e o áudio é a mesma narração, cortada nos mesmos pontos. Saem `out/<ep>.mp4`, `out/<ep>-tiktok.mp4` e `out/<ep>-curto-<n>.mp4`; as capas dos curtos saem de `episodios/<ep>/curto-<n>-capa.html`. Referência: `episodios/depois-da-cruz-5min`. Para revisar quadros antes: `SO_MAPA=1 node tools/corte.cjs ...` e `CORTE=out/<nome>.corte.json node preview.cjs <origem> <tempos>`.

## Especificações por rede (11/11/2026)

O `pacote.py` confere duração e tamanho de cada vídeo do pacote (ffprobe) e avisa quando algo sai destas regras.

- **Todas:** curto em 1080×1920 (9:16), **composto na vertical** (Giovanni, 12/11/2026): ou cena desenhada em 9:16 para o curto, ou recorte do longo com enquadramento por cena que preenche a tela (`layout: "foco"` no `corte.cjs`, desde 12/11/2026; como usar em "Curtos e cortes"). **O layout `cheia` sai de uso:** nele a cena 16:9 ocupa 713 dos 1.920 px de altura (37%) e o resto é a mesma cena desfocada, o que o TikTok chama de vídeo que "parece de outro lugar" (Creator Academy). Vale para o que ainda não foi programado; os curtos já programados nos apps seguem como estão (Giovanni, 12/11/2026). Título, legenda e banner fora das zonas que o app cobre (README).
- **Texto do gancho no 1º quadro, em todo vídeo** (curtos nas três redes e versão vertical do longo no TikTok; Giovanni, 12/11/2026; no corte, o campo `gancho`; no curto nativo, `const GANCHO = '...'` no `data.js`): a frase do gancho escrita na tela já no quadro 0, de 2 a 5 palavras ou a pergunta, por ~3 s, no terço de cima e dentro da zona segura, somando à fala sem repetir. É validada junto com a abertura do roteiro. Base: 33 de 38 vídeos fora da curva do nicho conferidos têm texto no 1º quadro (pesquisa de 12/11/2026).
- **Instagram (Reels):** só curtos, até 3 min. Acima disso o Reel não é recomendado a quem não segue a conta (Central de Ajuda do Instagram, citada por vários guias; a página não abriu daqui em 11/11/2026). Não há duração ideal oficial: o Mosseri não publicou número, e um estudo de terceiros (Socialinsider, ~9,8 mi de Reels de marcas, 2026) aponta 45 a 60 s. No canal, o melhor Reel é o mais longo (as 7 palavras, 2:45, 5.050 views; o 2º é a mulher do fluxo, 1:16, 2.483). Por isso a duração dentro dos 3 min é teste, não regra.
- **YouTube:** Short até 3 min, vertical ou quadrado; acima disso, ou na horizontal, vira vídeo comum (guias de terceiros; conferir na ajuda do YouTube). Short com mais de 1 min e qualquer reivindicação de Content ID fica bloqueado: a música só vem do pipeline. O longo vai de 4 a 5 min, nunca mais de 5.
- **TikTok:** curto composto na vertical (regra de "Todas"), sem faixas. O Programa de Recompensas só conta vídeo com mais de 1 min, e o vídeo com a divulgação de conteúdo comercial ligada (o banner do app) pode ficar de fora.

## Formato e testes aprovados (Giovanni, 12/11/2026)

Decisões da pesquisa de plataformas (MARK1, `projetos/pregaai-pesquisa/relatorio.md`, seção 8). Os testes respeitam o limite de 3 testes abertos da Fórmula do MARK1: cada um entra quando abrir vaga, na ordem abaixo, e quem produz o episódio daquele dia monta o que o teste pede. Nada aqui muda o que já está programado.

- **Formato "pergunta do público" nos curtos escritos do zero:** a história bíblica vira a resposta a uma dúvida real, em série de molde fixo ("Por que Deus...?", "O que aconteceu com... no fim?", "O detalhe que ninguém repara em..."). A pergunta vai no título, na 1ª frase e no texto do 1º quadro, e é sempre respondida pelo texto bíblico, conferido na NVI; pergunta de doutrina (quem vai para o céu, é pecado?) passa pela revisão de teologia e pelo Giovanni. Comece por uma série só. Nos recortes do longo, o gancho segue o sorteio da Fórmula.
- **Fila de testes:**
  1. **Trilha baixa** (entra quando o teste de tema fechar, depois da análise do longo da cruz): trilha gerada no próprio pipeline (síntese no ffmpeg, sem custo e sem direitos), a 20% a 30% do volume da voz, desde o 1º quadro. O mesmo curto sai com e sem, no mesmo episódio e na mesma rede. A peça de trilha ainda não existe: quem produz o episódio do teste a monta.
  2. **Carrossel no Instagram:** 3 por semana durante 2 semanas, 6 a 8 quadros 4:5 (1080×1350), com trilha instrumental, em lista fechada ("As 7 frases de Jesus na cruz", uma por quadro) ou pergunta com resposta no fim. Gerado como as capas (HTML com as peças do `lib.js` e `capa.cjs`). Mede alcance, salvamentos e envios contra a mediana dos Reels.
  3. **"História completa" da Paixão, 10 a 20 min, só no YouTube:** as narrações que já existem (as 7 frases, quando Jesus morreu, depois da cruz, a ressurreição, "tu me amas?"), mais abertura nova, pontes narradas entre as partes e capítulos. A abertura e as pontes são roteiro novo e passam pelo Giovanni. Mede em 4 semanas contra os longos de 5 min; não é regra nova de duração.

## Aposta e aprendizado (Giovanni, 10/11/2026)

Pedido dele: o roteiro, o gancho e o vídeo têm que melhorar a cada episódio. Para isso, cada roteiro registra o que está testando, e o resultado volta para o próximo.

- **Antes de escrever o gancho,** leia no MARK1 a seção "Fórmula atual" de `projetos/pregaai-roteiros.md`: o que o roteiro segue, a métrica de crescimento de cada rede e o que está em teste (versão nova a cada leitura que muda de grau). O detalhe está no banco de ganchos e nas leituras do mesmo arquivo. Na nuvem, anexe o MARK1 (`add_repo` de `giovannicarvxlho/MARK1`, só leitura); no computador, clone-o ao lado deste repo, em `../MARK1`. No MARK1 isso é a skill `/roteiros`, passo A.
- **Gerar antes de escolher** (Giovanni, 11/11/2026: "que cada vez saiam vídeos com ganchos melhores"): escreva 10 aberturas candidatas (1ª e 2ª frase), de pelo menos 4 tipos, fiéis à NVI. Dê de 0 a 3 pontos a cada uma: (a) a coisa estranha ou a ação nas duas primeiras palavras; (b) a 2ª frase continua a cena; (c) promete explicar algo que o público não entende. O longo leva a de maior nota. **O tipo de gancho de cada curto vem do sorteio do MARK1** ("Placar dos tipos de gancho" e passo A da `/roteiros`, Fórmula v2 de 11/11/2026), não da escolha do agente: é o que deixa o episódio funcionar como teste. Grave a nota de cada abertura. Junto com o roteiro, mostre ao Giovanni a escolhida e as 2 seguintes, com a nota.
- **Todo `roteiro.md` leva, logo abaixo do status, o bloco:**
```
## Aposta
- **Gancho:** "<primeira frase>" (tipo: <tipo do quadro do MARK1>)
- **Origem do tema:** garimpo (<link do post de fora>) | canal (dado do próprio canal: viral, comentários) | calendário | outra
- **O que muda em relação ao último vídeo do mesmo formato:** <uma coisa só, se possível>
- **Previsão (TikTok, 48 h):** 3 s __% (faixa) · 10 s __% · 30 s __% · tempo médio __ s · views __ (faixa) · views de quem não segue __ (faixa) · terminou __%. Confiança: alta | média | baixa
- **Previsão (curtos, 48 h):** Instagram, pulo __% (faixa) · Shorts, continuaram __% (faixa)
- **Curtos:** curto 1 testa <tipo> · curto 2 testa <tipo> · curto 3 testa <tipo>
- **Momento para mandar a alguém:** <a frase ou cena que alguém enviaria>
- **Se errar, o que isso ensina:** <uma linha>
```
- A previsão sai dos vídeos do mesmo grupo no banco (mesmo formato, distribuídos pelo Para Você). Sem acesso ao MARK1, escreva o gancho e o tipo e deixe a previsão como "a preencher no MARK1".
- **Curto tirado de longo abre com frase de gancho própria,** nunca com a frase de contexto do longo ("João conta o que aconteceu..."). Nos dados de 10/11, os cortes que abriram no meio da história seguraram 41% a 54% em 3 s no Instagram, contra 59% a 70% dos curtos com abertura própria. Frase nova é mudança de roteiro: vai para o Giovanni validar.
- A aposta não muda a regra de validação: o texto continua esperando o ok dele. Depois de publicado, a análise de 48 h é feita no MARK1, sem trabalho para ele.

## Fluxo

- **O Giovanni valida a história antes de tudo** (regra dele, 04/11/2026: "sempre eu PRECISO validar a história antes"). Todo roteiro novo, e toda mudança num roteiro (abertura, chamada, uma frase), vai para ele ler inteiro antes da narração e da animação, com o que mudou marcado. Só trate como aprovado depois do ok explícito dele sobre o texto; aceitar um plano ou uma estratégia não é aprovar o roteiro. Até lá, o roteiro fica marcado no topo como "aguardando validação do Giovanni".
- **Entrega do roteiro em dois formatos** (pedido dele, 04/11/2026), sempre: (1) **para ler e validar:** a história em parágrafos de texto corrido, uma parte por título, com o que mudou marcado; (2) **para a voz:** desde 06/11/2026 a narração sai pela API, então esse formato vira o `narracao.txt` do episódio (uma frase por linha, sem marcação, `---` entre as partes), que o `tools/narrar.py` lê. Só mostre os blocos no chat se ele pedir.
- **Narração:** sai pela API da ElevenLabs com `tools/narrar.py`, depois do ok no roteiro (decisão de 06/11/2026; a API exige plano pago e a chave no `.env.local`). Ajustes, gravados no `narrar.py`: voz Marcelo Costa (a dos curtos de 04 e 05/11, `pedro-nega` e `mulher-do-fluxo`), modelo **Eleven v4 Turbo** (desde 06/11/2026: gasta metade do crédito do v4 e passou no teste de ouvido do Giovanni, "ficou ótimo a voz"), estabilidade 50%, similaridade 80%, clone strength no padrão, Portuguese, velocidade 1,0. Antes era a voz Carlos com estabilidade ~45%. O `narrar.py` grava junto de cada mp3 o `.tempos.json` (os tempos de cada letra, devolvidos pela ElevenLabs), e o `tools/tempos.py` monta o `data.js` com eles. Versione os dois.
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
- Texto em Gasoek One, **até 4 palavras: o nome da história ou do personagem que se busca (a âncora: ELIAS, PEDRO, LÁZARO) mais 1 a 3 palavras de tensão** (número, pergunta, contraste), com o azul `#2383E2` como destaque. Personagens no traço de tinta de `lib.js`. (Giovanni, 12/11/2026, sistema de capa da pesquisa de plataformas: as capas antigas eram enigmas sem sujeito, como "DUAS PALAVRAS", e na busca por Elias 12 de 15 miniaturas do nicho trazem o nome escrito.)
- **O texto completa o título:** pode repetir uma palavra dele (o nome), nunca a frase inteira. Teste: quem só vê a capa sabe dizer qual é a história.
- A capa promete só o que o vídeo mostra.

**Muda conforme a história:**
- Fundo claro ou escuro pelo clima dela; noite, morte e juízo pedem escuro. Fundo calmo: raios só quando ajudam.
- **Um herói só, grande:** um rosto ou um objeto da história, com 45% ou mais da altura (ou rosto com 25% ou mais); no máximo 3 elementos (herói, um contexto, texto). Rosto só com a emoção que o conteúdo tem (não a mesma cara de susto em tudo). **Ação, não pose:** mostrar o verbo da história (o fogo caindo, a água derramada, a pedra rolando).
- **Paleta de capa, não de cena:** um acento quente saturado (fogo `#FF6A13`, ouro `#FFB21E`) ou a água azul da marca em 15% ou mais do quadro, sobre fundo escuro ou complementar; nada de bege sobre bege (12/11/2026).
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
- **Texto:** Gasoek One, até 4 palavras com o nome da história (regra de 12/11/2026, acima), branco com contorno escuro grosso e sombra; a palavra-chave numa etiqueta azul `#2383E2` com borda preta, sombra dura e inclinada. De preferência, uma pergunta ou um mistério que o vídeo responde.
- Texto de um lado e herói do outro; o canto de baixo à direita fica livre (duração).
- Render: `ESCALA=2 node capa.cjs <ep> miniatura-<x>` (2560×1440). O JPG fica abaixo de 2 MB, para subir pelo celular.
- Antes de entregar: `tools/testar_capa.py` (168×94 e preto e branco) e uma folha com a miniatura no meio de miniaturas do nicho na busca do YouTube, para ver se ela se destaca.

**Três variantes com três motivos e três layouts** (12/11/2026): espetáculo (o momento mais visual), confronto (quem contra quem) e curiosidade (o detalhe estranho). Mudam o herói, o lado, o fundo e o tipo de texto, não só a palavra; a mais segura sobe primeiro, porque fica se o "Testar e comparar" der inconclusivo. Antes de entregar, a folha de feed: a miniatura no meio de 14 do nicho na mesma busca.

**Varia (nunca 100% igual):** cada miniatura nova muda pelo menos 2 destes itens em relação às 3 últimas do canal (critério sugerido pelo Claude).
- A cor da luz e do fundo, pelo clima da história: noite azul-escura, madrugada dourada, nascer do sol quente, entardecer, escuro total.
- O lado do texto (esquerda ou direita) e a linha da etiqueta azul (primeira ou segunda), com inclinação para um lado ou para o outro.
- O enquadramento: close de rosto, plano médio, objeto em primeiro plano.
- O herói: uma pessoa, um objeto (bolsa de moedas, pedra, véu, cruz) ou um lugar.
- Os detalhes de emoção: suor, lágrimas, moedas no ar, poeira, raios de luz.
- O tipo de texto: pergunta ("QUEM ABRIU?"), afirmação forte ("PAGOS PRA MENTIR") ou contradição do título.

**Formatos:**
- Vídeo longo: 1280×720, nada importante no canto de baixo à direita (a duração do YouTube cobre). Fazer 3 versões, cada uma com um motivo diferente para clicar, para o "Testar e comparar" do YouTube Studio.
- Short e TikTok: 1080×1920, tudo o que importa no miolo 3:4 (y 240 a 1680), que é o recorte da grade do perfil. Sem referência bíblica e sem logo. No Short a capa pesa pouco: quem decide é o primeiro quadro. **No TikTok e no Reel, a capa faz o papel do título** (a grade não mostra título): o nome da história no terço de cima, com letra de 190 px ou mais, sempre na mesma posição em toda a série; canto de baixo à esquerda livre (o contador de views da grade).

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
- Narração em partes, uma por capítulo do roteiro, entregue em blocos de código. Sem acelerar. De 4 a 5 min, nunca mais de 5, contando o cartão final (regra de 06/11/2026). Exceção aprovada pelo Giovanni em 12/11/2026, um teste só: a "história completa" da Paixão de 10 a 20 min, só no YouTube (ver "Formato e testes aprovados"). Na prática: ~3.300 a 3.900 caracteres de narração (~830 por minuto).
- Cenas de explicação (cartões com os livros, versículos em cartão) valem aqui, porque são a cena inteira e não algo por cima da ilustração.
- Quando o roteiro vier de fora, confira tudo na NVI antes de produzir e diga o que foi corrigido.
- Miniatura 1280×720 pela regra da capa acima, em 3 versões para o "Testar e comparar".
