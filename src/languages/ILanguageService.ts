export default interface ILanguageService {
    getLanguageName(): string;

    init(): Promise<void>;

    execute(code: string, bindings: Array<any>): Promise<any>;

}