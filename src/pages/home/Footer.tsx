import { Anchor, HStack, VStack } from "@hope-ui/solid";
import { Link } from "@solidjs/router";
import { AnchorWithBase } from "~/components";
import { useT } from "~/hooks";

export const Footer = () => {
  const t = useT();
  return (
    <VStack class="footer" w="$full">
      <HStack spacing="$0_5">
        <Anchor href="https://github.com/Xhofe/alist" external>
          Powered by AList
        </Anchor>
        <span>|</span>
        <AnchorWithBase as={Link} href="/@manage">
          {t("home.manage")}
        </AnchorWithBase>
      </HStack>
    </VStack>
  );
};
