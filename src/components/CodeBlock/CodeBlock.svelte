<script lang="ts">
    import {wait} from "../../lib";
    import ExportCell from "./ExportCell.svelte";
    import DeleteCell from "./DeleteCell.svelte";
    import PreviewCell from "./previewCell.svelte";
    import RunCell from "./RunCell.svelte";
    import CellSettings from "./CellSettings.svelte";
    import {editorTheme, languageServiceEngine} from "../../stores";
    import "monaco-sql-languages/out/esm/plsql/plsql.contribution";
    import "monaco-sql-languages/out/esm/sql/sql.contribution";
    import {Button, Loading} from "carbon-components-svelte";
    import {App, ArrowDown, ArrowUp, BareMetalServer, type CarbonIcon, Cloud} from "carbon-icons-svelte";
    import * as monaco from "monaco-editor";
    // import { AutoTypings, LocalStorageCache } from 'monaco-editor-auto-typings';
    import {createEventDispatcher, onMount} from "svelte";
    import {type enumValues,supportedExecutionEnum, supportedLanguagesEnum} from "../../global.d";

    import type {EditorModel} from "src/global";
    import Preview from "../Preview.svelte";


    let executionLogo: CarbonIcon;
    let previewWrite: (
            context: enumValues,
            data: any,
            append: boolean,
            isSwitch?: boolean
        ) => void,
        switchContext,
        previewRead;
    let executeCell: (e: CustomEvent) => void;
    let isPreviewOpen = false;
    let moveDispatch = createEventDispatcher();
    let isView = true;
    let editor: monaco.editor.IStandaloneCodeEditor;
    let container;
    let loaded = false;
    export let model = <EditorModel>{
        code: "",
        language: null,
        order: 0,
        id: "",
        preview: true,
        render: false,
        status: "idle",
        execution:supportedExecutionEnum.client
    };
    $: {
        model.order,
            editor?.getValue() != model.code
                ? (editor?.setValue(model.code),
                    changeLanguage(model.language),
                    console.log(model, model.order))
                : null;
    }

    // export let code = "";
    // export let language: string | null = null;
    // export let id: string;
    // export let order: number;
    let openBlockSettingsModal = false;

    onMount(async () => {
        // monaco = await import("monaco-editor");
        editor = monaco.editor.create(container, {
            value: model.code,
            language: model.language,
            automaticLayout: true,
            // model: null,
            theme: $editorTheme,
            // "semanticHighlighting.enabled"
            //   readOnly: true,
        });
        changeExecutionLogo(model.execution)
        // Initialize auto typing on monaco editor. Imports will now automatically be typed!
        // const autoTypings = await AutoTypings.create(editor, {
        //   sourceCache: new LocalStorageCache(), // Cache loaded sources in localStorage. May be omitted
        //   // Log progress updates to a div console
        //   onUpdate: (u, t) => {
        //     const consoleElement= document.getElementsByClassName(`console-${model.id}`);
        //     if(!consoleElement.length){
        //       console.log(u,t)
        //       return
        //     }
        //     const mountPoint =consoleElement[0];
        //     const log = document.createElement('div');
        //     log.innerHTML = t;
        //     mountPoint.appendChild(log);
        //     mountPoint.scrollTop = mountPoint.scrollHeight;
        //   },
        //
        //   // Log errors to a div console
        //   onError: e => {
        //     const consoleElement= document.getElementsByClassName(`console-${model.id}`);
        //     if(!consoleElement.length){
        //       console.log("123",e)
        //       return
        //     }
        //     const mountPoint =consoleElement[0];
        //     const log = document.createElement('div');
        //     log.classList.add('err');
        //     log.innerHTML = e;
        //     mountPoint.appendChild(log);
        //     mountPoint.scrollTop = mountPoint.scrollHeight;
        //   },
        //
        //   // Print loaded versions to DOM
        //   onUpdateVersions: versions => {
        //     const consoleElement= document.getElementsByClassName(`console-${model.id}`);
        //     if(!consoleElement.length){
        //       return
        //     }
        //     const mountPoint =consoleElement[0];
        //     mountPoint!.innerHTML = Object.entries(versions)
        //             .map(v => `<div>${v[0]}: ${v[1]}</div>`)
        //             .join('');
        //   },
        // });
        editor.onDidChangeModelContent((e) => {
            model.code = editor.getModel().getValue();
        });
        monaco.editor.setTheme($editorTheme);
        // editorTheme.subscribe((val) => {
        //   monaco.editor.setTheme(val);
        //   // editor.setTheme(val)
        // });
        // monaco.editor.colorize(code, language).then((html) => {
        //   console.log(container);
        //   console.log(html);
        //   console.log(code);
        //   console.log(codeRef);
        //   if (codeRef.childern) {
        //     console.log(codeRef.childern[0].innerHTML);
        //   }
        // });
        window.addEventListener("resize", onResize);

        console.log(editor.getModel());
        executeCell = async (e: CustomEvent) => {
            // console.log(e.detail, "cell ran");
            // const model = e.detail.model;
            // const idx = $codeTree.findIndex((val) => val.id === model.id);
            // console.log(model.order, $codeTree[model.order]);

            model.status = "pending";
            isPreviewOpen = true;
            await wait(1000);
            switch (model.language) {
                case supportedLanguagesEnum.sql:
                    try {
                        const sqlEngine = await $languageServiceEngine.getLanguage(supportedLanguagesEnum.sql);
                        console.log(sqlEngine)
                        const res = await sqlEngine.execute(model.code, null);
                        console.log(res);
                        // await generate(res);
                        previewWrite("output", res, false, true);

                        model.status = "success";
                    } catch (error) {
                        console.error(error);
                        console.log(error.message);

                        previewWrite("error", error.message, false, true);
                        // console.log(previewWrite);
                        model.status = "fail";
                    }

                    break;
                case supportedLanguagesEnum.python:
                    try {
                        model.status = "fail";
                        previewWrite("error", "unsupported language", false, true);
                        return;
                        const pythonEngine = await $languageServiceEngine.getLanguage(supportedLanguagesEnum.python);
                        const result = await pythonEngine.execute(model.code, null)

                        // const pythonVersion = await pythonEngine.getVersion();
                        // console.log(pythonVersion);
                        previewWrite("output", result, false, true);
                        model.status = "success";
                    } catch (error) {
                        console.error(error);
                        previewWrite("error", error.message, false, true);
                        model.status = "fail";
                    }

                    break;
                case supportedLanguagesEnum.svelte:
                    break;
                case supportedLanguagesEnum.javascript:
                    try {
                        const result = eval(model.code)
                        previewWrite("output", result, false, true);
                        model.status = "success";
                    } catch (error) {
                        console.error(error);
                        console.log(error.message);

                        previewWrite("error", error.message, false, true);
                        // console.log(previewWrite);
                        model.status = "fail";
                    }
                    break;
                case supportedLanguagesEnum.typescript:
                    break;
                case supportedLanguagesEnum.markdown:
                    break;
                case supportedLanguagesEnum.html:
                    break;
                case supportedLanguagesEnum.css:
                    break;
                case supportedLanguagesEnum.json:
                    break;
                default:
                    model.status = "fail";
                    previewWrite("error", "unsupported language", false, true);
                // alert("unkown language");
            }
            // $codeTree[model.order].status = "success";
            // await wait(300);
        };
        loaded = true;
        return () => window.removeEventListener("resize", onResize);
    });
    const exportCell = (e: CustomEvent) => {
        console.log(e.detail, "cell exported");
    };
    const changeExecutionLogo=(execution)=> {
        switch (execution) {
            case supportedExecutionEnum.client:
                executionLogo = App
                break;

            case supportedExecutionEnum.server:
                executionLogo = BareMetalServer
                break;

            case supportedExecutionEnum.serverless:
                executionLogo = Cloud
                break;
        }
    }
    function changeLanguage(lang: string) {
        let model = editor?.getModel();
        if (!model) return;
        monaco.editor.setModelLanguage(model, lang);
        console.log(`language changed to ${lang}`);
    }
    function changeExecution(exec: supportedExecutionEnum) {
        model.execution=exec;
        console.log(`Execution changed to ${exec}`);
    }
    const changeLanguageEvent = (e) => {
        const lang = e.detail;
        changeLanguage(lang);
    };
    const changeExecutionEvent = (e) => {
        const exec = e.detail;
        changeExecution(exec);
        changeExecutionLogo(exec);
    };
    const dispatch = createEventDispatcher();

    function forward(event: CustomEvent) {
        dispatch(event.type, {parent: event.detail, model});
    }

    // <svelte:window
    // on:keydown={onKeydown}
    // bind:innerWidth
    // />
    const onResize = () => {
        // console.log("Window resize");
        editor.layout();
        // editor.layout({} as monaco.editor.IDimension);
    };
    const changeTheme = (theme) => {
        monaco.editor.setTheme(theme);
    };

    $: changeTheme($editorTheme);
</script>

<Loading active={!loaded}/>
<div class="editor-block">
    <div class="tools">
        <div class="tools__upper">
            <div class="tools__upper-left">
                <RunCell on:run={executeCell}/>
                <DeleteCell on:delete/>
                <ExportCell on:export={exportCell}/>
            </div>
            <div class="tools__upper-center">
                <PreviewCell bind:disabled={model.preview} bind:open={isPreviewOpen}/>
            </div>
            <div class="tools__upper-right">

                <CellSettings on:changeLanguage={changeLanguageEvent} on:changeExecution={changeExecutionEvent} bind:language={model.language}/>
                <Button
                        iconDescription="Move Up"
                        icon={ArrowUp}
                        on:click={() => moveDispatch("move-up", model)}
                />
                <Button
                        iconDescription="Move Down"
                        icon={ArrowDown}
                        on:click={() => moveDispatch("move-down", model)}
                />
                <Button
                        iconDescription={model.execution}
                        icon={executionLogo}
                        kind="ghost"
                />
            </div>
        </div>
    </div>
    <div
            class="monaco-container status"
            class:pending={model.status === "pending"}
            class:idle={model.status === "idle"}
            class:fail={model.status === "fail"}
            class:success={model.status === "success"}
            bind:this={container}>
    </div>
</div>
{#if model.render && isPreviewOpen}
    <Preview
            bind:id={model.id}
            bind:write={previewWrite}
            bind:read={previewRead}
            bind:switchContext
            bind:isOpen={isPreviewOpen}
    />
{/if}

<style>
    .editor-block {
        /*display: contents;*/
        /*resize: both;*/
    }

    .monaco-container {
        width: 100%;
        height: 250px;
        /*text-align: left;*/
        /*min-width: fit-content;*/
    }

    .tools__upper {
        border: 1px solid red;
        display: flex;
        flex-direction: row;
    }

    .tools__upper-right {
        display: flex;
        margin-left: auto;
    }

    .tools__upper-left {
        display: flex;
    }

    .tools__upper-center {
        display: flex;
        margin-right: auto;
        align-self: center;
        position: sticky;
        left: 50%;
    }

    .status {
        margin-bottom: 40px;
        text-align: left;
        border-left-width: 6px;
        border-left-style: solid;
        /*padding-left: 10px;*/
        transition: all 0.2s ease-in;
    }

    .success {
        border-color: green;
    }

    .fail {
        border-color: red;
    }

    .pending {
        border-color: yellow;
    }

    .idle {
        border-color: white;
    }
</style>
