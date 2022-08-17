import { Center, VStack, Icon, Text, Tooltip } from "@hope-ui/solid";
import { Show } from "solid-js";
import { CenterLoding, LinkWithPush, ImageWithError } from "~/components";
import { usePath } from "~/hooks";
import { getIconColor } from "~/store";
import { ObjType, StoreObj } from "~/types";
import { bus, hoverColor } from "~/utils";
import { getIconByObj } from "~/utils/icon";

export const GridItem = (props: { obj: StoreObj; index: number }) => {
  const { setPathAsDir } = usePath();
  const objIcon = (
    <Icon color={getIconColor()} boxSize="$12" as={getIconByObj(props.obj)} />
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
        if (props.obj.is_dir) {
          setPathAsDir(props.obj.name, true);
        }
      }}
    >
      <Center
        class="item-thumbnail"
        h="70px"
        // @ts-ignore
        on:click={(e) => {
          if (props.obj.type === ObjType.IMAGE) {
            e.stopPropagation();
            e.preventDefault();
            bus.emit("gallery", props.obj.name);
          }
        }}
      >
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
