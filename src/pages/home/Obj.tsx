import { useColorModeValue, VStack } from "@hope-ui/solid";
import { Suspense, Switch, Match, lazy, createEffect, on } from "solid-js";
import { FullLoading, Error } from "~/components";
import { useObjTitle, usePath, useRouter } from "~/hooks";
import { objStore, /*layout,*/ State } from "~/store";

const Folder = lazy(() => import("./folder/Folder"));
const File = lazy(() => import("./file/File"));
const Password = lazy(() => import("./Password"));
// const ListSkeleton = lazy(() => import("./Folder/ListSkeleton"));
// const GridSkeleton = lazy(() => import("./Folder/GridSkeleton"));

export const Obj = () => {
  const cardBg = useColorModeValue("white", "$neutral3");
  const { pathname } = useRouter();
  const { handlePathChange } = usePath();
  createEffect(
    on(pathname, (pathname) => {
      useObjTitle();
      handlePathChange(pathname);
    })
  );
  return (
    <VStack
      class="obj-box"
      w="$full"
      rounded="$xl"
      bgColor={cardBg()}
      p="$2"
      shadow="$lg"
      spacing="$2"
    >
      <Suspense fallback={<FullLoading />}>
        <Switch>
          <Match when={objStore.err}>
            <Error msg={objStore.err} disableColor />
          </Match>
          <Match
            when={[State.FetchingObj, State.FetchingObjs].includes(
              objStore.state
            )}
          >
            <FullLoading />
            {/* <Show when={layout() === "list"} fallback={<GridSkeleton />}>
              <ListSkeleton />
            </Show> */}
          </Match>
          <Match when={objStore.state === State.NeedPassword}>
            <Password />
          </Match>
          <Match
            when={[State.Folder, State.FetchingMore].includes(objStore.state)}
          >
            <Folder />
          </Match>
          <Match when={objStore.state === State.File}>
            <File />
          </Match>
        </Switch>
      </Suspense>
    </VStack>
  );
};
