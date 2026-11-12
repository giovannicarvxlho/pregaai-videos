# Publicação: <título do episódio>

<!--
Modelo do documento de publicação (pedidos do Giovanni em 06/11/2026). Copie para episodios/<ep>/publicacao.md,
preencha e apague estes comentários. O tools/pacote.py corta este arquivo nas seções "## YouTube", "## TikTok" e
"## Instagram" e gera um .txt para cada rede, dentro da pasta dela (texto puro para copiar e colar; o que está entre
``` sai igual).
O cabeçalho (até a primeira seção) entra nos três; a "Conferência na NVI" fica só no repositório.

Regras que valem para todas as redes:
- Sem travessão em nenhum texto. Toda afirmação bíblica conferida na NVI (tabela no fim).
- Palavra-chave principal: como o público busca a história (ex.: "o que aconteceu depois que Jesus morreu").
  Ela aparece no título, na primeira linha da descrição ou da legenda, no texto da capa ou da tela e na fala.
  É a principal forma de ser achado; hashtag só classifica o vídeo e ajuda a busca, não dá alcance.
- Hashtags: poucas, específicas, as mesmas palavras que alguém buscaria. Nunca #fyp, #viral, #foryou.
- Cada número e cada promessa do texto tem que estar no vídeo. A capa e o título prometem só o que o vídeo mostra.
- Horários: os da seção "Horários e a evidência" de projetos/pregaai-calendario.md no MARK1, que o fechamento da noite
  e o /semana atualizam com os resultados. Sem acesso ao MARK1: no TikTok, 12 h, 19 h ou 21 h de Brasília (seguidores
  online de 04 a 09/11/2026, pela Windsor: 95% a 99% do pico; das 14 h às 16 h, ~85%; da 1 h às 6 h, menos de 50%).
  Instagram e YouTube ainda não têm dado próprio por hora. O longo sai primeiro; os curtos levam para ele.
- Regras da análise de 07/11/2026 (o Giovanni decidiu seguir as recomendações; dados no MARK1, projetos/pregaai-canais.md):
  - TikTok: os curtos saem a partir de 24 h depois do longo, nunca no mesmo dia, e sem "parte N" no título (teste:
    depois do viral, os vídeos vão quase só para quem já segue, e tudo no mesmo dia vai para o mesmo público).
  - TikTok: o vídeo termina na última fala, sem cartão final e sem pedido falado depois dela (com cartão, 1,8% a 5,3%
    assistiram inteiro; sem, 10,5% e 12,5%).
  - Cada curto abre com a própria frase de gancho e tem o próprio título fixo; nenhum curto começa no meio da narração.
  - Curtos compostos na vertical, sem faixas, nas três redes (layout "foco" do tools/corte.cjs, com o texto do gancho
    no 1º quadro; saída <ep>-curto-<n>-ig; o pacote.py põe essa versão nas pastas youtube/, tiktok/ e instagram/).
    Decisão do Giovanni em 12/11/2026, no lugar da tela cheia de 11/11. Limites de duração por rede: "Especificações por
    rede" no AGENTS.md.
  - App: o texto diz "Na Google Play: procure PregaAI", nunca "Android" nem "Play Store" (regra de marca do Google).
    Vídeo com o banner do selo e sem cartão final (o longo do TikTok e todos os curtos) leva, na última linha da
    legenda ou da descrição: "Google Play e o logotipo do Google Play são marcas da Google LLC."
- TikTok: não dá mais para fixar comentário (o Giovanni tentou de várias formas em 09/11/2026; a opção sumiu para a
  maioria das contas). O texto que ia fixado vai como resposta do perfil ao primeiro comentário. YouTube e Instagram
  continuam fixando.
- Capas: regras de estilo e tamanhos em "Capa e miniatura" e "Capas por rede" no AGENTS.md.
- Referências: episodios/depois-da-cruz/roteiro.md (seção Publicação, longo aprovado em 06/11) e
  episodios/morte-de-jezabel/roteiro.md (descrição de curto aprovada em 28/10).
- No Claude Code, use as skills social-media-skills:youtube-publishing-and-metadata, tiktok-video-publishing,
  instagram-reels-publishing e hashtag-strategy. Quando discordarem dos dados do canal
  (MARK1, projetos/pregaai-canais.md) ou da regra oficial da plataforma, valem os dados e a regra oficial.
-->

**Episódio:** <nome> · **Palavra-chave principal:** <...> · **Base bíblica:** <livro capítulo:versículos>

## YouTube

**Quando postar**

| Quando | Vídeo | Capa |
|---|---|---|
| AAAA-MM-DD 12:00 | `youtube/longo.mp4` | `youtube/miniatura-a.jpg` (b e c no Testar e comparar) |
| AAAA-MM-DD 19:00 | `youtube/curto-01.mp4` (Shorts) | quadro de ~<s> s, escolhido no app |

### Vídeo longo: `youtube/longo.mp4`

**Título** <!-- até 100 caracteres; palavra-chave nos primeiros ~40; 50 a 60 no total; clareza antes de esperteza. Pode terminar em "| Histórias Bíblicas". -->
> <título>

**Miniaturas para o "Testar e comparar"** <!-- 3 versões 2560×1440, cada uma com um motivo diferente para clicar; sobem nesta ordem e a primeira fica se não houver vencedora; nada importante no canto de baixo à direita. -->

| Ordem | Arquivo | Texto | Motivo para clicar |
|---|---|---|---|
| 1 | `youtube/miniatura-a.jpg` | <TEXTO> | <...> |
| 2 | `youtube/miniatura-b.jpg` | <TEXTO> | <...> |
| 3 | `youtube/miniatura-c.jpg` | <TEXTO> | <...> |

**Descrição** <!-- até 5.000 caracteres. 1ª linha: o gancho. Linhas 2 e 3: a palavra-chave, natural. Depois: o que o vídeo mostra,
📖 Base bíblica, capítulos (começam em 00:00, pelo menos 3, cada um com 10 s ou mais, com nomes que alguém buscaria),
📱 o app com utm, e 3 hashtags no fim (as 3 primeiras aparecem acima do título). -->
```
<descrição>

📖 Base bíblica: <referências>

⏱️ Capítulos
00:00 <nome>
00:00 <nome>
00:00 <nome>

📱 Quer ler essa história direto na Bíblia, um pouco por dia? Baixe o PregaAI: pregaai.com/?utm_source=youtube&utm_medium=descricao

#históriasbíblicas #<tema> #bíblia
```

**Tags** <!-- até 500 caracteres somando todas; a 1ª é a palavra-chave principal exata; depois personagens, lugares, livros e variações da busca. -->
```
<palavra-chave principal>, <personagem>, <livro capítulo>, histórias bíblicas, histórias da bíblia, bíblia
```

**Configurações:** categoria Educação (sugestão); "Conteúdo para crianças": Não (é regra legal, marcar com verdade; o público do canal é adulto); "Conteúdo alterado ou sintético": Sim; legenda `youtube/legenda.srt`, se houver.

**Comentário fixado**
```
<pergunta que puxa comentário ou a chamada do app>
```

### Shorts

<!-- Um bloco por curto. Shorts vão até 3 min. Short com mais de 1 min e qualquer reivindicação de Content ID fica
bloqueado no mundo todo: a música só vem do pipeline. Não sobe capa por arquivo: quem decide é o primeiro quadro.
Descrição no modelo aprovado em 28/10 (ver AGENTS.md); "Histórias bíblicas em menos de 1 minuto:" só quando o curto
tiver menos de 1 min. -->

#### Curto 1: `youtube/curto-01.mp4`

**Título** <!-- até 100 caracteres; o gancho com a palavra-chave -->
> <título>

**Descrição**
```
<gancho numa linha>

<parágrafo da história>

<virada ou lição>

📖 Base bíblica: <referências>

<pergunta para quem assiste> 👇

#históriasbíblicas #shorts #fé #bíblia #<personagem>

Google Play e o logotipo do Google Play são marcas da Google LLC.
```

**Capa:** escolha no app o quadro de ~<s> s. **Vídeo relacionado:** o longo, depois de publicado. **Comentário fixado:** <...>

## TikTok

<!-- Legenda até 4.000 caracteres, mas só os primeiros ~100 aparecem: a palavra-chave vai ali, não um suspense vazio.
Ela também tem que estar no texto da tela e na fala (o TikTok lê os três). 3 a 5 hashtags tratadas como palavra-chave.
Capas 1080×1920 com o texto no miolo 3:4 (o recorte do perfil); sobem como imagem no editor de capa, e se o app não
deixar, use o quadro indicado e escreva o texto no editor. Configurações: divulgação de conteúdo comercial LIGADA
quando o vídeo fala do app ou tem o banner de CTA (regra oficial); rótulo de IA opcional, porque a animação não é
realista; comentários, dueto e costura ligados. -->

**Quando postar**

| Quando | Vídeo | Capa |
|---|---|---|
| AAAA-MM-DD 12:00 | `tiktok/longo.mp4` | `tiktok/longo-capa.jpg` |
| AAAA-MM-DD (dia seguinte ou depois) 19:00 | `tiktok/curto-01.mp4` | `tiktok/curto-01-capa.jpg` |

### Longo: `tiktok/longo.mp4`

**Legenda**
```
<palavra-chave e gancho nos primeiros ~100 caracteres>

<o que o vídeo mostra>

📖 Base bíblica: <referências>

<pergunta> 👇

#históriasbíblicas #<tema> #<personagem> #fé #bíblia

Google Play e o logotipo do Google Play são marcas da Google LLC.
```

**Capa:** `tiktok/longo-capa.jpg`, com o texto "<TEXTO>" (se o app não aceitar imagem: o quadro de ~<s> s, com esse texto no editor de capa).

**Resposta do perfil ao primeiro comentário** <!-- o TikTok não deixa mais fixar comentário (09/11/2026) -->
```
📱 Quer ler essa história direto na Bíblia, um pouco por dia? O PregaAI monta um plano de leitura pra você e tem um devocional curto pra cada dia. Na Google Play: procure PregaAI. No iPhone: app.pregaai.com (link na bio).
```

**Configurações:** divulgação de conteúdo comercial <ligada ou desligada, e por quê>; rótulo de IA <sim ou não>.

### Curto 1: `tiktok/curto-01.mp4`

**Legenda**
```
<...>
```

**Capa:** `tiktok/curto-01-capa.jpg`. **Resposta ao primeiro comentário:** <...> **Configurações:** <...>

## Instagram

<!-- Só os curtos: o Instagram aceita vídeo mais longo, mas Reel com mais de 3 min não é recomendado a quem não segue
a conta. Legenda até 2.200 caracteres, com a palavra-chave na primeira linha. No máximo 5 hashtags (limite do
Instagram desde dez/2025). A capa sobe como capa personalizada, é escolhida antes de publicar e não dá para trocar
depois; o perfil corta em 3:4, então o texto fica no miolo. -->

**Quando postar**

| Quando | Vídeo | Capa |
|---|---|---|
| AAAA-MM-DD 19:00 | `instagram/curto-01.mp4` | `instagram/curto-01-capa.jpg` |

### Curto 1: `instagram/curto-01.mp4`

**Legenda**
```
<palavra-chave e gancho na primeira linha>

<a história em 2 ou 3 frases>

📖 <referências>

<pergunta> 👇

#históriasbíblicas #fé #bíblia #<personagem>

Google Play e o logotipo do Google Play são marcas da Google LLC.
```

**Capa:** `instagram/curto-01-capa.jpg`. **Configurações:** "Informação de IA" ligado (obrigatório: a narração tem voz realista); "Compartilhar no feed" ligado. Link da bio: `pregaai.com/?utm_source=instagram&utm_medium=bio`.

## Conferência na NVI

| Trecho da publicação | Fonte |
|---|---|
| <frase> | <livro capítulo:versículo> |
