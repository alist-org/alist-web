import { createStorageSignal } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Obj } from "~/types";
import { log } from "~/utils";

export enum State {
  Initial, // Initial state
  FetchingObj,
  FetchingObjs,
  FetchingMore,
  Folder, // Folder state
  File, // File state
  NeedPassword,
}

const [state, setState] = createSignal<State>(State.Initial);
const [err, setErr] = createSignal<string>("");

export { state, setState };
export { err, setErr };

const [objStore, setObjStore] = createStore<{
  obj?: Obj;
  objs: Obj[];
  // pageIndex: number;
  // pageSize: number;
}>({
  objs: [],
  // pageIndex: 1,
  // pageSize: 50,
});

export type OrderBy = "name" | "size" | "modified";

export const sortObjs = (orderBy: OrderBy, reverse?: boolean) => {
  log("sort:", orderBy, reverse);
  setObjStore(
    "objs",
    produce((objs) =>
      objs.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return reverse ? 1 : -1;
        if (a[orderBy] > b[orderBy]) return reverse ? -1 : 1;
        return 0;
      })
    )
  );
};

export const appendObjs = (objs: Obj[]) => {
  setObjStore(
    "objs",
    produce((prev) => prev.push(...objs))
  );
};

export type Layout = "list" | "grid";
const [layout, setLayout] = createStorageSignal<Layout>("list");
const [password, setPassword] = createStorageSignal<string>("");

export { objStore, setObjStore, layout, setLayout, password, setPassword };
