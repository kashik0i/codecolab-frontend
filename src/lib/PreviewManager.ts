import { PreviewTypes, type enumValues } from "../global.d";
import IFrameWrapper from "./IFrameWrapper";

export default class PreviewManager {
  getCurrentView(): IFrameWrapper {
    return this.getView(this.context);
  }
  private _views: Map<string, IFrameWrapper>;
  private _context: enumValues;
  constructor(doc: Document) {
    const validKeys = Object.keys(PreviewTypes).filter((val) => isNaN(+val));
    this._views = new Map(
      validKeys.map((name) => {
        return [name, new IFrameWrapper(name, doc.createElement("iframe"))];
      })
    );
    // console.log(this._views);
    this.context = "output";
  }
  public setView(context: enumValues, value: HTMLIFrameElement) {
    this._views.set(context, new IFrameWrapper(context, value));
  }
  public getView(context: enumValues) {
    console.log(this._views);
    return this._views.get(context);
  }
  public get context() {
    return this._context;
  }
  public set context(context: enumValues) {
    this._context = context;
  }
  public write(name: enumValues, content) {
    console.log(`PreviewManager:\twrite to ${name} content: ${content}`);
    const view = this.getView(name);
    if (view == undefined) {
      throw new Error("view is not valid");
    }
    view.write(content);
  }
}
