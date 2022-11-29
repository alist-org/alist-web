import { createLocalStorage } from "@solid-primitives/storage"

const [local, setLocal, { remove, clear, toJSON }] = createLocalStorage()
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object
}

export const initialLocalSettings = {
  aria2_rpc_url: "http://localhost:6800/jsonrpc",
  aria2_rpc_secret: "",
  // aria2_dir: "alist",
}
for (const key in initialLocalSettings) {
  if (!local[key] && isValidKey(key, initialLocalSettings)) {
    setLocal(key, initialLocalSettings[key])
  }
}

export { local, setLocal, remove, clear, toJSON }
