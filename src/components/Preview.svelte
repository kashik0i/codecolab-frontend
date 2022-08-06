<script lang="ts">
    import {ClickableTile, ContentSwitcher, SkeletonPlaceholder, Switch} from "carbon-components-svelte";
    import {accordion} from '../lib/accordion'
    import {createEventDispatcher, onMount} from "svelte";

    let loading = true;
    let selectedIndex;
    let consoleRef: HTMLIFrameElement, statisticsRef: HTMLIFrameElement,astRef:HTMLIFrameElement
    let consoleContent = ""
    export let isOpen = true
    export let isConsoleOpen = false
    export let id = ""
    export let outputRef: HTMLIFrameElement;
    onMount(() => {
        loading = false
    })




    $ :console.log(selectedIndex)

</script>

<div use:accordion={isOpen} class="preview">
    {#if loading}
        <SkeletonPlaceholder style="height: 12rem; width: 100%;"/>
    {:else}
        <ContentSwitcher bind:selectedIndex>
            <Switch text="Output"/>
            <Switch text="Statistics"/>
            <Switch text="AST"/>
        </ContentSwitcher>
        {#if selectedIndex === 0}
            <iframe class={`output__iframe__${id}`} bind:this={outputRef}></iframe>
        {:else if selectedIndex === 1}
            <iframe bind:this={statisticsRef}></iframe>
        {:else if selectedIndex === 2}
            <iframe bind:this={astRef}></iframe>
        {/if}
        <div class="console-header" class:active={isConsoleOpen} on:click={()=>{
                           console.log(isConsoleOpen);
                           isConsoleOpen=!isConsoleOpen
                       }}>console
        </div>
        <div use:accordion={isConsoleOpen}>
                    <iframe bind:this={consoleRef}></iframe>
        </div>
        <!--        <div >console</div>-->
    {/if}
</div>


<style>
    .console-header{
        /*border: 10px;*/
        border: var(--cds-background) solid 10px;
    }
    .active{
        background-color: white;
        /*border-color: var(--cds-background-active);*/
        border-color: white;
        color:black;
    }
    .preview {
        min-height: 150px;
    }

    iframe {
        width: 100%;
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
