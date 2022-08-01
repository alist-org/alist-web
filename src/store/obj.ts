import { createStorageSignal } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import { Obj } from "~/types";

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

export const enterObj = (obj: Obj) => {
  setObjStore("obj", obj);
};

export type Layout = "list" | "grid";
const [layout, setLayout] = createStorageSignal<Layout>("list");

export { objStore, setObjStore, layout, setLayout };
