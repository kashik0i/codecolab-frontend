<script lang="ts">
    import Video from "carbon-icons-svelte/lib/Video.svelte";
    import VideoOff from "carbon-icons-svelte/lib/VideoOff.svelte";
    import {Loading} from "carbon-components-svelte";
    import Peer from 'simple-peer'
    import {onMount} from "svelte";
    import {session} from '../../stores'

    let toggle = false
    let toggleIcon = Video;
    let video: HTMLVideoElement = null;
    let loading = false;
    let peer: Peer;
    let id;
    let otherId;
    let togglePiP = false;
    let enablePiP = false;
    let pipButton;
    let otherVideo: HTMLVideoElement;

    onMount(() => {
        // id = $session._user._id
        // video.crossOrigin = 'anonymous';
    })

    async function stopCamera() {
        if (document.pictureInPictureElement) {
            await stopPiP();
        }
        togglePiP = false;
        for (const track of video.srcObject.getTracks()) {
            track.stop();
        }
        togglePiP = true;
        video.srcObject = null;
    }

    function initPeer() {
        peer.on('error', err => console.log('error', err))
        peer.on('connect', () => {
            console.log('CONNECT')
            peer.send('whatever' + Math.random())
        })
        peer.on('data', data => {
            console.log('data: ' + data)
        })
        peer.on('signal', function (data) {
            id = JSON.stringify(data)
            console.log(data)

        })
        peer.on('stream', async function (stream) {
            console.log(stream)
            if ('srcObject' in video) {
                otherVideo.srcObject = stream
            } else {
                video.src = window.URL.createObjectURL(stream) // for older browsers
            }
            await otherVideo.play()
        })
    }

    function handleCreateRoom() {
        peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
                iceServers: [
                    {urls: 'stun:stun.l.google.com:19302'},
                    {urls: 'stun:stun1.l.google.com:19302'},
                    {urls: 'stun:stun2.l.google.com:19302'},
                    {urls: 'stun:stun3.l.google.com:19302'},
                    {urls: 'stun:stun4.l.google.com:19302'},
                    {
                        url: 'turn:turn.bistri.com:80',
                        credential: 'homeo',
                        username: 'homeo',
                    },
                    {
                        url: 'turn:turn.anyfirewall.com:443?transport=tcp',
                        credential: 'webrtc',
                        username: 'webrtc',
                    }
                ]
            },
            stream: video.srcObject
        })
        initPeer()
    }

    function handleJoinRoom() {
        if (!otherId) {
            return alert('missing other user id')
        }
        if (!peer) {
            peer = new Peer({
                initiator: false,
                trickle: false,
                stream: video.srcObject
            })
            initPeer()
        }
        otherId = JSON.parse(otherId);
        console.log("other", otherId)
        peer.signal(otherId)
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
            video.srcObject = await navigator.mediaDevices.getUserMedia({
                video: {facingMode: "user"},
                // audio: true
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
            await video.play();
            // video.muted = true;
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
        await video.requestPictureInPicture()
    }


</script>

<div class="container">
    <Loading bind:active={loading} description="Active loading indicator"/>
    <div class="video-window">
        <!-- svelte-ignore a11y-media-has-caption -->
        <video bind:this={video}/>
        <!-- svelte-ignore a11y-media-has-caption -->
        <video bind:this={otherVideo}/>
    </div>

    <button on:click={handleWebCam}>
        <svelte:component this={toggleIcon}/>
    </button>
    <button bind:this={pipButton} on:click={handleTogglePiP} disabled={!enablePiP}>Enter
        Picture-in-Picture mode
    </button>
    <label>
        self id
        <input bind:value={id}/>
    </label>
    <label>
        other id
        <input bind:value={otherId}/>
    </label>
    <button on:click={handleCreateRoom}>create room</button>
    <button on:click={handleJoinRoom}>join</button>
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