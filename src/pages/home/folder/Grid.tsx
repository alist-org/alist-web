import { Grid } from "@hope-ui/solid"
import { For } from "solid-js"
import { GridItem } from "./GridItem"
import "lightgallery/css/lightgallery-bundle.css"
import { local, objStore, sortObjs } from "~/store"
import { useSelectWithMouse } from "./helper"

const GridLayout = () => {
  const { isMouseSupported, registerSelectContainer, captureContentMenu } =
    useSelectWithMouse()
  registerSelectContainer()
  // specify a default sort that make folders always come before files
  sortObjs("name", false)
  return (
    <Grid
      oncapture:contextmenu={captureContentMenu}
      classList={{ "viselect-container": isMouseSupported() }}
      w="$full"
      gap="$1"
      templateColumns={`repeat(auto-fill, minmax(${
        parseInt(local["grid_item_size"]) + 20
      }px,1fr))`}
    >
      <For each={objStore.objs}>
        {(obj, i) => {
          return <GridItem obj={obj} index={i()} />
        }}
      </For>
    </Grid>
  )
}

export default GridLayout
