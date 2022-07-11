import { Center, Progress, ProgressIndicator } from "@hope-ui/solid";
import { Route, Routes, useIsRouting } from "solid-app-router";
import { Component, lazy, Match, onCleanup, Switch } from "solid-js";
import { Portal } from "solid-js/web";
import { Boundary } from "./Boundary";
import { useRouter } from "~/hooks/useRouter";
import { globalStyles } from "./theme";
import { bus } from "~/utils/bus";
import { err, State, state } from "~/store/state";
import { FullScreenLoading } from "~/components/FullLoading";
import { initSettings } from "~/store/settings";
import { MustUser } from "./MustUser";
import './index.css';

const Index = lazy(() => import("~/pages/index"));
const Manage = lazy(() => import("~/pages/manage"));
const Login = lazy(() => import("~/pages/login"));
const Test = lazy(() => import("~/pages/test"));

const App: Component = () => {
  globalStyles();
  const isRouting = useIsRouting();
  const { to } = useRouter();
  const onTo = (path: string) => {
    to(path);
  };
  bus.on("to", onTo);
  onCleanup(() => {
    bus.off("to", onTo);
  });
  initSettings();
  return (
    <Boundary>
      <Portal>
        <Progress
          indeterminate
          size="xs"
          position="fixed"
          top="0"
          left="0"
          right="0"
          zIndex="$banner"
          d={isRouting() ? "block" : "none"}
        >
          <ProgressIndicator />
        </Progress>
      </Portal>
      <Switch
        fallback={
          <Routes>
            <Route path="/@test" component={Test} />
            <Route path="/@login" component={Login} />
            <Route
              path="/@manage/*"
              element={
                <MustUser>
                  <Manage />
                </MustUser>
              }
            />
            <Route
              path="*"
              element={
                <MustUser>
                  <Index />
                </MustUser>
              }
            />
          </Routes>
        }
      >
        <Match when={state() === State.FetchingSettings}>
          <FullScreenLoading />
        </Match>
        <Match when={state() === State.FetchingSettingsError}>
          <Center>{err}</Center>
        </Match>
      </Switch>
    </Boundary>
  );
};

export default App;
