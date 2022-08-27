import { objStore, selectedObjs, State } from "~/store";
import { Obj } from "~/types";
import { api, base_path, encodePath, pathDir, standardizePath } from "~/utils";
import { useRouter, useUtil } from ".";

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
  let host = api;
  let prefix = type === "direct" ? "/d" : "/p";
  if (type === "preview") {
    host = location.origin + base_path;
    prefix = "";
  }
  let ans = `${host}${prefix}${path}`;
  if (type !== "preview" && obj.sign) {
    ans += `?sign=${obj.sign}`;
  }
  return ans;
};

// get download link by current state and pathname
export const useUrl = () => {
  const { pathname } = useRouter();
  const getUrlByObj = (obj: Obj, type?: URLType, encodeAll?: boolean) => {
    const dir =
      objStore.state === State.Folder ? pathname() : pathDir(pathname());
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
  const { previewPage, rawUrl } = useUrl();
  const rawUrls = (encodeAll?: boolean) => {
    return selectedObjs()
      .filter((obj) => !obj.is_dir)
      .map((obj) => rawUrl(obj, encodeAll));
  };
  return {
    rawUrls: rawUrls,
    previewPagesText: () => {
      return selectedObjs()
        .map((obj) => previewPage(obj, true))
        .join("\n");
    },
    rawUrlsText: (encodeAll?: boolean) => {
      return rawUrls(encodeAll).join("\n");
    },
  };
};

export const useCopyUrl = () => {
  const { copy } = useUtil();
  const { previewPagesText: previewPage, rawUrlsText: rawUrl } =
    useSelectedUrl();
  return {
    copyPreviewPage: () => {
      copy(previewPage());
    },
    copyRawUrl: (encodeAll?: boolean) => {
      copy(rawUrl(encodeAll));
    },
  };
};
