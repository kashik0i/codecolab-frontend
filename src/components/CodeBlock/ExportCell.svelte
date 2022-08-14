<script>
  import ExportCellModal from "./../Modals/ExportCellModal.svelte";
  import { Button } from "carbon-components-svelte";
  import { Export } from "carbon-icons-svelte";
  let exportCellModalOpen = false;
</script>

<ExportCellModal bind:open={exportCellModalOpen} on:export />
<Button
  iconDescription="Export"
  icon={Export}
  on:click={() => {
    exportCellModalOpen = !exportCellModalOpen;
  }}
  isSelected={false}
/>

<style>
  /* your styles go here */
</style>
