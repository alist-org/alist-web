import { Icon, useColorMode, useColorModeValue } from "@hope-ui/solid";
import { BsSunFill, BsMoonFill } from "solid-icons/bs";

const SwitchColorMode = () => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(BsMoonFill, BsSunFill);
  return (
    <Icon
      cursor="pointer"
      boxSize="$10"
      as={icon()}
      onClick={toggleColorMode}
    />
  );
};
export { SwitchColorMode };
