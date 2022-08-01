import { Anchor, HStack, VStack } from "@hope-ui/solid";
import { Link } from "solid-app-router";
import { joinBase } from "~/utils";

export const Footer = () => {
  return (
    <VStack pos="absolute" w="$full" bottom="$8">
      <HStack spacing="$2">
        <Anchor href="https://github.com/Xhofe/alist" external>
          Powered by AList
        </Anchor>
        <span>|</span>
        <Anchor as={Link} href={joinBase("/@manage")}>
          Manage
        </Anchor>
      </HStack>
    </VStack>
  );
};
