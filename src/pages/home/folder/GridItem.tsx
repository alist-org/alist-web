import { Center, VStack, Icon, Text, Tooltip, Checkbox } from "@hope-ui/solid";
import { createMemo, createSignal, Show } from "solid-js";
import { CenterLoding, LinkWithPush, ImageWithError } from "~/components";
import { usePath } from "~/hooks";
import { checkboxOpen, getIconColor, selectIndex } from "~/store";
import { ObjType, StoreObj } from "~/types";
import { bus, hoverColor } from "~/utils";
import { getIconByObj } from "~/utils/icon";

export const GridItem = (props: { obj: StoreObj; index: number }) => {
  const { setPathAsDir } = usePath();
  const objIcon = (
    <Icon color={getIconColor()} boxSize="$12" as={getIconByObj(props.obj)} />
  );
  const [hover, setHover] = createSignal(false);
  const showCheckbox = createMemo(
    () => checkboxOpen() && (hover() || props.obj.selected)
  );
  return (
    <VStack
      class="grid-item"
      w="$full"
      p="$1"
      spacing="$1"
      rounded="$lg"
      _hover={{
        transform: "scale(1.06)",
        bgColor: hoverColor(),
        transition: "all 0.3s",
      }}
      as={LinkWithPush}
      href={props.obj.name}
      onMouseEnter={() => {
        setHover(true);
        if (props.obj.is_dir) {
          setPathAsDir(props.obj.name, true);
        }
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <Center
        class="item-thumbnail"
        h="70px"
        w="$full"
        // @ts-ignore
        on:click={(e) => {
          if (props.obj.type === ObjType.IMAGE) {
            e.stopPropagation();
            e.preventDefault();
            bus.emit("gallery", props.obj.name);
          }
        }}
        pos="relative"
      >
        <Show when={showCheckbox()}>
          <Checkbox
            pos="absolute"
            left="$1"
            top="$1" 
            // colorScheme="neutral"
            // @ts-ignore
            on:click={(e) => {
              e.stopPropagation();
            }}
            checked={props.obj.selected}
            onChange={(e: any) => {
              selectIndex(props.index, e.target.checked);
            }}
          />
        </Show>
        <Show when={props.obj.thumb} fallback={objIcon}>
          <ImageWithError
            maxH="$full"
            maxW="$full"
            rounded="$lg"
            shadow="$md"
            fallback={<CenterLoding size="lg" />}
            fallbackErr={objIcon}
            src={props.obj.thumb}
          />
        </Show>
      </Center>
      <Tooltip label={props.obj.name}>
        <Text
          css={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          w="$full"
          overflow="hidden"
          textAlign="center"
          fontSize="$sm"
        >
          {props.obj.name}
        </Text>
      </Tooltip>
    </VStack>
  );
};
