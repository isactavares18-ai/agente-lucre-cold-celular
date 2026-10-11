# Regras técnicas

## Stack

- **Astro** (site estático), um projeto por página, neste repositório (o modelo da fábrica, com o exemplo fictício em `modelos/exemplo/`).
- CSS próprio com variáveis (sem Tailwind/Bootstrap), JS puro, **Lenis** local para o scroll suave.
- Nada de CDN para o JS do site (exceto os players e os pixels).
- **Já implementado no template** (não reescreva, só configure no JSON): delay, pixel da Meta, GTM, player da vturb,
  iframes do Vimeo, repasse de UTMs para o checkout, CTA fixo no celular, espaços reservados.
- Mudança de layout ou de comportamento se faz **no componente** (`src/secoes/`), nunca editando o HTML gerado.
  Se a mudança servir para todas as páginas, avise o usuário que é uma melhoria para o modelo da fábrica.

## VSL (vturb / ConverteAI): padrão

O usuário cola no `briefing.md` o **código de embed** do painel da vturb. Dele saem:
- o `player_id` (ex.: `0123456789abcdef01234567`), usado em `<vturb-smartplayer id="vid-<player_id>">`;
- o `script_src` (ex.: `https://scripts.converteai.net/<conta>/players/<player_id>/v4/player.js`).

Carregue o script de forma assíncrona e adicione `preconnect` para `scripts.converteai.net`.
Exceção (outro player): siga o embed que o usuário mandar e anote em `erros.md` se precisar de algo diferente.

## Delay (elementos escondidos até o pitch)

- A **minutagem do pitch** vem de quem gravou a VSL, e o usuário coloca no `briefing.md` (ex.: `12:34` → `delay_segundos: 754`).
- Tudo marcado com **[D]** em `estrutura-vendas.md` recebe a classe `esconder`.
- Antes do delay ficam visíveis **somente**: barra de alerta, logo, headline, subheadline e VSL.
- O tempo conta pelo **tempo de vídeo assistido**, não pelo tempo na página (regra da fábrica). Use o recurso de
  exibir elementos ocultos da própria vturb, com o código que o painel gera para o player
  (o padrão atual é `player.displayHiddenElements(segundos, [".esconder"], { persist: true })` dentro do
  evento `player:ready`, **mas confira no painel**, porque é a vturb que dita a API).
- `persist: true`: quem já passou do pitch e recarrega a página vê tudo liberado.
- Ambiente de revisão: a URL `?semdelay=1` mostra tudo na hora, para o usuário revisar sem assistir ao vídeo.
  **Isso só funciona no preview**; em produção o parâmetro é ignorado.
- Sem minutagem no briefing, o preview sai **sem delay** e a pendência fica anotada. **Nunca vai para produção sem delay.**

## Depoimentos (Vimeo): padrão

`<iframe src="https://player.vimeo.com/video/<id>?title=0&byline=0&portrait=0" loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen>`
em uma caixa com proporção fixa. Se o vídeo for vertical, use a proporção 9:16. Exceção: siga o embed do briefing.

## Checkout

- Todos os CTAs de compra usam o `checkout_url` do briefing (normalmente `pay.hotmart.com/...`).
- **Repasse as UTMs**: os parâmetros da URL da página são adicionados ao link de checkout (já está no `main.js` do template).
- CTAs internos, como os do header e do meio da página, podem rolar até `#oferta` em vez de ir direto ao checkout,
  **se** o documento não indicar o contrário.

## Pixels e rastreio

- `pixel_meta_id` e/ou `gtm_id` vêm do briefing. Instale no `<head>`, com o `PageView` na carga.
- Cada CTA tem um `data-cta="<local>"` (hero, oferta, garantia, final, sticky) para medir qual converte mais.
- Sem pixel no briefing, a pendência fica anotada. **Pergunte ao usuário antes de ir para produção.**

## Checklist antes do preview

- [ ] `npm run conferir` sem ❌ e prints revisados um a um (`regras/diagramacao.md`)

- [ ] `npm run build` sem erro
- [ ] Nenhum texto, preço, link ou ID de vídeo de outro projeto (busque no código os nomes do exemplo fictício da fábrica)
- [ ] Todos os CTAs de compra com o link certo, e as UTMs repassadas
- [ ] Delay configurado com a minutagem do briefing (ou pendência anotada)
- [ ] Pixel instalado (ou pendência anotada)
- [ ] Mobile em 375px: sem rolagem horizontal, CTA visível, vídeos com largura total
- [ ] Imagens em `.webp` com `width`/`height`; `og:image`, `title` e `description` preenchidos
- [ ] Rodapé com o ano e o aviso de dramatização
- [ ] Lighthouse mobile: Performance ≥ 85 (os players pesam; o resto não pode pesar)
