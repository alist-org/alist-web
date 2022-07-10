import { Center } from "@hope-ui/solid";
import { Route, Routes } from "solid-app-router";
import { createEffect, JSXElement, lazy, Match, Switch } from "solid-js";
import { FullScreenLoading } from "~/components/FullScreenLoading";
import { err, state, State } from "~/store/state";
import { resetUser } from "~/store/user";

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
