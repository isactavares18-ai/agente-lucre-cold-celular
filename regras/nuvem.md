# Trabalhando na nuvem, com o usuário no celular

Você roda numa máquina na nuvem (Ubuntu, Node 22, Python 3, git) com **este repositório** já clonado.
O usuário conversa pelo app do Claude no celular. Ele **não tem** terminal, VS Code nem computador.

## Conversa
- Mensagens curtas. Um pedido por vez. Listas numeradas quando o usuário tiver que tocar em algo.
- Para dados técnicos (checkout, vturb, pixel…), pergunte **em blocos pequenos** (2–4 itens por mensagem).
- O usuário pode colar textos longos na conversa (copy, código da vturb). Aceite e grave no arquivo certo.
- Nunca peça senha, token ou chave. Login no GitHub/Vercel é sempre o usuário que faz, no app ou no navegador dele.

## Arquivos que o usuário manda
- O jeito padrão: no GitHub (navegador do celular), abrir o repositório → pasta `projeto` → **Add file → Upload files**
  → escolher os arquivos → **Commit changes**. Se ele tiver dúvida, explique esse caminho.
- Depois que ele enviar, rode `git pull` (ou `git fetch origin main && git merge origin/main`) para receber os arquivos na sessão.
- Imagens e fotos: o usuário também pode **anexar na conversa**. Se a imagem chegou só na conversa e não existe como arquivo
  no repositório, peça para ele enviar pela pasta `projeto` (você precisa do arquivo para colocar na página).
- Vídeos **não** entram no repositório: VSL e depoimentos ficam na vturb/Vimeo/YouTube (só o código ou o link).

## Ler a copy
- `.pdf`: leia direto.
- `.docx`: extraia o texto com Python, sem instalar nada:
  `python3 -c "import zipfile,re,sys;x=zipfile.ZipFile(sys.argv[1]).read('word/document.xml').decode();x=re.sub(r'</w:p>','\n',x);print(re.sub(r'<[^>]+>','',x))" "projeto/arquivo.docx"`
  Se a formatação (negrito, listas) importar, instale `pip install python-docx` (o pypi está liberado).
- Texto colado na conversa: grave em `projeto/copy.md` antes de extrair, para não perder.

## Imagens
- Converta para `.webp` em `public/img/`. Use `pip install pillow` (Python) ou `npm i -D sharp` se precisar.
- Logo em SVG fica em SVG.

## Navegador de testes (`npm run conferir`)
- O script tenta abrir o Chromium sozinho e, se não achar, tenta instalar (`npx playwright install chromium`)
  e procurar um Chrome já instalado na máquina. Rode e leia a mensagem.
- Se mesmo assim não abrir: faça a conferência pelo **link de prévia da Vercel** (veja `regras/publicacao.md`):
  peça ao usuário para abrir a prévia no celular e confirmar, e você confere o código das seções contra `regras/diagramacao.md`.
  Avise o usuário em uma linha que a conferência automática não rodou.
- Os prints ficam em `conferencia/` (fora do git). Olhe todos.

## Git
- Trabalhe no branch da sessão (o que já vem selecionado). **Nunca** faça push em `main`.
- Commits em português e curtos: `pagina: primeira versão`, `ajuste: preço da oferta`.
- Sempre que terminar uma etapa que o usuário vai revisar, faça commit e push, para a Vercel gerar a prévia.
- Se o usuário mandar arquivos novos no meio do caminho, traga com `git fetch origin main && git merge origin/main`.

## Sessões
- Cada conversa nova na aba Code começa uma sessão nova a partir do `main`. Se o usuário voltar depois para **ajustar**
  uma página que ainda não foi publicada, peça para ele continuar na **mesma conversa** (ela fica na lista do app),
  ou para iniciar a sessão a partir do branch da prévia.
- Se a página já foi publicada (merge feito), uma conversa nova a partir do `main` serve para ajustes.
