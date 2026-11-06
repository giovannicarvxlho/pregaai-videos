# pregaai-videos

Gerador dos vídeos curtos do PregaAI (TikTok e YouTube Shorts, 1080×1920, 30 fps).
Cada quadro é uma função pura do tempo: as cenas são SVG e HTML montados em
`index.html`, o Playwright tira a foto de cada quadro e o ffmpeg junta tudo com a
narração.

## Rodar

Precisa de Node 22, ffmpeg, bash (no Windows, o Git Bash), Python 3 e o Chromium do Playwright.

**Uma vez por máquina** (no computador; na nuvem do Claude Code o navegador já vem instalado):

```bash
npm i                                        # Playwright e fontes da marca (Geist, Lora, Gasoek One, Geist Mono)
npx playwright install chromium              # o navegador que fotografa os quadros
python3 -m pip install -r tools/requirements.txt   # Whisper (sherpa-onnx) e Pillow
python3 tools/baixar_modelo.py               # modelo do Whisper em tools/modelos
npm run checar                               # confere tudo e diz o comando de cada item faltando
```

No Windows, se `python3` não existir, use `python`. O `checar` avisa.

**Narração pela API:** precisa de plano pago na ElevenLabs (no Free, a API não usa vozes da Voice Library). Crie uma chave em elevenlabs.io (Developers > API Keys) e salve num arquivo `.env.local` na raiz do repo, que fica fora do git:

```
ELEVENLABS_API_KEY=sua-chave
```

Na nuvem do Claude Code a chave vem do ambiente e não precisa disso.

**No dia a dia:**

```bash
bash build.sh valentes-de-davi-2       # gera out/valentes-de-davi-2.mp4 (~3 min em 4 núcleos)
node preview.cjs valentes-de-davi-2    # um quadro do meio de cada cena em prev/
node preview.cjs valentes-de-davi-2 2.5 41.9   # ou só os instantes que você quer ver
bash sheet.sh 6                        # junta prev/ numa folha só (sheet.png)
node capa.cjs valentes-de-davi-2      # capa (miniatura) a partir de episodios/<ep>/capa.html, em out/
```

## Estrutura

| Arquivo | O que tem |
|---|---|
| `lib.js` | Paleta, pessoas, cenário (caverna, cidade, tenda, poço, oliveira), fundos, câmera, cartão de versículo, cartão final, legenda |
| `index.html` | CSS dos componentes da marca e o laço que desenha cada quadro (`renderFrame(t)`) |
| `episodios/<ep>/data.js` | A narração em frases (`SEGS`), a duração e a velocidade final (`SPEED`) |
| `episodios/<ep>/scenes.js` | As cenas do episódio e a linha do tempo (`SCENES`) |
| `episodios/<ep>/narracao.txt` | O texto que a voz lê (o `narrar.py` gera o mp3 a partir dele) |
| `episodios/<ep>/narration.mp3` | Narração da ElevenLabs |
| `episodios/<ep>/roteiro.md` | Roteiro com referências |
| `episodios/<ep>/capa.html` | Capa do episódio (texto do gancho no miolo 3:4, que é o recorte da grade do TikTok) |
| `tools/` | Conferir a máquina (`checar.cjs`), abrir o navegador (`navegador.cjs`) e gerar a narração na ElevenLabs (`narrar.py`); medir as frases no áudio e transcrever com Whisper; no vídeo longo, juntar as partes da narração (`juntar.py`) e medir todas as frases de uma vez (`alinhar.py`) |

## Episódio novo

1. **Roteiro**: cada frase com a referência bíblica. Confira cada afirmação no texto (`assets/bible/nvi.json` do app tem a NVI).
2. **Narração**: escreva o texto aprovado em `episodios/<ep>/narracao.txt` (uma frase por linha, do jeito que a voz deve ler) e rode `python3 tools/narrar.py episodios/<ep>`. Ele gera o `narration.mp3` com a voz e os ajustes aprovados, mostra quantos caracteres vai gastar e não sobrescreve mp3 que já existe (`--refazer` gera de novo).
3. **Frases no tempo**: `python3 tools/segmentos.py episodios/<ep>/narration.mp3` devolve o início e o fim de cada trecho de fala.
4. **Conferir o texto**: `python3 tools/transcrever.py episodios/<ep>/narration.mp3 "<saída do passo 3>"`. A legenda tem que bater com o que a voz falou.
5. **`data.js`**: um item por frase, `[início, fim, 'texto']`. Se a voz pausar dentro da frase (o `segmentos.py` mostra dois trechos), junte e passe o trecho de cada bloco `|` no 4º item: `[início, fim, 'texto | resto', [[a1, b1], [a2, b2]]]`. Na legenda, `|` quebra em blocos (até ~28 letras cada) e `!` no começo esconde a legenda quando a cena já mostra o texto. A palavra que está sendo falada fica azul sozinha.
6. **`scenes.js`**: as cenas e a lista `SCENES` (início, fim, referência, `dark` para cenas noturnas). Sincronize animações com `wordTime(índiceDaFrase, 'palavra')`. Comece cada cena pelo índice da frase (`SEGS[i][0]`), assim trocar os tempos pelos do áudio real reposiciona tudo.
7. Revise com `preview.cjs` e `sheet.sh`, depois `bash build.sh <ep>`.

## Como escrever o `scenes.js`

O `index.html?ep=<ep>` carrega o `data.js`, o `lib.js` e o `scenes.js` do episódio e chama `renderFrame(t)` a cada quadro. O `t` é o tempo do áudio em segundos, antes do `SPEED`. Cada quadro tem que sair só do `t`: o render divide os quadros entre vários navegadores, então nada de estado entre quadros nem `Math.random()` (use `rng(seed)`).

- **Cena:** `function scNome(t) { ...; return { svg, html } }`. O `svg` é o desenho, nas coordenadas do quadro (`W`×`H`: 1080×1920 ou 1920×1080). O `html` é para cartões (`verseCard`, `endCard`) e quase sempre fica `''`.
- **Linha do tempo:** `const SCENES = [{ a, b, f, ref, dark, end }]`, com início e fim em segundos, a função da cena, a referência do alto (texto, `null` ou `[[t, 'ref'], ...]` quando muda dentro da cena), `dark: true` para legenda clara em cena escura e `end: true` no cartão final. A troca de cena é um fade de 0,32 s.
- **Tempo:** `const at = (i) => SEGS[i][0] - 0.25` começa a cena um pouco antes da frase `i`; `wordTime(i, 'palavra')` dá a hora de uma palavra para sincronizar um gesto. `prog(t, a, b)` vai de 0 a 1 nesse intervalo; `E.out`, `E.in`, `E.sine` e `E.back` suavizam; `lerp`, `clamp` e `pop(t, t0)` completam.
- **Câmera:** devolva a cena dentro de `cam(svg, cx, cy, zoom)` com um zoom lento (de 1,0 a ~1,1) para nada ficar parado.
- **Fundos:** `bgDay`, `bgDusk`, `bgNight`, `bgDark`, `bgGloom`, `floor`, `hills`, `hill`, `clouds`, `sun`, `moon`, `stars`.
- **Pessoas:** `person({ x, y, s, robe, skin, hair, beard, mood, look, armL, armR, kneel, walk, lean, gear, sil, flip })`, com os pés em (x, y) e ~300 px de altura em `s = 1`. As opções estão comentadas no `lib.js`. Personagem do episódio vira constante (`const ACABE = { robe: C.r600, ... }`).
- **Cenário e objetos:** `city`, `tent`, `well`, `olive`, `cave`, `throne`, `chariot`, `sheep`, `dog`, `archer`, `arrow`, `jar`, `flames`, `smoke`, `embers`, `dust`, `beam`, `crossFig`, `thornCrown`, `veil`. Peça que não existe entra no `lib.js`, no mesmo traço.
- **Cores e traço:** só da paleta `C` (`C.ink`, `C.paper`, `C.b500`...), contorno com `ink(5)`.
- **Fim:** `endCard(t, AUDIO_END + 0.2, ['Livro 1', 'Livro 2'])`; com `{ semApp: true }` sai sem a Google Play.

O jeito mais rápido de acertar é copiar o `scenes.js` de `episodios/morte-de-acabe` e trocar as cenas uma a uma.

## Vídeo longo (16:9)

`const FORMAT = 'wide'` no `data.js` muda o quadro para 1920×1080 (o `data.js` carrega antes do `lib.js`).
Os Shorts não mudam: sem `FORMAT`, tudo continua em 1080×1920.

1. **Narração em partes**: uma por capítulo do roteiro, salvas em `episodios/<ep>/partes/01.mp3`, `02.mp3`... O `narrar.py` faz isso quando o `narracao.txt` tem as partes separadas por uma linha `---`.
2. **Juntar**: `python3 tools/juntar.py episodios/<ep>` gera o `narration.mp3` com 0,8 s entre as partes (o `build.sh` também junta, se o arquivo não existir).
3. **Medir**: `python3 tools/alinhar.py episodios/<ep>` corta o áudio nas pausas, transcreve com Whisper, alinha com o texto do `data.js` e reescreve o `SEGS` com os tempos reais (~6 min para 8 min de áudio). Ele avisa as frases com poucas palavras reconhecidas, para conferir.
4. **Cenas**: `L(parte, linha)` dá o índice da frase em `SEGS` (o `PARTS` do `data.js` guarda onde cada parte começa).
5. **Trechos**: `T0=400 T1=460 bash build.sh <ep>` gera só esse intervalo (`out/<ep>-400.mp4`), para revisar sem renderizar o vídeo todo.

## Regras

- **Identidade**: os tokens vêm de `docs/design.md` e `src/constants/theme.ts` do app. São o fundo `#F8F7F4`, o azul `#2383E2` com a escala pastel (300 `#AAD1FF`, 600 `#0675D3`), borda de 1 px com sombra dura sem blur e o peixe e o wordmark de `src/components/ui/FishGlyph.tsx`. Personagens com traço de tinta `#37352F`.
- **Zonas seguras**: o TikTok e o Shorts cobrem o topo (até ~160 px), a coluna direita (x > ~950 entre y 900 e 1560) e a faixa de baixo (y > ~1500). A legenda fica entre 1286 e ~1450.
- **Pouca coisa na tela**: ilustração, legenda só com o texto e a referência bíblica discreta no alto, só quando a passagem muda. Sem cartões, selos ou contadores por cima da cena (o cartão final é a exceção).
- **Texto visível sem travessão** (decisão do Giovanni em 15/10/2026). Use ponto, vírgula, dois-pontos ou parênteses.
- **Número na tela só com fonte real**, como no app.

## Limites conhecidos

- O início e o fim de cada frase são medidos no áudio. O tempo de cada palavra dentro da frase é estimado pelas sílabas, então pode errar ~0,1 s.
- Sem música de fundo: dá para pôr direto no app da plataforma.
