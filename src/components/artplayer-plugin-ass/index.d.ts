import type Artplayer from "artplayer"
import type SubtitlesOctopus from "libass-wasm"
import { type Options } from "libass-wasm"

export = artplayerPluginAss
export as namespace artplayerPluginAss
type Ass = {
  name: "artplayerPluginAss"
  instance: SubtitlesOctopus
}

declare const artplayerPluginAss: (options: Options) => (art: Artplayer) => Ass
