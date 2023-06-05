import {writable} from "svelte/store";
import type {SessionManager} from "../components/Session/SessionManager";
export function createLocalStorageStore<T>(key, initialValue) {
    const json = localStorage.getItem(key);
    const startValue = json ? JSON.parse(json) : initialValue;
    const store = writable<T>(startValue);

    store.subscribe((value) => {
        localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}
export const session = createLocalStorageStore<SessionManager>("session", null);
