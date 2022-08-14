import { createStorageSignal } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Obj, StoreObj } from "~/types";
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
  objs: StoreObj[];
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

export const selectIndex = (index: number, selected: boolean) => {
  setObjStore(
    "objs",
    index,
    produce((obj) => {
      obj.selected = selected;
    })
  );
};

export const selectAll = (selected: boolean) => {
  setObjStore("objs", {}, (obj) => ({ selected: selected }));
};

export const selectedObjs = () => {
  return objStore.objs.filter((obj) => obj.selected);
};

export type Layout = "list" | "grid";
const [layout, setLayout] = createStorageSignal<Layout>("layout", "list");
const [password, setPassword] = createStorageSignal<string>(
  "browser-password",
  ""
);
const [checkboxOpen, setCheckboxOpen] = createStorageSignal<string>(
  "checkbox-open",
  "true"
);

export {
  objStore,
  setObjStore,
  layout,
  setLayout,
  password,
  setPassword,
  checkboxOpen,
  setCheckboxOpen,
};
