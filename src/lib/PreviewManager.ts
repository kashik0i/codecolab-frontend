import {PreviewTypes, type enumValues} from "../global.d";
import IFrameWrapper from "./IFrameWrapper";

export default class PreviewManager {
    get parentDiv(): HTMLDivElement {
        return this._parentDiv;
    }

    set parentDiv(value: HTMLDivElement) {
        this._parentDiv = value;
    }

    getCurrentView(): IFrameWrapper {
        return this.getView(this.context);
    }

    private readonly _views: Map<string, IFrameWrapper>;
    private _context: enumValues;
    private _parentDiv: HTMLDivElement;

    constructor(doc: Document, id: string, parentDiv: HTMLDivElement) {
        const validKeys = Object.keys(PreviewTypes).filter((val) => isNaN(+val));
        this._views = new Map(
            validKeys.map((name) => {
                const frame = new IFrameWrapper(name, doc.createElement("div"), id);

                frame.element.style.width = "100%";
                frame.element.style.height = "200px";
                frame.element.style.backgroundColor = "blue";
                frame.element.style.display = "table";
                return [name, frame];
            })
        );
        this._parentDiv = parentDiv
        this.context = "output";
    }

    // public setView(context: enumValues, value: HTMLIFrameElement) {
    //     this._views.set(context, new IFrameWrapper(context, value));
    // }
    public get views() {
        return this._views;
    }

    public getView(context: enumValues) {
        console.log(this._views.get(context))
        return this._views.get(context);
    }

    public get context() {
        return this._context;
    }

    public set context(context: enumValues) {
        this._context = context;
    }

    public switchContext(
        context: enumValues
    ): void {
        console.log("switch")
        if (this.context === context)
            return;
        this.context = context;
        const element = this.getView(context).element
        if (!element) {
            debugger
        }
        console.log(this.parentDiv)
        this.parentDiv.replaceChildren(element);

    }

    public write(name: enumValues, content, doc) {
        // debugger
        if (typeof content !== "string") {
            content = JSON.stringify(content)
        }
        console.log(`PreviewManager:\twrite to ${name} content: ${content}`);
        const view = this.getView(name);
        console.log(view)
        if (view == undefined) {
            throw new Error("view is not valid");
        }
        // view.para("content");
        view.write(content, doc);
    }

    public writeRaw(name: enumValues, content, doc) {
        // debugger
        if (typeof content !== "string") {
            content = JSON.stringify(content)
        }
        console.log(`PreviewManager:\twrite to ${name} content: ${content}`);
        const view = this.getView(name);
        console.log(view)
        if (view == undefined) {
            throw new Error("view is not valid");
        }
        // view.para("content");
        view.write(content, doc);
    }

    public clear(name): void {
        const view = this.getView(name);
        console.log(view)
        if (view == undefined) {
            throw new Error("view is not valid");
        }
        // view.para("content");
        view.clear();
    }
}
