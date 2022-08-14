<script lang="ts">
  // import Grid from "svelte-grid";
  // import gridHelp from "svelte-grid/build/helper/index.mjs";
  import BlockSplitter from "./../BlockSplitter.svelte";
  import { derived } from "svelte/store";
  import { codeTree, removedCodeTree } from "../../codeTreeStore";
  import CodeBlock from "./CodeBlock.svelte";
  import { wait, generate } from "../../lib";
  import alasql from "alasql";

  const createMiscCell = (id) => {
    // const idx = $codeTree.findIndex((val) => val.id === id);
    // const isLast=$codeTree.length-1
    console.log(id, "create misc cell");
  };
  const createCodeCell = (id) => {
    console.log("create code cell");
  };
  // const runCell = async (e: CustomEvent) => {
  //   console.log(e.detail, "cell ran");
  //   const model = e.detail.model;
  //   // const idx = $codeTree.findIndex((val) => val.id === model.id);
  //   // console.log(model.order, $codeTree[model.order]);

  //   $codeTree[model.order].status = "pending";
  //   // await wait(300);
  //   switch (model.language) {
  //     case "sql":
  //       try {
  //         const res = alasql(model.code);
  //         console.log(res);
  //         generate(res);
  //         $codeTree[model.order].status = "success";
  //       } catch (error) {
  //         console.error(error);
  //         $codeTree[model.order].status = "fail";
  //       }

  //       break;
  //     default:
  //       alert("unkown language");
  //   }
  //   // $codeTree[model.order].status = "success";
  //   // await wait(300);
  // };

  const deleteCell = (e: CustomEvent) => {
    const model = e.detail;
    console.log(model);
    const id = model.id;
    console.log(id);
    const idx = $codeTree.findIndex((val) => val.id === id);
    console.log(`cell deleted ${idx}`);
    $removedCodeTree.push(...$codeTree.splice(id, 1));
    $codeTree = $codeTree;
  };

  const moveCellDown = (e: CustomEvent) => {
    const model = e.detail;
    console.log(e, model);
    if (model.order == $sorted.length - 1) {
      console.log("cell cannot move down");
      return;
    }
    const found = $sorted.find((cell) => cell.order == model.order + 1);
    console.log(found);
    const idx = $codeTree.findIndex((val) => val === found);
    console.log(`found at ${idx}`);
    $codeTree[idx].order--;
    $codeTree[idx - 1].order++;
    console.log($codeTree);
    // codeTree.set($codeTree);
    // editor.setValue(found.code);
    // editor.setValue(found.code);
    // editor.setValue;
  };
  const moveCellUp = (e: CustomEvent) => {
    const model = e.detail;
    // const _this = sorted.find((cell) => cell.order == model.order);
    // console.log(_this);
    if (model.order == 0) {
      console.log("cell cannot move up");
      return;
    }
    const found = $sorted.find((cell) => cell.order == model.order - 1);
    console.log(found);
    const idx = $codeTree.findIndex((val) => val === found);
    console.log(`found at ${idx}`);
    $codeTree[idx].order++;
    $codeTree[idx + 1].order--;
    console.log($codeTree);
    // codeTree.set($codeTree);
    // return callback();
  };
  // let sorted: typeof $codeTree = [];
  // $: $codeTree,
  //   (sorted = $codeTree.sort((a, b) => a.order - b.order)),
  //   console.log("resorted");

  const sorted = derived(codeTree, ($c) =>
    $c.sort((a, b) => a.order - b.order)
  );

  const id = () => "_" + Math.random().toString(36).substr(2, 9);

  // $: items = $codeTree.map((data, id) => {
  //   return {
  //     6: gridHelp.item({
  //       draggable: true,
  //       x: id * 1,
  //       y: 0,
  //       w: 1,
  //       h: 1,
  //     }),
  //     id,
  //     data: id,
  //   };
  // });
  let drag = false;
  // const cols = [[6, 6]];
</script>

<!-- {#if drag} -->
<!-- <div class="demo-container">
    <Grid bind:items rowHeight={150} gap={[10, 5]} let:item let:dataItem {cols}>
      <div>
        <CodeBlock
          bind:model={$codeTree[dataItem.id]}
          {moveCellDown}
          {moveCellUp}
          on:run={runCell}
          on:delete={deleteCell}
        />
      </div>
    </Grid>
  </div> -->
<!-- {:else}
  
{/if} -->
<div>
  {#each $codeTree as model, id}
    <!-- <pre>{JSON.stringify($codeTree[id], undefined, 50)}</pre> -->
    <BlockSplitter {createCodeCell} {createMiscCell} id={id.toString()} />

    <CodeBlock
      bind:model
      on:move-down={moveCellDown}
      on:move-up={moveCellUp}
      on:delete={deleteCell}
    />
    {#if id === $codeTree.length - 1}
      <BlockSplitter
        {createCodeCell}
        {createMiscCell}
        id={(1 + id).toString()}
      />
    {/if}
  {/each}
</div>
