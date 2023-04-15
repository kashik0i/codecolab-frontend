<script lang="ts">
  import {
    Button,
    Checkbox,
    Modal,
    Select,
    SelectItem,
  } from "carbon-components-svelte";
  import { Settings } from "carbon-icons-svelte";
  import { editorTheme, appTheme, appSettings } from "../../stores";
  export let open = false;
</script>

<!-- <Button on:click={() => (open = true)} /> -->

<Modal
  bind:open
  modalHeading="App Settings"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (open = false)}
  on:open
  on:close
  on:submit={() => (open = false)}
>
  <Select
    labelText="App theme"
    selected={$appTheme}
    on:change={(e) => {
      appTheme.set(e.detail);
    }}
  >
    <SelectItem value="white" />
    <SelectItem value="g10" />
    <SelectItem value="g80" />
    <SelectItem value="g90" />
    <SelectItem value="g100" />
  </Select>
  <Select
    labelText="Editor theme"
    selected={$editorTheme}
    on:change={(e) => {
      editorTheme.set(e.detail);
    }}
  >
    <SelectItem value="vs" />
    <SelectItem value="vs-dark" />
    <SelectItem value="hc-black" />
  </Select>
  <Checkbox
    labelText="Warn before delete cell"
    bind:checked={$appSettings.deleteCellWarning}
  />
</Modal>
