import { Grid } from "@hope-ui/solid";
import { For } from "solid-js";
import { GridItem } from "./GridItem";
import "lightgallery/css/lightgallery-bundle.css";
import { useObjs } from "~/hooks";

const GridLayout = () => {
  const { objsAfterHide } = useObjs();
  return (
    <Grid
      w="$full"
      gap="$1"
      templateColumns="repeat(auto-fill, minmax(100px,1fr))"
    >
      <For each={objsAfterHide()}>
        {(obj, i) => {
          return <GridItem obj={obj} index={i()} />;
        }}
      </For>
    </Grid>
  );
};

export default GridLayout;
