import {loadPyodide} from "pyodide";
import type ILanguageService from "./ILanguageService";

export class Python implements ILanguageService {
    private pyodide;

    public constructor() {
    }

    async init() {
        this.pyodide = await loadPyodide({indexURL: "<pyodide artifacts folder>",});
    }

    // public async statement(sql, params) {
    //     this.sql = sql
    //     this.params = params
    //     return await this.execute()
    // }

    async execute(code, bindings) {
        if (!code) {
            throw new Error("No code to execute")
        }
        return this.pyodide.runPythonAsync(code);
    }

    async getVersion(): Promise<any> {
        return this.pyodide.runPythonAsync(`
    import sys
    sys.version
  `);
    }

    getLanguageName(): string {
        return "sql";
    }
}