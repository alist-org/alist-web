import axios, { Canceler } from "axios"
import {
  appendObjs,
  password,
  ObjStore,
  State,
  getPagination,
  objStore,
  recoverScroll,
} from "~/store"
import {
  fsGet,
  fsList,
  handleRespWithoutNotify,
  log,
  notify,
  pathJoin,
} from "~/utils"
import { useFetch } from "./useFetch"
import { useRouter } from "./useRouter"

let cancelList: Canceler
export function addOrUpdateQuery(
  key: string,
  value: any,
  type = "replaceState",
) {
  let url = type === "location" ? location.href : location.hash

  if (!url.includes("?")) {
    url = `${url}?${key}=${value}`
  } else {
    if (!url.includes(key)) {
      url = `${url}&${key}=${value}`
    } else {
      const re = `(\\?|&|\#)${key}([^&|^#]*)(&|$|#)`
      url = url.replace(new RegExp(re), "$1" + key + "=" + value + "$3")
    }
  }

  if (type === "location") {
    location.href = url
  }

  if (type === "pushState") {
    history.pushState({}, "", url)
  }

  if (type === "replaceState") {
    history.replaceState({}, "", url)
  }
}
function getQueryVariable(name: string): string {
  var query = window.location.search.substring(1)
  var vars = query.split("&")
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=")
    if (pair[0] == name) {
      return pair[1]
    }
  }
  return ""
}
const IsDirRecord: Record<string, boolean> = {}
let globalPage = 1
export const getGlobalPage = () => {
  return globalPage
}
export const resetGlobalPage = () => {
  const pagination = getPagination()
  globalPage = 1
  if (pagination.type === "pagination") {
    addOrUpdateQuery("page", 1)
  }
  console.log("resetGlobalPage", globalPage)
}
export const usePath = () => {
  const { pathname } = useRouter()
  const [, getObj] = useFetch((path: string) => fsGet(path, password()))
  const pagination = getPagination()
  if (pagination.type === "pagination" && getQueryVariable("page")) {
    globalPage = parseInt(getQueryVariable("page"))
  }
  const [, getObjs] = useFetch(
    (arg?: {
      path: string
      index?: number
      size?: number
      force?: boolean
    }) => {
      const page = {
        index: arg?.index,
        size: arg?.size,
      }
      // setSearchParams(page);
      return fsList(
        arg?.path,
        password(),
        page.index,
        page.size,
        arg?.force,
        new axios.CancelToken(function executor(c) {
          cancelList = c
        }),
      )
    },
  )
  // set a path must be a dir
  const setPathAs = (path: string, dir = true, push = false) => {
    if (push) {
      path = pathJoin(pathname(), path)
    }
    if (dir) {
      IsDirRecord[path] = true
    } else {
      delete IsDirRecord[path]
    }
  }

  // record is second time password is wrong
  let retry_pass = false
  // handle pathname change
  // if confirm current path is dir, fetch List directly
  // if not, fetch get then determine if it is dir or file
  const handlePathChange = (path: string, rp?: boolean, force?: boolean) => {
    log(`handle [${path}] change`)
    cancelList?.()
    retry_pass = rp ?? false
    handleErr("")
    if (IsDirRecord[path]) {
      handleFolder(path, globalPage, undefined, undefined, force)
    } else {
      handleObj(path)
    }
  }

  // handle enter obj that don't know if it is dir or file
  const handleObj = async (path: string) => {
    ObjStore.setState(State.FetchingObj)
    const resp = await getObj(path)
    handleRespWithoutNotify(
      resp,
      (data) => {
        ObjStore.setObj(data)
        ObjStore.setProvider(data.provider)
        if (data.is_dir) {
          setPathAs(path)
          handleFolder(path, globalPage)
        } else {
          ObjStore.setReadme(data.readme)
          ObjStore.setRelated(data.related ?? [])
          ObjStore.setRawUrl(data.raw_url)
          ObjStore.setState(State.File)
        }
      },
      handleErr,
    )
  }

  // change enter a folder or turn page or load more
  const handleFolder = async (
    path: string,
    index?: number,
    size?: number,
    append = false,
    force?: boolean,
  ) => {
    if (!size) {
      size = pagination.size
    }
    if (size !== undefined && pagination.type === "all") {
      size = undefined
    }
    globalPage = index ?? 1
    ObjStore.setState(append ? State.FetchingMore : State.FetchingObjs)
    const resp = await getObjs({ path, index, size, force })
    handleRespWithoutNotify(
      resp,
      (data) => {
        if (append) {
          appendObjs(data.content)
        } else {
          ObjStore.setObjs(data.content ?? [])
          ObjStore.setTotal(data.total)
        }
        ObjStore.setReadme(data.readme)
        ObjStore.setWrite(data.write)
        ObjStore.setProvider(data.provider)
        ObjStore.setState(State.Folder)
        if (!(append && (index ?? 1) > 1)) {
          recoverScroll(path)
        }
      },
      handleErr,
    )
  }

  const handleErr = (msg: string, code?: number) => {
    if (code === 403) {
      ObjStore.setState(State.NeedPassword)
      if (retry_pass) {
        notify.error(msg)
      }
    } else {
      ObjStore.setErr(msg)
    }
  }
  const pageChange = (index?: number, size?: number, append = false) => {
    handleFolder(pathname(), index, size, append)
  }
  return {
    handlePathChange: handlePathChange,
    setPathAs: setPathAs,
    refresh: (retry_pass?: boolean, force?: boolean) => {
      handlePathChange(pathname(), retry_pass, force)
    },
    pageChange: pageChange,
    loadMore: () => {
      pageChange(globalPage + 1, undefined, true)
    },
    allLoaded: () => globalPage >= Math.ceil(objStore.total / pagination.size),
  }
}
