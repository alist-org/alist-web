import { Center, useColorModeValue } from "@hope-ui/solid";
import {
  Suspense,
  Switch,
  Match,
  lazy,
  createEffect,
  on,
  Show,
} from "solid-js";
import { FullLoading, Error } from "~/components";
import { usePath, useRouter } from "~/hooks";
import { err, /*layout,*/ State, state } from "~/store";

const Folder = lazy(() => import("./folder/Folder"));
const File = lazy(() => import("./File"));
// const ListSkeleton = lazy(() => import("./Folder/ListSkeleton"));
// const GridSkeleton = lazy(() => import("./Folder/GridSkeleton"));

export const Obj = () => {
  const cardBg = useColorModeValue("white", "$neutral3");
  const { pathname } = useRouter();
  const { handlePathChange } = usePath();
  createEffect(
    on(pathname, (pathname) => {
      handlePathChange(pathname);
    })
  );
  return (
    <Center class="obj-box" w="$full" rounded="$xl" bgColor={cardBg()} p="$2">
      <Suspense fallback={<FullLoading />}>
        <Switch>
          <Match when={err()}>
            <Error msg={err()} disableColor />
          </Match>
          <Match
            when={[State.FetchingObj, State.FetchingObjs].includes(state())}
          >
            <FullLoading />
            {/* <Show when={layout() === "list"} fallback={<GridSkeleton />}>
              <ListSkeleton />
            </Show> */}
          </Match>
          <Match when={state() === State.Folder}>
            <Folder />
          </Match>
          <Match when={state() === State.File}>
            <File />
          </Match>
        </Switch>
      </Suspense>
    </Center>
  );
};
