import * as monaco from "monaco-editor";

import * as Mermaid from "./Mermaid"
import type {languages as MonacoLanguages} from "monaco-editor";
type ILanguageExtensionPoint = MonacoLanguages.ILanguageExtensionPoint;
export interface MonarchLanguageConfiguration extends monaco.languages.IMonarchLanguage {
    keywords: string[];
}
export interface ICustomMonarchLanguage {
    configuration:MonarchLanguageConfiguration,
    extensionPoint:ILanguageExtensionPoint
}
export enum ILanguageId {
    MermaidSequenceDiagram = "mermaidSequenceDiagram",
    // Add more language IDs here
}
interface ILanguage extends Record<ILanguageId, ICustomMonarchLanguage> {}
const languages: ILanguage = {
    [ILanguageId.MermaidSequenceDiagram]: Mermaid.SequenceDiagram,
    // Add more languages here
}

export function registerCustomLanguage(id:  ILanguageId) {
    const language = languages[id];

    monaco.languages.register(language.extensionPoint);
    monaco.languages.setMonarchTokensProvider(id, language.configuration);
}