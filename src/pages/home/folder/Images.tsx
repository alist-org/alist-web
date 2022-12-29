import { Flex } from "@hope-ui/solid"
import { For } from "solid-js"
import { ImageItem } from "./ImageItem"
import { objStore } from "~/store"

const GridLayout = () => {
  return (
    <Flex w="$full" gap="$1" flexWrap="wrap">
      <For each={objStore.objs}>
        {(obj, i) => {
          return <ImageItem obj={obj} index={i()} />
        }}
      </For>
    </Flex>
  )
}

export default GridLayout
