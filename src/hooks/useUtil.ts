import copy from "copy-to-clipboard"
import { createResource } from "solid-js"
import { getHideFiles, objStore } from "~/store"
import { Obj } from "~/types"
import { decodeText, fetchText, notify, pathJoin } from "~/utils"
import { useT, useLink, useRouter } from "."

export const useUtil = () => {
  const t = useT()
  const { pathname } = useRouter()
  return {
    copy: (text: string) => {
      copy(text)
      notify.success(t("global.copied"))
    },
    isHide: (obj: Obj) => {
      const hideFiles = getHideFiles()
      for (const reg of hideFiles) {
        if (reg.test(pathJoin(pathname(), obj.name))) {
          return true
        }
      }
      return false
    },
  }
}

export function useFetchText() {
  const { proxyLink } = useLink()
  const fetchContent = async () => {
    return fetchText(proxyLink(objStore.obj, true))
  }
  return createResource("", fetchContent)
}

export function useParseText(data?: string | ArrayBuffer) {
  const isString = typeof data === "string"
  const text = (encoding = "utf-8") => {
    if (!data) {
      return ""
    }
    if (isString) {
      return data as string
    }
    return decodeText(data as ArrayBuffer, encoding)
  }
  return {
    isString,
    text,
  }
}
