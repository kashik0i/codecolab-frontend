<script lang="ts">
    import {Button} from "carbon-components-svelte";
    import {Settings} from "carbon-icons-svelte";
    import CodeBlockSettingsModal from "../Modals/CodeBlockSettingsModal.svelte";

    let open;
    export let language;
    // your script goes here
</script>

<CodeBlockSettingsModal bind:open on:changeLanguage on:changeExecution bind:language/>
<Button
        iconDescription="Block Settings"
        icon={Settings}
        on:click={() => (open = !open)}
/>

<style>
    /* your styles go here */
</style>
