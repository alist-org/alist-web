import { Box } from "@hope-ui/solid"
import { onCleanup, onMount } from "solid-js"
import { useRouter, useLink } from "~/hooks"
import { getSettingBool, objStore } from "~/store"
import { ObjType } from "~/types"
import { ext } from "~/utils"
import Artplayer from "artplayer"
import { type Option } from "artplayer/types/option"
import artplayerPluginDanmuku from "artplayer-plugin-danmuku"
import flvjs from "flv.js"
import Hls from "hls.js"
import { currentLang } from "~/app/i18n"
import { VideoBox } from "./video_box"

const Preview = () => {
  const { replace } = useRouter()
  const { proxyLink } = useLink()
  let videos = objStore.objs.filter((obj) => obj.type === ObjType.VIDEO)
  if (videos.length === 0) {
    videos = [objStore.obj]
  }
  let player: Artplayer
  let option: Option = {
    id: "player",
    container: "#video-player",
    url: objStore.raw_url,
    title: objStore.obj.name,
    volume: 0.5,
    autoplay: getSettingBool("video_autoplay"),
    autoSize: false,
    autoMini: true,
    loop: false,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    setting: true,
    hotkey: true,
    pip: true,
    mutex: true,
    fullscreen: true,
    fullscreenWeb: true,
    subtitleOffset: true,
    miniProgressBar: false,
    playsInline: true,
    // layers: [],
    // settings: [],
    // contextmenu: [],
    // controls: [],
    quality: [],
    // highlight: [],
    plugins: [],
    whitelist: [],
    // subtitle:{}
    moreVideoAttr: {
      // @ts-ignore
      "webkit-playsinline": true,
      playsInline: true,
    },
    type: ext(objStore.obj.name),
    customType: {
      flv: function (video: HTMLMediaElement, url: string) {
        const flvPlayer = flvjs.createPlayer(
          {
            type: "flv",
            url: url,
          },
          { referrerPolicy: "same-origin" }
        )
        flvPlayer.attachMediaElement(video)
        flvPlayer.load()
      },
      m3u8: function (video: HTMLMediaElement, url: string) {
        const hls = new Hls()
        hls.loadSource(url)
        hls.attachMedia(video)
        if (!video.src) {
          video.src = url
        }
      },
    },
    lang: ["en", "zh-cn", "zh-tw"].includes(currentLang().toLowerCase())
      ? (currentLang().toLowerCase() as any)
      : "en",
    lock: true,
    fastForward: true,
    autoPlayback: true,
    autoOrientation: true,
    airplay: true,
  }
  const subtitle = objStore.related.find((obj) => {
    for (const ext of [".srt", ".ass", ".vtt"]) {
      if (obj.name.endsWith(ext)) {
        return true
      }
    }
    return false
  })
  const danmu = objStore.related.find((obj) => {
    for (const ext of [".xml"]) {
      if (obj.name.endsWith(ext)) {
        return true
      }
    }
    return false
  })
  if (subtitle) {
    option.subtitle = {
      url: proxyLink(subtitle, true),
      type: ext(subtitle.name) as any,
    }
  }
  if (danmu) {
    option.plugins = [
      artplayerPluginDanmuku({
        danmuku: proxyLink(danmu, true),
        speed: 5,
        opacity: 1,
        fontSize: 25,
        color: "#FFFFFF",
        mode: 0,
        margin: [0, "0%"],
        antiOverlap: false,
        useWorker: true,
        synchronousPlayback: false,
        lockTime: 5,
        maxLength: 100,
        minWidth: 200,
        maxWidth: 400,
        theme: "dark",
      }),
    ]
  }
  onMount(() => {
    player = new Artplayer(option)
    player.on("video:ended", () => {
      const index = videos.findIndex((f) => f.name === objStore.obj.name)
      if (index < videos.length - 1) {
        replace(videos[index + 1].name)
      }
    })
  })
  onCleanup(() => {
    player?.destroy()
  })
  return (
    <VideoBox>
      <Box w="$full" h="60vh" id="video-player" />
    </VideoBox>
  )
}

export default Preview
