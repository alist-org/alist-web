import { useColorMode, useColorModeValue } from "@hope-ui/solid";
import { FaSolidMoon as Moon, FaSolidSun as Sun } from "solid-icons/fa";
import { ToolIcon } from "./Icon";

const SwitchColorMode = () => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(Moon, Sun);
  return <ToolIcon as={icon()} onClick={toggleColorMode} />;
};
export { SwitchColorMode };
