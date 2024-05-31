import { Icon, useColorMode, useColorModeValue } from "@hope-ui/solid"
// import { IoMoonOutline as Moon } from "solid-icons/io";
import { FiSun as Sun } from "solid-icons/fi"
import { FiMoon as Moon } from "solid-icons/fi"
import { FiSun as Sun } from "solid-icons/fi";
import { FiMoon as Moon } from "solid-icons/fi";

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
    },
  )
  {/* 刷新按钮移动出来 */ }
  <VStack spacing="$1" class="left-toolbar-in">
    <Show when={isFolder() && (userCan("write") || objStore.write)}>
      <RightIcon
        as={RiSystemRefreshLine}
        tips="refresh"
        onClick={() => {
          refresh(undefined, true);
        }}
      />
    </Show>
  </VStack>

  {/* 夜间白天模式切换,搜下面的那个class关键词就知道这个加那里了 */ }
  <Show
    when={isOpen()}
    fallback={
      <RightIcon
        // 图标已更换
        as={icon().component}
        // tips="白天夜间模式切换"
        onClick={toggleColorMode}
      />
    }
  >
  </Show>

  {/* 以上代码加到这个原有的设置上面即可 */ }
  <Show
    when={isOpen()}
    fallback={
      <RightIcon
        class="toolbar-toggle"
        as={CgMoreO}
        onClick={() => {
          onToggle();
        }}
      />
    }
  >
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
    export {SwitchColorMode}
