import { Heading, HStack, Icon, VStack } from "@hope-ui/solid";
import { JSXElement } from "solid-js";
import { useT } from "~/hooks";
import { getIconColor, objStore } from "~/store";
import { getIconByObj } from "~/utils/icon";

export const IconName = (props: { children: JSXElement }) => {
  const t = useT();
  return (
    <VStack py="$6" spacing="$6">
      <Icon
        color={getIconColor()}
        boxSize="$20"
        as={getIconByObj(objStore.obj)}
      />
      <Heading size="lg">{objStore.obj.name}</Heading>
      <HStack spacing="$2">{props.children}</HStack>
    </VStack>
  );
};
