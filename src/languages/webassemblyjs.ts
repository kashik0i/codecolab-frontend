import WebAssembly from "webassemblyjs";

class WasmCompiler {
    public constructor(buff){
        WebAssembly.instantiate(buff)
    }

}