import {
  Box,
  Center,
  Flex,
  Heading,
  useColorModeValue,
  createDisclosure,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectTrigger,
  SelectValue,
  Icon,
} from "@hope-ui/solid"
import { SwitchColorMode } from "./SwitchColorMode"
import { ComponentProps, For, mergeProps, Show } from "solid-js"
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "solid-icons/ai"
import { hoverColor } from "~/utils"

export const Error = (props: {
  msg: string
  disableColor?: boolean
  h?: string
}) => {
  const merged = mergeProps(
    {
      h: "$full",
    },
    props,
  )
  console.log(merged.h)
  return (
    <Center h={merged.h} p="$2" flexDirection="column">
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
  )
}

export const BoxWithFullScreen = (props: Parameters<typeof Box>[0]) => {
  const { isOpen, onToggle } = createDisclosure()
  return (
    <Box
      pos={isOpen() ? "fixed" : "relative"}
      w={isOpen() ? "100vw" : props.w}
      h={isOpen() ? "100vh" : props.h}
      top={0}
      left={0}
      zIndex={1}
      transition="all 0.2s ease-in-out"
      css={{
        backdropFilter: isOpen() ? "blur(5px)" : undefined,
      }}
    >
      {props.children}
      <Icon
        pos="absolute"
        right="$2"
        bottom="$2"
        aria-label="toggle fullscreen"
        as={isOpen() ? AiOutlineFullscreenExit : AiOutlineFullscreen}
        onClick={onToggle}
        cursor="pointer"
        rounded="$md"
        bgColor={hoverColor()}
        p="$1"
        boxSize="$7"
      />
    </Box>
  )
}

export function SelectWrapper<T extends string | number>(props: {
  value: T
  onChange: (v: T) => void
  options: {
    value: T
    label?: string
  }[]
  alwaysShowBorder?: boolean
  size?: "xs" | "sm" | "md" | "lg"
  w?: ComponentProps<typeof SelectTrigger>["w"]
}) {
  return (
    <Select size={props.size} value={props.value} onChange={props.onChange}>
      <SelectTrigger
        borderColor={props.alwaysShowBorder ? "$info5" : undefined}
        w={props.w}
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
  )
}
