import { Box, Heading } from "@hope-ui/solid";
import { SideMenu } from "./SideMenu";
import { side_menu_items } from "./sidemenu_items";



const Manage = () => {
  return (
    <Box>
      <Heading>Manage here</Heading>
      <SideMenu items={side_menu_items} />
    </Box>
  );
};

export default Manage;
