import { HStack, VStack, Text } from "@hope-ui/solid";
import { For } from "solid-js";
import { useT } from "~/hooks";
import { objStore } from "~/store";
import { cols, ListItem } from "./ListItem";

const ListLayout = () => {
  const t = useT();
  return (
    <VStack w="$full" spacing="$1">
      <HStack w="$full" p="$2">
        <For each={cols}>
          {(item) => (
            <Text
              display={{
                "@initial": item.w["@initial"] ? "inline" : "none",
                "@md": "inline",
              }}
              w={item.w}
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
