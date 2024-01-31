import { Show, createSignal, onCleanup } from "solid-js"
import { Box } from "@hope-ui/solid"
import { FiArrowUpCircle } from "solid-icons/fi"
import { Motion } from "@motionone/solid"
import { RightIcon } from "./Icon"

export const BackTop = () => {
  const [visible, setVisible] = createSignal(false)

  const handleScroll = () => {
    setVisible(window.scrollY > 100)
  }
  window.addEventListener("scroll", handleScroll, { passive: true })
  onCleanup(() => window.removeEventListener("scroll", handleScroll))

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
