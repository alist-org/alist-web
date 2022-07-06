import { Route, Routes } from "solid-app-router";
import { Component, lazy, Suspense } from "solid-js";
import { Boundary } from "./Boundary";
import { globalStyles, theme } from "./theme";

const Index = lazy(() => import("./pages/index"));
const Manage = lazy(() => import("./pages/manage"));
const Login = lazy(() => import("./pages/login"));
const Test = lazy(() => import("./pages/test"));

const App: Component = () => {
  globalStyles();
  return (
    <Boundary>
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
