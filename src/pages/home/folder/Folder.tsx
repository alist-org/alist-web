import { lazy, Show } from "solid-js";
import { layout } from "~/store";
import { ContextMenu } from "./context-menu";

const ListLayout = lazy(() => import("./List"));
const GridLayout = lazy(() => import("./Grid"));

const Folder = () => {
  return (
    <>
      <Show when={layout() === "list"} fallback={<GridLayout />}>
        <ListLayout />
      </Show>
      <ContextMenu />
    </>
  );
};

export default Folder;
