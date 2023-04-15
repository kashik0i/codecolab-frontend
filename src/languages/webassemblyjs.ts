import WebAssembly from "webassemblyjs";

export class WasmCompiler {
    public constructor(buff){
        WebAssembly.instantiate(buff)
    }

}