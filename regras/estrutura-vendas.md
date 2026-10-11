# Estrutura da Página de Vendas

Baseada na estrutura padrão de página de vendas com VSL da fábrica, já validada em várias páginas no ar.
Todas seguem a mesma espinha, na mesma ordem. A ordem está **fixada no código**, em `src/pages/index.astro`.

Legenda: **[O]** obrigatória · **[Op]** opcional (`"ativa": false` desliga) · **[D]** escondida até o delay

## Ordem das seções

| # | Chave no JSON | Componente | Tipo | Delay | De onde vem no documento |
|---|---|---|---|---|---|
| 1 | `alerta` | Alerta | O | não | "⚠️ ATENÇÃO: Essa oportunidade pode mudar de preço…" |
| 2 | `header` | Header | O | menu e CTA: **D** | Logo; o menu é montado sozinho |
| 3 | `hero` | Hero (A/B) | O | headline, sub e VSL não; CTA e provas **D** | 1º parágrafo em negrito = headline; 2º = subheadline; "VÍDEO DE VENDAS" |
| 4 | `faixa` | Faixa | Op | D | Frases curtas da própria promessa |
| 5 | `numeros` | Numeros | Op | D | **Só** números que estão na copy ou na VSL |
| 6 | `depoimentos` | Depoimentos | O | D | "Pessoas que já…" + VÍDEO DEPOIMENTO 01–04 |
| 7 | `mentor` | Mentor | O | D | "Quem sou eu e qual meu propósito?". Linha do tempo e citação vêm da história (doc + VSL) |
| 8 | `produto` | Produto + Blocos | O | D | "O que é o…?", mecanismo e analogia |
| 9 | `diferente` | Diferente + Blocos | O | D | "Por que isso é diferente de TUDO…", eles × nós |
| 10 | `como_funciona` | ComoFunciona | Op | D | Lista de passos do **checkout** (regra de 25/09/2026) ou fases do método |
| 11 | `entregaveis` | Entregaveis (A/B) | O | D | "…e receba:" (3 cards) + bônus. Módulos são Op |
| 12 | `oferta` | Oferta | O | D | "Você está a um passo…", "inferior a R$ X por dia", preço |
| 13 | `garantia` | Garantia | O | D | Bloco da garantia |
| 14 | `faq` | Faq | Op | D | Só com respostas que já estão na copy |
| 15 | `urgencia` | Urgencia | O | D | "⚠️ Essa oportunidade não vai durar…" |
| 16 | `rodape` | Rodape | O | D | "Copywriting 20XX… dramatizações…" |
| 17 | `cta_fixo` | CtaFixo | O | D | Montado a partir da oferta; aparece só no celular |

**CTAs:** cada caixa de botão do documento vira um CTA **no mesmo lugar** e **com o mesmo texto**.
Um CTA pode ser só o texto (vai para o checkout) ou `{ "texto": "…", "destino": "#oferta" }` (rola até a oferta).
Padrão: os CTAs do hero, da oferta, da garantia, da urgência e o fixo vão para o checkout; os do header e do produto rolam até `#oferta`.

## O `conteudo.json`

**O modelo completo é `modelos/exemplo/conteudo.json` (exemplo fictício).** Copie a estrutura dele, nunca o texto.
Marcação dentro dos textos: `**x**` = destaque, `~~x~~` = riscado, `\n` = quebra de linha. Nenhum HTML.

Chaves de topo:
- `aluno`: nome, slug, produto, domínio
- `config`: `checkout_url`, `delay_segundos`, `vsl` (`tipo`, `formato` vertical|horizontal, `player_id`, `script_src`), `pixel_meta_id`, `gtm_id`, `variantes` (`hero`, `entregaveis`)
- `seo`: titulo, descricao, og_descricao (`indexar: false` para esconder do Google)
- `imagens`: logo, logo_icone, og, hero_fundo, diferente_fundo, final_fundo, selo_garantia (arquivos em `public/img/`)
- e uma chave por seção, conforme a tabela acima.

### Blocos de apoio (`produto.blocos`, `diferente.blocos_antes`, `diferente.blocos_depois`)

| `tipo` | Para quê | Campos |
|---|---|---|
| `texto` | Parágrafos soltos | `paragrafos[]` |
| `painel-escuro` | Explicar o **mecanismo** (ex.: o ingrediente, a tecnologia ou o método por trás do resultado) | `eyebrow`, `titulo`, `lead`, `paineis[]` (`kicker`, `titulo`, `texto`, `etiquetas[]`), `antes_depois` |
| `analogia` | A analogia da copy (água no deserto) + fluxo | `eyebrow`, `titulo`, `texto`, `destaque` (`valor`, `texto`), `fluxo[]` (`icone`, `texto`) |
| `frase-destaque` | Frase de impacto grande | `texto` (ex.: `"O problema nunca foi a ~~ferramenta~~.\nO problema sempre foi o **PRODUTO.**"`) |
| `citacao-icone` | Analogia curta com ícone (Coca-Cola) | `icone`, `texto` |

Ícones disponíveis: veja o topo de `src/secoes/Icones.astro`.

### Espaços reservados
Qualquer imagem ou vídeo sem arquivo/ID aparece como uma caixa listrada com "FOTO: …", "VSL: …" ou "Depoimento 01: link do Vimeo pendente".
Isso é o esperado no preview. **Nunca vai para produção com espaço reservado.**
