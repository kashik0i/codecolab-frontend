/// <reference types="@sveltejs/kit" />
import type {TreeNode} from "carbon-components-svelte/types/TreeView/TreeView.svelte";
import Peer from "simple-peer";

export enum PreviewTypes {
    output = 0,
    ast = 1,
    statistics = 2,
    error = 3,
    console = 4,
    xterm = 5,
}

type enumValues = keyof typeof PreviewTypes;
type ObjectWithKeysOfEnumAsKeys = { [key in enumValues]: string };

interface PreviewTypesEnum {
    [id: PreviewTypes]: string;
}

export type AppTheme = "white" | "g10" | "g80" | "g90" | "g100";
export type EditorTheme = "vs" | "vs-dark" | "hc-black";
type AppSettings = {
    settingsMenuToggled: boolean;
    deleteCellWarning: boolean;
};

export interface EditorSettings {
    previewStyle: "left" | "right" | "down";
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

declare global {
    interface Navigator {
        msSaveBlob?: (blob: any, defaultName?: string) => boolean;
    }
}

export interface ChangelogTree {
    nodes: ChangelogNode[];
}

export interface EditorModel {
    code: string;
    language: supportedLanguagesEnum;
    order: number;
    id: string;
    preview: boolean;
    render: boolean;
    execution:supportedExecutionEnum,
    renderEngine?;
    status: "idle" | "pending" | "fail" | "success";
}

export enum supportedLanguagesEnum {
    javascript = "javascript",
    typescript = "typescript",
    markdown = "markdown",
    html = "html",
    css = "css",
    json = "json",
    sql = "sql",
    python = "python",
    svelte = "svelte",
    php = "php",
    csharp = "csharp",
    mermaid = "mermaid",
    text = "text",
}
export enum supportedExecutionEnum {
    client = "client",
    server = "server",
    serverless = "serverless",
    none = "none",
}
// type supportedLanguagesValues = keyof typeof supportedLanguagesEnum;
