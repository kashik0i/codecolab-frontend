import type { EditorModel } from "./global";

export const typescriptDemo1: EditorModel = {
  code: [
    "let x:number=3;",
    "let y:number=3;",
    "let z:number=x+y;",
    "console.log('z ='+z)",
  ].join("\n"),
  language: "typescript",
  order: 0,
  id: "",
  preview: true,
  render: true,
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
  language: "json",
  order: 0,
  id: "",
  preview: false,
  render: false,
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
  language: "svelte",
  order: 0,
  id: "",
  preview: true,
  render: true,
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
  language: "javascript",
  order: 0,
  id: "",
  preview: true,
  render: true,
};
export const htmlDemo1: EditorModel = {
  code: `<html lang="">
 `,
  language: "html",
  order: 0,
  id: "",
  preview: true,
  render: true,
};
