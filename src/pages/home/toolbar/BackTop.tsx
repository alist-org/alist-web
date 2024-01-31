import { Show, createEffect, createSignal, onCleanup } from "solid-js"
import { Box } from "@hope-ui/solid"
import { FiArrowUpCircle } from "solid-icons/fi"
import { Motion } from "@motionone/solid"
import { isMobile } from "~/utils/compatibility"
import { RightIcon } from "./Icon"

export const useScrollListener = (callback: (e?: Event) => void) => {
  createEffect(() => {
    window.addEventListener("scroll", callback, { passive: true })
    onCleanup(() => window.removeEventListener("scroll", callback))
  })
}

export const BackTop = () => {
  if (isMobile) return null

  const [visible, setVisible] = createSignal(false)

  useScrollListener(() => setVisible(window.scrollY > 100))

  return (
    <Show when={visible()}>
      <Box
        as={Motion.div}
        initial={{ x: 999 }}
        animate={{ x: 0 }}
        zIndex="$overlay"
        pos="fixed"
        right="$5"
        top="0"
      >
        <RightIcon
          as={FiArrowUpCircle}
          tips="backtop"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
        />
      </Box>
    </Show>
  )
}
