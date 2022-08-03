import { Container, VStack, Center, useColorModeValue } from "@hope-ui/solid";
import { lazy, Match, Switch } from "solid-js";
import { Error } from "~/components";
import { err, State, state } from "~/store";
import { Nav } from "./Nav";

const Folder = lazy(() => import("./Folder"));
const File = lazy(() => import("./File"));

export const Body = () => {
  const cardBg = useColorModeValue("white", "$neutral3");
  return (
    <Container class="body" p="$2" minH="80%">
      <VStack w="$full" spacing="$2" alignItems="start">
        <Nav />
        <Center
          class="obj-container"
          w="$full"
          rounded="$lg"
          bgColor={cardBg()}
        >
          <Switch>
            <Match when={err()}>
              <Error msg={err()} disableColor />
            </Match>
            <Match when={[State.FetchingObj,State.FetchingObjs].includes(state())}>
              
            </Match>
            <Match when={state() === State.Folder}>
              <Folder />
            </Match>
            <Match when={state() === State.File}>
              <File />
            </Match>
          </Switch>
        </Center>
      </VStack>
    </Container>
  );
};
