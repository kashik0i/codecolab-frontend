<script>
  import { Button } from "carbon-components-svelte";
  import { View, ViewOff } from "carbon-icons-svelte";
  export let disabled = true;
  export let open;
  //   const handleTogglePreview = () => {
  //     console.log("preview cell");
  //     open = !open;
  //   };
</script>

<Button
  bind:disabled
  iconDescription="Preview"
  icon={open ? View : ViewOff}
  on:click={() => {
    open = !open;
  }}
/>

<style>
  /* your styles go here */
</style>
