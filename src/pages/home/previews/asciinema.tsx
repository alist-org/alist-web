import { Box } from "@hope-ui/solid"
import * as AsciinemaPlayer from "asciinema-player"
import "asciinema-player/dist/bundle/asciinema-player.css"
import { onMount } from "solid-js"
import { objStore } from "~/store"
export default function Preview() {
  let d: HTMLDivElement

  onMount(() => {
    AsciinemaPlayer.create(objStore.raw_url, d)
  })
  return <Box w="$full" ref={d!} />
}
