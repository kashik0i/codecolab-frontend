<script lang="ts">
    import {appSettings} from "../../globStore";
    import CodeBlockSettingsModal from "./../Modals/CodeBlockSettingsModal.svelte";
    import {editorTheme} from "../../globStore";
    import {Button, Loading, Modal} from "carbon-components-svelte";
    import {
        Copy,
        Run,
        Save,
        TrashCan,
        ArrowUp,
        ArrowDown,
        Settings,
        View, ViewOff,
    } from "carbon-icons-svelte";
    import * as monaco from "monaco-editor";
    import {onMount} from "svelte";
    import {writable} from "svelte/store";
    import DeleteCellModal from "../Modals/DeleteCellModal.svelte";
    import type {EditorModel} from "src/global";
    import Preview from "../Preview.svelte";
    import Sandbox from "websandbox";
    import {wait} from "../../lib/wait";
    let executeCell;
    let outputRef: HTMLIFrameElement;
    let isPreviewOpen;
    export let moveCellDown,
        moveCellUp,
        deleteCell,
        copyCell,
        exportCell;
    const handleTogglePreview = () => {
        console.log("preview cell");
        isPreviewOpen = !isPreviewOpen;
    };
    let isView = true;
    let editor: monaco.editor.IStandaloneCodeEditor;
    let container;
    let loaded = false;
    export let model: EditorModel = {
        code: "",
        language: null,
        order: 0,
        id: "",
        preview: true,
        render: false
    };
    $: {
        model.order,
            editor?.getValue() != model.code
                ? (editor?.setValue(model.code),
                    changeLanguage(model.language),
                    console.log(model.order))
                : null;
    }

    // export let code = "";
    // export let language: string | null = null;
    // export let id: string;
    // export let order: number;
    let openBlockSettingsModal = false;
    let openDeleteCellWarningModal = false;
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
        executeCell = async () => {
            isPreviewOpen = true
            await wait(100)
            const openDatabase = require('websql');
            const db = openDatabase(':memory:', '1.0', 'description', 1);
            console.log(db)
            console.log("executed")

        };
        loaded = true;
        return () => window.removeEventListener("resize", onResize);
    });

    function changeLanguage(lang: string) {
        let model = editor?.getModel();
        if (!model) return;
        monaco.editor.setModelLanguage(model, lang);
        console.log(`language changed to ${lang}`);
    }

    const changeLanguageEvent = (e) => {
        const lang = e.detail;
        // monaco.editor.setModelLanguage(editor?.getModel(), lang);
        changeLanguage(lang);
    };
    // <svelte:window
    // on:keydown={onKeydown}
    // bind:innerWidth
    // />
    const onResize = () => {
        // console.log("Window resize");
        editor.layout({} as monaco.editor.IDimension);
    };
    const changeTheme = (theme) => {
        monaco.editor.setTheme(theme)
    }

    $: changeTheme($editorTheme)
</script>

<Loading active={!loaded}/>
<div class="editor-block">
    <CodeBlockSettingsModal
            bind:open={openBlockSettingsModal}
            {changeLanguageEvent}
    />
    <DeleteCellModal bind:open={openDeleteCellWarningModal} {deleteCell}/>
    <!-- {@debug editor} -->
    <div class="tools">
        <div class="tools-right">
            <Button iconDescription="Run" icon={Run} on:click={executeCell}/>
            <Button iconDescription="Copy" icon={Copy} on:click={copyCell}/>
            <Button
                    iconDescription="Save"
                    icon={Save}
                    on:click={exportCell}
                    isSelected={false}
            />

            <Button
                    kind="danger-tertiary"
                    iconDescription="Delete"
                    icon={TrashCan}
                    on:click={() => {
          if ($appSettings.deleteCellWarning) {
            openDeleteCellWarningModal = !openDeleteCellWarningModal;
            return;
          }
          deleteCell();
        }}
            />
        </div>
        <div class="tools-center">
            <Button
                    disabled={model.preview}
                    iconDescription="Preview"
                    icon={isPreviewOpen?View:ViewOff}
                    on:click={handleTogglePreview}
            />
        </div>
        <div class="tools-left">
            <Button
                    iconDescription="Block Settings"
                    icon={Settings}
                    on:click={() => (openBlockSettingsModal = !openBlockSettingsModal)}
            />
            <Button
                    iconDescription="Move Up"
                    icon={ArrowUp}
                    on:click={(e) => moveCellUp(e, model, editor)}
            />
            <Button
                    iconDescription="Move Down"
                    icon={ArrowDown}
                    on:click={(e) => moveCellDown(e, model, editor)}
            />
        </div>
    </div>
    <div
            class="monaco-container"
            bind:this={container}
            style="width: 100%;height:250px;"
            on:resize={(e) => console.log(e)}></div>
</div>
{#if model.render && isPreviewOpen}
    <Preview bind:id={model.id} bind:outputRef={outputRef} bind:isOpen={isPreviewOpen}/>
{/if}


<style>
    .editor-block {
        display: contents;
        resize: both;
    }

    .monaco-container {
        width: 100%;
        height: 250px;
        text-align: left;
        min-width: fit-content;
    }

    .tools {
        border: 1px solid red;
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
    }

    .tools-right {
        display: flex;

        /* margin-left: auto; added */
    }

    .tools-left {
        display: flex;
        align-self: flex-end;
        margin-left: auto;
    }

    .tools-center {
        display: flex;
        margin-right: auto;
        align-self: center;
        position: absolute;
        left: 50%;
    }
</style>
