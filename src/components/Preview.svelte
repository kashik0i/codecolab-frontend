<script lang="ts">
  import {
    ClickableTile,
    ContentSwitcher,
    SkeletonPlaceholder,
    Switch,
  } from "carbon-components-svelte";
  import { accordion } from "../lib/accordion";
  import { createEventDispatcher, onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import PreviewManager from "./../lib/PreviewManager";
  import { PreviewTypes, type ObjectWithKeysOfEnumAsKeys } from "../global.d";

  let loading = true;
  let selectedIndex;

  let previewManager: PreviewManager;
  export function write(
    context: keyof ObjectWithKeysOfEnumAsKeys,
    data,
    append: boolean,
    isSwitch = false
  ) {
    if (isSwitch) {
      switchContext(context);
    }

    console.log(
      `write to ${context} : '${data}'' ${
        append ? "with" : "without"
      } append and ${switchContext ? "with" : "without"} context switch`
    );
    // return;
    if (append) {
      previewManager.write(context, data);
      //   doc.writeln(data);
    } else {
      previewManager.write(context, data);
      //   doc.write(data);
    }
  }

  export function switchContext(
    context: keyof ObjectWithKeysOfEnumAsKeys
  ): void {
    console.log("curretn context", previewManager.context);
    // const previewName = PreviewTypes[context];
    console.log("view", previewManager.getView(context));

    selectedIndex = PreviewTypes[context];
    const frame = document.querySelector(".iframe");
    // frame.innerHTML = "";
    console.log("context:", previewManager.context);
    // frame.removeChild(previewManager.getCurrentView().element);
    frame.appendChild(previewManager.getCurrentView().element);
    previewManager.context = context;
    console.log("FFFFFFF", frame);
  }

  export const read = (type: PreviewTypes) => {};
  export let isOpen = true;
  export let isConsoleOpen = false;
  export let id = "";
  let consoleRef;
  onMount(() => {
    previewManager = new PreviewManager(document);

    console.log("Hello");

    loading = false;
  });
  const animate = (node, args) =>
    args.cond ? fade(node, args) : scale(node, args);
  $: console.log(selectedIndex);
</script>

<div use:accordion={isOpen} class="preview" transition:animate>
  {#if loading}
    <SkeletonPlaceholder style="height: 12rem; width: 100%;" />
  {:else}
    <ContentSwitcher bind:selectedIndex>
      <Switch text="Output" on:click={() => switchContext("output")} />
      <Switch text="Statistics" on:click={() => switchContext("statistics")} />
      <Switch text="AST" on:click={() => switchContext("ast")} />
      <Switch text="Error" on:click={() => switchContext("error")} />
    </ContentSwitcher>
    <div class="iframe" />
    <!-- <iframe
      class={`output__iframe__${id}`}
      bind:this={}
      title="output_iframe"
      class:active={previewManager.context == "output"}
    />
    <iframe
      bind:this={statisticsRef}
      title="statisics_iframe"
      class:active={previewManager.context == "statistics"}
    />
    <iframe
      bind:this={astRef}
      title="ast_iframe"
      class:active={previewManager.context == "ast"}
    />
    <iframe
      bind:this={errorRef}
      title="error_iframe"
      class:active={previewManager.context == "error"}
    /> -->
    <div
      class="console-header"
      class:active={isConsoleOpen}
      on:click={() => {
        console.log(isConsoleOpen);
        isConsoleOpen = !isConsoleOpen;
        // previewManager.context == "console";
      }}
    >
      console
    </div>
    <div use:accordion={isConsoleOpen}>
      <iframe
        style="display:block;"
        bind:this={consoleRef}
        title="console_iframe"
      />
    </div>
    <!--        <div >console</div>-->
  {/if}
</div>

<style>
  .console-header {
    /*border: 10px;*/
    border: var(--cds-background) solid 10px;
  }
  .active {
    background-color: white;
    /*border-color: var(--cds-background-active);*/
    border-color: white;
    color: black;
  }
  .preview {
    min-height: 150px;
    transition: all 0.2s ease-in;
  }

  iframe {
    width: 100%;
    display: none;
  }
  .active {
    display: block;
  }
  div {
    border: solid 1px #333;
    box-sizing: border-box;
  }

  h1 {
    padding: 10px;
    margin: 0;
  }
</style>
