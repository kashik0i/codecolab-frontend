<script lang="ts">
    import {xterm} from '../lib/xterm.ts';
    import {onMount} from "svelte";

    let terminalDiv: HTMLDivElement;
    let terminal: xterm;
    export let handlePrompt = (data) => {
        console.log(data, terminal)
        terminal.send(data)
    };
    onMount(async () => {
        terminal = new xterm(terminalDiv)
        await terminal.init(`ws://localhost:${3000}`)
        terminal.write("Hello terminal user!\n");
    })
</script>
<!--<div class="xterminal"-->
<!--     bind:this={terminalDiv}>-->
<!--    dasd-->
<!--</div>-->


<style>
    .xterminal {
        width: 100%;
        height: 40%;
    }
</style>