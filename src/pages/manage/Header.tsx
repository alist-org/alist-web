import {
  Box,
  Center,
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
import { SwitchColorMode, SwitchLnaguage } from "~/components";
import { useRouter, useT } from "~/hooks";
import { SideMenu } from "./SideMenu";
import { side_menu_items } from "./sidemenu_items";
const { isOpen, onOpen, onClose } = createDisclosure();

const Header = () => {
  const t = useT();
  const { to } = useRouter();
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      left="0"
      right="0"
      zIndex="$sticky"
      height="64px"
      flexShrink={0}
      shadow="$md"
      p="$4"
      bgColor={useColorModeValue("$background", "$neutral2")()}
    >
      <Flex alignItems="center" justifyContent="space-between" h="$full">
        <Flex alignItems="center">
          <IconButton
            aria-label="menu"
            icon={<TiThMenu />}
            display={{ "@sm": "none" }}
            onClick={onOpen}
            mr="$2"
            size="sm"
            variant="subtle"
          />
          <Heading
            fontSize="$xl"
            color="$info9"
            cursor="pointer"
            onClick={() => {
              to("/@manage");
            }}
          >
            {t("manage.title")}
          </Heading>
        </Flex>
      </Flex>
      <Drawer opened={isOpen()} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color="$info9">{t("manage.title")}</DrawerHeader>
          <DrawerBody>
            <SideMenu items={side_menu_items} />
            <Center>
              <HStack spacing="$4" p="$2" color="$neutral11">
                <SwitchLnaguage />
                <SwitchColorMode />
              </HStack>
            </Center>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export { Header, onClose };
