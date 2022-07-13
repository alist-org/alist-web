import { createSignal } from "solid-js";

export enum State {
  Initial, // Initial state
  FetchingInitialLanguage, // Fetching initial language
  FetchingSettings,
  FetchingSettingsError,
  FetchingSettingsSuccess,
  FetchingCurrentUser,
  FetchingCurrentUserError,
  FetchingCurrentUserSuccess,
  FetchingObj,
  FetchingObjs,
  TokenExpired, // Token expired
  Folder, // Folder state
  File, // File state
}

const [state, setState] = createSignal<State>(State.FetchingSettings);
const [err, setErr] = createSignal<string>("");

export { state, setState };
export { err, setErr };
