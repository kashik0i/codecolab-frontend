<script lang="ts">
  import { Button } from "carbon-components-svelte";
  export let id: string;
</script>

<div {id} class="splitter item-fade " on:mouseenter={() => {}}>
  <Button>Code Cell</Button>
  <Button>misc Cell</Button>
</div>

<!-- .container{
    display:inline-block;
    padding:5px;
    background-color:black;
    opacity: 1;
}

.container:hover{
    background-color:red;
}
img{
    opacity: 1;
}
img:hover{
    opacity: 0.7;
}

.transition{
    transition: all .25s ease-in-out;
    -moz-transition: all .25s ease-in-out;
    -webkit-transition: all .25s 
    
} -->
<style>
  .splitter {
    margin: 10px;
    display: flex;
    flex-direction: row;
    align-content: space-around;
    justify-content: center;
  }
  .item-fade {
    vertical-align: top;
    transition: opacity 0.3s;
    opacity: 0;
  }

  .item-fade:hover {
    opacity: 1;
  }
</style>
