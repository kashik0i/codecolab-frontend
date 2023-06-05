<script context="module" lang="ts">
    import type {WebCamManager} from "./WebCamManager";

    let elements = new Set<WebCamManager>()
</script>
<script lang="ts">
    import {WebCamManager} from "./WebCamManager";

    import Video from "carbon-icons-svelte/lib/Video.svelte";
    import VideoOff from "carbon-icons-svelte/lib/VideoOff.svelte";
    import {Loading} from "carbon-components-svelte";
    import Peer from 'simple-peer'
    import {onMount} from "svelte";
    // import {session} from '../../stores'

    let toggle = false
    let toggleIcon = Video;
    let loading = false;
    export let manager: WebCamManager
    let togglePiP = false;
    let enablePiP = false;
    let pipButton;
    export let isSelf
    // $: isSelf = manager?.isSelf,console.log("isSelf",isSelf)
    onMount(() => {
        // id = $session._user._id
        // video.crossOrigin = 'anonymous';
        manager = new WebCamManager();
        elements.add(manager);
        //TODO: signal delete for others
        return () => elements.delete(manager);
    })




    async function stopCamera() {
        if (document.pictureInPictureElement) {
            await stopPiP();
        }
        togglePiP = false;
        for (const track of manager.video.srcObject.getTracks()) {
            track.stop();
        }
        togglePiP = true;
        manager.video.srcObject = null;
    }


    const handleWebCam = async () => {
        if (toggle) {
            await stopCamera()
            toggle = false
            enablePiP = false
            toggleIcon = Video;
            return;
        }
        try {
            loading = true;
            manager.video.srcObject = await navigator.mediaDevices.getUserMedia({
                video: {facingMode: "user"},
                audio: true
            });

            //--------------------------------------------------------

            // document.getElementById('send').addEventListener('click', function () {
            //     var yourMessage = document.getElementById('yourMessage').value
            //     peer.send(yourMessage)
            // })

            // peer.on('data', function (data) {
            //     document.getElementById('messages').textContent += data + '\n'
            // })

            //--------------------------------------------------------
            await manager.video.play();
            manager.video.muted = true;
            loading = false;
            toggle = true;
            enablePiP = true;
            toggleIcon = VideoOff
        } catch (error) {
            console.log(error);
        }
    };

    async function stopPiP() {
        await document.exitPictureInPicture()
        togglePiP = false;
    }

    async function handleTogglePiP() {
        if (!('pictureInPictureEnabled' in document)) {
            alert('picture in picture is not supported');
            return;
        }
        if (document.pictureInPictureElement) {
            await stopPiP();
            return;
        }
        togglePiP = true;
        await manager.video.requestPictureInPicture()
    }


</script>
{#if manager}
    <div class="container">
        <div class="video-window">
            <!-- svelte-ignore a11y-media-has-caption -->
            <video bind:this={manager.video}></video>
        </div>
        <button on:click={handleWebCam}>
            <svelte:component this={toggleIcon}/>
        </button>
        <!--        <button bind:this={pipButton} on:click={handleTogglePiP} disabled={!enablePiP}>Enter-->
        <!--            Picture-in-Picture mode-->
        <!--        </button>-->
        <!--        <button on:click={handleWebCam}>-->
        <!--            <svelte:component this={toggleIcon}/>-->
        <!--        </button>-->
        <!--        <button on:click={handleJoinRoom}>join room-->
        <!--        </button>-->
        <!--        <label>-->
        <!--            {manager.isSelf ? "self-" : "other-"}id-->
        <!--            <input value={JSON.stringify(manager.data)}/>-->
        <!--        </label>-->

    </div>
{:else}
    <Loading active={true} description="Active loading indicator"/>
{/if}


<style>
    .container {
        display: grid;
    }

    .video-window {
        display: grid;
        grid-auto-flow: column;
    }
</style>