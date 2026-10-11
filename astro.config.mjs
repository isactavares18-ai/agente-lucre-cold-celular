import { defineConfig } from "astro/config";

// Site estático. Cada aluno tem o seu projeto gerado a partir deste template.
export default defineConfig({
  output: "static",
  build: { format: "directory", inlineStylesheets: "never" },
  compressHTML: true,
});
