import { Menu, Item } from "solid-contextmenu";
import { useCopyUrl, useT } from "~/hooks";
import "solid-contextmenu/dist/style.css";
import { HStack, Icon, Text, useColorMode } from "@hope-ui/solid";
import { operations } from "../toolbar/operations";
import { For } from "solid-js";
import { bus } from "~/utils";

const ItemContent = (props: { name: string }) => {
  const t = useT();
  return (
    <HStack spacing="$2">
      <Icon
        p={operations[props.name].p ? "$1" : undefined}
        as={operations[props.name].icon}
        boxSize="$7"
        color={operations[props.name].color}
      />
      <Text>{t(`home.toolbar.${props.name}`)}</Text>
    </HStack>
  );
};

export const ContextMenu = () => {
  const { colorMode } = useColorMode();
  const { copyRawUrl } = useCopyUrl();
  return (
    <Menu
      id={1}
      animation="scale"
      theme={colorMode() !== "dark" ? "light" : "dark"}
    >
      <For each={["rename", "move", "copy", "delete"]}>
        {(name) => (
          <Item
            onClick={() => {
              bus.emit("click", `toolbar-${name}`);
            }}
          >
            <ItemContent name={name} />
          </Item>
        )}
      </For>
      <Item
        onClick={() => {
          copyRawUrl(true);
        }}
      >
        <ItemContent name="copy_url" />
      </Item>
    </Menu>
  );
};
