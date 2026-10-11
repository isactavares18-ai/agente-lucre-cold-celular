// Marcação simples usada no conteudo.json:
//   **texto**  → destaque (em títulos vira a cor de destaque; em parágrafos, negrito)
//   ~~texto~~  → riscado (usado em "O problema nunca foi a ~~ferramenta~~")
//   \n         → quebra de linha
// Todo o resto é escapado: o conteúdo nunca injeta HTML.

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Para títulos: **x** vira <em class="text-gold">x</em> */
export function titulo(s: string | undefined | null): string {
  if (!s) return "";
  // Junta as duas últimas palavras (espaço inseparável): título nunca termina com palavra sozinha na linha
  s = s.replace(/ ([^ \n]{1,14})$/, "\u00a0$1");
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<em class="text-gold">$1</em>')
    .replace(/~~(.+?)~~/g, '<span class="strike">$1</span>')
    .replace(/\n/g, "<br>");
}

/** Para parágrafos: **x** vira <strong>x</strong> */
export function texto(s: string | undefined | null): string {
  if (!s) return "";
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/~~(.+?)~~/g, "<s>$1</s>")
    .replace(/\n/g, "<br>");
}

/** Resolve o destino de um CTA: "checkout" (padrão) ou uma âncora como "#oferta" */
export function destino(cta: string | { texto: string; destino?: string } | undefined, checkout: string, padrao = "checkout") {
  const d = typeof cta === "object" && cta?.destino ? cta.destino : padrao;
  return d === "checkout" ? checkout : d;
}

export function rotuloCta(cta: string | { texto: string } | undefined): string {
  if (!cta) return "";
  return typeof cta === "string" ? cta : cta.texto;
}

/** Separa "+200 mil €" em { antes: "+", numero: 200, depois: " mil €" } para o contador animado */
export function separaNumero(v: string) {
  const m = v.match(/^(.*?)(\d+)(.*)$/s);
  if (!m) return null;
  return { antes: m[1], numero: m[2], depois: m[3] };
}

/** Número de colunas que não deixa item sozinho na última linha (ex.: 4 itens → 2 ou 4, nunca 3). */
export function colunas(n: number, max = 4): number {
  if (n <= max) return Math.max(n, 1);
  for (let c = max; c >= 2; c--) if (n % c === 0) return c;
  return max;
}
