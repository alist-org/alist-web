import { Box, VStack } from "@hope-ui/solid"
import { onCleanup, onMount } from "solid-js"
import { useRouter, useLink, useFetch } from "~/hooks"
import { getSettingBool, objStore, password } from "~/store"
import { ObjType, PResp } from "~/types"
import { ext, handleResp, notify, r } from "~/utils"
import Artplayer from "artplayer"
import artplayerPluginDanmuku from "artplayer-plugin-danmuku"
import Hls from "hls.js"
import { currentLang } from "~/app/i18n"
import { MaybeLoading, SelectWrapper } from "~/components"
import { isMobile } from "~/utils/compatibility"

export interface Data {
  drive_id: string
  file_id: string
  video_preview_play_info: VideoPreviewPlayInfo
}

export interface VideoPreviewPlayInfo {
  category: string
  live_transcoding_task_list: LiveTranscodingTaskList[]
  meta: Meta
}

export interface LiveTranscodingTaskList {
  stage: string
  status: string
  template_height: number
  template_id: string
  template_name: string
  template_width: number
  url: string
}

export interface Meta {
  duration: number
  height: number
  width: number
}

const Preview = () => {
  const { replace } = useRouter()
  const { proxyLink } = useLink()
  let videos = objStore.objs.filter((obj) => obj.type === ObjType.VIDEO)
  if (videos.length === 0) {
    videos = [objStore.obj]
  }
  let player: Artplayer
  let option: any = {
    id: "player",
    container: "#video-player",
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
    quality: [],
    plugins: [],
    whitelist: [],
    moreVideoAttr: {
      // @ts-ignore
      "webkit-playsinline": true,
      playsInline: true,
    },
    type: "m3u8",
    customType: {
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
  if (isMobile) {
    option.moreVideoAttr.controls = true
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
  const { pathname } = useRouter()
  const [loading, post] = useFetch(
    (): PResp<Data> =>
      r.post("/fs/other", {
        path: pathname(),
        password: password(),
        method: "video_preview",
      })
  )
  onMount(async () => {
    const resp = await post()
    handleResp(resp, (data) => {
      const list = data.video_preview_play_info.live_transcoding_task_list
      if (list.length === 0) {
        notify.error("No transcoding video found")
        return
      }
      option.url = list[list.length - 1].url
      option.quality = list.map((item, i) => {
        return {
          html: item.template_id,
          url: item.url,
          default: i === list.length - 1,
        }
      })
      player = new Artplayer(option)
      player.on("video:ended", () => {
        const index = videos.findIndex((f) => f.name === objStore.obj.name)
        if (index < videos.length - 1) {
          replace(videos[index + 1].name)
        }
      })
    })
  })
  onCleanup(() => {
    player?.destroy()
  })
  return (
    <MaybeLoading loading={loading()}>
      <VStack w="$full" spacing="$2">
        <Box w="$full" h="60vh" id="video-player" />
        <SelectWrapper
          onChange={(name: string) => {
            replace(name)
          }}
          value={objStore.obj.name}
          options={videos.map((obj) => ({ value: obj.name }))}
        />
      </VStack>
    </MaybeLoading>
  )
}

export default Preview
