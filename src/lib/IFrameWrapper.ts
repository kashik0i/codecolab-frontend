export default class IFrameWrapper {
  private _name: string;
  private _element: HTMLIFrameElement;
  public constructor(name: string, frame: HTMLIFrameElement) {
    console.log(`created ${name} view`, frame);
    this._element = frame;
    this._element.classList.add(name);
    this._name = name;
  }
  public set element(e: HTMLIFrameElement) {
    this.element = e;
  }
  public get element() {
    return this._element;
  }
  public get name() {
    return this._name;
  }
  public write(input) {
    console.log(this.element);
    const doc = this.element.contentDocument;
    const node = doc.createElement("div");
    node.innerText = input;
    doc.body.appendChild(node);
  }
  public read(): string {
    return this.element.contentDocument.body.innerHTML;
  }
  public para(text) {
    const doc = this.element.contentDocument;
    var m = doc.createElement("p");

    m.setAttribute(
      "style",
      "border:1px solid black;height:100px;width:500px;position:relative;background-color:white;"
    );

    m.setAttribute("designMode", "on");
    m.setAttribute("contenteditable", "true");
    var t = doc.createElement("div"); //"div" instead of "q"
    t.innerHTML = text;

    m.appendChild(t);
    // console.log(errorRef.document.querySelector("body"));
    doc.body.appendChild(m);
  }
}
