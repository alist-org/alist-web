import {
  lazy,
  Show,
  createEffect,
  createMemo,
  onCleanup,
  Switch,
  Match,
} from "solid-js"
import { layout } from "~/store"
import { ContextMenu } from "./context-menu"
import { Pager } from "./Pager"
import { useLink, useT } from "~/hooks"
import { objStore } from "~/store"
import { ObjType } from "~/types"
import { bus } from "~/utils"
import lightGallery from "lightgallery"
import lgThumbnail from "lightgallery/plugins/thumbnail"
import lgZoom from "lightgallery/plugins/zoom"
import lgRotate from "lightgallery/plugins/rotate"
import lgAutoplay from "lightgallery/plugins/autoplay"
import lgFullscreen from "lightgallery/plugins/fullscreen"
import "lightgallery/css/lightgallery-bundle.css"
import { LightGallery } from "lightgallery/lightgallery"
import { Search } from "./Search"
import { Heading } from "@hope-ui/solid"

const ListLayout = lazy(() => import("./List"))
const GridLayout = lazy(() => import("./Grid"))
const ImageLayout = lazy(() => import("./Images"))

const Folder = () => {
  const { rawLink } = useLink()
  const images = createMemo(() =>
    objStore.objs.filter((obj) => obj.type === ObjType.IMAGE)
  )
  let dynamicGallery: LightGallery | undefined
  createEffect(() => {
    dynamicGallery?.destroy()
    if (images().length > 0) {
      dynamicGallery = lightGallery(document.createElement("div"), {
        dynamic: true,
        thumbnail: true,
        plugins: [lgZoom, lgThumbnail, lgRotate, lgAutoplay, lgFullscreen],
        dynamicEl: images().map((obj) => {
          const raw = rawLink(obj, true)
          return {
            src: raw,
            thumb: obj.thumb === "" ? raw : obj.thumb,
            subHtml: `<h4>${obj.name}</h4>`,
          }
        }),
      })
    }
  })
  bus.on("gallery", (name) => {
    dynamicGallery?.openGallery(images().findIndex((obj) => obj.name === name))
  })
  onCleanup(() => {
    bus.off("gallery")
    dynamicGallery?.destroy()
  })
  const t = useT()
  return (
    <>
      <Switch>
        <Match when={layout() === "list"}>
          <ListLayout />
        </Match>
        <Match when={layout() === "grid"}>
          <GridLayout />
        </Match>
        <Match when={layout() === "image"}>
          <Show
            when={images().length > 0}
            fallback={<Heading m="$2">{t("home.no_images")}</Heading>}
          >
            <ImageLayout />
          </Show>
        </Match>
      </Switch>
      <Pager />
      <Search />
      <ContextMenu />
    </>
  )
}

export default Folder
