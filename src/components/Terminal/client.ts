import { Terminal } from 'xterm/lib/xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon,type ISearchOptions } from 'xterm-addon-search';
import { SerializeAddon } from 'xterm-addon-serialize';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { WebglAddon } from 'xterm-addon-webgl';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { LigaturesAddon } from 'xterm-addon-ligatures';
import { CanvasAddon } from 'xterm-addon-canvas';

// Pulling in the module's types relies on the <reference> above, it's looks a
// little weird here as we're importing "this" module
import type { Terminal as TerminalType, ITerminalOptions } from 'xterm';

export interface IWindowWithTerminal extends Window {
    term: TerminalType;
    Terminal?: typeof TerminalType; // eslint-disable-line @typescript-eslint/naming-convention
    AttachAddon?: typeof AttachAddon; // eslint-disable-line @typescript-eslint/naming-convention
    FitAddon?: typeof FitAddon; // eslint-disable-line @typescript-eslint/naming-convention
    SearchAddon?: typeof SearchAddon; // eslint-disable-line @typescript-eslint/naming-convention
    SerializeAddon?: typeof SerializeAddon; // eslint-disable-line @typescript-eslint/naming-convention
    WebLinksAddon?: typeof WebLinksAddon; // eslint-disable-line @typescript-eslint/naming-convention
    WebglAddon?: typeof WebglAddon; // eslint-disable-line @typescript-eslint/naming-convention
    Unicode11Addon?: typeof Unicode11Addon; // eslint-disable-line @typescript-eslint/naming-convention
    LigaturesAddon?: typeof LigaturesAddon; // eslint-disable-line @typescript-eslint/naming-convention
}
declare let window: IWindowWithTerminal;

let term;
let protocol;
let socketURL;
let socket;
let pid;

type AddonType = 'attach' | 'canvas' | 'fit' | 'search' | 'serialize' | 'unicode11' | 'web-links' | 'webgl' | 'ligatures';

interface IDemoAddon<T extends AddonType> {
    name: T;
    canChange: boolean;
    ctor: (
        T extends 'attach' ? typeof AttachAddon :
            T extends 'canvas' ? typeof CanvasAddon :
                T extends 'fit' ? typeof FitAddon :
                    T extends 'search' ? typeof SearchAddon :
                        T extends 'serialize' ? typeof SerializeAddon :
                            T extends 'web-links' ? typeof WebLinksAddon :
                                T extends 'unicode11' ? typeof Unicode11Addon :
                                    T extends 'ligatures' ? typeof LigaturesAddon :
                                        typeof WebglAddon
        );
    instance?: (
        T extends 'attach' ? AttachAddon :
            T extends 'canvas' ? CanvasAddon :
                T extends 'fit' ? FitAddon :
                    T extends 'search' ? SearchAddon :
                        T extends 'serialize' ? SerializeAddon :
                            T extends 'web-links' ? WebLinksAddon :
                                T extends 'webgl' ? WebglAddon :
                                    T extends 'unicode11' ? typeof Unicode11Addon :
                                        T extends 'ligatures' ? typeof LigaturesAddon :
                                            never
        );
}

const addons: { [T in AddonType]: IDemoAddon<T> } = {
    attach: { name: 'attach', ctor: AttachAddon, canChange: false },
    canvas: { name: 'canvas', ctor: CanvasAddon, canChange: true },
    fit: { name: 'fit', ctor: FitAddon, canChange: false },
    search: { name: 'search', ctor: SearchAddon, canChange: true },
    serialize: { name: 'serialize', ctor: SerializeAddon, canChange: true },
    'web-links': { name: 'web-links', ctor: WebLinksAddon, canChange: true },
    webgl: { name: 'webgl', ctor: WebglAddon, canChange: true },
    unicode11: { name: 'unicode11', ctor: Unicode11Addon, canChange: true },
    ligatures: { name: 'ligatures', ctor: LigaturesAddon, canChange: true }
};

let terminalContainer = document.getElementById('terminal-container');
const actionElements = {
    find: document.querySelector('#find') as HTMLInputElement,
    findNext: document.querySelector('#find-next') as HTMLInputElement,
    findPrevious: document.querySelector('#find-previous') as HTMLInputElement,
    findResults: document.querySelector('#find-results')
};
const paddingElement = document.getElementById('padding') as HTMLInputElement;

const xtermjsTheme = {
    foreground: '#F8F8F8',
    background: '#2D2E2C',
    selectionBackground: '#5DA5D533',
    black: '#1E1E1D',
    brightBlack: '#262625',
    red: '#CE5C5C',
    brightRed: '#FF7272',
    green: '#5BCC5B',
    brightGreen: '#72FF72',
    yellow: '#CCCC5B',
    brightYellow: '#FFFF72',
    blue: '#5D5DD3',
    brightBlue: '#7279FF',
    magenta: '#BC5ED1',
    brightMagenta: '#E572FF',
    cyan: '#5DA5D5',
    brightCyan: '#72F0FF',
    white: '#F8F8F8',
    brightWhite: '#FFFFFF'
};
function setPadding(): void {
    term.element.style.padding = parseInt(paddingElement.value, 10).toString() + 'px';
    addons.fit.instance.fit();
}

function getSearchOptions(e: KeyboardEvent): ISearchOptions {
    return {
        regex: (document.getElementById('regex') as HTMLInputElement).checked,
        wholeWord: (document.getElementById('whole-word') as HTMLInputElement).checked,
        caseSensitive: (document.getElementById('case-sensitive') as HTMLInputElement).checked,
        incremental: e.key !== `Enter`,
        decorations: (document.getElementById('highlight-all-matches') as HTMLInputElement).checked ? {
            matchBackground: '#232422',
            matchBorder: '#555753',
            matchOverviewRuler: '#555753',
            activeMatchBackground: '#ef2929',
            activeMatchBorder: '#ffffff',
            activeMatchColorOverviewRuler: '#ef2929'
        } : undefined
    };
}

const disposeRecreateButtonHandler: () => void = () => {
    // If the terminal exists dispose of it, otherwise recreate it
    if (term) {
        term.dispose();
        term = null;
        window.term = null;
        socket = null;
        addons.attach.instance = undefined;
        addons.canvas.instance = undefined;
        addons.fit.instance = undefined;
        addons.search.instance = undefined;
        addons.serialize.instance = undefined;
        addons.unicode11.instance = undefined;
        addons.ligatures.instance = undefined;
        addons['web-links'].instance = undefined;
        addons.webgl.instance = undefined;
        document.getElementById('dispose').innerHTML = 'Recreate Terminal';
    } else {
        createTerminal();
        document.getElementById('dispose').innerHTML = 'Dispose terminal';
    }
};

const createNewWindowButtonHandler: () => void = () => {
    if (term) {
        disposeRecreateButtonHandler();
    }
    const win = window.open();
    terminalContainer = win.document.createElement('div');
    terminalContainer.id = 'terminal-container';
    win.document.body.appendChild(terminalContainer);

    // Stylesheets are needed to get the terminal in the popout window to render
    // correctly. We also need to wait for them to load before creating the
    // terminal, otherwise we will not compute the correct metrics when rendering.
    let pendingStylesheets = 0;
    for (const linkNode of document.querySelectorAll('head link[rel=stylesheet]')) {
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = (linkNode as HTMLLinkElement).href;
        win.document.head.appendChild(newLink);

        pendingStylesheets++;
        newLink.addEventListener('load', () => {
            pendingStylesheets--;
            if (pendingStylesheets === 0) {
                createTerminal();
            }
        });
    }
};

if (document.location.pathname === '/test') {
    window.Terminal = Terminal;
    window.AttachAddon = AttachAddon;
    window.FitAddon = FitAddon;
    window.SearchAddon = SearchAddon;
    window.SerializeAddon = SerializeAddon;
    window.Unicode11Addon = Unicode11Addon;
    window.LigaturesAddon = LigaturesAddon;
    window.WebLinksAddon = WebLinksAddon;
    window.WebglAddon = WebglAddon;
} else {
    createTerminal();
    document.getElementById('dispose').addEventListener('click', disposeRecreateButtonHandler);
    document.getElementById('create-new-window').addEventListener('click', createNewWindowButtonHandler);
    document.getElementById('serialize').addEventListener('click', serializeButtonHandler);
    document.getElementById('htmlserialize').addEventListener('click', htmlSerializeButtonHandler);
    document.getElementById('custom-glyph').addEventListener('click', writeCustomGlyphHandler);
    document.getElementById('load-test').addEventListener('click', loadTest);
    document.getElementById('print-cjk').addEventListener('click', addCjk);
    document.getElementById('print-cjk-sgr').addEventListener('click', addCjkRandomSgr);
    document.getElementById('powerline-symbol-test').addEventListener('click', powerlineSymbolTest);
    document.getElementById('underline-test').addEventListener('click', underlineTest);
    document.getElementById('ansi-colors').addEventListener('click', ansiColorsTest);
    document.getElementById('osc-hyperlinks').addEventListener('click', addAnsiHyperlink);
    document.getElementById('sgr-test').addEventListener('click', sgrTest);
    document.getElementById('add-decoration').addEventListener('click', addDecoration);
    document.getElementById('add-overview-ruler').addEventListener('click', addOverviewRuler);
    document.getElementById('weblinks-test').addEventListener('click', testWeblinks);
    addVtButtons();
}

function createTerminal(): void {
    // Clean terminal
    while (terminalContainer.children.length) {
        terminalContainer.removeChild(terminalContainer.children[0]);
    }

    const isWindows = ['Windows', 'Win16', 'Win32', 'WinCE'].indexOf(navigator.platform) >= 0;
    term = new Terminal({
        allowProposedApi: true,
        windowsMode: isWindows,
        fontFamily: '"Fira Code", courier-new, courier, monospace, "Powerline Extra Symbols"',
        theme: xtermjsTheme
    } as ITerminalOptions);

    // Load addons
    const typedTerm = term as TerminalType;
    addons.search.instance = new SearchAddon();
    addons.serialize.instance = new SerializeAddon();
    addons.fit.instance = new FitAddon();
    addons.unicode11.instance = new Unicode11Addon();
    try {  // try to start with webgl renderer (might throw on older safari/webkit)
        addons.webgl.instance = new WebglAddon();
    } catch (e) {
        console.warn(e);
    }
    addons['web-links'].instance = new WebLinksAddon();
    typedTerm.loadAddon(addons.fit.instance);
    typedTerm.loadAddon(addons.search.instance);
    typedTerm.loadAddon(addons.serialize.instance);
    typedTerm.loadAddon(addons.unicode11.instance);
    typedTerm.loadAddon(addons['web-links'].instance);

    window.term = term;  // Expose `term` to window for debugging purposes
    term.onResize((size: { cols: number, rows: number }) => {
        if (!pid) {
            return;
        }
        const cols = size.cols;
        const rows = size.rows;
        const url = '/terminals/' + pid + '/size?cols=' + cols + '&rows=' + rows;

        fetch(url, { method: 'POST' });
    });
    protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
    socketURL = protocol + location.hostname + ((location.port) ? (':' + location.port) : '') + '/terminals/';

    addons.fit.instance!.fit();

    if (addons.webgl.instance) {
        try {
            typedTerm.loadAddon(addons.webgl.instance);
            term.open(terminalContainer);
            setTextureAtlas(addons.webgl.instance.textureAtlas);
            addons.webgl.instance.onChangeTextureAtlas(e => setTextureAtlas(e));
            addons.webgl.instance.onAddTextureAtlasCanvas(e => appendTextureAtlas(e));
            addons.webgl.instance.onRemoveTextureAtlasCanvas(e => removeTextureAtlas(e));
        } catch (e) {
            console.warn('error during loading webgl addon:', e);
            addons.webgl.instance.dispose();
            addons.webgl.instance = undefined;
        }
    }
    if (!typedTerm.element) {
        // webgl loading failed for some reason, attach with DOM renderer
        term.open(terminalContainer);
    }

    term.focus();

    addDomListener(paddingElement, 'change', setPadding);

    addDomListener(actionElements.findNext, 'keyup', (e) => {
        addons.search.instance.findNext(actionElements.findNext.value, getSearchOptions(e));
    });
    addDomListener(actionElements.findPrevious, 'keyup', (e) => {
        addons.search.instance.findPrevious(actionElements.findPrevious.value, getSearchOptions(e));
    });
    addDomListener(actionElements.findNext, 'blur', (e) => {
        addons.search.instance.clearActiveDecoration();
    });
    addDomListener(actionElements.findPrevious, 'blur', (e) => {
        addons.search.instance.clearActiveDecoration();
    });

    // fit is called within a setTimeout, cols and rows need this.
    setTimeout(async () => {
        initOptions(term);
        // TODO: Clean this up, opt-cols/rows doesn't exist anymore
        (document.getElementById(`opt-cols`) as HTMLInputElement).value = term.cols;
        (document.getElementById(`opt-rows`) as HTMLInputElement).value = term.rows;
        paddingElement.value = '0';

        // Set terminal size again to set the specific dimensions on the demo
        updateTerminalSize();

        const res = await fetch('/terminals?cols=' + term.cols + '&rows=' + term.rows, { method: 'POST' });
        const processId = await res.text();
        pid = processId;
        socketURL += processId;
        socket = new WebSocket(socketURL);
        socket.onopen = runRealTerminal;
        socket.onclose = runFakeTerminal;
        socket.onerror = runFakeTerminal;
    }, 0);
}

function runRealTerminal(): void {
    addons.attach.instance = new AttachAddon(socket);
    term.loadAddon(addons.attach.instance);
    term._initialized = true;
    initAddons(term);
}

function runFakeTerminal(): void {
    if (term._initialized) {
        return;
    }

    term._initialized = true;
    initAddons(term);

    term.prompt = () => {
        term.write('\r\n$ ');
    };

    term.writeln('Welcome to xterm.js');
    term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
    term.writeln('Type some keys and commands to play around.');
    term.writeln('');
    term.prompt();

    term.onKey((e: { key: string, domEvent: KeyboardEvent }) => {
        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

        if (ev.keyCode === 13) {
            term.prompt();
        } else if (ev.keyCode === 8) {
            // Do not delete the prompt
            if (term._core.buffer.x > 2) {
                term.write('\b \b');
            }
        } else if (printable) {
            term.write(e.key);
        }
    });
}

function initOptions(term: TerminalType): void {
    const blacklistedOptions = [
        // Internal only options
        'cancelEvents',
        'convertEol',
        'termName',
        // Complex option
        'theme',
        'windowOptions'
    ];
    const stringOptions = {
        cursorStyle: ['block', 'underline', 'bar'],
        fastScrollModifier: ['none', 'alt', 'ctrl', 'shift'],
        fontFamily: null,
        fontWeight: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
        fontWeightBold: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
        logLevel: ['debug', 'info', 'warn', 'error', 'off'],
        theme: ['default', 'xtermjs', 'sapphire', 'light'],
        wordSeparator: null
    };
    const options = Object.getOwnPropertyNames(term.options);
    const booleanOptions = [];
    const numberOptions = [
        'overviewRulerWidth'
    ];
    options.filter(o => blacklistedOptions.indexOf(o) === -1).forEach(o => {
        switch (typeof term.options[o]) {
            case 'boolean':
                booleanOptions.push(o);
                break;
            case 'number':
                numberOptions.push(o);
                break;
            default:
                if (Object.keys(stringOptions).indexOf(o) === -1 && numberOptions.indexOf(o) === -1 && booleanOptions.indexOf(o) === -1) {
                    console.warn(`Unrecognized option: "${o}"`);
                }
        }
    });

    let html = '';
    html += '<div class="option-group">';
    booleanOptions.forEach(o => {
        html += `<div class="option"><label><input id="opt-${o}" type="checkbox" ${term.options[o] ? 'checked' : ''}/> ${o}</label></div>`;
    });
    html += '</div><div class="option-group">';
    numberOptions.forEach(o => {
        html += `<div class="option"><label>${o} <input id="opt-${o}" type="number" value="${term.options[o] ?? ''}" step="${o === 'lineHeight' || o === 'scrollSensitivity' ? '0.1' : '1'}"/></label></div>`;
    });
    html += '</div><div class="option-group">';
    Object.keys(stringOptions).forEach(o => {
        if (stringOptions[o]) {
            const selectedOption = o === 'theme' ? 'xtermjs' : term.options[o];
            html += `<div class="option"><label>${o} <select id="opt-${o}">${stringOptions[o].map(v => `<option ${v === selectedOption ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div>`;
        } else {
            html += `<div class="option"><label>${o} <input id="opt-${o}" type="text" value="${term.options[o]}"/></label></div>`;
        }
    });
    html += '</div>';

    const container = document.getElementById('options-container');
    container.innerHTML = html;

    // Attach listeners
    booleanOptions.forEach(o => {
        const input = document.getElementById(`opt-${o}`) as HTMLInputElement;
        addDomListener(input, 'change', () => {
            console.log('change', o, input.checked);
            term.options[o] = input.checked;
        });
    });
    numberOptions.forEach(o => {
        const input = document.getElementById(`opt-${o}`) as HTMLInputElement;
        addDomListener(input, 'change', () => {
            console.log('change', o, input.value);
            if (o === 'rows') {
                term.resize(term.cols, parseInt(input.value));
            } else if (o === 'cols') {
                term.resize(parseInt(input.value), term.rows);
            } else if (o === 'lineHeight') {
                term.options.lineHeight = parseFloat(input.value);
            } else if (o === 'scrollSensitivity') {
                term.options.scrollSensitivity = parseFloat(input.value);
            } else if (o === 'scrollback') {
                term.options.scrollback = parseInt(input.value);
                setTimeout(() => updateTerminalSize(), 5);
            } else {
                term.options[o] = parseInt(input.value);
            }
            // Always update terminal size in case the option changes the dimensions
            updateTerminalSize();
        });
    });
    Object.keys(stringOptions).forEach(o => {
        const input = document.getElementById(`opt-${o}`) as HTMLInputElement;
        addDomListener(input, 'change', () => {
            console.log('change', o, input.value);
            let value: any = input.value;
            if (o === 'theme') {
                switch (input.value) {
                    case 'default':
                        value = undefined;
                        break;
                    case 'xtermjs':
                        // Custom theme to match style of xterm.js logo
                        value = xtermjsTheme;
                    case 'sapphire':
                        // Color source: https://github.com/Tyriar/vscode-theme-sapphire
                        value = {
                            background: '#1c2431',
                            foreground: '#cccccc',
                            selectionBackground: '#399ef440',
                            black: '#666666',
                            blue: '#399ef4',
                            brightBlack: '#666666',
                            brightBlue: '#399ef4',
                            brightCyan: '#21c5c7',
                            brightGreen: '#4eb071',
                            brightMagenta: '#b168df',
                            brightRed: '#da6771',
                            brightWhite: '#efefef',
                            brightYellow: '#fff099',
                            cyan: '#21c5c7',
                            green: '#4eb071',
                            magenta: '#b168df',
                            red: '#da6771',
                            white: '#efefef',
                            yellow: '#fff099'
                        };
                        break;
                    case 'light':
                        // Color source: https://github.com/microsoft/vscode/blob/main/extensions/theme-defaults/themes/light_plus.json
                        value = {
                            background: '#ffffff',
                            foreground: '#333333',
                            selectionBackground: '#add6ff',
                            black: '#000000',
                            blue: '#0451a5',
                            brightBlack: '#666666',
                            brightBlue: '#0451a5',
                            brightCyan: '#0598bc',
                            brightGreen: '#14ce14',
                            brightMagenta: '#bc05bc',
                            brightRed: '#cd3131',
                            brightWhite: '#a5a5a5',
                            brightYellow: '#b5ba00',
                            cyan: '#0598bc',
                            green: '#00bc00',
                            magenta: '#bc05bc',
                            red: '#cd3131',
                            white: '#555555',
                            yellow: '#949800'
                        };
                        break;
                }
            }
            term.options[o] = value;
        });
    });
}

function initAddons(term: TerminalType): void {
    const fragment = document.createDocumentFragment();
    Object.keys(addons).forEach((name: AddonType) => {
        const addon = addons[name];
        const checkbox = document.createElement('input') as HTMLInputElement;
        checkbox.type = 'checkbox';
        checkbox.checked = !!addon.instance;
        if (!addon.canChange) {
            checkbox.disabled = true;
        }
        if (name === 'unicode11' && checkbox.checked) {
            term.unicode.activeVersion = '11';
        }
        if (name === 'search' && checkbox.checked) {
            addon.instance.onDidChangeResults(e => updateFindResults(e));
        }
        addDomListener(checkbox, 'change', () => {
            if (checkbox.checked) {
                addon.instance = new addon.ctor();
                try {
                    term.loadAddon(addon.instance);
                    if (name === 'webgl') {
                        setTimeout(() => {
                            setTextureAtlas(addons.webgl.instance.textureAtlas);
                            addons.webgl.instance.onChangeTextureAtlas(e => setTextureAtlas(e));
                            addons.webgl.instance.onAddTextureAtlasCanvas(e => appendTextureAtlas(e));
                        }, 0);
                    } else if (name === 'canvas') {
                        setTimeout(() => {
                            setTextureAtlas(addons.canvas.instance.textureAtlas);
                            addons.canvas.instance.onChangeTextureAtlas(e => setTextureAtlas(e));
                            addons.canvas.instance.onAddTextureAtlasCanvas(e => appendTextureAtlas(e));
                        }, 0);
                    } else if (name === 'unicode11') {
                        term.unicode.activeVersion = '11';
                    } else if (name === 'search') {
                        addon.instance.onDidChangeResults(e => updateFindResults(e));
                    }
                }
                catch {
                    addon.instance = undefined;
                    checkbox.checked = false;
                    checkbox.disabled = true;
                }
            } else {
                if (name === 'webgl') {
                    addons.webgl.instance.textureAtlas.remove();
                } else if (name === 'canvas') {
                    addons.canvas.instance.textureAtlas.remove();
                } else if (name === 'unicode11') {
                    term.unicode.activeVersion = '6';
                }
                addon.instance!.dispose();
                addon.instance = undefined;
            }
        });
        const label = document.createElement('label');
        label.classList.add('addon');
        if (!addon.canChange) {
            label.title = 'This addon is needed for the demo to operate';
        }
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(name));
        const wrapper = document.createElement('div');
        wrapper.classList.add('addon');
        wrapper.appendChild(label);
        fragment.appendChild(wrapper);
    });
    const container = document.getElementById('addons-container');
    container.innerHTML = '';
    container.appendChild(fragment);
}

function updateFindResults(e: { resultIndex: number, resultCount: number } | undefined): void {
    let content: string;
    if (e === undefined) {
        content = 'undefined';
    } else {
        content = `index: ${e.resultIndex}, count: ${e.resultCount}`;
    }
    actionElements.findResults.textContent = content;
}

function addDomListener(element: HTMLElement, type: string, handler: (...args: any[]) => any): void {
    element.addEventListener(type, handler);
    term._core.register({ dispose: () => element.removeEventListener(type, handler) });
}

function updateTerminalSize(): void {
    const width = (term._core._renderService.dimensions.css.canvas.width + term._core.viewport.scrollBarWidth).toString() + 'px';
    const height = (term._core._renderService.dimensions.css.canvas.height).toString() + 'px';
    terminalContainer.style.width = width;
    terminalContainer.style.height = height;
    addons.fit.instance.fit();
}

function serializeButtonHandler(): void {
    const output = addons.serialize.instance.serialize();
    const outputString = JSON.stringify(output);

    document.getElementById('serialize-output').innerText = outputString;
    if ((document.getElementById('write-to-terminal') as HTMLInputElement).checked) {
        term.reset();
        term.write(output);
    }
}

function htmlSerializeButtonHandler(): void {
    const output = addons.serialize.instance.serializeAsHTML();
    document.getElementById('htmlserialize-output').innerText = output;

    // Deprecated, but the most supported for now.
    function listener(e: any): void {
        e.clipboardData.setData('text/html', output);
        e.preventDefault();
    }
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
    document.getElementById('htmlserialize-output-result').innerText = 'Copied to clipboard';
}

function setTextureAtlas(e: HTMLCanvasElement): void {
    styleAtlasPage(e);
    document.querySelector('#texture-atlas').replaceChildren(e);
}
function appendTextureAtlas(e: HTMLCanvasElement): void {
    styleAtlasPage(e);
    document.querySelector('#texture-atlas').appendChild(e);
}
function removeTextureAtlas(e: HTMLCanvasElement): void {
    e.remove();
}
function styleAtlasPage(e: HTMLCanvasElement): void {
    e.style.width = `${e.width / window.devicePixelRatio}px`;
    e.style.height = `${e.height / window.devicePixelRatio}px`;
}

function writeCustomGlyphHandler(): void {
    term.write('\n\r');
    term.write('\n\r');
    term.write('Box styles:       ┎┰┒┍┯┑╓╥╖╒╤╕ ┏┳┓┌┲┓┌┬┐┏┱┐\n\r');
    term.write('┌─┬─┐ ┏━┳━┓ ╔═╦═╗ ┠╂┨┝┿┥╟╫╢╞╪╡ ┡╇┩├╊┫┢╈┪┣╉┤\n\r');
    term.write('│ │ │ ┃ ┃ ┃ ║ ║ ║ ┖┸┚┕┷┙╙╨╜╘╧╛ └┴┘└┺┛┗┻┛┗┹┘\n\r');
    term.write('├─┼─┤ ┣━╋━┫ ╠═╬═╣ ┏┱┐┌┲┓┌┬┐┌┬┐ ┏┳┓┌┮┓┌┬┐┏┭┐\n\r');
    term.write('│ │ │ ┃ ┃ ┃ ║ ║ ║ ┡╃┤├╄┩├╆┪┢╅┤ ┞╀┦├┾┫┟╁┧┣┽┤\n\r');
    term.write('└─┴─┘ ┗━┻━┛ ╚═╩═╝ └┴┘└┴┘└┺┛┗┹┘ └┴┘└┶┛┗┻┛┗┵┘\n\r');
    term.write('\n\r');
    term.write('Other:\n\r');
    term.write('╭─╮ ╲ ╱ ╷╻╎╏┆┇┊┋ ╺╾╴ ╌╌╌ ┄┄┄ ┈┈┈\n\r');
    term.write('│ │  ╳  ╽╿╎╏┆┇┊┋ ╶╼╸ ╍╍╍ ┅┅┅ ┉┉┉\n\r');
    term.write('╰─╯ ╱ ╲ ╹╵╎╏┆┇┊┋\n\r');
    term.write('\n\r');
    term.write('All box drawing characters:\n\r');
    term.write('─ ━ │ ┃ ┄ ┅ ┆ ┇ ┈ ┉ ┊ ┋ ┌ ┍ ┎ ┏\n\r');
    term.write('┐ ┑ ┒ ┓ └ ┕ ┖ ┗ ┘ ┙ ┚ ┛ ├ ┝ ┞ ┟\n\r');
    term.write('┠ ┡ ┢ ┣ ┤ ┥ ┦ ┧ ┨ ┩ ┪ ┫ ┬ ┭ ┮ ┯\n\r');
    term.write('┰ ┱ ┲ ┳ ┴ ┵ ┶ ┷ ┸ ┹ ┺ ┻ ┼ ┽ ┾ ┿\n\r');
    term.write('╀ ╁ ╂ ╃ ╄ ╅ ╆ ╇ ╈ ╉ ╊ ╋ ╌ ╍ ╎ ╏\n\r');
    term.write('═ ║ ╒ ╓ ╔ ╕ ╖ ╗ ╘ ╙ ╚ ╛ ╜ ╝ ╞ ╟\n\r');
    term.write('╠ ╡ ╢ ╣ ╤ ╥ ╦ ╧ ╨ ╩ ╪ ╫ ╬ ╭ ╮ ╯\n\r');
    term.write('╰ ╱ ╲ ╳ ╴ ╵ ╶ ╷ ╸ ╹ ╺ ╻ ╼ ╽ ╾ ╿\n\r');
    term.write('Box drawing alignment tests:\x1b[31m                                          █\n\r');
    term.write('                                                                      ▉\n\r');
    term.write('  ╔══╦══╗  ┌──┬──┐  ╭──┬──╮  ╭──┬──╮  ┏━━┳━━┓  ┎┒┏┑   ╷  ╻ ┏┯┓ ┌┰┐    ▊ ╱╲╱╲╳╳╳\n\r');
    term.write('  ║┌─╨─┐║  │╔═╧═╗│  │╒═╪═╕│  │╓─╁─╖│  ┃┌─╂─┐┃  ┗╃╄┙  ╶┼╴╺╋╸┠┼┨ ┝╋┥    ▋ ╲╱╲╱╳╳╳\n\r');
    term.write('  ║│╲ ╱│║  │║   ║│  ││ │ ││  │║ ┃ ║│  ┃│ ╿ │┃  ┍╅╆┓   ╵  ╹ ┗┷┛ └┸┘    ▌ ╱╲╱╲╳╳╳\n\r');
    term.write('  ╠╡ ╳ ╞╣  ├╢   ╟┤  ├┼─┼─┼┤  ├╫─╂─╫┤  ┣┿╾┼╼┿┫  ┕┛┖┚     ┌┄┄┐ ╎ ┏┅┅┓ ┋ ▍ ╲╱╲╱╳╳╳\n\r');
    term.write('  ║│╱ ╲│║  │║   ║│  ││ │ ││  │║ ┃ ║│  ┃│ ╽ │┃  ░░▒▒▓▓██ ┊  ┆ ╎ ╏  ┇ ┋ ▎\n\r');
    term.write('  ║└─╥─┘║  │╚═╤═╝│  │╘═╪═╛│  │╙─╀─╜│  ┃└─╂─┘┃  ░░▒▒▓▓██ ┊  ┆ ╎ ╏  ┇ ┋ ▏\n\r');
    term.write('  ╚══╩══╝  └──┴──┘  ╰──┴──╯  ╰──┴──╯  ┗━━┻━━┛           └╌╌┘ ╎ ┗╍╍┛ ┋  ▁▂▃▄▅▆▇█\n\r');
    term.write('Box drawing alignment tests:\x1b[32m                                          █\n\r');
    term.write('                                                                      ▉\n\r');
    term.write('  ╔══╦══╗  ┌──┬──┐  ╭──┬──╮  ╭──┬──╮  ┏━━┳━━┓  ┎┒┏┑   ╷  ╻ ┏┯┓ ┌┰┐    ▊ ╱╲╱╲╳╳╳\n\r');
    term.write('  ║┌─╨─┐║  │╔═╧═╗│  │╒═╪═╕│  │╓─╁─╖│  ┃┌─╂─┐┃  ┗╃╄┙  ╶┼╴╺╋╸┠┼┨ ┝╋┥    ▋ ╲╱╲╱╳╳╳\n\r');
    term.write('  ║│╲ ╱│║  │║   ║│  ││ │ ││  │║ ┃ ║│  ┃│ ╿ │┃  ┍╅╆┓   ╵  ╹ ┗┷┛ └┸┘    ▌ ╱╲╱╲╳╳╳\n\r');
    term.write('  ╠╡ ╳ ╞╣  ├╢   ╟┤  ├┼─┼─┼┤  ├╫─╂─╫┤  ┣┿╾┼╼┿┫  ┕┛┖┚     ┌┄┄┐ ╎ ┏┅┅┓ ┋ ▍ ╲╱╲╱╳╳╳\n\r');
    term.write('  ║│╱ ╲│║  │║   ║│  ││ │ ││  │║ ┃ ║│  ┃│ ╽ │┃  ░░▒▒▓▓██ ┊  ┆ ╎ ╏  ┇ ┋ ▎\n\r');
    term.write('  ║└─╥─┘║  │╚═╤═╝│  │╘═╪═╛│  │╙─╀─╜│  ┃└─╂─┘┃  ░░▒▒▓▓██ ┊  ┆ ╎ ╏  ┇ ┋ ▏\n\r');
    term.write('  ╚══╩══╝  └──┴──┘  ╰──┴──╯  ╰──┴──╯  ┗━━┻━━┛           └╌╌┘ ╎ ┗╍╍┛ ┋  ▁▂▃▄▅▆▇█\n\r');
    term.write('\x1b[0m');
    window.scrollTo(0, 0);
}

function loadTest(): void {
    const rendererName = addons.webgl.instance ? 'webgl' : !!addons.canvas.instance ? 'canvas' : 'dom';
    const testData = [];
    let byteCount = 0;
    for (let i = 0; i < 50; i++) {
        const count = 1 + Math.floor(Math.random() * 79);
        byteCount += count + 2;
        const data = new Uint8Array(count + 2);
        data[0] = 0x0A; // \n
        for (let i = 1; i < count + 1; i++) {
            data[i] = 0x61 + Math.floor(Math.random() * (0x7A - 0x61));
        }
        // End each line with \r so the cursor remains constant, this is what ls/tree do and improves
        // performance significantly due to the cursor DOM element not needing to change
        data[data.length - 1] = 0x0D; // \r
        testData.push(data);
    }
    const start = performance.now();
    for (let i = 0; i < 1024; i++) {
        for (const d of testData) {
            term.write(d);
        }
    }
    // Wait for all data to be parsed before evaluating time
    term.write('', () => {
        const time = Math.round(performance.now() - start);
        const mbs = ((byteCount / 1024) * (1 / (time / 1000))).toFixed(2);
        term.write(`\n\r\nWrote ${byteCount}kB in ${time}ms (${mbs}MB/s) using the (${rendererName} renderer)`);
        // Send ^C to get a new prompt
        term._core._onData.fire('\x03');
    });
}

function powerlineSymbolTest(): void {
    function s(char: string): string {
        return `${char} \x1b[7m${char}\x1b[0m  `;
    }
    term.write('\n\n\r');
    term.writeln('Standard powerline symbols:');
    term.writeln('      0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F');
    term.writeln(`0xA_  ${s('\ue0a0')}${s('\ue0a1')}${s('\ue0a2')}`);
    term.writeln(`0xB_  ${s('\ue0b0')}${s('\ue0b1')}${s('\ue0b2')}${s('\ue0b3')}`);
    term.writeln('');
    term.writeln(
        `\x1b[7m` +
        ` inverse \ue0b1 \x1b[0;40m\ue0b0` +
        ` 0 \ue0b1 \x1b[30;41m\ue0b0\x1b[39m` +
        ` 1 \ue0b1 \x1b[31;42m\ue0b0\x1b[39m` +
        ` 2 \ue0b1 \x1b[32;43m\ue0b0\x1b[39m` +
        ` 3 \ue0b1 \x1b[33;44m\ue0b0\x1b[39m` +
        ` 4 \ue0b1 \x1b[34;45m\ue0b0\x1b[39m` +
        ` 5 \ue0b1 \x1b[35;46m\ue0b0\x1b[39m` +
        ` 6 \ue0b1 \x1b[36;47m\ue0b0\x1b[30m` +
        ` 7 \ue0b1 \x1b[37;49m\ue0b0\x1b[0m`
    );
    term.writeln('');
    term.writeln(
        `\x1b[7m` +
        ` inverse \ue0b3 \x1b[0;7;40m\ue0b2\x1b[27m` +
        ` 0 \ue0b3 \x1b[7;30;41m\ue0b2\x1b[27;39m` +
        ` 1 \ue0b3 \x1b[7;31;42m\ue0b2\x1b[27;39m` +
        ` 2 \ue0b3 \x1b[7;32;43m\ue0b2\x1b[27;39m` +
        ` 3 \ue0b3 \x1b[7;33;44m\ue0b2\x1b[27;39m` +
        ` 4 \ue0b3 \x1b[7;34;45m\ue0b2\x1b[27;39m` +
        ` 5 \ue0b3 \x1b[7;35;46m\ue0b2\x1b[27;39m` +
        ` 6 \ue0b3 \x1b[7;36;47m\ue0b2\x1b[27;30m` +
        ` 7 \ue0b3 \x1b[7;37;49m\ue0b2\x1b[0m`
    );
    term.writeln('');
    term.writeln(
        `\x1b[7m` +
        ` inverse \ue0b5 \x1b[0;40m\ue0b4` +
        ` 0 \ue0b5 \x1b[30;41m\ue0b4\x1b[39m` +
        ` 1 \ue0b5 \x1b[31;42m\ue0b4\x1b[39m` +
        ` 2 \ue0b5 \x1b[32;43m\ue0b4\x1b[39m` +
        ` 3 \ue0b5 \x1b[33;44m\ue0b4\x1b[39m` +
        ` 4 \ue0b5 \x1b[34;45m\ue0b4\x1b[39m` +
        ` 5 \ue0b5 \x1b[35;46m\ue0b4\x1b[39m` +
        ` 6 \ue0b5 \x1b[36;47m\ue0b4\x1b[30m` +
        ` 7 \ue0b5 \x1b[37;49m\ue0b4\x1b[0m`
    );
    term.writeln('');
    term.writeln(
        `\x1b[7m` +
        ` inverse \ue0b7 \x1b[0;7;40m\ue0b6\x1b[27m` +
        ` 0 \ue0b7 \x1b[7;30;41m\ue0b6\x1b[27;39m` +
        ` 1 \ue0b7 \x1b[7;31;42m\ue0b6\x1b[27;39m` +
        ` 2 \ue0b7 \x1b[7;32;43m\ue0b6\x1b[27;39m` +
        ` 3 \ue0b7 \x1b[7;33;44m\ue0b6\x1b[27;39m` +
        ` 4 \ue0b7 \x1b[7;34;45m\ue0b6\x1b[27;39m` +
        ` 5 \ue0b7 \x1b[7;35;46m\ue0b6\x1b[27;39m` +
        ` 6 \ue0b7 \x1b[7;36;47m\ue0b6\x1b[27;30m` +
        ` 7 \ue0b7 \x1b[7;37;49m\ue0b6\x1b[0m`
    );
    term.writeln('');
    term.writeln('Powerline extra symbols:');
    term.writeln('      0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F');
    term.writeln(`0xA_                 ${s('\ue0a3')}`);
    term.writeln(`0xB_                      ${s('\ue0b4')}${s('\ue0b5')}${s('\ue0b6')}${s('\ue0b7')}${s('\ue0b8')}${s('\ue0b9')}${s('\ue0ba')}${s('\ue0bb')}${s('\ue0bc')}${s('\ue0bd')}${s('\ue0be')}${s('\ue0bf')}`);
    term.writeln(`0xC_  ${s('\ue0c0')}${s('\ue0c1')}${s('\ue0c2')}${s('\ue0c3')}${s('\ue0c4')}${s('\ue0c5')}${s('\ue0c6')}${s('\ue0c7')}${s('\ue0c8')}${s('\ue0c9')}${s('\ue0ca')}${s('\ue0cb')}${s('\ue0cc')}${s('\ue0cd')}${s('\ue0be')}${s('\ue0bf')}`);
    term.writeln(`0xD_  ${s('\ue0d0')}${s('\ue0d1')}${s('\ue0d2')}     ${s('\ue0d4')}`);
    term.writeln('');
    term.writeln('Sample of nerd fonts icons:');
    term.writeln('    nf-linux-apple (\\uF302) \uf302');
    term.writeln('nf-mdi-github_face (\\uFbd9) \ufbd9');
}

function underlineTest(): void {
    function u(style: number): string {
        return `\x1b[4:${style}m`;
    }
    function c(color: string): string {
        return `\x1b[58:${color}m`;
    }
    term.write('\n\n\r');
    term.writeln('Underline styles:');
    term.writeln('');
    function showSequence(id: number, name: string): string {
        let alphabet = '';
        for (let i = 97; i < 123; i++) {
            alphabet += String.fromCharCode(i);
        }
        let numbers = '';
        for (let i = 0; i < 10; i++) {
            numbers += i.toString();
        }
        return `${u(id)}4:${id}m - ${name}\x1b[4:0m`.padEnd(33, ' ') + `${u(id)}${alphabet} ${numbers} 汉语 한국어 👽\x1b[4:0m`;
    }
    term.writeln(showSequence(0, 'No underline'));
    term.writeln(showSequence(1, 'Straight'));
    term.writeln(showSequence(2, 'Double'));
    term.writeln(showSequence(3, 'Curly'));
    term.writeln(showSequence(4, 'Dotted'));
    term.writeln(showSequence(5, 'Dashed'));
    term.writeln('');
    term.writeln(`Underline colors (256 color mode):`);
    term.writeln('');
    for (let i = 0; i < 256; i++) {
        term.write((i !== 0 ? '\x1b[0m, ' : '') + u(1 + i % 5) + c('5:' + i) + i);
    }
    term.writeln(`\x1b[0m\n\n\rUnderline colors (true color mode):`);
    term.writeln('');
    for (let i = 0; i < 80; i++) {
        const v = Math.round(i / 79 * 255);
        term.write(u(1) + c(`2:0:${v}:${v}:${v}`) + (i < 4 ? 'grey'[i] : ' '));
    }
    term.write('\n\r');
    for (let i = 0; i < 80; i++) {
        const v = Math.round(i / 79 * 255);
        term.write(u(1) + c(`2:0:${v}:${0}:${0}`) + (i < 3 ? 'red'[i] : ' '));
    }
    term.write('\n\r');
    for (let i = 0; i < 80; i++) {
        const v = Math.round(i / 79 * 255);
        term.write(u(1) + c(`2:0:${0}:${v}:${0}`) + (i < 5 ? 'green'[i] : ' '));
    }
    term.write('\n\r');
    for (let i = 0; i < 80; i++) {
        const v = Math.round(i / 79 * 255);
        term.write(u(1) + c(`2:0:${0}:${0}:${v}`) + (i < 4 ? 'blue'[i] : ' '));
    }
    term.write('\x1b[0m\n\r');
}

function ansiColorsTest(): void {
    term.writeln(`\x1b[0m\n\n\rStandard colors:                        Bright colors:`);
    for (let i = 0; i < 16; i++) {
        term.write(`\x1b[48;5;${i}m ${i.toString().padEnd(2, ' ').padStart(3, ' ')} \x1b[0m`);
    }

    term.writeln(`\x1b[0m\n\n\rColors 17-231 from 256 palette:`);
    for (let i = 0; i < 6; i++) {
        const startId = 16 + i * 36;
        const endId = 16 + (i + 1) * 36 - 1;
        term.write(`${startId.toString().padStart(3, ' ')}-${endId.toString().padStart(3, ' ')} `);
        for (let j = 0; j < 36; j++) {
            const id = 16 + i * 36 + j;
            term.write(`\x1b[48;5;${id}m${(id % 10).toString().padStart(2, ' ')}\x1b[0m`);
        }
        term.write(`\r\n`);
    }

    term.writeln(`\x1b[0m\n\rGreyscale from 256 palette:`);
    term.write('232-255 ');
    for (let i = 232; i < 256; i++) {
        term.write(`\x1b[48;5;${i}m ${(i % 10)} \x1b[0m`);
    }
}

function writeTestString(): string {
    let alphabet = '';
    for (let i = 97; i < 123; i++) {
        alphabet += String.fromCharCode(i);
    }
    let numbers = '';
    for (let i = 0; i < 10; i++) {
        numbers += i.toString();
    }
    return `${alphabet} ${numbers} 汉语 한국어 👽`;
}
const testString = writeTestString();

function sgrTest(): void {
    term.write('\n\n\r');
    term.writeln(`Character Attributes (SGR, Select Graphic Rendition)`);
    const entries: { ps: number, name: string }[] = [
        { ps: 0, name: 'Normal' },
        { ps: 1, name: 'Bold' },
        { ps: 2, name: 'Faint/dim' },
        { ps: 3, name: 'Italicized' },
        { ps: 4, name: 'Underlined' },
        { ps: 5, name: 'Blink' },
        { ps: 7, name: 'Inverse' },
        { ps: 8, name: 'Invisible' },
        { ps: 9, name: 'Crossed-out characters' },
        { ps: 21, name: 'Doubly-underlined' },
        { ps: 22, name: 'Normal' },
        { ps: 23, name: 'Not italicized' },
        { ps: 24, name: 'Not underlined' },
        { ps: 25, name: 'Steady (not blink)' },
        { ps: 27, name: 'Positive (not inverse)' },
        { ps: 28, name: 'Visible (not hidden)' },
        { ps: 29, name: 'Not crossed-out' },
        { ps: 30, name: 'Foreground Black' },
        { ps: 31, name: 'Foreground Red' },
        { ps: 32, name: 'Foreground Green' },
        { ps: 33, name: 'Foreground Yellow' },
        { ps: 34, name: 'Foreground Blue' },
        { ps: 35, name: 'Foreground Magenta' },
        { ps: 36, name: 'Foreground Cyan' },
        { ps: 37, name: 'Foreground White' },
        { ps: 39, name: 'Foreground default' },
        { ps: 40, name: 'Background Black' },
        { ps: 41, name: 'Background Red' },
        { ps: 42, name: 'Background Green' },
        { ps: 43, name: 'Background Yellow' },
        { ps: 44, name: 'Background Blue' },
        { ps: 45, name: 'Background Magenta' },
        { ps: 46, name: 'Background Cyan' },
        { ps: 47, name: 'Background White' },
        { ps: 49, name: 'Background default' }
    ];
    const maxNameLength = entries.reduce<number>((p, c) => Math.max(c.name.length, p), 0);
    for (const e of entries) {
        term.writeln(`\x1b[0m\x1b[${e.ps}m ${e.ps.toString().padEnd(2, ' ')} ${e.name.padEnd(maxNameLength, ' ')} - ${testString}\x1b[0m`);
    }
    const entriesByPs: Map<number, string> = new Map();
    for (const e of entries) {
        entriesByPs.set(e.ps, e.name);
    }
    const comboEntries: { ps: number[] }[] = [
        { ps: [1, 2, 3, 4, 5, 6, 7, 9] },
        { ps: [2, 41] }
    ];
    term.write('\n\n\r');
    term.writeln(`Combinations`);
    for (const e of comboEntries) {
        const name = e.ps.map(e => entriesByPs.get(e)).join(', ');
        term.writeln(`\x1b[0m\x1b[${e.ps.join(';')}m ${name}\n\r${testString}\x1b[0m`);
    }
}

function addAnsiHyperlink(): void {
    term.write('\n\n\r');
    term.writeln(`Regular link with no id:`);
    term.writeln('\x1b]8;;https://github.com\x07GitHub\x1b]8;;\x07');
    term.writeln('\x1b]8;;https://xtermjs.org\x07https://xtermjs.org\x1b]8;;\x07\x1b[C<- null cell');
    term.writeln(`\nAdjacent links:`);
    term.writeln('\x1b]8;;https://github.com\x07GitHub\x1b]8;;https://xtermjs.org\x07\x1b[32mxterm.js\x1b[0m\x1b]8;;\x07');
    term.writeln(`\nShared ID link (underline should be shared):`);
    term.writeln('╔════╗');
    term.writeln('║\x1b]8;id=testid;https://github.com\x07GitH\x1b]8;;\x07║');
    term.writeln('║\x1b]8;id=testid;https://github.com\x07ub\x1b]8;;\x07  ║');
    term.writeln('╚════╝');
    term.writeln(`\nWrapped link with no ID (not necessarily meant to share underline):`);
    term.writeln('╔════╗');
    term.writeln('║    ║');
    term.writeln('║    ║');
    term.writeln('╚════╝');
    term.write('\x1b[3A\x1b[1C\x1b]8;;https://xtermjs.org\x07xter\x1b[B\x1b[4Dm.js\x1b]8;;\x07\x1b[2B\x1b[5D');
}

/**
 * Prints the 20977 characters from the CJK Unified Ideographs unicode block.
 */
function addCjk(): void {
    term.write('\n\n\r');
    for (let i = 0x4E00; i < 0x9FCC; i++) {
        term.write(String.fromCharCode(i));
    }
}

/**
 * Prints the 20977 characters from the CJK Unified Ideographs unicode block with randomized styles.
 */
function addCjkRandomSgr(): void {
    term.write('\n\n\r');
    for (let i = 0x4E00; i < 0x9FCC; i++) {
        term.write(`\x1b[${getRandomSgr()}m${String.fromCharCode(i)}\x1b[0m`);
    }
}
const randomSgrAttributes = [
    '1', '2', '3', '4', '5', '6', '7', '9',
    '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
    '40', '41', '42', '43', '44', '45', '46', '47', '48', '49'
];
function getRandomSgr(): string {
    return randomSgrAttributes[Math.floor(Math.random() * randomSgrAttributes.length)];
}

function addDecoration(): void {
    term.options['overviewRulerWidth'] = 15;
    const marker = term.registerMarker(1);
    const decoration = term.registerDecoration({
        marker,
        backgroundColor: '#00FF00',
        foregroundColor: '#00FE00',
        overviewRulerOptions: { color: '#ef292980', position: 'left' }
    });
    decoration.onRender((e: HTMLElement) => {
        e.style.right = '100%';
        e.style.backgroundColor = '#ef292980';
    });
}

function addOverviewRuler(): void {
    term.options['overviewRulerWidth'] = 15;
    term.registerDecoration({ marker: term.registerMarker(1), overviewRulerOptions: { color: '#ef2929' } });
    term.registerDecoration({ marker: term.registerMarker(3), overviewRulerOptions: { color: '#8ae234' } });
    term.registerDecoration({ marker: term.registerMarker(5), overviewRulerOptions: { color: '#729fcf' } });
    term.registerDecoration({ marker: term.registerMarker(7), overviewRulerOptions: { color: '#ef2929', position: 'left' } });
    term.registerDecoration({ marker: term.registerMarker(7), overviewRulerOptions: { color: '#8ae234', position: 'center' } });
    term.registerDecoration({ marker: term.registerMarker(7), overviewRulerOptions: { color: '#729fcf', position: 'right' } });
    term.registerDecoration({ marker: term.registerMarker(10), overviewRulerOptions: { color: '#8ae234', position: 'center' } });
    term.registerDecoration({ marker: term.registerMarker(10), overviewRulerOptions: { color: '#ffffff80', position: 'full' } });
}

(console as any).image = (source: ImageData | HTMLCanvasElement, scale: number = 1) => {
    function getBox(width: number, height: number): any {
        return {
            string: '+',
            style: 'font-size: 1px; padding: ' + Math.floor(height/2) + 'px ' + Math.floor(width/2) + 'px; line-height: ' + height + 'px;'
        };
    }
    if (source instanceof HTMLCanvasElement) {
        source = source.getContext('2d')?.getImageData(0, 0, source.width, source.height)!;
    }
    const canvas = document.createElement('canvas');
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(source, 0, 0);

    const sw = source.width * scale;
    const sh = source.height * scale;
    const dim = getBox(sw, sh);
    console.log(
        `Image: ${source.width} x ${source.height}\n%c${dim.string}`,
        `${dim.style}background: url(${canvas.toDataURL()}); background-size: ${sw}px ${sh}px; background-repeat: no-repeat; color: transparent;`
    );
    console.groupCollapsed('Zoomed');
    console.log(
        `%c${dim.string}`,
        `${getBox(sw * 10, sh * 10).style}background: url(${canvas.toDataURL()}); background-size: ${sw * 10}px ${sh * 10}px; background-repeat: no-repeat; color: transparent; image-rendering: pixelated;-ms-interpolation-mode: nearest-neighbor;`
    );
    console.groupEnd();
};

function addVtButtons(): void {
    function csi(e: string): string {
        return `\x1b[${e}`;
    }

    function createButton(name: string, description: string, writeCsi: string, paramCount: number = 1): HTMLElement {
        const inputs: HTMLInputElement[] = [];
        for (let i = 0; i < paramCount; i++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.title = `Input #${i + 1}`;
            inputs.push(input);
        }

        const element = document.createElement('button');
        element.textContent = name;
        writeCsi.split('');
        const prefix = writeCsi.length === 2 ? writeCsi[0] : '';
        const suffix = writeCsi[writeCsi.length - 1];
        element.addEventListener(`click`, () => term.write(csi(`${prefix}${inputs.map(e => e.value).join(';')}${suffix}`)));

        const desc = document.createElement('span');
        desc.textContent = description;

        const container = document.createElement('div');
        container.classList.add('vt-button');
        container.append(element, ...inputs, desc);
        return container;
    }
    const vtFragment = document.createDocumentFragment();
    const buttonSpecs: { [key: string]: { label: string, description: string, paramCount?: number }} = {
        A:    { label: 'CUU ↑',  description: 'Cursor Up Ps Times' },
        B:    { label: 'CUD ↓',  description: 'Cursor Down Ps Times' },
        C:    { label: 'CUF →',  description: 'Cursor Forward Ps Times' },
        D:    { label: 'CUB ←',  description: 'Cursor Backward Ps Times' },
        E:    { label: 'CNL',    description: 'Cursor Next Line Ps Times' },
        F:    { label: 'CPL',    description: 'Cursor Preceding Line Ps Times' },
        G:    { label: 'CHA',    description: 'Cursor Character Absolute' },
        H:    { label: 'CUP',    description: 'Cursor Position [row;column]', paramCount: 2 },
        I:    { label: 'CHT',    description: 'Cursor Forward Tabulation Ps tab stops' },
        J:    { label: 'ED',     description: 'Erase in Display' },
        '?J': { label: 'DECSED', description: 'Erase in Display' },
        K:    { label: 'EL',     description: 'Erase in Line' },
        '?K': { label: 'DECSEL', description: 'Erase in Line' },
        L:    { label: 'IL',     description: 'Insert Ps Line(s)' },
        M:    { label: 'DL',     description: 'Delete Ps Line(s)' },
        P:    { label: 'DCH',    description: 'Delete Ps Character(s)' }
    };
    for (const s of Object.keys(buttonSpecs)) {
        const spec = buttonSpecs[s];
        vtFragment.appendChild(createButton(spec.label, spec.description, s, spec.paramCount));
    }

    document.querySelector('#vt-container').appendChild(vtFragment);
}

function testWeblinks(): void {
    const linkExamples = `
aaa http://example.com aaa http://example.com aaa
￥￥￥ http://example.com aaa http://example.com aaa
aaa http://example.com ￥￥￥ http://example.com aaa
￥￥￥ http://example.com ￥￥￥ http://example.com aaa
aaa https://ko.wikipedia.org/wiki/위키백과:대문 aaa https://ko.wikipedia.org/wiki/위키백과:대문 aaa
￥￥￥ https://ko.wikipedia.org/wiki/위키백과:대문 aaa https://ko.wikipedia.org/wiki/위키백과:대문 ￥￥￥
aaa http://test:password@example.com/some_path aaa
brackets enclosed:
aaa [http://example.de] aaa
aaa (http://example.de) aaa
aaa <http://example.de> aaa
aaa {http://example.de} aaa
ipv6 https://[::1]/with/some?vars=and&a#hash aaa
stop at final '.': This is a sentence with an url to http://example.com.
stop at final '?': Is this the right url http://example.com/?
stop at final '?': Maybe this one http://example.com/with?arguments=false?
  `;
    term.write(linkExamples.split('\n').join('\r\n'));
}