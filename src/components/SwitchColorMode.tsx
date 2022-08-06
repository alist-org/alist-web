import { Icon, useColorMode, useColorModeValue } from "@hope-ui/solid";
import { FaSolidMoon as Moon, FaSolidSun as Sun } from "solid-icons/fa";

const SwitchColorMode = () => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(
    {
      size: "$8",
      component: Moon,
    },
    {
      size: "$8",
      component: Sun,
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
