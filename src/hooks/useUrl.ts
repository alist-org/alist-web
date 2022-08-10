import { State, state } from "~/store";
import { Obj } from "~/types";
import { api, encodePath, pathDir, standardizePath } from "~/utils";
import { useRouter } from ".";

// get download url by dir and obj
export const getUrlByDirAndObj = (
  dir: string,
  obj: Obj,
  proxy?: boolean,
  encodeAll?: boolean
) => {
  dir = standardizePath(dir, true);
  let path = `${dir}/${obj.name}`;
  path = encodePath(path, encodeAll);
  return `${api}/${proxy ? "p" : "d"}${path}?sign=${obj.sign}`;
};

// get download link by current state and pathname
export const useUrl = () => {
  const { pathname } = useRouter();
  const getUrlByObj = (obj: Obj, proxy?: boolean, encodeAll?: boolean) => {
    const dir = state() === State.Folder ? pathname() : pathDir(pathname());
    return getUrlByDirAndObj(dir, obj, proxy, encodeAll);
  };
  return {
    getUrlByObj: getUrlByObj,
    rawUrl: (obj: Obj, encodeAll?: boolean) => {
      return getUrlByObj(obj, false, encodeAll);
    },
    proxyUrl: (obj: Obj, encodeAll?: boolean) => {
      return getUrlByObj(obj, true, encodeAll);
    },
  };
};
