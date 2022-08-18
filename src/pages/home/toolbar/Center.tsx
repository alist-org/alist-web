import { HStack, useColorModeValue } from "@hope-ui/solid";
import { createEffect, createMemo, Show } from "solid-js";
import { checkboxOpen, haveSelected } from "~/store";
import { createAnimation } from "motion-signals";
import { Copy, Move } from "./CopyMove";
import { Delete } from "./Delete";
import { Rename } from "./Rename";
import { CopyURL } from "./CopyUrl";

export const Center = () => {
  const { replay } = createAnimation(
    ".center-toolbar",
    {
      opacity: [0, 1],
      scale: [0.9, 1],
      y: [10, 0],
      x: ["-50%", "-50%"],
    },
    {
      duration: 0.2,
    }
  );
  const show = createMemo(() => checkboxOpen() && haveSelected());
  createEffect((pre) => {
    if (!pre && show()) {
      replay();
    }
    return show();
  });
  return (
    <Show when={show()}>
      <HStack
        class="center-toolbar"
        pos="fixed"
        bottom="$4"
        left="50%"
        // transform="translateX(-50%)"
        css={{
          backdropFilter: "blur(8px)",
        }}
        // shadow="$md"
        rounded="$lg"
        // border="1px solid $neutral4"
        p="$2"
        color="$neutral12"
        bgColor={useColorModeValue("$neutral3", "#000000d0")()}
        // color="white"
        // bgColor="#000000d0"
        spacing="$1"
      >
        <Rename />
        <Move />
        <Copy />
        <Delete />
        <CopyURL />
      </HStack>
    </Show>
  );
};
