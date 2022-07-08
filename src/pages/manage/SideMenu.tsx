import { Box, Flex, Heading, HStack, Icon, VStack } from "@hope-ui/solid";
import { createSignal, For, Show } from "solid-js";
import { useRouter } from "~/hooks/useRouter";
import { BiSolidRightArrow } from "solid-icons/bi";
import { useT } from "~/hooks/useT";
import { IconTypes } from "solid-icons/lib/browser/IconWrapper";
import { onClose } from "./Header";

export interface SideMenuItemProps {
  title: string;
  to?: string;
  icon?: IconTypes;
  children?: SideMenuItemProps[];
}

const SideMenuItem = (props: SideMenuItemProps) => {
  return (
    <Show when={props.children} fallback={<SideMenuItemWithTo {...props} />}>
      <SideMenuItemWithChildren {...props} />
    </Show>
  );
};

const SideMenuItemWithTo = (props: SideMenuItemProps) => {
  const { to, pathname } = useRouter();
  const t = useT();
  return (
    <Flex
      onClick={() => {
        to(props.to!);
        onClose();
      }}
      w="$full"
      alignItems="center"
      _hover={{
        bgColor: "#9CA3AF40",
      }}
      p="$2"
      rounded="$md"
      cursor="pointer"
      bgColor={pathname() === props.to ? "#9CA3AF40" : ""}
    >
      <Show when={props.icon}>{<Icon mr="$2" as={props.icon} />}</Show>
      <Heading>{t(props.title)}</Heading>
    </Flex>
  );
};

const SideMenuItemWithChildren = (props: SideMenuItemProps) => {
  const [open, setOpen] = createSignal(false);
  const t = useT();
  return (
    <Box w="$full">
      <Flex
        justifyContent="space-between"
        onClick={() => {
          setOpen(!open());
        }}
        w="$full"
        alignItems="center"
        _hover={{
          bgColor: "rgba(156,163,175,0.2)",
        }}
        p="$2"
        rounded="$md"
        cursor="pointer"
      >
        <HStack>
          <Show when={props.icon}>{<Icon mr="$2" as={props.icon} />}</Show>
          <Heading>{t(props.title)}</Heading>
        </HStack>
        <Icon
          as={BiSolidRightArrow}
          transform={open() ? "rotate(90deg)" : "none"}
          transition="transform 0.2s"
        />
      </Flex>
      <Show when={open()}>
        <Box pl="$2">
          <SideMenu items={props.children!} />
        </Box>
      </Show>
    </Box>
  );
};

export const SideMenu = (props: { items: SideMenuItemProps[] }) => {
  return (
    <VStack p="$2" w="$full" color="$neutral11">
      <For each={props.items}>
        {(item, i) => {
          return <SideMenuItem {...item} />;
        }}
      </For>
    </VStack>
  );
};
