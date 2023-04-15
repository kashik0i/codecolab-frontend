import type ILanguageService from "./ILanguageService";
import {SQL} from "./SQL";
import {supportedLanguagesEnum} from "../global.d";
import {Python} from "./python";

export class Engine {
    private languages: Record<supportedLanguagesEnum, ILanguageService>

    public async getLanguage(language: supportedLanguagesEnum): Promise<ILanguageService> {
        if (!(language in supportedLanguagesEnum)) {
            throw new Error(`${language} doesn't exist or is not yet supported`)
        }
        if (!(language in this.languages)) {
            await this.init(language)
        }
        return this.languages[language];
    }

    public constructor() {
        // @ts-ignore
        this.languages = {};
    }

    private async init(language: supportedLanguagesEnum) {
        switch (language) {
            case supportedLanguagesEnum.sql:
                this.languages["sql"] = new SQL();
                await this.languages["sql"].init();
                break;
            case supportedLanguagesEnum.python:
                this.languages["python"] = new Python();
                await this.languages["python"].init();
                break;
            default:
                throw new Error(`${language} not loaded`)
        }
    }
}