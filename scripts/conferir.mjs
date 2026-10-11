// Conferência de diagramação: `npm run conferir`
// 1) monta o site  2) abre em desktop (1440) e celular (390)  3) salva prints em conferencia/
// 4) mede problemas objetivos e escreve conferencia/relatorio.md
// Regras completas: regras/diagramacao.md da fábrica.
import { execSync } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, rmSync, writeFileSync, statSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

const RAIZ = process.cwd();
const DIST = join(RAIZ, "dist");
const SAIDA = join(RAIZ, "conferencia");
const pular = process.argv.includes("--sem-build");

let chromium;
try { ({ chromium } = await import("playwright")); }
catch { console.error("\n❌ Playwright não instalado. Rode:  npm install  e depois  npx playwright install chromium\n"); process.exit(1); }

if (!pular) { console.log("→ Montando o site…"); execSync("npx astro build", { stdio: "inherit", shell: true }); }

// Servidor estático simples para a pasta dist
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".woff2": "font/woff2", ".ico": "image/x-icon" };
const servidor = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  let f = join(DIST, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": MIME[extname(f)] ?? "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => servidor.listen(0, "127.0.0.1", r));
const porta = servidor.address().port;

const conteudo = JSON.parse(readFileSync(join(RAIZ, "src/dados/conteudo.json"), "utf8"));
const nomeAluno = conteudo.aluno?.nome ?? "";
// Nomes de outros alunos/produtos que não podem sobrar (ignora os que aparecem no conteúdo DESTE aluno)
const textoAluno = JSON.stringify(conteudo);
const nomesReferencia = ["Mentora Exemplo", "Método Exemplo", "exemplo fictício"].filter((n) => !textoAluno.includes(n));

rmSync(SAIDA, { recursive: true, force: true });
mkdirSync(SAIDA, { recursive: true });

const MEDIR = (nomesRef) => {
  const vw = window.innerWidth, mobile = vw < 700;
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && cs.opacity !== "0"; };
  const nome = (el) => { let s = el.tagName.toLowerCase(); if (el.id) s += "#" + el.id; const c = [...el.classList].slice(0, 2).join("."); if (c) s += "." + c; const sec = el.closest("section[id], header, footer"); return (sec && sec !== el ? `[${sec.id || sec.tagName.toLowerCase()}] ` : "") + s; };
  const txt = (el) => (el.innerText || el.getAttribute("alt") || "").replace(/\s+/g, " ").trim().slice(0, 60);
  const erros = [], avisos = [];

  // 1. Rolagem horizontal
  const sw = document.documentElement.scrollWidth;
  if (sw > vw + 1) {
    const fora = [...document.querySelectorAll("body *")].filter((e) => vis(e) && e.getBoundingClientRect().right > vw + 2 && !e.closest(".ribbon, [data-carousel], .timeline, .modules__track, .t-grid, .sticky-cta, .vsl__stars"));
    erros.push(`Rolagem horizontal: a página tem ${sw}px numa tela de ${vw}px. Elementos passando da tela: ${fora.slice(0, 6).map(nome).join(", ") || "(ver prints)"}`);
  }
  // 2. Fonte pequena
  const pequenos = new Map();
  document.querySelectorAll("p, li, span, a, small, b, strong, label, button, figcaption, blockquote, h4").forEach((el) => {
    if (!vis(el) || !el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
    if (el.closest(".ribbon, .vsl__chip, .sticky-cta, svg")) return;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    const corpo = (el.tagName === "P" || el.tagName === "LI") && !el.closest(".t-card__foot, .stat, .pay-row, .site-footer, .anchor__card, .module__cap, .price-list, .panel, .house, .flow, .tl-item, .then-now, .hero__proof, .cta-note, .everyday, .compare__list, .feature__list, .price-day, .creds, .faq__help, .t-hint");
    if (fs < 12 || (mobile && corpo && fs < 15)) pequenos.set(nome(el), `${fs}px ("${txt(el)}")`);
  });
  [...pequenos].slice(0, 8).forEach(([k, v]) => (parseFloat(v) < 12 ? erros : avisos).push(`Fonte pequena: ${k} com ${v}`));
  // 3. Botões
  document.querySelectorAll(".btn").forEach((b) => {
    if (!vis(b) || b.closest(".sticky-cta")) return;
    const r = b.getBoundingClientRect();
    if (r.height < 46) erros.push(`Botão baixo (${Math.round(r.height)}px, mínimo 48): ${nome(b)} "${txt(b)}"`);
    if (mobile && r.height > 110) avisos.push(`Botão com texto em 3+ linhas no celular: ${nome(b)} "${txt(b)}"`);
  });
  // 4. Imagens
  document.querySelectorAll("img").forEach((img) => {
    if (!vis(img) || !img.naturalWidth) return;
    const r = img.getBoundingClientRect(), fit = getComputedStyle(img).objectFit;
    const d = Math.abs(r.width / r.height - img.naturalWidth / img.naturalHeight) / (img.naturalWidth / img.naturalHeight);
    if (!/\.svg($|\?)/.test(img.src) && fit !== "cover" && fit !== "contain" && d > 0.03) erros.push(`Imagem distorcida (${Math.round(d * 100)}%): ${img.getAttribute("src")}`);
    if (!img.getAttribute("width") || !img.getAttribute("height")) avisos.push(`Imagem sem width/height: ${img.getAttribute("src")}`);
    if (!img.src.endsWith(".svg") && img.naturalWidth < r.width * 0.98 && r.width > 120) avisos.push(`Imagem com resolução baixa para o tamanho (${img.naturalWidth}px exibida em ${Math.round(r.width)}px): ${img.getAttribute("src")}`);
  });
  // 5. Palavra sozinha na última linha de títulos
  document.querySelectorAll("h1, h2, h3, .big-truth, .dream-killer").forEach((h) => {
    if (!vis(h)) return;
    const rg = document.createRange(); rg.selectNodeContents(h);
    const linhas = []; [...rg.getClientRects()].forEach((q) => { const l = linhas.find((x) => Math.abs(x.top - q.top) < 4); if (l) { l.left = Math.min(l.left, q.left); l.right = Math.max(l.right, q.right); } else linhas.push({ top: q.top, left: q.left, right: q.right }); });
    if (linhas.length > 1) { linhas.sort((a, b) => a.top - b.top); const ult = linhas.at(-1), maior = Math.max(...linhas.map((l) => l.right - l.left)); if ((ult.right - ult.left) < maior * 0.22) avisos.push(`Palavra sozinha na última linha do título: ${nome(h)} "${txt(h)}"`); }
  });
  // 6. Item órfão em grade
  document.querySelectorAll("*").forEach((g) => {
    const cs = getComputedStyle(g); if (cs.display !== "grid" || !vis(g)) return;
    const cols = cs.gridTemplateColumns.split(" ").filter(Boolean).length;
    const filhos = [...g.children].filter(vis);
    if (cols < 2 || filhos.length <= cols || cs.gridAutoFlow.includes("column")) return;
    const ult = filhos.at(-1), mesmaLinha = filhos.filter((f) => Math.abs(f.getBoundingClientRect().top - ult.getBoundingClientRect().top) < 4);
    if (mesmaLinha.length === 1 && ult.getBoundingClientRect().width < g.getBoundingClientRect().width * 0.7) avisos.push(`Item sozinho na última linha da grade (${filhos.length} itens em ${cols} colunas): ${nome(g)}`);
  });
  // 7. Texto longo centralizado
  document.querySelectorAll("p").forEach((p) => {
    if (!vis(p) || getComputedStyle(p).textAlign !== "center" || p.closest(".hero")) return; // subheadline do hero pode ser centralizada
    const lh = parseFloat(getComputedStyle(p).lineHeight) || 24;
    if (p.classList.contains("dream-killer") && p.getBoundingClientRect().height / lh > 4.5) { avisos.push(`Frase de impacto longa demais para o formato (${Math.round(p.getBoundingClientRect().height / lh)} linhas): use \`frase_final\` só para frases curtas e mova o resto para \`paragrafos\`: "${txt(p)}"`); return; }
    if (p.getBoundingClientRect().height / lh > 4.5) avisos.push(`Parágrafo longo centralizado (${Math.round(p.getBoundingClientRect().height / lh)} linhas): ${nome(p)} "${txt(p)}"`);
  });
  // 8. Fundos iguais encostados
  const secoes = [...document.querySelectorAll("main section, main .ribbon")].filter((s) => vis(s) && !s.parentElement.closest("section"));
  const fundo = (s) => { let e = s; while (e && e !== document.body) { const b = getComputedStyle(e).backgroundColor; if (b && b !== "rgba(0, 0, 0, 0)" && b !== "transparent") return b; e = e.parentElement; } return "body"; };
  for (let i = 1; i < secoes.length; i++) if (!secoes[i].classList.contains("ribbon") && !secoes[i - 1].classList.contains("ribbon") && fundo(secoes[i]) === fundo(secoes[i - 1]))
    avisos.push(`Duas seções seguidas com o mesmo fundo: #${secoes[i - 1].id} e #${secoes[i].id}`);
  // 9. Pendências e sobras
  document.querySelectorAll(".placeholder").forEach((p) => avisos.push(`Espaço reservado: "${txt(p)}"`));
  const corpoTxt = document.body.innerText + " " + [...document.images].map((i) => i.src).join(" ");
  nomesRef.forEach((n) => { if (corpoTxt.includes(n)) erros.push(`Sobrou conteúdo de outro aluno: "${n}" aparece na página`); });
  document.querySelectorAll("a[href]").forEach((a) => { const h = a.getAttribute("href"); if (h === "#" || h === "") avisos.push(`Link vazio: ${nome(a)} "${txt(a)}"`); if (/PENDENTE|exemplo\.com/i.test(h)) erros.push(`Link de checkout pendente ou do exemplo: ${nome(a)}`); });

  return { erros: [...new Set(erros)], avisos: [...new Set(avisos)], altura: document.documentElement.scrollHeight };
};

const REVELAR = () => {
  document.documentElement.classList.remove("tem-delay");
  document.querySelectorAll(".reveal, [data-stagger], .split, [data-chart], [data-inview]").forEach((e) => e.classList.add("is-in"));
  const st = document.createElement("style");
  st.textContent = "*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important}[data-stagger]>*{opacity:1!important}.sticky-cta{display:none!important}";
  document.head.appendChild(st);
  document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
};

// Abre o navegador de testes. Na nuvem ele pode não vir instalado: tenta instalar e, se não der,
// procura um Chrome/Chromium que já exista na máquina.
const acharChrome = () => {
  const fixos = ["/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable"];
  const pastas = [process.env.PLAYWRIGHT_BROWSERS_PATH, "/opt/pw-browsers", join(process.env.HOME || "", ".cache/ms-playwright")].filter(Boolean);
  for (const base of pastas) {
    if (!existsSync(base)) continue;
    for (const d of readdirSync(base)) {
      for (const sub of ["chrome-linux/chrome", "chrome-linux64/chrome", "chrome-linux/headless_shell", "chrome-headless-shell-linux64/chrome-headless-shell"]) {
        const f = join(base, d, sub); if (existsSync(f)) return f;
      }
    }
  }
  return fixos.find((f) => existsSync(f));
};
let navegador;
try { navegador = await chromium.launch(); }
catch {
  try { console.log("→ Instalando o navegador de testes…"); execSync("npx playwright install chromium", { stdio: "inherit", shell: true }); navegador = await chromium.launch(); }
  catch {
    const caminho = acharChrome();
    try { if (!caminho) throw 0; navegador = await chromium.launch({ executablePath: caminho }); console.log("→ Usando o navegador em " + caminho); }
    catch { console.error("\n❌ Não consegui abrir um navegador de testes nesta máquina. Faça a conferência pelo link de prévia (regras/nuvem.md).\n"); servidor.close(); process.exit(2); }
  }
}

const resultado = {};
for (const [tela, largura, altura, fatia] of [["desktop", 1440, 900, 1400], ["mobile", 390, 844, 1600]]) {
  const pg = await navegador.newPage({ viewport: { width: largura, height: altura } });
  const consoleErros = [];
  pg.on("pageerror", (e) => consoleErros.push(String(e.message).slice(0, 160)));
  pg.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) consoleErros.push(m.text().slice(0, 160)); });
  await pg.goto(`http://127.0.0.1:${porta}/?semdelay=1`, { waitUntil: "load" });
  await pg.evaluate(REVELAR);
  for (let y = 0; y < 30000; y += 800) { await pg.evaluate((yy) => window.scrollTo(0, yy), y); await pg.waitForTimeout(40); }
  await pg.evaluate(() => window.scrollTo(0, 0));
  await pg.waitForTimeout(600);
  const m = await pg.evaluate(MEDIR, nomesReferencia);
  m.console = consoleErros;
  resultado[tela] = m;
  let n = 1;
  for (let y = 0; y < m.altura; y += fatia, n++) {
    await pg.screenshot({ path: join(SAIDA, `${tela}-${String(n).padStart(2, "0")}.png`), fullPage: true, clip: { x: 0, y, width: largura, height: Math.min(fatia, m.altura - y) } });
  }
  m.prints = n - 1;
  await pg.close();
}
await navegador.close();
servidor.close();

// Relatório
const L = [`# Conferência de diagramação: ${nomeAluno}`, "", `Gerado em ${new Date().toLocaleString("pt-BR")}. Prints em \`conferencia/\`.`, ""];
let totalErros = 0, totalAvisos = 0;
for (const tela of ["desktop", "mobile"]) {
  const m = resultado[tela];
  totalErros += m.erros.length; totalAvisos += m.avisos.length + m.console.length;
  L.push(`## ${tela === "desktop" ? "Desktop (1440px)" : "Celular (390px)"}: ${m.prints} prints`, "");
  if (!m.erros.length && !m.avisos.length && !m.console.length) L.push("✅ Nada encontrado automaticamente.");
  m.erros.forEach((e) => L.push(`- ❌ ${e}`));
  m.avisos.forEach((a) => L.push(`- ⚠️ ${a}`));
  m.console.forEach((c) => L.push(`- ⚠️ Erro no console: ${c}`));
  L.push("");
}
L.push("## Agora é com você (olhando os prints)", "",
  "O relatório não enxerga tudo. Abra cada print e confira `regras/diagramacao.md`, seções 1 a 7:",
  "hierarquia, alinhamento, espaçamento, ritmo de fundos, proximidade, consistência e qualidade das imagens.", "");
writeFileSync(join(SAIDA, "relatorio.md"), L.join("\n"));
console.log(`\n${totalErros ? "❌" : "✅"} Conferência concluída: ${totalErros} erro(s), ${totalAvisos} aviso(s).`);
console.log(`   Relatório: conferencia/relatorio.md   Prints: conferencia/*.png\n`);
