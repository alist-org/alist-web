import { HStack, Icon, Text, Tooltip } from "@hope-ui/solid";
import { LinkWithPush } from "~/components";
import { usePath } from "~/hooks";
import { getIconColor } from "~/store";
import { Obj } from "~/types";
import { formatDate, getFileSize, hoverColor } from "~/utils";
import { getIconByObj } from "~/utils/icon";

export const cols = [
  { name: "name", textAlign: "left", w: { "@initial": "76%", "@md": "50%" } },
  { name: "size", textAlign: "right", w: { "@initial": "24%", "@md": "17%" } },
  { name: "modified", textAlign: "right", w: { "@initial": 0, "@md": "33%" } },
];

export const ListItem = (props: { obj: Obj }) => {
  const { setPathAsDir } = usePath();
  return (
    <HStack
      class="list-item"
      w="$full"
      p="$2"
      rounded="$lg"
      _hover={{
        transform: "scale(1.01)",
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
      <HStack class="name-box" spacing="$2" w={cols[0].w}>
        <Icon
          class="icon"
          boxSize="$6"
          color={getIconColor()}
          as={getIconByObj(props.obj)}
        />
        <Tooltip label={props.obj.name}>
          <Text
            class="name"
            css={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {props.obj.name}
          </Text>
        </Tooltip>
      </HStack>
      <Text class="size" w={cols[1].w} textAlign={cols[1].textAlign as any}>
        {getFileSize(props.obj.size)}
      </Text>
      <Text
        class="modified"
        display={{ "@initial": "none", "@md": "inline" }}
        w={cols[2].w}
        textAlign={cols[2].textAlign as any}
      >
        {formatDate(props.obj.modified)}
      </Text>
    </HStack>
  );
};
