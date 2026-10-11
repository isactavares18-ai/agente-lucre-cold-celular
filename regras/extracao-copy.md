# Como ler os documentos de copy

## O que chega por projeto

- `Página de Vendas | <Projeto>.docx` ou `.pdf`: a copy da página. **É a fonte principal.**
- `VSL | <Projeto>.docx`: o roteiro do vídeo. **Fonte secundária**: só para os microtextos de apoio e a linha do tempo.
- (às vezes) `Página de Upsell | <Projeto>`.
- `briefing.md`: dados técnicos preenchidos pelo usuário (fica em `projeto/briefing.md`; modelo em `modelos/briefing.md`).

Para ler `.docx`, use `pandoc arquivo.docx -t markdown --wrap=none`. Para `.pdf`, use `pdftotext -layout`.

## Como o documento marca as coisas

| No documento | Significa |
|---|---|
| Primeiro parágrafo em **negrito** | Headline (h1) |
| Parágrafo logo abaixo | Subheadline |
| Caixa/tabela com "VÍDEO DE VENDAS" | Lugar da VSL |
| Caixa/tabela com texto em MAIÚSCULAS e negrito | **Botão de CTA**, com esse texto exato |
| Tabela 2×2 "VÍDEO DEPOIMENTO 01…04" | Grade de depoimentos em vídeo |
| Tabela de 3 colunas depois de "…e receba:" | Os 3 cards de entregáveis (1ª linha = título, 2ª = texto) |
| Títulos em negrito no meio do texto | Título de seção (h2) |
| "12x de R$ … ou R$ … à vista" | Preço |

## Corte: o que IGNORAR

Pare de extrair a página quando encontrar qualquer um destes marcadores. Nada disso entra na página:

- **"Checkout"** e tudo que vem depois (headline, imagem, bullets e depoimentos do checkout): o checkout é feito na plataforma de pagamento, fora da fábrica.
  - **Exceção (regra da fábrica):** a lista de passos do checkout (ex.: "COMO FATURAR… 1. Pegue seu link… 2. …")
    **pode e deve** ser reaproveitada na seção opcional `como_funciona`, com o texto literal dos passos.
    Ela dá mais estrutura e robustez à página. O resto do checkout continua ignorado.
- **"VARIAÇÕES PARA TESTES A/B"**, **"HEADLINES ALTERNATIVAS"**, **"CTAs ALTERNATIVOS"**, **"HOOKS ALTERNATIVOS"**.
- **"ÂNGULOS PARA DIFERENTES PERFIS DE PÚBLICO"**.
- **"JUSTIFICATIVAS PERSUASIVAS (NOTAS DO COPYWRITER)"**.

Essas partes podem ser **lidas como contexto** para entender o público e o conceito (ajudam no tema visual),
mas nunca são copiadas para a página.

## Saída da extração

1. `src/dados/conteudo.json` no formato de `regras/estrutura-vendas.md`.
2. `pendencias.md` com tudo que falta, separado em:
   - **Bloqueia o preview**: link de checkout, ID/script da VSL, preço, nome do produto.
   - **Pode ir com espaço reservado**: fotos, IDs dos depoimentos no Vimeo, logo, pixel, minutagem do delay.
3. Um resumo curto para o usuário: seções encontradas, seções opcionais ativadas e o porquê, pendências.

## Conferências obrigatórias

- O preço aparece igual em todos os lugares (oferta, FAQ, CTA fixo)? O parcelado bate com o à vista?
- O nome do produto está escrito igual em toda a página?
- O ano do rodapé está certo?
- Algum texto sobrou de outro projeto?
