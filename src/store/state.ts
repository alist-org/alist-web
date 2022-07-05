import { createSignal } from "solid-js";

export enum State {
  Initial, // Initial state
  Loading, // Loading state
  TokenExpired, // Token expired
  Folder, // Folder state
  File, // File state
}

const [state, setState] = createSignal<State>(State.Initial);

export { state, setState };
