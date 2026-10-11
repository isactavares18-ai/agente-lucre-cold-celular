# Estrutura da Página de Upsell

**Status: aguardando o primeiro documento real de upsell.**

Quando o usuário trouxer o primeiro documento de upsell:
1. Mapeie as seções do documento do mesmo jeito que em `estrutura-vendas.md` (tabela com id, tipo, delay e origem).
2. Mostre o mapa ao usuário e peça confirmação antes de montar.
3. Depois de aprovado, substitua este arquivo pelo mapa definitivo.

Até lá, regras que já valem para o upsell:
- Mesmo tema visual da página de vendas do projeto (é o mesmo funil).
- O upsell fica no mesmo repositório e no mesmo domínio, em `/upsell` (ex.: `seudominio.com/upsell`).
- O botão de compra do upsell normalmente é um widget de "compra com 1 clique" da Hotmart.
  O código vem do usuário no `briefing.md`. **Não invente**.
- O botão "não, obrigado" leva para onde o usuário indicar no briefing.
