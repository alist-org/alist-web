import { Box } from "@hope-ui/solid"
import { Motion } from "@motionone/solid"
import { createEffect, createSignal, on, onCleanup, onMount } from "solid-js"
import { FolderTree, FolderTreeHandler } from "~/components"
import { useRouter } from "~/hooks"
import { objBoxRef } from "./Obj"
import { useLocation } from "@solidjs/router"

export function Sidebar() {
  const { to } = useRouter()
  const location = useLocation()

  const [folderTreeHandler, setFolderTreeHandler] =
    createSignal<FolderTreeHandler>()
  const [sideBarRef, setSideBarRef] = createSignal<HTMLDivElement>()
  const [offsetX, setOffsetX] = createSignal<number | string>(-999)

  const showFullSidebar = () => setOffsetX(0)
  const resetSidebar = () => {
    const $objBox = objBoxRef()
    const $sideBar = sideBarRef()
    if (!$objBox || !$sideBar) return
    if ($sideBar.clientWidth < $objBox.offsetLeft) {
      setOffsetX(0)
    } else {
      const gap = $objBox.offsetLeft > 50 ? 8 : 0
      setOffsetX(`calc(-100% + ${$objBox.offsetLeft}px - 6px - ${gap}px)`)
    }
  }

  onMount(() => {
    const handler = folderTreeHandler()
    handler?.setPath(location.pathname)
    resetSidebar()
    window.addEventListener("resize", resetSidebar)
    onCleanup(() => window.removeEventListener("resize", resetSidebar))
  })

  createEffect(
    on(
      () => location.pathname,
      () => {
        const handler = folderTreeHandler()
        handler?.setPath(location.pathname)
        setTimeout(() => resetSidebar(), 300)
      },
    ),
  )

  return (
    <Box
      as={Motion.div}
      initial={{ x: -999 }}
      animate={{ x: offsetX() }}
      zIndex="$overlay"
      pos="fixed"
      left={3} // width of outline shadow
      top={3}
      h="calc(100vh - 6px)"
      minW={180}
      p="$2"
      overflow="auto"
      shadow="$outline"
      rounded="$lg"
      bgColor="white"
      _dark={{ bgColor: "$neutral3" }}
      onMouseEnter={showFullSidebar}
      onMouseLeave={resetSidebar}
      ref={(el: HTMLDivElement) => setSideBarRef(el)}
    >
      <FolderTree
        autoOpen
        onChange={(path) => to(path)}
        handle={(handler) => setFolderTreeHandler(handler)}
      />
    </Box>
  )
}
