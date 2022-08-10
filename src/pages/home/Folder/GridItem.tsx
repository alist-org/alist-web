import { Center, VStack, Image, Icon, Text } from "@hope-ui/solid";
import { createSignal, Show } from "solid-js";
import { FullLoading, LinkWithPush } from "~/components";
import { usePath } from "~/hooks";
import { getIconColor } from "~/store";
import { Obj, ObjType } from "~/types";
import { hoverColor } from "~/utils";
import { getIconByObj } from "~/utils/icon";

export const GridItem = (props: { obj: Obj }) => {
  const { setPathAsDir } = usePath();
  const [] = createSignal(true);
  return (
    <VStack
      class="grid-item"
      w="$full"
      p="$1"
      spacing="$1"
      rounded="$lg"
      _hover={{
        transform: "scale(1.06)",
        bgColor: hoverColor,
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
        on:click={(e: any) => {
          if (props.obj.type === ObjType.IMAGE) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
      >
        <Show
          when={props.obj.thumbnail}
          fallback={
            <Icon
              color={getIconColor()}
              boxSize="$12"
              as={getIconByObj(props.obj)}
            />
          }
        >
          <Image
            maxH="$full"
            maxW="$full"
            rounded="$lg"
            shadow="$lg"
            fallback={<FullLoading py="0" />}
            src={props.obj.thumbnail}
          />
        </Show>
      </Center>
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
    </VStack>
  );
};
