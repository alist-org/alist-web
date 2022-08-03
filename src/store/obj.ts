import { createStorageSignal } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Obj } from "~/types";

export enum State {
  Initial, // Initial state
  FetchingObj,
  FetchingObjs,
  Folder, // Folder state
  File, // File state
}

const [state, setState] = createSignal<State>(State.Initial);
const [err, setErr] = createSignal<string>("");

export { state, setState };
export { err, setErr };


const [objStore, setObjStore] = createStore<{ obj?: Obj; objs: Obj[] }>({
  objs: [],
});

export type OrderBy = "name" | "size" | "modified";

export const sort = (orderBy: OrderBy, reverse?: boolean) => {
  setObjStore("objs", (objs) =>
    objs.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return reverse ? 1 : -1;
      if (a[orderBy] > b[orderBy]) return reverse ? -1 : 1;
      return 0;
    })
  );
};

export type Layout = "list" | "grid";
const [layout, setLayout] = createStorageSignal<Layout>("list");

export { objStore, setObjStore, layout, setLayout };
