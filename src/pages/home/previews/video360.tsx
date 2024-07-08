import { Box } from "@hope-ui/solid"
import { VideoBox } from "./video_box"
import { createSignal, onCleanup, onMount } from "solid-js"
import { objStore } from "~/store"
import { ObjType } from "~/types"
import View360, { ControlBar, EquirectProjection } from "@egjs/view360"
import "@egjs/view360/css/view360.min.css"

const Preview = () => {
  let videos = objStore.objs.filter((obj) => obj.type === ObjType.VIDEO)
  if (videos.length === 0) {
    videos = [objStore.obj]
  }

  let view360Instance: View360

  onMount(() => {
    const container = document.getElementById("video360-player")
    const div = document.createElement("div")
    div.style.position = "relative"
    div.style.height = "100%"
    div.style.width = "100%"

    const canvas = document.createElement("canvas")
    canvas.className = "view360-canvas"

    container?.appendChild(div)
    div.appendChild(canvas)

    view360Instance = new View360(div, {
      projection: new EquirectProjection({
        src: objStore.raw_url,
        video: {
          autoplay: false,
          muted: false,
        },
      }),
      plugins: [
        new ControlBar({
          pieView: { order: 0 },
          gyroButton: { position: "top-right", order: 1 },
          vrButton: { position: "top-right", order: 2 },
        }),
      ],
    })
  })

  onCleanup(() => {
    if (view360Instance) {
      view360Instance.destroy()
    }

    const container = document.getElementById("video360-player")
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  })

  const [autoNext, setAutoNext] = createSignal(false)

  return (
    <VideoBox onAutoNextChange={setAutoNext}>
      <Box w="$full" h="60vh" id="video360-player" />
    </VideoBox>
  )
}

export default Preview
