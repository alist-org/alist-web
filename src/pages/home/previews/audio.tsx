import "aplayer/dist/APlayer.min.css"
import "./audio.css"
import APlayer from "aplayer"
import { Box } from "@hope-ui/solid"
import { onCleanup, onMount } from "solid-js"
import { useLink } from "~/hooks"
import { getSetting, getSettingBool, objStore } from "~/store"
import { ObjType, StoreObj } from "~/types"
import { baseName } from "~/utils"

const Preview = () => {
  const { proxyLink, rawLink } = useLink()
  let audios = objStore.objs.filter((obj) => obj.type === ObjType.AUDIO)
  if (audios.length === 0) {
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
    return {
      name: obj.name,
      artist: "Unknown",
      url: rawLink(obj, true),
      cover:
        getSetting("audio_cover") ||
        "https://jsd.nn.ci/gh/alist-org/logo@main/logo.svg",
      lrc: lrc,
    }
  }
  onMount(() => {
    ap = new APlayer({
      container: document.querySelector("#audio-player"),
      mini: false,
      autoplay: getSettingBool("audio_autoplay"),
      loop: "all",
      order: "random",
      preload: "auto",
      volume: 0.7,
      mutex: true,
      listFolded: false,
      lrcType: 3,
      audio: audios.map(objToAudio),
    })
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
