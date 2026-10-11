# Agente Lucre Cold · versão celular

Crie a sua página de vendas com VSL **só pelo celular**: o agente monta a página, você revisa num link de prévia
e publica com um toque.

**Você vai precisar de:** conta paga do Claude (Pro ou superior), conta no GitHub e conta na Vercel (grátis).

---

## 1 · Criar a sua cópia (uma vez por página)

1. Nesta página do GitHub, toque em **Use this template → Create a new repository**.
   (No celular, se não aparecer, abra o menu do navegador e ative **Versão para computador**.)
2. Em **Repository name**, escreva `pagina-` + o nome do produto. Ex.: `pagina-metodo-doce`.
3. Deixe **Private** marcado e toque em **Create repository**.

## 2 · Mandar a copy

1. No **seu** repositório, abra a pasta **projeto**.
2. Toque em **Add file → Upload files**, escolha o documento da copy (Word ou PDF) e toque em **Commit changes**.
3. Tem logo, fotos e cores? Envie também (de preferência numa pasta chamada `Identidade Visual`).

> Não está com o arquivo? Tudo bem: dá para colar o texto da copy direto na conversa com o agente.

## 3 · Ligar o Claude ao GitHub (uma vez só)

1. Abra o app do **Claude** e toque na aba **Code**.
2. Na primeira vez, toque em **conectar o GitHub** e autorize.
3. Quando pedir para instalar o app do Claude no GitHub, escolha **All repositories** (ou marque o repositório da sua página).
   Sem isso, o seu repositório não aparece na lista.

## 4 · Criar a página

1. Na aba **Code**, escolha o seu repositório (`pagina-…`).
2. Escreva **`/nova-pagina`** e envie.
3. Responda o que o agente perguntar: link do checkout, código da vturb, tempo do delay, pixel…
   O que você não tiver agora, ele deixa para depois.
4. Espere ele montar e conferir a página.

## 5 · Ligar a Vercel (uma vez por página)

Quando o agente pedir:
1. Abra **vercel.com** e entre com **Continue with GitHub**.
2. Toque em **Add New… → Project** e em **Import** ao lado do seu repositório.
3. Toque em **Deploy**. Não precisa mudar nada.

> Logo depois, a Vercel publica a página de exemplo que vem no modelo. É normal: a sua página entra quando você aprovar.

## 6 · Revisar e publicar

1. O agente manda um **link de prévia**. Abra no celular e confira tudo.
   Coloque `?semdelay=1` no fim do link para ver a página inteira sem esperar o vídeo.
2. Quer mudar algo? Peça na **mesma conversa**. A prévia se atualiza sozinha.
3. Aprovou? Abra o pull request no GitHub, toque em **Merge pull request → Confirm merge**.
   Em 1–2 minutos a página está no ar.

## 7 · Domínio (opcional)

Peça ao agente: **"quero colocar meu domínio"**. Ele te guia na Vercel e no seu provedor de domínio (Hostinger etc.).

---

### Dúvidas comuns

- **Meu repositório não aparece no Claude:** instale o app do Claude no GitHub liberando esse repositório (passo 3).
- **Enviei arquivos e o agente não viu:** avise na conversa ("enviei a copy"). Ele busca os arquivos novos.
- **Voltei outro dia para ajustar:** continue a mesma conversa (ela fica na lista da aba Code).
- **Outra página:** repita o passo 1 e crie um repositório novo. Cada página tem o seu.
