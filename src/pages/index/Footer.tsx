import { Anchor, HStack, VStack } from "@hope-ui/solid";
import { Link } from "solid-app-router";
import { AnchorWithBase } from "~/components";
import { joinBase } from "~/utils";

export const Footer = () => {
  return (
    <VStack class="footer" w="$full">
      <HStack spacing="$0_5">
        <Anchor href="https://github.com/Xhofe/alist" external>
          Powered by AList
        </Anchor>
        <span>|</span>
        <AnchorWithBase as={Link} href="/@manage">
          Manage
        </AnchorWithBase>
      </HStack>
    </VStack>
  );
};
