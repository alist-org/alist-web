import { Progress, ProgressIndicator } from "@hope-ui/solid";
import { Route, Routes, useIsRouting } from "solid-app-router";
import { Component, lazy, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { Boundary } from "./Boundary";
import { useRouter } from "~/hooks/useRouter";
import { globalStyles } from "./theme";
import { bus } from "~/utils/bus";

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
      <Routes>
        <Route path="/@test" component={Test} />
        <Route path="/@login" component={Login} />
        <Route path="/@manage/*" component={Manage} />
        <Route path="*" component={Index} />
      </Routes>
    </Boundary>
  );
};

export default App;
