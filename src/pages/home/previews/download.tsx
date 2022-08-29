import { Button, HStack } from "@hope-ui/solid";
import { useCopyLink, useT } from "~/hooks";
import { objStore } from "~/store";
import { IconName } from "./icon-name";

const Download = () => {
  const t = useT();
  const { copyCurrentRawLink } = useCopyLink();
  return (
    <IconName>
      <HStack spacing="$2">
        <Button colorScheme="accent" onClick={() => copyCurrentRawLink(true)}>
          {t("home.toolbar.copy_link")}
        </Button>
        <Button as="a" href={objStore.raw_url} target="_blank">
          {t("home.preview.download")}
        </Button>
      </HStack>
    </IconName>
  );
};

export default Download;
