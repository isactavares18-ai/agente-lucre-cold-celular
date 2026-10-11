# Design: tema e variações

## Princípio

Mesma estrutura, **identidade própria por projeto**. Duas páginas lado a lado devem parecer de marcas diferentes,
mas com a mesma lógica de leitura e conversão.

## 0. Primeiro: a identidade já existe ou é para criar?

A regra é simples: **tem a pasta `projeto/Identidade Visual` no repositório = identidade existente (Modo A).**
Não tem = identidade nova (Modo B), mas confirme com o usuário se o briefing não disser "criar do zero".

### Modo A: identidade existente (quando a marca já existe)

A identidade é do cliente. **Você aplica, não reinventa.**

1. **Vá direto na subpasta `Identidade Visual`** dentro de `projeto/` (padrão da fábrica;
   o nome pode vir com maiúsculas/minúsculas diferentes: trate `identidade visual`, `Identidade Visual` etc. como a mesma pasta).
   - **A pasta existe = Modo A**, mesmo que o briefing não diga nada.
   - **A pasta não existe e o briefing não diz "criar do zero"**: pergunte ao usuário antes de seguir (os arquivos podem estar soltos na pasta `projeto/`).
   - O que procurar lá dentro:
   - Logo (`.svg` de preferência; senão `.png` com fundo transparente), versão horizontal e ícone
   - Manual/brand book (`.pdf`, `.fig`, imagens): de lá saem as cores (hex) e as fontes
   - Arquivos de fonte (`.ttf`, `.otf`, `.woff`, `.woff2`)
   - Fotos do expert, mockups do produto, elementos gráficos da marca (texturas, ícones, padrões)
2. **Cores:** use os hex do manual. Sem manual, tire as cores do logo e dos materiais e **mostre ao usuário para confirmar**.
   - `destaque` = cor principal da marca. `escuro` = a cor mais escura da marca; se a marca não tiver cor escura, use a principal bem escurecida.
     `claro` = o neutro claro da marca. `acento` = a cor secundária.
   - Não troque a cor da marca por achar outra "mais bonita" ou "que converte mais". Se a cor da marca tiver contraste ruim no botão, **aponte ao usuário** e proponha a menor mudança possível (ex.: escurecer o texto do botão).
3. **Fontes:**
   - Fonte da marca que está no Google Fonts: use pelo nome.
   - Fonte da marca em arquivo: converta para `.woff2`, coloque em `public/fonts/` e declare em `fontes.arquivos`
     (ex.: `"arquivos": { "titulo": [{ "arquivo": "Marca-Bold.woff2", "peso": 700 }] }`).
   - Fonte paga que não está na pasta: **pergunte ao usuário**. Enquanto isso, use a alternativa mais parecida do Google Fonts e anote em `pendencias.md`.
4. **Elementos gráficos:** se a identidade tem um padrão, textura ou ícone próprio, ele vira o elemento recorrente da página (fundos, faixa, anel da VSL).
5. No `tema.json`, registre `"origem": "identidade existente: <de onde tirou (manual, logo…)>"`.

### Modo B: identidade nova (projetos que começam do zero)

Aqui você **cria** a identidade da página a partir do conceito da copy (nicho, mecanismo, público, promessa):
1. Proponha **2 direções** ao usuário antes de montar, cada uma com paleta (5 hex), par de fontes, elemento gráfico recorrente e o porquê em 2 linhas.
2. Depois que o usuário escolher, monte o `tema.json` com `"origem": "criada pela fábrica"`.
3. **Logo:** a fábrica não cria logo. Sem logo, o topo mostra o nome do produto na fonte de título (o template já faz isso). Anote em `pendencias.md` se o usuário quiser um logo.
4. A identidade criada vale para o funil inteiro do projeto (vendas + upsell).

## 1. Tema (`src/dados/tema.json`)

O tema controla **todas** as cores e fontes da página (o CSS não tem nenhuma cor fixa de projeto).

```json
{
  "conceito": "3 linhas: por que essas escolhas combinam com esse projeto",
  "cores": {
    "escuro":   "#0c2426",
    "destaque": "#f4b41a",
    "acento":   "#ef6a2e",
    "claro":    "#fbf7ee",
    "cta_texto": "#0c2426"
  },
  "fontes": { "titulo": "Fraunces", "corpo": "Inter" }
}
```

- **escuro**: fundo das seções escuras. **destaque**: cor dos títulos em destaque, dos ícones e do botão.
  **acento**: barra de alerta, faixas, lado "eles" do comparativo. **claro**: fundo das seções claras.
- Com uma cor só por grupo, as variações de tom são geradas sozinhas. Para controle fino, passe a escala completa
  (veja o formato em `regras/estrutura-vendas.md`: `"escuro": { "950": …, "900": …, … }`).
- Opcionais: `claro_2`, `linha`, `tinta`, `tinta_suave`, `texto`, `texto_2`, `texto_3`, `suave`.
- **Fontes**: nomes exatos do Google Fonts. A de título precisa ter itálico (os destaques usam itálico).

Regras:
- **O botão de CTA** é o elemento de maior contraste da página. `cta_texto` precisa ser legível sobre o `destaque`.
- **Contraste**: texto sobre fundo com pelo menos 4.5:1.
- **Um elemento gráfico recorrente** ligado ao mecanismo (ex.: um sol para energia solar, uma folha para nutrição, um gráfico para finanças).
  O anel de estrelas em volta da VSL liga e desliga com `hero.anel`.

## 2. Variações de seção

Registradas em `config.variantes` no `conteudo.json`.

| Seção | A | B | Quando usar B |
|---|---|---|---|
| hero | Texto à esquerda, VSL vertical à direita (padrão) | Tudo centralizado, VSL horizontal 16:9 abaixo da headline | Quando a VSL é horizontal, a headline é muito longa (+35 palavras) ou o público é mais velho/menos digital |
| entregaveis | Blocos alternados imagem/texto, com lista (padrão) | 3 cards lado a lado | Textos curtos, sem imagens próprias para cada entregável |

Seções sem variação (por enquanto), que se adaptam sozinhas ao conteúdo:
- **Números, âncoras, passos e fluxo**: a grade se ajusta à quantidade de itens.
- **Produto e diferente**: montados com os blocos de apoio (ver `estrutura-vendas.md`).
- **Oferta**: sem `card.lista`, vira um card de preço centralizado.
- **Mentor**: linha do tempo e citação são opcionais.

> O catálogo cresce a cada página aprovada. Quando o usuário aprovar um layout novo, crie a variante no
> componente (`src/secoes/<Secao>.astro`, prop `variante`), e adicione a linha aqui (vale só para este projeto; para todos, avise o usuário que é uma melhoria para o modelo da fábrica).

## 3. Mobile primeiro

A maior parte do tráfego vem de anúncio no celular. Revise sempre em 375px de largura:
headline legível sem zoom, VSL com largura total, CTA com pelo menos 48px de altura, sem rolagem horizontal.

## 4. Imagens

Ordem de preferência:
1. Fotos enviadas pelo usuário (pasta `projeto/`).
2. Banco de imagens, para cenários e texturas.
3. Geração por IA, só para fundos, elementos conceituais e mockups. **Nunca** para o rosto da mentora ou "depoimentos".

Converta sempre para `.webp`, com no máximo 1600px de largura, em `public/img/`. O que faltar aparece como espaço reservado e vai para `pendencias.md`.

## 5. Diagramação (regra da fábrica)

> As regras completas e verificáveis de diagramação estão em `regras/diagramacao.md`. As abaixo complementam.

**Nenhum bloco vai ao ar "com informação jogada".** Antes de mandar o preview, cada seção passa por isto:

1. **Todo bloco de texto tem âncora visual.** Card, painel ou tópico sem imagem recebe pelo menos um ícone
   e um rótulo (kicker/eyebrow). Texto solto dentro de uma caixa não conta como diagramação.
2. **Cards lado a lado têm a mesma altura** e o mesmo ritmo interno. Quando o texto varia muito,
   o card vira coluna (`display:flex; flex-direction:column`) e o que fecha o card (etiquetas, selo)
   vai para o rodapé com `margin-top:auto`.
3. **Bloco com imagem e texto se diagrama na horizontal**: foto de um lado, texto do outro; empilha só no celular.
   Imagem dentro de texto corrido, ou texto por cima de imagem, só quando for decisão consciente.
4. **A imagem entra com a largura e a altura reais do arquivo.** Atributo de outra imagem esmaga o mockup.
5. **Contraste conferido na seção em que o bloco cai**, não no padrão do componente:
   o mesmo bloco muda de fundo entre uma seção clara e uma escura.
6. **Imagens de banco** são permitidas nas seções de tópicos, desde que combinem com a identidade do projeto.
   Rosto de mentora e depoimento continuam proibidos (ver item 4 do capítulo de Imagens).

Se um layout novo resolver isso melhor, ele vira variante no componente e entra na tabela de variações.
