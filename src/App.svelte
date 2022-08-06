<script lang="ts">
  import Theme from "./components/Theme.svelte";
  import Nav from "./components/Nav.svelte";
  import Preview from "./components/Preview.svelte";
  import Filetree from "./components/filetree/Filetree.svelte";
  import Monaco from "./components/Monaco.svelte";
  import { Content, Grid, Row, Column } from "carbon-components-svelte";
  import CodeBlockList from "./components/CodeBlock/CodeBlockList.svelte";
</script>

<Theme />
<Nav />

<Content>
  <div class="body">
    <!-- <Filetree /> -->
    <CodeBlockList />
  </div>
  <div class="footer"></div>
</Content>

<style>
  .header {
  }
  .body {
    display: grid;
    grid-template-columns: auto auto;
  }
  .footer {
  }
</style>
