import { HStack, Icon, Text } from "@hope-ui/solid";
import { LinkWithBase } from "~/components";
import { usePath, useRouter } from "~/hooks";
import { getIconColor } from "~/store";
import { Obj } from "~/types";
import { formatDate, getFileSize, hoverColor } from "~/utils";
import { getIconByObj } from "~/utils/icon";

export const cols = [
  { name: "name", textAlign: "left", w: { "@initial": "67%", "@md": "50%" } },
  { name: "size", textAlign: "right", w: { "@initial": "33%", "@md": "17%" } },
  { name: "modified", textAlign: "right", w: { "@initial": 0, "@md": "33%" } },
];

export const ListItem = (props: { obj: Obj }) => {
  const { pushHref } = useRouter();
  const { setPathAsDir } = usePath();
  return (
    <HStack
      class="list-item"
      w="$full"
      p="$2"
      rounded="$lg"
      _hover={{
        transform: "scale(1.01)",
        bgColor: hoverColor,
        transition: "all 0.3s",
      }}
      as={LinkWithBase}
      href={pushHref(props.obj.name)}
      onMouseEnter={() => {
        if (props.obj.is_dir) {
          setPathAsDir(props.obj.name, true);
        }
      }}
    >
      <HStack spacing="$2" w={cols[0].w}>
        <Icon
          boxSize="$6"
          color={getIconColor()}
          as={getIconByObj(props.obj)}
        />
        <Text>{props.obj.name}</Text>
      </HStack>
      <Text w={cols[1].w} textAlign={cols[1].textAlign as any}>
        {getFileSize(props.obj.size)}
      </Text>
      <Text
        display={{ "@initial": "none", "@md": "inline" }}
        w={cols[2].w}
        textAlign={cols[2].textAlign as any}
      >
        {formatDate(props.obj.modified)}
      </Text>
    </HStack>
  );
};
