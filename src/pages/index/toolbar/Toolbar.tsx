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
import { Motion, Presence } from "@motionone/solid";

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
          <Presence exitBeforeEnter>
            <Show when={isOpen()}>
              <Motion
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                <SwitchColorMode />
              </Motion>
            </Show>
          </Presence>
          <ToolIcon as={CgMoreO} onClick={onToggle} />
        </VStack>
      </Box>
    </Portal>
  );
};

export { Toolbar };
