<script lang="ts">
  import {
    Checkbox,
    Modal,
    Select,
    SelectItem,
  } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";
  import { appSettings } from "../../stores";
  let exportDispatch = createEventDispatcher();
  export let open = false;
  let exportTypes = ["ipynb", "json", "python", "pyodide"];
  let selected = "ipynb";
</script>

<Modal
  bind:open
  modalHeading="Export Cell"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (open = false)}
  on:open
  on:close
  on:submit={(e) => {
    open = false;
    console.log(selected);
    exportDispatch("export", { exportType: selected });
  }}
>
  <Select bind:selected>
    {#each exportTypes as item}
      <SelectItem text={item} value={item} />
    {/each}
  </Select>
</Modal>
