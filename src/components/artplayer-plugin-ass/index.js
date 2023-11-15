import SubtitlesOctopus from "libass-wasm"
import legacyWorkerUrl from "libass-wasm/dist/js/subtitles-octopus-worker-legacy.js?url"
import workerUrl from "libass-wasm/dist/js/subtitles-octopus-worker.js?url"

import TimesNewRomanFont from "./fonts/TimesNewRoman.ttf?url"
import fallbackFont from "./fonts/SourceHanSansCN-Bold.woff2?url"

let instance = null

function setVisible(visible) {
  if (instance.canvasParent)
    instance.canvasParent.style.display = visible ? "block" : "none"
}

function artplayerPluginAss(options) {
  return (art) => {
    instance = new SubtitlesOctopus({
      // TODO: load available fonts from manage panel
      availableFonts: {
        "times new roman": TimesNewRomanFont,
      },
      fallbackFont,
      legacyWorkerUrl,
      workerUrl,
      video: art.template.$video,
      ...options,
    })

    instance.canvasParent.className = "artplayer-plugin-ass"
    instance.canvasParent.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      user-select: none;
      pointer-events: none;
      z-index: 20;
    `
    // switch subtitle track
    art.on("artplayer-plugin-ass:switch", (subtitle) => {
      instance.freeTrack()
      instance.setTrackByUrl(subtitle)
      setVisible(true)
    })

    // set subtitle visible
    art.on("subtitle", (visible) => setVisible(visible))
    art.on("artplayer-plugin-ass:visible", (visible) => setVisible(visible))

    // set subtitle offset
    art.on("subtitleOffset", (offset) => (instance.timeOffset = offset))

    // when player destory
    art.on("destroy", () => instance.dispose())

    return {
      name: "artplayerPluginAss",
      instance: instance,
    }
  }
}

export default artplayerPluginAss
