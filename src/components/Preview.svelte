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

  let loading = true;
  let selectedIndex;
  function para(doc: Document, text) {
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
    console.log(errorRef.document.querySelector("body"));
    doc.body.appendChild(m);
  }
  export const write = (
    type: "output" | "ast" | "statistics" | "error" | "console",
    data,
    append: boolean,
    switchContext = false
  ) => {
    switch (type) {
      case "output":
        var doc = outputRef.contentDocument;
        break;
      case "ast":
        var doc = astRef.contentDocument;
        break;
      case "statistics":
        var doc = statisticsRef.contentDocument;
        break;
      case "error":
        var doc = errorRef.contentDocument;
        break;
      case "console":
        var doc = consoleRef.contentDocument;
        break;
      default:
        break;
    }
    doc.open();

    if (append) {
      para(doc, data);
      //   doc.writeln(data);
    } else {
      para(doc, data);
      //   doc.write(data);
    }
    doc.close();
    if (switchContext) {
      contextSwitch(contexts[type]);
    }
  };
  let contexts = {
    output: 0,
    ast: 1,
    statistics: 2,
    error: 3,
    console: 4,
  };
  export const read = (
    type: "output" | "ast" | "statistics" | "error" | "console"
  ) => {};
  export const contextSwitch = (id) => {
    selectedIndex = id;
  };
  let consoleRef: HTMLIFrameElement,
    statisticsRef: HTMLIFrameElement,
    astRef: HTMLIFrameElement,
    errorRef: HTMLIFrameElement,
    outputRef: HTMLIFrameElement;
  export let isOpen = true;
  export let isConsoleOpen = false;
  export let id = "";

  onMount(() => {
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
      <Switch text="Output" />
      <Switch text="Statistics" />
      <Switch text="AST" />
      <Switch text="Error" />
    </ContentSwitcher>

    <iframe
      class={`output__iframe__${id}`}
      bind:this={outputRef}
      title="output_iframe"
      class:active={selectedIndex == contexts.output}
    />
    <iframe
      bind:this={statisticsRef}
      title="statisics_iframe"
      class:active={selectedIndex == contexts.statistics}
    />
    <iframe
      bind:this={astRef}
      title="ast_iframe"
      class:active={selectedIndex == contexts.ast}
    />
    <iframe
      bind:this={errorRef}
      title="error_iframe"
      class:active={selectedIndex == contexts.error}
    />
    <div
      class="console-header"
      class:active={isConsoleOpen}
      on:click={() => {
        console.log(isConsoleOpen);
        isConsoleOpen = !isConsoleOpen;
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
