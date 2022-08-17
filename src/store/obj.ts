import { createStorageSignal } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { FsGetResp, FsListResp, Obj, StoreObj } from "~/types";
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

const [objStore, setObjStore] = createStore<{
  obj: Obj;
  raw_url: string;

  objs: StoreObj[];
  readme: string;
  related: Obj[];
  write?: boolean;
  // pageIndex: number;
  // pageSize: number;
  state: State;
  err: string;
}>({
  obj: {} as Obj,
  raw_url: "",
  objs: [],
  readme: "",
  related: [],
  // pageIndex: 1,
  // pageSize: 50,
  state: State.Initial,
  err: "",
});

const [selectedNum, setSelectedNum] = createSignal(0);

const setObjs = (objs: Obj[]) => {
  setSelectedNum(0);
  setObjStore("objs", objs);
};

export const ObjStore = {
  setObj: (obj: Obj) => {
    setObjStore("obj", obj);
  },
  setRawUrl: (raw_url: string) => {
    setObjStore("raw_url", raw_url);
  },
  setObjs: setObjs,
  setReadme: (readme: string) => setObjStore("readme", readme),
  setRelated: (related: Obj[]) => setObjStore("related", related),
  setWrite: (write: boolean) => setObjStore("write", write),
  // setGetResp: (resp: FsGetResp) => {
  //   setObjStore("obj", resp.data);
  //   setObjs(resp.data.related);
  //   setObjStore("readme", resp.data.readme);
  // },
  // setListResp: (resp: FsListResp) => {
  //   setObjs(resp.data.content);
  //   setObjStore("readme", resp.data.readme);
  //   setObjStore("write", resp.data.write);
  // },
  setState: (state: State) => setObjStore("state", state),
  setErr: (err: string) => setObjStore("err", err),
};

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
      if (obj.selected !== selected) {
        setSelectedNum(selected ? selectedNum() + 1 : selectedNum() - 1);
      }
      obj.selected = selected;
    })
  );
};

export const selectAll = (selected: boolean) => {
  setSelectedNum(selected ? objStore.objs.length : 0);
  setObjStore("objs", {}, (obj) => ({ selected: selected }));
};

export const selectedObjs = () => {
  return objStore.objs.filter((obj) => obj.selected);
};

export const allChecked = () => {
  return objStore.objs.length === selectedNum();
};

export const haveSelected = () => {
  return selectedNum() > 0;
};

export const isIndeterminate = () => {
  return selectedNum() > 0 && selectedNum() < objStore.objs.length;
};

export type Layout = "list" | "grid";
const [layout, setLayout] = createStorageSignal<Layout>("layout", "list");
const [_password, setPassword] = createStorageSignal<string>(
  "browser-password",
  ""
);
export const password = () => _password() ?? "";
const [_checkboxOpen, setCheckboxOpen] = createStorageSignal<string>(
  "checkbox-open",
  "false"
);
export const checkboxOpen = () => _checkboxOpen() === "true";

export const toggleCheckbox = () => {
  setCheckboxOpen(checkboxOpen() ? "false" : "true");
};

export { objStore, layout, setLayout, setPassword };
