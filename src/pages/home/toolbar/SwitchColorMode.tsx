import { useColorMode, useColorModeValue } from "@hope-ui/solid";
import { FiSun as Sun } from "solid-icons/fi";
import { FiMoon as Moon } from "solid-icons/fi";
import { RightIcon } from "./Icon";

const SwitchColorMode = () => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(Moon, Sun);
  return <RightIcon tips="toggle_theme" as={icon()} onClick={toggleColorMode} />;
};
export { SwitchColorMode };
