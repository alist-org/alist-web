import {
  Center,
  HopeProvider,
  NotificationsProvider,
  Spinner,
} from "@hope-ui/solid";
import { I18nContext } from "@solid-primitives/i18n";
import { ErrorBoundary, JSX, Suspense } from "solid-js";
import { i18n } from "./i18n";
import { globalStyles, theme } from "./theme";

const Boundary = (props: { children: JSX.Element }) => {
  globalStyles();
  return (
    <ErrorBoundary
      fallback={(err) => {
        console.log("error", err);
        return <Center h="100vh">{err.message}</Center>;
      }}
    >
      <I18nContext.Provider value={i18n}>
        <HopeProvider config={theme}>
          <NotificationsProvider duration={2000}>
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
              {props.children}
            </Suspense>
          </NotificationsProvider>
        </HopeProvider>
      </I18nContext.Provider>
    </ErrorBoundary>
  );
};

export { Boundary };
