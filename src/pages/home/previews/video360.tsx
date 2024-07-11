import { Box } from "@hope-ui/solid"
import { VideoBox } from "./video_box"
import { createSignal, onCleanup, onMount } from "solid-js"
import { getSettingBool, objStore } from "~/store"
import { ObjType } from "~/types"
import View360, { ControlBar, EquirectProjection } from "@egjs/view360"
import "@egjs/view360/css/view360.min.css"
import "./video360.css"

const Preview = () => {
  let videos = objStore.objs.filter((obj) => obj.type === ObjType.VIDEO)
  if (videos.length === 0) {
    videos = [objStore.obj]
  }

  let viewer: View360

  onMount(() => {
    const container = document.getElementById("view360-container")
    const video = document.getElementById("view360-video")

    if (container && video) {
      viewer = new View360(container, {
        projection: new EquirectProjection({
          src: video,
          video: {
            autoplay: getSettingBool("video_autoplay"),
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
    }
  })

  onCleanup(() => viewer?.destroy())

  const [autoNext, setAutoNext] = createSignal(false)

  return (
    <VideoBox onAutoNextChange={setAutoNext}>
      <Box w="$full" h="60vh" id="video360-player">
        <Box
          w={"100%"}
          h={"100%"}
          id="view360-container"
          className="view360-container"
        >
          <canvas class="view360-canvas" />
          <video
            src={objStore.raw_url}
            id="view360-video"
            playsinline
            crossOrigin="anonymous"
            style="display: none;"
          />
        </Box>
      </Box>
    </VideoBox>
  )
}

export default Preview
