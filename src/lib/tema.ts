// Converte o tema.json do aluno nas variáveis CSS que o style.css usa.
// Cada grupo de cor aceita uma cor única ("#0f1330"), e a escala é gerada sozinha,
// ou a escala completa ({ "900": "#0f1330", "800": "…" }) quando se quer controle fino.

type Escala = string | Record<string, string>;

export interface Tema {
  conceito?: string;
  cores: {
    escuro: Escala;      // fundo das seções escuras
    destaque: Escala;    // cor de destaque (títulos, ícones, botão de CTA)
    acento: Escala;      // segunda cor (alerta, faixas, "eles" no comparativo)
    claro?: string;      // fundo das seções claras
    claro_2?: string;
    linha?: string;      // bordas nas seções claras
    tinta?: string;      // texto principal nas seções claras
    tinta_suave?: string;
    texto?: string;      // texto principal nas seções escuras
    texto_2?: string;
    texto_3?: string;
    suave?: string;      // legendas nas seções escuras
    cta_texto?: string;  // texto dentro do botão de CTA
  };
  fontes: {
    titulo: string;
    corpo: string;
    google_fonts?: string;
    // Fontes próprias da identidade (fora do Google Fonts): arquivos .woff2 em public/fonts/
    // ex.: { "titulo": [{ "arquivo": "Marca-Bold.woff2", "peso": 700 }], "corpo": [...] }
    arquivos?: Record<"titulo" | "corpo", { arquivo: string; peso?: number; estilo?: string }[] | undefined>;
  };
  origem?: string; // "identidade existente: <fonte>" ou "criada pela fábrica"
}

const mix = (a: string, pct: number, b: string) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

function escala(nome: string, valor: Escala, passos: Record<string, [number, string]>): string[] {
  if (typeof valor !== "string") {
    return Object.entries(valor).map(([k, v]) => `--${nome}-${k}: ${v};`);
  }
  return Object.entries(passos).map(([k, [pct, alvo]]) =>
    `--${nome}-${k}: ${pct === 100 ? valor : mix(valor, pct, alvo)};`
  );
}

export function cssDoTema(t: Tema): string {
  const c = t.cores;
  const linhas: string[] = [
    ...escala("esc", c.escuro, {
      "950": [62, "black"], "900": [100, ""], "850": [92, "white"], "800": [86, "white"], "700": [74, "white"], "600": [62, "white"],
    }),
    ...escala("dst", c.destaque, {
      "200": [35, "white"], "300": [55, "white"], "400": [78, "white"], "500": [100, ""], "600": [82, "black"], "700": [62, "black"],
    }),
    ...escala("ac", c.acento, {
      "200": [30, "white"], "400": [70, "white"], "500": [100, ""], "600": [80, "black"],
    }),
  ];
  const esc900 = typeof c.escuro === "string" ? c.escuro : c.escuro["900"];
  const claro = c.claro ?? "#f8f5ef";
  const tinta = c.tinta ?? mix(esc900, 85, "black");
  linhas.push(
    `--claro: ${claro};`,
    `--claro-2: ${c.claro_2 ?? mix(claro, 94, "black")};`,
    `--linha: ${c.linha ?? mix(claro, 86, "black")};`,
    `--tinta: ${tinta};`,
    `--tinta-suave: ${c.tinta_suave ?? mix(tinta, 72, "white")};`,
    `--texto: ${c.texto ?? mix(esc900, 8, "white")};`,
    `--texto-2: ${c.texto_2 ?? mix(esc900, 20, "white")};`,
    `--texto-3: ${c.texto_3 ?? mix(esc900, 42, "white")};`,
    `--suave: ${c.suave ?? mix(esc900, 34, "white")};`,
    `--cta-texto: ${c.cta_texto ?? esc900};`,
    `--font-display: "${t.fontes.titulo}", Georgia, serif;`,
    `--font-body: "${t.fontes.corpo}", system-ui, -apple-system, "Segoe UI", sans-serif;`,
  );
  return `:root{${linhas.join("")}}`;
}

/** URL do Google Fonts só para as fontes que NÃO vêm de arquivo próprio. Vazio = não carrega nada do Google. */
export function urlFontes(t: Tema): string {
  if (t.fontes.google_fonts) return t.fontes.google_fonts;
  const local = t.fontes.arquivos ?? ({} as any);
  const fam = (n: string, pesos: string) => `family=${n.trim().replace(/ /g, "+")}:${pesos}`;
  const partes = [
    !local.titulo?.length && fam(t.fontes.titulo, "ital,wght@0,500;0,600;0,700;1,500;1,600"),
    !local.corpo?.length && t.fontes.corpo !== t.fontes.titulo && fam(t.fontes.corpo, "wght@300;400;500;600;700"),
  ].filter(Boolean);
  return partes.length ? `https://fonts.googleapis.com/css2?${partes.join("&")}&display=swap` : "";
}

/** @font-face das fontes próprias da marca (public/fonts/) */
export function fontesProprias(t: Tema): string {
  const a = t.fontes.arquivos;
  if (!a) return "";
  const face = (familia: string, lista?: { arquivo: string; peso?: number; estilo?: string }[]) =>
    (lista ?? []).map((f) =>
      `@font-face{font-family:"${familia}";src:url("/fonts/${f.arquivo}") format("woff2");font-weight:${f.peso ?? 400};font-style:${f.estilo ?? "normal"};font-display:swap}`
    ).join("");
  return face(t.fontes.titulo, a.titulo) + face(t.fontes.corpo, a.corpo);
}
