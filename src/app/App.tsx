import { Center, Progress, ProgressIndicator } from "@hope-ui/solid";
import { Route, Routes, useIsRouting } from "@solidjs/router";
import {
  Component,
  createSignal,
  lazy,
  Match,
  onCleanup,
  Switch,
} from "solid-js";
import { Portal } from "solid-js/web";
import { useLoading, useRouter } from "~/hooks";
import { globalStyles } from "./theme";
import { bus, r, handleRrespWithoutAuthAndNotify, base_path } from "~/utils";
import { setSettings } from "~/store";
import { FullScreenLoading } from "~/components";
import { MustUser } from "./MustUser";
import "./index.css";
import { useI18n } from "@solid-primitives/i18n";
import { initialLang, langMap, loadedLangs } from "./i18n";

const Index = lazy(() => import("~/pages/index/Layout"));
const Manage = lazy(() => import("~/pages/manage"));
const Login = lazy(() => import("~/pages/login"));
const Test = lazy(() => import("~/pages/test"));

const App: Component = () => {
  globalStyles();
  const [, { add }] = useI18n();
  const isRouting = useIsRouting();
  const { to } = useRouter();
  const onTo = (path: string) => {
    to(path);
  };
  bus.on("to", onTo);
  onCleanup(() => {
    bus.off("to", onTo);
  });

  const [err, setErr] = createSignal("");
  const [loading, data] = useLoading(() =>
    Promise.all([
      (async () => {
        add(initialLang, (await langMap[initialLang]()).default);
        loadedLangs.add(initialLang);
      })(),
      (async () => {
        handleRrespWithoutAuthAndNotify(
          await r.get("/public/settings"),
          setSettings,
          setErr
        );
      })(),
    ])
  );
  data();
  return (
    <>
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
          <Routes base={base_path}>
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
        <Match when={err()}>
          <Center h="$full">Failed fetching settings: {err()}</Center>
        </Match>
        <Match when={loading()}>
          <FullScreenLoading />
        </Match>
      </Switch>
    </>
  );
};

export default App;
