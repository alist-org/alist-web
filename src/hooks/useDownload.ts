import axios from "axios"
import {
  local,
  password,
  selectedObjs as _selectedObjs,
  selectedObjs,
} from "~/store"
import { fsList, notify, pathJoin } from "~/utils"
import { getLinkByDirAndObj, useRouter, useT } from "~/hooks"
import { useSelectedLink } from "~/hooks"
import { Obj } from "~/types"
import { createSignal, For, Show } from "solid-js"

let totalSize = 0
interface File {
  path: string
  dir: string
  url: string
  name: string
}

export const useDownload = () => {
  const { rawLinks } = useSelectedLink()
  const t = useT()
  const { pathname } = useRouter()
  return {
    batchDownloadSelected: () => {
      const urls = rawLinks(true)
      urls.forEach((url) => {
        window.open(url, "_blank")
      })
    },
    sendToAria2: async () => {
      const selectedObjs = _selectedObjs()
      const [cur, setCur] = createSignal(
        t("home.package_download.initializing")
      )
      // 0: init
      // 1: error
      // 2: fetching structure
      // 3: fetching files
      // 4: success
      const [status, setStatus] = createSignal(0)
      const fetchFolderStructure = async (
        pre: string,
        obj: Obj
      ): Promise<File[] | string> => {
        if (!obj.is_dir) {
          totalSize += obj.size
          return [
            {
              path: pathJoin(pre, obj.name),
              dir: pre,
              url: getLinkByDirAndObj(
                pathJoin(pathname(), pre),
                obj,
                "direct",
                true
              ),
              name: obj.name,
            },
          ]
        } else {
          const resp = await fsList(
            pathJoin(pathname(), pre, obj.name),
            password()
          )
          if (resp.code !== 200) {
            return resp.message
          }
          const res: File[] = []
          for (const _obj of resp.data.content ?? []) {
            const _res = await fetchFolderStructure(
              pathJoin(pre, obj.name),
              _obj
            )
            if (typeof _res === "string") {
              return _res
            } else {
              res.push(..._res)
            }
          }
          return res
        }
      }
      const { aria2_rpc_url, aria2_rpc_secret, aria2_dir } = local
      if (!aria2_rpc_url) {
        notify.warning(t("home.toolbar.aria2_not_set"))
        return
      }
      try {
        function isEmpty(value: any) {
          return value === undefined || value === null || value === ""
        }
        function isNullOrUndefined(value: any) {
          return value === undefined || value === null
        }
        for (const obj of selectedObjs) {
          setCur(t("home.package_download.fetching_struct"))
          setStatus(2)
          const res = await fetchFolderStructure("", obj)
          let save_dir: string =
            aria2_dir === undefined || aria2_dir === null || aria2_dir === ""
              ? "/downloads/alist"
              : aria2_dir
          save_dir = save_dir.endsWith("/") ? save_dir.slice(0, -1) : save_dir

          if (typeof res !== "object" || res.length === undefined) {
            notify.error(
              `${t("home.package_download.fetching_struct_failed")}: ${res}`
            )
            return res
          } else {
            for (let key = 0; key < res.length; key++) {
              if (
                isEmpty(res[key].path) ||
                isNullOrUndefined(res[key].dir) ||
                isEmpty(res[key].url) ||
                isEmpty(res[key].name)
              ) {
                notify.error(
                  `${t(
                    "home.package_download.fetching_struct_failed"
                  )}: ${JSON.stringify(res[key])}`
                )
                continue
              }
              const resp = await axios.post(aria2_rpc_url, {
                id: Math.random().toString(),
                jsonrpc: "2.0",
                method: "aria2.addUri",
                params: [
                  "token:" + aria2_rpc_secret ?? "",
                  [res[key].url],
                  {
                    out: res[key].name,
                    dir: aria2_dir + res[key].dir,
                    "check-certificate": "false",
                  },
                ],
              })
              console.log(resp)
            }
          }
        }
        notify.success(t("home.toolbar.send_aria2_success"))
      } catch (e) {
        console.error(e)
        notify.error(`failed to send to aria2: ${e}`)
      }
    },
  }
}
