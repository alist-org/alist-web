import { Center, useColorModeValue } from "@hope-ui/solid";
import { Suspense, Switch, Match, lazy } from "solid-js";
import { FullLoading, Error } from "~/components";
import { err, State, state } from "~/store";

const Folder = lazy(() => import("./Folder/Folder"));
const File = lazy(() => import("./File"));

export const Obj = () => {
  const cardBg = useColorModeValue("white", "$neutral3");
  return (
    <Center
      class="obj-container"
      w="$full"
      rounded="$xl"
      bgColor={cardBg()}
      p="$2"
    >
      <Suspense fallback={<FullLoading />}>
        <Switch>
          <Match when={err()}>
            <Error msg={err()} disableColor />
          </Match>
          <Match
            when={[State.FetchingObj, State.FetchingObjs].includes(state())}
          >
            <FullLoading />
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
