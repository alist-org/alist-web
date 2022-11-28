import axios, { CancelToken } from "axios"
import {
  PEmptyResp,
  FsGetResp,
  FsListResp,
  Obj,
  PResp,
  FsSearchResp,
} from "~/types"
import { r } from "."

export const fsGet = (
  path: string = "/",
  password = ""
): Promise<FsGetResp> => {
  return r.post("/fs/get", {
    path: path,
    password: password,
  })
}
export const fsList = (
  path: string = "/",
  password = "",
  page = 1,
  per_page = 0,
  refresh = false,
  cancelToken?: CancelToken
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
  )
}

export const fsDirs = (
  path = "/",
  password = "",
  forceRoot = false
): PResp<Obj[]> => {
  return r.post("/fs/dirs", { path, password, force_root: forceRoot })
}

export const fsMkdir = (path: string): PEmptyResp => {
  return r.post("/fs/mkdir", { path })
}

export const fsRename = (path: string, name: string): PEmptyResp => {
  return r.post("/fs/rename", { path, name })
}

export const fsMove = (
  src_dir: string,
  dst_dir: string,
  names: string[]
): PEmptyResp => {
  return r.post("/fs/move", { src_dir, dst_dir, names })
}

export const fsCopy = (
  src_dir: string,
  dst_dir: string,
  names: string[]
): PEmptyResp => {
  return r.post("/fs/copy", { src_dir, dst_dir, names })
}

export const fsRemove = (dir: string, names: string[]): PEmptyResp => {
  return r.post("/fs/remove", { dir, names })
}

export const fsNewFile = (path: string, password: string): PEmptyResp => {
  return r.put("/fs/put", undefined, {
    headers: {
      "File-Path": encodeURIComponent(path),
      Password: password,
    },
  })
}

export const addAria2 = (path: string, urls: string[]): PEmptyResp => {
  return r.post("/fs/add_aria2", { path, urls })
}

export const fetchText = async (
  url: string,
  ts = true
): Promise<{
  content: string
  contentType?: string
}> => {
  try {
    const resp = await axios.get(url, {
      responseType: "blob",
      params: ts
        ? {
            ts: new Date().getTime(),
          }
        : undefined,
    })
    const content = await resp.data.text()
    const contentType = resp.headers["content-type"]
    return { content, contentType }
  } catch (e) {
    return ts
      ? await fetchText(url, false)
      : {
          content: `Failed to fetch ${url}: ${e}`,
          contentType: "",
        }
  }
}

export const fsSearch = async (
  parent: string,
  keywords: string,
  page = 1,
  per_page = 100
): Promise<FsSearchResp> => {
  return r.post("/fs/search", {
    parent,
    keywords,
    page,
    per_page,
  })
}

export const buildIndex = async (
  paths = ["/"],
  max_depth = -1,
  ignore_paths = []
): PEmptyResp => {
  return r.post("/admin/index/build", {
    paths,
    max_depth,
    ignore_paths,
  })
}
