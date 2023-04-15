import {writable} from "svelte/store";
import {Engine} from "../languages";

export const languageServiceEngine = writable<Engine>(new Engine());
