import {writable} from "svelte/store";
import {Session} from "../Models/Session";

export const session = writable<Session>(new Session(true));
