import { useColorMode, useColorModeValue } from "@hope-ui/solid";
import { FaSolidMoon as Moon, FaSolidSun as Sun } from "solid-icons/fa";
import { RightIcon } from "./Icon";

const SwitchColorMode = () => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(Moon, Sun);
  return <RightIcon as={icon()} onClick={toggleColorMode} />;
};
export { SwitchColorMode };
