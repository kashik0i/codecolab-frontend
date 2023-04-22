import type ILanguageService from "./ILanguageService";

export class JavascriptRemote implements ILanguageService {
    private code?: string;
    private params?: Array<any>;
    private readonly serverUrl: string;

    public constructor() {
        this.serverUrl = `http://localhost:3000`
        console.log(this.serverUrl)
    }

    async execute(code: string, bindings: Array<any>) {
        this.code = code;
        this.params = bindings;
        if (!this.code) {
            throw new Error("No code provided")
        }
        console.log(`executing code on ${this.serverUrl}`)
        try {
            const result = await fetch(`${(this.serverUrl)}/sandbox`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({script: code})
            })
            console.log("result", result)
            return await result.json()
        } catch (e) {
            console.log(e);
        }

    }

    getLanguageName(): string {
        return "javascript";
    }

    async init() {
        try {
            const result = await fetch(`${(this.serverUrl)}/health`)
            console.log("result", result)
            await result.text()
        } catch (e) {
            console.log(e);
        }
    }
}