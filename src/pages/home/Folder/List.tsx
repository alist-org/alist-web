import { HStack, VStack, Text } from "@hope-ui/solid";
import { batch, createEffect, createSignal, For } from "solid-js";
import { useT } from "~/hooks";
import { objStore, sortObjs } from "~/store";
import { OrderBy } from "~/store";
import { cols, ListItem } from "./ListItem";

const ListLayout = () => {
  const t = useT();
  const [orderBy, setOrderBy] = createSignal<OrderBy>();
  const [reverse, setReverse] = createSignal(false);
  createEffect(() => {
    if (orderBy()) {
      sortObjs(orderBy()!, reverse());
    }
  });
  return (
    <VStack class="list" w="$full" spacing="$1">
      <HStack class="title" w="$full" p="$2">
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
              cursor="pointer"
              onClick={() => {
                if (item.name === orderBy()) {
                  setReverse(!reverse());
                } else {
                  batch(() => {
                    setOrderBy(item.name as OrderBy);
                    setReverse(false);
                  });
                }
              }}
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
