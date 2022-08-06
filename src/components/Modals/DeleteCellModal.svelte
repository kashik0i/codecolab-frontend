<script lang="ts">
  import { Checkbox, Modal } from "carbon-components-svelte";
  import { appSettings } from "../../globStore";
  export let open = false;
  export let deleteCell: (e: CustomEvent<string | number>) => void;
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
  on:submit={() => (open = false)}
>
  <Checkbox
    labelText="Always warn"
    bind:checked={$appSettings.deleteCellWarning}
  />
</Modal>
