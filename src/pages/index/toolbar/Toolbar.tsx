import {
  Box,
  createDisclosure,
  useColorModeValue,
  VStack,
} from "@hope-ui/solid";
import { Show } from "solid-js";
import { SwitchColorMode } from "./SwitchColorMode";
import { Portal } from "solid-js/web";
import { ToolIcon } from "./Icon";
import { CgMoreO } from "solid-icons/cg";

const Toolbar = () => {
  const { isOpen, onToggle } = createDisclosure();
  return (
    <Portal>
      <Box pos="fixed" right="$4" bottom="$4">
        <VStack
          p="$1"
          shadow="$md"
          rounded="$lg"
          bgColor={useColorModeValue("$background", "$neutral3")()}
          spacing="$1"
        >
          <Show when={isOpen()}>
            <SwitchColorMode />
          </Show>
          <ToolIcon as={CgMoreO} onClick={onToggle} />
        </VStack>
      </Box>
    </Portal>
  );
};

export { Toolbar };
