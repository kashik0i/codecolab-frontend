<script>
  import { onMount } from "svelte";

  let monaco;
  let container;
  let editor;
  let defaultCode = [
    "let x:number=3;",
    "let y:number=3;",
    "let z:number=x+y;",
    "console.log('z ='+z)",
  ].join("\n");
  onMount(async () => {
    monaco = await import("monaco-editor");
    editor = monaco.editor.create(container, {
      value: defaultCode,
      language: "typescript",
    });
    console.log(editor.getModel());
    return () => {
      destroyed: true;
    };
  });
</script>

<div
  class="monaco-container"
  bind:this={container}
/>

<style>
    .monaco-container{
        height: 500px;
        text-align: left;
    }

</style>
