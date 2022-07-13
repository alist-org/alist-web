import { createSignal } from "solid-js";

export enum State {
  Initial, // Initial state
  FetchingObj,
  FetchingObjs,
  TokenExpired, // Token expired
  Folder, // Folder state
  File, // File state
}

const [state, setState] = createSignal<State>(State.Initial);
const [err, setErr] = createSignal<string>("");

export { state, setState };
export { err, setErr };
