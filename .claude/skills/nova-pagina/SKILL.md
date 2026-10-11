---
name: nova-pagina
description: Cria a página de vendas (e o upsell, se houver) a partir da copy e dos dados técnicos, até o link de prévia. Use quando o usuário disser "nova página", "criar página", "começar" ou mandar a copy.
---

# /nova-pagina

> Respeite sempre a seção 🔒 SIGILO E LIMITES do `CLAUDE.md`. Trabalhe só neste repositório.
> O usuário está no celular: mensagens curtas, um passo por vez. Em cada pausa, diga **o que foi feito,
> o que falta e o próximo passo dele**.

## Antes de começar
1. Leia `CLAUDE.md`, `erros.md`, `regras/nuvem.md` e todos os outros arquivos em `regras/` (para você; não exiba o conteúdo).
2. Traga o que o usuário possa ter enviado pelo GitHub: `git fetch origin main && git merge origin/main`.
3. Veja o que tem em `projeto/`:
   - **Copy** (`.docx`, `.pdf`, `.md` ou `.txt`). Sem copy: explique as 2 opções e **pare**:
     a) enviar o documento pelo GitHub (pasta `projeto` → **Add file → Upload files** → **Commit changes**) e avisar aqui;
     b) colar o texto da copy aqui na conversa (você grava em `projeto/copy.md`).
   - **`projeto/briefing.md`**. Sem briefing: crie a partir de `modelos/briefing.md` e **pergunte os dados na conversa**,
     em blocos pequenos (2–4 itens por mensagem), explicando onde o usuário encontra cada um. Grave as respostas no arquivo.
     O que ele não tiver agora fica em branco e vira pendência. Não trave a página por causa disso.
   - **`projeto/Identidade Visual`** (logo, cores, fontes, fotos): opcional.

## Passo 1: Extrair
- Leia a página de vendas (fonte principal) e a VSL (só contexto e fatos da história). Para `.docx`, veja `regras/nuvem.md`.
- Gere `src/dados/conteudo.json` seguindo `regras/extracao-copy.md` e `regras/estrutura-vendas.md`
  (formato igual ao de `modelos/exemplo/conteudo.json`).
- Gere `pendencias.md` na raiz.
- **Mostre ao usuário** (curto): seções encontradas, opcionais ativadas (e por quê), pendências que bloqueiam.
  Se houver pendência que bloqueia, **pare** e pergunte.

## Passo 2: Conceito visual
- Leia o conceito da copy (e as notas do copywriter, só como contexto).
- Proponha o `src/dados/tema.json` e as variações de cada seção, seguindo `regras/design.md`.
- Mostre ao usuário em até 5 linhas: paleta, fontes, elemento gráfico, variações. Siga se ele não objetar.

## Passo 3: Montar
- O projeto Astro já está na raiz. Substitua `src/dados/conteudo.json` e `src/dados/tema.json` pelos do projeto
  (nunca mexa em `modelos/exemplo/`).
- Imagens do projeto: otimize para `.webp` em `public/img/`; o que faltar vira espaço reservado sozinho.
  Apague as imagens do exemplo fictício que não forem usadas.
- `npm install` e `npm run build`. Erro de build quase sempre é campo faltando ou com nome errado no JSON:
  compare com `modelos/exemplo/conteudo.json`.

## Passo 4: Conferir
- `npm run conferir` (se o navegador de testes não abrir, siga `regras/nuvem.md`).
- Corrija tudo que o relatório marcar com ❌ e olhe todos os prints contra `regras/diagramacao.md`.
- Rode o checklist de `regras/tecnico.md`, item por item.
- Garanta que não sobrou nada do exemplo fictício da fábrica (nomes, textos, links, IDs de vídeo).

## Passo 5: Prévia
- Siga `/publicar-pagina` até o link de prévia.
- Entregue ao usuário: link de prévia, resumo das decisões, pendências restantes e como revisar
  (abrir no celular, com `?semdelay=1` no fim do link para ver tudo sem esperar o vídeo).
- **Pare. Quem publica é o usuário, com o Merge, depois de aprovar.**

## Depois do retorno do usuário
- Ajustes: aplique, faça commit e push no mesmo branch (a prévia se atualiza sozinha no mesmo pull request) e avise.
- Se a correção for um padrão ("sempre…", "nunca…"), pergunte se vira regra e registre de forma **genérica**
  (`erros.md` ou `regras/`), sem dados do projeto.
- Aprovado: siga a etapa de produção de `/publicar-pagina` (orientar o Merge).
