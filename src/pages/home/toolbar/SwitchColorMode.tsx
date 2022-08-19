import { useColorMode, useColorModeValue } from "@hope-ui/solid";
import { IoMoonOutline as Moon } from "solid-icons/io";
import { FiSun as Sun } from "solid-icons/fi";
import { RightIcon } from "./Icon";

const SwitchColorMode = () => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(Moon, Sun);
  return <RightIcon tip="toggle_theme" as={icon()} onClick={toggleColorMode} />;
};
export { SwitchColorMode };
