import { Icon, useColorMode, useColorModeValue } from "@hope-ui/solid";
import { BsSunFill, BsMoonFill } from "solid-icons/bs";
import { ToolIcon } from "./Icon";

const SwitchColorMode = () => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(BsMoonFill, BsSunFill);
  return <ToolIcon as={icon()} onClick={toggleColorMode} />;
};
export { SwitchColorMode };
