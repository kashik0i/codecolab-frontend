<script lang="ts">
  import { Checkbox, Modal } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";
  import { appSettings } from "../../stores";
  let deleteDispatch = createEventDispatcher();
  export let open = false;
</script>

<Modal
  bind:open
  modalHeading="Delete Cell"
  primaryButtonText="Confirm"
  danger={true}
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (open = false)}
  on:open
  on:close
  on:submit={(e) => {
    console.log(e);
    open = false;
    deleteDispatch("delete");
  }}
>
  <Checkbox
    labelText="Always warn"
    bind:checked={$appSettings.deleteCellWarning}
  />
</Modal>
