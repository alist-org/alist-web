import SubtitlesOctopus from "libass-wasm"
import workerUrl from "libass-wasm/dist/js/subtitles-octopus-worker.js?url"
import wasmUrl from "libass-wasm/dist/js/subtitles-octopus-worker.wasm?url"

import TimesNewRomanFont from "./fonts/TimesNewRoman.ttf?url"
import fallbackFont from "./fonts/SourceHanSansCN-Bold.woff2?url"

let instance = null

function isAbsoluteUrl(url) {
  return /^https?:\/\//.test(url)
}

function toAbsoluteUrl(url) {
  if (isAbsoluteUrl(url)) return url

  // handle absolute URL when the `Worker` of `BLOB` type loading network resources
  return new URL(url, document.baseURI).toString()
}

function loadWorker({ workerUrl, wasmUrl }) {
  return new Promise((resolve) => {
    fetch(workerUrl)
      .then((res) => res.text())
      .then((text) => {
        let workerScriptContent = text

        workerScriptContent = workerScriptContent.replace(
          /wasmBinaryFile\s*=\s*"(subtitles-octopus-worker\.wasm)"/g,
          (_match, wasm) => {
            if (!wasmUrl) {
              wasmUrl = new URL(wasm, toAbsoluteUrl(workerUrl)).toString()
            } else {
              wasmUrl = toAbsoluteUrl(wasmUrl)
            }

            return `wasmBinaryFile = "${wasmUrl}"`
          },
        )

        const workerBlob = new Blob([workerScriptContent], {
          type: "text/javascript",
        })
        resolve(URL.createObjectURL(workerBlob))
      })
  })
}

function setVisible(visible) {
  if (instance.canvasParent)
    instance.canvasParent.style.display = visible ? "block" : "none"
}

function artplayerPluginAss(options) {
  return async (art) => {
    instance = new SubtitlesOctopus({
      // TODO: load available fonts from manage panel
      availableFonts: {
        "times new roman": toAbsoluteUrl(TimesNewRomanFont),
      },
      workerUrl: await loadWorker({ workerUrl, wasmUrl }),
      fallbackFont: toAbsoluteUrl(fallbackFont),
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
