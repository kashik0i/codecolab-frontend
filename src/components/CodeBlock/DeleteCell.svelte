<script lang="ts">
  import { appSettings } from "../../globStore";
  import DeleteCellModal from "../Modals/DeleteCellModal.svelte";
  import { Button } from "carbon-components-svelte";
  import { onMount, createEventDispatcher } from "svelte";
  import { TrashCan } from "carbon-icons-svelte";
  let openDeleteCellWarningModal = false;
  const deleteDispatch = createEventDispatcher();
</script>

<DeleteCellModal bind:open={openDeleteCellWarningModal} on:delete />
<Button
  kind="danger-tertiary"
  iconDescription="Delete"
  icon={TrashCan}
  on:click={() => {
    if ($appSettings.deleteCellWarning) {
      openDeleteCellWarningModal = !openDeleteCellWarningModal;
      return;
    }
    deleteDispatch("delete");
  }}
/>

<style>
  /* your styles go here */
</style>
