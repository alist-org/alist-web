import { Center } from "@hope-ui/solid";
import { JSXElement, Match, Switch } from "solid-js";
import { FullScreenLoading } from "~/components";
import { err, state, State, resetUser } from "~/store";

const MustUser = (props: { children: JSXElement }) => {
  resetUser();
  return (
    <Switch fallback={props.children}>
      <Match when={state() === State.FetchingCurrentUser}>
        <FullScreenLoading />
      </Match>
      <Match when={state() === State.FetchingCurrentUserError}>
        <Center>{err()}</Center>
      </Match>
    </Switch>
  );
};

export { MustUser };
