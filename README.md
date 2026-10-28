# pregaai-videos

Gerador dos vídeos curtos do PregaAI (TikTok e YouTube Shorts, 1080×1920, 30 fps).
Cada quadro é uma função pura do tempo: as cenas são SVG e HTML montados em
`index.html`, o Playwright tira a foto de cada quadro e o ffmpeg junta tudo com a
narração.

## Rodar

Precisa de Node 22, ffmpeg e o Chromium do Playwright (`require('playwright')`).

```bash
npm i                                  # fontes da marca (Geist, Lora, Gasoek One, Geist Mono)
bash build.sh valentes-de-davi-2       # gera out/valentes-de-davi-2.mp4 (~3 min em 4 núcleos)
node preview.cjs valentes-de-davi-2 2.5 41.9   # quadros soltos em prev/, para revisar
bash sheet.sh 6                        # junta prev/ numa folha só (sheet.png)
```

## Estrutura

| Arquivo | O que tem |
|---|---|
| `lib.js` | Paleta, pessoas, cenário (caverna, cidade, tenda, poço, oliveira), fundos, câmera, cartão de versículo, cartão final, legenda |
| `index.html` | CSS dos componentes da marca e o laço que desenha cada quadro (`renderFrame(t)`) |
| `episodios/<ep>/data.js` | A narração em frases (`SEGS`), a duração e a velocidade final (`SPEED`) |
| `episodios/<ep>/scenes.js` | As cenas do episódio e a linha do tempo (`SCENES`) |
| `episodios/<ep>/narration.mp3` | Narração da ElevenLabs |
| `episodios/<ep>/roteiro.md` | Roteiro com referências |
| `tools/` | Medir as frases no áudio e transcrever com Whisper |

## Episódio novo

1. **Roteiro**: cada frase com a referência bíblica. Confira cada afirmação no texto (`assets/bible/nvi.json` do app tem a NVI).
2. **Narração**: gere na ElevenLabs a partir do roteiro e salve em `episodios/<ep>/narration.mp3`.
3. **Frases no tempo**: `python3 tools/segmentos.py episodios/<ep>/narration.mp3` devolve o início e o fim de cada trecho de fala.
4. **Conferir o texto**: `python3 tools/transcrever.py episodios/<ep>/narration.mp3 "<saída do passo 3>"`. A legenda tem que bater com o que a voz falou.
5. **`data.js`**: um item por trecho, `[início, fim, 'texto']`. Na legenda, `|` quebra em blocos (até ~28 letras cada) e `!` no começo esconde a legenda quando a cena já mostra o texto. A palavra que está sendo falada fica azul sozinha.
6. **`scenes.js`**: as cenas e a lista `SCENES` (início, fim, referência, `dark` para cenas noturnas). Sincronize animações com `wordTime(índiceDaFrase, 'palavra')`. Comece cada cena pelo índice da frase (`SEGS[i][0]`), assim trocar os tempos pelos do áudio real reposiciona tudo.
7. Revise com `preview.cjs` e `sheet.sh`, depois `bash build.sh <ep>`.

## Regras

- **Identidade**: os tokens vêm de `docs/design.md` e `src/constants/theme.ts` do app. São o fundo `#F8F7F4`, o azul `#2383E2` com a escala pastel (300 `#AAD1FF`, 600 `#0675D3`), borda de 1 px com sombra dura sem blur e o peixe e o wordmark de `src/components/ui/FishGlyph.tsx`. Personagens com traço de tinta `#37352F`.
- **Zonas seguras**: o TikTok e o Shorts cobrem o topo (até ~160 px), a coluna direita (x > ~950 entre y 900 e 1560) e a faixa de baixo (y > ~1500). A legenda fica entre 1286 e ~1450.
- **Pouca coisa na tela**: ilustração, legenda só com o texto e a referência bíblica discreta no alto, só quando a passagem muda. Sem cartões, selos ou contadores por cima da cena (o cartão final é a exceção).
- **Texto visível sem travessão** (decisão do Giovanni em 15/10/2026). Use ponto, vírgula, dois-pontos ou parênteses.
- **Número na tela só com fonte real**, como no app.

## Limites conhecidos

- O início e o fim de cada frase são medidos no áudio. O tempo de cada palavra dentro da frase é estimado pelas sílabas, então pode errar ~0,1 s.
- Sem música de fundo: dá para pôr direto no app da plataforma.
