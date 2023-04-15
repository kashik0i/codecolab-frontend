<script lang="ts">
  import { appTheme } from "../stores";
  import { Theme } from "carbon-components-svelte";
  import "carbon-components-svelte/css/all.css";
</script>

<Theme bind:theme={$appTheme} persist persistKey="__carbon-theme" />
