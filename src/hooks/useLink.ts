import { objStore, selectedObjs, State, me } from "~/store"
import { Obj } from "~/types"
import { api, encodePath, pathDir, pathJoin, standardizePath } from "~/utils"
import { useRouter, useUtil } from "."

type URLType = "preview" | "direct" | "proxy"

// get download url by dir and obj
export const getLinkByDirAndObj = (
  dir: string,
  obj: Obj,
  type: URLType = "direct",
  encodeAll?: boolean
) => {
  if (type !== "preview") {
    dir = pathJoin(me().base_path, dir)
  }
  dir = standardizePath(dir, true)
  let path = `${dir}/${obj.name}`
  path = encodePath(path, encodeAll)
  let host = api
  let prefix = type === "direct" ? "/d" : "/p"
  if (type === "preview") {
    prefix = ""
    if (!api.startsWith(location.origin)) host = location.origin
  }
  let ans = `${host}${prefix}${path}`
  if (type !== "preview" && obj.sign) {
    ans += `?sign=${obj.sign}`
  }
  return ans
}

// get download link by current state and pathname
export const useLink = () => {
  const { pathname } = useRouter()
  const getLinkByObj = (obj: Obj, type?: URLType, encodeAll?: boolean) => {
    const dir = objStore.state !== State.File ? pathname() : pathDir(pathname())
    return getLinkByDirAndObj(dir, obj, type, encodeAll)
  }
  const rawLink = (obj: Obj, encodeAll?: boolean) => {
    return getLinkByObj(obj, "direct", encodeAll)
  }
  return {
    getLinkByObj: getLinkByObj,
    rawLink: rawLink,
    proxyLink: (obj: Obj, encodeAll?: boolean) => {
      return getLinkByObj(obj, "proxy", encodeAll)
    },
    previewPage: (obj: Obj, encodeAll?: boolean) => {
      return getLinkByObj(obj, "preview", encodeAll)
    },
    currentObjLink: (encodeAll?: boolean) => {
      return rawLink(objStore.obj, encodeAll)
    },
  }
}

export const useSelectedLink = () => {
  const ridUrlParam = (url:any,aParam:any)=>{
    //var url= nurl.replace(/\&amp;/g,"&");
      aParam.forEach((item:any) => {
        const fromindex = url.indexOf(`${item}=`) //必须加=号，避免参数值中包含item字符串
        if (fromindex !== -1) {
          // 通过url特殊符号，计算出=号后面的的字符数，用于生成replace正则
          const startIndex = url.indexOf('=', fromindex)
          const endIndex = url.indexOf('&', fromindex)
          const hashIndex = url.indexOf('#', fromindex)
          
          let reg;
          if (endIndex !== -1) { // 后面还有search参数的情况
            const num = endIndex - startIndex
            reg = new RegExp(`${item}=.{${num}}`)
            url = url.replace(reg, '')
          } else if (hashIndex !== -1) { // 有hash参数的情况
            const num = hashIndex - startIndex - 1
            reg = new RegExp(`&?${item}=.{${num}}`)
            url = url.replace(reg, '')
          } else { // search参数在最后或只有一个参数的情况
            reg = new RegExp(`&?${item}=.+`)
            url = url.replace(reg, '')
          }
        }
      });
      const noSearchParam = url.indexOf('=') 
      if( noSearchParam === -1 ){
        url = url.replace(/\?/, '') // 如果已经没有参数，删除？号
      }
      return url    
  }
  const timeLink2 = (obj: Obj) => {
    if(obj.link2.indexOf('exp=')){
      return  ridUrlParam(obj.link2,['time','exp'])
    }
    return obj.link2
  }
  const { previewPage, rawLink: rawUrl } = useLink()
  const rawLinks = (encodeAll?: boolean) => {
    return selectedObjs()
      .filter((obj) => !obj.is_dir)
      .map((obj) => rawUrl(obj, encodeAll))
  }
  return {
    rawLinks: rawLinks,
    previewPagesText: () => {
      return selectedObjs()
        .map((obj) => previewPage(obj, true))
        .join("\n")
    },
    rawLinksText: (encodeAll?: boolean) => {
      return rawLinks(encodeAll).join("\n")
    },
    link2Text: () => {
      return selectedObjs()
      .map((obj) => timeLink2(obj))
      .join("\n")
    },
  }
}

export const useCopyLink = () => {
  const { copy } = useUtil()
  const { previewPagesText, rawLinksText ,link2Text} = useSelectedLink()
  const { currentObjLink } = useLink()
  return {
    copySelectedPreviewPage: () => {
      copy(previewPagesText())
    },
    copySelectedRawLink: (encodeAll?: boolean) => {
      copy(rawLinksText(encodeAll))
    },
    copySelectedLink2: () => {
      copy(link2Text())
    },
    copyCurrentRawLink: (encodeAll?: boolean) => {
      copy(currentObjLink(encodeAll))
    },
  }
}
