# pregaai-videos

Vídeos curtos do PregaAI para TikTok e Shorts. Como rodar e como montar um episódio está no README. Aqui ficam as decisões do Giovanni, que valem para todo episódio novo.

## Fluxo

- **Vídeo aprovado → capa junto.** Quando o Giovanni disser que um vídeo ficou bom e pedir para salvar, faça commit e push do episódio **e** gere a capa no estilo abaixo (`episodios/<ep>/capa.html` + `node capa.cjs <ep>`), e mande os dois.
- Confira todo texto bíblico na NVI (`assets/bible/nvi.json` do repo `pregaai`). Toda afirmação do roteiro tem que estar no texto. Se for inferência, escreva de um jeito que não afirme mais do que a Bíblia diz.
- Texto visível sem travessão (decisão de 15/10/2026). Número na tela só com fonte real.

## Vídeo (aprovado em 28/10/2026, referência: `episodios/morte-de-acabe`)

- Desenho com traço de tinta e os personagens de `lib.js`. **Poucos elementos por cena**: sem contadores, selos, brilhos ou cartões por cima da ilustração. O cartão final com a Google Play é a exceção.
- Legenda só com o texto, sem cartão. A palavra que está sendo falada fica azul. A referência bíblica aparece pequena no alto, só quando a passagem muda.
- Roteiro curto: ~110 palavras e cenas de 1 a 4 s. Narração gerada em velocidade 1,0, com `SPEED = 1.25` no `data.js`.
- Narração humanizada: escreva como quem conta para um amigo ("pra", "tá", "você", pergunta direta), com frases curtas. Nada de tom de locutor.

## Capa (aprovada em 28/10/2026, referência: `episodios/morte-de-acabe/capa.html`)

Sempre neste estilo:
- Fundo claro e quente (creme para pêssego), com raios brancos saindo do rosto do personagem central.
- O rosto do personagem bem grande, com emoção clara (medo, choque), ocupando a metade de baixo.
- Um objeto da história (flecha, seta) em amarelo e vermelho saturados, com contorno preto grosso, apontando para o rosto. É o que guia o olho.
- Texto em Gasoek One, de 2 a 3 palavras: a linha de cima em preto com sombra branca dura, e a palavra-chave num bloco azul `#2383E2` inclinado, com borda e sombra pretas.
- **O texto soma ao título, nunca o repete.** Ele contradiz ou completa (título "Uma flecha ao acaso matou o rei Acabe", capa "NÃO FOI ACASO").
- Tudo o que importa fica no miolo 3:4 (y 240 a 1680), que é o recorte da grade do perfil no TikTok. Sem referência bíblica e sem logo na capa.
