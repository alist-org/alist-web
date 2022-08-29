import { Grid } from "@hope-ui/solid";
import { createEffect, createMemo, For, onCleanup } from "solid-js";
import { useLink } from "~/hooks";
import { objStore } from "~/store";
import { ObjType } from "~/types";
import { bus } from "~/utils";
import { GridItem } from "./GridItem";
import lightGallery from "lightgallery";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgRotate from "lightgallery/plugins/rotate";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import "lightgallery/css/lightgallery-bundle.css";
import { LightGallery } from "lightgallery/lightgallery";

const GridLayout = () => {
  const { rawLink } = useLink();
  const images = createMemo(() =>
    objStore.objs.filter((obj) => obj.type === ObjType.IMAGE)
  );
  let dynamicGallery: LightGallery | undefined;
  createEffect(() => {
    dynamicGallery?.destroy();
    if (images().length > 0) {
      dynamicGallery = lightGallery(document.createElement("div"), {
        dynamic: true,
        thumbnail: true,
        plugins: [lgZoom, lgThumbnail, lgRotate, lgAutoplay, lgFullscreen],
        dynamicEl: images().map((obj) => {
          const raw = rawLink(obj, true);
          return {
            src: raw,
            thumb: obj.thumb === "" ? raw : obj.thumb,
            subHtml: `<h4>${obj.name}</h4>`,
          };
        }),
      });
    }
  });
  bus.on("gallery", (name) => {
    dynamicGallery?.openGallery(images().findIndex((obj) => obj.name === name));
  });
  onCleanup(() => {
    bus.off("gallery");
    dynamicGallery?.destroy();
  });
  return (
    <Grid
      w="$full"
      gap="$1"
      templateColumns="repeat(auto-fill, minmax(100px,1fr))"
    >
      <For each={objStore.objs}>
        {(obj, i) => {
          return <GridItem obj={obj} index={i()} />;
        }}
      </For>
    </Grid>
  );
};

export default GridLayout;
