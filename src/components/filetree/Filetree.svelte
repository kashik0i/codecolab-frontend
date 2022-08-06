<script lang="ts">
  import { TreeView } from "carbon-components-svelte";
  // // import type { TreeNodeId } from "carbon-components-svelte/types/TreeView/TreeView.svelte";
  import { Folder, DocumentBlank, Document } from "carbon-icons-svelte";
  import { fileStructure as children } from "../../fileStructureStore";

  let activeId = 0;
  let selectedIds = [];
</script>

<TreeView
  width="100px"
  hideLabel
  children={$children}
  bind:activeId
  bind:selectedIds
  on:select={({ detail }) => console.log("select", detail)}
  on:toggle={({ detail }) => console.log("toggle", detail)}
  on:focus={({ detail }) => console.log("focus", detail)}
/>

<!-- <div>Active node id: {activeId}</div>
<div>Selected ids: {JSON.stringify(selectedIds)}</div> -->
<style>
  div {
    margin-top: var(--cds-spacing-05);
  }
</style>
