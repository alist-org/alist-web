import "aplayer/dist/APlayer.min.css"
import "./audio.css"
import APlayer from "aplayer"
import { Box } from "@hope-ui/solid"
import { onCleanup, onMount } from "solid-js"
import { useLink, useRouter } from "~/hooks"
import { getSetting, getSettingBool, objStore } from "~/store"
import { ObjType, StoreObj } from "~/types"
import { baseName, fsGet } from "~/utils"

const Preview = () => {
  const { proxyLink, rawLink, previewPage } = useLink()
  const { searchParams } = useRouter()
  let audios = objStore.objs.filter((obj) => obj.type === ObjType.AUDIO)
  if (audios.length === 0 || searchParams["from"] === "search") {
    audios = [objStore.obj]
  }
  let ap: any
  const objToAudio = (obj: StoreObj) => {
    let lrc = undefined
    const lrcObj = objStore.objs.find((o) => {
      return baseName(o.name) === baseName(obj.name) && o.name.endsWith(".lrc")
    })
    if (lrcObj) {
      lrc = proxyLink(lrcObj, true)
    }
    const audio = {
      name: obj.name,
      artist: "Unknown",
      url: rawLink(obj, true),
      cover:
        obj.thumb ||
        getSetting("audio_cover") ||
        "https://jsd.nn.ci/gh/alist-org/logo@main/logo.svg",
      lrc: lrc,
    }
    if (objStore.provider === "NeteaseMusic") {
      const matched = obj.name.match(/((.+)\s-\s)?(.+)\.(mp3|flac)/)
      audio.artist = matched?.[2] || "Unknown"
      audio.name = matched?.[3] || obj.name
      const lrcURL = new URL(previewPage(obj).replace(/\.(mp3|flac)/, ".lrc"))
      audio.lrc = decodeURIComponent(lrcURL.pathname)
    }
    return audio
  }
  onMount(() => {
    ap = new APlayer({
      container: document.querySelector("#audio-player"),
      mini: false,
      autoplay: getSettingBool("audio_autoplay"),
      loop: "all",
      order: "list",
      preload: "auto",
      volume: 0.7,
      mutex: true,
      listFolded: false,
      lrcType: objStore.provider === "NeteaseMusic" ? 1 : 3,
      audio: audios.map(objToAudio),
    })
    if (objStore.provider === "NeteaseMusic") {
      ap.on("loadstart", () => {
        const i = ap.list.index
        if (!ap.list.audios[i].lrc) return
        const lrcURL = ap.list.audios[i].lrc
        fsGet(lrcURL).then((resp) => {
          ap.lrc.async = true
          ap.lrc.parsed[i] = undefined
          ap.list.audios[i].lrc = resp.data.raw_url
          ap.lrc.switch(i) // fetch lrc into `parsed`
          ap.list.audios[i].lrc = ""
          ap.lrc.async = false
        })
      })
    }
    const curIndex = audios.findIndex((obj) => obj.name === objStore.obj.name)
    if (curIndex !== -1) {
      ap.list.switch(curIndex)
    }
  })
  onCleanup(() => {
    ap?.destroy()
  })
  return <Box w="$full" id="audio-player" />
}

export default Preview
