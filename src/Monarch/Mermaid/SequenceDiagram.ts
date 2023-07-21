import type {ICustomMonarchLanguage} from "../index";

// Language definition for Mermaid.js
// This definition provides syntax highlighting for Mermaid.js code
export const SequenceDiagram: ICustomMonarchLanguage = {
    configuration: {
        defaultToken: '',
        tokenPostfix: '.mermaid',

        keywords: [
            'sequenceDiagram', 'participant', 'activate', 'deactivate', 'loop', 'alt',
            'opt', 'par', 'break', 'critical', 'note', 'over', 'end', 'click'
        ],

        // we include these common regular expressions
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        digits: /\d+(_+\d+)*/,

        // The main tokenizer for Mermaid.js sequence diagrams
        tokenizer: {
            root: [
                // keywords
                [/[a-zA-Z_$][\w$]*/, {
                    cases: {
                        '@keywords': { token: 'keyword.$0' },
                        '@default': 'identifier'
                    }
                }],

                // whitespace
                { include: '@whitespace' },

                // delimiters and operators
                [/[{}()\[\]]/, '@brackets'],
                [/[,]/, 'delimiter'],

                // strings
                [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
                [/"/, 'string', '@string'],

                // numbers
                [/@digits/, 'number'],

                // comments
                [/\/\/.*$/, 'comment'],
                [/\/\*/, 'comment', '@comment'],
            ],

            whitespace: [
                [/[ \t\r\n]+/, ''],
            ],

            string: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, 'string', '@pop']
            ],

            comment: [
                [/[^/*]+/, 'comment'],
                [/\/\*/, 'comment', '@push'],
                [/\*\//, 'comment', '@pop'],
                [/[/*]/, 'comment']
            ],
        },
    },
    extensionPoint: {
        id: "mermaidSequenceDiagram",
        extensions: [".mermaid"],
        aliases: ["mermaidSequenceDiagram", "mermaid"],
        mimetypes: ["text/mermaid"],
        filenames: ["*.mermaid", "*.mmd"],
        firstLine: "^%%{1,2}.*?mermaid.*$",
        filenamePatterns: ["*.mermaid", "*.mmd"],
    }
}
