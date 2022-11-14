import { log } from "~/utils"

export const ScrollMap = new Map<string, number>()

export const recordScroll = (path: string, scroll: number) => {
  ScrollMap.set(path, scroll)
  log("recordScroll", path, scroll)
}

export const recoverScroll = (path: string) => {
  window.scroll({
    top: ScrollMap.get(path) || 0,
    behavior: "smooth",
  })
  log("recoverScroll", path, ScrollMap.get(path))
}
