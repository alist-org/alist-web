import {
  Box,
  Center,
  Flex,
  Heading,
  useColorModeValue,
  createDisclosure,
  IconButton,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectTrigger,
  SelectValue,
} from "@hope-ui/solid";
import { SwitchColorMode } from "./SwitchColorMode";
import { createMemo, For, Show, splitProps } from "solid-js";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "solid-icons/ai";

export const Error = (props: { msg: string; disableColor?: boolean }) => {
  return (
    <Center h="$full" p="$2" flexDirection="column">
      <Box
        rounded="$lg"
        px="$4"
        py="$6"
        bgColor={useColorModeValue("white", "$neutral3")()}
      >
        <Heading
          css={{
            wordBreak: "break-all",
          }}
        >
          {props.msg}
        </Heading>
        <Show when={!props.disableColor}>
          <Flex mt="$2" justifyContent="end">
            <SwitchColorMode />
          </Flex>
        </Show>
      </Box>
    </Center>
  );
};

export const BoxWithFullScreen = (props: Parameters<typeof Box>[0]) => {
  const [local, _others] = splitProps(props, ["children"]);
  const { isOpen, onToggle } = createDisclosure();
  const others = createMemo(() => {
    let ans = _others;
    if (isOpen()) {
      ans = { ...ans, top: 0, left: 0, zIndex: 1, w: "100vw", h: "100vh" };
    }
    return ans;
  });
  return (
    <Box
      {...others()}
      pos={isOpen() ? "fixed" : "relative"}
      top={0}
      left={0}
      zIndex={1}
      transition="all 0.2s ease-in-out"
    >
      {local.children}
      <IconButton
        colorScheme="neutral"
        pos="absolute"
        right="$2"
        top="$2"
        aria-label="toggle fullscreen"
        icon={
          <Show when={isOpen()} fallback={<AiOutlineFullscreen />}>
            <AiOutlineFullscreenExit />
          </Show>
        }
        onClick={onToggle}
      />
    </Box>
  );
};

export const SelectWrapper = (props: {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label?: string;
  }[];
  alwaysShowBorder?: boolean;
}) => {
  return (
    <Select value={props.value} onChange={props.onChange}>
      <SelectTrigger
        borderColor={props.alwaysShowBorder ? "$info5" : undefined}
      >
        <SelectValue />
        <SelectIcon />
      </SelectTrigger>
      <SelectContent>
        <SelectListbox>
          <For each={props.options}>
            {(item) => (
              <SelectOption value={item.value}>
                <SelectOptionText>{item.label ?? item.value}</SelectOptionText>
                <SelectOptionIndicator />
              </SelectOption>
            )}
          </For>
        </SelectListbox>
      </SelectContent>
    </Select>
  );
};
