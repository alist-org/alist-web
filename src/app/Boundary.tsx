import {
  Center,
  HopeProvider,
  NotificationsProvider,
  Spinner,
} from "@hope-ui/solid";
import { I18nContext } from "@solid-primitives/i18n";
import { ErrorBoundary, JSXElement, Suspense } from "solid-js";
import { FullScreenLoading } from "~/components/FullScreenLoading";
import { i18n } from "./i18n";
import { globalStyles, theme } from "./theme";

const Boundary = (props: { children: JSXElement }) => {
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
          <NotificationsProvider duration={3000}>
            <Suspense fallback={<FullScreenLoading />}>
              {props.children}
            </Suspense>
          </NotificationsProvider>
        </HopeProvider>
      </I18nContext.Provider>
    </ErrorBoundary>
  );
};

export { Boundary };
