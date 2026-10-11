# Diagramação: regras verificáveis

Estas regras valem para **toda** página. Cada uma pode ser conferida olhando o print ou medindo a página.
"Ficou bonito" não é critério. **Cumpre a regra ou não cumpre.**

> Antes de entregar qualquer preview, rode `npm run conferir` (ver o final deste arquivo), olhe **todos** os prints
> e corrija tudo que violar estas regras. O usuário não deve ser a pessoa que encontra erro de diagramação.

## 1. Tipografia e hierarquia

- **Um único `h1`** por página (a headline do hero).
- Os tamanhos de título vêm **só** das classes do template: `h-hero`, `h-section`, `h-mid`, `feature__title`.
  **Nunca** use `font-size` solto ou `style="font-size…"` no HTML.
- Uma seção tem **um** título principal. Não empilhe dois títulos grandes seguidos.
- **Destaque (`**x**`) com moderação:** no máximo 2 trechos por título e 1 por parágrafo. Se tudo é destaque, nada é.
- **Largura de leitura:** parágrafos com no máximo ~70 caracteres por linha (cerca de 680px). Os títulos de seção
  ficam dentro do `section-head` (máx. 780px). Texto de parede a parede do container é erro.
- **Palavra sozinha na última linha** de título ou parágrafo curto é erro. O template já equilibra (`text-wrap`), mas confira nos prints.
- **Alinhamento:** texto corrido com mais de 3 linhas fica **alinhado à esquerda**, nunca centralizado. Centralize só títulos, subtítulos curtos e CTAs.
- **Caixa alta** só em eyebrows, botões e etiquetas. Nunca em parágrafo.

## 2. Espaçamento e ritmo

- O espaço vertical entre seções é sempre o `--section-y` do template. Não crie seção com padding próprio.
- Dentro das seções, use só estes espaços: **8, 12, 16, 24, 32, 48, 64, 96 px**. Nada de 37px, 50px, 110px.
- **Proximidade:** o título fica mais perto do texto dele do que da seção de cima. Um elemento nunca fica "flutuando" no meio de dois blocos.
- **Alternância de fundo:** duas seções seguidas **não** têm o mesmo fundo, a não ser que sejam visualmente uma coisa só.
  A ordem padrão do template já alterna (escuro → claro → escuro…). Se você desligar uma seção opcional, confira se não
  ficaram dois fundos iguais encostados. Se ficaram, ajuste a classe `section--light` da seção seguinte.
- **Um ponto focal por seção:** cada seção tem uma coisa que o olho vê primeiro (título, preço, vídeo, imagem). Se tem três coisas gritando, reduza duas.

## 3. Grades, cards e listas

- **Nada de órfão na grade:** 3 itens numa grade de 2 colunas deixam 1 sozinho, e isso é erro. Use o número de colunas
  que divide certo (3 → 3 colunas; 4 → 2 ou 4; 5 → 3+2 centralizado) ou faça o último ocupar a linha inteira.
- Cards lado a lado têm **a mesma altura**, e os botões ou rodapés dos cards ficam **alinhados na base**.
- Os cards de uma mesma grade têm quantidade de texto parecida. Se um tem 10 linhas e outro 2, a grade é o formato errado: use lista ou blocos alternados.
- **Listas com mais de 6 itens** viram 2 colunas no desktop ou são divididas em grupos.
- Ícones de uma mesma lista: **mesmo tamanho, mesmo estilo, mesma cor**.

## 4. Imagens

- Toda imagem tem `width` e `height` no HTML e proporção fixa. **Nunca** esticada ou achatada.
- Fotos de pessoas: o rosto **nunca** é cortado. Use `object-position` para manter a cabeça dentro do quadro.
- Foto com fundo (não recortada) ganha moldura ou canto arredondado do sistema (`--radius`). Foto recortada (PNG) fica solta, sem caixa.
- Imagem decorativa **nunca** fica em cima de texto a ponto de atrapalhar a leitura (contraste mínimo de 4.5:1).
- Qualidade: nada pixelado ou borrado. Se a foto é pequena demais para o lugar, use o lugar menor ou avise o usuário.

## 5. Botões e CTAs

- Altura mínima de **48px**, texto em no máximo **2 linhas no celular**.
- No celular, os botões principais ocupam a **largura toda** do container.
- **Um CTA principal por dobra.** Dois botões iguais lado a lado é erro.
- O botão é o elemento de maior contraste da seção. Nenhum outro elemento usa a cor dele como fundo.

## 6. Celular (375–390px): onde a maioria dos erros aparece

- **Zero rolagem horizontal.** Nenhum elemento passa da tela.
- Texto corrido com pelo menos **15px**. Legendas e etiquetas com pelo menos **12px**.
- Headline do hero no máximo em **~8 linhas**. Se passar, reduza o tamanho da `h-hero` só no celular.
- Laterais de **16–20px** em todas as seções (o `--gutter` do template).
- Grades de 3–4 colunas viram 1 ou 2 colunas, **sem órfão** (regra 3).
- Carrosséis mostram um pedaço do próximo card, para indicar que dá para arrastar.
- O CTA fixo do rodapé **não pode cobrir** conteúdo importante nem outro botão.

## 7. Consistência

- **Um raio de borda** para cards (`--radius`) e um para botões (pílula). Não misture 4px, 12px e 30px na mesma página.
- **Uma sombra** padrão para cards. Não invente sombra nova por seção.
- **Mesma cor para a mesma função** em toda a página (destaque, links, ícones).

## 8. O que você NÃO faz para "resolver" diagramação

- Cortar ou reescrever a copy para caber. **Adapte o layout, não o texto.**
- Diminuir a fonte abaixo dos mínimos para caber.
- Esconder conteúdo no celular (`display:none`) que existe no desktop.

---

## Conferência obrigatória antes do preview

```bash
npm run conferir
```

O comando monta a página, abre no navegador em **desktop (1440px)** e **celular (390px)** e gera:
- `conferencia/desktop-01.png`, `desktop-02.png`… e `mobile-01.png`… (a página inteira em partes)
- `conferencia/relatorio.md`, com os problemas medidos automaticamente (rolagem horizontal, fonte pequena,
  botão baixo, imagem distorcida, espaço reservado, texto de outro projeto, erros no console)

**O que fazer:**
1. Corrija **tudo** que o `relatorio.md` apontar como ❌.
2. Abra e **olhe cada print**, de cima a baixo, conferindo as seções 1 a 7 deste arquivo. O relatório automático
   não enxerga tudo (alinhamento, ritmo, hierarquia, órfão visual): **isso é com você**.
3. Corrija, rode `npm run conferir` de novo e só entregue quando estiver limpo.
4. No resumo para o usuário, diga quantas rodadas de conferência fez e o que corrigiu.
