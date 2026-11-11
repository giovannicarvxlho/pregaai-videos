---
name: episodio
description: Produz sozinho um episódio do PregaAI (Short ou vídeo longo) a partir de um tema ou passagem bíblica, do roteiro ao mp4 final, parando só para o Giovanni aprovar o roteiro. Use quando ele pedir um vídeo, um episódio ou uma história nova.
---

# /episodio <tema ou passagem>

Decisão do Giovanni (06/11/2026): rodar tudo sozinho e entregar o vídeo pronto. **A única parada é a aprovação do roteiro.** Fora ela, não pergunte, não peça confirmação e não entregue nada pela metade: leia o erro, corrija e rode de novo.

Siga o passo a passo "Como o vídeo é feito" do `AGENTS.md` e todas as regras de lá. Em resumo:

1. `npm run checar`. Se algo falhar e for coisa que você instala, instale. Se só o Giovanni resolve (chave ou plano da ElevenLabs), pare e diga exatamente o que ele precisa fazer.
2. Leia o `README.md` e o episódio de referência inteiros antes de escrever código.
3. **Parada única:** escreva `episodios/<ep>/roteiro.md` e `episodios/<ep>/narracao.txt`, confira na NVI e mostre o roteiro no formato de leitura. Espere o ok explícito dele sobre o texto. Se ele pedir mudança, ajuste os dois arquivos e mostre de novo, com o que mudou marcado.
4. Depois do ok, sem parar: `python3 tools/narrar.py episodios/<ep>` → tempos e `data.js` → `scenes.js` → `node preview.cjs <ep>` + `bash sheet.sh 6`, olhando o `sheet.png` e corrigindo até ficar limpo → `bash build.sh <ep>` (e a versão do TikTok e os curtos, quando houver) → as capas de cada rede ("Capas por rede" no AGENTS.md: miniaturas do YouTube, capa do TikTok para o longo e uma capa por curto; `node capa.cjs`, `python3 tools/testar_capa.py`) → `episodios/<ep>/publicacao.md` a partir de `modelos/publicacao.md`, plataforma por plataforma.
5. **Entrega**, tudo de uma vez: `python3 tools/pacote.py <ep>` e corrija o que ele avisar. Mande o caminho da pasta `out/pacote/...` (ou o zip único, na nuvem: um arquivo só, com as três pastas dentro, YouTube, TikTok e Instagram, cada uma com vídeos, capas e o seu .txt, direto na raiz do zip, sem pasta repetida; nunca um zip por rede) e o `sheet.png`. Não faça commit antes do ok dele; com o ok, commit e push.
