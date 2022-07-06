import { Center, HopeProvider, Spinner } from "@hope-ui/solid";
import { I18nContext } from "@solid-primitives/i18n";
import { Route, Routes } from "solid-app-router";
import { Component, lazy, Suspense } from "solid-js";
import i18n from "./i18n";
import theme, { globalStyles } from "./theme";

const Index = lazy(() => import("./pages/index"));
const Manage = lazy(() => import("./pages/manage"));
const Login = lazy(() => import("./pages/login"));
const Test = lazy(() => import("./pages/test"));

const App: Component = () => {
  globalStyles();
  return (
    <I18nContext.Provider value={i18n}>
      <HopeProvider config={theme}>
        <Suspense
          fallback={
            <Center h="100vh">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="$neutral4"
                color="$info10"
                size="xl"
              />
            </Center>
          }
        >
          <Routes>
            <Route path="/@test" component={Test} />
            <Route path="/@login" component={Login} />
            <Route path="/@manage/*" component={Manage} />
            <Route path="*" component={Index} />
          </Routes>
        </Suspense>
      </HopeProvider>
    </I18nContext.Provider>
  );
};

export default App;
