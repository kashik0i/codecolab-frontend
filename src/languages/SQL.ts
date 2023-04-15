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

export class SQL implements ILanguageService {
    private sql?: string;
    private params?: Array<any>;

    public constructor() {

    }

    // public async statement(sql, params) {
    //     this.sql = sql
    //     this.params = params
    //     return await this.execute()
    // }

    async execute(code, bindings) {
        this.sql = code;
        this.params = bindings;
        if (!this.sql) {
            throw new Error("No sql query found")
        }
        return alasql.promise(this.sql, this.params);

    }

    getLanguageName(): string {
        return "sql";
    }

    async init() {
        const sql = `create table dual(X VARCHAR2(1));
insert into dual values ('X')`;
        await alasql.promise(sql)
        alasql.fn.datetime = function (dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleString();
        };
    }
}