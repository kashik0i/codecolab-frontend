import {type EditorModel, supportedLanguagesEnum} from "./global.d";

export const typescriptDemo1: EditorModel = {
    code: [
        "export const editorContents = import fetch from 'node-fetch\n",
        "import React from 'react'\n",
        "import { LocalStorageCache } from 'monaco-editor-auto-typings'\n",
        "// Works fine\n",
        "fetch('https://google.com', { method: 'GET' })\n",
        "React.useEffect(() => {})\n",
        "React.useState<string>('Hello')\n",
        "new LocalStorageCache().getFile('FILE_ID')\n",
        "// Type errors are detected! :)\n",
        "fetch(1337) // Shouldn't be a number!\n",
        "React.useEffect('I\\`m not a function!')\n",
        "React.useState<number>('Not a number :s')\n",
        "new LocalStorageCache().getFile() // Argument missing!;"
    ].join("\n"),
    language: supportedLanguagesEnum.typescript,
    order: 0,
    id: "",
    preview: true,
    render: true,
    status: "idle",
};
export const jsonSettingsDemo1: EditorModel = {
    code: `{
	"type": "team",
	"test": {
		"testPage": "tools/testing/run-tests.htm",
		"enabled": true
	},
    "search": {
        "excludeFolders": [
			".git",
			"node_modules",
			"tools/bin",
			"tools/counts",
			"tools/policheck",
			"tools/tfs_build_extensions",
			"tools/testing/jscoverage",
			"tools/testing/qunit",
			"tools/testing/chutzpah",
			"server.net"
        ]
    },
	"languages": {
		"vs.languages.typescript": {
			"validationSettings": [{
				"scope":"/",
				"noImplicitAny":true,
				"noLib":false,
				"extraLibs":[],
				"semanticValidation":true,
				"syntaxValidation":true,
				"codeGenTarget":"ES5",
				"moduleGenTarget":"",
				"lint": {
                    "emptyBlocksWithoutComment": "warning",
                    "curlyBracketsMustNotBeOmitted": "warning",
                    "comparisonOperatorsNotStrict": "warning",
                    "missingSemicolon": "warning",
                    "unknownTypeOfResults": "warning",
                    "semicolonsInsteadOfBlocks": "warning",
                    "functionsInsideLoops": "warning",
                    "functionsWithoutReturnType": "warning",
                    "tripleSlashReferenceAlike": "warning",
                    "unusedImports": "warning",
                    "unusedVariables": "warning",
                    "unusedFunctions": "warning",
                    "unusedMembers": "warning"
                }
			}, 
			{
				"scope":"/client",
				"baseUrl":"/client",
				"moduleGenTarget":"amd"
			},
			{
				"scope":"/server",
				"moduleGenTarget":"commonjs"
			},
			{
				"scope":"/build",
				"moduleGenTarget":"commonjs"
			},
			{
				"scope":"/node_modules/nake",
				"moduleGenTarget":"commonjs"
			}],
			"allowMultipleWorkers": true
		}
	}
}`,
    language: supportedLanguagesEnum.json,
    order: 0,
    id: "",
    preview: false,
    render: false,
    status: "idle",
};
export const svelteDemo1: EditorModel = {
    code: [
        "<script>",
        "// from https://svelte.dev/repl/82b00644720a4ca2bdb89c6a653ec987",
        "import TreeView from './TreeView.svelte'",
        "const tree = {",
        'label: "USA", children: [',
        '{label: "Florida", children: [',
        '{label: "Jacksonville"},',
        '{label: "Orlando", children: [',
        '{label: "Disney World"},',
        '{label: "Universal Studio"},',
        '{label: "Sea World"},',
        "]},",
        '{label: "Miami"},',
        "]},",
        '{label: "California", children: [',
        '{label: "San Francisco"},',
        '{label: "Los Angeles"},',
        '{label: "Sacramento"},',
        "]},",
        "],",
        "}",
        "</script>",
        "<TreeView {tree} />",
    ].join("\n"),
    language: supportedLanguagesEnum.svelte,
    order: 0,
    id: "",
    preview: true,
    render: true,
    status: "idle",
};
export const javascriptDemo1: EditorModel = {
    code: [
        '"use strict";',
        "function Person(age) {",
        "	if (age) {",
        "		this.age = age;",
        "	}",
        "}",
        "Person.prototype.getAge = function () {",
        "	return this.age;",
        "};",
        "console.log(new Person(10))",
        "console.log(new Person(10).getAge())",
    ].join("\n"),
    language: supportedLanguagesEnum.javascript,
    order: 0,
    id: "",
    preview: true,
    render: true,
    status: "idle",
};
export const htmlDemo1: EditorModel = {
    code: `<html lang="">
 `,
    language: supportedLanguagesEnum.html,
    order: 0,
    id: "",
    preview: true,
    render: true,
    status: "idle",
};
export const sqlDemo1: EditorModel = {
    code: [
        "CREATE TABLE EMP\n" +
        "       (EMPNO NUMBER(4) NOT NULL,\n" +
        "        ENAME VARCHAR2(10),\n" +
        "        JOB VARCHAR2(9),\n" +
        "        MGR NUMBER(4),\n" +
        "        HIREDATE DATE,\n" +
        "        SAL NUMBER(7, 2),\n" +
        "        COMM NUMBER(7, 2),\n" +
        "        DEPTNO NUMBER(2));\n",
        "INSERT INTO EMP VALUES\n" +
        "        (7369, 'SMITH',  'CLERK',     7902,\n" +
        "        TO_DATE('17-DEC-1980', 'DD-MON-YYYY'),  800, NULL, 20);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7499, 'ALLEN',  'SALESMAN',  7698,\n" +
        "        TO_DATE('20-FEB-1981', 'DD-MON-YYYY'), 1600,  300, 30);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7521, 'WARD',   'SALESMAN',  7698,\n" +
        "        TO_DATE('22-FEB-1981', 'DD-MON-YYYY'), 1250,  500, 30);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7566, 'JONES',  'MANAGER',   7839,\n" +
        "        TO_DATE('2-APR-1981', 'DD-MON-YYYY'),  2975, NULL, 20);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7654, 'MARTIN', 'SALESMAN',  7698,\n" +
        "        TO_DATE('28-SEP-1981', 'DD-MON-YYYY'), 1250, 1400, 30);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7698, 'BLAKE',  'MANAGER',   7839,\n" +
        "        TO_DATE('1-MAY-1981', 'DD-MON-YYYY'),  2850, NULL, 30);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7782, 'CLARK',  'MANAGER',   7839,\n" +
        "        TO_DATE('9-JUN-1981', 'DD-MON-YYYY'),  2450, NULL, 10);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7788, 'SCOTT',  'ANALYST',   7566,\n" +
        "        TO_DATE('09-DEC-1982', 'DD-MON-YYYY'), 3000, NULL, 20);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7839, 'KING',   'PRESIDENT', NULL,\n" +
        "        TO_DATE('17-NOV-1981', 'DD-MON-YYYY'), 5000, NULL, 10);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7844, 'TURNER', 'SALESMAN',  7698,\n" +
        "        TO_DATE('8-SEP-1981', 'DD-MON-YYYY'),  1500,    0, 30);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7876, 'ADAMS',  'CLERK',     7788,\n" +
        "        TO_DATE('12-JAN-1983', 'DD-MON-YYYY'), 1100, NULL, 20);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7900, 'JAMES',  'CLERK',     7698,\n" +
        "        TO_DATE('3-DEC-1981', 'DD-MON-YYYY'),   950, NULL, 30);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7902, 'FORD',   'ANALYST',   7566,\n" +
        "        TO_DATE('3-DEC-1981', 'DD-MON-YYYY'),  3000, NULL, 20);\n" +
        "INSERT INTO EMP VALUES\n" +
        "        (7934, 'MILLER', 'CLERK',     7782,\n" +
        "        TO_DATE('23-JAN-1982', 'DD-MON-YYYY'), 1300, NULL, 10);",
    ].join("\n"),
    language: supportedLanguagesEnum.sql,
    order: 0,
    id: "",
    preview: true,
    render: true,
    status: "idle",
};
export const sqlDemo2: EditorModel = {
    code: "SELECT * FROM cities WHERE pop < 3500000 ORDER BY pop DESC",
    language: supportedLanguagesEnum.sql,
    order: 0,
    id: "",
    preview: true,
    render: true,
    status: "idle",
};
export const pythonDemo1: EditorModel = {
    code: [
        "#x = \"World\"",
        "#print(f\"Hello {x}\")",
        "import sys",
        "sys.version"
    ].join("\n"),
    language: supportedLanguagesEnum.python,
    order: 0,
    id: "",
    preview: true,
    render: true,
    status: "idle",
};
