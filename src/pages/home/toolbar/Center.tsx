import {
  HStack,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  useColorModeValue,
} from "@hope-ui/solid";
import { createEffect, createMemo, Show } from "solid-js";
import { checkboxOpen, haveSelected } from "~/store";
import { CenterIcon } from "./Icon";
import { CgRename } from "solid-icons/cg";
import { RiSystemDeleteBinLine } from "solid-icons/ri";
import { TbCopy } from "solid-icons/tb";
import { OcFilemoved2 } from "solid-icons/oc";
import { createAnimation } from "motion-signals";
import { useSelectedUrl, useT, useUtil } from "~/hooks";

const Rename = () => {
  return <CenterIcon tip="rename" as={CgRename} />;
};

const Delete = () => {
  return <CenterIcon tip="delete" as={RiSystemDeleteBinLine} />;
};

const Move = () => {
  return (
    <CenterIcon tip="move" p="$1_5" as={OcFilemoved2} />
    // <CenterIcon tip="move" viewBox="0 0 1024 1024" fill="currentColor">
    //   <path d="M840.704 256h-36.992c-82.624 0-82.496-128-140.864-128H311.232C245.44 128 192 181.44 192 247.296V384h64V247.296C256 216.832 280.832 192 311.232 192h339.456c3.968 6.144 9.024 15.36 12.672 22.208C684.8 253.76 720.704 320 803.712 320h36.992C869.12 320 896 351.104 896 384v392.768c0 30.4-24.832 55.232-55.296 55.232H311.232c-30.4 0-55.232-24.832-55.232-55.232V704h-64v72.768C192 842.624 245.44 896 311.232 896H840.64C906.56 896 960 842.624 960 776.768V384c0-65.856-53.44-128-119.296-128z"></path>
    //   <path d="M497.344 693.824L630.4 563.968c0.128-0.128 0.192-0.32 0.32-0.512 2.816-2.816 5.184-9.536 6.784-13.248 1.344-3.456 1.856-0.64 2.112-4.096 0-0.768 0.384-1.408 0.384-2.112 0-0.512-0.256-0.896-0.256-1.344-0.192-3.84-0.896-5.76-2.24-9.344-1.344-3.264-3.52-6.016-5.76-8.64-0.512-0.64-0.768-1.536-1.344-2.112L497.344 389.632c-12.8-12.864-33.6-6.976-46.4 5.888-12.864 12.8-12.864 33.6 0 46.464l76.864 70.976-429.632 0.064c-18.752 0-33.984 12.8-33.92 30.912-0.064 18.112 15.168 29.696 33.984 29.696h429.632l-76.864 79.552c-12.864 12.864-12.864 33.6 0 46.528 6.4 6.4 14.72 3.776 23.168 3.776s16.832-3.328 23.168-9.664z"></path>
    // </CenterIcon>
  );
};

const Copy = () => {
  return <CenterIcon tip="copy" as={TbCopy} />;
};

const CopyLink = () => {
  const t = useT();
  const { previewPage, rawUrl } = useSelectedUrl();
  const { copy } = useUtil();
  return (
    <Menu>
      <MenuTrigger as="span">
        <CenterIcon tip="copy_url" as={TbCopy} />
      </MenuTrigger>
      <MenuContent>
        <MenuItem
          onSelect={() => {
            copy(previewPage());
          }}
        >
          {t("home.toolbar.preview_page")}
        </MenuItem>
        <MenuItem
          onSelect={() => {
            copy(rawUrl());
          }}
        >
          {t("home.toolbar.down_url")}
        </MenuItem>
        <MenuItem
          onSelect={() => {
            copy(rawUrl(true));
          }}
        >
          {t("home.toolbar.encode_down_url")}
        </MenuItem>
      </MenuContent>
    </Menu>
  );
};

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
        <CopyLink />
      </HStack>
    </Show>
  );
};
