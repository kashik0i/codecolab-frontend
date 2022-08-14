<script lang="ts">
  import { Button } from "carbon-components-svelte";
  import { Run } from "carbon-icons-svelte";
  import { createEventDispatcher } from "svelte";
  const executeDispatch = createEventDispatcher();
</script>

<Button
  iconDescription="Run"
  icon={Run}
  on:click={() => executeDispatch("run")}
/>

<style>
  /* your styles go here */
</style>
