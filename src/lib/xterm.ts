import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import {AttachAddon} from 'xterm-addon-attach';
import '../xterm.css';
import {debug} from "svelte/internal";
import {wait} from "./wait";

export class xterm {
    private protocol = 'ws';
    private port: number ;

    get term(): Terminal {
        return this._term;
    }

    get webSocket(): WebSocket {
        return this._socket;
    }

    private readonly _term: Terminal;
    private _socket: WebSocket;

    constructor(node, data) {
        console.log("node and data", node, data)
        this.port=3000;
        if (window.location.protocol.includes('https')) {
            this.protocol = 'wss';
        }
        this._term = new Terminal({
            cursorBlink: true,
            macOptionIsMeta: true,
            convertEol: true,
            theme: {
                background: "#1e1e1e",
                foreground: "#d4d4d4",
            },
            // theme:
        });
        const fitAddon = new FitAddon();
        this._term.loadAddon(fitAddon);
        this._term.open(node);
        // debugger
        this.connect(5);
        if(!this._socket){
            this._term.write("failed to connect to server");
            return
        }
        const attachAddon = new AttachAddon(this.webSocket);
        this._term.loadAddon(attachAddon);

        this._term.write(data.text);
        fitAddon.fit()
        window.addEventListener("resize", () => fitAddon.fit());

        // term.buffer.active.getLine(0).translateToString(true)


        // this._socket.onerror = (error)=> {
        //     // writeFile()
        //     // alert(`[error]`);
        //     console.log("code:",error.code)
        //     // this._term.write();
        // };

    }

    public async connect(retries) {
        for (let i = 0; i < retries; i++) {
            console.log("tries:\t", i)
            if (this._socket === undefined || (this._socket && this._socket.readyState === 3)) {
                try {
                    this._socket = new WebSocket(`${this.protocol}://${window.location.host}:${this.port}`);
                } catch (e) {
                    await wait(100)
                }

                this._socket.onmessage = function (event) {
                    // alert(`[message] Data received from server: ${event.data}`);
                    console.log("socket server:", JSON.parse(event.data));

                };
                this._socket.onclose = (event) => {
                    if (event.wasClean) {
                        // alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                        this._term.write(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                    } else {
                        // e.g. server process killed or network down
                        // event.code is usually 1006 in this case
                        // alert('[close] Connection died');
                        this._term.write(`[close] Connection died, code=${event.code} reason=${event.reason}`);
                        console.log('Socket is closed. Reconnect will be attempted in 1 second.', event.reason);
                        setTimeout(() => {
                            this.connect(5);
                        }, 1000);

                    }

                };
                this._socket.onerror = (err) => {
                    console.error('Socket encountered error: ', err.message, 'Closing socket');
                    this._socket.close();
                };
            }
            break;
        }
    }

    public send(data: string) {

        this._socket.send(data)
    }
}