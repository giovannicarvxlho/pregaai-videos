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
4. Depois do ok, sem parar: `python3 tools/narrar.py episodios/<ep>` → tempos e `data.js` → `scenes.js` → `node preview.cjs <ep>` + `bash sheet.sh 6`, olhando o `sheet.png` e corrigindo até ficar limpo → `bash build.sh <ep>` → capa (`capa.html`, `node capa.cjs <ep>`, `python3 tools/testar_capa.py`) → descrição da publicação no `roteiro.md`.
5. **Entrega**, numa mensagem só: o caminho do `out/<ep>.mp4`, da capa e do `sheet.png`, e a descrição pronta para colar. Não faça commit antes do ok dele no vídeo; com o ok, commit e push.
