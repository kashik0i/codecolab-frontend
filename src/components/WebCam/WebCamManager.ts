import SimplePeer from "simple-peer";

export interface IWebCamSession {
    video: HTMLVideoElement,
    peer: SimplePeer.Instance,
    data: any,
    isSelf: boolean
}

export class WebCamManager implements IWebCamSession {
    video: HTMLVideoElement;
    peer: SimplePeer.Instance;
    data: SimplePeer.SignalData;
    isSelf: boolean;

    constructor() {
        console.log("new peer");
    }

    // public session: IWebCamSession

    createRoom() {
        console.log("create room")
        this.createPeer(true)
        this.initPeer()
        this.register();
    }

    joinRoom(data) {
        if (!this.peer) {
            this.createPeer(false)
            this.initPeer()
        }
        console.log("other", data)
        this.peer.signal(data)
    }

    initPeer() {
        this.peer.on('error', err => console.log('error', err))
        this.peer.on('connect', () => {
            console.log('CONNECT')
            this.peer.send('whatever' + Math.random())
        })
        this.peer.on('data', data => {
            console.log('data: ' + data)
        })
        //get own id
        this.peer.on('signal', (data) => {
            this.data = data
            console.log(data)
        })
    }

    // webCamSession.peer.on('stream', async function (otherWebCamSession:IWebCamSession) {
    //     elements.add(otherWebCamSession)
    //     console.log("added new",otherWebCamSession)
    //     if ('srcObject' in video) {
    //         otherVideo.srcObject = stream
    //     } else {
    //         otherVideo.src = window.URL.createObjectURL(stream) // for older browsers
    //     }
    //     await otherVideo.play()
    // })

    createPeer(initiator: boolean) {
        this.peer = new SimplePeer({
            initiator: initiator,
            trickle: false,
            config: {
                iceServers: [
                    {urls: 'stun:stun.l.google.com:19302'},
                    {urls: 'stun:stun1.l.google.com:19302'},
                    {urls: 'stun:stun2.l.google.com:19302'},
                    {urls: 'stun:stun3.l.google.com:19302'},
                    {urls: 'stun:stun4.l.google.com:19302'},
                    {
                        urls: 'turn:turn.bistri.com:80',
                        credential: 'homeo',
                        username: 'homeo',
                    },
                    {
                        urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
                        credential: 'webrtc',
                        username: 'webrtc',
                    }
                ]
            },
        })
    }

    private register() {

    }
}