import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import {AttachAddon} from 'xterm-addon-attach';
import '../xterm.css';
import {debug} from "svelte/internal";
import {wait} from "./wait";

export class xterm {
    private protocol = 'ws';
    private port: number;
    private node: HTMLElement;

    get term(): Terminal {
        return this._term;
    }

    get webSocket(): WebSocket {
        return this._socket;
    }

    private readonly _term: Terminal;
    private _socket: WebSocket;

    constructor(node) {
        this.node = node;
        console.log("node and data", node)
        this.port = 3000;
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
    }

    public async init(url): Promise<void> {
        await this.connect(3, url);
        if (!this._socket) {
            this._term.write("failed to connect to server");
            return
        }
        const fitAddon = new FitAddon();
        this._term.loadAddon(fitAddon);
        this._term.open(this.node);
        // debugger

        const attachAddon = new AttachAddon(this.webSocket);
        this._term.loadAddon(attachAddon);
        fitAddon.fit()
        window.addEventListener("resize", () => fitAddon.fit());

        // term.buffer.active.getLine(0).translateToString(true)
    }

    public write(data) {
        if (!this._term) {
            throw new Error("xterm not set up")
        }
        this._term.write(data);

    }

    public async connect(retries, url) {
        for (let i = 0; i < retries; i++) {
            console.log("tries:\t", i)
            if (this._socket === undefined || (this._socket && this._socket.readyState === 3)) {
                try {
                    this._socket = new WebSocket(`${this.protocol}://${window.location.host}:${this.port}`);
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
                                this.connect(5,url);
                            }, 1000);

                        }

                    };
                    this._socket.onerror = (err) => {
                        console.error('Socket encountered error: ', err.message, 'Closing socket');
                        this._socket.close();
                    };
                } catch (e) {
                    console.log(e);
                    await wait(100)
                }
            }
        }
    }

    public send(data: string) {
        this._socket.send(data)
    }
}