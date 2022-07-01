import { Center, HopeProvider, Spinner } from "@hope-ui/solid";
import { Route, Routes } from "solid-app-router";
import { Component, lazy, Suspense } from "solid-js";
import theme from "./theme";

const Index = lazy(() => import("./pages/index"));
const Manage = lazy(() => import("./pages/manage"));

const App: Component = () => {
  return (
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
          <Route path="/@manage/*" element={<Manage />} />
          <Route path="*" element={<Index />} />
        </Routes>
      </Suspense>
    </HopeProvider>
  );
};

export default App;
