<script lang="ts">
    import {
        Button,
        ClickableTile,
        ContentSwitcher,
        SkeletonPlaceholder,
        Switch, TextInput,
    } from "carbon-components-svelte";
    import {accordion, wait} from "../lib";
    import {createEventDispatcher, onMount, tick} from "svelte";
    import {fade, scale} from "svelte/transition";
    import PreviewManager from "./../lib/PreviewManager";
    import {PreviewTypes, type ObjectWithKeysOfEnumAsKeys} from "../global.d";
    import Xterm from "./Xterm.svelte";
    import Terminal from "./Terminal/Terminal.svelte";
    import mermaid from "mermaid";
    let previewFrame: HTMLDivElement;
    let loading = true;
    let selectedIndex;
    // let parentFrame:HTMLDivElement;
    let previewManager: PreviewManager;


    export async function write(
        context: keyof ObjectWithKeysOfEnumAsKeys,
        data,
        append: boolean,
        isSwitch = false,
        isMermaidDiagram = false
    ): Promise<void> {
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
            previewManager.write(context, data, document);
            //   doc.writeln(data);
        } else {
            previewManager.clear(context);
            previewManager.write(context, data, document);
            //   doc.write(data);
        }
    }

    export function switchContext(
        context: keyof ObjectWithKeysOfEnumAsKeys
    ): void {
        terminalActive = false;
        console.log("switch")
        previewManager.switchContext(context)
        selectedIndex = PreviewTypes[context];
        // parentFrame.appendChild(previewManager.getView(context).element);

        // console.log("context:", previewManager.context);
        // console.log("parent", parentFrame);
        // console.log("parent", parentFrame.children[0]);
        if (context === "xterm") {
            terminalActive = true;
        }
    }

    export const read = (type: PreviewTypes) => {
    };
    export let isOpen = false;
    export let isXtermOpen = false;
    export let id = "";
    let xtermRef;
    onMount(async () => {
        loading = false;
        await tick()
        previewManager = new PreviewManager(document, id, previewFrame);
        switchContext("error")
        // previewManager.switchContext("error")
    });

    function openXterm() {
        console.log(isXtermOpen);
        isXtermOpen = !isXtermOpen;
    }

    let promptInput;
    let handlePrompt;

    const animate = (node, args) =>
        args.cond ? fade(node, args) : scale(node, args);
    // $: console.log(selectedIndex);
    let root;
    let terminalActive: boolean = true;
</script>

<div use:accordion={isOpen} class="preview" transition:animate bind:this={root}>
    {#if loading}
        <SkeletonPlaceholder style="height: 12rem; width: 100%;"/>
    {:else}
        <ContentSwitcher bind:selectedIndex>
            <Switch text="Output" on:click={() => switchContext("output")}/>
            <Switch text="Statistics" on:click={() => switchContext("statistics")}/>
            <Switch text="AST" on:click={() => switchContext("ast")}/>
            <Switch text="Error" on:click={() => switchContext("error")}/>
            <Switch text="Console" on:click={() => switchContext("console")}/>
            <Switch text="Terminal" on:click={() => switchContext("xterm")}/>
        </ContentSwitcher>
        <div class:hidden={!terminalActive}>
            <Terminal/>
        </div>
        <div class:hidden={terminalActive} bind:this={previewFrame} class="iframe {id}"></div>


        <!--        <div style="display: grid;grid-auto-flow: column;grid-template-columns: 1fr;">-->
        <!--            <TextInput on:input={(e)=>promptInput=e.detail} labelText="command prompt"-->
        <!--                       placeholder="Send to server...."/>-->
        <!--            <Button on:click={()=>handlePrompt(promptInput)}>send</Button>-->
        <!--        </div>-->

    {/if}
</div>

<style>

    .console-header {
        /*border: 10px;*/
        border: var(--cds-background) solid 10px;
    }
    .hidden{
        display: none !important;
    }
    .active {
        background-color: white;
        /*border-color: var(--cds-background-active);*/
        border-color: white;
        color: black;
        display: block;

    }

    .iframe {
        display: contents;
        height: min-content;
    }
    .preview {
        display: contents;
        min-height: 150px;
        transition: all 0.2s ease-in;
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
