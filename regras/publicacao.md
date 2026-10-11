# Publicação: GitHub, Vercel e domínio (versão celular)

## Organização

- **Um repositório por página/projeto** na conta do GitHub do usuário, criado a partir do modelo
  ("Use this template"). Nome sugerido: `pagina-<slug>` (ex.: `pagina-metodo-exemplo`). Privado.
- O repositório **é** o site Astro do projeto (vendas em `/` e upsell em `/upsell`), com as pastas da fábrica junto.
  A pasta `projeto/` e os arquivos `.md` não vão para o site (o Astro só publica `src/` e `public/`).
- **Um projeto na Vercel por repositório**, conectado pela integração com o GitHub. A Vercel detecta o Astro sozinha.
- Página entregue fica "congelada": melhorias na fábrica **não** atualizam páginas já no ar, a não ser que o usuário peça.

## Branches

| Branch | O que é | Quem publica |
|---|---|---|
| branch da sessão (ex.: `claude/...`) | Onde você trabalha. Cada push gera um **link de prévia** na Vercel | Você |
| `main` | Produção (o domínio do projeto aponta para cá) | **O usuário**, tocando em **Merge** no pull request |

## Primeira vez (conectar a Vercel) — o usuário faz, pelo navegador do celular

Explique assim, quando for a hora (normalmente antes da primeira prévia):
1. Abrir **vercel.com** e entrar com **Continue with GitHub**.
2. **Add New… → Project** e, na lista, tocar em **Import** ao lado do repositório desta página.
   (Se o repositório não aparecer: **Adjust GitHub App Permissions** e liberar o repositório.)
3. Não precisa mudar nada (a Vercel já reconhece o Astro). Tocar em **Deploy**.
4. Pronto: a partir de agora cada envio seu gera uma prévia, e cada Merge no `main` publica.

Logo após a importação, a Vercel publica o `main` com o exemplo fictício. Avise que isso é normal: o site só ganha a
página dele quando ele aprovar e fizer o Merge.

## Prévia (você faz)

1. `npm run build` sem erro e conferência feita.
2. Commit e push do branch da sessão.
3. Abra o **pull request** do branch da sessão para o `main` usando as ferramentas do GitHub da sessão.
   Se não conseguir, peça ao usuário para tocar em **Create PR** (no topo da conversa / na tela de mudanças).
   Título: `Página: <nome do produto>`. Na descrição: resumo das decisões e pendências.
4. A Vercel comenta no pull request com o link de prévia (**Visit Preview**) em 1–2 minutos.
   Leia os comentários do PR para pegar o link e mande ao usuário. Se não achar, ensine: abrir o pull request no GitHub
   e tocar em **Visit Preview** no comentário da Vercel.
5. Mande junto: como revisar (abrir no celular; com `?semdelay=1` no fim do link para ver tudo sem esperar o vídeo),
   resumo e pendências. **Pare aqui.**

## Produção (o usuário faz, só quando aprovar)

1. Antes, rode de novo o checklist de `regras/tecnico.md`. **O delay e o pixel são obrigatórios em produção.**
   Se faltar algo obrigatório, avise antes de ele publicar.
2. Oriente: abrir o pull request no GitHub → rolar até o fim → **Merge pull request** → **Confirm merge**.
3. A Vercel publica sozinha em 1–2 minutos. O endereço fica em vercel.com → projeto → **Domains**
   (ou o domínio dele, se já estiver conectado).

## Domínio (comprado no provedor, apontado para a Vercel) — o usuário faz, você guia

1. Na Vercel: projeto → **Settings → Domains → Add** → digitar `dominio.com` e também `www.dominio.com`
   (deixar um redirecionando para o outro).
2. A Vercel mostra os **registros DNS exatos** que precisam ser criados. **Peça um print dessa tela**
   e use sempre os valores que ela mostrar. Normalmente são:
   - um registro **A** para `@` (domínio raiz) apontando para o IP da Vercel;
   - um registro **CNAME** para `www` apontando para o endereço `…vercel-dns…` que ela indicar.
3. No provedor do domínio (exemplo com a Hostinger: **Domínios → [domínio] → DNS / Nameservers → Gerenciar registros DNS**):
   - Apagar os registros **A** de `@` e **CNAME** de `www` antigos, que apontam para a hospedagem da Hostinger.
   - Criar os dois registros com os valores da Vercel.
4. Esperar a propagação (de minutos a algumas horas). A Vercel fica verde e gera o HTTPS sozinha.
5. Testar: `https://dominio.com`, `https://www.dominio.com` e com `?utm_source=teste` (conferir se a UTM chega ao checkout).

Cuidado: se o domínio tiver **e-mail** configurado na Hostinger, **não mexer** nos registros MX.
