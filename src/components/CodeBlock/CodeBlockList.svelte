<script lang="ts">
    import BlockSplitter from "./../BlockSplitter.svelte";
    // import { Json } from "carbon-icons-svelte";
    import {derived} from "svelte/store";
    import {codeTree} from "../../codeTreeStore";
    import CodeBlock from "./CodeBlock.svelte";
    import Sandbox from "websandbox";
    import * as Websandbox from "websandbox";

    const deleteCell = (id) => {
        const idx = $codeTree.findIndex((val) => val.id === id);
        console.log("cell deleted");
    };

    const copyCell = () => {
        console.log("cell coped");
    };
    const exportCell = () => {
        console.log("cell exported");
    };

    const moveCellDown = (e, model, editor) => {
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
    const moveCellUp = (e, model, editor) => {
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
</script>

<div>
    {#each $codeTree as model, id}
        <!-- {JSON.stringify($codeTree[i])} -->
        <BlockSplitter id={id.toString()}/>
        <CodeBlock
                bind:model
                {moveCellDown}
                {moveCellUp}
                {deleteCell}
                {copyCell}
                {exportCell}
        />
        {#if id === $codeTree.length - 1}
            <BlockSplitter id={id.toString()}/>
        {/if}
    {/each}
</div>
