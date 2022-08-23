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
import { objStore, toggleCheckbox, user } from "~/store";
import { createAnimation } from "motion-signals";
import { Mkdir } from "./Mkdir";
import { NewFile } from "./NewFile";
import { UserMethods } from "~/types";

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
    return UserMethods.can(user(), 3);
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
        >
          <VStack spacing="$1" class="left-toolbar-in">
            <Show when={showWrite()}>
              <NewFile />
              <Mkdir />
            </Show>
            <RightIcon
              tip="toggle_checkbox"
              as={TbCheckbox}
              onClick={toggleCheckbox}
            />
            <SwitchLnaguage as="span">
              <RightIcon tip="switch_lang" as={IoLanguageOutline} />
            </SwitchLnaguage>
            <SwitchColorMode />
          </VStack>
          <RightIcon tip="more" as={CgMoreO} onClick={onToggle} />
        </VStack>
      </Show>
    </Box>
  );
};
