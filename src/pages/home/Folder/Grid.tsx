import { Grid, SimpleGrid } from "@hope-ui/solid";
import { For } from "solid-js";
import { objStore } from "~/store";
import { GridItem } from "./GridItem";

const GridLayout = () => {
  return (
    <SimpleGrid w="$full" gap="$1" minChildWidth="100px">
      <For each={objStore.objs}>
        {(obj) => {
          return <GridItem obj={obj} />;
        }}
      </For>
    </SimpleGrid>
  );
};

export default GridLayout;
