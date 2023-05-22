<script lang="ts">
    import {onMount} from "svelte";
    import Terminal from "../../components/Terminal/Terminal.svelte"
    import CodeBlockList from "../../components/CodeBlock/CodeBlockList.svelte";
    import Alda from "../../components/Alda/Alda.svelte";
    import WebCam from "../../components/WebCam/WebCam.svelte";

    let container: HTMLDivElement;

    function getNewRandomColor() {
        const myArray = ['red', 'blue', 'green', 'yellow', 'cyan', 'orange'];
        for (let i = 0; i < container.children.length; i++) {
            container.children[i].style.backgroundColor = myArray[Math.floor(Math.random() * myArray.length)];
        }
    }

    let RO: ResizeObserver;

    onMount(() => {
        // getNewRandomColor()
        /*

          RO = new ResizeObserver((entries) => {
              for (let entry of entries) {
                  Terminal.resize();
              }
          });

          const termElm = document.querySelector<HTMLElement>("div#terminal");
          RO.observe(termElm);

          () => {
              RO.unobserve(termElm);
              RO.disconnect();
          }*/
    });
</script>

<!-- <Filetree /> -->
<div class="container" bind:this={container}>
    <WebCam/>
    <CodeBlockList/>
    <!--    <Alda/>-->
</div>

<style>
    .container {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
    }

    p {
        width: 100vw;
        flex-grow: 1;
    }

    * {
        /*overflow-y: scroll;*/
    }
</style>
