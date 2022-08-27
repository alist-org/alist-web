import { createLocalStorage } from "@solid-primitives/storage";

const [local, setLocal, { remove, clear, toJSON }] = createLocalStorage();

export { local, setLocal, remove, clear, toJSON };
