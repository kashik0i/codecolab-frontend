import {writable} from "svelte/store";
import {
    typescriptDemo1,
    javascriptDemo1,
    svelteDemo1,
    jsonSettingsDemo1,
    htmlDemo1,
    sqlDemo1,
    sqlDemo2,
    pythonDemo1
} from "../codesDemo";
import {v4 as uuidv4} from "uuid";
import type {EditorModel} from "../global";

const demoCode: EditorModel[] = [
    typescriptDemo1,
    javascriptDemo1,
    jsonSettingsDemo1,
    sqlDemo1,
    sqlDemo2,
    pythonDemo1
    // htmlDemo1
].map((val, i) => {
    val.order = i;
    val.id = uuidv4();
    val.preview =
        ["html", "javascript", "typescript", "markdown", "jsx", "sql", "python"].find(
            (lang) => lang == val.language
        ) == undefined;
    return val;
});
export const codeTree = writable(demoCode);
export const removedCodeTree = writable<EditorModel[]>([]);
