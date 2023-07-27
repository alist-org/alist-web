import { Flex, Grid, VStack } from "@hope-ui/solid"
import { For, Show, createMemo } from "solid-js"
import { ImageItem } from "./ImageItem"
import { local, objStore } from "~/store"
import { GridItem } from "./GridItem"

const ImageLayout = () => {
  const folders = createMemo(() => (
    <Grid
      w="$full"
      gap="$1"
      templateColumns="repeat(auto-fill, minmax(100px,1fr))"
      class="image-folders"
    >
      <For each={objStore.objs.filter((obj) => obj.is_dir)}>
        {(obj, i) => {
          return <GridItem obj={obj} index={i()} />
        }}
      </For>
    </Grid>
  ))
  return (
    <VStack spacing="$2" w="$full">
      <Show when={local["show_folder_in_image_view"] === "top"}>
        {folders()}
      </Show>
      <Flex w="$full" gap="$1" flexWrap="wrap" class="image-images">
        <For each={objStore.objs}>
          {(obj, i) => {
            return <ImageItem obj={obj} index={i()} />
          }}
        </For>
      </Flex>
      <Show when={local["show_folder_in_image_view"] === "bottom"}>
        {folders()}
      </Show>
    </VStack>
  )
}

export default ImageLayout
