// export function defineLanguage() {
//   window.MonacoEnvironment = {
//     getWorkerUrl: function (moduleId, label) {
//       switch (label) {
//         case "plsql": {
//           return "./plsql.worker.js";
//         }
//         case "sql": {
//           return "./sql.worker.js";
//         }
//         default: {
//           return "./editor.worker.js";
//         }
//       }
//     },
//   };
// }
import alasql from "alasql";
import type ILanguageService from "./ILanguageService";

export class Javascript implements ILanguageService {
    private code?: string;
    private params?: Array<any>;

    public constructor() {

    }

    async execute(code, bindings) {
        this.code = code;
        this.params = bindings;
        if (!this.code) {
            throw new Error("No sql query found")
        }
        return alasql.promise(this.code, this.params);

    }

    getLanguageName(): string {
        return "javascript";
    }

    async init() {

    }
}