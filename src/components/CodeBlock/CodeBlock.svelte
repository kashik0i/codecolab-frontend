<script lang="ts">
  import { generate } from "../../lib";
  import ExportCell from "./ExportCell.svelte";
  import DeleteCell from "./DeleteCell.svelte";
  import PreviewCell from "./previewCell.svelte";
  import RunCell from "./RunCell.svelte";
  import CellSettings from "./CellSettings.svelte";
  import { appSettings } from "../../globStore";
  import "monaco-sql-languages/out/esm/plsql/plsql.contribution";
  import "monaco-sql-languages/out/esm/sql/sql.contribution";
  import { editorTheme } from "../../globStore";
  import { Button, Loading, Modal } from "carbon-components-svelte";
  import { ArrowUp, ArrowDown, Settings } from "carbon-icons-svelte";
  import * as monaco from "monaco-editor";
  import { onMount, createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";

  import type { EditorModel } from "src/global";
  import Preview from "../Preview.svelte";
  import { wait } from "../../lib/wait";
  import alasql from "alasql";
  let previewWrite, contextSwitch, previewRead;
  let executeCell: (e: CustomEvent) => void;
  let isPreviewOpen = false;
  let moveDispatch = createEventDispatcher();
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
    render: false,
    status: "idle",
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
      await wait(300);
      switch (model.language) {
        case "sql":
          try {
            const res = alasql(model.code);
            console.log(res);
            generate(res);
            model.status = "success";
          } catch (error) {
            console.error(error);
            console.log(error.message);

            previewWrite("error", error.message, false, true);
            // console.log(previewWrite);

            model.status = "fail";
          }

          break;
        default:
          alert("unkown language");
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
  const dispatch = createEventDispatcher();
  function forward(event: CustomEvent) {
    dispatch(event.type, { parent: event.detail, model });
  }
  // <svelte:window
  // on:keydown={onKeydown}
  // bind:innerWidth
  // />
  const onResize = () => {
    // console.log("Window resize");
    editor.layout({} as monaco.editor.IDimension);
  };
  const changeTheme = (theme) => {
    monaco.editor.setTheme(theme);
  };

  $: changeTheme($editorTheme);
</script>

<Loading active={!loaded} />
<div class="editor-block">
  <div class="tools">
    <div class="tools__upper">
      <div class="tools__upper-left">
        <RunCell on:run={executeCell} />
        <DeleteCell on:delete />
        <ExportCell on:export={exportCell} />
      </div>
      <div class="tools__upper-center">
        <PreviewCell bind:disabled={model.preview} bind:open={isPreviewOpen} />
      </div>
      <div class="tools__upper-right">
        <CellSettings />
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
      </div>
    </div>
  </div>
  <div
    class="monaco-container status"
    class:pending={model.status === "pending"}
    class:idle={model.status === "idle"}
    class:fail={model.status === "fail"}
    class:success={model.status === "success"}
    bind:this={container}
    style="width: 100%;height:250px;"
    on:resize={(e) => console.log(e)}
  />
</div>
{#if model.render && isPreviewOpen}
  <Preview
    bind:id={model.id}
    bind:write={previewWrite}
    bind:read={previewRead}
    bind:contextSwitch
    bind:isOpen={isPreviewOpen}
  />
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
    position: absolute;
    left: 50%;
  }
  .status {
    margin-bottom: 40px;
    text-align: left;
    border-left-width: 6px;
    border-left-style: solid;
    padding-left: 10px;

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
