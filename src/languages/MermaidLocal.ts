import mermaid from "mermaid";
import type ILanguageService from "./ILanguageService";

export class MermaidLocal implements ILanguageService {
    private code?: string;

    public constructor() {

    }

    async execute(code, bindings) {
        this.code = code;
        if (!this.code) {
            throw new Error("No diagram found")
        }
        const result= await mermaid.render("mermaid",this.code);
        console.log("diagram",result);
        return result.svg;
    }

    getLanguageName(): string {
        return "mermaid";
    }

    async init() {
        mermaid.initialize({
            startOnLoad: false,
            theme: "neutral",
            securityLevel: "loose",
            flowchart: {
                htmlLabels: false,
                curve: "linear",
                useMaxWidth: true,
                diagramPadding: 8,
                nodeSpacing: 8,
                rankSpacing: 8,
            },
        });
        mermaid.parseError = function (err, hash) {
            console.error(err);
        }
        // mermaid.parse(this.code);
        // mermaid.init(undefined, document.querySelectorAll(".language-mermaid"));
    }
}