import { Box, Center, Flex, Heading, useColorModeValue } from "@hope-ui/solid";
import { Show } from "solid-js";
import { SwitchColorMode } from "./SwitchColorMode";

export const Error = (props: { msg: string; disableColor?: boolean }) => {
  return (
    <Center h="$full" p="$2" flexDirection="column">
      <Box
        rounded="$lg"
        px="$4"
        py="$6"
        bgColor={useColorModeValue("white", "$neutral3")()}
      >
        <Heading>{props.msg}</Heading>
        <Show when={!props.disableColor}>
          <Flex mt="$2" justifyContent="end">
            <SwitchColorMode />
          </Flex>
        </Show>
      </Box>
    </Center>
  );
};
