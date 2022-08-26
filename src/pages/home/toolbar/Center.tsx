import { HStack, useColorModeValue } from "@hope-ui/solid";
import { createEffect, createMemo, For, Show } from "solid-js";
import { checkboxOpen, haveSelected } from "~/store";
import { createAnimation } from "motion-signals";
import { CopyURL } from "./CopyURL";
import { CenterIcon } from "./Icon";
import { bus } from "~/utils";

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
        shadow="0px 10px 30px -5px rgba(0, 0, 0, 0.3)"
        rounded="$lg"
        // border="1px solid $neutral4"
        p="$2"
        color="$neutral12"
        bgColor={useColorModeValue("$neutral3", "#000000d0")()}
        // color="white"
        // bgColor="#000000d0"
        spacing="$1"
      >
        <For each={["rename", "move", "copy", "delete"]}>
          {(name) => {
            return (
              <CenterIcon
                name={name}
                onClick={() => {
                  bus.emit("tool", name);
                }}
              />
            );
          }}
        </For>
        <CopyURL />
      </HStack>
    </Show>
  );
};
