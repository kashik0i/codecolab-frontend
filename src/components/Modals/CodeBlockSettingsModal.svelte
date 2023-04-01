<script lang="ts">
  import { Button, Modal, Select, SelectItem } from "carbon-components-svelte";
  import { Settings } from "carbon-icons-svelte";
  import { createEventDispatcher } from "svelte";
  // import { supportedLanguagesEnum } from "../../global";

  import { supportedLanguages } from "../../globStore";
  export let open = false;
  export let language;
  let changeLanguageDispatch = createEventDispatcher();
</script>

<!-- <Button on:click={() => (open = true)} /> -->

<Modal
  bind:open
  modalHeading="Block Settings"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (open = false)}
  on:open
  on:close
  on:submit={() => (open = false)}
>
  <!-- on:change={(e) => {
      appTheme.set(e.detail);
    }} -->
  <Select
    labelText="language"
    bind:selected={language}
    on:change={(e) =>{changeLanguageDispatch("changeLanguage",e.detail)}}
  >
    {#each $supportedLanguages as lang}
      <SelectItem value={lang} />
    {/each}
  </Select>
</Modal>
