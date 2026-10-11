---
name: publicar-pagina
description: Gera o link de prévia da página (push + pull request + Vercel) e orienta o usuário a publicar com o Merge e a conectar o domínio. Use quando o usuário disser "publicar", "prévia", "colocar no ar" ou "domínio".
---

# /publicar-pagina [previa|producao|dominio]

> Respeite sempre a seção 🔒 SIGILO E LIMITES do `CLAUDE.md`. Use as contas (GitHub e Vercel) **do próprio usuário**.
> Nunca peça senhas: login é sempre o usuário que faz, no navegador ou app dele.
> Nunca faça push em `main` nem merge: a publicação é o Merge que o usuário faz.

Siga `regras/publicacao.md`. Resumo:

## previa (padrão)
1. `npm run build` sem erro e conferência feita.
2. Commit e push do branch da sessão.
3. Abra o pull request do branch para o `main` (ferramentas do GitHub da sessão). Se não der, peça ao usuário para tocar em
   **Create PR**.
4. **A Vercel já está conectada?** Pergunte na primeira vez. Se não estiver, passe o passo a passo de `regras/publicacao.md`
   ("Primeira vez"), espere ele confirmar e faça um commit vazio (`git commit --allow-empty -m "prévia"`) + push para gerar a prévia.
5. Pegue o link **Visit Preview** do comentário da Vercel no pull request e entregue ao usuário, com `?semdelay=1` explicado.

## producao (o usuário faz, só depois de aprovar)
1. Rode de novo o checklist de `regras/tecnico.md`. **O delay e o pixel são obrigatórios em produção.** Avise o que faltar.
2. Oriente: pull request no GitHub → **Merge pull request** → **Confirm merge**.
3. Diga onde ver o site no ar (Vercel → projeto → **Domains**, ou o domínio dele).

## dominio
1. Oriente a adicionar `dominio.com` e `www.dominio.com` na Vercel (projeto → **Settings → Domains → Add**).
2. Peça um print da tela com os registros DNS que a Vercel mostrar e passe o passo a passo para o provedor de domínio
   (ver `regras/publicacao.md`), com os valores exatos.
3. Depois que o usuário disser que configurou, peça para ele abrir o domínio com `?utm_source=teste` e conferir se a UTM chega ao checkout.
