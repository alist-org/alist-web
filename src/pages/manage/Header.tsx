import {
  Box,
  createDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  IconButton,
  useColorModeValue,
} from "@hope-ui/solid";
import { TiThMenu } from "solid-icons/ti";
import { SwitchColorMode } from "~/components/SwitchColorMode";
import { SwitchLnaguage } from "~/components/SwitchLanguage";
import { useT } from "~/hooks/useT";
import { SideMenu } from "./SideMenu";
import { side_menu_items } from "./sidemenu_items";
const { isOpen, onOpen, onClose } = createDisclosure();

const Header = () => {
  const t = useT();
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      left="0"
      right="0"
      zIndex="$sticky"
      height="72px"
      flexShrink={0}
      shadow="$md"
      p="$4"
      bgColor={useColorModeValue("", "$whiteAlpha3")()}
    >
      <Flex alignItems="center" justifyContent="space-between" h="$full">
        <Flex alignItems="center">
          <IconButton
            aria-label="menu"
            icon={<TiThMenu />}
            display={{ "@sm": "none" }}
            onClick={onOpen}
            mr="$2"
          />
          <Heading fontSize="$2xl">{t("manage.title")}</Heading>
        </Flex>
        <Flex alignItems="center">
          <HStack spacing="$2" color="$neutral11">
            <SwitchLnaguage />
            <SwitchColorMode />
          </HStack>
        </Flex>
      </Flex>
      <Drawer opened={isOpen()} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>AList Menu</DrawerHeader>

          <DrawerBody>
            <SideMenu items={side_menu_items} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export { Header, onClose };
