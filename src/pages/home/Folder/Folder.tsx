import { lazy, Show } from "solid-js";
import { layout } from "~/store";

const ListLayout = lazy(() => import("./List"));
const GridLayout = lazy(() => import("./Grid"));

const Folder = () => {
  return (
    <Show when={layout() === "list"} fallback={<GridLayout />}>
      <ListLayout />
    </Show>
  );
};

export default Folder;
