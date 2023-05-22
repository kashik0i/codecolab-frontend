import {defineConfig} from "vite";
import {svelte} from "@sveltejs/vite-plugin-svelte";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
// https://vitejs.dev/config/
//@ts-ignore
const MonacoEditorPlugin: typeof monacoEditorPlugin = monacoEditorPlugin.default;
export default defineConfig({
    resolve: {
        alias: {
            "simple-peer": "simple-peer/simplepeer.min.js",
        },
    },
    plugins: [
        svelte(),
        MonacoEditorPlugin({
            // languageWorkers: [
            //     "json",
            //     "editorWorkerService",
            //     "typescript",
            //     "html",
            //     "css",
            // ],
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
