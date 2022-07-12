import { Box, Center, Flex, HStack, useColorModeValue } from "@hope-ui/solid";
import { SwitchColorMode, SwitchLnaguage } from "~/components";
import { useT, useTitle, useRouter } from "~/hooks";
import { user } from "~/store";
import { Header } from "./Header";
import { SideMenu } from "./SideMenu";
import { side_menu_items } from "./sidemenu_items";
import { UserMethods } from "~/types";
import { notify } from "~/utils";
import { Route, Routes } from "solid-app-router";
import { For } from "solid-js";
import { routes } from "./helper";

const Manage = () => {
  const t = useT();
  useTitle(() => t("manage.title"));
  const { to } = useRouter();
  if (UserMethods.is_guest(user()!)) {
    notify.warning(t("manage.not_admin"));
    to(`/@login?redirect=${encodeURIComponent(window.location.pathname)}`);
  }
  return (
    <Box>
      <Header />
      <Flex w="$full">
        <Box
          display={{ "@initial": "none", "@sm": "block" }}
          w="$56"
          h="calc(100vh - 64px)"
          shadow="$md"
          bgColor={useColorModeValue("$background", "$neutral2")()}
        >
          <SideMenu items={side_menu_items} />
          <Center>
            <HStack spacing="$4" p="$2" color="$neutral11">
              <SwitchLnaguage />
              <SwitchColorMode />
            </HStack>
          </Center>
        </Box>
        <Box w="$full" p="$4">
          <Routes>
            <For each={routes}>
              {(route) => (
                <Route path={route.to!} component={route.component} />
              )}
            </For>
          </Routes>
        </Box>
      </Flex>
    </Box>
  );
};

export default Manage;
