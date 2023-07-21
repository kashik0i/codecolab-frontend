export default class IFrameWrapper {
  private _name: string;
  private _element: HTMLDivElement;
  public constructor(name: string, frame: HTMLDivElement,id:string) {
    // console.log(`created ${name} view`, frame);
    this._element = frame;
    this._element.classList.add(`${name}-${id}`);
    this._name = name;
  }
  public set element(e: HTMLDivElement) {
    this._element = e;
  }
  public get element() {
    return this._element;
  }
  public get name() {
    return this._name;
  }
  public write(input,doc:HTMLDocument) {
    console.log(this.element);
    // const doc = this.element.contentDocument;
    // const node = doc.createElement("div");
    // node.innerText = input;
    const para=doc.createElement('div');
    para.innerHTML=input;
    this.element.appendChild(para);
  }
  public clear(): void {
    this.element.innerHTML='';
  }
  public read(): string {
    return this.element.innerHTML;
  }
  public para(text) {
    var m = new HTMLParagraphElement();

    m.setAttribute(
      "style",
      "border:1px solid black;height:100px;width:500px;position:relative;background-color:white;"
    );

    m.setAttribute("designMode", "on");
    m.setAttribute("contenteditable", "true");
    const t = new HTMLDivElement();
    t.innerHTML = text;

    m.appendChild(t);
    // console.log(errorRef.document.querySelector("body"));
    this.element.appendChild(m);
  }


}
