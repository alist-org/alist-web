import { Icon, useColorMode, useColorModeValue } from "@hope-ui/solid"
// import { IoMoonOutline as Moon } from "solid-icons/io";
import { FiSun as Sun } from "solid-icons/fi"
import { FiMoon as Moon } from "solid-icons/fi"

const SwitchColorMode = () => {
  const { toggleColorMode } = useColorMode()
  const icon = useColorModeValue(
    {
      size: "$8",
      component: Moon,
      p: "$0_5",
    },
    {
      size: "$8",
      component: Sun,
      p: "$0_5",
    }
  )
  return (
    <Icon
      cursor="pointer"
      boxSize={icon().size}
      as={icon().component}
      onClick={toggleColorMode}
      p={icon().p}
    />
  )
}
export { SwitchColorMode }
