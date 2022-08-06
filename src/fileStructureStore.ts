import { writable } from "svelte/store";
import { fileStructureDemo } from "./fileStructureDemo";
import type { TreeNode } from "carbon-components-svelte/types/TreeView/TreeView.svelte";

export const fileStructure = writable(fileStructureDemo);
