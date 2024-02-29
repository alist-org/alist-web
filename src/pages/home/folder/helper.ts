import { createKeyHold } from "@solid-primitives/keyboard"
import { createEffect, createSignal } from "solid-js"
import { isMac } from "~/utils/compatibility"
import { local } from "~/store"

export function useOpenItemWithCheckbox() {
  const [shouldOpen, setShouldOpen] = createSignal(
    local["open_item_on_checkbox"] === "direct",
  )
  const isAltKeyPressed = createKeyHold("Alt")
  const isMetaKeyPressed = createKeyHold("Meta")
  const isControlKeyPressed = createKeyHold("Control")
  createEffect(() => {
    switch (local["open_item_on_checkbox"]) {
      case "direct": {
        setShouldOpen(true)
        break
      }
      case "with_ctrl": {
        // FYI why should use metaKey on a Mac
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey
        setShouldOpen(isMac ? isMetaKeyPressed() : isControlKeyPressed())
        break
      }
      case "with_alt": {
        setShouldOpen(isAltKeyPressed())
      }
    }
  })
  return shouldOpen
}
