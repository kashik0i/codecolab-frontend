/// <reference types="@sveltejs/kit" />
import type {TreeNode} from "carbon-components-svelte/types/TreeView/TreeView.svelte";

export type AppTheme = "white" | "g10" | "g80" | "g90" | "g100";
export type EditorTheme = "vs" | "vs-dark" | "hc-black";
type AppSettings = {
  settingsMenuToggled: boolean;
  deleteCellWarning: boolean;
};

export interface EditorSettings{
  previewStyle:"left"|"right"|"down"
}
export interface ReleaseNode {
  id: string;
  text: string;
  icon?: typeof import("svelte").SvelteComponent;
  disabled?: boolean;
  expanded?: boolean;
}
export interface CodeBlockProps {
  code: string;
  language: string;
}
type IFileStructure = TreeNode[] & {
  children?: TreeNode[];
};
export interface ChangelogNode {
  releaseAnnouncementPost: string;
  // subRelease: string;
  releaseUrl: string;
  version: string;
  date: string;
  releaseHighlights: ReleaseNode[] & { children?: ReleaseNode[] };
  features: {
    title: string;
    description: string;
    githubIssue: { id: `#${string}`; url: string }[];
  }[];
}

export interface ChangelogTree {
  nodes: ChangelogNode[];
}
export interface EditorModel {
  code: string;
  language: string;
  order: number;
  id: string;
  preview: boolean;
  render:boolean;
  renderEngine?
}
export const supportedLanguagesList = [
  "javascript",
  "typescript",
  "markdown",
  "html",
  "css",
  "json",
  "sql",
];
