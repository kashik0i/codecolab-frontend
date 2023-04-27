<script lang="ts" context="module">
    import {Terminal} from './terminal.ts';
    // import debounce from 'lodash.debounce';

    let terminal = new Terminal();
    const resize = () => terminal.resize();
</script>
<script lang="ts">
    import {onMount} from "svelte";
    import {SocketClient} from "../../lib/socket.ts";
    // import ResizeObserver from "svelte-resize-observer";
    let terminalElement = undefined;
    let socket;
    let refs: { cWidth?: number; cHeight?: number } = {cHeight: 0, cWidth: 0};
    $: refs.cWidth || refs.cHeight, resize();
    onMount(() => {
        socket = new SocketClient()
        terminal.addSocket(socket)
        terminal.attachTo(terminalElement)
    })

</script>
<div
        bind:clientHeight={refs.cHeight}
        bind:clientWidth={refs.cWidth}
        class="terminal"
        id="term"
        bind:this="{terminalElement}"></div>
<style>
    @import url('xterm/css/xterm.css');
    .terminal{
        width: 100%;
        /*height: fit-content;*/
    }
</style>