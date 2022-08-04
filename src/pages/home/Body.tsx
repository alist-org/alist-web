import { Container, VStack, Center, useColorModeValue } from "@hope-ui/solid";
import { lazy, Match, Suspense, Switch } from "solid-js";
import { Error, FullLoading } from "~/components";
import { err, State, state } from "~/store";
import { Nav } from "./Nav";

const Folder = lazy(() => import("./Folder"));
const File = lazy(() => import("./File"));

export const Body = () => {
  const cardBg = useColorModeValue("white", "$neutral3");
  return (
    <Container
      class="body"
      p="$2"
      minH="80%"
      display="flex"
      flexDirection="column"
      w="$full"
      gap="$2"
    >
      <Nav />
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
    </Container>
  );
};
