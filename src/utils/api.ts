import axios, { CancelToken } from "axios";
import { EmptyResp, FsGetResp, FsListResp, Obj, PageResp, Resp } from "~/types";
import { r } from ".";

type EmptyRespPromise = Promise<EmptyResp>;

export const fsGet = (
  path: string = "/",
  password = ""
): Promise<FsGetResp> => {
  return r.post("/fs/get", {
    path: path,
    password: password,
  });
};
export const fsList = (
  path: string = "/",
  password = "",
  page = 1,
  per_page = 0,
  refresh = false,
  cancelToken: CancelToken
): Promise<FsListResp> => {
  return r.post(
    "/fs/list",
    {
      path,
      password,
      page,
      per_page,
      refresh,
    },
    {
      cancelToken: cancelToken,
    }
  );
};

export const fsDirs = (path = "/", password = ""): Promise<Resp<Obj[]>> => {
  return r.post("/fs/dirs", { path, password });
};

export const fsMkdir = (path: string): EmptyRespPromise => {
  return r.post("/fs/mkdir", { path });
};

export const fsRename = (path: string, name: string): EmptyRespPromise => {
  return r.post("/fs/rename", { path, name });
};

export const fsMove = (
  src_dir: string,
  dst_dir: string,
  names: string[]
): EmptyRespPromise => {
  return r.post("/fs/move", { src_dir, dst_dir, names });
};

export const fsCopy = (
  src_dir: string,
  dst_dir: string,
  names: string[]
): EmptyRespPromise => {
  return r.post("/fs/copy", { src_dir, dst_dir, names });
};

export const fsRemove = (dir: string, names: string[]): EmptyRespPromise => {
  return r.post("/fs/remove", { dir, names });
};

export const fsNewFile = (path: string): EmptyRespPromise => {
  return r.put("/fs/put", undefined, {
    headers: {
      "File-Path": encodeURIComponent(path),
    },
  });
};

export const addAria2 = (path: string, urls: string[]): EmptyRespPromise => {
  return r.post("/fs/add_aria2", { path, urls });
};

export const fetchText = async (url: string) => {
  try {
    const resp = await axios.get(url, {
      responseType: "blob",
    });
    const content = await resp.data.text();
    const contentType = resp.headers["content-type"];
    return { content, contentType };
  } catch (e) {
    return {
      content: `Failed to fetch ${url}: ${e}`,
      contentType: "",
    };
  }
};
