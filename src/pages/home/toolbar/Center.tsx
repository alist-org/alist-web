import { HStack } from "@hope-ui/solid";
import { Show } from "solid-js";
import { checkboxOpen, haveSelected } from "~/store";
import { CenterIcon } from "./Icon";
import { CgRename, CgMoveRight } from "solid-icons/cg";
import { RiSystemDeleteBinLine } from "solid-icons/ri";
import { TbCopy } from "solid-icons/tb";

const Rename = () => {
  return <CenterIcon tip="rename" as={CgRename} />;
};

const Delete = () => {
  return <CenterIcon tip="delete" as={RiSystemDeleteBinLine} />;
};

const Move = () => {
  return <CenterIcon tip="move" as={CgMoveRight} />;
};

const Copy = () => {
  return <CenterIcon tip="copy" as={TbCopy} />;
};

export const Center = () => {
  return (
    <Show when={checkboxOpen() && haveSelected()}>
      <HStack
        class="center-toolbar"
        pos="fixed"
        bottom="$4"
        left="50%"
        transform="translateX(-50%)"
        css={{
          backdropFilter: "blur(8px)",
        }}
        // shadow="$md"
        rounded="$lg"
        // border="1px solid $neutral4"
        p="$2"
        // color="$neutral12"
        // bgColor="$neutral2"
        color="white"
        bgColor="#000000d0"
        spacing="$1"
      >
        <Rename />
        <Move />
        <Copy />
        <Delete />
      </HStack>
    </Show>
  );
};
