import { Button, Heading, HStack, Icon, VStack } from "@hope-ui/solid";
import { useT } from "~/hooks";
import { getIconColor, objStore } from "~/store";
import { getIconByObj } from "~/utils/icon";
import { ExternalPreview } from "./ExternalPreview";

export const CommonPreview = () => {
  const t = useT();
  return (
    <VStack py="$6" spacing="$6">
      <Icon
        color={getIconColor()}
        boxSize="$20"
        as={getIconByObj(objStore.obj)}
      />
      <Heading size="lg">{objStore.obj.name}</Heading>
      <HStack spacing="$2">
        <Button as="a" href={objStore.raw_url} target="_blank">
          {t("home.preview.download")}
        </Button>
        <ExternalPreview />
      </HStack>
    </VStack>
  );
};
