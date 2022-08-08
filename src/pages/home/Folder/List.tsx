import { HStack, VStack, Text } from "@hope-ui/solid";
import { For } from "solid-js";
import { useT } from "~/hooks";
import { objStore } from "~/store";
import { ListItem } from "./ListItem";

const cols = [
  { name: "name", initial: "67%", md: "50%", textAlign: "left" },
  { name: "size", initial: "33%", md: "17%", textAlign: "right" },
  { name: "modified", initial: 0, md: "33%", textAlign: "right" },
];

const ListLayout = () => {
  const t = useT();
  return (
    <VStack w="$full">
      <HStack w="$full" p="$2">
        <For each={cols}>
          {(item) => (
            <Text
              display={{
                "@initial": item.initial ? "inline" : "none",
                "@md": "inline",
              }}
              w={{ "@initial": item.initial, "@md": item.md }}
              fontWeight="bold"
              fontSize="$sm"
              color="$neutral11"
              textAlign={item.textAlign as any}
            >
              {t(`home.obj.${item.name}`)}
            </Text>
          )}
        </For>
      </HStack>
      <For each={objStore.objs}>
        {(obj) => {
          return <ListItem obj={obj} />;
        }}
      </For>
    </VStack>
  );
};

export default ListLayout;
