import { Box, Flex, useColorModeValue } from "@hope-ui/solid";
import { Header } from "./Header";
import { SideMenu } from "./SideMenu";
import { side_menu_items } from "./sidemenu_items";

const Manage = () => {
  return (
    <Box>
      <Header />
      <Flex h="calc(100vh - 72px)">
        <Box
          display={{ "@initial": "none", "@sm": "block" }}
          w="$56"
          h="$full"
          shadow="$md"
          bgColor={useColorModeValue("", "$whiteAlpha3")()}
        >
          <SideMenu items={side_menu_items} />
        </Box>
      </Flex>
    </Box>
  );
};

export default Manage;
