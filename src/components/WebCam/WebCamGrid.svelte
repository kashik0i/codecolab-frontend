<script lang="ts">
    import WebCam from "./WebCam.svelte";
    import {Loading} from "carbon-components-svelte";
    import {onMount} from "svelte";
    import {WebCamManager} from "./WebCamManager";

    let manager: WebCamManager;
    let users: Array<WebCamManager> = []
    onMount(() => {
        users.push(manager)
    })

    function handleCreateRoom() {
        manager.createRoom();
    }

    export function handleJoinRoom(data) {
        if (!data) {
            return alert('missing other user data')
        }
        manager.joinRoom(data)
    }
</script>


<div class="container">
    {JSON.stringify(users)}
    {#each users as user,index}
        {index}-{JSON.stringify(user)}
    {/each}
    <WebCam isSelf={true} bind:manager={manager}/>
    {#if manager}
        <button on:click={handleCreateRoom}>create room</button>
        <button on:click={handleJoinRoom}>join</button>
    {:else}
        <Loading active={true} description="Active loading indicator"/>
    {/if}
</div>

<style>
    .container {
        display: grid;
    }

    .video-window {
        display: grid;
        grid-auto-flow: column;
    }
</style>