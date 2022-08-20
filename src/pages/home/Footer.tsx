import { Anchor, HStack, VStack } from "@hope-ui/solid";
import { Link } from "@solidjs/router";
import { AnchorWithBase } from "~/components";
import { useT } from "~/hooks";

export const Footer = () => {
  const t = useT();
  return (
    <VStack class="footer" w="$full" py="$4">
      <HStack spacing="$1">
        <Anchor href="https://github.com/Xhofe/alist" external>
          {t("home.footer.powered_by")}
        </Anchor>
        <span>|</span>
        <AnchorWithBase as={Link} href="/@manage">
          {t("home.footer.manage")}
        </AnchorWithBase>
      </HStack>
    </VStack>
  );
};
