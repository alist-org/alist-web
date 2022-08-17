import { selectedObjs, State, state } from "~/store";
import { Obj } from "~/types";
import { api, encodePath, pathDir, standardizePath } from "~/utils";
import { useRouter } from ".";

type URLType = "preview" | "direct" | "proxy";

// get download url by dir and obj
export const getUrlByDirAndObj = (
  dir: string,
  obj: Obj,
  type: URLType = "direct",
  encodeAll?: boolean
) => {
  dir = standardizePath(dir, true);
  let path = `${dir}/${obj.name}`;
  path = encodePath(path, encodeAll);
  const prefix = type === "preview" ? "" : type === "direct" ? "/d" : "/p";
  let ans = `${api}${prefix}${path}`;
  if (type !== "preview" && obj.sign) {
    ans += `?sign=${obj.sign}`;
  }
  return ans;
};

// get download link by current state and pathname
export const useUrl = () => {
  const { pathname } = useRouter();
  const getUrlByObj = (obj: Obj, type?: URLType, encodeAll?: boolean) => {
    const dir = state() === State.Folder ? pathname() : pathDir(pathname());
    return getUrlByDirAndObj(dir, obj, type, encodeAll);
  };
  return {
    getUrlByObj: getUrlByObj,
    rawUrl: (obj: Obj, encodeAll?: boolean) => {
      return getUrlByObj(obj, "direct", encodeAll);
    },
    proxyUrl: (obj: Obj, encodeAll?: boolean) => {
      return getUrlByObj(obj, "proxy", encodeAll);
    },
    previewPage: (obj: Obj, encodeAll?: boolean) => {
      return getUrlByObj(obj, "preview", encodeAll);
    },
  };
};

export const useSelectedUrl = () => {
  const { previewPage, rawUrl, proxyUrl } = useUrl();
  return {
    previewPage: () => {
      return selectedObjs()
        .map((obj) => previewPage(obj, true))
        .join("\n");
    },
    rawUrl: (encodeAll?: boolean) => {
      return selectedObjs()
        .map((obj) => rawUrl(obj, encodeAll))
        .join("\n");
    },
  };
};
