import {
  Box,
  createDisclosure,
  useColorModeValue,
  VStack,
} from "@hope-ui/solid";
import { createMemo, Show } from "solid-js";
import { SwitchColorMode } from "./SwitchColorMode";
import { RightIcon } from "./Icon";
import { CgMoreO } from "solid-icons/cg";
import { SwitchLnaguage } from "~/components";
// import { TbLanguageHiragana } from "solid-icons/tb";
import { IoLanguageOutline } from "solid-icons/io";
import { TbCheckbox } from "solid-icons/tb";
import { objStore, toggleCheckbox, user, userCan } from "~/store";
import { createAnimation } from "motion-signals";
import { bus } from "~/utils";
import { operations } from "./operations";
import { IoMagnetOutline } from "solid-icons/io";
import { AiOutlineCloudUpload } from "solid-icons/ai";

export const Right = () => {
  const { isOpen, onToggle } = createDisclosure({
    defaultIsOpen: localStorage.getItem("more-open") === "true",
    onClose: () => localStorage.setItem("more-open", "false"),
    onOpen: () => localStorage.setItem("more-open", "true"),
  });
  const margin = createMemo(() => (isOpen() ? "$4" : "$5"));
  const { replay } = createAnimation(
    ".left-toolbar-in",
    {
      opacity: [0, 1],
      scale: [0.6, 1],
    },
    {
      duration: 0.2,
    }
  );
  const showWrite = () => {
    if (!objStore.obj.is_dir) return false;
    return userCan("write");
  };
  return (
    <Box
      class="left-toolbar-box"
      pos="fixed"
      right={margin()}
      bottom={margin()}
    >
      <Show
        when={isOpen()}
        fallback={
          <RightIcon
            class="toolbar-toggle"
            as={CgMoreO}
            onClick={() => {
              onToggle();
              replay();
            }}
          />
        }
      >
        <VStack
          class="left-toolbar"
          p="$1"
          rounded="$lg"
          bgColor={useColorModeValue("white", "$neutral4")()}
          spacing="$1"
          shadow="0px 10px 30px -5px rgba(0, 0, 0, 0.3)"
        >
          <VStack spacing="$1" class="left-toolbar-in">
            <Show when={showWrite()}>
              {/* <Add /> */}
              <RightIcon
                as={operations.new_file.icon}
                tips="new_file"
                onClick={() => {
                  bus.emit("tool", "new_file");
                }}
              />
              <RightIcon
                as={operations.mkdir.icon}
                p="$1_5"
                tips="mkdir"
                onClick={() => {
                  bus.emit("tool", "mkdir");
                }}
              />
            </Show>
            <Show when={userCan("write")}>
              <RightIcon
                as={AiOutlineCloudUpload}
                tips="upload"
                onClick={() => {
                  bus.emit("tool", "upload");
                }}
              />
            </Show>
            <Show when={userCan("add_aria2")}>
              <RightIcon
                as={IoMagnetOutline}
                pl="0"
                tips="add_aria2"
                onClick={() => {
                  bus.emit("tool", "add_aria2");
                }}
              />
            </Show>
            <RightIcon
              tips="toggle_checkbox"
              as={TbCheckbox}
              onClick={toggleCheckbox}
            />
            <SwitchLnaguage as="span">
              <RightIcon tips="switch_lang" as={IoLanguageOutline} />
            </SwitchLnaguage>
            <SwitchColorMode />
          </VStack>
          <RightIcon tips="more" as={CgMoreO} onClick={onToggle} />
        </VStack>
      </Show>
    </Box>
  );
};
