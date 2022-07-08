import { Icon, useColorMode, useColorModeValue } from "@hope-ui/solid";
import { BsSunFill, BsMoonFill } from "solid-icons/bs";

const SwitchColorMode = () => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(
    {
      size: "$6",
      component: BsMoonFill,
    },
    {
      size: "$8",
      component: BsSunFill,
    }
  );
  return (
    <Icon
      cursor="pointer"
      boxSize={icon().size}
      as={icon().component}
      onClick={toggleColorMode}
    />
  );
};
export { SwitchColorMode };
