import { writable } from "svelte/store";
import { changelogTreeDemo } from "./changelogDemo";
import type {
  AppTheme,
  EditorTheme,
  AppSettings,
  ChangelogTree,
  EditorSettings,
  supportedLanguagesEnum,
} from "./global";
export const appTheme = writable<AppTheme>("white");
export const editorTheme = writable<EditorTheme>("vs-dark");
export const appSettings = writable<AppSettings>({
  settingsMenuToggled: false,
  deleteCellWarning: true,
});
export const editorSettings = writable<EditorSettings>({
  previewStyle: "left",
});
export const changelogTree = writable<ChangelogTree>(changelogTreeDemo);
export const supportedLanguages = writable([
  "javascript",
  "typescript",
  "markdown",
  "html",
  "css",
  "json",
  "sql",
]);
