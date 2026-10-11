# Erros e aprendizados

Leia inteiro antes de cada página. Cada linha é algo que já deu errado ou que o usuário corrigiu.
Formato: `- AAAA-MM-DD · [área] · o que não fazer → o que fazer`

- 2026-09-25 · [extração] · Os documentos trazem a copy do checkout depois da página → ignorar tudo a partir de "Checkout" (o checkout é feito na plataforma de pagamento, fora da fábrica).
- 2026-09-25 · [extração] · O documento pode trazer headlines/CTAs alternativos para teste A/B → nunca usar como texto da página.
- 2026-09-25 · [técnico] · Uma das primeiras páginas saiu sem o delay e sem o pixel → os dois estão no checklist do preview; pendência obrigatória se faltar dado.
- 2026-09-25 · [técnico] · O servidor local caía porque o script ficava em pasta temporária → o preview local roda com `npm run dev` na raiz do repositório.
- 2026-09-28 · [design] · `frase-destaque` saiu com texto branco numa seção clara (contraste 1.04:1, ilegível) → toda cor de texto tem que ser conferida **na seção em que o bloco realmente cai**, não no padrão do componente.
- 2026-09-28 · [design] · `**negrito**` dentro de `entregaveis.itens[].lista` quebrava o item em duas colunas tortas (o `<li>` é flex e cada nó virava um item) → o conteúdo do `<li>` vai sempre dentro de um único `<span>`.
- 2026-09-28 · [design] · A imagem do `proposito` saiu esmagada: o componente tinha `width`/`height` fixos de outra imagem → passar a largura e a altura reais do arquivo (`proposito.largura`/`altura`).
- 2026-09-28 · [design] · Cards de painel com textos de tamanhos diferentes ficaram com "informação jogada" → card vira coluna flex, ganha ícone e as etiquetas vão para o rodapé, igualando a altura.
- 2026-09-28 · [diagramação] · Parágrafos longos centralizados no celular (garantia, bônus, oferta, urgência) → texto corrido com mais de 3 linhas sempre alinhado à esquerda. O template já faz isso; confira com `npm run conferir`.
- 2026-09-28 · [diagramação] · Título terminando com uma palavra sozinha na linha → o template junta as duas últimas palavras sozinho. Se ainda acontecer, o `npm run conferir` avisa.
- 2026-09-28 · [processo] · Preview entregue sem o agente olhar a própria página → **proibido**: sempre rodar `npm run conferir`, olhar todos os prints e corrigir antes de mandar ao usuário (`regras/diagramacao.md`).
