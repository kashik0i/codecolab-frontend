// You will need a bundler like webpack or parcel to use these imports.
// The example in codesandboxes and github uses parcel.

import {Terminal as xterm} from "xterm";
import {FitAddon} from 'xterm-addon-fit';
import type {Socket} from "socket.io-client";
import {WebLinksAddon} from "xterm-addon-web-links";
import {WebglAddon} from "xterm-addon-webgl";
import {SearchAddon} from "xterm-addon-search";
import {AttachAddon} from "xterm-addon-attach";

export class Terminal {
    private terminalController: xterm;
    private socket: Socket;
    private readonly _fitAddon: FitAddon;
    private xtermResizeObs: ResizeObserver;
    private readonly _linksAddon: WebLinksAddon;
    private readonly _webglAddon: WebglAddon;
    private readonly _searchAddon: SearchAddon;
    public curr_line = "";

    constructor() {
        this.terminalController = new xterm({
            fontFamily: 'Fira Code, Iosevka, monospace',
            fontSize: 12,
            rows: 10,
            disableStdin: false,
            cursorBlink: true,
            cursorStyle: 'block',
            windowsMode: !!window.navigator.userAgent.match(/Windows/g),
            allowProposedApi: true,
            theme: {background: '#0c0a0d'},
            convertEol: true,

        })
        this.curr_line = "";
        // const wsAddon = new AttachAddon();
        this._fitAddon = new FitAddon();
        this._linksAddon = new WebLinksAddon();
        this._searchAddon = new SearchAddon();
        this._webglAddon = new WebglAddon();
        this.terminalController.loadAddon(this._fitAddon)
        // this.handle.loadAddon(wsAddon);
        this.terminalController.loadAddon(this._linksAddon);
        this.terminalController.loadAddon(this._searchAddon);
        this.terminalController.loadAddon(this._webglAddon);
        this._fitAddon.fit()
        this.terminalController.onKey(this.handleInput)
        /*(e => {
            // console.log(e.key);
            this.terminalController.write(e.key);
            if (e.key == '\r') {
                console.log("enter", this.terminalController.textarea.value)
                // this.send()
                this.terminalController.write('\n');
            }
        })*/
    }

    public handleInput = (ev) => {
        const key = ev.key
        const event = ev.domEvent
        console.log(ev, this.curr_line)
        const printable = !event.altKey && !event.altGraphKey && !event.ctrlKey && !event.metaKey;

        if (ev.keyCode === 13) {
            this.prompt();
            console.log(this.curr_line);
            this.send(this.curr_line);
            this.curr_line = '';
            this.clear()
        } else if (ev.keyCode === 8) {
            // console.log("lol",key)
            // // Do not delete the prompt
            // if (this.terminalController. > 2) {
            //     this.curr_line = this.curr_line.slice(0, -1);
            //     this.terminalController.write('\b \b');
            // }
        } else if (printable) {
            this.curr_line += key;
            console.log(this.curr_line, key)
            this.terminalController.write(key);
        }
    }

    resize() {
        if (!this._fitAddon) return;
        this._fitAddon.fit();
        this._webglAddon.clearTextureAtlas();

        this.terminalController.clearTextureAtlas();
        console.log(this.terminalController.rows, this.terminalController.cols)
    }

    dispose() {
        this.socket.close();
        this.terminalController.dispose();
        this._webglAddon.dispose();
    }

    addSocket(socket) {
        this.socket = socket;
    }

    /**
     * Attach event listeners for terminal UI and socket.io client
     */
    startListening() {
        this.terminalController.onData(data => this.send(data));
        this.socket.on("message", data => {
            // When there is data from PTY on server, print that on Terminal.
            this.write(data);
        });
    }

    /**
     * Print something to terminal UI.
     */
    write(text) {
        this.terminalController.write(text);
    }

    /**
     * Utility function to print new line on terminal.
     */
    prompt() {
        this.terminalController.write(`\r\n$ `);
    }

    /**
     * Send whatever you type in Terminal UI to PTY process in server.
     * @param {*} input Input to send to server
     */
    send(input: string) {
        this.socket.emit("input", new TextEncoder().encode('\x00' + input));
    }

    /**
     *
     * container is a HTMLElement where xterm can attach terminal ui instance.
     * div#terminal-container in this example.
     */
    attachTo(container) {
        this.terminalController.open(container);
        // Default text to display on terminal.
        this.terminalController.write("Terminal Connected");
        this.terminalController.write("");
        this.prompt();
    }

    clear() {
        this.terminalController.clear();
        this.terminalController.write('\x1b[2K\r')
    }

}

