import type ILanguageService from "./ILanguageService";
import {SQL, Python, Javascript, JavascriptRemote} from "./";
import {supportedExecutionEnum, supportedLanguagesEnum} from "../global.d";
import {MermaidLocal} from "./MermaidLocal";

export class Engine {
    private readonly languages: Record<supportedLanguagesEnum, ILanguageService>

    public async getLanguage(language: supportedLanguagesEnum,execution:supportedExecutionEnum): Promise<ILanguageService> {
        if (!(language in supportedLanguagesEnum)) {
            throw new Error(`${language} doesn't exist or is not yet supported`)
        }
        if (!(language in this.languages)) {
            await this.init(language,execution)
        }
        return this.languages[language];
    }

    public constructor() {
        // @ts-ignore
        this.languages = {};
    }

    private async init(language: supportedLanguagesEnum, execution: supportedExecutionEnum) {
        switch (language) {
            case supportedLanguagesEnum.sql:
                this.languages["sql"] = new SQL();
                await this.languages["sql"].init();
                break;
            case supportedLanguagesEnum.python:
                this.languages["python"] = new Python();
                await this.languages["python"].init();
                break;
            case supportedLanguagesEnum.javascript:
                let executor:ILanguageService;
                if (execution === supportedExecutionEnum.server) {
                    executor = new JavascriptRemote();
                } else if (execution === supportedExecutionEnum.client) {
                    executor = new Javascript();
                }
                this.languages["javascript"] = executor;
                await this.languages["javascript"].init();
                break;
            case supportedLanguagesEnum.mermaid:
                this.languages["mermaid"] = new MermaidLocal();
                await this.languages["mermaid"].init();
                break;
            default:
                throw new Error(`${language} not loaded`)
        }
    }
}