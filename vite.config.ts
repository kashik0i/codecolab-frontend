import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    monacoEditorPlugin.default({
      // languages: ["javascript", "typescript", "sql", "html"],
      languageWorkers: [
        "json",
        "editorWorkerService",
        "typescript",
        "html",
        "json",
      ],
      customWorkers: [
        {
          label: "sql",
          entry: "monaco-sql-languages/out/esm/sql/sql.worker.js",
        },
        {
          label: "plsql",
          entry: "monaco-sql-languages/out/esm/plsql/plsql.worker.js",
        },
      ],
    }),
  ],
});
