import { createLocalStorage } from "@solid-primitives/storage";

const [local, setLocal, { remove, clear, toJSON }] = createLocalStorage();
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object;
}

const initial = {
  aria2_rpc_url: "http://localhost:6800/jsonrpc",
  aria2_rpc_secret: "",
};
for (const key in initial) {
  if (!local[key] && isValidKey(key, initial)) {
    setLocal(key, initial[key]);
  }
}

export { local, setLocal, remove, clear, toJSON };
